#!/bin/zsh
# WO-241 VER-001, criteria 2 and 3: the real `features` command in a fixture
# root: a missing page, render, a fresh check, a changed election, a hand
# edit, a closed queued consumer, a configured document root and an unknown
# id. Arguments: the worktree root and an empty scratch directory.
W=$1
F=$(mktemp -d "$2/features-cli-XXXXXX")
run() {
  DOTLN_LAUNCHPAD=$F node "$W/scripts/features.mjs" "$@" > "$F.out" 2> "$F.err"
  print -r -- "exit $? ($*): $(head -c 160 $F.out | tr '\n' ' ')$(head -c 220 $F.err | tr '\n' ' ')"
}
print "missing page:"; run check
run render
print "rendered rows $(grep -c '^| [a-z]' $F/docs/control/FEATURES.md), not-electable bullets $(grep -c '^- The ' $F/docs/control/FEATURES.md)"
print "fresh page:"; run check
print '{"version":1,"features":{"plan-first":{"on":true,"note":"try | it"}}}' > $F/dotln.config.json
print "changed election:"; run check
run render
grep '^| plan-first' $F/docs/control/FEATURES.md
run check
print "hand edit:"; print "tampered" >> $F/docs/control/FEATURES.md; run check
run render
mkdir -p $F/docs/control/orders
print -r -- '{"schemaVersion":1,"workOrderId":"WO-242","type":"WorkOrderActivated","workOrderPath":"docs/work-orders/WO-242-fixture.md"}' > $F/docs/control/orders/WO-242.jsonl
print -r -- '{"schemaVersion":1,"workOrderId":"WO-242","type":"FinalReviewCompleted","verdict":"pass"}' >> $F/docs/control/orders/WO-242.jsonl
print "closed queued consumer:"; run check
print '{"version":1,"roots":{"docs":"records"}}' > $F/dotln.config.json
print "configured document root:"; run check; run render; run check
print '{"version":1,"features":{"plan-frist":true}}' > $F/dotln.config.json
print "unknown id:"; run list
rm -rf "$F" "$F.out" "$F.err"
