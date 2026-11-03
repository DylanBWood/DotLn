// The read census: how many sessions read each document over the last N
// releases, counted from the session journals the Claude and Copilot hooks
// already write. It adds no observation of its own. Codex tool calls are
// unhooked, so a session that only Codex ran reads nothing here: the census
// is a lower bound, and a document read only under Codex keeps its place
// through its entry-point binding.
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { mainWorktree } from "./git.mjs";
import { localReleaseTags } from "./release-tags.mjs";
import { currentPath, moveIndex } from "./document-moves.mjs";

export const CENSUS_FILE = "local/document-census.json";
export const DEFAULT_CENSUS_RELEASES = 5;
// The tools whose journal rows name the paths a session read or wrote, and
// the instruction file the host loads at every prompt.
const READING_TOOLS = new Set(["Read", "Edit", "Write", "Bash"]);
const SESSION_JOURNAL = /^[a-f0-9]{64}\.jsonl$/u;

/** N from the budgets file's `documentCensus.releases`, five when unset. */
export function censusReleases(root) {
  const path = docPath(root, "control", "budgets.json");
  if (!existsSync(path)) return DEFAULT_CENSUS_RELEASES;
  let budgets;
  try {
    budgets = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error(
      `${docRelative(root, "control", "budgets.json")}: invalid JSON`,
    );
  }
  const value = budgets?.documentCensus?.releases;
  if (value === undefined) return DEFAULT_CENSUS_RELEASES;
  if (!Number.isSafeInteger(value) || value < 1)
    throw new Error(
      `${docRelative(root, "control", "budgets.json")}: documentCensus.releases must be a positive integer`,
    );
  return value;
}

/** The releases newest first, with their tag times: the annotated DotLn
 * release tags the release tooling recognizes, never a lightweight,
 * unrelated or starter-refresh tag that merely carries a version name. A tag
 * read that fails throws: an unreadable history is not an empty one. */
export function releaseTags(root) {
  return localReleaseTags(root)
    .filter((tag) => Number.isFinite(tag.taggedAt))
    .reverse()
    .map((tag) => ({
      name: tag.name,
      createdAt: new Date(tag.taggedAt).toISOString(),
    }));
}

/** The window: the last N releases and the open interval after them. It
 * starts at the release before them; with N or fewer releases it is every
 * journal the checkout keeps. When the release tags cannot be read the
 * window is unavailable and says why, rather than reading as a history with
 * no releases, which would count every journal as current. */
export function censusWindow(root, releases, readTags = releaseTags) {
  let tags;
  try {
    tags = readTags(root);
  } catch (error) {
    return {
      releases,
      since: null,
      after: null,
      tags: [],
      unavailable: `the release tags could not be read: ${String(error.message).replace(/\s+/gu, " ").trim()}`,
    };
  }
  return tags.length > releases
    ? {
        releases,
        since: tags[releases].createdAt,
        after: tags[releases].name,
        tags: tags.slice(0, releases).map((tag) => tag.name),
      }
    : {
        releases,
        since: null,
        after: null,
        tags: tags.map((tag) => tag.name),
      };
}

/** The checkouts whose journals hold this repository's sessions: this one
 * and, from a linked worktree, the registered main checkout, where release
 * close keeps each closed order's journals in its retained lane. */
function journalRoots(root) {
  const roots = [root];
  try {
    const main = mainWorktree(root);
    if (realpathSync(main) !== realpathSync(root)) roots.push(main);
  } catch {
    /* A standalone checkout reads its own journals. */
  }
  return roots;
}

function journalDirectories(root) {
  const directories = [];
  for (const checkout of journalRoots(root)) {
    directories.push(docPath(checkout, "control", "local/harness"));
    const retained = docPath(checkout, "control", "local/retained");
    if (!existsSync(retained)) continue;
    let orders = [];
    try {
      orders = readdirSync(retained).filter((name) =>
        /^WO-\d{3,}$/u.test(name),
      );
    } catch {
      continue;
    }
    for (const order of orders.sort())
      directories.push(join(retained, order, "harness"));
  }
  return directories;
}

const relativePath = (path) => {
  if (typeof path !== "string" || !path) return null;
  const normalized = posix.normalize(path.split("\\").join("/"));
  if (
    normalized.startsWith("/") ||
    normalized.startsWith("../") ||
    normalized === ".."
  )
    return null;
  return normalized.replace(/^\.\//u, "");
};

/** The paths one journal row says a session read or wrote. */
export function rowPaths(row) {
  const reading =
    READING_TOOLS.has(row?.tool) || row?.source === "instruction-autoload";
  if (!reading) return [];
  return [
    ...(Array.isArray(row.reads) ? row.reads : []),
    ...(Array.isArray(row.byteReads) ? row.byteReads : []),
    ...(Array.isArray(row.receipts) ? row.receipts : []),
  ]
    .map((entry) => relativePath(entry?.path))
    .filter(Boolean);
}

/** Count, for each path, the sessions in the window whose observed rows read
 * or wrote it. A moved document's earlier path counts for where it is now. */
export function documentCensus(
  root,
  {
    releases = censusReleases(root),
    write = true,
    now = Date.now,
    readTags = releaseTags,
  } = {},
) {
  const started = now();
  const window = censusWindow(root, releases, readTags);
  const since = window.since ? Date.parse(window.since) : null;
  const moves = moveIndex(root);
  const seen = new Set();
  const counts = new Map();
  const journals = {
    directories: 0,
    files: 0,
    inWindow: 0,
    observed: 0,
    unobserved: 0,
    unreadable: 0,
  };
  // An unavailable window counts nothing: no read can be placed in it.
  for (const directory of window.unavailable ? [] : journalDirectories(root)) {
    let names;
    try {
      if (!lstatSync(directory).isDirectory()) continue;
      names = readdirSync(directory).filter((name) =>
        SESSION_JOURNAL.test(name),
      );
    } catch {
      continue;
    }
    journals.directories++;
    for (const name of names.sort()) {
      // A session's journal lives in one place at a time; a copy found again
      // in another checkout is the same session.
      if (seen.has(name)) continue;
      seen.add(name);
      journals.files++;
      let text;
      try {
        text = readFileSync(join(directory, name), "utf8");
      } catch {
        journals.unreadable++;
        continue;
      }
      let inWindow = false,
        hooked = false;
      const paths = new Set();
      for (const line of text.split("\n")) {
        if (!line) continue;
        let row;
        try {
          row = JSON.parse(line);
        } catch {
          continue;
        }
        const at = Date.parse(row?.recordedAt ?? row?.at ?? "");
        if (since !== null && !(at >= since)) continue;
        inWindow = true;
        if (typeof row?.tool === "string") hooked = true;
        for (const path of rowPaths(row)) paths.add(currentPath(moves, path));
      }
      if (!inWindow) continue;
      journals.inWindow++;
      if (hooked) journals.observed++;
      else journals.unobserved++;
      for (const path of paths) counts.set(path, (counts.get(path) ?? 0) + 1);
    }
  }
  const census = {
    schemaVersion: 1,
    generatedAt: new Date(now()).toISOString(),
    window,
    coverage: {
      claude: "observed: the hooks journal Read, Edit, Write and Bash rows",
      copilot: "observed through the shared Claude hook registration",
      codex:
        "unobserved: Codex tool calls are unhooked, so its sessions read nothing here and the counts are a lower bound",
    },
    journals,
    documents: Object.fromEntries(
      [...counts].sort(([a], [b]) => a.localeCompare(b)),
    ),
    durationMs: now() - started,
  };
  if (write) {
    const path = docPath(root, "control", CENSUS_FILE);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(census, null, 2)}\n`);
  }
  return census;
}
