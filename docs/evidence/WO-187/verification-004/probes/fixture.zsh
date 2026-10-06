#!/bin/zsh
# Run the WO-187 lifecycle fixture at the subject, then against the 08845c71 resume source.
set -u
zmodload zsh/datetime
unset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID
repo=$1 scratch=$2
for which in current baseline; do
  parent=$(mktemp -d "$scratch/fixture-$which-XXXXXX")
  parent=${parent:A}
  print -r -- owner > $parent/.dotln-test-root-owner
  start=$EPOCHREALTIME
  if [[ $which == baseline ]]; then
    git -C $repo show 08845c71:scripts/resume.mjs > $scratch/original-resume.mjs
    node $repo/scripts/test-verification-review.mjs $parent $scratch/original-resume.mjs > $scratch/fixture-$which.out 2>&1
  else
    node $repo/scripts/test-verification-review.mjs $parent > $scratch/fixture-$which.out 2>&1
  fi
  code=$?
  print -r -- "$which exit=$code seconds=$(( EPOCHREALTIME - start ))"
  grep -E "passed|AssertionError|at file" $scratch/fixture-$which.out | head -3
done
