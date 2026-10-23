import {
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { docRelative } from "./config.mjs";
import { CONTROL_LOG_SCHEMA_VERSION, controlPaths, fold } from "./control.mjs";
import {
  controlFromSources,
  eventsForOrder,
  readControl,
} from "./control-store.mjs";
import { containedRegularFile, disposableBasename } from "./paths.mjs";
import { validateRecordedAt } from "./control-time.mjs";
import { spawnGit } from "./git.mjs";

export const pendingOverridesPath = (root) =>
  docRelative(root, "control", "local/pending-overrides");
const requirePending = (condition, reason) => {
  if (!condition) throw new Error(reason);
};
const laneDirectory = (root, { create = false } = {}) => {
  const lane = pendingOverridesPath(root);
  let directory = root;
  for (const part of lane.split("/")) {
    directory = join(directory, part);
    let info = lstatSync(directory, { throwIfNoEntry: false });
    if (!info && create) {
      mkdirSync(directory);
      info = lstatSync(directory);
    }
    if (!info) return null;
    requirePending(
      info.isDirectory() && !info.isSymbolicLink(),
      `${lane}: expected a regular pending-override directory`,
    );
  }
  return directory;
};
const validatePending = (control, record) => {
  requirePending(
    record?.schemaVersion === CONTROL_LOG_SCHEMA_VERSION &&
      record.type === "OperatorOverrideRecorded" &&
      /^WO-\d{3}$/u.test(record.workOrderId ?? ""),
    "expected an OperatorOverrideRecorded control event",
  );
  validateRecordedAt(record, "pending override");
  requirePending(
    control.orders.get(record.workOrderId)?.state.phase === "closed",
    `pending override names an order that is not closed: ${record.workOrderId}`,
  );
  fold([...eventsForOrder(control, record.workOrderId), record]);
};

export function recordPendingOverride(root, event) {
  const record = {
    schemaVersion: CONTROL_LOG_SCHEMA_VERSION,
    recordedAt: new Date().toISOString(),
    ...event,
  };
  validatePending(readControl(root), record);
  requirePending(
    spawnGit([
      "-C",
      root,
      "check-ignore",
      "-q",
      "--",
      `${pendingOverridesPath(root)}/record.json`,
    ]).status === 0,
    `${pendingOverridesPath(root)} must be ignored before recording a pending override`,
  );
  const directory = laneDirectory(root, { create: true });
  const path = join(directory, `${record.workOrderId}-${randomUUID()}.json`);
  writeFileSync(path, JSON.stringify(record) + "\n", {
    flag: "wx",
    mode: 0o600,
  });
  return `${pendingOverridesPath(root)}/${path.slice(directory.length + 1)}`;
}

// An unreadable lane never prevents a new order from starting. All records are
// validated before any segment changes, and their source files stay until the
// destination's canonical projection has been regenerated.
export function carryPendingOverrides(
  source,
  target,
  refresh,
  { advisory = (line) => process.stderr.write(`${line}\n`) } = {},
) {
  const lane = pendingOverridesPath(source);
  try {
    const directory = laneDirectory(source);
    if (!directory) return [];
    const control = readControl(target);
    const rows = readdirSync(directory)
      .sort()
      .filter((name) => !disposableBasename(name))
      .map((name) => {
        const file = join(directory, name);
        requirePending(
          /^WO-\d{3}-[0-9a-f-]{36}\.json$/u.test(name) &&
            containedRegularFile(file, source),
          `${lane}/${name}: expected a contained pending-override file`,
        );
        const bytes = readFileSync(file, "utf8");
        const record = JSON.parse(bytes);
        validatePending(control, record);
        return { file, bytes, record };
      });
    if (!rows.length) return [];
    const updated = new Map(control.sources);
    for (const { record } of rows) {
      const segment = control.locations.get(record.workOrderId);
      const line = JSON.stringify(record);
      const before = updated.get(segment);
      // A preserved start may already have copied this exact event.
      if (!before.split("\n").includes(line))
        updated.set(
          segment,
          before + (before.endsWith("\n") ? "" : "\n") + line + "\n",
        );
    }
    controlFromSources(updated, controlPaths(target));
    for (const [segment, bytes] of updated)
      if (bytes !== control.sources.get(segment))
        writeFileSync(join(target, segment), bytes);
    refresh(target);
    for (const row of rows) {
      requirePending(
        containedRegularFile(row.file, source) &&
          readFileSync(row.file, "utf8") === row.bytes,
        `${lane}: a pending record changed during carry; source retained`,
      );
    }
    for (const row of rows) unlinkSync(row.file);
    return rows.map(({ record }) => record.workOrderId);
  } catch (error) {
    const cause =
      error.code ??
      (error instanceof SyntaxError
        ? "malformed pending override record"
        : error.message);
    advisory(
      `Advisory: pending override lane ${lane} retained (${cause}); worktree start proceeds.`,
    );
    return [];
  }
}
