#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
test_root="$(mktemp -d /private/tmp/dotln-checkpoint-test.XXXXXX)"
fixture_repo="$test_root/repo"
saved="$test_root/saved"
cleanup() { case "$test_root" in /private/tmp/dotln-checkpoint-test.*) rm -rf -- "$test_root" ;; *) exit 1 ;; esac; }
trap cleanup EXIT INT TERM

git init "$fixture_repo" >/dev/null
git -C "$fixture_repo" config user.email test@example.invalid
git -C "$fixture_repo" config user.name "DotLn Test"
mkdir -p "$fixture_repo/scripts" "$fixture_repo/docs/work-orders"
cp -- "$script_dir/resume.mjs" "$fixture_repo/scripts/resume.mjs"
cp -- "$script_dir/../.gitignore" "$fixture_repo/.gitignore"
printf '# fixture\n' >"$fixture_repo/docs/work-orders/WO-099-fixture.md"
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
node "$fixture_repo/scripts/resume.mjs" implementation-ready >/dev/null
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

printf 'checkpoint tests passed\n'
