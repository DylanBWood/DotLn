# WO-167 evidence — the execution guide folded

Order: [WO-167](../../work-orders/WO-167-execution-guide-folded.md), dispatched
by `resume: next` on 2026-09-28 in the `wo-167` worktree at base `ddb58d26`,
where product 07 is byte-identical to the order's recount at `5f3849ec`.
Decisions: [decisions.md](decisions.md). Fold table:
[fold-table.md](fold-table.md). Register requests:
[register-duplicates.json](register-duplicates.json). Meter snapshot:
[meta.json](meta.json).

## Counts (criteria 1 and 4)

| Measure | Base `ddb58d26` | After |
| --- | ---: | ---: |
| Product 07 lines | 2,617 | 2,068 |
| Product 07 bytes (all counted; no exempt range) | 188,390 | 154,129 |
| Product 07 ceiling (`docs/control/doc-ceilings.json`) | 188,399 | 157,212 |
| Dated paragraphs, line-start rule (the order's count) | 33 | 0 |
| Dated paragraphs, the docs check's parser (list items included) | 44 | 0 |
| Bold spans holding a date, anywhere in product 07 | 45 | 0 |
| `Candidate —` headings in product 07 | 9 | 0 |
| Docs-check baseline shapes for product 07 (`docs/control/doc-baseline.json`) | 17 | 0 |
| Planning map bytes / lines | 381,012 / 2,282 | 412,672 / 2,780 |

The new ceiling is ceil(154,129 × 1.02), the rule every other product entry
follows ([D007](decisions.md#wo-167-d007)). The VER-001 repair rewords the
guide's sentence on `harness-context --check` in the same 104 bytes, so the
count and the ceiling are unchanged ([D011](decisions.md#wo-167-d011)). One bold paragraph whose label
starts `Candidate —` stays in §Operator recovery controls; it is not a heading
and not one of the nine ([D004](decisions.md#wo-167-d004)).

## Headings of product 07 (criterion 2)

Before, 27 headings; after, 18. The 18 that stay keep their text and anchors.
The nine that left are the candidates, now level-three headings with the same
slugs under §Moved from the execution guide in the
[planning map](../../planning/work-order-map.md#moved-from-the-execution-guide-2026-09-28):

- Candidate — guided operator work orders
- Candidate — planner startup context
- Candidate — recurring review of implementation alternatives
- Candidate — cold-gate structural cuts
- Candidate — refutation pass worth its cost
- Candidate — follow-up register settlement
- Candidate — local lane retention
- Candidate — stale writer reservation self-diagnosis
- Candidate — total subagent cap across every spawn path

The 18 that stay: Execution guide — for any model session working in this
repo; Read order for a cold start; Goal-aligned decisions; Operator resume
phrases — how you get dispatched; Derived work and intent; Declaring a
portfolio; Where the control plane finds its documents; Independent workflows
and integration; Operator recovery controls; Operator-opened ideation mode;
Ideation breakout receipt and verification; Operator-opened planning pass;
Retained planning follow-ups; Research and guided-operator work orders;
Workflow closeout and releases; Documentation freshness and ownership;
Discipline; Model-specific notes.

## Product 07 headings that open orders cite (criterion 2)

Parsed from the `Cites` block of each of the 52 active and open orders the
generated index lists, with the resolver the harness uses for an order's
citations (`sectionRange`). The list is identical before and after, every
entry resolves, and none names a moved heading, so no citation was retargeted:

| Heading | Orders |
| --- | --- |
| Discipline | WO-014, WO-033, WO-035, WO-036, WO-057, WO-072, WO-073, WO-074, WO-075, WO-077, WO-102, WO-103, WO-105, WO-107, WO-112, WO-113, WO-118, WO-173 |
| Where the control plane finds its documents | WO-072, WO-073, WO-076, WO-077, WO-078, WO-080 |
| Model-specific notes | WO-014, WO-102, WO-103, WO-105, WO-107 |
| Operator-opened planning pass | WO-075, WO-089, WO-113, WO-172 |
| Operator resume phrases — how you get dispatched | WO-033, WO-088 |
| Workflow closeout and releases | WO-033, WO-072 |
| Documentation freshness and ownership | WO-035, WO-113 |
| Operator recovery controls | WO-083, WO-112 |
| Derived work and intent | WO-123 |
| Declaring a portfolio | WO-123 |
| Read order for a cold start | WO-035 |
| Retained planning follow-ups | WO-173 |
| (whole document) | WO-167 |

## The skills' and the instruction file's citations (criterion 2)

`node scripts/harness-context.mjs --check` is the proof criterion 2 names. At
implementation it measured `CLAUDE.md` and skill bytes only and exited 0 with a
cited heading renamed ([D006](decisions.md#wo-167-d006)), which VER-001 failed
as F1. The repair ([D011](decisions.md#wo-167-d011)) makes its check mode
resolve every document selector that `CLAUDE.md` and all twelve installed
skills name in their `Read:` directives, with the harness library's strict
resolver (`readDirectives`, `sectionRange`), and exit 1 naming each
unresolved required section or file. Task selectors (`@work-order` and the
rest) are task input and are skipped; budget advisories still never refuse, and
the measurement printed on standard output is unchanged.

Result on the folded guide: exit 0, empty standard error. 18 anchored
selectors resolve; sixteen point into product 07: `Goal-aligned decisions`
from each of the six roles in both roots, and the planner's
`Operator-opened planning pass` and `Operator-opened ideation mode` in both
roots. Two point to product 08's `PRs and commits` (reviewer, both roots). The
17 whole-file selectors (the floor's `@skills/` reads, `package.json`,
`scripts/operator-control.mjs`, `docs/planning/sequence.md`) name existing
files.

Negative controls, each with product 07 copied aside, one heading renamed and
the copy restored byte-identical afterwards (`cmp`):

- At implementation, `## Goal-aligned decisions` renamed
  `## Goal alignment decisions`: the command exited 0 with empty standard
  error, while `measureHarnessContext()` threw `Unresolved required section:
  Goal-aligned decisions`; `## Operator-opened planning pass` renamed failed
  the two planner selectors under D006's ad-hoc resolver (16 of 18).
- After the repair, the same `Goal-aligned decisions` rename: exit 1, twelve
  lines, one per skill in both roots, each ending `Unresolved required
  section: Goal-aligned decisions`; standard output byte-identical to the
  positive run.

The regression is `WO-167 VER-001 F1 harness-context --check refuses a
renamed heading an installed skill reads; budgets stay advisory` in
`scripts/test-process-debt.mjs`: a renamed cited heading and a removed skill
the floor reads each exit 1 with the named failure, and the measurement alone
exits 0 with empty standard error. It fails on the unrepaired script (exit 0
where 1 is expected) and passes on the repair.

The Markdown-link and index proofs: `node scripts/docs-check.mjs` reports 0
failures (15 product documents, 412 declared historical link occurrences, the
same count as at the base), and `node scripts/check-publication.mjs` reports
267/267 product headings indexed, both editions current.

## Register (criterion 3)

| Observation | Revision | Entries | Pending |
| --- | --- | ---: | ---: |
| Base | `efd20f2b…` | 707 | 149 |
| After the cut and sync | `550933af…` | 716 | 163 |
| After the nine duplicate dispositions | `21bb9144…` | 716 | 154 |
| After `npm run meta` adds D006's follow-up row | `d9f72ac9…` | 717 | 155 |
| After D008 records its reopening of WO-090-D006 | `a6ca44a6…` | 717 | 155 |
| At handoff, after D009 and D006's last evidence line | `9bd33528…` | 717 | 155 |

The nine requests went through one `npm run plan -- followups --apply` batch
of nine ([register-duplicates.json](register-duplicates.json)), each at its
row's missing revision:

| Product 07 row (last disposition) | Map row |
| --- | --- |
| FUP-56b2d81b540555bb guided operator work orders (allocated, WO-137) | FUP-615bb914973f0600 |
| FUP-0111 planner startup context (open) | FUP-6d91d100269519d7 |
| FUP-3e3dcc8781144d46 recurring review of implementation alternatives (deferred) | FUP-19cd701c25446383 |
| FUP-b8a329d9970b8206 cold-gate structural cuts (deferred) | FUP-e96221b106cd136a |
| FUP-baa0ea5df1f8e6a9 refutation pass worth its cost (allocated, WO-132) | FUP-5eaeb603b228f581 |
| FUP-3f2a874835f66bb5 follow-up register settlement (deferred) | FUP-3f3a79213fec2409 |
| FUP-6c401ec3e9e06edb local lane retention (settled) | FUP-b932c089f1edf4ce |
| FUP-195ab93be762ad42 stale writer reservation self-diagnosis (settled) | FUP-0349c7a91fe63917 |
| FUP-57257901a26aec18 total subagent cap across every spawn path (deferred) | FUP-67a3ccb3b295200e |

Pending rose by six: the nine map rows are untriaged (each duplicate's reason
names the predecessor's disposition for the pass that triages it), five
predecessors were open or deferred, product 05's Tinkerer / Scientist row
(FUP-fc4158d3207e495d) needs review because its inbound-link retarget changed
its text and is left for the final review, and D006 adds its follow-up row
([D005](decisions.md#wo-167-d005)). D008's reopening observation moves
FUP-50a41e39f51a3e01 (WO-090-D006's follow-up) from deferred to needing
review, which leaves the pending count unchanged.

## The planning refutation (D008, D009)

Folding §Goal-aligned decisions changed the goal standard the planning gate
binds to receipt 033, so on the operator's authorization this order made local
commits before final review and ran one pass-scoped direct refutation
([D008](decisions.md#wo-167-d008)):

- `76979cc2` product 07, the order's `v0.52.11` title and the decision record;
  `2f508b69` the refreshed planning cost table; `b1745981` the rest of the
  product-document change, so the committed tree agrees with the guide
  ([D009](decisions.md#wo-167-d009)); `8541e0d4` the receipt pair, committed
  by the receipt helper.
- One fresh background worker, no inherited conversation and no descendants
  (1 of the 20-agent cap), judged the frozen subject at `2f508b69`:
  2,342,502 ms, 427,453 tokens and 51 tool calls by the harness's subagent
  report.
- [Receipt 034](../../planning/refutations/2026-09-28-planning-9d6f7cc5cb3b7647-034.md):
  scope pass, dispatch-to-file 2,401,703 ms, aligned-with-findings, no holds;
  27 orders aligned and 14 aligned with findings (16 known issues, two on
  WO-167, see Observations). The planning gate then reports judged, committed
  and workspace subjects equal (`eeda3b95…`).

## Write-backs (criterion 5)

- Ledger duty: this order's decisions file and its ten rows in the
  [decisions index](../../lineage/decisions-index.md), as the generated
  work-order index directs; no ledger append.
- `docs/README.md`: no change; it points at no moved candidate.
- The publication index: the nine candidate rows removed; the two source
  locks refreshed (`everyday-ai-user-toc.md`, `software-engineer-toc.md`).
- Product 05: its one inbound link to a moved candidate now points at the map.
- Release: patch `v0.52.11`, the next above the local `v0.52.10` tag, in the
  order's heading, product 06 §Release boundary and the README release block;
  retimed to `v0.53.1` when the integration met WO-060's `v0.53.0`
  ([D013](decisions.md#wo-167-d013)), with product 06's collision retiming
  paragraph. `npm run release -- prepare --local` reports the target current.
  No component version changes.

## Checks (criterion 6)

`package.json` and the lockfile are unchanged, so no dependency is added.

- `npm test`, three runs ([D009](decisions.md#wo-167-d009)), code identity
  `8d9335071cb792b7aa62ac090e93d7a08bb840b539c1dd36b9be15f5abd5cb1a` each time:
  run 1 (16:39Z, uncommitted tree) 27 passed, 1 failed: the known WO-143 lock
  matrix timed out at its 240 s deadline (FUP-1d57cbcb226d8f8a, allocated to
  WO-173); run 2 (16:47Z) failed worktree-integration because the first local
  commit left the committed tree incoherent; run 3 (16:55Z, after `b1745981`)
  28 passed, 0 failed, 375.56 s, 72 fresh tasks, tested tree `572f1d2b…`.
- `npm run test:docs` after the receipt: 23 passed, 0 failed, 12.74 s.
- `node scripts/harness-context.mjs --check`: exit 0, no advisory (before
  the repair, and after it with the strict resolution; see criterion 2).
- Repair gate, 2026-09-28T18:11:34Z on the integrated tree:
  `npm test -- --review` (the default suites plus the machinery suites the
  change selects): 35 passed, 0 failed, 631.03 s, 79 fresh tasks; then
  `npm run test:docs`: 23 passed, 0 failed, 13.29 s.
- `git diff --check`: clean on the working tree and from the base `ddb58d26`.

## Repair of VER-001 F1 and the integration with main (D011 to D013)

`resume: fix` repaired F1 by the verifier's first route
([D011](decisions.md#wo-167-d011)): `--check` resolves the installed reads
strictly (criterion 2 above), with the regression in
`scripts/test-process-debt.mjs`. Product 07's sentence on `--check` now reads
"`--check` refuses any unresolved `Read:`, never a budget advisory; no flag
prints the measurement alone.", the same 104 bytes as the sentence it
replaces, so the counts and the ceiling above are unchanged; a longer first
wording was refused by the docs check as a ceiling raise over HEAD.

On the operator's direction during the repair ("just deal with merging in
main now ffs"), `npm run worktree -- integrate WO-167` merged main
(`8541e0d4` to `0f3498a6`, merge commit `49de2a30`, checkpoint
`refs/dotln/checkpoint/WO-167/6`, named stash `a177676d` retained;
[D012](decisions.md#wo-167-d012) is the reviewer's draft record). It met two
defects, both repaired with a regression that fails on HEAD's source
([D013](decisions.md#wo-167-d013)):

- `--continue` refused because the uncommitted control log was in the
  integration's own stash; the phase and order path now fall back to the
  receipt (`scripts/lib/worktree-integration.mjs`; test in
  `scripts/test-worktree-integration.mjs`).
- The planning gate refused the retimed title (`existing work-order bytes
  changed`); one replacement of a judged release label is now admitted and
  reported as `release-retiming` (`scripts/lib/plan-continuation.mjs`; test in
  `scripts/test-plan-refutation.mjs`). The check then exits 0, reporting
  WO-167 `v0.52.11` to `v0.53.1`.

Repair checks, 2026-09-28: `node --test scripts/test-process-debt.mjs` 116
passed; `node --test scripts/test-plan-refutation.mjs` 74 passed;
`node --test scripts/test-worktree-integration.mjs` 13 passed;
`node scripts/docs-check.mjs` 0 failures; `npm run publication:check` both
locks current (both refreshed); `node scripts/refute-plan.mjs check`,
`node scripts/harness.mjs check` (31 surfaces) and
`npm run release -- check-surfaces --local` exit 0; the product gate above.

## Observations

- `npm run meta` reports one budget breach, `current/sequenceBytes` at 13,965
  bytes against 8,192. `docs/planning/sequence.md` is not part of this change,
  and the base already held it.
- The strict resolver `measureHarnessContext()` covers four roles; the planner
  and refuter skills cite product 07 too, which the command above covers.
- Receipt 034's first WO-167 known issue: the Cost line's reading saving has
  no measure in the meter, whose cold-start figure counts `CLAUDE.md` and the
  skill only (unchanged, 26,286 bytes for the executor). Measured here with
  `sectionRange` at the base and after: §Goal-aligned decisions, the one
  product 07 section five roles read, falls from 5,952 to 5,854 bytes; the
  planner's three sections fall from 33,940 to 32,660; a whole-guide read falls
  from 188,390 to 154,129. The candidates sat in no role's directed sections,
  so the large saving is for whole-guide reads.
- Receipt 034's second WO-167 known issue: the new ceiling leaves 3,083 bytes
  of headroom, and the queued orders that write product 07 declare 4,000 bytes
  between them. The order fixes the ceiling at landing plus two per cent; a
  raise needs a planning-document decision, which the receipt names as its
  reopening observation.
