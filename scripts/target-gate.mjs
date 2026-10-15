#!/usr/bin/env node
import { findLaunchpad } from "./lib/config.mjs";
import { readControl } from "./lib/control-store.mjs";
import { runTargetGate } from "./lib/target-gate.mjs";

try {
  const [id, ...args] = process.argv.slice(2);
  if (
    !/^WO-\d{3}$/.test(id ?? "") ||
    args.length > 1 ||
    (args.length && args[0] !== "--review")
  )
    throw new Error("usage: target-gate WO-NNN [--review]");
  const root = findLaunchpad();
  const state = readControl(root).orders.get(id)?.state;
  if (!state?.repositoryId)
    throw new Error(`${id} is not an activated target order`);
  const row = await runTargetGate(
    root,
    state,
    args.length ? "review" : "plain",
  );
  process.exitCode = row.exitCode;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
