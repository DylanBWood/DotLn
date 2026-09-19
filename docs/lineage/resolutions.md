# Ledger resolutions

Moved from `idea-ledger.md` on 2026-09-19 under WO-084. The section below is
preserved verbatim; [the ledger](idea-ledger.md) and [index](README.md) retain
discoverability. Reopening follows product 07 §Discipline and the decision
records cited here.

## Resolutions of known tensions

These are the corpus's internal contradictions, resolved once, here, so no
future session relitigates them (see decision records for full rationale):

1. **Five-way founding tournament (chat 010) vs. collapse (chat 011).**
   Resolved: CLOSED. The tournament already ran in blended form and converged
   (ADR-0001). Tournament-machinery ideas (architecture packets, blind
   submissions) stay `preserved` for future architecture-scale decisions.
2. **Comprehensive capability audit vs. bounded toolchain inspection.**
   Resolved: environment-dependent. On this personal Mac a bounded inspection
   (WO-001) suffices; the full audit prompt remains preserved for constrained
   environments where the runtime is wrapped or metered.
3. **Full-context bootstrap on v1 vs. clean-room.** Resolved: the personal
   build is clean-room BY CONSTRUCTION (v1 is not present here and never will
   be). This blueprint corpus replaces v1 as bootstrap competence. The
   strangler experiment still runs: typed mechanisms progressively absorb the
   blueprint's prose. (ADR-0001)
4. **Ticket-to-PR as the product vs. agentic core as the product.** Resolved by
   the operator directly: the personal build centers agentic communication and
   the kernel; ticket-to-verified-PR remains a supported vertical behind
   SourceAdapter/WorkOrderTransport ports. (ADR-0002)
5. **Playwright/browser as universal task bus vs. transport-neutral dispatch.**
   Resolved: WorkOrderTransport is the port; browser-as-shared-world is one
   adapter (and a strong one for verification), chosen empirically per
   environment.
6. **Absence as a mandatory authority brake vs. progressive unattended
   autonomy.** Resolved: presence and recorded elapsed absence are policy
   inputs, not grants with a universal direction. A declared PresencePolicy may
   hold, shrink, grow, peak, reset, or loop attention, work scope, and effect
   authority independently within its source grant and ceiling; external
   capability remains independently observed. Without a declared transition,
   the affected axis holds. Earlier categorical no-growth clauses remain
   historical and are superseded by ADR-0007.
