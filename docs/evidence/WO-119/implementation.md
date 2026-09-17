# WO-119 implementation evidence

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

Dispatch: `resume: next`, 2026-09-16. Subject: uncommitted WO-119 worktree.
The root is the sole writer; delegated reviews were read-only. Independent
work-order verification and final review remain separate dispatches.

The producer reads a bounded canonical target and its explicit conventions or
conservative defaults, steps the executable kernel Program, and emits typed
WorkCandidate observations. It executes only declared observation checks, never
repairs, deletion, model ranking or work-order derivation. The resident's
existing ScriptEpisodeObserved event persists the candidate report. Replay
validates its entire canonical-output digest without filesystem or clock reads.

| Required claim | Executed evidence / surface |
| --- | --- |
| Six pinned candidates and evidence references | `discovery.test.ts`: real failing lint/test, two declared misplacements, one unreferenced generated file, one recurring structured repair; deterministic repeated report and resolved evidence references |
| Executable program without operator await | Production `discover` drives `stepProgram`; fixture traverses every branch/continuation and permits only executable kinds |
| Resident script episode with fake clock and durable candidates | Real script adapter over a scratch Git repository, recorded clock, verified typed report, return cancels further dispatch, replay and tampered-evidence refusal |
| Live scratch row with shapes only | Diagnostic row in [discovery-resident-final.tap](discovery-resident-final.tap): native script, fake clock, six relative candidate shapes, event type and verification result; no model or live target repository is claimed |
| Fail-conservative boundaries | Native outside-file read/write and loopback denial, SIGTERM-ignoring timeout, path/symlink/size/history/launch/home refusals, fixed facts and referenced generated files cease producing their candidates |
| Existing behavior | All existing resident tests and reactor/scenario identity tests run alongside discovery |
| Write-backs | Product 05 §5S / 6S, decisions/index, skeleton runbook; the legacy ledger duty is substituted by decisions per the current executor skill |
| Operator ideation | [ideation-authority.md](ideation-authority.md), dated ledger entries and products 03/05 preserve faithful enforcement, adversarial tests, uninterrupted preauthorized basic calls and selective post-compaction continuation; no settings change or implemented wake mechanism |
| Release and dependencies | Application v0.26.0 and skeleton 0.22.0; no new dependency; local release preparation and refreshed runtime/evidence projections |

Focused cutoff: 45 tests passed, zero failures, in 7.645 seconds; full transcript
is linked above. Initial native execution inside Codex's outer sandbox was
refused. The recorded passing run used the authorized outside-sandbox host and
then exercised the product's own native confinement. A second sandbox cannot
be installed inside the resident's first sandbox; the pinned producer therefore
uses a private bootstrap in one episode-wide sandbox. Direct public discovery
retains per-check confinement. D002 records the runtime read probe and review
corrections. The final suite also proves npm lifecycle fidelity and that moved
placement sources / removed generated files no longer produce candidates.

Limits: current native check execution requires macOS sandbox-exec. The bounded
reference scan excludes Git metadata/dependencies, the selected profile and
repair history, and tests literal declared tokens rather than language-level
reachability. Generated classification and placement are explicit conventions;
repair recurrence comes from structured target records, not guessed commit
intent. Default failing-check scope is package.json. File count is measured
scope, not a repair estimate. No incomplete scan is reported as complete.
Schema-verified discovery is not independent verification of a proposed fix.
The trusted repo-command boundary retains the actor host's stated limits for
hostile same-user processes and deliberately detached descendants.

The complete product gate passed: 19 suites, zero failures, 63 fresh tasks in
381.64 seconds. Feedback revision 002 completed ten live fixtures through the
Codex transport and its verifier; authority/feedback checks pass, and the
existing artifact/verification editions remain valid. The additional continuity
ideation changes only documentary requirements and records no executed
compaction proof. The document gate passed all 17 suites with zero failures in
219.31 seconds. Its first attempt rejected soft-wrapped release-note prose;
the corrected one-paragraph-per-line notes passed the existing check. Publication
coverage and both source locks pass. Required executor evidence is complete;
the canonical implementation-ready transition records the separate handoff.
Final counters belong in ignored usage receipts and the response.
