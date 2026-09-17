/** Pure journal projection, available to source-only lifecycle commands.
 * @param {Record<string, any>[]} observations
 */
export function correctionCounts(observations) {
  const unique = new Map();
  for (const [index, row] of observations.entries()) {
    if (row.measurement === false) continue;
    if (
      !["OperatorCorrectionReceived", "HedgedQuantityObserved"].includes(
        row.typedEvent,
      )
    )
      continue;
    // Old correction rows contain cumulative state. Each row is one event.
    const id =
      row.eventId ??
      row.correction?.corrections?.at(-1)?.eventId ??
      `row:${index}`;
    unique.set(`${row.journal ?? "session"}:${id}`, row);
  }
  /** @type {Record<string, number>} */
  const byPhase = {};
  /** @type {Record<string, number>} */
  const byUnit = {};
  /** @type {Record<string, Record<string, number>>} */
  const byPhaseAndUnit = {};
  for (const row of unique.values()) {
    const phase = row.phase ?? "unknown";
    byPhase[phase] = (byPhase[phase] ?? 0) + 1;
    const units =
      Array.isArray(row.units) && row.units.length ? row.units : ["unnamed"];
    for (const unit of units) {
      byUnit[unit] = (byUnit[unit] ?? 0) + 1;
      const phaseUnits = (byPhaseAndUnit[phase] ??= {});
      phaseUnits[unit] = (phaseUnits[unit] ?? 0) + 1;
    }
  }
  return {
    total: unique.size,
    byPhase,
    byUnit,
    byPhaseAndUnit,
    source: "session-journal",
  };
}
