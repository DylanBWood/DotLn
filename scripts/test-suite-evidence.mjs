import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  cpSync,
  chmodSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { delimiter, dirname, isAbsolute, join, relative } from "node:path";
import { tmpdir } from "node:os";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
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
  pruneSuiteSuccesses,
  retainedSuccessesPerSuite,
} from "./lib/suite-evidence.mjs";
import {
  runGate as runActualGate,
  executeSuite,
  suites,
  expandSuiteTasks,
} from "./test-runner.mjs";
import {
  createReplicaContext,
  replicaPlan,
  replicaEntries,
  replicaMechanismVersion,
} from "./lib/suite-replica.mjs";
import { readGateChecks } from "./lib/gate-evidence.mjs";

// These are synthetic cache/scheduling fixtures. The real kernel adapter is
// covered separately by test-suite-sandbox, including an outside-sandbox run.
const fixtureKernelProbe = () => ({
  available: true,
  reason: "synthetic protection adapter",
  command: [],
});
const runGate = (args, root) =>
  runActualGate(args, root, { kernelProbe: fixtureKernelProbe });

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
  write(
    root,
    ".gitignore",
    "node_modules/\n.runtime/\n**/dist/\ndocs/control/local/\n",
  );
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
  kernelDenial: {
    available: true,
    applied: true,
    reason: "synthetic cache record",
  },
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
    const declaration = suiteDeclaration(task);
    if (declaration.paths) {
      assert.ok(declaration.environment.length > 0, task.name);
      assert.equal(
        new Set(declaration.environment).size,
        declaration.environment.length,
        task.name,
      );
    } else assert.ok(declaration.retention?.length > 0, task.name);
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

test("WO-131 runtime-history differences preserve reuse while current pinned bytes invalidate it", (t) => {
  const { root } = fixture(t);
  const active = ".runtime/harness/1111111111111111";
  const old = ".runtime/harness/2222222222222222";
  write(
    root,
    ".claude/harness-manifest.json",
    JSON.stringify({
      profiles: [{ profile: { runtime: { snapshot: active } } }],
    }),
  );
  write(root, `${active}/runtime.mjs`, "active\n");
  const before = observeSuiteInputs(root);
  const key = suiteInputHash(row, before);
  assert.ok(key);
  assert.ok(before.installedRoots.includes(active));
  assert.ok(!before.installedRoots.includes(".runtime/harness"));
  write(root, `${old}/runtime.mjs`, "retained\n");
  assert.equal(suiteInputHash(row, observeSuiteInputs(root)), key);
  assert.equal(
    readFileSync(join(root, `${old}/runtime.mjs`), "utf8"),
    "retained\n",
  );
  write(root, `${active}/runtime.mjs`, "active changed\n");
  assert.notEqual(suiteInputHash(row, observeSuiteInputs(root)), key);
  write(root, ".claude/harness-manifest.json", "{broken");
  const unknown = suiteInputHash(row, observeSuiteInputs(root));
  write(root, `${old}/runtime.mjs`, "retained changed\n");
  assert.notEqual(suiteInputHash(row, observeSuiteInputs(root)), unknown);
});

test("WO-131 declared environment drives both execution and identity, ignoring unrelated session inputs", (t) => {
  const { root } = fixture(t);
  const env = {
    ...process.env,
    TZ: "UTC",
    CLAUDE_PID: "111",
    GIT_SSH_COMMAND: "first-session",
    TMPDIR: "/first-session/tmp",
  };
  const before = observeSuiteInputs(root, { env });
  const key = suiteInputHash(row, before);
  assert.ok(key);
  for (const name of ["CLAUDE_PID", "GIT_SSH_COMMAND", "TMPDIR"])
    assert.equal(
      suiteInputHash(
        row,
        observeSuiteInputs(root, {
          env: { ...env, [name]: "different-session" },
        }),
      ),
      key,
      name,
    );
  assert.notEqual(
    suiteInputHash(
      row,
      observeSuiteInputs(root, { env: { ...env, TZ: "America/New_York" } }),
    ),
    key,
  );
  const context = createReplicaContext(root);
  t.after(() => context.cleanup());
  const replica = context.create(row, suiteDeclaration(row), before);
  t.after(() => replica.cleanup());
  const actual = execFileSync(
    process.execPath,
    [
      "-e",
      "process.stdout.write(JSON.stringify({TZ:process.env.TZ,CLAUDE_PID:process.env.CLAUDE_PID,GIT_SSH_COMMAND:process.env.GIT_SSH_COMMAND,TMPDIR:process.env.TMPDIR}))",
    ],
    { cwd: replica.root, env: replica.env, encoding: "utf8" },
  );
  const observed = JSON.parse(actual);
  assert.equal(observed.TZ, "UTC");
  assert.equal(observed.CLAUDE_PID, undefined);
  assert.equal(observed.GIT_SSH_COMMAND, undefined);
  assert.equal(observed.TMPDIR, replica.env.TMPDIR);
  assert.notEqual(observed.TMPDIR, env.TMPDIR);
});

test("WO-131 replica PATH identity is the ordered existing physical directories, so dangling per-shell entries and spellings never fork a key across sessions", (t) => {
  const { root } = fixture(t);
  const tools = mkdtempSync(join(tmpdir(), "dotln-path-tools-"));
  t.after(() => rmSync(tools, { recursive: true, force: true }));
  const physical = join(tools, "physical");
  mkdirSync(physical);
  symlinkSync(physical, join(tools, "session-12345"));
  writeFileSync(join(tools, "not-a-directory"), "");
  const dangling = join(tools, "multishell-99999", "bin");
  const canonical = `${physical}${delimiter}${process.env.PATH}`;
  const keyFor = (PATH) =>
    suiteInputHash(
      row,
      observeSuiteInputs(root, { env: { ...process.env, PATH } }),
    );
  const key = keyFor(canonical);
  assert.ok(key);
  for (const PATH of [
    `${dangling}${delimiter}${join(tools, "session-12345")}${delimiter}${process.env.PATH}`,
    `${physical}${delimiter}${physical}${delimiter}${process.env.PATH}${delimiter}${join(tools, "not-a-directory")}`,
    `${realpathSync(physical)}${delimiter}${process.env.PATH}`,
  ])
    assert.equal(keyFor(PATH), key, PATH);
  mkdirSync(join(tools, "other"));
  assert.notEqual(
    keyFor(`${join(tools, "other")}${delimiter}${canonical}`),
    key,
  );
  const snapshot = observeSuiteInputs(root, {
    env: {
      ...process.env,
      PATH: `${dangling}${delimiter}${join(tools, "session-12345")}${delimiter}${process.env.PATH}`,
    },
  });
  const context = createReplicaContext(root);
  t.after(() => context.cleanup());
  const replica = context.create(row, suiteDeclaration(row), snapshot);
  t.after(() => replica.cleanup());
  const entries = replica.env.PATH.split(delimiter);
  assert.equal(entries[0], realpathSync(physical));
  assert.ok(!entries.includes(dangling));
  assert.ok(!entries.includes(join(tools, "session-12345")));
  assert.equal(new Set(entries).size, entries.length);
  for (const entry of entries)
    if (isAbsolute(entry) && !entry.startsWith(replica.root))
      assert.ok(lstatSync(entry).isDirectory(), entry);
});

test("WO-131 a fresh explanation names the changed environment variables, never their values", (t) => {
  const { root } = fixture(t);
  const tools = mkdtempSync(join(tmpdir(), "dotln-env-diagnostic-"));
  t.after(() => rmSync(tools, { recursive: true, force: true }));
  mkdirSync(join(tools, "session-a"));
  mkdirSync(join(tools, "session-b"));
  const env = (directory, extra = {}) => ({
    ...process.env,
    ...extra,
    PATH: `${directory}${delimiter}${process.env.PATH}`,
  });
  const first = observeSuiteInputs(root, {
    env: env(join(tools, "session-a")),
  });
  const key = suiteInputHash(row, first);
  const identity = suiteInputIdentity(row, first);
  assert.ok(Object.keys(identity.variables).includes("PATH"));
  assert.ok(
    Object.values(identity.variables).every((hash) =>
      /^[a-f0-9]{64}$/.test(hash),
    ),
  );
  assert.ok(
    saveSuiteSuccess(
      root,
      row,
      key,
      { ...source, recordedAt: new Date().toISOString() },
      identity,
    ),
  );
  const record = JSON.parse(
    readFileSync(
      join(suiteCacheDirectory(root, row.name), `${key}.json`),
      "utf8",
    ),
  );
  assert.deepEqual(record.variables, identity.variables);
  assert.ok(!JSON.stringify(record).includes(join(tools, "session-a")));
  const second = observeSuiteInputs(root, {
    env: env(join(tools, "session-b"), { LANG: "C" }),
  });
  const reason = explainSuiteFresh(
    root,
    row,
    suiteInputIdentity(row, second),
    null,
  );
  assert.equal(reason.reason, "inputs changed");
  const environment = reason.changes.find(
    (change) => change.inputClass === "environment",
  );
  assert.deepEqual(environment.paths, ["LANG", "PATH"]);
  assert.match(formatSuiteFresh(reason), /environment: LANG, PATH/);
});

test("WO-131 the success cache keeps only the newest records per suite", (t) => {
  const { root } = fixture(t);
  const directory = suiteCacheDirectory(root, row.name);
  const keys = [];
  for (let index = 0; index < retainedSuccessesPerSuite + 6; index++) {
    write(root, "docs/product/02-domain-model.md", `edition ${index}\n`);
    const snapshot = observeSuiteInputs(root);
    const key = suiteInputHash(row, snapshot);
    assert.ok(
      saveSuiteSuccess(
        root,
        row,
        key,
        { ...source, recordedAt: new Date(index * 1000).toISOString() },
        suiteInputIdentity(row, snapshot),
      ),
    );
    keys.push(key);
  }
  const retained = readdirSync(directory).filter((file) =>
    /^[a-f0-9]{64}\.json$/.test(file),
  );
  assert.equal(retained.length, retainedSuccessesPerSuite);
  assert.ok(loadSuiteSuccess(root, row.name, keys.at(-1)));
  assert.ok(
    loadSuiteSuccess(root, row.name, keys.at(-retainedSuccessesPerSuite)),
  );
  assert.equal(loadSuiteSuccess(root, row.name, keys[0]), null);
  assert.equal(pruneSuiteSuccesses(directory, `${keys.at(-1)}.json`), 0);
  assert.equal(pruneSuiteSuccesses(join(root, "absent"), "none"), 0);
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
  assert.equal(
    suiteInputHash(row, {
      ...snapshot,
      installedReusable: false,
      reusable: false,
    }),
    null,
  );
  assert.equal(suiteInputHash({ ...row, reuse: "live" }, snapshot), null);
  const skeleton = { ...row, name: "skeleton" };
  const skeletonBefore = suiteInputHash(skeleton, snapshot);
  assert.ok(skeletonBefore);
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
    for (const index of [0, 1])
      assert.equal(changed[index], event[index], path);
    for (const index of [2, 3, 4])
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
  write(sibling, "docs/product/02-domain-model.md", "one differing byte\n");
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
const result = await runGate(["--only", "kernel"], process.cwd(), { kernelProbe: () => ({ available: true, reason: "synthetic npm adapter", command: [] }) });
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
  write(sibling, "docs/product/02-domain-model.md", "different input\n");
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
  const row = { name: "index", command: [process.execPath, "check"] };
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
  assert.ok(before);
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
  assert.ok(hash);
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
  for (const key of ["TZ", "LC_ALL", "npm_config_audit", "NODE_NO_WARNINGS"]) {
    assert.notEqual(
      suiteInputHash(
        row,
        observeSuiteInputs(root, { env: { ...env, [key]: "1" } }),
      ),
      hash,
      key,
    );
  }
  assert.equal(
    suiteInputHash(
      row,
      observeSuiteInputs(root, { env: { ...env, GIT_CONFIG_NOSYSTEM: "1" } }),
    ),
    hash,
    "replicas always disable system Git configuration",
  );
  // A harness session's injected Git configuration names its own checkouts and
  // transport settings. It is absent from the key and never refuses narrowing.
  const injected = {
    ...env,
    GIT_CONFIG_COUNT: "2",
    GIT_CONFIG_KEY_0: "safe.directory",
    GIT_CONFIG_VALUE_0: root,
    GIT_CONFIG_KEY_1: "safe.directory",
    GIT_CONFIG_VALUE_1: `${root}/*`,
    GIT_CONFIG_PARAMETERS: "'http.proxyAuthMethod=basic'",
  };
  const withInjected = observeSuiteInputs(root, { env: injected });
  assert.equal(
    replicaPlan(row, suiteDeclaration(row), withInjected).refusal,
    undefined,
  );
  assert.equal(suiteInputHash(row, withInjected), hash);
  assert.ok(
    !withInjected.environmentKeys.some((key) =>
      /^GIT_CONFIG_(?:COUNT|PARAMETERS|KEY_\d+|VALUE_\d+)$/.test(key),
    ),
  );
  const mutated = [
    "HTTP_PROXY",
    "UNREVIEWED_FIXTURE_VARIABLE",
    "GIT_CONFIG_COUNT",
    "GIT_CONFIG_KEY_0",
    "GIT_CONFIG_VALUE_0",
    "GIT_CONFIG_PARAMETERS",
  ];
  try {
    process.env.HTTP_PROXY = "synthetic-execution-proxy";
    process.env.UNREVIEWED_FIXTURE_VARIABLE = "synthetic-execution-extra";
    process.env.GIT_CONFIG_COUNT = "1";
    process.env.GIT_CONFIG_KEY_0 = "safe.directory";
    process.env.GIT_CONFIG_VALUE_0 = root;
    process.env.GIT_CONFIG_PARAMETERS = "'http.proxyAuthMethod=basic'";
    const result = await executeSuite(
      {
        name: "environment-observer",
        command: [
          process.execPath,
          "-e",
          "console.log(JSON.stringify({proxy:process.env.HTTP_PROXY??null,extra:process.env.UNREVIEWED_FIXTURE_VARIABLE??null,gate:process.env.DOTLN_GATE_CHILD,git:[process.env.GIT_CONFIG_COUNT??null,process.env.GIT_CONFIG_VALUE_0??null,process.env.GIT_CONFIG_PARAMETERS??null]}))",
        ],
      },
      root,
    );
    assert.equal(result.exitCode, 0);
    assert.deepEqual(JSON.parse(result.output), {
      proxy: null,
      extra: null,
      gate: "1",
      git: [null, null, null],
    });
  } finally {
    for (const key of mutated)
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
  }
});

test("reviewed inputs invalidate source, tests, helpers, config, dependencies, documents, paths and environment", (t) => {
  const row = { name: "index", command: [process.execPath, "check"] };
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
  assert.notEqual(suiteInputHash(row, observe()), baseline);
  write(root, "docs/product/05-supports.md", "initial\n");
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
  assert.ok(beforeTag);
  git("tag", "fixture-tag");
  assert.notEqual(suiteInputHash(row, observe()), beforeTag);
  assert.ok(
    before.meter.files > 0 &&
      before.meter.bytes > 0 &&
      before.meter.commands > 0 &&
      before.meter.durationMs > 0,
  );
});

test("host configuration content invalidates and unknown startup adapters force execution", (t) => {
  const row = { name: "index", command: [process.execPath, "check"] };
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
  const row = { name: "index", command: [process.execPath, "check"] };
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
  writeFileSync(path, bytes.replace('"version":4', '"version":3'));
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
    'import {writeFileSync} from "node:fs"; writeFileSync(' +
    JSON.stringify(join(root, "docs/product/02-domain-model.md")) +
    ', "changed while executing");\n' +
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

const declaredFixture = (t) => {
  const value = fixture(t);
  write(value.root, "package.json", '{"type":"module"}\n');
  return value;
};
const replicaRun = async (context, root, task) => {
  const snapshot = observeSuiteInputs(root);
  const replica = context.create(task, suiteDeclaration(task), snapshot);
  assert.ok(replica?.root, replica?.refusal);
  try {
    const result = await executeSuite(
      { ...task, executionEnvironment: replica.env },
      replica.root,
    );
    return { result, key: suiteInputHash(task, snapshot) };
  } finally {
    replica.cleanup();
  }
};

test("WO-130 replicas contain declared inputs and one verified read-only installed copy with unlistable parents", async (t) => {
  const { root } = declaredFixture(t);
  write(root, ".runtime/harness/fixture/runtime.mjs", "// installed fixture\n");
  write(root, "packages/kernel/src/declared.mjs", "// declared source\n");
  chmodSync(join(root, "packages/kernel/src/declared.mjs"), 0o751);
  symlinkSync("declared.mjs", join(root, "packages/kernel/src/alias.mjs"));
  const snapshot = observeSuiteInputs(root, {
    env: {
      ...process.env,
      PATH: `${root}/node_modules/.bin${delimiter}${process.env.PATH}`,
      npm_config_local_prefix: root,
    },
  });
  const context = createReplicaContext(root);
  t.after(() => context.cleanup());
  const task = {
    name: "kernel",
    command: [
      process.execPath,
      "-e",
      `
const fs=require('node:fs'),path=require('node:path');
let parent,write;
try{fs.readdirSync(path.dirname(process.cwd()));parent='listable'}catch(e){parent=e.code}
try{fs.writeFileSync('node_modules/example/index.js','corrupted');write='writable'}catch(e){write=e.code}
console.log(JSON.stringify({cwd:process.cwd(),argv:process.argv,env:process.env,parent,write,
  installed:fs.realpathSync('node_modules'), runtime:fs.readFileSync('.runtime/harness/fixture/runtime.mjs','utf8')}));
`,
    ],
  };
  const first = context.create(task, suiteDeclaration(task), snapshot);
  const second = context.create(task, suiteDeclaration(task), snapshot);
  assert.ok(first?.root, first?.refusal);
  assert.ok(second?.root, second?.refusal);
  t.after(() => {
    first.cleanup();
    second.cleanup();
  });
  // The per-gate copy is prepared once; a later snapshot with other installed
  // inputs cannot silently mount a different copy.
  assert.throws(
    () =>
      context.create(task, suiteDeclaration(task), {
        ...snapshot,
        runtime: "changed",
      }),
    /Installed inputs changed after the gate copy/,
  );
  const observe = await executeSuite(
    { ...task, executionEnvironment: first.env },
    first.root,
  );
  assert.equal(observe.exitCode, 0, observe.output);
  const info = JSON.parse(observe.output);
  assert.equal(info.parent, "EACCES");
  assert.equal(info.write, "EACCES");
  assert.ok(!JSON.stringify(info).includes(realpathSync(root)));
  assert.ok(info.env.npm_config_local_prefix === first.root);
  assert.ok(info.env.PATH.startsWith(join(first.root, "node_modules/.bin")));
  assert.ok(info.env.TMPDIR.startsWith(dirname(first.root)));
  assert.equal(info.env.GIT_CONFIG_NOSYSTEM, "1");
  assert.equal(info.env.GIT_CEILING_DIRECTORIES, dirname(first.root));
  assert.equal(
    realpathSync(join(first.root, "node_modules")),
    realpathSync(join(second.root, "node_modules")),
  );
  assert.notEqual(info.installed, realpathSync(join(root, "node_modules")));
  assert.equal(
    lstatSync(join(first.root, "packages/kernel/src/declared.mjs")).mode &
      0o777,
    0o751,
  );
  assert.equal(
    readFileSync(join(first.root, "packages/kernel/src/alias.mjs"), "utf8"),
    "// declared source\n",
  );
  const actual = [];
  const visit = (directory, base = "") => {
    for (const name of readdirSync(directory).sort()) {
      const path = join(base, name),
        full = join(directory, name);
      if (snapshot.installedRoots.includes(path)) {
        assert.ok(lstatSync(full).isSymbolicLink());
        continue;
      }
      actual.push(path);
      if (lstatSync(full).isDirectory()) visit(full, path);
    }
  };
  visit(first.root);
  const expected = replicaEntries(suiteDeclaration(task), snapshot)
    .filter(([, value]) => value[0] !== "absent")
    .map(([path]) => path);
  // Installed-root mount parents are structural directories only.
  for (const path of actual)
    assert.ok(expected.includes(path) || path === ".runtime", path);
  for (const path of expected) assert.ok(actual.includes(path), path);
  assert.ok(!existsSync(join(first.root, "src/main.js")));
  assert.ok(context.measurements.installedCopy.verified);
  assert.ok(context.measurements.installedCopy.bytes > 0);
  assert.equal(context.measurements.suites.length, 2);
});

test("WO-131 an installed bin link resolves through a copied workspace link, and a failed installed copy leaves nothing for later suites to collide with", (t) => {
  const { root } = declaredFixture(t);
  // npm links a workspace package's bin lexically through the workspace link;
  // only the physical target is an inventory entry.
  write(root, "packages/skeleton/dist/src/dotln.js", "// bin\n");
  write(
    root,
    "packages/skeleton/package.json",
    '{"name":"@dotln/skeleton","bin":{"dotln":"dist/src/dotln.js"}}\n',
  );
  mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
  symlinkSync(
    "../../packages/skeleton",
    join(root, "node_modules/@dotln/skeleton"),
  );
  mkdirSync(join(root, "node_modules/.bin"), { recursive: true });
  symlinkSync(
    "../@dotln/skeleton/dist/src/dotln.js",
    join(root, "node_modules/.bin/dotln"),
  );
  const environment = (repo) => ({
    ...process.env,
    PATH: `${repo}/node_modules/.bin${delimiter}${process.env.PATH}`,
    npm_config_local_prefix: repo,
  });
  const snapshot = observeSuiteInputs(root, { env: environment(root) });
  const context = createReplicaContext(root);
  t.after(() => context.cleanup());
  const task = {
    name: "kernel",
    command: [process.execPath, "-e", "process.exit(0)"],
  };
  const replica = context.create(task, suiteDeclaration(task), snapshot);
  assert.ok(replica?.root, replica?.refusal);
  t.after(() => replica.cleanup());
  const link = join(replica.root, "node_modules/.bin/dotln");
  assert.equal(fs.readlinkSync(link), "../@dotln/skeleton/dist/src/dotln.js");
  assert.equal(readFileSync(link, "utf8"), "// bin\n");
  assert.ok(
    !realpathSync(link).startsWith(realpathSync(root)),
    "the bin resolves inside the copy, never into the candidate tree",
  );
  assert.ok(context.measurements.installedCopy.verified);

  // A link inside the repository but outside the copied graph still refuses,
  // and the refusal leaves no partial copy: later suites name the same cause.
  const failing = declaredFixture(t);
  write(failing.root, "docs/outside.txt", "outside the installed roots\n");
  symlinkSync(
    "../docs/outside.txt",
    join(failing.root, "node_modules/outside"),
  );
  const failingSnapshot = observeSuiteInputs(failing.root, {
    env: environment(failing.root),
  });
  const failingContext = createReplicaContext(failing.root);
  t.after(() => failingContext.cleanup());
  const attempt = () =>
    failingContext.create(task, suiteDeclaration(task), failingSnapshot);
  assert.throws(
    attempt,
    /^Error: Installed link leaves the copied graph: node_modules\/outside$/,
  );
  assert.throws(
    attempt,
    /^Error: Installed copy failed earlier in this gate: Installed link leaves the copied graph: node_modules\/outside$/,
  );
  chmodSync(failingContext.directory, 0o700);
  try {
    assert.deepEqual(
      readdirSync(failingContext.directory).filter((name) =>
        name.startsWith("installed-"),
      ),
      [],
    );
  } finally {
    chmodSync(failingContext.directory, 0o300);
  }
  assert.equal(failingContext.measurements.installedCopy, null);
});

test("WO-130 existence, regular-file and declared-flag guards never see undeclared candidate inputs", async (t) => {
  const { root } = declaredFixture(t);
  const path = join(root, "undeclared.txt");
  const flag = "docs/product/02-domain-model.md";
  const context = createReplicaContext(root);
  t.after(() => context.cleanup());
  for (const guard of ["exists", "regular", "flag"]) {
    const task = {
      name: "kernel",
      command: [
        process.execPath,
        "-e",
        `
const fs=require('node:fs'); const path='undeclared.txt';
const selected=${guard === "exists" ? "fs.existsSync(path)" : guard === "regular" ? "fs.existsSync(path)&&fs.statSync(path).isFile()" : `fs.readFileSync('${flag}','utf8')==='on'`};
let result='skipped';if(selected){try{result=fs.readFileSync(path,'utf8')}catch(e){if(e.code!=='ENOENT')throw e;result='absent'}}
console.log(result);
`,
      ],
    };
    write(root, flag, "off");
    const observations = [];
    for (const state of ["absent", "present", "directory", "changed"]) {
      rmSync(path, { recursive: true, force: true });
      if (state === "directory") mkdirSync(path);
      else if (state !== "absent") writeFileSync(path, state);
      observations.push(await replicaRun(context, root, task));
    }
    assert.ok(observations.every((value) => value.key === observations[0].key));
    assert.ok(
      observations.every(
        ({ result }) =>
          result.exitCode === 0 && result.output.trim() === "skipped",
      ),
    );
    if (guard === "flag") {
      write(root, flag, "on");
      const selected = await replicaRun(context, root, task);
      assert.notEqual(selected.key, observations[0].key);
      assert.equal(selected.result.output.trim(), "absent");
      rmSync(path);
      const absent = await replicaRun(context, root, task);
      assert.equal(absent.key, selected.key);
      assert.equal(absent.result.output, selected.result.output);
    }
  }
});

test("WO-130 an unconditional undeclared read fails the gate despite a passing candidate run", async (t) => {
  const { root } = declaredFixture(t);
  const source =
    "import {readFileSync} from 'node:fs'; readFileSync('undeclared.txt','utf8');\n";
  write(root, "undeclared.txt", "would pass in candidate\n");
  write(
    root,
    "scripts/build.mjs",
    `import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('packages/kernel/dist/test',{recursive:true});writeFileSync('packages/kernel/dist/test/fixture.test.js',${JSON.stringify(source)});`,
  );
  execFileSync(process.execPath, ["scripts/build.mjs"], { cwd: root });
  const candidate = await executeSuite(row, root);
  assert.equal(candidate.exitCode, 0, candidate.output);
  const lines = [];
  const log = console.log;
  let gate;
  try {
    console.log = (...args) => {
      lines.push(args.join(" "));
      log(...args);
    };
    gate = await runGate(["--only", "kernel"], root);
  } finally {
    console.log = log;
  }
  assert.equal(gate.exitCode, 1);
  const output = lines.join("\n");
  assert.match(
    output,
    /Replica suite kernel failed; first unreadable path:.*undeclared\.txt/,
  );
  assert.match(output, /No candidate-tree fallback/);
  assert.equal(gate.replicaSetup.suites.length, 1);
});

test("WO-130 escaping links, arguments and environment refuse narrowing before lookup", (t) => {
  const { root } = declaredFixture(t);
  const outside = mkdtempSync(join(tmpdir(), "dotln-replica-outside-"));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(join(outside, "value"), "outside\n");
  const link = join(root, "packages/kernel/escape");
  symlinkSync(join(outside, "value"), link);
  let snapshot = observeSuiteInputs(root);
  assert.match(
    replicaPlan(row, suiteDeclaration(row), snapshot).refusal,
    /declared input|symlink/,
  );
  assert.equal(suiteInputHash(row, snapshot), null);
  rmSync(link);
  snapshot = observeSuiteInputs(root);
  const narrowed = suiteInputHash(row, snapshot);
  assert.ok(narrowed);
  // A refused narrowing keeps the whole-tree contract: a distinct key that an
  // undeclared script changes, never the replica key.
  const leaking = { ...row, args: [join(root, "src/main.js")] };
  assert.match(
    replicaPlan(leaking, suiteDeclaration(leaking), snapshot).refusal,
    /arguments/,
  );
  assert.ok(suiteInputHash(leaking, snapshot));
  assert.notEqual(suiteInputHash(leaking, snapshot), narrowed);
  const revealing = { ...process.env, SHELL: root };
  const environment = observeSuiteInputs(root, { env: revealing });
  assert.match(
    replicaPlan(row, suiteDeclaration(row), environment).refusal,
    /SHELL/,
  );
  const refused = suiteInputHash(row, environment);
  assert.ok(refused);
  assert.notEqual(refused, narrowed);
  write(root, "scripts/unrelated.mjs", "// outside the declaration\n");
  assert.equal(suiteInputHash(row, observeSuiteInputs(root)), narrowed);
  assert.notEqual(
    suiteInputHash(row, observeSuiteInputs(root, { env: revealing })),
    refused,
  );
  const incomplete = { ...snapshot, toolchainReusable: false, reusable: false };
  assert.match(
    replicaPlan(row, suiteDeclaration(row), incomplete).refusal,
    /observation is incomplete/,
  );
  assert.equal(suiteInputHash(row, incomplete), null);
});

test("WO-130 a refused narrowing executes whole-tree under its own key, names the refusal and never reuses a replica success", async (t) => {
  const { root } = declaredFixture(t);
  write(
    root,
    "scripts/build.mjs",
    `import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('packages/kernel/dist/test',{recursive:true});writeFileSync('packages/kernel/dist/test/fixture.test.js',"import test from 'node:test'; test('replica',()=>{});\\n");`,
  );
  const original = process.env.SHELL;
  t.after(() => {
    if (original === undefined) delete process.env.SHELL;
    else process.env.SHELL = original;
  });
  process.env.SHELL = root;
  const refused = await runGate(["--only", "kernel"], root);
  assert.equal(refused.exitCode, 0);
  assert.equal(refused.reusedSuites, 0);
  assert.equal(refused.replicaSetup.suites.length, 0);
  assert.match(
    refused.freshReasons.find((value) => value.name === "kernel").policy,
    /SHELL/,
  );
  // With --only, the aggregate shares the suite row's check id; only the suite
  // row carries the task name and its execution root.
  const recorded = readGateChecks(root, refused.treeHash).find(
    (value) => value.checkId === "suite:kernel" && value.name === "kernel",
  );
  assert.equal(recorded.executionRoot, "candidate");
  assert.match(recorded.narrowingRefusal, /SHELL/);
  const reused = await runGate(["--only", "kernel"], root);
  assert.equal(reused.reusedSuites, 1);
  assert.equal(reused.replicaSetup.suites.length, 0);
  write(root, "scripts/unrelated.mjs", "// whole-tree input\n");
  const wholeTree = await runGate(["--only", "kernel"], root);
  assert.equal(wholeTree.reusedSuites, 0);
  assert.equal(wholeTree.replicaSetup.suites.length, 0);
  delete process.env.SHELL;
  const narrowed = await runGate(["--only", "kernel"], root);
  assert.equal(narrowed.reusedSuites, 0);
  assert.equal(narrowed.replicaSetup.suites.length, 1);
  const composed = await runGate(["--only", "kernel"], root);
  assert.equal(composed.reusedSuites, 1);
  assert.equal(composed.replicaSetup.suites.length, 0);
});

test("WO-130 repository discovery from a git: none replica stops at its unlistable parent", (t) => {
  const { root } = declaredFixture(t);
  const outer = mkdtempSync(join(tmpdir(), "dotln-replica-scratch-repo-"));
  let context;
  t.after(() => {
    context?.cleanup();
    rmSync(outer, { recursive: true, force: true });
  });
  execFileSync("git", ["init", "-q", outer]);
  mkdirSync(join(outer, "scratch"));
  const original = process.env.TMPDIR;
  process.env.TMPDIR = join(outer, "scratch");
  try {
    context = createReplicaContext(root);
  } finally {
    if (original === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = original;
  }
  const replica = context.create(
    row,
    suiteDeclaration(row),
    observeSuiteInputs(root),
  );
  assert.ok(replica?.root, replica?.refusal);
  t.after(() => replica.cleanup());
  assert.equal(replica.env.GIT_CEILING_DIRECTORIES, dirname(replica.root));
  const discovered = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: replica.root,
    env: replica.env,
    encoding: "utf8",
  });
  assert.notEqual(discovered.status, 0);
  assert.match(discovered.stderr, /not a git repository/);
  assert.ok(!discovered.stdout.includes(realpathSync(outer)));
});

test("WO-130 replica repository uses only declared files and a deterministic history", (t) => {
  const { root } = declaredFixture(t);
  const context = createReplicaContext(root);
  t.after(() => context.cleanup());
  const task = { name: "kernel", command: [process.execPath, "-e", ""] };
  const declaration = { ...suiteDeclaration(task), git: "replica-repo" };
  const snapshot = observeSuiteInputs(root);
  const first = context.create(task, declaration, snapshot);
  const second = context.create(task, declaration, snapshot);
  assert.ok(first?.root, first?.refusal);
  assert.ok(second?.root, second?.refusal);
  t.after(() => {
    first.cleanup();
    second.cleanup();
  });
  const git = (replica, ...args) =>
    execFileSync("git", args, {
      cwd: replica.root,
      env: replica.env,
      encoding: "utf8",
    }).trim();
  assert.equal(
    git(first, "rev-parse", "HEAD"),
    git(second, "rev-parse", "HEAD"),
  );
  assert.equal(git(first, "rev-list", "--count", "HEAD"), "1");
  assert.ok(!git(first, "ls-files").includes("src/main.js"));
  assert.ok(!git(first, "ls-files").includes("node_modules"));
  assert.equal(git(first, "log", "-1", "--format=%aI"), "2000-01-01T00:00:00Z");
});

test("WO-130 unrelated scripts compose package evidence; declared bytes, modes, names and mechanism invalidate", async (t) => {
  const { root } = declaredFixture(t);
  write(
    root,
    "scripts/build.mjs",
    `import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('packages/kernel/dist/test',{recursive:true});writeFileSync('packages/kernel/dist/test/fixture.test.js',"import test from 'node:test'; test('replica',()=>{});\\n");`,
  );
  const first = await runGate(["--only", "kernel"], root);
  assert.equal(first.exitCode, 0);
  write(root, "scripts/unrelated.mjs", "// unrelated source edit\n");
  const composed = await runGate(["--only", "kernel"], root);
  assert.equal(composed.exitCode, 0);
  assert.equal(composed.reusedSuites, 1);
  write(root, "packages/kernel/src/new.mjs", "// declared source\n");
  const changed = await runGate(["--only", "kernel"], root);
  assert.equal(changed.exitCode, 0);
  assert.equal(changed.reusedSuites, 0);
  assert.ok(
    changed.freshReasons
      .find((value) => value.name === "kernel")
      .changes.some((change) =>
        change.paths.includes("packages/kernel/src/new.mjs"),
      ),
  );
  const snapshot = observeSuiteInputs(root);
  const before = suiteInputHash(row, snapshot);
  assert.ok(before);
  chmodSync(join(root, "packages/kernel/src/new.mjs"), 0o751);
  assert.notEqual(suiteInputHash(row, observeSuiteInputs(root)), before);
  renameSync(
    join(root, "packages/kernel/src/new.mjs"),
    join(root, "packages/kernel/src/renamed.mjs"),
  );
  assert.notEqual(suiteInputHash(row, observeSuiteInputs(root)), before);
  assert.equal(replicaMechanismVersion, first.replicaSetup.version);
  assert.notEqual(
    suiteInputHash(
      { ...row, command: [...row.command, "--test-only"] },
      snapshot,
    ),
    before,
  );
});

test("WO-130 release preparation cannot carry an undeclared guarded read into its shared template", async (t) => {
  const { root } = declaredFixture(t);
  write(root, "scripts/build.mjs", "// Synthetic build.\n");
  write(
    root,
    "scripts/test-release.sh",
    `#!/usr/bin/env bash
set -eu
release_case_success() {
  :
}
if [[ "$1" == --prepare-template ]]; then
  mkdir "$2"
  if [[ -e undeclared.txt ]]; then
    cat undeclared.txt > "$2/outcome"
  else
    printf 'absent\\n' > "$2/outcome"
  fi
else
  test "$(cat "$4/outcome")" = absent
fi
`,
  );
  for (const content of ["first candidate value\n", "changed value\n"]) {
    write(root, "undeclared.txt", content);
    const gate = await runGate(["--only", "release", "--fresh"], root);
    assert.equal(gate.exitCode, 0);
    assert.deepEqual(
      gate.replicaSetup.suites.map(({ name }) => name),
      ["release:prepare", "release:case:success"],
    );
  }
});

test("WO-130 cleanup tolerates an owned directory disappearing between observation and listing", (t) => {
  const { root } = declaredFixture(t);
  write(root, "packages/kernel/src/cleanup-race/value", "owned copy\n");
  const context = createReplicaContext(root);
  t.after(() => context.cleanup());
  const replica = context.create(
    row,
    suiteDeclaration(row),
    observeSuiteInputs(root),
  );
  const disappearing = join(replica.root, "packages/kernel/src/cleanup-race");
  const original = fs.readdirSync;
  let injected = false;
  fs.readdirSync = (path, ...args) => {
    if (path === disappearing && !injected) {
      injected = true;
      rmSync(path, { recursive: true, force: true });
    }
    return original(path, ...args);
  };
  syncBuiltinESMExports();
  try {
    replica.cleanup();
  } finally {
    fs.readdirSync = original;
    syncBuiltinESMExports();
  }
  assert.equal(injected, true);
  assert.equal(existsSync(replica.root), false);
  assert.equal(
    readFileSync(join(root, "packages/kernel/src/cleanup-race/value"), "utf8"),
    "owned copy\n",
  );
  context.cleanup();
  context.cleanup();
});

test("WO-130 a replica cleanup error becomes failed gate evidence without tearing down active work", async (t) => {
  const { root } = declaredFixture(t);
  write(root, "packages/kernel/src/cleanup-failure/value", "owned copy\n");
  write(
    root,
    "scripts/build.mjs",
    `import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('packages/kernel/dist/test',{recursive:true});writeFileSync('packages/kernel/dist/test/fixture.test.js',"import test from 'node:test'; test('replica',()=>{});\\n");`,
  );
  const original = fs.readdirSync;
  let injected = false;
  fs.readdirSync = (path, ...args) => {
    if (
      String(path).includes("/dotln-suite-replicas-") &&
      String(path).endsWith("/packages/kernel/src/cleanup-failure") &&
      !injected
    ) {
      injected = true;
      throw Object.assign(new Error("injected cleanup failure"), {
        code: "EIO",
      });
    }
    return original(path, ...args);
  };
  syncBuiltinESMExports();
  const lines = [];
  const log = console.log;
  let gate;
  try {
    console.log = (...args) => {
      lines.push(args.join(" "));
      log(...args);
    };
    gate = await runGate(["--only", "kernel", "--fresh"], root);
  } finally {
    fs.readdirSync = original;
    syncBuiltinESMExports();
    console.log = log;
  }
  assert.equal(injected, true);
  assert.equal(gate.exitCode, 1);
  assert.equal(gate.freshSuites, 2);
  assert.match(
    lines.join("\n"),
    /Replica cleanup for kernel failed: injected cleanup failure/,
  );
});
