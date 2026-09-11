#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  collectMeta,
  renderMeta,
  writeDecisionsIndex,
  checkMeta,
  metaHealth,
} from "./lib/meta.mjs";
import {
  recordUsageObservation,
  collectSessionUsage,
  usageSessionKey,
} from "../packages/skeleton/src/usage-observation.mjs";
import { syncFollowups } from "./lib/planning-followups.mjs";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
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
    const observation = collectSessionUsage(repo, {
      since,
      sessionKey: key,
      ...(options["--transcript"]
        ? { transcriptPath: options["--transcript"] }
        : {}),
    });
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
  writeDecisionsIndex(repo, { check: Boolean(options["--check"]) });
  syncFollowups(repo, { check: Boolean(options["--check"]) });
  const meta = await collectMeta(repo);
  if (options["--plan-cost"]) {
    const { buildPlanSubject } = await import("./lib/plan-subject.mjs");
    const subject = buildPlanSubject(repo, "HEAD", {
      workspace: true,
      costTable: false,
    });
    if (!subject.costTable)
      throw new Error("Planning cost collection needs the budget contract");
    const table = {
      ...subject.costTable,
      observedAt: meta.observedAt,
      subjectRevision: subject.revision,
      rows: subject.orders.map((order) => ({
        workOrder: order.workOrderId,
        observedAt: meta.observedAt,
        metrics:
          meta.orders.find((row) => row.workOrder === order.workOrderId)
            ?.metrics ?? null,
      })),
      traps: meta.traps,
    };
    const text = JSON.stringify(table, null, 2) + "\n";
    if (Buffer.byteLength(text) > 65536)
      throw new Error(
        "Planning cost table exceeds 64 KB; select the bounded subject rows",
      );
    writeFileSync(join(repo, "docs/planning/cost-table.json"), text);
  }
  if (options["--write"]) {
    const path = options["--write"];
    if (!/^docs\/evidence\/WO-\d{3}\/meta(?:-baseline)?\.json$/.test(path))
      throw new Error(
        "Meter snapshot must be the selected order's evidence file",
      );
    if (path.endsWith("meta-baseline.json") && existsSync(join(repo, path)))
      throw new Error(
        "The first meter baseline is immutable; write meta.json for a later observation",
      );
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), JSON.stringify(meta, null, 2) + "\n");
  }
  if (options["--check"]) checkMeta(meta);
  console.log(
    options["--json"]
      ? JSON.stringify(meta, null, 2)
      : `${renderMeta(meta)}\n\n${metaHealth(meta)}`,
  );
  return meta;
}
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  try {
    await metaMain();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
