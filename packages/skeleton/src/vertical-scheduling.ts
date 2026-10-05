import { ResidentStore } from "./resident-store.js";
import { existsSync, statSync } from "node:fs";
import {
  intentStepReady,
  residentMachine,
  type ResidentState,
} from "./resident-state.js";
import type { IntentBinding } from "./vertical.js";
import type { VerticalHostOptions } from "./vertical-host.js";

/** Only a changed log or a deciding deadline requires replay under the append
 * lock. Polling still checks current capabilities and launch/finish semantics. */
export function verticalAuthorityObserver(
  store: ResidentStore,
  binding: IntentBinding,
  now: () => number,
  permitted: (state: ResidentState, launch: boolean) => boolean,
): (launch: boolean) => Promise<boolean> {
  let observed: ResidentState | undefined;
  let observedBytes = -1;
  const logBytes = () =>
    existsSync(store.store.logPath) ? statSync(store.store.logPath).size : 0;
  let deadline = -Infinity;
  return async (launch) => {
    const at = now();
    if (launch || !observed || logBytes() !== observedBytes || at >= deadline) {
      observed = await store.transaction((tx) => {
        if (launch || at >= deadline) tx.sample(at);
        const state = tx.resident!;
        observedBytes = logBytes();
        deadline = Math.min(
          ...[
            binding.authority.expiresAt,
            state.present &&
            state.lastHumanAt !== null &&
            state.policy?.humanIdleMs !== undefined
              ? state.lastHumanAt + state.policy.humanIdleMs
              : Infinity,
            ...Object.values(state.actors)
              .filter((actor) => actor.status === "live")
              .map(
                (actor) =>
                  actor.lastHeartbeatAt +
                  (state.configuration?.heartbeatBudgetMs ?? 30000),
              ),
          ].filter((candidate) => candidate > state.at),
        );
        return state;
      });
    }
    return permitted(observed, launch);
  };
}

/** A vertical step occupies the existing policy interpreter's process slot.
 * The primitive host still owns its process, lease and result admission. */
export function residentVerticalScheduling(
  store: ResidentStore,
  binding: IntentBinding,
  now: () => number,
  capabilities: () => readonly string[],
): Pick<VerticalHostOptions, "startStep" | "active" | "settled"> {
  return {
    startStep: (command) =>
      store.transaction((tx) => {
        tx.sample(now());
        const state = tx.resident!,
          machine = residentMachine(state);
        const phase = state.policy!.phases.find(
          (p) => p.phaseId === binding.phaseId,
        )!;
        if (
          phase.requiredCapabilities.some((c) => !capabilities().includes(c)) ||
          !intentStepReady(
            state,
            binding,
            command.commandId,
            tx.predicates,
            true,
          )
        )
          return false;
        if (machine.current)
          return (
            state.intentStep?.key === binding.key &&
            machine.current.id === command.commandId
          );
        tx.append("IntentStepStarted", {
          key: binding.key,
          commandId: command.commandId,
        });
        return true;
      }),
    active: verticalAuthorityObserver(store, binding, now, (state, launch) => {
      const machine = residentMachine(state);
      const phase = state.policy!.phases.find(
        (p) => p.phaseId === binding.phaseId,
      )!;
      return (
        !state.dispatchHeld &&
        !state.revokedBy.length &&
        phase.requiredCapabilities.every((c) => capabilities().includes(c)) &&
        state.at < binding.authority.expiresAt &&
        state.intentStep?.key === binding.key &&
        machine.current?.id === state.intentStep.commandId &&
        (!launch || !state.present)
      );
    }),
    settled: (receipt, terminal) =>
      store.transaction((tx) => {
        const missing = () =>
          tx.resident!.intentStep?.key === binding.key &&
          tx.resident!.intentStep.commandId === receipt.command.commandId;
        // A replayed receipt whose settlement is recorded appends nothing.
        if (!missing()) return;
        tx.sample(now());
        if (missing())
          tx.append("IntentStepSettled", {
            key: binding.key,
            commandId: receipt.command.commandId,
            result: receipt.result,
            terminal,
          });
      }),
  };
}
