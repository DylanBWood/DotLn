import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";
import { observedExecFileSync as execFileSync } from "./gate-deadlines.mjs";

const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const grantPath = (launchpad: string, target: string) =>
  join(
    launchpad,
    "docs/control/local/harness/targets",
    digest(target),
    "source-change-commands.json",
  );
function ordinary(root: string, path: string): void {
  let current = root;
  for (const part of relative(root, path).split(sep)) {
    current = join(current, part);
    const info = lstatSync(current, { throwIfNoEntry: false });
    if (
      info?.isSymbolicLink() ||
      (info &&
        !(
          info.isDirectory() ||
          (current === path && info.isFile() && info.nlink === 1)
        ))
    )
      throw new Error("source-change command grant path is not ordinary");
  }
}
export function installSourceChangeCommands(input: {
  readonly launchpad: string;
  readonly target: string;
  readonly commandId: string;
  readonly requestKey: string;
  readonly episodeId: string;
  readonly baseCommit: string;
  readonly branch: string;
  readonly testCommand: string;
  readonly messagePath: string;
  readonly expiresAt: number;
}): () => void {
  const path = grantPath(input.launchpad, input.target);
  ordinary(input.launchpad, path);
  ordinary(input.target, input.messagePath);
  const directory = join(path, "..");
  mkdirSync(directory, { recursive: true });
  if (lstatSync(path, { throwIfNoEntry: false })) {
    const previous = JSON.parse(readFileSync(path, "utf8")) as {
      pid?: unknown;
    };
    if (!Number.isSafeInteger(previous.pid) || Number(previous.pid) <= 0)
      throw new Error("source-change command owner is malformed");
    try {
      process.kill(Number(previous.pid), 0);
      throw new Error("source-change command owner is still alive");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
    }
    unlinkSync(path);
  }
  writeFileSync(
    path,
    JSON.stringify({
      version: 1,
      target: digest(input.target),
      commandId: input.commandId,
      requestKey: input.requestKey,
      episodeId: input.episodeId,
      baseCommit: input.baseCommit,
      branch: input.branch,
      testCommand: input.testCommand,
      messagePath: input.messagePath,
      messageHash: digest(readFileSync(input.messagePath, "utf8")),
      expiresAt: input.expiresAt,
      pid: process.pid,
    }) + "\n",
    { flag: "wx", mode: 0o600 },
  );
  return () => {
    ordinary(input.launchpad, path);
    unlinkSync(path);
  };
}

/** Exact host-selected shell commands only. Native permissions still decide. */
export function sourceChangeCommandEffect(
  launchpad: string,
  target: string,
  command: string,
  now = Date.now(),
): "shell.run" | "git.local" | undefined {
  const path = grantPath(launchpad, target);
  ordinary(launchpad, path);
  if (!lstatSync(path, { throwIfNoEntry: false })) return undefined;
  const value = JSON.parse(readFileSync(path, "utf8")) as Record<
    string,
    unknown
  >;
  if (
    Object.keys(value).sort().join(",") !==
      [
        "version",
        "target",
        "commandId",
        "requestKey",
        "episodeId",
        "baseCommit",
        "branch",
        "testCommand",
        "messagePath",
        "messageHash",
        "expiresAt",
        "pid",
      ]
        .sort()
        .join(",") ||
    value.version !== 1 ||
    value.target !== digest(target) ||
    typeof value.commandId !== "string" ||
    !/^cmd_[a-zA-Z0-9_-]+$/u.test(value.commandId) ||
    typeof value.requestKey !== "string" ||
    !/^[a-f0-9]{64}$/u.test(value.requestKey) ||
    typeof value.episodeId !== "string" ||
    !/^[a-zA-Z0-9_-]+$/u.test(value.episodeId) ||
    typeof value.baseCommit !== "string" ||
    !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(value.baseCommit) ||
    typeof value.branch !== "string" ||
    !value.branch ||
    typeof value.testCommand !== "string" ||
    !/^[a-zA-Z0-9_./-]+(?: [a-zA-Z0-9_./=-]+)*$/u.test(value.testCommand) ||
    typeof value.messagePath !== "string" ||
    value.messagePath !== join(target, ".dotln/commit-message.txt") ||
    typeof value.messageHash !== "string" ||
    !/^[a-f0-9]{64}$/u.test(value.messageHash) ||
    !Number.isSafeInteger(value.pid) ||
    Number(value.pid) <= 0 ||
    typeof value.expiresAt !== "number" ||
    !Number.isFinite(value.expiresAt) ||
    now >= value.expiresAt
  )
    throw new Error("source-change command grant is invalid or expired");
  process.kill(Number(value.pid), 0);
  ordinary(target, value.messagePath);
  if (
    realpathSync(value.messagePath) !== value.messagePath ||
    digest(readFileSync(value.messagePath, "utf8")) !== value.messageHash
  )
    throw new Error("source-change command message drift");
  const branch = execFileSync("git", ["symbolic-ref", "--short", "HEAD"], {
    cwd: target,
    encoding: "utf8",
    timeout: 5_000,
  }).trim();
  if (branch !== value.branch)
    throw new Error("source-change command branch drift");
  execFileSync(
    "git",
    ["merge-base", "--is-ancestor", value.baseCommit, "HEAD"],
    { cwd: target, timeout: 5_000, stdio: "pipe" },
  );
  if (command === value.testCommand) return "shell.run";
  if (
    command === "git add -A" ||
    command === `git commit -F ${value.messagePath}`
  )
    return "git.local";
  return undefined;
}
