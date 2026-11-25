# What the operator wants

This page is the planner's reading of what the operator is trying to
achieve, avoid, implement and experience. It is not confirmed until he
corrects it, and he corrects it by editing it. The planner keeps it, no
session loads it, and a planning pass reads it before it weighs a new
directive. Where two of his wishes pull against each other, both are
stated.

It was read on 2026-11-25 from his founding conversations, the
[idea ledger](../lineage/idea-ledger.md), every planning dispatch on
record and his captured messages of September to November 2026: 267 files
of ignored intake, bound by the manifest with SHA-256
`befbfc5ed4930873b83c39e9d4972e8eccf9656108ad8a506e26fd497e9b6e0b`
([how it was read](passes/data-is-the-record-2026-11-25.md#what-the-operator-wants)).

## In five sentences

He built DotLn because his earlier setup remembered his judgment as an
ever-growing pile of prose rules, which made him the babysitter of the
machinery instead of a thinker. He wants to state an intent, walk away,
and come back to verified work, interrupted only for decisions that are
really his; whether he supervises less is his own measure of the mission.

Nothing counts as done until someone other than the implementer has
proven it, and standards are not lowered to get there. Judgment belongs in
small, typed, inspectable mechanisms that make the wrong thing impossible,
and those mechanisms must never stop his own work or his teammates'. The
kit is a product other people fork: it has to leave them faster than plain
Claude, and it has to stay something he enjoys using in six months.

## Achieve

- **Flow.** He gives direction, steers when he wants to, merges, and
  otherwise is not needed. Work goes on while he is away.
- **Product on the critical path, ahead of machinery.** His time and the
  system's go to work an instance needs, and a mechanism that stalls
  product work is a defect however rigorous it is.
- **A kit that works for others.** It runs on a constrained work machine,
  for a small team, against a large legacy codebase; teammates point it at
  a task and get standard, proven work without learning its internals; an
  update never breaks an instance.
- **Proof over claims.** Claims are checked against evidence, by an actor
  other than the one who made them.
- **Judgment compiled, not remembered.** Hard-won ways of working become
  programs and typed records, with the least possible always-loaded
  context, and they survive a change of model.
- **A system that corrects itself.** A failure leaves something behind
  that prevents its class, and the repository gets easier to work in over
  time.

## Avoid

- Being the babysitter: sessions that idle, end a turn with a question,
  hand him commands or chores, or wait on a decision that was theirs.
- Orders, verifications and planning passes that do not end, and loops
  over counterexamples that someone can construct but nobody has met.
- Stops that have nothing to do with the work, gates that fail on what is
  not a defect, and the kit halting an instance's own work.
- The old failure again: rules kept as prose, documents that grow by
  appending, process kept for show, cruft added by every order.
- Being misread: a remark or a question taken as an order, a correction
  read too literally or too broadly, a reversal at the first pushback, a
  decision attributed to him that he never made, an unchecked fact.
- Deferral: work handed to "the next pass", known issues left open
  without a condition.
- Ad hoc parsing, leftover processes and fixtures, heavy memory, a full
  gate after a change to documents alone.
- A weaker model swapped in silently, and a recent idea erasing older
  ones.

## Implement: what he has asked for more than once

- An append-only event log as the truth, with Markdown as a view of it;
  typed records for authority, objectives and decisions; a pure step
  function, so the same inputs give the same decision.
- A work order as a compiled, bounded briefing, run in a fresh session for
  each phase, by separate actors for implementing, verifying and final
  review.
- A schema and a linter for anything code reads, in place of custom
  parsing (asked since early November).
- Graded stops: log or advise where a refusal is not needed, with every
  limit in configuration an owner can change.
- A recorded "do nothing" with its reversal condition for every
  intervention declined.
- Combined orders worked as one whole and gated once at the end, and
  parallel lanes where surfaces are disjoint.
- Reviewers that find problems early and never hold a gate, a conduct
  critic that reads the logs itself, and a critic of that critic.
- A planning session that carries its own work to a pull request, and
  questions that let work go on under a recommended default.

## Experience

- He types a phrase, leaves for hours and returns to progress. He can stop
  or steer anything at any moment, and a side question does not derail the
  work.
- When he questions a choice, a session that is sure explains its reasons
  and one that is unsure treats the question as evidence. Neither stops,
  and neither flips.
- Decisions that are his arrive with their context and a recommendation.
  Decisions that are not his are made, with reasons.
- What he reads is plain and reads as one story. Reviewing a good Markdown
  diff is a pleasure he wants to keep.
- An order costs him a few phrases and a merge, and he does not have to
  wonder what the system did.
- It should be fun, and it should feel lighter each month, not heavier.

## How he reasons

- **Theory of constraints.** Pace work to the bottleneck, and he has said
  from the start that the bottleneck is himself. Activity is not
  throughput; do not build what will only queue in front of the
  constraint.
- **System traps.** He applies them to the process itself, most often rule
  beating, seeking the wrong goal and shifting the burden.
- **Antifragility.** His absence and small disruptions should leave the
  system better. Chaos belongs in sandboxes.
- **Naive interventionism and doing nothing.** He asks whether an
  intervention, his own included, will backfire, and expects a planner to
  ask it of him.
- **Entropy and 5S.** Upkeep is continuous, and what is not used is
  removed.
- **Anti-oscillation.** Find the category a correction points at, and
  neither widen it nor shrink it. Decided means sourced, not frozen.

## His own tests of success

No order takes six hours. More than one order closes in a day. There are
no emergency sessions. A piece of process stays only if it has proven its
worth. Entropy stops growing. A teammate gets standard, proven work by
pointing the kit at a task. He would still enjoy using it in six months.

## Asked for repeatedly and still not true

| Wish | First asked | Latest |
| --- | --- | --- |
| He supervises less, and work goes on without him | September | 25 November |
| Orders and verifications end | late September | 25 November |
| Sessions do not idle or hand work back | late October | 23 November |
| The kit does not stop work that is not at risk | early November | 23 November |
| No custom parsing; contracts for what code reads | 8 November | 25 November |
| Documents and the register stop growing | September | November |
| He is read correctly: no oscillation, no invented decisions | September | 25 November |

## Tensions he has not resolved, and how he has leaned

- **One large order against orders that end.** He has asked several times
  for one order that carries everything, to avoid paying many cycles, and
  he will not accept an order that does not converge. He has said how a
  combined order must be worked: designed from its end state, not as its
  members in a row.
- **Mechanisms against stops.** He wants rules as mechanisms and rejects
  mechanisms that halt his work. His lean: stops are core's own
  discipline; an instance is advised and goes on; prefer logging to
  refusing.
- **Fix everything against finish.** He wants findings fixed and judged
  again, not waived, and he has overridden endless holds, recording them
  as known issues with a reopening condition.
- **Thorough against lean.** He wants everything recorded and many
  reviewers, and he wants short documents, fast gates and no machinery for
  its own sake.
- **Autonomy against control.** He wants sessions to decide and go on, and
  he keeps the merge and the settings in his own hands. Whether his
  absence widens what the system may do is, by his later word, a policy
  the owner chooses.
- **Rules given in anger.** He has corrected sessions both for treating a
  complaint as venting and for treating venting as a specification. The
  category is the direction; the literal form is to be weighed.

## The same complaint, again: what has been tried

Each of these has been raised across three or more planning passes. Nearly
every answer added a rule, a check or an order, and the complaint came
back. What has rarely been tried is removal, and making the wrong thing
impossible to write in the form of a record or a command.

| Complaint | What each answer was | Came back |
| --- | --- | --- |
| Orders that never pass, and criteria he is asked to waive | A rule that a criterion states its set; a rule on what may block; defect classes and a lint; the refuter to judge criteria | Every time |
| Code reading prose | A screening rule; one parser for all readers | Twice |
| Machinery stopping work | Two removals, a reset order, stops demoted to advisories in an instance | Yes |
| Gate time | A mechanism each time, over eight passes | Yes |
| Sessions stopping to ask | Role sentences, then hooks | Still open |
| Decisions handed back to him | A new rule each time, over eight passes | Yes |
| Findings nobody acts on | A triage mechanism each time | Yes |
| Documents that bloat | Size ceilings and checks | Yes |
| Steps left to his hands | A mechanism for each step | Yes |
| Releases that break an instance | A fixture and checks | Yes |
