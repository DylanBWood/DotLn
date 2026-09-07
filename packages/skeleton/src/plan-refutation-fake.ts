import type {
  PlanRefutationRequest,
  PlanRefutationResult,
  PlanSubject,
} from "./plan-refutation-protocol.js";
import type { WorkOrderTransport } from "./worker-transport.js";

export const cannedPlanDrift = (
  subject: PlanSubject,
): PlanRefutationResult => ({
  orders: subject.orders.map((order, i) => ({
    workOrderId: order.workOrderId,
    verdict: i === 0 ? "drift" : "thesis-advancing",
    thesis:
      i === 0
        ? subject.standard.exclusions[0]!.id
        : subject.standard.theses[0]!.id,
    capabilityRow: i === 0 ? null : "new:fixture.capability",
    rolesServed: [subject.standard.roles[0]!],
    reason: "Synthetic fixture finding; not a judgment about the repository.",
  })),
  largestGap: {
    thesis: subject.standard.theses[0]!.id,
    workOrderId: subject.orders[0]!.workOrderId,
    criterionId: subject.orders[0]!.criteria[0]!.id,
    reason: "Synthetic fixture gap.",
  },
  planVerdict: "hold",
  holdReasons: [
    {
      workOrderId: subject.orders[0]!.workOrderId,
      criterionId: subject.orders[0]!.criteria[0]!.id,
      reason: "Synthetic drift in the first criterion.",
    },
  ],
});

export class FakePlanRefutationTransport implements WorkOrderTransport<PlanRefutationRequest> {
  readonly name = "fake" as const;
  readonly harnessVersion = "fixture-v1";
  constructor(private readonly result = cannedPlanDrift) {}
  dispatch(request: PlanRefutationRequest, now: () => number) {
    return {
      receipt: Promise.resolve({
        commandId: request.command.commandId,
        transport: this.name,
        acceptedAt: now(),
      }),
      completed: Promise.resolve(this.result(request.subject)),
      alive: () => false,
      kill: () => {},
    };
  }
}
