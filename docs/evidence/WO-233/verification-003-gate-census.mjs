// VER-003 F8 probe: after a passing row, every system-temp root whose owner
// record carries that gate's identity is either gone or listed in the row's
// retained cleanup, whatever its class, suite name or owner liveness. The
// VER-002 probe counted only roots naming a suite in the row's task timeline
// with an owner proven dead; this census drops both filters. Read-only. For
// each passing non-structural row at the current code identity it lists the
// unaccounted top-level roots naming the gate, and, for information, what was
// born inside the gate's run window and still exists: owned roots by family,
// class and gate; unowned `dotln-*` directories; and other entries by family.
// Exit 1 when a passing row leaves an unaccounted root carrying its identity.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-003-gate-census.mjs
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
  (row) =>
    row.codeIdentity === identity &&
    row.exitCode === 0 &&
    row.temporaryGateId &&
    row.checkId !== "structural",
);
const temp = realpathSync(tmpdir());
const table = temporaryProcessTable(sourceRoot);
// Drop the six-character random suffix (mixed case or digits), keep words.
const family = (name) =>
  name.replace(
    /[-.](?=[A-Za-z0-9_]{6}(?:$|-))(?=[A-Za-z0-9_]{0,5}[A-Z0-9_])[A-Za-z0-9_]{6}/,
    "",
  );
const label = (path) =>
  path.replace(temp, "<system-temp>").replace(sourceRoot, "<worktree>/");
const entries = readdirSync(temp).map((name) => {
  const path = join(temp, name);
  const info = lstatSync(path, { throwIfNoEntry: false });
  let record = null,
    error = null;
  if (info?.isDirectory() && !info.isSymbolicLink())
    try {
      record = readTemporaryOwner(path);
    } catch (caught) {
      error = caught.message;
    }
  return { name, path, info, record, error };
});
const bump = (counts, key) => (counts[key] = (counts[key] ?? 0) + 1);

const gates = rows.map((row) => {
  const end = Date.parse(row.recordedAt);
  const start = end - row.durationMs;
  const retained = new Set(
    (row.temporaryCleanup?.retained ?? []).map((item) => item.path ?? item),
  );
  const unaccounted = [];
  const born = { owned: {}, unownedDotln: {}, invalid: {}, other: {} };
  for (const { name, path, info, record, error } of entries) {
    if (!info) continue;
    if (
      (record?.owner?.gateId === row.temporaryGateId ||
        record?.fixtureOwner?.gateId === row.temporaryGateId) &&
      !retained.has(path)
    )
      unaccounted.push({
        root: label(path),
        class: record.class,
        suite: record.owner.suite ?? null,
        inTaskTimeline: (row.taskTimeline ?? []).some(
          (task) => task.name === record.owner.suite,
        ),
        repository: label(record.owner.repository),
        ownerBirthRecorded: record.owner.birth !== null,
        ownerAlive: ownerAlive(record, table),
        endedAt: record.endedAt ?? null,
      });
    if (!(info.birthtimeMs >= start && info.birthtimeMs <= end)) continue;
    const kind = info.isDirectory() ? "/" : "";
    if (record)
      bump(
        born.owned,
        `${family(name)}${kind} [${record.class}; gate ${String(record.owner.gateId).slice(0, 8)}${record.outcome ? `; ${record.outcome}` : ""}]`,
      );
    else if (error) bump(born.invalid, `${family(name)}${kind}`);
    else if (name.startsWith("dotln-"))
      bump(born.unownedDotln, `${family(name)}${kind}`);
    else bump(born.other, `${family(name)}${kind}`);
  }
  return {
    checkId: row.checkId,
    gateId: row.temporaryGateId,
    window: [new Date(start).toISOString(), row.recordedAt],
    rowCleanup: {
      removed: row.temporaryCleanup?.removed?.length ?? null,
      retained: [...retained].map(label),
      blockers: row.temporaryCleanup?.blockers?.length ?? null,
    },
    unaccountedRootsCarryingGate: unaccounted,
    bornInWindowStillPresent: born,
  };
});

console.log(
  JSON.stringify(
    {
      codeIdentity: identity,
      processTableReadable: table !== null,
      rows: gates.length,
      gates,
    },
    null,
    1,
  ),
);
if (!gates.some((gate) => gate.checkId === "npm test"))
  console.error("No passing complete row at the current code identity.");
if (gates.some((gate) => gate.unaccountedRootsCarryingGate.length)) {
  console.error(
    "Gate residue reproduced: a passing row left a root carrying its identity that its cleanup does not account for.",
  );
  process.exitCode = 1;
}
