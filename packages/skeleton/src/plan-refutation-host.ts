import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { planRefutationAuthorization } from "./reactor.js";
import { compilePlanRefuter } from "./loadouts/plan-refuter.js";
import {
  validatePlanResult,
  type PlanRefutationRequest,
  type PlanSubject,
} from "./plan-refutation-protocol.js";
import { WorkerFailure } from "./worker-protocol.js";
import {
  normalizeWorkerEffort,
  type WorkOrderTransport,
} from "./worker-transport.js";

/** A one-shot counterpart of the blinded verification capsule host. */
export async function runPlanRefutation(
  subject: PlanSubject,
  transport: WorkOrderTransport<PlanRefutationRequest>,
  model: string,
  effort: string,
  now = Date.now,
  retentionDirectory = join(process.cwd(), "docs/control/local/refutations"),
) {
  const selection = normalizeWorkerEffort(effort);
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
  let preserveScratch = false;
  try {
    // Empty repository satisfies Codex trust without changing worker input.
    execFileSync("git", ["-c", "init.templateDir=", "init", "--quiet", cwd], {
      stdio: "pipe",
    });
    const request: PlanRefutationRequest = {
      kind: "plan-refutation",
      command: grant.command,
      workOrder: compiled.program.workOrder,
      subject,
      episodeId,
      model,
      ...selection,
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
    const returned = await dispatch.completed;
    writeFileSync(join(cwd, "result.json"), JSON.stringify(returned) + "\n", {
      mode: 0o600,
    });
    if (!existsSync(join(cwd, "statement.txt")))
      writeFileSync(
        join(cwd, "statement.txt"),
        `Transport ${transport.name} returned this result for the pinned subject; the host validation follows.\n`,
        { mode: 0o600 },
      );
    const result = validatePlanResult(returned, subject);
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
      ...selection,
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
    if (
      existsSync(join(cwd, "result.json")) ||
      existsSync(join(cwd, "wire.jsonl"))
    ) {
      preserveScratch = true;
      let retained: string;
      try {
        mkdirSync(retentionDirectory, { recursive: true, mode: 0o700 });
        retained = mkdtempSync(join(retentionDirectory, "rejected-"));
        for (const name of ["result.json", "statement.txt", "wire.jsonl"])
          if (existsSync(join(cwd, name)))
            copyFileSync(join(cwd, name), join(retained, name));
        preserveScratch = false;
      } catch {
        throw new WorkerFailure(
          "transport-failed",
          `retention lane unavailable; rejected output remains at ${cwd}`,
        );
      }
      throw new WorkerFailure(
        error instanceof WorkerFailure ? error.code : "invalid-result",
        `${error instanceof WorkerFailure ? (error.detail ?? error.code) : "plan return rejected"}; rejected result and statement retained at ${retained}`,
      );
    }
    throw error;
  } finally {
    if (!preserveScratch) rmSync(cwd, { recursive: true });
  }
}
