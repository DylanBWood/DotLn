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
import { runGit } from "./lib/git.mjs";

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
} else {
  process.exitCode = existsSync(name) && readFileSync(name, 'utf8') === 'current\\n' ? 0 : 1;
  if (process.exitCode) console.log('DOTLN_ARTIFACT_STALE '+name);
}
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

test("sync refuses an unclassified failure without running its writer", async (t) => {
  const { root, artifacts } = fixture(t);
  const [artifact] = artifacts;
  const commands = [];
  const result = await syncArtifacts(root, {
    artifacts: [artifact],
    run: (command) => {
      commands.push(command);
      return command === artifact.check
        ? { exitCode: 1, output: "invalid source input" }
        : { exitCode: 0, output: "" };
    },
  });
  assert.equal(result.exitCode, 1);
  assert.equal(result.rows.at(-1).before, "unknown");
  assert.match(result.rows.at(-1).reason, /check did not report stale/);
  assert.equal(commands.includes(artifact.write), false);
});

test("sync classifies real stale reports for every regenerable artifact and refuses unrelated failures", async () => {
  const reports = {
    format: [
      "[warn] Code style issues found in the above file. Run Prettier with --write to fix.",
    ],
    meta: [
      "Decisions index is stale; run npm run meta",
      "follow-ups: register is stale; run npm run meta or npm run plan -- followups --sync",
    ],
    lineage: [
      "Stale docs/lineage/README.md; run node scripts/lineage.mjs index",
      "Missing docs/lineage/README.md; run node scripts/lineage.mjs index",
    ],
    index: [
      "docs/work-orders/README.md is stale at line 3; run npm run work-orders -- index",
      "docs/work-orders/HISTORY.md: missing or malformed tag snapshot; run npm run work-orders -- index",
    ],
    "release-surfaces": [
      "FAIL release-block: observed no strict version; expected v1.0.0",
      "FAIL workspace-pin @dotln/skeleton -> @dotln/compiler: observed 0.1.0; expected exact workspace version 0.2.0",
    ],
    siblings: [
      "error: docs/siblings/README.md is stale at line 3; run node scripts/siblings.mjs index",
      "error: docs/siblings/README.md: the starter-fixture entry records manifest hash `old`, and its latest receipt docs/evidence/siblings/receipt.json records `new`; run node scripts/siblings.mjs index",
      "error: docs/siblings/tag-observations.json: missing tag observations; run node scripts/siblings.mjs index",
      "error: docs/siblings/tag-observations.json: invalid tag observations; run node scripts/siblings.mjs index",
      "error: docs/siblings/tag-observations.json: observations do not match receipt commits; run node scripts/siblings.mjs index",
      `error: docs/siblings/tag-observations.json: ${"a".repeat(40)} records tag "v9999.0.0", which is not a Git tag at its receipt commit; run node scripts/siblings.mjs index`,
      `error: docs/siblings/tag-observations.json: ${"a".repeat(40)} records nearest "v9999.0.0", which is not a Git tag at or below its receipt commit; run node scripts/siblings.mjs index`,
    ],
    harness: ["harness drift: .agents/skills/dotln-executor/SKILL.md"],
    "authority-evidence": [
      "stale WO-217 evidence: bundle-diff.json; select a new edition or revision to preserve existing evidence",
    ],
    "artifact-evidence": [
      "stale artifact evidence: identity.json; select a new edition to preserve the historical evidence",
    ],
    "verification-evidence": ["stale verification evidence: stale-status.json"],
    "feedback-evidence": [
      "feedback evidence is stale\n",
      "feedback evidence is stale: a compiler release moved the policy hash since the selected edition",
      "StaleFeedbackEdition [Error]: feedback evidence is stale: unresolvable edition reference: verification.json",
    ],
    "console-fixtures": [
      "console selfhost fixture must follow the selected feedback edition; run npm run sync",
      "console fixture changed: selfhost.html",
    ],
    publication: ["FAIL 2 edition(s) are stale"],
  };
  const inventory = generatedArtifacts(TOOL_ROOT);
  assert.deepEqual(
    Object.keys(reports).sort(),
    [
      "format",
      ...inventory
        .filter(
          (row) =>
            !row.inspect &&
            (row.write || row.regenerate || row.kind || row.publication),
        )
        .map((row) => row.name),
    ].sort(),
    "each regenerable checker needs its real stale reports",
  );
  const runtime = inventory.find((row) => row.name === "runtime");
  assert.equal(
    checkArtifact(
      {
        ...runtime,
        inspect: () => ({ current: false, reason: "source changed" }),
      },
      TOOL_ROOT,
    ).stale,
    true,
  );
  for (const [name, messages] of Object.entries(reports)) {
    for (const output of messages) {
      const result = { exitCode: 1, output };
      assert.equal(
        checkArtifact({ name }, TOOL_ROOT, () => result).stale,
        true,
        `${name}: ${output}`,
      );
      for (const failure of [
        { ...result, exitCode: 2 },
        { ...result, timedOut: true },
        { ...result, unavailable: true },
      ])
        assert.equal(
          checkArtifact({ name }, TOOL_ROOT, () => failure).stale,
          false,
          name,
        );
    }
    for (const output of [
      "",
      "Error: check crashed",
      "EACCES: permission denied",
      "invalid source input",
    ]) {
      const writes = [];
      const row = { name, check: ["check"], write: ["write"] };
      const result = await syncArtifacts(TOOL_ROOT, {
        artifacts: [row],
        run: (command) => {
          if (command === row.check) return { exitCode: 1, output };
          if (command === row.write) writes.push(command);
          return { exitCode: 0, output: "" };
        },
      });
      assert.equal(result.rows.at(-1).action, "refused", `${name}: ${output}`);
      assert.equal(writes.length, 0, name);
    }
  }
  for (const [name, output] of [
    ["publication", "FAIL 1 edition(s) are stale\nFAIL invalid source"],
    [
      "release-surfaces",
      "FAIL release-block: stale\nFAIL component-version: invalid source",
    ],
    [
      "siblings",
      "error: docs/siblings/siblings.json: no sibling declaration; write it before generating the registry",
    ],
    ["siblings", "error: docs/evidence/siblings/receipt.json: invalid receipt"],
  ])
    assert.equal(
      checkArtifact({ name }, TOOL_ROOT, () => ({ exitCode: 1, output })).stale,
      false,
      output,
    );
});

test("sync names the unselected orphan when an evidence writer or recheck fails", async (t) => {
  for (const stage of ["write", "check"]) {
    const { root } = fixture(t);
    runGit(root, ["init", "-q", "-b", "wo-999"]);
    mkdirSync(join(root, "docs/control/orders"), { recursive: true });
    mkdirSync(join(root, "docs/evidence"), { recursive: true });
    writeFileSync(
      join(root, "docs/control/orders/WO-999.jsonl"),
      JSON.stringify({
        schemaVersion: 1,
        recordedAt: "2026-01-01T00:00:00.000Z",
        type: "WorkOrderActivated",
        workOrderId: "WO-999",
        workOrderPath: "docs/work-orders/WO-999-fixture.md",
        effortDeclarationValidated: true,
      }) + "\n",
    );
    const manifest = JSON.stringify({
      schemaVersion: 1,
      editions: { authority: { workOrder: "WO-998", revision: "001" } },
    });
    writeFileSync(join(root, "docs/evidence/current.json"), manifest);
    const orphan = "docs/evidence/WO-999/authority/001";
    const result = await syncArtifacts(root, {
      artifacts: [
        {
          name: "authority-evidence",
          kind: "authority",
          file: "scripts/fake-evidence.mjs",
          check: ["fake", "check"],
        },
      ],
      run: (command) => {
        if (command[0] === "npm") return { exitCode: 0, output: "" };
        if (command[0] === "fake")
          return {
            exitCode: 1,
            stale: true,
            output: "fixture evidence is stale",
          };
        if (command.includes("--write")) {
          mkdirSync(join(root, orphan), { recursive: true });
          writeFileSync(join(root, orphan, "invalid.json"), "{}\n");
          return {
            exitCode: stage === "write" ? 1 : 0,
            output: "fixture writer",
          };
        }
        return { exitCode: 1, output: "fixture recheck" };
      },
    });
    assert.equal(result.exitCode, 1);
    assert.ok(
      result.rows.some((row) =>
        row.reason?.includes(
          `Unselected orphan evidence revision retained: ${orphan}`,
        ),
      ),
      JSON.stringify(result),
    );
    assert.equal(
      readFileSync(join(root, "docs/evidence/current.json"), "utf8"),
      manifest,
    );
  }
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
    // The complete inventory runs validate formatting. Isolated artifact
    // cases exercise their real checkers and writers with controlled damage.
    const syncOne = (name) =>
      syncArtifacts(copy, {
        artifacts: [byName(name)],
        run: (command, ...args) =>
          command[0] === "npm" && command[2] === "format:check"
            ? { exitCode: 0, output: "" }
            : runArtifactCommand(command, ...args),
      });
    const before = await syncArtifacts(copy);
    assert.equal(before.exitCode, 0, JSON.stringify(before.rows));

    // Exercise the actual checkers and writers so a changed diagnostic cannot
    // silently strand their generated pages behind the stale-only refusal.
    for (const [name, file, mutations] of [
      [
        "siblings",
        "docs/siblings/README.md",
        [
          (s) => s + "\nstale fixture\n",
          (s) =>
            s.replace(/(^- \*\*Manifest hash:\*\* ).+$/m, "$1`stale fixture`"),
        ],
      ],
      [
        "siblings",
        "docs/siblings/tag-observations.json",
        [
          () => JSON.stringify({ schemaVersion: 0, commits: {} }) + "\n",
          () => JSON.stringify({ schemaVersion: 1, commits: {} }) + "\n",
          () => null,
        ],
      ],
      [
        "index",
        "docs/work-orders/HISTORY.md",
        [(s) => s.replace(/^<!-- dotln-work-order-tags:.*$/m, "")],
      ],
    ]) {
      const expected = bytes(file);
      for (const mutate of mutations) {
        const changed = mutate(expected.toString());
        assert.notEqual(
          changed,
          expected.toString(),
          `fixture damages ${file}`,
        );
        if (changed === null) rmSync(join(copy, file));
        else put(file, changed);
        const repaired = await syncOne(name);
        assert.equal(repaired.exitCode, 0, JSON.stringify(repaired.rows));
        assert.equal(repaired.rows.at(-1).before, "stale");
        assert.equal(repaired.rows.at(-1).after, "current");
        assert.equal(
          repaired.rows.at(-1).action,
          "regenerated",
          JSON.stringify(repaired.rows),
        );
        assert.deepEqual(bytes(file), expected, file);
      }
    }

    const evidence = currentEvidence(copy, "authority");
    const authorityFile = `${evidence.directory}/bundle-diff.json`;
    const damage = [
      // Judge this difference while its harness dependency is still current.
      ["authority-evidence", authorityFile, () => "{}\n"],
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
      if (name !== "role-oracle")
        assert.equal(stale.stale, true, `${name}: ${stale.output}`);
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
    const manualOracle = await syncOne("role-oracle");
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
    const denied = await syncOne("feedback-evidence");
    assert.equal(denied.rows.at(-1).action, "refused");
    assert.match(denied.rows.at(-1).reason, /live feedback episode/u);
    put(judged, originalJudged);

    const baseline = "docs/control/comment-baseline.json";
    const baselineBefore = bytes(baseline);
    put(
      "scripts/fixture-comment.mjs",
      "// WO-999 fixture label without an explanation.\nexport {};\n",
    );
    const refusedBaseline = await syncOne("baseline-fingerprints");
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
      bytes(authorityFile),
      originals.get(authorityFile),
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
