import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  cpSync,
  chmodSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { delimiter, dirname, join } from "node:path";
import { tmpdir } from "node:os";
import {
  completeCoverage,
  loadSuiteSuccess,
  observeSuiteInputs,
  reusableResult,
  saveSuiteSuccess,
  suiteEnvironment,
  suiteInputHash,
  suiteInputIdentity,
  suiteDeclaration,
  suiteCacheDirectory,
  explainSuiteFresh,
  formatSuiteFresh,
} from "./lib/suite-evidence.mjs";
import {
  runGate,
  executeSuite,
  suites,
  expandSuiteTasks,
} from "./test-runner.mjs";

const write = (root, path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), value);
};
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "dotln-suite-inputs-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, stdio: "pipe" });
  git("init", "-q");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  write(root, ".gitignore", "node_modules/\n**/dist/\ndocs/control/local/\n");
  for (const path of [
    "src/main.js",
    "test/main.test.js",
    "scripts/lib/helper.mjs",
    "tsconfig.json",
    "package-lock.json",
    "docs/product/02-domain-model.md",
    "docs/product/05-supports.md",
    "node_modules/example/index.js",
    "packages/kernel/dist/src/index.js",
  ])
    write(root, path, "initial\n");
  git("add", ".");
  git("commit", "-qm", "Fixture");
  return { root, git };
}
const row = {
  name: "kernel",
  command: [process.execPath, "--test", "packages/kernel/dist/test/*.test.js"],
};
const source = {
  treeHash: "a".repeat(40),
  recordedAt: "2030-01-01T00:00:00Z",
  evidenceRef: "host-suite:fixture:kernel",
  durationMs: 1234,
  executed: true,
  exitCode: 0,
};

test("WO-129 every inventoried task declares Git state and unknown callers cannot grant themselves reuse", () => {
  const tasks = expandSuiteTasks(
    suites,
    new URL("../", import.meta.url).pathname,
    "/synthetic-template",
  );
  for (const task of tasks) {
    assert.ok(suiteDeclaration(task), task.name);
    assert.deepEqual(task.git, suiteDeclaration(task).git, task.name);
  }
  assert.equal(suiteDeclaration({ name: "release:case:unknown" }), null);
  assert.equal(
    suiteInputHash(
      { name: "unknown", reuse: "tree", command: ["node"] },
      { reusable: true },
    ),
    null,
  );
});

test("WO-129 Git changes invalidate only declared state; unrelated config and execution facts do not", (t) => {
  const { root, git } = fixture(t);
  const rows = [
    row,
    { name: "compiler", command: ["node"] },
    { name: "index", command: ["node"] },
    { name: "plan-refutation:current", command: ["node"] },
    { name: "authority-evidence", command: ["node"] },
  ];
  const keys = () => {
    const snapshot = observeSuiteInputs(root);
    return rows.map((item) => suiteInputHash(item, snapshot));
  };
  const before = keys();
  git("update-ref", "refs/dotln/checkpoint/WO-999/1", "HEAD");
  git("branch", "another-branch");
  git("config", "user.name", "Another fixture author");
  assert.deepEqual(keys(), before);
  git("commit", "--allow-empty", "-qm", "Identical bytes");
  const committed = keys();
  for (const index of [0, 1, 4]) assert.equal(committed[index], before[index]);
  for (const index of [2, 3]) assert.notEqual(committed[index], before[index]);
  git("tag", "declared-tag");
  const tagged = keys();
  assert.notEqual(tagged[2], committed[2]);
  for (const index of [0, 1, 3, 4])
    assert.equal(tagged[index], committed[index]);
  const assertHistoricalTagChange = (prior) => {
    const current = keys();
    for (const index of [0, 1, 3]) assert.equal(current[index], prior[index]);
    for (const index of [2, 4]) assert.notEqual(current[index], prior[index]);
    return current;
  };
  git("tag", "v0.16.0", "HEAD~1");
  const historical = assertHistoricalTagChange(tagged);
  git("tag", "-f", "v0.16.0", "HEAD");
  const moved = assertHistoricalTagChange(historical);
  git("tag", "-d", "v0.16.0");
  assert.deepEqual(assertHistoricalTagChange(moved), tagged);
  write(root, "docs/control/orders/WO-999.jsonl", '{"event":"fixture"}\n');
  const event = keys();
  assert.deepEqual(event.slice(0, 2), tagged.slice(0, 2));
  for (const index of [2, 3, 4]) assert.notEqual(event[index], tagged[index]);
  const snapshot = observeSuiteInputs(root);
  assert.equal(
    suiteInputHash(row, {
      ...snapshot,
      executionFacts: {
        checkout: "different",
        cpus: 999,
        osRelease: "different",
      },
    }),
    suiteInputHash(row, snapshot),
  );
  assert.equal(suiteInputHash(row, { ...snapshot, reusable: false }), null);
  assert.equal(suiteInputHash({ ...row, reuse: "live" }, snapshot), null);
  const skeleton = { ...row, name: "skeleton" };
  const skeletonBefore = suiteInputHash(skeleton, snapshot);
  write(
    root,
    "docs/discovery/codex-effort-2026-09-11.json",
    "observed effort fixture changed\n",
  );
  assert.notEqual(
    suiteInputHash(skeleton, observeSuiteInputs(root)),
    skeletonBefore,
  );
  rmSync(join(root, "docs/discovery/codex-effort-2026-09-11.json"));
  for (const path of [
    "scripts/test-runner.mjs",
    "scripts/lib/suite-evidence.mjs",
    "scripts/lib/gate-evidence.mjs",
  ]) {
    write(root, path, "changed runner identity\n");
    const changed = keys();
    for (let index = 0; index < rows.length; index++)
      assert.notEqual(changed[index], event[index], path);
    rmSync(join(root, path));
  }
});

test("WO-129 sibling worktrees share sealed successes at identical installed and candidate inputs", (t) => {
  const { root, git } = fixture(t);
  const sibling = mkdtempSync(join(tmpdir(), "dotln-suite-sibling-"));
  t.after(() => rmSync(sibling, { recursive: true, force: true }));
  git("worktree", "add", "--detach", sibling, "HEAD");
  for (const path of ["node_modules", "packages"])
    cpSync(join(root, path), join(sibling, path), { recursive: true });
  const observe = (repo) =>
    observeSuiteInputs(repo, {
      env: {
        ...process.env,
        PATH: `${join(repo, "node_modules/.bin")}${delimiter}${process.env.PATH}`,
        npm_config_local_prefix: repo,
        NPM_CONFIG_LOCAL_PREFIX: repo,
      },
    });
  const first = suiteInputIdentity(row, observe(root));
  const second = suiteInputIdentity(row, observe(sibling));
  assert.deepEqual(second.digests, first.digests);
  assert.equal(second.inputHash, first.inputHash);
  assert.equal(suiteCacheDirectory(root), suiteCacheDirectory(sibling));
  assert.equal(
    saveSuiteSuccess(root, row, first.inputHash, source, first),
    true,
  );
  assert.deepEqual(
    loadSuiteSuccess(sibling, row.name, second.inputHash),
    source,
  );
  for (const name of ["npm_config_local_prefix", "NPM_CONFIG_LOCAL_PREFIX"]) {
    const local = { ...process.env, [name]: root };
    const external = { ...local, [name]: `${root}-external` };
    assert.equal(suiteEnvironment(local)[name], root);
    assert.notEqual(
      suiteInputHash(row, observeSuiteInputs(root, { env: external })),
      suiteInputHash(row, observeSuiteInputs(root, { env: local })),
      `${name} outside the checkout remains an input`,
    );
  }
  write(sibling, "src/main.js", "one differing byte\n");
  assert.equal(
    loadSuiteSuccess(sibling, row.name, suiteInputHash(row, observe(sibling))),
    null,
  );
});

test("WO-129 real npm gates reuse across sibling worktrees and execute changed inputs", (t) => {
  const { root, git } = fixture(t);
  const sibling = mkdtempSync(join(tmpdir(), "dotln-suite-npm-sibling-"));
  t.after(() => rmSync(sibling, { recursive: true, force: true }));
  write(
    root,
    "package.json",
    JSON.stringify({
      type: "module",
      scripts: {
        test: "node scripts/npm-gate.mjs",
        "test:full": "node scripts/npm-gate.mjs",
      },
    }),
  );
  write(
    root,
    "scripts/build.mjs",
    `import {mkdirSync, writeFileSync} from "node:fs";
mkdirSync("packages/kernel/dist/test", {recursive: true});
writeFileSync("packages/kernel/dist/test/fixture.test.js", ${JSON.stringify('import test from "node:test"; test("fixture", () => {});\n')});
`,
  );
  write(
    root,
    "scripts/npm-gate.mjs",
    `import assert from "node:assert/strict";
import {runGate} from ${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)};
import {suiteEnvironment} from ${JSON.stringify(new URL("./lib/suite-evidence.mjs", import.meta.url).href)};
assert.equal(suiteEnvironment().npm_config_local_prefix, process.cwd());
const result = await runGate(["--only", "kernel"], process.cwd());
console.log("NPM_GATE_RESULT " + JSON.stringify(result));
process.exitCode = result.exitCode;
`,
  );
  git("add", ".");
  git("commit", "-qm", "Npm gate fixture");
  git("worktree", "add", "--detach", sibling, "HEAD");
  for (const path of ["node_modules", "packages"])
    cpSync(join(root, path), join(sibling, path), { recursive: true });
  const run = (repo, args) => {
    const output = execFileSync("npm", args, {
      cwd: repo,
      env: suiteEnvironment(),
      encoding: "utf8",
    });
    const result = JSON.parse(/^NPM_GATE_RESULT (.+)$/m.exec(output)[1]);
    assert.equal(result.exitCode, 0);
    return result;
  };
  const first = run(root, ["test", "--silent"]);
  assert.equal(first.freshSuites, 2);
  assert.equal(first.reusedSuites, 0);
  const second = run(sibling, ["run", "test:full", "--silent"]);
  assert.equal(second.treeHash, first.treeHash);
  assert.equal(second.executionMode, "composed");
  assert.equal(second.freshSuites, 1);
  assert.equal(second.reusedSuites, 1);
  write(sibling, "src/main.js", "different input\n");
  const changed = run(sibling, ["test", "--silent"]);
  assert.notEqual(changed.treeHash, first.treeHash);
  assert.equal(changed.freshSuites, 2);
  assert.equal(changed.reusedSuites, 0);
});

test("WO-129 fresh explanations identify each changed input class and bound path lists", (t) => {
  const { root, git } = fixture(t);
  const bin = join(root, "docs/control/local/bin");
  write(root, "docs/control/local/bin/grep", "#!/bin/sh\nexit 0\n");
  chmodSync(join(bin, "grep"), 0o755);
  const env = { ...process.env, PATH: `${bin}${delimiter}${process.env.PATH}` };
  const task = { name: "index", command: ["node", "check"] };
  const observe = () => observeSuiteInputs(root, { env });
  const first = suiteInputIdentity(task, observe());
  assert.equal(explainSuiteFresh(root, task, first).reason, "no prior success");
  assert.equal(
    saveSuiteSuccess(root, task, first.inputHash, source, first),
    true,
  );
  const cases = [
    [
      "source",
      () => write(root, "src/main.js", "changed\n"),
      () => write(root, "src/main.js", "initial\n"),
    ],
    [
      "documents",
      () => write(root, "docs/product/05-supports.md", "changed\n"),
      () => write(root, "docs/product/05-supports.md", "initial\n"),
    ],
    [
      "git",
      () => git("tag", "changed-ref"),
      () => git("tag", "-d", "changed-ref"),
    ],
    [
      "environment",
      () => {
        env.DOTLN_CLASS_FIXTURE = "changed";
      },
      () => {
        delete env.DOTLN_CLASS_FIXTURE;
      },
    ],
    [
      "toolchain",
      () => write(root, "docs/control/local/bin/grep", "#!/bin/sh\nexit 1\n"),
      () => write(root, "docs/control/local/bin/grep", "#!/bin/sh\nexit 0\n"),
    ],
    [
      "runtime",
      () => write(root, "node_modules/example/index.js", "changed\n"),
      () => write(root, "node_modules/example/index.js", "initial\n"),
    ],
    [
      "declaration",
      () => task.command.push("--changed-command"),
      () => task.command.pop(),
    ],
  ];
  for (const [inputClass, change, restore] of cases) {
    change();
    const reason = explainSuiteFresh(
      root,
      task,
      suiteInputIdentity(task, observe()),
    );
    assert.deepEqual(
      reason.changes.map((change) => change.inputClass),
      [inputClass],
    );
    assert.ok(formatSuiteFresh(reason).includes(inputClass));
    restore();
  }
  for (let index = 0; index < 8; index++)
    write(root, `src/changed-${index}.js`, "changed\n");
  const changed = suiteInputIdentity(task, observe());
  const reason = explainSuiteFresh(root, task, changed);
  assert.equal(reason.changes[0].paths.length, 5);
  assert.equal(reason.changes[0].omittedPaths, 3);
  assert.match(formatSuiteFresh(reason), /\(\+3 more\)/);
  assert.equal(
    saveSuiteSuccess(
      root,
      task,
      changed.inputHash,
      { ...source, recordedAt: "2030-01-02T00:00:00Z" },
      changed,
    ),
    true,
  );
  assert.equal(
    explainSuiteFresh(root, task, changed).reason,
    "inputs unchanged",
  );
});

test("WO-129 hook, filter, attribute and exclude guards remain conservative", (t) => {
  const { root, git } = fixture(t);
  for (const name of [
    "core.hooksPath",
    "core.attributesFile",
    "core.excludesFile",
    "filter.fixture.clean",
  ]) {
    git("config", name, "fixture-adapter");
    assert.equal(suiteInputHash(row, observeSuiteInputs(root)), null, name);
    git("config", "--unset", name);
  }
  const before = suiteInputHash(row, observeSuiteInputs(root));
  write(root, ".git/info/attributes", "*.js text\n");
  assert.notEqual(suiteInputHash(row, observeSuiteInputs(root)), before);
});

test("gate children preserve executable precedence and future paths while removing repeated searches", (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-suite-path-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const first = join(root, "first");
  const second = join(root, "second");
  const future = join(root, "future");
  const executable = (directory, name, value) => {
    const path = join(directory, name);
    mkdirSync(directory, { recursive: true });
    writeFileSync(path, `#!/bin/sh\nprintf '${value}'\n`);
    chmodSync(path, 0o755);
  };
  executable(first, "dotln-path-probe", "first");
  executable(second, "dotln-path-probe", "second");
  executable(root, "dotln-current-probe", "current");
  executable(join(root, "relative"), "dotln-relative-probe", "relative");
  const original = [
    future,
    first,
    second,
    first,
    "",
    "relative",
    "",
    ".",
    second,
  ].join(delimiter);
  const inherited = {
    PATH: original,
    NODE_TEST_CONTEXT: "child",
    KEEP: "value",
  };
  const env = suiteEnvironment(inherited);
  const run = (name, childEnv = env) =>
    execFileSync(name, [], { cwd: root, env: childEnv, encoding: "utf8" });
  assert.equal(run("dotln-path-probe", inherited), "first");
  assert.equal(run("dotln-path-probe"), "first");
  renameSync(join(first, "dotln-path-probe"), join(first, "disabled"));
  assert.equal(run("dotln-path-probe"), "second");
  executable(future, "dotln-path-probe", "future");
  assert.equal(run("dotln-path-probe"), "future");
  assert.equal(run("dotln-current-probe"), "current");
  assert.equal(run("dotln-relative-probe"), "relative");
  assert.deepEqual(env.PATH.split(delimiter), [
    future,
    first,
    second,
    "",
    "relative",
    ".",
  ]);
  assert.equal(inherited.PATH, original);
  assert.equal(inherited.NODE_TEST_CONTEXT, "child");
  assert.equal(env.NODE_TEST_CONTEXT, undefined);
  assert.equal(env.KEEP, undefined);
  assert.equal(suiteEnvironment({}).PATH, undefined);
});

test("suite execution and fingerprints share a stable reviewed environment without proxy credentials", async (t) => {
  const { root } = fixture(t);
  const original = { ...process.env };
  const env = {
    ...original,
    HTTP_PROXY: "synthetic-first",
    CLOUDSDK_PROXY_USERNAME: "synthetic-first",
    DOTLN_CACHE_FIXTURE: "kept",
  };
  const before = observeSuiteInputs(root, { env });
  assert.ok(before.reusable);
  const hash = suiteInputHash(row, before);
  env.HTTP_PROXY = "synthetic-second";
  env.CLOUDSDK_PROXY_USERNAME = "synthetic-second";
  env.UNREVIEWED_FIXTURE_VARIABLE = "not-an-input";
  assert.equal(suiteInputHash(row, observeSuiteInputs(root, { env })), hash);
  assert.ok(before.environmentKeys.includes("DOTLN_CACHE_FIXTURE"));
  assert.ok(!before.environmentKeys.some((key) => /PROXY/.test(key)));
  assert.deepEqual(
    suiteEnvironment(suiteEnvironment(env)),
    suiteEnvironment(env),
  );
  for (const key of [
    "TZ",
    "LC_ALL",
    "npm_config_audit",
    "NODE_NO_WARNINGS",
    "DOTLN_CACHE_FIXTURE",
    "GIT_CONFIG_NOSYSTEM",
  ]) {
    assert.notEqual(
      suiteInputHash(
        row,
        observeSuiteInputs(root, { env: { ...env, [key]: "1" } }),
      ),
      hash,
      key,
    );
  }
  try {
    process.env.HTTP_PROXY = "synthetic-execution-proxy";
    process.env.UNREVIEWED_FIXTURE_VARIABLE = "synthetic-execution-extra";
    const result = await executeSuite(
      {
        name: "environment-observer",
        command: [
          process.execPath,
          "-e",
          "console.log(JSON.stringify({proxy:process.env.HTTP_PROXY??null,extra:process.env.UNREVIEWED_FIXTURE_VARIABLE??null,gate:process.env.DOTLN_GATE_CHILD}))",
        ],
      },
      root,
    );
    assert.equal(result.exitCode, 0);
    assert.deepEqual(JSON.parse(result.output), {
      proxy: null,
      extra: null,
      gate: "1",
    });
  } finally {
    for (const key of ["HTTP_PROXY", "UNREVIEWED_FIXTURE_VARIABLE"])
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
  }
});

test("reviewed inputs invalidate source, tests, helpers, config, dependencies, documents, paths and environment", (t) => {
  const { root, git } = fixture(t);
  const env = { ...process.env, DOTLN_CACHE_FIXTURE: "first" };
  const observe = () => observeSuiteInputs(root, { env });
  const before = observe();
  assert.equal(before.reusable, true);
  const baseline = suiteInputHash(row, before);
  assert.match(baseline, /^[a-f0-9]{64}$/);
  assert.equal(suiteInputHash({ ...row, name: "unknown-scope" }, before), null);
  for (const path of [
    "src/main.js",
    "test/main.test.js",
    "scripts/lib/helper.mjs",
    "tsconfig.json",
    "package-lock.json",
    "node_modules/example/index.js",
    "packages/kernel/dist/src/index.js",
    "docs/product/02-domain-model.md",
  ]) {
    write(root, path, "changed\n");
    assert.notEqual(suiteInputHash(row, observe()), baseline, path);
    write(root, path, "initial\n");
  }
  write(root, "docs/product/05-supports.md", "unrelated ideation\n");
  assert.equal(suiteInputHash(row, observe()), baseline);
  write(root, "test/new.test.js", "new case\n");
  assert.notEqual(suiteInputHash(row, observe()), baseline);
  rmSync(join(root, "test/new.test.js"));
  renameSync(join(root, "src/main.js"), join(root, "src/renamed.js"));
  assert.notEqual(suiteInputHash(row, observe()), baseline);
  rmSync(join(root, "src/renamed.js"));
  assert.notEqual(suiteInputHash(row, observe()), baseline);
  write(root, "src/main.js", "initial\n");
  env.DOTLN_CACHE_FIXTURE = "second";
  assert.notEqual(suiteInputHash(row, observe()), baseline);
  env.DOTLN_CACHE_FIXTURE = "first";
  git("config", "core.quotePath", "false");
  assert.notEqual(suiteInputHash(row, observe()), baseline);
  git("config", "--unset", "core.quotePath");
  write(root, ".git/info/exclude", "new-git-ignore\n");
  assert.notEqual(suiteInputHash(row, observe()), baseline);
  const beforeTag = suiteInputHash(row, observe());
  git("tag", "fixture-tag");
  assert.equal(suiteInputHash(row, observe()), beforeTag);
  assert.ok(
    before.meter.files > 0 &&
      before.meter.bytes > 0 &&
      before.meter.commands > 0 &&
      before.meter.durationMs > 0,
  );
});

test("host configuration content invalidates and unknown startup adapters force execution", (t) => {
  const { root } = fixture(t);
  const home = join(root, "docs/control/local/host");
  const env = {
    ...process.env,
    HOME: home,
    XDG_CONFIG_HOME: join(home, ".config"),
  };
  write(root, "docs/control/local/host/.config/git/ignore", "first\n");
  write(root, "docs/control/local/host/.npmrc", "audit=false\n");
  const baseline = suiteInputHash(row, observeSuiteInputs(root, { env }));
  assert.ok(baseline);
  write(root, "docs/control/local/host/.config/git/ignore", "second\n");
  assert.notEqual(
    suiteInputHash(row, observeSuiteInputs(root, { env })),
    baseline,
  );
  write(root, "docs/control/local/host/.config/git/ignore", "first\n");
  write(root, "docs/control/local/host/.npmrc", "audit=true\n");
  assert.notEqual(
    suiteInputHash(row, observeSuiteInputs(root, { env })),
    baseline,
  );
  assert.equal(
    suiteInputHash(
      row,
      observeSuiteInputs(root, {
        env: { ...env, NODE_OPTIONS: "--stack-trace-limit=10" },
      }),
    ),
    null,
  );
});

test("a resolved tool's bytes invalidate even when its PATH and name stay unchanged", (t) => {
  const { root } = fixture(t);
  const bin = join(root, "docs/control/local/bin");
  const executable = join(bin, "grep");
  write(root, "docs/control/local/bin/grep", "#!/bin/sh\nexit 0\n");
  chmodSync(executable, 0o755);
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}` };
  const before = suiteInputHash(row, observeSuiteInputs(root, { env }));
  assert.ok(before);
  writeFileSync(executable, "#!/bin/sh\nexit 1\n");
  assert.notEqual(
    suiteInputHash(row, observeSuiteInputs(root, { env })),
    before,
  );
});

test("missing, corrupt, failing and unexecuted cache rows never supply success; reuse retains provenance", (t) => {
  const { root } = fixture(t);
  const identity = suiteInputIdentity(row, observeSuiteInputs(root));
  const { inputHash } = identity;
  assert.equal(loadSuiteSuccess(root, row.name, inputHash), null);
  assert.equal(
    saveSuiteSuccess(
      root,
      row,
      inputHash,
      { ...source, exitCode: 1 },
      identity,
    ),
    false,
  );
  assert.equal(
    saveSuiteSuccess(
      root,
      row,
      inputHash,
      { ...source, executed: false },
      identity,
    ),
    false,
  );
  assert.equal(saveSuiteSuccess(root, row, inputHash, source, identity), true);
  const loaded = loadSuiteSuccess(root, row.name, inputHash);
  assert.deepEqual(loaded, source);
  const result = reusableResult(row, loaded, inputHash);
  assert.equal(result.executed, false);
  assert.equal(result.durationMs, 0);
  assert.equal(result.sourceExecution.durationMs, 1234);
  assert.equal(result.sourceExecution.treeHash, source.treeHash);
  assert.ok(completeCoverage([row], [result]));
  assert.equal(completeCoverage([row], []), false);
  assert.equal(completeCoverage([row], [result, result]), false);
  assert.equal(
    completeCoverage(
      [row],
      [{ ...result, sourceExecution: { executed: false, exitCode: 0 } }],
    ),
    false,
  );
  const cache = suiteCacheDirectory(root);
  const directory = join(cache, readdirSync(cache)[0]);
  const path = join(directory, readdirSync(directory)[0]);
  const bytes = readFileSync(path, "utf8");
  writeFileSync(path, bytes.replace('"durationMs":1234', '"durationMs":1'));
  assert.equal(loadSuiteSuccess(root, row.name, inputHash), null);
  writeFileSync(path, "{");
  assert.equal(loadSuiteSuccess(root, row.name, inputHash), null);
  writeFileSync(path, bytes.replace('"version":3', '"version":2'));
  assert.equal(loadSuiteSuccess(root, row.name, inputHash), null);
  const unsealed = JSON.parse(bytes);
  delete unsealed.seal;
  writeFileSync(path, JSON.stringify(unsealed));
  assert.equal(loadSuiteSuccess(root, row.name, inputHash), null);
});

test("unmodelled external and ignored directory links force fresh execution", (t) => {
  const { root } = fixture(t);
  const outside = mkdtempSync(join(tmpdir(), "dotln-external-input-"));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  symlinkSync(outside, join(root, "node_modules/external"));
  assert.equal(suiteInputHash(row, observeSuiteInputs(root)), null);
  rmSync(join(root, "node_modules/external"));
  mkdirSync(join(root, "ignored-library"));
  symlinkSync(
    join(root, "ignored-library"),
    join(root, "node_modules/unmodelled"),
  );
  assert.equal(suiteInputHash(row, observeSuiteInputs(root)), null);
});

test("runner composes unchanged inputs across doc trees, honors --fresh, and refuses mid-run changes", async (t) => {
  const { root } = fixture(t);
  const proxy = process.env.HTTP_PROXY;
  t.after(() => {
    if (proxy === undefined) delete process.env.HTTP_PROXY;
    else process.env.HTTP_PROXY = proxy;
  });
  const testSource =
    'import test from "node:test"; test("fixture", () => {});\n';
  const build =
    'import {mkdirSync,writeFileSync} from "node:fs"; mkdirSync("packages/kernel/dist/test",{recursive:true}); writeFileSync("packages/kernel/dist/test/fixture.test.js",' +
    JSON.stringify(testSource) +
    ");\n";
  write(root, "scripts/build.mjs", build);
  write(root, "package.json", '{"type":"module"}\n');
  const args = ["--only", "kernel"];
  const first = await runGate(args, root);
  assert.equal(first.exitCode, 0);
  assert.equal(first.reusedSuites, 0);
  process.env.HTTP_PROXY = "synthetic-rotated-between-invocations";
  write(root, "docs/product/05-supports.md", "new idea\n");
  const second = await runGate(args, root);
  assert.equal(second.exitCode, 0);
  assert.equal(second.reusedSuites, 1);
  assert.ok(!second.inputEnvironmentKeys.includes("HTTP_PROXY"));
  assert.notEqual(second.treeHash, first.treeHash);
  const fresh = await runGate([...args, "--fresh"], root);
  assert.equal(fresh.exitCode, 0);
  assert.equal(fresh.reusedSuites, 0);
  assert.equal(fresh.executionMode, "forced-fresh");
  const changing =
    'import {writeFileSync} from "node:fs"; writeFileSync("src/main.js", "changed while executing");\n' +
    testSource;
  write(
    root,
    "scripts/build.mjs",
    build.replace(JSON.stringify(testSource), JSON.stringify(changing)),
  );
  const refused = await runGate(args, root);
  assert.equal(refused.exitCode, 1);
  assert.equal(refused.reusedSuites, 0);
});

test("an unchanged gate retry retains passing source checks and reruns the failure and live guard", async (t) => {
  const { root } = fixture(t);
  write(
    root,
    "package.json",
    JSON.stringify({
      type: "module",
      scripts: { "format:check": "node checks.mjs format" },
    }),
  );
  const check = `import {existsSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {basename} from "node:path";
const name=process.argv[2]==="format"?"format":basename(process.argv[1]);
const path="docs/control/local/counts.json";
mkdirSync("docs/control/local",{recursive:true});
const counts=existsSync(path)?JSON.parse(readFileSync(path,"utf8")):{};
counts[name]=(counts[name]??0)+1;
writeFileSync(path,JSON.stringify(counts));
if(name==="refute-plan.mjs"&&counts[name]===1)process.exitCode=1;
`;
  for (const path of [
    "checks.mjs",
    "scripts/check-publication.mjs",
    "scripts/work-orders.mjs",
    "scripts/refute-plan.mjs",
  ])
    write(root, path, check);
  const counts = () =>
    JSON.parse(
      readFileSync(join(root, "docs/control/local/counts.json"), "utf8"),
    );
  const args = ["--document", "--serial"];
  const first = await runGate(args, root);
  assert.equal(first.exitCode, 1);
  const second = await runGate(args, root);
  assert.equal(second.exitCode, 0);
  assert.equal(second.treeHash, first.treeHash);
  assert.equal(second.reusedSuites, 2);
  assert.deepEqual(counts(), {
    format: 1,
    "check-publication.mjs": 2,
    "work-orders.mjs": 1,
    "refute-plan.mjs": 2,
  });
  const third = await runGate(args, root);
  assert.equal(third.exitCode, 0);
  assert.equal(third.reusedSuites, 3);
  write(root, "docs/product/05-supports.md", "changed document input\n");
  const changed = await runGate(args, root);
  assert.equal(changed.exitCode, 0);
  assert.equal(changed.reusedSuites, 0);
  assert.deepEqual(counts(), {
    format: 2,
    "check-publication.mjs": 4,
    "work-orders.mjs": 2,
    "refute-plan.mjs": 3,
  });
});
