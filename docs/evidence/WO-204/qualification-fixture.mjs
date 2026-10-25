// Synthetic live evidence only; these probes are never an npm test task.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { compileLoadout } from "../../../packages/compiler/dist/src/index.js";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import {
  HOST_GIT,
  sourceObjectEnvironment,
} from "../../../packages/skeleton/dist/src/source-change-worktree.js";

export const launchpad = realpathSync(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
export const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const gitEnvironment = (extra = {}) => ({
  ...process.env,
  GIT_OBJECT_DIRECTORY: undefined,
  GIT_ALTERNATE_OBJECT_DIRECTORIES: undefined,
  ...extra,
});
export const git = (cwd, args, extra = {}) =>
  execFileSync("git", [...HOST_GIT, ...args], {
    cwd,
    env: gitEnvironment(extra),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 15_000,
  }).trim();
export const version = (binary) =>
  execFileSync(binary, ["--version"], {
    encoding: "utf8",
    timeout: 5000,
  }).match(/\b\d+\.\d+\.\d+\b/u)?.[0] ?? "unknown";

export function createQualificationFixture(harness, episode = 1) {
  if (
    realpathSync(process.cwd()) !== launchpad ||
    git(launchpad, ["rev-parse", "--show-toplevel"]) !== launchpad
  )
    throw new Error("qualification requires the selected physical Git root");
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo204-")));
  const repo = join(root, "target"),
    parent = join(root, "trees");
  mkdirSync(repo);
  mkdirSync(parent);
  git(repo, ["init", "--initial-branch=main"]);
  for (const [key, value] of [
    ["user.name", "Fixture"],
    ["user.email", "fixture@example.invalid"],
    ["commit.gpgsign", "false"],
    ["core.hooksPath", "/dev/null"],
    ["rerere.enabled", "false"],
  ])
    git(repo, ["config", key, value]);
  writeFileSync(join(repo, "fixture.txt"), "baseline\n");
  writeFileSync(
    join(repo, "fixture-test.mjs"),
    "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(readFileSync('fixture.txt','utf8'), 'changed by synthetic worker\\n'); console.log('Synthetic focused check passed');\n",
  );
  git(repo, ["add", "-A"]);
  git(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-m",
    "Synthetic source qualification baseline",
  ]);
  git(repo, ["config", "rerere.enabled", "true"]);
  git(repo, ["pack-refs", "--all"]);
  const baseCommit = git(repo, ["rev-parse", "HEAD"]);
  const loadout = JSON.parse(
    readFileSync(
      new URL("../WO-053/worker-loadout.json", import.meta.url),
      "utf8",
    ),
  );
  loadout.loadoutId = "source-writer-qualification.v1";
  loadout.identity.lineage = ["WO-204"];
  const mechanic = loadout.activeMechanics[0];
  mechanic.authorityEnvelope.expiresAt = Date.now() + 20 * 60_000;
  mechanic.workOrder.workOrderId = `wo204_${harness}_${episode}`;
  mechanic.workOrder.objective =
    "Change only fixture.txt to exactly changed by synthetic worker followed by a newline, run the host's exact test command, then stage and commit with the host's exact commands.";
  mechanic.workOrder.acceptanceCriteria = [
    "Only fixture.txt changes",
    "The host's focused test passes",
    "Exactly one local commit with the host's message",
  ];
  mechanic.workOrder.knownFacts = [
    "This is a disposable synthetic repository; fixture.txt currently contains baseline followed by a newline.",
    "The host has prepared the assigned worktree for one writer and supplies the commit message.",
  ];
  mechanic.workOrder.constraints = [
    "Do not change the test, governance, settings or message",
    "Use only the host-declared test and exact add/commit commands for effectful shell operations; bounded read-only inspection follows the transport instructions",
  ];
  loadout.role.obligations = [
    "Make the declared single-file change, run the host test and commit with the host message",
  ];
  const compiled = compileLoadout(loadout, {
    environmentId: "wo204.synthetic",
    version: 1,
    capabilities: [],
    repo,
    baseCommit,
  });
  if (!compiled.ok) throw new Error("synthetic loadout compilation failed");
  return {
    root,
    repo,
    parent,
    common: join(repo, ".git"),
    baseCommit,
    options: {
      workOrder: compiled.program.workOrder,
      authorityEnvelope: compiled.program.authorityEnvelope,
      authorityEvidence: [],
      artifactIdentity: compiled.artifactIdentity,
      branch: `qualification-${harness}-${episode}`,
      surfaces: ["fixture.txt"],
      worktreeParent: parent,
      launchpadCheckout: launchpad,
      testCommand: "node fixture-test.mjs",
      commitMessage: "Change the synthetic fixture\n",
      model: harness === "claude" ? "claude-opus-5-5" : "gpt-6.1-sol",
      effort: harness === "claude" ? "xhigh" : "max",
    },
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}
export const makeHost = (fixture, transport, hooks = {}) =>
  new SourceChangeHost({
    ...fixture.options,
    store: new WorkerStore(join(fixture.root, "episode-store")),
    transport,
    ...hooks,
  });
export const qualificationRequest = (fixture, host) => ({
  kind: "source-change",
  command: host.command,
  workOrder: fixture.options.workOrder,
  authorityEnvelope: fixture.options.authorityEnvelope,
  artifactIdentity: fixture.options.artifactIdentity,
  episodeId: "sandbox_qualification",
  model: fixture.options.model,
  effort: fixture.options.effort,
  cwd: host.tree.path,
  profile: {
    profileId: "source-change-v1",
    mounts: [{ path: host.tree.path, access: "read-write" }],
    writableSurfaces: [host.tree.path],
    worktreeParent: fixture.parent,
    launchpadCheckout: launchpad,
  },
  testCommand: fixture.options.testCommand,
  commitMessagePath: host.tree.messagePath,
});
export function qualificationPaths(fixture, host) {
  const objectDirectory = sourceObjectEnvironment(
    host.tree.path,
  ).GIT_OBJECT_DIRECTORY;
  return {
    scratch: fixture.root,
    common: fixture.common,
    worktree: host.tree.path,
    gitdir: git(host.tree.path, [
      "rev-parse",
      "--path-format=absolute",
      "--git-dir",
    ]),
    store: objectDirectory,
  };
}
export function relativize(value, paths = {}, home = homedir()) {
  const replacements = [
    ...Object.entries(paths).map(([name, value]) => [value, `<${name}>`]),
    [home, "<home>"],
  ]
    .filter(([value]) => typeof value === "string" && value.length > 1)
    .sort(([a], [b]) => b.length - a.length);
  if (typeof value === "string")
    return replacements.reduce(
      (text, [from, to]) => text.replaceAll(from, to),
      value,
    );
  if (Array.isArray(value))
    return value.map((entry) => relativize(entry, paths, home));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        relativize(entry, paths, home),
      ]),
    );
  return value;
}
export function classifyObjectLocations({
  privateReadable,
  sharedReadable,
  changed,
}) {
  if (!changed) return "no-candidate";
  if (privateReadable && !sharedReadable) return "private-only";
  if (sharedReadable) return "shared-before-import";
  return "candidate-unreadable";
}
export function objectLocations(fixture, host) {
  const env = sourceObjectEnvironment(host.tree.path);
  const commit = git(host.tree.path, ["rev-parse", "HEAD"], env);
  const readable = (extra) =>
    spawnSync("git", [...HOST_GIT, "cat-file", "-e", `${commit}^{commit}`], {
      cwd: fixture.repo,
      env: gitEnvironment(extra),
      stdio: "pipe",
      timeout: 5000,
    }).status === 0;
  const facts = {
    changed: commit !== fixture.baseCommit,
    privateReadable: readable(env),
    sharedReadable: readable({}),
  };
  return { ...facts, classification: classifyObjectLocations(facts) };
}
export function sharedSnapshot(common, ownGitdir) {
  const entries = {};
  const visit = (directory) => {
    for (const name of readdirSync(directory).sort()) {
      const full = join(directory, name);
      if (full === ownGitdir) continue;
      const info = lstatSync(full),
        key = relative(common, full);
      if (info.isSymbolicLink()) entries[key] = ["symlink", readlinkSync(full)];
      else if (info.isDirectory()) {
        entries[key] = ["directory", info.mode];
        visit(full);
      } else if (info.isFile())
        entries[key] = ["file", info.mode, hash(readFileSync(full))];
      else throw new Error("shared snapshot contains a nonordinary entry");
    }
  };
  visit(common);
  return entries;
}
export const changedSharedPaths = (before, after) =>
  [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .sort()
    .map((key) => `<common>/${key}`);
export function hostFacts(host, outcome) {
  const events = decodeLog(host.options.store.read());
  const writer = events.findLast(
    (event) => event.type === "WorkerResultObserved",
  )?.payload.envelope;
  const imported = events.filter((event) => event.type === "CandidateImported");
  const types = events.map((event) => event.type);
  return {
    outcome: outcome?.status ?? "error",
    refusal: outcome?.refusal?.reason ?? null,
    writer: writer
      ? { status: writer.status, requiresHuman: writer.requiresHuman }
      : null,
    attempts: types.filter((type) => type === "WorkerAttemptStarted").length,
    candidateImported: imported.length,
    importedObjects: imported[0]?.payload.objects.length ?? 0,
    sourceChangeObserved: types.filter(
      (type) => type === "SourceChangeObserved",
    ).length,
    importPrecedesObservation:
      types.indexOf("CandidateImported") >= 0 &&
      types.indexOf("CandidateImported") <
        types.indexOf("SourceChangeObserved"),
    focusedBeforeExit: outcome?.observation?.testBefore.exitCode ?? null,
    focusedAfterExit: outcome?.observation?.testAfter.exitCode ?? null,
  };
}
export function safeUsage(observation) {
  if (!observation) return { source: "unavailable", usage: null };
  return {
    source: observation.source,
    scope: observation.scope,
    observedAt: observation.observedAt,
    usage: observation.usage,
  };
}
export function readRecord(file) {
  return existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8"))
    : { schemaVersion: 1 };
}
export function saveRecord(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}
export function requireNextEpisode(record, decision, decisionsFile) {
  const episodes = record?.episodes ?? [];
  if (episodes.length >= 2)
    throw new Error("qualification episode budget exhausted");
  if (episodes.some((episode) => episode.passed))
    throw new Error("qualification already passed");
  if (
    episodes.length &&
    (!/^WO-204-D\d{3}$/u.test(decision ?? "") ||
      !readFileSync(decisionsFile, "utf8").includes(`\"id\": \"${decision}\"`))
  )
    throw new Error("a second episode requires its recorded cause decision");
  return episodes.length + 1;
}
