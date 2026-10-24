# WO-220 implementation handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.164.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

The twenty selected register rows have post-activation terminal dispositions: **14 settled, 6 declined, 0 deferred**. The complete review passed all 40 suites after the historical-schema correction. The canonical readiness transition consumes this handoff and the final document gate run after its last edit.

**Criterion 1:** met — [register-after.json](register-after.json) records all twenty exact `followups --show` invocations and latest terminal dispositions at 2026-10-24T06:02:34–36Z, after activation at 05:19:10.126Z. There is no allocated, open, untriaged or deferred selected row and no operator packet. D004 and D020 reconcile the WO-083 and WO-183 carry-ins.

**Criterion 2:** met — Every settled disposition names its decision and sensitive fixture control. [repair-controls.json](repair-controls.json) records **26 pairs**, each with a positive exit 0 and a targeted reversion exit 1 in the named behavioral case, plus paths, commands, source hashes and both arms' case reports. [The README](README.md#executed-paired-controls) maps controls to the named suites. The complete review passed the kernel, skeleton, console, vertical, harness-probe, configuration-root and WO-107 lanes. All 27 direct WO-103/WO-105 lane cases passed after build; [supplemental-checks.json](supplemental-checks.json) records their command and output. New-command persistence, append and serialization admission are separate controls; historical replay stays accepted. The three-repair integration and legacy-parent controls exercise actual repair worktrees.

**Criterion 3:** met — D001, D002, D006, D009, D012 and D019 in [decisions.md](decisions.md) retain each declined row's current harm, source evidence, NoOp rationale and reopening condition. Six of twenty is 30%, below the one-third limit. These declines do not claim the harms were repaired.

**Criterion 4:** met — The final no-argument query in [touching.json](touching.json), observed at 2026-10-24T07:13:34.504710+00:00 after the retained-schema correction and classification binding, lists no selected row pending. Its 5 unrelated pending rows are named in [the README](README.md#other-pending-seam-matches) and remain unchanged. All returned pages are recorded.

**Criterion 5:** met — [The before and after tables](README.md) contain all twenty rows, dispositions, dates and their source/decision/control mappings. The dated pending count is **178 before and 178 after**; allocated rows were already excluded, so no twenty-row reduction is claimed.

**Criterion 6:** met — Product [architecture](../../product/03-architecture.md) and [interfaces](../../product/04-interfaces.md), component READMEs and corpus policy records describe the changed behavior. `npm run meta -- --check` and `npm run publication:check` passed as recorded in [supplemental-checks.json](supplemental-checks.json); the final synchronization regenerated the decisions index after D031. The final explicit metadata check passed at 2026-10-24T07:44:28.070Z; the document gate also checks current metadata.

**Criterion 7:** met — `npm test -- --review` passed **40 suites, 106 fresh tasks, zero failures** at 2026-10-24T07:43:01.719Z, with unchanged code and build output and no reused or unrun tasks. [gate-evidence.json](gate-evidence.json) records code identity `881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6` and its evidence reference. `npm run test:docs` passed all 27 suites at that code identity at 07:16:31.929Z; the readiness transition must consume a new passing document row after this final handoff edit. `git diff --check` is clean. An exact base/current comparison of external package-lock dependency records found no change. All required deterministic editions and the new live feedback episode are recorded below.

## Delivered behavior and evidence

The fixes cover truthful partial audit refusals; resident intent expiry, status and NoOp identity; an explicit portfolio-only budget label; T1 minimum string lengths; typed source-host recovery refusals; bounded review work, original-contract cache validation and retry clocks; browser abort/recovery; invalid cached judgment classification; structural admission of new commands; and the three corpus policies. [D003–D020](decisions.md) give the per-row boundaries and controls. Missing portfolio capabilities still produce diagnostics, and already-started repair children retain their recorded parent layout.

Authority is selected at **WO-220/002**; artifact-identity, verification and feedback are selected at **WO-220/001** in [the evidence registry](../current.json). Canonical synchronization refreshed the authority bundle comparison after regenerating the installed harness; the final readback corrected the draft’s stale authority-001 summary. [The source inventory](evidence-source-inventory.json) names every edited registered and judged source. The [new feedback edition](feedback-001/edition.json) records `carried: false`: a native Codex `gpt-6.1-sol` / `max` episode completed ten fixtures on the final judged implementation. Historical editions and observations remain intact. Later corrections changed declarations, documentation, test fixtures and the qualification probe; none changes registered or feedback-judged implementation. D030 binds the delegated classification, and D031 preserves the retained qualification schema.

The direct WO-103 regeneration exercised 2,993,760 authority cells and 509,440 outbox deliveries. WO-105 keeps historical crash-shape pins exact while separating named compiler identity drift; WO-107 archives the second collector revision and retains base-only execution claims. The checked policies do not claim current measurements for historical observations.

## Reviews and corrections

self-review: found 13; fixed 13; recorded 0 — two fresh Codex `gpt-6.1-sol` / `max` read-only workers (`codex-spawn-agent`), each given the order and diff. The criteria adversary reported six initial observations and one follow-up; the design improver reported five initial observations and one follow-up. These thirteen observations cover eight distinct findings. Both final source readbacks reported zero remaining findings; the reused design worker also reviewed D031 and reported zero new findings. [self-review.json](self-review.json) and D024 record the reports and fixes; the root ran all executable validation.

Four failed or stopped complete attempts exposed the declaration, API-map and two fixture integration corrections in D026–D029. The first document gate then exposed the classification-binding and historical-schema corrections in D030–D031; its rerun passed all 27 suites. Those failed or stopped attempts supply no passing row. A complete run passed before D031, and the fresh complete run after D031 passed all 40 suites at the current code identity. The five projection tests and all 61 publication fixture tests also passed directly after their corrections.

## Release, limits and retained work

Local release preparation selected **v0.95.0**: kernel 0.8.0, skeleton 0.68.0, browser-evidence 0.2.0 and console 0.4.8. Compiler and beacons retain their versions. [D021–D022](decisions.md) record compatibility and release choices; internal pins follow the changed components, with no external dependency added.

The six declined harms remain with their reopening conditions. WO-088 retains generated-block registration/content pinning, and WO-204 must preserve the typed recovery refusal. No new operator-only decision or deferred packet is required by this batch.

The isolated control checkout was removed after its probes at recorded HEAD `f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1`. Inspection found no nested repositories outside intake in this worktree; the two temporary fixture roots named by failed-run logs were also absent. Control and gate logs remain in authorized session scratch. Initial worktree changes, intake, the checkpoint and recovery references are preserved. Sources are this personal repository and synthetic fixtures; no employer material or credentials were introduced.

## Alignment and process accounting

The outcome matches the order: every selected row is terminal, every settlement has a sensitive regression, and each decline keeps its current harm and reopening condition. The accounting avoids treating existing allocations as a pending-count reduction or a partial patch as a complete settlement. The declined choices retain the stated NoOp behavior.

Usage was read with `harness usage` at **2026-10-24T07:44:10.035Z**: source `codex-transcript-counter`, scope `dispatch`. Final counters remain in the ignored receipt and final response; dollar cost and wrapped command count are unknown. The root explicitly spawned two review agents and ran one authorized native feedback episode; automatic admission coverage reports an unknown remainder and is not an assertion that no agents ran. No reviewer descendants were reported.

The final successful complete review took 1,491.907 seconds including work and waiting. Its recorded critical path includes 1,490.816 seconds of work and 0.278 seconds of waiting. The earlier complete run, failed/stopped attempts and paired controls are additional work; no equivalent-outcome cost baseline or dollar saving was measured.
