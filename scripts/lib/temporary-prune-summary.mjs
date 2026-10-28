export const formatPruneReport = (report) =>
  `Prune: ${report.candidates.length} candidates; ${report.bytes} bytes; ${report.removed?.length ?? 0} removed; ${report.retained.length} retained\n${report.census.map((row) => `  ${row.kind}${row.class ? `/${row.class}` : ""}: ${row.candidates} candidates, ${row.bytes} bytes, ${row.retained} retained`).join("\n")}`;

/** Start and preview are observational. An unreadable owner is reported and
 * retained; it never turns a read-only census into an implicit cleanup. */
export async function temporaryPruneSummary(root, options = {}) {
  try {
    const { pruneHarness } = await import("./harness-prune.mjs");
    return formatPruneReport(await pruneHarness(root, options));
  } catch (error) {
    return `Prune: census unavailable; material retained (${error.message})`;
  }
}
