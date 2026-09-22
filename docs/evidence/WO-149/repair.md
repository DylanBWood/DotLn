# WO-149 repair — VER-001 findings

Dispatch: `resume: fix`, 2026-09-21, followed by the operator's scope expansion
to finish the complete repair. This record supersedes the implementation
report's deferral of the live row and its known configuration-root failure.
VER-001 and the historical implementation record remain unchanged.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

## Findings and repairs

1. **Live row:** [live-codex-dispatch.md](live-codex-dispatch.md) records a real
   Codex session invoking the actual `resume next` in an isolated WO-999 fixture,
   outside `npm test`. The record was absent immediately before the invocation
   and present afterward with the expected role, start time and empty adopted
   authorship. Repeating the command preserved its bytes. No manual begin was
   called. The row includes source-bound invocation evidence and measured entry
   and handoff counters from the launching Codex session, with its worktree and
   scope limitation stated explicitly. The reproducible recorder is
   [live-codex-dispatch.mjs](live-codex-dispatch.mjs); its private state and fixture
   location stay in ignored local storage. The current repair's actual
   `node scripts/harness.mjs usage "$CODEX_THREAD_ID"` also returns real counters
   after the `resume fix` session entry.
2. **Configuration-root:** current probe runs import the canonical `TOOL_ROOT`.
   Historical validation explicitly selects retained source bytes through
   `evaluate --harness-source <file>`; default evaluation still binds the current
   build. The 56,244-byte [original probe](wo138-probe-source.mjs.txt) is identical
   to the pre-repair committed source, SHA-256
   `3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907`, also bound by
   all 38 original episodes. No WO-138 evidence file changed. Tests reject the
   current build for historical episodes, changed retained source, and altered
   input, prompt, schema or build bindings. New/current evaluation retains its
   pre-existing current-build tests. The original independent audit is executed
   in an isolated historical layout by
   [historical-probe-check.mjs](historical-probe-check.mjs); the new CLI also
   reproduces the recorded results, excluding only `evaluatedAt`. This is an
   explicit historical evaluation, not a claim that the old episodes ran on the
   repaired source. Existing direct invocations of the historical audit must use
   that historical layout; running it against current source correctly rejects
   the changed build. Queue item `adjacent-0001` revision 2 is completed.
3. **No-session command:** `harness usage` catches only the strict primitive's
   missing-session error and returns null counters, source `unavailable` and
   cause `no-session`, with an advisory. It creates no session. The WO-149 fixture
   now invokes this actual CLI and builds its receipt assertion from the returned
   cause. Other errors still propagate; the strict primitive and Copilot branch
   remain unchanged.
4. **Unbuilt runtime:** admitted Codex dispatches explicitly report the missing
   runtime, `npm run build` recovery and `no-session` cause. The new unbuilt fixture
   verifies successful dispatch, the advisory and absent record; without a thread
   there is no Codex advisory. The security document describes both degraded paths.

The first complete review run also found a stale economy-support role oracle:
31 suites passed and `process-debt` failed, 526.82 s, 76 fresh tasks. D008 and
`adjacent-0002` repair it with a new `wo149-role-baseline.json` for current enabled
and disabled roles. All earlier baseline files remain unchanged and their chain
is checked. Disabling economy support must remove exactly its executor paragraph
apart from origin metadata; all other role prose remains identical. The focused
regression now passes (1/1, 340.89 ms). The full review selection is rerun on this
corrected test subject.

## Executed evidence

- WO-149 dispatch regressions: 2 passed, 0 failed, 657.71 ms.
- `npm test -- --only configuration-root`: 2 tasks passed, 0 failed, 3.24 s.
- Local-model probe suite: 13 passed, 0 failed, 2.63 s.
- Historical replay and unchanged audit: all 38 records validated; outcome remains
  `inconclusive`, qualifying tasks `["T2"]`; current-build evaluation refuses the
  historical set and explicit historical evaluation reproduces its result.
- Generated harness: 31 surfaces current. Authority and feedback evidence remain
  valid at selected revision 002. Publication: 273/273 headings, both locks current.
- Planning check passes after refreshing the decisions/follow-up projections.
  Local release preparation retains application v0.40.2 and skeleton 0.34.2.

Final complete review selection: `npm test -- --review` **32 passed, 0 failed,
525.88 s, 76 fresh tasks**. This includes the repaired process-debt,
configuration-root and local-runner suites, plus all product suites. The separate
`npm run test:docs` run passed **19/19, 26.68 s**. `git diff --check` is clean.
No criterion, test selection or guard was waived. The failed first run remains
recorded above; only the subsequent full passing run supports completion.

Both adjacent queue items are completed. D003's follow-up
`FUP-f219d99187db98b7` is settled with its historical-source validation and
reopening condition retained. The report and decisions were read at their
current bytes; generated indexes and the archived source are also covered by
their generation/hash and executable checks. All four VER-001 findings have
repair evidence. Goal-alignment outcome: Codex dispatch entry has an attributable
live row, the actual degraded command is truthful, and the review selection now
passes without changing historical evidence or requiring operator rescue.

## Process and decision limits

D007–D008 record the scope, comparison of alternatives, D003 reopening and the
corrected stale-hash assumption. D002 remains the sole economy experiment.
No agents or live inference children were launched in repair. The live fixture
uses this actual Codex session, with transcript identity and text kept private.
Entry process usage was unavailable (`session-counters-unavailable`); subsequent
reads return `codex-transcript-counter` values. Final usage belongs in the ignored
receipt and handoff response. Independent verification and final review remain
separate dispatches.
