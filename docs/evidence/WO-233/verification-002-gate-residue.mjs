// VER-002 F5/F6 probe: after a passing row, nothing its passing tests created
// remains, whatever its class and whether or not it carries an owner record.
// Read-only. For the newest passing `npm test` row at the current code identity
// it lists system-temp roots of any class whose owner record names that gate,
// a suite that passed in the row and an owner the process table no longer
// lists. For the newest passing `npm run test:docs` row at the same identity it
// lists top-level `dotln-*` system-temp directories born inside that gate's run
// window that carry no owner record. Exit 1 when either list is non-empty.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-002-gate-residue.mjs
import { lstatSync, readdirSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../../../", import.meta.url));
const { readGateChecks, gateCodeIdentity } = await import(
  join(sourceRoot, "scripts/lib/gate-evidence.mjs")
);
const { readTemporaryOwner, ownerAlive, temporaryProcessTable } = await import(
  join(sourceRoot, "scripts/lib/temporary-roots.mjs")
);

const identity = gateCodeIdentity(sourceRoot);
const rows = readGateChecks(sourceRoot).filter(
  (row) => row.codeIdentity === identity && row.exitCode === 0,
);
const complete = rows.findLast((row) => row.checkId === "npm test");
const documentRow = rows.findLast((row) => row.checkId === "npm run test:docs");
const temp = realpathSync(tmpdir());
const table = temporaryProcessTable(sourceRoot);
const entries = readdirSync(temp)
  .filter((name) => name.startsWith("dotln-"))
  .map((name) => join(temp, name))
  .filter((path) => {
    const info = lstatSync(path, { throwIfNoEntry: false });
    return info?.isDirectory() && !info.isSymbolicLink();
  });
const record = (path) => {
  try {
    return { record: readTemporaryOwner(path) };
  } catch (error) {
    return { error: error.message };
  }
};
const count = (items, key) => {
  const counts = {};
  for (const item of items) counts[item[key]] = (counts[item[key]] ?? 0) + 1;
  return counts;
};

// F5: roots of any class left by the passing complete row's passing suites.
let completeResult = null;
if (complete) {
  const passed = new Set(
    (complete.taskTimeline ?? [])
      .filter((task) => task.exitCode === 0 && !task.stopped)
      .map((task) => task.name),
  );
  const left = [];
  for (const path of entries) {
    const { record: owner } = record(path);
    if (owner?.owner.gateId !== complete.temporaryGateId) continue;
    if (!passed.has(owner.owner.suite)) continue;
    if (ownerAlive(owner, table) !== false) continue;
    left.push({
      name: path.slice(temp.length + 1).replace(/[-.][A-Za-z0-9_]{6}$/, ""),
      class: owner.class,
      suite: owner.owner.suite,
    });
  }
  completeResult = {
    gateId: complete.temporaryGateId,
    recordedAt: complete.recordedAt,
    rowCleanup: {
      removed: complete.temporaryCleanup?.removed?.length ?? null,
      retained: complete.temporaryCleanup?.retained?.length ?? null,
    },
    deadOwnerRootsOfPassingSuitesRemaining: left.length,
    byClass: count(left, "class"),
    bySuite: count(left, "suite"),
    byFamily: count(left, "name"),
  };
}

// F6: unowned dotln-* roots born while the passing document row ran.
let documentResult = null;
if (documentRow) {
  const end = Date.parse(documentRow.recordedAt);
  const start = end - documentRow.durationMs;
  const left = [];
  for (const path of entries) {
    const born = lstatSync(path).birthtimeMs;
    if (!(born >= start && born <= end)) continue;
    const { record: owner, error } = record(path);
    if (owner || error) continue;
    left.push({
      name: path.slice(temp.length + 1).replace(/[-.][A-Za-z0-9_]{6}$/, ""),
    });
  }
  documentResult = {
    gateId: documentRow.temporaryGateId,
    window: [new Date(start).toISOString(), documentRow.recordedAt],
    rowCleanup: {
      removed: documentRow.temporaryCleanup?.removed?.length ?? null,
      retained: documentRow.temporaryCleanup?.retained?.length ?? null,
    },
    unownedRootsBornInWindow: left.length,
    byFamily: count(left, "name"),
  };
}

console.log(
  JSON.stringify(
    {
      codeIdentity: identity,
      processTableReadable: table !== null,
      complete: completeResult,
      document: documentResult,
    },
    null,
    1,
  ),
);
if (
  completeResult?.deadOwnerRootsOfPassingSuitesRemaining ||
  documentResult?.unownedRootsBornInWindow
) {
  console.error(
    "Gate residue reproduced: a passing row left roots its passing tests created.",
  );
  process.exitCode = 1;
}
