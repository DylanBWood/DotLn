// VER-003 corpus comparison for WO-260: the Git-surface reader VER-002
// judged (refs/dotln/checkpoint/WO-260/9) against the current reader, both
// over the current tree. Every reading is {form, file, line}. The prior
// reader's imports are pointed at this worktree's unchanged dependencies.
// Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-260/verification-003-corpus.mjs
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const repo = process.cwd();
const lib = (name) => pathToFileURL(join(repo, "scripts/lib", name)).href;
const shown = spawnSync(
  "git",
  ["show", "refs/dotln/checkpoint/WO-260/9:scripts/lib/git-surface.mjs"],
  { cwd: repo, encoding: "utf8" },
);
if (shown.status !== 0) throw new Error(shown.stderr);
const prior = shown.stdout
  .replace('from "./git.mjs"', `from "${lib("git.mjs")}"`)
  .replace(
    'from "./machinery-coverage.mjs"',
    `from "${lib("machinery-coverage.mjs")}"`,
  )
  .replace('from "./node-engines.mjs"', `from "${lib("node-engines.mjs")}"`);
const dir = mkdtempSync(join(tmpdir(), "dotln-ver260-003-corpus-"));
try {
  const priorPath = join(dir, "git-surface-checkpoint-9.mjs");
  writeFileSync(priorPath, prior);
  const before = await import(pathToFileURL(priorPath).href);
  const after = await import(lib("git-surface.mjs"));
  const key = ({ form, file, line }) => `${form}\t${file}:${line}`;
  const count = (readings) => {
    const map = new Map();
    for (const r of readings) map.set(key(r), (map.get(key(r)) ?? 0) + 1);
    return map;
  };
  const a = before.readGitSurface(repo);
  const b = after.readGitSurface(repo);
  const ca = count(a);
  const cb = count(b);
  const lost = [...ca].filter(([k, n]) => (cb.get(k) ?? 0) < n).map(([k]) => k);
  const added = [...cb]
    .filter(([k, n]) => (ca.get(k) ?? 0) < n)
    .map(([k]) => k);
  const changed = ["scripts/lib/git-surface.mjs", "scripts/test-git-floor.mjs"];
  const outside = (k) => !changed.some((f) => k.includes(`\t${f}:`));
  const forms = (rs) => new Set(rs.map((r) => r.form)).size;
  const result = {
    priorReader: "refs/dotln/checkpoint/WO-260/9:scripts/lib/git-surface.mjs",
    readings: { prior: a.length, current: b.length },
    distinctForms: { prior: forms(a), current: forms(b) },
    lostOutsideChangedFiles: lost.filter(outside),
    addedOutsideChangedFiles: added.filter(outside),
    lostInChangedFiles: lost.filter((k) => !outside(k)).length,
    addedInChangedFiles: added.filter((k) => !outside(k)).length,
    currentCheck: after.checkGitSurface(repo),
  };
  console.log(JSON.stringify(result, null, 2));
  process.exitCode =
    result.lostOutsideChangedFiles.length === 0 &&
    result.currentCheck.exitCode === 0
      ? 0
      : 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
