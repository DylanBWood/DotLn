// The criteria an executor's handoff recorded unmet (WO-173) are history once
// a later criterion-level judgment exists: a passing verification met them,
// a waiver recorded one unmet by the operator's word, or a defect record
// classed one as unmeetable as written. A page shows the later judgment as
// the criterion's state and the executor's ordinal beside it, never the
// executor's record as the order's current state (WO-257).

/** Each criterion the executor left unmet with its later judgment, when one
 * exists, and whether the executor's record is still the current state. */
export function criteriaJudgments(state) {
  const unmet = state?.unmetCriteria ?? [];
  if (!unmet.length) return [];
  return unmet.map(({ criterionId, ordinal }) => {
    // A later verification keeps its judgment through a failed final review
    // and repair. A new executor handoff needs its own later verification.
    // Older caller-supplied projections without chronology keep their former
    // phase-based interpretation; current folds supply the event ordinal.
    const verified =
      state.latestVerdict === "pass" &&
      (Number.isSafeInteger(state.latestVerificationOrdinal)
        ? state.latestVerificationOrdinal > ordinal
        : ["verified", "final-review", "closed"].includes(state.phase));
    const waiver = (state.waivedCriteria ?? []).find(
      (row) => row.criterionId === criterionId,
    );
    const defect = (state.defectiveCriteria ?? []).find(
      (row) => row.criterionId === criterionId,
    );
    const judgment = waiver
      ? `unmet, waived by ordinal ${waiver.ordinal}`
      : defect
        ? `defective (${defect.class}) by ordinal ${defect.ordinal}`
        : verified
          ? `met by ${state.latestVerificationId ?? "the verification"}`
          : "unmet";
    return {
      criterionId,
      ordinal,
      judgment,
      current: !waiver && !defect && !verified,
    };
  });
}

/** One line for a page: the later judgments with the executor's ordinal
 * beside each, or, while no later judgment exists, the executor's record as
 * the current state. Null when the executor recorded no unmet criterion. */
export function renderCriteriaStatus(state) {
  const rows = criteriaJudgments(state);
  if (!rows.length) return null;
  if (rows.every((row) => row.current))
    return `Unmet criteria: ${rows.map((row) => row.criterionId).join(", ")} (recorded unmet by the executor at ordinal ${rows[0].ordinal})`;
  return `Criteria: ${rows
    .map(
      (row) =>
        `${row.criterionId} ${row.judgment} (executor: unmet at handoff, ordinal ${row.ordinal})`,
    )
    .join("; ")}`;
}
