# WO-248 decisions

## WO-248-D004

Verification (VER-001) rendered the real control corpus for every order in
the collector's selection with
[the verifier's probes](verifier-001-probes.mjs) and recorded the outcomes in
[verification-001.json](verification-001.json). Every body carries a row for
each of the seven dispatch roles in `dispatchKinds`. Release-close, planner,
refuter and router have all five value cells `unknown` in each of the five
closed orders' bodies. WO-248 also shows reviewer that way before its final
review. Only the two bound columns hold an observed `0`. A reader cannot tell
a role that never dispatched for the order from a dispatch whose cost went
unobserved, and four such rows sit beside the two or three that carry
figures. This is the kind of noise the order removed from the body. The rows
meet criterion 1 as the order defines its row unit ("a row per dispatch
role"), and D002 deliberately keeps wholly unknown rows rather than hide
missing evidence. So this is a follow-up, not a blocking finding.

```json
{
  "id": "WO-248-D004",
  "date": "2026-11-02",
  "dispatch": "resume: verify",
  "decision": "Record the meter block's rows for dispatch roles with no observation of any kind as a follow-up; criterion 1 is met as the order defines its row unit.",
  "evidence": [
    "verifier-001-probes.mjs P1 over the real selection (WO-247, WO-237, WO-245, WO-251, WO-249, WO-248): every body has seven role rows; release-close, planner, refuter and router render five unknown value cells in every closed order's body",
    "scripts/lib/process-budget.mjs dispatchKinds is a fixed seven-role list; scripts/lib/meta.mjs collectMeta maps every order's dispatches over it",
    "WO-248 Cost names 'a row per dispatch role'; D002 retains wholly unknown rows"
  ],
  "rejected": [
    {
      "option": "Fail criterion 1",
      "reason": "Each rendered row is the subject's own and the order's Cost defines the row unit as a dispatch role; product 07 §Verification review and attack routes a usefulness defect that breaks no criterion to follow-up."
    },
    {
      "option": "Record the observation only in the verification report",
      "reason": "A defect verification meets and does not fix is recorded with a named follow-up."
    }
  ],
  "followup": "In scripts/lib/meta.mjs renderMetaTable, render a dispatch-role row only when the subject's records show that role dispatched (a completed phase attempt, a usage observation, a journal entry or a bound event); keep unknown for each unobserved value of a dispatched role, and name the roles with no record in one sentence below the table so the absence stays visible without rows of unknown. Pin it in scripts/test-process-debt.mjs (the subject-meter case) and the release meter_shape case in scripts/test-release.sh.",
  "reopenWhen": "The operator or a reviewer reports the unknown role rows in a pull-request body, a planning pass allocates this follow-up, or the collector gains a per-role dispatched flag."
}
```

## WO-248-D003

The independent consistency recheck reran the same bounded declaration test
after the repair: one test passed, zero failed. All three existing reviewers
finished their current-diff rechecks before the complete run. The full review
gate then passed; its result and the three reports are retained in the handoff
and self-review record.

```json
{
  "id": "WO-248-D003",
  "date": "2026-11-02",
  "dispatch": "resume: next; independent consistency review",
  "decision": "Declare scripts/lib/github-body.mjs as a process-debt machinery source because the new rendered-body regression imports its shape and profile assertions directly.",
  "evidence": [
    "Consistency reviewer F1 traced test-process-debt.mjs's new literal dynamic import to the machinery source declaration in scripts/test-runner.mjs",
    "The bounded test 'WO-174 every machinery suite covers its direct entry imports and literal script paths' failed with process-debt: uncovered scripts/lib/github-body.mjs; one test, one failure",
    "The declaration scanner checks direct imports; listing the body helper also schedules process-debt when that helper changes"
  ],
  "rejected": [
    {
      "option": "Exclude the import from the machinery inventory or remove the body assertions",
      "reason": "Both would weaken the regression's declared dependency or the order's body-shape evidence. The existing declaration mechanism is sufficient."
    }
  ],
  "reopenWhen": "The regression no longer directly imports the body helper or the suite dependency mechanism changes."
}
```

## WO-248-D002

The operator dispatched `resume: next` on 2026-11-02. Canonical status selected
WO-248 in the active phase. The implementation is limited to the meter renderer,
its release callers, their regression checks and the named product write-back.

The checked before-state is core PR #258, read with `gh pr view 258 --json body`:
its block includes the six-order Work table, a nine-column Dispatch table,
compound values such as `2 h 18 min (Δ -7 h 6 min)` in the order's reported
fork example, and core's ` / 768` USD cell. Core's footer counts 54 omitted
observations. The fork screenshot is a planning observation carried by the
work order, not independently re-observed here: this checkout's ignored
`docs/intake` contains only the three `.gitkeep` files and no screenshot or
message capture. The core body and current renderer independently establish
the defect this implementation repairs.

The after-state is specified by the executable fixture in
`scripts/test-process-debt.mjs`, “the subject meter has one value per cell and
labelled closed-order comparisons”. Its body has this row:

```text
| WO-999/executor | 1 h 0 min | 2,000 | 0.5 | 7 | 20 | 1 | 1 |
```

The verifier row has seven `unknown` cells, the reviewer row has observed zeroes,
and the comparison says “Against WO-997, the previous closed order: wall clock
1 h 1 min less.” The release shell fixture checks the generated body and old-block
replacement with a second open order present. Executed results belong in the
handoff after validation; these are the fixture's assertions, not a passing
claim made before the run.

```json
{
  "id": "WO-248-D002",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Render only the explicitly named subject's dispatch roles, retaining wholly unknown rows and observed zeroes. Compare the seven displayed metrics using the subject's order totals and the latest closed predecessor in the collector's selection, with a separate named sentence for each metric known on both sides. Keep collector deltas and all terminal metrics unchanged.",
  "evidence": [
    "WO-248 criteria 1–4 and design: one named subject, eight columns, no open reference and no collector change",
    "gh pr view 258 --json body: Work and Dispatch tables, per-cell deltas, compound USD cells and the 54-observation omission footer",
    "scripts/lib/meta.mjs: collectMeta selection is five recent closed orders followed by open orders; its adjacent-row deltas can refer to another open order",
    "scripts/release.mjs: regeneratedPullRequestBody and prepare both know the subject id; both now pass it to renderMetaTable",
    "scripts/test-process-debt.mjs and scripts/test-release.sh: replacement shape assertions derive from this order's criteria, not a historical body's shape"
  ],
  "rejected": [
    {
      "option": "NoOp: retain both tables and the omission footer",
      "reason": "The checked core body reproduces the ambiguous cells the operator reported. Retaining them fails the reader's task."
    },
    {
      "option": "Use the collector's existing deltas in the body",
      "reason": "With multiple open orders those deltas can compare with an open order; recompute only the body's comparison against the selected closed predecessor."
    },
    {
      "option": "Compare every role separately or include undisplayed metrics in the body",
      "reason": "One comparison per displayed metric at order-total scope keeps the comparison about the order under review without reintroducing a second planning report. The terminal retains every metric."
    },
    {
      "option": "Expand the collector to every historical order",
      "reason": "The collector is an explicit non-goal. Closed subjects retain their rows within its existing selection; an absent subject renders no borrowed rows or comparison."
    }
  ],
  "reopenWhen": "The operator reports wrapping in the next pull request, asks for another comparison scope, or needs regeneration of a closed subject outside the collector's selection."
}
```

The goal-alignment risk is seeking the wrong goal: changing the collector or
inventing new metrics would widen a rendering repair. Explicit subject selection
and unchanged collection address it. The other risk is hiding missing evidence;
`unknown` cells and comparisons only when both operands are observed address it.
No component source or dependency changes, so component versions remain unchanged;
the kit's application patch is assigned by release preparation in D001.

Validation follows the current executor procedure and product 07 handoff sequence:
three independent reviews after implementation, then the complete review run,
then handoff write-backs and the document gate. That complete run includes the
order's named process-debt, meta, release and github-body suites. The order's
older focused-gate-before-complete wording is superseded by the current rule
that focused gates reproduce a failed suite and do not precede the complete run.

Preparation observations: `npm run publication:check` initially failed only
because the software-engineer edition's source lock was stale after the product
07 edit. `npm run sync` regenerated that lock and reported all other generated
surfaces current; the repeated publication check passed. `node scripts/lineage.mjs
index --check` passed with 190 sections. `git rev-list --count HEAD..main` returned
zero and both worktrees named the same head, so integration had nothing to take
in. A `.git` traversal found only this checkout's root entry, no nested scratch
repositories. The formatter was started first; sync was inadvertently started
before the formatter's host completion was collected. Both exited successfully,
and sync's format check reported current; no concurrent authored edit occurred.

## WO-248-D001

```json
{
  "id": "WO-248-D001",
  "date": "2026-11-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.110.1, the next patch above the observed release baseline v0.110.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.110.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "patch classification declared in docs/work-orders/WO-248-the-pull-request-table-says-what-its-reader-can-use.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-248-D005

<!-- integration refs/dotln/checkpoint/WO-248/6 -->

The final review integrated `main` before the complete run. `npm run worktree
-- integrate WO-248` fetched `origin/main` at `e6aaeecc` (WO-250, #267, four
commits past the base `91a730ac`), checkpointed the tree as
`refs/dotln/checkpoint/WO-248/6`, stashed the uncommitted work as
`WO-248 integrate 2026-11-02` (`ccc08bb2…`, dropped after its complete
application), fast-forwarded and re-applied it with no authored conflict, and
regenerated the runtime, the harness bundle and manifest, the control
projection, the release preparation, the indexes, the sibling registry, the
publication locks and the console fixtures. Release preparation retimed the
order from `v0.110.1` to `v0.111.1` above the observed baseline `v0.111.0`
and rewrote the meter snapshot. No package, lockfile or component version
changes, so there is no version collision.

Of the files this order touches, WO-250 changed product 07 (its review-ladder
text, away from this order's paragraph) and `scripts/test-release.sh` (six
lines in the release-close case for the change-review lane); it changed no
byte of `scripts/lib/meta.mjs`, `scripts/release.mjs`,
`scripts/lib/github-body.mjs` or product 08. Every verified claim about the
renderer carries forward on its original evidence, and the verifier's
terminal comparison with main's renderer carries forward because main's
`scripts/lib/meta.mjs` is byte-identical at both bases. Two consequences of
the merge were judged fresh: the collector's selection now reads WO-237,
WO-245, WO-251, WO-249 and WO-250 beside WO-248, so the order's body compares
with WO-250, and the integrated code identity `a007550b…` had no passing
complete row, so the review ran `npm test -- --review` once at it after the
last edit and `npm run format`. The affected checks the helper printed were
run on the integrated tree: `node scripts/harness.mjs check` (42 generated
surfaces, exit 0), `npm run release -- check-surfaces --local` (exit 0),
`npm run publication:check` (exit 0 after D006's repair and `npm run sync`)
and the complete run recorded in FINAL-001.

```json
{
  "id": "WO-248-D005",
  "date": "2026-11-02",
  "dispatch": "resume: final review; worktree integrate WO-248",
  "decision": "Integrate main at e6aaeecc (WO-250) before the complete run, carry every verified renderer claim forward on its original evidence because WO-250 changed none of the renderer, its callers or the body helper, accept the release retime from v0.110.1 to v0.111.1 above WO-250's v0.111.0, and run one fresh complete review at the integrated identity a007550b… because it had no passing row.",
  "evidence": [
    "refs/dotln/checkpoint/WO-248/6",
    "base 91a730ac706a1933ebe9fb2c826455d8adffb4dc",
    "upstream e6aaeeccfca2441712cce6c0ed5578de7e04390b",
    "git diff 91a730ac e6aaeecc --stat on the order's files: docs/product/07-execution-guide.md and scripts/test-release.sh only; scripts/lib/meta.mjs, scripts/release.mjs, scripts/lib/github-body.mjs and docs/product/08-publication-compiler.md unchanged",
    "release preparation: Retimed WO-248: v0.110.1 → v0.111.1 above the observed release baseline v0.111.0. Files changed: docs/work-orders/WO-248-the-pull-request-table-says-what-its-reader-can-use.md, README.md, docs/evidence/WO-248/meta.json. Meter snapshot: docs/evidence/WO-248/meta.json, 4966 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity at the integrated tree a007550b6895e7921397c75060900a092a3ef1b6307ddde9f90b47c918cf8896 with no passing complete row before this review's run; FINAL-001 records the run",
    "node scripts/harness.mjs check: 42 generated surfaces, exit 0; npm run release -- check-surfaces --local: exit 0; npm run publication:check: exit 0"
  ],
  "rejected": [
    {
      "option": "Credit the executor's complete row at f6b51efe… after integration",
      "reason": "WO-250's merged scripts, compiler and skeleton sources are code, so the integrated identity differs from the row's; the identity, not the dispatch time, says what was tested."
    },
    {
      "option": "Rewrite reviewed commits or drop a stash before application completes",
      "reason": "Both histories and unfinished recovery material must remain available; the helper dropped the stash only after its complete application and kept the checkpoint."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-11-02. Original base: `91a730ac706a1933ebe9fb2c826455d8adffb4dc`.
Fetched main: `e6aaeeccfca2441712cce6c0ed5578de7e04390b`. Checkpoint: `refs/dotln/checkpoint/WO-248/6`.
Named stash dropped after completed application: `ccc08bb2a1238b953a78aa6405c660ac96a34130` (WO-248 integrate 2026-11-02).
Resolved projections: README.md, docs/control/current.md, docs/publication/software-engineer-toc.md, docs/work-orders/HISTORY.md, docs/work-orders/README.md.
Release preparation: Retimed WO-248: v0.110.1 → v0.111.1 above the observed release baseline v0.111.0. Files changed: docs/work-orders/WO-248-the-pull-request-table-says-what-its-reader-can-use.md, README.md, docs/evidence/WO-248/meta.json. Meter snapshot: docs/evidence/WO-248/meta.json, 4966 bytes. Tag observation: local snapshot only.
Carried-forward claims: every VER-001 claim carries forward on its original evidence (above); the comparison reference and the complete row were re-derived at the integrated tree.
Authored conflicts observed: none.
Affected checks: run on the integrated tree as listed above and in FINAL-001.

## WO-248-D006

The final review's own findings and dispositions. The verifier's probe script,
run under the bounded wrapper at the integrated tree
(`node scripts/harness.mjs bounded -- node docs/evidence/WO-248/verifier-001-probes.mjs <root>`,
exit 0), rendered the six selected orders (WO-237, WO-245, WO-251, WO-249 and
WO-250 closed; WO-248 in final review) each as its own subject with seven rows
and zero shape problems; WO-237, first in the selection, has no comparison
sentence, every other order's sentences name the latest closed order before
it, and WO-248's six sentences name WO-250 (no USD sentence, since both totals
are unknown); the constructed edges and the regenerated WO-249 and WO-251
bodies read as VER-001 recorded them. The subject-meter case, the WO-170
closed-snapshot case and the WO-174 machinery-declaration case of
`scripts/test-process-debt.mjs` pass as single bounded tests (1 of 1 each).
F1 stands as VER-001 routed it and stays boarded, because repairing it would
change the renderer and two pins after the complete run for a row shape the
order did not ask for.

F2: product 08 §PRs and commits still said that `release prepare` "reports
previous-order deltas without inventing limits, leaves an unavailable
observation as a blank cell or an omitted dispatch row, and says in one line
how many it omitted", which contradicted the product 07 paragraph criterion 5
names and the block the complete row judges. The executor's consistency
reviewer, whose brief covers product documentation agreeing with the change,
and VER-001 both missed it, so its class is `escape`; it breaks no criterion
and no behavior `main` had, so its route is `follow-up`, and the review fixed
it: the sentence now names one table for the order under review, a row per
dispatch role, one value per cell, `unknown`, hours and minutes and the named
closed-predecessor sentence, linking D002 and product 07's discipline rule.
The edit is documentation and moves no code identity; `npm run sync`
regenerated both publication locks and `npm run publication:check` passes.
The two historical `prBody` examples keep the old table, as product 08 says
they do.

The eight pending follow-up rows that `npm run plan -- followups --touching`
lists (FUP-17ea51254e5a7256, FUP-8dd0eb609946b9d1, FUP-912adb42a652b75f,
FUP-941fd291e0fd1033, FUP-977e50f635de762d, FUP-ac86ee429dee2947,
FUP-d0a9719cc2e4ec55 and FUP-dfde4050da06d43b) each name
`scripts/test-runner.mjs`, `scripts/test-process-debt.mjs`,
`scripts/release.mjs`, product 07 or this order's decisions file in their text
only; this order changes a renderer, two callers and their pins, opens none of
those seams and meets none of their conditions, so every row is left as
matched.

```json
{
  "id": "WO-248-D006",
  "date": "2026-11-02",
  "dispatch": "resume: final review",
  "decision": "Accept the integrated subject on the verifier's probes rerun at the integrated tree and three single tests; keep F1 boarded under D004; repair product 08 §PRs and commits in the review so it describes the meter block as built, listed as F2 (follow-up, escape, fixed); leave the eight matched follow-up rows as they are.",
  "evidence": [
    "verifier-001-probes.mjs under the bounded wrapper at the integrated tree: selection WO-237, WO-245, WO-251, WO-249, WO-250 closed and WO-248 final-review; six subjects, seven rows each, zero problems; WO-237 no sentence, WO-248 six sentences against WO-250; stored WO-249 and WO-251 regenerated with seven rows, six sentences, no problems",
    "scripts/test-process-debt.mjs single bounded tests: the subject meter has one value per cell and labelled closed-order comparisons (1 of 1); WO-170 a closed order's snapshot stands for its journals (1 of 1); WO-174 every machinery suite covers its direct entry imports (1 of 1)",
    "docs/product/08-publication-compiler.md §PRs and commits, the release prepare sentence, before: blank cell, omitted dispatch row, one line counting omissions; after: one table for the order under review, a row per dispatch role, one value per cell, unknown, hours and minutes, the named closed-predecessor sentence, links to WO-248-D002 and 07-execution-guide.md#discipline",
    "npm run sync: publication regenerated; npm run publication:check: 45 and 29 linked source sections current, exit 0",
    "npm run plan -- followups --touching: eight pending rows, each matched by a path or the order name in its text only"
  ],
  "rejected": [
    {
      "option": "Repair F1's wholly unknown role rows in the review",
      "reason": "A source change after the complete run owes another run, and the order's Cost defines the row unit as a dispatch role; D004 holds the repair rule for a planning allocation."
    },
    {
      "option": "Board the product 08 sentence as a follow-up instead of repairing it",
      "reason": "A standing product document that contradicts the built block fails its reader now; the edit is one sentence of documentation, moves no code identity and is covered by the publication check and the document row."
    },
    {
      "option": "Dispose one of the matched follow-up rows",
      "reason": "None has its seam opened or its condition met by a renderer change; a textual match is a pointer, never a verdict."
    }
  ],
  "reopenWhen": "The operator reports a wrapped or unreadable cell in this pull request's table, a planning pass takes up FUP-225e0993974f3f4b, or product 08's description of the block diverges from the renderer again."
}
```
