#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "$script_dir/test-temp-root.sh"
tmp_base="${TMPDIR:-/tmp}"
tmp_base="$(resolve_test_tmp_base "$tmp_base")"
test_root_prefix="dotln-intake-backup-test"
create_test_temp_root "$tmp_base" "$test_root_prefix"
test_root="$test_temp_root_result"
install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"
fixture_repo="$test_root/fixture-repo"
output_dir="$test_root/backups"
archive="$output_dir/fixture-repo-intake-20000101T000000Z.zip"

mkdir -p -- "$fixture_repo/scripts" "$fixture_repo/docs/intake/chats" "$fixture_repo/docs/intake/notes" "$output_dir"
cp -- "$script_dir/backup-intake.sh" "$fixture_repo/scripts/backup-intake.sh"
printf 'alpha\nsecond line\n\n' >"$fixture_repo/docs/intake/notes/note.txt"
printf 'public sentinel excluded from intake backup\n' >"$fixture_repo/docs/outside.txt"
printf 'beta\n' >"$fixture_repo/docs/intake/chats/chat one.txt"
printf 'hidden\n' >"$fixture_repo/docs/intake/.hidden"
printf 'excluded\n' >"$fixture_repo/docs/intake/.DS_Store"

backup_output="$(DOTLN_BACKUP_TIMESTAMP=20000101T000000Z "$fixture_repo/scripts/backup-intake.sh" "$output_dir")"
grep -Fq '(3 files)' <<<"$backup_output"
test -f "$archive"
test "$(stat -f '%Lp' "$archive")" = "600"
unzip -tq "$archive" >/dev/null

expected_files="$(printf '%s\n' 'docs/intake/.hidden' 'docs/intake/chats/chat one.txt' 'docs/intake/notes/note.txt' | sort)"
archived_files="$(unzip -Z1 "$archive" | awk '!/\/$/ { print }' | sort)"
test "$archived_files" = "$expected_files"
extracted="$test_root/extracted"
unzip -q "$archive" -d "$extracted"
test ! -e "$extracted/docs/outside.txt"
test ! -e "$extracted/docs/intake/.DS_Store"
while IFS= read -r path; do
  cmp "$extracted/$path" "$fixture_repo/$path"
done <<<"$expected_files"
newline_path=$'docs/intake/notes/new\nline.txt'
printf 'newline filename contents\nsecond line\n' >"$fixture_repo/$newline_path"
newline_output="$(DOTLN_BACKUP_TIMESTAMP=20000101T000003Z "$fixture_repo/scripts/backup-intake.sh" "$output_dir")"
grep -Fq '(4 files)' <<<"$newline_output"
unzip -q^ "$output_dir/fixture-repo-intake-20000101T000003Z.zip" -d "$test_root/newline-extracted"
cmp "$fixture_repo/$newline_path" "$test_root/newline-extracted/$newline_path"

if DOTLN_BACKUP_TIMESTAMP=20000101T000000Z "$fixture_repo/scripts/backup-intake.sh" "$output_dir" >/dev/null 2>&1; then
  printf 'error: backup script overwrote an existing archive\n' >&2
  exit 1
fi

ln -s -- "$fixture_repo/does-not-belong.txt" "$fixture_repo/docs/intake/outside"
if DOTLN_BACKUP_TIMESTAMP=20000101T000001Z "$fixture_repo/scripts/backup-intake.sh" "$output_dir" >/dev/null 2>&1; then
  printf 'error: backup script accepted a symbolic link\n' >&2
  exit 1
fi
rm -- "$fixture_repo/docs/intake/outside"

if DOTLN_BACKUP_TIMESTAMP=20000101T000002Z "$fixture_repo/scripts/backup-intake.sh" "$fixture_repo/backups" >/dev/null 2>&1; then
  printf 'error: backup script accepted a destination inside the repository\n' >&2
  exit 1
fi

printf 'backup-intake tests passed\n'
