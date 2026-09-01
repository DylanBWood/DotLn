# WO-009 — Real disposable worker, v0.5.0

**Model:** any capable model.
**Release classification:** `v0.5.0` minor — adds real worker transports and
their scheduler/runtime lifecycle without breaking the deterministic fakes.
**Depends on:** WO-008 complete (build order per ADR-0002 §1); WO-004's
observed transport evidence (the adapter choice must not rest on
documented-only rows).

**Cites (read these sections):** 06-roadmap.md v0.5.0; 03-architecture.md
§Session lifecycle & resilience (canonical matrix rows 2, 4, 6; the outbox
protocol; leases and heartbeats), §Platform and instance boundary ("The
host"), §Ports `WorkOrderTransport`;
02-domain-model.md (WorkOrderTransport, Episode, Result envelope,
CommandReceipt); docs/discovery/environment.md §Recommendations plus the
WO-004 addendum; ADR-0002 §5; 01-principles.md Principles 3, 4, 8.

**Objective:** The two WorkOrderTransport adapters the discovery evidence
names — expected `ClaudeCliPrintWorkOrderTransport` and
`CodexCliExecWorkOrderTransport` — with host-specific canonical launch shapes:
fresh bounded invocation, the narrowest observed settings boundary (Claude
project+local; Codex ignored user configuration), ambient/auto memory disabled
where the host exposes that mechanism, isolated worktree, explicit model,
effort where exposed and recorded `unknown` otherwise, no session persistence,
and schema-bound output. Also deliver a deterministic worktree lifecycle,
`dotln status`, and failure-injection rows 2, 4, 6.

**Scope discipline (one step at a time):**
- One real episode replaces the fake executor in the v0.2.0 demo; every
  other demo actor stays fake. The fake adapter remains first-class for the
  deterministic suite.
- Rows 2, 4, 6 only — rows 1, 3, 5 already pass and must not regress.
- `dotln status` is a pure projection of the store (running episodes,
  leases/heartbeats, pending commands, recent events); it introduces no new
  state — real workers never run blind.
- Verifier episodes are v0.6.0's; none here.

**Constraints:** adapters and the host live outside kernel and compiler
(node:fs / child_process permitted there only); kernel and compiler stay
pure. Integration tests that need a live model are gated on an authenticated,
non-sandboxed runner per discovery, and separated from the always-run
deterministic suite. Secrets never enter prompts, logs, or the repo. New
runtime dependencies only with an ADR-0002 §Amendments note.

**Acceptance criteria (all required)**
1. One real episode replaces the fake executor in the 13-step demo and
   returns the compact result envelope; the dispatching session's transcript
   grows by only the envelope (the context firewall, 03 §agentic core).
2. Rows 2, 4, 6 pass with the canonical expected outcomes; a killed worker
   leaves a recoverable pending command, and a fresh episode resumes or a
   recovery episode inspects (row 6).
3. Worktree lifecycle is deterministic — create, verify cwd, clean up — each
   step tested; a vanished worker never destroys the workstream (lease
   expiry).
4. `dotln status` renders the live in-flight projection against the store
   during a real episode.
5. An unavailable model queues or fails closed; a test proves no silent
   substitution in either direction (Principle 8, ADR-0002 §5).
6. Launch-shape assertions: setting sources restricted to the narrowest
   locally observed equivalent; ambient auto-memory disabled where the host
   exposes that mechanism; no session persistence; explicit model and effort
   recorded in the episode's events. WO-004 observed a Codex model selector
   but no Codex effort selector, so this work order must run a bounded
   capability probe and record `unknown` if the installed host still exposes
   none—never invent a flag or silently infer effort.

**Write-back duty:** the adapter contracts and canonical launch shapes go
into 03-architecture.md §Ports and the WorkOrderTransport row of
02-domain-model.md; ledger duty applies.

**Evidence gate:** the live demo run captured (envelope included); rows
2/4/6 test output captured; the killed-worker recovery witnessed and
recorded; every criterion mapped to a named test or witnessed run.

**Non-goals:** verification episodes (v0.6.0); feedback units (v0.7.0); web
console; SQLite migration unless the outbox demands transactionality (then an
ADR-0002 §4 amendment first); background/workflow/MCP transports; model
benchmarking.
