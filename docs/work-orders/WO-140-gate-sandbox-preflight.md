# WO-140 — Gate sandbox preflight and usage readback: `npm test` refuses inside a harness sandbox when a declared suite needs the outside, the briefing prints the session id and the usage command, and every new receipt's cost line carries counters or a cause code (v0.33.1)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier any; reviewer any.
**Release classification:** patch. The test runner's preflight, suite
declarations, the briefing, role text and one document check. Assigned at
activation under the standing opt-out default.
**Cost:** removes one failed sandboxed gate per attended verification
(observed: WO-121 VER-001 ran the gate twice inside the sandbox, 17 of 19
and 18 of 19, one failure being the genuine intermittent defect F1 and the
other the `.claude/hooks/**` denial, and did not itself run the gate
outside; VER-002 ran 18 of 19 inside before its passing outside run;
WO-049, WO-051, WO-052, WO-134, WO-122 and WO-121 VER-002 record their
passing gate outside the sandbox), 191 to 515 s of fresh gate wall-clock each
plus its diagnosis; removes the bare "unknown" default in cost lines (one
receipt since 2026-09-13 reports an entry measurement). Adds one preflight
check under a second, one `needs:` declaration per affected suite, one
distinct partial check identity, one briefing line, one closed cause-code
list and one document check; no gate, hook or recurring step.

**Nomination provenance:** the operator's messages 7 and 10 in the
2026-09-17 planning dispatch; `docs/final-reviews/WO-121/FINAL-001.md` F1
and `docs/final-reviews/WO-068/FINAL-001.md` (a nested `sandbox-exec`
refused inside the session sandbox); the control-segment measurement in the
[2026-09-17 pass](../planning/vision-into-use-2026-09-17.md) §9 and §10;
WO-126's process-cost contract. Planner-synthesized draft. Clean-room
screen: the operator's comparison with another setup carries no detail and
is not used.

**Depends on:** WO-132 merged (one product gate per order; closed); WO-133
merged (the operator-attested fallback; closed).

**Recommended placement:** pair 4 beside WO-055. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-132",
    "relation": "satisfied-by-close",
    "reason": "one product gate per order keyed by code identity"
  },
  {
    "workOrderId": "WO-133",
    "relation": "satisfied-by-close",
    "reason": "attestation keeps operator-supplied values"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/test-runner.mjs` (the suite table,
its `protects:` declarations and the check identity it records);
`packages/skeleton/src/gate-evidence.mjs` (`findGateCheck` matches the
`npm test` identity by code identity alone; `recordGateChecks`);
`scripts/lib/lifecycle-evidence.mjs` (the consumer); `scripts/harness-entry.mjs`
and `node scripts/harness.mjs usage`; `scripts/resume.mjs` (the briefing);
the verifier and reviewer skills; `docs/verifications/WO-121/VER-001.md`
and `VER-002.md`; `docs/final-reviews/WO-068/FINAL-001.md`;
07-execution-guide.md §Discipline and the shared Process Cost support text.

**Objective:** (a) A suite declares `needs: outside-sandbox` when it cannot
pass inside a harness sandbox for an environmental cause (regenerating hooks
under `.claude/hooks/`, a nested `sandbox-exec`, temporary-root cases the
sandbox denies); a failure inside the sandbox is never by itself a reason to
declare. The runner detects a harness sandbox, validates a recognized marker
with a denied-write probe, and, when any selected suite needs the outside,
refuses before running anything, naming the suites and printing the command
to run outside; `--inside-sandbox` runs the remaining suites, records the
check under the distinct identity `npm test -- --inside-sandbox` with the
excluded suites in the row and never under `npm test`, and no consumer of
product-gate evidence (`findGateCheck` for `npm test`, the lifecycle
transitions, pull-request publication, release close) accepts that row;
outside a sandbox nothing changes. (b) The briefing prints the session id
and the exact `node scripts/harness.mjs usage <session>` command; the
verifier and reviewer skills run the product gate outside the sandbox from
the start in an operator-attended session, and a resident-launched
verification runs the inside selection and records the exclusions as a
partial result. (c) Every new verification and final-review receipt's cost
line records the entry and handoff counters with their source, or exactly
one cause code from a closed list (`hooks-fallback`, `no-session`,
`harness-no-readback`), and the document check refuses a bare "unknown" in a
new receipt while every existing receipt still passes.

**Observed gap (dated 2026-09-17, `main` at `ec502c9`):**

- WO-121 VER-001 ran the gate twice inside the sandbox (17 of 19 and 18 of
  19; the `.claude/hooks/**` denial and the genuine intermittent defect F1)
  without an outside run of its own; VER-002 ran it once inside (18 of 19)
  and then outside; WO-049, WO-051, WO-052, WO-134 and WO-122 verifiers
  record their passing gate outside.
- The runner records every selection except `--only`, `--document` and
  `--machinery` under the `npm test` identity, and `findGateCheck` matches
  that identity by code identity alone, so a subset run recorded under it
  would be consumed as a complete gate.
- Of 196 control events recorded since 2026-09-13, 98 carry an attestation
  and 14 of those report an unknown model or effort, all before WO-133
  landed; usage counters appear in one receipt.
- The `usage` command needs a session id the session must find; the R1
  replan pass could not measure at all while its hooks ran in the fallback.

**Design (scope discipline):**

- The sandbox marker is recorded by a probe row first (an environment
  marker or a denied write to a known path); a recognized marker is
  validated by a denied-write probe before the preflight refuses, so a
  marker inherited by a run with the sandbox disabled does not refuse the
  outside run; an unrecognized sandbox fails open and the gate runs as
  today.
- Declarations are content, not version literals (WO-133's rule for suite
  selection).
- The cause codes are the three observed in the control segments; a new
  cause adds a code, never a free-text unknown.
- The skill lines raise the verifier's and reviewer's cold-start bytes; if a
  ceiling breaches, the order raises it by one 4 KB step in the same change
  with the rule named, or records the dated acceptance (07-execution-guide.md
  §Discipline, the cold-start rule), and never trims another rule to fit.
- **Declined alternatives, recorded:** running the gate outside
  automatically (the unsandboxed ask is the operator's); skipping the
  outside-only suites silently; a new receipt field beyond the cost line;
  a cost budget.

**Deliverables:** the preflight and declarations; the briefing line; the
skill text; the cause-code list and document check; fixtures; the
write-backs below.

**Acceptance criteria (all required)**

1. Inside a harness sandbox, `npm test` with a selection containing an
   outside-only suite refuses before any suite runs, naming the suites and
   the outside command; a recognized marker with the denied-write probe
   passing (the sandbox is not in force) does not refuse; with
   `--inside-sandbox` it runs the rest and records the check under
   `npm test -- --inside-sandbox` with the exclusions in the row; outside a
   sandbox behavior is unchanged.
2. A regression fixture proves that `findGateCheck(root, "npm test", …)`,
   the lifecycle transitions, pull-request publication and release close
   reject a partial `npm test -- --inside-sandbox` row at the same code
   identity, and that a full `npm test` row is still accepted.
3. The suites whose in-sandbox failures had an environmental cause (the
   `.claude/hooks/**` denial in WO-121, the nested `sandbox-exec` in WO-068)
   carry the declaration; a suite that failed inside for a defect (WO-121's
   F1) does not; a fixture runs the preflight against a fake sandbox marker.
4. The briefing prints the session id and the usage command; the verifier
   and reviewer skills say the gate runs outside from the start in an
   attended session and that a resident-launched verification records a
   partial result; the cause-code list is recorded in 07's Process Cost
   text.
5. `npm run test:docs` refuses a new VER or FINAL receipt whose cost line
   has neither counters nor a cause code; every existing receipt passes.
6. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated skills and bundle pass `harness check`.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** automatic unsandboxed execution; treating a partial run as
gate evidence anywhere; changing the gate's inventory or bands; cost
budgets; Codex readback beyond the cause code; retroactive edits to existing
receipts.

**Operator-review assumptions**

1. Failing open on an unrecognized sandbox is acceptable; it is today's
   behavior.
2. The cause-code refusal applies to new receipts only.
