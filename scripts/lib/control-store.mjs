import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  CONTROL_ORDERS_PATH,
  LEGACY_CONTROL_PATH,
  foldSegments,
  parseControlEvents,
} from "./control.mjs";
import { runGit } from "./git.mjs";
import { containedRegularFile } from "./paths.mjs";

export const controlFromSources = (sources) => {
  const eventSegments = new Map();
  for (const [path, source] of sources) {
    try {
      eventSegments.set(path, parseControlEvents(source));
    } catch (error) {
      throw new Error(`${path}: ${error.message}`);
    }
  }
  const legacy = eventSegments.get(LEGACY_CONTROL_PATH) ?? [];
  const segments = new Map(eventSegments);
  segments.delete(LEGACY_CONTROL_PATH);
  return { sources, eventSegments, ...foldSegments(legacy, segments) };
};

// The same reader owns workspace, commit, and tag views. Git reads use blobs,
// never a working-tree projection or a symlink's target.
export const readControl = (root, revision) => {
  const sources = new Map();
  if (revision) {
    const entries = runGit(
      root,
      [
        "ls-tree",
        "-r",
        "-z",
        revision,
        "--",
        LEGACY_CONTROL_PATH,
        CONTROL_ORDERS_PATH,
      ],
      { trim: false },
    )
      .split("\0")
      .filter(Boolean);
    for (const entry of entries) {
      const [metadata, path] = entry.split("\t");
      const [mode, type, object] = metadata.split(" ");
      if (type !== "blob" || !["100644", "100755"].includes(mode))
        throw new Error(
          `${revision}:${path}: expected a regular control segment`,
        );
      sources.set(
        path,
        runGit(root, ["cat-file", "blob", object], { trim: false }),
      );
    }
  } else {
    const read = (path) => {
      if (!containedRegularFile(join(root, path), root))
        throw new Error(
          `${path}: expected a contained regular control segment`,
        );
      sources.set(path, readFileSync(join(root, path), "utf8"));
    };
    if (existsSync(join(root, LEGACY_CONTROL_PATH))) read(LEGACY_CONTROL_PATH);
    const directory = join(root, CONTROL_ORDERS_PATH);
    if (existsSync(directory)) {
      if (
        !lstatSync(directory).isDirectory() ||
        lstatSync(directory).isSymbolicLink()
      )
        throw new Error(
          `${CONTROL_ORDERS_PATH}: expected a regular control directory`,
        );
      for (const name of readdirSync(directory).sort())
        read(`${CONTROL_ORDERS_PATH}/${name}`);
    }
  }
  // Legacy first; lexicographic segment order is display order, not chronology.
  const sorted = new Map(
    [...sources].sort(([a], [b]) =>
      a === LEGACY_CONTROL_PATH
        ? -1
        : b === LEGACY_CONTROL_PATH
          ? 1
          : a < b
            ? -1
            : a > b
              ? 1
              : 0,
    ),
  );
  return controlFromSources(sorted);
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

export const openOrders = (control) =>
  [...control.orders]
    .filter(([, row]) => row.state.phase !== "closed")
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
    const paths = runGit(root, [
      "log",
      "--first-parent",
      "--format=",
      "--name-only",
      revision,
      "--",
      LEGACY_CONTROL_PATH,
      CONTROL_ORDERS_PATH,
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
    if (
      !/^WO-\d{3}$/.test(selected) ||
      (!control.orders.has(selected) && !allowNew)
    )
      throw new Error(`unknown work order ${selected}; ${detail}`);
    return selected;
  }
  if (open.length === 1) return open[0];
  if (open.length === 0 && latestClosed) return latestClosed;
  if (control.orders.size === 0 || allowAmbiguous) return undefined;
  throw new Error(`ambiguous work-order selection; ${detail}`);
};
