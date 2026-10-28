// Recover the checked private-TMPDIR coordination records of one historical
// failed fixture. Validate the full set before changing any remaining record;
// keep every old marker and both ancestors' original diagnosis bytes.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  temporaryOutcomeRecord,
  nestedTemporaryRoots,
  ownerAlive,
  readTemporaryOwner,
  requireTemporaryDirectory,
  temporaryProcessTable,
  writeTemporaryOwner,
} from "../../../scripts/lib/temporary-roots.mjs";
import { activeGateRuns } from "../../../scripts/lib/gate-evidence.mjs";
import {
  hostStateRoot,
  withHostLock,
} from "../../../scripts/lib/host-resources.mjs";
import { readHolders } from "../../../scripts/lib/host-lanes.mjs";
import { harnessWriterView } from "../../../packages/skeleton/dist/src/harness-host.js";
import { judgeTemporaryRoot } from "../../../scripts/lib/temporary-prune.mjs";

const root = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));
const apply = process.argv.includes("--apply");
assert.ok(process.argv.slice(2).every((arg) => arg === "--apply"));
const parent = join(realpathSync(tmpdir()), "dotln-fixture-temporary-3sHpVT");
const marker = (path) => join(path, ".dotln-owner.json");
const digest = (value) => createHash("sha256").update(value).digest("hex");
const originalParent = readFileSync(marker(parent), "utf8");
const specs = [
  [
    "dotln-outside-grants-nLsVtU",
    "temporary",
    "c302a6ca-3a9e-4815-a316-aa9ce3f6ba1e",
  ],
  [
    "dotln-outside-redirect-Gufu0C",
    "temporary",
    "e28d35f3-91e2-46c7-9c3a-ddf108331735",
  ],
  [
    "dotln-repair-grants-85iCS6",
    "per-user-temp",
    "a7901be8-e06e-4137-a19e-e31a189962be",
  ],
  ["dotln-wo168-hooks-fNPu7Q", "", "56760124-3ace-4166-acdd-8a2cc4deef81"],
  [
    "dotln-wo168-roots-uiSxip",
    "temporary",
    "52b5fad2-f930-4c7c-a3c4-75f9a757d908",
  ],
].map(([name, temporary, token], i) => {
  const container = join(parent, name);
  const subject = join(
    container,
    temporary,
    `dotln-writer-transition-${process.getuid()}`,
  );
  return {
    container,
    subject,
    token,
    backup:
      i === 0
        ? join(parent, ".dotln-diagnosis-ver004.json")
        : join(container, ".dotln-diagnosis-ver004.json"),
    original: readFileSync(marker(subject), "utf8"),
    originalContainer: readFileSync(marker(container), "utf8"),
  };
});

function inspect() {
  requireTemporaryDirectory(parent);
  const outer = readTemporaryOwner(parent);
  const table = temporaryProcessTable(root);
  assert.ok(table, "a complete process observation is required");
  assert.equal(outer.token, "02e566e3-0645-4813-8693-ebd66de17551");
  assert.equal(outer.owner.repository, root);
  assert.equal(outer.owner.gateId, "b59b8fda-c3f3-4cf4-9c7d-9cb4ab8ea233");
  assert.equal(outer.owner.suite, "harness-fixtures");
  assert.equal(outer.outcome, "failed");
  assert.equal(outer.endedAt, "2026-10-27T02:29:09.310Z");
  assert.equal(outer.retentionHours, 24);
  assert.equal(ownerAlive(outer, table), false);
  const plans = specs.map((spec) => {
    const { container, subject } = spec;
    for (const path of [container, subject]) requireTemporaryDirectory(path);
    const containing = readTemporaryOwner(container),
      child = readTemporaryOwner(subject);
    requireTemporaryDirectory(child.owner.repository);
    assert.ok(child.owner.repository.startsWith(parent + sep));
    const repository = readTemporaryOwner(child.owner.repository);
    for (const record of [containing, repository]) {
      assert.equal(record.class, "gate-fixture");
      assert.deepEqual(record.owner, outer.owner);
      assert.equal(record.outcome, outer.outcome);
      assert.equal(record.endedAt, outer.endedAt);
      assert.equal(record.retentionOverride, undefined);
      assert.equal(ownerAlive(record, table), false);
    }
    assert.equal(child.token, spec.token);
    assert.equal(child.class, "coordination");
    assert.equal(child.owner.gateId, outer.owner.gateId);
    assert.equal(child.owner.suite, outer.owner.suite);
    assert.equal(child.retentionOverride, undefined);
    assert.equal(ownerAlive(child, table), false);
    if (child.fixtureOwner) {
      assert.equal(child.fixtureOwner.token, containing.token);
      assert.equal(child.endedAt, outer.endedAt);
      assert.equal(child.retentionHours, 24);
      const saved = JSON.parse(readFileSync(spec.backup, "utf8"));
      const prior = JSON.parse(saved.originalMarker);
      assert.equal(prior.token, child.token);
      assert.equal(prior.fixtureOwner, undefined);
    } else assert.equal(child.retentionHours, null);
    const leases = `${digest(realpathSync(child.owner.repository))}.registrations`;
    assert.deepEqual(readdirSync(subject).sort(), [
      ".dotln-owner.json",
      leases,
    ]);
    requireTemporaryDirectory(join(subject, leases));
    assert.deepEqual(readdirSync(join(subject, leases)), []);
    assert.deepEqual(activeGateRuns(child.owner.repository), []);
    const writer = harnessWriterView(child.owner.repository);
    assert.ok(!writer.reserved || writer.alive === false);
    return { ...spec, containing, child };
  });
  return { outer, table, plans };
}
const checked = inspect();
if (apply)
  await withHostLock(hostStateRoot(), "lanes", async () => {
    assert.deepEqual(activeGateRuns(root), []);
    assert.deepEqual(
      readHolders(hostStateRoot(), { worktree: root, includeWorktrees: true })
        .holders,
      [],
    );
    const current = inspect();
    assert.equal(readFileSync(marker(parent), "utf8"), originalParent);
    for (const plan of current.plans) {
      assert.equal(
        readFileSync(marker(plan.container), "utf8"),
        plan.originalContainer,
      );
      assert.equal(readFileSync(marker(plan.subject), "utf8"), plan.original);
    }
    for (const plan of current.plans) {
      if (plan.child.fixtureOwner) continue;
      const finished = temporaryOutcomeRecord(
        {
          ...plan.child,
          fixtureOwner: {
            token: plan.containing.token,
            gateId: plan.containing.owner.gateId,
            suite: plan.containing.owner.suite,
          },
        },
        "failed",
        current.outer.endedAt,
      );
      if (existsSync(plan.backup)) {
        const saved = JSON.parse(readFileSync(plan.backup, "utf8"));
        assert.equal(saved.path, relative(parent, plan.subject));
        assert.equal(saved.originalMarker, plan.original);
      } else
        writeFileSync(
          plan.backup,
          JSON.stringify(
            {
              path: relative(parent, plan.subject),
              originalMarker: plan.original,
              proof:
                "Source-identified private TMPDIR; same failed gate and suite; sibling repository has the parent creator and original completion; dead processes and empty registration leases.",
            },
            null,
            2,
          ) + "\n",
          { flag: "wx", mode: 0o600 },
        );
      writeTemporaryOwner(plan.subject, finished);
    }
    assert.equal(readFileSync(marker(parent), "utf8"), originalParent);
    for (const plan of current.plans)
      assert.equal(
        readFileSync(marker(plan.container), "utf8"),
        plan.originalContainer,
      );
  });
const after = inspect(),
  now = Date.now();
const missing = [];
const walk = (path) => {
  for (const child of nestedTemporaryRoots(path)) {
    const record = readTemporaryOwner(child);
    if (record.class === "coordination" && !record.fixtureOwner)
      missing.push(relative(parent, child));
    walk(child);
  }
};
walk(parent);
// Projection only: skip this executor's writer; no deletion or artificial
// timestamp is passed to an apply. Release close supplies the actual context.
const released = {
  processes: after.table,
  worktrees: [],
  holders: [],
  finishingGate: { repository: root, id: "recovery-projection" },
};
const judgment = (at) => {
  const row = judgeTemporaryRoot(root, parent, { now: at }, released);
  return row.candidate ? "candidate" : row.retained.reason;
};
const output = {
  observedAt: new Date(now).toISOString(),
  apply,
  source:
    "scripts/test-harness.mjs private TMPDIR cases: outside-grants, outside-redirect, repair-grants, wo168-hooks, wo168-roots; writer-teardown.mjs transitionPaths",
  records: after.plans.map((plan) => ({
    subject: relative(parent, plan.subject),
    markerBeforeSha256: digest(plan.original),
    recovered: Boolean(plan.child.fixtureOwner),
    markerBackupPresent: existsSync(plan.backup),
    ancestorBytesPreserved:
      readFileSync(marker(plan.container), "utf8") === plan.originalContainer,
  })),
  originalDiagnosisEnd: checked.outer.endedAt,
  originalParentBytesPreserved:
    readFileSync(marker(parent), "utf8") === originalParent,
  missingContainingLifetimes: missing,
  judgedNowWithWriterReleased: judgment(now),
  judgedAfterWindowWithWriterReleased: judgment(now + 49 * 3_600_000),
};
console.log(JSON.stringify(output, null, 2));
if (apply) {
  assert.deepEqual(missing, []);
  assert.equal(output.judgedAfterWindowWithWriterReleased, "candidate");
}
