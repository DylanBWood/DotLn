# recurring failures and queue drain — 2026-11-03

## Dispatch and capture

Dispatch: `planning: standard planning pass +` with twenty-two items (two
`ideation:` items, an observation on Codex reads, the follow-up queue, the
pull-request sentence, the DotLn-Enterprise-Starter fork's first block of
2026-11-03 on starter v0.112.0, Codex after compaction, fork passes refusing
to push, release close at every pass, agents stopping on questions, passing
remarks recorded as rules, upstream merges forced at fork passes and at an
entropy pass over a sibling, the errors every session logs, GPT 6 Astra at
max for this pass's three reviewers with the adversary given the dispatch,
review rounds persisting across passes, review rechecks that find nothing,
the fork's second block on v0.113.0, a release close over twenty minutes,
temporary data not removed, planning unable to branch beside thousands of
retained fixtures, and WO-241's close blocked), received at
2026-11-03T23:12:27.967Z (prompt-hook time) in Claude Code 2.1.317, Fable
5.1 at `max`, operator-selected (the `/model` line of the session). Two
items were added in the session: 23, a defunct Codex process holding the
main checkout's writer while the hook refused the two recovery commands its
own message named; 24, the operator's `!` command queued ten minutes behind
this agent's turn. Captured verbatim in ignored intake
`docs/intake/planning-dispatch-2026-11-03-recurring-failures.md`, SHA-256
`4c7e47a6548004d909128fdfcc346663fc419280b798d00abec73d7ffb180f83`; the
later mid-turn messages, including the operator's four-option worker rule,
in `docs/intake/planning-dispatch-2026-11-03-recurring-failures-midturn-2.md`,
SHA-256 `589662ab8d84e728340b6b22077bf72f4979d1e3a37821a00947b8c12b52326f`,
and the operator's clarification of item 10 of 2026-11-04 in
`docs/intake/planning-dispatch-2026-11-03-recurring-failures-midturn-3.md`,
SHA-256 `3f7ba4606f22f33601570f964d50d3aff6c3413294f2adea844c524f73b65e6c`.
Branch: `planning/2026-11-03-recurring-failures-and-queue-drain` from clean
`main` at `eb7c58ff6` (v0.114.0). No role was active (`harness usage`
refused: "Token measurement requires an active role and dispatch start").

The dispatch line carried no host label, so under product 07 §Paired passes
and the synthesis pass this ran as one standard pass: it listed no other
`planning/` branch and opened no other pull request. The operator's item 15
asked that this pass's three reviewers (the consistency reviewer, the design
improver and the criteria adversary) run on GPT 6 Astra at max before the
refuter, with the adversary given the dispatch; §Validation records how
that was done and what the brief carried. That instruction was for this
pass only (the operator's correction of 00:03Z); no rule was recorded from
it.

The first shell call of this session was refused by the writer-isolation
hook for 0 h 4 min: the main checkout's writer was held by pid 56325, a
Codex host process started 2026-10-29 that `ps` listed as `<defunct>`, and
the hook refused `writer --show` and `writer --release --force`, the two
commands its message recommends. The operator released it by hand at
23:17Z. This agent kept reading hook source for minutes while the
operator's typed command waited behind the turn; the host holds a `!`
command until the turn ends. Both are recorded as items 23 and 24 and
carried by WO-254.

One standing direction was given mid-turn and is recorded as such (class:
direction, the capture above): DotLn workers have four options, Claude
Fable 5.1 at xhigh, Claude Opus 5.5 at xhigh, GPT 6 Astra at max and GPT
6.1 Sol at max; Opus 5.5 and GPT 6.1 Sol are the defaults of their
harnesses; Fable and Astra run only when the operator asks. Product 07
§Model-specific notes states it; WO-255 carries the selector. Every other
mid-turn message was a correction of this pass's drafts or a question, and
none became a rule.

The operator's items, each read for its aim, with what this pass did and
what in it is the planner's own inference rather than the operator's words
(the operator asked for this enumeration at 00:06Z; the inferences are
named so the operator can strike them):

| Item | Aim read | Disposition | Planner's inference |
| --- | --- | --- | --- |
| 1 | skills shipped to an instance's operator and agents, later | deferred candidate (the map, 2026-11-03, item 1); ledger entry | the reopening condition restates the operator's own timing |
| 2 | would Rust gain efficiency | declined NoOp with the measurements (the map, item 2); ledger entry | the decline itself |
| 3 | large reads by executor and fix agents, mainly on Codex | measured on Claude (no whole-file reads of large files in seven days); unknown on Codex; the map, item 6 | nothing filed |
| 4 | the follow-ups the eight recent closes wrote instead of fixing in place must be addressed, with the ones needing work in one or two orders (the operator's clarification of 2026-11-04) | the eighteen rows read in this pass: twelve allocated as carry-ins of WO-253, WO-254, WO-255 and WO-257 (the work rides in the orders that own the files), three declined with conditions, two deferred and one settled; WO-256, a drain order drafted and reviewed, withdrawn before filing because the pass itself disposes rows; the 246 historical deferred rows left as navigation | the first draft read "drain the queue" as all 261 rows and filed an order for it |
| 5 | the pull-request sentence repeated six times; was WO-248 worth it | WO-257 step 1: one sentence | keeping the comparison rather than removing it |
| 6 | the fork's first block, nine items | 6.1 recorded; 6.2 → WO-246; 6.3 → WO-253; 6.4 declined (the map, item 3); 6.5 → WO-255; 6.6 to 6.9 → WO-257; §Answers to the fork | declining 6.4 |
| 7 | Codex after compaction repeats, ignores standing orders or idles | WO-254: the compaction record restores the session's direction-class messages; a probe | the mechanism |
| 8 | fork passes refuse to push; the operator runs the push by hand | WO-246 amended and moved to third: the emitted allow rule for the helper's node spelling, from the host's page | the allow-rule mechanism and the node spelling |
| 9 | release close fails at every pass; orders meant to fix it closed without it working | §Readings: WO-252 and WO-239 were verified on fixtures of a few roots; WO-253's criteria are stated on a planted host of many | the root cause named (the prune's byte inventory) |
| 10 | a question is a smell: the answer shows why the course is right, with evidence, or what the smell changes and what happens next; neither stops the work (the operator's clarification of 2026-11-04, ignored capture SHA-256 `3f7ba4606f22f33601570f964d50d3aff6c3413294f2adea844c524f73b65e6c`) | WO-254: the `question` class with its injected context naming the two pathways, and the role text carrying them for Codex; product 07 §Discipline states the pathways now | the form-based class |
| 11 | a passing remark is not a universal rule; anti-oscillation is not adhered to | WO-254: the `Rules recorded` block, referencing the journal row whose class `plan check` reads; the anti-oscillation half is answered by this pass's own corrections (two drafts widened the operator's words into rules and were withdrawn on the operator's word) and by this table's inference column, which names every widening so the operator can strike it | the block |
| 12 | no upstream merge at a fork planning pass unless asked | WO-257: the kit's sentence; the fork told to strike its rule | that the rule lives only in the fork's own record |
| 13 | no instance update at an entropy pass over a sibling | the same fix as 12 | the same |
| 14 | the errors logged every session, here and in the instance | measured in core: 513, 434 and 336 rows of three classification advisories in fourteen days; measured in the instances (§Readings); WO-254 makes the three journal-only | that those three are noise the operator wants gone |
| 15 | GPT 6 Astra at max for the three reviewers before refute; the adversary given the prompt and checking each point | done for this pass (§Validation); WO-255's `--capture` and the four-option selector | the record route used to launch the model the helper cannot pin |
| 16 | review rounds persisting across passes | WO-255: the lane by branch; `--since` admits a fresh round 1 | none |
| 17 | review rechecks that find nothing | WO-255: a recheck reads the whole change; a consistency report carries a traced-consumers table or is refused | the table requirement; the planner's complete-gate idea was declined on the operator's words (the map, item 4) |
| 18 | the fork's second block, ten items | 18.1, 18.4 to 18.8, 18.10 → WO-257; 18.2 → WO-246; 18.3 recorded; 18.9 → WO-255; §Answers to the fork | a provenance footer instead of rewriting 322 links (18.6) |
| 19 | a release close over twenty minutes | §Readings: publication took 0 h 2 min, the prune the rest; WO-253 scopes the close's prune and prints step timings | the scoping |
| 20 | temporary data not removed at close | WO-253: a passed suite removes its own roots; the prune judges by record | the mechanism |
| 21 | planning cannot branch; thousands of retained fixtures | WO-253: the routine prune as a bounded step with a resume | the sixty-second default budget |
| 22 | WO-241 cannot be release-closed | §Readings: both releases published at 22:43Z; the blocker was a restricted fixture directory the prune could not scan; WO-253 repairs or retains it | none beyond the evidence |
| 23 | a Codex process left over holding the writer; the hook refusing its own commands | WO-254: a zombie is dead; the two commands admitted; a stopped dispatch releases; a denied activation leaves nothing | the stop-releases-writer rule |
| 24 | the `!` command queued behind the turn | host behavior confirmed from its page; WO-254's blocked-turn sentence; product 07 §Discipline | none |

Assumptions recorded: that `README.md` is the right reader entry point to
declare (every red-tagged document was reached from it); that the operator's
staged work in `../DotLn-wo243` stays until WO-243's activation (the
operator's message: remove both worktrees only if the orders change a lot;
neither does); that GPT 6 Astra at max is the Codex model `gpt-6-astra` at
reasoning effort `max` (the operator's own Codex sessions run it; the first
reading, the kit's `gpt-6.1-sol` pin, was wrong and the operator said so).

## Readings

### Entry

`npm run plan -- start recurring-failures-and-queue-drain` ran from
23:30:04Z to 23:47:00Z (1,015 s). Its one process held the host lock and
spawned `ps -axo pid=,ppid=,lstart=,comm=` in six of six one-second samples
at 23:45Z; the temporary directory held 5,987 `dotln-*` roots at 23:38Z and
5,523 at 23:47Z. The command's own prune report was lost to this session's
`tail` of its output; the counts above are the pass's own measurement.
`plan conditions --slow` ran 305 s and could not measure the document gate
(`ETIMEDOUT`) or docs-check (listing wall budget exhausted); five
conditions hold (plan-check 8.88 s against 8; eight local release tags
absent from the generated table, regenerated by this pass; the plain gate's
thirty-day median 456.6 s against 360; the `target-worktree` task 611 s
against a 190 s median; the `skeleton` task 517 s against 436). `plan
failures` since the 2026-11-02 receipt: three failed verifications, three
repairs, eight orders made ready, two failed first verifications, three
corrections, one bound acceptance; eight final reviews with thirteen
escapes (WO-241 five, WO-248 and WO-250 two each). `gh issue list`: no
open issues. The documents report red-tagged 27 standing documents, every
one reached from `README.md`, which no entry point named; this pass
declared it in `docs/control/documents.json` as `front-page` and the report
then showed `README.md` as reached and unread (§Red tags).

### The writer and the hook (items 23 and 24)

Session journal `e63df0b3…`: at 22:41:38Z a Codex session acquired the
writer (`owner: {pid: 56325, startedAt: "Thu Oct 29 17:10:31 2026", source:
"codex-host"}`), dispatched `resume: release close` for WO-241 and recorded
nothing more. At 23:12Z this session's first shell call was refused:
"write dispatch lacks a verified exclusive worktree; the worktree is
reserved by another session (… host process 56325 … is alive)";
`writer --show` and `writer --release --force` were refused with the same
message. The operator ran `node scripts/harness.mjs writer --release
--force; kill 56325` at 23:17Z; the release printed `alive: true, released:
true` and `ps -p 56325` printed `<defunct>`. `harnessProcessAlive`
(`harness-host.ts` after 2647) judges by signal-zero existence and start
time, which a zombie passes; `scripts/harness.mjs` 242 to 247 calls
`--show` a bounded metadata read and `--release` an operator action, and
the hook's refusal (1305 to 1327) judges the dispatch before either runs.
The host's interactive-mode page (read 2026-11-03 by a `claude-code-guide`
agent): "Commands and shell commands: Claude Code holds them until the turn
ends, then runs them one at a time, keeping the order you queued them in."

### Plan start, the prune and WO-241's close (items 9, 19 to 22)

The temporary directory at 23:38Z: 5,987 roots, none older than 48 hours,
the fifteen largest entries 20.8 GB (`dotln-fixture-temporary-*` 1.1 to 2.1
GB each; `dotln-integrate-test-*` 957 MB); by prefix
`dotln-license-surfaces` 1,433 (`scripts/license-surfaces.mjs` 102, in the
document gate), `dotln-task-reuse` 530, `dotln-release-preparation` 312,
`dotln-wo185` 297, `dotln-case-markers` 246, `dotln-target-worktree` 137,
`dotln-integrate-test` 117, `dotln-release-preview` 116. `pruneInventory`
(`scripts/lib/harness-prune.mjs` 86 to 130) returns the SHA-256 of every
regular file of a candidate root; `temporaryProcessTable`
(`temporary-root-records.mjs` 231) reads a host snapshot per call and its
callers at 1095 and 1300 take one per judged root. The gate-fixture class
expires at zero hours when the suite passed (`DEFAULT_RETENTION` 86 to
97), so every such root is removable the moment its suite ends, and nothing
removes it until a prune pays the inventory.

WO-241's close (the Codex rollout of 2026-11-03T17:41 local): dispatched
22:41:39Z; "Both v0.114.0 releases are published, the starter refresh
succeeded, and WO-241's worktree and branch are gone. Closeout is blocked
by pruning: it cannot scan a restricted temporary test-fixture directory"
at 22:43:32Z; a permission repair; a host-wide prune started at 22:54Z,
reported at 0 h 12 min, stopped at 23:01Z ("I caused the delay … That
wasted 16 minutes"); at 23:10Z "The delay is accumulated test fixtures
being checked repeatedly during cleanup … I'm now deleting the closed
order's fixtures directly … using your explicit authorization." GitHub
confirms v0.114.0 published at 22:42:32Z, not a draft; canonical status at
23:17Z still lists `release-close` as legal for the closed order; no close
record exists under `docs/evidence/WO-241/`. WO-252 (v0.112.0) and WO-239
(v0.103.1) passed their criteria on fixtures of a few roots; no criterion
named a host of thousands and no verification ran one. That is the
operator's item 9 in one sentence: a fixture of three roots is not the
host, and WO-253's criteria 2, 4 and 5 are stated on planted sets of many.

### The review helper (items 15 to 17; the fork's item 9)

`reviewsLane` (`scripts/lib/review-worker.mjs` 175 to 185) names a planning
lane `planning-<UTC date>`; `requireRoundInputs` (271 to 287) refuses a
round 1 when the lane holds a report; `ladderRule` (289 to 299) tells a
recheck to "review nothing else"; `renderReviewBrief` (307 to 345)
composes the worker definition, the brief, the subject and its diff, with
no input for the operator's dispatch; the pins (559) are the transport's
defaults, `gpt-6.1-sol` at `max` for `--host codex` (the helper's
`--dry-run` argv), with no selector. This pass crossed midnight UTC between
its dry run and its reviews, and the helper's lane moved from
`planning-2026-11-03` to `planning-2026-11-04`; an accidental empty record
in the new lane (a probe of `worker record` against `/dev/null`, removed
by hand) refused the next round 1 until removed. The operator's Codex
sessions of 2026-11-01 to 2026-11-03 ran `gpt-6.1-sol` (363 rows) and
`gpt-6-astra` (259 rows) at `max` (268) and `xhigh` (27).

### The operator's words (items 7, 10 and 11)

`operatorPrefixes` (`harness-host.ts` 1414 to 1421) classes a message by
prefix only; an unprefixed question has no class, and product 07
§Discipline's "A question is not a waiver" is the only thing between a
question and a stop. Product 07 §Paired passes records a rule from "the
fourth, fifth and sixth messages" of a dispatch; the fork's pass of
2026-11-03 took starter v0.113.0 "under your standing rule" four minutes
after its publication, a rule the operator's items 12 and 13 say they never
gave; the fork's local clone holds no planning branch this pass could read
the rule in, so where it is recorded is unknown and the answer asks.
`codex-continuation.mjs` 194 restores the task after a compaction with no
standing instruction the operator gave; `~/.codex/sessions` shows two
compaction rows across thirteen sessions on 2026-11-02 and none on
2026-11-03.

### The errors every session logs (item 14)

Fourteen days of this checkout's session journals: 513 rows "Shell
working-directory override needs a separately reviewed host adapter", 434
"Shell control syntax requires an explicit effect adapter", 336 "Dynamic
shell substitution requires an explicit effect adapter", 165
"runtime-unavailable: Harness requires the verified worktree root", 27
"compiled authority does not permit settings.user", 18 "Path outside the
worktree surface", 18 "remote.unapproved", 13 "Unclassified effectful tool:
SubagentHandback", 8 "Opaque program contains a denied invocation", 4
"host permission denied the call", 1 "an operator override entered
2026-10-22T19:03:51.672Z remains open in this worktree". The first three
fire on nearly every `cd … && …` or `$(…)` call and end "host permissions
decide"; WO-254 makes them journal rows. The operator's private instance (`../DotLn-Instance`, fifty journals)
shows the same shape over fourteen days: 511 working-directory, 320
control-syntax and 201 substitution advisories, 272 "Hook and worktree
roots" runtime-unavailable rows, 173 "snapshot-missing: run
bootstrap" rows, 101 settings.user and 42 remote.unapproved refusals and
96 "Path outside the worktree surface"; the starter fork's local clone
keeps no journal lane. The 165 runtime-unavailable rows
are sessions in worktrees without a built adapter; WO-254's step 4 (an
activation that creates nothing the host then denies) and the bootstrap
route of WO-257 step 10 are the nearest homes, and the count is recorded
here for the next pass to read against them.

### The trap meter (`npm run meta`)

`npm run meta` after the subject revision: `drift-to-low-performance` is a
reopen candidate ("worsened over three consecutive order deltas":
`gateStepCount` 120, up one per order over WO-252, WO-238 and WO-241, each
of which added a suite or a gate step); `rule-beating`'s
`readAmplification` fell to 1.191 (from 2.365); `guardRefusals` 0; WO-241's
tokens 126,767,204; eight budget breaches; first verification failed in two
of the last eight closed orders (WO-252, WO-238). Disposed in §NoOps.

### The fork's two blocks against the record

First block (v0.112.0): 1 reconciled, nothing asked. 2 (`update --finish`
no output at the recovery threshold; `fetchRemoteBranch` without alternates)
→ WO-246, unchanged priority. 3 (a bounded startup cleanup with per-root
progress) → WO-253 steps 5 and 6. 4 (a launch-boundary meter) → declined
(the map, item 3). 5 (`review-worker.mjs` has no target-order mode) →
WO-255 step 5 (moved from WO-257 on the design improver's F5). 6 (ER-VER-01
the executor-unmet projection; ER-RUN-03 the unobserved boundary) → WO-257
steps 5 and 8. 7 (a fresh clone fails `plan check` without the
target-clone mapping) → WO-257 step 9. 8 (`targetReleaseClassification`
counts only recognized values; FUP-2232a29f1061494f) → WO-257 step 10. 9 (`fileReceipt` and the Markdown
private-path rule; a correction route) → WO-257 step 5.

Second block (v0.113.0 over dotln-angular): 1 (the stale index after the
merge) → WO-257 step 4. 2 (the fourth session with the push refused) →
WO-246 amended. 3 (`update --finish` ran live) recorded. 4 (thirteen false
red tags; the kit line not read as a link) → WO-257 step 3, and core's
`documents.json` today. 5 (the uninstalled frozen copy) → WO-257 step 5. 6
(322 relative links) → WO-257 step 6, a footer. 7 (the launchpad witness)
→ WO-257 step 5. 8 (the absolute temporary path; the summary) → WO-257
step 5. 9 (the lane by date) → WO-255 step 1. 10 (product 00 read
unconditionally) → WO-257 step 7.

### The host's pages

Read by one `claude-code-guide` agent on 2026-11-03: the auto-mode
configuration page says narrow `Bash` allow rules such as `Bash(npm test)`
stay in effect in auto mode and are resolved before the classifier runs,
that blanket, wildcarded-interpreter and package-manager run rules are
dropped on entering auto mode, and that `autoMode.classifyAllShell`
suspends every allow rule; the permission-modes page lists the decision
order (allow, ask and deny rules first, with named exceptions); the
interactive-mode page says queued shell commands wait for the turn's end.
"External System Writes" and "Out-of-Place Publication" appear on none of
them. WO-246's amendment and WO-254's sentence rest on these.

## Orders filed and amended

- [WO-253](../../work-orders/WO-253-temporary-roots-leave-with-the-gate-that-made-them.md):
  temporary roots leave with the gate that made them and a prune is a
  bounded step. Items 9, 19, 20, 21, 22; the fork's 6.3. First.
- [WO-254](../../work-orders/WO-254-the-hooks-get-out-of-the-operators-way.md):
  the hooks get out of the operator's way. Items 7, 10, 11, 14, 23, 24;
  the wo242 denial. Second. One live feedback episode (the hooks are
  feedback-judged sources).
- [WO-246](../../work-orders/WO-246-the-launchpads-own-pull-requests.md),
  amended: the 2026-11-03 refusals in the Observed gap; the emitted allow
  rule for the helper's node spelling as a Design bullet, step 8 and
  criterion 6, with the host page as the behavior's source; the known
  issue restated. Item 8; the fork's 18.2 and 6.2. Moved from twelfth to
  third.
- [WO-255](../../work-orders/WO-255-reviews-find-what-the-complete-run-finds.md):
  reviews find what the complete run finds. Items 15, 16, 17; the fork's
  18.9 and 6.5 (the target form); the four-option worker rule. Fourth. Two drafts were corrected on
  the operator's words before filing: the complete-gate order and the
  reviewer pin left (the map, items 4 and 8).
- [WO-257](../../work-orders/WO-257-instance-returns-of-2026-11-03.md):
  instance returns of 2026-11-03. Items 5, 12, 13; the fork's 6.6 to 6.9
  and 18.1, 18.4 to 18.8, 18.10. Fifth.
- WO-256 (the follow-up register drains to zero) was drafted, reviewed by
  the three workers and withdrawn before filing when the operator asked
  why the pass itself does not dispose the rows (it does; §Register); its
  reviewed text is in the lane's reports, not in the tree.

Each carries `Model:`, three-role `Effort:`, `Cost:` with additions and
removals, a dated observed gap at `eb7c58ff6`, a Design with rejected
alternatives and their axes, an execution plan naming a file and a check
per step, criteria whose last names `npm test -- --review` and `npm run
test:docs`, a Preflight line, non-goals and
operator-review assumptions. The five defect classes were screened: no
criterion's subject is a count or duration (the figures are in Cost lines
and §Readings), none reads `HEAD` or a range, each names where its input
exists or which step plants it, the host behaviors (the auto-mode allow
rule, the `!` queue) name their page and fallback, and no criterion
contradicts a non-goal. `npm run work-orders -- index --check`'s advisory
lines are in §Validation.

## Register

The operator's item 4, clarified on 2026-11-04: the eight recent closes
(WO-245, WO-251, WO-249, WO-250, WO-248, WO-252, WO-238, WO-241) wrote
eighteen follow-ups instead of fixing in place, and the pass is where they
are addressed, with the ones needing work in one or two orders. Read
against their decisions: twelve are allocated as carry-ins of the orders
filed tonight that own their files (WO-257 six: WO-245-D013, WO-245-D010,
WO-241-D016, WO-238-D036, WO-249-D012, WO-241-D017; WO-254 four:
WO-251-D017, WO-249-D017, WO-241-D003, WO-241-D015; WO-253 two:
WO-245-D011, WO-252-D034; WO-255 two: WO-241-D004, WO-250-D015), each
written into that order's carry-ins with its reopening condition; three
are declined with conditions (WO-238-D037, a planning duty; WO-241-D014,
owed only before the first feature rename; WO-248-D004 was allocated to
WO-257 earlier in the pass); WO-250-D016 is deferred with its remainder
named (§Validation). A drain of all 261 pending rows was drafted as WO-256
and as one batch, and both were withdrawn: the historical 246 deferred
rows are navigation whose conditions have not fired, and the 2026-11-01
rule (a pass disposes what it reads) governs them. `followups --sync`
after the map's candidates section of 2026-11-03; `--export`; the batches
and revisions are in §Validation. Allocated: FUP-1398fcdb63df23d2 (WO-241-D004) and
FUP-60ea250ef102cc46 (WO-250-D015) to WO-255 (FUP-2bcb656e4fc1e7f6,
WO-250-D016, was allocated there first and returned to deferred with its
remainder named on the consistency reviewer's F5); FUP-225e0993974f3f4b (WO-248-D004) to WO-257 (FUP-2232a29f1061494f,
the fork's 6.8, is not pending: its earlier disposition stands and WO-257
step 11 takes the fix); the candidates section's rows
disposed as their items say (items 1, 6, 7 and 9 deferred with their
conditions; 2, 3, 4, 5 and 8 declined, item 3 first deferred and corrected
on the consistency reviewer's F7; 10 allocated to WO-257). The other
fourteen untriaged rows of 2026-11-02 and 2026-11-03 (WO-238-D036 and
D037, WO-241-D003, D014, D015, D016 and D017, WO-245-D010, D011 and D013,
WO-249-D012 and D017, WO-251-D017, WO-252-D034) were listed and not read
against their decisions on the operator's clarification (§Register). The first page `plan
start` returned (eight deferred rows) was read and left: no condition
fired.

## Red tags

<!-- dotln-red-tags:start -->

```json
{
  "after": null,
  "tags": [
    {
      "path": "README.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: the repository's front page, now declared in docs/control/documents.json as the front-page entry point by this pass (every other tag of this block was reached only through it); WO-257 step 3 makes it a kit default"
    },
    {
      "path": "docs/README.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/discovery/local-inference.json",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/evidence/README.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/final-reviews/README.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/lineage/remining/README.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/product/10-ir-compatibility.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/product/11-proteino.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/commitSubject/balanced.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/commitSubject/reader.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/commitSubject/record.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/prBody/balanced.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/prBody/reader.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/prBody/record.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/prTitle/balanced.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/prTitle/reader.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/prTitle/record.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/releaseNotes/balanced.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/releaseNotes/reader.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/releaseNotes/record.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/releasePage/balanced.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/releasePage/reader.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/examples/releasePage/record.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/publication/staleness-demonstration.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/retired/README.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/work-orders/TEMPLATE.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    },
    {
      "path": "docs/work-orders/codex-downtime-series.md",
      "since": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
      "disposition": "kept: reached from README.md, the front page no entry point named; declaring README.md in docs/control/documents.json as the front-page entry point (this pass) binds it, as npm run plan -- documents showed after the change"
    }
  ]
}
```

<!-- dotln-red-tags:end -->

All 27 tags have one cause: no entry point named `README.md`, the
repository's front page, so it and every page it links counted as
unreached (the fork's item 18.4 reports thirteen of the same in the
launchpad). This pass declared `README.md` in `docs/control/documents.json`
as the `front-page` entry point; `npm run plan -- documents` then showed
the 27 reached (`README.md` itself reached and unread in the census
window). Each tag's disposition says so; WO-257 step 3 makes the front page
a kit default. No document was removed or folded.

## NoOps

The map's candidates section of 2026-11-03 holds the ten in full, each a
`NoOpIntent` with its evidence and reopening condition: skills for end
users (deferred on the operator's timing); the Rust rewrite (declined on
the measurements); the launch-boundary meter (declined; the fork's own
check stands); the complete gate before round 1 (the planner's idea,
declined on the operator's words); the deferred-twice rule (withdrawn); the
Codex reads (unknown; a bounded probe over the rollouts named); the two
sibling worktrees (left; WO-243's activation decides); a pin for the pass's
reviewers (withdrawn: a one-time instruction); the register's first page
(left; no condition fired); the ER-RUN-03 sentence and the executor-ordinal
projection (taken in WO-257, recorded for the fork). **The gate step count** (the meter's reopen candidate). No order filed:
the count rises by one when an order adds a suite, and the three closes
each did; the five orders filed here add cases to existing suites and no
suite, and WO-253 removes work from what two of the gate's commands spend.
Useful when the count rises across the next three closes again, or when a
plain gate's median rises with it.

The fired conditions
of `plan conditions` (the plan-check median at 8.88 s against 8; the
release-tag table, regenerated here; the plain-gate median; the
`target-worktree` and `skeleton` tasks) are read: the table is settled by
`npm run release -- list --markdown --write`; the plan-check and gate
readings stay with the 2026-11-01 pass's deferrals, whose conditions name
a cause or a reading above 9 s and 600 s, neither met, and WO-253 removes
the prune from what `plan start` and the close spend.

## Sequence

WO-245 (v0.108.0), WO-251 (v0.109.0), WO-249 (v0.110.0), WO-250
(v0.111.0), WO-248 (v0.111.1), WO-252 (v0.112.0), WO-238 (v0.113.0) and
WO-241 (v0.114.0) left the list as closed. WO-253 first (every session pays
it); WO-254 second (what made the operator run commands tonight); WO-246
third (the fourth refused push); WO-255 fourth; WO-257 fifth; WO-242
sixth; WO-243 seventh; WO-244 eighth; then WO-083, WO-207, WO-193, WO-183, WO-088, WO-091, WO-096,
WO-014. Serial order stays the operator's direction of 2026-10-13; the
rules and the Focus are unchanged.

## Write-backs

- Product 07 §Operator recovery controls: a zombie holder is stale; the
  operator's one line until WO-254. §Workflow closeout and releases: what
  the prune walk costs, measured, and WO-253. §Discipline: blocked means
  one message. §Model-specific notes: the four worker options and their
  defaults (operator direction of 2026-11-03), the Astra route this pass
  took, WO-255's selector. §Operator-opened planning pass: the criteria
  adversary reads the dispatch; the lane by UTC date until WO-255;
  `README.md` as an entry point. §Retained planning follow-ups: how a close's follow-ups are addressed.
- Product 06: the rung after v0.114.0 names the nine open orders; the
  release table regenerated (203 tags; v0.108.0 to v0.114.0 added).
- `docs/control/documents.json`: the `front-page` entry point.
- The sequence; the map (the pass paragraph, five catalog rows, WO-246's
  placement, the candidates section of 2026-11-03); the idea ledger's
  ideation section and registration; the generated index and history page.

## Answers to the fork (paste-ready)

```text
Answers from core's planning pass of 2026-11-03 (docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md) to the DotLn-Enterprise-Starter fork's two blocks of 2026-11-03 (starter v0.112.0 and v0.113.0). Read each against the record it names. Core's queue after this pass: WO-253, WO-254, WO-246, WO-255, WO-257, WO-242, WO-243, WO-244, then the rest. Core closed WO-245 (v0.108.0), WO-251 (v0.109.0), WO-249 (v0.110.0), WO-250 (v0.111.0), WO-248 (v0.111.1), WO-252 (v0.112.0), WO-238 (v0.113.0) and WO-241 (v0.114.0) since its block of 2026-11-01.

One direction from the operator for your instance, in the operator's own words: no planning or entropy pass takes a newer starter release or merges upstream unless the operator asks for it in that session. Your pass of 2026-11-03 took v0.113.0 "under your standing rule"; the operator says they never gave that rule and asks you to strike it from wherever your instance recorded it, and to say in your next block where it was recorded. WO-257 (fifth) writes the kit's sentence so no instance records it again.

First block.
1. Recorded; nothing asked.
2. Recorded on WO-246 (now third in core's queue, amended): the finish fetch's alternates and already-held skip stay its step 5; your by-hand finish stands until then.
3. Filed: WO-253 (first) runs plan start's routine prune as a bounded step under prune.startBudgetMs (default 60 s) that stops between roots, prints removed N; remaining M and the resume command, and goes on; harness prune --apply finishes the remainder; release close prunes the closed order's own roots only; a passed suite removes its own fixture roots at its end; a kit-owned root is removed on its record without reading its bytes. Core's own plan start of 2026-11-03 took 0 h 17 min in the same prune. Blocks nothing; your startup cost drops at the release that carries it.
4. Declined for now with its condition (core's map, 2026-11-03, item 3): core's counters are unknown on both hosts, so a meter would report unknown and treat nothing as zero, which your pair does by hand. Reopen when a second instance order overruns a declared stop or a host prints a counter a meter could read.
5. Filed in WO-255 step 5 (fourth): npm run worker -- review --target <id> --order WO-NNN binds the target's base and candidate, the reviewer is read-only in the clone, the use counts and the report is the launchpad's. A convenience; your native target-worker route stands.
6. Filed in WO-257 steps 5 and 8: the index shows the executor's unmet ordinal beside the later verdict, never as the current state; the receipt names host coordination state outside the inventories as unobserved.
7. Filed in WO-257 step 9: bootstrap prints the missing target-clone diagnostic with the registration command before any check fails.
8. Filed in WO-257 step 10: targetReleaseClassification counts every declaration before validating the sole value; a valid header plus a malformed duplicate is refused naming both lines. Not a release blocker, as you said; FUP-2232a29f1061494f is allocated there.
9. Filed in WO-257 step 5: fileReceipt applies the Markdown private-path screen before the pair is immutable, the worker's summary is screened by the rule target-records applies, and a rejected projection is re-rendered from the retained original with the pair's hashes rebound by the same command, recorded on the receipt.

Second block.
1. Filed in WO-257 step 4: a release whose changed files include a generated page's renderer prints a Read before upgrading line naming npm run work-orders -- index.
2. Recorded on WO-246 as the fourth refusal and amended: the emitted .claude/settings.json carries narrow allow rules for the helper's node spellings (Bash(node scripts/refute-plan.mjs publish *) and Bash(node scripts/launchpad.mjs update --publish *)); the host's auto-mode page says narrow Bash allow rules resolve before the classifier runs and package-manager run commands are dropped, so the node spelling is the admitted form. Until the release that carries WO-246 lands, the push is yours by hand, and a session blocked on it says so in one message and ends its turn.
3. Recorded; nothing asked.
4. Taken now in core (README.md declared a front-page entry point in documents.json; 27 of core's own documents were red-tagged for the same reason) and filed in WO-257 step 3: README.md becomes a kit default entry point and a How to start: <path>. line is read as a link. You may declare it in your documents.json today.
5. Filed in WO-257 step 5: the confinement sentence names an uninstalled frozen copy as limiting the probes.
6. Filed in WO-257 step 6 as a provenance footer per filed record naming the launchpad repository, the recorded commit and the record's path; rewriting the 322 links is declined because a record is never rewritten.
7. Filed in WO-257 step 5: a target-subject receipt labels the launchpad tree as the planning branch in progress.
8. Filed in WO-257 step 5: the Repository line renders the frozen copy as <tmp>/… and the summary is screened before filing.
9. Filed in WO-255 (fourth): the planning lane is keyed by the branch slug and --since <tree> admits a fresh round 1 in any lane. Core's own pass crossed midnight UTC and hit the same refusal.
10. Filed in WO-257 step 7: relocatedLinks treats product 00 as optional, as the subject builder does.

Two items of core's own for your next pass: WO-254 (second) judges a zombie writer holder dead, admits writer --show and writer --release from the refused session, releases the writer when a Codex dispatch's role command exits without its completion event, and classes an unprefixed operator question so the session answers and continues; until it lands, a stale writer is released by the operator's one line and the session ends its turn after saying so. The operator's worker rule of 2026-11-03: four options (claude-opus-5-5 and claude-fable-5-1 at xhigh, gpt-6.1-sol and gpt-6-astra at max), the first and third the defaults of their harnesses, Fable and Astra only when the operator asks; WO-255 adds the selector.
```

## Process cost

Model and effort: Fable 5.1 at max, operator-selected (CLAUDE_EFFORT=max;
the `/model` line of the session). Subagents: budget 20
(`docs/control/budgets.json` `subagentCap`); the plan stated before the
first spawn: one `claude-code-guide` agent for the host's pages, three
Codex review workers (one per brief) launched directly on `gpt-6-astra` at
`max` with the helper's captured briefs and recorded through `npm run
worker -- record`, and one refuter (`dotln-worker`, claude-opus-5-5 at
xhigh, the Claude default; the dispatch named no fable worker), each
launched once with no re-task; the three stub launches that captured the
briefs returned no worker and are counted as helper uses in §Validation.
Usage at entry and exit: unknown (`harness usage` refused: no active
role). Launches counted by hand: one `claude-code-guide` agent; six
helper launches that returned no worker (the stub captures); three direct
Codex launches that failed on stdin; three direct Codex launches that
returned reports (0 h 6 min, 0 h 10 min and 0 h 12 min); one criteria
recheck with the capture (§Validation); three refuters launched, two
stopped before returning and one returned: seventeen uses against the
cap of twenty, with no re-task. Wall-clock of the pass's commands: `plan start` 1,015 s; `plan
conditions --slow` 305 s; the temporary-directory `du` over 120 s; the
reviews and the refuter in §Validation. Against the NoOp of doing nothing:
tonight's two failures (a 17-minute branch creation and a close blocked by
its own cleanup) recur at every pass and every close until WO-253 lands,
and the writer refusal recurs whenever a Codex dispatch stops.

## Validation

Recorded in order as the pass ran them; the figures after the commit are
appended when observed.

- `npm run plan -- start recurring-failures-and-queue-drain`: admitted
  after 1,015 s; the branch and skeleton written by the command; its
  register page and red tags read from its output.
- `npm run release -- list --markdown --write`: product 06's table
  regenerated from 203 tags.
- `docs/control/documents.json`: the `front-page` entry point added; `npm
  run plan -- documents` showed the 27 red-tagged paths reached.
- `npm run work-orders -- index` and `index --check`: the first run refused
  three Preflight suite names that are not declared (`runner`,
  `review-worker`, `entropy-review`), read from `npm test -- --list
  --review` and corrected to `runner-fixtures`, `plan-refutation` (whose
  file imports the review-worker and entropy fixtures), `docs-check-fixtures`,
  `target-worktree`, `work-orders-fixtures` and `launchpad`; the check then
  passed with two pre-existing advisories read and left (WO-244 criterion 3
  names `git log` as the command a case runs; WO-246 criterion 5 says the
  checkout's `HEAD` is unchanged by a refused fetch).
- `npm run plan -- followups --sync`: ten rows minted from the map's
  candidates section (revision `63ec9cc0…` to `75da0f69…`); `--apply` from
  `docs/control/local/followup-request.json` (the system temporary
  directory was refused as a request path): fourteen dispositions in one
  batch (five allocated, five deferred, four declined), leaving revision
  `e48f5adb…`; pending 261 (247 deferred, 14 untriaged).
- `npm run meta`: green; the trap meter's reopen candidate read in
  §Readings and disposed in §NoOps.
- `npm run format` and `npm run sync`: the publication edition regenerated
  after the product edits; the lineage index regenerated after the
  ledger's tags were corrected (`declined` is not a ledger status;
  `rejected` is).
- `npm run test:docs` at the committed subject: 25 passed, 2 failed, 0 h
  2 min; the two (`plan` and `plan-refutation-current`) fail only on
  "planning pass planning-909f847e03ddc56b needs a receipt", which the
  refutation receipt supplies. A first run failed 23 tasks on one stale
  generated artifact (the lineage index, after the ledger tag) and passed
  after the correction.
- `npm run plan -- check` at the committed subject: "needs a receipt", as
  above.
- The three reviews (the operator's item 15, for this pass): the helper's
  `--host codex` pins `gpt-6.1-sol` and has no selector, so the canonical
  brief of each kind was captured by running `npm run worker -- review
  --kind <kind> --host codex --subject planning` with a stub `codex` on the
  path that saved its stdin, argv and output schema and exited 3 (the
  helper recorded "the worker returned no report (transport-failed:
  exit-3)" for each; six such launches in all, three before the amended
  commit and three after); each brief (230,446, 230,465 and 231,328 bytes,
  holding the worker definition, the brief, the subject and its diff,
  including this document's per-item table) was then given on stdin to
  `codex -a never exec --ephemeral --ignore-user-config --sandbox read-only
  --strict-config --model gpt-6-astra … -c model_reasoning_effort="max" -`
  with the helper's own argv otherwise unchanged, from the scratchpad, as
  the helper spawns it. A first direct launch under `node
  scripts/harness.mjs bounded --` failed in under a second on "No prompt
  provided via stdin" (the wrapper does not forward stdin); the second ran
  without it. The helper's planning lane moved from `planning-2026-11-03`
  to `planning-2026-11-04` at midnight UTC during the pass (§Readings).
  Each returned report is recorded with `npm run worker -- record --kind
  <kind> --from <file> --subject planning --round 1 --duration-ms <ms>`
  in `docs/control/local/reviews/planning-2026-11-04/`.
- The design improver (`gpt-6-astra` at `max`, 0 h 6 min, five findings,
  none blocking): F1 a refused session must not force-release a live
  writer (taken: only a dead or zombie holder is released from the refused
  session; `--force` against a live one stays the operator's); F2 the
  question class must not override an explicit request in question form
  (taken: the class is advisory and names the pause, stop or wait
  exception); F3 the prune budget must hold inside a large root's
  inventory and a retained root must not be hashed (taken); F4 WO-256
  still carried the withdrawn second-deferral rule (taken: removed); F5
  the target-order review form and the instance template sentence belong
  with their owning orders (taken: moved to WO-255 and WO-254).
- The criteria adversary (`gpt-6-astra` at `max`, 0 h 10 min, twelve
  findings, none blocking, with a per-item coverage table over the
  twenty-four items): F1 WO-255 promised the four-option selector and had
  no step for it (taken: step 6 and criterion 6); F2 and F3 as the
  improver's F4 and F1 (already taken); F4 "Do not run the final gate
  until I approve." opens with an interrogative (taken: the question mark
  alone classes a message, with negative cases); F5 the compaction fix
  named no capture source for an unprefixed Codex instruction (taken: the
  prompt hook keeps each message's bounded text, and criterion 6 types the
  instruction into the fixture); F6 a planner could mislabel a question as
  direction (taken: the rules block references the journal row and `plan
  check` reads the class from it); F7 WO-253's fixtures were tiny (taken:
  a two-thousand-root regression with counters); F8 criterion 6 would
  delete another run's retained root (taken: scoped to the invocation's
  own roots); F9 `--touching` reads pending rows only (taken: the full
  export); F10 a closed order may carry a waived or defective criterion
  (taken: the index projects the criterion-level judgment); F11 a wrapped
  undeclared suite name (taken); F12 the reviewer read the planner's table,
  not the dispatch (recorded: the second round below carries the capture).
- The consistency reviewer (`gpt-6-astra` at `max`, 0 h 12 min, ten
  findings, none blocking, with its traced-consumers table): F1, F2, F3 and
  F6 as above (already taken); F4 the record route must bind the tree the
  worker reviewed (taken: `--tree` on `record`); F5 WO-250-D016's row was
  allocated on a narrower promise than the decision (taken: WO-255 names
  the remainder and the row returns to deferred, a second register batch);
  F7 the launch-boundary meter read declined in prose and deferred in the
  register (taken: declined, a second batch); F8 the pass's "0 h 27 min"
  was the process's lifetime by `ps`, while the host observed 1,015 s to
  the branch (taken: 0 h 17 min in six documents, the 25-minute lifetime
  kept beside it); F9 WO-248 is v0.111.1, not v0.113.0 (taken); F10 two
  prune files are not registered evidence sources (taken).
- self-review: found 27; fixed 25; recorded 2 (the two notes F12 and the
  design improver's F5 consolidation, both acted on and recorded here).
- The criteria adversary's round 2 (`gpt-6-astra` at `max`, 0 h 7 min),
  launched the same way with the recheck brief the helper rendered for
  `--round 2 --recheck round-1-criteria.md` and, appended to it, the two
  ignored intake captures of the operator's dispatch with an instruction to
  answer the per-item table from those words (the operator's item 15): ten
  of the twelve round-1 findings held as repaired, two not: F4 still
  neutralized an action request in question form ("Can you add the missing
  regression test?"; taken: the injected sentence names any action request
  as explicit, and criterion 4 adds the case) and F9's replacement named
  the export flags in the wrong order (taken: `--export <file> --all`).
  Its table over the twenty-four items and the mid-turn directions found
  every item carried by the subject and named two gaps the pass then
  filled: item 11's anti-oscillation half had no separate disposition (now
  in the items table) and item 14's instance-log census was missing (now
  in §Readings). Recorded as `round-2-criteria` in the lane.
- Second register batches at revisions after `e48f5adb…`:
  FUP-b80b9dfabaed4936 declined; FUP-2bcb656e4fc1e7f6 deferred with the
  remainder named; the feed then reads 261 pending.
- The operator's clarification of item 4 (01:18Z): a batch declining all
  261 pending rows had been built and was refused on its one `settled`
  request with a null reopening condition (request index 170; nothing
  written) and was not retried; a batch of fifteen at revision
  `4e7617dc…` then disposed the eight closes' follow-ups (twelve
  allocated to WO-257, WO-254 and WO-253 and written into their carry-ins;
  three declined with conditions), leaving untriaged 0 and pending 246, all
  deferred; WO-256 was removed from the tree and every reference repaired;
  `followups --sync` minted one row for the map's candidate 11 and it was
  declined with its condition; the feed reads 246 pending.
- `npm run plan -- refute` at `cb02208c2` printed the canonical prompt
  (166,294 bytes of subject; five orders judged). One fresh `dotln-worker`
  (claude-opus-5-5 at xhigh, the Claude default; the dispatch named no
  fable worker) judged it from the prompt file alone, reading no repository
  file and running no gate: 0 h 14 min, 202,301 tokens and 22 tool uses by
  the host's usage. Two earlier refuters were stopped by this session
  before they returned, one at 0 h 12 min and one at 0 h 1 min, because the
  operator's clarifications of items 10 and 4 changed the subject while
  they ran; their judgments were not read. The worker's writes of its
  result and statement to the scratchpad were refused by the outside-write
  hook ("no granted root for role unknown": a spawned worker has no planner
  grant), so it returned both inline and this session saved them under
  `docs/control/local/planning-2026-11-03/`; the receipt helper then
  refused the statement for an absolute scratchpad path (the screen the
  fork's item 18.8 names), repaired to the `<tmp>/` placeholder without
  touching the judgment.
- `npm run plan -- receipt`: receipt `2026-11-04-planning-0813ea751d78a5a6-063`
  filed and committed; judged, committed and workspace subjects
  `sha256:86d8bf3b…`; `planVerdict: aligned-with-findings`, every order
  `aligned-with-findings`, no holds, 23 known issues (WO-253 four, WO-254
  five, WO-246 five, WO-255 six, WO-257 three), each written on the order's
  catalog row with the planner's reading and its reopening observation for
  the executor's decisions; the two pre-existing criteria advisories
  relayed. The refuter's reading that no order names its critical-path
  gate is right: each infers P (WO-083) and the rows now say so.
- `npm run test:docs` at `d7e5d9742`: 27 passed, 0 failed, 0 h 2 min.
  `git push -u origin planning/2026-11-03-recurring-failures-and-queue-drain`
  was admitted by the host on the first try; `gh pr create` opened #272.
  Its title was first written to satisfy the kit's `pr-title` lint, which
  runs the commit-message shape (a conventional type, 72 characters) on a
  pull-request title; every merged pull request of this repository (#264 to
  #271) is a gitmoji and a plain subject with no type, WO-246 already names
  that lint's defect and carries the fix, and nothing gates `gh pr create`
  on it for core's own branches. The operator asked where the title came
  from; it was retitled in the repository's own form. The branch and this
  document keep the `recurring-failures-and-queue-drain` slug fixed at
  `plan start`, before the operator's reading of item 4.
- Correction (2026-11-04, on the operator's reading of #272): the filed
  text of WO-254's Nomination provenance and the map's candidate 4 quoted
  the operator's mid-turn messages verbatim. The clean-room floor admits
  exact operator wording only for a public draft marked ready to file;
  everything else is synthesized, and the verbatim words live only in
  ignored intake. Both passages were rewritten as syntheses, the branch's
  history was squashed and force-pushed so the public branch holds no
  commit with the quotes (a forge may cache unreachable commits for a
  time), the changed subject was judged again by a fresh refuter and the
  earlier receipt stays as the record of the earlier subject. Older
  committed records on `main` quote operator words the same way (WO-181's
  and WO-237's decisions, WO-237's reviews, the 2026-10-28 pass, the idea
  ledger's 2026-10-28 registration); they predate this pass and are the
  operator's to keep or scrub.
