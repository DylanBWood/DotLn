import { parseDependencies } from "./dependencies.mjs";

const seedPath = "docs/planning/critical-path-2026-09-08.json";
const corpusRelations = {
  "WO-102": [
    ["WO-004", "satisfied-by-close"],
    ["WO-101", "reference-only"],
  ],
  "WO-103": [
    ["WO-017", "satisfied-by-close"],
    ["WO-004", "satisfied-by-close"],
  ],
  "WO-105": [
    ["WO-004", "satisfied-by-close"],
    ["WO-017", "satisfied-by-close"],
  ],
  "WO-107": [
    ["WO-004", "satisfied-by-close"],
    ["WO-005", "reference-only"],
  ],
};
const canonical = (entries, reasons) =>
  JSON.stringify(
    entries
      .map((entry) =>
        Object.fromEntries(
          Object.entries(entry)
            .filter(([key]) => reasons || key !== "reason")
            .sort(([a], [b]) => a.localeCompare(b)),
        ),
      )
      .sort((a, b) => a.workOrderId.localeCompare(b.workOrderId)),
  );

// This one-time continuation only transcribes the reviewed WO-043 migration.
// It cannot change an existing typed block or authorize a later relation edit.
export function dependencyMigration(judged, original, read) {
  const authority = judged.orders.find(
    ({ workOrderId, criteria }) =>
      workOrderId === "WO-043" &&
      criteria.some(({ text }) =>
        text
          .replace(/\s+/gu, " ")
          .includes("Every open order carries a typed block"),
      ),
  );
  if (!authority || !original.read(authority.path).includes(seedPath))
    return (_before, after) => ({ source: after, migrated: false });
  let seed;
  const refuse = (condition, reason) => {
    if (!condition)
      throw new Error(
        `planning pass needs a receipt matching the current subject: dependency migration ${reason}`,
      );
  };
  return (before, after, path, workOrderId) => {
    const old = parseDependencies(before, path, workOrderId);
    const next = parseDependencies(after, path, workOrderId);
    if (old.source === "typed" || next.source !== "typed")
      return { source: after, migrated: false };
    if (!seed) {
      const bytes = original.read(seedPath);
      refuse(read(seedPath) === bytes, "changed its reviewed seed");
      seed = JSON.parse(bytes);
    }
    let reasons = true;
    let expected = seed.edges
      .filter(({ from }) => from === workOrderId)
      .map(({ from: _from, to, ...entry }) => ({
        workOrderId: to,
        ...entry,
        ...(entry.relation === "planning-deferral" ? { until: to } : {}),
      }));
    const umbrella = before.match(
      /^\*\*Umbrella record[^\n]+(?:\n(?!\n)[^\n]+)*/mu,
    )?.[0];
    if (umbrella) {
      refuse(
        umbrella.includes("superseded whole"),
        "needs a whole-umbrella notice",
      );
      const children =
        seed.nodes?.find(({ id }) => id === workOrderId)?.supersededBy
          ?.workOrderIds ??
        [umbrella.match(/superseded whole by \[?(WO-\d{3})/u)?.[1]].filter(
          Boolean,
        );
      refuse(
        children.length > 0 &&
          children.every((id) => id !== workOrderId && umbrella.includes(id)),
        "needs named umbrella successors",
      );
      expected = children.map((id) => ({
        workOrderId: id,
        relation: "superseded",
        by: id,
      }));
      reasons = false;
    } else if (corpusRelations[workOrderId] && expected.length === 0) {
      // Four seed nodes have no edges. Their unchanged, reviewed prose names
      // these merged baselines and explicitly independent corpus references.
      expected = corpusRelations[workOrderId].map(([id, relation]) => ({
        workOrderId: id,
        relation,
      }));
      refuse(
        expected.every(({ workOrderId: id }) =>
          old.entries.some((entry) => entry.workOrderId === id),
        ),
        "corpus relation is absent from the reviewed prose",
      );
      reasons = false;
    }
    refuse(
      canonical(next.entries, reasons) === canonical(expected, reasons),
      `does not transcribe the reviewed relations in ${path}`,
    );
    const source = after.replace(
      /\n<!-- dotln-dependencies:start -->\r?\n[\s\S]*?\r?\n<!-- dotln-dependencies:end -->\r?\n/u,
      "",
    );
    refuse(source !== after, `needs the standalone migration block in ${path}`);
    return { source, migrated: true };
  };
}
