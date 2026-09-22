# WO-155 — Single-source floor and a cold-start trend: the shared refusals paragraph is emitted once in the floor and each generated skill refers to it, harness-context reports every role's delta since the previous edition beside its ceiling, and no reviewed rule is trimmed (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A generator conditional, a reference
sentence, a measurement column and a regression; no rule text changes; the
skeleton component moves with the edition duty because the generated bundle
bytes change. Assigned at activation under the standing opt-out default.
**Cost:** adds one conditional in the contributor bundle generator, one
reference sentence per generated skill, a per-role delta beside the ceiling
in `harness-context --check` and the meter's drift row, the completeness
check that criterion 1 records, one regression, and, because
`packages/skeleton/src/loadouts/contributor.ts` and
`scripts/lib/harness-context.mjs` are registered evidence sources, one
edition re-mint with one live feedback self-host episode (WO-147 D010).
Removes 1,667 bytes from every role's cold start (measured 2026-09-22 at
`4bf626f4`: the paragraph beginning "DotLn has five refusals" is in
`CLAUDE.md` and once more in each of the six generated skills; for the
executor that is 6.8% of 24,412 bytes against a 24,576 ceiling, 164 bytes of
headroom), and the next acceptance record the next reviewed rule would
otherwise force. Wall-clock, tokens and context bytes of the order itself
are unknown until run.
**Nomination provenance:** REVIEW-002 finding ER2-003 (minor, measured,
survived REFUTATION-003, accepted 2026-09-22) and the filed packet
`cold-start-trend-and-single-source-floor`. WO-054 D006 reserved the
efficiency redesign of the ceiling route for the operator's later pass; this
order takes only the emission and the metric and leaves the route, the
ceilings and the acceptances as they are. Planner-synthesized in the
2026-09-22 REVIEW-002 pass, first as a boy-scout nomination on WO-100 and
then filed as an order when the operator directed that closed entries leave
the sequence; both dispatches are captured verbatim in ignored intake
(SHA-256 in the ledger section). Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-144 merged (the five-refusals paragraph and its
generator; closed, v0.33.0); WO-150 merged (the latest bundle regeneration
and its role-baseline oracle; closed, v0.39.0).
**Recommended placement:** paired with WO-156 directly after WO-153 and
WO-154 and before WO-111 and WO-114. It edits
`packages/skeleton/src/loadouts/contributor.ts`, the generated
`.claude/skills/*/SKILL.md` and `.agents/skills/*/SKILL.md`, the `CLAUDE.md`
harness block, `scripts/lib/harness-context.mjs`, `scripts/harness-context.mjs`,
the meter's drift row and their tests; WO-156 edits
`scripts/lib/plan-subject.mjs` and its test. The two share no file and
neither depends on the other; only this order re-mints the editions. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "the five-refusals paragraph this order emits once, and the generator that writes it"
  },
  {
    "workOrderId": "WO-150",
    "relation": "satisfied-by-close",
    "reason": "the latest bundle regeneration and the role-baseline oracle the regression extends"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/instance/entropy-reducer/runs/REVIEW-002.md` (ER2-003) and
`docs/instance/entropy-reducer/runs/REFUTATION-003.md` (the independent
measurement and the note that `--check` is inert in
`scripts/harness-context.mjs`);
`docs/proposals/cold-start-trend-and-single-source-floor/packet.json` (the
uncertainty about a skill read alone, the risks and the alternatives);
`packages/skeleton/src/loadouts/contributor.ts` (the harness block and the
skill bodies); `CLAUDE.md` lines 60–73 (the generated harness block);
`scripts/lib/harness-context.mjs` and `scripts/lib/process-budget.mjs`
(`measureColdStarts`: bytes are `CLAUDE.md` plus the role skill, compared
with `v0.16.0`); `docs/control/budgets.json` (`limits.coldStartBytes` and
the six acceptances dated 2026-09-17 to 2026-09-20);
`docs/evidence/WO-054/decisions.md` §WO-054-D006 and
`docs/evidence/WO-146/decisions.md` §WO-146-D008 (the acceptances and the
reserved efficiency pass); `docs/evidence/WO-146/` (how Copilot loads
`AGENTS.md` and `CLAUDE.md`); 07-execution-guide.md §Read order for a cold
start (the floor is loaded first; the role dispatch loads one skill) and
§Process budget.

**Objective:** Every supported harness reads the five-refusals paragraph
exactly once per session, from the floor, and each generated skill refers
to it by name instead of restating it; `harness-context --check` and
`npm run meta` report, per role, the bytes now, the ceiling, and the delta
since the previous edition and since the last acceptance; the ceilings, the
acceptance route and every reviewed rule are unchanged.

**Observed gap (dated 2026-09-22, `main` at `4bf626f4`):**

- `wc -c` over the paragraph gives 1,667 bytes; `grep -c -F` finds it once
  in each of `.claude/skills/dotln-{executor,verifier,reviewer,release-close,planner,refuter}/SKILL.md`
  and once in `CLAUDE.md`, so every role loads it twice.
- `harness-context --check` (the flag is inert; the same measurement
  prints) reports executor 24,412 of 24,576, verifier 21,365 of 25,151,
  reviewer 22,543 of 24,576, release-close 13,967 of 16,384, planner
  16,115 of 24,576, refuter 15,690 with no ceiling, against `v0.16.0`
  figures of 10,847, 8,232, 8,665, 6,107 and 5,455.
- `docs/control/budgets.json` holds six cold-start acceptances dated
  2026-09-17 to 2026-09-20, each raising a ceiling by one 4 KB step; the
  check has never refused anything and reports no trend.
- No decision record was found for repeating the paragraph in the skills
  (product 07 and the WO-135, WO-139 and WO-144 decisions searched on
  2026-09-22); whether a skill read without the floor must stay complete
  is unknown.

**Design (scope discipline):**

- First, the completeness check: enumerate every supported path that loads
  a generated skill (the Claude role dispatch, the Codex `AGENTS.md`
  symlink, the Copilot CLI per WO-146's evidence, and any fresh subagent
  or background worker a role text spawns) and record for each whether the
  floor is loaded before the skill, by observation, not by reading. If any
  supported path loads a skill alone, criterion 2 is recorded as declined
  with that observation, the paragraph stays, and the order closes on
  criteria 3 to 6.
- The generator emits the paragraph in the harness block only and writes
  one sentence in each skill naming the floor paragraph it relies on; the
  regression asserts the paragraph appears exactly once across `CLAUDE.md`
  plus any one skill and that each skill carries the reference sentence;
  the WO-150 role-baseline oracle gains this edition.
- `harness-context` reports per role: bytes, ceiling, previous-edition
  bytes and delta, and the delta since the last acceptance for that role;
  `npm run meta` prints the same row in the drift signal. The inert
  `--check` flag either does what its name says or is removed from the
  usage line, recorded as a decision.
- **Declined alternatives, recorded:** trimming any reviewed rule (the
  operator's 2026-09-17 direction); retiring the ceiling-plus-acceptance
  route (WO-054 D006 reserves it for the operator's pass; the packet's
  metric half is filed there); raising the ceilings once more (produces a
  seventh record without information).

**Deliverables:** the completeness check's record; the generator change and
the regenerated bundle; the regression; the measurement columns; the
re-minted editions with their live episode; the write-backs in criterion 6.

**Acceptance criteria (all required)**

1. The completeness check is recorded in the decisions with one observed
   row per supported skill-loading path; if any row shows a skill loaded
   without the floor, criterion 2 is recorded as declined with that row
   and the reopening observation.
2. Unless declined under criterion 1: the regenerated bundle carries the
   paragraph once, in the floor; each skill refers to it; the regression
   fails with the paragraph restored to a skill; both generated roots are
   byte-identical to the generator's output.
3. `harness-context` and `npm run meta` report per role the bytes,
   ceiling, previous-edition delta and delta since the last acceptance;
   the ceilings and acceptances in `docs/control/budgets.json` are
   unchanged; the `--check` flag's behavior matches its usage line.
4. The measured cold-start bytes per role before and after are recorded
   in the decisions (the executor's expected figure is about 22,745 of
   24,576).
5. The skeleton component moves; the authority and feedback editions are
   re-minted with one live self-host episode and the reason each changed.
6. `npm test` green; `git diff --check` clean; no new dependency; the
   regression's effect on the gate step count reported; the decisions
   record sources and reopening conditions.

**Evidence gate:** the completeness check's observations; the regression
transcript; the measurement before and after; the edition re-mint record;
`npm test` once at final review.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** trimming, rewording or moving any reviewed rule; retiring or
changing the ceiling-plus-acceptance route or any ceiling; other repeated
text in the bundle (only the measured paragraph is in scope); token
measurement (bytes are the recorded metric).

**Operator-review assumptions**

1. Emitting a rule once in the floor that every supported harness loads
   first does not weaken the floor; if criterion 1 finds a path that reads
   a skill alone, the paragraph stays and the order still delivers the
   metric.
2. Activating this order authorizes one live self-host episode for the
   re-mint.
