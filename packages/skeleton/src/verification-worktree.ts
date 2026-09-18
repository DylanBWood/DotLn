import {
  chmodSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import {
  assertVerificationTask,
  canonicalStringify,
  compileVerificationTask,
  repositoryPath,
  verificationSnapshotHash,
  type AcceptanceCriterion,
  type NamedVerificationTest,
  type RepositoryFile,
  type VerificationEvidence,
  type VerificationSubject,
  type VerificationTask,
  type WorktreeSnapshot,
  type WorktreeVerificationContract,
} from "@dotln/compiler";
import {
  observedExecFileSync as execFileSync,
  observedSpawnSync as spawnSync,
} from "./gate-deadlines.mjs";
import { discoverySandbox } from "./discovery-sandbox.js";
import { WorkerFailure } from "./worker-protocol.js";

const refuse = (detail: string): never => {
  throw new WorkerFailure("profile-refused", detail);
};
const git = (cwd: string, ...args: string[]): Buffer =>
  execFileSync("git", args, {
    cwd,
    timeout: 15_000,
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
const canonicalDirectory = (path: string): string => {
  if (
    resolve(path) !== path ||
    realpathSync(path) !== path ||
    !lstatSync(path).isDirectory()
  )
    refuse("snapshot directory must be canonical");
  return path;
};
const modeOf = (mode: number): "100644" | "100755" =>
  mode & 0o111 ? "100755" : "100644";
function readText(path: string): string {
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 100_000)
    refuse("snapshot requires bounded regular text files");
  const bytes = readFileSync(path),
    contents = bytes.toString("utf8");
  if (bytes.includes(0) || !Buffer.from(contents).equals(bytes))
    refuse("snapshot does not support binary files");
  return contents;
}
function inventory(root: string): RepositoryFile[] {
  canonicalDirectory(root);
  const files: RepositoryFile[] = [];
  let entries = 0;
  const walk = (directory: string, prefix: string, depth: number) => {
    if (depth > 32) refuse("snapshot directory depth");
    if (lstatSync(directory).mode & 0o222)
      refuse("snapshot read mount is writable");
    const names = readdirSync(directory).sort();
    if (!names.length) refuse("snapshot contains an empty directory");
    for (const name of names) {
      if (++entries > 3300) refuse("snapshot inventory bound");
      const path = prefix + name,
        absolute = join(root, path),
        stat = lstatSync(absolute);
      if (!repositoryPath(path) || stat.isSymbolicLink())
        refuse(`snapshot path refused: ${path}`);
      if (stat.isDirectory()) walk(absolute, `${path}/`, depth + 1);
      else {
        if (stat.mode & 0o222)
          refuse(`snapshot read mount is writable: ${path}`);
        files.push({
          path,
          contents: readText(absolute),
          mode: modeOf(stat.mode),
        });
      }
      if (files.length > 100) refuse("snapshot exceeds 100 files");
    }
  };
  walk(root, "", 0);
  return files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}
function materialize(
  root: string,
  files: readonly RepositoryFile[],
  readOnly: boolean,
): void {
  mkdirSync(root, { mode: 0o700 });
  for (const file of files) {
    const path = join(root, file.path);
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    writeFileSync(path, file.contents, {
      flag: "wx",
      mode: file.mode === "100755" ? 0o700 : 0o600,
    });
    if (readOnly) chmodSync(path, file.mode === "100755" ? 0o500 : 0o400);
  }
  if (readOnly) {
    const seal = (path: string) => {
      for (const name of readdirSync(path)) {
        const child = join(path, name);
        if (lstatSync(child).isDirectory()) seal(child);
      }
      chmodSync(path, 0o500);
    };
    seal(root);
  }
}

/** Recheck the actual read mount, including cached-result recovery. */
export function assertWorktreeSnapshot(
  capsule: VerificationTask,
  cwd: string,
): void {
  assertVerificationTask(capsule);
  const snapshot = capsule.subject.snapshot;
  if (!snapshot) return;
  if (capsule.role !== "verifier")
    refuse("worktree-snapshot repair continuation is not supported");
  const files = inventory(cwd);
  if (
    verificationSnapshotHash({ ...capsule.subject, files }, snapshot) !==
    snapshot.snapshotHash
  )
    refuse("snapshot input hash drift");
}

export interface WorktreeVerificationOptions {
  /** Existing WO-052 target worktree; ignored host scaffolding is never copied. */
  readonly worktree: string;
  readonly baseCommit: string;
  readonly observedCommit: string;
  /** Public logical identity. Physical source paths never enter the capsule. */
  readonly repo: string;
  readonly contract: WorktreeVerificationContract;
  readonly criteria: readonly AcceptanceCriterion[];
  readonly tests: readonly NamedVerificationTest[];
  /** New host-owned directory, outside the target worktree. Retained for inspection. */
  readonly directory: string;
}

function witnessTest(
  subject: VerificationSubject,
  criterion: AcceptanceCriterion,
  test: NamedVerificationTest,
  cwd: string,
  ordinal: number,
): VerificationEvidence {
  let exitCode: number | null = null,
    signal: string | null = "confinement-unavailable";
  let stdout = "",
    stderr = "macOS sandbox-exec is required";
  if (process.platform === "darwin") {
    const [binary, ...args] = test.command.split(" ");
    const execution = spawnSync(
      "/usr/bin/sandbox-exec",
      ["-p", discoverySandbox(cwd), binary!, ...args],
      {
        cwd,
        env: {
          PATH: `${dirname(process.execPath)}:/usr/bin:/bin`,
          HOME: cwd,
          TMPDIR: cwd,
        },
        timeout: 30_000,
        killSignal: "SIGKILL",
        maxBuffer: 65536,
      },
    );
    stdout = (execution.stdout ?? Buffer.alloc(0))
      .toString("utf8")
      .slice(0, 65536);
    stderr = (execution.stderr ?? Buffer.alloc(0))
      .toString("utf8")
      .slice(0, 65536);
    const launchFailed =
      !!execution.error || stderr.startsWith("sandbox-exec:");
    exitCode = launchFailed ? null : execution.status;
    signal = execution.signal ?? (launchFailed ? "launch-unavailable" : null);
  }
  const outcome =
    signal !== null || exitCode === null
      ? "unavailable"
      : exitCode === 0
        ? "pass"
        : "fail";
  return {
    evidenceId: `${subject.revision}:host-test:${ordinal}`,
    criterionId: criterion.criterionId,
    checkId: test.checkId,
    claimType: "behavior",
    source: "live",
    subjectRevision: subject.revision,
    codeSurfaces: criterion.codeSurfaces,
    automatedTest: test.command,
    observed:
      outcome === "unavailable"
        ? "test execution unavailable"
        : `exit ${exitCode}`,
    expected: "exit 0",
    outcome,
    reproductionSteps: [
      `Run ${test.command} in a fresh confined copy of snapshot ${subject.snapshot!.snapshotHash}.`,
    ],
    hostTest: {
      kind: "host-run-test",
      origin: "host",
      snapshotHash: subject.snapshot!.snapshotHash,
      command: test.command,
      exitCode,
      signal,
      stdout,
      stderr,
    },
  };
}

/** Host-only preparation precedes VerificationOpened and the verifier episode.
 * Each named test gets a new files-only checkout; no shared Git metadata is writable.
 * This first-proof confinement is not a hostile-process security boundary. */
export function prepareWorktreeVerification(
  options: WorktreeVerificationOptions,
): {
  readonly subject: VerificationSubject;
  readonly snapshotPath: string;
  readonly testPaths: readonly string[];
} {
  const source = canonicalDirectory(options.worktree);
  const parent = canonicalDirectory(dirname(options.directory));
  if (
    resolve(options.directory) !== options.directory ||
    options.directory === source ||
    options.directory.startsWith(source + sep) ||
    source.startsWith(options.directory + sep)
  )
    refuse("snapshot directory overlaps or aliases the target");
  if (
    git(source, "rev-parse", "--show-toplevel").toString().trim() !== source ||
    git(source, "rev-parse", "HEAD").toString().trim() !==
      options.observedCommit ||
    !/^[a-f0-9]{40}$/u.test(options.baseCommit) ||
    !/^[a-f0-9]{40}$/u.test(options.observedCommit)
  )
    refuse("snapshot target identity drift");
  git(
    source,
    "merge-base",
    "--is-ancestor",
    options.baseCommit,
    options.observedCommit,
  );
  if (git(source, "status", "--porcelain", "--untracked-files=all").length)
    refuse("snapshot requires a committed, clean target");
  const entries = git(source, "ls-tree", "-r", "-z", options.observedCommit)
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
  if (!entries.length || entries.length > 100)
    refuse("snapshot requires 1 to 100 files");
  const files = entries
    .map((entry) => {
      const match = /^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/u.exec(entry);
      if (!match || !repositoryPath(match[3]))
        refuse("snapshot tree contains an unsupported path or mode");
      const path = match![3]!,
        absolute = join(source, path);
      if (realpathSync(absolute) !== absolute)
        refuse(`snapshot aliases a path: ${path}`);
      const contents = readText(absolute),
        mode = match![1] as "100644" | "100755";
      if (
        !git(source, "cat-file", "blob", match![2]!).equals(
          Buffer.from(contents),
        ) ||
        modeOf(lstatSync(absolute).mode) !== mode
      )
        refuse(`snapshot target bytes or mode drift: ${path}`);
      return { path, contents, mode };
    })
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const body = {
    repo: options.repo,
    baseCommit: options.baseCommit,
    revision: options.observedCommit,
    diff: git(
      source,
      "diff",
      "--binary",
      "--no-ext-diff",
      "--no-textconv",
      "--no-renames",
      options.baseCommit,
      options.observedCommit,
      "--",
    ).toString("utf8"),
    files,
    evidence: [],
  };
  const metadata = {
    profile: "worktree-snapshot" as const,
    observedCommit: options.observedCommit,
    contract: options.contract,
    tests: options.tests,
  };
  const snapshot: WorktreeSnapshot = {
    ...metadata,
    snapshotHash: verificationSnapshotHash(body, metadata),
  };
  // Validate the full pure contract before creating anything or executing tests.
  const sealed = compileVerificationTask(
    "snapshot_preflight",
    options.criteria,
    { ...body, snapshot },
  );
  if (canonicalDirectory(dirname(options.directory)) !== parent)
    refuse("snapshot parent drift");
  mkdirSync(options.directory, { mode: 0o700 });
  const snapshotPath = join(options.directory, "snapshot");
  materialize(snapshotPath, sealed.subject.files, true);
  const testPaths: string[] = [];
  const evidence = sealed.subject.snapshot!.tests.map((test, ordinal) => {
    assertWorktreeSnapshot(sealed, snapshotPath);
    const path = join(options.directory, `test-${ordinal}`);
    materialize(path, sealed.subject.files, false);
    testPaths.push(path);
    const witness = witnessTest(
      sealed.subject,
      sealed.criteria.find((c) => c.criterionId === test.criterionId)!,
      test,
      path,
      ordinal,
    );
    // Tests may create caches, but may not alter any sealed input (including tests).
    for (const file of sealed.subject.files) {
      const absolute = join(path, file.path);
      if (
        realpathSync(absolute) !== absolute ||
        readText(absolute) !== file.contents ||
        modeOf(lstatSync(absolute).mode) !== file.mode
      )
        refuse(`named test changed a snapshot input: ${file.path}`);
    }
    assertWorktreeSnapshot(sealed, snapshotPath);
    return witness;
  });
  const subject = compileVerificationTask(
    "snapshot_preflight",
    sealed.criteria,
    { ...sealed.subject, evidence },
  ).subject;
  // Caller-owned mutable objects are not retained across the effect boundary.
  if (
    canonicalStringify(subject.snapshot) !==
    canonicalStringify(sealed.subject.snapshot)
  )
    refuse("snapshot metadata drift");
  return { subject, snapshotPath, testPaths };
}
