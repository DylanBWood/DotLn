# WO-078 — Sibling registry and export receipts: core tracks the starter and the Angular consumer as siblings with their kit version and build hash, and every export appends a receipt (version assigned at activation)

**Cost:** adds one receipt written inside the existing export and update
commands (bytes on disk; no step, command or prompt) and one generated table
with a check, in the manner of the work-order index; the fixture records the
generator's wall-clock and the table's bytes. Removes the manual lookup of
each sibling's kit manifest version and build hash in its own checkout
before every update, planning pass or receipt that names the sibling, one
checkout read per sibling per occasion, and the risk that the recorded
version is memory. No recurring bookkeeping is added: the once-per-sibling
declaration is written at registration, not per export. Revised 2026-09-12
at refutation receipt 009's hold; the legacy declaration is superseded.

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

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "the first export receipt"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
(the registry item); 03-architecture.md §Platform and instance boundary
(the sibling-repository experiments); `docs/planning/capability-table.md`.

**Objective:** `docs/siblings/README.md` is generated, never hand-maintained:
one entry per sibling (purpose and upstream relation from a once-per-sibling
declaration; the kit manifest version and build hash it carries, the orders
in core that advanced it and its capability rows from the receipts and the
kit manifests); every `launchpad export` and `--update` writes its receipt
under `docs/evidence/siblings/` (destination sibling id, core commit,
manifest hash, build hash, date) inside the command's existing manifest step;
the generator's check refuses a hand-edited entry or one whose recorded
manifest hash differs from the latest receipt.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The starter's kit version would be memory, not evidence.

**Design (scope discipline):**

- Forks of the starter are not tracked unless a fork's experience changes
  core, the starter or the Angular consumer.
- **Declined alternatives, recorded:** a registry of every fork.

**Deliverables:** the registry generator with its check, the receipt written
by the existing export and update commands, the once-per-sibling declaration,
the write-backs below.

**Acceptance criteria (all required)**

1. The registry is generated, never hand-maintained: `launchpad export` and
   `--update` write the receipt with the five fields inside their existing
   manifest step, with no separate bookkeeping command or edit, and the
   generator rebuilds `docs/siblings/README.md` from the receipts, the kit
   manifests and the once-per-sibling declaration, with a check form in the
   manner of the work-order index; an export fixture proves the receipt and
   the regenerated entry, a hand-edited entry and one whose manifest hash
   disagrees with the latest receipt are refused, and the fixture records the
   generator's wall-clock and the table's bytes. The removed work is the
   manual lookup of a sibling's kit manifest version and build hash in its
   own checkout before every update, planning pass or receipt that names the
   sibling; the order's execution record names that lookup and its cost.
2. The registry carries the starter's entry and the Angular consumer's
   entry with "not evidenced" where no run has happened.
3. Write-backs land: `docs/README.md`, ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** tracking external organizations' forks.

**Operator-review assumptions**

1. Sibling ids are public repository names.
