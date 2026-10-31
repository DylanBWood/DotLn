#!/usr/bin/env node
import { findLaunchpad } from "./lib/config.mjs";
import { controlledStatus, runDrive } from "./lib/drive-session.mjs";
import { enterDrivenWorker, driveHost } from "./lib/drive-worker.mjs";
import { isMainModule } from "./lib/paths.mjs";

export async function main(
  args = process.argv.slice(2),
  root = findLaunchpad(),
) {
  if (args.length === 1 && args[0] === "worker-entry") {
    console.log(JSON.stringify(await enterDrivenWorker(root)));
    return;
  }
  const hostAt = args.indexOf("--host");
  const host = hostAt < 0 ? driveHost() : driveHost(args[hostAt + 1]);
  if (hostAt >= 0)
    args = args.filter((_, index) => index !== hostAt && index !== hostAt + 1);
  const [first, second, ...extra] = args;
  const status = first === "status";
  const order = status ? second : first;
  if (!/^WO-\d{3}$/.test(order ?? "") || extra.length || (!status && second))
    throw new Error(
      "usage: node scripts/drive.mjs [status] WO-NNN [--host claude|codex]",
    );
  const result = status
    ? await controlledStatus(root, order)
    : await runDrive(root, order, { host });
  console.log(
    JSON.stringify(
      status
        ? result
        : {
            workOrder: order,
            stop: result.stop,
            attempts: result.attempts.length,
            budget: result.budget,
            limits: result.limits,
            routerUsage: result.routerUsage,
            workerUsage: result.attempts.map(({ usage, costUsd }) => ({
              usage,
              costUsd,
            })),
          },
      null,
      2,
    ),
  );
}
if (isMainModule(import.meta.url))
  main().catch((error) => {
    console.error(`Drive stopped: ${error.message}`);
    process.exitCode = 1;
  });
