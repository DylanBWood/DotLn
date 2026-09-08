import {
  compileLoadout,
  requireCompiled,
  type AuthorityEnvelope,
  type HarnessFacet,
  type HarnessProfile,
  type HarnessProgram,
  type HarnessRole,
  type LoadoutGraph,
} from "@dotln/compiler";
import { personalFeedbackUnits } from "./feedback.js";

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
  "Run `npm run work-orders -- index` after dispatch and after recording a result. Refresh before the evidence gate; lifecycle commands do not regenerate that index.",
  "Keep durable decisions in the cited product docs and append changed ideas to the ledger. Preserve settled outcomes and rejection reasons; use only original personal source material.",
];
const actor =
  "Completion flags: `--harness <harness> --harness-version <version> --model <model> --effort <level> --source <self-reported|harness-readback|operator-attested>`. Use exposed values; an unknown required effort blocks the handoff. The repository's Codex default is GPT-6 Astra at max, operator-attested unless actual readback is exposed.";
const evidence =
  "Run the order's evidence gate and `npm test`, then `git diff --check`. Read every changed output at its current bytes. Claude's observer combines verified Read ranges; for oversized lines use `node scripts/harness.mjs read-output <path> --offset 0 --length 8192`, continuing at each returned nextOffset until totalBytes. Receipts require the observed delivery of every byte at one file hash. `npm run harness -- evidence` executes the fixed required checks and records host evidence for the installed Claude completion hooks; it never replaces work-order acceptance evidence.";
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
      "Prepare the contained PR.md and five-section RELEASE-NOTES.md beside the report, using the current publication contract; use one physical line per prose paragraph. A relevant gitmoji shortcode belongs in the PR title; commit subjects stay plain and contain no AI attribution.",
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
      "Start this role from main so its installed hooks survive teardown of the reviewed worktree. Resolve cwd and Git root, then run `npm run resume --silent -- status --json`. The exact release-close phrase carries the narrow authority below; the skill itself grants none.",
      "Read: `@work-order`",
      "Read: `@citations`",
      "Read: `@final-review`",
      "Run `npm run resume -- release-close` to obtain the canonical absolute command, or use the exact post-merge handoff already emitted by worktree publish. Run that `node <reviewed-subject>/scripts/release.mjs close <id> --publish` command from main; after subject removal use main's copy.",
      "The helper owns merge/clean/material gates, main synchronization, tests, worktree teardown, annotated tag validation and matching GitHub Release creation. A missing or failed gate blocks completion; retain its evidence and do not force teardown or retry a recorded lifecycle transition.",
      "Back up and reconcile single-copy ignored intake before teardown. Preserve any other non-disposable ignored material; never delete it to satisfy the gate. If Release creation failed after tag publication, rerun the close helper from updated main.",
      "Publish only the validated annotated source tag and its matching reviewed Release, or report the honest no-release result. Never edit a published Release, push main, merge a PR, publish packages/binaries, or change repository/user settings. Report the exact executable result and any remaining obligation.",
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
      "Read: `docs/planning/work-order-map.md`",
      "Follow the selected section's source/capture instructions. Planning must satisfy its independent refutation gate; ideation follows its complete pipeline or explicit capture-only boundary. Preserve settled decisions and leave implementation, activation and publication for their authorized dispatches.",
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
export const contributorProgram = (): HarnessProgram => ({
  contractVersion: "harness-v1",
  loadout: requireCompiled(
    compileLoadout(contributorLoadout, {
      environmentId: "contributor.project",
      version: 1,
      capabilities: [],
      repo: "project",
      baseCommit: "0".repeat(40),
    }),
  ),
  roles: contributorRoles,
  facets: [
    permissions,
    {
      facetId: "clean-room",
      kind: "prompt-fragment",
      text: "Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.",
    },
  ],
  correctionToken: null,
});
const record = "docs/discovery/harness-smoke-2026-09-07.md";
export const contributorProfiles: readonly HarnessProfile[] = [
  {
    profileId: "claude-code-2.1.263",
    harness: "claude-code",
    observedVersion: "2.1.263",
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
    runtime: { skeletonVersion: "0.13.0", boundaryContract: "feedback-v1" },
  },
  {
    profileId: "codex-cli-0.153.4",
    harness: "codex-cli",
    observedVersion: "0.153.4",
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
    runtime: { skeletonVersion: "0.13.0", boundaryContract: "feedback-v1" },
  },
];
