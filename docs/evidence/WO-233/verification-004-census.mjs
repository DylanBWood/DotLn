// VER-004 probe: the F8 repair rule beyond the top level. VER-002's and
// VER-003's censuses read only top-level `dotln-*` entries in system temp.
// This one also reads the session scratch trees under `<system-temp>/dotln/`,
// the outer worktree's ledger, and the owned roots nested inside every root
// born in a passing row's window. For each passing non-structural row at the
// current code identity it lists the roots that carry the row's gate and that
// the row neither removed nor retained. For each remaining root born in the
// complete row's window it also gives the prune's read-only judgment at three
// instants: now, 25 hours on, and 49 hours on with the worktree's writer
// treated as released. A root still retained at the last instant for a
// reason that time cannot end has no lifecycle that removes it. Read-only.
// Exit 1 when a passing row leaves an unaccounted root carrying its identity,
// or a root born in the complete row's window has no removing lifecycle.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-004-census.mjs
import { existsSync, lstatSync, readdirSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = realpathSync(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
const { readGateChecks, gateCodeIdentity } = await import(
  join(sourceRoot, "scripts/lib/gate-evidence.mjs")
);
const {
  nestedTemporaryRoots,
  ownerAlive,
  readTemporaryOwner,
  registeredTemporaryRoots,
  temporaryProcessTable,
} = await import(join(sourceRoot, "scripts/lib/temporary-roots.mjs"));
const { judgeTemporaryRoot } = await import(
  join(sourceRoot, "scripts/lib/temporary-prune.mjs")
);

const identity = gateCodeIdentity(sourceRoot);
const rows = readGateChecks(sourceRoot).filter(
  (row) =>
    row.codeIdentity === identity &&
    row.exitCode === 0 &&
    row.temporaryGateId &&
    row.checkId !== "structural",
);
const complete = rows.findLast((row) => row.checkId === "npm test");
const temp = realpathSync(tmpdir());
const table = temporaryProcessTable(sourceRoot);
const now = Date.now();
const hour = 3_600_000;
const label = (path) =>
  path.replace(temp, "<system-temp>").replace(sourceRoot, "<worktree>");
const read = (path) => {
  try {
    return { record: readTemporaryOwner(path) };
  } catch (error) {
    return { record: null, error: error.message };
  }
};
const isDirectory = (path) => {
  const info = lstatSync(path, { throwIfNoEntry: false });
  return Boolean(info?.isDirectory() && !info.isSymbolicLink());
};

// Every place a root can live: top-level system temp, the session scratch
// trees, the outer worktree's ledger, and the nested owned roots below them.
const paths = new Map();
const add = (path, source) => {
  if (!paths.has(path)) paths.set(path, new Set());
  paths.get(path).add(source);
};
for (const name of readdirSync(temp)) {
  const path = join(temp, name);
  if (isDirectory(path) && name.startsWith("dotln-")) add(path, "top-level");
}
const sessionBase = join(temp, "dotln");
let sessionTrees = 0;
if (isDirectory(sessionBase))
  for (const digest of readdirSync(sessionBase)) {
    if (!/^[a-f0-9]{64}$/.test(digest)) continue;
    const scratch = join(sessionBase, digest, "scratch");
    if (!isDirectory(scratch)) continue;
    sessionTrees++;
    add(scratch, "session-scratch");
  }
for (const row of registeredTemporaryRoots(sourceRoot))
  add(row.path, "worktree-ledger");

const start = complete
  ? Date.parse(complete.recordedAt) - complete.durationMs
  : Infinity;
const end = complete ? Date.parse(complete.recordedAt) : -Infinity;
const born = (path) => {
  const info = lstatSync(path, { throwIfNoEntry: false });
  return Boolean(info && info.birthtimeMs >= start && info.birthtimeMs <= end);
};
const gateIds = new Set(rows.map((row) => row.temporaryGateId));
// Descend into the roots this probe judges: those born in the complete row's
// window and those whose top-level record carries a passing row's gate.
for (const [path] of [...paths]) {
  const { record } = read(path);
  const carries =
    gateIds.has(record?.owner?.gateId) ||
    gateIds.has(record?.fixtureOwner?.gateId);
  if (!born(path) && !carries) continue;
  const walk = (at) => {
    for (const child of nestedTemporaryRoots(at)) {
      add(child, "nested");
      walk(child);
    }
  };
  if (isDirectory(path)) walk(path);
}

const unaccounted = [];
for (const row of rows) {
  const retained = new Set(
    (row.temporaryCleanup?.retained ?? []).map((item) => item.path ?? item),
  );
  for (const [path, sources] of paths) {
    if (!existsSync(path)) continue;
    const { record } = read(path);
    if (
      record &&
      (record.owner.gateId === row.temporaryGateId ||
        record.fixtureOwner?.gateId === row.temporaryGateId) &&
      !retained.has(path)
    )
      unaccounted.push({
        checkId: row.checkId,
        gate: row.temporaryGateId,
        root: label(path),
        sources: [...sources],
        class: record.class,
        suite: record.owner.suite ?? null,
        repository: label(record.owner.repository),
        ownerAlive: ownerAlive(record, table),
      });
  }
}

const context = { worktrees: [], holders: [], processes: table, openPaths: [] };
// The writer released: the prune of release close, or after the session.
const released = {
  ...context,
  finishingGate: { repository: resolve(sourceRoot), id: "verifier-released" },
};
const judge = (path, at, given) => {
  const judged = judgeTemporaryRoot(sourceRoot, path, { now: at }, given);
  return judged?.candidate
    ? "candidate"
    : (judged?.retained?.reason ?? "not judged");
};
// Reasons the passing of time or the writer's release cannot end.
const timeless =
  /owner is live|owner identity is unavailable|retained indefinitely|invalid|replaced|not a regular file|ownership unavailable/;
const bornRows = [];
for (const [path, sources] of paths) {
  if (!existsSync(path) || !born(path)) continue;
  const { record, error } = read(path);
  const later = judge(path, now + 49 * hour, released);
  bornRows.push({
    root: label(path),
    sources: [...sources],
    class: record?.class ?? null,
    gate: record?.owner?.gateId ?? null,
    fixtureGate: record?.fixtureOwner?.gateId ?? null,
    suite: record?.owner?.suite ?? null,
    outcome: record?.outcome ?? null,
    retentionHours: record?.retentionHours ?? null,
    repositoryExists: record ? existsSync(record.owner.repository) : null,
    ownerBirthRecorded: record ? record.owner.birth !== null : null,
    ownerAlive: record ? ownerAlive(record, table) : null,
    recordError: error ?? null,
    judgedNow: judge(path, now, context),
    judgedIn25h: judge(path, now + 25 * hour, context),
    judgedIn49hReleased: later,
    noRemovingLifecycle: later !== "candidate" && timeless.test(later),
  });
}

const lockCancelBorn = readdirSync(temp).filter(
  (name) => name.startsWith("dotln-lock-cancel") && born(join(temp, name)),
).length;
const sessionBorn = bornRows.filter((row) => row.class === "session-scratch");

const output = {
  codeIdentity: identity,
  processTableReadable: table !== null,
  observedAt: new Date(now).toISOString(),
  rows: rows.map((row) => ({
    checkId: row.checkId,
    gate: row.temporaryGateId,
    recordedAt: row.recordedAt,
    removed: row.temporaryCleanup?.removed?.length ?? null,
    retained: (row.temporaryCleanup?.retained ?? []).map((item) =>
      label(item.path ?? item),
    ),
    blockers: row.temporaryCleanup?.blockers?.length ?? null,
  })),
  scanned: {
    roots: paths.size,
    sessionScratchTrees: sessionTrees,
    worktreeLedger: [...paths.values()].filter((s) => s.has("worktree-ledger"))
      .length,
    nested: [...paths.values()].filter((s) => s.has("nested")).length,
  },
  completeWindow: complete
    ? [new Date(start).toISOString(), complete.recordedAt]
    : null,
  unaccountedRootsCarryingRowGate: unaccounted,
  bornInCompleteWindowStillPresent: bornRows,
  sessionScratchBornInCompleteWindow: sessionBorn.length,
  lockCancelFilesBornInCompleteWindow: lockCancelBorn,
};
console.log(JSON.stringify(output, null, 1));
if (!complete)
  console.error("No passing complete row at the current code identity.");
if (unaccounted.length || bornRows.some((row) => row.noRemovingLifecycle)) {
  console.error(
    "Gate residue: a root carrying a passing row's gate is unaccounted, or a root born in the complete row's window has no lifecycle that removes it.",
  );
  process.exitCode = 1;
}
