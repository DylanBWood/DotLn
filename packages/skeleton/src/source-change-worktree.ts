import { createHash } from "node:crypto";
import {
  closeSync,
  constants,
  existsSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { discoverySandbox } from "./discovery-sandbox.js";
import {
  observedExecFileSync as execFileSync,
  observedSpawnSync as spawnSync,
} from "./gate-deadlines.mjs";
import {
  assertSourceCommit,
  assertSourceSurface,
  type FocusedTestResult,
  type SourceChangeRequested,
  type SharedRepositoryState,
} from "./source-change-state.js";

export const sourceDigest = (value: string | Buffer): string =>
  createHash("sha256").update(value).digest("hex");
// Host reads never execute target hooks or trust writer-controlled derived
// metadata. They judge the actual commit objects and committed file bytes.
export const HOST_GIT = [
  "-c",
  "core.hooksPath=/dev/null",
  "-c",
  "core.fsmonitor=false",
  // A replace ref could hide a file from the host's diff.
  "-c",
  "core.useReplaceRefs=false",
  // A writer-writable commit-graph can substitute a commit's tree or parents.
  // Admission must parse the commit objects instead.
  "-c",
  "core.commitGraph=false",
] as const;
export const sourceGit = (cwd: string, ...args: string[]): string =>
  execFileSync("git", [...HOST_GIT, ...args], {
    cwd,
    env: {
      ...process.env,
      GIT_OBJECT_DIRECTORY: undefined,
      GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
    },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 15_000,
    maxBuffer: 8 * 1024 * 1024,
  }).trim();
/** Git writes new objects only to the private store; the common store is an
 * alternate. Quote the alternate as Git's documented C-style path entry. */
export function sourceObjectEnvironment(cwd: string): {
  GIT_OBJECT_DIRECTORY: string;
  GIT_ALTERNATE_OBJECT_DIRECTORIES: string;
} {
  const [gitdir, common] = sourceGit(
    cwd,
    "rev-parse",
    "--path-format=absolute",
    "--git-dir",
    "--git-common-dir",
  ).split("\n");
  if (!gitdir || !common || realpathSync(gitdir) === realpathSync(common))
    throw new Error("source writer requires a linked worktree");
  return {
    GIT_OBJECT_DIRECTORY: join(realpathSync(gitdir), "dotln-objects"),
    GIT_ALTERNATE_OBJECT_DIRECTORIES: JSON.stringify(
      join(realpathSync(common), "objects"),
    ),
  };
}
export function sourceWriterState(cwd: string): {
  version: 1;
  branch: string;
  baseCommit: string;
  objectDirectory: string;
} {
  const env = sourceObjectEnvironment(cwd);
  const value = JSON.parse(
    ordinaryFile(
      join(dirname(env.GIT_OBJECT_DIRECTORY), "dotln-source.json"),
    ).toString("utf8"),
  );
  if (
    !value ||
    Object.keys(value).sort().join(",") !==
      "baseCommit,branch,objectDirectory,version" ||
    value.version !== 1 ||
    typeof value.branch !== "string" ||
    !value.branch ||
    value.objectDirectory !== env.GIT_OBJECT_DIRECTORY
  )
    throw new Error("source-change private store identity drift");
  assertSourceCommit(value.baseCommit);
  canonicalDirectory(env.GIT_OBJECT_DIRECTORY);
  return value;
}
/** Host preparation only. The writer receives the resulting environment. */
export function prepareSourceObjectStore(
  cwd: string,
  branch: string,
  baseCommit: string,
): void {
  const { GIT_OBJECT_DIRECTORY: objectDirectory } =
    sourceObjectEnvironment(cwd);
  const state = { version: 1 as const, branch, baseCommit, objectDirectory };
  const file = join(dirname(objectDirectory), "dotln-source.json");
  if (present(file)) {
    if (JSON.stringify(sourceWriterState(cwd)) !== JSON.stringify(state))
      throw new Error("source-change private store request drift");
    return;
  }
  if (present(objectDirectory))
    throw new Error("source-change private store has no ownership record");
  mkdirSync(objectDirectory, { mode: 0o700 });
  writeFileSync(file, JSON.stringify(state) + "\n", {
    flag: "wx",
    mode: 0o400,
  });
}
const present = (path: string) =>
  lstatSync(path, { throwIfNoEntry: false }) !== undefined;
const ordinaryFile = (path: string): Buffer => {
  const info = lstatSync(path);
  if (!info.isFile() || info.nlink !== 1)
    throw new Error("source-change shared entry is not an ordinary file");
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const opened = fstatSync(fd);
    if (!opened.isFile() || opened.dev !== info.dev || opened.ino !== info.ino)
      throw new Error("source-change shared entry identity changed");
    return readFileSync(fd);
  } finally {
    closeSync(fd);
  }
};
const inside = (parent: string, path: string) =>
  path.startsWith(`${parent}${sep}`);
const canonicalDirectory = (path: string) => {
  if (
    resolve(path) !== path ||
    realpathSync(path) !== path ||
    !lstatSync(path).isDirectory() ||
    execFileSync("/bin/pwd", ["-P"], {
      cwd: path,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5_000,
    }).replace(/\n$/u, "") !== path
  )
    throw new Error("source-change paths must be canonical directories");
  return path;
};

export class SourceWorktreeRefusal extends Error {
  constructor(
    readonly reason: string,
    path: string,
  ) {
    super(`source-change committed tree is dirty: ${path}; ${reason}`);
  }
}
export class SourceImportRefusal extends Error {
  readonly reason: string;
  constructor(commit: string, cause: unknown) {
    super(`source-change import refused: ${commit}`, { cause });
    this.reason = `import:${commit}`;
  }
}
export class SourceObjectIntegrityRefusal extends Error {
  readonly reason = "private-object-integrity";
  constructor(cause: unknown) {
    super("source-change private object store failed strict integrity check", {
      cause,
    });
  }
}
export class SourceObjectLayoutRefusal extends Error {
  readonly reason = "private-object-layout";
  constructor() {
    super("source-change private object store contains unsupported metadata");
  }
}

// An object directory can add alternates and commit graphs of its own. Check
// its small, episode-owned inventory before giving it to any host Git reader.
function assertPrivateObjectLayout(directory: string): void {
  const ordinaryDirectory = (path: string) =>
    lstatSync(path).isDirectory() && realpathSync(path) === path;
  try {
    if (!ordinaryDirectory(directory)) throw new SourceObjectLayoutRefusal();
    for (const name of readdirSync(directory)) {
      const path = join(directory, name);
      if (!ordinaryDirectory(path)) throw new SourceObjectLayoutRefusal();
      const loose = /^[a-f0-9]{2}$/u.test(name);
      if (!loose && name !== "pack" && name !== "info")
        throw new SourceObjectLayoutRefusal();
      for (const entry of readdirSync(path)) {
        const allowed = loose
          ? /^(?:[a-f0-9]{38}|[a-f0-9]{62})$/u.test(entry)
          : name === "pack" &&
            /^pack-(?:[a-f0-9]{40}|[a-f0-9]{64})\.(?:pack|idx|rev|bitmap|keep)$/u.test(
              entry,
            );
        const info = lstatSync(join(path, entry));
        if (!allowed || !info.isFile() || info.nlink !== 1)
          throw new SourceObjectLayoutRefusal();
      }
    }
  } catch {
    throw new SourceObjectLayoutRefusal();
  }
}
export const sourceAdmissionReason = (check: string, error: unknown): string =>
  error instanceof SourceWorktreeRefusal ||
  error instanceof SourceImportRefusal ||
  error instanceof SourceObjectIntegrityRefusal ||
  error instanceof SourceObjectLayoutRefusal
    ? error.reason
    : `host-admission-${check}`;

export interface SourceWorktreeOptions {
  readonly requested: SourceChangeRequested;
  readonly commandId: string;
  readonly parent: string;
  readonly launchpad: string;
  readonly bundleProfile: "target-worker-claude" | "target-worker-codex";
  readonly commitMessage: string;
  /** What the envelope admits of the committed change (WO-100 D016). */
  readonly change?: SourceChangeLimits;
}
export interface SourceChangeLimits {
  /** The envelope's `resourceLimits.files`; absent means uncounted. */
  readonly files?: number;
  /** True when the envelope allows `repo.delete`. */
  readonly deletion: boolean;
  /** A Sort move's declared relocation: its source may be removed. */
  readonly relocation?: { readonly from: string; readonly to: string };
}
export interface ImportedCandidate {
  readonly commit: string;
  readonly tree: string;
  readonly objects: string[];
  readonly pack: string;
}

/** Branch-specific lifecycle; inspection's detached worktree contract is unchanged. */
export class SourceChangeWorktree {
  readonly path: string;
  readonly messagePath: string;
  private objectEnv?: ReturnType<typeof sourceObjectEnvironment>;
  get objectEnvironment(): ReturnType<typeof sourceObjectEnvironment> {
    return (this.objectEnv ??= sourceObjectEnvironment(this.path));
  }
  get objectDirectory(): string {
    return this.objectEnvironment.GIT_OBJECT_DIRECTORY;
  }
  private get environment(): NodeJS.ProcessEnv {
    assertPrivateObjectLayout(this.objectDirectory);
    return { ...process.env, ...this.objectEnvironment };
  }
  private git(...args: string[]): string {
    return execFileSync("git", [...HOST_GIT, ...args], {
      cwd: this.path,
      env: this.environment,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 15_000,
      maxBuffer: 8 * 1024 * 1024,
    }).trim();
  }
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
        ...HOST_GIT,
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
    // Check again at the effect boundary: a variant or an unreadable identity
    // must never leave a branch or a worktree registration behind.
    canonicalDirectory(this.options.parent);
    canonicalDirectory(this.options.launchpad);
    canonicalDirectory(requested.repo);
    if (!present(this.path)) {
      this.assertUnused();
      sourceGit(
        requested.repo,
        "worktree",
        "add",
        "--detach",
        this.path,
        requested.baseCommit,
      );
      prepareSourceObjectStore(
        this.path,
        requested.branch,
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
      this.git("rev-parse", "--show-toplevel") !== this.path ||
      this.git("rev-parse", "--abbrev-ref", "HEAD") !== "HEAD"
    )
      throw new Error("source-change worktree identity drift");
    const state = sourceWriterState(this.path);
    if (
      state.branch !== requested.branch ||
      state.baseCommit !== requested.baseCommit ||
      state.objectDirectory !== this.objectDirectory
    )
      throw new Error("source-change worktree recorded branch drift");
    const common = (root: string) =>
      realpathSync(
        resolve(root, sourceGit(root, "rev-parse", "--git-common-dir")),
      );
    if (common(this.path) !== common(requested.repo))
      throw new Error("source-change worktree belongs to another repository");
    const head = this.git("rev-parse", "HEAD");
    assertSourceCommit(head);
    // The private store wins object lookup over its shared alternate. Validate
    // the candidate graph before a shadow object can alter a base-tree
    // comparison. An explicit head excludes unrelated shared refs from fsck.
    try {
      this.git(
        "fsck",
        "--no-full",
        "--strict",
        "--no-reflogs",
        "--no-dangling",
        "--no-references",
        head,
      );
    } catch (error) {
      throw new SourceObjectIntegrityRefusal(error);
    }
    this.git("merge-base", "--is-ancestor", requested.baseCommit, head);
    return head;
  }
  /** Observe shared state without following a substituted alternates entry.
   * Differences are not attributable to this writer: independent Git clients
   * may legitimately change any shared ref. Never restore them here. */
  sharedState(): SharedRepositoryState {
    const { repo, branch } = this.options.requested;
    const common = resolve(
      repo,
      sourceGit(repo, "rev-parse", "--git-common-dir"),
    );
    const parents = [
      common,
      join(common, "objects"),
      join(common, "objects/info"),
    ];
    const identities = parents.map((path) => {
      const info = lstatSync(path);
      if (!info.isDirectory() || realpathSync(path) !== path)
        throw new Error(
          "source-change shared object directory is not ordinary",
        );
      return info;
    });
    const alternates = join(common, "objects", "info", "alternates");
    const info = lstatSync(alternates, { throwIfNoEntry: false });
    const bytes = info ? ordinaryFile(alternates).toString("hex") : null;
    // Git's ref iterator silently omits dangling and cyclic symbolic refs.
    // Inspect loose symbolic entries too; do not claim coverage of another
    // storage format whose unresolved entries this observer cannot enumerate.
    const storage = spawnSync(
      "git",
      [...HOST_GIT, "config", "--local", "--get", "extensions.refStorage"],
      {
        cwd: repo,
        encoding: "utf8",
        timeout: 15_000,
      },
    );
    if (!(
      storage.status === 1 ||
      (storage.status === 0 && storage.stdout.trim() === "files")
    ))
      throw new Error("source-change shared ref storage is unsupported");
    const symbolic = new Map<string, string>();
    const visit = (directory: string): void => {
      const before = lstatSync(directory);
      if (!before.isDirectory() || realpathSync(directory) !== directory)
        throw new Error("source-change shared refs directory is not ordinary");
      for (const name of readdirSync(directory)) {
        const path = join(directory, name);
        if (lstatSync(path).isDirectory()) visit(path);
        else {
          const bytes = ordinaryFile(path);
          const text = bytes.toString("utf8");
          if (!Buffer.from(text, "utf8").equals(bytes))
            throw new Error("source-change shared ref text is not UTF-8");
          const value = text.trim();
          if (value.startsWith("ref: "))
            symbolic.set(path.slice(common.length + 1), value.slice(5));
          else assertSourceCommit(value);
        }
      }
      const after = lstatSync(directory);
      if (
        realpathSync(directory) !== directory ||
        after.dev !== before.dev ||
        after.ino !== before.ino
      )
        throw new Error("source-change shared refs directory changed");
    };
    visit(join(common, "refs"));
    const refs = new Map<string, [string, string, string]>();
    for (const line of sourceGit(
      repo,
      "for-each-ref",
      "--format=%(refname) %(objectname) %(symref)",
    )
      .split("\n")
      .filter(Boolean)) {
      const [ref, commit, target = ""] = line.split(" ");
      refs.set(ref!, [ref!, commit!, target]);
    }
    for (const [ref, target] of symbolic) {
      const observed = refs.get(ref);
      // The stored immediate target matters even if Git resolves a chain.
      refs.set(ref, [ref, observed?.[1] ?? "", target]);
    }
    parents.forEach((path, index) => {
      const info = lstatSync(path);
      const before = identities[index]!;
      if (
        !info.isDirectory() ||
        realpathSync(path) !== path ||
        info.dev !== before.dev ||
        info.ino !== before.ino
      )
        throw new Error("source-change shared object directory changed");
    });
    return {
      commonDirectory: common,
      refs: [...refs.values()]
        .filter(([ref]) => ref !== `refs/heads/${branch}`)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
      alternates: bytes,
    };
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
  cleanAgainstCommit(): void {
    const flags = execFileSync("git", [...HOST_GIT, "ls-files", "-v", "-z"], {
      cwd: this.path,
      env: this.environment,
      timeout: 15_000,
    })
      .toString("utf8")
      .split("\0")
      .filter(Boolean);
    for (const entry of flags) {
      if (entry[0] === "S" || entry[0] === entry[0]!.toLowerCase()) {
        const path = entry.slice(2);
        throw new SourceWorktreeRefusal(`index-flags:${path}`, path);
      }
    }
    const entries = execFileSync(
      "git",
      [...HOST_GIT, "ls-tree", "-r", "-z", "HEAD"],
      {
        cwd: this.path,
        env: this.environment,
        timeout: 15_000,
        maxBuffer: 8 * 1024 * 1024,
      },
    )
      .toString("utf8")
      .split("\0")
      .filter(Boolean);
    for (const entry of entries) {
      const tab = entry.indexOf("\t"),
        path = entry.slice(tab + 1);
      const [mode, type, object] = entry.slice(0, tab).split(" ");
      // Git status judges gitlinks, including uninitialized submodules. They
      // are commit entries, not files whose contents equal a blob.
      if (mode === "160000" && type === "commit") continue;
      const absolute = join(this.path, path);
      const info = lstatSync(absolute, { throwIfNoEntry: false });
      const symlink = mode === "120000";
      if (
        type !== "blob" ||
        !info ||
        realpathSync(dirname(absolute)) !== dirname(absolute) ||
        (symlink
          ? !info?.isSymbolicLink()
          : !info?.isFile() ||
            !["100644", "100755"].includes(mode!) ||
            (info.mode & 0o111 ? "100755" : "100644") !== mode) ||
        !execFileSync("git", [...HOST_GIT, "cat-file", "blob", object!], {
          cwd: this.path,
          env: this.environment,
          timeout: 15_000,
          maxBuffer: 8 * 1024 * 1024,
        }).equals(
          symlink
            ? readlinkSync(absolute, { encoding: "buffer" })
            : readFileSync(absolute),
        )
      )
        throw new SourceWorktreeRefusal(`committed-tree-drift:${path}`, path);
    }
    if (this.git("status", "--porcelain", "--untracked-files=all"))
      throw new Error(
        "source-change committed tree is dirty; preserve for inspection",
      );
  }
  /** Keep an unadmitted candidate out of shared reachability walks without
   * changing its HEAD, index, objects or working files. Git's lock protects
   * the retained administration from pruning while its backlink is saved. */
  retainUnimported(): string | undefined {
    if (!present(this.path)) return undefined;
    const directory = dirname(this.objectDirectory);
    const common = realpathSync(
      sourceGit(
        this.options.requested.repo,
        "rev-parse",
        "--path-format=absolute",
        "--git-common-dir",
      ),
    );
    if (
      dirname(directory) !== join(common, "worktrees") ||
      realpathSync(directory) !== directory ||
      ordinaryFile(join(this.path, ".git")).toString("utf8").trim() !==
        `gitdir: ${directory}`
    )
      throw new Error("source-change retention identity drift");
    const backlink = join(directory, "gitdir");
    const retained = join(directory, "dotln-retained-gitdir");
    const expected = join(this.path, ".git");
    const pointer = present(retained) ? retained : backlink;
    if (ordinaryFile(pointer).toString("utf8").trim() !== expected)
      throw new Error("source-change retention backlink drift");
    if (present(retained) && present(backlink))
      throw new Error("source-change retention has two backlinks");
    const lock = join(directory, "locked");
    if (present(lock)) ordinaryFile(lock);
    else writeFileSync(lock, this.retentionLock, { flag: "wx", mode: 0o600 });
    if (!present(retained)) renameSync(backlink, retained);
    const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;
    return [
      "env",
      `GIT_OBJECT_DIRECTORY=${quote(this.objectDirectory)}`,
      `GIT_ALTERNATE_OBJECT_DIRECTORIES=${quote(this.objectEnvironment.GIT_ALTERNATE_OBJECT_DIRECTORIES)}`,
      "git",
      ...HOST_GIT.map(quote),
      "-C",
      quote(this.path),
      "log -1 --stat",
    ].join(" ");
  }
  private get retentionLock(): string {
    return `source-change ${this.options.commandId}: retained private candidate\n`;
  }
  private restoreRegistration(): void {
    const directory = dirname(this.objectDirectory);
    const retained = join(directory, "dotln-retained-gitdir");
    if (!present(retained)) return;
    // Revalidate the owned paths before undoing retention. The imported
    // candidate has already been checked in the shared object store.
    this.retainUnimported();
    renameSync(retained, join(directory, "gitdir"));
    const lock = join(directory, "locked");
    if (ordinaryFile(lock).toString("utf8") === this.retentionLock)
      unlinkSync(lock);
  }
  /** The committed change, re-verified; `admit` also applies the envelope's
   * change limits, which judge a change once, when it is first observed, so a
   * receipt saved before WO-157 still finishes and recovers. */
  effect(admit = false): { commit: string; diffHash: string } | undefined {
    const commit = this.verify();
    if (commit === this.options.requested.baseCommit) return undefined;
    this.cleanAgainstCommit();
    this.bundle("check");
    this.checkMessage();
    const { baseCommit, surfaces } = this.options.requested;
    const paths = execFileSync(
      "git",
      [
        ...HOST_GIT,
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
      { cwd: this.path, env: this.environment, timeout: 15_000 },
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
    // One commit carrying the host's message, whoever the writer was.
    if (
      this.git("rev-list", "--count", `${baseCommit}..${commit}`) !== "1" ||
      this.git("log", "-1", "--format=%B", commit).trimEnd() !==
        this.options.commitMessage.trimEnd()
    )
      throw new Error(
        "source-change result is not one commit with the host message",
      );
    if (admit) this.checkChangeLimits(baseCommit, commit);
    const diff = execFileSync(
      "git",
      [
        ...HOST_GIT,
        "diff",
        "--binary",
        "--no-ext-diff",
        "--no-textconv",
        "--no-renames",
        baseCommit,
        commit,
        "--",
      ],
      {
        cwd: this.path,
        env: this.environment,
        timeout: 15_000,
        maxBuffer: 8 * 1024 * 1024,
      },
    );
    return { commit, diffHash: sourceDigest(diff) };
  }
  /** Counts committed paths against the envelope's files ceiling and refuses
   * a removal or type change the envelope does not allow. With renames off, a
   * file replaced by a directory shows as the file's deletion. */
  private checkChangeLimits(baseCommit: string, commit: string): void {
    const limits = this.options.change;
    if (!limits) return;
    const fields = execFileSync(
      "git",
      [
        ...HOST_GIT,
        "diff",
        "--no-ext-diff",
        "--no-renames",
        "--name-status",
        "-z",
        baseCommit,
        commit,
        "--",
      ],
      {
        cwd: this.path,
        env: this.environment,
        timeout: 15_000,
        maxBuffer: 8 * 1024 * 1024,
      },
    )
      .toString()
      .split("\0")
      .filter(Boolean);
    const changes: { status: string; path: string }[] = [];
    for (let i = 0; i + 1 < fields.length; i += 2)
      changes.push({ status: fields[i]!, path: fields[i + 1]! });
    if (limits.files !== undefined && changes.length > limits.files)
      throw new Error(
        `source-change diff touches ${changes.length} paths, above the envelope's files ceiling of ${limits.files}: ${changes.map(({ path }) => path).join(", ")}`,
      );
    const removed = changes
      .filter(
        ({ status, path }) =>
          (status === "D" || status === "T") &&
          !(status === "D" && path === limits.relocation?.from),
      )
      .map(({ status, path }) => `${status} ${path}`);
    if (removed.length && !limits.deletion)
      throw new Error(
        `source-change diff removes or changes the type of paths without repo.delete (${changes.length} paths against ${limits.files === undefined ? "no files ceiling" : `the envelope's files ceiling of ${limits.files}`}): ${removed.join(", ")}`,
      );
  }
  /** The reader sees the private objects, and index-pack writes only to the
   * common store. A keep file protects the pack until a shared ref exists. */
  importCandidate(commit: string): ImportedCandidate {
    try {
      const tree = this.git("rev-parse", `${commit}^{tree}`);
      const revisions = [commit, `^${this.options.requested.baseCommit}`];
      const objects = this.git(
        "rev-list",
        "--objects",
        "--no-object-names",
        ...revisions,
      )
        .split("\n")
        .filter(Boolean)
        .sort();
      const bytes = execFileSync(
        "git",
        [...HOST_GIT, "pack-objects", "--stdout", "--revs"],
        {
          cwd: this.path,
          env: this.environment,
          input: revisions.join("\n") + "\n",
          stdio: ["pipe", "pipe", "pipe"],
          timeout: 15_000,
          maxBuffer: 64 * 1024 * 1024,
        },
      );
      const sharedEnv = { ...process.env };
      delete sharedEnv.GIT_OBJECT_DIRECTORY;
      delete sharedEnv.GIT_ALTERNATE_OBJECT_DIRECTORIES;
      const indexed = execFileSync(
        "git",
        [
          ...HOST_GIT,
          "index-pack",
          "--stdin",
          "--strict",
          `--keep=${this.keepMessage}`,
        ],
        {
          cwd: this.options.requested.repo,
          env: sharedEnv,
          input: bytes,
          stdio: ["pipe", "pipe", "pipe"],
          timeout: 15_000,
          maxBuffer: 1024 * 1024,
        },
      )
        .toString("utf8")
        .trim();
      const pack = /^(?:pack|keep)\t([a-f0-9]{40}|[a-f0-9]{64})$/u.exec(
        indexed,
      )?.[1];
      if (!pack)
        throw new Error("source-change import returned no pack identity");
      const imported = { commit, tree, objects, pack };
      this.verifyImported(imported);
      return imported;
    } catch (error) {
      throw new SourceImportRefusal(commit, error);
    }
  }
  private get keepMessage(): string {
    return `source-change ${this.options.commandId}`;
  }
  verifyImported(candidate: ImportedCandidate): void {
    const repo = this.options.requested.repo;
    try {
      for (const object of candidate.objects)
        sourceGit(repo, "cat-file", "-e", object);
      if (
        sourceGit(repo, "rev-parse", `${candidate.commit}^{tree}`) !==
        candidate.tree
      )
        throw new Error("imported tree differs from admission");
    } catch (error) {
      throw new SourceImportRefusal(candidate.commit, error);
    }
  }
  publishCandidate(candidate: ImportedCandidate): void {
    const { repo, branch } = this.options.requested;
    this.verifyImported(candidate);
    const ref = `refs/heads/${branch}`;
    const existing = spawnSync(
      "git",
      [...HOST_GIT, "show-ref", "--verify", "--quiet", ref],
      {
        cwd: repo,
        timeout: 5_000,
      },
    );
    if (existing.status === 1)
      sourceGit(
        repo,
        "update-ref",
        ref,
        candidate.commit,
        "0".repeat(candidate.commit.length),
      );
    else if (
      existing.status !== 0 ||
      sourceGit(repo, "rev-parse", ref) !== candidate.commit
    )
      throw new SourceImportRefusal(
        candidate.commit,
        new Error("episode branch differs from the admitted commit"),
      );
    this.verifyImported(candidate);
    this.restoreRegistration();
    const common = sourceGit(
      repo,
      "rev-parse",
      "--path-format=absolute",
      "--git-common-dir",
    );
    const keep = join(common, "objects/pack", `pack-${candidate.pack}.keep`);
    if (
      present(keep) &&
      ordinaryFile(keep).toString("utf8").trim() === this.keepMessage
    )
      unlinkSync(keep);
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
      [
        ...HOST_GIT,
        "ls-files",
        "--others",
        "--ignored",
        "--exclude-standard",
        "-z",
      ],
      { cwd: this.path, env: this.environment, timeout: 15_000 },
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
      this.git(
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
  if (process.platform !== "darwin")
    return {
      command,
      exitCode: null,
      signal: "confinement-unavailable",
      stdoutHash: sourceDigest(""),
      stderrHash: sourceDigest("macOS sandbox-exec required"),
    };
  const result = spawnSync(
    "/usr/bin/sandbox-exec",
    ["-p", discoverySandbox(path), binary!, ...args],
    {
      cwd: path,
      env: {
        PATH: `${dirname(process.execPath)}:/usr/bin:/bin`,
        // A read-only empty home avoids tool caches dirtying source. The
        // profile still denies every write outside the target worktree.
        HOME: "/var/empty",
        TMPDIR: path,
        // npm enables Node's cache under TMPDIR; it is not source output.
        NODE_DISABLE_COMPILE_CACHE: "1",
      },
      timeout: 180_000,
      maxBuffer: 1024 * 1024,
    },
  );
  return {
    command,
    exitCode:
      result.error || result.stderr?.toString().startsWith("sandbox-exec:")
        ? null
        : result.status,
    signal:
      result.signal ??
      (result.error || result.stderr?.toString().startsWith("sandbox-exec:")
        ? "confinement-unavailable"
        : null),
    stdoutHash: sourceDigest(result.stdout ?? Buffer.alloc(0)),
    stderrHash: sourceDigest(result.stderr ?? Buffer.alloc(0)),
  };
}
