#!/bin/zsh
# WO-241 VER-001 probes. From the worktree root, with an empty directory the
# session may write (the DotLn session scratch printed at dispatch):
#   zsh docs/evidence/WO-241/verifier-001/probes.sh <scratch directory>
# Each probe reconstructs what it compares from Git and writes only under the
# scratch directory; each runs under the harness's bounded wrapper, one at a
# time. Expected outcomes are in docs/verifications/WO-241/VER-001.md.
W=$PWD
T=${1:?usage: probes.sh <scratch directory>}
P=$W/docs/evidence/WO-241/verifier-001
bounded() {
  node scripts/harness.mjs bounded --timeout-seconds 900 -- "$@" 2>&1 | grep -v '^bounded-\|^PROGRESS'
}
for probe in config-probe.mjs rename-probe.mjs instance-probe.mjs require-probe.cjs; do
  print "== $probe"
  mkdir -p "$T/$probe"
  bounded node "$P/$probe" "$W" "$T/$probe"
done
print "== features-cli.sh"
mkdir -p "$T/features-cli"
bounded zsh "$P/features-cli.sh" "$W" "$T/features-cli"
