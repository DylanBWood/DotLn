# WO-051 decisions

## WO-051-D001 — A separate writer contract from observed launch rows

```json
{
  "id": "WO-051-D001",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Add a source-change request, environment validation and two fixed launch shapes beside the unchanged inspection contract; observe commits and denials at the host boundary.",
  "evidence": [
    "docs/work-orders/WO-051-source-change-transport-profile.md",
    "docs/discovery/writing-worker-smoke-2026-09-14.md",
    "packages/skeleton/src/worker-protocol.ts",
    "packages/skeleton/src/worker-transport.ts",
    "packages/skeleton/src/execution-environment.ts",
    "packages/skeleton/src/verification-protocol.ts",
    "packages/skeleton/src/worker-store.ts"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Inspection cannot exercise repo.write; WO-052, WO-122 and the first external source-change proof remain blocked." },
    { "option": "General tool-policy language or wildcard Bash patterns", "reason": "The observations support two bounded shapes, not a policy language or wildcard authority." },
    { "option": "Widen the inspection request or run in the launchpad checkout", "reason": "That would change existing consumers and mistake path instructions for worktree containment." },
    { "option": "Worker-authored commit metadata or commit messages", "reason": "Only host Git observations establish HEAD movement; the host owns message contents and attribution policy." },
    { "option": "Interactive approval or assumed Codex hooks", "reason": "X-U2 is ambiguous and X-W3 unavailable; construction must name and refuse those rows." }
  ],
  "reopenWhen": "WO-053's live proof contradicts a recorded launch row, a real target requires another command shape, or a host needs stronger isolation than worktree governance."
}
```

This advances critical-path gate D2 and the first external source change. The
existing inspection and Beacon contracts remain useful and retain their bytes.
Policy resistance/fixes that fail: match profile, WorkOrder operations and mount
authority rather than letting the transport widen them. Commons and escalation:
use deterministic subprocess fixtures, no live writing launch, new dependency,
hook or operator procedure. Drift: require real Git observations and explicit
unknown denial accounting, not self-reported success. Success to the successful:
compare both existing transports against their own rows without preferring one.
Shifting the burden: give the future host a reusable validated request instead
of recurring ad hoc launch assembly. Rule beating: test actual subprocess/Git
effects and full inspection argument bytes. Seeking the wrong goal: the result
enables source change; receipt volume is not the outcome. Naive Interventionism:
limit edits to the new branch and shared request routing/storage, and use scratch
repositories as the smallest useful probe. The sandbox is not the containment
boundary (C-W6, X-W6); target governance and post-exit checks belong to WO-052/053.

New inputs required by existing routing: `verification-protocol.ts` selects the
transport request/result union, and the worker store strictly decodes cached
envelopes. Existing worker fixtures and the evidence/release scripts supply
validation and required generated write-backs. `Current posture` in the order
refers to the security runbook's existing `Recorded host posture` section.

Actor correction, 2026-09-16: entry used the repository default Astra/max.
The operator then supplied GPT-6 Astra ultra (xhigh + workflows) until further
notice. Use that operator-attested selection for handoff; effective readback is
unavailable. This corrects the recorded selection, not account/tool settings.

## WO-051-D002 — Preserve the evidence boundary and stage the minor release

```json
{
  "id": "WO-051-D002",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Stage application v0.24.0 and skeleton 0.20.0, regenerate the harness pins and authority evidence, and create fresh deterministic feedback evidence while retaining the historical live edition until a new live audit is authorized and recorded.",
  "evidence": [
    "docs/work-orders/WO-051-source-change-transport-profile.md",
    "packages/skeleton/fixtures/wo051-inspection-baseline.json",
    "packages/skeleton/fixtures/wo051-writer-args.json",
    "packages/skeleton/fixtures/wo051-writer-wire.json",
    "packages/skeleton/test/writer.test.ts",
    "scripts/feedback-evidence.mjs",
    "docs/evidence/WO-051/feedback/feedback.json"
  ],
  "rejected": [
    { "option": "Treat a synthetic feedback run as live evidence", "reason": "The existing feedback checker requires an independent live verifier and rejects the fake transport; changing that rule is outside this order." },
    { "option": "Reuse the older live subject or silently launch a live worker", "reason": "Runtime source changed, and the work order explicitly says no live launch." },
    { "option": "Bump unchanged packages or overwrite historical editions", "reason": "Only skeleton source changed; historical observations must retain their original bytes." }
  ],
  "reopenWhen": "The operator authorizes the existing read-only feedback audit, independent verification finds a behavioral defect, or final integration advances the published release baseline."
}
```

The activation left a version placeholder rather than a strict version. Local
tags show v0.23.0, so apply the order's existing minor classification as v0.24.0
and align the README before the canonical release preparation. The helper then
confirms the target. Only skeleton changes to 0.20.0; no dependency is added.
The existing artifact and verification evidence checks pass byte-identically.
Authority output changes with the regenerated bundle, so file a fresh edition.

The environment module is now a runtime dependency of the writer protocol;
include it in the existing feedback source and evidence-source declarations.
The provided authority is checked for local allowances, required denials and
allow/deny conflicts, never created by the transport. Current temporal/resource
authorization remains the dispatch host's duty. Host-only observations extend
the writer envelope and the store's strict decoder; inspection bodies and full
argument arrays remain pinned to activation bytes.

Correction, 2026-09-16: the first writer parser inherited the inspection
parser's status string coercion, which admitted a JSON array. Require an actual
string in the new parser and cover the malformed array. The independent
read-only audit also found that optional local allowances needed denial and
envelope checks; validate all allowances and cover those refusals. Inspection
source remains byte-identical. The advisory audit did not act as the independent
work-order verifier.

Apply D001's goal/trap analysis to these corrections: real refusal behavior and
preserved authority beat permissive green fixtures; existing evidence machinery
and one changed component avoid a new process. The nine focused tests passed
in 4.28 seconds in this run, versus the order's approximate three-second fixture
estimate. This is fixture cost, not a measured improvement in operator flow.

## WO-051-D003 — Executor judgment resolves the routine feedback audit

```json
{
  "id": "WO-051-D003",
  "date": "2026-09-16",
  "dispatch": "resume: next; operator direction to decide and log routine workflow choices",
  "decision": "Run the established read-only feedback audit on the changed runtime and preserve WO-053 as the only live source-change smoke. Record this bounded interpretation for independent review instead of asking the operator to arbitrate it.",
  "evidence": [
    "docs/work-orders/WO-051-source-change-transport-profile.md",
    "scripts/feedback-evidence.mjs",
    "packages/skeleton/src/feedback-selfhost.ts",
    "docs/evidence/WO-051/decisions.md"
  ],
  "rejected": [
    { "option": "Pause for operator arbitration or leave the document check stale", "reason": "The operator explicitly directed executor judgment and later review; the existing read-only audit is necessary validation of the changed runtime." },
    { "option": "Launch the new writing profile live", "reason": "That remains WO-053's distinct product proof and is unnecessary to refresh the existing feedback audit." },
    { "option": "Weaken the evidence check", "reason": "The routine audit can establish current evidence without changing its acceptance rule." }
  ],
  "reopenWhen": "Independent review finds this bounded interpretation inconsistent with operator intent, or the audit requires effects beyond its existing read-only profile."
}
```

The operator corrected the executor's proposed request for intervention. The
decision now treats the no-live wording as fencing the new source-change proof,
while completing the established read-only feedback validation under the
operator's explicit direction. The earlier D002 pending interpretation remains
as history; it no longer blocks the audit. Model selection is the supplied
GPT-6 Astra ultra. This is a runtime feedback audit, not WO-051's independent
verification and not a live writer episode.

The first full product gate exposed a new architectural error: filesystem
preflight had entered the pure `execution-environment.ts` module. Stop the gate
before edits, retain the pure profile union there, keep request validation pure,
and put filesystem/Git observations in `source-change-environment.ts`, called
only by the transport host. The existing pure-reactor fixture remains unchanged.
The new host module joins the feedback/evidence source declarations. The first
feedback report is preserved; a second edition records the corrected subject.
The same gate observed the existing native script fixtures' explicit need for
an outside-sandbox runner; use the host permission path for the final gate.

D001's goal/trap comparison applies. The correction restores an existing useful
boundary without weakening its test. Completing the routine read-only audit
removes operator intervention, preserves meaningful evidence and adds no new
gate or policy. NoOp would leave either the architectural regression or stale
evidence; broad live writing or a new evidence exemption adds unnecessary scope.

Outcome, 2026-09-16: corrected writer/reactor checks passed all 36 tests; the
final full product gate passed 19 suites, 0 failures and 63 fresh tasks in
259.41 seconds. The existing read-only feedback audit completed with ten
fixtures and its independent verifier; revision 002 preserves the final source
identity and recorded event streams. The current selector now points to that
edition. No live source-change worker was launched. The choice removed the
unnecessary operator arbitration while preserving the evidence check and the
separate WO-053 proof obligation; independent verification/review still judge it.
