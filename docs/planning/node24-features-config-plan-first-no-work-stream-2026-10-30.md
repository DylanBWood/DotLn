# Planning pass — Node 24 beside Node 26, the features file, plan-first mode and the end of the predecessor track (2026-10-30)

## Dispatch and capture

Dispatch: `planning: standard planning pass +` with eight numbered items and
a pasted block from the DotLn-Enterprise-Starter fork's (dylanwoodconsulting)
pass of 2026-10-30, sent at 2026-10-30T14:54:24.168Z (hook time) in Claude
Code 2.1.314, Fable 5.1 at `max`, operator-selected (the `/model` line of
the session). Captured verbatim in ignored intake,
`docs/intake/notes/planning-node24-features-config-plan-first-no-work-stream-2026-10-30.md`,
SHA-256 `94d4f4bd85efaf035a89353d6ad88abedf8e1d29c2c298fe1b3d69b62806bd8a`.
Branch: `planning/2026-10-30-node24-features-config-plan-first-no-work-stream`
from clean `main` at `4090d70d` (v0.103.1). The prompt hook read the
dispatch as a paste (the `planning:` line arrived inside a pasted block), so
no role was active for `harness usage` and no scratchpad grant was equipped;
helper scripts ran from the ignored lane `docs/control/local/planning-2026-10-30-b/`,
as the 2026-10-28 pass's did; evidence for WO-226's first-line reading.

The operator's read-first instruction: a second planning pass received the
same items and opened a branch and a pull request, and this pass must not
read either. Honored by not listing branches or pull requests (`git worktree
list` was read with its branch column dropped; no `git branch -a`, `git
fetch`, `git log --all` or `gh pr list`), and by not opening the ignored files
`docs/control/local/planning-20261030-pr.md`,
`planning-20261030-all.json` and `planning-20261030-all-final.json`, whose
names say they belong to that pass; nothing else of it was seen. What this
pass did read is named in §Readings.

| Item | Aim read | Disposition |
| --- | --- | --- |
| 1 | the launchpad and the kit run on Node 24.15.0 beside Node 26 | WO-240 filed |
| 2, 2.a, 2.b | one readable file of the features an instance elects; an inventory that grows; operator-scope against core-scope | WO-241 filed |
| 3, 3.a, 3.b, 3.c | the predecessor track leaves this repository; a one-time pass removes the predecessor and work-context sentences; the operator's private instance carries its needs by generic prompts and never clones core | WS-002 and WO-228 retired in place; the standing documents and open orders edited; product 07 precondition 5 extended; one question left for the operator (§NoOps) |
| 4 | the starter works when cloned into a private repository; the recipe is right | rehearsed green against local stand-ins; the kit README carries the recipe through WO-240; one omission named (the local-terms step) |
| 5 | may a fork's own tracker script serve a planning session, and what is needed | answered: yes today by hand; the first-class seam is WO-207's extension point plus one planner step, carried in by WO-207 |
| 6, 6.a | a mode that plans, shares, converses and only then implements; three documents in the target repository | WO-242 filed |
| 7 | the fork's block | each item read against its record; answers in the paste-ready section |
| 8 | why release close demanded that build directories be saved | diagnosed (a reboot renumbered the volume; the owner-record check compares device numbers); WO-237 amended with the fix and moved to second |
| the operator's message of 16:06:52Z (captured in `docs/intake/notes/planning-node24-features-config-plan-first-no-work-stream-2026-10-30-message-2.md`, SHA-256 `d0858f68081f290574bb4ba07d6fa034d85b4df0912d1d93416faa99d8a7e7af`), on the pass having left the floor's naming sentence and asked about it | the direction of item 3.a reaches that sentence; asking was the pass's error | the sentence removed from `CLAUDE.md` §Clean Room; the floor's prohibitions unchanged; the NoOp withdrawn and the register row settled |

Assumptions recorded: "operator-specific loadouts vs core-specific" is read
as the scope of a feature (core, instance or both), not as the compiled
loadout ids; "remove any comments about predecessor or work" is read as the
category of sentences about the operator's earlier workflow and the
operator's employment context, not as the clean-room rule that forbids
importing from either, which stays. Reopen either reading on the operator's
word.

## Readings

### Entry

- `plan start`: 29 failure items since receipt 058, all WO-235's (VER-003
  and VER-004 failed and were repaired; three `PlanExecutionAmended` for
  D063; four corrections; FINAL-001 passed with one escape, the stale
  `off-ramps.mjs` evidence-source declaration). 22 interventions, 20 of
  them unclassified prompt-hook rows; 3 local release closes; 8 long
  phases; 8 recent closes, 1 delivery and 7 machinery. Routed: the escape's
  follow-up (WO-235-D065) is WO-240's carry-in; the repair directives are
  discharged (§Register).
- `plan conditions`: 4 hold. The release-tags table in product 06 lacks the
  five newest tags (`npm run release -- list --markdown --write` adds them;
  a release close's step, not a pass's); the plain gate's thirty-day median
  is 492.9 s against 360 (FUP-e96221b106cd136a, whose condition "still above
  360 s when WO-239 closes" has occurred); the skeleton task's latest fresh
  run 486.8 s against its 299.5 s median; the target-worktree task 611.3 s
  against 126.6 s. Disposed as a NoOp (§NoOps).
- `gh issue list`: no open issues.
- Canonical status: WO-239 closed (v0.103.1, tag at 2026-10-30T13:35Z, the
  starter refreshed at 13:37Z); WO-235 closed (v0.103.0); WO-192 active in
  its preserved worktree `../DotLn-wo192` at `939af628`; no active order in
  this checkout.
- `harness usage`: "Token measurement requires an active role and dispatch
  start"; counters unknown.
- The register: 231 pending rows at entry (14 untriaged, 6 needs-review,
  211 deferred); the rows whose reopening conditions name WO-235 or WO-239
  were read (§Register).

### Item 1, Node 24

`engines` is `>=26.0.0 <27` in `package.json` and all six
`packages/*/package.json`; `.node-version` is `26.9.0`; `fnm list` shows
only `v26.9.0`; `fnm ls-remote` lists the 24 line through `v24.22.2`, so
`24.15.0` exists. No continuous integration (`.github/workflows` absent);
nothing compares the running Node to the field (`bootstrap.mjs` runs `npm
ci --ignore-scripts`, which warns and continues; `checkHost` judges memory
only). The export spreads `corePackage.engines` (`scripts/launchpad.mjs`
416, 473), so the starter carries the same field and the kit exports no
`.node-version`. A static scan found only APIs present in 24 (`fs.globSync`,
stable since v24.0.0 by the Node 24 reference; `process.getBuiltinModule`,
v22.3; `--test-isolation`, v22.8); locked dependencies require `>=16.20.0`,
`>=20`, `>=14`. The scan is a reading; the gate run under 24.15.0 is the
evidence, so WO-240 makes the run and records it, adds a host check that
refuses a runtime outside the range, and keeps `.node-version` on 26.

### Item 2, the features file

`dotln.config.json` exists already (`scripts/lib/config.mjs`, schema 1,
eleven sections, unknown keys refused). Four boolean `release` surface
toggles are declared and read by no script outside a test;
`kit.applyInstanceActions` is read by the update; `build.*` are selections.
Elections also live in `budgets.json` as `null` and in compiled defaults
(the Tinkerer economy, WO-150). Nothing lists what can be turned off or by
whom, or that the six refusals and the floor cannot be. WO-241 adds a
`features` section (booleans or `{ on, note }` by feature name) to the one
file every loader resolves, a registry naming each feature's scope,
default, sentence, key and reader (`unread` where nothing reads it), a
generated `docs/control/FEATURES.md`, and wires the Tinkerer election and
`plan-first`. A second file in another format was rejected (one
configuration source; no YAML or TOML parser in the runtime).

### Item 3, the predecessor track

WS-002 (`docs/workstreams/WS-002-predecessor-track.md`) had one member,
WO-228, never activated (no control segment; the index shows `phase: draft`
under Workstreams, `track: separate`). The lifecycle's `withdraw` admits
phase `none` only for an allocated order (`scripts/resume.mjs` 312 to 314;
product 07 §Operator recovery controls), and the docs check's link checker
reads every Markdown file under the document root (`linkFailures` over
`markdownFiles(root)`), where the planning records of 2026-10-21 and
2026-10-24 link to both files. So both are retired in place: WS-002's
document states the retirement (state `abandoned`, the block unchanged in
shape so the index's membership rule holds), WO-228 carries a `Retired
(2026-10-30)` header saying it is not activatable, the sequence drops the
group (a separate track's members need no entry, `checkSequenceCoverage`),
and WO-088 carries the typed retired field as a carry-in. The one-time pass
(3.a) edited every sentence about the operator's earlier workflow or
employment context in the standing documents and the open orders:
products 00, 03 (two passages), 05, 06 and 12 (the work-instance paragraph,
the census paragraph removed, four sentences), the sequence's Focus, the
map's separate-track paragraph and the WO-193 and WO-228 rows, WO-193
(fourteen lines), WO-207 (twelve lines), WO-083 (one line). Left as they
are: the clean-room rules themselves (the floor in `CLAUDE.md`, the
employer/secret boundary sentences in products 02, 04, 07 and 09, the
non-goals that forbid importing from an earlier workflow), dated records
(planning documents, decisions, receipts, the map's dated candidate
sections, the ADRs) and generic uses of the word (a document's predecessor
instance, a revision's predecessor). `README.md` line 86 was edited and
reverted: the docs check refuses a front-page change on a branch that names
no order; WO-240 carries that sentence under a `**Front page:** README.md`
header (3.a reaches the front page through the order). The floor's sentence
"Refer to the predecessor as `v1`; use enterprise tracker, ticket artifact,
and constrained managed host as generic terms" was first left in place and
asked about; the operator's message of 16:06:52Z answered that item 3.a
reaches it, and the sentence is removed from `CLAUDE.md` §Clean Room. The
floor's prohibitions (never import employer code, configuration,
identifiers, internal services, credentials or secrets; stop and flag
suspect material; no support or generated configuration may weaken the
floor) are untouched, and the harness manifest's residue line that the
hand-written floor stays locked still describes them. 3.b is written into product 07's planning
preconditions (item 5) and product 12; 3.c into the sequence's Focus.

### Item 4, the starter in a private repository

Rehearsed under `node scripts/harness.mjs bounded --` against local
stand-ins in the system temporary directory (a bare mirror of the starter
checkout at v0.103.1 with one added tag; an empty bare repository as the
private origin), 1.3 s end to end: `git clone --no-tags` carried `tagOpt
--no-tags` into the remote renamed `upstream`, so the explicit `git config`
line is redundant and harmless; no tag reached the clone before or after a
plain `git fetch upstream`; `git push -u origin main` set `main` to track
`origin/main`; `node scripts/bootstrap.mjs` ran `npm ci` (10 packages) and
`harness emit` (35 generated surfaces); `node scripts/harness.mjs check`
passed with one advisory, `local-terms list: unavailable`. The commands are
correct and complete for a clone; the kit README's first steps add what the
two commands omit for first use: the local-terms list at
`docs/control/local/terms.txt` (publication refuses without it), `npm run
meta` before the first gate, and the first order's worktree. The rehearsal
ran under Node 26.9.0; the starter's `engines` says `>=26.0.0 <27`, so on a
Node 24 host `npm ci` warns and every script runs: WO-240 is the order the
work clone waits for, placed first. The starter README already names the
remote `upstream` and `update --finish` reads `origin/main`, which is the
private repository in this setup.

### Item 5, a tracker script in the fork

The machinery as planned: WO-207 (seventh in the queue, absorbing WO-208)
gives an instance an `extensions` root outside the kit and `source`
adapters loaded through the `SourceAdapter` port with the `decodeSourceBundle`
screen; its consumer is the vertical's fetch seam, not a planning session,
and the tracker adapter is explicitly the instance's own. The planning pass
takes its intake from pasted blocks, the register, orders, decisions and
`gh issue list` (product 07 §Operator-opened planning pass, preconditions 5
and 6). Answer: today the fork's planner can run any script of the fork's on
the operator's word and read its screened output from the fork's ignored
intake, as it reads a pasted block, with no change anywhere; the first-class
route is the script as a `source` adapter plus one planner step that reads
each configured source's open items beside `gh issue list`. That step is
written into WO-207 as a carry-in; the fork's script is never written or
described in core.

### Item 6, plan-first mode

What exists: `resume: next` dispatches an executor procedure
(`contributor.ts` 625 to 636) with no step that reads an operator's reply;
`analysis:` pauses without a document; a guided-operator order has the
operator do steps; the hook admits every executor write while the order is
`active` or `repairing` (`harness-host.ts` 5087), in the registered target
too since WO-236; a target's documentation root holds `evidence/`,
`verifications/`, `final-reviews/` and `work-orders/` per order; the terms
and outward screens exist for publication. WO-242 adds the mode as an
instance election: three documents under the order's evidence path (in the
target's documentation root for a target order), two events inside `active`
(`PlanProposed`, `PlanApproved` with the operator's captured words), a hook
judgment that refuses implementation writes while a proposal awaits, the
executor's plan-first steps (paraphrase the terminal into the conversation,
announce every transformation before carrying a passage, never rewrite the
operator's lines, infer approval from ordinary words), the screens'
selection, the kit README and the router's stop and resume (written against
WO-192 as filed). A new lifecycle phase was rejected for the beacon codebook
and every phase consumer it would touch.

### Item 7, the fork's block

Read against the fork's pass document
(`../DotLn-Instance/docs/planning/standard-pass-v0-103-0-2026-10-30.md`
§Requests to core, §Register, §Core's answers of 2026-10-28), the target's
WO-019-D031 (`../DotLn-Angular/docs/dotln/evidence/WO-019/decisions.md`),
and core's rows. Item 1: recorded; the four seeds are evidence on
FUP-b44117f7b047e976 (WO-207). Item 2: recorded; the hook's reach is
evidence on FUP-3682b768d1d00a3b. Item 3: answered; the rule already holds in
product 07 (a target order keeps its declared target gate; completion
consumes rows only for the checks the criteria name) and is stated
explicitly now, and the executor role's unconditional closeout sentence is
corrected in WO-242 as a carry-in; the integrate helper's affected list is a
report, not a duty. Item 4: recorded on FUP-632348a91b2ae9d8. Item 5: (a) on
WO-088's row; (b) WO-238 drops the field, already queued. Item 6: evidence
written into WO-237's Observed gap. Item 7: acknowledged.

### Item 8, the release close and the build directories

The close helper's prune judges every owned root by its owner record;
`readTemporaryOwner` throws "Temporary owner record is invalid or the
directory was replaced" when the directory's current device number differs
from the recorded one (`packages/skeleton/src/temporary-root-records.mjs`
362 to 366), `writeTemporaryOwner` and `applyTemporaryCandidate` compare the
same way (375; `scripts/lib/temporary-prune.mjs` 557), and the prune
retains a root with the thrown message (497). The host rebooted at
2026-10-29 16:24 local (`sysctl kern.boottime`); WO-239 activated at
14:23Z that day and its implementation ran 18 hours across the reboot;
its close on 2026-10-30 was the first after it. Every owner record created
on this host since the reboot carries device 16777234 (seven session-scratch
records read on 2026-10-30, every one matching the directory). The
refused directories are gone, so the pre-reboot number is not observable;
the inference, recorded as such in WO-237, is that the volume's device
number is assigned at mount and changed at the reboot, so the records of
directories created before it failed a comparison that the inode and the
token file already answer. The role text then sent the operator to the
preservation route, which is for operator material, not regenerable build
output. WO-237 (retention and the prune) takes the fix: a root is its token
and its inode, a changed device number is re-stamped and ledgered, with a
paired control at the base; placed second.

## Orders filed and amended

- **WO-240 — Node 24 beside Node 26** (new; machinery; minor; first). The
  engines range `^24.15.0 || ^26.0.0` in seven packages, a host check that
  refuses a runtime outside it, one recorded complete gate run under Node
  24.15.0, the kit README's runtimes and private-clone recipe, and the
  front page's two sentences under a `**Front page:** README.md` header.
  Carry-in: FUP-4c704bb1ea210f14 (the stale `off-ramps.mjs` declaration,
  removed in the same re-mint).
- **WO-241 — The features file** (new; delivery; minor; fourth). The
  `features` section, the registry, `npm run features`, the generated
  `FEATURES.md`, the Tinkerer election rewired and `plan-first` declared.
- **WO-242 — Plan-first mode** (new; delivery; minor; fifth). Three
  documents, two events, the hook judgment, the executor's plan-first steps,
  the screens' selection, the router step against WO-192 as filed, the kit
  README. Carry-ins: FUP-0f2a756698374d7e (a host notification is never an
  operator turn), FUP-0695bdd05c71bf08 (the teammate's first hour), the
  fork's item 3 (the executor closeout sentence for target orders).
- **WO-237 — amended.** The device-number identity rule (Cost, Observed gap
  with the fork's item 6 as evidence, Design, step 7, criterion 8,
  Preflight, controls); the WO-239-D020 carry-in (the routine prune home,
  measured before chosen); moved to second on the operator's item 8.
- **WO-238 — amended.** Carry-in WO-235-D022 (the handoff loop that reruns
  the document gate) in its text and on its row; FUP-68fd3e0d6448ed01
  (writing-guidance checks) on its row.
- **WO-088 — amended.** Carry-in: the `**Retired (YYYY-MM-DD):**` field for
  a hand-filed order that never activated (WO-228 first); known issue: the
  fork's skeleton observation (5a).
- **WO-207 — amended.** Twelve work-context sentences reworded (3.a); the
  planner's source seam as a carry-in (item 5).
- **WO-193 and WO-083 — reworded** (3.a; fourteen lines and one).
- **WO-228 — retired in place** (a `Retired (2026-10-30)` header; not
  activatable; the text kept as the record). **WS-002 — retired in place**
  (the document rewritten to its retirement; state `abandoned`; the block's
  shape kept).

Every new order carries a Design with rejected alternatives and their axes,
an Execution plan naming one file and one check per step, a Preflight line
spelled as the handoff reads it, criteria ending in `npm test -- --review`
and `npm run test:docs`, no byte bound, the recurring-work cost rule (the
host check, the render, the hook judgment and the re-stamp each measured
before and after), and the `--review` sentence where a declared machinery
source changes. `followups --touching` was run for WO-228 and WS-002 before
their retirement (one row, FUP-8633adee1d36d76d, disposed).

## Register

`followups --sync` minted seventeen rows from this document's candidates
section in the map; `--apply` took forty-nine dispositions in one batch at
revision `693722a3…`, leaving revision `bd58cf86…`; after the receipt a
second sync (the map's candidate item 10 rewritten on the operator's
answer) returned FUP-2779e86c60788238 to review and a second `--apply`
settled it at revision `7dc8671c…`, leaving `79befe3a…`. The dispositions:

| Rows | Disposition |
| --- | --- |
| FUP-fca08f20a522f7c6 (a fork's tracker script as a planning source) | allocated to WO-207 |
| FUP-c708c5e2098c3b09 (a retired state for a never-activated order), FUP-e5c861f86f7568a0 (a hand-written skeleton after a mid-pass update) | allocated to WO-088 |
| FUP-8cc18bcfb0197284 (WO-235-D022, the handoff loop), FUP-68fd3e0d6448ed01 (WO-235-D051, writing-guidance checks) | allocated to WO-238; FUP-222f422d85fbb53e duplicate of the first |
| FUP-69af2e1da022aa7a (WO-239-D020, the routine prune home) | allocated to WO-237; FUP-113e673d4233c31f duplicate |
| FUP-4c704bb1ea210f14 (WO-235-D065, the stale declaration) | allocated to WO-240 |
| FUP-0f2a756698374d7e (WO-219-D042's occurred condition), FUP-0695bdd05c71bf08 (the teammate's first hour) | allocated to WO-242 |
| FUP-b44117f7b047e976 (WO-207's template-seed carry-in) | re-allocated with the fork's item 1 as evidence; FUP-0ee8d88e735e5527 settled onto it |
| FUP-7d7c75dfd2d1026c and FUP-e96221b106cd136a (the cold gate) | deferred as a NoOp (§NoOps) |
| FUP-977e50f635de762d (WO-239-D023) | deferred with its own condition; FUP-b105ef71e17a0b61 duplicate |
| FUP-8633adee1d36d76d (the predecessor orders C1 to C4) | declined on the operator's direction; FUP-2e0ba429b055b00e duplicate |
| FUP-67b423fdf450129c, FUP-1c36325905c52243, FUP-855495d77825af2b (the work-setup candidates of 2026-10-24) | deferred again; they reopen when the operator carries the need into a core pass in generic words (3.b); FUP-db3940b4c418c536 settled as their record |
| FUP-42ef286b6dc024ad (the two files kept), FUP-ca71e4b11b7779a3 (a per-order plan-first header), FUP-03c675456fa8e484 (a Node version per gate row) | deferred with their conditions |
| FUP-2779e86c60788238 (the floor's naming sentence) | first deferred as a question; settled after the receipt on the operator's message of 16:06:52Z: the sentence is removed |
| FUP-7a6b84d04a0cbb4c (Node 25) | declined |
| FUP-1a6a5fa73117b25c, FUP-cfa8aaa3441ad501 (the fork's items 2 and 4 as evidence) | settled onto FUP-3682b768d1d00a3b and FUP-632348a91b2ae9d8, both re-deferred with that evidence |
| FUP-75d361f43a699228 (the issue intake as a planning input) | deferred again, naming WO-207's seam |
| FUP-be6721fbdd4b6285 (D029's latency) | deferred again; the fork reports no measurement |
| FUP-0083 (product 03's absence candidate) and FUP-0126 (product 12's candidate) | deferred again at their new source revisions (3.a's rewording changed their text, not their substance) |
| FUP-26f3950b44d6cfe8, FUP-b6dd1acbc01c11db, FUP-4a7c27e6c428ea55, FUP-644bf5db02876c15, FUP-65fa4e70494f558c, FUP-7d3d2e7566c8923e, FUP-8331693069c2747d, FUP-8fb693e06e4c178c, FUP-c47eeb041f0952c4 | settled: WO-235 closed with its repairs discharged and D063's removal recorded |
| FUP-2eb40c68c4c77db4, FUP-5698ab63b327b4c6 | declined again at their new revisions |
| FUP-3682b768d1d00a3b, FUP-5368790319434d5f | deferred again at their new revisions |
| FUP-92f34e24a8f975b4 (WO-235-D059) | declined: the router it assumed was removed |

## NoOps

Each decline or deferral above is a `NoOpIntent` with its reason and
evidence in the register's disposition and its `usefulWhen` as the
reopening condition; the ones the operator's items raise directly:

- **The cold gate** (FUP-e96221b106cd136a). Reason: the operator's direction
  of 2026-10-13 runs the product sequence; the complete run is paid once per
  order at final review; the two slow tasks' growth has no named cause.
  Evidence: `plan conditions` on 2026-10-30 (492.9 s median; skeleton 486.8
  against 299.5; target-worktree 611.3 against 126.6). Reevaluation: every
  pass reads the conditions. Useful when the median exceeds 600 s, a cause
  is named in an order's decisions, or the operator names gate time a goal.
- **The floor's naming sentence in `CLAUDE.md`: a withdrawn NoOp and a
  correction.** The pass first left the sentence and asked whether item 3.a
  reaches it, reading the locked floor as outside the literal correction.
  That was the error: the sentence names the predecessor and the work terms,
  which is exactly the category item 3.a names, and removing a naming
  convention weakens none of the floor's prohibitions, which are what the
  lock protects. The operator's message of 16:06:52Z reaffirmed the
  direction; the sentence is removed and the register row
  FUP-2779e86c60788238 is settled on that answer. Evidence: `CLAUDE.md`
  §Clean Room before and after; the capture named in §Dispatch and capture.
- **WS-002 and WO-228 kept at their paths.** Reason: records link to them
  and the lifecycle cannot withdraw a never-activated order. Evidence:
  `linkFailures` over every Markdown file; `OFF_RAMP_PHASES.withdraw`.
  Useful when WO-088's retired field lands or the operator authorizes the
  record edits a rename needs.
- **No order for item 4.** Reason: the recipe is correct and the starter
  works as cloned; what it lacked is documentation, carried by WO-240.
  Evidence: the rehearsal log. Useful when a clone on a Node 24 host fails
  a step the README did not predict.
- **No order for item 5.** Reason: the operator is considering the route;
  the no-machinery route works today and the first-class seam rides WO-207.
  Useful when WO-207 activates or the fork asks sooner.
- **Node 25; a per-order plan-first header; a Node version per gate row.**
  Reasons and conditions in the map's candidates section.
- **The predecessor orders C1 to C4.** Declined on the operator's direction;
  useful only on the operator's word that core carries such work again.

## Sequence

WO-235 (v0.103.0) and WO-239 (v0.103.1) left the list as closed; the WS-002
group left because a separate track's members need no entry and its one
member is retired. WO-192 leads the list as the active order (WO-242's
router step defers to it, and `plan check` requires a dependency ahead of
its dependent); of the orders not yet active, WO-240 first (small; the work
clone waits on it), WO-237 second (small; the operator's live defect),
WO-238 third, WO-241 fourth, WO-242 fifth (it reads WO-241), then WO-083,
WO-207, WO-193, WO-183, WO-088, WO-091, WO-096, WO-014. The rule that every
open order has a place gained the sentence about separate-track and retired
members. The Focus carries 3.c. Serial order stays the operator's direction
of 2026-10-13.

## Write-backs and ceilings

- Product 00 §The one-paragraph story: the founding lesson stated as a
  mechanism of prose rule-loading, no earlier system named (3.a).
- Product 03 §Platform and instance boundary (the license posture of a
  private fork) and §Candidate — progressive absence authority (the
  candidate's origin stated without an earlier system) (3.a).
- Product 05 §Rhythm patterns (the same origin sentence) (3.a).
- Product 06 (the WO-193 rung without the map) (3.a).
- Product 07 §Preflight before the full gate: a target order whose criteria
  name only its target gate and the document gate owes no launchpad complete
  run, and the integrate helper's list is a report (the fork's item 3).
  §Operator-opened planning pass, precondition 5: a private instance whose
  operator never clones core carries its needs in the operator's own generic
  words (3.b).
- Product 12 §Arriving at the desk (the private-instance case without the
  work context, with the 3.b route), §Replacing a successful but costly
  workflow (the import rule and the inventory sentence without the earlier
  system; the census paragraph removed), §One workstream across repositories
  (two sentences), §Open product choices (one line) (3.a).
- `CLAUDE.md` §Clean Room: the naming sentence removed on the operator's
  message of 16:06:52Z; the prohibitions and the intake paragraph unchanged.
- `README.md`: edited and reverted; the front page changes only through an
  order, so WO-240 carries its two sentences.
- The sequence, the map (rows for WO-240 to WO-242; WO-237, WO-228, WO-193,
  WO-207, WO-088 and WO-238 rows; the separate-track paragraph; one dated
  rationale paragraph; the candidates section), the idea ledger's
  registration, `docs/control/doc-ceilings.json`.

Ceilings, reset to measured non-exempt bytes plus one tenth, citing this
document:

| Document | Non-exempt bytes | Ceiling before | Ceiling now |
| --- | --- | --- | --- |
| 00-vision.md | 28208 | 31103 | 31029 |
| 01-principles.md | 9462 | 10409 | 10409 |
| 02-domain-model.md | 150031 | 165035 | 165035 |
| 03-architecture.md | 190264 | 209358 | 209291 |
| 04-interfaces.md | 67351 | 74087 | 74087 |
| 05-pattern-library.md | 136813 | 149890 | 150495 |
| 06-roadmap.md | 41870 | 46149 | 46058 |
| 07-execution-guide.md | 288468 | 306914 | 317315 |
| 08-publication-compiler.md | 27245 | 29167 | 29970 |
| 09-audit-resilience-privacy.md | 53441 | 58786 | 58786 |
| 10-ir-compatibility.md | 25787 | 28366 | 28366 |
| 11-proteino.md | 2058 | 2264 | 2264 |
| 11-protino.md | 30626 | 33689 | 33689 |
| 12-workstream-application.md | 26072 | 30516 | 28680 |
| 13-uifa-roles.md | 27084 | 29793 | 29793 |

## Answers to the fork (paste-ready)

This section is the pass's own choice, as product 07 §Operator-opened
planning pass precondition 5 asks for a paste-ready block.

```text
Answers from core's planning pass of 2026-10-30 (docs/planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md) to the DotLn-Enterprise-Starter fork's block of its pass of 2026-10-30 on starter v0.103.0. Read each against the record it names.

1. Recorded. The four template-derived seeds (README.md, docs/control/budgets.json, CLAUDE.md's generated block, docs/PLAYBOOK.md) carried with no instance action declared are evidence on core's row FUP-b44117f7b047e976, allocated to WO-207 (eighth in core's queue after this pass; a convenience, your update continues). Core's v0.103.1 close took the refresh in one invocation.
2. Recorded; nothing asked. Your field evidence (edit-tool writes judged and granted with kind target-worktree; shell-program writes fell to host permissions, which refused none) is on core's row FUP-3682b768d1d00a3b (DotLn-owned authority with minimal native restrictions), which stays deferred.
3. Answered. A target order whose criteria name only its declared target gate and npm run test:docs owes no launchpad complete run at its closeout: completion consumes rows only for the checks the criteria name, and product 07 §Preflight before the full gate now says so in those words. The integrate helper's affected-check list reports what main's merge touched and creates no duty. The executor role's closeout sentence ("Start one complete run ... for every execution") is the defect; core corrects it in WO-242 (fifth in core's queue) as a carry-in, so until that release your executor reads the sentence under D031's reading, which product 07 confirms. Blocks nothing; your row FUP-2403ce12b1fca8b2 can settle on this answer.
4. Recorded on FUP-632348a91b2ae9d8; nothing asked. Core reads the first stop or acceptance when your next block carries it.
5. Recorded; nothing asked. (a) is a known issue on core's WO-088 row: the planning-document check admits a document written by hand to the current headings when plan start predates a mid-pass update. (b) WO-238 drops the Checked: field as before (third in core's queue).
6. Recorded as evidence in WO-237's Observed gap (second in core's queue after this pass): WO-019's journals left with its worktree. WO-237 also takes a fix core needed today: a temporary root whose volume was renumbered by a reboot is judged by its token and inode instead of refused (core's v0.103.1 close refused six of its own build directories). Your row FUP-64d1967b092ea18a waits for the release that carries WO-237, as you recorded.
7. Recorded; nothing asked.

One item of core's own for your next pass to read: core's planning precondition 5 now says that a private instance whose operator never clones core carries its needs through the operator's own planning prompts in generic words; your route through this block is unchanged.
```

## Process cost

Model and effort: Fable 5.1 at `max`, operator-selected (`CLAUDE_EFFORT=max`;
the `/model` line). Subagents: budget 20 (`docs/control/budgets.json`
`subagentCap`); plan one, the refuter (`dotln-worker`, claude-opus-5-5 at
xhigh; the dispatch names no fable worker); none other spawned. Usage at
entry: unknown (`harness usage` refused: no active role). The rehearsal of
item 4 ran 1.3 s under the bounded wrapper; `plan conditions` ran 54.2 s at
entry and 50.8 s inside `plan start`. The subject was committed at
15:58Z (the first commit `30d2bc05`, one hour and four minutes after the
dispatch at 14:54Z); the refuter was dispatched at 16:04:39Z and handed back at
16:18:42Z (14 min 2 s); its statement was repaired once by the same worker
for private absolute paths, without rerolling the judgment; the receipt
helper measured dispatch to file at 19 min 41 s. The handoff figures are in
the response and the receipt.

## Validation

Recorded in order as the pass ran them; the figures after the receipt are
appended when it is filed.

- `npm run plan -- followups --sync` (17 rows minted) and `--apply` (49
  dispositions; revision `bd58cf86707bfa08e94ec9b67b57d202fb3c7b548e95f36dd3fab1f118c012e3`).
- `npm run meta`: green; the meter's trap table flagged
  `drift-to-low-performance` (coldStartBytes 36,500, three consecutive
  rises) and `policy-resistance` (guardRefusals 3) as reopen candidates; the
  next pass reads the series.
- `npm run work-orders -- index` and `npm run format`: green.
- `node scripts/docs-check.mjs`: the ceilings table above; 50 operator-word
  advisories, all in records this pass did not write; one failure, the
  front-page change, resolved by reverting `README.md` and routing the
  sentences through WO-240.
- `npm run meta -- --plan-cost`: refused before the commit ("expected one
  committed order file for WO-240"); green after it (`89bdd3b6`).
- `npm run plan -- check` after the commit: one topology finding (WO-242's
  planning-deferral edge to WO-192 with WO-192 listed after it), repaired by
  listing the active WO-192 first; then "planning pass needs a receipt",
  as expected.
- `npm run test:docs` before the receipt: the first run stopped at the
  entropy task on two stale publication editions (the product edits staled
  their source locks); `npm run sync` regenerated them (`ece12f35`); the
  second run read 24 passed and 3 awaiting the receipt, in 0 h 3 min.
- `npm run plan -- refute` at `ece12f35`; one fresh `dotln-worker`
  (claude-opus-5-5 at xhigh by the pin; the worker took no host readback)
  returned `aligned-with-findings` for all six judged orders (WO-240,
  WO-237, WO-241, WO-242, WO-207, WO-193), twenty known issues, no observed
  failure, no vision contradiction and no hold. The worker disclosed that
  the harness refused its literal-path scratchpad write (no role was
  dispatched, so no outside-write grant was equipped) and that earlier
  relative-redirect writes to the same scratchpad were not judged; the
  same WO-144 boundary the 2026-10-28 pass met, recorded here as evidence
  for WO-226's first-line reading.
- `npm run plan -- receipt` filed
  [receipt 059](refutations/2026-10-30-planning-fd5845a6f7f28b17-059.md)
  (`db35de71`): scope pass, 8 verdicts carried by hash, 59 receipts, 48
  passes, no advisories. The twenty known issues are recorded on the six
  catalog rows with the planner's readings: WO-240 three (the fixture pins
  the 24-line lower bound; the Node 24 run is re-run when a runtime source
  changes after it; the refusal is the design), WO-237 two (a failed move is
  the existing cleanup blocker; the negative control for a replaced
  directory), WO-241 three (a no-op election refuses; the closed-WO check
  is an advisory; a renamed id loads with an advisory for one release),
  WO-242 four (the hook refuses from activation until approval; the
  approval's trust model is WO-158's; the root with the election off is
  byte-identical; a self order's conversation document is not committed
  with a refuse term), WO-207 five and WO-193 three (for their activating
  passes).
- After the receipt: the operator's answer on the floor's sentence applied
  (`CLAUDE.md` §Clean Room; the map's item 10; this document), the second
  register batch, `npm run meta`, `npm run format`, the commit, then `npm
  run test:docs`, the push and the `:memo:` pull request, whose results
  are in the response.
