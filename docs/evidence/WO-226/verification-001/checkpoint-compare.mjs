import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
const root = "/Users/dylanwood/Projects/DotLn-wo226";
const ref = "refs/dotln/checkpoint/WO-226/3";
const git = (args) =>
  execFileSync("git", ["-C", root, "--no-pager", ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
const rows = git(["ls-tree", "-r", "-z", ref])
  .split("\0")
  .filter(Boolean)
  .map((r) => {
    const m = /^(\d+) \w+ ([0-9a-f]+)\t([\s\S]+)$/.exec(r);
    return { mode: m[1], blob: m[2], path: m[3] };
  });
const changed = [],
  missing = [];
for (const row of rows) {
  if (row.mode === "160000" || row.mode === "120000") continue;
  if (!existsSync(`${root}/${row.path}`)) {
    missing.push(row.path);
    continue;
  }
  const here = git(["hash-object", "--", row.path]).trim();
  if (here !== row.blob) changed.push(row.path);
}
const inCheckpoint = new Set(rows.map((r) => r.path));
const working = git([
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
  "-z",
])
  .split("\0")
  .filter(Boolean);
const extra = working.filter((p) => !inCheckpoint.has(p));
console.log(
  JSON.stringify(
    { checkpointFiles: rows.length, changed, missing, extra },
    null,
    1,
  ),
);
