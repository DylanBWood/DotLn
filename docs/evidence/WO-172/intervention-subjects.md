# WO-172 — what the operator's interventions were about

The subjects of the 303 survey episodes that hold a correction or a failure
instruction (2026-08-31 to 2026-09-28, 71 orders and the main checkout), grouped into 30 themes and
mapped to what the planning record already holds, each with a next step. Layers:
subject (a defect in the product, tooling or process), meta (an agent
behaviour that recurs), meta-meta (how agents handled an earlier
intervention). The data and method are in
[intervention-subjects.json](intervention-subjects.json); the reading is the
executor's through agents, which the operator accepted as good for now on
2026-09-29 ([D022](decisions.md)). No message text.

Repair [D026](decisions.md) splits episodes at role changes: 301 counted pieces
replace 298, with the accepted 30 themes and next steps retained. This count
reconciliation is not a new operator endorsement.

Repairs [D034](decisions.md) and [D039](decisions.md) read the question-tool answers the survey had passed
over and passes over a prompt a tool call launched and four repeated lines: 303 counted pieces replace 301. Each piece keeps its theme; one answer
joined two pieces into one, and four pieces that an answer made a correction or
a failure instruction were read by the executor and placed in existing themes.
The 30 themes and their next steps are retained, and this is not a new operator
endorsement.

Episodes by layer: meta 193, subject 61, meta-meta 49. Themes by coverage: 10 fixed, 16 partial, 2 tracked, 1 candidate, 1 untracked.

## 1. Gates rerun in loops or run slowly

meta; 21 episodes in 13 orders (2026-09-09 to 2026-09-28); coverage fixed (WO-132, WO-173, FUP-7629e03c6573f5cb), 0 episodes after the last fixing order's final review.

Roles rerun the product or evidence gate after changes that should not need it, restart multi-run series after trivial edits, or sit on gates the machinery made slow, and the operator had to break the cycle repeatedly.

Next step: At the next pass, count product gate runs per order since WO-173 from the gate index, as failures §3 did; reopen the structural-cut item if any order exceeds four (§13), and triage FUP-7629e03c6573f5cb's untracked-source reuse gap.

## 2. Asks, stalls or re-diagnoses instead of acting

meta; 22 episodes in 14 orders (2026-09-01 to 2026-09-28); coverage partial (FUP-a9412a7815418c21).

Roles put routine decisions back to the operator, halt at a blocker they could fix, list options instead of doing them, or keep diagnosing when a cheap action such as regenerating, reinstalling or supplying the command would settle it.

Next step: Triage FUP-a9412a7815418c21: move rule 6 into product 07 §Discipline and the shared role text (contributor.ts common) so every role, not only the executor, settles routine version, waiver and live-episode questions itself (E0975, E0980, E0987).

## 3. Misreads what the operator was asking for

meta; 16 episodes in 12 orders (2026-08-31 to 2026-09-28); coverage partial (FUP-22929ecc5931615f, FUP-e93507c6b9f1d47e, FUP-0c76cd39223a576b).

An agent answers a different question from the one asked, frames a direction narrower or broader than its aim, or fits the operator's words into its own categories without checking its reading with the operator.

Next step: Extend the executor-only Intent to Act support to the planner, verifier and reviewer in packages/skeleton/src/loadouts/contributor.ts so each states its reading of the operator's aim before acting, and score misreads against the operator's reading once FUP-0c76cd39223a576b is allocated.

## 4. States conclusions it has not checked

meta; 16 episodes in 9 orders (2026-08-31 to 2026-09-24); coverage fixed (WO-141, FUP-5f58198706dfa59e, FUP-2f80a6a6318d4ddf, FUP-512f562095c82009), 4 episodes after the last fixing order's final review.

Agents assert causes, blockers, unreachable services, required steps or finished work from a partial search or a guess, and report figures before separating their sources.

Next step: Reopen FUP-5f58198706dfa59e, whose recurrence condition has occurred (E0753, E0810, E0882, WO-172-D015), and give claims WO-173's form: a handoff or report claim names the command and output it rests on, checked wherever a gate row exists.

## 5. Lifecycle gaps lose context or leave manual steps

subject; 15 episodes in 10 orders (2026-08-31 to 2026-09-18); coverage fixed (FUP-e513ddca3cfbe398, WO-139, WO-079, FUP-5047977fa705e78b), 0 episodes after the last fixing order's final review.

Early lifecycle defects left repair sessions without context, needed hand-run commits and refutation commands, skipped recording a repair start, forced extra passes on parallel lanes, and left chores and lock releases to the operator.

Next step: None needed: no episode since 2026-09-18, and each gap now has a landed fix (WO-130, the 2026-09-13 background refuter, WO-139, WO-079).

## 6. Judges reach beyond the acceptance criteria

meta; 13 episodes in 12 orders (2026-08-31 to 2026-09-28); coverage partial (FUP-b053a956adb84b6a, WO-139, FUP-8c9a0ab2a894b7fd), 4 episodes after the last fixing order's final review.

Verifiers and reviewers pad reports with theoretical or non-defect findings, chase side questions and settled authorizations, fail work on bounds the operator set aside, and fan out far more agents and reads than a review needs.

Next step: At the next pass, test FUP-b053a956adb84b6a's reopen condition against orders made ready after WO-173 using plan failures, and add to the verify briefing that scope the operator set aside is recorded as known, not failed (E1002).

## 7. Sandbox and permission steps not requested or not workable

meta; 12 episodes in 7 orders (2026-09-01 to 2026-09-24); coverage partial (WO-014, WO-140, WO-161), 0 episodes after the last fixing order's final review.

Approval prompts outpaced the operator, a settings fix was overstated, and agents stalled on sandbox-blocked steps, suggested weaker security, or passed commands and overrides to the operator instead of requesting authority through the host.

Next step: Settle WO-014's open question (does approval friction remain without a host sandbox) before sequencing it, and add one shared role line: authority a step needs is requested in-session through the host flow, never passed to the operator as a command (E0679, E0895).

## 8. Release close runs long, stops short or targets the wrong release

subject; 13 episodes in 4 orders (2026-08-31 to 2026-09-16); coverage fixed (WO-127, WO-044, WO-132, WO-171, FUP-ecf9d3b703a0b7d9, FUP-8cfd3ff52146a016), 0 episodes after the last fixing order's final review.

Post-merge publication needed unplanned steps, ran suites and refutations it did not need, picked the wrong release, handed publication back to the operator, or halted on leftover residue.

Next step: Make FUP-ecf9d3b703a0b7d9's reopen condition observable: have plan failures count release-close attempts and failures from the ignored local lane beside gate rows (failures §9), and carry FUP-8cfd3ff52146a016's real-runtime publish fixture into the order that records outcomes.

## 9. Hands the operator unclear or unusable text

meta; 12 episodes in 8 orders (2026-09-07 to 2026-09-28); coverage partial.

Commands carry placeholders, questions leave their purpose unexplained, jargon goes undefined, and long summaries replace concrete results or the next step, leaving the operator to decode the message.

Next step: Add one line to the shared role text (contributor.ts common): a command given to the operator is copy-paste runnable with real paths and no placeholders, and a question states what it decides and why in plain words (E0586, E0807, E0986).

## 10. Records the operator's words wider, narrower or other than said

meta-meta; 12 episodes in 7 orders (2026-08-31 to 2026-09-27); coverage partial (WO-085, FUP-71fc2efc208f597a, FUP-f287a595299249ff), 1 episode after the last fixing order's final review.

Corrections are applied too literally or turned into rules never given, temporary constraints are recorded as lasting, and statements, decisions or verbatim text are attributed to the operator in committed records.

Next step: Triage FUP-f287a595299249ff after WO-172's sweep: extend the dispatch check to work-order provenance lines and decision texts, so any rule or phrase attributed to the operator cites its capture digest (E0968, WO-172-D020).

## 11. Corrections and failures do not persist as process

meta-meta; 12 episodes in 6 orders (2026-09-09 to 2026-09-28); coverage tracked (FUP-84ea5fb168c317cf, FUP-e2612bcb7ad08955, WO-172, FUP-3a6e3d734d493650).

Fixes are narrated in chat or scoped to one session, roles leave their own failures out of the record, supports meant to carry a correction fail to load, and the operator has to give a rule again.

Next step: Allocate FUP-84ea5fb168c317cf at the next pass: the prompt hook records each operator message's route, time and class as a typed event holding a digest, never text, so plan failures counts corrections no role wrote down; fold FUP-e2612bcb7ad08955 into it.

## 12. Hooks and gate machinery block the work

subject; 12 episodes in 6 orders (2026-09-08 to 2026-09-26); coverage fixed (WO-132, WO-115, FUP-d636595e251ba81b), 0 episodes after the last fixing order's final review.

Stop-hook and read refusals flooded sessions, a lock or live gate blocked stopping or delegating, a runtime prerequisite was circular, and code-identity rules let documentation edits void a recorded gate.

Next step: None needed: WO-132 left five refusals with advisory reads, and WO-115 fixed the one later recurrence (README edits changing code identity, E0940) the same day.

## 13. Plans drift from the vision and the operator's direction

meta-meta; 11 episodes in 3 orders (2026-09-03 to 2026-09-22); coverage partial (FUP-abfdb650f125a77f, FUP-ba35c0b5ae47cfb8).

Planning passes lose core parts of the product vision, mix personal policy into the platform, file orders too narrow or too large, and keep sequencing machinery debt ahead of delivery without any pass noticing.

Next step: Have plan start print the delivery-versus-debt split of the last eight closed orders against the operator's half-and-half standard (failures §11), beside WO-172's count of orders since the last Entropy Reducer review, so drift shows at entry.

## 14. Serves a check, cap or symptom instead of the goal

meta; 11 episodes in 8 orders (2026-09-14 to 2026-09-28); coverage partial (FUP-a815e8862796c2e1, FUP-da72ac3d4d5123bf, FUP-d217775b9c71ce81, FUP-c6dce0e659a830f1, FUP-8c9a0ab2a894b7fd).

Agents trim or keep text to satisfy byte caps, add machinery that serves itself, build mechanisms against a surface symptom, and revert or remove working fixes so a stale check passes.

Next step: Reopen FUP-a815e8862796c2e1, whose condition (a second rewind attempt) occurred in E0876, and state in product 07's planning procedure that a byte figure in an order is a reported target under the ceiling rule, never a trim bound (E0999).

## 15. Defers fixable defects

meta; 10 episodes in 9 orders (2026-09-09 to 2026-09-25); coverage partial.

Executors, verifiers and planners push real, repairable defects to later orders, follow-ups or planning passes, or accept a flaky pass, instead of fixing them while the order is open.

Next step: Reconcile WO-173's verify sentence that a defect outside the declared criteria is boarded, not failed (scripts/resume.mjs:1046), with the operator's 2026-09-25 permission to fail an order for repairable defects (E0911), and state the boundary in product 07's Adjacent Repair rule.

## 16. Polls, narrates or idles while work runs

meta; 10 episodes in 7 orders (2026-09-10 to 2026-09-28); coverage candidate (WO-166, FUP-34baa790901c6d95, FUP-3bb4dea9dde2a392, FUP-1f47fd50acc97814), 4 episodes after the last fixing order's final review.

During gates and background tasks agents post repeated status lines, poll transcripts, claim watchers that do not exist or sit idle, instead of waiting quietly or spending the wait on bounded work.

Next step: Allocate the utilization candidate (FUP-3bb4dea9dde2a392) with FUP-1f47fd50acc97814's recorded trial: role text says a wait runs evidence --wait in the background and then does bounded listed work or stays quiet, never polling or narrating (E0976, E1006).

## 17. Clean-room screening applied too broadly

meta; 8 episodes in 6 orders (2026-08-31 to 2026-09-07); coverage fixed (WO-109), 0 episodes after the last fixing order's final review.

Agents scrubbed context that was already public, paraphrased terms and phrase lists whose exact wording was the point, set aside founding ideas wholesale, and blocked readiness on a complete terms list.

Next step: None needed: no episode since the floor was rewritten on 2026-09-08; the opposite failure, operator words kept verbatim, is handled under the operator-words theme.

## 18. Every role reruns the full product gate

meta-meta; 8 episodes in 8 orders (2026-09-14 to 2026-09-28); coverage partial (WO-132, WO-173), 0 episodes after the last fixing order's final review.

Verifiers run full product gates that the executor and final review also run, even after their verdict is settled, so each order pays for the same tests several times.

Next step: Remove productGate from the verifier procedure (packages/skeleton/src/loadouts/contributor.ts:123) so the verifier cites the executor's handoff.md gate row and runs npm test only to reproduce a finding, using --again with a stated reason.

## 19. Treats a question, complaint or stale message as an instruction

meta; 8 episodes in 7 orders (2026-09-08 to 2026-09-28); coverage fixed (FUP-5dd41f26ea5c719a, WO-054), 1 episode after the last fixing order's final review.

An operator question stops or narrows in-flight work, a complaint is read as license to act, an override is stretched past its purpose, and after compaction an old message is answered instead of resuming the order.

Next step: Add the question-is-not-a-waiver rule to the verify and final-review briefings beside WO-173's sentences (scripts/resume.mjs:1043-1046), since the role-text line did not stop E0974, a verifier halting its workflow when merely asked about it.

## 20. Leaves locks, monitors and stray files behind

subject; 8 episodes in 8 orders (2026-08-31 to 2026-09-25); coverage partial (WO-139, WO-166, FUP-0349c7a91fe63917), 0 episodes after the last fixing order's final review.

Sessions end with writer reservations or background monitors still held, keep disposable fixtures, and test runs leave stray files or change tracked ones.

Next step: Add to the shared completion text (contributor.ts evidence) that a role stops its own background monitors before recording its result, and have the Stop advisory, which already lists journaled background dispatches (WO-141), name any still running (E0909, E0912).

## 21. Passes or hands off before the work is checked

meta; 9 episodes in 8 orders (2026-09-07 to 2026-09-28); coverage partial (WO-173, FUP-9a23fe23cbf08958, FUP-9625ca888d7d08f5), 0 episodes after the last fixing order's final review.

A pass is recorded while a fan-out still runs or before a gate, observations stay unverified, a visual check is replaced by a DOM read or coverage is weakened, and a role misses errors in its own output.

Next step: Apply WO-173's claim check to verification-result: a criterion judged met that names a gate needs that gate's passing row or inline run; reopen FUP-9a23fe23cbf08958, whose recurrence condition occurred (E0836 recorded a pass before the docs gate).

## 22. Planning refutation loops, stalls or needs hand steps

subject; 7 episodes in 1 order (2026-09-09 to 2026-09-13); coverage partial (WO-132), 0 episodes after the last fixing order's final review.

Refutation re-held plans on constructible gaps, launched the wrong transport, carried moot holds, needed manual operator steps, and ran under a fixed time budget that blocked filing.

Next step: Replace the fixed 20-minute PLAN_REFUTATION_LIMITS.timeoutMs (packages/skeleton/src/plan-refutation-protocol.ts:134) with a deadline drawn from recorded refutation durations, or none, so no pass needs the override receipt 033 took (failures §17).

## 23. Phases run far longer than their work

meta; 7 episodes in 6 orders (2026-09-15 to 2026-09-25); coverage partial (WO-158, WO-160, WO-164, WO-172), 0 episodes after the last fixing order's final review.

Verification, review, repair and release close stretched to hours through blocked probes, late gate starts, side research, extra live runs, repeated repair rounds and slow lookups.

Next step: Have plan start or plan failures list orders whose phase attempts ran past twice that phase's median, from completedPhaseAttempts (failures §8), so a pass sees long phases at entry instead of timing them by hand as §3 did.

## 24. Pull-request titles and commits drift in form

meta-meta; 6 episodes in 5 orders (2026-09-02 to 2026-09-09); coverage fixed (WO-063), 0 episodes after the last fixing order's final review.

PR titles grew release by release and then swung too short, gitmoji landed on commits instead of titles, an attribution trailer was considered, and titles were sized by numeric rules rather than written as headlines.

Next step: None needed: no episode since the headline rule entered the reviewer role text on 2026-09-11 (.claude/skills/dotln-reviewer/SKILL.md line 41), and WO-063 lints outward titles.

## 25. Ideation captured raw or recorded inaccurately

meta; 6 episodes in 4 orders (2026-08-31 to 2026-09-04); coverage fixed (FUP-fe8f162b7d022512, WO-084, FUP-d3940f4e6201b477), 0 episodes after the last fixing order's final review.

Ideas were left as raw intake without synthesis, and the idea ledger and architecture documents misattributed sources, misread the operator's analogies or misordered entries.

Next step: None needed: no episode since 2026-09-04; ideation mode requires synthesis and a verified breakout receipt, and WO-084 ordered ledger sections newest first.

## 26. Reports leave readable values unknown or treat drafts as frozen

meta; 6 episodes in 3 orders (2026-09-11 to 2026-09-24); coverage partial (FUP-34baa790901c6d95, WO-140, WO-170), 0 episodes after the last fixing order's final review.

Reports record usage or other values as unknown or null when a readable source exists, drop measurements instead of taking them, and append corrections or demand extra passes because a draft or receipt is wrongly treated as unchangeable.

Next step: Add to the shared role text that unknown is written only after naming the readable source tried (CLAUDE.md: obtain it) and that an unfiled report is corrected in place, not appended to; WO-172-D012 and E0896 show both recur.

## 27. Writes bookkeeping or edits outside its lane

meta; 6 episodes in 6 orders (2026-09-15 to 2026-09-28); coverage partial (WO-144, FUP-cd1a227413938345, FUP-bf614feaea90cac3, FUP-a6cf758ebdd11f1c), 4 episodes after the last fixing order's final review.

Version bookkeeping and finding labels land in product documents and code comments, old planning records are edited to pass a check, and agents try to edit user-level instructions or write to main outside the phases allowed.

Next step: After WO-086 and WO-087, allocate the product-document ownership candidate (FUP-cd1a227413938345) so role text drops the per-order roadmap paragraph duty, and triage FUP-bf614feaea90cac3 so an ideation capture never writes main outside final review or release close (E1008).

## 28. Sessions misreport their own model and effort

subject; 5 episodes in 3 orders (2026-09-16 to 2026-09-22); coverage fixed (WO-049, FUP-ba0543bee5b0895c, WO-157, FUP-eba6a79fc106bd28, WO-158, FUP-a6cf30a8b7bc4a83), 0 episodes after the last fixing order's final review.

Sessions wrote a model default into instructions, misread an effort spelling, and attested unknown effort when the harness exposed a readable value.

Next step: None needed for readback since WO-157 and WO-158; triage the residual FUP-a6cf30a8b7bc4a83 so an ultracode spelling is recorded as a mode apart from effort in parseActor and normalizeWorkerEffort.

## 29. Provider safeguard refusals trap the session

subject; 1 episode in 1 order (2026-09-15 to 2026-09-15); coverage untracked.

Repeated provider safety refusals stalled closing out an order, and the retry loop could not break free even after a warning.

Next step: File a register row: after a second consecutive provider safeguard refusal a role stops retrying, records the stop as a decision naming phase and model, and resumes in a fresh session; nothing in the record covers this today (E0589). Filed as FUP-6332681e9500a84b (WO-172-D023).

## 30. Unprompted trap judgment the operator wants kept

meta; 0 episodes in 0 orders; coverage tracked (FUP-0c76cd39223a576b).

The operator named, as behaviour to keep, an agent applying the rule-beating and wrong-goal lenses without being asked; the survey's rubric had no class for such reinforcement, so no count shows what went right.

Next step: When FUP-0c76cd39223a576b is allocated, add a reinforcement class the operator confirms, seeded with this unprompted trap judgment, so plan failures and the meter count what went right beside what failed.
