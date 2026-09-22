/** WO-100: a preauthorized portfolio and the pure derivation of bounded work
 * from WO-119 candidates. Nothing here reads a file, a clock or a process; the
 * resident owns activation and the WO-052/WO-054 hosts own every effect. */
import {
  canonicalStringify,
  fnv1a64,
  type AuthorityEnvelope,
  type AuthorityGrant,
  type CompiledPresencePhase,
  type CompiledPresencePolicy,
  type WorkOrder,
} from "@dotln/compiler";
import type { ProductSuggestion } from "./loadouts/entropy-reducer.js";
import {
  discoveryPath,
  WORK_CANDIDATE_KINDS,
  type WorkCandidate,
} from "./work-candidate.js";
import {
  SOURCE_CHANGE_ALLOWED,
  SOURCE_CHANGE_DENIED,
} from "./worker-protocol.js";

/** The 5S pieces that compile today: the Gardener's Seiri, the Entropy
 * Reducer's Seisō and its linked Seiketsu. Seiton and the rest join as
 * WO-093 compiles them. */
export const PORTFOLIO_MECHANICS = ["sort", "shine", "standardize"] as const;
export type PortfolioMechanic = (typeof PORTFOLIO_MECHANICS)[number];
export type CandidateKind = WorkCandidate["kind"];
/** Which piece owns each producer kind (product 05 §5S / 6S, WO-119). */
export const CANDIDATE_MECHANIC: Readonly<
  Record<CandidateKind, PortfolioMechanic>
> = {
  "failing-lint": "shine",
  "failing-test": "shine",
  "misplaced-file": "sort",
  "stale-generated": "sort",
  "repeated-repair": "standardize",
};
export interface PortfolioCeiling {
  /** Exact effects a derived order may carry in this presence phase. */
  readonly effects: readonly string[];
  /** Host-counted files the order may touch, including a proposed home. */
  readonly files: number;
}
export interface PortfolioBudget {
  readonly episodes: number;
  readonly wallMs: number;
  /** Counted only where an episode reports tokens. */
  readonly tokens?: number;
}
export interface Portfolio {
  readonly portfolioId: string;
  readonly version: number;
  /** `self` or a registered repository id (WO-069); orders bind to it. */
  readonly repo: string;
  readonly mechanics: readonly PortfolioMechanic[];
  /** Repository-relative files or directories derived orders may touch. */
  readonly surfaces: readonly string[];
  /** Keyed by compiled presence phase id; an absent phase derives nothing. */
  readonly phases: Readonly<Record<string, PortfolioCeiling>>;
  readonly budget: PortfolioBudget;
  /** Exact commands whose independent verification every derived order of
   * the kind requires. A kind without them yields `NeedsHuman`. */
  readonly verification: Readonly<
    Partial<Record<CandidateKind, readonly string[]>>
  >;
}
/** The resident's loadout field: a portfolio bound to the observed base. */
export interface PortfolioBinding {
  readonly definition: Portfolio;
  readonly baseCommit: string;
}
export interface DerivedWorkOrder {
  readonly candidateId: string;
  readonly mechanic: PortfolioMechanic;
  /** WO-120 provenance key: one durable identity per candidate and version. */
  readonly sourceId: string;
  readonly workOrder: WorkOrder;
  readonly surfaces: readonly string[];
  readonly size: { readonly files: number };
  readonly tests: readonly string[];
  readonly authorityEnvelope: AuthorityEnvelope;
  readonly grant: AuthorityGrant;
  /** Only a Sort move: the host checks the exact relocation (D006). */
  readonly relocation?: { readonly from: string; readonly to: string };
}
export type PortfolioDerivation =
  | { readonly kind: "order"; readonly order: DerivedWorkOrder }
  | {
      readonly kind: "ProductSuggestion";
      readonly candidateId: string;
      readonly reason: string;
      readonly suggestion: ProductSuggestion;
    }
  | {
      readonly kind: "NeedsHuman";
      readonly candidateId: string;
      readonly reason: string;
      readonly offending: string;
    }
  | {
      readonly kind: "deferred";
      readonly candidateId: string;
      readonly reason: string;
    };

const refuse = (detail: string): never => {
  throw new Error(`portfolio: ${detail}`);
};
const text = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= 200 &&
  !/[\x00-\x1f\x7f\u2028\u2029]/u.test(value);
const positive = (value: unknown): value is number =>
  Number.isSafeInteger(value) && (value as number) > 0;
const EFFECT = /^[a-z][a-z0-9-]*(?:\.[a-zA-Z0-9-]+)+$/u;
/** The source-change host's exact test-command grammar (WO-052). */
const COMMAND = /^[a-zA-Z0-9_./-]+(?: [a-zA-Z0-9_./=-]+)*$/u;
const object = (
  value: unknown,
  keys: readonly string[],
  label: string,
  required: readonly string[] = keys,
): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return refuse(`${label} must be an object`);
  const record = value as Record<string, unknown>;
  const extra = Object.keys(record).find((key) => !keys.includes(key));
  if (extra) return refuse(`${label} has unknown key ${JSON.stringify(extra)}`);
  const missing = required.find((key) => !Object.hasOwn(record, key));
  if (missing) return refuse(`${label} requires ${missing}`);
  return record;
};
const distinct = (
  value: unknown,
  label: string,
  check: (entry: unknown) => boolean,
): string[] => {
  if (
    !Array.isArray(value) ||
    !value.length ||
    value.length > 64 ||
    !value.every(check) ||
    new Set(value).size !== value.length
  )
    return refuse(`${label} must be a non-empty list of distinct valid values`);
  return [...(value as string[])];
};
const within = (surfaces: readonly string[], path: string): boolean =>
  surfaces.some(
    (surface) => path === surface || path.startsWith(`${surface}/`),
  );
const covers = (patterns: readonly string[], effect: string): boolean =>
  patterns.some(
    (pattern) =>
      pattern === effect ||
      (pattern.endsWith("*") && effect.startsWith(pattern.slice(0, -1))),
  );
const sorted = (values: Iterable<string>): string[] =>
  [...new Set(values)].sort();

/** Structural contract. Admission under the floor is `admitPortfolio`. */
export function decodePortfolio(value: unknown): Portfolio {
  const root = object(
    value,
    [
      "portfolioId",
      "version",
      "repo",
      "mechanics",
      "surfaces",
      "phases",
      "budget",
      "verification",
    ],
    "portfolio",
  );
  if (
    !text(root.portfolioId) ||
    !/^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(root.portfolioId)
  )
    refuse("portfolioId must be a safe identifier");
  if (!positive(root.version)) refuse("version must be a positive integer");
  if (!text(root.repo) || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(root.repo))
    refuse("repo must be self or a repository id");
  const mechanics = distinct(root.mechanics, "mechanics", (m) =>
    PORTFOLIO_MECHANICS.includes(m as PortfolioMechanic),
  ) as PortfolioMechanic[];
  const surfaces = distinct(root.surfaces, "surfaces", (path) => {
    try {
      discoveryPath(path);
      return true;
    } catch {
      return false;
    }
  });
  const phaseRecord = object(
    root.phases,
    Object.keys((root.phases ?? {}) as object),
    "phases",
  );
  const phaseIds = Object.keys(phaseRecord);
  if (!phaseIds.length || phaseIds.length > 16 || !phaseIds.every(text))
    refuse("phases must name one to sixteen presence phases");
  const phases: Record<string, PortfolioCeiling> = {};
  for (const phaseId of phaseIds) {
    const ceiling = object(
      phaseRecord[phaseId],
      ["effects", "files"],
      `phases.${phaseId}`,
    );
    const effects = distinct(
      ceiling.effects,
      `phases.${phaseId}.effects`,
      (effect) => typeof effect === "string" && EFFECT.test(effect),
    );
    if (!positive(ceiling.files) || (ceiling.files as number) > 1024)
      refuse(`phases.${phaseId}.files must be 1..1024`);
    phases[phaseId] = {
      effects: sorted(effects),
      files: ceiling.files as number,
    };
  }
  const budget = object(
    root.budget,
    ["episodes", "wallMs", "tokens"],
    "budget",
    ["episodes", "wallMs"],
  );
  if (
    !positive(budget.episodes) ||
    !positive(budget.wallMs) ||
    (budget.tokens !== undefined && !positive(budget.tokens))
  )
    refuse(
      "budget requires positive episodes and wallMs, and positive tokens when declared",
    );
  const verificationRecord = object(
    root.verification,
    WORK_CANDIDATE_KINDS,
    "verification",
    [],
  );
  const verification: Partial<Record<CandidateKind, readonly string[]>> = {};
  for (const [kind, commands] of Object.entries(verificationRecord))
    verification[kind as CandidateKind] = distinct(
      commands,
      `verification.${kind}`,
      (command) =>
        typeof command === "string" &&
        command.length <= 320 &&
        COMMAND.test(command),
    );
  return {
    portfolioId: root.portfolioId as string,
    version: root.version as number,
    repo: root.repo as string,
    mechanics: sorted(mechanics) as PortfolioMechanic[],
    surfaces: sorted(surfaces),
    phases,
    budget: {
      episodes: budget.episodes as number,
      wallMs: budget.wallMs as number,
      ...(budget.tokens === undefined
        ? {}
        : { tokens: budget.tokens as number }),
    },
    verification,
  };
}

export function decodePortfolioBinding(value: unknown): PortfolioBinding {
  const binding = object(value, ["definition", "baseCommit"], "binding");
  // WO-052 and WO-120 need the full object id, never a branch name, and
  // WO-054 prepares only a 40-hex base, so a 64-hex order could never verify.
  if (
    typeof binding.baseCommit !== "string" ||
    !/^[a-f0-9]{40}$/u.test(binding.baseCommit)
  )
    refuse("binding.baseCommit must be a full 40-hex commit id");
  return {
    definition: decodePortfolio(binding.definition),
    baseCommit: binding.baseCommit as string,
  };
}

/** Validated under the floor: every ceiling names a compiled phase and stays
 * inside that phase's effective envelope and host-counted change size, which
 * WO-067 already keeps inside the compiled base envelope. */
export function admitPortfolio(
  portfolio: Portfolio,
  policy: CompiledPresencePolicy,
  floor: AuthorityEnvelope,
): Portfolio {
  for (const [phaseId, ceiling] of Object.entries(portfolio.phases)) {
    const phase = policy.phases.find((p) => p.phaseId === phaseId);
    if (!phase)
      refuse(`phase ${phaseId} is not compiled in policy ${policy.policyId}`);
    const envelope = phase!.effectiveEnvelope;
    for (const effect of ceiling.effects)
      for (const bound of [envelope, floor])
        if (
          !covers(bound.allowedEffects, effect) ||
          covers(bound.deniedEffects, effect)
        )
          refuse(
            `phase ${phaseId} ceiling widens ${bound.authorityEnvelopeId} with ${effect}`,
          );
    const limit = Math.min(
      phase!.scope.changeSize.files,
      envelope.resourceLimits["files"] ?? Infinity,
      floor.resourceLimits["files"] ?? Infinity,
    );
    if (ceiling.files > limit)
      refuse(
        `phase ${phaseId} ceiling of ${ceiling.files} files exceeds the phase limit of ${limit}`,
      );
    // WO-052 consumes one `writers` unit per source change.
    if (!((envelope.resourceLimits["writers"] ?? 0) >= 1))
      refuse(`phase ${phaseId} envelope grants no writer for a source change`);
  }
  return portfolio;
}

/** A derived order's envelope: the portfolio's ceiling intersected with the
 * compiled phase, and never able to carry an effect WO-052 refuses. */
export function portfolioEnvelope(
  portfolio: Portfolio,
  phase: CompiledPresencePhase,
): AuthorityEnvelope {
  const ceiling = portfolio.phases[phase.phaseId];
  if (!ceiling) return refuse(`no ceiling for phase ${phase.phaseId}`);
  const envelope = phase.effectiveEnvelope;
  const files = Math.min(
    ceiling.files,
    phase.scope.changeSize.files,
    envelope.resourceLimits["files"] ?? Infinity,
  );
  return {
    ...envelope,
    authorityEnvelopeId: `portfolio:${JSON.stringify([portfolio.portfolioId, portfolio.version, phase.phaseId])}`,
    allowedEffects: sorted(
      ceiling.effects.filter(
        (effect) =>
          covers(envelope.allowedEffects, effect) &&
          !covers(envelope.deniedEffects, effect) &&
          (SOURCE_CHANGE_ALLOWED as readonly string[]).includes(effect),
      ),
    ),
    deniedEffects: sorted([...envelope.deniedEffects, ...SOURCE_CHANGE_DENIED]),
    resourceLimits: { ...envelope.resourceLimits, files },
  };
}

/** The portfolio's verification requirement as the derived contract states it;
 * WO-054 judges the order against exactly this criterion. */
export const portfolioVerificationCriterion = (tests: readonly string[]) =>
  `Independent verification runs ${tests.join(", ")} on the changed tree and every command passes.`;

interface Obligation {
  readonly objective: string;
  readonly criteria: readonly string[];
  readonly effects: readonly string[];
  readonly surfaces: readonly string[];
}
const WRITE = ["git.local", "repo.read", "repo.write", "shell.run"];
/** Each mechanic's obligation over one candidate: the derived contract. */
function obligation(candidate: WorkCandidate): Obligation {
  const paths = candidate.paths.join(", ");
  switch (candidate.kind) {
    case "failing-lint":
    case "failing-test": {
      const check = candidate.kind.slice("failing-".length);
      return {
        objective: `Shine: make the failing ${check} check pass by changing only ${paths}.`,
        criteria: [`The change touches only ${paths}.`],
        effects: WRITE,
        surfaces: candidate.paths,
      };
    }
    case "misplaced-file":
      return {
        objective: `Sort: move ${paths} to its declared home ${candidate.proposedHome} with its bytes unchanged.`,
        criteria: [
          `${candidate.proposedHome} holds exactly the bytes observed at ${paths}, which is moved rather than copied; no content is removed and no other path changes.`,
        ],
        effects: WRITE,
        surfaces: sorted([...candidate.paths, candidate.proposedHome!]),
      };
    case "stale-generated":
      return {
        objective: `Sort: remove the unreferenced generated file ${paths}.`,
        criteria: [`${paths} no longer exists and nothing else changes.`],
        // Sort never deletes at first authority, and no writer carries deletion.
        effects: ["repo.delete"],
        surfaces: candidate.paths,
      };
    case "repeated-repair":
      return {
        objective: `Standardize: turn the recurring repair of ${paths} into an executable guard within ${paths}.`,
        criteria: [
          `A guard within ${paths} fails on the recurring defect and passes on the changed tree.`,
        ],
        effects: WRITE,
        surfaces: candidate.paths,
      };
  }
}

function suggestion(
  candidate: WorkCandidate,
  portfolio: Portfolio,
  reason: string,
): ProductSuggestion {
  return {
    suggestionId: candidate.candidateId.replace(/[^A-Za-z0-9._-]+/gu, "-"),
    submittedBy: `resident portfolio ${portfolio.portfolioId} v${portfolio.version}`,
    problemOrOpportunity: `${candidate.kind} observed on ${candidate.paths.join(", ")}`,
    scope: [
      ...candidate.paths,
      ...(candidate.proposedHome ? [candidate.proposedHome] : []),
    ].join(", "),
    evidenceRefs: [...candidate.evidence],
    affectedUsers: ["operator"],
    affectedSystems: [portfolio.repo],
    expectedValue:
      "A human may promote this candidate into reviewed work or an explicit portfolio edit.",
    altitude: 2,
    uncertainty:
      "Observed by the executable producer; no repair was attempted or verified.",
    risks: [],
    alternatives: [],
    duplicationHints: [candidate.candidateId],
    urgencyRationale: reason,
  };
}

/** Pure: one candidate becomes one bounded order, a suggestion, a human
 * question, or waits for a phase whose ceiling admits it. Order is stable. */
export function deriveWorkOrders(
  candidates: readonly WorkCandidate[],
  portfolio: Portfolio,
  phase: CompiledPresencePhase,
  target: { readonly baseCommit: string },
): PortfolioDerivation[] {
  const ceiling = portfolio.phases[phase.phaseId];
  return candidates.map((candidate): PortfolioDerivation => {
    const { candidateId } = candidate;
    const mechanic = CANDIDATE_MECHANIC[candidate.kind];
    const outside = (reason: string): PortfolioDerivation => ({
      kind: "ProductSuggestion",
      candidateId,
      reason,
      suggestion: suggestion(candidate, portfolio, reason),
    });
    const human = (offending: string, reason: string): PortfolioDerivation => ({
      kind: "NeedsHuman",
      candidateId,
      offending,
      reason,
    });
    if (!portfolio.mechanics.includes(mechanic))
      return outside(
        `mechanic ${mechanic} is not preauthorized by portfolio ${portfolio.portfolioId}`,
      );
    const duty = obligation(candidate);
    const stray = duty.surfaces.find(
      (path) => !within(portfolio.surfaces, path),
    );
    if (stray !== undefined)
      return outside(`path ${stray} is outside the portfolio surfaces`);
    const carried = duty.effects.find(
      (effect) =>
        !(SOURCE_CHANGE_ALLOWED as readonly string[]).includes(effect),
    );
    if (carried !== undefined)
      return human(
        carried,
        `no source-change order carries ${carried}; ${mechanic} needs a human decision`,
      );
    const tests = portfolio.verification[candidate.kind];
    if (!tests?.length)
      return human(
        candidate.kind,
        `portfolio ${portfolio.portfolioId} declares no verification command for ${candidate.kind}`,
      );
    const files = duty.surfaces.length;
    const admits = (c: PortfolioCeiling) =>
      files <= c.files &&
      duty.effects.every((effect) => c.effects.includes(effect));
    const admitting = Object.entries(portfolio.phases)
      .filter(([, c]) => admits(c))
      .map(([id]) => id);
    if (!admitting.length) {
      const effect = duty.effects.find(
        (e) =>
          !Object.values(portfolio.phases).some((c) => c.effects.includes(e)),
      );
      return effect !== undefined
        ? human(effect, `no portfolio phase allows ${effect}`)
        : human("files", `${files} files exceed every portfolio phase ceiling`);
    }
    if (!ceiling || !admits(ceiling))
      return {
        kind: "deferred",
        candidateId,
        reason: `phase ${phase.phaseId} does not admit ${files} files with ${duty.effects.join(", ")}; admitted in ${admitting.join(", ")}`,
      };
    const authorityEnvelope = portfolioEnvelope(portfolio, phase);
    const missing = duty.effects.find(
      (effect) => !authorityEnvelope.allowedEffects.includes(effect),
    );
    if (missing !== undefined)
      return human(
        missing,
        `phase ${phase.phaseId} envelope does not allow ${missing}`,
      );
    // The key names everything the phase-free contract depends on, so a new
    // base or version is a new durable order, never a WO-120 contract clash.
    const sourceId = `portfolio:${portfolio.portfolioId}@${portfolio.version}:${target.baseCommit}:${candidateId}`;
    const grant: AuthorityGrant = {
      grantId: `portfolio:${portfolio.portfolioId}`,
      version: portfolio.version,
      grantedBy: "host-policy",
      effects: [...duty.effects],
      operations: [...duty.effects],
      repo: portfolio.repo,
      reason: `Preauthorized portfolio ${portfolio.portfolioId} v${portfolio.version}, phase ${phase.phaseId}, candidate ${candidateId}`,
    };
    const facts = [
      `Candidate ${candidateId} (${candidate.kind}) observed on ${candidate.paths.join(", ")}.`,
      `Evidence: ${candidate.evidence.join(", ")}.`,
      ...(candidate.proposedHome
        ? [`Declared home: ${candidate.proposedHome}.`]
        : []),
    ];
    // Phase-free: one WO-120 identity per candidate, whichever phase derives it.
    // The phase's envelope and the grant's reason live on the activation.
    const workOrder: WorkOrder = {
      workOrderId: `portfolio_${fnv1a64(canonicalStringify(sourceId))}`,
      objective: duty.objective,
      acceptanceCriteria: [
        portfolioVerificationCriterion(tests),
        ...duty.criteria,
      ],
      knownFacts: facts,
      decisions: [
        `Authority: ${grant.grantedBy} grant ${grant.grantId} v${grant.version}, never wider than the activating phase.`,
        `Mechanic: ${mechanic}.`,
      ],
      constraints: [
        `Change only ${duty.surfaces.join(", ")}.`,
        `Touch at most ${files} files.`,
      ],
      nonGoals: [
        "Changing any path outside the declared surfaces.",
        "Publishing, pushing, or removing content; a Sort move keeps every byte at its declared home.",
      ],
      repo: portfolio.repo,
      baseCommit: target.baseCommit,
      allowedOperations: [...duty.effects],
      prohibitedOperations: sorted([...SOURCE_CHANGE_DENIED, "repo.delete"]),
      requiredEvidence: [...tests],
      outputContract: {
        type: "SourceChangeObserved",
        verification: "WO-054 independent verification of the named tests",
      },
    };
    return {
      kind: "order",
      order: {
        candidateId,
        mechanic,
        sourceId,
        workOrder,
        surfaces: [...duty.surfaces],
        size: { files },
        tests: [...tests],
        authorityEnvelope,
        grant,
        ...(candidate.kind === "misplaced-file"
          ? {
              relocation: {
                from: candidate.paths[0]!,
                to: candidate.proposedHome!,
              },
            }
          : {}),
      },
    };
  });
}

/** What the resident records when it activates a derived order, recomputed
 * by the fold from the persisted discovery, binding, phase and budget. */
export interface PortfolioActivation {
  readonly portfolioId: string;
  readonly version: number;
  readonly phaseId: string;
  readonly discoveryEpisodeId: string;
  readonly order: DerivedWorkOrder;
  readonly provenance: { readonly kind: "runtime"; readonly sourceId: string };
  readonly outcomes: {
    readonly orders: readonly string[];
    readonly suggestions: readonly ProductSuggestion[];
    readonly needsHuman: readonly {
      readonly candidateId: string;
      readonly offending: string;
      readonly reason: string;
    }[];
    readonly deferred: readonly {
      readonly candidateId: string;
      readonly reason: string;
    }[];
  };
}
export function summarizeDerivations(
  derivations: readonly PortfolioDerivation[],
): PortfolioActivation["outcomes"] {
  const orders: string[] = [];
  const suggestions: ProductSuggestion[] = [];
  const needsHuman: {
    candidateId: string;
    offending: string;
    reason: string;
  }[] = [];
  const deferred: { candidateId: string; reason: string }[] = [];
  for (const d of derivations)
    if (d.kind === "order") orders.push(d.order.candidateId);
    else if (d.kind === "ProductSuggestion") suggestions.push(d.suggestion);
    else if (d.kind === "NeedsHuman")
      needsHuman.push({
        candidateId: d.candidateId,
        offending: d.offending,
        reason: d.reason,
      });
    else deferred.push({ candidateId: d.candidateId, reason: d.reason });
  return { orders, suggestions, needsHuman, deferred };
}

/** Host-recorded result of one activated order: the WO-120 identity, the
 * WO-052 effect and the WO-054 verdict. The worker's own claim is absent. */
export interface PortfolioObservation {
  readonly workOrderId: string;
  readonly workOrderPath: string;
  readonly change:
    | {
        readonly status: "observed";
        readonly commit: string;
        readonly branch: string;
        readonly diffHash: string;
      }
    | { readonly status: "refused"; readonly reason: string };
  readonly verification:
    | {
        readonly verdict: "pass" | "fail";
        readonly criteria: number;
        readonly passed: number;
        readonly findings: number;
      }
    | { readonly verdict: "not-run"; readonly reason: string };
  /** Present only where a transport reported tokens. */
  readonly tokens?: number;
}
const count = (value: unknown): boolean =>
  Number.isSafeInteger(value) && (value as number) >= 0;
export function assertPortfolioObservation(
  value: unknown,
): asserts value is PortfolioObservation {
  const v = object(
    value,
    ["workOrderId", "workOrderPath", "change", "verification", "tokens"],
    "observation",
    ["workOrderId", "workOrderPath", "change", "verification"],
  );
  if (
    typeof v.workOrderId !== "string" ||
    !/^WO-\d{3}$/u.test(v.workOrderId) ||
    typeof v.workOrderPath !== "string" ||
    !v.workOrderPath.endsWith(`/${v.workOrderId}-derived.md`) ||
    (v.tokens !== undefined && !count(v.tokens))
  )
    refuse("observation names no WO-120 identity");
  const change = object(
    v.change,
    ["status", "commit", "branch", "diffHash", "reason"],
    "observation.change",
    ["status"],
  );
  if (
    change.status === "observed"
      ? !(
          text(change.commit) &&
          text(change.branch) &&
          text(change.diffHash) &&
          change.reason === undefined
        )
      : !(
          change.status === "refused" &&
          text(change.reason) &&
          Object.keys(change).length === 2
        )
  )
    refuse("observation change is malformed");
  const verification = object(
    v.verification,
    ["verdict", "criteria", "passed", "findings", "reason"],
    "observation.verification",
    ["verdict"],
  );
  if (
    verification.verdict === "not-run"
      ? !(text(verification.reason) && Object.keys(verification).length === 2)
      : !(
          ["pass", "fail"].includes(verification.verdict as string) &&
          count(verification.criteria) &&
          count(verification.passed) &&
          count(verification.findings) &&
          (verification.passed as number) <=
            (verification.criteria as number) &&
          verification.reason === undefined
        )
  )
    refuse("observation verification is malformed");
  if (verification.verdict !== "not-run" && change.status !== "observed")
    refuse("verification without an observed change");
}
/** Only an admitted independent pass over an observed change advances. */
export const portfolioObservationVerified = (o: PortfolioObservation) =>
  o.change.status === "observed" &&
  o.verification.verdict === "pass" &&
  o.verification.criteria > 0 &&
  o.verification.passed === o.verification.criteria &&
  o.verification.findings === 0;
