// FINAL-001 probe: a temporary root whose owner repository is gone and whose
// owner record carries a pre-reboot device number. Run from the repository
// root under `node scripts/harness.mjs bounded -- node
// docs/evidence/WO-237/final-review-probes.mjs`. Exit 0 when every observation
// below holds; the observations are printed as one JSON document.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createFixtureRoot,
  createTemporaryRoot,
  ensureTemporaryRoot,
  readTemporaryOwner,
  removeTemporaryPath,
  removeTemporaryRoot,
  writeTemporaryOwner,
  TEMPORARY_OWNER_FILE,
} from "../../../scripts/lib/temporary-roots.mjs";
import { judgeTemporaryRoot } from "../../../scripts/lib/temporary-prune.mjs";

const container = createFixtureRoot(
  join(tmpdir(), "dotln-final-review-probe-"),
);
const root = ensureTemporaryRoot(join(container, "subject"), {
  class: "session-scratch",
  repository: container,
  owner: { gateId: undefined, suite: undefined },
});
const fixtureRecord = readTemporaryOwner(root);
delete fixtureRecord.fixtureOwner;
writeTemporaryOwner(root, fixtureRecord);
mkdirSync(join(root, "roots"));
const judge = (path) => judgeTemporaryRoot(root, path, {}, { processes: [] });
const observed = {};
try {
  // An expired gate fixture owned by a checkout that a release close later
  // removes, as the system temporary directory holds them.
  const closed = join(root, "closed-checkout");
  mkdirSync(closed);
  const orphan = createTemporaryRoot(join(root, "roots", "orphan-"), {
    class: "gate-fixture",
    repository: closed,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      session: "0".repeat(64),
      gateId: undefined,
      suite: undefined,
    },
  });
  const record = readTemporaryOwner(orphan);
  record.createdAt = "2020-01-01T00:00:00.000Z";
  record.endedAt = record.createdAt;
  writeTemporaryOwner(orphan, record);
  observed.withRepository = judge(orphan).candidate ? "candidate" : "retained";
  rmSync(closed, { recursive: true, force: true });
  observed.repositoryGone = judge(orphan).candidate
    ? "candidate"
    : judge(orphan).retained.reason;
  // The reboot: the volume's device number changes while the directory, its
  // inode and the token in its marker do not.
  const marker = join(orphan, TEMPORARY_OWNER_FILE);
  const current = JSON.parse(readFileSync(marker, "utf8"));
  writeFileSync(
    marker,
    JSON.stringify({ ...current, device: current.device + 1 }) + "\n",
  );
  const renumbered = judge(orphan);
  observed.repositoryGoneAndRenumbered = renumbered.candidate
    ? "candidate"
    : renumbered.retained.reason;
  observed.markerDeviceAfterJudgment = JSON.parse(
    readFileSync(marker, "utf8"),
  ).device;
  observed.restamped = observed.markerDeviceAfterJudgment === current.device;
  // A retry reads the same.
  const again = judge(orphan);
  observed.retry = again.candidate ? "candidate" : again.retained.reason;
  // The same root with its owner repository present is re-stamped and judged.
  const kept = join(root, "kept-checkout");
  mkdirSync(kept);
  const bound = createTemporaryRoot(join(root, "roots", "bound-"), {
    class: "gate-fixture",
    repository: kept,
    owner: {
      pid: 2147483647,
      birth: "1.0",
      session: "0".repeat(64),
      gateId: undefined,
      suite: undefined,
    },
  });
  const boundRecord = readTemporaryOwner(bound);
  boundRecord.createdAt = "2020-01-01T00:00:00.000Z";
  boundRecord.endedAt = boundRecord.createdAt;
  writeTemporaryOwner(bound, boundRecord);
  const boundMarker = join(bound, TEMPORARY_OWNER_FILE);
  const boundCurrent = JSON.parse(readFileSync(boundMarker, "utf8"));
  writeFileSync(
    boundMarker,
    JSON.stringify({ ...boundCurrent, device: boundCurrent.device + 1 }) + "\n",
  );
  const boundJudged = judge(bound);
  observed.repositoryPresentAndRenumbered = boundJudged.candidate
    ? "candidate"
    : boundJudged.retained.reason;
  observed.boundRestamped =
    JSON.parse(readFileSync(boundMarker, "utf8")).device ===
    boundCurrent.device;
} finally {
  removeTemporaryRoot(root, fixtureRecord.token);
  removeTemporaryPath(container, { recursive: true, force: true });
}
console.log(JSON.stringify(observed, null, 2));
const expected =
  observed.withRepository === "candidate" &&
  observed.repositoryGone === "candidate" &&
  /device changed and its owner's ledger does not register/.test(
    observed.repositoryGoneAndRenumbered,
  ) &&
  observed.restamped === false &&
  observed.retry === observed.repositoryGoneAndRenumbered &&
  observed.repositoryPresentAndRenumbered === "candidate" &&
  observed.boundRestamped === true;
process.exit(expected ? 0 : 1);
