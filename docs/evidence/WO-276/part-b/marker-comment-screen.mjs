#!/usr/bin/env node
// WO-276 Part B, criterion B8, added in the repair of FINAL-001 (its finding
// F7): the inventory's screen with the form it lacked.
//
//   node docs/evidence/WO-276/part-b/marker-comment-screen.mjs [--write]
//
// inventory.json was taken at Part B's start, over the tree of recovery
// checkpoint 5, with the earlier worktree's screen, whose forms held no
// marker comment; three readers that tested for a marker comment moved onto
// the shared readers unseen. This runs the document check's own screen
// (scripts/lib/markdown-screen.mjs, which holds that form) over the same
// tree, keeps what it finds in the marker-comment form, and names for each
// finding the row of comparisons/coverage.json that holds its file's readers.
// A finding whose file has no row fails the run. --write records the result
// beside the inventory as inventory-marker-comments.json.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../../../..");
const inventory = JSON.parse(
  readFileSync(join(here, "inventory.json"), "utf8"),
);
const tree = /^refs\/dotln\/checkpoint\/WO-276\/5 \(([0-9a-f]{40})\)/u.exec(
  inventory.tree,
)?.[1];
if (!tree) throw new Error("inventory.json names no checkpoint commit");
const git = (directory, argv, options = {}) =>
  execFileSync("git", ["-C", directory, ...argv], {
    maxBuffer: 1024 * 1024 * 1024,
    ...options,
  });
// The inventory's tree, its sources only, as a repository of its own: the
// screen selects what Git lists there, as it does in a checkout.
const scratch = mkdtempSync(join(tmpdir(), "dotln-marker-comment-screen-"));
process.on("exit", () => rmSync(scratch, { recursive: true, force: true }));
execFileSync("tar", ["-x", "-C", scratch], {
  input: git(root, ["archive", tree, "scripts", "packages"]),
});
git(scratch, ["init", "-q"]);
git(scratch, ["add", "-A"]);
const { markdownScreen, screenedSources } = await import(
  pathToFileURL(join(root, "scripts/lib/markdown-screen.mjs")).href
);
const coverage = JSON.parse(
  readFileSync(join(here, "comparisons/coverage.json"), "utf8"),
);
const sources = screenedSources(scratch);
const findings = markdownScreen(scratch, sources)
  .filter((finding) => finding.form === "a marker comment")
  .map((finding) => ({
    ...finding,
    readers: (coverage.files[finding.file]?.readers ?? []).map((row) =>
      row.comparison ? `${row.reader} (${row.comparison})` : row.reader,
    ),
  }));
const unheld = findings.filter((finding) => !finding.readers.length);
const result = {
  schemaVersion: 1,
  observedAt: new Date().toISOString(),
  tree: inventory.tree,
  method:
    "the document check's screen, scripts/lib/markdown-screen.mjs as the repair of FINAL-001 leaves it, run over every source it selects in the inventory's tree, keeping the findings in its marker-comment form; each is listed with the readers comparisons/coverage.json records for its file",
  sources: sources.length,
  findings,
  unheld: unheld.length,
};
if (process.argv.includes("--write"))
  writeFileSync(
    join(here, "inventory-marker-comments.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
console.log(
  `marker-comment screen: ${sources.length} sources, ${findings.length} findings in ${new Set(findings.map((finding) => finding.file)).size} files, ${unheld.length} with no row`,
);
for (const finding of findings)
  console.log(
    `${finding.file}:${finding.line}: ${finding.readers.length ? finding.readers.join("; ") : "NO ROW"}`,
  );
if (unheld.length) process.exitCode = 1;
