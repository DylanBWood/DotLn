# Planning pass — release close, the entropy proposals, the follow-ups, document accretion and the fork's second block (2026-10-28)

This document is the record of the day. The standing results of the pass
are in the places that hold current state: the [sequence](sequence.md),
the [map](work-order-map.md), the orders
([WO-239](../work-orders/WO-239-release-close-prepares-before-it-loads-and-runs-once.md),
[WO-238](../work-orders/WO-238-a-document-says-what-is-so.md),
[WO-235](../work-orders/WO-235-no-artifact-shaped-by-its-predecessor.md)),
product 07 and the follow-up register. Nothing below is meant to be read
again once those are.

## 1. Dispatch, capture and direction ledger

Dispatch: `planning:` with five numbered items and a pasted block from the
DotLn-Enterprise-Starter fork's second pass of 2026-10-28, sent at
2026-10-29T02:36:25.671Z (hook time; the operator's local date is
2026-10-28) in Claude Code, Fable 5.1 at `max`, operator-selected. One
mid-turn message at 02:43:49.172Z. Both are captured verbatim in ignored
intake, `docs/intake/notes/planning-document-contract-and-release-close-2026-10-28.md`,
SHA-256 `1fd328b01272d8b90a6ca2cc1beca9e71d5d2473d20026390899082c03c13141`.
Branch: `planning/2026-10-29-document-contract-and-release-close` from
clean `main` at `7b0a5b5c` (v0.102.0).

| Hook time (UTC) | Message | Event read | Aim | Disposition |
| --- | --- | --- | --- | --- |
| 02:36:25.671Z | Items 1 and 1.a: release close takes 20 to 30 minutes; the same rebuild error twice | OperatorReportsRepeatedFailure | find the cause, fix it if avoidable | acted on: §3, WO-239 |
| 02:36:25.671Z | Item 2: the follow-ups from WO-236 and recent orders | OperatorDirection | act on them | acted on: §5 |
| 02:36:25.671Z | Item 3: no entropy proposal acted on | OperatorRejectsUnsupportedAssumption (the pass's record, not the operator's, is judged) | account for every proposal; fix the route | acted on: §4, WO-238 |
| 02:36:25.671Z | Items 4 to 4.e: documents that accrete; the kit's part; a useful fix, not removal, not byte caps; references | OperatorCorrectionReceived | diagnose the mechanism in core and the kit; propose and file the fix; answer with references | acted on: §6, WO-238, WO-235, §11 |
| 02:36:25.671Z | Item 5: the fork's block | OperatorDirection (carried evidence, not direction, per product 07 item 5) | dispose each item | acted on: §12 |
| 02:43:49.172Z | "im not sure why i need to authorize them; if they are useful then they are useful…" | OperatorDirection | decide the follow-ups by usefulness; give a summary of each with its disposition | acted on: §5 (the table is the summary; the operator may re-dispose by list) |
| 03:40:36.604Z | "so my initial prompt, all fup, all entropy proposals netted 1 new work order...?" | OperatorAnswer sought (a question on the count) | account for where every input went | answered in the session with the routing table of §5 and §7: two new orders, one amended, the rest routed into orders owning the surface; no change to the plan |
| 03:41:53.976Z | "oh nice" | OperatorAnswer (acknowledgement) | none | recorded; no action |

Aim stated before acting: diagnose with evidence, act inside planning
authority, file what needs code, answer every item. Assumption recorded:
"follow ups from wo-236 and other recent work orders" means the decisions
WO-236, WO-234 and WO-233 recorded as operator-directed follow-ups (eleven
in WO-236, one in WO-234, eight in WO-233), which the register carries as
deferred rows reopening on "a future planning pass". Reopen if the
operator meant another record.

## 2. Readings at entry

- `plan start`: 5 failure items since receipt 057 (WO-234's VER-001 and
  VER-002 failed and were repaired; one execution amendment, D009), 0
  final-review escapes in 10 reviews, 4 local release closes (2 dry runs),
  0 host denials, 5 interventions (3 unclassified), 3 long phases, 8 recent
  closes (3 delivery, 5 machinery). WO-234's two failed verifications are
  routed by their repairs (VER-003 passed; closed as v0.102.0); nothing
  further to route.
- `plan conditions`: 3 hold. The plain gate's thirty-day median is 490 s
  against 360 (FUP-e96221b106cd136a); the skeleton task's latest fresh run
  514 s against a 302 s median; the target-worktree task 611 s against
  127 s. Re-disposed in §9.
- `gh issue list`: no open issues.
- Canonical status: WO-234 closed; no active order in this checkout; WO-192
  active in its preserved worktree (`DotLn-wo192` at `939af628`).
- `harness usage`: "Token measurement requires an active role and dispatch
  start" at entry; counters unknown; re-read at handoff (§13).
- `entropy subject`: `review` (no filed review is refuted and undisposed;
  REVIEW-007 of 2026-10-20 is the latest). Not run: this is not an
  `entropy reducer` dispatch (§10, item 4).

## 3. Release close: where the minutes go (items 1 and 1.a)

Evidence: the retained close records `docs/control/local/retained/WO-236/release-close.json`
and `…/WO-234/release-close.json` (ignored lane), their transcripts, the
WO-234 session's `release-close-decisions.md`, and three measurements taken
in this pass under `node scripts/harness.mjs bounded --` on `main` at
`7b0a5b5c`.

The two closes of 2026-10-28, each three helper invocations:

| Close | Invocation | Start → record | Duration | Outcome |
| --- | --- | --- | --- | --- |
| WO-236 (v0.101.0) | `--dry-run` | 18:50:52Z → 18:55:14Z | 4 min 22 s | preview |
| | `--publish` | 18:55:31Z → 19:04:05Z | 8 min 34 s | tag and Release published; worktree removed; starter refresh refused: "harness contract: outside-write grant needs a closed kind, source and operator absolute root"; prune removed 398 roots (1.24 GB) |
| | `--publish` (retry) | 19:05:12Z → 19:10:09Z | 4 min 57 s | already published; starter refreshed |
| WO-234 (v0.102.0) | `--dry-run` | 02:17:46Z → 02:21:47Z | 4 min 1 s | preview |
| | `--publish` | 02:22:13Z → 02:27:35Z | 5 min 22 s | published; starter refresh refused: "the export's harness emit differs from the bundle core's compiled packages predicted: .claude/hooks/commit-msg.mjs"; prune removed 294 roots |
| | `--publish` (retry) | 02:29:19Z → 02:34:10Z | 4 min 51 s | already published; starter refreshed |

End to end: 19 min 17 s for WO-236 and 16 min 24 s for WO-234, plus the
session's reading before the first invocation. That is the 20 to 30
minutes.

Where one invocation's minutes go. The helper records step timings for
the starter refresh only: preparation 2.4 s, update 0.2 s, verification
0.6 s, commit 0.02 s, push 1.8 s, tag 3.1 s (about 8 s). Measured here:

| Step | Measured | Note |
| --- | --- | --- |
| `node scripts/harness.mjs prune` (dry run; the census the close runs) | 186.9 s | 5,633 retained roots walked, 4,690 of them gate fixtures under the system temp directory |
| `npm run build` | 1.0 s | nothing to rebuild on `main`; at a close it is a real rebuild (unmeasured) |
| `npm run license-surfaces` | 1.9 s | |

The refuter's NoOp reading, verified by this pass against the retained
records: WO-232 closed on 2026-10-25 in one invocation of 25 s with no
prune; the prune joined the close with WO-233's implementation
(`f4163301`, 2026-10-27), and WO-233's own close on 2026-10-28 took 13 min
47 s over two invocations (386 s preview, 441 s publish; 4,126 and 4,720
roots retained). The 20 to 30 minutes began there.

Inference, labeled: the census is about three of each invocation's four to
five minutes, and it ran in every one of the six invocations (9 to 10 of
the 16 to 19 minutes). The remainder is the worktree-removal scan (its
record is 4.4 to 6.7 MB and lists every ignored path; the transcript line
is 800 KB), the rebuild and the GitHub calls. The helper will record its
own step timings after WO-239, which turns this inference into a reading.

Why three invocations instead of one:

1. The role runs `--dry-run` first. The handoff and the skill offer it
   ("`--dry-run` previews the same publication and manifest"); nothing
   requires it, and the publish command is idempotent ("re-running the same
   command re-checks an existing Release and never publishes twice").
2. The publish is refused at the starter refresh because the process's
   runtime is stale. `release.mjs` obtains the writer release at line 3924
   before `close()` at 3943; `executorWriterRelease`
   (`scripts/lib/executor-handoff.mjs` 31) imports
   `packages/skeleton/dist/src/harness-host.js`, which imports the
   compiler. `ensureReleaseRuntime` (1815; `npm run build` at 1844) runs
   later, inside `close()` (3318, 3346, 3445). Node caches a module for
   the life of the process, so the rebuilt files on disk are not what the
   process runs: `expectedHarnessBundle` (`scripts/launchpad.mjs` 900)
   imports `scripts/lib/harness.mjs` "after the build", but its static
   import of `packages/compiler/dist/src/index.js` (54) resolves to the
   already-loaded old compiler, and `COMPILER_PACKAGE_VERSION` (338) is
   the old version. The export's fresh emit in the disposable worktree
   runs the new runtime. WO-234's case: the generated `commit-msg.mjs`
   embeds the compiler version, so the prediction differs. WO-236's case:
   the fourth grant kind (`target-worktree`) exists in the new compiler
   and not in the loaded one (`packages/compiler/src/harness.ts` 363), so
   the old validator refuses the new emit. Main had just been
   fast-forwarded to a merge that changed the compiler both times; the
   `dist` on disk was the pre-merge build. The WO-234 session recorded
   this inference and retried in a fresh process; the fresh process
   passed both times. The fork runs the kit's `release.mjs`, so its close
   met the same thing.

Avoidable: yes. WO-239 (§7) prepares the runtime before anything loads it,
runs one invocation by default, bounds the census at close, records step
timings, and takes WO-236-D014 (integration at named points, never during
a live gate, free when nothing is behind). Until it lands, the close
recovers as it did: the printed command re-run in a fresh process.

## 4. The entropy proposals (item 3) and the 5S workers (item 4.e)

The register (`docs/control/entropy-reducer.jsonl`): six reviews filed
(REVIEW-002 to 007), seven refutations, 35 finding dispositions (31
accept, 4 defer, 0 declined), twelve proposal packets filed under
`docs/proposals/`. Every packet was routed into an order as its design
record, and every one of those orders has closed:

| Packet | Route | State |
| --- | --- | --- |
| content-addressed-evidence-inputs; behavioral-staleness-key-for-evidence-editions | WO-154 | closed, v0.46.0 |
| cold-start-trend-and-single-source-floor | WO-155 (and WO-100 as a boy-scout item) | closed, v0.46.1 (WO-100 v0.44.0) |
| isolated-codex-launch-home | WO-159 | closed, v0.48.0 |
| constant-process-console-collection | WO-164 | closed, v0.52.7 |
| entropy-review-delegate-route-agreement | WO-165 | closed, v0.52.1 |
| gate-identity-covers-suite-inputs; machinery-selection-follows-imports | WO-174 | closed, v0.58.1 |
| reopen-conditions-evaluated-at-planning-entry | WO-175 | closed, v0.58.2 |
| pinned-collector-bytes-observed | WO-200 | closed, v0.76.1 |
| frozen-subject-has-no-route-home; operator-word-reopen-observable | WO-219 | closed, v0.94.0 |

So the machinery findings were acted on. Four things make it look as if
nothing was:

1. `docs/proposals/` is write-only. Each packet says "Filing records the
   packet. Promotion to a work order remains an operator-authorized
   planning act" and is never touched again; nothing in it says WO-164
   shipped it. Twelve directories read as twelve un-acted proposals
   forever. WO-238 gives a packet a `deliveredBy` field written at
   disposal and at the carrying order's close, and backfills the twelve.
2. The reducer cannot propose what no lens asks. Its four briefs
   (`packages/skeleton/src/loadouts/entropy-reducer.ts` 93 to 179) ask where
   doctrine and implementation disagree, where an effect escapes its
   authority, which claim lacks a witness, and which repeated cost should be
   standardized. None asks whether a document is read, current or
   accreting, so six reviews produced no finding on the thing item 4 is
   about. WO-238 adds a fifth brief, `documents-and-readers`.
3. Nothing runs between the operator's passes. A review runs only on
   `planning: entropy reducer` (product 07); the last was 2026-10-20, and
   17 orders have closed since. The fresh episode `entropy subject` asks
   for is not run by this pass (§10).
4. There is no 5S worker. WO-091 compiles the 5S equipment set as loadout
   data for the Repo Gardener (mechanics, set bonuses, a scenario), and the
   compiler's `seiri` support (`packages/compiler/src/seiri.ts`) is a
   20-minute pulse keyed to operator presence, wired into the skeleton's
   reactor and scenarios. Nothing in the tree walks documents and proposes
   removals, and WO-091 is twelfth in the queue. The cheap, deterministic
   Sort is a census of what sessions read (§6); the reducer stays the
   judgment layer on top of it.

## 5. The follow-ups from WO-236, WO-234 and WO-233 (item 2)

The operator's message of 02:43Z: the follow-ups need no authorization;
if useful, they are useful; failing that, a summary of each and a list.
This pass decides each by usefulness and records the disposition; the
table is the summary. The operator can re-dispose any row by naming it.

| Decision | What it would do | Disposition |
| --- | --- | --- |
| WO-236-D014 | Integrate `main` only on explicit authority and at the lifecycle's named points, never during a live gate; skip the helper when ancestry shows nothing to take in | allocated to WO-239 (steps 5 and 6) |
| WO-236-D016 | Stop tests that bless implementation output: an expected-data update names its cause with provenance; brittle duplicated metadata consumers exposed | allocated to WO-235 as a carry-in (the oracle re-mint it owns; the reviewer's checklist) |
| WO-236-D017 | Make the consistency review trace a changed contract through its consumers with file-level evidence instead of a generic no-omissions claim | allocated to WO-235 (the reviewer brief in the shared role text) |
| WO-236-D018 | Make that correction durable in generated guidance, with evidence it catches the known missed consumers | allocated to WO-235 (same step) |
| WO-236-D019 | Diagnose incomplete or interrupted chat answers | declined as an order: the cause is unobserved and the decision says so; reopen on a reproduced fragment with the journal's full text beside the rendered one (§10) |
| WO-236-D020 | Answer operator questions and corrections before further tool work | allocated to WO-235, whose objective already carries it (the ledger, the freeze, the turn-end refusal) |
| WO-236-D021 | Remove the repeated Cost paragraph from the public work-order index | allocated to WO-238 (step 8) |
| WO-236-D022 | The planning entry point shows the current plan; pass history sits behind an archive view | applied to the sequence in this pass (§8); the move of the dated pass documents is WO-238 (step 10) |
| WO-236-D024 | Distinguish contract consumers (DotLn-Angular) from export siblings in the registry and the generated Siblings page | allocated to WO-207 as a carry-in on its row (the kit-update order that owns the siblings registry) |
| WO-236-D025 | Measure a recurring check's cost before adopting it into a gate | settled by write-back: product 07's planning screens now require the measured cost (§11) |
| WO-236-D026 | Redesign product 07 around its readers: a concise operator reference, the roles' procedures, history elsewhere | allocated to WO-238 (step 11), judged by the census of which sections roles cite and read |
| WO-234-D028 | A damaged gate-row store's standing error names its file | left on its row: it reopens on the next order touching `dispatch-bound.mjs`; no order filed here touches it |
| WO-233-D033 | The intermittent source-change launch refusal in the WO-204 recovery case | deferred: no new observation since; stands |
| WO-233-D046 | Writer protection scope; a bounded or cached global census; empty owned containers | the census half allocated to WO-239 (step 3: a bounded census at close; the global walk stays at `harness prune` and session end); the other halves stay deferred |
| WO-233-D054 | Browser temporary directory ownership | deferred: no order touches `browser-evidence`; stands |
| WO-233-D058 | An unmarked legacy session scratch tree under the system temp directory | deferred: its reopen (a dry-run prune retaining such a tree) is the test; the prune run in §3 retained none by that reason in its first page; stands |
| WO-233-D076 | The residue lines in the shared instruction file: one line per rule or one per profile | allocated to WO-238 (step 9: one line per profile naming its rule ids) |
| WO-233-D077, D080 | The four hand-written CLAUDE.md lines: confirm or strip at merge | settled: the operator merged WO-233 with the lines present (commit `e35caed6` is in `main`'s history; the pull request body named the choice) |

## 6. Documents that only accrete (items 4 to 4.e)

### 6.1 What was read

- The fork's operator record at `0968ccd0`: 34,149 bytes. Its first
  paragraph licenses the growth ("it changes only when the operator says so
  or a pass records a new direction with its date"); ten passes read that
  as leave to narrate the day, and a section characterizes the operator.
  The fork has since cut it to its standing directions (about 16 KB); the
  operator says that cut is fine for now.
- The fork's `docs/repositories/dotln-angular.md` at `1ce79f9a`: 31,692
  bytes; its `**Checked:**` field holds a 2,000-word paragraph narrating
  WO-006 to WO-019. That field came from the kit:
  `scripts/kit/repository-profile.template.md` seeds
  `docs/repositories/README.md` with `**Checked:** <date or commit this
  profile was last checked against the repository>`, a field that asks for
  a date and gets a history.
- Core has the same disease. `docs/planning/sequence.md`: 18,876 bytes, 85
  dates, 23 pass citations, fifteen paragraphs of which pass retired which
  order. `docs/planning/work-order-map.md`: 835,715 bytes, 953 dates, 3,169
  order references. Product 07: 276,553 bytes, 133 dates; its planning
  screens read "One more [2026-10-19 pass]: … One more [2026-10-20 pass]:
  …". `docs/planning/`: 51 documents, 37 MB with refutations.
  `docs/evidence/`: 223 MB. Core's own `CLAUDE.md` carries eleven generated
  residue lines ("codex-cli-0.153.4: no-attribution: No project hook fired
  in the bounded Codex probe…") that every session reads.
- `docs/proposals/`: twelve packets that never learned they shipped (§4).
- Each close's transcript: 800 KB, of which one line lists every ignored
  path (§3).

### 6.2 Why it happens here (the mechanism, not a mood)

1. **The roles are told to record and never told where.** The shared rules
   say record decisions with sources and reopening conditions, record
   failures and corrections while continuing, label every inference with
   its evidence, never rewrite history. They say nothing about which
   documents hold state and which hold history. A role that must cite and
   may not delete appends: the dated paragraph is the path of least
   resistance that satisfies every rule it was given.
2. **Provenance inline.** "Evidence before claims" is read as "every
   sentence carries its citation", so a standing rule becomes "rule (the
   2026-10-13 pass, §12.2; operator direction 2026-10-07)". In a record
   that is right. In a standing document the citation should be a link to
   the record and the sentence should be the rule.
3. **No definition of kinds.** `docs/planning/` holds the sequence (state)
   beside 51 dated pass documents (records); the map holds the catalog
   (state) beside dated candidate sections (records, and the register's
   keys); product 07 holds procedures beside their history. Nothing says
   which is which, so a reader entry point (CLAUDE.md's Start here, a role's
   `Read:` line) can point at a record, and a record can be read at every
   session start, as the fork's operator record was.
4. **The only signal is bytes.** The document check judges ceilings
   (`docs/control/doc-ceilings.json`); the meter records bytes. Nothing
   measures whether anyone reads a document, although the Claude hooks
   observe every `Read`, `Edit`, `Write` and `Bash` call
   (`packages/skeleton/src/harness-host.ts` 325, 1246) and journal them.
5. **The kit exports the habit.** The profile template's `Checked:` field;
   the 57,675-byte instance README (`scripts/kit/README.client.md`) that
   explains the kit on the instance's front page; the generated residue
   lines; and product 07 itself, carried to every instance, whose planning
   section is the model an instance planner imitates (WO-235's observed
   gap: "a prior instance read as the pattern").

### 6.3 The fix

The cap the operator asks for is on the behavior, not the bytes. Four
mechanisms, all filed:

1. **A contract of kinds** (WO-235 amended for the rule; WO-238 for the
   check). Every committed document is one of three kinds. A **standing**
   document states what is so for a named reader; a change replaces the
   sentence that is now wrong and links the record; it carries no dated
   account. A **record** is dated and immutable, one per event (an order's
   decisions, a pass's document, a verification, a receipt), never read at
   session start, reached by link. A **generated** document is derived by a
   command and never edited. Every reader entry point names standing
   documents only. The kind is derived by path class with an override file,
   not by a per-file field, because a per-file field is itself an appendage.
2. **The reader is the measure.** A standing document has a reader binding
   derived from the entry points and the links that reach it, and a read
   census from the journals the hooks already write counts the sessions
   that read it over the last N releases. `plan start` prints the red
   tags: standing documents no entry point names and no session read.
   A red tag survives one pass; the next pass removes or folds it, with a
   disposition. Size never enters: a document a role reads at every
   dispatch stays whatever its length; a 200-byte file nobody reads goes.
3. **Judgment where judgment is needed.** No word list, byte or pattern
   check guards narrative (the operator's and the fork's rejection). The
   final reviewer judges a changed standing document's diff: replacement,
   or a dated account added under a standing heading, which returns to
   repair. The structural checks judge kind, reader and entry points only.
4. **The kit stops exporting the habit.** The profile template loses
   `Checked:` for a current-state field set and a rule line; the instance
   README says what the instance is and where the kit's documents are; the
   residue becomes one line per profile; product 07 is split by reader on
   the census; the index cards drop the Cost paragraph; the dated pass
   documents leave the planning root for `docs/planning/passes/`; the
   reducer gets a lens that can see documents; a packet learns what shipped
   it. Document byte ceilings retire; role cold-start ceilings stay (a role
   root is context the host pays every turn; a document's size is not its
   usefulness).

Applied in this pass, inside planning authority: the sequence is cut to its
current state (§8); product 07 gains the contract paragraph, the operator-
record sentence the fork asked for, and the measured-cost screen (§11); the
map gets its rows and candidates (§9). Not applied: removing any document.
The fork's operator record stays, as its standing directions; the bet on
its removal is lost by the proposer.

### 6.4 Is anyone smart enough to help? Yes, and it is an old problem

Verified by search in this pass (titles and claims from the pages found;
the full texts were not read, so quote from the sources, not from here):

- Ward Cunningham's wiki named the two modes in the 1990s: **ThreadMode**
  (chronological, appended discussion) and **DocumentMode** (one synthesized
  statement), with **refactoring** ThreadMode into DocumentMode as the
  maintenance act, and Cunningham on record that chronological ordering is
  rarely right for technical writing
  ([ThreadMode](https://scrapbox.io/nishio-en/ThreadMode),
  [Thread Mode Considered Harmful](https://c2wiki.gothdyke.mom/ThreadModeConsideredHarmful.html),
  [ThreadModeAndRefactorOk](https://intertwingly.net/wiki/pie/ThreadModeAndRefactorOk)).
  Every accreting file here is ThreadMode; the kinds contract is
  DocumentMode above the line and the record below it.
- Mike Caulfield, *The Garden and the Stream: A Technopastoral* (dLRN
  keynote, Stanford, 2015; Hapgood, 2015-10-17): the stream is a single
  time-ordered path, the garden an arrangement of relationships tended by
  linking, annotating, changing and summarizing
  ([notes](https://joel.is/notes/The_Garden_and_the_Stream-_A_Technopastoral),
  [history of the digital garden](https://maggieappleton.com/garden-history?s=09)).
  Standing documents are gardens; records are the stream.
- Andy Matuschak, *Evergreen notes*: "written and organized to evolve,
  contribute, and accumulate over time", revised rather than piled up,
  against transient notes
  ([notes.andymatuschak.org](https://notes.andymatuschak.org/Evergreen_notes)).
- Google's documentation best practices: *minimum viable documentation*
  (a small set of fresh documents beats a large neglected pile), *update
  docs with code* and *delete dead documentation* (stale docs mislead and
  drain; a keep-or-delete pass with delete as the default)
  ([google.github.io/styleguide/docguide/best_practices](https://google.github.io/styleguide/docguide/best_practices)).
- Winters, Manshreck and Wright (eds.), *Software Engineering at Google*
  (O'Reilly, 2020), chapter 10, Documentation: know your audience and write
  for one reader type per document; treat docs as code with an owner, a
  review and a freshness date; deprecate and delete when no longer relevant
  ([O'Reilly chapter page](https://www.oreilly.com/library/view/software-engineering-at/9781492082781/ch10.html),
  [review](https://accu.org/bookreviews/2021/bruntlett_1956)).
- Daniele Procida, *Diátaxis*: four documentation types by the reader's
  need (tutorial, how-to, reference, explanation), one type per page,
  adopted by Canonical ([diataxis.fr](https://diataxis.fr),
  [Canonical](https://ubuntu.com/blog/diataxis-a-new-foundation-for-canonical-documentation)).
- GitLab's handbook: a single source of truth, handbook-first (document
  the change, then announce it), one place so no duplicate source of truth
  can drift ([handbook-first](https://handbook.gitlab.com/handbook/company/culture/all-remote/handbook-first/),
  [handbook usage](https://handbook.gitlab.com/handbook/handbook-usage)).
- Hiroyuki Hirano's **red-tag strategy** for 5S Sort: tag what may be
  unneeded, ask whether it is needed, how often and where, hold it for a
  fixed period, then dispose; several criteria, not one; run it at least
  twice a year, ideally continuously
  ([ISHN](https://ishn.com/articles/99809-s-red-tag-strategy---implementation-at-your-facility),
  [red tagging guide](https://www.learnleansigma.com/?p=11987)). The
  census red tag with a one-pass holding period is this, with "read by a
  session" as the use criterion.
- Michael Nygard's architecture decision records (2011) are the model this
  repository already follows for decisions: immutable, dated, one per
  decision, superseded rather than edited, with the current state kept in
  an index. The failure here is applying the record's rule (never edit)
  to standing documents.

None of these is a byte cap. All of them separate what is so from what
happened, give every document a reader, and delete what no reader needs.

## 7. Orders filed and amended

- **WO-239 — Release close prepares before it loads and runs once**
  (new; machinery; patch). The helper prepares the runtime in a child
  process before any built module is imported; one `--publish` invocation
  closes an order and the preview is for a prerequisite in doubt; the
  census at close is bounded to the closing order's roots, main's retained
  lane and this checkout's temporary roots; the removal record and the
  transcript carry counts, with paths behind a flag; the close record
  carries step timings; `worktree integrate` refuses during a live gate
  and returns before any stash when nothing is behind; two role sentences.
  Takes WO-236-D014 and the census half of WO-233-D046.
- **WO-238 — A document says what is so** (new; machinery; minor). The
  kinds contract and its checks, the reader binding, the read census and
  `plan documents`, the fifth reducer lens, `deliveredBy` on packets, the
  kit templates and the instance README, the residue lines, the index
  cards, the pass documents' move, product 07 split by reader, the
  reviewer's checklist item, document byte ceilings retired. Takes
  WO-236-D021, D022, D026 and WO-233-D076.
- **WO-235 — amended.** The shared role rule covers standing documents
  (the state-not-story rule beside the shape rule); the writing guidance
  names the document's kind and reader; carry-ins D016, D017, D018 and
  D020 written in; the operator's direction of 2026-10-28 (4.c) recorded
  in its provenance. Un-activated; judged by this pass's refutation.

Both new orders carry a Design with rejected alternatives and their axes,
an Execution plan with one file and one check per step, Preflight lines
and criteria ending in `npm test` and `npm run test:docs`, as product 07's
artifact list requires. Neither sets a byte bound.

## 8. Sequence

WO-236 (v0.101.0) and WO-234 (v0.102.0) closed on 2026-10-28 and leave the
list. The order: WO-235 (the operator placed it on their corrections of
2026-10-26); WO-239 second, because every release pays the close and the
order is small; WO-238 third, before WO-237 (the operator's "fourth, after
WO-235" placed WO-237 relative to orders now closed; the planner reads the
document contract as the operator's loudest direction of this dispatch and
places it ahead of the journals lane, which no one is waiting on); WO-237;
then the list as it stood. The operator may move any of these by one
sequence edit.

The sequence document itself is cut to its current state: the rules in
force and the current order with one line of rationale each (WO-236-D022,
applied). Its fifteen paragraphs of retirement history are already in the
generated history page and the dated pass documents they cite; nothing is
lost, and the planner stops rewriting the preamble each pass.

## 9. Register dispositions

Recorded through `npm run plan -- followups --apply` in this pass (the
batch is in the ignored lane; the register shows each):

- WO-236-D014 → allocated, WO-239. D016, D017, D018, D020 → allocated,
  WO-235. D019 → declined (NoOp, §10). D021, D022, D026 → allocated, WO-238.
  D024 → allocated, WO-207. D025 → settled (the write-back of §11).
- WO-233-D046 → allocated, WO-239 (the census half; the rest deferred on
  the row). D076 → allocated, WO-238. D077 and D080 → settled by the
  operator's merge. D033, D054, D058 → deferred, unchanged evidence.
- WO-234-D028 → unchanged (deferred to the next touching order).
- FUP-b44117f7b047e976 (template-derived files in the preview) → still
  allocated to WO-207, with the fork's third carrier (README.md at
  v0.101.0) added as evidence.
- FUP-be6721fbdd4b6285 (WO-236-D029, the hook latency) → deferred, with
  the fork's observation (item 5) as the field case; the fork records the
  measured cost from its WO-019 resume.
- FUP-e96221b106cd136a (the plain gate's median above 360 s; fired) →
  deferred: no order is filed on the figure because the growth is not
  attributed to orders (`plan conditions` gives task medians, not the
  rows that moved them); the measured-cost screen of §11 is the standing
  rule for new recurring work, and WO-239's step timings give the next
  pass the close's share. Reopen when a gate task holds at a row whose
  order's decisions do not name the growth, or the median is still above
  360 s when WO-239 closes.
- New rows minted from the map's candidates section of this pass (§10 and
  the fork's item 6 → WO-088).

## 10. NoOps (declined with their reversal conditions)

Each is recorded as a numbered candidate in the map's section for this
pass, in the `NoOpIntent` shape, so the register carries it:

1. A fresh Entropy Reducer episode now. Declined: not an `entropy reducer`
   dispatch; an episode costs about 993 s and USD 9.50 and the reducer has
   no document lens until WO-238. Reopen: the operator's next
   `planning: entropy reducer`, preferably after WO-238's release.
2. A continuously running 5S worker. Declined: no running actor exists or
   is filed; the census (WO-238) is the deterministic Sort and costs a
   journal read. Reopen: the census red-tags documents two passes running
   with no removal, or the operator directs a running worker.
3. Removing the fork's operator record. Declined: it is a standing
   document with a reader (every role at session start); the contract
   keeps it as standing directions. Reopen: the fork's census shows no
   role reading it over N releases.
4. A word list, byte or pattern check against narrative in standing
   documents. Declined: the operator's direction and the fork's item 7;
   the reviewer's judgment with evidence takes the role. Reopen: the
   reviewer misses dated narrative added to a standing document in two
   consecutive closes.
5. A default `--dry-run` before every close. Declined: the publish is
   idempotent and the preview doubled the cost; WO-239's role text keeps
   the preview for a prerequisite in doubt. Reopen: a publish fails on a
   prerequisite a preview would have shown.
6. Diagnosing incomplete chat answers (WO-236-D019). Declined as an order:
   the cause is unobserved. Reopen: a reproduced fragment with the
   journal's full text beside the rendered one.
7. Caching the global census instead of scoping it at close. Declined in
   WO-239's design (a cache can retain a root whose owner died). Reopen: the
   scoped close census retains an expired root the global walk would have
   removed.
8. Moving the map's dated candidate sections out of the map. Declined for
   now: they are the register's source keys. WO-238 puts the catalog above
   a record divider and the dated sections below it; WO-088 owns the
   register's source model. Reopen: WO-088 activates.

Allocated candidates recorded in the same section: passage ids from an
instance's purpose block and plan-level findings for a zero-order pass
(the fork's item 6) → WO-088; document byte ceilings retired → WO-238.

## 11. Write-backs and ceilings

Product 07 (`docs/product/07-execution-guide.md`):

- §Operator-opened planning pass: a paragraph stating the document kinds
  contract as the planner reads it, including the sentence the fork asked
  for: an instance's operator record is a standing document carrying the
  operator's standing directions, each as the rule with its date and
  capture digest, never an account of the day, the history of a rule or a
  characterization of the operator; the pass's own document holds the day.
- §Operator-opened planning pass, the screens before filing: an order that
  adds recurring work to a gate, a hook, a prune or a close names that
  work's measured cost before and after (WO-236-D025).
- §Documentation freshness and ownership: the state-not-story rule
  generalized from product documents to every standing document, with the
  record named as the home of the dated account.

Ceilings: every product document's ceiling is set to its measured
non-exempt bytes plus one tenth, citing this document, as the standing
policy requires until WO-238 retires document ceilings (the operator's
direction of 2026-10-28 is the reopening evidence recorded on WO-238).

## 12. Answers to the fork (paste-ready)

```text
Answers from core's planning pass of 2026-10-28 (docs/planning/document-contract-and-release-close-2026-10-28.md) to the DotLn-Enterprise-Starter fork's block of its second pass of 2026-10-28 on v0.101.0. Read each against the record it names.

1. Recorded. README.md as the third template-derived carrier in two releases is added as evidence on core's row FUP-b44117f7b047e976, allocated to WO-207 (the kit-update order); a convenience, your update continues. Core's two closes of 2026-10-28 each refused the starter refresh once and succeeded on a fresh-process retry; the cause (a compiler loaded before the helper's own rebuild) is WO-239, second in core's queue; until it lands, a refused refresh is re-run as printed, in a fresh process.
2. Recorded; nothing asked. Your first journaled granted write or refusal is read when your next block carries it.
3 and 4. Recorded; nothing asked.
5. Recorded on FUP-be6721fbdd4b6285 as the field case for D029's latency; the row reopens on the measured cost your WO-019 resume records.
6. Allocated to WO-088 (planning documents as checked contracts) as a carry-in with the design: the compile issues passage ids from an instance's dotln-purpose block (one per paragraph, `purpose:N`) the way it does from core's vision theses, and a marked critical-path sentence in that block replaces the "unavailable" critical path; the result schema admits plan-level findings when the judged horizon has zero orders (today `orders.length` must equal the subject's, plan-refutation-protocol.ts 186 and 386, so a zero-order pass can carry findings only in the statement). WO-088 is tenth in core's queue; a convenience, your zero-order refutations stay settled by the compile until then.
7. Done, in product 07 §Operator-opened planning pass, with your wording's substance: an instance's operator record is a standing document carrying the operator's standing directions, each as the rule with its date and capture digest, never an account of the day, the history of how a rule arrived or a characterization of the operator; the pass's own document holds the day. Core generalizes it: every committed document is standing, record or generated; a standing document holds current state for a named reader and is replaced, not appended; a record is dated and immutable and is never read at session start. The rule enters every generated role with WO-235 (first in core's queue) and the checks, the read census and the kit templates with WO-238 (third). Your `docs/repositories/dotln-angular.md` grew its history in the `Checked:` field the kit's profile template seeded; the template loses that field in WO-238. Ask of your next pass, under your own authority: cut each standing document (the profile, WS-001, the operator record) to its current state, moving the dated accounts into the orders' decisions or your pass documents; nothing in the kit needs to land first.
```

## 13. Process cost and validation

Model and effort: Fable 5.1 at `max`, operator-selected (`CLAUDE_EFFORT=max`;
the `/model` line of the dispatch). Subagents: budget 20; plan one, the
refuter (`dotln-worker`, claude-opus-5-5 at xhigh; the dispatch names no
fable worker); none other spawned. Usage at entry: unknown (`harness
usage` refused: "Token measurement requires an active role and dispatch
start"); the handoff figure is in the response and the receipt. The
prompt hook read this dispatch's role as `unknown` (the `planning:` line
arrived inside a pasted block), so the planner's scratchpad grant was not
equipped and the hook refused four helper scripts there; the scripts ran
from the ignored lane `docs/control/local/planning-2026-10-28/` instead,
and the remaining refusals held. Recorded as evidence for WO-226's
first-line reading: a dispatch pasted whole is read as a paste, not a
prefix (reopen: a typed `planning:` on the first content line is read as
`unknown`).

Validation, in order: `npm run plan -- followups --sync` and `--apply`
(31 dispositions, 10 rows minted); `npm run meta`; `npm run meta --
--plan-cost`; `npm run work-orders -- index`; `npm run format`; commit;
`npm run plan -- check` (the new heading awaited its receipt; nothing
else); `npm run test:docs` (24 passed, 3 awaiting the receipt); `npm run
plan -- refute` with one fresh `dotln-worker` (claude-opus-5-5 at xhigh by
the pin; the host read back neither); the worker ran 21 min 47 s and
returned `aligned-with-findings` with fourteen known issues and no holds;
`npm run plan -- receipt` filed
[receipt 058](refutations/2026-10-29-planning-aa634f39243f266b-058.md)
(dispatch to file 25 min 33 s; 58 receipts, 47 passes; no advisories);
the fourteen known issues are on the three catalog rows with the
planner's readings, the two on WO-238's criterion 10 settling the move
question the refuter found (the dated documents stay at their paths, the
archive view is the kind classification plus a planning README, no record
changes a byte); then `npm run test:docs`, push and the `:memo:` pull
request, whose results are in the response. The meter's trap table at
`meta` flagged drift to low performance as a reopen candidate
(coldStartBytes 32,292, three consecutive rises); the three orders'
known issues carry the offset duty, and the next pass reads the series.
