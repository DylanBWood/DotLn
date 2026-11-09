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
const { checkGitSurface } = await mod("scripts/lib/git-surface.mjs");
const root = createFixtureRoot(join(tmpdir(), "dotln-ver260-002-"));
const tree = join(root, "tree");
const put = (p, value, mode) => {
  mkdirSync(join(tree, p, ".."), { recursive: true });
  writeFileSync(join(tree, p), value, mode ? { mode } : undefined);
};
const environment = { ...process.env, ...isolatedGitEnvironment(root) };
const run = (bin, args, env = environment) =>
  spawnSync(bin, args, { cwd: tree, env, encoding: "utf8" });
const results = [];
try {
  mkdirSync(tree);
  assert.equal(run("git", ["init", "-q"]).status, 0);
  put("package.json", JSON.stringify({ engines: { git: ">=2.31.0" } }));
  const record = {
    floor: ">=2.31.0",
    forms: ["git -c", "ls-tree"],
    scoped: {},
  };
  put("scripts/lib/git-surface.json", JSON.stringify(record));
  mkdirSync(join(root, "bin"));
  writeFileSync(
    join(root, "bin/git"),
    '#!/bin/sh\nfor arg; do printf "%s\\n" "$arg"; done\n',
    { mode: 0o755 },
  );
  const option = "--format='%(path)'";
  const words = [
    "'alpha # beta'",
    '"alpha # beta"',
    "a' # b'c",
    "a\\ #b",
    "\\#b",
    "x#y",
    "'a;b|c&d(e)<f>g`h'",
    "a\\;b\\|c\\&d\\(e\\)\\<f\\>g",
    "'a'\\ #b",
    "'a'\\#b",
    "''#b",
    '""#b',
    "'a\\b # c'",
    '"a\\\\b # c"',
  ];
  const cases = [];
  for (const word of words) {
    cases.push({
      name: `word ${word}`,
      body: `git ls-tree HEAD ${word} ${option}`,
      passed: true,
    });
    cases.push({
      name: `continuation ${word}`,
      body: `git ls-tree HEAD ${word} \\\n  ${option}`,
      passed: true,
    });
    cases.push({
      name: `real comment ${word}`,
      body: `git ls-tree HEAD ${word} # ${option}`,
      passed: false,
    });
  }
  cases.push(
    {
      name: "empty comment before next command",
      body: `# ignored\ngit ls-tree HEAD ${option}`,
      passed: true,
      line: 3,
    },
    {
      name: "comment following separator",
      body: `git ls-tree HEAD; # ${option}`,
      passed: false,
    },
    {
      name: "tab before comment",
      body: `git ls-tree HEAD\t# ${option}`,
      passed: false,
    },
    {
      name: "continued hash word",
      body: `git ls-tree HEAD\\\n#name ${option}`,
      passed: true,
    },
    {
      name: "continued real comment",
      body: `git ls-tree HEAD \\\n# ${option}`,
      passed: false,
    },
    {
      name: "quoted global value",
      body: `git -c core.pager='x # y' ls-tree HEAD ${option}`,
      passed: true,
    },
    {
      name: "double quoted global value",
      body: `git -c core.pager="x # y" ls-tree HEAD ${option}`,
      passed: true,
    },
    {
      name: "earlier apostrophe",
      body: `note="one's"; git ls-tree HEAD ${option}`,
      passed: true,
    },
    {
      name: "earlier quoted double quote",
      body: `note='"one"'; git ls-tree HEAD ${option}`,
      passed: true,
    },
    {
      name: "ansi escaped quote",
      body: `git ls-tree HEAD $'one\\\'s # two' ${option}`,
      passed: true,
      shell: "bash",
    },
    {
      name: "ansi double escape",
      body: `git ls-tree HEAD $'a\\\\b # c' ${option}`,
      passed: true,
      shell: "bash",
    },
  );
  for (const c of cases) {
    const source = `#!/bin/${c.shell ?? "sh"}\n${c.body}\n`;
    put("scripts/tool.sh", source);
    put("scripts/tool.mjs", "export {};\n");
    const shell = run(c.shell ?? "sh", ["scripts/tool.sh"], {
      ...environment,
      PATH: `${join(root, "bin")}:${environment.PATH}`,
    });
    assert.equal(shell.status, 0, `${c.name}: ${shell.stderr}`);
    assert.equal(
      shell.stdout.split("\n").includes("--format=%(path)"),
      c.passed,
      `${c.name}: shell oracle`,
    );
    for (const form of ["file", "string"]) {
      const file = form === "file" ? "scripts/tool.sh" : "scripts/tool.mjs";
      if (form === "string") {
        put("scripts/tool.sh", "#!/bin/sh\n");
        put("scripts/tool.mjs", `const script = ${JSON.stringify(source)};\n`);
      }
      const actual = checkGitSurface(tree);
      const expectedLine = form === "file" ? (c.line ?? 2) : 1;
      assert.equal(
        actual.exitCode,
        c.passed ? 1 : 0,
        `${c.name}/${form}: ${actual.output}`,
      );
      assert.equal(
        actual.output.includes(`ls-tree --format (${file}:${expectedLine})`),
        c.passed,
        `${c.name}/${form}: location ${actual.output}`,
      );
      results.push({
        name: c.name,
        form,
        optionPassed: c.passed,
        checkExit: actual.exitCode,
        sourceLine: expectedLine,
      });
    }
  }
  put("scripts/tool.sh", "#!/bin/sh\ngit ls-tree HEAD\n");
  put("scripts/tool.mjs", "export {};\n");
  put(
    "scripts/lib/git-surface.json",
    JSON.stringify({ ...record, floor: ">=2.40.0" }),
  );
  const mismatch = checkGitSurface(tree);
  assert.equal(mismatch.exitCode, 1);
  assert.ok(
    mismatch.output.includes(">=2.40.0") &&
      mismatch.output.includes(">=2.31.0"),
  );
  console.log(
    JSON.stringify(
      {
        cases: cases.length,
        readings: results.length,
        failures: 0,
        floorMismatch: mismatch,
        results,
      },
      null,
      2,
    ),
  );
} finally {
  removeTemporaryPath(root, { recursive: true, force: true });
}
