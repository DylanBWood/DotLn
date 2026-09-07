import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { planRefutationAuthorization } from "./reactor.js";
import { compilePlanRefuter } from "./loadouts/plan-refuter.js";
import {
  validatePlanResult,
  type PlanRefutationRequest,
  type PlanSubject,
} from "./plan-refutation-protocol.js";
import { WorkerFailure, type WorkerEffort } from "./worker-protocol.js";
import type { WorkOrderTransport } from "./worker-transport.js";

/** A one-shot counterpart of the blinded verification capsule host. */
export async function runPlanRefutation(
  subject: PlanSubject,
  transport: WorkOrderTransport<PlanRefutationRequest>,
  model: string,
  effort: WorkerEffort,
  now = Date.now,
) {
  const dispatchedAt = now();
  const compiled = compilePlanRefuter(subject.revision, dispatchedAt);
  const episodeId = `ep_plan_${subject.hash.slice(7, 23)}`;
  const grant = planRefutationAuthorization(
    compiled.program.authorityEnvelope,
    subject.hash,
    episodeId,
    "read",
    dispatchedAt,
  );
  if (!grant.authorized) throw new WorkerFailure("profile-refused");
  // Empty scratch cwd prevents project startup files from adding planner context.
  // The inherited transports disable all model tools and user config/memories.
  const cwd = mkdtempSync(join(tmpdir(), "dotln-plan-refuter-"));
  let dispatch;
  try {
    const request: PlanRefutationRequest = {
      kind: "plan-refutation",
      command: grant.command,
      workOrder: compiled.program.workOrder,
      subject,
      episodeId,
      model,
      effort,
      cwd,
      profile: { profileId: "plan-refutation-v1", modelTools: [] },
    };
    dispatch = transport.dispatch(request, now);
    const receipt = await dispatch.receipt;
    if (
      receipt.commandId !== grant.command.commandId ||
      receipt.transport !== transport.name
    )
      throw new WorkerFailure("invalid-result");
    const result = validatePlanResult(await dispatch.completed, subject);
    const completedAt = now();
    if (
      !planRefutationAuthorization(
        compiled.program.authorityEnvelope,
        subject.hash,
        episodeId,
        "report",
        completedAt,
      ).authorized
    )
      throw new WorkerFailure("profile-refused");
    return {
      result,
      transport: transport.name,
      harnessVersion: transport.harnessVersion,
      model,
      effort,
      selectionSource: "host-launch" as const,
      effectiveModel: "unknown",
      effectiveEffort: "unknown",
      dispatchedAt: new Date(dispatchedAt).toISOString(),
      completedAt: new Date(completedAt).toISOString(),
      semanticHash: compiled.semanticHash,
      commandReceipt: receipt,
    };
  } catch (error) {
    dispatch?.kill();
    throw error;
  } finally {
    rmSync(cwd, { recursive: true });
  }
}
