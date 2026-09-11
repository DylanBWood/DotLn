import { readFileSync } from "node:fs";
import { join } from "node:path";
import { committedReader, sha256 } from "./plan-subject.mjs";
import { containedRegularFile } from "./paths.mjs";
import { LEGACY_COST_HEADER } from "./legacy-cost.mjs";

const capabilityPath = "docs/planning/capability-table.md";
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const requireSamePlan = (condition, reason) => {
  if (!condition)
    throw new Error(
      `planning pass needs a receipt matching the current subject: ${reason}`,
    );
};

const releaseAssignment = (before, after) => {
  const oldTitle = before.match(/^# [^\r\n]+/u)?.[0];
  const newTitle = after.match(/^# [^\r\n]+/u)?.[0];
  const placeholder = "(version assigned at activation)";
  if (
    !oldTitle?.endsWith(placeholder) ||
    !newTitle?.startsWith(oldTitle.slice(0, -placeholder.length))
  )
    return { source: after, version: null };
  const version = newTitle.slice(oldTitle.length - placeholder.length);
  if (!/^\(v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\)$/u.test(version))
    return { source: after, version: null };
  return {
    source: oldTitle + after.slice(newTitle.length),
    version: version.slice(1, -1),
  };
};

const executionAppendix = (before, after) => {
  const prefix = before.trimEnd();
  if (after.trimEnd() === prefix) return false;
  requireSamePlan(
    after.startsWith(prefix),
    "existing work-order bytes changed",
  );
  const appended = after.slice(prefix.length);
  requireSamePlan(
    /^\n\n## Execution record\r?\n\r?\n\S/u.test(appended) &&
      appended
        .split(/\r?\n/u)
        .every(
          (line) => !/^#{1,2} /u.test(line) || line === "## Execution record",
        ) &&
      !/^\*\*[A-Z][^*]+\*\*/mu.test(appended),
    "only an appended execution-record section is an execution update",
  );
  return true;
};

const reassessments = (before, after, subject) => {
  const prefix = before.trimEnd();
  requireSamePlan(
    after.startsWith(prefix),
    "existing capability source changed",
  );
  const appended = after.slice(prefix.length);
  const headings = [
    ...appended.matchAll(
      /^## (WO-\d{3}) dated reassessment \((\d{4}-\d{2}-\d{2})\)\r?$/gm,
    ),
  ];
  requireSamePlan(
    headings.length > 0 &&
      !appended.slice(0, headings[0].index).trim() &&
      headings.length === (appended.match(/^#{1,2} /gm) ?? []).length,
    "capability additions must be appended dated reassessment sections",
  );
  const knownIds = new Set(subject.standard.capabilities.map(({ id }) => id));
  return headings.map((heading, i) => {
    const [, workOrderId, date] = heading;
    requireSamePlan(
      subject.orders.some((order) => order.workOrderId === workOrderId) &&
        Number.isFinite(Date.parse(`${date}T00:00:00.000Z`)) &&
        new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) === date,
      "capability reassessment needs a reviewed order and a valid date",
    );
    const body = appended.slice(heading.index, headings[i + 1]?.index);
    const ids = body.split(/\r?\n/u).flatMap((line) => {
      if (!line.startsWith("|")) return [];
      const cells = line.split("|").slice(1, -1);
      const id = cells[0]?.match(/`([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+)`/u)?.[1];
      if (!id) return [];
      requireSamePlan(knownIds.has(id), `new capability id ${id}`);
      requireSamePlan(
        Boolean(cells[1]?.trim()),
        `missing capability observation ${id}`,
      );
      return [id];
    });
    requireSamePlan(ids.length > 0, "empty capability reassessment");
    return { kind: "dated-capability-reassessment", workOrderId, date, ids };
  });
};

/**
 * Preserve v1 receipt identity. This is a continuation comparison, not another
 * refutation and not a normalization change to its historical subject.
 */
export function checkPlanContinuation(
  root,
  judged,
  current,
  { workspace = false } = {},
) {
  if (judged.hash === current.hash) return [];
  const original = committedReader(root, judged.revision);
  const observed = committedReader(root, current.revision);
  const read = workspace
    ? (path) => {
        requireSamePlan(
          containedRegularFile(join(root, path), root),
          `execution source is not a contained regular file: ${path}`,
        );
        return readFileSync(join(root, path), "utf8");
      }
    : observed.read;
  const orderPaths = new Set(judged.orders.map(({ path }) => path));
  // WO-126 installs missing-data declarations, not retrospective cost claims.
  // Only that exact header and the newly bound meter input may continue an old
  // receipt. New cost claims, criteria or sequence edits still need refutation.
  const adoptsCost =
    !judged.costTable &&
    Boolean(current.costTable) &&
    judged.orders.some(
      (order) =>
        order.workOrderId === "WO-126" &&
        order.criteria.some((criterion) =>
          criterion.text.includes("**Cost:**"),
        ),
    );
  const fixedInputs = (subject) =>
    subject.inputs.filter(
      ({ name }) =>
        !orderPaths.has(name) &&
        !name.startsWith("capability:") &&
        !(adoptsCost && name === "cost-table"),
    );
  requireSamePlan(
    same(fixedInputs(judged), fixedInputs(current)),
    "sequence, vision, roles or order inventory changed",
  );
  const updates = adoptsCost
    ? [
        {
          path: "docs/planning/cost-table.json",
          kind: "cost-contract-adoption",
          source: "WO-126 criterion 16",
          missingData:
            "Legacy costs remain unavailable and are judged by the next refutation",
        },
      ]
    : [];
  for (const { path, workOrderId } of judged.orders) {
    const before = original.read(path);
    let after = read(path);
    if (
      adoptsCost &&
      !before.includes(LEGACY_COST_HEADER) &&
      after.includes(LEGACY_COST_HEADER)
    ) {
      const end = after.indexOf("\n") + 1;
      requireSamePlan(
        after.slice(end).startsWith("\n" + LEGACY_COST_HEADER),
        "legacy cost header must follow the title",
      );
      after =
        after.slice(0, end) + after.slice(end + 1 + LEGACY_COST_HEADER.length);
      updates.push({
        path,
        workOrderId,
        kind: "unavailable-legacy-cost-declaration",
      });
    }
    if (before === after) continue;
    const assigned = releaseAssignment(before, after);
    if (assigned.version)
      updates.push({
        path,
        workOrderId,
        kind: "release-assignment",
        version: assigned.version,
      });
    if (executionAppendix(before, assigned.source))
      updates.push({ path, workOrderId, kind: "execution-record" });
  }
  const capabilityInputs = (subject) =>
    subject.inputs.filter(({ name }) => name.startsWith("capability:"));
  if (!same(capabilityInputs(judged), capabilityInputs(current))) {
    const before = original.read(capabilityPath);
    const after = read(capabilityPath);
    updates.push(
      ...reassessments(before, after, judged).map((update) => ({
        path: capabilityPath,
        ...update,
      })),
    );
  }
  requireSamePlan(updates.length > 0, "unclassified subject change");
  return updates.map((update) => ({
    ...update,
    judgedSourceHash: original.paths.includes(update.path)
      ? sha256(original.read(update.path))
      : null,
    currentSourceHash: sha256(read(update.path)),
  }));
}
