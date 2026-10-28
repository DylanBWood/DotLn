// VER-005 probe: the F10 repair's absence rule under variations that the
// repair's cases and VER-004's probe held constant. Those made the owning
// worktree an independent `git init` repository inside the system temp
// directory and removed it with rmSync. Release close instead removes a
// linked worktree of the main checkout with `git worktree remove`, and a real
// worktree lives outside the system temp directory.
// Each arm is a dry-run pruneHarness from a synthetic main checkout over a
// synthetic temporary base, as release close's prune runs (no finishing
// gate). The fixture F of gate G is owned by a linked worktree W; it ended
// failed and holds a nested session scratch N whose fixtureOwner names F.
// Expected candidates, every owner dead and the judgment in 2036:
// (control) W present; (linked-removed) W removed by `git worktree remove
// --force`; (linked-prunable) W deleted while still registered; (outside) W
// lives in the directory given as the first argument, outside the system temp
// directory, and is removed (skipped without the argument).
// Expected retentions, W removed unless stated: (live-owner) F's owner is this
// live process, judged against the real process table; (fresh) F ended one
// hour before the judgment; (unreadable) W present with mode 000; (file) a
// regular file stands at W's path. An observation other than proven absence
// must retain.
// The probe removes everything it created. Exit 1 when an arm disagrees with
// its expectation; exit 2 when the control arm does not list F.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-005-absence-variations.mjs <directory outside system temp>
import { randomUUID } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = realpathSync(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
const {
  createTemporaryRoot,
  finishTemporaryRoot,
  readTemporaryOwner,
  temporaryProcessTable,
} = await import(join(sourceRoot, "scripts/lib/temporary-roots.mjs"));
const { pruneHarness } = await import(
  join(sourceRoot, "scripts/lib/harness-prune.mjs")
);
const { runGit } = await import(join(sourceRoot, "scripts/lib/git.mjs"));

const temp = realpathSync(tmpdir());
const outsideBase = process.argv[2] ? realpathSync(process.argv[2]) : null;
if (outsideBase && (outsideBase === temp || outsideBase.startsWith(temp + "/")))
  throw new Error(
    "The outside directory must lie outside the system temp directory",
  );
// The scaffold is this probe's own, outside the dotln-* families prune reads.
const scaffold = realpathSync(mkdtempSync(join(temp, "v005-absence-")));
const outside = outsideBase
  ? realpathSync(mkdtempSync(join(outsideBase, "v005-absence-")))
  : null;
const later = Date.parse("2036-01-01T00:00:00.000Z");
const dead = { pid: 2147483647, birth: "1.0", session: "0".repeat(64) };
const table = temporaryProcessTable(sourceRoot);
const self = table?.find((row) => row.pid === process.pid) ?? null;
const shown = (text) =>
  text
    ?.split(scaffold)
    .join("<scaffold>")
    .split(outside ?? "\0")
    .join("<outside>")
    .split(temp)
    .join("<system-temp>") ?? null;
const git = (cwd, args) =>
  runGit(cwd, [
    "-c",
    "init.templateDir=",
    "-c",
    "core.hooksPath=/dev/null",
    ...args,
  ]);

async function arm(name, options = {}) {
  const at = join(scaffold, name);
  const main = join(at, "main");
  mkdirSync(main, { recursive: true });
  git(main, ["init", "-q", "-b", "main"]);
  writeFileSync(join(main, "README.md"), "probe\n");
  git(main, ["add", "README.md"]);
  git(main, [
    "-c",
    "user.name=probe",
    "-c",
    "user.email=probe@example.invalid",
    "commit",
    "-q",
    "-m",
    "probe",
  ]);
  const worktree = join(options.outside ? outside : at, `${name}-worktree`);
  git(main, ["worktree", "add", "-q", "-b", `probe-${name}`, worktree]);
  const physical = realpathSync(worktree);
  const base = join(at, "temp");
  mkdirSync(base);
  const owner =
    options.liveOwner && self
      ? { ...dead, pid: self.pid, birth: self.birth }
      : dead;
  const gate = { gateId: randomUUID(), suite: "harness-fixtures" };
  const fixture = createTemporaryRoot(join(base, "dotln-fixture-temporary-"), {
    class: "gate-fixture",
    repository: physical,
    owner: { ...owner, ...gate },
  });
  const nestedRepository = join(fixture, "dotln-harness-test-repo");
  mkdirSync(nestedRepository);
  git(nestedRepository, ["init", "-q", "-b", "main"]);
  const nested = createTemporaryRoot(join(fixture, "dotln-nested-"), {
    class: "session-scratch",
    repository: realpathSync(nestedRepository),
    owner: { ...dead, ...gate },
  });
  const ended = options.fresh
    ? new Date(Date.now() - 3_600_000).toISOString()
    : "2020-01-01T00:00:00.000Z";
  finishTemporaryRoot(nested, "failed", ended);
  finishTemporaryRoot(fixture, "failed", ended);
  const sharesLifetime =
    readTemporaryOwner(nested).fixtureOwner?.token ===
    readTemporaryOwner(fixture).token;
  if (options.remove === "git")
    git(main, ["worktree", "remove", "--force", worktree]);
  if (options.remove === "rm")
    rmSync(worktree, { recursive: true, force: true });
  if (options.file) writeFileSync(worktree, "not a repository\n");
  if (options.unreadable) chmodSync(worktree, 0o000);
  // A plan that refuses as a whole removes nothing; record it beside the rows.
  let report = { candidates: [], retained: [] };
  let planError = null;
  try {
    report = await pruneHarness(main, {
      apply: false,
      scope: "repository",
      temporaryBases: [base],
      hostDirectory: join(main, ".runtime/host"),
      processes: options.liveOwner ? table : [],
      openPaths: [],
      sessionId: "verification-005",
      now: options.fresh ? Date.now() : later,
    });
  } catch (error) {
    planError = shown(error.message);
  } finally {
    if (options.unreadable) chmodSync(worktree, 0o700);
  }
  const listed = git(main, ["worktree", "list", "--porcelain"]);
  return {
    expected: options.expect,
    fixtureIsCandidate: report.candidates.some((row) => row.path === fixture),
    fixtureRetainedReason: shown(
      report.retained.find((row) => row.path === fixture)?.reason,
    ),
    planError,
    nestedSharesFixtureLifetime: sharesLifetime,
    worktreeOutsideSystemTemp: !physical.startsWith(temp + "/"),
    worktreeState: options.file
      ? "file"
      : existsSync(worktree)
        ? "directory"
        : "absent",
    worktreeRegistered: listed.includes(`worktree ${physical}\n`),
    ownerLive: Boolean(options.liveOwner && self),
  };
}

const arms = [
  ["control", { expect: "candidate" }],
  ["linkedRemoved", { expect: "candidate", remove: "git" }],
  ["linkedPrunable", { expect: "candidate", remove: "rm" }],
  ...(outside
    ? [["outside", { expect: "candidate", remove: "git", outside: true }]]
    : []),
  ["liveOwner", { expect: "retained", remove: "git", liveOwner: true }],
  ["fresh", { expect: "retained", remove: "git", fresh: true }],
  ["unreadable", { expect: "retained", unreadable: true }],
  ["file", { expect: "retained", remove: "git", file: true }],
];
const output = {
  processTableReadable: Boolean(table),
  selfInTable: Boolean(self),
};
try {
  for (const [name, options] of arms) output[name] = await arm(name, options);
} finally {
  rmSync(scaffold, { recursive: true, force: true });
  if (outside) rmSync(outside, { recursive: true, force: true });
}
if (!outside)
  output.outside = "not run: no directory outside system temp given";
output.cleanup = {
  scaffoldRemaining: existsSync(scaffold),
  outsideRemaining: outside ? existsSync(outside) : null,
};
console.log(JSON.stringify(output, null, 1));
const disagreements = arms
  .map(([name]) => [name, output[name]])
  .filter(
    ([name, row]) =>
      name !== "control" &&
      (row.expected === "candidate") !== row.fixtureIsCandidate,
  )
  .map(([name]) => name);
if (!output.control.fixtureIsCandidate) {
  console.error("Inconclusive: the control arm does not list the fixture.");
  process.exitCode = 2;
} else if (disagreements.length || (output.liveOwner && !self)) {
  console.error(
    `Disagreement: ${disagreements.join(", ") || "no live owner identity"}`,
  );
  process.exitCode = 1;
}
