# WO-199 executor reviews

## Implementation (before `implementation-ready`)

Both fresh read-only workers were given the work order and the implementation diff. Each was launched with the required `gpt-6.1-sol` / `max` selection and reused for the revised diff; neither wrote files, ran probes, dispatched a lifecycle command, or spawned descendants. The root remained the sole writer and ran the executable evidence.

Criteria adversary: initial found 3; fixed 3; recorded 0. The findings were the stale lease on immediate restart, a live child after the writer leader exited, and writer execution before the durable start marker. The second pass judged all three resolved with 0 new blockers and 0 suggestions. The final native supervisor pass reported 0 actionable findings: the actual writer cannot inherit the private channel, the supervisor retains the recorded group identity, and the runner preserves its reported result through deliberate cleanup SIGKILL.

Design improver: initial found 1; fixed 1; recorded 0. This was the same stale-lease finding, counted once in the aggregate. Both revised passes reported 0 new actionable findings and 0 optional suggestions. The final pass found the native supervisor and runner protocol bounded within the existing helper.

The root also checked the native immediate-parent identity contract and repaired the missing intermediate ancestry edge for new native launches with stable supervision. The direct-child and double-fork regressions assert descendant termination. The failed full gate exposed three additional unique fixture/layout issues: the old lease-delay expectations, the historical fixture retaining new launch-gate evidence, and the vertical row's cumulative timeout. The root also corrected the wrapper's untyped revocation reason. All four are repaired, with the focused source and CLI suites passing. Both reused workers' final gate-repair passes report 0 new actionable findings and 0 optional suggestions; they confirmed the sibling file remains in the same vertical row with its unchanged two lanes and deadline.

The root's current-gate observation also found that the first sibling name displaced the main file from its initial lane. A bounded matched scheduling comparison proved the name-order effect; the dotted sibling suffix restores the main/judgment initial pair without changing concurrency, deadlines or test content. Both reused workers reviewed the final renamed-file diff and reported 0 new actionable findings and 0 suggestions. D008 records this ninth finding and the explicitly stopped gate.

Aggregate unique findings: found 9; fixed 9; recorded 0. The duplicate worker lease finding is counted once; the three lease-delay test failures share one cause. Older identity-bearing records retain conservative ancestry recovery; unavailable or mismatched identity never grants signal authority. These source reviews are independent assessments, not executed test evidence. D007 records the failed gate and the correction to the incomplete progress readback. The current full review now passes 38 rows with 0 failures; its vertical row completes in 825.98 seconds. `validation.json` and `review-gate.txt` preserve the executed evidence.

Decisions: [D004](decisions.md#wo-199-d004--resolve-independent-review-recovery-gaps), [D007](decisions.md#wo-199-d007--repair-the-failed-review-gate-and-correct-its-readback), [D008](decisions.md#wo-199-d008--preserve-the-main-vertical-files-initial-test-lane). Executed recovery and interruption transcripts are beside this report; the handoff identifies the final gate rows and live edition checks.

## Repair of VER-001 (before `repair-complete`)

The repair diff against the repair-request checkpoint (`refs/dotln/checkpoint/WO-199/5`) was reviewed by one read-only workflow of four `dotln-worker` agents (`claude-opus-5-5`; the session's effort readback was unavailable to them), none of which wrote to the repository, ran a test, probe or gate, or spawned a descendant. Three lenses ran in parallel with the order, VER-001, D009, the then-current D010 and the recorded evidence: a criteria and repair-rule adversary, an abort-coverage enumerator over every wait and child the vertical can be inside, and a design improver. One batched refuter then judged every finding from source. The root ran all executable evidence.

Findings: 27 reported (nine unique across the lenses); 26 confirmed and 1 refuted. The refuted item held that a second interruption of the same writer step exhausts its two dispatches; the refuter showed it to be the documented recovery contract (skeleton README §Recovery), not a WO-199 defect, and its one wrinkle, an attempt recorded before the first abort check, is fixed. The confirmed unique findings and their dispositions:

- Blocking, fixed: the run's AbortSignal, spread into the repair host's source options, was serialized into the recorded `RepairOpened`, so a repair opened by one entry and resumed by the other threw `repair recovery request drift` and was sealed refused; the opening now records neither the signal nor the lease waiter, and the repair-writer regression resumes the CLI-opened repair in process.
- Blocking, fixed: an immediate rerun after an interrupted repair verifier was refused `prior episode still leased` and sealed, because the lease wait lived only in `judge()`; the repair host now honors the lease through a waiter hook the primitives supply, and the regression holds the repair verifier, interrupts it and resumes inside its lease.
- Blocking, restated: synchronous host tests (180 s focused, 30 s per witness test) and untimed forge calls hold the host past the stated bound, and the backstop counts only from when the handler runs; the README and D010 now state the bound per call. Running those calls asynchronously under the abort was rejected as beyond the bound (D010).
- Blocking, fixed: a terminal-wide signal that killed a synchronous child surfaced as a thrown step failure before the handler ran and was recorded refused; the vertical host and the runtime's admission now let the loop turn before classifying a failure, and a regression reproduces the race in process.
- Should, fixed: the admission intake episode was not reached by the abort and would be orphaned by the backstop; its transport is wrapped like every step's, admission admits nothing after a signal, and the judgment suite interrupts a held intake.
- Should, fixed: the judgment regression never entered the lease wait (a pinned clock and a rerun past the lease); the preload's clock now advances in real time from the fixture's instant, and the rerun starts inside the lease and proves the wait and the one fresh attempt.
- Should, fixed: the README and D010 said a triage episode's store records `WorkerInterrupted`; triage has no store and its command stays undecided, which both now say.
- Should, boarded (D011): the witnesses step's browser scenario is not reached by the abort and its rerun refuses its own directory, a pre-existing gap.
- Notes, fixed: a second abort check before a step executes; a typed interruption the vertical host exports for the vertical's scripts, with the source host keeping its own copy so the harness's pinned runtime module stays unchanged, and `isWriterRequest` in the wrapper; abortable timers in place of a race that left the poll timer armed; the wrapper's doc comment and names; the backstop's rationale and the catch comment; the README's two native helpers and `xcrun`; and the regression nits (a repeat-signal timer bound to the first host, the settle sleep's comment, redundant elapsed asserts, an unhandled rejection).

These are source reviews, not executed evidence; the bounded suite runs and the probe in D010 and `repair-001-*` are the executed checks. `reviews.md` records the counts the handoff cites: review found 27 (9 unique); fixed 25; recorded 2 (one boarded in D011, one restated as the bound).

## FINAL-001 repair review — 2026-10-08

This repair uses root source and executable review. The two-worker rule applies
before implementation-ready; this dispatch records repair-complete, so no new
review agents were spawned. The prior implementation and repair worker reports
above remain available to the independent verifier.

Rule pass: inspected every changed source-host integrity and observation call,
the successful and failed vertical returns, CLI listener removal, both snapshot
callers and the repair host's extra reproduction tests against D013. Added the
unquoted trapping-runner variant, killed admission-read variants and a signal
queued at the final CLI return. The three new real-CLI regressions passed; the
48 source, integrity, snapshot and repair-host tests also passed.

Design pass: factored the interruption boundary and the snapshot preparation
core so the existing synchronous snapshot API keeps its callers and the vertical
can check pending signals after each test. The bounded comparison of two
immediate turns against five timed turns is filed in
`repair-002-validation.json`; both delivered all three signals, and the chosen
arm removed the timed wait. No repository or transport identity guard was
relaxed.

Found 2 implementation defects and fixed 2: converting observe() to async left
the recovery branch returning its promise from inside a try/finally, so the
store lock was released before admission completed. The source now awaits it;
the reviewer probe and every post-result regression rerun resolve with a passing
test and exactly one writer attempt. The first review gate exposed another missed async caller: resolution filed the snapshot promise and removed its checkout before preparation settled. Resolution and its triage/repair callers now await preparation, and checkout cleanup waits for async success or rejection while preserving synchronous callers. Eleven targeted checkout and resolution regressions pass, including the extended cleanup case. The stopped gate records no passing check. No new defect was deferred. D011's browser
scenario and D061 retain their earlier boards and reopening conditions.

self-review: found 2; fixed 2; recorded 0
