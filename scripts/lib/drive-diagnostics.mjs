import {
  drivenResearchCommandKind,
  shellWords,
} from "../../packages/skeleton/dist/src/harness-command.js";
import { STOPS } from "../../packages/skeleton/src/stops.mjs";
import {
  LEGAL_ACTIONS,
  LIFECYCLE_PHASES,
  LIFECYCLE_ROUTES,
} from "./lifecycle-actions.mjs";

// A refusal of the kit's guard names its stop in one fixed sentence; only an
// id of the table is kept of it.
const STOP_IDS = new Set(STOPS.map((entry) => entry.id));

// Pure readings of what a native host said. Nothing here holds state, so each
// classifier can be judged from its text alone.

// Only a single parsed command supplies a research observation. A successful
// compound shell line cannot establish that an individual lookup succeeded.
export function researchCommandKind(source) {
  try {
    return drivenResearchCommandKind(source);
  } catch {
    /* Unparsed shell text is not evidence of a research operation. */
  }
  return null;
}

// A native host wraps a command in its shell; the words inside are the command.
function shellBody(source, options = {}) {
  const invocations = shellWords(source, options);
  const words = invocations[0]?.words;
  return invocations.length === 1 &&
    words?.length === 3 &&
    words.every((word) => !word.dynamic && !word.expands && !word.redirects) &&
    ["zsh", "bash", "sh"].includes(commandBasename(words[0].value)) &&
    ["-c", "-lc"].includes(words[1].value)
    ? words[2].value
    : source;
}

// A command's shape keeps a word only in the place this grammar gives it: a
// program where a command starts, named without its path; a kit script
// where node runs it, or where it is run as a program; a subcommand in the
// subcommand place of the program or script that owns it; and a flag the
// program or script it is given to takes. Every other word is data the
// command was given and is masked whatever its spelling: a file named `next`
// given to `cat`, a search for `drive.mjs` or for `--work-order`, and every
// word given to a program the grammar does not know. No path, query,
// environment value or output text is kept. This makes a failed command
// diagnosable without keeping what it was given.
const OPERAND = "<operand>";
// Earlier writers discarded the distinction between a script's basename
// and the basename of a redirect target, or read a redirection (`>|`, one
// with no target) and `$'…'` quoting as the shell does not, which left a
// word standing where the next command's program stands. The account can
// show the layout of those shapes, but cannot recover the role of a
// retained word.
export const COMMAND_SHAPE_VERSION = 4;
// A leading `NAME=value` word sets the command's environment: neither the
// name nor the value is kept.
const ASSIGNMENT = "<assignment>";
/** @param {string} word */
const isAssignment = (word) =>
  word === ASSIGNMENT || /^[A-Za-z_][A-Za-z0-9_]*\+?=/u.test(word);
// An unrecognized option can consume another word or change how the program
// interprets all later arguments. Its spelling and the entire suffix are masked.
const FLAG = "<flag>";
/** @param {string} word */
const isFlag = (word) => word === FLAG || word.startsWith("-");
const PROGRAMS = new Set([
  "node",
  "npm",
  "npx",
  "gh",
  "git",
  "pwd",
  "printenv",
  "cd",
  "echo",
  "printf",
  "ls",
  "test",
  "env",
  "cat",
  "rm",
  "rmdir",
  "mv",
  "cp",
  "ln",
  "mkdir",
  "touch",
  "chmod",
  "find",
  "grep",
  "sed",
  "awk",
  "head",
  "tail",
  "wc",
  "sh",
  "bash",
  "zsh",
  "python3",
  "curl",
]);
// An assignment value can end in any basename. Only a literal path can
// identify a program or script.
/** @param {string} word */
const commandBasename = (word) =>
  word.includes("=") ? "" : (word.split("/").at(-1) ?? "");
/** The program a command's first word runs, named without its directories,
 * or null for a program the grammar does not know.
 * @param {string} word */
const programName = (word) => {
  const name = commandBasename(word);
  return PROGRAMS.has(name) ? name : null;
};
// Only options of known arity in their owner's command line are retained.
/** @type {Record<string, Set<string>>} */
const FLAGS_OF = {
  npm: new Set(["--prefix", "--silent"]),
  resume: new Set(["--work-order"]),
  "resume status": new Set(["--json", "--work-order"]),
  "harness writer": new Set(["--show"]),
  "harness evidence": new Set(["--wait", "--stop"]),
  "harness read-output options": new Set(["--offset", "--length"]),
  "release close options": new Set(["--publish", "--dry-run"]),
  "release prepare": new Set(["--local"]),
  "worktree close options": new Set(["--dry-run"]),
  drive: new Set(["--host"]),
  "plan followups": new Set(["--sync"]),
  "target-gate options": new Set(["--review"]),
  "test-runner": new Set(["--review", "--document"]),
  git: new Set(["-C", "--no-pager"]),
  "git rev-parse": new Set(["--show-toplevel"]),
  "git diff": new Set([
    "--stat",
    "--name-only",
    "--no-ext-diff",
    "--no-textconv",
    "--",
  ]),
  "git log": new Set(["--oneline", "--stat", "--name-only", "--"]),
  "git status": new Set(["--porcelain", "--"]),
  "git-worktree list": new Set(["--porcelain"]),
  pwd: new Set(["-P"]),
  grep: new Set(["-F", "--"]),
};
// These commands read a required positional argument before their options.
const BEFORE_OPTIONS = new Set([
  "release close",
  "worktree close",
  "target-gate",
  "harness read-output",
]);
// A flag whose next word is its value, which is data.
const VALUED_FLAGS = new Set([
  "-C",
  "--prefix",
  "--offset",
  "--length",
  "--work-order",
  "--host",
]);
// The kit's scripts a shape names by file name, each with the owner of the
// subcommand place that follows it.
const KIT_SCRIPTS = new Map([
  ["resume.mjs", "resume"],
  ["harness.mjs", "harness"],
  ["drive.mjs", "drive"],
  ["target-gate.mjs", "target-gate"],
  ["release.mjs", "release"],
  ["worktree.mjs", "worktree"],
  ["refute-plan.mjs", "plan"],
  ["test-runner.mjs", "test-runner"],
]);
/** @param {string} word */
const scriptName = (word) => {
  const name = commandBasename(word);
  return KIT_SCRIPTS.has(name) ? name : null;
};
// The place after which `--` starts a command of its own.
const NESTED = "nested command";
/** @param {string[]} words @param {string | null} [then] */
const places = (words, then = null) =>
  Object.fromEntries(words.map((word) => [word, then]));
// What each owner takes in its subcommand place, each word with the owner of
// the place after it, or null where none follows. `npm run` takes the kit's
// package scripts by name, so a shape can identify which script receives
// the arguments npm forwards.
/** @type {Record<string, Record<string, string | null>>} */
const SUBCOMMANDS = {
  npm: { run: "npm run", test: null },
  "npm run": {
    resume: "resume",
    harness: "harness",
    worktree: "worktree",
    release: "release",
    plan: "plan",
    "work-orders": "work-orders",
    adjacent: "adjacent",
    worker: "worker",
    features: "features",
    ...places(["test", "test:docs", "test:full", "format", "sync", "meta"]),
  },
  git: {
    ...places(["rev-parse", "diff", "show", "log", "ls-files", "status"]),
    worktree: "git-worktree",
  },
  // A key of this table, named so that no scan of the kit's Git forms reads
  // it as a command this module runs.
  "git-worktree": places(["list"]),
  gh: places(["api"]),
  resume: places([
    "status",
    "briefing",
    "usage",
    "next",
    "fix",
    "verify",
    "final-review",
    "implementation-ready",
    "repair-complete",
    "verification-result",
    "final-review-result",
    "target-records",
    "release-close",
  ]),
  harness: {
    ...places([
      "usage",
      "scratch",
      "begin",
      "observe",
      "delivered",
      "read-output",
      "evidence",
      "writer",
    ]),
    bounded: NESTED,
  },
  drive: places(["why", "worker-entry", "status"]),
  release: places(["close", "prepare"]),
  worktree: places(["integrate", "close", "status"]),
  plan: places(["followups"]),
  "work-orders": places(["index", "list", "show"]),
  adjacent: places(["apply", "list"]),
  worker: places(["list", "show"]),
  features: places(["list"]),
};

/** Keep the prefix whose argument roles are established. A current shape can
 * pass through the same grammar again when read from a record.
 * @param {readonly string[]} words @param {"shell" | "env" | "none"} [assignments] @returns {string[]} */
export function shapeWords(words, assignments = "shell") {
  /** @type {string[]} */
  const shape = [];
  let index = 0;
  while (
    index < words.length &&
    assignments !== "none" &&
    (isAssignment(words[index]) ||
      (assignments === "env" && words[index].includes("=")))
  ) {
    shape.push(ASSIGNMENT);
    index++;
  }
  if (index === words.length) return shape;
  const first = words[index++];
  const name = programName(first) ?? scriptName(first);
  shape.push(name ?? OPERAND);
  let place = name && (KIT_SCRIPTS.get(name) ?? name);

  for (; index < words.length; index++) {
    const word = words[index];
    if (!place) {
      shape.push(OPERAND);
      continue;
    }
    if (BEFORE_OPTIONS.has(place)) {
      shape.push(OPERAND);
      place =
        place === "harness read-output" ||
        word === OPERAND ||
        /^WO-\d{3}$/u.test(word)
          ? `${place} options`
          : null;
      continue;
    }
    if (word === "--" && (place === NESTED || place === "env")) {
      shape.push("--");
      return [
        ...shape,
        ...shapeWords(words.slice(index + 1), place === "env" ? "env" : "none"),
      ];
    }
    if (FLAGS_OF[place]?.has(word)) {
      shape.push(word);
      if (word === "--") place = null;
      else if (VALUED_FLAGS.has(word) && index + 1 < words.length) {
        shape.push(OPERAND);
        index++;
      }
      continue;
    }
    if (isFlag(word)) {
      shape.push(FLAG);
      place = null;
      continue;
    }
    if (place === "env")
      return [...shape, ...shapeWords(words.slice(index), "env")];
    const script = place === "node" ? scriptName(word) : null;
    if (script) {
      shape.push(script);
      place = KIT_SCRIPTS.get(script) ?? null;
      continue;
    }
    const subcommands = SUBCOMMANDS[place];
    if (subcommands && Object.hasOwn(subcommands, word)) {
      shape.push(word);
      if (place === "npm run" || (place === "npm" && word === "test")) {
        // npm passes this separator's suffix to the selected package script.
        place = null;
        if (words[index + 1] === "--") {
          shape.push("--");
          index++;
          place = subcommands[word] ?? (word === "test" ? "test-runner" : null);
        }
      } else place = subcommands[word] ?? `${place} ${word}`;
      continue;
    }
    shape.push(OPERAND);
    place = null;
  }
  return shape;
}

/** A current shape is checked again before display. An older or unknown
 * writer left no evidence that a vocabulary word was an operation.
 * @param {unknown} shape @param {unknown} version @returns {string[][] | null} */
export const judgedShape = (shape, version) =>
  Array.isArray(shape)
    ? shape
        .filter((words) => Array.isArray(words))
        .map((words) => {
          const values = words.map((word) =>
            typeof word === "string" ? word : OPERAND,
          );
          if (version === COMMAND_SHAPE_VERSION) return shapeWords(values);
          return values.map((word) => {
            if (word === ASSIGNMENT || word === OPERAND) return word;
            return isFlag(word) ? FLAG : "<word>";
          });
        })
    : null;

/** @param {string} source */
export function commandShape(source) {
  try {
    const options = { simpleLists: true };
    return shellWords(shellBody(source, options), options)
      .slice(0, 6)
      .map((invocation) => {
        const words = invocation.words.slice(0, 16);
        // A redirect or expansion can change which word occupies the next
        // argument position. Quoting an assignment can make it a program
        // name, and a quoted placeholder is ordinary caller-supplied text.
        const uncertain = words.findIndex(
          (word) =>
            word.redirects ||
            word.dynamic ||
            (word.expands && !isAssignment(word.value)) ||
            (word.quoted && isAssignment(word.value)) ||
            [ASSIGNMENT, FLAG, OPERAND].includes(word.value),
        );
        const end = uncertain < 0 ? words.length : uncertain;
        return [
          ...shapeWords(words.slice(0, end).map((word) => word.value)),
          ...words.slice(end).map(() => OPERAND),
        ];
      });
  } catch {
    return null;
  }
}

export function diagnosticSignals(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return [
    ["fetch-failed", /fetch failed|failed to fetch|unable to fetch/i],
    ["network-resolution", /\b(?:ENOTFOUND|EAI_AGAIN)\b/],
    ["connection-refused", /\bECONNREFUSED\b/],
    ["network-timeout", /\b(?:ETIMEDOUT|ERR_SOCKET_TIMEOUT)\b/],
    ["proxy-tunnel", /ERR_PROXY_TUNNEL|proxy.*(?:denied|failed|unsupported)/i],
    ["certificate", /certificate|\bTLS\b|\bSSL\b/i],
    ["quota", /quota|rate[ _-]limit|\b429\b/i],
    [
      "context-limit",
      /context[ _-](?:window|length).*(?:exceed|full|exhaust)|maximum context length|too many input tokens/i,
    ],
    [
      "usage-limit",
      /usage[ _-]limit|insufficient[ _-]quota|credit balance|out of (?:codex )?credits/i,
    ],
    [
      "authentication",
      /authentication (?:failed|required)|unauthori[sz]ed|invalid (?:api key|authentication)|\b401\b/i,
    ],
    [
      "provider-unavailable",
      /provider.*unavailable|server (?:error|overloaded)|temporarily unavailable|overloaded|\b50[0234]\b/i,
    ],
    [
      "stream-disconnected",
      /stream.*(?:disconnect|closed|end).*before|connection (?:reset|closed)|unexpected (?:end|eof)|\bECONNRESET\b/i,
    ],
    ["filesystem-permission", /\b(?:EACCES|EPERM)\b/],
    ["cache", /\bcache\b/i],
    ["npm-user-cache", /\/\.npm\//],
    ["order-tool-cache", /\/local\/native-tools\/npm-cache/],
    ["context7-config", /\/\.config\/context7\//],
    ["registry-endpoint", /registry\.npmjs\.org/],
    ["context7-endpoint", /context7\.com/],
    [
      "package-command-missing",
      /Missing script:|command not found|Cannot find module|\bENOENT\b/i,
    ],
    [
      "unsupported-argument",
      /(?:unknown|unrecognized|unsupported|unexpected|invalid) (?:option|argument)/i,
    ],
    [
      "session-unavailable",
      /session.*(?:unavailable|not found)|Begin the harness session/i,
    ],
    ["already-exists", /already exists/i],
    ["outside-root", /\bOUTSIDE_ROOT\b/],
    [
      "host-permission",
      /permission.*(?:denied|refused)|not allowed|not permitted/i,
    ],
    // Codex's automatic review prints its rejection on stderr; the receipt
    // names the decider without the rationale's prose (WO-247).
    [
      "auto-review-rejected",
      /rejected due to unacceptable risk|blocked by auto-review|guardian review/i,
    ],
    ["target-opaque", /target shell destinations unavailable/i],
    ["target-authority", /compiled authority does not permit/i],
    ["target-feedback", /compiled feedback refused/i],
    ["target-runtime", /DOTLN_TARGET_RUNTIME_REFUSED/],
  ]
    .filter(([, pattern]) => pattern.test(text ?? ""))
    .map(([signal]) => signal);
}

// One reading of a failed lifecycle dispatch for both native streams. The
// dispatch bound names its own way forward, which only the operator can take.
export const lifecycleRefusal = (text) =>
  /DOTLN_DISPATCH_BOUND/.test(text)
    ? "The dispatch bound stopped this phase. Use analysis: to diagnose, or authorize more in the conversation so the agent records npm run resume -- accept-overrun."
    : /refused|not a legal dispatch|reserved by another/i.test(text)
      ? "The worker's lifecycle dispatch was refused; inspect the named dispatch or writer condition before re-entry."
      : null;

// The words a refused dispatch may be told in, each taken from where the kit
// itself writes it: the phrases and actions a drive routes, the phases
// canonical status names and the actions it can call legal. Nothing else of
// a refusal's text is kept.
const DISPATCH_INTENTS = new Set([
  ...Object.keys(LIFECYCLE_ROUTES),
  ...Object.values(LIFECYCLE_ROUTES).map((route) => route.phrase),
]);
const DISPATCH_PHASES = new Set(LIFECYCLE_PHASES);
// A phase with no legal action is written as the word none.
const DISPATCH_ACTIONS = new Set([...LEGAL_ACTIONS, "none"]);
/** Why a lifecycle dispatch was refused, in the kit's own fixed words, or
 * null where the refusal is none of the forms known here. Only what stands in
 * the fixed places of the kit's sentence is kept, each word checked against
 * the kit's vocabulary, so no text of a command's output reaches the record. */
export function lifecycleRefusalReason(text) {
  const value = typeof text === "string" ? text : "";
  const illegal =
    /([a-z][a-z: -]{2,24}) is not a legal dispatch in phase ([a-z-]+); legal actions: ([a-z-]+(?:, [a-z-]+)*)/u.exec(
      value,
    );
  if (
    illegal &&
    DISPATCH_INTENTS.has(illegal[1].trim()) &&
    DISPATCH_PHASES.has(illegal[2]) &&
    illegal[3].split(", ").every((action) => DISPATCH_ACTIONS.has(action))
  )
    return `${illegal[1].trim()} is not a legal dispatch in phase ${illegal[2]}; legal actions: ${illegal[3]}.`;
  if (/DOTLN_DISPATCH_BOUND/.test(value))
    return "the phase's dispatch bound is reached.";
  if (/reserved by another/i.test(value))
    return "the order's worktree is reserved by another writer.";
  const recorded =
    /dispatch ([a-z-]+) is already recorded \(phase ([a-z-]+)\) but its briefing is unavailable/u.exec(
      value,
    );
  if (
    recorded &&
    DISPATCH_ACTIONS.has(recorded[1]) &&
    DISPATCH_PHASES.has(recorded[2])
  )
    return `dispatch ${recorded[1]} is already recorded in phase ${recorded[2]}, and its briefing could not be read.`;
  const failed = /dispatch ([a-z-]+) failed/u.exec(value);
  if (failed && DISPATCH_ACTIONS.has(failed[1]))
    return `the lifecycle command for dispatch ${failed[1]} failed.`;
  return null;
}

/** A refusal's sentence with the kit's reason for it, where one is kept:
 * the one place that composes what a stop's line and the account both say. */
export const refusalWithReason = (refused, reason) =>
  reason ? `${refused} The kit's reason: ${reason}` : refused;

/** A thrown error's message for a stop's line: an absolute path in it is
 * replaced, since a file-system error names one and the line is printed. A
 * path written from the project's root, as the kit's own sentences write
 * them, is kept. */
export const withoutAbsolutePaths = (text) =>
  String(text).replace(
    /(?<![\w.<])\/(?:[^\s/'"`:]+\/)+[^\s'"`:,;)]*/gu,
    "<path>",
  );

export function commandFailed(observation) {
  return (
    observation.status === "failed" ||
    observation.status === "declined" ||
    (Number.isInteger(observation.exitCode) && observation.exitCode !== 0)
  );
}

export function commandKind(command, launcherCommand) {
  if (launcherCommand) {
    let source = command;
    try {
      source = shellBody(command);
    } catch {
      /* An opaque command cannot identify the canonical launcher. */
    }
    if (source.trim() === launcherCommand) return "driver-launch";
  }
  const research = researchCommandKind(command);
  if (research) return research;
  // These are coarse diagnostic labels. Dispatch refusal attribution uses
  // the parsed single-command adapter instead of these text matches.
  if (/drive\.mjs['"]?\s+worker-entry/.test(command)) return "worker-entry";
  if (/target-gate\.mjs/.test(command)) return "target-gate";
  if (/test:docs|test-runner\.mjs\s+--document/.test(command))
    return "document-gate";
  if (/resume\.mjs|npm\s+run\s+resume/.test(command)) return "lifecycle";
  if (/harness\.mjs/.test(command)) return "harness";
  return null;
}

/** Every code the kit's own refusals carry. A code outside this list is not
 * kept, so the list holds each one a source of the kit writes; a case reads
 * the sources for them. */
export const REFUSAL_CODES = new Set([
  "DOTLN_ALLOCATION_REFUSED",
  "DOTLN_DESKTOP_CONTROL_REFUSED",
  "DOTLN_DISPATCH_BOUND",
  "DOTLN_DRIVEN_BUDGET_REFUSED",
  "DOTLN_HARNESS_INPUT_REFUSED",
  "DOTLN_HARNESS_REFUSED",
  "DOTLN_PACKAGE_PUBLISH_REFUSED",
  "DOTLN_PLAN_FIRST_REFUSED",
  "DOTLN_ROUTER_LAUNCH_REFUSED",
  "DOTLN_ROUTER_SPAWN_REFUSED",
  "DOTLN_ROUTER_WRITE_REFUSED",
  "DOTLN_SUBAGENT_CAP_REFUSED",
  "DOTLN_TARGET_REFUSED",
  "DOTLN_TARGET_RUNTIME_REFUSED",
  "DOTLN_WORKER_GATE_REFUSED",
  "DOTLN_WORKER_TASKS_RUNNING",
]);

// The refusal codes a diagnostic names and the boundary each one crossed.
export function refusalFindings(value) {
  const diagnostic = typeof value === "string" ? value : JSON.stringify(value);
  const codes = new Set(
    (diagnostic?.match(/\bDOTLN_[A-Z_]+\b/g) ?? []).filter((code) =>
      REFUSAL_CODES.has(code),
    ),
  );
  // The stops the refusal names itself as, where it names any.
  const stops = new Set(
    [...(diagnostic ?? "").matchAll(/This is stop ([a-z][a-z-]*)[,;]/gu)]
      .map((match) => match[1])
      .filter((id) => STOP_IDS.has(id)),
  );
  const boundaries = [];
  if (codes.has("DOTLN_TARGET_RUNTIME_REFUSED")) {
    const stage =
      /unavailable at (input|worktree-binding|runtime-binding|runtime-integrity|state-directory|hook-evaluation)(?: \((EACCES|EPERM|ENOENT|ENOTDIR|ELOOP)\))?/.exec(
        diagnostic,
      );
    boundaries.push({
      kind: "target-runtime",
      stage: stage?.[1] ?? "unclassified",
      code: stage?.[2] ?? null,
    });
  }
  if (codes.has("DOTLN_TARGET_REFUSED")) {
    const category =
      [
        ["opaque-shell", /target shell destinations unavailable/],
        ["foreign-cwd", /target shell requires worktree-root cwd/],
        ["effect-authority", /compiled authority does not permit/],
        ["compiled-feedback", /compiled feedback refused target effect/],
        ["foreign-writer", /reserved by another|foreign writer/i],
        ["helper-write", /helper agent writes nothing/],
        ["missing-role-grant", /no admitted order-worktree grant/],
        [
          "protected-path",
          /outside the writable surface|ordinary unlinked file paths/,
        ],
      ].find(([, pattern]) => pattern.test(diagnostic))?.[0] ?? "unclassified";
    boundaries.push({ kind: "target-permission", category });
  }
  return { codes, boundaries, stops };
}

// What a failed native tool said about the host beneath it, when it said anything.
export function nativeBoundary(diagnostic) {
  const category = [
    [
      "sandbox-initialization-refused",
      /sandbox_apply|sandbox_init|sandbox-exec.*(?:not permitted|denied)/i,
    ],
    ["nested-sandbox-unsupported", /nested sandbox|sandbox.*not supported/i],
    [
      "sandbox-helper-failure",
      /sandbox.*(?:socket|socat|proxy|initializ)|(?:socket|socat|proxy).*sandbox/i,
    ],
    [
      "host-os-refusal",
      /EACCES|EPERM|Operation not permitted|Permission denied/i,
    ],
    [
      "host-permission-refusal",
      /permission.*(?:denied|refused)|not allowed to|not permitted to/i,
    ],
    ["shell-path-missing", /ENOENT|No such file or directory/i],
  ].find(([, pattern]) => pattern.test(diagnostic))?.[0];
  return category
    ? {
        kind: "native-tool",
        category,
        codes: [
          "EACCES",
          "EPERM",
          "ENOENT",
          "ENOTDIR",
          "EADDRINUSE",
          "EADDRNOTAVAIL",
          "ECONNREFUSED",
        ].filter((code) => diagnostic.includes(code)),
        operations: [
          "listen",
          "bind",
          "connect",
          "mkdir",
          "open",
          "spawn",
          "sandbox_apply",
          "sandbox_init",
        ].filter((word) => new RegExp(`\\b${word}\\b`, "i").test(diagnostic)),
        components: [
          "proxy",
          "socket",
          "socat",
          "shell-snapshots",
          "sandbox-exec",
          "bwrap",
        ].filter((word) => diagnostic.includes(word)),
      }
    : null;
}

export const nativeFailureCause = (diagnostic) =>
  [
    ["native-provider-safeguard", /safeguards flagged this session|\[cyber\]/i],
    [
      "native-proxy-tunnel-refused",
      /ERR_PROXY_TUNNEL|proxy refused the tunnel/i,
    ],
    [
      "native-network-failure",
      /Connection error|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|fetch failed/i,
    ],
    ["native-tls-failure", /certificate|TLS|SSL/i],
    [
      "native-filesystem-refusal",
      /EACCES|EPERM|Operation not permitted|Permission denied/i,
    ],
    [
      "native-authentication-failure",
      /Invalid API key|authentication failed|Unauthorized|\b401\b/i,
    ],
    ["native-rate-limit", /rate.limit|\b429\b/i],
    ["native-provider-unavailable", /overloaded|\b50[0234]\b/i],
    [
      "native-nested-session-refusal",
      /cannot be launched inside another|nested session/i,
    ],
    [
      "native-session-unavailable",
      /No conversation found|session.*not found|session.*does not exist/i,
    ],
  ].find(([, pattern]) => pattern.test(diagnostic))?.[0] ??
  "native-execution-error";
