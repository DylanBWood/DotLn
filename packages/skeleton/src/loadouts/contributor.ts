import {
  compileLoadout,
  requireCompiled,
  type AuthorityEnvelope,
  type CompiledProgram,
  type HarnessFacet,
  type HarnessProfile,
  type HarnessProgram,
  type HarnessRole,
  type LoadoutGraph,
} from "@dotln/compiler";
import { personalFeedbackUnits } from "./feedback.js";
import { harnessToolEffects } from "../harness-command.js";
import {
  defaultExecutorSupportIds,
  executorSupportIds,
  executorSupports,
  type ExecutorSupportSwitches,
} from "./executor-supports.js";
import { processCost } from "./process-cost.js";
import { goalAlignment } from "./goal-alignment.js";

const sharedSupports = [processCost, goalAlignment];
const sharedIds = sharedSupports.map((support) => support.supportFacetId);
const contributorSupports = [...executorSupports, ...sharedSupports];
export const defaultContributorSupportIds = [
  ...defaultExecutorSupportIds,
  ...sharedIds,
];
export type ContributorSupportSwitches = ExecutorSupportSwitches &
  Readonly<{ "process-cost"?: boolean; "goal-alignment"?: boolean }>;

const handlers = personalFeedbackUnits.map((unit) => unit.trigger);
const common = [
  "Resolve physical cwd and Git root before changing files or running Git commands. Work only in the selected worktree; one writable coding agent owns it.",
  "Run `npm run resume --silent -- status --json`; use its canonical selected order, phase, report paths, and legal actions. A stale Markdown projection is repaired only by the next legal transition.",
  "Status may name artifacts for other roles. Load a report only when this role's Read directives or the active order's citations select it; a path in status is metadata, not a read directive.",
  "Skills supply procedure, never authority or phase state. Preserve the operator's intent and work-order model/effort minimum. Never invent effective-session readback.",
  "Read: `@work-order`",
  "Read: `@citations`",
  "Read source and existing tests relevant to the order before changes. Scope those reads to `@subject-files`; unresolved paths remain a named input requirement.",
  "State-changing resume commands require one-invocation outside-sandbox approval in Codex; inspect the exact command, package mapping, and lifecycle-script diff first. `status`, `times`, and `next` need no Git escalation. Never repeat a recorded transition to repair a checkpoint warning.",
  "No branch commits before final review. Never reset, restore, clean, drop a stash, or discard intake. Preserve work through the canonical checkpoint and named recovery procedure if rollback is needed.",
  "Read: `@subject-files`",
  "Read: `package.json`",
  "Run `npm run work-orders -- index` after dispatch and after recording a result. The canonical evidence command refreshes owned projections before checking; lifecycle commands do not regenerate that index.",
  "Write durable product decisions to the cited product docs and `docs/evidence/WO-NNN/decisions.md`, naming the operator dispatch, evidence, alternatives and reopening condition. Run `npm run meta` to refresh the decisions index. The ledger is for operator ideation and planning synthesis only. For an order filed before 2026-09-09, a ledger-entry duty is discharged by its decisions file and index row; the work-order index marks this substitution. Record a correction the same day: what was misread, what was meant and what changed. Decided means sourced, not frozen; an order's non-goal fences that order alone.",
];
const actor =
  "Completion flags: `--harness <harness> --harness-version <version> --model <model> --effort <level> --source <self-reported|harness-readback|operator-attested>`. Use exposed values; an unknown required effort blocks the handoff. The repository's Codex default is GPT-6 Astra at max, operator-attested unless actual readback is exposed.";
const evidence =
  "Finish measurements, required generation, release preparation and authored reports before completion. Run only `npm run harness -- evidence` for the final full gate and diff check. After build, it prepares the work-order index, decisions, follow-ups and generated harness before fingerprinting; unchanged outputs are not rewritten. Immutable evidence, publication locks and release targets remain explicit inputs. It reuses current successes. A separate fast gate is for an explicit fresh measurement, not a turn-end obligation. Diagnose failures, then retry this command; preflights stop costly suites and passing source checks are retained. A failed verification or review needs its reproduction and `git diff --check`. Review this session's authored outputs at current bytes; inherited changes add no read obligation. Generated files and files over 64 KB owe their declared generation or validation check. Use `node scripts/harness.mjs read-output <path> --offset 0 --length 8192` for bounded delivery and follow nextOffset. Claude observes tool reads; Codex uses the explicit begin/observe/delivered adapter without claiming automatic hooks. Stop gives one advisory line and releases the writer; completion commands enforce the same evidence conditions.";
export const contributorRoles: readonly HarnessRole[] = [
  {
    facetId: "contributor.executor",
    name: "executor",
    description:
      "Execute the selected DotLn work order for resume: next or repair it for resume: fix; report read-only resume: status and resume: times.",
    intents: ["resume: next", "resume: fix", "resume: status", "resume: times"],
    feedbackHandlers: handlers,
    procedure: [
      "For resume: status or resume: times, resolve cwd and Git root, run the matching read-only command, report its observation, and stop. The remaining input and implementation procedure is for next or fix.",
      ...common,
      "For status or times, run the matching read-only command and report its observation; stop without a transition. For next, run `npm run resume -- next` and follow its emitted path. If closed, report other in-flight orders; only when none remain, give the exact printed worktree-start handoff.",
      "For fix, run `npm run resume -- fix`; read the original order and its named failure source. Repair only those obligations. A premature repair may reopen only while the unresolved failure source remains.",
      "Read: `@failure-report`",
      "Implement the complete bounded deliverable and its write-backs. Prepare its classified release with `npm run release -- prepare --local`; bump only changed components with their compatibility impact and retain all publication controls.",
      evidence,
      actor,
      "When green, record `npm run resume -- implementation-ready <actor-flags>` or `npm run resume -- repair-complete <actor-flags>`, then refresh the index and reread updated outputs in `@subject-files`. A repair is unfinished until repair-complete records. Report evidence, attestation, and limits; leave verification and final review to their separate dispatches.",
    ],
  },
  {
    facetId: "contributor.verifier",
    name: "verifier",
    description:
      "Independently verify the selected DotLn work order on resume: verify and file the allocated immutable VER report.",
    intents: ["resume: verify"],
    feedbackHandlers: handlers,
    procedure: [
      ...common,
      "Run `npm run resume -- verify`; write only the exact new VER path it allocates. Judge the original order and current subject against its acceptance criteria, reproducing consequential claims and checking earlier findings. Substantive implementation defects become findings for repair.",
      "Read: `@verification-reports`",
      evidence,
      actor,
      "Put exactly one `**Actor attestation:** {<normalized actor JSON>}` line beside the human actor prose in the allocated report; its bytes must agree with the completion flags. Report criterion, observed/expected, reproduction, evidence, severity and limits. Disclose any instrument under verification that also recorded this work.",
      "Record `npm run resume -- verification-result pass|fail <actor-flags>` only after the report and evidence exist; refresh the index and reread updated outputs in `@subject-files`. Never replace an older VER or edit implementation to turn your own verdict green.",
    ],
  },
  {
    facetId: "contributor.reviewer",
    name: "reviewer",
    description:
      "Perform DotLn final review for resume: final review; prepare and publish only the reviewed work-order branch on pass.",
    intents: ["resume: final review"],
    feedbackHandlers: handlers,
    procedure: [
      ...common,
      "Run `npm run resume -- final-review`; use the allocated FINAL path. Review the full subject diff and complete numbered verification sequence against the original order. Handle authorized integration, then rerun checks affected by integration.",
      "Read: `@verification-reports`",
      "Read: `docs/product/08-publication-compiler.md#PRs and commits`",
      evidence,
      actor,
      "Prepare the contained PR.md and five-section RELEASE-NOTES.md beside the report, using the current publication contract; use one physical line per prose paragraph. Write the PR title as a headline: one clause saying what changed for the reader and why it matters, the lede first, sized by its content and never by the previous title, with no implementation inventory, version list or repeated work-order prose. A relevant gitmoji shortcode belongs in the PR title; commit subjects stay plain and contain no AI attribution.",
      "Use exactly one `**Actor attestation:** {<normalized actor JSON>}` header matching the flags, then record `npm run resume -- final-review-result pass|fail <actor-flags>`, refresh the index and reread updated outputs in `@subject-files`. On failure, stop with findings. On pass, inspect each staged diff and commit coherent reviewed changes, then run `npm run worktree -- publish <id> --title <reviewed-title> --body-file <contained-committed-PR.md>`.",
      "The operator's final-review phrase authorizes only committing reviewed state, pushing its WO branch, and opening its PR. Never merge, push main, publish a release, change account settings, or publish packages. Return the helper's exact post-merge release-close handoff.",
    ],
  },
  {
    facetId: "contributor.release-close",
    name: "release-close",
    description:
      "Close a merged DotLn worktree and publish its validated source tag and matching Release only on resume: release close.",
    intents: ["resume: release close"],
    feedbackHandlers: handlers,
    procedure: [
      "Only resume: release close authorizes this. In main, verify cwd/Git root; run `npm run resume --silent -- status --json`.",
      "Read: `@work-order`",
      "Read: `@citations`",
      "Read: `@final-review`",
      "Run the exact `npm run resume -- release-close` or worktree-publish handoff in main; after removal use main's helper. Use it for partial-publication retries too.",
      "The helper validates merge, cleanliness, evidence and tag/Release identity, reconciles intake and retains state/collision bytes in main's ignored retained/WO-NNN lane. Keep main's terms.txt and gate-evidence handoff. `--dry-run` previews. Report refusals; never force teardown or repeat transitions.",
      "Publish only the validated tag/Release; report no-release or remaining work. Never edit Releases, push main, merge PRs, publish packages/binaries or change settings.",
    ],
  },
  {
    facetId: "contributor.planner",
    name: "planner",
    description:
      "Run the document-only DotLn planning or ideation pipeline; preserve capture, synthesis and independent-refutation duties.",
    intents: ["planning:", "ideation:"],
    feedbackHandlers: handlers,
    procedure: [
      "Resolve cwd and Git root. A planning: prefix selects the document-only planning pass. An ideation: prefix selects capture, clean-room synthesis, ledger and product-doc write-back unless it explicitly says capture-only. Preserve any ongoing work-order obligation. The skill supplies no activation or external-effect authority.",
      "Read: `docs/product/07-execution-guide.md#Operator-opened planning pass`",
      "Read: `docs/product/07-execution-guide.md#Operator-opened ideation mode`",
      "Read: `docs/planning/sequence.md`",
      "Open a planning branch with `npm run plan -- start <slug>` from clean main. Follow the selected section's source/capture instructions and source each decision with its reopening condition. Planning satisfies independent refutation; ideation follows its pipeline or explicit capture-only boundary. Run `npm run test:docs` (plan, index, publication and format only). Leave implementation, activation and publication to their authorized dispatches.",
    ],
  },
  {
    facetId: "contributor.refuter",
    name: "refuter",
    description:
      "Independently judge the latest planning pass in the receiving session on planning: refute; planning: refute full judges the whole horizon.",
    intents: ["planning: refute", "planning: refute full"],
    feedbackHandlers: handlers,
    procedure: [
      "Resolve cwd and Git root. The exact phrase selects this independent refuter. The shared goal card supplies purpose; the canonical prompt is the sole subject evidence. Load no map, prior receipt or other subject preread.",
      "Run `npm run plan -- refute --direct` for planning: refute, or add `--scope full` for planning: refute full. The helper verifies that the committed subject equals the workspace and prints the canonical prompt. Pass scope judges the latest pass's changed orders and sequence; other verdicts carry by hash. Judge the prompt and save the closed JSON result and a plain statement file.",
      "Run `npm run plan -- receipt <result.json> --statement <statement.txt> [--dispositions <file>]`. The helper validates and screens against local terms, files the immutable direct-session pair, commits a plain subject and runs the plan check. Use these commands, without an ad hoc receipt script. Report scope, elapsed time and the actual result. `refute --transport <name>` is a separate external-refuter route.",
    ],
  },
];

export const contributorEnvelope: AuthorityEnvelope = {
  authorityEnvelopeId: "contributor.sandboxed",
  allowedEffects: [
    "repo.read",
    "repo.write",
    "shell.run",
    "git.local",
    "lifecycle.run",
  ],
  deniedEffects: [
    "credentials.access",
    "transport.ssh",
    "settings.user",
    "sandbox.disable",
    "remote.unapproved",
    "package.publish",
  ],
  resourceLimits: { writers: 1 },
  requiredEvidence: ["resolved-worktree"],
  expiresAt: Number.MAX_SAFE_INTEGER,
  revocationEventTypes: [],
};
const permissions: HarnessFacet = {
  facetId: "contributor.permissions",
  kind: "permission-guard",
  matchers: [
    { effect: "transport.ssh", deny: "Bash(ssh *)" },
    { effect: "transport.ssh", deny: "Bash(scp *)" },
    { effect: "transport.ssh", deny: "Bash(sftp *)" },
    { effect: "package.publish", deny: "Bash(npm publish *)" },
  ],
};
export const contributorLoadout: LoadoutGraph = {
  schemaVersion: 1,
  loadoutId: "contributor",
  identity: {
    identityId: "contributor",
    version: 1,
    name: "Contributor",
    dispositions: ["Original work, complete scope, observable evidence"],
    invariants: [
      "Employer separation and secret exclusion are the locked Clean Room floor",
    ],
    updateLaws: ["Propose reviewed immutable build versions"],
    lineage: ["docs/work-orders/WO-039-harness-lowering.md"],
  },
  role: {
    roleId: "contributor.dispatch",
    version: 1,
    name: "Contributor role dispatcher",
    obligations: [
      "Resolve the exact resume phrase through canonical lifecycle state",
    ],
    permissions: [],
    objectives: ["A task-scoped build, not accumulated startup prose"],
    policyDeltas: contributorRoles.map((role) => ({
      key: role.facetId,
      value: { intents: [...role.intents], procedure: [...role.procedure] },
    })),
  },
  containers: [
    {
      containerId: "contributor.worktree",
      version: 1,
      name: "Contributor worktree",
      kind: "workspace",
      socketBudget: 1,
      activeMechanicIds: ["clean-room"],
      supportFacetIds: ["contributor.permissions"],
    },
  ],
  activeMechanics: [
    {
      activeMechanicId: "clean-room",
      version: 1,
      name: "Clean Room",
      tags: ["plan", "mutate", "verify"],
      requiredCapabilities: [],
      semantics: [
        "Employer separation and secret exclusion cannot be weakened",
        "Ordinary raw intake is synthesized; explicitly ready public drafts retain recorded direct-filing provenance",
      ],
      authorityEnvelope: contributorEnvelope,
      workOrder: {
        workOrderId: "contributor.session",
        objective:
          "Complete the canonical selected work-order phase within its reviewed authority",
        acceptanceCriteria: [
          "Work-order evidence exists and the legal completion transition records",
        ],
        knownFacts: ["The lifecycle log is ground truth"],
        decisions: ["Four resume-phase roles plus a separate planner skill"],
        constraints: [
          "Locked Clean Room floor",
          "Sandbox and human approval boundaries remain in force",
        ],
        nonGoals: ["User-scope installation", "Lifecycle legality changes"],
        allowedOperations: [...contributorEnvelope.allowedEffects],
        prohibitedOperations: [...contributorEnvelope.deniedEffects],
        requiredEvidence: [
          "required-checks",
          "required-obligations",
          "current-output-reads",
        ],
        outputContract: {
          type: "contributor-phase-result-v1",
          required: ["evidence", "attestation", "limits"],
        },
      },
      inspection: {
        originalTerm: "Clean Room",
        translation: "Original personal work",
        kanji: "",
        rpgTitle: "Contributor",
        grants: [],
        restrictions: [...contributorEnvelope.deniedEffects],
        obligations: ["Complete the selected role's evidence gate"],
        passive: [],
        pulse: [],
        interrupt: [],
      },
    },
  ],
  supportFacets: [
    {
      supportFacetId: "contributor.permissions",
      version: 1,
      name: "Sandboxed contributor authority",
      supportedTags: ["mutate"],
      requiredCapabilities: [],
      semanticsAdded: ["Keep ADR-0003 through ADR-0005 posture"],
      semanticsModified: [],
      authorityChanges: [],
      evidenceRequirements: [],
      resourceMultiplier: 1,
      conflictsWith: [],
      preservesDeterminism: true,
      commutativity: "commutative",
      emissions: [
        {
          kind: "permission-guard",
          emissionId: "contributor.permissions",
          allowedOperations: [],
          prohibitedOperations: [...contributorEnvelope.deniedEffects],
          allowedEffects: [],
          deniedEffects: [...contributorEnvelope.deniedEffects],
        },
      ],
      claims: [],
      cost: {
        mechanismType: "permission-guard",
        promptTokens: 0,
        runtimeCost: { quantity: 1, unit: "pre-effect-check" },
        extraEpisodes: 0,
      },
      inspection: { restrictions: [...contributorEnvelope.deniedEffects] },
    },
  ],
  links: [
    {
      linkId: "contributor.permissions",
      linkGroupId: "contributor.boundaries",
      activeMechanicId: "clean-room",
      supportFacetId: "contributor.permissions",
    },
  ],
  linkGroups: [
    {
      linkGroupId: "contributor.boundaries",
      containerId: "contributor.worktree",
      linkIds: ["contributor.permissions"],
    },
  ],
  explicitPipelines: [],
  ambientEffects: [],
  resourceModel: {
    resourceModelId: "contributor.resources",
    version: 1,
    capacities: { writers: 1 },
    reservations: [],
  },
  polarAxes: [],
};
/** Keep the original saved build intact; equipment creates a new build. */
export function contributorWithSupports(
  supportIds: readonly string[] = defaultContributorSupportIds,
): LoadoutGraph {
  if (
    new Set(supportIds).size !== supportIds.length ||
    supportIds.some(
      (id) =>
        !contributorSupports.some((support) => support.supportFacetId === id),
    )
  )
    throw new Error("unknown or duplicate Contributor support");
  const equipped = contributorSupports.filter(({ supportFacetId }) =>
    supportIds.includes(supportFacetId),
  );
  if (!equipped.length) return contributorLoadout;
  const links = equipped.map(({ supportFacetId }) => ({
    linkId: supportFacetId,
    linkGroupId: "contributor.boundaries",
    activeMechanicId: "clean-room",
    supportFacetId,
  }));
  return {
    ...contributorLoadout,
    containers: contributorLoadout.containers.map((container) => ({
      ...container,
      socketBudget: container.socketBudget + equipped.length,
      supportFacetIds: [
        ...container.supportFacetIds,
        ...equipped.map(({ supportFacetId }) => supportFacetId),
      ],
    })),
    supportFacets: [...contributorLoadout.supportFacets, ...equipped],
    links: [...contributorLoadout.links, ...links],
    linkGroups: contributorLoadout.linkGroups.map((group) => ({
      ...group,
      linkIds: [...group.linkIds, ...links.map(({ linkId }) => linkId)],
    })),
  };
}

/** Consume the compiled equipment, rather than independently authoring skill text. */
// Mandatory session instructions belong to the separately hashed harness target.
// Keep the saved loadout-v1 policy deltas intact when adapting that target.
const sessionCommands =
  "`scope expand:` adds scope and receipt; `conversation only:` answers without pausing work. Keep effect limits; only explicit pause/stop interrupts. Neither appends an event.";
const targetRoles: readonly HarnessRole[] = contributorRoles.map((role) => {
  const procedure =
    role.name === "release-close"
      ? [
          "Verify main's cwd/Git root; run `npm run resume --silent -- status --json`.",
          "Read: `@work-order`",
          "Read: `@citations`",
          "Read: `@final-review`",
          "Use main's exact release-close/worktree-publish handoff; use its helper after removal or partial publication.",
          "Helper checks release prerequisites, reconciles intake and retains state/collisions in ignored retained/WO-NNN. Keep terms.txt and gate-evidence handoff. `--dry-run` previews. Report refusals; never force teardown/repeat transitions.",
          "Publish only that tag/Release; report no-release/remaining work. No Release edits, main pushes, PR merges, package/binary publication or settings changes.",
        ]
      : role.procedure;
  return {
    ...role,
    ...(role.name === "release-close"
      ? {
          description:
            "Only resume: release close: close the merged worktree; publish its validated tag/Release.",
        }
      : {}),
    procedure: [procedure[0]!, sessionCommands, ...procedure.slice(1)],
  };
});

export function contributorRolesFor(
  program: CompiledProgram,
): readonly HarnessRole[] {
  const equipped = contributorSupports.filter(({ supportFacetId }) =>
    program.componentManifest.some(
      (entry) =>
        entry.componentKind === "support-facet" &&
        entry.componentId === supportFacetId,
    ),
  );
  const emissions = equipped.map((support) => {
    const manifest = program.componentManifest.find(
      (entry) => entry.componentId === support.supportFacetId,
    )!;
    const emitted = support.emissions.flatMap((emission) =>
      emission.kind === "prompt-fragment" ? [emission.text] : [],
    );
    if (
      manifest.version !== support.version ||
      emitted.some((fragment) => !program.promptFragments.includes(fragment))
    )
      throw new Error(
        `Contributor support projection drift: ${support.supportFacetId}`,
      );
    return { support, emitted };
  });
  if (!emissions.length) return targetRoles;
  const modifiers = equipped.flatMap((support) => support.semanticsModified);
  return targetRoles.map((role) => {
    const shared = emissions
      .filter(({ support }) => sharedIds.includes(support.supportFacetId))
      .flatMap(({ emitted }) => emitted);
    const fragments =
      role.name === "executor"
        ? emissions
            .filter(
              ({ support }) => !sharedIds.includes(support.supportFacetId),
            )
            .flatMap(({ emitted }) => emitted)
        : [];
    if (!shared.length && !fragments.length) return role;
    const procedure = role.procedure.flatMap((line) => {
      const projected = (role.name === "executor" ? modifiers : []).reduce(
        (text, { from, to }) => text.replace(from, to),
        line,
      );
      return line.startsWith("Run `npm run resume --silent -- status --json`")
        ? [projected, ...fragments]
        : [projected];
    });
    return {
      ...role,
      procedure:
        role.name === "executor"
          ? [procedure[0]!, ...shared, ...procedure.slice(1)]
          : [...shared, ...procedure],
    };
  });
}

export const contributorProgram = (
  supportIds: readonly string[] = defaultContributorSupportIds,
): HarnessProgram => {
  const loadout = requireCompiled(
    compileLoadout(contributorWithSupports(supportIds), {
      environmentId: "contributor.project",
      version: 1,
      capabilities: [],
      repo: "project",
      baseCommit: "0".repeat(40),
    }),
  );
  return {
    contractVersion: "harness-v1",
    loadout,
    roles: contributorRolesFor(loadout),
    facets: [
      permissions,
      ...contributorSupports.flatMap((support): HarnessFacet[] =>
        supportIds.includes(support.supportFacetId)
          ? support.emissions.flatMap((emission) =>
              emission.kind === "prompt-fragment"
                ? [
                    {
                      facetId: support.supportFacetId,
                      kind: "role-procedure" as const,
                      ...(sharedIds.includes(support.supportFacetId)
                        ? {
                            roleNames: contributorRoles.map(
                              (role) => role.name,
                            ),
                          }
                        : { roleName: "executor" }),
                      text: emission.text,
                    },
                  ]
                : [],
            )
          : [],
      ),
      {
        facetId: "clean-room",
        kind: "prompt-fragment",
        text: "Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.",
      },
    ],
    correctionToken: null,
  };
};
export const contributorConfiguredProgram = (
  switches: ContributorSupportSwitches = {},
): HarnessProgram => {
  const {
    "process-cost": cost = true,
    "goal-alignment": goal = true,
    ...executor
  } = switches;
  if (typeof cost !== "boolean" || typeof goal !== "boolean")
    throw new Error("shared support switches require ON/OFF booleans");
  return contributorProgram([
    ...executorSupportIds(executor),
    ...(cost ? [processCost.supportFacetId] : []),
    ...(goal ? [goalAlignment.supportFacetId] : []),
  ]);
};

const record = "docs/discovery/harness-smoke-2026-09-07.md";
export const contributorProfiles: readonly HarnessProfile[] = [
  {
    profileId: "claude-code-2.1.263",
    harness: "claude-code",
    observedVersion: "2.1.263",
    tools: harnessToolEffects,
    events: {
      PreToolUse: { available: true, evidence: `${record}#C1` },
      PostToolUse: { available: true, evidence: `${record}#C2` },
      Stop: { available: true, evidence: `${record}#C3` },
      UserPromptSubmit: { available: true, evidence: `${record}#C4` },
    },
    skills: {
      available: true,
      evidence: `${record}#C5`,
      root: ".claude/skills",
    },
    settings: {
      available: true,
      evidence: `${record}#C6`,
      path: ".claude/settings.json",
      deny: true,
      allow: false,
    },
    instruction: {
      available: true,
      evidence: `${record}#C7`,
      path: "CLAUDE.md",
    },
    refusal: "claude-command-json-v1",
    runtime: { skeletonVersion: "0.15.1", boundaryContract: "feedback-v1" },
  },
  {
    profileId: "codex-cli-0.153.4",
    harness: "codex-cli",
    observedVersion: "0.153.4",
    tools: harnessToolEffects,
    events: Object.fromEntries(
      ["PreToolUse", "PostToolUse", "Stop", "UserPromptSubmit"].map((event) => [
        event,
        {
          available: false,
          evidence: `${record}#X2`,
          reason: "No project hook fired in the bounded Codex probe",
        },
      ]),
    ) as HarnessProfile["events"],
    skills: {
      available: true,
      evidence: `${record}#X1`,
      root: ".agents/skills",
    },
    settings: {
      available: false,
      evidence: `${record}#X2`,
      reason: "Settings permission lowering was not observed",
      path: ".claude/settings.json",
      deny: false,
      allow: false,
    },
    instruction: {
      available: true,
      evidence: `${record}#X3`,
      path: "AGENTS.md",
    },
    refusal: "unavailable",
    runtime: { skeletonVersion: "0.15.1", boundaryContract: "feedback-v1" },
  },
];
