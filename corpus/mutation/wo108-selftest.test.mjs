import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { applySite, enumerate, seeds, sha256, tokens } from "./enumerate.mjs";
import {
  cleanupScratch,
  createScratch,
  evaluate,
  exactPatch,
  findingsText,
  parseTap,
  requireGreenBaseline,
  runMatrix,
  runProcess,
  summarize,
  validateRows,
  validateScratch,
} from "./mutate.mjs";

const dependencies = resolve("node_modules");
const baseCommit = "1".repeat(40);
const green = {
  verdict: "survived",
  compiled: true,
  phase: "test",
  tests: 3,
  passed: 3,
  failed: 0,
  cancelled: 0,
  skipped: 0,
  durationMs: 1,
  killingTests: [],
};
const policy = { runBudgetMs: 10000 };
const fixture = (changes = {}) => {
  const compile = `
export const add = (n: number): number => n + 1;
export const boundary = (n: number): number => n < 3 ? 10 : 20;
export function tag(support = { supportedTags: ["ok"] }, active = { tags: ["ok"] }) {
  return ${seeds[0].before};
}
export function tie(tied: { value: number } | undefined = undefined) {
  if (${seeds[1].before}
    return tied.value;
  }
  return 1;
}
export function missing(active = { requiredCapabilities: ["ok"] }, capabilities = new Set(["ok"])) {
  return ${seeds[2].before};
}
export function duplicates(values: string[] = ["one"]) {
  const seen = new Set<string>(), duplicates = new Set<string>();
  for (const key of values) {
    if (seen.has(key)) ${seeds[3].before}
    seen.add(key);
  }
  return [...duplicates];
}
export function budget(group = { linkIds: [1] }, container = { socketBudget: 2 }) {
  return ${seeds[4].before};
}
export function costs(support = { cost: { promptTokens: 0, extraEpisodes: 1 } }) {
  return { ${seeds[7].before} };
}
`;
  const normalize = `
export const pipeline = (value = { orderedSupportFacetIds: ["first", "second"] }) => (${seeds[5].before});
export const identity = (value: { updateLaws: string[] } = { updateLaws: [] }) => (${seeds[6].before});
`;
  const contents = {
    "package.json": '{"private":true,"workspaces":["packages/*"]}',
    "tsconfig.json": JSON.stringify({
      files: [],
      references: ["kernel", "compiler", "skeleton"].map((name) => ({
        path: `packages/${name}`,
      })),
    }),
  };
  for (const name of ["kernel", "compiler", "skeleton"]) {
    contents[`packages/${name}/package.json`] = JSON.stringify({
      name: `@dotln/${name}`,
      type: "module",
      main: "dist/src/index.js",
    });
    contents[`packages/${name}/tsconfig.json`] = JSON.stringify({
      compilerOptions: {
        composite: true,
        strict: true,
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        outDir: "dist",
        rootDir: ".",
        skipLibCheck: true,
        types: ["node"],
      },
      include: ["src/*.ts", "test/*.ts"],
    });
    contents[`packages/${name}/src/index.ts`] = "export const marker = 1;\n";
    contents[`packages/${name}/test/fixture.test.ts`] =
      `import test from "node:test"; import assert from "node:assert/strict"; import {marker} from "../src/index.js"; test("${name} planted smoke", () => assert.equal(marker, 1));`;
  }
  contents["packages/compiler/src/compile.ts"] = compile;
  contents["packages/compiler/src/normalize.ts"] = normalize;
  contents["packages/compiler/test/fixture.test.ts"] = `
import test from "node:test"; import assert from "node:assert/strict";
import * as probe from "../src/compile.js";
import {pipeline, identity} from "../src/normalize.js";
test("planted arithmetic kill", () => assert.equal(probe.add(1), 2));
test("ordinary inputs leave eight historical gaps", () => {
  assert.equal(probe.boundary(0), 10);
  assert.equal(probe.tag(), true); assert.equal(probe.tie(), 1);
  assert.deepEqual(probe.missing(), []); assert.deepEqual(probe.duplicates(), []);
  assert.equal(probe.budget(), false);
  assert.deepEqual(pipeline(), ["first", "second"]); assert.deepEqual(identity(), []);
  assert.deepEqual(probe.costs(), {promptTokens: 0, extraEpisodes: 1});
});`;
  Object.assign(contents, changes);
  for (const [path, value] of Object.entries(contents))
    if (value === null) delete contents[path];
  return {
    baseCommit,
    files: Object.entries(contents).map(([path, text]) => ({
      path,
      mode: "100644",
      contents: Buffer.from(text),
    })),
    sources: new Map(
      Object.entries(contents).filter(([path]) => path.includes("/src/")),
    ),
  };
};
const syntheticSite = (snapshot, before, after, id = "M00001") => {
  const file = "packages/compiler/src/compile.ts",
    source = snapshot.sources.get(file);
  const start = source.indexOf(before);
  assert.ok(start >= 0);
  return {
    id,
    file,
    line: source.slice(0, start).split("\n").length,
    start,
    end: start + before.length,
    before,
    after,
    sourceHash: sha256(source),
    operator: "planted",
    claim: "Synthetic planted acceptance claim.",
  };
};

test("deterministic enumeration changes exactly one guarded source site", () => {
  const snapshot = fixture();
  const first = enumerate(snapshot.sources),
    second = enumerate(new Map([...snapshot.sources].reverse()));
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(
    first.slice(0, 8).map((site) => site.seed),
    [1, 2, 3, 4, 5, 6, 7, 8],
  );
  for (const site of first) {
    const source = snapshot.sources.get(site.file),
      changed = applySite(source, site);
    assert.notEqual(changed, source);
    assert.equal(
      changed,
      source.slice(0, site.start) + site.after + source.slice(site.end),
    );
    assert.throws(() => applySite(source + "\n", site), /source drift/u);
  }
});

test("comments, strings, regex classes and nested template interpolations are opaque", () => {
  const source = [
    "// if (x < 9) return; ",
    'const text = "if (x === 1) return;";',
    'const pattern = /["\\/]x < 9\\/if/gu;',
    'const templ = `if (x < 9) ${`nested ${1 < 3 ? "yes" : "no"}`} tail`;',
    "export function actual(x: number) { if (x < 3) return; return x + 1; }",
  ].join("\n");
  const found = enumerate(
    new Map([["packages/kernel/src/sample.ts", source]]),
    { requireSeeds: false },
  );
  assert.ok(found.length > 3);
  assert.ok(found.every((site) => site.line === 5));
  assert.equal(
    tokens(source).filter((token) => token.value === "if").length,
    1,
  );
});

test("scratch cleanup rejects borrowed handles, changed markers and root symlinks", () => {
  const handle = createScratch(),
    outside = createScratch();
  const sentinel = join(outside.path, "sentinel");
  writeFileSync(sentinel, "keep");
  assert.throws(
    () => cleanupScratch({ path: handle.path }),
    /creation provenance/u,
  );
  const marker = readFileSync(join(handle.path, ".owner"));
  writeFileSync(join(handle.path, ".owner"), "foreign");
  assert.throws(() => cleanupScratch(handle), /provenance changed/u);
  writeFileSync(join(handle.path, ".owner"), marker);
  const moved = join(outside.path, "moved");
  renameSync(handle.path, moved);
  symlinkSync(outside.path, handle.path);
  assert.throws(() => validateScratch(handle), /provenance changed/u);
  // Move the substituted link into our independently owned fixture before
  // restoring the created root. Cleanup never follows the link.
  renameSync(handle.path, join(outside.path, "substituted-link"));
  renameSync(moved, handle.path);
  symlinkSync(outside.path, join(handle.path, "borrowed"));
  cleanupScratch(handle);
  assert.equal(readFileSync(sentinel, "utf8"), "keep");
  cleanupScratch(outside);
});

test("real offline builds distinguish named test kill, compile noise and planted survivor", async () => {
  const snapshot = fixture();
  const run = (site) => evaluate(snapshot, dependencies, site, 15000);
  assert.equal((await requireGreenBaseline(() => run(null))).tests, 4);
  const killed = await run(syntheticSite(snapshot, "n + 1", "n + 2"));
  assert.equal(killed.verdict, "killed-by-test");
  assert.ok(killed.killingTests.includes("planted arithmetic kill"));
  const compileKilled = await run(
    syntheticSite(snapshot, "n + 1", '"wrong type"'),
  );
  assert.equal(compileKilled.verdict, "killed-by-compile");
  assert.equal(compileKilled.compiled, false);
  assert.ok(compileKilled.diagnostics.includes("error TS2322"));
  const survivor = await run(syntheticSite(snapshot, "n < 3", "n <= 3"));
  assert.equal(survivor.verdict, "survived");
  assert.equal(survivor.passed, 4);
});

test("all eight historical compiler shapes are planted known-survivable cases", async (t) => {
  const snapshot = fixture();
  const sites = enumerate(snapshot.sources).filter((site) => site.seed);
  for (const site of sites)
    await t.test(`seed ${site.seed}`, async () => {
      const result = await evaluate(snapshot, dependencies, site, 15000);
      assert.equal(result.verdict, "survived", JSON.stringify(result));
      assert.equal(result.passed, 4);
    });
});

test("a real red baseline refuses before any matrix row is written", async () => {
  const snapshot = fixture({
    "packages/kernel/src/index.ts": "export const marker = 2;",
  });
  const handle = createScratch(),
    matrixPath = join(handle.path, "matrix.jsonl");
  try {
    await assert.rejects(
      runMatrix({
        snapshot,
        sites: [syntheticSite(snapshot, "n + 1", "n + 2")],
        policy,
        matrixPath,
        log: () => {},
        evaluateMutant: (site) => evaluate(snapshot, dependencies, site, 15000),
      }),
      /unmutated baseline is not green/u,
    );
    assert.equal(existsSync(matrixPath), false);
  } finally {
    cleanupScratch(handle);
  }
});

test("fresh compilation refuses a missing package suite and cannot reuse stale dist", async () => {
  const snapshot = fixture({ "packages/kernel/test/fixture.test.ts": null });
  await assert.rejects(
    evaluate(snapshot, dependencies, null, 15000),
    /empty kernel suite/u,
  );
});

test("timeout kills a descendant before it can write after its parent is stopped", async () => {
  const handle = createScratch(),
    sentinel = join(handle.path, "late");
  try {
    const descendant = `setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(sentinel)}, 'escaped'), 800);`;
    const parent = `require('node:child_process').spawn(process.execPath, ['-e', ${JSON.stringify(descendant)}], {stdio: 'inherit'}); setInterval(() => {}, 1000);`;
    const result = await runProcess(process.execPath, ["-e", parent], {
      cwd: handle.path,
      timeoutMs: 200,
    });
    assert.equal(result.timedOut, true);
    await new Promise((done) => setTimeout(done, 1000));
    assert.equal(existsSync(sentinel), false);
  } finally {
    cleanupScratch(handle);
  }
});

test("a compiled infinite-loop mutant is a test timeout, never a kill or survivor", async () => {
  const snapshot = fixture();
  const site = syntheticSite(
    snapshot,
    "n + 1",
    "((): number => { while (true) {} })()",
  );
  const result = await evaluate(snapshot, dependencies, site, 2000);
  assert.equal(result.verdict, "timeout");
  assert.equal(result.phase, "test");
  assert.equal(result.compiled, true);
});

test("rendered exact patches apply with Git and produce the same single mutation", () => {
  const snapshot = fixture(),
    handle = createScratch();
  try {
    for (const site of enumerate(snapshot.sources).slice(0, 8)) {
      const path = join(handle.path, site.file),
        source = snapshot.sources.get(site.file);
      mkdirSync(resolve(path, ".."), { recursive: true });
      writeFileSync(path, source);
      execFileSync("git", ["apply", "--unidiff-zero", "-"], {
        cwd: handle.path,
        input: exactPatch(source, site) + "\n",
      });
      assert.equal(readFileSync(path, "utf8"), applySite(source, site));
    }
  } finally {
    cleanupScratch(handle);
  }
});

test("append-only resume rechecks baseline, preserves prefix, records exact stopping point", async () => {
  const snapshot = fixture(),
    handle = createScratch();
  const matrixPath = join(handle.path, "matrix.jsonl");
  const sites = [
    syntheticSite(snapshot, "n + 1", "n + 2"),
    syntheticSite(snapshot, "n < 3", "n <= 3", "M00002"),
  ];
  const calls = [],
    logs = [];
  const evaluateMutant = async (site) => {
    calls.push(site?.id ?? "baseline");
    return green;
  };
  const options = {
    snapshot,
    sites,
    policy,
    matrixPath,
    log: (line) => logs.push(line),
    evaluateMutant,
  };
  try {
    await runMatrix({ ...options, maxMutants: 1 });
    const prefix = readFileSync(matrixPath, "utf8");
    assert.match(logs.at(-1), /declared-mutant-limit.*M00002/u);
    const rows = await runMatrix(options);
    assert.ok(readFileSync(matrixPath, "utf8").startsWith(prefix));
    assert.deepEqual(calls, [
      "baseline",
      "M00001",
      "baseline",
      "baseline",
      "M00002",
      "baseline",
    ]);
    assert.equal(rows.length, 2);
    const final = readFileSync(matrixPath, "utf8");
    await assert.rejects(
      runMatrix({
        ...options,
        evaluateMutant: async () => ({
          ...green,
          verdict: "killed-by-test",
          killingTests: ["red"],
        }),
      }),
      /baseline/u,
    );
    assert.equal(readFileSync(matrixPath, "utf8"), final);
    assert.throws(
      () =>
        validateRows(
          final.trimEnd(),
          sites,
          sha256(JSON.stringify(policy)),
          baseCommit,
        ),
      /partial tail/u,
    );
    assert.throws(
      () =>
        validateRows(
          final + prefix,
          sites,
          sha256(JSON.stringify(policy)),
          baseCommit,
        ),
      /inconsistent/u,
    );
    assert.throws(
      () => validateRows(final, sites, "wrong-policy", baseCommit),
      /inconsistent/u,
    );
    const inconsistent = final.split("\n").filter(Boolean).map(JSON.parse);
    inconsistent[0].failed = 1;
    assert.throws(
      () =>
        validateRows(
          inconsistent.map((row) => JSON.stringify(row) + "\n").join(""),
          sites,
          sha256(JSON.stringify(policy)),
          baseCommit,
        ),
      /inconsistent/u,
    );
    const report = findingsText(rows, sites, snapshot);
    assert.equal((report.match(/^## F-/gmu) ?? []).length, 2);
    assert.ok(report.includes("--reproduce M00001"));
    assert.ok(
      report.includes(
        exactPatch(snapshot.sources.get(sites[0].file), sites[0]),
      ),
    );
  } finally {
    cleanupScratch(handle);
  }
});

test("session budget and statistics never turn compilation noise or timeouts into strength", async () => {
  const handle = createScratch(),
    snapshot = fixture(),
    sites = [syntheticSite(snapshot, "n + 1", "n + 2")];
  let clock = 0;
  const logs = [];
  try {
    const rows = await runMatrix({
      snapshot,
      sites,
      policy: { runBudgetMs: 1 },
      matrixPath: join(handle.path, "matrix.jsonl"),
      log: (line) => logs.push(line),
      evaluateMutant: async () => green,
      now: () => clock++,
    });
    assert.equal(rows.length, 0);
    assert.match(logs.at(-1), /declared-session-time-budget.*M00001/u);
  } finally {
    cleanupScratch(handle);
  }
  const stats = summarize(
    [
      { verdict: "survived" },
      { verdict: "killed-by-test" },
      { verdict: "killed-by-compile" },
      { verdict: "killed-by-compile" },
      { verdict: "timeout", compiled: true },
    ],
    9,
  );
  assert.equal(stats.compiledKillRate, 0.5);
  assert.equal(stats.compileNoiseRate, 0.4);
  assert.equal(stats.compiledTimeoutsExcluded, 1);
  assert.equal(stats.remaining, 4);
});

test("TAP parsing retains nested named failures and refuses to infer an absent suite", () => {
  const tap = parseTap(
    "    not ok 1 - boundary assertion\nnot ok 2 - parent\n# tests 4\n# pass 2\n# fail 2\n# cancelled 0\n# skipped 0\n",
  );
  assert.deepEqual(tap.killingTests, ["boundary assertion", "parent"]);
  assert.equal(tap.tests, 4);
  assert.equal(parseTap("").tests, null);
});
