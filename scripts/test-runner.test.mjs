import { spawnGit, execGit, runGit } from "./lib/git.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  cpSync,
  existsSync,
  linkSync,
  mkdtempSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  suites,
  validateSuites,
  expand,
  executeSuite,
  scheduleSuites,
  runGate,
  expandSuiteTasks,
  aggregateSuiteRows,
  changedMachinery,
  completeSharedRefs,
  sharedRefChanges,
} from "./test-runner.mjs";
import {
  activeGateRuns,
  beginGateRun,
  gateInputPath,
  gateCodeIdentity,
  gateTreeHash,
  findGateCheck,
  partialGateCheck,
  gateRunLineage,
  gateStopRequested,
  GATE_RUN_ENVIRONMENT,
  recordGateChecks,
  readGateChecks,
  readSharedRefs,
  requestGateStop,
} from "./lib/gate-evidence.mjs";
import {
  CONFINED_PARTIAL_CHECK,
  OUTSIDE_CONFINEMENT,
  deniedWriteCode,
  detectHostConfinement,
  probeDeniedWrite,
  confinementMarkers,
} from "./lib/host-confinement.mjs";
import {
  uncoveredMachinerySources,
  machineryCoverageScope,
} from "./lib/machinery-coverage.mjs";

const root = resolve(import.meta.dirname, "..");
const barrier = { name: "build", command: ["build"], build: true };
test("WO-174 product read guard fails the task and names the case and excluded tracked input, including inherited Node children", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-product-reads-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "docs"));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, "docs/input.md"), "fixture\n");
  writeFileSync(join(repo, "generated.json"), "{}\n");
  writeFileSync(join(repo, "NOTE.md"), "fixture\n");
  for (const directory of [".agents", ".claude"]) {
    mkdirSync(join(repo, directory));
    writeFileSync(join(repo, directory, "fixture.txt"), "fixture\n");
  }
  writeFileSync(
    join(repo, ".gitattributes"),
    "generated.json dotln-generated\n",
  );
  writeFileSync(
    join(repo, "scripts/read.test.mjs"),
    `
import test from "node:test";
import fs from "node:fs";
import promises from "node:fs/promises";
import {spawnSync} from "node:child_process";
test("named async read case", async t => {
  await Promise.resolve();
  fs.readFileSync("docs/input.md");
  const fd = fs.openSync("docs/input.md", "r");
  fs.readFileSync(fd); fs.closeSync(fd);
  fs.readdirSync("docs");
  await promises.readFile(new URL("../docs/input.md", import.meta.url));
  const handle = await promises.open("docs/input.md", "r"); await handle.close();
  await promises.readdir("docs");
  fs.readFileSync("generated.json");
  fs.readFileSync("NOTE.md");
  fs.readFileSync(".agents/fixture.txt");
  fs.readFileSync(".claude/fixture.txt");
  await t.test("nested inherited child", () => {
    spawnSync(process.execPath, ["-e", "require('node:fs').readFileSync('docs/input.md')"]);
  });
  await t.test("child retaining options in a reduced environment", () => {
    spawnSync(process.execPath, ["-e", "require('node:fs').readFileSync('docs/input.md')"], {
      env: {NODE_OPTIONS: process.env.NODE_OPTIONS},
    });
  });
});
`,
  );
  execGit(["add", "."], { cwd: repo });
  const command = [process.execPath, "--test", "scripts/read.test.mjs"];
  const unguarded = await executeSuite({ name: "unguarded", command }, repo);
  assert.equal(unguarded.exitCode, 0, unguarded.output);
  const guarded = await executeSuite(
    { name: "read-fixture", command, product: true, packageTest: true },
    repo,
  );
  assert.equal(guarded.exitCode, 1, "the old runner returns zero here");
  assert.match(guarded.output, /named async read case reads docs\/input\.md/u);
  assert.match(guarded.output, /nested inherited child reads docs\/input\.md/u);
  assert.match(
    guarded.output,
    /child retaining options in a reduced environment reads docs\/input\.md/u,
  );
  assert.match(guarded.output, /reads generated\.json/u);
  for (const path of ["NOTE.md", ".agents/fixture.txt", ".claude/fixture.txt"])
    assert.ok(guarded.output.includes(`reads ${path}`), path);
  const events = readFileSync(guarded.productReadLog, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  for (const method of [
    "readFileSync",
    "openSync",
    "readdirSync",
    "promises.readFile",
    "promises.open",
    "promises.readdir",
  ])
    assert.ok(
      events.some((event) => event.method === method),
      method,
    );
  assert.ok(
    events.some(
      (event) =>
        event.pid !== events.find((row) => row.method === "openSync").pid &&
        event.kind === "excluded-read",
    ),
  );
});

test("WO-174 machinery coverage names an uncovered entry, direct import or literal spawned script, accepts only reasoned exclusions and keeps its stated boundary", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-machinery-coverage-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(
    join(repo, "scripts/imported.mjs"),
    'import "./transitive.mjs";\n',
  );
  writeFileSync(join(repo, "scripts/transitive.mjs"), "export {};\n");
  writeFileSync(join(repo, "scripts/spawned.mjs"), "export {};\n");
  writeFileSync(join(repo, "scripts/comment-only.mjs"), "export {};\n");
  writeFileSync(
    join(repo, "scripts/entry.mjs"),
    `
import "./imported.mjs";
import {spawnSync} from "node:child_process";
spawnSync(process.execPath, ["scripts/spawned.mjs"]);
// spawnSync(process.execPath, ["scripts/comment-only.mjs"]);
const text = 'spawnSync(process.execPath, ["scripts/comment-only.mjs"])';
const computed = "scripts/" + "comment-only.mjs";
`,
  );
  const row = {
    name: "fixture",
    machinery: true,
    command: [process.execPath, "scripts/entry.mjs"],
    sources: [],
  };
  assert.deepEqual(uncoveredMachinerySources(repo, [row], {}), [
    { suite: "fixture", path: "scripts/entry.mjs" },
    { suite: "fixture", path: "scripts/imported.mjs" },
    { suite: "fixture", path: "scripts/spawned.mjs" },
  ]);
  const covered = {
    ...row,
    sources: ["scripts/entry.mjs", "scripts/imported.mjs"],
  };
  assert.deepEqual(uncoveredMachinerySources(repo, [covered], {}), [
    { suite: "fixture", path: "scripts/spawned.mjs" },
  ]);
  assert.throws(
    () =>
      uncoveredMachinerySources(repo, [covered], {
        fixture: { "scripts/spawned.mjs": "" },
      }),
    /needs a reason/u,
  );
  assert.deepEqual(
    uncoveredMachinerySources(repo, [covered], {
      fixture: {
        "scripts/spawned.mjs": "Fixture exclusion with a recorded reason",
      },
    }),
    [],
  );
  assert.match(
    machineryCoverageScope,
    /transitive imports and paths built at run time are outside/u,
  );
});

test("WO-174 every machinery suite covers its direct entry imports and literal script paths", () => {
  const findings = uncoveredMachinerySources(
    root,
    expandSuiteTasks(
      suites.filter((row) => row.machinery),
      root,
    ),
  );
  console.log(machineryCoverageScope);
  assert.deepEqual(
    findings,
    [],
    findings.map((row) => `${row.suite}: uncovered ${row.path}`).join("\n"),
  );
});

test("release shell changes select their inventory guard during review", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-release-selection-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
  mkdirSync(join(repo, "scripts"));
  const shell = join(repo, "scripts/test-release.sh");
  const baseline = "release_case_existing() {\n  :\n}\n";
  writeFileSync(shell, baseline);
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-m",
      "fixture baseline",
    ],
    fixtureGitOptions,
  );
  assert.deepEqual(changedMachinery(repo, suites, "main"), []);
  writeFileSync(shell, baseline + "release_case_added() {\n  :\n}\n");
  // Every path under scripts/ also selects the configuration-root suite
  // since WO-169 item 5 declared the directory.
  assert.deepEqual(
    changedMachinery(repo, suites, "main").map((row) => row.name),
    ["configuration-root", "runner-fixtures"],
  );
  const messages = [];
  const saved = console.log;
  try {
    console.log = (line) => messages.push(line);
    await runGate(["--review", "--list"], repo);
  } finally {
    console.log = saved;
  }
  assert.deepEqual(
    suites
      .filter(
        (row) =>
          row.machinery &&
          messages.some((line) => line.startsWith(`${row.name} —`)),
      )
      .map((row) => row.name),
    ["configuration-root", "runner-fixtures"],
  );
  const tasks = expandSuiteTasks(
    suites.filter((row) => row.name === "runner-fixtures"),
    repo,
  );
  assert.ok(
    tasks.some((task) =>
      task.args?.includes("scripts/test-release-fixtures.mjs"),
    ),
  );
  // An untracked script a suite declares selects it before it is staged, so
  // the review gate covers the file an order adds (WO-173, WO-169 D007).
  writeFileSync(shell, baseline);
  assert.deepEqual(changedMachinery(repo, suites, "main"), []);
  writeFileSync(join(repo, "scripts/test-gate-deadlines.mjs"), "export {};\n");
  assert.deepEqual(
    changedMachinery(repo, suites, "main").map((row) => row.name),
    ["configuration-root", "runner-fixtures"],
  );
});

test("npm test composes plain and review task rows; explicit fresh, changed code and unusable observations run fresh", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-reuse-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = {
    exec: true,
    trim: false,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
  runGit(repo, ["config", "maintenance.auto", "false"], fixtureGitOptions);
  runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    repo,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nobserved.jsonl\n",
  );
  mkdirSync(join(repo, "scripts"));
  const source = (name) => join(repo, `scripts/${name}.mjs`);
  for (const name of ["format", "build", "alpha", "machine"])
    writeFileSync(
      source(name),
      `import fs from "node:fs";\nfs.appendFileSync("observed.jsonl", ${JSON.stringify(`${name}\n`)});\n`,
    );
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(repo, ["commit", "-qm", "Gate reuse fixture"], fixtureGitOptions);
  // The order's branch: main stays behind, so a machinery source changed
  // here is selected under --review while the code identity stays put.
  runGit(repo, ["checkout", "-q", "-b", "work"], fixtureGitOptions);
  writeFileSync(
    source("machine"),
    readFileSync(source("machine"), "utf8") + "// changed\n",
  );
  runGit(
    repo,
    ["commit", "-qam", "Change the machinery source"],
    fixtureGitOptions,
  );
  const row = (name, options = {}) => ({
    name,
    command: [process.execPath, `scripts/${name}.mjs`],
    ...options,
  });
  const table = [
    {
      ...suites.find((row) => row.name === "format"),
      command: [process.execPath, "scripts/format.mjs"],
    },
    row("build", { build: true, product: true, outputs: [] }),
    row("alpha", { product: true }),
    row("machine", { machinery: true, sources: ["scripts/machine.mjs"] }),
  ];
  const executions = () =>
    existsSync(join(repo, "observed.jsonl"))
      ? readFileSync(join(repo, "observed.jsonl"), "utf8").trim().split("\n")
      : [];
  const observed = () => executions().filter((name) => name !== "format");
  const formats = () => executions().filter((name) => name === "format").length;
  const rows = () =>
    readGateChecks(repo).filter((check) => check.checkId === "npm test");
  const lines = [];
  const log = console.log;
  console.log = (line) => lines.push(String(line));
  t.after(() => (console.log = log));
  const gate = async (args) => {
    const before = formats();
    const check = await runGate(["--serial", ...args], repo, { table });
    assert.equal(
      formats(),
      before + 1,
      "format runs freshly on every selection",
    );
    return check;
  };
  const identity = gateCodeIdentity(repo);
  const first = await gate([]);
  assert.equal(first.exitCode, 0);
  assert.equal(first.reused, undefined);
  assert.equal(first.codeIdentity, identity);
  assert.deepEqual(first.requiredSuites, ["build", "format", "alpha"]);
  assert.deepEqual(observed(), ["build", "alpha"]);
  assert.equal(rows().length, 1);
  // Only format runs at the same identity; the composed row retains the
  // executed source pointers for every reused product task.
  lines.length = 0;
  const reused = await gate([]);
  assert.equal(reused.exitCode, 0);
  assert.equal(reused.reused, undefined);
  assert.equal(reused.executionMode, "composed");
  assert.equal(reused.gateSelection, "plain");
  assert.equal(reused.freshReason, "always-fresh-preflight");
  assert.equal(reused.freshSuites, 1);
  assert.equal(reused.reusedSuites, 2);
  for (const task of reused.taskTimeline.filter(
    (row) => row.name !== "format",
  )) {
    assert.equal(task.reused, true);
    assert.equal(task.sourceRow.recordedAt, first.recordedAt);
  }
  assert.equal(reused.evidenceRef, first.evidenceRef);
  assert.deepEqual(observed(), ["build", "alpha"]);
  assert.equal(rows().length, 2);
  assert.ok(lines.some((line) => line.startsWith("PASS format ")));
  assert.ok(lines.some((line) => line.startsWith("REUSE build ")));
  assert.ok(lines.some((line) => line.startsWith("REUSE alpha ")));
  assert.equal(
    findGateCheck(repo, "npm test", gateTreeHash(repo)).evidenceRef,
    first.evidenceRef,
  );
  // --again runs the selection.
  const again = await gate(["--again"]);
  assert.equal(again.exitCode, 0);
  assert.equal(again.reused, undefined);
  assert.equal(again.executionMode, "forced-fresh");
  assert.equal(again.freshReason, "requested");
  assert.deepEqual(observed(), ["build", "alpha", "build", "alpha"]);
  assert.equal(rows().length, 3);
  // --fresh keeps its meaning and runs the selection too.
  const fresh = await gate(["--fresh"]);
  assert.equal(fresh.reused, undefined);
  assert.equal(observed().length, 6);
  assert.equal(rows().length, 4);
  // A review carries the product tasks and executes the uncovered machinery.
  const review = await gate(["--review"]);
  assert.equal(review.exitCode, 0);
  assert.equal(review.reused, undefined);
  assert.deepEqual(review.requiredSuites, [
    "build",
    "format",
    "alpha",
    "machine",
  ]);
  assert.deepEqual(observed().slice(6), ["machine"]);
  assert.equal(review.executionMode, "composed");
  assert.equal(review.gateSelection, "review");
  assert.equal(review.freshReason, "missing-passing-tasks");
  assert.equal(rows().length, 5);
  // Both selections reuse the covering task results.
  lines.length = 0;
  const reviewAgain = await gate(["--review"]);
  assert.equal(reviewAgain.reused, undefined);
  assert.equal(reviewAgain.executionMode, "composed");
  assert.equal(reviewAgain.freshReason, "always-fresh-preflight");
  assert.equal(reviewAgain.freshSuites, 1);
  assert.equal(reviewAgain.reusedSuites, 3);
  assert.equal(reviewAgain.evidenceRef, review.evidenceRef);
  assert.deepEqual(observed().slice(7), []);
  const plainAfterReview = await gate([]);
  assert.equal(plainAfterReview.reused, undefined);
  assert.equal(plainAfterReview.freshReason, "always-fresh-preflight");
  assert.equal(plainAfterReview.evidenceRef, review.evidenceRef);
  assert.equal(observed().length, 7);
  assert.equal(rows().length, 7);
  // A changed source file moves the code identity, and the gate runs.
  writeFileSync(
    source("alpha"),
    readFileSync(source("alpha"), "utf8") + "// edit\n",
  );
  assert.notEqual(gateCodeIdentity(repo), identity);
  const changed = await gate([]);
  assert.equal(changed.reused, undefined);
  assert.equal(observed().length, 9);
  assert.equal(changed.codeIdentity, gateCodeIdentity(repo));
  // A failed row and a partial row at the current identity never satisfy the
  // lookup, whoever recorded them.
  for (const [label, extra] of [
    [
      "failed",
      { exitCode: 1, identityUnchanged: false, evidenceRef: "fixture:failed" },
    ],
    [
      "partial",
      {
        partial: true,
        excludedSuites: ["alpha"],
        evidenceRef: "fixture:partial",
      },
    ],
  ]) {
    writeFileSync(
      source("alpha"),
      readFileSync(source("alpha"), "utf8") + `// ${label}\n`,
    );
    const moved = gateCodeIdentity(repo);
    assert.equal(
      rows().some((check) => check.codeIdentity === moved),
      false,
    );
    recordGateChecks(repo, [
      {
        ...changed,
        codeIdentity: moved,
        recordedAt: new Date().toISOString(),
        ...extra,
      },
    ]);
    const before = observed().length;
    const run = await gate([]);
    assert.equal(run.reused, undefined, label);
    assert.equal(observed().length, before + 2, label);
  }
  // The lookup itself, beside the runner.
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  const covering = await coveringGateCheck(repo, "npm test", [
    "build",
    "alpha",
    "zeta",
  ]);
  assert.equal(covering.row, undefined);
  assert.deepEqual(covering.missing, ["zeta"]);
  assert.ok(covering.candidates.length >= 1);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["alpha"])).row.evidenceRef,
    rows().at(-1).evidenceRef,
  );
  // A complete passing row that names no suites covers an empty requirement,
  // as publication accepts it, and never a named selection, so the runner
  // does not reuse it.
  writeFileSync(
    source("alpha"),
    readFileSync(source("alpha"), "utf8") + "// bare\n",
  );
  const bare = gateCodeIdentity(repo);
  const { requiredSuites: omitted, ...bareRow } = changed;
  assert.ok(omitted.length);
  recordGateChecks(repo, [
    {
      ...bareRow,
      codeIdentity: bare,
      evidenceRef: "fixture:bare",
      recordedAt: new Date().toISOString(),
    },
  ]);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", [], bare)).row.evidenceRef,
    "fixture:bare",
  );
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["alpha"], bare)).row,
    undefined,
  );
  const beforeBare = observed().length;
  const bareRun = await gate([]);
  assert.equal(
    bareRun.reused,
    undefined,
    "a row naming no suites is not reused",
  );
  assert.equal(observed().length, beforeBare + 2);
  assert.deepEqual(activeGateRuns(repo), [], "every run released its marker");
});

test("WO-169 a changed script outside the former eight sources selects the configuration-root suite", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-script-selection-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
  mkdirSync(join(repo, "scripts"));
  mkdirSync(join(repo, "packages/kernel/src"), { recursive: true });
  // The script WO-165 changed while no gate selected the suite that scans
  // it (WO-085 D014), and a source no machinery suite declares.
  const script = join(repo, "scripts/authority-evidence.mjs");
  const other = join(repo, "packages/kernel/src/undeclared.ts");
  writeFileSync(script, "export const route = 1;\n");
  writeFileSync(other, "export const value = 1;\n");
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-m",
      "fixture baseline",
    ],
    fixtureGitOptions,
  );
  const listed = async () => {
    const messages = [];
    const saved = console.log;
    try {
      console.log = (line) => messages.push(line);
      await runGate(["--review", "--list"], repo);
    } finally {
      console.log = saved;
    }
    return messages;
  };
  writeFileSync(other, "export const value = 2;\n");
  assert.deepEqual(changedMachinery(repo, suites, "main"), []);
  assert.ok(
    !(await listed()).some((line) => line.startsWith("configuration-root —")),
    "a change outside scripts/ leaves the suite unselected",
  );
  writeFileSync(script, "export const route = 2;\n");
  assert.ok(
    changedMachinery(repo, suites, "main").some(
      (row) => row.name === "configuration-root",
    ),
  );
  assert.ok(
    (await listed()).some((line) => line.startsWith("configuration-root —")),
    "npm test -- --review --list names the suite",
  );
});

test("WO-133 review selection ignores release-only changes and retains host behavior suites", async () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-version-selection-"));
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  const version = "packages/skeleton/src/version.ts";
  const compiler = "packages/compiler/src/artifact-identity.ts";
  try {
    runGit(repo, ["init", "-b", "main"], fixtureGitOptions);
    mkdirSync(join(repo, "packages/skeleton/src"), { recursive: true });
    mkdirSync(join(repo, "packages/compiler/src"), { recursive: true });
    writeFileSync(
      join(repo, version),
      'export const HARNESS_HOST_VERSION = "1.0.0";\n',
    );
    writeFileSync(
      join(repo, compiler),
      'export const COMPILER_PACKAGE_VERSION = "1.0.0";\n',
    );
    writeFileSync(
      join(repo, "packages/skeleton/src/harness-host.ts"),
      "export const behavior = 1;\n",
    );
    runGit(repo, ["add", "."], fixtureGitOptions);
    runGit(
      repo,
      [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "commit",
        "-m",
        "fixture baseline",
      ],
      fixtureGitOptions,
    );
    writeFileSync(
      join(repo, version),
      'export const HARNESS_HOST_VERSION = "1.0.1";\n',
    );
    assert.deepEqual(changedMachinery(repo, suites, "main"), []);
    const messages = [];
    const saved = console.log;
    try {
      console.log = (line) => messages.push(line);
      await runGate(["--review", "--list"], repo);
    } finally {
      console.log = saved;
    }
    for (const row of suites.filter((row) => row.machinery))
      assert.ok(
        !messages.some((line) => line.startsWith(`${row.name} —`)),
        row.name,
      );
    writeFileSync(
      join(repo, compiler),
      'export const COMPILER_PACKAGE_VERSION = "1.0.1";\n',
    );
    assert.deepEqual(changedMachinery(repo, suites, "main"), []);
    writeFileSync(
      join(repo, "packages/skeleton/src/harness-host.ts"),
      "export const behavior = 2;\n",
    );
    const selected = changedMachinery(repo, suites, "main").map(
      (row) => row.name,
    );
    assert.ok(selected.includes("harness-fixtures"));
    assert.ok(selected.includes("process-debt"));
    const versionConsumers = [
      "harness-fixtures",
      "harness",
      "process-debt",
      "harness-evidence",
      "authority-evidence",
      "artifact-evidence",
      "verification-evidence",
      "feedback-evidence",
    ];
    for (const name of versionConsumers)
      assert.ok(
        suites.find((row) => row.name === name).sources.includes(version),
        name,
      );
    writeFileSync(
      join(repo, "packages/skeleton/src/harness-host.ts"),
      "export const behavior = 1;\n",
    );
    writeFileSync(
      join(repo, version),
      'export const HARNESS_HOST_VERSION = "1.0.1";\nexport const behavior = 2;\n',
    );
    const behaviorSelected = changedMachinery(repo, suites, "main").map(
      (row) => row.name,
    );
    for (const name of versionConsumers)
      assert.ok(behaviorSelected.includes(name), name);
    const host = readFileSync(
      join(root, "packages/skeleton/src/harness-host.ts"),
      "utf8",
    );
    const profiles = readFileSync(
      join(root, "packages/skeleton/src/loadouts/contributor.ts"),
      "utf8",
    );
    assert.doesNotMatch(host, /HARNESS_HOST_VERSION\s*=\s*["']/);
    assert.doesNotMatch(profiles, /skeletonVersion:\s*["']/);
    assert.match(
      readFileSync(join(root, version), "utf8"),
      /HARNESS_HOST_VERSION\s*=\s*"\d+\.\d+\.\d+"/,
    );
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
test("full inventory retains every command in the previous package test chain", () => {
  const before = JSON.parse(
    readFileSync(
      join(root, "scripts/fixtures/runner-baseline-v0.16.0.json"),
      "utf8",
    ),
  ).scripts.test.split(" && ");
  assert.equal(before.length, 37);
  const commands = suites.map((row) =>
    [...row.command, ...(row.args ?? [])]
      .filter(
        (part) =>
          !part.startsWith("--test-concurrency=") &&
          part !== "--test-reporter=tap" &&
          !part.startsWith("--test-name-pattern=") &&
          !part.startsWith("--test-skip-pattern="),
      )
      .map((part) => (part === process.execPath ? "node" : part))
      .join(" "),
  );
  for (const command of before) {
    if (
      command.startsWith("rm -rf ") ||
      command === "tsc -b --force" ||
      command.startsWith("ls packages/")
    ) {
      assert.ok(
        suites.some(
          (row) => row.build && row.command[1] === "scripts/build.mjs",
        ),
      );
      continue;
    }
    if (command.includes("packages/kernel/dist/test")) {
      for (const name of ["kernel", "compiler", "skeleton"])
        assert.ok(suites.some((row) => row.name === name));
      continue;
    }
    const normalized = command
      .replace(
        "npm run test:mutation --silent",
        "node --test corpus/mutation/wo108-selftest.test.mjs",
      )
      .replace(
        /^(node scripts\/(?:authority|feedback)-evidence\.mjs --check) --edition WO-\d{3}(?: --revision \d{3})?$/,
        "$1",
      )
      .replace(
        /^node scripts\/test-plan-refutation\.mjs$/,
        "node scripts/test-plan-refutation.mjs --fixtures-only",
      )
      .replace(/^node (scripts\/test-github-body\.mjs)$/, "node --test $1");
    assert.ok(
      commands.includes(normalized),
      `missing prior command: ${command}`,
    );
  }
});
test("package suites bound child-file concurrency as well as outer scheduling", () => {
  for (const row of suites.filter((suite) => suite.command.includes("--test")))
    assert.ok(row.command.includes("--test-reporter=tap"), row.name);
  for (const name of ["kernel", "compiler", "skeleton", "console"]) {
    const row = suites.find((suite) => suite.name === name);
    assert.ok(row.fileConcurrency >= 1 && row.fileConcurrency <= 2);
    assert.ok(
      row.command.includes(`--test-concurrency=${row.fileConcurrency}`),
    );
  }
});
test("build is a barrier, independent suites overlap, shared groups cannot overlap", async () => {
  const events = [],
    active = new Set();
  let built = false,
    overlap = false;
  const table = [
    barrier,
    { name: "a", command: ["a"], group: "shared" },
    { name: "b", command: ["b"], group: "shared" },
    { name: "c", command: ["c"] },
  ];
  const results = await scheduleSuites(table, {
    concurrency: 3,
    execute: async (row) => {
      events.push(`start:${row.name}`);
      if (!row.build) {
        assert.ok(built);
        if (row.group) assert.ok(!active.has(row.group));
        if (active.size) overlap = true;
      }
      active.add(row.group ?? row.name);
      await new Promise((done) => setTimeout(done, 10));
      active.delete(row.group ?? row.name);
      if (row.build) built = true;
      events.push(`end:${row.name}`);
      return { name: row.name, exitCode: 0 };
    },
  });
  assert.equal(results.length, 4);
  assert.ok(overlap);
  assert.ok(events.indexOf("end:build") < events.indexOf("start:a"));
  assert.ok(events.indexOf("end:a") < events.indexOf("start:b"));
});
test("serial scheduling has one active suite and failed build launches no dependents", async () => {
  let active = 0,
    peak = 0;
  await scheduleSuites(
    [
      barrier,
      { name: "one", command: ["one"] },
      { name: "two", command: ["two"] },
    ],
    {
      concurrency: 1,
      execute: async (row) => {
        peak = Math.max(peak, ++active);
        await Promise.resolve();
        active--;
        return { name: row.name, exitCode: 0 };
      },
    },
  );
  assert.equal(peak, 1);
  const rows = await scheduleSuites(
    [barrier, { name: "never", command: ["never"] }],
    { execute: async (row) => ({ name: row.name, exitCode: 1 }) },
  );
  assert.deepEqual(
    rows.map((row) => row.name),
    ["build"],
  );
  assert.throws(() => validateSuites([barrier, barrier]), /duplicate/);
});
test("stale generated evidence stops the gate before expensive fixtures", async () => {
  const selected = suites.filter((row) =>
    ["build", "authority-evidence", "index", "harness-fixtures"].includes(
      row.name,
    ),
  );
  const started = [];
  const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
    execute: async (row) => {
      started.push(row.name);
      return {
        name: row.name,
        executed: true,
        exitCode: row.name === "authority-evidence" ? 1 : 0,
      };
    },
  });
  assert.ok(started.includes("authority-evidence"));
  assert.ok(started.includes("index"));
  assert.ok(!started.includes("harness-fixtures"));
  assert.match(
    rows.find((row) => row.name === "harness-fixtures").output,
    /failed for harness-fixtures: authority-evidence/,
  );
  assert.equal(
    rows.find((row) => row.name === "harness-fixtures").executed,
    false,
  );
});
test("package tests and fixtures wait for preflights and never start after a failed preflight", async () => {
  for (const indexExit of [0, 1]) {
    const selected = suites.filter((row) =>
      ["build", "skeleton", "console", "index", "resume"].includes(row.name),
    );
    const events = [];
    const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
      concurrency: 4,
      execute: async (row) => {
        events.push(`start:${row.name}`);
        if (row.name === "index")
          await new Promise((done) => setTimeout(done, 15));
        events.push(`end:${row.name}`);
        return {
          name: row.name,
          executed: true,
          exitCode: row.name === "index" ? indexExit : 0,
        };
      },
    });
    for (const name of ["skeleton", "console", "resume"]) {
      if (indexExit) {
        assert.ok(!events.includes(`start:${name}`));
        assert.equal(rows.find((row) => row.name === name).executed, false);
        assert.ok(rows.some((row) => row.exitCode !== 0));
      } else
        assert.ok(
          events.indexOf("end:index") < events.indexOf(`start:${name}`),
        );
    }
  }
});

test("failed split-case diagnostics survive aggregate evidence as addressed logs", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-case-output-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const selected = [{ name: "release" }];
  const tasks = [
    "release:prepare",
    "release:case:concurrent",
    "release:case:passing",
  ].map((name) => ({ name }));
  const rows = tasks.map(({ name }) => ({
    name,
    executed: true,
    exitCode: name.endsWith(":concurrent") ? 1 : 0,
    output: name.endsWith(":concurrent")
      ? "retained failure details\n"
      : "passing noise\n",
  }));
  recordGateChecks(repo, [
    {
      ...aggregateSuiteRows(selected, tasks, rows)[0],
      checkId: "suite:release",
      treeHash: "a".repeat(40),
      recordedAt: new Date().toISOString(),
    },
  ]);
  const [recorded] = readGateChecks(repo);
  assert.equal(recorded.exitCode, 1);
  const failed = recorded.cases.find((row) => row.name.endsWith(":concurrent"));
  assert.ok(failed.outputRef);
  assert.equal(
    readFileSync(join(repo, failed.outputRef), "utf8"),
    "retained failure details\n",
  );
  assert.ok(recorded.cases.every((row) => !Object.hasOwn(row, "output")));
  assert.ok(
    recorded.cases
      .filter((row) => row.exitCode === 0)
      .every((row) => !row.outputRef),
  );
});
test("product suites describe protection, machinery is separate and only release expands", () => {
  for (const row of suites) {
    assert.ok(row.protects?.length > 10, row.name);
    assert.ok(
      !row.protects.includes("validates its declared project surface"),
      row.name,
    );
  }
  const skeleton = suites.find((row) => row.name === "skeleton");
  assert.equal(skeleton.product, true);
  assert.equal(Boolean(skeleton.exclusive), false);
  for (const path of [
    "scripts/reactor-identity.mjs",
    "scripts/fixtures/historical-compiler-loader.mjs",
  ])
    assert.ok(skeleton.sources.includes(path));
  for (const row of suites.filter((row) => row.machinery))
    assert.ok(row.sources.length, row.name);
  const selected = suites.filter((row) => row.name !== "release");
  assert.deepEqual(
    expandSuiteTasks(selected, root).map((row) => row.name),
    selected.map((row) => row.name),
  );
  for (const name of ["harness-fixtures", "process-debt"])
    assert.equal(suites.find((row) => row.name === name).exclusive, true);
});
test("exclusive suites run alone and shared suites use remaining lane capacity", async () => {
  const selected = suites.filter((row) =>
    [
      "build",
      "skeleton",
      "console",
      "harness-fixtures",
      "process-debt",
    ].includes(row.name),
  );
  const active = new Map(),
    overlap = new Set();
  const rows = await scheduleSuites(expandSuiteTasks(selected, root), {
    concurrency: 4,
    execute: async (row) => {
      assert.equal(
        row.gateContext.loadClass,
        row.build || row.exclusive ? "isolated" : "shared",
      );
      assert.ok(
        [...active.values()].reduce((sum, slots) => sum + slots, 0) +
          row.gateContext.reservedSlots <=
          4,
      );
      if (["harness-fixtures", "process-debt"].includes(row.name)) {
        assert.equal(active.size, 0);
        assert.equal(row.gateContext.reservedSlots, 4);
        assert.equal(row.gateContext.concurrency, 1);
        assert.ok(
          !["harness-fixtures", "process-debt"].some((name) =>
            active.has(name),
          ),
        );
      }
      if (row.name === "skeleton") {
        assert.equal(row.priority, 80);
        assert.equal(row.gateContext.reservedSlots, 1);
        assert.equal(row.gateContext.concurrency, 4);
        assert.equal(row.gateContext.loadFactor, 8);
      }
      active.set(row.name, row.gateContext.reservedSlots);
      if (active.has("harness-fixtures") && active.has("process-debt"))
        overlap.add("hooks");
      if (active.has("harness-fixtures") && active.has("console:fixtures"))
        overlap.add("hook-light");
      if (active.has("skeleton") && active.has("console"))
        overlap.add("heavy-pair");
      await new Promise((done) => setTimeout(done, 10));
      active.delete(row.name);
      return { name: row.name, exitCode: 0, executed: true };
    },
  });
  assert.equal(rows.length, selected.length);
  assert.equal(overlap.has("hook-light"), false);
  assert.ok(overlap.has("heavy-pair"));
  assert.equal(overlap.has("hooks"), false);
  for (const concurrency of [1, 2, 4]) {
    await scheduleSuites(
      [
        barrier,
        { name: "running", command: ["fixture"], priority: 2 },
        {
          name: "exclusive",
          command: ["fixture"],
          exclusive: true,
          priority: 1,
        },
        { name: "later", command: ["fixture"] },
      ],
      {
        concurrency,
        execute: async (row) => {
          if (row.exclusive) assert.equal(active.size, 0);
          else assert.ok(!active.has("exclusive"));
          active.set(row.name, row.gateContext.reservedSlots);
          await new Promise((done) => setTimeout(done, 5));
          active.delete(row.name);
          return { name: row.name, exitCode: 0 };
        },
      },
    );
  }
});
test("test discovery refuses missing compiled cases instead of silently succeeding", () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-runner-"));
  try {
    assert.throws(
      () => expand(["packages/missing/dist/test/*.test.js"], repo),
      /Missing built test suite/,
    );
    mkdirSync(join(repo, "test"));
    writeFileSync(join(repo, "test/one.test.js"), "");
    assert.deepEqual(expand(["test/*.test.js"], repo), ["test/one.test.js"]);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
test("timeout is an executed failure with suite identity and measured duration", async () => {
  const row = await executeSuite(
    {
      name: "slow-fixture",
      command: [process.execPath, "-e", "setInterval(() => {}, 1000)"],
    },
    root,
    35,
  );
  assert.equal(row.executed, true);
  assert.notEqual(row.exitCode, 0);
  assert.ok(row.durationMs >= 35);
  assert.match(row.output, /Suite slow-fixture timed out/);
});

test("only and document CLI selection execute their declared checks with the projection build", async () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-runner-cli-"));
  try {
    const fixtureGitOptions = {
      exec: true,
      trim: false,

      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    };
    runGit(repo, ["init", "-q"], fixtureGitOptions);
    runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
    runGit(
      repo,
      ["config", "user.email", "fixture@example.invalid"],
      fixtureGitOptions,
    );
    writeFileSync(
      join(repo, ".gitignore"),
      "docs/control/local/\nobserved.jsonl\n",
    );
    mkdirSync(join(repo, "scripts"));
    const observer =
      'require("node:fs").appendFileSync("observed.jsonl", JSON.stringify(process.argv.slice(1))+"\\n");';
    // The stub list is the registration check's own input (WO-157 item 13).
    const { DOCUMENT_GATE_STUBS } =
      await import("./lib/document-gate-stubs.mjs");
    for (const file of DOCUMENT_GATE_STUBS) {
      const target = join(repo, "scripts", file);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(
        target,
        file.endsWith(".sh")
          ? "#!/usr/bin/env bash\nexec " +
              JSON.stringify(process.execPath) +
              " --input-type=module -e " +
              "'" +
              observer
                .replace('require("node:fs")', "fs")
                .replace(/^/, 'import fs from "node:fs";\n') +
              "'" +
              ' "$0" "$@"\n'
          : file.endsWith(".mjs")
            ? observer
                .replace('require("node:fs")', "fs")
                .replace(/^/, 'import fs from "node:fs";\n')
            : observer,
      );
    }
    mkdirSync(join(repo, "corpus/harness"), { recursive: true });
    writeFileSync(
      join(repo, "corpus/harness/wo101-id-corpus.test.mjs"),
      observer
        .replace('require("node:fs")', "fs")
        .replace(/^/, 'import fs from "node:fs";\n'),
    );
    for (const name of ["kernel", "skeleton", "console"]) {
      const directory = join(repo, `packages/${name}/dist/test`);
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, "fixture.test.js"), observer);
    }
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: { "format:check": "node scripts/format.cjs" },
      }),
    );
    runGit(repo, ["add", "."], fixtureGitOptions);
    runGit(repo, ["commit", "-qm", "Runner fixture"], fixtureGitOptions);
    assert.equal(
      (await runGate(["--only", "format", "--serial"], repo)).exitCode,
      0,
    );
    let observed = readFileSync(join(repo, "observed.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    assert.equal(observed.length, 1);
    assert.ok(observed[0][0].endsWith("format.cjs"));
    assert.equal((await runGate(["--document", "--serial"], repo)).exitCode, 0);
    observed = readFileSync(join(repo, "observed.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    const documentCount =
      suites.filter((row) => row.document).length +
      1 +
      suites
        .find((row) => row.name === "local-runner-double")
        .command.filter((part) => part.endsWith(".mjs")).length -
      1;
    assert.equal(observed.length, 1 + documentCount);
    assert.ok(observed.some((row) => row[0].includes("build")));
    assert.deepEqual(observed.at(-1).slice(1), ["check"]);
    const repeated = await runGate(["--document", "--serial"], repo);
    assert.equal(repeated.reusedSuites, 0, "each requested suite runs fresh");
    assert.equal(
      readFileSync(join(repo, "observed.jsonl"), "utf8").trim().split("\n")
        .length,
      1 + 2 * documentCount,
    );
    await assert.rejects(runGate(["--only", "unknown"], repo), /Unknown suite/);
    assert.deepEqual(
      activeGateRuns(repo),
      [],
      "normal and throwing runs release their markers",
    );
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

// An unclassified docs JSONL and an unstubbed document suite fail the document
// gate, not only the suite that enumerates them (WO-157 item 13, WO-151 D021).
test("WO-157 the document gate refuses an unregistered docs JSONL and an unstubbed document suite", (t) => {
  const row = suites.find((candidate) => candidate.name === "registrations");
  assert.ok(
    row?.document,
    "test:docs carries the registration row (WO-151 D021)",
  );
  const parent = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-registrations-")),
  );
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const copy = join(parent, "repository");
  execGit(["clone", "--quiet", "--shared", root, copy]);
  const listed = (...args) =>
    execGit(["-C", root, ...args], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean);
  for (const path of [
    ...listed("diff", "-z", "--name-only", "HEAD"),
    ...listed("ls-files", "-z", "--others", "--exclude-standard"),
  ])
    if (existsSync(join(root, path))) {
      mkdirSync(dirname(join(copy, path)), { recursive: true });
      cpSync(join(root, path), join(copy, path));
    } else rmSync(join(copy, path), { force: true });
  symlinkSync(join(root, "node_modules"), join(copy, "node_modules"));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key !== "DOTLN_LAUNCHPAD"),
  );
  const check = () =>
    spawnSync(process.execPath, [row.command[1]], {
      cwd: copy,
      encoding: "utf8",
      env,
    });
  const clean = check();
  assert.equal(clean.status, 0, clean.stdout + clean.stderr);
  // Untracked, as entropy-reducer.jsonl was during WO-151's own runs.
  writeFileSync(
    join(copy, "docs/evidence/wo157-planted.jsonl"),
    '{"planted":true}\n',
  );
  const planted = check();
  assert.equal(planted.status, 1);
  assert.match(
    planted.stderr,
    /unregistered JSONL: docs\/evidence\/wo157-planted\.jsonl is not an EventEnvelope stream/u,
  );
  rmSync(join(copy, "docs/evidence/wo157-planted.jsonl"));
  const registryBefore = readFileSync(
    join(copy, "packages/kernel/test/fixtures/jsonl-protocols.json"),
    "utf8",
  );
  mkdirSync(join(copy, "docs/evidence/WO-998"), { recursive: true });
  writeFileSync(join(copy, "docs/evidence/WO-998/raw.jsonl"), '{"raw":true}\n');
  const declaration = join(copy, "docs/evidence/WO-998/jsonl.json");
  writeFileSync(
    declaration,
    JSON.stringify({
      schemaVersion: 1,
      nonEventPaths: {
        "raw.jsonl": "Evidence projection, not an EventEnvelope",
      },
    }),
  );
  const declared = check();
  assert.equal(declared.status, 0, declared.stderr);
  assert.equal(
    readFileSync(
      join(copy, "packages/kernel/test/fixtures/jsonl-protocols.json"),
      "utf8",
    ),
    registryBefore,
  );
  writeFileSync(
    declaration,
    JSON.stringify({
      schemaVersion: 1,
      nonEventPaths: { "../../control/orders/WO-160.jsonl": "escape" },
    }),
  );
  assert.match(check().stderr, /Invalid evidence JSONL target/);
  writeFileSync(
    declaration,
    JSON.stringify({ schemaVersion: 1, nonEventPaths: { "raw.jsonl": "" } }),
  );
  assert.match(check().stderr, /Invalid evidence JSONL target/);
  rmSync(join(copy, "docs/evidence/WO-998"), { recursive: true });
  const stubs = join(copy, "scripts/lib/document-gate-stubs.mjs");
  writeFileSync(
    stubs,
    readFileSync(stubs, "utf8").replace(/^\s*"entropy\.mjs",\n/mu, ""),
  );
  const unstubbed = check();
  assert.equal(unstubbed.status, 1);
  assert.match(
    unstubbed.stderr,
    /unstubbed document suite: entropy runs scripts\/entropy\.mjs/u,
  );
});

test("WO-125 nested gate markers remain independent and local to their worktree", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-markers-"));
  const other = mkdtempSync(join(tmpdir(), "dotln-gate-other-"));
  t.after(() => {
    rmSync(repo, { recursive: true, force: true });
    rmSync(other, { recursive: true, force: true });
  });
  const first = beginGateRun(repo, "outer evidence fixture");
  const second = beginGateRun(repo, "inner runner fixture");
  try {
    assert.equal(activeGateRuns(repo).length, 2);
    assert.deepEqual(activeGateRuns(other), []);
    first.release();
    assert.deepEqual(
      activeGateRuns(repo).map((run) => run.runId),
      [second.run.runId],
    );
  } finally {
    first.release();
    second.release();
  }
  assert.deepEqual(activeGateRuns(repo), []);
});

test("WO-044 a stop request reaches a gate through its marker lineage and is consumed with the marker", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-stop-"));
  const markers = join(repo, "docs/control/local/harness/active-gates");
  const saved = process.env[GATE_RUN_ENVIRONMENT];
  t.after(() => {
    if (saved === undefined) delete process.env[GATE_RUN_ENVIRONMENT];
    else process.env[GATE_RUN_ENVIRONMENT] = saved;
    rmSync(repo, { recursive: true, force: true });
  });
  delete process.env[GATE_RUN_ENVIRONMENT];
  const idle = requestGateStop(repo, { waitMs: 0 });
  assert.deepEqual(idle, {
    contract: "gate-stop-v1",
    requestedAt: idle.requestedAt,
    requested: [],
    stopped: [],
    active: [],
  });
  assert.ok(Number.isFinite(Date.parse(idle.requestedAt)));
  // A stale request left by a dead run is swept, never honoured by a new run.
  mkdirSync(markers, { recursive: true });
  const stale = "00000000-0000-4000-8000-000000000000";
  writeFileSync(join(markers, `${stale}.stop`), "{}\n");
  requestGateStop(repo, { waitMs: 0 });
  assert.equal(existsSync(join(markers, `${stale}.stop`)), false);
  const outer = beginGateRun(repo, "outer evidence fixture");
  assert.deepEqual(gateRunLineage(), [outer.run.runId]);
  const inner = beginGateRun(repo, "inner runner fixture");
  assert.deepEqual(gateRunLineage(), [outer.run.runId, inner.run.runId]);
  try {
    assert.equal(outer.stopRequested(), false);
    assert.equal(inner.stopRequested(), false);
    // This process owns both runs, so they stay active for the bounded wait;
    // each carries a request afterwards and reads it at its next boundary.
    const outcome = requestGateStop(repo, { waitMs: 0 });
    assert.deepEqual(
      outcome.requested.map((run) => run.runId).sort(),
      [outer.run.runId, inner.run.runId].sort(),
    );
    assert.deepEqual(outcome.stopped, []);
    assert.equal(outcome.active.length, 2);
    assert.ok(
      outcome.active.every(
        (run) => run.pid === process.pid && run.command && run.startedAt,
      ),
    );
    assert.equal(outer.stopRequested(), true);
    assert.equal(inner.stopRequested(), true);
    assert.deepEqual(gateStopRequested(repo, [inner.run.runId]), [
      inner.run.runId,
    ]);
    // A child of the inner run inherits both ids and sees the request.
    const child = spawn(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import {gateStopRequested} from ${JSON.stringify(resolve(root, "scripts/lib/gate-evidence.mjs"))}; process.stdout.write(JSON.stringify(gateStopRequested(process.cwd())));`,
      ],
      { cwd: repo, stdio: ["ignore", "pipe", "pipe"] },
    );
    let stdout = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    await new Promise((resolveExit) => child.once("close", resolveExit));
    assert.deepEqual(
      JSON.parse(stdout).sort(),
      [outer.run.runId, inner.run.runId].sort(),
    );
  } finally {
    inner.release();
    outer.release();
  }
  assert.deepEqual(gateRunLineage(), []);
  assert.equal(process.env[GATE_RUN_ENVIRONMENT], undefined);
  assert.deepEqual(
    readdirSync(markers).filter((name) => /\.(?:json|stop)$/.test(name)),
    [],
    "release removes the marker and its consumed request",
  );
});

test("WO-044 a gate that polls its request ends within the stop command's wait and leaves nothing behind", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-stop-child-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const markers = join(repo, "docs/control/local/harness/active-gates");
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import {beginGateRun} from ${JSON.stringify(resolve(root, "scripts/lib/gate-evidence.mjs"))}; const active = beginGateRun(process.cwd(), "polling gate fixture"); process.stdout.write("ready"); const timer = setInterval(() => { if (active.stopRequested()) { clearInterval(timer); active.release(); process.exit(0); } }, 50);`,
    ],
    { cwd: repo, stdio: ["ignore", "pipe", "pipe"] },
  );
  const exited = new Promise((resolveExit) => child.once("close", resolveExit));
  await new Promise((resolveReady, reject) => {
    child.stdout.once("data", resolveReady);
    child.once("error", reject);
    child.once("exit", () => reject(new Error("gate exited before ready")));
  });
  assert.equal(activeGateRuns(repo).length, 1);
  const outcome = requestGateStop(repo, { waitMs: 10_000 });
  assert.equal(outcome.requested.length, 1);
  assert.equal(outcome.requested[0].pid, child.pid);
  assert.deepEqual(outcome.stopped, outcome.requested);
  assert.deepEqual(outcome.active, []);
  assert.equal(await exited, 0);
  assert.deepEqual(activeGateRuns(repo), []);
  assert.deepEqual(
    readdirSync(markers).filter((name) => /\.(?:json|stop)$/.test(name)),
    [],
  );
});

test("WO-044 the runner honours a stop request at its next boundary, ends running suites and records no check", async () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-runner-stop-"));
  try {
    const fixtureGitOptions = {
      exec: true,
      trim: false,

      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    };
    runGit(repo, ["init", "-q"], fixtureGitOptions);
    runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
    runGit(
      repo,
      ["config", "user.email", "fixture@example.invalid"],
      fixtureGitOptions,
    );
    writeFileSync(
      join(repo, ".gitignore"),
      "docs/control/local/\nobserved.jsonl\n",
    );
    mkdirSync(join(repo, "scripts"));
    // The suite announces itself, then stays resident long enough for the
    // runner's poll to end it; a run to completion would take five seconds.
    writeFileSync(
      join(repo, "scripts/format.cjs"),
      'require("node:fs").appendFileSync("observed.jsonl", "format\\n"); setTimeout(() => {}, 5000);',
    );
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: { "format:check": "node scripts/format.cjs" },
      }),
    );
    runGit(repo, ["add", "."], fixtureGitOptions);
    runGit(repo, ["commit", "-qm", "Runner stop fixture"], fixtureGitOptions);
    // A request already present ends the gate before its first suite.
    await assert.rejects(
      runGate(["--only", "format", "--serial"], repo, {
        stopRequested: () => true,
      }),
      /^Error: Gate stopped by request after [\d.]+ s; no check recorded for tree [a-f0-9]{40,64}$/,
    );
    assert.equal(existsSync(join(repo, "observed.jsonl")), false);
    assert.deepEqual(readGateChecks(repo), []);
    assert.deepEqual(activeGateRuns(repo), []);
    // A request that arrives while a suite runs ends that suite through the
    // runner's own abort signal; the suite reports the stop, not a pass.
    const started = Date.now();
    await assert.rejects(
      runGate(["--only", "format", "--serial"], repo, {
        stopRequested: () => existsSync(join(repo, "observed.jsonl")),
      }),
      /Gate stopped by request/,
    );
    assert.ok(
      Date.now() - started < 4000,
      "the resident suite was ended, not awaited",
    );
    assert.equal(
      readFileSync(join(repo, "observed.jsonl"), "utf8"),
      "format\n",
    );
    assert.deepEqual(readGateChecks(repo), []);
    assert.deepEqual(activeGateRuns(repo), []);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("WO-044 an aborted signal ends a running suite and its result names the stop", async () => {
  const controller = new AbortController();
  const started = Date.now();
  setTimeout(() => controller.abort(), 200);
  const result = await executeSuite(
    {
      name: "resident",
      command: [
        process.execPath,
        "-e",
        'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000);',
      ],
    },
    root,
    60_000,
    () => {},
    controller.signal,
  );
  assert.equal(result.exitCode, 1);
  assert.equal(result.stopped, true);
  assert.match(result.output, /Suite resident stopped by gate request/);
  assert.ok(
    Date.now() - started < 10_000,
    "SIGKILL follows an ignored SIGTERM",
  );
  const already = await executeSuite(
    {
      name: "never",
      command: [process.execPath, "-e", "setInterval(() => {}, 1000)"],
    },
    root,
    60_000,
    () => {},
    AbortSignal.abort(),
  );
  assert.equal(already.stopped, true);
  assert.equal(already.exitCode, 1);
});

test("WO-044 VER-001 cancellation ends a grandchild holding inherited output pipes", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-suite-descendants-"));
  let descendant;
  t.after(() => {
    if (descendant)
      try {
        process.kill(descendant, "SIGKILL");
      } catch {}
    rmSync(repo, { recursive: true, force: true });
  });
  const controller = new AbortController();
  const running = executeSuite(
    {
      name: "descendants",
      command: [
        process.execPath,
        "-e",
        `
    const {spawn} = require('node:child_process');
    const child = spawn(process.execPath, ['-e', 'process.on("SIGTERM",()=>{});require("node:fs").writeFileSync("ready", "yes");setInterval(()=>{},1000)'], {stdio:'inherit'});
    require('node:fs').writeFileSync('descendant.pid', String(child.pid));
    setInterval(()=>{},1000);
  `,
      ],
    },
    repo,
    10000,
    () => {},
    controller.signal,
  );
  for (let i = 0; i < 100 && !existsSync(join(repo, "ready")); i++)
    await new Promise((resolve) => setTimeout(resolve, 20));
  descendant = Number(readFileSync(join(repo, "descendant.pid"), "utf8"));
  const started = Date.now();
  controller.abort();
  const result = await running;
  assert.equal(result.stopped, true);
  assert.equal(result.exitCode, 1);
  assert.ok(
    Date.now() - started < 2500,
    "inherited descriptors cannot hang cancellation",
  );
});

test("WO-125 gate inputs include tracked ignored files and new installed roots, excluding scratch", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-inputs-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\nnode_modules/\ndist/\n");
  writeFileSync(join(repo, "scratch/retained.txt"), "tracked\n");
  execGit(["add", "-f", "scratch/retained.txt"], { cwd: repo });
  assert.equal(gateInputPath(repo, "scratch/new.txt"), false);
  assert.equal(gateInputPath(repo, "scratch/retained.txt"), true);
  assert.equal(gateInputPath(repo, "new-source.ts"), true);
  assert.equal(
    gateInputPath(repo, "node_modules/new-dependency/index.js"),
    true,
  );
  assert.equal(gateInputPath(repo, "packages/new-package/dist/index.js"), true);
});

test("WO-125 VER-002 installed input case aliases include prospective roots", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-case-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "node_modules"));
  mkdirSync(join(repo, "packages/skeleton/dist"), { recursive: true });
  mkdirSync(join(repo, "packages/future"));
  writeFileSync(join(repo, ".gitignore"), "node_modules/\ndist/\n");
  if (!existsSync(join(repo, "NODE_MODULES"))) {
    t.skip("requires a case-insensitive filesystem");
    return;
  }
  for (const path of [
    "NODE_MODULES/probe.js",
    "Node_Modules/probe.js",
    "Packages/skeleton/dist/probe.js",
    "packages/skeleton/DIST/probe.js",
    "packages/future/DIST/probe.js",
  ])
    assert.equal(gateInputPath(repo, path), true, path);
});

test("WO-125 VER-002 resolves dangling links and physical parent traversal", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-symlink-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  mkdirSync(join(repo, "packages/skeleton"), { recursive: true });
  writeFileSync(join(repo, ".gitignore"), "scratch/\n");
  symlinkSync("../new-input.md", join(repo, "scratch/dangling.md"));
  symlinkSync("dangling.md", join(repo, "scratch/chained.md"));
  symlinkSync("../packages/skeleton", join(repo, "scratch/dirlink"));
  symlinkSync("dirlink/../linked.md", join(repo, "scratch/parent.md"));
  for (const path of [
    "scratch/dangling.md",
    "scratch/chained.md",
    "scratch/parent.md",
    "scratch/dirlink/../probe-new.md",
    "scratch/dirlink/../../new-input.md",
  ])
    assert.equal(gateInputPath(repo, path), true, path);
  symlinkSync("new-scratch.md", join(repo, "scratch/local.md"));
  symlinkSync(".", join(repo, "scratch/local-dir"));
  assert.equal(gateInputPath(repo, "scratch/local.md"), false);
  assert.equal(gateInputPath(repo, "scratch/local-dir/new.md"), false);
  symlinkSync("cycle.md", join(repo, "scratch/cycle.md"));
  assert.throws(() => gateInputPath(repo, "scratch/cycle.md"));
});

test("WO-125 VER-003 protects pre-existing hard links while ordinary scratch stays writable", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-gate-hardlink-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\n");
  writeFileSync(join(repo, "input.ts"), "export const value = 1;\n");
  execGit(["add", "input.ts"], { cwd: repo });
  linkSync(join(repo, "input.ts"), join(repo, "scratch/input-link.ts"));
  symlinkSync("input-link.ts", join(repo, "scratch/via-symlink.ts"));
  for (const path of ["scratch/input-link.ts", "scratch/via-symlink.ts"])
    assert.equal(gateInputPath(repo, path), true, path);

  writeFileSync(join(repo, "scratch/local.txt"), "scratch\n");
  assert.equal(gateInputPath(repo, "scratch/local.txt"), false);
  assert.equal(gateInputPath(repo, "scratch/new.txt"), false);
  assert.equal(gateInputPath(repo, "scratch"), false);
  linkSync(
    join(repo, "scratch/local.txt"),
    join(repo, "scratch/local-link.txt"),
  );
  assert.equal(gateInputPath(repo, "scratch/local-link.txt"), true);
});

test("release cases use concurrent lanes, wait for preparation and require complete coverage", async () => {
  const selected = [barrier, suites.find((row) => row.name === "release")];
  const tasks = expandSuiteTasks(selected, root, "/synthetic-template");
  assert.equal(
    tasks.filter((row) => row.name.startsWith("release:case:")).length,
    (await import("./lib/release-fixtures.mjs")).releaseCases(root).length,
  );
  let active = 0,
    activeCases = 0,
    peak = 0,
    prepared = false;
  const rows = await scheduleSuites(tasks, {
    concurrency: 4,
    execute: async (row) => {
      if (row.name.startsWith("release:case:")) {
        assert.ok(prepared);
        activeCases++;
      }
      peak = Math.max(peak, ++active);
      await new Promise((done) => setTimeout(done, 1));
      active--;
      if (row.name.startsWith("release:case:")) activeCases--;
      if (row.name === "release:prepare") prepared = true;
      return { name: row.name, exitCode: 0, executed: true, durationMs: 1 };
    },
  });
  assert.ok(peak >= 2);
  assert.equal(aggregateSuiteRows(selected, tasks, rows)[1].exitCode, 0);
  assert.equal(
    aggregateSuiteRows(selected, tasks, rows.slice(0, -1))[1].exitCode,
    1,
  );
  assert.equal(
    aggregateSuiteRows(selected, tasks, [...rows, rows.at(-1)])[1].exitCode,
    1,
  );
  const refused = await scheduleSuites(tasks, {
    execute: async (row) => ({
      name: row.name,
      exitCode: row.name === "release:prepare" ? 1 : 0,
      executed: true,
    }),
  });
  assert.equal(
    refused.filter(
      (row) => row.name.startsWith("release:case:") && row.executed,
    ).length,
    0,
  );
  assert.equal(aggregateSuiteRows(selected, tasks, refused)[1].exitCode, 1);
});

test("console product and document selections execute every test exactly once", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-console-dispatch-"));
  execGit(["init", "-q"], { cwd: repo });
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const directory = join(repo, "packages/console/dist/test");
  mkdirSync(directory, { recursive: true });
  const names = [
    "WO-032 AC1/6 fixture",
    "WO-032 schema fixture",
    "[document] WO-032 host collection reads current sources and all shipped exports",
  ];
  writeFileSync(
    join(directory, "board.test.js"),
    `const test = require('node:test');\n${names
      .map((name) => `test(${JSON.stringify(name)}, () => {});`)
      .join("\n")}\n`,
  );
  const tasks = expandSuiteTasks(
    suites.filter((row) => ["console", "console-docs"].includes(row.name)),
    repo,
  );
  const observed = [];
  for (const [index, row] of tasks.entries()) {
    const result = await executeSuite(row, repo);
    assert.equal(result.exitCode, 0, result.output);
    const executed = [...result.output.matchAll(/^ok \d+ - (.+)$/gm)]
      .map((match) => match[1])
      .filter((name) => !name.includes(" # SKIP"));
    assert.deepEqual(
      executed,
      names.filter(
        (name) => row.name.endsWith("-docs") === name.includes("[document]"),
      ),
    );
    observed.push(...executed);
  }
  assert.deepEqual(observed, names);
});

test("planning task dispatch delivers each selection flag to the executable", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-plan-dispatch-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  writeFileSync(
    join(repo, "scripts/test-plan-refutation.mjs"),
    "console.log(JSON.stringify(process.argv.slice(2)));\n",
  );
  const tasks = expandSuiteTasks(
    [suites.find((row) => row.name === "plan-refutation")],
    repo,
  );
  assert.equal(tasks.length, 1);
  for (const [index, flag] of ["--fixtures-only"].entries()) {
    const result = await executeSuite(tasks[index], repo);
    assert.equal(result.exitCode, 0);
    assert.deepEqual(JSON.parse(result.output), [flag]);
  }
});

test("live progress arrives before a running process completes and remains bounded", async () => {
  const observed = [];
  let finished = false;
  let observeStarted;
  const started = new Promise((done) => {
    observeStarted = done;
  });
  const running = executeSuite(
    {
      name: "progress",
      command: [
        process.execPath,
        "-e",
        'console.log("PROGRESS fixture begun   "); setTimeout(() => console.log("done"), 100);',
      ],
    },
    root,
    1000,
    (row) => {
      observed.push(row);
      assert.equal(finished, false);
      if (row.message === "PROGRESS fixture begun") observeStarted();
    },
  );
  await Promise.race([started, running]);
  assert.ok(observed.some((row) => row.message === "PROGRESS fixture begun"));
  const result = await running;
  finished = true;
  assert.equal(result.exitCode, 0);
  assert.ok(Date.parse(result.finishedAt) >= Date.parse(result.startedAt));
  const lots = [];
  await executeSuite(
    {
      name: "bounded",
      command: [
        process.execPath,
        "-e",
        'for(let i=0;i<100;i++) console.log("PROGRESS "+"x".repeat(500));',
      ],
    },
    root,
    1000,
    (row) => lots.push(row),
  );
  assert.equal(lots.length, 81);
  assert.ok(lots.every((row) => row.message.length <= 200));
});

test("code identity follows tracked source and dependency bytes across processes and revisions", () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-code-identity-"));
  const fixtureGitOptions = { encoding: "utf8" };
  try {
    execGit(["-C", repo, "init", "-q"], fixtureGitOptions);
    // As in confinementFixture, no detached maintenance may race teardown.
    execGit(
      ["-C", repo, "config", "maintenance.auto", "false"],
      fixtureGitOptions,
    );
    execGit(["-C", repo, "config", "user.name", "Fixture"], fixtureGitOptions);
    execGit(
      ["-C", repo, "config", "user.email", "fixture@example.invalid"],
      fixtureGitOptions,
    );
    mkdirSync(join(repo, "docs"));
    writeFileSync(
      join(repo, ".gitattributes"),
      "projection.js dotln-generated\nlib/README.md dotln-documentation\n",
    );
    writeFileSync(join(repo, "source.js"), "export const result = 1;\n");
    writeFileSync(join(repo, "projection.js"), "generated one\n");
    writeFileSync(join(repo, "docs/report.md"), "report one\n");
    // A README Git marks dotln-documentation is documentation; an unmarked
    // README and a Markdown file a test could read as an input are not
    // (WO-115 D026).
    mkdirSync(join(repo, "lib/other"), { recursive: true });
    writeFileSync(join(repo, "lib/README.md"), "readme one\n");
    writeFileSync(join(repo, "lib/other/README.md"), "input readme one\n");
    writeFileSync(join(repo, "lib/fixture.md"), "fixture one\n");
    writeFileSync(
      join(repo, "package.json"),
      '{"private":true,"dependencies":{"fixture":"1.0.0"}}\n',
    );
    execGit(["-C", repo, "add", "."], fixtureGitOptions);
    execGit(["-C", repo, "commit", "-qm", "fixture"], fixtureGitOptions);
    const code = gateCodeIdentity(repo),
      tree = gateTreeHash(repo);
    assert.equal(gateCodeIdentity(repo, "HEAD"), code);
    recordGateChecks(repo, [
      {
        checkId: "npm test",
        codeIdentity: code,
        treeHash: tree,
        subject: tree,
        executed: true,
        exitCode: 0,
        durationMs: 1,
        evidenceRef: "fixture:executed",
        recordedAt: new Date().toISOString(),
      },
    ]);
    writeFileSync(join(repo, "docs/report.md"), "report after gate\n");
    writeFileSync(join(repo, "projection.js"), "generated two\n");
    writeFileSync(join(repo, "lib/README.md"), "readme after gate\n");
    assert.notEqual(gateTreeHash(repo), tree);
    assert.equal(gateCodeIdentity(repo), code);
    writeFileSync(join(repo, "lib/fixture.md"), "fixture two\n");
    assert.notEqual(gateCodeIdentity(repo), code, "a Markdown input counts");
    writeFileSync(join(repo, "lib/fixture.md"), "fixture one\n");
    assert.equal(gateCodeIdentity(repo), code);
    writeFileSync(join(repo, "lib/other/README.md"), "input readme two\n");
    assert.notEqual(gateCodeIdentity(repo), code, "an unmarked README counts");
    writeFileSync(join(repo, "lib/other/README.md"), "input readme one\n");
    assert.equal(gateCodeIdentity(repo), code);
    const module = new URL("./lib/gate-evidence.mjs", import.meta.url).href;
    const command = `import {gateCodeIdentity,findGateCheck} from ${JSON.stringify(module)}; const root=process.argv[1]; console.log(JSON.stringify({code:gateCodeIdentity(root),found:Boolean(findGateCheck(root,"npm test","different-tree"))}));`;
    const readback = JSON.parse(
      execFileSync(
        "bash",
        [
          "-c",
          'exec "$1" --input-type=module -e "$2" "$3"',
          "code-identity",
          process.execPath,
          command,
          repo,
        ],
        { encoding: "utf8" },
      ),
    );
    assert.deepEqual(readback, { code, found: true });
    writeFileSync(join(repo, "source.js"), "export const result = 2;\n");
    assert.notEqual(gateCodeIdentity(repo), code);
    assert.equal(findGateCheck(repo, "npm test", tree), undefined);
    writeFileSync(join(repo, "source.js"), "export const result = 1;\n");
    writeFileSync(
      join(repo, "package.json"),
      '{"private":true,"dependencies":{"fixture":"2.0.0"}}\n',
    );
    assert.notEqual(gateCodeIdentity(repo), code);
    execGit(["-C", repo, "add", "."], fixtureGitOptions);
    execGit(
      ["-C", repo, "commit", "-qm", "dependency update"],
      fixtureGitOptions,
    );
    assert.equal(gateCodeIdentity(repo, "HEAD"), gateCodeIdentity(repo));
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

// A fake marker and an owned denied directory stand in for a harness sandbox,
// so the preflight runs the same in and outside a real one (WO-140).
const confinementFixture = (t) => {
  // Under a gate the root carries the run's tag, which the gate's own
  // abandoned-root check judges (WO-157 item 15).
  const tag = process.env.DOTLN_GATE_FIXTURE_TAG;
  const repo = mkdtempSync(
    join(
      tmpdir(),
      tag ? `dotln-host-confinement-${tag}-` : "dotln-host-confinement-",
    ),
  );
  const denied = join(repo, "denied");
  t.after(() => {
    chmodSync(denied, 0o755);
    rmSync(repo, { recursive: true, force: true });
  });
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  runGit(repo, ["init", "-q"], fixtureGitOptions);
  // Every commit otherwise starts Git's detached automatic maintenance. Git
  // 2.55 estimates loose objects from objects/17 alone, so two there made a
  // fixture commit start a geometric repack still writing .git/objects/pack
  // when the teardown removed the tree (ENOTEMPTY; WO-063 D005, WO-157). The
  // fixture has no maintenance to exercise.
  runGit(repo, ["config", "maintenance.auto", "false"], fixtureGitOptions);
  runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    repo,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nobserved.jsonl\ndenied/\n",
  );
  mkdirSync(join(repo, "scripts"));
  mkdirSync(denied);
  for (const name of ["build", "alpha", "outside"])
    writeFileSync(
      join(repo, `scripts/${name}.mjs`),
      `import fs from "node:fs";\nfs.appendFileSync("observed.jsonl", ${JSON.stringify(`${name}\n`)});\n`,
    );
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(
    repo,
    ["commit", "-qm", "Host-confinement fixture"],
    fixtureGitOptions,
  );
  const row = (name, options = {}) => ({
    name,
    command: [process.execPath, `scripts/${name}.mjs`],
    product: true,
    ...options,
  });
  return {
    repo,
    options: (mode) => {
      chmodSync(denied, mode);
      return {
        table: [
          row("build", { build: true }),
          row("alpha"),
          row("outside", { needs: OUTSIDE_CONFINEMENT }),
        ],
        sandbox: {
          env: { DOTLN_FIXTURE_SANDBOX: "1" },
          markers: [
            {
              id: "fixture-harness",
              env: "DOTLN_FIXTURE_SANDBOX",
              deniedDirectory: () => denied,
            },
          ],
        },
      };
    },
    observed: () =>
      existsSync(join(repo, "observed.jsonl"))
        ? readFileSync(join(repo, "observed.jsonl"), "utf8").trim().split("\n")
        : [],
    denied,
  };
};

test("WO-140 the real inventory declares only the suites with an environmental outside-only cause", () => {
  // Native skeleton/portfolio/vertical cases nest `sandbox-exec`, which an outer
  // Seatbelt sandbox refuses. Browser evidence owns a Chromium process and
  // loopback servers; the native discovery profile denies that network access.
  assert.deepEqual(
    suites.filter((row) => row.needs).map((row) => [row.name, row.needs]),
    [
      ["vertical", OUTSIDE_CONFINEMENT],
      ["skeleton", OUTSIDE_CONFINEMENT],
      ["browser-evidence", OUTSIDE_CONFINEMENT],
      ["skeleton-docs", OUTSIDE_CONFINEMENT],
      ["portfolio", OUTSIDE_CONFINEMENT],
    ],
  );
  // A defect in a release case, found in WO-121's verification, was never a
  // reason for the release suite to declare a need.
  assert.equal(suites.find((row) => row.name === "release").needs, undefined);
  assert.throws(
    () =>
      validateSuites([barrier, { name: "x", command: ["x"], needs: "gpu" }]),
    /Unknown suite need/,
  );
  assert.deepEqual(detectHostConfinement(root, { env: {} }), {
    marker: null,
    inForce: false,
  });
});

test("WO-140 a sandbox in force refuses before any suite runs and names the suites and the outside command", async (t) => {
  const fixture = confinementFixture(t);
  const inForce = fixture.options(0o555);
  await assert.rejects(
    runGate(["--serial"], fixture.repo, inForce),
    (error) => {
      assert.match(error.message, /^Refused before any suite ran/);
      assert.match(
        error.message,
        /carries the fixture-harness marker and a write to \S+denied is denied \(EACCES\), so it is confined by the host/,
      );
      assert.match(error.message, /outside needs the outside/);
      assert.match(
        error.message,
        /Run outside host confinement: npm test -- --serial\./,
      );
      assert.match(
        error.message,
        /evidence: npm test -- --serial --confined-partial$/,
      );
      return true;
    },
  );
  await assert.rejects(
    runGate(["--only", "outside"], fixture.repo, inForce),
    /Run outside host confinement: npm test -- --only outside\.$/,
  );
  await assert.rejects(
    runGate(["--only", "outside", "--confined-partial"], fixture.repo, inForce),
    /Nothing remains to run while confined: outside needs the outside/,
  );
  assert.deepEqual(fixture.observed(), [], "neither the build nor a suite ran");
  assert.deepEqual(
    readGateChecks(fixture.repo),
    [],
    "a refusal records no check",
  );
  assert.deepEqual(activeGateRuns(fixture.repo), []);
  // A selection that needs nothing from the outside runs as before.
  const only = await runGate(
    ["--only", "alpha", "--serial"],
    fixture.repo,
    inForce,
  );
  assert.equal(only.exitCode, 0);
  assert.equal(only.sandbox, undefined, "no probe is paid for that selection");
  assert.deepEqual(fixture.observed(), ["alpha"]);
});

test("WO-140 an inherited marker whose denied-write probe succeeds does not refuse and leaves no probe behind", async (t) => {
  const fixture = confinementFixture(t);
  const check = await runGate(
    ["--serial"],
    fixture.repo,
    fixture.options(0o755),
  );
  assert.equal(check.exitCode, 0);
  assert.equal(check.checkId, "npm test");
  assert.equal(check.partial, undefined);
  assert.deepEqual(check.requiredSuites, ["build", "alpha", "outside"]);
  assert.deepEqual(check.sandbox, {
    marker: "fixture-harness",
    probe: { path: fixture.denied, denied: false, code: "written" },
    inForce: false,
  });
  assert.deepEqual(readdirSync(fixture.denied), []);
  assert.deepEqual(fixture.observed(), ["build", "alpha", "outside"]);
  // No marker at all is today's behavior: no probe and no sandbox field.
  // The first run's row would be reused at this code identity (WO-173), so
  // the second run says --again to run the selection.
  const plain = await runGate(["--serial", "--again"], fixture.repo, {
    ...fixture.options(0o555),
    sandbox: { env: {}, markers: fixture.options(0o555).sandbox.markers },
  });
  assert.equal(plain.checkId, "npm test");
  assert.equal(plain.sandbox, undefined);
});

test("WO-140 a confined partial row is rejected by every product-gate consumer at the code identity where a full row is accepted", async (t) => {
  const fixture = confinementFixture(t);
  const { repo } = fixture;
  const partial = await runGate(
    ["--confined-partial", "--serial"],
    repo,
    fixture.options(0o555),
  );
  assert.equal(partial.exitCode, 0);
  // CLI spelling changes, recorded identities and selections do not (WO-161).
  assert.equal(CONFINED_PARTIAL_CHECK, "npm test -- --inside-sandbox");
  assert.equal(OUTSIDE_CONFINEMENT, "outside-sandbox");
  assert.equal(partial.checkId, CONFINED_PARTIAL_CHECK);
  assert.equal(partial.partial, true);
  assert.deepEqual(partial.excludedSuites, ["outside"]);
  assert.deepEqual(partial.requiredSuites, ["build", "alpha"]);
  assert.equal(partial.sandbox.inForce, true);
  assert.equal(partial.evidenceRef.endsWith(CONFINED_PARTIAL_CHECK), true);
  assert.deepEqual(fixture.observed(), ["build", "alpha"]);
  const recorded = readGateChecks(repo);
  assert.deepEqual(
    recorded.map((row) => [row.checkId, row.excludedSuites]),
    [[CONFINED_PARTIAL_CHECK, ["outside"]]],
    "recorded under the distinct identity and never under npm test",
  );
  const code = gateCodeIdentity(repo);
  assert.equal(partial.codeIdentity, code);

  // Consumer 1: the gate lookup, also against a partial row mislabelled npm test.
  assert.equal(findGateCheck(repo, "npm test", gateTreeHash(repo)), undefined);
  const { partial: flag, ...mislabelled } = {
    ...recorded[0],
    checkId: "npm test",
  };
  assert.equal(flag, true);
  recordGateChecks(repo, [mislabelled]);
  assert.equal(
    findGateCheck(repo, "npm test", gateTreeHash(repo)),
    undefined,
    "the exclusions alone mark a partial result",
  );

  // Consumer 2: the lifecycle transition carries no product gate.
  const { requireLifecycleEvidence } =
    await import("./lib/lifecycle-evidence.mjs");
  const warn = console.warn;
  console.warn = () => {};
  t.after(() => (console.warn = warn));
  const refused = await requireLifecycleEvidence(
    repo,
    "final-review-result",
    "pass",
    "WO-999",
  );
  assert.equal(refused.productGate, undefined);
  assert.ok(
    refused.advisories.some((row) => /No passing product gate/.test(row)),
  );

  // Consumers 3 and 4: pull-request publication and release close both read
  // the committed reviewer observation through reviewedProductGate.
  const { reviewedProductGate } = await import("./lib/release-records.mjs");
  const fixtureGitOptions = {
    exec: true,
    trim: false,

    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  mkdirSync(join(repo, "docs/control/orders"), { recursive: true });
  const review = (productGate) => {
    const base = { schemaVersion: 1, workOrderId: "WO-999" };
    writeFileSync(
      join(repo, "docs/control/orders/WO-999.jsonl"),
      [
        {
          ...base,
          recordedAt: "2026-09-20T00:00:01.000Z",
          type: "WorkOrderActivated",
          workOrderPath: "docs/work-orders/WO-999-fixture.md",
        },
        {
          ...base,
          recordedAt: "2026-09-20T00:00:02.000Z",
          type: "FinalReviewCompleted",
          verdict: "pass",
          finalReviewId: "FINAL-001",
          reportPath: "docs/final-reviews/WO-999/FINAL-001.md",
          evidence: { productGate },
        },
      ]
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    runGit(repo, ["add", "docs/control/orders"], fixtureGitOptions);
    runGit(repo, ["commit", "-qm", "Reviewer observation"], fixtureGitOptions);
  };
  for (const row of [
    recorded[0],
    mislabelled,
    { ...recorded[0], checkId: "npm test" },
  ]) {
    review(row);
    assert.throws(
      () => reviewedProductGate(repo, "WO-999"),
      /no recorded passing reviewer npm test row/,
    );
  }

  // The full gate at the same code identity is still accepted by all four.
  const full = await runGate(["--serial"], repo, fixture.options(0o755));
  assert.equal(full.exitCode, 0);
  assert.equal(full.checkId, "npm test");
  assert.equal(full.codeIdentity, code, "reports and control moved no code");
  assert.equal(
    findGateCheck(repo, "npm test", gateTreeHash(repo)).evidenceRef,
    full.evidenceRef,
  );
  const accepted = await requireLifecycleEvidence(
    repo,
    "final-review-result",
    "pass",
    "WO-999",
  );
  assert.equal(accepted.productGate.checkId, "npm test");
  assert.equal(accepted.productGate.codeIdentity, code);
  review(accepted.productGate);
  assert.equal(
    reviewedProductGate(repo, "WO-999").evidenceRef,
    full.evidenceRef,
  );

  // A review recorded without a gate (the transition only advises) is bound
  // to one by a later correction that carries the whole row, which both
  // publication consumers read from committed control history; a bound row
  // at another code identity is refused like any other (WO-115 D026).
  review(undefined);
  assert.throws(
    () => reviewedProductGate(repo, "WO-999"),
    /no recorded passing reviewer npm test row/,
  );
  const bind = (productGate, at) => {
    writeFileSync(
      join(repo, "docs/control/orders/WO-999.jsonl"),
      JSON.stringify({
        schemaVersion: 1,
        workOrderId: "WO-999",
        recordedAt: at,
        type: "RecordCorrected",
        subject: { ordinal: 2, type: "FinalReviewCompleted" },
        fields: { productGate: productGate.evidenceRef },
        previous: { productGate: "none" },
        reason: "bind the gate",
        evidence: { productGate },
        actor: {
          harness: "human",
          harnessVersion: "not-applicable",
          model: "human",
          effort: "unknown",
          source: "operator-attested",
        },
      }) + "\n",
      { flag: "a" },
    );
    runGit(repo, ["add", "docs/control/orders"], fixtureGitOptions);
    runGit(
      repo,
      ["commit", "-qm", "Bind the reviewer gate"],
      fixtureGitOptions,
    );
  };
  bind(accepted.productGate, "2026-09-20T00:00:03.000Z");
  assert.equal(
    reviewedProductGate(repo, "WO-999").evidenceRef,
    full.evidenceRef,
  );
  bind(
    {
      ...accepted.productGate,
      codeIdentity: "0".repeat(64),
      evidenceRef: "host-gate:elsewhere:npm test",
    },
    "2026-09-20T00:00:04.000Z",
  );
  assert.throws(
    () => reviewedProductGate(repo, "WO-999"),
    /reviewed code identity differs/,
  );
});

test("WO-140 the recognized markers probe the path their sandbox protects and fail open without one", (t) => {
  assert.deepEqual(
    confinementMarkers.map((row) => [row.id, row.env]),
    [
      ["claude-code", "CLAUDECODE"],
      ["codex-cli", "CODEX_SANDBOX"],
    ],
  );
  const repo = mkdtempSync(join(tmpdir(), "dotln-confinement-markers-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  execGit(["init", "-q"], { cwd: repo });
  const [claude, codex] = confinementMarkers;
  assert.equal(claude.deniedDirectory(repo), join(repo, ".claude/hooks"));
  assert.equal(
    realpathSync(codex.deniedDirectory(repo)),
    realpathSync(join(repo, ".git")),
  );
  // A fixture repository has no protected directory: the marker fails open.
  const missing = detectHostConfinement(repo, { env: { CLAUDECODE: "1" } });
  assert.equal(missing.marker, "claude-code");
  assert.equal(missing.inForce, false);
  assert.equal(missing.probe.code, "ENOENT");
  assert.deepEqual(probeDeniedWrite(null), {
    path: null,
    denied: false,
    code: "no-path",
  });
});

test("WO-140 the probe classifies only a denied write as a sandbox, and every other outcome fails open", (t) => {
  for (const code of ["EPERM", "EACCES", "EROFS"])
    assert.equal(deniedWriteCode(code), true, code);
  for (const code of ["ENOENT", "ENOTDIR", "EEXIST", "ENOSPC", undefined])
    assert.equal(deniedWriteCode(code), false, String(code));
  const directory = mkdtempSync(join(tmpdir(), "dotln-confinement-probe-"));
  t.after(() => {
    chmodSync(directory, 0o755);
    if (existsSync(join(directory, "denied")))
      chmodSync(join(directory, "denied"), 0o755);
    rmSync(directory, { recursive: true, force: true });
  });
  const failing = (code) => () => {
    throw Object.assign(new Error(code), { code });
  };
  // Seatbelt answers EPERM and a read-only bind mount EROFS; chmod gives EACCES.
  for (const code of ["EPERM", "EACCES", "EROFS"])
    assert.deepEqual(probeDeniedWrite(directory, { open: failing(code) }), {
      path: directory,
      denied: true,
      code,
    });
  assert.deepEqual(probeDeniedWrite(directory, { open: failing("ENOSPC") }), {
    path: directory,
    denied: false,
    code: "ENOSPC",
  });
  // A probe file the host will not let us remove is reported, never thrown.
  const unremovable = probeDeniedWrite(directory, {
    open: (path, flags, mode) => {
      const descriptor = openSync(path, flags, mode);
      chmodSync(directory, 0o555);
      return descriptor;
    },
  });
  assert.equal(unremovable.denied, false);
  assert.equal(unremovable.code, "written-unremoved");
  assert.ok(
    unremovable.left.startsWith(join(directory, ".dotln-confinement-probe-")),
  );
  chmodSync(directory, 0o755);
  rmSync(unremovable.left);

  // One harness can inherit another's marker: every present marker is probed.
  const open = join(directory, "open"),
    denied = join(directory, "denied");
  mkdirSync(open);
  mkdirSync(denied);
  chmodSync(denied, 0o555);
  const markers = [
    { id: "first", env: "FIRST", deniedDirectory: () => open },
    { id: "second", env: "SECOND", deniedDirectory: () => denied },
  ];
  const both = detectHostConfinement(directory, {
    env: { FIRST: "1", SECOND: "1" },
    markers,
  });
  assert.equal(both.marker, "second");
  assert.equal(both.inForce, true);
  assert.equal(both.probe.code, "EACCES");
  assert.equal(
    detectHostConfinement(directory, { env: { FIRST: "1" }, markers }).inForce,
    false,
  );
  assert.deepEqual(readdirSync(open), [], "no probe file is left behind");
  // Detection never throws: a probe that cannot even name its path fails open.
  assert.deepEqual(
    detectHostConfinement(directory, {
      env: { FIRST: "1" },
      markers: [
        {
          id: "first",
          env: "FIRST",
          deniedDirectory: () => {
            throw new Error("no path");
          },
        },
      ],
    }),
    {
      marker: null,
      inForce: false,
      probe: { path: null, denied: false, code: "probe-failed" },
    },
  );
});

test("WO-140 a real Seatbelt denial under the real marker reads EPERM and is in force", (t) => {
  const usable =
    process.platform === "darwin" &&
    spawnSync(
      "/usr/bin/sandbox-exec",
      ["-p", "(version 1)(allow default)", "/usr/bin/true"],
      { encoding: "utf8" },
    ).status === 0;
  // Inside a harness sandbox the nested profile is itself refused.
  if (!usable) return t.skip("sandbox-exec is unavailable or nested here");
  const repo = realpathSync(mkdtempSync(join(tmpdir(), "dotln-seatbelt-")));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const hooks = join(repo, ".claude/hooks");
  mkdirSync(hooks, { recursive: true });
  const module = new URL("./lib/host-confinement.mjs", import.meta.url).href;
  const run = spawnSync(
    "/usr/bin/sandbox-exec",
    [
      "-p",
      `(version 1)(allow default)(deny file-write* (subpath ${JSON.stringify(hooks)}))`,
      process.execPath,
      "--input-type=module",
      "-e",
      `import {detectHostConfinement} from ${JSON.stringify(module)}; console.log(JSON.stringify(detectHostConfinement(process.argv[1], {env: {CLAUDECODE: "1"}})));`,
      repo,
    ],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(run.stdout), {
    marker: "claude-code",
    probe: { path: hooks, denied: true, code: "EPERM" },
    inForce: true,
  });
  assert.deepEqual(readdirSync(hooks), []);
});

test("WO-140 any partial flag or exclusion shape disqualifies a row under the npm test identity", async (t) => {
  for (const shape of [
    { partial: true, excludedSuites: [] },
    { partial: true },
    { partial: "true" },
    { partial: 1 },
    { excludedSuites: ["skeleton"] },
    { excludedSuites: "skeleton" },
    { excludedSuites: {} },
  ])
    assert.equal(partialGateCheck(shape), true, JSON.stringify(shape));
  for (const shape of [{}, { partial: false }, { excludedSuites: [] }])
    assert.equal(partialGateCheck(shape), false, JSON.stringify(shape));
  const fixture = confinementFixture(t);
  const code = gateCodeIdentity(fixture.repo),
    tree = gateTreeHash(fixture.repo);
  const row = (extra) => ({
    checkId: "npm test",
    codeIdentity: code,
    treeHash: tree,
    subject: tree,
    executed: true,
    exitCode: 0,
    durationMs: 1,
    evidenceRef: "fixture:shape",
    recordedAt: new Date().toISOString(),
    ...extra,
  });
  // The runner emits this shape for `--confined-partial --only <suite>`.
  recordGateChecks(fixture.repo, [row({ partial: true, excludedSuites: [] })]);
  assert.equal(findGateCheck(fixture.repo, "npm test", tree), undefined);
  recordGateChecks(fixture.repo, [row({ evidenceRef: "fixture:complete" })]);
  assert.equal(
    findGateCheck(fixture.repo, "npm test", tree).evidenceRef,
    "fixture:complete",
  );
  // The inside listing names only what it would run.
  const lines = [];
  const log = console.log;
  console.log = (line) => lines.push(line);
  t.after(() => (console.log = log));
  await runGate(
    ["--list", "--confined-partial"],
    fixture.repo,
    fixture.options(0o755),
  );
  console.log = log;
  assert.deepEqual(
    lines.map((line) => line.split(" — ")[0]),
    ["build", "alpha"],
  );
});

// A fixture commit started Git's detached automatic maintenance, whose
// geometric repack could still be writing .git/objects/pack when the
// teardown removed the tree (ENOTEMPTY; WO-157 item 15, WO-063 D005).
test("WO-157 the host-confinement fixture's commits start no background Git maintenance that could race its teardown", (t) => {
  const { repo } = confinementFixture(t);
  const fixtureGitOptions = {
    exec: true,
    trim: false,
    stdio: ["pipe", "pipe", "pipe"],
  };
  const format = runGit(
    repo,
    ["rev-parse", "--show-object-format"],
    fixtureGitOptions,
  ).trim();
  // Git 2.55 estimates loose objects from objects/17 alone; two there make a
  // repository's automatic maintenance repack.
  let planted = 0;
  for (let index = 0; planted < 2; index++) {
    const text = `teardown probe ${index}\n`;
    const id = createHash(format)
      .update(`blob ${Buffer.byteLength(text)}\0${text}`)
      .digest("hex");
    if (!id.startsWith("17")) continue;
    runGit(repo, ["hash-object", "-w", "--stdin"], {
      ...fixtureGitOptions,
      ...{ input: text },
    });
    planted += 1;
  }
  const needed = spawnGit(["maintenance", "is-needed", "--auto"], {
    cwd: repo,
  });
  if (needed.status !== 129)
    assert.equal(
      needed.status,
      0,
      "two loose objects under objects/17 are a state automatic maintenance acts on",
    );
  const traces = mkdtempSync(join(tmpdir(), "dotln-maintenance-trace-"));
  t.after(() => rmSync(traces, { recursive: true, force: true }));
  writeFileSync(join(repo, "teardown.txt"), "teardown probe\n");
  runGit(repo, ["add", "teardown.txt"], fixtureGitOptions);
  runGit(repo, ["commit", "-qm", "Teardown probe"], {
    ...fixtureGitOptions,
    ...{
      env: { ...process.env, GIT_TRACE2_EVENT: join(traces, "commit.jsonl") },
    },
  });
  const started = readFileSync(join(traces, "commit.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
    .filter(
      (event) =>
        event.event === "child_start" && event.argv?.includes("maintenance"),
    )
    .map((event) => event.argv.join(" "));
  // A failing run waits for the detached child, so it reports this assertion
  // and not the teardown race it would otherwise cause.
  const lock = join(repo, ".git/objects/maintenance.lock");
  const until = Date.now() + 10_000;
  while (existsSync(lock) && Date.now() < until)
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
  assert.deepEqual(
    started,
    [],
    "a fixture commit started background maintenance that writes .git/objects/pack",
  );
});

test("WO-157 a gate whose suites leave a host-confinement fixture root behind fails and names it, and another run's root does not fail it", async (t) => {
  const fixture = confinementFixture(t);
  const planted = [];
  t.after(() => {
    for (const path of planted) rmSync(path, { recursive: true, force: true });
  });
  // Another run's root in the shared temporary directory is never judged.
  const foreign = mkdtempSync(
    join(tmpdir(), "dotln-host-confinement-foreign-"),
  );
  planted.push(foreign);
  writeFileSync(
    join(fixture.repo, "scripts/abandon.mjs"),
    'import fs from "node:fs";\nimport os from "node:os";\nimport path from "node:path";\nconst root = fs.mkdtempSync(path.join(os.tmpdir(), `dotln-host-confinement-${process.env.DOTLN_GATE_FIXTURE_TAG}-`));\nfs.appendFileSync("observed.jsonl", `abandoned ${root}\\n`);\n',
  );
  const options = fixture.options(0o755);
  const clean = await runGate(["--serial"], fixture.repo, options);
  assert.equal(clean.exitCode, 0, "another run's root is not this gate's");
  assert.equal(clean.abandonedRoots, undefined);
  const leaky = await runGate(["--serial"], fixture.repo, {
    ...options,
    table: [
      ...options.table,
      {
        name: "abandon",
        command: [process.execPath, "scripts/abandon.mjs"],
        product: true,
      },
    ],
  });
  const left = fixture
    .observed()
    .filter((line) => line.startsWith("abandoned "))
    .map((line) => line.slice("abandoned ".length));
  planted.push(...left);
  assert.equal(left.length, 1);
  assert.equal(
    leaky.exitCode,
    1,
    "a gate whose suites left a dotln-host-confinement root behind must fail",
  );
  assert.deepEqual(leaky.abandonedRoots, left);
  assert.ok(existsSync(foreign), "the check removes nothing");
});

test("WO-160 document failures rerun at the base, retain red status and record introduced/inherited labels", async (t) => {
  const repo = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-document-label-")),
  );
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const fixtureGitOptions = { exec: true, trim: true, encoding: "utf8" };
  runGit(repo, ["init", "-q", "-b", "main"], fixtureGitOptions);
  runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    repo,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
  writeFileSync(join(repo, "scripts/inherited.mjs"), "process.exitCode = 1;\n");
  writeFileSync(
    join(repo, "scripts/introduced.mjs"),
    "process.exitCode = 0;\n",
  );
  runGit(repo, ["add", "."], fixtureGitOptions);
  runGit(repo, ["commit", "-qm", "base checks"], fixtureGitOptions);
  const base = runGit(repo, ["rev-parse", "HEAD"], fixtureGitOptions);
  writeFileSync(
    join(repo, "scripts/introduced.mjs"),
    "process.exitCode = 1;\n",
  );
  const table = ["inherited", "introduced"].map((name) => ({
    name,
    document: true,
    command: [process.execPath, `scripts/${name}.mjs`],
  }));
  const before = runGit(repo, ["diff"], fixtureGitOptions);
  for (const flags of [["--against", base], []]) {
    const result = await runGate(["--document", ...flags], repo, { table });
    assert.equal(result.exitCode, 1);
    assert.deepEqual(
      result.failureComparisons
        .map(({ name, classification }) => ({ name, classification }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      [
        { name: "inherited", classification: "inherited" },
        { name: "introduced", classification: "introduced" },
      ],
    );
    assert.ok(result.failureComparisons.every((row) => row.base === base));
    assert.equal(runGit(repo, ["diff"], fixtureGitOptions), before);
    assert.equal(
      readGateChecks(repo, gateTreeHash(repo)).at(-1).checkId,
      "npm run test:docs",
    );
  }
  const unknown = await runGate(
    ["--document", "--against", "missing-base"],
    repo,
    { table },
  );
  assert.ok(
    unknown.failureComparisons.every((row) => row.classification === "unknown"),
  );
  const unavailable = await runGate(["--document", "--against", base], repo, {
    table: [
      {
        name: "unavailable",
        document: true,
        command: [join(repo, "nonexistent-program")],
      },
    ],
  });
  assert.equal(unavailable.failureComparisons[0].classification, "unknown");
  const missingGlob = await runGate(["--document", "--against", base], repo, {
    table: [
      {
        name: "missing-glob",
        document: true,
        command: [
          process.execPath,
          "--test",
          "packages/missing/dist/test/*.test.js",
        ],
      },
    ],
  });
  assert.equal(missingGlob.failureComparisons[0].classification, "unknown");
});

// Exercise actual child commands and durable rows across shell/session
// boundaries, rather than an in-memory scheduler double (WO-186).
function taskReuseFixture(t) {
  const repo = mkdtempSync(join(tmpdir(), "dotln-task-reuse-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  for (const args of [
    ["init", "-q", "-b", "main"],
    ["config", "maintenance.auto", "false"],
    ["config", "user.name", "Fixture"],
    ["config", "user.email", "fixture@example.invalid"],
  ])
    runGit(repo, args);
  mkdirSync(join(repo, "scripts"));
  writeFileSync(
    join(repo, ".gitignore"),
    "docs/control/local/\nobserved.jsonl\nfail-beta\n",
  );
  for (const name of ["build", "alpha", "beta", "machine"])
    writeFileSync(
      join(repo, `scripts/${name}.mjs`),
      `import fs from "node:fs"; fs.appendFileSync("observed.jsonl", ${JSON.stringify(name + "\n")});\n` +
        (name === "beta"
          ? 'if(fs.existsSync("fail-beta"))process.exit(1);\n'
          : ""),
    );
  runGit(repo, ["add", "."]);
  runGit(repo, ["commit", "-qm", "task reuse fixture"]);
  const table = [
    {
      name: "build",
      build: true,
      product: true,
      // This build publishes nothing a task consumes.
      outputs: [],
      command: [process.execPath, "scripts/build.mjs"],
    },
    ...["alpha", "beta"].map((name) => ({
      name,
      product: true,
      command: [process.execPath, `scripts/${name}.mjs`],
    })),
    {
      name: "machine",
      machinery: true,
      sources: ["scripts/machine.mjs"],
      command: [process.execPath, "scripts/machine.mjs"],
    },
  ];
  const observed = (directory = repo) =>
    existsSync(join(directory, "observed.jsonl"))
      ? readFileSync(join(directory, "observed.jsonl"), "utf8")
          .trim()
          .split("\n")
      : [];
  return { repo, table, observed };
}

function sharedRefsFixture(t) {
  const fixture = taskReuseFixture(t);
  const { repo } = fixture;
  writeFileSync(join(repo, "scripts/branch-value"), "base\n");
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import fs from "node:fs"; if(fs.readFileSync("scripts/branch-value", "utf8") !== "base\\n") process.exit(1);\n',
  );
  runGit(repo, ["add", "."]);
  runGit(repo, ["commit", "-qm", "branch-local gate input"]);
  const origin = mkdtempSync(join(tmpdir(), "dotln-shared-origin-"));
  const worktree = `${repo}-worktree`;
  t.after(() => {
    rmSync(worktree, { recursive: true, force: true });
    rmSync(origin, { recursive: true, force: true });
  });
  runGit(origin, ["init", "--bare", "-q"]);
  runGit(origin, ["config", "maintenance.auto", "false"]);
  runGit(repo, ["remote", "add", "origin", origin]);
  runGit(repo, ["push", "-q", "-u", "origin", "main"]);
  runGit(repo, ["worktree", "add", "-q", "-b", "wo-900", worktree]);
  const table = fixture.table.map((row) =>
    ["alpha", "beta"].includes(row.name)
      ? {
          ...row,
          document: true,
          ...(row.name === "alpha" ? { preflight: true } : {}),
        }
      : row,
  );
  const advance = () => {
    writeFileSync(join(repo, "scripts/branch-value"), "sibling\n");
    runGit(repo, ["commit", "-qam", "sibling lands on main"]);
    runGit(repo, ["tag", "-a", "v9000.0.1", "-m", "sibling release"]);
    runGit(repo, ["update-ref", "refs/dotln/checkpoint/WO-901/1", "HEAD"]);
    runGit(repo, ["push", "-q", "origin", "main", "refs/tags/v9000.0.1"]);
  };
  return { ...fixture, table, worktree, advance };
}

async function captureGate(args, repo, options) {
  const lines = [];
  const log = console.log;
  console.log = (...values) => {
    lines.push(values.join(" "));
  };
  try {
    return { row: await runGate(args, repo, options), lines };
  } finally {
    console.log = log;
  }
}

test("WO-198 shared-ref comparisons name absence transitions and isolate unreadable fields", (t) => {
  const before = {
    originMain: "absent",
    main: "absent",
    tags: { count: 0, newest: "absent" },
    dotlnRefs: 0,
  };
  const after = {
    originMain: "origin-commit",
    main: "main-commit",
    tags: { count: 1, newest: "v1.0.0" },
    dotlnRefs: 1,
  };
  const expected = [
    "origin/main absent..origin-commit",
    "main absent..main-commit",
    "tags +v1.0.0 (count 0..1, newest absent..v1.0.0)",
    "refs/dotln/ 0..1",
  ];
  assert.deepEqual(sharedRefChanges(before, after), expected);
  assert.deepEqual(sharedRefChanges(after, before), [
    "origin/main origin-commit..absent",
    "main main-commit..absent",
    "tags (count 1..0, newest v1.0.0..absent)",
    "refs/dotln/ 1..0",
  ]);
  assert.deepEqual(sharedRefChanges(after, after), []);
  const fields = ["originMain", "main", "tags", "dotlnRefs"];
  for (const [index, field] of fields.entries()) {
    for (const side of ["before", "after"]) {
      const left = structuredClone(before);
      const right = structuredClone(after);
      const snapshot = side === "before" ? left : right;
      snapshot[field] =
        field === "tags"
          ? { count: "unreadable", newest: "unreadable" }
          : "unreadable";
      assert.equal(completeSharedRefs(snapshot), true, `${field} ${side}`);
      assert.deepEqual(
        sharedRefChanges(left, right),
        expected.filter((_, expectedIndex) => expectedIndex !== index),
        `${field} ${side} withholds only its own comparison`,
      );
    }
  }
  const unreadable = {
    originMain: "unreadable",
    main: "unreadable",
    tags: { count: "unreadable", newest: "unreadable" },
    dotlnRefs: "unreadable",
  };
  assert.equal(completeSharedRefs(unreadable), true);
  assert.deepEqual(sharedRefChanges(before, unreadable), []);
  assert.deepEqual(sharedRefChanges(unreadable, after), []);
  assert.deepEqual(sharedRefChanges(unreadable, unreadable), []);
  for (const malformed of [
    undefined,
    {},
    { ...before, tags: null },
    { ...before, tags: { count: "absent", newest: "absent" } },
  ]) {
    assert.deepEqual(sharedRefChanges(malformed, after), []);
    assert.deepEqual(sharedRefChanges(before, malformed), []);
  }
  t.diagnostic(
    "PROOF WO-198 comparison: absent creation/removal, both interval directions, each unreadable field on either side, all-unreadable and malformed baselines",
  );
});

test("WO-198 origin/main created between failed linked-worktree gates is named exactly once", async (t) => {
  const { repo, worktree, table } = sharedRefsFixture(t);
  runGit(repo, ["update-ref", "-d", "refs/remotes/origin/main"]);
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  const options = {
    table: table.filter((row) => ["build", "beta"].includes(row.name)),
  };
  const first = await captureGate(["--serial", "--again"], worktree, options);
  assert.equal(first.row.exitCode, 1);
  assert.equal(first.row.sharedRefs.end.originMain, "absent");
  assert.ok(
    first.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
  const commit = runGit(repo, ["rev-parse", "HEAD"]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", commit]);
  const second = await captureGate(["--serial", "--again"], worktree, options);
  assert.equal(second.row.exitCode, 1);
  assert.equal(second.row.sharedRefs.start.originMain, commit);
  const lines = second.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.deepEqual(lines, [
    `shared refs moved: since previous: origin/main absent..${commit}`,
  ]);
  const stored = JSON.parse(
    readFileSync(
      join(worktree, "docs/control/local/harness/checks.json"),
      "utf8",
    ),
  );
  assert.equal(stored.length, 2);
  assert.ok(stored.every((row) => row.exitCode === 1));
  assert.deepEqual(stored.at(-1).sharedRefs, second.row.sharedRefs);
  assert.equal(
    second.lines.filter((line) => /^npm test: \d+ passed;/u.test(line)).length,
    1,
  );
  t.diagnostic("PROOF WO-198 branch creation " + lines[0]);
});

test("WO-198 shared refs tolerate absent branches and count only annotated v tags", (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-shared-absent-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  runGit(repo, ["init", "-q", "-b", "topic"]);
  assert.deepEqual(readSharedRefs(repo), {
    originMain: "absent",
    main: "absent",
    tags: { count: 0, newest: "absent" },
    dotlnRefs: 0,
  });
  const fixture = taskReuseFixture(t);
  runGit(fixture.repo, ["tag", "v-lightweight"]);
  runGit(fixture.repo, ["tag", "-a", "unrelated", "-m", "not a v tag"]);
  assert.deepEqual(readSharedRefs(fixture.repo).tags, {
    count: 0,
    newest: "absent",
  });
  for (const [name, date] of [
    ["v9000.0.2", "2020-01-01T00:00:00Z"],
    ["v9000.0.1", "2020-01-02T00:00:00Z"],
  ])
    runGit(fixture.repo, ["tag", "-a", name, "-m", "dated tag"], {
      env: { ...process.env, GIT_COMMITTER_DATE: date },
    });
  assert.deepEqual(readSharedRefs(fixture.repo).tags, {
    count: 2,
    newest: "v9000.0.1",
  });
});

test("WO-198 branch reads distinguish clean unresolved refs from unavailable reads", (t) => {
  const { repo } = taskReuseFixture(t);
  const ref = "refs/remotes/origin/main";
  const quiet = ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`];
  assert.equal(spawnGit(quiet, { cwd: repo }).status, 1);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  runGit(repo, ["update-ref", ref, "HEAD"]);
  assert.equal(
    readSharedRefs(repo).originMain,
    runGit(repo, ["rev-parse", "HEAD"]),
  );
  runGit(repo, ["update-ref", ref, runGit(repo, ["rev-parse", "HEAD^{tree}"])]);
  assert.equal(spawnGit(quiet, { cwd: repo }).status, 1);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  writeFileSync(join(repo, ".git", ref), `${"1".repeat(40)}\n`);
  assert.equal(spawnGit(quiet, { cwd: repo }).status, 1);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  runGit(repo, ["update-ref", "-d", ref]);
  assert.equal(readSharedRefs(repo).originMain, "absent");
  // A missing working directory prevents Git from launching, unlike a
  // completed read that simply cannot resolve the requested branch.
  const unavailable = readSharedRefs(join(repo, "missing-checkout"));
  assert.deepEqual(unavailable, {
    originMain: "unreadable",
    main: "unreadable",
    tags: { count: "unreadable", newest: "unreadable" },
    dotlnRefs: "unreadable",
  });
  assert.deepEqual(sharedRefChanges(readSharedRefs(repo), unavailable), []);
  t.diagnostic(
    "PROOF WO-198 Git reads: missing, removed, dangling and non-commit refs resolve absent; a launch failure records every field unreadable without throwing",
  );
});

test("WO-198 failed shared-ref enumerations retain unknown fields instead of partial counts", (t) => {
  const { repo } = taskReuseFixture(t);
  runGit(repo, ["tag", "-a", "v1.0.0", "-m", "readable tag"]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  runGit(repo, ["update-ref", "refs/dotln/fixture", "HEAD"]);
  const healthy = readSharedRefs(repo);
  assert.equal(healthy.tags.count, 1);
  assert.equal(healthy.dotlnRefs, 1);
  const tagFile = join(repo, ".git/refs/tags/v9.9.9");
  writeFileSync(tagFile, `${"1".repeat(40)}\n`);
  assert.notEqual(
    spawnGit(["for-each-ref", "--format=%(objecttype)", "refs/tags/v*"], {
      cwd: repo,
    }).status,
    0,
  );
  assert.deepEqual(readSharedRefs(repo), {
    ...healthy,
    tags: { count: "unreadable", newest: "unreadable" },
  });
  rmSync(tagFile);
  assert.deepEqual(readSharedRefs(repo), healthy);
  runGit(repo, ["pack-refs", "--all"]);
  const packed = join(repo, ".git/packed-refs");
  writeFileSync(packed, readFileSync(packed, "utf8") + "garbage line\n");
  for (const args of [
    ["rev-parse", "--verify", "refs/remotes/origin/main^{commit}"],
    ["rev-parse", "--verify", "refs/heads/main^{commit}"],
    ["for-each-ref", "--format=%(objecttype)", "refs/tags/v*"],
    ["for-each-ref", "--format=%(refname)", "refs/dotln/"],
  ])
    assert.notEqual(spawnGit(args, { cwd: repo }).status, 0);
  const degraded = readSharedRefs(repo);
  assert.deepEqual(degraded, {
    originMain: "unreadable",
    main: "unreadable",
    tags: { count: "unreadable", newest: "unreadable" },
    dotlnRefs: "unreadable",
  });
  assert.equal(completeSharedRefs(degraded), true);
  assert.deepEqual(sharedRefChanges(healthy, degraded), []);
  assert.deepEqual(sharedRefChanges(degraded, healthy), []);
  t.diagnostic(
    "PROOF WO-198 unreadable enumerations: dangling tag degrades only tags; recovery restores counts; damaged packed-refs degrades all four reads without throwing",
  );
});

test("WO-198 unreadable shared tags before and during a passing linked-worktree gate preserve its row and summary", async (t) => {
  for (const during of [false, true]) {
    const { repo, worktree, table, observed } = sharedRefsFixture(t);
    const healthy = readSharedRefs(worktree);
    const breakTag = () => {
      mkdirSync(join(repo, ".git/refs/tags"), { recursive: true });
      writeFileSync(join(repo, ".git/refs/tags/v9.9.9"), `${"1".repeat(40)}\n`);
    };
    if (!during) breakTag();
    let damaged = !during;
    const passed = await captureGate(
      during ? ["--serial", "--again"] : ["--document", "--serial"],
      worktree,
      {
        table,
        stopRequested: () => {
          if (!damaged && observed(worktree).includes("build")) {
            damaged = true;
            breakTag();
          }
          return false;
        },
      },
    );
    assert.ok(damaged);
    assert.equal(passed.row.exitCode, 0);
    const degraded = {
      ...healthy,
      tags: { count: "unreadable", newest: "unreadable" },
    };
    assert.deepEqual(passed.row.sharedRefs, {
      start: during ? healthy : degraded,
      end: degraded,
    });
    const stored = JSON.parse(
      readFileSync(
        join(worktree, "docs/control/local/harness/checks.json"),
        "utf8",
      ),
    );
    assert.equal(stored.length, 1);
    assert.equal(stored[0].exitCode, 0);
    assert.deepEqual(stored[0].sharedRefs, passed.row.sharedRefs);
    assert.equal(
      passed.lines.filter((line) => line.startsWith(`${passed.row.checkId}: `))
        .length,
      1,
    );
    assert.ok(
      passed.lines.every((line) => !line.startsWith("shared refs moved:")),
    );
    t.diagnostic(
      `PROOF WO-198 unreadable tag ${during ? "during plain" : "before document"} gate: exit 0, one durable row, four-field snapshots, one summary, no delta`,
    );
  }
});

test("WO-198 unreadable enumerations and unresolved branches preserve a failed gate and its observed movement", async (t) => {
  for (const during of [false, true]) {
    const { repo, worktree, table, observed } = sharedRefsFixture(t);
    const healthy = readSharedRefs(worktree);
    if (!during) {
      mkdirSync(join(repo, ".git/refs/tags"), { recursive: true });
      writeFileSync(join(repo, ".git/refs/tags/v9.9.9"), `${"1".repeat(40)}\n`);
    }
    writeFileSync(join(worktree, "fail-beta"), "fail\n");
    let damaged = !during;
    const failed = await captureGate(["--serial", "--again"], worktree, {
      table,
      stopRequested: () => {
        if (!damaged && observed(worktree).includes("build")) {
          damaged = true;
          writeFileSync(
            join(repo, ".git/refs/remotes/origin/main"),
            `${"1".repeat(40)}\n`,
          );
        }
        return false;
      },
    });
    assert.ok(damaged);
    assert.equal(failed.row.exitCode, 1);
    const degraded = during
      ? { ...healthy, originMain: "absent" }
      : { ...healthy, tags: { count: "unreadable", newest: "unreadable" } };
    assert.deepEqual(failed.row.sharedRefs, {
      start: during ? healthy : degraded,
      end: degraded,
    });
    const stored = JSON.parse(
      readFileSync(
        join(worktree, "docs/control/local/harness/checks.json"),
        "utf8",
      ),
    );
    assert.equal(stored.length, 1);
    assert.equal(stored[0].exitCode, 1);
    assert.deepEqual(stored[0].sharedRefs, failed.row.sharedRefs);
    assert.equal(
      failed.lines.filter((line) => /^npm test: \d+ passed;/u.test(line))
        .length,
      1,
    );
    assert.deepEqual(
      failed.lines.filter((line) => line.startsWith("shared refs moved:")),
      during
        ? [
            `shared refs moved: during run: origin/main ${healthy.originMain}..absent`,
          ]
        : [],
    );
    t.diagnostic(
      `PROOF WO-198 failed ${during ? "unresolved branch during" : "tag read before"} gate: exit 1, one durable failed row, four-field snapshots, one summary, ${during ? "clean unresolved commit named absent" : "no fabricated delta"}`,
    );
  }
});

test("WO-198 a sibling merge and tag during a worktree's gates change no result and are named on the row", async (t) => {
  const { repo, worktree, table, advance } = sharedRefsFixture(t);
  const selections = [["--document", "--serial"], ["--serial"]];
  const first = [];
  for (const args of selections)
    first.push(await captureGate(args, worktree, { table }));
  advance();
  assert.equal(
    readFileSync(join(repo, "scripts/branch-value"), "utf8"),
    "sibling\n",
  );
  for (const [index, args] of selections.entries()) {
    // Force execution to prove the tasks still pass, beyond merely carrying
    // their old passes; the plain composed run is checked separately below.
    const second = await captureGate([...args, "--again"], worktree, { table });
    const before = first[index].row;
    assert.equal(before.exitCode, 0);
    assert.equal(second.row.exitCode, 0);
    assert.equal(second.row.codeIdentity, before.codeIdentity);
    assert.deepEqual(
      second.row.cases.map(({ name, exitCode }) => ({ name, exitCode })),
      before.cases.map(({ name, exitCode }) => ({ name, exitCode })),
    );
    for (const row of [before, second.row]) {
      assert.deepEqual(Object.keys(row.sharedRefs.start).sort(), [
        "dotlnRefs",
        "main",
        "originMain",
        "tags",
      ]);
      assert.deepEqual(row.sharedRefs.start, row.sharedRefs.end);
      assert.deepEqual(
        readGateChecks(worktree).find(
          (stored) => stored.recordedAt === row.recordedAt,
        ).sharedRefs,
        row.sharedRefs,
      );
    }
    assert.equal(
      second.row.sharedRefs.start.tags.count,
      before.sharedRefs.start.tags.count + 1,
    );
    assert.notEqual(
      second.row.sharedRefs.start.originMain,
      before.sharedRefs.start.originMain,
    );
    assert.equal(
      second.row.sharedRefs.start.main,
      second.row.sharedRefs.start.originMain,
    );
    assert.equal(
      second.row.sharedRefs.start.dotlnRefs,
      before.sharedRefs.start.dotlnRefs + 1,
    );
    assert.ok(
      [...first[index].lines, ...second.lines].every(
        (line) => !line.startsWith("shared refs moved:"),
      ),
    );
    t.diagnostic(
      "PROOF WO-198 sibling " +
        JSON.stringify({
          checkId: before.checkId,
          before: before.sharedRefs,
          after: second.row.sharedRefs,
          tasks: second.row.cases.map(({ name, exitCode }) => ({
            name,
            exitCode,
          })),
          deltaLines: 0,
        }),
    );
  }
  const composed = await captureGate(["--serial"], worktree, { table });
  assert.equal(composed.row.exitCode, 0);
  assert.equal(composed.row.executionMode, "composed");
  assert.deepEqual(composed.row.sharedRefs.start, readSharedRefs(worktree));
  assert.ok(
    composed.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
});

test("WO-198 a failed row names movement since its own check's previous row exactly once", async (t) => {
  const { worktree, table, advance } = sharedRefsFixture(t);
  const before = await captureGate(["--serial"], worktree, { table });
  advance();
  // A more recent row for another check must not hide the movement.
  await captureGate(["--document", "--serial"], worktree, { table });
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  const failed = await captureGate(["--serial", "--again"], worktree, {
    table,
  });
  assert.equal(failed.row.exitCode, 1);
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  for (const field of [
    "origin/main",
    "main",
    "tags +v9000.0.1",
    "count 0..1",
    "newest absent..v9000.0.1",
    "refs/dotln/ 0..1",
  ])
    assert.ok(delta[0].includes(field), delta[0]);
  assert.ok(delta[0].includes(before.row.sharedRefs.end.originMain));
  t.diagnostic("PROOF WO-198 forced failure " + delta[0]);
  const unchanged = await captureGate(["--serial", "--again"], worktree, {
    table,
  });
  assert.equal(unchanged.row.exitCode, 1);
  assert.ok(
    unchanged.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
});

test("WO-198 damaged archive JSON cannot prevent recording a failed gate", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const original = readSharedRefs(repo);
  recordGateChecks(repo, [
    {
      checkId: "npm test",
      treeHash: gateTreeHash(repo),
      subject: "fixture",
      durationMs: 0,
      exitCode: 1,
      executed: true,
      evidenceRef: "fixture:before-damaged-archive",
      recordedAt: new Date(0).toISOString(),
      sharedRefs: { start: original, end: original },
    },
  ]);
  const history = join(repo, "docs/control/local/harness/check-history");
  mkdirSync(history, { recursive: true });
  writeFileSync(join(history, `${"a".repeat(40)}.json`), "not json\n");
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const failed = await captureGate(["--serial", "--again"], repo, {
    table: table.filter((row) => ["build", "beta"].includes(row.name)),
  });
  assert.equal(failed.row.exitCode, 1);
  // Read the hot index independently: the archive deliberately remains damaged.
  const stored = JSON.parse(
    readFileSync(join(repo, "docs/control/local/harness/checks.json"), "utf8"),
  );
  assert.equal(stored.length, 2);
  assert.equal(stored.at(-1).exitCode, 1);
  assert.equal(stored.at(-1).recordedAt, failed.row.recordedAt);
  assert.deepEqual(stored.at(-1).sharedRefs, {
    start: original,
    end: original,
  });
  assert.equal(
    failed.lines.filter((line) => /^npm test: \d+ passed;/u.test(line)).length,
    1,
  );
  assert.ok(
    failed.lines.every((line) => !line.startsWith("shared refs moved:")),
  );
  t.diagnostic(
    "PROOF WO-198 damaged archive: exit 1, two hot rows, complete snapshot, one summary, no delta",
  );
});

test("WO-198 an unselectable archived timestamp still permits movement during the failed run", async (t) => {
  const { worktree, table, advance, observed } = sharedRefsFixture(t);
  const original = readSharedRefs(worktree);
  const history = join(worktree, "docs/control/local/harness/check-history");
  mkdirSync(history, { recursive: true });
  // One archive row skips sorting and reaches Date.parse in row selection.
  writeFileSync(
    join(history, `${"b".repeat(40)}.json`),
    JSON.stringify([{ checkId: "npm test", recordedAt: { toString: null } }]),
  );
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  let moved = false;
  const failed = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!moved && observed(worktree).includes("build")) {
        moved = true;
        advance();
      }
      return false;
    },
  });
  assert.ok(moved);
  assert.equal(failed.row.exitCode, 1);
  const stored = JSON.parse(
    readFileSync(
      join(worktree, "docs/control/local/harness/checks.json"),
      "utf8",
    ),
  );
  assert.equal(stored.length, 1);
  assert.equal(stored[0].exitCode, 1);
  assert.equal(stored[0].recordedAt, failed.row.recordedAt);
  assert.deepEqual(stored[0].sharedRefs, {
    start: original,
    end: readSharedRefs(worktree),
  });
  assert.equal(
    failed.lines.filter((line) => /^npm test: \d+ passed;/u.test(line)).length,
    1,
  );
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  assert.doesNotMatch(delta[0], /since previous:/u);
  for (const field of ["origin/main", "main", "tags +v9000.0.1", "refs/dotln/"])
    assert.ok(delta[0].includes(`during run: ${field}`), delta[0]);
  t.diagnostic("PROOF WO-198 unselectable history " + delta[0]);
});

test("WO-198 snapshot validation rejects malformed shapes without starting a gate", (t) => {
  const complete = {
    originMain: "earlier-origin",
    main: "earlier-main",
    tags: { count: 1, newest: "v-earlier" },
    dotlnRefs: 1,
  };
  const without = (value, field) =>
    Object.fromEntries(Object.entries(value).filter(([key]) => key !== field));
  const variants = [
    ["missing snapshot", undefined],
    ["null snapshot", null],
    ["string snapshot", "not an object"],
    ["array snapshot", []],
    ["empty snapshot", {}],
    ...["originMain", "main", "tags", "dotlnRefs"].map((field) => [
      `missing ${field}`,
      without(complete, field),
    ]),
    ...["count", "newest"].map((field) => [
      `missing tags.${field}`,
      { ...complete, tags: without(complete.tags, field) },
    ]),
    ...[null, "not an object", []].map((tags) => [
      `malformed tags ${JSON.stringify(tags)}`,
      { ...complete, tags },
    ]),
    ["non-string originMain", { ...complete, originMain: null }],
    ["empty main", { ...complete, main: "" }],
    [
      "non-numeric tag count",
      { ...complete, tags: { ...complete.tags, count: "1" } },
    ],
    [
      "negative tag count",
      { ...complete, tags: { ...complete.tags, count: -1 } },
    ],
    [
      "non-string newest tag",
      { ...complete, tags: { ...complete.tags, newest: 1 } },
    ],
    ["fractional ref count", { ...complete, dotlnRefs: 0.5 }],
    [
      "unsafe tag count",
      { ...complete, tags: { ...complete.tags, count: 1e21 } },
    ],
  ];
  for (const [name, snapshot] of variants)
    assert.equal(completeSharedRefs(snapshot), false, name);
  assert.equal(completeSharedRefs(complete), true);
  assert.equal(
    completeSharedRefs({
      originMain: "absent",
      main: "absent",
      tags: { count: 0, newest: "absent" },
      dotlnRefs: 0,
    }),
    true,
  );
  t.diagnostic(
    `PROOF WO-198 snapshot validator: ${variants.length} malformed shapes rejected, two valid controls accepted, no fixture gates`,
  );
});

test("WO-198 incomplete earlier snapshots never prevent recording a failed gate", async (t) => {
  const variants = [
    ["empty snapshot", {}],
    [
      "missing tags",
      { originMain: "earlier-origin", main: "earlier-main", dotlnRefs: 1 },
    ],
  ];
  let confirmed = 0;
  for (const [name, end] of variants)
    await t.test(name, async (t) => {
      const { repo, table } = taskReuseFixture(t);
      recordGateChecks(repo, [
        {
          checkId: "npm test",
          treeHash: gateTreeHash(repo),
          subject: "fixture",
          durationMs: 0,
          exitCode: 1,
          executed: true,
          evidenceRef: "fixture:incomplete-snapshot",
          recordedAt: new Date(0).toISOString(),
          sharedRefs: { start: {}, end },
        },
      ]);
      writeFileSync(join(repo, "fail-beta"), "fail\n");
      const failed = await captureGate(["--serial", "--again"], repo, {
        table: table.filter((row) => ["build", "beta"].includes(row.name)),
      });
      assert.equal(failed.row.exitCode, 1);
      const stored = readGateChecks(repo);
      assert.equal(stored.length, 2);
      assert.equal(stored.at(-1).exitCode, 1);
      assert.equal(stored.at(-1).recordedAt, failed.row.recordedAt);
      assert.deepEqual(stored.at(-1).sharedRefs, {
        start: readSharedRefs(repo),
        end: readSharedRefs(repo),
      });
      assert.equal(
        failed.lines.filter((line) => line.startsWith("npm test:")).length,
        1,
      );
      assert.ok(
        failed.lines.every((line) => !line.startsWith("shared refs moved:")),
      );
      confirmed++;
    });
  assert.equal(confirmed, variants.length);
  t.diagnostic(
    `PROOF WO-198 malformed snapshots: ${variants.length} variants recorded exit 1, complete snapshots and one summary without an invented delta`,
  );
});

test("WO-198 an incomplete earlier snapshot still permits movement during the failed run", async (t) => {
  const { worktree, table, advance, observed } = sharedRefsFixture(t);
  const original = readSharedRefs(worktree);
  recordGateChecks(worktree, [
    {
      checkId: "npm test",
      treeHash: gateTreeHash(worktree),
      subject: "fixture",
      durationMs: 0,
      exitCode: 1,
      executed: true,
      evidenceRef: "fixture:incomplete-snapshot",
      recordedAt: new Date(0).toISOString(),
      sharedRefs: { start: {}, end: { ...original, tags: null } },
    },
  ]);
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  let moved = false;
  const failed = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!moved && observed(worktree).includes("build")) {
        moved = true;
        advance();
      }
      return false;
    },
  });
  assert.ok(moved);
  assert.equal(failed.row.exitCode, 1);
  assert.equal(readGateChecks(worktree).length, 2);
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  assert.doesNotMatch(delta[0], /since previous:/);
  for (const field of ["origin/main", "main", "tags +v9000.0.1", "refs/dotln/"])
    assert.ok(delta[0].includes(`during run: ${field}`), delta[0]);
  t.diagnostic("PROOF WO-198 incomplete baseline " + delta[0]);
});

test("WO-198 first and legacy rows detect movement during a failed run, including a return to the previous value", async (t) => {
  const { repo, worktree, table, advance, observed } = sharedRefsFixture(t);
  const original = readSharedRefs(worktree);
  // A historical row supplies no invented baseline.
  recordGateChecks(worktree, [
    {
      checkId: "npm test",
      treeHash: gateTreeHash(worktree),
      subject: "fixture",
      durationMs: 0,
      exitCode: 0,
      executed: true,
      evidenceRef: "fixture:legacy",
      recordedAt: new Date(0).toISOString(),
    },
  ]);
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  let moved = false;
  const failed = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!moved && observed(worktree).includes("build")) {
        moved = true;
        advance();
      }
      return false;
    },
  });
  assert.ok(moved);
  assert.equal(failed.row.exitCode, 1);
  assert.deepEqual(failed.row.sharedRefs.start, original);
  assert.notDeepEqual(failed.row.sharedRefs.start, failed.row.sharedRefs.end);
  const delta = failed.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(delta.length, 1);
  assert.match(delta[0], /during run: origin\/main/);
  assert.match(delta[0], /tags \+v9000\.0\.1/);
  assert.doesNotMatch(delta[0], /since previous:/);
  // Move out and back: comparing only the two runs' final values misses it.
  const advanced = failed.row.sharedRefs.end.originMain;
  runGit(repo, ["update-ref", "refs/remotes/origin/main", original.originMain]);
  let returned = false;
  const roundTrip = await captureGate(["--serial", "--again"], worktree, {
    table,
    stopRequested: () => {
      if (!returned) {
        returned = true;
        runGit(repo, ["update-ref", "refs/remotes/origin/main", advanced]);
      }
      return false;
    },
  });
  const roundTripDelta = roundTrip.lines.filter((line) =>
    line.startsWith("shared refs moved:"),
  );
  assert.equal(roundTripDelta.length, 1);
  assert.match(roundTripDelta[0], /since previous: origin\/main/);
  assert.match(roundTripDelta[0], /during run: origin\/main/);
  t.diagnostic("PROOF WO-198 during-run " + delta[0]);
  t.diagnostic("PROOF WO-198 round-trip " + roundTripDelta[0]);
});

const gateProof = (row) => ({
  codeIdentity: row.codeIdentity,
  evidenceRef: row.evidenceRef,
  recordedAt: row.recordedAt,
  executionMode: row.executionMode,
  freshSuites: row.freshSuites,
  reusedSuites: row.reusedSuites,
  exitCode: row.exitCode,
  tasks: row.taskTimeline.map(
    ({ name, executed, exitCode, reused, sourceRow }) => ({
      name,
      executed,
      exitCode,
      ...(reused ? { reused, sourceRow } : {}),
    }),
  ),
});

function gateInAnotherSession(repo, table, session) {
  const code =
    `import {runGate} from ${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)};\n` +
    `const row=await runGate(["--serial"],${JSON.stringify(repo)},{table:${JSON.stringify(table)}});console.log("ROW "+JSON.stringify(row));process.exitCode=row.exitCode;`;
  const result = spawnSync(
    "bash",
    [
      "-c",
      'exec "$1" --input-type=module -e "$2"',
      session,
      process.execPath,
      code,
    ],
    {
      cwd: repo,
      encoding: "utf8",
      // Outside a gate the nested gate waits for host lanes like any other.
      timeout: 120000,
      maxBuffer: 16 * 1024 * 1024,
      env: {
        ...process.env,
        DOTLN_SESSION_ID: session,
        CODEX_THREAD_ID: session,
      },
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return JSON.parse(
    result.stdout
      .split("\n")
      .find((line) => line.startsWith("ROW "))
      .slice(4),
  );
}

test("WO-186 one failed task reruns alone in another shell and session, composes a claimable row and carries it into review", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const first = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.equal(first.identityUnchanged, true);
  assert.deepEqual(observed(), ["build", "alpha", "beta"]);
  rmSync(join(repo, "fail-beta"));
  const code =
    `import {runGate} from ${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)};\n` +
    `const row = await runGate(["--serial"], ${JSON.stringify(repo)}, {table:${JSON.stringify(table)}}); console.log("ROW " + JSON.stringify(row)); process.exitCode = row.exitCode;`;
  const result = spawnSync(
    "bash",
    [
      "-c",
      'exec "$1" --input-type=module -e "$2"',
      "task-reuse-second-session",
      process.execPath,
      code,
    ],
    {
      cwd: repo,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      env: {
        ...process.env,
        DOTLN_SESSION_ID: "task-reuse-second-session",
        CODEX_THREAD_ID: "task-reuse-second-session",
      },
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const second = JSON.parse(
    result.stdout
      .split("\n")
      .find((line) => line.startsWith("ROW "))
      .slice(4),
  );
  assert.deepEqual(observed(), ["build", "alpha", "beta", "beta"]);
  assert.equal(second.freshSuites, 1);
  assert.equal(second.reusedSuites, 2);
  for (const name of ["build", "alpha"]) {
    const pass = second.taskTimeline.find((row) => row.name === name);
    assert.equal(pass.sourceRow.recordedAt, first.recordedAt);
    assert.equal(pass.sourceRow.codeIdentity, first.codeIdentity);
    assert.equal(pass.sourceRow.task, name);
  }
  assert.equal(
    second.taskTimeline.find((row) => row.name === "beta").reused,
    undefined,
  );
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const claim = await requireGateClaims(repo, {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  });
  assert.equal(claim.productGate.codeIdentity, second.codeIdentity);
  assert.deepEqual(claim.advisories, []);
  t.diagnostic(
    "PROOF WO-186 task reuse " +
      JSON.stringify({
        shell: "bash",
        session: "task-reuse-second-session",
        first: gateProof(first),
        second: gateProof(second),
        claimAccepted: true,
      }),
  );
  for (const args of [["--again"], ["--review"]]) {
    const before = observed().length;
    const fresh = await runGate(["--serial", ...args], repo, { table });
    assert.equal(fresh.exitCode, 0);
    assert.equal(fresh.reusedSuites, args.includes("--again") ? 0 : 3);
    assert.deepEqual(
      observed().slice(before),
      args.includes("--again") ? ["build", "alpha", "beta"] : [],
    );
  }
});

test("WO-186 stopped, partial, timed-out and failed task observations never reuse; untracked edits invalidate and staging is stable", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again"], repo, { table });
  const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
  for (const extra of [
    { stopped: true },
    { partial: true },
    { partial: null },
    { partial: 0 },
    { excludedSuites: ["missing"] },
    { timedOut: true },
    { exitCode: 1 },
    { failureKind: "timeout" },
  ]) {
    writeFileSync(join(repo, "scripts/new.mjs"), JSON.stringify(extra));
    const identity = gateCodeIdentity(repo);
    recordGateChecks(repo, [
      {
        ...first,
        codeIdentity: identity,
        evidenceRef: "fixture:unusable-task",
        recordedAt: new Date().toISOString(),
        taskTimeline: first.taskTimeline.map((task) => ({ ...task, ...extra })),
      },
    ]);
    assert.equal(
      (await coveringTaskResults(repo, "npm test", table, identity)).results
        .size,
      0,
      JSON.stringify(extra),
    );
  }
  const green = await runGate(["--serial", "--again"], repo, { table });
  writeFileSync(join(repo, "scripts/new.mjs"), "export const change = 2;\n");
  assert.notEqual(gateCodeIdentity(repo), green.codeIdentity);
  const edited = gateCodeIdentity(repo);
  runGit(repo, ["add", "scripts/new.mjs"]);
  assert.equal(gateCodeIdentity(repo), edited);
  const before = observed().length;
  const fresh = await runGate(["--serial"], repo, { table });
  assert.equal(fresh.reusedSuites, 0);
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
});

test("WO-186 a fresh worktree reads main's passes without modifying main, while a changed source runs", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again"], repo, { table });
  const index = join(repo, "docs/control/local/harness/checks.json");
  const bytes = readFileSync(index);
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-worktree`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  assert.equal(gateCodeIdentity(worktree), first.codeIdentity);
  const reused = gateInAnotherSession(
    worktree,
    table,
    "main-reuse-second-session",
  );
  assert.equal(reused.exitCode, 0);
  assert.equal(reused.freshSuites, 0);
  assert.equal(reused.reusedSuites, 3);
  assert.deepEqual(observed(worktree), []);
  assert.ok(
    reused.taskTimeline.every((row) => row.sourceRow.location === "main"),
  );
  assert.deepEqual(readFileSync(index), bytes);
  t.diagnostic(
    "PROOF WO-186 main reuse " +
      JSON.stringify({
        shell: "bash",
        session: "main-reuse-second-session",
        main: gateProof(first),
        worktree: gateProof(reused),
        mainUnchanged: true,
        suitesStarted: observed(worktree),
      }),
  );
  writeFileSync(
    join(worktree, "scripts/alpha.mjs"),
    readFileSync(join(worktree, "scripts/alpha.mjs"), "utf8") + "// own edit\n",
  );
  const changed = gateInAnotherSession(
    worktree,
    table,
    "main-reuse-changed-session",
  );
  assert.equal(changed.reusedSuites, 0);
  assert.deepEqual(observed(worktree), ["build", "alpha", "beta"]);
  assert.deepEqual(readFileSync(index), bytes);
});

// The build publishes an ignored output from identity-covered source and
// beta judges that output, as a compiled package and its tests do.
function builtOutputFixture(t) {
  const fixture = taskReuseFixture(t);
  const { repo } = fixture;
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "built-value\n",
  );
  writeFileSync(
    join(repo, "scripts/build.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "build\\n");\n' +
      'fs.copyFileSync("scripts/value.mjs", "built-value");\n',
  );
  writeFileSync(
    join(repo, "scripts/beta.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "beta\\n");\n' +
      'if(fs.existsSync("fail-beta")||fs.readFileSync("built-value","utf8").includes("bad"))process.exit(1);\n',
  );
  const value = (text) =>
    writeFileSync(
      join(repo, "scripts/value.mjs"),
      `export default ${JSON.stringify(text)};\n`,
    );
  const task = (row, name) =>
    row.taskTimeline.find((item) => item.name === name);
  const table = fixture.table.map((row) =>
    row.build ? { ...row, outputs: ["built-value"] } : row,
  );
  return { ...fixture, table, value, task };
}

test("WO-186 VER-001 a build output made at another identity is rebuilt before a task runs, so a returned-to identity keeps its failure", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("bad");
  const a = gateCodeIdentity(repo);
  const failed = await runGate(["--serial"], repo, { table });
  assert.equal(failed.exitCode, 1);
  assert.equal(failed.codeIdentity, a);
  assert.equal(failed.identityUnchanged, true);
  value("good");
  const elsewhere = await runGate(["--serial"], repo, { table });
  assert.equal(elsewhere.exitCode, 0);
  assert.notEqual(elsewhere.codeIdentity, a);
  // Source returns to A while the ignored output still holds B's build.
  value("bad");
  assert.equal(gateCodeIdentity(repo), a);
  assert.match(readFileSync(join(repo, "built-value"), "utf8"), /good/u);
  const before = observed().length;
  const returned = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(returned.exitCode, 1);
  assert.equal(returned.codeIdentity, a);
  assert.equal(task(returned, "build").reused, undefined);
  assert.equal(task(returned, "beta").exitCode, 1);
  assert.equal(task(returned, "alpha").sourceRow.recordedAt, failed.recordedAt);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  await assert.rejects(
    () =>
      requireGateClaims(repo, {
        checked: true,
        claims: { plain: ["3"], review: [], document: [] },
      }),
    /no passing complete npm test row/u,
  );
  // With A's output back on disk the build's pass is carried again: beta
  // alone runs, against A's build, and still fails.
  const again = observed().length;
  const repeated = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(again), ["beta"]);
  assert.equal(repeated.exitCode, 1);
  assert.equal(task(repeated, "build").outputAttested, true);
  assert.equal(
    task(repeated, "build").sourceRow.recordedAt,
    returned.recordedAt,
  );
});

test("WO-186 VER-001 a task's latest executed result decides: a forced-fresh failure runs again, and a carried result names the row that executed it", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("good");
  const green = await runGate(["--serial"], repo, { table });
  assert.equal(green.exitCode, 0);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const forced = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(forced.exitCode, 1);
  assert.equal(forced.codeIdentity, green.codeIdentity);
  assert.equal(forced.identityUnchanged, true);
  // The older complete pass no longer answers for beta: the claim check
  // refuses it and names the task, and beta runs alone beside the attested
  // build.
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  const refused = await coveringGateCheck(repo, "npm test", []);
  assert.equal(refused.row, undefined);
  assert.equal(refused.displaced.row.recordedAt, green.recordedAt);
  assert.deepEqual(refused.displaced.tasks, ["beta"]);
  await assert.rejects(
    () => requireGateClaims(repo, ledger),
    /no passing complete npm test row stands[^]*names beta, whose latest execution there can no longer be carried/u,
  );
  let before = observed().length;
  const stillFailing = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(stillFailing.exitCode, 1);
  assert.equal(task(stillFailing, "build").outputAttested, true);
  await assert.rejects(
    () => requireGateClaims(repo, ledger),
    /can no longer be carried/u,
  );
  rmSync(join(repo, "fail-beta"));
  before = observed().length;
  const repaired = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(repaired.exitCode, 0);
  assert.equal(repaired.executionMode, "composed");
  assert.equal(task(repaired, "beta").reused, undefined);
  // Build and alpha last ran in the forced-fresh attempt, not in the first
  // green row.
  for (const name of ["build", "alpha"])
    assert.equal(task(repaired, name).sourceRow.recordedAt, forced.recordedAt);
  // With every task settled no suite starts, and each carried result names
  // its executing row rather than the composed row it passed through.
  before = observed().length;
  const settled = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), []);
  assert.equal(settled.exitCode, 0);
  assert.equal(settled.reusedSuites, 3);
  for (const name of ["build", "alpha"])
    assert.equal(task(settled, name).sourceRow.recordedAt, forced.recordedAt);
  assert.equal(task(settled, "beta").sourceRow.recordedAt, repaired.recordedAt);
  const claim = await requireGateClaims(repo, ledger);
  assert.equal(claim.productGate.codeIdentity, green.codeIdentity);
  assert.deepEqual(claim.advisories, []);
  // Once beta's latest run passes, the first green row stands again too, as
  // a review row does after a flaky task is rerun.
  const standing = await coveringGateCheck(repo, "npm test", []);
  assert.equal(standing.displaced, undefined);
  assert.ok(
    standing.candidates.some((row) => row.recordedAt === green.recordedAt),
  );
});

test("WO-186 VER-001 a build output that changes while the gate runs fails the row and none of its passes is carried", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "drift\n",
  );
  // Alpha stands for any writer that replaces the output after the build.
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "alpha\\n");\n' +
      'if(fs.existsSync("drift"))fs.writeFileSync("built-value","export default \\"good\\";\\n");\n',
  );
  value("bad");
  writeFileSync(join(repo, "drift"), "drift\n");
  const drifted = await runGate(["--serial", "--again"], repo, { table });
  // Beta passed against an output this identity's build never made.
  assert.equal(task(drifted, "beta").exitCode, 0);
  assert.equal(drifted.identityUnchanged, true);
  assert.equal(drifted.buildOutputUnchanged, false);
  assert.equal(drifted.exitCode, 1);
  const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table)).results.size,
    0,
  );
  rmSync(join(repo, "drift"));
  const before = observed().length;
  const honest = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
  assert.equal(honest.buildOutputUnchanged, true);
  assert.equal(honest.exitCode, 1);
  assert.equal(task(honest, "beta").exitCode, 1);
});

test("WO-186 VER-001 an output changed or removed outside its attested build is rebuilt, and an undeclared output is never carried beside a task", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("good");
  const failBeta = join(repo, "fail-beta");
  writeFileSync(failBeta, "fail\n");
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.match(task(first, "build").outputDigest, /^[a-f0-9]{64}$/u);
  rmSync(failBeta);
  // Another writer replaces the ignored output without a gate build. Carrying
  // the build's pass would hand beta an output no row attested.
  writeFileSync(join(repo, "built-value"), 'export default "bad";\n');
  let before = observed().length;
  const rebuilt = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(rebuilt.exitCode, 0);
  assert.equal(task(rebuilt, "build").reused, undefined);
  // A removed output is not attested either.
  writeFileSync(failBeta, "fail\n");
  assert.equal(
    (await runGate(["--serial", "--again"], repo, { table })).exitCode,
    1,
  );
  rmSync(failBeta);
  rmSync(join(repo, "built-value"));
  before = observed().length;
  const restored = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(restored.exitCode, 0);
  // A build row that declares no outputs records no digest, so its pass is
  // never carried beside a task that runs.
  const undeclared = table.map(({ outputs, ...row }) =>
    row.build ? row : { ...row, ...(outputs ? { outputs } : {}) },
  );
  writeFileSync(failBeta, "fail\n");
  const unattested = await runGate(["--serial", "--again"], repo, {
    table: undeclared,
  });
  assert.equal(unattested.exitCode, 1);
  assert.equal(task(unattested, "build").outputDigest, undefined);
  rmSync(failBeta);
  before = observed().length;
  const fresh = await runGate(["--serial"], repo, { table: undeclared });
  assert.deepEqual(observed().slice(before), ["build", "beta"]);
  assert.equal(fresh.exitCode, 0);
  // A row in which no task runs consumes no output and carries every pass.
  before = observed().length;
  const settled = await runGate(["--serial"], repo, { table: undeclared });
  assert.deepEqual(observed().slice(before), []);
  assert.equal(settled.reusedSuites, 3);
});

test("WO-186 VER-001 a later failed gate displaces older passes, and a carried result is never itself evidence", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const { coveringTaskResults } = await import("./lib/gate-reuse.mjs");
  const carried = async (identity) =>
    (await coveringTaskResults(repo, "npm test", table, identity)).results;
  // Each gate-level failure follows a clean pass at the same identity. Every
  // task passed inside the failed row, and the older clean row still exists.
  for (const taint of [
    { abandonedRoots: ["/tmp/dotln-host-confinement-left"] },
    { memory: { failure: { failureKind: "memory-budget" } } },
    { identityUnchanged: false },
    { stopped: true },
    { timedOut: true },
    { failureKind: "monitor-unavailable" },
  ]) {
    const clean = await runGate(["--serial", "--again"], repo, { table });
    assert.equal(clean.exitCode, 0);
    assert.equal((await carried(clean.codeIdentity)).size, 3);
    recordGateChecks(repo, [
      {
        ...clean,
        exitCode: 1,
        ...taint,
        evidenceRef: "fixture:failed-gate",
        recordedAt: new Date(Date.parse(clean.recordedAt) + 1).toISOString(),
      },
    ]);
    assert.equal(
      (await carried(clean.codeIdentity)).size,
      0,
      JSON.stringify(taint),
    );
  }
  // One task's later timeout displaces that task alone.
  const clean = await runGate(["--serial", "--again"], repo, { table });
  recordGateChecks(repo, [
    {
      ...clean,
      exitCode: 1,
      identityUnchanged: true,
      evidenceRef: "fixture:one-timeout",
      recordedAt: new Date(Date.parse(clean.recordedAt) + 1).toISOString(),
      taskTimeline: clean.taskTimeline.map((item) =>
        item.name === "beta"
          ? { ...item, exitCode: 1, timedOut: true, failureKind: "timeout" }
          : item,
      ),
    },
  ]);
  assert.deepEqual([...(await carried(clean.codeIdentity)).keys()].sort(), [
    "alpha",
    "build",
  ]);
  // Overlapping gates: the row recorded last holds beta's earlier pass, and
  // the row recorded first holds its later failure. The later run decides.
  writeFileSync(join(repo, "scripts/new.mjs"), "export const overlap = 1;\n");
  const overlapping = gateCodeIdentity(repo);
  const base = Date.now() + 60_000;
  const at = (ms) => new Date(base + ms).toISOString();
  const overlap = (recordedMs, finishedMs, beta) => ({
    ...clean,
    codeIdentity: overlapping,
    exitCode: beta.exitCode ?? 0,
    identityUnchanged: true,
    evidenceRef: `fixture:overlap-${recordedMs}`,
    recordedAt: at(recordedMs),
    taskTimeline: clean.taskTimeline.map((item) =>
      item.name === "beta"
        ? { ...item, ...beta, finishedAt: at(finishedMs) }
        : { ...item, finishedAt: at(500) },
    ),
  });
  recordGateChecks(repo, [
    overlap(10_000, 1_000, {}),
    overlap(8_000, 3_000, { exitCode: 1 }),
  ]);
  assert.deepEqual([...(await carried(overlapping)).keys()].sort(), [
    "alpha",
    "build",
  ]);
  // A result with no finish time cannot be ordered and supplies nothing.
  const identityFor = (text) => {
    writeFileSync(join(repo, "scripts/new.mjs"), text);
    return gateCodeIdentity(repo);
  };
  const stamp = (ms) => new Date(Date.now() + ms).toISOString();
  const unfinished = identityFor("export const unfinished = 1;\n");
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: unfinished,
      evidenceRef: "fixture:unfinished",
      recordedAt: stamp(0),
      taskTimeline: clean.taskTimeline.map(({ finishedAt, ...item }) => item),
    },
  ]);
  assert.equal((await carried(unfinished)).size, 0);
  // A task that never started in a later row leaves its older pass carried.
  const unstarted = identityFor("export const unstarted = 1;\n");
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: unstarted,
      evidenceRef: "fixture:whole",
      recordedAt: stamp(0),
    },
    {
      ...clean,
      codeIdentity: unstarted,
      exitCode: 1,
      identityUnchanged: true,
      evidenceRef: "fixture:unstarted",
      recordedAt: stamp(1000),
      taskTimeline: clean.taskTimeline.map((item) =>
        item.name === "beta"
          ? { name: "beta", exitCode: 1, executed: false, durationMs: 0 }
          : { ...item, finishedAt: stamp(1000) },
      ),
    },
  ]);
  assert.deepEqual([...(await carried(unstarted)).keys()].sort(), [
    "alpha",
    "beta",
    "build",
  ]);
  // A later row that repeats a name cannot say which result ran: it supplies
  // nothing and displaces every task it names.
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: unstarted,
      evidenceRef: "fixture:repeated",
      recordedAt: stamp(2000),
      taskTimeline: [
        ...clean.taskTimeline,
        clean.taskTimeline.find((item) => item.name === "beta"),
      ],
    },
  ]);
  assert.equal((await carried(unstarted)).size, 0);
  // A row holding only carried results supplies nothing at an identity with
  // no execution, whatever source it names.
  writeFileSync(join(repo, "scripts/new.mjs"), "export const lone = 1;\n");
  const lone = gateCodeIdentity(repo);
  recordGateChecks(repo, [
    {
      ...clean,
      codeIdentity: lone,
      evidenceRef: "fixture:carried-only",
      recordedAt: new Date().toISOString(),
      taskTimeline: clean.taskTimeline.map(({ name }) => ({
        name,
        executed: true,
        exitCode: 0,
        durationMs: 0,
        reused: true,
        sourceRow: {
          task: name,
          codeIdentity: lone,
          evidenceRef: "fixture:absent",
          recordedAt: clean.recordedAt,
          location: "worktree",
        },
      })),
    },
  ]);
  assert.equal((await carried(lone)).size, 0);
});

test("WO-186 VER-001 a pass carried from main is re-validated against main's latest execution", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again"], repo, { table });
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-revalidate`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  const carried = await runGate(["--serial"], worktree, { table });
  assert.equal(carried.freshSuites, 0);
  assert.deepEqual(observed(worktree), []);
  // Main then fails beta at the same identity in a forced-fresh run.
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const mainFailed = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(mainFailed.exitCode, 1);
  assert.equal(mainFailed.codeIdentity, first.codeIdentity);
  const index = join(repo, "docs/control/local/harness/checks.json");
  const bytes = readFileSync(index);
  const rerun = await runGate(["--serial"], worktree, { table });
  assert.deepEqual(observed(worktree), ["beta"]);
  assert.equal(rerun.exitCode, 0);
  const task = (row, name) =>
    row.taskTimeline.find((item) => item.name === name);
  assert.equal(task(rerun, "beta").reused, undefined);
  assert.equal(task(rerun, "alpha").sourceRow.location, "main");
  assert.equal(
    task(rerun, "alpha").sourceRow.recordedAt,
    mainFailed.recordedAt,
  );
  assert.deepEqual(readFileSync(index), bytes);
  // The worktree's own execution of beta now decides for it.
  const settled = await runGate(["--serial"], worktree, { table });
  assert.deepEqual(observed(worktree), ["beta"]);
  assert.equal(settled.reusedSuites, 3);
  assert.equal(task(settled, "beta").sourceRow.location, "worktree");
  for (const name of ["build", "alpha"]) {
    assert.equal(task(settled, name).sourceRow.location, "main");
    assert.equal(
      task(settled, name).sourceRow.recordedAt,
      mainFailed.recordedAt,
    );
  }
});

test("WO-186 VER-001 an attested output is carried in another session, and a worktree without main's output builds before its task", async (t) => {
  const { repo, table, observed, value, task } = builtOutputFixture(t);
  value("good");
  runGit(repo, ["add", "."]);
  runGit(repo, ["commit", "-qm", "built output fixture"]);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 1);
  // A linked worktree at the same identity has never been built: main's
  // build pass does not speak for an output that is not there.
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-unbuilt`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  assert.equal(gateCodeIdentity(worktree), first.codeIdentity);
  assert.equal(existsSync(join(worktree, "built-value")), false);
  const built = gateInAnotherSession(worktree, table, "unbuilt-worktree");
  assert.deepEqual(observed(worktree), ["build", "beta"]);
  assert.equal(task(built, "build").reused, undefined);
  assert.equal(task(built, "alpha").sourceRow.location, "main");
  // With every task settled there, a further session starts no suite.
  const settled = gateInAnotherSession(worktree, table, "settled-worktree");
  assert.deepEqual(observed(worktree), ["build", "beta"]);
  assert.equal(settled.reusedSuites, 3);
  // In main the output is still the one its failed row attested, so another
  // shell and session runs the failed task alone.
  rmSync(join(repo, "fail-beta"));
  const before = observed().length;
  const rerun = gateInAnotherSession(repo, table, "attested-main");
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(rerun.freshSuites, 1);
  assert.equal(task(rerun, "build").outputAttested, true);
  assert.equal(task(rerun, "build").sourceRow.recordedAt, first.recordedAt);
});

test("WO-186 VER-001 the build output digest covers wildcard directories by bytes and refuses what it cannot cover", async (t) => {
  const { buildOutputDigest } = await import("./lib/gate-reuse.mjs");
  const root = mkdtempSync(join(tmpdir(), "dotln-output-digest-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const name of ["a", "b"]) {
    mkdirSync(join(root, `pk/${name}/dist/src`), { recursive: true });
    writeFileSync(join(root, `pk/${name}/dist/src/index.js`), `${name}-one\n`);
  }
  mkdirSync(join(root, "pk/unbuilt/src"), { recursive: true });
  // Finder leaves this plain file beside the package directories.
  writeFileSync(join(root, "pk/.DS_Store"), "metadata\n");
  const wildcard = ["pk/*/dist"];
  const digest = buildOutputDigest(root, wildcard);
  assert.match(digest, /^[a-f0-9]{64}$/u);
  // The wildcard names the same files as the directories spelled out.
  assert.equal(buildOutputDigest(root, ["pk/a/dist", "pk/b/dist"]), digest);
  assert.notEqual(buildOutputDigest(root, ["pk/a/dist"]), digest);
  // Bytes decide, also at an unchanged length; metadata beside or inside the
  // output does not.
  writeFileSync(join(root, "pk/b/dist/src/index.js"), "b-two\n");
  const changed = buildOutputDigest(root, wildcard);
  assert.notEqual(changed, digest);
  writeFileSync(join(root, "pk/.DS_Store"), "other metadata\n");
  writeFileSync(join(root, "pk/a/dist/.DS_Store"), "metadata\n");
  assert.equal(buildOutputDigest(root, wildcard), changed);
  writeFileSync(join(root, "pk/a/dist/src/extra.test.js"), "");
  assert.notEqual(buildOutputDigest(root, wildcard), changed);
  // No digest without a declaration, for a declaration that matches no file,
  // and for an output whose content a link or special file would hide.
  assert.equal(buildOutputDigest(root, undefined), undefined);
  assert.equal(buildOutputDigest(root, ["pk/*/missing"]), undefined);
  assert.equal(buildOutputDigest(root, ["pk/.DS_Store/dist"]), undefined);
  symlinkSync("index.js", join(root, "pk/b/dist/src/alias.js"));
  assert.equal(buildOutputDigest(root, wildcard), undefined);
  rmSync(join(root, "pk/b/dist/src/alias.js"));
  symlinkSync("a", join(root, "pk/linked"));
  assert.equal(buildOutputDigest(root, wildcard), undefined);
  rmSync(join(root, "pk/linked"));
  assert.match(buildOutputDigest(root, wildcard), /^[a-f0-9]{64}$/u);
  // An empty list declares a build that publishes nothing.
  assert.match(buildOutputDigest(root, []), /^[a-f0-9]{64}$/u);
  // The real table's build declares the output its tasks consume; without
  // this declaration its pass would be attested trivially or never.
  assert.deepEqual(suites.find((row) => row.build).outputs, [
    "packages/*/dist",
  ]);
});

test("WO-186 VER-001 a wildcard output beside a plain file is attested, a failed task reruns alone, and a carried build's output is still judged at the end", async (t) => {
  const { repo, observed, value, task, table: base } = builtOutputFixture(t);
  // The real table's shape: a wildcard over package directories, with an
  // ignored plain file beside them.
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "pk/\ndrift\nfail-alpha\n",
  );
  writeFileSync(
    join(repo, "scripts/build.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "build\\n");\n' +
      'fs.mkdirSync("pk/a/dist", { recursive: true }); fs.writeFileSync("pk/.DS_Store", "metadata\\n");\n' +
      'fs.copyFileSync("scripts/value.mjs", "pk/a/dist/value.mjs");\n',
  );
  writeFileSync(
    join(repo, "scripts/alpha.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "alpha\\n");\n' +
      'if(fs.existsSync("drift"))fs.writeFileSync("pk/a/dist/value.mjs","export default \\"evil\\";\\n");\n' +
      'if(fs.existsSync("fail-alpha"))process.exit(1);\n',
  );
  writeFileSync(
    join(repo, "scripts/beta.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "beta\\n");\n' +
      'if(fs.readFileSync("pk/a/dist/value.mjs","utf8").includes("bad"))process.exit(1);\n',
  );
  const table = base.map((row) =>
    row.build ? { ...row, outputs: ["pk/*/dist"] } : row,
  );
  value("good");
  writeFileSync(join(repo, "fail-alpha"), "fail\n");
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.match(task(first, "build").outputDigest, /^[a-f0-9]{64}$/u);
  assert.equal(first.buildOutputUnchanged, true);
  assert.equal(first.buildOutputAttested, undefined);
  // Alpha reruns alone beside the attested build, and this time replaces the
  // output while the gate runs. Every task has a pass; the row does not.
  rmSync(join(repo, "fail-alpha"));
  writeFileSync(join(repo, "drift"), "drift\n");
  let before = observed().length;
  const drifted = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["alpha"]);
  assert.equal(task(drifted, "build").outputAttested, true);
  assert.equal(task(drifted, "alpha").exitCode, 0);
  assert.equal(drifted.buildOutputUnchanged, false);
  assert.equal(drifted.exitCode, 1);
  // Nothing of that row is carried, and the output is rebuilt before a task.
  rmSync(join(repo, "drift"));
  before = observed().length;
  const rebuilt = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["build", "alpha"]);
  assert.equal(rebuilt.exitCode, 0);
  assert.equal(task(rebuilt, "beta").sourceRow.recordedAt, first.recordedAt);
  // A declared output the build cannot attest: the gate may pass, says so,
  // and supplies nothing to a later run.
  const dangling = base.map((row) =>
    row.build ? { ...row, outputs: ["pk/*/absent"] } : row,
  );
  const unattested = await runGate(["--serial", "--again"], repo, {
    table: dangling,
  });
  assert.equal(unattested.exitCode, 0);
  assert.equal(task(unattested, "build").outputDigest, undefined);
  assert.equal(unattested.buildOutputAttested, false);
  before = observed().length;
  const again = await runGate(["--serial"], repo, { table: dangling });
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
  assert.equal(again.reusedSuites, 0);
});

test("WO-186 VER-001 a failed single-suite, machinery or partial run displaces an older pass, and a run under another check supplies none", async (t) => {
  const { repo, table: base, observed } = taskReuseFixture(t);
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "fail-machine\n",
  );
  // An uncommitted machinery edit selects its suite for review.
  writeFileSync(
    join(repo, "scripts/machine.mjs"),
    'import fs from "node:fs"; fs.appendFileSync("observed.jsonl", "machine\\n");\n' +
      'if(fs.existsSync("fail-machine"))process.exit(1);\n',
  );
  const table = base;
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  const review = await runGate(["--serial", "--review"], repo, { table });
  assert.equal(review.exitCode, 0);
  assert.ok(review.requiredSuites.includes("machine"));
  const rows = () => readGateChecks(repo);
  // A passing single-suite run keeps its row under its own check, which
  // answers no claim and changes none.
  let count = rows().length;
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], repo, { table })).exitCode,
    0,
  );
  assert.equal(rows().length, count + 1);
  assert.equal(rows().at(-1).checkId, "suite:beta");
  assert.equal(
    (await coveringGateCheck(repo, "npm test", [])).row.recordedAt,
    review.recordedAt,
  );
  // A failing one is that task's latest run: the claim is refused for it,
  // and the next plain run runs it instead of carrying.
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const only = await runGate(["--only", "beta", "--serial"], repo, { table });
  assert.equal(only.exitCode, 1);
  assert.equal(only.checkId, "suite:beta");
  assert.equal(rows().length, count + 2);
  const refused = await coveringGateCheck(repo, "npm test", []);
  assert.equal(refused.row, undefined);
  assert.deepEqual(refused.displaced.tasks, ["beta"]);
  await assert.rejects(
    () => requireGateClaims(repo, ledger),
    /no passing complete npm test row stands[^]*beta/u,
  );
  let before = observed().length;
  const masked = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(masked.exitCode, 1);
  // A later passing single-suite run answers no claim: beta still runs.
  rmSync(join(repo, "fail-beta"));
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], repo, { table })).exitCode,
    0,
  );
  before = observed().length;
  const settled = await runGate(["--serial"], repo, { table });
  assert.deepEqual(observed().slice(before), ["beta"]);
  assert.equal(settled.exitCode, 0);
  assert.deepEqual((await requireGateClaims(repo, ledger)).advisories, []);
  // A failed machinery run displaces the review row for its suite alone.
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["machine"])).row.recordedAt,
    review.recordedAt,
  );
  writeFileSync(join(repo, "fail-machine"), "fail\n");
  count = rows().length;
  const machinery = await runGate(["--machinery", "--serial"], repo, { table });
  assert.equal(machinery.exitCode, 1);
  assert.equal(rows().length, count + 1);
  const narrowed = await coveringGateCheck(repo, "npm test", ["machine"]);
  assert.equal(narrowed.row, undefined);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", [])).row.recordedAt,
    settled.recordedAt,
  );
  // Once the suite passes again under that check, the review row stands
  // again: no fresh review gate is owed for a failure that was answered.
  rmSync(join(repo, "fail-machine"));
  assert.equal(
    (await runGate(["--machinery", "--serial"], repo, { table })).exitCode,
    0,
  );
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["machine"])).row.recordedAt,
    review.recordedAt,
  );
  // The document gate follows document bytes the identity excludes and is
  // judged fresh at every completion: its rows neither supply nor displace.
  recordGateChecks(repo, [
    {
      ...settled,
      checkId: "npm run test:docs",
      exitCode: 1,
      evidenceRef: "fixture:document-failure",
      recordedAt: new Date(Date.now() + 500).toISOString(),
      taskTimeline: review.taskTimeline
        .filter((item) => item.name === "alpha")
        .map((item) => ({
          ...item,
          exitCode: 1,
          finishedAt: new Date(Date.now() + 500).toISOString(),
        })),
    },
  ]);
  assert.equal(
    (await coveringGateCheck(repo, "npm test", ["machine"])).row.recordedAt,
    review.recordedAt,
  );
  // A partial run's failure displaces too, and its passes supply nothing.
  recordGateChecks(repo, [
    {
      ...settled,
      checkId: CONFINED_PARTIAL_CHECK,
      partial: true,
      excludedSuites: [],
      exitCode: 1,
      evidenceRef: "fixture:partial-failure",
      recordedAt: new Date(Date.now() + 1000).toISOString(),
      taskTimeline: settled.taskTimeline
        .filter((item) => !item.reused)
        .map((item) => ({
          ...item,
          exitCode: 1,
          finishedAt: new Date(Date.now() + 1000).toISOString(),
        })),
    },
  ]);
  assert.deepEqual(
    [
      ...(
        await coveringTaskResults(
          repo,
          "npm test",
          table.filter((row) => !row.machinery),
        )
      ).results.keys(),
    ].sort(),
    ["alpha", "build"],
  );
  writeFileSync(join(repo, "scripts/new.mjs"), "export const lone = 2;\n");
  const lone = gateCodeIdentity(repo);
  recordGateChecks(repo, [
    {
      ...settled,
      checkId: "suite:beta",
      codeIdentity: lone,
      evidenceRef: "fixture:other-check-pass",
      recordedAt: new Date().toISOString(),
      taskTimeline: review.taskTimeline,
    },
  ]);
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table, lone)).results.size,
    0,
  );
});

test("WO-186 VER-001 an unresolvable main leaves the lookup with the worktree's own rows", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  // Main is checked out in a linked worktree whose directory is then lost
  // while Git still registers it; the primary checkout works on another branch.
  runGit(repo, ["checkout", "-q", "-b", "work"]);
  const gone = join(dirname(repo), `${repo.split("/").at(-1)}-gone-main`);
  t.after(() => rmSync(gone, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", gone, "main"]);
  rmSync(gone, { recursive: true, force: true });
  const { mainWorktree } = await import("./lib/git.mjs");
  assert.equal(existsSync(mainWorktree(repo)), false);
  const { coveringGateCheck, coveringTaskResults, gateCandidates } =
    await import("./lib/gate-reuse.mjs");
  // No local row yet: the lookup answers with nothing instead of throwing.
  assert.deepEqual(
    (({ rows, location }) => ({ rows, location }))(
      await gateCandidates(repo, "npm test"),
    ),
    { rows: [], location: "worktree" },
  );
  assert.equal(
    (await coveringTaskResults(repo, "npm test", table)).results.size,
    0,
  );
  assert.equal((await coveringGateCheck(repo, "npm test", [])).row, undefined);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  await assert.rejects(
    () =>
      requireGateClaims(repo, {
        checked: true,
        claims: { plain: ["5"], review: [], document: [] },
      }),
    /no passing complete npm test row/u,
  );
  const first = await runGate(["--serial"], repo, { table });
  assert.equal(first.exitCode, 0);
  assert.deepEqual(observed(), ["build", "alpha", "beta"]);
  const second = await runGate(["--serial"], repo, { table });
  assert.equal(second.reusedSuites, 3);
  assert.deepEqual(observed(), ["build", "alpha", "beta"]);
  assert.ok(
    second.taskTimeline.every((row) => row.sourceRow.location === "worktree"),
  );
});

test("WO-186 VER-001 a pass carried from main has no execution to stand on while main cannot be consulted", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  await runGate(["--serial", "--again"], repo, { table });
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-orphaned`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  const carried = await runGate(["--serial"], worktree, { table });
  assert.equal(carried.reusedSuites, 3);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["5"], review: [], document: [] },
  };
  assert.deepEqual((await requireGateClaims(worktree, ledger)).advisories, []);
  // The primary checkout leaves main, so no checkout answers for it.
  runGit(repo, ["checkout", "-q", "-b", "parked"]);
  await assert.rejects(
    () => requireGateClaims(worktree, ledger),
    /names build, alpha, beta, whose latest execution there can no longer be carried \(a later run did not pass, a later gate that ran it failed, or the row that executed it cannot be read\)/u,
  );
  const rerun = await runGate(["--serial"], worktree, { table });
  assert.deepEqual(observed(worktree), ["build", "alpha", "beta"]);
  assert.equal(rerun.exitCode, 0);
  assert.equal(rerun.reusedSuites, 0);
  assert.deepEqual((await requireGateClaims(worktree, ledger)).advisories, []);
});

test("WO-186 code changing between partial lookup and preflight discards every old-identity pass", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const first = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(first.exitCode, 1);
  assert.equal(first.identityUnchanged, true);
  rmSync(join(repo, "fail-beta"));
  const selection = table.map((row) =>
    row.name === "beta" ? { ...row, needs: OUTSIDE_CONFINEMENT } : row,
  );
  const before = observed().length;
  const second = await runGate(["--serial"], repo, {
    table: selection,
    sandbox: {
      env: { CHANGE_DURING_PREFLIGHT: "1" },
      markers: [
        {
          id: "fixture-change",
          env: "CHANGE_DURING_PREFLIGHT",
          deniedDirectory() {
            writeFileSync(
              join(repo, "scripts/alpha.mjs"),
              readFileSync(join(repo, "scripts/alpha.mjs"), "utf8") +
                "// changed during preflight\n",
            );
            return repo;
          },
        },
      ],
    },
  });
  assert.equal(second.exitCode, 0);
  assert.notEqual(second.codeIdentity, first.codeIdentity);
  assert.equal(second.identityUnchanged, true);
  assert.equal(second.reusedSuites, 0);
  assert.deepEqual(observed().slice(before), ["build", "alpha", "beta"]);
  const { completeCoverage } = await import("./lib/suite-evidence.mjs");
  const mismatched = {
    name: "alpha",
    executed: true,
    exitCode: 0,
    reused: true,
    sourceRow: {
      task: "alpha",
      codeIdentity: first.codeIdentity,
      evidenceRef: first.evidenceRef,
      recordedAt: first.recordedAt,
    },
  };
  assert.equal(
    completeCoverage([{ name: "alpha" }], [mismatched], second.codeIdentity),
    false,
  );
  assert.equal(
    completeCoverage([{ name: "alpha" }], [mismatched], first.codeIdentity),
    true,
  );
});

test("WO-186 symbolic source aliases cannot reuse a key that omits ignored target bytes", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const first = await runGate(["--serial", "--again"], repo, { table });
  assert.equal(first.exitCode, 0);
  // This ignored target can change without entering Git's input inventory.
  symlinkSync("../observed.jsonl", join(repo, "scripts/new.mjs"));
  assert.throws(
    () => gateCodeIdentity(repo),
    /symbolic source aliases: scripts\/new\.mjs/,
  );
  await assert.rejects(
    () => runGate(["--serial"], repo, { table }),
    /symbolic source aliases/,
  );
  runGit(repo, ["add", "scripts/new.mjs"]);
  assert.throws(() => gateCodeIdentity(repo), /symbolic source aliases/);
  runGit(repo, ["commit", "-qm", "unsupported symbolic fixture"]);
  assert.throws(
    () => gateCodeIdentity(repo, "HEAD"),
    /symbolic source aliases/,
  );
});

test("WO-186 sibling advancement leaves merge-base selection and the review claim unchanged; own machinery still selects", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  const worktree = join(dirname(repo), `${repo.split("/").at(-1)}-selection`);
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  const runnerShim =
    `import {runGate} from ${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)};\n` +
    `const result=await runGate(process.argv.slice(2),process.cwd(),{table:${JSON.stringify(table)}});process.exitCode=result.exitCode;\n`;
  writeFileSync(join(worktree, "scripts/test-runner.mjs"), runnerShim);
  const passing = await runGate(["--serial", "--review"], worktree, { table });
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const reviewLedger = {
    checked: true,
    claims: { plain: [], review: ["6"], document: [] },
  };
  const initialClaim = await requireGateClaims(worktree, reviewLedger);
  assert.deepEqual(initialClaim.advisories, []);
  const before = changedMachinery(worktree, table).map((row) => row.name);
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  writeFileSync(join(repo, "scripts/machine.mjs"), "// sibling machinery\n");
  runGit(repo, ["commit", "-qam", "sibling machinery"]);
  runGit(repo, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  assert.deepEqual(
    changedMachinery(worktree, table).map((row) => row.name),
    before,
  );
  assert.equal(
    (await coveringGateCheck(worktree, "npm test", passing.requiredSuites)).row
      .codeIdentity,
    passing.codeIdentity,
  );
  const advancedClaim = await requireGateClaims(worktree, reviewLedger);
  assert.deepEqual(advancedClaim, initialClaim);
  writeFileSync(join(worktree, "scripts/machine.mjs"), "// own machinery\n");
  assert.deepEqual(
    changedMachinery(worktree, table).map((row) => row.name),
    ["machine"],
  );
  await assert.rejects(
    () => requireGateClaims(worktree, reviewLedger),
    /npm test -- --review/u,
  );
});

test("WO-112 a census that misses the held launcher retries and never reports the handshake exit", async (t) => {
  const { repo } = taskReuseFixture(t);
  const { registerProcess } = await import("./lib/host-resources.mjs");
  let misses = 0;
  const missing = (pid) => {
    throw new Error(`Cannot register exited process ${pid}`);
  };
  const recovered = await executeSuite(
    {
      name: "missed-twice",
      command: [process.execPath, "-e", "console.log('task ran')"],
      registerProcess: (...args) =>
        misses++ < 2 ? missing(args[1]) : registerProcess(...args),
    },
    repo,
  );
  assert.equal(recovered.exitCode, 0, recovered.output);
  assert.match(recovered.output, /task ran/u);
  assert.equal(misses, 3);
  const unseen = await executeSuite(
    {
      name: "never-seen",
      command: [process.execPath, "-e", "console.log('task ran')"],
      registerProcess: (...args) => missing(args[1]),
    },
    repo,
  );
  assert.equal(unseen.exitCode, 1, unseen.output);
  assert.equal(unseen.failureKind, "monitor-unavailable");
  assert.doesNotMatch(unseen.output, /task ran/u);
});

test("WO-186 product tasks reject reads of untracked active-order reports and retain the five longest cases", async (t) => {
  const { repo } = taskReuseFixture(t);
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  writeFileSync(join(repo, "docs/evidence/WO-999/report.md"), "live report\n");
  writeFileSync(
    join(repo, "scripts/read.mjs"),
    'import fs from "node:fs"; fs.readFileSync("docs/evidence/WO-999/report.md");\n',
  );
  const guarded = await executeSuite(
    {
      name: "read-report",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read.mjs"],
    },
    repo,
  );
  assert.equal(guarded.exitCode, 1, guarded.output);
  assert.match(guarded.output, /reads docs\/evidence\/WO-999\/report.md/u);
  writeFileSync(
    join(repo, "scripts/read-metadata.mjs"),
    'import fs from "node:fs"; const file="docs/evidence/WO-999/report.md"; fs.existsSync(file); fs.statSync(file); await fs.promises.access(file);\n',
  );
  const metadata = await executeSuite(
    {
      name: "report-metadata",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-metadata.mjs"],
    },
    repo,
  );
  assert.equal(metadata.exitCode, 1, metadata.output);
  assert.equal(metadata.excludedReads, 3, metadata.output);
  assert.match(metadata.output, /existsSync/);
  assert.match(metadata.output, /statSync/);
  assert.match(metadata.output, /promises.access/);
  writeFileSync(
    join(repo, "scripts/duplicate-observer.mjs"),
    `import fs from "node:fs"; import cp from "node:child_process"; import assert from "node:assert/strict";
const exists=fs.existsSync, spawn=cp.spawnSync;
await import(${JSON.stringify(new URL("./lib/product-read-guard.mjs?same-manifest", import.meta.url).href)});
assert.equal(fs.existsSync,exists); assert.equal(cp.spawnSync,spawn);
cp.spawnSync(process.execPath,["-e","0"]);
fs.existsSync("docs/evidence/WO-999/report.md");
console.log("duplicate observer retains one installation");\n`,
  );
  const duplicate = await executeSuite(
    {
      name: "duplicate-observer",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/duplicate-observer.mjs"],
    },
    repo,
  );
  assert.equal(duplicate.exitCode, 1, duplicate.output);
  assert.match(duplicate.output, /duplicate observer retains one installation/);
  assert.equal(duplicate.excludedReads, 1, duplicate.output);
  const duplicateEvents = readFileSync(duplicate.productReadLog, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(
    duplicateEvents.filter((event) => event.kind === "child-command").length,
    1,
  );
  writeFileSync(
    join(repo, "docs/evidence/WO-999/promised.md"),
    "promised metadata\n",
  );
  writeFileSync(
    join(repo, "scripts/read-descriptor.mjs"),
    `import fs from "node:fs";
const file="docs/evidence/WO-999/report.md";
const fd=fs.openSync(file,"a"); fs.fstatSync(fd); fs.closeSync(fd);
await new Promise((resolve,reject)=>fs.open(file,"a",(error,fd)=>{
  if(error)return reject(error);
  fs.fstat(fd,(error)=>fs.close(fd,(closed)=>error||closed?reject(error||closed):resolve()));
}));
const handle=await fs.promises.open("docs/evidence/WO-999/promised.md","a"); await handle.stat(); fs.fstatSync(handle.fd);
await new Promise((resolve,reject)=>fs.fstat(handle.fd,(error)=>error?reject(error):resolve()));
await handle.close();
`,
  );
  const descriptors = await executeSuite(
    {
      name: "report-descriptors",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-descriptor.mjs"],
    },
    repo,
  );
  assert.equal(descriptors.exitCode, 1, descriptors.output);
  assert.equal(descriptors.excludedReads, 5, descriptors.output);
  assert.match(descriptors.output, /fstatSync/);
  assert.match(descriptors.output, /\(fstat\)/);
  assert.match(descriptors.output, /FileHandle.stat/);
  assert.match(descriptors.output, /promised.md \(fstatSync\)/);
  assert.match(descriptors.output, /promised.md \(fstat\)/);
  symlinkSync("report.md", join(repo, "docs/evidence/WO-999/link"));
  writeFileSync(
    join(repo, "scripts/read-link-text.mjs"),
    `import fs from "node:fs"; const file="docs/evidence/WO-999/link";
fs.readlinkSync(file); await new Promise((resolve,reject)=>fs.readlink(file,(error)=>error?reject(error):resolve())); await fs.promises.readlink(file);\n`,
  );
  const linkText = await executeSuite(
    {
      name: "report-link-text",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-link-text.mjs"],
    },
    repo,
  );
  assert.equal(linkText.exitCode, 1, linkText.output);
  for (const method of ["readlinkSync", "readlink", "promises.readlink"])
    assert.ok(linkText.output.includes("(" + method + ")"), linkText.output);
  writeFileSync(
    join(repo, "scripts/copy-report.mjs"),
    `import fs from "node:fs"; const file="docs/evidence/WO-999/report.md";
fs.copyFileSync(file,"copy-sync.txt"); fs.cpSync(file,"cp-sync.txt");
await new Promise((resolve,reject)=>fs.copyFile(file,"copy-callback.txt",(error)=>error?reject(error):resolve()));
await new Promise((resolve,reject)=>fs.cp(file,"cp-callback.txt",(error)=>error?reject(error):resolve()));
await fs.promises.copyFile(file,"copy-promise.txt"); await fs.promises.cp(file,"cp-promise.txt");\n`,
  );
  const copies = await executeSuite(
    {
      name: "copy-reports",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/copy-report.mjs"],
    },
    repo,
  );
  assert.equal(copies.exitCode, 1, copies.output);
  for (const method of [
    "copyFileSync",
    "cpSync",
    "copyFile",
    "cp",
    "promises.copyFile",
    "promises.cp",
  ])
    assert.ok(copies.output.includes("(" + method + ")"), copies.output);
  mkdirSync(join(repo, "docs/evidence/WO-999/subdir"));
  symlinkSync("docs/evidence/WO-999/subdir", join(repo, "read-alias"));
  symlinkSync("docs/evidence/WO-999", join(repo, "report-alias"));
  symlinkSync(
    "docs/evidence/WO-999/dangling-target.md",
    join(repo, "dangling-report"),
  );
  symlinkSync(
    "docs/evidence/WO-999/not-yet-created-dir",
    join(repo, "dangling-dir"),
  );
  writeFileSync(
    join(repo, "scripts/read-aliases.mjs"),
    'import fs from "node:fs"; fs.readFileSync("read-alias/../report.md"); fs.existsSync("report-alias/not-yet-written.md"); fs.existsSync("dangling-report"); fs.existsSync("dangling-dir/");\n',
  );
  const aliases = await executeSuite(
    {
      name: "report-aliases",
      product: true,
      activeOrder: "WO-999",
      command: [process.execPath, "scripts/read-aliases.mjs"],
    },
    repo,
  );
  assert.equal(aliases.exitCode, 1, aliases.output);
  assert.ok(aliases.excludedReads >= 2, aliases.output);
  assert.match(
    aliases.output,
    /docs\/evidence\/WO-999\/report.md \(readFileSync\)/,
  );
  assert.match(aliases.output, /docs\/evidence\/WO-999\/not-yet-written.md/);
  assert.match(
    aliases.output,
    /docs\/evidence\/WO-999\/dangling-target.md \(existsSync\)/,
  );
  assert.match(
    aliases.output,
    /docs\/evidence\/WO-999\/not-yet-created-dir \(existsSync\)/,
  );
  writeFileSync(
    join(repo, "scripts/cases.test.mjs"),
    'import test from "node:test"; for(let n=0;n<6;n++)test("case " + n, async()=>{await new Promise(r=>setTimeout(r,20+n*30));});\n',
  );
  const measured = await executeSuite(
    {
      name: "cases",
      command: [process.execPath, "--test", "scripts/cases.test.mjs"],
    },
    repo,
  );
  assert.equal(measured.exitCode, 0, measured.output);
  assert.equal(measured.slowestCases.length, 5);
  assert.ok(
    measured.slowestCases.every(
      (row) => row.durationMs >= 8 && row.exitCode === 0,
    ),
  );
  assert.deepEqual(
    measured.slowestCases.map((row) => row.name),
    ["case 5", "case 4", "case 3", "case 2", "case 1"],
  );
});

test("WO-186 VER-001 product tasks reject recursive listings, watches and copies from the root or an ancestor, and blob and link reads of records", async (t) => {
  // A private parent keeps the ancestor walk small and owned by the fixture.
  const parent = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-read-ancestor-")),
  );
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const repo = join(parent, "repo");
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  mkdirSync(join(repo, "scripts"));
  mkdirSync(join(repo, "out"));
  runGit(repo, ["init", "-q", "-b", "main"]);
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\nout/\n");
  writeFileSync(join(repo, "docs/evidence/WO-999/report.md"), "live report\n");
  writeFileSync(join(repo, "docs/input.md"), "tracked document\n");
  const settle =
    "const settle = (start) => new Promise((resolve, reject) => start((error, value) => (error ? reject(error) : resolve(value))));\n";
  writeFileSync(
    join(repo, "scripts/enumerate.mjs"),
    `import fs from "node:fs";
const recursive = { recursive: true };
${settle}for (const target of [".", ".."]) {
  fs.readdirSync(target, recursive);
  await settle((done) => fs.readdir(target, recursive, done));
  await fs.promises.readdir(target, recursive);
  fs.opendirSync(target, recursive).closeSync();
  await (await settle((done) => fs.opendir(target, recursive, done))).close();
  await (await fs.promises.opendir(target, recursive)).close();
}
`,
  );
  // The same calls without a descent list nothing below the root's entries.
  // A copied or linked excluded tracked input is outside the observed
  // boundary, which product 07 states.
  writeFileSync(
    join(repo, "scripts/list.mjs"),
    `import fs from "node:fs";
${settle}for (const target of [".", ".."]) {
  fs.readdirSync(target);
  fs.readdirSync(target, { withFileTypes: true });
  await settle((done) => fs.readdir(target, done));
  await fs.promises.readdir(target);
  fs.opendirSync(target).closeSync();
  await (await settle((done) => fs.opendir(target, done))).close();
  await (await fs.promises.opendir(target)).close();
  fs.watch(target).close();
}
fs.copyFileSync("docs/input.md", "out/input-copy.md");
fs.linkSync("docs/input.md", "out/input-link.md");
`,
  );
  writeFileSync(
    join(repo, "scripts/forms.mjs"),
    `import fs from "node:fs";
${settle}const report = "docs/evidence/WO-999/report.md";
await (await fs.openAsBlob(report)).text();
await (await fs.openAsBlob("docs/input.md")).text();
fs.statfsSync(report);
await settle((done) => fs.statfs(report, done));
await fs.promises.statfs(report);
fs.linkSync(report, "out/link-sync");
await settle((done) => fs.link(report, "out/link-callback", done));
await fs.promises.link(report, "out/link-promise");
for (const copy of [
  () => fs.cpSync("..", "out/copy-sync", { recursive: true, filter: () => false }),
  () => settle((done) => fs.cp("..", "out/copy-callback", { recursive: true, filter: () => false }, done)),
  () => fs.promises.cp("..", "out/copy-promise", { recursive: true, filter: () => false }),
])
  try {
    await copy();
  } catch {
    // Node refuses a copy into its own source; the attempt is the read.
  }
// A record moved away could be read under another name; each is moved back.
fs.renameSync(report, "out/moved");
fs.renameSync("out/moved", report);
await settle((done) => fs.rename(report, "out/moved", done));
fs.renameSync("out/moved", report);
await fs.promises.rename(report, "out/moved");
fs.renameSync("out/moved", report);
`,
  );
  // Recursive watches. Where Node walks the tree itself to watch it, the
  // walk's own listings are recorded too, so these are judged by inclusion.
  writeFileSync(
    join(repo, "scripts/watches.mjs"),
    `import fs from "node:fs";
fs.watch(".", { recursive: true }).close();
fs.watch("docs", { recursive: true }).close();
const stop = new AbortController();
fs.promises.watch("..", { recursive: true, signal: stop.signal });
stop.abort();
`,
  );
  // Other spellings of the same reads: a byte view and a URL-shaped object as
  // the path, null open flags, and the native realpath behind the callback.
  writeFileSync(
    join(repo, "scripts/spellings.mjs"),
    `import fs from "node:fs";
${settle}const report = "docs/evidence/WO-999/report.md";
fs.readdirSync(new TextEncoder().encode("."), { recursive: true });
const { href, protocol, hostname, pathname } = new URL(report, "file://" + process.cwd() + "/");
fs.readFileSync({ href, protocol, hostname, pathname });
fs.closeSync(fs.openSync(report, null));
await settle((done) => fs.realpath.native(report, done));
`,
  );
  runGit(repo, ["add", ".gitignore", "scripts", "docs/input.md"]);
  const run = (name, script) =>
    executeSuite(
      {
        name,
        product: true,
        activeOrder: "WO-999",
        command: [process.execPath, script],
      },
      repo,
    );
  const reads = (result) =>
    result.output
      .split("\n")
      .filter((line) => line.startsWith("Product read guard: <module setup>"))
      .map((line) => / reads (\S+) \(([^)]+)\)/u.exec(line).slice(1).join(" "))
      .sort();
  const plain = await run("plain-root-listing", "scripts/list.mjs");
  assert.equal(plain.exitCode, 0, plain.output);
  assert.equal(plain.excludedReads, 0);
  const enumerated = await run(
    "recursive-enumeration",
    "scripts/enumerate.mjs",
  );
  assert.equal(enumerated.exitCode, 1, enumerated.output);
  assert.deepEqual(
    reads(enumerated),
    [".", ".."]
      .flatMap((target) =>
        [
          "readdirSync",
          "readdir",
          "promises.readdir",
          "opendirSync",
          "opendir",
          "promises.opendir",
        ].map((method) => `${target} ${method}`),
      )
      .sort(),
  );
  const forms = await run("adjacent-forms", "scripts/forms.mjs");
  assert.equal(forms.exitCode, 1, forms.output);
  assert.deepEqual(
    reads(forms),
    [
      ".. cp",
      ".. cpSync",
      ".. promises.cp",
      "docs/evidence/WO-999/report.md link",
      "docs/evidence/WO-999/report.md linkSync",
      "docs/evidence/WO-999/report.md openAsBlob",
      "docs/evidence/WO-999/report.md promises.link",
      "docs/evidence/WO-999/report.md promises.rename",
      "docs/evidence/WO-999/report.md promises.statfs",
      "docs/evidence/WO-999/report.md rename",
      "docs/evidence/WO-999/report.md renameSync",
      "docs/evidence/WO-999/report.md statfs",
      "docs/evidence/WO-999/report.md statfsSync",
      "docs/input.md openAsBlob",
    ].sort(),
  );
  const watches = await run("recursive-watches", "scripts/watches.mjs");
  assert.equal(watches.exitCode, 1, watches.output);
  for (const watch of [". watch", ".. promises.watch", "docs watch"])
    assert.ok(reads(watches).includes(watch), watches.output);
  const spellings = await run("other-spellings", "scripts/spellings.mjs");
  assert.equal(spellings.exitCode, 1, spellings.output);
  assert.deepEqual(reads(spellings), [
    ". readdirSync",
    "docs/evidence/WO-999/report.md openSync",
    "docs/evidence/WO-999/report.md readFileSync",
    "docs/evidence/WO-999/report.md realpath.native",
  ]);
});

test("WO-186 planning performance excludes reused zero durations, compares earlier medians and holds above half growth", async () => {
  const { gatePerformanceConditions } =
    await import("./lib/planning-conditions.mjs");
  const checks = Array.from({ length: 4 }, (_, i) => ({
    checkId: "npm test",
    executed: true,
    exitCode: 0,
    recordedAt: `2026-10-0${i + 1}T00:00:00Z`,
    durationMs: 400000,
    evidenceRef: "fixture:" + i,
    gateSelection: "plain",
    executionMode: "fresh",
    taskTimeline: Array.from({ length: 6 }, (_, n) => ({
      name: "task " + n,
      executed: true,
      exitCode: 0,
      durationMs: i === 3 ? 2000 + n * 100 : 1000 + n * 10,
    })),
  }));
  checks.push({
    ...checks.at(-1),
    recordedAt: "2026-10-05T00:00:00Z",
    durationMs: 0,
    reused: true,
    taskTimeline: checks
      .at(-1)
      .taskTimeline.map((row) => ({ ...row, durationMs: 0, reused: true })),
  });
  const rows = gatePerformanceConditions(checks, "2026-10-06T00:00:00Z");
  assert.equal(rows.length, 6);
  assert.equal(rows[0].value, 400);
  assert.equal(rows[0].holds, true);
  assert.deepEqual(
    rows.slice(1).map((row) => row.id),
    [
      "gate-task:task 5",
      "gate-task:task 4",
      "gate-task:task 3",
      "gate-task:task 2",
      "gate-task:task 1",
    ],
  );
  assert.ok(
    rows.slice(1).every((row) => row.holds === true && row.samples === 3),
  );
  assert.equal(rows[1].median, 1.05);
  const failed = {
    ...checks[3],
    exitCode: 1,
    recordedAt: "2026-10-05T12:00:00Z",
    taskTimeline: checks[3].taskTimeline.map((task) =>
      task.name === "task 5"
        ? { ...task, durationMs: 6000 }
        : { ...task, exitCode: 1 },
    ),
  };
  const includingFailed = gatePerformanceConditions(
    [...checks, failed],
    "2026-10-06T00:00:00Z",
  );
  assert.equal(
    includingFailed[0].value,
    400,
    "failed whole gates are not fresh plain passes",
  );
  assert.equal(includingFailed[1].id, "gate-task:task 5");
  assert.equal(includingFailed[1].value, 6);
  assert.equal(includingFailed[1].samples, 4);
  assert.equal(includingFailed[1].median, 1.05);
  assert.equal(includingFailed[1].holds, true);
});

test("WO-186 concurrent duplicate names and runtime skip/todo clear at execution completion", async (t) => {
  const { repo } = taskReuseFixture(t);
  writeFileSync(
    join(repo, "scripts/concurrent.test.mjs"),
    `import test from "node:test"; import {setTimeout as delay} from "node:timers/promises";
test("outer", {concurrency:true}, async(t)=>{
  await Promise.all([
    t.test("same", async()=>{await delay(180);}),
    t.test("same", async()=>{await delay(20);}),
    t.test("runtime skip", t=>t.skip()),
    t.test("runtime todo", t=>t.todo()),
  ]);
});\n`,
  );
  const measured = await executeSuite(
    {
      name: "concurrent",
      command: [process.execPath, "--test", "scripts/concurrent.test.mjs"],
    },
    repo,
  );
  assert.equal(measured.exitCode, 0, measured.output);
  const reports = [...measured.output.matchAll(/^PROGRESS CASE (.+)$/gm)].map(
    (match) => JSON.parse(match[1]),
  );
  const starts = reports.filter(
    (row) => row.event === "start" && row.name === "same",
  );
  assert.equal(starts.length, 2);
  assert.notEqual(starts[0].testId, starts[1].testId);
  assert.ok(
    starts.every((row) => row.entryFile === "scripts/concurrent.test.mjs"),
  );
  const ends = reports.filter(
    (row) => row.event === "end" && row.name === "same",
  );
  assert.equal(ends.length, 2);
  assert.equal(
    ends[0].testId,
    starts[1].testId,
    "fast later sibling completes before slow first sibling",
  );
  assert.equal(ends[1].testId, starts[0].testId);
  const active = new Map();
  for (const report of reports) {
    const key = JSON.stringify([report.entryFile, report.testId]);
    if (report.event === "start") active.set(key, report.name);
    else active.delete(key);
    if (report === ends[0])
      assert.equal(
        [...active.values()].filter((name) => name === "same").length,
        1,
      );
  }
  assert.equal(active.size, 0);
  for (const name of ["runtime skip", "runtime todo"])
    assert.ok(
      reports.some(
        (row) => row.name === name && row.event === "end" && row.skipped,
      ),
    );
  assert.ok(measured.slowestCases.every((row) => !/^runtime /.test(row.name)));
});

test("WO-186 VER-001 the heartbeat names a synchronous case while it runs, after an async one, and never a finished case", async (t) => {
  const { repo, observed } = taskReuseFixture(t);
  // Each body records its own window through a descriptor and functions taken
  // at load, which a mock cannot reach. A synchronous body blocks the test
  // process's event loop, as a spawnSync-heavy case does.
  const long = (label) =>
    `${label} with a name long enough that one heartbeat line holds a single case and no more`;
  writeFileSync(join(repo, "scripts/heartbeat-worker.mjs"), "");
  writeFileSync(
    join(repo, "scripts/heartbeat.test.mjs"),
    `import test from "node:test";
import fs from "node:fs";
import { Worker } from "node:worker_threads";
const out = fs.openSync("observed.jsonl", "a");
const write = fs.writeSync;
const mark = (name, edge) =>
  write(out, JSON.stringify({ name, edge, at: Date.now(), markers: process.env.DOTLN_CASE_MARKERS }) + "\\n");
const block = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const long = ${long.toString()};
test("async first", async () => { mark("async first", "begin"); await wait(50); mark("async first", "finish"); });
test("sync one", () => { mark("sync one", "begin"); block(1200); mark("sync one", "finish"); });
test("outer", async (t) => {
  mark("outer", "begin");
  await t.test("inner sync", () => { mark("inner sync", "begin"); block(1200); mark("inner sync", "finish"); });
  mark("outer", "finish");
});
test("leaves writeFileSync mocked", async (t) => {
  mark("leaves writeFileSync mocked", "begin");
  t.mock.method(fs, "writeFileSync", () => {});
  await wait(400);
  mark("leaves writeFileSync mocked", "finish");
});
test("after the mock", () => { mark("after the mock", "begin"); block(1200); mark("after the mock", "finish"); });
test("outlives its worker", async () => {
  mark("outlives its worker", "begin");
  await new Promise((resolve, reject) =>
    new Worker(new URL("./heartbeat-worker.mjs", import.meta.url)).once("exit", resolve).once("error", reject));
  await wait(1200);
  mark("outlives its worker", "finish");
});
test(long("group"), { concurrency: true }, async (t) => {
  mark(long("group"), "begin");
  await Promise.all(["first", "second", "third", "fourth"].map((label) =>
    t.test(long(label), async () => { mark(long(label), "begin"); await wait(1200); mark(long(label), "finish"); })));
  mark(long("group"), "finish");
});
`,
  );
  // A second file runs in its own process beside the first.
  writeFileSync(
    join(repo, "scripts/heartbeat-peer.test.mjs"),
    `import test from "node:test";
import fs from "node:fs";
test("peer sync", () => {
  const mark = (edge) => fs.appendFileSync("observed.jsonl", JSON.stringify({ name: "peer sync", edge, at: Date.now() }) + "\\n");
  mark("begin");
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1200);
  mark("finish");
});
`,
  );
  const beats = [];
  const measured = await executeSuite(
    {
      name: "heartbeat",
      heartbeatMs: 300,
      command: [
        process.execPath,
        "--test",
        "scripts/heartbeat.test.mjs",
        "scripts/heartbeat-peer.test.mjs",
      ],
    },
    repo,
    900_000,
    ({ message }) => {
      if (!/^running cases?: /u.test(message)) return;
      const at = Date.now();
      for (const [, name] of message.matchAll(
        /(?:: |; )([^;]+?) \(entered [\d.]+ s ago\)/gu,
      ))
        beats.push({ name, at });
    },
  );
  assert.equal(measured.exitCode, 0, measured.output);
  // The heartbeat prints the first eighty characters of a name.
  const shown = (name) => name.slice(0, 80);
  const windows = new Map();
  let markers;
  for (const row of observed().map((line) => JSON.parse(line))) {
    windows.set(shown(row.name), {
      ...windows.get(shown(row.name)),
      [row.edge]: row.at,
    });
    markers ??= row.markers;
  }
  // Every case that ran for the interval was named: a synchronous case after
  // an async one, a subtest and its open parent, a case after one that left
  // fs.writeFileSync mocked, a case that outlived a worker thread, five
  // long-named cases open at once, and a case in another file's process.
  for (const name of [
    "sync one",
    "outer",
    "inner sync",
    "after the mock",
    "outlives its worker",
    ...["group", "first", "second", "third", "fourth"].map(long),
    "peer sync",
  ])
    assert.ok(
      beats.some((beat) => beat.name === shown(name)),
      `${name} was never named: ${JSON.stringify(beats)}`,
    );
  // Whenever a case was named, its own body was running: no case is named
  // after it ended, the one whose end the mock would have swallowed included.
  for (const beat of beats) {
    const window = windows.get(beat.name);
    assert.ok(
      window && beat.at >= window.begin - 100 && beat.at <= window.finish + 100,
      `${beat.name} named outside its run: ${JSON.stringify({ beat, window })}`,
    );
  }
  // Reporter events still supply the durations.
  assert.equal(measured.slowestCases.length, 5);
  assert.ok(measured.slowestCases.every((row) => row.durationMs >= 1000));
  // The marker file is the task's own and is gone with it.
  assert.match(markers, /dotln-case-markers-/u);
  assert.equal(existsSync(dirname(markers)), false);
  // A test process that dies inside a case leaves a start marker with no
  // end. The heartbeat drops it with the process and names what still runs.
  writeFileSync(
    join(repo, "scripts/heartbeat-dies.test.mjs"),
    'import test from "node:test";\ntest("dies inside", () => { process.kill(process.pid, "SIGKILL"); });\n',
  );
  writeFileSync(
    join(repo, "scripts/heartbeat-survives.test.mjs"),
    'import test from "node:test";\ntest("survivor", () => { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500); });\n',
  );
  const orphaned = [];
  const died = await executeSuite(
    {
      name: "dies",
      heartbeatMs: 300,
      command: [
        process.execPath,
        "--test",
        "scripts/heartbeat-dies.test.mjs",
        "scripts/heartbeat-survives.test.mjs",
      ],
    },
    repo,
    900_000,
    ({ message }) => orphaned.push(message),
  );
  assert.equal(died.exitCode, 1);
  assert.ok(
    orphaned.some((message) => /^running cases?: .*survivor \(/u.test(message)),
    orphaned.join("\n"),
  );
  assert.equal(
    orphaned.some((message) =>
      /^running cases?: .*dies inside \(/u.test(message),
    ),
    false,
    orphaned.join("\n"),
  );
  // A task that reports no cases is never given one.
  const plain = [];
  const quiet = await executeSuite(
    {
      name: "plain",
      heartbeatMs: 150,
      command: [process.execPath, "-e", "setTimeout(() => {}, 600)"],
    },
    repo,
    900_000,
    ({ message }) => plain.push(message),
  );
  assert.equal(quiet.exitCode, 0, quiet.output);
  assert.ok(plain.some((message) => /^running task: plain /u.test(message)));
  assert.equal(
    plain.some((message) => /running case/u.test(message)),
    false,
  );
  // The interval is a fixture control; a declared table cannot carry it.
  assert.throws(
    () =>
      validateSuites([
        { name: "build", build: true, command: ["build"] },
        { name: "slow", command: ["slow"], heartbeatMs: 10 },
      ]),
    /Heartbeat interval is a fixture control: slow/u,
  );
});

test("WO-186 excluded license pins fail their document-routed check and outward vocabulary stays in the product identity", async (t) => {
  const { repo } = taskReuseFixture(t);
  const { licenseSurfaceRules } = await import("./license-surfaces.mjs");
  mkdirSync(join(repo, "docs"), { recursive: true });
  mkdirSync(join(repo, "packages/fixture"), { recursive: true });
  writeFileSync(join(repo, "package.json"), '{"private":false}\n');
  writeFileSync(
    join(repo, "packages/fixture/package.json"),
    '{"name":"fixture","version":"0.0.1","private":false}\n',
  );
  for (const file of ["LICENSE", "LICENSE-docs", "NOTICE", "docs/LEGAL.md"])
    cpSync(join(root, file), join(repo, file));
  const pins = (rules) =>
    rules.filter((row) => row.line.includes("docs/LEGAL.md"));
  assert.ok(pins(licenseSurfaceRules(repo)).every((row) => row.pass));
  const identity = gateCodeIdentity(repo);
  writeFileSync(
    join(repo, "docs/LEGAL.md"),
    readFileSync(join(repo, "docs/LEGAL.md"), "utf8").replace(
      /sha256:[a-f0-9]{64}/,
      "sha256:" + "0".repeat(64),
    ),
  );
  assert.equal(gateCodeIdentity(repo), identity);
  assert.ok(pins(licenseSurfaceRules(repo)).some((row) => !row.pass));
  for (const name of [
    "license-surfaces",
    "resume",
    "resident-bind",
    "local-runner-double",
    "artifact-corpus",
  ]) {
    const suite = suites.find((row) => row.name === name);
    assert.equal(suite.document, true, name);
    assert.equal(suite.product, false, name);
  }
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  writeFileSync(
    join(repo, "docs/control/outward-vocabulary.json"),
    '["first"]\n',
  );
  const vocabulary = gateCodeIdentity(repo);
  writeFileSync(
    join(repo, "docs/control/outward-vocabulary.json"),
    '["second"]\n',
  );
  assert.notEqual(gateCodeIdentity(repo), vocabulary);
  for (const name of ["github-body", "outward-lint", "target-publish"])
    assert.equal(suites.find((row) => row.name === name).product, true, name);
});

test("WO-186 a failed release case reruns alone after its passed disposable template has gone", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(
    join(repo, ".gitignore"),
    readFileSync(join(repo, ".gitignore"), "utf8") + "fail-release\n",
  );
  writeFileSync(
    join(repo, "scripts/test-release.sh"),
    `#!/bin/bash
set -eu
release_case_good() {
  :
}
release_case_bad() {
  :
}
if [[ "$1" == --prepare-template ]]; then
  printf 'prepare\\n' >> observed.jsonl
  mkdir -p "$2"
elif [[ "$1" == --case ]]; then
  printf '%s\\n' "$2" >> observed.jsonl
  if [[ "$2" == bad && -f fail-release ]]; then exit 1; fi
fi
`,
  );
  runGit(repo, ["add", "."]);
  runGit(repo, ["commit", "-qm", "release reuse fixture"]);
  const selection = [
    table[0],
    {
      name: "release",
      product: true,
      command: ["bash", "scripts/test-release.sh"],
    },
  ];
  writeFileSync(join(repo, "fail-release"), "fail\n");
  const first = await runGate(["--again", "--serial"], repo, {
    table: selection,
  });
  assert.equal(first.exitCode, 1);
  assert.deepEqual(observed(), ["build", "prepare", "good", "bad"]);
  rmSync(join(repo, "fail-release"));
  const second = await runGate(["--serial"], repo, { table: selection });
  assert.equal(second.exitCode, 0);
  assert.deepEqual(observed(), ["build", "prepare", "good", "bad", "bad"]);
  assert.equal(second.freshSuites, 1);
  assert.equal(second.reusedSuites, 3);
  const preparation = second.taskTimeline.find(
    (row) => row.name === "release:prepare",
  );
  assert.equal(preparation.sourceRow.recordedAt, first.recordedAt);
});

test("WO-186 FINAL-001 a fresh worktree's failed single-suite run displaces main's claim until the task passes", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  const main = await runGate(["--serial", "--again"], repo, { table });
  const index = join(repo, "docs/control/local/harness/checks.json");
  const mainBytes = readFileSync(index);
  const worktree = `${repo}-worktree`;
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  assert.equal(
    (await coveringGateCheck(worktree, "npm test", [])).location,
    "main",
  );
  assert.equal(
    (await requireGateClaims(worktree, ledger)).productGate.recordedAt,
    main.recordedAt,
  );
  writeFileSync(join(worktree, "fail-beta"), "fail\n");
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], worktree, { table }))
      .exitCode,
    1,
  );
  const tasks = table.filter((row) => !row.machinery);
  assert.deepEqual(
    [
      ...(
        await coveringTaskResults(worktree, "npm test", tasks)
      ).results.keys(),
    ],
    ["build", "alpha"],
  );
  const refused = await coveringGateCheck(worktree, "npm test", []);
  assert.equal(refused.row, undefined);
  assert.deepEqual(refused.displaced.tasks, ["beta"]);
  await assert.rejects(
    () => requireGateClaims(worktree, ledger),
    /no passing complete npm test row stands[^]*beta/u,
  );
  // Recovery under the other check restores main's pass without creating a
  // local npm test row. This arrangement was absent from the failed review.
  rmSync(join(worktree, "fail-beta"));
  assert.equal(
    (await runGate(["--only", "beta", "--serial"], worktree, { table }))
      .exitCode,
    0,
  );
  assert.deepEqual((await requireGateClaims(worktree, ledger)).advisories, []);
  assert.equal(
    (await coveringTaskResults(worktree, "npm test", tasks)).results.size,
    tasks.length,
  );
  assert.ok(
    readGateChecks(worktree).every((row) => row.checkId !== "npm test"),
  );
  // A second failure must still make the next plain run execute beta alone.
  writeFileSync(join(worktree, "fail-beta"), "fail again\n");
  await runGate(["--only", "beta", "--serial"], worktree, { table });
  const before = observed(worktree).length;
  const plain = await runGate(["--serial"], worktree, { table });
  assert.equal(plain.exitCode, 1);
  assert.deepEqual(observed(worktree).slice(before), ["beta"]);
  assert.deepEqual(readFileSync(index), mainBytes);
});

test("WO-186 FINAL-001 runner and claim agree over local/main and same/other-check histories", async (t) => {
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  for (const own of [false, true])
    for (const consultMain of [false, true])
      for (const checkId of ["npm test", "suite:beta"])
        for (const passed of [false, true])
          await t.test(
            JSON.stringify({ own, consultMain, checkId, passed }),
            async (cell) => {
              const { repo, table } = taskReuseFixture(cell);
              let worktree = repo;
              if (consultMain) {
                worktree = `${repo}-worktree`;
                cell.after(() =>
                  rmSync(worktree, { recursive: true, force: true }),
                );
                runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
              }
              const tasks = table.filter((row) => !row.machinery);
              const identity = gateCodeIdentity(worktree);
              const row = (at, id = "npm test", success = true) => ({
                checkId: id,
                codeIdentity: identity,
                treeHash: gateTreeHash(worktree),
                executed: true,
                exitCode: success ? 0 : 1,
                identityUnchanged: true,
                durationMs: 1,
                evidenceRef: `fixture:${at}:${id}`,
                recordedAt: new Date(at).toISOString(),
                requiredSuites:
                  id === "npm test" ? tasks.map((task) => task.name) : ["beta"],
                taskTimeline: (id === "npm test"
                  ? tasks
                  : tasks.filter((task) => task.name === "beta")
                ).map((task) => ({
                  name: task.name,
                  executed: true,
                  exitCode: task.name === "beta" && !success ? 1 : 0,
                  durationMs: 1,
                  finishedAt: new Date(at).toISOString(),
                })),
              });
              if (consultMain) recordGateChecks(repo, [row(1000)]);
              if (own) recordGateChecks(worktree, [row(2000)]);
              recordGateChecks(worktree, [row(3000, checkId, passed)]);
              const carried = await coveringTaskResults(
                worktree,
                "npm test",
                tasks,
              );
              const claim = await coveringGateCheck(
                worktree,
                "npm test",
                tasks.map((task) => task.name),
              );
              assert.equal(
                Boolean(claim.row),
                carried.results.size === tasks.length,
              );
              assert.equal(
                carried.results.has("beta"),
                passed && (own || consultMain || checkId === "npm test"),
              );
            },
          );
});

test("WO-186 FINAL-001 identity and consulted-index errors retain an explicit unproved-claim advisory", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const { requireGateClaims } = await import("./lib/handoff-ledger.mjs");
  const ledger = {
    checked: true,
    claims: { plain: ["3"], review: [], document: [] },
  };
  await runGate(["--serial", "--again"], repo, { table });
  symlinkSync("../fail-beta", join(repo, "scripts/new.mjs"));
  await assert.rejects(
    () => runGate(["--serial"], repo, { table }),
    /symbolic source aliases/u,
  );
  const symbolic = await requireGateClaims(repo, ledger, {
    log: { warn() {} },
  });
  assert.equal(symbolic.productGate, undefined);
  assert.equal(symbolic.advisories.length, 1);
  assert.match(
    symbolic.advisories[0],
    /symbolic source aliases[^]*criterion 3 is recorded as stated/u,
  );
  rmSync(join(repo, "scripts/new.mjs"));
  const worktree = `${repo}-worktree`;
  t.after(() => rmSync(worktree, { recursive: true, force: true }));
  runGit(repo, ["worktree", "add", "-q", "-b", "work", worktree]);
  writeFileSync(join(repo, "docs/control/local/harness/checks.json"), "{");
  const unreadable = await requireGateClaims(worktree, ledger, {
    log: { warn() {} },
  });
  assert.equal(unreadable.productGate, undefined);
  assert.equal(unreadable.advisories.length, 1);
  assert.match(
    unreadable.advisories[0],
    /Gate index unavailable:[^]*criterion 3 is recorded as stated/u,
  );
});

test("WO-186 FINAL-001 case duration reports leave live diagnostic and suite progress slots available", async (t) => {
  const { repo } = taskReuseFixture(t);
  writeFileSync(
    join(repo, "scripts/many.test.mjs"),
    'import test from "node:test"; import assert from "node:assert/strict"; for(let n=0;n<55;n++)test("passing case "+n,()=>{}); test("late failure",()=>assert.fail("planted late failure"));\n',
  );
  const reporter = new URL("./lib/case-reporter.mjs", import.meta.url).href;
  writeFileSync(
    join(repo, "scripts/report-driver.mjs"),
    `import {spawnSync} from "node:child_process";
const run=spawnSync(process.execPath,["--test","--test-reporter=tap",${JSON.stringify("--test-reporter=" + reporter)},"--test-reporter-destination=stdout","--test-reporter-destination=stdout","scripts/many.test.mjs"],{stdio:"inherit"});
console.log("PROGRESS suite-owned diagnostic after cases"); process.exitCode=run.status;
`,
  );
  const progress = [];
  const result = await executeSuite(
    {
      name: "many-cases",
      command: [process.execPath, "scripts/report-driver.mjs"],
    },
    repo,
    10000,
    ({ message }) => progress.push(message),
  );
  assert.equal(result.exitCode, 1);
  assert.equal(result.slowestCases.length, 5);
  assert.ok(
    progress.some((line) => /not ok \d+ - late failure/u.test(line)),
    progress.join("\n"),
  );
  assert.ok(
    progress.includes("PROGRESS suite-owned diagnostic after cases"),
    progress.join("\n"),
  );
  assert.equal(
    progress.some((line) => line.startsWith("PROGRESS CASE ")),
    false,
  );
  assert.ok(result.slowestCases.some((row) => row.exitCode === 1));
});

test("WO-186 FINAL-001 callback opens without flags observe the default read and register descriptor metadata", async (t) => {
  const { repo } = taskReuseFixture(t);
  mkdirSync(join(repo, "docs/evidence/WO-999"), { recursive: true });
  writeFileSync(join(repo, "docs/evidence/WO-999/report.md"), "report\n");
  for (const metadata of [false, true]) {
    writeFileSync(
      join(repo, "scripts/open-default.mjs"),
      `import fs from "node:fs";
await new Promise((done,fail)=>fs.open("docs/evidence/WO-999/report.md",(e,fd)=>e?fail(e):(${metadata ? "fs.fstatSync(fd)," : ""}fs.close(fd,e=>e?fail(e):done()))));
console.log("default open finished");
`,
    );
    const result = await executeSuite(
      {
        name: "default-open",
        product: true,
        activeOrder: "WO-999",
        command: [process.execPath, "scripts/open-default.mjs"],
      },
      repo,
    );
    assert.equal(result.exitCode, 1, result.output);
    assert.equal(result.excludedReads, metadata ? 2 : 1, result.output);
    assert.match(result.output, /report.md \(open\)/u);
    if (metadata) assert.match(result.output, /report.md \(fstatSync\)/u);
    assert.match(result.output, /default open finished/u);
  }
});

test("WO-186 FINAL-001 another check's row-level failure displaces the tasks it executed", async (t) => {
  const { repo, table } = taskReuseFixture(t);
  const { coveringGateCheck, coveringTaskResults } =
    await import("./lib/gate-reuse.mjs");
  const clean = await runGate(["--serial", "--again"], repo, { table });
  const beta = clean.taskTimeline.find((row) => row.name === "beta");
  let at = Date.parse(clean.recordedAt);
  for (const failure of [
    { abandonedRoots: ["fixture:surviving-root"] },
    { buildOutputUnchanged: false },
    { memory: { failure: { kind: "fixture:memory" } } },
    { identityUnchanged: false },
    { stopped: true },
    { timedOut: true },
  ]) {
    const observation = (extra) => {
      const time = new Date(++at).toISOString();
      return {
        ...clean,
        checkId: "suite:beta",
        requiredSuites: ["beta"],
        taskTimeline: [{ ...beta, finishedAt: time }],
        recordedAt: time,
        ...extra,
      };
    };
    recordGateChecks(repo, [observation({ ...failure, exitCode: 1 })]);
    const carried = await coveringTaskResults(repo, "npm test", table);
    assert.equal(carried.results.has("beta"), false, JSON.stringify(failure));
    const claim = await coveringGateCheck(repo, "npm test", []);
    assert.equal(claim.row, undefined, JSON.stringify(failure));
    assert.deepEqual(claim.displaced.tasks, ["beta"]);
    recordGateChecks(repo, [observation({ exitCode: 0 })]);
    assert.equal(
      (await coveringGateCheck(repo, "npm test", [])).row.recordedAt,
      clean.recordedAt,
    );
  }
});

test("WO-186 FINAL-001 machinery selection preserves removed, quoted and unlistable paths", async (t) => {
  await t.test("a staged rename retains the deleted exact source", () => {
    const { repo, table } = taskReuseFixture(t);
    runGit(repo, ["checkout", "-q", "-b", "work"]);
    runGit(repo, ["mv", "scripts/machine.mjs", "scripts/moved.mjs"]);
    assert.deepEqual(
      changedMachinery(repo, table, "main").map((row) => row.name),
      ["machine"],
    );
  });
  await t.test("a quoted filename retains its declared source prefix", () => {
    const { repo } = taskReuseFixture(t);
    const filename = "scripts/odd\nname.mjs";
    writeFileSync(join(repo, filename), "export const value=1;\n");
    runGit(repo, ["add", filename]);
    runGit(repo, ["commit", "-qm", "quoted source fixture"]);
    runGit(repo, ["checkout", "-q", "-b", "work"]);
    writeFileSync(join(repo, filename), "export const value=2;\n");
    assert.deepEqual(
      changedMachinery(
        repo,
        [{ name: "quoted", machinery: true, sources: ["scripts/"] }],
        "main",
      ).map((row) => row.name),
      ["quoted"],
    );
  });
  await t.test("an unavailable untracked listing selects all machinery", () => {
    const { repo } = taskReuseFixture(t);
    const bin = join(repo, "bin");
    mkdirSync(bin);
    const actualGit = execFileSync("/usr/bin/which", ["git"], {
      encoding: "utf8",
    }).trim();
    writeFileSync(
      join(bin, "git"),
      `#!/bin/sh\nif [ "$1" = ls-files ]; then exit 1; fi\nexec '${actualGit.replaceAll("'", "'\\''")}' "$@"\n`,
    );
    chmodSync(join(bin, "git"), 0o755);
    const prior = process.env.PATH;
    try {
      process.env.PATH = `${bin}:${prior}`;
      const table = [
        { name: "machine", machinery: true, sources: ["scripts/machine.mjs"] },
        { name: "second", machinery: true, sources: ["other/"] },
      ];
      assert.deepEqual(
        changedMachinery(repo, table, "main").map((row) => row.name),
        ["machine", "second"],
      );
    } finally {
      process.env.PATH = prior;
    }
  });
});

test("WO-186 FINAL-001 a reporter loads from a checkout with URL delimiter characters", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-reporter-url-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const checkout = join(directory, "checkout #?%");
  for (const entry of [
    "scripts",
    "packages/skeleton/src",
    "packages/beacons/src",
  ])
    cpSync(join(root, entry), join(checkout, entry), { recursive: true });
  writeFileSync(
    join(checkout, "scripts/url-case.test.mjs"),
    'import test from "node:test"; test("URL-safe case",()=>{});\n',
  );
  const copied = await import(
    pathToFileURL(join(checkout, "scripts/test-runner.mjs")).href
  );
  const result = await copied.executeSuite(
    {
      name: "url-case",
      command: [process.execPath, "--test", "scripts/url-case.test.mjs"],
    },
    checkout,
  );
  assert.equal(result.exitCode, 0, result.output);
  assert.ok(
    result.slowestCases.some((row) => row.name === "URL-safe case"),
    JSON.stringify(result.slowestCases),
  );
});

test("WO-186 legacy product-only rows remain visible to planning and an even sample median uses both middle observations", async () => {
  const { gatePerformanceConditions } =
    await import("./lib/planning-conditions.mjs");
  const row = {
    checkId: "npm test",
    executed: true,
    exitCode: 0,
    evidenceRef: "fixture:legacy",
    requiredSuites: ["build", "product"],
    taskTimeline: [],
    executionMode: "fresh",
  };
  const checks = [
    { ...row, recordedAt: "2026-10-01T00:00:00Z", durationMs: 300000 },
    { ...row, recordedAt: "2026-10-02T00:00:00Z", durationMs: 500000 },
    {
      ...row,
      recordedAt: "2026-10-03T00:00:00Z",
      durationMs: 900000,
      requiredSuites: ["build", "product", "machine"],
    },
  ];
  const conditions = gatePerformanceConditions(checks, "2026-10-04T00:00:00Z", {
    machinerySuites: ["machine"],
  });
  assert.equal(conditions[0].value, 400);
  assert.equal(conditions[0].samples, 2);
  assert.equal(conditions[0].holds, true);
});

test("format preflight stops plain and review before product tasks, and stays fresh across document edits", async (t) => {
  for (const selection of [[], ["--review"]]) {
    const { repo, table, observed } = taskReuseFixture(t);
    mkdirSync(join(repo, "node_modules"));
    cpSync(
      join(root, "node_modules/prettier"),
      join(repo, "node_modules/prettier"),
      { recursive: true },
    );
    writeFileSync(
      join(repo, ".gitignore"),
      readFileSync(join(repo, ".gitignore"), "utf8") + "node_modules/\n",
    );
    writeFileSync(
      join(repo, "package.json"),
      JSON.stringify({
        scripts: {
          "format:check":
            "node node_modules/prettier/bin/prettier.cjs --check scripts/format-subject.mjs README.md",
          format:
            "node node_modules/prettier/bin/prettier.cjs --write scripts/format-subject.mjs README.md",
        },
      }),
    );
    writeFileSync(
      join(repo, "scripts/format-subject.mjs"),
      "export const value={a:1};\n",
    );
    writeFileSync(join(repo, "README.md"), "# Fixture\n");
    const format = suites.find((row) => row.name === "format");
    const inventory = [format, ...table];
    const gate = (args = selection) =>
      runGate(["--serial", ...args], repo, { table: inventory });
    const started = Date.now();
    const failed = await gate();
    assert.equal(failed.exitCode, 1);
    assert.ok(Date.now() - started < 60_000);
    assert.deepEqual(observed(), []);
    const failure = failed.taskTimeline.find((row) => row.name === "format");
    const output = (row, check = failed) =>
      check.cases.find((item) => item.name === row.name).output;
    assert.match(output(failure), /scripts\/format-subject\.mjs/);
    for (const task of failed.taskTimeline.filter(
      (row) => row.name !== "format",
    )) {
      assert.equal(task.executed, false);
      assert.match(output(task), /scripts\/format-subject\.mjs/);
      assert.match(
        output(task),
        /Run npm run format, then rerun this command\./,
      );
    }
    const formatted = spawnSync("npm", ["run", "format", "--silent"], {
      cwd: repo,
      encoding: "utf8",
    });
    assert.equal(formatted.status, 0, formatted.stdout + formatted.stderr);
    const passed = await gate();
    assert.equal(passed.exitCode, 0);
    assert.deepEqual(observed(), ["build", "alpha", "beta"]);
    assert.ok(
      Date.parse(
        passed.taskTimeline.find((row) => row.name === "build").startedAt,
      ) >=
        Date.parse(
          passed.taskTimeline.find((row) => row.name === "format").finishedAt,
        ),
    );
    const reused = await gate();
    assert.equal(reused.exitCode, 0);
    assert.equal(reused.executionMode, "composed");
    assert.equal(reused.freshReason, "always-fresh-preflight");
    assert.equal(
      reused.taskTimeline.find((row) => row.name === "format").reused,
      undefined,
    );
    assert.deepEqual(observed(), ["build", "alpha", "beta"]);
    writeFileSync(join(repo, "README.md"), "#   Fixture\n");
    assert.equal(gateCodeIdentity(repo), passed.codeIdentity);
    const documentFailure = await gate();
    assert.equal(documentFailure.exitCode, 1);
    assert.match(
      output(
        documentFailure.taskTimeline.find((row) => row.name === "format"),
        documentFailure,
      ),
      /README\.md/,
    );
    assert.deepEqual(observed(), ["build", "alpha", "beta"]);
    // The narrower selections do not acquire the formatting preflight.
    for (const args of [["--only", "alpha"], ["--machinery"]]) {
      const narrow = await gate(args);
      assert.equal(narrow.exitCode, 0);
      assert.ok(!narrow.requiredSuites.includes("format"));
    }
  }
});

test("review composition retains source rows and reruns a task whose latest single-suite execution failed", async (t) => {
  const { repo, table, observed } = taskReuseFixture(t);
  writeFileSync(join(repo, "scripts/format.mjs"), "export {};\n");
  const inventory = [
    {
      ...suites.find((row) => row.name === "format"),
      command: [process.execPath, "scripts/format.mjs"],
    },
    ...table,
  ];
  runGit(repo, ["checkout", "-qb", "work"]);
  writeFileSync(
    join(repo, "scripts/machine.mjs"),
    readFileSync(join(repo, "scripts/machine.mjs"), "utf8") +
      "// changed machinery\n",
  );
  const gate = (args) =>
    runGate(["--serial", ...args], repo, { table: inventory });
  const plain = await gate([]);
  assert.equal(plain.exitCode, 0);
  const review = await gate(["--review"]);
  assert.equal(review.exitCode, 0);
  assert.equal(review.gateSelection, "review");
  assert.equal(review.executionMode, "composed");
  assert.deepEqual(review.requiredSuites, [
    "build",
    "format",
    "alpha",
    "beta",
    "machine",
  ]);
  for (const name of ["build", "alpha", "beta"]) {
    const task = review.taskTimeline.find((row) => row.name === name);
    assert.equal(task.reused, true);
    assert.equal(task.sourceRow.recordedAt, plain.recordedAt);
  }
  assert.deepEqual(observed(), ["build", "alpha", "beta", "machine"]);
  const onlyFormat = await gate(["--review"]);
  assert.equal(onlyFormat.exitCode, 0);
  assert.equal(onlyFormat.executionMode, "composed");
  assert.equal(onlyFormat.gateSelection, "review");
  assert.equal(onlyFormat.freshReason, "always-fresh-preflight");
  assert.equal(onlyFormat.freshSuites, 1);
  assert.equal(onlyFormat.reusedSuites, 4);
  assert.deepEqual(onlyFormat.requiredSuites, review.requiredSuites);
  assert.deepEqual(observed(), ["build", "alpha", "beta", "machine"]);
  const fresh = await gate(["--review", "--again"]);
  assert.equal(fresh.executionMode, "forced-fresh");
  assert.equal(fresh.reusedSuites, 0);
  writeFileSync(join(repo, "fail-beta"), "fail\n");
  const failed = await gate(["--only", "beta"]);
  assert.equal(failed.exitCode, 1);
  const before = observed().length;
  const retried = await gate(["--review"]);
  assert.equal(retried.exitCode, 1);
  assert.equal(retried.freshReason, "missing-passing-tasks");
  assert.equal(
    retried.taskTimeline.find((row) => row.name === "beta").reused,
    undefined,
  );
  assert.deepEqual(observed().slice(before), ["beta"]);
  rmSync(join(repo, "fail-beta"));
  const repaired = await gate(["--review"]);
  assert.equal(repaired.exitCode, 0);
  assert.equal(repaired.executionMode, "composed");
  t.diagnostic("review composition " + JSON.stringify(gateProof(review)));
});
