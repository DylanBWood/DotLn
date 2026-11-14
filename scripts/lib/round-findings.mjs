// A paired round's findings as a decision records them (the `roundFindings`
// array of the round's decision): who found each, what kind of finding it
// was and what became of it. The document check reads the shape and nothing
// else; the failures report counts, over the orders that declare a paired
// ladder, what only the combined worker found, what only the three kinds
// found and what both did.

export const ROUND_FINDERS = Object.freeze([
  "criteria",
  "design",
  "consistency",
  "combined",
]);
export const ROUND_CLASSES = Object.freeze([
  "criterion",
  "lesser",
  "improvement",
  "none",
]);
export const ROUND_DISPOSITIONS = Object.freeze(["fixed", "recorded"]);
const FIELDS = ["id", "finders", "class", "disposition"];

/** Why a decision's `roundFindings` is malformed, each line naming the
 * decision and the field: `rows` are decisions as `readDecisions` gives
 * them, and only a row `changed` admits is judged, so a record written
 * before the rule keeps its bytes. A decision without the array passes. */
export function roundFindingFailures(rows, changed = () => true) {
  const failures = [];
  for (const row of rows) {
    if (row.roundFindings === undefined || !changed(row)) continue;
    const at = `${row.path}#${row.id}/roundFindings`;
    if (!Array.isArray(row.roundFindings)) {
      failures.push(`${at}: expected an array of findings`);
      continue;
    }
    const seen = new Set();
    row.roundFindings.forEach((entry, index) =>
      failures.push(...entryFailures(entry, `${at}[${index}]`, seen)),
    );
  }
  return failures;
}

/** Why one entry is malformed, each line under `where`; `seen` holds the
 * identifiers of the entries before it. The shape check and the counts read
 * this one judgment, so what the one refuses the other does not count. */
function entryFailures(entry, where, seen) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry))
    return [`${where}: expected an object with ${FIELDS.join(", ")}`];
  const failures = [];
  for (const key of Object.keys(entry))
    if (!FIELDS.includes(key))
      failures.push(`${where}/${key}: not a field of a round finding`);
  if (typeof entry.id !== "string" || !entry.id.trim())
    failures.push(`${where}/id: expected the finding's identifier`);
  else if (seen.has(entry.id))
    failures.push(`${where}/id: ${entry.id} is recorded twice`);
  else seen.add(entry.id);
  if (
    !Array.isArray(entry.finders) ||
    !entry.finders.length ||
    entry.finders.some((finder) => !ROUND_FINDERS.includes(finder)) ||
    new Set(entry.finders).size !== entry.finders.length
  )
    failures.push(
      `${where}/finders: expected one or more of ${ROUND_FINDERS.join(", ")}, each once`,
    );
  if (!ROUND_CLASSES.includes(entry.class))
    failures.push(
      `${where}/class: expected one of ${ROUND_CLASSES.join(", ")}`,
    );
  if (!ROUND_DISPOSITIONS.includes(entry.disposition))
    failures.push(
      `${where}/disposition: expected ${ROUND_DISPOSITIONS.join(" or ")}`,
    );
  return failures;
}

const emptyCounts = () =>
  Object.fromEntries(
    ROUND_CLASSES.map((name) => [
      name,
      { combinedOnly: 0, kindsOnly: 0, both: 0 },
    ]),
  );
const addCounts = (sum, counts) => {
  for (const name of ROUND_CLASSES)
    for (const side of ["combinedOnly", "kindsOnly", "both"])
      sum[name][side] += counts[name][side];
  return sum;
};

/** One round's findings counted by class and by who found them: the
 * combined worker alone, one or more of the three kinds alone, or both. An
 * entry the shape check would refuse is not counted. */
export function roundFindingCounts(findings) {
  const counts = emptyCounts();
  const seen = new Set();
  for (const entry of Array.isArray(findings) ? findings : []) {
    if (entryFailures(entry, "", seen).length) continue;
    const combined = entry.finders.includes("combined");
    const kinds = entry.finders.some((finder) => finder !== "combined");
    counts[entry.class][
      combined && kinds ? "both" : combined ? "combinedOnly" : "kindsOnly"
    ] += 1;
  }
  return counts;
}

/** The paired rounds of the given orders. `orders` are `{ workOrder,
 * decisions, firstVerification }`: an order that declared a paired ladder,
 * its decisions in order and its first verification's verdict (`pass`,
 * `fail` or `none`). An order none of whose decisions holds the array
 * contributes nothing. Each order's rounds are its decisions that hold one,
 * and the sums are over every order listed. */
export function pairedRounds(orders) {
  const listed = [];
  for (const { workOrder, decisions, firstVerification } of orders) {
    const rounds = decisions
      .filter((decision) => Array.isArray(decision.roundFindings))
      .map((decision) => ({
        decision: decision.id,
        findings: decision.roundFindings.length,
        counts: roundFindingCounts(decision.roundFindings),
      }));
    if (!rounds.length) continue;
    listed.push({
      workOrder,
      firstVerification,
      rounds: rounds.length,
      counts: rounds.reduce(
        (sum, round) => addCounts(sum, round.counts),
        emptyCounts(),
      ),
      perRound: rounds,
    });
  }
  return {
    orders: listed,
    sums: {
      orders: listed.length,
      rounds: listed.reduce((sum, order) => sum + order.rounds, 0),
      counts: listed.reduce(
        (sum, order) => addCounts(sum, order.counts),
        emptyCounts(),
      ),
      firstVerification: Object.fromEntries(
        ["pass", "fail", "none"].map((verdict) => [
          verdict,
          listed.filter((order) => order.firstVerification === verdict).length,
        ]),
      ),
    },
  };
}
