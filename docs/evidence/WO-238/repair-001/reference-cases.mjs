// Runs each mapped-reference case on its own fixture against the scripts
// directory named by the first argument and prints which hold. Run it once
// against an extraction of the verified checkpoint and once against the
// repair (see README.md).
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const scripts = process.argv[2];
const load = (path) => import(pathToFileURL(join(scripts, path)).href);
const { checkDocs, linkFailures } = await load("docs-check.mjs");
const { documentReport, renderRedTagBlock } = await load(
  "lib/document-kinds.mjs",
);
const { documentRows } = await load("lib/plan-documents.mjs");
const { documentCensus } = await load("lib/document-census.mjs");

const record = "docs/planning/passes/history-2030-01-01.md";
const recordWas = "docs/planning/history-2030-01-01.md";
const guide = "docs/product/guide.md";
const guideWas = "docs/old/guide.md";
const baseline = { schemaVersion: 1, products: {}, dispatches: {}, links: [] };

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "f1-case-"));
  const write = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  execFileSync("git", ["init", "-q", root]);
  write("dotln.config.json", JSON.stringify({ version: 1, roots: {} }));
  write("docs/product/00-fixture.md", "# Product\n");
  write("docs/control/doc-baseline.json", JSON.stringify(baseline));
  write(
    "docs/control/document-moves.json",
    JSON.stringify({
      schemaVersion: 1,
      moves: [
        { from: recordWas, to: record, workOrder: "WO-001" },
        { from: guideWas, to: guide, workOrder: "WO-001" },
      ],
    }),
  );
  write(record, "# History\n\nRecord text.\n");
  write(guide, "# Guide\n\n[the sibling](sibling.md#sibling)\n");
  write("docs/old/sibling.md", "# Sibling\n");
  write("docs/README.md", "# Docs\n\n[the guide](old/guide.md#guide)\n");
  write(
    "CLAUDE.md",
    `# Contract\n\n## Start here\n\nRead [the docs](docs/README.md).\n\n## Elsewhere\n\n[h]: ${recordWas}\n`,
  );
  return { root, write };
}
const startHere = (f, body) =>
  f.write(
    "CLAUDE.md",
    `# Contract\n\n## Start here\n\n${body}\n\n## Elsewhere\n\n[h]: ${recordWas}\n`,
  );
const recordsNamed = (root) => {
  const report = documentReport(root);
  return {
    named: report.recordsNamed.map((row) => row.path),
    planned: documentRows(root, { report, census: { documents: {} } })
      .filter((row) => row.kind === "record-named")
      .map((row) => row.path),
    failed: checkDocs(root, { baseline }).failures.some((line) =>
      line.includes("names the record"),
    ),
  };
};
const named = (seen) =>
  seen.named.includes(record) && seen.planned.includes(record) && seen.failed;

const cases = {
  "direct Start here link (the report's control)": (f) => {
    startHere(f, `Read [history](${record}#history).`);
    return named(recordsNamed(f.root));
  },
  "mapped Start here link (the report's case)": (f) => {
    startHere(f, `Read [history](${recordWas}#history).`);
    return named(recordsNamed(f.root));
  },
  "mapped reference definition under another heading": (f) => {
    startHere(f, "Read [history][h].");
    return named(recordsNamed(f.root));
  },
  "mapped path quoted on a role Read line": (f) => {
    f.write(".claude/skills/fixture/SKILL.md", `Read: \`${recordWas}\`\n`);
    return named(recordsNamed(f.root));
  },
  "moved standing page bound through its old path": (f) =>
    documentReport(f.root).bindings.get(guide).bound === true &&
    linkFailures(f.root, ["docs/README.md"]).length === 0,
  "moved page's link read from the directory it was written in": (f) =>
    documentReport(f.root).bindings.get("docs/old/sibling.md").bound === true &&
    linkFailures(f.root, [guide]).length === 0,
  "red tag raised at the old path, disposed at the new one": (f) => {
    const first = "docs/planning/passes/first-2030-01-02.md";
    const second = "docs/planning/passes/second-2030-01-09.md";
    f.write(
      first,
      `# First\n\n${renderRedTagBlock({ tags: [{ path: guideWas, since: first }] })}`,
    );
    f.write(
      second,
      `# Second\n\n${renderRedTagBlock({ after: first, tags: [{ path: guide, since: first, disposition: "kept" }] })}`,
    );
    const report = documentReport(f.root);
    return report.openRedTags.length === 0 && report.staleRedTags.length === 0;
  },
  "a moved path is never reused, and a read of it stays with the moved page": (
    f,
  ) => {
    f.write(
      `docs/control/local/harness/${"a".repeat(64)}.jsonl`,
      `${JSON.stringify({ at: "2030-01-10T00:00:00Z", tool: "Read", reads: [{ path: guideWas }] })}\n`,
    );
    const before = documentCensus(f.root, { write: false }).documents;
    f.write(guideWas, "# A new page at the old path\n");
    const refused = checkDocs(f.root, { baseline }).failures.some((line) =>
      line.includes("a moved path is never reused"),
    );
    const after = documentCensus(f.root, { write: false }).documents;
    return (
      before[guide] === 1 &&
      refused &&
      after[guide] === 1 &&
      after[guideWas] === undefined
    );
  },
};
const results = {};
for (const [name, run] of Object.entries(cases)) {
  const f = fixture();
  try {
    results[name] = run(f) ? "holds" : "fails";
  } catch (error) {
    results[name] = `throws: ${error.message.split("\n")[0]}`;
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
}
console.log(JSON.stringify({ scripts, results }, null, 2));
