import { docPath, docRelative, rootPattern } from "./config.mjs";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { usageRecordIdentity } from "../../packages/skeleton/src/usage-observation.mjs";
import { correctionCounts } from "../../packages/skeleton/src/correction-observation.mjs";
import { readControl, eventsForOrder } from "./control-store.mjs";
import { completedPhaseAttempts } from "./control-time.mjs";
import { readGateChecks } from "./gate-evidence.mjs";
import {
  readBudgets,
  budgetVerdict,
  dispatchKinds,
  measureColdStarts,
} from "./process-budget.mjs";

const json = (root, path, fallback = null) =>
  existsSync(join(root, path))
    ? JSON.parse(readFileSync(join(root, path), "utf8"))
    : fallback;
const jsonl = (root, path) =>
  existsSync(join(root, path))
    ? readFileSync(join(root, path), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    : [];
const bytes = (root, path) =>
  existsSync(join(root, path)) && lstatSync(join(root, path)).isFile()
    ? readFileSync(join(root, path)).length
    : null;
const sumKnown = (values) =>
  values.length && values.every(Number.isFinite)
    ? values.reduce((sum, value) => sum + value, 0)
    : null;
const delta = (value, previous) =>
  Number.isFinite(value) && Number.isFinite(previous) ? value - previous : null;
const git = (root, args) => {
  const run = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  return run.status === 0 ? run.stdout.trimEnd() : null;
};
const roleForPhase = {
  implementation: "executor",
  repair: "executor",
  verification: "verifier",
  finalReview: "reviewer",
};

// GitHub-style fragments include the whole heading, including any title after
// the stable decision id. Fence contents are never headings.
export const markdownHeadings = (source) => {
  const visible = source.replace(
    /^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm,
    (match) => match.replace(/[^\n]/g, " "),
  );
  const seen = new Map();
  return [...visible.matchAll(/^#{1,6} (.+?)[ \t]*#*[ \t]*$/gm)].map(
    (match) => {
      const stem = match[1]
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_\s-]/gu, "")
        .replace(/\s/g, "-");
      const ordinal = seen.get(stem) ?? 0;
      seen.set(stem, ordinal + 1);
      return {
        index: match.index,
        anchor: `${stem}${ordinal ? `-${ordinal}` : ""}`,
      };
    },
  );
};

// Experiment evidence extends the existing decision record, not the runtime
// schema. Unknown token/effect observations are null, never invented zeros.
function checkExperiment(entry, path) {
  const text = (value) => typeof value === "string" && value.trim();
  const texts = (value) =>
    Array.isArray(value) && value.length > 0 && value.every(text);
  const measured = (value) => Number.isFinite(value) && value >= 0;
  const optionalMeasurement = (value) => value === null || measured(value);
  const effectMeasurement = (value) => value === null || Number.isFinite(value);
  if (
    !text(entry.question) ||
    !texts(entry.alternatives) ||
    entry.alternatives.length < 2 ||
    !text(entry.observation) ||
    !["run", "declined"].includes(entry.execution) ||
    !["adopted", "kept-current", "inconclusive"].includes(entry.outcome) ||
    (entry.execution === "declined" &&
      (!text(entry.reason) || entry.outcome !== "kept-current"))
  )
    throw new Error(
      `${path}: experiment requires question, alternatives, observation, execution and outcome; declining requires a reason and kept-current`,
    );
  if (
    !measured(entry.budget?.wallSeconds) ||
    entry.budget.wallSeconds <= 0 ||
    entry.budget.wallSeconds > 900 ||
    !measured(entry.cost?.wallSeconds) ||
    entry.cost.wallSeconds > entry.budget.wallSeconds ||
    !optionalMeasurement(entry.cost.tokens) ||
    !texts(entry.cost.commands) ||
    !text(entry.cost.source)
  )
    throw new Error(
      `${path}: experiment requires measured cost with commands/source inside its budget (at most 900 s); unknown tokens use null`,
    );
  if (
    !effectMeasurement(entry.effect?.wallSecondsPerOrder) ||
    !effectMeasurement(entry.effect?.tokensPerOrder) ||
    !texts(entry.effect?.commands) ||
    !text(entry.effect?.summary)
  )
    throw new Error(
      `${path}: experiment effect requires commands, summary and per-order observations (null when unknown)`,
    );
  if (
    ![true, false, "unknown"].includes(entry.regression) ||
    !(
      entry.history?.lastAdoptedImprovementAt === null ||
      (typeof entry.history?.lastAdoptedImprovementAt === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(entry.history.lastAdoptedImprovementAt))
    ) ||
    !(
      entry.history?.experimentsSinceAdoption === null ||
      (Number.isInteger(entry.history?.experimentsSinceAdoption) &&
        entry.history.experimentsSinceAdoption >= 0)
    )
  )
    throw new Error(
      `${path}: experiment requires regression and history observations; unknown history uses null`,
    );
}

export function readDecisions(root, { workOrder } = {}) {
  const directory = docPath(root, "evidence");
  const decisions = [];
  if (!existsSync(directory)) return decisions;
  for (const name of readdirSync(directory)
    .sort()
    .filter(
      (name) => /^WO-\d{3}$/.test(name) && (!workOrder || name === workOrder),
    )) {
    const path = docRelative(root, "evidence", `${name}/decisions.md`);
    if (!existsSync(join(root, path))) continue;
    const source = readFileSync(join(root, path), "utf8");
    const headings = markdownHeadings(source);
    const entries = [...source.matchAll(/^```json\n([\s\S]*?)^```/gm)];
    if (!entries.length)
      throw new Error(
        `${path}: decision entries must use the documented JSON shape`,
      );
    for (const match of entries) {
      const entry = JSON.parse(match[1]);
      if (
        typeof entry.id !== "string" ||
        !entry.id.startsWith(`${name}-`) ||
        !entry.date ||
        !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
        !entry.dispatch?.trim() ||
        !entry.decision?.trim() ||
        !entry.reopenWhen ||
        !Array.isArray(entry.evidence) ||
        !entry.evidence.length ||
        !Array.isArray(entry.rejected)
      )
        throw new Error(
          `${path}: decision requires id, date, dispatch source, evidence, rejected choices and reopening condition`,
        );
      if (
        entry.kind === "correction" &&
        !["misread", "meant", "changed"].every(
          (key) => typeof entry[key] === "string" && entry[key].trim(),
        )
      )
        throw new Error(
          `${path}: correction requires what was misread, meant and changed`,
        );
      if (entry.kind === "experiment") checkExperiment(entry, path);
      const condition = entry.reopenWhen;
      if (
        !(typeof condition === "string" && condition.trim()) &&
        !(
          condition &&
          typeof condition === "object" &&
          typeof condition.metric === "string" &&
          [">", ">=", "<"].includes(condition.operator) &&
          Number.isFinite(condition.value) &&
          Number.isInteger(condition.consecutive ?? 1) &&
          (condition.consecutive ?? 1) > 0
        )
      )
        throw new Error(
          `${path}: reopening condition must be readable prose or a bounded metric predicate`,
        );
      if (decisions.some((prior) => prior.id === entry.id))
        throw new Error(`Duplicate decision id: ${entry.id}`);
      if (
        entry.followup !== undefined &&
        !(typeof entry.followup === "string" && entry.followup.trim())
      )
        throw new Error(`${path}: followup must name an action`);
      if (
        entry.reopens !== undefined &&
        !(
          entry.reopens &&
          typeof entry.reopens === "object" &&
          /^WO-\d{3}-D\d{3}$/.test(entry.reopens.decisionId) &&
          entry.reopens.decisionId !== entry.id &&
          typeof entry.reopens.observation === "string" &&
          entry.reopens.observation.trim()
        )
      )
        throw new Error(
          `${path}: reopens requires another decisionId and its observed trigger`,
        );
      const row = { ...entry, workOrder: name, path };
      // Projection metadata cannot alter historic decision/amendment hashes.
      Object.defineProperty(row, "anchor", {
        value: headings.findLast((heading) => heading.index < match.index)
          ?.anchor,
      });
      decisions.push(row);
    }
  }
  return decisions;
}
const safeCell = (value) =>
  String(value).replaceAll("|", "\\|").replace(/\s+/g, " ");
export function renderDecisionsIndex(decisions) {
  return [
    "# Decisions index",
    "",
    "Generated by `npm run meta` from per-order decisions. Original records retain their sources, rejected alternatives and reopening conditions. A non-goal is local to its order.",
    "",
    "| Decision | Dispatch source | Choice | Reopen when |",
    "| --- | --- | --- | --- |",
    ...decisions.map(
      (row) =>
        `| [${row.id}](../evidence/${row.workOrder}/decisions.md#${row.anchor ?? row.id.toLowerCase()}) | ${safeCell(row.dispatch)} | ${safeCell(row.decision)} | ${safeCell(typeof row.reopenWhen === "string" ? row.reopenWhen : JSON.stringify(row.reopenWhen))} |`,
    ),
    "",
  ].join("\n");
}
export function writeDecisionsIndex(root, { check = false } = {}) {
  const decisions = readDecisions(root);
  const path = docPath(root, "lineage", "decisions-index.md");
  const expected = renderDecisionsIndex(decisions);
  if (check) {
    for (const row of decisions) {
      const anchors = markdownHeadings(
        readFileSync(join(root, row.path), "utf8"),
      );
      if (
        !row.anchor ||
        !anchors.some((heading) => heading.anchor === row.anchor)
      )
        throw new Error(
          `Decision index fragment does not resolve: ${row.path}#${row.anchor ?? row.id.toLowerCase()}`,
        );
    }
    if (!existsSync(path) || readFileSync(path, "utf8") !== expected)
      throw new Error("Decisions index is stale; run npm run meta");
  } else if (!existsSync(path) || readFileSync(path, "utf8") !== expected) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, expected);
  }
  return decisions;
}

export function mergedSubjects(root, count = 5) {
  const source = git(root, [
    "log",
    "--first-parent",
    "--merges",
    `-${count}`,
    "--format=%s%x00%b%x00",
    "HEAD",
  ]);
  if (source === null) return [];
  const values = source.split("\0");
  const rows = [];
  for (let index = 0; index + 1 < values.length; index += 2) {
    const subject = values[index].trim(),
      body = values[index + 1].trim();
    if (!subject) continue;
    const title =
      /^Merge pull request /i.test(subject) && body
        ? body.split("\n")[0]
        : subject;
    const workOrder =
      title.match(/\bWO-\d{3}\b/)?.[0] ??
      (subject.match(/\/wo-(\d{3})\b/)?.[1]
        ? `WO-${subject.match(/\/wo-(\d{3})\b/)[1]}`
        : null);
    rows.push({ title, characters: [...title].length, workOrder });
  }
  return rows.reverse();
}

export { inheritedLedgerDuty } from "./dependencies.mjs";
export function codeDiffBytes(root, revision) {
  const command = revision
    ? ["show", "--format=", revision, "--", "packages", "scripts"]
    : ["diff", "HEAD", "--", "packages", "scripts"];
  const output = git(root, command);
  if (output === null) return null;
  let total = Buffer.byteLength(output);
  if (!revision) {
    const paths = git(root, [
      "ls-files",
      "--others",
      "--exclude-standard",
      "-z",
      "--",
      "packages",
      "scripts",
    ]);
    if (paths === null) return null;
    for (const path of paths.split("\0").filter(Boolean)) {
      const patch = spawnSync(
        "git",
        ["diff", "--no-index", "--", "/dev/null", path],
        { cwd: root, maxBuffer: 8 * 1024 * 1024 },
      );
      if (![0, 1].includes(patch.status) || !patch.stdout) return null;
      total += patch.stdout.length;
    }
  }
  return total;
}

function hookObservations(root, workOrder) {
  const directory = docPath(root, "control", "local/harness");
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => /^[a-f0-9]{64}\.jsonl$/.test(name))
    .flatMap((name) => {
      const state = json(
        root,
        docRelative(root, "control", `local/harness/${name.slice(0, -1)}`),
        {},
      );
      let role;
      return jsonl(root, docRelative(root, "control", `local/harness/${name}`))
        .filter(
          (row) =>
            (Object.hasOwn(row, "workOrder")
              ? row.workOrder
              : state.workOrder) === workOrder,
        )
        .map((row) => {
          if (row.role) role = row.role;
          // Timing follows the evaluated event. Attribute it from the preceding
          // observed role, without an extra session-file read on every hook call.
          return {
            ...row,
            journal: name,
            ...(row.hookTiming && !row.role && role ? { role } : {}),
          };
        });
    });
}
function usageRows(root, workOrder) {
  return latestUsage(
    jsonl(root, docRelative(root, "control", "local/process/usage.jsonl")),
    workOrder,
  );
}
// The last recorded observation of a dispatch wins, whatever order the rows are
// read in: retained copies are read by name, and preservation's `-10` sorts
// before `-2` (VER-001 F1). Rows are ordered by recording time, then by
// observation cutoff; an undated value counts as earlier than any dated one,
// and rows equal on both keep the order they were read in.
const dated = (value) => {
  const time = Date.parse(value ?? "");
  return Number.isFinite(time) ? time : -Infinity;
};
const byTime = (a, b) => (a === b ? 0 : a - b);
function latestUsage(parsed, workOrder) {
  const rows = parsed
    .filter((row) => row.workOrder === workOrder)
    .map((row) => [
      dated(row.recordedAt),
      dated(row.observation.observedAt),
      row,
    ])
    .sort(([a, x], [b, y]) => byTime(a, b) || byTime(x, y))
    .map(([, , row]) => row);
  const latest = new Map();
  const superseded = new Set(rows.flatMap((row) => row.supersedes ?? []));
  for (const row of rows.filter(
    (row) => !superseded.has(usageRecordIdentity(row)),
  ))
    latest.set(
      `${row.role}:${row.startedAt ?? "dispatch"}:${row.sessionKey ?? row.ordinal ?? 0}:${row.observation.source}`,
      row,
    );
  return [...latest.values()].map(({ sessionKey, supersedes, ...row }) => row);
}

// `worktree finish` keeps a closed order's usage file in its retained lane,
// under the collision names preservation gives it (harness-prune.mjs matches
// the same names). Lane-relative paths, sorted, so a snapshot names them
// stably; which observation wins does not depend on this order (latestUsage).
const retainedUsageName = new RegExp(
  String.raw`(?:^|/)process(?:\.from-WO-\d{3,}(?:-\d+)?)*/usage\.jsonl(?:\.from-WO-\d{3,}(?:-\d+)?)*$`,
  "u",
);
const laneFiles = (directory, prefix = "") =>
  readdirSync(join(directory, prefix), { withFileTypes: true }).flatMap(
    (entry) => {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      // A link, to a file or a directory, is never followed out of the lane.
      return entry.isDirectory()
        ? laneFiles(directory, path)
        : entry.isFile()
          ? [path]
          : [];
    },
  );
/** A retained lane's usage copies, each with every line it could parse; a
 * line that is not JSON is counted, never read and never fatal. */
export function retainedUsageCopies(root, workOrder) {
  const lane = docRelative(root, "control", `local/retained/${workOrder}`);
  const directory = join(root, lane);
  if (!existsSync(directory) || !lstatSync(directory).isDirectory()) return [];
  return laneFiles(directory)
    .filter((path) => retainedUsageName.test(path))
    .sort()
    .map((path) => {
      const bytes = readFileSync(join(directory, path));
      const rows = [];
      let unreadable = 0;
      for (const line of bytes.toString("utf8").split("\n").filter(Boolean))
        try {
          const row = JSON.parse(line);
          if (row && typeof row === "object" && row.observation) rows.push(row);
          else unreadable++;
        } catch {
          unreadable++;
        }
      return { path, lanePath: `${lane}/${path}`, bytes, rows, unreadable };
    });
}
const retainedUsage = (copies, workOrder) =>
  latestUsage(
    copies.flatMap((copy) => copy.rows),
    workOrder,
  );

const roleRank = (role) =>
  dispatchKinds.includes(role) ? dispatchKinds.indexOf(role) : Infinity;
const orderedRoles = (roles) =>
  [...new Set(roles.filter((role) => typeof role === "string"))].sort(
    (a, b) => roleRank(a) - roleRank(b) || a.localeCompare(b),
  );
/** Usage totals by role: tokens, cost, commands and steps over the dispatch
 * rows the meter already sums; wall time over every row, as dispatch rows do. */
export function usageTotals(rows) {
  return Object.fromEntries(
    orderedRoles(rows.map((row) => row.role)).map((role) => {
      const all = rows.filter((row) => row.role === role),
        dispatch = all.filter((row) => row.observation?.scope === "dispatch");
      return [
        role,
        {
          dispatches: dispatch.length,
          totalTokens: sumKnown(
            dispatch.map((row) => row.observation.usage?.totalTokens),
          ),
          costUsd: sumKnown(
            dispatch.map((row) => row.observation.usage?.costUsd),
          ),
          commandsRun: sumKnown(
            dispatch.map((row) => row.observation.activity?.commandsRun),
          ),
          stepCount: sumKnown(
            dispatch.map((row) => row.observation.activity?.stepCount),
          ),
          durationMs: sumKnown(all.map((row) => row.durationMs)),
        },
      ];
    }),
  );
}

// WO-170: the operator's directions, counted from what the record publishes.
// The docs check has required a control prefix on every dispatch since WO-085;
// records filed before it are counted when they begin with "operator", except
// the lifecycle dispatch "Operator resume:" that names no direction (a control
// phrase, or a word beginning "direct" or "correct"). Each record counts once.
const directionPrefixes = [
  ["scope expand:", "scopeExpand"],
  ["operator override:", "operatorOverride"],
  ["analysis:", "analysis"],
  ["conversation only:", "conversationOnly"],
];
const directionEvents = [
  "OperatorOverrideRecorded",
  "RecordCorrected",
  "CriterionWaived",
];
export function operatorDirections(decisions, events) {
  const byKind = Object.fromEntries(
    [
      ...directionPrefixes.map(([, kind]) => kind),
      "operatorLabel",
      ...directionEvents,
    ].map((kind) => [kind, 0]),
  );
  for (const { dispatch } of decisions) {
    const text = String(dispatch).trimStart();
    const prefix = directionPrefixes.find(([value]) => text.startsWith(value));
    if (prefix) byKind[prefix[1]]++;
    else if (
      /^operator\b/iu.test(text) &&
      (!/^operator(?:'s)? resume\b/iu.test(text) ||
        /scope expand|operator override|analysis:|conversation only|\b(?:direct|correct)/iu.test(
          text,
        ))
    )
      byKind.operatorLabel++;
  }
  for (const event of events)
    if (directionEvents.includes(event.type)) byKind[event.type]++;
  return {
    total: Object.values(byKind).reduce((sum, value) => sum + value, 0),
    byKind,
    source: "committed decision dispatches and control events",
  };
}

/** Intake captures each ledger planning pass cites: distinct intake paths in
 * its section, a count and never the text. A pass files several orders, so no
 * capture is attributed to one order's directions. */
export function planningCaptures(root) {
  const path = docRelative(root, "lineage", "idea-ledger.md");
  if (!existsSync(join(root, path))) return [];
  const ledger = readFileSync(join(root, path), "utf8");
  const visible = ledger.replace(
    /^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm,
    (match) => match.replace(/[^\n]/g, " "),
  );
  const headings = [...visible.matchAll(/^## (.+)$/gm)];
  const intake = new RegExp(
    String.raw`${rootPattern(root, "intake")}/[^\s\x60'")]+`,
    "gu",
  );
  return headings.flatMap((match, index) => {
    const heading = match[1],
      date = heading.match(/\b\d{4}-\d{2}-\d{2}\b/u)?.[0];
    if (!date || !/planning pass/iu.test(heading)) return [];
    const section = ledger.slice(
      match.index,
      headings[index + 1]?.index ?? ledger.length,
    );
    return [
      {
        pass: `planning-${createHash("sha256").update(heading).digest("hex").slice(0, 16)}`,
        date,
        captures: new Set(
          (section.match(intake) ?? []).map((value) =>
            value.replace(/[.,;:]+$/u, ""),
          ),
        ).size,
      },
    ];
  });
}

const unavailableCorrections = () => ({
  total: null,
  byPhase: null,
  byUnit: null,
  byPhaseAndUnit: null,
  source: "unavailable",
});

// WO-170: the order's own meter row, bounded, written where its journals are.
// A dispatch row keeps its observed values; an absent one reads unavailable.
export const SNAPSHOT_BYTES = 8192;
/** Indented to the row's fields; a dispatch row, a role's totals or a unit
 * map stays on one line, so the bound holds more than whitespace. */
export function snapshotText(value) {
  const format = (node, depth) => {
    if (depth >= 4 || node === null || typeof node !== "object")
      return JSON.stringify(node);
    const list = Array.isArray(node);
    const entries = list
      ? node.map((item) => format(item, depth + 1))
      : Object.entries(node).map(
          ([key, item]) => `${JSON.stringify(key)}: ${format(item, depth + 1)}`,
        );
    if (!entries.length) return list ? "[]" : "{}";
    const inner = "  ".repeat(depth + 1);
    return `${list ? "[" : "{"}\n${entries.map((entry) => inner + entry).join(",\n")}\n${"  ".repeat(depth)}${list ? "]" : "}"}`;
  };
  return `${format(value, 0)}\n`;
}
const observedDispatches = (rows) =>
  rows
    .map(({ delta, ...row }) =>
      Object.fromEntries(
        Object.entries(row).filter(([, value]) => value !== null),
      ),
    )
    .filter((row) => Object.keys(row).length > 1);
export function orderSnapshot(meta, workOrder, source) {
  const order = meta.orders.find((row) => row.workOrder === workOrder);
  if (!order) throw new Error(`${workOrder} is not a row of this meter`);
  return {
    schemaVersion: 1,
    kind: "order-meter-snapshot",
    observedAt: meta.observedAt,
    revision: meta.revision,
    source,
    orders: [
      {
        workOrder,
        phase: order.phase,
        metrics: order.metrics,
        corrections: order.corrections,
        directions: order.directions,
        usageByRole: Object.fromEntries(
          Object.entries(order.usageByRole).map(
            ([role, { source, ...totals }]) => [role, totals],
          ),
        ),
        dispatches: observedDispatches(order.dispatches),
        declared: order.declared,
      },
    ],
  };
}
/** Writes the order's snapshot only from a checkout holding its journals,
 * while the order is open: after the close the meter reads no journal of it. */
export function writeOrderSnapshot(root, meta, workOrder) {
  const path = docRelative(root, "evidence", `${workOrder}/meta.json`);
  const phase = meta.orders.find((row) => row.workOrder === workOrder)?.phase;
  if (!phase || ["closed", "withdrawn"].includes(phase))
    return {
      path,
      written: false,
      reason: phase
        ? `${workOrder} is ${phase}; its committed snapshot is its record`
        : `${workOrder} is not a row of this meter`,
    };
  const journals = new Set(
    hookObservations(root, workOrder).map((row) => row.journal),
  ).size;
  if (!journals)
    return {
      path,
      written: false,
      reason: `this checkout holds no session journal of ${workOrder}`,
    };
  const text = snapshotText(
    orderSnapshot(
      meta,
      workOrder,
      `the order's checkout: ${journals} session journal${journals === 1 ? "" : "s"}, its usage observations, gate rows and the canonical control fold`,
    ),
  );
  const size = Buffer.byteLength(text);
  if (size > SNAPSHOT_BYTES)
    return {
      path,
      written: false,
      reason: `the snapshot would be ${size} bytes, above its ${SNAPSHOT_BYTES}-byte bound`,
    };
  const current = existsSync(join(root, path))
    ? readFileSync(join(root, path), "utf8")
    : null;
  if (current !== text) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return { path, written: current !== text, bytes: size };
}
/** One-time recovery (WO-170): usage totals by role from the retained copies
 * in `retainedRoot` (the main checkout), with each copy's SHA-256 so that the
 * prune can release the lane. An existing snapshot keeps its own row. */
export function recoveredUsageSnapshot(
  retainedRoot,
  workOrder,
  prior,
  now,
  priorPath = "the whole-meter snapshot",
) {
  const copies = retainedUsageCopies(retainedRoot, workOrder);
  if (!copies.length) return null;
  const rows = retainedUsage(copies, workOrder);
  // The prune releases a lane whose every copy is named here (WO-171), so a
  // copy holding a row this snapshot does not carry (another order's, or one
  // it cannot read) is listed without its digest and keeps its lane.
  const carries = (copy) =>
    !copy.unreadable && copy.rows.every((row) => row.workOrder === workOrder);
  const count = (copy) => copy.rows.length + copy.unreadable;
  const usageCopies = copies.filter(carries).map((copy) => ({
    path: copy.path,
    sha256: createHash("sha256").update(copy.bytes).digest("hex"),
    rows: count(copy),
  }));
  const uncarried = copies
    .filter((copy) => !carries(copy))
    .map((copy) => ({
      path: copy.path,
      rows: count(copy),
      carriedRows: copy.rows.filter((row) => row.workOrder === workOrder)
        .length,
    }));
  const recovered = {
    observedAt: now,
    source: "retained usage copies in the main checkout's lane",
  };
  const kept = prior?.orders?.find((row) => row.workOrder === workOrder);
  const usageByRole = usageTotals(rows);
  if (kept)
    return {
      schemaVersion: 1,
      kind: "order-meter-snapshot",
      observedAt: prior.observedAt,
      revision: prior.revision ?? null,
      source: `the order's row of ${priorPath} observed at ${prior.observedAt}`,
      orders: [
        {
          workOrder,
          phase: kept.phase,
          metrics: kept.metrics,
          ...(kept.corrections ? { corrections: kept.corrections } : {}),
          usageByRole,
          dispatches: observedDispatches(kept.dispatches ?? []),
          declared: kept.declared ?? null,
        },
      ],
      usageRecovered: recovered,
      usageCopies,
      ...(uncarried.length ? { uncarriedCopies: uncarried } : {}),
    };
  return {
    schemaVersion: 1,
    kind: "order-meter-snapshot",
    observedAt: now,
    revision: null,
    source: recovered.source,
    orders: [{ workOrder, usageByRole }],
    usageCopies,
    ...(uncarried.length ? { uncarriedCopies: uncarried } : {}),
  };
}

function authorshipCost(observations) {
  const rows = observations
    .map((row) => row.authorship)
    .filter(
      (row) =>
        row &&
        ["durationMs", "files", "bytes", "commands"].every(
          (key) => Number.isFinite(row[key]) && row[key] >= 0,
        ),
    );
  return {
    authorshipSnapshots: rows.length || null,
    authorshipMs: sumKnown(rows.map((row) => row.durationMs)),
    authorshipBytes: sumKnown(rows.map((row) => row.bytes)),
    authorshipCommands: sumKnown(rows.map((row) => row.commands)),
    authorshipMeanMs: rows.length
      ? rows.reduce((total, row) => total + row.durationMs, 0) / rows.length
      : null,
    authorshipPeakBytes: rows.length
      ? Math.max(...rows.map((row) => row.bytes))
      : null,
  };
}

function hookCost(observations) {
  const durations = observations
    .map((row) => row.hookTiming?.durationMs)
    .filter((value) => Number.isFinite(value) && value >= 0);
  return {
    hookRuns: durations.length || null,
    hookMs: sumKnown(durations),
    hookMeanMs: durations.length
      ? sumKnown(durations) / durations.length
      : null,
    hookPeakMs: durations.length ? Math.max(...durations) : null,
  };
}

function guardRefusalCount(observations) {
  const invocations = new Set();
  let uncorrelated = 0;
  for (const row of observations) {
    if (!(row.refused || row.refusal || row.decision === "deny")) continue;
    const key = row.refusal?.invocationKey;
    if (typeof key === "string" && /^[a-f0-9]{64}$/.test(key))
      invocations.add(key);
    // Historical or identity-free outcomes cannot be paired by time or command
    // text without inventing a shared invocation. Preserve those observations.
    else uncorrelated++;
  }
  return invocations.size + uncorrelated;
}

export function trapRows(orders) {
  const definitions = [
    [
      "rule-beating",
      "Read-obligation bytes against diff bytes; Stop refusals and re-announcements",
      ["readAmplification", "stopRefusals", "reAnnouncements"],
    ],
    [
      "seeking-the-wrong-goal",
      "Machinery share of elapsed time; phase durations against code-change size",
      ["machineryShare", "elapsedPerCodeByte"],
    ],
    [
      "shifting-the-burden-to-the-intervenor",
      "Operator corrections and directions, manual closeout steps and emergency planning passes",
      [
        "operatorCorrections",
        "operatorDirections",
        "manualCloseoutSteps",
        "emergencyPasses",
      ],
    ],
    [
      "drift-to-low-performance",
      "Subject length, gate step count and cold-start byte series",
      ["coldStartBytes", "subjectCharacters", "gateStepCount"],
    ],
    [
      "policy-resistance",
      "Guard refusals, bypass tools and ad hoc scripts",
      ["guardRefusals", "bypassTools", "adHocScripts"],
    ],
  ];
  return definitions.map(([id, signal, metrics]) => {
    const metric = metrics[0];
    const series = orders.map((row, index) => ({
      workOrder: row.workOrder,
      value: row.metrics[metric] ?? null,
      delta: delta(row.metrics[metric], orders[index - 1]?.metrics[metric]),
    }));
    const indicators = metrics.map((metric) => ({
      metric,
      series: orders.map((row, index) => ({
        workOrder: row.workOrder,
        value: row.metrics[metric] ?? null,
        delta: delta(row.metrics[metric], orders[index - 1]?.metrics[metric]),
      })),
    }));
    const worsening = indicators
      .filter(
        (row) =>
          row.series.length >= 4 &&
          row.series
            .slice(-3)
            .every((value) => value.delta !== null && value.delta > 0),
      )
      .map((row) => row.metric);
    return {
      id,
      signal,
      ...(id === "shifting-the-burden-to-the-intervenor"
        ? {
            corrections: orders.map((row) => ({
              workOrder: row.workOrder,
              ...row.corrections,
            })),
            directions: orders.map((row) => ({
              workOrder: row.workOrder,
              ...row.directions,
            })),
          }
        : {}),
      metric,
      series,
      indicators,
      worsening,
      reopenCandidate: worsening.length > 0,
    };
  });
}

/** Reconcile an explicit cost promise against recorded outcomes. Ambiguous prose
 * and absent measurements stay unknown; this projection never grants or refuses. */
export function reconcileCost(workOrder, cost, gateRows, observedAt) {
  const rows = gateRows.filter(
    (row) =>
      row.workOrder === workOrder &&
      ["npm test", "npm run test:full"].includes(row.checkId) &&
      row.executed,
  );
  const bound =
    /(?:fresh (?:product )?gate|fresh wall-clock)[^.;]{0,70}?(?:under|below|less than|<)\s*(\d+(?:\.\d+)?)\s*(seconds?|secs?|s|minutes?|mins?|m)\b/i.exec(
      cost,
    );
  const ceilingMs = bound
    ? Number(bound[1]) * (/^m/.test(bound[2]) ? 60000 : 1000)
    : null;
  const fresh = rows.filter(
    (row) =>
      row.exitCode === 0 &&
      Number.isFinite(row.durationMs) &&
      row.durationMs >= 0 &&
      (!row.reusedSuites || row.executionMode === "fresh"),
  );
  const shortfall =
    ceilingMs !== null && fresh.some((row) => row.durationMs >= ceilingMs);
  return {
    workOrder,
    promisedRemoval: cost || "unknown",
    observedAt,
    observedRows: rows.map(
      ({
        checkId,
        recordedAt,
        durationMs,
        exitCode,
        evidenceRef,
        executionMode,
      }) => ({
        checkId,
        recordedAt,
        durationMs,
        exitCode,
        evidenceRef,
        executionMode,
      }),
    ),
    ceilingMs,
    outcome: shortfall
      ? "shortfall"
      : ceilingMs !== null && fresh.length
        ? "met"
        : "unknown",
    planningInput: shortfall
      ? "Measured fresh gate exceeds the promised limit; reconsider at planning."
      : null,
  };
}

export async function collectMeta(
  root,
  { now = new Date().toISOString(), previousEdition } = {},
) {
  const control = readControl(root),
    budgets = readBudgets(root),
    decisions = readDecisions(root);
  const closed = [...control.orders]
    .filter(([, row]) => row.state.phase === "closed")
    .sort(([, a], [, b]) =>
      (a.closeRecordedAt ?? "").localeCompare(b.closeRecordedAt ?? ""),
    );
  // A withdrawn order is settled (WO-158): it is neither recent close
  // evidence nor work in flight.
  const selected = [
    ...closed.slice(-5),
    ...[...control.orders].filter(
      ([, row]) => !["closed", "withdrawn"].includes(row.state.phase),
    ),
  ];
  const coldStart = measureColdStarts(root, previousEdition);
  const sequencePath = docRelative(root, "planning", "sequence.md");
  const sizePaths = [
    sequencePath,
    docRelative(root, "planning", "work-order-map.md"),
    docRelative(root, "workOrders", "README.md"),
    docRelative(root, "lineage", "idea-ledger.md"),
    "CLAUDE.md",
    ...coldStart.profiles.map((row) => row.path),
  ];
  const sizes = Object.fromEntries(
    sizePaths.map((path) => [path, bytes(root, path)]),
  );
  const manifest = json(root, ".claude/harness-manifest.json", {});
  let declared = {
    promptTokens: null,
    supports: null,
    units: null,
    hooks:
      manifest.installed?.filter((row) => /^\.claude\/hooks\//.test(row.path))
        .length ?? null,
  };
  try {
    const module = await import(
      pathToFileURL(
        join(root, "packages/skeleton/dist/src/loadouts/contributor.js"),
      ).href
    );
    const feedback = await import(
      pathToFileURL(
        join(root, "packages/skeleton/dist/src/loadouts/feedback.js"),
      ).href
    );
    const program = module.contributorConfiguredProgram().loadout;
    declared = {
      ...declared,
      promptTokens: program.supportCosts.reduce(
        (total, row) => total + row.promptTokens,
        0,
      ),
      supports: program.supportCosts.length,
      units: feedback.personalFeedback().units.length,
    };
  } catch {
    /* Missing compilation is explicit, never inferred from prose bytes. */
  }
  const checks = readGateChecks(root);
  const titles = mergedSubjects(root, 100);
  const orders = selected.map(([workOrder, row]) => {
    const events = eventsForOrder(control, workOrder);
    const phases = [...completedPhaseAttempts(events)].map((attempt) => ({
      phase: attempt.phase,
      role: roleForPhase[attempt.phase],
      elapsedMs: attempt.elapsedMs === "unknown" ? null : attempt.elapsedMs,
    }));
    const snapshotPath = ["meta.json", "meta-baseline.json"]
      .map((name) => docRelative(root, "evidence", `${workOrder}/${name}`))
      .find((path) => existsSync(join(root, path)));
    const snapshot = snapshotPath ? json(root, snapshotPath) : null;
    const found = snapshot?.orders?.find(
      (entry) => entry.workOrder === workOrder,
    );
    // A recovered snapshot holds usage totals by role and no metrics.
    const prior = found && { ...found, metrics: found.metrics ?? {} };
    const active = !["closed", "withdrawn"].includes(row.state.phase);
    const contextEdition = json(
      root,
      docRelative(root, "evidence", `${workOrder}/harness-context.json`),
    );
    const historicCold = contextEdition?.profiles?.map((profile) => ({
      role: profile.role,
      skillsRoot: profile.skillsRoot,
      bytes:
        profile.bytes ??
        sumKnown(
          (profile.after?.files ?? [])
            .filter(
              (file) =>
                file.path === "CLAUDE.md" || file.path.endsWith("/SKILL.md"),
            )
            .map((file) => file.bytes),
        ),
    }));
    // Journals leave with the order's worktree; its snapshot, written there by
    // release prepare, holds every session up to its cutoff. After the close a
    // checkout holds at most a later session's journal of the order (release
    // close on main), which is not the order's record, so journal values come
    // from the snapshot and every checkout reads the same: one written from
    // journals, or a closed order's row of an earlier whole-meter snapshot.
    // Corrections count only from journals, never the old decision count; with
    // no snapshot row, a journal-derived value is unavailable, never zero.
    const closedOrder = row.state.phase === "closed";
    const journalSnapshot = prior?.corrections?.source === "session-journal";
    const hook = closedOrder ? [] : hookObservations(root, workOrder);
    const held =
      !hook.length &&
      (journalSnapshot ||
        (closedOrder && Object.keys(prior?.metrics ?? {}).length))
        ? prior
        : null;
    const heldSource = `order snapshot ${snapshotPath} (cutoff ${snapshot?.observedAt ?? "unknown"})`;
    const corrections = hook.length
      ? correctionCounts(hook)
      : held && journalSnapshot
        ? prior.corrections
        : unavailableCorrections();
    const directions = operatorDirections(
      decisions.filter((decision) => decision.workOrder === workOrder),
      events,
    );
    // Usage by role: this checkout's observations, then the order's snapshot,
    // then a retained usage copy; a role none of them holds stays unobserved.
    const liveUsage = usageRows(root, workOrder);
    const copies = retainedUsageCopies(root, workOrder);
    const retainedRows = retainedUsage(copies, workOrder);
    const unreadable = copies.reduce((sum, copy) => sum + copy.unreadable, 0);
    const heldUsage = prior?.usageByRole ?? {};
    const usage = [...liveUsage],
      usageByRole = {};
    for (const role of orderedRoles([
      ...liveUsage.map((value) => value.role),
      ...Object.keys(heldUsage),
      ...retainedRows.map((value) => value.role),
    ])) {
      if (liveUsage.some((value) => value.role === role))
        usageByRole[role] = {
          source: "this checkout's usage observations",
          ...usageTotals(liveUsage)[role],
        };
      else if (heldUsage[role])
        usageByRole[role] = { source: heldSource, ...heldUsage[role] };
      else {
        const rows = retainedRows.filter((value) => value.role === role);
        usage.push(...rows.map((value) => ({ ...value, retained: true })));
        usageByRole[role] = {
          source: `retained usage copy ${copies.map((copy) => copy.lanePath).join(", ")}${unreadable ? ` (${unreadable} unreadable line${unreadable === 1 ? "" : "s"} skipped)` : ""}`,
          ...usageTotals(rows)[role],
        };
      }
    }
    const heldRoles = Object.entries(usageByRole)
      .filter(
        ([role, value]) =>
          value.source === heldSource && heldUsage[role].dispatches !== 0,
      )
      .map(([, value]) => value);
    const gateRows = checks.filter(
      (check) =>
        check.workOrder === workOrder &&
        ["npm test", "npm run test:full"].includes(check.checkId),
    );
    const successfulGate = gateRows.findLast(
      (row) => row.executed === true && row.exitCode === 0,
    );
    // Count observed tasks in the latest successful gate, not gate invocations
    // or top-level suites: release cases can be separate tasks. Historical
    // reuse counts remain part of their aggregate's coverage; new gates are fresh.
    const legacyGateSteps = successfulGate
      ? checks.filter(
          (row) =>
            row.workOrder === workOrder &&
            row.recordedAt === successfulGate.recordedAt &&
            row.checkId.startsWith("suite:"),
        ).length
      : 0;
    const gateSteps =
      Number.isSafeInteger(successfulGate?.freshSuites) &&
      successfulGate.freshSuites >= 0
        ? successfulGate.freshSuites +
          (Number.isSafeInteger(successfulGate.reusedSuites) &&
          successfulGate.reusedSuites >= 0
            ? successfulGate.reusedSuites
            : 0)
        : Array.isArray(successfulGate?.taskTimeline)
          ? successfulGate.taskTimeline.filter((row) => row.executed === true)
              .length
          : legacyGateSteps || null;
    const evidence = events
      .map((event) => event.evidence)
      .filter(Boolean)
      .at(-1);
    const readCount =
      evidence?.readCount ??
      hook.filter((value) => Number.isFinite(value.outputCount)).at(-1)
        ?.outputCount ??
      prior?.metrics.readObligationCount ??
      null;
    const readBytes =
      evidence?.readBytes ??
      hook.filter((value) => Number.isFinite(value.outputBytes)).at(-1)
        ?.outputBytes ??
      prior?.metrics.readObligationBytes ??
      null;
    const diffBytes = active
      ? codeDiffBytes(root)
      : (prior?.metrics.codeDiffBytes ?? null);
    const durationMs = sumKnown(phases.map((value) => value.elapsedMs));
    const machineMs = sumKnown(
      phases
        .filter((value) =>
          ["verification", "finalReview"].includes(value.phase),
        )
        .map((value) => value.elapsedMs),
    );
    const observedUsage = usage.filter(
      (value) => value.observation.scope === "dispatch",
    );
    // Once usage is chosen per role, one unknown dispatch keeps the sum
    // unknown; an order total is read only from a snapshot without roles.
    const perRole = Object.keys(usageByRole).length > 0;
    const usageSum = (rowValue, heldKey, fallback) =>
      perRole
        ? sumKnown([
            ...observedUsage.map(rowValue),
            ...heldRoles.map((value) => value[heldKey]),
          ])
        : (fallback ?? null);
    // With the journals held by the snapshot, their values are the snapshot's.
    const heldMetrics = (computed) =>
      held
        ? Object.fromEntries(
            Object.keys(computed).map((key) => [
              key,
              prior.metrics[key] ?? null,
            ]),
          )
        : computed;
    const metrics = {
      elapsedMs: durationMs,
      attempts: phases.length,
      gateMs:
        sumKnown(gateRows.map((value) => value.durationMs)) ??
        prior?.metrics.gateMs ??
        null,
      fastGateMs:
        gateRows
          .filter(
            (value) => value.checkId === "npm test" && value.exitCode === 0,
          )
          .at(-1)?.durationMs ??
        prior?.metrics.fastGateMs ??
        null,
      readObligationCount: readCount,
      readObligationBytes: readBytes,
      codeDiffBytes: diffBytes,
      readAmplification:
        readBytes !== null && diffBytes > 0 ? readBytes / diffBytes : null,
      machineryShare:
        durationMs > 0 && machineMs !== null ? machineMs / durationMs : null,
      elapsedPerCodeByte:
        durationMs !== null && diffBytes > 0 ? durationMs / diffBytes : null,
      tokens: usageSum(
        (value) => value.observation.usage.totalTokens,
        "totalTokens",
        prior?.metrics.tokens,
      ),
      costUsd: usageSum(
        (value) => value.observation.usage.costUsd,
        "costUsd",
        prior?.metrics.costUsd,
      ),
      declaredPromptTokens: active
        ? declared.promptTokens
        : (prior?.metrics.declaredPromptTokens ?? null),
      coldStartBytes: active
        ? Math.max(...coldStart.profiles.map((value) => value.bytes ?? 0))
        : (prior?.metrics.coldStartBytes ??
          (historicCold?.some((value) => Number.isFinite(value.bytes))
            ? Math.max(...historicCold.map((value) => value.bytes ?? 0))
            : null)),
      subjectCharacters:
        titles.findLast((value) => value.workOrder === workOrder)?.characters ??
        prior?.metrics.subjectCharacters ??
        null,
      gateStepCount: gateSteps ?? prior?.metrics.gateStepCount ?? null,
      operatorCorrections: corrections.total,
      operatorDirections: directions.total,
      guardRefusals: hook.length
        ? guardRefusalCount(hook)
        : (prior?.metrics.guardRefusals ?? null),
      stopRefusals: hook.length
        ? hook.filter(
            (value) =>
              value.event === "Stop" &&
              (value.refused || value.finished === false),
          ).length
        : (prior?.metrics.stopRefusals ?? null),
      reAnnouncements: prior?.metrics.reAnnouncements ?? null,
      manualCloseoutSteps: prior?.metrics.manualCloseoutSteps ?? null,
      emergencyPasses: prior?.metrics.emergencyPasses ?? null,
      bypassTools: prior?.metrics.bypassTools ?? null,
      adHocScripts: prior?.metrics.adHocScripts ?? null,
      commandsRun: hook.some((value) => value.toolStep)
        ? hook.filter((value) => value.commandRun).length
        : held || closedOrder
          ? (held?.metrics.commandsRun ?? null)
          : usageSum(
              (value) => value.observation.activity?.commandsRun,
              "commandsRun",
              prior?.metrics.commandsRun,
            ),
      bytesReadIntoContext: hook.length
        ? sumKnown(
            hook
              .flatMap((value) => value.byteReads ?? [])
              .map((value) => value.endByte - value.startByte),
          )
        : (prior?.metrics.bytesReadIntoContext ?? null),
      stepCount: hook.some((value) => value.toolStep)
        ? hook.filter((value) => value.toolStep).length
        : held || closedOrder
          ? (held?.metrics.stepCount ?? null)
          : usageSum(
              (value) => value.observation.activity?.stepCount,
              "stepCount",
              prior?.metrics.stepCount,
            ),
      ...heldMetrics(authorshipCost(hook)),
      ...heldMetrics(hookCost(hook)),
      prBodyBytes:
        bytes(root, docRelative(root, "finalReviews", `${workOrder}/PR.md`)) ??
        prior?.metrics.prBodyBytes ??
        null,
    };
    const dispatches = dispatchKinds.map((role) => {
      const rolePhases = phases.filter((value) => value.role === role),
        roleUsage = usage.filter((value) => value.role === role),
        roleHooks = hook.filter((value) => value.role === role),
        heldRole = held?.dispatches?.find((value) => value.role === role),
        roleTotals =
          usageByRole[role]?.source === heldSource &&
          heldUsage[role].dispatches !== 0
            ? usageByRole[role]
            : null;
      const journal = (computed) =>
        held || closedOrder
          ? Object.fromEntries(
              Object.keys(computed).map((key) => [
                key,
                heldRole?.[key] ?? null,
              ]),
            )
          : computed;
      return {
        role,
        wallClockMs:
          sumKnown(rolePhases.map((value) => value.elapsedMs)) ??
          sumKnown(roleUsage.map((value) => value.durationMs)) ??
          roleTotals?.durationMs ??
          null,
        attempts: rolePhases.length || null,
        ...journal({
          bytesReadIntoContext: sumKnown(
            roleHooks
              .flatMap((value) => value.byteReads ?? [])
              .map((value) => value.endByte - value.startByte),
          ),
          commandsRun: roleHooks.some((value) => value.toolStep)
            ? roleHooks.filter((value) => value.commandRun).length
            : (sumKnown(
                roleUsage.map(
                  (value) => value.observation.activity?.commandsRun,
                ),
              ) ??
              roleTotals?.commandsRun ??
              null),
          stepCount: roleHooks.some((value) => value.toolStep)
            ? roleHooks.filter((value) => value.toolStep).length
            : (sumKnown(
                roleUsage.map((value) => value.observation.activity?.stepCount),
              ) ??
              roleTotals?.stepCount ??
              null),
          ...authorshipCost(roleHooks),
          ...hookCost(roleHooks),
        }),
        observedTokens:
          sumKnown(
            roleUsage
              .filter((value) => value.observation.scope === "dispatch")
              .map((value) => value.observation.usage.totalTokens),
          ) ??
          roleTotals?.totalTokens ??
          null,
        observedCostUsd:
          sumKnown(
            roleUsage
              .filter((value) => value.observation.scope === "dispatch")
              .map((value) => value.observation.usage.costUsd),
          ) ??
          roleTotals?.costUsd ??
          null,
        declaredPromptTokens:
          active && role === "executor"
            ? declared.promptTokens
            : (prior?.dispatches?.find((value) => value.role === role)
                ?.declaredPromptTokens ?? null),
      };
    });
    return {
      workOrder,
      phase: row.state.phase,
      phases,
      metrics,
      corrections,
      directions,
      dispatches,
      usage,
      usageByRole,
      coldStart: active
        ? coldStart.profiles.map(({ role, skillsRoot, bytes }) => ({
            role,
            skillsRoot,
            bytes,
          }))
        : (historicCold ?? prior?.coldStart ?? null),
      sizes: active ? sizes : (prior?.sizes ?? null),
      declared: active ? declared : (prior?.declared ?? null),
      source: {
        phases: "canonical control fold",
        journals: hook.length
          ? "this checkout's session journals"
          : held
            ? journalSnapshot
              ? heldSource
              : `earlier whole-meter row ${snapshotPath} (cutoff ${snapshot?.observedAt ?? "unknown"}); its corrections are not journal counts`
            : "unavailable",
        usage: Object.keys(usageByRole).length
          ? Object.entries(usageByRole)
              .map(([role, value]) => `${role}: ${value.source}`)
              .join("; ")
          : "unavailable",
        directions: directions.source,
        unobserved: "null means unavailable, never zero",
      },
    };
  });
  for (let index = 0; index < orders.length; index++)
    orders[index].delta = Object.fromEntries(
      Object.entries(orders[index].metrics).map(([key, value]) => [
        key,
        delta(value, orders[index - 1]?.metrics[key]),
      ]),
    );
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index],
      before = orders[index - 1];
    order.sizeDeltas = Object.fromEntries(
      Object.entries(order.sizes ?? {}).map(([path, value]) => [
        path,
        delta(value, before?.sizes?.[path]),
      ]),
    );
    for (const dispatch of order.dispatches)
      dispatch.delta = Object.fromEntries(
        Object.entries(dispatch)
          .filter(([key]) => key !== "role")
          .map(([key, value]) => [
            key,
            delta(
              value,
              before?.dispatches.find((row) => row.role === dispatch.role)?.[
                key
              ],
            ),
          ]),
      );
  }
  const budgetRows = coldStart.profiles.map((row) => ({
    metric: row.metric,
    value: row.bytes,
    ceiling: row.ceiling,
    verdict: row.verdict,
  }));
  for (const [metric, value, ceiling] of [
    ["sequenceBytes", sizes[sequencePath], budgets?.limits.sequenceBytes],
  ])
    budgetRows.push({
      metric,
      value,
      ceiling,
      verdict: budgetVerdict(budgets, metric, value, ceiling),
    });
  for (const order of orders.filter(
    (row) => !["closed", "withdrawn"].includes(row.phase),
  )) {
    for (const metric of ["fastGateMs", "prBodyBytes"])
      budgetRows.push({
        metric,
        scope: order.workOrder,
        value: order.metrics[metric],
        ceiling: budgets?.limits[metric],
        verdict: budgetVerdict(
          budgets,
          metric,
          order.metrics[metric],
          budgets?.limits[metric],
          order.workOrder,
        ),
      });
    for (const role of dispatchKinds)
      for (const [metric, field] of [
        ["tokens", "totalTokens"],
        ["costUsd", "costUsd"],
      ]) {
        const rows = order.usage.filter(
          (row) => row.role === role && row.observation.scope === "dispatch",
        );
        const ceiling = budgets?.dispatches[role]?.[metric];
        for (const row of rows.length ? rows : [null]) {
          const value = row?.observation.usage[field] ?? null;
          budgetRows.push({
            metric: `${role}.${metric}`,
            scope: order.workOrder,
            dispatchStartedAt: row?.startedAt ?? null,
            value,
            ceiling,
            verdict: budgetVerdict(
              budgets,
              `${role}.${metric}`,
              value,
              ceiling,
              order.workOrder,
            ),
          });
        }
      }
  }
  const traps = trapRows(orders);
  const captures = planningCaptures(root);
  traps.find(
    (row) => row.id === "shifting-the-burden-to-the-intervenor",
  ).planningCaptures = captures;
  traps.find((row) => row.id === "drift-to-low-performance").coldStart = {
    comparisonEdition: coldStart.comparisonEdition,
    profiles: coldStart.profiles,
  };
  const reopenCandidates = decisions
    .filter((decision) => {
      const condition = decision.reopenWhen;
      if (typeof condition !== "object") return false;
      const values = orders
        .slice(-(condition.consecutive ?? 1))
        .map((row) => row.metrics[condition.metric]);
      return (
        values.length === (condition.consecutive ?? 1) &&
        values.every(
          (value) =>
            Number.isFinite(value) &&
            (condition.operator === ">"
              ? value > condition.value
              : condition.operator === ">="
                ? value >= condition.value
                : condition.operator === "<"
                  ? value < condition.value
                  : false),
        )
      );
    })
    .map((row) => ({
      decision: row.id,
      condition: row.reopenWhen,
      path: row.path,
    }));
  for (const trap of traps.filter((row) => row.reopenCandidate))
    reopenCandidates.push({
      trap: trap.id,
      condition: "worsened over three consecutive order deltas",
    });
  return {
    schemaVersion: 1,
    observedAt: now,
    revision: git(root, ["rev-parse", "HEAD"]),
    orders,
    costReconciliation: closed.map(([workOrder, row]) => {
      const path = row.state.workOrderPath;
      const authority =
        path && existsSync(join(root, path))
          ? readFileSync(join(root, path), "utf8")
          : "";
      const cost =
        /^\*\*Cost:\*\*[^\S\r\n]*([\s\S]*?)(?=\n\s*\n|\n\*\*|(?![\s\S]))/m
          .exec(authority)?.[1]
          ?.replace(/\s+/g, " ")
          .trim() ?? "";
      const current = reconcileCost(workOrder, cost, checks, now);
      const snapshot =
        json(root, docRelative(root, "evidence", `${workOrder}/meta.json`)) ??
        json(
          root,
          docRelative(root, "evidence", `${workOrder}/meta-baseline.json`),
        );
      const prior = snapshot?.orders?.find(
        (entry) => entry.workOrder === workOrder,
      );
      // A recovered snapshot carries usage totals only: no historical metrics.
      return {
        ...current,
        historicalMetrics: Object.keys(prior?.metrics ?? {}).length
          ? {
              source: docRelative(
                root,
                "evidence",
                `${workOrder}/meta${existsSync(docPath(root, "evidence", `${workOrder}/meta.json`)) ? "" : "-baseline"}.json`,
              ),
              cutoff: snapshot.observedAt,
              metrics: prior.metrics,
            }
          : null,
      };
    }),
    // Computed from committed files, so every checkout reads every closed order.
    closedDirections: closed.map(([workOrder]) => ({
      workOrder,
      ...operatorDirections(
        decisions.filter((decision) => decision.workOrder === workOrder),
        eventsForOrder(control, workOrder),
      ),
    })),
    unassignedDispatches: usageRows(root, null),
    coldStart,
    declared,
    sizes,
    subjects: mergedSubjects(root),
    budgets: budgetRows,
    traps,
    reopenCandidates,
  };
}

const display = (value) =>
  value === null || value === undefined
    ? "unavailable"
    : typeof value === "number"
      ? Number(value.toFixed(3)).toLocaleString("en-US")
      : String(value);
export function renderMetaTable(meta) {
  const d = (row, key) =>
    `${display(row.metrics[key])} (Δ ${display(row.delta[key])})`;
  return [
    "",
    `Observation cutoff: ${meta.observedAt ?? "unknown"}; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.`,
    "",
    "| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...meta.orders.map(
      (row) =>
        `| ${row.workOrder} | ${d(row, "elapsedMs")} / ${row.metrics.attempts} | ${d(row, "gateMs")} | ${d(row, "readObligationCount")} / ${d(row, "readObligationBytes")} | ${d(row, "tokens")} / ${d(row, "costUsd")} | ${d(row, "declaredPromptTokens")} | ${d(row, "operatorCorrections")} | ${d(row, "operatorDirections")} |`,
    ),
    "",
    "Unavailable observations are not zero; unset ceilings are not approvals of a future limit.",
    "",
    "| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...meta.orders
      .filter((row) => !["closed", "withdrawn"].includes(row.phase))
      .flatMap((order) =>
        order.dispatches.map(
          (row) =>
            `| ${order.workOrder}/${row.role} | ${display(row.wallClockMs)} (${display(row.delta.wallClockMs)}) | ${display(row.bytesReadIntoContext)} (${display(row.delta.bytesReadIntoContext)}) | ${display(row.commandsRun)} (${display(row.delta.commandsRun)}) | ${display(row.observedTokens)} (${display(row.delta.observedTokens)}) | ${display(row.stepCount)} (${display(row.delta.stepCount)}) | ${display(row.observedCostUsd)} (${display(row.delta.observedCostUsd)}) / ${display(row.declaredPromptTokens)} |`,
        ),
      ),
  ].join("\n");
}
export function renderMeta(meta) {
  const metricRows = meta.orders.flatMap((order) => [
    `${order.workOrder} metrics (value; previous-order delta):`,
    ...Object.entries(order.metrics).map(
      ([key, value]) =>
        `  ${key}: ${display(value)}; Δ ${display(order.delta[key])}`,
    ),
    ...order.phases.map(
      (row) => `  phase ${row.phase}: ${display(row.elapsedMs)} ms`,
    ),
    ...order.dispatches.map(
      (row) =>
        `  ${row.role}: ${Object.entries(row)
          .filter(([key]) => !["role", "delta"].includes(key))
          .map(
            ([key, value]) =>
              `${key} ${display(value)} (Δ ${display(row.delta[key])})`,
          )
          .join("; ")}`,
    ),
    ...Object.entries(order.sizes ?? {}).map(
      ([path, value]) =>
        `  ${path}: ${display(value)} bytes; Δ ${display(order.sizeDeltas[path])}`,
    ),
  ]);
  return [
    renderMetaTable(meta),
    "",
    ...metricRows,
    "",
    "Per-dispatch usage sources:",
    ...meta.orders.flatMap((order) =>
      order.usage.map(
        (row) =>
          `${order.workOrder}/${row.role}: ${display(row.observation.usage.totalTokens)} tokens; USD ${display(row.observation.usage.costUsd)}; ${row.observation.source}, ${row.observation.scope}${row.retained ? "; retained usage copy" : ""}`,
      ),
    ),
    "",
    "Usage by role (dispatch totals and their source):",
    ...meta.orders.flatMap((order) =>
      Object.entries(order.usageByRole ?? {}).map(
        ([role, row]) =>
          `${order.workOrder}/${role}: ${display(row.totalTokens)} tokens over ${display(row.dispatches)} dispatches; USD ${display(row.costUsd)}; ${row.source}`,
      ),
    ),
    ...(meta.unassignedDispatches ?? []).map(
      (row) =>
        `Unassigned planning ${row.dispatch}/${row.role}: ${display(row.observation.usage.totalTokens)} tokens; USD ${display(row.observation.usage.costUsd)}; ${row.observation.source}`,
    ),
    "",
    `Drift-to-low-performance — installed cold start (previous edition ${meta.coldStart.comparisonEdition ?? "unknown"}):`,
    ...meta.coldStart.profiles.map(
      (row) =>
        `${row.skillsRoot}/${row.role}: ${display(row.bytes)} bytes; ceiling ${row.ceiling == null ? "unset" : display(row.ceiling)}; previous ${display(row.previousBytes)}; Δ edition ${display(row.delta)}; last acceptance ${row.lastAcceptance?.date ?? "unknown"}: ${display(row.lastAcceptance?.bytes)} bytes, Δ ${display(row.lastAcceptance?.delta)}${row.lastAcceptance?.cause ? ` (${row.lastAcceptance.cause})` : ""}; ${row.verdict}`,
    ),
    "",
    `Declared supports=${display(meta.declared.supports)}, units=${display(meta.declared.units)}, hooks=${display(meta.declared.hooks)}`,
    "",
    "Merged title series (characters; no numeric limit):",
    ...meta.subjects.map((row) => `${row.characters}: ${row.title}`),
    "",
    "Closed-order cost reconciliation (planning input only):",
    ...(meta.costReconciliation ?? []).map(
      (row) =>
        `${row.workOrder}: promised removal: ${row.promisedRemoval}; observed: ${row.observedRows.length ? row.observedRows.map((gate) => `${gate.checkId} ${display(gate.durationMs)} ms at ${gate.recordedAt} (${gate.evidenceRef})`).join("; ") : row.historicalMetrics ? `historical metrics ${JSON.stringify(row.historicalMetrics.metrics)}; source ${row.historicalMetrics.source}; cutoff ${row.historicalMetrics.cutoff}` : "unknown"}; outcome ${row.outcome}${row.planningInput ? `; PLANNING INPUT: ${row.planningInput}` : ""}`,
    ),
    "",
    "Budget observations:",
    ...meta.budgets.map(
      (row) =>
        `${row.scope ?? "current"}/${row.metric}: ${display(row.value)}; ceiling ${row.ceiling == null ? "unset" : row.ceiling}; ${row.verdict}`,
    ),
    "",
    "Systems-trap signals:",
    ...meta.orders.map(
      (row) =>
        `${row.workOrder} journal corrections: ${display(row.corrections.total)}; per phase ${JSON.stringify(row.corrections.byPhase)}; per unit ${JSON.stringify(row.corrections.byUnit)}; per phase/unit ${JSON.stringify(row.corrections.byPhaseAndUnit)}; ${row.source?.journals ?? row.corrections.source}.`,
    ),
    ...meta.orders
      .filter((row) => row.directions)
      .map(
        (row) =>
          `${row.workOrder} operator directions: ${row.directions.total}; ${
            Object.entries(row.directions.byKind)
              .filter(([, value]) => value)
              .map(([key, value]) => `${key} ${value}`)
              .join(", ") || "none recorded"
          }; ${row.directions.source}.`,
      ),
    ...(meta.closedDirections?.length
      ? [
          `Operator directions per closed order (committed decisions and control events): ${meta.closedDirections
            .map((row) => `${row.workOrder} ${row.total}`)
            .join(", ")}.`,
        ]
      : []),
    ...(meta.traps.find(
      (row) => row.id === "shifting-the-burden-to-the-intervenor",
    )?.planningCaptures?.length
      ? [
          `Intake captures cited per planning pass (count only): ${meta.traps
            .find((row) => row.id === "shifting-the-burden-to-the-intervenor")
            .planningCaptures.map((row) => `${row.date} ${row.captures}`)
            .join("; ")}.`,
        ]
      : []),
    ...meta.traps.map(
      (row) =>
        `${row.id}: ${row.indicators.map((indicator) => `${indicator.metric} ${display(indicator.series.at(-1)?.value)} (Δ ${display(indicator.series.at(-1)?.delta)})`).join("; ")}; ${row.reopenCandidate ? "REOPEN CANDIDATE" : "insufficient worsening evidence"}`,
    ),
    ...meta.reopenCandidates.map(
      (row) =>
        `REOPEN ${row.decision ?? row.trap}: ${JSON.stringify(row.condition)}`,
    ),
  ].join("\n");
}

export function metaHealth(meta) {
  const breached = meta.budgets.filter(
    (row) => row.verdict === "breach",
  ).length;
  const latest = meta.orders.at(-1);
  return `Process health: ${breached ? `${breached} budget breaches` : "no observed budget breach"}; ${latest?.workOrder ?? "no work"} tokens ${display(latest?.metrics.tokens)}; ${meta.reopenCandidates.length} reopen candidates; unset limits remain unset.`;
}
export function checkMeta(meta) {
  for (const row of meta.budgets.filter((row) => row.verdict === "breach"))
    console.warn(
      `Advisory: process budget ${row.metric}=${row.value ?? row.bytes} exceeds ${row.ceiling}; planning input.`,
    );
}
