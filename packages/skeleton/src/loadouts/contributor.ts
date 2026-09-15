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
const operatorControls =
  "Operator controls precede workflow: `analysis:` pauses for diagnosis/direction; `operator override:` suspends DotLn gates for authorized recovery, regardless of harness/repo state. Preserve pending work; invent no dispatch or passing check. Exit with either prefix plus `off`. Codex: `node scripts/operator-control.mjs analysis|override|off|status` needs no build or Git. Host permissions apply. Read product 07 §Operator recovery controls for the broader recovery candidate.";
// Every role in both harnesses carries this line (operator direction,
// 2026-09-14, WO-044): a guess presented as a finding is a defect.
const noGuessing =
  "Never guess: an unobserved value is `unknown`, `untested` or `blocked`; each claim names its source or what is missing.";
const common = [
  "Resolve physical cwd and Git root before changing files or running Git commands. Work only in the selected worktree; one writable coding agent owns it.",
  "Run `npm run resume --silent -- status --json`; use its canonical selected order, phase, report paths, and legal actions. A stale Markdown projection is repaired only by the next legal transition.",
  "Status may name artifacts for other roles. Load a report only when this role's Read directives or the active order's citations select it; a path in status is metadata, not a read directive.",
  "Skills supply procedure, never authority or phase state. Preserve the operator's intent; work-order model and effort are recommendations, and attestations record actual supplied values. Never invent effective-session readback.",
  noGuessing,
  "Read: `@work-order`",
  "Read: `@citations`",
  "Read source and existing tests relevant to the order before changes. Scope those reads to `@subject-files`; unresolved paths remain a named input requirement.",
  "State-changing resume commands require one-invocation outside-sandbox approval in Codex; inspect the exact command, package mapping, and lifecycle-script diff first. `status`, `times`, `briefing`, and `next` need no Git escalation. In Claude Code the session hook records the dispatch named by the operator's phrase (`next`, `fix`, `verify`, `final-review`) before this procedure loads, delivers that command's briefing, passes a phrase whose dispatch is already recorded with the same briefing and receipt projected read-only by `npm run resume -- briefing` (a resumed Codex session runs that command itself), and reports a dispatch that is not legal in the current phase without rejecting the prompt. Prompt submission always remains open: setup, runtime and state failures are advisory, never a reason to deny access to Claude or Codex. It admits the dispatch exactly as the ordinary command: a live evidence gate or another session's writer reservation refuses it before any lifecycle change, and the terminal shows a one-line receipt naming the recorded dispatch and the equipped supports. Run no dispatch the harness recorded. Never repeat a recorded transition to repair a checkpoint warning.",
  "No branch commits before final review. Never reset, restore, clean, drop a stash, or discard intake. Preserve work through the canonical checkpoint and named recovery procedure if rollback is needed.",
  "Read: `@subject-files`",
  "Read: `package.json`",
  "Run `npm run work-orders -- index` after dispatch and after recording a result. The canonical evidence command refreshes owned projections before checking; lifecycle commands do not regenerate that index.",
  "Write durable product decisions to the cited product docs and `docs/evidence/WO-NNN/decisions.md`, naming the operator dispatch, evidence, alternatives and reopening condition. Run `npm run meta` to refresh the decisions index. The ledger is for operator ideation and planning synthesis only. For an order filed before 2026-09-09, a ledger-entry duty is discharged by its decisions file and index row; the work-order index marks this substitution. Record a correction the same day: what was misread, what was meant and what changed. Decided means sourced, not frozen; an order's non-goal fences that order alone.",
];
const actor =
  "Completion flags: `--harness <harness> --harness-version <version> --model <model> --effort <level> --source <source>`. Supply each field; unknown is admitted. Versions, models and effort are logged, never refused. `ultra` and `ultra code` record xhigh, mode subagents and raw spelling. Never invent effective-session readback. The repository's Codex default is GPT-6 Astra at max, operator-attested unless actual readback is exposed.";
const evidence =
  "Run checks that establish the work order's claims. Executor and verifier choose when npm test is useful; lifecycle transitions never require a test gate. Completion runs git diff --check inline and validates report/attestation presence; missing gate rows, output-read observations, usage and planning handoffs advise. Review current authored outputs and record evidence with source and cutoff. Reports, indexes and release text may be completed after a passing gate without invalidating code identity. One registered writer owns a worktree on any branch. Never write gate inputs or its success record during a live npm test; stop your own gate with `node scripts/harness.mjs evidence --stop` when necessary. Every other permission judgment delegates to the host. Read current authored outputs; generated or oversized outputs use their generation/check evidence. Codex can use explicit begin/observe/delivered and `node scripts/harness.mjs read-output <path> --offset 0 --length 8192`, without claiming automatic hooks. Usage is recorded when available and unknown otherwise; it never blocks handoff.";
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
      "For status or times, run the matching read-only command and report its observation; stop without a transition. For next, follow the emitted path in the delivered briefing (Codex runs `npm run resume -- next` itself). If closed, report other in-flight orders; only when none remain, give the exact printed worktree-start handoff.",
      "For fix, the dispatch is recorded and its briefing delivered with the phrase (Codex runs `npm run resume -- fix` first); read the original order and its named failure source. Repair only those obligations. A premature repair may reopen only while the unresolved failure source remains.",
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
      "The `verify` dispatch is recorded with the phrase and delivers the exact new VER path it allocates (Codex runs `npm run resume -- verify` itself); write only that path. Judge the original order and current subject against its acceptance criteria, reproducing consequential claims and checking earlier findings. Substantive implementation defects become findings for repair.",
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
      "The `final-review` dispatch is recorded with the phrase and delivers the allocated FINAL path (Codex runs `npm run resume -- final-review` itself); use that path. Review the full subject diff and complete numbered verification sequence against the original order. Handle authorized integration, then rerun checks affected by integration.",
      "Read: `@verification-reports`",
      "Read: `docs/product/08-publication-compiler.md#PRs and commits`",
      evidence,
      "After the last source edit and intended new source files are staged, run `npm test -- --review` once. This runs the product suites and machinery suites whose own declared sources changed since the base. The passing npm test row is keyed by tracked non-generated code; final-review-result carries it in the control event, worktree publish cites it in the PR, and release close consumes it without running a suite. Source changes require affected checks and a new final product gate; report/control/generated-document changes do not.",
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
      noGuessing,
      "Read: `@work-order`",
      "Read: `@citations`",
      "Read: `@final-review`",
      "Run the exact `npm run resume -- release-close` or worktree-publish handoff in main; after removal use main's helper. Use it for partial-publication retries too. It proves network egress to the GitHub host first. Use the host permission flow for required egress; the authorized session finishes the command. `--dry-run` previews the same publication and manifest.",
      "The helper fast-forwards main, checks release surfaces, builds missing dist, consumes the committed reviewer npm test row by code identity, and publishes the annotated tag and Release. It runs no suite, npm ci or CLI smoke. Worktree finish and derived-worktree settlement follow publication as best effort; preserve material and report cleanup blockers without undoing publication. Never force teardown or repeat transitions.",
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
      noGuessing,
      "Read: `docs/product/07-execution-guide.md#Operator-opened planning pass`",
      "Read: `docs/product/07-execution-guide.md#Operator-opened ideation mode`",
      "Read: `docs/planning/sequence.md`",
      "Open a planning branch with `npm run plan -- start <slug>` from clean main. Follow the selected section's source/capture instructions and source each decision with its reopening condition. Planning satisfies independent refutation; ideation follows its pipeline or explicit capture-only boundary. Run `npm run test:docs` (plan, index, publication and format only). Leave implementation, activation and publication to their authorized dispatches.",
      "After committing the planning subject locally, load dotln-refuter for one independent goal review per pass. Reuse that judgment after repairs unless observed evidence changed; for a new judgment dispatch one fresh background refuter with no inherited conversation. Use the canonical direct prompt and receipt helper; keep the parent as the sole repository writer. Do not launch an external refutation CLI unless the operator explicitly requests that transport.",
    ],
  },
  {
    facetId: "contributor.refuter",
    name: "refuter",
    description:
      "Run an independent background-worker judgment of the latest planning pass on planning: refute; planning: refute full judges the whole horizon.",
    intents: ["planning: refute", "planning: refute full"],
    feedbackHandlers: handlers,
    procedure: [
      "Resolve cwd and Git root. The parent coordinates one fresh background refuter without inherited conversation (Codex: spawn_agent with fork_turns none; Claude: a fresh background agent). Give it only the canonical prompt, its result schema and the shared goal card; no planner narrative, prior receipts or other subject preread. The parent remains the sole repository writer. A worker already given that prompt judges it directly; it does not spawn another refuter.",
      noGuessing,
      "Run `npm run plan -- refute` for planning: refute, or add `--scope full` for planning: refute full; --direct remains an alias. The helper verifies committed/workspace equality and prints the canonical prompt and closed JSON schema. Pass scope judges changed orders and sequence; other verdicts carry by hash. The worker returns its frozen JSON and a truthful single-line statement of at most 4000 characters to the parent, using scratch files if needed, with no repository or Git writes. While it runs, complete independent closeout work without changing the frozen subject.",
      "The parent saves the worker's result and statement in ignored local files and runs `npm run plan -- receipt <result.json> --statement <statement.txt> [--dispositions <file>]`. The helper validates, screens, files and commits the immutable pair and runs the plan check. Preserve aligned, aligned-with-findings or observed-evidence misaligned verdicts. Hypotheticals are known issues with reopening observations. Record criterion-bound dispositions using `npm run plan -- dispose <receipt-id> <hold-id> <reason>`; they discharge holds without another judgment. Apply only operator-authorized overrides. No third-hold or duration refusal applies. Repair formatting with the same worker without rerolling the judgment. Report scope, elapsed time and actual result. Use no ad hoc receipt script. External `refute --transport <name>` requires an explicit operator request; do not fall back to it after a worker failure. If background workers are unavailable, report that limitation and preserve the pending review.",
    ],
  },
].map((role) => ({
  ...role,
  procedure: [operatorControls, ...role.procedure],
}));

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
          noGuessing,
          "Read: `@work-order`",
          "Read: `@citations`",
          "Read: `@final-review`",
          "Use main's exact release-close/worktree-publish handoff; use its helper after removal or partial publication. It proves network egress to the GitHub host first. Use the host permission flow for required egress; the authorized session finishes the command. `--dry-run` previews the same publication and manifest.",
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
    runtime: { skeletonVersion: "0.16.0", boundaryContract: "feedback-v1" },
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
    runtime: { skeletonVersion: "0.16.0", boundaryContract: "feedback-v1" },
  },
];
