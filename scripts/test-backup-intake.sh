#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
test_root="$(mktemp -d /private/tmp/dotln-intake-backup-test.XXXXXX)"
fixture_repo="$test_root/fixture-repo"
output_dir="$test_root/backups"
archive="$output_dir/fixture-repo-intake-20000101T000000Z.zip"

cleanup() {
  case "$test_root" in
    /private/tmp/dotln-intake-backup-test.*) rm -rf -- "$test_root" ;;
    *) printf 'error: refusing unsafe test cleanup target\n' >&2 ;;
  esac
}
trap cleanup EXIT INT TERM

mkdir -p -- "$fixture_repo/scripts" "$fixture_repo/docs/intake/chats" "$fixture_repo/docs/intake/notes" "$output_dir"
cp -- "$script_dir/backup-intake.sh" "$fixture_repo/scripts/backup-intake.sh"
printf 'alpha\n' >"$fixture_repo/docs/intake/notes/note.txt"
printf 'beta\n' >"$fixture_repo/docs/intake/chats/chat one.txt"
printf 'hidden\n' >"$fixture_repo/docs/intake/.hidden"
printf 'excluded\n' >"$fixture_repo/docs/intake/.DS_Store"

DOTLN_BACKUP_TIMESTAMP=20000101T000000Z "$fixture_repo/scripts/backup-intake.sh" "$output_dir" >/dev/null
test -f "$archive"
test "$(stat -f '%Lp' "$archive")" = "600"
unzip -tq "$archive" >/dev/null

expected_files="$(printf '%s\n' 'docs/intake/.hidden' 'docs/intake/chats/chat one.txt' 'docs/intake/notes/note.txt' | sort)"
archived_files="$(unzip -Z1 "$archive" | awk '!/\/$/ && $0 !~ /\/\.DS_Store$/ { print }' | sort)"
test "$archived_files" = "$expected_files"
while IFS= read -r path; do
  test "$(unzip -p "$archive" "$path")" = "$(tr -d '\n' <"$fixture_repo/$path")"
done <<<"$expected_files"

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
