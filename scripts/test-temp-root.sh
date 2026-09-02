#!/usr/bin/env bash

# Shared fixture-root handling for shell suites. This file is sourced after the
# caller enables its own shell options.

_dotln_test_temp_roots=()
_dotln_test_temp_bases=()
_dotln_test_temp_prefixes=()
_dotln_test_temp_tokens=()
test_temp_root_result=""

reject_test_tmp_base() {
  local raw_base="$1"
  local reason="$2"
  printf 'error: rejected temporary base %s: %s\n' "$raw_base" "$reason" >&2
  return 1
}

resolve_test_tmp_base() {
  local raw_base="$1"
  local candidate="$raw_base"
  local resolved

  while [[ "$candidate" == */ && "$candidate" != / ]]; do
    candidate="${candidate%/}"
  done

  if [[ "$candidate" != /* ]]; then
    reject_test_tmp_base "$raw_base" 'path must be absolute'
    return 1
  fi
  case "$candidate" in
    /)
      reject_test_tmp_base "$raw_base" 'filesystem root is not a fixture base'
      return 1
      ;;
    */../* | */..)
      reject_test_tmp_base "$raw_base" 'path is not a safe fixture base'
      return 1
      ;;
  esac
  if [[ ! -d "$candidate" ]]; then
    reject_test_tmp_base "$raw_base" 'not an existing directory'
    return 1
  fi
  if [[ ! -w "$candidate" ]]; then
    reject_test_tmp_base "$raw_base" 'directory is not writable'
    return 1
  fi
  if ! resolved="$(cd -- "$candidate" 2>/dev/null && pwd -P)"; then
    reject_test_tmp_base "$raw_base" 'could not resolve physical directory'
    return 1
  fi
  if [[ "$resolved" == / ]]; then
    reject_test_tmp_base "$raw_base" 'filesystem root is not a fixture base'
    return 1
  fi
  printf '%s\n' "$resolved"
}

create_test_temp_root() {
  local resolved_base="$1"
  local prefix="$2"
  local current_base
  local root
  local index
  local candidate_index
  local marker
  local token

  test_temp_root_result=""
  case "$prefix" in
    dotln-*-test) ;;
    *)
      printf 'error: invalid fixture-root prefix %s\n' "$prefix" >&2
      return 1
      ;;
  esac
  case "$prefix" in
    *[!A-Za-z0-9-]*)
      printf 'error: invalid fixture-root prefix %s\n' "$prefix" >&2
      return 1
      ;;
  esac
  if [[ "$resolved_base" != /* || "$resolved_base" == / || ! -d "$resolved_base" || ! -w "$resolved_base" || -L "$resolved_base" ]]; then
    reject_test_tmp_base "$resolved_base" 'creation requires a resolved writable directory'
    return 1
  fi
  if ! current_base="$(cd -- "$resolved_base" 2>/dev/null && pwd -P)" || [[ "$current_base" != "$resolved_base" ]]; then
    reject_test_tmp_base "$resolved_base" 'creation base is not in resolved form'
    return 1
  fi
  if ! root="$(mktemp -d "${resolved_base}/${prefix}.XXXXXX")"; then
    printf 'error: could not create fixture root beneath temporary base %s\n' "$resolved_base" >&2
    return 1
  fi

  index=0
  for candidate_index in "${!_dotln_test_temp_roots[@]}"; do
    if ((candidate_index >= index)); then
      index=$((candidate_index + 1))
    fi
  done
  marker="$root/.dotln-test-root-owner"
  token="${root##*/}:$$:$index"
  if ! (umask 077 && printf '%s\n' "$token" >"$marker"); then
    rm -f -- "$marker"
    if ! rmdir -- "$root"; then
      printf 'error: failed to remove fixture root after ownership-marker failure %s\n' "$root" >&2
    fi
    printf 'error: could not mark fixture-root ownership beneath temporary base %s\n' "$resolved_base" >&2
    return 1
  fi
  _dotln_test_temp_roots[$index]="$root"
  _dotln_test_temp_bases[$index]="$resolved_base"
  _dotln_test_temp_prefixes[$index]="$prefix"
  _dotln_test_temp_tokens[$index]="$token"
  test_temp_root_result="$root"
}

cleanup_test_temp_root() {
  local resolved_base="$1"
  local root="$2"
  local prefix="$3"
  local current_base
  local basename
  local parent
  local candidate_index
  local owned_index=""
  local shown_root="$root"
  local marker
  local marker_token

  if [[ -z "$shown_root" ]]; then
    shown_root='<empty>'
  fi

  if [[ -z "$root" || "$root" == "$resolved_base" || ! -d "$root" || -L "$root" ]]; then
    printf 'error: refusing unsafe fixture-root cleanup target %s\n' "$shown_root" >&2
    return 1
  fi
  if [[ ! -d "$resolved_base" || -L "$resolved_base" ]]; then
    printf 'error: refusing cleanup through changed temporary base %s\n' "$resolved_base" >&2
    return 1
  fi
  if ! current_base="$(cd -- "$resolved_base" 2>/dev/null && pwd -P)" || [[ "$current_base" != "$resolved_base" ]]; then
    printf 'error: refusing cleanup through unresolved temporary base %s\n' "$resolved_base" >&2
    return 1
  fi

  parent="${root%/*}"
  basename="${root##*/}"
  if [[ "$parent" != "$resolved_base" ]]; then
    printf 'error: refusing fixture-root cleanup outside temporary base: %s\n' "$shown_root" >&2
    return 1
  fi
  case "$basename" in
    "$prefix".??????) ;;
    *)
      printf 'error: refusing fixture-root cleanup with unexpected name: %s\n' "$shown_root" >&2
      return 1
      ;;
  esac

  for candidate_index in "${!_dotln_test_temp_roots[@]}"; do
    if [[ "${_dotln_test_temp_roots[$candidate_index]}" == "$root" && "${_dotln_test_temp_bases[$candidate_index]}" == "$resolved_base" && "${_dotln_test_temp_prefixes[$candidate_index]}" == "$prefix" ]]; then
      owned_index="$candidate_index"
      break
    fi
  done
  if [[ -z "$owned_index" ]]; then
    printf 'error: refusing cleanup of unowned fixture root %s\n' "$shown_root" >&2
    return 1
  fi
  marker="$root/.dotln-test-root-owner"
  if [[ ! -f "$marker" || -L "$marker" ]]; then
    printf 'error: refusing fixture-root cleanup without its ownership marker: %s\n' "$shown_root" >&2
    return 1
  fi
  if ! marker_token="$(<"$marker")" || [[ "$marker_token" != "${_dotln_test_temp_tokens[$owned_index]}" ]]; then
    printf 'error: refusing fixture-root cleanup with a changed ownership marker: %s\n' "$shown_root" >&2
    return 1
  fi

  if ! rm -rf -- "$root"; then
    printf 'error: failed to remove owned fixture root %s\n' "$root" >&2
    return 1
  fi
  if [[ -e "$root" || -L "$root" ]]; then
    printf 'error: owned fixture root remained after cleanup %s\n' "$root" >&2
    return 1
  fi
  unset "_dotln_test_temp_roots[$owned_index]"
  unset "_dotln_test_temp_bases[$owned_index]"
  unset "_dotln_test_temp_prefixes[$owned_index]"
  unset "_dotln_test_temp_tokens[$owned_index]"
}

_dotln_finish_test_temp_root() {
  local status="$1"

  trap - EXIT INT TERM
  if ! cleanup_test_temp_root "$_dotln_test_temp_trap_base" "$_dotln_test_temp_trap_root" "$_dotln_test_temp_trap_prefix"; then
    exit 1
  fi
  exit "$status"
}

install_test_temp_root_traps() {
  local resolved_base="$1"
  local root="$2"
  local prefix="$3"
  local candidate_index
  local owned=false

  for candidate_index in "${!_dotln_test_temp_roots[@]}"; do
    if [[ "${_dotln_test_temp_roots[$candidate_index]}" == "$root" && "${_dotln_test_temp_bases[$candidate_index]}" == "$resolved_base" && "${_dotln_test_temp_prefixes[$candidate_index]}" == "$prefix" ]]; then
      owned=true
      break
    fi
  done
  if [[ "$owned" != true ]]; then
    printf 'error: refusing traps for unowned fixture root %s\n' "${root:-<empty>}" >&2
    return 1
  fi

  _dotln_test_temp_trap_base="$resolved_base"
  _dotln_test_temp_trap_root="$root"
  _dotln_test_temp_trap_prefix="$prefix"
  trap '_dotln_finish_test_temp_root "$?"' EXIT
  trap '_dotln_finish_test_temp_root 130' INT
  trap '_dotln_finish_test_temp_root 143' TERM
}
