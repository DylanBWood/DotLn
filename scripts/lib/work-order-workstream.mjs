import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { dependencyHeader } from "./dependencies.mjs";
import { docPath, docRelative } from "./config.mjs";
import { containedRegularFile, parseJson } from "./paths.mjs";

const WORKSTREAM = /^WS-\d{3}$/u;
const ORDER = /^WO-\d{3}$/u;
const COMMIT = /^(?:[0-9a-f]{40}|[0-9a-f]{64}|unknown)$/u;
export const workstreamSnapshotPrefix = "<!-- dotln-workstreams: ";

/** Membership is declared only in leading metadata, like Repository. */
export const parseWorkstreamDeclaration = (markdown, path) => {
  const { lines, first, end } = dependencyHeader(markdown);
  const fields = lines
    .slice(first + 1, end)
    .filter((line) => /^\*\*Workstream:\*\*/u.test(line));
  if (!fields.length) return undefined;
  if (fields.length !== 1)
    throw new Error(`${path}: duplicate **Workstream:** lines`);
  const match = /^\*\*Workstream:\*\*\s+(WS-\d{3})\s*$/u.exec(fields[0]);
  if (!match)
    throw new Error(
      `${path}: malformed **Workstream:** line; expected **Workstream:** WS-NNN`,
    );
  return match[1];
};

/** Read the document contract without observing any target checkout. */
export const readWorkstreams = (root, rows) => {
  const directory = docPath(root, "workstreams");
  const byId = new Map(rows.map((row) => [row.id, row]));
  const streams = [];
  const seen = new Set();
  for (const name of existsSync(directory)
    ? readdirSync(directory).sort()
    : []) {
    const filename = /^(WS-\d{3})-.+\.md$/u.exec(name);
    if (!filename) continue;
    const path = docRelative(root, "workstreams", name);
    const file = join(directory, name);
    if (!containedRegularFile(file, root))
      throw new Error(`${path}: expected a contained regular file`);
    const lines = readFileSync(file, "utf8").split(/\r?\n/u);
    const positions = (marker) =>
      lines.flatMap((line, index) => (line === marker ? [index] : []));
    const starts = positions("<!-- dotln-workstream:start -->");
    const ends = positions("<!-- dotln-workstream:end -->");
    if (starts.length !== 1 || ends.length !== 1 || starts[0] >= ends[0])
      throw new Error(`${path}: expected one dotln-workstream block`);
    const stream = parseJson(
      lines.slice(starts[0] + 1, ends[0]).join("\n"),
      path,
    );
    if (
      !stream ||
      typeof stream !== "object" ||
      Array.isArray(stream) ||
      stream.id !== filename[1] ||
      seen.has(stream.id) ||
      Object.keys(stream).some(
        (key) => !["id", "members", "edges", "track"].includes(key),
      ) ||
      (stream.track !== undefined && stream.track !== "separate") ||
      !Array.isArray(stream.members) ||
      !Array.isArray(stream.edges)
    )
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
      if (!row || row.workstream !== stream.id)
        throw new Error(
          `${path}: ${member.workOrderId} must declare **Workstream:** ${stream.id} in its order`,
        );
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
 * projected again, so a changed declaration or verdict still stales the page. */
export const readWorkstreamSnapshot = (source, path) => {
  const lines = source
    .split("\n")
    .filter((line) => line.includes("<!-- dotln-workstreams:"));
  if (
    lines.length !== 1 ||
    !lines[0].startsWith(workstreamSnapshotPrefix) ||
    !lines[0].endsWith(" -->")
  )
    throw new Error(
      `${path}: missing or malformed workstream snapshot; run npm run work-orders -- index`,
    );
  const record = parseJson(
    lines[0].slice(workstreamSnapshotPrefix.length, -4),
    path,
  );
  if (!record || !Array.isArray(record.workstreams))
    throw new Error(`${path}: invalid workstream snapshot`);
  const facts = new Map();
  const streams = new Set();
  for (const stream of record.workstreams) {
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
