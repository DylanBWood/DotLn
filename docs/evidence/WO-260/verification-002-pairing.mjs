import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const repo = process.cwd();
const mod = (p) => import(pathToFileURL(join(repo, p)));
const { createFixtureRoot, removeTemporaryPath } = await mod(
  "scripts/lib/temporary-roots.mjs",
);
const { isolatedGitEnvironment } = await mod("scripts/lib/git.mjs");
const root = createFixtureRoot(join(tmpdir(), "dotln-ver260-pairing-"));
const env = {
  ...process.env,
  ...isolatedGitEnvironment(root),
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const run = (bin, args, extra = {}) =>
  spawnSync(bin, args, { cwd: root, env, encoding: "utf8", ...extra });
const check = () =>
  run(
    process.execPath,
    [join(repo, "scripts/structural-checks.mjs"), "git-surface"],
    { env: { ...env, DOTLN_LAUNCHPAD: root } },
  );
try {
  assert.equal(run("git", ["init", "-q", "-b", "main"]).status, 0);
  mkdirSync(join(root, "scripts/lib"), { recursive: true });
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({ engines: { git: ">=2.31.0" } }),
  );
  writeFileSync(
    join(root, "scripts/lib/git-surface.json"),
    JSON.stringify({ floor: ">=2.31.0", forms: ["ls-tree"], scoped: {} }),
  );
  writeFileSync(join(root, "fixture.txt"), "fixture\n");
  assert.equal(run("git", ["add", "fixture.txt"]).status, 0);
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
  const baseline = run(
    "git",
    [
      "show",
      "--format=",
      "refs/dotln/checkpoint/WO-260/5:scripts/lib/git-surface.mjs",
    ],
    { cwd: repo },
  );
  assert.equal(baseline.status, 0);
  let source = baseline.stdout;
  for (const name of ["git.mjs", "machinery-coverage.mjs", "node-engines.mjs"])
    source = source.replace(
      `"./${name}"`,
      JSON.stringify(pathToFileURL(join(repo, "scripts/lib", name)).href),
    );
  const priorFile = join(root, "prior-reader.mjs");
  writeFileSync(priorFile, source);
  const { checkGitSurface: priorCheck } = await import(
    pathToFileURL(priorFile)
  );
  const cases = [
    {
      name: "baseline without newer option",
      line: `msg="it's"; git ls-tree HEAD; note="dogs' toys"`,
      expected: 0,
    },
    {
      name: "plain newer option",
      line: "git ls-tree HEAD --format=plain",
      expected: 1,
    },
    {
      name: "one quoted assignment",
      line: `msg="it's"; git ls-tree HEAD --format=plain`,
      expected: 1,
    },
    {
      name: "two quoted assignments",
      line: `msg="it's"; git ls-tree HEAD --format=plain; note="dogs' toys"`,
      expected: 1,
    },
    {
      name: "blank before separator",
      line: `msg="it's" ; git ls-tree HEAD --format=plain; note="dogs' toys"`,
      expected: 1,
    },
    {
      name: "quoted option value control",
      line: `msg="it's"; git ls-tree HEAD --format='plain'; note="dogs' toys"`,
      expected: 1,
    },
  ];
  const results = [];
  for (const c of cases) {
    const text = `#!/bin/sh\nset -e\n${c.line}\n`;
    writeFileSync(join(root, "scripts/tool.sh"), text);
    writeFileSync(join(root, "scripts/tool.mjs"), "export {};\n");
    const host = run("sh", ["scripts/tool.sh"]);
    assert.equal(host.status, 0, host.stderr);
    const floor = run("sh", ["scripts/tool.sh"], {
      env: {
        ...env,
        PATH: `${join(repo, "scripts/fixtures/git-below-floor")}:${env.PATH}`,
      },
    });
    assert.equal(floor.status, c.expected === 0 ? 0 : 129, floor.stderr);
    for (const carrier of ["shell-file", "embedded-script"]) {
      const file =
        carrier === "shell-file" ? "scripts/tool.sh" : "scripts/tool.mjs";
      const line = carrier === "shell-file" ? 3 : 1;
      if (carrier === "embedded-script") {
        writeFileSync(join(root, "scripts/tool.sh"), "#!/bin/sh\n");
        writeFileSync(
          join(root, "scripts/tool.mjs"),
          `const text = ${JSON.stringify(text)};\n`,
        );
      }
      const current = check(),
        prior = priorCheck(root);
      assert.equal(
        prior.exitCode,
        c.expected,
        `${c.name}: prior ${prior.output}`,
      );
      if (c.name !== "two quoted assignments")
        assert.equal(
          current.status,
          c.expected,
          `${c.name}: control ${current.stdout}${current.stderr}`,
        );
      results.push({
        name: c.name,
        carrier,
        script: c.line,
        hostGitExit: host.status,
        hostGitOutput: host.stdout,
        shimExit: floor.status,
        priorExit: prior.exitCode,
        expectedCheckExit: c.expected,
        actualCheckExit: current.status,
        expectedDiagnostic: `ls-tree --format (${file}:${line})`,
        actualOutput: current.stdout + current.stderr,
      });
    }
  }
  console.log(
    JSON.stringify(
      { baseline: "refs/dotln/checkpoint/WO-260/5", results },
      null,
      2,
    ),
  );
  const failed = results.filter(
    (r) => r.actualCheckExit !== r.expectedCheckExit,
  );
  assert.equal(
    failed.length,
    0,
    "criterion 4: later literal options must remain visible between separate quoted assignments",
  );
} finally {
  removeTemporaryPath(root, { recursive: true, force: true });
}
