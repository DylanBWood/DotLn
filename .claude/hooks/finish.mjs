// Origin: {"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.executor","contributor.planner","contributor.release-close","contributor.reviewer","contributor.verifier","correctness-over-sycophancy","fail-conservative-correction","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:709272ae4905aaa6"}
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
  "event": "Stop",
  "kind": "finish",
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.8.0",
    "units": [
      {
        "unitId": "anti-oscillation",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/evidence/WO-031/ideation.md",
            "docs/lineage/idea-ledger.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The publication correction rejected verbose titles, then rejected an invented length limit without restoring the original verbosity. WO-011 also distinguishes optional organization from a mandatory cleanup project.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not restore a rejected approach or turn an example into a new hard constraint when correcting behavior.",
        "desiredBehavior": "Preserve desired outcomes and rejection reasons; replacing a rejected decision needs explicit supersession from the operator.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "decision-lineage",
        "mechanism": {
          "handler": "decision-lineage",
          "version": 1,
          "rationale": "A pre-effect lineage guard compares explicit decisions; a text lint cannot decide which prior rejection applies."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "desired-outcomes",
          "operator-explicit-constraints",
          "rejected-approaches-and-reasons"
        ],
        "regressionFixtures": [
          "WO-011 regression anti-oscillation"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not restore a rejected approach or turn an example into a new hard constraint when correcting behavior. Preserve desired outcomes and rejection reasons; replacing a rejected decision needs explicit supersession from the operator."
      },
      {
        "unitId": "bounded-boy-scout-cleanup",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The recorded Boy Scout policy admits only unambiguous adjacent cleanup covered by the same verification; the operator's artifact-growth clarification also rejects cleanup without a demonstrated problem.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not expand into ambiguous, risky, unrelated, unverified, or retained-evidence cleanup merely because an adjacent item was noticed.",
        "desiredBehavior": "Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "cleanup-scope",
        "mechanism": {
          "handler": "cleanup-scope",
          "version": 1,
          "rationale": "A pre-effect gate checks a scoped host-reviewed assessment; scripts alone cannot establish semantic adjacency or risk."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "allowed-paths",
          "host-reviewed-assessment",
          "same-verification-checks"
        ],
        "regressionFixtures": [
          "WO-011 regression bounded-boy-scout-cleanup"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not expand into ambiguous, risky, unrelated, unverified, or retained-evidence cleanup merely because an adjacent item was noticed. Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately."
      },
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
      },
      {
        "unitId": "correctness-over-sycophancy",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The founding feedback-to-mechanism inventory assigns correctness-over-sycophancy to an evaluator and policy invariant.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not accept a preferred answer when independent evidence contradicts it or only implementer claims support it.",
        "desiredBehavior": "Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "evidence-judgment",
        "mechanism": {
          "handler": "evidence-judgment",
          "version": 1,
          "rationale": "An evidence evaluator is necessary for a claim about correctness; token or phrasing checks cannot establish truth."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "independent-witnesses",
          "subject-identity"
        ],
        "regressionFixtures": [
          "WO-011 regression correctness-over-sycophancy"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not accept a preferred answer when independent evidence contradicts it or only implementer claims support it. Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim."
      },
      {
        "unitId": "fail-conservative-correction",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/02-domain-model.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The recorded semantic correction policy tightens authority in response to typed operator correction events, not emotional wording.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not infer authority or a correction solely from surface language, or discard evidence when the operator reports a regression.",
        "desiredBehavior": "On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "semantic-correction",
        "mechanism": {
          "handler": "semantic-correction",
          "version": 1,
          "rationale": "A pure event reactor computes the monotone policy transition; a static guard cannot remember the correction across later effects."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "prior-authority",
          "typed-correction-event"
        ],
        "regressionFixtures": [
          "WO-011 regression fail-conservative-correction"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not infer authority or a correction solely from surface language, or discard evidence when the operator reports a regression. On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior."
      },
      {
        "unitId": "no-attribution",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/06-roadmap.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The founding mapping selects attribution settings plus a commit hook as defense in depth for the no-attribution requirement.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not append an AI coauthor trailer or generated-with footer to a commit or publication result.",
        "desiredBehavior": "Disable available automatic attribution in the invocation settings and reject matching AI trailers or footers at the publication boundary; preserve ordinary subject text and human coauthors.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "attribution",
        "mechanism": {
          "handler": "attribution",
          "version": 1,
          "rationale": "A deterministic footer/trailer predicate is sufficient; invocation settings reduce generation and the commit hook checks actual bytes."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "commit-message-bytes",
          "invocation-settings",
          "real-git-hook-result"
        ],
        "regressionFixtures": [
          "WO-011 regression no-attribution"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not append an AI coauthor trailer or generated-with footer to a commit or publication result. Disable available automatic attribution in the invocation settings and reject matching AI trailers or footers at the publication boundary; preserve ordinary subject text and human coauthors."
      },
      {
        "unitId": "no-lint-type-disables-as-fixes",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The anti-gaming verification requirement rejects lint-disables and type suppressions presented as repairs.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not make a repair appear green by adding lint or type suppression directives to code.",
        "desiredBehavior": "Compare source comment directives with the baseline and reject newly introduced suppressions while allowing unchanged historical directives and quoted examples.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "suppression-diff",
        "mechanism": {
          "handler": "suppression-diff",
          "version": 1,
          "rationale": "A deterministic source-diff check covers the declared directive vocabulary without a model episode."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "baseline-source",
          "candidate-source",
          "suppression-diff"
        ],
        "regressionFixtures": [
          "WO-011 regression no-lint-type-disables-as-fixes"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not make a repair appear green by adding lint or type suppression directives to code. Compare source comment directives with the baseline and reject newly introduced suppressions while allowing unchanged historical directives and quoted examples."
      },
      {
        "unitId": "no-partial-completion",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The session contract and completion gates require the bounded work order's evidence rather than an inferred success report.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not mark a partial result complete while required obligations or declared remaining work are unresolved.",
        "desiredBehavior": "Only admit completed status when the required obligation set is discharged and no remaining work is reported.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "complete-scope",
        "mechanism": {
          "handler": "complete-scope",
          "version": 1,
          "rationale": "A workflow transition gate checks the complete obligation set; a single successful check is not whole-order completion."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "discharged-obligations",
          "remaining-work",
          "required-obligations"
        ],
        "regressionFixtures": [
          "WO-011 regression no-partial-completion"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not mark a partial result complete while required obligations or declared remaining work are unresolved. Only admit completed status when the required obligation set is discharged and no remaining work is reported."
      },
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
      },
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
        "unitId": "anti-oscillation",
        "handler": "decision-lineage",
        "kind": "pre-effect-guard",
        "rung": 2,
        "enforcement": "hard"
      },
      {
        "unitId": "bounded-boy-scout-cleanup",
        "handler": "cleanup-scope",
        "kind": "pre-effect-guard",
        "rung": 2,
        "enforcement": "hard"
      },
      {
        "unitId": "concurrent-work-requires-worktrees",
        "handler": "writer-isolation",
        "kind": "pre-effect-guard",
        "rung": 2,
        "enforcement": "hard"
      },
      {
        "unitId": "correctness-over-sycophancy",
        "handler": "evidence-judgment",
        "kind": "evaluator",
        "rung": 5,
        "enforcement": "hard"
      },
      {
        "unitId": "fail-conservative-correction",
        "handler": "semantic-correction",
        "kind": "pure-reactor",
        "rung": 3,
        "enforcement": "hard"
      },
      {
        "unitId": "no-attribution",
        "handler": "attribution",
        "kind": "script",
        "rung": 1,
        "enforcement": "hard"
      },
      {
        "unitId": "no-lint-type-disables-as-fixes",
        "handler": "suppression-diff",
        "kind": "script",
        "rung": 1,
        "enforcement": "hard"
      },
      {
        "unitId": "no-partial-completion",
        "handler": "complete-scope",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "hard"
      },
      {
        "unitId": "read-your-own-output",
        "handler": "output-review",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "hard"
      },
      {
        "unitId": "verify-app-before-done",
        "handler": "application-evidence",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:b7415b98b50fc2ce"
  }
}, feedbackBoundary);
} catch { process.stdout.write("{\"decision\":\"block\",\"reason\":\"DOTLN_HARNESS_REFUSED: built adapter unavailable\"}"); }
