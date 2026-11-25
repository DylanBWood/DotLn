# What kit code reads out of Markdown, 2026-11-25

Record of the [2026-11-25 planning pass](data-is-the-record-2026-11-25.md). A research worker read the non-test sources at `main` `77b5fc11e` for every place a program takes a fact from Markdown, for the room's decision on what programs read. This is a worker's report as returned, changed in three ways only: a checkout's absolute path is replaced by its name (`worktree:` marks a path in WO-288's worktree, whose files are not on `main`), its headings are set one level down, and the repository's formatter has laid out its Markdown. It is a worker's reading: what the pass checked itself is said in the pass document. The worker was the instance's `default` worker, and the host reported claude-opus-5-5.

### Inventory: what DotLn code reads out of Markdown today (checkout at `77b5fc11e`; non-test sources only)

`lib/` means `scripts/lib/`. "Commands" lists only the programs where I followed the call path down to the read. Static-import reachability is broader (an inference): for example, `lib/work-order-document.mjs` is reachable from 27 of the 32 entry scripts I graphed. "Decision" means a program refuses, transitions, counts or generates from the read. "Check" means the read only judges the document for its human reader.

| Kind (committed `.md`) | Facts code takes | Reading functions | Commands that depend on it | Writer | Same facts in data? | Use |
|---|---|---|---|---|---|---|
| Work order `docs/work-orders/WO-*.md` (288) | Title and version. Header fields: Model, Effort (per-role levels), Track, Cost, Review ladder, Repository, Workstream, Derived provenance (JSON on one line), Umbrella record, Experiment, Front page, Release classification, Target release classification and notes, Reactivation (date). A `dotln-dependencies` JSON block, or the WO-NNN tokens in a `Depends on:` field. Objective, Non-goals and Evidence gate text. The numbered criteria list, including gate phrases in criterion text, "Struck by" items and the word "ledger". Preflight `--only` names. Code spans in the Execution plan. Cites paths. Known-issue sections. `dotln-plan-defer:` comments | lib/work-order-document.mjs:25,:174,:319,:355,:373; scripts/work-orders.mjs:114; lib/dependencies.mjs:91,:325; scripts/resume.mjs:553,:1307; lib/handoff-ledger.mjs:56,:97; lib/mission-documents.mjs:16; lib/plan-subject.mjs:261,:323; lib/plan-receipts.mjs:1685; lib/verification-briefing.mjs:115; lib/harness-context.mjs:295; lib/work-order-repository.mjs:11; lib/work-order-workstream.mjs:21; lib/derived-contract.mjs:76,:131; lib/front-page-scope.mjs:14; lib/release-notes.mjs:197; lib/release-preparation.mjs:155,:178; scripts/release.mjs:915,:3261; lib/meta.mjs:2484; lib/plan-continuation.mjs:42 | resume; work-orders (gate `index`; its `--json` output feeds console and the resident cards); plan (gate `plan`); release (gate `release-surfaces`, `prepare`); worktree; meta (gate `meta`); docs-check (gate); harness-context (gate); resident.mjs and resident-bind.mjs | Planner. `release prepare` rewrites the title's version. Derived orders come from a command | Partly. `docs/control/orders/WO-NNN.jsonl` holds the path, `effortDeclarationValidated`, unmet criteria, waivers and defect hashes. No file holds Model, Effort, criteria, dependencies, Repository or Cost | Decision |
| Verification report `VER-*.md` (442) | One `**Actor attestation:**` line (JSON), one `**Process cost:**` line, `**Criterion <id>:** met\|unmet[, waived/defective …]` lines with their evidence paragraphs, the `dotln-findings` JSON block, live-receipt references | scripts/resume.mjs:888; lib/receipt-cost.mjs:31,:60; lib/off-ramps.mjs:237,:348,:514; lib/handoff-ledger.mjs:283; lib/review-findings.mjs:53; lib/drive-route.mjs:339 | resume (`verification-result`); meta (gate: `checkReceiptCostLines`); drive.mjs; a role-qualification probe test reads WO-052/VER-001 (gate `local-runner-double`); docs-check (links only) | Verifier | Partly. `VerificationCompleted` holds verdict, actor, evidence and `reportHash` | Decision |
| Final review `FINAL-*.md` (252) | Same facts as a verification report; the finding counts are recorded | the verification report's readers plus resume.mjs:2497 (`reviewFindings`, lib/review-findings.mjs:111) | resume (`final-review-result`); meta (gate); drive | Reviewer | Partly. `FinalReviewCompleted` holds verdict, `findingCounts` and `reportHash` | Decision |
| `PR.md` (227) / `RELEASE-NOTES.md` (218) | PR.md: level-one heading first, process-meter block last, criterion-records list compared with control, GitHub body profile. Release notes: five required `##` sections, no raw HTML or reserved titles | lib/github-body.mjs:1272,:1368; scripts/release.mjs:1190; lib/release-notes.mjs:129; scripts/worktree.mjs:166 | release (gate `release-surfaces`; builds the Release body); worktree (close/publish); resume (final-review pass) | Reviewer, plus generated blocks | Partly. The meter comes from the meta collection and the criterion records from control. The notes' sections exist only in Markdown | Decision |
| `decisions.md` (193) | Top-level ```json blocks: id, date, dispatch, decision, evidence, rejected, reopenWhen (prose or a metric predicate), correction and experiment fields, followup, reopens, executionWritebacks, roundFindings. Heading anchors. The `<!-- integration … -->` stub | lib/meta.mjs:119,:328; lib/mission-documents.mjs:51; lib/plan-receipts.mjs:1334; lib/planning-followups.mjs:306; scripts/docs-check.mjs:645,:2176; lib/worktree-integration.mjs:492 | docs-check (gate); meta (gate; generates `docs/lineage/decisions-index.md`; reopen candidates); plan (gate; followups, amend-order, failures, conditions); resident; worktree integrate; adjacent | All roles. The stub is written by a command | Not at all. `followups.json` copies only the decisions that carry a followup | Decision |
| Handoff `handoff.md` (108) | Criterion lines with evidence, the `self-review:` line, gate phrases taken from the order, live-drive receipt references | lib/handoff-ledger.mjs:193,:302; lib/off-ramps.mjs:237 | resume (implementation and repair completion) | Executor | Partly (`ImplementationReady.unmetCriteria` and evidence) | Decision |
| Pass document `docs/planning/passes/*.md` (70; 71 with this branch's untracked one) | `dotln-red-tags` JSON block, `dotln-rules-recorded` JSON block, candidate headings and their list items | lib/document-kinds.mjs:699,:729,:829; lib/planning-document.mjs:73,:165; lib/planning-followups.mjs:202 | docs-check (gate: stale red tags); plan (gate: rules recorded; `start`; `documents`); meta/adjacent (follow-up sync) | Planner. `plan start` writes the skeleton | No. The blocks are embedded; `followups.json` partly | Decision |
| `docs/planning/sequence.md` (1) | The `dotln-work-order-sequence` block: `- WO-NNN — label` entries, groups (lane pairs), the block's bytes hashed | scripts/work-orders.mjs:189; lib/plan-subject.mjs:489–525 | work-orders (gate `index`); plan (gate; `subject`); console and resident through the index output | Planner (a code comment calls it operator-authored) | No | Decision |
| Refutation receipt `refutations/*.md` (78) | Nothing is parsed: the file must equal the rendering of its `.json` | lib/plan-receipts.mjs:811–820 | plan (gate) | Generated | Fully (`docs/planning/refutations/*.json`; the console reads the JSON) | Check |
| Review worker's returned text; reviews-lane report | `## Items` table (item, location, disposition), `Traced consumers` table, one fenced or whole JSON findings object, the `Reviewed tree:` first line | lib/review-worker.mjs:1196,:1265,:1305,:1567,:2370,:2449 | worker (`review`, `record`) | Model worker. The lane `.md` is rendered from `.json` (:1691) | The report is fully in the lane `.json`; the returned text exists nowhere else | Decision (refuses to record) |
| Follow-up sources: every `.md` under `docs/product` and `docs/planning`, including `work-order-map.md` | Headings named candidates, follow-ups, deferred or unallocated; their margin list items and bold leads; decisions with followup or reopens | lib/planning-followups.mjs:202,:657 | plan (gate); meta (gate); adjacent; resume (lib/lifecycle-evidence.mjs:149) | Planner | Partly (`docs/planning/followups.json` holds hash, ref, title and summary, derived from the Markdown) | Decision |
| Product and guide documents (product 17, publication 23, KIT.md, README.md) | Vision thesis sections and the "What DotLn is not" list; the five-role table; capability rows (id in a code span, level); guide "Goal-aligned decisions" section, a platform sentence (regex) and `dotln-goal-rules`; purpose and critical-path sections; roadmap `##` rungs and release table; publication index table, TOC links and section locks; KIT.md operator-command fences; product-doc shapes; headings for anchors | lib/vision-document.mjs:21; lib/plan-subject.mjs:587–670,:845–896; lib/plan-continuation.mjs:477; lib/planning-conditions.mjs:457; lib/markdown-structure.mjs:16 → packages/console/src/text-sources.ts:144,:332; scripts/check-publication.mjs:228,:339,:537; lib/operator-commands.mjs:86; lib/harness-context.mjs:195; scripts/docs-check.mjs:116; lib/release-history.mjs:179,:352 | plan (gate); resident; console; publication (gate); docs-check (gate); harness-context (gate); meta; launchpad `commands`; release `list` | Planner or operator | Not at all, except the release table, which comes from `release-history.json` and tags | Mixed: plan subject, mission, board and `OPERATOR.md` are decisions; docs-check and publication are checks |
| Emitted role files: SKILL.md (14), CLAUDE.md/AGENTS.md, `.claude/agents/*.md` (5) | `Read[role]:` lines and their path selectors, section anchors, `dotln-harness`/`dotln-kit` blocks, the SKILL.md `Origin:` JSON comment, the "Start here" section, the template's `## Secrets` | lib/harness-context.mjs:219,:263; lib/process-budget.mjs:320; lib/harness-instruction.mjs:43; scripts/authority-evidence.mjs:1014; lib/document-kinds.mjs:434; scripts/launchpad.mjs:2674; lib/features.mjs:312; scripts/harness-context.mjs:82 | harness-context (gate); harness (gate); authority-evidence (gate); harness-evidence (gate); meta; docs-check (gate); launchpad; features | `harness emit` from packages/skeleton/src/loadouts/*.ts. The CLAUDE.md floor is hand-written | The generated parts come from TypeScript loadouts (inference); the floor has no data source | Decision (cold-start bytes, directed reads, emit refusal) |
| Idea ledger `docs/lineage/idea-ledger.md` (1) | Dated `##` sections (a "planning pass" heading becomes a pass id), the Statuses code spans, entries and their tags, intake-path mentions counted | scripts/lineage.mjs:36,:39; lib/plan-subject.mjs:1011; lib/plan-direct.mjs:27; lib/meta.mjs:1240 | lineage (gate; generates `lineage/README.md`); plan (gate: which pass needs a receipt); meta; launchpad | Planner | No | Decision |
| Release records: `v0.2.0.md`, README release block, `UPSTREAM.md` | Component table and a `WO-\d{3}` regex; the exact marker lines and version line; the `**Commit:**` field | lib/release-history.mjs:45; lib/release-tags.mjs:159; scripts/release.mjs:1032; lib/release-preparation.mjs:186; lib/operator-commands.mjs:180; scripts/launchpad.mjs:2622 | release (gate `release-surfaces`, `prepare`); launchpad | Historical file; generator | The README version and UPSTREAM commit are fully in data (tags, `KIT-MANIFEST.json`); v0.2.0 has none | Decision |
| Operator's captured message (ignored intake) | Plain-text words, numbered points, digest | lib/review-worker.mjs:412,:1382,:1567; lib/verbatim-screen.mjs:81,:461; lib/off-ramps.mjs:40 (hash only) | worker; docs-check (gate); resume/plan (hash only) | Operator | Digests only | Decision |
| Families with no committed files in core: workstream, area note, plan-first | `dotln-workstream` JSON block and the `## Rules` heading; `dotln-area-note` JSON; the `dotln-plan-first` JSON comment, its diff block and dated headings | lib/work-order-workstream.mjs:40; lib/entropy-review.mjs:2581; scripts/resume.mjs:1598; lib/area-notes.mjs:64; lib/plan-first.mjs:260,:298,:328 | work-orders, plan, entropy, resume, docs-check, plan-first hook | Planner / executor | No (the JSON is embedded) | Decision |
| Publication examples (16) | JSON front matter split by a regex; fact anchors matched as substrings | lib/reader-profiles.mjs:112 | reader (gate `reader-profiles`) | Authored | No | Decision |
| All committed Markdown (2541) | Links and anchors, private paths, operator words, verbatim runs, long paragraphs | scripts/docs-check.mjs:303,:578 | docs-check (gate) | All writers | n/a | Check |

#### 2. Counts
- **Importers of `lib/markdown-links.mjs`:** 44 non-test source files, none of them under `packages/*/src`. Three more files only name the path: evidence-sources, markdown-screen and machinery-sources.
- **Importers of `lib/work-order-document.mjs`:** 21. Two more only name the path: launchpad.mjs and evidence-sources.
- **Named exceptions in `lib/markdown-screen.mjs`:** 37 in four groups, plus 2 modules exempt as a whole (`SCREEN_EXEMPT`).

  | Group | Count |
  |---|---|
  | `NOT_MARKDOWN` | 16 |
  | `CHAT_PROTOCOL_READERS` | 2 |
  | `EXACT_LINE_READERS` | 17 |
  | `SECOND_READINGS` | 2 |

- **Committed files per kind:** taken from `git ls-files` and shown in the table.
  - Of the 698 `.md` files under `docs/final-reviews`, 252 are FINAL reports, 227 are PR.md and 218 are RELEASE-NOTES.md.
  - Of the 444 under `docs/verifications`, 442 are VER reports.

#### 3. The five kinds with the most dependent commands
These come from the traced call paths above.
1. Work order: 10 programs (console also depends on it indirectly).
2. Product and guide documents: 9.
3. Emitted role files: 8.
4. `decisions.md`: 7. The resume path through the follow-up handoff duty is an inference.
5. Verification report: 5.

Next come follow-up sources, `sequence.md`, the idea ledger and the roadmap, at 4 each.

#### 4. Authored versus generated
**Already generated from data, so reading them back is avoidable today:**
- `docs/control/current.md`, from the control logs.
- `docs/control/FEATURES.md`, from the configuration.
- `docs/siblings/README.md`. Its check reads the Manifest hash fields back, but only to name a stale entry (`siblings.mjs:276`).
- The refutation receipt `.md` files and the reviews-lane `.md` reports, each rendered from its `.json`.
- The entropy review receipt pages, rendered by `entropy-review.mjs:927` (I infer they come from the JSON receipts).
- The roadmap release table, from `release-history.json` and tags.
- The README version line.
- The meter and criterion-records blocks in PR.md, from the meta collection and control.
- SKILL.md files, the `.claude/agents/*.md` files and the CLAUDE.md harness block, from the loadouts.

**Generated, but from Markdown, so there is no data source to read instead:**
- Work-order `README.md` and `HISTORY.md`. Their card data exists only as `work-orders index --json` output.
- `decisions-index.md`, `lineage/README.md`, `OPERATOR.md` and `followups.json`.

**Authored by hand or by a model, with no data source:** work orders, VER and FINAL reports, the prose of PR.md, RELEASE-NOTES.md, `decisions.md`, `handoff.md`, pass documents, `sequence.md`, `work-order-map.md`, the idea ledger, the product and guide documents, publication documents, `KIT.md`, workstream, area-note and plan-first documents, `v0.2.0.md`, operator captures, and worker returns.

#### 5. What already exists to build contracts on
- **JSON Schema files:** `packages/console/runtime-status-v1.schema.json` and `uifa-board-v1.schema.json`. Only the console package tests check them (`packages/console/test/schema.ts:6`). That inference rests on the `console` package-test rows at `test-runner.mjs:869–920`.
- **`lib/config.mjs:1272` `validateConfig`:** validates `dotln.config.json`. Every `loadConfig` call runs it, and so does the gate's `configuration` task.
- **Findings-block validator, `lib/review-findings.mjs:53`:** validates the id, route, class and summary of each entry. It runs at resume's result transitions and in `drive-route.mjs:339`. I found no gate task that runs it.
- **Validators that run in gate tasks:**

  | Validator | What it validates | Gate task |
  |---|---|---|
  | `lib/meta.mjs:328` `readDecisions` | decision entries | docs-check, meta, plan |
  | `lib/dependencies.mjs:91` `parseDependencies` | the dependencies array | index |
  | `lib/document-kinds.mjs:699` `markedJsonBlock`, `:729` red tags, `lib/planning-document.mjs:73` rules recorded | JSON in marker blocks | docs-check, plan |
  | `lib/area-notes.mjs:64` | area-note fields | docs-check |
  | `lib/plan-receipts.mjs:243`, which calls `packages/skeleton/src/plan-refutation-protocol.ts:157` | refutation receipts | plan |
  | `lib/reader-profiles.mjs:78` | reader profiles | reader-profiles |
  | `lib/markdown-screen.mjs:902` | the pattern-reader screen itself | docs-check |

- **Other hand-written validators:** `lib/derived-contract.mjs:34,:47,:160`; `lib/outward-lint.mjs:81`; `lib/planning-conditions.mjs:240`; the control-event parse at `lib/control.mjs:302` and the checks in its fold; `packages/compiler/src/presence-schema.ts`.
- **JSON Schema objects handed to workers:** `plan-refutation-protocol.ts:560`, `change-review-protocol.ts:201`/`:297`, `mission-check-protocol.ts:737`, `worker-protocol.ts:99`/`:385`, `verification-protocol.ts:932`/`:1163`, and `loadouts/entropy-reducer.ts:226`. They are passed as `--json-schema` or `--output-schema` (`worker-transport.ts:785,:835`) and printed with the canonical prompt (`plan-direct.mjs:264`). No gate task runs them.
- **Line grammars that exist only as text:** `receipt-cost.mjs:20` and `off-ramps.mjs:222`.

**Plain-text regexes over Markdown that the screen neither flags nor lists:** I infer this from the screen's forms, which match Markdown syntax and JSON text only. These are the ad-hoc reads the second rule targets:
- `release-tags.mjs:161`
- `plan-subject.mjs:846`
- `harness-context.mjs:236`
- `review-worker.mjs:2455`
- `handoff-ledger.mjs:104,:148–176`
- `dependencies.mjs:130,:328`
- `review-findings.mjs:20`
- `document-kinds.mjs:202`
- `reader-profiles.mjs:115`
- `harness-instruction.mjs:31–41`
- `meta.mjs:1244`
- resume's Effort regex near `resume.mjs:636`

#### 6. Unknowns
- **Not fully read:** the 2519 lines of `docs-check.mjs` (product receipt heuristics, the front-page "What runs" check), `drive-prompts.mjs`, `target-records.mjs`, and most of `packages/*/src`. I only spot-checked `harness-host.ts`, which counts lines and does not parse.
- **Possibly missed paths:** dynamic imports and child-process launches, such as `harness-entry.mjs` and console spawning scripts, may hide further dependents.
- **Writers not confirmed in code:** whether the export writes `UPSTREAM.md`, and who writes `sequence.md`, are inferred from code comments.
- **Not checked:** whether `work-orders index` calls `historicalWorkOrders`.
- **Not read, per your instructions:** `docs/control/local/` and `docs/intake/`. So the reviews lane, the plan-first lanes and the volume of captures are unknown.
- **No committed instances:** there are no committed workstream, area-note, plan-first or derived-order files in core, so those readers ran on no committed text here.
