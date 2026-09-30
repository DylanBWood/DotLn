import { docRelative } from "./config.mjs";
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import {
  committedReader,
  sha256,
  parsePlanOrder,
  planCostDeclaration,
} from "./plan-subject.mjs";
import { containedRegularFile } from "./paths.mjs";
import { LEGACY_COST_HEADER } from "./legacy-cost.mjs";
import { dependencyMigration } from "./plan-dependency-migration.mjs";
import { parsers } from "prettier/plugins/markdown.mjs";

const capabilityTable = (root) =>
  docRelative(root, "planning", "capability-table.md");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const requireSamePlan = (condition, reason) => {
  if (!condition)
    throw new Error(
      `planning pass needs a receipt matching the current subject: ${reason}`,
    );
};

// Parse headings rather than treating heading-like code as section boundaries.
// Keep the existing metadata fragment spelling; unsupported forms refuse proof.
function citationHeadings(source) {
  const headings = [];
  const seen = new Map();
  const visit = (node) => {
    if (node.type === "heading") {
      const index = node.position.start.offset;
      const line = source.slice(index).split("\n", 1)[0];
      const match = /^#{1,6} (.+?)[ \t]*#*[ \t]*$/u.exec(line);
      if (!match) throw new Error("unsupported citation heading");
      const title = match[1];
      const stem = title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_\s-]/gu, "")
        .replace(/\s/g, "-");
      const ordinal = seen.get(stem) ?? 0;
      seen.set(stem, ordinal + 1);
      headings.push({
        index,
        level: node.depth,
        title,
        stem,
        anchor: `${stem}${ordinal ? `-${ordinal}` : ""}`,
      });
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(parsers.markdown.parse(source));
  return headings;
}

// A moved citation preserves the citing prose and cited content. Only proved
// relative-link rebasing is allowed; historical subject hashes stay put.
function citedSection(source, anchor) {
  const headings = citationHeadings(source);
  const index = headings.findIndex((row) => row.anchor === anchor);
  if (index < 0) return null;
  const heading = headings[index];
  if (headings.filter((row) => row.stem === heading.stem).length !== 1)
    return null;
  const next = headings
    .slice(index + 1)
    .find((row) => row.level <= heading.level);
  const text = source.slice(heading.index, next?.index ?? source.length);
  // References can be defined outside this section. Check their full-document
  // parse context before comparing the extracted text on its own.
  inlineLinks(source, {
    proveContent: true,
    start: heading.index,
    end: heading.index + text.length,
  });
  // This exact trailing directive formats the following heading, not this
  // section. Preserve every other comment and every content byte.
  return next ? text.replace(/\n<!-- prettier-ignore -->\n$/u, "\n") : text;
}

function inlineLinks(
  source,
  { proveContent = false, start = 0, end = source.length } = {},
) {
  const result = [];
  const visit = (node) => {
    const within =
      node.position?.start.offset >= start && node.position?.end.offset <= end;
    const external = (href) => /^[a-z][a-z0-9+.-]*:|^\//iu.test(href);
    if (
      proveContent &&
      within &&
      (/Reference$/u.test(node.type) ||
        node.type === "footnoteDefinition" ||
        (["image", "definition"].includes(node.type) && !external(node.url)) ||
        (node.type === "html" &&
          !/^<!--(?:(?!-->)[\s\S])*-->$/u.test(node.value)))
    )
      throw new Error("unsupported context-dependent citation content");
    if (node.type === "link" && within) {
      const end = node.position.end.offset;
      const raw = source.slice(node.position.start.offset, end);
      const supported = raw.endsWith(`](${node.url})`);
      if (
        proveContent &&
        !external(node.url) &&
        (!supported ||
          !node.url ||
          node.url.startsWith("#") ||
          node.url.includes("?"))
      )
        throw new Error("unsupported relative citation link");
      if (supported)
        result.push({
          href: node.url,
          start: end - node.url.length - 1,
          end: end - 1,
        });
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(parsers.markdown.parse(source));
  return result;
}

function replaceDestinations(source, changes) {
  for (const change of [...changes].sort((a, b) => b.start - a.start))
    source =
      source.slice(0, change.start) + change.href + source.slice(change.end);
  return source;
}

function sectionContent(root, file, source) {
  const changes = inlineLinks(source, { proveContent: true }).flatMap(
    (link) => {
      if (/^[a-z][a-z0-9+.-]*:|^\//iu.test(link.href)) return [];
      const [pathname, ...fragments] = link.href.split("#");
      const target = relative(
        root,
        resolve(root, dirname(file), decodeURIComponent(pathname)),
      );
      return [
        {
          ...link,
          href: `${target}${fragments.length ? `#${fragments.join("#")}` : ""}`,
        },
      ];
    },
  );
  return replaceDestinations(source, changes);
}

function relocatedLinks(
  root,
  original,
  read,
  { workspace, path, complete = true },
) {
  const product = docRelative(root, "product");
  const planning = docRelative(root, "planning");
  const before = original.read(path);
  const after = read(path);
  const left = inlineLinks(before);
  const right = inlineLinks(after);
  if (right.length < left.length || (complete && left.length !== right.length))
    return null;
  const changes = [];
  const updates = [];
  const target = (href, prefix) => {
    const match = /^([^?#]+\.md)#([^?#]+)$/u.exec(href);
    if (!match || /^[a-z][a-z0-9+.-]*:|^\//iu.test(match[1])) return null;
    const file = relative(
      root,
      resolve(root, dirname(path), decodeURIComponent(match[1])),
    );
    if (!file.startsWith(`${prefix}/`)) return null;
    return { file, anchor: decodeURIComponent(match[2]) };
  };
  try {
    for (const [index, link] of left.entries()) {
      const replacement = right[index].href;
      if (link.href === replacement) continue;
      const from = target(link.href, product);
      const to = target(replacement, planning);
      if (!from || !to || from.anchor !== to.anchor) return null;
      if (
        workspace &&
        ![from.file, to.file].every((file) =>
          containedRegularFile(
            join(root, file),
            resolve(root, file === to.file ? planning : product),
          ),
        )
      )
        return null;
      const oldSection = citedSection(original.read(from.file), from.anchor);
      const newSection = citedSection(read(to.file), to.anchor);
      if (
        oldSection === null ||
        newSection === null ||
        sectionContent(root, from.file, oldSection) !==
          sectionContent(root, to.file, newSection) ||
        citationHeadings(read(from.file)).some(
          ({ anchor }) => anchor === from.anchor,
        ) ||
        (original.paths.includes(to.file) &&
          citationHeadings(original.read(to.file)).some(
            ({ anchor }) => anchor === to.anchor,
          ))
      )
        return null;
      // Be deliberately conservative about syntax: an ordinary inline link
      // destination must account for every changed byte of the vision source.
      changes.push({ ...right[index], href: link.href });
      updates.push({
        path,
        kind: "relocated-planning-link",
        from: link.href,
        to: replacement,
        targetSectionHash: sha256(oldSection),
        currentTargetSectionHash: sha256(newSection),
        targetContentHash: sha256(sectionContent(root, from.file, oldSection)),
      });
    }
  } catch {
    return null;
  }
  const restored = replaceDestinations(after, changes);
  return updates.length &&
    (complete ? restored === before : restored.startsWith(before.trimEnd()))
    ? { source: restored, updates }
    : null;
}

const releaseLabel = /\(v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\)$/u;
const releaseAssignment = (before, after) => {
  const oldTitle = before.match(/^# [^\r\n]+/u)?.[0];
  const newTitle = after.match(/^# [^\r\n]+/u)?.[0];
  const placeholder = "(version assigned at activation)";
  // A title filed without the placeholder (the 2026-09-25 pass, WO-158-D017)
  // admits the same single label, appended after one space. A judged label
  // admits one replacement: a collision retime is bookkeeping (WO-167-D013).
  const judgedLabel = oldTitle?.match(releaseLabel);
  const stem = oldTitle?.endsWith(placeholder)
    ? oldTitle.slice(0, -placeholder.length)
    : judgedLabel && oldTitle[judgedLabel.index - 1] === " "
      ? oldTitle.slice(0, judgedLabel.index)
      : oldTitle && !/\(v[^()]*\)$/u.test(oldTitle)
        ? `${oldTitle} `
        : undefined;
  if (stem === undefined || !newTitle?.startsWith(stem))
    return { source: after, version: null };
  const version = newTitle.slice(stem.length);
  if (!new RegExp(`^${releaseLabel.source}`, "u").test(version))
    return { source: after, version: null };
  return {
    source: oldTitle + after.slice(newTitle.length),
    version: version.slice(1, -1),
    from: judgedLabel ? judgedLabel[0].slice(1, -1) : null,
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
 * only the admitted release label is normalized. Later appendices are checked
 * separately. Given the filed source, a label appended to a title filed with
 * neither placeholder nor label (WO-158-D017) normalizes back to that title.
 */
export const executionAmendmentSource = (source, filed) => {
  const filedTitle = filed?.match(/^# [^\r\n]+/u)?.[0];
  const unlabelled =
    filedTitle !== undefined &&
    !filedTitle.endsWith("(version assigned at activation)") &&
    !/\(v[^()]*\)$/u.test(filedTitle);
  const normalized = source.replace(
    /^(# [^\r\n]+?)( ?)\(v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\)(?=\r?\n|$)/u,
    (whole, title, space) =>
      unlabelled
        ? title === filedTitle && space === " "
          ? title
          : whole
        : `${title}${space}(version assigned at activation)`,
  );
  return normalized.trimEnd();
};

function executionAmendmentMatch(before, after, row) {
  if (row.sourceOrderHash !== sha256(executionAmendmentSource(before)))
    return null;
  const current = executionAmendmentSource(after, before);
  if (
    row.orderLength <= current.length &&
    sha256(current.slice(0, row.orderLength)) === row.orderHash
  )
    return { source: current, kind: "current" };
  // Historical activation rows normalized an appended label to a placeholder.
  // The old binding may have a later, strictly appended execution record.
  const legacy = executionAmendmentSource(after);
  if (
    row.orderLength > legacy.length ||
    sha256(legacy.slice(0, row.orderLength)) !== row.orderHash
  )
    return null;
  const filed = executionAmendmentSource(before);
  if (!current.startsWith(filed)) return null;
  try {
    if (current.length !== filed.length) executionAppendix(filed, current);
    if (legacy.length !== row.orderLength)
      executionAppendix(legacy.slice(0, row.orderLength), legacy);
  } catch {
    return null;
  }
  return { source: legacy, kind: "legacy" };
}

export function matchesExecutionAmendment(before, after, row) {
  return executionAmendmentMatch(before, after, row) !== null;
}

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
  const fixedBefore = fixedInputs(judged);
  const fixedAfter = fixedInputs(current);
  const relocation = same(fixedBefore, fixedAfter)
    ? { updates: [] }
    : relocatedLinks(root, original, read, {
        workspace,
        path: docRelative(root, "product", "00-vision.md"),
      });
  const linkUpdates = relocation?.updates ?? null;
  requireSamePlan(
    linkUpdates !== null &&
      same(
        fixedBefore,
        fixedAfter.map((input, index) =>
          input.name.startsWith("vision:") &&
          input.name === fixedBefore[index]?.name &&
          linkUpdates.length
            ? fixedBefore[index]
            : input,
        ),
      ),
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
          path: docRelative(root, "planning", "cost-table.json"),
          kind: "cost-contract-adoption",
          source: "WO-126 criterion 16",
          missingData:
            "Legacy costs remain unavailable and are judged by the next refutation",
        },
      ]
    : [];
  updates.push(...linkUpdates);
  if (judged.goalReview && !same(judged.costTable, current.costTable))
    updates.push({
      path: docRelative(root, "planning", "cost-table.json"),
      kind: "cost-observation-metadata",
    });
  const migrateDependencies = dependencyMigration(root, judged, original, read);
  for (const { path, workOrderId } of judged.orders) {
    let before = original.read(path);
    let after = read(path);
    const amendment = amendments.find(
      (row) =>
        row.workOrderId === workOrderId &&
        matchesExecutionAmendment(before, after, row),
    );
    if (amendment) {
      const normalized = executionAmendmentMatch(
        before,
        after,
        amendment,
      ).source;
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
    // correction, including A/An and colon/sentence presentation; the axis,
    // article identity and every following description byte stay judged.
    const legacyClassification = before.match(
      /^\*\*Release classification:\*\* (patch|minor|major), evidence-only\. (An?) /m,
    );
    if (legacyClassification) {
      const canonical = after.match(
        /^\*\*Release classification:\*\* (patch|minor|major)\. Evidence-only(?:: (an?) |\. (An?) )/m,
      );
      if (
        canonical?.[1] === legacyClassification[1] &&
        (canonical[2] ?? canonical[3]).toLowerCase() ===
          legacyClassification[2].toLowerCase()
      ) {
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
        ...(assigned.from
          ? { kind: "release-retiming", from: assigned.from }
          : { kind: "release-assignment" }),
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
    const before = original.read(capabilityTable(root));
    const after = read(capabilityTable(root));
    const relocation = relocatedLinks(root, original, read, {
      workspace,
      path: capabilityTable(root),
      complete: false,
    });
    let capabilityUpdates;
    try {
      capabilityUpdates = reassessments(
        before,
        relocation?.source ?? after,
        judged,
      );
    } catch (error) {
      if (workspace || !allowCapabilityHistoryRepair) throw error;
      requireSamePlan(
        containedRegularFile(join(root, capabilityTable(root)), root),
        "capability history repair is not a contained regular file",
      );
      capabilityUpdates = [
        capabilityHistoryRepair(
          before,
          after,
          readFileSync(join(root, capabilityTable(root)), "utf8"),
          judged,
        ),
      ];
    }
    if (relocation) updates.push(...relocation.updates);
    updates.push(
      ...capabilityUpdates.map((update) => ({
        path: capabilityTable(root),
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
