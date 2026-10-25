// WO-204 VER-002 probe. Varies what the repair's retention cases hold
// constant: the host dies between its refusal record and retention, or right
// after the retention record, and a retained worktree is then handled with
// ordinary Git. Also plants a tracked file's parent directory as a symlink to
// an identical copy. Synthetic repositories under the system temporary
// directory only. Exits 1 when a judged expectation fails; `observed` fields
// are recorded without judgment.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
  mkdtempSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dist = new URL("../../../packages/skeleton/dist/", import.meta.url);
const fixtureUrl = new URL("test/source-change-fixture.js", dist).href;
const hostUrl = new URL("src/source-change-host.js", dist).href;
const fixture = await import(fixtureUrl);
const { SourceChangeHost } = await import(hostUrl);

const plainEnv = { ...process.env };
delete plainEnv.GIT_OBJECT_DIRECTORY;
delete plainEnv.GIT_ALTERNATE_OBJECT_DIRECTORIES;
const git = (cwd, args) =>
  spawnSync("git", ["-c", "maintenance.auto=false", ...args], {
    cwd,
    env: plainEnv,
    encoding: "utf8",
  });
const events = (root) =>
  readFileSync(join(root, "store/events.jsonl"), "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
const launches = (root) =>
  readFileSync(join(root, "launches.txt"), "utf8").split("\n").filter(Boolean)
    .length;
const reachability = (repo) =>
  Object.fromEntries(
    [
      ["log", "--all", "--oneline"],
      ["rev-list", "--all", "--count"],
      ["fsck"],
      ["repack", "-ad"],
      ["gc", "--prune=now"],
    ].map((args) => [args.join(" "), git(repo, args).status]),
  );
const allZero = (exits) => Object.values(exits).every((code) => code === 0);
const worktreeOf = (root) =>
  join(
    root,
    "trees",
    spawnSync("ls", [join(root, "trees")], { encoding: "utf8" })
      .stdout.split("\n")
      .find((name) => name.startsWith("cmd_")),
  );
const firstLine = (text) => (text ?? "").trim().split("\n")[0] ?? "";

let failed = false;
const report = (row) => {
  if (row.passed === false) failed = true;
  console.log(JSON.stringify(row));
};

// A: the host dies at a named record of a commit-blocked episode, then reruns.
for (const transport of ["codex", "claude"])
  for (const point of [
    "WorkerResultObserved",
    "SourceChangeRefused",
    "SourceChangeCandidateRetained",
  ]) {
    const root = fixture.createSourceFixture();
    try {
      const repo = join(root, "target");
      const script = `
        import { SourceChangeHost } from ${JSON.stringify(hostUrl)};
        import { sourceFixtureOptions } from ${JSON.stringify(fixtureUrl)};
        await new SourceChangeHost({...sourceFixtureOptions(process.argv[1], () => 10, 'commit-blocked', process.argv[2]),
          onEvent(event) { if (event.type === process.argv[3]) process.kill(process.pid, 'SIGKILL'); }
        }).run();`;
      const killed = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", script, root, transport, point],
        { encoding: "utf8", timeout: 60_000 },
      );
      const afterCrash = reachability(repo);
      const outcome = await new SourceChangeHost(
        fixture.sourceFixtureOptions(
          root,
          () => 100,
          "commit-blocked",
          transport,
        ),
      ).run();
      const afterRerun = reachability(repo);
      const rows = events(root);
      const retained = rows.filter(
        (row) => row.type === "SourceChangeCandidateRetained",
      ).length;
      const candidate = spawnSync("git", ["rev-parse", "HEAD"], {
        cwd: worktreeOf(root),
        env: plainEnv,
        encoding: "utf8",
      }).stdout.trim();
      const sharedHasCandidate =
        git(repo, ["cat-file", "-e", candidate]).status === 0;
      report({
        case: "crash-then-rerun",
        transport,
        point,
        killedSignal: killed.signal,
        observed: { afterCrash },
        outcome: outcome.status,
        reason: outcome.refusal?.reason ?? null,
        launches: launches(root),
        retainedRecords: retained,
        afterRerun,
        sharedHasCandidate,
        passed:
          killed.signal === "SIGKILL" &&
          outcome.status === "refused" &&
          outcome.refusal.reason === "writer-requested-attention" &&
          launches(root) === 1 &&
          retained === 1 &&
          allZero(afterRerun) &&
          !sharedHasCandidate,
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

// B: a retained worktree handled with ordinary Git, beside a plain control.
{
  const control = realpathSync(mkdtempSync(join(tmpdir(), "dotln-ver002-")));
  try {
    const repo = join(control, "repo");
    mkdirSync(repo);
    const id = [
      "-c",
      "user.name=Probe",
      "-c",
      "user.email=probe@example.invalid",
      "-c",
      "commit.gpgsign=false",
    ];
    git(repo, ["init", "--initial-branch=main"]);
    writeFileSync(join(repo, "a.txt"), "a\n");
    git(repo, ["add", "-A"]);
    git(repo, [...id, "commit", "-m", "base"]);
    const tree = join(control, "tree");
    git(repo, ["worktree", "add", "-b", "probe", tree]);
    writeFileSync(join(tree, "a.txt"), "b\n");
    git(tree, [...id, "commit", "-am", "candidate"]);
    report({
      case: "plain-worktree-control",
      observed: {
        listed: git(repo, ["worktree", "list", "--porcelain"]).stdout.includes(
          `worktree ${tree}\n`,
        ),
        removeForce: git(repo, ["worktree", "remove", "--force", tree]).status,
      },
    });
  } finally {
    rmSync(control, { recursive: true, force: true });
  }
}
for (const transport of ["codex", "claude"]) {
  const root = fixture.createSourceFixture();
  try {
    const repo = join(root, "target");
    const outcome = await new SourceChangeHost(
      fixture.sourceFixtureOptions(root, () => 10, "commit-blocked", transport),
    ).run();
    const tree = worktreeOf(root);
    const admin = join(
      repo,
      ".git/worktrees",
      readFileSync(join(tree, ".git"), "utf8").trim().split("/").at(-1),
    );
    const listed = () =>
      git(repo, ["worktree", "list", "--porcelain"]).stdout.includes(
        `worktree ${tree}\n`,
      );
    const listedWhileRetained = listed();
    const remove = git(repo, ["worktree", "remove", "--force", tree]);
    const prune = git(repo, ["worktree", "prune", "--expire", "now"]);
    const adminSurvivesPrune = existsSync(join(admin, "locked"));
    const repair = git(repo, ["worktree", "repair", tree]);
    const afterRepair = reachability(repo);
    const unlock = git(repo, ["worktree", "unlock", tree]);
    const removeAfterRepair = git(repo, [
      "worktree",
      "remove",
      "--force",
      tree,
    ]);
    report({
      case: "retained-worktree-ordinary-git",
      transport,
      outcome: outcome.status,
      observed: {
        listedWhileRetained,
        removeForce: remove.status,
        removeForceMessage: firstLine(remove.stderr).replace(root, "<scratch>"),
        pruneExit: prune.status,
        adminSurvivesPrune,
        repairExit: repair.status,
        reachabilityAfterRepair: afterRepair,
        unlockExit: unlock.status,
        removeForceAfterRepair: removeAfterRepair.status,
        reachabilityAfterRemoval: reachability(repo),
      },
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// D: the registration backlink is already absent when the writer settles
// (left by the writer's gitdir access). Observes what run() and a rerun
// return once retention cannot read it.
for (const transport of ["codex", "claude"]) {
  const root = fixture.createSourceFixture();
  try {
    const repo = join(root, "target");
    const settle = async (options) => {
      try {
        const outcome = await new SourceChangeHost(options).run();
        return `${outcome.status}:${outcome.refusal?.reason ?? ""}`;
      } catch (error) {
        return `threw:${firstLine(error?.message).replace(root, "<scratch>")}`;
      }
    };
    const options = fixture.sourceFixtureOptions(
      root,
      () => 10,
      "commit-blocked",
      transport,
    );
    const first = await settle({
      ...options,
      afterResult() {
        const tree = worktreeOf(root);
        const gitdir = readFileSync(join(tree, ".git"), "utf8")
          .trim()
          .slice("gitdir: ".length);
        rmSync(join(gitdir, "gitdir"));
      },
    });
    const rerun = await settle(
      fixture.sourceFixtureOptions(
        root,
        () => 100,
        "commit-blocked",
        transport,
      ),
    );
    report({
      case: "absent-backlink-at-settlement",
      transport,
      observed: {
        first,
        rerun,
        refusalRecorded:
          events(root).findLast((row) => row.type === "SourceChangeRefused")
            ?.payload.reason ?? null,
        launches: launches(root),
        reachability: reachability(repo),
      },
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// C: a tracked file whose parent directory became a symlink to an identical
// copy outside the worktree refuses; a clean tracked symlink in a
// subdirectory is observed.
for (const transport of ["codex", "claude"])
  for (const variant of ["symlinked-parent", "clean-nested-symlink"]) {
    const root = fixture.createSourceFixture();
    try {
      const repo = join(root, "target");
      mkdirSync(join(repo, "dir"));
      writeFileSync(join(repo, "dir/a.txt"), "nested\n");
      symlinkSync("../fixture.txt", join(repo, "dir/link.txt"));
      fixture.fixtureGit(repo, "add", "-A");
      fixture.fixtureGit(
        repo,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-m",
        "Track a nested file and symlink",
      );
      writeFileSync(
        join(root, "base.txt"),
        fixture.fixtureGit(repo, "rev-parse", "HEAD"),
      );
      const host = new SourceChangeHost({
        ...fixture.sourceFixtureOptions(root, () => 10, "commit", transport),
        afterResult() {
          if (variant !== "symlinked-parent") return;
          const dir = join(host.tree.path, "dir");
          const copy = join(root, "outside-copy");
          cpSync(dir, copy, { recursive: true, verbatimSymlinks: true });
          rmSync(dir, { recursive: true });
          symlinkSync(copy, dir);
        },
      });
      let status, reason;
      try {
        status = (await host.run()).status;
      } catch (error) {
        status = "threw";
      }
      reason =
        events(root).findLast((row) => row.type === "SourceChangeRefused")
          ?.payload.reason ?? null;
      report({
        case: "entry-path",
        transport,
        variant,
        status,
        reason,
        passed:
          variant === "symlinked-parent"
            ? status !== "observed" &&
              /^committed-tree-drift:dir\//u.test(reason ?? "")
            : status === "observed",
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

process.exitCode = failed ? 1 : 0;
