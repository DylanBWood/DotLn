#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "$script_dir/test-temp-root.sh"
tmp_base="${TMPDIR:-/tmp}"
tmp_base="$(resolve_test_tmp_base "$tmp_base")"
test_root_prefix="dotln-worktree-test"
create_test_temp_root "$tmp_base" "$test_root_prefix"
test_root="$test_temp_root_result"
install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"
node_bin="$(command -v node)"
real_git="$(command -v git)"
u202f="$(printf '\342\200\257')"
assert_u202f() {
  "$node_bin" -e 'if (!Buffer.from(process.argv[1], "utf8").toString("hex").includes("e280af")) process.exit(1)' "$1"
}
test "$("$node_bin" -e 'process.stdout.write(Buffer.from(process.argv[1], "utf8").toString("hex"))' "$u202f")" = e280af

git init --bare "$test_root/origin.git" >/dev/null
git clone "$test_root/origin.git" "$test_root/project" >/dev/null 2>&1
main="$test_root/project"
git -C "$main" config user.email test@example.invalid
git -C "$main" config user.name "DotLn Test"
git -C "$main" config core.quotePath true
github_repo="dotln-fixture/worktree"
github_origin="https://github.com/$github_repo.git"
git -C "$main" config "url.$test_root/origin.git.insteadOf" "$github_origin"
git -C "$main" remote set-url origin "$github_origin"
git -C "$main" switch -c main >/dev/null 2>&1
mkdir -p "$main/scripts" "$main/docs/work-orders" "$main/docs/control" "$main/packages/kernel"
cp "$script_dir/worktree.mjs" "$script_dir/resume.mjs" "$script_dir/release.mjs" "$script_dir/release-notes.mjs" "$script_dir/github-repository.mjs" "$script_dir/github-body.mjs" "$main/scripts/"
printf '# WO-099 — worktree fixture, v0.2.1\n\n**Objective:** Exercise publication.\n\n**Non-goals:** No release.\n' >"$main/docs/work-orders/WO-099-fixture.md"
printf '%s\n' \
  '# Fixture repository' \
  '' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  '' \
  'This source is DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
printf '{"private":true,"scripts":{}}\n' >"$main/package.json"
printf '{"name":"@dotln/kernel","version":"0.1.0"}\n' >"$main/packages/kernel/package.json"
cp "$script_dir/../.gitignore" "$main/.gitignore"
printf 'EXAMPLE=tracked\n' >"$main/.env.example"
git -C "$main" add .
git -C "$main" commit -m initial >/dev/null
git -C "$main" push -u origin main >/dev/null 2>&1

if node "$main/scripts/worktree.mjs" start XX-098 docs/work-orders/WO-099-fixture.md >/dev/null 2>&1; then printf 'error: invalid id accepted\n' >&2; exit 1; fi
test ! -e "$test_root/project-wo098"
test "$(git -C "$main" branch --list wo-098)" = ""

mkdir -p "$test_root/bin"
printf '%s\n' \
  '#!/bin/bash' \
  'set -euo pipefail' \
  "real_git='$real_git'" \
  'if [[ "$#" -eq 6 && "$1" == "-C" && "$3" == "remote" && "$4" == "get-url" && "$5" == "--all" && "$6" == "origin" ]]; then' \
  '  $real_git -C "$2" config --get-all remote.origin.url' \
  '  exit 0' \
  'fi' \
  'if [[ "$#" -eq 7 && "$1" == "-C" && "$3" == "remote" && "$4" == "get-url" && "$5" == "--push" && "$6" == "--all" && "$7" == "origin" ]]; then' \
  '  urls="$($real_git -C "$2" config --get-all remote.origin.pushurl || true)"' \
  '  if [[ -z "$urls" ]]; then urls="$($real_git -C "$2" config --get-all remote.origin.url)"; fi' \
  '  printf "%s\\n" "$urls"' \
  '  exit 0' \
  'fi' \
  'exec "$real_git" "$@"' >"$test_root/bin/git"
chmod +x "$test_root/bin/git"
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

git -C "$subject" add docs/control
git -C "$subject" commit -m 'active control fixture' >/dev/null
cp "$subject/docs/control/resume.jsonl" "$test_root/committed-active-resume.jsonl"
cp "$subject/docs/control/current.md" "$test_root/committed-active-current.md"
git -C "$subject" update-index --assume-unchanged docs/control/resume.jsonl docs/control/current.md
printf '%s\n' '{"schemaVersion":1,"type":"FinalReviewCompleted","workOrderId":"WO-099","finalReviewId":"FINAL-001","reportPath":"docs/final-reviews/WO-099/FINAL-001.md","verdict":"pass"}' >>"$subject/docs/control/resume.jsonl"
printf '%s\n' \
  '# Current control state' \
  '' \
  '- Work order: WO-099' \
  '- Work-order path: docs/work-orders/WO-099-fixture.md' \
  '- Phase: closed' >"$subject/docs/control/current.md"
if hidden_control_output="$(PATH="$test_root/bin:$PATH" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file missing.md 2>&1)"; then
  printf 'error: hidden working control state bypassed the committed phase gate\n' >&2
  exit 1
fi
grep -Fq 'committed surface check requires closed WO-099 control state; observed WO-099 in phase active' <<<"$hidden_control_output"
if git --git-dir="$test_root/origin.git" show-ref --verify --quiet refs/heads/wo-099; then printf 'error: hidden working control state reached the remote\n' >&2; exit 1; fi
cp "$test_root/committed-active-resume.jsonl" "$subject/docs/control/resume.jsonl"
cp "$test_root/committed-active-current.md" "$subject/docs/control/current.md"
git -C "$subject" update-index --no-assume-unchanged docs/control/resume.jsonl docs/control/current.md

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
printf '%s\n' 'This reviewed PR body stays on one physical source line even though it is longer than eighty characters, leaving visual wrapping to the reader.' >"$subject/pr-body.md"
git -C "$subject" add .
git -C "$subject" commit -m complete >/dev/null

mkdir -p "$test_root/no-gh-bin"
ln -s "$test_root/bin/git" "$test_root/no-gh-bin/git"
ln -s "$node_bin" "$test_root/no-gh-bin/node"
notes_path="docs/final-reviews/WO-099/RELEASE-NOTES.md"
assert_notes_refusal() {
  local expected="$1"
  if notes_output="$(PATH="$test_root/no-gh-bin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then
    printf 'error: publish accepted malformed release notes (%s)\n' "$expected" >&2
    exit 1
  fi
  grep -Fq "$notes_path" <<<"$notes_output"
  grep -Fq "$expected" <<<"$notes_output"
  if git --git-dir="$test_root/origin.git" show-ref --verify --quiet refs/heads/wo-099; then
    printf 'error: branch pushed before release-notes validation (%s)\n' "$expected" >&2
    exit 1
  fi
}
set_release_notes() {
  printf '%s' "$1" >"$subject/$notes_path"
  git -C "$subject" add "$notes_path"
  git -C "$subject" commit --amend --no-edit >/dev/null
}

printf '%s\n' \
  '# Fixture repository' \
  '' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  '' \
  'This source is DotLn `v0.2.0`.' \
  '<!-- DOTLN-RELEASE-END -->' >"$subject/README.md"
git -C "$subject" add README.md
git -C "$subject" commit --amend --no-edit >/dev/null
if surface_output="$(PATH="$test_root/no-gh-bin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then
  printf 'error: publish accepted a stale release block\n' >&2
  exit 1
fi
grep -Fq 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1' <<<"$surface_output"
if grep -Fq 'error:' <<<"$surface_output"; then printf 'error: worktree wrapped the surface report\n' >&2; exit 1; fi
if git --git-dir="$test_root/origin.git" show-ref --verify --quiet refs/heads/wo-099; then printf 'error: branch pushed before surface validation\n' >&2; exit 1; fi
printf '%s\n' \
  '# Fixture repository' \
  '' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  '' \
  'This source is DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-END -->' >"$subject/README.md"
git -C "$subject" add README.md
git -C "$subject" commit --amend --no-edit >/dev/null
printf 'worktree surface refusal preserved the checker report and mutated no remote\n'

assert_notes_refusal 'release-notes file is missing'
bom="$(printf '\357\273\277')"
set_release_notes "${bom}"$'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'missing required heading "## Release overview"'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n'
assert_notes_refusal 'missing required heading "## Evidence and compatibility"'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Extra section\n\nExtra.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'extra level-two heading "## Extra section"'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n  ## Extra visible heading\n\nExtra.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'level-two heading markers are allowed only as exact column-one section headings'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n> ## Extra quoted heading\n\nExtra.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'level-two heading markers are allowed only as exact column-one section headings'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n##\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'level-two heading markers are allowed only as exact column-one section headings'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Substantive changes\n\nDuplicate.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'duplicated required heading "## Substantive changes"'
set_release_notes $'## Release overview\n\nOverview.\n\n## Substantive changes\n\nChange.\n\n## Read before upgrading\n\nNone.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'required headings are misordered'
set_release_notes $'## Release overview\n\n   \n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'empty required section "## Release overview"'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\n   \n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'empty required section "## Read before upgrading"'
set_release_notes $'## Release overview\n\nOverview.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nDOTLN-MANIFEST-BEGIN\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'reserved tag marker line "DOTLN-MANIFEST-BEGIN"'
set_release_notes $'## Release overview\n\n<!-- hidden -->\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'HTML comments are not allowed in reviewed notes'
set_release_notes $'## Release overview\n\nOverview.\n\n<!--\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n-->'
assert_notes_refusal 'HTML comments are not allowed in reviewed notes'
set_release_notes $'## Release overview\n\nOverview.\n\nExtra\n-----\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'setext level-two headings are not allowed'
set_release_notes $'## Release overview\n\nOverview.\n\n> Extra\n> -----\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'setext level-two headings are not allowed'
set_release_notes $'## Release overview\n\nOverview.\n\n- list item\n\n    ## Extra list-continuation heading\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'level-two heading markers are allowed only as exact column-one section headings'
set_release_notes $'## Release overview\n\nOverview.\n\n<pre>\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n</pre>\n'
assert_notes_refusal 'raw HTML is not allowed in reviewed notes'
set_release_notes $'## Release overview\n\nOverview.\n\n<pre\n>\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'raw HTML is not allowed in reviewed notes'
set_release_notes $'## Release overview\n\nOverview.\n\n``` `\n## Extra visible heading\n```\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'extra level-two heading "## Extra visible heading"'
set_release_notes $'## Release overview\n\nOverview.\n\n\t```\n## Extra visible heading\n```\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'extra level-two heading "## Extra visible heading"'
set_release_notes $'## Release overview\n\nOverview mentioning the literal `## Example` text.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
set_release_notes $'## Release overview\n\nThis release overview was accidentally wrapped at a fixed source column even though it is one logical\nparagraph that the reader should wrap for its own viewport.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nChange.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
assert_notes_refusal 'accidental GitHub prose soft wrap'
set_release_notes $'## Release overview\n\nThis release overview stays on one physical source line even though it is longer than eighty characters, leaving visual wrapping to the reader.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\n- This substantive list-item paragraph also stays on one physical source line beyond eighty characters for a viewport-fluid GitHub body.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nEvidence.\n'
printf 'release-notes publish validation fixtures passed\n'

printf '%s\n' \
  'This reviewed PR body was accidentally wrapped at a fixed source column even though it is one logical' \
  'paragraph that the reader should wrap for its own viewport.' >"$subject/pr-body.md"
git -C "$subject" add pr-body.md
git -C "$subject" commit --amend --no-edit >/dev/null
if wrapped_pr_output="$(PATH="$test_root/no-gh-bin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then
  printf 'error: publish accepted a wrapped PR body\n' >&2
  exit 1
fi
grep -Fq 'pr-body.md: accidental GitHub prose soft wrap between lines 1 and 2' <<<"$wrapped_pr_output"
if git --git-dir="$test_root/origin.git" show-ref --verify --quiet refs/heads/wo-099; then printf 'error: wrapped PR body reached remote\n' >&2; exit 1; fi
printf '%s\n' 'This reviewed PR body stays on one physical source line even though it is longer than eighty characters, leaving visual wrapping to the reader.' >"$subject/pr-body.md"
git -C "$subject" add pr-body.md
git -C "$subject" commit --amend --no-edit >/dev/null
printf 'GitHub body profile refused wrapped PR and release-note prose before publication\n'

printf 'ignored private body\n' >"$subject/.env"
if ignored_body_output="$(PATH="$test_root/no-gh-bin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file .env 2>&1)"; then printf 'error: publish accepted an ignored untracked PR body\n' >&2; exit 1; fi
grep -Fq '.env: file is not tracked' <<<"$ignored_body_output"
test -f "$subject/.env"
rm -- "$subject/.env"

printf 'ignored pathspec body\n' >"$subject/.env.*"
if pathspec_body_output="$(PATH="$test_root/no-gh-bin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file '.env.*' 2>&1)"; then printf 'error: publish accepted an ignored pathspec-like PR body\n' >&2; exit 1; fi
grep -Fq '.env.*: file is not tracked' <<<"$pathspec_body_output"
test -f "$subject/.env.*"
rm -- "$subject/.env.*"

if missing_gh_output="$(PATH="$test_root/no-gh-bin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then printf 'error: publish accepted a missing gh executable\n' >&2; exit 1; fi
grep -Fq 'gh is required before any remote mutation' <<<"$missing_gh_output"
if grep -Fq 'at file://' <<<"$missing_gh_output"; then printf 'error: missing-gh refusal leaked a JavaScript stack trace\n' >&2; exit 1; fi
if git --git-dir="$test_root/origin.git" show-ref --verify --quiet refs/heads/wo-099; then printf 'error: branch pushed before gh preflight\n' >&2; exit 1; fi

gh_log="$test_root/gh.log"
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -euo pipefail' \
  'printf "%s\\n" "$*" >>"$DOTLN_GH_LOG"' \
  'if [[ -n "${GH_REPO:-}" || -n "${GH_HOST:-}" ]]; then printf "ambient GH target leaked\\n" >&2; exit 65; fi' \
  'if [[ "$*" == "--version" ]]; then printf "gh version fixture\\n"; exit 0; fi' \
  'if [[ "${1:-} ${2:-}" == "auth status" ]]; then' \
  '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "auth" ]]; then printf "not authenticated\\n" >&2; exit 4; fi' \
  '  printf "authenticated fixture\\n"; exit 0' \
  'fi' \
  'if [[ "${1:-} ${2:-}" == "pr create" ]]; then' \
  '  body_file=""' \
  '  while (( "$#" )); do if [[ "$1" == "--body-file" ]]; then body_file="$2"; shift 2; else shift; fi; done' \
  '  cp "$body_file" "$DOTLN_GH_BODY"' \
  '  printf "https://example.invalid/pr/99\\n"; exit 0' \
  'fi' \
  'printf "unexpected gh invocation: %s\\n" "$*" >&2' \
  'exit 64' >"$test_root/bin/gh"
chmod +x "$test_root/bin/gh"
: >"$gh_log"
git -C "$subject" remote set-url --push origin https://github.com/dotln-fixture/wrong-target.git
if split_origin_output="$(PATH="$test_root/bin:$PATH" DOTLN_GH_LOG="$gh_log" node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then printf 'error: publish accepted split fetch/push GitHub targets\n' >&2; exit 1; fi
grep -Fq 'matching GitHub HOST/OWNER/REPO fetch and push target' <<<"$split_origin_output"
test ! -s "$gh_log"
git -C "$subject" config --unset-all remote.origin.pushurl
git -C "$subject" remote set-url origin http://github.com/dotln-fixture/worktree.git
if insecure_origin_output="$(PATH="$test_root/bin:$PATH" DOTLN_GH_LOG="$gh_log" node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then printf 'error: publish accepted an insecure GitHub origin\n' >&2; exit 1; fi
grep -Fq 'matching GitHub HOST/OWNER/REPO fetch and push target' <<<"$insecure_origin_output"
test ! -s "$gh_log"
git -C "$subject" remote set-url origin "$github_origin"
if unauth_output="$(PATH="$test_root/bin:$PATH" DOTLN_GH_LOG="$gh_log" DOTLN_FIXTURE_GH_FAIL=auth node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md 2>&1)"; then printf 'error: publish accepted unauthenticated gh\n' >&2; exit 1; fi
grep -Fq 'gh authentication is required before any remote mutation' <<<"$unauth_output"
test "$(cat "$gh_log")" = $'--version\nauth status --hostname github.com'
if git --git-dir="$test_root/origin.git" show-ref --verify --quiet refs/heads/wo-099; then printf 'error: branch pushed before gh authentication\n' >&2; exit 1; fi
: >"$gh_log"
mkdir -p "$test_root/outside"
printf 'secret\n' >"$test_root/outside/secret.md"
ln -s "$test_root/outside" "$subject/link"
if PATH="$test_root/bin:$PATH" node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file link/secret.md >/dev/null 2>&1; then printf 'error: symlinked PR body accepted\n' >&2; exit 1; fi
rm -- "$subject/link"
if PATH="$test_root/bin:$PATH" node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file ../outside.md >/dev/null 2>&1; then printf 'error: outside PR body accepted\n' >&2; exit 1; fi
git -C "$subject" tag -a v7.7.7 -m 'unrelated local annotated tag'
git -C "$subject" config push.followTags true
committed_body="$test_root/committed-pr-body.md"
committed_notes="$test_root/committed-release-notes.md"
published_body="$test_root/published-pr-body.md"
cp "$subject/pr-body.md" "$committed_body"
cp "$subject/$notes_path" "$committed_notes"
git -C "$subject" update-index --assume-unchanged pr-body.md "$notes_path"
printf 'hidden uncommitted private body\n' >"$subject/pr-body.md"
printf '<!-- hidden malformed notes -->\n' >"$subject/$notes_path"
publish_output="$(PATH="$test_root/bin:$PATH" DOTLN_GH_LOG="$gh_log" DOTLN_GH_BODY="$published_body" GH_REPO=wrong/target GH_HOST=wrong.example node "$subject/scripts/worktree.mjs" publish WO-099 --title ':sparkles: fixture' --body-file pr-body.md)"
cmp "$committed_body" "$published_body"
cp "$committed_body" "$subject/pr-body.md"
cp "$committed_notes" "$subject/$notes_path"
git -C "$subject" update-index --no-assume-unchanged pr-body.md "$notes_path"
test "$(git -C "$subject" rev-parse wo-099)" = "$(git --git-dir="$test_root/origin.git" rev-parse refs/heads/wo-099)"
remote_refs="$(git --git-dir="$test_root/origin.git" for-each-ref --format='%(refname)' | LC_ALL=C sort)"
test "$remote_refs" = $'refs/heads/main\nrefs/heads/wo-099'
grep -Fq "cd '$main'" <<<"$publish_output"
grep -Fq "'$node_bin' '$subject/scripts/release.mjs' close WO-099 --publish" <<<"$publish_output"
test "$(sed -n '1p' "$gh_log")" = '--version'
test "$(sed -n '2p' "$gh_log")" = 'auth status --hostname github.com'
grep -Eq '^pr create --repo github\.com/dotln-fixture/worktree --head wo-099 --base main --title :sparkles: fixture --body-file .+/PR\.md$' "$gh_log"
test "$(wc -l <"$gh_log" | tr -d ' ')" = 3
printf 'worktree gh stub transcript (temporary path normalized):\n'
sed -E 's#--body-file [^ ]+/PR\.md#--body-file <committed-PR-body>#' "$gh_log"
printf 'GitHub PR target, authentication, and committed-body fixtures passed\n'
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
intake_path="docs/intake/raw${u202f}note.md"
assert_u202f "$intake_path"
printf 'raw local note\n' >"$subject/$intake_path"
if intake_output="$(node "$main/scripts/worktree.mjs" finish WO-099 2>&1)"; then printf 'error: ignored material was deleted\n' >&2; exit 1; fi
test "$intake_output" = "error: worktree contains ignored material and will not be removed: $intake_path (run npm run backup:intake or move it, then retry)"
test -f "$subject/$intake_path"
test -d "$subject"
test -n "$(git -C "$main" branch --list wo-099)"
rm -- "$subject/$intake_path"
rmdir -- "$subject/docs/intake"
node_module_path="node_modules/fixture${u202f}/file"
dist_path="dist/generated${u202f}/file"
ds_store_path="assets${u202f}/.DS_Store"
tsbuildinfo_path="compiler${u202f}.tsbuildinfo"
assert_u202f "$node_module_path"
assert_u202f "$dist_path"
assert_u202f "$ds_store_path"
assert_u202f "$tsbuildinfo_path"
mkdir -p "$subject/$(dirname "$node_module_path")" "$subject/$(dirname "$dist_path")" "$subject/$(dirname "$ds_store_path")"
printf 'disposable\n' >"$subject/$node_module_path"
printf 'generated\n' >"$subject/$dist_path"
printf 'finder metadata\n' >"$subject/$ds_store_path"
printf 'disposable build state\n' >"$subject/$tsbuildinfo_path"
git -C "$subject" branch --unset-upstream
node "$main/scripts/worktree.mjs" finish WO-099 >/dev/null
test ! -e "$subject"
test "$(git -C "$main" branch --list wo-099)" = ""
test -f "$main/result.txt"
test "$(git -C "$main" status --porcelain)" = ""
printf 'worktree tests passed\n'
