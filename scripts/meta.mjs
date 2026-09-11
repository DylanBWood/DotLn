#!/usr/bin/env node
import {
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";
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
  transcriptUsage,
} from "../packages/skeleton/src/usage-observation.mjs";
import { syncFollowups } from "./lib/planning-followups.mjs";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
export function currentCodexTranscripts(
  repo,
  since,
  directory = join(
    process.env.CODEX_HOME ?? join(homedir(), ".codex"),
    "sessions",
  ),
) {
  if (!since || !Number.isFinite(Date.parse(since)))
    throw new Error("Usage collection needs the dispatch start time");
  if (!existsSync(directory)) return [];
  const paths = [];
  const days = [];
  const today = new Date().toISOString().slice(0, 10);
  for (
    let date = since.slice(0, 10);
    date <= today;
    date = new Date(Date.parse(`${date}T00:00:00.000Z`) + 86400000)
      .toISOString()
      .slice(0, 10)
  )
    days.push(join(directory, date.replaceAll("-", "/")));
  for (const day of days) {
    if (!existsSync(day)) continue;
    for (const name of readdirSync(day)) {
      const path = join(day, name);
      if (
        !name.endsWith(".jsonl") ||
        !lstatSync(path).isFile() ||
        lstatSync(path).isSymbolicLink()
      )
        continue;
      const descriptor = openSync(path, "r");
      const buffer = Buffer.alloc(65536);
      let count;
      try {
        count = readSync(descriptor, buffer, 0, buffer.length, 0);
      } finally {
        closeSync(descriptor);
      }
      let header;
      try {
        header = JSON.parse(
          buffer.subarray(0, count).toString("utf8").split("\n")[0],
        );
      } catch {
        continue;
      }
      if (
        header.type === "session_meta" &&
        typeof header.payload?.cwd === "string" &&
        resolve(header.payload.cwd) === resolve(repo)
      )
        paths.push(path);
    }
  }
  return paths;
}

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
      ["--work-order", "--role", "--since", "--transcript", "--write"].includes(
        flag,
      ) &&
      options[flag] === undefined &&
      args[index + 1]
    )
      options[flag] = args[++index];
    else
      throw new Error(
        "usage: meta [--check|--json] [--write docs/evidence/WO-NNN/meta[-baseline].json] [--collect --work-order WO-NNN --role <kind> --since <UTC> [--transcript <path>]]",
      );
  }
  if (
    options["--check"] &&
    (options["--collect"] || options["--write"] || options["--plan-cost"])
  )
    throw new Error("meta --check is read-only");
  if (options["--collect"]) {
    const since = options["--since"];
    const paths = options["--transcript"]
      ? [resolve(options["--transcript"])]
      : currentCodexTranscripts(repo, since);
    if (!paths.length)
      console.error(
        "Usage unavailable: no matching transcript for this worktree and dispatch window",
      );
    for (const [ordinal, path] of paths.entries())
      recordUsageObservation(repo, {
        workOrder: options["--work-order"],
        role: options["--role"],
        startedAt: since,
        durationMs: Date.now() - Date.parse(since),
        ordinal,
        observation: transcriptUsage(path, { since }),
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
