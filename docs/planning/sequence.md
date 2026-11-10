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
  order pays. Unrelated subsystems are not bundled. The complete review
  run was 24.9 minutes when this rule was written on 2026-10-13 and 46.7
  and 52.1 minutes in the committed rows of 2026-11-06 and 2026-11-09;
  WO-263 and WO-273 are the orders that shorten it. Reopen when its
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
- **Reviews.** Every order after WO-262 declares `Review ladder: paired`,
  so that its first round is read by the three kinds of reviewer and by
  one combined reviewer, each blind to the others, and the record holds
  which found what. The pass that reads fifteen such rounds sets the
  default size and retires the paired form
  ([WO-262](../work-orders/WO-262-review-findings-are-judged-before-they-are-fixed.md);
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

First, what every later order pays less for. These four need nothing the
work laptop's first run will report, and the operator brings that report
to a separate pass:

- WO-262: review findings are judged before they are fixed, a fix takes
  one combined review of the repair, an order's header sizes its first
  round, and a paired round records which reviewer found what; first,
  because every later order's reviews and repairs run under it.
- WO-263: the complete run takes its exclusive suites in one convoy and
  runs the hook suite's cases as shards on the lanes it holds; second,
  because each order after it pays several complete runs of about three
  quarters of an hour.
- WO-273: a complete run fails for a defect in the change: the case-name
  registries, the per-case time bounds and the golden that tracks the
  newest order leave; third, after WO-263, since hand-written pins are
  the commonest cause of a failed complete run.
- WO-264: each role loads the rules that apply to it, a planning pass
  reaches its refutation without a second skill, the reviewers' section
  of the guide loses the executor's ladder mechanics, and a role-text
  edit is checked by regeneration instead of a chain of hash baselines;
  fourth, ahead of the four orders that add a role sentence.

Then the work instance, in the order a new instance meets them:

- WO-265: a new host learns what it lacks from one command: a read-only
  report of every host assumption before the first install, an
  instance's host check sized to the tasks it runs, and an update preview
  that says when the incoming floors refuse this host; fifth.
- WO-261: an instance's update keeps its own files: the publish refuses a
  merge that rewrote a file both sides changed, the preview lists those
  files, and a kit launch is counted in every spelling; sixth, after
  WO-265, which edits the same preview.
- WO-266: an instance chooses the model and effort its workers and driven
  phases run, and reads what an order and a day used, in tokens by class
  and in dollars from prices it declares; seventh, the first order that
  changes what the work instance spends.
- WO-267: an instance builds its own tools beside the kit: one root the
  kit never touches, a committed settings fragment, a configuration
  section left to the instance, a versioned status output and the kit
  guide's account of where each kind of extension goes; eighth.
- WO-268: what a session learns about a target is loaded by the next:
  area notes with their evidence at a commit, named by the dispatch
  briefing with the workstream's rules and flagged when the code has
  moved; ninth, the first of the instance's three jobs.
- WO-269: a team works one instance against a repository that squashes
  its merges: a target order closes when its change is in the base by any
  merge method, the instance declares its authors, and the kit guide gives one planner's conventions; tenth.
- WO-274: a target order's records stay in the instance where its
  registration says so, and the target's pull request is then the
  reviewed commit alone; eleventh, since the first order a team runs
  against its application repository meets it.
- WO-270: an initiative is laid out before its orders are cut: the layout
  in the workstream document and orders filed a wave at a time; twelfth,
  the second of the three jobs.
- WO-271: an order is paced across days: a declared daily figure shown to
  the session, a recorded standing at each stop, and a dispatch bound
  that counts worked time; thirteenth, after WO-266, whose usage reading it
  shares.
- WO-272: a tool call pays for the hooks that judge it, in the launchpad
  and in a target worktree; fourteenth, after WO-264 and WO-271, which
  edit the same files.

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
  channel): its extension point is recut as WO-267 without the loader.
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
- WO-096 (feedback rule migration): WO-264 is the route to less role
  text. Reopen when that order's measurements show sentences only a
  mechanism can replace.
- WO-014 (approval-burden baseline): reopen when a host reports approval
  requests to a hook, or the operator records approval friction.

<!-- dotln-work-order-sequence:start -->
- WO-262 — Review findings are judged before they are fixed, and a review is sized by what the record shows
- WO-263 — The complete run takes its exclusive suites in one convoy
- WO-273 — A complete run fails for a defect in the change
- WO-264 — Each role loads the rules that apply to it
- WO-265 — A new host learns what it lacks from one command
- WO-261 — An instance's update keeps its own files
- WO-266 — An instance chooses its models and reads what an order cost
- WO-267 — An instance builds its own tools beside the kit
- WO-268 — What a session learns about a target is loaded by the next
- WO-269 — A team works one instance against a repository that squashes its merges
- WO-274 — A target order's records stay in the instance where its registration says so

- WO-270 — An initiative is laid out before its orders are cut
- WO-271 — An order is paced across days
- WO-272 — A tool call pays for the hooks that judge it
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
