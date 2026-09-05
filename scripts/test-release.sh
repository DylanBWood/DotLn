#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "$script_dir/test-temp-root.sh"
tmp_base="${TMPDIR:-/tmp}"
tmp_base="$(resolve_test_tmp_base "$tmp_base")"
test_root_prefix="dotln-release-test"
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
if grep -Fq 'current.md' "$script_dir/release.mjs"; then
  printf 'error: release lifecycle parses the Markdown control projection\n' >&2
  exit 1
fi
invalid_json_path="$test_root/invalid-package.json"
printf '{\n' >"$invalid_json_path"
if invalid_json_output="$("$node_bin" --input-type=module -e '
  import { pathToFileURL } from "node:url";
  const helpers = await import(pathToFileURL(process.argv[1]).href);
  try {
    helpers.readJsonFile(process.argv[2]);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
' "$script_dir/lib/paths.mjs" "$invalid_json_path" 2>&1)"; then
  printf 'error: malformed JSON helper fixture succeeded\n' >&2
  exit 1
fi
grep -Fq "invalid JSON in $invalid_json_path" <<<"$invalid_json_output"

write_control_events() {
  local path="$1" id="$2" authority="$3"
  printf '%s\n' \
    "{\"schemaVersion\":1,\"type\":\"WorkOrderActivated\",\"workOrderId\":\"$id\",\"workOrderPath\":\"$authority\"}" \
    "{\"schemaVersion\":1,\"type\":\"ImplementationReady\",\"workOrderId\":\"$id\"}" \
    "{\"schemaVersion\":1,\"type\":\"VerificationRequested\",\"workOrderId\":\"$id\",\"verificationId\":\"VER-001\",\"reportPath\":\"docs/verifications/$id/VER-001.md\"}" \
    "{\"schemaVersion\":1,\"type\":\"VerificationCompleted\",\"workOrderId\":\"$id\",\"verificationId\":\"VER-001\",\"reportPath\":\"docs/verifications/$id/VER-001.md\",\"verdict\":\"pass\"}" \
    "{\"schemaVersion\":1,\"type\":\"FinalReviewRequested\",\"workOrderId\":\"$id\",\"finalReviewId\":\"FINAL-001\",\"reportPath\":\"docs/final-reviews/$id/FINAL-001.md\"}" \
    "{\"schemaVersion\":1,\"type\":\"FinalReviewCompleted\",\"workOrderId\":\"$id\",\"finalReviewId\":\"FINAL-001\",\"reportPath\":\"docs/final-reviews/$id/FINAL-001.md\",\"verdict\":\"pass\"}" >>"$path"
}

make_repo() {
  local name="$1"
  fixture="$test_root/$name"
  origin="$fixture/origin.git"
  main="$fixture/project"
  mkdir -p "$fixture"
  git init --bare "$origin" >/dev/null
  git clone "$origin" "$main" >/dev/null 2>&1
  git -C "$main" config user.email test@example.invalid
  git -C "$main" config user.name "DotLn Release Test"
  git -C "$main" config core.quotePath true
  github_repo="dotln-fixture/$name"
  github_origin="https://github.com/$github_repo.git"
  git -C "$main" config "url.$origin.insteadOf" "$github_origin"
  git -C "$main" remote set-url origin "$github_origin"
  git -C "$main" switch -c main >/dev/null 2>&1
  mkdir -p "$main/scripts" "$main/docs/work-orders" "$main/docs/control" "$main/docs/releases" "$main/packages/kernel/src" "$main/packages/kernel/test-fixtures" "$main/packages/skeleton/dist/src" "$main/packages/skeleton/src"
  cp "$script_dir/release.mjs" "$script_dir/release-notes.mjs" "$script_dir/github-repository.mjs" "$script_dir/github-body.mjs" "$script_dir/worktree.mjs" "$script_dir/resume.mjs" "$main/scripts/"
  cp -R "$script_dir/lib" "$main/scripts/lib"
  cp "$script_dir/../docs/releases/tag-manifest.template.json" "$main/docs/releases/"
  printf '# Historical v0.2.0 manifest for WO-003\n' >"$main/docs/releases/v0.2.0.md"
  printf '# Historical v0.2.0 notes for WO-003\n' >"$main/docs/releases/v0.2.0-notes.md"
  cp "$script_dir/../.gitignore" "$main/.gitignore"
  printf '%s\n' \
    '{' \
    '  "name": "release-fixture",' \
    '  "private": true,' \
    '  "scripts": { "test": "fixture" },' \
    '  "devDependencies": { "typescript": "5.4.5" }' \
    '}' >"$main/package.json"
  printf '%s\n' \
    '{' \
    '  "name": "release-fixture",' \
    '  "lockfileVersion": 3,' \
    '  "requires": true,' \
    '  "packages": { "": { "name": "release-fixture", "devDependencies": { "typescript": "5.4.5" } } }' \
    '}' >"$main/package-lock.json"
  write_release_block "$main" v0.2.0
  printf '{"name":"@dotln/kernel","version":"0.1.0","type":"module"}\n' >"$main/packages/kernel/package.json"
  printf '{"name":"@dotln/skeleton","version":"0.2.0"}\n' >"$main/packages/skeleton/package.json"
  cp "$script_dir/../packages/kernel/src/types.ts" "$main/packages/kernel/src/types.ts"
  cp "$script_dir/../packages/kernel/src/core.ts" "$main/packages/kernel/src/core.ts"
  printf '%s\n' \
    'const kinds = ["Once", "After", "Every", "Burst", "Calendar", "Window", "While", "Until", "Gate", "Sequence", "Merge", "Race", "Repeat", "Backoff"];' \
    'export const Cadence = Object.fromEntries(kinds.map((name) => [name, () => ({ kind: name })]));' \
    'export const CADENCE_KINDS = kinds;' \
    'export const EVALUABLE_CADENCE_KINDS = ["Once", "After", "Every", "Gate", "Until", "Backoff"];' >"$main/packages/kernel/test-fixtures/runtime-valid.mjs"
  printf '%s\n' \
    'const kinds = ["Once", "After", "Every", "Burst", "Calendar", "Window", "While", "Until", "Gate", "Sequence", "Merge", "Race", "Repeat", "Backoff"];' \
    'export const Cadence = Object.fromEntries(kinds.map((name) => [name, () => ({ kind: name })]));' \
    'export const CADENCE_KINDS = kinds;' >"$main/packages/kernel/test-fixtures/runtime-missing.mjs"
  printf '%s\n' \
    'const kinds = ["Once", "After", "Every", "Burst", "Calendar", "Window", "While", "Until", "Gate", "Sequence", "Merge", "Race", "Repeat", "Backoff"];' \
    'const constructors = kinds.filter((name) => name !== "Burst");' \
    'export const Cadence = Object.fromEntries(constructors.map((name) => [name, () => ({ kind: name })]));' \
    'export const CADENCE_KINDS = kinds;' \
    'export const EVALUABLE_CADENCE_KINDS = ["Once", "After", "Every", "Gate", "Until", "Backoff"];' >"$main/packages/kernel/test-fixtures/runtime-union-only.mjs"
  printf '%s\n' \
    'const kinds = ["Once", "After", "Every", "Burst", "Calendar", "Window", "While", "Until", "Gate", "Sequence", "Merge", "Race", "Repeat", "Backoff"];' \
    'const constructors = [...kinds, "ConstructorOnly"];' \
    'export const Cadence = Object.fromEntries(constructors.map((name) => [name, () => ({ kind: name })]));' \
    'export const CADENCE_KINDS = kinds;' \
    'export const EVALUABLE_CADENCE_KINDS = ["Once", "After", "Every", "Gate", "Until", "Backoff"];' >"$main/packages/kernel/test-fixtures/runtime-constructor-only.mjs"
  printf '%s\n' \
    'const kinds = ["Once", "After", "Every", "Burst", "Calendar", "Window", "While", "Until", "Gate", "Sequence", "Merge", "Race", "Repeat", "Backoff"];' \
    'export const Cadence = Object.fromEntries(kinds.map((name) => [name, () => ({ kind: name })]));' \
    'export const CADENCE_KINDS = kinds;' \
    'export const EVALUABLE_CADENCE_KINDS = ["Once", "Missing"];' >"$main/packages/kernel/test-fixtures/runtime-inconsistent-evaluable.mjs"
  printf '%s\n' \
    'if (process.env.DOTLN_FIXTURE_NPM_FAIL === "skeleton") process.exit(9);' \
    'process.stdout.write("fixture skeleton passed\\n");' >"$main/packages/skeleton/dist/src/cli.js"
  printf '# WO-003 — fixture release, v0.2.0\n\n**Objective:** Establish the fixture baseline.\n\n**Non-goals:** No distribution.\n' >"$main/docs/work-orders/WO-003-fixture.md"
  write_control_events "$main/docs/control/resume.jsonl" WO-003 docs/work-orders/WO-003-fixture.md
  git -C "$main" add .
  git -C "$main" commit -m 'fixture v0.2.0' >/dev/null
  printf '%s\n' \
    'DotLn v0.2.0 — fixture baseline' \
    '' \
    'DOTLN-MANIFEST-BEGIN' \
    '{"versions":{"components":{"@dotln/kernel":"0.1.0","@dotln/skeleton":"0.2.0"}}}' \
    'DOTLN-MANIFEST-END' >"$fixture/v0.2.0-tag.txt"
  git -C "$main" tag -a v0.2.0 -F "$fixture/v0.2.0-tag.txt"
  git -C "$main" push -u origin main >/dev/null 2>&1
  git -C "$main" push origin refs/tags/v0.2.0 >/dev/null 2>&1
  bin="$fixture/bin"
  npm_log="$fixture/npm.log"
  gh_log="$fixture/gh.log"
  gh_state="$fixture/gh-state"
  mkdir -p "$bin"
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
    'if [[ "${DOTLN_FIXTURE_GIT_FAIL:-}" == "update-ref" && "${3:-}" == "update-ref" ]]; then printf "fixture update-ref failure\\n" >&2; exit 9; fi' \
    'exec "$real_git" "$@"' >"$bin/git"
  chmod +x "$bin/git"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'set -euo pipefail' \
    'case "${1:-}" in' \
    '  --version) printf "10.8.0\\n" ;;' \
    '  ci)' \
    '    printf "ci\\n" >>"$DOTLN_NPM_LOG"' \
    '    if [[ "${DOTLN_FIXTURE_NPM_FAIL:-}" == "ci" ]]; then exit 7; fi' \
    '    if [[ ! -e node_modules ]]; then printf "ci-started-without-node-modules\\n" >>"$DOTLN_NPM_LOG"; fi' \
    '    mkdir -p node_modules/.bin' \
    '    echo '\''#!/usr/bin/env bash'\'' >node_modules/.bin/tsc' \
    '    echo '\''echo Version 5.4.5'\'' >>node_modules/.bin/tsc' \
    '    chmod +x node_modules/.bin/tsc' \
    '    printf "fixture npm ci passed\\n" ;;' \
    '  test)' \
    '    printf "test\\n" >>"$DOTLN_NPM_LOG"' \
    '    if [[ "${DOTLN_FIXTURE_NPM_FAIL:-}" == "test" ]]; then exit 8; fi' \
    '    mkdir -p packages/kernel/dist/src' \
    '    case "${DOTLN_FIXTURE_KERNEL:-valid}" in' \
    '      missing) cp packages/kernel/test-fixtures/runtime-missing.mjs packages/kernel/dist/src/index.js ;;' \
    '      union-only) cp packages/kernel/test-fixtures/runtime-union-only.mjs packages/kernel/dist/src/index.js ;;' \
    '      constructor-only) cp packages/kernel/test-fixtures/runtime-constructor-only.mjs packages/kernel/dist/src/index.js ;;' \
    '      inconsistent-evaluable) cp packages/kernel/test-fixtures/runtime-inconsistent-evaluable.mjs packages/kernel/dist/src/index.js ;;' \
    '      valid) cp packages/kernel/test-fixtures/runtime-valid.mjs packages/kernel/dist/src/index.js ;;' \
    '      *) printf "unexpected kernel fixture: %s\\n" "$DOTLN_FIXTURE_KERNEL" >&2; exit 65 ;;' \
    '    esac' \
    '    printf "fixture npm test passed\\n" ;;' \
    '  *) printf "unexpected npm invocation: %s\\n" "$*" >&2; exit 64 ;;' \
    'esac' >"$bin/npm"
  chmod +x "$bin/npm"
  mkdir -p "$gh_state"
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
    'if [[ "${1:-}" == "release" ]]; then' \
    '  tag="${3:-}"' \
    '  if ! git --git-dir="$DOTLN_GH_ORIGIN" show-ref --verify --quiet "refs/tags/$tag"; then printf "release-before-tag %s\\n" "$tag" >>"$DOTLN_GH_LOG"; exit 70; fi' \
    'fi' \
    'if [[ "${1:-} ${2:-}" == "release view" ]]; then' \
    '  body="$DOTLN_GH_STATE/${3}.body"' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "view" ]]; then printf "network unavailable\\n" >&2; exit 6; fi' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "view404" ]]; then printf "HTTP 404: Not Found\\n" >&2; exit 1; fi' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "invalidjson" ]]; then printf "{\\n"; exit 0; fi' \
    '  if [[ ! -f "$body" ]]; then printf "release not found\\n" >&2; exit 1; fi' \
    '  node -e '\''const fs=require("node:fs"); process.stdout.write(JSON.stringify({body:fs.readFileSync(process.argv[1],"utf8"),name:`DotLn ${process.argv[2]}`,isDraft:false,isPrerelease:false,assets:[]}));'\'' "$body" "$tag"' \
    '  exit 0' \
    'fi' \
    'if [[ "${1:-} ${2:-}" == "release create" ]]; then' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "create" ]]; then printf "fixture create failure\\n" >&2; exit 5; fi' \
    '  tag="$3"; shift 3; notes_file=""' \
    '  while (( "$#" )); do if [[ "$1" == "--notes-file" ]]; then notes_file="$2"; shift 2; else shift; fi; done' \
    '  if [[ -z "$notes_file" || ! -f "$notes_file" ]]; then printf "missing notes file\\n" >&2; exit 64; fi' \
    '  cp "$notes_file" "$DOTLN_GH_STATE/$tag.body"' \
    '  printf "https://example.invalid/releases/%s\\n" "$tag"' \
    '  exit 0' \
    'fi' \
    'printf "unexpected gh invocation: %s\\n" "$*" >&2' \
    'exit 64' >"$bin/gh"
  chmod +x "$bin/gh"
}

write_release_block() {
  local repository="$1" version="$2"
  printf '%s\n' \
    '# Fixture repository' \
    '' \
    '<!-- DOTLN-RELEASE-BEGIN -->' \
    '' \
    "This source is DotLn \`$version\`." \
    '<!-- DOTLN-RELEASE-END -->' >"$repository/README.md"
}

commit_candidate() {
  local repository="$1" id="$2" version="$3" surface_version="${4:-$3}"
  local authority="docs/work-orders/$id-fixture.md"
  write_release_block "$repository" "$surface_version"
  printf '# %s — release fixture, %s\n\n**Objective:** Deliver the visible fixture payoff for %s.\n\n**Non-goals:** Package and hosted distribution remain outside this source release.\n' "$id" "$version" "$id" >"$repository/$authority"
  write_control_events "$repository/docs/control/resume.jsonl" "$id" "$authority"
  git -C "$repository" add .
  git -C "$repository" commit -m "$id candidate $version" >/dev/null
}

commit_legacy_multicommit_candidate() {
  local repository="$1" id="$2" version="$3"
  local authority="docs/work-orders/$id-fixture.md"
  write_release_block "$repository" "$version"
  printf '# %s — release fixture, %s\n\n**Objective:** Deliver the visible fixture payoff for %s.\n\n**Non-goals:** No distribution.\n' "$id" "$version" "$id" >"$repository/$authority"
  printf '%s\n' \
    "{\"schemaVersion\":1,\"type\":\"WorkOrderActivated\",\"workOrderId\":\"$id\",\"workOrderPath\":\"$authority\"}" \
    "{\"schemaVersion\":1,\"type\":\"ImplementationReady\",\"workOrderId\":\"$id\"}" >>"$repository/docs/control/resume.jsonl"
  git -C "$repository" add .
  git -C "$repository" commit -m "$id implementation part one" >/dev/null
  printf 'second legacy implementation step\n' >"$repository/legacy-step.txt"
  git -C "$repository" add .
  git -C "$repository" commit -m "$id implementation part two" >/dev/null
  mkdir -p "$repository/docs/verifications/$id" "$repository/docs/final-reviews/$id"
  printf '# verification pass\n' >"$repository/docs/verifications/$id/VER-001.md"
  printf '# final review pass\n' >"$repository/docs/final-reviews/$id/FINAL-001.md"
  printf '%s\n' \
    "{\"schemaVersion\":1,\"type\":\"VerificationRequested\",\"workOrderId\":\"$id\",\"verificationId\":\"VER-001\",\"reportPath\":\"docs/verifications/$id/VER-001.md\"}" \
    "{\"schemaVersion\":1,\"type\":\"VerificationCompleted\",\"workOrderId\":\"$id\",\"verificationId\":\"VER-001\",\"reportPath\":\"docs/verifications/$id/VER-001.md\",\"verdict\":\"pass\"}" \
    "{\"schemaVersion\":1,\"type\":\"FinalReviewRequested\",\"workOrderId\":\"$id\",\"finalReviewId\":\"FINAL-001\",\"reportPath\":\"docs/final-reviews/$id/FINAL-001.md\"}" \
    "{\"schemaVersion\":1,\"type\":\"FinalReviewCompleted\",\"workOrderId\":\"$id\",\"finalReviewId\":\"FINAL-001\",\"reportPath\":\"docs/final-reviews/$id/FINAL-001.md\",\"verdict\":\"pass\"}" >>"$repository/docs/control/resume.jsonl"
  git -C "$repository" add .
  git -C "$repository" commit -m "$id final review pass" >/dev/null
}

commit_reviewed_candidate() {
  local repository="$1" id="$2" version="$3"
  local authority="docs/work-orders/$id-fixture.md"
  local review_dir="$repository/docs/final-reviews/$id"
  write_release_block "$repository" "$version"
  printf '# %s — reviewed release fixture, %s\n\n**Objective:** Deliver reviewed release notes for %s.\n\n**Non-goals:** Package distribution remains outside this source release.\n' "$id" "$version" "$id" >"$repository/$authority"
  write_control_events "$repository/docs/control/resume.jsonl" "$id" "$authority"
  mkdir -p "$review_dir"
  printf '%s\n' \
    '## Release overview' \
    '' \
    'Reviewed overview prose remains on one physical source line even when it is longer than eighty characters, so the reader owns viewport wrapping.' \
    '' \
    '## Read before upgrading' \
    '' \
    'Reviewer warning prose remains on one physical source line even when it is longer than eighty characters, so the reader owns viewport wrapping.' \
    '' \
    '## Substantive changes' \
    '' \
    '**Release operations.** Readers now receive the reviewed edition.' \
    '' \
    '### WO-999 is reviewer prose, not release membership' \
    '' \
    'This heading must not affect the release list.' \
    '' \
    '## Progressive polish' \
    '' \
    'None.' \
    '' \
    '## Evidence and compatibility' \
    '' \
    '- Reviewer evidence line.' \
    '- Reviewer compatibility line.' >"$review_dir/RELEASE-NOTES.md"
  printf '# final review fixture\n' >"$review_dir/FINAL-001.md"
  printf '# reviewed PR body fixture\n' >"$review_dir/PR.md"
  printf 'release tooling changed\n' >"$repository/scripts/release.fixture.mjs"
  git -C "$repository" add .
  git -C "$repository" commit -m "$id reviewed candidate $version" >/dev/null
}

assert_no_candidate_tag() {
  local repository="$1" bare="$2" tag="${3:-v0.2.1}"
  if git -C "$repository" show-ref --verify --quiet "refs/tags/$tag"; then printf 'error: refusal left local %s\n' "$tag" >&2; exit 1; fi
  if git --git-dir="$bare" show-ref --verify --quiet "refs/tags/$tag"; then printf 'error: refusal left remote %s\n' "$tag" >&2; exit 1; fi
}

release_close() {
  (cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" "$main/scripts/release.mjs" close "$@")
}

release_command() {
  (cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" "$main/scripts/release.mjs" "$@")
}

assert_surface_failure() {
  local expected="$1" output
  shift
  if output="$(release_command check-surfaces "$@" 2>&1)"; then
    printf 'error: surface check accepted %s\n' "$expected" >&2
    exit 1
  fi
  grep -Fq "$expected" <<<"$output"
  if grep -Fq 'error:' <<<"$output"; then
    printf 'error: surface report was wrapped by a caller error\n' >&2
    exit 1
  fi
  surface_failure_output="$output"
}

make_repo surfaces
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
surface_pass="$(release_command check-surfaces)"
grep -Fq 'PASS release-block: observed v0.2.1; expected v0.2.1 (work-order target v0.2.1; latest published v0.2.0)' <<<"$surface_pass"
grep -Fq 'PASS component-version @dotln/kernel: src unchanged; observed 0.1.0; previous v0.2.0 0.1.0' <<<"$surface_pass"
write_release_block "$main" v0.2.0
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1'
write_release_block "$main" v0.2.1
printf '\nHistorical example outside the release block: `v9.9.9`.\n' >>"$main/README.md"
release_command check-surfaces >/dev/null
printf '# No release block\n' >"$main/README.md"
assert_surface_failure 'observed 0 begin marker(s), 0 end marker(s)'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-END -->' \
  'This source is DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-BEGIN -->' >"$main/README.md"
assert_surface_failure 'observed 1 begin marker(s), 1 end marker(s), order invalid'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source is DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-END -->' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source is DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
assert_surface_failure 'observed 2 begin marker(s), 2 end marker(s)'
write_release_block "$main" v0.2.1
printf '<!-- DOTLN-RELEASE-BEGIN --> \n' >>"$main/README.md"
assert_surface_failure 'observed malformed release marker at README.md:'
write_release_block "$main" v0.2.1-beta
assert_surface_failure 'observed no strict version; expected exactly one v0.2.1'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source is DotLn `v0.2.1`, not `v9.9.9`.' \
  '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
assert_surface_failure 'observed v0.2.1, v9.9.9; expected exactly one v0.2.1'
write_release_block "$main" v0.2.1
printf '# WO-099 — malformed fixture target, v0.2.1-beta\n\n**Objective:** Reject a non-strict target.\n\n**Non-goals:** No distribution.\n' >"$main/docs/work-orders/WO-099-fixture.md"
if malformed_authority="$(release_command check-surfaces 2>&1)"; then
  printf 'error: surface check accepted a non-strict work-order target\n' >&2
  exit 1
fi
grep -Fq 'work-order heading must contain exactly one strict vX.Y.Z version' <<<"$malformed_authority"

make_repo surfaces_committed_readme
commit_candidate "$main" WO-099 v0.2.1
write_release_block "$main" v0.2.0
git -C "$main" add README.md
git -C "$main" commit --amend --no-edit >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" update-index --assume-unchanged README.md
write_release_block "$main" v0.2.1
release_command check-surfaces >/dev/null
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1' --committed

make_repo surfaces_lower
commit_candidate "$main" WO-099 v0.0.2 v0.2.0
git -C "$main" push origin main >/dev/null 2>&1
release_command check-surfaces >/dev/null
write_release_block "$main" v0.0.2
assert_surface_failure 'FAIL release-block: observed v0.0.2; expected exactly one v0.2.0 (work-order target v0.0.2; latest published v0.2.0)'

make_repo surfaces_first
git -C "$main" tag -d v0.2.0 >/dev/null
git --git-dir="$origin" update-ref -d refs/tags/v0.2.0
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
first_surface="$(release_command check-surfaces)"
grep -Fq 'PASS release-block: observed v0.2.1; expected v0.2.1 (work-order target v0.2.1; latest published none)' <<<"$first_surface"

make_repo surfaces_component
printf '\n// source change\n' >>"$main/packages/kernel/src/core.ts"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
assert_surface_failure 'FAIL component-version @dotln/kernel: src changed; observed 0.1.0; previous v0.2.0 0.1.0; expected a different version'
git -C "$main" update-index --assume-unchanged packages/kernel/package.json
printf '{"name":"@dotln/kernel","version":"0.1.1"}\n' >"$main/packages/kernel/package.json"
release_command check-surfaces >/dev/null
assert_surface_failure 'FAIL component-version @dotln/kernel: src changed; observed 0.1.0; previous v0.2.0 0.1.0; expected a different version' --committed

make_repo surfaces_non_source
mkdir -p "$main/packages/kernel/test"
printf 'test-only change\n' >"$main/packages/kernel/test/example.test.ts"
printf '# Package documentation change\n' >"$main/packages/kernel/README.md"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
non_source_surface="$(release_command check-surfaces)"
grep -Fq 'PASS component-version @dotln/kernel: src unchanged; observed 0.1.0; previous v0.2.0 0.1.0' <<<"$non_source_surface"

make_repo surfaces_new_component
mkdir -p "$main/packages/new-component/src"
printf 'export const first = true;\n' >"$main/packages/new-component/src/index.ts"
printf '{"name":"@dotln/new-component","version":"0.1.0"}\n' >"$main/packages/new-component/package.json"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
new_component_surface="$(release_command check-surfaces)"
grep -Fq 'PASS component-version @dotln/new-component: src changed; observed 0.1.0; previous v0.2.0 no component with this identity; expected first-version baseline' <<<"$new_component_surface"
printf 'release surface version and component fixtures passed\n'

make_repo surfaceclose
git clone "$origin" "$fixture/integrator" >/dev/null 2>&1
git -C "$fixture/integrator" config user.email test@example.invalid
git -C "$fixture/integrator" config user.name "DotLn Surface Integrator"
git -C "$fixture/integrator" switch main >/dev/null 2>&1
commit_candidate "$fixture/integrator" WO-099 v0.2.1
write_release_block "$fixture/integrator" v0.2.0
git -C "$fixture/integrator" add README.md
git -C "$fixture/integrator" commit --amend --no-edit >/dev/null
git -C "$fixture/integrator" push origin main >/dev/null 2>&1
test "$(git -C "$main" rev-parse HEAD)" != "$(git --git-dir="$origin" rev-parse refs/heads/main)"
if close_surface_output="$(release_close WO-099 --publish 2>&1)"; then
  printf 'error: release close accepted a stale release block\n' >&2
  exit 1
fi
test "$(git -C "$main" rev-parse HEAD)" = "$(git -C "$main" rev-parse origin/main)"
test ! -e "$npm_log"
assert_no_candidate_tag "$main" "$origin"
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1'
test "$close_surface_output" = "$surface_failure_output"

make_repo surfaceclose_linked
linked_subject="$fixture/project-wo099"
git -C "$main" worktree add "$linked_subject" -b wo-099 main >/dev/null
commit_candidate "$linked_subject" WO-099 v0.2.1
write_release_block "$linked_subject" v0.2.0
git -C "$linked_subject" add README.md
git -C "$linked_subject" commit --amend --no-edit >/dev/null
git -C "$linked_subject" push origin HEAD:main >/dev/null 2>&1
if linked_close_surface_output="$(release_close WO-099 --publish 2>&1)"; then
  printf 'error: linked-worktree release close accepted a stale release block\n' >&2
  exit 1
fi
test ! -d "$linked_subject"
test ! -e "$npm_log"
assert_no_candidate_tag "$main" "$origin"
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1'
test "$linked_close_surface_output" = "$surface_failure_output"

make_repo bodyclose
commit_reviewed_candidate "$main" WO-024 v0.2.1
"$node_bin" -e '
  const fs = require("node:fs");
  const path = process.argv[1];
  const source = fs.readFileSync(path, "utf8");
  fs.writeFileSync(path, source.replace(
    "Reviewed overview prose remains on one physical source line even when it is longer than eighty characters, so the reader owns viewport wrapping.",
    "Reviewed overview prose was accidentally wrapped at a fixed source column even though it is one logical\nparagraph that the reader should wrap for its own viewport.",
  ));
' "$main/docs/final-reviews/WO-024/RELEASE-NOTES.md"
git -C "$main" add .
git -C "$main" commit --amend --no-edit >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
if body_close_output="$(release_close WO-024 --publish 2>&1)"; then
  printf 'error: release close accepted wrapped current release notes\n' >&2
  exit 1
fi
grep -Fq 'FAIL github-body-profile: observed docs/final-reviews/WO-024/RELEASE-NOTES.md: accidental GitHub prose soft wrap' <<<"$body_close_output"
test ! -e "$npm_log"
test ! -e "$gh_log"
assert_no_candidate_tag "$main" "$origin"
printf 'release close surface gates ran after sync and before npm, tag, or GitHub mutation\n'

make_repo dirty
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
printf 'dirty\n' >"$main/untracked.txt"
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: dirty release close succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
rm -- "$main/untracked.txt"
foreign_path=".env.fixture${u202f}foreign"
assert_u202f "$foreign_path"
printf 'IGNORED=fixture\n' >"$main/$foreign_path"
if ignored_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: ignored release influence succeeded\n' >&2; exit 1; fi
test "$ignored_output" = "error: main checkout contains ignored material that can contaminate release evidence: $foreign_path"
test -f "$main/$foreign_path"
assert_no_candidate_tag "$main" "$origin"

make_repo settings_scope
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
mkdir -p "$main/.claude"
printf '/.claude/other.local.json\n' >>"$main/.git/info/exclude"
printf 'other ignored harness state\n' >"$main/.claude/other.local.json"
if settings_scope_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: broadened .claude release exception succeeded\n' >&2; exit 1; fi
test "$settings_scope_output" = 'error: main checkout contains ignored material that can contaminate release evidence: .claude/other.local.json'
test -f "$main/.claude/other.local.json"
assert_no_candidate_tag "$main" "$origin"
printf 'release influence permits only the exact root harness-settings path\n'

make_repo nonmain
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" worktree add "$fixture/other" -b other >/dev/null
if (cd "$fixture/other" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" close WO-099 --publish >/dev/null 2>&1); then printf 'error: non-main release close succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"

make_repo divergence
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
printf 'local divergence\n' >"$main/local.txt"
git -C "$main" add local.txt
git -C "$main" commit -m 'local-only commit' >/dev/null
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: divergent main release close succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"

make_repo malformed
commit_candidate "$main" WO-099 v0.2
git -C "$main" push origin main >/dev/null 2>&1
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: malformed release version succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"

make_repo missinggh
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
mkdir -p "$fixture/no-gh-bin"
ln -s "$bin/git" "$fixture/no-gh-bin/git"
missing_gh_trace="$fixture/git.trace"
if missing_gh_output="$(cd "$main" && PATH="$fixture/no-gh-bin" DOTLN_NPM_LOG="$npm_log" GIT_TRACE="$missing_gh_trace" "$node_bin" "$main/scripts/release.mjs" close WO-099 --publish 2>&1)"; then printf 'error: release accepted missing gh\n' >&2; exit 1; fi
test -s "$missing_gh_trace"
grep -Fq 'gh is required before tag creation' <<<"$missing_gh_output"
if grep -Fq ' mktag' "$missing_gh_trace"; then printf 'error: missing gh reached git mktag\n' >&2; exit 1; fi
test ! -e "$npm_log"
assert_no_candidate_tag "$main" "$origin"

make_repo unauthenticated
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
unauthenticated_trace="$fixture/git.trace"
if unauthenticated_output="$(DOTLN_FIXTURE_GH_FAIL=auth GIT_TRACE="$unauthenticated_trace" release_close WO-099 --publish 2>&1)"; then printf 'error: release accepted unauthenticated gh\n' >&2; exit 1; fi
test -s "$unauthenticated_trace"
grep -Fq 'gh authentication is required before tag creation' <<<"$unauthenticated_output"
if grep -Fq ' mktag' "$unauthenticated_trace"; then printf 'error: unauthenticated gh reached git mktag\n' >&2; exit 1; fi
test ! -e "$npm_log"
test "$(cat "$gh_log")" = $'--version\nauth status --hostname github.com'
assert_no_candidate_tag "$main" "$origin"

make_repo splitorigin
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" remote set-url --push origin https://github.com/dotln-fixture/wrong-target.git
if split_origin_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: split fetch/push GitHub targets accepted\n' >&2; exit 1; fi
grep -Fq 'matching GitHub HOST/OWNER/REPO fetch and push target' <<<"$split_origin_output"
test ! -e "$npm_log"
test ! -e "$gh_log"
assert_no_candidate_tag "$main" "$origin"

make_repo lower
commit_candidate "$main" WO-099 v0.0.2 v0.2.0
git -C "$main" push origin main >/dev/null 2>&1
mkdir -p "$main/docs/intake/images"
intake_path="docs/intake/images/Screenshot 2026-08-30 at 10.01.24${u202f}PM.jpg"
assert_u202f "$intake_path"
printf 'surviving raw fixture\n' >"$main/$intake_path"
mkdir -p "$main/.claude"
printf 'surviving operator settings fixture\n' >"$main/.claude/settings.local.json"
lower_output="$(release_close WO-099 --publish)"
grep -Fq 'below latest release v0.2.0' <<<"$lower_output"
test ! -e "$npm_log"
test "$(git -C "$main" status --porcelain)" = ""
test -f "$main/$intake_path"
test -f "$main/.claude/settings.local.json"
assert_no_candidate_tag "$main" "$origin" v0.0.2

make_repo failures
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
if DOTLN_FIXTURE_NPM_FAIL=ci release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: dependency failure published\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
if DOTLN_FIXTURE_NPM_FAIL=test release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: evidence failure published\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"

make_repo cadence_missing
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
cadence_missing_origin_before="$(git --git-dir="$origin" for-each-ref --format='%(objectname) %(refname)' | LC_ALL=C sort)"
cadence_missing_trace="$fixture/git.trace"
if cadence_missing_failure="$(DOTLN_FIXTURE_KERNEL=missing GIT_TRACE="$cadence_missing_trace" release_close WO-099 --publish 2>&1)"; then printf 'error: missing built kernel constants published\n' >&2; exit 1; fi
test -s "$cadence_missing_trace"
grep -Fq 'built kernel cadence constants are missing' <<<"$cadence_missing_failure"
if grep -Fq ' mktag' "$cadence_missing_trace"; then printf 'error: missing built kernel constants reached git mktag\n' >&2; exit 1; fi
if grep -Fq ':refs/tags/v0.2.1' "$cadence_missing_trace"; then printf 'error: missing built kernel constants attempted a tag push\n' >&2; exit 1; fi
test "$(git --git-dir="$origin" for-each-ref --format='%(objectname) %(refname)' | LC_ALL=C sort)" = "$cadence_missing_origin_before"
assert_no_candidate_tag "$main" "$origin"
printf 'missing built kernel cadence constants refused before tag publication\n'

make_repo cadence_inconsistent
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
cadence_inconsistent_origin_before="$(git --git-dir="$origin" for-each-ref --format='%(objectname) %(refname)' | LC_ALL=C sort)"
for cadence_fixture in union-only constructor-only inconsistent-evaluable; do
  cadence_inconsistent_trace="$fixture/git-$cadence_fixture.trace"
  if cadence_inconsistent_failure="$(DOTLN_FIXTURE_KERNEL="$cadence_fixture" GIT_TRACE="$cadence_inconsistent_trace" release_close WO-099 --publish 2>&1)"; then printf 'error: inconsistent built kernel constants published (%s)\n' "$cadence_fixture" >&2; exit 1; fi
  test -s "$cadence_inconsistent_trace"
  grep -Fq 'built kernel cadence constants are inconsistent with the Cadence type union' <<<"$cadence_inconsistent_failure"
  if grep -Fq ' mktag' "$cadence_inconsistent_trace"; then printf 'error: inconsistent built kernel constants reached git mktag (%s)\n' "$cadence_fixture" >&2; exit 1; fi
  if grep -Fq ':refs/tags/v0.2.1' "$cadence_inconsistent_trace"; then printf 'error: inconsistent built kernel constants attempted a tag push (%s)\n' "$cadence_fixture" >&2; exit 1; fi
  test "$(git --git-dir="$origin" for-each-ref --format='%(objectname) %(refname)' | LC_ALL=C sort)" = "$cadence_inconsistent_origin_before"
  assert_no_candidate_tag "$main" "$origin"
done
printf 'inconsistent built kernel cadence constants refused before tag publication\n'

make_repo conflict
base_commit="$(git -C "$main" rev-parse HEAD)"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" tag -a v0.2.1 "$base_commit" -m 'conflicting historical tag'
git -C "$main" push origin refs/tags/v0.2.1 >/dev/null 2>&1
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: conflicting tag accepted\n' >&2; exit 1; fi
test "$(git --git-dir="$origin" rev-list -n 1 v0.2.1)" = "$base_commit"

make_repo localconflict
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" tag -a v0.2.1 -m 'conflicting local-only tag'
local_conflict_object="$(git -C "$main" rev-parse v0.2.1^{tag})"
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: local-only conflicting tag accepted\n' >&2; exit 1; fi
test "$(git -C "$main" rev-parse v0.2.1^{tag})" = "$local_conflict_object"
if git --git-dir="$origin" show-ref --verify --quiet refs/tags/v0.2.1; then printf 'error: local-only conflict reached origin\n' >&2; exit 1; fi

make_repo nestedtag
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" tag -a v0.2.1/child -m 'nested local tag conflict'
if nested_tag_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: nested local tag conflict accepted\n' >&2; exit 1; fi
grep -Fq 'release tag v0.2.1 is blocked by nested tag v0.2.1/child' <<<"$nested_tag_output"
test "$(git -C "$main" cat-file -t v0.2.1/child)" = tag
assert_no_candidate_tag "$main" "$origin"

make_repo prepare
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
prepare_output="$(release_close WO-099)"
grep -Fq 'Prepared and validated v0.2.1' <<<"$prepare_output"
grep -Fq 'npm run release -- close WO-099 --publish' <<<"$prepare_output"
assert_no_candidate_tag "$main" "$origin"
test "$(git -C "$main" status --porcelain)" = ""

make_repo missinglocalprevious
git -C "$main" tag -d v0.2.0 >/dev/null
git -C "$main" config remote.origin.tagOpt --no-tags
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
missing_local_previous_output="$(release_close WO-099)"
grep -Fq 'Prepared and validated v0.2.1' <<<"$missing_local_previous_output"
test "$(git -C "$main" cat-file -t v0.2.0)" = tag
assert_no_candidate_tag "$main" "$origin"

make_repo pushfail
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
printf '%s\n' '#!/usr/bin/env bash' 'case "$1" in refs/tags/v0.2.1) exit 1 ;; esac' 'exit 0' >"$origin/hooks/update"
chmod +x "$origin/hooks/update"
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: rejected tag push succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
if grep -q '^release ' "$gh_log"; then printf 'error: gh release ran before a successful tag push\n' >&2; exit 1; fi

make_repo refrecovery
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
if ref_failure="$(DOTLN_FIXTURE_GIT_FAIL=update-ref release_close WO-099 --publish 2>&1)"; then printf 'error: local tag-ref failure reported success\n' >&2; exit 1; fi
grep -Fq 'tag published; GitHub Release not created; rerun the same command' <<<"$ref_failure"
test ! "$(git -C "$main" tag --list v0.2.1)"
test "$(git --git-dir="$origin" cat-file -t v0.2.1)" = tag
if grep -q '^release ' "$gh_log"; then printf 'error: gh release ran after failed local tag ref\n' >&2; exit 1; fi
printf '%s\n' 'throw new Error("ignored stale artifact executed");' >"$main/packages/kernel/dist/src/index.js"
ref_recovery_tests_before="$(grep -c '^test$' "$npm_log")"
ref_recovery_output="$(release_close WO-099 --publish)"
grep -Fq 'GitHub Release created' <<<"$ref_recovery_output"
test -f "$main/packages/kernel/dist/src/index.js"
test "$(grep -c '^test$' "$npm_log")" = "$((ref_recovery_tests_before + 1))"
if grep -Fq 'ignored stale artifact executed' "$main/packages/kernel/dist/src/index.js"; then printf 'error: equal-tag recovery trusted stale ignored build output\n' >&2; exit 1; fi
test "$(git -C "$main" cat-file -t v0.2.1)" = tag
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1

make_repo createrecovery
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
if create_failure="$(DOTLN_FIXTURE_GH_FAIL=create release_close WO-099 --publish 2>&1)"; then printf 'error: gh release create failure reported success\n' >&2; exit 1; fi
grep -Fq 'tag published; GitHub Release not created; rerun the same command' <<<"$create_failure"
test "$(git -C "$main" cat-file -t v0.2.1)" = tag
test "$(git -C "$main" rev-list -n 1 v0.2.1)" = "$(git --git-dir="$origin" rev-list -n 1 v0.2.1)"
test ! -e "$gh_state/v0.2.1.body"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
create_recovery_tests_before="$(grep -c '^test$' "$npm_log")"
recovery_output="$(release_close WO-099 --publish)"
grep -Fq 'GitHub Release created' <<<"$recovery_output"
test "$(grep -c '^test$' "$npm_log")" = "$((create_recovery_tests_before + 1))"
test -f "$gh_state/v0.2.1.body"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2
release_close WO-099 --publish >/dev/null
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2
if lookup_failure="$(DOTLN_FIXTURE_GH_FAIL=view release_close WO-099 --publish 2>&1)"; then printf 'error: failed GitHub Release lookup triggered success\n' >&2; exit 1; fi
grep -Fq 'GitHub Release state not verified and no create was attempted' <<<"$lookup_failure"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2
if ambiguous_404="$(DOTLN_FIXTURE_GH_FAIL=view404 release_close WO-099 --publish 2>&1)"; then printf 'error: ambiguous GitHub 404 triggered success\n' >&2; exit 1; fi
grep -Fq 'GitHub Release state not verified and no create was attempted' <<<"$ambiguous_404"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2
if invalid_metadata="$(DOTLN_FIXTURE_GH_FAIL=invalidjson release_close WO-099 --publish 2>&1)"; then printf 'error: invalid GitHub Release metadata triggered success\n' >&2; exit 1; fi
grep -Fq 'GitHub Release state not verified and no create was attempted' <<<"$invalid_metadata"
grep -Fq 'returned invalid metadata' <<<"$invalid_metadata"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2
printf 'different first line\n' >"$gh_state/v0.2.1.body"
if mismatch_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: mismatched GitHub Release body accepted\n' >&2; exit 1; fi
grep -Fq 'GitHub Release body differs at line 1' <<<"$mismatch_output"
grep -Fq 'expected "DotLn v0.2.1"' <<<"$mismatch_output"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2

make_repo stale_helpers
stale_release_marker="$fixture/stale-release.marker"
stale_worktree_marker="$fixture/stale-worktree.marker"
printf '%s\n' \
  'import { writeFileSync } from "node:fs";' \
  'writeFileSync(process.env.DOTLN_STALE_RELEASE_MARKER, "stale main release helper executed\n");' \
  'throw new Error("stale main release helper executed");' >"$main/scripts/release.mjs"
printf '%s\n' \
  'import { writeFileSync } from "node:fs";' \
  'writeFileSync(process.env.DOTLN_STALE_WORKTREE_MARKER, "stale main worktree helper executed\n");' \
  'throw new Error("stale main worktree helper executed");' >"$main/scripts/worktree.mjs"
git -C "$main" add scripts/release.mjs scripts/worktree.mjs
git -C "$main" commit -m 'fixture stale main lifecycle helpers' >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
stale_subject="$fixture/project-wo099"
git -C "$main" worktree add "$stale_subject" -b wo-099 >/dev/null
cp "$script_dir/release.mjs" "$script_dir/worktree.mjs" "$stale_subject/scripts/"
commit_candidate "$stale_subject" WO-099 v0.2.1
git -C "$stale_subject" push -u origin wo-099 >/dev/null 2>&1
git clone "$origin" "$fixture/integrator" >/dev/null 2>&1
git -C "$fixture/integrator" config user.email test@example.invalid
git -C "$fixture/integrator" config user.name "DotLn Stale-Helper Integrator"
git -C "$fixture/integrator" switch main >/dev/null 2>&1
git -C "$fixture/integrator" merge --ff-only origin/wo-099 >/dev/null
git -C "$fixture/integrator" push origin main >/dev/null 2>&1
mkdir -p "$main/.claude" "$stale_subject/docs/intake/dist"
printf 'persistent operator settings\n' >"$main/.claude/settings.local.json"
printf 'protected staged intake\n' >"$stale_subject/docs/intake/dist/x.md"
if stale_intake_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" DOTLN_STALE_RELEASE_MARKER="$stale_release_marker" DOTLN_STALE_WORKTREE_MARKER="$stale_worktree_marker" "$node_bin" "$stale_subject/scripts/release.mjs" close WO-099 2>&1)"; then
  printf 'error: reviewed close deleted protected intake while main helpers were stale\n' >&2
  exit 1
fi
grep -Fq 'docs/intake/dist/x.md' <<<"$stale_intake_output"
test -f "$main/.claude/settings.local.json"
test -f "$stale_subject/docs/intake/dist/x.md"
test -d "$stale_subject"
test -n "$(git -C "$main" branch --list wo-099)"
test ! -e "$stale_release_marker"
test ! -e "$stale_worktree_marker"
rm -- "$stale_subject/docs/intake/dist/x.md"
rmdir -- "$stale_subject/docs/intake/dist" "$stale_subject/docs/intake"
stale_close_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" DOTLN_STALE_RELEASE_MARKER="$stale_release_marker" DOTLN_STALE_WORKTREE_MARKER="$stale_worktree_marker" "$node_bin" "$stale_subject/scripts/release.mjs" close WO-099)"
grep -Fq 'Prepared and validated v0.2.1' <<<"$stale_close_output"
test -f "$main/.claude/settings.local.json"
test ! -e "$stale_subject"
test "$(git -C "$main" branch --list wo-099)" = ""
test "$(git -C "$main" rev-parse HEAD)" = "$(git -C "$main" rev-parse origin/main)"
test ! -e "$stale_release_marker"
test ! -e "$stale_worktree_marker"
assert_no_candidate_tag "$main" "$origin"
printf 'reviewed subject helpers guarded their own pre-fast-forward close and cleanup\n'

make_repo success
"$node_bin" -e '
  const fs = require("node:fs");
  const path = process.argv[1];
  const source = fs.readFileSync(path, "utf8");
  const changed = source.replace(
    "export const CONTROL_LOG_SCHEMA_VERSION = 1;",
    "export const CONTROL_LOG_SCHEMA_VERSION = 7;",
  );
  if (changed === source) process.exit(1);
  fs.writeFileSync(path, changed);
' "$main/scripts/lib/control.mjs"
git -C "$main" add scripts/lib/control.mjs
git -C "$main" commit -m 'fixture distinct control schema export' >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
subject="$fixture/project-wo099"
git -C "$main" worktree add "$subject" -b wo-099 >/dev/null
tracked_path="scripts/release.${u202f}fixture.mjs"
leading_path=" ${u202f}leading.md"
assert_u202f "$tracked_path"
assert_u202f "$leading_path"
printf 'tracked Unicode fixture\n' >"$subject/$tracked_path"
printf 'leading-space fixture\n' >"$subject/$leading_path"
commit_candidate "$subject" WO-099 v0.2.1
git -C "$subject" push -u origin wo-099 >/dev/null 2>&1
git clone "$origin" "$fixture/integrator" >/dev/null 2>&1
git -C "$fixture/integrator" config user.email test@example.invalid
git -C "$fixture/integrator" config user.name "DotLn Release Integrator"
git -C "$fixture/integrator" switch main >/dev/null 2>&1
git -C "$fixture/integrator" merge --ff-only origin/wo-099 >/dev/null
git -C "$fixture/integrator" push origin main >/dev/null 2>&1
merged_main="$(git --git-dir="$origin" rev-parse refs/heads/main)"
git -C "$main" tag -a v9.9.9 -m 'unrelated local annotated tag'
unrelated_tag_object="$(git -C "$main" rev-parse v9.9.9^{tag})"
git -C "$main" config push.followTags true
test ! -e "$main/node_modules"
# Bootstrap path: main is intentionally behind the merged PR, so invoke the
# reviewed helper from the subject while its working directory is main. The
# helper may remove the worktree containing its own loaded source.
success_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" "$subject/scripts/release.mjs" close WO-099 --publish)"
grep -Fq 'Published annotated v0.2.1' <<<"$success_output"
grep -Fq 'GitHub Release created' <<<"$success_output"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
grep -Eq '^release create v0\.2\.1 --repo github\.com/dotln-fixture/success --verify-tag --title DotLn v0\.2\.1 --notes-file .+/RELEASE\.md$' "$gh_log"
grep -Fq 'npm run release -- notes v0.2.1' "$gh_state/v0.2.1.body"
grep -Fq 'npm run release -- manifest-from-tag v0.2.1' "$gh_state/v0.2.1.body"
if grep -Fq 'DOTLN-MANIFEST-BEGIN' "$gh_state/v0.2.1.body"; then printf 'error: GitHub Release body contains manifest JSON\n' >&2; exit 1; fi
grep -Fq 'ci-started-without-node-modules' "$npm_log"
grep -Fq 'test' "$npm_log"
test ! -e "$subject"
test "$(git -C "$main" branch --list wo-099)" = ""
test "$(git -C "$main" status --porcelain)" = ""
test "$(git -C "$main" rev-parse HEAD)" = "$(git -C "$main" rev-parse origin/main)"
test "$(git --git-dir="$origin" rev-parse refs/heads/main)" = "$merged_main"
test "$(git -C "$main" cat-file -t v0.2.1)" = tag
test "$(git -C "$main" rev-list -n 1 v0.2.1)" = "$(git --git-dir="$origin" rev-list -n 1 v0.2.1)"
test "$(git -C "$main" rev-list -n 1 v0.2.1)" = "$(git -C "$main" rev-parse HEAD)"
test "$(git -C "$main" rev-parse v9.9.9^{tag})" = "$unrelated_tag_object"
remote_tags="$(git --git-dir="$origin" for-each-ref --format='%(refname)' refs/tags | LC_ALL=C sort)"
test "$remote_tags" = $'refs/tags/v0.2.0\nrefs/tags/v0.2.1'
published_object="$(git -C "$main" rev-parse v0.2.1^{tag})"
case "$main/node_modules" in "$test_root"/*/node_modules) rm -rf -- "$main/node_modules" ;; *) exit 1 ;; esac
rerun_ci_before="$(grep -c '^ci$' "$npm_log")"
rerun_tests_before="$(grep -c '^test$' "$npm_log")"
rerun_output="$(release_close WO-099 --publish)"
grep -Fq 'v0.2.1 is already published' <<<"$rerun_output"
test "$(git -C "$main" rev-parse v0.2.1^{tag})" = "$published_object"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
test "$(grep -c '^ci$' "$npm_log")" = "$((rerun_ci_before + 1))"
test "$(grep -c '^test$' "$npm_log")" = "$((rerun_tests_before + 1))"
test -d "$main/node_modules"
PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" manifest-from-tag v0.2.1 >"$fixture/manifest.json"
"$node_bin" --input-type=module -e '
  import assert from "node:assert/strict";
  import fs from "node:fs";
  import { pathToFileURL } from "node:url";
  const [path, tracked, leading, kernelPath, resumePath] = process.argv.slice(1);
  const manifest = JSON.parse(fs.readFileSync(path, "utf8"));
  const kernel = await import(pathToFileURL(kernelPath).href);
  const resume = await import(pathToFileURL(resumePath).href);
  const expectedKinds = ["Once", "After", "Every", "Burst", "Calendar", "Window", "While", "Until", "Gate", "Sequence", "Merge", "Race", "Repeat", "Backoff"];
  assert.deepStrictEqual(kernel.CADENCE_KINDS, expectedKinds);
  assert.deepStrictEqual(Object.keys(kernel.Cadence), expectedKinds);
  for (const [name, factory] of Object.entries(kernel.Cadence)) {
    assert.equal(factory().kind, name);
  }
  const allKinds = [...kernel.CADENCE_KINDS];
  const evaluable = [...kernel.EVALUABLE_CADENCE_KINDS];
  const evaluableSet = new Set(evaluable);
  const deferred = allKinds.filter((kind) => !evaluableSet.has(kind));
  if (!manifest.notes.changedFiles.includes(tracked)) process.exit(1);
  if (!manifest.notes.changedFiles.includes(leading)) process.exit(1);
  if (!manifest.notes.critical.includes("Workflow authority, recovery, or publication tooling changed; inspect the operator guide and release evidence.")) process.exit(1);
  assert.deepStrictEqual(manifest.cadence.evaluable, evaluable);
  assert.deepStrictEqual(manifest.cadence.deferred, deferred);
  assert.deepStrictEqual(manifest.schemas.controlLog, {
    min: resume.CONTROL_LOG_SCHEMA_VERSION,
    max: resume.CONTROL_LOG_SCHEMA_VERSION,
  });
  assert.equal(resume.CONTROL_LOG_SCHEMA_VERSION, 7);
  process.stdout.write(`cadence manifest evaluable: ${JSON.stringify(manifest.cadence.evaluable)}\n`);
  process.stdout.write(`cadence manifest deferred: ${JSON.stringify(manifest.cadence.deferred)}\n`);
' "$fixture/manifest.json" "$tracked_path" "$leading_path" "$main/packages/kernel/dist/src/index.js" "$main/scripts/resume.mjs"
PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" validate "$fixture/manifest.json" >/dev/null

for mutation in commit application component toolchain schema evidence cadence; do
  mutated="$fixture/manifest-$mutation.json"
  cp "$fixture/manifest.json" "$mutated"
  "$node_bin" -e '
    const fs = require("node:fs");
    const [path, mutation] = process.argv.slice(1);
    const value = JSON.parse(fs.readFileSync(path, "utf8"));
    if (mutation === "commit") value.release.commit = "0".repeat(40);
    if (mutation === "application") value.release.application = "v9.9.9";
    if (mutation === "component") value.versions.components["@dotln/kernel"] = "9.9.9";
    if (mutation === "toolchain") value.toolchain.node = "v0.0.0";
    if (mutation === "schema") value.schemas.eventEnvelope.max = 99;
    if (mutation === "evidence") value.evidence[0].exitCode = 1;
    if (mutation === "cadence") value.cadence.evaluable = ["Once"];
    fs.writeFileSync(path, JSON.stringify(value, null, 2));
  ' "$mutated" "$mutation"
  if PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" validate "$mutated" >/dev/null 2>&1; then printf 'error: validator accepted %s mutation\n' "$mutation" >&2; exit 1; fi
done

make_repo edition
commit_legacy_multicommit_candidate "$main" WO-023 v0.2.1
commit_reviewed_candidate "$main" WO-024 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
edition_publish_output="$(GH_REPO=wrong/target GH_HOST=wrong.example release_close WO-024 --publish)"
grep -Fq 'Published annotated v0.2.1' <<<"$edition_publish_output"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
gh_lines_before_offline="$(wc -l <"$gh_log" | tr -d ' ')"
release_command notes v0.2.1 >"$fixture/edition-one.md"
release_command notes v0.2.1 >"$fixture/edition-two.md"
cmp "$fixture/edition-one.md" "$fixture/edition-two.md"
release_command manifest-from-tag v0.2.1 >"$fixture/edition-manifest.json"
git -C "$main" cat-file -p v0.2.1 >"$fixture/edition-tag-object.txt"
release_command list >"$fixture/release-list.txt"
test "$(wc -l <"$gh_log" | tr -d ' ')" = "$gh_lines_before_offline"
grep -Eq $'^v0\.2\.0\t[0-9a-f]{40}\tv0\.2\.0\tWO-003$' "$fixture/release-list.txt"
grep -Eq $'^v0\.2\.1\t[0-9a-f]{40}\tv0\.2\.1\tWO-023,WO-024$' "$fixture/release-list.txt"
"$node_bin" - "$fixture/edition-one.md" "$gh_state/v0.2.1.body" "$fixture/edition-manifest.json" "$fixture/edition-tag-object.txt" <<'NODE'
const assert = require("node:assert/strict");
const fs = require("node:fs");
const [notesPath, bodyPath, manifestPath, tagObjectPath] = process.argv.slice(2);
const notesWithNewline = fs.readFileSync(notesPath, "utf8");
const notes = notesWithNewline.replace(/\n$/, "");
const body = fs.readFileSync(bodyPath, "utf8");
const manifest = fs.readFileSync(manifestPath, "utf8").replace(/\n$/, "");
const tagObject = fs.readFileSync(tagObjectPath, "utf8");
const headings = [...notes.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
assert.deepStrictEqual(headings, [
  "Release overview",
  "Read before upgrading",
  "Substantive changes",
  "Progressive polish",
  "Evidence and compatibility",
]);
for (const heading of headings) {
  const start = notes.indexOf(`## ${heading}`);
  const nextHeading = headings[headings.indexOf(heading) + 1];
  const end = nextHeading ? notes.indexOf(`## ${nextHeading}`, start) : notes.length;
  const section = notes.slice(start, end);
  assert.ok(section.indexOf("### WO-023") < section.indexOf("### WO-024"));
}
assert.ok(notes.includes("**Fallback: no reviewed notes for WO-023 (predates WO-024); commit subjects:**\n\n- WO-023 implementation part one\n- WO-023 implementation part two\n- WO-023 final review pass"));
assert.ok(notes.includes("Reviewed overview prose remains on one physical source line even when it is longer than eighty characters, so the reader owns viewport wrapping."));
assert.ok(notes.includes("Reviewer warning prose remains on one physical source line even when it is longer than eighty characters, so the reader owns viewport wrapping."));
assert.ok(notes.includes("**Release operations.** Readers now receive the reviewed edition.\n\n### WO-999 is reviewer prose, not release membership\n\nThis heading must not affect the release list."));
assert.ok(notes.includes("## Progressive polish\n\n### WO-023"));
assert.ok(notes.includes("### WO-024 — reviewed release fixture, v0.2.1\n\nNone."));
assert.ok(notes.includes("- Reviewer evidence line.\n- Reviewer compatibility line."));
const readBefore = notes.slice(
  notes.indexOf("## Read before upgrading"),
  notes.indexOf("## Substantive changes"),
);
assert.ok(readBefore.indexOf("Reviewer warning prose") < readBefore.indexOf("### Derived from the diff"));
assert.ok(readBefore.indexOf("### Derived from the diff") < readBefore.indexOf("Workflow authority, recovery, or publication tooling changed"));
const evidence = notes.slice(notes.indexOf("## Evidence and compatibility"));
assert.ok(evidence.indexOf("- Reviewer compatibility line.") < evidence.indexOf("### Machine-derived release evidence"));
assert.match(evidence, /- Distribution: source-only$/);
const pointer = "Render these notes locally with `npm run release -- notes v0.2.1`; inspect the canonical manifest with `npm run release -- manifest-from-tag v0.2.1`.\n";
assert.equal(body, `${notes}\n\n${pointer}`);
assert.ok(!body.includes("DOTLN-MANIFEST-BEGIN"));
const annotation = tagObject.slice(tagObject.indexOf("\n\n") + 2);
assert.equal(
  annotation,
  `${notes}\n\nDOTLN-MANIFEST-BEGIN\n${manifest}\nDOTLN-MANIFEST-END\n`,
);
NODE
if grep -Eq -- '--draft|--prerelease|--generate-notes|--notes-from-tag|--discussion-category|--target|--latest|--asset' "$gh_log"; then printf 'error: GitHub Release used an unauthorized publication flag\n' >&2; exit 1; fi
release_close WO-024 --publish >/dev/null
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
gh_lines_before_current_backfill="$(wc -l <"$gh_log" | tr -d ' ')"
if current_backfill_output="$(release_command publish-notes v0.2.1 2>&1)"; then printf 'error: publish-notes accepted a reviewed-edition tag\n' >&2; exit 1; fi
grep -Fq "at or after WO-024's release-note contract" <<<"$current_backfill_output"
test "$(wc -l <"$gh_log" | tr -d ' ')" = "$gh_lines_before_current_backfill"

git -C "$main" tag -a v0.2.2 -m 'DotLn v0.2.2-not-really'
git -C "$main" push origin refs/tags/v0.2.2 >/dev/null 2>&1
if release_command notes v0.2.2 >/dev/null 2>&1; then printf 'error: notes accepted a lookalike non-DotLn tag\n' >&2; exit 1; fi
if lookalike_backfill="$(release_command publish-notes v0.2.2 2>&1)"; then printf 'error: publish-notes accepted a lookalike non-DotLn tag\n' >&2; exit 1; fi
grep -Fq 'v0.2.2 is not a DotLn release tag' <<<"$lookalike_backfill"
git -C "$main" tag -a v0.2.3 -m 'DotLn v0.2.3'
git -C "$main" push origin refs/tags/v0.2.3 >/dev/null 2>&1
if post_contract_backfill="$(release_command publish-notes v0.2.3 2>&1)"; then printf 'error: publish-notes accepted malformed post-contract notes\n' >&2; exit 1; fi
grep -Fq "at or after WO-024's release-note contract" <<<"$post_contract_backfill"
test "$(wc -l <"$gh_log" | tr -d ' ')" = "$gh_lines_before_current_backfill"

release_command notes v0.2.0 >"$fixture/v0.2.0-human.txt"
test "$(cat "$fixture/v0.2.0-human.txt")" = 'DotLn v0.2.0 — fixture baseline'
publish_notes_output="$(release_command publish-notes v0.2.0)"
grep -Fq 'GitHub Release created for historical annotated v0.2.0' <<<"$publish_notes_output"
test "$(grep -c '^release create v0.2.0 ' "$gh_log")" = 1
"$node_bin" - "$gh_state/v0.2.0.body" <<'NODE'
const assert = require("node:assert/strict");
const fs = require("node:fs");
const body = fs.readFileSync(process.argv[2], "utf8");
assert.equal(
  body,
  "**Notes as generated at close; predates WO-024's release-note edition.**\n\n" +
    "DotLn v0.2.0 — fixture baseline\n\n" +
    "Historical records: [manifest](../../blob/main/docs/releases/v0.2.0.md) and [notes](../../blob/main/docs/releases/v0.2.0-notes.md).\n",
);
NODE
release_command publish-notes v0.2.0 >/dev/null
test "$(grep -c '^release create v0.2.0 ' "$gh_log")" = 1
edition_sha256="$(shasum -a 256 "$fixture/edition-one.md" | awk '{print $1}')"
printf 'assembled edition fixture sha256: %s\n' "$edition_sha256"
printf 'release gh stub transcript (temporary paths normalized):\n'
sed -E 's#--notes-file [^ ]+/RELEASE\.md#--notes-file <temporary-release-body>#' "$gh_log"
printf 'release edition, GitHub projection, recovery, and historical backfill fixtures passed\n'

make_repo firstrelease
git -C "$main" tag -d v0.2.0 >/dev/null
git --git-dir="$origin" update-ref -d refs/tags/v0.2.0
first_release_path="${u202f}first-release.md"
assert_u202f "$first_release_path"
printf 'first release Unicode fixture\n' >"$main/$first_release_path"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
first_release_output="$(release_close WO-099 --publish)"
grep -Fq 'Published annotated v0.2.1' <<<"$first_release_output"
PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" manifest-from-tag v0.2.1 >"$fixture/first-release-manifest.json"
"$node_bin" -e '
  const fs = require("node:fs");
  const [path, expected] = process.argv.slice(1);
  const manifest = JSON.parse(fs.readFileSync(path, "utf8"));
  if (manifest.release.previousRelease !== null) process.exit(1);
  if (!manifest.notes.changedFiles.includes(expected)) process.exit(1);
' "$fixture/first-release-manifest.json" "$first_release_path"
PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" validate "$fixture/first-release-manifest.json" >/dev/null

printf 'release tests passed\n'
