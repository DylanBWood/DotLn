# git 2 31 support and fork returns — 2026-11-08

## Dispatch and capture

The operator dispatched `planning: standard planning pass +` with four
items. The prompt hook journaled it at 2026-11-08T23:31:17.405Z (class
direction, role planner, 9,323 bytes, `prefixLine` 3): the dispatch stood
behind the host's `/model` command output and inside the paste wrapper, and
the role, the scratch grant and the usage standing were resolved on the
first prompt. That is this repository's own observation of WO-257 step 11's
reader, matching the fork's (below). Host: Claude Code 2.1.319, Fable 5.1 at
max, operator-selected in that same command.

The capture is
`docs/intake/planning-dispatch-2026-11-08-git-2-31-support-and-fork-returns.md`,
ignored, byte-identical to the message as the hook read it, SHA-256
`a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`, which is
the journal row's own digest.

The four items, in this pass's words:

1. The DotLn-Enterprise-Starter fork's block after starter v0.120.1: six
   items, none asking for a change.
2. The operator's statement that the work laptop's Git is 2.31.0, that the
   floor of 2.40.0 shipped in v0.121.0 stops all progress there, and the
   question of why the floor was filed.
3. The fork's block after starter v0.122.0: eight items, three of them asks
   (2, 5 and 8).
4. Other fixes, efficiencies and improvements to core functionality,
   because the operator wants to start testing on the work laptop.

## Readings

### How a floor above the operator's own host was filed (item 2)

The record answers the question directly.

- The fact was in front of the 2026-11-07 pass. The work laptop
  instance's block in that day's dispatch (ignored capture SHA-256
  `123eb18018301f41fb4b107f0fb0ad53eb40eb38b13c75a906f588dc913c6cd6`, its
  item 2) reported two failures with Git 2.31 first on the path, asked for
  a host check naming a floor of 2.40, and gave a newer Git first on the
  path as its route. No other intake capture names that version (a search
  of the intake root for it returns that one file); a message outside the
  captures is not readable here.
- [The 2026-11-07 pass](first-cycle-returns-and-host-elections-2026-11-07.md)
  filed the ask as worded: its reading 2 and its answer 2 to the instance
  both say a floor of 2.40 on the instance's evidence. WO-258's Design
  rejected making the kit work on the older Git, on the ground that one
  named refusal costs less than several emulations, and
  [WO-258-D009](../../evidence/WO-258/decisions.md#wo-258-d009) recorded that
  rejection with a reopening condition (a host below 2.40.0 that the
  operator needs) which was already true on the day it was written.
  WO-258's own evidence for its criterion 5 used Git 2.31.0 as the version
  that must be refused.
- Three errors, each checked here. First, product 07 says an instance's
  item is evidence the operator carried and never direction, and the pass
  took the remedy that instance's session had chosen as the requirement:
  the evidence under the ask was the operator's own host on Git 2.31, and
  a floor above it refuses that host. Second, the instance had two narrow
  failures (one publication fixture and the close's classification at a
  committed revision) and v0.121.0 turned them into a refusal by
  `harness check`, `harness evidence` and every `npm test` selection, so
  the release made the laptop strictly worse. Third, nobody read the rest
  of the kit's Git use before declaring what it needs: the reading below
  finds four more forms above Git 2.31, one of them absent until a release
  well after 2.40, so the floor's own premise was unverified.
- What changes: [WO-260](../../work-orders/WO-260-the-kit-runs-on-git-2-31.md)
  makes the kit run on Git 2.31.0 and lowers the floor to it, first in the
  sequence; product 07 gains a screen that an order adding a refusal keyed
  to a host names every host the record shows and what the refusal does
  there, and a sentence that a pass reads the evidence under an instance's
  ask before the remedy it names; and the operator's rule is recorded
  (§Rules recorded).

### The kit's Git use against Git 2.31.0

Method: an extractor listed the subcommand and option pairs, the `GIT_*`
names and the configuration keys that `scripts/` and `packages/` name (673
pairs, 43 names). Each pair was checked against the manual page of its
subcommand in Git 2.31.0's own `Documentation/` text (tag `v2.31.0`, fetched
from the Git project's public repository into session scratch, 295 files)
and against the release notes installed with Git 2.55.0. Format atoms,
pretty placeholders, standard-input verbs and the Git output text the
source matches on were read by hand: the atoms in use are all older than
2.31, and the source matches on Git's wording in one place
(`scripts/refute-plan.mjs`, a not-a-repository probe).

| Form | First release | Call sites | In the kit since |
| --- | --- | --- | --- |
| `check-attr --source=<revision>` | 2.40 | `gateCodeIdentity` (`packages/skeleton/src/gate-evidence.mjs`) | 2026-09-15 |
| `ls-tree --format=` | 2.36 | `readTrackedTextAtHead` (`scripts/worktree.mjs`); `validateTargetRecordsCommit`; `readTargetRecord`; `publishTargetPlanning` | 2026-10-15, 2026-10-20 |
| `worktree list --porcelain -z` | 2.36 | `outsideWriteResponse`, the `main-intake` grant (`packages/skeleton/src/harness-host.ts`) | 2026-09-19 |
| `rev-parse --show-ref-format` | not in the 2.31.0 manual | `dropInventoriedStash`; `pruneContext` | 2026-09-25 |
| `fsck --no-references` | not in the 2.31.0 manual | `verify` (`packages/skeleton/src/source-change-worktree.ts`) | 2026-10-25 |
| `GIT_CONFIG_GLOBAL` | 2.32 | `gitEnvironment` (`scripts/lib/authority-probe.mjs`), one fixture payload and eight test files | 2026-09-17 |

`readTrackedTextAtHead` is how `worktree publish` reads an order's pull
request body, so by this reading an order cannot publish on Git 2.31.0 at
all; WO-258 knew of the first and the last row only. `GIT_CONFIG_COUNT`,
`--config-env` and `rev-parse --path-format` are of Git 2.31.0 itself (its
release notes), so they stay.

Limits, stated because they bound WO-260's evidence. The reading is static:
arguments assembled at run time are outside it. No Git 2.31.0 binary ran.
This host holds Git 2.55.0, 2.54.0 and 2.50.1; the session wrote a script
that downloads the Git project's 2.31.0 tarball, compares its digest and
builds it into session scratch, and the host's auto-mode classifier denied
the run before any download (its stated reason: code from an external
source). The pass did not work around the denial. WO-260's criterion 5
names that host condition and its fallback.

Dated after the orders were judged, from Git's manual at four release
tags: `rev-parse --show-ref-format` is absent at `v2.43.0` and present at
`v2.44.0`, and `fsck --[no-]references` is absent at `v2.49.0` and present
at `v2.50.0`. So one path of the kit needed Git 2.50 while v0.121.0 declared
2.40 as what the kit needs; the dating is on WO-260's catalog row, since the
order's text was already frozen.

One behavior difference that is not a failure, for WO-260's executor to
confirm on a real binary: `-c core.fsmonitor=false` is a boolean from Git
2.36 on and a hook path before it, where Git runs a command of that name,
takes its failure as "anything may have changed" and scans in full.

### What an instance holds, and the laptop's route until the release

The operator's personal instance, a fork of the starter at v0.122.0, was
read as evidence of what the laptop's instance holds. Its `package.json`
declares `engines.git` `>=2.40.0`, `KIT-MANIFEST.json` lists that file as a
kit file, and the runner test that pins the floor's value is not among its
scripts. `judgeRunningGit` reads the declaration from the checkout whose
scripts are running. So an instance that changes that one line to
`>=2.31.0`, the bytes WO-260 ships, is admitted by `harness check`,
`harness evidence` and the `host` task again; the kit guide's rule for an
edited kit file applies (an update lists it as refused until its bytes
equal the incoming kit's, which they will at WO-260's release if the line
is the only difference).

That restores v0.120.1's behavior on Git 2.31 and no more: an order's
publish, the close's classification, a target order's record and planning
reads, the stash prune and the main checkout's intake grant still need a
Git that has the five forms, first on the path for those commands, until
WO-260's release. Whether the laptop has such a Git is the operator's to
say; the instance's block of 2026-11-07 ran one case under Git 2.54.

### The fork's two blocks against the record

Block after starter v0.120.1 (six items):

| Item | Reading | Disposition |
| --- | --- | --- |
| 1 | the update taken, nothing refused | recorded |
| 2 | a dispatch behind a host command block and a paste wrapper resolved its role on the first prompt | recorded; this pass's own dispatch shows the same (`prefixLine` 3), so the case WO-257 step 11 left open is observed on both sides |
| 3 | the first footer named a commit without the link destinations, before the fork's commit-first route | settled by the second block's item 3 |
| 4 | WO-243's selection named the run the fork's one case had needed | recorded |
| 5 | two standards passes measured with a shape audit run from the launchpad | recorded; no kit change asked |
| 6 | first use of a retained lane's row as a rule's provenance | recorded |

Block after starter v0.122.0 (eight items):

| Item | Reading | Disposition |
| --- | --- | --- |
| 1 | the update taken; the two hosts inferred on from the fork's own record, so the emit restored the Codex surfaces the merge removed | recorded; WO-258's elections working as designed |
| 2 | a Git merge of the starter met three conflicts in the fork's own seeds and merged two files silently, a closed order's text among them | filed: WO-261 steps 1 and 2 |
| 3 | every relative link of the first records filed under the commit-first route resolves at the named commit through GitHub | recorded; this is the confirmation [WO-259-D015](../../evidence/WO-259/decisions.md#wo-259-d015) waited for |
| 4 | the screen's first run in the fork: no shared run, five advisories on older records | recorded |
| 5 | an explicit tag fetch against a remote set to bring none, three times in four days | filed: WO-261 step 5 |
| 6 | a closed target order's status still names the operator's merge after its close | declined (§NoOps 2), with what the fork's next block can send |
| 7 | one order's implementation at more than twice the fork's median, nineteen findings in round one | recorded; evidence for WO-262 |
| 8 | the screen compared a planning document with files the fork's own sessions had written under intake | filed: WO-261 steps 3 and 4 |

Read for item 2: `publishUpdate`'s `ready` in `scripts/launchpad.mjs`
proves the provenance files, `harness check` and the lineage index, and
reads no instance file; the kit guide §Opting in to instance actions says
an update leaves instance files byte-identical, which is true of
`export --update` and not of the merge §Taking upstream updates gives an
instance. Read for item 8: `capturePaths` in
`scripts/lib/verbatim-screen.mjs` walks every non-binary file under the
intake root; this repository's intake holds 439 files under `notes/`, 43
under `remining/` and 16 under two release-close directories beside its
captures. Read for item 5: neither `harness-host.ts` nor
`harness-command.ts` classifies a `git fetch`. Read for item 6: the route
already has a `released` stop (`routeOrder` and `routeFacts` in
`scripts/lib/drive-route.mjs`), set when the launchpad's release list names
the order or the local close record shows a clean cleanup with the target
removed; which of those two readings missed for the fork's order cannot be
told from here.

### The executor's adoption of review findings (WO-259-D022, critical)

The operator directed during WO-259 that this be reviewed at the next
planning session, and its register row was left open for that. Read:
[WO-259-D021](../../evidence/WO-259/decisions.md#wo-259-d021) and
[D022](../../evidence/WO-259/decisions.md#wo-259-d022); product 07
§Verification review and attack; the installed executor root.

- The rule gap is real and specific. The verifier has an admission rule (a
  blocking finding names a criterion and a supported input), and the
  ladder's later rounds have one. Round one had none: product 07 said the
  executor fixes or records every distinct finding, and the installed
  executor root reads `Fix or record every finding`, with nothing on how
  to choose. D022's account is that the executor fixed what a reviewer
  marked blocking.
- The cost is in the record: four rounds, twenty findings, thirteen of
  them defects of hand-written readers on inputs outside what the kit's
  writers produce; 7 h 1 min of implementation against a 1 h 39 min median
  over the control record. The fork reports the same shape in its own
  cycle.
- Decision. The three questions D022 proposed are adopted as the rule,
  written before the fix: which writer produces the input, which way the
  failure falls, what the fix costs. This pass wrote the rule into product
  07 so it binds from now, and each order this pass filed names it in its
  handoff step.
  [WO-262](../../work-orders/WO-262-review-findings-are-judged-before-they-are-fixed.md)
  carries it into every review brief and the executor's role text and
  gives the judgment a typed form the document check reads. The code
  WO-259 wrote for such inputs stays (§NoOps 1).

### Gate time

The cold-gate row (FUP-e96221b106cd136a) was deferred on 2026-10-31 for
want of a named cause, and the 2026-11-07 pass left the timing readings
until one crossed its figure on three consecutive passes. Read this time:

- `npm run plan -- conditions --slow` (305 s): four numeric conditions
  hold. The plain gate's thirty-day reading is 1,134 s against 360, but it
  is one sample of 2026-10-24 and no median of anything recent; the
  `harness-fixtures` and `target-worktree` tasks read above one and a half
  times their medians; the plan check's median is 12.9 s against 8. The
  command's own document-gate probe timed out and left one stopped row in
  the local index.
- The local gate index holds seven fresh passing complete review rows from
  2026-11-06 to 2026-11-08: 45.3, 45.8, 44.2, 51.7, 53.9, 40.2 and 50.0
  minutes, a median of 45.8 minutes (2,747 s). A sweep of each row's task
  timeline finds 24.1 to 42.3 of those minutes with at most three tasks
  running, on eight lanes.
- One research worker read the runner's scheduler (`dotln-worker`, use 1
  of 20), and its account was checked here against the code. Each of the
  four exclusive rows sits wherever its own lead puts it, and admission
  stops whenever the next row is an exclusive one that cannot yet join
  what is running; so the run of 2026-11-08T02:37Z drained twice, for 7.2
  and 6.9 minutes, and started its last heavy files at minute 36.6 of 50.
- [WO-222-D015](../../evidence/WO-222/decisions.md)'s reopening condition
  (a complete-run median above 2,538,373 ms) is met by that series.
  [WO-221-D018](../../evidence/WO-221/decisions.md)'s (the lead ordering
  costing more than the convoy it displaces) is not: 14.1 minutes of drains
  against a 19.6-minute convoy, so the leads stay.

Filed as WO-263, fifth.

### Other readings

- `npm run plan -- failures`, window since receipt 065: two orders made
  ready, no failed verification or final review, no escape at either final
  review; 47 prompt rows journaled (31 in WO-259, 15 in WO-258, one
  unassigned), 37 of them unclassified, the host's task notifications
  counted apart; one completed phase attempt in each order above twice its
  phase median.
- WO-244 is active: activated 2026-11-08T22:07:44Z and in implementation in
  its own worktree. It changes `packages/skeleton/src/harness-host.ts`,
  `packages/skeleton/src/loadouts/contributor.ts`,
  `scripts/lib/review-worker.mjs`, `scripts/test-runner.mjs`,
  `scripts/test-harness.mjs`, the kit guide and product 07, among others.
  This pass wrote nothing there.
- GitHub issues on this repository: none open.
- Red tags: none (the block below).

## Orders filed and amended

- [WO-260](../../work-orders/WO-260-the-kit-runs-on-git-2-31.md), the kit
  runs on Git 2.31.0. It replaces the six forms at their call sites with
  forms that release has, with no version switch, so the code a gate runs
  here is the code the laptop runs; lowers the declared floor to 2.31.0;
  adds a core-only recorded Git surface, so the next newer form is one
  reviewed line; and proves the call sites under a shim that refuses the
  six forms the way the older Git does. A real Git 2.31.0 on the executing
  host is a named host condition with its fallback. One of its files is
  feedback-judged, so it names the conditional live episode.
- [WO-261](../../work-orders/WO-261-an-instances-update-keeps-its-own-files.md),
  an instance's update keeps its own files: the update publish refuses a
  merge that rewrote a file both sides had changed, by the incoming
  launchpad, so the first update that brings it is protected; the preview
  lists those files; the words screen leaves out a session sub-root; a tag
  fetch against a remote set to bring none is refused before it runs; and
  a kit launch is counted in every npm spelling (WO-258-D035).
- [WO-262](../../work-orders/WO-262-review-findings-are-judged-before-they-are-fixed.md),
  review findings are judged before they are fixed (above).
- [WO-263](../../work-orders/WO-263-the-complete-run-takes-its-exclusive-suites-in-one-convoy.md),
  the complete run takes its exclusive suites in one convoy: the exclusive
  rows share the strongest lead among them, so heavy work drains for them
  once; a suite that failed last still leads; the target-worktree group
  starts its longest file first; WO-222's overlap lever is reassessed from
  the comparison rows; and its evidence is the same-source pair of complete
  runs product 07 requires of a scheduling change.

No order was amended. Each order's criteria were read against the five
defect classes, and the `criteria advisory` lines of the index check were
read (§Validation).

## Register

`plan start` returned 276 pending rows: one open, one needing review, three
untriaged and 271 deferred. Nineteen dispositions were recorded in one batch
(register revision `c7d9d7de4c34ac176c634c1411d46dc1254d49058e620a19ce62d324e1b04385`):

| Row | Was | Now | Why |
| --- | --- | --- | --- |
| FUP-6fe1262fb31292b3 (WO-259-D022, critical) | open | allocated to WO-262 | reviewed here as the operator directed; the rule is in product 07 from this pass |
| FUP-67944ed9c85b7199 (WO-259-D021) | untriaged | allocated to WO-262 | the reviewer's admission rule, step 1 |
| FUP-973464a1fa408976 (WO-258-D035) | untriaged | allocated to WO-261 | the launch recognizer, step 6 |
| FUP-e96221b106cd136a (the cold-gate candidate) | deferred | allocated to WO-263 | its cause is named and WO-222-D015's condition is met |
| FUP-7b7e2e59a8ef2e06 (WO-225-D019) | untriaged | deferred | its condition is not shown by the records read; WO-263 names it for its two comparison runs |
| FUP-0126 (the workstream application candidate) | needs review | deferred | source revision 28 read: WO-242 made the plan-first paragraph a delivered statement; the demonstrations are unchanged |
| the thirteen rows this pass's candidates section created | untriaged | ten declined, two duplicates of standing rows, one allocated to WO-260 | §NoOps 1 to 11, 13 and 14 |

Read and left as they stand: the six cold-start rows a final review
re-deferred on 2026-11-08 (§NoOps 10); FUP-eed385be08e5bdd9, listed as a
carry-in of WO-262 because that order re-mints the role oracle;
FUP-7de23c426e329c34 (§NoOps 11); FUP-23aca17371cf7b86, re-deferred by
WO-258's final review, whose seam no order here opens; and
FUP-243b6754001c4051, whose condition has not occurred. The fired-trigger
reading over the deferred rows naming WO-258 or WO-259 (thirteen matches)
found none left for this pass beyond these.

## Red tags

<!-- dotln-red-tags:start -->

```json
{
  "after": "docs/planning/passes/first-cycle-returns-and-host-elections-2026-11-07.md",
  "tags": []
}
```

<!-- dotln-red-tags:end -->

## NoOps

Each item was weighed and is not filed. The reason is its evidence and
`usefulWhen` is its reopening condition; the map's candidates section for
this pass carries them, apart from item 12, which is a dispatch question
and no candidate.

1. **Removing the readers WO-259 wrote for inputs no writer produces**
   (D022 asked this pass to decide). Declined. The HTML link reading in
   `recordLinkTargets` closes an open failure (a broken link admitted in a
   filed record) and now shares the document check's decoder. The two
   closed cases in `requestedQuotes` (two equal quotations in one record,
   an escape `JSON.stringify` never writes) are a few lines inside a
   53-line function, reviewed and passing; removing them costs a change and
   its review and buys nothing a real writer meets. Useful when an order
   that edits `requestedQuotes` finds those cases in its way, or one of
   their tests fails for a reason other than a real writer's case: delete
   the cases then, rather than repair them.
2. **A route change for a released target order** (the fork's second
   block, item 6; nothing asked). Declined: the route already stops at
   `released`, on the launchpad's release list or the local close record,
   and which reading missed for the fork's order is not readable here.
   Useful when the fork's next block says what its close record's cleanup
   outcome was and whether its release list names that order, or a session
   acts on the stale next step.
3. **One sentence in the kit guide as the whole answer to the seed
   merges** (the fork's first alternative in its item 2). Declined as the
   whole answer: the fork caught two silent merges by reading a diff, and a
   closed order's text changing without notice is what a check is for.
   WO-261 writes the sentence and the refusal. Useful never on its own.
4. **A starter refresh that leaves a seed alone unless the starter still
   holds the export's own bytes** (the fork's second alternative). Declined: the
   starter's history still changes the path, and the instance's merge is
   where the two changes meet. Useful if a starter's own untouched seed is
   found rewritten against its owner's wish.
5. **An advisory for the tag fetch** (as the fork's item 5 asked).
   Declined in favor of a refusal with the right command: the hook's
   advisory reaches the session with the command's result, after the tags
   are in the instance. Useful if a session needs that fetch often enough
   that the operator's terminal is a burden.
6. **A marker line in session-written intake files, an ignored list of
   them, or screening only named capture sub-roots** (the alternatives in
   the fork's item 8). Declined for one sub-root the screen leaves out: a
   JSON batch and a log cannot carry a marker, a list drifts from the
   files, and screening only named sub-roots stops screening a capture
   written in the wrong place. Useful if an instance cannot move its
   existing files.
7. **Removing the Git floor judgment.** Declined: a Git below 2.31.0 fails
   inside two forms with messages that name neither the floor nor the
   version, and an instance on an older Git has one declared line to
   lower. Useful if the judgment refuses a host the operator names again,
   which the new screen is there to stop.
8. **Shipping the option list of Git 2.31.0's manual so the surface check
   decides by itself.** Declined: that list is derived from the Git
   project's GPL-licensed documentation, and carrying data derived from it
   is the operator's decision. WO-260 records the kit's own surface
   instead. Useful on the operator's word.
9. **A complete run under a real Git 2.31.0 at every final review.**
   Declined: it would double the costliest step of every order to guard
   against a change the surface check names in under a second; the
   laptop's own gates are the standing real-binary evidence. Useful if a
   form reaches a release past the surface check.
10. **Optimizing the roles' cold starts** (six deferred rows whose
    condition a final review recorded as occurred on 2026-11-08). Left
    deferred: WO-259's own process health reads 357,479,841 tokens for one
    order, against which a role root of about 42 KB at each dispatch is
    not where the cost is; WO-261 and WO-262 each replace or add one
    sentence under the standing route. Useful when a planning allocation
    can show equivalent usefulness at fewer bytes.
11. **Rewriting a starter's older documentation index**
    (FUP-7de23c426e329c34). Left deferred: no order here edits the starter
    refresh's seed rules, and no instance has reported the red tags.
12. **Interrupting WO-244 for WO-260.** Not a planning decision: the
    sequence puts WO-260 first and says the two may run side by side; the
    operator's dispatch decides.
13. **Putting the exclusive convoy above every lead, admitting heavy rows
    during a drain, widening the target-worktree group, or giving
    `sync-fixtures` peers** (the scheduler research's other cuts).
    Declined in WO-263's Design: the first delays a failed suite about
    twenty minutes, and the others loosen reservations set after measured
    deadline failures (WO-242-D021, WO-258-D029, WO-222). Useful when
    WO-263's comparison leaves the run above WO-222's before median.
14. **Building Git 2.31.0 in this session.** Not done: the host's
    auto-mode classifier denied the run before any download, and the pass
    did not work around it. WO-260's step 11 and criterion 5 carry the host
    condition and its fallback. Useful when the operator admits the build
    on this host.

## Sequence

WO-258 (v0.121.0) and WO-259 (v0.122.0) are closed and leave the list.
WO-260 is first, ahead of the active WO-244; WO-261 and WO-262 follow
WO-244, in that order, because both edit files it is changing; WO-263
follows them, fifth, since it shortens later final reviews and stops nothing
today; the rest of the list keeps its order. `Rules in force` gains the hosts rule.

## Write-backs

- Product 07 §Operator-opened planning pass: the host-refusal screen among
  the screens before filing, and the sentence in input 5 that a pass reads
  the evidence under an instance's ask before the remedy it names.
- Product 07 §Verification review and attack: the judgment rule in place
  of the sentence that the executor fixes or records every finding.
- [The sequence](../sequence.md): the hosts rule and the order list.
- [The map](../work-order-map.md): the pass's paragraph, the catalog rows
  and the candidates section.
- Product 06: the adoption sentence.
- The idea ledger: this pass's registration heading.
- The kit guide is unchanged: its §First steps states the floor v0.122.0's
  code enforces, and WO-260 replaces that sentence with the code.

## Rules recorded

<!-- dotln-rules-recorded:start -->

```json
[
  {
    "rule": "The kit runs on Git 2.31.0, the Git on the operator's work laptop.",
    "document": "docs/planning/sequence.md",
    "section": "Rules in force",
    "message": {
      "sessionKey": "c81fce7fdc48d7d235ab69d7cc03704e21f7b7e836c4d2e58268d29509e8d4fa",
      "recordedAt": "2026-11-08T23:31:17.405Z"
    },
    "captureDigest": "sha256:a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111",
    "class": "direction"
  }
]
```

<!-- dotln-rules-recorded:end -->

The second sentence of that rule in the sequence (an order that declares a
host floor names every host the record shows) is this pass's screen, cited
to product 07, and not the operator's words.

## Answers to the fork (paste-ready)

```text
Answers from core's planning pass of 2026-11-08 (docs/planning/passes/git-2-31-support-and-fork-returns-2026-11-08.md) to the fork's two blocks of 2026-11-08 (after starter v0.120.1 and v0.122.0). This is a core session's text and no operator direction. Core filed WO-260 (the kit runs on Git 2.31.0), WO-261 (an instance's update keeps its own files), WO-262 (review findings are judged before they are fixed) and WO-263 (the complete run takes its exclusive suites in one convoy), around the active WO-244. None blocks the fork's next order.

Block after v0.120.1.
1, 4, 5, 6. Recorded; nothing asked.
2. Recorded and matched: core's own dispatch of 2026-11-08 stood behind the /model output and inside the paste wrapper and resolved its role on the first prompt (prefixLine 3). The case is closed on both sides.
3. Settled by item 3 of your second block.

Block after v0.122.0.
1. Recorded. The inferred hosts restoring the Codex surfaces is WO-258's election working as designed.
2. Filed in WO-261 steps 1 and 2. update --publish, run by the incoming launchpad, refuses a merge commit that changed a file outside the incoming manifest which both you and the starter had changed since the merge base; it names each path, the command that restores it and --take <path> for one you want from the starter. The preview lists those files before you merge, and the kit guide says to keep your bytes and to restore a closed order's text. A file only the starter changed still follows the starter. A convenience with a working route today: resolve to your own bytes and read the merge's diff for your own files, as you did.
3. Recorded: this is the confirmation WO-259-D015 waited for. Nothing more is needed.
4. Recorded.
5. Filed in WO-261 step 5, as a refusal and not an advisory, because the hook's advisory would reach the session with the command's result, after the tags are in. git fetch <remote> --tags (or -t) against a remote whose tagOpt is --no-tags is denied with the plain fetch and the ref-specific fetch in the reason; the operator's terminal and operator override: still run it. Until then: your profile's section, as now.
6. Not filed. The route already has a released stop, set when the launchpad's release list names the order or when the local close record shows a clean cleanup with the target removed. Core cannot tell from here which reading missed for WO-039. If you want it looked at, send the cleanup outcome and the target cleanup outcome from WO-039's close record, and whether npm run release -- list names WO-039.
7. Recorded and used as evidence for WO-262. Core's product 07 section on verification review now says an executor judges each finding before fixing it (which writer produces the input, whether the failure is open or closed, what the fix costs) and records a closed failure on an input no writer produces without code. You receive that text at the next release, and nothing stops your executors applying it now.
8. Filed in WO-261 steps 3 and 4. The screen leaves out docs/intake/session/ and prints how many files it left out, and every role's text says a capture holds the operator's message alone and that a session's own drafts, prompts, results and logs go under docs/control/local/ or docs/intake/session/. Until then: your route (drafts under docs/control/local/planning/, nothing above the message in a capture).

Two more for your information. WO-260 lowers the declared Git floor from 2.40.0 to 2.31.0 and replaces six Git forms; nothing for you to do. And the two silent merges you found may exist in any instance that merged v0.121.0 or v0.122.0 before WO-261; your check was the right one.
```

## For the work laptop's instance (paste-ready)

```text
From core's planning pass of 2026-11-08 (docs/planning/passes/git-2-31-support-and-fork-returns-2026-11-08.md), for the instance on the work laptop. This is a core session's text: context, never operator direction. The operator's own words in your session decide what you do with it.

What happened. Core's v0.121.0 (WO-258) declared a Git floor of 2.40.0 on this instance's ask of 2026-11-07 although this host's Git is 2.31.0, so harness check, harness evidence and every npm test selection refuse here. That was core's error: the host under the ask was the requirement. Core filed WO-260, first in its sequence, to make the kit run on Git 2.31.0 and to lower the floor to it.

A route until WO-260's release, if the operator directs it. In package.json, under engines, change "git": ">=2.40.0" to "git": ">=2.31.0". The judgment reads that line from this checkout, so the three refusals stop. Those are the bytes WO-260 ships, so the next update merges without a conflict on that line, and nothing else in an instance pins the value.

What that does not fix. Six Git forms in the kit are newer than 2.31. With Git 2.31 first on PATH these still fail until WO-260's release and need a newer Git first on PATH for the command, as in your block of 2026-11-07:
- worktree publish reads the order's pull request body with ls-tree --format (Git 2.36) and reports the body as not tracked;
- release close's classification at a committed revision uses check-attr --source (2.40);
- a target order's record and planning reads use ls-tree --format;
- the stash prune reads rev-parse --show-ref-format (2.44) and stops as an unsupported backend;
- the hook's grant for the main checkout's intake uses worktree list -z (2.36), so a write from an order worktree to main's intake is not granted;
- the publication fixtures and the authority probe isolate Git with GIT_CONFIG_GLOBAL (2.32), which 2.31 ignores;
- the source-change admission uses fsck --no-references (2.50) and refuses every candidate (the resident's writing path only).

What core needs from this host in your next block, because no core session can run Git 2.31.0 (building it was denied on core's host): for each line above, whether you met it and the exact message; which Git ran each step of your first cycle; the output of git --version; and anything else that failed with Git 2.31 first on PATH. After WO-260's release: the result of the four gates with Git 2.31 first on PATH and no newer Git involved.

Two more. An update merge can rewrite files this instance changed: the fork found the refreshed template text merged into its closed first order and a template ceiling merged into its budgets when it took v0.121.0, so compare docs/work-orders/ and docs/control/budgets.json with the commit before that update's merge. And until WO-261's release, keep a session's own drafts out of docs/intake, because the words screen reads every file there.
```

## Process cost

Model and effort: Fable 5.1 at max, operator-selected (the session's
`/model` line; `CLAUDE_EFFORT` max). Usage at entry (23:31:29Z): 103,111
total tokens (46,946 cached input, 55,013 cache write, 1,146 output, 6
input; source `claude-transcript-message-usage`, scope dispatch, cost
unknown). At 00:56:06Z, with the receipt filed: 63,842,218 total
(62,881,787 cached input, 631,528 cache write, 328,563 output, 340 input;
same source and scope, cost unknown), 1 h 24 min after the dispatch.

Workers: 2 uses of 20, both `dotln-worker`. The scheduler research took
0 h 8 min (152,030 tokens, 49 tool uses) and the refuter 0 h 9 min (147,132
tokens, 19 tool uses); neither was re-tasked.

What the time bought and what it did not. The Git reading is static because
the real-binary build was denied; it was the pass's longest reading and
found four forms WO-258 had not, but it is weaker evidence than one run on
Git 2.31.0, which WO-260's step 11 and the laptop still owe.
`npm run plan -- conditions --slow` took 0 h 5 min and its document-gate
probe timed out. The document gate ran once for each defect it found (a
stale publication lock, a stale lineage index, four shared runs the words
screen found against the fork's text inside the dispatch capture, each
reworded, and the uncommitted subject) and once at the end. The research
worker turned another deferral of the gate-time row into an order with a
named cause; the alternative was a later pass reading the same rows again.

## Validation

- Refutation: [receipt 066](../refutations/2026-11-09-planning-e5d09eea5c7031a4-066.md),
  one fresh `dotln-worker` judgment (the generated definition's pin,
  `claude-opus-5-5` at `xhigh`; effective settings unverified) of the
  committed subject `a1852997d`, pass scope, launched once and never
  re-tasked: `aligned-with-findings` for the plan and for each of the four
  orders, no hold, nineteen known issues (six, six, four and three), each
  with a reopening observation. Nine unchanged orders carried their
  verdicts by hash. The known issues are on the four catalog rows of the
  map with the planner's reading of each for the executor; three change
  what an executor should do (WO-260's identity equality against the old
  form, WO-261's failed-read behavior and `-C` spellings, WO-262's leak
  wording), and the refuter's clean-room note is answered there and left
  to the operator.
- `npm run plan -- check`: the judged, committed and workspace subjects
  agree; the `Rules recorded` entry matched its journal row and digest.
- `npm run work-orders -- index --check`: both generated pages current;
  one `criteria advisory`, on the active WO-244's criterion 3, which this
  pass did not file or amend; none on WO-260 to WO-263.
- `npm run test:docs`: every task passed on the bytes of the closing
  commit. The words screen read the changed files against this
  repository's captures with no shared run after four lines were reworded.
- Published by `node scripts/refute-plan.mjs publish` after this commit;
  the pull request's number is in the session's response.
