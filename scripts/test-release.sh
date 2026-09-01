#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
test_root="$(mktemp -d /private/tmp/dotln-release-test.XXXXXX)"
cleanup() { case "$test_root" in /private/tmp/dotln-release-test.*) rm -rf -- "$test_root" ;; *) exit 1 ;; esac; }
trap cleanup EXIT INT TERM
node_bin="$(command -v node)"
u202f="$(printf '\342\200\257')"
assert_u202f() {
  "$node_bin" -e 'if (!Buffer.from(process.argv[1], "utf8").toString("hex").includes("e280af")) process.exit(1)' "$1"
}
test "$("$node_bin" -e 'process.stdout.write(Buffer.from(process.argv[1], "utf8").toString("hex"))' "$u202f")" = e280af

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
  git -C "$main" switch -c main >/dev/null 2>&1
  mkdir -p "$main/scripts" "$main/docs/work-orders" "$main/docs/control" "$main/docs/releases" "$main/packages/kernel/src" "$main/packages/skeleton/dist/src" "$main/packages/skeleton/src"
  cp "$script_dir/release.mjs" "$script_dir/worktree.mjs" "$script_dir/resume.mjs" "$main/scripts/"
  cp "$script_dir/../docs/releases/tag-manifest.template.json" "$main/docs/releases/"
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
  printf '{"name":"@dotln/kernel","version":"0.1.0"}\n' >"$main/packages/kernel/package.json"
  printf '{"name":"@dotln/skeleton","version":"0.2.0"}\n' >"$main/packages/skeleton/package.json"
  printf '%s\n' \
    'export interface EventEnvelope {' \
    '  readonly schemaVersion: 1;' \
    '}' \
    'export namespace Cadence {' \
    '  export type T = Once | After | Every | Burst | Calendar | Window | While | Until | Gate | Sequence | Merge | Race | Repeat | Backoff;' \
    '}' >"$main/packages/kernel/src/types.ts"
  printf '%s\n' \
    'export function evaluateCadence(cadence) {' \
    '  switch (cadence.kind) {' \
    '    case "Once": return 1;' \
    '    case "After": return 1;' \
    '    case "Every": return 1;' \
    '    case "Gate": return 1;' \
    '    case "Until": return 1;' \
    '    case "Backoff": return 1;' \
    '    default: throw new Error(`Cadence ${cadence.kind} evaluation is deferred`);' \
    '  }' \
    '}' >"$main/packages/kernel/src/core.ts"
  printf '%s\n' \
    'if (process.env.DOTLN_FIXTURE_NPM_FAIL === "skeleton") process.exit(9);' \
    'process.stdout.write("fixture skeleton passed\\n");' >"$main/packages/skeleton/dist/src/cli.js"
  printf '# WO-003 — fixture release, v0.2.0\n\n**Objective:** Establish the fixture baseline.\n\n**Non-goals:** No distribution.\n' >"$main/docs/work-orders/WO-003-fixture.md"
  write_control_events "$main/docs/control/resume.jsonl" WO-003 docs/work-orders/WO-003-fixture.md
  git -C "$main" add .
  git -C "$main" commit -m 'fixture v0.2.0' >/dev/null
  git -C "$main" tag -a v0.2.0 -m 'fixture baseline'
  git -C "$main" push -u origin main >/dev/null 2>&1
  git -C "$main" push origin refs/tags/v0.2.0 >/dev/null 2>&1
  bin="$fixture/bin"
  npm_log="$fixture/npm.log"
  mkdir -p "$bin"
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
    '    printf "fixture npm test passed\\n" ;;' \
    '  *) printf "unexpected npm invocation: %s\\n" "$*" >&2; exit 64 ;;' \
    'esac' >"$bin/npm"
  chmod +x "$bin/npm"
}

commit_candidate() {
  local repository="$1" id="$2" version="$3"
  local authority="docs/work-orders/$id-fixture.md"
  printf '# %s — release fixture, %s\n\n**Objective:** Deliver the visible fixture payoff for %s.\n\n**Non-goals:** Package and hosted distribution remain outside this source release.\n' "$id" "$version" "$id" >"$repository/$authority"
  write_control_events "$repository/docs/control/resume.jsonl" "$id" "$authority"
  git -C "$repository" add .
  git -C "$repository" commit -m "$id candidate $version" >/dev/null
}

assert_no_candidate_tag() {
  local repository="$1" bare="$2" tag="${3:-v0.2.1}"
  if git -C "$repository" show-ref --verify --quiet "refs/tags/$tag"; then printf 'error: refusal left local %s\n' "$tag" >&2; exit 1; fi
  if git --git-dir="$bare" show-ref --verify --quiet "refs/tags/$tag"; then printf 'error: refusal left remote %s\n' "$tag" >&2; exit 1; fi
}

release_close() {
  (cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" close "$@")
}

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

make_repo lower
commit_candidate "$main" WO-099 v0.0.2
git -C "$main" push origin main >/dev/null 2>&1
mkdir -p "$main/docs/intake/images"
intake_path="docs/intake/images/Screenshot 2026-08-30 at 10.01.24${u202f}PM.jpg"
assert_u202f "$intake_path"
printf 'surviving raw fixture\n' >"$main/$intake_path"
lower_output="$(release_close WO-099 --publish)"
grep -Fq 'below latest release v0.2.0' <<<"$lower_output"
test ! -e "$npm_log"
test "$(git -C "$main" status --porcelain)" = ""
test -f "$main/$intake_path"
assert_no_candidate_tag "$main" "$origin" v0.0.2

make_repo failures
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
if DOTLN_FIXTURE_NPM_FAIL=ci release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: dependency failure published\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
if DOTLN_FIXTURE_NPM_FAIL=test release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: evidence failure published\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"

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

make_repo prepare
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
prepare_output="$(release_close WO-099)"
grep -Fq 'Prepared and validated v0.2.1' <<<"$prepare_output"
grep -Fq 'npm run release -- close WO-099 --publish' <<<"$prepare_output"
assert_no_candidate_tag "$main" "$origin"
test "$(git -C "$main" status --porcelain)" = ""

make_repo pushfail
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
printf '%s\n' '#!/usr/bin/env bash' 'case "$1" in refs/tags/v0.2.1) exit 1 ;; esac' 'exit 0' >"$origin/hooks/update"
chmod +x "$origin/hooks/update"
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: rejected tag push succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"

make_repo success
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
success_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$subject/scripts/release.mjs" close WO-099 --publish)"
grep -Fq 'Published annotated v0.2.1' <<<"$success_output"
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
rerun_output="$(release_close WO-099 --publish)"
grep -Fq 'v0.2.1 is already published' <<<"$rerun_output"
test "$(git -C "$main" rev-parse v0.2.1^{tag})" = "$published_object"
test ! -e "$main/node_modules"
(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" npm ci >/dev/null)
PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" manifest-from-tag v0.2.1 >"$fixture/manifest.json"
"$node_bin" -e '
  const fs = require("node:fs");
  const [path, tracked, leading] = process.argv.slice(1);
  const manifest = JSON.parse(fs.readFileSync(path, "utf8"));
  if (!manifest.notes.changedFiles.includes(tracked)) process.exit(1);
  if (!manifest.notes.changedFiles.includes(leading)) process.exit(1);
  if (!manifest.notes.critical.includes("Workflow authority, recovery, or publication tooling changed; inspect the operator guide and release evidence.")) process.exit(1);
' "$fixture/manifest.json" "$tracked_path" "$leading_path"
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
