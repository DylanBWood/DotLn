# WO-078 — Sibling registry and export receipts: core tracks the starter and the Angular consumer as siblings with their kit version and build hash, and every export appends a receipt (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation convention plus one check.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-033's "sibling registry in core" item, cut
into a bounded child at the operator's 2026-09-08 correction. Planner-
synthesized draft. Opaque identifier, not a priority. Clean-room screen:
the siblings are the operator's public repositories.
**Depends on:** WO-074 merged (the first export receipt).
**Recommended placement:** after WO-074, in a free lane; it adds
`docs/siblings/README.md`, `docs/evidence/siblings/` and one check. A
recommendation, not a dependency token.

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
(the registry item); 03-architecture.md §Platform and instance boundary
(the sibling-repository experiments); `docs/planning/capability-table.md`.

**Objective:** `docs/siblings/README.md` holds one entry per sibling
(purpose, upstream relation, the kit manifest version and build hash it
carries, the orders in core that advanced it, its capability rows); every
`launchpad export` and `--update` appends a receipt under
`docs/evidence/siblings/` (destination sibling id, core commit, manifest
hash, build hash, date); a check refuses a registry entry whose recorded
manifest hash differs from the latest receipt.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The starter's kit version would be memory, not evidence.

**Design (scope discipline):**

- Forks of the starter are not tracked unless a fork's experience changes
  core, the starter or the Angular consumer.
- **Declined alternatives, recorded:** a registry of every fork.

**Deliverables:** the registry, the receipt convention, the check, the
write-backs below.

**Acceptance criteria (all required)**

1. An export fixture appends a receipt with the five fields and the registry
   check passes; a registry entry with a stale manifest hash is refused.
2. The registry carries the starter's entry and the Angular consumer's
   entry with "not evidenced" where no run has happened.
3. Write-backs land: `docs/README.md`, ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** tracking external organizations' forks.

**Operator-review assumptions**

1. Sibling ids are public repository names.
