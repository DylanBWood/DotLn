# WO-227 executor handoff

WO-227 implements identifier refusals, contextual vocabulary review and confirmation, separate generated-path diagnostics, stored pull-request body shape, and reviewed target Release notes. Application v0.91.0 remains the prepared minor release. No dependency or role text changed.

This repair addresses [VER-005 F1](../../verifications/WO-227/VER-005.md). A private match could start in an existing Change-table row and continue into an added path. The checker detected the match, but its redacted observation retained only the starting line. The publication helper therefore treated the entire match as existing vocabulary and dropped its refusal or review requirement. The unchanged production-draft reproduction demonstrated a synthetic push and fake pull request despite a configured refusal.

The checker now preserves each match's starting line, ending line and mode. The outward adapter carries that range into a span covering every contributing line. Missing or invalid endpoints refuse conservatively. Existing whole-row containment and overlap redaction then operate on the complete range: a crossing match keeps its refusal or required confirmation, and every contributing row stays redacted. Separate matches sharing a starting line keep separate endpoints and counts. [D035](decisions.md#wo-227-d035--carry-the-complete-private-line-range-through-exemptions-and-redaction) records the repair and alternatives; [repair evidence](repair-ver005-evidence.json) records both reproduction arms and validation.

Correction to the preceding handoff: its criterion 3 statement that private findings spanning whole lines left the row rule valid was wrong. The report and saved probes establish that token joining can cross multiple lines. A starting line is neither the full extent nor sufficient for redaction. The current handoff replaces that unsupported judgment.

Earlier repairs remain covered by the complete run: [VER-001](repair-ver001-evidence.json), [VER-002](repair-ver002-evidence.json), [FINAL-001](repair-final001-evidence.json), and [VER-004](repair-ver004-evidence.json).

## Acceptance judgments

**Criterion 1:** met — The complete outward-lint suite covers all seven identifier forms across branch, commit, pull-request title and body, with the records-message, `Closes #4` and launchpad-title controls. [controls.json](controls.json) retains the paired base controls. The private-range change preserves the identifier rule and kit-record exemption.

**Criterion 2:** met — The complete target-publish and target-worktree suites cover absent, stale and current composed-body confirmations and their recorded digest, count and actor attestation. Empty `reviewTerms`, the legacy alias advisory and rejection of both keys remain covered. Crossing private review matches now require confirmation in both the shared helper and production draft route.

**Criterion 3:** met — Refuse mode refuses before outward effects; explicit and unmarked review modes require confirmation. The saved two-row reproductions now pass, and new three-row cases pass for all three spellings. Coverage includes different endpoints sharing a start, an intervening blank line, LF/CRLF/CR mapping, absent or invalid endpoints, stale confirmation, and redaction on the last contributing row. Existing-path-only matches remain exempt. Present-empty, absent-list and malformed-marker behavior remains covered by the complete suites.

**Criterion 4:** met — The complete target-worktree, target-publish and github-body suites retain added identifier-path refusal, review of `fixtures/launchpad-board.json`, exemption of existing `src/mask.ts`, and separate reviewed-prose diagnostics. The new matrix preserves crossing private matches over two and three rows, redacts an overlapping public word and identifier on the final row, and still names an unrelated public path.

**Criterion 5:** met — The complete plan-refutation suite passes the target-only Execution-plan path advisory and launchpad control.

**Criterion 6:** met — The complete github-body, release and worktree suites pass meter relocation, preserved hard breaks, rejection of non-prose shapes, the published product-gate allowance, and current-order-only checking. The existing CRLF follow-up remains D028.

**Criterion 7:** met — The complete target-worktree Release suite passes reviewed five-section rendering, link rewriting, legacy bytes, pre-push missing/invalid-note refusal, confirmation, incomplete-attempt digest refusal, repeated completed-release rechecks and the provenance-boundary cases from earlier repairs.

**Criterion 8:** met — Product 08, product 07, the kit README and `docs/README.md` retain the required shape, review semantics, target header, modes, empty lists and confirmation guidance. Product 07 and the kit README now state the complete private line range and redaction of every contributing row. Publication synchronization regenerated the stale edition, and the complete generated-surface checks pass. D036 corrects the earlier evidence-source inventory claim: `terms.mjs` is registered for authority and harness evidence, but the checked editions remain current and feedback sources did not change, so no re-mint or live episode is owed.

**Criterion 9:** met — The complete `npm test -- --review` row at code identity `fb8927c9ee2a173f56cbd05a2a647eda6437f9c2d6c9adc60036bd01a895026d` passes all 40 required suites with 106 fresh tasks in 1774218 ms, recorded `2026-10-23T00:07:19.005Z`. `git diff --check` is clean. No dependency, package manifest or role-skill tree changed. The `npm run test:docs` claim requires its passing current-tree row after this handoff's final edit; `repair-complete` consumes that row and refuses without it.

## Executed evidence

- The unchanged [private-range probe](verification-005-probes.mjs) exits 1 before repair and 0 afterward. All three private modes now meet their expected result, and the 506-case section oracle passes. The reported private span expands from `[90,107)` to `[90,126)`.
- The unchanged [production-draft probe](verification-005-publish.mjs) exits 1 before repair after observing publication. After repair it exits 0: publish status 1, no remote fixture branch and no fake pull request.
- The first complete run stopped at a harness assertion expecting the old diagnostic shape. The expected redacted diagnostic was updated to include `endLine`; its focused case passed. The new three-row draft case also exposed a singular/plural typo in its assertion; after correction its focused case passed. Both failures and remedies remain in the repair evidence.
- The fresh complete run passes all 40 suites, with no unrun or stale suite and no reused task. Code identity, build output and shared refs stayed unchanged during the run. The canonical evidence waiter exited 0. Its earlier default wait window expired while tests were still active; the replacement waiter observed the same run's success.
- Release preparation retained v0.91.0. Synchronization reported all evidence editions current and regenerated the stale publication edition. A repository walk outside intake found no nested repository. The adjacent queue remains empty at revision 0.

Publication evidence uses disposable local Git fixtures and fake forges. No live target publication was performed. All background test and evidence-wait processes have completed.

## Review and limits

self-review: found 24; fixed 20; recorded 4

These are the initial implementation's [two independent worker reviews](self-review.md), run as `dotln-worker-fable` with claude-fable-5-1 at selected effort xhigh. This repair spawned no workers: observed admissions 0 of 20, with unobserved coverage unknown. Independent re-verification is the next dispatch.

This repair answers D034/FUP-f106e6391fd5dd16; its register disposition remains with planning. Existing nonblocking follow-ups remain documented in D018, D019, D025, D026 and D028. The earlier link and section-label limits remain in D031 and D033. No required repair input remains unresolved.

Private ranges intentionally cover whole lines rather than exact private positions. A caller needing finer exemptions or persisted observations must establish a privacy-preserving contract first, as D035 records. This repair preserves the existing choice to label a crossing finding by the section where it starts while redacting all overlapping rows.

Goal alignment: the outcome matches the requested repair. The traps were retaining only the reported first row, merging distinct ranges, exposing more private positions, or removing legitimate existing-path exemptions. Complete line ranges with separate endpoints address those cases. NoOp would have left both saved publication bypasses reproducible.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.163.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

**Process cost:** entry 54738 tokens; handoff preparation 18275762 tokens; source codex-transcript-counter.

Scope is dispatch. Entry cutoff is `2026-10-22T23:21:24.923Z`; handoff-preparation cutoff is `2026-10-23T00:07:19.133Z`. The latter total includes 17965184 cached input tokens. USD cost is unavailable. The current-session readback supplies the actor above; selected effort max differs from the order's recommended xhigh. Final counters stay in ignored receipts and the operator response. The failed complete attempt took 361400 ms and the passing fresh run took 1774218 ms; the passing run reuses no earlier task.
