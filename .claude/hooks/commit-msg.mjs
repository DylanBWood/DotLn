// Origin: {"ids":["no-attribution"],"loadoutId":"contributor","semanticHash":"fnv1a64:709272ae4905aaa6"}
const { runCommitMessageHook } = await import("../../.runtime/harness/f6b4a241a99de4c0/packages/skeleton/dist/src/harness-host.js");
const { feedbackBoundary } = await import("../../.runtime/harness/f6b4a241a99de4c0/packages/skeleton/dist/src/feedback-boundary.js");
await runCommitMessageHook({
  "compilerPackageVersion": "0.9.0",
  "runtime": {
    "skeletonVersion": "0.15.0",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:4bdd1cdb762a966b"
      },
      {
        "path": "packages/compiler/dist/src/attribution.mjs",
        "hash": "fnv1a64:7a65d9bab4b81dda"
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
        "hash": "fnv1a64:ed54524039608488"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:7c2aa377e24dad66"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:d75b06aeb2034085"
      },
      {
        "path": "packages/skeleton/dist/src/usage-observation.mjs",
        "hash": "fnv1a64:80e01fab579951b9"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:ac4af55f5c7ef6c5"
      }
    ],
    "snapshot": ".runtime/harness/f6b4a241a99de4c0"
  },
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.9.0",
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
    "policyHash": "fnv1a64:33b32ba218b22f10"
  }
}, feedbackBoundary);
