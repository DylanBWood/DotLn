import { createHash } from "node:crypto";
import { parseDependencies } from "./dependencies.mjs";
import {
  headerField,
  readWorkOrder,
  readWorkOrderHeader,
} from "./work-order-document.mjs";

const refuse = (detail) => {
  throw new Error(`derived order: ${detail}`);
};
export const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(",")}}`;
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  )
    return JSON.stringify(value);
  return refuse("contract must contain only JSON values");
};
export const contractDigest = (value) =>
  createHash("sha256").update(canonical(value)).digest("hex");
const text = (value) =>
  typeof value === "string" &&
  value.trim() &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value);
export function validateProvenance(value) {
  if (
    !value ||
    !["runtime", "ui", "intent"].includes(value.kind) ||
    !text(value.sourceId) ||
    /[\r\n\u2028\u2029]/u.test(value.sourceId) ||
    Object.keys(value).sort().join(",") !== "kind,sourceId"
  )
    refuse(
      "provenance requires kind runtime|ui|intent and a stable, public sourceId",
    );
  return { kind: value.kind, sourceId: value.sourceId };
}
export function validateCompiled(value) {
  const scalars = ["workOrderId", "objective", "repo", "baseCommit"];
  const lists = [
    "acceptanceCriteria",
    "knownFacts",
    "decisions",
    "constraints",
    "nonGoals",
    "allowedOperations",
    "prohibitedOperations",
    "requiredEvidence",
  ];
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).sort().join(",") !==
      [...scalars, ...lists, "outputContract"].sort().join(",") ||
    scalars.some((key) => !text(value[key])) ||
    lists.some(
      (key) =>
        !Array.isArray(value[key]) || value[key].some((entry) => !text(entry)),
    ) ||
    !value.acceptanceCriteria.length
  )
    refuse("expected a complete compiled WorkOrder with acceptance criteria");
  canonical(value);
  return structuredClone(value);
}
export function parseDerivedProvenance(markdown, path) {
  // A header field: the index reads it for every order without its body.
  return derivedProvenance(readWorkOrderHeader(markdown), path);
}
// The provenance a read order's header declares: one field whose line holds
// the JSON record. A duplicate or an invalid record is malformed.
function derivedProvenance(order, path) {
  try {
    const field = headerField(
      order,
      "Derived provenance",
      "duplicate provenance",
    );
    return field && validateProvenance(JSON.parse(field.lineValue));
  } catch {
    throw new Error(`${path}: malformed derived provenance`);
  }
}
const sections = [
  "Objective",
  "Design",
  "Acceptance criteria",
  "Non-goals",
  "Surfaces",
  "Operator-review assumptions",
];
// An allocation event names the section set it was written under by digest,
// so a later change to `sections` above leaves historical events foldable.
// A change keeps each superseded set in this table; an event without a
// digest was written under the WO-120 set (WO-157 item 14, WO-120 D007).
const WO120_SECTIONS = [
  "Objective",
  "Design",
  "Acceptance criteria",
  "Non-goals",
  "Surfaces",
  "Operator-review assumptions",
];
const LEGACY_SECTIONS_HASH =
  "7613f5411a35ad4de06d32e30ceab8d117b15d129e147a63db6bf9c3ba806793";
const SECTION_SETS = new Map(
  [WO120_SECTIONS, sections].map((set) => [contractDigest(set), set]),
);
export const SECTIONS_HASH = contractDigest(sections);
export function allocationSections(event) {
  const set = SECTION_SETS.get(event.sectionsHash ?? LEGACY_SECTIONS_HASH);
  if (!set) refuse(`unknown generated section set ${event.sectionsHash}`);
  return set;
}
// A date in a bold label marks a hand-written addition, such as a dated
// receipt or amendment; a generated authority carries none.
const DATED = /\b\d{4}-\d{2}-\d{2}/u;
/** Global migration belongs to WO-113; only generated authorities opt in here.
 * The shape is the title, then exactly the expected sections as second-level
 * headings in order, and no dated bold label anywhere. */
export function checkGeneratedSections(
  markdown,
  path,
  expected = sections,
  { historicalIds = new Set() } = {},
) {
  const order = readWorkOrder(markdown);
  if (!derivedProvenance(order, path))
    throw new Error(`${path}: missing derived provenance`);
  const body = order.sections().slice(1);
  if (
    !order.title ||
    body.some((section) => section.depth !== 2) ||
    canonical(body.map((section) => section.title)) !== canonical(expected) ||
    order.fields.some((field) => DATED.test(field.raw))
  )
    throw new Error(
      `${path}: generated authority requires stable sections: ${expected.join(", ")}`,
    );
  const dependencies = parseDependencies(
    markdown,
    path,
    undefined,
    historicalIds,
  );
  if (dependencies.source !== "typed")
    throw new Error(`${path}: generated authority requires typed dependencies`);
  return true;
}
export function validateAllocation(event, { historicalIds = new Set() } = {}) {
  if (
    event.type !== "WorkOrderIdentityAllocated" ||
    event.schemaVersion !== 1 ||
    !/^WO-\d{3}$/.test(event.workOrderId) ||
    typeof event.workOrderPath !== "string" ||
    !event.workOrderPath.endsWith(`/${event.workOrderId}-derived.md`) ||
    !/^[a-f0-9]{64}$/.test(event.requestHash ?? "") ||
    !(
      event.sectionsHash === undefined ||
      /^[a-f0-9]{64}$/.test(event.sectionsHash)
    ) ||
    typeof event.authority !== "string"
  )
    refuse("malformed identity allocation event");
  validateProvenance(event.provenance);
  validateCompiled(event.compiled);
  if (event.compiled.workOrderId !== event.workOrderId)
    refuse("compiled identity differs from allocation");
  checkGeneratedSections(
    event.authority,
    event.workOrderPath,
    allocationSections(event),
    { historicalIds },
  );
  const authority = readWorkOrder(event.authority);
  if (
    canonical(derivedProvenance(authority, event.workOrderPath)) !==
    canonical(event.provenance)
  )
    refuse("authority provenance differs from allocation");
  if (!authority.title?.title.startsWith(`${event.workOrderId} — `))
    refuse("authority title differs from allocation");
  return event;
}
const prose = (value) =>
  value
    .replace(/[&<>\\*#\[\]`|]/g, (c) => `&#${c.codePointAt(0)};`)
    .replace(/\r\n?|[\u2028\u2029]/g, "\n");
const bullet = (values) =>
  values.length
    ? values
        .map((value) => `- ${prose(value).replaceAll("\n", "\n  ")}`)
        .join("\n")
    : "- None declared.";
export function renderDerivedAuthority(
  compiled,
  provenance,
  { dependencies, surfaces, releaseClassification },
) {
  const title = prose(
    compiled.objective
      .trim()
      .split(/[\r\n\u2028\u2029]/u)[0]
      .slice(0, 120),
  );
  const repository =
    compiled.repo === "self"
      ? ""
      : `**Repository:** ${compiled.repo} @ ${compiled.baseCommit}\n`;
  const source = `# ${compiled.workOrderId} — ${title} (version assigned at activation)

**Model:** any capable model; record the actual model used.
**Effort:** executor any; verifier any; reviewer any.
**Cost:** Unmeasured; no reduction claimed.
**Release classification:** ${releaseClassification}. Review the classification before execution.
${repository}**Derived provenance:** ${JSON.stringify(provenance)}

<!-- dotln-dependencies:start -->
${JSON.stringify(dependencies, null, 2)}
<!-- dotln-dependencies:end -->

## Objective

${prose(compiled.objective)}

## Design

Known facts:
${bullet(compiled.knownFacts)}

Decisions:
${bullet(compiled.decisions)}

Constraints:
${bullet(compiled.constraints)}

Allowed operations:
${bullet(compiled.allowedOperations)}

Prohibited operations:
${bullet(compiled.prohibitedOperations)}

## Acceptance criteria

${compiled.acceptanceCriteria.map((value, i) => `${i + 1}. ${prose(value).replaceAll("\n", "\n   ")}`).join("\n")}

Required evidence:
${bullet(compiled.requiredEvidence)}

Output contract (JSON):

    ${JSON.stringify(compiled.outputContract).replaceAll("<", "\\u003c")}

## Non-goals

${bullet(compiled.nonGoals)}

## Surfaces

${bullet(surfaces)}

## Operator-review assumptions

- Review scope, criteria, dependencies, release classification and declared surfaces before execution.
- Filing a draft grants no execution authority.
`;
  checkGeneratedSections(source, `${compiled.workOrderId}-derived.md`);
  return source;
}
