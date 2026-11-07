#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  selectedPlanState,
  draftPlanCandidate,
  candidateDiff,
  applyPlanCandidate,
} from "./lib/plan-first.mjs";
import { screenPlanFirst } from "./lib/plan-first-screen.mjs";

if (isMainModule(import.meta.url)) {
  try {
    const [action, order, ...extra] = process.argv.slice(2);
    if (
      !["draft", "diff", "apply", "screen"].includes(action) ||
      !/^WO-\d{3}$/.test(order ?? "") ||
      (extra.length &&
        !(action === "draft" && extra.length === 1 && extra[0] === "--new"))
    )
      throw new Error("usage: plan-first draft|diff|apply|screen WO-NNN");
    const root = findLaunchpad();
    const state = selectedPlanState(root, order);
    if (!state) throw new Error("plan-first order is not active");
    const result =
      action === "draft"
        ? draftPlanCandidate(root, state, undefined, extra[0] === "--new")
        : action === "diff"
          ? candidateDiff(root, state).diff
          : action === "apply"
            ? applyPlanCandidate(root, state)
            : screenPlanFirst(
                root,
                state,
                process.stdin.isTTY ? undefined : readFileSync(0, "utf8"),
              );
    console.log(
      typeof result === "string" ? result : JSON.stringify(result, null, 2),
    );
    if (result?.status === "refused") process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
