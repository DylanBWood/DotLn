# WO-223 implementation evidence

## Base observations, before implementation

At base `6df0ec37cc21143871217bade638e5ec28bc5959`, the serial command
`node scripts/harness.mjs bounded -- node <session-scratch>/wo223-base.mjs`
completed with exit 0 on 2026-10-20 at 22:25:23 UTC (15.826 seconds).
The probe uses the existing synthetic target-worktree fixture, moves a
structured decisions record with the real lifecycle, and checks these five
observations before any implementation edit. Caught refusals below have
failure outcome 1; the probe itself succeeds by asserting those refusals.
No external repository or forge is contacted.

| Observation | Base outcome | Evidence |
| --- | --- | --- |
| Document gate on a moved decision | Refused (1) | `checkDocs` throws `records/evidence/WO-999/decisions.md: document is not a readable regular file (ENOENT)` after `target-records` moves the file. |
| Reader when the primary checkout leaves main | Refused (1) | After switching the fixture primary checkout to `planning/fixture`, `readTargetRecord` throws `no main-branch control-plane worktree found` from the secondary checkout. |
| Sign-off declaration | Assertion passed (0) | The fixture's unsigned commit fails `contributionSignoffRules`; its line omits `contributions.operatorAuthor`. The checked `worktree start` source contains no advisory naming that key. |
| Admission and kit guidance | Source restatement passed (0) | The hook's unmatched helper branch returns only `byte-exact helper spelling missing`; the kit README calls its session form `npm run worktree -- publish`. The existing hook fixture already asserts the four admitted helper forms. |
| Subject length | Refused (1) | `lintArtifacts` on the fixture's 90-character conventional subject returns `target publish refused: outward lint: commit refused: subject.length (line 1)`, omitting length and limit. |

The baseline probe and its scratch repositories are temporary. The persistent
regressions and isolated repair controls below make the relevant behaviors
repeatable without retaining local paths or another source repository.

## Isolated repair controls

The final control run completed on 2026-10-20 at 22:42:23 UTC. The bounded
wrapper exited 0 in 51.169 seconds. `repair-controls.json` records each
command, its test-file hash, the implementation paths reverted only in an
isolated snapshot, both exit codes, log hashes and the expected failure
observed in the negative arm. Both controls are demonstrated:

| Control | Repaired arm | Reverted arm |
| --- | --- | --- |
| Moved document | Exit 0; immutable text reaches the document checks and the operator-word check sees the moved decision. | Exit 1; the former local decisions path is not a readable regular file (ENOENT). |
| Primary mapping | Exit 0; the secondary checkout reads and regenerates/checks meta while the primary holds a planning branch. | Exit 1; no main-branch control-plane worktree is found. |

The mapping case also checks running/primary/main precedence, the main
fallback, and the refusal naming all three locations when no map exists.
These controls are isolated fixture probes, not complete review-gate rows.

## Generated evidence and release staging

The compatible skeleton advisory change stages package 0.63.1; the order's
minor application classification stages v0.88.0. No dependency was added.
`npm run sync` regenerated the installed harness, authority revision 002,
meta/index surfaces and console fixtures after the worker-review repair.
Authority revision 001 is retained as immutable earlier evidence. The
feedback carry command checked revision 001 for this order against the
retained live audit. The harness evidence checker retains its historical
live smokes and judges the current generated surface; no new live episode
was claimed. WO-223-D012 records that distinction.

## Complete review result

`npm test -- --review` passed on 2026-10-20 at 23:38:50 UTC: 39 suites,
104 fresh tasks, zero reused tasks, zero failures and no unrun suite.
The run took 1,942.858 seconds and kept both the code and build-output
identities unchanged. `gate-runs.json` records its code identity and
evidence reference, alongside the two earlier failed complete runs.

Those earlier runs exposed two fixture maintenance errors: expecting a
repeated advisory in `systemMessage` after the hook had suppressed its
duplicate display, and leaving the target-worktree inventory at 52
declarations/76 expanded names after adding two cases. WO-223-D015 and
D016 record the checked causes and corrections. Both focused repair cases
passed, followed by the fresh complete run. No failed or skipped task was
counted toward its passing result.

The complete run includes the exported-instance moved-record document gate
and asserts that `docs-check`, `entropy`, `reader-profiles`, `plan` and
`plan-refutation-current` all pass. It also includes the author-advisory,
unchanged helper-admission, subject-length and reader-precedence cases.
The final handoff document row is required at the current tree before the
implementation-ready transition; that event records the consumed row.
