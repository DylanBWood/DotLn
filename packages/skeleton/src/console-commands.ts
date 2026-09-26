import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

/** The UI names terminal entrypoints, not an independent implementation. Each
 * ID fixes the Node entrypoint and the leading arguments that select one of its
 * commands; the terminal parser owns the remaining argument grammar and all its
 * refusals. No effect column: the resident classifies the equivalent terminal
 * command with the terminal's own permission classifier (WO-115 D005). */
export const CONSOLE_COMMANDS_V1 = {
  "resume.next": { entry: "scripts/resume.mjs", prefix: ["next"] },
  "resume.fix": { entry: "scripts/resume.mjs", prefix: ["fix"] },
  "resume.verify": { entry: "scripts/resume.mjs", prefix: ["verify"] },
  "resume.final-review": {
    entry: "scripts/resume.mjs",
    prefix: ["final-review"],
  },
  "resume.release-close": {
    entry: "scripts/resume.mjs",
    prefix: ["release-close"],
  },
  "resume.status": { entry: "scripts/resume.mjs", prefix: ["status"] },
  "resume.times": { entry: "scripts/resume.mjs", prefix: ["times"] },
  "resume.activate": { entry: "scripts/resume.mjs", prefix: ["activate"] },
  "release.close": { entry: "scripts/release.mjs", prefix: ["close"] },
  "worktree.start": { entry: "scripts/worktree.mjs", prefix: ["start"] },
  "worktree.integrate": {
    entry: "scripts/worktree.mjs",
    prefix: ["integrate"],
  },
  "worktree.publish": { entry: "scripts/worktree.mjs", prefix: ["publish"] },
  "worktree.finish": { entry: "scripts/worktree.mjs", prefix: ["finish"] },
  "worktree.settle": { entry: "scripts/worktree.mjs", prefix: ["settle"] },
  "harness.emit": { entry: "scripts/harness.mjs", prefix: ["emit"] },
  "harness.check": { entry: "scripts/harness.mjs", prefix: ["check"] },
  "skeleton.compiled-diff": {
    entry: "packages/skeleton/dist/src/cli.js",
    prefix: ["--compiled-diff"],
  },
  "dotln.intent": {
    entry: "packages/skeleton/dist/src/dotln.js",
    prefix: ["intent"],
  },
  "dotln.presence-away": {
    entry: "packages/skeleton/dist/src/dotln.js",
    prefix: ["presence", "away"],
  },
  "dotln.presence-back": {
    entry: "packages/skeleton/dist/src/dotln.js",
    prefix: ["presence", "back"],
  },
  "dotln.status": {
    entry: "packages/skeleton/dist/src/dotln.js",
    prefix: ["status"],
  },
  "console.status": {
    entry: "packages/console/dist/src/cli.js",
    prefix: ["status"],
  },
  "resident.bind-portfolio": {
    entry: "scripts/resident-bind.mjs",
    prefix: ["--portfolio"],
  },
} as const;

/** Options that make a terminal command stream until interrupted. A console
 * result is one complete exit code and byte pair, so these stay terminal-only
 * (WO-115 D006). */
export const CONSOLE_STREAMING_OPTIONS: Readonly<
  Partial<Record<ConsoleCommandId, readonly string[]>>
> = { "console.status": ["--watch"] };

export type ConsoleCommandId = keyof typeof CONSOLE_COMMANDS_V1;
export type ConsoleCommandRequest = Readonly<{
  version: 1;
  command: string;
  args: readonly string[];
}>;
export type ConsoleCommandResult = Readonly<{
  version: 1;
  command: string;
  exitCode: number;
  stdoutBase64: string;
  stderrBase64: string;
}>;

export function isConsoleCommandId(value: string): value is ConsoleCommandId {
  return Object.hasOwn(CONSOLE_COMMANDS_V1, value);
}

/** Only the envelope is validated here. Any command string decodes, so a name
 * outside the contract is refused and recorded as an invocation. */
export function decodeConsoleCommandRequest(
  value: unknown,
): ConsoleCommandRequest {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error("console command request must be an object");
  const request = value as Record<string, unknown>;
  if (
    Object.keys(request).sort().join(",") !== "args,command,version" ||
    request.version !== 1 ||
    typeof request.command !== "string" ||
    !request.command ||
    request.command.includes("\0") ||
    !Array.isArray(request.args) ||
    request.args.some((arg) => typeof arg !== "string" || arg.includes("\0"))
  )
    throw new Error("invalid console-commands-v1 request");
  return request as ConsoleCommandRequest;
}

const shellWord = (value: string) =>
  /^[A-Za-z0-9_./=:@%+,-]+$/u.test(value)
    ? value
    : `'${value.replaceAll("'", `'\\''`)}'`;

/** The command an operator types for this invocation, from the kit root. The
 * terminal permission classifier judges this exact text. */
export function consoleTerminalCommand(
  command: ConsoleCommandId,
  args: readonly string[],
): string {
  const contract = CONSOLE_COMMANDS_V1[command];
  return ["node", contract.entry, ...contract.prefix, ...args]
    .map(shellWord)
    .join(" ");
}

/** Host-session identity names the agent session that launched the resident,
 * not the console actor, so a served command never claims that session. */
const HOST_SESSION = /^(?:CLAUDE|CODEX_THREAD_ID$|COPILOT_AGENT_SESSION_ID$)/u;
const RESIDENT_EPISODE = new Set([
  "DOTLN_RESIDENT_EPISODE_ID",
  "DOTLN_RESIDENT_STORE",
]);
export function consoleChildEnvironment(
  environment: NodeJS.ProcessEnv,
): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(environment).filter(
      ([name]) => !HOST_SESSION.test(name) && !RESIDENT_EPISODE.has(name),
    ),
  );
}

export function consoleCommandInvocation(
  command: ConsoleCommandId,
  args: readonly string[],
  root: string,
): { executable: string; argv: string[]; cwd: string } {
  const contract = CONSOLE_COMMANDS_V1[command];
  const kit = fileURLToPath(new URL("../../../../", import.meta.url));
  return {
    executable: process.execPath,
    argv: [join(kit, contract.entry), ...contract.prefix, ...args],
    cwd: resolve(root),
  };
}
