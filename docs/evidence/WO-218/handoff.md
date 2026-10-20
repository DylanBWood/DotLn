# WO-218 repair handoff

Dispatch: `resume: fix`, repairing [VER-001](../../verifications/WO-218/VER-001.md).
The selected 45 rows have terminal dispositions: 40 settled and five declined,
with no deferred or unresolved selected row. [The canonical readbacks](followup-readback.json)
and [before, triage and after tables](README.md) retain each row’s source revision,
reason and reopening condition.

This repair closes the reported evidence gap. The 91 paired controls distinguish
new fixes, fixture adequacy changes and already-met behavior. New arrangements
cover valid null and mixed gate observations, a refused close’s planned deletion,
shared dependency-free composition, configured publication roots, protected
material, concurrent closes, foreign tags, rebase protection and role-specific
recovery. CONTRIBUTING names the instance contribution setting; product 07 and
D045 state which ordinary local tags count. [D057](decisions.md#wo-218-d057--repair-ver-001s-evidence-class-and-bounded-follow-ups) and [D058](decisions.md#wo-218-d058)
record the choices and the corrections to inadequate fixture assertions.

**Criterion 1:** met — all 45 canonical readbacks have current source revisions and terminal dispositions recorded after activation at 2026-10-20T01:19:37.234Z. Counts remain 40 settled and five declined; no operator packet is owed.

**Criterion 2:** met — all 40 settled rows and all 33 WO-221 findings name exact Preflight fixture commands with a passing implementation arm and an isolated reversion, or a recorded passing baseline-module arm classified as already met. The [control matrix](repair-controls.md) and [machine-readable results](repair-controls.json) retain scope, output and hashes. The complete review and document selection cover the declared Preflight suites.

**Criterion 3:** met — five whole-row declines name harm, evidence and reopening conditions in their canonical reasons and D004, D005, D017, D025 and D029. Including the four partial declines gives nine, below the cap of fifteen.

**Criterion 4:** met — complete canonical touching pagination returned 11 other pending matches over 2 pages and none of the selected 45. The README names every match. D055’s repair row is settled; D056 remains a separate planning follow-up.

**Criterion 5:** met — the README preserves all 45 entry rows and supplies the final rows and readback commands. Historical global pending was 158 at entry, 166 before the original application, and 158 afterward; selected unresolved fell from 45 to zero. Allocated rows were excluded from pending. The repair’s separate register observations are recorded alongside those counters; no 45-row fall in global pending is claimed.

**Criterion 6:** met — the authorized product write-backs and instance-identity correction are present. The complete review’s generated checks validate metadata, publication, runtime and selected evidence editions. The final document gate judges the report and register write-backs.

**Criterion 7:** met — the fresh complete review passed all 43 suites with 108 fresh tasks, no reused or unrun tasks, and unchanged code/build identities. The document selection passed at 2026-10-20T15:08:16.329Z; completion requires another passing document row for this final handoff and register tree. The gates include formatting, whitespace and generated-evidence checks. No dependency was added.

[Repair execution evidence](repair-execution.json) records the complete review
at 2026-10-20T15:02:05.054Z, duration 1,748,416 ms, code identity
`6b809fff4a6b533c8fe347d184f0a155f6557e4375af712666206ed5da1ee7b0`. The earlier implementation execution record remains
[historical evidence](execution.json). Failed complete repair runs and
rejected controls are not counted as passing evidence. The final document row
is consumed by `repair-complete`; recording completion runs no replacement gate.

self-review: found 36; fixed 36; recorded 0

[The existing review record](self-review.md) retains the original two workers,
the operator-requested third worker and their supplemental passes. Its 36
reported findings include duplicate reports and wording corrections. This
repair launched no workers; the executor remained the sole repository writer.
The original explicit launch count was three, with no requested descendants;
the harness’s observed admission count does not establish complete coverage.

The five whole-row declines retain the withdrawn beacon freshness window,
manual withdrawn-worktree recovery, historical-manifest retirement boundary,
build work before refusal of an absent generated path, and incomplete discovery
of bare or unreadable metadata-only repositories. The four partial declines
retain WO-210 F11/F15’s explicit ownership-recovery need, WO-215 FU1’s need to
restore the physical checkout or recover ownership manually, and the
unobservable part of WO-221 FINAL-001 F16’s identical rule replacement. The
observable interrupted-removal cases remain protected by their journal.

Application v0.87.0 remains staged as a minor, with compiler 0.28.0, skeleton
0.63.0 and console 0.4.3. D047 and D053 retain the classification and impact.
Current evidence remains WO-218 authority/002, artifact-identity/001,
verification/001 and feedback-001. The repair changed tests and documentation;
the existing deterministic editions and carried feedback audit were checked
again by the gate. Historical editions remain intact. No new judged feedback
behavior was introduced by this repair.

Goal alignment: the outcome matches the intended evidence repair. It addresses the evidence class rather than counting
unrelated failures. Formatting-only failures and invalid fixture inputs were
rejected as proof. The retained NoOp limits remain explicit. D056’s planning
nomination is preserved; the work order and filed verification were not amended.
The original bounded economy comparison of checkout-configured and host-owned
Git transport remains in the starter-refresh case and D047/D050; this repair
makes no new performance or token-savings claim.

Authored outputs were read at their current bytes. Generated and oversized
outputs were checked through their generation and source-identity checks.
Synthetic repositories and raw control logs remain in approved temporary
scratch outside the worktree.

Executor attestation: harness `codex-cli`, version `0.163.0`, model
`gpt-6-astra`, effort `max`, source `codex-session-readback`. The canonical
briefing supplied that readback. The repair launched no additional agent.

Usage was read with `node scripts/harness.mjs usage` for this dispatch.
The handoff readback has source `codex-transcript-counter`, scope `dispatch`, and cutoff 2026-10-20T15:12:25.520Z.
The counters include cached input and do not measure live context occupancy.
Numeric counters stay in the ignored receipt and final response; dollar cost
is unavailable. Work after that cutoff is outside the reported sample.
Complete-review and document-gate waiting remain part of the work.
