# WO-229 executor self-review

Two fresh read-only `codex-spawn-agent` workers, each `gpt-6.1-sol` at
`max` with no inherited conversation, received only the work order and frozen
implementation/test/document/evidence diffs. They started no descendants,
ran no tests or lifecycle commands and wrote no files. They reviewed correction
diffs in follow-up turns; the parent remained the sole writer.

## Adversary report

The criteria adversary reported two P2 findings:

1. `recordStopped` omitted a currently waiting task, potentially marking a
   failed contended sample as not contended. Fixed: an admission map retains
   ongoing intervals and observations separately from completed execution
   evidence. A real signal fixture passes after its build completes and its
   next task waits behind a sibling.
2. Timestamp-only sample selection could consume another document run's row.
   Fixed: a unique `planningSampleId` is passed directly to the child gate and
   required when reading its row; an unrelated candidate is ignored.

The adversary confirmed both fixes. A later concern about the paired control
was based on its stale addition snapshot: the callback had already been
updated with the marker. The worker checked the refreshed diff and withdrew
that concern, explicitly noting the stale-snapshot error. Final response:
remaining findings zero.

## Improver report

The design and maintainability improver reported three original findings and
one correction finding:

1. Preserve active waits in stopped rows. Fixed as adversary finding 1.
2. The appended planning tests ran outside the `--check-only` fixture selection.
   Fixed: `laneConditionFixtures()` is invoked from the existing fixture path.
   A bounded `--check-only` invocation passed with only the plan judgment and
   no fixture TAP output.
3. Bind each sample to its child instead of a timestamp window. Fixed as
   adversary finding 2.
4. The new child wrapper omitted the CLI's error handler, exposing an uncaught
   stack on rejection. Fixed: the wrapper prints only `error.message` and
   sets exit code 1. A bounded probe of the actual generated wrapper, with an
   injected rejecting gate, returned exactly the synthetic failure message.

The improver confirmed all four fixes and reported zero new findings.

## Disposition and executable evidence

self-review: found 6; fixed 6; recorded 0

These are the two workers' actionable counts (adversary 2, improver 4), with
shared findings counted for each worker. Four distinct implementation issues
were corrected. The withdrawn stale-snapshot concern is not counted as an
implementation finding. No issue remains deferred.

Parent-run evidence on 2026-10-23 UTC:

- Bounded host controls: four tests passed at 05:49:00, including actual
  stopped-gate attribution; three existing visibility/inspection cases pass.
- Bounded `laneConditionFixtures()`: both cases passed at 05:49:36, including
  overlapping sample candidates, failed contention and reuse stripping.
- Bounded `scripts/test-plan-refutation.mjs --check-only`: exit 0 at 05:50:17;
  only the plan judgment was emitted.
- Bounded `docs/evidence/WO-229/controls.mjs`: all three positive controls
  passed and all three mutations failed at 05:50:41; see `controls.json`.
- Bounded session-scratch `wo229-wrapper.mjs`: exit 0 at 05:52:53; the actual
  generated child wrapper reports only the injected failure message.

The full review and final document gates are separate handoff duties. Worker
judgments are static reviews and do not substitute for those executable rows.
