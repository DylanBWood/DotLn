# WO-152 — Mission-check schema without duplicate ids: `missionReferenceIds` lists each clause id once, the emitted result schema carries no duplicate enum item, and a `claude-cli-print` mission check returns a judgment against a real bound store instead of failing before any model call (v0.41.1)

**Model:** any. The live row is one real `claude-cli-print` mission check.
State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One function deduplicates its output,
one regression is added, and the skeleton component version moves because
the emitted mission-check result schema changes (WO-148 D009's own reason
for not fixing it in flight). No verdict rule, resident-host, event, hook or
transport change. Assigned at activation under the standing opt-out default.
**Cost:** adds a first-seen-order deduplication inside `missionReferenceIds`,
one regression in `packages/skeleton/test/mission-check.test.ts`, a skeleton
component bump, and, because `packages/skeleton/package.json` is a registered
evidence source, one edition re-mint with one live feedback self-host episode
(WO-147 D010; that episode ran 320.6 s under WO-147), plus one live mission
check on the print transport. Removes the transport-specific refusal that
ends every `claude-cli-print` mission check after about 1.28 s before any
model call (WO-148 D009: the Claude CLI rejects the emitted JSON Schema
because the `contract-clause` reference enum carries every clause id twice),
which today leaves WO-100's resident and WO-111's hour with the Codex
transport as the only mission-check transport. Wall-clock, tokens and context
bytes of the order itself are unknown until run.
**Nomination provenance:** WO-148 D009 (`resume: next`, 2026-09-21):
"Deferred to a separate work order (queue item adjacent-0002)", with the
reproduction, the negative control and the reason it was not fixed in flight
(the schema is shared by every CLI worker request kind and needs its own
regressions, a component bump and its own classification). Planner-synthesized
in the 2026-09-22 Entropy Reducer pass from the follow-up register; the
dispatch is captured verbatim in ignored intake (SHA-256 in the ledger
section). Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-099 merged (the mission check and its result schema;
closed, v0.37.0); WO-148 merged (the bound store the live row is judged
against and the decision that boarded the defect; closed, v0.40.0).
**Recommended placement:** paired with WO-151 directly after WO-120 and
WO-063 and before WO-100 and WO-064, because WO-100's resident runs the
mission check on the transport the operator chooses at launch and WO-111's
hour runs it on its cadence. It edits
`packages/skeleton/src/mission-check-protocol.ts`,
`packages/skeleton/test/mission-check.test.ts`,
`packages/skeleton/package.json` and the re-minted editions; WO-151 edits
`scripts/entropy.mjs`, its library and test, the root `package.json`, the
instance guide and receipts. The two share no file and neither depends on
the other; both re-mint the evidence editions, and the second final review
re-mints them again on integration, as WO-147's did. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-099",
    "relation": "satisfied-by-close",
    "reason": "the mission check, its subject and its emitted result schema"
  },
  {
    "workOrderId": "WO-148",
    "relation": "satisfied-by-close",
    "reason": "the bound store the live row is judged against and the decision that boarded the defect"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/evidence/WO-148/decisions.md`
§WO-148-D009 (the reproduction, the CLI error text, the negative control,
the rejected options and the reopening condition);
`packages/skeleton/src/mission-check-protocol.ts` (`missionReferenceIds`,
lines 638–651: the concatenation of `subject.contract.clauses`, the story
contract's clauses and `subject.observation.contract.clauses`;
`missionCheckResultSchema`, lines 730–763: the `reference` and `evidence`
enums; `validateMissionCheckResult`: membership by `includes`);
`packages/skeleton/test/mission-check.test.ts` and `mission-check.fixture.ts`;
`packages/skeleton/src/mission-check-host.ts` (`buildMissionCheckRequest`);
`scripts/resident-bind.mjs` (the launch lines a bound store prints);
`docs/evidence/WO-147/decisions.md` §WO-147-D010 and
`scripts/lib/evidence-sources.mjs` (the edition duty for a registered
source); 03-architecture.md §Operator-presence policy (the mission check's
place); `docs/planning/refutations/README.md` (an external CLI launch needs
the operator's explicit request).

**Objective:** For an unchanged contract, the `contract-clause` reference
enum lists each clause id exactly once in first-seen order; for a contract
that changed mid-episode it still lists the old and the new ids; no enum in
the emitted `missionCheckResultSchema` (`reference` for the three finding
kinds, `evidence`) carries a duplicate item; the Claude CLI accepts the
schema; and one `claude-cli-print` mission check against a real bound store
returns a verdict recorded with its attestation. `validateMissionCheckResult`
accepts and refuses exactly what it does today.

**Observed gap (dated 2026-09-21 by WO-148 D009; re-read 2026-09-22, `main`
at `4d52b540`):**

- `missionReferenceIds` returns the contract's clause ids concatenated with
  the observation contract's clause ids; when the contract has not changed
  mid-episode, the ordinary case, the two lists are identical, and
  `missionCheckResultSchema` places the result straight into the `reference`
  enum, so every clause id appears twice.
- Reproduced against a real bound store: the Claude CLI exits 1 with no
  stdout and `--json-schema is not a valid JSON Schema: ... enum must NOT
  have duplicate items`; the transport records `transport-failed` after
  1.28 s. The same binary, model, effort and flags succeed on a trivial
  prompt without `--json-schema`, so the refusal is the schema. The same
  capsule judged on `codex-cli-exec` returned a verdict.
- The validator is unaffected (membership by `includes`), so the defect is
  invisible to every fixture that does not hand the schema to the Claude CLI.

**Design (scope discipline):**

- Deduplicate inside `missionReferenceIds`, preserving first-seen order, so
  the schema site and any later consumer see one list; leave
  `validateMissionCheckResult` untouched.
- The regression walks every enum of the emitted schema for the fixture
  subject with an unchanged contract and asserts no duplicate item, and for
  a subject whose observation contract differs asserts that both the old and
  the new clause ids are present once each; it fails against the current
  source.
- Bump the skeleton component; re-mint the authority and feedback editions
  with one live self-host episode, as WO-147 D010 requires for a registered
  source; record why each edition changed.
- The live row is one mission check through the print transport against a
  real bound store (WO-148's binding command), recorded with the CLI's
  model and effort readback, the verdict and the wall-clock; a failed run
  files its receipt and does not close the order.
- **Declined alternatives, recorded:** deduplicating only at the schema site
  (leaves the function's contract wrong for its next consumer); refusing the
  print transport in the bind (D009's own rejection: it hides a defect in
  code the bind does not own); leaving it (every print-mode mission check
  fails); generic schema linting across every request kind (nothing else is
  observed refused; reopen if another kind's schema is).

**Deliverables:** the deduplication; the regression; the component bump and
re-minted editions; the live row; the write-backs in criterion 4.

**Acceptance criteria (all required)**

1. `missionReferenceIds` returns each id once in first-seen order for the
   `contract-clause` kind; the `thesis` and `exclusion` kinds are unchanged.
2. Regression: the emitted schema for an unchanged-contract fixture subject
   has no duplicate item in any enum, and a changed-contract subject keeps
   both ids; the test fails with the deduplication removed.
3. Live row: one `claude-cli-print` mission check against a real bound
   store returns a verdict, recorded with the model and effort read back from
   the invocation and the wall-clock; the operator's authorization of the
   launch is in the decisions; a failure files its receipt and does not
   close the order.
4. The skeleton component version moves; the authority and feedback
   editions are re-minted with one live self-host episode and the reason
   each changed; the decisions file records the sources and the reopening
   condition; `docs/evidence/WO-148/decisions.md` is not edited.
5. `npm test` green; `git diff --check` clean; no new dependency; the
   fixture's effect on the gate step count reported.

**Evidence gate:** the regression transcript; the live receipt; the edition
re-mint record; `npm test` once at final review.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** mission-check verdict rules, structural findings or the
resident host; the Codex transport; other request kinds' schemas; a generic
schema validator in the transport; the `MissionSource` selection policy
(WO-099 D016).

**Operator-review assumptions**

1. A component bump is the right classification for a changed emitted
   schema, as D009 stated; the release stays a patch.
2. Activating this order authorizes one live print-transport mission check
   and one live self-host episode; both are recorded.
