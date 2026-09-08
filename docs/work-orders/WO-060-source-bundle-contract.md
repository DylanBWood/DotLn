# WO-060 — SourceBundle v1: an immutable, positively decoded bundle of a tracked-work artifact's sections, discussion, image references and revisions, with a screen that keeps secrets and resolved URLs out (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new public contract in the compiler
package (types, decoder, canonical hash); no dependency. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
G, the contract slice), cut as a bounded order at the operator's same-day
correction; product 03's `SourceAdapter` port and ADR-0002 Decision 2 (the
enterprise tracker adapter stays outside core). Planner-synthesized draft;
captures and hashes in the ledger section of that date. Opaque identifier,
not a priority. Clean-room screen: the fixtures are synthetic issues; no
tracker name or private artifact enters the repository.
**Depends on:** WO-008 merged (the pure compiler package that holds the
contract; satisfied at `v0.4.0`).
**Recommended placement:** any free lane; it edits `packages/compiler/src/`
(a new source-bundle module), its tests and product 03. A recommendation,
not a dependency token.

**Cites (read these sections):** 03-architecture.md §Ports (`SourceAdapter`;
the external target binding rule); 12-workstream-application.md §One outcome
from request to return (the artifact's sections and discussion);
09-audit-resilience-privacy.md §Privacy and minimization; ADR-0002 Decision
2; 02-domain-model.md §Identity and composition (canonical JSON and hashing
conventions).

**Objective:** Define `SourceBundle` v1: `{ bundleId, sourceKind, revisionId, sections[], discussion[], images[], revisions[] }`
where a section is `{ id, heading?, text, span }`, a discussion entry is
`{ id, author: role label, text, span, createdAt }`, an image is
`{ id, hash, altText?, referencedBy: span }` with no bytes, and a revision
is `{ revisionId, changedSpans[] }`; a positive decoder; a canonical hash;
and a screen that refuses a bundle containing a secret-shaped token or a
resolved private URL, so nothing downstream can leak what never entered.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The `SourceAdapter` port is prose in product 03; no type carries a
  tracked-work artifact into the runtime, so no contract can be derived
  with provenance.

**Design (scope discipline):**

- Spans are `{ sectionId | entryId, start, end }` over the bundle's own
  text, so a derived statement can point back to bytes.
- The screen: patterns for common secret shapes (tokens, keys, bearer
  strings) and any URL whose host is not on an explicit public allowlist
  supplied at decode time; a match refuses with the span.
- Author is a role label (`reporter`, `reviewer`, `automation`), never an
  identity.
- **Declined alternatives, recorded:** carrying image bytes (evidence
  references only); a tracker-specific field (the generic bundle is what
  keeps the tracker outside core).

**Deliverables:** the types, decoder, hash and screen; synthetic fixtures;
the write-backs below.

**Acceptance criteria (all required)**

1. Six synthetic bundles round-trip through the decoder and hash equal after
   canonicalization; eight malformed bundles refuse with a path.
2. A bundle with a secret-shaped token or a private-host URL refuses with the
   span; the same bundle with the token removed decodes.
3. Every span in every fixture resolves to bytes inside its section or entry,
   proven by a test.
4. Write-backs land: 03 §Ports (the bundle as the port's input), 10 §Separate
   version axes (the contract axis), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the StoryContract (WO-061); any adapter (WO-062); the
enterprise tracker.

**Operator-review assumptions**

1. Author-as-role is enough for v1; identities are a privacy decision for a
   later pass.
