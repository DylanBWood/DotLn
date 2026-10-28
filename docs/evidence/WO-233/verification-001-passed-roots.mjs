// VER-001 F1 probe: after a passing complete row, no root its passing suites
// created remains. Read-only. Exit 1 when the newest passing `npm test` row at
// the current code identity has system-temp roots it marked passed that still
// exist; the report names each nested owner record that pins one.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-001-passed-roots.mjs
import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../../../", import.meta.url));
const { coveringGateCheck } = await import(
  join(sourceRoot, "scripts/lib/gate-reuse.mjs")
);
const { row } = await coveringGateCheck(sourceRoot, "npm test", []);
if (!row?.temporaryGateId) {
  console.log(JSON.stringify({ row: null }));
  process.exit(0);
}
const gateId = row.temporaryGateId;
const temp = realpathSync(tmpdir());
const owner = (path) => {
  try {
    return JSON.parse(readFileSync(join(path, ".dotln-owner.json"), "utf8"));
  } catch {
    return null;
  }
};
// Nearest nested owner records whose recorded inode is not their directory's.
const copiedRecords = (path, found = []) => {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const child = join(path, entry.name);
    const record = owner(child);
    if (record) {
      if (record.inode !== lstatSync(child).ino) {
        let tracked = false;
        try {
          tracked =
            execFileSync(
              "git",
              ["-C", child, "ls-files", ".dotln-owner.json"],
              {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
              },
            ).trim() === ".dotln-owner.json";
        } catch {}
        found.push({ path: child, token: record.token, tracked });
      }
    } else copiedRecords(child, found);
  }
  return found;
};
const remaining = readdirSync(temp)
  .filter((name) => name.startsWith("dotln-"))
  .map((name) => join(temp, name))
  .filter((path) => {
    const record = owner(path);
    return (
      record?.owner?.gateId === gateId &&
      record.class === "gate-fixture" &&
      record.outcome === "passed"
    );
  })
  .map((path) => ({
    path,
    suite: owner(path).owner.suite,
    pinnedBy: copiedRecords(path),
  }));
const bySuite = {};
for (const root of remaining)
  bySuite[root.suite] = (bySuite[root.suite] ?? 0) + 1;
console.log(
  JSON.stringify(
    {
      gateId,
      recordedAt: row.recordedAt,
      codeIdentity: row.codeIdentity,
      passedRootsRemaining: remaining.length,
      bySuite,
      pinnedByCopiedRecord: remaining.filter((root) => root.pinnedBy.length)
        .length,
      pinnedByTrackedRecord: remaining.filter((root) =>
        root.pinnedBy.some((record) => record.tracked),
      ).length,
      example: remaining.find((root) => root.pinnedBy.length) ?? remaining[0],
      rowRetainedForNestedRoot: row.temporaryCleanup.retained.filter((entry) =>
        /nested owned root/.test(entry.reason ?? ""),
      ).length,
    },
    null,
    1,
  ),
);
if (remaining.length) {
  console.error(
    `F1 reproduced: ${remaining.length} roots the passing gate ${gateId} marked passed still exist.`,
  );
  process.exitCode = 1;
}
