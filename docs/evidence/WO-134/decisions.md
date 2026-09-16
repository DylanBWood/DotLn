# WO-134 decisions

## WO-134-D001 — Resolve same-day passes from validated receipts

```json
{
  "id": "WO-134-D001",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Share latestPlanningPass between both refutation paths; retain latest-date selection and resolve same-day ties using validated planning receipts.",
  "evidence": [
    "docs/work-orders/WO-134-planning-pass-selection.md",
    "scripts/lib/plan-direct.mjs",
    "scripts/refute-plan.mjs",
    "scripts/lib/plan-receipts.mjs",
    "scripts/lib/plan-subject.mjs",
    "docs/work-orders/WO-084-ledger-order-and-index.md"
  ],
  "rejected": [
    {
      "option": "NoOp or a shared ledger-position comparator",
      "reason": "Both preserve silent dependence on an unchecked insertion convention and recurring operator repair."
    },
    {
      "option": "Break ties by heading or hash",
      "reason": "A deterministic arbitrary order can still select the already-judged pass instead of the missing receipt."
    },
    {
      "option": "Select every unreceipted historical heading or change the continuation gate",
      "reason": "Historical headings may be exempt; changing enforcement or subject composition exceeds this bounded fix."
    }
  ],
  "reopenWhen": "A real workflow needs several unjudged passes on the latest date, or latest-date selection disagrees with the gate outside the reported same-day case."
}
```

The gate requires receipts for every enforced pass, then uses the validated
planning receipt chain for the current horizon. It does not sort the ledger by
date. The existing helpers independently choose the first same-date section.
Reuse the gate's existing introduction/exemption classification, without
changing its enforcement semantics, then keep latest-date selection among
enforced passes. Before enforcement, fall back to the dated ledger headings.
Among headings on the selected date,
choose the sole pass without a planning receipt; when all are judged, choose
the latest planning receipt's pass. Several unjudged same-day passes are
ambiguous: report that fact rather than invent chronology from file position.
Evidence-only receipts do not establish planning judgments. Share the helper
and reuse the already-read validated history in both dispatch paths.

This removes an operator repair in planning that obstructs dependable runtime
delivery and the pending release review. Policy resistance/fixes that fail and
drift: align selection with existing receipt evidence without weakening the gate.
Commons and escalation: reuse existing validation and one test case, with no
new command, hook, dependency or recurring procedure. Success to the successful:
compare receipts against the incumbent position rule and arbitrary sorting.
Shifting the burden: section swaps no longer require operator rescue. Rule
beating: test both dispatch paths against the gate's missing pass and preserve
historical receipt validation. Seeking the wrong goal: restore usable planning
dispatch, not a new process metric. Naive Interventionism: preserve dates,
receipt bytes, subject composition, holds and continuation behavior; use small
reversible source edits and isolated Git fixtures. NoOp leaves the observed
wrong-pass selection in place. Ledger organization remains WO-084's scope.

New inputs: the existing fixture suite `scripts/test-plan-refutation.mjs` and
the test runner's suite selection; the planning-map candidate write-backs are
explicitly required by this order. A read-only independent audit confirmed the
gate's distinction between missing receipts and the current judged horizon.

Correction, 2026-09-16: the first implementation assumed that all headings on
the latest date were subject to the gate. A read-only audit identified
same-day and future-dated headings present before the mechanism's introduction;
the gate exempts those exact headings. Extract its existing classification into
`planningPassScope` in the already-cited receipts module, and use it in both the
gate and selector. Fixtures cover both exemptions. The original two-helper
scope therefore also includes this shared extraction; no gate rule changes.

## WO-134-D002 — Bind pending direct requests to their pass

```json
{
  "id": "WO-134-D002",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Include the selected pass in new direct-request filenames, preserve older requests, and retain legacy pointer compatibility.",
  "evidence": [
    "scripts/lib/plan-direct.mjs",
    "scripts/test-plan-refutation.mjs",
    "docs/work-orders/WO-134-planning-pass-selection.md"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Consecutive full-scope direct judgments with identical subjects can retain the old pass despite correct selection."
    },
    {
      "option": "Overwrite or remove the previous request",
      "reason": "Discards recovery evidence; a pass-specific filename is sufficient."
    }
  ],
  "reopenWhen": "A saved request targets a different pass from the current dispatch, or a legacy pending request cannot be filed."
}
```

The operator explicitly answered “Include the bounded fix” after the independent
audit found this adjacent defect. Queue item `adjacent-0001` records the cause,
scope, announcement and actor-attested check-in. The original test seeded a
receipt directly, missing the saved-request interaction. Exercise two full-scope
direct dispatches with unchanged subjects; verify distinct request files and
unchanged older bytes. Accept the previous pointer filename form when filing,
and reject reuse when stored pass identity differs. Receipt and subject formats
remain unchanged.

The mission and trap analysis in D001 applies: remove operator repair, retain
evidence, add no procedure, and test the actual dispatch rather than a fabricated
green result. Naive Interventionism favors a reversible ignored-file naming fix
over deletion or a receipt-format change. The tradeoff is one retained local
request per pass instead of an accidental cross-pass collision.

Release preparation observed the local tag snapshot: the assigned patch target
v0.23.0 remains current. Only repository planning scripts change; no package
component or generated application output changes, so no component bump is
needed. Reopen release timing at integration if the published baseline advances.

## Executor outcome — 2026-09-16

The [validation record](validation.md) and retained transcripts establish the
intended behavior: same-day section order no longer determines selection,
historical exemptions and receipt subjects remain intact, and consecutive
direct dispatches retain distinct pass identities without deleting evidence.
All 33 planning fixtures, 17 document suites and 19 product suites passed.
The two existing native-process fixtures required an approved outside-sandbox
runner; the complete product run passed there without a source change.

This supports the promised removal of wrong-pass operator repair in the
covered workflow. No live planning dispatch or measured operator-time saving
is claimed. The added regression is one case in the existing suite; no new
command, hook, gate or dependency was added. The ambiguity and out-of-date-order
receipt conditions above remain explicit reasons to reopen the selection rule.
