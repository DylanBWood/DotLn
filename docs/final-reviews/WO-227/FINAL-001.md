# WO-227 — FINAL-001

**Verdict:** fail. Criterion 7 is unmet: an author-written target URL in reviewed Release notes receives the exemption intended for generated record links. The earlier verification blockers remain repaired. No branch publication is authorized by this result.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.163.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

**Process cost:** entry 59545 tokens; handoff 3425048 tokens; source codex-transcript-counter

Usage scope is dispatch; entry cutoff 2026-10-22T19:42:12.218Z and report cutoff 2026-10-22T19:47:06.619Z. The totals include repeated and cached input; USD cost is unavailable. Final counters stay in ignored receipts and the response. No worker was spawned; observed admissions are 0 of 20, with unobserved coverage unknown. The actor records the active-session readback, rather than the order's recommended xhigh effort.

## Subject and integration

Reviewed [WO-227](../../work-orders/WO-227-outward-publication-as-intended.md), its cited product contracts and planning receipt 052's recorded carry-ins, the authored implementation and test diff, [VER-001](../../verifications/WO-227/VER-001.md), [VER-002](../../verifications/WO-227/VER-002.md), [VER-003](../../verifications/WO-227/VER-003.md), the [handoff](../../evidence/WO-227/handoff.md), decisions and [worker dispositions](../../evidence/WO-227/self-review.md). New inputs are the shared confirmation parser, the current gate lookup and this review's Release-link reproduction. No required input remains unresolved. Generated and oversized projections are judged by their producers and checks.

`worktree integrate WO-227` preserved the intake archive, checkpoint `refs/dotln/checkpoint/WO-227/14` and its named stash. Original base and fetched main are both `4dfb8052d670d0d9c363f9cf110cd9b8e73395fc`; there were no authored conflicts or source changes. The integrated code identity remains `84acede72027d5592a2b6de4d4acebaebe1efb4508ca74e06e560f376ca32ed9`, exactly VER-003's subject. Application v0.91.0 remains the minor target above v0.90.0; component sources and versions are unchanged, with no collision or evidence re-mint. [D029](../../evidence/WO-227/decisions.md#wo-227-d029) records the carried-forward claims and integration checks.

The main traps were mistaking ordinary review words for banned terms, and trusting an exemption's label instead of checking which bytes it admits. I kept the operator's contextual-review contract and varied the provenance of the Release link. NoOp would leave the demonstrated identifier escape unreported. The acceptance review is complete; the implementation still needs the bounded repair below.

## Blocking finding

**F1 — Medium; criterion 7; escape.** At `scripts/release.mjs:2594-2604`, `targetReleaseNotesBody` scans the completed body for any URL under the target repository's `blob/<tagged commit>/` prefix and exempts it from `identifier.launchpad` and `vocabulary.review`. It does not establish that the renderer generated the link from the moved-record map. An author-written link to `docs/WO-006-notes.md` therefore receives the exception even when that path does not exist in the target or the record mapping.

The [reproduction](../../evidence/WO-227/final-review-release.mjs) first writes that absolute link at another revision: close exits 1 with `identifier.launchpad: WO-006 (line 5, reviewed notes)` and pushes no tag. It then changes only the URL revision to the target's tagged commit: close exits 0, the fake forge gets the tag and Release, and the published body carries the identifier. `namedPathExists` is false. The expected-refusal assertion fails, so the bounded command exits 1. This is a failure of the required Release lint, not a request to ban ordinary words or remove legitimate generated record links.

Repair rule: grant the exception only to destinations actually generated from the moved-record mapping, retaining their source spans. Keep authored target URLs subject to the ordinary identifier and review-word checks, and preserve private-list redaction and the completed-release binding. Pair the saved case with a legitimate moved-record-link control and independently re-verify. [D030](../../evidence/WO-227/decisions.md#wo-227-d030--final-review-routes-the-authored-release-link-exemption-to-repair) records the repair route. The class is escape because the defective code is unchanged from VER-003 and criterion 7 expressly includes Release linting.

<!-- dotln-findings:start -->
[
  {"id":"F1","route":"blocking","class":"escape","summary":"An author-written target URL at the tagged commit receives the generated-record exemption and publishes a launchpad identifier in reviewed Release notes."}
]
<!-- dotln-findings:end -->

## Criterion judgments

**Criterion 1:** met — The unchanged identifier implementation and the rerun VER-001 matrix refuse all seven forms across the four required artifact kinds, with valid spans. Records-message, Closes-reference and launchpad-title controls pass. The paired base controls remain in [controls.json](../../evidence/WO-227/controls.json).

**Criterion 2:** met — The rerun matrix confirms review words, empty/alias vocabulary behavior, stale-digest refusal and composed-body confirmation. The unchanged target-publish and target-worktree cases in the complete row cover both publication routes and recorded digest, match count and attestation; VER-001's independent journal observation and VER-003's judgment carry forward.

**Criterion 3:** met — Both private-path redaction probes pass. The absence-aware VER-002 kit-row reproduction exits 0: records creation succeeds, publication refuses with a redacted private-mode diagnostic, and no forge state, log or publication branch is created. The original filed probe remains unchanged. Present-empty, absent-list and malformed-marker controls pass in the rerun matrix; the previously boarded publish-surface line-number limitation remains D026.

**Criterion 4:** met — The rerun composed-body cases distinguish the added identifier path and public review-word path from the base-held `src/mask.ts`, with separate reviewed-prose and Change-table sections. The unchanged end-to-end fixture in the complete row covers draft and reviewed publication.

**Criterion 5:** met — The rerun target-only advisory case names the repeated `fixtures/gem-board.json` once and reports none for the launchpad control. The unchanged plan-refutation CLI case is covered by the complete row.

**Criterion 6:** met — The rerun non-prose cases refuse comments, empty code, thematic breaks and tables; ordinary prose and hard-break-preserving relocation pass. The reviewed github-body, release and worktree cases cover the three shape rules, current-order-only checking and published product-gate allowance. VER-003's CRLF follow-up remains D028.

**Criterion 7:** unmet — F1 exempts an authored URL that is not a generated record link. The prior repeated-release-recheck reproduction still exits 0, retains the original published digest on both retries and leaves the remote body unchanged. The unchanged complete-row cases continue to cover five-section rendering, legacy bytes, missing/invalid notes, confirmation and incomplete-attempt protection; those cases do not cover F1.

**Criterion 8:** met — Product 07, product 08, the kit README and docs map contain the required write-backs. Their existing generated-record boundary is the contract F1 violates; repair belongs in code. Publication and harness checks pass; `npm run meta -- --check` validates the refreshed decisions and follow-up projections.

**Criterion 9:** met — The complete `npm test -- --review` row at the integrated identity passes all 40 required suites, recorded 2026-10-22T19:13:50.790Z, duration 1781842 ms; the current lookup reports no missing Preflight suite. No fresh complete run is started after the reproduced blocker. `git diff --check` is clean, and package manifests, packages and both role-skill trees are unchanged. `npm run test:docs` is run after this report's last edit; its current-tree row supplies the document claim before filing.

## Evidence and handoff

[final-review-evidence.json](../../evidence/WO-227/final-review-evidence.json) records the integrated identity, complete row, three successful saved-probe commands and the failing new probe. The matrix has 22 met judgments, none failed and one neutral observation. Publication coverage, the 35 generated harness surfaces and local release surfaces pass. Reusing the complete row avoids repeating its 1781.842-second run while the new counterexample still fails; that compares gate work only, not total session time saved.

Existing follow-ups remain D018 (product 02 wording), D019 (invisible-character identifiers), D025 (planning-publication confirmation), D026 (malformed-list publish wording) and D028 (CRLF relocation). They are not new findings in this review. Planning receipt 052's private-review concern remains governed by the operator-authorized criterion 3, with no new reopening observation.

All probe publications use disposable synthetic repositories and fake local forges. No live target, employer material or live publication was used. This review changed only its evidence, report, integration decision and generated projections; it did not fix the implementation it judges. Gate lookup and bounded-runner instrumentation are unchanged. The next legal phase is bounded repair through `resume: fix`, followed by independent verification. No reviewed-state commit, push or PR is produced from this failing result.
