import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const root = process.argv[2];
const git = (...a) =>
  execFileSync("git", ["-C", root, ...a], { encoding: "utf8" });
const changed = git(
  "diff",
  "--name-only",
  "HEAD",
  "--",
  ".claude",
  ".agents",
  ".codex",
  "CLAUDE.md",
)
  .trim()
  .split("\n")
  .filter(Boolean);
const norm = (t) =>
  t
    .replace(/fnv1a64:[0-9a-f]{16}/g, "H")
    .replace(/"0\.2[67]\.0"/g, '"V"')
    .replace(/\.runtime\/harness\/[0-9a-f]{16}/g, ".runtime/harness/S");
const out = { changed: changed.length, residual: [] };
for (const path of changed) {
  const before = git("show", `HEAD:${path}`);
  const after = readFileSync(`${root}/${path}`, "utf8");
  if (norm(before) !== norm(after)) out.residual.push(path);
}
const mb = JSON.parse(git("show", "HEAD:.claude/harness-manifest.json"));
const ma = JSON.parse(
  readFileSync(`${root}/.claude/harness-manifest.json`, "utf8"),
);
out.semanticBefore = mb.origin?.semanticHash;
out.semanticAfter = ma.origin?.semanticHash;
out.installedPathsEqual =
  JSON.stringify(mb.installed.map((f) => f.path)) ===
  JSON.stringify(ma.installed.map((f) => f.path));
out.overlayKey = "overlay" in ma;
const hashLines = new Set();
for (const path of changed) {
  const d = git("diff", "-U0", "HEAD", "--", path)
    .split("\n")
    .filter((l) => /^[+-][^+-]/.test(l));
  for (const l of d)
    hashLines.add(
      l
        .slice(1)
        .replace(/fnv1a64:[0-9a-f]{16}/g, "H")
        .replace(/[0-9a-f]{16}/g, "S")
        .trim(),
    );
}
out.distinctChangedLineShapes = [...hashLines];
console.log(JSON.stringify(out, null, 1));
