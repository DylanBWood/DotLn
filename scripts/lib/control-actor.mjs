export const validateAccountLabel = (label) => {
  if (label === undefined) return;
  if (
    typeof label !== "string" ||
    label.match(/^[a-z][a-z0-9-]{0,15}$/u)?.[0] !== label
  )
    throw new Error(
      "invalid account label: expected 1–16 lowercase letters, digits, or hyphens, starting with a letter",
    );
};

// Projection defaults never change the stored historical attestation.
export const projectActor = (actor) =>
  actor
    ? { ...actor, accountLabel: actor.accountLabel ?? "not-applicable" }
    : null;

export const renderEffort = ({ effort, raw, mode }) =>
  `${effort}${mode ? ` (${mode})` : ""}${typeof raw === "string" ? ` (raw: ${raw})` : ""}`;

export const renderAttestation = (actor) => {
  if (!actor) return "none";
  const {
    harness,
    harnessVersion,
    model,
    effort,
    raw,
    mode,
    source,
    accountLabel,
  } = projectActor(actor);
  const effortText = renderEffort({ effort, raw, mode });
  // A RecordCorrected event names itself beside the values it set (WO-158).
  const corrected = Array.isArray(actor.correctedBy)
    ? `; corrected by ordinal ${actor.correctedBy.join(", ")}`
    : "";
  return `harness ${harness}; version ${harnessVersion}; model ${model}; effort ${effortText}; source ${source}; account ${accountLabel}${corrected}`;
};

// Corrections are a read projection over one intact segment. Apply them before
// filtering a legacy segment by order: subject ordinals belong to that segment.
export function correctedActorEvents(events) {
  const projected = [...events];
  const activations = new Map();
  const completions = new Set([
    "ImplementationReady",
    "VerificationCompleted",
    "RepairCompleted",
    "FinalReviewCompleted",
  ]);
  for (const [index, event] of events.entries()) {
    if (event.type === "WorkOrderActivated")
      activations.set(event.workOrderId, index);
    if (event.type !== "RecordCorrected") continue;
    const ordinal = event.subject?.ordinal;
    if (!Number.isSafeInteger(ordinal) || ordinal < 1 || ordinal > index)
      continue;
    const target = projected[ordinal - 1];
    if (
      !target?.actor ||
      target.workOrderId !== event.workOrderId ||
      !completions.has(target.type) ||
      target.type !== event.subject.type ||
      ordinal - 1 < (activations.get(event.workOrderId) ?? 0)
    )
      continue;
    const fields = ["model", "effort", "source", "harnessVersion"].filter(
      (key) => typeof event.fields?.[key] === "string",
    );
    if (!fields.length) continue;
    const actor = {
      ...target.actor,
      correctedBy: [...(target.actor.correctedBy ?? []), index + 1],
    };
    for (const key of fields) actor[key] = event.fields[key];
    if (fields.includes("effort")) {
      delete actor.raw;
      delete actor.mode;
    }
    projected[ordinal - 1] = { ...target, actor };
  }
  return projected;
}
