import { canonicalStringify } from "./normalize.js";
import type {
  AuthorityEnvelope,
  CompilationEnvironment,
  CompileDiagnostic,
  CompiledPresencePolicy,
  CompiledProgram,
  LoadoutGraph,
  PredicateRef,
  PresenceTransition,
} from "./types.js";

const unique = (values: readonly string[]): readonly string[] =>
  [...new Set(values)].sort();
const covers = (pattern: string, effect: string): boolean =>
  pattern === effect ||
  (pattern.endsWith("*") && effect.startsWith(pattern.slice(0, -1)));
const ref = (
  registryId: string,
  policyId: string,
  phaseId?: string,
): PredicateRef => ({
  registryId,
  version: 1,
  params: { policyId, ...(phaseId === undefined ? {} : { phaseId }) },
});

export function compilePresence(
  graph: LoadoutGraph,
  base: CompiledProgram,
  environment: CompilationEnvironment,
): Readonly<{
  policies: readonly CompiledPresencePolicy[];
  diagnostics: readonly CompileDiagnostic[];
}> {
  const diagnostics: CompileDiagnostic[] = [];
  const ceiling = base.authorityEnvelope;
  const policies = (graph.presence ?? []).map(
    (policy): CompiledPresencePolicy => {
      const returned = ref("dotln.presence.returned", policy.policyId);
      const first = policy.phases[0]!.phaseId;
      const transitions: PresenceTransition[] = [
        {
          from: "present",
          on: "absence",
          to: first,
          guard: "recorded-presence",
          actions: ["reset-progress", "arm-phase"],
        },
        {
          from: "expired",
          on: "return",
          to: "present",
          guard: "recorded-presence",
          actions: ["preserve-foreground"],
        },
      ];
      const phases = policy.phases.map((phase, index) => {
        const narrowing = phase.envelope;
        const widening = (field: string, detail: string) =>
          diagnostics.push({
            code: "AUTHORITY WIDENING",
            message: `AUTHORITY WIDENING: presence policy "${policy.policyId}" phase "${phase.phaseId}" envelope.${field} ${detail}.`,
            missingCapabilities: [],
            corrections: [],
          });
        for (const effect of narrowing.allowedEffects ?? []) {
          if (
            !ceiling.allowedEffects.some((pattern) =>
              covers(pattern, effect),
            ) ||
            ceiling.deniedEffects.some((pattern) => covers(pattern, effect))
          )
            widening(
              "allowedEffects",
              `allows "${effect}" outside the compiled base`,
            );
        }
        for (const [key, quantity] of Object.entries(
          narrowing.resourceLimits ?? {},
        ))
          if (
            quantity >
            (Object.hasOwn(ceiling.resourceLimits, key)
              ? ceiling.resourceLimits[key]!
              : 0)
          )
            widening(
              "resourceLimits",
              `raises "${key}" above the compiled base`,
            );
        if (
          narrowing.expiresAt !== undefined &&
          narrowing.expiresAt > ceiling.expiresAt
        )
          widening("expiresAt", "extends the compiled base expiry");
        const effectiveEnvelope: AuthorityEnvelope = {
          ...ceiling,
          authorityEnvelopeId: `presence:${JSON.stringify([policy.policyId, phase.phaseId, ceiling.authorityEnvelopeId])}`,
          allowedEffects: narrowing.allowedEffects ?? ceiling.allowedEffects,
          deniedEffects: unique([
            ...ceiling.deniedEffects,
            ...(narrowing.deniedEffects ?? []),
          ]),
          resourceLimits: {
            ...ceiling.resourceLimits,
            ...narrowing.resourceLimits,
          },
          requiredEvidence: unique([
            ...ceiling.requiredEvidence,
            ...(narrowing.requiredEvidence ?? []),
          ]),
          expiresAt: narrowing.expiresAt ?? ceiling.expiresAt,
          revocationEventTypes: unique([
            ...ceiling.revocationEventTypes,
            ...(narrowing.revocationEventTypes ?? []),
          ]),
          revocationConditions: unique(
            [
              ...(ceiling.revocationConditions ?? []),
              ...(narrowing.revocationConditions ?? []),
            ].map((value) => canonicalStringify(value)),
          ).map((value) => JSON.parse(value) as PredicateRef),
        };
        const activationCondition = ref(
          "dotln.presence.phase-ready",
          policy.policyId,
          phase.phaseId,
        );
        const next = policy.phases[index + 1]?.phaseId ?? first;
        transitions.push(
          {
            from: phase.phaseId,
            on: "verified-success",
            to: next,
            guard: "current-policy-episode-while-absent",
            actions: [
              "cancel-pending",
              ...(index === policy.phases.length - 1
                ? ["reset-progress" as const]
                : []),
              "arm-phase",
            ],
          },
          {
            from: phase.phaseId,
            on: "failure",
            to: first,
            guard: "current-policy-episode-while-absent",
            actions: ["cancel-pending", "reset-progress", "arm-phase"],
          },
          {
            from: phase.phaseId,
            on: "return",
            to: "present",
            guard: "recorded-presence",
            actions: [
              "cancel-pending",
              "reset-progress",
              ...(phase.discretionary
                ? [`${phase.inFlightOnReturn}-discretionary` as const]
                : []),
              "preserve-foreground",
            ],
          },
          {
            from: phase.phaseId,
            on: "idle-expired",
            to: "expired",
            guard: "idle-deadline-while-absent",
            actions: [
              "cancel-pending",
              "expire-phase",
              "reset-progress",
              "preserve-foreground",
            ],
          },
        );
        const missingCapabilities = phase.requiredCapabilities.filter(
          (capability) => !environment.capabilities.includes(capability),
        );
        return {
          ...phase,
          effectiveEnvelope,
          cadence: {
            kind: "Gate" as const,
            cadence:
              "cadence" in phase.entry
                ? phase.entry.cadence
                : {
                    kind: "Gate" as const,
                    cadence: { kind: "After" as const, delayMs: 0 },
                    conditionRef: phase.entry.condition,
                  },
            conditionRef: activationCondition,
          },
          cancelOn: [returned],
          statechartGate: {
            activationCondition,
            interruptionCondition: {
              registryId: "dotln.presence.interrupt-phase",
              version: 1,
              params: {
                policyId: policy.policyId,
                phaseId: phase.phaseId,
                discretionary: phase.discretionary,
                inFlightOnReturn: phase.inFlightOnReturn,
              },
            },
          },
          availability: missingCapabilities.length
            ? {
                kind: "NoOp" as const,
                reason: `Presence policy ${policy.policyId} phase ${phase.phaseId}: unavailable external capability: ${missingCapabilities.join(", ")}`,
                missingCapabilities,
              }
            : { kind: "ready" as const },
        };
      });
      return {
        ...policy,
        baseAuthorityEnvelopeId: ceiling.authorityEnvelopeId,
        sourceGrantIds: (base.grants ?? []).map((grant) => grant.grantId),
        phases,
        idleCadence: { kind: "After", delayMs: policy.decay.idleMs },
        statechart: {
          initial: "present",
          returnPrecedence: "before-dispatch-and-outcome",
          transitions,
        },
      };
    },
  );
  return { policies, diagnostics };
}

/** These lines are derived from compiled values, independent of authored notes. */
export function projectPresenceInspection(
  program: CompiledProgram,
): Readonly<{ pulse: readonly string[]; interrupt: readonly string[] }> {
  return {
    pulse: (program.presence ?? []).flatMap((policy) => [
      `Presence ${policy.policyId} v${policy.version}: ${policy.curve}; absence → ${policy.phases[0]!.phaseId}; verified success → next; failure or peak → ${policy.phases[0]!.phaseId}; axes=${policy.axes.join(", ")}; base=${policy.baseAuthorityEnvelopeId}; grants=${policy.sourceGrantIds.join(", ") || "base"}`,
      ...policy.phases.map(
        (phase) =>
          `${policy.policyId}/${phase.phaseId}: attention=${phase.attentionPriority}; scope=${phase.scope.surfaces.join(", ")}; host ceiling=${phase.scope.changeSize.files} files/${phase.scope.changeSize.lines} lines; budget=${canonicalStringify(phase.scope.budget)}; authority=${canonicalStringify(phase.effectiveEnvelope)}; external capability=${canonicalStringify(phase.availability)}; entry=${canonicalStringify(phase.entry)}`,
      ),
    ]),
    interrupt: (program.presence ?? []).flatMap((policy) => [
      `Presence ${policy.policyId}: ${policy.returnRule}; return precedes dispatch/outcome; no new discretionary dispatch; requested foreground continues under its own authority; idle ${policy.decay.idleMs}ms expires ${policy.decay.expires}; fresh return/absence rearms`,
      ...policy.phases.map(
        (phase) =>
          `${policy.policyId}/${phase.phaseId}: ${phase.discretionary ? `discretionary in-flight ${phase.inFlightOnReturn}` : "requested foreground continues"}; pending cadences cancel on return; stale outcomes cannot advance`,
      ),
    ]),
  };
}
