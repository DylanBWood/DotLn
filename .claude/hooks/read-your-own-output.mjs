// Origin: {"ids":["read-your-own-output"],"loadoutId":"contributor","semanticHash":"fnv1a64:06245f5c581212f1"}
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
        "unitId": "read-your-own-output",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The implementer discipline requires reading the produced diff before reporting completion.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not hand off an artifact that was never read back, or that changed after it was read.",
        "desiredBehavior": "Bind each required output to a host-observed read of its current bytes before handoff; this witnesses delivery to the reader, not comprehension.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "output-review",
        "mechanism": {
          "handler": "output-review",
          "version": 1,
          "rationale": "A handoff gate compares read receipts and current content identities; prose cannot witness that the bytes were delivered."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "current-output-identities",
          "host-read-receipts"
        ],
        "regressionFixtures": [
          "WO-011 regression read-your-own-output"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not hand off an artifact that was never read back, or that changed after it was read. Bind each required output to a host-observed read of its current bytes before handoff; this witnesses delivery to the reader, not comprehension."
      }
    ],
    "mechanisms": [
      {
        "unitId": "read-your-own-output",
        "handler": "output-review",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:57276a560bbcf28f"
  },
  "correctionToken": null
}, feedbackBoundary);
} catch { process.stdout.write("{\"decision\":\"block\",\"reason\":\"DOTLN_HARNESS_REFUSED: built adapter unavailable\"}"); }
