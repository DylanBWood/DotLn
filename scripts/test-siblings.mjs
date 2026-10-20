// Sibling registry fixtures. A temporary launchpad with its own Git history
// stands in for core, so the generator's reads of tags and committed control
// records are judged without this checkout's state; the export that writes a
// real receipt is judged in scripts/test-launchpad-update.mjs beside the other
// export cases. Every case starts from the same baseline state.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runGit } from "./lib/git.mjs";
import { json, sha256Hex as sha256 } from "./lib/helpers.mjs";
import {
  exportSiblings,
  capturePendingReceipts,
  receiptPath as carriedReceiptPath,
  pendingReceiptPath,
  readPendingReceipts,
  receiptRecorded,
  writeReceipt as recordReceipt,
  resolveReceipt,
} from "./lib/siblings.mjs";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generator = join(repository, "scripts/siblings.mjs");
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "dotln-siblings-")));
const launchpad = join(scratch, "launchpad");
const registryPath = "docs/siblings/README.md";
const observationsPath = "docs/siblings/tag-observations.json";
const declarationPath = "docs/siblings/siblings.json";
const receiptsRoot = "docs/evidence/siblings";
const env = { ...process.env, DOTLN_LAUNCHPAD: launchpad };
const run = (args) =>
  spawnSync(process.execPath, [generator, ...args], {
    encoding: "utf8",
    env,
    cwd: scratch,
  });
const ok = (result, label) => {
  assert.equal(result.status, 0, `${label}: ${result.stderr || result.stdout}`);
  return result;
};
const git = (args) => runGit(launchpad, args);
const write = (path, text) => {
  mkdirSync(dirname(join(launchpad, path)), { recursive: true });
  writeFileSync(join(launchpad, path), text);
};
const registry = () => readFileSync(join(launchpad, registryPath), "utf8");
const observations = () =>
  readFileSync(join(launchpad, observationsPath), "utf8");
const section = (id) =>
  new RegExp(`^## ${id}\\n([\\s\\S]*?)(?=^## |^<!-- )`, "mu").exec(
    registry(),
  )[1];
const line = (id, field) =>
  new RegExp(`^- \\*\\*${field}:\\*\\* (.*)$`, "mu").exec(section(id))?.[1];
const tableRows = (id) =>
  section(id)
    .split("\n")
    .filter((row) => row.startsWith("| 20"));
const declaration = {
  schemaVersion: 1,
  siblings: [
    {
      id: "starter-fixture",
      purpose: "The exported launchpad fixture.",
      relation: { kind: "export", coreCommit: null },
      capabilityRows: ["launchpad.starter"],
    },
    {
      id: "consumer-fixture",
      purpose: "The consumer fixture.",
      relation: { kind: "consumer", contractVersion: "uifa-board-v1" },
      capabilityRows: [],
    },
  ],
};
const receipt = (sibling, coreCommit, date) => ({
  sibling,
  coreCommit,
  manifestHash: `sha256:${sha256(`manifest ${date}`)}`,
  buildHash: `fnv1a64:${sha256(`build ${date}`).slice(0, 16)}`,
  date,
});
const fileNameOf = (date) => `${date.replace(/[:.]/g, "-")}.json`;
const receiptPath = ({ sibling, date }) =>
  `${receiptsRoot}/${sibling}/${fileNameOf(date)}`;
const writeReceipt = (value, path = receiptPath(value)) => {
  write(path, json(value));
  return path;
};
const asRoot = typeof process.getuid === "function" && process.getuid() === 0;

// A synthetic closed order's control segment: the six events the lifecycle
// records from activation to a passing final review, with placeholder hashes.
const closedOrderSegment = (id) => {
  const checkpoint = (ordinal) => ({
    checkpointSha: "1".repeat(40),
    checkpointRef: `refs/dotln/checkpoint/${id}/${ordinal}`,
  });
  const gate = (checkId, recordedAt) => ({
    checkId,
    treeHash: "3".repeat(40),
    codeIdentity: "4".repeat(64),
    durationMs: 1000,
    evidenceRef: `host-gate:${"4".repeat(64)}:${checkId}`,
    recordedAt,
    executed: true,
    exitCode: 0,
  });
  const actor = {
    harness: "claude-code",
    harnessVersion: "2.1.296",
    model: "claude-opus-5-5",
    effort: "xhigh",
    source: "claude-session-readback",
  };
  const events = [
    {
      type: "WorkOrderActivated",
      recordedAt: "2026-10-10T04:07:46.042Z",
      workOrderPath: `docs/work-orders/${id}-fixture.md`,
      effortDeclarationValidated: true,
      ...checkpoint(1),
    },
    {
      type: "ImplementationReady",
      recordedAt: "2026-10-10T04:57:53.308Z",
      evidence: {
        treeHash: "3".repeat(40),
        material: [],
        productGate: gate("npm test", "2026-10-10T04:53:33.024Z"),
        documentGate: gate("npm run test:docs", "2026-10-10T04:57:52.123Z"),
      },
      unmetCriteria: [],
      actor,
      ...checkpoint(2),
    },
    {
      type: "VerificationRequested",
      recordedAt: "2026-10-10T13:19:41.199Z",
      verificationId: "VER-001",
      reportPath: `docs/verifications/${id}/VER-001.md`,
      costLine: "required",
      ...checkpoint(3),
    },
    {
      type: "VerificationCompleted",
      recordedAt: "2026-10-10T13:35:28.457Z",
      evidence: {
        treeHash: "3".repeat(40),
        productGate: gate("npm test", "2026-10-10T04:53:33.024Z"),
        documentGate: gate("npm run test:docs", "2026-10-10T13:35:26.728Z"),
      },
      verificationId: "VER-001",
      reportPath: `docs/verifications/${id}/VER-001.md`,
      reportHash: `sha256:${"2".repeat(64)}`,
      verdict: "pass",
      actor,
      ...checkpoint(4),
    },
    {
      type: "FinalReviewRequested",
      recordedAt: "2026-10-10T13:36:38.235Z",
      throughVerificationId: "VER-001",
      finalReviewId: "FINAL-001",
      reportPath: `docs/final-reviews/${id}/FINAL-001.md`,
      costLine: "required",
      ...checkpoint(5),
    },
    {
      type: "FinalReviewCompleted",
      recordedAt: "2026-10-10T13:58:22.291Z",
      findingCounts: {
        escape: 0,
        integration: 0,
        "new-scope": 0,
        unclassed: 0,
      },
      evidence: {
        treeHash: "3".repeat(40),
        productGate: gate("npm test", "2026-10-10T13:49:21.185Z"),
      },
      finalReviewId: "FINAL-001",
      reportPath: `docs/final-reviews/${id}/FINAL-001.md`,
      reportHash: `sha256:${"2".repeat(64)}`,
      verdict: "pass",
      actor,
      ...checkpoint(6),
    },
  ];
  return `${events
    .map((event) =>
      JSON.stringify({ schemaVersion: 1, workOrderId: id, ...event }),
    )
    .join("\n")}\n`;
};

mkdirSync(launchpad);
git(["init", "-q", "-b", "main"]);
git(["config", "maintenance.auto", "false"]);
git(["config", "user.name", "DotLn Fixture"]);
git(["config", "user.email", "fixture@example.invalid"]);
write(declarationPath, json(declaration));
write("README.md", "fixture launchpad\n");
git(["add", "."]);
git(["commit", "-qm", "declaration"]);
const first = git(["rev-parse", "HEAD"]);
git(["tag", "-a", "v1.0.0", "-m", "first"]);
// The closed order's segment lands between the two commits the baseline
// receipts name.
write("docs/control/orders/WO-901.jsonl", closedOrderSegment("WO-901"));
git(["add", "."]);
git(["commit", "-qm", "an order closes"]);
const second = git(["rev-parse", "HEAD"]);
const unknown = "f".repeat(40);
// Two receipts of the starter, one per commit; every case starts from them.
const baseline = [
  receipt("starter-fixture", first, "2026-10-11T01:00:00.000Z"),
  receipt("starter-fixture", second, "2026-10-11T02:00:00.000Z"),
];
const resetBaseline = ({
  receipts = baseline,
  declared = declaration,
} = {}) => {
  write(declarationPath, json(declared));
  rmSync(join(launchpad, receiptsRoot), { recursive: true, force: true });
  for (const value of receipts) writeReceipt(value);
  ok(run(["index"]), "baseline index");
  ok(run(["index", "--check"]), "baseline check");
  return registry();
};

test.after(() => rmSync(scratch, { recursive: true, force: true }));

test("sibling registry", async (t) => {
  await t.test(
    "WO-078 criterion 2: before any receipt, every field a receipt supplies reads not evidenced",
    () => {
      write(declarationPath, json(declaration));
      const started = performance.now();
      const generated = ok(run(["index"]), "index");
      const elapsed = performance.now() - started;
      assert.equal(generated.stdout, `Generated ${registryPath}\n`);
      for (const id of ["starter-fixture", "consumer-fixture"]) {
        for (const field of [
          "Kit version",
          "Core commit",
          "Manifest hash",
          "Build hash",
          "Last receipt",
          "Orders in core that advanced it",
        ])
          assert.equal(line(id, field), "not evidenced", `${id} ${field}`);
        assert.doesNotMatch(section(id), /### Receipts/);
      }
      assert.equal(
        line("starter-fixture", "Upstream relation"),
        "an export of core; its commit is not evidenced (no receipt yet)",
      );
      assert.equal(
        line("starter-fixture", "Capability rows"),
        "`launchpad.starter`",
      );
      assert.equal(
        line("consumer-fixture", "Upstream relation"),
        "a consumer of contract version `uifa-board-v1`",
      );
      assert.equal(
        line("consumer-fixture", "Capability rows"),
        "none declared",
      );
      assert.match(
        registry(),
        /generated by `node scripts\/siblings\.mjs index`/,
      );
      assert.match(registry(), /^<!-- dotln-sibling-tags:\{\} -->$/m);
      const check = ok(run(["index", "--check"]), "check");
      assert.equal(check.stdout, `PASS ${registryPath} is current\n`);
      const bytes = registry();
      assert.equal(ok(run(["index"]), "index again").stdout, "");
      assert.equal(registry(), bytes, "an unchanged registry is not rewritten");
      t.diagnostic(
        `generator wall-clock ${Math.round(elapsed)} ms (process start to exit); registry ${Buffer.byteLength(bytes)} bytes`,
      );
    },
  );

  await t.test(
    "WO-078 criterion 1: the entry carries the latest receipt's fields, the kit version from Git and the orders closed between receipts",
    () => {
      const [r1, r2] = baseline;
      rmSync(join(launchpad, receiptsRoot), { recursive: true, force: true });
      for (const value of baseline) writeReceipt(value);
      const started = performance.now();
      ok(run(["index"]), "index with receipts");
      const elapsed = performance.now() - started;
      const id = "starter-fixture";
      assert.equal(
        line(id, "Upstream relation"),
        `an export of core at commit \`${first}\` (the earliest receipt's)`,
      );
      assert.equal(
        line(id, "Kit version"),
        "none at the commit (nearest below: `v1.0.0`)",
      );
      assert.equal(line(id, "Core commit"), `\`${second}\``);
      assert.equal(line(id, "Manifest hash"), `\`${r2.manifestHash}\``);
      assert.equal(line(id, "Build hash"), `\`${r2.buildHash}\``);
      assert.equal(
        line(id, "Last receipt"),
        `${r2.date} ([${fileNameOf(r2.date)}](../evidence/siblings/${id}/${fileNameOf(r2.date)}))`,
      );
      assert.equal(line(id, "Orders in core that advanced it"), "`WO-901`");
      const rows = tableRows(id);
      assert.equal(rows.length, 2);
      assert.equal(
        rows[0],
        `| ${r1.date} | \`${first.slice(0, 12)}\` | \`v1.0.0\` | \`${r1.manifestHash}\` | \`${r1.buildHash}\` | first receipt | [${fileNameOf(r1.date)}](../evidence/siblings/${id}/${fileNameOf(r1.date)}) |`,
      );
      assert.equal(
        rows[1],
        `| ${r2.date} | \`${second.slice(0, 12)}\` | none at the commit (nearest below: \`v1.0.0\`) | \`${r2.manifestHash}\` | \`${r2.buildHash}\` | \`WO-901\` | [${fileNameOf(r2.date)}](../evidence/siblings/${id}/${fileNameOf(r2.date)}) |`,
      );
      const record = JSON.parse(
        /^<!-- dotln-sibling-tags:(\{.*\}) -->$/m.exec(registry())[1],
      );
      assert.deepEqual(record, {
        [first]: { tag: "v1.0.0", nearest: "v1.0.0" },
        [second]: { tag: null, nearest: "v1.0.0" },
      });
      ok(run(["index", "--check"]), "check with receipts");
      t.diagnostic(
        `generator wall-clock ${Math.round(elapsed)} ms with two receipts; registry ${Buffer.byteLength(registry())} bytes`,
      );
    },
  );

  await t.test(
    "a declared origin anchors the first receipt, and a commit this repository lacks reads not evidenced where Git would speak",
    () => {
      const anchored = structuredClone(declaration);
      anchored.siblings[0].relation.coreCommit = first;
      resetBaseline({
        declared: anchored,
        receipts: [
          receipt("starter-fixture", second, "2026-10-11T03:00:00.000Z"),
          receipt("consumer-fixture", unknown, "2026-10-11T04:00:00.000Z"),
        ],
      });
      assert.equal(
        line("starter-fixture", "Upstream relation"),
        `an export of core at commit \`${first}\``,
      );
      assert.equal(
        line("starter-fixture", "Orders in core that advanced it"),
        "`WO-901`",
      );
      assert.match(tableRows("starter-fixture")[0], /\| `WO-901` \| \[/);
      assert.equal(
        line("consumer-fixture", "Kit version"),
        "not evidenced (the commit is not in this repository)",
      );
      assert.equal(line("consumer-fixture", "Core commit"), `\`${unknown}\``);
      assert.equal(
        line("consumer-fixture", "Orders in core that advanced it"),
        "none yet (one receipt and no declared origin commit)",
      );
      // Two receipts at commits this repository lacks: the summary says so
      // instead of claiming that nothing closed between them.
      resetBaseline({
        receipts: [
          receipt("consumer-fixture", unknown, "2026-10-11T04:00:00.000Z"),
          receipt("consumer-fixture", unknown, "2026-10-11T05:00:00.000Z"),
        ],
      });
      assert.equal(
        line("consumer-fixture", "Orders in core that advanced it"),
        "not evidenced (a commit is not in this repository)",
      );
      assert.match(
        tableRows("consumer-fixture")[1],
        /\| not evidenced \(a commit is not in this repository\) \| \[/,
      );
      // One known pair and one unknown: the found orders, then the gap.
      resetBaseline({
        receipts: [
          ...baseline,
          receipt("starter-fixture", unknown, "2026-10-11T06:00:00.000Z"),
        ],
      });
      assert.equal(
        line("starter-fixture", "Orders in core that advanced it"),
        "`WO-901`; the rest not evidenced (a commit is not in this repository)",
      );
      assert.equal(
        line("starter-fixture", "Kit version"),
        "not evidenced (the commit is not in this repository)",
      );
    },
  );

  await t.test(
    "the receipt resolves its sibling from the destination's repository name or directory name without case",
    () => {
      resetBaseline();
      assert.deepEqual(
        resolveReceipt(launchpad, "/elsewhere/Starter-Fixture"),
        {
          sibling: "starter-fixture",
          reason: null,
        },
      );
      assert.deepEqual(
        resolveReceipt(launchpad, "/elsewhere/starter-fixture-wo012", {
          names: ["STARTER-FIXTURE"],
        }),
        { sibling: "starter-fixture", reason: null },
      );
      assert.deepEqual(
        resolveReceipt(launchpad, "/elsewhere/starter-fixture-wo012", {
          names: ["other-repository"],
        }),
        {
          sibling: null,
          reason:
            "other-repository and starter-fixture-wo012 are not declared in docs/siblings/siblings.json",
        },
      );
      rmSync(join(launchpad, declarationPath));
      try {
        assert.deepEqual(
          resolveReceipt(launchpad, "/elsewhere/starter-fixture"),
          {
            sibling: null,
            reason: "no sibling declaration at docs/siblings/siblings.json",
          },
        );
      } finally {
        write(declarationPath, json(declaration));
      }
    },
  );

  await t.test(
    "refuses a hand-edited entry, naming the first differing line",
    () => {
      const current = resetBaseline();
      const lines = current.split("\n");
      const edited = lines.findIndex((row) =>
        row.startsWith("- **Purpose:** The exported launchpad fixture."),
      );
      assert.ok(edited >= 0);
      lines[edited] = "- **Purpose:** A hand-written purpose.";
      write(registryPath, lines.join("\n"));
      const check = run(["index", "--check"]);
      assert.equal(check.status, 1, check.stdout);
      assert.equal(
        check.stderr,
        `error: ${registryPath} is stale at line ${edited + 1}; run node scripts/siblings.mjs index\n`,
      );
      assert.equal(registry(), lines.join("\n"), "the check writes nothing");
      const regenerated = ok(run(["index"]), "regenerate");
      assert.equal(regenerated.stdout, `Generated ${registryPath}\n`);
      assert.equal(registry(), current);
      rmSync(join(launchpad, registryPath));
      const missing = run(["index", "--check"]);
      assert.equal(missing.status, 1);
      assert.match(
        missing.stderr,
        /README\.md is stale at line 1; run node scripts\/siblings\.mjs index/,
      );
      ok(run(["index"]), "regenerate after removal");
      assert.equal(registry(), current);
    },
  );

  await t.test(
    "refuses a forged visible version and embedded record without trusting either copy on the page",
    () => {
      const current = resetBaseline({ receipts: [baseline[0]] });
      const captured = observations();
      const inputs = [declarationPath, receiptPath(baseline[0])].map((path) => [
        path,
        readFileSync(join(launchpad, path), "utf8"),
      ]);
      const forged = current.replaceAll("v1.0.0", "v9.8.7-forged");
      assert.notEqual(forged, current);
      write(registryPath, forged);
      const check = run(["index", "--check"]);
      assert.equal(check.status, 1, check.stdout);
      assert.match(check.stderr, /README\.md is stale at line \d+; run/);
      assert.equal(registry(), forged, "a check must not repair its subject");
      assert.equal(observations(), captured);
      for (const [path, source] of inputs)
        assert.equal(readFileSync(join(launchpad, path), "utf8"), source);
      assert.equal(git(["tag", "--points-at", first]), "v1.0.0");

      // A page-only substitution must still differ from the captured version
      // even when Git holds the newer tag at the same commit.
      write(registryPath, current);
      git(["tag", "-a", "v1.1.0", first, "-m", "later tag at the same commit"]);
      try {
        const later = ok(
          run(["index", "--check"]),
          "unedited page after a later tag",
        );
        assert.match(later.stdout, /NEWER tag evidence/);
        assert.equal(registry(), current);
        assert.equal(observations(), captured);
        const substituted = current.replaceAll("v1.0.0", "v1.1.0");
        write(registryPath, substituted);
        const edited = run(["index", "--check"]);
        assert.equal(edited.status, 1, edited.stdout);
        assert.match(edited.stderr, /README\.md is stale at line \d+; run/);
        assert.equal(registry(), substituted);
        assert.equal(observations(), captured);
      } finally {
        git(["tag", "-d", "v1.1.0"]);
      }
      ok(run(["index"]), "regenerate the authentic version");
      assert.equal(registry(), current);
    },
  );

  await t.test(
    "refuses a coordinated invented version in the page and captured observations without a write",
    () => {
      const current = resetBaseline({ receipts: [baseline[0]] });
      const captured = observations();
      const inputs = [declarationPath, receiptPath(baseline[0])].map((path) => [
        path,
        readFileSync(join(launchpad, path), "utf8"),
      ]);
      const forged = current.replaceAll("v1.0.0", "v9.8.7-forged");
      const forgedObservations = captured.replaceAll("v1.0.0", "v9.8.7-forged");
      write(registryPath, forged);
      write(observationsPath, forgedObservations);
      const check = run(["index", "--check"]);
      assert.equal(check.status, 1, check.stdout);
      assert.equal(check.stdout, "");
      assert.match(check.stderr, /records tag "v9\.8\.7-forged"/);
      assert.match(check.stderr, /not a Git tag at its receipt commit/);
      assert.ok(check.stderr.includes(observationsPath), check.stderr);
      assert.equal(registry(), forged, "the check writes neither output");
      assert.equal(observations(), forgedObservations);
      for (const [path, source] of inputs)
        assert.equal(readFileSync(join(launchpad, path), "utf8"), source);
      assert.equal(git(["tag", "--points-at", first]), "v1.0.0");
      ok(run(["index"]), "regenerate the authentic pair");
      assert.equal(registry(), current);
      assert.equal(observations(), captured);
      ok(run(["index", "--check"]), "check the regenerated pair");
    },
  );

  await t.test(
    "an exact tag must point at its receipt commit and a nearest tag must be an ancestor",
    () => {
      git(["tag", "v2.0.0", second]);
      let lightweightPresent = true;
      const future = git([
        "commit-tree",
        `${second}^{tree}`,
        "-p",
        second,
        "-m",
        "a commit after both receipts",
      ]);
      git(["tag", "-a", "v3.0.0", future, "-m", "a future tag"]);
      try {
        resetBaseline({ receipts: [baseline[1]] });
        assert.equal(line("starter-fixture", "Kit version"), "`v2.0.0`");

        const current = resetBaseline({ receipts: [baseline[0]] });
        const captured = observations();
        const forged = current.replaceAll("v1.0.0", "v2.0.0");
        const forgedObservations = captured.replaceAll("v1.0.0", "v2.0.0");
        write(registryPath, forged);
        write(observationsPath, forgedObservations);
        const wrongCommit = run(["index", "--check"]);
        assert.equal(wrongCommit.status, 1, wrongCommit.stdout);
        assert.match(wrongCommit.stderr, /records tag "v2\.0\.0"/);
        assert.match(wrongCommit.stderr, /not a Git tag at its receipt commit/);
        assert.equal(registry(), forged);
        assert.equal(observations(), forgedObservations);

        git(["tag", "-d", "v2.0.0"]);
        lightweightPresent = false;
        const nearestPage = resetBaseline({ receipts: [baseline[1]] });
        const nearestObservations = observations();
        for (const tag of ["v3.0.0", "v9.8.7-forged", "v1.0.0^{commit}"]) {
          const page = nearestPage.replaceAll("v1.0.0", tag);
          const observed = nearestObservations.replaceAll("v1.0.0", tag);
          write(registryPath, page);
          write(observationsPath, observed);
          const invalidNearest = run(["index", "--check"]);
          assert.equal(
            invalidNearest.status,
            1,
            `${tag}: ${invalidNearest.stdout}`,
          );
          assert.ok(
            invalidNearest.stderr.includes(
              `records nearest ${JSON.stringify(tag)}`,
            ),
          );
          assert.match(
            invalidNearest.stderr,
            /not a Git tag at or below its receipt commit/,
          );
          assert.equal(registry(), page);
          assert.equal(observations(), observed);
        }
        ok(run(["index"]), "repair the nearest observations");
        assert.equal(registry(), nearestPage);
        assert.equal(observations(), nearestObservations);
      } finally {
        if (lightweightPresent) git(["tag", "-d", "v2.0.0"]);
        git(["tag", "-d", "v3.0.0"]);
      }
      resetBaseline();
    },
  );

  await t.test(
    "missing or malformed captured observations refuse without a write and generation repairs them",
    () => {
      const current = resetBaseline();
      const captured = observations();
      const incomplete = JSON.parse(captured);
      delete incomplete.commits[first];
      for (const source of [
        null,
        "{ not json",
        json({ schemaVersion: 2, commits: {} }),
        json({ schemaVersion: 1, commits: [] }),
        json({
          schemaVersion: 1,
          commits: { [first]: { tag: 42, nearest: null } },
        }),
        json(incomplete),
      ]) {
        if (source === null) rmSync(join(launchpad, observationsPath));
        else write(observationsPath, source);
        const check = run(["index", "--check"]);
        assert.equal(check.status, 1, check.stdout);
        assert.ok(check.stderr.includes(observationsPath), check.stderr);
        assert.equal(registry(), current);
        if (source === null)
          assert.equal(existsSync(join(launchpad, observationsPath)), false);
        else assert.equal(observations(), source);
        ok(run(["index"]), "repair the captured observations");
        assert.equal(observations(), captured);
        ok(run(["index", "--check"]), "check the repaired pair");
      }
      // A pre-existing temporary for either output prevents both replacements.
      write(registryPath, current.replaceAll("v1.0.0", "forged"));
      write(observationsPath, "{ not json");
      write(`${registryPath}.tmp`, "interrupted write\n");
      try {
        const interrupted = run(["index"]);
        assert.equal(interrupted.status, 1);
        assert.match(interrupted.stderr, /temporary already exists/);
        assert.equal(observations(), "{ not json");
        assert.equal(registry(), current.replaceAll("v1.0.0", "forged"));
      } finally {
        rmSync(join(launchpad, `${registryPath}.tmp`));
      }
      ok(run(["index"]), "retry the interrupted pair");
      assert.equal(registry(), current);
      assert.equal(observations(), captured);
    },
  );

  await t.test(
    "the captured observations follow the configured siblings root",
    () => {
      const current = resetBaseline();
      const relocated = join(scratch, "relocated");
      cpSync(launchpad, relocated, { recursive: true });
      cpSync(
        join(relocated, "docs/siblings"),
        join(relocated, "registry-store"),
        { recursive: true },
      );
      rmSync(join(relocated, "docs/siblings"), { recursive: true });
      writeFileSync(
        join(relocated, "dotln.config.json"),
        json({ version: 1, roots: { siblings: "registry-store" } }),
      );
      env.DOTLN_LAUNCHPAD = relocated;
      try {
        ok(run(["index"]), "relocated generation");
        ok(run(["index", "--check"]), "relocated check");
        const page = join(relocated, "registry-store/README.md");
        const original = readFileSync(page, "utf8");
        writeFileSync(page, original.replaceAll("v1.0.0", "v9.8.7-forged"));
        const check = run(["index", "--check"]);
        assert.equal(check.status, 1);
        assert.match(check.stderr, /registry-store\/README\.md is stale/);
        assert.equal(existsSync(join(relocated, "docs/siblings")), false);
        assert.equal(
          readFileSync(
            join(relocated, "registry-store/tag-observations.json"),
            "utf8",
          ),
          observations(),
        );
      } finally {
        env.DOTLN_LAUNCHPAD = launchpad;
        rmSync(relocated, { recursive: true, force: true });
      }
      assert.equal(registry(), current);
    },
  );

  await t.test(
    "refuses an entry whose manifest hash is not the latest receipt's, naming the receipt",
    () => {
      const current = resetBaseline();
      const latest = baseline[1];
      const newer = receipt(
        "starter-fixture",
        second,
        "2026-10-11T05:00:00.000Z",
      );
      const path = writeReceipt(newer);
      const check = run(["index", "--check"]);
      assert.equal(check.status, 1, check.stdout);
      assert.equal(
        check.stderr,
        `error: ${registryPath}: the starter-fixture entry records manifest hash \`${latest.manifestHash}\`, and its latest receipt ${path} records \`${newer.manifestHash}\`; run node scripts/siblings.mjs index\n`,
      );
      assert.equal(registry(), current, "the check writes nothing");
      ok(run(["index"]), "regenerate with the newer receipt");
      ok(run(["index", "--check"]), "check after regeneration");
      assert.equal(
        line("starter-fixture", "Manifest hash"),
        `\`${newer.manifestHash}\``,
      );
      // A hand edit of the hash line alone is named the same way, and an
      // entry whose hash line was removed is named by its line, not by the
      // next entry's hash.
      write(
        registryPath,
        registry().replace(newer.manifestHash, latest.manifestHash),
      );
      const again = run(["index", "--check"]);
      assert.equal(again.status, 1);
      assert.match(
        again.stderr,
        new RegExp(
          `records manifest hash \`${latest.manifestHash}\`, and its latest receipt ${path.replace(/[.]/g, "\\.")}`,
        ),
      );
      ok(run(["index"]), "regenerate");
      const withoutLine = registry()
        .split("\n")
        .filter(
          (row) => row !== `- **Manifest hash:** \`${newer.manifestHash}\``,
        )
        .join("\n");
      write(registryPath, withoutLine);
      const removed = run(["index", "--check"]);
      assert.equal(removed.status, 1);
      assert.match(removed.stderr, /README\.md is stale at line \d+; run/);
      assert.doesNotMatch(removed.stderr, /records manifest hash/);
    },
  );

  await t.test(
    "refuses a receipt it cannot decode or read, one misnamed or misplaced, or one no declaration names, and writes nothing",
    () => {
      const current = resetBaseline();
      const at = (date = "2026-10-11T09:00:00.000Z") =>
        `${receiptsRoot}/starter-fixture/${fileNameOf(date)}`;
      const cases = [
        [at(), "{ not json", /invalid JSON in/],
        [
          at(),
          json({
            sibling: "starter-fixture",
            coreCommit: second,
            date: "2026-10-11T09:00:00.000Z",
          }),
          /a receipt holds exactly sibling, coreCommit, manifestHash, buildHash, date/,
        ],
        [
          at(),
          json({
            ...receipt("starter-fixture", second, "2026-10-11T09:00:00.000Z"),
            buildHash: "sha256:nope",
          }),
          /buildHash is not in its declared shape/,
        ],
        [
          at(),
          json(receipt("consumer-fixture", second, "2026-10-11T09:00:00.000Z")),
          /names consumer-fixture, not its directory starter-fixture/,
        ],
        [
          at(),
          json(receipt("starter-fixture", second, "2026-10-11T09:30:00.000Z")),
          /is dated 2026-10-11T09:30:00\.000Z, which names 2026-10-11T09-30-00-000Z\.json/,
        ],
        [
          `${receiptsRoot}/undeclared-fixture/${fileNameOf("2026-10-11T09:00:00.000Z")}`,
          json(
            receipt("undeclared-fixture", second, "2026-10-11T09:00:00.000Z"),
          ),
          /undeclared-fixture: receipts for a sibling the declaration does not name/,
        ],
      ];
      for (const [path, text, pattern] of cases) {
        // A whole directory for an undeclared sibling is refused by the
        // directory; a receipt is refused by its file.
        const undeclared = path.includes("undeclared");
        const named = undeclared ? dirname(path) : path;
        write(path, text);
        try {
          for (const args of [["index"], ["index", "--check"]]) {
            const result = run(args);
            assert.equal(result.status, 1, `${path}: ${result.stdout}`);
            assert.match(result.stderr, pattern);
            assert.ok(result.stderr.includes(named), result.stderr);
          }
          assert.equal(registry(), current, `${path}: nothing written`);
        } finally {
          rmSync(join(launchpad, path), { force: true });
          if (undeclared)
            rmSync(join(launchpad, dirname(path)), {
              recursive: true,
              force: true,
            });
        }
      }
      if (!asRoot) {
        const path = writeReceipt(
          receipt("starter-fixture", second, "2026-10-11T09:00:00.000Z"),
        );
        chmodSync(join(launchpad, path), 0);
        try {
          const result = run(["index"]);
          assert.equal(result.status, 1);
          assert.match(result.stderr, /cannot read the receipt \(EACCES\)/);
          assert.ok(result.stderr.includes(path));
          assert.equal(registry(), current);
        } finally {
          chmodSync(join(launchpad, path), 0o644);
          rmSync(join(launchpad, path));
        }
      }
      ok(run(["index", "--check"]), "current once the receipts decode");
    },
  );

  await t.test(
    "a malformed declaration refuses by field and writes nothing",
    () => {
      const current = resetBaseline();
      const cases = [
        [{ ...declaration, extra: true }, /unknown declaration key "extra"/],
        [{ ...declaration, schemaVersion: 2 }, /schemaVersion must be 1/],
        [
          {
            ...declaration,
            siblings: [declaration.siblings[0], declaration.siblings[0]],
          },
          /siblings\[1\]\.id repeats starter-fixture/,
        ],
        [
          {
            ...declaration,
            siblings: [
              declaration.siblings[0],
              { ...declaration.siblings[0], id: "STARTER-FIXTURE" },
            ],
          },
          /siblings\[1\]\.id repeats STARTER-FIXTURE \(ids are compared without case/,
        ],
        [
          {
            ...declaration,
            siblings: [
              { ...declaration.siblings[0], relation: { kind: "fork" } },
            ],
          },
          /siblings\[0\]\.relation\.kind must be export or consumer/,
        ],
        [
          {
            ...declaration,
            siblings: [
              {
                ...declaration.siblings[0],
                relation: { kind: "export", coreCommit: "abc" },
              },
            ],
          },
          /relation\.coreCommit must be a commit hash, or null/,
        ],
        [
          {
            ...declaration,
            siblings: [
              {
                ...declaration.siblings[0],
                capabilityRows: ["Launchpad Starter"],
              },
            ],
          },
          /capabilityRows must list distinct capability row ids/,
        ],
      ];
      try {
        for (const [value, pattern] of cases) {
          write(declarationPath, json(value));
          const result = run(["index"]);
          assert.equal(result.status, 1, JSON.stringify(value));
          assert.match(result.stderr, pattern);
          assert.ok(result.stderr.includes(declarationPath));
          assert.equal(registry(), current);
        }
        rmSync(join(launchpad, declarationPath));
        const absent = run(["index"]);
        assert.equal(absent.status, 1);
        assert.match(absent.stderr, /siblings\.json: no sibling declaration/);
        // Without a declaration, a page that still exists is stale and the
        // check refuses; without either there is nothing to check.
        const orphan = run(["index", "--check"]);
        assert.equal(orphan.status, 1);
        assert.match(orphan.stderr, /siblings\.json: no sibling declaration/);
        rmSync(join(launchpad, registryPath));
        assert.equal(
          ok(run(["index", "--check"]), "nothing to check").stdout,
          "PASS docs/siblings/siblings.json declares no siblings; nothing to check\n",
        );
      } finally {
        write(declarationPath, json(declaration));
      }
      ok(run(["index"]), "regenerate after the declaration returns");
      ok(run(["index", "--check"]), "current again");
    },
  );

  await t.test(
    "a tag added after generation is newer evidence, not a stale page, until the next generation",
    () => {
      resetBaseline();
      git(["tag", "-a", "v1.1.0", "-m", "second"]);
      try {
        const check = ok(run(["index", "--check"]), "check after the tag");
        assert.equal(
          check.stdout,
          `NEWER tag evidence for ${second.slice(0, 12)}: v1.1.0; the page keeps its recorded observation; run node scripts/siblings.mjs index to refresh\nPASS ${registryPath} is current\n`,
        );
        assert.equal(
          line("starter-fixture", "Kit version"),
          "none at the commit (nearest below: `v1.0.0`)",
        );
        assert.equal(
          ok(run(["index"]), "refresh").stdout,
          `Generated ${registryPath}\n`,
        );
        assert.equal(line("starter-fixture", "Kit version"), "`v1.1.0`");
        assert.equal(
          ok(run(["index", "--check"]), "check after the refresh").stdout,
          `PASS ${registryPath} is current\n`,
        );
      } finally {
        git(["tag", "-d", "v1.1.0"]);
      }
      const beforeRemovalCheck = registry();
      const removedObservation = observations();
      const removedTag = run(["index", "--check"]);
      assert.equal(removedTag.status, 1, removedTag.stdout);
      assert.match(removedTag.stderr, /records tag "v1\.1\.0"/);
      assert.match(removedTag.stderr, /not a Git tag at its receipt commit/);
      assert.equal(registry(), beforeRemovalCheck);
      assert.equal(observations(), removedObservation);
      ok(run(["index"]), "refresh after the observed tag is removed");
      // The embedded record is only output; any edit still stales the page.
      write(
        registryPath,
        registry().replace(
          /^<!-- dotln-sibling-tags:.*$/m,
          "<!-- dotln-sibling-tags:nonsense -->",
        ),
      );
      const corrupt = run(["index", "--check"]);
      assert.equal(corrupt.status, 1);
      assert.match(corrupt.stderr, /README\.md is stale at line \d+; run/);
      ok(run(["index"]), "regenerate after the corrupt record");
      ok(run(["index", "--check"]), "current again");
    },
  );
});

test("pending receipts keep the registry unchanged and validate the complete lane", () => {
  resetBaseline();
  write(".gitignore", "docs/control/local/\n");
  const before = registry();
  assert.deepEqual(
    exportSiblings(declaration).map(({ id }) => id),
    ["starter-fixture"],
  );
  assert.deepEqual(exportSiblings(null), []);
  const fields = {
    sibling: "starter-fixture",
    coreCommit: second,
    manifestBytes: "pending kit",
    buildHash: "fnv1a64:1234567890abcdef",
    date: "2026-10-13T12:00:00.000Z",
  };
  const result = recordReceipt(launchpad, fields, { pending: true });
  assert.equal(
    result.path,
    pendingReceiptPath(launchpad, fields.sibling, fields.date),
  );
  assert.equal(registry(), before);
  assert.deepEqual(
    readPendingReceipts(launchpad, declaration).get(fields.sibling),
    [{ path: result.path, ...result.receipt }],
  );
  assert.equal(
    receiptRecorded(launchpad, fields.sibling, result.receipt.manifestHash),
    true,
  );
  assert.equal(
    receiptRecorded(launchpad, fields.sibling, baseline[0].manifestHash),
    true,
  );
  assert.equal(
    receiptRecorded(launchpad, fields.sibling, `sha256:${"0".repeat(64)}`),
    false,
  );
  assert.throws(
    () => recordReceipt(launchpad, fields, { pending: true }),
    /EEXIST/,
  );
  write(result.path, "{}\n");
  assert.throws(
    () => readPendingReceipts(launchpad, declaration),
    /sibling-receipts.*exactly/,
  );
  write(result.path, json(result.receipt));
  assert.throws(
    () => readPendingReceipts(launchpad, { siblings: [] }),
    /sibling the declaration does not name/,
  );
  rmSync(join(launchpad, result.path));
  assert.equal(readPendingReceipts(launchpad, { siblings: [] }).size, 0);
});

test("captured pending receipts survive registry failure and resume only their bound cohort", async () => {
  resetBaseline();
  write(".gitignore", "docs/control/local/\n");
  const { carryPendingReceipts, writeRegistry } =
    await import("./siblings.mjs");
  const target = join(scratch, "carry-target");
  rmSync(target, { recursive: true, force: true });
  git(["clone", "--quiet", launchpad, target]);
  mkdirSync(dirname(join(target, declarationPath)), { recursive: true });
  cpSync(join(launchpad, declarationPath), join(target, declarationPath));
  const fields = {
    sibling: "starter-fixture",
    coreCommit: second,
    manifestBytes: "captured kit",
    buildHash: "fnv1a64:1234567890abcdef",
    date: "2026-10-13T13:00:00.000Z",
  };
  const receipt = recordReceipt(launchpad, fields, { pending: true });
  const cohort = capturePendingReceipts(launchpad);
  const destination = join(
    target,
    carriedReceiptPath(target, fields.sibling, fields.date),
  );
  const source = join(launchpad, receipt.path);
  try {
    const before = readFileSync(source);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, "collision");
    assert.throws(
      () => carryPendingReceipts(launchpad, target, cohort),
      /collision/,
    );
    assert.deepEqual(readFileSync(source), before);
    rmSync(destination);
    const outside = join(scratch, "carry-outside");
    mkdirSync(outside, { recursive: true });
    const parent = dirname(destination);
    rmSync(parent, { recursive: true, force: true });
    symlinkSync(outside, parent);
    assert.throws(
      () => carryPendingReceipts(launchpad, target, cohort),
      /physical directory/,
    );
    assert.deepEqual(readdirSync(outside), []);
    rmSync(parent);
    mkdirSync(parent);
    const page = join(target, registryPath);
    rmSync(page, { force: true });
    mkdirSync(page, { recursive: true });
    assert.throws(
      () => carryPendingReceipts(launchpad, target, cohort),
      /contained regular file/,
    );
    assert.deepEqual(readFileSync(destination), before);
    assert.deepEqual(readFileSync(source), before);
    // A different successful start may have consumed this source. Recovery
    // still regenerates from its exact captured destination and leaves newer
    // receipts for the next worktree.
    rmSync(source);
    const newer = recordReceipt(
      launchpad,
      { ...fields, date: "2026-10-13T14:00:00.000Z" },
      { pending: true },
    );
    rmSync(page, { recursive: true });
    assert.deepEqual(carryPendingReceipts(launchpad, target, cohort), [
      carriedReceiptPath(target, fields.sibling, fields.date),
    ]);
    writeRegistry(target, { check: true });
    assert.ok(existsSync(join(launchpad, newer.path)));
    rmSync(destination);
    assert.throws(
      () => carryPendingReceipts(launchpad, target, cohort),
      /missing/,
    );
    const otherStart = join(scratch, "other-start-with-receipt");
    git(["worktree", "add", "--detach", otherStart, "HEAD"]);
    try {
      const carried = join(
        otherStart,
        carriedReceiptPath(otherStart, fields.sibling, fields.date),
      );
      mkdirSync(dirname(carried), { recursive: true });
      writeFileSync(carried, before);
      assert.deepEqual(carryPendingReceipts(launchpad, target, cohort), []);
    } finally {
      git(["worktree", "remove", "--force", otherStart]);
    }
    rmSync(join(launchpad, newer.path));
    const lane = dirname(source);
    rmSync(lane, { recursive: true });
    symlinkSync(outside, lane);
    assert.throws(
      () => recordReceipt(launchpad, fields, { pending: true }),
      /physical directory/,
    );
    assert.throws(() => capturePendingReceipts(launchpad), /receipt directory/);
    assert.deepEqual(readdirSync(outside), []);
    rmSync(lane);
  } finally {
    rmSync(target, { recursive: true, force: true });
    rmSync(dirname(source), { recursive: true, force: true });
  }
});
