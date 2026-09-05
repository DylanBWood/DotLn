import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const git = (cwd: string, ...args: string[]): string =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 15_000,
  }).trim();

export interface WorkerWorktree {
  readonly path: string;
  readonly baseCommit: string;
  readonly repository: string;
}

/** Host-owned detached worktrees. No branch commits, force removal, or reset. */
export class WorkerWorktrees {
  readonly repository: string;
  readonly directory: string;
  constructor(repository: string, directory: string) {
    this.repository = realpathSync(repository);
    if (
      realpathSync(git(this.repository, "rev-parse", "--show-toplevel")) !==
      this.repository
    )
      throw new Error("worker repository must be its Git root");
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    this.directory = realpathSync(directory);
    if (this.directory !== resolve(directory))
      throw new Error("worker directory may not alias a different root");
  }

  create(commandId: string, baseCommit: string): WorkerWorktree {
    if (
      !/^cmd_[a-zA-Z0-9_-]+$/u.test(commandId) ||
      !/^[a-f0-9]{40}$/u.test(baseCommit)
    )
      throw new Error("invalid worker command or immutable base");
    const path = join(this.directory, commandId);
    const worktree = { path, baseCommit, repository: this.repository };
    if (!existsSync(path))
      git(this.repository, "worktree", "add", "--detach", path, baseCommit);
    this.verify(worktree);
    return worktree;
  }

  verify(worktree: WorkerWorktree): void {
    if (
      worktree.repository !== this.repository ||
      dirname(worktree.path) !== this.directory ||
      !/^cmd_[a-zA-Z0-9_-]+$/u.test(
        worktree.path.slice(this.directory.length + 1),
      ) ||
      lstatSync(worktree.path).isSymbolicLink() ||
      realpathSync(worktree.path) !== worktree.path ||
      realpathSync(git(worktree.path, "rev-parse", "--show-toplevel")) !==
        worktree.path ||
      git(worktree.path, "rev-parse", "HEAD") !== worktree.baseCommit ||
      git(worktree.path, "rev-parse", "--abbrev-ref", "HEAD") !== "HEAD"
    )
      throw new Error("worker cwd/base verification failed");
    const common = realpathSync(
      resolve(
        worktree.path,
        git(worktree.path, "rev-parse", "--git-common-dir"),
      ),
    );
    const expected = realpathSync(
      resolve(
        this.repository,
        git(this.repository, "rev-parse", "--git-common-dir"),
      ),
    );
    if (common !== expected)
      throw new Error("worker belongs to another repository");
    if (
      git(
        worktree.path,
        "status",
        "--porcelain",
        "--untracked-files=all",
        "--ignored=matching",
      ) !== ""
    )
      throw new Error("dirty worker worktree retained for inspection");
  }

  cleanup(worktree: WorkerWorktree): void {
    this.verify(worktree);
    git(this.repository, "worktree", "remove", worktree.path);
    if (existsSync(worktree.path))
      throw new Error("worker cleanup did not remove its worktree");
  }
}
