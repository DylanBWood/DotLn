# WO-196 — The handoff is one command: the gate formats first and refuses to start otherwise, a review gate at an unchanged identity reuses its passing tasks, every role reads a numbered procedure, and one adversary and one improver run once at the end of implementation (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** minor. The product gate gains a formatting
preflight, the review selection composes at an unchanged identity, the
role roots are regenerated with a numbered procedure and fewer bytes, the
spawn hook gains one advisory, and the self-review advisory moves to
`implementation-ready` alone. No suite is removed and no assertion is
dropped. Assigned at activation under the standing opt-out default.
**Cost:** adds the `format` row to the preflight stage of the plain and
review selections (`scripts/test-runner.mjs`), task reuse for the review
selection at an unchanged code identity (`scripts/test-runner.mjs`,
`scripts/lib/gate-reuse.mjs`), a numbered procedure at the head of the
executor, verifier and reviewer roles with the shared rules after it
(`packages/skeleton/src/loadouts/contributor.ts`,
`packages/skeleton/src/loadouts/executor-supports.ts`,
`packages/skeleton/src/loadouts/goal-alignment.ts`), one live-gate
advisory on spawn (`packages/skeleton/src/harness-host.ts`), the
self-review advisory bound to `implementation-ready`
(`scripts/lib/handoff-ledger.mjs`, `scripts/resume.mjs`), and the document
ceiling check turned into an advisory (`scripts/docs-check.mjs`). Removes,
by the record: a 31-minute review gate lost to formatting after the gate (WO-112
D049: 1,863 s; the same loss in WO-164, WO-148, WO-146 and WO-158); a
31-minute review gate lost to record writes during the gate (WO-112 D058:
1,861 s); the fresh review gate the verifier and the final reviewer run
at an identity the executor's row already covers (two of the median three
fresh product gates per order, 1,660 s median each, 2026-10-02 pass §4);
an adversary at each repair completion and each verification (175,796 to
248,326 tokens and 11 to 18 minutes each; WO-112 ran seven verifications
and six repairs with one at each); the five-refusals paragraph duplicated
between CLAUDE.md and every role skill (about 2,300 bytes per root, which
puts the executor root at 29,777 bytes against its 29,246 ceiling). What
the gates take afterwards is measured by criterion 8, not promised here.
Re-mints: `harness-host.ts`, `subagent-budget.ts`, `gate-evidence.mjs`
and `contributor.ts` are registered evidence sources in three editions
(`scripts/lib/evidence-sources.mjs` lines 150 to 156, 248 to 254 and 319
to 325), re-minted deterministically, and the harness bundle is
re-emitted with `npm run harness -- emit`; none of the edited files is
in `FEEDBACK_SOURCE_PATHS` (`packages/skeleton/src/feedback-audit.ts`,
checked 2026-10-07), so no live episode; `scripts/test-runner.mjs`,
`scripts/resume.mjs` and `contributor.ts` are declared machinery sources,
so `npm test -- --review` runs before handoff. Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** the operator's dispatch of 2026-10-07
(captured verbatim in ignored intake; SHA-256 in the ledger section of
that date): the machinery is to be fixed for good, document order before
test order is to be mechanical, and the adversary was asked for once at
the end of implementation beside an improver; register rows
FUP-3799fb396f911d8a (WO-112 D049, the mechanical gate order),
FUP-117dc832458dc6e2 (WO-112 D057, record writes during a mixed gate),
WO-112 D063's follow-up (a worker spawned during a live gate),
WO-187 D051's follow-up (the separate improver), WO-188 item 22 (the
experiment no longer per order) and WO-150-D003 (the executor root's
cold-start bytes, which hold at 29,777). Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: repository records only;
no stop condition. The [planning document](../planning/machinery-reset-2026-10-07.md)
§3 and §4 hold the measurements.
**Depends on:** WO-187 merged (the verifier duties, the self-review line
and the generated worker definition this order rewrites; closed, v0.67.1);
WO-186 merged (task reuse at one identity, which this order extends to
the review selection; closed, v0.66.3); WO-185 merged (the bounded
wrapper and the gate lanes; closed, v0.66.1); WO-195 merged (the
release-close and planner sentences this order keeps; closed, v0.66.2).
**Recommended placement:** first, alone. It changes the gate every other
order runs and the text every role reads, so no order runs beside it.
WO-188 edits `contributor.ts` after it (item 23) and takes nothing from
it; WO-197 edits suite files this order does not touch. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-187",
    "relation": "hard",
    "reason": "the verifier duties, the self-review line and the generated worker definition this order rewrites"
  },
  {
    "workOrderId": "WO-186",
    "relation": "hard",
    "reason": "task reuse at one code identity, extended here to the review selection"
  },
  {
    "workOrderId": "WO-185",
    "relation": "hard",
    "reason": "the bounded wrapper and the shared gate lanes the runner keeps"
  },
  {
    "workOrderId": "WO-195",
    "relation": "hard",
    "reason": "the release-close and planner sentences this order preserves in the regenerated roles"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (the
handoff sequence, written by the 2026-10-07 pass), §Verification review
and attack (the criteria-bound verdict and the two workers at
implementation-ready, written by the same pass) and §Model-specific notes
(the pinned worker); `docs/evidence/WO-112/decisions.md` D049, D057,
D058 and D063; `docs/evidence/WO-187/decisions.md` D051;
`docs/evidence/WO-186/decisions.md` D006 (compose task results at the
existing identity) and D035 (the latest execution decides);
`docs/work-orders/WO-188-boarded-machinery-items.md` item 22;
`docs/control/budgets.json` (the cold-start ceilings);
`scripts/lib/evidence-sources.mjs` (the editions to re-mint); the
[planning document](../planning/machinery-reset-2026-10-07.md) §3, §4
and §6.

**Objective:** An executor, verifier or reviewer who follows the numbered
steps in its role text in order cannot lose a product gate to formatting,
to a record write or to a worker started at the wrong time, and does not
pay a fresh 31-minute review gate for bytes a passing row already
covers. The adversary and the improver run once, at the end of
implementation, and verification judges the criteria.

**Observed gap (dated 2026-10-07, `main` at `bd437eb2`):**

- `scripts/test-runner.mjs` has a preflight stage (line 1745: the
  selected rows flagged `preflight: true` run first and every other row
  waits on them, line 1790), but the `format` row (line 593) is flagged
  `document: true` and not `product`, so a plain `npm test` or
  `npm test -- --review` never runs Prettier. An unformatted edited file
  is found by the document gate afterwards; the whitespace fix changes
  the code identity and the passing review row cannot be used (WO-112
  D049, 1,863 s lost; four earlier orders).
- The runner marks every review selection `forced-fresh`
  (`scripts/test-runner.mjs` line 2377: `review || again ?
  "forced-fresh"`; line 2385: `freshReason: review ? "review"`), so the
  verifier's and the reviewer's `npm test -- --review` rerun every task
  at an identity whose tasks all have passing results. WO-186 composes
  the plain selection from passing task rows at one identity
  (`scripts/lib/gate-reuse.mjs` `coveringTaskResults`, line 304) and
  left the review selection fresh. Nothing reads `executionMode`:
  `scripts/resume.mjs`, `scripts/release.mjs` and
  `scripts/lib/release-preparation.mjs` key on the check id, the code
  identity and `requiredSuites` (checked 2026-10-07 by grep).
- The role procedures (`contributor.ts` lines 111 to 124, 133 to 146 and
  155 to 172) are paragraphs. The gate sequence is inside one
  2,000-character sentence (`evidence`, line 96) that also holds the
  write refusal; no line says "format, then the document gate, then the
  product gate, then the records". The installed executor root measures
  29,777 bytes against its 29,246 ceiling (`npm run plan -- conditions`,
  2026-10-07) and the five-refusals paragraph appears in CLAUDE.md and
  again in each skill.
- The executor line (`contributor.ts` line 121) spawns one adversary
  "before either completion", the verifier line (135) spawns one more,
  and the reviewer spawned its own in WO-112 FINAL-001 (D063). The
  operator asked for one adversary and one improver at the end of
  implementation (WO-187 D051).
- A spawn during a live gate is admitted with no word
  (`packages/skeleton/src/harness-host.ts` lines 4414 to 4425 call
  `admitSubagentTool`); the worker's probes are then refused by the
  live-gate rule and it returns source inferences (WO-112 D063; WO-187
  FINAL-001).
- The self-review advisory fires at `repair-complete` as at
  `implementation-ready` (`scripts/lib/handoff-ledger.mjs` line 115,
  called from `scripts/resume.mjs` lines 1338 and 1472).
- A product document over its ceiling fails the document gate unless its
  entry names an `advisoryDecision` (`scripts/docs-check.mjs` lines 531
  to 540), and a ceiling raised beyond two per cent of its landing size
  needs a planning anchor (lines 544 to 549). Orders promised bytes
  against headroom that other orders had consumed by the time they ran
  (WO-074 and WO-075 each promise 300 to 400 bytes in product 03 "against
  3,284 bytes of headroom on 2026-09-28"; product 03 sits at its ceiling
  exactly on 2026-10-07). The operator directed on 2026-10-07 that byte
  figures are not theirs to settle during a review.

**Design (scope discipline):**

- The preflight is the existing stage. The `format` row joins the plain
  and review selections as a preflight row; a failed preflight already
  suppresses every dependant (line 1672), so the gate ends in seconds
  with the failing files named. The refusal text prints the exact repair:
  `npm run format`, then the same gate command.
- Review reuse is WO-186's rule applied to one more selection: a task in
  the review selection whose latest execution at the current code
  identity is a pass carried by a complete row is reused; `--again` keeps
  forcing every task fresh. The composed row keeps `gateSelection:
  "review"` and its `requiredSuites`, so `final-review-result`, `worktree
  publish` and release close consume it unchanged. D035's rule holds: the
  latest execution decides, and a later failed run is never masked by an
  older pass.
- The role text is reorganised, not rewritten from scratch: every
  existing rule sentence stays, moved below a numbered procedure. Two
  sentences change their content, both named in the criteria: the
  adversary sentence (executor and verifier) and the Tinkerer economy
  sentence (WO-188 item 22, taken here). The five-refusals paragraph is
  removed from the skills because CLAUDE.md, which every session reads
  first, carries it.
- The live-gate spawn rule is an advisory, not a refusal: a read-only
  worker may inspect a running gate (the comment at `harness-host.ts`
  line 3786), so the host names the live gate and says that probes under
  `node`, `npm` and `harness bounded` will be refused until it ends. The
  numbered procedures order the worker before the gate.
- **Declined alternatives, recorded:** a new `resume qualify` command
  that runs the whole sequence (the sequence is three commands the
  procedure now lists; a fourth command adds a surface); refusing every
  spawn during a gate (blocks read-only research agents; the advisory
  plus the step order is enough, reopen when a probing worker is spawned
  during a gate after this order); making the review gate's
  document-reading suites tolerate record writes (unsound, the suite's
  input would change under it; the procedure leaves nothing to write
  during the gate); changing the known-issues reader to a marker block
  (WO-187 VER-005 passed the bounded reader; reopen when it drops a
  section of an order filed after 2026-10-07).

**Execution plan (the executor follows these steps in order):**

1. `scripts/test-runner.mjs`, the `format` row (line 593): keep its flags
   and add it to the plain and review selections as a preflight. In
   `runGateChecks` (line 1929, `let selected = table.filter(...)`), after
   the review merge at line 1939, when the selection is plain or review
   (`!only && !document && !machinery`) prepend the `format` row if
   absent. Check: `npm test -- --list` prints `format` first for the plain
   and review selections and not for `--only <suite>` or `--machinery`.
2. Same file, the preflight refusal (line 1672): when the failed
   preflight is `format`, the suppressed rows' output names the files
   Prettier listed and ends with `Run npm run format, then rerun this
   command.` Check: a fixture in `scripts/test-runner.test.mjs` (the
   `runner-fixtures` suite, line 835) writes one unformatted `.mjs` file
   into a copied fixture repository, runs the plain gate, and asserts exit
   1 within 60 s, no product task executed, the file named and the repair
   command printed; a second case with the file formatted asserts the
   gate proceeds past preflight.
3. Same file, lines 2377 and 2385: `executionMode` is `forced-fresh` only
   when `again`; `freshReason` is `requested` for `again` and otherwise
   WO-186's values. In the task scheduling where plain selections call
   `coveringTaskResults` (grep `coveringTaskResults(` in the file; the
   call site WO-186 D006 added), remove the condition that excludes
   `review`. Check: a `runner-fixtures` case records a passing plain row
   at an identity, then runs `--review` at the same identity and asserts
   every product task is `reused: true` with `sourceRow` naming the
   first row, `gateSelection: "review"`, `requiredSuites` equal to the
   review selection, and `executionMode: "composed"`; a third run with
   `--again` asserts `forced-fresh`; a fourth case fails one task with
   `--only <task>` after the passing row and asserts the next `--review`
   runs that task fresh (D035).
4. `scripts/lib/gate-reuse.mjs`: no change is expected;
   `coveringTaskResults` (line 304) already answers per task name. If a
   change is needed, keep `coveringGateCheck` (line 366) semantics and
   add the case to the same fixture file.
5. `packages/skeleton/src/loadouts/contributor.ts`: restructure the
   executor procedure (lines 111 to 124) into numbered strings
   `"1. …"` to `"N. …"`, in execution order: status, reads, the
   deliverable, release prepare, scratch declaration, decisions, the
   self-review (two workers, see step 7), then the handoff sequence as
   four consecutive steps: `npm run format`; `npm run test:docs` until
   green; the product gate (`npm test`, or `npm test -- --review` when
   the order's final criterion names it), with the sentence "while it
   runs, write nothing under the repository and start no agent; if it
   fails, fix and return to the format step"; complete `handoff.md`;
   `npm run resume -- implementation-ready <flags>`. The verifier
   (133 to 146) and reviewer (155 to 172) procedures get the same shape:
   reads, the worker if any, then the gate, then the report, then the
   result command. Every sentence of `common`, `sharedCorrections`,
   `evidence`, `actor`, `costLine`, `boardedDefect` and `productGate`
   stays, placed after the numbered steps under one line that reads
   `Rules:`. Check: `npm run harness -- emit` then `npm run harness --
   check` green; `diff` of the regenerated skills against `main` shows
   every pre-existing rule sentence present once.
6. Same file: remove the five-refusals paragraph from the skill
   projection only (it is emitted from the shared block the manifest
   names; find its source with `grep -rn "five refusals"
   packages/skeleton/src packages/compiler/src`) and keep it in
   CLAUDE.md. Check: `grep -c "five refusals" .claude/skills/dotln-*/SKILL.md`
   prints 0 for each and `grep -c "five refusals" CLAUDE.md` prints 1;
   the installed executor, verifier and reviewer roots (CLAUDE.md plus
   skill) measure below their `docs/control/budgets.json` ceilings,
   recorded in the decisions with the before and after bytes.
7. Same file, the adversary sentences. Executor (line 121) becomes:
   before `implementation-ready` only, spawn two fresh `dotln-worker`
   agents, each given only the order and the diff, one as adversary of
   the criteria and one as improver of design and maintainability; fix
   or record each finding; write the `self-review:` line with both
   counts. Verifier (line 135) becomes: judge each criterion with your
   own probes and the executor's two worker reports; spawn a worker only
   to reproduce one named claim; a finding that breaks no criterion and
   no behavior `main` had is a follow-up, never blocking. Reviewer: add
   one sentence that a finding outside the criteria is a follow-up by
   rule. Check: the emitted skills contain each sentence once; product
   07 §Verification review and attack, written by the planning pass,
   says the same.
8. `packages/skeleton/src/loadouts/executor-supports.ts` line 7 and
   `packages/skeleton/src/loadouts/goal-alignment.ts`: WO-188 item 22's
   two sentences, as that order states them (the experiment only when
   the work shows two credible ways on a named axis; the goal-alignment
   sentence that names only the traps that change what you do). Check:
   the emitted executor skill carries the new sentences and not the
   900-second experiment text.
9. `packages/skeleton/src/harness-host.ts`, the spawn admission (lines
   4414 to 4425): when `activeGateRuns(root)` is non-empty, append one
   advisory naming the run id, its kind and the sentence that probes will
   be refused until it ends, through the existing `record(root, input,
   {advisory})` path. Check: a case in
   `packages/skeleton/test/subagent-budget.test.ts` or the harness-host
   fixture that holds a gate run open, submits a spawn `PreToolUse`, and
   asserts the advisory text and that admission still happens; the same
   with no live gate asserts no advisory.
10. `scripts/lib/handoff-ledger.mjs` (line 103, `readHandoffLedger`) and
    `scripts/resume.mjs` (lines 1338 and 1472): the self-review advisory
    applies to `implementation-ready` only; `repair-complete` reads the
    ledger without it. Check: `bash scripts/test-resume.sh` (the `resume`
    row) with one case per completion.
10a. `scripts/docs-check.mjs`, `checkDocs` (line 446): a document over
    its ceiling always reports `ADVISORY <file>: <n> bytes over ceiling;
    planning resets ceilings` and never a failure, with or without an
    `advisoryDecision`; the raise rule at lines 544 to 549 is removed,
    because planning passes own the ceilings (product 07 §Operator-opened
    planning pass, 2026-10-07). Malformed or missing entries still fail.
    Check: `scripts/test-docs-check.mjs` (the `docs-check-fixtures` row)
    gains one case where a fixture document exceeds its ceiling and the
    check exits 0 with the advisory, and one where an entry is missing
    and the check fails as before.
11. Re-mint the three editions `scripts/lib/evidence-sources.mjs` lists
    for the edited files (`node scripts/authority-evidence.mjs --write`,
    `node scripts/artifact-identity-evidence.mjs --write`,
    `node scripts/verification-evidence.mjs --write`, each after
    `npm run build`), then `npm run harness -- emit`; check each with
    `--check`.
12. Write-backs: `docs/PLAYBOOK.md` §The loop, per work order, the
    paragraph "Current gate contract (WO-132, 2026-09-15)": replace its
    sentence that the final reviewer runs `npm test -- --review` once
    after the last source edit with the composed-row statement and add
    one sentence naming the four-step handoff sequence; product 07
    §Discipline already holds the sequence (written by the pass; this
    order changes no byte there unless the executor finds the text and
    the roles disagree, in which case the role text follows the
    document); `docs/evidence/WO-196/decisions.md` with the before and
    after bytes of each root and the diff of rule sentences; publication
    locks refreshed with `npm run publication:check`.
13. Handoff sequence (the steps this order makes mechanical): `npm run
    format`; `npm run test:docs`; `npm test -- --review`; complete
    `docs/evidence/WO-196/handoff.md`; `npm run resume --
    implementation-ready <flags>`.

**Deliverables:** the runner changes with their `runner-fixtures` cases,
the regenerated role roots and worker definition, the spawn advisory with
its fixture, the self-review advisory change with its `resume` case, the
ceiling advisory with its `docs-check-fixtures` case, the re-mints, the
write-backs above.

**Acceptance criteria (all required)**

1. A plain `npm test` and an `npm test -- --review` in a fixture
   repository that holds one unformatted `.mjs` file exit non-zero within
   60 s with no product task executed, name the file and print
   `npm run format` as the repair; after formatting, the same command
   proceeds past preflight. `--only <suite>` and `--machinery` are
   unchanged.
2. At a code identity whose plain row passes, `npm test -- --review`
   records a row with `gateSelection: "review"`, `executionMode:
   "composed"`, every product task `reused: true` naming its source row,
   and `requiredSuites` equal to the review selection; `--again` records
   `forced-fresh`; a task whose latest run at that identity failed is run
   fresh. `final-review-result` and `release close --dry-run` consume
   the composed row (the existing `scripts/test-resume.sh` and release
   fixtures pass unchanged).
3. The emitted executor, verifier and reviewer skills open with a
   numbered procedure in execution order whose handoff steps read, in
   this order: format, document gate, product gate with the no-write
   sentence, records, completion command; every rule sentence present on
   `main` is present once after the steps, except the five-refusals
   paragraph, which is present in CLAUDE.md only, and the two sentences
   criteria 4 and 5 change. `npm run harness -- check` is green.
4. The executor sentence names two fresh `dotln-worker` agents, one
   adversary and one improver, before `implementation-ready` only; the
   verifier sentence names the verifier's own probes, the two reports,
   a worker only to reproduce one named claim, and the follow-up route
   for a finding that breaks no criterion and no behavior `main` had;
   the reviewer carries the same route sentence. The sentences agree
   with product 07 §Verification review and attack as the 2026-10-07
   pass wrote it.
5. The executor skill carries WO-188 item 22's experiment and
   goal-alignment sentences and not the 900-second experiment text.
6. The installed executor, verifier and reviewer roots each measure
   below their `docs/control/budgets.json` ceiling, with the before and
   after bytes recorded in the decisions; no new acceptance is added.
7. A spawn tool call while a gate run is live is admitted with one
   advisory naming the run and that probes are refused until it ends;
   with no live gate, no advisory. `repair-complete` on a `handoff.md`
   without a `self-review:` line prints no advisory;
   `implementation-ready` still prints one.
8. A product document over its ceiling makes `npm run test:docs` print
   one advisory naming the bytes over and exit 0; a missing or malformed
   ceiling entry still fails; the raise rule is gone. The
   `docs-check-fixtures` row covers both cases.
9. The re-mints the Cost line names are recorded; the write-backs land
   (`docs/PLAYBOOK.md` §The loop, per work order; the decisions file;
   the publication locks); `npm test -- --review` and
   `npm run test:docs` green; `git diff --check` clean; no new
   dependency.

**Evidence gate:** the `runner-fixtures`, `resume` and skeleton fixture
transcripts; the before and after root bytes; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`scripts/test-runner.mjs`, `scripts/resume.mjs` and `contributor.ts` are
declared machinery sources, and again at final review. No live row.

**Write-back duty:** as listed in criterion 9 and step 12.

**Known issues and carry-ins:**

- FUP-3799fb396f911d8a (WO-112 D049) and FUP-117dc832458dc6e2 (WO-112
  D057) are allocated here: criterion 1 answers D049 mechanically;
  D057's record-write guard is answered by the procedure (nothing is left
  to write during the gate) and by criterion 7's advisory, not by a
  watcher. The executor records this reading in the decisions.
- WO-112 D063's follow-up (a worker spawned during a live gate) is
  criterion 7. WO-187 D051's follow-up (the separate improver) is
  criterion 4.
- WO-188 item 22 is taken here (criterion 5); WO-188's executor skips
  it and records that this order did it.
- WO-150-D003's condition (`coldStartBytes.executor` at 29,777) is
  criterion 6.
- Receipt known issue (2026-10-07 pass): the review composition is sound
  only while the code identity covers every byte the review selection
  reads; WO-186 made the identity cover untracked code and declared
  sources. Reopen when a composed review row passes at an identity where
  a fresh `--again` run of the same selection fails.

**Non-goals:** the slow suites (WO-197); WO-188's other items; a
`qualify` command; a refusal of spawns during a gate; the known-issues
reader; any change to what the document gate checks beyond the ceiling
advisory; the verifier's dollar cap; the cold-start ceilings' own check
(criterion 6 brings the roots under them; WO-187 criterion 6 already made
that check a goal, not a refusal).

**Operator-review assumptions**

1. The operator's words of 2026-10-07 set the adversary and improver at
   the end of implementation and nowhere else; verification and final
   review judge with their own probes and spawn only to reproduce a
   named claim. Reopen when an order's escape count at final review rises
   over three consecutive orders after this one.
2. Removing the five-refusals paragraph from the skills loses nothing a
   session reads: CLAUDE.md is loaded before any skill in both harnesses.
   Reopen if a harness loads a skill without the project instructions.
3. The composed review row is accepted by release close as a review row
   because nothing keys on `executionMode` (Observed gap); the executor
   confirms this by grep at its base before step 3 and records the
   result.
