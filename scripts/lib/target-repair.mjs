/** Publication follows completed WO-055 lineage, never a claimed SHA (WO-123).
 * Original and child logs stay immutable; this is a checked read projection. */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { canonicalStringify } from "@dotln/compiler";
import { decodeLog, replay } from "@dotln/kernel";
import { WorkerStore } from "../../packages/skeleton/dist/src/worker-store.js";
import {
  initialState,
  seiriReactor,
  projectRuntimeEnvironment,
} from "../../packages/skeleton/dist/src/reactor.js";
import {
  REPAIR_HOST,
  repairContract,
} from "../../packages/skeleton/dist/src/repair.js";
const same = (a, b) => canonicalStringify(a) === canonicalStringify(b);
const need = (ok, reason) => {
  if (!ok) throw new Error(`target publish refused: repair lineage ${reason}`);
};

export function repairedPublicationEpisode(
  original,
  writer,
  paths,
  readEpisode,
  observeTarget,
) {
  need(
    Array.isArray(paths) &&
      paths.length <= 2 &&
      new Set(paths).size === paths.length,
    "must contain at most two distinct bounded repair stores",
  );
  let selected = original;
  for (const path of paths) {
    const store = new WorkerStore(path);
    need(!existsSync(join(path, "host.lock")), "has a live host lock");
    const events = decodeLog(store.read());
    const opening = events.find((e) => e.type === "RepairOpened");
    need(
      opening &&
        events.every(
          (e) =>
            e.actorId === REPAIR_HOST &&
            e.workstreamId === opening.workstreamId,
        ),
      "has foreign or missing events",
    );
    const p = opening.payload;
    need(
      same(p.original.workOrder, writer.program.workOrder) &&
        same(p.original.authorityEnvelope, writer.program.authorityEnvelope) &&
        same(p.original.surfaces, original.request.surfaces) &&
        same(p.grants, { requested: [], registry: [] }),
      "differs from original writer or widens its scope",
    );
    need(
      p.subject.revision === selected.observation.commit &&
        p.subject.baseCommit === original.request.baseCommit &&
        p.baseline.revision === original.request.baseCommit &&
        same(
          p.subject.snapshot?.contract,
          repairContract(writer.program.workOrder),
        ) &&
        same(
          p.baseline.snapshot?.contract,
          repairContract(writer.program.workOrder),
        ),
      "changes the original contract, baseline or execution parent",
    );
    const state = replay(
      initialState(),
      events,
      seiriReactor,
      {},
      projectRuntimeEnvironment,
    ).state.repair;
    need(
      state?.status === "complete" &&
        state.verified &&
        state.round > 0 &&
        state.subject.revision === state.currentCommit,
      "is not a completed verified repair",
    );
    let parent = selected.observation.commit;
    let last;
    const childEvents = [];
    for (let round = 1; round <= state.round; round++) {
      const child = readEpisode(join(p.host.directory, `source-${round}`));
      const payload = child.command.intent.payload;
      const recorded = events.filter(
        (e) =>
          e.type === "SourceChangeObserved" &&
          same(e.payload.observation, child.observation),
      );
      const derived =
        recorded.length === 1
          ? replay(
              initialState(),
              events.slice(0, events.indexOf(recorded[0])),
              seiriReactor,
              {},
              projectRuntimeEnvironment,
            ).state.repair?.order
          : null;
      need(
        recorded.length === 1 &&
          derived?.round === round &&
          same(payload.workOrder, derived.workOrder) &&
          same(payload.authorityEnvelope, derived.authorityEnvelope) &&
          same(payload.surfaces, derived.surfaces) &&
          payload.testCommand === derived.tests[0]?.command &&
          payload.executionBaseCommit === derived.executionBaseCommit &&
          same(payload.repairContext, {
            contract: derived.contract,
            contractHash: derived.contractHash,
            finding: derived.finding,
            tests: derived.tests,
            grantIds: derived.grantIds,
            round,
          }) &&
          child.request.baseCommit === parent &&
          child.request.repo === original.request.repo &&
          child.request.workOrderId ===
            `${writer.program.workOrder.workOrderId}_repair_${round}` &&
          same(payload.artifactIdentity, writer.artifactIdentity) &&
          same(
            payload.repairContext?.contract,
            repairContract(writer.program.workOrder),
          ),
        "child does not match its parent and host observation",
      );
      observeTarget(child);
      parent = child.observation.commit;
      childEvents.push(...child.events);
      last = child;
    }
    need(
      parent === state.currentCommit && last,
      "head differs from its verified result",
    );
    // The final sealed subject carries the diff from the original base. The
    // ordinary target observer independently compares it with Git before use.
    const diffHash = createHash("sha256")
      .update(state.subject.diff)
      .digest("hex");
    selected = {
      ...original,
      publicationBranch: original.request.branch,
      events: [...selected.events, ...childEvents],
      command: {
        ...original.command,
        intent: {
          ...original.command.intent,
          payload: {
            ...original.command.intent.payload,
            commitMessage: last.command.intent.payload.commitMessage,
          },
        },
      },
      request: { ...original.request, branch: last.request.branch },
      observation: {
        ...last.observation,
        workOrderId: original.request.workOrderId,
        diffHash,
      },
    };
    observeTarget(selected);
  }
  return selected;
}
