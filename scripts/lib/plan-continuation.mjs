import { docRelative } from "./config.mjs";
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import {
  committedReader,
  sha256,
  parsePlanOrder,
  planCostDeclaration,
  goalEvidenceHash,
  capabilityRows,
} from "./plan-subject.mjs";
import { containedRegularFile } from "./paths.mjs";
import { isCoreRoot } from "./harness-runtime.mjs";
import { LEGACY_COST_HEADER } from "./legacy-cost.mjs";
import { dependencyMigration } from "./plan-dependency-migration.mjs";
import {
  htmlComment,
  htmlCommentText,
  inlineSource,
  markdownHeadings,
  markdownNodes,
  markdownTables,
  parseMarkdown,
} from "./markdown-links.mjs";
import { readWorkOrder } from "./work-order-document.mjs";

const capabilityTable = (root) =>
  docRelative(root, "planning", "capability-table.md");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const requireSamePlan = (condition, reason) => {
  if (!condition)
    throw new Error(
      `planning pass needs a receipt matching the current subject: ${reason}`,
    );
};

// A work order's text is read through the work-order reader, which drops a
// leading byte-order mark: its offsets plus `shift` are offsets into the text
// as given, so every comparison and splice below stays on the source's bytes.
// Matching one amendment reads the same few texts several times, so the last
// readings are kept rather than parsed again.
const orderReadings = new Map();
const readOrder = (text) => {
  let reading = orderReadings.get(text);
  if (!reading) {
    const order = readWorkOrder(text);
    reading = { order, shift: text.length - order.source.length };
    orderReadings.set(text, reading);
    if (orderReadings.size > 8)
      orderReadings.delete(orderReadings.keys().next().value);
  }
  return reading;
};

// Every heading of a cited document, in any container, in document order,
// with the anchor its title takes: the parser's title text, spelled into the
// existing metadata fragment form, numbered when a stem repeats.
function citationHeadings(source) {
  const seen = new Map();
  return [...markdownNodes(parseMarkdown(source))]
    .filter((node) => node.type === "heading")
    .map((node) => {
      const title = inlineSource(source, node).trim();
      const stem = title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_\s-]/gu, "")
        .replace(/\s/g, "-");
      const ordinal = seen.get(stem) ?? 0;
      seen.set(stem, ordinal + 1);
      return {
        index: node.position.start.offset,
        level: node.depth,
        title,
        stem,
        anchor: `${stem}${ordinal ? `-${ordinal}` : ""}`,
      };
    });
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
  const directive = `\n${htmlComment("prettier-ignore")}\n`;
  return next && text.endsWith(directive)
    ? `${text.slice(0, -directive.length)}\n`
    : text;
}

function inlineLinks(
  source,
  { proveContent = false, start = 0, end = source.length } = {},
) {
  const result = [];
  const external = (href) => /^[a-z][a-z0-9+.-]*:|^\//iu.test(href);
  for (const node of markdownNodes(parseMarkdown(source))) {
    const within =
      node.position?.start.offset >= start && node.position?.end.offset <= end;
    if (
      proveContent &&
      within &&
      (/Reference$/u.test(node.type) ||
        node.type === "footnoteDefinition" ||
        (["image", "definition"].includes(node.type) && !external(node.url)) ||
        (node.type === "html" && htmlCommentText(node.value) === null))
    )
      throw new Error("unsupported context-dependent citation content");
    if (node.type === "link" && within) {
      const linkEnd = node.position.end.offset;
      const raw = source.slice(node.position.start.offset, linkEnd);
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
          start: linkEnd - node.url.length - 1,
          end: linkEnd - 1,
        });
    }
  }
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

// Whether a document is on the after side: in the working tree, or in the
// current revision the committed judgment reads; the judged revision's paths
// say nothing about it (round 2's design F9).
const afterPresence = (root, observed, workspace) => (file) =>
  workspace
    ? containedRegularFile(join(root, file), root)
    : observed.paths.includes(file);

function relocatedLinks(
  root,
  original,
  read,
  { workspace, path, complete = true, afterHas },
) {
  const product = docRelative(root, "product");
  const planning = docRelative(root, "planning");
  // An export may carry no product 00, which the subject builder reads as
  // optional by its explicit absence: with none on either side there is
  // nothing to relocate, and a page present on one side alone is a changed
  // input the caller judges. A read that fails for another reason refuses.
  const before = original.paths.includes(path) ? original.read(path) : null;
  const after = afterHas(path) ? read(path) : null;
  if (before === null && after === null) return { updates: [] };
  if (before === null || after === null) return null;
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
// A parenthesized version label ending a title, well formed or not.
const anyReleaseLabel = /\(v[^()]*\)$/u;
const activationPlaceholder = "(version assigned at activation)";

/** An order's title heading exactly as written, from its marker to the end
 * of its line, with its offsets in `text`; undefined when the work-order
 * reader finds no title. */
const writtenTitle = (text) => {
  const { order, shift } = readOrder(text);
  if (!order.title) return undefined;
  const start = order.title.start + shift;
  const end = order.title.end + shift;
  return { start, end, text: text.slice(start, end) };
};

const releaseAssignment = (before, after) => {
  const oldTitle = writtenTitle(before)?.text;
  const newTitle = writtenTitle(after);
  // A title filed without the placeholder (the 2026-09-25 pass, WO-158-D017)
  // admits the same single label, appended after one space. A judged label
  // admits one replacement: a collision retime is bookkeeping (WO-167-D013).
  const judgedLabel = oldTitle?.match(releaseLabel);
  const stem = oldTitle?.endsWith(activationPlaceholder)
    ? oldTitle.slice(0, -activationPlaceholder.length)
    : judgedLabel && oldTitle[judgedLabel.index - 1] === " "
      ? oldTitle.slice(0, judgedLabel.index)
      : oldTitle && !anyReleaseLabel.test(oldTitle)
        ? `${oldTitle} `
        : undefined;
  if (stem === undefined || !newTitle?.text.startsWith(stem))
    return { source: after, version: null };
  const version = newTitle.text.slice(stem.length);
  if (!new RegExp(`^${releaseLabel.source}`, "u").test(version))
    return { source: after, version: null };
  return {
    source:
      after.slice(0, newTitle.start) + oldTitle + after.slice(newTitle.end),
    version: version.slice(1, -1),
    from: judgedLabel ? judgedLabel[0].slice(1, -1) : null,
  };
};

const executionRecord = "Execution record";

// After the approved bytes an order may gain only execution-record sections,
// read in the whole document: only whitespace, then that section's heading
// with content under it, no other section at the order's top two levels, and
// no label of the order's own, which the work-order reader would take for
// the order's metadata: a bold phrase that opens a line of a top-level
// paragraph and declares a value by its colon or stands alone on its line.
// What the reader takes for text is admitted: a label a record writes in a
// list item, a quotation or a code block, and bold words that open a line
// and run on into their sentence.
const onlyExecutionRecords = (after, from) => {
  const { order, shift } = readOrder(after);
  const at = from - shift;
  const blocks = order.tree.children.filter(
    (node) => node.position.start.offset >= at,
  );
  const sections = markdownHeadings(order.source, order.tree).filter(
    (heading) => heading.start >= at && heading.depth <= 2,
  );
  return (
    sections.length > 0 &&
    blocks[0].position.start.offset === sections[0].start &&
    blocks.length > 1 &&
    !order.source.slice(at, sections[0].start).trim() &&
    sections.every(
      (heading) => heading.depth === 2 && heading.title === executionRecord,
    ) &&
    !order.labels.some((label) => label.start >= at)
  );
};

const executionAppendix = (before, after) => {
  const prefix = before.trimEnd();
  if (after.trimEnd() === prefix) return false;
  requireSamePlan(
    after.startsWith(prefix),
    "existing work-order bytes changed",
  );
  requireSamePlan(
    onlyExecutionRecords(after, prefix.length),
    "only an appended execution-record section is an execution update",
  );
  return true;
};

// Preserve the representation older amendments bound before grouping metadata
// was admitted. A label added to an unlabelled filed title normalizes back to
// that title; a title filed with a label keeps its placeholder representation.
const executionAmendmentReleaseSource = (source, filed) => {
  const filedTitle =
    filed === undefined ? undefined : writtenTitle(filed)?.text;
  const unlabelled =
    filedTitle !== undefined &&
    !filedTitle.endsWith(activationPlaceholder) &&
    !anyReleaseLabel.test(filedTitle);
  const title = writtenTitle(source);
  const label = title && releaseLabel.exec(title.text);
  if (!label) return source;
  // The title before its label, less the one space that may separate them.
  const head = title.text.slice(0, label.index);
  const space = head.endsWith(" ") ? " " : "";
  const stem = head.slice(0, head.length - space.length);
  const written = unlabelled
    ? stem === filedTitle && space === " "
      ? stem
      : title.text
    : `${stem}${space}${activationPlaceholder}`;
  return source.slice(0, title.start) + written + source.slice(title.end);
};

// Grouping is independent of the release-title representation. When the
// filed order declared no Workstream, remove the one leading Workstream field
// the current order adds, if it is exactly `WS-NNN` on a line of its own: the
// whole line with its line ending, every other byte as written.
const withoutAddedWorkstream = (source, filed) => {
  if (
    filed === undefined ||
    readOrder(filed).order.headerFields("Workstream").length
  )
    return source;
  const { order, shift } = readOrder(source);
  const added = order.headerFields("Workstream");
  if (added.length !== 1) return source;
  const [field] = added;
  const start = field.start + shift;
  const newline = source.indexOf("\n", start);
  const end = newline < 0 ? source.length : newline + 1;
  return field.raw === "Workstream:" &&
    /^WS-\d{3}$/u.test(field.value) &&
    source[start - 1] === "\n" &&
    /^ WS-\d{3}(?:\r?\n)?$/u.test(source.slice(field.valueStart + shift, end))
    ? source.slice(0, start) + source.slice(end)
    : source;
};

/** The order's Release classification header field as the work-order reader
 * reads it: `value` is its bytes after the label as written, from offset
 * `at` in `text`; undefined when the header declares none. */
const releaseClassification = (text) => {
  const { order, shift } = readOrder(text);
  const [field] = order.headerFields("Release classification");
  if (!field) return undefined;
  const at = field.valueStart + shift;
  return { at, value: text.slice(at, field.end + shift) };
};

/** Bind the entire approved order, including existing execution records;
 * normalize only the release label and an added leading Workstream field.
 * A field-only amendment retains its field so it remains bindable.
 * Later appendices are checked separately.
 */
export const executionAmendmentSource = (source, filed) => {
  const retained = executionAmendmentReleaseSource(source, filed);
  const normalized = withoutAddedWorkstream(retained, filed).trimEnd();
  // Writing must not erase the only change that requires authorization.
  return filed !== undefined &&
    normalized === executionAmendmentReleaseSource(filed).trimEnd()
    ? retained.trimEnd()
    : normalized;
};

function executionAmendmentMatch(before, after, row) {
  if (row.sourceOrderHash !== sha256(executionAmendmentSource(before)))
    return null;
  const retained = executionAmendmentReleaseSource(after, before);
  const current = withoutAddedWorkstream(retained, before).trimEnd();
  const boundPrefix = (source) =>
    row.orderLength <= source.length &&
    sha256(source.slice(0, row.orderLength)) === row.orderHash;
  // Reading accepts both field representations for each historical title
  // representation. It must not inherit the writer's field-only fallback.
  for (const source of [retained.trimEnd(), current])
    if (boundPrefix(source)) return { source, kind: "current" };
  // Historical activation rows normalized an appended label to a placeholder.
  // The old binding may have a later, strictly appended execution record.
  const legacyRetained = executionAmendmentReleaseSource(after);
  const legacy = [
    legacyRetained.trimEnd(),
    withoutAddedWorkstream(legacyRetained, before).trimEnd(),
  ].find(boundPrefix);
  if (legacy === undefined) return null;
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

const datedSection =
  /^(WO-\d{3}) dated (?:addition|reassessment) \((\d{4}-\d{2}-\d{2})\)$/u;

export const reassessments = (before, after, subject) => {
  const prefix = before.trimEnd();
  requireSamePlan(
    after.startsWith(prefix),
    "existing capability source changed",
  );
  // The appended bytes, read in the whole table document: every section at
  // its top two levels must be a dated section, the first after only
  // whitespace.
  const tree = parseMarkdown(after);
  const sections = markdownHeadings(after, tree).filter(
    (heading) => heading.start >= prefix.length && heading.depth <= 2,
  );
  const dated = sections.map((heading) =>
    heading.depth === 2 ? datedSection.exec(heading.title) : null,
  );
  requireSamePlan(
    sections.length > 0 &&
      dated.every(Boolean) &&
      !after.slice(prefix.length, sections[0].start).trim(),
    "capability additions must be appended dated reassessment sections",
  );
  const tables = markdownTables(after, tree);
  const knownIds = new Set(subject.standard.capabilities.map(({ id }) => id));
  return sections.map((heading, i) => {
    const [, workOrderId, date] = dated[i];
    requireSamePlan(
      subject.orders.some((order) => order.workOrderId === workOrderId) &&
        Number.isFinite(Date.parse(`${date}T00:00:00.000Z`)) &&
        new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) === date,
      "capability reassessment needs a reviewed order and a valid date",
    );
    const end = sections[i + 1]?.start ?? after.length;
    const ids = capabilityRows(
      tables.filter(
        (table) => table.start >= heading.start && table.start < end,
      ),
    ).map((row) => {
      requireSamePlan(
        Boolean(row.cells[1]),
        `missing capability observation ${row.id}`,
      );
      return row.id;
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

/** The capability id of each row of a capability table, by the row's
 * one-based line. */
const capabilityRowIds = (source) =>
  new Map(
    capabilityRows(markdownTables(source)).map((row) => [row.line, row.id]),
  );

/** Repair an inherited in-place row edit without losing either assessment.
 * Before commit, the workspace must restore all judged bytes and move every
 * changed HEAD row, byte-for-byte, into an admitted dated appendix.
 */
export function capabilityHistoryRepair(before, committed, repaired, subject) {
  reassessments(before, repaired, subject);
  const oldLines = before.trimEnd().split(/\r?\n/u);
  const headLines = committed.trimEnd().split(/\r?\n/u);
  const appended = repaired.slice(before.trimEnd().length).split(/\r?\n/u);
  const oldIds = capabilityRowIds(before);
  const headIds = capabilityRowIds(committed);
  requireSamePlan(
    oldLines.length === headLines.length,
    "capability history repair cannot hide added or removed committed lines",
  );
  const ids = [];
  for (let i = 0; i < oldLines.length; i++) {
    if (oldLines[i] === headLines[i]) continue;
    const id = oldIds.get(i + 1);
    const preserved = appended.indexOf(headLines[i]);
    requireSamePlan(
      id && id === headIds.get(i + 1) && preserved >= 0,
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
  // Order WO-126 installs missing-data declarations, not retrospective cost
  // claims. Only that exact header and the newly bound meter input may
  // continue an old receipt. New cost claims, criteria or sequence edits still
  // need refutation.
  const adoptsCost =
    isCoreRoot(root) &&
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
  const writebackUpdates = [];
  const authorizedAfter = fixedAfter.map((input) => {
    if (input.name !== "vision:the-one-paragraph-story") return input;
    const before = fixedBefore.find((row) => row.name === input.name);
    if (same(before, input)) return input;
    for (const amendment of amendments) {
      const order = judged.orders.find(
        (row) => row.workOrderId === amendment.workOrderId,
      );
      if (
        !order ||
        !matchesExecutionAmendment(
          original.read(order.path),
          read(order.path),
          amendment,
        )
      )
        continue;
      for (const writeback of amendment.executionWritebacks ?? []) {
        if (
          writeback.path !== docRelative(root, "product", "00-vision.md") ||
          writeback.section !== "The one-paragraph story" ||
          writeback.sourceHash !== before?.hash ||
          writeback.acceptedHash !== input.hash
        )
          continue;
        const criterion = current.orders
          .find((row) => row.workOrderId === amendment.workOrderId)
          ?.criteria.find((row) => row.id === writeback.criterionId);
        const reviewed = order.criteria.find(
          (row) => row.id === writeback.criterionId,
        );
        requireSamePlan(
          criterion &&
            reviewed &&
            sha256(reviewed.text) === writeback.criterionHash &&
            sha256(criterion.text) === writeback.criterionHash,
          "execution writeback requires its unchanged reviewed criterion",
        );
        writebackUpdates.push({
          path: writeback.path,
          section: writeback.section,
          workOrderId: amendment.workOrderId,
          decisionId: amendment.decisionId,
          kind: "authorized-execution-writeback",
        });
        return before;
      }
    }
    return input;
  });
  const relocationRead = (path) => {
    const source = read(path);
    if (!writebackUpdates.some((update) => update.path === path)) return source;
    const before = original.read(path);
    const range = (text) => {
      const headings = citationHeadings(text);
      const matches = headings.filter(
        (heading) => heading.title === "The one-paragraph story",
      );
      requireSamePlan(
        matches.length === 1,
        "execution writeback story heading is ambiguous",
      );
      const heading = matches[0];
      const next = headings.find(
        (candidate) =>
          candidate.index > heading.index && candidate.level <= heading.level,
      );
      return [heading.index, next?.index ?? text.length];
    };
    const [start, end] = range(source),
      [oldStart, oldEnd] = range(before);
    // acceptedHash was checked above. Restore exactly this authorized section;
    // every other byte still has to pass the ordinary complete relocation proof.
    return (
      source.slice(0, start) +
      before.slice(oldStart, oldEnd) +
      source.slice(end)
    );
  };
  const relocation = same(fixedBefore, authorizedAfter)
    ? { updates: [] }
    : relocatedLinks(root, original, relocationRead, {
        workspace,
        path: docRelative(root, "product", "00-vision.md"),
        afterHas: afterPresence(root, observed, workspace),
      });
  const linkUpdates = relocation?.updates ?? null;
  requireSamePlan(
    linkUpdates !== null &&
      same(
        fixedBefore,
        authorizedAfter.map((input, index) =>
          input.name.startsWith("vision:") &&
          input.name === fixedBefore[index]?.name &&
          linkUpdates.length
            ? fixedBefore[index]
            : input,
        ),
      ),
    "sequence, vision, roles or order inventory changed",
  );
  if (judged.goalReview) {
    // The exact authorized story was already checked above. Normalize only
    // that thesis when comparing evidence; new observations still need review.
    const standard = writebackUpdates.length
      ? {
          ...current.standard,
          theses: current.standard.theses.map((thesis) =>
            thesis.id === "the-one-paragraph-story"
              ? judged.standard.theses.find((row) => row.id === thesis.id)
              : thesis,
          ),
        }
      : current.standard;
    requireSamePlan(
      current.goalReview &&
        ["platformStandard", "goalStandard", "criticalPath"].every((key) =>
          same(judged.goalReview[key], current.goalReview[key]),
        ),
      "observed evidence or goal standard changed",
    );
    requireSamePlan(
      judged.goalReview.evidenceHash ===
        goalEvidenceHash(standard, current.goalReview.observations),
      "observed evidence or goal standard changed",
    );
  }
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
  updates.push(...writebackUpdates);
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
      // The header follows the title's line and one blank line.
      const title = writtenTitle(after);
      const end = title ? after.indexOf("\n", title.end) + 1 : 0;
      requireSamePlan(
        title !== undefined &&
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
        // The disposed text is replaced where the order's acceptance criteria
        // field holds it, never in the prose before that field.
        const { order: current, shift } = readOrder(after);
        const criteria = current.labels.find((field) =>
          field.label.startsWith("Acceptance criteria"),
        );
        const target = criteria
          ? after.indexOf(newCriterion.text, criteria.start + shift)
          : -1;
        requireSamePlan(target >= 0, "disposed criterion text not found");
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
    const legacyClassification = releaseClassification(before)?.value.match(
      /^ (patch|minor|major), evidence-only\. (An?) /u,
    );
    if (legacyClassification) {
      const declared = releaseClassification(after);
      const canonical = declared?.value.match(
        /^ (patch|minor|major)\. Evidence-only(?:: (an?) |\. (An?) )/u,
      );
      if (
        canonical?.[1] === legacyClassification[1] &&
        (canonical[2] ?? canonical[3]).toLowerCase() ===
          legacyClassification[2].toLowerCase()
      ) {
        after =
          after.slice(0, declared.at) +
          legacyClassification[0] +
          after.slice(declared.at + canonical[0].length);
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
      afterHas: afterPresence(root, observed, workspace),
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
