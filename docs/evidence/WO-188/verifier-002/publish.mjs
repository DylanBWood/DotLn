import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
const quote = (s) => "'" + s.replaceAll("'", "'\\''") + "'";
let source = readFileSync(join(root, "scripts/test-worktree.sh"), "utf8");
source = source.replace(
  /^script_dir=.*$/m,
  "script_dir=" + quote(join(root, "scripts")),
);
const original =
  "'This reviewed PR body stays on one physical source line even though it is longer than eighty characters, leaving visual wrapping to the reader.'";
const sample = "`` [sample](file.md) ` literal ``";
const amended = original + " '' " + quote(sample) + " '' '[empty]()'";
assert.equal(
  source.split(original).length - 1,
  2,
  "both fixture body writes found",
);
source = source.replaceAll(original, amended);
const end = source.indexOf(
  'grep -Fq "$(cat "$committed_body")" "$published_body"',
);
assert.ok(end > 0, "actual captured publication found");
source =
  source.slice(0, end) +
  String.raw`
"$node_bin" - "$committed_body" "$published_body" <<'PROBE'
const fs=require('node:fs'),assert=require('node:assert/strict');
const [beforeFile,afterFile]=process.argv.slice(2);
const before=fs.readFileSync(beforeFile,'utf8'),after=fs.readFileSync(afterFile,'utf8');
const expected=before.split('\n').find(line=>line.includes('[sample]'));
const actual=after.split('\n').find(line=>line.includes('[sample]'));
console.log(JSON.stringify({probe:'actual-publication-in-local-forge-double',expectedCodeSpan:expected,actualCodeSpan:actual,emptyDestinationPublished:after.includes('[empty]()')}));
assert.equal(actual,expected,'a published code example must retain its literal bytes');
PROBE
`;
const temp = mkdtempSync(join(tmpdir(), "dotln-verifier-publish-"));
try {
  const file = join(temp, "test-worktree.sh");
  writeFileSync(file, source);
  const env = { ...process.env };
  for (const key of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
  ])
    delete env[key];
  const run = spawnSync("bash", [file], {
    cwd: root,
    env,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  const safe = (s) =>
    s
      .replaceAll(root, "<worktree>")
      .replaceAll(realpathSync(tmpdir()), "<tmp>")
      .replaceAll(tmpdir(), "<tmp>");
  process.stdout.write(safe(run.stdout + run.stderr));
  console.log(
    JSON.stringify({ probe: "publication-code-span", exit: run.status }),
  );
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(temp, { recursive: true, force: true });
}
