# WO-163 — 5S on the launchpad, Sort and Set in order: three import-only scripts move into the library, a library file loses its command block, three one-shot planning inputs retire, the generated register file is marked generated, and the two docs-only evidence tools get their recorded disposition

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. File moves with importers updated, a
`.gitattributes` row, three retired JSON inputs and one repaired or
retired evidence check; no contract, gate step or role-text change and no
edition re-mint. Assigned at activation under the standing opt-out
default.
**Cost:** adds nothing new: three files move from `scripts/` to
`scripts/lib/` with six importers updated, one `.gitattributes` row, one
decision per retired input, one repaired `--check` or a historical marker.
Removes, measured on 2026-09-25 (planning document §7): three top-level
entrypoints that no one runs (`github-body.mjs`, `github-repository.mjs`,
`release-notes.mjs`; imported by `worktree.mjs`, `release.mjs`,
`lib/target-publish.mjs`, `lib/harness-prune.mjs` and two tests); a CLI
block inside `scripts/lib/release-fixtures.mjs` line 150; three planning
JSON files no receipt, check or document reads
(`process-debt-2026-09-09-dispositions.json`,
`machinery-stand-down-2026-09-15-dispositions.json`,
`proof-carrying-gates-2026-09-12-dispositions.json`, one-shot inputs to
`plan receipt --dispositions`); the 1.28 MB machine-written
`docs/planning/followups.json` appearing as authored in diffs; one
evidence tool whose own `--check` has failed since its activation commit
(WO-142 D008) and one whose operator-run row has waited since 2026-09-20
(WO-099 D007). No registered source changes. Wall-clock, tokens and
context bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's 2026-09-25 dispatch ("5S repo
management"), captured verbatim in ignored intake (SHA-256 in the ledger
section), and the measured inventory in the planning document §7 (95
top-level scripts, none unreferenced; 46 test scripts, none unwired; 78
evidence directories, none orphaned; the items above are what Sort and Set
in order found). 5S vocabulary from product 05 §5S / 6S: Sort never
deletes at first authority, so the three JSON files retire through a
decision that names their receipts. Planner-synthesized. Opaque identifier,
not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-142 merged (the earlier cleanup pass whose row A7
retained the evidence tools; closed).
**Recommended placement:** paired with WO-162 after WO-070 and WO-115 and
before WO-060 and WO-116. This order moves three files and edits their six
importers, `release-fixtures.mjs`, `.gitattributes`, three planning JSON
files and the two evidence tools; WO-162 edits the helper adopters it
lists, none of which is among these. Disjoint files; neither depends on
the other; neither re-mints. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-142",
    "relation": "satisfied-by-close",
    "reason": "the earlier cleanup pass whose row A7 retained the evidence tools this order disposes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/planning/off-ramps-5s-entropy-2026-09-25.md` §7 (the inventory
tables, one per S, with the command and count behind each row); product
05 §5S / 6S — the maintenance organism (Sort never deletes at first
authority; Sustain is a stated non-goal today); `docs/work-orders/WO-142-outstanding-cleanup.md`
row A7 and `docs/evidence/WO-142/rows.md` line 32;
`docs/evidence/WO-142/decisions.md` D008; `docs/evidence/WO-099/decisions.md`
D007; `scripts/lib/planning-followups.mjs` lines 436–442 (the register
writer); `.gitattributes` (the `dotln-generated` rows); `scripts/lib/release-fixtures.mjs`
line 150; `scripts/test-runner.mjs` lines 77–240 (the machinery-source
lists a move must keep true).

**Objective:** the scripts unit's top level holds only entrypoints, the
library holds only library files, generated files are marked generated,
and nothing tracked is kept because no one decided.

**Observed gap (dated 2026-09-25, `main` at `fa9957f1`):** the items in
the Cost line, each measured in the planning document §7 with the command
used. Local residue (`.runtime` 158 MB; `docs/control/local` 136 MB;
`harness prune` preview 207 candidates, 146.9 MB) is the operator's to
remove with the existing `--apply` and is not this order's.

**Design (scope discipline):**

- Move the three import-only scripts into `scripts/lib/` with `git mv`;
  update the six importers and any harness fixture pin that names the old
  path (the executor greps `docs/discovery` and `scripts/fixtures` first
  and records the result).
- Split `release-fixtures.mjs` line 150's command block into a top-level
  script only if something runs it; otherwise delete it with the decision
  naming the search.
- Retire the three JSON inputs after showing, by grep over `scripts/`,
  `docs/planning/refutations/` and the document checks, that nothing reads
  them; the decision names the receipt each one fed, and Git history keeps
  the bytes.
- Add `docs/planning/followups.json dotln-generated` to `.gitattributes`
  beside the existing rows.
- `authority-mutation-evidence.mjs --check`: regenerate against current
  source if the reproduction is still meaningful, else mark the WO-042
  reproduction historical beside its evidence (D008's two options; the
  executor picks with the reason). `evidence-mission-check.mjs`: run it
  from an outside terminal as D007 asks, or record with the operator that
  the row stays fixture-evidenced and close the follow-up.
- **Declined alternatives, recorded (planning document §7):** archiving
  consumed planning passes (27 live links; the operator's decision); a
  tracked-evidence byte ceiling (WO-154 cut the growth to about 72 KB per
  edition; reopen if a week adds more than 10 MB); new sustaining checks
  for orphan scripts or the docs-index map (zero and five findings; a
  second pass finding more reopens it); renaming the four non-test
  helpers in the `test-*` namespace (WO-162 touches those files).

**Deliverables:** the moves and importer edits; the attribute row; the
retirements with decisions; the two evidence-tool dispositions.

**Acceptance criteria (all required)**

1. `scripts/github-body.mjs`, `scripts/github-repository.mjs` and
   `scripts/release-notes.mjs` live under `scripts/lib/`; every importer
   resolves; `npm run harness -- check` and the discovery fixtures pass
   with no path drift.
2. `scripts/lib/` contains no file with a command block; the runner's
   machinery-source lists still name every source they named before.
3. The three JSON inputs are gone from the tree, each with a decision
   naming its receipt and the grep that showed no reader; `npm run
   test:docs` passes.
4. `git diff --stat` on a register sync shows `followups.json` as
   generated (the attribute row is present and `git check-attr` confirms
   it).
5. WO-142 D008 and WO-099 D007 are closed by a recorded disposition each,
   with the `--check` passing or the reproduction marked historical, and
   the register rows retargeted at close.
6. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the grep transcripts; the fixture runs; `npm test` at
final review. No live row unless the operator runs the mission-check
episode, which is D007's own row.

**Write-back duty:** decisions; the WO-142 and WO-099 rows; the product 05
5S section gains one dated sentence naming this pass as the first
launchpad Sort.

**Non-goals:** helper consolidation (WO-162); archiving planning documents;
new sustaining checks; local residue removal; any behavior change.

**Operator-review assumptions**

1. Moving import-only scripts under `scripts/lib/` is the layout the
   scripts README intends; the executor confirms against `docs/README.md`.
2. The operator runs `harness prune --apply` themselves after reviewing
   the listing.
