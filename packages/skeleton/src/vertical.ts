/** WO-123: pure admission and the persisted executable vertical. Host effects
 * live in vertical-host; source text arrives only through the bundle decoder. */
import {
  canonicalStringify,
  compareText,
  compileStoryContract,
  decodeSourceBundle,
  deriveSurfaces,
  fnv1a64,
  normalizeAuthorityGrants,
  type AcceptanceCriterion,
  type AuthorityEnvelope,
  type AuthorityGrant,
  type CompiledPresencePhase,
  type NamedVerificationTest,
  type RepoSurfaceProfile,
  type SnapshotIndex,
  type SourceBundle,
  type StoryContract,
  type StoryInference,
  type SurfaceDerivation,
  type WorkOrder,
} from "@dotln/compiler";
import {
  Program,
  stepProgram,
  type Event,
  type ExecutableProgramV1,
  type JsonValue,
} from "@dotln/kernel";
import { decodePortfolio, type Portfolio } from "./portfolio.js";

export const VERTICAL_EFFECTS = [
  "repo.read",
  "repo.write",
  "git.local",
  "shell.run",
  "verification.evaluate",
  "repo.push",
  "pr.open",
  "pr.thread.resolve",
] as const;
export const VERTICAL_REMOTE_EFFECTS = [
  "repo.push",
  "pr.open",
  "pr.thread.resolve",
] as const;
export const verticalHash = (value: unknown) =>
  fnv1a64(canonicalStringify(value));
export const verticalEqual = (a: unknown, b: unknown) =>
  canonicalStringify(a) === canonicalStringify(b);
const covers = (patterns: readonly string[], value: string) =>
  patterns.some(
    (p) => p === value || (p.endsWith("*") && value.startsWith(p.slice(0, -1))),
  );
const within = (surfaces: readonly string[], path: string) =>
  surfaces.some((s) => path === s || path.startsWith(`${s}/`));
const json = (value: unknown) => value as JsonValue;
const need = (condition: unknown, reason: string): void => {
  if (!condition) throw new Error(reason);
};
/** Code-unit order: the binding key must not depend on the host's locale. */
const byStatementId = (
  a: { readonly statementId: string },
  b: { readonly statementId: string },
): number => compareText(a.statementId, b.statementId);
const line = (value: unknown): value is string =>
  typeof value === "string" &&
  !!value.trim() &&
  !/[\x00-\x1f\x7f]/u.test(value);

export interface PreparedIntent {
  readonly draft: WorkOrder;
  readonly bundle: SourceBundle;
  readonly forgeHost: string;
  readonly inferences: readonly StoryInference[];
  /** Reviewed assertion meanings, bound to the compiled source contract. */
  readonly baselineAssessment?: unknown;
  readonly profile: RepoSurfaceProfile;
  readonly snapshot: SnapshotIndex;
  /** Host-bound physical target and commit; never taken from the filed draft. */
  readonly target: string;
  readonly baseCommit: string;
  readonly phase: CompiledPresencePhase;
  readonly at: number;
  readonly spent: {
    readonly episodes: number;
    readonly wallMs: number;
    readonly tokens: number;
  };
  readonly evidence?: readonly string[];
}
export interface IntentBinding {
  readonly key: string;
  readonly draftId: string;
  readonly portfolio: Portfolio;
  readonly target: string;
  readonly phaseId: string;
  readonly admittedAt: number;
  readonly authority: AuthorityEnvelope;
  readonly grants: readonly AuthorityGrant[];
  readonly contract: StoryContract;
  readonly baselineAssessment: BaselineAssessment;
  readonly derivation: SurfaceDerivation;
  readonly bundle: SourceBundle;
  readonly workOrder: WorkOrder;
  readonly criteria: readonly AcceptanceCriterion[];
  readonly tests: readonly NamedVerificationTest[];
  readonly statements: {
    readonly draftConstraint: "Standing authorization supersedes the draft's human-review-before-activation constraint.";
    readonly surfaceDerivation: {
      readonly beforeAdmission: true;
      readonly authorityEnvelopeId: string;
      readonly effect: "repo.read";
    };
  };
}
export type IntentAdmission =
  | { readonly kind: "admitted"; readonly binding: IntentBinding }
  | {
      readonly kind: "NeedsHuman";
      readonly step: string;
      readonly reason: string;
    };
/** Only the source adapter constructs this from already-screened metadata. */
export class IntentPreparationRefusal extends Error {
  constructor(
    readonly step: string,
    reason: string,
    readonly transient = false,
  ) {
    super(reason);
  }
}

/** Positive decode of the WO-120 draft. Its bytes are never retargeted. */
export function assertIntentDraft(value: unknown): asserts value is WorkOrder {
  const v = value as WorkOrder;
  const arrays = [
    "acceptanceCriteria",
    "knownFacts",
    "decisions",
    "constraints",
    "nonGoals",
    "allowedOperations",
    "prohibitedOperations",
    "requiredEvidence",
  ] as const;
  need(
    v && typeof v === "object" && !Array.isArray(v),
    "draft must be an object",
  );
  need(
    Object.keys(v).sort().join(",") ===
      [
        ...arrays,
        "workOrderId",
        "objective",
        "repo",
        "baseCommit",
        "outputContract",
      ]
        .sort()
        .join(","),
    "draft fields cannot be decoded",
  );
  need(
    line(v.workOrderId) &&
      /^WO-\d+$/u.test(v.workOrderId) &&
      typeof v.objective === "string" &&
      v.objective.trim(),
    "draft identity or objective cannot be decoded",
  );
  need(
    arrays.every((key) => Array.isArray(v[key]) && v[key].every(line)),
    "draft lists cannot be decoded",
  );
  need(
    v.repo === "self" &&
      v.baseCommit === "unassigned" &&
      v.constraints.includes("Human review is required before activation.") &&
      v.allowedOperations.length === 0,
    "intent must be an unactivated WO-120 draft",
  );
  need(
    v.outputContract &&
      typeof v.outputContract === "object" &&
      !Array.isArray(v.outputContract),
    "draft output contract cannot be decoded",
  );
}

/** `portfolio` and `grants` are the host's admitted configuration, not fields
 * selected by issue text. A malformed value becomes a held decision. */
export function admitIntent(
  input: PreparedIntent,
  definition: unknown,
  suppliedGrants: unknown,
): IntentAdmission {
  let step = "admission";
  try {
    assertIntentDraft(input.draft);
    const portfolio = decodePortfolio(definition);
    need(portfolio.class === "intent", "no covering intent portfolio entry");
    const grants = normalizeAuthorityGrants(
      suppliedGrants as readonly AuthorityGrant[],
    );
    const phase = input.phase;
    const ceiling = portfolio.phases[phase.phaseId];
    need(ceiling, "intent portfolio does not cover this phase");
    const envelope = phase.effectiveEnvelope;
    need(
      (input.evidence === undefined || Array.isArray(input.evidence)) &&
        envelope.requiredEvidence.every((item) =>
          input.evidence?.includes(item),
        ),
      "intent required authority evidence is absent",
    );
    need(
      !envelope.revocationConditions?.length,
      "intent conditional revocation requires an equipped predicate host",
    );
    need(
      Number.isFinite(input.at) &&
        input.at >= 0 &&
        envelope.expiresAt > input.at,
      "intent authority is expired or unreadable",
    );
    need(
      /^[a-f0-9]{40}$/u.test(input.baseCommit) && line(input.target),
      "target binding cannot be decoded",
    );
    need(
      Object.values(input.spent).every((n) => Number.isFinite(n) && n >= 0) &&
        input.spent.episodes < portfolio.budget.episodes &&
        input.spent.wallMs < portfolio.budget.wallMs &&
        (portfolio.budget.tokens === undefined ||
          input.spent.tokens < portfolio.budget.tokens),
      "intent portfolio budget exhausted",
    );
    for (const effect of VERTICAL_EFFECTS) {
      need(
        ceiling!.effects.includes(effect) &&
          covers(envelope.allowedEffects, effect) &&
          !covers(envelope.deniedEffects, effect),
        `intent phase does not admit ${effect}`,
      );
      if ((VERTICAL_REMOTE_EFFECTS as readonly string[]).includes(effect))
        need(
          grants.some(
            (g) =>
              g.grantedBy === "operator" &&
              g.repo === input.target &&
              g.effects.every((e) =>
                (VERTICAL_REMOTE_EFFECTS as readonly string[]).includes(e),
              ) &&
              g.effects.includes(effect) &&
              g.operations?.every((e) =>
                (VERTICAL_REMOTE_EFFECTS as readonly string[]).includes(e),
              ) &&
              g.operations?.includes(effect),
          ),
          `no admitted remote-only target grant for ${effect}`,
        );
    }
    need(
      (envelope.resourceLimits["writers"] ?? 0) >= 1,
      "intent phase grants no writer",
    );
    step = "bundle";
    need(
      line(input.forgeHost) && /^[A-Za-z0-9.-]+$/u.test(input.forgeHost),
      "forge host cannot be decoded",
    );
    const decoded = decodeSourceBundle(input.bundle, {
      allowedHosts: [input.forgeHost],
    });
    if (!decoded.ok)
      return {
        kind: "NeedsHuman",
        step,
        reason:
          decoded.refusal === "malformed"
            ? `bundle field ${decoded.path} cannot be decoded`
            : `bundle screen refused ${decoded.findings.map((f) => f.id).join(", ")}`,
      };
    step = "contract";
    const contract = compileStoryContract(decoded.bundle, input.inferences);
    const current = contract.criteria.filter((c) => c.status === "active");
    need(current.length > 0, "contract has no executable criteria");
    need(
      contract.openDecisions.length === 0,
      `contract has unresolved material decisions: ${contract.openDecisions.map((d) => d.decisionId).join(", ")}`,
    );
    const baselineAssessment = decodeBaselineAssessment(
      contract,
      input.baselineAssessment,
    );
    step = "surfaces";
    const derivation = deriveSurfaces(contract, input.profile, input.snapshot);
    if (derivation.kind === "NeedsHuman")
      return { kind: "NeedsHuman", step, reason: derivation.reason };
    const surfaces = derivation.surfaces.map((s) => s.path);
    need(
      surfaces.every((p) => within(portfolio.surfaces, p)),
      "derived surfaces exceed the intent portfolio ceiling",
    );
    const limits: Record<string, number> = { ...envelope.resourceLimits };
    for (const [resource, limit] of [
      ...Object.entries(phase.scope.budget),
      ...Object.entries(phase.scope.changeSize),
    ])
      limits[resource] = Math.min(limits[resource] ?? 0, limit);
    const files = Math.min(
      ceiling!.files,
      phase.scope.changeSize.files,
      limits["files"] ?? 0,
    );
    need(
      surfaces.length <= files,
      "derived file count exceeds the intent phase ceiling",
    );
    const commands = derivation.tests.map((t) => t.command);
    need(
      commands.length &&
        commands.every((c) => portfolio.verification.intent?.includes(c)),
      "derived tests lack intent portfolio authorization",
    );
    const tests: NamedVerificationTest[] = current.flatMap((criterion) =>
      commands.map((command, i) => ({
        criterionId: criterion.criterionId,
        checkId: `check-${i + 1}`,
        command,
      })),
    );
    const criteria: AcceptanceCriterion[] = current.map((c) => ({
      criterionId: c.criterionId,
      description: c.description,
      claimType: c.claimType,
      evidenceSource: c.evidenceSource,
      codeSurfaces: surfaces,
      requiredChecks: commands.map((_, i) => `check-${i + 1}`),
    }));
    const key = verticalHash([
      input.draft.workOrderId,
      portfolio.portfolioId,
      portfolio.version,
      portfolio.repo,
      input.baseCommit,
      contract.contractId,
      baselineAssessment,
    ]);
    const tokenLimit = Math.min(
      limits["tokens"] ?? Infinity,
      portfolio.budget.tokens === undefined
        ? Infinity
        : portfolio.budget.tokens - input.spent.tokens,
    );
    const authority: AuthorityEnvelope = {
      ...envelope,
      authorityEnvelopeId: `intent:${key}`,
      allowedEffects: [...VERTICAL_EFFECTS],
      resourceLimits: {
        ...limits,
        files,
        ...(Number.isFinite(tokenLimit) ? { tokens: tokenLimit } : {}),
      },
      expiresAt: Math.min(
        envelope.expiresAt,
        input.at + portfolio.budget.wallMs - input.spent.wallMs,
      ),
    };
    const workOrder: WorkOrder = {
      workOrderId: `intent_${key}`,
      objective: current.map((c) => c.description).join(" "),
      acceptanceCriteria: current.map((c) => c.description),
      knownFacts: contract.statements
        .filter(
          (s) =>
            s.status === "active" && s.class === "current-behavior observation",
        )
        .map((s) => s.text),
      decisions: [
        `StoryContract ${contract.contractId}; draft ${input.draft.workOrderId}; portfolio ${portfolio.portfolioId} v${portfolio.version}.`,
      ],
      constraints: [
        `Change only ${surfaces.join(", ")}.`,
        `Touch at most ${files} files.`,
        "Preserve the host's test commands and commit message.",
      ],
      nonGoals: contract.statements
        .filter((s) => s.status === "active" && s.class === "non-requirement")
        .map((s) => s.text),
      repo: portfolio.repo,
      baseCommit: input.baseCommit,
      allowedOperations: [...VERTICAL_EFFECTS],
      prohibitedOperations: [...authority.deniedEffects],
      requiredEvidence: commands,
      outputContract: {
        type: "SourceChangeObserved",
        verification: "independent verification and review",
      },
    };
    return {
      kind: "admitted",
      binding: {
        key,
        draftId: input.draft.workOrderId,
        portfolio,
        target: input.target,
        phaseId: phase.phaseId,
        admittedAt: input.at,
        authority,
        grants,
        contract,
        baselineAssessment,
        derivation,
        bundle: decoded.bundle,
        workOrder,
        criteria,
        tests,
        statements: {
          draftConstraint:
            "Standing authorization supersedes the draft's human-review-before-activation constraint.",
          surfaceDerivation: {
            beforeAdmission: true,
            authorityEnvelopeId: envelope.authorityEnvelopeId,
            effect: "repo.read",
          },
        },
      },
    };
  } catch (error) {
    return {
      kind: "NeedsHuman",
      step,
      reason:
        error instanceof Error &&
        /^(draft|intent|no |target|derived|contract|portfolio:|authorityGrants)/u.test(
          error.message,
        )
          ? error.message
          : "intent input cannot be decoded",
    };
  }
}

/** Reserve reported token ceilings, rather than treating absent usage as zero.
 * Wall budget is a portfolio window starting at its first accepted intent. */
export function intentBudgetUsed(
  intents: Record<string, { kind: string; binding?: IntentBinding }>,
  at: number,
): PreparedIntent["spent"] {
  const bindings = Object.values(intents).flatMap((i) =>
    i.kind === "admitted" && i.binding ? [i.binding] : [],
  );
  return {
    episodes: bindings.length,
    wallMs: bindings.length
      ? Math.max(0, at - Math.min(...bindings.map((b) => b.admittedAt)))
      : 0,
    tokens: bindings.reduce(
      (n, b) => n + (b.authority.resourceLimits["tokens"] ?? 0),
      0,
    ),
  };
}

/** Assertion meaning is a reviewed judgment, not an English runtime rule.
 * The producer reads the original statement and context. Source identity and
 * complete coverage make execution repeatable; they do not prove its meaning. */
export interface BaselineAssessment {
  readonly schemaVersion: 1;
  readonly contractId: string;
  readonly producer: {
    readonly kind: "model" | "operator" | "unsupplied";
    readonly name: string;
  };
  readonly assertions: readonly {
    readonly statementId: string;
    readonly kind: "existing-failure" | "no-existing-failure" | "unresolved";
    readonly rationale: string;
  }[];
}
const executableStatements = (contract: StoryContract) =>
  contract.statements.filter(
    (s) => s.status === "active" && s.class !== "non-requirement",
  );
const exactFields = (value: unknown, keys: readonly string[]): boolean =>
  !!value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");

/** Positive decode against the *compiled* statement identities. Missing entries
 * stay unresolved, including old configurations and old persisted bindings.
 * No absence or malformed judgment is interpreted as a healthy/new story. */
export function decodeBaselineAssessment(
  contract: StoryContract,
  value: unknown,
): BaselineAssessment {
  const statements = executableStatements(contract);
  if (value === undefined)
    return {
      schemaVersion: 1,
      contractId: contract.contractId,
      producer: { kind: "unsupplied", name: "not supplied" },
      assertions: statements
        .map((s) => ({
          statementId: s.statementId,
          kind: "unresolved" as const,
          rationale: "No assertion judgment supplied for this statement.",
        }))
        .sort(byStatementId),
    };
  const v = value as BaselineAssessment;
  const requireAssessment = (ok: unknown, reason: string) =>
    need(ok, "contract baseline assessment " + reason);
  requireAssessment(
    exactFields(v, ["schemaVersion", "contractId", "producer", "assertions"]) &&
      v.schemaVersion === 1,
    "fields or version cannot be decoded",
  );
  requireAssessment(
    v.contractId === contract.contractId,
    "names a stale contract",
  );
  requireAssessment(
    exactFields(v.producer, ["kind", "name"]) &&
      ["model", "operator", "unsupplied"].includes(v.producer.kind) &&
      line(v.producer.name),
    "producer cannot be decoded",
  );
  requireAssessment(
    Array.isArray(v.assertions),
    "assertions cannot be decoded",
  );
  const ids = new Set(statements.map((s) => s.statementId));
  const assertions = new Map<
    string,
    BaselineAssessment["assertions"][number]
  >();
  for (const assertion of v.assertions) {
    requireAssessment(
      exactFields(assertion, ["statementId", "kind", "rationale"]) &&
        ids.has(assertion.statementId) &&
        ["existing-failure", "no-existing-failure", "unresolved"].includes(
          assertion.kind,
        ) &&
        line(assertion.rationale),
      "assertion cannot be decoded or names a non-executable statement",
    );
    requireAssessment(
      !assertions.has(assertion.statementId),
      "duplicates a statement",
    );
    requireAssessment(
      v.producer.kind !== "unsupplied" || assertion.kind === "unresolved",
      "unsupplied producer cannot resolve a statement",
    );
    assertions.set(assertion.statementId, { ...assertion });
  }
  return {
    schemaVersion: 1,
    contractId: contract.contractId,
    producer: { ...v.producer },
    assertions: statements
      .map(
        (s) =>
          assertions.get(s.statementId) ?? {
            statementId: s.statementId,
            kind: "unresolved" as const,
            rationale: "No assertion judgment supplied for this statement.",
          },
      )
      .sort(byStatementId),
  };
}

/** Independently compare the primitive's claimed story class with every active
 * assertion judgment, including failures supplied as requirements. English is
 * never reparsed here; uncertain judgments hold before primitive dispatch. */
export function baselineClass(
  contract: StoryContract,
  claimed?: "new" | "defect",
  assessment?: unknown,
) {
  let reviewed: BaselineAssessment;
  try {
    reviewed = decodeBaselineAssessment(contract, assessment);
  } catch {
    return {
      kind: "unresolved" as const,
      source: {
        contractId: contract.contractId,
        statementIds: executableStatements(contract).map((s) => s.statementId),
        rule: "active-existing-failure-assertion",
        assessmentHash: null,
      },
      findings: ["baseline assertion assessment is invalid or stale"],
    };
  }
  const unknown = reviewed.assertions.filter((a) => a.kind === "unresolved");
  const failures = reviewed.assertions.filter(
    (a) => a.kind === "existing-failure",
  );
  const kind = unknown.length
    ? ("unresolved" as const)
    : failures.length
      ? ("defect" as const)
      : ("new" as const);
  return {
    kind,
    source: {
      contractId: contract.contractId,
      statementIds: (unknown.length ? unknown : failures).map(
        (a) => a.statementId,
      ),
      rule: "active-existing-failure-assertion",
      assessmentHash: verticalHash(reviewed),
      producer: reviewed.producer,
    },
    findings:
      kind === "unresolved"
        ? ["baseline assertion classification is unresolved"]
        : claimed === "new" && kind === "defect"
          ? ["contract names failing behavior but baseline was classed new"]
          : [],
  };
}

/** Assertion facts select story kind independently of statement roles. A
 * requirement may name an actual failure; it must reproduce as a defect.
 * The host separately compares the primitive's claimed class with these facts. */
export function baselineStoryClass(
  contract: StoryContract,
  assessment?: unknown,
) {
  const checked = baselineClass(contract, undefined, assessment);
  return {
    ...checked,
    source: { ...checked.source, rule: "supplied-assertion-judgments" },
  };
}

export const VERTICAL_STEPS = [
  "bundle",
  "contract",
  "surfaces",
  "derived-order",
  "baseline",
  "source-change",
  "witnesses",
  "verification",
  "review",
  "preparation",
  "lint",
  "publish",
  "observation",
  "resolution",
] as const;
export type VerticalStep = (typeof VERTICAL_STEPS)[number] | "repair";
export interface VerticalCommand {
  readonly commandId: string;
  readonly step: VerticalStep;
  readonly round: number;
  readonly attempt: number;
  readonly episodeId: string;
}
export interface VerticalReceipt {
  readonly command: VerticalCommand;
  readonly result: "completed" | "NeedsHuman" | "refused" | "retry" | "repair";
  readonly value: JsonValue;
}
export interface VerticalState {
  binding: IntentBinding;
  workOrder: WorkOrder;
  continuation: ExecutableProgramV1;
  pending: VerticalCommand | null;
  receipts: VerticalReceipt[];
  terminal: {
    kind: "resolved" | "NeedsHuman" | "refused";
    step: VerticalStep;
    reason: string;
  } | null;
}
const stageCommand = (
  key: string,
  step: VerticalStep,
  round = 0,
  attempt = 0,
): VerticalCommand => ({
  commandId: `cmd_vertical_${verticalHash([key, step, round, attempt])}`,
  step,
  round,
  attempt,
  episodeId: `vertical_${key}_${step}_${round}_${attempt}`,
});
export function verticalProgram(key: string): ExecutableProgramV1 {
  const call = (
    step: VerticalStep,
    next: ExecutableProgramV1,
    round = 0,
    attempt = 0,
    outcomes: Record<string, ExecutableProgramV1> = {},
  ): ExecutableProgramV1 => {
    const command = stageCommand(key, step, round, attempt);
    return Program.Invoke(
      command.commandId,
      { kind: "Act", effect: `vertical.${step}`, payload: json(command) },
      {
        completed: next,
        NeedsHuman: Program.Done(),
        refused: Program.Done(),
        ...outcomes,
      },
    );
  };
  const sequence = (
    steps: readonly VerticalStep[],
    next: ExecutableProgramV1,
    round = 0,
  ) => steps.reduceRight((tail, step) => call(step, tail, round), next);
  const finish = sequence(
    ["preparation", "lint", "publish", "observation", "resolution"],
    Program.Done(),
  );
  const judge = (round: number): ExecutableProgramV1 => {
    const repair =
      round < 2
        ? call(
            "repair",
            sequence(["witnesses"], judge(round + 1), round + 1),
            round,
          )
        : Program.Done();
    const review = call("review", finish, round, 0, {
      retry: call("review", finish, round, 1, {
        repair,
        retry: Program.Done(),
      }),
      repair,
    });
    return call("verification", review, round, 0, { repair });
  };
  return sequence(
    [
      "bundle",
      "contract",
      "surfaces",
      "derived-order",
      "baseline",
      "source-change",
      "witnesses",
    ],
    judge(0),
  );
}
export function nextVerticalCommand(
  state: VerticalState,
): VerticalCommand | null {
  if (state.terminal || state.continuation.kind === "Done") return null;
  const selected = stepProgram(state.continuation, null, {
    now: 0,
    rngState: 0,
    predicates: {},
  });
  need(
    selected.intents.length === 1,
    "vertical continuation has no single Invoke",
  );
  return selected.intents[0]!.payload as unknown as VerticalCommand;
}
export function foldVertical(
  state: VerticalState | undefined,
  event: Event,
): VerticalState {
  const p = event.payload as unknown as Record<string, unknown>;
  need(event.actorId === "vertical-host", "foreign vertical event");
  if (event.type === "VerticalOpened") {
    const binding = p.binding as IntentBinding,
      workOrder = p.workOrder as WorkOrder;
    need(
      !state &&
        /^WO-\d+$/u.test(workOrder.workOrderId) &&
        verticalEqual(
          { ...workOrder, workOrderId: binding.workOrder.workOrderId },
          binding.workOrder,
        ) &&
        verticalEqual(
          p.continuation,
          verticalProgram((p.binding as IntentBinding).key),
        ),
      "vertical opening drift",
    );
    return {
      binding: p.binding as IntentBinding,
      workOrder: p.workOrder as WorkOrder,
      continuation: p.continuation as ExecutableProgramV1,
      pending: null,
      receipts: [],
      terminal: null,
    };
  }
  need(state && !state.terminal, "vertical event has no active opening");
  const result = structuredClone(state!);
  if (event.type === "VerticalCommandPersisted") {
    need(
      !result.pending && verticalEqual(p.command, nextVerticalCommand(result)),
      "vertical dispatch drift",
    );
    result.pending = p.command as VerticalCommand;
  } else if (event.type === "VerticalStepCompleted") {
    const receipt = p as unknown as VerticalReceipt;
    need(
      result.pending && verticalEqual(receipt.command, result.pending),
      "vertical receipt has no matching dispatch",
    );
    const allowed = [
      "completed",
      "NeedsHuman",
      "refused",
      ...(["review", "verification"].includes(receipt.command.step)
        ? ["repair"]
        : []),
      ...(receipt.command.step === "review" ? ["retry"] : []),
    ];
    need(
      allowed.includes(receipt.result) &&
        receipt.value &&
        typeof receipt.value === "object" &&
        !Array.isArray(receipt.value),
      "vertical receipt result cannot be decoded",
    );
    result.continuation = stepProgram(
      result.continuation,
      null,
      { now: event.occurredAt, rngState: 0, predicates: {} },
      {
        ...event,
        type: "CommandResult",
        payload: json({
          commandId: receipt.command.commandId,
          result: receipt.result,
        }),
      },
    ).residual;
    result.pending = null;
    result.receipts.push(receipt);
    if (result.continuation.kind === "Done") {
      const successful =
        receipt.command.step === "resolution" && receipt.result === "completed";
      const value = receipt.value as Record<string, JsonValue>;
      result.terminal = {
        kind: successful
          ? "resolved"
          : receipt.result === "refused"
            ? "refused"
            : "NeedsHuman",
        step: receipt.command.step,
        reason: successful
          ? "fresh observation and resolution reached the human-controlled terminal"
          : typeof value?.["reason"] === "string"
            ? value["reason"]
            : `${receipt.command.step} stopped after its bounded attempts`,
      };
    }
  } else throw new Error("unknown vertical event");
  return result;
}
