#!/usr/bin/env node
// WO-276 Part B's measurements, taken on the tree the part ends on and
// written beside this file as measurements.json:
//
//   node docs/evidence/WO-276/part-b/measure.mjs
//
// The index check's and the document check's wall times (three runs each),
// the pattern-reader screen's own time and what it finds, the bytes the
// scripts tree gains over the order's base, and the heap a read of every
// committed order and decisions file holds with the parse cache's bound and
// with the bound taken away.
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../../../..");
const base = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const git = (...argv) =>
  execFileSync("git", ["-C", root, ...argv], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 1024,
  });
const seconds = (args) => {
  const runs = [];
  let status;
  for (let run = 0; run < 3; run++) {
    const started = process.hrtime.bigint();
    status = spawnSync(process.execPath, args, {
      cwd: root,
      stdio: "ignore",
    }).status;
    runs.push(Number((process.hrtime.bigint() - started) / 10_000_000n) / 100);
  }
  return {
    seconds: runs,
    exitCode: status,
    method: "wall seconds of three runs, one at a time",
  };
};

// The screen alone, in this process.
const { markdownScreen, screenedSources } = await import(
  pathToFileURL(join(root, "scripts/lib/markdown-screen.mjs")).href
);
const screenStarted = process.hrtime.bigint();
const sources = screenedSources(root);
const findings = markdownScreen(root, sources);
const screenSeconds =
  Number((process.hrtime.bigint() - screenStarted) / 10_000_000n) / 100;

// The scripts tree at the base and now, in bytes of tracked and untracked,
// non-ignored files.
const baseBytes = git("ls-tree", "-r", "-l", base, "--", "scripts")
  .split("\n")
  .filter(Boolean)
  .reduce((sum, line) => sum + Number(line.split(/\s+/u)[3]), 0);
const nowFiles = git(
  "ls-files",
  "-z",
  "--cached",
  "--others",
  "--exclude-standard",
  "--",
  "scripts",
)
  .split("\0")
  .filter(Boolean);
const size = (path) => {
  try {
    return statSync(join(root, path)).size;
  } catch {
    return 0;
  }
};
const nowBytes = nowFiles.reduce((sum, path) => sum + size(path), 0);
const carried = nowFiles
  .filter((path) => path.startsWith("scripts/lib/vendor/"))
  .map((path) => ({ path, bytes: size(path) }));

// The heap a read of every order and decisions file holds. Each run is a
// fresh process that reads every file through the work-order reader and the
// Markdown reader, forces a collection and reports the heap in use. The
// unbounded run loads a copy of the Markdown reader whose ceiling is
// Infinity, which is how the reader behaved before this part bounded it.
const scratch = mkdtempSync(join(tmpdir(), "dotln-part-b-heap-"));
process.on("exit", () => rmSync(scratch, { recursive: true, force: true }));
const documents = git(
  "ls-files",
  "-z",
  "--",
  "docs/work-orders",
  "docs/evidence",
)
  .split("\0")
  .filter(
    (path) =>
      /^docs\/work-orders\/WO-\d{3}-[^/]+\.md$/u.test(path) ||
      /^docs\/evidence\/WO-\d{3}\/decisions\.md$/u.test(path),
  );
const linksSource = readFileSync(
  join(root, "scripts/lib/markdown-links.mjs"),
  "utf8",
);
const unbounded = linksSource
  .replace(
    'from "./vendor/prettier-markdown.mjs"',
    `from ${JSON.stringify(pathToFileURL(join(root, "scripts/lib/vendor/prettier-markdown.mjs")).href)}`,
  )
  .replace(
    "export const PARSED_DOCUMENT_CEILING_BYTES = 8 * 1024 * 1024;",
    "export const PARSED_DOCUMENT_CEILING_BYTES = Infinity;",
  );
if (unbounded === linksSource || !unbounded.includes("= Infinity;"))
  throw new Error(
    "the Markdown reader's ceiling or import moved; update this script",
  );
writeFileSync(join(scratch, "markdown-links-unbounded.mjs"), unbounded);
const heapProbe = (module) => `
import { readFileSync } from "node:fs";
const links = await import(${JSON.stringify(module)});
const held = [];
let bytes = 0;
for (const path of ${JSON.stringify(documents)}) {
  const text = readFileSync(${JSON.stringify(root)} + "/" + path, "utf8");
  bytes += Buffer.byteLength(text);
  links.parseMarkdown(text);
  held.push(links.markdownHeadings(text).length);
}
globalThis.gc();
console.log(JSON.stringify({ documents: held.length, sourceBytes: bytes, parses: links.markdownParseCount(), heapUsedBytes: process.memoryUsage().heapUsed }));
`;
const heap = (module) =>
  JSON.parse(
    execFileSync(
      process.execPath,
      ["--expose-gc", "--input-type=module", "-e", heapProbe(module)],
      {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      },
    ),
  );

const result = {
  schemaVersion: 1,
  observedAt: new Date().toISOString(),
  tree: `the working tree of Part B at its end, on ${git("rev-parse", "HEAD").trim()}`,
  timings: {
    "npm run work-orders -- index --check": seconds([
      "scripts/work-orders.mjs",
      "index",
      "--check",
    ]),
    "node scripts/docs-check.mjs": seconds(["scripts/docs-check.mjs"]),
  },
  screen: {
    sources: sources.length,
    findings: findings.length,
    seconds: screenSeconds,
    method:
      "markdownScreen over every screened source, one batch, in this process",
  },
  scriptsTree: {
    base,
    baseBytes,
    bytes: nowBytes,
    gained: nowBytes - baseBytes,
    carried,
  },
  heap: {
    read: "every committed work order and decisions file, parsed whole and its headings read, then a forced collection",
    withTheBound: heap(
      pathToFileURL(join(root, "scripts/lib/markdown-links.mjs")).href,
    ),
    withoutTheBound: heap(
      pathToFileURL(join(scratch, "markdown-links-unbounded.mjs")).href,
    ),
  },
};
writeFileSync(
  join(here, "measurements.json"),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result, null, 2));
