import { requireDispatchBound } from "./dispatch-bound.mjs";
import { executeSuite } from "../test-runner.mjs";
import {
  hostStateRoot,
  memoryBudgets,
  recordedHostLaneCapacity,
} from "./host-resources.mjs";
import { ensureHostGuard } from "./host-guard-state.mjs";
import { formatDuration } from "./duration.mjs";
import {
  reportTimeLimitAdvisories,
  timeLimit,
} from "../../packages/skeleton/src/time-limits.mjs";

import {
  completeTestSelection,
  diagnosticTestSelection,
} from "../../packages/skeleton/src/test-selection.mjs";
export { completeTestSelection };
// A complete selection outlives an ordinary probe's limit; its own task
// limits bound the work, and its outer limit keeps a wait that never ends,
// such as a host-lane wait, from outliving the session. Both figures are
// rows of the time-limit table, which the root's file sets.

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
  // An unusable value in the root's time-limits file is named once, here.
  reportTimeLimitAdvisories(repo);
  // A caller's figure and --timeout-seconds are the probe's own; otherwise
  // the table's key for the probe applies, and null is a limit turned off.
  // Every test selection, complete or by name, has the selection's limit:
  // its tasks keep their own limits inside it, and the shorter figure of an
  // ordinary command would end a suite before its own limit could.
  const limitKey =
    timeoutMs !== undefined || requestedDeadline !== undefined
      ? undefined
      : complete || diagnosticTestSelection(args.slice(index))
        ? "probe.test-selection"
        : "probe.command";
  const deadlineMs =
    timeoutMs ?? requestedDeadline ?? timeLimit(repo, limitKey);
  report(
    `bounded-start ${JSON.stringify({ budgetBytes: limits.taskBytes, physicalBytes: limits.physicalBytes, deadlineMs, ...(limitKey ? { timeLimitKey: limitKey } : {}), ...(complete ? { completeTestSelection: true, probeDeadline: limitKey === undefined ? "explicit outer deadline; the runner's task deadlines still bound the work within it" : deadlineMs === null ? "no outer deadline: this root turned the limit off; the runner's task deadlines bound the work" : `${formatDuration(deadlineMs)} for a complete selection; the runner's task deadlines bound the work within it` } : {}) })}`,
  );
  try {
    const result = await executeSuite(
      {
        name: "bounded-probe",
        probe: true,
        command: args.slice(index),
        memoryLimits: limits,
        hostDirectory: directory,
        // The launchpad's file sets the limits wherever the command runs.
        limitsRoot: repo,
        ...(limitKey ? { timeLimitKey: limitKey } : {}),
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
