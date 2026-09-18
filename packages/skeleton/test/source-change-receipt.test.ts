import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const directory = fileURLToPath(
  new URL("../../../../docs/evidence/WO-053/", import.meta.url),
);
const { validateReceipt } = await import(
  new URL("../../../../docs/evidence/WO-053/receipt.mjs", import.meta.url).href
);

test("WO-053 versioned live receipts preserve failures, labels and private-output boundary", () => {
  const names = readdirSync(directory).filter((name) =>
    /^(claude|codex)-.*\.json$/u.test(name),
  );
  assert.ok(names.length >= 2);
  const receipts = names.map((name) =>
    JSON.parse(readFileSync(join(directory, name), "utf8")),
  );
  for (const harness of ["claude", "codex"]) {
    assert.ok(
      receipts.some(
        (receipt) =>
          receipt.launch.value.harness === harness &&
          receipt.result.value.functionalPass &&
          !receipt.recovery.value.requested,
      ),
      `${harness} needs a successful clean writer receipt`,
    );
  }
  assert.ok(
    receipts.some(
      (receipt) =>
        receipt.recovery.value.requested &&
        receipt.result.value.functionalPass &&
        receipt.result.value.recoveryPass,
    ),
    "A successful killed-host recovery receipt is required",
  );
  for (const name of names) {
    const receipt = JSON.parse(readFileSync(join(directory, name), "utf8"));
    assert.doesNotThrow(() => validateReceipt(receipt), name);
    assert.throws(() =>
      validateReceipt({ ...receipt, unexpected: "raw transcript" }),
    );
    const unlabelled = structuredClone(receipt);
    delete unlabelled.boundary.epistemic;
    assert.throws(() => validateReceipt(unlabelled));
    const leak = structuredClone(receipt);
    leak.failure.value = {
      code: "synthetic",
      detail: "/Users/synthetic/private-file",
    };
    assert.throws(() => validateReceipt(leak), /privacy screen/);
    if (!receipt.result.value.functionalPass) {
      const forged = structuredClone(receipt);
      forged.result.value.functionalPass = true;
      assert.throws(() => validateReceipt(forged));
    } else {
      for (const mutation of [
        (r: typeof receipt) => {
          r.host.value.commitCount = 2;
        },
        (r: typeof receipt) => {
          r.host.value.outcome.observation.testBefore.exitCode = null;
        },
        (r: typeof receipt) => {
          r.host.value.outcome.observation.testAfter.exitCode = 1;
        },
        (r: typeof receipt) => {
          r.envelope.value.observedCommit.sha = "0".repeat(40);
        },
        (r: typeof receipt) => {
          r.gitEffect.value.commit = "0".repeat(40);
        },
        (r: typeof receipt) => {
          r.envelope.value.observedCommit.branch = "other-branch";
        },
      ]) {
        const forged = structuredClone(receipt);
        mutation(forged);
        assert.throws(() => validateReceipt(forged));
      }
    }
  }
});
