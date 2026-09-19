import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { runLoad, healthStop } from "./local-runner-load.mjs";
const normal = { thermalState: 0, memoryPressure: 1, swapUsedMiB: 100 };
const preflight = () => ({ gateProcessCount: 0 });

test("resource thresholds reject fair, warning, missing data and incremental swap", () => {
  assert.equal(healthStop(normal, normal), null);
  assert.equal(
    healthStop({ ...normal, thermalState: 1 }, normal),
    "thermal-not-nominal",
  );
  assert.equal(
    healthStop({ ...normal, memoryPressure: 2 }, normal),
    "memory-pressure-not-normal",
  );
  assert.equal(
    healthStop({ ...normal, swapUsedMiB: 228 }, normal),
    "swap-growth-limit",
  );
  assert.equal(healthStop(null, normal), "monitor-unavailable");
});

test("bounded load advances after two requests, stays serial, records metrics and stops at count", async () => {
  let live = 0,
    maximum = 0;
  const packet = await runLoad({
    base: "http://127.0.0.1:1",
    baseline: normal,
    observeHealth: () => normal,
    preflight,
    maxRequests: 3,
    pauseMs: 0,
    durationMs: 1000,
    invoke: async (base, payload) => {
      maximum = Math.max(maximum, ++live);
      assert.equal(payload.max_tokens, 128);
      assert.equal(payload.reasoning_effort, "none");
      await new Promise((done) => setTimeout(done, 5));
      live--;
      return {
        status: "completed",
        stats: { tokens_per_second: 20 },
        latencyMs: 5,
      };
    },
  });
  assert.equal(maximum, 1);
  assert.equal(packet.rows.length, 3);
  assert.equal(packet.stageChecks[0].afterRequests, 2);
  assert.equal(packet.stopReason, "request-limit");
});

test("health monitor aborts an in-flight HTTP double and preserves its row", async (t) => {
  let observed = 0,
    started = false;
  const server = createServer(async (req, res) => {
    for await (const chunk of req) {
      void chunk;
    }
    started = true;
    res.writeHead(200, { "content-type": "application/json" });
    res.write('{"pending":');
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const packet = await runLoad({
    base: `http://127.0.0.1:${server.address().port}`,
    baseline: normal,
    observeHealth: () => {
      observed++;
      return started ? { ...normal, thermalState: 1 } : normal;
    },
    preflight,
    durationMs: 1000,
    pollMs: 10,
    pauseMs: 0,
  });
  assert.equal(packet.stopReason, "thermal-not-nominal");
  assert.equal(packet.rows.length, 1);
  assert.equal(packet.rows[0].status, "safety-stop");
  assert.ok(observed > 1);
});

test("unavailable monitoring or gate refuses all traffic; deadline stops further requests", async () => {
  let calls = 0;
  const common = {
    base: "http://127.0.0.1:1",
    baseline: normal,
    preflight,
    invoke: async () => {
      calls++;
      return { status: "completed" };
    },
  };
  const unavailable = await runLoad({
    ...common,
    observeHealth: () => {
      throw new Error("missing");
    },
  });
  assert.equal(unavailable.stopReason, "monitor-or-gate-refusal");
  assert.equal(calls, 0);
  const gate = await runLoad({
    ...common,
    observeHealth: () => normal,
    preflight: () => {
      throw new Error("gate");
    },
  });
  assert.equal(gate.rows.length, 0);
  const deadline = await runLoad({
    ...common,
    observeHealth: () => normal,
    durationMs: 40,
    pauseMs: 100,
  });
  assert.equal(deadline.stopReason, "duration-limit");
  assert.equal(deadline.rows.length, 1);
  assert.ok(deadline.elapsedMs < 200);
});

test("failed request and failed idle observer stop after retaining one row", async () => {
  for (const failingState of [false, true]) {
    const packet = await runLoad({
      base: "http://127.0.0.1:1",
      baseline: normal,
      preflight,
      observeHealth: () => normal,
      invoke: async () => ({
        status: failingState ? "completed" : "http-error",
      }),
      ...(failingState
        ? {
            observeState: async () => {
              throw new Error("missing");
            },
          }
        : {}),
    });
    assert.equal(packet.rows.length, 1);
    assert.equal(
      packet.stopReason,
      failingState ? "runner-not-idle" : "request-failure",
    );
  }
});

test("slow asynchronous observer cannot delay the traffic deadline", async () => {
  let observations = 0,
    abortedAt = null;
  const start = performance.now();
  const packet = await runLoad({
    base: "http://127.0.0.1:1",
    baseline: normal,
    preflight,
    durationMs: 50,
    pollMs: 10,
    pauseMs: 0,
    observeHealth: async () => {
      if (++observations > 1)
        await new Promise((done) => setTimeout(done, 150));
      return normal;
    },
    invoke: async (base, payload, { signal }) =>
      new Promise((done) => {
        signal.addEventListener(
          "abort",
          () => {
            abortedAt = performance.now() - start;
            done({ status: "safety-stop" });
          },
          { once: true },
        );
      }),
  });
  assert.equal(packet.stopReason, "duration-limit");
  assert.equal(packet.rows.length, 1);
  assert.ok(abortedAt < 125);
  assert.ok(packet.elapsedMs > abortedAt);
});
