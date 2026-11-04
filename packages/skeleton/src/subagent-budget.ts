import { createHash, randomUUID } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { configuredControlDirectory } from "./temporary-root-records.mjs";

/** WO-139: session_id is shared by parent/children in the live Claude row.
 * agent_id is stable on child hooks; Agent's result links it to tool_use_id.
 * No ordering, agent type, transcript parsing or guessed parent join is used.
 */
export interface SpawnInput {
  readonly session_id: string;
  readonly agent_id?: string;
  readonly tool_use_id?: string;
  readonly tool_name?: string;
  readonly tool_input?: Record<string, unknown>;
  readonly tool_response?: Record<string, unknown>;
}
/** The hosts a kit-launched worker runs on; `unattributed` is a launch whose
 * command names no host. */
export const KIT_HOSTS = ["claude", "codex", "unattributed"] as const;
export type KitHost = (typeof KIT_HOSTS)[number];
/** A counter counts uses: a launch (a direct spawn, an observed child or a
 * kit-launched worker), a re-task of a known agent, and each kit launch. The
 * re-task and kit rows are optional so a counter written before they existed
 * keeps its counts. */
interface Counter {
  schemaVersion: 1;
  direct: {
    invocation: string;
    childrenBefore: number;
    agent?: string;
    spawner?: string;
  }[];
  children: string[];
  workflows: string[];
  retasks?: { invocation: string; spawner?: string }[];
  kits?: {
    invocation: string;
    host: KitHost;
    uses: number;
    spawner?: string;
  }[];
}
export interface SubagentObservation {
  count: number | null;
  cap: number | null;
  remaining: number | null;
  countKind: "exact-observed" | "minimum-observed" | "unknown";
  unresolvedAdmissions: number | null;
  unlinkedChildren: number | null;
  uncountedRemainder: "unknown";
  /** Launches by host: agents the hooks saw are Claude's; kit launches name
   * their host. Re-tasks are counted apart, and count = launched + re-tasked. */
  launched?: number | null;
  launchedByHost?: Readonly<Record<KitHost, number>> | null;
  retasked?: number | null;
  reason?: string;
}
/** What a non-spawn tool call uses: a re-task of a known agent, or a kit
 * command that launches `uses` workers on `host`. */
export interface UseAdmission {
  readonly retask?: boolean;
  readonly kit?: { readonly uses: number; readonly host: KitHost };
}
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const paths = (directory: string, session: string) => {
  const key = hash(session);
  return {
    counter: join(directory, `${key}.subagents.json`),
    lock: join(directory, `${key}.subagents.lock`),
    started: join(directory, `${key}.subagents.started`),
  };
};
/** The control budgets file the spawn cap reads, relative to the root: the
 * configured control root's, the same file the process and retention readers
 * use. */
export const subagentBudgetsPath = (root: string): string =>
  `${configuredControlDirectory(root)}/budgets.json`;
/** The path a message names; a configuration that cannot be read names the
 * default layout's file. */
const budgetsLabel = (root: string) => {
  try {
    return subagentBudgetsPath(root);
  } catch {
    return "docs/control/budgets.json";
  }
};
export function readSubagentCap(root: string): number | null {
  let value;
  try {
    value = JSON.parse(
      readFileSync(join(root, subagentBudgetsPath(root)), "utf8"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return 20;
    throw new Error("budgets unreadable");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("budgets unreadable (invalid shape)");
  const cap = value.subagentCap === undefined ? 20 : value.subagentCap;
  if (cap !== null && (!Number.isSafeInteger(cap) || cap < 0))
    throw new Error(
      "invalid subagentCap (expected a nonnegative safe integer or null)",
    );
  return cap;
}
function readCounter(path: string): Counter {
  let value;
  try {
    if (!lstatSync(path).isFile()) throw new Error("not a regular file");
    value = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(
      (error as NodeJS.ErrnoException).code === "ENOENT"
        ? "counter missing"
        : "counter unreadable",
    );
  }
  const id = (v: unknown) => typeof v === "string" && /^[a-f0-9]{64}$/.test(v);
  if (
    value?.schemaVersion !== 1 ||
    !Array.isArray(value.direct) ||
    !value.direct.every(
      (v: Counter["direct"][number]) =>
        v &&
        id(v.invocation) &&
        Number.isSafeInteger(v.childrenBefore) &&
        v.childrenBefore >= 0 &&
        v.childrenBefore <= value.children?.length &&
        (v.agent === undefined || id(v.agent)) &&
        (v.spawner === undefined || id(v.spawner)),
    ) ||
    !Array.isArray(value.children) ||
    !value.children.every(id) ||
    !Array.isArray(value.workflows) ||
    !value.workflows.every(id) ||
    new Set(value.direct.map((v: Counter["direct"][number]) => v.invocation))
      .size !== value.direct.length ||
    new Set(value.children).size !== value.children.length ||
    (value.retasks !== undefined &&
      (!Array.isArray(value.retasks) ||
        !value.retasks.every(
          (v: NonNullable<Counter["retasks"]>[number]) =>
            v && id(v.invocation) && (v.spawner === undefined || id(v.spawner)),
        ) ||
        new Set(
          value.retasks.map(
            (v: NonNullable<Counter["retasks"]>[number]) => v.invocation,
          ),
        ).size !== value.retasks.length)) ||
    (value.kits !== undefined &&
      (!Array.isArray(value.kits) ||
        !value.kits.every(
          (v: NonNullable<Counter["kits"]>[number]) =>
            v &&
            id(v.invocation) &&
            (KIT_HOSTS as readonly string[]).includes(v.host) &&
            Number.isSafeInteger(v.uses) &&
            v.uses >= 1 &&
            (v.spawner === undefined || id(v.spawner)),
        ) ||
        new Set(
          value.kits.map(
            (v: NonNullable<Counter["kits"]>[number]) => v.invocation,
          ),
        ).size !== value.kits.length))
  )
    throw new Error("counter unreadable (invalid shape)");
  return value;
}
function save(path: string, counter: Counter) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temporary, JSON.stringify(counter) + "\n", { mode: 0o600 });
  renameSync(temporary, path);
}
function transaction<T>(
  directory: string,
  session: string,
  run: (p: ReturnType<typeof paths>) => T,
): T {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const p = paths(directory, session);
  let locked = false;
  for (let i = 0; i < 50; i++) {
    try {
      mkdirSync(p.lock, { mode: 0o700 });
      locked = true;
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST")
        throw new Error("counter lock unreadable");
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
  if (!locked) throw new Error("counter lock busy or abandoned");
  try {
    return run(p);
  } finally {
    rmdirSync(p.lock);
  }
}
export function initializeSubagentCounter(
  directory: string,
  session: string,
): string | null {
  try {
    transaction(directory, session, (p) => {
      if (lstatSync(p.started, { throwIfNoEntry: false })) {
        readCounter(p.counter);
        return;
      }
      // A resumed hook must preserve existing counts, including pre-marker state.
      if (lstatSync(p.counter, { throwIfNoEntry: false }))
        readCounter(p.counter);
      else
        save(p.counter, {
          schemaVersion: 1,
          direct: [],
          children: [],
          workflows: [],
        });
      writeFileSync(p.started, "initialized\n", { flag: "wx", mode: 0o600 });
    });
    return null;
  } catch (error) {
    return cause(error);
  }
}
const cause = (error: unknown) =>
  error instanceof Error &&
  /^(counter|budgets|invalid subagentCap)/.test(error.message)
    ? error.message
    : "counter storage unavailable";
function observation(
  counter: Counter,
  cap: number | null,
): SubagentObservation {
  const linked = new Set(
    counter.direct.flatMap((v) => (v.agent ? [v.agent] : [])),
  );
  const unresolved = counter.direct.filter((v) => !v.agent);
  const unlinked = counter.children.flatMap((id, index) =>
    linked.has(id) ? [] : [index],
  );
  const available = [...unlinked];
  let overlap = 0;
  // A child observed before a spawn cannot be its result. For later children,
  // retain the largest possible overlap without assigning any guessed identity.
  for (const admission of [...unresolved].sort(
    (a, b) => b.childrenBefore - a.childrenBefore,
  )) {
    if (
      available.length &&
      available[available.length - 1]! >= admission.childrenBefore
    ) {
      available.pop();
      overlap++;
    }
  }
  const agents = linked.size + unresolved.length + unlinked.length - overlap;
  const kits = (host: KitHost) =>
    (counter.kits ?? [])
      .filter((row) => row.host === host)
      .reduce((sum, row) => sum + row.uses, 0);
  const launchedByHost = {
    claude: agents + kits("claude"),
    codex: kits("codex"),
    unattributed: kits("unattributed"),
  };
  const launched =
    launchedByHost.claude + launchedByHost.codex + launchedByHost.unattributed;
  const retasked = (counter.retasks ?? []).length;
  const count = launched + retasked;
  return {
    count,
    cap,
    remaining: cap === null ? null : Math.max(0, cap - count),
    countKind: overlap ? "minimum-observed" : "exact-observed",
    unresolvedAdmissions: unresolved.length,
    unlinkedChildren: unlinked.length,
    uncountedRemainder: "unknown",
    launched,
    launchedByHost,
    retasked,
  };
}
function unknown(cap: number | null, reason: string): SubagentObservation {
  return {
    count: null,
    cap,
    remaining: null,
    countKind: "unknown",
    unresolvedAdmissions: null,
    unlinkedChildren: null,
    uncountedRemainder: "unknown",
    launched: null,
    launchedByHost: null,
    retasked: null,
    reason,
  };
}
const capLabel = (row: SubagentObservation) =>
  row.cap ??
  (/^(budgets|invalid)/.test(row.reason ?? "") ? "unknown" : "disabled");
/** One line for `harness usage`: every use the counter saw, by kind and host,
 * against the cap. */
export function workersLine(row: SubagentObservation): string {
  if (row.count === null)
    return `workers: unknown${row.reason ? ` (${row.reason})` : ""}; cap ${capLabel(row)}`;
  const minimum = row.countKind === "minimum-observed" ? "at least " : "";
  const hosts = row.launchedByHost;
  return `workers: launched ${minimum}${row.launched ?? row.count} (claude ${hosts?.claude ?? "unknown"}, codex ${hosts?.codex ?? "unknown"}${hosts?.unattributed ? `, unattributed ${hosts.unattributed}` : ""}), re-tasked ${row.retasked ?? 0}, cap ${capLabel(row)}, remaining ${row.remaining ?? (row.cap === null ? "unlimited" : "unknown")}`;
}
export function subagentUsage(
  root: string,
  directory: string,
  session: string,
  hashed = false,
): SubagentObservation {
  let cap: number | null = null;
  try {
    cap = readSubagentCap(root);
    return observation(
      readCounter(
        hashed
          ? join(directory, `${session}.subagents.json`)
          : paths(directory, session).counter,
      ),
      cap,
    );
  } catch (error) {
    return unknown(cap, cause(error));
  }
}
export function subagentSummary(
  row: SubagentObservation,
  root?: string,
): string {
  const hosts = row.launchedByHost;
  const breakdown =
    row.count === null || !hosts
      ? ""
      : ` uses (launched ${row.launched}: claude ${hosts.claude}, codex ${hosts.codex}${hosts.unattributed ? `, unattributed ${hosts.unattributed}` : ""}; re-tasked ${row.retasked ?? 0})`;
  return `Subagents: ${row.countKind === "minimum-observed" ? "at least " : ""}${row.count ?? "unknown"}/${capLabel(row)}${breakdown}; key ${root ? budgetsLabel(root) : "docs/control/budgets.json"} subagentCap; uncounted remainder unknown (agents without attributable hooks; unresolved direct/child overlap ${row.unresolvedAdmissions ?? "unknown"}/${row.unlinkedChildren ?? "unknown"})${row.reason ? `; ${row.reason}` : ""}.`;
}
export function admitSubagentTool(
  root: string,
  directory: string,
  input: SpawnInput,
  spawn: boolean,
  options: {
    cap?: number | null;
    spawnerCap?: number | null;
    spawner?: string;
  } & UseAdmission = {},
): { refusal?: string; advisory?: string; usage: SubagentObservation } {
  let cap: number | null = null;
  try {
    cap = options.cap === undefined ? readSubagentCap(root) : options.cap;
    return transaction(directory, input.session_id, (p) => {
      const counter = readCounter(p.counter);
      const refuse = () => {
        save(p.counter, counter);
        return {
          refusal: `DOTLN_SUBAGENT_CAP_REFUSED: count ${observation(counter, cap).countKind === "minimum-observed" ? "at least " : ""}${observation(counter, cap).count}, cap ${cap}; ${budgetsLabel(root)} subagentCap would be exceeded. Every launch, re-task and kit launch counts one use; batch the remaining work into fewer uses.`,
          usage: observation(counter, cap),
        };
      };
      const spawner = options.spawner ? hash(options.spawner) : undefined;
      // A driven spawner's own uses: its spawns, its re-tasks and its kit
      // launches, so no path lets one phase worker pass its cap.
      const spawnerUses = (candidate: Counter) =>
        candidate.direct.filter((row) => row.spawner === spawner).length +
        (candidate.retasks ?? []).filter((row) => row.spawner === spawner)
          .length +
        (candidate.kits ?? [])
          .filter((row) => row.spawner === spawner)
          .reduce((sum, row) => sum + row.uses, 0);
      const fits = (candidate: Counter) =>
        (cap === null || observation(candidate, cap).count! <= cap) &&
        (options.spawnerCap == null ||
          spawnerUses(candidate) <= options.spawnerCap);
      const unattributed = (what: string) => {
        save(p.counter, counter);
        return {
          advisory: `DotLn advisory: subagent counter cannot attribute ${what}: tool_use_id missing; admitted, uncounted remainder unknown.`,
          usage: observation(counter, cap),
        };
      };
      // A re-task hands an existing agent more work. It is charged once per
      // tool call, so a repeated hook for the same call costs nothing.
      const retask = (invocation: string) => {
        if ((counter.retasks ?? []).some((v) => v.invocation === invocation))
          return true;
        const row = { invocation, ...(spawner ? { spawner } : {}) };
        const candidate = {
          ...counter,
          retasks: [...(counter.retasks ?? []), row],
        };
        if (!fits(candidate)) return false;
        counter.retasks = candidate.retasks;
        return true;
      };
      if (input.agent_id) {
        const id = hash(input.agent_id);
        if (!counter.children.includes(id)) {
          const candidate = { ...counter, children: [...counter.children, id] };
          if (!fits(candidate)) return refuse();
          counter.children.push(id);
        }
      }
      if (spawn) {
        if (!input.tool_use_id) return unattributed("spawn");
        const invocation = hash(input.tool_use_id);
        if (input.tool_name === "Workflow") {
          if (!counter.workflows.includes(invocation)) {
            if (cap !== null && observation(counter, cap).count! >= cap)
              return refuse();
            counter.workflows.push(invocation);
          }
        } else if (!counter.direct.some((v) => v.invocation === invocation)) {
          const resumed =
            typeof input.tool_input?.resume === "string"
              ? hash(input.tool_input.resume)
              : undefined;
          const known =
            resumed &&
            (counter.children.includes(resumed) ||
              counter.direct.some((v) => v.agent === resumed));
          if (known) {
            if (!retask(invocation)) return refuse();
          } else {
            const candidate = {
              ...counter,
              direct: [
                ...counter.direct,
                {
                  invocation,
                  childrenBefore: counter.children.length,
                  ...(spawner ? { spawner } : {}),
                },
              ],
            };
            if (!fits(candidate)) return refuse();
            counter.direct.push({
              invocation,
              childrenBefore: counter.children.length,
              ...(spawner ? { spawner } : {}),
            });
          }
        }
      }
      if (options.retask) {
        if (!input.tool_use_id) return unattributed("re-task");
        if (!retask(hash(input.tool_use_id))) return refuse();
      }
      if (options.kit) {
        if (!input.tool_use_id) return unattributed("kit launch");
        const invocation = hash(input.tool_use_id);
        if (!(counter.kits ?? []).some((v) => v.invocation === invocation)) {
          const row = {
            invocation,
            host: options.kit.host,
            uses: options.kit.uses,
            ...(spawner ? { spawner } : {}),
          };
          const candidate = {
            ...counter,
            kits: [...(counter.kits ?? []), row],
          };
          if (!fits(candidate)) return refuse();
          counter.kits = candidate.kits;
        }
      }
      save(p.counter, counter);
      const usage = observation(counter, cap);
      return {
        usage,
        ...(usage.countKind === "minimum-observed"
          ? { advisory: `DotLn advisory: ${subagentSummary(usage, root)}` }
          : {}),
      };
    });
  } catch (error) {
    const reason = cause(error);
    return {
      advisory: `DotLn advisory: subagent cap unavailable: ${reason}; admitted, uncounted remainder unknown (${budgetsLabel(root)} subagentCap).`,
      usage: unknown(cap, reason),
    };
  }
}

export interface DrivenWorkerContext {
  schemaVersion: 1;
  root: string;
  directory: string;
  session: string;
  worker: string;
  role: string;
  workOrder: string;
  cap: number | null;
  ceiling: number | null;
}
export function drivenWorkerContext(): DrivenWorkerContext | null {
  const file = process.env.DOTLN_DRIVEN_WORKER;
  if (!file) return null;
  const value = JSON.parse(readFileSync(file, "utf8"));
  const limit = (number: unknown) =>
    number === null ||
    (Number.isSafeInteger(number) && (number as number) >= 0);
  if (
    value?.schemaVersion !== 1 ||
    !["root", "directory", "session", "worker", "role", "workOrder"].every(
      (key) => typeof value[key] === "string" && value[key],
    ) ||
    !/^WO-\d{3}$/.test(value.workOrder) ||
    !limit(value.cap) ||
    !limit(value.ceiling)
  )
    throw new Error("invalid driven-worker context");
  return value;
}

export function drivenSubagentUsage(worker?: string) {
  const context = drivenWorkerContext();
  if (!context) return null;
  try {
    const counter = readCounter(
      paths(context.directory, context.session).counter,
    );
    return {
      ...observation(counter, context.ceiling),
      perSpawnerCap: context.cap,
      spawnsByWorker: counter.direct.filter(
        (row) => row.spawner === hash(worker ?? context.worker),
      ).length,
      source: "shared-hook-counter",
    };
  } catch (error) {
    return {
      ...unknown(context.ceiling, cause(error)),
      perSpawnerCap: context.cap,
      spawnsByWorker: null,
      source: "shared-hook-counter-unavailable",
    };
  }
}

// Separate root sessions keep their local counters. Their hooks also reserve
// against this one shared counter, so moving phase work cannot reset a drive.
export function admitDrivenTool(
  input: SpawnInput,
  spawn: boolean,
  use: UseAdmission = {},
) {
  const context = drivenWorkerContext();
  if (!context) return undefined;
  const mapped = {
    ...input,
    session_id: context.session,
    agent_id: input.agent_id
      ? `${context.worker}:${input.agent_id}`
      : context.worker,
    ...(input.tool_use_id
      ? { tool_use_id: `${context.worker}:${input.tool_use_id}` }
      : {}),
    ...(typeof input.tool_input?.resume === "string"
      ? {
          tool_input: {
            ...input.tool_input,
            resume: `${context.worker}:${input.tool_input.resume}`,
          },
        }
      : {}),
  };
  const result = admitSubagentTool(
    context.root,
    context.directory,
    mapped,
    spawn,
    {
      cap: context.ceiling,
      spawnerCap: context.cap,
      spawner: mapped.agent_id,
      ...use,
    },
  );
  return result.refusal
    ? {
        ...result,
        refusal: `DOTLN_DRIVEN_BUDGET_REFUSED: spawner cap ${context.cap}, drivenSessionCeiling ${context.ceiling}; ${result.refusal}`,
      }
    : result;
}
export function linkDrivenResult(input: SpawnInput): void {
  const context = drivenWorkerContext();
  if (
    !context ||
    !input.tool_use_id ||
    typeof input.tool_response?.agentId !== "string"
  )
    return;
  linkSubagentResult(context.directory, {
    ...input,
    session_id: context.session,
    tool_use_id: `${context.worker}:${input.tool_use_id}`,
    tool_response: {
      agentId: `${context.worker}:${input.tool_response.agentId}`,
    },
  });
}
/** PostToolUse's observed join is exact; it never guesses from arrival order. */
export function linkSubagentResult(directory: string, input: SpawnInput): void {
  if (!input.tool_use_id || typeof input.tool_response?.agentId !== "string")
    return;
  try {
    transaction(directory, input.session_id, (p) => {
      const counter = readCounter(p.counter);
      const direct = counter.direct.find(
        (v) => v.invocation === hash(input.tool_use_id!),
      );
      if (!direct) return;
      direct.agent = hash(input.tool_response!.agentId as string);
      save(p.counter, counter);
    });
  } catch {
    /* Usage/next admission exposes missing state; post-hooks cannot deny. */
  }
}
