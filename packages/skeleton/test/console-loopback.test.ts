import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "../src/temporary-roots.js";
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ResidentBoardSnapshot,
  BOARD_FRESHNESS_MS,
  BOARD_TIMEOUT_MS,
} from "../src/resident-host.js";

test("WO-225 resident board refresh shares one child, preserves fresh bytes, and atomically replaces stale bytes", async () => {
  const root = createFixtureRoot(join(tmpdir(), "dotln-board-snapshot-"));
  const store = join(root, "store");
  mkdirSync(join(store, "console"), { recursive: true, mode: 0o700 });
  mkdirSync(join(root, "packages/console/dist/src"), { recursive: true });
  const cli = join(root, "packages/console/dist/src/cli.js");
  const calls = join(root, "calls");
  let now = Date.now();
  const snapshot = new ResidentBoardSnapshot(root, store, () => now);
  const emit = (revision: number) =>
    writeFileSync(
      cli,
      `const fs = require('node:fs'); fs.appendFileSync(${JSON.stringify(calls)}, 'call\\n'); setTimeout(() => console.log(JSON.stringify({viewModelVersion:'uifa-board-v1',fidelity:'lossy-read-only',panels:[],revision:${revision}})), 40);`,
    );
  try {
    assert.equal(BOARD_TIMEOUT_MS, 60_000);
    emit(1);
    const first = await Promise.all([
      snapshot.read(),
      snapshot.read(),
      snapshot.read(),
    ]);
    assert.ok(first.every((bytes) => bytes.equals(first[0]!)));
    assert.equal(readFileSync(calls, "utf8"), "call\n");
    assert.equal(statSync(snapshot.file).mode & 0o777, 0o600);
    emit(2);
    now = statSync(snapshot.file).mtimeMs + BOARD_FRESHNESS_MS - 1;
    assert.deepEqual(await snapshot.read(), first[0]);
    assert.equal(readFileSync(calls, "utf8"), "call\n");
    now += 2;
    const second = await Promise.all([snapshot.read(), snapshot.read()]);
    assert.equal(JSON.parse(second[0]!.toString()).revision, 2);
    assert.deepEqual(second[0], second[1]);
    assert.equal(readFileSync(calls, "utf8"), "call\ncall\n");
    assert.deepEqual(readFileSync(snapshot.file), second[0]);
    assert.deepEqual(readdirSync(join(store, "console")), [
      "uifa-board-v1.json",
    ]);
    now = statSync(snapshot.file).mtimeMs + BOARD_FRESHNESS_MS + 1;
    for (const script of [
      "console.log('not json')",
      "console.log('{}')",
      "process.exit(7)",
    ]) {
      writeFileSync(cli, script);
      await assert.rejects(snapshot.read(), /board snapshot unavailable/u);
      assert.deepEqual(
        readFileSync(snapshot.file),
        second[0],
        "failed refresh preserves the last complete projection",
      );
    }
    emit(3);
    assert.equal(
      JSON.parse((await snapshot.read()).toString()).revision,
      3,
      "a failed refresh can recover",
    );
  } finally {
    await snapshot.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test("WO-225 board collection timeout and shutdown terminate the child without publishing", async () => {
  const root = createFixtureRoot(join(tmpdir(), "dotln-board-timeout-"));
  const store = join(root, "store");
  mkdirSync(join(store, "console"), { recursive: true, mode: 0o700 });
  mkdirSync(join(root, "packages/console/dist/src"), { recursive: true });
  writeFileSync(
    join(root, "packages/console/dist/src/cli.js"),
    "setInterval(() => {}, 1000);",
  );
  const bounded = new ResidentBoardSnapshot(root, store, Date.now, 50);
  const stopped = new ResidentBoardSnapshot(root, store);
  try {
    await assert.rejects(bounded.read(), /board snapshot unavailable/u);
    const pending = stopped.read();
    const rejected = assert.rejects(pending, /board snapshot unavailable/u);
    await stopped.close();
    await rejected;
    await assert.rejects(stopped.read(), /board snapshot unavailable/u);
    assert.deepEqual(readdirSync(join(store, "console")), []);
  } finally {
    await bounded.close();
    await stopped.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test("WO-225 every projection and command route refuses a non-loopback socket before reading", async () => {
  const { ConsoleLoopback } = await import("../src/console-loopback.js");
  const { ResidentStore } = await import("../src/resident-store.js");
  const directory = createFixtureRoot(
    join(tmpdir(), "dotln-nonlocal-console-"),
  );
  let reads = 0;
  const loopback = new ConsoleLoopback(
    new ResidentStore(directory),
    directory,
    Date.now,
    async () => {
      reads++;
      return Buffer.from("{}");
    },
  );
  // Inject the socket fact directly: the real listener binds only 127.0.0.1,
  // so an external interface cannot reach this branch in an integration test.
  const decode = Reflect.get(loopback, "decode") as (
    request: unknown,
    response: unknown,
  ) => Promise<unknown>;
  try {
    for (const url of [
      "/runtime-status-v1",
      "/uifa-board-v1",
      "/console-commands-v1/invoke",
    ]) {
      let code = 0,
        body = "";
      const result = await decode.call(
        loopback,
        {
          method: "GET",
          url,
          headers: { host: "127.0.0.1:1234" },
          socket: { remoteAddress: "192.0.2.1" },
        },
        {
          destroyed: false,
          headersSent: false,
          writeHead: (value: number) => {
            code = value;
          },
          end: (value: string) => {
            body = value;
          },
        },
      );
      assert.equal(result, null);
      assert.equal(code, 403);
      assert.equal(
        Buffer.from(JSON.parse(body).stderrBase64, "base64").toString(),
        "error: console caller refused\n",
      );
    }
    assert.equal(reads, 0);
    assert.deepEqual(
      readdirSync(directory).filter((name) => name !== ".dotln-owner.json"),
      [],
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
