# WO-090 implementation evidence

The [2026-09-20 repair](repair-001.md) addresses VER-001 N1: retiring the
duplicated Goal Alignment procedure lowers every directed profile by 252 bytes
and one source line against activation. Generated cold-start bytes remain
unchanged. The original implementation account and its equal before/after
measurements are retained below; they describe the subject VER-001 judged.
The relocation table includes the additional repair row.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-fable-5-1","effort":"unknown","source":"operator-attested"}

Model and effort actually run: Claude Code; `claude --version` on the
operator's PATH reports `2.1.278 (Claude Code)`, the same line the 2026-09-19
WO-142 re-check recorded; the model is `claude-fable-5-1`, selected by the
operator with `/model` at session start; the effort is unknown, because Claude
exposes no effective-effort readback (`docs/discovery/environment.md`, WO-019
addendum) and nobody supplied a value in this session. The order recommends
executor xhigh+. The session ran as the one registered writer of the
`wo-090` worktree at `f24b5d72`; no branch commit, push, pull request or
release was made.

WO-090 prepares application **v0.35.1** (patch above local `v0.35.0`) with
compiler `0.17.0`, skeleton `0.31.0`, kernel `0.6.0` and console `0.1.7`
unchanged ([D004](decisions.md#wo-090-d004--assign-application-v0351-as-a-patch-above-local-v0350-with-no-component-bump)).

## What changed

- `docs/product/07-execution-guide.md`: the Codex sandbox-approval paragraph
  in §Operator resume phrases step 2 became an eight-line pointer;
  §Model-specific notes became a pointer stub that keeps its heading, the
  behavioral-guidance paragraph and the attestation contract sentence;
  §Read order for a cold start gained one paragraph naming the homes and the
  measured fact. 2,016 lines and 147,292 bytes before; 1,932 lines and
  141,127 bytes after the relocation, and 1,933 lines and 141,047 bytes
  after the repair retired the goal card's duplicated procedure.
- `docs/AI-HARNESS-SECURITY.md`: new `## Harness version, model and effort
  readback` section (WO-132 attestation observations, Codex thread readback
  and account label, WO-126 version-line attestation) and new
  `### Selected-session readback, completion and counters` subsection under
  the Copilot section (the three WO-146 paragraphs). 815 lines before; 914
  after.
- `docs/PLAYBOOK.md`: `briefing` joins the read-only commands in §Harness
  safety baseline, that paragraph names itself the rule's home, and
  §Resume command surface gains the WO-028 control-time sentences the
  playbook did not already carry. 638 lines before; 654 after.
- `docs/publication/software-engineer-toc.md`: the source lock moved from
  `266657b3…` to `841fa17c…`, and again to `c0d4e920…` after the repair,
  because that edition cites §Operator resume phrases;
  `docs/publication/everyday-ai-user-toc.md`: the lock moved from
  `a5f7e8bd…` to `9dc66d3f…` because that edition cites the roadmap's
  release-ladder section, which now carries the activation note; index
  coverage stays 272 of 272 product headings.
- Release assignment: the order heading, the README release claim and a
  roadmap activation-completion note carry `v0.35.1`.
- This directory: the four measurement records, [decisions](decisions.md)
  and this README. No generated role text, hook, skill, script, test or
  package changed.

## Measurement (criterion 1)

Method: `measureHarnessContext()` from `scripts/harness-context.mjs`, which is
WO-039's criterion-6 method: the whole current instruction file plus each
generated role skill are scanned for every read directive, the WO-999
fixture resolves the task selectors, named heading subtrees are counted in
UTF-8 bytes and source lines with overlaps counted once, and both skill
roots are measured. It ran at activation on `f24b5d72` before any edit
([harness-context-before.json](harness-context-before.json)) and again after
all edits ([harness-context-after.json](harness-context-after.json)).
`measureColdStarts` ran beside it
([cold-start-before.json](cold-start-before.json),
[cold-start-after.json](cold-start-after.json)); the two cold-start files are
byte-identical.

| Role          | Directed total before (bytes / lines) | After           | Product 07 in the set, before and after                              | Cold-start bytes before → after |
| ------------- | ------------------------------------- | --------------- | -------------------------------------------------------------------- | ------------------------------- |
| executor      | 32,855 / 300                          | 32,855 / 300    | §Goal-aligned decisions only: 6,205 bytes, 83 lines (39–121 → 46–128) | 23,154 → 23,154                 |
| verifier      | 30,762 / 295                          | 30,762 / 295    | same subtree, same bytes                                             | 21,061 → 21,061                 |
| reviewer      | 36,666 / 373                          | 36,666 / 373    | same subtree, same bytes                                             | 22,279 → 22,279                 |
| release-close | 22,504 / 239                          | 22,504 / 239    | same subtree, same bytes                                             | 13,967 → 13,967                 |

Both skill roots report the same figures. Every role remains strictly lower
than the frozen legacy activation read (the method's own `lower` flag stays
true). Ten cold-start rows report `within`; the two refuter rows report
`unset`, because that role has no ceiling. All twelve sizes are unchanged.

Findings against the three clauses of criterion 1:

- **Lower after than before for every role: not met.** The totals are equal.
  Product 07 enters the measured directed sets only through the generated
  skills' one guide directive, `#Goal-aligned decisions`; §Model-specific
  notes and the sandbox-approval paragraph were in no role's set before the
  change, so removing them changes no total. This is the structural fact
  the order's Cost line said it could not know; [D001](decisions.md#wo-090-d001--the-relocated-sections-were-never-in-any-roles-directed-set-relocate-anyway-prune-nothing-and-put-the-criterion-1-premise-to-the-operator)
  records it, the rejected ways to force a lower number, and the follow-up
  for the operator.
- **No relocated paragraph is in a role's directed-read set unless it already
  was: met.** The after files list the same directed inputs as the before
  files; `docs/AI-HARNESS-SECURITY.md` and `docs/PLAYBOOK.md` are directed
  inputs of no role, and the guide's directed subtree is unchanged.
- **No role's generated cold-start bytes rise: met.** `CLAUDE.md` and the six
  skills in both roots are untouched; the measurement files are identical.

Consequence figures, not the measure: the guide lost 84 lines and 6,165
bytes; the two destinations gained 115 lines and 7,558 bytes, of which the
pointer sentences, headings and provenance lines are new and the rest is the
relocated text. A cold start that reads the whole guide, the legacy method
the frozen baseline records, is 6,165 bytes shorter.

## Relocation table

Origin lines refer to `docs/product/07-execution-guide.md` at `f24b5d72`.

| #   | Paragraph                                                                                                | Disposition                                                                                                                                                                                                                                         | Home                                                                                                                                                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Lines 244–256, §Operator resume phrases step 2: "At the dated Codex baseline, run each state-changing…" | Retired; pointer left in place. All seven rule sentences are carried in equivalent wording; `briefing` was added to the playbook's read-only list so nothing is lost ([D003](decisions.md#wo-090-d003--the-codex-sandbox-approval-paragraph-is-retired-with-a-pointer-because-three-surfaces-already-carry-it)).                                          | Playbook §Harness safety baseline; security document §Why recovery checkpoints warn under sandboxed Codex; generated executor skill line "State-changing resume commands require one-invocation outside-sandbox approval in Codex…" |
| 2   | Lines 1908–1914, "Version and effort observations (WO-132, 2026-09-15)"                                  | Relocated verbatim                                                                                                                                                                                                                                  | Security document §Harness version, model and effort readback                                                                                                                                                                        |
| 3   | Lines 1916–1921, "`ultra` and `ultra code` normalize…"                                                   | Relocated verbatim                                                                                                                                                                                                                                  | Same section                                                                                                                                                                                                                         |
| 4   | Lines 1923–1932, "Codex briefings, status and usage output report…"                                      | Relocated verbatim, rewrapped                                                                                                                                                                                                                       | Same section                                                                                                                                                                                                                         |
| 5   | Lines 1934–1944, "Copilot selected-session readback (WO-146, 2026-09-20)"                                | Relocated; the bold label became the subsection heading plus a provenance sentence                                                                                                                                                                  | Security document §Copilot CLI › Selected-session readback, completion and counters                                                                                                                                                  |
| 6   | Lines 1946–1953, "The ordinary completion line is…"                                                      | Relocated verbatim                                                                                                                                                                                                                                  | Same subsection                                                                                                                                                                                                                      |
| 7   | Lines 1955–1972, "Counter availability is separate…"                                                     | Relocated; the link to the Copilot section, now the enclosing section, became a link to its control table; relative links rebased                                                                                                                   | Same subsection                                                                                                                                                                                                                      |
| 8   | Lines 1974–1990, bullet "Control-time migration (2026-09-04, WO-028)"                                    | Relocated: the schema-1 optionality, ordering, discovery-observation, public-profile and WO-126 channel sentences joined the playbook's WO-028 paragraph; the status and `times` sentences were already carried there and in the guide's step 1 and `times` row | Playbook §Resume command surface                                                                                                                                                                                                     |
| 9   | Lines 1991–2012, bullet "Version-line attestation (WO-126)"                                              | Relocated verbatim as a paragraph; relative links rebased                                                                                                                                                                                           | Security document §Harness version, model and effort readback                                                                                                                                                                        |
| 10  | Lines 2013–2016, bullet "Behavioral guidance rots across model generations…"                             | Kept in the guide; "lives here" became "lives in this repository"                                                                                                                                                                                   | Product 07 §Model-specific notes                                                                                                                                                                                                     |
| 11 | §Goal-aligned decisions: All phases, operator direction 2026-09-11 | Retire the duplicated procedure with a dated pointer; keep the unique clauses in the same section | Generated skills: Goal Alignment and Process Cost; guide: NoOp paragraph and its retained qualifications |

Repair row 11: the **All phases, operator direction 2026-09-11** paragraph
in §Goal-aligned decisions at the activation base. Retire its duplicated
procedure with a dated pointer to the generated skills' Goal Alignment and
Process Cost lines. Retain its evidence-of-benefit, intervention-risk,
verification/handoff comparison and legal/release/NoOp limits beside the
existing NoOp paragraph. The [sentence-to-home comparison](repair-001.md#rule-homes)
accounts for every clause; the lens table and all other goal-card paragraphs
are unchanged.

Added text in the original implementation: the §Read order paragraph (7 lines), the §Model-specific notes
stub (21 lines), the step-2 pointer (8 lines), the security section's
provenance paragraph and the Copilot subsection's provenance sentence, the
playbook's home sentence and provenance clause. No rule was dropped; the
phrase table (WO-088) and the generated role text are untouched (non-goals).

## Write-backs (criterion 3)

- 07 §Read order for a cold start: the homes and the measured fact.
- `docs/AI-HARNESS-SECURITY.md`: the two new sections above.
- `docs/PLAYBOOK.md`: the three edits above.
- Ledger entry: the order was filed on 2026-09-08, so the duty is discharged
  by [decisions.md](decisions.md) and its rows in the
  [decisions index](../../lineage/decisions-index.md), refreshed with
  `npm run meta`; the work-order index marks the substitution.
- Publication locks: `npm run publication:check` reports both editions
  current after both lock refreshes.

## Checks

- Directed-load and cold-start measurements: run before and after, recorded
  above.
- Anchor resolution: a heading scan confirmed all ten anchors the new
  pointers reference (four in the security document, two in the playbook,
  four in the guide).
- Sentence-home check: every sentence of the removed paragraphs was found,
  after normalizing links and code spans, in its named home; the exceptions
  are the reworded labels and links listed in the table and the seven
  sandbox sentences carried in equivalent wording, which were compared by
  hand and listed in D003.
- `npx prettier --check` on the changed documents: pass.
- `npm run publication:check`: pass, both editions current.
- `npm run release -- prepare --local`: target `v0.35.1` current, no files
  changed after the activation completion; `npm run release --
  check-surfaces --local`: no failing line.
- `npm run work-orders -- index` and `npm run meta`: refreshed.
- `git diff --check`: clean.
- `npm run test:docs`: 19 passed, 0 failed, 18.16 s (external wall-clock
  18.49 s), run after the last write.
- `npm test`: 21 passed, 0 failed, 259.22 s (external wall-clock 259.60 s),
  65 fresh tasks, run after `test:docs` with no write during either gate;
  source: the executed runners and `/usr/bin/time -p`, logs in ignored
  session scratch.

## Process cost

At entry (2026-09-20T16:10:14Z, source `claude-transcript-message-usage`,
scope `dispatch`): 182,635 total tokens (68 input, 154,604 cached input,
26,871 cache-write input, 1,092 output); cost unknown; subagents 0 of 20,
none planned or spawned. At handoff (2026-09-20T16:34:35Z, same source and
scope): 4,602,123 total tokens (742 input, 4,254,499 cached input, 255,105
cache-write input, 91,777 output); cost unknown; 83 steps; subagents still
0 of 20. Wall-clock of the dispatch is the control log's to record.

## Deviations and limits

- Criterion 1's first clause is reported as not met with the measured
  equality and its cause; see D001 and its follow-up for the operator. The
  other two clauses and criteria 2 and 3 are met; criterion 4 is met by the
  two gate rows and the clean whitespace check above.
- Effort is `unknown` in the attestation for the reason given at the top.
- The measurement fixture is WO-999; the totals a real order's cold start
  loads depend on that order's Cites block and are not claimed here.
