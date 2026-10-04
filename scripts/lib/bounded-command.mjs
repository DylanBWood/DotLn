import { executeSuite } from "../test-runner.mjs";
import { hostStateRoot, memoryBudgets } from "./host-resources.mjs";
import { ensureHostGuard } from "./host-guard-state.mjs";

export async function boundedCommand(
  args,
  repo,
  { directory = hostStateRoot(), report = console.error } = {},
) {
  const limits = memoryBudgets(repo);
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
  report(
    `bounded-start ${JSON.stringify({ budgetBytes: limits.taskBytes, physicalBytes: limits.physicalBytes })}`,
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
      repo,
      900_000,
      ({ message }) => report(`PROGRESS [bounded-probe] ${message}`),
      controller.signal,
    );
    if (result.output) process.stdout.write(result.output);
    report(
      `bounded-result ${JSON.stringify({ ...result, output: undefined })}`,
    );
    return result;
  } finally {
    for (const [signal, handler] of Object.entries(handlers))
      process.off(signal, handler);
  }
}
