#!/usr/bin/env node
import { isMainModule } from "./lib/paths.mjs";
import { lstatSync, readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";

import {
  FOLLOWUP_ID,
  applyAdjacentCommand,
  nextAdjacentItem,
  readAdjacentQueue,
} from "./lib/adjacent-queue.mjs";
import {
  branchWorkOrder,
  readControl,
  selectWorkOrder,
} from "./lib/control-store.mjs";
import { runGit } from "./lib/git.mjs";
import {
  currentFollowupTarget,
  syncFollowups,
} from "./lib/planning-followups.mjs";
import { checkLocalTerms } from "./lib/terms.mjs";

export function main(args, root = process.cwd()) {
  root = realpathSync(root);
  if (realpathSync(runGit(root, ["rev-parse", "--show-toplevel"])) !== root)
    throw new Error("adjacent queue: run from the physical Git root");
  const control = readControl(root);
  const workOrder = selectWorkOrder(control, { branch: branchWorkOrder(root) });
  if (!workOrder) throw new Error("adjacent queue: no selected work order");
  let state;
  if (args.length === 1 && args[0] === "list")
    state = readAdjacentQueue(root, workOrder);
  else if (args.length === 3 && args[0] === "apply" && args[1] === "--file") {
    const phase = control.orders.get(workOrder)?.state.phase;
    const path = resolve(root, args[2]);
    const info = lstatSync(path);
    if (!info.isFile() || info.isSymbolicLink())
      throw new Error("adjacent queue: request must be a regular file");
    const source = readFileSync(path, "utf8");
    let command;
    try {
      command = JSON.parse(source);
    } catch {
      command = undefined;
    }
    // Final review may only link a deferral to its minted public follow-up.
    const retarget = command?.action?.kind === "retarget";
    if (
      !["active", "repairing", ...(retarget ? ["final-review"] : [])].includes(
        phase,
      )
    )
      throw new Error(
        retarget
          ? "adjacent queue: retarget requires the selected executor, fixer or final-review phase"
          : "adjacent queue: mutation requires the selected executor/fixer phase",
      );
    checkLocalTerms(root, [{ name: "adjacent-queue-request", text: source }]);
    command ??= JSON.parse(source);
    if (
      retarget &&
      FOLLOWUP_ID.test(command.action.target ?? "") &&
      !currentFollowupTarget(
        syncFollowups(root, { check: true }),
        command.action.target,
      )
    )
      throw new Error(
        `adjacent queue: ${command.action.target} is not a current public FUP identifier in the follow-up register; sync it first`,
      );
    state = applyAdjacentCommand(root, workOrder, command);
  } else
    throw new Error(
      "usage: adjacent-work.mjs list | apply --file <request.json>",
    );
  return {
    ...state,
    next: nextAdjacentItem(state)?.id ?? null,
    observationSource:
      "actor-attested; queue state does not prove chat delivery, inbox visibility or executed checks",
  };
}
if (isMainModule(import.meta.url)) {
  try {
    process.stdout.write(
      JSON.stringify(main(process.argv.slice(2)), null, 2) + "\n",
    );
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
