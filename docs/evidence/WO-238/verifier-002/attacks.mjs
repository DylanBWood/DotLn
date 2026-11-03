// Independent VER-002 probes. Run from the selected worktree root under
// node scripts/harness.mjs bounded -- node <this file>.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = realpathSync(process.cwd());
const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 32e6 });
assert.equal(git(root, "rev-parse", "--show-toplevel").trim(), root);
const load = (file) => import(pathToFileURL(join(root, file)).href);
const { documentReport } = await load("scripts/lib/document-kinds.mjs");
const { documentCensus } = await load("scripts/lib/document-census.mjs");
const { documentRows, documentsPage } = await load(
  "scripts/lib/plan-documents.mjs",
);
const { checkDocs, linkFailures } = await load("scripts/docs-check.mjs");
const { readMovedDocuments } = await load("scripts/lib/document-moves.mjs");
const { gateCodeIdentity, gateTreeHash } = await load(
  "packages/skeleton/src/gate-evidence.mjs",
);
const baseline = { schemaVersion: 1, products: {}, dispatches: {}, links: [] };
const outcomes = [];
const fixture = mkdtempSync(join(tmpdir(), "dotln-ver002-independent-"));
const write = (file, value) => {
  const target = join(fixture, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, value);
};
const json = (file, value) => write(file, `${JSON.stringify(value)}\n`);
try {
  git(fixture, "init", "-q");
  write(".gitignore", "docs/control/local/\n");
  json("dotln.config.json", { version: 1, roots: {} });
  write("docs/product/00-fixture.md", "# Product\n");
  json("docs/control/doc-baseline.json", baseline);
  const prior = "docs/planning/history-2030-01-01.md";
  const current = "docs/planning/passes/history-2030-01-01.md";
  write(current, "# History\n");
  json("docs/control/document-moves.json", {
    schemaVersion: 1,
    moves: [{ from: prior, to: current, workOrder: "WO-901" }],
  });
  const forms = [
    ["direct", "ENTRY.md", `[record](${current}#history)`],
    ["mapped", "ENTRY.md", `[record](${prior}#history)`],
    [
      "normalized",
      "ENTRY.md",
      `[record](./docs/planning/../planning/history-2030-01-01.md#history)`,
    ],
    [
      "encoded",
      "ENTRY.md",
      `[record](docs/planning/%68istory-2030-01-01.md#history)`,
    ],
    ["root-relative", "docs/entry.md", `[record](/${prior}#history)`],
    [
      "file-relative",
      "docs/entry.md",
      "[record](planning/history-2030-01-01.md#history)",
    ],
    [
      "reference",
      "ENTRY.md",
      `[record][ref]\n\n## Later\n\n[ref]: ${prior}#history`,
    ],
    ["quoted", "ENTRY.md", `Read \`${prior}\`.`],
  ];
  for (const [name, file, text] of forms) {
    json("docs/control/documents.json", {
      schemaVersion: 1,
      entryPoints: [{ id: "fixture", files: [file], heading: "Start here" }],
      kinds: [],
    });
    write(file, `# Entry\n\n## Start here\n\n${text}\n`);
    const report = documentReport(fixture);
    assert.deepEqual(
      report.recordsNamed.map((row) => row.path),
      [current],
      name,
    );
    assert.deepEqual(
      documentRows(fixture, { report, census: { documents: {} } })
        .filter((row) => row.kind === "record-named")
        .map((row) => row.path),
      [current],
      name,
    );
    assert.ok(
      checkDocs(fixture, { baseline }).failures.some((line) =>
        line.includes(`names the record ${current}`),
      ),
      name,
    );
    assert.deepEqual(linkFailures(fixture, [file]), [], name);
    outcomes.push({ probe: `record reference: ${name}`, result: "pass" });
  }

  // Ordinary colliding document names must not gain each other's program reader.
  write("ENTRY.md", "# Entry\n\n## Start here\n\nNo document is named.\n");
  for (const file of [
    "guide.md",
    "guide.md.json",
    "guide.md..json",
    "guide-extra.md",
  ])
    write(
      `docs/product/${file}`,
      file.endsWith(".json") ? "{}\n" : "# Guide\n",
    );
  write("docs/planning/guide.md", "# Guide\n");
  write(
    "scripts/reader.mjs",
    'export const input = "docs/product/guide.md..json";\n',
  );
  let report = documentReport(fixture);
  assert.equal(
    report.bindings.get("docs/product/guide.md..json").readByProgram,
    true,
  );
  for (const file of [
    "docs/product/guide.md",
    "docs/product/guide.md.json",
    "docs/product/guide-extra.md",
    "docs/planning/guide.md",
  ])
    assert.ok(report.unbound.includes(file), file);
  outcomes.push({
    probe: "whole-path and basename collisions",
    result: "pass",
  });

  const journal = (directory, id, rows) =>
    write(
      `${directory}/${id.repeat(64)}.jsonl`,
      rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    );
  const reading = (date, path, tool = "Read") => ({
    recordedAt: date,
    tool,
    reads: [{ path }],
  });
  const rows = [
    reading("2030-01-04T00:00:00Z", "docs/product/guide.md"),
    reading("2030-01-05T00:00:00Z", prior),
    reading("2030-01-06T00:00:00Z", current, "Edit"),
  ];
  journal("docs/control/local/harness", "a", rows);
  journal("docs/control/local/retained/WO-900/harness", "a", rows);
  journal("docs/control/local/retained/WO-900/harness", "b", [
    reading("2030-01-07T00:00:00Z", prior, "Write"),
  ]);
  journal("docs/control/local/harness", "c", [
    { recordedAt: "2030-01-08T00:00:00Z", source: "codex-dispatch-phrase" },
  ]);
  const readTags = () => [
    { name: "v0.3.0", createdAt: "2030-01-10T00:00:00Z" },
    { name: "v0.2.0", createdAt: "2030-01-05T00:00:00Z" },
    { name: "v0.1.0", createdAt: "2030-01-01T00:00:00Z" },
  ];
  const census = documentCensus(fixture, {
    releases: 1,
    readTags,
    write: false,
  });
  assert.deepEqual(census.documents, { [current]: 2 });
  assert.equal(census.journals.inWindow, 3);
  assert.equal(census.journals.unobserved, 1);
  assert.match(census.coverage.codex, /unobserved/);
  const unavailable = documentCensus(fixture, {
    releases: 1,
    readTags: () => {
      throw new Error("fixture tag read unavailable");
    },
    write: false,
  });
  assert.deepEqual(unavailable.documents, {});
  assert.ok(
    documentRows(fixture, { report, census: unavailable }).every(
      (row) => !["red-tag", "unread"].includes(row.kind),
    ),
  );
  outcomes.push({
    probe:
      "release boundary, retained duplicate, moved identity and unavailable window",
    result: "pass",
  });

  for (let i = 0; i < 150; i++)
    write(`docs/notes/page-${String(i).padStart(3, "0")}.md`, "# Note\n");
  report = documentReport(fixture);
  const expected = documentRows(fixture, { report, census });
  let page = documentsPage(fixture, { report, census });
  const observed = [];
  while (true) {
    assert.ok(Buffer.byteLength(JSON.stringify(page)) <= 8192);
    observed.push(...page.rows);
    if (!page.next) break;
    // Continuations must use the original page even if this later read changes the census.
    journal("docs/control/local/harness", "d", [
      reading("2030-01-11T00:00:00Z", "docs/notes/page-000.md"),
    ]);
    page = documentsPage(fixture, { cursor: page.next.split("--cursor ")[1] });
  }
  assert.deepEqual(observed, expected);
  const savedCwd = process.cwd();
  process.chdir(join(fixture, "docs"));
  try {
    assert.deepEqual(documentReport(fixture).unbound, report.unbound);
  } finally {
    process.chdir(savedCwd);
  }
  outcomes.push({
    probe: "stable pagination and nested working directory",
    result: "pass",
    rows: observed.length,
  });
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

const base = git(root, "rev-parse", "HEAD").trim();
const moves = readMovedDocuments(root);
for (const move of moves) {
  assert.equal(existsSync(join(root, move.from)), false, move.from);
  assert.equal(
    readFileSync(join(root, move.to), "utf8"),
    git(root, "show", `${base}:${move.from}`),
    move.to,
  );
}
const removed = git(
  root,
  "diff",
  "--no-renames",
  "--diff-filter=D",
  "--name-only",
  base,
  "--",
)
  .trim()
  .split("\n")
  .filter(Boolean);
assert.deepEqual(
  removed.filter((file) => !moves.some((move) => move.from === file)),
  ["docs/control/doc-ceilings.json"],
);
const external = (lock) =>
  Object.fromEntries(
    Object.entries(lock.packages).filter(
      ([file, entry]) => file.includes("node_modules/") && !entry.link,
    ),
  );
const locked = JSON.parse(
  readFileSync(join(root, "package-lock.json"), "utf8"),
);
assert.deepEqual(
  external(locked),
  external(JSON.parse(git(root, "show", `${base}:package-lock.json`))),
);
const oracle = JSON.parse(
  readFileSync(
    join(root, "packages/skeleton/fixtures/wo238-role-baseline.json"),
    "utf8",
  ),
);
const digest = (file) =>
  createHash("sha256")
    .update(readFileSync(join(root, file)))
    .digest("hex");
assert.equal(
  digest(`packages/skeleton/fixtures/${oracle.historicalBaseline}`),
  oracle.historicalSha256,
);
for (const [file, hash] of Object.entries(oracle.roles))
  assert.equal(digest(file), hash, file);
const before = JSON.parse(
  readFileSync(
    join(root, "docs/evidence/WO-238/cold-start-before.json"),
    "utf8",
  ),
);
const after = JSON.parse(
  readFileSync(
    join(root, "docs/evidence/WO-238/cold-start-after.json"),
    "utf8",
  ),
);
for (const profile of after.profiles) {
  assert.equal(
    readFileSync(join(root, "CLAUDE.md")).length +
      readFileSync(join(root, profile.path)).length,
    profile.bytes,
    profile.path,
  );
  const prior = before.profiles.find((row) => row.path === profile.path);
  assert.ok(prior, profile.path);
  assert.equal(
    Buffer.byteLength(git(root, "show", `${base}:CLAUDE.md`)) +
      Buffer.byteLength(git(root, "show", `${base}:${profile.path}`)),
    prior.bytes,
    profile.path,
  );
}
const identity = gateCodeIdentity(root);
const checks = JSON.parse(
  readFileSync(join(root, "docs/control/local/harness/checks.json"), "utf8"),
);
const complete = checks.findLast(
  (row) =>
    row.checkId === "npm test" &&
    row.codeIdentity === identity &&
    row.exitCode === 0 &&
    row.executed,
);
assert.ok(complete, "a passing complete row at the current code identity");
const selected = (args) =>
  execFileSync(
    process.execPath,
    ["scripts/test-runner.mjs", ...args, "--list", "--selected"],
    { cwd: root, encoding: "utf8", maxBuffer: 4e6 },
  )
    .trim()
    .split("\n")
    .map((line) => line.split(" — protects:")[0]);
const reviewSelection = selected(["--review"]);
const plainSelection = selected([]);
for (const name of new Set([...reviewSelection, ...plainSelection]))
  assert.ok(complete.requiredSuites.includes(name), name);
assert.ok(complete.cases.every((row) => row.exitCode === 0 && row.executed));
assert.equal(complete.identityUnchanged, true);
const report = documentReport(root);
const census = documentCensus(root, { write: false });
const summary = {
  observedAt: new Date().toISOString(),
  base,
  codeIdentity: identity,
  candidateTree: gateTreeHash(root),
  probes: outcomes,
  corpus: {
    kinds: report.counts,
    recordsNamed: report.recordsNamed,
    unboundCount: report.unbound.length,
    censusWindow: census.window,
    censusJournals: census.journals,
    censusDurationMs: census.durationMs,
    movedRecordsUnchanged: moves.length,
    otherRemovedPaths: ["docs/control/doc-ceilings.json"],
    unchangedExternalDependencies: Object.keys(external(locked)).length,
    roleHashesMatched: Object.keys(oracle.roles).length,
    coldStartMeasurementsMatched: after.profiles.length,
  },
  complete: {
    checkId: complete.checkId,
    recordedAt: complete.recordedAt,
    codeIdentity: complete.codeIdentity,
    treeHash: complete.treeHash,
    exitCode: complete.exitCode,
    requiredSuites: complete.requiredSuites.length,
    passedCases: complete.cases.length,
    gateSelection: complete.gateSelection,
    freshTasksRecorded: complete.freshSuites,
    reviewSelectionCovered: reviewSelection.length,
    plainSelectionCovered: plainSelection.length,
    durationMs: complete.durationMs,
    evidenceRef: complete.evidenceRef,
  },
};
console.log(JSON.stringify(summary, null, 2));
