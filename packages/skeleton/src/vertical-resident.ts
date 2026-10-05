import { join } from "node:path";
import type {
  AuthorityGrant,
  WorkOrder,
  CompiledPresencePhase,
} from "@dotln/compiler";
import { ResidentStore } from "./resident-store.js";
import {
  intentAdmissionReady,
  intentStepReady,
  residentMachine,
} from "./resident-state.js";
import {
  admitIntent,
  IntentPreparationRefusal,
  intentBudgetUsed,
  verticalEqual,
  verticalHash,
  verticalProgram,
  type IntentAdmission,
  type IntentBinding,
  type PreparedIntent,
} from "./vertical.js";
import { VerticalHost, type VerticalPorts } from "./vertical-host.js";
import { residentVerticalScheduling } from "./vertical-scheduling.js";

export interface VerticalEntryPorts {
  /** Canonical WO-120 allocations still in draft phase. */
  drafts(): Promise<readonly WorkOrder[]>;
  /** Read-only source preparation under the current phase's repo.read authority. */
  prepare(
    draft: WorkOrder,
    phase: CompiledPresencePhase,
    spent: PreparedIntent["spent"],
  ): Promise<PreparedIntent>;
  grants(): readonly AuthorityGrant[];
  /** Current host-owned entry; an unreadable entry is still a held intent. */
  portfolio?(): unknown;
  execution(binding: IntentBinding): VerticalPorts;
}
export function verticalResident(
  ports: VerticalEntryPorts,
  directory: string,
  options: {
    steps?: number;
    afterStep?: ConstructorParameters<typeof VerticalHost>[0]["afterStep"];
    /** Backoff for a draft whose preparation did not reach a decision. */
    retry?: { baseMs: number; capMs: number; unnamedAttempts: number };
  } = {},
) {
  const retry = options.retry ?? {
    baseMs: 1000,
    capMs: 300000,
    unnamedAttempts: 3,
  };
  // Process-local scheduling memory. The ledger and each vertical store stay
  // the only decision records; a restart costs one replay per continuation.
  const finished = new Set<string>();
  const deferred = new Map<string, { failures: number; notBefore: number }>();
  return {
    async tick(
      store: ResidentStore,
      now: () => number,
      capabilities: () => readonly string[] = () => [],
    ): Promise<boolean> {
      const context = await store.transaction((tx) => {
        tx.sample(now());
        const state = tx.resident!;
        const expiredIntents = Object.entries(state.intents ?? {}).filter(
          ([, intent]) =>
            intent.kind === "admitted" &&
            intent.binding.authority.expiresAt <= state.at,
        );
        // A continuation runs only when its step can start, resume or
        // settle, or its expiry stop is unrecorded: a blocked or finished
        // one costs this tick no replay and the ledger no event.
        const runnable = Object.values(state.intents ?? {}).flatMap((intent) =>
          intent.kind === "admitted" &&
          !finished.has(intent.binding.key) &&
          (intent.binding.authority.expiresAt <= state.at ||
            state.intentStep?.key === intent.binding.key ||
            intentStepReady(state, intent.binding, "", tx.predicates))
            ? [intent.binding]
            : [],
        );
        const expiryContext = expiredIntents.length
          ? {
              phase: null,
              portfolio: state.configuration!.portfolio?.definition,
              intents: Object.fromEntries(expiredIntents),
              runnable: runnable.filter(
                (binding) => binding.authority.expiresAt <= state.at,
              ),
              at: state.at,
            }
          : null;
        const machine = residentMachine(state);
        const phase = machine.phase();
        if (
          !phase ||
          state.present ||
          state.dispatchHeld ||
          phase.availability.kind !== "ready" ||
          phase.requiredCapabilities.some((c) => !capabilities().includes(c)) ||
          (machine.current &&
            machine.current.id !== state.intentStep?.commandId) ||
          (!state.intentStep && machine.due(state.at) === null)
        )
          return expiryContext;
        const envelope = phase.effectiveEnvelope;
        if (
          envelope.expiresAt <= state.at ||
          !envelope.allowedEffects.includes("repo.read") ||
          envelope.deniedEffects.some(
            (e) => e === "repo.read" || e === "repo.*",
          ) ||
          state.revokedBy.length
        )
          return expiryContext;
        return {
          phase,
          portfolio: state.configuration!.portfolio?.definition,
          intents: state.intents ?? {},
          runnable,
          at: state.at,
          generation: machine.generation,
        };
      });
      if (!context) return false;
      // An admitted run resumes from its original binding, even if preparation
      // would now see a changed issue or clock. No completed step is repeated.
      for (const binding of context.runnable) {
        const host = new VerticalHost({
          directory: join(directory, binding.key),
          binding,
          ports: ports.execution(binding),
          now,
          ...residentVerticalScheduling(store, binding, now, capabilities),
          ...(options.afterStep ? { afterStep: options.afterStep } : {}),
        });
        const before = host.store.read();
        try {
          const state = await host.run({
            ...(options.steps === undefined ? {} : { steps: options.steps }),
          });
          if (state.terminal) finished.add(binding.key);
        } catch (error) {
          // Another entry owns this continuation; never reclaim a live writer.
          // Malformed stores and unrelated failures still refuse normally.
          if (
            !(error instanceof Error) ||
            !/worker store already has a live host/u.test(error.message)
          )
            throw error;
        }
        if (host.store.read() !== before) return true;
      }
      const draftKey = (d: WorkOrder) =>
        typeof d?.workOrderId === "string"
          ? d.workOrderId
          : `unreadable-${verticalHash(d)}`;
      if (!context.phase) return false;
      const admissionPhase = context.phase;
      const spent = intentBudgetUsed(context.intents, context.at);
      for (const draft of await ports.drafts()) {
        const draftId = draftKey(draft);
        if (
          Object.hasOwn(context.intents, draftId) ||
          (deferred.get(draftId)?.notBefore ?? -Infinity) > context.at
        )
          continue;
        let definition: unknown;
        let grants: readonly AuthorityGrant[] = [];
        let input: PreparedIntent | undefined;
        let decision: IntentAdmission;
        try {
          definition = ports.portfolio ? ports.portfolio() : context.portfolio;
          grants = ports.grants();
          input = await ports.prepare(draft, admissionPhase, spent);
          decision = admitIntent(input, definition, grants);
        } catch (error) {
          const refusal =
            error instanceof IntentPreparationRefusal ? error : undefined;
          const failures = (deferred.get(draftId)?.failures ?? 0) + 1;
          // A named transient condition is retried with backoff and an
          // unnamed failure a bounded number of times. Neither is a decision
          // yet, and neither keeps a later draft from its turn.
          if (refusal ? refusal.transient : failures < retry.unnamedAttempts) {
            deferred.set(draftId, {
              failures,
              notBefore:
                context.at +
                Math.min(retry.capMs, retry.baseMs * 2 ** (failures - 1)),
            });
            continue;
          }
          decision = {
            kind: "NeedsHuman" as const,
            step: refusal?.step ?? "admission",
            reason:
              refusal?.message ??
              "intent preparation failed repeatedly outside the named transient conditions",
          };
        }
        const recorded = await store.transaction((tx) => {
          // Presence, revocation or phase changes during preparation win over admission.
          tx.sample(now());
          const state = tx.resident!;
          const machine = residentMachine(state, tx.predicates);
          const phase = machine.phase();
          if (
            state.intents?.[draftId] ||
            !intentAdmissionReady(
              state,
              admissionPhase,
              false,
              tx.predicates,
            ) ||
            machine.generation !== context.generation ||
            phase?.requiredCapabilities.some((c) => !capabilities().includes(c))
          )
            return false;
          if (input) {
            input = {
              ...input,
              at: state.at,
              spent: intentBudgetUsed(state.intents ?? {}, state.at),
            };
            decision = admitIntent(input, definition, grants);
            if (
              decision.kind === "admitted" &&
              !verticalEqual(definition, context.portfolio)
            )
              decision = {
                kind: "NeedsHuman",
                step: "admission",
                reason:
                  "intent portfolio differs from the recorded resident binding",
              };
          }
          if (decision.kind === "admitted")
            tx.append("IntentAdmitted", {
              draftId,
              input,
              grants,
              binding: decision.binding,
              continuation: verticalProgram(decision.binding.key),
            });
          else
            tx.append("IntentHeld", {
              draftId,
              step: decision.step,
              reason: decision.reason,
            });
          return true;
        });
        if (!recorded) return false;
        deferred.delete(draftId);
        if (decision.kind === "admitted") {
          const binding = decision.binding;
          const host = new VerticalHost({
            directory: join(directory, binding.key),
            binding,
            ports: ports.execution(binding),
            now,
            ...residentVerticalScheduling(store, binding, now, capabilities),
            ...(options.afterStep ? { afterStep: options.afterStep } : {}),
          });
          try {
            await host.run({
              ...(options.steps === undefined ? {} : { steps: options.steps }),
            });
          } catch (error) {
            if (
              !(error instanceof Error) ||
              !/worker store already has a live host/u.test(error.message)
            )
              throw error;
          }
        }
        return true;
      }
      return false;
    },
  };
}
