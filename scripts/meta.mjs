#!/usr/bin/env node
import { json as prettyJson } from "./lib/helpers.mjs";
import { docPath, findLaunchpad, rootPattern } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import {
  collectMeta,
  renderMeta,
  writeDecisionsIndex,
  checkMeta,
  metaHealth,
  planCostTable,
  planCostText,
  writeOrderSnapshot,
} from "./lib/meta.mjs";
import {
  recordUsageObservation,
  collectSessionUsage,
  usageSessionKey,
  usageObservation,
} from "../packages/skeleton/src/usage-observation.mjs";
import { refreshExecutorIndex } from "./lib/executor-handoff.mjs";
import { syncFollowups } from "./lib/planning-followups.mjs";
import { checkReceiptCostLines } from "./lib/receipt-cost.mjs";

const root = findLaunchpad();
export async function metaMain(args = process.argv.slice(2), repo = root) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (
      ["--check", "--json", "--collect", "--plan-cost"].includes(flag) &&
      options[flag] === undefined
    )
      options[flag] = true;
    else if (
      [
        "--work-order",
        "--role",
        "--since",
        "--transcript",
        "--session",
        "--dispatch",
        "--write",
      ].includes(flag) &&
      options[flag] === undefined &&
      args[index + 1]
    )
      options[flag] = args[++index];
    else
      throw new Error(
        "usage: meta [--check|--json] [--write docs/evidence/WO-NNN/meta[-baseline].json] [--collect --work-order WO-NNN --role <kind> --since <UTC> [--session <session> --transcript <path>] [--dispatch <planning-pass>]]",
      );
  }
  if (
    options["--check"] &&
    (options["--collect"] || options["--write"] || options["--plan-cost"])
  )
    throw new Error("meta --check is read-only");
  if (options["--collect"]) {
    const since = options["--since"];
    if (!since || !Number.isFinite(Date.parse(since)))
      throw new Error(
        "Token measurement requires --since with the dispatch start time",
      );
    const identity = options["--session"] ?? process.env.CODEX_THREAD_ID;
    const key = identity ? usageSessionKey(identity) : undefined;
    let observation;
    try {
      observation = collectSessionUsage(repo, {
        since,
        sessionKey: key,
        ...(options["--transcript"]
          ? { transcriptPath: options["--transcript"] }
          : {}),
      });
    } catch (error) {
      observation = {
        ...usageObservation([]),
        observedAt: new Date().toISOString(),
        scope: "dispatch",
      };
      console.warn(`Advisory: usage unknown: ${error.message}`);
    }
    recordUsageObservation(repo, {
      workOrder: options["--work-order"] ?? null,
      role: options["--role"],
      ...(options["--dispatch"] ? { dispatch: options["--dispatch"] } : {}),
      sessionKey: key,
      startedAt: since,
      durationMs: Date.now() - Date.parse(since),
      observation,
    });
  }
  if (options["--check"]) checkReceiptCostLines(repo);
  writeDecisionsIndex(repo, { check: Boolean(options["--check"]) });
  syncFollowups(repo, { check: Boolean(options["--check"]) });
  if (!options["--check"]) await refreshExecutorIndex(repo);
  const meta = await collectMeta(repo);
  if (options["--plan-cost"]) {
    const { buildPlanSubject } = await import("./lib/plan-subject.mjs");
    const subject = buildPlanSubject(repo, "HEAD", {
      workspace: true,
      costTable: false,
    });
    if (!subject.costTable)
      throw new Error("Planning cost collection needs the budget contract");
    writeFileSync(
      docPath(repo, "planning", "cost-table.json"),
      planCostText(planCostTable(meta, subject)),
    );
  }
  if (options["--write"]) {
    const path = options["--write"];
    if (
      !new RegExp(
        `^${rootPattern(repo, "evidence")}/WO-\\d{3}/meta(?:-baseline)?\\.json$`,
      ).test(path)
    )
      throw new Error(
        "Meter snapshot must be the selected order's evidence file",
      );
    if (path.endsWith("meta-baseline.json") && existsSync(join(repo, path)))
      throw new Error(
        "The first meter baseline is immutable; write meta.json for a later observation",
      );
    if (path.endsWith("meta-baseline.json")) {
      mkdirSync(dirname(join(repo, path)), { recursive: true });
      writeFileSync(join(repo, path), prettyJson(meta));
    } else {
      // WO-170: a later observation is the order's bounded snapshot, as
      // release prepare writes it.
      const workOrder = path.match(/(WO-\d{3})\/meta\.json$/)[1];
      const snapshot = writeOrderSnapshot(repo, meta, workOrder);
      if (snapshot.reason)
        throw new Error(`Meter snapshot not written: ${snapshot.reason}`);
    }
  }
  if (options["--check"]) checkMeta(meta);
  console.log(
    options["--json"]
      ? JSON.stringify(meta, null, 2)
      : `${renderMeta(meta)}\n\n${metaHealth(meta)}`,
  );
  return meta;
}
if (isMainModule(import.meta.url)) {
  try {
    await metaMain();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
