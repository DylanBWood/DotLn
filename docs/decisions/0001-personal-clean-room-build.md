# ADR-0001 — Personal clean-room build; founding question closed

**Status:** Accepted (2026-08-30)

## Context

The founding corpus contains a five-way architecture-genesis experiment
(P1–P5) and, later, the finding that it already ran in blended form and
converged (chat 011: "enough analysis paralysis"). It also contains a
work-environment route — "full-context bootstrap with progressive
self-hosting" — that leans on the predecessor's live rule stack as scaffolding.

That route is unavailable here by design: this is a personal repository on a
personal machine, the predecessor system is not present and never will be, and
no employer code, configuration, or identifiers may enter (see CLAUDE.md).

## Decision

1. The founding question is **closed**. No tournament, no parallel prototype
   repos, no clean-room-vs-inherited experiment. Tournament machinery
   (architecture packets, blind submissions) stays preserved in the ledger for
   future architecture-scale decisions.
2. The personal build is **clean-room seeded by the ideation corpus**: the
   blueprint docs, ledger, and decision records replace the predecessor's rule
   stack as bootstrap competence. The corpus finding that "the accumulated
   rules are load-bearing" is honored by *compiling their ideas from the
   ledger*, not by importing their text.
3. The **one remaining experiment** runs continuously through implementation:
   how quickly typed mechanisms absorb responsibility from this blueprint's
   prose without losing the competence the prose encodes. The strangler loop
   applies with `docs/product/` as the prose layer: externalize a behavior →
   test it → stop depending on the doc for that behavior → repeat.
4. Provenance note: authorship credit between predecessor ideas, model
   elaboration, and operator judgment is explicitly not worth proving.

## Consequences

No inherited-context ledger for external rules is needed (nothing external is
inherited). The idea ledger carries the lineage instead. If a work deployment
ever exists, it gets its own ADR and its own bootstrap route.

## Amendments

### 2026-09-03 — external inspiration and rights provenance remain required

Decision 4 rejects forensic apportionment among predecessor ideas, model
elaboration, and operator judgment when the evidence cannot support it. It does
not excuse omission of a known book, method, paper, film, game, conversation,
technical tradition, or other external influence. Nor does it waive license,
quotation, dependency, copied-material, or source-status obligations. The
public [Sources and inspirations register](../lineage/inspirations.md) records
the best-known intellectual inheritance; exact internal co-authorship may
remain `unknown` without turning external provenance into `unknown` by default.
