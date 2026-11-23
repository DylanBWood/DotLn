# the kit keeps working — 2026-11-23

## Dispatch and capture

The operator opened this pass with a `planning:` dispatch on 2026-11-23 at
20:27Z and sent two more messages in the next two minutes. Paraphrased, the
first says that the operator is out of patience: the work instance stops
after seconds, decides not to work and asks the operator to do something
every couple of minutes; the order in progress has been going round in
circles; on every order the operator is asked to waive criteria that are
either pointless or needed and unobtainable; and the platform as a whole
has failed since its last two or three releases.

The second asks for a standard planning pass and adds five items:

1. The first time the operator used `drive:`, it did not start. Pasted
   with it: another session's diagnosis, that main's driver reads WO-288's
   configuration with main's older validator.
2. The work instance's troubles. Pasted with it: that instance's own
   write-up of its eighth order, with eight root causes and eleven requests
   for core, and two entries of its `FOR-CORE.md`.
3. The work instance says one thing and then goes idle, every time, always
   ending with a question, never working longer than about ten seconds.
4. New worktrees on the work instance are created from the first commit of
   the repository and not from its latest, and the operator asks whether
   that is written into the order's text.
5. The criteria of the orders: each time, the operator is asked to waive
   some, and puts that down to the planning session that wrote them.

The third message adds a sixth item:

6. A session on the work instance decided that an order's heading, which
   still said its version is assigned at activation, had to be brought up
   to date. The command that normally does that said it would change no
   file, so the session changed the heading by hand, and now it cannot get
   out of the state that left.

The captures are in ignored intake, and each digest below is also the digest
of the session journal's row for the message (session key
`41dc94638b89d77d6c38ff29668f77334656486419c19e7fb95c0d8dfcedd4f4`):

| Message | Journal row | Bytes | SHA-256 |
| --- | --- | --- | --- |
| The dispatch | 2026-11-23T20:27:45.530Z | 539 | `5d6bd373661f0b7225d59bf50243082a74c5df390ce3110c26c0f4815e63b433` |
| Items 1 to 5 | 2026-11-23T20:27:49.232Z | 21,479 | `0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270` |
| Item 6 | 2026-11-23T20:29:27.216Z | 369 | `a7e16cc14c8cf5800a2a39201e312a69072b09aff9854b2bcef345cff3ed2247` |

The second message's journal digest covers the operator's words together
with two blocks other sessions wrote. Its capture file holds the words
alone, with a line naming each block where it stood (1,199 bytes, SHA-256
`792b8214e72b6864a0923c1e948201f1005cc650a3575a8c259f8bf3c0131e7c`), and the
blocks are kept whole in the ignored local planning lane: the diagnosis of
the drive (1,012 bytes, SHA-256
`2b32d7f2aedf1109240d70d3d2e93c1206ecd63d43c007718aab9bebbc858f91`) and the
work instance's write-up with its two entries (19,691 bytes, SHA-256
`2d7648457fe0f52aa2ef9992805b21cf471cab27cf993712661f5e5ba584c16c`). The
words with each block put back between its fences, inside the host's
pasted-content wrapper, reproduce the journal's digest, which this pass
checked.

The write-up was read under the clean-room screen before anything else was
done with it. It holds no code, configuration, address, credential or name
of the instance's owner's systems. It does hold a short commit id, two
capture digests, a pull request's ordinal and a one-line description of
what that order built, and none of those is repeated in a committed file:
what this pass takes from it is the kit's own behavior, each claim checked
against this repository's source before it is used.

## Readings

Five research workers read for this pass, each the `default` worker (the
host reported claude-opus-5-5), read-only, and their reports are kept
beside this document as records:
[WO-288's eleven verifications](the-kit-keeps-working-2026-11-23-wo-288-loop-study.md),
[the criteria that ended unmet](the-kit-keeps-working-2026-11-23-criteria-census.md),
[ten kit behaviors an instance reported](the-kit-keeps-working-2026-11-23-instance-claims-check.md),
[what tells a session to stop and ask](the-kit-keeps-working-2026-11-23-stop-and-ask-census.md)
and
[the critic of the critics](the-kit-keeps-working-2026-11-23-critic-of-the-critics.md).
Each is a worker's reading. What this pass checked itself is said below
with the file or the command, and the rest is cited as the worker's. The
host refused each worker's own write of its report, so the pass filed
them as returned.

### What the record shows since the last pass

`npm run plan -- failures` refused at entry: "one failure item exceeds the
planning page budget". Its `--export` form worked. The largest of its 43
items is 242 bytes, so what outgrew the 8,192 bytes a page may hold is the
page's own summary (`bounded` in `scripts/lib/planning-followups.mjs`).
The command every pass is told to read first prints nothing, and that is
a named boy-scout item of WO-293.

From the export, since receipt 070 of 2026-11-16:

- WO-284 and WO-287 were made ready, and both failed their first
  verification. Three verifications failed in all.
- Two final reviews recorded eighteen findings that verification had let
  through.
- Twenty-five corrections were recorded.
- The journals hold 140 messages from the operator to working sessions,
  84 during WO-287 and 40 during WO-284.

WO-288's journals lie in its worktree and are in none of these counts.

`npm run plan -- conditions` gave the complete run's thirty-day median as
2,386.8 s against a threshold of 360 s. Eight of its conditions read
`unknown`, because the reading's own time ran out under a host load near
6. `gh issue list` returned no open issue, and the start wrote no red tag.

### Why the drive did not start

Confirmed, with a second cause the first one hid.

- **The first cause.** Main's lookup of an order's worktrees loads that
  worktree's whole configuration with main's validator.
  `resolveOrderWorktrees` (`scripts/lib/order-worktrees.mjs`) asks for the
  order's target registry in the order's own worktree first;
  `targetRegistryPath` (`scripts/lib/target-worktrees.mjs`) builds that
  path through `docRelative` (`scripts/lib/config.mjs`), which calls
  `loadConfig` on the worktree; and `validateConfig` refuses any top-level
  key outside `SECTION_KEYS`. WO-288 adds the section `kinds` and uses it
  in core's own configuration.
- **Reproduced.** From this checkout, `loadConfig` on WO-288's worktree
  answered `unknown configuration key "kinds"` with main's list of known
  keys, and `resolveOrderWorktrees` threw the same. The pasted diagnosis
  was right.
- **Who else calls it.** The drive, its status and its account, the hook's
  order-worktree grant and the release close call that lookup. The
  integration that an executor and a final reviewer run from main builds
  its paths the same way (`scripts/lib/worktree-integration.mjs`), so
  WO-288 will meet the refusal again when it integrates. That is read, not
  run.
- **Why now.** Earlier orders that added a key (the `stops` section is
  one) did not use it in core's own configuration, so no worktree's file
  ever held a key main did not know.
- **The second cause.** With the primary checkout on this pass's branch,
  `node scripts/drive.mjs why WO-288` printed "Drive stopped: no
  main-branch control-plane worktree found". The same function requires a
  worktree on `main` unless its caller says otherwise, and the drive's
  callers do not. A planning pass holds the primary checkout on its branch
  until someone switches back, so no drive runs meanwhile.

WO-294 carries both. Until it lands, an order of core's that adds a
configuration key is run by its phrases in its own worktree, as WO-284 and
WO-287 were.

### Why WO-288 did not converge

From [the study](the-kit-keeps-working-2026-11-23-wo-288-loop-study.md), a
worker's reading of that order's record; this pass read the eleventh
report's verdict and findings, the order's criteria 23 and 34 and its
frame's rules 9 and 10 itself.

- **What happened.** Eleven verifications, all failed. 76 blocking
  findings and 130 follow-ups. Blocking findings by round: 16, 13, 7, 3, 5,
  9, 4, 4, 3, 5, 7, with no fall after the fourth. From activation to the
  last event 110 h 33 min: 22 h 7 min of implementation, 8 h 22 min of
  verification, 48 h 6 min across ten repairs, and the rest idle between
  phases. About 2.5 billion tokens where a count is recorded.
- **Where it stands.** The eleventh report finds 39 of 41 criteria met.
  Criterion 23 (Part D) and criterion 34 (Part F) fail, with two
  regressions against `main`. Each of the seven open findings has a repair
  decision with a case that fails before and passes after.
- **No report repeats a reproduction; the classes repeat.** Criterion 23
  failed in ten rounds, each time at a site the round before had not
  named. Criterion 34 failed in eight, each time at a publication state the
  round before had not named. The review recorder failed in nine,
  alternating between too strict and too lenient.
- **Criterion 23 claims a property of an open set.** Its text asks for a
  row "for each time limit the kit ships outside the gate path" and then
  names its method, "by cases for one lifecycle command, one hook's child
  process, one worker launch and one shipped test's fixture child". The
  verifiers held every site to the property (WO-288-D218), the table grew
  from 262 rows to 287, and the scan now reads 660 shipped files. Four
  cases cannot settle a property of every site, so each round samples
  further and nothing ends the sampling. The planner who wrote that
  criterion wrote the loop.
- **Criterion 34 has two states and the world has more.** It names a
  branch never pushed and a branch pushed. Verifiers found a failed read of
  the origin, a draft and a draft at the reviewed commit in turn. It is
  one of the eight criteria of Part F, added in execution.
- **Sixteen findings were regressions a repair introduced**, caught by
  comparison with `main`, most of them in readers that several parts
  share.
- **Every round read everything.** The frame's ninth rule, which the pass
  of 2026-11-16 wrote, has the verifier read with a worker for each part
  and then send workers over whatever those left unread. It makes no
  exception for a verification after a repair. The eleventh used ten
  readers over all 726 changed paths. Product 07 has said since 2026-10-07
  that a re-verification reads the repair and carries untouched claims,
  "so a repair loop ends when the criteria hold", and the verifier's own
  step 2 says at every dispatch to attack each criterion. This pass
  searched the emitted verifier root for the re-verification rule and
  found nothing.
- **No way out was used.** A defect record was proposed four times and
  declined, because none of the five classes fits. The cut of a part,
  which the frame's tenth rule gives, was not proposed.
- **Size.** 41 criteria in six parts, two of them added after filing.
  Verifications by criteria count, from the control logs of the last eight
  orders filed that ran, read by this pass:

  | Order | Criteria | Verifications |
  | --- | --- | --- |
  | WO-281 | 6 | 1 |
  | WO-282 | 5 | 1 |
  | WO-277 | 4 | 2 |
  | WO-284 | 10 | 2 |
  | WO-260 | 7 | 3 |
  | WO-287 | 27 | 3 |
  | WO-276 | 133 | 7 |
  | WO-288 | 41 | 11, not ended |

**What this pass does about it.** Product 07's ninth rule of the queue
form now says what a verification after a repair reads, and its tenth has
the executor weigh the cut when a criterion comes back twice. Two screens
are added for a criterion over an open set and for an order's size.
WO-293 puts the re-verification rule into the verifier's step and its
briefing, adds a sixth defect class and shows the ways out at the second
return.

**The one decision that is the operator's.** WO-288's order text can
change only on the operator's word. This pass recommends that word, given
in WO-288's own session, to this effect:

1. Criterion 23 is judged by the four cases its text names and by the
   rows the limits table holds at the checkpoint in hand. A site found
   after that is a follow-up row and no blocking finding.
2. Criterion 34 is judged on the two states its text names. Another
   publication state a verifier constructs is a follow-up.
3. The next verification reads this repair: it reproduces the eleventh
   report's seven findings, re-derives the criteria whose surfaces the
   repair changed and carries the rest.
4. The integration before the handoff runs the worktree's own
   `scripts/worktree.mjs`, since main's refuses the key this order adds.

The executor records that as the authorization, runs `amend-order`,
finishes the repair it has begun and hands off. The reason to finish
WO-288 and not to park it: it is two criteria from a pass, its change
touches 330 tracked files that every later order would have to merge
around, and its Part F holds the sentences an instance has waited on
since 2026-11-19. What would show this recommendation wrong: a twelfth
verification under it that fails on a criterion other than 23 or 34.

### Why a session stops and asks

From [the census](the-kit-keeps-working-2026-11-23-stop-and-ask-census.md),
with the texts below read by this pass in their source files. Core cannot
see the instance's sessions. What it can show is what the kit tells every
session, in an instance as in core.

- **A day's figure, once reached, tells every role at every prompt to end
  its turn.** Where an instance's `docs/control/budgets.json` sets
  `spend.daily`, each prompt's facts carry the day's use, and at the
  figure they add "finish the step in hand, write the standing and end the
  turn" (`renderDailyUse` in `packages/skeleton/src/observed-facts.ts`).
  The executor's root says the same. The operator laid the instance's
  stopped turns to this text on 2026-11-19 (WO-288-D049), and the fix was
  written the same day as WO-288's Part F. It has shipped nowhere, because
  WO-288 has not passed. The usage row of this pass's own session counts
  15.4 million cached input tokens in a total of 15.8 million after 22
  minutes, so a figure set in tokens is reached early in a working day.
  That the instance's figure is in tokens is not known here.
- **The executor is told to announce and then make room.** Intent to Act
  has it proceed "after current work and a reasonable steering
  opportunity", and Operator Check-In has it offer that opportunity
  "through available asynchronous input or a turn boundary" before each
  queued item (`packages/skeleton/src/loadouts/executor-supports.ts`, both
  on by default). The dispatch briefing and the hook's dispatch context
  repeat the announcement. A session that takes the turn boundary says one
  line and stops. These texts date from 2026-09-09.
- **`analysis:` holds a session until the whole prompt `analysis: off`.**
  Any prompt that opens with the prefix enters it. Every later prompt of
  that session is told "Pause the current routine … do not resume it
  automatically", and the kit's hooks are skipped, so a `resume: next`
  typed then is not dispatched (`packages/compiler/src/operator-control.mjs`).
  Since v1.4.0 the drive's account and the router's root send the operator
  to an `analysis:` session to read further.
- **An advisory reads as a request to the operator.** In an instance most
  stops advise since v1.4.0. The advisory is the refusal's body with one
  sentence appended, so beside "the work goes on" it still says "The
  operator can authorize proceeding in ordinary language" or "or wait for
  it to finish". The host's reference says a hook's `systemMessage` is
  shown to the user, so these lines are written to the operator.
- **The rule that says to go on reaches the executor alone**, in WO-288's
  uncommitted text. On `main` the shared rule `blocked-turn` tells every
  role to state a block and end its turn. WO-287-D090 recorded the failure
  as a critical error on 2026-11-18 and asked for the rule in every role,
  and that follow-up sat untriaged until this pass.
- **An instance that removes the author's layer loses the sentences that
  say to decide and go on**, while the two supports above stay.
- **A sentence did not hold by itself.** WO-288-D168 records a turn that
  ended with work owed for 43 minutes after the executor's rule was in
  that worktree's root. The Stop hook lets every turn of a main session
  end (`packages/skeleton/src/harness-host.ts`, the `finish` path).

The role text itself barely moved between v1.1.0 and v1.4.0: four lines
across three roots, by the census. What changed in v1.4.0 is in the hooks
and the configuration: advisories in place of refusals, the removable
layer, and the `analysis:` nudge. Which of these the instance is meeting
cannot be told from here. The answer to the instance below names the
observation that settles each.

WO-289 changes the texts. WO-290 has the Stop hook send a session back
once when its dispatch is unfinished. WO-288's Part F carries the day's
figure.

**The sequencing error.** Product 07's rule for the queue form, written by
the pass of 2026-11-16, says that an order an instance is stopped on is
filed by itself, ahead. On 2026-11-19 the fix for the instance's stopped
turns was added to WO-288 as a part, while that order was at its end step.
It has waited there four days. The rule now says that it holds while an
order runs.

### Where a target order's worktree starts

Confirmed, and the operator's guess is right: the commit is written in the
order's text.

- An order against a registered repository carries
  `**Repository:** <id> @ <base-commit>`, and
  `scripts/lib/work-order-repository.mjs` admits no other form.
- `worktree start` creates the target worktree at that commit
  (`targetStartPlan` in `scripts/lib/target-worktrees.mjs`, used by
  `scripts/worktree.mjs`), and the activation records it.
- The same start fetches and fast-forwards `main` for the launchpad's own
  worktree, and does nothing of the kind for the target's clone.
- No document a planner reads says which commit to write. This pass read
  product 07, `docs/KIT.md`, the planner's root, the order template and
  the workstream and repository conventions; product 07 alone names the
  line, and gives only its form.

So each order of a wave carries whatever commit was current when its pass
wrote it. An order filed while the repository held one commit starts
there however far the base branch has moved. That the instance's orders
were filed that way is an inference from the code; its record was not
read. Bringing the line up to date is a change to judged bytes, which the
operator must authorize each time. WO-291 has the line name the repository
alone and the start resolve the base branch's tip.

### A heading that promises a version

The sixth item, read against the code. What the instance's session met
was not observed.

- `docs/work-orders/TEMPLATE.md` and the derived contract end every
  order's heading with "(version assigned at activation)".
- For an order against a target, `npm run release -- prepare --local`
  prints "target order records no release; no files changed"
  (`scripts/release.mjs`). Nothing ever replaces the placeholder, and no
  check asks for it to be replaced: the index reads such a heading as
  `unassigned` and refuses nothing.
- The planning check admits one change to a judged heading, a `(vX.Y.Z)`
  label in the placeholder's place (`releaseAssignment` in
  `scripts/lib/plan-continuation.mjs`). Any other edit is refused as
  "planning pass needs a receipt matching the current subject: existing
  work-order bytes changed", which names no line and no route and reads as
  a call for a new planning pass.

The kit told that session two things that cannot both be acted on: a
heading that says a version is coming, and a command that says no file
changes. WO-291 takes the placeholder off a target order's heading and has
the refusal name the line and both ways out. The way out today is in the
answer to the instance.

### What a driven target order meets

The instance's account of its eighth order gave eight root causes and
eleven requests. This pass restated them as ten claims about the kit and
had each checked against this repository at v1.4.0 and at the v1.1.0 the
instance ran ([the check](the-kit-keeps-working-2026-11-23-instance-claims-check.md)).
The lookup's working directory and the kit guide's sentence on a target
worktree's levels were read by this pass.

| Claim | Verdict | What this pass does |
| --- | --- | --- |
| 1. A drive starts every phase of a target order in the target worktree, under its guard, which refused the order's commands | Confirmed. At v1.4.0 most of those forms advise in an instance, but a worktree an earlier kit installed keeps its old refusals until the target emit runs again, and no command says so. A Read-tool read outside the order's roots is refused at every level | WO-292; a route today in the answer below |
| 2. Nothing checks that an order's commands can run under the phase's route | Confirmed | A register row: with the guards at the owner's levels the lane refuses little |
| 3. A refused phase is recorded as completed | Partly: the attempt is recorded unfinished, and the drive dispatches once more and stops with a text that names no refusal | WO-292 |
| 4. A pass is accepted from a session that could not run the checks | Confirmed. This pass read `judgeReport`: a pass needs no line for a criterion, and nothing reads the session's refused calls | WO-293 |
| 5. The dispatch bound counts time nobody worked | Partly: it compares worked time, the refusal does not print its basis, and a session in a target worktree is invisible to the idle reading | A register row: the bound advises in an instance since v1.4.0 |
| 6. No command undoes a recorded final review, and an override record can land on another order | Confirmed | A register row: an unusual path, met once |
| 7. Review rounds lack provenance | Partly | A register row |
| 8. Process cost reads unknown although the drive holds each attempt's | Confirmed: a session in a target worktree is not found by the usage reader | WO-292 for the reader; the sum of a drive's attempts is a register row |
| 9. The attested effort is the host's variable | Partly: whether the variable can differ from the effort that ran is unobserved | A register row |
| 10. The update preview refuses a local change without saying the incoming kit already holds it | Partly | Already a register row of WO-288's Part F, with WO-207 |

Claims 1, 2, 4, 5, 8 and 9 lie on every target order's path.

### The criteria that ended unmet

From [the census](the-kit-keeps-working-2026-11-23-criteria-census.md).
This pass read `judgeReport` and counted the verifications of the last
eight orders from their control logs.

- **The committed record is thin, and its newest end is bad.** Five
  waivers on four orders and five defect records, all of the class
  `contradiction`: seventeen criteria on 12 of 227 closed orders. By filing
  pass the share of orders with such a record went from 4.8% to 6.7% and
  then to one of the two orders run since 2026-11-16, two of three with
  WO-288. Core's record supports the operator's sentence for the latest
  orders. What the instance's sessions asked for was not read.
- **The usual shape.** In eight of the eleven criteria that ended waived
  or defective, one clause failed while the criterion's other clauses
  held. The failing clause was a detail: a figure, a tool's output form,
  the place of a test, a pinned existing test, a universal, or wording
  another order took.
- **The screens that were in force named four of them and caught none.**
  The five-class screen of 2026-11-01 ended the figure-with-a-unit
  criteria. Every record since is a contradiction, which no pattern reads.
- **How the last eight orders' 225 criteria are written**, by the census's
  count: 61% hold two or more separately failable clauses, 46% claim
  something of every or each member of a set, 39% prescribe what is
  printed or said, and 12% hold existing cases unchanged. WO-276, WO-287
  and WO-288 hold 193 of the 225.
- **First failures were not about defective criteria.** None of the five
  failed first verifications rested on a clause that was later waived or
  recorded defective.

The planner's part is plain. The pass of 2026-11-16 wrote WO-288's
criterion 23, wrote the frame's ninth rule, and filed a third order of a
form whose first had taken 42 hours and six repairs. Five screens are
added to product 07 and the template's criteria line now says them where
a planner writes. The six orders this pass files hold six to ten
criteria each, one behavior to a criterion.

### The critics' record

[The critic of the critics](the-kit-keeps-working-2026-11-23-critic-of-the-critics.md),
launched on the brief the last pass kept, read 310 critic points written
since then: 4 of that pass's own critic, 17 of WO-284, 63 of WO-287 and
226 of WO-288. The operator received 52 whole reports in seven days. Its
verdict is that the loop still does not close: every change the last pass
assigned to it is in WO-288's Part A, which has not merged, and Part A as
built moves accepted points into the register and checks nowhere that a
remedy held. A change held where it was a command's default or a sentence
in the step itself. It failed where it was a sentence in a decision, a
script left in session scratch, or a role sentence that a hook or an
order's form contradicted at the moment of choice.

Its seven recommendations, each disposed:

| Recommendation | Disposition |
| --- | --- |
| 1. A criterion returned twice names the ways out | WO-293, criterion 6; product 07's tenth rule of the queue form, in this pass |
| 2. The critic's charter judges whether each accepted remedy held, and stops re-raising what it has judged | Deferred: the charter is `scripts/kit/critic.md`, which WO-288's Part A is changing. Reopen: the first pass after WO-288 closes, which reads Part A as merged |
| 3. A question put to the operator is not a block | WO-289, the rule `turns` |
| 4. A final review fails on a blocking defect | WO-293, criterion 7 |
| 5. The part checkpoint prints the suites whose declared sources changed | Declined for now: the orders this pass files are not in parts. Reopen: an order in parts is filed |
| 6. The hook's question context says what the role says | WO-289, criterion 4 |
| 7. One register row for an order and class | Deferred with the second: it changes what Part A mints. The register would go from 25 untriaged rows to 249 when WO-288 merges as built |

The seventh is a warning as well as a recommendation: WO-288's merge will
add 184 rows to a register that already holds 325 pending. The first pass
after it closes reads them by class and not one at a time.

## Orders filed and amended

Six orders, each single, none of the queue form. An instance is waiting on
the first four, and the form's own rule keeps what something waits on out
of it.

| Order | What it answers | Criteria |
| --- | --- | --- |
| [WO-289](../../work-orders/WO-289-a-session-is-told-to-go-on-and-ends-its-turn-only-for-what-the-operator-must-do.md) | Item 3: every text the kit gives a session about a turn says to go on; an advisory asks the operator for nothing; `analysis:` ends at a dispatch | 10 |
| [WO-291](../../work-orders/WO-291-a-target-order-starts-from-its-base-branchs-tip-and-its-heading-claims-no-version.md) | Items 4 and 6: an order names its repository and starts from the base branch's tip; a target order's heading promises no version; the refusal of changed order bytes names its routes | 10 |
| [WO-290](../../work-orders/WO-290-a-turn-that-leaves-a-dispatch-unfinished-goes-on-once.md) | Item 3, the mechanism behind the sentences: the Stop hook sends a session back once when its dispatch is unfinished | 6 |
| [WO-292](../../work-orders/WO-292-a-driven-target-phase-can-run-its-orders-checks-and-a-drive-a-guard-stopped-says-so.md) | Item 2: a target worktree's guards follow the launchpad's levels; a drive a guard stopped says so at once; a session there gets its usage read | 8 |
| [WO-293](../../work-orders/WO-293-a-verification-ends-a-repairs-verification-reads-the-repair-and-a-criterion-returned-twice-names-its-ways-out.md) | Item 5 and the order in progress: a verification after a repair reads the repair; a sixth defect class; the ways out at the second return; a final review that fails on what it finds | 10 |
| [WO-294](../../work-orders/WO-294-main-works-on-an-orders-worktree-whatever-its-configuration-holds-and-a-drive-starts-from-a-checkout-off-main.md) | Item 1: main reads the roots alone of an order worktree's configuration; a drive starts from a checkout that is off main | 7 |

Every path each order names was checked against the tree at `bc761ad9c`:
all exist but each order's own evidence directory, which the order
creates. The six execution-plan labels end in a colon inside the bold,
the form the kit's reader takes; they were first written with a period,
the mistake the last pass recorded as its thirteenth candidate, and were
corrected before the subject was committed.

No order is amended by this pass. WO-288's text changes only on the
operator's word, given in that order's session (§Why WO-288 did not
converge).

## Register

The register held 25 untriaged rows and one awaiting review at entry.
`npm run plan -- followups --sync` minted fourteen more from this pass's
candidates. One batch of 43 dispositions was applied at register revision
`296d3bf9d012bd56e2d625bd63f8ca6fb0cc38cf974885ff8b585259bdc0a34b`; the
batch is kept in the ignored planning lane.

- **Allocated, three.** FUP-64e6bd4cfc576948 (WO-287-D090, the rule on
  turns) to WO-289. FUP-67b1b6cf60bba81f (WO-287-D091, a final review that
  became a repair) to WO-293. FUP-54b3c0389e21ee0d (WO-287-D079, a
  sentence of the kit guide) to WO-292.
- **Settled, two.** FUP-65f7511f598b6b16 and FUP-3a53a5f411295493, records
  of what WO-284 built that name no action.
- **Re-disposed under a new row, four.** The drive's architecture
  (FUP-6b0880cd686436b7) and three candidates of 2026-11-16 whose
  conditions occurred or asked to be read first: a part released at its
  boundary, the complete run's duration, and a place for a lesson of
  conduct.
- **Deferred, each with its own decision's reopening condition, twenty
  of the rows found pending.** Four carry a note that one of their items
  is a named boy-scout item of an order filed here: the form of a
  decision's dispatch field (WO-289), a command that prints the session's
  operator-message rows (WO-293), the account printed when a drive stops
  on a thrown failure (WO-294), and a target worktree whose guards record
  no levels (WO-292, as its first criterion).
- **This pass's fourteen candidates.** Eleven deferred and three declined,
  as the map's section for this pass lists them.

Three conditions the last pass set were read:

- Its eleventh candidate asked to be read first. The complete run's
  thirty-day median is 2,386.8 s. Deferred once more, to the first pass
  after WO-288 closes, for the reason the map gives.
- Its tenth candidate's condition occurred: a second order of the queue
  form held back a part an instance waited on. Declined in favor of the
  rule.
- Its seventh candidate's condition occurred: a class came back within a
  week because its fix could not ship before an order did. Declined again:
  an instance's own instruction file is that place.

WO-088's first condition also occurred and is re-disposed in the sequence.
WO-014's has not been shown to: the operator's report is of turns that end
with a question, and whether the host's permission prompts are among what
is asked of the operator is one of the observations the answer below asks
for.

## Red tags

<!-- dotln-red-tags:start -->

```json
{
  "after": "docs/planning/passes/the-kit-stops-no-work-2026-11-16.md",
  "tags": []
}
```

<!-- dotln-red-tags:end -->

## NoOps

Each in the `NoOpIntent` shape: what was weighed, the evidence, and what
reverses it. The fourteen candidates in the map are NoOps of this pass and
are not repeated here.

- **Parking WO-288.** Weighed: withdraw or park it, as WO-244 was parked,
  and land the instance's fixes on `main` first. Evidence: it meets 39 of
  41 criteria, each open finding has a repair with a case, its change
  spans 330 tracked files that every later order would merge around, and
  the sentences an instance waits on are in it. Reverses: a twelfth
  verification under the recommended amendment fails on a criterion other
  than 23 or 34.
- **Filing the fixes as one order of the queue form.** Weighed: one order
  of five or six parts, to pay the cycle once. Evidence: the form's first
  rule excludes what an instance waits on, and the three orders of the
  form took three, seven and at least eleven verifications. Reverses: the
  operator's word.
- **Editing WO-288's criteria from this branch.** Weighed: amend criteria
  23 and 34 here, on the dispatch's complaint about the order in progress.
  Evidence: the dispatch names a problem and gives no word on those
  criteria; the order's decisions are 263 uncommitted records in its own
  worktree, where its executor is the writer. Reverses: nothing; the
  amendment is the operator's, in that session.
- **Recommending that the instance unequip the two executor supports.**
  Weighed as a route for today. Evidence: the adjacent queue's `start`
  refuses without a current announcement and a fresh check-in record
  whatever supports are equipped (`scripts/lib/adjacent-queue.mjs`), so
  removing the texts would leave a session unable to start a queued item
  and untold why. Reverses: WO-289 ships, which rewords them.
- **A cap on an order's criteria.** Weighed: refuse an order above a
  count. Evidence: eight orders are too few to place a threshold between
  ten and twenty-seven, and a count does not read what a criterion claims.
  The screen has the planner count and say why. Reverses: three more
  orders above ten criteria that each take more than three verifications.
- **The work instance's observations requested by a command.** Weighed:
  an order for a command that prints, from an instance's own journals,
  what ended each of its last turns, so that core need not infer.
  Evidence: none of the six items is undiagnosed for want of it, and the
  answer below names the four observations in a form a person can read
  off a terminal. Reverses: a second report from an instance that core
  cannot place among the texts it ships.

## Sequence

`docs/planning/sequence.md` is revised: WO-284 and WO-287 leave the list
as closed; WO-288 stays first; the six new orders follow in the order
WO-289, WO-291, WO-290, WO-292, WO-293, WO-294, ahead of the nine orders
that are not next. WO-088's entry there records that its first condition
occurred and why it stays. Two rules enter Rules in force (Criteria and
Turns), and the rule on the queue form gains a sentence: what an instance
is stopped on is never added to a running order.

The order among the six is the planner's: what stops an instance's
sessions first, then what starts its orders in the wrong place, then the
mechanism behind the first, then the target lane, then verification, then
the drive's start in core.

## Write-backs

- `docs/product/07-execution-guide.md`, "Operator-opened planning pass",
  the screens before filing: five added. One behavior to a criterion; a
  claim about every member of a set names the members or the check that
  fails closed; no existing case is held unchanged; a criterion added in
  execution is read against the list by the session that amends; and a
  pass counts an order's criteria before it files.
- The same guide, "The queue form": what an instance is stopped on is
  never added to a running order; the ninth rule says what a verification
  after a repair reads; the tenth has the executor weigh the cut when a
  criterion has come back twice.
- `docs/work-orders/TEMPLATE.md`: its first criterion line says the
  screens where a planner writes criteria.
- `docs/planning/sequence.md` and `docs/planning/work-order-map.md`, as
  above, and the ledger's registration heading.

Written by the orders and not by this pass, because the code does not yet
do what the text would say: the two forms of the `Repository:` line and a
target order's heading (WO-291), the sixth defect class (WO-293), and what
ends `analysis:` (WO-289).

## Rules recorded

Three rules entered the sequence's Rules in force in this pass. None is
the operator's wording. Each is the pass's answer to an item of the
dispatch's second message, and is recorded against that message so that the
operator reads all three in one place and strikes any by removing its
entry.

<!-- dotln-rules-recorded:start -->

```json
[
  {
    "rule": "A criterion states one behavior and the command that shows it; a claim about every member of a set names the members or the check that fails closed; no existing case is held unchanged; and a pass counts an order's criteria before it files.",
    "document": "docs/planning/sequence.md",
    "section": "Rules in force",
    "message": {
      "sessionKey": "41dc94638b89d77d6c38ff29668f77334656486419c19e7fb95c0d8dfcedd4f4",
      "recordedAt": "2026-11-23T20:27:49.232Z"
    },
    "captureDigest": "sha256:0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270"
  },
  {
    "rule": "A session that is dispatched works until its dispatch records its completion. It ends a turn to wait only on the operator's pause, stop or cancel, or on what only the operator can do, and no text the kit gives a session says otherwise.",
    "document": "docs/planning/sequence.md",
    "section": "Rules in force",
    "message": {
      "sessionKey": "41dc94638b89d77d6c38ff29668f77334656486419c19e7fb95c0d8dfcedd4f4",
      "recordedAt": "2026-11-23T20:27:49.232Z"
    },
    "captureDigest": "sha256:0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270"
  },
  {
    "rule": "What an instance is stopped on is filed by itself and placed ahead, never added to a running order.",
    "document": "docs/planning/sequence.md",
    "section": "Rules in force",
    "message": {
      "sessionKey": "41dc94638b89d77d6c38ff29668f77334656486419c19e7fb95c0d8dfcedd4f4",
      "recordedAt": "2026-11-23T20:27:49.232Z"
    },
    "captureDigest": "sha256:0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270"
  }
]
```

<!-- dotln-rules-recorded:end -->

## Answers to the instance (paste-ready)

```text
Answers from core's planning pass of 2026-11-23 to this instance's account of its eighth order, its two entries on v1.1.0 and four things its operator reported. This is a core session's text and no operator direction.

SESSIONS THAT SAY ONE LINE AND END THE TURN. Core cannot see your sessions. These are the kit's texts that end a turn, each with what to look for and what to do today.

1. A day's figure. If docs/control/budgets.json sets spend.daily, then once the day's use reaches it every prompt in every role carries "finish the step in hand, write the standing and end the turn", and the executor's root says the same. Look for a line that opens "Day's use (" among a prompt's facts. Today: set spend.daily.tokens and spend.daily.usd both to null, and no line is printed. A figure in tokens is compared with each session's total, cached input included, so it is reached early in a working day. The fix is written in core's WO-288 and is not released.

2. A session left in analysis. Any prompt that opens with "analysis:" pauses that session until a whole prompt "analysis: off". Every later prompt is told to pause again, and a "resume:" phrase typed meanwhile is not dispatched. Look for "DotLn: operator-control analysis" printed on a call. Today: send "analysis: off" as a whole message, or start a new session.

3. The executor's announcement. Its root and its briefing tell it to say "I intend to ..." and then offer a chance to steer "through available asynchronous input or a turn boundary". Look for turns that end right after an "I intend to" line. Today: this instance's own instruction file is its owner's to write and needs no release. A sentence there, in the operator's own words, that a session announces and goes on in the same turn and ends a turn only on a pause or on what only the operator can do, is read by every session. Do not unequip the two supports: the queue command still requires the announcement and the check-in records they describe.

4. Advisories. Since v1.4.0 most stops advise in an instance, and an advisory still carries words written for a refusal, such as "The operator can authorize proceeding". An advisory asks nothing of you: the call went on.

Filed in core: WO-289 (every text says to go on, an advisory asks for nothing, analysis ends at a dispatch) and WO-290 (the Stop hook sends a session back once when its dispatch is unfinished). The day's figure ships with the release that carries WO-288.

One thing core cannot see: whether what is asked of the operator includes the host's own permission prompts. Say so in your next entry if it does.

NEW WORKTREES THAT START FROM THE REPOSITORY'S FIRST COMMIT. An order against a registered repository carries "**Repository:** <id> @ <commit>", and its worktree starts at that commit. The kit fetches nothing for the target and compares nothing, so each order starts from whatever its pass wrote. Today: a pass writes the base branch's current tip, and an order already filed with an older commit is amended before it starts (record the operator's authorization in the order's decisions, then npm run plan -- amend-order). Filed: WO-291, after which the line names the repository alone and the start takes the base branch's tip.

A HEADING THAT SAYS "(version assigned at activation)" ON AN ORDER AGAINST A TARGET. Leave it as filed. Such an order records no release, npm run release -- prepare --local says so and changes no file, and nothing asks for the heading to change. If a session edited it: the planning check admits one change to a judged heading, a "(vX.Y.Z)" label in the placeholder's place, and refuses any other as "existing work-order bytes changed". Put the heading line back exactly as the planning pass that filed the order left it (git log -p on the order's file shows it), in a new commit if the edit was committed, and the check passes again. Filed: WO-291.

AN ORDER AGAINST A TARGET, DRIVEN (the account of your eighth order). Each claim was checked against the kit's source.
- Refusals in the target worktree. Confirmed for v1.1.0. On v1.4.0 most of them advise, but a target worktree keeps the levels of the kit that installed it until its guards are emitted again, and no command says so. After taking v1.4.0, run in the launchpad, once for each target worktree an earlier kit installed: node scripts/harness.mjs emit --target <worktree>. The Read tool is still refused there for a path outside the order's roots; read such a file with cat in the shell, which the guard's read list admits. Filed: WO-292.
- A drive that dispatched a refused phase twice and stopped without naming the refusal. Confirmed. Today: node scripts/drive.mjs why WO-NNN lists what was refused. Filed: WO-292.
- A pass from a session that could not run the checks. Confirmed: nothing reads the session's refused calls. Today: a criterion whose named check did not run is unmet, or is recorded defective as host-behavior, which your verifier does at its own authority. Filed: WO-293.
- Process cost unknown in a driven target phase. Confirmed. Filed: WO-292, for the usage readback.
- The dispatch bound's figure. It compares worked time and its message does not print its basis. It advises in an instance since v1.4.0. Not filed; say so if a figure cannot be reconciled.
- No command undoes a recorded final review, and an override record can land on another order. Confirmed. Not filed: met once. The decision you recorded by hand stands.
- Review rounds' provenance and the attested effort: confirmed in part, not filed. The update preview's wording is already a row of core's WO-288.

CRITERIA. Core's planning screens gain five in the next release, and your passes can apply them now: one behavior to a criterion, with the command that shows it; a claim about every member of a set names the members or the check that fails closed; no existing case is held unchanged; a criterion added in execution is read against the list first; and a pass counts an order's criteria before it files.

WHAT STOPS YOUR NEXT ORDER: a day's figure that is reached, and a session left in analysis. Each has a route above. Nothing else here stops it.
```

## Process cost

## Validation

