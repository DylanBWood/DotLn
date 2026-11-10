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

- **Serial for now.** Core runs one order at a time for the next thirty
  orders from 2026-10-13 and parallelizes across repositories instead: the
  fork, DotLn-Angular and DotLn WoW Forever (operator direction,
  2026-10-13). Parallel orders stay the aim where they pay; when pairs
  return, two entries between blank lines are a lane pair (the delivery
  order first, a machinery or evidence order second, disjoint primary
  surfaces, no hard edge), one order at a time passes final review and
  release close, and the entries after the last pair run one at a time
  ([the map's tracks](work-order-map.md#tracks-and-dispatch-dimensions)).
  Reopen pairs when the thirtieth of those orders closes, or on the
  operator's word.
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
  2026-11-09; Parts D and E of WO-276 are what shorten it. Reopen when its
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
- **Early access.** The period below `v1.0.0` is early access (operator
  direction, 2026-09-30).

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

## The order, serial

One order carries the queue. The operator's first cycle on the work laptop
and the execution of WO-275 on 2026-11-09 and 2026-11-10 showed what the
kit owed before anything else, and the operator directed that the repairs
and the whole queue land as one order
([the 2026-11-10 pass](passes/one-order-for-the-whole-queue-2026-11-10.md)):

- WO-276: the queue lands as one order of eighteen parts. First what
  stops an order for no reason: a private list with a context class that
  stops nothing and a refuse class that stops everything, a repair after
  a failed run that restarts the run, a worker that cannot hand back with
  shells running, a role that cannot wait on a question dialog (Part A);
  and one reader for each format the sources read (Part B). Then what
  every later part passes through: reviews judged before they are fixed
  (Part C), the complete run as one convoy (Part D), a complete run that
  fails for a defect in the change (Part E), and role text that binds the
  role that loads it (Part F). Then the work instance, in the order a new
  instance meets it: a first order that looks for Claude alone, the
  operator's commands as a page and one file for what core should hear
  (Part G); a host report (Part H); an update that keeps an instance's
  files (Part I); models, effort and what an order used (Part J); a root
  for an instance's own tools (Part K); area notes on a target (Part L);
  a team on a repository that squashes its merges (Part M); a target
  order's records kept in the instance (Part N); an initiative laid out
  before its orders are cut (Part O); an order paced across days (Part
  P); hooks that run for the tools they judge (Part Q); and what the
  instance asked of core on 2026-11-10 (Part R). The orders it absorbs,
  WO-261 to WO-275, are umbrella records.

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
  channel): its extension point is recut as Part K of WO-276 without the
  loader.
  The rollback, the build channel and the declared suites wait for a need
  an instance reports; a pass that reopens any of them recuts it first.
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
- WO-096 (feedback rule migration): Part F of WO-276 is the route to less
  role text. Reopen when that part's measurements show sentences only a
  mechanism can replace.
- WO-014 (approval-burden baseline): reopen when a host reports approval
  requests to a hook, or the operator records approval friction.

<!-- dotln-work-order-sequence:start -->
- WO-276 — The queue lands as one order
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
