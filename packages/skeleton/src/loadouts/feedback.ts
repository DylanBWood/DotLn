import {
  compileFeedbackUnits,
  type FeedbackHandler,
  type FeedbackUnit,
} from "@dotln/compiler";

const lineage = "docs/lineage/idea-ledger.md";
function unit(
  unitId: string,
  handler: FeedbackHandler,
  sourceRefs: readonly string[],
  summary: string,
  undesiredBehavior: string,
  desiredBehavior: string,
  rationale: string,
  requiredEvidence: readonly string[],
): FeedbackUnit {
  return {
    unitId,
    version: 1,
    incident: {
      sourceRefs,
      sourceTreatment: "synthesized-from-public-lineage",
      summary,
      retainedSource: "public-reference",
    },
    undesiredBehavior,
    desiredBehavior,
    scope: ["personal-profile", "equipped-feedback-host"],
    trigger: handler,
    mechanism: { handler, version: 1, rationale },
    enforcement: "hard",
    requiredEvidence,
    regressionFixtures: [`WO-011 regression ${unitId}`],
    conflicts: [],
    supersedes: [],
    retirementCondition:
      "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
    nextMaturityCondition:
      "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
    proseEquivalent: `${undesiredBehavior} ${desiredBehavior}`,
  };
}

/** Exactly WO-011's ten units. Source accounts stay at their canonical references. */
export const retainedFeedbackUnitsV1: readonly FeedbackUnit[] = [
  unit(
    "anti-oscillation",
    "decision-lineage",
    [lineage, "docs/evidence/WO-031/ideation.md"],
    "The publication correction rejected verbose titles, then rejected an invented length limit without restoring the original verbosity. WO-011 also distinguishes optional organization from a mandatory cleanup project.",
    "Do not restore a rejected approach or turn an example into a new hard constraint when correcting behavior.",
    "Preserve desired outcomes and rejection reasons; replacing a rejected decision needs explicit supersession from the operator.",
    "A pre-effect lineage guard compares explicit decisions; a text lint cannot decide which prior rejection applies.",
    [
      "desired-outcomes",
      "rejected-approaches-and-reasons",
      "operator-explicit-constraints",
    ],
  ),
  unit(
    "correctness-over-sycophancy",
    "evidence-judgment",
    [lineage],
    "The founding feedback-to-mechanism inventory assigns correctness-over-sycophancy to an evaluator and policy invariant.",
    "Do not accept a preferred answer when independent evidence contradicts it or only implementer claims support it.",
    "Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim.",
    "An evidence evaluator is necessary for a claim about correctness; token or phrasing checks cannot establish truth.",
    ["independent-witnesses", "subject-identity"],
  ),
  unit(
    "fail-conservative-correction",
    "semantic-correction",
    [lineage, "docs/product/02-domain-model.md"],
    "The recorded semantic correction policy tightens authority in response to typed operator correction events, not emotional wording.",
    "Do not infer authority or a correction solely from surface language, or discard evidence when the operator reports a regression.",
    "On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior.",
    "A pure event reactor computes the monotone policy transition; a static guard cannot remember the correction across later effects.",
    ["typed-correction-event", "prior-authority"],
  ),
  unit(
    "verify-app-before-done",
    "application-evidence",
    [lineage, "docs/product/01-principles.md"],
    "The lineage records verification becoming an optional question even though live behavior was already part of the completion contract.",
    "Do not call an application change done from prose, a skipped check, an old revision, or a failing executable check.",
    "Require executed passing checks for every required application check at the current subject before the completion transition.",
    "A workflow gate consumes executable evidence at completion; a one-time test alone cannot prevent a later unsupported done transition.",
    ["required-checks", "executed-results", "subject-identity"],
  ),
  unit(
    "no-attribution",
    "attribution",
    [lineage, "docs/product/06-roadmap.md"],
    "The founding mapping selects attribution settings plus a commit hook as defense in depth for the no-attribution requirement.",
    "Do not append an AI coauthor trailer or generated-with footer to a commit or publication result.",
    "Disable available automatic attribution in the invocation settings and reject matching AI trailers or footers at the publication boundary; preserve ordinary subject text and human coauthors.",
    "A deterministic footer/trailer predicate is sufficient; invocation settings reduce generation and the commit hook checks actual bytes.",
    ["commit-message-bytes", "invocation-settings", "real-git-hook-result"],
  ),
  unit(
    "concurrent-work-requires-worktrees",
    "writer-isolation",
    [lineage, "docs/product/07-execution-guide.md"],
    "The implementation discipline and concurrent workflow rules require a verified worktree and one writer per worktree.",
    "Do not dispatch a writer into main, a mismatched repository root, or a worktree occupied by another writer.",
    "Resolve physical cwd and Git root and require exactly one registered writer for that worktree before writable dispatch.",
    "A pre-dispatch invariant checks current host facts; a static repository test cannot see live writer reservations.",
    ["resolved-cwd-and-root", "host-writer-reservations"],
  ),
  unit(
    "no-lint-type-disables-as-fixes",
    "suppression-diff",
    [lineage],
    "The anti-gaming verification requirement rejects lint-disables and type suppressions presented as repairs.",
    "Do not make a repair appear green by adding lint or type suppression directives to code.",
    "Compare source comment directives with the baseline and reject newly introduced suppressions while allowing unchanged historical directives and quoted examples.",
    "A deterministic source-diff check covers the declared directive vocabulary without a model episode.",
    ["baseline-source", "candidate-source", "suppression-diff"],
  ),
  unit(
    "read-your-own-output",
    "output-review",
    [lineage, "docs/product/07-execution-guide.md"],
    "The implementer discipline requires reading the produced diff before reporting completion.",
    "Do not hand off an artifact that was never read back, or that changed after it was read.",
    "Bind each required output to a host-observed read of its current bytes before handoff; this witnesses delivery to the reader, not comprehension.",
    "A handoff gate compares read receipts and current content identities; prose cannot witness that the bytes were delivered.",
    ["current-output-identities", "host-read-receipts"],
  ),
  unit(
    "no-partial-completion",
    "complete-scope",
    [lineage, "docs/product/07-execution-guide.md"],
    "The session contract and completion gates require the bounded work order's evidence rather than an inferred success report.",
    "Do not mark a partial result complete while required obligations or declared remaining work are unresolved.",
    "Only admit completed status when the required obligation set is discharged and no remaining work is reported.",
    "A workflow transition gate checks the complete obligation set; a single successful check is not whole-order completion.",
    ["required-obligations", "discharged-obligations", "remaining-work"],
  ),
  unit(
    "bounded-boy-scout-cleanup",
    "cleanup-scope",
    [lineage, "docs/product/07-execution-guide.md"],
    "The recorded Boy Scout policy admits only unambiguous adjacent cleanup covered by the same verification; the operator's artifact-growth clarification also rejects cleanup without a demonstrated problem.",
    "Do not expand into ambiguous, risky, unrelated, unverified, or retained-evidence cleanup merely because an adjacent item was noticed.",
    "Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately.",
    "A pre-effect gate checks a scoped host-reviewed assessment; scripts alone cannot establish semantic adjacency or risk.",
    ["host-reviewed-assessment", "allowed-paths", "same-verification-checks"],
  ),
];

const proseHandlers = new Set<FeedbackHandler>([
  "decision-lineage",
  "evidence-judgment",
  "semantic-correction",
  "cleanup-scope",
]);
const stopHandlers = new Set<FeedbackHandler>([
  "application-evidence",
  "output-review",
  "complete-scope",
]);
const correctionUndesired =
  "Do not answer a correction with a sweeping generalization that extrapolates beyond the category the operator named into adjacent rules or file changes they never asked for, nor with an over-literal reading that strips the rule to its exact words and excludes obvious members of the same category.";
const correctionDesired =
  "Identify the category the operator is pointing at; stay inside it, neither widening nor shrinking it; when the boundary is genuinely unclear, ask one focused question instead of guessing in either direction; and pause to ask before any file action that goes beyond the literal correction.";
export const correctionExample =
  "Example: a correction about committing opaque identifiers includes hashes; hostnames do not belong to that category.";

/** Version-one values above remain available for replay, never co-equipped. */
export const personalFeedbackUnits: readonly FeedbackUnit[] =
  retainedFeedbackUnitsV1.map((unit): FeedbackUnit => {
    const prose = proseHandlers.has(unit.trigger);
    const advisory = prose || stopHandlers.has(unit.trigger);
    const attribution = unit.trigger === "attribution";
    if (!advisory && !attribution) return unit;
    const undesiredBehavior =
      unit.trigger === "decision-lineage"
        ? correctionUndesired
        : attribution
          ? "Do not append AI coauthors, generated-with footers, harness-suggested session trailers or session URLs to commits, PR titles or bodies, or release notes."
          : unit.undesiredBehavior;
    const desiredBehavior =
      unit.trigger === "decision-lineage"
        ? `${correctionDesired} ${correctionExample}`
        : attribution
          ? "Disable automatic attribution and reject AI trailers, footers and session links at publication; preserve human coauthors and ordinary subject text."
          : unit.desiredBehavior;
    return {
      ...unit,
      version: 2,
      undesiredBehavior,
      desiredBehavior,
      incident:
        unit.trigger === "decision-lineage"
          ? {
              ...unit.incident,
              sourceRefs: [
                lineage + "#2026-09-09-emergency-process-debt-planning-pass",
                "docs/work-orders/WO-126-process-debt.md",
              ],
              summary: `The operator's 2026-09-09 planning pass recorded ten category-boundary corrections. ${correctionExample}`,
            }
          : unit.incident,
      mechanism: {
        ...unit.mechanism,
        version: 2,
        ...(prose
          ? {
              kind: "prose" as const,
              rationale:
                "Session judgment supplies this rule; it claims no executable host facts.",
            }
          : {}),
      },
      enforcement: advisory ? "advisory" : unit.enforcement,
      requiredEvidence: prose ? [] : unit.requiredEvidence,
      regressionFixtures: [`WO-126 ${unit.unitId} version 2`],
      supersedes: [`${unit.unitId}@1`],
      proseEquivalent: `${undesiredBehavior} ${desiredBehavior}`,
    };
  });

export const personalFeedback = () =>
  compileFeedbackUnits(personalFeedbackUnits);

/** Lifecycle boundaries retain hard evidence checks; Stop only advises. */
export const lifecycleFeedback = () =>
  compileFeedbackUnits(
    personalFeedbackUnits
      .filter((unit) => stopHandlers.has(unit.trigger))
      .map((unit) => ({ ...unit, enforcement: "hard" })),
  );

/** Command-scoped settings only. No user, account, or repository setting is installed. */
export const feedbackClaudeSettings = {
  autoMemoryEnabled: false,
  attribution: { commit: "", pr: "", sessionUrl: false },
} as const;
