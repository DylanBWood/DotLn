# Retained planning follow-ups

`npm run plan -- followups` returns pending items; follow its `next` command
for more, `--all` includes resolved items, and `--show <FUP-id>` expands one
record with its source revisions and disposition history. Do not preload all
source documents. A planner chooses relevant items from this bounded feed and
records the choices it makes; leaving an item untouched preserves it for later.
Changed items, explicit open items and deferrals precede the untriaged migration.

`docs/planning/followups.json` retains stable identities. `npm run meta` (or
`npm run plan -- followups --sync`) discovers formal candidate, follow-up and
deferred headings and their top-level list items in current product/planning
documents, plus every per-order JSON decision. Existing records start
untriaged, including historical allocations, declined choices and overlapping
sources; collection does not infer coverage. Archive snapshots, refutation
receipts and unstructured legacy prose are outside this migration's claim.
New nominations must use a formal candidate heading in the relevant product
document or an ordinary sourced decision record, then sync in the same pass.
Private intake and local queue text are never harvested by this collector.

Use `npm run plan -- followups --apply <request.json>` with a contained JSON
file carrying `expectedRevision` from the page, `id`, `sourceRevision`, `status`,
`reason`, `reopenWhen` and `targets`. Status is `open`, `deferred`, `allocated`,
`declined`, `duplicate` or `settled`. `open` uses null for `reopenWhen`; every
other disposition names a reopening condition, even when it is new operator
direction. Allocation names existing `WO-NNN` targets and explains coverage;
duplicate names one FUP target; all other target arrays are empty. `settled`
records an in-force decision with no outstanding action. Reasons and source
revisions are retained. Existing NoOp evidence remains the authority for a
decline; this register links its durable disposition rather than replacing it.

Changed or missing source invalidates an old disposition and returns the item
to review. A renamed source can be reconciled as a duplicate of its new entry;
the old identity and history survive. A missing candidate keeps its last public
summary and source pointer. Committed entry/revision/disposition history cannot
be removed or rewritten by the checker. New records still need a normal
checkpoint; the register is not a backup for uncommitted edits. The metadata
gate checks freshness, and executor completion requires each local deferred
queue item to target a current public FUP record. Synthesize the public record
through the clean-room boundary first; this check never copies local prose.
