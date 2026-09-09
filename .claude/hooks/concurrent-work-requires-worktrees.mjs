// Origin: {"ids":["concurrent-work-requires-worktrees"],"loadoutId":"contributor","semanticHash":"fnv1a64:709272ae4905aaa6"}
try {
const { feedbackBoundary } = await import("../../packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.8.0",
  "runtime": {
    "skeletonVersion": "0.14.0",
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
        "hash": "fnv1a64:589298d41425851a"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:ac4af55f5c7ef6c5"
      }
    ]
  },
  "event": "PreToolUse",
  "kind": "feedback",
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.8.0",
    "units": [
      {
        "unitId": "concurrent-work-requires-worktrees",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The implementation discipline and concurrent workflow rules require a verified worktree and one writer per worktree.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not dispatch a writer into main, a mismatched repository root, or a worktree occupied by another writer.",
        "desiredBehavior": "Resolve physical cwd and Git root and require exactly one registered writer for that worktree before writable dispatch.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "writer-isolation",
        "mechanism": {
          "handler": "writer-isolation",
          "version": 1,
          "rationale": "A pre-dispatch invariant checks current host facts; a static repository test cannot see live writer reservations."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "host-writer-reservations",
          "resolved-cwd-and-root"
        ],
        "regressionFixtures": [
          "WO-011 regression concurrent-work-requires-worktrees"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not dispatch a writer into main, a mismatched repository root, or a worktree occupied by another writer. Resolve physical cwd and Git root and require exactly one registered writer for that worktree before writable dispatch."
      }
    ],
    "mechanisms": [
      {
        "unitId": "concurrent-work-requires-worktrees",
        "handler": "writer-isolation",
        "kind": "pre-effect-guard",
        "rung": 2,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:d4bdecd72ebec81d"
  },
  "correctionToken": null
}, feedbackBoundary);
} catch { process.stdout.write("{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"DOTLN_HARNESS_REFUSED: built adapter unavailable\"}}"); }
