# WO-198 fourth repair: two separate executor review passes

Dispatch: `resume: fix`, addressing VER-004 F5. These are executor passes,
not independent worker judgments. The skill requires two fresh workers
before `implementation-ready` only; this repair uses the separate-pass
fallback before `repair-complete`. No agent was spawned.

Actual selection: Codex CLI 0.162.1, `gpt-6.1-sol`, effort `max`, source
`codex-session-readback` from the canonical briefing. The order recommends
xhigh for the executor. This records the supplied selection, not effective
effort. The session's observed subagent count was zero against a cap of 20.

Criteria pass: found 0; fixed 0; recorded 0 additional findings.

- Read the order, failure rule, interdiff against checkpoint 17, new tests,
  snapshot guard and both comparison calls. Missing branches compare as
  `absent`; only `unreadable` withholds a field. The direct matrix covers
  every field on either side, including refs/dotln/ beside readable changes.
- The linked-worktree witness preserves two failed rows and one summary,
  and prints exactly one since-previous branch creation line. The existing
  during-run and return-to-previous-value witnesses exercise the other
  call and retain both intervals. Passing rows remain silent.
- Legacy and structurally malformed snapshots provide no baseline.
  Explicit unreadable fields are structurally present and cannot become a
  count or a branch absence. Unreadable tags do not suppress branch or
  refs/dotln/ comparisons.
- Clean dangling and non-commit refs intentionally record `absent`, as
  D015 permits; the existing during-run dangling witness now compares that
  value. Launch failure and damaged packed-refs record `unreadable` without
  throwing. The sibling fixture still shows no task flipping.

Design pass: found 0; fixed 0; recorded 0 additional findings.

- The nonthrowing helper retains only successful stdout or the quiet
  branch command's clean non-resolution. It adds no calls, retry, fallback
  inventory or dependency. Strict identity and durable persistence remain
  unchanged.
- The guard still rejects malformed structure and invalid counts before
  the comparison reads nested fields. The field checks reserve
  `unreadable`, which cannot be a commit hash, annotated v-tag name or
  numeric inventory in a snapshot the reader produces.
- One new whole-gate witness runs only build and beta twice. Comparison
  combinations and Git classification use direct tests, retaining the
  existing cheap-fixture repair. The focused run passed 17 tests in 13.502 s;
  its transcript supplies execution evidence, not a full review claim.
- D017 corrects the old rule and states the permitted non-commit choice.
  Product 07's sentence agrees with it. Immutable evidence revisions and
  installed harness snapshots must be refreshed before the required gates;
  their results belong to the handoff after execution.

VER-001 B1 remains deferred through D004 and `FUP-f5f10101e717d59b`.
The required document and full review gates have not yet been judged by
this review file; their actual results are recorded in the final handoff.
