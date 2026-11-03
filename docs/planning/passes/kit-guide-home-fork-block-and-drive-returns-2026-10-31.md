# Planning pass — the kit's guide leaves the seeded README, the launchpad's own pull requests, WO-192's immediate follow-up and the pull-request table (2026-10-31)

## Dispatch and capture

Dispatch: `planning: standard planning pass +` with the operator's README
item, the DotLn-Enterprise-Starter fork's (dylanwoodconsulting) block of its
second pass of 2026-10-30 as item 2, and an empty item 3, received at
2026-10-31T15:10:25.008Z (prompt-hook time) in Claude Code, Fable 5.1 at
`max`, operator-selected (the `/model` line of the session). Captured
verbatim in ignored intake,
`docs/intake/notes/planning-kit-guide-home-fork-block-and-drive-returns-2026-10-31.md`,
SHA-256 `be49aeb50d95aac99a5dace4ca1aa8b4aa8a719f9e1a947fe5884be00e838180`
(the file also holds the first two mid-turn messages below). Branch:
`planning/2026-10-31-kit-guide-home-fork-block-and-drive-returns` from clean
`main` at `c27abd53` (v0.104.0). The prompt hook journaled the dispatch as a
paste (`prefix: null`, `class: unclassified`; the `planning:` line arrived
inside the pasted block), as the 2026-10-30 pass's did, so no role was
active, `harness usage` refused ("Token measurement requires an active role
and dispatch start") and no outside-write grant was equipped: the hook
refused a helper script written to the host scratchpad, and this pass's
helpers live in the ignored lane `docs/control/local/planning-2026-10-31/`.
Evidence for WO-226's first-line reading, a third time.

The dispatch line carried no host label (`gpt` or `fable`), so under product
07 §Paired passes and the synthesis pass this pass ran as a single standard
pass, not a paired one: it listed no other `planning/` branch and opened no
other pull request, and nothing of a sibling pass was there to withhold.
Reopen on the operator's word that a Codex pass received the same dispatch,
in which case `planning: synth pass` is the next step.

`npm run plan -- start` refused the entry: "Planning failures: the plan
start block exceeds 1 KB". The cause (`scripts/lib/plan-failures.mjs`
1245 to 1293): the block is pretty-printed JSON bounded at 1,024 bytes
after clipping only its two string fields, and the window since receipt
060 carried three off-ramp kinds (`offRampEvents` with `CriterionWaived`,
`DispatchBoundAccepted` and `OperatorOverrideRecorded`), which took the
block over the bound; the same block rendered compact measures 817 bytes
(the lane's `measure-start-block.mjs`). That shuts the branch on a count,
against WO-172's rule that a count never keeps the branch shut. The pass
took the hand route the fork's pass of 2026-10-30 took under WO-088's known
issue: the skeleton with the nine headings of
`scripts/lib/planning-document.mjs` written by hand, then `git switch -c`
from clean `main`; the register page, the failures, the conditions, the
reader scores and the prune summary that `plan start` prints were read by
their own commands (§Readings). The bound is WO-237's carry-in (it edits the
same file for the retained lanes) and the hand-written document is a known
issue on WO-088's row (the map's candidate 15).

Three operator messages arrived mid-turn and are captured with the dispatch:

| Time (hook) | Message | Aim read | Disposition |
| --- | --- | --- | --- |
| 15:32:53.529Z | run the same three reviewer types the executor and fix roles use before the refuter, integrate their results at the pass's judgment, then the refuter as normal | an independent review of the planning subject before refutation | three reviewers (criteria adversary, design improver, consistency reviewer) launched after the subject was committed; their findings and what the pass did with each in §Validation |
| 15:33:07.890Z | but use codex dotln workers | the reviewers run on the Codex host | the three reviewers ran as `codex exec` workers at the Codex pin (gpt-6.1-sol, `max`, read-only sandbox), the form the entropy review's `codex-cli-exec` transport uses, since `spawn_agent` is a Codex-host primitive this Claude session cannot call; the refuter stayed the default `dotln-worker` ("as normal"); reopen on the operator's word |
| 15:39:25.063Z (`…-message-3.md`, SHA-256 `52d78604680f1938af0e1489cbb5dec00b496f54df7188dc2fe9c4adc4c838b7`) | the pull-request charts are broken, in the instance and in core (a screenshot of the fork's WO-025 pull-request table) | the generated process table in every pull-request body is unreadable | WO-248 filed |
| 16:19:03.410Z (`…-message-4.md`, SHA-256 `82dd33e4ea5ed1aa36e2bac3b6f785e8eb0270c6f4a48b22d9570bf5efa34293`) | add this process as a possible planning route, within WO-244: the normal pass, the Codex pass then a blind Claude pass then a synthesis, or a normal Fable pass using the three Codex reviewers before the refutation | a third planning route, recorded where the routine lives | WO-244 amended (the `reviewed` label, `plan review` with canonical briefs, the role duties); product 07 §Paired passes and the synthesis pass states the three routes, with this pass as the reviewed route's first run |

The operator's items:

| Item | Aim read | Disposition |
| --- | --- | --- |
| 1 | the kit's README information is good, but an instance must be able to overwrite its main README at once with no issue and no chance of a later kit merge overriding it; find a better home for the information | WO-245 filed (`docs/KIT.md` as a kit file; the front page the instance's; the refresh never fighting over it; the release block an option in a kit root) |
| 2 | the fork's block of nine items, each to be filed, declined or deferred with its reopening condition | each read against its record (§Readings); items 6 and 9 → WO-246; item 2 → WO-237's carry-in; item 5 → answered, with a carry-in on WO-238; items 1 and 7 → WO-245 and the register; items 3, 4 and 8 → recorded; the paste-ready answers below |
| 3 | empty | nothing read; reopen when the operator supplies it |

Assumptions recorded: "immediate follow up" (the operator's waiver note of
2026-10-31, WO-192-D104) is read as priority in the queue, and WO-247 is
placed second behind the one-day order the operator's clone waits on
(WO-240, placed first the day before); the operator moves it first with one
sequence edit. "Find a better spot" is read as the pass's choice of file,
`docs/KIT.md`, with `docs/LAUNCHPAD.md` and `docs/kit/README.md` weighed
and declined in the order's Design. Reopen either on the operator's word.

## Readings

### Entry

- `npm run plan -- failures`: 6 items since receipt 060 (2026-10-30T17:48:53Z),
  all WO-192's: 0 failed verifications, 0 failed final reviews, 0 repairs,
  1 order made ready, 3 off-ramps (criterion 17 waived at ordinal 6; one
  `DispatchBoundAccepted` for `wallClockMs` with `ceiling: null`, the
  "as needed" acceptance of 2026-10-30; one override record), 2 amendments
  (D087, D089) and 1 withdrawn amendment (D075). Final-review escapes 1 of
  10 recent reviews (WO-235's); 14 local gate-failure rows, all WO-192's;
  2 host denials; 2 interventions (1 unclassified); 1 long phase (WO-192's
  implementation, 130 h 42 min against a 85 min median); 8 recent closes,
  1 delivery and 7 machinery. The `boundStops` block: 0 stops, 1
  acceptance, which `plan failures` lists with `ceiling: null` (the fork's
  item 2 observes the same): WO-237's carry-in.
- `npm run plan -- conditions` (57.3 s): 4 hold. The plan-check median
  8.004 s against 8 (FUP-fb8cbeabbddef397; the map's candidate 1, a NoOp);
  the plain gate's thirty-day median 491.4 s against 360, the
  target-worktree task 611.3 s against 189.8 and the skeleton task 482.6 s
  against 441.6 (FUP-e96221b106cd136a; unchanged since 2026-10-30;
  candidate 2). 3 unknown (two `--slow` measurements not taken; a vertical
  task with fewer than three samples). The release-tags table lacked one
  tag, v0.104.0, below its threshold of three; `npm run release -- list
  --markdown --write` added it.
- `gh issue list -R DylanBWood/DotLn`: no open issues.
- Canonical status: WO-192 closed (v0.104.0; `c27abd53` on `main`; VER-001
  pass with the operator's waiver of criterion 17; FINAL-001 pass; the
  starter refreshed by the close); no active order; the writer reserved by
  this session. Process health: first verification failed in 5 of the last
  8 closed orders; 2 reopen candidates.
- `harness usage`: refused (no active role); counters unknown.
- The register at entry: 238 pending (224 deferred, 9 untriaged, 1 open, 4
  needs-review) at revision `91a16add…`; the untriaged and open rows were
  all WO-192's decisions and two older decision rows, read whole (§Register).
- The reader scores `plan start` would have printed: two profile
  revisions, 10 and 9 releases, 40 and 36 questions, no corrections; no
  changed profile with three unscored releases was reported, so no score
  was run.
- The prune summary: 103 candidates, 1.27 GB, 0 removed, 1,195 retained
  (82 gate-fixture roots of 1.27 GB among the candidates); the launchpad's
  stash list is empty.
- `npm run meta` after the register batch: the trap meter flags
  `drift-to-low-performance` (coldStartBytes 37,901, Δ 1,401, three
  consecutive rises: WO-233's, WO-234's, WO-235's and WO-192's reviewed
  rules entering the executor root, within the 40,194 acceptance) and
  `policy-resistance` (guardRefusals 13 for WO-192, Δ 10) as reopen
  candidates, as the 2026-10-30 pass's run did; read and disposed in
  §NoOps.

### Item 1, the kit's README

`scripts/launchpad.mjs` 1063 seeds `README.md` from
`scripts/kit/README.client.md` (60,857 bytes, eleven sections, the release
claim at line 395), and the same file is a manifest-listed kit file under
`scripts/kit/`. The starter refresh (`scripts/lib/starter-seeds.mjs`
`planStarterSeeds`, 109 to 200) lists `README.md` among eight refresh
seeds: at each release whose template changed, a starter copy that still
equals a prior rendering is rewritten, and a customized copy refuses the
whole refresh. The starter's `README.md` changed in v0.103.0 and v0.103.1
and the fork's merges carried it both times (its items 1 and 7). The kit
update itself never touches seeds; the Git merge of the starter's history
does. The release block: `release prepare` requires it
(`release-preparation.mjs` 170 to 220) and the close's check fails without
it (`release.mjs` 905 to 921), with a kit-root remedy; the fork's page
carries `This source prepares Launchpad v0.3.3`. The document check's
front-page guard reads `docs/control/front-page.json`, which the kit does
not carry (`KIT-MANIFEST.json`: five documents under `docs/`), so nothing
else guards an instance's page. WO-238 planned to cut the README to the
instance's needs and move the explanation into the kit's `docs/` without
changing the seed rule; WO-245 takes both, and WO-238's step 9 now edits
`docs/KIT.md`.

### Item 2, the fork's block

Read against the fork's pass document
(`../DotLn-Instance/docs/planning/concept-batches-and-quality-passes-2026-10-30.md`
§Requests to core, §Register, §Core's answers of 2026-10-30 and its two
addenda), the fork's control segment (`docs/control/orders/WO-015.jsonl`:
two `DispatchBoundAccepted` rows of 14:01:24Z and 14:01:25Z with `ceiling:
null`), its orders WO-025 and WO-026, its rows FUP-49dda4781fa64b25 (C5,
`gh repo set-default`) and FUP-f85ede7a356345c5 (C6, the title workflow),
and core's code and rows.

1. Confirmations at v0.103.1: recorded. `README.md` carried again is
   evidence on FUP-b44117f7b047e976, whose README half is now WO-245's.
2. The first acceptance: recorded on FUP-632348a91b2ae9d8, deferred again
   (no stop row yet, in the fork or in core). The `ceiling: null` rendering
   is a defect of `plan failures` (`plan-failures.mjs` 1087 passes the event
   through; `resume.mjs` 1946 stores `unlimited` as null): WO-237's
   carry-in.
3. Item 3 taken: recorded; the fork's FUP-2403ce12b1fca8b2 settled on core's
   answer, as the fork recorded.
4. The five target orders and two document orders: recorded; nothing asked.
5. The quality pass inside an order: answered (the paste-ready block): an
   order whose steps run the procedure is within the command's intent, since
   the command authorizes the edits a session makes and the order's criteria
   judge the same edits (product 07 §Discipline, 2796 to 2832; WO-235-D042
   and D044); the per-document record is the order's evidence today, and
   whether a quality pass's outcome row joins the census shape is WO-238's
   decision at activation, reading the fork's `census.md` as the first
   sample (WO-238's new carry-in).
6. The `gh` trap: WO-246 filed with items (a), (b) and (c): no `gh`
   command is judged by the hook today (`harness-host.ts` names none); the
   planner role (`contributor.ts` 270) and the kit README's update route
   (748 to 760) have the session spell raw `gh`; the target publish names
   `--repo forge.selector` on every call (`target-publish.mjs` 1259 to
   1285).
7. `README.md` and WO-025's exclusion: recorded; WO-245 is the carrier.
8. The live-gate refusal's read-only forms: recorded as evidence that the
   refusal and its message sufficed (the map's candidate 12).
9. Pull-request titles: the lint requires `type(scope)?: subject` after an
   optional gitmoji (`outward-lint.mjs` 691 to 709; "gitmoji requires type"
   at `test-outward-lint.mjs` 134); core's own merged titles (#255, #257,
   #258) carry no type and would be refused by it. WO-246 admits a gitmoji
   and a subject for the `pr-title` kind and keeps the `commit` kind
   conventional; an instance-declared convention is declined (candidate 11).

### The third message, the pull-request table

`scripts/lib/meta.mjs` `renderMetaTable` (2299 to 2391) renders a ten-column
Work table for the last five closed orders and the active one
(`closed.slice(-5)`, 1587) and a nine-column Dispatch table for the active
order's roles, with the previous-order delta (`orders[index - 1]`, 2104 to
2127) in every cell and no label, blank cells for unobserved values by
design (the comment at 2296 to 2298) with one footer line counting them,
and a combined USD-and-declared-prompt-tokens column; `release prepare`
embeds it as the body's last block (`github-body.mjs` 1371 to 1400). Core's
#258 body carries both tables (six orders; "54 unavailable observations
omitted as blank cells"); the fork's screenshot shows the second with its
Wall cells wrapped one word per line. WO-248 filed.

### WO-192's close and its returns

WO-192 closed at v0.104.0 on 2026-10-31 with criterion 17 waived by the
operator (ordinal 6; the capture
`docs/intake/WO-192-criterion-17-waiver-2026-10-31.txt`, SHA-256
`2aee1c8d…`: "make a note that needs an immediate follow up bc it seems
like a solvable issue"), recorded by D104 as the immediate follow-up
FUP-5b7b2e27a0e6b01a. The pass read D004, D023, D040, D042, D057, D080 to
D083, D091, D095, D099, D100, D102, D103 and D104, the handoff's criterion
17 and §Independent review (the ten items left), the process-recovery note
of 2026-10-30 and its nine candidates, and the register rows they minted.
Findings: the declined Codex close (attempts 49 and 50) has no retained
reason because the live fixture removes its home at cleanup; re-entry
refuses a host change; no receipt carries a code identity; two reviewer
probes pushed to a real GitHub URL through a fixture whose bare Git helper
lacks the redirect (D099); the sandbox a routed run gets is a fixture
variable (D057) while the operator's environments are unsandboxed; the
driven start exceeds the installed ceilings by its launch text (D095);
product 07's cold-start route says no acceptance is recorded while four
orders recorded one citing the retired route, and the meter reads a breach
as an advisory (`process-budget.mjs` 166 to 187). D080 and D081 (the
stashes, the scratch, the prune at close, the kit delivery) were settled by
WO-233 at v0.100.0, which closed the day after they were written; the
stash list is empty today. WO-247 carries D104, D102, D057, D099 and
D095's third rule; the rest are the map's candidates 3 to 10.

## Orders filed and amended

- **WO-245 — The kit's guide is a kit file and the front page is the
  instance's** (new; delivery; minor; fourth). `docs/KIT.md` in the kit's
  document list; the short seed with its pinned digest; the refresh
  rewriting `README.md` only while it still equals a prior rendering and
  keeping, never refusing, an edited copy; a kit root's release prepare and
  close admitting a page without the release block; the `docs/README.md`
  pointer. Rejected in its Design: `docs/kit/README.md`, WO-238's cut
  alone, dropping the refresh seed outright, an instance action, a second
  claim location, appending the block to an owner's page.
- **WO-246 — The launchpad's own pull requests** (new; machinery; minor;
  eleventh). `publishLaunchpadBranch` with two doors (`plan publish`,
  `update --publish`), the `pr-title` lint admitting a gitmoji and a
  subject, the hook refusing `gh pr` and `gh issue` without a repository in
  a clone whose origin and upstream differ, the planner role and the kit
  guide naming the helpers and the rule. Planning-deferral edge to WO-245
  for the guide's file.
- **WO-247 — A driven Codex order finishes** (new; machinery; minor;
  second). The declined close's reason retained before cleanup and
  diagnosed, the admitted repair, an `awaiting-close` stop with the
  attended command and `--host claude` on re-entry for release close only,
  `codeIdentity` and `drivenStart` on receipts with completion comparing
  identities, the ten criterion-17 items with regressions, the publication
  fixture's local origin, the `drive.sandbox` election, both hosts
  requalified on the final code.
- **WO-248 — The pull-request table says what its reader can use** (new;
  machinery; patch; fifth). One eight-column table for the order under
  review, `unknown` spelled out, hours and minutes, the previous-order
  comparison as one labelled sentence, the Work table and the footer out of
  the body, the pins following.
- **WO-242 — amended.** WO-192 merged at v0.104.0: the dependency becomes
  `satisfied-by-close`, the Design and step 8 name the route table
  (`scripts/lib/drive-route.mjs`) and the loop
  (`scripts/lib/drive-session.mjs`) with the drive fixture, criterion 7
  keeps only the landed form.
- **WO-237 — amended.** Two carry-ins: the `plan start` block bound that
  refused this pass's entry, and the `unlimited` rendering of a null
  acceptance ceiling (the fork's item 2).
- **WO-238 — amended.** The kit guide at `docs/KIT.md` in its Cost, Cites,
  Observed gap and step 9 (the seeded README is the instance's and is not
  edited); the fork's item 5 as a carry-in (a quality pass's outcome row in
  the census shape, decided at activation).
- **WO-207 — amended.** A note that the README seed's half of
  FUP-b44117f7b047e976 is WO-245's and the preview rule covers the other
  seeded files; its kit-README step retargeted to the kit guide once WO-245
  merges.
- **WO-244 — amended** on the operator's fourth message: the `reviewed`
  label and `passKind`, `plan review` (the executor's three reviewer types
  as Codex workers with canonical briefs, after the commit and before the
  refuter, a fake transport for the fixture), the planner's reviewed duties,
  the Design's two rejected alternatives (the reviewers in place of the
  refuter; a reviewed paired pass), and this pass's by-hand run as the
  Observed gap's evidence.
- **WO-241, WO-242 and WO-243 — amended** after the reviews: their
  kit-README steps and criteria name the kit guide (`docs/KIT.md` once
  WO-245 merges, otherwise the README template), as WO-246 already did;
  WO-238 gains a planning-deferral edge to WO-245 for the same file.
- **WO-245, WO-246, WO-247 and WO-248 — amended after the reviews** (the
  fifteen distinct findings of §Validation): WO-245's refusal citation
  corrected (206 to 209); WO-246's gap narrowed to the missing
  fork-destination judgment beside the hook's existing `gh pr` parse, the
  helper's create-or-validate flow after a failed create, the fixture's
  GitHub-shaped identity on an unresolvable host, the target publish
  linting its title as `pr-title` only, and the gh manual page cited;
  WO-247's completion consumer named as `requireGateClaims`, the receipt's
  source identity distinguished from the fixture trees, the sandbox election
  resolved per host with selected and observed policy recorded, the
  publication fixture's identity kept GitHub-shaped and unreachable, the
  three reproduced defects given replayable controls, and criterion 6's six
  items enumerated; WO-248's renderer taking the subject order from its two
  callers and comparing with the latest closed order only, with the
  two-open-orders and closed-subject cases.
- **WO-192 — retired from the sequence** as closed; the history page is
  its record.

## Register

`followups --sync` minted sixteen rows from the map's candidates section
(revision `91a16add…` to `e459898c…`); `--apply` took forty-eight
dispositions in one batch at `e459898c…`, leaving `40a42901…`. The
dispositions:

| Rows | Disposition |
| --- | --- |
| FUP-5b7b2e27a0e6b01a (WO-192-D104, the immediate follow-up), FUP-0d7e98297efa0b60 (D102), FUP-ec3d1b98b15afd49 (D057), FUP-18a44de758813fea (the durable sandbox policy; its condition "WO-192 closes" occurred), FUP-b5211779c719d804 (D099), FUP-dd1ac63cf4883d5f (D095, its third rule) | allocated to WO-247 |
| FUP-b44117f7b047e976 (the template-derived carriers) | allocated to WO-245 and WO-207 |
| FUP-26904aebad0fa9af (a planning document written by hand after `plan start` refuses) | allocated to WO-088 as a known issue |
| FUP-0dc30eb3790e3563 (WO-192-D003; the cold-start route), FUP-27c2a67f93b5f596 (candidate 8) | settled by product 07's sentence |
| FUP-eca9ed46e4b2a4d9 (D094), FUP-98725ecebbb7216b (D004), FUP-4a6335f0e2790723 (D040), FUP-d403b1c2a1193625 (D042), FUP-bd59bdd4be4d1ed1 (the validation-order fix) | settled: implemented in WO-192 at v0.104.0 |
| FUP-ca213b859ce6a36c (D080), FUP-d925bbf866d1d43c (D081) | settled by WO-233 (v0.100.0) |
| FUP-681bfa0467ccd9be (WO-170-D002), FUP-c8770a693115bfa3 (WO-187-D009), FUP-d3ceb9bd4f9c48bc (candidate 16), FUP-3b192d8bc23d0773 (the fork's item 8) | settled |
| FUP-3682b768d1d00a3b, FUP-02446577ce028d06 (D023) and FUP-c37140a5fcecf75d, FUP-575e9e05f616d44c (D083) and FUP-a46f2cd3d159daa5, FUP-dfde4050da06d43b (D091) and FUP-f1376b4ce25342bb, FUP-6fc6c71d838b7368 (D100) and FUP-96169c1470b68728, FUP-17ea51254e5a7256 (D103) and FUP-b55b237ef872b9fc, FUP-c713e7e97964d316 and FUP-2fba42ccede44337 (the Order Drive's folds), FUP-632348a91b2ae9d8 (the attended acceptance), FUP-e96221b106cd136a, FUP-7d7c75dfd2d1026c, FUP-77efd30be6cab5c1, FUP-7f35e50c5d698168, FUP-ed4da61921a5c255 and FUP-dc31f381950a0b45 (the cold gate), FUP-75d361f43a699228 (the issue intake) | deferred with their conditions (§NoOps) |
| FUP-fb8cbeabbddef397 and FUP-5441e98b756230da (the plan-check condition), FUP-7ea60e8d0a8a4831 (spawned helpers as evidence sources), FUP-dc1e113c7508b7b4 (an instance-declared title convention) | declined |
| FUP-cdc7ecfe682c3cb4, FUP-f96d679da48f3d84 | duplicates of FUP-75d361f43a699228 and FUP-632348a91b2ae9d8 |

`followups --touching` over the four new orders and the amended ones was
run after the batch; its rows are in §Validation.

## NoOps

Each decline or deferral is a `NoOpIntent` with its reason and evidence in
the register's disposition and its `usefulWhen` as the reopening condition;
the map's candidates section (recorded 2026-10-31) holds the sixteen in
full. The ones the operator's items and WO-192's close raise directly:

- **No order for the plan-check overrun.** Reason: 4 ms over its 8 s
  threshold on one reading under load; WO-217-D037 declined the parse cache
  on the same standard. Evidence: `plan conditions` of 2026-10-31. Useful
  when two consecutive passes read the median above 8 s or one reads it
  above 9 s.
- **The cold gate** (the same reading as 2026-10-30). Useful when the
  median exceeds 600 s, a cause is named, or the operator names gate time a
  goal.
- **No supervisor over routed runs** (D023). Reason: WO-247's stop with a
  next step is a route row; the watcher's three questions are recorded.
  Useful when a drive repeats a failed phase three times without a stop or
  the operator asks.
- **The six process-recovery candidates** (D091). Reason: the written
  procedure already says what the session did not do, and one occurrence
  does not show which of the six pays; the operator's word was "later".
  Useful when the same sequence failure recurs or the operator names one.
- **Gates that survive sleep; a failed diagnostic read ending a wait**
  (D103, D100). One occurrence each, the first with a hand-held assertion,
  the second with its cause now kept. Useful on recurrence.
- **Spawned helpers as evidence sources** (D095, rule 1). Declined: the
  editions bind import closures and hand-registered loads; a spawned script
  is covered by the machinery suites that declare it.
- **The cold-start route** (D095, rule 2). Settled by one sentence, not an
  order: the meter reads a breach as an advisory, so the route is
  implementable as written; the four acceptances stay as records.
- **The remaining churn item** (D083). WO-233 took four of five; the fifth
  waits for a measurement that names DotLn's churn as the cause.
- **An instance-declared title convention** (the fork's item 9). Declined:
  both forms are core's; a declaration would exist only to refuse one.
- **No order for the fork's item 2's rendering** (a carry-in on WO-237) and
  **none for item 5** (answered; a carry-in on WO-238). Useful when WO-237
  or WO-238 activates without them.
- **WO-247 second, not first.** Reason: WO-240 is a one-day order the
  operator placed first the day before for the clone; "immediate" is
  satisfied by filing now and running next. Useful on the operator's edit.
- **The meter's two reopen candidates.** Reason: the cold-start series
  rises because each closed order added reviewed rules to the roots under
  product 07's route, which boards an overrun and cuts no rule, and WO-238
  (sixth) splits product 07 by reader, which is the structural answer; the
  thirteen guard refusals are WO-192's sessions meeting the hook during its
  130-hour implementation, whose process-recovery note names the behaviour
  and whose returns WO-247 and the map's candidate 4 carry. Evidence: `npm
  run meta` of 2026-10-31. Useful when the executor root exceeds its
  accepted ceiling, or an order after WO-247 records more guard refusals
  than WO-192's thirteen.
- **No fable worker, and the reviewers on Codex.** The dispatch line names
  no fable worker, so the refuter is the default `dotln-worker`; the
  operator's mid-turn direction put the three reviewers on Codex as `codex
  exec` workers at the Codex pin, the closest form this host can launch to
  the Codex `spawn_agent` the role text names. Useful on the operator's
  word for either.
- **The reviewers' remark that WO-247 second is a priority assumption, not
  a dependency.** Recorded as read: the Design improver found no technical
  dependency imposing WO-240 first; the placement stays the pass's reading
  of two operator priorities, and the operator's edit settles it.

## Sequence

WO-192 (v0.104.0) left the list as closed. WO-240 stays first (small; the
clone waits on it); WO-247 second (the operator's immediate follow-up);
WO-237 third (small and live; it now carries the `plan start` bound);
WO-245 fourth (small; the operator's item 1; the fork's quality pass waits
on it); WO-248 fifth (small; visible on every pull request); WO-238 sixth
(after WO-245 moved the guide it edits); WO-241 seventh; WO-242 eighth (its
router step lands against the merged router); WO-243 ninth; WO-244 tenth;
WO-246 eleventh (after WO-244, whose `gh` judgment it extends; a working
route exists today); then WO-083, WO-207, WO-193, WO-183, WO-088, WO-091,
WO-096, WO-014. Serial order stays the operator's direction of 2026-10-13;
the rules and the Focus are unchanged.

## Write-backs and ceilings

- Product 03 §Platform and instance boundary: the seeds sentence gains
  WO-245's planned change (the client README's guide into `docs/KIT.md`;
  `README.md` a seed rewritten only while it equals a prior rendering),
  linked to this document.
- Product 06: the rung after v0.104.0 names WO-240, WO-247, WO-245, WO-248,
  WO-241, WO-242, WO-243 and WO-246; the release table regenerated with
  v0.104.0 (`npm run release -- list --markdown --write`).
- Product 07 §Discipline, the cold-start route: the four acceptances
  recorded after the 2026-10-05 direction stay as records, the meter reads
  a breach as an advisory and the latest acceptance as the effective
  ceiling, and no further acceptance is recorded (WO-192-D095).
- The sequence, the map (four catalog rows; the WO-240, WO-241, WO-242,
  WO-243, WO-244, WO-237, WO-238 and WO-207 rows; one dated rationale
  paragraph; the candidates section of 2026-10-31), the idea ledger's
  registration, `docs/control/doc-ceilings.json`.
- Product 07 §Paired passes and the synthesis pass: the three planning
  routes (the operator's fourth message), with this pass as the reviewed
  route's first run and WO-244 as its carrier.
- No product document states WO-192 as active; product 12's router sentence
  (187) already reads as built.

Ceilings, reset to measured non-exempt bytes plus one tenth, citing this
document (product 07's rise since 2026-10-30 is WO-192's write-backs at v0.104.0
plus this pass's two paragraphs):

| Document | Non-exempt bytes | Ceiling before this pass | Ceiling now |
| --- | --- | --- | --- |
| 00-vision.md | 28208 | 31029 | 31029 |
| 01-principles.md | 9462 | 10409 | 10409 |
| 02-domain-model.md | 150031 | 165035 | 165035 |
| 03-architecture.md | 190676 | 209426 | 209744 |
| 04-interfaces.md | 67351 | 74087 | 74087 |
| 05-pattern-library.md | 137089 | 150495 | 150798 |
| 06-roadmap.md | 42366 | 46309 | 46603 |
| 07-execution-guide.md | 301890 | 320379 | 332079 |
| 08-publication-compiler.md | 27245 | 29970 | 29970 |
| 09-audit-resilience-privacy.md | 53441 | 58786 | 58786 |
| 10-ir-compatibility.md | 25787 | 28366 | 28366 |
| 11-proteino.md | 2058 | 2264 | 2264 |
| 11-protino.md | 30626 | 33689 | 33689 |
| 12-workstream-application.md | 27401 | 30142 | 30142 |
| 13-uifa-roles.md | 27084 | 29793 | 29793 |
| feature-configuration.md | 5068 | 5522 | 5575 |

## Answers to the fork (paste-ready)

This section is the pass's own choice, as product 07 §Operator-opened
planning pass precondition 5 asks for a paste-ready block.

```text
Answers from core's planning pass of 2026-10-31 (docs/planning/kit-guide-home-fork-block-and-drive-returns-2026-10-31.md) to the DotLn-Enterprise-Starter fork's block of its second pass of 2026-10-30 on starter v0.103.1. Read each against the record it names. Core's queue after this pass: WO-240, WO-247, WO-237, WO-245, WO-248, WO-238, WO-241, WO-242, WO-243, WO-244, WO-246, then the rest.

1. Recorded. README.md carried again is evidence on core's row FUP-b44117f7b047e976, whose README half now belongs to WO-245 (fourth in core's queue): the kit's guide moves to docs/KIT.md, a manifest-listed kit file every update carries, and README.md becomes a short seed the starter refresh rewrites only while it still equals a prior rendering and never refuses on; the release that carries it rewrites your README.md once more through the merge (no conflict while you have not edited it), and from then on your page is yours. If you edit README.md before taking that release you meet one merge conflict on it; keep yours. A kit root's release prepare and close also admit a page without the release block. Blocks nothing; your WO-025 can keep its exclusion until that release and drop it after.
2. Recorded; nothing asked. Your acceptance and core's own (WO-192, 2026-10-30, wallClockMs unlimited, no stop) both precede any stop; core's row FUP-632348a91b2ae9d8 stays deferred until the first stop row. The null ceiling in plan failures is a defect: WO-237 (third in core's queue) renders it as unlimited in the feed and the start block.
3. Recorded; nothing asked.
4. Recorded; nothing asked.
5. Answered. An order whose steps run the quality pass: procedure over named documents is within the command's intent: the command authorizes the edits a session makes and creates no event, and an order's criteria judge the same edits under the order's authority, so nothing about the procedure changes inside an order. The per-document record (what changed, needed no change, unresolved facts) is the order's evidence today, which is the right place for a dated account; a kit shape the document gate or plan documents could read is WO-238's decision at activation (sixth in core's queue), which now carries your question as a carry-in and will read your docs/evidence/WO-025/census.md as the first sample. Nothing to wait for.
6. Filed: WO-246 (eleventh in core's queue) carries (a) one helper with two doors, npm run plan -- publish and launchpad update --publish, that lints the title and body, pushes and opens the pull request on the repository origin names, as the target publish does; (b) a hook refusal of gh pr and gh issue commands naming no repository in a clone whose origin and upstream remotes differ and whose gh default is unset, naming -R <origin> in the message; and (c) the guide sentence naming -R <fork> or gh repo set-default for any raw gh a session still spells. A convenience with a working route today (your C5, gh repo set-default); your operator-record rule stands until the release that carries it.
7. Recorded; see item 1.
8. Recorded; nothing asked. Evidence that the refusal and its message sufficed.
9. Filed in WO-246: the pr-title kind admits a gitmoji and a subject with no conventional type, the commit kind stays conventional, so your workflow and its type can go when the release that carries WO-246 lands (your C6). An instance-declared convention is declined: both forms are core's own, and a declaration would exist only to refuse one of them; reopen if you want to refuse a form.

One item of core's own for your next pass to read: the pull-request process table your operator showed core on 2026-10-31 (your WO-025 body; core's #258 reads the same) is WO-248 (fifth in core's queue): one table for the order under review, one value per cell, unknown spelled out, the previous-order comparison as a labelled sentence. Until it lands the table is what it is.
```

## Process cost

Model and effort: Fable 5.1 at `max`, operator-selected (`CLAUDE_EFFORT=max`;
the `/model` line). Subagents: budget 20 (`docs/control/budgets.json`
`subagentCap`); plan one, the refuter (`dotln-worker`, claude-opus-5-5 at
xhigh; the dispatch names no fable worker); the three reviewers the
operator asked for mid-turn ran as `codex exec` processes under the bounded
wrapper, not as Agent-tool spawns, so they count as three external worker
launches on the operator's direction and not against the cap; none other
spawned. Usage at entry: unknown (`harness usage` refused: no active role).
`plan conditions` ran 57.3 s at entry. The three reviewers, launched at
16:14:10Z to 16:14:11Z in parallel as `codex exec -m gpt-6.1-sol -c
model_reasoning_effort="max" -s read-only` with the briefs from the ignored
lane, took 4 min 5 s (the design improver, 16:18:15Z), 4 min 33 s (the
criteria adversary, 16:18:43Z) and 6 min 2 s (the consistency reviewer,
16:20:13Z); their dollars are unobserved (Codex reports none to a
non-interactive caller). The refuter, one fresh `dotln-worker` (claude-opus-5-5 at xhigh by the
pin; the worker took no host readback), was dispatched at 16:35:14Z and
handed back at 16:45:04Z (9 min 50 s; 188,792 tokens by the host's task
usage, 17 tool uses, all reads of the prompt file); the receipt helper
measured dispatch to file at 15 min 8 s (908,243 ms), the difference being
the statement's formatting repair by the same worker (one absolute path,
4 s) and the parent's filing. The reviewed route's whole cost this pass:
three Codex workers of 4 to 6 minutes in parallel, about 35 minutes of the
parent's integration, and the refuter; the refuter's twenty-two known
issues overlap the reviewers' fifteen findings in two places (the identity's
source bytes; the two election homes), which is the first evidence the
route's benefit measure can read.

## Validation

Recorded in order as the pass ran them; the figures after the commit are
appended when observed.

- `npm run plan -- start kit-guide-home-fork-block-and-drive-returns`:
  refused ("the plan start block exceeds 1 KB"); diagnosed above; the
  branch and skeleton by hand.
- `npm run plan -- followups --sync`: 16 rows minted (revision
  `e459898c0436b76fb2e6ca82f392cbd13e5196c3315644dc8330756322404a95`);
  `--apply`: the first attempt refused "FUP-cdc7ecfe682c3cb4: invalid
  disposition targets" (a duplicate names its original in `targets`) and
  wrote nothing; the second took 48 dispositions, leaving revision
  `40a4290181b3e563c1aaf8731f235c85ce27ff2c68e66a350878c65c11a7accc`.
- `npm run release -- list --markdown --write`: product 06's table
  regenerated from 192 tags (v0.104.0 added).
- `docs/control/doc-ceilings.json`: written from `productContent`'s
  measurement (the lane's `measure-ceilings.mjs`); the table above.
- `npm run work-orders -- index`: `README.md` and `HISTORY.md` regenerated.
- `npm run plan -- followups --touching WO-245 WO-246 WO-247 WO-248 WO-237
  WO-238 WO-242 WO-207`: 13 pending rows over two pages, each either
  disposed in this pass's batch (FUP-02446577ce028d06, FUP-c37140a5fcecf75d,
  FUP-2fba42ccede44337, FUP-c713e7e97964d316, FUP-dfde4050da06d43b,
  FUP-f1376b4ce25342bb, FUP-75d361f43a699228) or left with its unmet
  condition (FUP-04e9da194ae081ea, FUP-0c94d7b976fbca60,
  FUP-1266034ceacdfa65, FUP-b531e850b70f6d4e, FUP-c95ee836d6dcea16,
  FUP-ca71e4b11b7779a3: WO-207's and WO-238's rows and WO-242's per-order
  header, matched by name only).
- `npm run meta`: green; the trap meter's two reopen candidates read in
  §Readings and disposed in §NoOps.
- `node scripts/docs-check.mjs`: PASS, 0 failures, 16 product documents;
  82 operator-word advisories, of which this pass's own attributed phrases
  were given their capture digests before the commit.
- `npm run format`: 19 changed files unchanged by prettier beyond this
  pass's own edits.
- `npm run test:docs`, first run: stopped at the entropy task on two stale
  publication editions and the lineage index (the product and ledger edits
  staled their source locks); `npm run sync` regenerated them (`publication`
  regenerated; the lineage index rewritten); the second run read 25 passed
  and 2 failed in 0 h 2 min: the planning receipt and the cost table, which
  the commit and `npm run meta -- --plan-cost` supply, as the 2026-10-30
  pass's first run did.
- The three reviewers (the operator's first and second mid-turn messages):
  launched after the first commit (`30119b4d`; the subject at `858196d7`
  with the cost table), each a `codex exec` worker at the Codex pin in a
  read-only sandbox with a shared brief and its role's brief
  (`docs/control/local/planning-2026-10-31/brief-*.md`), reports in
  `review-criteria.md`, `review-design.md` and `review-consistency.md` of
  the same lane. `self-review: found 20 (15 distinct); fixed 15; recorded
  0`. The design improver's five: later orders still writing into the frozen
  README seed (WO-241, WO-242; also WO-243, WO-207), the helper's
  partial-success recovery (WO-246), the worker-tree identity against the
  authoring checkout's (WO-247), the election's Codex interpretation
  (WO-247), and the comparison's reference when several orders are open
  (WO-248): all five taken. The criteria adversary's seven: a local-path
  origin cannot pass `parseGitHubTarget` (high; WO-246 and WO-247 now keep a
  GitHub-shaped identity on an unresolvable host), the renderer's subject
  (WO-248), the completion consumer misnamed (`executor-readiness.mjs` has
  no such check; `requireGateClaims` in `handoff-ledger.mjs` is the path),
  the missing replayable controls for the three reproduced defects, the gh
  page uncited, the gap sentence contradicted by the hook's existing `gh pr`
  parse (1807; 2027 to 2029), and criterion 6's five-for-six: all seven
  taken. The consistency reviewer's eight: four duplicates of the above,
  the target publish linting one title as both `commit` and `pr-title`
  (WO-246 now lints it as `pr-title` only), WO-238's missing edge to WO-245
  (added), seven catalog placement phrases of open orders stale since
  earlier passes (refreshed), and WO-245's refusal citation (183 to 188 is
  the provenance check; the refusal is at 206 to 209; corrected). It also
  confirmed the register batch, the digests, the ceilings table, the
  dependency relations, the sequence agreement and the generated pages, and
  named what it did not search (sibling repositories, host pages, the code
  suites).
- The operator's fourth message, received while the reviews ran: WO-244,
  product 07, the ledger, the map and the sequence amended for the reviewed
  route; this document's dispatch table carries the row.
- `npm run plan -- refute` at `d45f174e` (the integrated subject;
  scope `pass`: WO-247, WO-245, WO-248, WO-238, WO-241, WO-242, WO-243,
  WO-244, WO-246; ten carried identities); one fresh `dotln-worker`
  returned `aligned-with-findings` for all nine orders, twenty-two known
  issues, no observed failure, no vision contradiction and no hold. The
  worker read the pretty-printed prompt file in pages (the one-line form is
  too long for a paged read) and nothing else; its statement was repaired
  once by the same worker for one private absolute path, which the receipt
  screen refused, without rerolling the judgment.
- `npm run plan -- receipt` filed
  `docs/planning/refutations/2026-10-31-planning-03d7c0f510c9a398-061.md`
  (worker type `dotln-worker`; judged, committed and workspace subjects
  equal at `sha256:af496f6a…`; no advisory) and committed the pair.
- Receipt 061's twenty-two known issues are recorded on the nine orders'
  catalog rows with the planner's readings, for the activating passes and
  the executors; the ones that cross orders (WO-238's product 07 split
  against the later orders' write-backs; the README removal credited to
  WO-245 alone; WO-247's election joining WO-241's registry; WO-242's router
  stop against WO-247's changed router) are the next pass's sequence reading
  as much as any order's.
- `npm run meta`, `npm run format` and `npm run test:docs` after the
  receipt: recorded below.
- After the receipt: `npm run meta` green; `npm run format` changed nothing beyond this pass's edits; `npm run test:docs` read 27 passed and 0 failed in 0 h 2 min at the committed subject plus this record, which this commit carries; the branch is pushed and its `:memo:` pull request opened on the dispatch's authorization, never merged.
