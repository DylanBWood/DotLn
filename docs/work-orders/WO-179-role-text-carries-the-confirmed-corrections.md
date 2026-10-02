# WO-179 — Role text carries the corrections the survey confirmed: the shared Contributor text and the lifecycle briefings gain the ten rules WO-172's subject map traced to repeated operator interventions, the verifier consumes the executor's gate row instead of rerunning it, and the release-close and executor roles learn the handoff of scratch material and the report of a blocker or a host denial (v0.63.1)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Role text and briefing sentences,
one verifier procedure line removed, one completion check on a claim
that names a gate; no control-event schema, no refusal of a completion
beyond WO-173's existing claim check. Assigned at activation under the
standing opt-out default.
**Cost:** adds to `packages/skeleton/src/loadouts/contributor.ts` at most
twelve sentences (about 1.6 KB in the shared text and 300 bytes in the
release-close and executor roles), each traced to a theme and its
episodes; to `scripts/resume.mjs` two briefing sentences and one claim
check at `verification-result`; to product 07 §Discipline two sentences
in place; dated cold-start acceptances in `docs/control/budgets.json`
under the standing 2026-09-17 route where a ceiling is met (executor
25,150 of 29,246; verifier 21,055 of 25,151; reviewer 24,788 of 28,884;
release-close and planner under their ceilings at `b51a58a8`, measured
in each root). Removes: the verifier's full product-gate rerun at an
identity already green (three runs per order by procedure: 12 of the 40
rows since WO-173 closed were repeats, 5 to 11 minutes each); the
recurring interventions WO-172 traced to these rules (themes 2, 3, 7, 9,
15, 16, 18, 19, 20, 21, 26 and 29: 130 episodes across 2026-08-31 to
2026-09-28, four themes with episodes after their fixing order's final
review). Re-mints: `contributor.ts` is a registered evidence source, so
the editions it stales (the harness bundle among them) are re-minted
deterministically and `npm test -- --review` runs before handoff;
`scripts/resume.mjs` is a declared machinery source and not a registered
one; no judged feedback source changes, so no live episode. Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's messages of 2026-09-30 (WO-172
should have given the pass a trove of places to improve; items 1 and 3:
a release close that stopped and then decided alone, a denied publish
not retried), captured in ignored intake (SHA-256 in the ledger
section); WO-172's subject map ([intervention-subjects.md](../evidence/WO-172/intervention-subjects.md)),
whose next steps for these themes are the executor's reading the
operator accepted as good for now on 2026-09-29 (D022); register rows
FUP-3bb4dea9dde2a392 and FUP-1f47fd50acc97814 (waits), FUP-6332681e9500a84b
(provider refusals), FUP-9a23fe23cbf08958 and FUP-5f58198706dfa59e (whose
recurrence conditions the map records as met), FUP-b053a956adb84b6a
(the verdict rule, tested by this pass), FUP-bf614feaea90cac3 (an
ideation capture aimed outside the worktree, settled by product 07's
edit in this pass). Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: the sentences are rules in the
repository's words; episode ids, never message text; no stop condition.
**Depends on:** WO-173 merged (the briefing sentences this order
reconciles; closed, v0.53.2); WO-172 merged (the survey; closed,
v0.56.2).
**Recommended placement:** paired with WO-061 in the sixth slot, the
machinery lane beside the StoryContract compile (disjoint: WO-061 edits
the compiler). This order edits `packages/skeleton/src/loadouts/contributor.ts`,
`scripts/resume.mjs`, product 07 and `docs/control/budgets.json`. This
order and WO-178 both regenerate the harness bundle; they sit in
different pairs and the later integration re-mints once more,
deterministically. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-173",
    "relation": "satisfied-by-close",
    "reason": "the verify and repair briefing sentences this order reconciles"
  },
  {
    "workOrderId": "WO-172",
    "relation": "satisfied-by-close",
    "reason": "the survey and its subject map"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/loadouts/contributor.ts`
(the common text; the verifier role's `productGate` line; the
release-close and executor roles; the evidence/completion text);
`packages/skeleton/src/loadouts/executor-supports.ts` (Intent to Act);
`scripts/resume.mjs` (`ledgerBriefing`, `verifySentence`,
`repairSentence`, `offRampSentence`; `verification-result`;
`requireGateClaims`); `scripts/lib/handoff-ledger.mjs` (the claim
check WO-173 added); `docs/control/budgets.json` (`coldStartBytes`
and the acceptances); product 07 §Discipline (Adjacent Repair; the
five refusals), §Goal-aligned decisions, §Model-specific notes and
§Operator-opened planning pass (the rules this pass wrote);
`docs/evidence/WO-172/intervention-subjects.md` themes 2, 3, 7, 9, 15,
16, 18, 19, 20, 21, 26, 29; `docs/evidence/WO-116/decisions.md` D013
and D016 (the wait trial); `docs/evidence/WO-172/decisions.md` D010,
D023; the 2026-09-25 planning document §9 (the wait rule's NoOp);
`docs/planning/followups.md`.

**Objective:** the rules the operator had to give more than once are in
the text every role reads at cold start, in words that name the
behavior, with the episodes that earned them; a verifier spends its
time judging, not rerunning a gate the executor's handoff already
recorded green at the same identity; and the two roles that met items 1
and 3 know what to do at a blocker or a denial.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. The survey's 30 themes hold 303 episodes in which the operator
   corrected a role or told it to record a failure; twelve themes end in
   a next step that is one shared sentence or one briefing line, and
   none has been written (the map's coverage column: partial or
   candidate). Four of them recorded episodes after their fixing order's
   final review (themes 4, 6, 16, 27 in the map's count; theme 2 and
   theme 16 recurred on 2026-09-29 in the release close item 1 reports).
2. The verifier role text requires the product gate (`contributor.ts`,
   the `productGate` entry of the verifier procedure); the executor's
   handoff already records a passing row by code identity and the final
   review consumes it. Twelve of the forty `npm test` rows since WO-173
   closed are fresh repeats at an identity already green.
3. `verifySentence` says a defect outside the declared criteria is
   boarded, not failed; the operator's 2026-09-25 permission to fail an
   order for a repairable defect (theme 15, E0911) is not reconciled
   with it, and product 07's Adjacent Repair rule does not state the
   boundary.
4. The verify and final-review briefings carry WO-173's sentences and
   nothing on a question not being a waiver (theme 19, E0974: a verifier
   halted when asked about its workflow) or on a criterion judged met
   that names a gate needing that gate's row (theme 21, E0836: a pass
   recorded before the document gate).
5. The release-close role says "report refusals; never force teardown"
   and nothing about a blocker's remedy or a host denial; the executor
   role says nothing about declaring the scratch repositories it makes
   (WO-176 gives the executor the command).

**Design (scope discipline):** the sentences, each one line, each with
its theme in the decision record and none in the sentence itself:

- (2) A role settles a routine question itself, a version, a waiver
  route, a live episode, a regeneration, a reinstall, before asking; it
  asks when the answer changes scope or authority.
- (3) Before acting on an operator message, a role states its reading of
  the aim in one line and acts on that reading; a doubtful reading asks
  one question (the Intent to Act announcement extended from the
  executor to the planner, verifier and reviewer).
- (4) A claim of cause, blocker, unreachable service or finished work
  names the command and output it rests on, and a claim from a partial
  search names the boundary it searched (FUP-5f58198706dfa59e, whose
  recurrence the map records; WO-087 D009 in this pass's window).
- (7) Authority a step needs is requested in the session through the
  host flow; a command is never handed to the operator to run in the
  role's place, except where an order or the role text names the
  fallback.
- (9) A command given to the operator is copy-paste runnable with real
  paths and no placeholders; a question states what it decides and why.
- (16) A wait on a gate or a background task runs `evidence --wait` in
  the background or the host's own completion signal, then does bounded
  listed work or stays quiet; never polling, never narrating (the
  utilization candidate FUP-3bb4dea9dde2a392 and the trial WO-116 D016
  recorded).
- (18) The verifier consumes the executor's recorded `npm test` row when
  its code identity equals the subject's and runs the gate only to
  reproduce a finding or when the identity differs, stating which; the
  `productGate` procedure entry is removed.
- (19) In the verify and final-review briefings: a question, complaint
  or stale message from the operator is not an instruction to stop,
  narrow or widen the work; only an explicit pause, stop or scope prefix
  changes it.
- (20) A role stops the background monitors it started before recording
  its result (beside WO-178's Stop advisory that names any still
  running).
- (21) At `verification-result`, a criterion judged met that names
  `npm test` or `npm run test:docs` needs that gate's passing row at the
  subject or an inline run, by WO-173's claim check; otherwise the
  completion refuses with the criterion named.
- (26) `unknown` is written only after naming the readable source tried;
  an unfiled report is corrected in place, never appended to.
- (29) After a second consecutive provider safeguard refusal a role
  stops retrying, records the stop as a decision naming phase and model,
  and resumes in a fresh session (FUP-6332681e9500a84b).
- (14) A stale gate row is answered by running the gate at the current
  identity, never by restoring bytes so the recorded identity matches
  again; a reviewed fix is never removed to pass a check
  (FUP-a815e8862796c2e1, whose second attempt the map records at E0876).
- (15) The verify sentence and product 07's Adjacent Repair rule state
  the boundary: a repairable defect met inside the order's declared
  surfaces is fixed in the order (Adjacent Repair) and may fail a
  criterion it breaks; a defect outside the declared criteria and
  surfaces is boarded with its reproduction.
- Release-close: a cleanup blocker or a host denial is reported once with
  the exact command for the operator (WO-176's `--material` flag; the
  `!` prefix or the `/permissions` retry for a denial), the session
  finishes what remains without repeating a publication, and it never
  moves, copies, deletes or preserves material by its own decision.
  Executor: declare each scratch repository the order creates with
  `worktree material` before completion.

Ceilings: measure each root after regeneration; where a reviewed rule
meets a ceiling, record the acceptance under the standing route
(measured bytes plus one 4,096-byte step, the rules named) in the same
change, never trimming a reviewed rule.

**Declined alternatives, recorded:** a sentence per theme regardless of
whether the theme recurred (only themes whose next step is a rule enter);
putting the rules in product 07 alone (a role reads its skill at cold
start; the guide is read by section); removing the verifier's gate run
entirely (it runs to reproduce a finding or on a changed identity);
refusing a handoff whose gate is red (the 2026-09-28 NoOp holds).

**Deliverables:** the sentences in `contributor.ts` and the regenerated
roots; the briefing sentences and the claim check in `scripts/resume.mjs`;
product 07 §Discipline; the acceptances; the decisions naming each
sentence's theme and episodes.

**Acceptance criteria (all required)**

1. Each generated role root (`.claude/skills/dotln-*/SKILL.md` and its
   `.agents` twin) carries the sentences the design assigns to it, and
   the verifier root no longer names the product gate as a procedure
   step; `npm run harness -- check` is green.
2. The verify and final-review briefings printed by `npm run resume --
   verify` and `final-review` carry the question-is-not-a-waiver
   sentence and the reconciled boundary sentence; a fixture asserts both.
3. `verification-result pass` with a report whose met criterion names
   `npm test` and no passing row at the subject refuses and names the
   criterion; with the row it records; a fixture covers both and fails
   against `b51a58a8` for the first.
4. Cold-start bytes of every role root are measured after regeneration
   and recorded in the decisions; each ceiling met has a dated acceptance
   in `docs/control/budgets.json` with the rules named; `npm run meta`
   is green.
5. Write-backs: product 07 §Discipline, the Adjacent Repair rule and the
   boundary sentence in place within 400 bytes; `docs/evidence/WO-179/decisions.md`
   with a row per sentence naming its theme and episode ids; the
   decisions index; the register rows the provenance names retargeted at
   close.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 2 and 3; `npm test -- --review`
before `implementation-ready`, because `contributor.ts` and
`scripts/resume.mjs` are declared machinery sources; the editions
`contributor.ts` stales re-minted deterministically; no live row.

**Write-back duty:** product 07, in place; the order's decisions with
sources and reopening conditions; the register rows.

**Non-goals:** a classifier or instrument (WO-178); any refusal beyond
the claim check at `verification-result`; changing what a verifier may
fail; the Codex compaction adapter; the themes whose next step is a
count or a check (WO-178) or a fix landed elsewhere (themes 5, 12, 17,
24, 25, 28); the operator's classes for interventions (WO-178 carries
D018's list).

**Operator-review assumptions**

1. The verifier's independent judgment does not require rerunning the
   product gate at an identity the executor's handoff already recorded
   green; the row is evidence, and a changed identity or a finding to
   reproduce still runs it.
2. The survey's next steps, which the operator accepted as good for now,
   are the rules to write; the operator may strike or reword any at
   review, and the decision record names each one's episodes so the
   strike is precise.
3. Cold-start ceilings yield to reviewed rules under the standing
   2026-09-17 route; the acceptances are recorded, not argued around.
