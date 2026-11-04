import { existsSync, readFileSync } from "node:fs";
import { docPath } from "./config.mjs";
import { formatDuration } from "./duration.mjs";
import { pruneStartBudgetKey } from "./process-budget.mjs";

/** The command that finishes what a bounded prune left: it sets no budget. */
export const PRUNE_RESUME_COMMAND = "node scripts/harness.mjs prune --apply";
/** The routine prune's wall budget when `prune.startBudgetMs` is unset: thirty
 * minutes, long enough that routine cleanup finishes in the run that starts
 * it, and still a stop for a backlog that would otherwise hold a command for
 * hours. */
export const DEFAULT_PRUNE_START_BUDGET_MS = 1_800_000;

/** The routine prune's wall budget from the control root's budgets file:
 * `prune.startBudgetMs` in milliseconds, 1,800,000 (30 minutes) when unset,
 * and no bound when null. A file that does not parse, or a `prune.startBudgetMs` that
 * pruneStartBudgetKey refuses, leaves the default with an advisory saying
 * why, so the command that asked goes on; the rest of the document is
 * readBudgets' to judge.
 * @param {string} root @returns {{budgetMs: number|null, advisory?: string}} */
export function pruneStartBudget(root) {
  let value;
  try {
    const path = docPath(root, "control", "budgets.json");
    value = existsSync(path)
      ? pruneStartBudgetKey(JSON.parse(readFileSync(path, "utf8")))
      : undefined;
  } catch (error) {
    return {
      budgetMs: DEFAULT_PRUNE_START_BUDGET_MS,
      advisory: `prune budget unavailable (${error.message}); the default of ${formatDuration(DEFAULT_PRUNE_START_BUDGET_MS)} applies`,
    };
  }
  return {
    budgetMs: value === undefined ? DEFAULT_PRUNE_START_BUDGET_MS : value,
  };
}

// Bytes a removal measured, and how many candidates no walk has measured yet.
const measured = (bytes, unmeasured) =>
  `${bytes} bytes${unmeasured ? ` (${unmeasured} unmeasured)` : ""}`;

/** The census by kind and class, and, for an apply that counts what it left,
 * `removed N; remaining M` with the resume command whenever M is above zero,
 * and where a spent budget stopped it. A preview resumes nothing, so it
 * prints its census alone; its report still counts every candidate as
 * remaining. A candidate judged on its record has no size until its removal
 * measures it, so a preview counts it unmeasured. */
export const formatPruneReport = (report) => {
  const lines = [
    `Prune: ${report.candidates.length} candidates; ${measured(report.bytes, report.unmeasured)}; ${report.removed?.length ?? 0} removed; ${report.retained.length} retained`,
    ...report.census.map(
      (row) =>
        `  ${row.kind}${row.class ? `/${row.class}` : ""}: ${row.candidates} candidates, ${measured(row.bytes, row.unmeasured)}, ${row.retained} retained`,
    ),
  ];
  if (report.apply && Number.isInteger(report.remaining))
    lines.push(
      `Prune: removed ${report.removed?.length ?? 0}; remaining ${report.remaining}${report.remaining > 0 ? `; resume with ${PRUNE_RESUME_COMMAND}` : ""}`,
    );
  if (report.stoppedAt)
    lines.push(
      `Prune stopped at its budget of ${formatDuration(report.budgetMs)} in ${report.stoppedAt.step} at ${report.stoppedAt.path}`,
    );
  return lines.join("\n");
};

/** Update preview is observational. `plan start` is where routine cleanup of
 * expired roots outside any close's scope lives: it already pays for the full
 * census, so it applies it, under the wall budget it passes as `budgetMs`. An
 * apply refused before it changed anything, as while a gate holds the host
 * lanes, prints the census and leaves the roots for the next start; an apply
 * that stopped partway names what it removed before the census of what
 * remains, and keeps naming it when that census then fails. The census after
 * a failed apply has what the budget leaves, never a budget of its own. An
 * unreadable owner is reported and retained either way.
 * `options.pruneHarness` replaces the prune for a test. */
export async function temporaryPruneSummary(root, options = {}) {
  const started = performance.now();
  const unavailable = (error) =>
    `Prune: census unavailable; material retained (${error.message})`;
  try {
    const { pruneHarness: replaced, ...pruneOptions } = options;
    const pruneHarness =
      replaced ?? (await import("./harness-prune.mjs")).pruneHarness;
    try {
      return formatPruneReport(await pruneHarness(root, pruneOptions));
    } catch (error) {
      if (!pruneOptions.apply) throw error;
      const removed = error.pruneRemoved;
      const outcome = Array.isArray(removed)
        ? `Prune: apply stopped after ${removed.length} removed, ${removed.reduce((sum, row) => sum + (row.bytes ?? 0), 0)} bytes (${error.message}); what remains:`
        : `Prune: apply deferred (${error.message})`;
      const budgetMs =
        typeof pruneOptions.budgetMs === "number"
          ? Math.max(0, pruneOptions.budgetMs - (performance.now() - started))
          : pruneOptions.budgetMs;
      let census;
      try {
        census = formatPruneReport(
          await pruneHarness(root, { ...pruneOptions, apply: false, budgetMs }),
        );
      } catch (censusError) {
        census = unavailable(censusError);
      }
      return `${outcome}\n${census}`;
    }
  } catch (error) {
    return unavailable(error);
  }
}
