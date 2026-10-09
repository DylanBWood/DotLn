import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { cpus, loadavg } from "node:os";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { docPath, docRelative, TOOL_ROOT } from "./config.mjs";
import { runGit, mainWorktree } from "./git.mjs";
import { completePassingRow } from "./gate-reuse.mjs";
import { readGateChecks, partialGateCheck } from "./gate-evidence.mjs";
import { readControl } from "./control-store.mjs";
import { readDecisions, collectMeta } from "./meta.mjs";
import { readFollowups } from "./planning-followups.mjs";
import { checkReleaseHistory } from "./release-history.mjs";

export const CONDITIONS_COMMAND = "npm run plan -- conditions";
const latency = "FUP-fb8cbeabbddef397";
const collection = "FUP-7f9a27e6ed6c44b3";
const evidence = "FUP-8a4e201d861208ad";
// One probe can report several source conditions; the shared gate also reports
// its docs-check task. Prose is never parsed into an executable command.
export const CONDITION_TABLE = Object.freeze([
  {
    id: "plan-check",
    sources: [latency],
    historicalSources: ["FUP-3dc0266d6b87b939", "FUP-ab1746dc9c595d95"],
    threshold: 8,
    unit: "s",
    method: "median of three fresh plan checks",
  },
  {
    id: "release-tags",
    sources: ["WO-086-D006"],
    threshold: 3,
    unit: "tags",
    method: "local annotated release tags absent from the generated table",
  },
  {
    id: "order-evidence",
    sources: [evidence],
    threshold: 1_000_000,
    unit: "bytes/order",
    consecutive: 2,
    method:
      "distinct blob bytes under each of the last two closed orders' evidence paths at HEAD",
  },
  {
    id: "week-evidence",
    sources: [evidence, "FUP-be1103fbfdd14653"],
    threshold: 10_000_000,
    unit: "bytes/week",
    method: "positive tracked evidence size additions since Monday 00:00 UTC",
  },
  {
    id: "collect-sources",
    sources: [collection],
    threshold: 3,
    unit: "s",
    method: "median of three fresh console collectSources calls",
  },
  {
    id: "release-list",
    sources: [collection],
    threshold: 10,
    unit: "s",
    method:
      "median of three fresh release lists, cache disabled without changing it",
  },
  {
    id: "status-bytes",
    sources: [collection],
    threshold: 32_000_000,
    unit: "bytes",
    method: "UTF-8 stdout of status --all --json",
  },
  {
    id: "order-index",
    sources: [collection],
    threshold: 10,
    unit: "s",
    method:
      "median of three readIndex calls rendering both generated pages, without writing",
  },
  {
    id: "document-gate",
    sources: [latency],
    threshold: 30,
    unit: "s",
    slow: true,
    method: "median of three fresh document gates (--slow)",
  },
  {
    id: "docs-check",
    sources: [latency],
    threshold: 15,
    unit: "s",
    slow: true,
    method: "median of the docs-check tasks in those same three gates (--slow)",
  },
]);
// Performance conditions use observed fresh work, never the zero duration of
// a reused task. A task's latest observation is compared with earlier samples.
export function gatePerformanceConditions(
  checks,
  now,
  { machinerySuites = [] } = {},
) {
  const end = Date.parse(now),
    start = end - 30 * 86400000;
  const rows = checks
    .filter(
      (row) =>
        row.checkId === "npm test" &&
        row.executed === true &&
        !partialGateCheck(row) &&
        row.identityUnchanged !== false &&
        !row.stopped &&
        !row.failureKind &&
        Date.parse(row.recordedAt) >= start &&
        Date.parse(row.recordedAt) <= end,
    )
    .sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt));
  const source = ["FUP-e96221b106cd136a"];
  const plain = rows.filter(
    (row) =>
      completePassingRow(row) &&
      row.executionMode !== "reused" &&
      !row.reused &&
      !(row.taskTimeline ?? row.cases ?? []).some((task) => task.reused) &&
      (row.gateSelection === "plain" ||
        (!row.gateSelection &&
          machinerySuites.length > 0 &&
          Array.isArray(row.requiredSuites) &&
          row.requiredSuites.length > 0 &&
          !row.requiredSuites.some((name) => machinerySuites.includes(name)))),
  );
  const samples = plain.map((row) => row.durationMs / 1000);
  const result = [
    {
      id: "plain-gate",
      sources: source,
      unit: "s",
      threshold: 360,
      method:
        "thirty-day median of fresh complete plain gates; legacy product-only selections inferred from required suites",
      value: samples.length ? median(samples) : null,
      samples: samples.length,
      holds: samples.length ? median(samples) > 360 : null,
      ...(samples.length
        ? {}
        : { unavailable: "no fresh complete plain rows in thirty days" }),
    },
  ];
  const tasks = new Map();
  for (const row of rows)
    for (const task of row.taskTimeline ?? row.cases ?? []) {
      if (
        !task.name ||
        task.reused ||
        task.executed !== true ||
        task.exitCode !== 0 ||
        task.stopped ||
        task.failureKind ||
        task.timedOut ||
        partialGateCheck(task) ||
        !Number.isFinite(task.durationMs) ||
        task.durationMs < 0
      )
        continue;
      const history = tasks.get(task.name) ?? [];
      history.push({ durationMs: task.durationMs, recordedAt: row.recordedAt });
      tasks.set(task.name, history);
    }
  for (const [name, history] of [...tasks]
    .sort((a, b) => b[1].at(-1).durationMs - a[1].at(-1).durationMs)
    .slice(0, 5)) {
    const latest = history.at(-1),
      prior = history.slice(0, -1).map((row) => row.durationMs / 1000);
    const baseline = prior.length ? median(prior) : null;
    result.push({
      id: "gate-task:" + name,
      sources: source,
      unit: "s",
      method: "latest fresh task against its earlier thirty-day median",
      value: latest.durationMs / 1000,
      median: baseline,
      samples: prior.length,
      threshold: baseline === null ? null : baseline * 1.5,
      recordedAt: latest.recordedAt,
      holds:
        baseline === null ? null : latest.durationMs / 1000 > baseline * 1.5,
      ...(baseline === null
        ? { unavailable: "no earlier fresh task sample in thirty days" }
        : {}),
    });
  }
  return result;
}

const median = (values) => {
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2
    ? ordered[middle]
    : (ordered[middle - 1] + ordered[middle]) / 2;
};
const oneLine = (value) =>
  String(value)
    .replace(/[\r\n\u0000-\u001f]/g, " ")
    .slice(0, 300);
export function validateConditionTable(table, decisions, register) {
  const known = new Set([
    ...decisions.map((row) => row.id),
    ...register.entries.map((row) => row.id),
  ]);
  for (const row of table) {
    if (!row.sources?.length || row.sources.some((id) => !known.has(id)))
      throw new Error(
        `${row.id}: unresolved condition source ${row.sources?.find((id) => !known.has(id)) ?? "missing"}`,
      );
  }
}
const tree = (root, revision, directory) => {
  const source = runGit(
    root,
    ["ls-tree", "-r", "-l", "-z", revision, "--", directory],
    { trim: false },
  );
  return source
    .split("\0")
    .filter(Boolean)
    .flatMap((row) => {
      const match = /^\d+ blob ([0-9a-f]+)\s+(\d+)\t([\s\S]+)$/.exec(row);
      return match
        ? [{ blob: match[1], bytes: Number(match[2]), path: match[3] }]
        : [];
    });
};
export function evidenceMeasurements(root, now) {
  const orders = [...readControl(root).orders]
    .filter(([, row]) => row.state.phase === "closed")
    .sort(([, a], [, b]) =>
      (a.closeRecordedAt ?? "").localeCompare(b.closeRecordedAt ?? ""),
    );
  const perOrder = orders.slice(-2).map(([id]) => {
    const blobs = new Map(
      tree(root, "HEAD", docRelative(root, "evidence", id)).map((row) => [
        row.blob,
        row.bytes,
      ]),
    );
    return {
      workOrder: id,
      bytes: [...blobs.values()].reduce((sum, bytes) => sum + bytes, 0),
    };
  });
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const since = start.toISOString();
  const revision = runGit(root, [
    "rev-list",
    "-1",
    `--before=${since}`,
    "HEAD",
  ]);
  const directory = docRelative(root, "evidence");
  const before = new Map(
    (revision ? tree(root, revision, directory) : []).map((row) => [
      row.path,
      row.bytes,
    ]),
  );
  const weekly = tree(root, "HEAD", directory).reduce(
    (sum, row) => sum + Math.max(0, row.bytes - (before.get(row.path) ?? 0)),
    0,
  );
  return { perOrder, weekly, since, baseCommit: revision || null };
}
const child = (root, args, timeout) => {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    timeout,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0 || result.error)
    throw new Error(
      `probe exit ${result.status ?? "unknown"}: ${result.error?.code ?? oneLine(result.stderr)}`,
    );
  return result.stdout;
};
const expression = (relative) =>
  JSON.stringify(new URL(relative, `file://${TOOL_ROOT}/`).href);
function timed(root, code, timeout) {
  return Number(
    child(
      root,
      [
        "--input-type=module",
        "-e",
        `import {performance} from "node:perf_hooks"; const start=performance.now(); ${code}; console.log((performance.now()-start)/1000);`,
      ],
      timeout,
    )
      .trim()
      .split("\n")
      .at(-1),
  );
}
async function measureCondition(root, row, context) {
  if (row.id === "release-tags") {
    const display = docRelative(root, "product", "06-roadmap.md");
    const checked = checkReleaseHistory(
      root,
      readFileSync(docPath(root, "product", "06-roadmap.md"), "utf8"),
      display,
    );
    if (!checked.present || checked.failures.length)
      throw new Error(checked.failures.join("; ") || "release table absent");
    return { value: checked.newer.length, tags: checked.newer };
  }
  if (["order-evidence", "week-evidence"].includes(row.id)) {
    context.evidence ??= evidenceMeasurements(root, context.now);
    return row.id === "order-evidence"
      ? {
          value: context.evidence.perOrder.map((sample) => sample.bytes),
          orders: context.evidence.perOrder.map((sample) => sample.workOrder),
        }
      : {
          value: context.evidence.weekly,
          since: context.evidence.since,
          baseCommit: context.evidence.baseCommit,
        };
  }
  if (row.id === "status-bytes")
    return {
      value: Buffer.byteLength(
        child(
          root,
          [join(TOOL_ROOT, "scripts/resume.mjs"), "status", "--all", "--json"],
          context.remaining(),
        ),
      ),
    };
  if (row.slow) {
    if (!context.gates) {
      const runs = [];
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        const output = child(
          root,
          [join(TOOL_ROOT, "scripts/test-runner.mjs"), "--document"],
          context.remaining(),
        );
        const match = /^PASS docs-check ([\d.]+) s$/m.exec(output);
        if (!match)
          throw new Error(
            "document gate did not report its docs-check duration",
          );
        runs.push({
          gate: (performance.now() - start) / 1000,
          docs: Number(match[1]),
        });
      }
      context.gates = runs;
    }
    const samples = context.gates.map((run) =>
      row.id === "document-gate" ? run.gate : run.docs,
    );
    return { value: median(samples), samples };
  }
  const codes = {
    "plan-check": `const {main}=await import(${expression("scripts/refute-plan.mjs")}); await main(["check"],process.cwd())`,
    "collect-sources": `const {collectSources}=await import(${expression("packages/console/dist/src/collect.js")}); await collectSources(process.cwd())`,
    "release-list": `const {listPublishedReleases}=await import(${expression("scripts/release.mjs")}); listPublishedReleases(process.cwd(),{cold:true})`,
    "order-index": `const {readIndex,renderIndex,renderHistory}=await import(${expression("scripts/work-orders.mjs")}); const index=readIndex(process.cwd()); renderIndex(index); renderHistory(index)`,
  };
  const samples = [];
  for (let i = 0; i < 3; i++)
    samples.push(timed(root, codes[row.id], context.remaining()));
  if (!samples.every(Number.isFinite))
    throw new Error("timing sample unavailable");
  return { value: median(samples), samples };
}
export async function planningConditions(
  root,
  {
    slow = false,
    table = CONDITION_TABLE,
    measure = measureCondition,
    now = new Date().toISOString(),
    wallMs = slow ? 300_000 : 55_000,
  } = {},
) {
  const started = performance.now();
  const decisions = readDecisions(root),
    register = readFollowups(root);
  validateConditionTable(table, decisions, register);
  const context = {
    now,
    remaining: () =>
      Math.max(1, Math.floor(wallMs - (performance.now() - started))),
  };
  const host = {
    loadAverage: loadavg(),
    logicalCpus: cpus().length,
    observedAt: now,
    classification: "load measured; other host activity unknown",
  };
  const rows = [];
  for (const row of table) {
    let measurement;
    try {
      if (row.slow && !slow) throw new Error("not measured; use --slow");
      if (performance.now() - started >= wallMs)
        throw new Error("listing wall budget exhausted");
      measurement = await measure(root, row, context);
    } catch (error) {
      measurement = { value: null, unavailable: oneLine(error.message) };
    }
    const values = Array.isArray(measurement.value)
      ? measurement.value
      : [measurement.value];
    const holds =
      values.length === (row.consecutive ?? 1) && values.every(Number.isFinite)
        ? values.every((value) => value > row.threshold)
        : null;
    rows.push({ ...row, ...measurement, holds });
  }
  if (table === CONDITION_TABLE) {
    try {
      let main;
      try {
        main = mainWorktree(root);
      } catch {
        /* A standalone checkout still has local history. */
      }
      const history = [
        ...(main && main !== root ? readGateChecks(main) : []),
        ...readGateChecks(root),
      ];
      const unique = new Map(
        history.map((row) => [
          JSON.stringify([
            row.treeHash,
            row.codeIdentity,
            row.recordedAt,
            row.evidenceRef,
          ]),
          row,
        ]),
      );
      const { suites } = await import("../test-runner.mjs");
      rows.push(
        ...gatePerformanceConditions([...unique.values()], now, {
          machinerySuites: suites
            .filter((suite) => suite.machinery)
            .map((suite) => suite.name),
        }),
      );
    } catch (error) {
      rows.push({
        id: "plain-gate",
        sources: ["FUP-e96221b106cd136a"],
        method: "thirty-day gate history",
        value: null,
        threshold: 360,
        unit: "s",
        holds: null,
        unavailable: oneLine(error.message),
      });
    }
  }
  let numeric = [];
  try {
    numeric = (await collectMeta(root)).decisionConditions;
  } catch (error) {
    for (const row of decisions.filter(
      (row) => typeof row.reopenWhen === "object",
    ))
      numeric.push({
        decision: row.id,
        condition: row.reopenWhen,
        values: [null],
        holds: null,
        unavailable: oneLine(error.message),
      });
  }
  for (const row of numeric)
    rows.push({
      id: row.condition.metric,
      sources: [row.decision],
      method:
        "meter's budget/order measurements; a later reopens record settles it",
      value: row.values,
      threshold: row.condition.value,
      operator: row.condition.operator,
      unit: "metric",
      holds: row.reopened ? false : row.holds,
      reopened: row.reopened,
      ...(row.unavailable ? { unavailable: row.unavailable } : {}),
    });
  const evaluatedDecisions = new Set(
    rows
      .flatMap((row) => row.sources)
      .filter((id) => decisions.some((row) => row.id === id)),
  );
  const evaluatedRegister = new Set(
    rows
      .flatMap((row) => row.sources)
      .filter((id) => register.entries.some((row) => row.id === id)),
  );
  return {
    command: CONDITIONS_COMMAND,
    observedAt: now,
    host,
    rows,
    holding: rows.filter((row) => row.holds === true).length,
    unknown: rows.filter((row) => row.holds === null).length,
    unevaluated: {
      decisionConditions: decisions.length - evaluatedDecisions.size,
      registerRows: register.entries.length - evaluatedRegister.size,
    },
    durationMs: performance.now() - started,
  };
}
export function renderPlanningConditions(result) {
  const cell = (value) =>
    String(value)
      .replaceAll("|", "\\|")
      .replace(/[\r\n]/g, " ");
  return [
    `Reopening conditions at ${result.observedAt}; ${(result.durationMs / 1000).toFixed(3)} s.`,
    `Host load averages: ${result.host.loadAverage.join(", ")}; ${result.host.logicalCpus} logical CPUs; other activity unknown.`,
    "| Source | Measurement | Value | Threshold | Holds |",
    "| --- | --- | --- | --- | --- |",
    ...result.rows.map(
      (row) =>
        `| ${row.sources.join(", ")}${row.historicalSources ? ` (historical: ${row.historicalSources.join(", ")})` : ""} | ${cell(row.id + ": " + row.method + (row.median !== undefined ? "; median " + (row.median ?? "unknown") + " s (" + row.samples + " samples)" : ""))} | ${cell(row.value === null ? "unknown" : JSON.stringify(row.value))} ${row.unit} | ${row.operator ?? ">"} ${row.threshold}${row.consecutive ? ` in ${row.consecutive} consecutive orders` : ""} | ${row.holds === null ? `unknown (${cell(row.unavailable ?? "measurement unavailable")})` : row.holds}${row.reopened ? " (reopened)" : ""} |`,
    ),
    `${result.holding} hold; ${result.unknown} unknown. Not evaluated: ${result.unevaluated.decisionConditions} decision conditions and ${result.unevaluated.registerRows} register rows.`,
  ].join("\n");
}
export async function conditionsAtStart(root) {
  try {
    const result = await planningConditions(root);
    return {
      command: CONDITIONS_COMMAND,
      holding: result.holding,
      unknown: result.unknown,
      unevaluated: result.unevaluated,
      durationMs: Math.round(result.durationMs),
      slow: `${CONDITIONS_COMMAND} --slow`,
    };
  } catch (error) {
    return {
      command: CONDITIONS_COMMAND,
      unavailable: `count not computed: ${oneLine(error.message)}`,
    };
  }
}
