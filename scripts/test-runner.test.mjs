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

const root = resolve(import.meta.dirname, "..");
const barrier = { name: "build", command: ["build"], build: true };
test("release shell changes select their inventory guard during review", async (t) => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-release-selection-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  git("init", "-b", "main");
  mkdirSync(join(repo, "scripts"));
  const shell = join(repo, "scripts/test-release.sh");
  const baseline = "release_case_existing() {\n  :\n}\n";
  writeFileSync(shell, baseline);
  git("add", ".");
  git(
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "commit",
    "-m",
    "fixture baseline",
  );
  assert.deepEqual(changedMachinery(repo, suites, "main"), []);
  writeFileSync(shell, baseline + "release_case_added() {\n  :\n}\n");
  assert.deepEqual(
    changedMachinery(repo, suites, "main").map((row) => row.name),
    ["runner-fixtures"],
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
    ["runner-fixtures"],
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
});

test("WO-133 review selection ignores release-only changes and retains host behavior suites", async () => {
  const repo = mkdtempSync(join(tmpdir(), "dotln-version-selection-"));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  const version = "packages/skeleton/src/version.ts";
  const compiler = "packages/compiler/src/artifact-identity.ts";
  try {
    git("init", "-b", "main");
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
    git("add", ".");
    git(
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-m",
      "fixture baseline",
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
test("exclusive machinery runs alone and product suites overlap within lane capacity", async () => {
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
        assert.equal(row.gateContext.reservedSlots, 4);
        assert.equal(row.gateContext.concurrency, 1);
        assert.ok(
          !["harness-fixtures", "process-debt"].some((name) =>
            active.has(name),
          ),
        );
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
    const git = (...args) =>
      execFileSync("git", args, {
        cwd: repo,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    git("init", "-q");
    git("config", "user.name", "Fixture");
    git("config", "user.email", "fixture@example.invalid");
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
    for (const file of DOCUMENT_GATE_STUBS)
      writeFileSync(
        join(repo, "scripts", file),
        file.endsWith(".mjs")
          ? observer
              .replace('require("node:fs")', "fs")
              .replace(/^/, 'import fs from "node:fs";\n')
          : observer,
      );
    for (const name of ["skeleton", "console"]) {
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
    git("add", ".");
    git("commit", "-qm", "Runner fixture");
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
    const documentCount = suites.filter((row) => row.document).length + 1;
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

// WO-157 item 13 (WO-151 D021): an unclassified docs JSONL and an unstubbed
// document suite fail the document gate, not only the suite that enumerates them.
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
  execFileSync("git", ["clone", "--quiet", "--shared", root, copy]);
  const listed = (...args) =>
    execFileSync("git", ["-C", root, ...args], { encoding: "utf8" })
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
    const git = (...args) =>
      execFileSync("git", args, {
        cwd: repo,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    git("init", "-q");
    git("config", "user.name", "Fixture");
    git("config", "user.email", "fixture@example.invalid");
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
    git("add", ".");
    git("commit", "-qm", "Runner stop fixture");
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
  execFileSync("git", ["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\nnode_modules/\ndist/\n");
  writeFileSync(join(repo, "scratch/retained.txt"), "tracked\n");
  execFileSync("git", ["add", "-f", "scratch/retained.txt"], { cwd: repo });
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
  execFileSync("git", ["init", "-q"], { cwd: repo });
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
  execFileSync("git", ["init", "-q"], { cwd: repo });
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
  execFileSync("git", ["init", "-q"], { cwd: repo });
  mkdirSync(join(repo, "scratch"));
  writeFileSync(join(repo, ".gitignore"), "scratch/\n");
  writeFileSync(join(repo, "input.ts"), "export const value = 1;\n");
  execFileSync("git", ["add", "input.ts"], { cwd: repo });
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
  const git = (...args) =>
    execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
  try {
    git("init", "-q");
    git("config", "user.name", "Fixture");
    git("config", "user.email", "fixture@example.invalid");
    mkdirSync(join(repo, "docs"));
    writeFileSync(
      join(repo, ".gitattributes"),
      "projection.js dotln-generated\n",
    );
    writeFileSync(join(repo, "source.js"), "export const result = 1;\n");
    writeFileSync(join(repo, "projection.js"), "generated one\n");
    writeFileSync(join(repo, "docs/report.md"), "report one\n");
    writeFileSync(
      join(repo, "package.json"),
      '{"private":true,"dependencies":{"fixture":"1.0.0"}}\n',
    );
    git("add", ".");
    git("commit", "-qm", "fixture");
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
    assert.notEqual(gateTreeHash(repo), tree);
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
    git("add", ".");
    git("commit", "-qm", "dependency update");
    assert.equal(gateCodeIdentity(repo, "HEAD"), gateCodeIdentity(repo));
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

// WO-140: a fake marker and an owned denied directory stand in for a harness
// sandbox, so the preflight runs the same in and outside a real one.
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
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  git("init", "-q");
  // Every commit otherwise starts Git's detached automatic maintenance. Git
  // 2.55 estimates loose objects from objects/17 alone, so two there made a
  // fixture commit start a geometric repack still writing .git/objects/pack
  // when the teardown removed the tree (ENOTEMPTY; WO-063 D005, WO-157). The
  // fixture has no maintenance to exercise.
  git("config", "maintenance.auto", "false");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
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
  git("add", ".");
  git("commit", "-qm", "Host-confinement fixture");
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
  // Each nests `sandbox-exec`, which an outer Seatbelt sandbox refuses:
  // skeleton's native cases (WO-140-D001) and portfolio's discovery checks
  // and verification witness (WO-100-D018).
  assert.deepEqual(
    suites.filter((row) => row.needs).map((row) => [row.name, row.needs]),
    [
      ["skeleton", OUTSIDE_CONFINEMENT],
      ["portfolio", OUTSIDE_CONFINEMENT],
    ],
  );
  // WO-121 F1 was a defect in a release case, never a reason to declare.
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
  const plain = await runGate(["--serial"], fixture.repo, {
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
  // WO-161: CLI spelling changes, recorded identities and selections do not.
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
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
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
    git("add", "docs/control/orders");
    git("commit", "-qm", "Reviewer observation");
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
  execFileSync("git", ["init", "-q"], { cwd: repo });
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

// WO-157 item 15 (WO-063 D005): a fixture commit started Git's detached
// automatic maintenance, whose geometric repack could still be writing
// .git/objects/pack when the teardown removed the tree (ENOTEMPTY).
test("WO-157 the host-confinement fixture's commits start no background Git maintenance that could race its teardown", (t) => {
  const { repo } = confinementFixture(t);
  const git = (args, options = {}) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    });
  const format = git(["rev-parse", "--show-object-format"]).trim();
  // Git 2.55 estimates loose objects from objects/17 alone; two there make a
  // repository's automatic maintenance repack.
  let planted = 0;
  for (let index = 0; planted < 2; index++) {
    const text = `teardown probe ${index}\n`;
    const id = createHash(format)
      .update(`blob ${Buffer.byteLength(text)}\0${text}`)
      .digest("hex");
    if (!id.startsWith("17")) continue;
    git(["hash-object", "-w", "--stdin"], { input: text });
    planted += 1;
  }
  const needed = spawnSync("git", ["maintenance", "is-needed", "--auto"], {
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
  git(["add", "teardown.txt"]);
  git(["commit", "-qm", "Teardown probe"], {
    env: { ...process.env, GIT_TRACE2_EVENT: join(traces, "commit.jsonl") },
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
  const git = (...args) =>
    execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
  git("init", "-q", "-b", "main");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
  writeFileSync(join(repo, "scripts/inherited.mjs"), "process.exitCode = 1;\n");
  writeFileSync(
    join(repo, "scripts/introduced.mjs"),
    "process.exitCode = 0;\n",
  );
  git("add", ".");
  git("commit", "-qm", "base checks");
  const base = git("rev-parse", "HEAD");
  writeFileSync(
    join(repo, "scripts/introduced.mjs"),
    "process.exitCode = 1;\n",
  );
  const table = ["inherited", "introduced"].map((name) => ({
    name,
    document: true,
    command: [process.execPath, `scripts/${name}.mjs`],
  }));
  const before = git("diff");
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
    assert.equal(git("diff"), before);
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
