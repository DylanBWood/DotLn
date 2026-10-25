# Workstreams

One document per outcome, `docs/workstreams/WS-NNN-<slug>.md`. A member order
declares `**Workstream:** WS-NNN` in its leading metadata. The document
carries the outcome, the acceptance contract, the member orders (each naming
its repository and base), the dependency and compatibility plan and the
delivery states; the JSON block between the markers mirrors the membership.
The generated work-order index groups members and records repository, base,
phase, verdict, integration, staleness and the observed target commit in its
`dotln-workstreams` JSON line. The board reads that same record. Refresh it
with `npm run work-orders -- index`; `index --check` reuses the recorded Git
facts and remains checkable without target checkouts. A later target change
becomes visible at the next explicit refresh.

Integration is `current` when the declared base equals the target's configured
base-branch tip, `behind` when the base is its ancestor, `diverged` otherwise,
and `unknown` when Git cannot establish it. Stale is `no` for current, `yes`
for behind or diverged, and `unknown` for unknown. A green sibling does not
change another member's observation. An order without `**Repository:**` is
`self`: both its base and integration target are the launchpad's
`refs/heads/main` observed at refresh. It reads `current`, stale `no`, from
any branch; an unreadable main remains `unknown`. Paths to local clones never enter the record.

Files match `WS-NNN-\*.md` under the configured `workstreams` root. Each has
exactly one block, with an id matching its filename. Membership comes from
orders' leading `**Workstream:**` fields; the block must mirror their order
ids and repository ids, including `self`. A closed member without the field
is admitted from the document with one advisory naming the order and field;
its order stays unchanged. An open member without the field still refuses,
as does a conflicting declaration, an absent document or a declaring order
absent from its members. Dependency edges name a member as `from` and an
existing order as `to`, so an external prerequisite can be recorded too.

A block may add `"track": "separate"` for an operator-designated stream
outside the serial queue. Its members appear in the Workstreams grouping,
never the Proposed order list, and need no marked sequence entry. Their
complete order cards remain available after sequenced Open cards, preserving
the two-page index's one-card-per-order contract.

## Template

~~~markdown
# WS-NNN — <slug>: <the outcome in one line>

**Outcome:** what is true when this workstream is delivered.
**Acceptance contract:** how the outcome is judged, and by whom.
**Delivery state:** proposed | active | delivered | abandoned

## Member orders

| Order  | Repository | Base       | Role in the outcome |
| ------ | ---------- | ---------- | ------------------- |
| WO-NNN | <id/self>  | <commit>   | <one line>          |

## Dependency and compatibility plan

Which members depend on which, what interface each pair agrees on, and what a
member does when the other side has not landed.

## Delivery states

| Member | State | Evidence |
| ------ | ----- | -------- |

<!-- dotln-workstream:start -->
{ "id": "WS-NNN", "members": [{ "workOrderId": "WO-NNN", "repositoryId": "<id>" }], "edges": [{ "from": "WO-NNN", "to": "WO-NNN", "relation": "hard" }] }
<!-- dotln-workstream:end -->
~~~
