import { createHash } from "node:crypto";

/** Bind a compact census to the sorted path list without printing that list. */
export function materialSummary(rows) {
  const countsByClass = {};
  for (const row of rows)
    countsByClass[row.class] = (countsByClass[row.class] ?? 0) + 1;
  const paths = rows.map((row) => row.path).sort();
  return {
    count: paths.length,
    countsByClass: Object.fromEntries(Object.entries(countsByClass).sort()),
    digest: `sha256:${createHash("sha256").update(JSON.stringify(paths)).digest("hex")}`,
  };
}
