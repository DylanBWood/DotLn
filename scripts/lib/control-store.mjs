import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_CONTROL_PATHS,
  controlPaths,
  foldSegments,
  parseControlEvents,
} from "./control.mjs";
import { readGitObjects, runGit } from "./git.mjs";
import { containedRegularFile, disposableBasename } from "./paths.mjs";

export const controlFromSources = (
  sources,
  storage = DEFAULT_CONTROL_PATHS,
) => {
  const eventSegments = new Map();
  for (const [path, source] of sources) {
    try {
      eventSegments.set(path, parseControlEvents(source));
    } catch (error) {
      throw new Error(`${path}: ${error.message}`);
    }
  }
  const legacy = eventSegments.get(storage.legacy) ?? [];
  const segments = new Map(eventSegments);
  segments.delete(storage.legacy);
  return {
    sources,
    eventSegments,
    ...foldSegments(legacy, segments, {
      legacyPath: storage.legacy,
      ordersPath: storage.orders,
    }),
  };
};

const committedControlBlobs = (root, revision) => {
  const storage = controlPaths(root);
  const entries = runGit(
    root,
    ["ls-tree", "-r", "-z", revision, "--", storage.legacy, storage.orders],
    { trim: false },
  )
    .split("\0")
    .filter(Boolean);
  return entries
    .filter((entry) => !disposableBasename(entry.split("\t")[1]))
    .map((entry) => {
      const [metadata, path] = entry.split("\t");
      const [mode, type, object] = metadata.split(" ");
      if (type !== "blob" || !["100644", "100755"].includes(mode))
        throw new Error(
          `${revision}:${path}: expected a regular control segment`,
        );
      return { path, object };
    });
};

// Keep the legacy segment first and every other segment in code-unit order.
const sortedSources = (sources, legacyPath) =>
  new Map(
    [...sources].sort(([a], [b]) =>
      a === legacyPath ? -1 : b === legacyPath ? 1 : a < b ? -1 : a > b ? 1 : 0,
    ),
  );

// Validate every historical view, sharing immutable blob reads across tags.
export const readControls = (root, revisions) => {
  const views = revisions.map((revision) => [
    revision,
    committedControlBlobs(root, revision),
  ]);
  const objects = readGitObjects(
    root,
    views.flatMap(([, blobs]) => blobs.map(({ object }) => object)),
    "blob",
  );
  const storage = controlPaths(root);
  return new Map(
    views.map(([revision, blobs]) => [
      revision,
      controlFromSources(
        sortedSources(
          new Map(
            blobs.map(({ path, object }) => [
              path,
              objects.get(object).toString("utf8"),
            ]),
          ),
          storage.legacy,
        ),
        storage,
      ),
    ]),
  );
};

// The same reader owns workspace, commit, and tag views. Git reads use blobs,
// never a working-tree projection or a symlink's target.
export const readControl = (root, revision) => {
  const storage = controlPaths(root);
  const sources = new Map();
  if (revision) {
    return readControls(root, [revision]).get(revision);
  } else {
    const read = (path) => {
      if (!containedRegularFile(join(root, path), root))
        throw new Error(
          `${path}: expected a contained regular control segment`,
        );
      sources.set(path, readFileSync(join(root, path), "utf8"));
    };
    if (existsSync(join(root, storage.legacy))) read(storage.legacy);
    const directory = join(root, storage.orders);
    if (existsSync(directory)) {
      if (
        !lstatSync(directory).isDirectory() ||
        lstatSync(directory).isSymbolicLink()
      )
        throw new Error(
          `${storage.orders}: expected a regular control directory`,
        );
      for (const name of readdirSync(directory).sort())
        if (!disposableBasename(name)) read(`${storage.orders}/${name}`);
    }
  }
  // Legacy first; lexicographic segment order is display order, not chronology.
  return controlFromSources(sortedSources(sources, storage.legacy), storage);
};

export const eventsForOrder = (control, id) =>
  (control.eventSegments.get(control.locations.get(id)) ?? []).filter(
    (event) => event.workOrderId === id,
  );

export const addedSegmentEvents = (before, after, context) => {
  for (const [path, source] of before.sources) {
    if (!after.sources.has(path) || !after.sources.get(path).startsWith(source))
      throw new Error(
        `control log is not append-only in ${path} between ${context}`,
      );
  }
  return [...after.eventSegments].flatMap(([path, events]) =>
    events.slice(before.eventSegments.get(path)?.length ?? 0),
  );
};

export const branchWorkOrder = (root) => {
  try {
    const branch = runGit(root, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
    return /^wo-(\d{3})$/.exec(branch)?.[1]?.replace(/^/, "WO-");
  } catch {
    // Non-Git fixtures and detached revisions require selection from evidence.
    return undefined;
  }
};

// A withdrawn order is settled like a closed one: nothing is in flight.
export const openOrders = (control) =>
  [...control.orders]
    .filter(
      ([, row]) => !["closed", "none", "withdrawn"].includes(row.state.phase),
    )
    .map(([id]) => id);

// Across segments, "latest" means Git integration order, never wall-clock order.
// Ties in one commit have no chronology; the segment display order breaks ties.
export const latestClosedOrder = (
  control,
  root,
  revision = "HEAD",
  preferred,
) => {
  const closed = [...control.orders].filter(
    ([, row]) => row.state.phase === "closed",
  );
  if (closed.some(([id]) => id === preferred)) return preferred;
  if (closed.length <= 1) return closed[0]?.[0];
  const atPath = (path) =>
    closed
      .filter(([id]) => control.locations.get(id) === path)
      .sort(([, a], [, b]) => a.closeOrdinal - b.closeOrdinal)
      .at(-1)?.[0];
  try {
    const storage = controlPaths(root);
    const paths = runGit(root, [
      "log",
      "--first-parent",
      "--format=",
      "--name-only",
      revision,
      "--",
      storage.legacy,
      storage.orders,
    ]);
    for (const path of paths.split("\n")) {
      const id = atPath(path);
      if (id) return id;
    }
  } catch {
    // Legacy-only observations retain their original append-order fallback.
  }
  const paths = new Set(closed.map(([id]) => control.locations.get(id)));
  return paths.size === 1 ? atPath([...paths][0]) : undefined;
};

export const selectWorkOrder = (
  control,
  {
    workOrder,
    branch,
    latestClosed,
    allowNew = false,
    allowAmbiguous = false,
  } = {},
) => {
  const selected = workOrder ?? branch;
  const open = openOrders(control);
  const detail = `open orders: ${open.join(", ") || "none"}; use --work-order WO-NNN`;
  if (selected !== undefined) {
    // Only this order's allocation failed to fold; name it (WO-157 item 14).
    if (control.unreadable?.has(selected))
      throw new Error(
        `unreadable work order ${selected}: ${control.unreadable.get(selected).message}`,
      );
    if (
      !/^WO-\d{3}$/.test(selected) ||
      (!control.orders.has(selected) && !allowNew)
    )
      throw new Error(`unknown work order ${selected}; ${detail}`);
    return selected;
  }
  // An order whose allocation no longer folds is never passed over silently
  // (WO-157 item 14): without an explicit selection, name it.
  if (control.unreadable?.size)
    throw new Error(
      `unreadable work order ${[...control.unreadable].map(([id, { message }]) => `${id}: ${message}`).join("; ")}; repair its control segment, or select another order with --work-order WO-NNN`,
    );
  if (open.length === 1) return open[0];
  if (open.length === 0 && latestClosed) return latestClosed;
  if (control.orders.size === 0 || allowAmbiguous) return undefined;
  throw new Error(`ambiguous work-order selection; ${detail}`);
};
