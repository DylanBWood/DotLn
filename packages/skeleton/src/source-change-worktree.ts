import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import {
  observedExecFileSync as execFileSync,
  observedSpawnSync as spawnSync,
} from "./gate-deadlines.mjs";
import {
  assertSourceCommit,
  assertSourceSurface,
  type FocusedTestResult,
  type SourceChangeRequested,
} from "./source-change-state.js";

export const sourceDigest = (value: string | Buffer): string =>
  createHash("sha256").update(value).digest("hex");
export const sourceGit = (cwd: string, ...args: string[]): string =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 15_000,
    maxBuffer: 8 * 1024 * 1024,
  }).trim();
const present = (path: string) =>
  lstatSync(path, { throwIfNoEntry: false }) !== undefined;
const inside = (parent: string, path: string) =>
  path.startsWith(`${parent}${sep}`);
const canonicalDirectory = (path: string) => {
  if (
    resolve(path) !== path ||
    realpathSync(path) !== path ||
    !lstatSync(path).isDirectory()
  )
    throw new Error("source-change paths must be canonical directories");
  return path;
};

export interface SourceWorktreeOptions {
  readonly requested: SourceChangeRequested;
  readonly commandId: string;
  readonly parent: string;
  readonly launchpad: string;
  readonly bundleProfile: "target-worker-claude" | "target-worker-codex";
  readonly commitMessage: string;
}

/** Branch-specific lifecycle; inspection's detached worktree contract is unchanged. */
export class SourceChangeWorktree {
  readonly path: string;
  readonly messagePath: string;
  constructor(readonly options: SourceWorktreeOptions) {
    const { requested, parent, launchpad, commandId, commitMessage } = options;
    canonicalDirectory(parent);
    canonicalDirectory(launchpad);
    canonicalDirectory(requested.repo);
    if (
      sourceGit(requested.repo, "rev-parse", "--show-toplevel") !==
        requested.repo ||
      sourceGit(launchpad, "rev-parse", "--show-toplevel") !== launchpad
    )
      throw new Error(
        "source-change repository and launchpad must be Git roots",
      );
    if (!/^cmd_[a-zA-Z0-9_-]+$/u.test(commandId))
      throw new Error("invalid source-change command");
    assertSourceCommit(requested.baseCommit);
    if (
      sourceGit(
        requested.repo,
        "rev-parse",
        "--verify",
        `${requested.baseCommit}^{commit}`,
      ) !== requested.baseCommit
    )
      throw new Error("source-change base is not a commit");
    if (requested.branch.startsWith("-") || requested.branch === "HEAD")
      throw new Error("invalid source-change branch");
    sourceGit(
      requested.repo,
      "check-ref-format",
      `refs/heads/${requested.branch}`,
    );
    for (const surface of requested.surfaces) assertSourceSurface(surface);
    if (
      !commitMessage.trim() ||
      commitMessage.includes("\0") ||
      /(?:co-authored-by:.*(?:claude|codex|openai|anthropic)|generated (?:by|with)\s+(?:claude|codex|chatgpt))/iu.test(
        commitMessage,
      )
    )
      throw new Error("source-change host message is invalid or attributed");
    this.path = join(parent, commandId);
    this.messagePath = join(this.path, ".dotln", "commit-message.txt");
    if (
      this.path === launchpad ||
      inside(launchpad, this.path) ||
      inside(this.path, launchpad) ||
      this.path === requested.repo ||
      inside(this.path, requested.repo)
    )
      throw new Error("source-change target overlaps a protected checkout");
  }
  assertUnused(): void {
    if (present(this.path))
      throw new Error("source-change worktree path already exists");
    const result = spawnSync(
      "git",
      [
        "show-ref",
        "--verify",
        "--quiet",
        `refs/heads/${this.options.requested.branch}`,
      ],
      { cwd: this.options.requested.repo, timeout: 5_000 },
    );
    if (result.status !== 1)
      throw new Error(
        "source-change branch already exists or cannot be inspected",
      );
  }
  create(): void {
    const { requested } = this.options;
    if (!present(this.path)) {
      this.assertUnused();
      sourceGit(
        requested.repo,
        "worktree",
        "add",
        "-b",
        requested.branch,
        this.path,
        requested.baseCommit,
      );
    }
    this.verify();
  }
  verify(): string {
    const { requested, parent } = this.options;
    if (
      dirname(this.path) !== parent ||
      lstatSync(this.path).isSymbolicLink() ||
      realpathSync(this.path) !== this.path ||
      sourceGit(this.path, "rev-parse", "--show-toplevel") !== this.path ||
      sourceGit(this.path, "symbolic-ref", "--short", "HEAD") !==
        requested.branch
    )
      throw new Error("source-change worktree identity drift");
    const common = (root: string) =>
      realpathSync(
        resolve(root, sourceGit(root, "rev-parse", "--git-common-dir")),
      );
    if (common(this.path) !== common(requested.repo))
      throw new Error("source-change worktree belongs to another repository");
    const head = sourceGit(this.path, "rev-parse", "HEAD");
    assertSourceCommit(head);
    sourceGit(
      this.path,
      "merge-base",
      "--is-ancestor",
      requested.baseCommit,
      head,
    );
    return head;
  }
  bundle(action: "emit" | "check" | "remove"): void {
    execFileSync(
      process.execPath,
      [
        join(this.options.launchpad, "scripts/harness.mjs"),
        action,
        "--target",
        this.path,
        "--runtime-root",
        this.options.launchpad,
        "--profile",
        this.options.bundleProfile,
      ],
      {
        cwd: this.options.launchpad,
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 60_000,
        maxBuffer: 1024 * 1024,
      },
    );
  }
  prepare(): void {
    this.create();
    this.bundle(
      present(join(this.path, ".claude/target-worker-manifest.json"))
        ? "check"
        : "emit",
    );
    const directory = dirname(this.messagePath);
    if (
      present(directory) &&
      (lstatSync(directory).isSymbolicLink() ||
        !lstatSync(directory).isDirectory())
    )
      throw new Error("source-change scratch path is not an owned directory");
    mkdirSync(directory, { recursive: true });
    if (present(this.messagePath)) {
      this.checkMessage();
    } else
      writeFileSync(this.messagePath, this.options.commitMessage, {
        flag: "wx",
        mode: 0o600,
      });
    this.bundle("check");
  }
  checkMessage(): void {
    if (
      lstatSync(dirname(this.messagePath)).isSymbolicLink() ||
      !lstatSync(this.messagePath).isFile() ||
      lstatSync(this.messagePath).isSymbolicLink() ||
      readFileSync(this.messagePath, "utf8") !== this.options.commitMessage
    )
      throw new Error("source-change host message drift");
  }
  clean(): void {
    if (sourceGit(this.path, "status", "--porcelain", "--untracked-files=all"))
      throw new Error(
        "source-change committed tree is dirty; preserve for inspection",
      );
  }
  effect(): { commit: string; diffHash: string } | undefined {
    const commit = this.verify();
    if (commit === this.options.requested.baseCommit) return undefined;
    this.clean();
    this.bundle("check");
    this.checkMessage();
    const { baseCommit, surfaces } = this.options.requested;
    const paths = execFileSync(
      "git",
      [
        "diff",
        "--no-ext-diff",
        "--no-textconv",
        "--no-renames",
        "--name-only",
        "-z",
        baseCommit,
        commit,
        "--",
      ],
      { cwd: this.path, timeout: 15_000 },
    )
      .toString()
      .split("\0")
      .filter(Boolean);
    if (
      !paths.length ||
      paths.some(
        (path) =>
          path === "CLAUDE.local.md" ||
          [".git", ".dotln", ".claude"].some(
            (prefix) => path === prefix || path.startsWith(`${prefix}/`),
          ) ||
          !surfaces.some(
            (surface) => path === surface || path.startsWith(`${surface}/`),
          ),
      )
    )
      throw new Error(
        "source-change diff is empty or outside the declared surfaces",
      );
    const diff = execFileSync(
      "git",
      [
        "diff",
        "--binary",
        "--no-ext-diff",
        "--no-textconv",
        "--no-renames",
        baseCommit,
        commit,
        "--",
      ],
      { cwd: this.path, timeout: 15_000, maxBuffer: 8 * 1024 * 1024 },
    );
    return { commit, diffHash: sourceDigest(diff) };
  }
  finish(commit: string, diffHash: string): void {
    const effect = this.effect();
    if (!effect || effect.commit !== commit || effect.diffHash !== diffHash)
      throw new Error("source-change finish requires the persisted effect");
    // Refuse every ignored residue except the exact governed set and message.
    const manifestName = ".claude/target-worker-manifest.json";
    const manifest = JSON.parse(
      readFileSync(join(this.path, manifestName), "utf8"),
    ) as { installed: { path: string }[] };
    const owned = new Set([
      ...manifest.installed.map((file) => file.path),
      manifestName,
      ".dotln/commit-message.txt",
    ]);
    const ignored = execFileSync(
      "git",
      ["ls-files", "--others", "--ignored", "--exclude-standard", "-z"],
      { cwd: this.path, timeout: 15_000 },
    )
      .toString()
      .split("\0")
      .filter(Boolean);
    if (ignored.some((path) => !owned.has(path)))
      throw new Error("source-change finish retains unowned ignored files");
    if (
      readdirSync(dirname(this.messagePath)).some(
        (name) => name !== "commit-message.txt",
      )
    )
      throw new Error("source-change scratch contains unowned files");
    this.bundle("remove");
    this.checkMessage();
    unlinkSync(this.messagePath);
    rmdirSync(dirname(this.messagePath));
    if (
      sourceGit(
        this.path,
        "status",
        "--porcelain",
        "--untracked-files=all",
        "--ignored=matching",
      )
    )
      throw new Error("source-change finish retains unowned files");
    sourceGit(this.options.requested.repo, "worktree", "remove", this.path);
    if (existsSync(this.path))
      throw new Error("source-change worktree removal failed");
  }
}

export function runFocusedTest(
  path: string,
  command: string,
): FocusedTestResult {
  if (!/^[a-zA-Z0-9_./-]+(?: [a-zA-Z0-9_./=-]+)*$/u.test(command))
    throw new Error("source-change test requires a bounded argument vector");
  const [binary, ...args] = command.split(" ");
  const result = spawnSync(binary!, args, {
    cwd: path,
    timeout: 180_000,
    maxBuffer: 1024 * 1024,
  });
  return {
    command,
    exitCode: result.status,
    signal: result.signal ?? (result.error ? "spawn-error" : null),
    stdoutHash: sourceDigest(result.stdout ?? Buffer.alloc(0)),
    stderrHash: sourceDigest(result.stderr ?? Buffer.alloc(0)),
  };
}
