# WO-054 repair of VER-001

Dispatch: `resume: fix`, 2026-09-18. The selected order remains WO-054;
verification and final review retain their separate dispatches. Executor:
Codex CLI 0.155.0, gpt-6-astra, ultra (normalized xhigh), from current-session
readback. One coding writer; one read-only review helper.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.0","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

## Result and operator correction

The operator's problem is an active work order going idle after automatic
compaction: the assistant answers an old message and then stops. The repaired
adapter restores the unfinished task and supplies one automatic continuation
for that compacted turn. It does not classify conversational strings or use a
separate pause/resume latch. Saved task ownership, completion checks, one-shot
delivery and existing formal recovery controls remain. Native interruption is
left to Codex.

The initial repair took the wrong path: extending a speculative stop-word regex
to cover verifier examples. The operator had not asked to stop. The fixer
assumed a design, edited it, and failed to obtain the missing behavioral detail
first. The operator then described the actual failure and rejected both options
in the fixer's questionnaire. No approval of either was inferred. This detour,
its cost limits, and the correction are recorded in
[D004](decisions.md#wo-054-d004); [D005](decisions.md#wo-054-d005) records the
actual direction. The order's execution appendix preserves that clarification.

## Findings disposition

| Finding | Repair or bounded disposition |
| --- | --- |
| F1: generated Codex hook breaks formatting | Add `.codex/hooks/` to the existing generated-code exemption. The regression runs the actual formatter over generated JavaScript paths; bundle identity remains checked separately. |
| F2: incomplete stop-word parser | Remove the parser under the operator's explicit clarification. Test compaction, stale reply and automatic continuation directly. No general natural-language stop detector is claimed. |
| F4: recovery `off` clears a separate stop latch | Remove the extra latch and its clearing rules together. Existing formal recovery controls keep their own unchanged state. |
| F3: launcher stderr prefix can downgrade fail to unavailable | Correct product 02 to disclose the heuristic and its limit. Runtime behavior remains fail-safe against a pass; missing-command handling is preserved. Reopen if trustworthy launcher attribution is required. |
| F5: event extras are projected before compilation | Scope the closed-field guarantee to direct compiler inputs and capsules. Document raw event-log extras and the shared baseline validator's `$.subject` diagnostic path. No event-schema migration. |
| F6: reserved extension names change legacy handling | Document that `snapshot` and `hostTest` are validated when present; unrelated legacy extras still use positive selection. |
| F7: native interruption coverage overstated | State that the original probes did not exercise interruption. Preserve their historical hashes and add a distinct current-byte compaction-recovery probe. |
| O1/O2: test provenance and confinement wording | State that named-test bytes come from the observed commit and are visible in the diff. Limit outside-read denial to direct filesystem paths and disclose indirect IPC/runtime access. |
| O3: intermediate editions | Preserve immutable prior editions; current artifact, authority, verification and feedback evidence advances to revision 004. |

The verifier's original report is unchanged. F2/F4 are resolved by removing
the rejected mechanism under recorded operator direction, not by claiming its
original language-recognition contract now passes.

## Executed evidence

- `node --test scripts/test-codex-continuation.mjs`: 9/9 pass. Includes the
  actual emitted entry, formatter policy, reported idle sequence, unchanged
  lifecycle/writer state, completion, foreign state and recovery-control races.
- [Native current-byte probe](codex-repair-native-probe.json): Codex CLI 0.155.0,
  automatic compaction → initial old-question reply → generated Stop
  continuation → pending file write → recovered reply. Four compactions, one
  receipt, no external wake-up or background worker; exit 0, 165.494 seconds.
  The helper ran it in a standalone scratch Git repository with synthetic
  status/ownership. The fixer verified all generated-file hashes before filing.
- `npm run test:docs`: 17 passed, 0 failed, 131.09 seconds, 17 fresh tasks.
  This includes the previously failing format gate, generated bundle checks,
  publication, planning and the document-selected package checks.
- Fresh live `feedback-audit`: codex-cli-exec, requested gpt-6-astra/xhigh,
  completed acceptance matrix over ten fixtures. Effective child effort is
  unobserved. Revision 004 records its report and both event streams; console
  JSON, terminal and HTML expectations match that edition.
- The snapshot proof passes: worker superficial pass, host contract failure,
  failing acceptance matrix. `publication:check`, `plan -- check`,
  `harness check`, console evidence checks and `git diff --check` pass.
- Product `npm test`: 20 passed, 0 failed, 344.06 seconds, 64 fresh tasks.
  No runtime source changed after this gate. Final report/index/lifecycle
  preparation follows the existing code-identity rule.

The local release preparation retains application v0.30.0, compiler 0.14.0 and
skeleton 0.26.0 under the existing minor classification. No new dependency or
publication action. Historical native and numbered evidence stays intact.

## Limits and process observations

The native probe deliberately elicits the stale reply in a synthetic scratch
task. It proves the runtime wake-up sequence, not desktop activation, native
interruption delivery or general model completion. This worktree's generated
files require the host's normal loading/trust path; no persistent setting was
changed. The real worktree snapshot remains the bounded first proof described
in the original order; no new live target-verifier claim is made.

The initial session bookkeeping began before the fix dispatch and therefore
recorded ImplementationReady instead of RepairCompleted. The existing session
hook later projected the already-recorded fix briefing and corrected the role
expectation without repeating a lifecycle transition or erasing observations.
Writer registration was also explicitly observed later in this repair rather
than assumed from session begin. No second coding writer was used. These are
process corrections, not evidence that automatic Codex hooks ran in this session.

The first planning check needed refreshed follow-ups and the canonical
`Execution record` appendix shape; both were repaired and the check passes.
Final token/USD counters belong to ignored receipts and the handoff response.
No exact cost for the discarded parser detour or process savings is claimed.

The explicit fan-out was one reused read-only review agent, one isolated native
CLI fixture episode and the required live feedback verifier. These are three
known model episodes outside the root, below the cap of 20; the harness counter
does not establish complete coverage of them. The native fixture took 165.494
seconds; the document and product gates took 131.09 and 344.06 seconds. The
helper's source-only test run overlapped the root focused suite and added no
required evidence; it was not repeated again. No cheaper equivalent complete
outcome was measured.
