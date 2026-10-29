/** Operator-facing durations use hours and minutes, rounded to the nearest
 * minute. Machine records retain their original measurement units. */
/** @param {unknown} milliseconds */
export function formatDuration(milliseconds) {
  if (typeof milliseconds !== "number" || !Number.isFinite(milliseconds))
    return "unknown";
  const sign = milliseconds < 0 ? "-" : "";
  const minutes = Math.round(Math.abs(milliseconds) / 60_000);
  return `${sign}${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
