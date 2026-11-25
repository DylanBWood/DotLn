# Proposed work-order sequence

The operator-authored sequence below is the single editable input to the
index and refutation subject. It grants no activation authority. This
document states the current order and the rules that shape it. The
rationale for each order is in [the planning map](work-order-map.md); the
record of how the list changed is the generated
[history page](../work-orders/HISTORY.md) and the dated planning documents
under this directory, which a pass writes and no one rewrites.

Planning entry returns the pending [follow-up register](followups.json) in
bounded pages; `npm run plan -- followups` gives its counts, source
pointers and continuation command. Untouched items persist across passes.

## Rules in force

- **Pairs where they pay.** The operator kept core to one order at a time
  for thirty orders from 2026-10-13 (operator direction, 2026-10-13); more
  than thirty have closed since, so that choice has run its course
  ([the 2026-11-14 pass](passes/v1-0-0-instance-returns-and-followups-2026-11-14.md#the-serial-rule-has-run-its-course)).
  Parallel orders stay the aim where they pay: two entries between blank
  lines are a lane pair (the delivery order first, a machinery or evidence
  order second, disjoint primary surfaces, no hard edge), one order at a
  time passes final review and release close, and the entries after the
  last pair run one at a time
  ([the map's tracks](work-order-map.md#tracks-and-dispatch-dimensions)).
  A pair runs side by side only when the operator says both are to run at
  once.
- **Every open order has a place in this list.** Closed and withdrawn
  entries leave the list at the next planning pass (WO-158); the history
  page is their record. A member of a workstream marked `track: separate`
  is listed under Workstreams by the generated index and needs no entry
  here; a proposal the operator retires before activation leaves the live
  roots for `docs/retired/` with its bytes intact.
- **Order size.** One subsystem's chain of work is one order with one
  outcome; the binding cost is the complete run and the fixed cycle every
  order pays. A pass does not bundle unrelated subsystems by its own
  choice. The complete
  review run was 24.9 minutes when this rule was written on 2026-10-13 and
  46.7 and 52.1 minutes in the committed rows of 2026-11-06 and
  2026-11-09, and 42.0 minutes on 2026-11-11 after Part D of WO-276
  (54.3 before it on the same host). Reopen when its
  median falls to half the figure of 2026-10-13, or when merged orders
  fail first verification more often than five of eight.
- **The queue form.** Several queued orders may land as the parts of one
  order ([product 07](../product/07-execution-guide.md#the-queue-form)),
  which the operator made a planner's option on 2026-11-16 (ignored
  capture SHA-256
  `1c7d296020603d7dc0479c9533fb8089137cf2543d83534624da4a8e1f713a9c`).
  WO-276 was the first, for the queue of 2026-11-09 (operator direction,
  2026-11-10, ignored capture SHA-256
  `c1b4fac22420c3dc15f5bb20381de2c34a920129b4c036a93ae2841656a652f8`:
  fifteen cycles were the cost the operator would not pay); WO-287 and
  WO-288 are the second and third. An order that something is waiting on
  is not a part: one release ships nothing until its last part lands. That
  holds while an order runs too: what an instance is stopped on is filed
  by itself and placed ahead, never added to a running order
  ([the 2026-11-23 pass](passes/the-kit-keeps-working-2026-11-23.md#why-a-session-stops-and-asks)).
- **Placement.** The operator places an order by one sequence edit; the
  order of everything the operator did not place is the planner's.
- **Hosts.** The kit runs on Git 2.31.0, the Git on the operator's work
  laptop (operator direction, 2026-11-08, ignored capture SHA-256
  `a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`). An
  order that declares or raises a host floor names every host the record
  shows and refuses none of them
  ([product 07's host-refusal screen](../product/07-execution-guide.md#operator-opened-planning-pass)).
  Claude Code is the default agent host and the only one a new instance
  has: nothing the kit ships looks for, asks the version of or calls
  another harness or provider unless an instance elects it (operator
  direction, 2026-11-09, ignored capture SHA-256
  `5f21df63b6d668b25ea93859af6a87396d5afed9c5d11d6ef34d1e27e54ee50f`).
- **Reviews.** WO-276 declares `Review ladder: paired`, and so does every
  order filed after it: from WO-276's Part D on, a part's first round is
  read by the three kinds of reviewer and by one combined reviewer, each
  blind to the others, and the record holds which found what. The pass
  that reads fifteen such rounds sets the default size and retires the
  paired form
  ([WO-276](../work-orders/WO-276-the-queue-lands-as-one-order.md), Part C;
  operator direction, 2026-11-09, ignored capture SHA-256
  `e1c8d0ae73fb667fbfa8aa82a58b9c6d054eaa53a521fd82a84bc8612e573237`: the
  number of reviewers follows the evidence).
- **Stops.** A stop is core's discipline for building the starter, and
  core keeps its own. In an instance, which does its owner's work, a stop
  that guards the kit's own records, order or form, a host property or a
  bound advises and the work goes on; a stop that guards the owner's work
  or private material from loss or exposure that cannot be undone stays a
  refusal; every stop has a setting its owner can change; and no order
  adds one an instance cannot lower (operator direction, 2026-11-16,
  ignored captures SHA-256
  `f896a7fe179dfc0f81950e23c70c0c3f57c0f46e42247b961b7efaf801c077f8` and
  `f588639f7f20b37e4fdbac3693e3b5c60758c8caf27bddfc5dcfbad5926854e4`;
  [the 2026-11-16 pass](passes/the-kit-stops-no-work-2026-11-16.md#what-a-stop-protects-and-where-it-belongs)).
- **The override.** `operator override:` stays the operator's last resort
  for pushing something through whatever state the repository is in, and
  no refusal names it as its route (operator
  direction, 2026-11-16, ignored capture SHA-256
  `5715e710a470b4e836468382dc2f47a68946060b98de608f31e544d263eeb3f4`).
- **Time limits.** Every time limit a test or a check carries is a row of
  one table, and a file the instance owns raises any of them or turns
  them all off; the kit's figures leave room for a machine slower than
  core's (operator direction, 2026-11-16, ignored capture SHA-256
  `babcf9a61812f0d17b80b3f0ae08c7a2022282f864b056d4cdcf5e745d9f9c58`;
  WO-284).
- **Whose rules.** What the operator wants in this repository is core's
  own loadout and is not taken for what the kit's and the starter's users
  want: a rule the kit puts into a session's instructions says whether it
  is the platform's or the author's, and an instance can remove the
  author's (operator direction, 2026-11-16, ignored capture SHA-256
  `bfec526c5a181ab51d95b25df28c16700408dc88bfc7705eed55c2af9dc41f43`;
  ADR-0006; WO-287's Part B).
- **Criticisms.** What a critic finds comes back. Each planning pass runs
  the critic of the critics over the points since the last pass and, for
  each class, changes a document in the pass, files the change or
  declines it with what would show the decline wrong
  ([product 07](../product/07-execution-guide.md#operator-opened-planning-pass),
  the pass's eighth input; operator direction, 2026-11-16, the same
  capture as the time limits').
- **Criteria.** A criterion states one behavior and the command that
  shows it; a claim about every member of a set names the members or the
  check that fails closed; no existing case is held unchanged; and a pass
  counts an order's criteria before it files
  ([product 07's screens](../product/07-execution-guide.md#operator-opened-planning-pass);
  operator direction, 2026-11-23, ignored capture SHA-256
  `0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270`:
  the operator is asked to waive criteria on each order and lays it to the
  pass that wrote them).
- **Who judges criteria.** Whether a criterion can be settled is judged by
  the planner and the refuter, and the operator is not asked to work a
  criterion out. Until the refuter's own judgment covers the criteria
  (WO-295), a pass has every order it files or changes read by the criteria
  review before its refutation. Until a criterion returned twice has its
  re-cut (WO-296), a change to a running order's criterion still needs the
  operator's one recorded authorization, of a text the session wrote
  ([product 07's screens](../product/07-execution-guide.md#operator-opened-planning-pass);
  operator direction, 2026-11-23, ignored captures SHA-256
  `1873874c50d48842066af140d3a18d11680c5ebf45b325b63574bd07615eb4f7` and
  `002461b05862d9020f0b43e0437564256a3d7454b6674e16b9a6ae5598a81631`).
- **Turns.** A session that is dispatched works until its dispatch records
  its completion. It ends a turn to wait only on the operator's pause,
  stop or cancel, or on what only the operator can do, and no text the kit
  gives a session says otherwise (WO-287-D090; operator direction,
  2026-11-23, the same capture; WO-289 and WO-290).
- **Early access.** The period below `v2.0.0`, the roadmap's Teammate-ready
  rung, is early access (operator direction, 2026-09-30; the rung was
  numbered `v1.0.0` until 2026-11-11,
  [decision](../evidence/WO-276/decisions.md#wo-276-d073--this-orders-release-is-v100-and-the-roadmaps-teammate-ready-rung-is-v200-on-the-operators-word)).

## Focus

**The work instance** (operator direction, 2026-11-09, ignored captures
SHA-256 `b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb`
and `04a12c3c90a61336651b1910af75c11abaa3c990c3e18427b3b8fa8efb33e3e3`).
For the next two to three months the kit is judged by one use: an
instance on the operator's managed work machine, shared by a small team,
working against a large, multi-year application codebase. It must run
there, take core's updates while holding its owner's private tools, study
that codebase and keep what it learns for later sessions, lay out an
initiative of 4 to 16 weeks and cut it into orders that fit a daily model
budget, and help produce the tests and consumer documentation that keep
the application working as intended. The standing aim is operator flow:
people working with the model, not against it. That instance clones the
starter, never this repository, and sends core only what blocks its next
order and has no working route (operator direction, 2026-11-09, ignored
capture SHA-256
`9006bd8cbcdabb5647594adb6893150aaff9e5a8ee74260a4e890e9cba3d69ae`); no
stream of work in this repository depends on it. The fork and
DotLn-Angular remain where the same route is exercised in the open.

Core cannot see that instance's journals: what stops core's own sessions says
little about what stops it, so a pass ranks a stop by whether it lies on
an instance's path and by what the instance reported (operator direction,
2026-11-16, ignored capture SHA-256
`35e0177daa25798a102fa3714519a96cb8bbc28336a255219ff42b22af03f128`).

What the operator is trying to achieve, avoid, implement and experience,
as the planner reads it, is on [one page](operator-intent.md), which a
pass reads before it weighs a new directive.

## The orders, one at a time

WO-284 and WO-287 closed as v1.3.0 and v1.4.0 on 2026-11-17 and
2026-11-18. WO-288 has been open since 2026-11-19, with fifteen
verifications, of which the twelfth passed, and one final review, which
failed. The order below is the one a room of four models agreed on
2026-11-25, at the operator's call
([the room's plan](passes/data-is-the-record-2026-11-25.md#the-rooms-plan)):

- WO-297: a day's figure that is reached ends no turn. First, because it
  is what the work instance's sessions meet at every prompt, it has waited
  since 2026-11-19 inside WO-288, and it is separable from that order.
- WO-288: one bounded attempt, on the direction the room wrote for the
  operator to give in that order's session. It gets one verification and
  one final review. If either returns it, or its repair cannot qualify,
  no repair starts and the order is held under Not now.
- WO-291: an order against a registered repository starts from that
  repository's base branch as it stands, and its heading promises no
  version.
- WO-294: main reads an order's worktree whatever its configuration
  holds, and a drive starts from a checkout that is off main. It moved
  ahead of the machinery orders because each phase of an order waits on
  the operator's next phrase until a drive can start in core, and it
  follows WO-288 because both edit the drive's route.
- WO-289, WO-290 and WO-292: what a session is told about a turn, a turn
  that goes on once, and a driven target phase. Each is written against
  WO-288's unmerged text and is re-cut by the pass after that order
  closes or is held. WO-290 is held for a recurrence after WO-289.
- WO-293, WO-295 and WO-296: how a verification ends and who judges
  criteria. The same pass folds them into one termination order and one
  change to the refuter's prompt, as the room's plan sets out.

The entries run one at a time, in this order. WO-297 and WO-288 are not a
lane pair: WO-288's repair runs beside WO-297 only if the operator says
both run at once, which the rule on pairs leaves to him and
[the plan lists among his decisions](passes/data-is-the-record-2026-11-25.md#8-how-the-process-changes).

WO-297, WO-291 and WO-294 are written in the form of criterion the room
agreed and state in their own text what returns them, as a trial judged
over the next five deliveries.

## Not now

These orders stay open and are not next. Each is recorded with what
reopens it; the 2026-11-09 pass read each against the tree and the focus
([its document](passes/whole-plan-and-codebase-review-2026-11-09.md)).

- WO-298 (a reviewed branch that was never pushed, and an instance's
  publish over the sign-off): a port of WO-288's publication fixes, held
  in reserve. It becomes the next order if WO-288 is held, unless the
  console task's memory stop held WO-297's release, in which case that
  fix is filed alone and goes first. It is withdrawn once a release close
  has shipped WO-288's own Part F.
- WO-244 (paired planning passes and the synthesis pass): moved down on
  the operator's word of 2026-11-09. It was activated on 2026-11-08 and
  parked the next day; its work is the commit `ca48dff28`, held by
  `refs/dotln/checkpoint/WO-244/5`. Reopen on the operator's word, or when
  a paired routine has been run by hand twice more. The room of
  2026-11-25 was one such run.
- WO-083 (the real run from the operator's instance): moved down on the
  operator's word of 2026-11-09; the operator makes that run by hand.
  Reopen when the operator asks core to record a measured comparison of
  the instance route.
- WO-207 (an instance's kit updates: rollback, extension point and build
  channel): its extension point shipped as Part K of WO-276 (v1.0.0)
  without the loader. The rollback, the build channel and the declared
  suites wait for a need an instance reports; a pass that reopens any of
  them recuts it first.
- WO-193 (an instance's requests reach core's intake): the focus asks for
  less traffic to core, and the pasted block serves what blocks. Reopen
  when an instance's blocking need reaches core late or is lost.
- WO-183 (intent declaration and the stranger test): reopen when the
  operator names a trial by someone who has not read the documents, or
  when intents become a route in use.
- WO-088 (planning documents as checked contracts): its first condition
  occurred on 2026-11-23, when WO-288's loop was traced to what two of
  its criteria claim and to its size. A check of a document's form reads
  neither, and the parts a command can read, a count and seven phrases,
  are in WO-293 and in product 07's screens. Reopen when a recorded
  failure is traced to a field a check could have read, or when a copy of
  the resume phrases diverges.
- WO-091 (the full 5S set on the Repo Gardener): reopen when the operator
  directs the demonstration or a consumer needs a group with several
  active mechanics.
- WO-096 (feedback rule migration): Part F of WO-276 measured each role's
  installed and read bytes before and after it moved the shared rules into
  records ([WO-276-D055](../evidence/WO-276/decisions.md#wo-276-d055--part-f-as-built-the-shared-rules-as-records-the-rule-by-role-table-the-refutations-steps-from-its-command-the-review-helpers-section-and-the-meters-second-number))
  and named no sentence that only a mechanism can replace. Reopen when a
  measurement names one.
- WO-014 (approval-burden baseline): reopen when a host reports approval
  requests to a hook, or the operator records approval friction.

<!-- dotln-work-order-sequence:start -->
- WO-297 — A day's figure that is reached ends no turn
- WO-288 — Core's own tooling lands as one order
- WO-291 — A target order starts from its base branch's tip, and its heading claims no version
- WO-294 — Main works on an order's worktree whatever its configuration holds, and a drive starts from a checkout off main
- WO-289 — A session is told to go on, and ends its turn only for what the operator must do
- WO-290 — A turn that leaves a dispatch unfinished goes on once
- WO-292 — A driven target phase can run its order's checks, and a drive a guard stopped says so
- WO-293 — A verification ends: a repair's verification reads the repair, and a criterion returned twice names its ways out
- WO-295 — The refuter judges whether each criterion can be settled, and a planning pass repairs what it holds
- WO-296 — A criterion returned twice is re-cut by a planner and judged by a refuter, and the operator adjudicates none
- WO-298 — A reviewed branch that was never pushed is named, and an instance's publish is not refused over a sign-off
- WO-244 — Paired planning passes and the synthesis pass
- WO-083 — The real run from the operator's instance
- WO-207 — An instance's kit updates: rollback, extension point and build channel
- WO-193 — An instance's capability requests to core
- WO-183 — Intent declaration and the stranger test
- WO-088 — Planning documents as checked contracts
- WO-091 — The full 5S set on the Repo Gardener
- WO-096 — Feedback rule migration
- WO-014 — Approval-burden baseline
<!-- dotln-work-order-sequence:end -->
