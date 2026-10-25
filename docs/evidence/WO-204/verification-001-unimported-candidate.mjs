// After an episode leaves its candidate
// unimported (an admission refusal or the writer-requested-attention hold),
// ordinary Git in the shared repository and in the preserved worktree must
// work as at the base, and a held candidate must stay out of the shared
// store. Exits 1 while any expectation fails. Synthetic repositories under
// the system temporary directory only.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../../../packages/skeleton/dist/", import.meta.url);
const fixture = await import(
  new URL("test/source-change-fixture.js", dist).href
);
const { SourceChangeHost } = await import(
  new URL("src/source-change-host.js", dist).href
);

const plainEnv = { ...process.env };
delete plainEnv.GIT_OBJECT_DIRECTORY;
delete plainEnv.GIT_ALTERNATE_OBJECT_DIRECTORIES;
const git = (cwd, args, env = plainEnv) =>
  spawnSync("git", ["-c", "maintenance.auto=false", ...args], {
    cwd,
    env,
    encoding: "utf8",
  });

async function run(behavior) {
  const root = fixture.createSourceFixture();
  try {
    const repo = join(root, "target");
    let now = 1_000;
    const host = new SourceChangeHost(
      fixture.sourceFixtureOptions(root, () => (now += 10), behavior, "codex"),
    );
    let outcome;
    try {
      outcome = await host.run();
    } catch (error) {
      outcome = { status: "threw", refusal: { reason: error?.message } };
    }
    const tree = readdirSync(join(root, "trees")).find((name) =>
      name.startsWith("cmd_"),
    );
    const worktree = join(root, "trees", tree);
    // The base fixture has no private store, so the same probe runs there.
    const candidate = git(worktree, ["rev-parse", "HEAD"], {
      ...plainEnv,
      ...(fixture.fixtureObjectEnvironment?.(worktree) ?? {}),
    }).stdout.trim();
    const checks = {
      "shared: git log --all": git(repo, ["log", "--all", "--oneline"]),
      "shared: git rev-list --all": git(repo, ["rev-list", "--all", "--count"]),
      "shared: git fsck": git(repo, ["fsck"]),
      "shared: git repack -ad": git(repo, ["repack", "-ad"]),
      "shared: git gc --prune=now": git(repo, ["gc", "--prune=now"]),
    };
    // Retention may provide a durable inspection command instead of making
    // private objects visible to an ordinary shared-store Git reader.
    const inspection = JSON.parse(
      "[" +
        readFileSync(join(root, "store/events.jsonl"), "utf8")
          .trim()
          .split("\n")
          .join(",") +
        "]",
    ).find((event) => event.type === "SourceChangeCandidateRetained")?.payload
      .inspectionCommand;
    checks[
      inspection ? "worktree: recorded inspection" : "worktree: git log -1"
    ] = inspection
      ? spawnSync("/bin/sh", ["-c", inspection], {
          env: plainEnv,
          encoding: "utf8",
        })
      : git(worktree, ["log", "-1", "--oneline"]);
    const exits = Object.fromEntries(
      Object.entries(checks).map(([name, result]) => [name, result.status]),
    );
    const sharedHasCandidate =
      git(repo, ["cat-file", "-e", `${candidate}^{commit}`]).status === 0;
    const passed =
      Object.values(exits).every((code) => code === 0) &&
      (behavior !== "commit-blocked" || !sharedHasCandidate);
    return {
      behavior,
      status: outcome.status,
      reason: String(outcome.refusal?.reason ?? "")
        .replaceAll(root, "<scratch>")
        .slice(0, 120),
      exits,
      sharedHasCandidate,
      passed,
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

let failed = false;
for (const behavior of ["commit-wide", "commit-blocked"]) {
  const result = await run(behavior);
  failed ||= !result.passed;
  console.log(JSON.stringify(result));
}
process.exitCode = failed ? 1 : 0;
