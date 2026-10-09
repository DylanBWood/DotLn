#!/usr/bin/env bash
# WO-190 criterion 4: builds the umbrella activation fixture from a scripts
# tree and runs `resume activate` once, printing everything the command
# prints. The fixture is the one scripts/test-resume.sh's umbrella case builds.
#   usage: umbrella-activation.sh <scripts-tree-root> <fixture-dir>
# <scripts-tree-root> holds scripts/resume.mjs, scripts/lib,
# scripts/test-beacon-fixture.mjs with the packages it copies, and .gitignore.
set -euo pipefail
unset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID
tree="$1"
repo="$2"
rm -rf -- "$repo"
mkdir -p -- "$repo/scripts" "$repo/docs/work-orders"
cp -- "$tree/scripts/resume.mjs" "$repo/scripts/resume.mjs"
cp -R -- "$tree/scripts/lib" "$repo/scripts/lib"
node "$tree/scripts/test-beacon-fixture.mjs" "$repo"
printf '%s\n' \
  '# WO-900 — Umbrella fixture (version assigned at activation)' \
  '' \
  '**Model:** fixture-model.' \
  '**Effort:** executor high; verifier high; reviewer any.' \
  '**Umbrella record (2026-10-09):** superseded whole by WO-901 and WO-902; not activatable.' \
  '' \
  '<!-- dotln-dependencies:start -->' \
  '[' \
  '  {"workOrderId":"WO-901","relation":"superseded","reason":"fixture split: carried by WO-901.","by":"WO-901"},' \
  '  {"workOrderId":"WO-902","relation":"superseded","reason":"fixture split: carried by WO-902.","by":"WO-902"}' \
  ']' \
  '<!-- dotln-dependencies:end -->' \
  '' \
  '**Objective:** fixture umbrella.' >"$repo/docs/work-orders/WO-900-umbrella.md"
git init -q "$repo"
cp -- "$tree/.gitignore" "$repo/.gitignore"
set +e
node "$repo/scripts/resume.mjs" activate WO-900 docs/work-orders/WO-900-umbrella.md 2>&1
status=$?
set -e
printf 'exit %s\n' "$status"
if [[ -f "$repo/docs/control/orders/WO-900.jsonl" ]]; then
  printf 'control segment: %s\n' "$(cat "$repo/docs/control/orders/WO-900.jsonl")"
else
  printf 'control segment: absent\n'
fi
