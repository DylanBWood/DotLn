# WO-242 executor handoff

The optional plan-first workflow is implemented and staged for v0.120.0. It keeps the existing workflow when disabled, drafts an isolated candidate when enabled, binds approval to the complete proposal and current documents, and applies only that accepted candidate. This handoff records the executor's evidence; independent verification and final review remain separate phases.

**Actor attestation:** harness `codex-cli`; harness-version `0.167.0`; model `gpt-6-astra`; effort `max`; source `codex-session-readback`. Review workers used the operator-selected `dotln-worker-astra` type, configured for Astra/max; a configured pin is not an independent effective-session readback.

## Criterion judgments

**Criterion 1:** met — [controls.json](controls.json) records eleven equal base/current controls: status, current projection, emitted executor, and eight absent/false hook comparisons including a malformed later destination. The disabled-mode lifecycle/role regression and the unchanged WO-144 refusal tests pass. D019-D020 record the default-mode regressions found and corrected before the final run.

**Criterion 2:** met — `scripts/test-plan-first.mjs` exercises the complete candidate and binary diff, proposal document and marker validation, capture requirements and hash, approval freshness, changed inputs, and lifecycle projection. Its marker regression distinguishes Git's LF delimiters from payload text. The complete gate judges these fixtures; [live-conversation.json](live-conversation.json) separately records actual proposal/approval/application events.

**Criterion 3:** met — `scripts/test-plan-first-boundaries.mjs` exercises the installed target hook, paired evidence and capture admission, persistent candidate lifetime, and diagnostic-read recovery. The launchpad hook and lifecycle tests cover pre-proposal/awaiting refusal and current-approval admission. The live record's `hostBoundary` names the actual Codex helper/role boundary and separately tested Claude hooks. D007 and [scripted-mechanism.json](scripted-mechanism.json) retain twenty sequential in-process judgment samples per arm; these do not measure a whole hook subprocess.

**Criterion 4:** unmet — contradiction, as recorded in [D002](decisions.md#wo-242-d002): this criterion includes the target closeout sentence that the same order explicitly defers to WO-243. The executor has not waived, amended, or recorded a typed defect. The remaining obligations are evidenced: emitted plan-first procedure and harness checks pass; [cold-start.json](cold-start.json) records 44,358 bytes off and 47,593 on in both roots, within the standing-route accepted ceiling of 51,226. D009/D014 preserve the measured acceptance rather than trimming reviewed duties.

**Criterion 5:** met — the target-document/transformation/public-conversation regression exercises refuse and review terms, outward identifiers, announced transformation, preserved operator bytes and a public-conversation refusal. The actual screen helpers and publication checks pass; generated guidance states the private/public boundary and the capture procedure.

**Criterion 6:** met — the target fixture resolves all three documents below its declared `documentationRoot`, checks that `target-records` does not move them, and exercises the self-order evidence path. Configuration-root checks pass with the shared path resolvers introduced in D018.

**Criterion 7:** met — the router fixture proves that `PlanProposed` stops a driven executor and `PlanApproved` permits the next executor. Codex continuation fixtures distinguish this intentional wait from an unfinished-task continuation. The complete run passed both harness-fixtures and codex-continuation.

**Criterion 8:** unmet — later-phase: the executor's live exercise is complete, while the criterion also requires the next phase's independent novice-workflow usability judgment. [D013](decisions.md#wo-242-d013) and [live-conversation.json](live-conversation.json) preserve four actual model turns with scripted operator question, correction and approval, complete per-turn documents and replies, exact diff inspection, unchanged target before approval and exact accepted application afterward. No human novice participated, and reduced reading burden is unmeasured. The verifier should judge the recorded workflow and its limits; this executor does not substitute its own usability verdict.

**Criterion 9:** met — [the kit guide](../../KIT.md#plan-first-mode), the disabled configuration example with its purpose note, product 07/12 write-backs and the feature registry name the implemented behavior and consumer. Publication checks pass. D022 records the stale export-test expectation and its requirement-derived semantic replacement.

**Criterion 10:** met — `npm test -- --review` passed all 120 fresh tasks at the corrected source identity after D025, and `npm run test:docs` passed all 27 checks at that same code identity. Formatting, synchronization, and `git diff --check` pass. No third-party dependency was added; internal compiler/skeleton pins and their lockfile entries follow the prepared release.

## Review record

self-review: found 13; fixed 12; recorded 1; rounds 3; unreviewed 1103 lines (parent-judged final-round and document-gate corrections: 152 source/test and 951 record/generated lines, excluding this handoff)

| Review | New findings and disposition | Retained reports under `docs/control/local/reviews/WO-242/` |
| --- | --- | --- |
| Round 1 | Nine required findings, all fixed | `round-1-criteria.md`, `round-1-design.md`, `round-1-consistency.md` |
| Round 2 | Two new required findings fixed; one design note recorded | `round-2-criteria.md`, `round-2-design.md`, `round-2-consistency.md` |
| Round 3 | No new distinct finding; remaining patch-delimiter counterexample from round 2 fixed by the parent | `round-3-combined.md` |
| Repair 1, round 3 | No new findings | `repair-1/round-3-combined.md` |
| Repair 2, round 3 | One new required diagnostic-read finding, fixed by the parent | `repair-2/round-3-combined.md` |
| Repair 3, round 3 | No required or advisory findings | `repair-3/round-3-combined.md` |
| Repair 4, round 3 | No required or advisory findings; independent exact export regression passed | `repair-4/round-3-combined.md` |

The original ladder reviewed the whole change through round two, then the intervening code delta in its last round. Each failed-run repair was under fifty changed source lines when submitted and therefore began at combined round three. The final-round parent corrections are the 78-line original delta (55 source/test) and the 997-line second-repair delta (96 source/test); their tree pairs and the corrections are retained in D017/D020 and session receipts. They were judged locally and passed through later complete runs. The subsequent D025 document-gate repair adds 28 unreviewed lines outside this handoff (1 test line and 27 decision/index lines); it is parent-judged under the no-reviewer-after-pass rule and passed fresh document and complete gates. Counts above follow the workers' actual report prose; the helper's zero-count header on a prose report is not the finding census. No reviewer runs after a passing complete gate.

The recorded design note is [FUP-a0dee25c3caec351](../../planning/followups.json): failure during candidate setup after pinning but before saving its local reference can leave a retained partial root that ordinary candidate release does not enumerate. D015 records it under the round-two rule; it was not silently fixed in a later review round. Twenty-one worker uses, including messages and the failed launch attempt, were charged conservatively; D024 records the operator's one-use extension for the fourth repair review.

## Validation and remaining limits

Final `npm test -- --review`: passed all 120 fresh tasks, 46 suite aggregates, no unrun task, in 0 h 54 min. Recorded 2026-11-07T02:57:07.633Z; executed tree `51fd5cea69483bc48e152f713855163ddd03c9ba`, code identity `44440e885ce4d30a41c1238cdb986e6c74c8789091ff0084bf91e06aecced8d4`. Code and build output stayed unchanged. Evidence reference: `host-gate:44440e885ce4d30a41c1238cdb986e6c74c8789091ff0084bf91e06aecced8d4:npm test`. The row reports 2,456 temporary roots removed, 20 retained by their owning protocols or retention policy, and no cleanup blocker.

The first `npm run test:docs` failed the exported guide's stale section inventory after an earlier complete product pass; entropy was not run. D025 records the one-line expectation correction from the order's required heading and position. The replacement document gate passed all 27 fresh checks in 0 h 2 min, recorded 2026-11-07T02:02:06.145Z. Its evidence reference is `host-gate:44440e885ce4d30a41c1238cdb986e6c74c8789091ff0084bf91e06aecced8d4:npm run test:docs`, candidate tree `db86d6a097817feb186881389f20c5953e4c1e0d`, and document tree `a876800ef12d253eafa647035f4517698533ecc9` with this order's own evidence excluded. The final complete product row and this standing document row share the corrected code identity; subsequent edits are confined to this order's handoff.

Earlier complete attempts remain failed: configuration-root literals (D018); default-mode refusal ordering (D019-D020); the shared real-regeneration fixture's child timeout (D021); and the export example's stale boolean expectation (D022). The third and fourth runs took 0 h 39 min and 0 h 52 min. Full run four passed 119 of 120 tasks, including the isolated regeneration fixture. Passing focused checks do not replace a complete run. Queue item `adjacent-0001` is completed at queue revision 5, with full run five's successful complete row as its required check evidence.

The selected evidence editions are authority 005, artifact-identity 001, verification 001, and feedback 002. The failed first feedback attempt is retained. Existing activation and sibling observations were preserved, and D001 was restored byte-for-byte after its mistaken replacement (D012).

The live exercise required 10,472, 14,384, 18,294 and 19,906 UTF-8 bytes of documents plus reply across its four turns, counting repeated material again. It recorded 0 h 4 min of model/tool work and less than 0 h 1 min of automated waiting; raw counters remain in the machine-readable record. One driver clarification resolved the approval capture's changed conversation digest by verifying unchanged substantive proposal bytes before refreshing metadata and recording approval. This is a usability limit for the verifier, not a reduced-burden claim. Worker-specific usage was unavailable; the parent dispatch counters are separate and are not the live conversation's cost.

The outcome matches the authorized goal of optional approval before implementation. NoOp would have left an elected feature without a consumer; the chosen workflow keeps the default path and adds the candidate, document and approval checks only when elected. The tradeoff is more recorded reading and revision work, with a host boundary that remains explicit: Codex direct tool writes are a role duty under host permissions, while the lifecycle/apply helpers enforce their checks in process. The generated Claude hook boundary was tested, not claimed as a live Claude session.

Release preparation assigns application v0.120.0, skeleton 0.87.0 and compiler 0.42.1; the console version remains unchanged with updated internal pins. No branch commit, push, pull request, merge or publication was performed. The synthetic live candidate was released and removed through the owned-root helpers; retained failing evidence remains available.

Usage source is `codex-transcript-counter`, scope `dispatch`; cutoff before executor completion `2026-11-07T02:57:10.499Z`. Final counters stay in ignored session receipts and the response. Cost is unknown. The completion command records the current actor attestation and releases this session's writer.
