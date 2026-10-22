# WS-002 — predecessor-track: the work that needs the predecessor, launchpad v1, which exists only on the operator's work machine

**Outcome:** an instance deployed where the predecessor runs can list
privately, on the operator's guidance, what the earlier generations did,
where it lives, what in the instance now carries it and how faithfully, read
one summary of what is still missing, and turn a missing row into a generic
request; nothing about the predecessor is read, imported or described in this
repository, and no order of this track runs until the operator can run it
there.
**Acceptance contract:** each member passes core's ordinary lifecycle
(verification, final review, release close) with fixtures that are synthetic
or quoted from public generic text; the operator judges the track delivered
when a work instance holds a filled map and its first request has reached
core through WO-193's route. The clean-room floor applies with force: a need
for a predecessor fact is the stop condition.
**Delivery state:** proposed

This is the separate stream the operator directed on 2026-10-21 (planning
dispatch, ignored capture SHA-256
`4db8e10536b76209745538e6f54f2563dc7d1b34645a2cba438fd14a7812bab6`, note 8
and the clarifying message of the same session): work that mines or works
with the predecessor, which is only on the work machine, stays out of the
serial queue the operator reads between orders, the way the
[Codex downtime runbook](../work-orders/codex-downtime-series.md) kept the
adjacent evidence track apart in 2026-09. Orders that test with the
operator's personal instance or with DotLn-Angular are not members: the
operator keeps those in the queue. Members may depend on or be blocked by
core orders; they never block one. Until WO-080 lands, the generated index
still lists a member in the proposed order (an open order must have a place
in the marked sequence), so the sequence carries this track as its last
group, labelled, and WO-080's index grouping takes it out of the serial list
(its amendment of 2026-10-21).

## Member orders

| Order  | Repository | Base                                    | Role in the outcome |
| ------ | ---------- | --------------------------------------- | ------------------- |
| WO-228 | self       | this launchpad's `main` at activation   | the private predecessor map: `npm run parity -- init\|add\|check\|report\|request`, the row schema, the public seed and the request form, cut out of WO-193 by the [2026-10-21 pass](../planning/fork-notes-and-operator-questions-2026-10-21.md) |

## Dependency and compatibility plan

WO-228 reads WO-193's `draftRequest` for its `parity request` form and its
`requests.route` floor, so it carries a planning-deferral edge until WO-193
closes; until then its `request` form is written against WO-193's step 3 as
filed. WO-207's build pin decides how a `unit` or `support` carrier is looked
up in the emitted manifest's `origin`; WO-228 reads that as landed when it
activates and, if WO-207 has not closed, under `build: none` refuses the
carrier naming the build, as WO-193's re-observation of 2026-10-13 decided.
Activation is the operator's word from the work machine: the mechanism is
built and verified in core with synthetic rows, and the first real map is
filled in the work instance, outside this repository's evidence.

## The destination and the census (operator direction, 2026-10-21)

The operator's messages of 2026-10-21 (the sibling capture named in the
planning document §1), synthesized: the predecessor works and is messy; the
concern is replacing it effectively and efficiently, without generating
massive amounts of planning text. What it does today, in the operator's
account: given a few defects it builds a workflow that runs everything off
the main thread and returns a finished pull request; on the way it scrapes
and understands the user stories, researches the existing codebase,
understands the application and its APIs, decides what to fix, follows the
operator's commit and pull-request conventions, generates browser scripts
and drives them for DOM inspection, screenshots and image analysis, and
creates tests. Its knowledge lives in configuration and in a large body of
rules, some in rule files and many spread across arbitrary files of the
repositories it works in; the locations to mine are a couple of
repositories holding a lot of data.

**The instrument is the map, not prose.** Each capability above is one row
of WO-228's map: a generic statement, a status and a carrier. The planning
text the operator does not want to write is replaced by three mechanisms,
proposed here as later members of this track and filed as orders when the
track activates (reopen: the operator opens the work instance's first
planning pass, or asks for the orders sooner):

- **C1, the census.** `parity mine <location>` reads a repository or a
  directory in bounded, resumable passes (a checkpointed census keyed by
  path digest, the way the Entropy Reducer walks `git ls-files` and the
  issue reader stores screened bundles), finds rule-like and
  configuration-like statements wherever they live (rule files, settings,
  comments, documents), clusters them, and proposes typed rows in generic
  terms for the operator to accept one by one; it never copies a source's
  bytes into a row, keeps the location only in the ignored registry, and
  runs only inside the instance that owns the location. The amount of data
  is met by the checkpoint and by proposing rows per cluster, not per file.
  Core ships the mechanism with synthetic fixtures; the clean-room floor
  keeps every real row in the instance.
- **C2, the plan.** `parity report` already says which rows are unmapped,
  blocked or unverified; `parity plan` turns each unmapped cluster into
  either a request draft (a gap in core, WO-193's route) or an instance
  order draft from the kit's first-order template (a feature the instance
  builds through WO-207's extension point), so "how to incorporate" is a
  list of drafts the operator reads, not a document the operator writes.
- **C3, the carriers.** For each capability the operator named, the core
  piece that carries it or is queued to, read as an inference from the
  orders and products as they stand on 2026-10-21 and to be judged row by
  row in the instance: off-main-thread lifecycle runs (WO-192's router and
  WO-183's intent route into the resident); user-story intake (WO-062's
  screened issue reader, with a tracker other than the forge's issues
  through WO-207's extension point); codebase research and the change
  itself (the source-to-deliverable vertical and WO-204's source writer);
  commit and pull-request conventions (the publication compiler's reader
  profiles and the outward lint, product 08); browser scripts, DOM
  inspection, screenshots and image analysis
  (`packages/browser-evidence`); tests as evidence (the verification
  worktree and the planted-defect proofs product 12 names); rule migration
  (WO-096's typed rows and WO-207's instance overlay). A row whose carrier
  is `unmapped` after that reading is the request or the instance order
  C2 drafts.

- **C4, the lifecycle off the main thread at work.** The operator's
  message of 23:56Z: launchpad v2 is usable at work only through the setup
  that puts everything into subagents and dynamic workflows, with token
  budgets and efficiency tracked later. The carrier is WO-192's router (one
  session routes, a fresh worker per phase) and the resident; a transport
  that runs the phase workers as the host's dynamic workflow is a later
  member of this track once that host surface is qualified the way the
  spawned-agent pin is (product 07 §Model-specific notes), and the token
  budgets are `docs/control/budgets.json`'s dispatch counters, null today
  by the operator's unset policy, with the harness's subagent accounting as
  the observation that exists.

Effective and efficient, in this track's terms: the predecessor is not read
by core and not rewritten in prose; it is counted into rows inside the
instance, each row is checked against a carrier the build actually emits,
and the planning pass disposes rows instead of writing text.

## Delivery states

| Member | State    | Evidence |
| ------ | -------- | -------- |
| WO-228 | proposed | none yet |

<!-- dotln-workstream:start -->
{ "id": "WS-002", "members": [{ "workOrderId": "WO-228", "repositoryId": "self" }], "edges": [{ "from": "WO-228", "to": "WO-193", "relation": "planning-deferral" }] }
<!-- dotln-workstream:end -->
