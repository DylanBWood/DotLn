// WO-173: the one gate row two readers stand on. `npm test` reuses a passing,
// complete row of its own command at the current code identity whose required
// suites cover the current selection instead of running again, and an
// executor's `npm test` claim at a completion stands on the same row. A failed
// row, a partial row and a row at another code identity never satisfy either,
// whoever recorded the row. The skeleton's gate-evidence module is imported
// when a lookup runs, so a copied control plane without the skeleton still
// loads the lifecycle scripts that import this one (WO-070).

/** The rule `partialGateCheck` applies in the skeleton's gate-evidence module,
 * restated here for the same reason the control fold restates it: any shape
 * of either field other than absent, `false` or an empty list is partial. */
const partialRow = (row) =>
  (row.partial !== undefined && row.partial !== false) ||
  (row.excludedSuites !== undefined &&
    !(Array.isArray(row.excludedSuites) && row.excludedSuites.length === 0));

/** The row shape publication already relies on: executed, passing, whole. */
export const completePassingRow = (row) =>
  row.executed === true &&
  row.exitCode === 0 &&
  !partialRow(row) &&
  Number.isFinite(row.durationMs) &&
  row.durationMs >= 0 &&
  typeof row.evidenceRef === "string" &&
  row.evidenceRef.length > 0;

/**
 * The latest complete passing row of `checkId` at `codeIdentity` whose
 * required suites include every name in `requiredSuites`, beside every
 * candidate row at that identity and the suites the latest candidate lacks,
 * so a refusal can name them. Reading the gate index may throw; the caller
 * decides whether that is an advisory.
 */
export async function coveringGateCheck(
  root,
  checkId,
  requiredSuites,
  codeIdentity,
) {
  const { gateCodeIdentity, readGateChecks } =
    await import("./gate-evidence.mjs");
  const identity = codeIdentity ?? gateCodeIdentity(root);
  const candidates = readGateChecks(root).filter(
    (row) =>
      row.checkId === checkId &&
      row.codeIdentity === identity &&
      completePassingRow(row),
  );
  // A row without the field covers only an empty requirement: publication
  // accepts such a row, so a plain claim does too, while a selection's names
  // cannot be judged covered by a row that names none.
  const covers = (row) =>
    requiredSuites.every((name) =>
      (Array.isArray(row.requiredSuites) ? row.requiredSuites : []).includes(
        name,
      ),
    );
  const latest = candidates.at(-1);
  return {
    codeIdentity: identity,
    row: candidates.findLast(covers),
    candidates,
    missing: latest
      ? requiredSuites.filter(
          (name) => !(latest.requiredSuites ?? []).includes(name),
        )
      : [...requiredSuites],
  };
}

/** One line a reader can act on. */
export const describeGateRow = (row) =>
  `recorded ${row.recordedAt ?? "at an unknown time"}, ${(row.durationMs / 1000).toFixed(2)} s, ${Array.isArray(row.requiredSuites) ? row.requiredSuites.length : "unknown"} suites, ${row.evidenceRef}`;
