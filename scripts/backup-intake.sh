#!/usr/bin/env bash
set -euo pipefail
umask 077

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd -- "$script_dir/.." && pwd -P)"
intake_dir="$repo_root/docs/intake"
project_name="$(basename -- "$repo_root")"
output_dir="${1:-$(dirname -- "$repo_root")}"

if [[ ! -d "$intake_dir" ]]; then
  printf 'error: intake directory not found: %s\n' "$intake_dir" >&2
  exit 1
fi

if ! command -v zip >/dev/null 2>&1 || ! command -v unzip >/dev/null 2>&1; then
  printf 'error: zip and unzip are required\n' >&2
  exit 1
fi

if find "$intake_dir" -type l -print -quit | grep -q .; then
  printf 'error: docs/intake contains a symbolic link; refusing to archive it\n' >&2
  exit 1
fi

mkdir -p -- "$output_dir"
output_dir="$(cd -- "$output_dir" && pwd -P)"
case "$output_dir/" in
  "$repo_root/"*)
    printf 'error: backup destination must be outside the repository\n' >&2
    exit 1
    ;;
esac
timestamp="${DOTLN_BACKUP_TIMESTAMP:-$(date -u '+%Y%m%dT%H%M%SZ')}"
if [[ ! "$timestamp" =~ ^[0-9]{8}T[0-9]{6}Z$ ]]; then
  printf 'error: invalid backup timestamp\n' >&2
  exit 1
fi
archive="$output_dir/${project_name}-intake-$timestamp.zip"
partial="$archive.partial.$$"

if [[ -e "$archive" || -e "$partial" ]]; then
  printf 'error: backup target already exists; retry in one second\n' >&2
  exit 1
fi

cleanup() { rm -f -- "$partial"; }
trap cleanup EXIT INT TERM

(
  cd -- "$repo_root"
  zip -qr "$partial" docs/intake -x '*/.DS_Store'
)
unzip -tq "$partial" >/dev/null
chmod 600 "$partial"
mv -- "$partial" "$archive"
trap - EXIT INT TERM

file_count="$(find "$intake_dir" -type f ! -name '.DS_Store' | wc -l | tr -d ' ')"
printf 'Created %s (%s files)\n' "$archive" "$file_count"
