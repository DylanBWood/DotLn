# first cycle returns and host elections — 2026-11-07

## Dispatch and capture

Dispatch: `planning: standard planning pass +` with five items (two
observation blocks from the DotLn-Enterprise-Starter fork's passes of
2026-11-06 on starter v0.118.0 and v0.119.0, five items each; a standing
rule that an operator message is never saved verbatim in a committed
artifact unless a clone or fork turns the rule off or the operator asks for
one message to be saved; a direction that Codex and Copilot support is
opt-in for a new clone or fork and inferred on for an existing repository
from its own event log; a block of nine requests from the operator's
private instance's planning pass of 2026-11-07 on starter v0.119.0, its
first cycle; and the operator's plan to run many clean instances on the
work machine, asking for a command set for the next pass and for one or two
large fix orders now, with smaller ones from the instance's feedback after),
received at 2026-11-07T18:33:35.378Z (prompt-hook time) in Claude Code
2.1.319, Fable 5.1 at `max`, operator-selected (the `/model` line of the
session). Captured verbatim in ignored intake
`docs/intake/planning-dispatch-2026-11-07-first-cycle-returns-and-host-elections.md`,
whose SHA-256 is the journal's own digest of the message,
`123eb18018301f41fb4b107f0fb0ad53eb40eb38b13c75a906f588dc913c6cd6`
(16,667 bytes). The dispatch was sent inside the host's pasted-content
wrapper and the hook read it on its second line (`prefixLine` 1, class
`direction`, role `planner`): WO-257's reader skipping the wrapper, observed
live for the first time in this repository (the fork's item 2.5 asked which
session would see it). Two bare `planning:` lines (18:33:25Z and 18:33:41Z,
digest `8e94d5b5…`) bracketed it, and one mid-turn message at 18:34:45Z
(83 bytes, digest `2b255438e241a32ed296a5e8ec0be2031c21f7b65bb6cbae56b7bae9c199989f`,
captured in `docs/intake/planning-dispatch-2026-11-07-first-cycle-returns-midturn.md`)
said that the private instance is not reachable from this session and that
its block should carry enough context; the pass reads that block as carried
evidence against this repository's files and records the assumption in both
orders. Branch: `planning/2026-11-07-first-cycle-returns-and-host-elections`
from clean `main` at `26971a9f` (v0.120.1). The dispatch line carried no
host label and no worker option, so this ran as one standard pass with the
default refuter.

The operator's items, each read for its aim, with what this pass did and
what in it is the planner's inference rather than the operator's or an
instance's words:

| Item | Aim read | Disposition | Planner's inference |
| --- | --- | --- | --- |
| 1 | the fork's two blocks (v0.118.0 and v0.119.0) | 1.1, 1.2, 1.4, 1.5, 2.1, 2.5 recorded, nothing asked; 1.3 and 2.4 (record links) → WO-259 step 9; 2.2 (the continuation gate) → WO-258 step 15; 2.3 (the siblings line) → WO-258 step 16; §Answers to the fork | reading 2.3's conditional ask as a yes, since the derived line is written for every instance |
| 2 | no operator message saved verbatim in a committed artifact, with the two exceptions | the rule recorded in product 07 §Documentation freshness and ownership and the kit guide §Document quality (§Rules recorded); its enforcement → WO-259 steps 1 to 4 | the wording; the typed exception's shape (`operatorQuote` with the request's capture digest); the election as a feature row |
| 3 | Codex and Copilot opt-in for a new clone or fork; inferred on for an existing repository from its event log | WO-258 steps 1 to 3 | the inference reads the committed control log and the discovery record, not the ignored journals; the Copilot row in this repository is inferred from the discovery record alone, since the control log never names it |
| 4 | the private instance's nine requests | 1, 2, 7, 8 → WO-258; 3, 4, 5, 6, 9 → WO-259; §Answers to the private instance | each item taken as reported, since the instance is not readable here; the Git floor's number read from the instance's reading of Git's notes |
| 5 | the command set for the next cycle; one or two large fix orders now | the command set in §Readings; two orders filed, placed first and second | the split of the items into an instance-setup order and a committed-words order; placing both before WO-244 |

## Readings

### Entry

`main` at `26971a9f` was clean and equal to `origin/main`. Since the
2026-11-06 pass three orders closed: WO-257 (v0.119.0, the instance returns
of 2026-11-03 to 2026-11-05), WO-242 (v0.120.0, plan-first mode) and
WO-243 (v0.120.1, closeout checks follow the repositories an order
changed). `plan failures` in the window since the last receipt
(2026-11-06T03:01Z): two failed verifications, both first verifications
(WO-257 VER-001 on the batch merger, WO-243 VER-001), each repaired and
closed; no failed final review; ten corrections; three off-ramps (two
dispatch-bound acceptances and WO-242's criterion 4 recorded defective by
contradiction, the first defect record of the five classes); three final
reviews with three escapes (WO-242 two, WO-257 one, WO-243 none; 1.3 per
final review over the last ten orders); 48 failed local gate rows (WO-257
40, WO-242 6); one shell diagnostic, this session's own `====` word read
by zsh as a program; four release closes with a median of 36.8 s, the
slowest step WO-257's worktree removal at 23.3 s; the first verification
failed in five of the last eight closed orders. Each failed report's cause
is routed: the two first-verification failures closed with their repairs,
and the defect record is the five-class screen this pass applied to its two
orders (§Orders filed and amended). `plan conditions`: five hold (the
plan-check median at 10.53 s against 8 s, seven local release tags absent
from the generated table, the plain gate's thirty-day median at 1,134 s,
the target-worktree and harness-fixtures tasks above their medians) and
six unknown (listing and probe budgets); the plan-check reading fired
FUP-fb8cbeabbddef397's condition and is disposed in §Register; the others
stay with the earlier passes' deferrals. The start block's first page of
the register (FUP-0126 needs-review and seven deferred rows) was read and
left: no condition fired. No GitHub issue is open on this repository
(`gh issue list`). The red-tag block `plan start` wrote is empty: the
2026-11-06 pass's dispositions hold and nothing new is unbound.

### The fork's two blocks against the record

The block on v0.118.0 (five items): the take of v0.118.0 and the first
observation of WO-246's allow rules with no host prompt (1.1, recorded);
the host's command block preceding the dispatch again, resolved by a bare
`planning:` as core had said (1.2, recorded; WO-257 step 11 is the fix the
fork now has in v0.119.0); the record links (1.3, an ask: a filed target
record's relative links resolve only at the order's `FinalReviewCompleted`
checkpoint, a local ref GitHub answers with 404 and 422, while
`target-records` moves the records off the launchpad's main, so a reader of
the two public repositories cannot follow them); the fork's own measured
brief and WS-001's first standards pass reading the three tool scripts
WO-027 landed (1.4, recorded); the record flags being what WO-027-D007 and
WO-028-D038 asked (1.5, recorded).

The block on v0.119.0 (five items): the take of v0.119.0 with
`update --publish` admitted under `--operator-request` on the first try
(2.1, recorded); a compatibility gap the release's own rule names (2.2, an
ask): `npm run test:docs` fails between the update's merge and the next
receipt because `checkPlanContinuation` removes only the judged receipt's
order paths from the fixed inputs, so the separate-track members
v0.119.0 adds to the subject survive the comparison; the derived Read
before upgrading line naming `node scripts/siblings.mjs index`, which
refuses without a sibling declaration (2.3, conditional); the footer
naming the launchpad's HEAD at filing, which lacks the record and evidence
paths the checkpoint holds (2.4, an ask, with the two routes the fork
weighed); the dispatch sent as a message of its own, so the fork could not
yet observe the wrapper skip (2.5, recorded; this pass observed it, above).

Read against this repository at `26971a9f`: `checkPlanContinuation`
(`scripts/lib/plan-continuation.mjs` line 519) builds `orderPaths` from the
judged receipt's orders and compares every other input, while
`plan-receipts.mjs` (lines 260 to 266) rebuilds a receipt filed without the
`separateTrack` key under its filed rule; `scripts/fixtures/instance-with-history/`
carries no separate-track workstream, so the `instance-history` suite did
not catch it. `scripts/siblings.mjs` reads the declaration before anything
and refuses without it. `scripts/lib/target-records.mjs` (lines 196 to
230) names the launchpad's HEAD when the operation began and says in its
own comment that the footer claims the layout, not that the bytes are
committed there; the lifecycle's next-step texts (`scripts/resume.mjs`
lines 1433 and 2253) run `target-records` after the final-review pass and
commit the instance records after it, so the records exist in the launchpad
only at the checkpoint (`refs/dotln/checkpoint/WO-NNN/<n>`,
`scripts/lib/checkpoint.mjs`), which nothing pushes. The decision for the
fork's two asks is WO-259 step 9: `target-records` refuses a source not
committed at HEAD, so the footer's commit holds every record and the
evidence they link, and the launchpad records publish pushes that history;
the checkpoint-as-ref and layout-only alternatives are §NoOps 2 and 3.

### The private instance's nine requests against the record

Each item named a file and a line of behavior; each was read here:

1. The release-close phrase after the merge: `recordDispatch`
   (`packages/skeleton/src/harness-host.ts` line 1287) records a dispatch
   only when the checkout's canonical status lists the action and otherwise
   returns `not a legal dispatch in phase …`; nothing re-records it once
   the close's fast-forward brings the order's records. → WO-258 step 7:
   the phrase is journaled as a pending dispatch with the role resolved and
   the close records it after its fast-forward; the operator texts say to
   update main first.
2. The Git floor: no script reads `git --version`; `gate-evidence.mjs`
   (line 962) runs `git check-attr --source=<revision>` and throws
   `Generated source classification unavailable` on any nonzero exit with
   no cause; the publication fixtures redirect their remote through
   `GIT_CONFIG_GLOBAL` (`scripts/lib/authority-probe.mjs` and seven test
   files). → WO-258 steps 8 and 9: a floor declared once and judged where
   Node is; the failure named by git's exit code and stderr; the blocker
   classed by that cause.
3. No gate screens committed documents with the local-terms list:
   `checkLocalTerms` is called by the export, the entropy receipt and the
   outward lint; `scripts/test-runner.mjs` has no `terms` task and
   `launchpad-publish.mjs` lints the title and body only. → WO-259 step 6.
4. Discovery: `harnessEvidence` (`scripts/resume.mjs` line 639) returns
   `undefined` from its catch; `discoverHarness` (`scripts/discover.mjs`
   line 137) pushes unchecked and on every run. → WO-259 step 8.
5. Nothing tells a session not to quote the operator: `contributor.ts`
   says to paraphrase only in plan-first's conversation document (lines
   759 and 761); `docs-check.mjs` fails an `operatorQuote` without a
   digest and reports other attributed speech as an advisory. → WO-259
   steps 1 to 4, and the operator's own rule (item 2), recorded today.
6. Workers not given the no-print rules: the generated `dotln-worker`
   definitions (`packages/compiler/src/harness.ts` line 477) say to read
   only the assigned inputs and name no directory. → WO-259 steps 1 and 2.
7. What the starter gives a new instance: (a) the first-order template's
   criterion 3, checklist item 4 and timebox, confirmed in
   `scripts/kit/first-order.template.md`; (b) the export writes
   `dotln.config.json` and the lineage index (`scripts/launchpad.mjs`
   lines 1094 and 1175) and the sibling starter at v0.120.1 carries
   neither, because `starter-refresh.mjs` rewrites only the eight template
   seeds of `starter-seeds.mjs` and adds no absent one; (c) the starter
   carries `docs/control/doc-ceilings.json` with no documents, which no
   module reads except `closeout-scope.mjs`'s input list and a fixture;
   (d) `README.client.md` links only the kit guide and the seeded
   `docs/README.md` names roots in code spans; (e) the router root measures
   17,124 bytes here (`CLAUDE.md` 7,380 and the skill 9,744) against 16,384
   with no acceptance, and `npm run meta` lists it among ten breaches. →
   WO-258 steps 10 to 13.
8. The empty sequence: `buildPlanSubject` (`scripts/lib/plan-subject.mjs`
   line 400) refuses fewer than one order. → WO-258 step 14.
9. A subagent's hand-back journaled as an operator message: `promptRoute`
   attributes by the transcript's last row or by the
   `<task-notification>` envelope, else `unattributed`; in this session
   every row read `route: unknown, routeSource: host-route-unavailable,
   attribution: unattributed`, the dispatch included, so a hand-back would
   be journaled exactly as the instance says; `checkRulesRecorded` refuses
   only a `host-task-notification` source or a question-class row. → WO-259
   step 5; the shape of this pass's own refuter hand-back is recorded below
   once it arrives.

### The operator's two rules against the record

The no-verbatim rule (item 2) had no home: the kit's role text never says
to paraphrase outside plan-first, and the check admits a verbatim copy
without attribution. This pass writes the rule into the two standing
documents that govern committed words, product 07 §Documentation freshness
and ownership for this repository and the kit guide §Document quality for
every instance, with the date and the capture digest (§Rules recorded), and
files its enforcement in WO-259: the rule in every role's and worker's
text, a screen that compares the files a branch changed with the ignored
captures (the one place the operator's bytes exist outside the journal's
digests), a failure for a current record's attributed speech without a
capture citation, `features.verbatim-operator-words` for a clone that turns
the rule off, and `operatorQuote.requestedIn` for the one message the
operator asks to save. This pass's own document obeys the rule: the
operator's and the instances' words are paraphrased throughout and the
captures are cited by digest.

Host support (item 3): `harnessInstallation` (`scripts/lib/harness.mjs`
line 122) emits every contributor profile, so every export carries the
Codex and Copilot surfaces; `featureRegistry` has no host row. This
repository's own record shows the hosts: 23 attestations under
`harness: claude-code` and 12 under `codex-cli` in `docs/control/resume.jsonl`,
and observed versions for all three under
`docs/discovery/environment.json`; the control log never names
`copilot-cli`, so the inference WO-258 files reads both the log and the
discovery record, and the operator's words that core has used both hosts
hold on that reading. The instance's log shows Codex, as the operator says,
so the same inference turns Codex on there with no configuration change.

### The operator's next cycle: the commands

For the plan in item 5 (clean instances on the work machine, each through
clone, first pass, WO-001 and research orders of a sibling repository,
taking core's releases as they land), read from the kit guide at v0.120.1
(§First steps, §Planning in this instance, §Releases in this instance,
§Taking upstream updates) and product 07 §Research and guided-operator
work orders. The lines marked *until WO-258* or *until WO-259* are the
working routes the orders remove.

1. **A private instance from the starter** (once per instance; the kit
   guide's clone recipe):

   ```sh
   gh repo create <org>/<name> --private
   git clone --no-tags https://github.com/DylanBWood/DotLn-Enterprise-Starter <name>
   cd <name>
   git remote rename origin upstream
   git config remote.upstream.tagOpt --no-tags
   git remote add origin <private url>
   git push -u origin main
   node scripts/bootstrap.mjs
   node scripts/harness.mjs check
   ```

   Then the instance's own setup commit: register the local-terms list
   (ignored) with the terms you state, one per line as `refuse: <term>` or
   `review: <term>`, and check it; *until WO-258*, generate the lineage
   index the starter lacks and drop the retired ceilings file; confirm the
   document gate before the first pass:

   ```sh
   mkdir -p docs/control/local
   printf 'refuse: <a private term>\n' > docs/control/local/terms.txt
   npm run terms -- check CLAUDE.md README.md
   node scripts/lineage.mjs index
   git rm docs/control/doc-ceilings.json
   git add docs/lineage/README.md
   git commit -m "Set up this instance: the lineage index, the retired ceilings file removed"
   npm run meta
   npm run test:docs
   git push
   ```

   Hosts: at v0.120.1 every instance carries the Codex and Copilot surfaces;
   after WO-258 a fresh instance is Claude-only unless `dotln.config.json`
   elects `features.host-codex` or `features.host-copilot`, and an instance
   whose log or discovery record shows a host keeps it. Copy
   `dotln.config.example.json` to `dotln.config.json` only when the
   instance elects a feature; an absent file is the default layout.

2. **The first planning pass** (a session in the instance's `main`): type
   `planning: first pass` as a message of its own, with nothing else in
   it; the pass runs `npm run plan -- start <slug>` itself, files the
   instance's orders and sequence, refutes them with one background worker,
   and ends with `node scripts/refute-plan.mjs publish --title <title>
   --body-file <path>`, which opens the pull request you merge with a merge
   commit. A pass never takes a starter update; only your words in a plain
   session do (step 5). *Until WO-258*, if the pass's only order has closed
   and it files no other, keep the closed order in the sequence.

3. **WO-001 in its own worktree** (from clean `main` whose setup commit is
   on `origin/main`):

   ```sh
   npm run worktree -- start WO-001 docs/work-orders/WO-001-environment-truth.md
   ```

   Open a session in the sibling worktree the command prints, run
   `npm run resume -- status` and `npm run meta`, then type `resume: next`;
   or, from `main`, type `drive: WO-001`, which runs the phases in fresh
   sessions and stops for your merge. After you merge, in `main`:

   ```sh
   git pull --ff-only
   ```

   then type `resume: release close` (*until WO-258* the pull must come
   first, or the phrase records no dispatch and the close's helper withholds
   its admission). *Until WO-259*, the sessions paraphrase you under the
   rule the kit guide now carries; nothing checks it yet.

4. **Research orders of a sibling repository**: a planning pass files the
   registration order first (the kit guide's step 4: the repository under
   `repositories` in `dotln.config.json` with `baseBranch`,
   `worktreeParent`, `repositoryClass`, `authorityProfile`, `gate` and an
   optional `profile` and `documentationRoot`; the profile from the
   template under `docs/repositories/README.md`; `docs/control/outward-vocabulary.json`
   with its `reviewTerms`; the grant in `packages/skeleton/loadouts/grants.json`;
   the clone recorded with `npm run worktree -- clone <id>
   /absolute/path/to/the/clone`), and you merge it before any target order
   starts. Each research order is an ordinary order with a
   `**Repository:** <id>` line, an Objective that states the question and
   the decision it informs, a Design with a bounded budget and stopping
   conditions, and method criteria whose outcome is one of `ready`,
   `negative` or `inconclusive` (product 07 §Research and guided-operator
   work orders). Then `npm run worktree -- start WO-00N <order path>`
   creates the launchpad worktree and the target worktree pair, and
   `drive: WO-00N` or `resume: next` runs it; the target's own declared gate
   judges it, `worktree publish WO-00N --target-worktree …` publishes the
   target change and `worktree publish WO-00N …` the launchpad records.
   *Until WO-259*, after `target-records` files a record into the target,
   the launchpad records of that order are committed only after the move,
   so a link in a filed record resolves at no public commit; read it in the
   launchpad's order branch.

5. **Taking a core release in each instance** (a plain session in `main`,
   on your word, never a pass; the kit guide §Taking upstream updates):

   ```sh
   git fetch --no-tags upstream
   git worktree add --detach .runtime/upstream-preview upstream/main
   node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main
   git worktree remove .runtime/upstream-preview
   git switch -c chore/starter-update
   git merge upstream/main
   node scripts/harness.mjs emit
   node scripts/lineage.mjs index
   git add -A
   git commit -m "Take starter <version>"
   node scripts/launchpad.mjs update --publish --title "Take starter <version>" --body-file <path>
   ```

   Merge the pull request with a merge commit, then in `main`:

   ```sh
   git switch main
   node scripts/launchpad.mjs update --finish
   ```

   Read the release's Read before upgrading first; v0.119.0's names the
   index regeneration and a new session for the emitted settings, and
   *until WO-258* its derived line's `node scripts/siblings.mjs index`
   refuses in an instance without a sibling declaration, which is nothing
   to fix there.

6. **The instance's returns**: each instance pass writes its requests to
   core as a block in its planning document; paste it into a core
   `planning:` dispatch on its first content line, as this pass received
   two. After WO-258 and WO-259 land, the smaller orders the operator
   plans come from those blocks, one or a few items each.

### This session's own journal

The journal rows of this session were read as metadata (never the
prompts): every row carries `route: unknown`, `routeSource:
host-route-unavailable` and `attribution: unattributed`, the dispatch
included, so the transcript-based attribution `promptRoute` tries first
finds no matching row on Claude Code 2.1.319; the dispatch row carries
`prefixLine` 1 behind the pasted wrapper and class `direction`; the
mid-turn message is `unclassified`.

The refuter's hand-back arrived at 19:31:40Z as two host messages. The
first is the report: a prompt whose first content line opens an
`agent-message` element carrying the worker's identifier in its `from`
attribute, then a host-written frame line saying the text is a subagent's
final report and not the operator's, then the report with every line
indented by the host; the prompt hook journaled it as
`OperatorMessageObserved` with source `claude-prompt-hook`, class
`unclassified`, `leadingElement` `agent-message`, `prefix` null,
attribution `unattributed` (6,137 bytes), the shape the private instance
reported, now with WO-257's reader naming the element. The second is the
host's `task-notification` envelope (status, task id, tool-use id, a
summary and a usage block), which `terminalTaskNotification` recognizes.
WO-259 step 5 keys on the first: an `agent-message` leading element with
the host's frame is a hand-back, journaled under `host-agent-handback`.
One more observation for WO-259's executor: the worker's one `node`
command (to print the prompt's keys) was refused by this session's
live-gate hook, because the parent's document gate was running at that
moment; the worker wrote its files with its editor and the parent validated
the JSON, as the worker definition's gate rule intends.

## Orders filed and amended

Two orders filed, none amended. Each criterion was screened against the
five defect classes before filing: no count, ceiling, cost, duration or
token figure is a criterion's subject (the task timings and the measured
bytes are Cost lines and decisions; the router ceiling's criterion reads
`npm run meta`'s breach line and the recorded acceptance, not a number);
no criterion reads `HEAD` or a commit range before the final review's
commit or judges what a later phase judges; each input a criterion reads
is at the base or made by a named step (the fixtures, the shim git, the
captures, the bare origin); the one host-dependent check (the fork's
GitHub resolution) has its fallback named (WO-259 criterion 9's bare-origin
arm); and no pair contradicts. `npm run work-orders -- index --check`
prints no advisory for either order (one for WO-244's `git log`, which
stands).

- [WO-258 — An instance's first cycle meets the kit](../../work-orders/WO-258-an-instances-first-cycle-meets-the-kit.md):
  host support as elections (`host-codex`, `host-copilot`, off by default,
  inferred on from the instance's own control log and discovery record, the
  emit filtered to the hosts that are on, this repository's bundle
  unchanged), `auto-update-upstream` (WO-257-D029) and the hook's election
  reader (WO-242-D032); the release-close phrase journaled as a pending
  dispatch the close records after its fast-forward; a Git floor beside the
  Node range with the classification failure named and the close blocker
  classed; the first-order template's three corrections, the seeded front
  page and documentation index binding every root README, the starter
  refresh adding absent export seeds and removing the retired ceilings file,
  the router ceiling raised with its acceptance; an empty sequence admitted;
  the continuation gate comparing under the judged receipt's rule with the
  instance-history fixture carrying a separate-track member; `siblings
  index` exiting 0 without a declaration. Seventeen steps, twelve criteria,
  machinery, minor. First.
- [WO-259 — Committed words and filed records](../../work-orders/WO-259-committed-words-and-filed-records.md):
  the paraphrase rule and the two no-print rules in every role's and
  worker's text and the canonical brief, with the router's stop list
  (WO-242-D027); `features.verbatim-operator-words` and
  `operatorQuote.requestedIn`; `docs-check` failing a current record's
  attributed speech without a capture citation and screening the files a
  branch changed against the ignored captures; the hand-back journaled
  under `host-agent-handback`, refused as a rule's provenance and left out
  of the intervention count; the `terms` task in the document selection and
  the publish helpers screening the branch's changed files; the launchpad
  publish form's phase check (WO-257-D046); discovery's parse error named
  and `discover` guarded and deduplicated; `target-records` refusing an
  uncommitted source so the footer's commit holds every record and its
  links' destinations. Ten steps, eleven criteria, machinery, minor.
  Second, after WO-258 whose registry rows and role text it extends.

Both orders record that the private instance's observations are carried
evidence taken as reported, each fixture being the reproduction, and that
the instance's reading of Git's release notes is the planner's working
value the executor confirms.

## Register

`followups --sync` after the map's candidates section of 2026-11-07 minted
its fifteen rows beside the twelve untriaged rows the three closes since the
last pass had written. `followups --touching` over the two orders and the
twenty-seven files they name matched fifty pending rows, read against their
decisions. One batch of thirty-one requests at revision `a4a4ea7f…` left
revision `7a8420a1906232822cbf68c57f094f7421dee05689c33c652681668ae3c95a68`:

- Allocated to WO-258: FUP-f191f04206f7ec8a (WO-257-D029, the update
  election, step 5); FUP-2975f260666e8b04 (WO-242-D032, the hook's election
  reader, step 6); FUP-fb8cbeabbddef397 (ER4-005: its condition fired, the
  plan-check median at 10.53 s against the 9 s the 2026-11-01 pass set, on
  a host at load 5.05 over sixteen CPUs with a register of 1,660 entries;
  allocated as a carry-in that prints the check's step timings, no
  optimization claimed); FUP-c4c7ba9f126d2e4a (WO-232-D017: its home
  occurred, step 15 edits `plan-continuation.mjs`; the three guard cases as
  a Boy Scout carry-in); FUP-589642d0e0c714c8 (WO-226-D021: its home
  occurred, step 7 edits the release-close dispatch path; the near-miss
  advisory's two spellings as a Boy Scout carry-in).
- Allocated to WO-259: FUP-9cfd1cd290f68d1b (WO-257-D046, the launchpad
  publish form, step 7); FUP-1c2f009b880027e6 (WO-242-D027, the router's
  stop list, step 1); FUP-1b94e79e02e54e70 (WO-227-D026: its condition
  occurred, step 6 edits `launchpad-publish.mjs`; the malformed-list
  refusal naming the line as a Boy Scout carry-in).
- Deferred with their conditions, read against their decisions: the four
  plan-first rows WO-242 wrote (D015 the unrecorded pinned root, D026 the
  approval cleared by an integration, D028 status under a missing target
  registration, D029 the source-change fixture), since WO-242 closed and no
  open order owns plan-first; the four rows WO-257 wrote (D017 the review
  budget as configuration, D036 the page writers' import closure, D039 the
  large-capture limit, D044 the split-round merge), each waiting for the
  observation its condition names.
- Declined, each with its reversal condition: the twelve candidates of
  §NoOps 1 to 12. Settled: the three readings of §NoOps 13 to 15.
- Read and left, no condition fired: the other thirty-nine matched rows,
  among them the eight cold-start optimization rows (FUP-c61f76f60798e1b2
  and its siblings), which WO-258's router acceptance does not settle, and
  FUP-0560f7b8644b36f2 (WO-243-D013, one source for the gate-input
  records), from whose list WO-258 removes one stale entry without taking
  the shared source.

## Red tags

<!-- dotln-red-tags:start -->

```json
{
  "after": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
  "tags": []
}
```

<!-- dotln-red-tags:end -->

`plan start` found nothing unbound: the 2026-11-06 pass's twenty-six
dispositions hold now that WO-257's front-page step landed in v0.119.0, and
no document went unread and unreached since.

## NoOps

The map's candidates section of 2026-11-07 holds each in full as a
`NoOpIntent` with its evidence and reopening condition:

1. **A third order for the planning-side items.** Declined: the operator
   asked for one or two large fix orders; the items are met at a first pass
   and a first update, WO-258's subject. Useful if WO-258's first
   verification fails on a planning item alone.
2. **Pushing each checkpoint as a ref at release close** (the fork's first
   alternative). Declined: a checkpoint is a recovery object outside the
   branch's history; WO-259 commits the records before they move. Useful if
   a records commit cannot be reached from the pushed history.
3. **The footer gives the layout only** (the fork's second alternative).
   Declined: the fork's check is every link resolving through GitHub alone.
   Useful never on its own.
4. **A separate-track member as an order input the judged set may lack**
   (the fork's second alternative in 2.2). Declined: the next receipt judges
   it. Useful if a member must enter an old receipt.
5. **The last closed order stays until another is filed** (the instance's
   route). Declined as the rule, kept as the instance's route until
   WO-258's release. Useful if WO-258 closes without the empty sequence.
6. **Judging the phrase against `origin/main`** (the instance's first
   alternative). Declined: a prompt hook never reaches the network. Useful
   if a close must be dispatched from a checkout that never fast-forwards.
7. **A host build overlay instead of feature rows.** Declined: the
   inventory is where an election prints with its source. Useful never.
8. **Inferring a host from the ignored journals.** Declined: a fresh clone
   has none. Useful if an instance's log never names a host it uses.
9. **A quotation-mark classifier as the verbatim check.** Declined: the
   observed case carried no attribution. Useful never on its own.
10. **A kit action that deletes a retired seed.** Declined: actions are
    opt-in; the refresh removes an unmodified retired seed as it rewrites
    one. Useful if a retired instance file is not a seed.
11. **Emulating `check-attr --source` on old Git.** Declined: one refusal
    naming the floor. Useful if a supported host cannot reach the floor.
12. **A separate order for the hand-back row.** Declined: one journal
    source and one refusal inside WO-259. Useful if the host's hand-back
    shape changes before WO-259 activates.
13. **The eight untriaged follow-ups left deferred** (§Register). Useful
    when a condition fires.
14. **The register's first page and the fifty `--touching` matches**
    (§Register): four allocated, the rest left. Useful when a condition
    fires.
15. **The plan conditions** (five holding). Read; the plan-check reading
    re-disposed FUP-fb8cbeabbddef397; no order on a timing reading. Useful
    when a reading crosses its figure on three consecutive passes.

**The trap meter** (`npm run meta` after the subject revision):
`readAmplification` 3.09, up 2.726 over the last delta (WO-243's close),
`machineryShare` 0.23 (up 0.101), `elapsedPerCodeByte` 170.06, `guardRefusals`
1, `operatorCorrections` 3, `operatorDirections` 0, `coldStartBytes` 44,563
(up 205), `gateStepCount` 118 (down 2); each labeled "insufficient
worsening evidence", 0 reopen candidates, 10 budget breaches (every bounded
role root and the router, FUP-c61f76f60798e1b2's standing state), WO-243's
tokens read 245,304,624 by the meter. No order filed on the meter: the
read-amplification jump is one close's reading (WO-243's small change
against the complete run it still paid) and WO-258's router acceptance
settles one breach under the standing route. Useful when the next close
reads `readAmplification` above 3 again, or a root breaches with no
acceptance.

## Sequence

WO-257 (v0.119.0), WO-242 (v0.120.0) and WO-243 (v0.120.1) left the list as
closed. WO-258 first and WO-259 second, on the operator's item 5 (one or two
large fix orders now) and the Focus (the starter, the operator's fork and
the private instance): the operator's next cycle is a set of clean
instances cloned from the starter, and every item in WO-258 is met at a
clone, a first pass, a first order or an update, while WO-259 extends its
registry rows and role text. Then WO-244, WO-083, WO-207, WO-193, WO-183,
WO-088, WO-091, WO-096, WO-014, unchanged. Serial order stays the operator's
direction of 2026-10-13; the rules and the Focus are unchanged; the sequence
measures 6,688 bytes against its 8,192 ceiling.

## Write-backs

- Product 07 §Documentation freshness and ownership: the operator's rule
  of 2026-11-07 (no operator message saved verbatim in a committed
  artifact, with the two exceptions), its capture digest and WO-259 as its
  enforcement (§Rules recorded).
- The kit guide §Document quality: the same rule for every instance
  (§Rules recorded).
- Product 06: the rung names the three releases since v0.118.0 and the work
  after v0.120.1.
- The sequence; the map (the pass paragraph, two catalog rows, the
  candidates section of 2026-11-07); the idea ledger's registration; the
  generated index and history page; the register (one batch, §Register);
  the plan cost table by `npm run meta -- --plan-cost` after the subject
  commit (§Validation).
- Nothing on the front page: no order proposes a capability sentence for
  it this pass.

## Rules recorded

<!-- dotln-rules-recorded:start -->

```json
[
  {
    "rule": "No operator message is saved verbatim in a committed artifact: a committed document, record or source file paraphrases the operator and cites the ignored intake capture by its digest; a quotation is written only where the operator asks in the session for that message to be saved, recorded as an operatorQuote naming the capture's digest and the request's, or where a clone or fork has turned the rule off in its configuration.",
    "document": "docs/product/07-execution-guide.md",
    "section": "Documentation freshness and ownership",
    "message": {
      "sessionKey": "fd1644312f3a51d6baec9e2f9533765926971aa5902d1a646a34b4da569f3d1e",
      "recordedAt": "2026-11-07T18:33:35.378Z"
    },
    "captureDigest": "sha256:123eb18018301f41fb4b107f0fb0ad53eb40eb38b13c75a906f588dc913c6cd6",
    "class": "direction"
  },
  {
    "rule": "No operator message is saved verbatim in a committed artifact: a session paraphrases the operator in committed text and cites the ignored intake capture by its SHA-256, and a quotation is written only where the operator asks for that message to be saved, as a typed operatorQuote naming the capture's digest and the request's, or where this instance turns the rule off in its configuration.",
    "document": "docs/KIT.md",
    "section": "Document quality",
    "message": {
      "sessionKey": "fd1644312f3a51d6baec9e2f9533765926971aa5902d1a646a34b4da569f3d1e",
      "recordedAt": "2026-11-07T18:33:35.378Z"
    },
    "captureDigest": "sha256:123eb18018301f41fb4b107f0fb0ad53eb40eb38b13c75a906f588dc913c6cd6",
    "class": "direction"
  }
]
```

<!-- dotln-rules-recorded:end -->

Both entries name the dispatch message's journal row, classed `direction`
by the hook; the rule's wording in each document is the planner's
synthesis of the operator's item 2, named in the items table's inference
column, so the operator can strike it by removing the entry. The operator's
item 3 (hosts as elections) is a kit design carried by WO-258's provenance,
not a standing rule written today, since no standing document can yet say
the kit does it.

## Answers to the fork (paste-ready)

```text
Answers from core's planning pass of 2026-11-07 (docs/planning/passes/first-cycle-returns-and-host-elections-2026-11-07.md) to the DotLn-Enterprise-Starter fork's blocks of 2026-11-06 on starter v0.118.0 and v0.119.0. Read each against the record it names. Core closed WO-257 (v0.119.0), WO-242 (v0.120.0) and WO-243 (v0.120.1) since its answers of 2026-11-06, and this pass filed WO-258 (an instance's first cycle meets the kit) first and WO-259 (committed words and filed records) second; WO-244 follows. Nothing below blocks your next order; each filed item names its route until the release that carries it.

Block on v0.118.0.
1. Recorded; nothing asked.
2. Recorded; and observed here: this pass's dispatch arrived inside the host's pasted-content wrapper and the hook read it on its second line with the role resolved (prefixLine 1), so WO-257's reader skips the wrapper in a live session; the slash-command block is the case you will observe next.
3. Filed in WO-259 step 9: target-records refuses a source that is not committed at the launchpad's HEAD, so the footer's commit holds every record and the evidence its links reach, and the launchpad records publish pushes that commit's history; the footer then says the links resolve at that commit on the launchpad. Neither of your two routes as written: a checkpoint stays a recovery object (pushing it as a ref is declined), and the commit beside docs/dotln/ is the footer's own. Until then, commit the records before running target-records, so the HEAD the footer names holds them; core's fixture checks the links on a bare origin, and your next pass's GitHub check is the confirmation core cannot run.
4. Recorded; nothing asked.
5. Recorded; nothing asked.

Block on v0.119.0.
1. Recorded; nothing asked.
2. Filed in WO-258 step 15: the continuation check builds the current subject under the judged receipt's rule (separateTrack only when the receipt carries the key), as the receipt rebuild already does, and the instance-history fixture carries a track: separate workstream with an open member so WO-232's compatibility rule catches the case. Your route stands until then: the next receipt over the grown subject.
3. Filed in WO-258 step 16: node scripts/siblings.mjs index and --check exit 0 naming the absent declaration, so the derived line is instance-safe. Until then the refusal is nothing to fix.
4. Filed in WO-259 step 9 (the same decision as item 3 above): the records are committed before the move and the footer names a commit the pushed order branch's history holds. Your deferral stands until then, and WO-034's final reviewer's reading of what the first footer resolves to is evidence core will read.
5. Recorded; the wrapper case is observed (item 2 above); the slash-command case waits for a pass that dispatches after one.

Two more for your information: core recorded on 2026-11-07 the operator's rule that no operator message is saved verbatim in a committed artifact (the kit guide §Document quality carries it at the next release; WO-259 carries the check); and WO-258 makes Codex and Copilot support elections, off for a new instance and inferred on for an instance whose control log or discovery record shows the host, so your bundle is unchanged.
```

## Answers to the private instance (paste-ready)

```text
Answers from core's planning pass of 2026-11-07 (docs/planning/passes/first-cycle-returns-and-host-elections-2026-11-07.md) to the instance's requests of 2026-11-07 (starter v0.119.0). Each item was read against core's files at v0.120.1; every one is confirmed there and filed. Core filed WO-258 (an instance's first cycle meets the kit) first and WO-259 (committed words and filed records) second. None blocks the instance's next order; each names its working route until the release that carries it.

1. Filed in WO-258 step 7: a resume: release close phrase whose action is not yet legal because the checkout lacks the merged order's records is journaled as a pending dispatch with the role resolved, and the close records it after the fast-forward it already performs; the operator reference and the final review's printed next step say to update main first. Until then: git pull --ff-only before the phrase.
2. Filed in WO-258 steps 8 and 9: a Git floor declared once (2.40 on your evidence; the executor confirms it against Git's notes) and judged by the host task, harness check and harness evidence beside the Node range, naming the floor and the version read; the classification failure names git's exit code and stderr, and the close blocker is classed by that cause. Until then: Git 2.40 or later first on PATH.
3. Filed in WO-259 step 6: a terms task in npm run test:docs screens the Markdown and kit text the branch adds or changes with the list, naming file, line and mode and never the term, and the publish helpers screen the branch's changed files before the first push. Until then: npm run terms -- check over each order's files.
4. Filed in WO-259 step 8: the attestation names a parse error of the discovery record as one; discover guards a record without versions and records a version or a line once. Until then: seed versions and run discover once per minor line.
5. The rule is recorded today in product 07 and the kit guide (the kit guide §Document quality at the next release): no operator message is saved verbatim in a committed artifact; committed text paraphrases and cites the ignored capture by its SHA-256; a quotation is written only on the operator's request to save that message, as an operatorQuote naming the capture's digest and the request's, or where the instance turns the rule off in its configuration. Its enforcement is WO-259 steps 1 to 4: the rule in every role's and worker's text, a failure for a current record's attributed speech without a capture citation, and a screen that compares the files a branch changed with the ignored captures by a declared word window, naming file, line and digest and never the words. Until then: paraphrase under your recorded rule, as you do.
6. Filed in WO-259 steps 1 and 2: the worker definitions on both hosts and the canonical brief's preamble say never to read or print the contents of docs/control/local/ and never to print a commit header or an author line. Until then: the two rules in each brief, as you add them.
7. Filed in WO-258 steps 10 to 13: (a) the first-order template records the printed status, says an empty list refuses nothing, names the files the order writes and drops the timebox; (b) the starter refresh writes every export seed absent from the starter, dotln.config.json and the lineage index among them, and UPSTREAM.md lists exactly the seeds the export writes; (c) the refresh removes an unmodified doc-ceilings.json and keeps a customized one with its reason; (d) the seeded front page links docs/README.md and the index links each root README, so a first pass red-tags none of them; (e) the router ceiling the kit seeds is raised to the generated root's bytes plus one step, with core's acceptance recorded. A new instance meets none of the five; yours has handled each.
8. Filed in WO-258 step 14: a sequence with no order is admitted by the subject, plan check, meta --plan-cost and the refuter's prompt. Until then: the closed order stays in the sequence, your route.
9. Filed in WO-259 step 5: a background worker's hand-back is journaled under its own source (host-agent-handback) with the host as its attribution, plan check refuses a Rules recorded entry naming its row, and plan failures leaves it out of the intervention count; core observed in its own session that every prompt row on Claude Code 2.1.319 reads unattributed, the dispatch included, and records its refuter's hand-back shape for the executor. Until then: cite only rows you match to the operator's own messages, your route.

Two more for your information: WO-258 makes Codex and Copilot support elections, off for a new instance and inferred on for an instance whose control log or discovery record shows the host, so your instance keeps Codex with no configuration change; and core's answer to your working routes is that each stands until the carrying release, whose Read before upgrading says what to regenerate.
```

## Process cost

Model and effort: Fable 5.1 at max, operator-selected (CLAUDE_EFFORT=max;
the `/model` line of the session). Usage at entry (18:33:34Z): 95,366 total
tokens (71,742 cached input, 23,116 cache write, 504 output, 4 input;
source `claude-transcript-message-usage`, scope dispatch, cost unknown);
at 19:13:02Z, with the subject drafted and before the refuter: 9,525,834
total (8,982,960 cached input, 392,308 cache write, 149,340 output, 1,226
input; cost unknown); the exit reading is in §Validation. Dispatch
standing read `41 h 15 min of unset; complete runs 11 of unset`, the
planner standing the readback carries from the previous pass's dispatch.
Subagents: budget 20 (`subagentCap`); the plan stated before the first
spawn: one refuter (`dotln-worker`, claude-opus-5-5 at xhigh, the Claude
default; the dispatch line names no fable worker), launched once with no
re-task, and no review worker (the dispatch carries no `reviewed` label and
WO-244's routine is not landed); the launches made are in §Validation.
Wall-clock of the pass's commands: `plan start` returned inside its bound
with its step lines not retained by this session's terminal (the tail
alone was shown), so its per-step figures are unknown; `plan failures`,
`plan conditions` (58.6 s by its own line), `npm run meta` and the register
batch each under a minute; the rest in §Validation. Against the NoOp of
doing nothing: every clean instance the operator makes next meets the nine
edges the private instance met, every session may keep copying the
operator's words into committed records, and every instance keeps carrying
two hosts it never elected.

## Validation

`npm run work-orders -- index --check` passes with one criteria advisory,
WO-244's criterion 3 (`git log`), which stands as the 2026-11-01 pass left
it; neither new order draws one. `node scripts/docs-check.mjs`: 0 failures
(340 standing, 5,529 record and 16 generated documents; 0 standing without
a reader binding; the 110 operator-word advisories are the historical
baseline's, one of them this pass's own map paragraph that names the
operator's items by their digest). `npm run test:docs` ran three times:
before the receipt the `generated` preflight was stale (the lineage index
and the software-engineer table of contents after the ledger's registration
heading), repaired by `npm run sync` and committed; then 25 tasks passed
and the two plan tasks failed on the one fact they should, the pass heading
with no receipt; after the receipt, 27 passed, 0 failed, 0 h 2 min.

Refutation: `npm run plan -- refute` printed the canonical prompt over the
committed subject at `3f9345e7` (132,427 bytes: the standard, the goal
review, WO-258 and WO-259 for judgment, the sequence and the cost table;
nine carried identities). One `dotln-worker` launch (claude-opus-5-5 at
xhigh, the Claude default; 0 h 11 min, 160,711 tokens by the host's
notification) returned `aligned-with-findings` for both orders, no hold
and nineteen known issues (ten on WO-258, nine on WO-259), and one re-task
of the same worker (0 h 1 min) replaced the private scratch path in its
statement with the `<tmp>/` placeholder without rerolling the judgment.
The receipt helper refused twice before it filed, both as designed: the
result and statement must be contained regular files of the repository
(they were copied into the ignored local lane), and a statement may carry
no private absolute path. Filed as
[receipt 065](../refutations/2026-11-07-planning-ef4a1d095e4cd775-065.md)
at commit `1253f5fc`: dispatch to file 0 h 17 min; judged, committed and
workspace subjects equal (`0b9c7162…`); the Rules recorded block's two
entries checked against the journal row; the known issues carried on the
two catalog rows with the planner's readings (commit `8b372a8b`). Workers
by `harness usage`: launched 1 (claude), re-tasked 1, cap 20, remaining
18, exact observed count; the plan stated in §Process cost held except for
the one re-task, a formatting repair.

Usage at exit (19:36:50Z, before the publish): 20,800,219 total tokens
(20,127,272 cached input, 472,483 cache write, 198,590 output, 1,874
input; source `claude-transcript-message-usage`, scope dispatch, cost
unknown). Published with `node scripts/refute-plan.mjs publish` at commit `2f9e3404`:
pull request [#282](https://github.com/DylanBWood/DotLn/pull/282), which the
operator merges; the pass never merges.
