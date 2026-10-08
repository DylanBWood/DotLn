# WO-199 executor handoff — repair of FINAL-001 F1

FINAL-001 reproduced a terminal signal becoming the source host's focused-test
result, followed by a successful exit. D014 repairs that class at the observation
boundaries: pending SIGINT, SIGTERM and SIGHUP take precedence over synchronous
child data and failures before they become receipts, observations, host refusals
or permanent integrity findings. Source-change remains pending and its rerun
checks integrity and tests the existing committed result without spending a
writer dispatch. Baseline and candidate witness preparation publishes no
interrupted evidence, retains the incomplete copy and tests a fresh copy on
rerun. The step loop handles pending signals on successful and failed returns;
an already accepted clean effect retains its receipt under D010. The CLI keeps
its listeners through a final signal-delivery checkpoint.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.161.0","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

**Criterion 1:** met — the agreed recovery probe passed during this repair: crash-vertical recorded group 71337 and recovered observed; crash-direct recorded group 72738 and recovered observed; revoke-vertical recorded the process stop and WorkerInterrupted. The 48 passing source-change, integrity, snapshot and repair-host tests include stopped and surviving writer recovery, launch-marker admission and refusal of unproven birth identity. Executed rows are in repair-002-probe-results.json; the full review gate repeats those regressions and passes at code identity 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c.

**Criterion 2:** met — the current npm test -- --review gate passes the live-writer, judgment, settle-wait, repair-writer and real-CLI signal regressions at code identity 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c. Group-wide SIGINT, SIGTERM and SIGHUP during post-result focused tests, a trapping runner, killed admission reads, and baseline and candidate witness tests exit nonzero and preserve the affected pending step. A signal queued at the final CLI return also exits nonzero. No interrupted child result becomes an observation, refusal, unreadable finding or receipt. Source-change reruns test the existing commit with one writer attempt; witness reruns test a fresh retained copy. The gate's vertical task passes in 725.851 s (repair-002-validation.json).

**Criterion 3:** met — the 48-test bounded host run passes the genuine post-result effect and receipt refusal tests with host-admission checks and no transport-failed interruption. New group-wide admission-read regressions separately show that terminal interruptions yield neither SourceChangeRefused nor permanent unreadable integrity findings (repair-002-validation.json and repair-002-probe-results.json).

**Criterion 4:** met — after the last judged-source edit at 2026-10-08T18:47:48.283Z, the live codex-cli-exec feedback episode ran on gpt-6.1-sol/max at 18:52:31.049Z–18:53:48.335Z, phase complete, ten fixtures. Feedback 004 is recorded by reference and checks current. Authority, artifact-identity and verification 003 are re-minted and all four checks pass (repair-002-edition-checks.json). Previous editions and the earlier live episode remain preserved.

**Criterion 5:** met — README, D014, review record and indexes are updated; FUP-627ec3088bb86e62 and FUP-5f8a48126bb022be retain their settled dispositions, and FINAL-001's FUP-9e32c0d0868c29c7 is settled onto D014. Publication checks and git diff --check pass; release prepare --local confirms v0.69.2 and skeleton 0.55.1 remain current. npm run test:docs passes 29 checks in 86.596 s; npm test -- --review passes 38 suite groups, 88 fresh tasks, in 1307.615 s with zero failures. Both rows record code identity 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c, unchanged identity and unchanged build output (repair-002-validation.json). No dependency was added.

self-review: found 2; fixed 2; recorded 0

Root source and executable review found and fixed the async observation's lock
lifetime in recovery and the detached resolution checkout lifetime. Eleven checkout and resolution regressions pass after the latter correction. The three added real-CLI regressions pass (eleven scenario
branches), as do 48 existing host and snapshot tests. The separate rule and
design passes, finding and disposition are in reviews.md. This repair spawned
no review agents; the two-worker rule applies before implementation-ready.
The required live feedback verifier is recorded as its own episode. The first review attempt was stopped after the resolution-caller failure and records no passing check; the corrected repeat gate is the passing evidence.

Goal alignment matched D014: preserve the writer's owned group and termination
checks, authority, shared-state baselines, completed receipts and unfinished
snapshot files; admit no signal-produced result and spend no writer dispatch on
host re-observation. D061 and the D011 browser-scenario board remain unchanged.
The adjacent queue is revision 20 with all four prior items completed and no
next item. The follow-up disposition is revision
86112f1e70aea7a4b7d4b54da49ae08c78ee8ab19c4d7ddeccd9bd3a583752c4.

Limits: synchronous child calls still return under their existing timeouts
before the pending signal is handled. The writer settlement bound remains 10 s;
the CLI backstop is 15 s after it handles a signal. Linux was not exercised.
Fixture repositories were created under system temp and disposed by their own
cleanup; no new scratch Git repository was created inside this worktree. The
live store and process-cost receipts are ignored session scratch. No custom
background monitor remains. No branch commit or publication occurred.

Process cost is available from the dispatch's codex-transcript-counter at
entry and handoff; final counters remain in the ignored session receipts and
operator response. Dollar cost is unavailable. The bounded comparison records
both signal-delivery arms; two immediate turns delivered all tested signals
with a measured 0.083 ms ordinary-call cost against 54.194 ms for five timers.
