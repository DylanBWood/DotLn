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
   `VerificationAdapter`, `DeliveryAdapter`. The ticket→PR promise is proven at
   v0.9.0 with a personal-flavor adapter (GitHub Issues); an enterprise-tracker adapter
   remains a future optional plug-in.
3. **Language/runtime:** TypeScript everywhere; the kernel and compiler have
   zero runtime dependencies and no I/O (pure functions + data; dev-only
   build/test tooling is recorded in Amendments below). Node is
   the adapter runtime. UI framework is deliberately undecided until v0.7.0
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
