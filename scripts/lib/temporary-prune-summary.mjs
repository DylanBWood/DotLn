export const formatPruneReport = (report) =>
  `Prune: ${report.candidates.length} candidates; ${report.bytes} bytes; ${report.removed?.length ?? 0} removed; ${report.retained.length} retained\n${report.census.map((row) => `  ${row.kind}${row.class ? `/${row.class}` : ""}: ${row.candidates} candidates, ${row.bytes} bytes, ${row.retained} retained`).join("\n")}`;

/** Update preview is observational. `plan start` is where routine cleanup of
 * expired roots outside any close's scope lives: it already pays for the full
 * census, so it applies it. An apply refused before it changed anything, as
 * while a gate holds the host lanes, prints the census and leaves the roots
 * for the next start; an apply that stopped partway names what it removed
 * before the census of what remains, and keeps naming it when that census
 * then fails. An unreadable owner is reported and retained either way.
 * `options.pruneHarness` replaces the prune for a test. */
export async function temporaryPruneSummary(root, options = {}) {
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
      let census;
      try {
        census = formatPruneReport(
          await pruneHarness(root, { ...pruneOptions, apply: false }),
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
