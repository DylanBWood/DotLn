// Origin: {"ids":["verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:06245f5c581212f1"}
try {
const { feedbackBoundary } = await import("../../packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.7.0",
  "runtime": {
    "skeletonVersion": "0.13.0",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:dc9688aecc4cb056"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-boundary.js",
        "hash": "fnv1a64:7f0520a32e27dede"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-source-comments.js",
        "hash": "fnv1a64:6c6f7fcb7164891b"
      },
      {
        "path": "packages/skeleton/dist/src/harness-host.js",
        "hash": "fnv1a64:314cebd40278b35f"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:ac4af55f5c7ef6c5"
      }
    ]
  },
  "event": "Stop",
  "kind": "feedback",
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.7.0",
    "units": [
      {
        "unitId": "verify-app-before-done",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/01-principles.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The lineage records verification becoming an optional question even though live behavior was already part of the completion contract.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not call an application change done from prose, a skipped check, an old revision, or a failing executable check.",
        "desiredBehavior": "Require executed passing checks for every required application check at the current subject before the completion transition.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "application-evidence",
        "mechanism": {
          "handler": "application-evidence",
          "version": 1,
          "rationale": "A workflow gate consumes executable evidence at completion; a one-time test alone cannot prevent a later unsupported done transition."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "executed-results",
          "required-checks",
          "subject-identity"
        ],
        "regressionFixtures": [
          "WO-011 regression verify-app-before-done"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not call an application change done from prose, a skipped check, an old revision, or a failing executable check. Require executed passing checks for every required application check at the current subject before the completion transition."
      }
    ],
    "mechanisms": [
      {
        "unitId": "verify-app-before-done",
        "handler": "application-evidence",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:4acc7215ac1d08f7"
  },
  "correctionToken": null
}, feedbackBoundary);
} catch { process.stdout.write("{\"decision\":\"block\",\"reason\":\"DOTLN_HARNESS_REFUSED: built adapter unavailable\"}"); }
