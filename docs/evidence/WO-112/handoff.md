# WO-112 executor handoff

Dispatch: `resume: fix` against [VER-006](../../verifications/WO-112/VER-006.md)
F1/F2. The scope expansions, integrated main and historical live proof remain.
See the [repair receipt](repair-006.md), [observations](repair-006-observations.json)
and D054–D058. This is the executor's criterion ledger; independent verification
owns the next verdict.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.160.1","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

**Criterion 1:** met — The historical repair representative (issue 3, Claude workers) and repair control (issue 4, Codex workers) are unchanged from checkpoint 25. The byte comparison preserves 181 earlier evidence and verification files outside decisions/handoff/meta. Representative: an open, unmerged generated PR; its behavior criterion verified with host-test evidence; the automated suggestion accepted by triage, repaired, re-verified and resolved; terminal `resolved`, nothing `NeedsHuman` (`repair-representative-run.json`). Control: the incorrect suggestion rejected with evidence, candidate unchanged, terminal `resolved` (`repair-control-run.json`). No visual criterion was filed. Each historical run was one uninterrupted public-CLI invocation with no supplied classification, assessment or verdict. This repair made no new remote proof run.
**Criterion 2:** met — Both outward receipts are unchanged from checkpoint 25. The configured outward lint passes branch, title, body and every commit of the historical PRs, and the tree grep finds no declared term or prefix. Coverage is the declared set only.
**Criterion 3:** met — README Measures and Parity checklist are unchanged from checkpoint 25. They record the measures with methods and score all eight parity items observed-met for the two repair scenarios. Earlier runs retain their D013 scores and cutoffs.
**Criterion 4:** met — Every measure and parity score in the unchanged README carries `observed`, `launch-claim` or `unknown`.
**Criterion 5:** met — Products 06 and 12, the README release block and capability-table section are unchanged from checkpoint 25. Their recorded writebacks stand: 06 adds 201 of 300 bytes and 12 adds 163 of 200. Product 03 now explicitly states accepted older-receipt replay within its existing 176,807-byte ceiling. Both publication source locks are refreshed; publication check passed in the 009 regeneration, completed 2026-10-07T02:48:14.230Z. D054–D055 are recorded, meta/index preparation ran, and the follow-up register is synced.
**Criterion 6:** met — The document preflight passed 29/29 in 102.781 s, recorded 2026-10-07T03:35:58.331Z. The qualifying full review passed 38 suites and 88 fresh tasks in 1852.591 s, forced-fresh, recorded 2026-10-07T04:07:50.593Z, at code identity `b47f2d3090c98aebafedbd5ccf7a490e233877d7fabdf4c4961e4c7fba3fa926`, with identity and build output unchanged. All 5,582 protected physical inputs have matching before/after boundary hashes; root made no repository writes during the replacement run. The comparison limits are filed in the observations. The earlier 1860.580-second passing run remains execution history and does not qualify: D057–D058 record the live record writes, the repeated colossal, inexcusable execution failure and its extra 31-minute cost. No source bytes changed. The repaired immutable probes, focused 4/4 and 15/15 controls, and all 18 evidence regeneration/check steps pass. D056 records the first document run's unlocalized console fetch failure and the three passing named-case contrasts as FUP-e86366edbc1d5289; no console repair is claimed. FUP-117dc832458dc6e2 records the missing mechanical guard; it remains unimplemented. Manifests and the lockfile are unchanged; no dependency was added. Final records are prepared after the gate, before the completion command's inline document check.

self-review: found 1; fixed 1; recorded 0

One fresh read-only Codex adversary (`gpt-6.1-sol`, `max`, fork without inherited
turns, no descendants) read only the order and whole/latest diffs. It found no
new blocker and one optional improvement: publish the competing judgment from
an independent inode. I adopted it, reran all four focused cases, and reused
the worker for the delta. It confirmed the suggestion addressed with no
remaining concrete blocker. Effective child model/effort and child usage are
unknown. Explicit use is one of the cap of 20.

F1 now keeps a durable verdict or primary error through partial cleanup.
F2 replays only a decoded, request-bound saved receipt whose exact commit and
diff match Git; unreceipted attempts retain termination, baseline and failed
integrity controls. The tests use synthetic permission timing and admitted
older log shapes; no older binary or new live PR ran. D002 remains the sole
declined economy experiment. VER-006's blocking follow-up remains allocated
to WO-112 for an independent report's judgment. D053 and all earlier boarded
limits remain filed. The unpublished target remains v0.68.0, skeleton 0.54.0,
with no dependency added. Current-source evidence revision is 009; 001–008
retain their bytes.
