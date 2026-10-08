// Explicit actor doubles for the real CLI's signal/restart regression. No model.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import {
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
import { WorkerFailure } from "../../../packages/skeleton/dist/src/worker-protocol.js";
import { fixtureVerificationResult } from "../../../packages/skeleton/dist/src/verification-fake.js";
import {
  compareBaseline,
  parseEvidenceResult,
} from "../../../packages/skeleton/dist/src/verification-protocol.js";

const cfg = JSON.parse(
  readFileSync(process.env.DOTLN_INTERRUPT_FIXTURE, "utf8"),
);
// The clock starts at the fixture's instant and advances in real time, so a
// lease expires and a rerun can land inside or past it.
const realNow = Date.now.bind(Date);
const started = realNow();
Date.now = () => cfg.at + (realNow() - started);
const nativeDispatch = CodexCliExecWorkOrderTransport.prototype.dispatch;
CodexCliExecWorkOrderTransport.prototype.dispatch = function (
  request,
  now,
  options,
) {
  if (request.kind === "source-change") {
    const transport = new CodexCliExecWorkOrderTransport(
      (launch) =>
        runWorkerProcess({
          ...launch,
          binary: process.execPath,
          args: cfg.sleep
            ? [
                "-e",
                `${cfg.ignoreSignal ? `process.on(${JSON.stringify(cfg.ignoreSignal)},()=>{});` : ""} require('node:fs').writeFileSync(${JSON.stringify(cfg.ready)}, String(process.pid)); setInterval(() => {}, 1000);`,
              ]
            : [new URL("./writer.mjs", import.meta.url).pathname],
        }),
      "0.154.0",
    );
    return nativeDispatch.call(transport, request, now, options);
  }
  const kind = request.review
    ? "review"
    : request.baseline?.kind === "baseline"
      ? "baseline"
      : "verification";
  const envelope = {
    workOrderId: request.workOrder.workOrderId,
    episodeId: request.episodeId,
    resultId: `result_${request.command.commandId}`,
    status: "completed",
    summary: "Synthetic CLI recovery evidence actor.",
    requiresHuman: false,
  };
  let value;
  if (request.review)
    value = {
      kind: "review",
      subjectRevision: request.capsule.subject.revision,
      findings: [],
      envelope,
    };
  else if (request.baseline?.kind === "baseline")
    value = {
      kind: "baseline",
      subjectRevision: request.capsule.subject.revision,
      envelope,
    };
  else {
    value = fixtureVerificationResult(
      request.capsule,
      request.episodeId,
      envelope.resultId,
    );
    if (request.baseline?.kind === "comparison")
      value.baselineFindings = compareBaseline(
        request.baseline,
        request.capsule,
      );
  }
  const receipt = Promise.resolve({
    commandId: request.command.commandId,
    transport: this.name,
    acceptedAt: now(),
  });
  if (cfg.holdJudgment !== kind)
    return {
      receipt,
      completed: Promise.resolve().then(() =>
        parseEvidenceResult(value, request),
      ),
      alive: () => false,
      kill() {},
    };
  // A held judgment actor: a real child that never returns, so the run's
  // abort must stop it. Its pid is published for the regression.
  const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
    stdio: "ignore",
  });
  writeFileSync(cfg.judgmentPid, String(child.pid));
  const completed = new Promise((resolve, reject) => {
    child.once("close", (code, signal) =>
      signal || code
        ? reject(new WorkerFailure("interrupted"))
        : resolve(parseEvidenceResult(value, request)),
    );
  });
  void completed.catch(() => {});
  return {
    receipt,
    completed,
    alive: () => child.exitCode === null && child.signalCode === null,
    kill: (signal = "SIGKILL") => child.kill(signal),
  };
};
