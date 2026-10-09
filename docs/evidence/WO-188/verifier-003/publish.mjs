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
import { spawnSync, execFileSync } from "node:child_process";

const root = process.cwd();
const quote = (value) => "'" + value.replaceAll("'", "'\\''") + "'";
let source = readFileSync(join(root, "scripts/test-worktree.sh"), "utf8");
source = source.replace(
  /^script_dir=.*$/m,
  "script_dir=" + quote(join(root, "scripts")),
);
const baseline = process.argv.includes("--baseline");
if (baseline) {
  const anchor = 'cp -R "$script_dir/lib" "$main/scripts/lib"';
  assert.equal(source.split(anchor).length - 1, 1);
  const archive = execFileSync(
    "git",
    [
      "archive",
      "HEAD",
      "scripts/lib",
      "scripts/worktree.mjs",
      "scripts/resume.mjs",
      "scripts/release.mjs",
      "scripts/license-surfaces.mjs",
    ],
    { cwd: root, maxBuffer: 32 * 1024 * 1024 },
  );
  source = source.replace(
    anchor,
    anchor +
      '\n"$node_bin" --input-type=module - "$main" <<\'BASECODE\'\nimport { writeFileSync, rmSync } from "node:fs";\nimport { execFileSync } from "node:child_process";\nimport { join } from "node:path";\nconst root = process.argv[2];\nconst file = join(root, "baseline.tar");\nwriteFileSync(file, Buffer.from(' +
      JSON.stringify(archive.toString("base64")) +
      ', "base64"));\nexecFileSync("tar", ["-xf", file, "-C", root]);\nrmSync(file);\nBASECODE\n',
  );
}
let append = String.raw`
"$node_bin" --input-type=module - "$subject/pr-body.md" <<'CODEBODY'
import { appendFileSync } from 'node:fs';
const span = '\x60\x60 [crsample](cr-file.md) \x60 literal \x60\x60';
appendFileSync(process.argv[2], '\nIntro\r\r' + span + '\r');
CODEBODY
git -C "$subject" add pr-body.md
git -C "$subject" commit --amend --no-edit >/dev/null
`;
const lfControl = process.argv.includes("--lf-control");
if (lfControl) append = append.replaceAll("\\r", "\\n");
const capture = 'committed_body="$test_root/committed-pr-body.md"';
assert.equal(source.split(capture).length - 1, 1, "publication capture found");
source = source.replace(capture, append + capture);
const end = source.indexOf(
  'grep -Fq "$(cat "$committed_body")" "$published_body"',
);
assert.ok(end > 0, "captured publication found");
source =
  source.slice(0, end) +
  String.raw`
"$node_bin" --input-type=module - "$committed_body" "$published_body" <<'PROBE'
import fs from 'node:fs';
import assert from 'node:assert/strict';
const [beforeFile, afterFile] = process.argv.slice(2);
const before = fs.readFileSync(beforeFile, 'utf8'), after = fs.readFileSync(afterFile, 'utf8');
const expected = '\x60\x60 [crsample](cr-file.md) \x60 literal \x60\x60';
assert.ok(before.includes(expected));
console.log(JSON.stringify({probe:'actual-publication-CR-only-code', committedLiteral:expected, publishedLiteralPreserved:after.includes(expected), publishedCRSample:after.split(/[\r\n]/).filter(line=>line.includes('crsample')), emptyDestinationPublished:after.includes('[empty]()'), originalMixedBacktickPreserved:after.includes('\x60\x60 [sample](file.md) \x60 literal \x60\x60')}));
assert.equal(after.includes(expected), true, 'publication must retain the committed literal code range');
PROBE
`;
const temporary = mkdtempSync(join(tmpdir(), "dotln-verifier-CR-publish-"));
try {
  const file = join(temporary, "test-worktree.sh");
  writeFileSync(file, source);
  const env = { ...process.env };
  for (const key of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
  ])
    delete env[key];
  const trace = process.argv.includes("--trace");
  const run = spawnSync("bash", [...(trace ? ["-x"] : []), file], {
    cwd: root,
    env,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  const safe = (value) =>
    value
      .replaceAll(root, "<worktree>")
      .replaceAll(realpathSync(tmpdir()), "<tmp>")
      .replaceAll(tmpdir(), "<tmp>")
      .replace(/\/Users\/[^\s'"<>]+/g, "<home-path>");
  process.stdout.write(
    safe(
      run.stdout +
        (trace ? run.stderr.split("\n").slice(-100).join("\n") : run.stderr),
    ),
  );
  console.log(
    JSON.stringify({
      probe: "actual-publication-CR-only-code",
      baseline,
      lfControl,
      exit: run.status,
    }),
  );
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
