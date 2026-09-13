/** Compute the observed scheduling critical path from one retained gate row.
 * Edges include dependency barriers, exclusive joins and the previous occupant
 * of the chosen slot. Gaps remain visible; this is not an ideal-packing claim. */
export function gateCriticalPath(check) {
  const timeline = check.taskTimeline ?? check;
  const tasks = timeline.filter((row) => row.startedAt && row.finishedAt);
  if (!tasks.length) return { tasks: [], durationMs: 0, workMs: 0, waitMs: 0 };
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
    const prefix = prior ? pathTo(prior) : { tasks: [], workMs: 0, waitMs: 0 };
    const result = {
      tasks: [...prefix.tasks, task.name],
      workMs: prefix.workMs + end - start,
      waitMs:
        prefix.waitMs + start - (prior ? Date.parse(prior.finishedAt) : origin),
      durationMs: end - origin,
    };
    visiting.delete(task.name);
    memo.set(task.name, result);
    return result;
  };
  const paths = tasks.map(pathTo);
  return paths.sort((a, b) => b.durationMs - a.durationMs)[0];
}
