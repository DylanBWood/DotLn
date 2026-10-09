# Workstreams

One document per outcome, `docs/workstreams/WS-NNN-<slug>.md`. A member order
declares `**Workstream:** WS-NNN` in its leading metadata. The document
carries the outcome, the acceptance contract, the member orders (each naming
its repository and base), the dependency and compatibility plan and the
delivery states; the JSON block between the markers mirrors the membership.
This kit revision's index does not yet read the field: once core's WO-080
lands, the generated work-order index groups members, shows repository, base,
phase, verdict and integration state (`current`, `behind`, `diverged`,
`unknown`; stale means not `current`) and refuses a block that differs from
the orders' fields. A later kit revision carries that convention's final text
and this file is replaced with it.

## Template

~~~markdown
# WS-NNN — <slug>: <the outcome in one line>

**Outcome:** what is true when this workstream is delivered.
**Acceptance contract:** how the outcome is judged, and by whom.
**Delivery state:** proposed | active | delivered | abandoned

## Member orders

| Order  | Repository | Base       | Role in the outcome |
| ------ | ---------- | ---------- | ------------------- |
| WO-NNN | <id>       | <commit>   | <one line>          |

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
