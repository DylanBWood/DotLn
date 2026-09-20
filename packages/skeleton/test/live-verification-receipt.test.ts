import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const directory = fileURLToPath(
  new URL("../../../../docs/evidence/WO-056/", import.meta.url),
);
const { validateReceipt } = await import(
  new URL("../../../../docs/evidence/WO-056/receipt.mjs", import.meta.url).href
);
const { replayRecorded } = await import(
  new URL("../../../../docs/evidence/WO-056/replay.mjs", import.meta.url).href
);
const names = readdirSync(directory).filter((name) =>
  /^(claude|codex|double)-.*\.json$/u.test(name),
);
type Receipt = ReturnType<typeof JSON.parse>;
const receipts: { name: string; receipt: Receipt }[] = names.map((name) => ({
  name,
  receipt: JSON.parse(readFileSync(join(directory, name), "utf8")),
}));
const flags = ["findingPass", "repairPass", "reverificationPass", "foldPass"];
const refuses = (name: string, receipt: Receipt, label: string) =>
  assert.throws(() => validateReceipt(receipt), `${name}: ${label}`);
const mutate = (receipt: Receipt, change: (r: Receipt) => void): Receipt => {
  const forged = structuredClone(receipt);
  change(forged);
  return forged;
};

test("WO-056 receipts keep their closed shape, labels, failures and private-output boundary", () => {
  assert.ok(receipts.length >= 1);
  for (const { name, receipt } of receipts) {
    assert.doesNotThrow(() => validateReceipt(receipt), name);
    const shape: [string, (r: Receipt) => void][] = [
      ["extra top-level field", (r) => (r.unexpected = "raw transcript")],
      ["unlabelled fact", (r) => delete r.finding.epistemic],
      [
        "launch promoted to readback",
        (r) => (r.launch.effectiveReadback = "x"),
      ],
      [
        "observed fact relabelled a claim",
        (r) => (r.host.epistemic = "launch-claim"),
      ],
      [
        "unknown carrying a value",
        (r) => (r.planted = { epistemic: "unknown", value: {}, reason: "x" }),
      ],
      ["nested extra field", (r) => (r.fixture.value.contract.note = "x")],
      [
        "path in a placeholder",
        (r) => (r.fixture.value.store = "~/secret/store"),
      ],
      [
        "wire transcript",
        (r) =>
          r.episodes.value.push({
            ...r.episodes.value[0],
            wire: { transcript: "raw" },
          }),
      ],
      ["typed host facts", (r) => (r.host.value.exitCode = "zero")],
      [
        "containment restated",
        (r) => (r.boundary.value.after.sentinel = "0".repeat(64)),
      ],
      [
        "unavailable snapshot called unchanged",
        (r) =>
          (r.boundary.value.after = {
            error: "protected-snapshot-unavailable",
          }),
      ],
    ];
    for (const [label, change] of shape)
      refuses(name, mutate(receipt, change), label);
    for (const secret of [
      "/Users/synthetic/private-file",
      "/opt/homebrew/bin/node",
      "~/.config/credentials",
      "C:\\Users\\synthetic\\file",
      "sk-ant-api03-syntheticsyntheticsynthetic",
      "ghp_syntheticsyntheticsynthetic0000",
      "Authorization: Basic c3ludGhldGljOnN5bnRoZXRpYw==",
      "ANTHROPIC_AUTH_TOKEN=synthetic",
    ])
      assert.throws(
        () =>
          validateReceipt(
            mutate(receipt, (r) => {
              r.failure.value = { code: "synthetic", detail: secret };
            }),
          ),
        /privacy screen/,
        `${name}: ${secret}`,
      );

    // A failed attempt stays filed as a failure; no unclaimed pass can be promoted.
    for (const flag of flags.filter((item) => !receipt.result.value[item]))
      refuses(
        name,
        mutate(receipt, (r) => {
          for (const earlier of flags.slice(0, flags.indexOf(flag) + 1))
            r.result.value[earlier] = true;
        }),
        `forged ${flag}`,
      );
    if (!receipt.result.value.reverificationPass) continue;

    const harness = receipt.launch.value.harness;
    const claims: [string, (r: Receipt) => void][] = [
      // A process double cannot be relabelled live, and no harness as another.
      [
        "harness relabelled",
        (r) => {
          const other = harness === "claude" ? "codex" : "claude";
          r.launch.value.harness = other;
          r.episode = `${other}-relabelled`;
        },
      ],
      [
        "harness relabelled with a plausible launch claim",
        (r) => {
          const other = harness === "claude" ? "codex" : "claude";
          r.launch.value = {
            harness: other,
            version: "9.9.9",
            model: "m",
            effort: "xhigh",
          };
          r.episode = `${other}-relabelled`;
        },
      ],
      ["episodes removed", (r) => (r.episodes.value = [])],
      [
        "finding names the other clause",
        (r) => (r.finding.value.finding.criterionId = "AC-positive"),
      ],
      [
        "finding cites a foreign witness",
        (r) => (r.finding.value.finding.evidenceRefs = ["foreign:host-test:9"]),
      ],
      [
        "finding is not blocking",
        (r) => (r.finding.value.finding.severity = "minor"),
      ],
      [
        "finding blames a test file",
        (r) => (r.finding.value.finding.likelySurface = ["contract-test.mjs"]),
      ],
      [
        "superficial witness failed",
        (r) => (r.finding.value.witnesses[0].exitCode = 1),
      ],
      [
        "witness outcome contradicts its exit",
        (r) => (r.finding.value.witnesses[1].outcome = "pass"),
      ],
      [
        "witness of another commit",
        (r) =>
          (r.finding.value.witnesses[1].evidenceId = `${"0".repeat(40)}:host-test:1`),
      ],
      [
        "planted test never passed",
        (r) => (r.planted.value.superficialTest.afterExitCode = 1),
      ],
      ["planted commit missing", (r) => delete r.planted.value.commit],
      [
        "surfaces widened to admit a test edit",
        (r) => {
          for (const list of [
            r.fixture.value.surfaces,
            r.repair.value.surfaces,
          ])
            list.push("contract-test.mjs");
          r.fixture.value.criteria[1].codeSurfaces.push("contract-test.mjs");
          r.repair.value.diffPaths = ["contract-test.mjs"];
        },
      ],
      [
        "repair touched a test",
        (r) => (r.repair.value.diffPaths = ["sum.mjs", "contract-test.mjs"]),
      ],
      [
        "contract hash replaced",
        (r) => (r.repair.value.contractHash = "fnv1a64:0000000000000000"),
      ],
      [
        "reproduction failed",
        (r) => (r.repair.value.hostReproductions[0].exitCode = 1),
      ],
      ["no reproduction ran", (r) => (r.repair.value.hostReproductions = [])],
      [
        "repair needed a second attempt",
        (r) => (r.repair.value.workerAttempts = 2),
      ],
      ["later-round repair", (r) => (r.repair.value.round = 2)],
      [
        "contract changed before re-verification",
        (r) => (r.reverification.value.contractUnchanged = false),
      ],
      [
        "criterion still failed",
        (r) => (r.reverification.value.rows[1].status = "failed"),
      ],
      [
        "re-verification without witnesses",
        (r) => (r.reverification.value.witnesses = []),
      ],
      [
        "re-verification judged another commit",
        (r) => (r.reverification.value.subjectRevision = "0".repeat(40)),
      ],
      [
        "same verifier episode",
        (r) =>
          (r.reverification.value.verifierEpisodeId =
            r.finding.value.verifierEpisodeId),
      ],
      ["loop exhausted", (r) => (r.loop.value.status = "exhausted")],
      ["host failed", (r) => (r.host.value.exitCode = 1)],
      [
        "failure recorded beside a pass",
        (r) => (r.failure.value = { code: "host-error", detail: null }),
      ],
    ];
    for (const [label, change] of claims)
      refuses(name, mutate(receipt, change), label);
    // An absolute test command is published redacted, so only a bare contract
    // can be rehashed and caught when rewritten.
    if (receipt.fixture.value.commandStyle === "bare")
      refuses(
        name,
        mutate(
          receipt,
          (r) => (r.fixture.value.contract.objective = "Anything"),
        ),
        "contract rewritten under its hash",
      );
    // Only a published log can contradict a restated fact. A receipt that
    // withheld its log (an absolute test command) has nothing to compare with,
    // which is why it cannot carry the fold pass.
    if (receipt.eventLog.epistemic !== "observed") {
      assert.equal(receipt.result.value.foldPass, false, name);
      continue;
    }
    const logBound: [string, (r: Receipt) => void][] = [
      [
        "summary differs from the log",
        (r) => (r.finding.value.summary = "Everything passed"),
      ],
      [
        "replay control not live",
        (r) => (r.foldReplay.value.control.erasureHonoredFromVerifier = false),
      ],
      [
        "forgery changed the matrix",
        (r) =>
          (r.foldReplay.value.pendingInjections[0].matrixUnchanged = false),
      ],
      [
        "log version restated",
        (r) => (r.eventLog.value.compilerPackageVersion = "9.9.9"),
      ],
    ];
    for (const [label, change] of logBound)
      refuses(name, mutate(receipt, change), label);
  }
});

test("WO-056 AC3 a recorded verification log replays negative against injected implementer events", () => {
  const replayable = receipts.filter(
    ({ receipt }) => receipt.eventLog.epistemic === "observed",
  );
  assert.ok(replayable.length >= 1);
  for (const { name, receipt } of replayable) {
    // The child pins the receipt's recorded compiler identity, so a later
    // compiler version cannot turn this into persisted-compilation drift.
    const { replay, view } = replayRecorded(receipt.eventLog.value.lines);
    // What the receipt states about the verification is what the fold projects
    // from the published bytes, whether or not the run passed.
    const stated = receipt.finding.value;
    assert.equal(view.verifierEpisodeId, stated.verifierEpisodeId, name);
    assert.equal(view.summary, stated.summary, name);
    assert.deepEqual(view.witnesses, stated.witnesses, name);
    assert.deepEqual(view.rows, stated.rows, name);
    assert.deepEqual(view.contract, receipt.fixture.value.contract, name);
    assert.equal(view.subjectRevision, receipt.planted.value.commit, name);
    const open = view.findings.filter(
      (item: { status: string }) => item.status === "open",
    );
    assert.deepEqual(
      open.map((item: Receipt) => item.finding.findingId),
      stated.openFindings,
      name,
    );
    if (stated.finding)
      assert.ok(
        open.some(
          (item: Receipt) =>
            JSON.stringify(item.finding) === JSON.stringify(stated.finding),
        ),
        name,
      );
    assert.ok(replay.negativeRetained || !receipt.result.value.foldPass, name);
    if (receipt.foldReplay.epistemic === "observed")
      assert.deepEqual(replay, receipt.foldReplay.value, name);
    if (!receipt.result.value.foldPass) continue;

    assert.deepEqual(replay.control, {
      genuineResultAdmitted: true,
      erasureHonoredFromVerifier: true,
    });
    const failed = stated.finding.criterionId;
    const negative = (rows: Receipt[], openFindings: string[]) => {
      assert.equal(
        rows.find((row) => row.criterionId === failed).status,
        "failed",
        name,
      );
      assert.ok(openFindings.includes(stated.finding.findingId), name);
    };
    negative(replay.before.rows, replay.before.openFindings);
    for (const injection of replay.injections) {
      assert.equal(injection.unchanged, true, injection.name);
      negative(injection.rows, injection.openFindings);
    }
    for (const injection of replay.pendingInjections) {
      assert.equal(injection.matrixUnchanged, true, injection.name);
      assert.equal(injection.tailEqualsRecorded, true, injection.name);
      negative(
        injection.afterRecordedTail.rows,
        injection.afterRecordedTail.openFindings,
      );
    }
    const tampered = [...receipt.eventLog.value.lines];
    tampered[0] = tampered[0].replace("left + Math.abs(right)", "left + right");
    assert.notEqual(tampered[0], receipt.eventLog.value.lines[0]);
    assert.throws(() => replayRecorded(tampered), name);
  }
});

test("WO-056 AC1-AC3 one live harness caught, repaired and re-verified the planted defect", () => {
  const complete = receipts.filter(
    ({ receipt }) =>
      receipt.launch.value.harness !== "double" &&
      [...flags, "containmentPass"].every((flag) => receipt.result.value[flag]),
  );
  assert.ok(
    complete.length >= 1,
    "one live receipt must carry the finding, repair, re-verification, fold and containment passes together; process doubles do not count",
  );
});
