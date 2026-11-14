import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { markdownTables, opensHtmlComment } from "./markdown-links.mjs";
import {
  containedRegularFile,
  parseJson,
  workOrderAuthorityFiles,
} from "./paths.mjs";
import { localReleaseRecords, localTags, semver } from "./release-records.mjs";
import { releaseAnnotations, releaseTagsFrom } from "./release-tags.mjs";
import { readWorkOrderTitle } from "./work-order-document.mjs";

// The one generated product block (WO-086): the roadmap's release history,
// rendered from local annotated tags joined to the orders their manifests
// name, as the work-order index's local release evidence is. The docs check
// exempts this registration and no other marker pair.
export const RELEASE_HISTORY = Object.freeze({
  product: "06-roadmap.md",
  marker: "dotln-release-history",
});
export const historyStart = `<!-- ${RELEASE_HISTORY.marker}:start -->`;
export const historyEnd = `<!-- ${RELEASE_HISTORY.marker}:end -->`;
// The tags a rendered block was generated from are a record of their own, a
// generated JSON file beside the other control projections: the docs check
// reads them there, never back out of the page it judges.
export const releaseHistoryRecord = (root) =>
  docRelative(root, "control", "release-history.json");
export const historyCommand = "npm run release -- list --markdown --write";
// A marker or a lookalike is a comment line naming the marker; the same name
// in a table cell or prose (an order's display text) is neither.
export const markerLine = (line) =>
  opensHtmlComment(line) && line.includes(`${RELEASE_HISTORY.marker}:`);

// The manifest-free v0.2.0 edition keeps its components in its reviewed
// record, the file its order join reads (release-tags.mjs): the table rows
// of two cells whose first names a component package in code and whose
// second holds its version in code.
const historicalComponents = (root, name) => {
  const path = docPath(root, "releases", `${name}.md`);
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    markdownTables(readFileSync(path, "utf8")).flatMap((table) =>
      table.rows.slice(1).flatMap(({ cells }) => {
        const component = /^Component: `(@dotln\/[^`]+)`$/u.exec(cells[0])?.[1];
        const version = /^`([^`]+)`$/u.exec(cells[1] ?? "")?.[1];
        return cells.length === 2 && component && version
          ? [[component, version]]
          : [];
      }),
    ),
  );
};

// The same escaping as the work-order index's table cells.
const cell = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")
    .replaceAll("\\", "&#92;")
    .replaceAll("`", "&#96;")
    .replaceAll("[", "&#91;")
    .replaceAll("]", "&#93;")
    .replace(/\s+/g, " ")
    .trim();

// The order's title supplies display text only: its name before the first
// colon outside code, without the id or the version the tag already shows.
export const displayTitle = (title, id) => {
  let text = title.trim();
  if (text.startsWith(`${id} — `)) text = text.slice(id.length + 3);
  // Headings carry their target as "(vX.Y.Z)", ", vX.Y.Z" or " — vX.Y.Z".
  const version = "v(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)";
  text = text
    .replace(
      new RegExp(
        `(?:\\s*\\((?:${version}|version assigned at activation)\\)|\\s*[,—]\\s*${version})$`,
      ),
      "",
    )
    .trim();
  let code = false;
  for (let index = 0; index < text.length; index++) {
    if (text[index] === "`") code = !code;
    else if (!code && text[index] === ":" && /\s/.test(text[index + 1] ?? ""))
      return text.slice(0, index).trim();
  }
  return text;
};

// A tag's classification is its version step over the previous release its
// manifest names; the first release has none.
export const releaseStep = (previous, version) => {
  const from = semver(previous ?? "");
  const to = semver(version);
  if (!from || !to) return "initial";
  return from[0] !== to[0] ? "major" : from[1] !== to[1] ? "minor" : "patch";
};

const utcDate = (milliseconds) =>
  Number.isFinite(milliseconds)
    ? new Date(milliseconds).toISOString().slice(0, 10)
    : "unknown";

function orderLinks(root) {
  const product = docRelative(root, "product");
  const byId = new Map();
  for (const path of workOrderAuthorityFiles(root)) {
    const id = /^(WO-\d{3})-/.exec(posix.basename(path))?.[1];
    if (id) byId.set(id, [...(byId.get(id) ?? []), path]);
  }
  const titles = new Map();
  return (id, preferred) => {
    const candidates = byId.get(id) ?? [];
    const path = candidates.includes(preferred)
      ? preferred
      : candidates.length === 1
        ? candidates[0]
        : undefined;
    if (!path) return id;
    if (!titles.has(path)) {
      const file = join(root, path);
      const title = containedRegularFile(file, root)
        ? (readWorkOrderTitle(readFileSync(file, "utf8"))?.title ?? "")
        : "";
      titles.set(path, cell(displayTitle(title, id)));
    }
    const title = titles.get(path);
    return `[${id}](${posix.relative(product, path)})${title ? ` ${title}` : ""}`;
  };
}

/** The record of the tags `records` names, as release-history.json holds
 * it. `table` is the newest of them the roadmap's table was rendered
 * through, null where no table has been written: the index's refresh
 * appends tags the table does not show yet, and the table's check compares
 * it with exactly the tags it was rendered from. */
export const renderReleaseRecord = (records, table = null, tableObjects = {}) =>
  `${JSON.stringify({ schemaVersion: 1, tags: records.map(({ name, object }) => ({ name, object })), table, ...(Object.keys(tableObjects).length ? { tableObjects } : {}) }, null, 2)}\n`;

/** The generated block for `records` (localReleaseRecords rows), newest
 * first; the tags it was generated from are recorded in its JSON record. */
export function renderReleaseHistory(root, records) {
  const link = orderLinks(root);
  const rows = [...records].reverse().map((record) => {
    const components = Object.entries(
      record.historical
        ? historicalComponents(root, record.name)
        : (record.manifest?.versions?.components ?? {}),
    )
      .map(([name, version]) => [name.replace(/^@dotln\//, ""), version])
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([name, version]) => `${name} ${version}`);
    return `| \`${record.name}\` | ${utcDate(record.taggedAt)} | ${record.workOrders.map((id) => link(id, record.manifest?.workOrder?.path)).join("; ") || "none recorded"} | ${releaseStep(record.manifest?.release?.previousRelease, record.name)} | ${cell(components.join(", ")) || "none recorded"} |`;
  });
  return [
    historyStart,
    "",
    `Generated by \`${historyCommand}\` from the local annotated release tags recorded in \`${releaseHistoryRecord(root)}\`, newest first. Dates are the tags' UTC dates; the classification is each tag's step over the previous release its manifest names. The docs check refuses a row that differs from its recorded tag, names a recorded tag this checkout lacks and reports a newer tag without refusing.`,
    "",
    "| Version | Date | Order | Classification | Components |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
    historyEnd,
  ].join("\n");
}

/** The committed block as exact marker lines, or null when neither marker
 * nor a lookalike appears. Anything else is refused, never guessed. */
export function historyBlock(source, displayPath) {
  const lines = source.split("\n");
  const at = (text) =>
    lines.flatMap((line, index) => (line === text ? [index] : []));
  const starts = at(historyStart);
  const ends = at(historyEnd);
  const lookalikes = lines.filter(
    (line) => markerLine(line) && line !== historyStart && line !== historyEnd,
  );
  if (!starts.length && !ends.length && !lookalikes.length) return null;
  if (
    starts.length !== 1 ||
    ends.length !== 1 ||
    starts[0] > ends[0] ||
    lookalikes.length
  )
    throw new Error(
      `${displayPath}: the generated release history needs exactly one ordered pair of exact ${RELEASE_HISTORY.marker} marker lines`,
    );
  return {
    first: starts[0],
    last: ends[0],
    lines: lines.slice(starts[0], ends[0] + 1),
  };
}

/** The release tags the generated pages were rendered from, as the record
 * holds them. A missing or unreadable record refuses naming `command`, the
 * command of the page being judged (`what`), which writes it. */
export const readReleaseRecord = (root, displayPath, command, what) =>
  readRecord(root, displayPath, command, what).tags;

/** The record whole: its tags and the tag its table was rendered through.
 * A record written before the table's tag was kept has none, which reads
 * as its newest tag: the table and the record were written together then. */
function readRecord(
  root,
  displayPath,
  command = historyCommand,
  what = "the generated release history",
) {
  const path = releaseHistoryRecord(root);
  if (!containedRegularFile(join(root, path), root))
    throw new Error(
      `${displayPath}: ${what} needs its tag record ${path}; run ${command}`,
    );
  let record;
  try {
    record = JSON.parse(readFileSync(join(root, path), "utf8"));
  } catch {
    record = undefined;
  }
  const snapshot = record?.tags;
  if (
    record?.schemaVersion !== 1 ||
    !Array.isArray(snapshot) ||
    snapshot.some(
      (tag) =>
        !tag ||
        typeof tag !== "object" ||
        Object.keys(tag).sort().join(",") !== "name,object" ||
        !semver(tag.name) ||
        !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(tag.object),
    ) ||
    new Set(snapshot.map(({ name }) => name)).size !== snapshot.length ||
    (record.table !== undefined &&
      record.table !== null &&
      !snapshot.some(({ name }) => name === record.table)) ||
    (record.tableObjects !== undefined &&
      (!record.tableObjects ||
        typeof record.tableObjects !== "object" ||
        Array.isArray(record.tableObjects) ||
        Object.entries(record.tableObjects).some(
          ([name, object]) =>
            !snapshot.some((tag) => tag.name === name) ||
            typeof object !== "string" ||
            !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(object),
        )))
  )
    throw new Error(`${path}: invalid release tag record; run ${command}`);
  return {
    tags: snapshot,
    table:
      record.table === undefined
        ? (snapshot.at(-1)?.name ?? null)
        : record.table,
    // The object the table was rendered from, for each tag replaced since.
    tableObjects: record.tableObjects ?? {},
  };
}

/** Writes the record of the tags `records` names: the one writer, which the
 * roadmap's block and the work-order index both call when they render. It
 * holds what was observed outside this repository's files, a tag's name and
 * object, and through which of them the roadmap's table was rendered. The
 * table's writer passes `table`; the index's refresh passes none and the
 * record keeps the tag it held, while that tag is still among `records`.
 * True when the bytes changed. */
export function writeReleaseRecord(root, records, { table } = {}) {
  const display = releaseHistoryRecord(root);
  const path = join(root, display);
  if (existsSync(path) && !containedRegularFile(path, root))
    throw new Error(`${display}: expected a contained regular file`);
  // A tag the table was rendered through and that was replaced since keeps,
  // for the table, the object it was rendered from: the index's refresh
  // takes the new object for its own pages, and the table's check names the
  // replaced tag until the table's writer renders it again.
  let tableObjects = {};
  if (table === undefined) {
    try {
      const held = readRecord(root, display);
      table = held.table;
      const through = held.tags.findIndex(({ name }) => name === table);
      for (const tag of held.tags.slice(0, through + 1)) {
        const rendered = held.tableObjects[tag.name] ?? tag.object;
        const observed = records.find(({ name }) => name === tag.name);
        if (observed && observed.object !== rendered)
          tableObjects[tag.name] = rendered;
      }
    } catch {
      // No record, or one nothing can be read from, to keep a boundary
      // from. Where the committed table equals the rendering of every tag
      // it was rendered through the newest; otherwise none is known, and
      // the table's own writer sets one.
      table = tableIsCurrent(root, records)
        ? (records.at(-1)?.name ?? null)
        : null;
    }
    if (!records.some(({ name }) => name === table)) table = null;
  }
  if (table === null) tableObjects = {};
  const next = renderReleaseRecord(records, table, tableObjects);
  if (existsSync(path) && readFileSync(path, "utf8") === next) return false;
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, next, { flag: "wx" });
  renameSync(temporary, path);
  return true;
}

/** Whether the product document's committed table is the rendering of
 * exactly `records`: the same comparison the check makes, line for line. */
function tableIsCurrent(root, records) {
  const path = docPath(root, "product", RELEASE_HISTORY.product);
  if (!containedRegularFile(path, root)) return false;
  try {
    const block = historyBlock(
      readFileSync(path, "utf8"),
      RELEASE_HISTORY.product,
    );
    const expected = renderReleaseHistory(root, records).split("\n");
    return (
      Boolean(block) &&
      block.lines.length === expected.length &&
      expected.every((line, index) => line === block.lines[index])
    );
  } catch {
    return false;
  }
}

const missingBlock = (displayPath) =>
  `${displayPath}: no generated release history block; add the ${historyStart} and ${historyEnd} lines where the table belongs, then run ${historyCommand}`;

/** The index's rule for the committed table: each recorded tag must remain
 * available and unchanged, the rows must equal the rows of the tags the
 * table was rendered through, and a newer release tag is reported without
 * refusing. The record is shared with the work-order index, whose refresh
 * appends the tags that arrived since the table was written and leaves this
 * document alone: the record names the tag the table was rendered through,
 * and the tags after it are newer tags too. A document whose block is gone
 * fails; so does a local release tag whose annotation cannot be read, which
 * is reported rather than thrown. */
export function checkReleaseHistory(root, source, displayPath) {
  let block, records, snapshot, table;
  try {
    block = historyBlock(source, displayPath);
    if (!block)
      return {
        present: false,
        failures: [missingBlock(displayPath)],
        newer: [],
      };
    let tableObjects;
    ({ tags: snapshot, table, tableObjects } = readRecord(root, displayPath));
    // The table's own observation of each tag: the object it was rendered
    // from, where the tag has been replaced since.
    records = localReleaseRecords(
      root,
      snapshot.map((tag) => ({
        name: tag.name,
        object: tableObjects[tag.name] ?? tag.object,
      })),
    );
  } catch (error) {
    return {
      present: Boolean(block),
      failures: [error instanceof Error ? error.message : String(error)],
      newer: [],
    };
  }
  const failures = [];
  // The table was rendered through `table`: the recorded tags after it
  // arrived since and have no row yet.
  const through = records.findIndex(({ name }) => name === table) + 1;
  const expected = renderReleaseHistory(root, records.slice(0, through)).split(
    "\n",
  );
  const differs = expected.findIndex(
    (line, index) => line !== block.lines[index],
  );
  if (differs >= 0 || expected.length !== block.lines.length)
    failures.push(
      `${displayPath}:${block.first + 1 + (differs >= 0 ? differs : expected.length)}: generated release history differs from the rows of its recorded tags; run ${historyCommand}`,
    );
  // Only tags the snapshot does not name are read again.
  const recorded = new Set(snapshot.map(({ name }) => name));
  const candidates = [...localTags(root).values()].filter(
    ({ name, objectType }) =>
      !recorded.has(name) && semver(name) && objectType === "tag",
  );
  let newer = [];
  try {
    newer = [
      // Recorded since the table was written, oldest first.
      ...records.slice(through).map(({ name }) => name),
      ...releaseTagsFrom(candidates, releaseAnnotations(root, candidates)).map(
        ({ name }) => name,
      ),
    ];
  } catch (error) {
    failures.push(
      `${displayPath}: a local release tag's annotation cannot be read (${error instanceof Error ? error.message : String(error)}); repair or delete the tag`,
    );
  }
  return { present: true, failures, newer };
}

/** Replaces the committed block with one generated from `records`, every
 * local release tag unless the caller has read them; the product document
 * must already hold the marker pair. `record` says whether the tag record
 * changed, which the caller answers by rendering the other pages the record
 * serves. */
export function writeReleaseHistory(root, records = localReleaseRecords(root)) {
  const path = docPath(root, "product", RELEASE_HISTORY.product);
  const displayPath = docRelative(root, "product", RELEASE_HISTORY.product);
  if (!containedRegularFile(path, root))
    throw new Error(`${displayPath}: expected a contained regular file`);
  const source = readFileSync(path, "utf8");
  const block = historyBlock(source, displayPath);
  if (!block) throw new Error(missingBlock(displayPath));
  const lines = source.split("\n");
  lines.splice(
    block.first,
    block.last - block.first + 1,
    renderReleaseHistory(root, records),
  );
  const replace = (file, before, next) => {
    if (next === before) return false;
    const temporary = `${file}.${process.pid}.tmp`;
    writeFileSync(temporary, next, { flag: "wx" });
    renameSync(temporary, file);
    return true;
  };
  const page = replace(path, source, lines.join("\n"));
  const record = writeReleaseRecord(root, records, {
    table: records.at(-1)?.name ?? null,
  });
  return {
    path: displayPath,
    tags: records.length,
    changed: page || record,
    record,
  };
}
