# WO-239 independent execution reviews

Every review is read-only, and the executor is the only writer. No reviewer ran a gate, probe or descendant. Before main was integrated, three distinct `codex-spawn-agent` workers using `gpt-6.1-sol` with effort `max` reviewed the implementation. All three finished before each complete run, and all three restarted after each failed run's new code batch, under WO-239-D007. After the integration, three fresh Claude `dotln-worker` agents reviewed the integrated tree; see the final section. The successful-run handoff follows WO-239-D002. Execution aggregate: found 48; fixed 42; recorded 6; open 0.

## Design improver

Found 1; fixed 1; recorded 0; open 0. Initial review recommended source-only prerequisites before child runtime preparation, one exclusive timer, scoped temporary-root discovery and a digest-bound sidecar. Final review found that a direct sidecar write could poison its permanent digest filename after interruption. The executor changed publication to an exclusive preparation sibling, atomic no-clobber link and digest verification, with an interruption/retry fixture. The same reviewer inspected the repair and closed its finding before the complete run. Its evidence is source inspection, not executed checks.

## Criteria adversary

Found 4; fixed 4; recorded 0; open 0. Findings: stale local main could skip a newer remote upstream; preserved paths still expanded in the full transcript; writer/session cleanup was untimed; and a stale temporary registration could admit a foreign replacement. Each was fixed and rechecked by the same reviewer. Controls cover the named mechanisms, including binding both registered and captured roots to their current token and physical owner. The final bounded census/binding control passed exit 0 with close/global reads 0/1,000. The reviewer found no remaining concrete counterexample or necessary regression gap. It transferred the release-case inventory pin to consistency without duplicating that finding in its counts.

## Consistency reviewer

Found 3; fixed 3; recorded 0; open 0. Findings: PLAYBOOK close guidance, the transferred release-case inventory pin, and missing --list-material in finish/settle usage. The reviewer confirmed all three corrections, application and component versions, dependency/lock pins, authority edition, oracle consumers and all three historical chains, both installed roots, cold-start totals, product/kit/operational guidance, decisions/indexes, helper export/copy coverage and machinery dependencies. Pending gate verdicts and final report completion remain executor-owned.

Initial aggregate: found 8; fixed 8; recorded 0; open 0.

## Recheck after the first complete-run failure

All three existing workers restarted after the declaration-scanner repair and the explicit reviewer-restart instructions. Each reread the current order, current diff and relevant untracked files under its original brief; the old judgments were not substituted for review of the changed code.

- Criteria: new found 0; fixed 0; recorded 0; open 0. Rechecked shell comments, heredocs and trailing-path coverage with unchanged JS/TS tokenization, emitted restart assertions and the current acceptance surfaces. Aggregate remains 4/4/0.
- Design: new found 0; fixed 0; recorded 0; open 0. Rechecked scanner separation and caller boundary, current runtime/timing/prune/removal/integration flow and D007/D008. The prior atomic sidecar fix remains intact. Aggregate remains 1/1/0.
- Consistency: new found 0; fixed 0; recorded 0; open 0. Confirmed source declarations and export/copy coverage, both emitted roots and oracle hashes, unchanged historical chains, current 33,099-byte executor and 20,093-byte release-close totals, selected authority revision 002 with revision 001 retained, package/lock pins, decision index and publication metadata. Aggregate remains 3/3/0.

All three explicitly finished before the next complete gate. No new source fix resulted from this round. Complete validation and final handoff judgments remain executor-owned.

## Recheck after the second complete-run failure

All three reviewers restarted only after the release repair, reviewer timing rule, consistency brief, regeneration and write-backs were complete. All three then explicitly finished. Criteria and design each found zero new issues; consistency found two: C4, the PLAYBOOK paragraph still described surface checks after runtime preparation; C5, process-debt and worktree tests still expected preserved paths from compact default output. Aggregate at that review: found 10; fixed 8; recorded 0; open 2.

The consistency reviewer read the complete [retained failure audit](gate-failure-audit.md), including all 88 catalog rows, and reported these producer/consumer dispositions:

| Producer and consumers | Review disposition |
| --- | --- |
| Contributor source, both emitted roots, current/historical oracles, process-debt, gate-followups and executor-supports assertions | Current timing and brief instructions agree; current selectors and historical digests remain intact. Executor 33,817 bytes; release-close 20,093. |
| Retained-material advisory and release surface/dirty/settings/stale-helper/success/compact fixtures | Default summaries and explicit paths are distinguished; count/digest and exact surface reports remain checked. |
| Intake/preservation renderer and process-debt/worktree fixtures | C5 required explicit listing for detailed assertions. |
| Removal records and completion/leftover/retry readers | Digest-bound inventories, legacy compatibility, corruption refusals and preservation checks agree. |
| Source-only release prerequisites and surface/auth/tag tests | Refusal-before-build contracts and writer/tag preservation remain covered. |
| History-read boundary and overlapping-close fixture | Unique history assignment is the pause point; attempt ordering remains exact. |
| Release step records, latest-eight reader and timing tests | Seven names, latest-eight sampling and numeric duration fields remain deliberate contracts. |
| New helpers, transitive imports, fixture/export copies and machinery declarations | Built-in dependencies, recursive copy/export coverage and required declaration selectors are present. |
| Product/operational docs, versions, locks, authority and publication records | Versions and authority 003 agree; 001/002 remain retained. C4 was the remaining operational ordering mismatch. |

The reviewer resolved the audit provenance observation after inspecting the supplied five intermediate aggregate references: 220 direct references plus five aggregates explain 225. It did not reopen all historical raw logs or execute platform-specific paths or tests. Those boundaries are explicit; historical mixed/unproven labels remain unchanged. No reviewer edited files or ran a probe, gate, transition or descendant.

## Recheck after the C4 and C5 repair

The executor corrected both findings, also updating three intake-detail previews exposed by the worktree reproduction. The before-control failed both test commands; the changed renderer test and entire worktree script passed at 2026-10-29T16:37:49.319Z. The audit now includes its intermediate aggregate inventory and reconstruction method. [WO-239-D012](decisions.md#wo-239-d012--preserve-compact-defaults-and-repair-their-consumers) records the evidence and limits. All three existing reviewers restarted only after the repairs and write-backs were complete and explicitly finished before the complete run:

- Criteria: new found 0; fixed 0; recorded 0; open 0. Rechecked compact-default coverage, explicit path listing, privacy, unchanged snapshots and byte-preservation assertions. Aggregate 4/4/0, open 0.
- Design: new found 0; fixed 0; recorded 0; open 0. Confirmed the unchanged product implementation and the use of the existing listing API, with distinct compact/privacy checks. Aggregate 1/1/0, open 0.
- Consistency: new found 0; C4 and C5 closed as fixed. Rechecked PLAYBOOK ordering, the renderer and all located CLI path-detail consumers, the disjoint 220+5 audit inventories, both emitted roots/oracle consumers, historical chains, helper declarations/copies/exports, version pins and authority 003 with 001/002 retained. Aggregate 5/5/0, open 0.

Aggregate for that completed cycle: found 10; fixed 10; recorded 0; open 0. No new source change followed it before the complete gate. That gate subsequently exposed the stale emitted-role assertion described below.

## Recheck after the emitted-role regression repair

The complete run reported a stale expected release-close sentence in `packages/skeleton/test/executor-supports.test.ts`. [WO-239-D015](decisions.md#wo-239-d015--check-release-close-obligations-across-support-settings) records its failing before-control and the passing full-file repair check: eight tests, zero failures and zero skips. The test now checks the single `--publish` invocation, exact-command restrictions and conditional preview separately across support settings. Product implementation, role instructions and oracle bytes are unchanged by this repair. Sync regenerated harness snapshots for the updated package metadata and selected authority revision 004, retaining 001 through 003.

The executor finished the repair and write-backs before restarting the same three workers. All three explicitly completed their new reviews before the next complete run:

- Criteria: new found 0; fixed 0; recorded 0; open 0. Rechecked the current order, full diff, relevant untracked files, controls, D013–D015, handoff and authority 004. The three assertion obligations remain covered across both support settings and every profile. Runtime preparation, timing, scoped census, preservation, integration and handoff boundaries revealed no new acceptance defect. Aggregate 4/4/0, open 0.
- Design: new found 0; fixed 0; recorded 0; open 0. The three separate assertions add no unnecessary fixture structure or runtime coupling. Release, prune, removal, integration and role-source diffs remain unchanged from the prior review, including the atomic sidecar fix. Aggregate 1/1/0, open 0.
- Consistency: new found 1; fixed 1; recorded 0; open 0. C6 is the missed release-close sentence consumer, now fixed. The repaired compiled test is byte-identical in the new snapshot. All 15 changed hooks differ only by snapshot identifier; all 33 whole-file installed hashes and 41 runtime pins per profile agree. Oracle selectors, current role hashes, historical chains, root-byte totals, versions, lock pins, authority 004 and retained 001–003, dependency copies/exports and the 61-case release inventory agree. D013–D015 and their projections agree. C4/C5 remain closed. Aggregate 6/6/0, open 0.

Aggregate for that completed cycle: found 11; fixed 11; recorded 0; open 0. Those read-only judgments reported no additional untraced dependency. No reviewer executed a test or probe. Boundaries remained the unchanged historical raw logs, external publication checks and platform-specific execution. The subsequent complete gate exposed the fixture-state dependency described below.

## Recheck after the integration-fixture repair

The completed-receipt stash-failure test invoked its second integration without new upstream work. The new no-op guard returned success before the fixture's intended stash failure. [WO-239-D016](decisions.md#wo-239-d016--preserve-the-stash-failure-fixtures-incoming-work-precondition) records the failure and repair: explicitly check that the no-op preserves the receipt, then advance the fixture-local upstream before forcing stash failure and retaining the original receipt byte assertion. The focused case passes, and the entire integration file passes all 46 tests with zero skips.

Implementation, repair and write-backs were complete before restarting the same three reviewers. All three explicitly finished their new reviews before the next complete run:

- Criteria: new found 0; fixed 0; recorded 0; open 0. The original recovery test purpose remains intact: no-op preserves the receipt, while advancing the local fixture upstream reaches stash refusal and retains the original restoration assertions. No new criterion defect or necessary regression gap. Aggregate 4/4/0, open 0.
- Design: new found 0; fixed 0; recorded 0; open 0. Ordinary fixture commits make the two states explicit without custom interception or another abstraction. Product-source diffs, including the atomic sidecar fix, are unchanged from the prior review. Aggregate 1/1/0, open 0.
- Consistency: new found 1; fixed 1; recorded 0; open 0. C7 is the missed fixture-state dependency. First-attempt stash fixtures still have incoming work; continuations bypass the no-op guard. The searched repeated-integration calls show no further mismatch. Existing suite-entry tracking, recursive overlays and script exports cover the repair without a new input, dependency or timing pin. D016, its index, handoff and queue disposition agree. Authority 004, retained 001–003, snapshots, versions/locks, role hashes, oracle selectors, historical chains and root-byte totals remain unchanged. Aggregate 7/7/0, open 0.

Aggregate through the D016 cycle: found 12; fixed 12; recorded 0; open 0. All judgments are read-only; no reviewer ran a test or probe. The unchanged historical raw-log audit, external publication checks and platform-specific execution remain outside these rechecks. The complete gate and final result write-backs remain executor-owned.

## Recheck after the command-route telemetry repair

The next complete run exposed a one-byte difference in measured `bytesWritten` between two otherwise identical document-gate route results. [WO-239-D017](decisions.md#wo-239-d017--compare-command-routes-without-pinning-measured-churn) records the retained failure, deterministic failing before-control, passing comparator and real-route checks, and the full 30-test target-start pass. Only numeric churn samples are normalized; status, diagnostics, cleanup blockers and telemetry shape/source remain compared. The new case is appended to the existing inventory, with 70 declarations and 101 distinct names; its scheduling regression passes. Implementation, repair and write-backs were complete before restarting all three existing reviewers. Each explicitly finished before the next complete run:


- Criteria: new found 0; fixed 0; recorded 0; open 0. The comparator retains status, diagnostics, cleanup blockers, source and telemetry-shape distinctions; the real command-route comparison remains intact. No new acceptance defect or necessary regression gap. Aggregate 4/4/0, open 0.
- Design: new found 0; fixed 0; recorded 0; open 0. One small test-local comparator serves the deterministic control and real route assertion; no new production dependency or fixture abstraction. Runtime, timing, scope, removal and integration implementations remain unchanged. Aggregate 1/1/0, open 0.
- Consistency: new found 1; fixed 1; recorded 0; open 0. C8 is the measured-telemetry value pinned by the route comparator. The reviewer independently compared both 86-line retained result blocks and confirmed only the one-byte measurement difference. It traced `temporaryChurn()` through runner output to both comparison consumers, the appended inventory and deliberate 70/101 pins, suite declarations, recursive copies/exports and D017 write-backs. Every old inventory entry remains byte-exact and in order. Searches of telemetry keys, normalization tokens and gate-route calls in script/package tests found no additional matching consumer. Authority 004 and retained 001–003, snapshot, role/oracle hashes, historical chains, versions/locks, publication lock and cold-start totals remain consistent. Aggregate 8/8/0, open 0.

Final aggregate: found 13; fixed 13; recorded 0; open 0. All judgments are read-only, with no tests, probes, gates, edits, transitions or descendants. Broader comparator forms, historical raw logs, external publication and platform-specific execution remain outside this recheck. Complete validation and final result write-backs remain executor-owned.

## Validation observation after the D017 reviews

[WO-239-D018](decisions.md#wo-239-d018--retain-strict-refusal-checks-after-a-native-child-abort) records a native Node abort in the next complete run and the unchanged 11-test license-fixture pass under the bounded wrapper. No source, test, runtime, dependency or version changed. The completed D017 reviews still cover code identity `9dbe7da19dc0f172756b570ad821fe49afaf3deefead65b61745e451889973c6`; they were not restarted without a new code batch. Counts remain 13 found, 13 fixed, 0 recorded and 0 open. A fresh complete pass is still required.

## Integrated reviews after taking in main

At the operator's direction, main moved to 297bf4f1, which carries WO-235's v0.103.0 release ([WO-239-D019](decisions.md#wo-239-d019--integrate-mains-document-contract-release-retime-the-patch-and-chain-one-integration-oracle)). The earlier Codex workers could not be reached from this Claude Code session. Three fresh read-only Claude `dotln-worker` agents therefore judged the integrated diff, and their rechecks were sent as messages. Every review and recheck finished before the passing complete run, and none restarted after it.

- **Criteria adversary:** found 8; fixed 6; recorded 2; open 0.
  - Fixed:
    - the role-oracle walk silently dropped two byte-exact checks
    - integration threw while a planning pass had the primary checkout off main
    - no test pinned the one-invocation handoff wording
    - the lane-holder filter compared unresolved paths
    - no case bound a root through a symlinked checkout
    - WO-239-D023 named the wrong next refusal
  - Recorded:
    - close timing samples include previews and refusals (WO-239-D020)
    - the false operator-review assumption, now stated under criterion 3 of the handoff (WO-239-D021)
- **Design improver:** found 15; fixed 13; recorded 2; open 0.
  - Fixed:
    - the oracle walk
    - one owned-root binding rule
    - the lane-holder checkout relation
    - one removal-summary builder
    - named step wrappers
    - one close-record writer
    - the unreachable closed-phase refusal
    - one prune-scope reader
    - one median
    - the writer-release timing comment
    - main read only in the active phase
    - the temp-root success line after every case
    - an executable role-oracle declaration check
  - Recorded:
    - the review-then-integrate step order (WO-239-D020)
    - the two printers' wordings of the one-invocation rule (WO-239-D021)
- **Consistency reviewer:** found 12; fixed 10; recorded 2; open 0.
  - Fixed:
    - the false session-end global-walk claim
    - the handoff's pre-integration facts, replaced in the handoff
    - the handoff wording pin, together with the criteria finding
    - product 07's integration order
    - the paths diagnostic's admission
    - the PLAYBOOK runtime wording
    - a missing decision anchor
    - plan start's read-only global census
    - fifteen undeclared role oracles
    - a dangling PLAYBOOK reference
  - Recorded:
    - a per-role growth pin (WO-239-D020)
    - the runner input the declaration test reads (WO-239-D022)

Three findings were raised by two reviewers each and are counted once per reviewer: the oracle walk, the handoff wording pin and the lane-holder paths. The first integrated complete run failed on a kit recovery case written for the base close order ([WO-239-D023](decisions.md#wo-239-d023--assert-the-closes-prerequisite-first-order-in-the-kit-recovery-case)). All three reviewers rechecked that repair before the passing run. The criteria and consistency reviewers also confirmed the two document corrections that followed it.

Integrated aggregate: found 35; fixed 29; recorded 6; open 0. With the earlier Codex reviews (found 13; fixed 13; recorded 0), the execution aggregate is found 48; fixed 42; recorded 6; open 0.
