# WO-141 — No guessing, enforced without gating the operator: the session's observed facts are always in front of the agent, a hedged number or duration that slips into a handoff is journaled and corrected as an advisory that never holds a turn, and operator corrections are counted from the journal instead of self-report (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. The generated hooks' observed-facts
block and advisory scan, the briefing, the meter's correction counter, the
regenerated bundle and fixtures; no new refusal. Assigned at activation
under the standing opt-out default.
**Cost:** removes operator corrections of unmeasured claims: on 2026-09-17
the planner reported a background review as dispatched "roughly 10 minutes
ago" while the session's own files held the dispatch time (14:06) and the
clock (14:32), and the operator caught it; the 2026-09-16 defect register
counted nine operator corrections in one session (items 7 and 13), and the
meter's `operatorCorrections` reads decision records, which is self-report.
Adds one observed-facts block in the briefing, the prompt-submit context
and the Stop advisory, one advisory scan of the final message (under
100 ms), one journal-derived counter and fixtures; no refusal, no held
turn, no new receipt, key or ritual. The operator's direction is explicit:
the mechanism removes the guess, it does not gate responses.

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

**Objective:** three mechanisms, one rule, and no gate on the operator. (a)
Observed facts before the agent speaks: the briefing, the prompt-submit
hook's additional context and the Stop advisory print, from the session
journal and the clock, the dispatch time and elapsed time of every
background task the session started, the state of each, the duration of
every gate row, the usage counters with their source, and the current
time, so the agent has the value and nothing to estimate. (b) The
advisory: the Stop hook reads the final assistant message from
`transcript_path`; a number or duration attached to an estimate marker
(roughly, about, approximately, around, probably, I think, should be, `~`)
is journaled with the observed value when the journal holds one for that
quantity, or with "unmeasured" when it does not, and the observed value is
shown to the agent once as advisory context at the next boundary so the
next message states it; the turn is never held, nothing is refused, and no
re-entry loop exists; quoted text and fenced code are exempt. (c) The
counter: `operatorCorrections` is derived from the journal — typed
corrections recorded by the existing correction unit plus the journaled
hedges of (b) — and never from decision records; the meter's
shifting-the-burden row reads it per order, so a session that guesses is
visible in the meter and the process-debt track. (d) The four judgment units the operator names as standard for every
phase — never guess, accuracy over sycophancy, anti-oscillation, and the ban
on over-literal or malicious compliance — are compiled prose in every role's
cold start (`correctness-over-sycophancy`, `anti-oscillation`,
`fail-conservative-correction` and the no-guessing line in the Contributor
loadout) and the operator's repeated observation is that they are not
applied. Prose is not application, so this order measures application: a
journaled correction or hedge names the phase, the order and, when the
operator or the agent names one, the unit it violated; the meter's
shifting-the-burden row shows corrections per phase and unit; and the
process-debt track reads that row, so a phase that keeps failing a unit is
repaired from observation instead of from another prose line. This
discharges FUP-0130's deferral (WO-126 D003: the support-behavior repair
waits for observed operation), whose reopening condition this session met.
In Codex, no hook fires: (a) prints in the `resume` briefing and the
lifecycle commands, (b) runs as the same scan inside the lifecycle
commands' handoff output, and (c) and (d) count typed corrections and those
scans; the order records that difference.

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
- The judgment units are loaded as prose in every role (the skill header
  of the 2026-09-17 planning session lists them) and the same session
  over-literalized one direction, reversed it, and estimated a value it
  held; the operator recorded that these units are repeatedly mentioned and
  not applied. Nothing measures their application per phase.

**Design (scope discipline):**

- (a) reads only the session's own journal and gate rows; it adds no new
  observation source.
- (b) is lexical: a marker within one clause of a number, a duration unit
  or a clock time. It does not judge truth; it records a hedge where a
  measurement or `unknown` belongs and puts the measurement in front of the
  agent. It never blocks: WO-132 stood the blocking Stop hooks down because
  they held the operator's turns, and the operator's 2026-09-17 direction
  repeats that a gate on responses is the wrong shape. Fenced code and
  quoted lines are excluded to keep evidence citations intact.
- (c) reuses the typed-correction unit's events; a refusal of (b) is
  journaled with the quantity, the observed value and the phrase.
- **Declined alternatives, recorded:** another prose line (the failure
  mode this order answers); a semantic truth checker (not buildable
  honestly); a hard Stop refusal of hedged numbers (proposed first and
  withdrawn on the operator's direction: it gates the operator's turns,
  the WO-126 pattern WO-132 removed); refusing every number in a handoff
  (evidence citations are numbers); a Codex Stop hook (none fires).

**Deliverables:** the observed-facts block in the three places; the
advisory scan and its journal row; the journal-derived counter; fixtures;
the regenerated bundle and manifest; the write-backs below.

**Acceptance criteria (all required)**

1. The briefing, the prompt-submit context and the Stop advisory print the
   observed-facts block from a fixture journal: background task dispatch
   times, states and elapsed, gate durations, usage counters with source,
   the clock; a missing counter prints `unknown` with its cause code.
2. A final message containing "roughly 10 minutes ago" for a task whose
   journal dispatch time is known is journaled with the observed elapsed
   value and the value appears as advisory context at the next boundary;
   the same message with no journal value is journaled as unmeasured; a
   message stating the observed value or writing `unknown` for the
   quantity journals nothing; the phrase inside a fenced code block or a
   quoted line journals nothing; in every case the Stop hook returns
   without blocking and no re-entry occurs. Fixtures cover each case,
   including this session's sentence.
3. `operatorCorrections` in the meter is derived from journaled typed
   corrections and (b)'s hedge rows; the decision-record derivation is
   removed; each row carries the phase, the order and the unit when one is
   named; a fixture journal with two corrections and one hedge yields 3 and
   the trap row shows it per order, per phase and per unit.
4. In Codex, the briefing and the lifecycle commands print (a) and run (b)
   in their handoff output, and the counter reads typed corrections and
   those scans; the decisions record states the difference.
5. 07 §Discipline records the mechanism beside the no-guessing line, names
   the four units it measures and states that it holds no turn; FUP-0130
   is disposed as allocated to this order; the security runbook's hook-boundary
   section is unchanged (no refusal is added); the compiled bundle and
   manifest regenerate and `harness check` passes.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** semantic truth checking; any refusal or held turn; a Codex
Stop hook; changing the existing refusals or WO-135's and WO-139's; any
change to the four units' wording (they are already standard; this order
measures their application); a classifier of the operator's tone.

**Operator-review assumptions**

1. The operator accepts that the mechanism prevents by supplying facts and
   corrects by advisory, and that it never holds a turn; a hedge the agent
   repeats after the advisory is a visible meter row, not a refusal.
2. The counter counts what the journal can see; a correction the operator
   gives without the typed form and without a journaled hedge is not
   counted, and the order says so.
