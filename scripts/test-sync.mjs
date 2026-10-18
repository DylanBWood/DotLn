import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { syncArtifacts } from "./sync.mjs";
import {
  checkGenerated,
  checkArtifact,
  generatedArtifacts,
} from "./lib/generated-artifacts.mjs";
import { TOOL_ROOT } from "./lib/config.mjs";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "dotln-sync-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      private: true,
      scripts: {
        "format:check": "node scripts/artifact.mjs format check",
        format: "node scripts/artifact.mjs format write",
      },
    }),
  );
  writeFileSync(
    join(root, "scripts/artifact.mjs"),
    `
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
const [name, mode, previous] = process.argv.slice(2);
if (mode === 'write') {
  if (previous && (!existsSync(previous) || readFileSync(previous, 'utf8') !== 'current\\n')) throw new Error('dependency out of order: '+previous);
  writeFileSync(name, 'current\\n');
  appendFileSync('writes.txt', name+'\\n');
} else process.exitCode = existsSync(name) && readFileSync(name, 'utf8') === 'current\\n' ? 0 : 1;
`,
  );
  const command = (name, mode, previous) => [
    process.execPath,
    "scripts/artifact.mjs",
    name,
    mode,
    ...(previous ? [previous] : []),
  ];
  const names = generatedArtifacts(TOOL_ROOT).map((row) => row.name);
  const artifacts = names.map((name, index) => ({
    name,
    check: command(name, "check"),
    write: command(name, "write", names[index - 1] ?? "format"),
  }));
  const snapshot = () =>
    readdirSync(root)
      .filter((name) => name !== "scripts")
      .sort()
      .map((name) => [name, readFileSync(join(root, name), "utf8")]);
  return { root, names, artifacts, snapshot };
}

test("role oracle requires the named case to execute and pass", (t) => {
  const { root } = fixture(t);
  const oracle = generatedArtifacts(TOOL_ROOT).find(
    (row) => row.name === "role-oracle",
  );
  const selected = {
    ...oracle,
    check: [oracle.check[0], join(TOOL_ROOT, oracle.check[1])],
  };
  const name =
    "WO-145 optional economy support preserves historical snapshots through the current release-close role and changes only executor instructions on";
  const define = (options = {}, body = "", title = name) =>
    `test(${JSON.stringify(title)}, ${JSON.stringify(options)}, () => {${body}});`;
  for (const [label, source, expected] of [
    ["passing", define(), 0],
    ["renamed", define({}, "", "renamed oracle"), 1],
    ["removed", "", 1],
    ["skipped", define({ skip: true }), 1],
    ["TODO", define({ todo: true }), 1],
    ["failing", define({}, "throw new Error('stale oracle')"), 1],
    ["duplicate", define() + define(), 1],
    ["empty suite", `describe(${JSON.stringify(name)}, () => {});`, 1],
  ]) {
    writeFileSync(
      join(root, "scripts/test-process-debt.mjs"),
      `import test, { describe } from 'node:test';\n${source}\n`,
    );
    const result = checkArtifact(selected, root);
    assert.equal(result.exitCode, expected, `${label}: ${result.output}`);
    if (expected)
      assert.match(result.output, /requires exactly one executed passing case/);
  }
});

test("generated freshness names every stale artifact and leaves all bytes unchanged", (t) => {
  const { root, artifacts, names, snapshot } = fixture(t);
  const before = snapshot();
  const result = checkGenerated(root, { artifacts });
  assert.equal(result.exitCode, 1);
  assert.deepEqual(result.stale, names);
  assert.deepEqual(snapshot(), before);
  for (const row of result.cases) {
    assert.equal(row.executed, true);
    assert.ok(row.durationMs >= 0);
    assert.ok(Date.parse(row.finishedAt) >= Date.parse(row.startedAt));
  }
  for (const name of names) {
    for (const entry of names)
      writeFileSync(
        join(root, entry),
        entry === name ? "stale\n" : "current\n",
      );
    assert.deepEqual(checkGenerated(root, { artifacts }).stale, [name]);
  }
});

test("sync regenerates in dependency order only when stale and its second run changes no byte", async (t) => {
  const { root, artifacts, names, snapshot } = fixture(t);
  const first = await syncArtifacts(root, { artifacts });
  assert.equal(first.exitCode, 0, JSON.stringify(first));
  assert.deepEqual(
    first.rows.map((row) => row.action),
    names.map(() => "regenerated").concat("regenerated"),
  );
  assert.deepEqual(
    readFileSync(join(root, "writes.txt"), "utf8").trim().split("\n"),
    ["format", ...names],
  );
  const before = snapshot();
  const second = await syncArtifacts(root, { artifacts });
  assert.equal(second.exitCode, 0);
  assert.ok(
    second.rows.every(
      (row) =>
        row.before === "current" &&
        row.after === "current" &&
        row.action === "none",
    ),
  );
  assert.deepEqual(snapshot(), before);
});

test("sync refuses a timed-out check without running its writer", async (t) => {
  const { root, artifacts } = fixture(t);
  writeFileSync(join(root, "format"), "current\n");
  const [artifact] = artifacts;
  const commands = [];
  const result = await syncArtifacts(root, {
    artifacts: [artifact],
    run: (command) => {
      commands.push(command);
      return command === artifact.check
        ? { exitCode: 1, timedOut: true, output: "check exceeded its deadline" }
        : { exitCode: 0, output: "" };
    },
  });
  assert.equal(result.exitCode, 1);
  const row = result.rows.find((entry) => entry.artifact === artifact.name);
  assert.deepEqual(
    [row.before, row.after, row.action],
    ["unknown", "unknown", "refused"],
  );
  assert.match(row.reason, /timed out/);
  assert.ok(!commands.includes(artifact.write), "no writer ran");
});

test("sync refuses manual role oracles, changed feedback judgments and baseline fingerprints without overwriting them", async (t) => {
  const { root, artifacts } = fixture(t);
  writeFileSync(join(root, "format"), "current\n");
  const selected = artifacts
    .filter((row) =>
      ["role-oracle", "feedback-evidence", "baseline-fingerprints"].includes(
        row.name,
      ),
    )
    .map(({ write, ...row }) => ({
      ...row,
      ...(row.name === "feedback-evidence" ? { kind: "feedback" } : {}),
      route:
        row.name === "role-oracle"
          ? "authorizing decision and a new linked role oracle"
          : "authorized baseline-review route",
    }));
  for (const row of selected)
    writeFileSync(join(root, row.name), "historical\n");
  const result = await syncArtifacts(root, {
    artifacts: selected,
    mint: async () => ({
      exitCode: 1,
      output:
        "Changed judged sources require a live feedback episode; carry refused",
    }),
  });
  assert.equal(result.exitCode, 1);
  assert.deepEqual(
    result.rows.slice(1).map((row) => row.action),
    ["refused", "refused", "refused"],
  );
  assert.match(
    result.rows.find((row) => row.artifact === "role-oracle").reason,
    /authorizing decision/,
  );
  assert.match(
    result.rows.find((row) => row.artifact === "feedback-evidence").reason,
    /live feedback episode/,
  );
  assert.match(
    result.rows.find((row) => row.artifact === "baseline-fingerprints").reason,
    /baseline-review/,
  );
  for (const row of selected)
    assert.equal(readFileSync(join(root, row.name), "utf8"), "historical\n");
});

test(
  "the real inventory checks stale artifacts, regenerates safe outputs, refuses manual changes and is byte-stable",
  { timeout: 240_000 },
  async (t) => {
    const { editionCopy } = await import("./lib/evidence-fixture.mjs");
    const { checkArtifact, runArtifactCommand } =
      await import("./lib/generated-artifacts.mjs");
    const { currentEvidence } =
      await import("../packages/skeleton/src/evidence-editions.mjs");
    const { createHash } = await import("node:crypto");
    const { execGit } = await import("./lib/git.mjs");
    const { appendFileSync, existsSync, lstatSync } = await import("node:fs");
    const { copy } = editionCopy(t, { workspace: true });
    const inventory = generatedArtifacts(copy);
    const byName = (name) => inventory.find((row) => row.name === name);
    const bytes = (file) => readFileSync(join(copy, file));
    const put = (file, value) => writeFileSync(join(copy, file), value);
    const checked = (name) => checkArtifact(byName(name), copy);
    const before = await syncArtifacts(copy);
    assert.equal(before.exitCode, 0, JSON.stringify(before.rows));

    const evidence = currentEvidence(copy, "authority");
    const damage = [
      [
        "meta",
        "docs/lineage/decisions-index.md",
        (s) => s + "\nstale fixture\n",
      ],
      ["lineage", "docs/lineage/README.md", (s) => s + "\nstale fixture\n"],
      ["index", "docs/work-orders/README.md", (s) => s + "\nstale fixture\n"],
      [
        "release-surfaces",
        "README.md",
        (s) => s.replace(/v\d+\.\d+\.\d+/u, "v9999.0.0"),
      ],
      [
        "harness",
        ".agents/skills/dotln-executor/SKILL.md",
        (s) => s + "\nstale fixture\n",
      ],
      [
        "role-oracle",
        "packages/skeleton/fixtures/wo216-role-baseline.json",
        (s) =>
          s.replace(
            /"historicalSha256": "[a-f0-9]{64}"/u,
            '"historicalSha256": "' + "0".repeat(64) + '"',
          ),
      ],
      [
        "authority-evidence",
        `${evidence.directory}/authority.json`,
        () => "{}\n",
      ],
      [
        "publication",
        "docs/publication/software-engineer-toc.md",
        (s) =>
          s.replace(
            /^Source lock:.*$/mu,
            "Source lock: `sha256:" + "0".repeat(64) + "`",
          ),
      ],
    ];
    const originals = new Map();
    for (const [name, file, change] of damage) {
      const original = bytes(file);
      originals.set(file, original);
      const changed = change(original.toString());
      assert.notEqual(
        changed,
        original.toString(),
        `fixture actually damages ${name}`,
      );
      put(file, changed);
      const stale = checked(name);
      assert.equal(stale.exitCode, 1, `${name}: ${stale.output}`);
    }
    const all = checkGenerated(copy);
    for (const [name] of damage) assert.ok(all.stale.includes(name), name);

    const { runGate } = await import("./test-runner.mjs");
    const messages = [];
    const log = console.log;
    let failed;
    console.log = (...values) => messages.push(values.join(" "));
    try {
      failed = await runGate(["--only", "fixture-suite"], copy, {
        table: [
          {
            name: "build",
            build: true,
            command: [
              process.execPath,
              "-e",
              "throw new Error('build must not start')",
            ],
          },
          {
            name: "generated",
            structural: true,
            document: true,
            command: [
              process.execPath,
              "scripts/structural-checks.mjs",
              "generated",
            ],
          },
          {
            name: "fixture-suite",
            product: true,
            command: [
              process.execPath,
              "-e",
              "throw new Error('suite must not start')",
            ],
          },
        ],
      });
    } finally {
      console.log = log;
    }
    assert.equal(failed.exitCode, 1);
    for (const [name] of damage) assert.ok(failed.stale.includes(name), name);
    assert.ok(failed.unrunSuites.includes("fixture-suite"));
    assert.match(messages.join("\n"), /npm run sync/u);
    const manualOracle = await syncArtifacts(copy, {
      artifacts: [byName("role-oracle")],
    });
    assert.equal(manualOracle.rows.at(-1).action, "refused");
    assert.match(manualOracle.rows.at(-1).reason, /authorizing.*decision/u);
    const oracle = damage.find(([name]) => name === "role-oracle")[1];
    assert.notDeepEqual(bytes(oracle), originals.get(oracle));
    put(oracle, originals.get(oracle));

    // A real judged-source edit must use the actual feedback carry refusal.
    const judged = "scripts/lib/host-resources.mjs";
    const originalJudged = bytes(judged);
    appendFileSync(
      join(copy, judged),
      "\n// Changed feedback subject in the isolated fixture.\n",
    );
    const denied = await syncArtifacts(copy, {
      artifacts: [byName("feedback-evidence")],
    });
    assert.equal(denied.rows.at(-1).action, "refused");
    assert.match(denied.rows.at(-1).reason, /live feedback episode/u);
    put(judged, originalJudged);

    const baseline = "docs/control/comment-baseline.json";
    const baselineBefore = bytes(baseline);
    put(
      "scripts/fixture-comment.mjs",
      "// WO-999 fixture label without an explanation.\nexport {};\n",
    );
    const refusedBaseline = await syncArtifacts(copy, {
      artifacts: [byName("baseline-fingerprints")],
    });
    assert.equal(refusedBaseline.rows.at(-1).action, "refused");
    assert.match(refusedBaseline.rows.at(-1).reason, /baseline-review/u);
    assert.deepEqual(bytes(baseline), baselineBefore);
    rmSync(join(copy, "scripts/fixture-comment.mjs"));

    const regenerated = await syncArtifacts(copy);
    assert.equal(regenerated.exitCode, 0, JSON.stringify(regenerated.rows));
    for (const [name] of damage.filter(
      ([name]) => !["role-oracle", "index"].includes(name),
    ))
      assert.equal(
        regenerated.rows.find((row) => row.artifact === name).action,
        "regenerated",
        name,
      );
    assert.equal(
      regenerated.rows.find((row) => row.artifact === "index").after,
      "current",
      "meta may refresh the work-order index before its own check",
    );
    assert.equal(checked("publication").exitCode, 0);
    assert.notDeepEqual(
      bytes(`${evidence.directory}/authority.json`),
      originals.get(`${evidence.directory}/authority.json`),
      "old evidence is never overwritten",
    );
    assert.notEqual(
      currentEvidence(copy, "authority").directory,
      evidence.directory,
    );
    const tree = () => {
      const hash = createHash("sha256");
      const paths = execGit(
        [
          "-C",
          copy,
          "ls-files",
          "-z",
          "--cached",
          "--others",
          "--exclude-standard",
        ],
        { encoding: "utf8" },
      )
        .split("\0")
        .filter(Boolean);
      for (const file of [...new Set(paths)].sort())
        if (
          existsSync(join(copy, file)) &&
          lstatSync(join(copy, file)).isFile()
        )
          hash.update(file + "\0").update(bytes(file));
      return hash.digest("hex");
    };
    const stable = tree();
    const second = await syncArtifacts(copy);
    assert.equal(second.exitCode, 0, JSON.stringify(second.rows));
    assert.ok(
      second.rows.every(
        (row) => row.before === "current" && row.action === "none",
      ),
      JSON.stringify(second.rows),
    );
    assert.equal(tree(), stable);
  },
);
