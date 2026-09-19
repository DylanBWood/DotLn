import { observedSpawnSync as spawnSync } from "./gate-deadlines.mjs";
import { withWriterRegistration } from "./writer-teardown.mjs";
import { sourceChangeCommandEffect } from "./source-change-command.js";
import { createHash, randomBytes } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";
import { text as streamText } from "node:stream/consumers";
import type { DecodeResult } from "@dotln/kernel";
import {
  applyFeedbackCorrection,
  compileFeedbackUnits,
  COMPILER_PACKAGE_VERSION,
  fnv1a64,
  showHarnessAdvisory,
  type AuthorityEnvelope,
  type CompiledFeedback,
  type CorrectionState,
  type HarnessEvent,
} from "@dotln/compiler";
import { harnessAuthorization } from "./reactor.js";
import { personalFeedback } from "./loadouts/feedback.js";
import {
  HarnessCommandRefused,
  harnessToolEffects,
  invocationEffects,
  shellWritePaths,
  shellWriteTargets,
  commitMessageInputs,
} from "./harness-command.js";
import {
  activeGateRuns,
  beginGateRun,
  gateInputPath,
  prospectiveRealpath,
  gateTreeHash,
  findGateCheck,
  recordGateChecks,
  gateCodeIdentity,
} from "./gate-evidence.mjs";
import {
  collectSessionUsage,
  usageObservation,
  recordUsageObservation,
  usageSessionKey,
} from "./usage-observation.mjs";
import {
  FeedbackRefused,
  feedbackContentHash,
  feedbackWriterFacts,
  type FeedbackBoundaryRequest,
  type feedbackBoundary,
} from "./feedback-boundary.js";

import { HARNESS_HOST_VERSION } from "./version.js";
import {
  admitSubagentTool,
  initializeSubagentCounter,
  linkSubagentResult,
  subagentSummary,
  subagentUsage,
} from "./subagent-budget.js";
import {
  observationBoundary,
  observeBackgroundTool,
  observeTypedCorrection,
  namedJudgmentUnits,
  type ObservationScope,
} from "./observed-facts.js";
export { HARNESS_HOST_VERSION } from "./version.js";
export interface HarnessInput {
  readonly hook_event_name: HarnessEvent | "SessionStart";
  readonly cwd: string;
  readonly transcript_path?: string;
  readonly session_id: string;
  readonly agent_id?: string;
  readonly tool_name?: string;
  readonly tool_use_id?: string;
  readonly tool_input?: Record<string, unknown>;
  readonly tool_response?: Record<string, unknown>;
  readonly prompt?: string;
  readonly effort?: { readonly level?: string };
  readonly harness_version?: string;
  /** Claude sets this when it re-enters Stop because a Stop hook refused. */
  readonly stop_hook_active?: boolean;
}

/** Decode declared host fields; unconsumed native metadata is forward-compatible. */
export function decodeHarnessInput(
  value: unknown,
  expectedEvent?: HarnessEvent | "SessionStart",
): DecodeResult<HarnessInput> {
  try {
    return decodeHarnessRecord(value, expectedEvent);
  } catch {
    return {
      ok: false,
      code: "UNREADABLE_INPUT",
      path: "$",
      message: "hook input properties are unreadable",
    };
  }
}

function decodeHarnessRecord(
  value: unknown,
  expectedEvent?: HarnessEvent | "SessionStart",
): DecodeResult<HarnessInput> {
  const fail = (
    code: string,
    path: string,
    message: string,
  ): DecodeResult<never> => ({ ok: false, code, path, message });
  const object = (input: unknown): input is Record<string, unknown> =>
    input !== null &&
    typeof input === "object" &&
    !Array.isArray(input) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(input));
  if (!object(value))
    return fail("EXPECTED_OBJECT", "$", "expected a hook input object");
  for (const key of [
    "hook_event_name",
    "cwd",
    "session_id",
    "agent_id",
    "tool_name",
    "tool_use_id",
    "transcript_path",
    "harness_version",
    "prompt",
    "tool_input",
    "tool_response",
    "effort",
    "stop_hook_active",
  ]) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && !("value" in descriptor))
      return fail("EXPECTED_DATA_FIELD", `$.${key}`, "expected a data field");
  }
  for (const key of ["hook_event_name", "cwd", "session_id"])
    if (!Object.hasOwn(value, key))
      return fail("MISSING_FIELD", `$.${key}`, "missing required field");
  for (const key of [
    "hook_event_name",
    "cwd",
    "session_id",
    "agent_id",
    "tool_name",
    "tool_use_id",
    "transcript_path",
    "harness_version",
    "prompt",
  ])
    if (key in value && typeof value[key] !== "string")
      return fail("EXPECTED_STRING", `$.${key}`, "expected a string");
  if (
    ![
      "PreToolUse",
      "PostToolUse",
      "Stop",
      "UserPromptSubmit",
      "SessionStart",
    ].includes(value.hook_event_name as string)
  )
    return fail("UNKNOWN_EVENT", "$.hook_event_name", "unsupported hook event");
  if (expectedEvent !== undefined && value.hook_event_name !== expectedEvent)
    return fail(
      "EVENT_MISMATCH",
      "$.hook_event_name",
      `expected ${expectedEvent}`,
    );
  if (value.session_id === "")
    return fail(
      "EMPTY_SESSION",
      "$.session_id",
      "expected a nonempty session id",
    );
  for (const key of ["tool_input", "tool_response", "effort"])
    if (key in value && !object(value[key]))
      return fail("EXPECTED_OBJECT", `$.${key}`, "expected an object");
  if (object(value.effort)) {
    const descriptor = Object.getOwnPropertyDescriptor(value.effort, "level");
    if (descriptor && !("value" in descriptor))
      return fail(
        "EXPECTED_DATA_FIELD",
        "$.effort.level",
        "expected a data field",
      );
  }
  if (
    object(value.effort) &&
    "level" in value.effort &&
    !["low", "medium", "high", "xhigh", "max"].includes(
      value.effort.level as string,
    )
  )
    return fail(
      "INVALID_EFFORT",
      "$.effort.level",
      "expected low, medium, high, xhigh or max",
    );
  if (
    "stop_hook_active" in value &&
    typeof value.stop_hook_active !== "boolean"
  )
    return fail("EXPECTED_BOOLEAN", "$.stop_hook_active", "expected a boolean");
  return { ok: true, value: value as unknown as HarnessInput };
}
export interface HarnessCheck {
  readonly checkId: string;
  readonly subject: string;
  readonly exitCode: number;
  readonly executed: boolean;
  readonly evidenceRef: string;
  readonly treeHash?: string;
  readonly codeIdentity?: string;
  readonly durationMs?: number;
}
export interface HarnessSession {
  role?: string;
  intent?: string;
  expectedEvent?: string;
  startingEventCount: number;
  startingRevision?: string;
  reads: { path: string; hash: string; evidenceRef: string }[];
  byteReads?: HarnessByteRead[];
  correction?: CorrectionState;
  authoredPaths?: string[];
  beforeOutputs?: Record<string, string>;
  remainingWork?: string[];
  startedAt?: string;
  usageSessionKey?: string;
  versionWarning?: string;
  versionObservation?: { value: string; channel: string };
  workOrder?: string;
}
interface HarnessByteRead {
  readonly path: string;
  readonly hash: string;
  readonly startByte: number;
  readonly endByte: number;
}
interface HookConfig {
  readonly compilerPackageVersion: string;
  readonly runtime: {
    readonly skeletonVersion: string;
    readonly boundaryContract: "feedback-v1";
    readonly snapshot?: string;
    readonly targetId?: string;
    readonly files?: readonly {
      readonly path: string;
      readonly hash: string;
    }[];
  };
  readonly event: HarnessEvent | "SessionStart";
  readonly kind: "feedback" | "permission" | "observe" | "session" | "finish";
  readonly policy?: CompiledFeedback;
  readonly envelope?: AuthorityEnvelope;
  readonly correctionToken?: string | null;
  readonly roles?: readonly {
    readonly name: string;
    readonly facetId: string;
    readonly intents: readonly string[];
  }[];
  readonly instructionFile?: string;
  readonly tools?: Readonly<
    Record<
      string,
      "read" | "write" | "shell" | "spawn" | "stop" | "interaction"
    >
  >;
}
interface ControlView {
  readonly workOrder: string | null;
  readonly workOrderPath: string | null;
  readonly phase: string;
  readonly latestVerdict: string | null;
  readonly legalNextActions?: readonly string[];
}
interface ReadRange {
  readonly path: string;
  readonly startLine: number;
  readonly endLine: number;
}
interface HarnessReadScope {
  readonly role: string;
  readonly skill: string;
  readonly reads: readonly ReadRange[];
  readonly commands: readonly string[];
  readonly mode?: "enforce" | "observe";
}
/** The harness process that owns a session's reservation, as the hook observed it. */
export interface HarnessProcess {
  readonly pid: number;
  readonly startedAt?: string;
  readonly source: "CLAUDE_PID" | "ancestor" | "parent";
}
export interface HarnessWriter {
  readonly actorId: string;
  readonly worktree: string;
  readonly owner?: HarnessProcess;
  readonly reservedAt?: string;
  /** Set when the owning session found its recorded owner dead: that identity never reclaims. */
  readonly liveness?: "unavailable";
  /** The instance this one replaced when its own session recorded a new fact under a new name. */
  readonly supersedes?: string;
  readonly reclaimed?: {
    readonly actorId: string;
    readonly owner?: HarnessProcess;
    readonly at: string;
  };
}
export type HarnessWriterView =
  | { readonly contract: "harness-writer-v1"; readonly reserved: false }
  | {
      readonly contract: "harness-writer-v1";
      readonly reserved: true;
      readonly actorId: string;
      readonly owner?: HarnessProcess;
      readonly reservedAt?: string;
      readonly liveness?: "unavailable";
      readonly reclaimed?: HarnessWriter["reclaimed"];
      readonly alive: boolean | "unknown";
    };
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const physicalLines = (text: string) =>
  text.match(/[^\n]*\n|[^\n]+$/g)?.length ?? 0;
const lineParts = (text: string) => text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
const targetState = new AsyncLocalStorage<{
  root: string;
  directory: string;
}>();
export const harnessStateDirectory = (root: string) => {
  const target = targetState.getStore();
  return target?.root === root
    ? target.directory
    : join(root, "docs/control/local/harness");
};
const sessionKey = (input: HarnessInput) =>
  digest(input.session_id ?? "unknown");
const statePath = (root: string, input: HarnessInput) =>
  join(harnessStateDirectory(root), `${sessionKey(input)}.json`);
const git = (root: string, args: readonly string[], acceptFailure = false) => {
  const result = spawnSync("git", [...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 10_000,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0 && !acceptFailure)
    throw new Error("Git host observation unavailable");
  return result.stdout ?? "";
};
export function harnessRoot(cwd: string): string {
  const physical = realpathSync(cwd);
  const root = realpathSync(
    git(physical, ["rev-parse", "--show-toplevel"]).trim(),
  );
  if (physical !== root)
    throw new Error("Harness requires the verified worktree root");
  return root;
}
const contained = (root: string, candidate: string) => {
  const path = resolve(root, candidate);
  if (
    !path.startsWith(`${root}${sep}`) ||
    /(?:^|\/)\.git(?:\/|$)/.test(relative(root, path))
  )
    throw new HarnessObserverInput("Path outside the worktree surface");
  let parent = existsSync(path) ? path : dirname(path);
  while (!existsSync(parent)) parent = dirname(parent);
  const physical = realpathSync(parent);
  if (physical !== root && !physical.startsWith(`${root}${sep}`))
    throw new HarnessObserverInput("Path resolves outside the worktree");
  return path;
};
class HarnessStateUnreadable extends Error {}
/** The observer could not interpret the supplied read/write metadata. */
class HarnessObserverInput extends Error {}
const readJson = <T>(path: string, fallback: T, sessionState = false): T => {
  try {
    if (!existsSync(path)) return fallback;
    if (!lstatSync(path).isFile())
      throw new Error("Host record is not a regular file");
    for (let attempt = 0; ; attempt++) {
      try {
        return JSON.parse(readFileSync(path, "utf8")) as T;
      } catch (error) {
        // One retry also tolerates a legacy writer's truncate/write window.
        // Persistent damage remains a refusal, never a fresh empty session.
        if (attempt !== 0 || !(error instanceof SyntaxError)) throw error;
      }
    }
  } catch (error) {
    if (sessionState)
      throw new HarnessStateUnreadable("session state unreadable");
    throw error;
  }
};
const writeJson = (path: string, value: unknown) => {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  if (existsSync(path) && !lstatSync(path).isFile())
    throw new Error("Host record is not a regular file");
  const temporary = `${path}.${process.pid}.${randomBytes(12).toString("hex")}.tmp`;
  try {
    writeFileSync(temporary, JSON.stringify(value) + "\n", {
      mode: 0o600,
      flag: "wx",
    });
    renameSync(temporary, path);
  } finally {
    unlinkIfPresent(temporary);
  }
};
const localEvents = (
  root: string,
  order: string | null,
): { type: string }[] => {
  const paths = [
    join(root, "docs/control/resume.jsonl"),
    ...(order ? [join(root, `docs/control/orders/${order}.jsonl`)] : []),
  ];
  return paths.flatMap((path) =>
    existsSync(path)
      ? readFileSync(path, "utf8")
          .split("\n")
          .filter(Boolean)
          .map(
            (line) => JSON.parse(line) as { type: string; workOrderId: string },
          )
          .filter((event) => event.workOrderId === order)
      : [],
  );
};
export function harnessControl(root: string): ControlView {
  const result = spawnSync(
    process.execPath,
    [join(root, "scripts/resume.mjs"), "status", "--json"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
      maxBuffer: 4 * 1024 * 1024,
    },
  );
  if (result.status !== 0)
    throw new Error("Canonical lifecycle observation unavailable");
  return JSON.parse(result.stdout) as ControlView;
}
const initialSession = (): HarnessSession => ({
  startingEventCount: 0,
  reads: [],
});
/**
 * The operator's phrase is the dispatch. Claude's session hook records the
 * matching lifecycle transition itself, so no role can begin work without it:
 * a legal action runs and its briefing is delivered, an already-recorded one
 * passes with the same briefing projected read-only from the current phase,
 * and anything else refuses with the lifecycle's own legal actions. A
 * lifecycle that exposes no legal actions (a fixture stub or an older status
 * projection) leaves the command to the role, as before.
 */
const phraseDispatches: Readonly<
  Record<string, { readonly action: string; readonly active?: string }>
> = {
  "resume: next": { action: "next" },
  "resume: fix": { action: "fix", active: "repairing" },
  "resume: verify": { action: "verify", active: "verifying" },
  "resume: final review": { action: "final-review", active: "final-review" },
};
/**
 * A prompt dispatch stands in for the ordinary `npm run resume -- <action>`
 * tool invocation and is admitted exactly as that command would be: the same
 * active-gate refusal and the same compiled writer-isolation unit judge the
 * equivalent invocation before the lifecycle runs, so a live evidence gate or
 * another session's live reservation refuses the dispatch before any event,
 * checkpoint or control projection can change. `next` remains the metadata
 * command it is for the tool path, and the reservation an admitted dispatch
 * takes is the one the session's first write would take.
 */
const dispatchInvocation = (
  input: HarnessInput,
  action: string,
): HarnessInput => ({
  ...input,
  hook_event_name: "PreToolUse",
  tool_name: "Bash",
  tool_input: { command: `npm run resume -- ${action}` },
});
/**
 * The dispatch is judged by the writer unit the installed writer hook
 * carries. The host compiles that unit from the loadout inventory it ships
 * with and refuses when the inventory's compiled policy is not the one the
 * emitted bundle's manifest recorded, so an inventory that drifted from the
 * bundle cannot admit a dispatch. A bundle without the unit has no writer
 * boundary on the tool path either, so the dispatch takes none.
 */
export function dispatchAdmissionPolicy(root: string): CompiledFeedback | null {
  const program = personalFeedback();
  const manifest = readJson<{
    profiles?: readonly { feedbackPolicyHash?: string }[];
  } | null>(contained(root, ".claude/harness-manifest.json"), null);
  const recorded = manifest?.profiles?.map(
    (profile) => profile.feedbackPolicyHash,
  );
  if (!recorded?.length || recorded.some((hash) => hash !== program.policyHash))
    throw new Error(
      "Installed harness manifest does not record this feedback policy",
    );
  const units = program.units.filter(
    (unit) =>
      unit.trigger === "writer-isolation" && unit.mechanism.kind !== "prose",
  );
  return units.length ? compileFeedbackUnits(units) : null;
}
/** Support names the briefing declares equipped, for the operator's terminal receipt. */
const equippedSupports = (briefing: string): readonly string[] => [
  ...new Set(
    [...briefing.matchAll(/^(.+?) is equipped\b/gm)].map((match) => match[1]!),
  ),
];
/**
 * The briefing reaches only the model; the receipt is the operator's terminal
 * evidence that it was delivered. A recorded dispatch and a resumed one share
 * this delivery, so neither path can omit the supports or the intent line.
 */
const briefingDelivery = (
  note: string,
  receipt: string,
  briefing: string,
): { context: string; receipt: string } => {
  const supports = equippedSupports(briefing);
  return {
    context: `${note}${supports.includes("Intent to Act") ? " Open the reply with one line that begins 'I intend to' and names the concrete initial action, before any tool call." : ""}\n${briefing}`,
    receipt: `${receipt}; equipped supports: ${supports.join(", ") || "none named by the briefing"}.`,
  };
};
/** Read-only projection of the recorded dispatch's briefing for the current phase. */
const recordedBriefing = (root: string) =>
  spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), "briefing"], {
    cwd: root,
    encoding: "utf8",
    timeout: 10_000,
    maxBuffer: 4 * 1024 * 1024,
  });
function recordDispatch(
  root: string,
  input: HarnessInput,
  control: ControlView,
  intent: string,
  role: string,
  tools: HookConfig["tools"],
  session: HarnessSession,
  boundary: typeof feedbackBoundary,
):
  | { context: string; receipt: string; control: ControlView }
  | { refusal: string }
  | null {
  const dispatch = phraseDispatches[intent];
  if (!dispatch || !Array.isArray(control.legalNextActions)) return null;
  const legal = control.legalNextActions;
  const order = control.workOrder ?? "the selected order";
  if (legal.includes(dispatch.action)) {
    const invocation = dispatchInvocation(input, dispatch.action);
    const gate = activeGateWriteRefusal(invocation, root, tools, session);
    if (gate) {
      record(root, input, {
        dispatch: {
          action: dispatch.action,
          recorded: false,
          refused: "active-gate",
        },
      });
      return { refusal: gate };
    }
    const policy = dispatchAdmissionPolicy(root);
    const facts = policy
      ? writerIsolationFacts(root, invocation, session, input)
      : null;
    const lifecycle = () =>
      spawnSync(
        process.execPath,
        [join(root, "scripts/resume.mjs"), dispatch.action],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 12_000,
          maxBuffer: 4 * 1024 * 1024,
        },
      );
    let run: ReturnType<typeof lifecycle>;
    try {
      run = policy && facts ? boundary(policy, facts, lifecycle) : lifecycle();
    } catch (error) {
      if (!(error instanceof FeedbackRefused) || !facts) throw error;
      record(root, input, {
        dispatch: {
          action: dispatch.action,
          recorded: false,
          refused: "writer-isolation",
        },
      });
      return {
        refusal: `DOTLN_HARNESS_REFUSED: ${feedbackRefusalReason(error, [facts], root)}`,
      };
    }
    const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
    record(root, input, {
      dispatch: { action: dispatch.action, recorded: run.status === 0 },
    });
    if (run.status !== 0)
      return {
        refusal: `DOTLN_HARNESS_REFUSED: dispatch ${dispatch.action} failed: ${output.slice(0, 600) || run.error?.message || "lifecycle unavailable"}`,
      };
    return {
      ...briefingDelivery(
        `Dispatch recorded by the harness: npm run resume -- ${dispatch.action}. Never repeat it.`,
        `DotLn: recorded npm run resume -- ${dispatch.action} for ${order} (${role})`,
        output,
      ),
      control: harnessControl(root),
    };
  }
  if (dispatch.active && control.phase === dispatch.active) {
    // A resumed session receives the recorded dispatch's briefing from the
    // lifecycle's read-only projection: no event, checkpoint or reservation.
    const run = recordedBriefing(root);
    const briefing = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
    record(root, input, {
      dispatch: {
        action: dispatch.action,
        recorded: false,
        existing: true,
        briefed: run.status === 0,
      },
    });
    if (run.status !== 0)
      return {
        refusal: `DOTLN_HARNESS_REFUSED: dispatch ${dispatch.action} is already recorded (phase ${control.phase}) but its briefing is unavailable: ${briefing.slice(0, 600) || run.error?.message || "lifecycle unavailable"}`,
      };
    return {
      ...briefingDelivery(
        `Dispatch ${dispatch.action} is already recorded (phase ${control.phase}); continue without repeating it.`,
        `DotLn: dispatch ${dispatch.action} is already recorded for ${order} (${role}); continuing in phase ${control.phase}`,
        briefing,
      ),
      control,
    };
  }
  return {
    refusal: `DOTLN_HARNESS_REFUSED: ${intent} is not a legal dispatch in phase ${control.phase}; legal actions: ${legal.join(", ") || "none"}`,
  };
}
const record = (
  root: string,
  input: HarnessInput,
  value: Record<string, unknown>,
) => {
  const path = join(harnessStateDirectory(root), `${sessionKey(input)}.jsonl`);
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  if (existsSync(path) && !lstatSync(path).isFile())
    throw new Error("Host observation log is not a regular file");
  appendFileSync(
    path,
    JSON.stringify({
      recordedAt: new Date().toISOString(),
      event: input.hook_event_name,
      ...(input.tool_name ? { tool: input.tool_name } : {}),
      ...(input.effort?.level &&
      ["low", "medium", "high", "xhigh", "max"].includes(input.effort.level)
        ? { effort: input.effort.level }
        : {}),
      ...value,
    }) + "\n",
    { mode: 0o600 },
  );
};
interface ProcessRow {
  readonly pid: number;
  readonly ppid: number;
  readonly startedAt: string;
  readonly command: string;
}
const shells = new Set([
  "sh",
  "bash",
  "zsh",
  "dash",
  "fish",
  "ksh",
  "csh",
  "tcsh",
  "login",
]);
const validPid = (value: unknown): value is number =>
  Number.isSafeInteger(value) && (value as number) > 1;
/** Best effort: some sandboxes refuse `ps`. An empty table means unknown, never dead. */
function processTable(): readonly ProcessRow[] {
  const result = spawnSync("ps", ["-axo", "pid=,ppid=,lstart=,comm="], {
    encoding: "utf8",
    timeout: 5000,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) return [];
  return result.stdout.split("\n").flatMap((line) => {
    const match =
      /^\s*(\d+)\s+(\d+)\s+(\S{3}\s+\S{3}\s+\d+\s+\d\d:\d\d:\d\d\s+\d{4})\s+(.*)$/.exec(
        line,
      );
    return match
      ? [
          {
            pid: Number(match[1]),
            ppid: Number(match[2]),
            startedAt: match[3]!,
            command: match[4]!.trim(),
          },
        ]
      : [];
  });
}
/** The running process can retain an older executable than PATH. Process-table
 * observations stay local; persist only the version and its observation channel.
 */
export function observeSessionHarnessVersion(
  inputVersion?: string,
  env: NodeJS.ProcessEnv = process.env,
  parent = process.ppid,
  table?: readonly ProcessRow[],
): { value: string; channel: string } | undefined {
  if (inputVersion) return { value: inputVersion, channel: "harness_version" };
  let executable = env.CLAUDE_CODE_EXECPATH;
  let channel = executable ? "CLAUDE_CODE_EXECPATH" : "PATH";
  if (!executable) {
    const rows = new Map(
      (table ?? processTable()).map((row) => [row.pid, row]),
    );
    const visited = new Set<number>();
    for (
      let pid = parent;
      validPid(pid) && visited.size < 32 && !visited.has(pid);
    ) {
      visited.add(pid);
      const row = rows.get(pid);
      if (!row) break;
      const version =
        /\/claude\/versions\/(\d+\.\d+\.\d+)$/.exec(row.command)?.[1] ??
        (/^\d+$/.test(env.CLAUDE_PID ?? "") &&
        row.pid === Number(env.CLAUDE_PID) &&
        /^\d+\.\d+\.\d+$/.test(row.command)
          ? row.command
          : undefined);
      if (version) return { value: version, channel: "ancestor-executable" };
      if (
        row.pid === Number(env.CLAUDE_PID) ||
        basename(row.command) === "claude"
      ) {
        // macOS comm can retain argv[0] rather than the executable's pathname.
        // Inspect only this verified ancestor's text mapping; never a PID supplied
        // without ancestry or arbitrary open files, and persist no process paths.
        const mapped = spawnSync(
          "lsof",
          ["-a", "-p", String(row.pid), "-d", "txt", "-Fn"],
          {
            encoding: "utf8",
            timeout: 1000,
            maxBuffer: 1024 * 1024,
            env,
          },
        );
        const versions =
          mapped.status === 0
            ? [
                ...new Set(
                  mapped.stdout.split("\n").flatMap((line) => {
                    const value =
                      /^n.*\/claude\/versions\/(\d+\.\d+\.\d+)$/.exec(
                        line,
                      )?.[1];
                    return value ? [value] : [];
                  }),
                ),
              ]
            : [];
        if (versions.length === 1)
          return { value: versions[0]!, channel: "ancestor-executable-lsof" };
      }
      if (isAbsolute(row.command) && /\/claude$/.test(row.command)) {
        executable = row.command;
        channel = "ancestor-executable";
        break;
      }
      pid = row.ppid;
    }
  }
  const probe = spawnSync(executable || "claude", ["--version"], {
    encoding: "utf8",
    timeout: 5000,
    env,
  });
  const value =
    probe.status === 0
      ? probe.stdout.match(/\b\d+\.\d+\.\d+\b/)?.[0]
      : undefined;
  return value ? { value, channel } : undefined;
}
/**
 * The harness process owning this hook invocation: the declared pid when it is
 * a verified ancestor, else the nearest non-shell ancestor; when the process
 * table is unreadable, the declared pid is trusted and the parent is the last resort.
 */
export function harnessHostProcess(
  env: NodeJS.ProcessEnv = process.env,
  parent = process.ppid,
): HarnessProcess {
  const table = processTable();
  const rows = new Map(table.map((row) => [row.pid, row]));
  const ancestors: ProcessRow[] = [];
  for (let pid = parent; validPid(pid) && ancestors.length < 32;) {
    const row = rows.get(pid);
    if (!row) break;
    ancestors.push(row);
    pid = row.ppid;
  }
  const declared = /^\d+$/.test(env.CLAUDE_PID ?? "")
    ? Number(env.CLAUDE_PID)
    : NaN;
  const declaredRow = ancestors.find((row) => row.pid === declared);
  if (declaredRow)
    return {
      pid: declaredRow.pid,
      startedAt: declaredRow.startedAt,
      source: "CLAUDE_PID",
    };
  const ancestor = ancestors.find(
    (row) => !shells.has(row.command.replace(/^.*\//, "").toLowerCase()),
  );
  if (ancestor)
    return {
      pid: ancestor.pid,
      startedAt: ancestor.startedAt,
      source: "ancestor",
    };
  if (!table.length && validPid(declared))
    return { pid: declared, source: "CLAUDE_PID" };
  return { pid: parent, source: "parent" };
}
/** Signal-zero existence, then a start-time comparison when the process table is readable. */
export function harnessProcessAlive(owner: HarnessProcess): boolean {
  if (!validPid(owner.pid)) return false;
  try {
    process.kill(owner.pid, 0);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return false;
  }
  const row = processTable().find((entry) => entry.pid === owner.pid);
  return !(
    owner.startedAt !== undefined &&
    row !== undefined &&
    row.startedAt !== owner.startedAt
  );
}
/**
 * A reservation is a directory holding nonce-named files whose contents never
 * change after creation. A session that must record a new fact about its own
 * reservation writes a new file naming the one it supersedes and then removes
 * the superseded name, so a name always denotes exactly the facts a contender
 * observed under it. Every recovery step is therefore conditional on the
 * observed instance: `unlink` needs that exact name and fails once its facts
 * were superseded, `rmdir` needs the emptied instance, and renaming a prepared
 * instance into place succeeds only onto an absent or emptied slot. A stale
 * reclaimer cannot remove refreshed facts, and two sessions that observed the
 * same dead holder cannot remove each other's replacement; the loser
 * re-observes and honours the live holder.
 */
const writerLockDirectory = (root: string) =>
  join(harnessStateDirectory(root), "writer");
/** The pre-repair single-file layout: read, migrated or reclaimed, never created. */
const legacyWriterLock = (root: string) =>
  join(harnessStateDirectory(root), "writer.json");
const reservationName = /^reservation-[0-9a-f]{32}\.json$/;
const errorCode = (error: unknown) => (error as NodeJS.ErrnoException).code;
interface WriterInstance {
  readonly name: string;
  readonly writer: HarnessWriter;
  /** Names this instance superseded that still linger; nothing can revive them. */
  readonly superseded: readonly string[];
}
type WriterObservation =
  | { readonly state: "absent" }
  | { readonly state: "held"; readonly instance: WriterInstance };
const ownerFields = (owner: HarnessProcess | undefined) =>
  owner ? { owner } : {};
const appendWriterEvent = (root: string, event: Record<string, unknown>) => {
  const path = join(harnessStateDirectory(root), "writer-events.jsonl");
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  if (existsSync(path) && !lstatSync(path).isFile())
    throw new Error("Writer event log is not a regular file");
  appendFileSync(
    path,
    JSON.stringify({ at: new Date().toISOString(), ...event }) + "\n",
    { mode: 0o600 },
  );
};
/**
 * An emptied instance is retired. The current instance is the one file that no
 * other file names as superseded; superseded files of the same lineage may
 * linger after a crash and are reported for removal. Anything else refuses.
 */
function observeWriterLock(root: string): WriterObservation {
  const directory = writerLockDirectory(root);
  let names: string[];
  try {
    if (!lstatSync(directory).isDirectory())
      throw new Error("Writer reservation is not a directory");
    names = readdirSync(directory);
  } catch (error) {
    if (errorCode(error) === "ENOENT") return { state: "absent" };
    throw error;
  }
  if (!names.length) return { state: "absent" };
  const inspect = () =>
    new Error(
      "Writer reservation directory holds more than one reservation; inspect before recovery",
    );
  if (names.some((name) => !reservationName.test(name))) throw inspect();
  const entries = names.map((name) => {
    if (!lstatSync(join(directory, name)).isFile())
      throw new Error("Writer reservation is not a regular file");
    return {
      name,
      writer: JSON.parse(
        readFileSync(join(directory, name), "utf8"),
      ) as HarnessWriter,
    };
  });
  const superseded = new Set(
    entries.flatMap((entry) =>
      entry.writer.supersedes ? [entry.writer.supersedes] : [],
    ),
  );
  const current = entries.filter((entry) => !superseded.has(entry.name));
  if (
    current.length !== 1 ||
    entries.some((entry) => entry.writer.actorId !== current[0]!.writer.actorId)
  )
    throw inspect();
  return {
    state: "held",
    instance: {
      ...current[0]!,
      superseded: entries
        .filter((entry) => entry !== current[0])
        .map((entry) => entry.name),
    },
  };
}
/** Rename a prepared instance into the slot; false when a live instance holds it. */
function placeWriterInstance(root: string, writer: HarnessWriter): boolean {
  const nonce = randomBytes(16).toString("hex");
  const prepared = join(harnessStateDirectory(root), `writer.prepare-${nonce}`);
  mkdirSync(prepared, { mode: 0o700 });
  writeFileSync(
    join(prepared, `reservation-${nonce}.json`),
    JSON.stringify(writer) + "\n",
    { mode: 0o600 },
  );
  try {
    renameSync(prepared, writerLockDirectory(root));
    return true;
  } catch (error) {
    rmSync(prepared, { recursive: true, force: true });
    if (["ENOTEMPTY", "EEXIST"].includes(errorCode(error) ?? "")) return false;
    throw error;
  }
}
const unlinkIfPresent = (path: string): boolean => {
  try {
    unlinkSync(path);
    return true;
  } catch (error) {
    if (errorCode(error) !== "ENOENT") throw error;
    return false;
  }
};
/**
 * Retire only the observed instance: first its lingering superseded names,
 * which nothing can revive, then the current name, which is gone once its
 * facts were superseded or a replacement holds the slot.
 */
function retireWriterInstance(root: string, instance: WriterInstance): boolean {
  const directory = writerLockDirectory(root);
  for (const stale of instance.superseded)
    unlinkIfPresent(join(directory, stale));
  if (!unlinkIfPresent(join(directory, instance.name))) return false;
  try {
    rmdirSync(directory);
  } catch (error) {
    // A replacement already renamed over the emptied instance, or it is gone.
    if (!["ENOTEMPTY", "EEXIST", "ENOENT"].includes(errorCode(error) ?? ""))
      throw error;
  }
  return true;
}
/**
 * Record a new fact about this session's own reservation as a new instance
 * that names the observed one, then remove the observed name. A contender
 * that classified the observed name meanwhile finds it gone rather than the
 * refreshed facts. Null when the slot is no longer this session's.
 */
function refreshWriterInstance(
  root: string,
  instance: WriterInstance,
  writer: HarnessWriter,
): WriterInstance | null {
  const directory = writerLockDirectory(root);
  const nonce = randomBytes(16).toString("hex");
  const name = `reservation-${nonce}.json`;
  const temporary = join(
    harnessStateDirectory(root),
    `writer.update-${nonce}.json`,
  );
  const refreshed: HarnessWriter = { ...writer, supersedes: instance.name };
  writeFileSync(temporary, JSON.stringify(refreshed) + "\n", { mode: 0o600 });
  try {
    renameSync(temporary, join(directory, name));
  } catch (error) {
    unlinkIfPresent(temporary);
    if (errorCode(error) === "ENOENT") return null;
    throw error;
  }
  // The new instance must be the slot's current one; otherwise the slot
  // changed hands meanwhile, so withdraw the injected file and re-observe.
  let observation: WriterObservation | null = null;
  try {
    observation = observeWriterLock(root);
  } catch {
    observation = null;
  }
  if (observation?.state === "held" && observation.instance.name === name) {
    for (const stale of observation.instance.superseded)
      unlinkIfPresent(join(directory, stale));
    return { name, writer: refreshed, superseded: [] };
  }
  unlinkIfPresent(join(directory, name));
  return null;
}
/** Fixture and live-smoke seeding through the same conditional placement, never a hook path. */
export function seedHarnessWriter(root: string, writer: HarnessWriter): void {
  withWriterRegistration(root, () => {
    mkdirSync(harnessStateDirectory(root), { recursive: true, mode: 0o700 });
    if (!placeWriterInstance(root, writer))
      throw new Error("Writer reservation is already held");
  });
}
/** The view of one observed record: a hashed session key and host process, never a path, session id or instance name. */
const writerView = (
  writer: HarnessWriter,
): Extract<HarnessWriterView, { readonly reserved: true }> => ({
  contract: "harness-writer-v1",
  reserved: true,
  actorId: writer.actorId,
  ...ownerFields(writer.owner),
  ...(writer.reservedAt ? { reservedAt: writer.reservedAt } : {}),
  ...(writer.liveness ? { liveness: writer.liveness } : {}),
  ...(writer.reclaimed ? { reclaimed: writer.reclaimed } : {}),
  alive:
    writer.owner && writer.liveness !== "unavailable"
      ? harnessProcessAlive(writer.owner)
      : "unknown",
});
/** The current holder as one observation: the directory instance, else the legacy file. */
function observeWriterHolder(root: string): {
  readonly observation: WriterObservation;
  readonly writer: HarnessWriter | null;
} {
  const observation = observeWriterLock(root);
  return {
    observation,
    writer:
      observation.state === "held"
        ? observation.instance.writer
        : readJson<HarnessWriter | null>(legacyWriterLock(root), null),
  };
}
/** Operator-facing view: a hashed session key and host process, never a path or session id. */
export function harnessWriterView(root: string): HarnessWriterView {
  const { writer } = observeWriterHolder(root);
  return writer
    ? writerView(writer)
    : { contract: "harness-writer-v1", reserved: false };
}
const ownerDead = (writer: HarnessWriter) =>
  writer.owner !== undefined &&
  writer.liveness !== "unavailable" &&
  !harnessProcessAlive(writer.owner);
function acquireHarnessWriter(
  root: string,
  input: HarnessInput,
  actorId: string,
  options: { reclaimed?: HarnessWriter; liveness?: "unavailable" } = {},
): HarnessWriter | null {
  const at = new Date().toISOString();
  const owner = harnessHostProcess();
  const previous = options.reclaimed
    ? {
        actorId: options.reclaimed.actorId,
        ...ownerFields(options.reclaimed.owner),
      }
    : undefined;
  const fresh: HarnessWriter = {
    actorId,
    worktree: root,
    owner,
    reservedAt: at,
    ...(options.liveness ? { liveness: options.liveness } : {}),
    ...(previous ? { reclaimed: { ...previous, at } } : {}),
  };
  if (!placeWriterInstance(root, fresh)) return null;
  appendWriterEvent(root, {
    event: previous ? "reclaimed" : "acquired",
    actorId,
    owner,
    ...(previous ? { previous } : {}),
  });
  record(root, input, {
    writerAcquired: { owner },
    ...(previous ? { writerReclaimed: previous } : {}),
  });
  return fresh;
}
/**
 * A pre-repair single-file reservation is migrated when it is this session's
 * and reclaimed when its owner is dead. That file is never a current-protocol
 * instance, so removing it cannot remove another session's replacement. A live
 * or unknown legacy holder is honoured.
 */
function migrateLegacyWriter(
  root: string,
  actorId: string,
): {
  readonly honoured: readonly HarnessWriter[];
  readonly reclaimed?: HarnessWriter;
  readonly liveness?: "unavailable";
} {
  const legacy = legacyWriterLock(root);
  const writer = readJson<HarnessWriter | null>(legacy, null);
  if (!writer) return { honoured: [] };
  const own = writer.actorId === actorId;
  const dead = ownerDead(writer);
  if (!own && !dead) return { honoured: [writer] };
  try {
    unlinkSync(legacy);
  } catch (error) {
    if (errorCode(error) !== "ENOENT") throw error;
    return { honoured: [] };
  }
  if (own) {
    appendWriterEvent(root, {
      event: "migrated",
      actorId,
      ...ownerFields(writer.owner),
    });
    return {
      honoured: [],
      ...(dead || writer.liveness ? { liveness: "unavailable" as const } : {}),
    };
  }
  return { honoured: [], reclaimed: writer };
}
/**
 * Reserve or refresh this session's lock. Only a foreign lock whose recorded
 * owner is dead is reclaimed, and every reclaim is logged; a live or unknown
 * holder keeps the lock until it finishes or an operator releases it. Every
 * step acts only on the observed instance, so contenders serialize through
 * the filesystem rather than through a guard that could itself be abandoned.
 */
function reserveHarnessWriter(
  root: string,
  input: HarnessInput,
  actorId: string,
): readonly HarnessWriter[] {
  return withWriterRegistration(root, () =>
    reserveWriterWhileRegistered(root, input, actorId),
  );
}
function reserveWriterWhileRegistered(
  root: string,
  input: HarnessInput,
  actorId: string,
): readonly HarnessWriter[] {
  mkdirSync(harnessStateDirectory(root), { recursive: true, mode: 0o700 });
  const legacy = migrateLegacyWriter(root, actorId);
  if (legacy.honoured.length) {
    // An honoured legacy holder is a writer; this session acquires nothing.
    const observation = observeWriterLock(root);
    return observation.state === "held"
      ? [...legacy.honoured, observation.instance.writer]
      : legacy.honoured;
  }
  let reclaimed = legacy.reclaimed;
  let liveness = legacy.liveness;
  for (let attempt = 0; attempt < 16; attempt++) {
    let observation: WriterObservation;
    try {
      observation = observeWriterLock(root);
    } catch (error) {
      if (errorCode(error) === "ENOENT") continue;
      throw error;
    }
    if (observation.state === "absent") {
      const fresh = acquireHarnessWriter(root, input, actorId, {
        ...(reclaimed ? { reclaimed } : {}),
        ...(liveness ? { liveness } : {}),
      });
      if (fresh) return [fresh];
      if (reclaimed) {
        appendWriterEvent(root, {
          event: "retired",
          actorId,
          previous: {
            actorId: reclaimed.actorId,
            ...ownerFields(reclaimed.owner),
          },
        });
        reclaimed = undefined;
      }
      continue;
    }
    const { instance } = observation;
    const writer = instance.writer;
    if (writer.actorId === actorId) {
      let updated: HarnessWriter | undefined;
      let event: Record<string, unknown> | undefined;
      let journal: Record<string, unknown> | undefined;
      if (!writer.owner) {
        updated = {
          ...writer,
          owner: harnessHostProcess(),
          reservedAt: writer.reservedAt ?? new Date().toISOString(),
        };
        event = { event: "owner-recorded", actorId, owner: updated.owner };
      } else if (ownerDead(writer)) {
        // This session is running its hook, so the recorded owner was not its process.
        updated = { ...writer, liveness: "unavailable" };
        event = { event: "liveness-unavailable", actorId, owner: writer.owner };
        journal = { writerLivenessUnavailable: writer.owner };
      }
      if (!updated) {
        for (const stale of instance.superseded)
          unlinkIfPresent(join(writerLockDirectory(root), stale));
        return [writer];
      }
      const refreshed = refreshWriterInstance(root, instance, updated);
      if (!refreshed) {
        // The slot changed hands; a distrusted identity stays distrusted if it acquires again.
        if (updated.liveness) liveness = "unavailable";
        continue;
      }
      appendWriterEvent(root, event!);
      if (journal) record(root, input, journal);
      return [refreshed.writer];
    }
    if (ownerDead(writer)) {
      if (!retireWriterInstance(root, instance)) continue;
      const fresh = acquireHarnessWriter(root, input, actorId, {
        reclaimed: writer,
        ...(liveness ? { liveness } : {}),
      });
      if (fresh) return [fresh];
      appendWriterEvent(root, {
        event: "retired",
        actorId,
        previous: { actorId: writer.actorId, ...ownerFields(writer.owner) },
      });
      continue;
    }
    return [writer];
  }
  throw new Error("Writer reservation recovery exceeded its retry budget");
}
export const harnessSubject = gateTreeHash;

export function harnessOutputs(
  root: string,
  since = "HEAD",
): readonly { path: string; hash: string; bytes: number }[] {
  const changed = [
    ...git(
      root,
      ["diff", since, "--name-only", "--diff-filter=AM", "-z"],
      true,
    ).split("\0"),
    ...git(root, ["ls-files", "--others", "--exclude-standard", "-z"]).split(
      "\0",
    ),
  ].filter(Boolean);
  return [...new Set(changed)].sort().flatMap((path) => {
    const absolute = contained(root, path);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) return [];
    const bytes = readFileSync(absolute);
    return [{ path, hash: feedbackContentHash(bytes), bytes: bytes.length }];
  });
}

export function harnessOutputObligations(
  root: string,
  session: HarnessSession,
) {
  const budget = readJson<{ limits?: { readCapBytes?: number } }>(
    join(root, "docs/control/budgets.json"),
    {},
  );
  const cap = budget.limits?.readCapBytes ?? 65_536;
  const paths = [...new Set(session.authoredPaths ?? [])].sort();
  const attributes = paths.length
    ? git(root, [
        "check-attr",
        "-z",
        "dotln-generated",
        "dotln-check",
        "--",
        ...paths,
      ]).split("\0")
    : [];
  const generated = new Set<string>();
  const checks = new Map<string, string>();
  for (let i = 0; i + 2 < attributes.length; i += 3) {
    const value = attributes[i + 2]!;
    if (
      attributes[i + 1] === "dotln-generated" &&
      !["unspecified", "unset"].includes(value)
    )
      generated.add(attributes[i]!);
    if (
      attributes[i + 1] === "dotln-check" &&
      /^suite:[a-z][a-z0-9-]*$/.test(value)
    )
      checks.set(attributes[i]!, value);
  }
  return paths.flatMap((path) => {
    const absolute = contained(root, path);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) return [];
    const bytes = readFileSync(absolute);
    return [
      {
        path,
        hash: feedbackContentHash(bytes),
        bytes: bytes.length,
        ...(checks.has(path) ? { checkId: checks.get(path)! } : {}),
        obligation:
          generated.has(path) || bytes.length > cap
            ? ("check" as const)
            : ("read" as const),
      },
    ];
  });
}
const outputSnapshot = (root: string) =>
  Object.fromEntries(
    harnessOutputs(root).map(({ path, hash }) => [path, hash]),
  );
function observeAuthorship(
  input: HarnessInput,
  root: string,
  session: HarnessSession,
) {
  if (
    !["Edit", "Write", "Bash", "NotebookEdit"].includes(input.tool_name ?? "")
  )
    return;
  const started = performance.now();
  const outputs = harnessOutputs(root);
  const snapshot = Object.fromEntries(
    outputs.map(({ path, hash }) => [path, hash]),
  );
  if (input.hook_event_name === "PreToolUse") session.beforeOutputs = snapshot;
  else {
    if (!session.beforeOutputs)
      throw new Error("Output authorship lacks a before-tool observation");
    const changed = Object.keys(snapshot).filter(
      (path) => snapshot[path] !== session.beforeOutputs![path],
    );
    session.authoredPaths = [
      ...new Set([...(session.authoredPaths ?? []), ...changed]),
    ];
    session.beforeOutputs = snapshot;
  }
  return {
    durationMs: performance.now() - started,
    files: outputs.length,
    bytes: outputs.reduce((total, output) => total + output.bytes, 0),
    commands: 2,
  };
}

/** Explicit entry for harnesses without automatic hooks. Existing dirt is a
 * baseline, unless a mid-upgrade session explicitly adopts its current outputs.
 */
export function beginHarnessSession(
  root: string,
  sessionId: string,
  role: string,
  adoptCurrent: boolean | readonly string[] = false,
) {
  if (
    ![
      "executor",
      "verifier",
      "reviewer",
      "release-close",
      "planner",
      "refuter",
    ].includes(role) ||
    !sessionId
  )
    throw new Error("Invalid harness session");
  const input: HarnessInput = {
    cwd: root,
    session_id: sessionId,
    hook_event_name: "UserPromptSubmit",
  };
  if (existsSync(statePath(root, input)))
    throw new Error("Session already began; do not erase its observations");
  const snapshot = outputSnapshot(root);
  const adopted = Array.isArray(adoptCurrent)
    ? [...new Set(adoptCurrent)]
    : adoptCurrent
      ? Object.keys(snapshot)
      : [];
  if (adopted.some((path) => typeof path !== "string" || !(path in snapshot)))
    throw new Error(
      "Adopted outputs must name current changed files; inherited paths are not inferred",
    );
  const control = harnessControl(root);
  const expected =
    role === "executor"
      ? control.phase === "repairing"
        ? "RepairCompleted"
        : "ImplementationReady"
      : role === "verifier"
        ? "VerificationCompleted"
        : role === "reviewer"
          ? "FinalReviewCompleted"
          : null;
  const session: HarnessSession = {
    role,
    ...(control.workOrder ? { workOrder: control.workOrder } : {}),
    ...(expected && control.phase !== "closed"
      ? { expectedEvent: expected }
      : {}),
    startedAt: new Date().toISOString(),
    usageSessionKey: usageSessionKey(process.env.CODEX_THREAD_ID ?? sessionId),
    startingEventCount: localEvents(root, control.workOrder).length,
    reads: [],
    beforeOutputs: snapshot,
    authoredPaths: adopted,
  };
  writeJson(statePath(root, input), session);
  const counterWarning = initializeSubagentCounter(
    harnessStateDirectory(root),
    sessionId,
  );
  if (counterWarning)
    process.stderr.write(`DotLn advisory: subagent ${counterWarning}.\n`);
  record(root, input, {
    role,
    source: adopted.length
      ? "actor-attested-upgrade-authorship"
      : "explicit-session-entry",
    adoptedPaths: adopted,
  });
  return {
    session: sessionKey(input),
    inheritedOutputs: Object.keys(snapshot).length - adopted.length,
  };
}

/** Collection serves explicit sessions and hooks; missing counters are an
 * observation, never a completion refusal. Transcript contents stay private. */
export function measureHarnessSessionUsage(
  root: string,
  session: HarnessSession,
  key: string,
  transcriptPath?: string,
) {
  if (!session.role || !session.startedAt)
    throw new Error(
      "Token measurement requires an active role and dispatch start",
    );
  const sourceKey =
    session.usageSessionKey ??
    (process.env.CODEX_THREAD_ID
      ? usageSessionKey(process.env.CODEX_THREAD_ID)
      : key);
  let observation: ReturnType<typeof usageObservation>;
  try {
    observation = collectSessionUsage(root, {
      sessionKey: sourceKey,
      since: session.startedAt,
      ...(transcriptPath ? { transcriptPath } : {}),
    });
  } catch {
    observation = {
      ...usageObservation([]),
      observedAt: new Date().toISOString(),
      scope: "dispatch",
    };
    process.stderr.write(
      "DotLn advisory: process-cost counters unavailable; recorded unknown.\n",
    );
  }
  recordUsageObservation(root, {
    workOrder: session.workOrder ?? null,
    role: session.role,
    ...(!session.workOrder
      ? { dispatch: `session-${session.startedAt.replace(/[^0-9]/g, "")}` }
      : {}),
    sessionKey: sourceKey,
    startedAt: session.startedAt,
    durationMs: Date.now() - Date.parse(session.startedAt),
    observation,
  });
  return {
    ...observation,
    subagents: subagentUsage(root, harnessStateDirectory(root), key, true),
  };
}

export function measureHarnessUsage(root: string, sessionId: string) {
  const input = { session_id: sessionId } as HarnessInput;
  const session = readJson<HarnessSession | null>(
    statePath(root, input),
    null,
    true,
  );
  if (!session)
    throw new Error("Begin the harness session before measuring usage");
  return {
    ...measureHarnessSessionUsage(root, session, sessionKey(input)),
    subagents: subagentUsage(root, harnessStateDirectory(root), sessionId),
  };
}

export function observeHarnessSession(root: string, sessionId: string) {
  const input: HarnessInput = {
    cwd: root,
    session_id: sessionId,
    hook_event_name: "PostToolUse",
    tool_name: "Bash",
  };
  const session = readJson<HarnessSession | null>(
    statePath(root, input),
    null,
    true,
  );
  if (!session)
    throw new Error("Begin the harness session before observing outputs");
  const authorship = observeAuthorship(input, root, session);
  record(root, input, {
    role: session.role,
    source: "explicit-authorship-observation",
    authorship,
  });
  writeJson(statePath(root, input), session);
  return harnessOutputObligations(root, session);
}

/** The explicit adapter consumes the actual bounded reader's delivered stdout. */
export function observeHarnessDelivery(
  root: string,
  sessionId: string,
  delivered: string,
) {
  const value = JSON.parse(delivered) as {
    path: string;
    offset: number;
    nextOffset: number;
  };
  const expected = readHarnessOutput(
    root,
    value.path,
    value.offset,
    Math.max(4, value.nextOffset - value.offset),
  );
  if (JSON.stringify(JSON.parse(delivered)) !== JSON.stringify(expected))
    throw new Error("Delivered output differs from current bytes");
  const input: HarnessInput = {
    cwd: root,
    session_id: sessionId,
    hook_event_name: "PostToolUse",
    tool_name: "Bash",
  };
  const session = readJson<HarnessSession | null>(
    statePath(root, input),
    null,
    true,
  );
  if (!session) throw new Error("Missing output-reader session");
  admitReadBytes(
    session,
    expected.path,
    readFileSync(contained(root, expected.path)),
    expected.offset,
    expected.nextOffset,
  );
  writeJson(statePath(root, input), session);
  record(root, input, {
    source: "explicit-tool-delivery",
    receipts: session.reads,
    byteReads: session.byteReads,
  });
}

const outputReadLimit = 16_384;
export function harnessOutputReadArgs(args: readonly string[]): {
  path: string;
  offset: number;
  length: number;
} {
  const [path, ...flags] = args;
  if (!path || flags.length % 2)
    throw new Error(
      "usage: harness read-output <path> [--offset <byte>] [--length <bytes>]",
    );
  const values = new Map<string, number>();
  for (let index = 0; index < flags.length; index += 2) {
    const flag = flags[index]!;
    const value = flags[index + 1]!;
    if (
      !["--offset", "--length"].includes(flag) ||
      values.has(flag) ||
      !/^\d+$/.test(value) ||
      !Number.isSafeInteger(Number(value))
    )
      throw new Error("Invalid output read range");
    values.set(flag, Number(value));
  }
  return {
    path,
    offset: values.get("--offset") ?? 0,
    length: values.get("--length") ?? 8192,
  };
}

/** A bounded delivery, never a read receipt. Only the post-tool observer admits it. */
export function readHarnessOutput(
  root: string,
  path: string,
  offset = 0,
  length = 8192,
) {
  const absolute = contained(root, path);
  path = relative(root, absolute);
  const visible = git(root, [
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z",
  ]).split("\0");
  if (!visible.includes(path) || !lstatSync(absolute).isFile())
    throw new Error("Output reader requires a Git-visible regular file");
  const bytes = readFileSync(absolute);
  if (
    !Number.isSafeInteger(offset) ||
    !Number.isSafeInteger(length) ||
    offset < 0 ||
    offset > bytes.length ||
    length < 4 ||
    length > outputReadLimit ||
    (offset < bytes.length && (bytes[offset]! & 0xc0) === 0x80)
  )
    throw new Error("Invalid output byte range or UTF-8 boundary");
  let end = Math.min(bytes.length, offset + length);
  while (end < bytes.length && (bytes[end]! & 0xc0) === 0x80) end--;
  const content = new TextDecoder("utf-8", {
    fatal: true,
    ignoreBOM: true,
  }).decode(bytes.subarray(offset, end));
  return {
    contract: "harness-output-read-v1",
    path,
    hash: feedbackContentHash(bytes),
    offset,
    nextOffset: end,
    totalBytes: bytes.length,
    content,
  };
}

function outputReadCommand(command: unknown) {
  if (typeof command !== "string") return null;
  // Direct invocation only: shell composition, substitutions and interpreters
  // cannot turn model-authored stdout into a host-observed delivery.
  const match =
    /^node scripts\/harness\.mjs read-output (?:'([^'\n]+)'|"([^"$\x60\\\n]+)"|([a-zA-Z0-9_./-]+))((?: --(?:offset|length) \d+)*)$/.exec(
      command,
    );
  if (!match) return null;
  return harnessOutputReadArgs([
    match[1] ?? match[2] ?? match[3]!,
    ...match[4]!.trim().split(/\s+/).filter(Boolean),
  ]);
}

function admitReadBytes(
  session: HarnessSession,
  path: string,
  contents: Buffer,
  startByte: number,
  endByte: number,
): void {
  const hash = feedbackContentHash(contents);
  const ranges = (session.byteReads ??= []);
  ranges.push({ path, hash, startByte, endByte });
  let covered = 0;
  for (const range of ranges
    .filter((range) => range.path === path && range.hash === hash)
    .sort((a, b) => a.startByte - b.startByte)) {
    if (range.startByte > covered) return;
    covered = Math.max(covered, range.endByte);
  }
  if (
    covered === contents.length &&
    !session.reads.some((read) => read.path === path && read.hash === hash)
  )
    session.reads.push({
      path,
      hash,
      evidenceRef: "host:observed-output-ranges",
    });
}

export function runHarnessEvidence(
  root: string,
  pendingVerdict?: string,
): readonly HarnessCheck[] {
  const active = beginGateRun(
    root,
    pendingVerdict === "fail" ? "git diff --check" : "npm test",
  );
  try {
    return runHarnessEvidenceChecks(root, active.stopRequested, pendingVerdict);
  } finally {
    active.release();
  }
}

function runHarnessEvidenceChecks(
  root: string,
  stopRequested: () => boolean = () => false,
  pendingVerdict?: string,
): readonly HarnessCheck[] {
  const treeHash = gateTreeHash(root);
  // A stop request ends the gate at the next check boundary; an ended check
  // is neither a pass nor a recorded failure.
  const honourStop = (checkId: string) => {
    if (stopRequested())
      throw new Error(
        `Gate stopped by request during ${checkId}; no check recorded`,
      );
  };
  // Explicit evidence remains a useful product-gate command. Completion uses
  // its own inline diff check and never requests this gate.
  const codeIdentity = gateCodeIdentity(root);
  const required =
    pendingVerdict === "fail"
      ? ["git diff --check"]
      : ["npm test", "git diff --check"];
  const commands = [
    {
      checkId: "npm test",
      executable: "npm",
      args: ["test"],
    },
    {
      checkId: "git diff --check",
      executable: "git",
      args: ["diff", "--check"],
    },
  ].filter((command) => required.includes(command.checkId));
  const runs = commands.map(({ checkId, executable, args }) => {
    const cached = findGateCheck(root, checkId, treeHash);
    if (cached) return cached;
    honourStop(checkId);
    const started = Date.now();
    const run = spawnSync(executable, args, {
      cwd: root,
      encoding: "utf8",
      timeout: checkId === "npm test" ? 900_000 : 150_000,
      maxBuffer: 32 * 1024 * 1024,
    });
    process.stdout.write(run.stdout ?? "");
    process.stderr.write(run.stderr ?? "");
    honourStop(checkId);
    const durationMs = Date.now() - started;
    if (run.error)
      process.stderr.write(
        `Suite ${checkId} failed after ${durationMs} ms: ${run.error.message}\n`,
      );
    if (run.status === 0) {
      const recorded = findGateCheck(root, checkId, treeHash);
      if (recorded) return recorded;
    }
    return {
      checkId,
      subject: checkId === "npm test" ? codeIdentity : treeHash,
      treeHash,
      ...(checkId === "npm test" ? { codeIdentity } : {}),
      durationMs,
      exitCode: run.status ?? 1,
      executed: true,
      evidenceRef: `host-check:${digest(checkId + treeHash)}`,
      recordedAt: new Date().toISOString(),
    };
  });
  if (
    gateTreeHash(root) !== treeHash ||
    gateCodeIdentity(root) !== codeIdentity
  )
    throw new Error("Source changed during required checks");
  recordGateChecks(root, runs);
  return runs;
}

const shellQuote = (value: string) => `'${value.replaceAll("'", `'\\''`)}'`;
/** Usage writes only the caller's ignored observation, not repository source. */
function managedUsageCommand(
  input: HarnessInput,
  session: HarnessSession,
): boolean {
  if (input.tool_name !== "Bash" || !session.role || !input.session_id)
    return false;
  const id = input.session_id;
  const commands = [`node scripts/harness.mjs usage ${shellQuote(id)}`];
  if (/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id))
    commands.push(`node scripts/harness.mjs usage ${id}`);
  return commands.includes(String(input.tool_input?.command ?? ""));
}
function metadataCommand(command: string, repositoryCommands = true): boolean {
  if (repositoryCommands && outputReadCommand(command) !== null) return true;
  if (
    repositoryCommands &&
    /^(?:npm run plan --|node scripts\/refute-plan\.mjs) start [a-z][a-z0-9-]*$/.test(
      command,
    )
  )
    return true;
  const commands = command.split(/\s*(?:&&|\n)\s*/).map((part) => part.trim());
  return (
    commands.length > 0 &&
    commands.every(
      (part) =>
        [
          "pwd",
          "git rev-parse --show-toplevel",
          "git rev-parse --abbrev-ref HEAD",
          "git status --short",
          "git status --short --branch",
          "git diff --check",
          "git worktree list --porcelain",
          ...(repositoryCommands
            ? ["node scripts/harness.mjs writer --show"]
            : []),
        ].includes(part) ||
        (repositoryCommands &&
          /^(?:node scripts\/resume\.mjs|npm run resume(?: --silent)? --) (?:status(?: --json)?|times|usage(?: --json)?|briefing|next|release-close)$/.test(
            part,
          )),
    )
  );
}
/**
 * Writer facts for one tool invocation. Metadata and managed-usage commands
 * reserve nothing; any other shell or write invocation
 * reserves or refreshes this session's writer and reports every holder. The
 * reservation journals under the observed event, so a prompt dispatch admitted
 * through its equivalent invocation records its acquisition against the prompt.
 */
function writerIsolationFacts(
  root: string,
  invocation: HarnessInput,
  session: HarnessSession,
  observed: HarnessInput = invocation,
): Extract<FeedbackBoundaryRequest, { readonly kind: "writer-isolation" }> {
  const actorId = sessionKey(observed);
  const command = String(invocation.tool_input?.command ?? "");
  if (
    invocation.tool_name === "Bash" &&
    (metadataCommand(command) || managedUsageCommand(invocation, session))
  )
    return { ...feedbackWriterFacts(root, actorId, []), writable: false };
  const location = feedbackWriterFacts(root, actorId, []);
  // A command already ineligible to own this checkout must not leave a lock
  // behind when the compiled writer predicate refuses it.
  if (
    location.cwd !== location.gitRoot ||
    location.cwd !== location.worktree ||
    !location.branch ||
    location.branch === "HEAD"
  )
    return location;
  return feedbackWriterFacts(
    root,
    actorId,
    reserveHarnessWriter(root, observed, actorId),
  );
}
/** Host fact collection is separate from the sole compiled feedback predicate. */
export function harnessFeedbackFacts(
  policy: CompiledFeedback,
  input: HarnessInput,
  root: string,
  session: HarnessSession,
): readonly FeedbackBoundaryRequest[] {
  const handler = policy.units[0]?.trigger;
  const args = input.tool_input ?? {};
  if (
    handler === "attribution" &&
    ["Bash", "exec_command"].includes(input.tool_name ?? "")
  ) {
    const command = typeof args.command === "string" ? args.command : "";
    return commitMessageInputs(command).map(({ messages, files }) => {
      try {
        return {
          kind: "attribution" as const,
          message: [
            ...messages,
            ...files.map((file) => readFileSync(contained(root, file), "utf8")),
          ].join("\n\n"),
        };
      } catch {
        throw new HarnessCommandRefused(
          "Commit message file bytes unavailable; use a readable contained file",
        );
      }
    });
  }
  // A spawn reserves nothing: the subagent's own writes reserve the writer
  // when they happen, through this same guard.
  if (
    handler === "writer-isolation" &&
    ["shell", "write"].includes(
      harnessToolEffects[input.tool_name as keyof typeof harnessToolEffects] ??
        "unclassified",
    )
  )
    return [writerIsolationFacts(root, input, session)];
  if (
    handler === "suppression-diff" &&
    ["Edit", "Write"].includes(input.tool_name ?? "")
  ) {
    if (typeof args.file_path !== "string")
      throw new HarnessObserverInput("Missing edit path");
    const path = relative(root, contained(root, args.file_path));
    const original = input.tool_response?.originalFile;
    const before =
      typeof original === "string"
        ? original
        : git(root, ["show", `HEAD:${path}`], true);
    return [
      {
        kind: "suppression-diff",
        files: [
          { path, before, after: readFileSync(contained(root, path), "utf8") },
        ],
      },
    ];
  }
  if (input.hook_event_name !== "Stop" || !session.expectedEvent) return [];
  const control = harnessControl(root);
  if (handler === "complete-scope") {
    const events = localEvents(root, control.workOrder).slice(
      session.startingEventCount,
    );
    const complete = events.some(
      (event) => event.type === session.expectedEvent,
    );
    return [
      {
        kind: "complete-scope",
        required: [session.expectedEvent],
        completed: complete ? [session.expectedEvent] : [],
        remaining: complete ? [] : [session.expectedEvent],
        status: complete ? "completed" : "pending",
      },
    ];
  }
  // A failed verification is a valid completed verification episode, not a pass claim.
  if (
    handler === "application-evidence" &&
    control.latestVerdict === "fail" &&
    ["verifier", "reviewer"].includes(session.role ?? "")
  )
    return [];
  if (handler === "application-evidence") {
    const tree = harnessSubject(root);
    const subject = gateCodeIdentity(root);
    const requiredChecks = ["npm test", "git diff --check"];
    return [
      {
        kind: "application-evidence",
        subject,
        requiredChecks,
        // The product row names current code; the whitespace row must still
        // name the current exact tree. Both witness this subject only after
        // their own identity checks pass.
        runs: requiredChecks.flatMap((check) => {
          const row = findGateCheck(root, check, tree);
          return row ? [{ ...row, subject }] : [];
        }),
      },
    ];
  }
  if (handler === "output-review")
    return [
      {
        kind: "output-review",
        outputs: harnessOutputObligations(root, session).filter(
          (output) => output.obligation === "read",
        ),
        reads: session.reads,
      },
    ];
  return [];
}

function observeRead(
  input: HarnessInput,
  root: string,
  session: HarnessSession,
): readonly ReadRange[] {
  const paths: ReadRange[] = [];
  const args = input.tool_input ?? {};
  if (input.tool_name === "Read" && typeof args.file_path === "string") {
    const path = relative(root, contained(root, args.file_path));
    const file = input.tool_response?.file as
      | {
          content?: string;
          startLine?: number;
          numLines?: number;
          totalLines?: number;
        }
      | undefined;
    const bytes = readFileSync(contained(root, path));
    const contents = new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true,
    }).decode(bytes);
    if (
      !file ||
      !Number.isInteger(file.startLine) ||
      !Number.isInteger(file.numLines)
    )
      throw new HarnessObserverInput("Read response range unavailable");
    paths.push({
      path,
      startLine: file.startLine!,
      // Claude reports the empty line after a trailing newline. It delivers
      // no additional bytes; normalize to the same physical-line convention
      // used by the directed-set accountant, without widening a section.
      endLine: Math.min(
        physicalLines(contents),
        file.startLine! + file.numLines! - 1,
      ),
    });
    const parts = lineParts(contents);
    const start = file.startLine! - 1;
    const end = Math.min(parts.length, start + file.numLines!);
    if (
      start >= 0 &&
      start <= parts.length &&
      file.numLines! >= 0 &&
      start + file.numLines! <= contents.split("\n").length &&
      [parts.length, contents.split("\n").length].includes(file.totalLines!) &&
      typeof file.content === "string" &&
      file.content.replace(/\n$/, "") ===
        parts.slice(start, end).join("").replace(/\n$/, "")
    )
      admitReadBytes(
        session,
        path,
        bytes,
        Buffer.byteLength(parts.slice(0, start).join("")),
        Buffer.byteLength(parts.slice(0, end).join("")),
      );
  }
  const request =
    input.tool_name === "Bash" ? outputReadCommand(args.command) : null;
  if (request && typeof input.tool_response?.stdout === "string") {
    const expected = readHarnessOutput(
      root,
      request.path,
      request.offset,
      request.length,
    );
    let delivered: unknown;
    try {
      delivered = JSON.parse(input.tool_response.stdout);
    } catch {
      throw new HarnessObserverInput(
        "Output read delivery is truncated or unavailable",
      );
    }
    if (
      !delivered ||
      typeof delivered !== "object" ||
      Object.keys(delivered).length !== Object.keys(expected).length ||
      Object.entries(expected).some(
        ([key, value]) => (delivered as Record<string, unknown>)[key] !== value,
      )
    )
      throw new HarnessObserverInput(
        "Output read delivery differs from current bytes",
      );
    const bytes = readFileSync(contained(root, expected.path));
    if (feedbackContentHash(bytes) !== expected.hash)
      throw new HarnessObserverInput("Output changed during read observation");
    const linesBefore = (end: number) =>
      physicalLines(bytes.subarray(0, end).toString("utf8")) +
      (end > 0 && bytes[end - 1] === 10 ? 1 : 0);
    paths.push({
      path: expected.path,
      startLine: expected.offset === 0 ? 1 : linesBefore(expected.offset),
      endLine:
        expected.nextOffset === 0
          ? 0
          : physicalLines(
              bytes.subarray(0, expected.nextOffset).toString("utf8"),
            ),
    });
    admitReadBytes(
      session,
      expected.path,
      bytes,
      expected.offset,
      expected.nextOffset,
    );
  }
  if (
    input.tool_name === "Skill" &&
    typeof args.skill === "string" &&
    /^dotln-[a-z-]+$/.test(args.skill)
  ) {
    const path = `.claude/skills/${args.skill}/SKILL.md`;
    paths.push({
      path,
      startLine: 1,
      endLine: physicalLines(readFileSync(contained(root, path), "utf8")),
    });
  }
  return paths;
}
/** Optional trusted smoke input bounds shell routes and observes or enforces Read ranges. */
function readScopeRefusal(
  input: HarnessInput,
  root: string,
  scope: HarnessReadScope,
): { reason: string; attemptedRead?: ReadRange } | null {
  const args = input.tool_input ?? {};
  if (input.tool_name === "Skill")
    return args.skill === scope.skill ? null : { reason: "undeclared skill" };
  if (input.tool_name === "Bash")
    return typeof args.command === "string" &&
      args.command
        .split(/\s*(?:&&|\n)\s*/)
        .every((command) => scope.commands.includes(command.trim()))
      ? null
      : { reason: "unobserved shell read/effect route" };
  if (input.tool_name !== "Read" || typeof args.file_path !== "string")
    return { reason: "unobserved model tool route" };
  let absolute: string;
  try {
    absolute = contained(root, args.file_path);
  } catch {
    return {
      reason: "unobserved read path",
      attemptedRead: {
        path: "<outside-worktree>",
        startLine: 1,
        endLine: Number.MAX_SAFE_INTEGER,
      },
    };
  }
  const path = relative(root, absolute);
  const total = existsSync(absolute)
    ? physicalLines(readFileSync(absolute, "utf8"))
    : 0;
  const start = args.offset === undefined ? 1 : Number(args.offset);
  const end =
    args.limit === undefined
      ? total
      : Math.min(total, start + Number(args.limit) - 1);
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 1 ||
    end < start
  )
    return {
      reason: "unobserved read range",
      attemptedRead: { path, startLine: start, endLine: end },
    };
  return scope.reads.some(
    (entry) =>
      entry.path === path && entry.startLine <= start && entry.endLine >= end,
  )
    ? null
    : {
        reason: "read outside the mechanically directed set",
        attemptedRead: { path, startLine: start, endLine: end },
      };
}

/** A refusal names this many missing outputs; the next refusal names the next ones. */
const namedOutputLimit = 12;
function feedbackRefusalReason(
  error: FeedbackRefused,
  facts: readonly FeedbackBoundaryRequest[],
  root: string,
): string {
  const writer = facts.find((fact) => fact.kind === "writer-isolation");
  if (writer && writer.kind === "writer-isolation" && writer.writable) {
    const holder = writer.writers.find(
      (entry) => entry.actorId !== writer.actorId,
    );
    if (holder) {
      const view = harnessWriterView(root);
      const owner =
        view.reserved && view.owner
          ? `host process ${view.owner.pid}${view.owner.startedAt ? ` started ${view.owner.startedAt}` : ""} is ${view.alive === true ? "alive" : view.alive === false ? "not alive" : "of unknown liveness"}`
          : "its host process is not recorded";
      return `${error.message}; the worktree is reserved by another session (actor ${holder.actorId.slice(0, 12)}; ${owner}). Finish that session, inspect with node scripts/harness.mjs writer --show, or release from an operator terminal with node scripts/harness.mjs writer --release.`;
    }
  }
  const review = facts.find((fact) => fact.kind === "output-review");
  if (!review || review.kind !== "output-review") return error.message;
  // Diagnostics only; feedbackBoundary owns the allow/refuse decision.
  const missing = review.outputs
    .filter(
      (output) =>
        !review.reads.some(
          (read) =>
            read.path === output.path &&
            read.hash === output.hash &&
            read.evidenceRef.trim().length > 0,
        ),
    )
    .map((output) => output.path);
  return (
    error.message +
    "; " +
    missing.length +
    " of " +
    review.outputs.length +
    " outputs missing current-byte reads: " +
    JSON.stringify(missing.slice(0, namedOutputLimit)) +
    (missing.length > namedOutputLimit
      ? ` and ${missing.length - namedOutputLimit} more`
      : "") +
    ". Read all ranges of each file. For oversized lines, run node scripts/harness.mjs read-output <path> --offset 0 --length 8192 and continue at nextOffset until totalBytes."
  );
}
export function permissionEffect(
  input: HarnessInput,
  root: string,
  tools: HookConfig["tools"] = harnessToolEffects,
): string {
  const args = input.tool_input ?? {};
  const path =
    typeof args.file_path === "string"
      ? args.file_path
      : typeof args.notebook_path === "string"
        ? args.notebook_path
        : "";
  if (path) {
    if (/(?:^|[\\/])\.ssh(?:[\\/]|$)|(?:^|[\\/])\.env(?:\.|$)/.test(path))
      return "credentials.access";
    if (
      path.startsWith("~") ||
      (isAbsolute(path) && !path.startsWith(`${root}${sep}`))
    )
      return "settings.user";
    const local = relative(root, contained(root, path));
    if (local.startsWith("docs/control/local/harness/")) return "settings.user";
  }
  const tool = tools?.[input.tool_name ?? ""];
  if (!tool)
    throw new HarnessCommandRefused(
      `Unclassified effectful tool: ${input.tool_name ?? "unknown"}`,
    );
  if (tool === "spawn") {
    // A subagent of this session acts under the session's own authority and
    // every effect it performs passes these same guards; the spawn itself
    // reads and writes nothing. A remote agent runs outside them.
    if (args.isolation === "remote")
      throw new HarnessCommandRefused(
        "Remote subagents run outside this host's guards; run the agent locally",
      );
    return "repo.read";
  }
  // Ending a task this session started is the session's own process control:
  // it writes no repository byte, and a gate ended this way records no check.
  if (tool === "stop") return "shell.run";
  if (tool === "write" && !path)
    throw new HarnessCommandRefused(
      "Write tool requires a classified path adapter",
    );
  if (tool !== "shell") return tool === "write" ? "repo.write" : "repo.read";
  if (input.tool_name !== "Bash" && typeof args.command !== "string")
    throw new HarnessCommandRefused(
      "Opaque shell tool requires a classified command adapter",
    );

  const command = typeof args.command === "string" ? args.command : "";
  const outputRead = outputReadCommand(command);
  if (outputRead)
    return permissionEffect(
      {
        ...input,
        tool_name: "Read",
        tool_input: { file_path: outputRead.path },
      },
      root,
    );
  if (metadataCommand(command)) return "repo.read";
  const effects = invocationEffects(command);
  return (
    effects.find(
      (effect) => !["shell.run", "lifecycle.run", "repo.read"].includes(effect),
    ) ?? (effects.includes("lifecycle.run") ? "lifecycle.run" : "shell.run")
  );
}
/**
 * A refused Stop is reported once. Claude then re-enters Stop with
 * `stop_hook_active`; refusing again would loop until the operator interrupts,
 * so the unmet obligation is recorded, never as a finish, and the turn ends.
 * The lifecycle script remains the ground truth for every completion claim.
 */
const stopReentry = (input: HarnessInput) =>
  input.hook_event_name === "Stop" && input.stop_hook_active === true;
const protocolAdvisory = (reason: string) => ({
  systemMessage: `DotLn advisory: ${reason.replace(/\s+/g, " ")}; host permissions decide.`,
});
// Preserve budget provenance without adding fields to the host protocol.
// Classification messages can also mention subagents; wording is not origin.
const subagentAdvisories = new WeakSet<object>();
const subagentAdvisory = (response: { systemMessage: string }) => {
  subagentAdvisories.add(response);
  return response;
};
const protocolRefusal = (
  event: HarnessEvent | "SessionStart",
  reason: string,
) =>
  event === "PreToolUse"
    ? {
        hookSpecificOutput: {
          hookEventName: event,
          permissionDecision: "deny",
          permissionDecisionReason: reason,
        },
      }
    : event === "UserPromptSubmit"
      ? {
          systemMessage: `DotLn: prompt accepted; ${reason.replace(/\s+/g, " ")}`,
          hookSpecificOutput: {
            hookEventName: event,
            additionalContext: `The operator's prompt is accepted. DotLn could not complete its automatic setup: ${reason}. Inspect canonical status and continue within the operator's authority; do not claim that an unrecorded dispatch ran.`,
          },
        }
      : event === "Stop"
        ? { systemMessage: `DotLn: ${reason.replace(/\s+/g, " ")}` }
        : event === "PostToolUse"
          ? {}
          : protocolAdvisory(reason);

/** Recovery is advisory: the host retains its own sandbox and approval. */
export const BOOTSTRAP_HATCH_TEXT =
  "Run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide tool access.";
/** The session's own stop request is admitted while its gate holds inputs. */
const GATE_STOP_COMMANDS = [
  "node scripts/harness.mjs evidence --stop",
  "npm run harness -- evidence --stop",
];
export const GATE_STOP_TEXT = `Stop that gate from this session with ${GATE_STOP_COMMANDS[0]} (admitted now; it ends at its next boundary and records no check) or the harness's own task-stop tool, or wait for it to finish.`;
const gateStopCommand = (command: unknown): boolean =>
  typeof command === "string" && GATE_STOP_COMMANDS.includes(command.trim());

/** WO-135: plan start records document-only authority through planning/*.
 * Known tool destinations are checked; opaque effects retain host delegation.
 */
function planningWriteRefusal(
  input: HarnessInput,
  root: string,
  tools: HookConfig["tools"],
): string | null {
  if (input.hook_event_name !== "PreToolUse") return null;
  const inventory: HookConfig["tools"] = tools ?? harnessToolEffects;
  const tool = inventory[input.tool_name ?? ""];
  if (tool !== "write" && tool !== "shell") return null;
  if (
    !git(root, ["symbolic-ref", "--quiet", "--short", "HEAD"], true)
      .trim()
      .startsWith("planning/")
  )
    return null;
  const args = input.tool_input ?? {};
  const candidate = args.file_path ?? args.notebook_path;
  const command = args.command ?? args.cmd;
  const paths =
    tool === "write"
      ? typeof candidate === "string"
        ? [{ path: candidate, followFinalSymlink: true }]
        : null
      : typeof command === "string"
        ? shellWriteTargets(command)
        : null;
  if (!paths?.length) return null;
  const cwd = tool === "shell" ? (args.workdir ?? args.cwd ?? root) : root;
  if (typeof cwd !== "string") return null;
  const directory = prospectiveRealpath(
    isAbsolute(cwd) ? cwd : `${root}/${cwd}`,
  );
  for (const { path, followFinalSymlink } of paths) {
    const absolute = isAbsolute(path) ? path : `${directory}/${path}`;
    // Unlink removes the final directory entry, while writes follow its link.
    const physical =
      followFinalSymlink || path.endsWith(sep)
        ? prospectiveRealpath(absolute)
        : join(prospectiveRealpath(dirname(absolute)), basename(absolute));
    const local = relative(root, physical);
    if (local === ".." || local.startsWith(`..${sep}`) || isAbsolute(local))
      continue;
    if (
      local === "docs" ||
      local.startsWith(`docs${sep}`) ||
      /^[^/\\]+\.md$/i.test(local)
    )
      continue;
    return `DOTLN_HARNESS_REFUSED: planning branch write to ${path} (repository path ${local || "."}) is outside docs/ and root Markdown (WO-135). Use operator override: for authorized recovery.`;
  }
  return null;
}

/** All generated pre-tool boundaries share this guard. There is no agent-
 * supplied gate-child bypass; gate-owned subprocess writes do not dispatch tools.
 */
function activeGateWriteRefusal(
  input: HarnessInput,
  root: string,
  tools: HookConfig["tools"],
  session: HarnessSession,
): string | null {
  if (input.hook_event_name !== "PreToolUse") return null;
  const inventory: HookConfig["tools"] = tools ?? harnessToolEffects;
  const tool = inventory[input.tool_name ?? ""];
  // A spawn changes no gate input itself; its subagent's effects are guarded
  // one by one, so a read-only agent can inspect a running gate.
  if (tool !== "write" && tool !== "shell") return null;
  const args = input.tool_input ?? {};
  const runs = activeGateRuns(root);
  if (!runs.length) return null;
  if (tool === "write") {
    const path = args.file_path ?? args.notebook_path;
    if (typeof path === "string" && !gateInputPath(root, path)) return null;
  }
  if (tool === "shell") {
    const command = args.command ?? args.cmd;
    const requestedDirectory = args.workdir ?? args.cwd ?? root;
    let directory: string | null = null;
    try {
      if (typeof requestedDirectory === "string")
        directory = realpathSync.native(
          isAbsolute(requestedDirectory)
            ? requestedDirectory
            : `${root}/${requestedDirectory}`,
        );
      // Repository helpers are reviewed at the root, not at a same-named script
      // below an arbitrary tool cwd. Built-in metadata reads remain usable,
      // and so is the session's own stop request for this gate.
      if (
        directory === root &&
        (managedUsageCommand(input, session) || gateStopCommand(command))
      )
        return null;
      if (
        directory &&
        permissionEffect(input, root, tools) === "repo.read" &&
        (directory === root ||
          (typeof command === "string" && metadataCommand(command, false)))
      )
        return null;
    } catch {
      // An opaque or unclassifiable shell cannot establish that it is read-only.
    }
    let paths: readonly string[] | null = null;
    try {
      paths = typeof command === "string" ? shellWritePaths(command) : null;
    } catch {
      // Classification gaps delegate normally, but cannot prove that a shell
      // invocation leaves the inputs of an already-running gate untouched.
    }
    if (
      directory &&
      paths &&
      paths.every(
        (path) =>
          !gateInputPath(
            root,
            isAbsolute(path) ? path : `${directory}/${path}`,
          ),
      )
    )
      return null;
  }
  return `DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate ${runs.map((run) => `${run.command} (run ${run.runId}, pid ${run.pid})`).join("; ")}. ${GATE_STOP_TEXT}`;
}

function assertHarnessRuntime(
  config: Pick<HookConfig, "compilerPackageVersion" | "runtime">,
  root: string,
): void {
  if (
    config.compilerPackageVersion !== COMPILER_PACKAGE_VERSION ||
    config.runtime.skeletonVersion !== HARNESS_HOST_VERSION ||
    config.runtime.boundaryContract !== "feedback-v1"
  )
    throw new Error("pins-differ: pinned runtime version differs");
  if (!config.runtime.files?.length)
    throw new Error("runtime-unavailable: runtime pins missing");
  for (const file of config.runtime.files) {
    const path = config.runtime.snapshot
      ? `${config.runtime.snapshot}/${file.path}`
      : file.path;
    if (!existsSync(join(root, path)))
      throw new Error(
        `${config.runtime.snapshot ? "snapshot-missing" : "runtime-unavailable"}: pinned runtime file missing`,
      );
    if (
      `fnv1a64:${fnv1a64(readFileSync(contained(root, path), "utf8"))}` !==
      file.hash
    )
      throw new Error("pins-differ: pinned runtime bytes differ");
  }
}
export async function evaluateHarnessHook(
  config: HookConfig,
  input: HarnessInput,
  root: string,
  boundary: typeof feedbackBoundary,
): Promise<Record<string, unknown>> {
  if (config.event === "SessionStart") {
    const { snapshot, ...built } = config.runtime;
    assertHarnessRuntime({ ...config, runtime: built }, root);
  }
  assertHarnessRuntime(config, root);
  if (
    config.event === "SessionStart" &&
    input.hook_event_name === "SessionStart"
  ) {
    const warning = input.agent_id
      ? null
      : initializeSubagentCounter(
          harnessStateDirectory(root),
          input.session_id,
        );
    return warning
      ? subagentAdvisory(protocolAdvisory(`subagent ${warning}`))
      : {};
  }
  if (input.hook_event_name !== config.event || !input.session_id)
    throw new Error("Hook input contract mismatch");
  const session = readJson(statePath(root, input), initialSession(), true);
  const gateRefusal = activeGateWriteRefusal(
    input,
    root,
    config.tools,
    session,
  );
  if (gateRefusal) return protocolRefusal(config.event, gateRefusal);
  const planningRefusal = planningWriteRefusal(input, root, config.tools);
  if (planningRefusal) return protocolRefusal(config.event, planningRefusal);
  const correctionPath = join(
    harnessStateDirectory(root),
    `${sessionKey(input)}.correction.json`,
  );
  const correction = readJson<CorrectionState | null>(correctionPath, null);
  if (correction) session.correction = correction;
  else delete session.correction;
  const scope = readJson<HarnessReadScope | null>(
    join(harnessStateDirectory(root), "read-scope.json"),
    null,
  );
  const journal = join(
    harnessStateDirectory(root),
    `${sessionKey(input)}.jsonl`,
  );
  if (existsSync(journal)) {
    const observations = readFileSync(journal, "utf8")
      .split("\n")
      .filter(Boolean)
      .map(
        (line) =>
          JSON.parse(line) as {
            receipts?: HarnessSession["reads"];
            byteReads?: HarnessByteRead[];
          },
      );
    session.reads = observations.flatMap((row) => row.receipts ?? []);
    session.byteReads = observations.flatMap((row) => row.byteReads ?? []);
  }
  const observationScope = (): ObservationScope => ({
    sessionKey: sessionKey(input),
    usageKey: session.usageSessionKey ?? sessionKey(input),
    workOrder: session.workOrder ?? null,
    phase:
      session.intent === "resume: fix"
        ? "repair"
        : ((
            {
              executor: "implementation",
              verifier: "verification",
              reviewer: "finalReview",
            } as Record<string, string>
          )[session.role ?? ""] ??
          session.role ??
          "unknown"),
    ...(session.startedAt ? { startedAt: session.startedAt } : {}),
  });
  if (config.kind === "session") {
    if (!input.agent_id)
      initializeSubagentCounter(harnessStateDirectory(root), input.session_id);
    let additionalContext: string | undefined;
    let receipt: string | undefined;
    const intent = input.prompt?.trim() ?? "";
    const role =
      config.roles?.find((role) => role.intents.includes(intent)) ??
      config.roles?.find(
        (role) =>
          role.intents.includes(intent) ||
          role.intents.some(
            (prefix) =>
              ["planning:", "ideation:"].includes(prefix) &&
              intent.startsWith(prefix),
          ),
      );
    if (role) {
      const auxiliary =
        ["planner", "refuter"].includes(role.name) ||
        ["resume: status", "resume: times"].includes(intent);
      let control: ControlView = auxiliary
        ? {
            workOrder: null,
            workOrderPath: null,
            phase: "none",
            latestVerdict: null,
          }
        : harnessControl(root);
      const dispatched = auxiliary
        ? null
        : recordDispatch(
            root,
            input,
            control,
            intent,
            role.name,
            config.tools,
            session,
            boundary,
          );
      if (dispatched && "refusal" in dispatched)
        return protocolRefusal(config.event, dispatched.refusal);
      if (dispatched) {
        control = dispatched.control;
        receipt = dispatched.receipt;
      }
      additionalContext = `DotLn resolved role ${role.name}. Load the dotln-${role.name} skill.${control.workOrderPath ? ` Read the selected work order ${control.workOrderPath} before interpreting the phase, including a closed phase.` : " Follow its requested observation or planning/ideation procedure."} A skill grants no authority.${dispatched ? `\n${dispatched.context}` : ""}`;
      const expected: Record<string, string> = {
        "resume: next": "ImplementationReady",
        "resume: fix": "RepairCompleted",
        "resume: verify": "VerificationCompleted",
        "resume: final review": "FinalReviewCompleted",
      };
      if (!auxiliary || !session.role) {
        session.role = role.name;
        session.intent = intent;
        session.startingEventCount = localEvents(
          root,
          control.workOrder,
        ).length;
        session.startingRevision = git(root, ["rev-parse", "HEAD"]).trim();
        if (control.workOrder) session.workOrder = control.workOrder;
        session.startedAt ??= new Date().toISOString();
        session.usageSessionKey = sessionKey(input);
        session.beforeOutputs ??= outputSnapshot(root);
        session.authoredPaths ??= [];
        if (expected[intent] && control.phase !== "closed")
          session.expectedEvent = expected[intent]!;
        else delete session.expectedEvent;
      }
      const path = config.instructionFile ?? "CLAUDE.md";
      record(root, input, {
        role: role.name,
        reads: [
          {
            path,
            startLine: 1,
            endLine: physicalLines(readFileSync(contained(root, path), "utf8")),
          },
        ],
        source: "instruction-autoload",
      });
    }
    // Version is a bounded CLI observation, never the session's launch claim.
    // The input override is a harness-owned observation channel for adapters.
    let warning: string | undefined;
    const discovery = join(root, "docs/discovery/environment.json");
    if (
      existsSync(discovery) &&
      !session.versionWarning &&
      (!session.versionObservation ||
        (input.harness_version &&
          input.harness_version !== session.versionObservation.value))
    ) {
      const observation = observeSessionHarnessVersion(input.harness_version);
      const version = observation?.value;
      if (observation) session.versionObservation = observation;
      const observed = readJson<{
        effortReadbackProbe?: {
          harnesses?: Record<
            string,
            {
              versionLines?: { classification: string; line: string }[];
              versions?: { classification: string; value: string }[];
            }
          >;
        };
      }>(discovery, {});
      const harness = observed.effortReadbackProbe?.harnesses?.["claude-code"];
      const lines = [
        ...new Set([
          ...(harness?.versionLines ?? [])
            .filter((row) => row.classification === "observed")
            .map((row) => row.line),
          ...(harness?.versions ?? [])
            .filter((row) => row.classification === "observed")
            .map((row) => row.value.split(".").slice(0, 2).join(".")),
        ]),
      ];
      if (
        version &&
        !lines.includes(version.split(".").slice(0, 2).join("."))
      ) {
        warning = `DotLn: harness ${version} leaves observed lines ${lines.join(", ") || "none"}; run npm run discover -- harness.`;
        session.versionWarning = version;
      }
    }
    writeJson(statePath(root, input), session);
    // Measurement grants no effects and does not classify untyped language.
    // The session hook owns the standard token's measurement, with or without
    // the separately configured correction-effect hook.
    observeTypedCorrection(root, observationScope(), input.prompt ?? "");
    additionalContext = [
      additionalContext,
      observationBoundary(root, observationScope(), {
        ...(input.prompt ? { prompt: input.prompt } : {}),
        ...(input.transcript_path
          ? { transcriptPath: input.transcript_path }
          : {}),
      }),
    ]
      .filter(Boolean)
      .join("\n");
    // The receipt is the operator's only terminal evidence of the dispatch;
    // the briefing itself reaches the model alone.
    const notices = [receipt, warning].filter(Boolean).join("\n");
    return additionalContext
      ? {
          ...(notices ? { systemMessage: notices } : {}),
          hookSpecificOutput: {
            hookEventName: "UserPromptSubmit",
            additionalContext,
          },
        }
      : notices
        ? { systemMessage: notices }
        : {};
  }
  if (config.kind === "observe") {
    if (
      input.hook_event_name === "PostToolUse" &&
      ["Agent", "Task"].includes(input.tool_name ?? "")
    )
      linkSubagentResult(harnessStateDirectory(root), input);
    const authorship = observeAuthorship(input, root, session);
    if (input.hook_event_name === "PreToolUse") {
      record(root, input, {
        role: session.role,
        ...(authorship ? { authorship } : {}),
        toolStep: true,
        commandRun: ["Bash", "exec_command"].includes(input.tool_name ?? ""),
      });
      writeJson(statePath(root, input), session);
      return {};
    }
    const before = session.reads.length;
    const rangesBefore = session.byteReads?.length ?? 0;
    const paths = observeRead(input, root, session);
    const outside = scope
      ? paths.filter(
          (read) =>
            !scope.reads.some(
              (entry) =>
                entry.path === read.path &&
                entry.startLine <= read.startLine &&
                entry.endLine >= read.endLine,
            ),
        )
      : [];
    record(root, input, {
      reads: paths,
      role: session.role,
      workOrder: observationScope().workOrder,
      phase: observationScope().phase,
      ...(observeBackgroundTool(
        input.tool_name ?? "",
        input.tool_input ?? {},
        input.tool_response ?? {},
        new Date().toISOString(),
        input.tool_use_id,
      ) ?? {}),
      ...(authorship ? { authorship } : {}),
      receipts: session.reads.slice(before),
      byteReads: session.byteReads?.slice(rangesBefore) ?? [],
      ...(outside.length ? { outsideDirectedSet: outside } : {}),
    });
    writeJson(statePath(root, input), session);
    if (outside.length)
      return protocolAdvisory("observed read outside the directed set");
    return {};
  }
  if (config.kind === "finish") {
    if (!config.policy) throw new Error("Missing compiled finish policy");
    const unmet: string[] = [];
    try {
      for (const unit of config.policy.units) {
        if (
          !["application-evidence", "output-review", "complete-scope"].includes(
            unit.trigger,
          )
        )
          continue;
        const policy = compileFeedbackUnits([{ ...unit, enforcement: "hard" }]);
        const facts = harnessFeedbackFacts(policy, input, root, session);
        try {
          for (const fact of facts) boundary(policy, fact, () => {});
        } catch (error) {
          if (!(error instanceof FeedbackRefused)) throw error;
          unmet.push(unit.unitId);
        }
      }
    } finally {
      releaseHarnessWriter(root, input);
      if (session.role && session.startedAt) {
        try {
          measureHarnessSessionUsage(
            root,
            session,
            sessionKey(input),
            input.transcript_path,
          );
        } catch {
          unmet.push("process-cost observation could not be recorded");
          record(root, input, { usage: "collection-failed" });
        }
      }
      const obligations = harnessOutputObligations(root, session);
      record(root, input, {
        finished: true,
        completionReady: unmet.length === 0,
        advisory: unmet,
        outputCount: obligations.filter((row) => row.obligation === "read")
          .length,
        outputBytes: obligations
          .filter((row) => row.obligation === "read")
          .reduce((sum, row) => sum + row.bytes, 0),
      });
    }
    return {
      systemMessage: [
        subagentSummary(
          subagentUsage(root, harnessStateDirectory(root), input.session_id),
        ),
        observationBoundary(root, observationScope(), {
          stop: true,
          reentry: input.stop_hook_active === true,
          ...(input.transcript_path
            ? { transcriptPath: input.transcript_path }
            : {}),
        }),
        ...(unmet.length
          ? [
              `DotLn advisory: pending ${unmet.join(", ")}; these observations do not block lifecycle completion.`,
            ]
          : []),
      ].join("\n"),
    };
  }
  if (config.kind === "permission") {
    if (!config.envelope) throw new Error("Missing compiled authority");
    const spawn = config.tools?.[input.tool_name ?? ""] === "spawn";
    const admission =
      spawn || input.agent_id
        ? admitSubagentTool(root, harnessStateDirectory(root), input, spawn)
        : undefined;
    if (admission?.refusal)
      return protocolRefusal(config.event, admission.refusal);
    // A counter advisory never bypasses the existing permission classification.
    if (admission?.advisory)
      record(root, input, {
        subagents: admission.usage,
        advisory: admission.advisory,
      });
    const scopeResult = scope ? readScopeRefusal(input, root, scope) : null;
    if (scopeResult) {
      record(root, input, {
        allowed: true,
        readScopeObservation: scopeResult.reason,
        ...(scopeResult.attemptedRead
          ? { attemptedRead: scopeResult.attemptedRead }
          : {}),
      });
    }
    if (scopeResult) return protocolAdvisory(scopeResult.reason);
    const effect = permissionEffect(input, root, config.tools);
    const decision = harnessAuthorization(
      session.correction
        ? {
            ...config.envelope,
            allowedEffects: config.envelope.allowedEffects.filter((effect) =>
              session.correction!.allowedEffects.includes(effect),
            ),
          }
        : config.envelope,
      effect,
      Date.now(),
    );
    record(root, input, { effect, allowed: decision.authorized });
    return decision.authorized
      ? admission?.advisory
        ? subagentAdvisory({ systemMessage: admission.advisory })
        : {}
      : protocolAdvisory(`compiled authority does not permit ${effect}`);
  }
  if (!config.policy) throw new Error("Missing compiled unit");
  if (
    config.policy.units[0]?.trigger === "semantic-correction" &&
    config.correctionToken &&
    input.prompt?.startsWith(config.correctionToken)
  ) {
    session.correction = applyFeedbackCorrection(
      config.policy,
      session.correction ?? {
        allowedEffects: [...(config.envelope?.allowedEffects ?? [])],
        destructiveEffects: [
          "repo.write",
          "repo.delete",
          "shell.run",
          "git.local",
          "lifecycle.run",
        ],
        scopeExpansionAllowed: true,
        preserveEvidence: false,
        diagnosisRequired: false,
        corrections: [],
      },
      {
        type: "OperatorCorrectionReceived",
        eventId: `correction:${session.correction?.corrections.length ?? 0}`,
      },
    );
    writeJson(correctionPath, session.correction);
    record(root, input, {
      typedEvent: "OperatorCorrectionReceived",
      eventId: `correction-effect:${session.correction.corrections.length - 1}`,
      // The compiled session hook measures this standard prompt exactly once.
      // Custom effect tokens retain their own journal-derived measurement.
      measurement: config.correctionToken !== "correction:",
      workOrder: observationScope().workOrder,
      phase: observationScope().phase,
      units: namedJudgmentUnits(input.prompt),
      correction: session.correction,
    });
    return {
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: `Compiled typed-correction response: ${JSON.stringify({ allowedEffects: session.correction.allowedEffects, scopeExpansionAllowed: session.correction.scopeExpansionAllowed, preserveEvidence: session.correction.preserveEvidence, diagnosisRequired: session.correction.diagnosisRequired })}`,
      },
    };
  }
  const facts = harnessFeedbackFacts(config.policy, input, root, session);
  try {
    for (const fact of facts) boundary(config.policy, fact, () => {});
    record(root, input, {
      unitIds: config.policy.units.map((unit) => unit.unitId),
      allowed: true,
      factKinds: facts.map((fact) => fact.kind),
    });
    return {};
  } catch (error) {
    if (!(error instanceof FeedbackRefused)) throw error;
    const reentry = stopReentry(input);
    record(root, input, {
      unitIds: config.policy.units.map((unit) => unit.unitId),
      allowed: false,
      factKinds: facts.map((fact) => fact.kind),
      ...(reentry ? { stopReentry: true } : {}),
    });
    if (reentry) return {};
    const foreignWriter = facts.some(
      (fact) =>
        fact.kind === "writer-isolation" &&
        fact.writable &&
        fact.writers.some(
          (writer) =>
            writer.worktree === fact.worktree &&
            writer.actorId !== fact.actorId,
        ),
    );
    const reason = feedbackRefusalReason(error, facts, root);
    return foreignWriter
      ? protocolRefusal(config.event, `DOTLN_HARNESS_REFUSED: ${reason}`)
      : protocolAdvisory(reason);
  }
}

export async function runHarnessHook(
  config: HookConfig,
  boundary: typeof feedbackBoundary,
  decodedInput?: unknown,
  inputText?: string,
): Promise<void> {
  let observed: { root: string; input: HarnessInput } | undefined;
  let response: Record<string, unknown> = {};
  let reasonClass: string =
    config.kind === "permission" ? "authority" : config.kind;
  try {
    // Hook input arrives on a pipe. Drain it through the event loop: a traced
    // synchronous fd-0 read stalled before evaluation under Node 22 on macOS.
    let value = decodedInput;
    if (inputText !== undefined || decodedInput === undefined) {
      try {
        value = JSON.parse(inputText ?? (await streamText(process.stdin)));
      } catch {
        process.stdout.write(
          JSON.stringify(
            protocolRefusal(
              config.event,
              "DOTLN_HARNESS_INPUT_REFUSED: INVALID_JSON at $: invalid JSON",
            ),
          ),
        );
        return;
      }
    }
    const decoded = decodeHarnessInput(
      value,
      config.kind === "session" ? undefined : config.event,
    );
    if (!decoded.ok) {
      process.stdout.write(
        JSON.stringify(
          protocolRefusal(
            config.event,
            `DOTLN_HARNESS_INPUT_REFUSED: ${decoded.code} at ${decoded.path}: ${decoded.message}`,
          ),
        ),
      );
      return;
    }
    const input = decoded.value;
    if (config.kind === "session" && input.hook_event_name === "SessionStart")
      config = { ...config, event: "SessionStart" };
    const root = harnessRoot(input.cwd);
    observed = { root, input };
    const installedRoot = realpathSync(
      fileURLToPath(new URL("../../../../", import.meta.url)),
    );
    if (
      installedRoot !== realpathSync(join(root, config.runtime.snapshot ?? "."))
    )
      throw new Error("Hook and worktree roots disagree");
    response = await evaluateHarnessHook(config, input, root, boundary);
  } catch (error) {
    reasonClass =
      error instanceof HarnessObserverInput
        ? "observer-input"
        : error instanceof HarnessCommandRefused
          ? "classification"
          : error instanceof HarnessStateUnreadable
            ? "unreadable-state"
            : error instanceof Error &&
                /^(pins-differ|snapshot-missing):/.test(error.message)
              ? error.message.split(":")[0]!
              : "runtime-unavailable";
    // An unexpected failure names its class and a bounded message so it is
    // never mistaken for a policy refusal; typed refusals carry their own.
    const failure =
      error instanceof Error
        ? `${error.constructor.name}: ${error.message.replace(/[\u0000-\u001f\u007f]+/g, " ").slice(0, 120)}`
        : "non-error failure";
    response = protocolAdvisory(
      error instanceof HarnessObserverInput
        ? `observer input unavailable: ${error.message}`
        : error instanceof HarnessCommandRefused
          ? `command classification: ${error.message}`
          : error instanceof HarnessStateUnreadable
            ? error.message
            : `${reasonClass}: host facts or pinned runtime unavailable (${failure}); run node scripts/bootstrap.mjs to prepare this worktree`,
    );
  } finally {
    if (observed) {
      try {
        const { root, input } = observed;
        const permission = response.hookSpecificOutput as
          { permissionDecision?: string } | undefined;
        const refused =
          response.decision === "block" ||
          permission?.permissionDecision === "deny";
        record(root, input, {
          ...(typeof response.systemMessage === "string" &&
          response.systemMessage.includes("DotLn advisory:")
            ? { advisory: response.systemMessage, delegated: true }
            : {}),
          // Retain each hook outcome but correlate denials of the same tool use.
          // Raw tool/session identities and command bytes stay out of the row.
          ...(refused
            ? {
                refusal: {
                  reasonClass,
                  ...(typeof input.tool_use_id === "string" && input.tool_use_id
                    ? {
                        invocationKey: digest(
                          JSON.stringify([
                            input.session_id,
                            input.hook_event_name,
                            input.tool_name ?? null,
                            input.tool_use_id,
                          ]),
                        ),
                      }
                    : {}),
                },
              }
            : {}),
          hookTiming: {
            kind: config.kind,
            // A generated hook owns this Node process. Its uptime includes module
            // loading and evaluation, ending immediately before this journal append.
            durationMs: performance.now(),
            gateChild: process.env.DOTLN_GATE_CHILD === "1",
          },
        });
      } catch {
        // Missing optional observation never changes the guard verdict.
      }
    }
  }
  if (
    typeof response.systemMessage === "string" &&
    response.systemMessage.startsWith("DotLn advisory:")
  ) {
    const cause = [
      "pins-differ",
      "snapshot-missing",
      "runtime-unavailable",
    ].includes(reasonClass)
      ? reasonClass
      : subagentAdvisories.has(response)
        ? `subagent-budget:${response.systemMessage.includes("counter missing") ? "missing" : response.systemMessage.includes("unreadable") ? "unreadable" : response.systemMessage.includes("at least") ? "overlap" : "unavailable"}`
        : `advisory:${digest(response.systemMessage)}`;
    if (
      !showHarnessAdvisory(
        observed?.input.session_id,
        config.event,
        cause,
        (key) => {
          const directory = join(
            observed?.root ?? process.cwd(),
            "docs/control/local/harness",
          );
          mkdirSync(directory, { recursive: true, mode: 0o700 });
          const marker = join(
            directory,
            createHash("sha256").update(key).digest("hex") + ".advisory",
          );
          try {
            writeFileSync(
              marker,
              JSON.stringify({
                sessionKey: digest(String(observed?.input.session_id)),
                owner: harnessHostProcess(),
              }) + "\n",
              { flag: "wx", mode: 0o600 },
            );
          } catch (error) {
            if (
              error &&
              typeof error === "object" &&
              "code" in error &&
              error.code === "EEXIST"
            )
              return !lstatSync(marker).isFile();
            throw error;
          }
          return true;
        },
      )
    )
      delete response.systemMessage;
  }
  process.stdout.write(JSON.stringify(response));
}
export async function runCommitMessageHook(
  config: Pick<HookConfig, "compilerPackageVersion" | "runtime"> & {
    readonly policy: CompiledFeedback;
  },
  boundary: typeof feedbackBoundary,
): Promise<void> {
  try {
    assertHarnessRuntime(config, harnessRoot(process.cwd()));
    if (process.argv.length !== 3)
      throw new Error("Missing commit message path");
    boundary(
      config.policy,
      { kind: "attribution", message: readFileSync(process.argv[2]!, "utf8") },
      () => {},
    );
  } catch {
    process.stderr.write("DOTLN_HARNESS_REFUSED: commit-message boundary\n");
    process.exitCode = 1;
  }
}
/** Release only this session's reservation, after the host has observed completion. */
export function releaseHarnessWriter(root: string, input: HarnessInput): void {
  const actorId = sessionKey(input);
  const legacy = readJson<HarnessWriter | null>(legacyWriterLock(root), null);
  if (legacy?.actorId === actorId) {
    rmSync(legacyWriterLock(root), { force: true });
    appendWriterEvent(root, {
      event: "released",
      actorId,
      ...ownerFields(legacy.owner),
    });
  }
  const observation = observeWriterLock(root);
  if (observation.state !== "held") return;
  const { instance } = observation;
  if (
    instance.writer.actorId !== actorId ||
    !retireWriterInstance(root, instance)
  )
    return;
  appendWriterEvent(root, {
    event: "released",
    actorId,
    ...ownerFields(instance.writer.owner),
  });
}
/**
 * Operator-facing release from outside a governed session. The liveness
 * decision, the retirement and the recorded event describe one observed
 * reservation. A holder that changes after the decision is judged again by
 * the same rule; a forced release of a holder that changed refuses, because
 * the operator judged a different one. A live owner refuses without force.
 */
export function releaseHarnessWriterByOperator(root: string, force = false) {
  for (let attempt = 0; attempt < 16; attempt++) {
    const { observation, writer } = observeWriterHolder(root);
    if (!writer)
      return {
        contract: "harness-writer-v1" as const,
        reserved: false as const,
        released: false,
      };
    const view = writerView(writer);
    if (view.alive === true && !force)
      throw new Error(
        "Writer reservation owner is alive; end that session or pass --force",
      );
    const retired =
      observation.state === "held"
        ? retireWriterInstance(root, observation.instance)
        : unlinkIfPresent(legacyWriterLock(root));
    if (!retired) {
      if (force)
        throw new Error(
          "Writer reservation changed while releasing; inspect it again before forcing",
        );
      continue;
    }
    appendWriterEvent(root, {
      event: "operator-released",
      actorId: view.actorId,
      ...ownerFields(view.owner),
      alive: view.alive,
      forced: force,
    });
    return { ...view, released: true };
  }
  throw new Error("Writer reservation release exceeded its retry budget");
}

/** The target's runtime is in the launchpad snapshot; only Git facts use target cwd. */
export async function runTargetHarnessHook(
  config: HookConfig,
  boundary: typeof feedbackBoundary,
): Promise<void> {
  const deny = (reason: string) => protocolRefusal("PreToolUse", reason);
  let response: Record<string, unknown>;
  try {
    const decoded = decodeHarnessInput(
      JSON.parse(await streamText(process.stdin)),
      "PreToolUse",
    );
    if (!decoded.ok) throw new Error("target hook input unavailable");
    const input = decoded.value;
    const root = harnessRoot(input.cwd);
    if (digest(root) !== config.runtime.targetId)
      throw new Error("target worktree binding differs");
    const snapshot = realpathSync(
      fileURLToPath(new URL("../../../../", import.meta.url)),
    );
    const launchpad = realpathSync(join(snapshot, "../../.."));
    if (
      !config.runtime.snapshot ||
      realpathSync(join(launchpad, config.runtime.snapshot)) !== snapshot
    )
      throw new Error("target immutable runtime binding differs");
    assertHarnessRuntime(config, launchpad);
    const directory = join(
      launchpad,
      "docs/control/local/harness/targets",
      digest(root),
    );
    // Refuse symlinked local state rather than following a target-controlled route.
    let parent = launchpad;
    for (const part of relative(launchpad, directory).split(sep)) {
      parent = join(parent, part);
      const info = lstatSync(parent, { throwIfNoEntry: false });
      if (info && (!info.isDirectory() || info.isSymbolicLink()))
        throw new Error("target state directory unavailable");
    }
    response = await targetState.run({ root, directory }, async () => {
      let result: Record<string, unknown>;
      try {
        if (config.kind === "permission") {
          if (!config.envelope)
            throw new Error("compiled target authority missing");
          const effect = permissionEffect(input, root, config.tools);
          if (
            !harnessAuthorization(config.envelope, effect, Date.now())
              .authorized
          )
            throw new Error(`compiled authority does not permit ${effect}`);
          const tool = config.tools?.[input.tool_name ?? ""];
          const args = input.tool_input ?? {};
          const protect = (candidate: string) => {
            const path = contained(root, candidate);
            const local = relative(root, path).toLowerCase();
            const protectedPaths = [
              ".git",
              "claude.local.md",
              ".dotln",
              ".claude/settings.json",
              ".claude/target-worker-manifest.json",
              ".claude/hooks/permissions.mjs",
              ".claude/hooks/concurrent-work-requires-worktrees.mjs",
              ".claude/hooks/no-attribution.mjs",
            ];
            if (
              protectedPaths.some(
                (entry) =>
                  local === entry ||
                  local.startsWith(`${entry}/`) ||
                  entry.startsWith(`${local}/`),
              )
            )
              throw new Error(
                "target bundle or host scratch is outside the writable surface",
              );
            let destination = root;
            for (const part of relative(root, path).split(sep)) {
              destination = join(destination, part);
              const info = lstatSync(destination, { throwIfNoEntry: false });
              if (
                info &&
                (info.isSymbolicLink() ||
                  (!info.isDirectory() && (!info.isFile() || info.nlink !== 1)))
              )
                throw new Error(
                  "target write requires ordinary unlinked file paths",
                );
            }
          };
          if (tool === "write") {
            const path = args.file_path ?? args.notebook_path;
            if (typeof path !== "string")
              throw new Error("target write path unavailable");
            protect(path);
          } else if (tool === "shell") {
            const cwd = args.workdir ?? args.cwd ?? root;
            if (
              typeof cwd !== "string" ||
              realpathSync(resolve(root, cwd)) !== root
            )
              throw new Error("target shell requires worktree-root cwd");
            const command = args.command ?? args.cmd;
            const hostCommand =
              typeof command === "string" &&
              sourceChangeCommandEffect(launchpad, root, command);
            if (
              hostCommand &&
              !harnessAuthorization(config.envelope, hostCommand, Date.now())
                .authorized
            )
              throw new Error(
                `compiled authority does not permit ${hostCommand}`,
              );
            const paths = hostCommand
              ? []
              : typeof command === "string"
                ? shellWritePaths(command)
                : null;
            if (paths === null)
              throw new Error(
                "target shell destinations unavailable; host must run opaque commands",
              );
            for (const path of paths) protect(path);
          } else if (tool === "spawn" || tool === "interaction") {
            throw new Error(
              "target delegation or interaction has no bounded worker adapter",
            );
          }
          result = {};
        } else if (config.kind === "feedback" && config.policy) {
          const facts = harnessFeedbackFacts(
            config.policy,
            input,
            root,
            initialSession(),
          );
          for (const fact of facts) boundary(config.policy, fact, () => {});
          result = {};
        } else throw new Error("target guard configuration unavailable");
      } catch (error) {
        const reason =
          error instanceof FeedbackRefused
            ? "compiled feedback refused target effect"
            : error instanceof HarnessCommandRefused
              ? "target effect classification unavailable"
              : error instanceof Error
                ? error.message
                : "target guard unavailable";
        result = deny(`DOTLN_TARGET_REFUSED: ${reason}`);
      }
      record(root, input, {
        kind: config.kind,
        allowed: !result.hookSpecificOutput,
      });
      return result;
    });
  } catch {
    response = deny(
      "DOTLN_TARGET_RUNTIME_REFUSED: pinned launchpad runtime or target facts unavailable",
    );
  }
  process.stdout.write(JSON.stringify(response));
}
