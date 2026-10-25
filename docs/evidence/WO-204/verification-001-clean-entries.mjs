// WO-204 VER-001 F1 reproduction. A clean candidate in a target whose
// baseline tracks an unrelated symlink or gitlink must still be observed, as
// it is at the base. Exits 1 while the committed-tree check refuses either.
// Synthetic repositories under the system temporary directory only.
import { rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../../../packages/skeleton/dist/", import.meta.url);
const fixture = await import(
  new URL("test/source-change-fixture.js", dist).href
);
const { SourceChangeHost } = await import(
  new URL("src/source-change-host.js", dist).href
);

async function run(kind, transport) {
  const root = fixture.createSourceFixture();
  try {
    const repo = join(root, "target");
    if (kind === "symlink") {
      symlinkSync("fixture.txt", join(repo, "link.txt"));
      fixture.fixtureGit(repo, "add", "link.txt");
    }
    if (kind === "gitlink")
      fixture.fixtureGit(
        repo,
        "update-index",
        "--add",
        "--cacheinfo",
        `160000,${fixture.fixtureGit(repo, "rev-parse", "HEAD")},vendor/sub`,
      );
    fixture.fixtureGit(
      repo,
      "-c",
      "maintenance.auto=false",
      "commit",
      "--allow-empty",
      "-m",
      `Baseline tracking a ${kind}`,
    );
    writeFileSync(
      join(root, "base.txt"),
      fixture.fixtureGit(repo, "rev-parse", "HEAD"),
    );
    let now = 1_000;
    const host = new SourceChangeHost(
      fixture.sourceFixtureOptions(
        root,
        () => (now += 10),
        "commit",
        transport,
      ),
    );
    try {
      const outcome = await host.run();
      return {
        status: outcome.status,
        reason: outcome.refusal?.reason ?? null,
      };
    } catch (error) {
      return {
        status: "threw",
        reason: String(error?.message ?? error)
          .replaceAll(root, "<scratch>")
          .slice(0, 200),
      };
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

let failed = false;
for (const transport of ["codex", "claude"])
  for (const kind of ["none", "symlink", "gitlink"]) {
    const result = await run(kind, transport);
    const passed = result.status === "observed";
    failed ||= !passed;
    console.log(JSON.stringify({ transport, kind, ...result, passed }));
  }
process.exitCode = failed ? 1 : 0;
