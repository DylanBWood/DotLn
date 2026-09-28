# WO-060 — SourceBundle v1: an immutable, positively decoded bundle of a tracked-work artifact's sections, discussion, image references and revisions, with a screen that refuses the secret shapes it declares and every declared URL form whose host is not allowed (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new public contract in the compiler
package (types, decoder, canonical hash, screen); no dependency. Assigned
at activation under the standing opt-out default.
**Cost:** adds one module in `packages/compiler/src/` with its types, a
positive decoder, a canonical hash and a screen whose shapes are data;
fourteen synthetic bundle fixtures and one fixture per declared shape and
URL form; one export, and the module's registration in
`scripts/lib/evidence-sources.mjs`; at most 800 bytes in product 03 and
300 in product 10. Removes nothing that runs today: the `SourceAdapter`
port is prose and no code carries a tracked-work artifact. What it
unblocks is gate G of the critical path: WO-061 and WO-062 depend on the
bundle and WO-065 on its screen. Re-mints: deterministic, each edition
that `packages/compiler/src/index.ts`, `packages/compiler/package.json`
or `scripts/lib/evidence-sources.mjs` stales; the compiler release moves
the policy hash the console binds, so the feedback edition is carried
(`feedback-evidence --carry`), the console is re-pinned and the console
self-host fixtures that hold the compiler label follow it (WO-154 D011;
WO-162 D012); no source the feedback verifier judges is edited, so no
live episode. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
G, the contract slice), cut as a bounded order at the operator's same-day
correction; product 03's `SourceAdapter` port and ADR-0002 Decision 2 (the
enterprise tracker adapter stays outside core). Amended by the 2026-09-28
planning pass, which re-observed the order on `main` at `5f3849ec` before
moving it to the head: the screen's claim is bounded to a declared set,
the registered sources and re-mints are named, the write-backs are
bounded by the document ceilings and the final criterion names both
gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft; captures and hashes in the ledger
sections of those dates. Opaque identifier, not a priority. Clean-room
screen: the fixtures are synthetic issues and synthetic token-shaped
strings that were never credentials; no tracker name or private artifact
enters the repository.
**Depends on:** WO-008 merged (the pure compiler package that holds the
contract; satisfied at `v0.4.0`).
**Recommended placement:** paired with WO-167 at the head of the
sequence. This order edits `packages/compiler/src/` (a new source-bundle
module and the package's export), its tests,
`scripts/lib/evidence-sources.mjs`, the console's pins and products 03
and 10; WO-167 edits product 07 and the planning map. Disjoint files;
neither depends on the other; WO-167 re-mints nothing. A recommendation,
not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-008",
    "relation": "satisfied-by-release",
    "release": "v0.4.0",
    "reason": "the pure compiler package that holds the contract"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Ports (`SourceAdapter`;
the external target binding rule); 12-workstream-application.md §One outcome
from request to return (the artifact's sections and discussion);
09-audit-resilience-privacy.md §Privacy and minimization; ADR-0002 Decision
2; 02-domain-model.md §Identity and composition (canonical JSON and hashing
conventions); `scripts/lib/evidence-sources.mjs` (the inventories and the
import closure check); `docs/evidence/WO-154/decisions.md` D011 and
`docs/evidence/WO-162/decisions.md` D012 (what a compiler release owes);
`docs/control/doc-ceilings.json`; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.

**Objective:** Define `SourceBundle` v1: `{ bundleId, sourceKind, revisionId, sections[], discussion[], images[], revisions[] }`
where a section is `{ id, heading?, text, span }`, a discussion entry is
`{ id, author: role label, text, span, createdAt }`, an image is
`{ id, hash, altText?, referencedBy: span }` with no bytes, and a revision
is `{ revisionId, changedSpans[] }`; a positive decoder; a canonical hash;
and a screen that refuses a bundle holding one of the secret shapes it
declares or a declared URL form whose host is not on the allowlist, with
the span. What the screen does not declare it does not claim.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The `SourceAdapter` port is prose in product 03; `packages/compiler/src/`
  holds eighteen modules and none defines a source bundle, so no type
  carries a tracked-work artifact into the runtime and no contract can be
  derived with provenance.
- Guards and screens are the largest class among the findings that failed
  verifications (48 of 184), most of them found by a case the judge
  constructed outside what the order's fixtures held; the orders that
  failed longest claimed a universal and were repaired one shape at a
  time (planning document §5).

**Design (scope discipline):**

- Spans are `{ sectionId | entryId, start, end }` over the bundle's own
  text, so a derived statement can point back to bytes.
- The screen's shapes are data the module exports. The minimum set: a
  private-key block header; a bearer credential (the word followed by a
  token of at least twenty characters); the vendor token prefixes of the
  tracker whose adapters follow this order (GitHub's personal-access,
  OAuth, user-to-server, server-to-server and refresh tokens). The
  executor takes each pattern from the vendor's public documentation and
  cites it in the decisions. A match refuses with the span.
- The screen declares the reference forms it reads as a URL. Every
  declared form whose host is not on an explicit public allowlist
  supplied at decode time refuses with the span; an empty allowlist
  refuses them all. Text outside the declared forms is text.
- A string the screen cannot classify passes: the screen is a declared
  filter, not a detector of every secret. The module's documentation and
  product 03 say so in one sentence.
- Author is a role label (`reporter`, `reviewer`, `automation`), never an
  identity.
- **Declined alternatives, recorded:** carrying image bytes (evidence
  references only); a tracker-specific field (the generic bundle is what
  keeps the tracker outside core); an entropy or length heuristic for
  unknown secrets (it refuses ordinary hashes and identifiers, which
  every bundle holds, and its bypasses cannot be enumerated; reopen when
  an adapter stores a credential the declared set missed).

**Deliverables:** the types, decoder, hash and screen; the fixtures; the
registration; the re-mints; the write-backs below.

**Acceptance criteria (all required)**

1. Six synthetic bundles round-trip through the decoder and hash equal after
   canonicalization; eight malformed bundles refuse with a path.
2. For each declared secret shape and each declared URL form, a bundle
   that holds it refuses with the span, and the same bundle without it
   decodes. With an empty allowlist every declared URL form refuses. A
   fixture holds three secret-like strings outside the declared shapes;
   they decode, and the module's documentation and product 03 name them
   as the screen's limit. The criterion is judged against the declared
   set; a shape outside it is a follow-up, not a failure.
3. Every span in every fixture resolves to bytes inside its section or entry,
   proven by a test.
4. Write-backs land, each in place with no dated paragraph: 03 §Ports
   (the bundle as the port's input and the screen's limit; at most 800
   bytes added, against 3,284 bytes of headroom on 2026-09-28) and 10
   §Separate version axes (the contract axis; at most 300 bytes, against
   507); the decisions file; publication locks.
5. The new module is registered or excluded with a reason in
   `scripts/lib/evidence-sources.mjs`; every edition the Cost line names
   is re-minted or carried and the console re-pinned; the decisions
   record each.
6. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency; kernel unchanged.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` at final review.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the StoryContract (WO-061); any adapter (WO-062); the
enterprise tracker; detection of a secret outside the declared shapes.

**Operator-review assumptions**

1. Author-as-role is enough for v1; identities are a privacy decision for a
   later pass.
2. A declared filter with a stated limit is the v1 claim; adding a shape
   is a later minor release.
