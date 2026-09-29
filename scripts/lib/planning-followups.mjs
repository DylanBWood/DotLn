import { json as encode } from "./helpers.mjs";
import { defaultDocRelative, docRelative, rootPattern } from "./config.mjs";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

import { readDecisions } from "./meta.mjs";
import { runGit, runGitPathList, spawnGit } from "./git.mjs";
import { readAdjacentQueue } from "./adjacent-queue.mjs";
import { checkLocalTerms } from "./terms.mjs";

// The default-layout name peers and fixtures use; `followupsPath` resolves the
// same record under a launchpad's configured planning root.
export const FOLLOWUPS = defaultDocRelative("planning", "followups.json");
export const followupsPath = (root) =>
  docRelative(root, "planning", "followups.json");
const closed = new Set(["allocated", "declined", "duplicate", "settled"]);
const statuses = new Set(["open", "deferred", ...closed]);
const hash = (value) =>
  createHash("sha256")
    .update(typeof value === "string" ? value : encode(value))
    .digest("hex");
const requireFollowup = (condition, reason) => {
  if (!condition) throw new Error(`Planning follow-ups: ${reason}`);
};
const text = (value, limit = 2000) =>
  typeof value === "string" &&
  Boolean(value.trim()) &&
  value.length <= limit &&
  !/[\u0000-\u001f\u007f]/u.test(value);
const exact = (value, keys) =>
  value &&
  !Array.isArray(value) &&
  typeof value === "object" &&
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");
const compact = (value, limit) =>
  value.replace(/\s+/g, " ").trim().slice(0, limit);
const anchor = (value) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_\s-]/gu, "")
    .replace(/\s/g, "-");

// Public sources only. Refuse links rather than traversing into private intake or
// outside the checkout. The collector never reads local adjacent-item prose.
function safePath(root, path) {
  requireFollowup(
    !path.startsWith("/") &&
      path.split("/").every((part) => part && part !== "." && part !== ".."),
    "invalid public path",
  );
  let current = root;
  for (const part of path.split("/")) {
    current = join(current, part);
    let info;
    try {
      info = lstatSync(current);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (info)
      requireFollowup(!info.isSymbolicLink(), `symbolic link at ${path}`);
  }
  return current;
}
function markdownFiles(root, directory) {
  const path = safePath(root, directory);
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const child = `${directory}/${entry.name}`;
      safePath(root, child);
      if (entry.isDirectory())
        return ["archive", "refutations"].includes(entry.name)
          ? []
          : markdownFiles(root, child);
      return entry.isFile() && entry.name.endsWith(".md") ? [child] : [];
    });
}

export function collectFollowupSources(root) {
  const found = new Map();
  const add = (
    kind,
    path,
    locator,
    title,
    body,
    fragment = locator.split("::")[0],
  ) => {
    const key = `${kind}:${path}#${locator}`;
    requireFollowup(
      !found.has(key),
      `ambiguous source identity at ${path}#${locator}`,
    );
    found.set(key, {
      key,
      kind,
      source: {
        hash: hash(body),
        ref: `${path}#${fragment}`,
        title: compact(title.replace(/\*|`/g, ""), 200),
        summary: compact(body, 700),
        missing: false,
      },
    });
  };
  const files = [
    ...markdownFiles(root, docRelative(root, "product")),
    ...markdownFiles(root, docRelative(root, "planning")),
  ];
  for (const path of files) {
    const body = readFileSync(safePath(root, path), "utf8");
    // Ignore fenced examples; a candidate must be a real Markdown heading.
    const visible = body.replace(
      /^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm,
      (match) => match.replace(/[^\n]/g, " "),
    );
    const headings = [...visible.matchAll(/^(#{1,6}) (.+)$/gm)];
    const seenAnchors = new Map();
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i],
        label = heading[2],
        level = heading[1].length;
      const stem = anchor(label),
        ordinal = seenAnchors.get(stem) ?? 0;
      seenAnchors.set(stem, ordinal + 1);
      const locator = `${stem}${ordinal ? `-${ordinal}` : ""}`;
      if (
        !/^(?:candidates?\b|follow-ups?(?:\s*[—:–-]|$)|(?:preserved )?unallocated\b|deferred work\b|declined candidates\b)/i.test(
          label,
        ) &&
        !/\(candidate\)$|—.*\bcandidate(?: trial)?$/i.test(label)
      )
        continue;
      const end =
        headings.slice(i + 1).find((next) => next[1].length <= level)?.index ??
        body.length;
      const section = body.slice(heading.index, end).trim();
      if (
        /\b(candidates|follow-ups?|deferred work|unallocated)\b/i.test(label)
      ) {
        const items = [...section.matchAll(/^(?:- |\d+\. )/gm)];
        if (items.length) {
          for (let j = 0; j < items.length; j++) {
            const item = section
              .slice(items[j].index, items[j + 1]?.index ?? section.length)
              .trim();
            const title =
              item.match(/^[-\d. ]+\*\*([\s\S]*?)\*\*/)?.[1] ??
              item.split("\n")[0].replace(/^(?:- |\d+\. )/, "");
            add(
              "candidate",
              path,
              `${locator}::${hash(compact(title, 2000))}`,
              title,
              item,
            );
          }
          continue;
        }
      }
      add("candidate", path, locator, label, section);
    }
  }
  const evidence = safePath(root, docRelative(root, "evidence"));
  if (existsSync(evidence))
    for (const name of readdirSync(evidence).filter((name) =>
      /^WO-\d{3}$/.test(name),
    ))
      safePath(root, docRelative(root, "evidence", `${name}/decisions.md`));
  const decisions = readDecisions(root);
  for (const row of decisions.filter((row) => row.reopens))
    requireFollowup(
      decisions.some((decision) => decision.id === row.reopens.decisionId),
      `${row.id}: reopened decision ${row.reopens.decisionId} is missing`,
    );
  for (const decision of decisions) {
    const observations = decisions.filter(
      (row) => row.reopens?.decisionId === decision.id,
    );
    if (!decision.followup && !observations.length) continue;
    add(
      "decision",
      decision.path,
      decision.id.toLowerCase(),
      `${decision.id}: ${decision.followup ?? decision.decision}`,
      encode(
        observations.length
          ? { ...decision, reopeningObservations: observations }
          : decision,
      ),
      decision.anchor ?? decision.id.toLowerCase(),
    );
  }
  return [...found.values()].sort((a, b) => a.key.localeCompare(b.key));
}

const empty = () => ({ schemaVersion: 1, entries: [] });
const sourceId = (key) => `FUP-${hash(key).slice(0, 16)}`;
export function followupStatus(entry) {
  const disposition = entry.dispositions.at(-1);
  return disposition?.sourceRevision === entry.revisions.length
    ? disposition.status
    : entry.dispositions.length || entry.revisions.at(-1).missing
      ? "needs-review"
      : "untriaged";
}
function validate(state, root) {
  requireFollowup(
    exact(state, ["schemaVersion", "entries"]) &&
      state.schemaVersion === 1 &&
      Array.isArray(state.entries),
    "invalid register",
  );
  const keys = new Set();
  const ids = new Set();
  for (const [index, entry] of state.entries.entries()) {
    requireFollowup(
      exact(entry, ["id", "key", "kind", "revisions", "dispositions"]) &&
        (entry.id === `FUP-${String(index + 1).padStart(4, "0")}` ||
          entry.id === sourceId(entry.key)) &&
        !ids.has(entry.id) &&
        text(entry.key) &&
        !keys.has(entry.key) &&
        ["candidate", "decision"].includes(entry.kind) &&
        Array.isArray(entry.revisions) &&
        entry.revisions.length &&
        Array.isArray(entry.dispositions),
      "invalid or duplicate entry identity",
    );
    keys.add(entry.key);
    ids.add(entry.id);
    for (const rev of entry.revisions)
      requireFollowup(
        exact(rev, ["hash", "ref", "title", "summary", "missing"]) &&
          (rev.hash === null
            ? rev.missing === true
            : /^[a-f0-9]{64}$/.test(rev.hash)) &&
          text(rev.ref) &&
          new RegExp(
            `^(?:${["product", "planning", "evidence"]
              .map((key) =>
                root ? rootPattern(root, key) : defaultDocRelative(key),
              )
              .join("|")})/.+\\.md#`,
          ).test(rev.ref) &&
          text(rev.title, 200) &&
          text(rev.summary, 700) &&
          typeof rev.missing === "boolean",
        `${entry.id}: invalid source revision`,
      );
    for (const disposition of entry.dispositions)
      requireFollowup(
        exact(disposition, [
          "sourceRevision",
          "status",
          "reason",
          "reopenWhen",
          "targets",
          "at",
        ]) &&
          Number.isSafeInteger(disposition.sourceRevision) &&
          disposition.sourceRevision > 0 &&
          disposition.sourceRevision <= entry.revisions.length &&
          statuses.has(disposition.status) &&
          text(disposition.reason) &&
          (disposition.status === "open"
            ? disposition.reopenWhen === null
            : text(disposition.reopenWhen)) &&
          Array.isArray(disposition.targets) &&
          disposition.targets.every((target) => text(target, 100)) &&
          text(disposition.at, 40) &&
          Number.isFinite(Date.parse(disposition.at)),
        `${entry.id}: invalid disposition or reopening condition`,
      );
  }
  for (const entry of state.entries) {
    for (const disposition of entry.dispositions) {
      const targets = disposition.targets;
      requireFollowup(
        disposition.status === "allocated"
          ? targets.length > 0 &&
              targets.every((target) => /^WO-\d{3}$/.test(target))
          : disposition.status === "duplicate"
            ? targets.length === 1 &&
              targets[0] !== entry.id &&
              state.entries.some((other) => other.id === targets[0])
            : targets.length === 0,
        `${entry.id}: invalid disposition targets`,
      );
    }
    const seen = new Set([entry.id]);
    let next = entry;
    while (followupStatus(next) === "duplicate") {
      const target = next.dispositions.at(-1).targets[0];
      requireFollowup(!seen.has(target), "duplicate cycle");
      seen.add(target);
      next = state.entries.find((other) => other.id === target);
    }
  }
  return state;
}
function committedState(root) {
  const result = spawnGit(["show", `HEAD:${followupsPath(root)}`], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return result.status === 0
    ? validate(JSON.parse(result.stdout), root)
    : empty();
}
function retained(previous, current) {
  for (const before of previous.entries) {
    const after = current.entries.find((entry) => entry.id === before.id);
    requireFollowup(
      after &&
        after.key === before.key &&
        after.kind === before.kind &&
        encode(after.revisions.slice(0, before.revisions.length)) ===
          encode(before.revisions) &&
        encode(after.dispositions.slice(0, before.dispositions.length)) ===
          encode(before.dispositions),
      `${before.id}: committed source or disposition history was removed or rewritten`,
    );
  }
}
export function readFollowups(root) {
  const path = safePath(root, followupsPath(root));
  const state = existsSync(path)
    ? validate(JSON.parse(readFileSync(path, "utf8")), root)
    : empty();
  retained(committedState(root), state);
  requireAllocationTargets(root, state);
  return state;
}

// Entry identities, not line positions, define the register union. Histories
// must be compatible prefixes; divergent edits to the same history require
// an explicit disposition rather than renumbering past source revisions.
export function unionFollowups(primary, secondary, root) {
  const result = structuredClone(validate(primary, root));
  validate(secondary, root);
  const longer = (a, b, id) => {
    const length = Math.min(a.length, b.length);
    requireFollowup(
      encode(a.slice(0, length)) === encode(b.slice(0, length)),
      `${id}: divergent history needs authored resolution`,
    );
    return structuredClone(a.length >= b.length ? a : b);
  };
  for (const entry of secondary.entries) {
    const prior = result.entries.find((row) => row.id === entry.id);
    if (!prior) result.entries.push(structuredClone(entry));
    else {
      requireFollowup(
        prior.key === entry.key && prior.kind === entry.kind,
        `${entry.id}: incompatible identity`,
      );
      prior.revisions = longer(prior.revisions, entry.revisions, entry.id);
      prior.dispositions = longer(
        prior.dispositions,
        entry.dispositions,
        entry.id,
      );
    }
  }
  return validate(result, root);
}
function requireAllocationTargets(root, state) {
  for (const entry of state.entries.filter(
    (entry) => followupStatus(entry) === "allocated",
  ))
    for (const target of entry.dispositions.at(-1).targets) {
      const directory = safePath(root, docRelative(root, "workOrders"));
      requireFollowup(
        existsSync(directory) &&
          readdirSync(directory).some(
            (name) =>
              name.startsWith(`${target}-`) &&
              name.endsWith(".md") &&
              lstatSync(
                safePath(root, docRelative(root, "workOrders", `${name}`)),
              ).isFile(),
          ),
        `allocation target ${target} has no filed work order`,
      );
    }
}
function projected(root) {
  const state = readFollowups(root),
    sources = collectFollowupSources(root),
    present = new Set(sources.map((row) => row.key));
  for (const row of sources) {
    let entry = state.entries.find((entry) => entry.key === row.key);
    if (!entry) {
      entry = {
        // Source-derived identities keep new items distinct across worktrees.
        // The first imported register's numeric identities remain valid.
        id: sourceId(row.key),
        key: row.key,
        kind: row.kind,
        revisions: [],
        dispositions: [],
      };
      state.entries.push(entry);
    }
    if (encode(entry.revisions.at(-1)) !== encode(row.source))
      entry.revisions.push(row.source);
  }
  for (const entry of state.entries)
    // Migration decision rows remain byte-for-byte history until explicitly
    // nominated or reopened. Removing the old harvest rule is not a missing source.
    if (
      entry.kind !== "decision" &&
      !present.has(entry.key) &&
      !entry.revisions.at(-1).missing
    )
      entry.revisions.push({
        ...entry.revisions.at(-1),
        hash: null,
        missing: true,
      });
  return validate(state, root);
}
function persist(root, state) {
  const path = safePath(root, followupsPath(root)),
    temporary = safePath(root, `${followupsPath(root)}.tmp`);
  checkLocalTerms(root, [{ name: followupsPath(root), text: encode(state) }]);
  writeFileSync(temporary, encode(state), { flag: "wx" });
  renameSync(temporary, path);
}
function withLock(root, fn) {
  const directory = safePath(root, docRelative(root, "planning"));
  mkdirSync(directory, { recursive: true });
  const lock = safePath(root, `${followupsPath(root)}.lock`);
  try {
    mkdirSync(lock);
  } catch {
    throw new Error(
      "Planning follow-ups: writer active; inspect interrupted writer before retrying",
    );
  }
  try {
    return fn();
  } finally {
    rmdirSync(lock);
  }
}
export function syncFollowups(root, { check = false } = {}) {
  const run = () => {
    const state = projected(root),
      path = safePath(root, followupsPath(root));
    if (
      !existsSync(path) &&
      !state.entries.length &&
      !committedState(root).entries.length
    )
      return state;
    if (check)
      requireFollowup(
        existsSync(path) && readFileSync(path, "utf8") === encode(state),
        "register is stale; run npm run meta or npm run plan -- followups --sync",
      );
    else if (!existsSync(path) || readFileSync(path, "utf8") !== encode(state))
      persist(root, state);
    return state;
  };
  return check ? run() : withLock(root, run);
}
const timestamp = () => new Date().toISOString();
// One request against the state in hand and the revision its planner read.
function dispose(root, state, revision, request, at) {
  requireFollowup(
    exact(request, [
      "expectedRevision",
      "id",
      "sourceRevision",
      "status",
      "reason",
      "reopenWhen",
      "targets",
    ]) && request.expectedRevision === revision,
    "stale register revision or request shape; reread follow-ups",
  );
  const entry = state.entries.find((row) => row.id === request.id);
  requireFollowup(
    entry && request.sourceRevision === entry.revisions.length,
    "missing item or stale source revision",
  );
  const { expectedRevision, id, ...disposition } = request;
  entry.dispositions.push({ ...disposition, at });
  validate(state, root);
  requireAllocationTargets(root, state);
  return entry;
}
export function disposeFollowup(root, request, { now = timestamp } = {}) {
  return withLock(root, () => {
    const state = syncFollowups(root, { check: true });
    const entry = dispose(root, state, hash(state), request, now());
    persist(root, state);
    return {
      id: entry.id,
      status: followupStatus(entry),
      revision: hash(state),
    };
  });
}
// A batch binds every request to the one revision its planner read. Each is
// judged against the state the earlier ones produce; the register is written
// once, after the last, so one invalid request writes nothing.
export function disposeFollowups(root, requests, { now = timestamp } = {}) {
  return withLock(root, () => {
    const state = syncFollowups(root, { check: true }),
      revision = hash(state);
    requireFollowup(
      Array.isArray(requests) && requests.length > 0,
      "a batch names at least one request",
    );
    const applied = requests.map((request, index) => {
      try {
        const entry = dispose(root, state, revision, request, now());
        // The register is screened whole when it is written; screening each
        // request's own text first lets a refusal name the request.
        checkLocalTerms(root, [
          {
            name: `request index ${index}`,
            text: `${request.reason}\n${request.reopenWhen ?? ""}`,
          },
        ]);
        return { id: entry.id, status: followupStatus(entry) };
      } catch (error) {
        throw new Error(
          `${error.message} (request index ${index}; nothing was written)`,
        );
      }
    });
    persist(root, state);
    return { applied, revision: hash(state) };
  });
}
// Current decision records by register key, with the link their heading resolves.
const decisionSources = (root) =>
  new Map(
    readDecisions(root).map((row) => [
      `decision:${row.path}#${row.id.toLowerCase()}`,
      { row, ref: `${row.path}#${row.anchor ?? row.id.toLowerCase()}` },
    ]),
  );
const feedRow = (entry, decisions) => {
  const source = entry.revisions.at(-1),
    disposition = entry.dispositions.at(-1);
  return {
    id: entry.id,
    status: followupStatus(entry),
    sourceRevision: entry.revisions.length,
    title: source.title,
    source: decisions.get(entry.key)?.ref ?? source.ref,
    sourceMissing: source.missing,
    reason: disposition ? compact(disposition.reason, 220) : null,
    reopenWhen: disposition?.reopenWhen
      ? compact(disposition.reopenWhen, 220)
      : null,
  };
};
const pendingRank = { "needs-review": 0, open: 1, deferred: 2, untriaged: 3 };
const pendingOrder = (a, b) =>
  pendingRank[followupStatus(a)] - pendingRank[followupStatus(b)] ||
  a.id.localeCompare(b.id);
export function planningFollowups(root, { cursor = null, all = false } = {}) {
  const state = syncFollowups(root, { check: true }),
    revision = hash(state);
  const selected = state.entries.filter(
    (entry) => all || !closed.has(followupStatus(entry)),
  );
  if (!all) selected.sort(pendingOrder);
  let offset = 0;
  if (cursor !== null) {
    const match = /^([a-f0-9]{64}):(pending|all):(\d+)$/.exec(cursor);
    requireFollowup(
      match &&
        match[1] === revision &&
        match[2] === (all ? "all" : "pending") &&
        Number.isSafeInteger(Number(match[3])) &&
        Number(match[3]) <= selected.length,
      "stale or invalid page cursor; restart follow-ups",
    );
    offset = Number(match[3]);
  }
  const counts = {};
  for (const entry of state.entries)
    counts[followupStatus(entry)] = (counts[followupStatus(entry)] ?? 0) + 1;
  const decisions = decisionSources(root);
  const rows = selected
    .slice(offset, offset + 8)
    .map((entry) => feedRow(entry, decisions));
  const page = {
    revision,
    coverage:
      "Formal candidate/follow-up/deferred headings in current product and planning documents, their top-level list items, and decision records naming an action or an observed reopening. Historical register rows are retained. Archive snapshots, refutation receipts, private intake and unstructured legacy prose are not claimed as reconciled.",
    total: state.entries.length,
    counts,
    pending: state.entries.filter((entry) => !closed.has(followupStatus(entry)))
      .length,
    showing: all ? "all" : "pending",
    rows,
    next: null,
  };
  const next = () =>
    offset + rows.length < selected.length
      ? `npm run plan -- followups${all ? " --all" : ""} --cursor ${revision}:${all ? "all" : "pending"}:${offset + rows.length}`
      : null;
  return bounded(page, next);
}
// Rows drop from the end until the page fits its budget; the continuation
// then names the first row that was dropped. `plan failures` pages under the
// same bound (WO-172).
export function bounded(
  page,
  next,
  row = "one follow-up",
  require = requireFollowup,
) {
  page.next = next();
  while (Buffer.byteLength(encode(page)) > 8192 && page.rows.length > 1) {
    page.rows.pop();
    page.next = next();
  }
  require(Buffer.byteLength(encode(page)) <=
    8192, `${row} exceeds the planning page budget`);
  return page;
}

// The files a worktree changes: tracked differences from its merge base with
// main, and untracked files, because an order's work stays uncommitted until
// final review. A stale local main and origin/main are read together so the
// base is the nearest one.
export function changedAgainstMain(root, { required = true } = {}) {
  const refs = ["main", "origin/main"].filter(
    (ref) =>
      spawnGit(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], {
        cwd: root,
      }).status === 0,
  );
  if (!refs.length && !required) return { base: null, paths: [] };
  requireFollowup(refs.length, "no main to compare with; name the paths");
  const base = runGit(root, ["merge-base", "HEAD", ...refs]);
  return {
    base,
    paths: [
      ...new Set([
        // Both names of a renamed file, whatever diff.renames is set to.
        ...runGitPathList(root, [
          "diff",
          "--name-only",
          "--no-renames",
          "-z",
          base,
          "--",
        ]),
        ...runGitPathList(root, [
          "ls-files",
          "--others",
          "--exclude-standard",
          "-z",
        ]),
      ]),
    ].sort(),
  };
}
// A path is named where its base name stands as a whole name and the path
// written around it agrees with the path's own trailing components: the whole
// path or a shorter tail of it such as its base name. A given path may be a
// tail itself, so a longer written path that ends in it names it too; a
// changed file is whole, and a longer written path is another file. Another
// file of the same base name, or a longer name, is never named.
const namesPath = (value, path, whole) => {
  const parts = path.split("/"),
    base = parts.at(-1);
  for (
    let at = value.indexOf(base);
    at !== -1;
    at = value.indexOf(base, at + 1)
  ) {
    if (/^(?:[\w-]|\.\w)/.test(value.slice(at + base.length))) continue;
    let start = at;
    while (start > 0 && /[\w@./-]/.test(value[start - 1])) start--;
    const written = value
      .slice(start, at + base.length)
      .split("/")
      .filter((part) => part && part !== ".");
    if (whole && written.length > parts.length) continue;
    const length = Math.min(written.length, parts.length);
    if (written.slice(-length).join("/") === parts.slice(-length).join("/"))
      return true;
  }
  return false;
};
const namesOrder = (value, order) =>
  new RegExp(`(?<![\\w-])${order}(?!\\d)`).test(value);
const matchNote =
  "Textual match, a pointer for judgment and never a verdict: a pending row is listed when its source title or summary, its decision's followup or reopenWhen, or its latest disposition names a given path, a trailing part of it such as its base name, or a given order. A false match costs one row read; a row that names its seam in other words is not listed.";

// The pending rows a change, a file list or an order touches (WO-169). `whole`
// says the paths are this checkout's own files, as a change's are.
export function touchingFollowups(
  root,
  {
    paths = [],
    orders = [],
    whole = false,
    cursor = null,
    continuation = null,
  } = {},
) {
  const state = syncFollowups(root, { check: true }),
    revision = hash(state);
  const terms = {
    paths: [
      ...new Set(
        paths.map((path) => path.replace(/^(?:\.\/)+/, "").replace(/\/+$/, "")),
      ),
    ].sort(),
    orders: [...new Set(orders)].sort(),
  };
  // A changed file's name is what Git reports; only a given term is judged.
  requireFollowup(
    (whole ||
      terms.paths.every((path) => text(path) && !path.startsWith("-"))) &&
      terms.orders.every((order) => /^WO-\d{3}$/.test(order)),
    "touching takes paths and WO-NNN identifiers",
  );
  const decisions = decisionSources(root);
  const pending = state.entries.filter(
    (entry) => !closed.has(followupStatus(entry)),
  );
  const selected = pending.sort(pendingOrder).flatMap((entry) => {
    const source = entry.revisions.at(-1),
      decision = decisions.get(entry.key)?.row,
      disposition = entry.dispositions.at(-1);
    const named = [
      source.title,
      source.summary,
      decision?.followup,
      typeof decision?.reopenWhen === "object"
        ? JSON.stringify(decision.reopenWhen)
        : decision?.reopenWhen,
      disposition?.reason,
      disposition?.reopenWhen,
    ]
      .filter((value) => typeof value === "string")
      .join("\n");
    const matched = [
      ...terms.paths.filter((path) => namesPath(named, path, whole)),
      ...terms.orders.filter((order) => namesOrder(named, order)),
    ];
    return matched.length ? [{ entry, matched }] : [];
  });
  const identity = hash({ ...terms, whole }).slice(0, 16);
  let offset = 0;
  if (cursor !== null) {
    const match = /^([a-f0-9]{64}):touching-([a-f0-9]{16}):(\d+)$/.exec(cursor);
    requireFollowup(
      match &&
        match[1] === revision &&
        match[2] === identity &&
        Number.isSafeInteger(Number(match[3])) &&
        Number(match[3]) <= selected.length,
      "stale or invalid page cursor; restart follow-ups --touching",
    );
    offset = Number(match[3]);
  }
  const page = {
    revision,
    match: matchNote,
    touching: { paths: terms.paths.length, orders: terms.orders },
    pending: pending.length,
    matched: selected.length,
    // A row lists its first terms and counts the rest, so its size does not
    // grow with the change and one row cannot exceed the page.
    rows: selected.slice(offset, offset + 8).map(({ entry, matched }) => ({
      ...feedRow(entry, decisions),
      matched: matched.slice(0, 4),
      ...(matched.length > 4 ? { matchedCount: matched.length } : {}),
    })),
    next: null,
  };
  return bounded(page, () =>
    offset + page.rows.length < selected.length
      ? `npm run plan -- followups --touching${continuation ? ` ${continuation}` : ""} --cursor ${revision}:touching-${identity}:${offset + page.rows.length}`
      : null,
  );
}

// Every pending row whole, for a pass that must read the register: the page
// bound and the 220-character clip belong to the feed, not to this file.
export function exportFollowups(root, { all = false } = {}) {
  const state = syncFollowups(root, { check: true });
  const decisions = decisionSources(root);
  const counts = {};
  for (const entry of state.entries)
    counts[followupStatus(entry)] = (counts[followupStatus(entry)] ?? 0) + 1;
  const selected = state.entries.filter(
    (entry) => all || !closed.has(followupStatus(entry)),
  );
  if (!all) selected.sort(pendingOrder);
  return {
    revision: hash(state),
    total: state.entries.length,
    counts,
    pending: state.entries.filter((entry) => !closed.has(followupStatus(entry)))
      .length,
    showing: all ? "all" : "pending",
    rows: selected.map((entry) => {
      const source = entry.revisions.at(-1),
        decision = decisions.get(entry.key);
      return {
        id: entry.id,
        status: followupStatus(entry),
        kind: entry.kind,
        sourceRevision: entry.revisions.length,
        source: decision?.ref ?? source.ref,
        sourceMissing: source.missing,
        title: source.title,
        ...(decision
          ? {
              decision: decision.row.decision,
              followup: decision.row.followup ?? null,
              reopenWhen: decision.row.reopenWhen,
            }
          : { summary: source.summary }),
        dispositions: entry.dispositions,
      };
    }),
  };
}
export function requirePlanningHandoffs(root, workOrder) {
  const queue = readAdjacentQueue(root, workOrder);
  const pending = queue.items.filter((item) =>
    ["queued", "running"].includes(item.status),
  );
  requireFollowup(
    pending.length === 0,
    `unresolved adjacent work: ${pending.map((item) => `${item.id} (${item.status})`).join(", ")}; complete or explicitly dispose each item before handoff`,
  );
  const deferred = queue.items.filter((item) => item.status === "deferred");
  if (!deferred.length) return [];
  const state = syncFollowups(root, { check: true });
  return deferred.map((item) => {
    requireFollowup(
      currentFollowupTarget(state, item.disposition?.target),
      `${item.id}: deferred work needs a current public FUP identifier as its target; synthesize a public candidate or decision, sync, then link it (a retarget action, also at final review) without copying local prose`,
    );
    return { item: item.id, followup: item.disposition.target };
  });
}
// A deferral's public destination: present, live and not closed, following
// duplicate dispositions to the row that carries the work.
export function currentFollowupTarget(state, id) {
  const entry = state.entries.find((row) => row.id === id);
  let destination = entry;
  while (destination && followupStatus(destination) === "duplicate")
    destination = state.entries.find(
      (row) => row.id === destination.dispositions.at(-1).targets[0],
    );
  return Boolean(
    entry &&
    destination &&
    !entry.revisions.at(-1).missing &&
    !destination.revisions.at(-1).missing &&
    !["settled", "declined"].includes(followupStatus(destination)),
  );
}
