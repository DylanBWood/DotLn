/** Compute the observed scheduling critical path from one retained gate row.
 * Edges include dependency barriers, exclusive joins and the previous occupant
 * of the chosen slot. Gaps remain visible; this is not an ideal-packing claim. */
export function gateCriticalPath(check) {
  const timeline = check.taskTimeline ?? check;
  const tasks = timeline.filter((row) => row.startedAt && row.finishedAt);
  if (!tasks.length)
    return {
      tasks: [],
      durationMs: 0,
      workMs: 0,
      waitMs: 0,
      laneWaitMs: 0,
      gapMs: 0,
    };
  const byName = new Map(tasks.map((row) => [row.name, row]));
  if (byName.size !== tasks.length) throw new Error("Duplicate timeline task");
  const origin = Math.min(...tasks.map((row) => Date.parse(row.startedAt)));
  const memo = new Map();
  const visiting = new Set();
  const pathTo = (task) => {
    if (memo.has(task.name)) return memo.get(task.name);
    if (visiting.has(task.name)) throw new Error("Cyclic timeline");
    visiting.add(task.name);
    const start = Date.parse(task.startedAt),
      end = Date.parse(task.finishedAt);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start)
      throw new Error("Invalid task interval");
    const predecessors = (task.predecessors ?? []).map((name) => {
      const row = byName.get(name);
      if (!row) throw new Error(`Missing timeline predecessor: ${name}`);
      if (Date.parse(row.finishedAt) > start)
        throw new Error("Timeline predecessor overlaps its dependent");
      return row;
    });
    const prior = predecessors.sort(
      (a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt),
    )[0];
    const prefix = prior
      ? pathTo(prior)
      : { tasks: [], workMs: 0, waitMs: 0, laneWaitMs: 0, gapMs: 0 };
    const span = end - start;
    const work = task.durationMs === undefined ? span : task.durationMs;
    if (!Number.isFinite(work) || work < 0 || work > span + 1)
      throw new Error("Invalid task work duration");
    const measuredWork = Math.min(work, span);
    const laneWait = Math.min(
      span - measuredWork,
      Math.max(0, task.hostLaneWaitMs ?? 0),
    );
    if (!Number.isFinite(laneWait)) throw new Error("Invalid task lane wait");
    const result = {
      laneWaitMs: prefix.laneWaitMs + laneWait,
      gapMs:
        prefix.gapMs +
        span -
        measuredWork -
        laneWait +
        start -
        (prior ? Date.parse(prior.finishedAt) : origin),
      tasks: [...prefix.tasks, task.name],
      workMs: prefix.workMs + measuredWork,
      waitMs:
        prefix.waitMs +
        span -
        measuredWork +
        start -
        (prior ? Date.parse(prior.finishedAt) : origin),
      durationMs: end - origin,
    };
    visiting.delete(task.name);
    memo.set(task.name, result);
    return result;
  };
  const paths = tasks.map(pathTo);
  return paths.sort((a, b) => b.durationMs - a.durationMs)[0];
}

const relations = ["this-checkout", "another-checkout", "unknown"];
const relationOf = (value) => (relations.includes(value) ? value : "unknown");

function intervalUnion(intervals) {
  let total = 0,
    end = -Infinity;
  for (const [start, finish] of intervals.sort((a, b) => a[0] - b[0])) {
    total += Math.max(0, finish - Math.max(start, end));
    end = Math.max(end, finish);
  }
  return total;
}

/** Wait intervals are wall time, not summed task time. Relation unions may
 * overlap: simultaneous blockers do not establish exclusive causal shares.
 * Compact relation changes retain attribution independently of the diagnostic
 * cap. Legacy rows can establish only their retained observations. No holder
 * identity or registry path leaves this view. */
export function gateHostLaneWait(tasks) {
  const intervals = [],
    byRelation = Object.fromEntries(relations.map((key) => [key, []]));
  const holders = new Map();
  for (const task of tasks) {
    if (task.reused) continue;
    const start = Date.parse(task.startedAt),
      ms = task.hostLaneWaitMs;
    if (!Number.isFinite(start) || !Number.isFinite(ms) || ms <= 0) continue;
    const end = start + ms;
    intervals.push([start, end]);
    const observations = (task.hostLaneWaitObservations ?? [])
      .map((row) => ({ ...row, time: Date.parse(row.observedAt) }))
      .filter(
        (row) =>
          Number.isFinite(row.time) && row.time >= start && row.time <= end,
      )
      .sort((a, b) => a.time - b.time);
    for (const observation of observations) {
      for (const row of observation.holders) {
        const holder = {
          task: row.task,
          slots: row.slots,
          relation: relationOf(row.relation),
          nested: Boolean(row.nested),
        };
        holders.set(JSON.stringify(holder), holder);
      }
    }
    const segments = (
      task.hostLaneWaitRelations ??
      observations.map((row) => ({
        observedAt: row.observedAt,
        relations:
          row.phase === "lock" || !row.holders.length
            ? ["unknown"]
            : row.holders.map((holder) => holder.relation),
      }))
    )
      .map((row) => ({
        time: Date.parse(row.observedAt),
        relations: [...new Set(row.relations.map(relationOf))],
      }))
      .filter((row) => Number.isFinite(row.time) && row.time <= end)
      .sort((a, b) => a.time - b.time);
    let cursor = start,
      current = ["unknown"];
    for (const segment of segments) {
      const time = Math.max(start, segment.time);
      for (const relation of current) byRelation[relation].push([cursor, time]);
      current = segment.relations.length ? segment.relations : ["unknown"];
      cursor = time;
    }
    for (const relation of current) byRelation[relation].push([cursor, end]);
  }
  return {
    wallMs: intervalUnion(intervals),
    byRelation: Object.fromEntries(
      relations.map((key) => [key, intervalUnion(byRelation[key])]),
    ),
    holders: [...holders.values()],
  };
}

export function formatHostLaneWait(wait) {
  const seconds = (ms) => (ms / 1000).toFixed(1);
  if (Number(seconds(wait.wallMs)) === 0) return "";
  const labels = {
    "this-checkout": "this checkout",
    "another-checkout": "another checkout",
    unknown: "checkout unknown",
  };
  const parts = relations
    .filter((relation) => Number(seconds(wait.byRelation[relation])) > 0)
    .map(
      (relation) =>
        `${seconds(wait.byRelation[relation])} s behind ${labels[relation]}`,
    );
  return `; ${seconds(wait.wallMs)} s waiting for host lanes${parts.length ? ` (${parts.join("; ")})` : ""}`;
}
