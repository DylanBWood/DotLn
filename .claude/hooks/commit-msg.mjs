// Origin: {"ids":["no-attribution"],"loadoutId":"contributor","semanticHash":"fnv1a64:f7e29ff3f4ede75c"}
const { runCommitMessageHook } = await import("../../.runtime/harness/01fbc22957655b21/packages/skeleton/dist/src/harness-host.js");
const { feedbackBoundary } = await import("../../.runtime/harness/01fbc22957655b21/packages/skeleton/dist/src/feedback-boundary.js");
await runCommitMessageHook({
  "compilerPackageVersion": "0.11.1",
  "runtime": {
    "skeletonVersion": "0.18.1",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/artifact-identity.js",
        "hash": "fnv1a64:de7ebb5d6ad7243c"
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
        "hash": "fnv1a64:e057b4f5b19338d4"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:d3696a82e454ead0"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:52bc0be53a929a4f"
      },
      {
        "path": "packages/skeleton/dist/src/gate-deadlines.mjs",
        "hash": "fnv1a64:fed0ae4064c93d4a"
      },
      {
        "path": "packages/skeleton/dist/src/usage-observation.mjs",
        "hash": "fnv1a64:4f3d424f0ca3725e"
      },
      {
        "path": "packages/skeleton/dist/src/writer-teardown.mjs",
        "hash": "fnv1a64:02ec5d2fc0848e9d"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:d0b95cfe4ad92ec2"
      }
    ],
    "snapshot": ".runtime/harness/01fbc22957655b21"
  },
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.11.1",
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
    "policyHash": "fnv1a64:899ed2d96c78c740"
  }
}, feedbackBoundary);
