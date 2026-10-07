import { join } from "node:path";
import { canonicalStringify, decodeSourceBundle } from "@dotln/compiler";
import { appendEvent, decodeLog } from "@dotln/kernel";
import { WorkerStore } from "../../packages/skeleton/dist/src/worker-store.js";
import { executeGh, parseGitHubTarget } from "./github-repository.mjs";
import { TARGET_PUBLISH_HOST } from "./target-publish.mjs";

export const PULL_REQUEST_OBSERVER = "pull-request-observer";
/** @typedef {{id: string, role: 'automation'|'reporter'|'reviewer', path?: string,
 * line?: number, threadId?: string, text?: string, resolved: boolean,
 * class: 'ci-failure'|'automated-review'|'human-review'|'resolved',
 * refused?: {shape: string, path: string,
 * span?: {entryId: string, start: number, end: number}}}} ObservedComment
 * @typedef {{repositoryId: string, number: number, headSha: string,
 * checks: Array<{name: string, state: string}>, comments: ObservedComment[]}} PullRequestStateObserved
 */
class ObservationRefusal extends Error {}
const refuse = (reason) =>
  new ObservationRefusal(`pull request observation refused: ${reason}`);
export const observationErrorMessage = (error) =>
  error instanceof ObservationRefusal
    ? error.message
    : error instanceof Error &&
        error.message === "worker store already has a live host"
      ? "pull request observation refused: publication store already has a live host"
      : "pull request observation refused: observer execution failed";
const bad = (path, reason) => {
  throw refuse(`${path}: ${reason}`);
};
const object = (value, path) =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value
    : bad(path, "expected an object");
const string = (value, path) =>
  typeof value === "string" ? value : bad(path, "expected a string");
const identifier = (value, path) =>
  string(value, path).length > 0
    ? value
    : bad(path, "expected a node identifier");
// GraphQL opaque IDs and cursors use a bounded base64/URL-safe alphabet.
const argumentToken = (value, path) =>
  typeof value === "string" &&
  value.length <= 1024 &&
  /^[A-Za-z0-9_+/=-]+$/u.test(value)
    ? value
    : bad(path, "expected a bounded opaque argument token");
const positive = (value, path) =>
  Number.isSafeInteger(value) && value > 0
    ? value
    : bad(path, "expected a positive integer");
const bool = (value, path) =>
  typeof value === "boolean" ? value : bad(path, "expected a boolean");
const sha = (value, path) =>
  typeof value === "string" && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(value)
    ? value
    : bad(path, "expected a Git object id");
const same = (a, b) => canonicalStringify(a) === canonicalStringify(b);
const sorted = (items) =>
  items.sort((a, b) => {
    const left = canonicalStringify(a),
      right = canonicalStringify(b);
    return left < right ? -1 : left > right ? 1 : 0;
  });
const PAGE = "pageInfo { hasNextPage endCursor }";
const AUTHOR = "author { __typename login }";
const COMMENT = `id body ${AUTHOR}`;
const META = `number headRefOid ${AUTHOR}`;
const STATUS = [
  "COMPLETED",
  "IN_PROGRESS",
  "PENDING",
  "QUEUED",
  "REQUESTED",
  "WAITING",
];
/** A check in one of these states has not finished; a finished CheckRun
 * reports its conclusion and a StatusContext its final state. */
export const UNFINISHED_CHECK_STATES = new Set([
  ...STATUS.filter((status) => status !== "COMPLETED"),
  "EXPECTED",
]);
const CONCLUSION = [
  "ACTION_REQUIRED",
  "CANCELLED",
  "FAILURE",
  "NEUTRAL",
  "SKIPPED",
  "STALE",
  "STARTUP_FAILURE",
  "SUCCESS",
  "TIMED_OUT",
];
const CI_FAILURES = new Set([
  "FAILURE",
  "ERROR",
  "TIMED_OUT",
  "STARTUP_FAILURE",
  "ACTION_REQUIRED",
]);
const enumeration = (value, values, path) =>
  values.includes(value) ? value : bad(path, "unrecognized state");
const ACTORS = [
  "Bot",
  "EnterpriseUserAccount",
  "Mannequin",
  "Organization",
  "User",
];
const actor = (value, path) => {
  if (value === null) return null;
  const author = object(value, path);
  return {
    type: enumeration(author.__typename, ACTORS, `${path}.__typename`),
    login: string(author.login, `${path}.login`).toLowerCase(),
  };
};

// Body contents are transient. Even errors must not echo an API response.
function bundle(text, role) {
  const id = "comment";
  return {
    bundleId: "pull-request-comment",
    sourceKind: "github-pull-request",
    revisionId: "observation",
    sections: [],
    images: [],
    revisions: [],
    discussion: [
      {
        id,
        author: role,
        text,
        span: { entryId: id, start: 0, end: Buffer.byteLength(text) },
        createdAt: "1970-01-01T00:00:00Z",
      },
    ],
  };
}
function screen(text, role, host, path) {
  let result;
  try {
    result = decodeSourceBundle(bundle(text, role), { allowedHosts: [host] });
  } catch (error) {
    if (error instanceof RangeError)
      return { shape: "unscreenable-text", path };
    throw error;
  }
  if (result.ok) return undefined;
  if (result.refusal === "malformed") return { shape: "malformed-text", path };
  const finding = result.findings[0];
  return { shape: finding.id, path, span: finding.span };
}
function comment(
  raw,
  path,
  resolved,
  pullAuthor,
  host,
  {
    inline = false,
    ci = false,
    check = false,
    threadId,
    bodyPath = `${path}.body`,
  } = {},
) {
  object(raw, path);
  const nodeId = identifier(raw.id, `${path}.id`);
  const idRefusal = screen(nodeId, "reviewer", host, `${path}.id`);
  const id = ci ? `ci:${nodeId}` : check ? `check:${nodeId}` : nodeId;
  const author = check ? null : actor(raw.author, `${path}.author`);
  const role =
    check || author?.type === "Bot"
      ? "automation"
      : author !== null && same(author, pullAuthor)
        ? "reporter"
        : "reviewer";
  const item = {
    ...(idRefusal ? {} : { id }),
    role,
    resolved,
    class: ci
      ? "ci-failure"
      : resolved
        ? "resolved"
        : role === "automation"
          ? "automated-review"
          : "human-review",
  };
  let refusal = idRefusal;
  if (threadId !== undefined) {
    const refused = screen(threadId, role, host, `${path}.threadId`);
    if (refused) refusal ??= refused;
    else item.threadId = threadId;
  }
  if (inline) {
    const file = string(raw.path, `${path}.path`);
    const pathRefusal = screen(file, role, host, `${path}.path`);
    const line =
      raw.line === null ? undefined : positive(raw.line, `${path}.line`);
    if (!pathRefusal) {
      item.path = file;
      if (line !== undefined) item.line = line;
    }
    refusal ??= pathRefusal;
  }
  const text = string(raw.body, bodyPath);
  refusal ??= screen(text, role, host, bodyPath);
  if (refusal) item.refused = refusal;
  else item.text = text;
  return item;
}

// Rejected identifiers never become hashes or other content-derived ids. These
// local placeholders are not forge ids and are actionable only after rereading.
function identifyRefused(comments) {
  const used = new Set(
    comments.filter((item) => item.id !== undefined).map((item) => item.id),
  );
  let ordinal = 0;
  for (const item of sorted(comments)) {
    if (item.id !== undefined) continue;
    let id;
    do {
      id = `refused:${++ordinal}`;
    } while (used.has(id));
    item.id = id;
    used.add(id);
  }
  return comments;
}

/** Read only GraphQL queries, with explicit forge targeting. No raw response
 * (including stderr, parse diagnostics and partial GraphQL errors) is persisted. */
function reader(cwd, host, owner, name, number) {
  const api = (operation, declarations, query, variables = {}) => {
    const args = [
      "api",
      "graphql",
      "--hostname",
      host,
      "-f",
      `query=query ${operation}(${declarations}) { ${query} }`,
    ];
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined)
        args.push(typeof value === "number" ? "-F" : "-f", `${key}=${value}`);
    }
    const result = executeGh(cwd, args, { maxBuffer: 16 * 1024 * 1024 });
    if (result.status !== 0)
      throw refuse(
        `gh ${operation} failed (exit ${result.status ?? "unavailable"})`,
      );
    let parsed;
    try {
      parsed = JSON.parse(result.stdout);
    } catch {
      bad("$", `gh ${operation} returned invalid JSON`);
    }
    object(parsed, "$");
    if (
      parsed.errors !== undefined &&
      (!Array.isArray(parsed.errors) || parsed.errors.length)
    )
      bad("$.errors", `gh ${operation} returned GraphQL errors`);
    return object(parsed.data, "$.data");
  };
  const pr = (operation, fields, cursor) => {
    const data = api(
      operation,
      "$owner: String!, $name: String!, $number: Int!" +
        (fields ? ", $cursor: String" : ""),
      `repository(owner: $owner, name: $name) { nameWithOwner pullRequest(number: $number) { ${META} ${fields} } }`,
      { owner, name, number, ...(fields ? { cursor } : {}) },
    );
    const repository = object(data.repository, "$.data.repository");
    if (
      string(
        repository.nameWithOwner,
        "$.data.repository.nameWithOwner",
      ).toLowerCase() !== `${owner}/${name}`.toLowerCase()
    )
      bad("$.data.repository.nameWithOwner", "repository mismatch");
    const pull = object(
      repository.pullRequest,
      "$.data.repository.pullRequest",
    );
    if (
      positive(pull.number, "$.data.repository.pullRequest.number") !== number
    )
      bad("$.data.repository.pullRequest.number", "pull request mismatch");
    sha(pull.headRefOid, "$.data.repository.pullRequest.headRefOid");
    actor(pull.author, "$.data.repository.pullRequest.author");
    return pull;
  };
  return { api, pr };
}
function pages(read, path, consume) {
  let cursor;
  const seen = new Set();
  do {
    const page = object(read(cursor), path);
    if (!Array.isArray(page.nodes)) bad(`${path}.nodes`, "expected an array");
    page.nodes.forEach((node, index) =>
      consume(
        object(node, `${path}.nodes[${index}]`),
        `${path}.nodes[${index}]`,
      ),
    );
    const info = object(page.pageInfo, `${path}.pageInfo`);
    const more = bool(info.hasNextPage, `${path}.pageInfo.hasNextPage`);
    if (info.endCursor !== null)
      argumentToken(info.endCursor, `${path}.pageInfo.endCursor`);
    if (!more) return;
    cursor = argumentToken(info.endCursor, `${path}.pageInfo.endCursor`);
    if (!cursor || seen.has(cursor) || !page.nodes.length)
      bad(`${path}.pageInfo.endCursor`, "pagination did not advance");
    seen.add(cursor);
  } while (true);
}
function recorded(events, number, repositoryId) {
  const matches = events.filter(
    (event) =>
      event.actorId === TARGET_PUBLISH_HOST &&
      event.type === "PullRequestOpened" &&
      event.payload.number === number &&
      (repositoryId === undefined ||
        event.payload.repositoryId === repositoryId),
  );
  if (matches.length !== 1)
    throw refuse(
      "expected exactly one recorded PullRequestOpened for this number and repository",
    );
  const opened = matches[0];
  const payload = object(opened.payload, "$.PullRequestOpened");
  positive(payload.number, "$.PullRequestOpened.number");
  sha(payload.headSha, "$.PullRequestOpened.headSha");
  const name = string(payload.repositoryId, "$.PullRequestOpened.repositoryId");
  if (!/^[A-Za-z0-9.-]+\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(name))
    bad("$.PullRequestOpened.repositoryId", "expected HOST/OWNER/REPO");
  let target;
  try {
    target = parseGitHubTarget(`https://${name}`);
  } catch {
    bad("$.PullRequestOpened.repositoryId", "invalid target");
  }
  if (target.selector !== name)
    bad("$.PullRequestOpened.repositoryId", "noncanonical target");
  try {
    decodeSourceBundle(bundle("", "reviewer"), { allowedHosts: [target.host] });
  } catch {
    bad(
      "$.PullRequestOpened.repositoryId",
      "forge host is not admitted by source-bundle screen",
    );
  }
  return opened;
}

/** Observe one PR already opened by DotLn. `store` is the episode directory,
 * not its publication/ child. Remote state can change between requests; a
 * changed head/author refuses. This is a paged observation, not an atomic
 * GitHub snapshot. The screen is a declared filter, not every-secret detection. */
function observePullRequestInternal({
  cwd = process.cwd(),
  store,
  number,
  repositoryId,
  now = Date.now(),
  log = () => {},
}) {
  positive(number, "$.number");
  const publication = new WorkerStore(join(store, "publication"));
  recorded(decodeLog(publication.read()), number, repositoryId);
  publication.acquire();
  try {
    const events = decodeLog(publication.read());
    const opened = recorded(events, number, repositoryId);
    const [host, owner, name] = opened.payload.repositoryId.split("/");
    const { api, pr } = reader(cwd, host, owner, name, number);
    const initial = pr("DotlnPullRequest", "");
    const pullAuthor = actor(
      initial.author,
      "$.data.repository.pullRequest.author",
    );
    const stable = (pull) => {
      if (
        pull.headRefOid !== initial.headRefOid ||
        !same(
          actor(pull.author, "$.data.repository.pullRequest.author"),
          pullAuthor,
        )
      )
        throw refuse(
          "pull request head or author changed during observation; retry",
        );
      return pull;
    };
    const checks = [],
      comments = [];
    const checkIds = new Set(),
      commentIds = new Set(),
      threadIds = new Set();
    const unique = (set, id, path) => {
      if (set.has(id)) bad(`${path}.id`, "duplicate node identifier");
      set.add(id);
    };
    const addComment = (raw, path, resolved, options) => {
      const nodeId = identifier(raw.id, `${path}.id`);
      const id = options?.ci
        ? `ci:${nodeId}`
        : options?.check
          ? `check:${nodeId}`
          : nodeId;
      unique(commentIds, id, path);
      const item = comment(raw, path, resolved, pullAuthor, host, options);
      comments.push(item);
    };
    pages(
      (cursor) => {
        const data = api(
          "DotlnChecks",
          "$owner: String!, $name: String!, $head: GitObjectID!, $cursor: String",
          `repository(owner: $owner, name: $name) { object(oid: $head) { ... on Commit { oid statusCheckRollup { contexts(first: 100, after: $cursor) { ${PAGE} nodes { __typename ... on CheckRun { id name status conclusion } ... on StatusContext { id context state } } } } } } }`,
          { owner, name, head: initial.headRefOid, cursor },
        );
        const commit = object(
          object(data.repository, "$.data.repository").object,
          "$.data.repository.object",
        );
        if (commit.oid !== initial.headRefOid)
          bad("$.data.repository.object.oid", "head mismatch");
        if (commit.statusCheckRollup === null) {
          if (cursor !== undefined)
            bad(
              "$.data.repository.object.statusCheckRollup",
              "rollup disappeared during pagination",
            );
          return {
            nodes: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          };
        }
        return object(
          commit.statusCheckRollup,
          "$.data.repository.object.statusCheckRollup",
        ).contexts;
      },
      "$.data.repository.object.statusCheckRollup.contexts",
      (raw, path) => {
        const id = identifier(raw.id, `${path}.id`);
        unique(checkIds, id, path);
        let name, state, namePath;
        if (raw.__typename === "CheckRun") {
          namePath = `${path}.name`;
          name = string(raw.name, namePath);
          const status = enumeration(raw.status, STATUS, `${path}.status`);
          if (raw.conclusion !== null)
            enumeration(raw.conclusion, CONCLUSION, `${path}.conclusion`);
          state =
            status === "COMPLETED"
              ? enumeration(raw.conclusion, CONCLUSION, `${path}.conclusion`)
              : status;
        } else if (raw.__typename === "StatusContext") {
          namePath = `${path}.context`;
          name = string(raw.context, namePath);
          state = enumeration(
            raw.state,
            ["ERROR", "EXPECTED", "FAILURE", "PENDING", "SUCCESS"],
            `${path}.state`,
          );
        } else bad(`${path}.__typename`, "expected CheckRun or StatusContext");
        const refused = screen(name, "automation", host, namePath);
        checks.push({ name: refused ? "[refused]" : name, state });
        if (CI_FAILURES.has(state) || refused)
          addComment({ id, body: name }, path, false, {
            check: true,
            ci: CI_FAILURES.has(state),
            bodyPath: namePath,
          });
      },
    );
    for (const field of ["comments", "reviews"]) {
      pages(
        (cursor) =>
          stable(
            pr(
              field === "comments" ? "DotlnComments" : "DotlnReviews",
              `${field}(first: 100, after: $cursor) { ${PAGE} nodes { ${COMMENT} ${field === "reviews" ? "state" : ""} } }`,
              cursor,
            ),
          )[field],
        `$.data.repository.pullRequest.${field}`,
        (raw, path) => {
          // An empty approval/review carries no comment; pending reviews aren't published.
          if (field === "reviews") {
            enumeration(
              raw.state,
              [
                "APPROVED",
                "CHANGES_REQUESTED",
                "COMMENTED",
                "DISMISSED",
                "PENDING",
              ],
              `${path}.state`,
            );
            identifier(raw.id, `${path}.id`);
            actor(raw.author, `${path}.author`);
            string(raw.body, `${path}.body`);
            if (raw.state === "PENDING" || !raw.body) return;
          }
          addComment(raw, path, false);
        },
      );
    }
    pages(
      (cursor) =>
        stable(
          pr(
            "DotlnThreads",
            `reviewThreads(first: 100, after: $cursor) { ${PAGE} nodes { id isResolved comments(first: 1) { ${PAGE} nodes { ${COMMENT} path line state } } } }`,
            cursor,
          ),
        ).reviewThreads,
      "$.data.repository.pullRequest.reviewThreads",
      (thread, path) => {
        const id = argumentToken(thread.id, `${path}.id`);
        unique(threadIds, id, path);
        const resolved = bool(thread.isResolved, `${path}.isResolved`);
        pages(
          (cursor) => {
            if (cursor === undefined) return thread.comments;
            const data = api(
              "DotlnThreadComments",
              "$id: ID!, $cursor: String",
              `node(id: $id) { ... on PullRequestReviewThread { id isResolved comments(first: 100, after: $cursor) { ${PAGE} nodes { ${COMMENT} path line state } } } }`,
              { id, cursor },
            );
            const node = object(data.node, "$.data.node");
            if (node.id !== id || node.isResolved !== resolved)
              bad("$.data.node", "thread changed during observation; retry");
            return node.comments;
          },
          `${path}.comments`,
          (raw, commentPath) => {
            enumeration(
              raw.state,
              ["PENDING", "SUBMITTED"],
              `${commentPath}.state`,
            );
            if (raw.state === "PENDING") {
              identifier(raw.id, `${commentPath}.id`);
              string(raw.body, `${commentPath}.body`);
              actor(raw.author, `${commentPath}.author`);
              string(raw.path, `${commentPath}.path`);
              if (raw.line !== null) positive(raw.line, `${commentPath}.line`);
              return;
            }
            addComment(raw, commentPath, resolved, {
              inline: true,
              threadId: id,
            });
          },
        );
      },
    );
    stable(pr("DotlnPullRequest", ""));
    /** @type {PullRequestStateObserved} */
    const payload = {
      repositoryId: opened.payload.repositoryId,
      number,
      headSha: initial.headRefOid,
      checks: sorted(checks),
      comments: sorted(identifyRefused(comments)),
    };
    const previous = events
      .filter(
        (event) =>
          event.type === "PullRequestStateObserved" &&
          event.actorId === PULL_REQUEST_OBSERVER &&
          event.causationId === opened.eventId,
      )
      .at(-1);
    if (previous && same(previous.payload, payload)) {
      log("Pull request state unchanged; no event appended.");
      return { appended: false, payload };
    }
    const { event } = appendEvent(publication.read(), {
      schemaVersion: 1,
      type: "PullRequestStateObserved",
      occurredAt: now,
      actorId: PULL_REQUEST_OBSERVER,
      workstreamId: opened.workstreamId,
      correlationId: opened.correlationId,
      causationId: opened.eventId,
      payload,
    });
    publication.append(event);
    log(
      `Pull request state observed: ${checks.length} checks, ${comments.length} comments; one event appended.`,
    );
    return { appended: true, payload };
  } finally {
    publication.release();
  }
}

/** Both direct observation and the review loop share the no-echo boundary. */
export function observePullRequest(options) {
  try {
    return observePullRequestInternal(options);
  } catch (error) {
    if (error instanceof ObservationRefusal) throw error;
    throw new ObservationRefusal(observationErrorMessage(error));
  }
}
