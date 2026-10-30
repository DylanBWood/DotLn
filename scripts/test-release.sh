#!/usr/bin/env bash
set -euo pipefail
unset DOTLN_ACCOUNT_LABEL # Fixtures declare their own actors.
release_template=""
selected_case=""
prepare_template=""
signal_probe_ready=""
real_npm_all=0
while (( "$#" )); do
  case "$1" in
    --case) selected_case="${2:?case name required}"; shift 2 ;;
    --template) release_template="${2:?template required}"; shift 2 ;;
    --prepare-template) prepare_template="${2:?destination required}"; shift 2 ;;
    --signal-probe-ready) signal_probe_ready="${2:?ready file required}"; shift 2 ;;
    --real-npm) real_npm_all=1; shift ;;
    *) printf "error: unknown release fixture argument %s\n" "$1" >&2; exit 64 ;;
  esac
done


script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "$script_dir/test-temp-root.sh"
tmp_base="${TMPDIR:-/tmp}"
tmp_base="$(resolve_test_tmp_base "$tmp_base")"
test_root_prefix="dotln-release-test"
create_test_temp_root "$tmp_base" "$test_root_prefix"
test_root="$test_temp_root_result"
install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"
node_bin="$(command -v node)"
release_restricted_beacons=()
release_root_identity="$("$node_bin" - "$test_root" <<'JS'
const fs=require('node:fs'),p=require('node:path'),root=process.argv[2],stat=fs.lstatSync(root);
console.log(JSON.stringify({root,device:stat.dev,inode:stat.ino,owner:fs.readFileSync(p.join(root,'.dotln-test-root-owner'),'utf8')}));
JS
)"
record_restricted_release_beacon() {
  local identity
  identity="$("$node_bin" - "$test_root" "$1" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs'),[root,file]=process.argv.slice(2),stat=fs.lstatSync(file);
assert.ok(file.startsWith(root+'/') && stat.isDirectory() && !stat.isSymbolicLink());
assert.equal(fs.realpathSync(file),file);
assert.equal(stat.uid,process.getuid());
console.log(JSON.stringify({file,device:stat.dev,inode:stat.ino}));
JS
)"
  release_restricted_beacons+=("$identity")
}
finish_release_test_root() {
  local exit_code="$1"
  trap - EXIT INT TERM
  # Cancellation can precede the case's normal permission restoration. Restore
  # only these captured fixture objects before the guarded root removal.
  if (( ${#release_restricted_beacons[@]} )); then
    if ! "$node_bin" - "$release_root_identity" "${release_restricted_beacons[@]}" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs'),p=require('node:path');
const root=JSON.parse(process.argv[2]),stat=fs.lstatSync(root.root);
assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
assert.equal(fs.realpathSync(root.root),root.root);
assert.equal(stat.uid,process.getuid());
assert.equal(stat.dev,root.device);assert.equal(stat.ino,root.inode);
const marker=p.join(root.root,'.dotln-test-root-owner'),markerStat=fs.lstatSync(marker);
assert.ok(markerStat.isFile() && !markerStat.isSymbolicLink());
assert.equal(fs.readFileSync(marker,'utf8'),root.owner);
const surviving=[];
for(const value of process.argv.slice(3)) {
 const item=JSON.parse(value),current=fs.lstatSync(item.file,{throwIfNoEntry:false});
 if(!current) continue;
 assert.ok(item.file.startsWith(root.root+'/') && current.isDirectory() && !current.isSymbolicLink());
 assert.equal(fs.realpathSync(item.file),item.file);
 assert.equal(current.uid,process.getuid());
 assert.equal(current.dev,item.device);assert.equal(current.ino,item.inode);
 surviving.push(item.file);
}
for(const file of surviving) fs.chmodSync(file,0o700);
JS
    then
      printf 'error: release fixture beacon identity changed; root retained\n' >&2
      exit 1
    fi
  fi
  _dotln_finish_test_temp_root "$exit_code"
}
trap 'finish_release_test_root "$?"' EXIT
trap 'finish_release_test_root 130' INT
trap 'finish_release_test_root 143' TERM
if [[ -n "$signal_probe_ready" ]]; then
  # Signal tests enter the real suite after its cleanup traps are installed.
  signal_beacon="$test_root/signal-beacon"
  mkdir "$signal_beacon"
  printf 'disposable beacon\n' >"$signal_beacon/signal"
  record_restricted_release_beacon "$signal_beacon"
  chmod 111 "$signal_beacon"
  # A waiting foreground child makes shell-only signal delivery fail reliably.
  "$node_bin" --input-type=module -e '
    import fs from "node:fs";
    const pending=process.argv[1]+".pending";
    fs.writeFileSync(pending, JSON.stringify({beacon:process.argv[2]})+"\n", { flag: "wx" });
    try { fs.linkSync(pending,process.argv[1]); }
    finally { fs.rmSync(pending); }
    setInterval(() => {}, 1000);
  ' "$signal_probe_ready" "$signal_beacon"
  exit 1
fi
real_git="$(command -v git)"
real_npm="$(command -v npm)"
u202f="$(printf '\342\200\257')"
assert_u202f() {
  "$node_bin" -e 'if (!Buffer.from(process.argv[1], "utf8").toString("hex").includes("e280af")) process.exit(1)' "$1"
}


write_control_events() {
  local path="$1" id="$2" authority="$3" material_evidence=""
  if [[ -n "${DOTLN_FIXTURE_MATERIAL_ROWS:-}" ]]; then
    material_evidence=",\"evidence\":{\"material\":$DOTLN_FIXTURE_MATERIAL_ROWS}"
  elif [[ -n "${DOTLN_FIXTURE_MATERIAL_SOURCE:-}" ]]; then
    material_evidence=",\"evidence\":$("$node_bin" --input-type=module - "$DOTLN_FIXTURE_MATERIAL_SOURCE" <<'JS'
import { pathToFileURL } from "node:url";
const root = process.argv[2];
const { inventoryMaterial } = await import(pathToFileURL(`${root}/scripts/lib/worktree-material.mjs`));
process.stdout.write(JSON.stringify({ material: inventoryMaterial(root) }));
JS
)"
  fi
  printf '%s\n' \
    "{\"schemaVersion\":1,\"type\":\"WorkOrderActivated\",\"workOrderId\":\"$id\",\"workOrderPath\":\"$authority\"}" \
    "{\"schemaVersion\":1,\"type\":\"ImplementationReady\",\"workOrderId\":\"$id\"$material_evidence}" \
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
  github_repo="dotln-fixture/$name"
  github_origin="https://github.com/$github_repo.git"
  if [[ -n "$release_template" ]]; then
    "$node_bin" "$script_dir/release-fixtures.mjs" copy "$release_template" "$fixture"
  else
  git init --bare "$origin" >/dev/null
  # These disposable stores are copied into templates and local clones. A
  # detached repack can remove objects during copying or race fixture cleanup.
  git -C "$origin" config maintenance.auto false
  git -C "$origin" config receive.autogc false
  git clone -c maintenance.auto=false "$origin" "$main" >/dev/null 2>&1
  git -C "$main" config user.email test@example.invalid
  git -C "$main" config user.name "DotLn Release Test"
  git -C "$main" config core.quotePath true
  github_repo="dotln-fixture/$name"
  github_origin="https://github.com/$github_repo.git"
  git -C "$main" config "url.$origin.insteadOf" "$github_origin"
  git -C "$main" remote set-url origin "$github_origin"
  git -C "$main" switch -c main >/dev/null 2>&1
  mkdir -p "$main/scripts" "$main/docs/work-orders" "$main/docs/control" "$main/docs/releases" "$main/packages/kernel/src" "$main/packages/kernel/test-fixtures" "$main/packages/skeleton/dist/src" "$main/packages/skeleton/src"
  cp "$script_dir/release.mjs" "$script_dir/worktree.mjs" "$script_dir/resume.mjs" "$script_dir/license-surfaces.mjs" "$main/scripts/"
  cp -R "$script_dir/lib" "$main/scripts/lib"
  cat >"$main/scripts/build.mjs" <<'JS'
import { spawnSync } from "node:child_process";
const result = spawnSync("npm", ["run", "build"], { stdio: "inherit" });
process.exit(result.status ?? 1);
JS
  node "$script_dir/test-beacon-fixture.mjs" "$main"
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
  node "$script_dir/test-license-fixture.mjs" "$main"
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
  git -C "$main" -c maintenance.auto=false commit -m 'fixture v0.2.0' >/dev/null
  printf '%s\n' \
    'DotLn v0.2.0 — fixture baseline' \
    '' \
    'DOTLN-MANIFEST-BEGIN' \
    '{"versions":{"components":{"@dotln/kernel":"0.1.0","@dotln/skeleton":"0.2.0"}}}' \
    'DOTLN-MANIFEST-END' >"$fixture/v0.2.0-tag.txt"
  git -C "$main" tag -a v0.2.0 -F "$fixture/v0.2.0-tag.txt"
  git -C "$main" push -u origin main >/dev/null 2>&1
  git -C "$main" push origin refs/tags/v0.2.0 >/dev/null 2>&1
  fi
  # Close now runs the real prune. Supply its runtime imports without copying
  # the compiled module graph into every disposable release repository.
  "$node_bin" --input-type=module - "$main" "$script_dir/.." <<'JS'
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [root, source] = process.argv.slice(2);
const directory = join(root, 'packages/skeleton/dist/src');
mkdirSync(directory, { recursive: true });
writeFileSync(join(directory, 'package.json'), '{"type":"module"}\n');
for (const [file, names] of [
  ['harness-host.js', 'releaseHarnessWriter, harnessWriterView, harnessProcessAlive'],
  ['worker-transport.js', 'staleCodexEpisodeHomes'],
]) {
  const url = pathToFileURL(join(source, 'packages/skeleton/dist/src', file)).href;
  writeFileSync(join(directory, file), `export { ${names} } from ${JSON.stringify(url)};\n`);
}
JS
  # The copied helpers resolve the launchpad's installed Markdown parser as
  # the launchpad does: through a node_modules above them.
  mkdir -p "$fixture/node_modules"
  ln -sfn "$script_dir/../node_modules/prettier" "$fixture/node_modules/prettier"
  git -C "$main" config "url.$origin.insteadOf" "$github_origin"
  git -C "$main" remote set-url origin "$github_origin"
  bin="$fixture/bin"
  npm_log="$fixture/npm.log"
  real_publish="$real_npm_all"
  if [[ "$name" == license_surfaces ]]; then real_publish=1; fi
  gh_log="$fixture/gh.log"
  gh_state="$fixture/gh-state"
  mkdir -p "$bin"
  printf '%s\n' \
    '#!/bin/bash' \
    'set -euo pipefail' \
    "real_git='$real_git'" \
    'original_args=("$@")' \
    'if [[ "${1:-}" == "-C" ]]; then' \
    '  target_root="$2"; shift 2' \
    '  while [[ "${1:-}" == "-c" ]]; do shift 2; done' \
    '  set -- -C "$target_root" "$@"' \
    'fi' \
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
    'exec "$real_git" "${original_args[@]}"' >"$bin/git"
  chmod +x "$bin/git"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'set -euo pipefail' \
    "real_npm='$real_npm'" \
    "node_bin='$node_bin'" \
    "real_publish='$real_publish'" \
    'case "${1:-}" in' \
    '  --version) printf "10.8.0\\n" ;;' \
    '  publish)' \
    '    if [[ " $* " != *" --dry-run "* ]]; then exit 64; fi' \
    '    if [[ "$real_publish" == 1 ]]; then exec "$real_npm" "$@"; fi' \
    '    printf "DOTLN_PACKAGE_PUBLISH_REFUSED: packages stay private until a separate publication decision\\n" >&2' \
    '    exit 1 ;;' \
    '  ci)' \
    '    printf "ci\\n" >>"$DOTLN_NPM_LOG"' \
    '    if [[ "${DOTLN_FIXTURE_NPM_FAIL:-}" == "ci" ]]; then exit 7; fi' \
    '    if [[ ! -e node_modules ]]; then printf "ci-started-without-node-modules\\n" >>"$DOTLN_NPM_LOG"; fi' \
    '    mkdir -p node_modules/.bin' \
    '    echo '\''#!/usr/bin/env bash'\'' >node_modules/.bin/tsc' \
    '    echo '\''echo Version 5.4.5'\'' >>node_modules/.bin/tsc' \
    '    chmod +x node_modules/.bin/tsc' \
    '    printf "fixture npm ci passed\\n" ;;' \
    '  run)' \
    '    if [[ "${2:-}" != "build" ]]; then exit 64; fi' \
    '    printf "build\\n" >>"$DOTLN_NPM_LOG"' \
    '    if [[ "${DOTLN_FIXTURE_NPM_FAIL:-}" == "build" ]]; then exit 8; fi' \
    '    mkdir -p packages/skeleton/dist/src' \
    '    printf "console.log(\"fixture skeleton bootstrap\");\\n" >packages/skeleton/dist/src/cli.js' \
    '    if [[ -f .claude/harness-manifest.json ]]; then' \
    '      "$node_bin" --input-type=module -e '\''import fs from "node:fs"; import path from "node:path"; const manifest=JSON.parse(fs.readFileSync(".claude/harness-manifest.json","utf8")); for (const entry of manifest.profiles) { const runtime=entry.profile.runtime; for (const file of runtime.files) { const target=path.join(runtime.snapshot,file.path); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.copyFileSync(file.path,target); }}'\''' \
    '    fi' \
    '    DOTLN_FIXTURE_BUILD=1 exec "$0" test ;;' \
    '  test)' \
    '    if [[ "${DOTLN_FIXTURE_BUILD:-}" != 1 ]]; then printf "test\\n" >>"$DOTLN_NPM_LOG"; fi' \
    '    if [[ -f scripts/fixture-one-gate.mjs && "${DOTLN_FIXTURE_BUILD:-}" != 1 ]]; then exec "$node_bin" scripts/fixture-one-gate.mjs; fi' \
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
    'if [[ "${1:-} ${2:-}" == "pr create" ]]; then' \
    '  while (( "$#" )); do if [[ "$1" == "--body-file" ]]; then cp "$2" "$DOTLN_GH_STATE/pr.body"; shift 2; else shift; fi; done' \
    '  printf "https://example.invalid/pr/99\\n"; exit 0' \
    'fi' \
    'state_dir="$DOTLN_GH_STATE"' \
    'if [[ "${1:-}" == "release" ]]; then' \
    '  tag="${3:-}"' \
    '  repo=""; scan=("$@"); for ((i = 0; i < ${#scan[@]}; i++)); do if [[ "${scan[$i]}" == "--repo" ]]; then repo="${scan[$((i + 1))]:-}"; fi; done' \
    '  if [[ -n "$repo" && "$repo" != "${DOTLN_GH_CORE_REPO:-$repo}" ]]; then state_dir="$DOTLN_GH_STATE/${repo//\//_}"; mkdir -p "$state_dir"' \
    '  elif ! git --git-dir="$DOTLN_GH_ORIGIN" show-ref --verify --quiet "refs/tags/$tag"; then printf "release-before-tag %s\\n" "$tag" >>"$DOTLN_GH_LOG"; exit 70; fi' \
    'fi' \
    'if [[ "${1:-} ${2:-}" == "release view" ]]; then' \
    '  body="$state_dir/${3}.body"' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "view" ]]; then printf "network unavailable\\n" >&2; exit 6; fi' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "view404" ]]; then printf "HTTP 404: Not Found\\n" >&2; exit 1; fi' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "invalidjson" ]]; then printf "{\\n"; exit 0; fi' \
    '  if [[ ! -f "$body" ]]; then printf "release not found\\n" >&2; exit 1; fi' \
    '  node -e '\''const fs=require("node:fs"); process.stdout.write(JSON.stringify({body:fs.readFileSync(process.argv[1],"utf8"),name:process.env.DOTLN_FIXTURE_GH_METADATA === "name" ? "Different title" : (fs.existsSync(process.argv[1]+".title") ? fs.readFileSync(process.argv[1]+".title","utf8") : `DotLn ${process.argv[2]}`),isDraft:process.env.DOTLN_FIXTURE_GH_METADATA === "draft",isPrerelease:process.env.DOTLN_FIXTURE_GH_METADATA === "prerelease",assets:process.env.DOTLN_FIXTURE_GH_METADATA === "assets" ? [{name:"unexpected"}] : []}));'\'' "$body" "$tag"' \
    '  exit 0' \
    'fi' \
    'if [[ "${1:-} ${2:-}" == "release create" ]]; then' \
    '  if [[ "${DOTLN_FIXTURE_GH_FAIL:-}" == "create" ]]; then printf "fixture create failure\\n" >&2; exit 5; fi' \
    '  tag="$3"; shift 3; notes_file=""; release_title=""' \
    '  while (( "$#" )); do if [[ "$1" == "--notes-file" ]]; then notes_file="$2"; shift 2; elif [[ "$1" == "--title" ]]; then release_title="$2"; shift 2; else shift; fi; done' \
    '  if [[ -z "$notes_file" || ! -f "$notes_file" ]]; then printf "missing notes file\\n" >&2; exit 64; fi' \
    '  cp "$notes_file" "$state_dir/$tag.body"' \
    '  printf "%s" "$release_title" >"$state_dir/$tag.body.title"' \
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
    "This source prepares DotLn \`$version\`." \
    '<!-- DOTLN-RELEASE-END -->' >"$repository/README.md"
}

commit_candidate() {
  local repository="$1" id="$2" version="$3" surface_version="${4:-$3}"
  local authority="docs/work-orders/$id-fixture.md"
  write_release_block "$repository" "$surface_version"
  printf '# %s — release fixture, %s\n\n**Objective:** Deliver the visible fixture payoff for %s.\n\n**Non-goals:** Package and hosted distribution remain outside this source release.\n' "$id" "$version" "$id" >"$repository/$authority"
  write_control_events "$repository/docs/control/resume.jsonl" "$id" "$authority"
  if [[ -n "${DOTLN_FIXTURE_MATERIAL_SOURCE:-}" ]]; then
    git -C "$repository" add . -- ':!docs/intake'
  else
    git -C "$repository" add .
  fi
  "$node_bin" "$script_dir/test-release-composition.mjs" record "$repository" "$id"
  git -C "$repository" add docs/control
  git -C "$repository" -c maintenance.auto=false commit -m "$id candidate $version" >/dev/null
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
  git -C "$repository" -c maintenance.auto=false commit -m "$id implementation part one" >/dev/null
  printf 'second legacy implementation step\n' >"$repository/legacy-step.txt"
  git -C "$repository" add .
  git -C "$repository" -c maintenance.auto=false commit -m "$id implementation part two" >/dev/null
  mkdir -p "$repository/docs/verifications/$id" "$repository/docs/final-reviews/$id"
  printf '# verification pass\n' >"$repository/docs/verifications/$id/VER-001.md"
  printf '# final review pass\n' >"$repository/docs/final-reviews/$id/FINAL-001.md"
  printf '%s\n' \
    "{\"schemaVersion\":1,\"type\":\"VerificationRequested\",\"workOrderId\":\"$id\",\"verificationId\":\"VER-001\",\"reportPath\":\"docs/verifications/$id/VER-001.md\"}" \
    "{\"schemaVersion\":1,\"type\":\"VerificationCompleted\",\"workOrderId\":\"$id\",\"verificationId\":\"VER-001\",\"reportPath\":\"docs/verifications/$id/VER-001.md\",\"verdict\":\"pass\"}" \
    "{\"schemaVersion\":1,\"type\":\"FinalReviewRequested\",\"workOrderId\":\"$id\",\"finalReviewId\":\"FINAL-001\",\"reportPath\":\"docs/final-reviews/$id/FINAL-001.md\"}" \
    "{\"schemaVersion\":1,\"type\":\"FinalReviewCompleted\",\"workOrderId\":\"$id\",\"finalReviewId\":\"FINAL-001\",\"reportPath\":\"docs/final-reviews/$id/FINAL-001.md\",\"verdict\":\"pass\"}" >>"$repository/docs/control/resume.jsonl"
  git -C "$repository" add .
  "$node_bin" "$script_dir/test-release-composition.mjs" record "$repository" "$id"
  git -C "$repository" add docs/control
  git -C "$repository" -c maintenance.auto=false commit -m "$id final review pass" >/dev/null
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
    '- Reviewer compatibility line.' \
    '- Evidence record: [the decisions](../../evidence/WO-024/decisions.md).' >"$review_dir/RELEASE-NOTES.md"
  printf '# final review fixture\n' >"$review_dir/FINAL-001.md"
  printf '# reviewed PR body fixture\n' >"$review_dir/PR.md"
  printf 'release tooling changed\n' >"$repository/scripts/release.fixture.mjs"
  git -C "$repository" add .
  "$node_bin" "$script_dir/test-release-composition.mjs" record "$repository" "$id"
  git -C "$repository" add docs/control
  git -C "$repository" -c maintenance.auto=false commit -m "$id reviewed candidate $version" >/dev/null
}

assert_no_candidate_tag() {
  local repository="$1" bare="$2" tag="${3:-v0.2.1}"
  if git -C "$repository" show-ref --verify --quiet "refs/tags/$tag"; then printf 'error: refusal left local %s\n' "$tag" >&2; exit 1; fi
  if git --git-dir="$bare" show-ref --verify --quiet "refs/tags/$tag"; then printf 'error: refusal left remote %s\n' "$tag" >&2; exit 1; fi
}

release_close_summary() {
  (cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" DOTLN_GH_CORE_REPO="github.com/$github_repo" "$node_bin" "$main/scripts/release.mjs" close "$@")
}

retained_close_output() {
  "$node_bin" - "$main" "$1" <<'JS'
const fs = require('node:fs'), p = require('node:path');
const report = process.argv[3].match(/^Full report: (.+)$/m)?.[1];
if (report && fs.existsSync(p.join(process.argv[2], report)) && fs.statSync(p.join(process.argv[2], report)).isFile())
  process.stdout.write(fs.readFileSync(p.join(process.argv[2], report), 'utf8'));
else process.stdout.write(process.argv[3] + '\n');
JS
}

release_close() {
  # Existing detailed assertions consume the retained report. The WO-195
  # summary cases below call the real stdout surface separately.
  local result=0
  local summary
  summary="$(release_close_summary "$@")" || result=$?
  retained_close_output "$summary"
  return "$result"
}

seed_release_close_writer() {
  local directory="$main/docs/control/local/harness"
  mkdir -p "$directory"
  printf '{"session":"fixture-close-session"}\n' >"$directory/writer.json"
  "$node_bin" --input-type=module - "$main" "$script_dir/.." <<'JS'
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [root, source] = process.argv.slice(2);
const runtime = pathToFileURL(join(source, 'packages/skeleton/dist/src/harness-host.js')).href;
writeFileSync(join(root, 'packages/skeleton/dist/src/harness-host.js'), `
import { createHash } from "node:crypto";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
export { harnessProcessAlive } from ${JSON.stringify(runtime)};
const marker = (root) => join(root, "docs/control/local/harness/writer.json");
export const releaseHarnessWriter = (root, input) => {
  const path = marker(root);
  if (existsSync(path) && JSON.parse(readFileSync(path, "utf8")).session === input.session_id)
    rmSync(path);
};
export const harnessWriterView = (root) => {
  const path = marker(root);
  return existsSync(path)
    ? { reserved: true, actorId: createHash("sha256").update(JSON.parse(readFileSync(path, "utf8")).session).digest("hex") }
    : { reserved: false };
};
`);
JS
}

seed_real_release_close_writer() {
  "$node_bin" --input-type=module - "$main" "$script_dir/../packages/skeleton/dist/src/harness-host.js" <<'JS'
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [root, runtime] = process.argv.slice(2);
const url = pathToFileURL(runtime).href;
const { seedHarnessWriter } = await import(url);
const directory = join(root, 'packages/skeleton/dist/src');
mkdirSync(directory, { recursive: true });
writeFileSync(join(directory, 'package.json'), '{"type":"module"}\n');
writeFileSync(join(directory, 'harness-host.js'), `export { releaseHarnessWriter, harnessWriterView, harnessProcessAlive } from ${JSON.stringify(url)};\nexport const pruneCompletedHarnessSession = () => { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 80); return "fixture session cleanup"; };\n`);
seedHarnessWriter(root, { actorId: createHash('sha256').update('fixture-close-session').digest('hex'), reservedAt: new Date().toISOString() });
JS
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

release_case_preflight() {
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
}

release_case_surfaces() {
make_repo surfaces
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
surface_pass="$(release_command check-surfaces)"
grep -Fq 'PASS release-block: observed v0.2.1; expected v0.2.1 (work-order target v0.2.1; latest published v0.2.0)' <<<"$surface_pass"
grep -Fq 'PASS component-version @dotln/kernel: src unchanged; observed 0.1.0; previous v0.2.0 0.1.0' <<<"$surface_pass"
# Workspace pins are exact; untracked source is explicitly outside this comparison.
"$node_bin" -e 'const fs = require("node:fs"), path = process.argv[1], pkg = JSON.parse(fs.readFileSync(path)); pkg.dependencies = { "@dotln/kernel": process.argv[2] }; fs.writeFileSync(path, JSON.stringify(pkg));' "$main/packages/skeleton/package.json" '0.1.0'
release_command check-surfaces | grep -Fq 'PASS workspace-pin @dotln/skeleton -> @dotln/kernel: observed 0.1.0; expected exact workspace version 0.1.0'
"$node_bin" -e 'const fs = require("node:fs"), path = process.argv[1], pkg = JSON.parse(fs.readFileSync(path)); pkg.dependencies = { "@dotln/kernel": process.argv[2] }; fs.writeFileSync(path, JSON.stringify(pkg));' "$main/packages/skeleton/package.json" '^0.1.0'
assert_surface_failure 'FAIL workspace-pin @dotln/skeleton -> @dotln/kernel: observed ^0.1.0; expected exact workspace version 0.1.0'
git -C "$main" checkout -- packages/skeleton/package.json
printf 'export const untracked = true;\n' >"$main/packages/kernel/src/untracked.ts"
release_command check-surfaces | grep -Fq 'advisory: untracked source not compared (1 component source path(s))'
rm "$main/packages/kernel/src/untracked.ts"
original_annotated="$(git -C "$main" rev-parse v0.2.0)"
git -C "$main" update-ref refs/tags/v0.2.0 "$(git -C "$main" rev-parse v0.2.0^{commit})"
assert_surface_failure 'FAIL component-version @dotln/kernel: cannot compare with v0.2.0: latest published version v0.2.0 is absent or is not an annotated origin tag' --local
git -C "$main" update-ref refs/tags/v0.2.0 "$original_annotated"
write_release_block "$main" v0.2.0
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1'
write_release_block "$main" v0.2.1
printf '\nHistorical example outside the release block: `v9.9.9`.\n' >>"$main/README.md"
release_command check-surfaces >/dev/null
printf '# No release block\n' >"$main/README.md"
assert_surface_failure 'observed 0 begin marker(s), 0 end marker(s)'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-END -->' \
  'This source prepares DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-BEGIN -->' >"$main/README.md"
assert_surface_failure 'observed 1 begin marker(s), 1 end marker(s), order invalid'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source prepares DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-END -->' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source prepares DotLn `v0.2.1`.' \
  '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
assert_surface_failure 'observed 2 begin marker(s), 2 end marker(s)'
write_release_block "$main" v0.2.1
printf '<!-- DOTLN-RELEASE-BEGIN --> \n' >>"$main/README.md"
assert_surface_failure 'observed malformed release marker at README.md:'
write_release_block "$main" v0.2.1-beta
assert_surface_failure 'observed no strict version; expected exactly one v0.2.1'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source prepares DotLn `v0.2.1`, not `v9.9.9`.' \
  '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
assert_surface_failure 'observed v0.2.1, v9.9.9; expected exactly one v0.2.1'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source prepares DotLn `v0.2.1`.' \
  'A sentence an order appended.' \
  '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
assert_surface_failure 'observed 2 non-empty lines between the markers; expected exactly the generated line "This source prepares DotLn `v0.2.1`."; move other text outside the markers and rerun npm run release -- prepare'
printf '%s\n' \
  '<!-- DOTLN-RELEASE-BEGIN -->' \
  'This source prepares DotLn `v0.2.1`, and now also compiles tables.' \
  '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
assert_surface_failure 'observed line "This source prepares DotLn `v0.2.1`, and now also compiles tables."; expected exactly the generated line "This source prepares DotLn `v0.2.1`."'
write_release_block "$main" v0.2.1
printf '# WO-099 — malformed fixture target, v0.2.1-beta\n\n**Objective:** Reject a non-strict target.\n\n**Non-goals:** No distribution.\n' >"$main/docs/work-orders/WO-099-fixture.md"
if malformed_authority="$(release_command check-surfaces 2>&1)"; then
  printf 'error: surface check accepted a non-strict work-order target\n' >&2
  exit 1
fi
grep -Fq 'work-order heading must contain exactly one strict vX.Y.Z version' <<<"$malformed_authority"
# A target order publishes records without releasing this launchpad.
"$node_bin" - "$main" "$(git -C "$main" rev-parse HEAD)" <<'JS'
const fs = require('node:fs'), p = require('node:path'), root = process.argv[2];
const file = p.join(root, 'docs/control/resume.jsonl');
const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
for (const row of rows) if (row.type === 'WorkOrderActivated' && row.workOrderId === 'WO-099') {
  row.repositoryId = 'fixture-target'; row.baseCommit = process.argv[3];
}
fs.writeFileSync(file, rows.map(JSON.stringify).join('\n') + '\n');
fs.writeFileSync(p.join(root, 'docs/work-orders/WO-099-fixture.md'), '# WO-099 — target records fixture\n\n**Objective:** Publish records.\n');
JS
write_release_block "$main" v0.2.0
release_command check-surfaces | grep -Fq 'target order records no release'
git -C "$main" add .
git -C "$main" -c maintenance.auto=false commit -qm 'fixture: target records'
release_command check-surfaces --committed WO-099 | grep -Fq 'target order records no release'
write_release_block "$main" v0.1.0
assert_surface_failure 'expected one strict version at or above v0.2.0'
printf '%s\n' '<!-- DOTLN-RELEASE-BEGIN -->' 'This source prepares DotLn `v0.2.0`.' 'Unowned prose.' '<!-- DOTLN-RELEASE-END -->' >"$main/README.md"
assert_surface_failure 'observed 2 non-empty lines'
}

release_case_surfaces_local_snapshot() {
make_repo surfaces_local_snapshot
commit_candidate "$main" WO-099 v0.2.1
# A sibling's tag shares the namespace but is outside this subject's history.
git -C "$main" switch -c unrelated-release >/dev/null 2>&1
printf 'unrelated sibling source\n' >"$main/unrelated.txt"
git -C "$main" add unrelated.txt
git -C "$main" -c maintenance.auto=false commit -m 'unrelated sibling release' >/dev/null
git -C "$main" tag -a v0.2.2 -m 'unrelated sibling tag'
git -C "$main" switch main >/dev/null 2>&1
git -C "$main" remote remove origin
if ! local_surface="$(release_command check-surfaces --local)"; then
  printf '%s\n' "$local_surface" >&2
  exit 1
fi
grep -Fq 'Tag observation: local ancestors of HEAD only; publication checks origin.' <<<"$local_surface"
grep -Fq 'latest local tag v0.2.0' <<<"$local_surface"
if release_command check-surfaces >/dev/null 2>&1; then
  printf 'error: remote surface check did not require origin\n' >&2
  exit 1
fi
printf 'local release surfaces ignored an unrelated sibling tag and passed without a remote; authoritative check still requires origin\n'
}

release_case_prepare_independent() {
make_repo prepare_independent
"$node_bin" "$script_dir/test-reader-fixture.mjs" "$main"
git -C "$main" switch -qc unrelated-preparation
git -C "$main" -c maintenance.auto=false commit --allow-empty -qm 'Unintegrated ordinary release'
git -C "$main" tag -a v9.0.0 -m 'Ordinary unrelated release'
git -C "$main" switch -q main
git -C "$main" switch -c wo-099 >/dev/null 2>&1
mkdir -p "$main/docs/control/orders" "$main/docs/product"
printf '# WO-099 — fixture (v0.2.0)\n\n**Release classification:** patch. Existing scope.\n\n**Objective:** Fixture retiming.\n' >"$main/docs/work-orders/WO-099-fixture.md"
printf '# Roadmap\n\n## Release boundary\n\nPreserve the existing boundary.\n' >"$main/docs/product/06-roadmap.md"
printf '%s\n' '{"schemaVersion":1,"type":"WorkOrderActivated","workOrderId":"WO-099","workOrderPath":"docs/work-orders/WO-099-fixture.md"}' >"$main/docs/control/orders/WO-099.jsonl"
printf '%s\n' '{"schemaVersion":1,"type":"WorkOrderActivated","workOrderId":"WO-100","workOrderPath":"docs/work-orders/WO-100-fixture.md"}' >"$main/docs/control/orders/WO-100.jsonl"
write_control_events "$main/docs/control/orders/WO-101.jsonl" WO-101 docs/work-orders/WO-101-fixture.md
cp -R "$main/docs/control" "$fixture/control-before"
cp "$main/docs/product/06-roadmap.md" "$fixture/roadmap-before"
git -C "$main" for-each-ref >"$fixture/refs-before"
# --integration belongs to a pending worktree integrate, whose decision records
# the collision; without one it refuses before any write (WO-086).
if integration_only="$(release_command prepare --local --integration 2>&1)"; then exit 1; fi
grep -Fq 'release prepare --integration is worktree integrate'"'"'s and needs its pending integration of WO-099' <<<"$integration_only"
cmp "$main/docs/product/06-roadmap.md" "$fixture/roadmap-before"
test ! -e "$main/docs/evidence/WO-099/decisions.md"
# With a pending integration, the flag is refused once a saved release outcome
# waits for the stub, and once the stub is written; nothing is written either way.
mkdir -p "$main/docs/control/local" "$main/docs/evidence/WO-099"
printf '%s\n' '{"workOrder":"WO-099","complete":false,"stage":"applied","checkpointRef":"refs/dotln/checkpoint/WO-099/1","release":"Retimed WO-099: v0.2.0 → v0.2.1 above the observed release baseline v0.2.0."}' >"$main/docs/control/local/integration.json"
if waiting="$(release_command prepare --local --integration 2>&1)"; then exit 1; fi
grep -Fq 'release prepare --integration refuses: a saved release outcome waits for its integration decision stub; run npm run worktree -- integrate WO-099 --continue. Nothing was written.' <<<"$waiting"
printf '%s\n' '{"workOrder":"WO-099","complete":false,"stage":"applied","checkpointRef":"refs/dotln/checkpoint/WO-099/1"}' >"$main/docs/control/local/integration.json"
printf '# WO-099 decisions\n\n## WO-099-D001\n\n<!-- integration refs/dotln/checkpoint/WO-099/1 -->\n' >"$main/docs/evidence/WO-099/decisions.md"
if stubbed="$(release_command prepare --local --integration 2>&1)"; then exit 1; fi
grep -Fq 'release prepare --integration refuses: the integration decision stub is already written; run npm run worktree -- integrate WO-099 --continue. Nothing was written.' <<<"$stubbed"
cmp "$main/docs/product/06-roadmap.md" "$fixture/roadmap-before"
grep -Fxq '# WO-099 — fixture (v0.2.0)' "$main/docs/work-orders/WO-099-fixture.md"
rm -rf "$main/docs/control/local" "$main/docs/evidence/WO-099"
prepared="$(release_command prepare --local)"
grep -Fq 'Reader profile (releaseNotes):' <<<"$prepared"
grep -Fq 'Document kind: record. Reader: a user assessing a release before adoption' <<<"$prepared"
grep -Fxq 'Retimed WO-099: v0.2.0 → v0.2.1 above the observed release baseline v0.2.0.' <<<"$prepared"
# The collision is the order's decision; no product document changes (WO-086).
grep -Fxq 'Recorded WO-099-D001 in docs/evidence/WO-099/decisions.md.' <<<"$prepared"
grep -Fq '"superseded target v0.2.0"' "$main/docs/evidence/WO-099/decisions.md"
if ! grep -Fq 'ancestral local release tags, excluding annotated starter refresh tags' "$main/docs/evidence/WO-099/decisions.md"; then
  printf 'error: local preparation did not record its ancestral, non-starter tag observation\n' >&2
  exit 1
fi
cmp "$main/docs/product/06-roadmap.md" "$fixture/roadmap-before"
diff -r "$main/docs/control" "$fixture/control-before"
git -C "$main" for-each-ref >"$fixture/refs-after"
cmp "$fixture/refs-before" "$fixture/refs-after"
for written in docs/work-orders/WO-099-fixture.md README.md docs/evidence/WO-099/decisions.md; do
  grep -Fxq "  $written" <<<"$prepared"
done
# The writing guidance names the product sections that state the notes' rules;
# no other line of the output may name a product document.
if grep -Fq 'docs/product/' <<<"$(grep -v '^Contract: ' <<<"$prepared")"; then exit 1; fi
prepared_again="$(release_command prepare --local)"
grep -Fq 'no files changed' <<<"$prepared_again"
# An unchanged version can still change the process meter (WO-160).
cp "$script_dir/../docs/control/budgets.json" "$main/docs/control/budgets.json"
# Preparation keeps the reviewer's draft creation with the reviewer.
unowned="$(release_command prepare --local)"
test ! -e "$main/docs/final-reviews/WO-099/PR.md"
mkdir -p "$main/docs/final-reviews/WO-099"
printf '# Reviewed fixture body\n\nReviewer-authored explanation.\n' >"$main/docs/final-reviews/WO-099/PR.md"
"$node_bin" --input-type=module - "$main" <<'JS'
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
const root=process.argv[2];
const {regeneratedPullRequestBody}=await import(pathToFileURL(join(root,'scripts/release.mjs')));
const body=await regeneratedPullRequestBody(root,'WO-099','HEAD');
assert.match(body,/Reviewer-authored explanation\./);
assert.match(body,/<!-- dotln-process-meter:start -->/);
JS
pr_only="$(release_command prepare --local)"
grep -Fq 'target v0.2.1 remains current' <<<"$pr_only"
grep -Fxq '  docs/final-reviews/WO-099/PR.md' <<<"$pr_only"
grep -Fxq 'Reviewer-authored explanation.' "$main/docs/final-reviews/WO-099/PR.md"
if grep -Fq 'no files changed' <<<"$pr_only"; then exit 1; fi
# No session journal of the order here: no snapshot, and it says why (WO-170).
grep -Fxq 'Meter snapshot not written: this checkout holds no session journal of WO-099.' <<<"$pr_only"
test ! -e "$main/docs/evidence/WO-099/meta.json"
meter_again="$(release_command prepare --local)"
grep -Fxq '  docs/final-reviews/WO-099/PR.md' <<<"$meter_again"
# With one, prepare writes the order's own row, within 8 KB, beside the meter block.
mkdir -p "$main/docs/control/local/harness"
printf '%s\n' \
  '{"workOrder":"WO-099","role":"executor","event":"PreToolUse","refused":true}' \
  '{"workOrder":"WO-099","event":"Stop","finished":false}' \
  '{"workOrder":"WO-100","event":"Stop","finished":false}' \
  '{"workOrder":"WO-099","typedEvent":"OperatorCorrectionReceived","eventId":"correction:0","phase":"implementation"}' \
  >"$main/docs/control/local/harness/$(printf 'a%.0s' {1..64}).jsonl"
snapshotted="$(release_command prepare --local)"
grep -Fxq '  docs/final-reviews/WO-099/PR.md' <<<"$snapshotted"
grep -Fxq '  docs/evidence/WO-099/meta.json' <<<"$snapshotted"
grep -Eq '^Meter snapshot: docs/evidence/WO-099/meta\.json, [0-9]+ bytes\.$' <<<"$snapshotted"
test "$(wc -c <"$main/docs/evidence/WO-099/meta.json")" -le 8192
node -e '
const snapshot = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
const [row, ...others] = snapshot.orders;
const { guardRefusals, stopRefusals, operatorCorrections } = row.metrics;
if (others.length || row.workOrder !== "WO-099" || guardRefusals !== 1 || stopRefusals !== 1 || operatorCorrections !== 1 || row.corrections.source !== "session-journal")
  throw new Error(`unexpected snapshot ${JSON.stringify(row.metrics)}`);
' "$main/docs/evidence/WO-099/meta.json"
grep -Fq '| Corrections | Directions |' "$main/docs/final-reviews/WO-099/PR.md"
release_command check-surfaces --local >/dev/null
# A placeholder heading is assigned from the latest tag and recorded (WO-086).
printf '# WO-099 — fixture (version assigned at activation)\n\n**Release classification:** patch. Existing scope.\n\n**Objective:** Fixture retiming.\n' >"$main/docs/work-orders/WO-099-fixture.md"
write_release_block "$main" v0.2.0
assigned="$(release_command prepare --local)"
grep -Fxq 'Assigned WO-099: v0.2.1, the next patch above the observed release baseline v0.2.0.' <<<"$assigned"
grep -Fxq 'Recorded WO-099-D002 in docs/evidence/WO-099/decisions.md.' <<<"$assigned"
head -1 "$main/docs/work-orders/WO-099-fixture.md" | grep -Fxq '# WO-099 — fixture (v0.2.1)'
cmp "$main/docs/product/06-roadmap.md" "$fixture/roadmap-before"
release_command check-surfaces --local >/dev/null
printf 'release preparation CLI recorded its collision and assignment as decisions, preserved three independent control segments, all Git refs and the roadmap\n'
}

release_case_meter_shape() {
make_repo meter_shape
"$node_bin" "$script_dir/test-reader-fixture.mjs" "$main"
git -C "$main" switch -c wo-099 >/dev/null 2>&1
mkdir -p "$main/docs/control/orders" "$main/docs/product" "$main/docs/final-reviews/WO-099"
printf '# WO-099 — fixture (v0.2.0)\n\n**Release classification:** patch. Existing scope.\n\n**Objective:** Fixture retiming.\n' >"$main/docs/work-orders/WO-099-fixture.md"
printf '# Roadmap\n\n## Release boundary\n\nPreserve the existing boundary.\n' >"$main/docs/product/06-roadmap.md"
printf '%s\n' '{"schemaVersion":1,"type":"WorkOrderActivated","workOrderId":"WO-099","workOrderPath":"docs/work-orders/WO-099-fixture.md"}' >"$main/docs/control/orders/WO-099.jsonl"
cp "$script_dir/../docs/control/budgets.json" "$main/docs/control/budgets.json"
# A stored body whose meter block drifted between the heading and the prose.
printf '# WO-099\n\n<!-- dotln-process-meter:start -->\n\nstale meter\n\n<!-- dotln-process-meter:end -->\n\nFirst reviewed paragraph.\n\nSecond reviewed paragraph.\n' >"$main/docs/final-reviews/WO-099/PR.md"
moved="$(release_command prepare --local)"
grep -Fxq '  docs/final-reviews/WO-099/PR.md' <<<"$moved"
"$node_bin" - "$main/docs/final-reviews/WO-099/PR.md" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const body = fs.readFileSync(process.argv[2], "utf8");
const block = /<!-- dotln-process-meter:start -->[\s\S]*?<!-- dotln-process-meter:end -->/u.exec(body);
assert.ok(block, "meter block present");
assert.equal(body.slice(0, block.index), "# WO-099\n\nFirst reviewed paragraph.\n\nSecond reviewed paragraph.\n\n", "the prose keeps its bytes and precedes the block");
assert.equal(body.slice(block.index + block[0].length), "\n", "the block is last");
assert.doesNotMatch(body, /stale meter/u);
JS
"$node_bin" --input-type=module - "$main" <<'JS'
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {readFileSync, writeFileSync} from 'node:fs';
const root=process.argv[2];
const path=join(root,'docs/final-reviews/WO-099/PR.md');
const stored=readFileSync(path,'utf8');
// A body whose block drifted back before the prose regenerates with the block last.
writeFileSync(path, '# WO-099\n\n<!-- dotln-process-meter:start -->\n\nold\n\n<!-- dotln-process-meter:end -->\n\nFirst reviewed paragraph.\n\nSecond reviewed paragraph.\n');
const {regeneratedPullRequestBody}=await import(pathToFileURL(join(root,'scripts/release.mjs')));
const body=await regeneratedPullRequestBody(root,'WO-099','HEAD');
assert.match(body,/^# WO-099\n\nFirst reviewed paragraph\.\n\nSecond reviewed paragraph\.\n\n<!-- dotln-process-meter:start -->/u);
assert.match(body,/<!-- dotln-process-meter:end -->\n$/u);
assert.doesNotMatch(body,/old/u);
writeFileSync(path, stored);
JS
# The shape check judges the current order's stored body at check-surfaces.
release_command check-surfaces --local >/dev/null
printf 'Prose before the heading.\n\n# WO-099\n\nParagraph.\n' >"$main/docs/final-reviews/WO-099/PR.md"
assert_surface_failure 'FAIL github-body-profile: observed docs/final-reviews/WO-099/PR.md:1: pull-request body shape: the first non-blank line must be a level-one heading' --local
printf '# WO-099\n\n<!-- dotln-process-meter:start -->\n\nmeter\n\n<!-- dotln-process-meter:end -->\n\nParagraph after the block.\n' >"$main/docs/final-reviews/WO-099/PR.md"
assert_surface_failure 'FAIL github-body-profile: observed docs/final-reviews/WO-099/PR.md:3: pull-request body shape: a prose paragraph must stand between the heading and the process-meter block' --local
printf '# WO-099\n\nParagraph.\n\n<!-- dotln-process-meter:start -->\n\nmeter\n\n<!-- dotln-process-meter:end -->\n\nTrailing paragraph.\n' >"$main/docs/final-reviews/WO-099/PR.md"
assert_surface_failure 'FAIL github-body-profile: observed docs/final-reviews/WO-099/PR.md:10: pull-request body shape: the process-meter block must be the last block' --local
printf '# WO-099\n\nParagraph.\n\n<!-- dotln-process-meter:start -->\n\nmeter\n\n<!-- dotln-process-meter:end -->\n' >"$main/docs/final-reviews/WO-099/PR.md"
shaped="$(release_command check-surfaces --local)"
grep -Fq 'PASS github-body-profile: observed docs/final-reviews/WO-099/PR.md' <<<"$shaped"
printf 'release prepare keeps the meter block last and check-surfaces judges the stored body shape of the current order only\n'
}

release_case_license_surfaces() {
make_repo license_surfaces
commit_candidate "$main" WO-099 v0.2.1
surface_pass="$(release_command check-surfaces)"
grep -Fq 'PASS license-surfaces packages/kernel/package.json npm publish --dry-run: observed exit 1; DOTLN_PACKAGE_PUBLISH_REFUSED' <<<"$surface_pass"
for field in license private; do
  "$node_bin" -e 'const fs = require("node:fs"); const path = process.argv[1]; const data = JSON.parse(fs.readFileSync(path)); delete data[process.argv[2]]; fs.writeFileSync(path, JSON.stringify(data));' "$main/packages/kernel/package.json" "$field"
  assert_surface_failure "FAIL license-surfaces packages/kernel/package.json $field: observed missing; expected"
  printf '%s\n' "$surface_failure_output" | sed -n "/FAIL license-surfaces packages\/kernel\/package.json $field:/p"
  node "$script_dir/test-license-fixture.mjs" "$main"
done
printf '\nchanged license bytes\n' >>"$main/LICENSE"
assert_surface_failure 'FAIL license-surfaces LICENSE: observed sha256:'
printf '%s\n' "$surface_failure_output" | sed -n '/FAIL license-surfaces LICENSE:/p'
node "$script_dir/test-license-fixture.mjs" "$main"
release_command check-surfaces >/dev/null
printf 'license-surfaces release preflight fixtures passed (real npm dry runs)\n'
}

release_case_surfaces_committed_readme() {
make_repo surfaces_committed_readme
commit_candidate "$main" WO-099 v0.2.1
write_release_block "$main" v0.2.0
git -C "$main" add README.md
git -C "$main" -c maintenance.auto=false commit --amend --no-edit >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" update-index --assume-unchanged README.md
write_release_block "$main" v0.2.1
release_command check-surfaces >/dev/null
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1' --committed
}

release_case_surfaces_lower() {
make_repo surfaces_lower
commit_candidate "$main" WO-099 v0.0.2 v0.2.0
git -C "$main" push origin main >/dev/null 2>&1
release_command check-surfaces >/dev/null
write_release_block "$main" v0.0.2
assert_surface_failure 'FAIL release-block: observed v0.0.2; expected exactly one v0.2.0 (work-order target v0.0.2; latest published v0.2.0)'
}

release_case_surfaces_first() {
make_repo surfaces_first
git -C "$main" tag -d v0.2.0 >/dev/null
git --git-dir="$origin" update-ref -d refs/tags/v0.2.0
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
first_surface="$(release_command check-surfaces)"
grep -Fq 'PASS release-block: observed v0.2.1; expected v0.2.1 (work-order target v0.2.1; latest published none)' <<<"$first_surface"
}

release_case_surfaces_component() {
make_repo surfaces_component
printf '\n// source change\n' >>"$main/packages/kernel/src/core.ts"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
assert_surface_failure 'FAIL component-version @dotln/kernel: src changed; observed 0.1.0; previous v0.2.0 0.1.0; expected a different version'
assert_surface_failure 'FAIL component-version @dotln/kernel: src changed; observed 0.1.0; previous v0.2.0 0.1.0; expected a different version' --local
git -C "$main" update-index --assume-unchanged packages/kernel/package.json
printf '{"name":"@dotln/kernel","version":"0.1.1"}\n' >"$main/packages/kernel/package.json"
node "$script_dir/test-license-fixture.mjs" "$main"
release_command check-surfaces >/dev/null
assert_surface_failure 'FAIL component-version @dotln/kernel: src changed; observed 0.1.0; previous v0.2.0 0.1.0; expected a different version' --committed
}

release_case_surfaces_non_source() {
make_repo surfaces_non_source
mkdir -p "$main/packages/kernel/test"
printf 'test-only change\n' >"$main/packages/kernel/test/example.test.ts"
printf '# Package documentation change\n' >"$main/packages/kernel/README.md"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
non_source_surface="$(release_command check-surfaces)"
grep -Fq 'PASS component-version @dotln/kernel: src unchanged; observed 0.1.0; previous v0.2.0 0.1.0' <<<"$non_source_surface"
}

release_case_surfaces_new_component() {
make_repo surfaces_new_component
mkdir -p "$main/packages/new-component/src"
printf 'export const first = true;\n' >"$main/packages/new-component/src/index.ts"
printf '{"name":"@dotln/new-component","version":"0.1.0"}\n' >"$main/packages/new-component/package.json"
node "$script_dir/test-license-fixture.mjs" "$main"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
new_component_surface="$(release_command check-surfaces)"
grep -Fq 'PASS component-version @dotln/new-component: src changed; observed 0.1.0; previous v0.2.0 no component with this identity; expected first-version baseline' <<<"$new_component_surface"
printf 'release surface version and component fixtures passed\n'
}

normalize_close_surface_report() {
  "$node_bin" -e '
const fs = require("node:fs"), assert = require("node:assert/strict"), lines = fs.readFileSync(0, "utf8").split("\n");
const prefix = "Advisory: retained ignored material: ";
if (lines[0].startsWith(prefix)) {
  const summary = JSON.parse(lines[0].slice(prefix.length).split("; use --list-material")[0]);
  assert.match(summary.digest, /^sha256:[a-f0-9]{64}$/);
  assert.ok(summary.count > 0);
  assert.equal(Object.values(summary.countsByClass).reduce((sum, count) => sum + count, 0), summary.count);
  assert.ok(!lines[0].includes("docs/control/local/"), "default advisory has no path list");
  lines.shift();
}
process.stdout.write(lines.join("\n"));'
}

release_case_surfaceclose() {
make_repo surfaceclose
git clone -c maintenance.auto=false "$origin" "$fixture/integrator" >/dev/null 2>&1
git -C "$fixture/integrator" config user.email test@example.invalid
git -C "$fixture/integrator" config user.name "DotLn Surface Integrator"
git -C "$fixture/integrator" switch main >/dev/null 2>&1
commit_candidate "$fixture/integrator" WO-099 v0.2.1
write_release_block "$fixture/integrator" v0.2.0
git -C "$fixture/integrator" add README.md
git -C "$fixture/integrator" -c maintenance.auto=false commit --amend --no-edit >/dev/null
git -C "$fixture/integrator" push origin main >/dev/null 2>&1
test "$(git -C "$main" rev-parse HEAD)" != "$(git --git-dir="$origin" rev-parse refs/heads/main)"
seed_release_close_writer
rm "$main/packages/skeleton/dist/src/harness-host.js"
if unbuilt_output="$(CODEX_THREAD_ID=fixture-close-session release_close WO-099 --publish 2>&1)"; then
  printf 'error: release close accepted stale surfaces with an unbuilt runtime\n' >&2
  exit 1
fi
grep -Fq 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1' <<<"$unbuilt_output"
test -f "$main/docs/control/local/harness/writer.json"
test ! -e "$npm_log"
seed_release_close_writer
if close_surface_output="$(CODEX_THREAD_ID=fixture-close-session release_close WO-099 --publish 2>&1)"; then
  printf 'error: release close accepted a stale release block\n' >&2
  exit 1
fi
test -f "$main/docs/control/local/harness/writer.json"
test "$(git -C "$main" rev-parse HEAD)" = "$(git -C "$main" rev-parse origin/main)"
test ! -e "$npm_log"
assert_no_candidate_tag "$main" "$origin"
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1'
"$node_bin" - "$main/docs/control/local/retained/WO-099/release-close.json" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.equal(record.publication.outcome, "refused");
assert.equal(record.publication.tag, "v0.2.1");
assert.equal(record.publication.tagOutcome, null);
assert.match(record.publication.refusal, /FAIL release-block/);
assert.equal(record.cleanup.outcome, "not-attempted");
assert.equal(record.steps.find(step => step.name === 'runtime').startedAt, null);
JS
# The compact advisory varies with close locks and retained attempt receipts.
# Its shape and absence of paths are checked separately from the surface report.
expected_close_output="$surface_failure_output"
close_surface_normalized="$(printf '%s' "$close_surface_output" | normalize_close_surface_report)"
if [[ "$close_surface_normalized" != "$expected_close_output" ]]; then
  diff -u <(printf '%s\n' "$expected_close_output") <(printf '%s\n' "$close_surface_normalized") >&2
  exit 1
fi
if listed_surface_output="$(CODEX_THREAD_ID=fixture-close-session release_close WO-099 --publish --list-material 2>&1)"; then
  printf 'error: listing material bypassed release-surface refusal\n' >&2; exit 1
fi
grep -Fq 'docs/control/local/harness/writer.json' <<<"$listed_surface_output"
test ! -e "$npm_log"
if summary="$(release_close_summary WO-099 --publish)"; then
  printf 'error: summary close accepted a stale release block\n' >&2; exit 1
fi
grep -Fq 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1' <<<"$summary"
helper_node="$("$node_bin" -p 'process.execPath')"
if ! grep -Fq "Retry: '$helper_node' '$main/scripts/release.mjs' close WO-099 --publish" <<<"$summary"; then
  printf 'error: refusal summary lacks the canonical helper retry\n%s\n' "$summary" >&2; exit 1
fi
grep -Fq 'Full report:' <<<"$summary"
}

release_case_surfaceclose_linked() {
make_repo surfaceclose_linked
linked_subject="$fixture/project-wo099"
git -C "$main" worktree add "$linked_subject" -b wo-099 main >/dev/null
commit_candidate "$linked_subject" WO-099 v0.2.1
write_release_block "$linked_subject" v0.2.0
git -C "$linked_subject" add README.md
git -C "$linked_subject" -c maintenance.auto=false commit --amend --no-edit >/dev/null
git -C "$linked_subject" push origin HEAD:main >/dev/null 2>&1
if linked_close_surface_output="$(release_close WO-099 --publish 2>&1)"; then
  printf 'error: linked-worktree release close accepted a stale release block\n' >&2
  exit 1
fi
test -d "$linked_subject" # publication failed, so cleanup must not run
test ! -e "$npm_log"
assert_no_candidate_tag "$main" "$origin"
assert_surface_failure 'FAIL release-block: observed v0.2.0; expected exactly one v0.2.1'
test "$(printf '%s' "$linked_close_surface_output" | normalize_close_surface_report)" = "$surface_failure_output"
}

release_case_bodyclose() {
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
git -C "$main" -c maintenance.auto=false commit --amend --no-edit >/dev/null
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
}

release_case_dirty() {
make_repo dirty
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
printf 'tracked dirt\n' >>"$main/README.md"
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: tracked dirt published\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
git -C "$main" checkout -- README.md
printf 'untracked retained\n' >"$main/untracked.txt"
foreign_path=".env.fixture${u202f}"$'\n'"foreign"
assert_u202f "$foreign_path"
printf 'IGNORED=fixture\n' >"$main/$foreign_path"
ignored_output="$(release_close WO-099 --publish)"
grep -Fq 'Published annotated v0.2.1' <<<"$ignored_output"
grep -Fq 'retained untracked material:' <<<"$ignored_output"
"$node_bin" -e 'const a=require("node:assert/strict"); a.match(process.argv[1], /"digest":"sha256:[a-f0-9]{64}"/); for(const name of process.argv.slice(2)) a.ok(!process.argv[1].includes(name));' "$ignored_output" "$foreign_path" untracked.txt
listed_output="$(release_close WO-099 --publish --list-material)"
"$node_bin" -e 'const a=require("node:assert/strict"); for(const name of process.argv.slice(2)) a.ok(process.argv[1].includes(name));' "$listed_output" "$foreign_path" untracked.txt
test -f "$main/untracked.txt"
test -f "$main/$foreign_path"
}

release_case_unreachable() {
make_repo unreachable
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
# Egress is proven before any local prerequisite, and the dry run names the
# host it needs (WO-044).
reachable_output="$(release_close WO-099 --dry-run)"
grep -Fq 'Origin reachable: github.com' <<<"$reachable_output"
mv -- "$origin" "$origin.away"
if unreachable_output="$(release_close WO-099 --dry-run 2>&1)"; then printf 'error: unreachable origin passed the dry run\n' >&2; exit 1; fi
grep -Fq 'release close needs network egress to github.com' <<<"$unreachable_output"
grep -Fq 'authorized close from a session with egress' <<<"$unreachable_output"
printf 'dirty\n' >"$main/untracked.txt"
if publish_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: unreachable origin published\n' >&2; exit 1; fi
grep -Fq 'release close needs network egress to github.com' <<<"$publish_output"
if grep -Fq 'working tree is not clean' <<<"$publish_output"; then printf 'error: a local prerequisite was reported before egress\n' >&2; exit 1; fi
rm -- "$main/untracked.txt"
mv -- "$origin.away" "$origin"
assert_no_candidate_tag "$main" "$origin"
printf 'release close proves origin reachability before any local prerequisite\n'
}

release_case_derived() {
make_repo derived
commit_candidate "$main" WO-099 v0.0.2 v0.2.0
git -C "$main" push origin main >/dev/null 2>&1
# A close whose subject worktree is already gone still settles the order's
# derived worktrees, in the preview and in the close (WO-044).
derived_clean="$fixture/project-wo099-measure-001"
derived_dirty="$fixture/project-wo099-measure-002"
git -C "$main" worktree add --detach "$derived_clean" >/dev/null 2>&1
git -C "$main" worktree add --detach "$derived_dirty" >/dev/null 2>&1
printf 'unsaved\n' >"$derived_dirty/notes.txt"
seed_release_close_writer
derived_preview="$(CODEX_THREAD_ID=fixture-close-session release_close WO-099 --dry-run)"
test -f "$main/docs/control/local/harness/writer.json"
grep -Fq "Derived worktree $derived_clean: would remove" <<<"$derived_preview"
grep -Fq "Derived worktree $derived_dirty: kept (uncommitted changes); operator: commit, stash or discard the changes in '$derived_dirty' from an operator terminal, then retry with node" <<<"$derived_preview"
test -d "$derived_clean"
derived_output="$(CODEX_THREAD_ID=fixture-close-session release_close WO-099 --publish)"
# A retained dirty derivative is a cleanup blocker, so the dispatch's writer
# remains until a later retry observes completed cleanup.
test -f "$main/docs/control/local/harness/writer.json"
grep -Fq "Derived worktree $derived_clean: removed" <<<"$derived_output"
grep -Fq "Derived worktree $derived_dirty: kept (uncommitted changes)" <<<"$derived_output"
grep -Fq 'below latest release v0.2.0' <<<"$derived_output"
test ! -e "$derived_clean"
test -f "$derived_dirty/notes.txt"
git -C "$main" worktree remove --force "$derived_dirty" >/dev/null
CODEX_THREAD_ID=fixture-close-session release_close WO-099 --publish >/dev/null
test ! -e "$main/docs/control/local/harness/writer.json"
printf 'release close settled derived worktrees without a subject worktree\n'
}

release_case_settings_scope() {
make_repo settings_scope
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
mkdir -p "$main/.claude"
printf '/.claude/other.local.json\n' >>"$main/.git/info/exclude"
printf 'other ignored harness state\n' >"$main/.claude/other.local.json"
settings_scope_output="$(release_close WO-099 --publish --list-material)"
grep -Fq '.claude/other.local.json' <<<"$settings_scope_output"
grep -Fq 'Published annotated v0.2.1' <<<"$settings_scope_output"
test -f "$main/.claude/other.local.json"
printf 'release close reports ignored harness state without refusing publication\n'
}

release_case_nonmain() {
make_repo nonmain
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" worktree add "$fixture/other" -b other >/dev/null
if (cd "$fixture/other" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$main/scripts/release.mjs" close WO-099 --publish >/dev/null 2>&1); then printf 'error: non-main release close succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
}

release_case_divergence() {
make_repo divergence
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
printf 'local divergence\n' >"$main/local.txt"
git -C "$main" add local.txt
git -C "$main" -c maintenance.auto=false commit -m 'local-only commit' >/dev/null
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: divergent main release close succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
}

release_case_malformed() {
make_repo malformed
commit_candidate "$main" WO-099 v0.2
git -C "$main" push origin main >/dev/null 2>&1
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: malformed release version succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
}

release_case_missinggh() {
make_repo missinggh
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
mkdir -p "$fixture/no-gh-bin"
ln -s "$bin/git" "$fixture/no-gh-bin/git"
ln -s "$node_bin" "$fixture/no-gh-bin/node"
ln -s "$real_npm" "$fixture/no-gh-bin/npm"
ln -s /bin/sh "$fixture/no-gh-bin/sh"
missing_gh_trace="$fixture/git.trace"
if missing_gh_output="$(cd "$main" && PATH="$fixture/no-gh-bin" DOTLN_NPM_LOG="$npm_log" GIT_TRACE="$missing_gh_trace" "$node_bin" "$main/scripts/release.mjs" close WO-099 --publish 2>&1)"; then printf 'error: release accepted missing gh\n' >&2; exit 1; fi
test -s "$missing_gh_trace"
grep -Fq 'gh is required before tag creation' <<<"$missing_gh_output"
if grep -Fq ' mktag' "$missing_gh_trace"; then printf 'error: missing gh reached git mktag\n' >&2; exit 1; fi
test ! -e "$npm_log"
assert_no_candidate_tag "$main" "$origin"
}

release_case_unauthenticated() {
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
}

release_case_splitorigin() {
make_repo splitorigin
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" remote set-url --push origin https://github.com/dotln-fixture/wrong-target.git
if split_origin_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: split fetch/push GitHub targets accepted\n' >&2; exit 1; fi
grep -Fq 'matching GitHub HOST/OWNER/REPO fetch and push target' <<<"$split_origin_output"
test ! -e "$npm_log"
test ! -e "$gh_log"
assert_no_candidate_tag "$main" "$origin"
}

release_case_lower() {
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
"$node_bin" - "$main/docs/control/local/retained/WO-099/release-close.json" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.equal(record.publication.outcome, "no-release");
assert.equal(record.publication.tag, "v0.0.2");
assert.equal(record.publication.tagOutcome, null);
assert.equal(record.cleanup.outcome, "clean");
assert.ok(record.prune, 'close records its prune');
for (const field of ['candidates','removed','retained','blockers']) assert.ok(Array.isArray(record.prune[field]), field);
assert.equal(record.blockers.length, 0);
JS
# Cleanup still imports the current runtime when no new release is due.
test "$(cat "$npm_log")" = build
test "$(git -C "$main" status --porcelain)" = ""
test -f "$main/$intake_path"
test -f "$main/.claude/settings.local.json"
assert_no_candidate_tag "$main" "$origin" v0.0.2
}

release_case_failures() {
make_repo failures
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
if DOTLN_FIXTURE_NPM_FAIL=build release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: build failure published\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
# A source change after the reviewed row is not covered by that observation.
printf 'changed source\n' >>"$main/scripts/release.fixture.mjs"
git -C "$main" add .
git -C "$main" -c maintenance.auto=false commit -m 'fixture source after review' >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
if mismatch="$(release_close WO-099 --publish 2>&1)"; then printf 'error: mismatched reviewer code published\n' >&2; exit 1; fi
grep -Fq 'reviewed code identity differs' <<<"$mismatch"
assert_no_candidate_tag "$main" "$origin"
}

release_case_cadence_missing() {
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
}

release_case_cadence_inconsistent() {
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
}

release_case_conflict() {
make_repo conflict
base_commit="$(git -C "$main" rev-parse HEAD)"
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" tag -a v0.2.1 "$base_commit" -m 'conflicting historical tag'
git -C "$main" push origin refs/tags/v0.2.1 >/dev/null 2>&1
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: conflicting tag accepted\n' >&2; exit 1; fi
test "$(git --git-dir="$origin" rev-list -n 1 v0.2.1)" = "$base_commit"
}

release_case_localconflict() {
make_repo localconflict
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" tag -a v0.2.1 -m 'conflicting local-only tag'
local_conflict_object="$(git -C "$main" rev-parse v0.2.1^{tag})"
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: local-only conflicting tag accepted\n' >&2; exit 1; fi
test "$(git -C "$main" rev-parse v0.2.1^{tag})" = "$local_conflict_object"
if git --git-dir="$origin" show-ref --verify --quiet refs/tags/v0.2.1; then printf 'error: local-only conflict reached origin\n' >&2; exit 1; fi
}

release_case_nestedtag() {
make_repo nestedtag
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" tag -a v0.2.1/child -m 'nested local tag conflict'
if nested_tag_output="$(release_close WO-099 --publish 2>&1)"; then printf 'error: nested local tag conflict accepted\n' >&2; exit 1; fi
grep -Fq 'release tag v0.2.1 is blocked by nested tag v0.2.1/child' <<<"$nested_tag_output"
test "$(git -C "$main" cat-file -t v0.2.1/child)" = tag
assert_no_candidate_tag "$main" "$origin"
}

release_case_prepare() {
make_repo prepare
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
prepare_output="$(release_close WO-099)"
grep -Fq 'Prepared and validated v0.2.1' <<<"$prepare_output"
helper_node="$("$node_bin" -p 'process.execPath')"
grep -Fq "'$helper_node' '$main/scripts/release.mjs' close WO-099 --publish" <<<"$prepare_output"
assert_no_candidate_tag "$main" "$origin"
test "$(git -C "$main" status --porcelain)" = ""
}

release_case_missinglocalprevious() {
make_repo missinglocalprevious
git -C "$main" tag -d v0.2.0 >/dev/null
git -C "$main" config remote.origin.tagOpt --no-tags
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
missing_local_previous_output="$(release_close WO-099)"
grep -Fq 'Prepared and validated v0.2.1' <<<"$missing_local_previous_output"
test "$(git -C "$main" cat-file -t v0.2.0)" = tag
assert_no_candidate_tag "$main" "$origin"
}

release_case_pushfail() {
make_repo pushfail
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
printf '%s\n' '#!/usr/bin/env bash' 'case "$1" in refs/tags/v0.2.1) exit 1 ;; esac' 'exit 0' >"$origin/hooks/update"
chmod +x "$origin/hooks/update"
if release_close WO-099 --publish >/dev/null 2>&1; then printf 'error: rejected tag push succeeded\n' >&2; exit 1; fi
assert_no_candidate_tag "$main" "$origin"
if grep -q '^release ' "$gh_log"; then printf 'error: gh release ran before a successful tag push\n' >&2; exit 1; fi
}

release_case_refrecovery() {
make_repo refrecovery
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
if ref_failure="$(DOTLN_FIXTURE_GIT_FAIL=update-ref release_close WO-099 --publish 2>&1)"; then printf 'error: local tag-ref failure reported success\n' >&2; exit 1; fi
grep -Fq 'tag published; GitHub Release not created; rerun the same command' <<<"$ref_failure"
test ! "$(git -C "$main" tag --list v0.2.1)"
test "$(git --git-dir="$origin" cat-file -t v0.2.1)" = tag
if grep -q '^release ' "$gh_log"; then printf 'error: gh release ran after failed local tag ref\n' >&2; exit 1; fi
rm "$main/packages/kernel/dist/src/index.js"
ref_recovery_builds_before="$(grep -c '^build$' "$npm_log")"
ref_recovery_output="$(release_close WO-099 --publish)"
grep -Fq 'GitHub Release created' <<<"$ref_recovery_output"
test -f "$main/packages/kernel/dist/src/index.js"
test "$(grep -c '^build$' "$npm_log")" = "$((ref_recovery_builds_before + 1))"
if grep -q '^test$\|^ci$' "$npm_log"; then exit 1; fi
if grep -Fq 'ignored stale artifact executed' "$main/packages/kernel/dist/src/index.js"; then printf 'error: equal-tag recovery trusted stale ignored build output\n' >&2; exit 1; fi
test "$(git -C "$main" cat-file -t v0.2.1)" = tag
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
}

release_case_createrecovery() {
make_repo createrecovery
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
if create_failure="$(DOTLN_FIXTURE_GH_FAIL=create release_close WO-099 --publish 2>&1)"; then printf 'error: gh release create failure reported success\n' >&2; exit 1; fi
grep -Fq 'tag published; GitHub Release not created; rerun the same command' <<<"$create_failure"
"$node_bin" - "$main/docs/control/local/retained/WO-099/release-close.json" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.equal(record.publication.outcome, "partially-published");
assert.equal(record.publication.tagOutcome, "published");
assert.equal(record.publication.release, null);
assert.match(record.publication.refusal, /fixture create failure/);
JS
test "$(git -C "$main" cat-file -t v0.2.1)" = tag
test "$(git -C "$main" rev-list -n 1 v0.2.1)" = "$(git --git-dir="$origin" rev-list -n 1 v0.2.1)"
test ! -e "$gh_state/v0.2.1.body"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
# A retry the forge double refuses at authentication still records the tag
# that stands on the remote.
if auth_failure="$(DOTLN_FIXTURE_GH_FAIL=auth release_close WO-099 --publish 2>&1)"; then printf 'error: unauthenticated retry after a published tag reported success\n' >&2; exit 1; fi
grep -Fq 'gh authentication is required' <<<"$auth_failure"
"$node_bin" - "$main/docs/control/local/retained/WO-099/release-close.json" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.equal(record.publication.tagOutcome, "already-published");
assert.equal(record.publication.tag, "v0.2.1");
assert.equal(record.publication.outcome, "partially-published");
assert.equal(record.publication.release, null);
assert.match(record.publication.refusal, /gh authentication/);
assert.equal(record.previousAttempts.at(-1).publication.tagOutcome, "published");
JS
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
create_recovery_builds_before="$(grep -c '^build$' "$npm_log")"
recovery_output="$(release_close WO-099 --publish)"
grep -Fq 'GitHub Release created' <<<"$recovery_output"
test "$(grep -c '^build$' "$npm_log")" = "$create_recovery_builds_before"
if grep -q '^test$\|^ci$' "$npm_log"; then exit 1; fi
test -f "$gh_state/v0.2.1.body"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2
release_close WO-099 --publish >/dev/null
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 2
if lookup_failure="$(DOTLN_FIXTURE_GH_FAIL=view release_close WO-099 --publish 2>&1)"; then printf 'error: failed GitHub Release lookup triggered success\n' >&2; exit 1; fi
grep -Fq 'GitHub Release state not verified and no create was attempted' <<<"$lookup_failure"
"$node_bin" - "$main/docs/control/local/retained/WO-099/release-close.json" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
// The Release an earlier attempt completed is carried and marked as carried.
assert.equal(record.publication.outcome, "already-published");
assert.equal(record.publication.tagOutcome, "already-published");
assert.equal(record.publication.release, "existing");
assert.equal(record.publication.releaseCarried, true);
JS
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
}

release_case_submodule_force() {
make_repo submodule_force
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
# A derived worktree holding a populated committed submodule with an unpushed
# commit is never force-removed: the settle names the submodule and keeps it.
git init -q --bare "$fixture/sub-origin.git"
seed="$fixture/sub-seed"
git init -q -b main "$seed"
printf 'seed\n' >"$seed/seed.txt"
git -C "$seed" add seed.txt
git -C "$seed" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm seed
git -C "$seed" push -q "$fixture/sub-origin.git" main
derived="$fixture/project-wo099-measure-001"
git -C "$main" worktree add --detach "$derived" >/dev/null 2>&1
git -C "$derived" -c protocol.file.allow=always submodule add -q "$fixture/sub-origin.git" vendor/sub
git -C "$derived" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'submodule' >/dev/null
printf 'unpushed\n' >"$derived/vendor/sub/unpushed.txt"
git -C "$derived/vendor/sub" add unpushed.txt
git -C "$derived/vendor/sub" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm unpushed
unpushed="$(git -C "$derived/vendor/sub" rev-parse HEAD)"
git -C "$derived" add vendor/sub
git -C "$derived" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'submodule pointer' >/dev/null
# An intake unit makes the removal a forced one, which is what the old code
# passed through; the refusal must come before that force.
mkdir -p "$derived/docs/intake/x"
git init -q "$derived/docs/intake/x"
printf 'raw\n' >"$derived/docs/intake/x/raw.txt"
git -C "$derived/docs/intake/x" add raw.txt
git -C "$derived/docs/intake/x" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm raw
# A scratch repository beside the submodule stays, because the refusal comes
# before any scratch removal, and the blocker gets no material command.
git init -q "$derived/.runtime/scratch-tool"
printf 'tool\n' >"$derived/.runtime/scratch-tool/tool.txt"
git -C "$derived/.runtime/scratch-tool" add tool.txt
git -C "$derived/.runtime/scratch-tool" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm tool
seed_release_close_writer
output="$(CODEX_THREAD_ID=fixture-close-session release_close WO-099 --publish)"
grep -Fq 'Published annotated v0.2.1' <<<"$output"
grep -Fq "Derived worktree $derived: kept (Worktree holds a submodule (vendor/sub); Git removes it only with --force, which would discard its unpushed commits; source retained. Push the submodule's commits, then remove this worktree from an operator terminal with git worktree remove --force '$derived' and retry" <<<"$output"
test -d "$derived/.runtime/scratch-tool/.git"
test -f "$derived/docs/intake/x/raw.txt"
test -d "$derived"
test "$(git -C "$derived/vendor/sub" cat-file -t "$unpushed")" = commit
record="$main/docs/control/local/retained/WO-099/release-close.json"
"$node_bin" - "$record" "$derived" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8")), derived = process.argv[3];
assert.equal(record.publication.outcome, "published");
assert.equal(record.cleanup.outcome, "blocked");
const settle = record.blockers.find((row) => row.action === "settle" && row.path === derived);
assert.match(settle.reason, /Worktree holds a submodule \(vendor\/sub\); Git removes it only with --force/);
assert.ok(settle.command.length > 0);
assert.equal(settle.disposableCommand, undefined, "a submodule refusal is not a material cause");
assert.ok(record.material.some((row) => row.path === ".runtime/scratch-tool"), "the scratch repository the refusal retained is listed");
assert.ok(!record.material.some((row) => row.path === "vendor/sub"));
JS
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
git -C "$main" worktree remove --force "$derived" >/dev/null
}

release_case_malformed_material() {
make_repo malformed_material
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
# A malformed word is refused with a close record, never a bare usage exit.
if release_close WO-099 --publish --material scratch-material/x=keep >/dev/null 2>&1; then printf 'error: malformed material word accepted\n' >&2; exit 1; fi
record="$main/docs/control/local/retained/WO-099/release-close.json"
"$node_bin" - "$record" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.equal(record.publication.outcome, "refused");
assert.match(record.publication.refusal, /usage: --material <path>=disposable\|preserve/);
assert.equal(record.publication.tagOutcome, null);
assert.deepEqual(record.overrides, []);
assert.equal(record.publication.requested, true);
assert.ok(record.blockers.some((row) => row.action === "publication"));
JS
assert_no_candidate_tag "$main" "$origin"
test ! -f "$gh_state/v0.2.1.body"
}

release_case_stale_helpers() {
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
git -C "$main" -c maintenance.auto=false commit -m 'fixture stale main lifecycle helpers' >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
stale_subject="$fixture/project-wo099"
git -C "$main" worktree add "$stale_subject" -b wo-099 >/dev/null
cp "$script_dir/release.mjs" "$script_dir/worktree.mjs" "$stale_subject/scripts/"
commit_candidate "$stale_subject" WO-099 v0.2.1
git -C "$stale_subject" push -u origin wo-099 >/dev/null 2>&1
git clone -c maintenance.auto=false "$origin" "$fixture/integrator" >/dev/null 2>&1
git -C "$fixture/integrator" config user.email test@example.invalid
git -C "$fixture/integrator" config user.name "DotLn Stale-Helper Integrator"
git -C "$fixture/integrator" switch main >/dev/null 2>&1
git -C "$fixture/integrator" merge --ff-only origin/wo-099 >/dev/null
git -C "$fixture/integrator" push origin main >/dev/null 2>&1
mkdir -p "$main/.claude" "$stale_subject/docs/intake/dist"
printf 'persistent operator settings\n' >"$main/.claude/settings.local.json"
printf 'protected staged intake\n' >"$stale_subject/docs/intake/dist/x.md"
stale_intake_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" DOTLN_STALE_RELEASE_MARKER="$stale_release_marker" DOTLN_STALE_WORKTREE_MARKER="$stale_worktree_marker" "$node_bin" "$stale_subject/scripts/release.mjs" close WO-099 --dry-run --list-material 2>&1)"
stale_intake_output="$(retained_close_output "$stale_intake_output")"
grep -Fq 'docs/intake/dist/x.md' <<<"$stale_intake_output"
test -f "$main/.claude/settings.local.json"
test -f "$stale_subject/docs/intake/dist/x.md"
test -d "$stale_subject"
test -n "$(git -C "$main" branch --list wo-099)"
test ! -e "$stale_release_marker"
test ! -e "$stale_worktree_marker"
test ! -e "$main/docs/intake/dist/x.md"
stale_close_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" DOTLN_STALE_RELEASE_MARKER="$stale_release_marker" DOTLN_STALE_WORKTREE_MARKER="$stale_worktree_marker" "$node_bin" "$stale_subject/scripts/release.mjs" close WO-099)"
stale_close_output="$(retained_close_output "$stale_close_output")"
grep -Fq 'Prepared and validated v0.2.1' <<<"$stale_close_output"
test -d "$stale_subject"
test ! -e "$main/docs/intake/dist/x.md"
assert_no_candidate_tag "$main" "$origin"
stale_published_output="$(release_close WO-099 --publish)"
grep -Fq 'Published annotated v0.2.1' <<<"$stale_published_output"
grep -Fxq 'protected staged intake' "$main/docs/intake/dist/x.md"
test -f "$main/.claude/settings.local.json"
test ! -e "$stale_subject"
test "$(git -C "$main" branch --list wo-099)" = ""
test "$(git -C "$main" rev-parse HEAD)" = "$(git -C "$main" rev-parse origin/main)"
test ! -e "$stale_release_marker"
test ! -e "$stale_worktree_marker"
test "$(git -C "$main" cat-file -t v0.2.1)" = tag
printf 'reviewed subject helpers preview before fast-forward; cleanup follows publication only\n'
}

release_case_runtime_refresh() {
# Every scenario fast-forwards the actual main checkout; no external network.
for scenario in close-changed close-matching close-lower close-lower-snapshot finish-changed finish-matching finish-snapshot finish-failed; do
  make_repo "runtime-$scenario"
  if [[ "$scenario" == *matching || "$scenario" == *snapshot ]]; then
    runtime_before='console.log("fixture skeleton bootstrap");'
  else
    runtime_before='console.log("old fixture runtime");'
  fi
  runtime_pin() {
    "$node_bin" --input-type=module - "$1" "$2" "$3" <<'NODE'
import fs from "node:fs";
import path from "node:path";
const [root, contents, materialize]=process.argv.slice(2);
const bytes=contents+"\n";
let hash=0xcbf29ce484222325n;
for(const byte of new TextEncoder().encode(bytes)) hash=BigInt.asUintN(64,(hash^BigInt(byte))*0x100000001b3n);
const digest=hash.toString(16).padStart(16,"0");
const runtime={snapshot:`.runtime/harness/${digest}`,files:[{path:"packages/skeleton/dist/src/cli.js",hash:`fnv1a64:${digest}`}]};
fs.mkdirSync(path.join(root,".claude"),{recursive:true});
fs.writeFileSync(path.join(root,".claude/harness-manifest.json"),JSON.stringify({profiles:[{profile:{runtime}}]})+"\n");
if(materialize==="yes") for(const prefix of ["",runtime.snapshot]) {
 const target=path.join(root,prefix,runtime.files[0].path);
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);
}
NODE
  }
  runtime_pin "$main" "$runtime_before" yes
  mkdir -p "$main/packages/kernel/dist/src"
  cp "$main/packages/kernel/test-fixtures/runtime-valid.mjs" "$main/packages/kernel/dist/src/index.js"
  git -C "$main" add .claude/harness-manifest.json
  git -C "$main" -c maintenance.auto=false commit -m 'fixture installed old runtime pins' >/dev/null
  git -C "$main" push origin main >/dev/null 2>&1
  subject="$fixture/project-wo099"
  git -C "$main" worktree add "$subject" -b wo-099 >/dev/null
  runtime_pin "$subject" 'console.log("fixture skeleton bootstrap");' no
  if [[ "$scenario" == close-lower* ]]; then
    commit_candidate "$subject" WO-099 v0.0.2 v0.2.0
  else
    commit_candidate "$subject" WO-099 v0.2.1
  fi
  git -C "$subject" push -u origin wo-099 >/dev/null 2>&1
  git clone -c maintenance.auto=false "$origin" "$fixture/integrator" >"$fixture/integrator-clone.log" 2>&1 || {
    cat "$fixture/integrator-clone.log" >&2
    return 1
  }
  git -C "$fixture/integrator" switch main >/dev/null 2>&1
  git -C "$fixture/integrator" merge --ff-only origin/wo-099 >/dev/null
  git -C "$fixture/integrator" push origin main >/dev/null 2>&1
  if [[ "$scenario" == close-changed ]]; then
    # Old metadata would fail the cadence projection; the rebuilt runtime must win.
    cp "$main/packages/kernel/test-fixtures/runtime-inconsistent-evaluable.mjs" "$main/packages/kernel/dist/src/index.js"
  fi
  if [[ "$scenario" == *snapshot ]]; then
    "$node_bin" -e 'require("node:fs").rmSync(process.argv[1],{recursive:true,force:true})' "$main/.runtime/harness"
  fi
  runtime_started="$($node_bin -e 'process.stdout.write(String(Date.now()))')"
  if [[ "$scenario" == close-lower* ]]; then
    summary="$(release_close_summary WO-099 --publish)"
    printf '%s\n' "$summary" >"$fixture/summary.log"
    retained_close_output "$summary" >"$fixture/refresh.log"
    if grep -Fq 'Building release metadata runtime' "$fixture/summary.log"; then
      printf 'WO-195 refresh announcement escaped the retained report\n' >&2; return 1
    fi
    grep -Fq 'Building release metadata runtime' "$fixture/refresh.log"
    grep -Fq 'no-release' "$fixture/summary.log"
    grep -Fq 'Full report:' "$fixture/summary.log"
    printf 'WO-195 no-release summary bytes %s=%s\n' "$scenario" "$(printf '%s' "$summary" | wc -c | tr -d ' ')"
    assert_no_candidate_tag "$main" "$origin" v0.0.2
  elif [[ "$scenario" == close-* ]]; then
    release_close WO-099 --publish >"$fixture/refresh.log"
    test -f "$gh_state/v0.2.1.body"
  elif [[ "$scenario" == finish-failed ]]; then
    if (cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_FIXTURE_NPM_FAIL=build "$node_bin" scripts/worktree.mjs finish WO-099 >"$fixture/refresh.log" 2>&1); then
      printf 'error: failed runtime build was accepted\n' >&2; exit 1
    fi
    test -d "$subject"
    test -n "$(git -C "$main" branch --list wo-099)"
    grep -Fq 'worktree preserved' "$fixture/refresh.log"
    continue
  else
    (cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" scripts/worktree.mjs finish WO-099 >"$fixture/refresh.log")
  fi
  "$node_bin" - "$runtime_started" "$scenario" <<'NODE'
const elapsed=Date.now()-Number(process.argv[2]);
if(elapsed>=120000) throw new Error(`runtime refresh exceeded 120s: ${elapsed}`);
console.log(`WO-133 ${process.argv[3]} elapsedMs=${elapsed}`);
NODE
  "$node_bin" --input-type=module - "$main" <<'NODE'
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
const root=process.argv[2];
const {harnessRuntimeCause}=await import(pathToFileURL(root+"/scripts/lib/harness-runtime.mjs"));
assert.equal(harnessRuntimeCause(root),null);
NODE
  if [[ "$scenario" == *changed || "$scenario" == *snapshot || "$scenario" == close-lower ]]; then
    test "$(grep -c '^build$' "$npm_log")" = 1
  else
    test ! -s "$npm_log"
  fi
  test ! -d "$subject"
done
}

release_case_success() {
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
git -C "$main" -c maintenance.auto=false commit -m 'fixture distinct control schema export' >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
subject="$fixture/project-wo099"
git -C "$main" worktree add "$subject" -b wo-099 >/dev/null
tracked_path="scripts/release.${u202f}"$'\n'"fixture.mjs"
leading_path=" ${u202f}leading.md"
assert_u202f "$tracked_path"
assert_u202f "$leading_path"
printf 'tracked Unicode fixture\n' >"$subject/$tracked_path"
printf 'leading-space fixture\n' >"$subject/$leading_path"
commit_candidate "$subject" WO-099 v0.2.1
git -C "$subject" push -u origin wo-099 >/dev/null 2>&1
git clone -c maintenance.auto=false "$origin" "$fixture/integrator" >/dev/null 2>&1
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
mkdir -p "$main/docs/control/local/harness" "$subject/docs/control/local/harness" "$main/docs/intake" "$subject/docs/intake"
printf 'retained main terms\n' >"$main/docs/control/local/terms.txt"
printf 'main cache\n' >"$main/docs/control/local/harness/fixture.json"
printf 'subject cache\n' >"$subject/docs/control/local/harness/fixture.json"
printf 'main original\n' >"$main/docs/intake/collision.md"
printf 'subject original\n' >"$subject/docs/intake/collision.md"
printf 'subject new note\n' >"$subject/docs/intake/new.md"
touch "$npm_log" "$gh_log"
preview_head="$(git -C "$main" rev-parse HEAD)"
preview_npm="$(wc -l <"$npm_log")"
preview_gh="$(wc -l <"$gh_log")"
preview_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" "$subject/scripts/release.mjs" close WO-099 --publish --dry-run --list-material)"
preview_output="$(retained_close_output "$preview_output")"
grep -Fq 'collision.md.from-WO-099' <<<"$preview_output"
test "$(git -C "$main" rev-parse HEAD)" = "$preview_head"
test "$(wc -l <"$npm_log")" -eq "$((preview_npm + 1))"
if grep -q '^test$\|^ci$' "$npm_log"; then printf 'error: preview executed a gate or install\n' >&2; exit 1; fi
grep -Fq '"reviewedTree"' <<<"$preview_output"
grep -Fq '"mergeTree"' <<<"$preview_output"
test "$(wc -l <"$gh_log")" = "$preview_gh"
test ! -e "$main/docs/intake/new.md"
test -f "$subject/docs/intake/new.md"
# Bootstrap path: main is intentionally behind the merged PR, so invoke the
# reviewed helper from the subject while its working directory is main. The
# helper may remove the worktree containing its own loaded source.
success_output="$(cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" "$subject/scripts/release.mjs" close WO-099 --publish)"
success_output="$(retained_close_output "$success_output")"
grep -Fq 'Published annotated v0.2.1' <<<"$success_output"
grep -Fxq 'retained main terms' "$main/docs/control/local/terms.txt"
grep -Fxq 'main original' "$main/docs/intake/collision.md"
grep -Fxq 'subject original' "$main/docs/intake/collision.md.from-WO-099"
grep -Fxq 'subject new note' "$main/docs/intake/new.md"

grep -Fq 'GitHub Release created' <<<"$success_output"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
grep -Eq '^release create v0\.2\.1 --repo github\.com/dotln-fixture/success --verify-tag --title DotLn v0\.2\.1 --notes-file .+/RELEASE\.md$' "$gh_log"
grep -Fq 'npm run release -- notes v0.2.1' "$gh_state/v0.2.1.body"
grep -Fq 'npm run release -- manifest-from-tag v0.2.1' "$gh_state/v0.2.1.body"
if grep -Fq 'DOTLN-MANIFEST-BEGIN' "$gh_state/v0.2.1.body"; then printf 'error: GitHub Release body contains manifest JSON\n' >&2; exit 1; fi
grep -Fq 'build' "$npm_log"
if grep -q '^ci$\|^test$' "$npm_log"; then printf 'error: close ran an install or suite\n' >&2; exit 1; fi
test ! -e "$subject"
test "$(git -C "$main" branch --list wo-099)" = ""
test "$(git -C "$main" status --porcelain)" = ""
test "$(git -C "$main" rev-parse HEAD)" = "$(git -C "$main" rev-parse origin/main)"
test "$(git --git-dir="$origin" rev-parse refs/heads/main)" = "$merged_main"
test "$(git -C "$main" cat-file -t v0.2.1)" = tag
test "$(git -C "$main" rev-list -n 1 v0.2.1)" = "$(git --git-dir="$origin" rev-list -n 1 v0.2.1)"
test "$(git -C "$main" rev-list -n 1 v0.2.1)" = "$(git -C "$main" rev-parse HEAD)"
test "$(git -C "$main" rev-parse v9.9.9^{tag})" = "$unrelated_tag_object"
remote_tags="$(git --git-dir="$origin" for-each-ref --format='%(refname)' | LC_ALL=C sort)"
test "$remote_tags" = $'refs/heads/main\nrefs/heads/wo-099\nrefs/tags/v0.2.0\nrefs/tags/v0.2.1'
published_object="$(git -C "$main" rev-parse v0.2.1^{tag})"
case "$main/node_modules" in "$test_root"/*/node_modules) rm -rf -- "$main/node_modules" ;; *) exit 1 ;; esac
rerun_builds_before="$(grep -c '^build$' "$npm_log")"
rerun_output="$(release_close WO-099 --publish)"
grep -Fq 'v0.2.1 is already published' <<<"$rerun_output"
test "$(git -C "$main" rev-parse v0.2.1^{tag})" = "$published_object"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
test "$(grep -c '^build$' "$npm_log")" = "$rerun_builds_before"
for metadata in name draft prerelease assets; do
  if metadata_output="$(DOTLN_FIXTURE_GH_METADATA="$metadata" release_close WO-099 --publish 2>&1)"; then
    printf 'error: mismatched GitHub Release %s accepted\n' "$metadata" >&2; exit 1
  fi
  grep -Fq 'GitHub Release metadata differs' <<<"$metadata_output"
  test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
  test "$(git --git-dir="$origin" for-each-ref --format='%(refname)' | LC_ALL=C sort)" = "$remote_tags"
done
test ! -d "$main/node_modules"
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
}

release_case_custom_identity() {
make_repo custom_identity
printf '{"version":1,"release":{"displayName":"Example Starter"}}\n' >"$main/dotln.config.json"
commit_reviewed_candidate "$main" WO-024 v0.2.1
"$node_bin" - "$main/README.md" <<'JS'
const fs = require("node:fs"), file = process.argv[2];
fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("This source prepares DotLn ", "This source prepares Example Starter "));
JS
git -C "$main" add README.md
git -C "$main" -c maintenance.auto=false commit -qm 'test: configured release claim'
git -C "$main" push origin main >/dev/null 2>&1
release_close WO-024 --publish >/dev/null
test "$(cat "$gh_state/v0.2.1.body.title")" = 'Example Starter v0.2.1'
release_command notes v0.2.1 >"$fixture/custom-notes.md"
grep -Fxq 'Example Starter v0.2.1' "$fixture/custom-notes.md"
release_command list >"$fixture/custom-list.txt"
grep -Fq v0.2.1 "$fixture/custom-list.txt"
custom_tag="$(git -C "$main" rev-parse refs/tags/v0.2.1)"
release_close WO-024 --publish >/dev/null
test "$(git -C "$main" rev-parse refs/tags/v0.2.1)" = "$custom_tag"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
printf '{"version":1,"release":{"displayName":"Renamed Starter"}}\n' >"$main/dotln.config.json"
git -C "$main" add dotln.config.json
git -C "$main" -c maintenance.auto=false commit -qm 'test: later instance rename'
PATH="$bin:$PATH" "$node_bin" --input-type=module - "$main" "$fixture/custom-notes.md" <<'JS'
import assert from "node:assert/strict";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
const [root, notes] = process.argv.slice(2);
const { regeneratedReleaseText } = await import(pathToFileURL(`${root}/scripts/release.mjs`));
assert.equal(regeneratedReleaseText(root, "v0.2.1") + "\n", fs.readFileSync(notes, "utf8"));
const { localReleaseRecords } = await import(pathToFileURL(`${root}/scripts/lib/release-records.mjs`));
// The synthetic baseline has deliberately minimal attribution; select the
// complete custom release using its immutable tag observation.
const { localTags } = await import(pathToFileURL(`${root}/scripts/lib/release-tags.mjs`));
assert.equal(localReleaseRecords(root, [localTags(root).get("v0.2.1")])[0].name, "v0.2.1");
JS
release_command notes v0.2.1 >"$fixture/custom-notes-after.md"
cmp "$fixture/custom-notes.md" "$fixture/custom-notes-after.md"
test "$(git -C "$main" rev-parse refs/tags/v0.2.1)" = "$custom_tag"
}

release_case_edition() {
make_repo edition
git -C "$main" switch -c fixture-legacy >/dev/null 2>&1
commit_legacy_multicommit_candidate "$main" WO-023 v0.2.1
git -C "$main" switch main >/dev/null 2>&1
git -C "$main" merge --no-ff fixture-legacy -m 'WO-023 merged legacy fixture' >/dev/null
git -C "$main" switch -c fixture-reviewed >/dev/null 2>&1
commit_reviewed_candidate "$main" WO-024 v0.2.1
git -C "$main" switch main >/dev/null 2>&1
git -C "$main" merge --no-ff fixture-reviewed -m 'WO-024 merged reviewed fixture' >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
cp "$main/docs/final-reviews/WO-024/RELEASE-NOTES.md" "$fixture/edition-reviewed-notes.md"
"$node_bin" - "$fixture/edition-reviewed-notes.md" <<'NODE'
const fs = require("node:fs");
const file = process.argv[2];
fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(
  "- Reviewer compatibility line.",
  "- Reviewer compatibility line.\n- Outer [a [b]() d](../../evidence/WO-024/decisions.md).",
));
NODE
for malformed in quoted-definition; do
  "$node_bin" - "$fixture/edition-reviewed-notes.md" "$main/docs/final-reviews/WO-024/RELEASE-NOTES.md" "$malformed" <<'NODE'
const fs = require("node:fs");
const [saved, target] = process.argv.slice(2);
const replacement = "- The fix is described in [the record][r].\n\n> [r]: ../../evidence/WO-024/decisions.md";
fs.writeFileSync(target, fs.readFileSync(saved, "utf8").replace("- Reviewer evidence line.", replacement));
NODE
  git -C "$main" add docs/final-reviews/WO-024/RELEASE-NOTES.md
  git -C "$main" -c maintenance.auto=false commit -qm "test: malformed $malformed release notes"
  git -C "$main" push origin main >/dev/null 2>&1
  if malformed_edition_output="$(release_close WO-024 --publish 2>&1)"; then
    printf 'error: Release accepted %s relative link after rewriting\n' "$malformed" >&2; exit 1
  fi
  grep -Fq 'docs/final-reviews/WO-024/RELEASE-NOTES.md # Evidence and compatibility' <<<"$malformed_edition_output"
  grep -Fq 'relative link remains after rewrite' <<<"$malformed_edition_output"
  assert_no_candidate_tag "$main" "$origin"
  if test -f "$gh_log" && grep -q '^release create ' "$gh_log"; then
    printf 'error: relative-link refusal followed a Release creation\n' >&2; exit 1
  fi
  cp "$fixture/edition-reviewed-notes.md" "$main/docs/final-reviews/WO-024/RELEASE-NOTES.md"
  git -C "$main" add docs/final-reviews/WO-024/RELEASE-NOTES.md
  git -C "$main" -c maintenance.auto=false commit -qm 'test: restore reviewed release notes'
  git -C "$main" push origin main >/dev/null 2>&1
done
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
"$node_bin" --input-type=module - "$fixture/edition-one.md" "$gh_state/v0.2.1.body" "$fixture/edition-manifest.json" "$fixture/edition-tag-object.txt" "$script_dir/lib/github-body.mjs" <<'NODE'
import assert from "node:assert/strict";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
const [notesPath, bodyPath, manifestPath, tagObjectPath, githubBodyPath] = process.argv.slice(2);
const { relativeLinkFailures } = await import(pathToFileURL(githubBodyPath));
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
assert.ok(notes.includes("**Fallback: no reviewed notes for WO-023 (predates WO-024); commit subjects:**\n\n- WO-023 merged legacy fixture"));
assert.ok(!notes.includes("WO-023 implementation part one"));
assert.ok(!notes.includes("WO-023 implementation part two"));
assert.ok(notes.includes("Reviewed overview prose remains on one physical source line even when it is longer than eighty characters, so the reader owns viewport wrapping."));
assert.ok(notes.includes("Reviewer warning prose remains on one physical source line even when it is longer than eighty characters, so the reader owns viewport wrapping."));
assert.ok(notes.includes("**Release operations.** Readers now receive the reviewed edition.\n\n### WO-999 is reviewer prose, not release membership\n\nThis heading must not affect the release list."));
assert.ok(notes.includes("## Progressive polish\n\n### WO-023"));
assert.ok(notes.includes("### WO-024\n\nNone."));
// The title is named once, under the overview; every section heading carries the identifier alone.
assert.equal(notes.split("**reviewed release fixture, v0.2.1**").length - 1, 1);
assert.equal((notes.match(/^### WO-024$/gm) ?? []).length, 5);
assert.ok(!notes.includes("### WO-024 — "));
assert.ok(notes.includes("- Reviewer evidence line.\n- Reviewer compatibility line."));
// A reviewed relative link is written absolute to the repository at the release commit.
const releaseCommit = JSON.parse(manifest).release.commit;
assert.ok(notes.includes(`- Evidence record: [the decisions](https://github.com/dotln-fixture/edition/blob/${releaseCommit}/docs/evidence/WO-024/decisions.md).`), notes);
assert.ok(notes.includes(`- Outer [a b d](https://github.com/dotln-fixture/edition/blob/${releaseCommit}/docs/evidence/WO-024/decisions.md).`), notes);
assert.deepEqual(relativeLinkFailures(notes), [], "every published destination is absolute after normalization");
assert.ok(!notes.includes("](../../evidence/"));
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
}

release_case_firstrelease() {
make_repo firstrelease
git -C "$main" tag -d v0.2.0 >/dev/null
git --git-dir="$origin" update-ref -d refs/tags/v0.2.0
first_release_path="${u202f}"$'\n'"first-release.md"
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
}

release_case_cached_evidence() {
make_repo cached_evidence
"$node_bin" - "$main/package-lock.json" <<'NODE'
const fs = require("node:fs"), path = process.argv[2];
const lock = JSON.parse(fs.readFileSync(path, "utf8"));
lock.packages["node_modules/fixture-dependency"] = { version: "1.0.0" };
fs.writeFileSync(path, JSON.stringify(lock, null, 2) + "\n");
NODE
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
test ! -f "$main/docs/control/local/harness/checks.json"
prepared="$(release_close WO-099)"
grep -Fq 'Prepared and validated' <<<"$prepared"
cache_output="$(release_close WO-099 --publish)"
grep -Fq 'Published annotated' <<<"$cache_output"
if grep -q '^test$\|^ci$\|^full$' "$npm_log"; then printf 'error: close executed a gate or install\n' >&2; exit 1; fi
release_command manifest-from-tag v0.2.1 >"$fixture/current-manifest.json"
release_command notes v0.2.1 >"$fixture/current-notes.md"
"$node_bin" - "$fixture/current-manifest.json" "$fixture/current-notes.md" "$gh_state/v0.2.1.body" <<'NODE'
const assert = require("node:assert/strict"), fs = require("node:fs");
const manifest = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
assert.deepEqual(manifest.evidence.map(row => row.command), ["npm test"]);
assert.match(manifest.evidence[0].codeIdentity, /^[a-f0-9]{64}$/);
assert.notEqual(manifest.evidence[0].reviewedTree, manifest.evidence[0].mergeTree);
assert.ok(manifest.notes.changedFiles.includes("package-lock.json"));
const notice = "The locked dependency graph changed; the release manifest records the reviewer’s npm test evidence for this code identity.";
assert.ok(manifest.notes.critical.includes(notice));
for (const path of process.argv.slice(3)) {
  const notes = fs.readFileSync(path, "utf8");
  assert.ok(notes.includes(notice));
  assert.doesNotMatch(notes, /npm ci|smoke|node packages\/skeleton\/dist\/src\/cli\.js/);
}
NODE
# Pin synthetic annotations in each historical evidence format. Recovery must
# reconstruct their original notices and complete notes without changing bytes.
for historical_contract in install full; do
  "$node_bin" - "$fixture" "$historical_contract" <<'NODE'
const fs = require("node:fs"), path = require("node:path");
const [fixture, contract] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(path.join(fixture, "current-manifest.json"), "utf8"));
const commands = contract === "install"
  ? ["npm ci", "npm test", "node packages/skeleton/dist/src/cli.js", "git status --porcelain"]
  : ["npm run test:full", "node packages/skeleton/dist/src/cli.js", "git status --porcelain"];
const treeHash = manifest.evidence[0].mergeTree;
manifest.evidence = commands.map(command => ({command, exitCode: 0, outputSha256: "a".repeat(64), ...(contract === "full" ? {treeHash, durationMs: 1} : {})}));
const notice = "The locked dependency graph changed; release evidence was run after a fresh npm ci.";
manifest.notes.critical = manifest.notes.critical.map(item => item.startsWith("The locked dependency graph changed;") ? notice : item);
const notes = fs.readFileSync(path.join(fixture, "current-notes.md"), "utf8")
  .replace(/The locked dependency graph changed;[^\n]+/, notice)
  .replace(/- Release evidence:\n[\s\S]*?\n- Review lineage:/,
    "- Release evidence:\n" + manifest.evidence.map(row => `  - \`${row.command}\`: exit 0; output SHA-256 \`${row.outputSha256}\``).join("\n") + "\n- Review lineage:");
fs.writeFileSync(path.join(fixture, "historical-notes.md"), notes);
fs.writeFileSync(path.join(fixture, "historical-tag.txt"), `${notes}\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest, null, 2)}\nDOTLN-MANIFEST-END\n`);
NODE
  git -C "$main" tag -f -a v0.2.1 --cleanup=verbatim -F "$fixture/historical-tag.txt" >/dev/null
  git -C "$main" push --force origin refs/tags/v0.2.1 >/dev/null 2>&1
  historical_object="$(git -C "$main" rev-parse v0.2.1^{tag})"
  historical_output="$(release_close WO-099)"
  grep -Fq 'v0.2.1 is already published' <<<"$historical_output"
  release_command notes v0.2.1 >"$fixture/recovered-notes.md"
  cmp "$fixture/historical-notes.md" "$fixture/recovered-notes.md"
  test "$(git -C "$main" rev-parse v0.2.1^{tag})" = "$historical_object"
done
printf 'reviewer evidence notes are truthful; both historical note formats reconstruct byte-for-byte\n'
}

release_case_composed_evidence() {
make_repo composed_evidence
"$node_bin" "$script_dir/test-reader-fixture.mjs" "$main"
git -C "$main" config user.email operator@example.invalid
git -C "$main" config user.name 'Fixture Operator'
printf '%s\n' '{"version":1,"contributions":{"operatorAuthor":"Fixture Operator <operator@example.invalid>"}}' >"$main/dotln.config.json"
git -C "$main" add dotln.config.json docs/control/reader-profiles.json docs/publication/examples
git -C "$main" -c maintenance.auto=false commit -m 'Fixture publication profiles' >/dev/null
subject="$fixture/project-wo099"
git -C "$main" worktree add -b wo-099 "$subject" main >/dev/null 2>&1
write_release_block "$subject" v0.2.1
"$node_bin" "$script_dir/test-release-composition.mjs" prepare "$subject"
export DOTLN_ONE_GATE_LOG="$fixture/one-gate.jsonl"
(cd "$subject" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" "$node_bin" "$script_dir/test-release-composition.mjs" lifecycle "$subject") >"$fixture/lifecycle.log"
PATH="$bin:$PATH" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" "$subject/scripts/worktree.mjs" publish WO-099 --title 'Fixture one-gate lifecycle' --body-file docs/final-reviews/WO-099/PR.md >"$fixture/publish.log" || { cat "$fixture/publish.log"; exit 1; }
grep -Fq 'Reader profile (prTitle):' "$fixture/publish.log"
grep -Fq 'Reader profile (prBody):' "$fixture/publish.log"
grep -Fq 'Document kind: record. Reader: a reviewer scanning pending changes' "$fixture/publish.log"
printf 'Main-only documentation after review.\n' >"$main/docs/merge-note.md"
git -C "$main" add docs/merge-note.md
git -C "$main" -c maintenance.auto=false commit -m 'Synthetic main-only document' >/dev/null
git -C "$main" merge --no-edit wo-099 >/dev/null
git -C "$main" push origin main >/dev/null 2>&1
test ! -f "$main/docs/control/local/harness/checks.json"
printf 'retain this unfinished local note\n' >"$subject/uncommitted.txt"
close_started="$($node_bin -e 'console.log(Date.now())')"
release_close WO-099 --publish >"$fixture/close.log"
grep -Fq 'Published annotated v0.2.1' "$fixture/close.log"
grep -Fq 'cleanup blocker' "$fixture/close.log"
test -f "$subject/uncommitted.txt"
close_elapsed="$($node_bin -e 'console.log(Date.now()-Number(process.argv[1]))' "$close_started")"
test "$close_elapsed" -lt 120000
"$node_bin" "$script_dir/test-release-composition.mjs" assert "$main"
test "$(grep -c '^test$' "$npm_log")" = 1
if grep -q '^ci$\|^full$' "$npm_log"; then printf 'error: close ran install or legacy gate\n' >&2; exit 1; fi
printf 'one-gate lifecycle close: %s ms excluding network (local transport fixture)\n' "$close_elapsed"
unset DOTLN_ONE_GATE_LOG
}

release_case_concurrent() {
make_repo concurrent
PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" "$script_dir/test-concurrent-control.mjs" "$fixture"
}

release_case_close_foreign_tag() {
make_repo close_foreign_tag
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push -q origin main
release_close_summary WO-099 --publish >/dev/null
published_tag="$(git -C "$main" rev-parse 'v0.2.1^{tag}')"
commit_candidate "$main" WO-100 v0.2.1
git -C "$main" push -q origin main
if foreign="$(release_close_summary WO-100 --publish 2>&1)"; then
  printf 'foreign release tag accepted\n' >&2; return 1
fi
grep -Fq 'v0.2.1 belongs to another order or commit' <<<"$foreign"
test "$(git --git-dir="$origin" rev-parse 'v0.2.1^{tag}')" = "$published_tag"
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
}

release_case_close_overlap() {
make_repo close_overlap
"$node_bin" --input-type=module - "$main/scripts/release.mjs" <<'JS'
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
const script = process.argv[2], original = readFileSync(script, "utf8");
const point = "Object.assign(record, history);";
assert.equal(original.split(point).length, 2);
writeFileSync(script, original.replace(point,
  `${point}\nif (process.env.DOTLN_FIXTURE_CLOSE_FIRST === "1") { writeFileSync(process.env.DOTLN_FIXTURE_CLOSE_MARKER, "ready"); await new Promise(resolve => setTimeout(resolve, 1500)); }`));
JS
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push -q origin main
# Hold the first attempt after it reads history. A second close started in
# that window must read the first receipt only after the order lock releases.
PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_GH_LOG="$gh_log" DOTLN_GH_STATE="$gh_state" DOTLN_GH_ORIGIN="$origin" "$node_bin" --input-type=module - "$main" "$fixture" <<'JS'
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const [main, fixture] = process.argv.slice(2);
const script = join(main, "scripts/release.mjs");
const marker = join(fixture, "first-close-ready");
const start = (first) => {
  const child = spawn(process.execPath, [script, "close", "WO-099", "--dry-run"], {
    cwd: main, env: { ...process.env, CODEX_THREAD_ID: "", COPILOT_AGENT_SESSION_ID: "", DOTLN_FIXTURE_CLOSE_FIRST: first ? "1" : "", DOTLN_FIXTURE_CLOSE_MARKER: marker },
  });
  let output = "";
  child.stdout.on("data", chunk => output += chunk);
  child.stderr.on("data", chunk => output += chunk);
  return new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", code => resolve({ code, output }));
  });
};
const first = start(true);
const deadline = Date.now() + 30000;
while (!existsSync(marker)) {
  assert.ok(Date.now() < deadline, "first close reached its history barrier");
  await new Promise(resolve => setTimeout(resolve, 10));
}
const results = await Promise.all([first, start(false)]);
for (const result of results) assert.equal(result.code, 0, result.output);
const record = JSON.parse(readFileSync(join(main, "docs/control/local/retained/WO-099/release-close.json")));
assert.equal(record.previousAttempts.length, 1, "both overlapping attempts remain recorded");
assert.ok(record.previousAttempts[0].recordedAt <= record.startedAt, "second attempt begins after the first receipt is written");
assert.equal(record.previousAttempts[0].publication.outcome, "preview");
assert.equal(record.publication.outcome, "preview");
JS
}

release_case_material() {
# Every nested repository outside intake is scratch, whether or not an ignore
# rule covers it, and leaves at close with no flag: its head commit and whether
# a remote held it are recorded, a keep row an earlier completion recorded no
# longer preserves it, an operator word can still preserve one, and intake
# survives every path.
for mode in lane scratch kept preserve intake untracked; do
  make_repo "material_$mode"
  subject="$fixture/project-wo099"
  git -C "$main" worktree add "$subject" -b wo-099 main >/dev/null
  printf 'scratch-material/\n' >>"$subject/.gitignore"
  case "$mode" in
    lane) material_path='.runtime/x' ;;
    intake) material_path='docs/intake/x' ;;
    kept) material_path="scratch-material/repo's space" ;;
    untracked) material_path='outside-lanes/probe' ;;
    *) material_path='scratch-material/x' ;;
  esac
  nested="$subject/$material_path"
  # Re-included intake directories can arise after the reviewed gate. Cover
  # the real ignore policy at cleanup without putting a directory into that
  # gate's file-only candidate tree. A repository cloned after review under a
  # path no ignore rule covers is scratch all the same.
  if [[ "$mode" == intake || "$mode" == untracked ]]; then
    commit_candidate "$subject" WO-099 v0.2.1
  fi
  mkdir -p "$nested"
  git -C "$nested" init -q
  printf 'nested repository fixture\n' >"$nested/saved.txt"
  git -C "$nested" add saved.txt
  git -C "$nested" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'nested fixture'
  if [[ "$mode" == scratch ]]; then
    # One repository whose head a remote holds, one whose head no remote holds.
    git init -q --bare "$fixture/nested-origin.git"
    git -C "$nested" remote add origin "$fixture/nested-origin.git"
    git -C "$nested" push -q origin HEAD:refs/heads/main
    git -C "$nested" fetch -q origin
    second="$subject/scratch-material/second"
    mkdir -p "$second"
    git -C "$second" init -q
    printf 'second repository fixture\n' >"$second/saved.txt"
    git -C "$second" add saved.txt
    git -C "$second" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'second nested fixture'
  fi
  if [[ "$mode" == kept ]]; then
    # A keep row an earlier completion recorded is history, not preservation.
    kept_rows="$("$node_bin" -e 'process.stdout.write(JSON.stringify([{ path: process.argv[1], lane: "other", disposition: "preserve", source: "declared", reason: "keep this repository" }]))' "$material_path")"
    DOTLN_FIXTURE_MATERIAL_ROWS="$kept_rows" commit_candidate "$subject" WO-099 v0.2.1
  elif [[ "$mode" != intake && "$mode" != untracked ]]; then
    DOTLN_FIXTURE_MATERIAL_SOURCE="$subject" commit_candidate "$subject" WO-099 v0.2.1
  fi
  head="$(git -C "$nested" rev-parse HEAD)"
  git -C "$subject" push origin HEAD:main >/dev/null 2>&1
  # Preview deliberately starts on an older main and consumes origin/main's handoff.
  if [[ "$mode" == lane ]]; then
    preview="$(CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' CLAUDE_CODE_SESSION_ID=fixture-claude-close CLAUDE_EFFORT=high release_close WO-099 --publish --dry-run)"
  elif [[ "$mode" == preserve ]]; then
    preview="$(CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' CLAUDE_CODE_SESSION_ID='' CLAUDE_SESSION_ID=fixture-claude-close CLAUDE_EFFORT=high release_close WO-099 --publish --dry-run --material "$material_path=preserve")"
  else
    preview="$(release_close WO-099 --publish --dry-run)"
  fi
  record="$main/docs/control/local/retained/WO-099/release-close.json"
  "$node_bin" - "$record" "$mode" "$head" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const [file, mode, head] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(file, "utf8"));
assert.equal(record.dryRun, true);
assert.equal(record.publication.outcome, "preview");
assert.equal(record.cleanup.outcome, "clean");
assert.ok(record.prune, 'close records its prune');
for (const field of ['candidates','removed','retained','blockers']) assert.ok(Array.isArray(record.prune[field]), field);
assert.equal(record.material.length, mode === "scratch" ? 2 : 1);
assert.equal(record.material[0].source, mode === "preserve" ? "declared" : "lane");
assert.ok(!record.blockers.some((row) => row.action === "material"));
if (mode === "intake" || mode === "preserve") assert.deepEqual(record.removals, []);
else {
  assert.equal(record.removals.length, mode === "scratch" ? 2 : 1);
  assert.ok(record.removals.every((row) => row.outcome === "would-remove"));
  assert.ok(record.removals.some((row) => row.head === head));
}
if (["lane", "preserve"].includes(mode)) {
  assert.equal(record.dispatch.harness, "claude-code");
  assert.equal(record.dispatch.session, "fixture-claude-close");
  assert.equal(record.dispatch.source, "claude-session-readback");
}
JS
  test -d "$nested"
  test ! -f "$gh_state/v0.2.1.body"
  if [[ "$mode" != intake && "$mode" != preserve ]]; then
    grep -Fq 'nested repository disposable; removed with the worktree' <<<"$preview"
    grep -Fq 'Scratch removal: {"worktree":' <<<"$preview"
  fi
  if [[ "$mode" == preserve ]]; then
    output="$(CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' CLAUDE_CODE_SESSION_ID=fixture-claude-close CLAUDE_EFFORT=high release_close WO-099 --publish --material "$material_path=preserve")"
  else
    output="$(CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' CLAUDE_CODE_SESSION_ID=fixture-claude-close CLAUDE_EFFORT=high release_close WO-099 --publish)"
  fi
  grep -Fq 'Published annotated v0.2.1' <<<"$output"
  "$node_bin" - "$record" "$mode" "$head" "$subject" "$material_path" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const [file, mode, head, subject, path] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(file, "utf8"));
assert.equal(record.dryRun, false);
assert.equal(record.publication.outcome, "published");
assert.equal(record.publication.tag, "v0.2.1");
assert.equal(record.publication.tagOutcome, "published");
assert.equal(record.publication.release, "created");
assert.equal(record.cleanup.outcome, "clean");
assert.ok(record.prune, 'close records its prune');
for (const field of ['candidates','removed','retained','blockers']) assert.ok(Array.isArray(record.prune[field]), field);
assert.equal(record.cleanup.worktrees[0].outcome, "removed");
assert.ok(!record.blockers.some((row) => row.action === "material"));
assert.equal(record.dispatch.harness, "claude-code");
assert.equal(record.dispatch.session, "fixture-claude-close");
assert.equal(record.dispatch.source, "claude-session-readback");
if (mode === "intake" || mode === "preserve") assert.deepEqual(record.removals, []);
else {
  const removal = record.removals.find((row) => row.path === path);
  assert.deepEqual([removal.worktree, removal.head, removal.outcome], [subject, head, "removed"]);
  assert.equal(removal.remoteHeld, mode === "scratch");
  if (mode === "scratch") {
    const second = record.removals.find((row) => row.path === "scratch-material/second");
    assert.equal(second.remoteHeld, false);
    assert.match(second.head, /^[0-9a-f]{40}$/);
  }
}
JS
  test ! -e "$subject"
  if [[ "$mode" == preserve ]]; then
    test "$(git -C "$main/docs/control/local/retained/WO-099/material/$material_path" show HEAD:saved.txt)" = 'nested repository fixture'
  elif [[ "$mode" == intake ]]; then
    test "$(git -C "$main/docs/intake/x" show HEAD:saved.txt)" = 'nested repository fixture'
  else
    test ! -e "$main/docs/control/local/retained/WO-099/material"
    test ! -e "$main/docs/control/local/retained/WO-099/recovery"
  fi
  test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
  test "$(git -C "$main" status --porcelain --untracked-files=no)" = ''
done
# A derived worktree's scratch repository is recorded under that worktree; its
# intake unit survives every path, and a word that would discard it refuses.
make_repo material_derived
subject="$fixture/project-wo099"
derived="$fixture/measurement-wo099"
material_path='scratch-material/x'
git -C "$main" worktree add "$subject" -b wo-099 main >/dev/null
printf 'scratch-material/\n' >>"$subject/.gitignore"
nested="$subject/$material_path"
mkdir -p "$nested"
git -C "$nested" init -q
printf 'saved before completion\n' >"$nested/saved.txt"
git -C "$nested" add saved.txt
git -C "$nested" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'nested fixture'
DOTLN_FIXTURE_MATERIAL_SOURCE="$subject" commit_candidate "$subject" WO-099 v0.2.1
git -C "$main" worktree add --detach "$derived" wo-099 >/dev/null
mkdir -p "$derived/$material_path"
git -C "$derived/$material_path" init -q
printf 'different derived work\n' >"$derived/$material_path/foreign.txt"
git -C "$derived/$material_path" add foreign.txt
git -C "$derived/$material_path" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'foreign derived commit'
derived_head="$(git -C "$derived/$material_path" rev-parse HEAD)"
mkdir -p "$derived/docs/intake/protected"
git -C "$derived/docs/intake/protected" init -q
printf 'protected intake bytes\n' >"$derived/docs/intake/protected/keep.txt"
git -C "$subject" push origin HEAD:main >/dev/null 2>&1
output="$(release_close WO-099 --publish --material "$derived::docs/intake/protected=disposable")"
grep -Fq 'Published annotated v0.2.1' <<<"$output"
grep -Fq 'Protected intake repositories cannot be declared disposable' <<<"$output"
test ! -e "$subject"
test "$(git -C "$derived/$material_path" show HEAD:foreign.txt)" = 'different derived work'
test -f "$derived/docs/intake/protected/keep.txt"
record="$main/docs/control/local/retained/WO-099/release-close.json"
"$node_bin" - "$record" "$derived" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const record = JSON.parse(fs.readFileSync(process.argv[2], "utf8")), derived = process.argv[3];
assert.equal(record.publication.outcome, "published");
assert.equal(record.cleanup.outcome, "blocked");
const kept = record.cleanup.worktrees.find((row) => row.path === derived);
assert.equal(kept.outcome, "retained");
assert.ok(kept.blockers.some((row) => /Protected intake/.test(row.reason)));
assert.equal(record.removals.filter((row) => row.worktree === derived).length, 0);
JS
retry="$(release_close WO-099 --publish)"
grep -Fq 'already published' <<<"$retry"
test ! -e "$derived"
test -f "$main/docs/intake/protected/keep.txt"
"$node_bin" - "$record" "$derived" "$derived_head" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const [file, derived, head] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(file, "utf8"));
assert.equal(record.publication.outcome, "already-published");
assert.equal(record.cleanup.outcome, "clean");
assert.ok(record.prune, 'close records its prune');
for (const field of ['candidates','removed','retained','blockers']) assert.ok(Array.isArray(record.prune[field]), field);
const removal = record.removals.find((row) => row.worktree === derived);
assert.deepEqual([removal.path, removal.head, removal.remoteHeld, removal.outcome], ["scratch-material/x", head, false, "removed"]);
JS
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
# A blocker a nested repository causes carries the material command naming
# every kept worktree's repositories; a settle blocker keeps its whole reason.
make_repo material_settle
subject="$fixture/project-wo099"
misnamed="$fixture/measurement-wo099-misnamed"
listed="$fixture/measurement-wo099-listed"
git -C "$main" worktree add "$subject" -b wo-099 main >/dev/null
printf 'scratch-material/\n' >>"$subject/.gitignore"
commit_candidate "$subject" WO-099 v0.2.1
for derived in "$misnamed" "$listed"; do
  git -C "$main" worktree add --detach "$derived" wo-099 >/dev/null
  mkdir -p "$derived/scratch-material/x"
  git -C "$derived/scratch-material/x" init -q
  printf 'derived scratch\n' >"$derived/scratch-material/x/saved.txt"
  git -C "$derived/scratch-material/x" add saved.txt
  git -C "$derived/scratch-material/x" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'derived scratch'
done
mkdir -p "$misnamed/docs/intake/protected"
git -C "$misnamed/docs/intake/protected" init -q
printf 'synthetic intake\n' >"$misnamed/docs/intake/protected/source.txt"
git -C "$misnamed/docs/intake/protected" add source.txt
git -C "$misnamed/docs/intake/protected" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'synthetic intake'
printf 'SECRET=fixture-only\n' >"$listed/.env"
git -C "$subject" push origin HEAD:main >/dev/null 2>&1
# The operator's word names a repository the worktree does not hold.
output="$(release_close WO-099 --publish --material "$misnamed::scratch-material/missing=preserve")"
grep -Fq 'Published annotated v0.2.1' <<<"$output"
grep -Fq 'Material retry: ' <<<"$output"
test ! -e "$subject"
test -d "$misnamed"
test -d "$listed"
record="$main/docs/control/local/retained/WO-099/release-close.json"
"$node_bin" - "$record" "$misnamed" "$listed" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const [file, misnamed, listed] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(file, "utf8"));
assert.equal(record.cleanup.outcome, "blocked");
const settle = (path) => record.blockers.find((row) => row.action === "settle" && row.path === path);
const listedBlocker = settle(listed);
assert.match(listedBlocker.reason, /kept \(worktree contains ignored material and will not be removed \(1 entry; only scratch repositories are removed\):\n  \.env: other lane: ignored file/);
assert.ok(!listedBlocker.disposableCommand, "an ignored file is not a material cause");
const misnamedBlocker = settle(misnamed);
assert.match(misnamedBlocker.reason, /Material word names no nested repository of this worktree: "scratch-material\/missing"/);
assert.ok(misnamedBlocker.command.includes(`--material '${misnamed}::scratch-material/x=preserve'`), misnamedBlocker.command);
assert.ok(misnamedBlocker.command.includes(`--material '${listed}::scratch-material/x=preserve'`), "every kept worktree is named");
assert.ok(misnamedBlocker.disposableCommand.includes(`--material '${misnamed}::scratch-material/x=disposable'`));
assert.ok(misnamedBlocker.command.includes(`--material '${misnamed}::docs/intake/protected=preserve'`));
assert.ok(!misnamedBlocker.disposableCommand.includes("docs/intake/protected"), "disposable retry excludes protected intake");
assert.ok(record.cleanup.worktrees.find((row) => row.path === misnamed).material.some((row) => row.path === "scratch-material/x"));
JS
printf '%s\n' "$output" >"$fixture/settle-output.txt"
CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' "$node_bin" "$script_dir/test-close-admission.mjs" "$main" WO-099 "$fixture/settle-output.txt" "$record"
rm -- "$listed/.env"
retry="$(release_close WO-099 --publish)"
grep -Fq 'already published' <<<"$retry"
test ! -e "$misnamed"
test ! -e "$listed"
"$node_bin" - "$record" "$misnamed" "$listed" <<'JS'
const assert = require("node:assert/strict"), fs = require("node:fs");
const [file, misnamed, listed] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(file, "utf8"));
assert.equal(record.cleanup.outcome, "clean");
assert.ok(record.prune, 'close records its prune');
for (const field of ['candidates','removed','retained','blockers']) assert.ok(Array.isArray(record.prune[field]), field);
for (const worktree of [misnamed, listed])
  assert.equal(record.removals.find((row) => row.worktree === worktree && row.path === "scratch-material/x").outcome, "removed");
JS
test "$(grep -c '^release create v0.2.1 ' "$gh_log")" = 1
printf 'material handoff, preview, cleanup, preservation and publication retry passed\n'
for result in success failure; do
  make_repo "material_record_io_$result"
  subject="$fixture/project-wo099"
  git -C "$main" worktree add "$subject" -b wo-099 main >/dev/null
  commit_candidate "$subject" WO-099 v0.2.1
  git -C "$subject" push origin HEAD:main >/dev/null 2>&1
  record="$main/docs/control/local/retained/WO-099/release-close.json"
  mkdir -p "$record"
  if [[ "$result" == success ]]; then
    output="$(release_close WO-099 --publish 2>&1)"
    grep -Fq 'Published annotated v0.2.1' <<<"$output"
    test ! -e "$subject"
  else
    if output="$(DOTLN_FIXTURE_GH_FAIL=create release_close WO-099 --publish 2>&1)"; then
      printf 'error: publication failure hidden by record failure\n' >&2; exit 1
    fi
    grep -Fq 'tag published; GitHub Release not created; rerun the same command' <<<"$output"
    grep -Fq 'fixture create failure' <<<"$output"
    test -d "$subject"
  fi
  grep -Fq 'Close record unavailable:' <<<"$output"
  test -d "$record"
  test "$(git --git-dir="$origin" cat-file -t v0.2.1)" = tag
done
printf 'record I/O preserves publication outcome and original errors\n'
}


# The sealed variant runs the same case from a template copy under its own
# fixture name, so a whole-script run does not copy onto the first run's tree.
release_case_close_completion() {
make_repo "${1:-close_completion}"
subject="$fixture/project-wo099"
git -C "$main" worktree add "$subject" -b wo-099 main >/dev/null
mkdir -p "$subject/.runtime/kept" "$subject/.runtime/snapshots/deep" "$fixture/outside"
if [[ "${1:-}" == close_compact ]]; then
  "$node_bin" - "$main" "$subject" <<'JS'
const fs=require('node:fs'),p=require('node:path');
for(const root of process.argv.slice(2)){const dir=p.join(root,'docs/control/local/compact');fs.mkdirSync(dir,{recursive:true});for(let i=0;i<2000;i++)fs.writeFileSync(p.join(dir,`material-${i}.txt`),'retained fixture bytes\n');}
JS
fi
printf 'preserved fixture bytes\n' >"$subject/.runtime/kept/saved.txt"
git -C "$subject/.runtime/kept" init -q
git -C "$subject/.runtime/kept" add .
git -C "$subject/.runtime/kept" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit -qm 'preserved fixture'
printf 'sealed disposable snapshot\n' >"$subject/.runtime/snapshots/deep/snapshot.txt"
ln -s "$fixture/outside" "$subject/.runtime/outside-link"
DOTLN_FIXTURE_MATERIAL_SOURCE="$subject" commit_candidate "$subject" WO-099 v0.2.1
git -C "$subject" push origin HEAD:main >/dev/null 2>&1
if [[ "${1:-}" == close_real_writer ]]; then
  local CODEX_THREAD_ID=fixture-close-session
  export CODEX_THREAD_ID
  seed_real_release_close_writer
fi
chmod 500 "$subject/.runtime/snapshots/deep" "$fixture/outside"
preview="$(release_close_summary WO-099 --dry-run --material .runtime/kept=preserve)"
if [[ "$selected_case" != close_sealed ]] && ! grep -Fq 'Branch wo-099: would-delete' <<<"$preview"; then
  chmod 700 "$subject/.runtime/snapshots/deep" "$fixture/outside"
  printf 'WO-195 branch deletion preview missing\n' >&2; return 1
fi
test -d "$subject"
if [[ "$selected_case" != close_sealed ]]; then
prepared="$(release_close_summary WO-099 --material .runtime/kept=preserve)"
printf '%s\n' "$prepared" >"$fixture/prepared-output.txt"
CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' "$node_bin" "$script_dir/test-close-admission.mjs" "$main" WO-099 "$fixture/prepared-output.txt"
fi
if [[ "${1:-}" == close_real_writer ]]; then
  test -d "$main/docs/control/local/harness/writer"
  if failed="$(DOTLN_FIXTURE_GH_FAIL=create release_close_summary WO-099 --publish --material .runtime/kept=preserve 2>&1)"; then
    printf 'real writer fixture expected Release failure\n' >&2; return 1
  fi
  test -d "$main/docs/control/local/harness/writer"
  test -d "$subject"
  grep -Fq 'tag published; GitHub Release not created' <<<"$failed"
  git -C "$main" -c user.name=Fixture -c user.email=fixture@example.invalid -c maintenance.auto=false commit --allow-empty -qm 'Unrelated later main commit'
  git -C "$main" push -q origin main
fi
output="$(release_close_summary WO-099 --publish --material .runtime/kept=preserve)"
if [[ "${1:-}" == close_real_writer ]]; then
  test ! -d "$main/docs/control/local/harness/writer"
  "$node_bin" -e 'const r=JSON.parse(require("node:fs").readFileSync(process.argv[1]));require("node:assert/strict").ok(r.steps.find(row=>row.name==="prune").durationMs>=80,"session cleanup is timed");' "$main/docs/control/local/retained/WO-099/release-close.json"
fi
# Undo the fixture's external seal only after measuring the no-follow result.
external_mode="$($node_bin -e 'console.log((require("node:fs").statSync(process.argv[1]).mode & 511).toString(8))' "$fixture/outside")"
chmod 700 "$fixture/outside"
if [[ -d "$subject/.runtime/snapshots/deep" ]]; then chmod 700 "$subject/.runtime/snapshots/deep"; fi
test "$external_mode" = 500
if [[ -e "$subject" ]]; then printf 'WO-195 subject directory remains after sealed removal\n' >&2; return 1; fi
test -z "$(git -C "$main" branch --list wo-099)"
record="$main/docs/control/local/retained/WO-099/release-close.json"
"$node_bin" - "$record" "$main" "$output" "$preview" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs'),p=require('node:path');
const record=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(record.cleanup.outcome,'clean');
assert.equal(record.cleanup.worktrees[0].outcome,'removed');
assert.equal(record.cleanup.branch.outcome,'deleted');
assert.deepEqual(record.steps.map(row=>row.name),['prerequisites','runtime','worktree-removal','publication','starter-refresh','prune','record']);
for(const row of record.steps){assert.ok(Number.isFinite(row.durationMs)&&row.durationMs>=0);if(row.startedAt)assert.ok(Date.parse(row.finishedAt)>=Date.parse(row.startedAt));}
assert.ok(record.steps.find(row=>row.name==='runtime').startedAt<=record.steps.find(row=>row.name==='publication').startedAt);
const proof=JSON.parse(fs.readFileSync(p.join(process.argv[3],record.cleanup.subject.preservationReceipt),'utf8'));
assert.equal(typeof proof.preserved.count,'number');
const inventory=JSON.parse(fs.readFileSync(p.join(process.argv[3],proof.inventory.path),'utf8'));
assert.equal('sha256:'+require('node:crypto').createHash('sha256').update(fs.readFileSync(p.join(process.argv[3],proof.inventory.path))).digest('hex'),proof.inventory.digest);
assert.ok(inventory.preserved.some(row=>row.path.endsWith('saved.txt') && fs.readFileSync(p.join(process.argv[3],row.path),'utf8')==='preserved fixture bytes\n'));
const full=fs.readFileSync(p.join(process.argv[3],record.reportPath),'utf8');
assert.match(full,/Worktree removal proof:/);
for(const text of process.argv.slice(4)) {assert.match(text,/Full report:/);assert.ok(Buffer.byteLength(text)<16384);}
console.log('WO-195 summary bytes publish='+Buffer.byteLength(process.argv[4])+' dry-run='+Buffer.byteLength(process.argv[5]));
JS
if [[ "${1:-}" == close_compact ]]; then
  "$node_bin" - "$record" "$main" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs'),p=require('node:path');const record=JSON.parse(fs.readFileSync(process.argv[2]));const main=process.argv[3];
const transcript=fs.readFileSync(p.join(main,record.reportPath),'utf8');
const advisory=transcript.split('\n').find(line=>line.startsWith('Advisory: retained ignored material:'));
assert.ok(advisory);assert.doesNotMatch(transcript,/material-(?:0|1999)\.txt/);assert.match(advisory,/countsByClass/);assert.match(advisory,/sha256:/);
const proof=JSON.parse(fs.readFileSync(p.join(main,record.cleanup.subject.preservationReceipt)));
assert.ok(proof.snapshot.count>=2000);assert.ok(Buffer.byteLength(JSON.stringify(proof))<4096);
console.log('WO239 material counts '+JSON.stringify({files:2000,advisoryBytes:Buffer.byteLength(advisory),removalRecordBytes:Buffer.byteLength(JSON.stringify(proof))}));
JS
  listed="$(release_close_summary WO-099 --publish --dry-run --list-material)"
  retained_close_output "$listed" >"$fixture/listed.log"
  grep -Fq 'docs/control/local/compact/material-0.txt' "$fixture/listed.log"
  grep -Fq 'docs/control/local/compact/material-1999.txt' "$fixture/listed.log"
fi
retry="$(release_close_summary WO-099 --publish)"
grep -Fq 'already-published' <<<"$retry"
grep -Fq 'Full report:' <<<"$retry"
printf 'WO-195 summary bytes retry=%s\n' "$(printf '%s' "$retry" | wc -c | tr -d ' ')"
(cd "$main" && CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' "$node_bin" scripts/resume.mjs release-close --work-order WO-099) >"$fixture/briefing-output.txt"
CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' "$node_bin" "$script_dir/test-close-admission.mjs" "$main" WO-099 "$fixture/briefing-output.txt"
}

release_case_close_compact() {
release_case_close_completion close_compact
}

release_case_removal_inventory() {
make_repo removal_inventory
git -C "$main" worktree add "$fixture/preserved-subject" -b wo-099 main >/dev/null
"$node_bin" --input-type=module - "$main" "$fixture" <<'JS'
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [main,fixture]=process.argv.slice(2);
const {recordWorktreeRemoval,verifyWorktreeRemoval,readRemovalInventory}=await import(pathToFileURL(join(main,'scripts/lib/worktree-removal.mjs')));
const subject=join(fixture,'preserved-subject');
fs.writeFileSync(join(subject,'retained'),'original bytes\n');
const destination='docs/control/local/retained/WO-099/kept';fs.mkdirSync(join(main,destination),{recursive:true});
fs.writeFileSync(join(main,destination,'retained'),'original bytes\n');
const reconciliation={workOrder:'WO-099',files:[{destination:destination+'/retained'}],directories:[{destination}]};
const {syncBuiltinESMExports}=await import('node:module');
const originalWrite=fs.writeFileSync;let interrupted=false;
fs.writeFileSync=function(file,bytes,...args){if(String(file).includes('removal-inventory-')&&String(file).includes('.prepare-')&&!interrupted){interrupted=true;originalWrite(file,'partial',...args);throw new Error('fixture interrupted inventory write');}return originalWrite(file,bytes,...args);};
syncBuiltinESMExports();
try{assert.throws(()=>recordWorktreeRemoval(main,subject,reconciliation),/interrupted inventory write/);}finally{fs.writeFileSync=originalWrite;syncBuiltinESMExports();}
assert.equal(interrupted,true);
const receipt=recordWorktreeRemoval(main,subject,reconciliation);
const file=join(main,receipt),proof=JSON.parse(fs.readFileSync(file)),inventoryFile=join(main,proof.inventory.path),bytes=fs.readFileSync(inventoryFile);
const verify=()=>verifyWorktreeRemoval(main,subject,'WO-099');
assert.equal(verify(),receipt);
const inventory=readRemovalInventory(main,receipt,proof);
for(const mutate of [
 row=>row.snapshot.count++,
 row=>row.inventory.digest='sha256:'+'0'.repeat(64),
 row=>row.inventory.path='../outside.json',
 row=>row.inventory.path=row.inventory.path.replace('removal-inventory-','other-'),
]){const row=structuredClone(proof);mutate(row);fs.writeFileSync(file,JSON.stringify(row));assert.throws(verify,/inventory/);}
fs.writeFileSync(file,JSON.stringify(proof));
fs.renameSync(inventoryFile,inventoryFile+'.saved');assert.throws(verify,/ENOENT/);
fs.symlinkSync(inventoryFile+'.saved',inventoryFile);assert.throws(verify,/symlink/);fs.unlinkSync(inventoryFile);
fs.renameSync(inventoryFile+'.saved',inventoryFile);
fs.appendFileSync(inventoryFile,' ');assert.throws(verify,/digest differs/);fs.writeFileSync(inventoryFile,bytes);
fs.appendFileSync(join(main,destination,'retained'),'changed');assert.throws(verify,/byte proof/);
fs.writeFileSync(join(main,destination,'retained'),'original bytes\n');
const {inventory:reference,...header}=proof;fs.writeFileSync(file,JSON.stringify({...header,...inventory}));
assert.equal(verify(),receipt,'historical inline receipts remain usable');
assert.ok(fs.existsSync(subject));
JS
}

release_case_close_sealed() {
release_case_close_completion close_sealed
}

release_case_close_real_writer() {
release_case_close_completion close_real_writer
}

release_case_close_leftover() {
for subject_kind in primary derivative; do
for proof_mode in valid corrupt missing; do
make_repo "close_leftover_${subject_kind}_$proof_mode"
primary="$fixture/project-wo099"
git -C "$main" worktree add "$primary" -b wo-099 main >/dev/null
commit_candidate "$primary" WO-099 v0.2.1
git -C "$primary" push origin HEAD:main >/dev/null 2>&1
subject="$primary"
if [[ "$subject_kind" == derivative ]]; then
  subject="$fixture/runtime-wo099-derivative"
  git -C "$main" worktree add --detach "$subject" wo-099 >/dev/null
fi
mkdir -p "$subject/docs/intake"
printf 'original preserved intake\n' >"$subject/docs/intake/kept.md"
beacon_dir="$subject/.control-beacons/restricted/$(printf '%064d' 0)"
mkdir -p "$beacon_dir"
printf 'disposable beacon\n' >"$beacon_dir/signal"
record_restricted_release_beacon "$beacon_dir"
chmod 111 "$beacon_dir"
# The child Git fixture models partial removal: administration has gone but
# source remains. Corrupt a destination to keep the first recovery blocked.
cp "$bin/git" "$bin/git-original"
cat >"$bin/git" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${DOTLN_FIXTURE_UNREGISTER:-}" == 1 && "${3:-}" == worktree && "${4:-}" == remove && "${@: -1}" == "${DOTLN_FIXTURE_UNREGISTER_TARGET:-}" ]]; then
  subject="${@: -1}"
  node - "$2" "$subject" <<'JS'
const fs=require('node:fs'),p=require('node:path');
const main=process.argv[2],subject=process.argv[3],lane=p.join(main,'docs/control/local/retained/WO-099');
const name=fs.existsSync(lane) ? fs.readdirSync(lane).find(n=>/^worktree-removal-[a-f0-9]{64}\.json$/.test(n) && JSON.parse(fs.readFileSync(p.join(lane,n),'utf8')).subject===subject) : null;
if(name) {
 const proof=JSON.parse(fs.readFileSync(p.join(lane,name),'utf8'));
 const inventory=JSON.parse(fs.readFileSync(p.join(main,proof.inventory.path),'utf8'));
const saved=p.join(main,inventory.preserved.find(row=>row.path.endsWith('kept.md')).path);
 fs.writeFileSync(p.join(p.dirname(main),'destination-before-corruption'),fs.readFileSync(saved));
 fs.writeFileSync(p.join(p.dirname(main),'corrupted-destination-path'),saved);
 fs.appendFileSync(saved,'fixture corruption\n');
}
const admin=fs.readFileSync(p.join(subject,'.git'),'utf8').trim().slice('gitdir: '.length);
if(!admin.startsWith(main+ '/.git/worktrees/')) throw new Error('fixture administrative path escaped');
fs.rmSync(admin,{recursive:true});
JS
  printf 'fixture partial worktree removal\n' >&2; exit 9
fi
exec "$(dirname "$0")/git-original" "$@"
SH
chmod +x "$bin/git"
output="$(DOTLN_FIXTURE_UNREGISTER=1 DOTLN_FIXTURE_UNREGISTER_TARGET="$subject" release_close_summary WO-099 --publish)"
record="$main/docs/control/local/retained/WO-099/release-close.json"
printf '%s\n' "$output" >"$fixture/blocker-output.txt"
"$node_bin" - "$record" "$subject" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs');
const record=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.ok(fs.existsSync(process.argv[3]));
assert.equal(record.cleanup.outcome,'blocked');
assert.equal(record.cleanup.worktrees.find(row=>row.path===process.argv[3]).outcome,'retained');
assert.ok(record.blockers.some(row=>row.action==='leftover' && row.reason.includes(process.argv[3])));
JS
CODEX_THREAD_ID='' COPILOT_AGENT_SESSION_ID='' "$node_bin" "$script_dir/test-close-admission.mjs" "$main" WO-099 "$fixture/blocker-output.txt" "$record"
# Restore the saved bytes before varying only the recorded proof.
if [[ -f "$fixture/corrupted-destination-path" ]]; then
  cp "$fixture/destination-before-corruption" "$(cat "$fixture/corrupted-destination-path")"
fi
"$node_bin" --input-type=module - "$main" "$subject" "$beacon_dir" <<'JS'
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const [main,subject,beacon]=process.argv.slice(2);
const {verifyWorktreeRemoval}=await import(pathToFileURL(main+'/scripts/lib/worktree-removal.mjs'));
try {
 assert.equal(fs.statSync(beacon).mode & 0o777,0o111);
 verifyWorktreeRemoval(main,subject,'WO-099');
 assert.equal(fs.statSync(beacon).mode & 0o777,0o111,'verification restores surviving beacon permissions');
} catch(error) {
 fs.chmodSync(beacon,0o700); // Restore this synthetic fixture for its exit trap.
 throw error;
}
JS
if [[ "$proof_mode" != valid ]]; then
 "$node_bin" - "$main" "$proof_mode" "$subject" <<'JS'
const fs=require('node:fs'),p=require('node:path'),lane=p.join(process.argv[2],'docs/control/local/retained/WO-099');
const file=p.join(lane,fs.readdirSync(lane).find(n=>/^worktree-removal-[a-f0-9]{64}\.json$/.test(n) && JSON.parse(fs.readFileSync(p.join(lane,n),'utf8')).subject===process.argv[4]));
if(process.argv[3]==='missing') fs.unlinkSync(file);
else {const proof=JSON.parse(fs.readFileSync(file));proof.subject+='-different';fs.writeFileSync(file,JSON.stringify(proof));}
JS
fi
retry="$(release_close_summary WO-099 --publish)"
"$node_bin" - "$record" "$subject" "$proof_mode" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs');const record=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(fs.existsSync(process.argv[3]),process.argv[4]!=='valid');
assert.equal(record.cleanup.outcome,process.argv[4]==='valid'?'clean':'blocked');
if(process.argv[4]==='valid') assert.ok(['deleted','absent'].includes(record.cleanup.branch.outcome));
else assert.ok(record.blockers.some(row=>row.action==='leftover'));
JS
if [[ "$proof_mode" == valid ]]; then test -z "$(git -C "$main" branch --list wo-099)"; fi
if [[ -e "$beacon_dir" ]]; then
  test "$("$node_bin" -e 'console.log((require("node:fs").statSync(process.argv[1]).mode & 511).toString(8))' "$beacon_dir")" = 111
  chmod 700 "$beacon_dir"
fi
done
done
}

release_case_close_retry_paths() {
make_repo close_retry_paths
# A whole-action settle failure must survive recovery of a different path.
"$node_bin" - "$main/scripts/worktree.mjs" <<'JS'
const fs=require('node:fs'),file=process.argv[2];
fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('\n', '\nif (process.argv[2] === "settle" && process.env.DOTLN_FIXTURE_SETTLE_FAIL === "1") { process.stderr.write("fixture unrelated settle failure\\n"); process.exit(9); }\n'));
JS
commit_candidate "$main" WO-099 v0.2.1
git -C "$main" push origin main >/dev/null 2>&1
git -C "$main" branch wo-099
first="$fixture/runtime-wo099-first"
second="$fixture/runtime-wo099-second"
completed="$fixture/completed-path"
for subject in "$first" "$second" "$completed"; do
  git -C "$main" worktree add --detach "$subject" main >/dev/null
  "$node_bin" --input-type=module - "$main" "$subject" <<'JS'
import {pathToFileURL} from 'node:url';
const [main,subject]=process.argv.slice(2);
const {recordWorktreeRemoval}=await import(pathToFileURL(main+'/scripts/lib/worktree-removal.mjs'));
recordWorktreeRemoval(main,subject,{workOrder:'WO-099',files:[],directories:[]});
JS
done
git -C "$main" worktree remove "$completed"
git -C "$main" worktree add "$completed" -b unrelated main >/dev/null
"$node_bin" - "$main" "$first" "$second" "$completed" <<'JS'
const fs=require('node:fs'),p=require('node:path');
const [main,first,second,completed]=process.argv.slice(2);
for(const subject of [first,second]) {
 const admin=fs.readFileSync(p.join(subject,'.git'),'utf8').trim().slice('gitdir: '.length);
 if(!admin.startsWith(main+'/.git/worktrees/')) throw new Error('fixture admin path escaped');
 fs.rmSync(admin,{recursive:true});
}
fs.writeFileSync(p.join(second,'changed.txt'),'unpreserved new bytes\n');
fs.writeFileSync(p.join(main,'docs/control/local/retained/WO-099/release-close.json'),JSON.stringify({
 schemaVersion:1, workOrderId:'WO-099',
 previousAttempts:[{cleanup:{worktrees:[{path:completed,outcome:'retained'}]}}],
 cleanup:{worktrees:[{path:completed,outcome:'removed'},{path:first,outcome:'retained'},{path:second,outcome:'retained'}]}
}));
JS
output="$(DOTLN_FIXTURE_SETTLE_FAIL=1 release_close_summary WO-099 --publish)"
record="$main/docs/control/local/retained/WO-099/release-close.json"
"$node_bin" - "$record" "$first" "$second" "$completed" "$output" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs');
const [file,first,second,completed,output]=process.argv.slice(2),record=JSON.parse(fs.readFileSync(file));
assert.equal(fs.existsSync(first),false);
assert.equal(fs.existsSync(second),true);
assert.equal(record.cleanup.outcome,'blocked');
assert.ok(record.blockers.some(row=>row.action==='settle' && !row.resolved && row.reason.includes('fixture unrelated settle failure')),'unrelated blocker survives removal of first leftover');
assert.match(output,/fixture unrelated settle failure/);
assert.equal(record.cleanup.worktrees.some(row=>row.path===completed),false,'latest removed outcome excludes older retained row and receipt');
for(const row of record.cleanup.worktrees.filter(row=>row.outcome==='retained'))
 assert.ok(row.blockers.length && row.blockers.every(blocker=>blocker.reason && blocker.command));
JS
# Reusing a path after its recorded removal must not enroll the new branch.
git -C "$main" worktree add "$first" -b reused main >/dev/null
rm "$second/changed.txt"
retry="$(release_close_summary WO-099 --publish)"
"$node_bin" - "$record" "$first" "$second" "$completed" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs');
const [file,first,second,completed]=process.argv.slice(2),record=JSON.parse(fs.readFileSync(file));
assert.equal(record.cleanup.outcome,'clean');
assert.equal(fs.existsSync(second),false);
assert.equal(fs.existsSync(first),true);
assert.equal(fs.existsSync(completed),true);
assert.equal(record.cleanup.worktrees.some(row=>[first,completed].includes(row.path)),false);
JS
}

release_case_close_receipt_recovery() {
for history in missing unreadable preview; do
make_repo "close_receipt_recovery_$history"
subject="$fixture/project-wo099"
git -C "$main" worktree add "$subject" -b wo-099 main >/dev/null
commit_candidate "$subject" WO-099 v0.2.1
git -C "$subject" push origin HEAD:main >/dev/null 2>&1
mkdir -p "$subject/docs/intake"
printf 'receipt recovery bytes\n' >"$subject/docs/intake/kept.md"
if [[ "$history" == preview ]]; then
  release_close_summary WO-099 --dry-run >"$fixture/preview.log"
fi
cp "$bin/git" "$bin/git-original"
cat >"$bin/git" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${DOTLN_FIXTURE_UNREGISTER:-}" == 1 && "${3:-}" == worktree && "${4:-}" == remove ]]; then
  node - "$2" "${@: -1}" <<'JS'
const fs=require('node:fs'),p=require('node:path'),main=process.argv[2],subject=process.argv[3];
const admin=fs.readFileSync(p.join(subject,'.git'),'utf8').trim().slice('gitdir: '.length);
if(!admin.startsWith(main+'/.git/worktrees/')) throw new Error('fixture admin path escaped');
fs.rmSync(admin,{recursive:true});
JS
  printf 'fixture partial removal outside release close\n' >&2; exit 9
fi
exec "$(dirname "$0")/git-original" "$@"
SH
chmod +x "$bin/git"
if (cd "$main" && PATH="$bin:$PATH" DOTLN_NPM_LOG="$npm_log" DOTLN_FIXTURE_UNREGISTER=1 "$node_bin" scripts/worktree.mjs finish WO-099 >"$fixture/finish.log" 2>&1); then
  printf 'fixture partial removal unexpectedly succeeded\n' >&2; return 1
fi
record="$main/docs/control/local/retained/WO-099/release-close.json"
if [[ "$history" != preview ]]; then test ! -e "$record"; fi
if [[ "$history" == unreadable ]]; then printf '{unreadable fixture close record\n' >"$record"; fi
"$node_bin" - "$main" "$subject" "$fixture" <<'JS'
const fs=require('node:fs'),p=require('node:path'),[main,subject,fixture]=process.argv.slice(2),lane=p.join(main,'docs/control/local/retained/WO-099');
const file=fs.readdirSync(lane).find(name=>/^worktree-removal-[a-f0-9]{64}\.json$/.test(name));
const proof=JSON.parse(fs.readFileSync(p.join(lane,file),'utf8'));
if(proof.subject!==subject) throw new Error('fixture proof subject differs');
const inventory=JSON.parse(fs.readFileSync(p.join(main,proof.inventory.path),'utf8'));
const saved=p.join(main,inventory.preserved.find(row=>row.path.endsWith('kept.md')).path);
fs.writeFileSync(p.join(fixture,'saved-path'),saved);
fs.writeFileSync(p.join(fixture,'saved-bytes'),fs.readFileSync(saved));
fs.appendFileSync(saved,'fixture corruption\n');
JS
output="$(release_close_summary WO-099 --publish)"
"$node_bin" - "$record" "$subject" "$output" "$history" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs'),[file,subject,output,history]=process.argv.slice(2),record=JSON.parse(fs.readFileSync(file));
assert.equal(record.cleanup.outcome,'blocked');
assert.equal(record.cleanup.branch.outcome,'retained','receipt-bound leftover keeps the branch without readable close history');
assert.equal(record.cleanup.worktrees.find(row=>row.path===subject)?.outcome,'retained');
assert.ok(record.blockers.some(row=>row.path===subject && row.reason && row.command));
assert.ok(output.includes(subject));
if(history==='unreadable') assert.ok(record.previousAttempts.some(row=>row.unreadableRecord));
JS
test -n "$(git -C "$main" branch --list wo-099)"
# Discovery must keep its uncertain subject binding through a still-blocked retry.
retry_blocked="$(release_close_summary WO-099 --publish)"
grep -Fq 'Branch wo-099: retained' <<<"$retry_blocked"
test -n "$(git -C "$main" branch --list wo-099)"
cp "$fixture/saved-bytes" "$(cat "$fixture/saved-path")"
retry="$(release_close_summary WO-099 --publish)"
test ! -e "$subject"
test -z "$(git -C "$main" branch --list wo-099)"
"$node_bin" - "$record" <<'JS'
const assert=require('node:assert/strict'),record=JSON.parse(require('node:fs').readFileSync(process.argv[2]));
assert.equal(record.cleanup.outcome,'clean');
assert.equal(record.cleanup.branch.outcome,'deleted');
JS
done
}

release_case_stale_compiler() {
  make_repo stale_compiler
  "$node_bin" --input-type=module - "$main" "$script_dir/.." <<'JS'
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
const [root,source]=process.argv.slice(2);
const {copyCore,runner}=await import(pathToFileURL(join(source,'scripts/fixtures/instance-with-history/support.mjs')));
const commands=runner();
copyCore(root,{...commands,init(){},git(cwd,...args){if(args[0]==='remote'&&args[1]==='add')return '';return commands.git(cwd,...args);}},source);
JS
  (cd "$main" && "$node_bin" scripts/build.mjs) >"$fixture/old-build.log" 2>&1
  mkdir -p "$main/docs/siblings"
  printf '%s\n' '{"schemaVersion":1,"siblings":[{"id":"starter-fixture","purpose":"Compiler freshness fixture","relation":{"kind":"export","coreCommit":null},"capabilityRows":[]}]}' >"$main/docs/siblings/siblings.json"
  "$node_bin" - "$main" <<'JS'
const fs=require('node:fs'),p=require('node:path');const file=p.join(process.argv[2],'packages/compiler/src/artifact-identity.ts');const before=fs.readFileSync(file,'utf8');
if(!/COMPILER_PACKAGE_VERSION = "[^"]+"/.test(before))throw new Error('compiler version declaration missing');
fs.writeFileSync(file,before.replace(/COMPILER_PACKAGE_VERSION = "[^"]+"/,'COMPILER_PACKAGE_VERSION = "99.0.1"'));
JS
  commit_candidate "$main" WO-099 v0.2.1
  git -C "$main" push origin main >/dev/null 2>&1
  local starter="$fixture/fresh-starter" starter_remote="$fixture/fresh-starter.git" config="$fixture/refresh.gitconfig"
  git init -q -b main "$starter"
  git -C "$starter" config user.name Fixture
  git -C "$starter" config user.email fixture@example.invalid
  printf 'fixture starter\n' >"$starter/README.md"
  git -C "$starter" add .
  git -C "$starter" -c maintenance.auto=false commit -qm 'Initial starter'
  git clone -q --bare "$starter" "$starter_remote"
  git -C "$starter" remote add origin https://github.com/dotln-fixture/starter-fixture.git
  printf '[url "%s"]\n insteadOf = https://github.com/dotln-fixture/starter-fixture.git\n' "$starter_remote" >"$config"
  mkdir -p "$main/docs/control/local"
  "$node_bin" -e 'require("node:fs").writeFileSync(process.argv[1],JSON.stringify({"starter-fixture":process.argv[2]}))' "$main/docs/control/local/repository-clones.json" "$starter"
  "$node_bin" --input-type=module - "$main" <<'JS'
import {createHash} from 'node:crypto';import {pathToFileURL} from 'node:url';import {join} from 'node:path';
const root=process.argv[2];const {seedHarnessWriter}=await import(pathToFileURL(join(root,'packages/skeleton/dist/src/harness-host.js')));
seedHarnessWriter(root,{actorId:createHash('sha256').update('fixture-close-session').digest('hex'),reservedAt:new Date().toISOString()});
JS
  cat >"$fixture/load-trace.mjs" <<'JS'
import {registerHooks} from 'node:module';import {appendFileSync} from 'node:fs';
let observed=false;
registerHooks({load(url,context,nextLoad){
 if(!observed&&/\/packages\/[^/]+\/dist\//.test(url)){observed=true;appendFileSync(process.env.DOTLN_FIXTURE_LOAD_TRACE,JSON.stringify({event:'dist',pid:process.pid})+'\n');}
 const loaded=nextLoad(url,context);
 if(url.endsWith('/scripts/build.mjs')&&process.argv[1]?.endsWith('/scripts/build.mjs'))
  return {...loaded,source:String(loaded.source)+"\nimport {appendFileSync as traceWrite} from 'node:fs';traceWrite(process.env.DOTLN_FIXTURE_LOAD_TRACE,JSON.stringify({event:'build-finished',pid:process.pid})+'\\n');\n"};
 return loaded;
}});
JS
  local output close_code=0
  output="$(GIT_CONFIG_GLOBAL="$config" CODEX_THREAD_ID=fixture-close-session DOTLN_FIXTURE_LOAD_TRACE="$fixture/load-trace.jsonl" NODE_OPTIONS="${NODE_OPTIONS:-} --import=$fixture/load-trace.mjs" release_close_summary WO-099 --publish)" || close_code=$?
  printf 'WO239 stale-compiler control exitCode=%s\n' "$close_code"
  printf '%s\n' "$output"
  if [[ "$close_code" != 0 ]]; then retained_close_output "$output"; return 1; fi
  "$node_bin" - "$main" "$fixture/load-trace.jsonl" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs'),p=require('node:path');
const record=JSON.parse(fs.readFileSync(p.join(process.argv[2],'docs/control/local/retained/WO-099/release-close.json')));
assert.equal(record.starterRefresh[0].outcome,'refreshed');assert.equal(record.blockers.length,0);
const rows=fs.readFileSync(process.argv[3],'utf8').trim().split('\n').map(JSON.parse);
const prepared=rows.findIndex(row=>row.event==='build-finished');assert.ok(prepared>=0,'a child prepared the stale runtime');
const parentLoad=rows.findIndex(row=>row.event==='dist'&&row.pid!==rows[prepared].pid);assert.ok(parentLoad>prepared,'parent loads built code only after child preparation completes');
console.log('WO239 runtime loading '+JSON.stringify({childBuildBeforeParentImport:true,starterOutcome:record.starterRefresh[0].outcome}));
JS
}

release_case_starter_refresh() {
  make_repo starter_refresh
  mkdir -p "$main/docs/siblings" "$main/scripts/kit"
  cp -R "$script_dir/kit/." "$main/scripts/kit/"
  printf '%s\n' '!.DS_Store' >>"$main/scripts/kit/gitignore.template"
  git -C "$main" add scripts/kit
  printf '%s\n' '{"schemaVersion":1,"siblings":[{"id":"starter-fixture","purpose":"Fixture starter","relation":{"kind":"export","coreCommit":null},"capabilityRows":[]}]}' >"$main/docs/siblings/siblings.json"
  git -C "$main" add docs/siblings
  git -C "$main" -c maintenance.auto=false commit -qm 'declare fixture starter'
  git -C "$main" push origin main >/dev/null 2>&1
  git -c maintenance.auto=false clone -c maintenance.auto=false -q "$origin" "$fixture/integrator"
  git -C "$fixture/integrator" config user.email fixture@example.invalid
  git -C "$fixture/integrator" config user.name 'DotLn Fixture Integrator'
  git -C "$fixture/integrator" switch main >/dev/null 2>&1
  commit_candidate "$fixture/integrator" WO-099 v0.2.1
  git -C "$fixture/integrator" push origin main >/dev/null 2>&1
  local local_head merged_head output
  local_head="$(git -C "$main" rev-parse HEAD)"
  merged_head="$(git --git-dir="$origin" rev-parse main)"
  test "$local_head" != "$merged_head"
  if output="$(release_close_summary WO-099 --publish --dry-run)"; then
    printf 'missing starter checkout did not block preview before fast-forward\n' >&2; return 1
  fi
  grep -Fq 'no recorded checkout' <<<"$output"
  local preview_starter="$fixture/preview-starter" preview_remote="$fixture/preview-starter.git" preview_config="$fixture/preview.gitconfig"
  git init -q -b main "$preview_starter"
  git -C "$preview_starter" config user.name Fixture
  git -C "$preview_starter" config user.email fixture@example.invalid
  printf '%s\n' '!.DS_Store' >"$preview_starter/.gitignore"
  git -C "$preview_starter" add .gitignore
  git -C "$preview_starter" -c maintenance.auto=false commit -qm 'initial fixture starter'
  git -c maintenance.auto=false clone -c maintenance.auto=false -q --bare "$preview_starter" "$preview_remote"
  git -C "$preview_starter" remote add origin https://github.com/dotln-fixture/starter-fixture.git
  printf '[url "%s"]\n insteadOf = https://github.com/dotln-fixture/starter-fixture.git\n' "$preview_remote" >"$preview_config"
  mkdir -p "$main/docs/control/local"
  "$node_bin" -e 'require("node:fs").writeFileSync(process.argv[1],JSON.stringify({"starter-fixture":process.argv[2]}))' "$main/docs/control/local/repository-clones.json" "$preview_starter"
  local preview_head preview_refs
  preview_head="$(git -C "$preview_starter" rev-parse HEAD)"
  preview_refs="$(git --git-dir="$preview_remote" for-each-ref --format='%(refname) %(objectname)')"
  mkdir -p "$preview_starter/nested assets"
  printf 'Finder metadata\n' >"$preview_starter/.DS_Store"
  printf 'nested Finder metadata\n' >"$preview_starter/nested assets/.DS_Store"
  local preview_status
  preview_status="$(git -C "$preview_starter" status --porcelain --untracked-files=all)"
  output="$(GIT_CONFIG_GLOBAL="$preview_config" release_close_summary WO-099 --publish --dry-run)" || { printf '%s\n' "$output" >&2; return 1; }
  grep -Fq 'Starter refresh starter-fixture: preview' <<<"$output"
  grep -Fq "would fast-forward main to $merged_head" <<<"$output"
  grep -Fq "would refresh $preview_head to $merged_head" <<<"$output"
  test "$(git -C "$main" rev-parse HEAD)" = "$local_head"
  test "$(git -C "$preview_starter" rev-parse HEAD)" = "$preview_head"
  test "$(git -C "$preview_starter" status --porcelain --untracked-files=all)" = "$preview_status"
  grep -Fxq 'Finder metadata' "$preview_starter/.DS_Store"
  grep -Fxq 'nested Finder metadata' "$preview_starter/nested assets/.DS_Store"
  test "$(git --git-dir="$preview_remote" for-each-ref --format='%(refname) %(objectname)')" = "$preview_refs"
  test "$(git -C "$preview_starter" worktree list --porcelain | grep -c '^worktree ')" = 1
  test ! -e "$main/docs/control/local/sibling-receipts"
  assert_no_candidate_tag "$main" "$origin"
  test ! -e "$gh_state/v0.2.1.body"
  rm "$main/docs/control/local/repository-clones.json"
  output="$(release_close_summary WO-099 --dry-run)"
  "$node_bin" -e 'const r=JSON.parse(require("node:fs").readFileSync(process.argv[1]));require("node:assert/strict").deepEqual(r.starterRefresh,[])' "$main/docs/control/local/retained/WO-099/release-close.json"
  seed_release_close_writer
  if output="$(CODEX_THREAD_ID=fixture-close-session release_close_summary WO-099 --publish)"; then
    printf 'missing starter checkout did not block close\n' >&2; return 1
  fi
  grep -Fq 'Starter refresh starter-fixture: refused' <<<"$output"
  grep -Fq 'starter-refresh' <<<"$output"
  grep -Fq 'Retry:' <<<"$output"
  test -f "$main/docs/control/local/harness/writer.json"
  local record="$main/docs/control/local/retained/WO-099/release-close.json"
  "$node_bin" - "$record" <<'JS'
const assert=require('node:assert/strict'), fs=require('node:fs');const r=JSON.parse(fs.readFileSync(process.argv[2]));
assert.equal(r.publication.outcome,'published');assert.equal(r.starterRefresh[0].outcome,'refused');assert.equal(r.blockers.at(-1).action,'starter-refresh');assert.equal(r.blockers.at(-1).command,r.retryCommand);
JS
  local starter="$fixture/starter" starter_remote="$fixture/starter.git" core_head
  core_head="$(git -C "$main" rev-parse HEAD)"
  git init -q -b main "$starter"
  git -C "$starter" config user.name Fixture
  git -C "$starter" config user.email fixture@example.invalid
  mkdir -p "$starter/.claude"
  printf '{"commit":"%s","tag":"v0.2.1"}\n' "$core_head" >"$starter/KIT-MANIFEST.json"
  printf '%s\n' '{"profiles":[{"profile":{"runtime":{"snapshot":".runtime/harness/1234567890abcdef"}}}]}' >"$starter/.claude/harness-manifest.json"
  "$node_bin" - "$main" "$starter" <<'JS'
const fs=require('node:fs'),p=require('node:path');
for(const [dest,source] of [["README.md","README.client.md"],[".gitignore","gitignore.template"],["CLAUDE.md","CLAUDE.template.md"],["AI-HARNESS-SECURITY.md","AI-HARNESS-SECURITY.template.md"],["docs/workstreams/README.md","workstream.template.md"],["docs/repositories/README.md","repository-profile.template.md"],["docs/work-orders/WO-001-environment-truth.md","first-order.template.md"],["docs/control/budgets.json","budgets.template.json"]]) {const target=p.join(process.argv[3],dest);fs.mkdirSync(p.dirname(target),{recursive:true});fs.copyFileSync(p.join(process.argv[2],"scripts/kit",source),target);if(dest==="CLAUDE.md") fs.appendFileSync(target,"\n<!-- dotln-harness:start -->\nFixture block.\n<!-- dotln-harness:end -->\n");}
// This legacy fixture has no instance configuration and keeps the default release name.
const readme=p.join(process.argv[3],"README.md");
fs.writeFileSync(readme,fs.readFileSync(readme,"utf8").replace("This source prepares DotLn-Enterprise-Starter ","This source prepares DotLn "));
JS
  git -C "$starter" add .
  git -C "$starter" -c maintenance.auto=false commit -qm 'current fixture kit'
  git -c maintenance.auto=false clone -c maintenance.auto=false -q --bare "$starter" "$starter_remote"
  git -C "$starter" remote add origin https://github.com/wrong-owner/starter-fixture.git
  mkdir -p "$main/docs/control/local"
  "$node_bin" -e 'require("node:fs").writeFileSync(process.argv[1],JSON.stringify({"starter-fixture":process.argv[2]}))' "$main/docs/control/local/repository-clones.json" "$starter"
  local before
  before="$(git --git-dir="$starter_remote" rev-parse main)"
  if output="$(CODEX_THREAD_ID=fixture-close-session release_close_summary WO-099 --publish)"; then
    printf 'misbound starter did not block close\n' >&2; return 1
  fi
  grep -Fq "origin's configured push URL" <<<"$output"
  test "$(git --git-dir="$starter_remote" rev-parse main)" = "$before"
  git -C "$starter" remote set-url origin https://github.com/dotln-fixture/starter-fixture.git
  local config="$fixture/refresh.gitconfig"
  printf '[url "%s"]\n insteadOf = https://github.com/dotln-fixture/starter-fixture.git\n' "$starter_remote" >"$config"
  printf 'keep unrelated work\n' >"$starter/local-work.txt"
  if output="$(GIT_CONFIG_GLOBAL="$config" release_close_summary WO-099 --publish --dry-run)"; then
    printf 'unrelated starter file did not block close preview\n' >&2; return 1
  fi
  grep -Fq 'tracked or untracked changes' <<<"$output"
  grep -Fxq 'keep unrelated work' "$starter/local-work.txt"
  rm "$starter/local-work.txt"
  printf 'tracked change\n' >>"$starter/.gitignore"
  if output="$(GIT_CONFIG_GLOBAL="$config" release_close_summary WO-099 --publish --dry-run)"; then
    printf 'tracked starter edit did not block close preview\n' >&2; return 1
  fi
  grep -Fq 'tracked or untracked changes' <<<"$output"
  grep -Fxq 'tracked change' "$starter/.gitignore"
  cp "$main/scripts/kit/gitignore.template" "$starter/.gitignore"
  ln -s KIT-MANIFEST.json "$starter/.DS_Store"
  if output="$(GIT_CONFIG_GLOBAL="$config" release_close_summary WO-099 --publish --dry-run)"; then
    printf 'metadata symlink did not block close preview\n' >&2; return 1
  fi
  grep -Fq 'non-regular Finder metadata' <<<"$output"
  test -L "$starter/.DS_Store"
  rm "$starter/.DS_Store"
  printf 'Finder metadata\n' >"$starter/.DS_Store"
  mkdir -p "$starter/nested assets"
  printf 'nested Finder metadata\n' >"$starter/nested assets/.DS_Store"
  output="$(GIT_CONFIG_GLOBAL="$config" CODEX_THREAD_ID=fixture-close-session release_close_summary WO-099 --publish)"
  grep -Fq 'Starter refresh starter-fixture: current' <<<"$output"
  test ! -e "$main/docs/control/local/harness/writer.json"
  test "$(git --git-dir="$starter_remote" rev-parse main)" = "$before"
  grep -Fxq 'Finder metadata' "$starter/.DS_Store"
  grep -Fxq 'nested Finder metadata' "$starter/nested assets/.DS_Store"
  "$node_bin" - "$record" "$main" "$starter" <<'JS'
const assert=require('node:assert/strict'),fs=require('node:fs'),p=require('node:path');const r=JSON.parse(fs.readFileSync(process.argv[2]));
assert.equal(r.publication.outcome,'already-published');assert.equal(r.blockers.length,0);assert.equal(r.starterRefresh[0].outcome,'current');assert.ok(!JSON.stringify(r.starterRefresh).includes(process.argv[4]));const dir=p.join(process.argv[3],'docs/control/local/sibling-receipts/starter-fixture');assert.equal(fs.readdirSync(dir).length,1);
JS
  local pending_before
  pending_before="$(git -C "$main" status --porcelain --untracked-files=all)"
  # The existing-release preview also judges the proposed head while main is behind.
  git -C "$main" reset --hard "$local_head" >/dev/null
  output="$(GIT_CONFIG_GLOBAL="$config" release_close_summary WO-099 --publish --dry-run)"
  grep -Fq 'Starter refresh starter-fixture: current' <<<"$output"
  grep -Fq 'preview writes nothing' <<<"$output"
  test "$(git -C "$main" status --porcelain --untracked-files=all)" = "$pending_before"
  test "$(git -C "$main" rev-parse HEAD)" = "$local_head"
  test "$(git --git-dir="$starter_remote" rev-parse main)" = "$before"
  output="$(release_close_summary WO-099 --dry-run)"
  "$node_bin" -e 'const r=JSON.parse(require("node:fs").readFileSync(process.argv[1]));require("node:assert/strict").deepEqual(r.starterRefresh,[])' "$record"
  git -C "$main" reset --hard "$core_head" >/dev/null
  output="$(release_close_summary WO-099)"
  "$node_bin" -e 'const r=JSON.parse(require("node:fs").readFileSync(process.argv[1]));require("node:assert/strict").deepEqual(r.starterRefresh,[])' "$record"
  # A lower-version close never touches the declaration, even with no map.
  rm "$main/docs/control/local/repository-clones.json"
  output="$(release_close_summary WO-003 --publish)"
  "$node_bin" -e 'const r=JSON.parse(require("node:fs").readFileSync(process.argv[1]));require("node:assert/strict").deepEqual(r.starterRefresh,[])' "$main/docs/control/local/retained/WO-003/release-close.json"
}

if [[ -n "$prepare_template" ]]; then
  if [[ -n "$release_template" || -n "$selected_case" ]]; then exit 64; fi
  make_repo template
  "$node_bin" "$script_dir/release-fixtures.mjs" save "$fixture" "$prepare_template"
  printf 'PROGRESS release template prepared\n'
  exit 0
fi
if [[ -n "$selected_case" ]]; then
  if [[ ! "$selected_case" =~ ^[a-z][a-z0-9_]*$ ]] || ! declare -F "release_case_$selected_case" >/dev/null; then
    printf 'error: unknown release case %s\n' "$selected_case" >&2
    exit 64
  fi
  printf 'PROGRESS release case %s started\n' "$selected_case"
  "release_case_$selected_case"
  printf 'PROGRESS release case %s passed\n' "$selected_case"
else
  if [[ -z "$release_template" ]]; then
    make_repo template
    "$node_bin" "$script_dir/release-fixtures.mjs" save "$fixture" "$test_root/template-snapshot"
    release_template="$test_root/template-snapshot"
  fi
  while IFS= read -r release_case; do
    printf 'PROGRESS release case %s started\n' "$release_case"
    "release_case_$release_case"
    printf 'PROGRESS release case %s passed\n' "$release_case"
  done < <("$node_bin" "$script_dir/release-fixtures.mjs" list "$script_dir/..")
fi
printf 'release tests passed\n'
