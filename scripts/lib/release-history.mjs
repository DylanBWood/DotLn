import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, posix } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import {
  containedRegularFile,
  parseJson,
  workOrderAuthorityFiles,
} from "./paths.mjs";
import { localReleaseRecords, localTags, semver } from "./release-records.mjs";
import { releaseAnnotations, releaseTagsFrom } from "./release-tags.mjs";

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
const snapshotPrefix = "<!-- dotln-release-tags: ";
export const historyCommand = "npm run release -- list --markdown --write";
// A marker or a lookalike is a comment line naming the marker; the same name
// in a table cell or prose (an order's display text) is neither.
export const markerLine = (line) =>
  /^\s*<!--/.test(line) && line.includes(`${RELEASE_HISTORY.marker}:`);

// The manifest-free v0.2.0 edition keeps its components in its reviewed
// record, the file its order join reads (release-tags.mjs).
const historicalComponents = (root, name) => {
  const path = docPath(root, "releases", `${name}.md`);
  return existsSync(path)
    ? Object.fromEntries(
        [
          ...readFileSync(path, "utf8").matchAll(
            /^\| Component: `(@dotln\/[^`]+)` \| `([^`]+)` \|$/gm,
          ),
        ].map(([, component, version]) => [component, version]),
      )
    : {};
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

// The heading supplies display text only: its name before the first colon
// outside code, without the id or the version the tag already shows.
export const displayTitle = (heading, id) => {
  let text = heading
    .replace(/^#\s+/, "")
    .replace(/[ \t]+#+[ \t]*$/, "")
    .trim();
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
      const heading = containedRegularFile(file, root)
        ? readFileSync(file, "utf8").split("\n", 1)[0]
        : "";
      titles.set(path, cell(displayTitle(heading, id)));
    }
    const title = titles.get(path);
    return `[${id}](${posix.relative(product, path)})${title ? ` ${title}` : ""}`;
  };
}

/** The generated block for `records` (localReleaseRecords rows), newest
 * first, with the snapshot of the tags it was generated from. */
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
    `Generated by \`${historyCommand}\` from the local annotated release tags recorded below, newest first. Dates are the tags' UTC dates; the classification is each tag's step over the previous release its manifest names. The docs check refuses a row that differs from its recorded tag, names a recorded tag this checkout lacks and reports a newer tag without refusing.`,
    "",
    `${snapshotPrefix}${JSON.stringify(records.map(({ name, object }) => ({ name, object })))} -->`,
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

function readSnapshot(block, displayPath) {
  const records = block.lines.filter((line) => line.startsWith(snapshotPrefix));
  if (records.length !== 1 || !records[0].endsWith(" -->"))
    throw new Error(
      `${displayPath}: the generated release history needs one release tag snapshot; run ${historyCommand}`,
    );
  const snapshot = parseJson(
    records[0].slice(snapshotPrefix.length, -4),
    `${displayPath} release tag snapshot`,
  );
  if (
    !Array.isArray(snapshot) ||
    snapshot.some(
      (tag) =>
        !tag ||
        typeof tag !== "object" ||
        Object.keys(tag).sort().join(",") !== "name,object" ||
        !semver(tag.name) ||
        !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(tag.object),
    ) ||
    new Set(snapshot.map(({ name }) => name)).size !== snapshot.length
  )
    throw new Error(`${displayPath}: invalid release tag snapshot`);
  return snapshot;
}

/** The index's rule for the committed table: each recorded tag must remain
 * available and unchanged, the rows must equal those tags' rows, and a
 * newer local release tag is reported without refusing. */
export function checkReleaseHistory(root, source, displayPath) {
  let block, records, snapshot;
  try {
    block = historyBlock(source, displayPath);
    if (!block) return { present: false, failures: [], newer: [] };
    snapshot = readSnapshot(block, displayPath);
    records = localReleaseRecords(root, snapshot);
  } catch (error) {
    return {
      present: Boolean(block),
      failures: [error instanceof Error ? error.message : String(error)],
      newer: [],
    };
  }
  const failures = [];
  const expected = renderReleaseHistory(root, records).split("\n");
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
  return {
    present: true,
    failures,
    newer: releaseTagsFrom(
      candidates,
      releaseAnnotations(root, candidates),
    ).map(({ name }) => name),
  };
}

/** Replaces the committed block with one generated from every local release
 * tag; the product document must already hold the marker pair. */
export function writeReleaseHistory(root) {
  const path = docPath(root, "product", RELEASE_HISTORY.product);
  const displayPath = docRelative(root, "product", RELEASE_HISTORY.product);
  if (!containedRegularFile(path, root))
    throw new Error(`${displayPath}: expected a contained regular file`);
  const source = readFileSync(path, "utf8");
  const block = historyBlock(source, displayPath);
  if (!block)
    throw new Error(
      `${displayPath}: no generated release history block; add the ${historyStart} and ${historyEnd} lines where the table belongs`,
    );
  const records = localReleaseRecords(root);
  const lines = source.split("\n");
  lines.splice(
    block.first,
    block.last - block.first + 1,
    renderReleaseHistory(root, records),
  );
  const next = lines.join("\n");
  if (next !== source) {
    const temporary = `${path}.${process.pid}.tmp`;
    writeFileSync(temporary, next, { flag: "wx" });
    renameSync(temporary, path);
  }
  return { path: displayPath, tags: records.length, changed: next !== source };
}
