import { tmpdir } from "node:os";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync, mkdtempSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";
const source = process.cwd(),
  mod = (p) => import(pathToFileURL(join(source, p)));
const { checkDocs, linkFailures } = await mod("scripts/docs-check.mjs");
const { documentReport, documentKinds, readerBindings, renderRedTagBlock } =
  await mod("scripts/lib/document-kinds.mjs");
const { documentRows } = await mod("scripts/lib/plan-documents.mjs");
const { documentCensus } = await mod("scripts/lib/document-census.mjs");
const scratch = process.env.DOTLN_PROBE_SCRATCH ?? tmpdir();
const root = mkdtempSync(join(scratch, "document-attacks-"));
const write = (p, s) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), s);
};
execFileSync("git", ["init", "-q", root]);
write("dotln.config.json", JSON.stringify({ version: 1 }));
write(".gitignore", "docs/control/local/\n");
write("docs/product/guide.md", "# Guide\n");
const baseline = { schemaVersion: 1, products: {}, dispatches: {}, links: [] };
write("docs/control/doc-baseline.json", JSON.stringify(baseline));
const before = "docs/planning/history-2030-01-01.md",
  after = "docs/planning/passes/history-2030-01-01.md";
write(after, "# History\n\nRecord text.\n");
write(
  "docs/control/document-moves.json",
  JSON.stringify({
    schemaVersion: 1,
    moves: [{ from: before, to: after, workOrder: "WO-238" }],
  }),
);
const entry = (p) =>
  `# Contract\n\n## Start here\n\nRead [history](${p}#history) and [guide](docs/product/guide.md).\n`;
write("CLAUDE.md", entry(after));
const direct = checkDocs(root, { baseline });
assert.equal(direct.documents.recordsNamed.length, 1);
assert.ok(direct.failures.some((x) => x.includes("names the record")));
write("CLAUDE.md", entry(before));
const mapped = checkDocs(root, { baseline });
const report = documentReport(root);
const mappedProbe = {
  supportedInput:
    "A Start here Markdown link to a record through its declared document-moves entry",
  direct: {
    recordNames: direct.documents.recordsNamed.length,
    failures: direct.failures,
  },
  mapped: {
    recordNames: mapped.documents.recordsNamed.length,
    planRecordRows: documentRows(root, {
      report,
      census: { documents: {} },
    }).filter((row) => row.kind === "record-named").length,
    failures: mapped.failures,
    linkFailures: linkFailures(root, ["CLAUDE.md"]),
  },
  expected:
    "The direct and mapped destinations name the same record; both must report the entry-point record.",
};
assert.equal(mapped.documents.recordsNamed.length, 0);
assert.deepEqual(mapped.failures, []);
assert.equal(mappedProbe.mapped.planRecordRows, 0);
assert.deepEqual(mappedProbe.mapped.linkFailures, []);
// The census preserves one count per session, rebases moved paths, includes
// retained sessions and excludes a repeated journal copy.
const journal = (lane, key, rows) =>
  write(
    `${lane}/${key.repeat(64)}.jsonl`,
    rows.map((r) => JSON.stringify(r)).join("\n") + "\n",
  );
const rows = [
  {
    at: "2030-01-02T00:00:00Z",
    tool: "Read",
    reads: [{ path: before }, { path: before }],
  },
  { at: "2030-01-02T00:01:00Z", tool: "Write", receipts: [{ path: before }] },
];
journal("docs/control/local/harness", "a", rows);
journal("docs/control/local/retained/WO-001/harness", "a", rows);
journal("docs/control/local/retained/WO-002/harness", "b", rows);
journal("docs/control/local/harness", "c", [
  {
    at: "2030-01-02T00:00:00Z",
    event: "UserPromptSubmit",
    source: "codex-dispatch-phrase",
  },
]);
const census = documentCensus(root, { write: false });
assert.equal(census.documents[after], 2);
assert.equal(census.documents[before], undefined);
assert.equal(census.journals.inWindow, 3);
assert.equal(census.journals.observed, 2);
assert.equal(census.journals.unobserved, 1);
const result = {
  mappedRecord: mappedProbe,
  census: {
    documents: census.documents,
    journals: census.journals,
    coverage: census.coverage.codex,
  },
};
console.log(JSON.stringify(result, null, 2));
