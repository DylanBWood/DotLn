// Recover this unreleased implementation's fixture residue. The general
// ownership reader stays strict: only a completed fixture's checked copies
// and contained runtime coordination are migrated before normal gate cleanup.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runGit } from "../../../scripts/lib/git.mjs";
import {
  readGateChecks,
  activeGateRuns,
} from "../../../scripts/lib/gate-evidence.mjs";
import { readHolders } from "../../../scripts/lib/host-lanes.mjs";
import {
  hostStateRoot,
  withHostLock,
} from "../../../scripts/lib/host-resources.mjs";
import {
  TEMPORARY_OWNER_FILE,
  nestedTemporaryRoots,
  ownerAlive,
  readTemporaryOwner,
  temporaryInventory,
  temporaryProcessTable,
  writeTemporaryOwner,
  registeredTemporaryRoots,
  removeTemporaryRoot,
  readRetention,
} from "../../../scripts/lib/temporary-roots.mjs";
import { finishGateTemporaryRoots } from "../../../scripts/lib/temporary-prune.mjs";

const root = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));
const apply = process.argv.includes("--apply");
const diagnosis = process.argv.includes("--diagnosis");
const attempt = process.argv
  .slice(2)
  .find((arg) => /^--attempt=\d{3}$/.test(arg));
assert.ok(
  process.argv
    .slice(2)
    .every(
      (arg) => arg === "--apply" || arg === "--diagnosis" || arg === attempt,
    ),
);
const output = fileURLToPath(
  new URL(
    attempt
      ? `repair-residue-${attempt.slice(-3)}.json`
      : "repair-residue.json",
    import.meta.url,
  ),
);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const contained = (parent, path) =>
  path === parent || path.startsWith(parent + sep);
const rows = readGateChecks(root);
const table = temporaryProcessTable(root);
assert.ok(table, "a readable process table is required");
const plans = [];
const skipped = [];
const candidates = diagnosis
  ? registeredTemporaryRoots(root).map((row) => row.path)
  : readdirSync(realpathSync(tmpdir()), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("dotln-"))
      .map((entry) => join(realpathSync(tmpdir()), entry.name));

for (const path of [...new Set(candidates)].sort(
  (a, b) => a.length - b.length || a.localeCompare(b),
)) {
  if (plans.some((plan) => contained(plan.path, path))) continue;
  let anchor;
  try {
    anchor = readTemporaryOwner(path);
  } catch {
    continue;
  }
  if (
    anchor?.owner.repository !== root ||
    anchor.class !== "gate-fixture" ||
    anchor.outcome !== (diagnosis ? "failed" : "passed") ||
    (!diagnosis && anchor.retentionHours !== 0) ||
    ownerAlive(anchor, table) !== false
  )
    continue;
  const gate = rows.findLast(
    (row) => row.temporaryGateId === anchor.owner.gateId,
  );
  const task = gate?.taskTimeline?.find(
    (task) => task.name === anchor.owner.suite,
  );
  if (diagnosis && (!task || (task.exitCode === 0 && !task.stopped))) continue;
  assert.ok(
    diagnosis || (task?.exitCode === 0 && !task.stopped),
    "fixture has no recorded passing suite",
  );
  const children = [];
  const visit = (at) => {
    for (const child of nestedTemporaryRoots(at)) {
      const marker = join(child, TEMPORARY_OWNER_FILE);
      const info = lstatSync(marker);
      assert.ok(
        info.isFile() && !info.isSymbolicLink(),
        "non-regular marker is retained",
      );
      const bytes = readFileSync(marker, "utf8");
      let valid = true,
        record;
      try {
        record = readTemporaryOwner(child);
      } catch {
        valid = false;
        try {
          record = JSON.parse(bytes);
        } catch {
          record = null;
        }
      }
      children.push({
        path: child,
        record,
        valid,
        sha256: digest(bytes),
        bytes,
      });
      visit(child);
    }
  };
  try {
    visit(path);
    const copies = [],
      migrations = [],
      disposals = [];
    const testContainer = (path) => {
      let at = path;
      while (contained(path, at) || contained(planRoot, at)) {
        if (/^dotln-temporary-roots-test-[A-Za-z0-9]{6}$/.test(basename(at))) {
          const record = readTemporaryOwner(at);
          if (
            record?.class === "gate-fixture" &&
            record.owner.repository === root &&
            record.owner.gateId === anchor.owner.gateId
          )
            return at;
        }
        const parent = join(at, "..");
        if (parent === at || !contained(planRoot, parent)) break;
        at = parent;
      }
      return null;
    };
    const planRoot = path;
    for (const child of children) {
      const record = child.record;
      const container = testContainer(child.path);
      const emptyControl =
        readdirSync(child.path).join() === TEMPORARY_OWNER_FILE;
      const local = container ? relative(container, child.path) : "";
      const registration = container
        ? registeredTemporaryRoots(container).find(
            (row) => row.path === child.path,
          )
        : null;
      const source = children.find(
        (peer) =>
          peer.valid &&
          peer.path !== child.path &&
          peer.sha256 === child.sha256,
      );
      // These exact empty controls deliberately planted malformed or copied
      // records. Their valid containing fixture and creation registration,
      // source bytes and named test shape attribute them without adopting a
      // replaced directory or removing any independent payload.
      const plantedMalformed =
        !child.valid &&
        container &&
        emptyControl &&
        registration &&
        ["blocked", "unrelated"].includes(local) &&
        child.bytes === "invalid\n" &&
        registration.class === "session-scratch" &&
        registration.owner.gateId === anchor.owner.gateId;
      const plantedCopy =
        !child.valid &&
        container &&
        emptyControl &&
        registration &&
        source &&
        /^roots\/copied-[A-Za-z0-9]{6}$/.test(local) &&
        /^roots\/forever-[A-Za-z0-9]{6}$/.test(
          relative(container, source.path),
        ) &&
        source.record.owner.pid === 2147483647 &&
        source.record.owner.birth === "1.0";
      if (plantedMalformed || plantedCopy) {
        copies.push({
          path: relative(path, child.path),
          sha256: child.sha256,
          token: registration.token,
          proof: {
            kind: plantedMalformed
              ? "empty-malformed-control"
              : "empty-copy-control",
            registrationToken: registration.token,
            source: "scripts/test-temporary-roots.mjs",
            ...(source ? { sourcePath: relative(path, source.path) } : {}),
          },
        });
        continue;
      }
      const plantedNull =
        child.valid &&
        container &&
        emptyControl &&
        ((/^roots\/(?:forever-[A-Za-z0-9]{6}|recovery-parent-[A-Za-z0-9]{6}\/(?:forever|scratch)-[A-Za-z0-9]{6})$/.test(
          local,
        ) &&
          record.owner.pid === 2147483647 &&
          record.owner.birth === "1.0") ||
          (local === "changed-policy" &&
            record.owner.session === digest("changed-policy") &&
            ownerAlive(record, table) === false)) &&
        (record.retentionOverride === null ||
          readRetention(record.owner.repository)[record.class] === null);
      if (plantedNull) {
        disposals.push({
          path: relative(path, child.path),
          sha256: child.sha256,
          token: record.token,
          proof:
            "explicit teardown of an empty, source-identified null-retention test control",
        });
        continue;
      }
      if (!child.valid) {
        assert.ok(
          record?.schemaVersion === 1 &&
            record.class === "gate-fixture" &&
            /^[a-f0-9-]{36}$/.test(record.token) &&
            record.owner?.repository === root &&
            record.owner.gateId === anchor.owner.gateId &&
            record.owner.suite === anchor.owner.suite &&
            ownerAlive(record, table) === false &&
            !Object.hasOwn(record, "retentionOverride") &&
            (record.device !== lstatSync(child.path).dev ||
              record.inode !== lstatSync(child.path).ino),
          "unattributable or independently retained metadata is retained",
        );
        let proof;
        if (source && source.record.token === record.token)
          proof = {
            kind: "valid-source-record",
            source: relative(path, source.path),
          };
        const commits = runGit(
          child.path,
          [
            "--no-replace-objects",
            "log",
            "--all",
            "--format=%H",
            "--diff-filter=A",
            "--",
            TEMPORARY_OWNER_FILE,
          ],
          { onFailure: () => "" },
        )
          .split("\n")
          .filter(Boolean);
        for (const commit of proof ? [] : commits) {
          const blob = runGit(
            child.path,
            [
              "--no-replace-objects",
              "show",
              `${commit}:${TEMPORARY_OWNER_FILE}`,
            ],
            { trim: false, onFailure: () => null },
          );
          if (blob === child.bytes) {
            proof = { kind: "tracked-copy", commit };
            break;
          }
        }
        if (!proof) {
          const peer = children.find(
            (peer) =>
              peer.path !== child.path &&
              !peer.valid &&
              peer.sha256 === child.sha256,
          );
          if (
            peer &&
            [
              anchor.token,
              ...children
                .filter((row) => row.valid)
                .map((row) => row.record.token),
            ].includes(record.fixtureOwner?.token) &&
            record.fixtureOwner?.gateId === anchor.owner.gateId
          )
            proof = {
              kind: "duplicate-contained-fixture-record",
              peer: relative(path, peer.path),
            };
        }
        assert.ok(proof, "no independent copy proof; metadata is retained");
        copies.push({
          path: relative(path, child.path),
          sha256: child.sha256,
          token: record.token,
          proof,
        });
      } else if (
        record.fixtureOwner?.gateId !== anchor.owner.gateId &&
        record.retentionOverride !== null &&
        contained(path, record.owner.repository) &&
        (ownerAlive(record, table) === false ||
          (record.class === "coordination" &&
            !existsSync(record.owner.repository))) &&
        (!existsSync(record.owner.repository) ||
          !activeGateRuns(record.owner.repository).length)
      ) {
        migrations.push({
          path: relative(path, child.path),
          sha256: child.sha256,
          token: record.token,
        });
      }
    }
    if (diagnosis && !copies.length && !migrations.length && !disposals.length)
      continue;
    plans.push({
      path,
      root: basename(path),
      token: anchor.token,
      sha256: digest(readFileSync(join(path, TEMPORARY_OWNER_FILE))),
      device: anchor.device,
      inode: anchor.inode,
      gateId: anchor.owner.gateId,
      suite: anchor.owner.suite,
      copies,
      migrations,
      disposals,
      bytes: temporaryInventory(path).bytes,
    });
  } catch (error) {
    if (!diagnosis) throw error;
    skipped.push({ root: basename(path), reason: error.message });
  }
}

const cleanups = [];
if (apply)
  await withHostLock(hostStateRoot(), "lanes", async () => {
    assert.equal(
      readHolders(hostStateRoot(), { worktree: root, includeWorktrees: true })
        .holders.length,
      0,
      "a live host lane retains all material",
    );
    assert.equal(
      activeGateRuns(root).length,
      0,
      "a live gate retains all material",
    );
    // Recheck the complete plan before the first mutation. No marker is
    // removed merely because it is malformed or old.
    for (const plan of plans) {
      const anchor = readTemporaryOwner(plan.path);
      assert.equal(anchor.token, plan.token);
      assert.equal(
        digest(readFileSync(join(plan.path, TEMPORARY_OWNER_FILE))),
        plan.sha256,
      );
      assert.equal(ownerAlive(anchor), false);
      for (const child of [
        ...plan.copies,
        ...plan.migrations,
        ...plan.disposals,
      ])
        assert.equal(
          digest(
            readFileSync(join(plan.path, child.path, TEMPORARY_OWNER_FILE)),
          ),
          child.sha256,
        );
    }
    for (const plan of plans) {
      if (diagnosis) {
        const evidence =
          JSON.stringify(
            [...plan.copies, ...plan.disposals, ...plan.migrations].map(
              (child) => ({
                ...child,
                originalBytes: readFileSync(
                  join(plan.path, child.path, TEMPORARY_OWNER_FILE),
                  "utf8",
                ),
              }),
            ),
            null,
            2,
          ) + "\n";
        const file = join(
          plan.path,
          `.dotln-diagnosis-owners-${attempt?.slice(-3) ?? "original"}.json`,
        );
        if (existsSync(file))
          assert.equal(readFileSync(file, "utf8"), evidence);
        else writeFileSync(file, evidence, { flag: "wx", mode: 0o600 });
      }
      for (const child of plan.copies)
        unlinkSync(join(plan.path, child.path, TEMPORARY_OWNER_FILE));
      for (const child of plan.disposals)
        removeTemporaryRoot(join(plan.path, child.path), child.token);
      for (const child of plan.migrations) {
        const path = join(plan.path, child.path),
          record = readTemporaryOwner(path);
        assert.equal(record.token, child.token);
        writeTemporaryOwner(path, {
          ...record,
          fixtureOwner: {
            token: plan.token,
            gateId: plan.gateId,
            suite: plan.suite,
          },
        });
      }
    }
    for (const gateId of new Set(plans.map((plan) => plan.gateId))) {
      const gate = rows.findLast((row) => row.temporaryGateId === gateId);
      const result = finishGateTemporaryRoots(root, gateId, gate.taskTimeline, {
        rootPaths: plans
          .filter((plan) => plan.gateId === gateId)
          .map((plan) => plan.path),
        endedAt: gate.recordedAt,
      });
      cleanups.push({
        gateId,
        removed: result.removed.length,
        retained: result.retained,
        blockers: result.blockers,
      });
    }
  });
const remaining = plans
  .filter((plan) => existsSync(plan.path))
  .map((plan) => plan.root);
const result = {
  schemaVersion: 1,
  observedAt: new Date().toISOString(),
  apply,
  diagnosis,
  rule: "Only recorded terminal fixtures with dead creators are recovered. Copied markers require a matching immutable Git blob, a valid source, duplicate bytes tied to the containing fixture, or an empty source-identified negative control with its creation registration. Failed fixtures retain their diagnosis data and original gate-end window, including the recovered marker bytes. General invalid-record refusal is unchanged.",
  roots: plans.map(({ path, ...plan }) => plan),
  summary: {
    planned: plans.length,
    bytes: plans.reduce((sum, plan) => sum + plan.bytes, 0),
    copies: plans.reduce((sum, plan) => sum + plan.copies.length, 0),
    inheritedLifetimes: plans.reduce(
      (sum, plan) => sum + plan.migrations.length,
      0,
    ),
    emptyTestControls: plans.reduce(
      (sum, plan) => sum + plan.disposals.length,
      0,
    ),
    removed: apply ? plans.length - remaining.length : 0,
    remaining: remaining.length,
  },
  cleanups,
  remaining,
  skipped,
};
writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result.summary));
if (apply) {
  if (!diagnosis)
    assert.equal(
      remaining.length,
      0,
      "recovered fixtures remain after lifecycle cleanup",
    );
  assert.equal(
    cleanups.flatMap((row) => row.blockers).length,
    0,
    "lifecycle cleanup reported blockers",
  );
}
