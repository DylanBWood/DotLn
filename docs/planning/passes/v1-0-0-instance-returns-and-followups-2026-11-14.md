# An instance's returns on v1.0.0 and the follow-ups WO-276 left — 2026-11-14

## Dispatch and capture

The operator opened this pass on 2026-11-14 with a `planning:` line asking
for a standard pass that also takes up the follow-ups left over and the
entries an instance had written for core, followed by one pasted block. The
prompt hook journaled the message at 23:21:12Z (class direction, 6,694
bytes, digest
`90a23f1bbae9b79f3c760f130d682a0bf463281b37ab7c81d46eace1b1507603`). The
operator's own words are captured in ignored intake at
`docs/intake/planning-dispatch-2026-11-14-v1-0-0-instance-returns-and-followups.md`
(SHA-256 `cc86504027b51c2279c2b6be2678134ac8a006195dd01070ec8808fc89b38384`
as first written; the journal's row was appended to it afterwards).

The pasted block was written by an instance's planning pass on kit
`v1.0.0` as five entries of its `FOR-CORE.md`, not by the operator. It is
kept whole in the ignored local planning lane at
`docs/control/local/plan/instance-block-2026-11-14-standard-pass-v1-0-0.md`
(SHA-256 `47405c827aa3287adba12e61afbce893ba5834860747ba49aa87b2e5f9cc2655`).
Each entry says it does not stop the instance's next order and names the
route the instance used. Per product 07 they are evidence the operator
carried, never operator direction; this document paraphrases them.

During the pass the operator sent nineteen more messages, each captured
beside the dispatch with `-midturn-N` and journaled by the prompt hook. In
paraphrase, with each journal digest's first twelve characters:

1. Remove WO-275's branch and worktree, absorbed by WO-276, and keep
   nothing of them (`d3cf83b22fd1`).
2. Setting up the enterprise starter on the work laptop, the operator could
   not find the list of commands that brings an instance up; the kit guide
   reads as machine-made filler past its first commands (`845b95bdf75f`).
3. The guide is unusable for a person; acceptable only if its reader is an
   agent (`5a972f912507`).
4. The 2026-11-07 pass's section of commands is the form the operator
   liked; where is its equivalent; one pasted block from that section
   (`3a2647d3cc59`; the block kept in the ignored local planning lane, SHA-256
   `bb46952290d4cd0a30c245b5ed59eb99e5be3f86bf0eaeef645bea581c704a57`).
5. Can a planning session start without the private terms list, or are
   the instructions, and this session's answer, wrong (`525c43760cbd`).
6. to 10. The commands belong in a document in the starter, not in chat or
   only in a planning document; this session had misread the question; this
   is a planning pass (`8e63070ff3fb`, `ce7ca4c66ef8`, `56a4171a87b5`,
   `77946b315584`, `b6739c4a1cdc`).
11. Launch a meta critic on GPT-6 for this pass as WO-276 did; codify the
    critic with any model and effort, Opus 5.5 at xhigh by default so it runs
    on the work laptop; and what became of WO-276's list of critic findings
    (`7e7917015180`).
12. A pass over the public documents was expected to have made them
    readable; a document that reads as machine-made filler is of no use
    (`7f517c7a2778`).
13. and 14. One pasted paragraph of the guide (761 words; kept whole, SHA-256
    `2be8e29438e4af58ddb640f9c6b01992bea3a1b0df03bfa7beed42c14795c2bc`): the
    symptom runs through many Markdown files, and nobody will read it
    (`c0b32990c5b7`, `4904464024e9`).
15. Was a `quality pass:` not already run and codified (`29397d3e1719`).
16. Length is not bad where a document is easy to follow and well
    formatted; brevity is better (`594d86684f5f`).
17. Length alone is a smell; the pasted paragraph is to be changed
    (`905dbfdbdb62`).
18. The critic is not to run by default: on request, or configurable
    through the configuration the kit has (`84e8b237fba5`).
19. The operator is setting up the work instance now; why wait for orders
    to get the page (`d730afd6e446`).

The pass ran in Claude Code on `claude-opus-5-5` at `max` (the operator's
`/model` selection at the start of the session; effort read from
`CLAUDE_EFFORT`), on branch
`planning/2026-11-14-v1-0-0-instance-returns-and-followups`, opened by
`plan start` from clean `main` at `ed66a822c` (v1.0.0, WO-276's merge).
`FOR-CORE.md` does not exist in core, and no GitHub issue is open on the
repository (`gh issue list --repo DylanBWood/DotLn --state open` returned an
empty list).

## Readings

### The operator's next cycle on the work laptop: the commands

The operator asked during this pass for the v1.0.0 equivalent of the
2026-11-07 pass's section of the same name
([that section](first-cycle-returns-and-host-elections-2026-11-07.md#the-operators-next-cycle-the-commands)),
while setting up the enterprise starter on the work laptop, and found the
kit's own page leaves out a step (mid-turn messages 2 to 5 below). This is
that section for the starter as published at `cd8ea69` (v1.0.0, refreshed
2026-11-14), read from the starter's kit guide (§First steps, §Features,
§Taking upstream updates) and checked against its files: the lineage index
is seeded, `docs/control/doc-ceilings.json` is gone, `WO-001` is the only
entry of its sequence, `scripts/kit/terms.example.txt` ships, and a clone
runs Claude Code alone.

1. **A private instance from the starter** (once per instance):

   ```sh
   gh repo create <org>/<name> --private
   git clone --no-tags https://github.com/DylanBWood/DotLn-Enterprise-Starter.git <name>
   cd <name>
   node scripts/doctor.mjs
   git remote rename origin upstream
   git config remote.upstream.tagOpt --no-tags
   git remote add origin <private url>
   git push -u origin main
   node scripts/bootstrap.mjs
   node scripts/harness.mjs check
   ```

   `doctor` prints one row for each thing the kit needs of the machine
   (Node 24.15 or later, or Node 26; Git 2.31.0 or later; a C compiler;
   `gh` signed in; merge commits allowed on the new repository) and
   refuses nothing, so read its rows. `harness check` ends with
   `local-terms list: unavailable` until step 2.

2. **The private terms list**, before any session publishes (Git ignores
   the file; the kit guide's First steps, step 4):

   ```sh
   mkdir -p docs/control/local
   cp scripts/kit/terms.example.txt docs/control/local/terms.txt
   ```

   Replace the example's entries: under `refuse:` every name that must
   never reach a commit (the employer, its codenames, internal hosts,
   people), under `context:` names that are also ordinary words, one a
   line. Then:

   ```sh
   npm run terms -- check CLAUDE.md README.md
   ```

   It prints `local-terms list: present; entries: N refuse, M context; …`.
   With no list, every publish refuses, a planning pass's pull request
   among them. At v1.0.0 no setup commit follows: the starter carries the
   lineage index and no retired ceilings file, which the 2026-11-07
   section's lines made by hand until WO-258.

3. **Hosts**, only if this instance uses more than Claude Code: add
   `"features": { "host-codex": true }` to `dotln.config.json`, run
   `node scripts/harness.mjs emit`, commit and push.

4. **WO-001**, environment truth, already the starter's only sequence
   entry, so it needs no planning pass before it. From clean `main`:

   ```sh
   npm run worktree -- start WO-001 docs/work-orders/WO-001-environment-truth.md
   ```

   Open Claude Code in the sibling folder it creates (`<name>-wo001`) and
   type `resume: next`; the session runs `npm run resume -- status` and
   `npm run meta` itself. Then `resume: verify` and `resume: final review`,
   each typed in a fresh session there when the phase before it has
   finished, or `drive: WO-001` typed in `main`, which runs the phases in
   fresh sessions until your merge. Merge its pull request with a merge
   commit, then type `resume: release close` in a session in `main`.

5. **The first planning pass**: in a session in clean `main`, type
   `planning: first pass` as a message of its own. It files the
   instance's next orders and sequence, refutes them with one background
   worker and opens a pull request you merge with a merge commit.

6. **The application repository**: that pass files its registration
   order (the repository under `repositories` in `dotln.config.json`, its
   profile, its outward vocabulary and the operator's grant, from the
   values you state). Ask for `"records": "instance"`, so that no order's
   record is committed into the team's repository. Merge it before any
   target order; its executor records the clone with
   `npm run worktree -- clone <id> <absolute path>`.

7. **Taking a core release**, on your word in a plain session in `main`,
   never in a planning pass; read the release's Read before upgrading
   first:

   ```sh
   git fetch --no-tags upstream
   git worktree add --detach .runtime/upstream-preview upstream/main
   node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main
   git worktree remove .runtime/upstream-preview
   git switch -c chore/starter-update
   git merge upstream/main
   ```

   If the merge stops on `.claude/harness-manifest.json`, keep this
   instance's side, which the emit rewrites (the instance's route of
   2026-11-14; the guide does not say so until WO-277):

   ```sh
   git checkout main -- .claude/harness-manifest.json
   node scripts/harness.mjs emit
   node scripts/lineage.mjs index
   npm run sync
   git add -A
   git commit -m "Take the starter update"
   node scripts/launchpad.mjs update --publish --from upstream/main --title "<title>" --body-file <path>
   ```

   Merge that pull request with a merge commit, then:

   ```sh
   git switch main
   node scripts/launchpad.mjs update --finish
   ```

8. **Telling core**: read `FOR-CORE.md`, which the instance's final
   reviews and planning passes write, and carry the entries you choose
   into a core `planning:` message.

This section is the model for the starter's own page: WO-277 brings
`docs/OPERATOR.md`, which every starter ships, to it, every step with a
paragraph on what it does and what to do when it fails, in a release the
operator can run as soon as this pass merges.

### What failed since the last receipt

`npm run plan -- failures` since receipt 068 (2026-11-10T16:25Z): 61 items,
all of WO-276.

- Five failed verifications (VER-001 to VER-004 and VER-006) and one failed
  final review (FINAL-001), each answered by a repair inside the order;
  VER-007 and FINAL-002 passed, and WO-276 closed as v1.0.0 on 2026-11-14.
- 89 escapes over its two final reviews (71 and 18); 28 corrections; 9
  amendments; 7 bound acceptances.
- Three criteria recorded defective, each class contradiction (51, 121 and
  123; `docs/evidence/WO-276/verifier-001/criterion-contradictions.json`).
  Read again against the five classes of product 07: 51 and 123 left no gap
  (each behavior was delivered in the form the verifier checked); 121
  leaves one, a shell command under the tool names `Monitor`, `write_stdin`
  and `functions.exec` is not inspected for attribution (a NoOp below).
- Paired rounds: one order, two rounds; its first verification failed.

The causes those reports name were routed in WO-276's own decisions; what
its repairs and close left for planning is the register's 73 untriaged
rows, read below.

### WO-276's close and WO-275's worktree

- Canonical status: WO-276 `closed`, stop reason `released`. It leaves the
  sequence. WO-261 to WO-275 are superseded by it and settled.
- WO-275's worktree `../DotLn-wo275` and branch `wo-275` were removed on
  the operator's word with nothing kept. Checked first: 224 uncommitted
  changes (WO-275's abandoned work), the branch tip `80227e2fb` already in
  `main`'s history, no remote branch, its writer reservation held by a dead
  process, no host rule naming it. Run: `git worktree remove --force` and
  `git branch -d wo-275`. Three older recovery refs under
  `refs/dotln/checkpoint/WO-275/` remain; whether to remove them is the
  operator's call, asked in this pass's report.

### The serial rule has run its course

The sequence held core to one order at a time "for the next thirty orders
from 2026-10-13", reopening when the thirtieth closed. The roadmap's release
table lists 48 releases after 2026-10-13, and v1.0.0 makes 49; no pass
re-disposed the rule when the count passed thirty. This pass does: the
lane-pair rule of 2026-09-16 governs again, and a pair runs side by side
only on the operator's word. WO-277 (delivery) and WO-280 (machinery) would
qualify (disjoint surfaces, no hard edge); they are listed one after the
other.

### The instance's five entries, read against the code

Each was checked at the file it names; all five hold.

1. **The harness manifest on an update merge.** `emitHarness` reads
   ownership from the manifest on disk (`scripts/lib/harness.mjs` 497 to
   510), so a merge that took the starter's Claude-only manifest makes the
   instance's own `.codex/` files read as unowned. The guide's update
   section never says which side a conflict keeps, and its sentence that a
   Codex instance sees `remove` rows "in the merge" is false once the starter
   is Claude-only (WO-258-D004's reopening condition). WO-282; WO-277's
   page carries the route until it lands.
2. **Register rows re-keyed by the new reader.** A candidate's key hashes
   its bold title (`scripts/lib/planning-followups.mjs` 285 to 290); its
   body and `source.hash` do not depend on the title, so a sync can match
   the two rows. WO-276-D059 carried two such rows by hand in core; its
   reopening condition is this entry. WO-282.
3. **`--keep-going` and the target gate.** The executor's root (from
   `contributor.ts` 932), product 07 and the guide name it after any failed
   complete run; `scripts/target-gate.mjs` refuses it and already runs
   every command. Wording only. WO-278.
4. **An Items table after one sentence.** `tableUnder`
   (`scripts/lib/review-worker.mjs` 1189 to 1210) takes only the block
   straight after the heading; a scratch call reproduced the refusal. The
   instance's second ask, a refused report restated by the worker the helper
   launched, is FUP-fddba57354445514, deferred again (NoOps). WO-278.
5. **A core-only suite probed in an instance.** `lineage-fixtures` is
   `core-only` (`scripts/test-runner.mjs` 826 to 830); in a kit root the
   gates run no `node --test` file at all, and nothing tells a worker. The
   bounded wrapper can say so cheaply. WO-278.

### The follow-ups WO-276 left

The register held 341 pending rows at entry: 73 untriaged (all but one
written by WO-276's decisions), one needing review (FUP-0126) and 267
deferred. This pass disposed all 75 open rows and re-disposed 30 deferred
rows, 105 dispositions applied in one batch (register revision
`9eaf088c54c2`):

- 25 settled: 19 decisions that name no action ("No new follow-up" or
  "None"), two repairs WO-276 made inside its repairs (D136, D108), D163
  (items taken by the repair of FINAL-001, item 8 done by this pass), and
  three deferred rows whose need is met (FUP-dec74be4077f5f25,
  FUP-5d31b4cd52b01f51, FUP-632348a91b2ae9d8).
- 23 allocated to the orders filed here and to WO-244; four of them were
  retargeted from WO-277 to WO-282 when the two were split (register
  revision `78b8592d3747`).
- 46 deferred with their conditions, among them the fired rows below.
- 9 declined: rows `followups --touching` listed for a filed order's files
  that the order does not change.
- 2 duplicates.

Five research workers read the seams before the orders were written, one
each for the update path, the review helper, worker kinds and the critic,
the discovery timeout, and the deferred rows' conditions; their reports are
in session scratch and their facts are cited in the orders.

### The critics' record (WO-276-D111, D113, D115)

The operator asked what became of WO-276's critic findings. They are
`docs/evidence/WO-276/critic/criticisms.md`: 152 points from 41 critics,
139 accepted points of conduct in sixteen classes. WO-276 turned the record
into register rows, not one row per finding: D111 (mine it), D113 (weigh
the critics before and after the thirtieth launch apart), D110 and D115 (the
critic as a kind the kit launches; perhaps two critics). They sat untriaged
because no pass ran between WO-276's close and this one.

Each class, its disposition and the side of the thirtieth launch it rests on
("before" is critics 1 to 29, briefed by the executor; "after" is critics 30
to 43, under the fixed charter):

| Class (accepted before / after) | Disposition | Rests on |
| --- | --- | --- |
| A recovery record stale or self-contradicting (16 / 5) | A check a command makes: WO-279's advisory naming a standing file written before the order's newest gate row or event | Both sides; four of the twelve later critics, after a rule existed |
| An hours forecast that does not add up (16 / 0) | Nothing now: forecasts are prose; a check needs a typed forecast, which the briefed critic of D115 would read | Before only |
| Checks and runs chosen or timed poorly (12 / 3) | Nothing new: WO-276's Parts D and E and the preflight advisory carry its main forms; the rest are judgments | Both, mostly before |
| A result claimed before its observation (8 / 9) | Nothing new: the handoff already binds checks to gate rows; the rest is prose a check cannot read, which the critic itself (WO-279) watches | Both, leads after |
| A round or gate started with work unfinished (5 / 3) | Nothing new: a formatting fix after a round takes no round (product 07); the rest is judgment | Both |
| A change checked against too few consumers (7 / 1) | Nothing new: the consistency reviewer's traced-consumers table is the mechanism | Mostly before |
| A timed comparison not held to one difference (7 / 0) | Nothing | Before only |
| Worker cadence and budget handled loosely (6 / 2) | A check: WO-279's cadence where an instance turns it on, and its counted launches | Both |
| Settling what is the operator's or the host's (6 / 0) | Nothing new: the role text already carries it | Before only |
| A record's figure or order not matching its observation (2 / 5) | Nothing new: the worker launch records the host's reported model; the rest is prose | Leads after |
| A heuristic repaired one case at a time (5 / 0) | Nothing | Before only |
| Coverage claimed beyond what a test shows (4 / 3) | Nothing new: product 07's control rule for a settling case stands | Both |
| A worker given premises it should not rely on (1 / 5) | A check: WO-279's kit-rendered brief, which the executor writes nothing into | Leads after |
| A known defect deferred for a reason that does not hold (4 / 0) | Nothing | Before only |
| An as-built record filed before its gates (1 / 1) | Nothing new: close to the result-before-observation class | Both |
| A question handed to the operator that was the executor's (0 / 2) | Nothing new: the role text says to settle what is within authority | After only |

D115's second row, a briefed critic of plan and cost, waits for the
operator's word, its own reopening condition.

### Deferred rows whose conditions occurred

A research worker read 49 deferred rows whose conditions name an order's
event against WO-276's change (`0097fcac6..ed66a822c`): 11 fired, 2
unknown, 36 not. Each fired row is re-disposed in the batch:
FUP-23aca17371cf7b86 and FUP-45b8ce20b8b764d0 allocated (WO-279, WO-278);
FUP-261c99c30cd0bd6d allocated to WO-244, which built its ask before it was
parked; FUP-5041854090e212ca and FUP-82ea384c08d3135a deferred with
corrected paths (no instance elects plan-first yet); FUP-e1cc0a62d60b3f2a
deferred with WO-276-D106's reading as its baseline; FUP-048618f9ee2eb349,
FUP-914cd6b111dcac5d, FUP-c713e7e97964d316 and FUP-c95ee836d6dcea16
deferred on sharper conditions; FUP-2fba42ccede44337 a duplicate of
FUP-c713. Three conditions that could never occur (they named superseded
orders, or a spent clause) are rewritten.

### The documents a person reads

The operator found the kit guide unusable for a person, pointed at one
761-word paragraph of it, and expected a readability pass to have happened.
The record:

- `quality pass: <target>` was codified by WO-235 (v0.103.0). No prompt
  journal since 2026-11-01 holds that prefix (the boundary: this checkout's
  live and retained journal lanes); no pass or order records a run over the
  guide.
- Every role's text already asks to judge a passage by what its reader can
  understand and to rewrite or split accumulated prose. The guide shows
  those rules unapplied; nothing checks them, and the final reviewer's
  reading of a changed standing document judges dated accounts, not
  whether a reader can follow it.

WO-281 takes it: the guide rewritten, the pasted paragraph first, and the
gate and the final reviewer holding later write-backs to the rule.

### Critic 1 on this pass

At the operator's request, one meta critic ran on this pass as WO-276's
did: the kept charter, adapted to a planning subject, on `astra`
(`gpt-6-astra` at `max`), launched by a scratch copy of WO-276's launcher,
since the kit has no command for it (WO-279 builds one), 14 minutes, its
report in the ignored reviews lane. Before the launch the session's six
transcript files were screened against the private list, counts only: 0
refuse-class and 0 context-class lines.

Its report reached the operator whole before any answer. Its five points
all hold, and three changed the plan:

1. Instructions given before their prerequisites were traced (the terms
   list). Acknowledged; the commands above trace them.
2. A reversal of WO-277's design argued without evidence. After the
   operator's message 19 the page's fix is cut to ship first: WO-277 keeps
   the generator and its single source and changes only the page's words
   and blocks, a choice made on time (the release the operator is waiting
   for), and the page's form is weighed again in WO-281.
3. A missing rule diagnosed where an existing rule went unapplied. WO-281
   now says the rules already ask for it and builds the gate's listing and
   the reviewer's judgment instead of new wording.
4. A record called settled before it was read, and a question answered
   after housekeeping. Taken as conduct: the search's boundary is now
   stated where this document cites one.
5. Evidence overstated: the guide names `OPERATOR.md` three times (lines
   148, 1059 and 1632), not once. WO-277's gap is corrected.

## Orders filed and amended

Seven orders, one subsystem each. Under the standing rule a pass does not
bundle unrelated subsystems by its own choice; the operator may direct a
merge. The page and the update's repairs were first one order; the
operator's message 19 (setting up the work instance now, why wait for
orders) split them, since the starter changes only at a release close
(`scripts/lib/starter-refresh.mjs` tags the starter with core's release
tag), so the page ships alone and first.

- **WO-277 — The starter's commands page tells a person every step.**
  Documentation only: the private terms list's commands in step 1, a
  paragraph per step on what it does and what to do when it fails, the
  front page leading with the page; a patch release whose close refreshes
  the starter. From the operator's messages 2 to 10 and 19.
- **WO-283 — Planning stops writing a table nobody acts on.** The table of
  past costs each pass writes and hands its review, whose size limit stopped
  this pass, is removed with its command and checks; receipts filed with it
  keep validating. From the operator's direction under override.
- **WO-282 — An update leaves nothing to repair by hand.** The emit keeps an
  instance's own host surfaces; a re-keyed register row keeps its
  dispositions; three update-path repairs; the guide's update section
  corrected. From the instance's entries 1 and 2.
- **WO-279 — A critic of conduct the kit launches when asked.** Kinds as
  data, the critic the first, launched by name through the kit's transport
  on `opus` at `xhigh` unless an instance chooses another; a cadence only
  where an instance turns on `features.critic-cadence` (off by default);
  a counts-only screen of the transcripts before each launch; the kit's own
  check of a stale standing file. From the operator's messages 11 and 18
  and WO-276's critic rows.
- **WO-281 — The kit guide is easy to follow.** The guide and the map
  rewritten, the pasted paragraph first, no fact lost (an inventory proves
  it); the gate lists long paragraphs as a smell; the final reviewer
  returns a passage its reader cannot follow. From the operator's messages
  3 and 12 to 17.
- **WO-278 — The review helper reads a report as written.** A table read
  anywhere in its section; a paired first round launched as one; a probe of
  a core-only suite in a kit root answered, not run; `--keep-going` named
  for the kit's runner alone. From the instance's entries 3 to 5 and
  WO-276-D118.
- **WO-280 — The discovery timeout traced and repaired.** A research and
  repair order on the timeout the operator moved out of WO-276
  (WO-276-D151).

No order was amended. The order numbers are identifiers; the sequence
gives the order of work.

Each order was checked before refutation: every repository path it names
exists or is created by one of its own steps (two new files in WO-279);
each declares `Review ladder: paired`; each criterion was read against the
five defect classes, and `npm run work-orders -- index --check` prints the
advisories read below.

## Register

Read in §The follow-ups WO-276 left and §Deferred rows whose conditions
occurred. Before filing each order the pass ran `npm run plan --
followups --touching` with the files it names and allocated or declined
every row listed. After the batch, the register holds no untriaged and no
needs-review row.

## Red tags

<!-- dotln-red-tags:start -->

```json
{
  "after": "docs/planning/passes/one-order-for-the-whole-queue-2026-11-10.md",
  "tags": []
}
```

<!-- dotln-red-tags:end -->

The census tagged no standing document unbound and unread, and the
2026-11-10 pass's block held none to dispose.

## NoOps

Each declined candidate, with why and what reverses it:

- **Attribution under `Monitor`, `write_stdin` and `functions.exec`**
  (WO-276 criterion 121's uncovered part). Part Q forbade new refusals and
  no commit has carried a trailer through those tools. Reverse when an
  attribution trailer reaches a commit through one of them.
- **A refused report restated by the worker the helper launched**
  (FUP-fddba57354445514). The one refusal on record was the table reader's,
  which WO-278 repairs; restatement needs persisted host sessions and a
  judged transport source. Reverse when, after WO-278, a helper-launched
  report is refused for its form and its round is lost or paid again.
- **The block-opener class** (WO-276-D199). Its repair is the operator's
  choice by that decision, and the census found the class in no committed
  document; this pass's report asks the operator. Reverse on the
  operator's choice or a document found holding the class where a reader
  acts on it.
- **A PreToolUse hook outside the kit's fragment** (WO-276-D074). No
  instance has said it keeps one; the answer below asks. Reverse when an
  instance says it does.
- **The rung's number in WO-183 and WO-083**. Both sit under Not now and
  the pass that reopens either re-cuts it; the standing passages are
  renamed here. Reverse when a pass reopens either.
- **Receipts filed under an earlier reader** (WO-276-D164 F54). A different
  store; no instance's receipt has been refused after an update. Reverse
  on such a refusal.
- **Running `quality pass: docs/KIT.md` in this session.** The guide is
  read by four suites this document-only pass does not run; WO-281 rewrites
  it under its suites. Reverse on the operator's word.
- **A lane pair of WO-277 and WO-280.** Qualifies, but a pair runs side by
  side only on the operator's word.
- **WO-276-D114's eleven other held notes** (runner-mode growth, a package
  manager corpus, the models file's cache order, the doctor's message test,
  a JSDoc comment cut early, the parser's proof by record, the console
  fixtures' two sources, the seed case's forms, the update's per-path Git
  reads, the prompt line's import, the roots' composition by position).
  None is a failure observed. Reverse when the ladder or a complete run
  shows one as a failure.
- **The critics' classes marked "nothing"** in the table above. Reverse
  when the next order's critics or reviews find the class again after the
  line WO-279's critic draws.

## Sequence

WO-276 leaves the list. The seven orders come first, in this order: WO-277,
WO-283, WO-282, WO-279, WO-281, WO-278, WO-280; then the Not now orders as they were. The
"Serial for now" rule is replaced by the lane-pair rule it suspended. WO-207's
and WO-096's Not now entries now state what WO-276 delivered for each.

## Write-backs

- Products 00, 05, 06 and 11, and the map's tracks paragraph: the
  Teammate-ready rung is `v2.0.0` (WO-276-D163 item 8, with WO-276-D073
  linked). The two publication editions' source locks were refreshed
  (`npm run publication:check` passes; neither edition states the rung).
- `docs/planning/sequence.md`: the rules, the orders and the Not now
  entries above.
- `docs/planning/work-order-map.md`: the five orders' catalog rows.
- `docs/planning/followups.json`: the 105 dispositions.

## Rules recorded

<!-- dotln-rules-recorded:start -->

```json
[]
```

<!-- dotln-rules-recorded:end -->

No standing rule entered a standing document from the operator's messages:
their directions on the critic and on documents are the designs of WO-279
and WO-281.

## Answers to the instance (paste-ready)

```text
Answers from core's planning pass of 2026-11-14 to this instance's five entries on v1.0.0. This is a core session's text and no operator direction. None of the five stops your next order; each has the working route you used until the release that carries it.

1. The harness manifest on an update merge. Confirmed: the emit reads ownership from the manifest on disk, so a merge that took the starter's side refuses your own Codex surfaces. Filed as WO-282: the emit admits a .codex file whose bytes equal the hash main's manifest records, the preview says to keep this instance's side of .claude/harness-manifest.json on a conflict, and the guide's sentence about remove rows in the merge is corrected. Until then: git checkout main -- .claude/harness-manifest.json before the emit, as you did; the commands page in WO-277, the next release, carries that route.
2. Register rows re-keyed by the new reader. Confirmed, and core met it for two rows during WO-276. Filed as WO-282: a sync matches a row it retires and a row it creates in the same section with the same body, and carries the dispositions. Rows you already carried by hand stay as you left them.
3. --keep-going and the target gate. Confirmed. Filed as WO-278: the role text, product 07 and the guide say the flag belongs to npm test -- --review and a target order reruns node scripts/target-gate.mjs WO-NNN --review. Your repository profile's sentence is the route until then.
4. The Items table after one sentence. Confirmed and reproduced. Filed as WO-278: a required table is read anywhere in its section, and a split round's merge keeps such a batch. Restating a refused report by the worker the helper launched is deferred: the one refusal on record was the reader's, and restatement needs persisted host sessions. It reopens if, after WO-278, a helper-launched report is refused for its form and its round is lost or paid again.
5. A core-only suite probed in an instance. Confirmed. Filed as WO-278: the bounded wrapper answers a core-only suite in a kit root with the runner's reason and a status of its own instead of running it, and the review brief names the suites the instance carries. An instance's gates run no node --test file.

One question back: does this instance keep a PreToolUse hook of its own outside the kit's settings fragment (in .claude/settings.local.json, user settings or a plugin)? The kit's guards judge a call as asked, and such a hook can rewrite the call that runs; say which, if any, in your next entry.
```

## Process cost

- Model and effort: `claude-opus-5-5` at `max`, the operator's selection
  (effort read from `CLAUDE_EFFORT`).
- Usage: 44,576 total tokens at entry (23:21:15Z); 100,852,213 at 00:35:18Z
  on 2026-11-15 (99,734,447 cached input, 738,795 cache write, 378,513
  output, 458 input); source `claude-transcript-message-usage`, scope
  dispatch, cost unknown. The workers' tokens are not in it.
- Workers, against a cap of 20: five research workers (`dotln-worker`, the
  generated definition's `claude-opus-5-5` at `xhigh`; effective settings
  unverified), 0 h 13 min to 0 h 19 min each and 199,144 to 279,082 tokens;
  one meta critic on `gpt-6-astra` at `max`, 0 h 14 min, tokens unknown; and
  one refuter (below). The hook counted the five research workers; the
  critic's scratch launcher is counted by nothing, the gap WO-279 closes.
- What the time bought: the research workers' seam maps carried the orders'
  line references and suites; the critic found five errors of conduct,
  three of them in the orders as first written. What it did not buy: about
  an hour of the pass went to answering the operator's setup question in
  chat before the answer was understood to belong in the starter.

## Validation

- `npm run test:docs` on the committed subject (`a3cdfaf2b`): every task
  passes but `plan` and `plan-refutation-current`, which fail because the
  pass has no receipt yet.
- The receipt cannot be filed: filing rebuilds the subject with the
  planning cost table, and `npm run meta -- --plan-cost` refuses to write it
  ("exceeds 64 KB"). The table would be 67,334 bytes, of which the
  subject's own fifteen rows are 1,532; the rest is the meter's
  whole-record data, the trap signals (41,786) and the dated acceptances
  (19,035), and the traps cover the last five closed orders, WO-276 among
  them, so every planning pass is refused the same way until five more
  orders close. The bound is code (`scripts/lib/meta.mjs` `PLAN_COST_BYTES`
  and the reader in `scripts/lib/plan-subject.mjs`, pinned by a case in
  `scripts/test-process-debt.mjs`), which a planning branch refuses to
  write; the pass stops here for the operator.
- Cleared on the operator's word. At 03:13Z on 2026-11-15 the operator
  entered `operator override:` with the direction that what is not shown
  useful goes. The cap was judged on its evidence: the table's trap signals
  enter the plan's review prompt, which was already 146 KB, and the cap
  refused a 3 KB overflow with no route but code, stopping every planning
  pass. It was removed, not raised: `scripts/lib/meta.mjs` (`planCostText`
  writes the table whole), `scripts/lib/plan-subject.mjs` (no byte check),
  the case in `scripts/test-process-debt.mjs` (a table past the old cap
  writes whole; the single case passed under the bounded wrapper), and
  product 07's sentence that called the table bounded. The table was then
  written (67,335 bytes). Bypassed under the override: the planning branch's
  refusal of writes outside `docs/` (WO-135), for these three code files
  alone. The real fix, a table that holds only the plan being judged so it
  cannot grow with the record, is a candidate for the next pass.
