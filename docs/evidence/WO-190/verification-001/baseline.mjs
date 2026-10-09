import assert from "node:assert/strict";
import { mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
const root = realpathSync(process.argv[2]);
const here = realpathSync(process.argv[3]);
const gitRoot = spawnSync("git", ["rev-parse", "--show-toplevel"], {
  cwd: root,
  encoding: "utf8",
});
assert.equal(gitRoot.status, 0);
assert.equal(gitRoot.stdout.trim(), root);
const old = mkdtempSync(join(here, "baseline-source-"));
const archive = spawnSync(
  "git",
  [
    "archive",
    "08845c71",
    "scripts",
    "packages/beacons",
    "packages/skeleton/src",
    "packages/compiler/src",
    ".gitignore",
  ],
  { cwd: root, maxBuffer: 32 * 1024 * 1024 },
);
assert.equal(archive.status, 0, String(archive.stderr));
const extract = spawnSync("tar", ["-x", "-C", old], {
  input: archive.stdout,
  encoding: "utf8",
});
assert.equal(extract.status, 0, extract.stderr);
const runner = join(root, "docs/evidence/WO-190/umbrella-activation.sh");
let transcript = "";
for (const [label, source, expected] of [
  ["08845c71", old, 0],
  ["WO-190 current", root, 1],
]) {
  const fixture = mkdtempSync(join(here, "baseline-fixture-"));
  const r = spawnSync("bash", [runner, source, fixture], {
    cwd: here,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, new RegExp(`exit ${expected}\\n`));
  if (expected === 0) assert.match(r.stdout, /WorkOrderActivated/);
  else {
    assert.match(
      r.stdout,
      /activation refused: WO-900 is an umbrella record superseded by WO-901, WO-902/,
    );
    assert.match(r.stdout, /control segment: absent/);
  }
  transcript += `${label}\n${r.stdout}${r.stderr}\n`;
}
writeFileSync(join(here, "baseline-transcript.txt"), transcript);
console.log(transcript);
console.log(
  "PASS baseline activation contrast: accepted at 08845c71, refused without event now",
);
