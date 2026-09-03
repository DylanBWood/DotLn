# WO-019 final review FINAL-001

**Subject:** branch `wo-019`, worktree `DotLn-wo019`, uncommitted working tree, 2026-09-03. `HEAD` and `origin/main` are both `5d20c6274475a85e501e9842024e3901a607d4c2`, the WO-025 merge published as annotated `v0.3.3`; the branch carries no local commits, so the entire subject is the dirty tree. At review open, before this review's own transition: twenty-seven tracked modifications (2010 insertions / 191 deletions against `HEAD`, including the two `docs/control` files) plus two untracked immutable reports, `docs/verifications/WO-019/VER-001.md` (309 lines) and `VER-002.md` (356 lines); twenty-nine `git status --porcelain` entries. The subject is exactly the tree VER-002 passed: against checkpoint `refs/dotln/checkpoint/WO-019/8` (the VER-002 verdict) the tracked working tree differs only in `docs/control/current.md` and the strictly appended `docs/control/resume.jsonl`, and both reports are byte-identical to that checkpoint by `cmp` (§Dispatch and subject integrity). This review adds this report, its PR body, this order's `RELEASE-NOTES.md`, three bounded wording corrections (§Corrections applied by this review), and the lifecycle's own events.

**Authority:** `docs/work-orders/WO-019-effort-truth.md` — objective, observed problem, an eleven-clause scope fence, deliverables, nine acceptance criteria, a five-item evidence gate, write-back duties, non-goals, a dated implementation-clarifications block, direct-draft provenance, and two ideation breakout receipts (2026-09-02 during execution, 2026-09-03 during repair) whose §Required review sections impose named duties on this report. The executor amended the activated text in these hunks: the H1 and release-classification paragraph (the planner's "(version assigned at activation)" placeholder became `v0.3.4`), the clarifications block, the cites wording ("recorded drift" became "operator-reported drift"), the objective (the record proves receipt of a labeled claim, not an unobserved effective setting), six scope-fence clauses (header region, evidence-gated recognition, single-line values, the report header, version-scoped readback, the activation marker), the test deliverable, acceptance criteria 1, 2, 6, 7, and 8, and the two appended receipts. Every amended criterion is stricter than the activated text; none lowers a bar (§Adjudications, item 1).

**Prior reports:** `VER-001` (fail; criteria 1–6, 8, and 9 confirmed first-hand, criterion 7 failed for an unproven final-review header check and missing refusal cases; a six-item repair checklist confined to `scripts/test-resume.sh`; seven observations) and `VER-002` (pass; the repair verified by mutation, `scripts/resume.mjs` byte-identical to the VER-001 subject, both receipts screened, seven observations, none a defect). Complete sequence: two reports with one repair episode between them.

**Reviewer:** Claude Fable 5.1 (`claude-fable-5-1`, the model identifier this harness exposes), **effort `max`**, in Claude Code 2.1.259 with sandboxed Bash; macOS 15.6 (darwin 24.6.0, arm64), node v22.2.0, npm 10.8.0, git 2.55.0, Prettier 3.9.6. WO-019 declares `reviewer any`, so any attested effort including `unknown` would satisfy it; the value is stated because it is true, not because the gate needs it. The effort value is **self-reported**: the harness surfaced this session's effort selection as `max` when the model was selected at session start, `claude --version` returns `2.1.259`, and `claude --help` lists the `--effort` selector with exactly the five ladder values that discovery records as documented locally for this version, so the mechanism accepts the recognized value on selector evidence. Claude Code 2.1.259 exposes no effective-effort readback, as this order's own probe records and as the help text confirms, so `harness-readback` is unavailable and would be refused by the mechanism under review. This reviewer is a different model from both the executor (GPT-5.6 Sol under Codex CLI) and the verifier (Claude Opus 5 under Claude Code). Every command in this report ran first-hand from this worktree inside the sandbox; nothing is quoted from the executor's or verifier's transcripts. No subagents were used. The machine header below carries the same five values this review passes to `final-review-result`, and it is the only line in this report that begins at column one with that label; every quoted header is blockquoted or sits in a table cell.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.259","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

**Verdict: WO-019 passes.** The defect the order was cut for is gone: effort is declared per role in the work-order header and refused at activation when absent or malformed, attested with harness, version, model, effort, and source on every completion event, compared with the declared minimum and with discovery evidence before append, agreed with the report it completes by a pre-append header check, and projected with within-order drift. All nine acceptance criteria are met on first-hand evidence, and criterion 8's inventory, which neither verifier could close, is completed below: every executor-role completion, every verifier report-header/control-event pair, and this reviewer's own prose, machine header, and intended completion actor agree with each other and satisfy their declared minimums. Beyond re-running the suites, this review compared each report header with its event by object comparison rather than by eye, drove the shipped mechanism through an independent 25-command fixture probe against the real discovery record, and re-screened both raw ideation captures. Three bounded wording corrections were applied. Nothing acceptance-relevant was changed by this review.

## Self-referential instruments — disclosure

07-execution-guide.md §Discipline requires naming the instruments that are part of the deliverable under judgment, and this order's own **Effort** field makes that disclosure a reviewer duty.

1. **The transition that dispatched this review is the deliverable.** `npm run resume -- final-review` allocated this report's path from the rewritten `scripts/resume.mjs`, and the `final-review-result` command that records this verdict is the new actor-gated path: it parses the real WO-019 declaration, gates this reviewer's `max` on the discovery record, compares the header above with the flags, and appends the `FinalReviewCompleted` actor. The instrument is inside the subject.
2. **This reviewer's own attestation is produced and checked by the mechanism under review.** A successful append is therefore evidence about the subject, not independent of it. Mitigation: the same checks were first driven in a disposable fixture with a copy of the shipped script and the real `environment.json` (§Independent probe of the mechanism), where every refusal and acceptance was constructed by hand and read from the resulting event or message, before the real transition was attempted.
3. **Criterion 8 is closed by this report and its event together.** The order's clarifications block says a report cannot compare itself with an event created after it; the completed package — this immutable report plus the `FinalReviewCompleted` event whose actor the pre-append check forces to equal the header above — is the agreement proof. The expected projection after completion is stated in §Criterion 8 so a later reader can check it against `docs/control/current.md`.
4. **What this review cannot close.** The order's own `WorkOrderActivated` event predates the shipped parser and carries no `effortDeclarationValidated` marker. The script hard-codes WO-019 as the strict migration boundary, so the missing marker cannot become a legacy fallback, and the declaration has been parsed strictly by every later transition including this one; but the order's activation was never validated by the mechanism it ships. This is disclosed rather than repaired, because backfilling an append-only log is exactly what the migration note forbids.

## Dispatch and subject integrity

`docs/control/current.md` named WO-019 at phase `verified` with `final-review` as the only legal action, latest verdict VER-002 pass, the verifier's attestation as latest, and drift `xhigh -> max`. Before invoking the transition I read the `resume` mapping in `package.json` (`node scripts/resume.mjs`, unchanged) and the full `scripts/resume.mjs` diff against `HEAD`, since the script about to run is the deliverable. `npm run resume -- final-review` ran inside the ordinary sandbox with no approval escalation, allocated `docs/final-reviews/WO-019/FINAL-001.md`, moved the phase to `final-review`, and minted checkpoint `20560349b95c9fed484e5b08d9262fa81f37818c` (`refs/dotln/checkpoint/WO-019/9`). `docs/control/resume.jsonl` is a strict append over `HEAD`: eight added lines before this review's transition, nine after it, zero removed.

Subject identity, established with git objects rather than with the lifecycle script:

| Comparison | Differences |
| --- | --- |
| working tree vs `/8` (VER-002 verdict, `c12064b5…`) | `docs/control/current.md`; `docs/control/resume.jsonl` (+2: the VER-002 completion and this review's request); the two reports appear only because they are untracked, and `cmp` shows both byte-identical to `/8` |
| `/8` vs `/9` (this review's allocation, `20560349…`) | `docs/control/current.md`; `docs/control/resume.jsonl` (+1) |
| `/6` (repair-complete, `a08fa7bc…`) vs `/8` | `docs/control/current.md`; `docs/control/resume.jsonl` (+2); `VER-002.md` added — the verifier changed nothing in the deliverable |
| `/2` (implementation-ready, `a97ad186…`) vs `/6` | the repair window: `scripts/test-resume.sh` (+24), `docs/work-orders/WO-019-effort-truth.md` (+53, the second receipt), `docs/lineage/idea-ledger.md` (+47), `docs/product/00-vision.md` (+19/−3), `docs/product/05-pattern-library.md` (+40), `docs/planning/work-order-map.md` (11 lines), `VER-001.md` added, and the control files |
| `scripts/resume.mjs` vs `/2` and vs `/4` (VER-001 verdict) | byte-identical: the production script has not changed since implementation-ready |

`VER-001.md` is byte-identical to `/4` and `/8`; `VER-002.md` is byte-identical to `/8`. No destructive git command ran in this worktree; nothing was restored from a checkpoint; the shared stash was not touched. The repository has exactly eight annotated tags locally and on origin (`v0.2.0` through `v0.3.3`); origin advertises a single `main` head and no `wo-019`. `.claude/` carries no change; `git status --porcelain -uall` lists only the twenty-seven modifications and the two reports at open, and the only ignored material is intake, `node_modules`, and build output.

## Criterion 8 — the order's own actors, inventoried

Every completion event was read from `docs/control/resume.jsonl` by a script that also compared each verification report's column-one header with its event's actor as serialized JSON. Declared minimums come from the authority's Effort field: `executor xhigh+; verifier xhigh+; reviewer any`.

| Completion event | Actor (control log) | Role | Declared | Check | Evidence the mechanism accepted |
| --- | --- | --- | --- | --- | --- |
| `ImplementationReady` (checkpoint `/2`) | `{"harness":"codex-cli","harnessVersion":"0.152.1","model":"gpt-5.6-sol","effort":"xhigh","source":"self-reported"}` | executor | `xhigh+` | at minimum, passes | `codex-cli` `0.152.1` `persistedEffortSelector` observed `xhigh` |
| `VerificationCompleted` VER-001, `fail` (`/4`) | `{"harness":"claude-code","harnessVersion":"2.1.259","model":"claude-opus-5[1m]","effort":"max","source":"self-reported"}` | verifier | `xhigh+` | one rung above, passes | `claude-code` `2.1.259` `sessionEffortSelector` documented locally, values include `max` |
| `RepairCompleted` (source VER-001, `/6`) | `{"harness":"codex-cli","harnessVersion":"0.152.1","model":"gpt-5.6-sol","effort":"xhigh","source":"self-reported"}` | executor | `xhigh+` | at minimum, passes | same persisted selector |
| `VerificationCompleted` VER-002, `pass` (`/8`) | `{"harness":"claude-code","harnessVersion":"2.1.259","model":"claude-opus-5[1m]","effort":"max","source":"self-reported"}` | verifier | `xhigh+` | one rung above, passes | same documented selector |
| `FinalReviewCompleted` (intended, this review) | `{"harness":"claude-code","harnessVersion":"2.1.259","model":"claude-fable-5-1","effort":"max","source":"self-reported"}` | reviewer | `any` | passes | same documented selector |

Verifier report headers beside their control events — each report contains exactly one column-one header, and each is byte-identical to the JSON its `VerificationCompleted` event carries:

> `VER-001.md`: **Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.259","model":"claude-opus-5[1m]","effort":"max","source":"self-reported"} — event actor identical; verdict `fail`.
>
> `VER-002.md`: **Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.259","model":"claude-opus-5[1m]","effort":"max","source":"self-reported"} — event actor identical; verdict `pass`.

There is no executor or repair report, so the two executor-role actors exist only in the control log; they serialize in the canonical `harness, harnessVersion, model, effort, source` order that only the shipped `parseActor` produces, and both carry `schemaVersion: 1`. All four recorded completion events carry an actor; the `WorkOrderActivated` event carries no marker (§Self-referential instruments, item 4).

Drift. The distinct effort pairs in order are `(xhigh, null)` then `(max, null)`; the executor's repeat of `xhigh` and the verifier's repeat of `max` are deduplicated as criterion 5 requires, and the projection reads `- Effort drift: xhigh -> max`. This reviewer's `(max, null)` is already in the set, so after `final-review-result pass` the projection is expected to read `- Latest attestation: harness claude-code; version 2.1.259; model claude-fable-5-1; effort max; source self-reported` and `- Effort drift: xhigh -> max`, with phase `closed` and legal next actions `release-close, next, activate`. This reviewer's prose (§Reviewer), machine header, and intended completion actor state the same five values.

## Final evidence summary

### `npm test`, twice

Run from this worktree inside the sandbox before this review's artifacts existed and again after the corrections, the notes, and the PR body were in place (the report itself is formatter-exempt and read by no suite). Both runs: `All matched files use Prettier code style!`, `GitHub body profile tests passed`, then the seven shell suites — fixture temp-root, publication checker, backup-intake, resume (`resume tests passed`), checkpoint, worktree (`GitHub PR target, authentication, and committed-body fixtures passed`, `worktree tests passed`), and release (`release surface version and component fixtures passed`, `release-notes publish validation fixtures passed`, `release edition, GitHub projection, recovery, and historical backfill fixtures passed`, `release tests passed`) — then `tsc -b --force` and `# tests 78 / # pass 78 / # fail 0`, exit 0.

### Static checks and surfaces

- `git diff --check`: exit 0, no output, before and after this review's artifacts.
- `git diff HEAD --stat -- package.json package-lock.json packages/`: empty, so no dependency and no kernel or skeleton change; `git diff HEAD --quiet -- .claude`: exit 0.
- `npm run release -- check-surfaces` before this review's bodies existed: `PASS release-block: observed v0.3.4; expected v0.3.4 (work-order target v0.3.4; latest published v0.3.3)`; `PASS component-version @dotln/kernel: src unchanged; observed 0.1.0`; `PASS component-version @dotln/skeleton: src unchanged; observed 0.3.0`; `PASS github-body-profile: observed no current final-review bodies yet`. After the bodies were written, the fourth line lists `docs/final-reviews/WO-019/PR.md, docs/final-reviews/WO-019/RELEASE-NOTES.md` and still passes, and `RELEASE-NOTES.md` parses as the five-section edition through the deliverable's own parser.
- `claude --version` prints `2.1.259 (Claude Code)`; `claude --help` lists `--effort <level>` with `(low, medium, high, xhigh, max)` and no readback command — consistent with the probe's `sessionEffortSelector` and `effectiveEffortReadback` rows for this version.

### Independent probe of the mechanism

A disposable fixture under the session temporary root received a copy of the shipped `scripts/resume.mjs`, a copy of the real `docs/discovery/environment.json`, a work order declaring `executor xhigh+; verifier xhigh+; reviewer any` with prose continuing after the declaration, and a second work order with a duplicate `**Effort:**` label inside a fenced example. Twenty-five commands ran against it; each refusal was checked for a non-zero exit, its specific message, and an unchanged event count, and each acceptance was read back from the appended event or the regenerated projection.

| # | Command | Result |
| --- | --- | --- |
| 1 | `activate` the duplicate-label order | refused: `duplicate **Effort:** lines`; nothing appended |
| 2 | `activate` the strict order | accepted; event carries `"effortDeclarationValidated":true`; `next` prints the complete Effort field including its continuation line |
| 3 | `implementation-ready` claude-code 2.1.259 `high` self-reported | refused: `attested executor effort high is below declared xhigh+ in …; add a dated operator amendment to that work order's **Effort:** line, then rerun` |
| 4 | same with `unknown` | refused with the same shape, naming `unknown` |
| 5 | same with `ultracode` | refused, naming `unknown (raw: ultracode)` |
| 6 | same with `max` and `harness-readback` | refused: `harness-readback refused for claude-code 2.1.259 effort max: no matching observed effective-effort readback is recorded …` |
| 7 | same with `max` but version `2.1.258` | refused: `attested effort max refused for claude-code 2.1.258: no matching selector or effective-readback evidence records that value …` |
| 8 | codex-cli 0.152.1 `max` | refused: no evidence records `max` for that harness and version |
| 9 | a model value containing a newline | refused with the usage line |
| 10 | a model value containing U+2028 | refused with the usage line |
| 11 | `--source observed` | refused: `invalid --source observed` |
| 12 | `--source` given twice | refused with the usage line; no last-wins |
| 13 | codex-cli 0.152.1 gpt-5.6-sol `xhigh` self-reported | accepted; event actor serialized in canonical order and identical to the order's own executor actor |
| 14 | `verify` | accepted; `VER-001` allocated |
| 15 | `verification-result pass` over a report with no header | refused: `must contain exactly one machine-readable actor header; expected: …` |
| 16 | header says `max`, flags say `xhigh` | refused: `does not match the completion actor` |
| 17 | verifier `high` | refused by the ladder for the verifier role |
| 18 | a correct header plus a second column-one copy inside a fenced block | refused: exactly-one-header |
| 19 | a correct header plus a blockquoted copy and a table-cell copy | accepted; projection `Latest attestation: … model claude-fable-5-1; effort max; source self-reported`, `Effort drift: xhigh -> max` |
| 20 | `final-review` | accepted; `FINAL-001` allocated |
| 21 | `final-review-result pass` over a report whose only header is indented two spaces | refused: exactly-one-header |
| 22 | header records `unknown` with `raw: ultracode`, flags say `max` | refused: header mismatch |
| 23 | flags say `ultracode`, header matches | accepted under `reviewer any`; event actor `{"harness":"claude-code","harnessVersion":"2.1.259","model":"claude-fable-5-1","effort":"unknown","raw":"ultracode","source":"self-reported"}`; projection phase `closed`, `Latest attestation: … effort unknown (raw: ultracode) …`, `Effort drift: xhigh -> max -> unknown (raw: ultracode)` |
| 24 | `status` | read-only: zero events appended |
| 25 | log audit | six events, every `schemaVersion` 1, every completion event carries an actor |

Seventeen refusals, eight acceptances; the fixture was removed afterwards. These cases were chosen to touch each rule with inputs this reviewer constructed, not to repeat the suite; they overlap the verifiers' probes deliberately, since an independent reproduction is the point.

## Receipts, provenance, and the clean-room screen

Both receipts require the verifier and final reviewer to digest the receipt and the promoted sections. I read both raw captures — `docs/intake/notes/WO-019-expanded-ideation-2026-09-02.md` (7040 bytes) and `WO-019-expanded-ideation-2026-09-03.md` (1316 bytes) — both ignored by `.gitignore:4`, with `git ls-files docs/intake` listing only the three `.gitkeep` placeholders. Then I read every promoted section in the diff.

- **Screen result: clean.** Both captures are the operator's own product thinking plus public media: an unnamed television premise, a named book, a named animated series with one episode and two character names mentioned, and public technology talk. No employer code, configuration, identifier, hostname, proprietary API shape, credential, or internal URL appears in either. Over all added lines and both reports: no commercial tracker or ALM product name, no predecessor-system reference (the single `v1` hit is `schema-v1`), no managed-host or corporate-gateway description, and no credential, endpoint, address, or private-identifier shape; the one URL is the project's own public Releases page in the pre-existing README block.
- **No verbatim lift.** A shingle comparison between each capture and every added line plus both reports finds zero shared eight-word runs for either capture, zero five- and six-word runs for the 2026-09-03 capture, and, for the 2026-09-02 capture, six five-word and three six-word runs: the capture's own filename, which the receipt must cite, and the phrases "a same-device copy is" and "do not enter remote model prompts", both of which the capture quotes in quotation marks from repository prose the operator was reacting to. The direction of those two is repository to capture, not capture to repository. The episode title and character names in the second capture were not promoted; the vision entry says "one character explaining an unfamiliar mechanism through a familiar fictional evolution analogy" and the ledger says "a familiar fictional evolution comparison".
- **The tension that was not adopted.** The 2026-09-02 capture says, in the operator's words, that an edge component may lie to its logs and that a model mapping claiming `max` when it was `low` is dealer's choice. The ledger's "Edge claims remain claims" entry is tagged `transformed`, states that DotLn may not fabricate a receipt, mutate history, or upgrade a source label, and says the literal permission "is not adopted because it conflicts with WO-019's active authority"; the receipt's scope paragraph says the same. The domain model, execution guide, and pattern library carry the honest version: a `self-reported` value is a claim the mechanism compares, and unavailable evidence yields refusal or a visible deficit rather than surveillance or relabeling. This is the one place the breakout could have contradicted the order, and it did not.
- **Required-review checks, first receipt.** Immutable history: the recap-cut candidate in 11-proteino.md keeps "the complete recorded history remains canonical and immutable" and treats a changed detail as "an inspectable counterfactual input with a visible source diff". No mind-reading: five states (what happened, what could be observed, accessible memory, another resident's belief, that resident's stance) are kept separate and "knowledge of the condition does not hard-code sympathy or revulsion". Model/harness/senses split: the roadmap says the experiment "does not create a second actor kind, a new roadmap rung, or an expansion of WO-009 or WO-022", and the ledger's compiled-senses entry keeps roles, mechanics, senses, identity, and environment "distinct graph dimensions rather than a newly fixed three-axis ontology". Phase-selective composition: 05-pattern-library.md now makes Beware of Naive Interventionism "a compatible contextual counterweight, not part of the saved bare-ideation build" and says it "can never use fidelity as a reason to pass unsafe material". External-target non-persistence, event-shape leakage, capability deficit, suggestion-only authority for the reducer, the limit of action-gem self-evidence, Git/network independence for maintenance, acquisition-versus-maintenance separation, and model-input exposure are each stated in the promoted 03-architecture.md, 05-pattern-library.md, and 09-audit-resilience-privacy.md sections with the honest limits attached ("`gitignore` … is not access control, encryption, backup, or proof of deletion"; "cannot certify its own lack of hidden effects"; "a manifest proves declared participation, not the absence of hidden effects"). Nothing is presented as implemented: every new section is headed or labeled candidate, and the receipt enumerates what is not built.
- **Required-review checks, second receipt.** The four response shapes (band-gated, cumulative, bounded-history, self-governed) are separately defined, "may later compose", and "are not assumed to exhaust the space". `Voice`, urgency, evidence, trust, authority, and aggregation are kept as separate facts, "repetition does not become truth, message force does not create authority, and aggregation cannot weaken a hard constraint", and the self-governed shape "can never bypass hard constraints, authority, consent, or evidence obligations". No fake precision or identity drift: "not the existing `AttentionPolicy`", a versioned policy rather than "a fixed personality score", and no pretense "to measure hidden human judgment". Fictional vocabulary stays optional source content: "no series-specific noun or rule becomes kernel ontology", the ledger entry is `preserved`, and 00-vision.md files the series as "nominated, not yet mined". No recollection became an asserted fact: the physics viewing "does not make a physical claim or import physics as the implementation".
- **Ledger discipline.** Two new sections sit newest-first above the WO-025 entry with no earlier line rewritten, and the 2026-08-31 effort-truth entry gains one dated "Adopted prospectively by WO-019" bullet beneath its "Durable consequence, not yet built" clause, exactly as the write-back duty specifies. The ledger is formatter-exempt, so the bytes are the executor's.
- **Direct-draft provenance.** The order's own header text was filed from the operator's complete public draft under explicit direction, with the compaction-safety intake copy named as a sibling rather than a source. The order records that the operator confirmed this during the VER-001 repair; the executor's amendments (§Authority) are all additions or tightenings around that draft.

## Verification-sequence soundness

Time-indexed against the process in force on 2026-09-03, which includes WO-024's notes contract, WO-025's renderer-wrapped profile, and this order's own header duty. VER-001 discloses its instruments, runs against copies in disposable fixtures, sweeps 29 mutants of which six survivors are findings and two are equivalent, fails the order on the one criterion those survivors violate, confines the repair to the test suite, and states its re-verification scope. VER-002 extends the sweep to 68 single mutants plus four multi-guard combinations, proves each checklist item load-bearing by mutation rather than by reading, confirms the production script byte-identical to the VER-001 subject, screens the second receipt, and classifies all eighteen survivors. Both reports carry the required header and both headers equal their events. Their counts were re-derived here where cheap — the 78 node tests, the four PASS lines, the two column-one headers, the byte identity of `resume.mjs` across checkpoints, the zero-shingle result — and all agree. No statement in either report is contradicted by this review's evidence.

The one soundness question the verifier itself raises (VER-002 observation 7) is that the same actor wrote the failing report and verified its repair. This review's answer is §Adjudications, item 8.

## Adjudications

### 1. The executor amended the work order's authority text

Ratified. The H1 rewrite completed a step the activation helper skipped, is substantively correct (`v0.3.3` is the latest published tag locally and on origin; `v0.3.4` is the next patch), and is disclosed in the classification paragraph, the ledger, and the map, following WO-025. The clarifications block and the amended scope clauses and criteria all widen what the executor must prove: criterion 1 gains region, adjacency, and duplicate refusals; criterion 2 gains the control-character refusal; criterion 6 gains version scoping and evidence-gated recognition; criterion 7 gains the header-agreement proof; criterion 8 widens the inventory from one executor value to every executor-role completion. The objective's rewording narrows the claim the mechanism makes — receipt of a labeled claim rather than an observed effective setting — which is the truthful description of a mechanism whose own probe shows no readback exists; it removes no deliverable and lowers no criterion. The `any` clause's rewording ("when an otherwise eligible actor can attest only `unknown`") and the cites' "operator-reported drift" are epistemic clarifications. The append-only activation event was neither replayed nor edited.

### 2. VER-001 observation 1 and VER-002 observation 2 — the reviewer's header collides with its quoting duty

Sustained and addressed within the wording lane. This report quotes both verifier headers in a blockquote and the five actors in table cells, and one sentence was added to each evidence README stating the column-one rule (§Corrections applied by this review). The mechanism itself is unchanged; the rule is consistent with the order's "duplicate labels are ambiguous and refuse" stance.

### 3. VER-001 observation 2 — drift renders as a distinct-pair set with an arrow

Accepted as specified: criterion 5 asks for the differing pairs, not a chronology, and `Latest attestation` carries the actual latest value. Probe row 23 shows the rendering with a third pair. Worth one sentence in the guide if a later order revisits the projection; not changed here.

### 4. VER-001 observation 3 — `worktree start` creates the worktree before activation can refuse

Pre-existing ordering, now more reachable. The playbook write-back tells the operator to confirm both lines before `start`. Carried to WO-018, which owns `scripts/worktree.mjs` consolidation.

### 5. VER-001 observation 4 and VER-002 observation 6 — the literal `WO-019` in production code

As specified by the scope fence ("WO-019 itself is the strict migration boundary and receives no fallback"), unique, and inert after close. Carried so a refactor does not mistake it for an accident.

### 6. VER-001 observation 5 and VER-002 observation 5 — the probe pins one personal-settings value

Permitted by the order ("prints only the level") and honored: `environment.json` records the Codex persisted `model_reasoning_effort` level `xhigh` with no path, scope, or surrounding content, and `environment.md` says so. It is load-bearing, since it is the evidence behind both executor-role attestations, and it goes stale with the setting or the harness version. This review did not re-read the personal settings file to re-observe it, because the record is a dated observation and re-observing now would prove nothing about 2026-09-02. Carried as an operator-facing note.

### 7. VER-002 observations 1, 3, and 4 — test thinness

Two of three `parseActor` structural guards can be removed together without turning the suite red; the declaration grammar is exercised at `high+` and `any` only; the final-review report containment refusal has no case while its verification twin does; the column-one header boundary has no test. None produces a forged acceptance from a single-guard removal, which is the bar both verifiers applied, and this review's probe confirms the shipped behavior on each point (rows 12, 18, 21). Adding cases is a test change outside this review's lane; carried to WO-018, which refactors this exact file, with the two `assert_refusal` lines VER-002 names as the cheapest closure.

### 8. VER-002 observation 7 — the same verifier verified its own prior report

Adjudicated as adequately broken for this order. The failing report was specific and mechanical (one criterion, one reproduction, a six-item checklist), the repair touched only the test suite while the production script stayed byte-identical, and VER-002 did not score the checklist but built 68 mutants — 39 more than VER-001 — two of whose three residual clusters lay outside the checklist. This review is a different model under the same harness, ran its own 25-command probe against the real discovery record, and found no behavior either report describes to be wrong. The residual risk is shared blind spots between two Claude sessions; the operator's stated practice of rotating models per role is the durable answer, and the question of a separately harnessed verifier for repairs of a verifier's own finding is carried as an open question, not a defect.

### 9. The write-back duties

Each read in the diff: 07-execution-guide.md §Model-specific notes rewritten from "no executable check exists" to the mechanism with the dated migration note; PLAYBOOK §Who does what with the effort column pointing at declared lines and the drift paragraph demoted to history; 02-domain-model.md §Actors and episodes with the `actor` record pinned for the control log and a candidate for WO-009; both evidence READMEs stating the header-agreement duty; the map's "Model / harness / environment" column showing declared effort; the ledger bullet beneath the 2026-08-31 entry; Effort lines in WO-016, WO-017, and WO-018; and the downtime-series preflight naming the planner duty. Discharged.

## Corrections applied by this review

Three corrections, all in the wording lane `docs/final-reviews/README.md` grants, proven contained by `git diff --stat refs/dotln/checkpoint/WO-019/9` (which lists only the control files, these three paths, and the two untracked reports) and followed by the second full `npm test`, `git diff --check`, and `check-surfaces`, all clean.

1. **`docs/planning/work-order-map.md`.** The snapshot line, the "Slot at this snapshot" bullet, and the WO-019 catalog row read "reached implementation-ready", "awaits independent verification", and "implementation-ready recorded; legal next transition is independent `verify`" — true when the executor wrote them, false beside a failing VER-001, a passing VER-002, and this report. Following WO-013, WO-024, and WO-025 FINAL-001 §Corrections item 1, they now read "passed independent verification and final review", "with VER-002 and FINAL-001 passed, awaiting operator merge and a fresh release close", and, in the row, evidence, preflight, and disposition cells with links to VER-001 (fail), VER-002 (pass), and this report, "operator merge and a fresh release close remain required", and "passed VER-002 and FINAL-001; awaiting operator merge and a fresh `v0.3.4` release close". The new cells fit the existing column widths, so the pinned formatter re-padded nothing and no other row changed.
2. **`docs/final-reviews/README.md`.** One sentence appended to the header-agreement paragraph: because the check requires exactly one line beginning at column one with the label, every header the reviewer quotes must be indented, blockquoted, or placed in a table cell.
3. **`docs/verifications/README.md`.** The "Later reviewers quote the immutable header and event together" sentence gains the same rule.

The three files this review adds — this report, `PR.md`, and `RELEASE-NOTES.md` — are artifacts the process requires of a passing review, not corrections. Every other path is byte-identical to checkpoint 9.

## Findings

**None blocking.** No acceptance criterion is unmet and no behavioral or evidence defect was found in the deliverable. The following are recorded and not scored.

1. **Publish step returned to the operator.** `gh auth status` in this session fails with `failed to read configuration: open ~/.config/gh/config.yml: operation not permitted`, so `npm run worktree -- publish` refuses at its `gh` preflight after the committed surface check and body validation and before any push, as for WO-006, WO-007, WO-013, WO-024, and WO-025. The reviewed commit is made here; the operator runs the exact command from this worktree outside the sandbox.
2. **Every actor in this order is `self-reported`.** The mechanism proves receipt of a labeled claim and compares it; it does not observe the effective setting, and this order's probe shows no installed harness could let it. This is the truthful limit the objective now states, not a gap in the deliverable. The Codex persisted-selector record is the evidence behind the executor-role values and will go stale.
3. **WO-019's own activation is unmarked** (§Self-referential instruments, item 4).
4. **Test thinness carried to WO-018** (§Adjudications, item 7) and the `worktree start` ordering (item 4).
5. **Work-order map rows other than WO-019's** were not revalidated by this review; the executor refreshed the snapshot and the WO-025 row during the order, and widening the correction is the next planning pass's job, as WO-024 and WO-025 decided for their predecessors.

### Candidates considered and not sustained

- *The objective was weakened from "the effort a session actually ran at" to "a sourced attestation".* Not sustained: the mechanism can only record what a harness exposes, and the probe shows neither harness exposes an effective value; the amended objective is the honest statement of the same deliverable, every criterion got stricter, and Principle 8's required-model constraint is untouched.
- *The ledger's "lie to your logs" material contradicts the order.* Not sustained: preserved as a tension and explicitly not adopted (§Receipts, provenance, and the clean-room screen).
- *The `next` briefing should refuse when the active declaration is missing.* It does: `next` parses the declaration under the same strictness (the suite's `assert_refusal 'missing **Effort:** line' next` case and the WO-019-boundary fixture).
- *The reviewer should re-observe the Codex persisted setting.* Not sustained (§Adjudications, item 6).

## Acceptance criteria

| # | Criterion | Verdict | First-hand basis |
| --- | --- | --- | --- |
| 1 | `activate` refuses a missing, duplicate, misplaced, reordered, or malformed declaration, appends nothing, names the line; legacy `any` for unmarked pre-WO-019 events; WO-019 and marked activations strict | met | probe rows 1–2; suite cases for missing, empty, malformed, buried (both boundaries), reversed, and duplicate (fenced) fields plus the legacy and boundary fixtures, green twice; the real WO-019 parsed strictly by every transition since activation |
| 2 | Four completion actions refuse without all five fields, refuse control and line-separator characters, append nothing, print usage; recognized values byte for byte; unrecognized as `unknown` plus `raw` | met | probe rows 9–13 and 23; suite `assert_refusal` cases for each missing flag, an empty value, a flag-shaped value, a newline, and U+2028; the four real events read from the log |
| 3 | Ladder check per role with both values and the amendment path in the message; `unknown` only under `any`; raw compares as `unknown` | met | probe rows 3–5, 17, 23; the message text quoted in row 3 |
| 4 | `next` in phase `active` prints the declared Model and Effort fields | met | probe row 2 against a multiline declaration; VER-002 against the real order; the suite asserts the continuation lines |
| 5 | Projection gains `Latest attestation` and `Effort drift` with distinct-pair semantics and `unknown (raw: label)`; `status` read-only | met | probe rows 19, 23, 24; the real projection at open and its expected shape after completion (§Criterion 8) |
| 6 | Probe recorded per harness and version with epistemic labels; `harness-readback` only for an observed readback at that exact version; recognized claims need value-specific evidence; nothing invented | met | `environment.json` and `environment.md` read; probe rows 6–8; `claude --help` agrees with the recorded selector; no flag or selector appears anywhere in the diff |
| 7 | Suite covers criteria 1–6 in the non-git fixture with a full attested lifecycle, one refusal per rule asserting no append, a drift case, and header checks for both report kinds | met | `scripts/test-resume.sh` diff read in full; the `FINAL-002` and `FINAL-003` header cases present; `resume tests passed` twice; VER-002's mutation evidence that each case is load-bearing |
| 8 | The order's own transitions recorded through the mechanism; the final review inventories every executor-role completion, every verifier header/event pair, and the reviewer's own prose, header, and intended actor; the pre-append check confirms the reviewer pair | met | §Criterion 8; the header/event comparison by script; the `FinalReviewCompleted` event this report's completion appends |
| 9 | `npm test` green; `git diff --check` clean; no `.claude/` or personal-settings change; no new dependency | met | two green runs; clean; `.claude` diff empty; `package.json`, the lockfile, and `packages/` unchanged |

Scope fence respected: the header-region, vocabulary, declaration-form, actor-shape, single-line, report-header, readback, no-override, forward-only, marker, and kernel-untouched clauses are each visible in the script diff or the suite. Non-goals respected: no kernel change, no runtime episode events or `ResultEnvelope` change, no manifest actor fields (recorded as a candidate in the ledger), no effort-quality measurement (recorded as a future experiment), no backfill, no Codex effort selector, no personal settings file content, no override flag.

## Remaining deviations and open questions

None requires a change to the subject.

- **Publish step returned to the operator** (§Findings, item 1); the exact command is in the handoff.
- **Close-time precondition.** After merge, and only under a fresh `resume: release close`, fast-forward the main checkout to the merge commit first (`git pull --ff-only origin main`), then run `npm run release -- close WO-019 --publish` from it, outside the sandbox and where `gh` is authenticated, so the merged tooling runs the surface gate before `npm ci` (WO-025 FINAL-001 finding 1). If Release creation fails after the tag push, rerun the same command.
- **Attribution:** the reviewed commit carries a plain subject and no attribution trailer, per the operator's standing rule and the repository's hand-authored history.
- **Ledger duty:** discharged by the executor's entries; no entry is owed for this review's wording corrections.
- **Open question for the operator's planning pass:** whether a repair of a verifier's own failing finding should be re-verified under a different harness or model by policy (§Adjudications, item 8), and whether the drift projection deserves the one guide sentence VER-001 suggests.
- **Before `resume: release close`,** if the main checkout still holds a globally ignored, non-disposable `.claude/settings.local.json`, move it out; the release-close gate refuses it by name.

## Proposed PR

- **Title:** `:sparkles: WO-019: effort declared per role in the work order, attested on every completion, checked and projected by the control plane` — a new lifecycle capability, the `:sparkles:` precedent being WO-024's release projection and WO-025's surface gate.
- **Body:** `docs/final-reviews/WO-019/PR.md`, committed alongside this report and `RELEASE-NOTES.md`.

## Ready to merge — handoff

Closeout from here, per the playbook: `final-review-result pass` is recorded with the five values in the header above (the mechanism compares them before append), the projection is expected to read as stated in §Criterion 8, and the reviewed state is committed with a plain subject. The operator then runs, from this worktree outside the sandbox:

```bash
npm run worktree -- publish WO-019 --title ':sparkles: WO-019: effort declared per role in the work order, attested on every completion, checked and projected by the control plane' --body-file docs/final-reviews/WO-019/PR.md
```

The helper runs `check-surfaces --committed WO-019` on the committed tree, validates `RELEASE-NOTES.md` and the PR body against the notes contract and the profile, preflights `gh`, pushes only `wo-019`, opens the PR against `main`, and prints the release-close handoff. The operator retains merge authority. After the merge, and only under a fresh `resume: release close`, fast-forward the main checkout and run `npm run release -- close WO-019 --publish` from it; the close may cut annotated `v0.3.4` with its GitHub Release.

## Method

Single reviewer, single session, no subagents. Read order: the execution guide's dispatch, closeout, discipline, and model-specific sections; the control projection and log; the work order in full and its diff from the activated text; VER-001 and VER-002 in full; the final-review README; the WO-025 final review, PR body, and notes for the package shape and the publish precedent; every changed file's diff; both raw intake captures; and the publish flow in `scripts/worktree.mjs` read from source. Subject integrity was established through checkpoint diffs and `cmp`, not through the lifecycle script. Evidence was re-established first-hand: two full `npm test` runs, `git diff --check`, `check-surfaces` before and after this review's bodies, the harness version and help text, the header/event comparison by script, the shingle screen, and the 25-command fixture probe. The three corrections were applied after the first evidence run and the affected checks were re-run. Nothing was restored from a checkpoint, no destructive git command was used, no personal settings file was read, and no real remote, tag, or `gh` mutation was performed or attempted.
