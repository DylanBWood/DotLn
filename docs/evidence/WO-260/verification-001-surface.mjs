import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const { createFixtureRoot, removeTemporaryPath } = await import(
  pathToFileURL(join(root, "scripts/lib/temporary-roots.mjs"))
);
const { isolatedGitEnvironment } = await import(
  pathToFileURL(join(root, "scripts/lib/git.mjs"))
);
const fixture = createFixtureRoot(join(tmpdir(), "dotln-ver260-surface-"));
const env = {
  ...process.env,
  ...isolatedGitEnvironment(fixture),
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const run = (bin, args, extra = {}) =>
  spawnSync(bin, args, { cwd: fixture, env, encoding: "utf8", ...extra });
try {
  for (const args of [["init", "-q", "-b", "main"]])
    assert.equal(run("git", args).status, 0);
  mkdirSync(join(fixture, "scripts/lib"), { recursive: true });
  writeFileSync(
    join(fixture, "package.json"),
    JSON.stringify({ engines: { git: ">=2.31.0" } }),
  );
  writeFileSync(
    join(fixture, "scripts/lib/git-surface.json"),
    JSON.stringify({
      floor: ">=2.31.0",
      confirmation: "Fixture",
      scoped: {},
      forms: ["ls-tree"],
    }),
  );
  writeFileSync(join(fixture, "space # name"), "fixture\n");
  assert.equal(run("git", ["add", "space # name"]).status, 0);
  assert.equal(
    run("git", [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "Fixture",
    ]).status,
    0,
  );
  const check = () =>
    run(
      process.execPath,
      [join(root, "scripts/structural-checks.mjs"), "git-surface"],
      { env: { ...env, DOTLN_LAUNCHPAD: fixture } },
    );
  writeFileSync(
    join(fixture, "scripts/tool.sh"),
    "#!/bin/sh\ngit ls-tree HEAD 'space # name'\n",
  );
  const baseline = check();
  assert.equal(baseline.status, 0, baseline.stdout + baseline.stderr);
  writeFileSync(
    join(fixture, "scripts/tool.sh"),
    "#!/bin/sh\ngit ls-tree HEAD 'space # name' --format='%(path)'\n",
  );
  const shell = run("sh", ["scripts/tool.sh"]);
  assert.equal(shell.status, 0, shell.stderr);
  assert.equal(shell.stdout, "space # name\n");
  const atFloor = run("sh", ["scripts/tool.sh"], {
    env: {
      ...env,
      PATH: `${join(root, "scripts/fixtures/git-below-floor")}:${env.PATH}`,
    },
  });
  assert.equal(atFloor.status, 129);
  const observed = check();
  writeFileSync(
    join(fixture, "scripts/tool.sh"),
    "#!/bin/sh\ngit ls-tree HEAD 'space name' --format='%(path)'\n",
  );
  const withoutHash = check();
  assert.equal(withoutHash.status, 1);
  assert.ok(
    withoutHash.stdout.includes("ls-tree --format (scripts/tool.sh:2)"),
  );
  console.log(
    JSON.stringify(
      {
        baselineExit: baseline.status,
        withoutHashExit: withoutHash.status,
        shimExit: atFloor.status,
        script: "git ls-tree HEAD 'space # name' --format='%(path)'",
        hostGitExit: shell.status,
        hostGitOutput: shell.stdout,
        expectedExit: 1,
        expectedDiagnostic: "ls-tree --format (scripts/tool.sh:2)",
        actualExit: observed.status,
        actualOutput: observed.stdout + observed.stderr,
      },
      null,
      2,
    ),
  );
  assert.equal(
    observed.status,
    1,
    "criterion 4: an added literal ls-tree --format must be refused",
  );
} finally {
  removeTemporaryPath(fixture, { recursive: true, force: true });
}
