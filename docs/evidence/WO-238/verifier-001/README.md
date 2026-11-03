# WO-238 verification 001 evidence

Observed on 2026-11-03 against code identity
`1adddfb582fa9f06a2e1ade12fef4497e5c4ad53e3b14dbcd3c1865d78e70385`,
with base `b9e843b6978e057d6794b9d0a76af557e9547ba0`.
The verifier changed only its report, evidence, decisions and their generated
index. The product implementation was not repaired during verification.

## F1: a mapped record escapes the entry-point check

Run from the worktree root:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-238/verifier-001/document-attacks.mjs
```

The script creates a temporary fixture, a dated record under the planning
passes directory and a valid move-map entry from its original path. The root
instruction's Start here section links to that record. With the current path,
`checkDocs` reports one named record and fails. With the mapped original path,
the same check reports no named record and no failure; `linkFailures` also
returns no error. Both links resolve to the same record under the move contract.

[document-attacks.json](document-attacks.json) records both outcomes. The script
asserts the observed defect, so exit zero means the reproduction succeeded,
not that the requirement passed. `linkTarget` and `quotedPath` in
`scripts/lib/document-kinds.mjs` test physical document paths without the map;
`scripts/docs-check.mjs` resolves the map when checking links. The same missing
record is absent from `documentRows` and therefore from `plan documents`.

Repair rule: entry-point discovery, reader bindings and link checks must agree
on the document a supported mapped reference names. Keep the original record
bytes and test both direct and mapped references, including their fragments.
This fails criteria 3 and 4. The input uses the supported Markdown and
`document-moves.json` forms; no new selector vocabulary is required.

The same script also verifies that repeated reads and writes in one session
count once, duplicate journal copies count once, retained journals contribute,
moved paths accrue to their destination, and an unhooked Codex session is
labeled unobserved. Those checks pass.

## F2: close leaves a late-routed packet's release unset

Run from the worktree root:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-238/verifier-001/delivery-attack.mjs
```

The script uses the production delivery writer to represent a packet routed
after the last release preparation and before publication. It evaluates the
exact post-publication delivery handler extracted from `scripts/release.mjs`,
changing only its import URL and supplying the publication tag. The handler's
digest and results are in [delivery-attack.json](delivery-attack.json).

Observed: the packet remains byte-identical with `release: null`; the retained
record also names a null release; an advisory requests a later route command.
The preparation helper can produce the required release value, but close
neither applies it nor prevents publication before the mismatch occurs.
Expected: a successful close of the carrying order leaves the packet naming
the published release. This fails criterion 7.

Repair rule: make delivery completion part of the close contract. Preserve
clean main and the reviewed preparation transaction; unresolved metadata must
not reach successful publication. A prerequisite that requires corrected
preparation before publication is a compatible repair route. A later manual
disposal is not completion of close. Keep a route-after-preparation regression
that exercises the close flow.

Limit: this is a focused execution of the production delivery handler, not a
full release close or a publication. The fixture holds only the fields that
handler reads. The existing routing tests establish that an unreleased order
receives a null release; source review establishes that publication precedes
this handler. No remote release was created.

## Supporting checks and limits

[checks.txt](checks.txt) retains the ten passing focused tests and the passing
implementation formatting check. [corpus-audit.json](corpus-audit.json) records
the independent corpus checks: 53 moved records kept their bytes, the 14 role
pins and parent chain matched, all 14 cold-start measurements matched, and all
26 external lock entries were unchanged. The follow-up register gained no
missing source: its 18 inherited missing-source rows are closed, and no pending
row has a missing source. The observed read census remains a lower bound.

The current complete review row passed 118 tasks at the subject identity; its
recorded duration is 0 h 39 min. Its current review selection was checked with
`requireFinalReviewGate`; a lookup demanding every document-only Preflight
suite inside that product row is not the lifecycle's coverage rule. The final
document result and row consumed for this report are in
[handoff-checks.json](handoff-checks.json).

The executor's five review rounds were considered, including the final two
combined repair reviews. Their repeated criterion-7 finding remains reproduced.
The focused tests cover the repaired link-base/reference-definition behavior,
release-tag selection, pass succession and red-tag carry, page stability,
delivery backfill, fifth lens and own-evidence document-row exception.

The document checker, census, changed gate-row reuse and generated role
instructions are themselves under verification. The mapped-reference probe
compares their separate interpretations instead of trusting their shared green
result. The new document-row behavior was exercised in a separate fixture.
No additional review worker was needed; no provider dollar cap was enforced.

## F3: the repeat counter crosses handoff boundaries

Run `node scripts/harness.mjs bounded -- node docs/evidence/WO-238/verifier-001/handoff-count-attack.mjs` from the worktree root.
The isolated synthetic gate-index fixture creates one executor document row,
adds a verifier report, then creates its one document row. The first claim has
no advisory; the second accepts the current verifier row but reports two runs
as a handoff failure. [handoff-count-attack.json](handoff-count-attack.json)
records the result. These fixture rows are not real executed gates and never
enter the subject index. The advisory must count within the current handoff;
this is a nonblocking follow-up because correct-row admission still holds and
no declared acceptance criterion or main behavior was shown broken.
