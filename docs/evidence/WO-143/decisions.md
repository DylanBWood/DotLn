# WO-143 decisions

## WO-143-D001 — Publish complete owners and fence recovery by acquisition identity

```json
{
  "id": "WO-143-D001",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Publish a prepared owner directory through an exclusive relative symlink at host-lock-recovery. Serialize dead-owner recovery with immutable, exclusively linked successor records in that unique directory, and confirm the canonical guard still names it before shared-store work. Publish host.lock from a complete prepared file as well. Positively replay the resident log under append ownership and skip polling transactions after kill.",
  "evidence": [
    "docs/work-orders/WO-143-resident-lock-recovery.md",
    "docs/verifications/WO-068/VER-001.md F1",
    "docs/final-reviews/WO-068/FINAL-001.md F1 and O2",
    "packages/skeleton/src/worker-store.ts acquire",
    "packages/skeleton/src/resident-store.ts transaction and acquire",
    "packages/skeleton/src/resident-host.ts polling loop",
    "Node.js fs API and test-fs-error-messages.js, retrieved through Context7 on 2026-09-19",
    "Read-only design review during this dispatch: generation fencing and canonical-target revalidation"
  ],
  "rejected": [
    { "option": "NoOp or timeout", "reason": "NoOp retains the reproduced permanent wedge; a timeout can evict a live slow inspector." },
    { "option": "Create a directory then write its owner", "reason": "A kill between those calls recreates the ownerless wedge." },
    { "option": "Rename a prepared directory over the canonical guard", "reason": "POSIX rename can replace an empty legacy ownerless directory, contrary to required refusal." },
    { "option": "Read a dead PID then unlink the fixed guard", "reason": "A delayed contender can remove a successor guard; another fixed reclaim mutex repeats the same crash problem." },
    { "option": "Lifetime append ownership or new locking dependency", "reason": "Changes the shared presence/host contract or dependency boundary beyond this repair." }
  ],
  "reopenWhen": "WO-111's first unattended hour, a deterministic crash/concurrency fixture fails, or a supported local filesystem cannot supply exclusive hardlink/symlink publication."
}
```

Mission and critical path: remove recurring human rescue from the always-on
resident before its first unattended source-to-deliverable use. A symlink is
the atomic link to the prepared guard directory; its owner is complete before
the guard exists. Only the exact private relative target grammar is accepted,
with a real directory and regular owner files. Legacy ownerless directories
remain untouched. PID reuse and signal-probe uncertainty still refuse.

Each successor names a fresh acquisition identity and is linked only after its
predecessor is proven dead. Claimants use the original unique directory, never
the reused canonical path. A successful claimant rechecks the canonical target:
the old directory may survive retirement while a newer guard already exists.
The live tail alone inspects and retires the guard. A failed inspection removes
only that caller's claim and retains the original guard. Unpublished or retired
private directories may survive SIGKILL; they grant no ownership and are not
event or result receipts. No automatic deletion of unknown residue is added.

Inspection also found two holes in a guard-only patch: the existing host.lock
open/write sequence can leave a partial owner, and append-store inspection
reads its empty auxiliary log rather than positively replaying resident state.
Both corrections are inside the named lock/recovery surfaces and required by
the all-boundaries crash claim. There is no event or serialized-state change.

Policy resistance/fixes that fail: complete owner publication and generation
fencing keep recovery from defeating exclusion. Commons: one writer, up to two
read-only agents, no descendants or paid model-worker runs; measure fixtures.
Drift and rule beating: stop real resident subprocesses at filesystem boundaries,
including reclaim and cleanup, rather than waiting for locks to disappear.
Escalation: retain the existing lock interface, with no service, gate or hook.
Success to the successful: preserve the existing replay contract, not the
unsafe mkdir implementation. Shifting the burden: dead guards recover without
an operator; genuine uncertainty still names the path to inspect. Seeking the
wrong goal: successful restarts and intact event prefixes are the outcome, not
merely an owner file or passing static check.

Naive Interventionism: worker recovery, concurrent presence and legacy stores
are affected consumers. Preserve their event bytes and live-owner refusal;
exercise the smallest filesystem/crash fixtures before the product gate. The
change is local and reversible in source, though older binaries conservatively
refuse a new abandoned guard. The private record is a local-store interface,
consumed by the existing resident and worker APIs; no session fact is needed
to interpret it. Execution outcomes and cost will be recorded at handoff.

Correction during implementation, 2026-09-19: reusing the preflight transaction
while checking the incumbent lock only afterwards would let its live writer
append between the read and acquisition. Liveness validation now precedes all
mutable-log inspection while the guard excludes successor writers. The fixture
asserts that a live lock never invokes preflight. The original positive replay
requirement remains; it now judges a stable subject.

## WO-143-D002 — Stage the patch and refresh the existing source-pinned evidence

```json
{
  "id": "WO-143-D002",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Complete the activation placeholder as application v0.32.1 above the observed local v0.32.0 tag; bump only skeleton to 0.28.1, regenerate its versioned harness output, and refresh the existing evidence editions whose checks require current sources, including one read-only live feedback verifier.",
  "evidence": ["scripts/lib/release-preparation.mjs", "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS", "scripts/feedback-evidence.mjs", "docs/evidence/current.json", "packages/skeleton/fixtures/wo143-released-events.jsonl"],
  "rejected": [
    { "option": "Keep the activation placeholder", "reason": "release prepare correctly requires a strict assigned version; the standing patch classification already supplies authority." },
    { "option": "Reuse or overwrite old feedback receipts", "reason": "worker-store.ts is a declared behavioral source, so the existing live evidence no longer judges the current implementation. Historical editions remain immutable." },
    { "option": "Bump unchanged components or add a dependency", "reason": "Kernel, compiler and console sources and serialized contracts are unchanged." }
  ],
  "reopenWhen": "Integration consumes the staged version, a required evidence check rejects the final source, or independent verification finds a compatibility change."
}
```

Correction, 2026-09-19: D001's initial cost assumption of no paid model-worker
runs missed the existing feedback source pin. Checking its declared source list
and validation code established that this worker-store change needs one fresh
read-only verifier episode. The updated fan-out plan is two read-only design/test
agents plus that verifier, no descendants, within the root cap of 20. This is an
existing evidence refresh, not a new gate or publication step. Usage remains
unknown where native counters are unavailable.

The released-format fixture was generated by the `WorkerStore` source from the
local annotated `v0.32.0` tag using its acquire/append/release calls, with its
unchanged compiled protocol dependencies. It contains one durable generic event
and no local paths or secrets. The compatibility test copies its exact bytes,
with the released `{pid}` lock present or absent, then confirms unchanged log
bytes and the same host-lock shape. The legacy ownerless directory is separately
preserved byte-for-byte on refusal. No event schema changes are needed.

D001's mission and eight-trap comparison applies to this existing release and
evidence duty: source-pinned verification prevents rule beating; retaining old
receipts preserves evidence; one bounded verifier limits commons cost. NoOp
would leave stale evidence while claiming current coverage. The helper also
creates the ordinary review-draft process meter even when its diagnostic says
no files changed (the known WO-142-D020 behavior); this order had no prior draft
to preserve, and no review verdict is implied.

Source-validation correction, 2026-09-19: the first inventory run caught the new
guard decoder outside `atPath`. Wrap its reads in the same path-addressed decoder
and inventory both read sites; the inventory and its unguarded-read tripwire now
pass. The first feedback verifier had already completed before the attempted
stop, so no cancellation is claimed. Its local store and preliminary unselected
report remain intact; the final source uses feedback revision `001`. Actual
fan-out becomes two read-only agents plus two feedback verifier episodes, four
admissions against cap 20, no descendants. Starting that first audit before the
source inventory completed wasted one live subject; final-source checks precede
the replacement. No older edition or prior work-order evidence is rewritten.

Release-pin correction, 2026-09-19: the first document gate found console's exact
skeleton dependency still at `0.28.0`. Update that existing pin and its lockfile
entry to `0.28.1`; console's own version remains `0.1.7`. The feedback projection
retains dependency pins, and its historical release-label equivalence requires
committed evidence, so the second completed audit cannot judge these final
uncommitted bytes. Preserve it and select a third audit as revision `002`, after
release-surface, build, harness, authority, artifact and verification checks.
The explicit admission total is now five (two review agents, three verifier
episodes), still below 20. This was another avoidable early audit; the final
report names the selected subject and makes no efficiency claim for the order.

Document correction, 2026-09-19: the reassessment used new column names that
the console's existing table reader does not accept. The document gate exposed
this mismatch. Restore its established `Current assessment` / `Evidence and
remaining gate` headings without changing the assessment; all 19 document
suites then pass.

Handoff outcome, 2026-09-19: the complete product gate passes 21 suites / 65
fresh tasks in 246.82 s, including all 472 intentional crash/restart cases.
The selected evidence checks and publication check pass. D001's mission is
met within the tested local process-crash scope: dead guards no longer demand
an operator and no prior event bytes are lost. The existing conservative
inspection boundary remains intact. The skeleton suite took 244.31 s in this
gate; focused crash and restart groups took about 204 s. That recurring test
cost buys repeatable coverage of the previously untested failure window. The
two superseded live audits were avoidable duplication, not a claimed efficiency gain. Independent
verification, final review and WO-111 remain the stated reopening observations.
See [implementation evidence](implementation.md) and
[fixture transcripts](fixture-transcripts.md).

## WO-143-D003 — Board up VER-001 F1: the README says the refusal names the guard, but the CLI prints its redacted line

```json
{
  "id": "WO-143-D003",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Record VER-001 F1 with an owner. The skeleton README's resident runbook now says a refused guard's diagnostic names host-lock-recovery, and its v0.32.1 entry says refusing guards name the inspection path. The operator-facing dotln resident and dotln presence commands print only their redacted line, 'worker host refused; inspect the store and declared environment before retrying', for legacy, live-owner and malformed guards; the path is in the store-level Error only. Verification changes no product text. Final review corrects the wording, or routes the order to repair if it reads criterion 3 as requiring the command to name the directory.",
  "evidence": [
    "docs/verifications/WO-143/VER-001.md F1",
    "packages/skeleton/README.md: v0.32.1 entry and the resident section sentence ending 'the diagnostic names `host-lock-recovery`'",
    "packages/skeleton/src/dotln.ts catch block: redaction of unexpected diagnostics, present since WO-009 (eddce52e, 2026-09-05)",
    "packages/skeleton/src/worker-store.ts acquireGuard refuse(): the store-level Error carries the guard path",
    "Verifier reproduction 2026-09-19 against packages/skeleton/dist/src/dotln.js: four guard states, identical redacted stderr, exit 1"
  ],
  "rejected": [
    { "option": "Fail verification and route to repair", "reason": "The defect is two sentences of operator documentation that final review may edit; criteria 1 to 4 and 6 hold under independent evidence, and a repair cycle would re-verify unchanged code." },
    { "option": "Edit the README in this dispatch", "reason": "The verifier judges the subject and changes no product text." },
    { "option": "Read criterion 3 as failed", "reason": "Criterion 3 is a fixture criterion at the store boundary, where the refusal names the guard path. The CLI redaction predates WO-068 and is a separate product decision." },
    { "option": "NoOp", "reason": "An operator who meets a refused guard would look for a path the command never prints." }
  ],
  "followup": "WO-143 final review: rewrite the README v0.32.1 entry and resident-section sentence so they say the store error names host-lock-recovery, the CLI prints its redacted refusal, and the operator inspects <store>/host-lock-recovery and <store>/.resident-append/host-lock-recovery. Check product 03's 'refuse with the inspection path' for the same ambiguity. Route to repair instead only if the review requires the command itself to print the path. Priority: before merge.",
  "reopenWhen": "The CLI starts surfacing store refusals verbatim, or an operator reports being unable to locate the refusing guard."
}
```

## WO-143-D004 — Board up a pre-existing contention race met during verification

```json
{
  "id": "WO-143-D004",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Give an owner to a live-contention defect that verification reproduced and that WO-143 neither introduced nor was scoped to fix. If a live holder releases host.lock after a contender's present(lock) check and before its lstat or read of that lock, WorkerStore.acquire throws a raw ENOENT. ResidentStore.transaction retries only 'already has a live host' and 'recovery is busy', so a presence command or a resident transaction fails instead of waiting. No event is written or lost, and the store stays openable.",
  "evidence": [
    "docs/verifications/WO-143/VER-001.md O1",
    "packages/skeleton/src/worker-store.ts acquire: present(lock) followed by regularFile(lock) and readFileSync(lock)",
    "packages/skeleton/src/resident-store.ts transaction: retry pattern /already has a live host|recovery is busy/",
    "Verifier two-process probe 2026-09-19: a contender paused after present(host.lock) while the holder released gets ENOENT on the working tree and on the released v0.32.0 sources, two runs each"
  ],
  "rejected": [
    { "option": "Route to repair under WO-143", "reason": "No criterion covers live contention, the objective is kill recovery, and the code path is the same in the released version." },
    { "option": "NoOp", "reason": "A transaction error can end an unattended resident loop; WO-111's first unattended hour would then meet an ownerless defect." }
  ],
  "followup": "Planner: nominate a bounded order before WO-111's first unattended hour. Treat a host.lock that disappears between observation and read as absent or contended (retryable), not as an error. Add a deterministic two-process fixture that pauses a contender after present(host.lock). In the same order, check this unreproduced verifier inference: a delayed claimant that links into a retired target during rmSync can make the retirement throw ENOTEMPTY after host.lock is published. Priority: medium.",
  "reopenWhen": "A presence or resident command fails with ENOENT on host.lock, or WO-111's first unattended hour records a resident exit from a lock error."
}
```

## WO-143-D005 — Board up VER-001 F2: the delayed-claimant fixture does not detect removal of the claim-time fence

```json
{
  "id": "WO-143-D005",
  "date": "2026-09-19",
  "dispatch": "resume: verify",
  "decision": "Record VER-001 F2 with an owner. D001's canonical-target recheck after a successor claim is what keeps a delayed claimant away from shared state. Deleting only that recheck leaves all eight WO-143 tests passing. In that mutant, the refused delayed claimant replaces host.lock with its own pid while the successor holds the guard. The fixture asserts only the refusal, one claim, an intact guard link and the successor's acquisition, and release() re-checks the link before unlinking it. The shipped code has the fence and behaves correctly; the evidence does not discriminate it.",
  "evidence": [
    "docs/verifications/WO-143/VER-001.md F2",
    "packages/skeleton/src/worker-store.ts acquireGuard: readlinkSync(guard) !== targetName after linkSync(ownerPath, next)",
    "packages/skeleton/test/resident.test.ts 'WO-143 a delayed claimant cannot unlink a successor through a retired target'",
    "Verifier mutation M3 and step-by-step replay, 2026-09-19: host.lock pid changes to the delayed claimant's under M3 and stays the dead original's on the working tree"
  ],
  "rejected": [
    { "option": "Fail verification for a test gap", "reason": "The implementation is correct under direct replay, and criterion 2's simultaneous-contender case is discriminated. The gap is one assertion in a fixture the order did not require." },
    { "option": "Add the assertion in this dispatch", "reason": "The verifier changes no implementation or tests." }
  ],
  "followup": "WO-143 final review: have the delayed-claimant fixture also assert that host.lock (content and inode) is unchanged by the refused delayed claimant, so that deleting the claim-time recheck fails the suite. Route it to repair before merge, or name it as a known gap for the D004 follow-up order to close. Priority: before merge if routed; low otherwise.",
  "reopenWhen": "Any change to acquireGuard's claim path, or a mutation run that again leaves the recheck unguarded."
}
```

D003 to D005 were written by the verifier on the dispatch named above. None
changes the implementation, a criterion or the staged capability assessment.
Each gives a defect that VER-001 met an owner, instead of leaving it only in a
report sentence.

## WO-143-D006 — Final review: routing, the judged level and the measured acquisition cost

```json
{
  "id": "WO-143-D006",
  "date": "2026-09-19",
  "dispatch": "resume: final review",
  "decision": "Discharge D003 and D005 inside this review instead of routing either to repair, judge the capability row at 2 within the tested local process-crash scope with its two unattended-use limits written into the row, and accept the measured cost of the new acquisition with a reopening observation. D003: the skeleton README's v0.32.1 entry and resident runbook, and product 03's resident paragraph, now say the store error names the guard path while the dotln commands print only their redacted refusal, and the README names both directories to inspect. D005: the delayed-claimant fixture now records host.lock's content and inode before releasing the delayed claimant and asserts both unchanged after its refusal. Cost: one uncontended WorkerStore acquire and release takes a median 19.0 ms on this tree against 4.9 to 5.0 ms on released v0.32.0, because a steady-state cycle went from 2 fsyncs and 2 opens to 5 and 5.",
  "evidence": [
    "docs/final-reviews/WO-143/FINAL-001.md",
    "packages/skeleton/src/dotln.ts catch block: a message that begins with the guard path matches no pass-through pattern and prints the redacted line",
    "Reviewer mutation, 2026-09-19, scratch copy of the compiled package: with the shipped code the delayed-claimant test passes; with only the claim-time recheck deleted (VER-001's M3) it fails on 'refused claimant leaves the shared host lock untouched', actual the delayed claimant's pid, expected the dead original's",
    "Reviewer benchmark, 2026-09-19, this host, Node 26.9.0, local APFS: 400 timed cycles after 20 warm-up, two runs per build; released v0.32.0 worker-store.ts through Node's type stripping on this tree's other compiled modules: median 4.975 and 4.920 ms, p99 6.146 and 5.271 ms; this tree: median 19.031 and 18.972 ms, p99 24.310 and 24.073 ms",
    "Reviewer call count, one steady-state cycle: released openSync 2, fsyncSync 2, mkdirSync 2, rmdirSync 1, unlinkSync 1; this tree openSync 5, fsyncSync 5, mkdirSync 2, symlinkSync 1, linkSync 1, unlinkSync 2, rmSync 1",
    "docs/planning/work-order-map.md: the 2026-09-16 pass's reversal condition for level 2, 'F1's append-lock recovery window closed under test on the once and loop paths'"
  ],
  "rejected": [
    { "option": "Route D005 to repair", "reason": "One assertion in a fixture would cost a repair, a second verification and a second final review over unchanged product code. The edit is test-only, inside a path the order names, and its discrimination is shown by the same mutant that exposed the gap." },
    { "option": "Carry D005 as a known gap for D004's follow-up order", "reason": "The recheck is the only thing that keeps a refused delayed claimant from replacing a live successor's host.lock, which is two writers on one store. The order's own rule is that it never widens what is written; leaving that unpinned until another order opens the file is the wrong direction for the cost of one assertion." },
    { "option": "Read criterion 3 as requiring the command to print the guard path", "reason": "The criterion is a fixture criterion and the fixture asserts the store error. The CLI's redaction dates from WO-009 and exists so unexpected diagnostics cannot leak paths or credentials; changing it is a product decision no criterion here asks for." },
    { "option": "Add an operator procedure for removing a legacy guard to the README", "reason": "Considered and withdrawn during this review. No such procedure is documented anywhere, D003's follow-up asks only for what the operator sees and where to look, and what inspection suffices before removal is a product decision." },
    { "option": "Fail the review or hold level 2 over the acquisition cost", "reason": "No criterion bounds it, 19 ms sits well inside the 1,000 ms default tick, the polling loop transacts only when the log changed or a sample is due, and every added call buys a crash boundary the fixtures prove recoverable. It is recorded because the order's Cost line, 'one small file inside the guard directory per acquisition', understates it." },
    { "option": "NoOp on the capability row", "reason": "The staged row said promotion awaits verification and final review, which a merge would make false on a dated surface; criterion 5 assigns the judgment to these two dispatches." }
  ],
  "reopenWhen": "WO-111's first unattended hour records a tick that overruns its interval or a presence hook whose latency the operator notices; a store on a filesystem where fsync is materially slower than this host's; or any change to acquireGuard, which should rerun the 400-cycle loop and the M3 mutant."
}
```

D003's and D005's follow-ups are discharged by the edits above; their register
rows are the next planning pass's to settle, since disposition is a planning
act. D004 is untouched and keeps its medium priority ahead of WO-111.

Mission and critical path: the outcome is a resident no kill inside lock
acquisition can strand, and VER-001 observed it directly rather than through a
proxy. This review's material choices were where to spend a cycle. Rule
beating was the live trap, as it was for WO-068: the one assertion added here
exists because a suite could pass without the behavior it names. Commons and
escalation: no subagent, no live model, no new gate, hook or receipt; one
product gate, which the order assigns to this dispatch. Shifting the burden:
the README now tells the operator what the command actually prints, so a
refused guard does not send them looking for a path that never appears. Drift:
the cost is written down with numbers so a later slowdown is compared with a
baseline instead of normalized. Policy resistance, success to the successful
and seeking the wrong goal have no separate bearing: nothing is loosened, the
criteria are judged as written, and the level claim is scoped to what was
tested. Naive Interventionism: the reviewer's one test edit cannot change
product behavior, and the documentation edits change no criterion. NoOp on F2
and F1 would have merged a fence nothing guards and a runbook sentence that is
false at the command line.
