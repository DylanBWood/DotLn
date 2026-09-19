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
interface Counter {
  schemaVersion: 1;
  direct: { invocation: string; childrenBefore: number; agent?: string }[];
  children: string[];
  workflows: string[];
}
export interface SubagentObservation {
  count: number | null;
  cap: number | null;
  remaining: number | null;
  countKind: "exact-observed" | "minimum-observed" | "unknown";
  unresolvedAdmissions: number | null;
  unlinkedChildren: number | null;
  uncountedRemainder: "unknown";
  reason?: string;
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
export function readSubagentCap(root: string): number | null {
  let value;
  try {
    value = JSON.parse(
      readFileSync(join(root, "docs/control/budgets.json"), "utf8"),
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
        (v.agent === undefined || id(v.agent)),
    ) ||
    !Array.isArray(value.children) ||
    !value.children.every(id) ||
    !Array.isArray(value.workflows) ||
    !value.workflows.every(id) ||
    new Set(value.direct.map((v: Counter["direct"][number]) => v.invocation))
      .size !== value.direct.length ||
    new Set(value.children).size !== value.children.length
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
  const count = linked.size + unresolved.length + unlinked.length - overlap;
  return {
    count,
    cap,
    remaining: cap === null ? null : Math.max(0, cap - count),
    countKind: overlap ? "minimum-observed" : "exact-observed",
    unresolvedAdmissions: unresolved.length,
    unlinkedChildren: unlinked.length,
    uncountedRemainder: "unknown",
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
    reason,
  };
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
export function subagentSummary(row: SubagentObservation): string {
  return `Subagents: ${row.countKind === "minimum-observed" ? "at least " : ""}${row.count ?? "unknown"}/${row.cap ?? (/^(budgets|invalid)/.test(row.reason ?? "") ? "unknown" : "disabled")}; key docs/control/budgets.json subagentCap; uncounted remainder unknown (agents without attributable hooks; unresolved direct/child overlap ${row.unresolvedAdmissions ?? "unknown"}/${row.unlinkedChildren ?? "unknown"})${row.reason ? `; ${row.reason}` : ""}.`;
}
export function admitSubagentTool(
  root: string,
  directory: string,
  input: SpawnInput,
  spawn: boolean,
): { refusal?: string; advisory?: string; usage: SubagentObservation } {
  let cap: number | null = null;
  try {
    cap = readSubagentCap(root);
    return transaction(directory, input.session_id, (p) => {
      const counter = readCounter(p.counter);
      const refuse = () => {
        save(p.counter, counter);
        return {
          refusal: `DOTLN_SUBAGENT_CAP_REFUSED: count ${observation(counter, cap).countKind === "minimum-observed" ? "at least " : ""}${observation(counter, cap).count}, cap ${cap}; docs/control/budgets.json subagentCap would be exceeded. Batch remaining work in existing agents.`,
          usage: observation(counter, cap),
        };
      };
      const fits = (candidate: Counter) =>
        cap === null || observation(candidate, cap).count! <= cap;
      if (input.agent_id) {
        const id = hash(input.agent_id);
        if (!counter.children.includes(id)) {
          const candidate = { ...counter, children: [...counter.children, id] };
          if (!fits(candidate)) return refuse();
          counter.children.push(id);
        }
      }
      if (spawn) {
        if (!input.tool_use_id) {
          save(p.counter, counter);
          return {
            advisory:
              "DotLn advisory: subagent counter cannot attribute spawn: tool_use_id missing; admitted, uncounted remainder unknown.",
            usage: observation(counter, cap),
          };
        }
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
          if (!known) {
            const candidate = {
              ...counter,
              direct: [
                ...counter.direct,
                { invocation, childrenBefore: counter.children.length },
              ],
            };
            if (!fits(candidate)) return refuse();
            counter.direct.push({
              invocation,
              childrenBefore: counter.children.length,
            });
          }
        }
      }
      save(p.counter, counter);
      const usage = observation(counter, cap);
      return {
        usage,
        ...(usage.countKind === "minimum-observed"
          ? { advisory: `DotLn advisory: ${subagentSummary(usage)}` }
          : {}),
      };
    });
  } catch (error) {
    const reason = cause(error);
    return {
      advisory: `DotLn advisory: subagent cap unavailable: ${reason}; admitted, uncounted remainder unknown (docs/control/budgets.json subagentCap).`,
      usage: unknown(cap, reason),
    };
  }
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
