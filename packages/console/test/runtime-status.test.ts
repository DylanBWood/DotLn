import test from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { EventEmitter } from "node:events";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
import {
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  decodeRuntimeStatus,
  type RuntimeStatusV1,
} from "@dotln/skeleton/dist/src/runtime-status-contract.js";
import {
  readRuntimeStatus,
  renderRuntimeStatus,
  watchRuntimeStatus,
} from "../src/runtime-status.js";

const view: RuntimeStatusV1 = {
  viewModelVersion: "runtime-status-v1",
  observedAt: 40,
  actors: [
    {
      phase: "probe",
      kind: "cli-worker",
      availability: "available",
      lastEpisode: "script_1",
    },
  ],
  liveEpisodes: [
    {
      episodeId: "script_1",
      order: "WO-114",
      actor: "cli-worker",
      transport: "codex-cli-exec",
      phase: "probe",
      startedAt: 10,
      elapsedMs: 30,
      launchClaims: {
        source: "request",
        model: "fixture-model",
        effort: "xhigh",
      },
    },
  ],
  presence: {
    signal: "away",
    present: false,
    phase: "probe",
    cadences: [{ phase: "probe", nextFireAt: 50 }],
  },
  holds: [
    { kind: "handoff", reason: "awaiting-human-answer", order: "WO-158" },
  ],
  budget: {
    status: "configured",
    episodes: { consumed: 1, remaining: 2 },
    wallMs: { consumed: 30, remaining: 70 },
    tokens: { consumed: 10, remaining: 90 },
  },
  workOrders: {
    status: "available",
    items: [
      { order: "WO-114", phase: "active", dependency: "ready", verdict: null },
      {
        order: "WO-158",
        phase: "queued",
        dependency: "blocked",
        verdict: "fail",
      },
    ],
  },
};

async function observeWithin<T>(
  result: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      result,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("status watch timed out")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

function schemaMatches(
  value: unknown,
  raw: unknown,
  root: Record<string, unknown>,
): boolean {
  const schema = raw as Record<string, unknown>;
  if (typeof schema["$ref"] === "string") {
    const name = schema["$ref"].split("/").at(-1)!;
    return schemaMatches(
      value,
      (root["$defs"] as Record<string, unknown>)[name],
      root,
    );
  }
  if (Array.isArray(schema["anyOf"]))
    return schema["anyOf"].some((item) => schemaMatches(value, item, root));
  if (Object.hasOwn(schema, "const") && value !== schema["const"]) return false;
  if (Array.isArray(schema["enum"]) && !schema["enum"].includes(value))
    return false;
  const kind =
    value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  if (
    schema["type"] &&
    !(
      Array.isArray(schema["type"]) ? schema["type"] : [schema["type"]]
    ).includes(kind)
  )
    return false;
  if (
    typeof value === "number" &&
    typeof schema["minimum"] === "number" &&
    value < schema["minimum"]
  )
    return false;
  if (
    typeof value === "string" &&
    typeof schema["pattern"] === "string" &&
    !new RegExp(schema["pattern"], "u").test(value)
  )
    return false;
  if (Array.isArray(value) && schema["items"])
    return value.every((item) => schemaMatches(item, schema["items"], root));
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const properties = (schema["properties"] ?? {}) as Record<string, unknown>;
    if (
      Array.isArray(schema["required"]) &&
      !schema["required"].every((key) => Object.hasOwn(record, key))
    )
      return false;
    for (const [key, item] of Object.entries(record)) {
      if (Object.hasOwn(properties, key)) {
        if (!schemaMatches(item, properties[key], root)) return false;
      } else if (schema["additionalProperties"] === false) return false;
    }
  }
  return true;
}

test("WO-114 shared schema and decoder admit the fixture and reject foreign fields", () => {
  const schema = JSON.parse(
    readFileSync(
      new URL("../../runtime-status-v1.schema.json", import.meta.url),
      "utf8",
    ),
  ) as Record<string, unknown>;
  assert.ok(schemaMatches(view, schema, schema));
  assert.deepEqual(decodeRuntimeStatus(JSON.parse(JSON.stringify(view))), view);
  const malformed = { ...view, hostName: "private-host" };
  assert.equal(schemaMatches(malformed, schema, schema), false);
  assert.throws(
    () => decodeRuntimeStatus(malformed),
    /invalid runtime-status-v1 fields/u,
  );
});

test("WO-114 text host renders every status section and CLI reads the file", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-console-status-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  writeFileSync(
    join(directory, "runtime-status-v1.json"),
    JSON.stringify(view),
  );
  const projected = readRuntimeStatus(directory);
  assert.deepEqual(projected, view);
  const text = renderRuntimeStatus(projected);
  for (const heading of [
    "Actors",
    "Live episodes",
    "Presence",
    "Holds",
    "Budget",
    "Open work orders",
  ])
    assert.ok(text.includes(heading));
  assert.ok(
    text.includes("WO-158: queued · dependencies blocked · verdict fail"),
  );
  assert.ok(text.includes("script_1: WO-114 · cli-worker via codex-cli-exec"));
  const cli = spawnSync(
    process.execPath,
    [
      new URL("../src/cli.js", import.meta.url).pathname,
      "status",
      "--store",
      directory,
    ],
    { encoding: "utf8" },
  );
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(cli.stdout, text);
});

test("WO-114 text host refreshes after atomic replacement", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-console-watch-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const target = join(directory, "runtime-status-v1.json");
  writeFileSync(target, JSON.stringify(view));
  let resolve!: (value: RuntimeStatusV1) => void;
  const changed = new Promise<RuntimeStatusV1>((done) => {
    resolve = done;
  });
  const watcher = watchRuntimeStatus(directory, (next) => {
    if (next.observedAt === 50) resolve(next);
  });
  t.after(() => watcher.close());
  const update = { ...view, observedAt: 50, liveEpisodes: [] };
  const temporary = join(directory, "new.tmp");
  writeFileSync(temporary, JSON.stringify(update));
  renameSync(temporary, target);
  const observed = await observeWithin(changed, 2000);
  assert.equal(observed.observedAt, 50);
  assert.deepEqual(observed.liveEpisodes, []);
});

test("WO-114 status watch recovers when notifications are absent", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-console-watch-poll-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const target = join(directory, "runtime-status-v1.json");
  writeFileSync(target, JSON.stringify(view));
  const silent = new EventEmitter() as EventEmitter & { close: () => void };
  silent.close = () => silent.emit("close");
  const originalWatch = fs.watch;
  fs.watch = (() => silent) as unknown as typeof fs.watch;
  syncBuiltinESMExports();
  let resolve!: (value: RuntimeStatusV1) => void;
  const changed = new Promise<RuntimeStatusV1>((done) => {
    resolve = done;
  });
  let watcher: ReturnType<typeof watchRuntimeStatus>;
  try {
    watcher = watchRuntimeStatus(directory, (next) => {
      if (next.observedAt === 50) resolve(next);
    });
  } finally {
    fs.watch = originalWatch;
    syncBuiltinESMExports();
  }
  t.after(() => watcher.close());
  const update = { ...view, observedAt: 50, liveEpisodes: [] };
  const temporary = join(directory, "new.tmp");
  writeFileSync(temporary, JSON.stringify(update));
  renameSync(temporary, target);
  const observed = await observeWithin(changed, 2000);
  assert.equal(observed.observedAt, 50);
  assert.deepEqual(observed.liveEpisodes, []);
});

test("WO-114 status poll stops when a watcher error closes without a close event", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-console-watch-error-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const target = join(directory, "runtime-status-v1.json");
  writeFileSync(target, JSON.stringify(view));
  const failed = new EventEmitter() as EventEmitter & { close: () => void };
  // FSWatcher errors end observation without promising a close event. Once
  // its handle is gone, a subsequent close() can be a no-op.
  failed.close = () => {};
  const originalWatch = fs.watch;
  fs.watch = (() => failed) as unknown as typeof fs.watch;
  syncBuiltinESMExports();
  const changed: number[] = [];
  let unavailable = 0;
  let watcher: ReturnType<typeof watchRuntimeStatus>;
  try {
    watcher = watchRuntimeStatus(
      directory,
      (next) => changed.push(next.observedAt),
      () => unavailable++,
    );
  } finally {
    fs.watch = originalWatch;
    syncBuiltinESMExports();
  }
  // Always stop the test interval, including on the pre-repair implementation.
  t.after(() => failed.emit("close"));
  failed.emit("error", new Error("watch failed"));
  assert.deepEqual(changed, [40]);
  assert.equal(unavailable, 1);
  watcher.close();
  writeFileSync(
    join(directory, "new.tmp"),
    JSON.stringify({ ...view, observedAt: 50 }),
  );
  renameSync(join(directory, "new.tmp"), target);
  await delay(300);
  assert.deepEqual(
    changed,
    [40],
    "no changed callback after the watcher fails and closes",
  );
  unlinkSync(target);
  await delay(300);
  assert.equal(unavailable, 1, "no unavailable callback after close");
});

test("WO-114 schema and decoder agree on all order fields", () => {
  const schema = JSON.parse(
    readFileSync(
      new URL("../../runtime-status-v1.schema.json", import.meta.url),
      "utf8",
    ),
  );
  for (const section of ["liveEpisodes", "holds", "workOrders"] as const) {
    for (const order of [
      null,
      "WO-000",
      "WO-999",
      "WO-1",
      "WO-1000",
      "anything",
      "WO-114\n",
      114,
    ]) {
      const candidate = structuredClone(view);
      const row =
        section === "workOrders"
          ? candidate.workOrders.items[0]!
          : candidate[section][0]!;
      Object.assign(row, { order });
      const expected =
        (typeof order === "string" && /^WO-\d{3}$/u.test(order)) ||
        (order === null && section !== "workOrders");
      assert.equal(
        schemaMatches(candidate, schema, schema),
        expected,
        `${section}: ${order}`,
      );
      if (expected) assert.deepEqual(decodeRuntimeStatus(candidate), candidate);
      else
        assert.throws(
          () => decodeRuntimeStatus(candidate),
          /runtime-status-v1/,
        );
    }
  }
});

test("WO-114 status text neutralizes terminal, bidi and line controls", () => {
  const candidate = structuredClone(view);
  const unsafe = "phase\u001b\u0085\u2028\u2029\u202a\u202e\u2066\u2069";
  candidate.actors[0]!.phase = unsafe;
  candidate.liveEpisodes[0]!.launchClaims.model = unsafe;
  candidate.holds[0]!.reason = unsafe;
  const text = renderRuntimeStatus(decodeRuntimeStatus(candidate));
  assert.ok(text.includes("phase????????"));
  assert.ok(!/[\u001b\u0085\u2028-\u202e\u2066-\u2069]/u.test(text));
});

test(
  "WO-114 watch CLI survives missing, malformed and foreign files and deduplicates replacements",
  { timeout: 10000 },
  async (t) => {
    const directory = mkdtempSync(
      join(tmpdir(), "dotln-console-watch-recovery-"),
    );
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    const target = join(directory, "runtime-status-v1.json");
    const cli = spawn(
      process.execPath,
      [
        new URL("../src/cli.js", import.meta.url).pathname,
        "status",
        "--store",
        directory,
        "--watch",
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    t.after(() => cli.kill());
    let stdout = "";
    let stderr = "";
    cli.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    cli.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    const waitFor = async (check: () => boolean) => {
      for (let attempt = 0; attempt < 200; attempt++) {
        assert.equal(cli.exitCode, null, stderr);
        if (check()) return;
        await delay(10);
      }
      assert.fail(`watch output timed out: ${stdout} ${stderr}`);
    };
    const replace = (value: unknown) => {
      writeFileSync(
        join(directory, "new.tmp"),
        typeof value === "string" ? value : JSON.stringify(value),
      );
      renameSync(join(directory, "new.tmp"), target);
    };
    await waitFor(() => stdout.includes("unavailable"));
    for (const [i, invalid] of [
      null,
      "{",
      { ...view, viewModelVersion: "runtime-status-v2" },
    ].entries()) {
      replace({ ...view, observedAt: 100 + i });
      await waitFor(() => stdout.includes(`observed ${100 + i}`));
      if (invalid === null) unlinkSync(target);
      else replace(invalid);
      await waitFor(
        () => stdout.split("Runtime status unavailable").length === i + 3,
      );
    }
    replace({ ...view, observedAt: 777 });
    await waitFor(() => stdout.includes("observed 777"));
    await delay(100);
    replace({ ...view, observedAt: 777 });
    await delay(100);
    for (const at of [100, 101, 102, 777])
      assert.equal(stdout.split(`observed ${at}`).length, 2);
    assert.equal(stderr, "");
    assert.ok(!stdout.includes(directory));
    assert.equal(cli.exitCode, null);
  },
);
