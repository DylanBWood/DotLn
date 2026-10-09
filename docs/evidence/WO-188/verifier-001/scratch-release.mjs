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
let source = readFileSync(join(root, "scripts/test-release.sh"), "utf8");
source = source.replace(
  /^script_dir=.*$/m,
  "script_dir=" + quote(join(root, "scripts")),
);
const added = String.raw`
release_case_verifier_unignored() {
make_repo verifier_unignored
subject="$fixture/project-wo099"
git -C "$main" worktree add "$subject" -b wo-099 main >/dev/null
commit_candidate "$subject" WO-099 v0.2.1
git -C "$subject" push origin HEAD:main >/dev/null 2>&1
nested="$subject/outside-lanes/probe"
mkdir -p "$nested"
git -C "$nested" init -q
printf 'scratch fixture after review\n' >"$nested/saved.txt"
git -C "$nested" add saved.txt
git -C "$nested" -c user.name=Fixture -c user.email=fixture@example.invalid commit -qm scratch
output="$(release_close WO-099 --publish)"
record="$main/docs/control/local/retained/WO-099/release-close.json"
"$node_bin" - "$record" "$subject" <<'JS'
const fs=require('node:fs'),assert=require('node:assert/strict');
const [file,subject]=process.argv.slice(2), r=JSON.parse(fs.readFileSync(file,'utf8'));
console.log(JSON.stringify({case:'unignored-scratch-after-review',publication:r.publication.outcome,cleanup:r.cleanup.outcome,material:r.material.map(x=>({path:x.path,disposition:x.disposition})),removals:r.removals.map(x=>({path:x.path,head:x.head,remoteHeld:x.remoteHeld})),blockers:r.blockers.map(x=>({action:x.action,reason:x.reason.replaceAll(subject,'<subject>')})),scratchSurvived:fs.existsSync(subject+'/outside-lanes/probe/saved.txt')}));
assert.equal(r.cleanup.outcome,'clean','criterion 1: nested scratch outside lanes must be removed without a blocker');
assert.equal(fs.existsSync(subject+'/outside-lanes/probe'),false);
JS
}
`;
const at = source.lastIndexOf('\nif [[ -n "$selected_case" ]]');
assert.ok(at > 0, "the actual fixture dispatch must be found");
source = source.slice(0, at) + added + source.slice(at);
const temp = mkdtempSync(join(tmpdir(), "dotln-verifier-release-"));
try {
  const file = join(temp, "test-release.sh");
  writeFileSync(file, source);
  const run = spawnSync("bash", [file, "--case", "verifier_unignored"], {
    cwd: root,
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
    JSON.stringify({
      case: "unignored-scratch-after-review",
      exit: run.status,
    }),
  );
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(temp, { recursive: true, force: true });
}
