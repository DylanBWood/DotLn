# WO-165 — The Entropy Reducer's route and its compiled authority agree: a route that cannot delegate no longer compiles a four-delegate fan-out, the lens briefs are rendered as the reviewer's own checklist, and the receipt describes the episode that ran (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. The compiled Entropy Reducer loadout
stops declaring a fan-out on routes without a delegate tool; the receipt
renderer stops describing one; one fixture. Assigned at activation under
the standing opt-out default.
**Cost:** adds a route-aware compile of the `fan-out-lens` support in
`packages/skeleton/src/loadouts/entropy-reducer.ts`, a checklist rendering
of the lens briefs, a receipt sentence that matches, and a fixture that
compiles the loadout for each pinned route and checks the authority
envelope, the residue and the receipt agree. Removes: the `delegate.readonly`
grant with `resourceLimits { delegates: 4 }` and the "compiled authority
lacks the delegates resource" refusal on routes that pass only Bash, Read,
Glob and Grep (`claude-cli-print`) or keep `multi_agent` disabled (Codex),
so every review and refutation since REVIEW-002 has carried and described a
fan-out it could not perform (REVIEW-003 ER3-003, minor, measured). The
design avoids feedback sources: the loadout is registered (authority
edition re-mints deterministically) but is not in `FEEDBACK_SOURCE_PATHS`;
if the executor finds `entropy-review-protocol.ts` or
`worker-transport.ts` must change, the feedback edition re-mints with one
live self-host episode and the decision says why. Wall-clock, tokens and
context bytes of the order itself are unknown until run.
**Nomination provenance:** REVIEW-003 finding ER3-003 (minor, measured,
survived REFUTATION-004) and its packet
`entropy-review-delegate-route-agreement`, accepted by the 2026-09-25
planning pass; no decision record in WO-151, WO-157 or the dispatch
planning documents selected a delegate-free route. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-151 merged (the dispatch command and the pinned routes;
closed, v0.42.0).
**Recommended placement:** paired with WO-164 directly after WO-070 and
WO-115. This order edits the Entropy Reducer loadout and the receipt
renderer in `scripts/lib/entropy-review.mjs`; WO-164 edits the console
collector, the status command and the release listing. Disjoint files;
neither depends on the other; only this order re-mints. Because WO-160
edits `entropy-review.mjs` and WO-159 edits `worker-transport.ts`, this
order runs after both close. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-151",
    "relation": "satisfied-by-close",
    "reason": "the dispatch command and the pinned routes this order makes agree with the compiled authority"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/instance/entropy-reducer/runs/REVIEW-003.md` (ER3-003 and the
packet's two consistent options) and `REFUTATION-004.md`;
`packages/skeleton/src/loadouts/entropy-reducer.ts` lines 35, 969, 1020,
1133 (the delegate grant and limit) and 1257 (the refusal);
`packages/skeleton/src/entropy-review-protocol.ts` line 31
(`ENTROPY_REVIEW_TOOLS`) and 238 (lens briefs required);
`packages/skeleton/src/worker-transport.ts` `entropyArgs` and lines
201–209 (Codex `multi_agent` disabled); `scripts/lib/entropy-review.mjs`
(the receipt's blinding and confinement sentences);
`docs/instance/entropy-reducer/REFUTATION-PLAN.md`.

**Objective:** the authority envelope, the residue and the receipt of an
Entropy Reducer episode describe the episode that ran.

**Observed gap (dated 2026-09-25, `main` at `fa9957f1`):** as ER3-003
states and the refuter reproduced: the compiled reviewer grants four
read-only delegates and refuses to compile without the resource; the
review profile names only Bash, Read, Glob and Grep and the print route
passes exactly those; the Codex route keeps `multi_agent` disabled; the
lens briefs are worked serially while the receipt describes a fan-out.

**Design (scope discipline):**

- Preferred: compile `fan-out-lens` only for a route that supplies a
  delegate tool; for the two pinned routes render the lens briefs as the
  reviewer's checklist inside the prompt, drop the delegate grant and
  limit from the compiled envelope, and make the receipt's confinement
  sentence say "lenses worked serially by the reviewer". The compiled
  identity changes and is recorded, as REVIEW-001's repair recorded its
  hash change.
- Alternative, only if the executor shows the preferred route cannot keep
  the protocol untouched: admit a read-only delegate tool on the print
  route under the same confinement and record delegates used against the
  maximum; this touches feedback sources and pays the live episode.
- A fixture compiles the loadout per route and asserts envelope, residue
  and receipt agree.
- **Declined alternatives, recorded:** leaving the description as is
  (a receipt that names a capability the episode lacked is the
  accessibility failure the platform lens names); removing the lens
  briefs (they are the review's structure).

**Deliverables:** the route-aware compile; the checklist rendering; the
receipt sentence; the fixture; decisions.

**Acceptance criteria (all required)**

1. For `claude-cli-print` and `codex-cli-exec` the compiled envelope
   carries no delegate grant or limit, the residue names no fan-out, and
   the receipt's confinement sentence matches; the fixture asserts all
   three per route.
2. The lens briefs appear in the reviewer prompt as a checklist and the
   dispatch protocol still refuses a request without them.
3. The compiled identity change is recorded with before and after hashes;
   a later `entropy review` runs end to end on the fake transport.
4. The authority edition re-mints deterministically; no feedback source
   changes, or the decision records why and the live episode is paid.
5. `npm test` and `npm run test:docs` green; `git diff --check` clean.

**Evidence gate:** the fixture transcript; the fake-transport run;
`npm test` at final review. No live row on the preferred route.

**Write-back duty:** decisions; `docs/instance/entropy-reducer/README.md`
gains the route statement.

**Non-goals:** a new review route; the reviewer's lens content; the
refutation plan's selection rule.

**Operator-review assumptions**

1. Serial lenses are acceptable for the pinned routes; a delegating route
   is a later decision.
