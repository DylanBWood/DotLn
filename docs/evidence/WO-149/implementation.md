# WO-149 implementation — Codex sessions begin at lifecycle dispatch

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-5.6-sol","effort":"xhigh","source":"codex-session-readback"}

Dispatch: `resume: next`, 2026-09-21. The executor changed the existing
lifecycle path; it added no Codex hook, dependency, schema, gate or receipt.
No commit, push, pull request, tag or release publication was performed.

## Delivered behavior

`beginHarnessSessionOnce` delegates to the strict session-begin primitive and
absorbs only its established already-began refusal. `scripts/resume.mjs` maps
`next` and `fix` to executor, `verify` to verifier, `final-review` to reviewer
and `release-close` to release-close. When `CODEX_THREAD_ID` and the built
harness runtime are present, the dispatch begins that role's session after the
command is admitted and before current-session or usage observations are read.
A repeated dispatch preserves the record byte for byte; a dispatch without a
thread identity writes no session record.

The Contributor sentence now states that Codex lifecycle dispatch begins are
automatic, and the regenerated `.agents` and `.claude` bundles carry it. The
operator's D005 expansion also makes the verifier selection explicit:
independent verifiers use `xhigh`, not `max`; a transport with a hard dollar
control may cap a launch at USD 5, while a recorded limit without that control
must not be called enforced. The feedback verifier constant and its transport
fixture use `5.00`.

Application `v0.40.2` is prepared as the declared patch release. Skeleton moves
from `0.34.1` to `0.34.2`; the console's exact workspace pin follows it.
Compiler, kernel and console package versions are unchanged, and no external
dependency changed.

## Executed evidence

- The focused process-debt selection passed 3/3: the WO-149 fixture creates the
  executor session with bounded start time and no adopted authorship, preserves
  its bytes on repeat, writes nothing without a thread, measures 16 transcript
  tokens with `codex-transcript-counter` and its cutoff, and admits both the
  measured and no-session receipt lines. The same run retained the adjacent
  WO-140 and bare next/fix regressions.
- The focused feedback-host suite passed 3/3, including the live transport
  argument's USD `5.00` cap. `npm run build` passed.
- `node scripts/harness.mjs check` passed all 31 generated surfaces. Cold-start
  bytes in each skill root are executor 24,412/24,576, verifier
  21,365/25,151, reviewer 22,543/24,576, release-close 13,967/16,384, planner
  15,033/24,576 and refuter 15,690 with no ceiling. Sequence bytes are
  7,807/8,192.
- The current authority and feedback selections are immutable WO-149 revision
  `002`; revision `001` remains superseded residue from before D005's registered
  source changes. Authority, feedback, artifact-identity and verification
  evidence checks pass. The console's five fixture cases match the selected
  self-host.
- The authorized feedback self-host ran one retained verifier command through
  `claude-cli-print` 2.1.278, Claude Sonnet 5, `xhigh`, with a 600-second and
  enforced USD 5 per-launch limit. Attempt 1 retained `invalid-result` after
  211,040 ms. Attempt 2 reused the command and pinned subject and completed both
  criteria after 162,325 ms. Canonical usage observations total 1,719,722
  tokens, USD 2.909 and 376,872 ms across both attempts. This auxiliary audit is
  not acceptance criterion 3's Codex work-order verification.
- `npm run test:docs` passed 19/19. Publication covers 273/273 product headings
  with both source locks current. Release-surface, formatter, meta, generated
  index and `git diff --check` checks pass.

The order explicitly allocates the single full `npm test -- --review` run to
final review, so the executor did not spend or claim that gate. Acceptance
criterion 3 likewise remains for the independent `resume: verify` Codex session:
its VER report must carry the real counter line for that dispatch.

## Known adjacent issue

The configuration-root suite detects a second checkout-root derivation in
`scripts/probes/local-model-role-qualification.mjs`. Replacing it with
`TOOL_ROOT` makes that suite pass but changes the immutable WO-138 probe subject
and invalidates all 38 committed episode hashes. The probe was restored byte
for byte, all 13 probe tests pass, and adjacent item `adjacent-0001` is disposed
as a known issue with the dedicated rerun-or-versioning follow-up in D003. No
guard or evidence binding was weakened.

## Process limits

No collaboration agents were spawned. The authorized live verifier was one
read-only child command with two retained attempts and no requested descendants.
The executor's entry counter is unknown because its initial dispatch occurred
before this order installed session entry. A later real repeat dispatch began
the current session; the handoff read is 11,509,621 total tokens from
`codex-transcript-counter`, dispatch scope, cutoff
`2026-09-21T22:28:55.289Z`. The counter reports 11,484,610 input tokens,
11,269,248 cached input tokens, 25,011 output tokens and 10,103 reasoning output
tokens; USD is unavailable. The harness subagent observation is 0 of 20,
exact-observed, with the unobserved remainder unknown; it does not count the
separately recorded feedback-verifier child process. Decisions D001–D006 record
the sources, alternatives, correction, costs and reopening conditions.
