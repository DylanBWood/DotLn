#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "$0")" && pwd -P)"
test_root="$(mktemp -d /private/tmp/dotln-publication-test.XXXXXX)"
fixture_repo="$test_root/repo"
node_bin="$(command -v node)"
tick="$(printf '\140')"
fence3="$(printf '\140\140\140')"
fence4="$(printf '\140\140\140\140')"
zero_lock="$(printf '%064d' 0)"

cleanup() {
  case "$test_root" in
    /private/tmp/dotln-publication-test.*) rm -rf -- "$test_root" ;;
    *) printf 'error: refusing unsafe publication-test cleanup target\n' >&2 ;;
  esac
}
trap cleanup EXIT INT TERM

mkdir -p -- "$fixture_repo/scripts" "$fixture_repo/docs/product" "$fixture_repo/docs/publication"
cp -- "$script_dir/check-publication.mjs" "$fixture_repo/scripts/check-publication.mjs"

{
  printf '%s\n' '# Fixture' ''
  printf '%s%s\n' "$fence4" 'markdown'
  printf '%s\n' '## Hidden in outer fence'
  printf '%s\n' "$fence3"
  printf '%s\n' '## Still hidden after the short inner fence'
  printf '%s\n' "$fence4"
  printf '%s\n' \
    '' \
    '## After fence' \
    '' \
    '## The resume_state field' \
    '' \
    '## [Outer [resume_state]](guide_(one).md)' \
    '' \
    '## [Reference resume_state][reference]' \
    '' \
    '## Use resume_state with _care_' \
    '' \
    '## Echo' \
    '' \
    '## Echo' \
    '' \
    '## Echo 1' \
    '' \
    '## Echo-1' \
    '' \
    '## Echo' \
    '' \
    '[reference]: guide.md'
} >"$fixture_repo/docs/product/00-fixture.md"

git -C "$fixture_repo" init -q
git -C "$fixture_repo" config user.email test@example.invalid
git -C "$fixture_repo" config user.name "DotLn Publication Test"
git -C "$fixture_repo" add docs/product/00-fixture.md
git -C "$fixture_repo" commit -qm 'fixture source'
revision="$(git -C "$fixture_repo" rev-parse HEAD)"

{
  printf '%s\n' \
    '# Audience and status index' \
    '' \
    '| Section | Audiences | Status |' \
    '| --- | --- | --- |' \
    '| [Fixture](../product/00-fixture.md#fixture) | everyday-ai-user, software-engineer | specified |' \
    '| [After fence](../product/00-fixture.md#after-fence) | everyday-ai-user, software-engineer | specified |' \
    '| [The resume_state field](../product/00-fixture.md#the-resume_state-field) | everyday-ai-user, software-engineer | specified |' \
    '| [Outer resume_state](../product/00-fixture.md#outer-resume_state) | everyday-ai-user, software-engineer | specified |' \
    '| [Reference resume_state](../product/00-fixture.md#reference-resume_state) | everyday-ai-user, software-engineer | specified |' \
    '| [Use resume_state with care](../product/00-fixture.md#use-resume_state-with-care) | everyday-ai-user, software-engineer | specified |' \
    '| [Echo](../product/00-fixture.md#echo) | everyday-ai-user, software-engineer | specified |' \
    '| [Echo](../product/00-fixture.md#echo-1) | everyday-ai-user, software-engineer | specified |' \
    '| [Echo 1](../product/00-fixture.md#echo-1-1) | everyday-ai-user, software-engineer | specified |' \
    '| [Echo-1](../product/00-fixture.md#echo-1-2) | everyday-ai-user, software-engineer | specified |' \
    '| [Echo](../product/00-fixture.md#echo-2) | everyday-ai-user, software-engineer | specified |'
} >"$fixture_repo/docs/publication/audience-status-index.md"

{
  printf '%s\n' '# Base outline' ''
  printf 'Source base revision: %s%s%s\n' "$tick" "$revision" "$tick"
  printf '%s\n' '' '[Fixture](../product/00-fixture.md#fixture)'
} >"$fixture_repo/docs/publication/base-outline.md"

{
  printf '%s\n' '# Dual voice sample' ''
  printf 'Source base revision: %s%s%s\n' "$tick" "$revision" "$tick"
  printf '%s\n' \
    '' \
    '## Everyday AI-user voice' \
    '' \
    '[Fixture](../product/00-fixture.md#fixture)' \
    '' \
    '## Software-engineer voice' \
    '' \
    '[Fixture](../product/00-fixture.md#fixture)'
} >"$fixture_repo/docs/publication/dual-voice-sample.md"

write_edition() {
  local path="$1"
  {
    printf '%s\n' '# Fixture edition' ''
    printf 'Source base revision: %s%s%s\n' "$tick" "$revision" "$tick"
    printf 'Source lock: %ssha256:%s%s\n' "$tick" "$zero_lock" "$tick"
    printf '%s\n' '' '[Fixture](../product/00-fixture.md#fixture)'
  } >"$path"
}
write_edition "$fixture_repo/docs/publication/everyday-ai-user-toc.md"
write_edition "$fixture_repo/docs/publication/software-engineer-toc.md"

lock_output="$("$node_bin" "$fixture_repo/scripts/check-publication.mjs" --print-locks)"
everyday_lock="$(printf '%s\n' "$lock_output" | sed -n 's/^LOCK everyday-ai-user-toc.md: sha256://p')"
engineer_lock="$(printf '%s\n' "$lock_output" | sed -n 's/^LOCK software-engineer-toc.md: sha256://p')"
test "$(printf '%s' "$everyday_lock" | wc -c | tr -d ' ')" = 64
test "$(printf '%s' "$engineer_lock" | wc -c | tr -d ' ')" = 64

replace_lock() {
  "$node_bin" -e '
    const fs = require("node:fs");
    const path = process.argv[1];
    const lock = process.argv[2];
    fs.writeFileSync(path, fs.readFileSync(path, "utf8").replace(/0{64}/, lock));
  ' "$1" "$2"
}
replace_lock "$fixture_repo/docs/publication/everyday-ai-user-toc.md" "$everyday_lock"
replace_lock "$fixture_repo/docs/publication/software-engineer-toc.md" "$engineer_lock"

run_checker() {
  "$node_bin" "$fixture_repo/scripts/check-publication.mjs" "$@"
}

expect_failure() {
  local expected="$1"
  shift
  local output
  if output="$(run_checker "$@" 2>&1)"; then
    printf 'error: publication checker unexpectedly succeeded\n' >&2
    exit 1
  fi
  grep -Fq "$expected" <<<"$output"
}

baseline_output="$(run_checker)"
grep -Fq 'PASS index coverage: 11/11 product headings indexed' <<<"$baseline_output"
grep -Fq 'PASS publication bootstrap checks' <<<"$baseline_output"
if grep -Fq 'hidden' <<<"$baseline_output"; then
  printf 'error: fenced headings leaked into publication coverage\n' >&2
  exit 1
fi

index_path="$fixture_repo/docs/publication/audience-status-index.md"
cp -- "$index_path" "$test_root/index.backup"
"$node_bin" -e '
  const fs = require("node:fs");
  const path = process.argv[1];
  const lines = fs.readFileSync(path, "utf8").split("\n");
  fs.writeFileSync(path, lines.filter((line) => !line.includes("#the-resume_state-field)")).join("\n"));
' "$index_path"
expect_failure 'missing 00-fixture.md#the-resume_state-field'
cp -- "$test_root/index.backup" "$index_path"

"$node_bin" -e '
  const fs = require("node:fs");
  const path = process.argv[1];
  const value = fs.readFileSync(path, "utf8").replace("The resume_state field", "The resumestate field");
  fs.writeFileSync(path, value);
' "$index_path"
expect_failure 'label does not match source heading'
cp -- "$test_root/index.backup" "$index_path"

expect_failure 'expected every edition to be stale' --expect-stale
product_path="$fixture_repo/docs/product/00-fixture.md"
cp -- "$product_path" "$test_root/product.backup"
printf '\nChanged fixture claim.\n' >>"$product_path"
expect_failure '2 edition(s) are stale'
stale_output="$(run_checker --expect-stale)"
grep -Fq 'PASS expected-stale proof: 2/2 editions flagged stale' <<<"$stale_output"
mv -- "$test_root/product.backup" "$product_path"
run_checker >/dev/null

set +e
unknown_output="$(run_checker --unknown 2>&1)"
unknown_status=$?
set -e
test "$unknown_status" = 2
grep -Fq 'Unknown argument(s): --unknown' <<<"$unknown_output"

printf 'publication checker tests passed\n'
