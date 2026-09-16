# WO-047 repair evidence — VER-001 F1

Dispatch: `resume: fix`, 2026-09-15. Source finding:
[VER-001 F1](../../verifications/WO-047/VER-001.md#findings).

**Actor attestation:** {"harness":"codex","harnessVersion":"0.154.0","model":"unknown","effort":"unknown","source":"installed-cli-observed; effective-model-and-effort-unavailable"}

The installed CLI reports `codex-cli 0.154.0`. Effective model and effort
readback are unavailable. The root agent owns the writer reservation; two
advisory agents reviewed publication and inherited failures read-only. Explicit harness
observations are used; no automatic Codex hooks are claimed.

## Repair and factual review

The initial `npm run publication:check` reproduced F1: one missing roadmap
heading and both audience editions stale. The repair changes the WO-047 roadmap
heading to the existing bold delivery-note form and recomputes both TOC source
locks with `node scripts/check-publication.mjs --print-locks` after that edit.
The checker now reports all 264 product headings indexed and both editions
current (30 and 45 linked source sections).

Both TOCs were inspected against the changed Events and decisions contract:
neither asserts the old reserved-key-only projection, and their summaries remain
accurate. Their shared source-base revision is preserved as source-selection
provenance. The everyday edition's lock also reflects the roadmap subtree's
changed heading structure. A refreshed lock witnesses changed bytes; this
receipt's factual review is separate evidence and does not replace independent
verification. No remaining stale derivative was found in the affected surfaces.

[D003](decisions.md#wo-047-d003) records the cause, alternatives, goal alignment,
and reopening condition. The decisions index was regenerated. The original
replay implementation, tests, runtime pins and evidence editions are unchanged
by this repair. `npm run release -- prepare --local` confirms the staged
v0.22.0 target remains current and changes no files; its observation is local
and precedes the operator's instruction to await a parallel merge.

## Executed validation

- `npm run publication:check`: passes, with 264/264 headings indexed and both
  editions current. The locks were recomputed after the roadmap correction.
- `npm test`: **19 passed, 0 failed; 62 fresh tasks; 412.61 seconds**. This
  includes the original replay obligations and publication-checker fixtures.
  Only the capability-document header, decision receipts and repair report
  changed afterward; application source and runtime evidence are unchanged.
- `npm run test:docs`: **14 passed, 3 failed; 17 fresh tasks; 115.00 seconds**.
  Publication, format, release surfaces, index, runtime evidence and skeleton
  documentation passed. Two planning suites refused stale planning cost
  evidence; console documentation refused an unsupported capability header.
- `npm test -- --only console-docs`, after the header repair: **2 passed,
  0 failed; 2 fresh tasks; 74.90 seconds**. The actual collection and projection
  now expose capabilities, with the existing read-only assertions preserved.
- `git diff --check`: clean.

## Encountered adjacent issues

Adjacent item 1 normalizes `Remaining gate` to the existing `Blocking-gate
reassessment` column in `docs/planning/capability-table.md`. Root read-only
probes reproduced the parser error at both HEAD and the current tree; changing
that header in memory restored 30 rows. The subsequent executed console check
confirms the on-disk correction. Capability claims and levels did not change,
and no parser expansion or component bump was needed.

Adjacent item 2 remains deferred to the next planning continuation for the
authorized WO-045/WO-046 write-backs. Root `buildPlanSubject` probes reproduced
the same stale-cost error at HEAD, repair-entry checkpoint 5 and the working
tree before the header correction. Advisory historical analysis traces the
unmeasured source changes to WO-045's acceptance expansion and WO-046's appended
capability reassessment. The retained legacy receipt binds cost-table bytes;
refreshing a hash alone would not reconcile its judgment. Preserve the table
and historical receipt until planning ownership reconciles that provenance,
then validate `npm run plan -- check` and `npm run test:docs`.

[D004](decisions.md#wo-047-d004) records both dispositions. The broad document
gate is not claimed green. F1's publication regression is repaired, and the
bounded adjacent console regression has passing executable evidence. Usage
counters remain separate ignored observations; no cost saving is claimed.

## Operator hold and release

The operator initially instructed a hold before verification, then explained
that a parallel work order had not yet merged and directed no merge-status
check. WO-047 remained in `repairing` after the passing repair checks.

The operator subsequently released that hold: "just send this to verification;
i'll have final review handle the administrative tasks". Record
`repair-complete` against this repaired subject; administrative, integration
and version reconciliation remain with final review. The inherited planning
follow-up and its failed document checks remain disclosed above. No parallel
merge check, integration, version update, branch commit or publication is part
of this handoff.
