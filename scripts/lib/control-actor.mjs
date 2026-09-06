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

export const renderAttestation = (actor) => {
  if (!actor) return "none";
  const { harness, harnessVersion, model, effort, raw, source, accountLabel } =
    projectActor(actor);
  const effortText =
    effort === "unknown" && typeof raw === "string"
      ? `unknown (raw: ${raw})`
      : effort;
  return `harness ${harness}; version ${harnessVersion}; model ${model}; effort ${effortText}; source ${source}; account ${accountLabel}`;
};
