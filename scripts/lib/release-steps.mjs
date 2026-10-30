const names = [
  "prerequisites",
  "runtime",
  "worktree-removal",
  "publication",
  "starter-refresh",
  "prune",
  "record",
];
const stacks = new WeakMap();

export const releaseSteps = () =>
  names.map((name) => ({
    name,
    startedAt: null,
    finishedAt: null,
    durationMs: 0,
  }));

/** Durations count active time, excluding nested steps. Repeated visits share
 * one row; its timestamps span the first start through the last finish. */
export async function withReleaseStep(record, name, operation) {
  if (!record?.steps) return operation();
  const row = record.steps.find((step) => step.name === name);
  if (!row) throw new Error(`Unknown release step: ${name}`);
  let stack = stacks.get(record);
  if (!stack) stacks.set(record, (stack = []));
  const frame = { started: performance.now(), children: 0 };
  row.startedAt ??= new Date().toISOString();
  stack.push(frame);
  try {
    return await operation();
  } finally {
    const elapsed = performance.now() - frame.started;
    stack.pop();
    if (stack.length) stack.at(-1).children += elapsed;
    row.durationMs += Math.max(0, elapsed - frame.children);
    row.finishedAt = new Date().toISOString();
  }
}
