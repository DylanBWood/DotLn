# WO-149 — Codex sessions begin: a Codex-launched dispatch records its harness session before any usage is measured, so a Codex verification or review receipt carries real token counters instead of `unknown; cause no-session` (v0.40.2)

**Model:** any for the executor; the live row is one real Codex session.
State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. The dispatch path that Codex already
runs begins the harness session when the thread identity is present and no
record exists; one role-text sentence changes and the bundle is
regenerated. No hook, gate, key, receipt, schema or counter-format change.
Assigned at activation under the standing opt-out default.
**Cost:** adds one idempotent call inside the existing dispatch command
when `CODEX_THREAD_ID` is set and no session record exists, one fixture,
and no new command, hook, gate or receipt; role text changes by one
sentence, reported against the cold-start ceilings. Removes a structural
unknown measured repository-wide by WO-099 FINAL-001: `claude-code` 13 real
readings and 0 unknown, `codex-cli` 0 real readings and 8 unknown, so every
Codex receipt's cost line reads `unknown; cause no-session` and the meter's
per-harness comparison has no Codex column. Removes the operator rescue the
role text currently offers instead (running `harness begin` by hand).
Wall-clock, tokens and context bytes of the order itself are unknown until
run.
**Nomination provenance:** WO-099 D035 (final review, 2026-09-20): "needs
its own work order"; prefer beginning the session over the graceful unknown
Copilot has "because it yields real counters". WO-140 (the cost line, its
closed cause codes and the result-transition check). Planner-synthesized
in the 2026-09-21 standard pass; the dispatch is captured verbatim in
ignored intake (SHA-256 in the ledger section). Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-140 merged (the cost line contract and cause codes;
closed, v0.33.1); WO-146 (the Copilot graceful branch this order
deliberately does not copy; closed) for contrast only.
**Recommended placement:** its own one-entry slot directly after the
WO-147 and WO-148 pair. It may run in the second lane beside whichever of
those two is still open and must not make WO-120 or WO-063 wait; R2 may
recut it. It edits `scripts/resume.mjs` (the dispatch path),
`packages/skeleton/src/harness-host.ts` (`beginHarnessSession`,
`measureHarnessUsage`), `packages/skeleton/src/loadouts/contributor.ts`
(one sentence), the regenerated bundle and the security document. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-140",
    "relation": "satisfied-by-close",
    "reason": "the receipt cost line, its cause codes and the result-transition check"
  },
  {
    "workOrderId": "WO-146",
    "relation": "reference-only",
    "reason": "the Copilot graceful-unknown branch this order contrasts with"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/final-reviews/WO-099/FINAL-001.md`
(the repository-wide measurement and the `no-session` reasoning);
`docs/evidence/WO-099/decisions.md` §WO-099-D035;
`packages/skeleton/src/harness-host.ts` (`beginHarnessSession`: the state
record, its `UserPromptSubmit` input and the "Session already began"
refusal; `measureHarnessUsage`: the Copilot branch and the throw);
`packages/skeleton/src/usage-observation.mjs` (`codex-transcript-counter`,
`codex-session-readback`, the thread-id session key);
`scripts/resume.mjs` (the dispatch actions and the thread-identity branch);
`scripts/lib/receipt-cost.mjs` (the cause codes and the cost-line forms);
`docs/AI-HARNESS-SECURITY.md` §Harness version, model and effort readback;
`packages/skeleton/src/loadouts/contributor.ts` (the "Codex and Copilot can
use explicit begin/observe/delivered" sentence).

**Objective:** A Codex-launched lifecycle dispatch (`next`, `fix`,
`verify`, `final-review`, `release-close`, run under `CODEX_THREAD_ID`)
begins its harness session with the dispatch's role and the thread as the
session identity before any usage is read, once per thread: a repeated
dispatch in the same thread finds the record and leaves it untouched. After
that, `node scripts/harness.mjs usage <thread>` returns counters with their
source and cutoff from the Codex transcript, and the verification or
final-review report's line reads `**Process cost:** entry <n> tokens;
handoff <n> tokens; source <source>`. A dispatch with no thread identity
writes nothing and the line still reads `unknown; cause no-session`,
truthfully. Claude's hook-recorded sessions and Copilot's
`active-dispatch-unavailable` branch are unchanged.

**Observed gap (dated 2026-09-21, `main` at `502d85f9`):**

- `measureHarnessUsage` throws "Begin the harness session before measuring
  usage" unless a begun session record exists; the Claude hooks write that
  record at prompt submission; Copilot receives an advisory and an unknown
  observation; no Codex path calls `beginHarnessSession`, and the role text
  offers Codex an explicit `begin` nobody runs (WO-099 FINAL-001; the
  contributor loadout sentence).
- Repository-wide at that review: `claude-code` 13 real readings, 0
  unknown; `codex-cli` 0 real readings, 8 unknown. On WO-099 the four
  Codex-run verifications read unknown and the two Claude-run ones read
  counters.
- The usage observer already reads Codex transcripts
  (`codex-transcript-counter`, `codex-session-readback`) and keys sessions
  by `CODEX_THREAD_ID`; only the begun record is missing.

**Design (scope discipline):**

- Begin inside the dispatch command, the one place every Codex dispatch
  passes through, guarded by the thread identity and the absence of a
  record; the role is the dispatch's. Idempotent: the existing "Session
  already began" refusal is read as "nothing to do" on this path and is
  never raised to the operator. No authorship adoption by default;
  authorship observation starts at begin, as it does for Claude.
- **Declined alternatives, recorded:** the Copilot-style graceful unknown
  (hides a fixable gap and keeps the Codex column empty; D035's own
  rejection); asking the operator to run `harness begin` by hand (the
  recurring rescue this order removes); a Codex hook (none exists;
  product 07's Codex residue records that no project hook fires).

**Deliverables:** the dispatch-path change; the fixture; the role-text
sentence and regenerated bundle; the write-backs in criterion 4.

**Acceptance criteria (all required)**

1. Fixture: a dispatch under a synthetic `CODEX_THREAD_ID` with no record
   creates the session record with the dispatch's role and start time; a
   second dispatch in the same thread leaves it byte-identical and raises
   nothing; without the variable no record is written and `harness usage`
   reports `unknown; cause no-session`.
2. Fixture: after begin, `measureHarnessUsage` over the recorded Codex
   transcript rows the usage tests already use returns counters with their
   source and cutoff, and the receipt cost-line check accepts the resulting
   line.
3. Live row (one real Codex session, outside `npm test`): this order's
   verification runs in Codex and its VER report's cost line carries
   counters with their source; if the operator verifies elsewhere, one
   Codex dispatch of a fixture order records the same line in the evidence
   directory.
4. Write-backs land: the security document §Harness version, model and
   effort readback (Codex sessions begin at dispatch); the loadout sentence
   and regenerated role text, with the per-role cold-start bytes reported
   against the ceilings; the decisions file.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts and the live row; `npm test`
once at final review.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** Copilot's route; dollars from tokens (unset budgets stay
unset); a Codex hook; per-role budget enforcement; the reviewer's
release-prepare ordering (WO-110 D013) and the meter's hedge matching
(WO-140 D007), which stay with their own reopening observations.

**Operator-review assumptions**

1. The verification of this order runs in Codex so the receipt is the live
   row.
2. `CODEX_THREAD_ID` is the session identity, as `harness scratch` and the
   usage observer already assume.
