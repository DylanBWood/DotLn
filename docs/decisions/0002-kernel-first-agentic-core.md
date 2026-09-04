# ADR-0002 — Kernel-first TypeScript core; agentic communication at the center

**Status:** Accepted (2026-08-30)

## Context

The corpus contains two centers of gravity: the ticket-to-verified-PR pipeline
(work-shaped) and the agentic-communication kernel (events, reactors,
continuations, compiled feedback, isomorphic views). The operator directed the
personal build to "drift towards more agentic communication... not really on
the specifics like go from [tracker] all the way through pr, but it should be able
to handle that."

## Decision

1. **The kernel is the product's spine.** Build order: pure kernel → walking
   skeleton → composition compiler → real workers → verification → feedback
   compiler → projections → pattern workshop (see roadmap).
2. **Work-shaped verticals are ports**: `SourceAdapter`, `WorkOrderTransport`,
   `VerificationAdapter`, `DeliveryAdapter`. The source-to-deliverable rung
   proves the ticket→PR promise with a personal-flavor adapter (GitHub Issues);
   an enterprise-tracker adapter remains a future optional plug-in.
3. **Language/runtime:** TypeScript everywhere; the kernel and compiler have
   zero runtime dependencies and no I/O (pure functions + data; dev-only
   build/test tooling is recorded in Amendments below). Node is
   the adapter runtime. UI framework is deliberately undecided until the
   projections-and-console rung
   (default recommendation: Angular, operator fluency; the kernel must not
   care).
4. **Persistence progression:** append-only JSONL first; SQLite when
   transactionality and the outbox demand it; Markdown only ever as a
   generated projection. Browser storage may serve prototypes but is
   best-effort and never authoritative.
5. **Executors:** Claude Code and Codex CLI are peer `WorkOrderTransport`
   adapters (plus `fake` and `human`). Required model per work order is a hard
   constraint; no silent substitution in either direction.

## Consequences

Nothing about the work pipeline blocks the kernel; nothing about the kernel
assumes a ticket system exists. The RPG/links surface compiles against the
same LoadoutGraph IR regardless of which verticals are plugged in.

## Amendments

Appendable without relitigating the decision (see execution guide): dependency
notes and tooling choices within the decided constraints.

- WO-002 uses TypeScript 5.4.5 and `@types/node` 22.20.1 as exact dev
  dependencies, matching the compiler and Node 22 line observed by WO-001.
  The Node types bring the runtime acceptance suite under strict compilation;
  tests use Node's built-in runner and the kernel has zero runtime dependencies.
- 2026-08-31 roadmap retiming: the accepted build order is unchanged. The UI
  decision point described above moves from the original planning label
  `v0.7.0` to application release target `v0.8.0`, and the personal
  source-to-deliverable vertical moves from `v0.9.0` to `v0.10.0`. Published
  history and the substance of this decision do not change.
- 2026-09-04 roadmap retiming: the operator activated WO-023 at `v0.5.0`, so
  the unpublished application targets formerly assigned to WO-009 and later
  rungs are unassigned until their own activations. WO-023 inserts compiled
  instance content without changing the accepted build order among the runtime
  rungs; WO-029 is a separately filed candidate recommended immediately before
  WO-009, not an activated insertion. Published history, package/schema axes,
  and every substantive constraint in this decision remain unchanged.
- WO-006 adds Prettier 3.9.6 as an exact dev dependency and the repository-wide
  formatter for supported, human-maintained text. The pinned configuration
  standardizes 80-column wrapping and LF endings; explicit ignores protect raw
  intake, append-only and hash-sensitive data, settled decision bodies,
  work-order scope authorities, generated projections, immutable reviewed
  evidence, dependencies, and build output. Targeted Markdown ignore comments
  retain established heading anchors where whitespace is significant. `format`
  writes the supported surface and `format:check` joins the evidence gate.
  Prettier never enters the kernel's runtime dependency graph.
- 2026-09-02, WO-025 supersedes only the prose-width part of that formatting
  choice. `printWidth: 80` remains the code-formatting preference, while
  Markdown uses `proseWrap: "preserve"` so the formatter does not turn a source
  width into a reader viewport. New PR and release-note bodies use one physical
  line per prose paragraph or list-item paragraph, retain semantic Markdown
  boundaries, and are checked before publication. Existing immutable review
  artifacts and public history are not reformatted.
