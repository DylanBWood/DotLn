#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "$script_dir/test-temp-root.sh"
tmp_base="${TMPDIR:-/tmp}"
tmp_base="$(resolve_test_tmp_base "$tmp_base")"
test_root_prefix="dotln-fixture-temp-root-test"
create_test_temp_root "$tmp_base" "$test_root_prefix"
test_root="$test_temp_root_result"
install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"
node_bin="$(command -v node)"

assert_root_shape() {
  local resolved_base="$1"
  local root="$2"
  local prefix="$3"
  local basename="${root##*/}"

  test -d "$root"
  test ! -L "$root"
  test -f "$root/.dotln-test-root-owner"
  test ! -L "$root/.dotln-test-root-owner"
  test "${root%/*}" = "$resolved_base"
  case "$basename" in
    "$prefix".??????) ;;
    *)
      printf 'error: unexpected fixture-root shape: %s\n' "$root" >&2
      exit 1
      ;;
  esac
}

exercise_valid_tmpdir() {
  local supplied_base="$1"
  local label="$2"
  local prefix="dotln-valid-base-test"
  local TMPDIR="$supplied_base"
  local selected_base="${TMPDIR:-/tmp}"
  local resolved_base
  local root
  local sentinel

  resolved_base="$(resolve_test_tmp_base "$selected_base")"
  sentinel="$resolved_base/sentinel-$label"
  printf 'survive\n' >"$sentinel"
  create_test_temp_root "$resolved_base" "$prefix"
  root="$test_temp_root_result"
  assert_root_shape "$resolved_base" "$root" "$prefix"
  cleanup_test_temp_root "$resolved_base" "$root" "$prefix"
  test ! -e "$root"
  test -f "$sentinel"
  printf 'PASS valid TMPDIR: %s\n' "$label"
}

expect_base_refusal() {
  local supplied_base="$1"
  local expected_reason="$2"
  local label="$3"
  local TMPDIR="$supplied_base"
  local selected_base="${TMPDIR:-/tmp}"
  local sentinel="$test_root/refusal-$label.sentinel"
  local output

  printf 'survive\n' >"$sentinel"
  if output="$(resolve_test_tmp_base "$selected_base" 2>&1)"; then
    printf 'error: unsafe temporary base unexpectedly accepted: %s\n' "$supplied_base" >&2
    exit 1
  fi
  grep -Fq "$supplied_base" <<<"$output"
  grep -Fq "$expected_reason" <<<"$output"
  test -f "$sentinel"
  printf 'PASS rejected TMPDIR: %s\n' "$label"
}

expect_cleanup_refusal() {
  local resolved_base="$1"
  local root="$2"
  local prefix="$3"
  local expected_reason="$4"
  local label="$5"
  local sentinel="$test_root/cleanup-$label.sentinel"
  local output

  printf 'survive\n' >"$sentinel"
  if output="$(cleanup_test_temp_root "$resolved_base" "$root" "$prefix" 2>&1)"; then
    printf 'error: unsafe cleanup unexpectedly succeeded: %s\n' "${root:-<empty>}" >&2
    exit 1
  fi
  grep -Fq "$expected_reason" <<<"$output"
  test -f "$sentinel"
  printf 'PASS refused cleanup: %s\n' "$label"
}

ordinary_base="$test_root/ordinary"
space_base="$test_root/base with spaces"
symlink_target="$test_root/symlink target"
symlink_base="$test_root/base-link"
trailing_base="$test_root/trailing"
mkdir -p -- "$ordinary_base" "$space_base" "$symlink_target" "$trailing_base"
ln -s -- "$symlink_target" "$symlink_base"

exercise_valid_tmpdir "$ordinary_base" ordinary
exercise_valid_tmpdir "$space_base" spaces
exercise_valid_tmpdir "$symlink_base" symlink
exercise_valid_tmpdir "$trailing_base////" trailing-slashes

exercise_fallback_tmpdir() (
  local mode="$1"
  local selected_base
  local resolved_base
  local root
  local prefix="dotln-fallback-$mode-test"
  local error_file="$test_root/fallback-$mode.error"

  if [[ "$mode" == unset ]]; then
    unset TMPDIR
  else
    TMPDIR=""
  fi
  selected_base="${TMPDIR:-/tmp}"

  if ! resolved_base="$(resolve_test_tmp_base "$selected_base" 2>"$error_file")"; then
    grep -Fq "$selected_base" "$error_file"
    printf 'PASS TMPDIR fallback: %s selection failed loudly when its base was unavailable\n' "$mode"
    return
  fi

  if ! create_test_temp_root "$resolved_base" "$prefix" 2>"$error_file"; then
    grep -Fq "$resolved_base" "$error_file"
    grep -Fq 'could not create fixture root' "$error_file"
    printf 'PASS TMPDIR fallback: %s selection failed loudly when creation was denied\n' "$mode"
    return
  fi

  root="$test_temp_root_result"
  install_test_temp_root_traps "$resolved_base" "$root" "$prefix"
  assert_root_shape "$resolved_base" "$root" "$prefix"
  cleanup_test_temp_root "$resolved_base" "$root" "$prefix"
  trap - EXIT INT TERM
  test ! -e "$root"
  printf 'PASS TMPDIR fallback: %s selection completed the fixture lifecycle\n' "$mode"
)

exercise_fallback_tmpdir unset
exercise_fallback_tmpdir empty

missing_base="$test_root/does-not-exist"
not_directory="$test_root/not-a-directory"
unwritable_base="$test_root/unwritable"
printf 'not a directory\n' >"$not_directory"
mkdir -p -- "$unwritable_base"
chmod 500 "$unwritable_base"
if [[ -w "$unwritable_base" ]]; then
  printf 'error: unwritable-base fixture is writable in this environment\n' >&2
  exit 1
fi
expect_base_refusal "$missing_base" 'not an existing directory' nonexistent
expect_base_refusal "$not_directory" 'not an existing directory' not-directory
expect_base_refusal "$unwritable_base" 'directory is not writable' unwritable
chmod 700 "$unwritable_base"

filesystem_root="$(cd -- / && pwd -P)"
expect_base_refusal "$filesystem_root" 'filesystem root is not a fixture base' filesystem-root
expect_base_refusal . 'path must be absolute' dot
expect_base_refusal .. 'path must be absolute' dot-dot
expect_base_refusal relative-base 'path must be absolute' relative
mkdir -p -- "$test_root/path-segment" "$test_root/path-target"
expect_base_refusal "$test_root/path-segment/../path-target" 'path is not a safe fixture base' dot-dot-segment

outside_target="$test_root/outside intended tree"
intended_tree="$test_root/intended tree"
outside_link="$intended_tree/outside-link"
mkdir -p -- "$outside_target" "$intended_tree"
printf 'outside survives\n' >"$outside_target/outside.sentinel"
printf 'intended survives\n' >"$intended_tree/intended.sentinel"
ln -s -- "$outside_target" "$outside_link"
exercise_valid_tmpdir "$outside_link" outward-symlink
test -f "$outside_target/outside.sentinel"
test -f "$intended_tree/intended.sentinel"
printf 'PASS adversarial base sentinels: trailing slash and outward symlink stayed contained\n'

cleanup_base="$test_root/cleanup-base"
other_cleanup_base="$test_root/other-cleanup-base"
cleanup_prefix="dotln-cleanup-negative-test"
mkdir -p -- "$cleanup_base" "$other_cleanup_base"
cleanup_base="$(resolve_test_tmp_base "$cleanup_base")"
other_cleanup_base="$(resolve_test_tmp_base "$other_cleanup_base")"

expect_cleanup_refusal "$cleanup_base" "" "$cleanup_prefix" 'unsafe fixture-root cleanup target' empty
expect_cleanup_refusal "$cleanup_base" "$cleanup_base" "$cleanup_prefix" 'unsafe fixture-root cleanup target' base-itself

wrong_name="$cleanup_base/not-the-generated-name"
mkdir -p -- "$wrong_name"
expect_cleanup_refusal "$cleanup_base" "$wrong_name" "$cleanup_prefix" 'unexpected name' wrong-basename
test -d "$wrong_name"

same_shape_sibling="$cleanup_base/$cleanup_prefix.ABC123"
mkdir -p -- "$same_shape_sibling"
expect_cleanup_refusal "$cleanup_base" "$same_shape_sibling" "$cleanup_prefix" 'unowned fixture root' unowned-same-shape
test -d "$same_shape_sibling"

create_test_temp_root "$other_cleanup_base" "$cleanup_prefix"
different_parent="$test_temp_root_result"
expect_cleanup_refusal "$cleanup_base" "$different_parent" "$cleanup_prefix" 'outside temporary base' different-parent
test -d "$different_parent"
cleanup_test_temp_root "$other_cleanup_base" "$different_parent" "$cleanup_prefix"

symlink_cleanup_target="$test_root/symlink-cleanup-target"
mkdir -p -- "$symlink_cleanup_target"
printf 'survive\n' >"$symlink_cleanup_target/target.sentinel"
create_test_temp_root "$cleanup_base" "$cleanup_prefix"
registered_symlink="$test_temp_root_result"
rm -- "$registered_symlink/.dotln-test-root-owner" "$registered_symlink/.dotln-owner.json"
rmdir -- "$registered_symlink"
ln -s -- "$symlink_cleanup_target" "$registered_symlink"
expect_cleanup_refusal "$cleanup_base" "$registered_symlink" "$cleanup_prefix" 'unsafe fixture-root cleanup target' symlink-root
test -L "$registered_symlink"
test -f "$symlink_cleanup_target/target.sentinel"
rm -- "$registered_symlink"

create_test_temp_root "$cleanup_base" "$cleanup_prefix"
replaced_root="$test_temp_root_result"
original_root="$replaced_root.original"
mv -- "$replaced_root" "$original_root"
mkdir -- "$replaced_root"
printf 'replacement survives\n' >"$replaced_root/replacement.sentinel"
expect_cleanup_refusal "$cleanup_base" "$replaced_root" "$cleanup_prefix" 'without its ownership marker' replaced-root
test -f "$replaced_root/replacement.sentinel"
test -f "$original_root/.dotln-test-root-owner"
printf 'PASS replacement guard: a new directory at the owned path was preserved\n'

replacement_base="$test_root/replacement-base"
mkdir -- "$replacement_base"
replacement_base="$(resolve_test_tmp_base "$replacement_base")"
create_test_temp_root "$replacement_base" "$cleanup_prefix"
root_beneath_replaced_base="$test_temp_root_result"
root_beneath_replaced_base_name="${root_beneath_replaced_base##*/}"
original_base="$replacement_base.original"
mv -- "$replacement_base" "$original_base"
mkdir -p -- "$replacement_base/$root_beneath_replaced_base_name"
printf 'replacement survives\n' >"$root_beneath_replaced_base/replacement.sentinel"
expect_cleanup_refusal "$replacement_base" "$root_beneath_replaced_base" "$cleanup_prefix" 'without its ownership marker' replaced-base
test -f "$root_beneath_replaced_base/replacement.sentinel"
test -f "$original_base/$root_beneath_replaced_base_name/.dotln-test-root-owner"
printf 'PASS replacement guard: a recreated base and child were preserved\n'

create_test_temp_root "$cleanup_base" "$cleanup_prefix"
changed_marker_root="$test_temp_root_result"
printf 'changed\n' >"$changed_marker_root/.dotln-test-root-owner"
printf 'survive\n' >"$changed_marker_root/data.sentinel"
expect_cleanup_refusal "$cleanup_base" "$changed_marker_root" "$cleanup_prefix" 'changed ownership marker' changed-marker
test -f "$changed_marker_root/data.sentinel"
printf 'PASS ownership guard: a changed marker preserved the directory\n'

create_test_temp_root "$cleanup_base" "$cleanup_prefix"
owned_root="$test_temp_root_result"
printf 'fixture data\n' >"$owned_root/data.txt"
cleanup_test_temp_root "$cleanup_base" "$owned_root" "$cleanup_prefix"
test ! -e "$owned_root"
printf 'PASS exact owned cleanup: generated root removed\n'

probe_script="$test_root/trap-probe.sh"
{
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'set -euo pipefail' \
    'source "$1"' \
    'tmp_base="${TMPDIR:-/tmp}"' \
    'tmp_base="$(resolve_test_tmp_base "$tmp_base")"' \
    'test_root_prefix="$2"' \
    'create_test_temp_root "$tmp_base" "$test_root_prefix"' \
    'test_root="$test_temp_root_result"' \
    'install_test_temp_root_traps "$tmp_base" "$test_root" "$test_root_prefix"' \
    'printf "%s\\n" "$test_root" >"$3"' \
    'if [[ "$4" == ordinary ]]; then exit 0; fi' \
    'if [[ "$4" == unsafe ]]; then rm -- "$test_root/.dotln-test-root-owner" "$test_root/.dotln-owner.json"; rmdir -- "$test_root"; ln -s -- "$6" "$test_root"; exit 0; fi' \
    'printf "ready\\n" >"$5"' \
    'while :; do sleep 1; done'
} >"$probe_script"
chmod +x "$probe_script"

ordinary_trap_base="$test_root/ordinary-trap-base"
ordinary_root_record="$test_root/ordinary-root.txt"
mkdir -p -- "$ordinary_trap_base"
TMPDIR="$ordinary_trap_base" bash "$probe_script" "$script_dir/test-temp-root.sh" dotln-ordinary-trap-test "$ordinary_root_record" ordinary "$test_root/unused-ready"
ordinary_root="$(tr -d '\n' <"$ordinary_root_record")"
if [[ -n "${DOTLN_TEMP_GATE:-}" ]]; then
  test -f "$ordinary_root/.dotln-owner.json"
  node "$_dotln_temp_root_tool" remove "$ordinary_root"
fi
test ! -e "$ordinary_root"
printf 'PASS ordinary EXIT trap: fixture root removed\n'

unsafe_trap_base="$test_root/unsafe-trap-base"
unsafe_trap_target="$test_root/unsafe-trap-target"
unsafe_root_record="$test_root/unsafe-root.txt"
mkdir -p -- "$unsafe_trap_base" "$unsafe_trap_target"
printf 'survive\n' >"$unsafe_trap_target/target.sentinel"
set +e
TMPDIR="$unsafe_trap_base" bash "$probe_script" "$script_dir/test-temp-root.sh" dotln-unsafe-trap-test "$unsafe_root_record" unsafe "$test_root/unused-ready" "$unsafe_trap_target" >/dev/null 2>&1
unsafe_trap_status=$?
set -e
test "$unsafe_trap_status" = 1
unsafe_root="$(tr -d '\n' <"$unsafe_root_record")"
test -L "$unsafe_root"
test -f "$unsafe_trap_target/target.sentinel"
printf 'PASS unsafe EXIT trap: cleanup refusal forced a non-zero exit and removed nothing\n'

exercise_suite_signal() {
  local signal="$1"
  local expected_status="$2"
  local beacon_mode="${3:-owned}"
  local signal_base="$test_root/signal-$signal-$beacon_mode"
  local signal_output

  mkdir -p -- "$signal_base"
  signal_output="$(TMPDIR="$signal_base" "$node_bin" --input-type=module -e '
    import fs from "node:fs";
    import assert from "node:assert/strict";
    import path from "node:path";
    import { spawn } from "node:child_process";
    const [suite, base, signal, expectedText, deadlineModule, beaconMode] = process.argv.slice(1);
    const { startDeadline } = await import(deadlineModule);
    const expected = Number(expectedText);
    const ready = `${base}/signal-ready`;
    const child = spawn("/bin/bash", [suite, "--signal-probe-ready", ready], {
      env: { ...process.env, TMPDIR: base },
      detached: true,
      stdio: "ignore",
    });
    const signalGroup = (kind) => {
      try { process.kill(-child.pid, kind); }
      catch (error) { if (error.code !== "ESRCH") throw error; }
    };
    let foundRoot = false;
    let sent = false;
    let beacon;
    let proof;
    let failure;
    let forcedKill = false;
    let killTimer;
    const deadline = startDeadline("fixture-temp-root:signal-cleanup", 15000);
    const captureAvailableProof = (entries) => {
      if(proof?.beacon) return;
      const name=entries.find(entry=>/^dotln-release-test\.[^/]{6}$/.test(entry));
      if(!name) return;
      const root=path.join(base,name),marker=path.join(root,".dotln-test-root-owner");
      const owner=`${name}:${child.pid}:0\n`;
      if(!fs.existsSync(marker) || fs.readFileSync(marker,"utf8")!==owner) return;
      const stat=fs.lstatSync(root),markerStat=fs.lstatSync(marker);
      assert.ok(stat.isDirectory() && !stat.isSymbolicLink() && markerStat.isFile() && !markerStat.isSymbolicLink());
      assert.equal(fs.realpathSync(root),root);assert.equal(stat.uid,process.getuid());
      proof ??= {root,device:stat.dev,inode:stat.ino,owner};
      const file=path.join(root,"signal-beacon"),item=fs.lstatSync(file,{throwIfNoEntry:false});
      if(item && !proof.beacon) {
        assert.ok(item.isDirectory() && !item.isSymbolicLink());
        assert.equal(fs.realpathSync(file),file);assert.equal(item.uid,process.getuid());
        proof.beacon={file,device:item.dev,inode:item.ino};
      }
    };
    const restoreKilledBeacon = () => {
      if(!proof || !fs.existsSync(proof.root)) return;
      const stat=fs.lstatSync(proof.root),marker=path.join(proof.root,".dotln-test-root-owner"),markerStat=fs.lstatSync(marker);
      assert.ok(stat.isDirectory() && !stat.isSymbolicLink() && markerStat.isFile() && !markerStat.isSymbolicLink());
      assert.equal(fs.realpathSync(proof.root),proof.root);assert.equal(path.dirname(proof.root),base);
      assert.equal(stat.uid,process.getuid());assert.equal(stat.dev,proof.device);assert.equal(stat.ino,proof.inode);
      assert.equal(fs.readFileSync(marker,"utf8"),proof.owner);
      if(!proof.beacon) return;
      const item=proof.beacon,current=fs.lstatSync(item.file,{throwIfNoEntry:false});
      if(!current) return;
      assert.ok(current.isDirectory() && !current.isSymbolicLink());
      assert.equal(fs.realpathSync(item.file),item.file);assert.equal(current.uid,process.getuid());
      assert.equal(current.dev,item.device);assert.equal(current.ino,item.inode);
      assert.equal(fs.readFileSync(path.join(item.file,"signal"),"utf8"),"disposable beacon\n");
      fs.chmodSync(item.file,0o700);
    };
    const fail = (error) => {
      if(failure) return;
      failure=error;
      clearInterval(poll);
      signalGroup("SIGTERM");
      killTimer=setTimeout(()=>{
        try { captureAvailableProof(fs.readdirSync(base)); }
        catch(error) { failure=error; }
        forcedKill=true;
        signalGroup("SIGKILL");
      },1000);
    };
    const poll = setInterval(() => {
      try {
      deadline.check();
      if(sent) return;
      const entries = fs.readdirSync(base);
      captureAvailableProof(entries);
      foundRoot ||= entries.some((entry) => /^dotln-release-test\.[^/]{6}$/.test(entry));
      if (foundRoot && fs.existsSync(ready) && !sent) {
        beacon = JSON.parse(fs.readFileSync(ready,"utf8")).beacon;
        assert.equal(fs.statSync(beacon).mode & 0o777,0o111,"signal interrupts the restricted beacon");
        assert.equal(beacon,proof.beacon.file);
        if(beaconMode === "driver-failure") throw new Error("synthetic signal-driver assertion");
        if(beaconMode === "forced-kill") {
          signalGroup("SIGSTOP");
          throw new Error("synthetic stopped-child deadline");
        }
        if(beaconMode === "substituted") {
          fs.renameSync(beacon,beacon+".saved");
          fs.mkdirSync(beacon);
          fs.writeFileSync(path.join(beacon,"replacement"),"retain replacement\n");
        }
        sent = true;
        signalGroup(signal);
      }
      } catch(error) { fail(error); }
    }, 10);
    child.on("exit", (code, exitSignal) => {
      deadline.finish();
      clearInterval(poll);
      clearTimeout(killTimer);
      try {
      if(forcedKill) restoreKilledBeacon();
      if(failure) {
        if(beaconMode === "driver-failure") {
          assert.equal(forcedKill,false);assert.equal(code,143);assert.equal(exitSignal,null);
          if(process.env.DOTLN_TEMP_GATE) {
            assert.equal(JSON.parse(fs.readFileSync(path.join(proof.root,".dotln-owner.json"))).outcome,"failed");
            fs.rmSync(proof.root,{recursive:true});
          } else assert.equal(fs.existsSync(proof.root),false,"failed driver reaps the restoring child");
        } else if(beaconMode === "forced-kill") {
          assert.equal(forcedKill,true);assert.equal(exitSignal,"SIGKILL");
          assert.equal(fs.statSync(beacon).mode & 0o777,0o700,"forced-kill cleanup restores only captured beacon");
          assert.ok(fs.existsSync(path.join(proof.root,".dotln-test-root-owner")));
          fs.rmSync(proof.root,{recursive:true});
        } else throw failure;
        process.stdout.write("status=1\n");
        return;
      }
      if (!foundRoot || !sent || code !== expected || exitSignal !== null) {
        process.stderr.write(`unexpected ${signal} result: root=${foundRoot} code=${code} signal=${exitSignal}\n`);
        process.exitCode = 1;
        return;
      }
      if(beaconMode === "substituted") {
        const root=path.dirname(beacon);
        assert.equal(path.dirname(root),base);
        assert.equal(fs.realpathSync(root),root);
        assert.equal(fs.readFileSync(path.join(beacon,"replacement"),"utf8"),"retain replacement\n");
        assert.equal(fs.statSync(beacon+".saved").mode & 0o777,0o111,"refusal preserves original permissions");
        assert.ok(fs.existsSync(path.join(root,".dotln-test-root-owner")),"refusal retains ownership marker");
        fs.chmodSync(beacon+".saved",0o700);
        assert.equal(fs.readFileSync(path.join(beacon+".saved","signal"),"utf8"),"disposable beacon\n");
        fs.rmSync(root,{recursive:true});
      }
      if(process.env.DOTLN_TEMP_GATE && beaconMode === "owned") {
        const owner=JSON.parse(fs.readFileSync(path.join(proof.root,".dotln-owner.json")));
        assert.equal(owner.outcome,"failed");
        assert.equal(owner.retentionHours,24);
        fs.rmSync(proof.root,{recursive:true});
      }
      process.stdout.write(`status=${code}\n`);
      } catch(error) {
        process.stderr.write(`signal-driver failure: ${error.message}\n`);
        process.exitCode=1;
      }
    });
  ' "$script_dir/test-release.sh" "$signal_base" "SIG$signal" "$expected_status" "$script_dir/../packages/skeleton/src/gate-deadlines.mjs" "$beacon_mode")"
  grep -Fq "status=$expected_status" <<<"$signal_output"
  if find "$signal_base" -mindepth 1 -maxdepth 1 -type d -name 'dotln-release-test.??????' | grep -q .; then
    printf 'error: %s left release-suite fixture residue\n' "$signal" >&2
    exit 1
  fi
  printf 'PASS %s trap (%s beacon): suite exited %s with no fixture residue\n' "$signal" "$beacon_mode" "$expected_status"
}

exercise_suite_signal INT 130
exercise_suite_signal TERM 143
exercise_suite_signal TERM 1 substituted
exercise_suite_signal TERM 1 driver-failure
exercise_suite_signal TERM 1 forced-kill

# A close reads only the owned roots; explicit global prune still discovers
# foreign gate fixtures. Count distinct owner-file reads, not just removals.
"$node_bin" --input-type=module - "$test_root" "$script_dir" <<'JS'
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
import { pathToFileURL } from 'node:url';
const [container,scripts]=process.argv.slice(2);
const {runGit}=await import(pathToFileURL(join(scripts,'lib/git.mjs')));
const {ensureTemporaryRoot,readTemporaryOwner,writeTemporaryOwner,removeTemporaryRoot}=await import(pathToFileURL(join(scripts,'lib/temporary-roots.mjs')));
const {pruneHarness}=await import(pathToFileURL(join(scripts,'lib/harness-prune.mjs')));
const {temporaryPrunePaths,boundTemporaryRoots}=await import(pathToFileURL(join(scripts,'lib/temporary-prune.mjs')));
const main=join(container,'scope-main'),foreign=join(container,'scope-foreign'),base=join(container,'scope-roots');
for(const dir of [main,foreign,base])fs.mkdirSync(dir);
for(const dir of [main,foreign])runGit(dir,['init','-q']);
const template=ensureTemporaryRoot(join(base,'dotln-foreign-000000'),{class:'gate-fixture',repository:foreign,owner:{pid:2147483647,birth:'1.0',gateId:undefined,suite:undefined}});
const owner=readTemporaryOwner(template);delete owner.fixtureOwner;
owner.createdAt='2020-01-01T00:00:00.000Z';owner.endedAt=owner.createdAt;
writeTemporaryOwner(template,owner);
const foreignRoots=[template];
for(let index=1;index<1000;index++){
 const dir=join(base,`dotln-foreign-${String(index).padStart(6,'0')}`);fs.mkdirSync(dir);
 const stat=fs.lstatSync(dir);fs.writeFileSync(join(dir,'.dotln-owner.json'),JSON.stringify({...owner,token:randomUUID(),device:stat.dev,inode:stat.ino}));foreignRoots.push(dir);
}
const own=ensureTemporaryRoot(join(container,'owned-close-root'),{class:'session-scratch',repository:main});
const reused=ensureTemporaryRoot(join(container,'reused-close-root'),{class:'session-scratch',repository:main});
fs.rmSync(reused,{recursive:true});
ensureTemporaryRoot(reused,{class:'session-scratch',repository:foreign});
const closing=join(container,'closing-order');fs.mkdirSync(closing);
const captured=ensureTemporaryRoot(join(container,'captured-order-root'),{class:'session-scratch',repository:closing});
const capturedOwner=readTemporaryOwner(captured),saved={path:captured,token:capturedOwner.token,repository:closing};
fs.rmSync(closing,{recursive:true});
const boundOptions={scope:'close',ownedTemporaryRoots:[saved]};
assert.ok(!temporaryPrunePaths(main,boundOptions).includes(reused),'stale registry cannot admit a foreign replacement');
assert.ok(temporaryPrunePaths(main,boundOptions).includes(captured),'captured order root survives removal of its ledger');
assert.ok(temporaryPrunePaths(main,{scope:'all',temporaryBases:[base]}).includes(reused),'global scope keeps its existing discovery');
// Owner markers record a checkout's physical path, so a closing checkout
// listed through a symlink must still bind and hand over its roots.
const physical=join(container,'symlinked-order'),linked=join(container,'symlinked-order-link');
fs.mkdirSync(physical);fs.symlinkSync(physical,linked);
const viaLink=ensureTemporaryRoot(join(container,'symlinked-order-root'),{class:'session-scratch',repository:physical});
const bound=boundTemporaryRoots(linked);
assert.deepEqual(bound.map(row=>row.path),[viaLink],'a checkout listed through a symlink binds its registered root');
assert.equal(bound[0].repository,fs.realpathSync(physical),'the binding records the physical checkout');
assert.ok(temporaryPrunePaths(main,{scope:'close',ownedTemporaryRoots:bound}).includes(viaLink),'the scoped close admits the captured root');

const options={temporaryBases:[base],publishedRelease:()=>null,processes:[],holders:[],openPaths:[],codexHomeRoot:join(container,'no-codex-homes')};
const original=fs.readFileSync;let seen=new Set();
fs.readFileSync=function(file,...args){const name=String(file);if(name.startsWith(base+'/')&&name.endsWith('/.dotln-owner.json'))seen.add(name);return original(file,...args);};
syncBuiltinESMExports();
try{
 const close=await pruneHarness(main,{...options,...boundOptions});
 const closeCount=seen.size;assert.equal(closeCount,0);
 assert.ok([...close.candidates,...close.retained].some(row=>row.path===own));
 assert.ok([...close.candidates,...close.retained].some(row=>row.path===captured));
 assert.ok(![...close.candidates,...close.retained].some(row=>row.path===reused));
 fs.rmSync(captured,{recursive:true});ensureTemporaryRoot(captured,{class:'session-scratch',repository:foreign});
 assert.ok(!temporaryPrunePaths(main,boundOptions).includes(captured),'captured token cannot admit its replacement');
 seen=new Set();await pruneHarness(main,{...options,scope:'all'});
 assert.equal(seen.size,1000);
 console.log('WO239 close-scope counts '+JSON.stringify({close:closeCount,all:seen.size}));
}finally{fs.readFileSync=original;syncBuiltinESMExports();for(const dir of [...foreignRoots,own,reused,captured,viaLink])removeTemporaryRoot(dir,readTemporaryOwner(dir).token);}
JS

printf 'fixture temp-root tests passed\n'
