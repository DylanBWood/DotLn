# WO-172 evidence — failures reach planning

Executor: Claude Code 2.1.284, model `claude-opus-5-5`, effort `max` by the
session's `CLAUDE_EFFORT` readback (selected, not effective), in ultracode
mode; the order recommended `xhigh` ([D014](decisions.md)). Dispatched
`resume: next` at 2026-09-29T00:23:41Z on base `8c28f479`; release `v0.56.1`,
a patch retimed from `v0.54.1` and then `v0.55.1` after siblings tagged
`v0.55.0` and `v0.56.0` ([D014](decisions.md)); the second repair moves the skeleton from `0.45.0` to
`0.45.1` ([D037](decisions.md)).

Repair: Codex CLI 0.159.0, `gpt-6-astra`, effort `max`, source
`codex-session-readback`, dispatched `resume: fix` on 2026-09-29. One writer,
no subagents. [D025–D027](decisions.md) record the three VER-001 repairs and
the operator-directed shape curation. Review evidence: 33 suites pass, zero
failures, 399.78 s at the repaired code identity; documentation: 23 checks pass.

Second repair: Claude Code 2.1.284, model `claude-fable-5-1`, effort `max` by
the session's `CLAUDE_EFFORT` readback (selected, not effective), in ultracode
mode; dispatched `resume: fix` at 2026-09-29T15:00:09Z after VER-002. One
writer. Eleven subagents in four workflows, none launched directly, all read-only, against a cap of 20,
by the harness counter: three readers before the mechanism was written, two
classifiers twice, and three reviewers and a refuter of the repair.
[D031 to D040](decisions.md) record the repair of F4 and F5, the boarded B1 to
B3, the operator's scope expansion that became criterion 11, what the review
of the repair found and what it changed, and four corrections. Review
evidence: 41 suites pass, zero failures, 665.95 s at the code identity of the
second repair, recorded 2026-09-29T19:10:50.370Z; the documents gate passed
after the last authored change.

Third repair: Codex CLI 0.159.0, `gpt-6.1-sol`, selected effort `ultra` normalized to xhigh with subagents, source `codex-session-readback`. Dispatched `resume: fix` on 2026-09-29; one writer and two read-only auditors with no descendants, reused for follow-up checks within cap 20. [D044–D046](decisions.md) record VER-003 F6–F9: parsed command roles and syntax, process substitutions, stable intact-lane answer identities and 28 frozen recording-role corrections. [survey-repair-3.json](survey-repair-3.json) carries source provenance and the independently reproduced comparison. The operator also authorized integrating main ([D047–D048](decisions.md)); the combined tree carries application target `v0.56.2`, skeleton `0.45.2` and console pin `0.45.2`. Authority edition WO-172 009 is selected; all prior editions remain historical. Fresh integrated review: 38 checks, zero failures, 82 tasks, 695.991 s; final documents gate: 23 checks, zero failures, 14.76 s ([D049](decisions.md)).

Fourth repair: Codex CLI 0.159.0, `gpt-6.1-sol`; selected effort `max` at entry and `ultra` at continuation (normalized to xhigh), from `codex-session-readback`. One writer and one read-only concurrency auditor, with no descendants, within cap 20. [D054](decisions.md) records VER-004 F10: atomic failed-use ownership, an under-claim lane recheck and conditional dead-hook recovery. [shell-concurrency.json](shell-concurrency.json) records the failing baseline and real generated-hook process checks, including the direct pair without instrumentation. Authority edition WO-172 010 is selected; older editions remain historical. Fresh review: 38 checks, zero failures, 82 fresh tasks, 762.844 s at the current code identity ([D057](decisions.md)). The 23-check document preflight passes; completion checks the final authored documents inline. Native Claude model delivery is historical evidence from VER-004; this Codex repair does not claim a new native-host observation.

## What landed

| Criterion | Deliverable | Evidence |
| --- | --- | --- |
| 1 | `scripts/lib/plan-failures.mjs`; `npm run plan -- failures` with `--since`, `--until`, `--all`, `--cursor` and `--export` | [criterion-1.json](criterion-1.json); the WO-172 plan failures fixture; [D002](decisions.md), [D003](decisions.md) |
| 2, 3 | the `plan start` failures block and the Entropy Reducer count | the WO-172 plan start fixture; [D004](decisions.md) |
| 4 | four per-order meter fields, `closedJudgments`, the last-eight summary in the health line and `planCostTable` | the WO-172 meter fixture; [D005](decisions.md) |
| 5 | `operatorStep` and the lifecycle count in `operatorDirections` | [direction-classification.json](direction-classification.json), [direction-agreement.json](direction-agreement.json), [reader-battery-1.json](reader-battery-1.json), [reader-battery-2.json](reader-battery-2.json); [D006](decisions.md), [D009](decisions.md) |
| 6 | 16 dispatch fields paraphrased; the fields left and why | [dispatch-paraphrases.json](dispatch-paraphrases.json); [D007](decisions.md), [D008](decisions.md) |
| 7 | product 07 (+351 bytes: 215 for the planning sentence, 136 for the read observer's), the sequence's interim paragraph removed, `followups.md`, both edition locks | [D010](decisions.md) |
| 8 | the gates | [handoff.md](handoff.md), [fixtures.txt](fixtures.txt) |
| 9 | the transcript survey (operator scope expansion), its validation against the operator's reading, and the map of what the interventions were about | [transcript-survey.json](transcript-survey.json), [survey-validation.json](survey-validation.json), [intervention-subjects.md](intervention-subjects.md), [survey-repair.json](survey-repair.json), [survey-repair-2.json](survey-repair-2.json), [survey-repair-3.json](survey-repair-3.json); [D011](decisions.md), [D012](decisions.md), [D013](decisions.md), [D015](decisions.md), [D016](decisions.md), [D018](decisions.md), [D019](decisions.md), [D022](decisions.md), [D026](decisions.md), [D031](decisions.md), [D034](decisions.md), [D039](decisions.md), [D044](decisions.md), [D046](decisions.md) |
| 10 | candidate behavioral interaction shapes (operator scope expansion and repair curation) | [readable collection](interaction-shapes.md), [structured collection](interaction-shapes.json), [paired examples](interaction-shapes.test.mjs); [D021](decisions.md), [D023](decisions.md), [D027](decisions.md) |
| 11 | the Shell rule in `CLAUDE.md`; `shellDiagnostics` and `shellGuidance` in the skeleton's command module; the observer's context and its local count; `localShellDiagnostics` in `plan failures` (operator scope expansion) | [shell-diagnostics.json](shell-diagnostics.json), [shell-concurrency.json](shell-concurrency.json); the WO-172 fixtures in scripts/test-harness.mjs and scripts/test-plan-refutation.mjs; [D032](decisions.md), [D033](decisions.md), [D037](decisions.md), [D038](decisions.md), [D054](decisions.md) |

The economy experiment is [D001](decisions.md): the window's receipt is read
as filed, 0.05 s against 1.63 s for the validated chain. An ideation breakout
during this dispatch is receipted in [D017](decisions.md).

## The direction reader, measured four ways

- In-sample against the hand classification filed first (SHA-256
  `ef44ebbc…`): the first draft 233 of 241 on the base texts; the final reader
  238 of 241 there and 241 of 241 after the paraphrases, whose three base
  disagreements are the fields that named no step until paraphrased.
- A first independently written battery, scored once before any rule changed:
  58 of 80 (72.5%); 63 of 80 on counted or not. Its misses then shaped more
  general rules, so it is a development set (80 of 80 now).
- A second battery by another agent that saw neither the reader nor the first
  battery, scored once and never used to change the reader: 70 of 80 (87.5%);
  72 of 80 on counted or not. That is below the order's 95-in-100 bound for a
  reader replacing a hand count; the misses are verbs outside the reader's
  words, a section title and a model choice (FUP-b3454d6ce3594ef3).
- A review estimated in-sample agreement near 90% without the rules only one
  field needs.

Every reference label above is a model's or the executor's reading, not the
operator's.

## The transcript survey

2,434 messages the operator sent from 2026-08-31 to 2026-09-29 in 745
sessions over 124 orders, read by route and time with the agent's preceding
activity; 1,743 classified; 1,035 episodes at a 120 s gap, split at role
changes. The first survey read 2,396; the second repair left out six the
operator did not send and read 44 it had passed over ([D034](decisions.md),
[D039](decisions.md)). The
messages stayed in session scratch; the file holds counts and order or
decision identifiers only ([D013](decisions.md)).

The classes and flags are the classifier's reading under a rubric the
executor wrote, and the second pass that agreed with it was another agent
under the same rubric. The operator named this as unscientific: they alone
know what their messages meant ([D016](decisions.md)). An 18-message blind
sample, hashed before the operator saw it, was scored once against the
operator's own reading ([survey-validation.json](survey-validation.json),
[D018](decisions.md)): 13 of 18 classes, 16 of 17 failure instructions and
all 15 stated severities agree.

- Two misses are classes the rubric lacks: trial and error, and positive
  reinforcement, which the operator names a primary signal of what the agent
  does right.
- Three triggers lay outside the session the method reads, so the breakdown
  of what corrections answered is withdrawn as a finding.
- The original record's 14% of correction episodes stands as the classifier's reading
  (both sampled corrections confirmed). The shares for directions (17%),
  answers (15%) and scope expansions (58%), and the 66% for failure
  instructions, are bounded: one of each class's two sampled labels was read
  otherwise.
- Asking the operator to re-confirm the whole mapping made them explain
  again, a correction recorded in [D019](decisions.md).

## Repair of VER-001

[D026](decisions.md) and [survey-repair.json](survey-repair.json) record all
three fixes. The review counter uses the receipt’s completion time. The survey
reconstructs queued-message context at send time and compares jointly by order
and role: 317 rows over 109 orders, with differing orders listed. No timing gap
is negative. Three classification labels changed; the original operator and
second-pass validation remain historical observations of their original input.
The new joint match is 20 of 205 correction episodes and 15 of 45 failure
instructions; the old comparison without role remains explicitly separate.
Screened fields retain their historical labels with the reading limit stated.
The pure folds and five synthetic cases are [survey-repair.mjs](survey-repair.mjs)
and [survey-repair.test.mjs](survey-repair.test.mjs).

## Repair of VER-002

[D031](decisions.md), [D034](decisions.md) and [D039](decisions.md) record
the fixes, and [survey-repair-2.json](survey-repair-2.json) the census and
the impact.

- **F4.** Each answered result of Claude's question tool is a message by its
  own route, sent at the result's time with the question it answers in the
  context before it: 43 answers in 37 sessions the survey already held, 39 in
  25 named orders and 4 in the main checkout. They hold 52 values: 45 picked
  labels, 6 typed, and 1 that is the host's placeholder for an answer given
  only as a note. One refused call holds no answer.
- **F5.** An item a hook injected is left out whatever the hook is named,
  recognised by the host's own item type or by a body that is one whole hook
  element. One item is removed; no other stands in the subject.
- **Beyond the quoted cases.** A queued message that holds text and an image
  was absorbed mid-turn and never read; it is read under its own route. The
  one note the record holds stands in an answer without a pick; the rule for
  a note beside a pick is held by a synthetic case. Each route the survey
  does not read is named in its method with its count: slash commands (365
  under 13 names, 7 of them recorded as system lines), the operator's shell
  commands, bare refusals of a tool call, and queued messages that were
  withdrawn or never delivered.
- **The review of the repair.** A prompt that a tool call launched through
  the host's SDK entry point was counted as the operator's, and four lines
  that a continued session's file repeats were counted twice. Both are left
  out by rule, each keeping its place in the numbering. The 28 user lines
  whose body is parts are the host's interrupt markers, read as interrupts.

Every retained key keeps its role, order, route, text and context; only the
gap to the previous message moves, for the 26 messages that follow an added
one. The answer-class comparison moves from 68, 19 and 9 matched to 93, 19 and
16; failure instructions from 45, 159 and 15 to 50, 159 and 19; 318
order-and-role rows over 110 orders, 98 listed as differing. Corrections read
204, 33 and 20 and directions 132, 52 and 10.

Two classifiers labelled the 44 added messages independently and agreed on
every field; the executor read the typed answers and kept the labels. They
are the classifiers' and the executor's reading, not the operator's. The
rules are the folds in [survey-repair.mjs](survey-repair.mjs), held by
thirteen synthetic cases and nine negative controls.

The boarded defects are repaired beside them: a bound that names no real
moment is refused ([D035](decisions.md)); the moved register rows state their
real revisions and the cost table's bound is a tested function
([D036](decisions.md)). A bound outside the years 0000 to 9999 is refused
too ([D038](decisions.md)).

## Shell diagnostics

Criterion 11 entered by the operator's scope expansion during this repair
([D033](decisions.md)), after the executor's own commands failed on the shell
they ran under ([D032](decisions.md)). A review of the first mechanism found
it answering falsely and reading too few classes; [D038](decisions.md)
records what replaced it. [shell-diagnostics.json](shell-diagnostics.json)
holds the mechanism, the baseline, the observations and the limits.

- **The rule.** `CLAUDE.md` states that commands run in zsh and names the
  forms the record shows roles getting wrong, in 390 bytes.
- **The mechanism.** Under Claude Code the observer reads the command's words
  as the shell splits them and counts a line the shell printed only when a
  word of the command becomes what the line names. It hands the agent that
  class's guidance as context, holding what the command itself wrote (a
  builtin's bad-option subject excepted, D060), and appends one counted row to an ignored local file. It refuses nothing
  and prints nothing to the terminal. `plan failures` prints the counts,
  labelled local.
- **A failed command.** The host runs no hook for a result it marks failed.
  The observer reads that result from the agent's own transcript and answers
  it at the next observed call, once, and counts it with the mark.
- **The classes.** Sixteen kinds, read from the retained record: a pattern
  that matched no file, as an option's value, a file operand or inside an
  unquoted heredoc; a word that begins with an equals sign; a parameter zsh
  did not split; a colon or a bracket after a parameter; backquotes that ran
  inside double quotes; an assignment to `path` or `status`; bash's own
  parameters and builtin options; parentheses read as a file pattern; and
  the refusals that are not about how the command was written, which are
  counted and not answered.
- **The baseline.** Judged by the landed classifier over the transcripts this
  machine retains, with the third-repair classifier at 2026-09-29T20:17:44.988Z: 600 of 44,235 commands in top-level Claude Code sessions (13.6 per thousand), 1,936 of 100,727 with subagent threads (19.2), and 298 of 27,735 in Codex (10.7). Earlier baselines remain in the structured history.
- **Observed.** A probe on the installed host shows a hook's context reaches
  the model after a command and after a failed command, and that a terminal
  message does not. In the historical second-repair session both routes answered and
  wrote their rows; the third repair checks generated delivery and makes no new live-model claim.
- **Limits.** The answer to a failed command arrives one observed call late:
  395 of the 1,936 baseline commands with subagent threads, and 261 of
  the 276 of the class that stops its command. A word-splitting mistake leaves a
  diagnostic only where the whole value names a program or a file. Under
  Codex only the rule applies. The count is local and a lower bound.

Registering the host's failed-command event, which would answer at the failed
call itself, stays FUP-74e984d94ea97de5. Its precondition is an observation of
how Copilot treats that event in the registration file both hosts read, and
every Copilot launch is the operator's own (WO-146).

## What the interventions were about

The survey's result for planning is its subjects, not its counts
([D022](decisions.md)). The 303 correction and failure-instruction episode pieces
group into 30 themes ([intervention-subjects.md](intervention-subjects.md)):
193 pieces are recurring agent behaviour, 61 are defects in the product or
tooling, and 49 are about how agents handled an earlier intervention. Ten
themes are fixed by a landed order or rule, 16 partly, two are tracked, one
is a candidate and one is covered by nothing (provider safeguard refusals).
Six recurred after their fixing order's final review, and three declined
register rows saw their recurrence conditions occur. Every cited register
row, order and file was checked. The themes are the executor's reading
through agents, which the operator accepted as good for now;
FUP-0748081bdb00632d hands the map to a planning pass.

## Candidate interaction shapes

Start with the [readable collection](interaction-shapes.md); the
[structured collection](interaction-shapes.json) carries provenance and history.
The repair revised all 14 candidates at the operator's direction ([D027](decisions.md)):
each now states a proposed behavioral mechanism, modeling assumptions and a
condition that changes the pattern. Permission models authorization checked
against wording; Overshoot carries state through a feedback loop; Distraction
shows an aside cancelling a goal; Unseen models learning from selectively
retained feedback. Their parameters are illustrative, and the operator has not
confirmed these mechanisms.

The displayed pipelines and output marbles pass 30 paired and boundary examples
with RxJS 7.8.2 installed only in session scratch. The examples establish stream
semantics, not psychological validity. Previous expressions and variants remain
in each shape's history. FUP-8582f2042a235019 retains the continuing collection
and the operator's twin direction as a planning candidate.

## For the final review

- The second repair minted FUP-74e984d94ea97de5 (the failed-command event,
  D033) and added a reopening observation to three rows, whose conditions
  have occurred: FUP-eb6f41ea2dcbabd6 (D028, by D034 and D039),
  FUP-a87bd8daf6adf223 (D029, by D035) and FUP-07fbe74aa4440d5e (D030, by
  D036). D040 adds an observation to FUP-74e984d94ea97de5: the failed
  command is answered inside this order, and the row still holds the answer
  at the failed call itself.
- The review of the repair returned 32 findings, 23 of which stood. Each is
  repaired in this order ([D038](decisions.md), [D039](decisions.md),
  [D040](decisions.md)); none is moved to another order.
- Criterion 11 entered by amendment (D033, bound by its PlanExecutionAmended
  row of 2026-09-29T16:24:30Z) and its limits were restated by a second
  (D038, bound by the row of 2026-09-29T19:12:18.247Z). It moves the skeleton to `0.45.1` with the
  console's pin and the lockfile, regenerates 13 hook files and the manifest,
  re-mints the authority edition as WO-172 001 and then 002 and raises the reviewer's
  cold-start ceiling to 28,884; the roadmap's paragraph for the scope
  expansion replaces the activation paragraph's statement that nothing of
  the kind changes.
- The operator's messages of the second repair are entries 29 onward of the
  ignored capture named below, which holds 39 entries, the three messages the review named and the five sent since among them.
- Corrections recorded during the second repair: [D031](decisions.md),
  [D032](decisions.md), [D036](decisions.md) and [D040](decisions.md).
- Follow-ups this order minted, twenty-three rows: the four named above, the
  twelve below, and seven the repairs minted later (FUP-42079a068929081b D034,
  FUP-4a5df0114c411df3 D037, FUP-e42645118711be72 D042, FUP-320a0f6be5198baa
  D043, FUP-86ac0c6cccd9c541 D051, FUP-b6d0e2ca54007892 D052 and
  FUP-d90c46abf5658272 D053; counted by the final review, D060). The twelve:
  FUP-84ea5fb168c317cf (how the operator's interventions reach the record,
  D013), FUP-0c76cd39223a576b (the operator's own classes and a context
  model beyond the session, D018), FUP-b3454d6ce3594ef3 (the reader's
  held-out shortfall, D006), FUP-c1ce08180deefe81 (the ideation's map
  candidate, D017), the survey's three candidates (D023):
  FUP-0748081bdb00632d (dispose the subject map), FUP-6332681e9500a84b (stop
  retrying after a provider safeguard refusal) and FUP-8582f2042a235019 (the
  shapes collection); and FUP-f287a595299249ff (operator words beyond
  this order's route, D008), FUP-9cb0a7e667913624 (D009), FUP-a9412a7815418c21
  (D010), FUP-a6cf30a8b7bc4a83 (D014) and FUP-e701c2768c38748f (D024).
- Criterion 10 entered by amendment (D021, bound by its PlanExecutionAmended
  row of 2026-09-29T03:50:44Z), as criterion 9 did (D012).
- The operator's messages from this dispatch sit unedited, three employer
  references removed, in the ignored intake
  (`docs/intake/notes/WO-172-operator-messages-2026-09-29.md`, two
  screenshots under `docs/intake/images/`), reconciled into main with the
  ideation capture.
- FUP-71fc2efc208f597a, the row this order was allocated from, has had its
  reopening condition occur ([D008](decisions.md)); the four register rows
  whose source revision moved are listed there and in [D007](decisions.md).
- The ideation capture `docs/intake/notes/WO-172-expanded-ideation-2026-09-29.md`
  sits in this worktree's ignored intake and is reconciled into main at
  final review or release close ([D017](decisions.md)).
- Corrections recorded during this dispatch: [D011](decisions.md),
  [D015](decisions.md), [D016](decisions.md), [D019](decisions.md),
  [D020](decisions.md) and [D022](decisions.md).

## Reproduce

- `npm run plan -- failures --all --until 2026-09-28T04:00:00.000Z`
- `npm run plan -- failures` (the default window, from receipt 034)
- `node --test docs/evidence/WO-172/survey-repair.test.mjs`
- `node --test-name-pattern='WO-172' scripts/test-plan-refutation.mjs --fixtures-only`
- `node --test --test-name-pattern='WO-172|WO-170' scripts/test-process-debt.mjs`
- `node --test --test-name-pattern='WO-172' scripts/test-harness.mjs`, after `npm run build`
- `npm run plan -- failures --since 2026-09-31`, which is refused

## Historical release receipts retained during integration

These prior receipts moved from the roadmap into this order's evidence under the integrated WO-086 release-history rule. Their assigned targets and component statements are historical; the current target is v0.56.2 and skeleton is 0.45.2.

**WO-172 activation completion (2026-09-29):** assigned application `v0.54.1`,
the next patch above the observed local `v0.54.0` tag. `npm run plan -- failures`
pages the failed judgments, repairs, corrections, off-ramps and execution
amendments since the latest planning receipt from the public record, `plan start`
prints their counts, the meter gives every order its failed judgments, repairs
and recorded corrections, and the direction count reads the operator step a
lifecycle dispatch names. No component version changes and no edition is
re-minted. Independent verification, final review and publication remain
separate dispatches.

**WO-172 collision retiming (2026-09-29):** unpublished target `v0.55.1` is superseded by `v0.56.1` under the existing patch classification because the observed release baseline is `v0.56.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-172 scope expansion (2026-09-29):** by the operator's direction the order also answers and counts what the shell says about a command as written. `CLAUDE.md` gains a hand-written rule that commands run under zsh; under Claude Code the observer hands the agent the guidance of each class of diagnostic the shell printed and appends a counted row to an ignored local file; a command whose result the host marked failed is answered at the next observed call; `plan failures` prints those counts, labelled local. Nothing is refused. Skeleton `0.45.0` to `0.45.1` is a compatible patch for the observer's added context and count; the console pin and the lockfile follow. The authority edition is re-minted deterministically; the feedback, artifact-identity and verification editions stay current. This replaces the activation paragraph's statement that no component version changes and no edition is re-minted.

**WO-172 collision retiming (2026-09-29):** unpublished target `v0.54.1` is superseded by `v0.55.1` under the existing patch classification because the observed release baseline is `v0.55.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.
