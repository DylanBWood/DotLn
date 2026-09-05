import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";
import { decodeLog, type Event } from "@dotln/kernel";
import {
  beaconAddress,
  createBeaconWriter,
  renderConstellation,
  sweepBeacons,
  validateBeaconDirectory,
} from "../src/beacon-fs.js";
import {
  deriveBeaconProjections,
  encodeBeacon,
  type BeaconClaimRecord,
} from "../src/beacon.js";
import {
  runScenario,
  replayScenario,
  type FixtureTree,
} from "../src/scenario.js";

const repository = fileURLToPath(new URL("../../../../", import.meta.url));
const cliPath = fileURLToPath(new URL("../src/cli.js", import.meta.url));
const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/repo-tree.json", import.meta.url),
    "utf8",
  ),
) as FixtureTree;
const claim: BeaconClaimRecord = {
  recordType: "beacon-claim",
  codebookVersion: 1,
  provenance: "self-reported",
  scope: { workstreamId: "test", episodeId: "episode" },
  actor: "executor",
  claimedAt: 1200001,
  actionClass: "verification",
  outcome: "passed",
  refusalCount: 0,
};

const temporary = (t: TestContext): string => {
  const root = mkdtempSync(join(tmpdir(), "dotln-wo020-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
};

test("WO-020 AC2 filesystem live/replay cmp includes bytes, exact mtime and logical size", (t) => {
  const root = temporary(t);
  const liveWriter = createBeaconWriter(join(root, "live"), repository);
  const live = runScenario(fixture, { onEvents: liveWriter.project });
  const replayWriter = createBeaconWriter(join(root, "replay"), repository);
  replayWriter.project(decodeLog(replayScenario(live.log).log));
  assert.deepEqual(
    sweepBeacons(liveWriter.directory),
    sweepBeacons(replayWriter.directory),
  );
  const names = readdirSync(liveWriter.directory);
  assert.equal(names.length, 1);
  for (const name of names) {
    const left = join(liveWriter.directory, name);
    const right = join(replayWriter.directory, name);
    assert.deepEqual(readFileSync(left), readFileSync(right));
    const cmp = spawnSync("cmp", [left, right], { encoding: "utf8" });
    assert.equal(cmp.status, 0, cmp.stderr);
    const expected = encodeBeacon(
      deriveBeaconProjections(decodeLog(live.log))[0]!,
    );
    const stat = lstatSync(left, { bigint: true });
    assert.equal(stat.size, BigInt(expected.size));
    assert.equal(stat.mtimeNs, BigInt(expected.mtimeMs) * 1_000_000n);
    t.diagnostic(
      `cmp exit=0; size=${stat.size}; mtimeNs=${stat.mtimeNs}; content byte-identical`,
    );
  }
});

test("WO-020 AC3 metadata sweep succeeds with denied reads and garbage content", (t) => {
  const root = temporary(t);
  const writer = createBeaconWriter(join(root, "beacons"), repository);
  writer.claim(claim);
  const path = join(writer.directory, beaconAddress(claim));
  const before = sweepBeacons(writer.directory)[0]!;
  chmodSync(path, 0);
  try {
    assert.throws(() => readFileSync(path), { code: "EACCES" });
    assert.deepEqual(sweepBeacons(writer.directory), [before]);
  } finally {
    chmodSync(path, 0o600);
  }
  writeFileSync(path, Buffer.alloc(Number(before.size), "x"));
  assert.throws(() => JSON.parse(readFileSync(path, "utf8")));
  const after = sweepBeacons(writer.directory)[0]!;
  assert.equal(after.size, before.size);
  assert.deepEqual(after.decoded, before.decoded);
  t.diagnostic(
    `readFile=EACCES at mode 000; garbage JSON at preserved size=${after.size}; both sweeps decode verification/passed/self-reported`,
  );
});

test("WO-020 AC4 fake executor emits its claim before CommandResult without changing host evidence", (t) => {
  const root = temporary(t);
  const writer = createBeaconWriter(join(root, "beacons"), repository);
  let prefix: readonly Event[] = [];
  let claims = 0;
  const baseline = runScenario(fixture);
  const live = runScenario(fixture, {
    onEvents(events) {
      prefix = events;
      writer.project(events);
    },
    onExecutorClaim(record) {
      assert.ok(
        !prefix.some(
          ({ type }) =>
            type === "CommandResult" || type === "VerificationCompleted",
        ),
      );
      assert.equal(prefix.at(-1)!.type, "CommandPersisted");
      const host = deriveBeaconProjections(prefix)[0]!;
      const path = join(writer.directory, beaconAddress(host));
      const prior = readFileSync(path);
      const metadata = lstatSync(path, { bigint: true });
      writer.claim(record);
      claims++;
      assert.deepEqual(readFileSync(path), prior);
      assert.equal(lstatSync(path, { bigint: true }).mtimeNs, metadata.mtimeNs);
      const rows = sweepBeacons(writer.directory);
      assert.equal(rows.length, 2);
      assert.match(
        renderConstellation(rows),
        /verification\/passed.*self-reported/,
      );
      assert.match(
        renderConstellation(rows),
        /authority-decision\/allowed.*host-projected/,
      );
      t.diagnostic(
        "before CommandResult and VerificationCompleted: host=authority-decision/allowed; executor=verification/passed; host bytes and mtime unchanged",
      );
    },
  });
  assert.equal(claims, 1);
  assert.deepEqual(
    live,
    baseline,
    "observation edges do not change log, decisions, or adapter effects",
  );
  assert.equal(sweepBeacons(writer.directory).length, 2);
  let recoveryClaims = 0;
  runScenario(fixture, {
    crashAfterPersist: true,
    onExecutorClaim() {
      recoveryClaims++;
    },
  });
  assert.equal(
    recoveryClaims,
    1,
    "deduplicated dispatch does not emit a second claim",
  );
});

test(
  "WO-020 AC5 concurrent metadata observer sees only complete codewords and fixed addresses",
  { timeout: 15000 },
  async (t) => {
    const root = temporary(t);
    const writer = createBeaconWriter(join(root, "beacons"), repository);
    const alternate = { ...claim, outcome: "failed", refusalCount: 3 };
    writer.claim(claim);
    const signal = new SharedArrayBuffer(8);
    const control = new Int32Array(signal);
    const worker = new Worker(
      new URL("./beacon-observer.js", import.meta.url),
      {
        workerData: {
          directory: writer.directory,
          signal,
          allowedSizes: [claim, alternate].map((record) =>
            String(encodeBeacon(record).size),
          ),
        },
      },
    );
    try {
      await once(worker, "message");
      for (let index = 0; index < 128; index++) {
        writer.claim(index % 2 === 0 ? alternate : claim);
        const previous = Atomics.load(control, 1);
        assert.notEqual(
          Atomics.wait(control, 1, previous, 2000),
          "timed-out",
          "observer overlaps each emission",
        );
        assert.equal(
          Atomics.load(control, 0),
          0,
          "observer did not reject an intermediate state",
        );
      }
      const completion = once(worker, "message");
      Atomics.store(control, 0, 1);
      const [result] = (await completion) as [
        { samples: number; seen: string[] },
      ];
      assert.ok(result.samples >= 128);
      assert.equal(result.seen.length, 2);
      assert.deepEqual(
        readdirSync(root),
        ["beacons"],
        "sibling staging is removed",
      );
      t.diagnostic(
        `128 atomic replacements; concurrent sweeps=${result.samples}; observed both states; zero off-lattice sizes or temporary names`,
      );
    } finally {
      Atomics.store(control, 0, 1);
      await worker.terminate();
    }
  },
);

test("WO-020 edge refuses unsafe destinations and invalid records before publishing", (t) => {
  const root = temporary(t);
  assert.throws(() => validateBeaconDirectory("", repository), /requires/);
  assert.throws(
    () =>
      validateBeaconDirectory(
        join(repository, "docs/intake/beacons"),
        repository,
      ),
    /intake/,
  );
  const alias = join(root, "alias");
  symlinkSync(join(repository, "docs/intake"), alias);
  assert.throws(
    () => validateBeaconDirectory(join(alias, "beacons"), repository),
    /intake/,
  );
  assert.throws(
    () =>
      validateBeaconDirectory(
        join(repository, "beacons-not-ignored"),
        repository,
      ),
    /gitignored/,
  );
  assert.equal(
    validateBeaconDirectory(join(repository, ".beacons"), repository),
    join(repository, ".beacons"),
  );
  const writer = createBeaconWriter(join(root, "output"), repository);
  assert.ok(!existsSync(writer.directory));
  assert.throws(
    () => writer.claim({ ...claim, actor: "x".repeat(65536) }),
    /exceeds/,
  );
  assert.ok(!existsSync(writer.directory));
  writer.claim(claim);
  const before = readFileSync(join(writer.directory, beaconAddress(claim)));
  assert.throws(() => writer.claim({ ...claim, claimedAt: -1 }), /mtime/);
  assert.deepEqual(
    readFileSync(join(writer.directory, beaconAddress(claim))),
    before,
  );
  assert.throws(
    () =>
      writer.claim({
        ...claim,
        recordType: "beacon-projection",
      } as unknown as BeaconClaimRecord),
    /claims only/,
  );
  assert.equal(
    beaconAddress(claim),
    beaconAddress({
      ...claim,
      outcome: "failed",
      claimedAt: 42,
      refusalCount: 3,
    }),
  );
  const occupied = createBeaconWriter(join(root, "occupied"), repository);
  mkdirSync(occupied.directory);
  const sentinel = join(root, "sentinel");
  writeFileSync(sentinel, "untouched");
  symlinkSync(sentinel, join(occupied.directory, beaconAddress(claim)));
  assert.throws(() => occupied.claim(claim), /non-regular/);
  assert.equal(readFileSync(sentinel, "utf8"), "untouched");
  assert.equal(
    sweepBeacons(occupied.directory)[0]!.decoded.status,
    "malformed",
  );
  const changed = createBeaconWriter(join(root, "changed"), repository);
  symlinkSync(join(repository, "docs/intake"), changed.directory);
  assert.throws(() => changed.claim(claim), /changed since validation/);
});

test("WO-020 sweep labels future codebooks, malformed sizes and non-regular entries without state guesses", (t) => {
  const root = temporary(t);
  writeFileSync(join(root, "future"), Buffer.alloc(8365)); // Framing code 2, version 2.
  writeFileSync(join(root, "garbage"), "x");
  mkdirSync(join(root, "directory"));
  const rows = sweepBeacons(root);
  assert.deepEqual(rows.find(({ address }) => address === "future")!.decoded, {
    status: "unknown-codebook",
    codebookVersion: 2,
  });
  assert.equal(
    rows.find(({ address }) => address === "garbage")!.decoded.status,
    "malformed",
  );
  assert.equal(
    rows.find(({ address }) => address === "directory")!.decoded.status,
    "malformed",
  );
  const rendered = renderConstellation(rows);
  assert.match(rendered, /unknown-codebook \| — \| — \| 2/);
  assert.match(rendered, /malformed \| — \| — \| —/);
  assert.doesNotMatch(
    rendered,
    /host-projected|self-reported|verification\/passed/,
  );
});

test("WO-020 AC6 CLI is opt-in, exact apart from version, and prints terminal host state last", (t) => {
  const root = temporary(t);
  const run = (...args: string[]) =>
    spawnSync(process.execPath, [cliPath, ...args], {
      cwd: root,
      encoding: "utf8",
    });
  const baseline = readFileSync(
    new URL("../../fixtures/wo020-base-cli.txt", import.meta.url),
    "utf8",
  );
  const manifest = JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
  ) as { version: string };
  const plain = run();
  assert.equal(plain.status, 0, plain.stderr);
  assert.equal(plain.stderr, "");
  assert.equal(
    plain.stdout,
    baseline.replace(
      /^@dotln\/skeleton v0\.5\.0/,
      `@dotln/skeleton v${manifest.version}`,
    ),
  );
  assert.deepEqual(readdirSync(root), [], "default creates no files");
  for (const args of [
    ["--beacons"],
    ["--beacons", "--audit"],
    ["--beacons", join(root, "unused"), "--beacons", join(root, "unused2")],
  ]) {
    const rejected = run(...args);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /usage: --beacons/);
    assert.deepEqual(readdirSync(root), []);
  }
  const directory = join(root, "beacons");
  const emitted = run("--audit", "--compiled-diff", "--beacons", directory);
  assert.equal(emitted.status, 0, emitted.stderr);
  assert.equal(emitted.stderr, "");
  const rows = sweepBeacons(directory);
  assert.equal(rows.length, 2);
  assert.ok(rows[0]!.size < rows[1]!.size);
  assert.match(
    renderConstellation(rows).split("\n").at(-1)!,
    /external-effect\/observed \| 1 \| host-projected/,
  );
  assert.ok(emitted.stdout.includes(renderConstellation(rows)));
  assert.ok(emitted.stdout.endsWith("\nverified=true candidates=1\n"));
  const repeat = run("--audit", "--compiled-diff", "--beacons", directory);
  assert.equal(repeat.status, 0, repeat.stderr);
  assert.equal(repeat.stdout, emitted.stdout);
  t.diagnostic(renderConstellation(rows));
});
