# WO-187 — Verification attacks the change and reviews the implementation; the executor self-reviews first; what final review still finds is counted (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. Role text for two roles, one section the
verifier reads on demand, one briefing addition, one generated agent
definition, one finding class on the final-review report and its count;
no lifecycle phase and no new refusal.
**Cost:** replaces the verifier's duty sentence in
`packages/skeleton/src/loadouts/contributor.ts` with one that names
three duties and cites a section, adds a read directive for that
section and one executor sentence; the duties' detail and a lens catalog
in product 07, read at verify time and not at cold start; the
order's known issues and carry-ins in the verify briefing
(`scripts/resume.mjs`); a `class` on each final-review finding line
(`escape`, `integration`, `new-scope`) read at `final-review-result` and
counted by `plan failures` and `plan start`
(`scripts/lib/plan-failures.mjs`); a `self-review:` line in the
executor's handoff; one generated agent definition for spawned workers,
carrying the pinned model and effort, emitted with the harness bundle
(`packages/compiler/src/harness.ts`). Removes: defects that were already in the verified
subject and were first met at final review (14 of the 18 blocking
findings in the record; 71 boarded items and 21 reviewer self-fixes at
the passing reviews of the last 40 orders), and with each failed final
review a median 1.8 h to the passing one. Verification will take longer
(median 842 s after WO-173; by how much is unknown until run) and each
executor completion pays one sub-agent. Re-mints: `contributor.ts` and
`packages/compiler/src/harness.ts` are registered evidence sources (the
second in all five editions), so the editions they stale, the harness
bundle among them, are re-minted deterministically; `contributor.ts` and
`scripts/resume.mjs` are declared machinery sources, so
`npm test -- --review` runs before handoff; no file the feedback verifier
judges changes, so no live episode. Cold-start bytes: the verifier root has 363 bytes of headroom (24,788
of 25,151) and the executor 956; the change fits both ceilings as they
stand, and what does not fit moves to the section read at verify time
(criterion 6).
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, item 6
(captured in ignored intake; SHA-256 in the ledger section of that
date); the 2026-10-02 planning pass's reading of all thirteen failed
final reviews, the last 40 verification reports and the role text
([planning document](../planning/standard-pass-2026-10-02.md) §3);
register rows FUP-19cd701c25446383 (recurring review of implementation
alternatives), FUP-e62d0d2771185a38 (WO-065 D008, useful delegation),
FUP-ee5190faadaeffa0 (which judge), FUP-b053a956adb84b6a (the verdict
rule) and FUP-96206434a50cd6f9 (effort per spawned agent, whose
reopening condition occurred: the host documents a per-agent effort,
read 2026-10-02, and this pass's root at `max` spawned its workers at
`max`). Planner-synthesized. Opaque identifier, not a priority.
Clean-room screen: rules in the repository's words; no stop condition.
**Depends on:** WO-179 merged (the verifier consumes the executor's gate
row; the in-surface defect rule; closed, v0.63.1); WO-173 merged (the
handoff ledger; closed, v0.53.2); WO-172 merged (`plan failures`;
closed, v0.56.2).
**Recommended placement:** the machinery lane of the third pair, beside
WO-112, after WO-186. This order edits
`packages/skeleton/src/loadouts/contributor.ts`,
`packages/compiler/src/harness.ts`, `scripts/resume.mjs`,
`scripts/lib/plan-failures.mjs`, `scripts/lib/handoff-ledger.mjs`,
product 07 and `docs/PLAYBOOK.md`; WO-112 writes documents and
evidence only. WO-188 edits `contributor.ts` after this order, and
WO-073, WO-075 and WO-076 edit `harness.ts` later. A recommendation,
not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-179",
    "relation": "satisfied-by-close",
    "reason": "the gate-row rule and the in-surface defect rule this order builds on"
  },
  {
    "workOrderId": "WO-173",
    "relation": "satisfied-by-close",
    "reason": "the handoff ledger the self-review line joins"
  },
  {
    "workOrderId": "WO-172",
    "relation": "satisfied-by-close",
    "reason": "plan failures, which gains the escape count"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/loadouts/contributor.ts`
(the verifier, executor and reviewer procedures); `scripts/resume.mjs`
(`ledgerBriefing`, `verifySentence`, `verification-result`,
`final-review-result`); `scripts/lib/handoff-ledger.mjs`;
`scripts/lib/plan-failures.mjs`; product 07 §Goal-aligned decisions (the
platform lens), §Discipline (Adjacent Repair and the boundary sentence)
and §Independent workflows and integration; `docs/PLAYBOOK.md` (what the
verifier and the reviewer are fed); the reports named in the observed
gap; the [2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§3.

**Objective:** A defect that sits in the subject a verifier judges is
found by that verifier. Verification is the pull-request review and the
attack; final review is acceptance of an integrated, releasable order
and rarely finds something new. When it does, the record says so as a
count the next planning pass reads.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- Thirteen final reviews have failed, one per order, on eighteen
  blocking findings. Fourteen of the eighteen were already in the
  subject the last passing verification judged. In eight the verifier
  had examined the area and probed it too narrowly (WO-059: the kill
  path only with a correct record; WO-144: only from the worktree root
  and only with programs inside the declared list; WO-158: one prefix
  token, never two; WO-178: the fixture's layout, not the corpus's; WO-139:
  a check that was itself blind to the omission). In six it never ran
  the check (four machinery suites selected only by `npm test --
  --review`; two release-surface rules).
- How the reviewer found those fourteen: its own review gate (4), a gate
  timeout (1), its own probes (5), an adversarial sub-agent (2), the
  release-surface check (2). Three reviewers wrote that their own
  reading had passed over the defect the sub-agent found.
- The rate is flat by week (8%, 11%, 10% of first final reviews since
  2026-09-14). 2026-10-01 was the outlier: three of twelve first final
  reviews failed while one of twelve first verifications did (23 of 30
  over the six days before).
- Passing final reviews also find things: 33 of the last 40 orders had
  items boarded or fixed by the reviewer (about 71 boarded in 27 orders,
  21 self-fixes in 12).
- The verifier's written duty is one sentence: judge the order against
  its acceptance criteria, reproducing consequential claims and
  checking earlier findings. Nothing asks it to review the
  implementation, to attack it, or to propose anything. Of the 40 most
  recent verification reports, 39 ran probes of their own and 37 ran
  adversarial or evidence-integrity checks, so verifiers do more than
  rerun tests; 3 said anything about design or maintainability, and no
  report uses the words simpler or maintainable.
- The executor's role text has no self-review step. Where an executor
  ran one unprompted it paid: WO-158's own adversarial pass fixed fifteen
  defects before handoff.
- Re-verification after a repair carries untouched criteria forward
  without re-deriving them; WO-158's failing defect entered with a
  repair.
- The reviewer is fed duties the verifier is not: receipt known issues
  and catalog carry-ins surfaced first at final review in eight recent
  orders (WO-059, WO-164, WO-174, WO-175, WO-176, WO-180 among them).
- On 2026-10-01 two verifiers read the instruction not to rerun the
  product gate as an instruction to run no further checks.

**Design (scope discipline):**

- **The root stays small.** The verifier's one duty sentence is
  replaced, not added to: it names the three duties below and the
  section that holds them, and a read directive loads that section when
  the role is dispatched. The variation axes, the review's questions,
  the three routes, the re-verification rule and the lens catalog live
  in that section of product 07. The executor root gains one sentence.
- **Verifier, in this order.** (a) *Attack the change.* For each
  criterion, vary what the executor's fixtures held constant and say
  which variations were tried and which do not apply: the state of the
  input or record (empty, forged, stale), the directory the command runs
  from, a member outside the declared list or vocabulary, a second or
  repeated token, the real corpus in place of the fixture, and the path
  a repair introduced. (b) *Review the implementation as a pull-request
  reviewer.* Read the whole diff: correct beyond the criteria, the
  simpler alternative if one exists, what a maintainer will not
  understand in six months, fit with the repository's principles and the
  platform lens. (c) *Have one fresh adversary read the order and the
  diff and nothing else*, where the harness can spawn one, and judge its
  findings yourself. Each finding takes one route: `blocking` (a defect
  in the order's declared surfaces; the verdict fails), `follow-up`
  (boarded with its reproduction) or `operator` (a choice only the
  operator can make, written as a decision packet in the report).
- **Re-verification** re-derives every criterion whose surfaces the
  repair's diff touches and attacks the repair itself.
- **The gate sentence is completed:** consuming the executor's gate row
  limits reruns of the product gate; it never limits a probe.
- **Lenses are chosen, not all run.** A short catalog in product 07
  names them with the question each asks (correctness and tests;
  design and coupling; platform fit; operator flow; authority and
  private data; the maintainer in six months) and the order classes
  each suits. The report names the lenses used and why.
- **Executor.** Before `implementation-ready` and `repair-complete`, one
  fresh sub-agent reads the diff and the order as an adversary and
  improver; each finding is fixed or recorded; `handoff.md` carries a
  `self-review:` line with found, fixed and recorded counts. Where the
  harness cannot spawn, the executor does the pass as a separate step
  and says so. A missing line is an advisory at completion, never a
  refusal.
- **Spawned workers run at the pinned model and effort.** The harness
  bundle emits one agent definition for spawned workers with the pinned
  model and effort in the fields the host documents for them, and the
  role text tells every role to launch its adversary, reviewers,
  refuters and research workers by that type; under Codex the same pin
  is passed to the spawn call. A root session's own effort no longer
  decides a worker's.
- **The verify briefing prints** the order's `Known issues and
  carry-ins` section and the planning receipt's known issues for the
  order, so the verifier is fed what the reviewer is fed.
- **Final review keeps its duties.** Each finding line in its report
  carries a class: `escape` (present in the verified subject and inside
  what verification is told to examine), `integration` (arose from
  integrating main or preparing the release) or `new-scope`.
  `final-review-result` records the counts; a blocking finding with no
  class is counted as `unclassed` and named in one advisory, and the
  result is recorded all the same. `plan failures` counts escapes per
  order and `plan start` prints escapes per final review over the last
  ten orders.
- **Declined alternatives, recorded:** a review phase of its own between
  verification and final review (a fifth dispatch for the operator to
  route; the verifier can spawn the reviewer); moving the full-diff
  reading out of final review (the operator's direction keeps final
  review's duties; the count shows whether it still finds things);
  every lens on every order (cost, and the operator's direction that
  not every verification needs all of them); a second verifier on
  another model
  (FUP-ee5190faadaeffa0 stays deferred until the escape count can be
  split by judge); refusing a handoff with no self-review line (WO-130's
  boundary keeps completion checks advisory).

**Deliverables:** the role sentences and regenerated roots; the lens
catalog; the briefing addition; the finding class, its recording and its
counts; the handoff line and advisory; fixtures; the write-backs below.

**Acceptance criteria (all required)**

1. The generated verifier root (`.claude/skills/dotln-verifier/SKILL.md`
   and its `.agents` twin) carries one duty sentence naming the attack,
   the implementation review and the fresh adversary, a read directive
   for the product 07 section that holds their detail, and the completed
   gate sentence; that section holds the variation axes, the review's
   questions and three routes, the re-verification rule and the lens
   catalog; the executor root carries the self-review sentence;
   `npm run harness -- check` is green.
2. `npm run resume -- verify` on a fixture order that has a `Known
   issues and carry-ins` section and a planning receipt naming one known
   issue prints both in the briefing; the fixture fails against
   `08845c71`.
3. `implementation-ready` on a fixture whose `handoff.md` lacks a
   `self-review:` line prints one advisory naming the line and records;
   with the line it prints none.
4. `final-review-result` on a fixture report records the three class
   counts in the event; a blocking finding line that carries no class,
   or another word, is counted as `unclassed` and named in one advisory,
   and the result is recorded all the same; `plan failures` prints
   escapes and unclassed findings per order and `plan start` prints the
   last-ten figure over a synthetic control log.
5. Product 07 holds the lens catalog as one section the verifier's text
   cites by name, its §Model-specific notes says that a spawned Claude
   worker's effort comes from the generated agent definition, and
   `docs/PLAYBOOK.md` states that the verifier is fed the order's known
   issues; each edit is in place. `npm run harness -- check` covers the
   generated agent definition and fails when its model or effort is
   edited by hand; one probe row records a worker spawned by that type
   from a root at another effort, with the effort the host reports for
   it, or records that the host reports none.
6. Cold-start bytes of every role root are measured before and after
   regeneration and recorded in the decisions; the verifier and executor
   roots fit the ceilings in force at this order's base with no new
   acceptance, and text that does not fit is moved to the section read
   at verify time.
7. Write-backs: the decisions file with each sentence and the finding it
   answers; the decisions index; register rows FUP-19cd701c25446383 and
   FUP-e62d0d2771185a38 retargeted at close.
8. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 2 to 4; the regenerated roots;
`npm test -- --review` before `implementation-ready`, because
`contributor.ts` and `scripts/resume.mjs` are declared machinery sources,
and again at final review. This order's own verification runs under the
new text in its worktree: its report is the first to show the three
duties, and the final review says whether it did.

**Write-back duty:** as listed in criteria 5 and 7.

**Known issues and carry-ins:**

- Receipt 038: at filing the verifier root had 363 bytes of headroom and
  every bounded role's ceiling had been raised two or three times since
  2026-09-17. This order is not one more raise (criterion 6). Reopen if,
  after regeneration, the verifier or executor measure exceeds its
  ceiling and an acceptance is recorded.
- Receipt 038: a finding's class must never block recording a final
  review; criterion 4 counts an unclassed line and advises. Reopen if a
  final-review result is refused, or needs a new report or an operator
  correction, over a finding's class.

**Non-goals:** a new lifecycle phase; any change to what final review
does beyond classing its findings; changing the product gate's
selection (WO-186); a verifier that edits the implementation; a spend or
time cap on verification.

**Operator-review assumptions**

1. A longer verification is an acceptable price for fewer returns from
   final review; the escape count is the measure, and the plan reopens
   if ten orders after this one show no fall or verification's median
   time more than doubles.
2. One adversary agent at executor completion is required whenever the
   harness can spawn one, including when the multi-agent mode is off.
3. `blocking`, `follow-up` and `operator` are the three routes; a
   maintainability finding is `follow-up` unless it hides a defect.
4. Final review's own duties stay as they are.
