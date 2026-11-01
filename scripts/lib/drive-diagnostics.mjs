import {
  drivenResearchCommandKind,
  shellInvocations,
} from "../../packages/skeleton/dist/src/harness-command.js";

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
function shellBody(source) {
  const invocations = shellInvocations(source);
  const words = invocations[0];
  return invocations.length === 1 &&
    words?.length === 3 &&
    /^(?:.*\/)?(?:zsh|bash|sh)$/.test(words[0]) &&
    ["-c", "-lc"].includes(words[1])
    ? words[2]
    : source;
}

// Retain only a fixed vocabulary, never paths, queries, environment values or
// arbitrary command/output text. This makes a failed command diagnosable.
export function commandShape(source) {
  const known = new Set([
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
    // Common programs, so a refused command names what ran; operands stay masked.
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
    "run",
    "--prefix",
    "--",
    "--silent",
    "status",
    "--json",
    "briefing",
    "usage",
    "scratch",
    "begin",
    "observe",
    "delivered",
    "read-output",
    "evidence",
    "bounded",
    "writer",
    "--show",
    "--wait",
    "--stop",
    "--offset",
    "--length",
    "next",
    "fix",
    "verify",
    "final-review",
    "-C",
    "-P",
    "rev-parse",
    "--show-toplevel",
    "worktree",
    "list",
    "diff",
    "show",
    "log",
    "ls-files",
    "--stat",
    "--name-only",
    "--no-ext-diff",
    "--no-textconv",
    "--oneline",
    "--porcelain",
    "DOTLN_LAUNCHPAD",
    "CLAUDE_EFFORT",
    "DOTLN_DRIVEN_WORKER",
    // Lifecycle, close and helper subcommands, so a declined or failed
    // launchpad command names what it was; its order and paths stay masked.
    "implementation-ready",
    "repair-complete",
    "verification-result",
    "final-review-result",
    "target-records",
    "release-close",
    "close",
    "prepare",
    "integrate",
    "index",
    "apply",
    "followups",
    "--publish",
    "--dry-run",
    "--local",
    "--review",
    "--document",
    "--sync",
    "--work-order",
    "--host",
    "worker-entry",
  ]);
  try {
    return shellInvocations(shellBody(source))
      .slice(0, 6)
      .map((words) =>
        words
          .slice(0, 16)
          .map((word) =>
            known.has(word)
              ? word
              : /(?:^|\/)(?:resume|harness|drive|target-gate|release|worktree|refute-plan|test-runner)\.mjs$/.test(
                    word,
                  )
                ? word.split("/").at(-1)
                : "<operand>",
          ),
      );
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

// The refusal codes a diagnostic names and the boundary each one crossed.
export function refusalFindings(value) {
  const diagnostic = typeof value === "string" ? value : JSON.stringify(value);
  const supported = new Set([
    "DOTLN_HARNESS_INPUT_REFUSED",
    "DOTLN_HARNESS_REFUSED",
    "DOTLN_ROUTER_LAUNCH_REFUSED",
    "DOTLN_ROUTER_SPAWN_REFUSED",
    "DOTLN_TARGET_REFUSED",
    "DOTLN_TARGET_RUNTIME_REFUSED",
    "DOTLN_DISPATCH_BOUND",
    "DOTLN_DRIVEN_BUDGET_REFUSED",
    "DOTLN_ROUTER_WRITE_REFUSED",
    "DOTLN_SUBAGENT_CAP_REFUSED",
    "DOTLN_PACKAGE_PUBLISH_REFUSED",
  ]);
  const codes = new Set(
    (diagnostic?.match(/\bDOTLN_[A-Z_]+\b/g) ?? []).filter((code) =>
      supported.has(code),
    ),
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
  return { codes, boundaries };
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
