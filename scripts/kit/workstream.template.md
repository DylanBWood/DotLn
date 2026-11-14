# Workstreams

One document per outcome, `docs/workstreams/WS-NNN-<slug>.md`. A member order
declares `**Workstream:** WS-NNN` in its leading metadata. The document
carries the outcome, the acceptance contract, the rules every member follows,
the member orders (each naming its repository and base), the dependency and
compatibility plan and the delivery states; the JSON block between the markers
mirrors the membership. It is a standing document: its rules section holds the
rules as they stand, each linking the decision that set it, and the member
orders and their decisions hold the history of how each rule arrived. For an
initiative it also holds a layout (§Layout): the plan as it stands, whose
planned items are not member orders.
The generated work-order index groups members and shows repository, base,
phase, verdict, integration, staleness and the observed target commit. What
it observed in each target is kept in `docs/control/workstream-observations.json`;
the board reads the index command's own output. Refresh it
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

## Layout

For an initiative, the layout is the plan as it stands: what exists, what
is asked, and the way from one to the other. A planning pass writes or
revises it before it files anything, and files only the orders the next
wave needs. It is prose and plain tables, revised in place as waves land.
No check judges what it says: the index and the plan check read the marked
block alone, and the document check reads the layout's links and form as it
does any document's. Its four parts:

- **What exists.** What the instance understands is there today, linking
  the target's area notes where there are any.
- **What the initiative asks.** The outcome in the instance's own words.
- **The way there.** Phases, each with the work it needs as planned items,
  what each item depends on and which may run side by side. A phase may
  carry the planner's estimate of orders and spend, with where the figure
  came from.
- **What is unknown.** Each open question, with the research that would
  settle it.

A planned item is a line of the layout and nothing else: it has no
identifier and no order file, and it is not a member order. It becomes one
when a pass files it, and only then does it enter the member table and the
marked block.

A worked example, for an invented outcome (a shop's checkout that takes a
second currency):

~~~markdown
## Layout

### What exists

Prices are stored as integer cents with no currency
([the pricing note](../repositories/shop/pricing.md)); the checkout page and
the invoice renderer each format them on their own.

### What the initiative asks

A customer can pay in euros or dollars, and every figure they see, from the
basket to the invoice, is in the currency they chose.

### The way there

| Phase | Planned item                                   | Depends on             | Side by side with |
| ----- | ---------------------------------------------- | ---------------------- | ----------------- |
| 1     | Store a currency beside every stored amount    | nothing                | the rate source   |
| 1     | Choose and wire one source of exchange rates   | the unknown below      | the stored column |
| 2     | Format amounts in one place, by their currency | the stored currency    | nothing           |
| 2     | Let the customer choose a currency at checkout | the stored currency    | the formatter     |
| 3     | Invoices and refunds in the paid currency      | both items of phase 2  | nothing           |

Phase 1 is the next wave: its two items' inputs are known once the rate
source is chosen. Estimate, from this instance's last six orders of similar
size in its usage report: three orders for phase 1, five for the rest.

### What is unknown

- Which rate source finance accepts, and how stale a rate may be: a
  research order that reads the finance policy and reports the two
  candidates' terms.
~~~

## Template

~~~markdown
# WS-NNN — <slug>: <the outcome in one line>

**Outcome:** what is true when this workstream is delivered.
**Acceptance contract:** how the outcome is judged, and by whom.
**Delivery state:** proposed | active | delivered | abandoned

## Rules

Each rule every member follows, as the rule, with a link to the decision that
set it. The history of how a rule arrived stays in that decision.

## Layout

### What exists

### What the initiative asks

### The way there

| Phase | Planned item | Depends on | Side by side with |
| ----- | ------------ | ---------- | ----------------- |

### What is unknown

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
