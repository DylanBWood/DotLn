import type { SpawnSyncReturns } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  canonicalStringify,
  decodeSourceBundle,
  type SourceBundle,
  type SourceDiscussionEntry,
  type SourceRole,
  type SourceSection,
  type SourceSpan,
} from "@dotln/compiler";

/** Read-only SourceAdapter (WO-062). Persist only screened source text and
 * declared receipt metadata, without adding raw replies, diagnostics, author
 * logins or target selectors as metadata. The WO-060 screen is a declared
 * filter, not a detector of every secret. Consumers must inspect the receipt
 * or call requireCompleteIssueBundle before treating the input as complete.
 *
 * GitHub's observed UserContentEdit.diff values are full versions, newest first,
 * with the newest matching current text. Screen them without storing their text;
 * revisions cover retained current content and receipt history is text-free.
 * The declared fields do not supply image bytes or their hashes.
 * Image markup stays in its original text; its receipt span records that the
 * content hash is unavailable. No URL hash is misrepresented as an image hash.
 */
export const ISSUE_SOURCE_FIELDS = Object.freeze({
  issue: [
    "id",
    "number",
    "title",
    "body",
    "updatedAt",
    "author",
    "userContentEdits",
    "comments",
  ],
  comment: [
    "id",
    "body",
    "author",
    "createdAt",
    "updatedAt",
    "userContentEdits",
  ],
  author: ["__typename", "login"],
  edits: ["userContentEdits", "id", "editedAt", "diff"],
  connection: ["nodes", "pageInfo", "hasNextPage", "endCursor"],
});
export const ISSUE_AUTOMATION_PATTERN = /\[bot\]$/iu;
export interface AbsentIssueField {
  readonly path: string;
  readonly reason: "missing" | "unavailable";
}
export interface RefusedIssueItem {
  readonly id: string;
  readonly shape: string;
  readonly path: string;
  readonly span: SourceSpan;
}
export interface OmittedIssueItem {
  readonly id: string;
  readonly path: string;
  readonly reason: "undetermined-role";
}
export interface IssueBundleReceipt {
  readonly schemaVersion: 1;
  readonly bundleHash: string;
  readonly status: "ready" | "stopped";
  readonly refused: readonly RefusedIssueItem[];
  readonly omitted: readonly OmittedIssueItem[];
  readonly absent: readonly AbsentIssueField[];
  readonly history: readonly {
    id: string;
    editedAt: string;
    subjectId: string;
  }[];
  readonly imageReferences: readonly {
    id: string;
    referencedBy: SourceSpan;
    contentHash: "unavailable";
  }[];
}
export interface IssueBundleResult {
  readonly bundle: SourceBundle;
  readonly hash: string;
  readonly status: IssueBundleReceipt["status"];
  readonly receipt: IssueBundleReceipt;
  readonly paths: { readonly bundle: string; readonly receipt: string };
}
export class IssueSourceRefusal extends Error {
  constructor(
    readonly code: "input" | "gh" | "changed" | "storage" | "incomplete",
    reason: string,
    readonly absent: readonly AbsentIssueField[] = [],
  ) {
    super(`issue source read refused: ${reason}`);
    this.name = "IssueSourceRefusal";
  }
}
type Fields = Record<string, unknown>;
type Actor = { type: string; login: string };
type Bridge = {
  executeGh: (
    cwd: string,
    args: string[],
    options?: { maxBuffer: number },
  ) => SpawnSyncReturns<string>;
  parseGitHubTarget: (repo: string) => { host: string; selector: string };
};
const ROOT = "$.data.repository.issue";
const PAGE = "pageInfo { hasNextPage endCursor }";
const INITIAL_EDITS = `userContentEdits(first: 100) { nodes { id editedAt diff } ${PAGE} }`;
const META = `id number title body updatedAt author { __typename login } ${INITIAL_EDITS}`;
const COMMENTS = `comments(first: 100, after: $cursor) { nodes { id body createdAt updatedAt author { __typename login } ${INITIAL_EDITS} } ${PAGE} }`;
const EDITS = `userContentEdits(first: 100, after: $cursor) { nodes { id editedAt diff } ${PAGE} }`;
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const frozen = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) frozen(child);
    Object.freeze(value);
  }
  return value;
};
const bad = (
  path: string,
  reason: string,
  absent: AbsentIssueField[],
): never => {
  throw new IssueSourceRefusal("input", `${path}: ${reason}`, [...absent]);
};
const object = (
  value: unknown,
  path: string,
  absent: AbsentIssueField[],
): Fields =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Fields)
    : bad(path, "expected an object", absent);
const text = (
  value: unknown,
  path: string,
  absent: AbsentIssueField[],
): string =>
  typeof value === "string" ? value : bad(path, "expected a string", absent);
const field = (
  raw: Fields,
  key: string,
  path: string,
  absent: AbsentIssueField[],
) => {
  if (!Object.hasOwn(raw, key) || raw[key] === null) {
    absent.push({
      path: `${path}.${key}`,
      reason: Object.hasOwn(raw, key) ? "unavailable" : "missing",
    });
    return undefined;
  }
  return raw[key];
};
const required = (
  raw: Fields,
  key: string,
  path: string,
  absent: AbsentIssueField[],
) => {
  const value = field(raw, key, path, absent);
  return value === undefined
    ? bad(`${path}.${key}`, "required field absent", absent)
    : value;
};
const timestamp = (
  value: unknown,
  path: string,
  absent: AbsentIssueField[],
) => {
  const stamp = text(value, path, absent);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/u.test(stamp) ||
    !Number.isFinite(Date.parse(stamp)) ||
    new Date(stamp).toISOString().slice(0, 19) !== stamp.slice(0, 19)
  )
    bad(path, "expected a UTC timestamp", absent);
  return stamp;
};
function author(
  value: unknown,
  path: string,
  absent: AbsentIssueField[],
): Actor | undefined {
  if (value === undefined) return undefined;
  const raw = object(value, path, absent);
  const type = text(
    required(raw, "__typename", path, absent),
    `${path}.__typename`,
    absent,
  );
  if (
    ![
      "Bot",
      "User",
      "Organization",
      "Mannequin",
      "EnterpriseUserAccount",
    ].includes(type)
  )
    bad(`${path}.__typename`, "unrecognized actor type", absent);
  return {
    type,
    login: text(
      required(raw, "login", path, absent),
      `${path}.login`,
      absent,
    ).toLowerCase(),
  };
}
const whole = (id: string, value: string, discussion = false): SourceSpan =>
  discussion
    ? { entryId: id, start: 0, end: Buffer.byteLength(value) }
    : { sectionId: id, start: 0, end: Buffer.byteLength(value) };
const empty = (bundleId = "probe", revisionId = "probe"): SourceBundle => ({
  bundleId,
  sourceKind: "github-issue",
  revisionId,
  sections: [],
  discussion: [],
  images: [],
  revisions: [],
});

function reader(
  bridge: Bridge,
  cwd: string,
  host: string,
  owner: string,
  name: string,
  number: number,
  absent: AbsentIssueField[],
) {
  const query = (
    operation: string,
    declarations: string,
    selection: string,
    variables: Record<string, string | number | undefined>,
  ) => {
    const args = [
      "api",
      "graphql",
      "--hostname",
      host,
      "-f",
      `query=query ${operation}(${declarations}) { ${selection} }`,
    ];
    for (const [key, value] of Object.entries(variables))
      if (value !== undefined)
        args.push(typeof value === "number" ? "-F" : "-f", `${key}=${value}`);
    const reply = bridge.executeGh(cwd, args, { maxBuffer: 16 * 1024 * 1024 });
    if (reply.status !== 0)
      throw new IssueSourceRefusal(
        "gh",
        `gh ${operation} failed (exit ${reply.status ?? "unavailable"})`,
      );
    let parsed: unknown;
    try {
      parsed = JSON.parse(reply.stdout);
    } catch {
      bad("$", `gh ${operation} returned invalid JSON`, absent);
    }
    const raw = object(parsed, "$", absent);
    if (
      raw["errors"] !== undefined &&
      (!Array.isArray(raw["errors"]) || raw["errors"].length)
    )
      bad("$.errors", "GraphQL errors", absent);
    return object(required(raw, "data", "$", absent), "$.data", absent);
  };
  const issue = (cursor?: string) => {
    const data = query(
      "IssueSource",
      "$owner: String!, $name: String!, $number: Int!, $cursor: String",
      `repository(owner: $owner, name: $name) { nameWithOwner issue(number: $number) { ${META} ${COMMENTS} } }`,
      { owner, name, number, cursor },
    );
    const repo = object(
      required(data, "repository", "$.data", absent),
      "$.data.repository",
      absent,
    );
    if (
      text(
        required(repo, "nameWithOwner", "$.data.repository", absent),
        "$.data.repository.nameWithOwner",
        absent,
      ).toLowerCase() !== `${owner}/${name}`.toLowerCase()
    )
      bad("$.data.repository.nameWithOwner", "repository mismatch", absent);
    const raw = object(
      required(repo, "issue", "$.data.repository", absent),
      ROOT,
      absent,
    );
    if (required(raw, "number", ROOT, absent) !== number)
      bad(`${ROOT}.number`, "issue number mismatch", absent);
    return raw;
  };
  const edits = (
    id: string,
    kind: "Issue" | "IssueComment",
    cursor?: string,
  ) => {
    const data = query(
      "IssueEdits",
      "$id: ID!, $cursor: String",
      `node(id: $id) { __typename ... on ${kind} { id ${EDITS} } }`,
      { id, cursor },
    );
    const raw = object(
      required(data, "node", "$.data", absent),
      "$.data.node",
      absent,
    );
    if (
      required(raw, "__typename", "$.data.node", absent) !== kind ||
      required(raw, "id", "$.data.node", absent) !== id
    )
      bad("$.data.node.id", "edit subject mismatch", absent);
    return raw;
  };
  return { issue, edits };
}

/** Manual pagination keeps each independent connection's cursor and checks
 * repeated cursors. A missing connection is recorded, never an invented page. */
function connection(
  read: (cursor?: string) => Fields,
  key: string,
  path: string,
  absent: AbsentIssueField[],
  observe: (raw: Fields) => void = () => {},
) {
  const nodes: unknown[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  do {
    const raw = read(cursor);
    observe(raw);
    const value = field(raw, key, path, absent);
    if (value === undefined) return nodes;
    const data = object(value, `${path}.${key}`, absent);
    const pageNodes = required(data, "nodes", `${path}.${key}`, absent);
    if (!Array.isArray(pageNodes))
      return bad(`${path}.${key}.nodes`, "expected an array", absent);
    nodes.push(...pageNodes);
    const page = object(
      required(data, "pageInfo", `${path}.${key}`, absent),
      `${path}.${key}.pageInfo`,
      absent,
    );
    const more = required(
      page,
      "hasNextPage",
      `${path}.${key}.pageInfo`,
      absent,
    );
    if (typeof more !== "boolean")
      bad(`${path}.${key}.pageInfo.hasNextPage`, "expected a boolean", absent);
    // null endCursor is the API's ordinary terminal-page value, not an absent data field.
    if (!Object.hasOwn(page, "endCursor"))
      bad(`${path}.${key}.pageInfo.endCursor`, "missing field", absent);
    if (page["endCursor"] !== null && typeof page["endCursor"] !== "string")
      bad(
        `${path}.${key}.pageInfo.endCursor`,
        "expected a string or null",
        absent,
      );
    if (!more) return nodes;
    cursor = text(
      page["endCursor"],
      `${path}.${key}.pageInfo.endCursor`,
      absent,
    );
    if (!cursor || seen.has(cursor))
      bad(`${path}.${key}.pageInfo.endCursor`, "non-advancing cursor", absent);
    seen.add(cursor);
  } while (true);
}

function immutableFile(file: string, bytes: string) {
  try {
    writeFileSync(file, bytes, { flag: "wx", mode: 0o600 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if (
      !lstatSync(file).isFile() ||
      lstatSync(file).isSymbolicLink() ||
      readFileSync(file, "utf8") !== bytes
    )
      throw new IssueSourceRefusal(
        "storage",
        "stored hash has different bytes or is not a regular file",
      );
  }
}

/** Fetches only through executeGh. No caller checkout or ambient GH target is
 * used. All remote reads, structural validation and screens precede storage. */
export async function fetchIssueBundle(
  repo: string,
  number: number,
  options: { directory: string; cwd?: string },
): Promise<IssueBundleResult> {
  if (!Number.isSafeInteger(number) || number < 1)
    throw new IssueSourceRefusal(
      "input",
      "number: expected a positive integer",
    );
  if (typeof options?.directory !== "string" || !options.directory.trim())
    throw new IssueSourceRefusal(
      "input",
      "directory: expected a caller-named store",
    );
  const bridge: Bridge = await import(
    new URL("../../../../scripts/lib/github-repository.mjs", import.meta.url)
      .href
  );
  let target: ReturnType<Bridge["parseGitHubTarget"]>;
  try {
    target = bridge.parseGitHubTarget(repo);
  } catch {
    throw new IssueSourceRefusal(
      "input",
      "repo: expected a GitHub repository URL",
    );
  }
  const [, owner, name] = target.selector.split("/");
  const cwd = options.cwd ?? process.cwd();
  if (bridge.executeGh(cwd, ["--version"]).status !== 0)
    throw new IssueSourceRefusal(
      "gh",
      "gh is required for the read-only issue fetch",
    );
  if (
    bridge.executeGh(cwd, ["auth", "status", "--hostname", target.host])
      .status !== 0
  )
    throw new IssueSourceRefusal(
      "gh",
      "gh authentication is required for the read-only issue fetch",
    );
  const absent: AbsentIssueField[] = [];
  const refused: RefusedIssueItem[] = [];
  const omitted: OmittedIssueItem[] = [];
  const host = target.host;
  const api = reader(bridge, cwd, host, owner!, name!, number, absent);
  const sections: SourceSection[] = [];
  const discussion: SourceDiscussionEntry[] = [];
  const revisions: SourceBundle["revisions"][number][] = [];
  const history: IssueBundleReceipt["history"][number][] = [];
  const images: IssueBundleReceipt["imageReferences"][number][] = [];
  const ids = new Set<string>();
  const id = (value: unknown, path: string) => {
    const raw = text(value, path, absent);
    if (
      !raw ||
      !decodeSourceBundle(
        {
          ...empty(),
          sections: [{ id: "id", text: raw, span: whole("id", raw) }],
        },
        { allowedHosts: [host] },
      ).ok
    )
      bad(path, "expected a screenable node identifier", absent);
    return { raw, local: `node:${digest(raw)}` };
  };
  const screen = (
    item: SourceSection | SourceDiscussionEntry,
    path: string,
  ): boolean => {
    const result = decodeSourceBundle(
      {
        ...empty(),
        ...("author" in item ? { discussion: [item] } : { sections: [item] }),
      },
      { allowedHosts: [host] },
    );
    if (!result.ok) {
      if (result.refusal === "malformed")
        return bad(path, `${result.path}: ${result.reason}`, absent);
      for (const finding of result.findings)
        refused.push({
          id: item.id,
          shape: finding.id,
          path,
          span: finding.span!,
        });
      return false;
    }
    return true;
  };
  const add = (
    item: SourceSection | SourceDiscussionEntry,
    path: string,
  ): SourceSpan | undefined => {
    if (ids.has(item.id))
      bad(`${path}.id`, "duplicate node identifier", absent);
    ids.add(item.id);
    if (!screen(item, path)) return undefined;
    if ("author" in item) discussion.push(item);
    else sections.push(item);
    // Declared reference forms: inline Markdown images and HTML img tags.
    for (const match of item.text.matchAll(
      /!\[[^\]\r\n]*\]\([^\r\n]*?\)|<img\b[^>]*>/giu,
    )) {
      const start = Buffer.byteLength(item.text.slice(0, match.index));
      const end = start + Buffer.byteLength(match[0]);
      const referencedBy: SourceSpan =
        "entryId" in item.span
          ? { entryId: item.id, start, end }
          : { sectionId: item.id, start, end };
      images.push({
        id: `image-${images.length + 1}`,
        referencedBy,
        contentHash: "unavailable",
      });
    }
    return item.span;
  };
  let first: Fields | undefined;
  const meta = (raw: Fields) =>
    Object.fromEntries(
      ISSUE_SOURCE_FIELDS.issue
        .filter((key) => key !== "comments")
        .map((key) => [key, raw[key]]),
    );
  const comments = connection(api.issue, "comments", ROOT, absent, (raw) => {
    if (!first) first = raw;
    else if (canonicalStringify(meta(raw)) !== canonicalStringify(meta(first)))
      throw new IssueSourceRefusal(
        "changed",
        "issue changed during pagination",
      );
  });
  const issue = first!;
  const issueId = id(required(issue, "id", ROOT, absent), `${ROOT}.id`);
  const sourceIds = new Set([issueId.local]);
  const editIds = new Set<string>();
  const updatedAt = timestamp(
    required(issue, "updatedAt", ROOT, absent),
    `${ROOT}.updatedAt`,
    absent,
  );
  const issueAuthor = author(
    field(issue, "author", ROOT, absent),
    `${ROOT}.author`,
    absent,
  );
  const currentSpans: SourceSpan[] = [];
  for (const key of ["title", "body"]) {
    const value = field(issue, key, ROOT, absent);
    if (value === undefined) continue;
    const content = text(value, `${ROOT}.${key}`, absent);
    const span = add(
      { id: key, text: content, span: whole(key, content) },
      `${ROOT}.${key}`,
    );
    if (span) currentSpans.push(span);
  }
  const readHistory = (
    subject: { raw: string; local: string },
    kind: "Issue" | "IssueComment",
    spans: SourceSpan[],
    path: string,
    initial: Fields,
  ) => {
    const edits = connection(
      (cursor) =>
        cursor === undefined ? initial : api.edits(subject.raw, kind, cursor),
      "userContentEdits",
      path,
      absent,
    );
    for (const [index, value] of edits.entries()) {
      const editPath = `${path}.userContentEdits.nodes[${index}]`;
      const raw = object(value, editPath, absent);
      const edit = id(required(raw, "id", editPath, absent), `${editPath}.id`);
      if (editIds.has(edit.local))
        bad(`${editPath}.id`, "duplicate edit identifier", absent);
      editIds.add(edit.local);
      const editedAt = timestamp(
        required(raw, "editedAt", editPath, absent),
        `${editPath}.editedAt`,
        absent,
      );
      const diff = field(raw, "diff", editPath, absent);
      if (diff !== undefined) {
        const content = text(diff, `${editPath}.diff`, absent);
        screen(
          {
            id: `edit:${edit.local}`,
            text: content,
            span: whole(`edit:${edit.local}`, content),
          },
          `${editPath}.diff`,
        );
      }
      history.push({
        id: edit.local,
        editedAt,
        subjectId: subject.local,
      });
      // Full historical versions are not current document sections. Keep only
      // conservative whole-subject coverage in current coordinates. An omitted
      // subject has no retained spans; its history must never restore its text.
      revisions.push({
        revisionId: edit.local,
        changedSpans: [...spans],
      });
    }
  };
  readHistory(issueId, "Issue", currentSpans, ROOT, issue);
  for (const [index, value] of comments.entries()) {
    const path = `${ROOT}.comments.nodes[${index}]`;
    const raw = object(value, path, absent);
    const commentId = id(required(raw, "id", path, absent), `${path}.id`);
    if (sourceIds.has(commentId.local))
      bad(`${path}.id`, "duplicate node identifier", absent);
    sourceIds.add(commentId.local);
    timestamp(
      required(raw, "updatedAt", path, absent),
      `${path}.updatedAt`,
      absent,
    );
    const createdAt = timestamp(
      required(raw, "createdAt", path, absent),
      `${path}.createdAt`,
      absent,
    );
    const actor = author(
      field(raw, "author", path, absent),
      `${path}.author`,
      absent,
    );
    const valueText = field(raw, "body", path, absent);
    const spans: SourceSpan[] = [];
    const automation =
      actor !== undefined &&
      (actor.type === "Bot" || ISSUE_AUTOMATION_PATTERN.test(actor.login));
    const roleKnown =
      actor !== undefined && (automation || issueAuthor !== undefined);
    if (!roleKnown)
      omitted.push({ id: commentId.local, path, reason: "undetermined-role" });
    if (valueText !== undefined) {
      const content = text(valueText, `${path}.body`, absent);
      if (roleKnown) {
        const role: SourceRole = automation
          ? "automation"
          : actor!.login === issueAuthor!.login
            ? "reporter"
            : "reviewer";
        const span = add(
          {
            id: commentId.local,
            author: role,
            text: content,
            span: whole(commentId.local, content, true),
            createdAt,
          },
          `${path}.body`,
        );
        if (span) spans.push(span);
      }
    }
    readHistory(commentId, "IssueComment", spans, path, raw);
  }
  const endComments = connection(api.issue, "comments", ROOT, [], (raw) => {
    if (canonicalStringify(meta(raw)) !== canonicalStringify(meta(issue)))
      throw new IssueSourceRefusal("changed", "issue changed during read");
  });
  if (canonicalStringify(comments) !== canonicalStringify(endComments))
    throw new IssueSourceRefusal("changed", "discussion changed during read");
  history.sort(
    (left, right) =>
      Date.parse(left.editedAt) - Date.parse(right.editedAt) ||
      (left.id < right.id ? -1 : left.id > right.id ? 1 : 0),
  );
  const historyOrder = new Map(history.map((item, index) => [item.id, index]));
  revisions.sort(
    (left, right) =>
      historyOrder.get(left.revisionId)! - historyOrder.get(right.revisionId)!,
  );
  const decoded = decodeSourceBundle(
    { ...empty(issueId.local, updatedAt), sections, discussion, revisions },
    { allowedHosts: [host] },
  );
  if (!decoded.ok) {
    if (decoded.refusal === "malformed")
      bad(decoded.path, decoded.reason, absent);
    throw new IssueSourceRefusal(
      "input",
      "assembled bundle failed the declared screen",
    );
  }
  const uniqueAbsent = [
    ...new Map(absent.map((item) => [item.path, item])).values(),
  ];
  const receipt: IssueBundleReceipt = frozen({
    schemaVersion: 1,
    bundleHash: decoded.hash,
    status:
      refused.length || omitted.length || uniqueAbsent.length
        ? "stopped"
        : "ready",
    refused,
    omitted,
    absent: uniqueAbsent,
    history,
    imageReferences: images,
  });
  const directory = resolve(options.directory);
  const stem = decoded.hash.replace(":", "-");
  const bytes = canonicalStringify(decoded.bundle);
  const receiptBytes = canonicalStringify(receipt);
  const paths = {
    bundle: join(directory, `${stem}.json`),
    receipt: join(directory, `${stem}.receipt-${digest(receiptBytes)}.json`),
  };
  try {
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    immutableFile(paths.bundle, bytes);
    immutableFile(paths.receipt, receiptBytes);
  } catch (error) {
    if (error instanceof IssueSourceRefusal) throw error;
    throw new IssueSourceRefusal(
      "storage",
      "caller-named store is unavailable",
    );
  }
  return frozen({
    bundle: decoded.bundle,
    hash: decoded.hash,
    status: receipt.status,
    receipt,
    paths,
  });
}

export function requireCompleteIssueBundle(
  result: IssueBundleResult,
): SourceBundle {
  if (result.status === "stopped") {
    const first = result.receipt.refused[0];
    const omitted = result.receipt.omitted[0];
    throw new IssueSourceRefusal(
      "incomplete",
      first
        ? `item ${first.id} (${first.shape}) was omitted`
        : omitted
          ? `item ${omitted.id} (${omitted.reason}) was omitted`
          : `${result.receipt.absent[0]!.path} is absent`,
      result.receipt.absent,
    );
  }
  return result.bundle;
}
