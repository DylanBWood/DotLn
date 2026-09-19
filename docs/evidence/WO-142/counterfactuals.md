# WO-142 counterfactual observations

Repair clarification (N12): this is a dated observation record. Temporary
helper scripts and logs named below were session-local and are not committed
or promised to remain available. Source predicates are inspections, distinct
from repository regression tests. Current repair commands and their outcomes
are recorded in [repair-001.md](repair-001.md).


Baseline original source is Git HEAD `cb932c845354ec871fd34e14dec859bb869776ef`. This read-only worker copied source and compiled dependencies into `/tmp` fixtures. No baseline source was restored into the repository. Every listed executable comparison passes with current source (exit0) and fails the intended assertion with original behavior (exit1). Exact whole original files were used except A2's original hash function transplanted into its shared location, A9's new length guard removed, A10's exact original producer expression, and A22's prior lack of closing baseline restored inside the extracted helper. A15 uses explicit one-behavior counterfactuals because many guards predated this order.

The same current/original structural predicates for pure hygiene and diagnostic text are in `A-structural-counterfactual.log` (23 checks; all current PASS/original FAIL) with executable `/tmp/wo142-structural-counters.py`. Original files for these checks are preserved at `/tmp/wo142-original-structure`. These do not substitute for the executor's final integrated checks.

| Row | Current assertion/check | Original behavior observed | Evidence |
| --- | --- | --- | --- |
| A1 | Actual named-actions/reopenings fixture | Ordinary decision creates1 row instead0 | A1-current.log / A1-original.log |
| A2 | Actual direct receipt/carried-order fixture with version-stamped WO-902 | WO-902 is rejudged instead of carried | A2-current.log / A2-original.log |
| A3 | Actual named-actions fixture's historical source link | Bare id fragment instead of full title | A3-current.log / A3-original.log |
| A4 | Real verify/final-review dispatch + immediate index check | Index stale at line3 after dispatch | A4-current.log / A4-original.log |
| A5 | Existence-gated decision link + shared predicate source checks | Both predicates fail on original code | A-structural-counterfactual.log |
| A6 | Actual unassigned-product-v1 title fixture | malformed instead of unassigned | A6-current.log / A6-original.log |
| A7 | Existing evidence retention pointers | Not reproduced; no counterfactual needed | [row dispositions](rows.md) |
| A8 | Actual control-store disposable/stray fixture | Disposable invalid bytes are parsed/refused | A8-current.log / A8-original.log |
| A9 | Only first heading normalizes; exact amendment length accepted / oversize refuses | Later heading changes; oversized bound silently accepted | A9-heading-{current,original}.log; A9-length-{positive,negative}.log |
| A10 | Actual resume lifecycle fixture pins final-review repair completion source | VER-003 instead of FINAL-002 | A15-resume-positive.log / A10-original.log |
| A11 | Seven independent diagnostic predicates | Every corresponding original predicate fails | A-structural-counterfactual.log |
| A12 | Quoted handoff + strict publish argument arity | Unquoted placeholder / surplus words unguarded | A-structural-counterfactual.log; positive resume/worktree logs |
| A13 | Actual symlink entry fixture | Command produces empty stdout instead of executing | A13-current.log / A13-original.log |
| A14 | Actual notes parser rejects 3 reserved shapes at non-section levels; tag/advisory source predicates | Missing expected rejection; no component FAIL/qualifier | A14-headings-{current,original}.log; A-structural-counterfactual.log; A14-A20-surfaces-positive.log |
| A15 | 12 item-specific counterfactuals | All12 intended assertions fail | [A15 transcripts](a15-transcripts.md) |
| A16 | Five one-definition/dead-export/shared-render predicates | Each original predicate fails | A-structural-counterfactual.log |
| A17 | Actual Version_2 runtime fixture + exercising-suite source inventory | runtime-unavailable instead of snapshot-missing; inventory absent | A17-runtime-{current,original}.log; A-structural-counterfactual.log |
| A18 | Actual DCO fixture with uppercase email | Matching author's signoff refused | A18-{current,original}.log |
| A19 | Four named tie-break sites use code-unit comparison; audit goldens remain unchanged | Original localeCompare predicates fail | Root transcript below |
| A20 | Exact console workspace pins, staged workspace builds and Node floor; release exact/caret fixture | Original package predicates fail | Root transcript below; release surfaces passed |
| A21 | Actual process table cutoff/source fixture | Required caption absent | A21-{current,original}.log |
| A22 | Actual survivor reproduction fixture + four helper/portability predicates | Closing baseline absent from call list; every source predicate fails | A22-baseline-{current,original}.log; A-structural-counterfactual.log |
| A23 | Actual imported suite protection inventory; root owns alias docs | format suite gets generic fallback | A23-protects-{current,original}.log and root alias check |

A4/A6/A13 current logs contain all19 work-order-index tests (all pass); the original comparisons were then narrowed to their named tests. Earlier broad negative runs were intentionally stopped to keep counterfactual work bounded, and replaced by completed focused originals; only final `*-original.log`/per-row JSON is evidence, not intermediate progress JSON lines. A2's initial missing copied public guide setup failure was replaced by completed actual fixture runs.

## Part A structural transcript

For hygiene and wording obligations the same source predicates were evaluated
on current source and exact activation-HEAD source. They are source checks,
not behavioral execution. The existing owning fixture commands are in rows.md.

```text
A5 link only when actual decision file exists: current=PASS; exact-original=FAIL
A5 work-order renderer uses shared tested duty predicate: current=PASS; exact-original=FAIL
A11 cascade names blocked suite and failed prerequisites: current=PASS; exact-original=FAIL
A11 progress strips trailing whitespace after truncation: current=PASS; exact-original=FAIL
A11 checkpoint subprocess refusal keeps subject/ref and ordinal: current=PASS; exact-original=FAIL
A11 actor label refusal supplies event ordinal: current=PASS; exact-original=FAIL
A11 stale index temporary names recovery: current=PASS; exact-original=FAIL
A11 suggested next command carries selected order: current=PASS; exact-original=FAIL
A11 candidate resolution hint avoids duplicate noun: current=PASS; exact-original=FAIL
A12 handoff quotes the title placeholder: current=PASS; exact-original=FAIL
A12 publish refuses surplus argument words: current=PASS; exact-original=FAIL
A14 bad baseline becomes component FAIL line: current=PASS; exact-original=FAIL
A14 untracked component source has explicit qualifier: current=PASS; exact-original=FAIL
A16 one shellQuote definition: current=PASS; exact-original=FAIL
A16 one withTemporaryBody definition: current=PASS; exact-original=FAIL
A16 snapshotReader/currentReader dead exports absent: current=PASS; exact-original=FAIL
A16 unused release notes reader absent: current=PASS; exact-original=FAIL
A16 resume delegates effort display to shared helper: current=PASS; exact-original=FAIL
A17 identity loader declared under exercising product suite: current=PASS; exact-original=FAIL
A22 all four transport flags probed: current=PASS; exact-original=FAIL
A22 all three probe temp roots portable: current=PASS; exact-original=FAIL
A22 measurement does not invent environment attestation: current=PASS; exact-original=FAIL
A22 feedback usage states write before record-selfhost: current=PASS; exact-original=FAIL
```

## Root and documentation transcript

The A19/A20/B6/B13 comparisons are source predicates over the named obligations.
B11 transpiles the original store in an external module and exercises its
append boundary; current refuses the invalid assigned envelope and HEAD accepts
it. The C comparisons check each row's required wording/outcome inventory on
current and HEAD documents; no immutable report is changed.

```text
Root row counterfactual checks; original committed subject versus current source.
A19: current PASS; HEAD subject FAIL
A20: current PASS; HEAD subject FAIL
B6: current PASS; HEAD subject FAIL
B13: current PASS; HEAD subject FAIL
B11: current append-invalid-envelope PASS (refused)
B11: HEAD append-invalid-envelope FAIL (accepted)
C1: current PASS; HEAD content counterfactual FAIL
C2: current PASS; HEAD content counterfactual FAIL
C3: current PASS; HEAD content counterfactual FAIL
C4: current PASS; HEAD content counterfactual FAIL
C5: current PASS; HEAD content counterfactual FAIL
C6: current PASS; HEAD content counterfactual FAIL
C7: current PASS; HEAD content counterfactual FAIL
C8: current PASS; HEAD content counterfactual FAIL
C9: current PASS; HEAD content counterfactual FAIL
C10: current PASS; HEAD content counterfactual FAIL
A23: current PASS; HEAD content counterfactual FAIL
C1 release block: 13 prose sentences (<=15)
```

## Part B and prune

[Package counterfactual observations](package-counterfactuals.json) record ten
current-pass/negative-fail source checks: B1, B2, B3, B4, B5, B7, B12(a), B16,
B17 and D1. Each names its source, original or deliberate-mutant status,
source digest and exact failed assertion. The checks extract focused functions
or use standalone modules in disposable roots; generated-hook and destructive
prune integration are separately covered by the repository fixtures.

[B8/B9/B10/B14/B15 evidence](package-counterfactuals.md) records the remaining
package groups and exact negative reasons. B6/B11/B13 appear in the root
transcript above. The B1 fixture repeats each of two identities twenty times;
original source loses the second identity. B5 removes only the known-resume
exemption, and D1 removes the target installation receipt pin lookup.

The final D1 safety fixtures additionally cover malformed installed manifests,
ambient GitHub target isolation, live owners, current/reserved sessions,
unknown markers, preview inventory equality and retained-lane byte proofs.
The final snapshot-link fixture passes with all four normal package links
inventoried once and fails without the new support (unowned or non-regular
material). The five final D1 fixtures all pass. These checks supplement the
earlier target-pin mutant; that mutant's source
digest records its earlier tested subject, not a claim to hash the final file.

## Adjacent observation

A separate probe against current and activation-HEAD store implementations
used a valid numeric occurredAt and payload `{value: NaN}`. Both returned the
original NaN while their JSON log replayed null:

```text
{"subject":"current","returnedIsNaN":true,"replayedValue":null}
{"subject":"HEAD","returnedIsNaN":true,"replayedValue":null}
```

This pre-existing divergence is recorded in [WO-142-D005](decisions.md#wo-142-d005--defer-the-pre-existing-append-serialization-divergence)
with a replay-scoped follow-up; it does not invalidate B11's assigned-envelope
validation. The first probe supplied a string occurredAt and correctly hit the
existing numeric-envelope refusal; the corrected valid-envelope probe above
is the observation used for the decision.
