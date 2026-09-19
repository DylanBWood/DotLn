import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  committedReader,
  sha256,
  parsePlanOrder,
  planCostDeclaration,
} from "./plan-subject.mjs";
import { containedRegularFile } from "./paths.mjs";
import { LEGACY_COST_HEADER } from "./legacy-cost.mjs";
import { dependencyMigration } from "./plan-dependency-migration.mjs";

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

/** Bind the entire approved order, including existing execution records;
 * only the admitted release label is normalized. Later appendices are checked separately.
 */
export const executionAmendmentSource = (source) => {
  const normalized = source.replace(
    /^(# [^\r\n]+)\(v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\)(?=\r?\n|$)/u,
    "$1(version assigned at activation)",
  );
  return normalized.trimEnd();
};

export const reassessments = (before, after, subject) => {
  const prefix = before.trimEnd();
  requireSamePlan(
    after.startsWith(prefix),
    "existing capability source changed",
  );
  const appended = after.slice(prefix.length);
  const headings = [
    ...appended.matchAll(
      /^## (WO-\d{3}) dated (?:addition|reassessment) \((\d{4}-\d{2}-\d{2})\)\r?$/gm,
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
      requireSamePlan(
        Boolean(cells[1]?.trim()),
        `missing capability observation ${id}`,
      );
      return [id];
    });
    requireSamePlan(ids.length > 0, "empty capability reassessment");
    return {
      kind: ids.some((id) => !knownIds.has(id))
        ? "dated-capability-addition"
        : "dated-capability-reassessment",
      workOrderId,
      date,
      ids,
    };
  });
};

/** Repair an inherited in-place row edit without losing either assessment.
 * Before commit, the workspace must restore all judged bytes and move every
 * changed HEAD row, byte-for-byte, into an admitted dated appendix.
 */
export function capabilityHistoryRepair(before, committed, repaired, subject) {
  reassessments(before, repaired, subject);
  const oldLines = before.trimEnd().split(/\r?\n/u);
  const headLines = committed.trimEnd().split(/\r?\n/u);
  const appended = repaired.slice(before.trimEnd().length).split(/\r?\n/u);
  const rowId = (line) =>
    line.match(/^\|\s*`([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+)`[^|]*\|/u)?.[1];
  requireSamePlan(
    oldLines.length === headLines.length,
    "capability history repair cannot hide added or removed committed lines",
  );
  const ids = [];
  for (let i = 0; i < oldLines.length; i++) {
    if (oldLines[i] === headLines[i]) continue;
    const id = rowId(oldLines[i]);
    const preserved = appended.indexOf(headLines[i]);
    requireSamePlan(
      id && id === rowId(headLines[i]) && preserved >= 0,
      "capability history repair must preserve every changed committed row in a dated appendix",
    );
    appended.splice(preserved, 1);
    ids.push(id);
  }
  requireSamePlan(
    ids.length > 0,
    "capability history repair has no changed rows",
  );
  return {
    kind: "pending-capability-history-repair",
    ids,
    repairSourceHash: sha256(repaired),
  };
}

/**
 * Preserve v1 receipt identity. This is a continuation comparison, not another
 * refutation and not a normalization change to its historical subject.
 */
export function checkPlanContinuation(
  root,
  judged,
  current,
  {
    workspace = false,
    dispositions = [],
    amendments = [],
    allowCapabilityHistoryRepair = false,
  } = {},
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
        !(adoptsCost && name === "cost-table") &&
        !(judged.goalReview && ["goal-review", "cost-table"].includes(name)),
    );
  requireSamePlan(
    same(fixedInputs(judged), fixedInputs(current)),
    "sequence, vision, roles or order inventory changed",
  );
  if (judged.goalReview)
    requireSamePlan(
      current.goalReview &&
        [
          "platformStandard",
          "goalStandard",
          "criticalPath",
          "evidenceHash",
        ].every((key) => same(judged.goalReview[key], current.goalReview[key])),
      "observed evidence or goal standard changed",
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
  if (judged.goalReview && !same(judged.costTable, current.costTable))
    updates.push({
      path: "docs/planning/cost-table.json",
      kind: "cost-observation-metadata",
    });
  const migrateDependencies = dependencyMigration(judged, original, read);
  for (const { path, workOrderId } of judged.orders) {
    let before = original.read(path);
    let after = read(path);
    const amendment = amendments.find(
      (row) =>
        row.workOrderId === workOrderId &&
        row.sourceOrderHash === sha256(executionAmendmentSource(before)) &&
        row.orderHash ===
          sha256(executionAmendmentSource(after).slice(0, row.orderLength)),
    );
    if (amendment) {
      const normalized = executionAmendmentSource(after);
      requireSamePlan(
        amendment.orderLength <= normalized.length,
        "execution amendment approved length exceeds the current order source",
      );
      if (normalized.length !== amendment.orderLength)
        executionAppendix(
          normalized.slice(0, amendment.orderLength),
          normalized,
        );
      updates.push({
        path,
        workOrderId,
        kind: "authorized-execution-amendment",
        decisionId: amendment.decisionId,
      });
      continue;
    }
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
    if (
      judged.goalReview ||
      dispositions.some((row) => row.workOrderId === workOrderId)
    ) {
      const oldOrder = parsePlanOrder(before, path, workOrderId);
      const newOrder = parsePlanOrder(after, path, workOrderId);
      const textHash = (text) =>
        sha256(text?.normalize("NFKC").replace(/\s+/gu, " ").trim() ?? "");
      if (judged.goalReview) {
        const oldCost = planCostDeclaration(before),
          newCost = planCostDeclaration(after);
        if (oldCost !== newCost) {
          requireSamePlan(
            dispositions.some(
              (row) =>
                row.workOrderId === workOrderId &&
                row.sourceCostHash === sha256(oldCost) &&
                row.costHash === sha256(newCost) &&
                oldOrder.criteria.some(
                  (criterion) =>
                    criterion.id === row.criterionId &&
                    row.sourceCriterionHash === textHash(criterion.text),
                ) &&
                newOrder.criteria.some(
                  (criterion) =>
                    criterion.id === row.criterionId &&
                    row.criterionHash === textHash(criterion.text),
                ),
            ),
            "changed Cost declaration has no text-bound disposition",
          );
          if (oldCost) before = before.replace(oldCost, "");
          if (newCost) after = after.replace(newCost, "");
          updates.push({ path, workOrderId, kind: "disposed-cost" });
        }
      }
      requireSamePlan(
        oldOrder.criteria.length === newOrder.criteria.length,
        "criterion inventory changed",
      );
      for (const oldCriterion of oldOrder.criteria) {
        const newCriterion = newOrder.criteria.find(
          (row) => row.id === oldCriterion.id,
        );
        if (oldCriterion.text === newCriterion.text) continue;
        requireSamePlan(
          dispositions.some(
            (row) =>
              row.workOrderId === workOrderId &&
              row.criterionId === oldCriterion.id &&
              row.sourceCriterionHash === textHash(oldCriterion.text) &&
              row.criterionHash === textHash(newCriterion.text),
          ),
          `changed criterion has no text-bound disposition or authorized execution amendment: ${workOrderId} ${oldCriterion.id} (${path})`,
        );
        const start = after.indexOf("**Acceptance criteria");
        const target = after.indexOf(newCriterion.text, start);
        requireSamePlan(target >= start, "disposed criterion text not found");
        after =
          after.slice(0, target) +
          oldCriterion.text +
          after.slice(target + newCriterion.text.length);
        updates.push({
          path,
          workOrderId,
          kind: "disposed-criterion",
          criterionId: oldCriterion.id,
        });
      }
    }
    // Release preparation requires "patch." rather than the older
    // "patch, evidence-only." spelling. Admit only this exact presentation
    // correction; the axis and every following description byte stay judged.
    const legacyClassification = before.match(
      /^\*\*Release classification:\*\* (patch|minor|major), evidence-only\. A /m,
    );
    if (legacyClassification) {
      const canonical = after.match(
        /^\*\*Release classification:\*\* (patch|minor|major)\. Evidence-only: a /m,
      );
      if (canonical?.[1] === legacyClassification[1]) {
        after =
          after.slice(0, canonical.index) +
          legacyClassification[0] +
          after.slice(canonical.index + canonical[0].length);
        updates.push({
          path,
          workOrderId,
          kind: "release-classification-format",
        });
      }
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
    const migrated = migrateDependencies(
      before,
      assigned.source,
      path,
      workOrderId,
    );
    if (migrated.migrated)
      updates.push({
        path,
        workOrderId,
        kind: "typed-dependency-migration",
        source: "WO-043 criterion 5",
      });
    if (executionAppendix(before, migrated.source))
      updates.push({ path, workOrderId, kind: "execution-record" });
  }
  const capabilityInputs = (subject) =>
    subject.inputs.filter(({ name }) => name.startsWith("capability:"));
  if (!same(capabilityInputs(judged), capabilityInputs(current))) {
    const before = original.read(capabilityPath);
    const after = read(capabilityPath);
    let capabilityUpdates;
    try {
      capabilityUpdates = reassessments(before, after, judged);
    } catch (error) {
      if (workspace || !allowCapabilityHistoryRepair) throw error;
      requireSamePlan(
        containedRegularFile(join(root, capabilityPath), root),
        "capability history repair is not a contained regular file",
      );
      capabilityUpdates = [
        capabilityHistoryRepair(
          before,
          after,
          readFileSync(join(root, capabilityPath), "utf8"),
          judged,
        ),
      ];
    }
    updates.push(
      ...capabilityUpdates.map((update) => ({
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
