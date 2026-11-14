// Final review of WO-276: which of the readers that moved onto the shared
// Markdown readers have no recorded comparison. For each reader the review
// found moved (three in its first reading and three in its reading of the
// files the first left unread), this prints whether the comparison map
// names the reader in a row for its file, whether the comparison driver
// calls it, and the shared reader the source now calls where the base
// tested a string or a pattern.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const root = process.cwd();
const comparisons = join(root, "docs/evidence/WO-276/part-b/comparisons");
const coverage = JSON.parse(
  readFileSync(join(comparisons, "coverage.json"), "utf8"),
);
const driver = readFileSync(join(comparisons, "readers.mjs"), "utf8");
const base = (path) =>
  execFileSync("git", ["show", `HEAD:${path}`], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
const moved = [
  {
    file: "scripts/lib/front-page-scope.mjs",
    reader: "the Front page field an order's header declares",
    driverName: "frontPageDeclaration",
    now: "readWorkOrderHeader(markdown).headerFields(",
    atBase: "line.startsWith(LABEL)",
  },
  {
    file: "scripts/lib/worktree-integration.mjs",
    reader: "the integration note a decisions file holds for a checkpoint",
    driverName: "integration ",
    now: "markdownComments(",
    atBase: "<!-- integration ${receipt.checkpointRef} -->",
  },
  {
    file: "scripts/lib/worktree-integration.mjs",
    reader:
      "the generated blocks of the root instruction file and the front page that a mixed projection sets aside",
    driverName: "mixedProjection",
    now: "replaceMarkerBlocks(",
    atBase: "dotln-harness",
  },
  {
    file: "scripts/lib/release-preparation.mjs",
    reader: "the integration note release preparation reads",
    driverName: "integrationPreparationRefusal",
    now: "markdownComments(",
    atBase: "<!-- integration ",
  },
  {
    file: "scripts/check-publication.mjs",
    reader: "the links a publication page makes into the product documents",
    driverName: "productLinks",
    now: "return markdownLinks(markdown).flatMap(",
    atBase: "const pattern = /\\]\\(\\.\\.\\/product\\/",
  },
  {
    file: "scripts/check-publication.mjs",
    reader: "the section of a dual-voice page under one voice's heading",
    driverName: "voiceSection",
    now: "markdownSection(markdown, title, { depths: [2] })",
    atBase: 'const next = markdown.indexOf("\\n## ", bodyStart);',
  },
  {
    file: "scripts/lib/plan-dependency-migration.mjs",
    reader:
      "the standalone dependencies block the dependency migration removes",
    driverName: "dotln-dependencies:start",
    now: "markdownMarkerBlocks(",
    atBase: "<!-- dotln-dependencies:start -->\\r?\\n[\\s\\S]*?",
  },
];
// The map keys its rows by file.
const rows = Object.entries(coverage.files).map(([file, row]) => ({
  file,
  ...row,
}));
const result = moved.map(({ file, reader, driverName, now, atBase }) => {
  const row = rows.find((entry) => entry.file === file);
  return {
    file,
    reader,
    sourceNowCallsTheSharedReader: readFileSync(
      join(root, file),
      "utf8",
    ).includes(now),
    baseTestedAString: base(file).includes(atBase),
    coverageRowForTheFile: Boolean(row),
    coverageRowsReaders: row ? row.readers.map((entry) => entry.reader) : [],
    comparisonDriverNamesIt: driver.includes(driverName),
  };
});
console.log(JSON.stringify(result, null, 2));
