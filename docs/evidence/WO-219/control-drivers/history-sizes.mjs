import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repository = resolve(process.argv[2]);
const { readCloseHistory } = await import(
  pathToFileURL(join(repository, "scripts/release.mjs"))
);
test("six missing-archive retries have bounded retained bytes and no readable-record reserialization", (t) => {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-wo219-history-size-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const order = "WO-999",
    directory = join(root, "docs/control/local/retained", order);
  const file = join(directory, "release-close.json");
  mkdirSync(directory, { recursive: true });
  const prior = {
    schemaVersion: 1,
    workOrderId: order,
    previousAttempts: [],
    publication: {
      target: { policy: "declared", tag: "v1.0.0", tagOutcome: "published" },
    },
  };
  writeFileSync(file, JSON.stringify(prior));
  const { recoveryAttempts: _firstRecovery, ...first } = readCloseHistory(
    root,
    order,
  );
  const absent = first.archivedAttempts[0];
  rmSync(join(root, absent));
  writeFileSync(file, JSON.stringify({ ...prior, ...first }));
  const sizes = [];
  for (let retry = 0; retry < 6; retry++) {
    const { recoveryAttempts: _recovery, ...history } = readCloseHistory(
      root,
      order,
    );
    assert.equal(typeof history.historyFailure, "string");
    assert.ok(history.historyFailure.includes(absent));
    writeFileSync(file, JSON.stringify({ ...prior, ...history }));
    sizes.push(readFileSync(file).length);
  }
  t.diagnostic(`retained byte sizes: ${sizes.join(",")}`);
  assert.equal(
    new Set(sizes.slice(1)).size,
    1,
    "refused retries stop growing after the first failure record",
  );
  assert.ok(
    !JSON.stringify(JSON.parse(readFileSync(file)).previousAttempts).includes(
      "unreadableRecord",
    ),
    "a parsed record is not reserialized as unreadable bytes",
  );
});
