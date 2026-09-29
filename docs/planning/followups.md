# Retained planning follow-ups

`npm run plan -- followups` returns pending items; follow its `next` command
for more, `--all` includes resolved items, and `--show <FUP-id>` expands one
record with its source revisions and disposition history. Do not preload all
source documents. A planner chooses relevant items from this bounded feed and
records the choices it makes; leaving an item untouched preserves it for later.
Changed items, explicit open items and deferrals precede the untriaged migration.
A pass reads `npm run plan -- failures` before this register: the failed
reports, repairs, corrections, off-ramps and execution amendments since the
latest planning receipt, whose counts `plan start` prints (WO-172).

`npm run plan -- followups --touching [<path or WO-NNN>…]` lists the pending
rows that name a seam. With arguments it reads the given paths and orders; with
none, the files this worktree changed against its merge base with `main`
(committed, deleted, both names of a renamed file, and untracked files) and the
active order, which `--work-order WO-NNN` names on a branch that names none. A
row is listed when its source title or summary, its decision's `followup` or
`reopenWhen`, or its latest disposition names the path, a trailing part of it
such as its base name, or the order. A given path may itself be a trailing part,
so a longer written path that ends in it names it; a changed file is whole, so
a longer written path is another file. The match is textual and the page says
so: a false match costs one row read, and a row that names its seam in other
words is not listed. Rows keep the feed's shape and page bound, add the first
four terms that `matched` with a `matchedCount` when there are more, and
continue through `next`. It has three uses, and each ends in a record:

1. Before filing an order, the planner runs it with the files the order names
   and allocates or declines each row in that pass.
2. At `implementation-ready` and `repair-complete` the completion check prints
   one advisory with the count, the command and the rule: fix a row inside the
   Boy Scout bound or record it as left in the order's decisions, never widen
   the order; the final review disposes a listed row whose seam the change
   opened or whose condition occurred, and leaves a row it only matched as it
   is. The advisory never refuses a completion, and a stale register is
   reported as unavailable instead of being repaired by the completion.
3. A pass that retires closed orders runs it with their identifiers.

`npm run plan -- followups --export <file>` writes every pending row whole
(`--all` for every row): identity, status, kind, source, title, the decision's
`decision`, `followup` and `reopenWhen` or the candidate's summary, and the
disposition history. Standard output carries the counts, the revision and the
path only, and the feed's pages are unchanged. The destination is judged where
it physically lands: inside the checkout only the ignored local control lane,
outside it only the system temporary directory, which holds DotLn session
scratch, and there no other checkout or Git directory. The command has no
session identity, so a host scratchpad outside that directory is refused. The
file is written beside its destination and renamed into place, and an existing
file is replaced only when an export wrote it.

`docs/planning/followups.json` retains stable identities. `npm run meta` (or
`npm run plan -- followups --sync`) discovers formal candidate, follow-up and
deferred headings and their top-level list items in current product/planning
documents. A per-order JSON decision enters the feed only when its optional
`followup` string names an action, or another decision carries
`reopens: { "decisionId": "WO-NNN-DNNN", "observation": "the recorded trigger occurred" }`.
The observing record cites evidence through its ordinary `evidence` field; it
does not create a second nomination unless it also names a `followup`. A
`reopenWhen` condition alone remains a decision record, outside the pending feed.
Every decision still appears in the decisions index. Existing register entries,
identities and history are retained; current page links resolve their full
headings without rewriting historical references. Archive snapshots, refutation
receipts and unstructured legacy prose are outside the collector's claim.
New nominations must use a formal candidate heading in the relevant product
document or a sourced decision with `followup`, then sync in the same pass.
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

The same command takes a batch: a JSON array of such requests, each carrying
the one `expectedRevision` the planner read. They apply in order under one
lock, each judged against the state the earlier ones produce, and the register
is written once. One invalid request writes nothing and names its index.

Changed or missing source invalidates an old disposition and returns the item
to review. A renamed source can be reconciled as a duplicate of its new entry;
the old identity and history survive. A missing candidate keeps its last public
summary and source pointer. Committed entry/revision/disposition history cannot
be removed or rewritten by the checker. New records still need a normal
checkpoint; the register is not a backup for uncommitted edits. The metadata
gate checks freshness, and executor completion requires each local deferred
queue item to target a current public FUP record. Synthesize the public record
through the clean-room boundary first; this check never copies local prose.
