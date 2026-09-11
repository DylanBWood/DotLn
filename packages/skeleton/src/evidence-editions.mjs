import { readFileSync } from "node:fs";
import { join } from "node:path";

/** @typedef {"authority" | "artifact-identity" | "verification" | "feedback"} EvidenceKind */
/** @typedef {{workOrder: string, revision: string | null}} EvidenceEdition */

/** Select recorded evidence, independently of whichever order is active.
 * Historical comparisons keep their explicit pins. Changing this manifest
 * selects a replacement; it never regenerates or blesses that replacement.
 * @param {string} root
 * @param {EvidenceKind} kind
 * @param {EvidenceEdition} [override]
 */
export function currentEvidence(root, kind, override) {
  const manifest = override
    ? null
    : JSON.parse(
        readFileSync(join(root, "docs/evidence/current.json"), "utf8"),
      );
  if (manifest && manifest.schemaVersion !== 1)
    throw new Error("Unsupported current-evidence manifest");
  const row = override ?? manifest?.editions?.[kind];
  if (
    !row ||
    typeof row.workOrder !== "string" ||
    !/^WO-\d{3}$/.test(row.workOrder) ||
    !(
      row.revision === null ||
      (typeof row.revision === "string" && /^(?!000)\d{3}$/.test(row.revision))
    ) ||
    (["artifact-identity", "verification"].includes(kind) &&
      row.revision !== null) ||
    (kind === "feedback" && row.workOrder === "WO-011" && row.revision !== null)
  )
    throw new Error(`Invalid current-evidence edition: ${kind}`);
  /** @type {EvidenceEdition} */
  const edition = { workOrder: row.workOrder, revision: row.revision };
  const suffix =
    kind === "authority"
      ? edition.revision
        ? `authority/${edition.revision}`
        : ""
      : kind === "feedback"
        ? edition.workOrder === "WO-011"
          ? ""
          : `feedback${edition.revision ? `-${edition.revision}` : ""}`
        : kind;
  return {
    ...edition,
    label: `${edition.workOrder}${edition.revision ? ` revision ${edition.revision}` : ""}`,
    directory: `docs/evidence/${edition.workOrder}${suffix ? `/${suffix}` : ""}`,
  };
}

/** Preserve explicit historical CLI selection without per-caller defaults.
 * @param {string} root
 * @param {EvidenceKind} kind
 * @param {string[]} args
 */
export function evidenceArgs(root, kind, args) {
  const rest = [];
  const options = new Map();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--edition" || arg === "--revision") {
      const value = args[++i];
      if (!value || value.startsWith("--") || options.has(arg))
        throw new Error(`Invalid evidence option: ${arg}`);
      options.set(arg, value);
    } else rest.push(arg);
  }
  const workOrder = options.get("--edition");
  const revision = options.get("--revision");
  return {
    args: rest,
    selection: currentEvidence(
      root,
      kind,
      workOrder || revision
        ? {
            workOrder: workOrder ?? currentEvidence(root, kind).workOrder,
            revision: revision ?? null,
          }
        : undefined,
    ),
  };
}
