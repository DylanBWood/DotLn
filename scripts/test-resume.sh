#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "$script_dir/test-temp-root.sh"
tmp_base="${TMPDIR:-/tmp}"
tmp_base="$(resolve_test_tmp_base "$tmp_base")"
test_root_prefix="dotln-resume-test"
create_test_temp_root "$tmp_base" "$test_root_prefix"
test_root="$test_temp_root_result"
install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"
fixture_repo="$test_root/repo"
u2028="$(printf '\342\200\250')"

mkdir -p -- "$fixture_repo/scripts" "$fixture_repo/docs/work-orders" "$fixture_repo/docs/discovery"
cp -- "$script_dir/resume.mjs" "$fixture_repo/scripts/resume.mjs"
cp -R -- "$script_dir/lib" "$fixture_repo/scripts/lib"
printf '%s\n' \
  '# fixture' \
  '' \
  '> operator-authored draft notice may precede metadata' \
  '' \
  '**Model:** fixture-model with a multiline' \
  'declaration preserved in dispatch.' \
  '' \
  '**Effort:** executor high+; verifier any; reviewer any. The multiline' \
  'effort source is preserved too.' \
  '**Objective:** fixture lifecycle.' >"$fixture_repo/docs/work-orders/WO-099-fixture.md"
printf '%s\n' \
  '{"effortReadbackProbe":{"harnesses":{"claude-code":{"versions":[{"classification":"observed","value":"fixture-0"},{"classification":"observed","value":"fixture-1"}],"sessionEffortSelector":{"classification":"documented locally","values":["low","medium","high","max"]},"sessionLabelNotes":{"ultracode":{"classification":"operator-attested","reasoningEffort":"xhigh","attestationSource":"operator-attested","automaticConversion":false},"malformed":{"classification":"operator-attested","reasoningEffort":"xhigh"}},"effectiveEffortReadback":{"classification":"observed","values":["xhigh"]}},"codex-cli":{"versions":[{"classification":"observed","value":"fixture-1"},{"classification":"observed","value":"fixture-2"}],"persistedEffortSelector":{"classification":"observed","value":"xhigh"},"effectiveEffortReadback":{"classification":"not found"}}}}}' >"$fixture_repo/docs/discovery/environment.json"
mkdir -p "$fixture_repo/docs/verifications/WO-099" "$fixture_repo/docs/final-reviews/WO-099"
printf '# existing verification\n' >"$fixture_repo/docs/verifications/WO-099/VER-001.md"
printf '# existing final review\n' >"$fixture_repo/docs/final-reviews/WO-099/FINAL-001.md"
status_sequence=0
assert_status_read_only() {
  status_sequence=$((status_sequence + 1))
  local current_before="$test_root/current-$status_sequence.before"
  local log_before="$test_root/log-$status_sequence.before"
  local json_path="$test_root/status-$status_sequence.json"
  cp -- "$fixture_repo/docs/control/current.md" "$current_before"
  cp -- "$fixture_repo/docs/control/resume.jsonl" "$log_before"
  node "$fixture_repo/scripts/resume.mjs" status >/dev/null
  node "$fixture_repo/scripts/resume.mjs" status --json >"$json_path"
  cmp "$current_before" "$fixture_repo/docs/control/current.md"
  cmp "$log_before" "$fixture_repo/docs/control/resume.jsonl"
  node - "$json_path" <<'NODE'
const fs = require("node:fs");
const status = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const expected = [
  "workOrder",
  "workOrderPath",
  "phase",
  "latestVerification",
  "verificationPath",
  "latestVerdict",
  "finalReview",
  "finalReviewPath",
  "latestAttestation",
  "effortDrift",
  "latestCheckpoint",
  "legalNextActions",
].sort();
const observed = Object.keys(status).sort();
if (JSON.stringify(observed) !== JSON.stringify(expected)) {
  throw new Error(`status keys changed: ${JSON.stringify(observed)}`);
}
if (!Array.isArray(status.effortDrift) || !Array.isArray(status.legalNextActions)) {
  throw new Error("status array fields are malformed");
}
NODE
}
assert_status_json() {
  local expected="$1"
  local actual="$test_root/status-exact.json"
  node "$fixture_repo/scripts/resume.mjs" status --json >"$actual"
  node - "$actual" "$expected" <<'NODE'
const assert = require("node:assert/strict");
const fs = require("node:fs");
const [actualPath, expectedSource] = process.argv.slice(2);
assert.deepStrictEqual(
  JSON.parse(fs.readFileSync(actualPath, "utf8")),
  JSON.parse(expectedSource),
);
NODE
}
run() {
  node "$fixture_repo/scripts/resume.mjs" "$@" >/dev/null 2>/dev/null || return
  assert_status_read_only
}
run_with_actor() {
  local action="$1" effort="$2"
  shift 2
  node "$fixture_repo/scripts/resume.mjs" "$action" "$@" \
    --harness codex-cli \
    --harness-version fixture-2 \
    --model fixture.model/beta \
    --effort "$effort" \
    --source self-reported >/dev/null 2>/dev/null || return
  assert_status_read_only
}
event_count() { if [[ -f "$fixture_repo/docs/control/resume.jsonl" ]]; then wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' '; else printf '0\n'; fi; }
assert_refusal() {
  local expected="$1" before output
  shift
  before="$(event_count)"
  if output="$(node "$fixture_repo/scripts/resume.mjs" "$@" 2>&1)"; then
    printf 'error: refusal expected for resume %s\n' "$*" >&2
    exit 1
  fi
  grep -Fq "$expected" <<<"$output"
  if grep -Fq 'at file://' <<<"$output"; then printf 'error: refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
  test "$(event_count)" = "$before"
}
refuse_next() {
  local before output
  before="$(event_count)"
  if output="$(node "$fixture_repo/scripts/resume.mjs" next 2>&1)"; then printf 'error: next accepted outside active/closed\n' >&2; exit 1; fi
  grep -Fq 'run:' <<<"$output"
  if grep -Fq 'at file://' <<<"$output"; then printf 'error: next refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
  test "$(event_count)" = "$before"
}

refuse_next
printf '%s\n' '# missing model' '' '**Effort:** executor high+; verifier any; reviewer any.' '**Objective:** fixture.' >"$fixture_repo/docs/work-orders/WO-096-missing-model.md"
assert_refusal 'missing **Model:** line' activate WO-096 docs/work-orders/WO-096-missing-model.md
printf '%s\n' '# empty model' '' '**Model:**' '**Effort:** executor high+; verifier any; reviewer any.' '**Objective:** fixture.' >"$fixture_repo/docs/work-orders/WO-095-empty-model.md"
assert_refusal 'malformed **Model:** line' activate WO-095 docs/work-orders/WO-095-empty-model.md
printf '%s\n' '# missing effort' '' '**Model:** fixture-model.' '**Objective:** fixture.' >"$fixture_repo/docs/work-orders/WO-097-missing-effort.md"
assert_refusal 'missing **Effort:** line' activate WO-097 docs/work-orders/WO-097-missing-effort.md
printf '%s\n' '# malformed effort' '' '**Model:** fixture-model.' '**Effort:** executor high+; verifier any.' '**Objective:** fixture.' >"$fixture_repo/docs/work-orders/WO-098-malformed-effort.md"
assert_refusal 'malformed **Effort:** line' activate WO-098 docs/work-orders/WO-098-malformed-effort.md
printf '%s\n' '# buried model' '' '**Objective:** fixture.' '**Model:** fixture-model.' '**Effort:** executor high+; verifier any; reviewer any.' >"$fixture_repo/docs/work-orders/WO-094-buried-model.md"
assert_refusal 'leading metadata header' activate WO-094 docs/work-orders/WO-094-buried-model.md
printf '%s\n' '# h2 buried model' '' '## Body' '' '**Model:** fixture-model.' '**Effort:** executor high+; verifier any; reviewer any.' >"$fixture_repo/docs/work-orders/WO-090-h2-buried-model.md"
assert_refusal 'leading metadata header' activate WO-090 docs/work-orders/WO-090-h2-buried-model.md
printf '%s\n' '# reversed fields' '' '**Effort:** executor high+; verifier any; reviewer any.' '**Model:** fixture-model.' '**Objective:** fixture.' >"$fixture_repo/docs/work-orders/WO-093-reversed-fields.md"
assert_refusal 'immediately after **Model:**' activate WO-093 docs/work-orders/WO-093-reversed-fields.md
printf '%s\n' '# duplicate model' '' '**Model:** fixture-model.' '**Effort:** executor high+; verifier any; reviewer any.' '**Objective:** fixture.' '' '```markdown' '**Model:** misleading-example.' '```' >"$fixture_repo/docs/work-orders/WO-092-duplicate-model.md"
assert_refusal 'duplicate **Model:** lines' activate WO-092 docs/work-orders/WO-092-duplicate-model.md
printf '%s\n' '# duplicate effort' '' '**Model:** fixture-model.' '**Effort:** executor high+; verifier any; reviewer any.' '**Objective:** fixture.' '' '```markdown' '**Effort:** executor any; verifier any; reviewer any.' '```' >"$fixture_repo/docs/work-orders/WO-091-duplicate-effort.md"
assert_refusal 'duplicate **Effort:** lines' activate WO-091 docs/work-orders/WO-091-duplicate-effort.md
activate_warning="$(node "$fixture_repo/scripts/resume.mjs" activate WO-099 docs/work-orders/WO-099-fixture.md 2>&1 >/dev/null)"
assert_status_read_only
assert_status_json '{"workOrder":"WO-099","workOrderPath":"docs/work-orders/WO-099-fixture.md","phase":"active","latestVerification":null,"verificationPath":null,"latestVerdict":null,"finalReview":null,"finalReviewPath":null,"latestAttestation":null,"effortDrift":[],"latestCheckpoint":{"unavailable":true},"legalNextActions":["next","implementation-ready"]}'
tail -n 1 "$fixture_repo/docs/control/resume.jsonl" | grep -Fq '"effortDeclarationValidated":true'
grep -q 'warning: could not create recovery checkpoint.*not a git repository' <<<"$activate_warning"
grep -Fq 'Do not repeat this transition after it records' <<<"$activate_warning"
grep -Fq 'one-invocation outside-sandbox approval' <<<"$activate_warning"
grep -Fq 'never persist an allow rule' <<<"$activate_warning"
grep -Fq 'docs/AI-HARNESS-SECURITY.md' <<<"$activate_warning"
grep -Fq 'Latest checkpoint: unavailable for the latest transition; do not use an older checkpoint' "$fixture_repo/docs/control/current.md"
before_active_next="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
active_next="$(node "$fixture_repo/scripts/resume.mjs" next)"
grep -Fq 'docs/work-orders/WO-099-fixture.md' <<<"$active_next"
grep -Fq '**Model:** fixture-model with a multiline' <<<"$active_next"
grep -Fq 'declaration preserved in dispatch.' <<<"$active_next"
grep -Fq '**Effort:** executor high+; verifier any; reviewer any. The multiline' <<<"$active_next"
grep -Fq 'effort source is preserved too.' <<<"$active_next"
grep -Fq 'npm run resume -- implementation-ready --harness' <<<"$active_next"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_active_next"
grep -q 'Legal next actions: next, implementation-ready' "$fixture_repo/docs/control/current.md"
if refused="$(node "$fixture_repo/scripts/resume.mjs" verify 2>&1)"; then printf 'error: illegal active verification accepted\n' >&2; exit 1; fi
grep -Fq 'npm run resume -- next' <<<"$refused"
if grep -Fq 'at file://' <<<"$refused"; then printf 'error: refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness-version fixture-1 --model fixture.model/alpha --effort xhigh --source self-reported
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --model fixture.model/alpha --effort xhigh --source self-reported
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --harness-version fixture-1 --effort xhigh --source self-reported
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model fixture.model/alpha --source self-reported
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model fixture.model/alpha --effort xhigh
assert_refusal 'invalid --source observed' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model fixture.model/alpha --effort xhigh --source observed
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model '' --effort xhigh --source self-reported
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model --typo --effort xhigh --source self-reported
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model $'fixture.model/alpha\n- Effort drift: forged' --effort xhigh --source self-reported
assert_refusal 'usage: resume implementation-ready' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model "fixture.model/alpha${u2028}forged" --effort xhigh --source self-reported
assert_refusal 'attested effort xhigh refused for other:fixture fixture-3' implementation-ready \
  --harness other:fixture --harness-version fixture-3 --model fixture.model/gamma --effort xhigh --source self-reported
assert_refusal 'recorded observed versions: fixture-1, fixture-2' implementation-ready \
  --harness codex-cli --harness-version fixture-old --model fixture.model/beta --effort xhigh --source self-reported
assert_refusal 'attested effort max refused for codex-cli fixture-2' implementation-ready \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort max --source self-reported
assert_refusal 'attested executor effort medium is below declared high+' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model fixture.model/alpha --effort medium --source self-reported
assert_refusal 'sessionLabelNotes.ultracode' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model fixture.model/alpha --effort ultracode --source self-reported
assert_refusal 'sessionLabelNotes.ultracode' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model fixture.model/alpha --effort ultracode --source harness-readback
for unattested_label in constructor toString __proto__ malformed; do
  before_unattested_label="$(event_count)"
  if unattested_output="$(node "$fixture_repo/scripts/resume.mjs" implementation-ready \
    --harness claude-code --harness-version fixture-1 --model fixture.model/alpha \
    --effort "$unattested_label" --source self-reported 2>&1)"; then
    printf 'error: unattested effort label %s accepted\n' "$unattested_label" >&2
    exit 1
  fi
  grep -Fq "unknown (raw: $unattested_label)" <<<"$unattested_output"
  if grep -Eq 'sessionLabelNotes|undefined' <<<"$unattested_output"; then
    printf 'error: unattested effort label %s inherited guidance\n' "$unattested_label" >&2
    exit 1
  fi
  test "$(event_count)" = "$before_unattested_label"
done
assert_refusal 'recorded observed versions: fixture-1, fixture-2' implementation-ready \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort xhigh --source harness-readback
assert_refusal 'recorded observed versions: fixture-0, fixture-1' implementation-ready \
  --harness claude-code --harness-version fixture-old --model fixture.model/alpha --effort xhigh --source harness-readback
assert_refusal 'harness-readback refused for claude-code fixture-1 effort high' implementation-ready \
  --harness claude-code --harness-version fixture-1 --model fixture.model/alpha --effort high --source harness-readback
node "$fixture_repo/scripts/resume.mjs" implementation-ready \
  --harness claude-code \
  --harness-version fixture-0 \
  --model fixture.model/alpha \
  --effort xhigh \
  --source harness-readback >/dev/null 2>/dev/null
assert_status_read_only
node - "$fixture_repo/docs/control/resume.jsonl" <<'NODE'
const fs = require("node:fs");
const events = fs.readFileSync(process.argv[2], "utf8").trim().split("\n").map(JSON.parse);
const actor = events.at(-1).actor;
const expected = { harness: "claude-code", harnessVersion: "fixture-0", model: "fixture.model/alpha", effort: "xhigh", source: "harness-readback" };
if (JSON.stringify(actor) !== JSON.stringify(expected)) throw new Error(`recognized actor changed: ${JSON.stringify(actor)}`);
NODE
grep -Fq 'Latest attestation: harness claude-code; version fixture-0; model fixture.model/alpha; effort xhigh; source harness-readback' "$fixture_repo/docs/control/current.md"
grep -Fq 'Effort drift: none' "$fixture_repo/docs/control/current.md"
refuse_next
before_unfounded_fix="$(event_count)"
if run fix 2>/dev/null; then printf 'error: repair reopened without a failure source\n' >&2; exit 1; fi
test "$(event_count)" = "$before_unfounded_fix"
run verify
refuse_next
grep -q 'VER-002.md' "$fixture_repo/docs/control/current.md"
before_invalid="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
if run final-review 2>/dev/null; then printf 'error: illegal transition accepted\n' >&2; exit 1; fi
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_invalid"
assert_refusal 'verification report is not a contained regular file' verification-result fail \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort ultracode --source self-reported
printf '# fail\n' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
assert_refusal 'usage: resume verification-result pass|fail' verification-result fail
assert_refusal 'verification report must contain exactly one machine-readable actor header' verification-result fail \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort ultracode --source self-reported
printf '%s\n' \
  '# fail' \
  '' \
  '**Actor attestation:** {"harness":"made-up","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode","source":"self-reported"}' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
assert_refusal 'invalid --harness made-up' verification-result fail \
  --harness made-up --harness-version fixture-2 --model fixture.model/beta --effort ultracode --source self-reported
printf '%s\n' \
  '# fail' \
  '' \
  '**Actor attestation:** {"harness":"other:","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode","source":"self-reported"}' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
assert_refusal 'invalid --harness other:' verification-result fail \
  --harness other: --harness-version fixture-2 --model fixture.model/beta --effort ultracode --source self-reported
printf '%s\n' \
  '# fail' \
  '' \
  '**Actor attestation:** {"harness":"codex-cli","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode","source":"self-reported"}' \
  '**Actor attestation:** {"harness":"codex-cli","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode","source":"self-reported"}' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
assert_refusal 'verification report must contain exactly one machine-readable actor header' verification-result fail \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort ultracode --source self-reported
printf '%s\n' \
  '# fail' \
  '' \
  '**Actor attestation:** {not-json}' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
assert_refusal 'verification report has malformed actor header' verification-result fail \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort ultracode --source self-reported
printf '%s\n' \
  '# fail' \
  '' \
  '**Actor attestation:** {"harness":"spoof","harness":"codex-cli","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode","source":"self-reported"}' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
assert_refusal 'verification report actor header does not match the completion actor' verification-result fail \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort ultracode --source self-reported
printf '%s\n' \
  '# fail' \
  '' \
  '**Actor attestation:** {"harness":"codex-cli","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode","source":"self-reported"}' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
assert_refusal 'verification report actor header does not match the completion actor' verification-result fail \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort xhigh --source self-reported
run_with_actor verification-result ultracode fail
node - "$fixture_repo/docs/control/resume.jsonl" <<'NODE'
const fs = require("node:fs");
const events = fs.readFileSync(process.argv[2], "utf8").trim().split("\n").map(JSON.parse);
const actor = events.at(-1).actor;
const expected = { harness: "codex-cli", harnessVersion: "fixture-2", model: "fixture.model/beta", effort: "unknown", raw: "ultracode", source: "self-reported" };
if (JSON.stringify(actor) !== JSON.stringify(expected)) throw new Error(`raw effort was not preserved: ${JSON.stringify(actor)}`);
NODE
grep -Fq 'Latest attestation: harness codex-cli; version fixture-2; model fixture.model/beta; effort unknown (raw: ultracode); source self-reported' "$fixture_repo/docs/control/current.md"
grep -Fq 'Effort drift: xhigh -> unknown (raw: ultracode)' "$fixture_repo/docs/control/current.md"
refuse_next
run fix
refuse_next
assert_refusal 'usage: resume repair-complete' repair-complete
node "$fixture_repo/scripts/resume.mjs" repair-complete \
  --harness claude-code \
  --harness-version fixture-1 \
  --model fixture.model/alpha \
  --effort high \
  --source self-reported >/dev/null 2>/dev/null
assert_status_read_only
grep -q 'Legal next actions: verify, fix' "$fixture_repo/docs/control/current.md"
reopened_fix="$(node "$fixture_repo/scripts/resume.mjs" fix 2>/dev/null)"
assert_status_read_only
grep -q 'VER-002.md' <<<"$reopened_fix"
grep -q 'Phase: repairing' "$fixture_repo/docs/control/current.md"
before_repairing_verify="$(event_count)"
if repairing_verify="$(node "$fixture_repo/scripts/resume.mjs" verify 2>&1)"; then printf 'error: verify accepted before repair-complete\n' >&2; exit 1; fi
grep -Fq 'npm run resume -- repair-complete' <<<"$repairing_verify"
test "$(event_count)" = "$before_repairing_verify"
tail -n 1 "$fixture_repo/docs/control/resume.jsonl" | grep -Fq '"sourceFindingId":"VER-002"'
tail -n 1 "$fixture_repo/docs/control/resume.jsonl" | grep -Fq '"sourceReportPath":"docs/verifications/WO-099/VER-002.md"'
run_with_actor repair-complete xhigh
run verify
grep -q 'VER-003.md' "$fixture_repo/docs/control/current.md"
printf '%s\n' \
  '# pass' \
  '' \
  '**Actor attestation:** {"harness":"codex-cli","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode","source":"self-reported"}' >"$fixture_repo/docs/verifications/WO-099/VER-003.md"
run_with_actor verification-result ultracode pass
test "$(grep -F 'Effort drift:' "$fixture_repo/docs/control/current.md")" = '- Effort drift: xhigh -> unknown (raw: ultracode) -> high'
refuse_next
run final-review
refuse_next
grep -q 'FINAL-002.md' "$fixture_repo/docs/control/current.md"
printf '# failed final\n' >"$fixture_repo/docs/final-reviews/WO-099/FINAL-002.md"
assert_refusal 'final-review report must contain exactly one machine-readable actor header' final-review-result fail \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort xhigh --source self-reported
printf '%s\n' \
  '# failed final' \
  '' \
  '**Actor attestation:** {"harness":"codex-cli","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"xhigh","source":"self-reported"}' >"$fixture_repo/docs/final-reviews/WO-099/FINAL-002.md"
assert_refusal 'usage: resume final-review-result pass|fail' final-review-result fail
run_with_actor final-review-result xhigh fail
node "$fixture_repo/scripts/resume.mjs" fix 2>/dev/null | grep -q 'FINAL-002.md'
assert_status_read_only
node "$fixture_repo/scripts/resume.mjs" repair-complete \
  --harness claude-code \
  --harness-version fixture-1 \
  --model fixture.model/alpha \
  --effort xhigh \
  --source operator-attested >/dev/null 2>/dev/null
assert_status_read_only
run verify
grep -q 'VER-004.md' "$fixture_repo/docs/control/current.md"
printf '%s\n' \
  '# repaired pass' \
  '' \
  '**Actor attestation:** {"harness":"codex-cli","harnessVersion":"fixture-2","model":"fixture.model/beta","effort":"unknown","raw":"ultracode-2","source":"self-reported"}' >"$fixture_repo/docs/verifications/WO-099/VER-004.md"
run_with_actor verification-result ultracode-2 pass
grep -Fq 'Effort drift: xhigh -> unknown (raw: ultracode) -> high -> unknown (raw: ultracode-2)' "$fixture_repo/docs/control/current.md"
run final-review
grep -q 'FINAL-003.md' "$fixture_repo/docs/control/current.md"
printf '%s\n' \
  '# pass' \
  '' \
  '**Actor attestation:** {"harness":"human","harnessVersion":"not-applicable","model":"human","effort":"unknown","source":"operator-attested"}' >"$fixture_repo/docs/final-reviews/WO-099/FINAL-003.md"
assert_refusal 'final-review report actor header does not match the completion actor' final-review-result pass \
  --harness codex-cli --harness-version fixture-2 --model fixture.model/beta --effort xhigh --source self-reported
final_pass_output="$(node "$fixture_repo/scripts/resume.mjs" final-review-result pass \
  --harness human \
  --harness-version not-applicable \
  --model human \
  --effort unknown \
  --source operator-attested 2>/dev/null)"
assert_status_read_only
assert_status_json '{"workOrder":"WO-099","workOrderPath":"docs/work-orders/WO-099-fixture.md","phase":"closed","latestVerification":"VER-004","verificationPath":"docs/verifications/WO-099/VER-004.md","latestVerdict":"pass","finalReview":"FINAL-003","finalReviewPath":"docs/final-reviews/WO-099/FINAL-003.md","latestAttestation":{"harness":"human","harnessVersion":"not-applicable","model":"human","effort":"unknown","source":"operator-attested"},"effortDrift":[{"effort":"xhigh"},{"effort":"unknown","raw":"ultracode"},{"effort":"high"},{"effort":"unknown","raw":"ultracode-2"},{"effort":"unknown"}],"latestCheckpoint":{"unavailable":true},"legalNextActions":["release-close","next","activate"]}'
grep -Fq 'npm run worktree -- publish WO-099 --title <title> --body-file <contained-reviewed-body-path>' <<<"$final_pass_output"
grep -Fq 'Latest attestation: harness human; version not-applicable; model human; effort unknown; source operator-attested' "$fixture_repo/docs/control/current.md"
if grep -Fq 'raw: unknown' "$fixture_repo/docs/control/current.md"; then printf 'error: canonical unknown was duplicated as a raw label\n' >&2; exit 1; fi
node - "$fixture_repo/docs/control/resume.jsonl" <<'NODE'
const fs = require("node:fs");
const events = fs.readFileSync(process.argv[2], "utf8").trim().split("\n").map(JSON.parse);
const completionTypes = new Set(["ImplementationReady", "VerificationCompleted", "RepairCompleted", "FinalReviewCompleted"]);
const completions = events.filter((event) => event.workOrderId === "WO-099" && completionTypes.has(event.type));
if (!completions.length || completions.some((event) => !event.actor)) throw new Error("completion event without actor");
if (events.some((event) => event.schemaVersion !== 1)) throw new Error("control schema version changed");
NODE
closed_next="$(node "$fixture_repo/scripts/resume.mjs" next)"
grep -Fq 'between work orders' <<<"$closed_next"
grep -Fq 'npm run worktree -- start' <<<"$closed_next"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "18"
grep -q 'Phase: closed' "$fixture_repo/docs/control/current.md"
test "$(grep -c '"verificationId":"VER-002"' "$fixture_repo/docs/control/resume.jsonl")" = "2"
test "$(grep -c '"verificationId":"VER-003"' "$fixture_repo/docs/control/resume.jsonl")" = "2"
cp -- "$fixture_repo/docs/control/current.md" "$test_root/current.closed"
cp -- "$fixture_repo/docs/control/resume.jsonl" "$test_root/log.closed"
printf '\nmanual projection drift\n' >>"$fixture_repo/docs/control/current.md"
cp -- "$fixture_repo/docs/control/current.md" "$test_root/current.drifted"
node "$fixture_repo/scripts/resume.mjs" status \
  >"$test_root/status-drift-human.txt" \
  2>"$test_root/status-drift-human.err"
node "$fixture_repo/scripts/resume.mjs" status --json \
  >"$test_root/status-drift.json" \
  2>"$test_root/status-drift-json.err"
grep -q 'Legal next actions: release-close, next, activate' "$test_root/status-drift-human.txt"
grep -Fq 'warning: docs/control/current.md disagrees with the canonical fold' "$test_root/status-drift-human.err"
grep -Fq 'warning: docs/control/current.md disagrees with the canonical fold' "$test_root/status-drift-json.err"
node - "$test_root/status-drift.json" <<'NODE'
const assert = require("node:assert/strict");
const fs = require("node:fs");
const status = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.deepStrictEqual(status, {
  workOrder: "WO-099",
  workOrderPath: "docs/work-orders/WO-099-fixture.md",
  phase: "closed",
  latestVerification: "VER-004",
  verificationPath: "docs/verifications/WO-099/VER-004.md",
  latestVerdict: "pass",
  finalReview: "FINAL-003",
  finalReviewPath: "docs/final-reviews/WO-099/FINAL-003.md",
  latestAttestation: { harness: "human", harnessVersion: "not-applicable", model: "human", effort: "unknown", source: "operator-attested" },
  effortDrift: [
    { effort: "xhigh" },
    { effort: "unknown", raw: "ultracode" },
    { effort: "high" },
    { effort: "unknown", raw: "ultracode-2" },
    { effort: "unknown" },
  ],
  latestCheckpoint: { unavailable: true },
  legalNextActions: ["release-close", "next", "activate"],
});
NODE
cmp "$test_root/current.drifted" "$fixture_repo/docs/control/current.md"
cmp "$test_root/log.closed" "$fixture_repo/docs/control/resume.jsonl"
cp -- "$test_root/current.closed" "$fixture_repo/docs/control/current.md"
cp -- "$fixture_repo/docs/control/current.md" "$test_root/current-before-bad-status"
cp -- "$fixture_repo/docs/control/resume.jsonl" "$test_root/log-before-bad-status"
assert_refusal 'usage: resume status [--json]' status --json --json
assert_refusal 'usage: resume status [--json]' status --wat
cmp "$test_root/current-before-bad-status" "$fixture_repo/docs/control/current.md"
cmp "$test_root/log-before-bad-status" "$fixture_repo/docs/control/resume.jsonl"
before_release_close="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
release_close_output="$(node "$fixture_repo/scripts/resume.mjs" release-close)"
grep -Fq 'run the reviewed helper with main as its working checkout' <<<"$release_close_output"
grep -Fq "'$fixture_repo/scripts/release.mjs' close WO-099 --publish" <<<"$release_close_output"
grep -Fq 'never push main' <<<"$release_close_output"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_release_close"
before_bad_activate="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
if run activate WO-100 docs/work-orders/WO-100-next.md 2>/dev/null; then printf 'error: nonexistent work order activated\n' >&2; exit 1; fi
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_bad_activate"
mkdir -p "$test_root/outside"
printf '%s\n' '# outside' '' '**Model:** fixture-model.' '**Effort:** executor any; verifier any; reviewer any.' >"$test_root/outside/WO-101-outside.md"
ln -s "$test_root/outside" "$fixture_repo/docs/work-orders/link"
if run activate WO-101 docs/work-orders/link/WO-101-outside.md 2>/dev/null; then printf 'error: symlinked work order activated\n' >&2; exit 1; fi
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_bad_activate"
printf '%s\n' '# next' '' '**Model:** fixture-model.' '**Effort:** executor any; verifier any; reviewer any.' >"$fixture_repo/docs/work-orders/WO-100-next.md"
run activate WO-100 docs/work-orders/WO-100-next.md
grep -q 'Work order: WO-100' "$fixture_repo/docs/control/current.md"
grep -q 'Latest attestation: none' "$fixture_repo/docs/control/current.md"
grep -q 'Effort drift: none' "$fixture_repo/docs/control/current.md"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "19"
printf '%s\n' '# next' '' '**Model:** fixture-model.' >"$fixture_repo/docs/work-orders/WO-100-next.md"
assert_refusal 'missing **Effort:** line' next

legacy_repo="$test_root/legacy-active"
mkdir -p "$legacy_repo/scripts" "$legacy_repo/docs/work-orders" "$legacy_repo/docs/control"
cp -- "$script_dir/resume.mjs" "$legacy_repo/scripts/resume.mjs"
cp -R -- "$script_dir/lib" "$legacy_repo/scripts/lib"
printf '%s\n' \
  '# legacy active fixture' \
  '' \
  '**Model:** fixture-model.' \
  '**Objective:** activated before WO-019.' >"$legacy_repo/docs/work-orders/WO-089-legacy.md"
printf '%s\n' \
  '{"schemaVersion":1,"type":"WorkOrderActivated","workOrderId":"WO-089","workOrderPath":"docs/work-orders/WO-089-legacy.md"}' >"$legacy_repo/docs/control/resume.jsonl"
legacy_next="$(node "$legacy_repo/scripts/resume.mjs" next)"
grep -Fq '**Effort:** unavailable for this pre-WO-019 activation; executor any; verifier any; reviewer any.' <<<"$legacy_next"
node "$legacy_repo/scripts/resume.mjs" implementation-ready \
  --harness human \
  --harness-version not-applicable \
  --model human \
  --effort unknown \
  --source operator-attested >/dev/null 2>/dev/null
test "$(wc -l <"$legacy_repo/docs/control/resume.jsonl" | tr -d ' ')" = "2"
tail -n 1 "$legacy_repo/docs/control/resume.jsonl" | grep -Fq '"effort":"unknown"'

boundary_repo="$test_root/wo019-boundary"
mkdir -p "$boundary_repo/scripts" "$boundary_repo/docs/work-orders" "$boundary_repo/docs/control"
cp -- "$script_dir/resume.mjs" "$boundary_repo/scripts/resume.mjs"
cp -R -- "$script_dir/lib" "$boundary_repo/scripts/lib"
printf '%s\n' \
  '# WO-019 boundary fixture' \
  '' \
  '**Model:** fixture-model.' \
  '**Objective:** migration boundary stays strict.' >"$boundary_repo/docs/work-orders/WO-019-boundary.md"
printf '%s\n' \
  '{"schemaVersion":1,"type":"WorkOrderActivated","workOrderId":"WO-019","workOrderPath":"docs/work-orders/WO-019-boundary.md"}' >"$boundary_repo/docs/control/resume.jsonl"
if boundary_output="$(node "$boundary_repo/scripts/resume.mjs" next 2>&1)"; then
  printf 'error: WO-019 migration boundary accepted a missing Effort declaration\n' >&2
  exit 1
fi
grep -Fq 'missing **Effort:** line' <<<"$boundary_output"
test "$(wc -l <"$boundary_repo/docs/control/resume.jsonl" | tr -d ' ')" = "1"

invalid_events_repo="$test_root/invalid-events"
mkdir -p "$invalid_events_repo/scripts" "$invalid_events_repo/docs/control"
cp -- "$script_dir/resume.mjs" "$invalid_events_repo/scripts/resume.mjs"
cp -R -- "$script_dir/lib" "$invalid_events_repo/scripts/lib"
printf 'projection sentinel\n' >"$invalid_events_repo/docs/control/current.md"
printf '%s\n' \
  '{"schemaVersion":1,"type":"WorkOrderActivated","workOrderId":"WO-088","workOrderPath":"docs/work-orders/WO-088-fixture.md"}' \
  '{"schemaVersion":1,"type":"FutureControlEvent","workOrderId":"WO-088"}' >"$invalid_events_repo/docs/control/resume.jsonl"
cp -- "$invalid_events_repo/docs/control/current.md" "$test_root/invalid-current.before"
cp -- "$invalid_events_repo/docs/control/resume.jsonl" "$test_root/unknown-log.before"
if unknown_output="$(node "$invalid_events_repo/scripts/resume.mjs" status --json 2>&1)"; then
  printf 'error: unknown control event was accepted\n' >&2
  exit 1
fi
grep -Fq 'unknown control event type at line 2: FutureControlEvent' <<<"$unknown_output"
if grep -Fq 'at file://' <<<"$unknown_output"; then printf 'error: unknown-event refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
cmp "$test_root/invalid-current.before" "$invalid_events_repo/docs/control/current.md"
cmp "$test_root/unknown-log.before" "$invalid_events_repo/docs/control/resume.jsonl"
printf '%s\n' \
  '{"schemaVersion":1,"type":"WorkOrderActivated","workOrderId":"WO-088","workOrderPath":"docs/work-orders/WO-088-fixture.md"}' \
  '{' >"$invalid_events_repo/docs/control/resume.jsonl"
cp -- "$invalid_events_repo/docs/control/resume.jsonl" "$test_root/malformed-log.before"
if malformed_output="$(node "$invalid_events_repo/scripts/resume.mjs" status --json 2>&1)"; then
  printf 'error: malformed control event was accepted\n' >&2
  exit 1
fi
grep -Fq 'invalid control event at line 2' <<<"$malformed_output"
if grep -Fq 'at file://' <<<"$malformed_output"; then printf 'error: malformed-event refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
cmp "$test_root/invalid-current.before" "$invalid_events_repo/docs/control/current.md"
cmp "$test_root/malformed-log.before" "$invalid_events_repo/docs/control/resume.jsonl"

printf 'resume tests passed\n'
