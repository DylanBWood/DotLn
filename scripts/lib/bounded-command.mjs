import { requireDispatchBound } from "./dispatch-bound.mjs";
import { executeSuite } from "../test-runner.mjs";
import {
  hostStateRoot,
  memoryBudgets,
  recordedHostLaneCapacity,
} from "./host-resources.mjs";
import { ensureHostGuard } from "./host-guard-state.mjs";

import {
  completeTestSelection,
  diagnosticTestSelection,
} from "../../packages/skeleton/src/test-selection.mjs";
export { completeTestSelection };
// A complete selection outlives the 900-second probe deadline; its own task
// deadlines bound the work, and this outer bound keeps a wait that never
// ends, such as a host-lane wait, from outliving the session.
const COMPLETE_SELECTION_DEADLINE_MS = 6 * 60 * 60 * 1000;

export async function boundedCommand(
  args,
  repo,
  {
    directory = hostStateRoot(),
    report = console.error,
    cwd = repo,
    timeoutMs,
    output = (text) => process.stdout.write(text),
  } = {},
) {
  const limits = memoryBudgets(repo, {
    capacity: recordedHostLaneCapacity(directory),
  });
  let index = 0;
  let requestedDeadline;
  const seen = new Set();
  while (["--budget-bytes", "--timeout-seconds"].includes(args[index])) {
    const option = args[index++];
    if (seen.has(option)) throw new Error(`Duplicate probe option: ${option}`);
    seen.add(option);
    const value = Number(args[index++]);
    if (option === "--budget-bytes") {
      if (!Number.isSafeInteger(value) || value < 1 || value > limits.taskBytes)
        throw new Error(
          "A probe budget override must reduce the configured task budget",
        );
      limits.taskBytes = value;
    } else {
      if (!Number.isSafeInteger(value) || value < 1 || value > 21600)
        throw new Error("A probe timeout must be 1 to 21600 whole seconds");
      requestedDeadline = value * 1000;
    }
  }
  if (args[index++] !== "--" || !args[index])
    throw new Error(
      "usage: harness bounded [--budget-bytes <reduced-byte-budget>] [--timeout-seconds <1..21600>] -- <command> [args...]",
    );
  if (!diagnosticTestSelection(args.slice(index)))
    requireDispatchBound(repo, { source: "probe" });
  await ensureHostGuard(directory);
  const controller = new AbortController();
  const handlers = Object.fromEntries(
    ["SIGINT", "SIGTERM", "SIGHUP"].map((signal) => [
      signal,
      () => controller.abort(),
    ]),
  );
  for (const [signal, handler] of Object.entries(handlers))
    process.on(signal, handler);
  const complete = completeTestSelection(args.slice(index));
  const deadlineMs =
    timeoutMs ??
    requestedDeadline ??
    (complete ? COMPLETE_SELECTION_DEADLINE_MS : 900_000);
  report(
    `bounded-start ${JSON.stringify({ budgetBytes: limits.taskBytes, physicalBytes: limits.physicalBytes, deadlineMs, ...(complete ? { completeTestSelection: true, probeDeadline: requestedDeadline === undefined ? "6 h 0 min for a complete selection; the runner's task deadlines bound the work within it" : "explicit outer deadline; the runner's task deadlines still bound the work within it" } : {}) })}`,
  );
  try {
    const result = await executeSuite(
      {
        name: "bounded-probe",
        probe: true,
        command: args.slice(index),
        memoryLimits: limits,
        hostDirectory: directory,
      },
      cwd,
      deadlineMs,
      ({ message }) => report(`PROGRESS [bounded-probe] ${message}`),
      controller.signal,
    );
    if (result.output) output(result.output);
    report(
      `bounded-result ${JSON.stringify({ ...result, output: undefined })}`,
    );
    return result;
  } finally {
    for (const [signal, handler] of Object.entries(handlers))
      process.off(signal, handler);
  }
}
