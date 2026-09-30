# WO-058 — `verification-v1` gains `visual` and `network` claim types with witness rules: a DOM-only witness cannot satisfy a visual criterion, a network claim needs request evidence, and a console error is a failing witness (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A compatible extension of the
`verification-v1` contract (two claim types, five witness kinds) in the
compiler and in the skeleton's result schema and admission rules, so both
packages are released; every recorded capsule still replays. Assigned at
activation under the standing opt-out default.
**Cost:** adds two claim types and five witness kinds to
`packages/compiler/src/verification.ts`, the matching result-schema members
and admission rules to `packages/skeleton/src/verification-protocol.ts`,
fixtures that need no browser, and at most 800 bytes in product 02 and 200
in product 10. Removes the gap product 02 names: visual and network
evidence are deferred, so a screenshot is narrative. WO-059 depends on it
for the witness kinds and WO-061 for the `visual` claim type. Re-mints:
both files are registered evidence sources in every edition and sources
the feedback verifier judges, so the authority, artifact-identity,
verification and harness editions are re-minted deterministically and the
executor runs one live self-host episode for the feedback edition on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, which needs no
authorization; the console is re-pinned to the new feedback
edition, and its self-host fixtures that hold the compiler label follow
the compiler release (WO-154 D011; WO-162 D012). Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
F, the contract slice), cut as a bounded order at the operator's same-day
correction; WO-010 deferred these claim types to their consumer. Planner-
synthesized draft; captures and hashes in the ledger section of that date.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
Amended by the 2026-09-28 planning pass, which re-observed the order on
`main` at `5f3849ec`: the claim types are corrected, the rules are
admission rules in the skeleton beside the compiler's types and the
version follows a replay test, and the re-mints, the bounded write-backs
and both gates are named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-010 merged (the claim-typed evidence contract this order
extends; satisfied at `v0.12.0`).
**Recommended placement:** first of the serial run, after the pair of
WO-066 and WO-057. This order edits `packages/compiler/src/verification.ts`,
`packages/skeleton/src/verification-protocol.ts`, their tests, products 02
and 10, the evidence editions and the console's pins; WO-059 follows it
and depends on it. WO-065 and WO-066 write product 02 before it, and
WO-060 and WO-086 write product 10. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-010",
    "relation": "satisfied-by-release",
    "release": "v0.12.0",
    "reason": "the claim-typed evidence contract it extends"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Independent
verification v1 (claim types, witnesses, the acceptance matrix, the
`worktree-snapshot` profile); 10-ir-compatibility.md §Separate version axes
(WO-067's precedent: an absent optional member emits no bytes, so existing
hashes stay exact); `docs/evidence/WO-010/README.md` (the deferred claim
types); `packages/compiler/src/verification.ts` (`ClaimType`,
`copyCriterion`, `copySubject`, `assertVerificationTask`) and its tests;
`packages/skeleton/src/verification-protocol.ts` (`parseEvidenceResult`
and its named refusals, `evidenceResultSchema`);
`packages/skeleton/src/reactor.ts` (the verification branch of
`seiriReactor`, where an admitted evaluation sets a row's status; read,
not edited); `docs/evidence/WO-154/decisions.md` D011 and
`docs/evidence/WO-162/decisions.md` D012 (what a compiler release owes);
`packages/skeleton/README.md` §Feedback compiler and bounded self-hosting
(the live episode's commands); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Extend the contract so a criterion may be typed `visual` or
`network` and be satisfied only by the witness kinds those types admit:
`screenshot` (content hash bound to the criterion id), `dom-snapshot`,
`accessibility-snapshot`, `network-trace` (request and response shapes) and
`console-capture`; the fold rules that a visual criterion with only DOM or
accessibility witnesses is `unverified`, a network criterion without a trace
witness is `unverified`, and a console error captured during a witnessed
scenario is a failing witness for every criterion of that scenario; all with
fixtures that need no browser.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The contract types a claim as `state` or `behavior` and its evidence by
  source, `synthetic-fixture` or `live`, as it did at `33e2c25` (the order
  as filed said behavior and evidence). No `visual` or `network` claim type
  or witness kind exists, and product 02 calls visual and network evidence
  deferred. One witness payload has appeared since: `hostTest` of kind
  `host-run-test` (WO-054), which the optional `worktree-snapshot` profile
  requires of every witness; that profile admits live behavior criteria
  only.
- The claim types are fixed in the compiler's type and checks and in the
  skeleton's result schema and its admission rules for a pass. A verdict is
  the verifier's evaluation, which the host admits or refuses in
  `parseEvidenceResult`; the matrix sets a row's status from an admitted
  evaluation, and no fold derives a verdict from witnesses.
- The contract's version is the string `verification-v1`;
  `verificationResultVersion: 1` is the accepted-result version. Each
  witness names one criterion, and nothing in the contract groups criteria
  into a scenario.
- Both files are registered evidence sources in every edition and sources
  the feedback verifier judges (`scripts/lib/evidence-sources.mjs` and
  `packages/skeleton/src/feedback-audit.ts` at `5f3849ec`).

**Design (scope discipline):**

- The claim types and witness kinds are additive enum members in the
  compiler's contract and in the skeleton's result schema.
- The three rules are admission rules in `parseEvidenceResult`, beside
  "unsupported pass" and "contradictory witness", each with a named
  refusal: a `pass` for a visual criterion needs a passing `screenshot`
  bound to it among the evidence it cites; a `pass` for a network
  criterion needs a passing `network-trace` bound to it; a
  `console-capture` holding an error is an adverse witness for the
  criterion and required check it is bound to. A refused pass leaves the
  row as it was, and an admitted `unverified` leaves it `incomplete`,
  which is how the objective's `unverified` shows in the matrix.
- A scenario's criteria are the ones its witnesses name: because a witness
  names one criterion, a producer binds one `console-capture` to each
  criterion a scenario covers.
- The contract stays `verification-v1` when every recorded capsule and
  stream still replays and no existing capsule lowers to different bytes,
  as an absent optional member emits none; otherwise it becomes
  `verification-v2` with the migration noted. The executor decides by
  that test and records it with the compiler and skeleton releases; the
  accepted-result version is a separate axis.
- The fixtures build subjects without the `worktree-snapshot` profile,
  which keeps admitting live behavior criteria with host-run tests only.
- A witness of a kind the contract does not declare, or a criterion typed
  outside the four claim types, refuses at decode with its schema path; an
  `unavailable` witness supports no pass, as today.
- Witness objects are plain data with hashes; no browser code in the
  compiler.
- **Declined alternatives, recorded:** a free-form evidence kind (the fold
  could not judge it); OCR-derived witnesses (out of scope); a fold or a
  host override that derives a verdict from witnesses (product 02 admits
  acceptance only from a host-admitted verifier result; reopen when it
  admits another source); a scenario field grouping criteria in the
  contract (reopen when a producer cannot name a scenario's criteria when
  it captures).

**Deliverables:** the contract extension, the admission rules, fixtures,
the re-mints, the write-backs below.

**Acceptance criteria (all required)**

1. A visual criterion whose cited evidence holds only `dom-snapshot` and
   `accessibility-snapshot` witnesses cannot become `verified`: a `pass`
   is refused with its named reason and an `unverified` is admitted; with
   a passing `screenshot` bound to its id, a `pass` is admitted under the
   existing rules.
2. A network criterion without a passing `network-trace` bound to it
   cannot become `verified` in the same way; with one, a `pass` is
   admitted.
3. A `console-capture` witness holding an error, bound to a criterion and
   one of its required checks, refuses a `pass` for that criterion whether
   or not the pass cites it, admits a `fail` that cites it, and an
   implementer-authored event cannot relabel the row (the existing matrix
   rule). A fixture scenario over two criteria binds one capture to each,
   and both behave so. The criterion is judged against the fixtures of
   criteria 1 to 3; a case outside them is a follow-up, not a failure.
4. A witness of an undeclared kind and a criterion typed outside the four
   claim types each refuse at decode with the schema path. Every recorded
   capsule and stream the verification suites replay, WO-010's among them,
   still replays, and every existing compiler and skeleton verification
   test passes unchanged; the contract-version decision follows the
   Design's test and is recorded in 10 with the compiler and skeleton
   releases.
5. Write-backs land, each in place with no dated paragraph: 02
   §Independent verification v1 (the claim types, the witness kinds and
   the rules, in place of the deferral and the type lists they amend; at
   most 800 bytes added, against 2,776 bytes of headroom on 2026-09-28;
   WO-065 and WO-066 also write 02, so the executor re-measures the
   headroom at its base, and where the bound does not fit it consolidates
   the section it edits in the same change; a ceiling is raised only by a
   planning-document decision) and 10 §Separate version axes (the contract
   axis and the two releases; at most 200 bytes, against 507 bytes of
   headroom on 2026-09-28; WO-060 adds up to 300 bytes to the same section
   and WO-086 writes 10 before this order, under the same rule); the
   decisions file; the publication locks refreshed.
6. The authority, artifact-identity, verification and harness editions
   this order stales are re-minted deterministically and the console is
   re-pinned with its self-host fixtures; the decisions record each. After
   the last edit to a judged source the executor re-mints the feedback
   edition from one live self-host episode on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`; the decisions record the
   configuration. A repair that edits a judged source again runs another
   the same way.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; kernel unchanged.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`packages/compiler/src/verification.ts` and
`packages/skeleton/src/verification-protocol.ts` are declared sources of
the five evidence suites, and again at final review. The live row is the
executor's feedback self-host episode.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the adapter that produces the witnesses (WO-059); a browser
dependency; changing behavior claims; the `worktree-snapshot` profile,
which keeps admitting live behavior criteria with host-run tests only; a
verdict derived from witnesses without a verifier's evaluation.

**Operator-review assumptions**

1. Contract version `verification-v1` with a compatible extension is
   acceptable; the reviewer may require `verification-v2`.
