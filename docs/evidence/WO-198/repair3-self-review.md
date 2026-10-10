# WO-198 third repair: two separate root review passes

Dispatch: `resume: fix`, for VER-003 F4. These are separate passes by the
executor, not independent worker judgments. The executor skill's two-worker
rule applies before `implementation-ready`; this transition is
`repair-complete`, so no worker was launched. The original worker reports
remain in [self-review.md](self-review.md).

Actual session selection: Codex CLI 0.162.1, `gpt-6.1-sol`, effort `max`, source
`codex-session-readback` from the canonical fix briefing. The order's executor
recommendation remains xhigh. No effective-effort claim is made.

The initial three new parent tests failed at the throwing tag enumeration.
After repair, all 14 focused WO-198 tests pass in
[repair3-fixture-transcript.txt](repair3-fixture-transcript.txt). Review evidence
below combines that execution with reads of the order, VER-003, the changed
source/tests, the existing snapshot validator and both runner call sites.

## Criteria and failure-rule pass

Found 0; fixed 0; recorded 0 new findings.

- Every diagnostic Git read uses the same nonthrowing helper, at both start
  and end. A failing command's partial output is discarded. The two branch
  resolutions, tag inventory and DotLn-ref inventory all retain their named
  fields when damaged packed-refs makes the reads fail.
- A dangling tag leaves successful branch and DotLn-ref observations intact,
  and degrades tag count/newest explicitly. An absent enumeration count fails
  `completeSharedRefs`, so it cannot become a comparison baseline. A branch
  without a resolved commit is skipped only for that branch's comparison.
- A broken shared tag before a document gate and during a plain gate cannot
  prevent a passing row or its single summary. The failed tag-before witness
  retains exit 1 and its row. The additional broken-origin-during witness
  retains the task failure and prints no fabricated movement. The fixtures
  read the persisted hot index independently of `readGateChecks`.
- The sibling merge/tag reproduction, actual movement line, incomplete
  earlier snapshots, failed archive lookup and return-to-previous-value
  checks still pass. The reduced table shows no task flipping; it does not
  prove that every live task ignores shared state.
- Product 07 states the degraded-read rule in place. Release target v0.73.1
  and the existing compatible component patches remain current. The new
  evidence selector uses revision 003; earlier revisions are retained.

## Design, simplicity and maintainability pass

Found 0; fixed 0; recorded 0 new findings.

- Error containment belongs in `readSharedRefs`. The strict identity helper,
  task scheduler and persistence code retain their behavior. The repair
  neither catches a real gate error nor synthesizes a passing task.
- The helper adds no extra Git reads, retries or tag-by-tag recovery. It uses
  the existing enumeration buffer bound. Zero remains an observed empty
  inventory; `absent` means an unavailable observation.
- The conservative comparison boundary is explicit: an unreadable inventory
  omits that snapshot interval, and a branch's creation/deletion through
  `absent` is omitted because resolution alone cannot distinguish missing
  from unreadable. D012 records that limit and its reopening condition.
- Four actual fixture gates cover passing/failing results and start/end
  failures in linked worktrees. Direct Git reads cover all four failed reads,
  partial-output rejection and recovery. No per-shape whole-gate matrix or
  dependency was added.
- Generated harness changes update the diagnostic module hash and immutable
  snapshot pin. Authority, artifact-identity and verification editions are
  re-minted under a new revision; earlier records are preserved. Their check
  commands and the publication check supply generation evidence.

VER-001 B1 remains on D004's existing deferred follow-up
`FUP-f5f10101e717d59b`. It is a separate snapshot-less harness writer and is not
changed here. The required document and full-review gate results are recorded
in the final handoff after they execute; this review file does not supply them.

## Later gate-readback correction

Found 1; fixed 1; recorded 0 additional findings.

Reading the review's carried-task records exposed the stale sentence in
product 07 Discipline that still described `--review` as always fresh. WO-196,
the current runner and the passing composition regression establish the newer
rule. D014 records the same-day correction, the bounded adjacent queue item,
the in-place sentence and the checked publication lock. The item's document
gate passed all 32 checks, and the queue records it completed at revision 10.
This additional root finding is not
an independent worker judgment and does not revise the two earlier zero-count
passes.
