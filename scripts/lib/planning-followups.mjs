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
import { spawnSync } from "node:child_process";
import { readDecisions } from "./meta.mjs";
import { readAdjacentQueue } from "./adjacent-queue.mjs";
import { checkLocalTerms } from "./terms.mjs";

export const FOLLOWUPS = "docs/planning/followups.json";
const closed = new Set(["allocated", "declined", "duplicate", "settled"]);
const statuses = new Set(["open", "deferred", ...closed]);
const encode = (value) => JSON.stringify(value, null, 2) + "\n";
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
  const add = (kind, path, locator, title, body) => {
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
        ref: `${path}#${locator.split("::")[0]}`,
        title: compact(title.replace(/\*|`/g, ""), 200),
        summary: compact(body, 700),
        missing: false,
      },
    });
  };
  const files = [
    ...markdownFiles(root, "docs/product"),
    ...markdownFiles(root, "docs/planning"),
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
  const evidence = safePath(root, "docs/evidence");
  if (existsSync(evidence))
    for (const name of readdirSync(evidence).filter((name) =>
      /^WO-\d{3}$/.test(name),
    ))
      safePath(root, `docs/evidence/${name}/decisions.md`);
  for (const decision of readDecisions(root))
    add(
      "decision",
      decision.path,
      decision.id.toLowerCase(),
      `${decision.id}: ${decision.decision}`,
      encode(decision),
    );
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
function validate(state) {
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
          /^docs\/(?:product|planning|evidence)\/.+\.md#/.test(rev.ref) &&
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
  const result = spawnSync("git", ["show", `HEAD:${FOLLOWUPS}`], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return result.status === 0 ? validate(JSON.parse(result.stdout)) : empty();
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
  const path = safePath(root, FOLLOWUPS);
  const state = existsSync(path)
    ? validate(JSON.parse(readFileSync(path, "utf8")))
    : empty();
  retained(committedState(root), state);
  requireAllocationTargets(root, state);
  return state;
}
function requireAllocationTargets(root, state) {
  for (const entry of state.entries.filter(
    (entry) => followupStatus(entry) === "allocated",
  ))
    for (const target of entry.dispositions.at(-1).targets) {
      const directory = safePath(root, "docs/work-orders");
      requireFollowup(
        existsSync(directory) &&
          readdirSync(directory).some(
            (name) =>
              name.startsWith(`${target}-`) &&
              name.endsWith(".md") &&
              lstatSync(safePath(root, `docs/work-orders/${name}`)).isFile(),
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
    if (!present.has(entry.key) && !entry.revisions.at(-1).missing)
      entry.revisions.push({
        ...entry.revisions.at(-1),
        hash: null,
        missing: true,
      });
  return validate(state);
}
function persist(root, state) {
  const path = safePath(root, FOLLOWUPS),
    temporary = safePath(root, `${FOLLOWUPS}.tmp`);
  checkLocalTerms(root, [{ name: FOLLOWUPS, text: encode(state) }]);
  writeFileSync(temporary, encode(state), { flag: "wx" });
  renameSync(temporary, path);
}
function withLock(root, fn) {
  const directory = safePath(root, "docs/planning");
  mkdirSync(directory, { recursive: true });
  const lock = safePath(root, `${FOLLOWUPS}.lock`);
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
      path = safePath(root, FOLLOWUPS);
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
export function disposeFollowup(root, request) {
  return withLock(root, () => {
    const state = syncFollowups(root, { check: true });
    requireFollowup(
      exact(request, [
        "expectedRevision",
        "id",
        "sourceRevision",
        "status",
        "reason",
        "reopenWhen",
        "targets",
      ]) && request.expectedRevision === hash(state),
      "stale register revision or request shape; reread follow-ups",
    );
    const entry = state.entries.find((row) => row.id === request.id);
    requireFollowup(
      entry && request.sourceRevision === entry.revisions.length,
      "missing item or stale source revision",
    );
    const { expectedRevision, id, ...disposition } = request;
    entry.dispositions.push({ ...disposition, at: new Date().toISOString() });
    validate(state);
    requireAllocationTargets(root, state);
    persist(root, state);
    return {
      id: entry.id,
      status: followupStatus(entry),
      revision: hash(state),
    };
  });
}
export function planningFollowups(root, { cursor = null, all = false } = {}) {
  const state = syncFollowups(root, { check: true }),
    revision = hash(state);
  const selected = state.entries.filter(
    (entry) => all || !closed.has(followupStatus(entry)),
  );
  if (!all) {
    const rank = { "needs-review": 0, open: 1, deferred: 2, untriaged: 3 };
    selected.sort(
      (a, b) =>
        rank[followupStatus(a)] - rank[followupStatus(b)] ||
        a.id.localeCompare(b.id),
    );
  }
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
  const rows = selected.slice(offset, offset + 8).map((entry) => {
    const source = entry.revisions.at(-1),
      disposition = entry.dispositions.at(-1);
    return {
      id: entry.id,
      status: followupStatus(entry),
      sourceRevision: entry.revisions.length,
      title: source.title,
      source: source.ref,
      sourceMissing: source.missing,
      reason: disposition ? compact(disposition.reason, 220) : null,
      reopenWhen: disposition?.reopenWhen
        ? compact(disposition.reopenWhen, 220)
        : null,
    };
  });
  const page = {
    revision,
    coverage:
      "Formal candidate/follow-up/deferred headings in current product and planning documents, their top-level list items, and per-order decision records. Archive snapshots, refutation receipts, private intake and unstructured legacy prose are not claimed as reconciled.",
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
  page.next = next();
  while (Buffer.byteLength(encode(page)) > 8192 && rows.length > 1) {
    rows.pop();
    page.next = next();
  }
  requireFollowup(
    Buffer.byteLength(encode(page)) <= 8192,
    "one follow-up exceeds the planning page budget",
  );
  return page;
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
    const entry = state.entries.find(
      (row) => row.id === item.disposition?.target,
    );
    let destination = entry;
    while (destination && followupStatus(destination) === "duplicate")
      destination = state.entries.find(
        (row) => row.id === destination.dispositions.at(-1).targets[0],
      );
    requireFollowup(
      entry &&
        destination &&
        !entry.revisions.at(-1).missing &&
        !destination.revisions.at(-1).missing &&
        !["settled", "declined"].includes(followupStatus(destination)),
      `${item.id}: deferred work needs a current public FUP identifier as its target; synthesize a public candidate or decision, sync, then link it without copying local prose`,
    );
    return { item: item.id, followup: entry.id };
  });
}
