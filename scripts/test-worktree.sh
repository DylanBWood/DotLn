#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
test_root="$(mktemp -d /private/tmp/dotln-worktree-test.XXXXXX)"
cleanup() { case "$test_root" in /private/tmp/dotln-worktree-test.*) rm -rf -- "$test_root" ;; *) exit 1 ;; esac; }
trap cleanup EXIT INT TERM

git init --bare "$test_root/origin.git" >/dev/null
git clone "$test_root/origin.git" "$test_root/project" >/dev/null 2>&1
main="$test_root/project"
git -C "$main" config user.email test@example.invalid
git -C "$main" config user.name "DotLn Test"
git -C "$main" switch -c main >/dev/null 2>&1
mkdir -p "$main/scripts" "$main/docs/work-orders" "$main/docs/control"
cp "$script_dir/worktree.mjs" "$script_dir/resume.mjs" "$main/scripts/"
printf '# fixture\n' >"$main/docs/work-orders/WO-099-fixture.md"
printf '{"private":true,"scripts":{}}\n' >"$main/package.json"
cp "$script_dir/../.gitignore" "$main/.gitignore"
git -C "$main" add .
git -C "$main" commit -m initial >/dev/null
git -C "$main" push -u origin main >/dev/null 2>&1

if node "$main/scripts/worktree.mjs" start XX-098 docs/work-orders/WO-099-fixture.md >/dev/null 2>&1; then printf 'error: invalid id accepted\n' >&2; exit 1; fi
test ! -e "$test_root/project-wo098"
test "$(git -C "$main" branch --list wo-098)" = ""

mkdir -p "$test_root/bin"
printf '#!/usr/bin/env bash\nprintf invoked >"%s"\n' "$test_root/codex-invoked" >"$test_root/bin/codex"
chmod +x "$test_root/bin/codex"
start_output="$(PATH="$test_root/bin:$PATH" node "$main/scripts/worktree.mjs" start WO-099 docs/work-orders/WO-099-fixture.md)"
subject="$test_root/project-wo099"
test -d "$subject"
grep -q '"workOrderId":"WO-099"' "$subject/docs/control/resume.jsonl"
grep -Fq "cd '$subject'" <<<"$start_output"
grep -Fq '  codex' <<<"$start_output"
grep -Fq 'resume: next' <<<"$start_output"
test ! -e "$test_root/codex-invoked"
if node "$main/scripts/worktree.mjs" finish WO-099 >/dev/null 2>&1; then printf 'error: unfinished worktree merged\n' >&2; exit 1; fi

node "$subject/scripts/resume.mjs" implementation-ready >/dev/null
node "$subject/scripts/resume.mjs" verify >/dev/null
mkdir -p "$subject/docs/verifications/WO-099"
printf '# verification pass\n' >"$subject/docs/verifications/WO-099/VER-001.md"
node "$subject/scripts/resume.mjs" verification-result pass >/dev/null
node "$subject/scripts/resume.mjs" final-review >/dev/null
mkdir -p "$subject/docs/final-reviews/WO-099"
printf '# final pass\n' >"$subject/docs/final-reviews/WO-099/FINAL-001.md"
node "$subject/scripts/resume.mjs" final-review-result pass >/dev/null
printf 'done\n' >"$subject/result.txt"
printf 'PR body\n' >"$subject/pr-body.md"
printf '#!/usr/bin/env node\n' >"$subject/scripts/release.mjs"
git -C "$subject" add .
git -C "$subject" commit -m complete >/dev/null

node_bin="$(command -v node)"
git_bin="$(command -v git)"
mkdir -p "$test_root/no-gh-bin"
ln -s "$git_bin" "$test_root/no-gh-bin/git"
ln -s "$node_bin" "$test_root/no-gh-bin/node"
if missing_gh_output="$(PATH="$test_root/no-gh-bin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then printf 'error: publish accepted a missing gh executable\n' >&2; exit 1; fi
grep -Fq 'gh is required before any remote mutation' <<<"$missing_gh_output"
if grep -Fq 'at file://' <<<"$missing_gh_output"; then printf 'error: missing-gh refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
if git --git-dir="$test_root/origin.git" show-ref --verify --quiet refs/heads/wo-099; then printf 'error: branch pushed before gh preflight\n' >&2; exit 1; fi

printf '#!/usr/bin/env bash\nprintf "https://example.invalid/pr/99\\n"\n' >"$test_root/bin/gh"
chmod +x "$test_root/bin/gh"
mkdir -p "$test_root/outside"
printf 'secret\n' >"$test_root/outside/secret.md"
ln -s "$test_root/outside" "$subject/link"
if PATH="$test_root/bin:$PATH" node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file link/secret.md >/dev/null 2>&1; then printf 'error: symlinked PR body accepted\n' >&2; exit 1; fi
rm -- "$subject/link"
if PATH="$test_root/bin:$PATH" node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file ../outside.md >/dev/null 2>&1; then printf 'error: outside PR body accepted\n' >&2; exit 1; fi
git -C "$subject" tag -a v7.7.7 -m 'unrelated local annotated tag'
git -C "$subject" config push.followTags true
publish_output="$(PATH="$test_root/bin:$PATH" node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md)"
test "$(git -C "$subject" rev-parse wo-099)" = "$(git --git-dir="$test_root/origin.git" rev-parse refs/heads/wo-099)"
remote_refs="$(git --git-dir="$test_root/origin.git" for-each-ref --format='%(refname)' | LC_ALL=C sort)"
test "$remote_refs" = $'refs/heads/main\nrefs/heads/wo-099'
grep -Fq "cd '$main'" <<<"$publish_output"
grep -Fq "'$node_bin' '$subject/scripts/release.mjs' close WO-099 --publish" <<<"$publish_output"
git -C "$subject" config --unset push.followTags
git -C "$subject" tag -d v7.7.7 >/dev/null
if node "$main/scripts/worktree.mjs" finish WO-099 >/dev/null 2>&1; then printf 'error: unmerged PR cleaned up\n' >&2; exit 1; fi

git -C "$main" fetch origin wo-099 >/dev/null 2>&1
git -C "$main" merge --ff-only origin/wo-099 >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
printf 'SECRET=fixture-only\n' >"$subject/.env"
printf 'disposable build state\n' >"$subject/tsconfig.tsbuildinfo"
if finish_output="$(node "$main/scripts/worktree.mjs" finish WO-099 2>&1)"; then printf 'error: ignored secret was deleted\n' >&2; exit 1; fi
grep -Fq '.env' <<<"$finish_output"
grep -Fq 'npm run backup:intake' <<<"$finish_output"
if grep -Fq 'SECRET=fixture-only' <<<"$finish_output"; then printf 'error: ignored-file content leaked in refusal\n' >&2; exit 1; fi
test -f "$subject/.env"
test -f "$subject/tsconfig.tsbuildinfo"
test -d "$subject"
test -n "$(git -C "$main" branch --list wo-099)"
rm -- "$subject/.env" "$subject/tsconfig.tsbuildinfo"
mkdir -p "$subject/docs/intake"
printf 'raw local note\n' >"$subject/docs/intake/raw.md"
if intake_output="$(node "$main/scripts/worktree.mjs" finish WO-099 2>&1)"; then printf 'error: ignored material was deleted\n' >&2; exit 1; fi
grep -Fq 'docs/intake/raw.md' <<<"$intake_output"
grep -Fq 'npm run backup:intake' <<<"$intake_output"
test -f "$subject/docs/intake/raw.md"
rm -f -- "$subject/docs/intake/raw.md"
rmdir -- "$subject/docs/intake"
mkdir -p "$subject/node_modules/fixture" "$subject/packages/example/dist"
printf 'disposable\n' >"$subject/node_modules/fixture/file"
printf 'generated\n' >"$subject/packages/example/dist/file"
printf 'finder metadata\n' >"$subject/.DS_Store"
printf 'disposable build state\n' >"$subject/tsconfig.tsbuildinfo"
git -C "$subject" branch --unset-upstream
node "$main/scripts/worktree.mjs" finish WO-099 >/dev/null
test ! -e "$subject"
test "$(git -C "$main" branch --list wo-099)" = ""
test -f "$main/result.txt"
test "$(git -C "$main" status --porcelain)" = ""
printf 'worktree tests passed\n'
