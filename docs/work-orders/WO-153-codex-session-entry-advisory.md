# WO-153 — Codex session entry advisory: a Codex lifecycle dispatch whose harness session cannot begin prints a named advisory with the cause and still delivers its briefing and exit code, so a measurement concern never withholds an allocated report path after the control log has recorded the transition (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One catch around one call in the dispatch
command and one fixture; no hook, gate, schema, role-text or counter change.
Assigned at activation under the standing opt-out default.
**Cost:** adds one catch around the session-begin call in
`scripts/resume.mjs`, a named stderr advisory in the form the unbuilt-runtime
branch already prints, and one fixture beside the two WO-149 cases in
`scripts/test-process-debt.mjs`. Removes the recorded path in which a Codex
`next`, `fix`, `verify`, `final-review` or `release-close` whose session
begin throws for any reason other than the already-began refusal exits 1
after its transition has been appended, suppressing the briefing that carries
the allocated report path, which the role text then forbids repeating
(WO-149 D009; reproduced by probe with an invalid role, not yet observed in
a live dispatch). Wall-clock, tokens and context bytes of the order itself
are unknown until run.
**Nomination provenance:** WO-149 D009 (final review, 2026-09-21): "File a
work order that makes Codex dispatch session entry advisory rather than
refusing"; both independent planning receipts for WO-149 (022 and 023)
recorded under failure behavior that an unguarded failure would refuse
lifecycle work for a measurement concern and that the mechanism should log
and proceed with a cause code. WO-149 D001 rejected a catch in the executor
phase because it would hide invalid roles, missing identities and host
errors; this order keeps every failure visible in the advisory's text.
Planner-synthesized in the 2026-09-22 Entropy Reducer pass from the
follow-up register, withdrawn at the 100-order limit, and filed by the same day's REVIEW-002 pass when the operator directed that closed entries leave the sequence; both dispatches are captured verbatim in ignored intake
(SHA-256 in the ledger section). Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-149 merged (the begin call this order guards; closed,
v0.40.2).
**Recommended placement:** paired with WO-154 directly after WO-100 and
WO-064 and before WO-111 and WO-114 (the REVIEW-002 pass, 2026-09-22, at the operator's direction that closed entries leave the sequence). It edits `scripts/resume.mjs` and
`scripts/test-process-debt.mjs`; WO-154 edits the feedback self-host recorder,
its check and the registered-source list; the two share no file, neither depends
on the other, and only WO-154 re-mints the evidence editions. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-149",
    "relation": "satisfied-by-close",
    "reason": "the Codex session-begin call inside the dispatch command that this order guards"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/evidence/WO-149/decisions.md`
§WO-149-D001 (the design and its rejected catch) and §WO-149-D009 (the
reproduction, the line references, the rejected options and the reopening
condition); `scripts/resume.mjs` (the `codexDispatchRoles` branch, the
unbuilt-runtime advisory at the adjacent `else`, the handler whose
`releaseExecutorWriter` guard covers only implementation-ready and
repair-complete, and the `process.stdout.write(message)` after the `try`);
`packages/skeleton/src/harness-host.ts` (`beginHarnessSessionOnce`: only the
exact already-began message is absorbed); `scripts/test-process-debt.mjs`
(the WO-149 cases "a Codex lifecycle dispatch begins one measurable session
and preserves it on repeat" and "an unbuilt Codex dispatch reports the
missing runtime without blocking the lifecycle"); `scripts/lib/receipt-cost.mjs`
(the closed cause-code list, `no-session`); the WO-132 stand-down in
07-execution-guide.md (a lifecycle command is logged, never refused, by a
measurement concern); `docs/planning/refutations/2026-09-21-planning-9d2888b45f687bc6-022.md`
and `-1457ac11ba15715d-023.md` (the failure-behavior answers).

**Objective:** For each of the five Codex lifecycle dispatches, when
`beginHarnessSessionOnce` throws anything but the already-began refusal, the
dispatch writes one advisory to stderr in the established form, naming the
cause as the error's own message and ending with `process cost remains
unknown; cause no-session`, then prints its briefing and exits 0 exactly as
it does when the begin succeeds; the already-began case stays silent; a
successful begin is byte-identical to today; a dispatch without a thread
identity is unchanged. Nothing is retried, hidden or downgraded to an
unnamed unknown.

**Observed gap (dated 2026-09-21 by WO-149 D009; re-read 2026-09-22, `main`
at `4d52b540`):**

- The begin call sits after the case blocks that append the `verify`,
  `fix` and `final-review` transitions and before `process.stdout.write`,
  with no catch; a throw exits 1, suppresses the briefing with the allocated
  report path, and leaves a recorded transition the role text forbids
  repeating.
- The surrounding handler converts a post-transition failure into the
  "Completion recorded; final handoff failed" guidance only when
  `releaseExecutorWriter` is set, which happens in implementation-ready and
  repair-complete, not in any of the five Codex dispatches.
- The adjacent unbuilt-runtime branch already prints a named advisory and
  admits the dispatch; the WO-149 fixture asserts that branch exits 0 with
  `cause no-session`.
- `beginHarnessSessionOnce` absorbs only the exact string "Session already
  began; do not erase its observations" and rethrows everything else; the
  probe with an invalid role rethrew "Invalid harness session".

**Design (scope discipline):**

- Wrap only the begin call. On any error other than the absorbed
  already-began case, write `DotLn advisory: Codex session entry failed
  (<error message>); process cost remains unknown; cause no-session.` to
  stderr and continue; the message carries the cause verbatim so an invalid
  role, a missing identity or an unwritable store stays visible, which is
  what D001's rejection protected.
- The fixture forces a failure the host reports (an unwritable session
  root, or an invalid dispatch role injected through the fixture's own
  dispatch table) and asserts, for at least `next` and `verify` and by
  parameter for all five actions: exit 0, the briefing on stdout, the
  advisory on stderr with the cause, the appended transition intact, and a
  following usage readback of `unknown; cause no-session`; the two WO-149
  cases keep passing unchanged.
- **Declined alternatives, recorded:** retrying the begin (a second write to
  a store that just refused); the Copilot-style graceful unknown without a
  cause (WO-099 D035's rejection); leaving the throw (withholds the report
  path after a recorded transition); widening the five dispatches (receipt
  022's separate known issue, to be decided on its own evidence).

**Deliverables:** the catch and advisory; the fixture; the write-backs in
criterion 4.

**Acceptance criteria (all required)**

1. Under a forced begin failure, each of the five Codex dispatches exits 0,
   prints its briefing, and writes the advisory with the error's message and
   `cause no-session` to stderr; the recorded transition is intact and a
   usage readback reports `unknown; cause no-session`.
2. The already-began case remains silent and the repeat dispatch leaves the
   session record byte-identical; the no-thread case writes nothing; a
   successful begin is unchanged; the two WO-149 cases pass without edits.
3. The advisory's cause code is one the receipt cost line recognizes
   (`judgeCostLine` accepts `unknown; cause no-session`).
4. The decisions file records the sources and the reopening condition;
   `docs/evidence/WO-149/decisions.md` is not edited.
5. `npm test` green; `git diff --check` clean; no new dependency; the
   fixture's effect on the gate step count reported.

**Evidence gate:** the fixture transcript; `npm test` once at final review.
No live row: the failure has not been observed live, and a Codex dispatch
observed exiting non-zero from the entry call is the reopening observation.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** when sessions begin; the Claude hook and Copilot paths;
role text or the bundle; retries; the set of Codex dispatches that begin a
session; the counter sources.

**Operator-review assumptions**

1. An advisory that names the cause satisfies D001's visibility requirement;
   the dispatch is not refused for a measurement concern.
2. No live Codex run is required for a deterministic error path with a
   fixture.
