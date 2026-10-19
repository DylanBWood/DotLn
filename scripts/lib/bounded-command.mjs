import { executeSuite } from "../test-runner.mjs";
import {
  hostStateRoot,
  memoryBudgets,
  recordedHostLaneCapacity,
} from "./host-resources.mjs";
import { ensureHostGuard } from "./host-guard-state.mjs";

/** Whether a wrapped command is a complete test selection: `npm test`,
 * `npm run test:full` or the runner itself with no `--only`, `--document`
 * or `--list`. A complete run outlives the probe deadline, so the wrapper
 * applies a six-hour outer bound to one; the runner's task deadlines bound
 * it. Focused, document and listing selections keep the probe deadline. */
export function completeTestSelection(command) {
  let runnerArgs;
  let implied = [];
  if (command[0] === "npm" && command[1] === "test") {
    const dash = command.indexOf("--", 2);
    runnerArgs = dash === -1 ? [] : command.slice(dash + 1);
  } else if (
    command[0] === "npm" &&
    command[1] === "run" &&
    ["test", "test:full"].includes(command[2] ?? "")
  ) {
    const dash = command.indexOf("--", 3);
    runnerArgs = dash === -1 ? [] : command.slice(dash + 1);
    implied = command[2] === "test:full" ? ["--review"] : [];
  } else if (
    (command[0] === "node" || command[0] === process.execPath) &&
    /(^|\/)scripts\/test-runner\.mjs$/u.test(command[1] ?? "")
  )
    runnerArgs = command.slice(2);
  else return false;
  return ![...implied, ...runnerArgs].some((argument) =>
    [
      "--only",
      "--document",
      "--list",
      "--machinery",
      "--confined-partial",
    ].includes(argument),
  );
}
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
  if (args[index] === "--budget-bytes") {
    const reduced = Number(args[++index]);
    index++;
    if (
      !Number.isSafeInteger(reduced) ||
      reduced < 1 ||
      reduced > limits.taskBytes
    )
      throw new Error(
        "A probe budget override must reduce the configured task budget",
      );
    limits.taskBytes = reduced;
  }
  if (args[index++] !== "--" || !args[index])
    throw new Error(
      "usage: harness bounded [--budget-bytes <reduced-byte-budget>] -- <command> [args...]",
    );
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
    timeoutMs ?? (complete ? COMPLETE_SELECTION_DEADLINE_MS : 900_000);
  report(
    `bounded-start ${JSON.stringify({ budgetBytes: limits.taskBytes, physicalBytes: limits.physicalBytes, ...(complete ? { completeTestSelection: true, probeDeadline: "6 h for a complete selection; the runner's task deadlines bound the work within it" } : {}) })}`,
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
