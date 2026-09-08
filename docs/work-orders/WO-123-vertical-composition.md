# WO-123 — `dotln vertical` composition: the vertical continuation sequences the loop's primitives from a filed intent to a terminal pull-request state with each step's receipt, entered by the resident under standing authorization or by one command, proven with doubles (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One continuation with two entries, one
admission decision, one portfolio class and one command; no new primitive.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 10): the loop proof combined composition code with the
final live proof; and the first refutation receipt of this pass
([2026-09-08-critical-path-002](../planning/refutations/2026-09-08-critical-path-002.md),
hold on criterion 1): a command-only fixture could pass while WO-118's
one-intent resident run had no admission or scheduling path, so the
resident-entered run is the acceptance path. Planner-synthesized draft; the
captures' hashes are in the ledger section of that date. Opaque identifier,
not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-052 merged (the source-change host); WO-054 and WO-055
merged (verification and repair); WO-059 merged (browser witnesses);
WO-061 and WO-062 merged (the contract from an issue); WO-124 merged
(surfaces from the contract); WO-064, WO-065 and WO-066 merged (delivery
and the pull-request loop); WO-068 merged (the resident that admits the
intent and dispatches the first step); WO-120 merged (the filed intent and
the derived order's durable identity); WO-100 merged (the portfolio
contract the `intent` class extends); WO-042 merged (admitted grants and
the effective envelope the run is bound to).
**Recommended placement:** after the primitives, WO-068, WO-100 and
WO-120; it adds the continuation, the admission decision and its events,
the `intent` portfolio class, the command, and fixtures with doubles and a
fake clock. A recommendation, not a dependency token.

**Cites (read these sections):** 12-workstream-application.md §One outcome
from request to return; 03-architecture.md §Operator-presence policy (the
resident's dispatch rules); `docs/work-orders/WO-100-preauthorized-portfolio.md`
(the portfolio contract); `docs/work-orders/WO-120-derived-work-identity.md`
(the draft an intent files); `docs/work-orders/WO-068-resident-host.md`
(the actor catalog and dispatch); the other orders named in Depends on.

**Objective:** The vertical continuation sequences: bundle (WO-062) →
contract (WO-061) → surfaces (WO-124) → derived order (WO-120) →
source-change episode (WO-052) → browser witnesses (WO-059) → verification
and repair (WO-054, WO-055) → lint and publish (WO-063, WO-064) →
observation and resolution (WO-065, WO-066) to a terminal state, recording
each step's receipt under the order. It has two entries that persist the
same continuation. The resident (WO-068) admits a filed intent (the draft
WO-120's `dotln intent` writes) when a portfolio entry of the `intent`
class (WO-100's contract, extended here by that one class) covers the
intent's target repository and surfaces ceiling and every remote effect the
continuation needs is covered by an admitted grant (WO-042, WO-064); it
persists the accepted contract and the continuation as events and
dispatches the first step itself, with no command and no manual activation.
`dotln vertical <issue>` enters the same continuation for an
operator-invoked run. An intent no standing authorization covers, one whose
surfaces exceed the ceiling, or one whose contract is ambiguous stays a
draft or returns `NeedsHuman` with the reason and dispatches nothing. The
order adds no primitive, and every step's failure is a typed stop with the
step named.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No command runs the loop end to end; each primitive has its own entry.
- Nothing lets the resident admit a filed intent under standing authority
  and schedule the loop's first step: the only unattended derivation
  (WO-100) consumes discovery candidates, and WO-118 composes without
  fixing the runtime (the first refutation receipt's largest gap).

**Design (scope discipline):**

- The continuation is in the executable subset so a killed host or a
  restarted resident resumes it at the step it reached; both entries
  persist the same program under the derived order's identity.
- `admitIntent(draft, portfolio, grants)` is pure: it returns the accepted
  contract binding or `NeedsHuman` with the reason, and the resident records
  the decision as an event (`IntentAdmitted` or `IntentHeld`) before the
  first `Invoke`. The `intent` portfolio class declares the target
  repository, the surfaces ceiling, the phase envelope and the budget;
  remote effects need the admitted grants; the derived order's envelope is
  the intersection of the portfolio, the phase and the grants, never wider
  (WO-042).
- **Declined alternatives, recorded:** a human activation step between the
  intent and the first dispatch on the resident path (that is WO-120's
  draft review, kept for every intent no authorization covers); the
  resident inferring authorization from the intent's text; a second
  continuation for the command path.

**Deliverables:** the continuation, the admission decision and its events,
the `intent` portfolio class, the command, fixtures with doubles and a fake
clock, the write-backs below.

**Acceptance criteria (all required)**

1. A resident integration fixture, with doubles for every external actor
   and a fake clock, starts from the same filed intent WO-120's
   `dotln intent` exposes, under an explicit standing authorization (a
   fixture portfolio entry of the `intent` class covering the target and
   the surfaces, and admitted fixture grants for the remote effects): the
   resident admits the intent with no `dotln vertical` invocation and no
   manual activation, persists the accepted contract and the vertical
   continuation as events, dispatches the first step itself, and runs to
   the terminal state writing one receipt per step; a resident restart
   after any step resumes the continuation at the next step under the same
   order and episode identities, and a fixture asserts the identities and
   that no step runs twice. In the same fixture an intent with no covering
   portfolio entry, one whose surfaces exceed the ceiling, and one whose
   contract compiles to `NeedsHuman` each stay a draft or return
   `NeedsHuman` with the reason, derive no order and dispatch nothing;
   negative fixtures assert that no dispatch event follows.
2. `dotln vertical <issue>` enters the same persisted continuation for an
   operator-invoked run and reaches the same terminal state with the same
   receipts; a kill after any step resumes at the next.
3. A failing step (a refused capsule, a lint refusal, a `NeedsHuman`) stops
   with the step named and no later step runs.
4. Write-backs land: 07 (the command; the `intent` portfolio class under
   §Operator resume phrases), 03 §Operator-presence policy (the resident's
   admission), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the live proof (WO-112); the resident-owned run from a
starter (WO-118); deriving work from discovery candidates (WO-100); the
human review of a draft no authorization covers (WO-120).

**Operator-review assumptions**

1. Doubles are sufficient for the composition; the live proofs follow.
2. Standing authorization for an intent is a portfolio entry plus admitted
   grants, both reviewed text; the reviewer may prefer a dedicated grant
   kind.
