#!/usr/bin/env node
import { findLaunchpad } from "./lib/config.mjs";
import { readDriveAccount, stopNeedsAccount } from "./lib/drive-account.mjs";
import {
  controlledStatus,
  driveStatus,
  runDrive,
} from "./lib/drive-session.mjs";
import { enterDrivenWorker, driveHost } from "./lib/drive-worker.mjs";
import { isMainModule } from "./lib/paths.mjs";

/** What the driver prints when a drive ends: the stop, the counts, and for
 * any stop but the merge and a release the account's lines under `why`. */
export const printedResult = (order, result, account) => ({
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
  ...(stopNeedsAccount(result.stop)
    ? { why: accountOrSay(order, account) }
    : {}),
});
// The account is read again from disk after the drive; where that fails, the
// drive's result is still printed, with one line in the account's place.
const accountOrSay = (order, account) => {
  try {
    return account();
  } catch {
    return [
      `${order}: the account of this drive could not be read here; node scripts/drive.mjs why ${order} reads it again and says what stopped it.`,
    ];
  }
};

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
  const why = first === "why";
  const order = status || why ? second : first;
  if (
    !/^WO-\d{3}$/.test(order ?? "") ||
    extra.length ||
    (!status && !why && second)
  )
    throw new Error(
      "usage: node scripts/drive.mjs [status|why] WO-NNN [--host claude|codex]",
    );
  // Why the order's last drive stopped, from the drive's own record: plain
  // lines for whoever asks, the router among them.
  const account = () =>
    readDriveAccount(root, order, () => driveStatus(root, order));
  if (why) {
    console.log(account().join("\n"));
    return;
  }
  const result = status
    ? await controlledStatus(root, order)
    : await runDrive(root, order, { host });
  console.log(
    JSON.stringify(
      status ? result : printedResult(order, result, account),
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
