# WO-116 — Audit projection served: a terminal command renders the canonical audit record's three projections for a resident store, and the parity surface serves the same bytes with their fidelity labels, so a UI can audit what the runtime did without a second source (v0.54.0)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One read command over the WO-007
audit fold, named in WO-115's contract. Assigned at activation under
the standing opt-out default.
**Cost:** adds one terminal read command over a resident store's log, one
identifier in the console command contract, a render in the text host,
fixtures over one retained log, and at most 400 bytes in product 09.
Removes the gap the console's own document names: runtime audit is the
one inspection the parity contract cannot serve, so a UI that audits
today needs a second reader of the log. It is the third step of gate U
of the critical path and WO-117 depends on it. Re-mints: none while the
fold (`packages/skeleton/src/audit.ts`, a registered source) is not
edited; the skeleton's release label is normalized out of the edition
checks (WO-152 D004). Wall-clock, tokens and context bytes are unknown
until run.
**Nomination provenance:** the operator's 2026-09-08 mid-pass direction
that the runtime has the UI to audit; 09-audit-resilience-privacy.md's
canonical audit record and projections (WO-007). Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec` before moving it up: the terminal command the contract must
name does not exist yet and is now a deliverable, the privacy clause is
replaced by byte identity with that command because product 09 defers
the projections' access rules, the write-back is bounded and the final
criterion names both gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft; captures and hashes in the ledger
sections of those dates. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-115 merged (the surface; closed, v0.52.0); WO-007 merged
(the audit fold; closed).
**Recommended placement:** paired with WO-173 in the second slot, after
WO-060 and WO-167. This order edits `packages/skeleton/src/dotln.ts` and
`console-commands.ts`, `packages/console`, their tests, product 09 and
the console README; WO-173 edits the lifecycle scripts, the role text,
one resident test and product 07. Disjoint files; neither depends on
the other; this order re-mints nothing. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-115",
    "relation": "hard",
    "reason": "the surface"
  },
  {
    "workOrderId": "WO-007",
    "relation": "satisfied-by-close",
    "reason": "the audit fold"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 09-audit-resilience-privacy.md §Canonical
audit record, §Fidelity levels and §Audit projections and visualizations;
04-interfaces.md §Console parity contract v1;
`packages/skeleton/src/audit.ts` (read, not edited);
`packages/skeleton/src/console-commands.ts`;
`packages/skeleton/src/cli.ts` (`--audit` over the fixture scenario);
`packages/console/README.md` (the parity section);
`docs/work-orders/WO-007-audit-record-baseline.md`; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.

**Objective:** a terminal read command returns the canonical audit
record's three projections for a resident store's retained log, with
their fidelity labels and the causal links the fold recognized; the
console command contract names that command, so the served result is the
terminal's bytes; the text host renders them. The command adds no field
to what the fold projects.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The skeleton's `--audit` renders the three projections over the
  fixture scenario's log only; no command reads a resident store.
- The console command contract lists 23 commands and none serves audit;
  the console's README says runtime audit has no terminal command in
  this version and follows this order.
- Product 09 states that the projections' access and retention rules are
  not yet defined and that their enforcement is deferred, and that the
  governed-raw projection includes every retained event envelope. The
  order as filed required a fixture proving that no projection includes
  bytes the privacy rules exclude; no such rules exist to judge it by.

**Design (scope discipline):**

- Read-only; the fold is WO-007's; the labeled adjacency fallback stays
  labeled.
- The terminal owns the command and its refusals (WO-115 D005); the
  contract gains one identifier whose entry and prefix select it. A
  store that holds no log, and a selection the log does not contain,
  refuse in the terminal's words.
- The selection is what the fold already scopes by: the whole log, one
  workstream or one episode. The order adds no other filter.
- **Declined alternatives, recorded:** a new audit format; a redaction
  layer in the served command (product 09 defers the rules a redaction
  would apply; a served command that differs from the terminal's is the
  second source this order exists to avoid; reopen when product 09
  defines an access rule for a projection).

**Deliverables:** the terminal command, the contract identifier, the
render, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. Over the fixture log, the terminal command's output equals the
   projections the skeleton's `--audit` renders for that log, byte for
   byte, with the fidelity labels present. The three scopes each select
   what the fold selects for them; an empty store and an absent episode
   refuse with a message that names the store or the episode.
2. Through the loopback surface the contract's new command returns the
   terminal command's standard output byte for byte for the same store
   and selection, and the text host's render shows the three projections
   and their labels. The served result holds no field the terminal's
   output lacks.
3. Write-backs land, each in place with no dated paragraph: 09 §Audit
   projections and visualizations (the served command; at most 400 bytes
   added, against 1,016 bytes of headroom on 2026-09-28), 04 §Console
   parity contract v1 (the identifier; at most 200 bytes), the console
   README's parity section, the decisions file; publication locks.
4. `packages/skeleton/src/audit.ts` is unchanged, or the decisions name
   the change and each edition it stales is re-minted.
5. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` at final review.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** new audit semantics; visualizations beyond text; access,
retention or redaction rules for a projection (product 09 defers them).

**Operator-review assumptions**

1. Text is the reference render; the fork's shell draws the visualizations.
2. Serving exactly what the terminal prints is the v1 privacy position:
   the loopback surface is bound to the local user, as WO-115 made it.
