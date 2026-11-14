import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { containedRegularFile, parseJson } from "./paths.mjs";
import { markdownMarkerBlocks } from "./markdown-links.mjs";
import { headerField, readWorkOrderHeader } from "./work-order-document.mjs";

const WORKSTREAM = /^WS-\d{3}$/u;
const ORDER = /^WO-\d{3}$/u;
const COMMIT = /^(?:[0-9a-f]{40}|[0-9a-f]{64}|unknown)$/u;

/** Membership is declared only in leading metadata, like Repository: the
 * field's own line holds a space and one WS-NNN id, nothing else. */
export const parseWorkstreamDeclaration = (markdown, path) => {
  const field = headerField(
    readWorkOrderHeader(markdown),
    "Workstream",
    `${path}: duplicate **Workstream:** lines`,
  );
  if (!field) return undefined;
  const match = /^\s+(WS-\d{3})\s*$/u.exec(field.lineValue);
  if (!match)
    throw new Error(
      `${path}: malformed **Workstream:** line; expected **Workstream:** WS-NNN`,
    );
  return match[1];
};

/** The one dotln-workstream block of a workstream document, in the contract's
 * shape: the id its filename names, members, edges and an optional separate
 * track; a malformed block refuses by its path. The index and the planning
 * subject read the same parse. */
export const parseWorkstreamDocument = (text, path, expectedId) => {
  const blocks = markdownMarkerBlocks(
    text,
    "dotln-workstream:start",
    "dotln-workstream:end",
  );
  if (blocks.length !== 1 || blocks.unbalanced)
    throw new Error(`${path}: expected one dotln-workstream block`);
  const stream = parseJson(blocks[0].inner, path);
  if (
    !stream ||
    typeof stream !== "object" ||
    Array.isArray(stream) ||
    stream.id !== expectedId ||
    Object.keys(stream).some(
      (key) => !["id", "members", "edges", "track"].includes(key),
    ) ||
    (stream.track !== undefined && stream.track !== "separate") ||
    !Array.isArray(stream.members) ||
    !Array.isArray(stream.edges)
  )
    throw new Error(`${path}: invalid or duplicate workstream document`);
  return stream;
};

/** Read the document contract without observing any target checkout. */
export const readWorkstreams = (root, rows) => {
  const directory = docPath(root, "workstreams");
  const byId = new Map(rows.map((row) => [row.id, row]));
  const streams = [];
  const seen = new Set();
  const membership = new Map();
  for (const name of existsSync(directory)
    ? readdirSync(directory).sort()
    : []) {
    const filename = /^(WS-\d{3})-.+\.md$/u.exec(name);
    if (!filename) continue;
    const path = docRelative(root, "workstreams", name);
    const file = join(directory, name);
    if (!containedRegularFile(file, root))
      throw new Error(`${path}: expected a contained regular file`);
    const stream = parseWorkstreamDocument(
      readFileSync(file, "utf8"),
      path,
      filename[1],
    );
    if (seen.has(stream.id))
      throw new Error(`${path}: invalid or duplicate workstream document`);
    seen.add(stream.id);
    const members = new Set();
    for (const member of stream.members) {
      if (
        !member ||
        Object.keys(member).sort().join(",") !== "repositoryId,workOrderId" ||
        !ORDER.test(member.workOrderId) ||
        members.has(member.workOrderId)
      )
        throw new Error(`${path}: invalid or duplicate member`);
      const row = byId.get(member.workOrderId);
      if (!row || row.workstream !== stream.id) {
        if (row?.phase === "closed" && row.workstream === undefined)
          console.warn(
            `Advisory: ${path}: closed ${row.id} has no **Workstream:** ${stream.id} field; document membership admitted.`,
          );
        else
          throw new Error(
            `${path}: ${member.workOrderId} must declare **Workstream:** ${stream.id} in its order`,
          );
      }
      if (membership.has(member.workOrderId))
        throw new Error(
          `${path}: ${member.workOrderId} is already a member of ${membership.get(member.workOrderId)}`,
        );
      membership.set(member.workOrderId, stream.id);
      if (member.repositoryId !== (row.repository?.id ?? "self"))
        throw new Error(
          `${path}: ${member.workOrderId} repositoryId differs from **Repository:** (absence means self)`,
        );
      members.add(member.workOrderId);
    }
    for (const row of rows)
      if (row.workstream === stream.id && !members.has(row.id))
        throw new Error(
          `${path}: ${row.id} declares **Workstream:** ${stream.id} but is absent from members`,
        );
    const edges = new Set();
    for (const edge of stream.edges) {
      if (
        !edge ||
        Object.keys(edge).sort().join(",") !== "from,relation,to" ||
        !members.has(edge.from) ||
        !byId.has(edge.to) ||
        typeof edge.relation !== "string" ||
        !/^[a-z][a-z-]*$/u.test(edge.relation) ||
        edges.has(JSON.stringify([edge.from, edge.to, edge.relation]))
      )
        throw new Error(`${path}: invalid or duplicate dependency edge`);
      edges.add(JSON.stringify([edge.from, edge.to, edge.relation]));
    }
    streams.push(stream);
  }
  for (const row of rows)
    if (row.workstream && !seen.has(row.workstream))
      throw new Error(
        `${row.path}: **Workstream:** ${row.workstream} has no workstream document`,
      );
  return streams;
};

/** Only these recorded Git facts survive --check; headers and control are
 * projected again, so a changed declaration or verdict still stales the page.
 * `workstreams` is the index record's workstream observation, as data. */
export const readWorkstreamSnapshot = (workstreams, path) => {
  if (!Array.isArray(workstreams))
    throw new Error(
      `${path}: missing or malformed workstream snapshot; run npm run work-orders -- index`,
    );
  const facts = new Map();
  const streams = new Set();
  for (const stream of workstreams) {
    if (
      !stream ||
      !WORKSTREAM.test(stream.id) ||
      streams.has(stream.id) ||
      !Array.isArray(stream.members)
    )
      throw new Error(`${path}: invalid workstream snapshot group`);
    streams.add(stream.id);
    for (const member of stream.members) {
      const key = `${stream.id}/${member?.workOrderId}`;
      if (
        !member ||
        !ORDER.test(member.workOrderId) ||
        facts.has(key) ||
        !COMMIT.test(member.base) ||
        !COMMIT.test(member.targetCommit) ||
        !["current", "behind", "diverged", "unknown"].includes(
          member.integration,
        ) ||
        member.stale !==
          (member.integration === "unknown"
            ? "unknown"
            : member.integration === "current"
              ? "no"
              : "yes")
      )
        throw new Error(`${path}: invalid workstream snapshot member ${key}`);
      facts.set(key, member);
    }
  }
  return facts;
};

/** Where the target facts each workstream's row was rendered from are
 * recorded: what the index observed in other repositories, which no file of
 * this one holds, so that `index --check` judges the pages without a target
 * checkout. */
export const workstreamObservationsRecord = (root) =>
  docRelative(root, "control", "workstream-observations.json");
const observationsCommand = "npm run work-orders -- index";

/** The record's bytes for projected workstreams: each member's observed base,
 * target commit and integration, and nothing a header or the control log
 * says, which the check projects again. */
export const renderWorkstreamObservations = (workstreams) =>
  `${JSON.stringify(
    {
      schemaVersion: 1,
      workstreams: workstreams.map(({ id, members }) => ({
        id,
        members: members.map(
          ({ workOrderId, base, targetCommit, integration, stale }) => ({
            workOrderId,
            base,
            targetCommit,
            integration,
            stale,
          }),
        ),
      })),
    },
    null,
    2,
  )}\n`;

/** Writes the observation record when the index refreshes: its one writer.
 * True when the bytes changed. */
export function writeWorkstreamObservations(root, workstreams) {
  const display = workstreamObservationsRecord(root);
  const path = join(root, display);
  if (existsSync(path) && !containedRegularFile(path, root))
    throw new Error(`${display}: expected a contained regular file`);
  const next = renderWorkstreamObservations(workstreams);
  if (existsSync(path) && readFileSync(path, "utf8") === next) return false;
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, next, { flag: "wx" });
  renameSync(temporary, path);
  return true;
}

/** The recorded target facts, by workstream and member; a missing record
 * refuses naming the command that writes it. */
export function readWorkstreamObservations(root) {
  const display = workstreamObservationsRecord(root);
  if (!containedRegularFile(join(root, display), root))
    throw new Error(
      `${display}: the workstream observations are missing; run ${observationsCommand}`,
    );
  let record;
  try {
    record = JSON.parse(readFileSync(join(root, display), "utf8"));
  } catch {
    record = undefined;
  }
  if (record?.schemaVersion !== 1)
    throw new Error(
      `${display}: invalid workstream observations; run ${observationsCommand}`,
    );
  return readWorkstreamSnapshot(record.workstreams, display);
}

export const projectWorkstreams = (streams, rows, facts) => {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return streams.map((stream) => ({
    id: stream.id,
    ...(stream.track ? { track: stream.track } : {}),
    members: stream.members.map(({ workOrderId }) => {
      const row = byId.get(workOrderId);
      const fact = facts.get(`${stream.id}/${workOrderId}`);
      if (!fact)
        throw new Error(
          `${stream.id}/${workOrderId}: missing target observation; run npm run work-orders -- index`,
        );
      return {
        workOrderId,
        repository: row.repository?.id ?? "self",
        base: row.repository?.baseCommit ?? fact.base,
        phase: row.phase,
        verdict: row.state?.latestVerdict ?? "unknown",
        integration: fact.integration,
        stale: fact.stale,
        targetCommit: fact.targetCommit,
      };
    }),
    edges: stream.edges,
  }));
};
