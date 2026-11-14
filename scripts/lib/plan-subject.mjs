import { sha256Hex } from "./helpers.mjs";
import {
  historicalDependencyIds,
  historicalDependencyIdsAt,
} from "./dependencies.mjs";
export { sha256Hex } from "./helpers.mjs";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { parseWorkstreamDocument } from "./work-order-workstream.mjs";
import { join } from "node:path";
import { parseHeader, parseSequence } from "../work-orders.mjs";
import { readControl } from "./control-store.mjs";
import { readGitObjectsInBatches, runGit } from "./git.mjs";
import { containedRegularFile } from "./paths.mjs";
import { hasPackageSources } from "../../packages/skeleton/src/runtime-inputs.mjs";
import { defaultDocRelative, docRelative, rootPattern } from "./config.mjs";
import {
  htmlComment,
  inlineSource,
  markdownCodeSpans,
  markdownComments,
  markdownListItems,
  markdownMarkerBlocks,
  markdownNodes,
  markdownSections,
  markdownTables,
  parseMarkdown,
} from "./markdown-links.mjs";
import { readWorkOrder, refuseUnreadList } from "./work-order-document.mjs";
import { readVision, VISION_EXCLUSIONS_TITLE } from "./vision-document.mjs";
import { ledgerSections } from "../lineage.mjs";

// Default-layout names for peers that hold no launchpad; `planPaths` resolves
// the same documents under a launchpad's configured roots.
export const PLAN_MAP = defaultDocRelative("planning", "sequence.md");
export const PLAN_LEDGER = defaultDocRelative("lineage", "idea-ledger.md");
export const planPaths = (root) => ({
  map: docRelative(root, "planning", "sequence.md"),
  ledger: docRelative(root, "lineage", "idea-ledger.md"),
});
export const THESIS_HEADINGS = [
  ["the-one-paragraph-story", "The one-paragraph story"],
  ["the-core-bet", "The core bet"],
  ["the-differentiated-interface", "The differentiated interface"],
  ["three-horizons-one-kernel", "Three horizons, one kernel"],
  [
    "mission--increase-the-chance-of-operator-flow",
    "Mission — increase the chance of operator flow",
  ],
];
export const sha256 = (value) => `sha256:${sha256Hex(value)}`;

// Length framing is supplied by JSON's string encoding. No whitespace folding
// occurs before hashing source bytes. A revision id is provenance, not identity.
export const hashParts = (parts) => sha256(JSON.stringify(parts));

// Activation changes only the release-label parenthetical. Preserve legacy
// receipt hashes while comparing their substantive order content canonically.
export const planOrderHash = (order, { legacy = false } = {}) =>
  hashParts([
    order.workOrderId,
    legacy
      ? order.title
      : order.title?.replace(
          / \((?:version assigned at activation|v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))\)$/u,
          "",
        ),
    order.objective,
    order.criteria,
    order.nonGoals,
    ...(Object.hasOwn(order, "cost") ? [order.cost] : []),
  ]);
export const carriedOrderHashMatches = (order, previous, recorded) =>
  Boolean(
    order &&
    previous &&
    planOrderHash(order) === planOrderHash(previous) &&
    [
      planOrderHash(order),
      planOrderHash(order, { legacy: true }),
      planOrderHash(previous, { legacy: true }),
    ].includes(recorded),
  );

const TREE_CACHE_LIMIT = 64;
const BLOB_CACHE_LIMIT = 2048;
const BLOB_BATCH_LIMIT = 32;
const treeCache = new Map();
const blobCache = new Map();
const cached = (cache, key) => {
  if (!cache.has(key)) return undefined;
  const value = cache.get(key);
  cache.delete(key);
  cache.set(key, value);
  return value;
};
const retain = (cache, key, value, limit) => {
  cache.delete(key);
  cache.set(key, value);
  while (cache.size > limit) cache.delete(cache.keys().next().value);
  return value;
};
// Combined payloads can exceed Git's fixed output buffer even when each
// object fits, so the read retries smaller batches; singleton failures
// still propagate.
const readBlobBatch = (root, oids) =>
  new Map(
    [...readGitObjectsInBatches(root, oids, "blob")].map(([oid, bytes]) => [
      oid,
      bytes.toString("utf8"),
    ]),
  );

const committedTree = (root, revision) => {
  // Reuse only full ids already resolved as commits in this root. An unseen
  // full id can name an annotated tag and must still be peeled to its commit.
  // HEAD, branches, tags and revision expressions resolve afresh.
  const knownTree = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/u.test(revision)
    ? cached(treeCache, `${root}\0${revision}`)
    : undefined;
  const commit = knownTree
    ? revision
    : runGit(root, ["rev-parse", "--verify", `${revision}^{commit}`]);
  const treeKey = `${root}\0${commit}`;
  const entries =
    knownTree ??
    cached(treeCache, treeKey) ??
    retain(
      treeCache,
      treeKey,
      new Map(
        runGit(root, ["ls-tree", "-rz", commit], { trim: false })
          .split("\0")
          .filter(Boolean)
          .map((entry) => {
            const [meta, path] = entry.split("\t");
            const [mode, type, oid] = meta.split(" ");
            return [path, { mode, type, oid }];
          }),
      ),
      TREE_CACHE_LIMIT,
    );
  return { commit, entries };
};
const requireBlob = (entries, path) => {
  const entry = entries.get(path);
  if (
    !entry ||
    entry.type !== "blob" ||
    !["100644", "100755"].includes(entry.mode)
  )
    throw new Error(`plan subject requires a committed regular file: ${path}`);
  return entry.oid;
};
const readBlobs = (root, requested) => {
  const sources = new Map();
  const misses = new Map();
  for (const oid of new Set(requested)) {
    const key = `${root}\0${oid}`;
    const source = cached(blobCache, key);
    if (source === undefined) misses.set(oid, key);
    else sources.set(oid, source);
  }
  const oids = [...misses.keys()];
  for (let offset = 0; offset < oids.length; offset += BLOB_BATCH_LIMIT) {
    const batch = oids.slice(offset, offset + BLOB_BATCH_LIMIT);
    for (const [oid, source] of readBlobBatch(root, batch)) {
      sources.set(oid, source);
      retain(blobCache, misses.get(oid), source, BLOB_CACHE_LIMIT);
    }
  }
  return sources;
};

export const committedReader = (root, revision = "HEAD") => {
  const { commit, entries } = committedTree(root, revision);
  const readMany = (paths) => {
    const requested = [...new Set(paths)].map((path) => [
      path,
      requireBlob(entries, path),
    ]);
    const sources = readBlobs(
      root,
      requested.map(([, oid]) => oid),
    );
    return new Map(requested.map(([path, oid]) => [path, sources.get(oid)]));
  };
  return {
    revision: commit,
    paths: [...entries.keys()],
    readMany,
    read(path) {
      return readMany([path]).get(path);
    },
  };
};

// Hints populate only the existing bounded immutable cache. They grant no
// validity: callers must still construct and compare the canonical subjects.
export const prefetchCommittedSources = (root, requests) => {
  try {
    const oids = requests.flatMap(({ revision, paths }) => {
      const { entries } = committedTree(root, revision);
      return paths.flatMap((path) => {
        const entry = entries.get(path);
        return entry?.type === "blob" &&
          ["100644", "100755"].includes(entry.mode)
          ? [entry.oid]
          : [];
      });
    });
    readBlobs(root, oids);
  } catch {
    // Hints may be stale, malformed or unreadable. Canonical consumers still
    // read and validate required sources, preserving their original refusals.
  }
};

// The subject reads every document through the pinned Markdown parser, and
// each projection keeps the bytes the subject has always bound, so a receipt
// rebuilt at its revision still matches what it judged.

// A document's sections, each with its `text`: its heading and the body under
// it up to the next heading at its level or shallower, as written.
const sectionsOf = (source, tree = parseMarkdown(source)) =>
  markdownSections(source, tree).map((row) => ({
    ...row,
    text: source.slice(row.start, row.bodyEnd),
  }));

/** The one level-2 section titled `title` among `sections`. */
const oneSection = (sections, title) => {
  const found = sections.filter(
    (row) => row.depth === 2 && row.title === title,
  );
  if (found.length !== 1)
    throw new Error(`expected exactly one section: ${title}`);
  return found[0];
};

/** The one label of the order whose words begin with `label`, with the block
 * it leads: where that block ends and its text. */
const field = (order, label) => {
  const found = order.labels.filter((row) => row.raw.startsWith(label));
  if (found.length !== 1) throw new Error(`expected one ${label} field`);
  const { end, body } = order.block(found[0]);
  return { ...found[0], blockEnd: end, text: body.trim() };
};

// Judged order text reads a CRLF line break as LF, so an order's line
// endings never change what was judged.
const judgedText = (text) => text.replaceAll("\r\n", "\n");

// The offset just past the line break that ends the line holding `offset`.
const lineEnd = (source, offset) => {
  const at = source.indexOf("\n", offset);
  return at < 0 ? source.length : at + 1;
};

/** Exact Cost declaration bytes, including its trailing separator. Absence is
 * an empty block, so adding or removing only this field can be disposed. */
export const planCostDeclaration = (source) => {
  const order = readWorkOrder(source);
  const found = order.labels.filter((row) => row.raw === "Cost:");
  if (!found.length) return "";
  if (found.length !== 1) throw new Error("expected one Cost: field");
  return order.source.slice(found[0].start, order.block(found[0]).end);
};

/** The numbered items of an order's criteria between two offsets, each with
 * its start in `source`. A wrapped line that opens with an HTML tag name
 * ends the list where Markdown reads it: the tag opens a raw block that runs
 * to the next blank line and holds the items after it. A receipt filed while
 * criteria were read by line holds those items, and its subject is rebuilt
 * from the same committed text, so the list is read on from the first line
 * of that raw block at which the numbering resumes. Nothing here reads a
 * line by pattern: each candidate line is handed to the parser. */
function numberedCriteria(source, tree, from, to) {
  const numbered = (text, parsed, base) =>
    markdownListItems(text, parsed)
      .filter(
        (item) =>
          item.ordered &&
          item.marker.endsWith(".") &&
          base + item.start > from &&
          base + item.start < to,
      )
      .map((item) => ({ ...item, start: base + item.start }));
  const read = (text, parsed, base) => {
    const items = numbered(text, parsed, base);
    const last = items.at(-1);
    if (!last) return items;
    const raw = [...markdownNodes(parsed)].find(
      (node) =>
        node.type === "html" &&
        base + node.position.start.offset > last.start &&
        base + node.position.start.offset < to,
    );
    if (!raw) return items;
    const rawEnd = base + raw.position.end.offset;
    for (
      let at = source.indexOf("\n", base + raw.position.start.offset);
      at >= 0 && at < rawEnd;
      at = source.indexOf("\n", at + 1)
    ) {
      const rest = source.slice(at + 1, to);
      const resumed = read(rest, parseMarkdown(rest), at + 1);
      if (
        resumed[0]?.start === at + 1 &&
        resumed[0].written === last.written + 1
      )
        return [...items, ...resumed];
    }
    return items;
  };
  return read(source, tree, 0);
}

/** An order's judged parts. `filing` is set where the subject is read from
 * the working tree, as a pass files or checks its orders: there a criteria
 * list the parser reads as shorter than written is refused, as the
 * lifecycle's reader refuses it. A subject rebuilt from a committed revision
 * for a stored receipt reads such a list on, as it was filed. */
export const parsePlanOrder = (
  source,
  path,
  workOrderId,
  { includeCost = false, historicalIds = new Set(), filing = false } = {},
) => {
  const { title } = parseHeader(source, path, { historicalIds });
  if (!title.startsWith(`${workOrderId} — `))
    throw new Error(`order title/id mismatch: ${path}`);
  const order = readWorkOrder(source);
  // Each criterion is a numbered item under its label, with everything up to
  // the next numbered item or the label's end; the list opens the label's
  // text and counts from one as written.
  const criteriaField = field(order, "Acceptance criteria");
  if (filing) {
    try {
      refuseUnreadList(order, criteriaField, "acceptance criteria");
    } catch (error) {
      throw new Error(`${path}: ${error.message}`, { cause: error });
    }
  }
  const items = numberedCriteria(
    order.source,
    order.tree,
    criteriaField.valueStart,
    criteriaField.blockEnd,
  );
  const criteria = items.map((item, i) => {
    if (item.written !== i + 1)
      throw new Error(`non-sequential acceptance criteria: ${path}`);
    return {
      id: `criterion:${i + 1}`,
      text: judgedText(
        order.source.slice(
          item.start + item.marker.length,
          items[i + 1]?.start ?? criteriaField.blockEnd,
        ),
      ).trim(),
    };
  });
  if (
    !criteria.length ||
    order.source.slice(criteriaField.valueStart, items[0].start).trim()
  )
    throw new Error(`missing acceptance criteria: ${path}`);
  const text = (label) => judgedText(field(order, label).text);
  return {
    workOrderId,
    path,
    title,
    objective: text("Objective:"),
    ...(includeCost
      ? {
          cost: order.labels.some((row) => row.raw === "Cost:")
            ? text("Cost:")
            : null,
        }
      : {}),
    criteria,
    nonGoals: text("Non-goals:"),
  };
};

/** The open members of every `track: separate` workstream the sequence does
 * not list, in workstream file order and then member order. A workstream
 * document's JSON block, read by the index's own parse, names the members,
 * and the control fold at the subject's revision says which are closed or
 * withdrawn, so a receipt rebuilt at its revision reads the members it
 * judged whatever happened later; a malformed block or a control read
 * failure refuses. A member with no order file under the same rule as the
 * sequenced orders (committed, or present in workspace mode) is not judged,
 * as the index refuses such a document on its own. */
function separateTrackMembers(
  root,
  { workspace, committed, orderRoot, sequenced },
) {
  const streamRoot = rootPattern(root, "workstreams");
  const pattern = new RegExp(`^${streamRoot}/WS-\\d{3}-[^/]+\\.md$`, "u");
  const streamDirectory = docRelative(root, "workstreams");
  const files = workspace
    ? existsSync(join(root, streamDirectory))
      ? readdirSync(join(root, streamDirectory))
          .map((name) => `${streamDirectory}/${name}`)
          .filter((path) => pattern.test(path))
          .sort()
      : []
    : committed.paths.filter((path) => pattern.test(path)).sort();
  if (!files.length) return [];
  const read = workspace
    ? (path) => readFileSync(join(root, path), "utf8")
    : committed.read;
  let phases = null;
  const phaseOf = (id) => {
    if (!phases)
      phases = new Map(
        [
          ...readControl(root, workspace ? undefined : committed.revision)
            .orders,
        ].map(([key, row]) => [key, row.state.phase]),
      );
    return phases.get(id) ?? null;
  };
  const orderDirectory = docRelative(root, "workOrders");
  const orderPresent = (orderPattern) =>
    workspace
      ? existsSync(join(root, orderDirectory)) &&
        readdirSync(join(root, orderDirectory)).some((name) =>
          orderPattern.test(`${orderDirectory}/${name}`),
        )
      : committed.paths.some((path) => orderPattern.test(path));
  const members = [];
  for (const file of files) {
    const stream = parseWorkstreamDocument(
      read(file),
      file,
      /\/(WS-\d{3})-[^/]+\.md$/u.exec(file)[1],
    );
    if (stream.track !== "separate") continue;
    for (const member of stream.members) {
      const id = member?.workOrderId;
      if (!/^WO-\d{3}$/u.test(id ?? "") || sequenced.has(id)) continue;
      if (members.includes(id)) continue;
      if (["closed", "withdrawn"].includes(phaseOf(id))) continue;
      const orderPattern = new RegExp(`^${orderRoot}/${id}-[^/]+\\.md$`, "u");
      if (!orderPresent(orderPattern)) continue;
      members.push(id);
    }
  }
  return members;
}

export function buildPlanSubject(
  root,
  revision = "HEAD",
  {
    workspace = false,
    costTable = true,
    goalReview = false,
    // The projection before WO-257 judged the sequence alone; a receipt it
    // filed carries no separateTrack key and is rebuilt the same way, so it
    // stays verifiable after the update.
    separateTrack = true,
  } = {},
) {
  if (goalReview)
    return buildGoalSubject(root, revision, { workspace, separateTrack });
  const committed = committedReader(root, revision);
  const read = workspace
    ? (path) => {
        if (!containedRegularFile(join(root, path), root))
          throw new Error(
            `subject source is not a contained regular file: ${path}`,
          );
        return readFileSync(join(root, path), "utf8");
      }
    : committed.read;
  // Historical receipt identities retain the source path present at their
  // revision. Workspace checks see a newly introduced sequence immediately.
  const planMap = planPaths(root).map;
  const sequencePath = (
    workspace
      ? containedRegularFile(join(root, planMap), root)
      : committed.paths.includes(planMap)
  )
    ? planMap
    : docRelative(root, "planning", "work-order-map.md");
  const map = read(sequencePath);
  const has = (path) =>
    workspace
      ? containedRegularFile(join(root, path), root)
      : committed.paths.includes(path);
  const budgetPath = docRelative(root, "control", "budgets.json");
  const includeCost = has(budgetPath);
  const sequence = parseSequence(map);
  // An empty sequence is a horizon with no proposed order: once an
  // instance's last order closes, a pass may let it leave and file none
  // (WO-258); the generated index keeps the closed order.
  if (sequence.length > 100)
    throw new Error("plan sequence must contain 0–100 orders");
  // The block's bytes: from its opening marker, written exactly and alone
  // on its line, through its closing marker, which opens a line, and the
  // blanks and line break after it.
  const marked = markdownMarkerBlocks(
    map,
    "dotln-work-order-sequence:start",
    "dotln-work-order-sequence:end",
  ).find(
    ({ start, openEnd, closeStart, end }) =>
      (start === 0 || map[start - 1] === "\n") &&
      map.slice(start, openEnd) ===
        htmlComment("dotln-work-order-sequence:start") &&
      /^\r?\n/u.test(map.slice(openEnd)) &&
      map[closeStart - 1] === "\n" &&
      map.slice(closeStart, end) ===
        htmlComment("dotln-work-order-sequence:end"),
  );
  const closing =
    marked && /^[^\S\r\n]*(?:\r?\n|$)/u.exec(map.slice(marked.end));
  const block =
    marked && closing
      ? `${map.slice(marked.start, marked.end)}${closing[0]}`
      : undefined;
  if (!block) throw new Error("expected a byte-addressable sequence block");
  const parts = [["sequence", block]];
  const orderRoot = rootPattern(root, "workOrders");
  // The open members of every `track: separate` workstream follow the
  // sequenced orders in the judged subject: a pass files them outside the
  // serial queue, so a subject built from the sequence alone would never
  // judge them and amend-order would never admit them.
  const members = separateTrack
    ? separateTrackMembers(root, {
        workspace,
        committed,
        orderRoot,
        sequenced: new Set(sequence.map(({ id }) => id)),
      })
    : [];
  const judged = [
    ...sequence.map(({ id }) => ({ id })),
    ...members.map((id) => ({ id })),
  ];
  const orderPaths = judged.map(({ id }) => {
    const pattern = new RegExp(`^${orderRoot}/${id}-[^/]+\\.md$`, "u");
    const paths = committed.paths.filter((path) => pattern.test(path));
    // Workspace observation also notices drafts that have not been committed.
    if (paths.length !== 1)
      throw new Error(`expected one committed order file for ${id}`);
    return paths[0];
  });
  const kit = committed.paths.includes("KIT-MANIFEST.json");
  const standardPaths = [
    docRelative(root, "product", "00-vision.md"),
    docRelative(root, "product", "13-uifa-roles.md"),
    docRelative(root, "planning", "capability-table.md"),
  ];
  const missing = (path) =>
    workspace
      ? !lstatSync(join(root, path), { throwIfNoEntry: false })
      : !committed.paths.includes(path);
  const unavailable = kit ? standardPaths.filter(missing) : [];
  const optionalRead = (path) =>
    unavailable.includes(path) ? null : read(path);
  if (!workspace)
    committed.readMany([
      ...orderPaths,
      ...standardPaths.filter((path) => !unavailable.includes(path)),
      ...(includeCost ? [budgetPath] : []),
      ...(includeCost && has(docRelative(root, "planning", "cost-table.json"))
        ? [docRelative(root, "planning", "cost-table.json")]
        : []),
    ]);
  const historicalIds = workspace
    ? historicalDependencyIds(root)
    : historicalDependencyIdsAt(committed);
  const orders = judged.map(({ id }, index) => {
    const path = orderPaths[index];
    const source = read(path);
    parts.push([path, source]);
    return parsePlanOrder(source, path, id, {
      includeCost,
      historicalIds,
      filing: Boolean(workspace),
    });
  });
  const vision = optionalRead(standardPaths[0]);
  if (vision === null) parts.push(["vision:unavailable", standardPaths[0]]);
  // The vision's own reader supplies its sections and exclusions; the subject
  // binds each thesis section and the exclusions section as written.
  const visionDocument = vision === null ? null : readVision(vision);
  const theses = (vision === null ? [] : THESIS_HEADINGS).map(([id, title]) => {
    const { text } = oneSection(visionDocument.sections, title);
    parts.push([`vision:${id}`, text]);
    return { id, title, text };
  });
  parts.push([
    "vision:what-dotln-is-not",
    vision === null
      ? ""
      : oneSection(visionDocument.sections, VISION_EXCLUSIONS_TITLE).text,
  ]);
  const exclusions = (visionDocument?.exclusions ?? []).map((text, i) => ({
    id: `what-dotln-is-not:${i + 1}`,
    text,
  }));
  if (vision !== null && !exclusions.length)
    throw new Error("vision exclusions missing");
  const rolesSource = optionalRead(standardPaths[1]);
  const rolesTree = rolesSource === null ? null : parseMarkdown(rolesSource);
  const rolesSections =
    rolesSource === null ? [] : sectionsOf(rolesSource, rolesTree);
  const rolesSection =
    rolesSource === null ? null : oneSection(rolesSections, "The five roles");
  // The role table stands under the heading, before the first role's own
  // level-3 section.
  const rolesEnd = rolesSection
    ? (rolesSections.find(
        (row) =>
          row.depth === 3 &&
          row.start > rolesSection.start &&
          row.start < rolesSection.bodyEnd,
      )?.start ?? rolesSection.bodyEnd)
    : 0;
  const rolesTables = rolesSection
    ? markdownTables(rolesSource, rolesTree).filter(
        (table) => table.start > rolesSection.start && table.end <= rolesEnd,
      )
    : [];
  // Each table's lines as written: the judged table keeps its CRLF and its
  // spaces.
  const rolesLines = rolesTables.map((table) =>
    rolesSource.slice(table.start, lineEnd(rolesSource, table.end)),
  );
  const rolesBytes = rolesLines.join("");
  const rolesTable = rolesLines
    .map((lines) => judgedText(lines).replace(/\n$/u, ""))
    .join("\n");
  // A role is the bold UIFA name a table row carries.
  const roles = rolesTables.flatMap((table) =>
    [...markdownNodes(rolesTree)]
      .filter(
        (node) =>
          node.type === "strong" &&
          node.position.start.offset >= table.start &&
          node.position.end.offset <= table.end,
      )
      .map((node) => inlineSource(rolesSource, node))
      .filter((name) => name.startsWith("UIFA ")),
  );
  if (rolesSource !== null && (roles.length !== 5 || new Set(roles).size !== 5))
    throw new Error("expected the five-role table");
  parts.push([
    "roles",
    rolesSource === null ? `unavailable: ${standardPaths[1]}` : rolesBytes,
  ]);
  const capabilitiesSource = optionalRead(standardPaths[2]);
  if (capabilitiesSource === null)
    parts.push(["capability:unavailable", standardPaths[2]]);
  // The judged row binds its first two cells' bytes between their pipes.
  const capabilities = capabilityRows(
    capabilitiesSource === null ? [] : markdownTables(capabilitiesSource),
  ).map(({ id, raw: [first, level] }) => {
    if (!level?.trim()) throw new Error(`capability level missing: ${id}`);
    // Multiple dated assessments are retained in source order, not silently
    // collapsed to whichever row a Map happened to keep.
    parts.push([`capability:${id}`, [first, level]]);
    return { id, level: level.trim() };
  });
  if (capabilitiesSource !== null && !capabilities.length)
    throw new Error("capability table has no identified rows");
  const deferrals = orders.flatMap((order, index) =>
    markdownComments(order.nonGoals)
      .flatMap(({ text }) => {
        const named = /^dotln-plan-defer: ([a-z0-9:-]+) -> (WO-\d{3})$/u.exec(
          text,
        );
        return named ? [named] : [];
      })
      .map(([, thesis, laterWorkOrderId]) => {
        if (
          !theses.some(({ id }) => id === thesis) ||
          !judged.slice(index + 1).some(({ id }) => id === laterWorkOrderId)
        )
          throw new Error("invalid named later-order deferral");
        return { thesis, workOrderId: order.workOrderId, laterWorkOrderId };
      }),
  );
  let costs;
  if (includeCost) {
    const budget = JSON.parse(read(budgetPath));
    const sourceHash = hashParts([
      block,
      ...orders.map(({ workOrderId, objective, criteria, nonGoals, cost }) => ({
        workOrderId,
        objective,
        criteria,
        nonGoals,
        cost,
      })),
      ...parts.filter(
        ([name]) =>
          name.startsWith("vision:") ||
          name === "roles" ||
          name.startsWith("capability:"),
      ),
    ]);
    if (costTable) {
      const path = docRelative(root, "planning", "cost-table.json");
      if (!has(path))
        throw new Error(
          "Planning cost table missing; run npm run meta -- --plan-cost after measuring the subject",
        );
      const source = read(path);
      if (Buffer.byteLength(source) > 65536)
        throw new Error("Planning cost table exceeds its bounded 64 KB input");
      costs = JSON.parse(source);
      if (
        costs.schemaVersion !== 1 ||
        !Number.isFinite(Date.parse(costs.observedAt)) ||
        costs.subjectSourceHash !== sourceHash ||
        JSON.stringify(costs.acceptances) !== JSON.stringify(budget.acceptances)
      )
        throw new Error(
          "Planning cost evidence is stale for the subject revision or dated acceptances",
        );
      if (
        !Array.isArray(costs.rows) ||
        costs.rows.length !== orders.length ||
        new Set(costs.rows.map((row) => row.workOrder)).size !==
          orders.length ||
        orders.some(
          (order) =>
            !costs.rows.some((row) => row.workOrder === order.workOrderId),
        )
      )
        throw new Error(
          "Planning cost table must cover exactly the subject orders",
        );
      const at = runGit(root, [
        "show",
        "-s",
        "--format=%cI",
        `${costs.subjectRevision}^{commit}`,
      ]);
      runGit(root, [
        "merge-base",
        "--is-ancestor",
        costs.subjectRevision,
        committed.revision,
      ]);
      // The source hash above binds the cost-bearing projection. A later
      // execution record or merge can touch its containing files without
      // changing that projection. The observation must postdate its recorded
      // revision; whole-file commit times are not planning-input freshness.
      if (Date.parse(costs.observedAt) < Date.parse(at))
        throw new Error("Planning cost evidence predates its subject revision");
      parts.push(["cost-table", source]);
    } else
      costs = {
        schemaVersion: 1,
        subjectSourceHash: sourceHash,
        acceptances: budget.acceptances,
      };
  }
  return {
    schemaVersion: "plan-subject-v1",
    revision: committed.revision,
    hash: hashParts(parts),
    sequenceHash: sha256(block),
    inputs: parts.map(([name, bytes]) => ({
      name,
      hash: sha256(typeof bytes === "string" ? bytes : JSON.stringify(bytes)),
    })),
    standard: {
      theses,
      exclusions,
      roles,
      rolesTable,
      capabilities,
      ...(unavailable.length ? { unavailable } : {}),
    },
    orders,
    ...(separateTrack ? { separateTrack: members } : {}),
    deferrals,
    ...(costs ? { costTable: costs } : {}),
  };
}

/** New judgment inputs are opt-in so every historical subject hash is stable. */
function buildGoalSubject(root, revision, { workspace, separateTrack = true }) {
  // The goal subject projects the plan subject under the same rule, so a
  // goal-review receipt filed before the separate-track projection rebuilds
  // without the key too.
  const subject = buildPlanSubject(root, revision, {
    workspace,
    costTable: false,
    separateTrack,
  });
  const committed = committedReader(root, revision);
  const has = (path) =>
    workspace
      ? containedRegularFile(join(root, path), root)
      : committed.paths.includes(path);
  const kit =
    !hasPackageSources(root) &&
    (workspace
      ? Boolean(
          lstatSync(join(root, "KIT-MANIFEST.json"), { throwIfNoEntry: false }),
        )
      : committed.paths.includes("KIT-MANIFEST.json"));
  const purposePath = docRelative(root, "product", "purpose.md");
  const purposePresent =
    kit &&
    (workspace
      ? Boolean(lstatSync(join(root, purposePath), { throwIfNoEntry: false }))
      : committed.paths.some(
          (path) =>
            path === purposePath ||
            path.startsWith(`${purposePath}/`) ||
            purposePath.startsWith(`${path}/`),
        ));
  // The critical path's pass document moved to the passes directory; a
  // revision before the move still holds it at its earlier path. An instance
  // that declares none keeps the earlier path in its unavailable line, whose
  // bytes its committed receipts bind.
  const criticalPathSource =
    criticalPathCandidates(root).find(has) ??
    criticalPathCandidates(root).at(-1);
  if (!workspace)
    committed.readMany(
      [
        docRelative(root, "product", "07-execution-guide.md"),
        criticalPathSource,
        ...(purposePresent ? [purposePath] : []),
      ].filter(has),
    );
  const read = (path) => {
    if (!has(path))
      throw new Error(
        `goal-review source missing or not a contained regular file: ${path}`,
      );
    return workspace
      ? readFileSync(join(root, path), "utf8")
      : committed.read(path);
  };
  const guide = read(docRelative(root, "product", "07-execution-guide.md"));
  const platformStandard = guide.match(
    /the point is to create a platform,[\s\S]*?before a later pass pays it again\./u,
  )?.[0];
  if (!platformStandard)
    throw new Error("product 07 platform-first standard missing");
  let goalStandard = oneSection(
    sectionsOf(guide),
    "Goal-aligned decisions",
  ).text;
  if (kit) {
    const blocks = (source, name, path) => {
      const names = [`${name}:start`, `${name}:end`];
      const found = markdownMarkerBlocks(source, ...names);
      if (found.unbalanced)
        throw new Error(`${path}: unbalanced ${name} markers`);
      if (
        markdownComments(source).some(
          ({ text }) => text.startsWith(`${name}:`) && !names.includes(text),
        )
      )
        throw new Error(`${path}: malformed ${name} marker`);
      if (!found.length)
        throw new Error(`${path}: missing or unbalanced ${name} markers`);
      return found.map(({ inner }) => inner);
    };
    const rules = blocks(
      goalStandard,
      "dotln-goal-rules",
      docRelative(root, "product", "07-execution-guide.md"),
    );
    let purpose = `unavailable: ${purposePath}; this instance has not declared its purpose`;
    if (purposePresent) {
      const declared = blocks(read(purposePath), "dotln-purpose", purposePath);
      if (declared.length !== 1 || !declared[0].trim())
        throw new Error(
          `${purposePath}: expected exactly one nonempty dotln-purpose block`,
        );
      purpose = declared[0];
    }
    goalStandard = [goalStandard.split("\n", 1)[0], ...rules, purpose].join(
      "\n",
    );
  }
  const criticalPath =
    kit &&
    (workspace
      ? !lstatSync(join(root, criticalPathSource), { throwIfNoEntry: false })
      : !committed.paths.includes(criticalPathSource))
      ? `unavailable: ${criticalPathSource}; this instance has not declared a critical path`
      : oneSection(sectionsOf(read(criticalPathSource)), "The critical path")
          .text;
  const path = docRelative(root, "planning", "cost-table.json");
  const costs = has(path) ? JSON.parse(read(path)) : null;
  const costEvidenceStatus = costs
    ? costs.subjectSourceHash === subject.costTable?.subjectSourceHash
      ? "current"
      : "stale"
    : "unknown";
  // Retain available meter observations when a criterion repair changes its
  // source projection. Freshness is described, not a demand for a new judgment.
  const observedNumber = (value) =>
    typeof value === "number"
      ? Number.isFinite(value)
      : value &&
        typeof value === "object" &&
        Object.values(value).some(observedNumber);
  const observations = [
    ...(costs?.rows ?? [])
      .filter((row) => observedNumber(row.metrics))
      .map((row) => ({
        id: `${path}#row:${row.workOrder}`,
        text: JSON.stringify(row),
      })),
    ...(costs?.traps ?? [])
      .filter((row) => observedNumber(row.indicators))
      .map((row, index) => ({
        id: `${path}#trap:${row.id ?? index}`,
        text: JSON.stringify(row),
      })),
  ];
  const goalReview = {
    platformStandard,
    goalStandard,
    criticalPath,
    evidenceHash: goalEvidenceHash(subject.standard, observations),
    observations,
    costEvidenceStatus,
  };
  const extra = [
    ["goal-review", goalReview],
    ...(costs ? [["cost-table", costs]] : []),
  ];
  return {
    ...subject,
    orders: subject.orders.map((order) =>
      parsePlanOrder(read(order.path), order.path, order.workOrderId, {
        includeCost: true,
        historicalIds: workspace
          ? historicalDependencyIds(root)
          : historicalDependencyIdsAt(committed),
        filing: Boolean(workspace),
      }),
    ),
    hash: hashParts([subject.hash, ...extra]),
    inputs: [
      ...subject.inputs,
      ...extra.map(([name, value]) => ({
        name,
        hash: sha256(JSON.stringify(value)),
      })),
    ],
    ...(costs ? { costTable: costs } : {}),
    goalReview,
  };
}

// Observation timestamps describe collection, not a changed body of evidence.
export function goalEvidenceHash(standard, observations) {
  const evidenceValues = (value) =>
    Array.isArray(value)
      ? value.map(evidenceValues)
      : value && typeof value === "object"
        ? Object.fromEntries(
            Object.entries(value)
              .filter(
                ([key]) =>
                  !["observedAt", "collectedAt", "subjectRevision"].includes(
                    key,
                  ),
              )
              .map(([key, item]) => [key, evidenceValues(item)]),
          )
        : value;
  return hashParts([
    standard.theses,
    standard.exclusions,
    observations.map((row) => ({
      id: row.id,
      value: evidenceValues(JSON.parse(row.text)),
    })),
  ]);
}

/** Where the critical-path pass document may be: its pass directory, then
 * the planning root it stood in before WO-238 moved it. */
export const criticalPathCandidates = (root) => [
  docRelative(root, "planning", "passes", "critical-path-2026-09-08.md"),
  docRelative(root, "planning", "critical-path-2026-09-08.md"),
];

/** The capability rows of `tables`: each row whose first cell names a
 * capability id in a code span, in source order, with its cells' text and
 * their bytes between the pipes. The planning subject binds a capability by
 * these rows, and a dated reassessment names its capabilities the same way. */
export const capabilityRows = (tables) =>
  tables.flatMap((table) =>
    table.rows.flatMap((row) => {
      const id = markdownCodeSpans(row.cells[0] ?? "")
        .map((span) => span.value)
        .find((value) => /^[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+$/u.test(value));
      return id ? [{ id, line: row.line, cells: row.cells, raw: row.raw }] : [];
    }),
  );

/** The idea ledger's dated planning passes, each by its section heading. */
export const planningPasses = (ledger) =>
  ledgerSections(ledger)
    .map(({ title: heading }) => ({
      heading,
      date: heading.match(/\b\d{4}-\d{2}-\d{2}\b/u)?.[0],
    }))
    .filter(({ heading, date }) => date && /planning pass/iu.test(heading))
    .map((pass) => ({
      ...pass,
      id: `planning-${sha256(pass.heading).slice(7, 23)}`,
    }));
