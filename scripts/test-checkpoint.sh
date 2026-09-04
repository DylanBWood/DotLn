#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "$script_dir/test-temp-root.sh"
tmp_base="${TMPDIR:-/tmp}"
tmp_base="$(resolve_test_tmp_base "$tmp_base")"
test_root_prefix="dotln-checkpoint-test"
create_test_temp_root "$tmp_base" "$test_root_prefix"
test_root="$test_temp_root_result"
install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"
fixture_repo="$test_root/repo"
saved="$test_root/saved"

git init "$fixture_repo" >/dev/null
git -C "$fixture_repo" config user.email test@example.invalid
git -C "$fixture_repo" config user.name "DotLn Test"
mkdir -p "$fixture_repo/scripts" "$fixture_repo/docs/work-orders" "$fixture_repo/docs/discovery"
cp -- "$script_dir/resume.mjs" "$fixture_repo/scripts/resume.mjs"
cp -R -- "$script_dir/lib" "$fixture_repo/scripts/lib"
cp -- "$script_dir/../.gitignore" "$fixture_repo/.gitignore"
printf '%s\n' \
  '# fixture' \
  '' \
  '**Model:** fixture-model.' \
  '**Effort:** executor any; verifier any; reviewer any.' >"$fixture_repo/docs/work-orders/WO-099-fixture.md"
printf '%s\n' \
  '{"effortReadbackProbe":{"harnesses":{"codex-cli":{"versions":[{"classification":"observed","value":"fixture"}],"persistedEffortSelector":{"classification":"observed","value":"xhigh"}}}}}' >"$fixture_repo/docs/discovery/environment.json"
git -C "$fixture_repo" add .
git -C "$fixture_repo" commit -m initial >/dev/null

node "$fixture_repo/scripts/resume.mjs" activate WO-099 docs/work-orders/WO-099-fixture.md >/dev/null
refs_before_refusal="$(git -C "$fixture_repo" for-each-ref --format='%(refname)' refs/dotln/checkpoint/WO-099/)"
if node "$fixture_repo/scripts/resume.mjs" verify >/dev/null 2>&1; then printf 'error: illegal transition accepted\n' >&2; exit 1; fi
test "$(git -C "$fixture_repo" for-each-ref --format='%(refname)' refs/dotln/checkpoint/WO-099/)" = "$refs_before_refusal"
mkdir -p "$fixture_repo/packages/skeleton/src" "$fixture_repo/docs/verifications/WO-099" "$fixture_repo/docs/intake/notes" "$saved"
printf 'export const recovered = true;\n' >"$fixture_repo/packages/skeleton/src/recovery.ts"
printf '# VER-001 evidence\n' >"$fixture_repo/docs/verifications/WO-099/VER-001.md"
printf 'local raw material\n' >"$fixture_repo/docs/intake/notes/raw.md"
printf 'SECRET=fixture-only\n' >"$fixture_repo/.env"
cp -- "$fixture_repo/packages/skeleton/src/recovery.ts" "$saved/recovery.ts"
cp -- "$fixture_repo/docs/verifications/WO-099/VER-001.md" "$saved/VER-001.md"
cp -- "$fixture_repo/docs/control/resume.jsonl" "$saved/resume.jsonl"

git -C "$fixture_repo" rev-parse HEAD >"$saved/head.before"
git -C "$fixture_repo" status --porcelain >"$saved/status.before"
head_before="$(tr -d '\n' <"$saved/head.before")"
node "$fixture_repo/scripts/resume.mjs" implementation-ready \
  --harness codex-cli \
  --harness-version fixture \
  --model fixture-model \
  --effort xhigh \
  --source self-reported >/dev/null
git -C "$fixture_repo" rev-parse HEAD >"$saved/head.after"
git -C "$fixture_repo" status --porcelain >"$saved/status.after"
cmp "$saved/head.before" "$saved/head.after"
cmp "$saved/status.before" "$saved/status.after"

checkpoint_sha="$(node -e 'const fs=require("fs"); const events=fs.readFileSync(process.argv[1],"utf8").trim().split("\n").map(JSON.parse); process.stdout.write(events.at(-1).checkpointSha)' "$fixture_repo/docs/control/resume.jsonl")"
checkpoint_ref="$(node -e 'const fs=require("fs"); const events=fs.readFileSync(process.argv[1],"utf8").trim().split("\n").map(JSON.parse); process.stdout.write(events.at(-1).checkpointRef)' "$fixture_repo/docs/control/resume.jsonl")"
test -n "$checkpoint_sha"
test "$(git -C "$fixture_repo" rev-parse "$checkpoint_ref")" = "$checkpoint_sha"
test "$(git -C "$fixture_repo" rev-parse "$checkpoint_ref^")" = "$head_before"
test "$(git -C "$fixture_repo" log -1 --format=%s "$checkpoint_ref")" = 'dotln checkpoint: implementation-ready WO-099'
grep -Fq "git checkout $checkpoint_ref -- ." "$fixture_repo/docs/control/current.md"

tree_paths="$(git -C "$fixture_repo" ls-tree -r --name-only "$checkpoint_ref")"
grep -Fxq 'packages/skeleton/src/recovery.ts' <<<"$tree_paths"
grep -Fxq 'docs/verifications/WO-099/VER-001.md' <<<"$tree_paths"
grep -Fxq 'docs/control/resume.jsonl' <<<"$tree_paths"
if grep -Eq '^(docs/intake/|\.env$)' <<<"$tree_paths"; then printf 'error: ignored material entered checkpoint\n' >&2; exit 1; fi

git -C "$fixture_repo" checkout -- .
git -C "$fixture_repo" clean -fd >/dev/null
test ! -e "$fixture_repo/packages/skeleton/src/recovery.ts"
test ! -e "$fixture_repo/docs/verifications/WO-099/VER-001.md"
test ! -e "$fixture_repo/docs/control/resume.jsonl"
git -C "$fixture_repo" checkout "$checkpoint_ref" -- .
cmp "$saved/recovery.ts" "$fixture_repo/packages/skeleton/src/recovery.ts"
cmp "$saved/VER-001.md" "$fixture_repo/docs/verifications/WO-099/VER-001.md"
cmp "$saved/resume.jsonl" "$fixture_repo/docs/control/resume.jsonl"
test -f "$fixture_repo/docs/intake/notes/raw.md"
test -f "$fixture_repo/.env"

stale_repo="$test_root/stale-repo"
mkdir -p "$stale_repo/scripts" "$stale_repo/docs/work-orders" "$stale_repo/docs/discovery" "$test_root/failing-git"
cp -- "$script_dir/resume.mjs" "$stale_repo/scripts/resume.mjs"
cp -R -- "$script_dir/lib" "$stale_repo/scripts/lib"
cp -- "$script_dir/../.gitignore" "$stale_repo/.gitignore"
printf '%s\n' \
  '# fixture' \
  '' \
  '**Model:** fixture-model.' \
  '**Effort:** executor any; verifier any; reviewer any.' >"$stale_repo/docs/work-orders/WO-098-fixture.md"
printf '%s\n' \
  '{"effortReadbackProbe":{"harnesses":{"codex-cli":{"versions":[{"classification":"observed","value":"fixture"}],"persistedEffortSelector":{"classification":"observed","value":"xhigh"}}}}}' >"$stale_repo/docs/discovery/environment.json"
git init "$stale_repo" >/dev/null
git -C "$stale_repo" config user.email test@example.invalid
git -C "$stale_repo" config user.name "DotLn Test"
git -C "$stale_repo" add .
git -C "$stale_repo" commit -m initial >/dev/null
node "$stale_repo/scripts/resume.mjs" activate WO-098 docs/work-orders/WO-098-fixture.md >/dev/null
prior_checkpoint="$(git -C "$stale_repo" for-each-ref --format='%(refname)' refs/dotln/checkpoint/WO-098/)"
test -n "$prior_checkpoint"
printf '#!/usr/bin/env bash\nexit 73\n' >"$test_root/failing-git/git"
chmod +x "$test_root/failing-git/git"
node_bin="$(command -v node)"
checkpoint_warning="$(PATH="$test_root/failing-git" "$node_bin" "$stale_repo/scripts/resume.mjs" implementation-ready \
  --harness codex-cli \
  --harness-version fixture \
  --model fixture-model \
  --effort xhigh \
  --source self-reported 2>&1 >/dev/null)"
grep -Fq 'warning: could not create recovery checkpoint for implementation-ready' <<<"$checkpoint_warning"
grep -Fq 'Do not repeat this transition after it records' <<<"$checkpoint_warning"
grep -Fq 'one-invocation outside-sandbox approval' <<<"$checkpoint_warning"
grep -Fq 'never persist an allow rule' <<<"$checkpoint_warning"
grep -Fq 'docs/AI-HARNESS-SECURITY.md' <<<"$checkpoint_warning"
grep -Fq 'Latest checkpoint: unavailable for the latest transition; do not use an older checkpoint' "$stale_repo/docs/control/current.md"
if grep -Fq "$prior_checkpoint" "$stale_repo/docs/control/current.md"; then printf 'error: stale checkpoint remained advertised\n' >&2; exit 1; fi
grep -Fq '"checkpointUnavailable":true' "$stale_repo/docs/control/resume.jsonl"

# Time recovery reads the named commit ref, never its tree or a neighboring event.
time_blob_sha="$(printf 'fixture time blob\n' | git -C "$fixture_repo" hash-object -w --stdin)"
git -C "$fixture_repo" update-ref refs/dotln/checkpoint/WO-099/9988 "$time_blob_sha"
git -C "$fixture_repo" for-each-ref --format='%(refname) %(objectname)' refs/dotln/ >"$saved/times.refs.before"
node - "$fixture_repo" <<'NODE'
const fs = require("node:fs");
const path = require("node:path");
const root = process.argv[2];
const log = path.join(root, "docs/control/resume.jsonl");
const activation = JSON.parse(fs.readFileSync(log, "utf8").trim().split("\n")[0]);
if (!activation.recordedAt || !activation.checkpointRef) throw new Error("activation omitted recordedAt or checkpoint");
const events = [
  { ...activation, recordedAt: "2026-09-04T12:34:56.789Z", checkpointRef: "refs/dotln/checkpoint/WO-099/9999", checkpointSha: "missing-but-not-needed" },
  { schemaVersion: 1, type: "ImplementationReady", workOrderId: "WO-099", checkpointRef: activation.checkpointRef, checkpointSha: activation.checkpointSha },
  { schemaVersion: 1, type: "VerificationRequested", workOrderId: "WO-099" },
];
fs.writeFileSync(log, events.map(JSON.stringify).join("\n") + "\n");
NODE
cp -- "$fixture_repo/docs/control/resume.jsonl" "$saved/times.log.before"
cp -- "$fixture_repo/docs/control/current.md" "$saved/times.current.before"
node "$fixture_repo/scripts/resume.mjs" times >"$saved/times.json"
node "$fixture_repo/scripts/resume.mjs" times >"$saved/times.again.json"
cmp "$saved/times.json" "$saved/times.again.json"
cmp "$saved/times.log.before" "$fixture_repo/docs/control/resume.jsonl"
cmp "$saved/times.current.before" "$fixture_repo/docs/control/current.md"
git -C "$fixture_repo" for-each-ref --format='%(refname) %(objectname)' refs/dotln/ >"$saved/times.refs.after"
cmp "$saved/times.refs.before" "$saved/times.refs.after"
node - "$fixture_repo" "$saved/times.json" "$saved/times.log.before" <<'NODE'
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const [root, outputPath, originalPath] = process.argv.slice(2);
const source = fs.readFileSync(outputPath, "utf8");
const output = JSON.parse(source);
const original = fs.readFileSync(originalPath, "utf8");
const events = original.trim().split("\n").map(JSON.parse);
const expectedSeconds = Number(execFileSync("git", ["-C", root, "show", "-s", "--format=%ct", events[1].checkpointSha], { encoding: "utf8" }).trim());
assert.equal(output.eventCount, 3);
assert.equal(output.localRefsRead, 1);
assert.deepEqual(output.counts, { recordedAt: 1, "recovered-from-local-checkpoint-ref": 1, unknown: 1 });
assert.match(output.checkpointRefs, /remain unpushed/);
assert.match(output.recoveredPrecision, /second precision/);
assert.equal(source.split("\n").filter((line) => line.startsWith('    {"ordinal":')).length, 3);
assert.deepEqual(output.events, [
  { ordinal: 1, workOrder: "WO-099", type: "WorkOrderActivated", time: "2026-09-04T12:34:56.789Z", source: "recordedAt" },
  { ordinal: 2, workOrder: "WO-099", type: "ImplementationReady", time: new Date(expectedSeconds * 1000).toISOString(), source: "recovered-from-local-checkpoint-ref" },
  { ordinal: 3, workOrder: "WO-099", type: "VerificationRequested", time: "unknown", source: "unknown" },
]);
const log = path.join(root, "docs/control/resume.jsonl");
const current = path.join(root, "docs/control/current.md");
const projectionBefore = fs.readFileSync(current);
for (const [change, refusal] of [
  [{ checkpointRef: "refs/dotln/checkpoint/WO-099/9999" }, /missing local checkpoint ref at line 2/],
  [{ checkpointSha: "0".repeat(40) }, /checkpoint SHA mismatch at line 2/],
  [{ checkpointRef: "HEAD" }, /invalid checkpoint ref at line 2/],
  [{ checkpointRef: "refs/dotln/checkpoint/WO-098/1" }, /invalid checkpoint ref at line 2/],
  [{ checkpointRef: "refs/dotln/checkpoint/WO-099/9988" }, /invalid checkpoint commit at line 2/],
]) {
  const changed = events.map((event, index) => index === 1 ? { ...event, ...change } : event);
  const bytes = changed.map(JSON.stringify).join("\n") + "\n";
  fs.writeFileSync(log, bytes);
  const result = spawnSync(process.execPath, [path.join(root, "scripts/resume.mjs"), "times"], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, refusal);
  assert.equal(result.stdout, "", "refusal must not emit a plausible partial observation");
  assert.equal(fs.readFileSync(log, "utf8"), bytes);
  assert.deepEqual(fs.readFileSync(current), projectionBefore);
}
fs.writeFileSync(log, original);
console.log(`time recovery: ${JSON.stringify(output.counts)}, 1 ref read; byte-identical rerun, unchanged log/projection/refs, missing and mismatched refs refused`);
NODE
git -C "$fixture_repo" for-each-ref --format='%(refname) %(objectname)' refs/dotln/ >"$saved/times.refs.final"
cmp "$saved/times.refs.before" "$saved/times.refs.final"

# New events retain their host timestamp even when checkpoint creation fails.
node - "$stale_repo/docs/control/resume.jsonl" <<'NODE'
const assert = require("node:assert/strict");
const fs = require("node:fs");
const events = fs.readFileSync(process.argv[2], "utf8").trim().split("\n").map(JSON.parse);
assert.equal(events.at(-1).checkpointUnavailable, true);
for (const event of events) assert.equal(new Date(event.recordedAt).toISOString(), event.recordedAt);
NODE
PATH="$test_root/failing-git" "$node_bin" "$stale_repo/scripts/resume.mjs" times >"$saved/times.no-git.json"
node - "$saved/times.no-git.json" <<'NODE'
const assert = require("node:assert/strict");
const fs = require("node:fs");
const output = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.equal(output.localRefsRead, 0);
assert.equal(output.counts.recordedAt, 2);
NODE
printf 'checkpoint tests passed\n'
