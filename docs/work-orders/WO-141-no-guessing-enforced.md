# WO-141 — No guessing, enforced: the handoff carries the session's observed facts, a hedged number or duration in a handoff is refused unless it is bound to an observation or written as unknown, and operator corrections are counted from the journal instead of self-report (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. The generated Stop hook's check, the
briefing, the meter's correction counter, the regenerated bundle and
fixtures. Assigned at activation under the standing opt-out default.
**Cost:** removes operator corrections of unmeasured claims: on 2026-09-17
the planner reported a background review as dispatched "roughly 10 minutes
ago" while the session's own files held the dispatch time (14:06) and the
clock (14:32), and the operator caught it; the 2026-09-16 defect register
counted nine operator corrections in one session (items 7 and 13), and the
meter's `operatorCorrections` reads decision records, which is self-report.
Adds one Stop-hook scan of the final message (under 100 ms), one observed
facts block in the briefing and the Stop advisory, one journal-derived
counter and fixtures; one more hard refusal in the hook boundary; no new
receipt, key or ritual.

**Nomination provenance:** the operator's direction of 2026-09-17 during
the vision-into-use planning dispatch, after catching the guess: "that
needs to be the next work order, full stop" (captured verbatim in ignored
intake; hash in the [pass](../planning/vision-into-use-2026-09-17.md)
header); WO-049 D001, which put the no-guessing line into the shared
instruction as prose on 2026-09-16 and which this observation shows is not
enforcement; register items 7 and 13. Planner-synthesized draft.
Clean-room screen: no stop condition.

**Depends on:** WO-133 merged (the built runtime follows `main`; closed);
WO-131 merged (the Stop hook and hook-input decoding; closed).

**Recommended placement:** first, pair 1 beside WO-136, by the operator's
direction. It edits the harness host's Stop path, the briefing and the
meter; WO-139 (pair 3) and WO-140 (pair 5) edit adjacent surfaces later
and take the refusal count at their own landing. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-133",
    "relation": "satisfied-by-close",
    "reason": "the built runtime follows main after a fast-forward"
  },
  {
    "workOrderId": "WO-131",
    "relation": "satisfied-by-close",
    "reason": "the Stop hook path and hook-input decoding"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/harness-host.ts`
(the Stop path, `transcript_path` and `stop_hook_active` in the hook
input, the `correction:` event ids of the typed-correction unit);
`packages/skeleton/src/loadouts/contributor.ts` line "Never guess";
`scripts/lib/meta.mjs` (`operatorCorrections` derived from decision
records); `scripts/resume.mjs` (the briefing); `node scripts/harness.mjs
usage`; `docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary;
07-execution-guide.md §Discipline; `docs/planning/work-order-map.md`
§Candidates — release-close and planning-dispatch defects, items 7 and 13.

**Objective:** three mechanisms, one rule. (a) Observed facts at the
handoff: the briefing and the Stop advisory print, from the session journal
and the clock, the dispatch time and elapsed time of every background task
the session started, the duration of every gate row, the usage counters
with their source, and the current time, so a report can cite them without
estimating. (b) The refusal: the Stop hook reads the final assistant message
from `transcript_path`; a number or duration attached to an estimate marker
(roughly, about, approximately, around, probably, I think, should be, `~`)
is refused with the observed value when the journal holds one for that
quantity, and refused with "measure it or write `unknown`" when it does
not; a message that states the observed value, or writes `unknown`,
`untested` or `blocked` for what it did not observe, passes; quoted text
and fenced code are exempt; the refusal is hard, by the operator's
direction. (c) The counter: `operatorCorrections` is derived from the
journal — typed corrections recorded by the existing correction unit plus
the refusals of (b) — and never from decision records; the meter's
shifting-the-burden row reads it. In Codex, no Stop hook fires: (a) prints
in the `resume` briefing and the lifecycle commands, (b) is role text, and
(c) counts typed corrections only; the order records that difference.

**Observed gap (dated 2026-09-17, `main` at `ec502c9`):**

- The shared instruction says "Never guess: an unobserved value is
  `unknown`, `untested` or `blocked`" (WO-049 D001) and a planner reported
  an estimated elapsed time on the same day while the observed value was
  one command away; prose did not enforce it.
- The meter's `operatorCorrections` is computed from decision records
  (`scripts/lib/meta.mjs`), so every supplied row reads 0 while the register
  records nine corrections in one session.
- The Stop hook already receives `transcript_path` and re-enters with
  `stop_hook_active`; nothing reads the final message.

**Design (scope discipline):**

- (a) reads only the session's own journal and gate rows; it adds no new
  observation source.
- (b) is lexical: a marker within one clause of a number, a duration unit
  or a clock time. It does not judge truth; it refuses a hedge where a
  measurement or `unknown` belongs. Refusing inside fenced code or a quoted
  line is excluded to keep evidence citations intact. On re-entry
  (`stop_hook_active`) the scan runs once more and does not loop.
- (c) reuses the typed-correction unit's events; a refusal of (b) is
  journaled with the quantity, the observed value and the phrase.
- **Declined alternatives, recorded:** another prose line (the failure
  mode this order answers); a semantic truth checker (not buildable
  honestly); refusing every number in a handoff (evidence citations are
  numbers); a Codex Stop hook (none fires).

**Deliverables:** the observed-facts block; the Stop-hook scan and its
refusal; the journal-derived counter; fixtures; the regenerated bundle and
manifest; the write-backs below.

**Acceptance criteria (all required)**

1. The briefing and the Stop advisory print the observed-facts block from a
   fixture journal: background task dispatch times and elapsed, gate
   durations, usage counters with source, the clock; a missing counter
   prints `unknown` with its cause code.
2. A final message containing "roughly 10 minutes ago" for a task whose
   journal dispatch time is known is refused with the observed elapsed
   value; the same message with no journal value is refused with "measure
   it or write `unknown`"; a message stating the observed value passes; a
   message writing `unknown` for the quantity passes; the phrase inside a
   fenced code block or a quoted line is not refused; a second Stop after a
   refusal does not loop. Fixtures cover each case, including this
   session's sentence.
3. `operatorCorrections` in the meter is derived from journaled typed
   corrections and (b)'s refusals; the decision-record derivation is
   removed; a fixture journal with two corrections and one refusal yields 3
   and the trap row shows it.
4. In Codex, the briefing prints (a), the role text carries (b), and the
   counter reads typed corrections; the decisions record states the
   difference.
5. 07 §Discipline records the mechanism beside the no-guessing line; the
   security runbook's hook-boundary section records the refusal with its
   source and the count of hard refusals at landing; the compiled bundle
   and manifest regenerate and `harness check` passes.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** semantic truth checking; refusing unhedged numbers; a Codex
Stop hook; changing the two existing refusals or WO-135's and WO-139's;
any change to the shared instruction's wording.

**Operator-review assumptions**

1. The operator accepts a hard refusal of hedged numbers and durations in a
   handoff, with the cost that a legitimate estimate must be written as
   `unknown` or measured.
2. The counter counts what the journal can see; a correction the operator
   gives without the typed form and without a refused hedge is not counted,
   and the order says so.
