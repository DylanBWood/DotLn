import { projectActor } from "./control-actor.mjs";
import { eventsForOrder } from "./control-store.mjs";
import { completedPhaseAttempts } from "./control-time.mjs";

const counts = () => ({ attempts: 0, elapsedMs: 0, unknown: 0 });
const add = (summary, attempt) => {
  summary.attempts += 1;
  if (attempt.elapsedMs === "unknown") summary.unknown += 1;
  else summary.elapsedMs += attempt.elapsedMs;
};
const dimensions = (attempt) => {
  const actor = projectActor(attempt.actor);
  return {
    harness: actor?.harness ?? "unknown",
    harnessVersion: actor?.harnessVersion ?? "unknown",
    model: actor?.model ?? "unknown",
    effort: actor?.effort ?? "unknown",
    accountLabel: actor?.accountLabel ?? "not-applicable",
    phase: attempt.phase,
  };
};
const groupAttempt = (groups, attempt) => {
  const fields = dimensions(attempt);
  const key = JSON.stringify(fields);
  if (!groups.has(key))
    groups.set(key, { ...fields, ...counts(), workOrders: [] });
  const group = groups.get(key);
  add(group, attempt);
  if (!group.workOrders.includes(attempt.workOrder))
    group.workOrders.push(attempt.workOrder);
};

export const controlUsageProjection = (control) => {
  const totals = counts();
  const actors = new Map();
  const byWorkOrder = [];
  for (const workOrder of [...control.orders.keys()].sort()) {
    const summary = { workOrder, ...counts() };
    const orderActors = new Map();
    for (const attempt of completedPhaseAttempts(
      eventsForOrder(control, workOrder),
    )) {
      add(totals, attempt);
      add(summary, attempt);
      groupAttempt(actors, attempt);
      groupAttempt(orderActors, attempt);
    }
    byWorkOrder.push({ ...summary, byActor: [...orderActors.values()] });
  }
  return {
    timing:
      "Completed phase attempts attributed to the completion actor. Wall-clock spans include waiting and interruptions; they are not active model time. elapsedMs sums known signed spans only; unknown counts attempts missing either endpoint. Retries are separate attempts. Overlapping work orders can overlap in these totals. No checkpoint times are recovered.",
    totals,
    byActor: [...actors.values()],
    byWorkOrder,
  };
};

const renderCounts = ({ attempts, elapsedMs, unknown }) =>
  `attempts=${attempts}; elapsedMs=${elapsedMs}; unknown=${unknown}`;
const renderGroup = (group) =>
  `${["harness", "harnessVersion", "model", "effort", "accountLabel", "phase"].map((key) => `${key}=${JSON.stringify(group[key])}`).join("; ")}; ${renderCounts(group)}; workOrders=${group.workOrders.join(",")}`;

export const renderControlUsage = (usage) =>
  [
    usage.timing,
    `Total: ${renderCounts(usage.totals)}`,
    "",
    "By actor and phase:",
    ...usage.byActor.map((group) => `- ${renderGroup(group)}`),
    "",
    "By work order:",
    ...usage.byWorkOrder.flatMap((order) => [
      `${order.workOrder}: ${renderCounts(order)}`,
      ...order.byActor.map((group) => `  - ${renderGroup(group)}`),
    ]),
  ].join("\n");
