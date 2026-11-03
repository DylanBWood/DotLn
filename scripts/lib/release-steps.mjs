const names = [
  "prerequisites",
  "runtime",
  "worktree-removal",
  "publication",
  "starter-refresh",
  "prune",
  "record",
];
// What the worktree-removal step spends its time on. These are rows on that
// step, not steps: withReleaseStep admits only the seven names above, and each
// child is timed inside the step's own time and outside any nested step, so
// their sum stays within the step's durationMs and nothing is counted twice.
const removalChildren = [
  "base-fetch",
  "disposable-deletion",
  "finder-metadata",
  "journal-retention",
  "git-worktree-remove",
  "branch-delete",
  "preservation",
];
/** The classes a stopped close's blocker takes. Each refusal is classed where
 * it is raised, never by reading its message. */
export const CLOSE_BLOCKER_CLASSES = Object.freeze([
  "undeclared-ignored-material",
  "not-clean",
  "writer-held",
  "preservation-refused",
  "declared-root-unreadable",
  "host-denied",
  "base-fetch",
  "foreign-tag",
  "starter-refresh",
  "publication",
  "other",
]);
const stacks = new WeakMap();

export const releaseSteps = () =>
  names.map((name) => ({
    name,
    startedAt: null,
    finishedAt: null,
    durationMs: 0,
    ...(name === "worktree-removal"
      ? {
          children: removalChildren.map((child) => ({
            name: child,
            durationMs: 0,
            ...(child === "disposable-deletion" ? { files: 0, bytes: 0 } : {}),
          })),
        }
      : {}),
  }));

/** Durations count active time, excluding nested steps. Repeated visits share
 * one row; its timestamps span the first start through the last finish. A
 * refusal leaving a step carries the innermost step's name as `releaseStep`. */
export async function withReleaseStep(record, name, operation) {
  if (!record?.steps) return operation();
  const row = record.steps.find((step) => step.name === name);
  if (!row) throw new Error(`Unknown release step: ${name}`);
  let stack = stacks.get(record);
  if (!stack) stacks.set(record, (stack = []));
  const frame = { name, started: performance.now(), children: 0 };
  row.startedAt ??= new Date().toISOString();
  stack.push(frame);
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error && !Object.hasOwn(error, "releaseStep"))
      error.releaseStep = name;
    throw error;
  } finally {
    const elapsed = performance.now() - frame.started;
    stack.pop();
    if (stack.length) stack.at(-1).children += elapsed;
    row.durationMs += Math.max(0, elapsed - frame.children);
    row.finishedAt = new Date().toISOString();
  }
}

/** The innermost release step running for this record, or null. */
export const currentReleaseStep = (record) =>
  stacks.get(record)?.at(-1)?.name ?? null;

/** Adds time spent inside the worktree-removal step to one of its children,
 * with the files and bytes a deletion child counts. A record without timed
 * steps, as a direct caller passes, records nothing. */
export function addRemovalChild(record, name, durationMs, counts = {}) {
  if (!record?.steps) return;
  if (!removalChildren.includes(name))
    throw new Error(`Unknown worktree-removal child: ${name}`);
  const row = record.steps
    .find((step) => step.name === "worktree-removal")
    ?.children?.find((child) => child.name === name);
  if (!row) return;
  if (Number.isFinite(durationMs)) row.durationMs += Math.max(0, durationMs);
  for (const [key, value] of Object.entries(counts))
    if (Number.isFinite(value)) row[key] = (row[key] ?? 0) + value;
}

/** Times one synchronous part of the worktree-removal step. */
export function timeRemovalChild(record, name, operation) {
  const started = performance.now();
  try {
    return operation();
  } finally {
    addRemovalChild(record, name, performance.now() - started);
  }
}

/** The worktree-removal children a finish or settle child process may report. */
export const isRemovalChild = (name) => removalChildren.includes(name);

/** A refusal that names its close-blocker class where it is raised. */
export function closeBlocker(blockerClass, message, options) {
  if (!CLOSE_BLOCKER_CLASSES.includes(blockerClass))
    throw new Error(`Unknown close blocker class: ${blockerClass}`);
  return Object.assign(new Error(message, options), { blockerClass });
}

/** Runs an operation whose refusals all belong to one class; a refusal that
 * already names its class keeps it. */
export function withBlockerClass(blockerClass, operation) {
  if (!CLOSE_BLOCKER_CLASSES.includes(blockerClass))
    throw new Error(`Unknown close blocker class: ${blockerClass}`);
  try {
    return operation();
  } catch (error) {
    if (error instanceof Error && !Object.hasOwn(error, "blockerClass"))
      error.blockerClass = blockerClass;
    throw error;
  }
}

/** A recorded blocker's class: one of the closed list, otherwise `other`. */
export const blockerClassOf = (value) =>
  CLOSE_BLOCKER_CLASSES.includes(value) ? value : "other";
