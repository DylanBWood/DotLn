# Planning pass on the fork's notes and the operator's questions, 2026-10-21

## 1. Subject, authority and provenance

The operator opened `planning: standard planning pass + some notes from
various fork sessions + my own questions` on 2026-10-21 at about 23:09Z in
Claude Code (Fable 5.1, effort max, host-selected), as one pasted block
holding three things: the request block the operator's instance (the fork,
checked out as `DotLn-Instance`) wrote for core in its planning pass of
2026-10-21 on taking starter v0.88.0 (its §11, eight items); the request
block its UI planning pass of the same day wrote (its §11, ten items); the
operator's nine numbered notes, including the block the operator means to
hand the fork's next pass; and the fork's two kit-behavior questions from
its WO-006 publish (the outward vocabulary; the registered-target admission
against the host's auto mode). The paste was resent once at 23:10Z with the
words "did that get everything? trying again", byte-identical. Both are
captured verbatim in ignored intake
(`docs/intake/notes/planning-fork-notes-and-operator-questions-2026-10-21.md`,
SHA-256
`4db8e10536b76209745538e6f54f2563dc7d1b34645a2cba438fd14a7812bab6`), a
sibling record, never a source to mine. The mid-turn messages that followed
are captured in a sibling file
(`docs/intake/notes/planning-fork-notes-and-operator-questions-2026-10-21-messages.md`,
SHA-256
`7297fbcfdde9fd159807018342365041b26d660355d8aa4dd1a95b86932215a2` at the
nineteenth message), because the filed orders and the product candidate
cite the dispatch capture's digest. Nineteen mid-turn messages in all,
the first ten: two questions about the
usage counter (23:35Z and 23:36Z), a bare `planning:` (23:42Z), the
clarification of note 8 (23:43Z: orders that test with the operator's
personal instance or with DotLn-Angular may stay in the queue; the separate
stream is for work that mines or works with the predecessor, launchpad v1,
which exists only on the work machine), and four messages of direction for
that stream (23:54Z to 23:56Z): mining a couple of large repositories and
the configuration and rules spread through them in a reasonable, consistent
way; understanding the predecessor's capabilities and planning how to
incorporate them without massive planning text; the predecessor's account
(a few defects in, a finished pull request out, everything off the main
thread); and the requirement that launchpad v2's workflow be usable at
work through subagents and dynamic workflows, with token budgets tracked
later. Those four are synthesized in §5 and in the track's document
(`docs/workstreams/WS-002-predecessor-track.md`).

The subject is the register's existing rows, the failures and conditions
since receipt 051, the fork's eighteen items read against the code each
names at `926b8234` and against the fork's committed planning documents and
WO-006 evidence, read on the operator's machine without a write
(`DotLn-Instance`, `main` at `8ba47c1`, clean), the operator's nine notes
read against the code and records they name, and the fourteen open orders
read against the tree. The clean-room screen found no suspect material: the
fork is the operator's own public instance, its target the public
DotLn-Angular, and no target code, predecessor material or employer
material enters. This document is planner synthesis of public repository
evidence.

Entry was clean `main` at `926b8234`, WO-217 closed (v0.89.0, 2026-10-21;
canonical status reads `closed` with legal next `release-close, next,
activate`) and WO-223 closed (v0.88.0), no active order. The pass runs on
`planning/2026-10-21-fork-notes-and-operator-questions`, created by `plan
start`. Only the parent writes this planning checkout.

**The dispatch was not read as one.** The prompt hook recorded the first
message as `prefix: null`, `class: unclassified`, `role: unknown`, 21,641
bytes (this session's journal, 23:09:46Z), where the 2026-10-20 pass's
first message recorded `prefix: "planning:"`, `role: planner`, 7,010 bytes.
The difference: on 2026-10-20 the operator typed the phrase and pasted the
blocks after it; today the phrase was the first line inside the paste, and
the prompt as the host delivered it to the hook did not begin with it after
`trimStart()` (`recordOperatorMessage`,
`packages/skeleton/src/harness-host.ts` line 1175; the digest of the
delivered text matches none of the pass's renderings of the paste, so the
host's framing of pasted content is the inferred cause). Consequences
observed: no planner role, so the planner's outside-write grants were not
equipped (three scratchpad writes refused as `role unknown`, 23:30Z to
23:33Z) and `harness usage` answered `no-session`; the Skill dispatch, the
writer reservation (23:10:08Z) and the subagent accounting were unaffected
(`.subagents.json`: 0 direct, 12 children under one workflow at 23:4xZ).
The operator's bare `planning:` at 23:42Z resolved the role, equipped the
session scratch and named the usage readback, which then answered that token
measurement requires an active role and a dispatch start: the counters stay
unknown for this pass. The defect, a dispatch prefix inside pasted content
goes unread, is WO-226's step 7, with a case.

Fan-out, planned against `subagentCap` 20 with 0 admissions observed at
entry and stated before the first spawn: one workflow of fifteen
`dotln-worker` agents (six order reviewers in three pairs, one adversarial
verifier per pair, six read-only research workers on the kit questions),
then one background refuter after the subject is committed; sixteen in
all, no descendants expected. The harness observed the workflow's agents as
children of one workflow id, so the count is observed, not hand-kept.

Aim, as read: file, decline or defer each of the fork's eighteen items with
its reopening condition; answer the operator's nine notes, filing orders
where the answer is code; answer the two kit questions with whether each
behavior is by design and what an instance does; review every open order
for stale, incorrect, infeasible or mutually exclusive text and amend it;
put predecessor-dependent work in its own stream. Traps named before the
material choices: reading the fork's items or the fork's planning documents
as operator direction (they are evidence the operator carried; direction is
the dispatch's own words); filing one order per fork item (the fixed cycle
is the cost; one subsystem, one order); reading note 8's work-instance phrase
as the personal instance (the clarifying message settled it); taking the
previous planning document as the source of this one's shape (note 4 names
that habit; product 07's standard-artifacts list is the source, and the
2026-10-20 document is additional context); editing judged orders beyond
the defects found (anti-oscillation; each amendment is one quoted defect and
its correction); answering the lane question from the fork's numbers alone
(the holders named in the fork's own WAIT lines, read against core's suite
list, decide it); and the NoOp of leaving the stale orders to their
executors, which is the cost the operator named in note 7.

## 2. Entry observations

`plan start` and `plan failures` in the window since receipt 051
(2026-10-20T22:04:05Z): 25 items; 1 failed verification (WO-217 VER-001),
0 failed final reviews, 1 repair, 2 orders made ready, 1 failed first
verification, 10 corrections, 0 off-ramps and 11 amendments. The record
totals stand at 149 failed verifications, 22 failed final reviews, 174
repairs, 182 orders made ready, 88 failed first verifications, 191
corrections, 6 off-ramps (4 `CriterionWaived`, 2 `OperatorOverrideRecorded`)
and 89 amendments (1 withdrawn). Two final reviews measured since the
receipt (WO-217 FINAL-001, WO-223 FINAL-001) recorded 1 escape; the sixteen
measured reviews of the ten most recent orders 185, 11.56 per review. Local
records: 2 release closes (WO-217, WO-223), 0 host denials, 5 interventions
(3 unclassified, 2 direction; 3 in release close), 3 long phases (WO-217
two, WO-223 one), 10 repeated gate rows (WO-217), 17 failed gate rows
(WO-217 fifteen, WO-223 two) and the eight recent closes split four
delivery and four machinery. The register held 148 pending rows at entry
(0 open, 148 deferred, 0 untriaged) of 1,234, at revision `9d03e44d…`. No
reader run is due: `scoreSelection` marks a run due only when no score
exists at the current profile revision and three unscored eligible releases
exist (`scripts/lib/reader-profiles.mjs` lines 509 to 528), and the entry
figures carry scores at the current revision. Process cost at entry:
unknown (`harness usage`, cause `no-session`; after the role resolved,
"requires an active role and dispatch start"); the harness counted 12
subagent children under one workflow at 23:4xZ.

**Routing the failed reports.** WO-217's VER-001 failed on the
`sync-fixtures` classifier (FINAL-001: the regression VER-001 found was
repaired and the real-checker case added); the repair closed it and VER-002
passed, so the cause is recorded in WO-217's own decisions and no planning
rule is new. The ten corrections are WO-217's implementation corrections
(D070 to D073 among them) and one `HedgedQuantityObserved` journal event;
the 11 amendments are WO-217's and WO-223's execution amendments. The 10
repeated gate rows at an identity already green are WO-217's, recorded as
planning input beside its 15 failed gate rows: the order spent its
implementation on the gate machinery itself. One deferred row's reopening
condition opens with a lifecycle event of a closed order:
FUP-d0a9719cc2e4ec55, whose condition names WO-217's pull-request review
and the operator's choice there, re-disposed in §10 on the operator's
note 9.

## 3. Reopening observations

`plan conditions` at 23:12Z (46.9 s; load 2.2 on 16 CPUs):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 5.476 s | 8 s | no |
| Release table lag | 2 tags | 3 tags | no |
| Latest two closed orders, distinct evidence blob bytes | 203,299 and 1,984,622 | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 7,184,441 bytes | 10 MB | no |
| collectSources | 0.935 s | 3 s | no |
| Uncached release listing | 4.295 s | 10 s | no |
| status --all --json | 6,642,396 bytes | 32 MB | no |
| Work-order index | 2.213 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured | 30 s / 15 s | unknown |
| Plain gate, thirty-day median | 314.4 s | 360 s | no |
| gate-task vertical | 722.7 s against a 753.9 s median (74 samples) | 1,130.8 s | no |
| gate-task vertical:file:test-vertical.mjs | 723.5 s, no earlier sample | none | unknown |
| gate-task target-worktree | 611.3 s against a 126.6 s median (38 samples) | 189.8 s | yes (unchanged) |
| gate-task target-worktree:file:test-target-worktree-close.mjs | 427.3 s against 436.6 s | 654.9 s | no |
| gate-task launchpad | 380.6 s against a 148.7 s median (59 samples) | 223.0 s | yes (new) |
| coldStartBytes.executor | 28,822 | 24,576 (WO-150-D003) | reopened; the ceiling is 29,246 |

**The evidence hold released.** WO-217's evidence is 203,299 bytes against
WO-223's 1,984,622, so FUP-8a4e201d861208ad's two-consecutive condition no
longer holds; the row's deferral stands unchanged (its condition separates
required records from captures and has not been met twice in a row).

**Two gate-task holds, one of them new.** The `target-worktree` row is the
reading the 2026-10-20 pass carried (the pre-split task's sample, answered
by WO-222's file lanes; no new sample). The `launchpad` row is new: the
latest fresh task read 380.6 s against a 148.7 s median. The complete
review rows of WO-217's final review on 2026-10-21 record the `launchpad`
group at 1,166 to 1,351 s and `target-worktree` at 414 to 605 s per run
(five rows, 18:17Z to 21:18Z), with no lane-wait field in those rows, and
`plan conditions` reads wall-clock per task. Whether the growth is work or
host-lane waiting cannot be read from the record: this is the same
measurement gap the fork's question in §4 names, and WO-226 (step 6) makes
the recorded row and the condition separate the two. Until then the row is
recorded here as fired and unexplained, and no order is filed on it.

**The cold start** is 28,822 bytes, 424 under its ceiling, the operator's
reserved efficiency pass (FUP-f1c7a256bec46737, open, unchanged reading).
The order-size rule has no new close to read beyond WO-217 (one order,
first verification failed, repaired once) and WO-223 (first verification
passed, one final review): three of the last eight closed orders failed
first verification by the status line's count ("5 of the last 8" at
23:12Z reads the older window), under the five-of-eight baseline.

**Rows read and left.** FUP-47b7a9b32cea5e57 (`plan conditions --slow`
cannot measure the document gate above its wall budget) is the reason the
document-gate rows above read unknown; this pass did not run `--slow`,
because the fork's two measurements and the lane analysis in §4 answer the
question the measure was for, and the row stays deferred until WO-226's
separation lands. FUP-96c6c31ef9ae62cd (gate share above a quarter) has no
new reading: WO-217's phase record is in its receipt and not re-derived
here. FUP-edefd92233980b63 (core-operator decisions marked in kit text)
stays deferred; the vocabulary question of §6 is answered by an instance
file the fork already owns, not by a kit override.


## 4. The fork's eighteen items, decided

Each item was read against the record it names at `926b8234` and, where it
cites the fork, against the fork's committed documents at `8ba47c1`. The
dispositions below are the answer block the fork's next pass reads (§13).

### 4.1 The planning pass's eight items (its §11)

1. **WO-223 in the field.** Confirmation recorded: an instance with forty
   moved records passed its document gate on the update branch (the moved
   decisions read through their bindings, the index regenerated with the
   moved rows and the history note, the clone mapping found in the primary
   checkout). No candidate. WO-223's register rows already carry the
   reopening condition (a starter release still failing an instance's gate
   on a moved record).
2. **The 304.86 s document gate.** Answered: neither a first-run build nor
   the gate's own serialization. In an instance's `test:docs`, the six
   structural tasks and `kit-verify` each request every host lane (8 on 16
   CPUs) and the local scheduler runs them one after another by design; the
   other seven rows take one lane each and run together. A gate's own leases
   are released before its local lanes free, so its tasks never block each
   other at the registry. The holders the fork named
   (`target-worktree:file:…`, `skeleton`, `release:case:…`,
   `release-preparation`, `worktree-integration`) are core product tasks an
   instance's document selection cannot schedule, and no document script in
   that selection starts a nested gate; the registry is per user and
   machine-wide with no queue, so each full-capacity request waited until no
   other top-level lease existed on the host. The waits came from another
   checkout's gate, core's product run by the holder names (an inference
   from the code and the names; the fork's WAIT lines and rows were not
   read). Filed: WO-229 (§8). What to measure next, until it lands: (a) in
   `docs/control/local/harness/checks.json`, the latest `npm run test:docs`
   row's `durationMs` against the sum of `taskTimeline[].hostLaneWaitMs` for
   the seven full-capacity tasks (the field exists since the 2026-10-04
   runner, `d0bcda1c`); (b) `taskTimeline[].hostLaneWaitObservations[].holders[].task`
   against `npm run test:docs -- --list`: a top-level holder absent from the
   list is another gate's; (c) during a WAIT, the `lanes/` folder under the
   per-user root (`getconf DARWIN_USER_TEMP_DIR` joined with
   `dotln-host-v1-$(id -u)`): each record's `worktree` compared with the
   instance's own `git rev-parse --show-toplevel`, reported as same or other,
   never the path; (d) a controlled pair, the gate with `lanes/` empty and
   the gate during a core `npm test`. Reopen: the fork's `harness lanes`
   (WO-229) during a WAIT shows only this-checkout holders.
3. **The two advisories WO-012 would observe.** Both observed by the fork's
   item 9 of its UI pass (the release-close printed form ran three times at
   WO-012's close; WO-012 closed with the declaration) and written into
   WO-221's Claude Code row by this pass (§11). Receipt 051's withheld
   share: one withheld prompt (the close before bootstrap, item B6), then a
   complete close. No candidate.
4. **`--tags` overrides `tagOpt --no-tags`.** Allocated to WO-226 (step 6):
   one README sentence. Reopen: none beyond the order.
5. **The operator's settings and the first hook-admission observation.**
   Recorded in WO-221's row (§11): the interim entries are absent; the
   WO-005 draft was a hook no-decision (`{}` at v0.85.0), so no live
   hook `allow` has yet been observed; the fork's WO-006 fields are the next
   observation. No candidate.
6. **WO-012 amended.** Acknowledged; nothing asked.
7. **WO-224 acknowledged.** The fork's candidate reopens when a starter
   release carries it; WO-224 sits at position 8 of the serial queue, so
   that release is several closes away (§9).
8. **Confirmations by id.** Items 2, 3, 5, 6 and 7 of the 2026-10-20 block
   are read as settled; item 4's route changed as item 1 says; the fork's
   FUP-4c3c0351adc4c2cc waits on WO-219, now fifth in the queue.

### 4.2 The UI planning pass's ten items (its §11)

1. **The console plan (Angular Aria and the CDK behind house wrappers).**
   The framework decision core deferred is the fork's to make for the
   fork's shell; core pins no framework and keeps the contract as the
   boundary (product 04 §Later console hosts, rewritten by this pass: console
   v1 shipped as DotLn-Angular v0.1.0; the three names). WO-006's bundle,
   type, maintenance and interoperability readings are read when the fork
   files them, as evidence, not for a core decision. Reopen: a second UI
   host asks core for a framework-level contract.
2. **A browser-reachable read of the board and the status.** Allocated to
   WO-225: `GET /runtime-status-v1` and `GET /uifa-board-v1` on the
   resident's loopback for a local origin with the token, outside the
   command lane, without receipts; the board snapshot written by the
   resident through a bounded child run of the console CLI. The fork's
   WO-007 keeps its mock until the carrying release.
3. **Absolute paths in `board --json`.** Allocated to WO-225: coded failure
   reasons at `attempt()` and the store and beacon readers, with a test that
   no string carries the root, the node binary or the home directory. Not a
   flag: a path-free board is the contract.
4. **The two schemas in the export.** Allocated to WO-225: both join
   `KIT_FILES` and the carried tests find them.
5. **An export-aware console script and a control source that reads an
   instance's segments.** Allocated to WO-225: `scripts/build.mjs` is a
   no-op in a kit root, so every build-first script runs unchanged in an
   export; `controlLog` reads the legacy log only when present and the
   per-order segments from the configured control root.
6. **A release close that started before bootstrap.** Allocated to WO-226:
   the emitted recovery restores the carried runtime in an export instead
   of a build it cannot run, `worktree finish` and `npm run harness` the
   same, every advisory names the command an export can run, and `update
   --finish` ends the route (§5, note 1).
7. **Stale product statements.** Corrected in this pass: product 03's
   version line and the console's status, product 04's status line and
   §Later console hosts, product 13's WO-037 and WO-040 citations (now
   WO-091 and WO-096, which absorbed them); the console README's header
   (0.4.0 against 0.4.4 in `package.json`, 0.4.3 when the fork read it) is
   WO-225's step 9, since a planning branch writes only `docs/` and root
   Markdown; the `runtime-status-v1` field without a bump is by the README's
   additive-growth rule and is declined as a candidate (the map, item 13).
8. **Naming.** Acknowledged; the fork's D17 row is reworded in its
   allocation to WO-225 (the read half of FUP-280abd447f789958).
9. **Confirmations by id.** Acknowledged; item 3's observation (three runs
   of the printed form) is in WO-221's row.
10. **The 1,520.76 s document gate.** The same answer as item 2 above: the
    fork's register row fired on wall-clock that was lane wait behind
    another checkout; its own task durations say so. Until WO-229 separates
    the two medians, the fork's row should read `durationMs` minus the
    summed `hostLaneWaitMs` of the serial tasks as the gate's own cost and
    the wall figure as the operator's experience, both recorded.

## 5. The operator's nine notes

1. **Why bootstrap by hand after an upstream merge.** The mechanism: the
   tracked hooks import a content-addressed snapshot under the ignored
   `.runtime/harness/<hash>`; fast-forwarding `main` to a merged update
   brings pins that name a new snapshot and installs nothing, because
   `worktree start` prepares only the checkout it creates and the two
   repairs that run on `main`, the emitted release-close recovery and
   `worktree finish`'s refresh, both try `npm run build --silent`, which an
   export cannot run (`scripts/build.mjs` copies the absent `tsconfig.json`);
   only release close's own `ensureReleaseRuntime` knows an export, through
   `prepareKitReleaseRuntime`. So the README's route ends with a hand
   bootstrap and the hooks leave every decision to the host's permissions
   until it runs (125 `snapshot-missing` rows in the fork's session). The
   burden is the kit's, and WO-226 takes it back: the restore at the three
   sites, one `update --finish`, and no text telling an export to build.
   Weighed and not taken: a Git `post-merge` hook (the recorded stance; a
   hook's writes bypass the hook-observed gate and writer refusals; it would
   fire on DotLn's own `worktree add` and fast-forwards) and a SessionStart
   hook that prepares the runtime (a 15 s timeout against an unmeasured
   restore; the map's item 5, deferred with WO-226's measurement).
2. **Does the fork report back forever?** The cadence is the fork's: its
   pass writes a request block only when it has items, and a pass with
   nothing to ask sends nothing (product 07 §Operator-opened planning pass,
   preconditions item 5, written on 2026-10-21). The operator's question
   after this pass, as after every pass, was when to continue in the fork
   and when to wait for a fix; a first answer (a mandatory one-line
   disposition per pass and a rule on when to take updates) overshot, and
   the operator said so. The answer that stands is a classification: when
   the pass files an order for an item, it says whether the item blocks the
   fork's next order (wait for the carrying release) or is a convenience
   with a working route today (continue), and a release's Read before
   upgrading says what must be read. Today's classification is §13's table:
   nothing filed blocks WO-007 or WO-008; the one wait is the live board
   view over the loopback, a later WS-001 member, until WO-225's release;
   the rest (the hand bootstrap, the `!`-run publish, the placeholder term,
   the Release text, the lane waits) are conveniences with routes. The
   operator's third message on the point was explicit: the last fork order
   cost a lot of hand steps and must not become a habit, so when do they
   get fixed. Each is assigned to one of the first four orders in core's
   serial queue, and WO-226 is the next activation after this branch
   merges: the bootstrap, the pull and the withheld close end with
   WO-226's release; the vocabulary edit and the Release text with
   WO-227's; the scrub script, the schema pin and the direct console CLI
   with WO-225's; the gate waits with WO-229's. The one hand step core
   cannot promise away is the host classifier's denial of the publish
   (§6.2); the evidence line the close could not fill is the fork's own
   template.
3. **The outward vocabulary against the private terms list.** The ruling is
   §6.1. In short: the operator's reading was the intent and the code was
   not; WO-063 built two refusal lists over ordinary words. Sub-question
   3.a, why the edit had to land on `main`: the publication helpers and the
   admission read main's committed bytes by design (`committed()` in
   `registeredTargetAdmission`; the publish lint reads main's checkout), so a
   worktree's edit cannot carry until it merges; WO-227 keeps that rule and
   removes most of the reason to edit, since the list becomes a review list.
   Sub-question 3.b, why the lists must be non-empty: `validateOutwardVocabulary`
   refuses an empty `terms` and `checkLocalTerms` refuses a present, empty
   terms file; WO-227 admits empty lists, and the fork's GUID placeholder
   stands until that release.
4. **Why the previous instance keeps becoming the canonical example.** The
   pull-request bodies from #225 on appended prose under the meter block
   because each reviewer session copied the previous body; the template
   that seeds the body and product 08's rule had not changed. This pass
   wrote the shape rule into product 07's No-ratchet-creep bullet (the
   template or the check is the source; a previous instance is additional
   context, never the source) and WO-227 adds the check that would have
   refused the drift (`pullRequestBodyShapeFailures`: the meter block last).
   Rewriting #230's merged body is declined (the map, item 11).
5. **The UI is not a skin over data.** Product 04 §Later console hosts now
   carries the principle the operator stated (the console serves operator
   flow and knowledge; what does not work is said first, the Eye Dr method;
   UI state the host persists apart from control records; using the console
   never writes a control record or disturbs a gate; the shell used from one
   checkout while changed from another). The design work is the fork's
   console orders'; what core owes is the contracts (WO-225), whose read
   routes run outside the command lane without receipts, so playing in the
   shell touches no gate. The information-architecture question is the
   map's item 14, deferred until the fork's console order asks core for a
   contract the shell needs.
6. **The block for the fork's next pass.** Item 1 (the GUID in `$.terms`):
   WO-227 admits an empty list and makes the list a review list; the GUID
   stands until that release, and the edit lives on `main` because the lint
   reads main's committed bytes (note 3.a). Item 2 (the hand checkout and
   pull of `main` before a release close): the finish is WO-226's `update
   --finish`, and the refresh inside `worktree finish` becomes export-aware.
   Item 3 (the target Release's text and its blank line): a target Release's
   body is the order's title, a blank line, the objective paragraph and the
   close line (`scripts/release.mjs` 2662 to 2674), so the blank line the
   operator saw is the boundary between a long title and the objective; the
   reviewed `RELEASE-NOTES.md` never reaches it. WO-227 puts the reviewed
   notes on a target Release by a typed header. Item 4, first thing (an
   evidence line the close was asked to fill): the kit's release close has
   post-merge authority for the tag, the Release and the worktree cleanup
   and records its observation in the ignored release-close record and the
   printed form; it cannot commit to `main`, so a committed evidence line
   that only the close can fill is a template the fork's planning pass
   should not write (core's templates hold no such line; a grep over
   `scripts/kit/` and `docs/work-orders/TEMPLATE.md` finds none). Second
   thing (the Release text): WO-227.
7. **A pass on every open order.** §7.
8. **Work that relies on the work instance is a separate stream.** WS-002,
   the predecessor track (`docs/workstreams/WS-002-predecessor-track.md`),
   with WO-228 cut out of WO-193 as its first member and the four direction
   messages of 2026-10-21 (mining large repositories and the rules spread
   through them; understanding the predecessor's capabilities; defects in,
   a pull request out, off the main thread; usable at work through
   subagents and dynamic workflows, budgets later) as its candidates C1 to
   C4. The operator's clarification keeps orders that test with the
   personal instance or DotLn-Angular in the queue; WO-083 stays.
9. **The WO-217 packet.** Deferred; the map's item 24 reopens when the
   operator returns to it.

## 6. The two kit-behavior questions

### 6.1 Outward vocabulary: what it was for, and the ruling

What the code does at `926b8234`: `scripts/lib/outward-lint.mjs` treats
`docs/control/outward-vocabulary.json` `terms` and the private
`docs/control/local/terms.txt` as two refusal lists (`vocabulary.launchpad`
and `vocabulary.local`), refuses any outward text containing an entry, and
refuses an empty list in either. That is WO-063's implementation of a
differently stated intent. The operator's corrections of 2026-10-22
(paraphrased; the ignored messages capture holds the words) name three
checks and nothing else: launchpad identifiers (order numbers, decision and
receipt ids) have no place in a target's comments, commits or pull requests;
the private list applies to commit and pull-request text, which WO-063's
own gap statement said nothing checked; and a DotLn-specific term is refused
only in a context where it names DotLn's thing while reading as the public
word, never as a word. The private list is contextual the same way: a
company's system name is refused as a descriptor of that system, not as the
word it happens to be. The ruling this pass records and WO-227 implements:
`terms` becomes `reviewTerms` (alias `terms`) and each private term gets a
mode (`refuse` or `review`); a review term in outward text is a review item
the reviewer confirms in context with a recorded confirmation
(`--confirm-terms sha256:<digest>`), never a refusal; identifiers are the
refused class (`identifier.launchpad`); an empty list is admitted; the
helper-generated Change table is linted apart from the reviewed prose
(`vocabulary.path`, with paths that exist at the base exempt), so a fixture
the order itself named is reviewed once; and `plan check` warns, as an
advisory, when an order prescribes a file name that a review term would
flag. What an instance should do now: keep the placeholder term until the
release that carries WO-227, then empty the list or fill it with the words
it wants reviewed; DotLn-Angular may say launchpad, gem and mask.

### 6.2 Registered-target admission against the host's auto mode

Working as designed at `926b8234`, and the design is narrowed by WO-226.
Byte equality: `registeredTargetAdmission` compares each checkout's
`dotln.config.json` and `grants.json` with main's committed bytes before it
reads the four fields it uses, so an order's own registration edit (a gate
command) withholds the admission; WO-226 compares the publication fields
(`baseBranch`, `authorityProfile`, `release`, the roots) and the grants file
instead. The piped spelling: `plainShellWords` returns null on `|`, so no
admission row and no advisory; WO-226 writes a `near-miss` advisory naming
the syntax, with no decision. The classifier: whether a PreToolUse hook
`allow` prevails over the host's auto-mode classifier is stated by no
published page a research pass read on 2026-10-21 (a mod's approval skips
the classifier; a hook's `ask` can still be denied; a hook `allow` in
`dontAsk` runs; nothing for `allow` in auto mode), and no live episode has
yet seen the admission return `allow` (the WO-005 draft was a hook
no-decision, `{}` at v0.85.0, carried by the host's own flow). WO-221's row
now says so, and WO-226 cannot qualify it: only a live publish in which the
admission returns `allow` and the classifier answers decides it. How the operator got here: core's
2026-10-19 answer framed the fork's WO-006 publish as the test of the host
honoring the hook, which needed the operator's interim entries and the
launchpad-local `Bash(node *)` and `Bash(gh pr create:*)` allows absent;
the operator removed them, and the publish stopped, because the kit's
admission withheld on byte equality and the piped spelling went unparsed,
so no hook `allow` was ever emitted and the classifier denied both
spellings. The test was asked for on the strength of WO-178's 2026-09-30
reading of the host's documentation, which no current page supports, and
of a WO-005 observation that was a hook no-decision; the operator paid for
that with hand steps, and the record now says so (WO-221's row; WO-226's
known issues). What an instance should do now, in order of preference:
(1) set `hostRules: "literal"` on the registration (WO-221's fallback,
in the kit since v0.85.0): `worktree start` then writes that order's exact
publish rules into the launchpad's `.claude/settings.local.json` and
release close removes them, so no operator-owned setting changes; whether
auto mode drops a rule whose command begins with the node path as a
wildcarded interpreter is undocumented, so the first order under it is the
observation; (2) the plain node spelling in the verified or closed phase,
expecting the classifier may still deny; (3) the `!` route, or an allow
rule the operator chooses to keep in the operator's own settings, until a
live publish records the admission's `allow` and the classifier's verdict
together.

## 7. The pass on every open order

The fourteen open orders were read by six independent review workers (two
to three orders each, grouped by subsystem) against the tree at `926b8234`,
for the classes the operator named: stale data, incorrect data, criteria
gaps, criteria that cannot be met, and mutually exclusive criteria. Each
finding was then judged by one of three verification workers with no
inherited conversation, which confirmed, refuted or added to it; only
confirmed and added findings were applied, by whitespace-insensitive
unique-match replacement from a spec per order, so each amendment is one
recorded edit.

| Measure | Count |
| --- | --- |
| Findings found | 162 |
| Confirmed | 148 |
| Refuted | 14 |
| Added by the verifiers | 10 |
| Of the found, stale | 51 |
| Incorrect | 23 |
| Unwritten known issue | 23 |
| Criteria gap | 13 |
| Cannot be met | 8 |
| Step contradicts criterion | 6 |
| Mutually exclusive | 5 |

The refuted findings, not applied: WO-224 F12 and F13, WO-204 F6 to F8,
WO-192 F11 and F12, WO-083 F12, WO-183 F9 and F11, WO-207 F9 and F18,
WO-193 F6, WO-014 F7. Amendments applied per order: WO-219 (23), WO-220
(15), WO-080 (18), WO-224 (16), WO-204 (9), WO-192 (31), WO-083 (26), WO-183
(17), WO-193 (the structural cut of the predecessor map into WO-228, then
31), WO-207 (64), WO-088 (20), WO-014 (18), WO-091 (13), WO-096 (18). The
largest corrections:

- **WO-207's gate tier could not be built.** Its kit-conformance tier reused
  carried kit suites by a kit identity; WO-213-D014 (2026-10-15) had already
  made an instance's plain and review `npm test` the six structural tasks
  and `kit-verify` fresh and rejected reuse at committed code identity
  alone. The tier is struck, the declared-suite tier kept and appended to
  that consumer selection, the way in restated as the session-run update
  pull request WO-210 landed (the fork took #1, #3, #8 and #16 that way)
  with the upgrade order as its recorded form for the operator's instances,
  `build.files` defined as the loadouts' import closure (six files, not
  two), the starter refresh taught to admit the update-log row it would
  otherwise refuse, the launchpad test file split named, and the 41.7 s
  fixture figure replaced by the fork's 11.6 s and 49.56 s.
- **WO-014's criteria 3 to 11, 13 and 14 contradicted its own step 1**,
  which had scoped them out; they are now marked out of scope in place, the
  Objective, Cost, Deliverables and Evidence gate narrowed to phase 1, and
  criteria 15 and 16 restated as typed records.
- **WO-088's move refused on any dirty tree**, which its own earlier steps
  make dirty; it now refuses only on relevant uncommitted changes, the
  index check's call lands after the migration so `index --check` passes
  through the steps, a sequence-bound order's finding is an advisory, and
  `planningCaptures` counts kept operator entries.
- **WO-091's Safety-gate test asserted a reason the kernel never emits**
  (`authority revoked` and `cannot evaluate revocation` are the names), its
  shared-support clause named no single support (Shine links all eight), and
  its labels and co-writers had moved.
- **WO-096 kept FUP-f1c7a256bec46737 open** after WO-217 settled it, named
  a verifier input the verifier could not write, hashed whole files where
  sections were meant, and had no label step.
- Across the fourteen: receipt 045's known issues (2026-10-13) were written
  into none of them; each now carries its receipt 045 bullet with a
  reopening condition. Placement sentences now say "after X and before Y",
  with the position as context, since the pass moved every position.

## 8. Orders filed and amended

Filed, all planner-synthesized at `926b8234`:

- **WO-226** (first in the queue): an export's release-close recovery,
  `worktree finish` and `npm run harness` prepare the carried runtime;
  `launchpad update --finish`; every bootstrap advisory names the command
  an export can run; the admission compares the publication fields and
  names a piped near miss; a dispatch prefix inside pasted content is read
  from the first non-blank line; `dotln-worker-fable` (Fable 5.1 at
  `xhigh`) by operator request beside the pinned worker. Minor; one
  compiler minor and the editions' re-mints; 14 steps, 8 criteria.
- **WO-227** (second): the outward lint as the operator intended it
  (§6.1), the pull-request body's shape check, the reviewed notes on a
  target Release. Minor; 13 steps, 9 criteria.
- **WO-225** (third): the console's host contracts (§4.2). Minor; 12
  steps, 6 criteria.
- **WO-229** (fourth): a gate says who it waited for (§4.1 item 2), with
  the structural tasks' requests measured before any resizing. Minor;
  every edition re-mints (`gate-reuse.mjs` is a common source); 11 steps,
  6 criteria.
- **WO-228** (the predecessor track, WS-002): the private predecessor map
  cut out of WO-193, with a planning-deferral edge until WO-193 closes.
  Minor; 8 steps, 8 criteria.

Amended: the fourteen open orders (§7). WO-193's title now says the
predecessor map is WO-228's. Costs are the orders' own Cost lines; the plan
cost table (`docs/planning/cost-table.json`) was regenerated by `npm run
meta -- --plan-cost`.

## 9. The sequence

Retired: WO-223 (v0.88.0) and WO-217 (v0.89.0). The serial order is now
WO-226, WO-227, WO-225, WO-229 (the four orders that take the fork's
workarounds away, placed first because the operator's short-term priority
is the fork running without hand steps, and because each is small and
self-contained), then WO-219, WO-220, WO-080, WO-224, WO-204, WO-192,
WO-083, WO-207, WO-193, WO-183, WO-088, WO-091, WO-096, WO-014, as before
relative to one another; WO-228 is the last group, labelled as the
predecessor track, apart from the serial queue and blocked by nothing in it,
until WO-080's index grouping takes a separate track out of the list. The
sequence document carries the dated rationale paragraph and the track's
paragraph and measures 12,209 bytes against its 12,369 ceiling.

## 10. The register

`npm run plan -- followups --sync` minted twenty-four rows from the map's
new candidates section; the apply batch
(`docs/control/local/apply-2026-10-21-fork-notes.json`, ignored) disposes
them and re-disposes five existing rows, each with its reopening condition:

- Allocated to WO-226: FUP-2c78c535c3b48d78 (the export's runtime prepared
  where a build was tried), FUP-5d18c0d847c0f432 (the admission judges
  authority, not bytes), FUP-ddb3ab194a2d5577 (a prefix inside a paste),
  FUP-4aa3dd0ccd604a10 (the Fable worker by request),
  FUP-6ae20dac8ad30908 (the `--tags` sentence).
- Allocated to WO-227: FUP-ef5eda8516b67327 (the lint as intended),
  FUP-82e873a618bcac08 (the template is the source), FUP-f47632ee7dda4b2a
  (the reviewed notes on a target Release).
- Allocated to WO-225: FUP-c3e2d27792ca3c94 (the console's host contracts)
  and the existing FUP-280abd447f789958 (the fork's D17 row, its read half).
- Allocated to WO-229: FUP-181b9c7e491ee976 (a gate says who it waited
  for).
- Allocated to WO-228: FUP-a3fed3091c5508be (the predecessor track).
- Deferred: FUP-c95ee836d6dcea16 (SessionStart preparation; reopen on
  WO-226's measurement under 10 s), FUP-1352f54cf999d41e (the console's
  information architecture; reopen when the fork's console order asks for a
  contract), FUP-8633adee1d36d76d (filing C1 to C4; reopen when the operator
  plans the work setup), FUP-c99b1d05783d8eea and the existing
  FUP-d0a9719cc2e4ec55 (the WO-217 packet and the row its D026 re-boarded;
  operator note 9), FUP-0126 (re-deferred after product 12's edit),
  FUP-47b7a9b32cea5e57 (the `--slow` wall budget; WO-229 marks
  contention, no retry).
- Declined: FUP-4818a1c3622db6b5 (a Git `post-merge` hook; the recorded
  stance), FUP-9d769a76722eecb3 (exempting Change-table paths; named apart
  instead), FUP-0bbaaa68c925023c (rewriting #230), FUP-afed3bdbcd79fbfa
  (a `runtime-status-v1` bump), FUP-27931c7dc233d157 (a UI-state store in
  the kit), FUP-f9dd0789c5d28ad7 (a fair queue; WO-217-D040 stands),
  FUP-d8f92eea7a55aaeb (moving WO-083 to the track), FUP-bd907a5552b36f51
  (one order per item).
- Settled: FUP-bcfcbd2728a8f202 (how often the fork reports back and when it
  proceeds; the product 07 rule), and the existing FUP-82c6c63771a87233
  (seeding the fork's first Angular pass; the fork cut its own).

Pending rows after the apply: 149 before the sync (148 deferred, one
needs-review) plus the deferred rows above; every row the pass read is
disposed, and no pending row from before the pass was left unread that a
fork item or an operator note touched.

## 11. Write-backs and document ceilings

Product write-backs, each in place with no dated paragraph: product 07
§Operator-opened planning pass (preconditions item 5: the instance's
request block and the one-line fork disposition; the No-ratchet-creep
bullet's shape rule; the Outward artifacts bullet rewritten to the
operator's intent; the Projection boundary bullet narrowed); product 04
(the status line; §Later console hosts: console v1 shipped as DotLn-Angular
v0.1.0, the three names, the operator-flow paragraph); product 03 (the
version line and the console's status); product 13 (WO-037 and WO-040 read
as WO-091 and WO-096, which absorbed them); product 12 (the predecessor
census and the replacement route). Records: `docs/evidence/WO-221/host-qualification.md`
(the Claude Code row rewritten from the fork's WO-006 observations; the
WO-005 sentence corrected to a hook no-decision); the idea ledger's
registration heading and the lineage index; `docs/workstreams/WS-002-predecessor-track.md`
(new). Ceilings, set to the measured bytes plus one tenth
(`docs/control/doc-ceilings.json`, policy of the 2026-10-07 pass):

| Document | Bytes at the last landing | Bytes now | Ceiling |
| --- | --- | --- | --- |
| 03-architecture.md | 184,022 | 185,493 | 204,043 |
| 04-interfaces.md | 60,705 | 63,647 | 70,012 |
| 07-execution-guide.md | 233,673 | 240,430 | 264,473 |
| 12-workstream-application.md | 23,572 | 24,966 | 27,463 |
| 13-uifa-roles.md | 27,015 | 27,084 | 29,793 |

No byte figure binds any order; the ceilings advise the next pass.

## 12. Goal alignment and process cost

**Traps weighed before the material choices.** Treating the fork's items
as operator direction (they are evidence the operator carried; the
operator's notes are direction; each is labelled so). Filing one order per
item (declined; four core orders by subsystem, so cycles are paid once).
Reading WO-063's implementation as its intent (the operator corrected
this mid-pass; the ruling and product 07 were rewritten, and the first
ruling is recorded as the error it was). Carrying an inherited failure
(the lost planner role) into the record as if it were normal (recorded as a
defect with its fix in WO-226). Mining the predecessor (the clean-room
screen: the track's document names a predecessor fact as the stop
condition). Quoting the operator without the capture digest (paraphrased
throughout; the two ignored captures hold the words). NoOp for each
declined candidate is in the map's section. The outcome matched the aim:
the fork's eighteen items and the operator's questions each have a
disposition with a reopening condition, the fourteen orders are amended
from verified findings, and the fork's hand steps are the first four
orders in the queue.

**Process cost.** Wall-clock: the dispatch arrived at 23:09Z on 2026-10-21;
the subject was committed about 01:30Z on 2026-10-22, about two hours and
twenty minutes of one planning session, the first thirty minutes without the
planner role (§1). Subagents: fifteen under one workflow (six read-only
research workers over the sources the fork's items name, six review workers
over the fourteen orders, three verification workers), plus the one
refutation worker of §14, sixteen against the root budget's cap of twenty;
the workflow reported about 3.64 million tokens across its fifteen agents at
completion, as the tool reported it. The root session's counters are
unknown: `harness usage` answered that measurement requires an active role
and a dispatch start, which the lost prefix prevented (§1), so no root total
is claimed. Gate runs: `npm run test:docs` once at validation (§14), under
the lane rule with no other gate running on this host; no product gate.
Compared with the alternative of answering the fork's items in prose and
amending the orders by hand without independent review, the workflow's
verification refuted fourteen of 162 findings before any edit, which the
hand route would have applied.

**The meta reopen candidate.** `npm run meta -- --check` at the committed
subject reports one reopen candidate, `seeking-the-wrong-goal`: the
elapsed time per code byte worsened over three consecutive closed orders
(`elapsedPerCodeByte` 102.942, up 0.144; `machineryShare` 0.08, down
0.404), the three being WO-218, WO-223 and WO-217 (v0.87.0 to v0.89.0),
and first verification failed in five of the last eight closed orders.
The pass reads it, files no order for it and records why: the three
orders are the boarded-row batches and the one-release repair for the
fork, whose code bytes are small against their full cycles by design,
and the measure cannot separate lane wait from work until WO-229 lands
(§4.1 item 2); the five first-verification failures are the subject of
the batches' paired-control criterion (WO-219 and WO-220) already in the
queue. The candidate stays with `meta` and is reread by the next pass;
it reopens an order only if the ratio worsens again after WO-229's
attribution lands.

## 13. The answer block for the fork's next pass

Paste-ready; the fork reads it against its own records.

```
planning: core's answers to the fork's two request blocks of 2026-10-21 (docs/planning/fork-notes-and-operator-questions-2026-10-21.md, §4, §6 and §13), read at main 926b8234 and the fork's main 8ba47c1.

Blockers and conveniences, for WO-007 and WO-008: nothing filed in core blocks them. The one wait is the live board view over the loopback (a later WS-001 member, not WO-007), until WO-225's release. Conveniences with a working route today, each removed by a named order: the hand bootstrap after a merged update and the release close withheld before it (route: node scripts/bootstrap.mjs on main after the merge; removed by WO-226, first in core's queue); the publish denied by the auto-mode classifier and the admission withheld on your registration edit (route: the `!`-run publish; WO-226 narrows the admission, the classifier stays the host's); the vocabulary lint refusing ordinary words (route: the GUID placeholder on main; WO-227, second); the target Release's text (cosmetic; WO-227); board --json paths, the missing schemas and the console script in an export (routes: your scrub script, pinning core's main, node packages/console/dist/src/cli.js; WO-225, third); the document gate's wall-clock (route: run your gates while no core gate runs; WO-229, fourth). v0.89.0's Read before upgrading names nothing you need; take it at your convenience or skip it.

When the hand steps go away: WO-226 is core's next activation after this planning branch merges, WO-227 follows it, then WO-225 and WO-229; each lands in the starter at its release close and reaches you as your next update. The hand bootstrap, the pull before a release close and the close withheld on the build end with WO-226's release; the GUID edit and the Release text with WO-227's; the scrub script, the schema pin and the direct console CLI with WO-225's; the unexplained gate waits with WO-229's. Core cannot promise away the auto-mode classifier's denial of the publish: WO-226 makes the kit admit the plain spelling, and whether the host then lets the call through is the host's behavior, unqualified until a live publish records it, so the `!` route may stay until then or until the operator adds an allow rule in the operator's own settings. The removal of your interim entries and the two launchpad allows was core's framing of the qualification test (the 2026-10-19 answer), asked for on an unqualified claim (WO-178's reading of the host docs, which no current page supports); the record now says so. Until the live qualification: set hostRules: "literal" on the dotln-angular registration (WO-221's fallback, in your kit since v0.85.0), so worktree start writes the order's exact publish rules into the launchpad's .claude/settings.local.json and release close removes them; whether auto mode honors a rule that begins with the node path is the first observation that order gives. The evidence line the close could not fill is your template's, not the kit's.

A1 confirmed and recorded. A2 and B10 answered: the waits were another checkout's gate in the per-user lane registry (core's product tasks held the lanes; your document selection cannot schedule them), not a first-run build and not your own serialization; measure next: your latest `npm run test:docs` row in docs/control/local/harness/checks.json (durationMs against the summed hostLaneWaitMs of the seven full-capacity tasks), its hostLaneWaitObservations holders against `npm run test:docs -- --list`, the lanes/ folder under `getconf DARWIN_USER_TEMP_DIR`/dotln-host-v1-$(id -u) during a WAIT (report same or other checkout, never the path), and a controlled pair with lanes/ empty and during a core `npm test`; your register row should read the gate's own cost as wall minus that lane wait until WO-229 (fourth in core's queue) separates the two medians and labels each holder. A3 and B9 observed and written into WO-221's row. A4: one README sentence in WO-226. A5: recorded in WO-221's row; the WO-005 draft was a hook no-decision, so your WO-006 fields are the first hook-admission observation. A6, A7, A8: acknowledged; WO-224 is eighth in the queue.

B1: the framework choice is yours for your shell; core pins none and keeps the contract as the boundary; product 04 §Later console hosts names console v1 as DotLn-Angular v0.1.0. B2 to B5: WO-225 (third in the queue): coded reasons so board --json carries no path, the two schemas as kit files, a build that is a no-op in a kit root so npm run console runs in an export, a collector that reads your per-order segments, and GET /runtime-status-v1 and GET /uifa-board-v1 on the resident's loopback for a local origin with the token, outside the command lane, no receipts; keep your mock until that release. B6: WO-226 (first): the release-close recovery, worktree finish and npm run harness prepare the carried runtime in an export instead of a build; `node scripts/launchpad.mjs update --finish` fast-forwards main and bootstraps it; every advisory names the command an export can run. B7: products 03, 04 and 13 corrected in this pass; the console README header is WO-225's; the runtime-status-v1 field keeps its label by the README's additive rule. B8: acknowledged.

Your operator's block: the GUID in $.terms stands until WO-227 (second in the queue) admits an empty list and makes the list a review list (launchpad identifiers are the refused class; DotLn-Angular may say launchpad, gem and mask); the edit lives on main because the lint reads main's committed bytes. The hand checkout and pull before a release close is WO-226's update --finish. A target Release's text is the order's title, a blank line, the objective and the close line (the blank line you saw is the title boundary); WO-227 puts the reviewed RELEASE-NOTES.md on a target Release by a typed header. A committed evidence line that only the close can fill cannot be satisfied: the close has post-merge authority for the tag, the Release and the worktree cleanup and records its observation in the ignored release-close record and the printed form; take that observation into your next planning pass's commit and drop the line from your template.

The admission: the plain node spelling in the verified or closed phase; byte equality with main is narrowed to the publication fields by WO-226, and a piped spelling will get a near-miss advisory; whether a hook allow prevails over the auto-mode classifier is unknown to core too (no published page states it; no live episode has seen the admission return allow), so expect the classifier may still deny and keep the `!` route as the operator's fallback until that episode is recorded in your WO-006 fields.
```

## 14. Validation and independent judgment

Checks run on the working tree after the last write of the subject: `npm
run plan -- followups --sync` and `--apply` in three batches (§10); `npm
run work-orders -- index` (both pages current); `npm run sync`
(publication locks regenerated after the product edits; every edition
current); `npm run meta -- --plan-cost` after the subject's commit (the
cost table needs the committed orders); `npm run plan -- check` (green
once the receipt was filed). `npm run test:docs` before the receipt: 24
passed and 3 failed in 154.31 s, the three being `plan` (the subject's new
orders were not yet committed), `plan-refutation-current` (no receipt yet)
and `entropy` (skipped behind `plan`); the first run of the gate had
flagged two stale publication locks, regenerated by `npm run sync`. The
final runs after the receipt are below.

**The refutation.** One fresh background `dotln-worker` was given only the
canonical prompt of `npm run plan -- refute` for commit `faa1945f`
(claude-opus-5-5 by its definition and as its own context stated; effort
read from the inherited `CLAUDE_EFFORT=xhigh`, with no per-agent readback;
the receipt's episode record reads unknown for harness, model and effort,
because no readback exists) and judged all nineteen sequenced orders and
the sequence in 1,176,551 ms over 66 tool uses and 314,723 tokens, with no
formatting repair needed; it validated its own result against the
repository's `validatePlanResult` before returning it, made no repository
or Git write, spawned nothing, and one attempt to write a scratch copy of
the cost table was refused by the project hook as an outside-project write
with nothing written. The parent saved the result and statement into the
ignored control lane and the helper filed them. Receipt
`2026-10-22-planning-5bb6c2ac729c3e47-052`: plan verdict
aligned-with-findings, no hold; WO-204, WO-183, WO-091 and WO-096 aligned;
fifteen orders aligned-with-findings with 22 known-issue findings, each
with a reopening observation, recorded on the fifteen catalog rows as
receipt 052's known issues. Three are corrections of fact accepted for the
next pass, because the text they name is judged subject and a repair after
the judgment would need a fresh one: WO-193's Cost line and live-run
bullet cite criterion 14 for the live issue, which the split made
criterion 8; the same Cost line still credits the merge with the cycle and
re-mint WO-228 now pays; and the sequence's sentence that the predecessor
track is blocked by nothing in the queue is wrong, since WO-228's
criterion 5 calls WO-193's `draftRequest` (its planning-deferral edge on
WO-193 is right). The findings the planner weighs most: WO-227's unmarked
private terms becoming review by default with the reviewer as the
confirming actor, which the executor must answer in its first decision
(the design's own axis is that the operator judges context, so the
fail-safe migration of unmarked lines and the operator's recorded word
for private-term confirmations are the shape to build); WO-226's relaxed
admission letting an order change its own gate commands (a `commandsHash`
comparison with main's committed gate is the shape); the cold-start
headroom WO-226 and WO-192 spend (281 and 424 bytes); WO-220 and WO-204
each owing a live feedback episode on the same file; and WO-224 sitting
ahead of the critical-path run without being its prerequisite, which the
operator may change by one sequence edit.

**Final gate.** `npm run test:docs` after the receipt and the catalog
rows' known issues: 27 passed and 0 failed in 154.37 s, 27 fresh tasks,
under the lane rule with no other gate running on this host (the two
earlier runs: 4 passed and 23 failed on the stale publication locks, then
24 passed and 3 failed on the uncommitted orders and the missing receipt).
The gate is run once more at the final bytes of this document after this
section is written; its result is recorded in the pull request's body and
in the ignored checks record, and a failure there would be repaired before
the push.
