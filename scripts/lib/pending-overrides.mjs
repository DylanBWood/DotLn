import {
  existsSync,
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
import { parseWorktrees, spawnGit } from "./git.mjs";
import { directoryIdentity } from "./target-worktrees.mjs";

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
// The lane holds the records a closed, merged order takes without a phase
// change: an override record, and a retraction recorded after the merge
// (WO-249), which leaves the order closed. A record folds after the order's
// whole segment, so a legacy log's global ordinals still name their events,
// and after the lane's earlier records for the order, so a second retraction
// of one record is refused here rather than at the carry, where it would keep
// the whole lane back.
const validatePending = (control, record, earlier = []) => {
  requirePending(
    record?.schemaVersion === CONTROL_LOG_SCHEMA_VERSION &&
      (record.type === "OperatorOverrideRecorded" ||
        (record.type === "OffRampRetracted" &&
          record.pullRequest === "merged")) &&
      /^WO-\d{3}$/u.test(record.workOrderId ?? ""),
    "expected an OperatorOverrideRecorded or a merged-form OffRampRetracted control event",
  );
  validateRecordedAt(record, "pending override");
  requirePending(
    control.orders.get(record.workOrderId)?.state.phase === "closed",
    `pending override names an order that is not closed: ${record.workOrderId}`,
  );
  const duplicate =
    record.type === "OffRampRetracted" &&
    earlier.find(
      (row) =>
        row.record.type === "OffRampRetracted" &&
        row.record.workOrderId === record.workOrderId &&
        row.record.subject?.ordinal === record.subject?.ordinal,
    );
  requirePending(
    !duplicate,
    `ordinal ${record.subject?.ordinal} of ${record.workOrderId} is already retracted by the pending record ${duplicate?.name}; the next worktree start carries it`,
  );
  const segment = control.eventSegments.get(
    control.locations.get(record.workOrderId),
  );
  fold([
    ...(segment ?? eventsForOrder(control, record.workOrderId)),
    ...earlier
      .filter((row) => row.record.workOrderId === record.workOrderId)
      .map((row) => row.record),
    record,
  ]);
};
// The lane's files in name order (by order identifier, then a random id, so
// not by age), each contained, named as recordPendingOverride writes it and
// parsed; a file that fails names itself. An unreadable lane is the carry's
// to report, and refuses a new retraction.
const readLane = (root) => {
  const directory = laneDirectory(root);
  if (!directory) return [];
  const lane = pendingOverridesPath(root);
  return readdirSync(directory)
    .sort()
    .filter((name) => !disposableBasename(name))
    .map((name) => {
      const file = join(directory, name);
      requirePending(
        /^WO-\d{3}-[0-9a-f-]{36}\.json$/u.test(name) &&
          containedRegularFile(file, root),
        `${lane}/${name}: expected a contained pending-override file`,
      );
      const bytes = readFileSync(file, "utf8");
      let record;
      try {
        record = JSON.parse(bytes);
      } catch (error) {
        throw new Error(
          `${lane}/${name}: malformed pending override record (${error.message})`,
        );
      }
      return { name, file, bytes, record };
    });
};

// A record a control already holds: a carry that wrote the destination but
// kept its source file left it in both places, and it is never folded twice,
// since a retraction read twice would undo one record two times.
const heldIn = (control, record) => {
  const segment = control.locations.get(record.workOrderId);
  return Boolean(
    segment &&
    control.sources.get(segment)?.split("\n").includes(JSON.stringify(record)),
  );
};
// The registered worktree whose record already holds a retraction of this
// record, and that retraction. A worktree start carries the lane's merged-form
// retraction into the branch it starts, and until that branch merges neither
// main's record nor its lane shows it; an unmerged-form one stays in the
// order's own worktree when its branch merged without the repair. Either way
// a second retraction from main would meet the first as two events for one
// record. An unreadable worktree record is that worktree's to repair and is
// passed over.
const heldRetraction = (root, record) => {
  if (record.type !== "OffRampRetracted") return undefined;
  const own = directoryIdentity(root);
  for (const tree of parseWorktrees(root)) {
    if (typeof tree.worktree !== "string" || !existsSync(tree.worktree))
      continue;
    let events;
    try {
      if (directoryIdentity(tree.worktree) === own) continue;
      events = eventsForOrder(readControl(tree.worktree), record.workOrderId);
    } catch {
      continue;
    }
    const at = events.findIndex(
      (row) =>
        row?.type === "OffRampRetracted" &&
        row.subject?.ordinal === record.subject?.ordinal,
    );
    if (at >= 0)
      return {
        worktree: tree.worktree,
        event: events[at],
        // Its repair passed there since, so only the merge remains.
        repaired: events
          .slice(at + 1)
          .some(
            (row) =>
              row?.type === "FinalReviewCompleted" && row.verdict === "pass",
          ),
      };
  }
  return undefined;
};

export function recordPendingOverride(root, event) {
  const record = {
    schemaVersion: CONTROL_LOG_SCHEMA_VERSION,
    recordedAt: new Date().toISOString(),
    ...event,
  };
  const control = readControl(root);
  // Only a retraction folds against the lane's earlier records; an override
  // record needs none of them, so an unrelated malformed file never refuses it.
  validatePending(
    control,
    record,
    record.type === "OffRampRetracted"
      ? readLane(root).filter((row) => !heldIn(control, row.record))
      : [],
  );
  const held = heldRetraction(root, record);
  requirePending(
    !held,
    held?.event.pullRequest === "merged"
      ? `ordinal ${record.subject?.ordinal} of ${record.workOrderId} is already retracted in the worktree ${held?.worktree}, which a worktree start carried it into; main's record holds it once that branch merges`
      : `ordinal ${record.subject?.ordinal} of ${record.workOrderId} is already retracted in its worktree ${held?.worktree}, recorded there before a merge that left it unrepaired; ${held?.repaired ? "its repair has passed there since, and merging that branch answers it" : "the repair, a fresh verification and a fresh final review in that worktree answer it, as release close demands"}`,
  );
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
    const control = readControl(target);
    // A preserved start may already have copied this exact event: it is
    // carried as held, never folded twice.
    const rows = [];
    for (const row of readLane(source)) {
      const already = heldIn(control, row.record);
      if (!already)
        validatePending(
          control,
          row.record,
          rows.filter((earlier) => !earlier.held),
        );
      rows.push({ ...row, held: already });
    }
    if (!rows.length) return [];
    const updated = new Map(control.sources);
    for (const { record, held } of rows) {
      if (held) continue;
      const segment = control.locations.get(record.workOrderId);
      const line = JSON.stringify(record);
      const before = updated.get(segment);
      // Two byte-identical override records collapse into one event; a
      // duplicate retraction was refused above and keeps the lane.
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
    const cause = error.code ?? error.message;
    advisory(
      `Advisory: pending override lane ${lane} retained (${cause}); worktree start proceeds.`,
    );
    return [];
  }
}
