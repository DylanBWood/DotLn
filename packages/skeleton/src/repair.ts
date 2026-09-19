import {
  canonicalStringify,
  copyFinding,
  fnv1a64,
  repositoryPath,
  type AcceptanceCriterion,
  type AuthorityGrant,
  type NamedVerificationTest,
  type VerificationFinding,
  type VerificationEvidence,
  type VerificationSubject,
  type WorktreeVerificationContract,
} from "@dotln/compiler";
import {
  Program,
  type AuthorityEnvelope,
  type Command,
  type EventDraft,
  type ExecutableProgramV1,
  type JsonValue,
  type WorkOrder,
} from "@dotln/kernel";

export const REPAIR_HOST = "repair-host";
export const repairEventTypes = [
  "RepairOpened",
  "RepairTick",
  "RepairCommandPersisted",
  "RepairCommandResult",
  "RepairDerived",
  "RepairCompleted",
  "RepairExhausted",
  "NeedsHuman",
] as const;
export interface RepairOriginal {
  readonly workOrder: WorkOrder;
  readonly authorityEnvelope: AuthorityEnvelope;
  readonly surfaces: readonly string[];
  readonly tests: readonly NamedVerificationTest[];
  readonly criteria: readonly AcceptanceCriterion[];
  readonly roundLimit?: number;
}
/** Scope is admitted separately from verifier output. The registry is host-owned. */
export interface RepairScopeGrant {
  readonly grant: AuthorityGrant;
  readonly surfaces: readonly string[];
  readonly tests: readonly string[];
}
export interface RepairGrants {
  readonly requested: readonly RepairScopeGrant[];
  readonly registry: readonly RepairScopeGrant[];
}
export const noRepairGrants: RepairGrants = { requested: [], registry: [] };
export interface RepairOrder extends RepairOriginal {
  readonly contract: WorktreeVerificationContract;
  readonly contractHash: string;
  readonly round: number;
  readonly executionBaseCommit: string;
  readonly finding: VerificationFinding;
  readonly grantIds: readonly string[];
}
export type RepairDerivation =
  | { readonly kind: "derived"; readonly order: RepairOrder }
  | {
      readonly kind: "NeedsHuman";
      readonly reason: string;
      readonly offending: string;
    };
export const repairContract = (
  order: WorkOrder,
): WorktreeVerificationContract => ({
  workOrderId: order.workOrderId,
  objective: order.objective,
  acceptanceCriteria: [...order.acceptanceCriteria],
  constraints: [...order.constraints],
  nonGoals: [...order.nonGoals],
  requiredEvidence: [...order.requiredEvidence],
});
export const repairHash = (value: unknown): string =>
  `fnv1a64:${fnv1a64(canonicalStringify(value))}`;
export const repairEqual = (a: unknown, b: unknown): boolean =>
  canonicalStringify(a) === canonicalStringify(b);
const unique = (values: readonly string[]) => [...new Set(values)].sort();
export const repairContains = (
  surfaces: readonly string[],
  path: string,
): boolean =>
  surfaces.some(
    (surface) => path === surface || path.startsWith(`${surface}/`),
  );

/** Pure derivation: evidence IDs never become filesystem paths or shell prose. */
export function deriveRepairOrder(
  findingInput: VerificationFinding,
  input: RepairOriginal & {
    readonly subject: VerificationSubject;
    readonly round: number;
  },
  grants: RepairGrants = noRepairGrants,
): RepairDerivation {
  const needs = (offending: string, reason: string): RepairDerivation => ({
    kind: "NeedsHuman",
    offending,
    reason,
  });
  if (!findingInput?.evidenceRefs?.length)
    return needs("evidenceRefs", "finding has no evidence references");
  let finding: VerificationFinding;
  try {
    finding = copyFinding(findingInput);
  } catch {
    return needs("finding", "malformed finding");
  }
  if (finding.severity !== "blocking")
    return needs(
      finding.findingId,
      "automatic repair requires a blocking finding",
    );
  const limit = input.roundLimit ?? 2;
  if (
    !Number.isSafeInteger(limit) ||
    limit < 0 ||
    !Number.isSafeInteger(input.round) ||
    input.round < 0 ||
    input.round >= limit
  )
    return needs("roundLimit", "repair round limit reached or invalid");
  const evidence = finding.evidenceRefs.map((id) =>
    input.subject.evidence.find((e) => e.evidenceId === id),
  );
  for (let i = 0; i < evidence.length; i++) {
    const witness = evidence[i];
    if (
      !witness ||
      witness.criterionId !== finding.criterionId ||
      witness.subjectRevision !== input.subject.revision
    )
      return needs(
        finding.evidenceRefs[i]!,
        "missing or foreign evidence reference",
      );
  }
  const witnesses = evidence.filter(
    (e): e is VerificationEvidence => e !== undefined,
  );
  if (
    !witnesses.some(
      (e) =>
        e.outcome === "fail" &&
        e.observed === finding.observed &&
        e.expected === finding.expected,
    )
  )
    return needs(finding.findingId, "finding lacks its adverse host witness");
  const surfaces = unique([
    ...finding.likelySurface,
    ...witnesses.flatMap((e) => e.codeSurfaces),
  ]);
  const commands: string[] = [];
  for (const step of finding.reproductionSteps) {
    const witness = witnesses.find((e) => e.reproductionSteps.includes(step));
    const command =
      witness?.hostTest?.command ?? witness?.automatedTest ?? step;
    if (witness?.hostTest && witness.automatedTest !== command)
      return needs(step, "host test command differs from evidence");
    commands.push(command);
  }
  const tests = unique(commands);
  const admitted: RepairScopeGrant[] = [];
  for (const requested of grants.requested) {
    const g = requested.grant;
    if (
      !g ||
      !g.grantId ||
      !Number.isSafeInteger(g.version) ||
      g.version < 1 ||
      !["operator", "host-policy", "registered-repository"].includes(
        g.grantedBy,
      ) ||
      !g.reason ||
      g.repo !== input.workOrder.repo ||
      !g.effects.length ||
      g.effects.some(
        (e) =>
          e.includes("*") ||
          !input.authorityEnvelope.allowedEffects.includes(e),
      ) ||
      (g.operations ?? []).some(
        (e) =>
          e.includes("*") || !input.workOrder.allowedOperations.includes(e),
      ) ||
      !grants.registry.some((entry) => repairEqual(entry, requested))
    )
      return needs(
        g?.grantId ?? "grant",
        "scope grant is not admitted by the host registry",
      );
    if (admitted.some((entry) => entry.grant.grantId === g.grantId))
      return needs(g.grantId, "duplicate grant");
    admitted.push(requested);
  }
  const used = new Set<string>();
  for (const path of surfaces) {
    if (!repositoryPath(path)) return needs(path, "invalid repair path");
    if (!repairContains(input.surfaces, path)) {
      const grant = admitted.find(
        (g) =>
          g.surfaces.includes(path) &&
          g.grant.effects.includes("repo.write") &&
          g.grant.operations?.includes("repo.write"),
      );
      if (!grant) return needs(path, "path outside original surfaces");
      used.add(grant.grant.grantId);
    }
  }
  for (const command of tests) {
    if (
      !/^[a-zA-Z0-9_./][a-zA-Z0-9_./-]*(?: [a-zA-Z0-9_./=-]+)*$/u.test(command)
    )
      return needs(command, "reproduction is not an exact named command");
    if (!input.tests.some((test) => test.command === command)) {
      const grant = admitted.find(
        (g) =>
          g.tests.includes(command) &&
          g.grant.effects.includes("shell.run") &&
          g.grant.operations?.includes("shell.run"),
      );
      if (!grant) return needs(command, "command outside original named tests");
      used.add(grant.grant.grantId);
    }
  }
  // Every consumed grant is exactly the expansion, not a wildcard authority source.
  for (const g of admitted.filter((g) => used.has(g.grant.grantId))) {
    if (
      g.surfaces.some(
        (p) => !surfaces.includes(p) || repairContains(input.surfaces, p),
      ) ||
      g.tests.some(
        (c) => !tests.includes(c) || input.tests.some((t) => t.command === c),
      )
    )
      return needs(g.grant.grantId, "grant scope exceeds the exact expansion");
  }
  const contract = repairContract(input.workOrder);
  const round = input.round + 1;
  const order: RepairOrder = {
    workOrder: {
      ...input.workOrder,
      workOrderId: `${input.workOrder.workOrderId}_repair_${round}`,
      knownFacts: [],
      decisions: [],
    },
    authorityEnvelope: input.authorityEnvelope,
    surfaces,
    tests: tests.map(
      (command) =>
        input.tests.find((t) => t.command === command) ?? {
          criterionId: finding.criterionId,
          checkId: `grant:${command}`,
          command,
        },
    ),
    criteria: input.criteria,
    roundLimit: limit,
    contract,
    contractHash: repairHash(contract),
    round,
    executionBaseCommit: input.subject.revision,
    finding,
    grantIds: [...used].sort(),
  };
  // JSON detachment prevents a caller mutating an admitted order after derivation.
  return {
    kind: "derived",
    order: JSON.parse(JSON.stringify(order)) as RepairOrder,
  };
}

export interface RepairState {
  readonly workstreamId: string;
  readonly original: RepairOriginal;
  readonly grants: RepairGrants;
  readonly baseline: VerificationSubject;
  readonly subject: VerificationSubject;
  readonly round: number;
  readonly currentCommit: string;
  readonly continuation: ExecutableProgramV1;
  readonly pending: Command | null;
  readonly emission: EventDraft | null;
  readonly order: RepairOrder | null;
  readonly finding: VerificationFinding | null;
  readonly verified: boolean;
  readonly status: "running" | "complete" | "exhausted" | "needs-human";
  readonly reason: string | null;
}
export function repairEvent(
  state: Pick<RepairState, "workstreamId" | "round" | "finding">,
  type: string,
): EventDraft {
  return {
    schemaVersion: 1,
    type,
    actorId: REPAIR_HOST,
    workstreamId: state.workstreamId,
    occurredAt: 0,
    payload: {
      round: state.round,
      finding: state.finding as unknown as JsonValue,
    },
  };
}
export function repairCommand(
  state: Pick<RepairState, "workstreamId" | "round">,
  kind: "write" | "verify",
): Command {
  return {
    commandId: `cmd_${repairHash([state.workstreamId, state.round, kind]).slice(8)}`,
    workstreamId: state.workstreamId,
    episodeId: `repair_${kind}_${state.round}`,
    intent: {
      kind: "Act",
      effect: kind === "write" ? "repo.write" : "verification.evaluate",
      payload: { round: state.round, kind },
    },
  };
}
export function repairVerificationProgram(
  state: RepairState,
): ExecutableProgramV1 {
  const command = repairCommand(state, "verify");
  const emit = (type: string) =>
    Program.Emit(repairEvent(state, type), Program.Done());
  return Program.Invoke(command.commandId, command.intent, {
    completed: Program.Guard(
      { registryId: "repair.verified", version: 1 },
      emit("RepairCompleted"),
      Program.Guard(
        { registryId: "repair.remaining", version: 1 },
        emit("RepairDerived"),
        emit("RepairExhausted"),
      ),
    ),
  });
}
export function repairRoundProgram(state: RepairState): ExecutableProgramV1 {
  const command = repairCommand(state, "write");
  return Program.Sequence([
    Program.Invoke(command.commandId, command.intent, {
      accepted: Program.Done(),
    }),
    Program.Await(
      { type: "SourceChangeObserved", correlationId: command.commandId },
      { kind: "After", delayMs: 180_000 },
      Program.Done(),
    ),
    repairVerificationProgram(state),
  ]);
}

/** Terminal exhaustion and containment refusals never offer another dispatch. */
export const repairNextAction = (
  state: RepairState,
): "run" | "human" | "none" =>
  state.status === "running"
    ? "run"
    : state.status === "complete"
      ? "none"
      : "human";
