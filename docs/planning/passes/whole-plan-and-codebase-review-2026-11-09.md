# whole plan and codebase review — 2026-11-09

## Dispatch and capture

The operator opened a standard planning pass on 2026-11-09 with two items,
captured unedited in ignored intake at
`docs/intake/planning-dispatch-2026-11-09-whole-plan-and-codebase-review.md`
(SHA-256 `7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7`).
In paraphrase:

1. Re-judge every open work order and update, split, combine or file orders
   as the evidence supports, because the plan in force was written by earlier
   model sessions and its momentum is not a reason to keep it. A pass that
   changes little or nothing is an acceptable result. Five goals judge the
   plan: less context and prompt text per phase and role skill; tests and
   gates that are fast and useful, with brittle or overfitted tests
   reconsidered and limiting architecture revisited; accurate and helpful
   role skills; the enterprise starter working across environments, the
   operator's work laptop first; and professional, well-made code and
   architecture. The review covers the whole codebase.
2. Three orders move down: WO-244; WO-263 only if its rationale or its
   implementation is suspect, since faster gates stay a priority; and WO-083,
   whose run the operator will do by hand for now.

The pass ran in Claude Code on `claude-fable-5-2` at `xhigh`
(host-selected, from the session's readback), on branch
`planning/2026-11-09-whole-plan-and-codebase-review` opened from clean
`main` at `06c1ddc1a` (v0.122.1).

During the pass the operator added thirteen messages, each captured unedited
beside the dispatch (the same file name with `-midturn-1` to `-midturn-13`)
and journaled by the prompt hook. In paraphrase, with each capture's
SHA-256, which is the journal's digest of the message:

1. The mission (`b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb`).
   The kit exists to increase operator flow: a launchpad the operator uses
   at home and at work and that teammates use, on one shared instance or
   one each, working with the model instead of against it. The work
   instance must do three things: study a large, multi-year Angular
   codebase, its unwritten rules, its API and its history, and keep that
   understanding for later sessions, for fixes, debt work and above all
   new initiatives; take a new initiative and plan the whole effort over 4
   to 16 weeks on a limited model budget; and help produce test cases,
   end-to-end cases and documentation for the consumers of sibling
   repositories, because the application working as intended is paramount.
2. The horizon (`04a12c3c90a61336651b1910af75c11abaa3c990c3e18427b3b8fa8efb33e3e3`).
   That use is the mission for the next two to three months and comes
   before the wider aims.
3. Workers (`5ec32fc1813cc5adf765a583b298694b5173e88b41a15c56dc7a047402cc3f5a`).
   The pass may use more worker launches than the configured cap. It used
   fewer.
4. Extension (`9006bd8cbcdabb5647594adb6893150aaff9e5a8ee74260a4e890e9cba3d69ae`).
   An instance must be extendable with private implementations, for
   example a reader that turns an issue tracker's items into a planning
   session's input, while taking updates from core regularly, and should
   send core only what truly blocks it.
5. Reviews and reading (`e1c8d0ae73fb667fbfa8aa82a58b9c6d054eaa53a521fd82a84bc8612e573237`).
   The number of reviewers is not a principle: evidence decides between
   many, few and none. A role's mandatory reading has two tests, that it
   is usable within the work budget, stated as a daily dollar figure per
   person with a lower starting guidance, and that it is useful: neither
   so long that it confuses the role nor so short that it is read
   inconsistently.
6. Pace (`4d0cd689f95336c7236ba11355d4378c222fda9a7a5192ff1e38869d463b7353`).
   A work order at the work instance may take several days to stay within
   that budget.
7. The first arrangement (`5cefd88d081917cbab4665ed7b5488385108bb63ad8f4f2d3775f9c523c6e64f`).
   One shared instance at work; the operator runs its planning passes,
   assigns each order to a teammate by hand and settles the order in
   which orders merge.
8. Handing work over (`767ee8dea2a433e496a19ffbf336b3450854ae3ae6308a659ca165e5e251d910`
   and `c48b0164ee3a408afabbf24fcfce66b500b3ee17ca03ec41f5df4266b76ed430`).
   The operator was weighing whether teammates might commit an order's
   work so that another person could continue it, and whether the
   operator might pull an existing order down to run its final review.
9. The arrangement for now (`5c39c4d9d1ddbedb8a95a982d16067d343ea5a2a8ec3860f3ed344bff3243adc`).
   The teammate who executes an order also runs its final review; the
   target's draft pull request after verification is where others look;
   a view of orders in progress is later work and is kept by hand until
   then.
10. The laptop attempt (`cfa25b2a9660520a96c2f798261e1ec7d4acc8e248a915e4cf14cd70e6561788`,
    `7a5c7a9d9273fc6cb61261bf0cdd721887eb12d3dee736a0529644366558b0ab` and
    its repeat `655da567eaa8106818e52651ec30a622f158113d55f4cd8fc9e49ba7fb3eb93e`).
    The operator began a clone and a first order on the work laptop
    against starter v0.122.1 during the pass, and will bring what it shows
    to a separate pass; this pass does not wait for it.

## Readings

### What the record said at entry

`npm run resume -- status` showed WO-260 closed with a passing final
review and merged, its release close not yet run; no order active. On
`main`, WO-244 read as a queued draft: it had been activated on
2026-11-08 and parked on 2026-11-09 minutes before this dispatch, and its
work is the commit `ca48dff28` on `refs/dotln/checkpoint/WO-244/5`.

`npm run plan -- failures` since receipt 066: two failed verifications and
two repairs, all WO-260's. Over the whole control record: 221 orders made
ready, 104 failed first verification, 180 failed verifications, 23 failed
final reviews, 206 repairs. `npm run plan -- conditions --slow` took 5
minutes; its document-gate probe timed out, its plan-check median read
10.4 seconds, and its plain-gate reading was one sample from 2026-10-24.
The repository has no open issue. The register held 277 pending rows,
five of them untriaged from WO-260's close.

### How the codebase was read

Fourteen review workers (`dotln-worker`, the definition pinned to
`claude-opus-5-5` at `xhigh`; effective model and effort not read back),
each given one area, the five goals, the instruction to treat the
existing plan as evidence and never as authority, and a required list of
what is sound and should be left alone. Nine read the codebase and the
open orders; after the operator stated the mission, three read whether
an instance can do the work instance's jobs today; one classified what
review workers have found; one read what moving an order between clones
would take. The planner re-derived the figures below that it marks as
its own and attributes the rest.

### 1. Context per phase and role

The planner's own measurements at `06c1ddc1a`:

- The six lifecycle skills share 17,334 bytes of identical lines. A
  role's own lines are 12,215 bytes (executor), 8,260 (reviewer), 6,340
  (planner), 5,614 (verifier), 4,636 (release close) and 3,120 (refuter).
  The composition in `packages/skeleton/src/loadouts/contributor.ts`
  prepends every shared rule to every role but the router.
- The meter counts the root instruction file and the skill. A planner
  also reads the planning section (53,900 bytes), the ideation section
  (9,317) and the sequence: 102,776 bytes, and 123,712 once it loads the
  refuter skill, of which 17,811 bytes repeat what it already holds. The
  meter reports 31,536.
- The verifier and the reviewer are each told to read a 33,168-byte
  section most of which is the executor's procedure for running
  reviewers.
- The executor's ceiling in `docs/control/budgets.json` was raised five
  times between 2026-09-18 and 2026-11-06, from 20,480 to 51,226 bytes,
  and twelve orders each boarded the same reduction as a follow-up.
- Six installed roots name `npm run plan -- review`, a command
  `scripts/refute-plan.mjs` does not have.

By the review of the role text: 27 of 28 commands and figures checked in
the skills match the code, so the text is accurate and undiscriminating;
the latest failed verifications do not trace to its structure. Each
role-text edit is paid three times, in a chain of 62 hash baselines
(253,148 bytes by the planner's count), in the case that walks it and in
about a hundred sentence assertions.

What a root costs in money is small. The planner's estimate, not a
measurement: ten kilobytes off the executor's root is under one percent
of an order's executor tokens, because an order's cost is its context
re-read at every step (below).

### 2. Tests and gates

- The product gate's median duration, recomputed by the planner from the
  committed control events: 8.4 minutes in late September (103 rows),
  17.1 in early October (223), 29.3 in late October (127) and 42.2 in
  November to date (82). WO-260's meter records 3 hours 21 minutes of
  gate time in one order.
- In the committed row `docs/evidence/WO-255/repair-003/complete-gate.json`
  the run took 2,801 seconds for tasks that sum to 7,791, which eight
  lanes could hold in about a third of the time. The four exclusive rows
  took 1,386 of those seconds; the largest, the hook suite, is one
  process on a reservation of six lanes.
- Test files gained 72,124 lines and lost 14,456 across 81 files since
  2026-10-19 (`git diff --shortstat 3ac4030f6 HEAD` over the test paths).
- By the review of the runner: of twenty-one recorded complete-run
  failures with a named cause since WO-200, thirteen were hand-written
  lists, hashes or expected outputs that a new module or test broke, and
  about three were defects in the change. A run stops at its first
  failure, and any repair re-runs everything.
- By the review of the suites: product logic in the kernel and the
  compiler is tested fast and in process and should be left as it is;
  the hook judgments are tested by building a repository and spawning the
  generated hook for each case; the console's self-host golden is
  re-recorded from each order's evidence; twenty-six cases carry a time
  bound measured once on this host.

### 3. The cycle every order pays

- The median span of a repair, recomputed by the planner: 30 minutes in
  September, 71 and 84 in the two halves of October, 134 in November.
- The planner's brief to the cycle review assumed that failed
  verifications were mostly bookkeeping. The review refuted it: of
  eighteen blocking findings in the last eleven failed verification
  reports it classed seventeen as defects in behavior, six of them in two
  hand-written readers of free text.
- By that review: about half of recent decision entries narrate review
  rounds, runs and register disposals; one generated index of every
  decision (3.5 MB) has no reader beyond its own freshness check; all but
  one of the record's 3,777 reopening conditions are prose nothing
  evaluates.

### 4. What review workers find

A review worker classified 390 findings from the committed decisions of
nine orders (39 more it could not class); its confidence is medium and
the planner did not re-derive it. About a fifth would have failed a
criterion or broken behavior `main` had; two fifths were lesser defects a
gate or a final review would have met; an eighth were improvements; a
quarter named an input no writer produces, were wrong, or were recorded
with no fix. The criteria reviewer alone would have found about three
quarters of the distinct first-class defects of round one; the
consistency reviewer supplied four fifths of the second class; the design
reviewer's findings were mostly the last two classes, though it alone
found seven of thirty-nine distinct first-class defects. About half of
the first-class findings of later rounds were defects an earlier
review-driven fix had introduced. First verification failed in four of
eight orders under two reviewers, two of eleven under three and eight of
fourteen under the ladder, which the samples do not separate. No whole
change has ever been read by one combined reviewer in place of three, and
no order ran with none, so the record cannot yet say which size is right.

### 5. What an order costs

The planner's estimate, with its basis. Measured: WO-260's meter holds
474,249,870 tokens with no split by class, 360,480,028 of them the
executor's over 1,001 steps; this pass's own session, by its readback
part way through, read 28,462,926 tokens from cache, wrote 478,481 to
cache and produced 210,467 of output. Read, not measured: the first-party
list prices in the pricing table the session's reference carries, cached
2026-11-03. Applying this session's proportions to WO-260's total puts
that order at roughly two to three times the operator's starting daily
figure on the most capable model, a little under twice on the next, and
under the figure on the one below; the work account's prices may differ.
The cost is context size multiplied by steps, with output about as much
again. The levers are fewer steps, fewer review and repair rounds and the
choice of model, and the kit today offers an instance none of the three.

### 6. The kit on another host

By the portability review, with the planner's checks: the record of the
work laptop is its Git version; no command reports a host's unmet
assumptions together; `checkHost` sizes an instance's gate by a core-only
suite's peak of 1,509,638,144 bytes, which refuses a machine of 16 GB
with twelve logical processors; the update preview judges no floor,
which is how v0.121.0 refused the laptop for about 33 hours; a C compiler
is required and undeclared; no attributes file ships; every committed run
is on macOS and native Windows has no route. The planner confirmed
thirty-two literals of core's own order numbers in the exported lifecycle
scripts, ungated, which an instance meets at its own orders of those
numbers.

### 7. Whether an instance can do the work instance's jobs

- Studying a codebase: nothing in the kit studies a target. A profile is
  one hand-written document no program reads, a workstream's rules are
  loaded by no role though product 12 says otherwise, and nothing reads a
  profile's commit. Core scoped this on 2026-10-24 and deferred it until
  the operator carried the need into a core pass in generic words, which
  the messages above do.
- Planning an initiative: every planned item needs a full order file, a
  sequence holds a hundred, and one refuter judges a pass's new orders.
- Tests and documentation: these run as ordinary target orders judged by
  the target's own gate, which cannot tell a test that asserts nothing
  from one that pins behavior and is fixed per registration.
- Budget: worker and driven-phase models are compiled in with no
  instance override, found independently by four reviews; the meter
  keeps one total per role; the dispatch bound counts elapsed time, so an
  order paused overnight is refused its gates the next morning.
- Extending: what the manifest does not list is the instance's and
  survives an update, but nothing says where to put it, several natural
  places break emit, check or the gate, and committed hooks, an owner's
  settings and model choice have no home.
- A team on one instance: a target order's close requires the order
  branch in the base's history, which a squash or a rebase rewrites; one
  author is exempt from sign-off; a second clone that starts an order
  activates it again undetected; an order closed while another's review
  merges cannot integrate again; and release close re-reads the reviewed
  gate row against the closing machine's installed runtime and cleans up
  only that clone's worktrees, so it runs where the final review ran.
- Traffic to core: the blocks of the three passes before this one carried
  six to nine items each and were answered that none blocked the next
  order.

### 8. The scripts and the packages

By those two reviews: the kernel and the compiler are well made and
should be left alone; the scripts have no import cycle, one home for Git
calls and one root resolution. Against that, no static check covers the
lifecycle scripts, though half of them pass one as they stand;
`packages/skeleton/src/harness-host.ts` is 8,637 lines with one function
of 856 and no unit file; `scripts/resume.mjs` dispatches from one
function of 1,735 lines; library modules import entry scripts; eight
scripts have no live reference and ship in the kit. Each tool call starts
eight hook processes; WO-260 ran 9,000 hook runs in 21 minutes and 2,752
authorship snapshots that read 26 GB.

## Orders filed and amended

Amended, each rewritten whole at the base `06c1ddc1a`:

| Order | What changed | Why |
| --- | --- | --- |
| WO-262 | The typed record's document-check refusal leaves; a fix dispatch takes one combined review of the repair; an order's header sizes its first round; a paired round records which reviewer found what | The rule had never been in the executor's own text; repairs grew fourfold; the size of a review is to follow evidence, and the record cannot yet give it |
| WO-263 | Keeps the convoy; adds the hook suite's cases as shards inside its reservation and the conditions reading of review runs | The exclusive rows are half of a run and the largest is one process; reordering alone leaves that |
| WO-261 | Keeps the update refusal, the preview and the launch count; the session sub-root and the tag-fetch refusal leave | The sub-root opens an unscreened place inside intake; the refusal fires only on a hooked host for what the guide already says |

Filed:

| Order | Outcome |
| --- | --- |
| WO-264 | Each role loads the rules that bind it; no second skill for a planning pass; the reviewers' section loses the executor's mechanics; the meter counts mandated reads; role text is checked by regeneration |
| WO-265 | One read-only command reports every host assumption; an instance's host check fits its own tasks; the preview judges incoming floors |
| WO-266 | An instance sets the model and effort of workers and driven phases; the meter keeps token classes and prints an estimate from declared prices |
| WO-267 | An instance's own root, settings fragment and configuration section; a versioned status output; where each kind of extension goes |
| WO-268 | Area notes with evidence at a commit, named by the briefing with the workstream's rules and their age |
| WO-269 | A target order closes after a squash or a rebase; the instance declares its authors; one planner's conventions |
| WO-270 | An initiative's layout in the workstream document; orders filed a wave at a time |
| WO-271 | A daily figure shown to the session; a recorded standing at each stop; a bound that counts worked time |
| WO-272 | Hooks registered for the tools they judge; no hook that does nothing; two readings do less |
| WO-273 | The case-title registries, per-case time bounds and the golden that tracks the newest order leave; statement wordings judged in a table |

Screens. `npm run work-orders -- index --check` prints one criteria
advisory for these orders: WO-265 criterion 4 names 16 GB, which is the
injected host of a fixture and not a bound the order must meet. Each
order's final criterion names `npm test -- --review`, `npm test` and
`npm run test:docs`, since each edits a declared source of a machinery suite. No order adds or
tightens a refusal keyed to a host; WO-265, WO-266, WO-271 and WO-272 say
what they do on this repository's host and on the work laptop. Each order that adds recurring work to a gate, a hook
or a close names it as unmeasured and measures it. No order edits a file
in `FEEDBACK_SOURCE_PATHS`, so none owes a live feedback episode.

Not now. Nine open orders stay in the sequence below the thirteen, each
with what reopens it: WO-244 and WO-083 on the operator's word in the
dispatch; WO-207, whose extension point WO-267 recuts without its loader
and whose other four parts wait for a reported need; WO-193, because the
focus asks for less traffic to core; WO-183, WO-088, WO-091, WO-096 and
WO-014, which nobody is waiting for. The reviews of those orders found
criteria that the tree has since contradicted (WO-096 expects five
refusals where there are nine; WO-088 and WO-207 name a client guide that
is now a seed); they are not amended here, and the sequence says that a
pass which reopens one recuts it first. Retiring any of them to
`docs/retired/` is the operator's act and is not taken.

Review ladder. The twelve orders after WO-262 declare `Review ladder:
paired`. Until WO-262 lands the line is inert and their executors run
today's ladder.

Role text. WO-262 is the one order that edits a role sentence before
WO-264 removes the chain of baselines, and it mints one more by hand;
WO-268, WO-270 and WO-271 follow WO-264 and write their sentences as rule
records.

## Register

Forty-two dispositions applied in one batch against the revision read
after `npm run meta`. Allocated, twenty-four rows: the proportionate-fix
row of WO-260 to WO-262; the two cold-gate condition rows to WO-263; the
twelve cold-start rows, the role-text economy candidate and the role
oracle row to WO-264; the codebase-research row to WO-268; the team row
to WO-269; the initiative-layout row to WO-270; the continuation and
context-continuity rows to WO-271; the hook-timing row to WO-272; the
traced-consumers row to WO-273. Deferred, eighteen rows: four refinements
of the Git surface reading from WO-260's close, each read against its
decision and none with an observed failure; the result memo per gate
task, whose condition occurred and which is declined again; and the
thirteen candidates this pass nominates. The three rows that
core recorded on 2026-10-24 for this mission (research the codebase, the
initiative layout, one team fork) had waited on the operator carrying the
need into a core pass in generic words; the messages above are that.

## Red tags

<!-- dotln-red-tags:start -->

```json
{
  "after": "docs/planning/passes/git-2-31-support-and-fork-returns-2026-11-08.md",
  "tags": []
}
```

<!-- dotln-red-tags:end -->

## NoOps

Each was weighed and is not filed; the reason is its evidence, and
`usefulWhen` is its reopening condition. The map's candidates section for
this pass carries the first thirteen.

1. **An order moves between clones.** A checkpoint holds the launchpad
   side whole but one event behind and without ignored files; the target
   side is not checkpointed; gate rows, review reports and the target
   registry are local. The operator settled that the teammate who
   executes also reviews. `usefulWhen`: an assignee becomes unavailable
   mid-order, the operator wants final reviews through one machine, or
   two reviews in flight strand a pull request.
2. **In-progress orders visible to a team.** The operator tracks
   assignment by hand. `usefulWhen`: a duplicate activation or a lost
   assignment is reported.
3. **The scripts type-checked, layered and free of core's order
   history.** Real, and behind the work instance's orders. `usefulWhen`:
   those orders close, the operator places it, or an instance reports a
   wrong path at one of core's order numbers.
4. **The hook module split and one process an event.** The larger cut,
   which moves every refusal's evaluation at once. `usefulWhen`: WO-272's
   after-reading is recorded.
5. **Evidence editions kept in place.** Reverses recorded decisions on
   immutability. `usefulWhen`: the operator's word.
6. **Dormant product paths out of the default gate.** A decision about
   the product's direction. `usefulWhen`: the operator's word, or the
   vertical row is the longest task after WO-263.
7. **The gate's remaining structure** (one case holding the host, lists
   written by hand, fail-fast). Keep-going on a first complete run was
   weighed and left: with the pins gone a run should seldom hide a second
   failure. `usefulWhen`: two orders after WO-263 and WO-273 still pay
   three or more complete runs.
8. **Tests shown to pin behavior.** `usefulWhen`: the work instance's
   first tests-only order.
9. **A target order's records kept in the instance.** `usefulWhen`: the
   operator's word.
10. **A planning source a pass runs.** `usefulWhen`: an owner's reader
    exists and naming its output is the friction.
11. **Decisions as choices and the guide by rule.** The quality pass on a
    section is the existing route. `usefulWhen`: WO-264's measurements
    are read, or the operator asks for a section.
12. **Role text judged by what a fresh reader does with it.**
    `usefulWhen`: the first role-text change after WO-264 whose effect
    the operator questions.
13. **A second platform exercised.** `usefulWhen`: the operator's word,
    or a teammate's machine that is not macOS.
14. **A value for no review.** Reviewers found first-class defects in
    every order read, and no order without them exists to compare.
    `usefulWhen`: the paired rounds show reviewers finding nothing a
    verifier would.
15. **The typed record's refusal of a fix that contradicts its own
    judgment** (the 2026-11-08 design). It could refuse only a
    self-contradicting entry. `usefulWhen`: after WO-262, a decision
    shows a closed failure on an input no writer produces fixed in code.
16. **Restating the cold-start ceilings at the measured roots.** The
    operator's standard for a root is that it be usable and useful, and
    no byte figure. `usefulWhen`: a pass wants the meter to judge again.
17. **Caching Git queries in release close.** The cost is in tests, and
    the close is the riskiest path. `usefulWhen`: a host where a close is
    measured slow.
18. **Retiring the nine orders set down as not now.** The operator's act.
    `usefulWhen`: the operator's word.
19. **A model-identifier election ahead of the laptop's observation** was
    not held back: four reviews found the pins with no override and the
    budget alone warrants the choice, so WO-266 is filed.

## Sequence

Thirteen orders, then nine not now. First the four that every later order
pays less for and that need nothing the work laptop's first run will
report: the reviews (WO-262), the complete run (WO-263), the pins that
fail it (WO-273) and the role text (WO-264). Then the work instance's, in
the order a new instance meets them (WO-265, WO-261, WO-266 to WO-271),
and the hooks' cost last (WO-272), after the two orders that edit the
same files. The first draft of this pass put the work instance's orders
ahead of the four; its design review pointed out that eleven orders would
then pay the costs the four remove, and the operator's word that the
laptop's findings come in a separate pass means the instance's orders are
better filed after it. The marked list in
[the sequence](../sequence.md) is the subject. The focus section there is
replaced by the mission the operator stated, the order-size rule states
the complete run's present figures, and a rule on review size is added.

## Write-backs

- `docs/planning/sequence.md`: the focus, the reviews rule, the order-size
  rule's figures, the order and the orders set down as not now.
- `docs/product/07-execution-guide.md` §Operator-opened planning pass,
  item 5: an instance pass sends an item only when it stops that
  instance's next order and has no working route there.
- `docs/KIT.md` §Planning in this instance: the same rule, for the
  instance's reader; §Document quality: the intake root holds the
  operator's messages, and a session's drafts and a tool's output go
  elsewhere.
- `docs/planning/work-order-map.md`: this pass's paragraph, thirteen
  catalog rows and the candidates section.
- `docs/lineage/idea-ledger.md`: the registration heading.

Questions that are the operator's, recorded here and filed nowhere:
whether a team's application repository should hold each target order's
records; whether generated evidence editions may be kept in place;
whether the vertical, resident and browser-evidence suites stay in the
default gate; whether a second platform is to be exercised by continuous
integration; and whether the nine orders set down as not now are retired.

## Rules recorded

<!-- dotln-rules-recorded:start -->

```json
[
  {
    "rule": "For the next months the kit is judged by the work instance's use: an instance on the operator's managed work machine, shared by a small team, that studies a large application codebase, plans initiatives on a limited model budget and helps produce tests and consumer documentation.",
    "document": "docs/planning/sequence.md",
    "section": "Focus",
    "message": {
      "sessionKey": "45064c49a54b49f9e68922eeb34de51da7074178f6ad2cf068a2c931a108b192",
      "recordedAt": "2026-11-09T23:07:31.336Z"
    },
    "captureDigest": "sha256:b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb"
  },
  {
    "rule": "That use is the mission for the next two to three months and comes before the wider aims.",
    "document": "docs/planning/sequence.md",
    "section": "Focus",
    "message": {
      "sessionKey": "45064c49a54b49f9e68922eeb34de51da7074178f6ad2cf068a2c931a108b192",
      "recordedAt": "2026-11-09T23:09:42.473Z"
    },
    "captureDigest": "sha256:04a12c3c90a61336651b1910af75c11abaa3c990c3e18427b3b8fa8efb33e3e3"
  },
  {
    "rule": "The work instance sends core only what blocks its next order and has no working route.",
    "document": "docs/planning/sequence.md",
    "section": "Focus",
    "message": {
      "sessionKey": "45064c49a54b49f9e68922eeb34de51da7074178f6ad2cf068a2c931a108b192",
      "recordedAt": "2026-11-09T23:13:48.592Z"
    },
    "captureDigest": "sha256:9006bd8cbcdabb5647594adb6893150aaff9e5a8ee74260a4e890e9cba3d69ae"
  },
  {
    "rule": "An instance pass sends an item only when it stops that instance's next order and has no working route there, and keeps every other observation in its own record.",
    "document": "docs/product/07-execution-guide.md",
    "section": "Operator-opened planning pass",
    "message": {
      "sessionKey": "45064c49a54b49f9e68922eeb34de51da7074178f6ad2cf068a2c931a108b192",
      "recordedAt": "2026-11-09T23:13:48.592Z"
    },
    "captureDigest": "sha256:9006bd8cbcdabb5647594adb6893150aaff9e5a8ee74260a4e890e9cba3d69ae"
  },
  {
    "rule": "A planning pass in an instance writes a block for core only for an item that stops the instance's next order and has no working route there.",
    "document": "docs/KIT.md",
    "section": "Planning in this instance",
    "message": {
      "sessionKey": "45064c49a54b49f9e68922eeb34de51da7074178f6ad2cf068a2c931a108b192",
      "recordedAt": "2026-11-09T23:13:48.592Z"
    },
    "captureDigest": "sha256:9006bd8cbcdabb5647594adb6893150aaff9e5a8ee74260a4e890e9cba3d69ae"
  },
  {
    "rule": "The number of reviewers an order has follows the evidence; until a pass reads fifteen paired rounds, every order after WO-262 declares a paired first round.",
    "document": "docs/planning/sequence.md",
    "section": "Rules in force",
    "message": {
      "sessionKey": "45064c49a54b49f9e68922eeb34de51da7074178f6ad2cf068a2c931a108b192",
      "recordedAt": "2026-11-09T23:28:46.268Z"
    },
    "captureDigest": "sha256:e1c8d0ae73fb667fbfa8aa82a58b9c6d054eaa53a521fd82a84bc8612e573237"
  },
  {
    "rule": "WO-244 and WO-083 are moved down, and WO-263 is kept because faster gates stay a priority.",
    "document": "docs/planning/sequence.md",
    "section": "Not now",
    "message": {
      "sessionKey": "45064c49a54b49f9e68922eeb34de51da7074178f6ad2cf068a2c931a108b192",
      "recordedAt": "2026-11-09T22:27:09.158Z"
    },
    "captureDigest": "sha256:7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7",
    "class": "direction"
  }
]
```

<!-- dotln-rules-recorded:end -->

## Process cost

## Validation

