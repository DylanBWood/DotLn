#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
test_root="$(mktemp -d /private/tmp/dotln-resume-test.XXXXXX)"
fixture_repo="$test_root/repo"
cleanup() { case "$test_root" in /private/tmp/dotln-resume-test.*) rm -rf -- "$test_root" ;; *) exit 1 ;; esac; }
trap cleanup EXIT INT TERM

mkdir -p -- "$fixture_repo/scripts" "$fixture_repo/docs/work-orders"
cp -- "$script_dir/resume.mjs" "$fixture_repo/scripts/resume.mjs"
printf '# fixture\n' >"$fixture_repo/docs/work-orders/WO-099-fixture.md"
mkdir -p "$fixture_repo/docs/verifications/WO-099" "$fixture_repo/docs/final-reviews/WO-099"
printf '# existing verification\n' >"$fixture_repo/docs/verifications/WO-099/VER-001.md"
printf '# existing final review\n' >"$fixture_repo/docs/final-reviews/WO-099/FINAL-001.md"
run() { node "$fixture_repo/scripts/resume.mjs" "$@" >/dev/null 2>/dev/null; }
event_count() { if [[ -f "$fixture_repo/docs/control/resume.jsonl" ]]; then wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' '; else printf '0\n'; fi; }
refuse_next() {
  local before output
  before="$(event_count)"
  if output="$(node "$fixture_repo/scripts/resume.mjs" next 2>&1)"; then printf 'error: next accepted outside active/closed\n' >&2; exit 1; fi
  grep -Fq 'run:' <<<"$output"
  if grep -Fq 'at file://' <<<"$output"; then printf 'error: next refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
  test "$(event_count)" = "$before"
}

refuse_next
activate_warning="$(node "$fixture_repo/scripts/resume.mjs" activate WO-099 docs/work-orders/WO-099-fixture.md 2>&1 >/dev/null)"
grep -q 'warning: could not create recovery checkpoint.*not a git repository' <<<"$activate_warning"
grep -Fq 'Latest checkpoint: unavailable for the latest transition; do not use an older checkpoint' "$fixture_repo/docs/control/current.md"
before_active_next="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
active_next="$(node "$fixture_repo/scripts/resume.mjs" next)"
grep -Fq 'docs/work-orders/WO-099-fixture.md' <<<"$active_next"
grep -Fq 'npm run resume -- implementation-ready' <<<"$active_next"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_active_next"
grep -q 'Legal next actions: next, implementation-ready' "$fixture_repo/docs/control/current.md"
if refused="$(node "$fixture_repo/scripts/resume.mjs" verify 2>&1)"; then printf 'error: illegal active verification accepted\n' >&2; exit 1; fi
grep -Fq 'npm run resume -- next' <<<"$refused"
if grep -Fq 'at file://' <<<"$refused"; then printf 'error: refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
run implementation-ready
refuse_next
run verify
refuse_next
grep -q 'VER-002.md' "$fixture_repo/docs/control/current.md"
before_invalid="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
if run final-review 2>/dev/null; then printf 'error: illegal transition accepted\n' >&2; exit 1; fi
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_invalid"
if run verification-result fail 2>/dev/null; then printf 'error: missing verification report accepted\n' >&2; exit 1; fi
printf '# fail\n' >"$fixture_repo/docs/verifications/WO-099/VER-002.md"
run verification-result fail
refuse_next
run fix
refuse_next
run repair-complete
run verify
grep -q 'VER-003.md' "$fixture_repo/docs/control/current.md"
printf '# pass\n' >"$fixture_repo/docs/verifications/WO-099/VER-003.md"
run verification-result pass
refuse_next
run final-review
refuse_next
grep -q 'FINAL-002.md' "$fixture_repo/docs/control/current.md"
printf '# failed final\n' >"$fixture_repo/docs/final-reviews/WO-099/FINAL-002.md"
run final-review-result fail
node "$fixture_repo/scripts/resume.mjs" fix 2>/dev/null | grep -q 'FINAL-002.md'
run repair-complete
run verify
grep -q 'VER-004.md' "$fixture_repo/docs/control/current.md"
printf '# repaired pass\n' >"$fixture_repo/docs/verifications/WO-099/VER-004.md"
run verification-result pass
run final-review
grep -q 'FINAL-003.md' "$fixture_repo/docs/control/current.md"
printf '# pass\n' >"$fixture_repo/docs/final-reviews/WO-099/FINAL-003.md"
final_pass_output="$(node "$fixture_repo/scripts/resume.mjs" final-review-result pass 2>/dev/null)"
grep -Fq 'npm run worktree -- publish WO-099 --title <title> --body-file <contained-reviewed-body-path>' <<<"$final_pass_output"
closed_next="$(node "$fixture_repo/scripts/resume.mjs" next)"
grep -Fq 'between work orders' <<<"$closed_next"
grep -Fq 'npm run worktree -- start' <<<"$closed_next"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "16"
grep -q 'Phase: closed' "$fixture_repo/docs/control/current.md"
test "$(grep -c '"verificationId":"VER-002"' "$fixture_repo/docs/control/resume.jsonl")" = "2"
test "$(grep -c '"verificationId":"VER-003"' "$fixture_repo/docs/control/resume.jsonl")" = "2"
before_status_mtime="$(stat -f %m "$fixture_repo/docs/control/current.md")"
node "$fixture_repo/scripts/resume.mjs" status | grep -q 'Legal next actions: release-close, next, activate'
test "$(stat -f %m "$fixture_repo/docs/control/current.md")" = "$before_status_mtime"
before_release_close="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
release_close_output="$(node "$fixture_repo/scripts/resume.mjs" release-close)"
grep -Fq 'npm run release -- close WO-099 --publish' <<<"$release_close_output"
grep -Fq 'never push main' <<<"$release_close_output"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_release_close"
before_bad_activate="$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')"
if run activate WO-100 docs/work-orders/WO-100-next.md 2>/dev/null; then printf 'error: nonexistent work order activated\n' >&2; exit 1; fi
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_bad_activate"
mkdir -p "$test_root/outside"
printf '# outside\n' >"$test_root/outside/WO-101-outside.md"
ln -s "$test_root/outside" "$fixture_repo/docs/work-orders/link"
if run activate WO-101 docs/work-orders/link/WO-101-outside.md 2>/dev/null; then printf 'error: symlinked work order activated\n' >&2; exit 1; fi
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "$before_bad_activate"
printf '# next\n' >"$fixture_repo/docs/work-orders/WO-100-next.md"
run activate WO-100 docs/work-orders/WO-100-next.md
grep -q 'Work order: WO-100' "$fixture_repo/docs/control/current.md"
test "$(wc -l <"$fixture_repo/docs/control/resume.jsonl" | tr -d ' ')" = "17"
printf 'resume tests passed\n'
