#!/usr/bin/env node
// WO-276 Part B, criterion B8, added in the repair of FINAL-001 (its finding
// F7): a census of the readers that moved, made from the sources and not
// from a screen's forms.
//
//   node docs/evidence/WO-276/part-b/reader-census.mjs [--write]
//
// A screen finds a reader by the form of its pattern, and a reader written as
// a string test with a constant, a search for a heading's text or a line
// compared with a marker's string has no form a screen holds: the final
// review found six such readers moved with no comparison, and the screen run
// again with the marker-comment form found four more. This counts, in every
// source under scripts/ and packages/*/src/ that the order's base also held,
// the calls of the shared readers, at the base and now, and lists each
// source that calls one more often now, with whether comparisons/coverage.json
// holds a row for it. A source with no row fails the run, but for the shared
// module itself, which the markdown-links comparison holds whole. --write
// records the result beside this file as reader-census.json.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../../../..");
const base = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const git = (...argv) =>
  execFileSync("git", ["-C", root, ...argv], {
    encoding: "utf8",
    maxBuffer: 1 << 28,
    stdio: ["ignore", "pipe", "ignore"],
  });
// The functions the shared readers export, as their callers name them.
const READERS = [
  "markdownLinks",
  "markdownCodeSpans",
  "markdownSection",
  "markdownSections",
  "markdownHeadings",
  "markdownFields",
  "markdownComments",
  "markdownMarkerBlocks",
  "replaceMarkerBlocks",
  "markdownListItems",
  "markdownTables",
  "markdownCodeBlocks",
  "markdownJsonBlocks",
  "markdownNodes",
  "markdownText",
  "markdownLeadEnd",
  "withoutHtmlComments",
  "parseMarkdown",
  "readWorkOrder",
  "readWorkOrderHeader",
  "headerField",
  "readVision",
  "missionContract",
  "readShellCommand",
  "shellWords",
  "sourceTokens",
  "sourceComments",
  "sourceTrees",
];
const CALL = new RegExp(`\\b(${READERS.join("|")})\\(`, "gu");
const calls = (text) => {
  const counted = {};
  for (const [, name] of text.matchAll(CALL))
    counted[name] = (counted[name] ?? 0) + 1;
  return counted;
};
const SHARED = "scripts/lib/markdown-links.mjs";
const coverage = JSON.parse(
  readFileSync(join(here, "comparisons/coverage.json"), "utf8"),
);
const sources = git(
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
  "scripts",
  "packages",
)
  .split("\n")
  .filter(
    (path) =>
      /\.(?:mjs|cjs|js|ts)$/u.test(path) &&
      /^(?:scripts\/|packages\/[^/]+\/src\/)/u.test(path) &&
      !/^scripts\/test-|\.test\.|\/fixtures\/|\/vendor\/|\/dist\//u.test(
        path,
      ) &&
      existsSync(join(root, path)),
  );
const gained = [];
let held = 0;
for (const path of sources) {
  let before;
  try {
    before = git("show", `${base}:${path}`);
  } catch {
    continue; // A source the base did not hold moved no reader of the base's.
  }
  held++;
  const now = calls(readFileSync(join(root, path), "utf8"));
  const was = calls(before);
  const more = Object.entries(now)
    .filter(([name, count]) => count > (was[name] ?? 0))
    .map(([name, count]) => `${name} +${count - (was[name] ?? 0)}`);
  if (more.length)
    gained.push({
      file: path,
      calls: more,
      row:
        path === SHARED
          ? "the markdown-links comparison"
          : coverage.files[path]
            ? "comparisons/coverage.json"
            : null,
    });
}
const unheld = gained.filter((row) => !row.row);
const result = {
  schemaVersion: 1,
  observedAt: new Date().toISOString(),
  base,
  method:
    "every source under scripts/ and packages/*/src/ that the base also held, tests and fixtures aside: the calls of the shared readers it makes, counted at the base and in the worktree, and each source that makes one more often now, with the row that holds its readers",
  sourcesTheBaseHeld: held,
  gained,
  unheld: unheld.length,
};
if (process.argv.includes("--write"))
  writeFileSync(
    join(here, "reader-census.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
console.log(
  `reader census: ${held} sources the base held, ${gained.length} call a shared reader more often, ${unheld.length} with no row`,
);
for (const row of unheld)
  console.log(`NO ROW ${row.file}: ${row.calls.join(", ")}`);
if (unheld.length) process.exitCode = 1;
