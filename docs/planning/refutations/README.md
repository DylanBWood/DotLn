# Plan refutation receipts

Each planning pass produces one blinded refutation receipt here before its
pull request opens. The refuter is a fresh episode that receives the vision's
thesis sections, the five UIFA roles, the capability rows, and the marked
sequence's work orders (title, objective, acceptance criteria, non-goals) and
never the planner's plan, ledger section, or narrative. It returns, for every
order, whether it is thesis-advancing, machinery, or drift, with the thesis,
the capability row, and the roles served; for the horizon, the single largest
remaining gap to the one-paragraph story and a `pass` or `hold` verdict with
reasons. A receipt is immutable once its disposition block is written; a
re-run creates the next receipt.

Until WO-041 ships `npm run plan -- refute`, the `plan-refuter` loadout, the
`plan-refutation-v1` schema, and the evidence-gate check, a receipt is a manual
blinded dispatch and says so in its header. The first receipt is
[`2026-09-06-phase-two-redirect.md`](2026-09-06-phase-two-redirect.md).

Receipts are named `<date>-<slug>.md` with a sibling `.json` holding the
validated result. The execution guide's §Operator-opened planning pass names
the receipt as a standard artifact and the rule that a pass never certifies
its own direction.
