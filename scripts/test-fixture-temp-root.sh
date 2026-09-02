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
rm -- "$registered_symlink/.dotln-test-root-owner"
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
    'if [[ "$4" == unsafe ]]; then rm -- "$test_root/.dotln-test-root-owner"; rmdir -- "$test_root"; ln -s -- "$6" "$test_root"; exit 0; fi' \
    'printf "ready\\n" >"$5"' \
    'while :; do sleep 1; done'
} >"$probe_script"
chmod +x "$probe_script"

ordinary_trap_base="$test_root/ordinary-trap-base"
ordinary_root_record="$test_root/ordinary-root.txt"
mkdir -p -- "$ordinary_trap_base"
TMPDIR="$ordinary_trap_base" bash "$probe_script" "$script_dir/test-temp-root.sh" dotln-ordinary-trap-test "$ordinary_root_record" ordinary "$test_root/unused-ready"
ordinary_root="$(tr -d '\n' <"$ordinary_root_record")"
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
  local signal_base="$test_root/signal-$signal"
  local signal_output

  mkdir -p -- "$signal_base"
  signal_output="$(TMPDIR="$signal_base" "$node_bin" -e '
    const fs = require("node:fs");
    const { spawn } = require("node:child_process");
    const [suite, base, signal, expectedText] = process.argv.slice(1);
    const expected = Number(expectedText);
    const child = spawn("/bin/bash", [suite], {
      env: { ...process.env, TMPDIR: base },
      stdio: "ignore",
    });
    let foundRoot = false;
    let sent = false;
    const deadline = Date.now() + 15000;
    const poll = setInterval(() => {
      if (Date.now() > deadline) {
        clearInterval(poll);
        child.kill("SIGKILL");
        process.stderr.write("timed out waiting for release-suite fixture root\n");
        process.exitCode = 1;
        return;
      }
      const entries = fs.readdirSync(base);
      foundRoot ||= entries.some((entry) => /^dotln-release-test\.[^/]{6}$/.test(entry));
      if (foundRoot && !sent) {
        sent = true;
        setTimeout(() => child.kill(signal), 50);
      }
    }, 10);
    child.on("exit", (code, exitSignal) => {
      clearInterval(poll);
      if (!foundRoot || code !== expected || exitSignal !== null) {
        process.stderr.write(`unexpected ${signal} result: root=${foundRoot} code=${code} signal=${exitSignal}\n`);
        process.exitCode = 1;
        return;
      }
      process.stdout.write(`status=${code}\n`);
    });
  ' "$script_dir/test-release.sh" "$signal_base" "SIG$signal" "$expected_status")"
  grep -Fq "status=$expected_status" <<<"$signal_output"
  if find "$signal_base" -mindepth 1 -maxdepth 1 -type d -name 'dotln-release-test.??????' | grep -q .; then
    printf 'error: %s left release-suite fixture residue\n' "$signal" >&2
    exit 1
  fi
  printf 'PASS %s trap: suite exited %s with no fixture residue\n' "$signal" "$expected_status"
}

exercise_suite_signal INT 130
exercise_suite_signal TERM 143

printf 'fixture temp-root tests passed\n'
