// Origin: {"ids":["no-attribution"],"loadoutId":"contributor","semanticHash":"fnv1a64:f7e29ff3f4ede75c"}
const { runCommitMessageHook } = await import("../../.runtime/harness/bb9522b84d7a517d/packages/skeleton/dist/src/harness-host.js");
const { feedbackBoundary } = await import("../../.runtime/harness/bb9522b84d7a517d/packages/skeleton/dist/src/feedback-boundary.js");
await runCommitMessageHook({
  "compilerPackageVersion": "0.13.2",
  "runtime": {
    "skeletonVersion": "0.25.4",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/artifact-identity.js",
        "hash": "fnv1a64:16100fadee18e8a1"
      },
      {
        "path": "packages/compiler/dist/src/harness.js",
        "hash": "fnv1a64:1b5d5b86d6c43c6e"
      },
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:9f5023e4c2650af7"
      },
      {
        "path": "packages/compiler/dist/src/attribution.mjs",
        "hash": "fnv1a64:7a65d9bab4b81dda"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-boundary.js",
        "hash": "fnv1a64:7acece33d2f838f6"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-source-comments.js",
        "hash": "fnv1a64:6c6f7fcb7164891b"
      },
      {
        "path": "packages/skeleton/dist/src/harness-host.js",
        "hash": "fnv1a64:0a740ea4849f3425"
      },
      {
        "path": "packages/skeleton/dist/src/subagent-budget.js",
        "hash": "fnv1a64:c00708bd77ad0cdc"
      },
      {
        "path": "packages/skeleton/dist/src/observed-facts.js",
        "hash": "fnv1a64:30a0b40d09a87feb"
      },
      {
        "path": "packages/skeleton/dist/src/correction-observation.mjs",
        "hash": "fnv1a64:9de0f1abc1c9c83b"
      },
      {
        "path": "packages/skeleton/dist/src/source-change-command.js",
        "hash": "fnv1a64:cbd81fc0aefe372b"
      },
      {
        "path": "packages/skeleton/dist/src/source-change-state.js",
        "hash": "fnv1a64:c37242cb80738d4d"
      },
      {
        "path": "packages/skeleton/dist/src/version.js",
        "hash": "fnv1a64:ba11d284e8bb55a4"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:a1c88e12d5190b32"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:25ad613247462f69"
      },
      {
        "path": "packages/skeleton/dist/src/gate-deadlines.mjs",
        "hash": "fnv1a64:fed0ae4064c93d4a"
      },
      {
        "path": "packages/skeleton/dist/src/usage-observation.mjs",
        "hash": "fnv1a64:d3bbff22ad6be87f"
      },
      {
        "path": "packages/skeleton/dist/src/writer-teardown.mjs",
        "hash": "fnv1a64:02ec5d2fc0848e9d"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:2a365ded308bea88"
      },
      {
        "path": "packages/skeleton/dist/src/resident-state.js",
        "hash": "fnv1a64:c372057a15bf8b9e"
      },
      {
        "path": "packages/skeleton/dist/src/presence-signals.js",
        "hash": "fnv1a64:2c8021c360896c08"
      },
      {
        "path": "packages/skeleton/dist/src/presence-heartbeat.js",
        "hash": "fnv1a64:d34990f3e67a6180"
      },
      {
        "path": "packages/skeleton/dist/src/resident-store.js",
        "hash": "fnv1a64:93e60c5039cb7019"
      },
      {
        "path": "packages/skeleton/dist/src/worker-store.js",
        "hash": "fnv1a64:1f2a5e2018465c7c"
      },
      {
        "path": "packages/skeleton/dist/src/verification-protocol.js",
        "hash": "fnv1a64:0da60082a9fc97b8"
      },
      {
        "path": "packages/skeleton/dist/src/plan-refutation-protocol.js",
        "hash": "fnv1a64:4459130af8df4e73"
      },
      {
        "path": "packages/skeleton/dist/src/worker-protocol.js",
        "hash": "fnv1a64:e3973519ebd14935"
      },
      {
        "path": "packages/skeleton/dist/src/presence-machine.js",
        "hash": "fnv1a64:c85105aa1cd0ca7d"
      },
      {
        "path": "packages/skeleton/dist/src/actor-catalog.js",
        "hash": "fnv1a64:d538797ba6444ccd"
      },
      {
        "path": "packages/skeleton/dist/src/actor-contract.js",
        "hash": "fnv1a64:22aeca349f7a8c36"
      },
      {
        "path": "packages/skeleton/dist/src/cli-actor-contract.js",
        "hash": "fnv1a64:ce370df3be2d7ec5"
      },
      {
        "path": "packages/skeleton/dist/src/handoff-contract.js",
        "hash": "fnv1a64:91441a878612f03f"
      },
      {
        "path": "packages/skeleton/dist/src/work-candidate.js",
        "hash": "fnv1a64:74457672d9c64dae"
      },
      {
        "path": "packages/skeleton/dist/src/script-episode.js",
        "hash": "fnv1a64:0caaaebeeec6d655"
      },
      {
        "path": "packages/skeleton/dist/src/discovery-sandbox.js",
        "hash": "fnv1a64:9d809e99a432c81c"
      },
      {
        "path": "packages/skeleton/dist/src/discovery-actor.js",
        "hash": "fnv1a64:22d10e334cd2edfc"
      },
      {
        "path": "packages/skeleton/dist/src/discovery-cli.js",
        "hash": "fnv1a64:5206b2bb4f28940f"
      },
      {
        "path": "packages/skeleton/dist/src/discovery.js",
        "hash": "fnv1a64:6359806743e418ea"
      }
    ],
    "snapshot": ".runtime/harness/bb9522b84d7a517d"
  },
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.13.2",
    "units": [
      {
        "unitId": "no-attribution",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/06-roadmap.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The founding mapping selects attribution settings plus a commit hook as defense in depth for the no-attribution requirement.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not append AI coauthors, generated-with footers, harness-suggested session trailers or session URLs to commits, PR titles or bodies, or release notes.",
        "desiredBehavior": "Disable automatic attribution and reject AI trailers, footers and session links at publication; preserve human coauthors and ordinary subject text.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "attribution",
        "mechanism": {
          "handler": "attribution",
          "version": 2,
          "rationale": "A deterministic footer/trailer predicate is sufficient; invocation settings reduce generation and the commit hook checks actual bytes."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "commit-message-bytes",
          "invocation-settings",
          "real-git-hook-result"
        ],
        "regressionFixtures": [
          "WO-126 no-attribution version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "no-attribution@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not append AI coauthors, generated-with footers, harness-suggested session trailers or session URLs to commits, PR titles or bodies, or release notes. Disable automatic attribution and reject AI trailers, footers and session links at publication; preserve human coauthors and ordinary subject text."
      }
    ],
    "mechanisms": [
      {
        "unitId": "no-attribution",
        "handler": "attribution",
        "kind": "script",
        "rung": 1,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:717f410b0f5357ab"
  }
}, feedbackBoundary);
