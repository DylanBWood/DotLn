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
  choice. The queue of 2026-11-09 is one order, WO-276, on the operator's
  direction of 2026-11-10 (ignored capture SHA-256
  `c1b4fac22420c3dc15f5bb20381de2c34a920129b4c036a93ae2841656a652f8`):
  fifteen cycles were the cost the operator would not pay. The complete
  review run was 24.9 minutes when this rule was written on 2026-10-13 and
  46.7 and 52.1 minutes in the committed rows of 2026-11-06 and
  2026-11-09, and 42.0 minutes on 2026-11-11 after Part D of WO-276
  (54.3 before it on the same host). Reopen when its
  median falls to half the figure of 2026-10-13, or when merged orders
  fail first verification more often than five of eight.
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

## The orders, one at a time

WO-276 closed as v1.0.0 on 2026-11-14. What comes next is what the
operator met setting up the work laptop that day, what an instance
reported after taking v1.0.0, and what WO-276 left
([the 2026-11-14 pass](passes/v1-0-0-instance-returns-and-followups-2026-11-14.md)):

- WO-277: a person sets up and updates an instance from one page in the
  starter, `docs/OPERATOR.md`, written in the form the operator named, with
  the private terms list before anything publishes; and an update leaves
  nothing to repair by hand (the emit keeps an instance's own host
  surfaces, a re-keyed register row keeps its dispositions).
- WO-279: the critic of conduct WO-276 ran by hand becomes a worker the kit
  launches by name when someone asks, on Opus 5.5 at xhigh unless an
  instance chooses another, so it runs on the work laptop; a cadence runs
  only where an instance turns on its feature, off by default.
- WO-281: the kit guide rewritten to be easy to follow, its facts kept, and
  the write-back and `quality pass:` rules that keep it so.
- WO-278: the review helper reads a report's table where it stands, a paired
  first round is launched as one, and a worker in an instance probes only
  what the instance carries.
- WO-280: the five-second discovery timeout traced and repaired, or left
  with what it needs recorded.

WO-277 (delivery) and WO-280 (machinery) have disjoint surfaces and no hard
edge, so they may run as a lane pair if the operator says to run both at
once; otherwise the five run in this order.

## Not now

These orders stay open and are not next. Each is recorded with what
reopens it; the 2026-11-09 pass read each against the tree and the focus
([its document](passes/whole-plan-and-codebase-review-2026-11-09.md)).

- WO-244 (paired planning passes and the synthesis pass): moved down on
  the operator's word of 2026-11-09. It was activated on 2026-11-08 and
  parked the next day; its work is the commit `ca48dff28`, held by
  `refs/dotln/checkpoint/WO-244/5`. Reopen on the operator's word, or when
  a paired routine has been run by hand twice more.
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
- WO-088 (planning documents as checked contracts): reopen when a
  recorded failure is traced to an order's form, or when a copy of the
  resume phrases diverges.
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
- WO-277 — A person sets up and updates an instance from one page
- WO-279 — A critic of conduct the kit launches when asked
- WO-281 — The kit guide is easy to follow
- WO-278 — The review helper reads a report as written
- WO-280 — The discovery timeout traced and repaired
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
