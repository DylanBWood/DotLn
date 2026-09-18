## Release overview

A session's subagent fan-out now has a budget the hooks enforce where they can see it. On 2026-09-17 the operator watched a top-level guideline of five agents reach more than a hundred through per-item review and refutation trees, and did the arithmetic by hand. `docs/control/budgets.json` gains `subagentCap` (default 20; `null` disables), the Claude hooks count each root session's observed spawns against it and refuse the one that would exceed it, and Stop and `harness usage` report the count, the cap and what stays unknown.

The audience is the operator supervising multi-agent sessions and every role that plans a fan-out. This is an observed admission cap, not a guaranteed maximum across every spawn path; that requirement stays open in product 07 with the observed paths named.

## Read before upgrading

Application patch `v0.29.5` stages compiler `0.13.2` and skeleton `0.25.4`. Kernel and console versions, event schemas, public contracts and dependency sets are unchanged; `package-lock.json` moves only the workspace version strings. No migration is required.

DotLn's hooks now refuse four conditions instead of three. The new one refuses an Agent or Task spawn that would push the root session's observed count past `subagentCap`, a Workflow call when no unit remains, and every tool call of an attributable child first seen beyond the cap. The refusal names the count, the cap and the key. Lower the cap for a session by editing the key; `null` keeps counting and never refuses. A missing, unreadable, locked or invalid counter or budgets file admits the call with an advisory naming the cause, so broken state never disables spawning.

What the cap does not cover: a workflow's agents exist before their first hook and are counted at their first attributable tool call; an agent that calls no tool is never seen; until an Agent result joins a direct admission to its child identity, possible overlap is reported as a minimum count, so two unresolved admissions and two later children can be four agents counted as two; Codex fires no spawn hook in the recorded profile and carries the cap as role text without enforcement.

Shared role text changes for every role: plan the whole fan-out against the remaining budget before the first spawn, state the plan in the response, and batch review and refutation over groups of items, one agent judging several items, never one agent per item per pass. The verifier cold-start ceiling rises one 4 KB step to 20,480 bytes with a dated acceptance naming the rule.

Two operator-authorized scope expansions ship in the same patch. `npm run plan -- amend-order WO-NNN WO-NNN-DNNN "operator authorization and bounded scope"` records an operator-authorized change to a judged order's text as a `PlanExecutionAmended` event bound to the planning receipt, the original and approved order bytes and the structured decision; it never discharges a refutation hold, and an unrecorded edit still fails with its order and criterion named. `implementation-ready` and `repair-complete` now refresh the final index and release the current Codex session's writer reservation themselves; no operator release step is part of handoff.

## Substantive changes

- Harness host, subagent admission: a per-root-session counter under `docs/control/local/harness/` keys on the root `session_id`, the child `agent_id` and the direct `tool_use_id` that the live probe observed. Direct spawns reserve a unit before creation, repeated hook deliveries never debit twice, a resumed known agent is not recounted, and concurrent admissions serialize through a lock directory.
- Harness host, identity joins: a direct admission joins its child only through the identity the Agent result returns. A child observed before an admission can never be matched to it; for later children the counter reports the minimum distinct count and labels it `minimum-observed`. No parent is ever guessed from arrival order or agent type.
- Reporting: the Stop advisory and `harness usage` for a named session carry count, cap, remaining, count kind, unresolved overlap and an uncounted remainder that is always `unknown`.
- Installed runtime: the cap module is pinned in the runtime declaration, so a change to it alone produces a new snapshot and installed bytes, and an altered or missing installed copy fails `harness check` with the module named while the generated hook stays advisory. Budget advisories carry their own provenance, so they throttle separately from classification advisories that happen to mention subagents.
- Planning continuation: the execution-amendment route above, and a pre-commit capability-history repair that is admitted only when every changed committed row survives byte for byte in a dated appendix. WO-053's already-authorized amendment and its overwritten WO-052 capability row are repaired through these routes without changing receipt 017.
- Lifecycle: executor and repair completion prepare the writer release before appending the result, keep ownership when pre-append validation fails, and release only the current session's reservation after the final projection, including when that projection fails.

## Progressive polish

The four-refusal sentence is compiled into `CLAUDE.md`, `AGENTS.md` and all twelve role skills; product 07 §Discipline, the total-cap candidate and the security runbook's hook-boundary section record the refusal, its source and its limits; the roadmap and README name `v0.29.5`. Authority evidence advances to revision 003 and feedback to edition 002, and the console self-host fixtures follow the audited feedback policy. The subagent probe is an opt-in live row that records field shapes and anonymous equality labels only.

## Evidence and compatibility

Source: branch `wo-139` over `main` at `494e6825ae4c249da97671379c26d4a38a84b153`, which carries the published `v0.29.4` tag; `origin/main` had not moved at final review, so no integration or retime was needed. The reviewed commit series is on the pull request. Component versions: application `v0.29.5`, compiler `0.13.2`, skeleton `0.25.4`, kernel and console unchanged.

Verification: [VER-001](../../verifications/WO-139/VER-001.md) passed all seven criteria and both scope expansions. [FINAL-001](FINAL-001.md) failed on a cap module missing from the runtime pin list and two process-debt regressions. After the repair, [VER-002](../../verifications/WO-139/VER-002.md) reproduced both fixes and passed `npm test -- --review` with 32 suites and 0 failures in 1,177.68 s at code identity `24742080`. [FINAL-002](FINAL-002.md) recomputed that identity at the reviewed tree, reran the focused regressions, probed the built cap module directly and observed the installed hooks count and join one live spawn.

Known limitations: the paths listed under Read before upgrading; the live probe recorded Claude Code 2.1.276 only, and the Task path rests on fixtures; an abandoned counter lock yields the admit-with-advisory fallback for the rest of that session; the runtime pin list is hand-maintained, and 19 modules reachable from pinned entry points are outside it on `main` as well as here; a recorded amendment binds its structured decision permanently, so a later edit to that decision block fails the planning check by design.

Deeper notes: [WO-139 evidence README](../../evidence/WO-139/README.md), [decisions and the per-path admission table](../../evidence/WO-139/decisions.md), [repair evidence](../../evidence/WO-139/repair-001.md), [the order](../../work-orders/WO-139-subagent-cap.md).
