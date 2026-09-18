# WO-139 — Subagent admission cap: a session's spawns are counted and refused at the admission points the hook can see, descendants are counted at their first attributable tool call, uncounted paths are reported, and the total-cap requirement stays open where the harness creates agents before any hook fires (v0.29.5)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. The harness host's spawn admission, the
budgets file, the Contributor's shared instruction and the regenerated
bundle. Assigned at activation under the standing opt-out default.
**Cost:** removes uncapped fan-out on the paths the hook admits
(operator-observed on 2026-09-17: a top-level guideline of five agents
reaching more than a hundred through per-item adversarial and refutation
trees, 5 + 15 + 45 before any repair loop) and the operator's manual
arithmetic. Adds one counter in the existing spawn admission path, one key in
`docs/control/budgets.json`, one role-text rule, one probe row and fixtures;
no recurring step. It adds one hard refusal to the hook boundary. It does not
deliver a guaranteed maximum across every path: an agent the harness creates
before any hook fires is counted late or not at all, and that requirement
stays open.

**Nomination provenance:** the operator's messages 3 and 9 in the
2026-09-17 planning dispatch (captured in ignored intake; hash in the
[pass](../planning/vision-into-use-2026-09-17.md) header) and that pass's
§11; the harness documentation consulted by the pass (no total cap exists;
`workflowSizeGuideline` is a guideline; sixteen concurrent agents; hooks fire
for the Agent and Workflow tools and inside subagents). Planner-synthesized
draft. Clean-room screen: no stop condition.

**Depends on:** WO-131 merged (spawn admission in the harness host;
closed); WO-133 merged (the built runtime follows `main`; closed).

**Recommended placement:** pair 2 beside WO-053. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-131",
    "relation": "satisfied-by-close",
    "reason": "spawn admission in the harness host"
  },
  {
    "workOrderId": "WO-133",
    "relation": "satisfied-by-close",
    "reason": "the built runtime follows main after a fast-forward"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/harness-command.ts`
(`harnessToolEffects`: Agent, Task, Workflow and `collaboration.spawn_agent`
classify as `spawn`); `packages/skeleton/src/harness-host.ts` (the
`tool === "spawn"` admission branch); `docs/control/budgets.json`;
`docs/evidence/WO-131/spawn-admission-tests.txt`;
`packages/skeleton/src/loadouts/contributor.ts`;
`docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-132;
07-execution-guide.md §Discipline; `docs/planning/vision-into-use-2026-09-17.md`
§11.

**Objective:** `subagentCap` in `docs/control/budgets.json` (default 20;
`null` disables). The harness host counts admitted spawns per root session
and refuses the spawn that would exceed the cap with a message naming the
count, the cap and the key. A Workflow tool call is admitted only while at
least one unit of budget remains, and the subagents it spawns count against
the same budget at their first tool call the hook can attribute to the root
session. The Stop hook advisory and `harness usage` report the session's
spawn count against the cap and the uncounted remainder. The order's
decision record states, per harness and spawn path (the Agent and Task
tools, the Workflow tool, an agent a workflow script spawns, Codex
`spawn_agent`), whether admission happens before creation, at the first
attributable tool call, or not at all. An unreadable or missing counter
admits the spawn with an advisory naming the cause, as other unreadable
state does today. The boundary text counts the hook's hard refusals at
landing rather than assuming a number. The Contributor's shared instruction carries
the batching rule: a fan-out is planned against the remaining budget before
the first spawn, review and refutation passes run as batches over item
groups with one agent judging several items — never one agent per item per
pass — and the plan is stated in the response. In Codex,
`collaboration.spawn_agent` is classified `spawn` but no hook fires; the
same rule is role text there and the order records the cap as advisory for
that harness.

**Observed gap (dated 2026-09-17, `main` at `ec502c9`):**

- The harness host admits every spawn as a read and counts nothing.
- The harness documents no setting for a total cap; the size guideline
  configured for this repository's sessions is `small`, and it bounds one
  level of the tree only.
- Operator observation: sessions under the multi-agent selector reach more
  than a hundred agents.

**Design (scope discipline):**

- A probe row first: one session with one Agent spawn and one workflow of two
  agents under the existing harness probe, recording (as field shapes) which
  hook-input fields identify the subagent and the root session. The counter
  keys on what that row observes; if subagent tool calls carry no
  attributable identity, the cap counts parent-admitted spawns only and the
  Stop advisory says the uncounted part is unknown. No coverage is claimed
  the hook cannot see.
- The counter lives in the session's local harness state under
  `docs/control/local/harness/` and resets per root session.
- The refusal is a hard refusal on the admitted paths beside the second
  writer and live-gate refusals (and WO-135's planning-branch refusal when it
  has landed); the boundary text is amended with its source and the count at
  landing rather than silently widened. The requirement the hook cannot
  meet — a guaranteed total across paths that create agents before any hook
  fires — is recorded as the product 07 candidate "total subagent cap across
  every spawn path" with its reopening observation.
- The batching rule is shared instruction text, so it raises every role's
  cold-start bytes; if a ceiling breaches, the order raises it by one 4 KB
  step in the same change with the rule named, or records the dated
  acceptance (07-execution-guide.md §Discipline, the cold-start rule), and
  never trims another rule to fit.
- **Declined alternatives, recorded:** an advisory only (the operator asked
  for a hard cap); a harness setting (none exists for the total); parsing
  workflow scripts for their fan-out (not enforceable); refusing the
  Workflow tool entirely.

**Deliverables:** the probe row; the counter and refusal; the budgets key;
the role-text rule; fixtures; the regenerated bundle and manifest; the
write-backs below.

**Acceptance criteria (all required)**

1. The probe row is recorded with the field shapes, and the order's design
   record names the identity the counter keys on.
2. With `subagentCap: 3` in a fixture budgets file, the third Agent spawn is
   admitted and the fourth is refused with the named message; a Workflow
   call with zero remaining budget is refused; `null` disables the cap; an
   unreadable or missing counter admits the spawn with an advisory naming
   the cause, and a fixture covers it.
3. Subagent tool calls that carry an attributable identity count toward the
   root's total at their first call and are refused beyond the cap;
   unattributable ones are reported as uncounted in the Stop advisory.
4. The Stop advisory and `harness usage` report the spawn count and the cap.
5. The Contributor instruction carries the batching rule; the compiled
   bundle and manifest regenerate and `harness check` passes; 07
   §Discipline and the security runbook's hook-boundary section record the
   refusal with its source and the count of hard refusals at landing.
6. The decisions record carries the per-harness, per-path admission table
   (before creation, at first attributable tool call, or not at all), and
   the product 07 candidate for the open total-cap requirement is confirmed
   or updated with the observed paths.
7. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the probe row; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** a concurrency limit (the harness's sixteen stands); counting
agents the hook cannot see; a guaranteed total across paths that create
agents before any hook fires (recorded as open, not solved); Codex
enforcement; changing the size guideline; any change to the existing
refusals.

**Operator-review assumptions**

1. The operator accepts one more hard refusal in the hook boundary, with 20
   as the default cap, and accepts that the total-cap requirement stays open
   on the paths this order names as uncounted.
2. The batching rule changes how reviews are organized (one agent judges
   several items); the operator may set the cap lower for a session by
   editing the budgets key.
