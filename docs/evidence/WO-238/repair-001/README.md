# WO-238 repair 001 evidence

The repair of [VER-001](../../../verifications/WO-238/VER-001.md), observed on
2026-11-03 against the verified checkpoint `refs/dotln/checkpoint/WO-238/5`
(code identity `1adddfb582fa9f06a2e1ade12fef4497e5c4ad53e3b14dbcd3c1865d78e70385`)
and the repair's working tree. The decisions are
[WO-238-D031](../decisions.md#wo-238-d031--every-reader-of-a-document-reference-resolves-it-one-way)
(F1),
[WO-238-D032](../decisions.md#wo-238-d032--release-close-refuses-publication-until-every-routed-packet-names-its-release)
(F2) and
[WO-238-D033](../decisions.md#wo-238-d033--the-repeated-document-gate-advisory-counts-within-its-handoff)
(F3).

## F1: one meaning for a reference

The rule the repaired code holds: every reader of a document reference
resolves it with `referencePath` or `currentPath` in
`scripts/lib/document-moves.mjs`. A moved document's own relative links are
read from the directory it was written in, and an old path the move map lists
names the document where it lives now. A moved path is never reused: the
document check refuses a file at one, so an old path names one document
whenever a session read it or a record linked it. The link check, the entry
points, the reader bindings, the red tags, the read census, `plan documents`,
the kit export's upstream pointers and the dependency migration's seed read
all call it.

[reference-cases.mjs](reference-cases.mjs) runs eight cases, each on its own
fixture, against the scripts directory it is given. Only the second case is
the one VER-001 quoted; the first is its direct-path control, and the other
six are this repair's. [reference-cases.json](reference-cases.json) records
both runs: on the verified checkpoint every mapped case fails and the control
holds; on the repair all eight hold. The last case first read "a file at the
old path keeps its reads"; the round-1 review showed that it moved earlier
reads to a later file, and the no-reuse rule replaced it
([WO-238-D035](../decisions.md#wo-238-d035--a-moved-path-is-never-reused)).
To repeat the comparison from the worktree root:

```sh
old="$(mktemp -d)"
git archive refs/dotln/checkpoint/WO-238/5 | tar -x -C "$old"
ln -s "$PWD/node_modules" "$old/node_modules"
node scripts/harness.mjs bounded -- node docs/evidence/WO-238/repair-001/reference-cases.mjs "$old/scripts"
node scripts/harness.mjs bounded -- node docs/evidence/WO-238/repair-001/reference-cases.mjs "$PWD/scripts"
```

The same cases are one test in `scripts/test-docs-check.mjs`, "a reference
names one document for every reader: …", which fails on the checkpoint at the
mapped Start here link and passes on the repair.

## F2: the close refuses before it publishes

The rule: release close judges every packet routed to the closing order, as
main carries it, with the other release surfaces before anything publishes.
A packet that names another release than the one the close publishes fails
`proposal-delivery`, so the close publishes no tag and no GitHub Release and
names the route command that writes the release. Routing writes the version
in the order's heading once the order's merge has brought its passed final
review into the routing checkout, so that command completes the delivery
from a planning branch of main.

The release case `routed_after_preparation` in `scripts/test-release.sh`
runs the close flow: main carries a packet routed to WO-099 with no release
after the order's merge; `release close WO-099 --publish` exits non-zero with
the `FAIL proposal-delivery` line and the route command, and neither the
local checkout nor the origin holds `v0.2.1` and `gh` created no Release.
The route then writes `v0.2.1` from main, that change is pushed, and the
close publishes `v0.2.1` with the packet naming it and the close record
listing it. Run against the checkpoint's scripts with this repair's
`test-release.sh`, the case stops at its first check with `error: release
close published while a routed packet names no release`; on the repair it
passes:

```sh
cp scripts/test-release.sh "$old/scripts/test-release.sh"
node scripts/harness.mjs bounded -- bash "$old/scripts/test-release.sh" --case routed_after_preparation
node scripts/harness.mjs bounded -- bash scripts/test-release.sh --case routed_after_preparation
```

`scripts/test-entropy-review.mjs` "the fake transport drives review, receipt,
refute, refutation-receipt and dispose end to end" adds the route itself: the
delivery rule fails a packet routed to WO-904 with no release and names
`npm run entropy -- dispose REVIEW-001 fixture-suggestion route 'Delivered by
WO-904' --order WO-904`; once WO-904 is closed in the checkout's control
record, that command writes `v0.9.4` from the order's heading and the rule
passes, while the filing hash still holds.

## F3: a handoff's own repetitions

`scripts/test-runner.test.mjs` "WO-238 the repeated document-gate advisory
counts the runs of the current handoff only: …" uses the verifier's fixture
shape: one executor document row, then one verifier row after the verifier's
handoff began, gives no advisory; the same rows without a handoff bound give
the two-run advisory VER-001 reproduced; a second tree within the verifier's
handoff gives it, naming the handoff's start.

## The repair's first review round

[WO-238-D034](../decisions.md#wo-238-d034--the-repairs-first-review-round-nine-findings-eight-fixed-one-recorded)
lists the round's nine findings and what each changed;
[WO-238-D037](../decisions.md#wo-238-d037--product-07s-goal-section-keeps-its-links-until-a-planning-pass)
corrects one of them, so seven are fixed and two recorded. Each fix has its
case:

- A program binds the document its reference names and no other:
  `scripts/test-docs-check.mjs` "a program binds the document its reference
  names and no other: …" fails on the checkpoint's scripts, where a bare
  `guide.md` and a longer path ending in a document's path both bound an
  unread page, and passes on the repair. On this repository the unbound and
  program-bound sets are unchanged (27 and 15).
- The paths the kit's own commands write keep core's kinds in an instance:
  "every document is standing, record or generated by its path, a marker
  line or the override list" and the export test "[document] WO-238 criteria
  1 and 9: …" compare them with no `documents.json` row.
- An unreadable release history makes the census window unavailable: "an
  unreadable release history makes the census window unavailable: …".
- A route whose control events cannot be appended leaves the packet and the
  log as they were: the end-to-end dispose test makes the log read-only.
- The twelve packets' delivery is judged in the document selection:
  `scripts/test-docs-check.mjs` "WO-238 the twelve filed packets name the
  order and the release that carried each, as the release tags record".

Rounds 2 and 3
([WO-238-D038](../decisions.md#wo-238-d038--the-repairs-second-review-round-two-more-fixes-two-findings-kept-recorded),
[WO-238-D039](../decisions.md#wo-238-d039--the-repairs-last-review-round-a-path-is-a-complete-token-and-criterion-10-is-judged-on-the-declared-map))
tightened the whole-path match twice: a program's whole path is now a
complete token, so `docs/planning/extended.md.json`,
`docs/planning/doubled.md..json` and `docs/planning/tilde.md~` bind nothing
but themselves, while a sentence's final period and a `#section` fragment
still bind; and product 07 now states the no-reuse rule. The round-3 fix, 31
source lines, ran after the last review and is judged by the complete run.

Recorded, not fixed: moved records' relative links do not resolve in a
Markdown viewer without the map
([WO-238-D036](../decisions.md#wo-238-d036--moved-records-relative-links-resolve-through-the-map-not-in-a-markdown-viewer));
and product 07's two goal-section links to moved records keep their old paths,
because that section is the planning subject's goal standard, which the
current planning receipt binds byte for byte: rewriting them failed the plan
gate, so the next planning pass that revises the section rewrites them
(WO-238-D037).

## Limits

The release case represents the second route with the production
`carryingRelease` and `writeDelivery` functions the `entropy dispose` route
calls, because the release fixture holds no entropy review; the entropy test
runs the command itself. No live publication or remote release was made. The
atomic route was not run against the earlier write order; that the earlier
order left the packet routed is read from its source, where the packet was
written before the events were appended.
