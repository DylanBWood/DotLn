# WO-124 — Impact surfaces derivation: the implementation order's surfaces and tests are derived from the contract, the repository profile and a worktree snapshot, labeled by origin, with a confidence gate that hands off instead of guessing (v0.64.0)

**Model:** any capable model for the derivation; the inference slot is a
labeled double in tests. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One pure derivation in the compiler
package plus a snapshot reader in the skeleton. Assigned at activation
under the standing opt-out default.
**Cost:** adds `deriveSurfaces` and the typed profile input it reads to the
story-contract module WO-061 adds, a snapshot index reader as a new
skeleton module, fixtures with an inference double, and at most 150 bytes
in product 06 and 300 in product 03. Removes: the surfaces and tests of an
order derived from an issue would be typed by hand, and the one derivation
that fills surfaces today, the portfolio's, reads discovery candidates
only. WO-123 and WO-118 depend on it. Re-mints: if WO-061 registered the
story-contract module in `scripts/lib/evidence-sources.mjs`, a
deterministic re-mint of each edition it stales; the compiler release
moves the policy hash the console binds, so the feedback edition is
carried (`feedback-evidence --carry`), the console is re-pinned and the
console self-host fixtures that hold the compiler label follow it (WO-154
D011; WO-162 D012); the skeleton reader is a new module no registered
source imports, and `packages/skeleton/src/verification-worktree.ts` is
read, not edited, so no source the feedback verifier judges changes and
no live episode is owed. Wall-clock, tokens and context bytes are unknown
until run.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 1): the loop proof required the operator to supply
reviewed surfaces, so one intent could not suffice. Planner-synthesized
draft; the capture's hash is in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition. Amended
by the 2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: the profile is a typed input this order declares because
WO-073's profile is a document sequenced last, the confidence gate and
what it does with an unresolvable path are stated, and the write-backs
name sections that exist and both gates are named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-061 merged (the contract it reads); WO-054 merged (the
worktree snapshot shape it reads; closed at `v0.30.0`).
**Recommended placement:** fourth of the serial run, after WO-061, on
which it depends, and before WO-062. This order edits the story-contract
module WO-061 adds, a new module in `packages/skeleton/src/`, their tests,
the console's pins, the pipeline sentence of product 06 and 03 §Ports;
WO-066 and WO-061 amend the same sentence of 06 before it, and WO-060 and
WO-059 write 03 §Ports before it and WO-062 after it. WO-073, whose
profile document this order's typed input stands in for, is last in the
sequence. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-061",
    "relation": "hard",
    "reason": "the contract it reads"
  },
  {
    "workOrderId": "WO-054",
    "relation": "hard",
    "reason": "the worktree snapshot shape it reads"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Application version pending
— Source-to-deliverable vertical (`RepoProfile + ImpactMap` in the pipeline
sentence); 03-architecture.md §Ports (what keeps work-flavored verticals
pluggable) (the ImpactMap a cartographer episode produces);
02-domain-model.md §Independent verification v1 (the worktree snapshot's
bounds); `docs/work-orders/WO-061-story-contract-compile.md`;
`docs/work-orders/WO-073-repository-class-and-profile.md` (the profile
document: commands and demonstrated architecture);
`packages/skeleton/src/verification-worktree.ts`
(`prepareWorktreeVerification`; read, not edited);
`packages/skeleton/src/portfolio.ts` (the surfaces a portfolio obligation
takes from a candidate's paths); `scripts/lib/evidence-sources.mjs`;
`docs/evidence/WO-154/decisions.md` D011 and
`docs/evidence/WO-162/decisions.md` D012 (what a compiler release owes);
the [2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `deriveSurfaces(contract, profile, snapshotIndex)` returns
`{ surfaces[], tests[], origin per entry, confidence }`: paths named in
the contract's statements resolve against the snapshot (`rule`); the
profile's demonstrated architecture maps requirement nouns to directories
(`rule`); a supplied inference list may add entries (`inferred`, with
rationale); below a declared confidence, the result is `NeedsHuman` with the
candidate list, never a guess; the derived order's surfaces are the union
and its tests are the profile's commands scoped to those surfaces.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No module derives surfaces from a contract: no source names an
  `ImpactMap`, a cartographer or `deriveSurfaces`, and the story-contract
  module arrives with WO-061. Product 03 describes an ImpactMap as what a
  read-only cartographer episode produces, and product 06 names
  `RepoProfile + ImpactMap` as one step of the vertical; neither holds an
  impact-map candidate.
- One derivation fills surfaces without hand typing: a portfolio
  obligation takes its surfaces from a discovery candidate's paths
  (WO-100). It serves portfolio duties, not a contract.
- WO-073 defines the profile as one Markdown document per registered
  repository (`docs/repositories/<id>.md`), loaded on demand by the role
  skill; the directory does not exist, WO-073 is last in the sequence, and
  no typed profile value exists.
- The worktree snapshot WO-054 seals holds at most 100 regular files of at
  most 100,000 bytes each and refuses symlinks, submodules and binary
  files (02 §Independent verification v1), so an index read from it covers
  no larger repository.

**Design (scope discipline):**

- Pure over its inputs; the snapshot index is a path list with sizes and
  hashes.
- The profile is a typed value this order declares for the parameter: the
  demonstrated architecture as nouns with their directories, and the
  commands with the directories each covers; the rule that matches a noun
  to a requirement statement is data the module exports. Fixtures supply
  the value; mapping WO-073's document to it is outside this order.
- Confidence is the share of requirement statements that yield at least
  one surface; the threshold is a declared value the caller passes,
  default 1. Below it the result is `NeedsHuman` with the candidate list.
- A path a statement names that the index does not hold is a candidate,
  never a surface; an index or a profile that does not decode refuses with
  the failing field's path; a repository the snapshot cannot hold has no
  index, and the result is `NeedsHuman` naming the bound.
- A derived order's tests are the profile commands whose directories hold
  a derived surface, each selected whole; no command string is rewritten.
- The index reader is a new skeleton module that reads a snapshot WO-054's
  host produced; it edits no registered source.
- **Declined alternatives, recorded:** a model choosing surfaces freely;
  widening surfaces on contact; reading WO-073's Markdown document as the
  parameter (a pure function cannot take a document the role skill loads;
  reopen when WO-073 lands with a typed projection or moves ahead of this
  order).

**Deliverables:** the derivation, the profile type, the index reader,
fixtures, the re-mints, the write-backs below.

**Acceptance criteria (all required)**

1. Over fixture contracts, a fixture profile and a fixture snapshot index,
   rule-origin surfaces are pinned and an inferred entry is labeled with
   its rationale; a path the index does not hold stays a candidate. A
   contract with no resolvable path, and one with one covered and one
   uncovered requirement, each yield `NeedsHuman` with the candidates at
   the default threshold, and the second yields a result at a threshold of
   one half. The criterion is judged against these fixtures; a case
   outside them is a follow-up, not a failure.
2. The derived tests are the profile commands whose directories hold a
   derived surface, each selected whole; the result is byte-identical
   across runs with the same inputs; an index or a profile that does not
   decode refuses with the failing field's path.
3. The index reader reports each file of a fixture snapshot with its path,
   size and hash; `packages/skeleton/src/verification-worktree.ts` is
   unchanged.
4. Write-backs land, each in place with no dated paragraph: 06
   §Application version pending — Source-to-deliverable vertical (the
   `RepoProfile + ImpactMap` step of the pipeline sentence; at most 150
   bytes added, against 1,802 bytes of headroom on 2026-09-28; WO-086 and
   WO-087 change 06 before this order, and WO-066 and WO-061 amend the
   same sentence, so the executor re-measures the headroom at its base,
   and where the bound does not fit it consolidates the section it edits
   in the same change; a ceiling is raised only by a planning-document
   decision) and 03 §Ports, beside the ImpactMap sentence (the derivation
   and its gate, distinct from the cartographer episode; at most 300
   bytes, against 3,284 bytes of headroom on 2026-09-28; WO-060 and WO-059
   write the same section before this order and WO-062 after it, under the
   same rule); the decisions file; the publication locks refreshed.
5. The decisions record whether WO-061 registered the story-contract
   module; every edition the Cost line names is re-minted or carried and
   the console re-pinned; the decisions record each.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because the
story-contract module is a declared source of the five evidence suites
when WO-061 registered it, and again at final review. No live row.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** executing anything; a full dependency graph of the target;
the cartographer episode 03 §Ports describes; mapping WO-073's profile
document to the typed profile; a repository larger than the snapshot
holds; an edit to `packages/skeleton/src/verification-worktree.ts`.

**Operator-review assumptions**

1. A hand-off below the confidence gate is the right default for the first
   runs.
2. The profile is this order's typed input, supplied by fixtures, until
   WO-073's document maps to it; the planner may instead move WO-073 ahead
   of this order.
3. Confidence is the share of requirements with a surface and the default
   threshold is 1, so any uncovered requirement hands off.
4. A profile command is selected whole when its directories hold a derived
   surface.
