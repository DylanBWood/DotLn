import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  request,
  runSmoke,
  assess,
  validStructured,
  loopbackBase,
} from "./local-runner-smoke.mjs";

async function endpoint(t, handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
}
const completion = (output, toolCalls = []) => ({
  choices: [
    {
      message: { role: "assistant", content: output, tool_calls: toolCalls },
      finish_reason: toolCalls.length ? "tool_calls" : "stop",
    },
  ],
  usage: { completion_tokens: 2 },
  stats: { tokens_per_second: 10 },
  runtime: { version: "fixture" },
});

test("two independent loopback doubles isolate complete, HTTP error, timeout and abort behavior", async (t) => {
  let aborted = false;
  const first = await endpoint(t, async (req, res) => {
    let raw = "";
    for await (const part of req) raw += part;
    const body = JSON.parse(raw);
    if (body.stream) {
      res.writeHead(200, { "content-type": "text/event-stream" });
      const event = 'data: {"choices":[{"delta":{"content":"one"}}]}\n\n';
      // Exercise split SSE frames rather than a convenient one-chunk response.
      res.write(event.slice(0, 18));
      setImmediate(() => res.write(event.slice(18)));
      res.on("close", () => {
        aborted = true;
      });
    } else {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(completion("READY")));
    }
  });
  const second = await endpoint(t, async (req, res) => {
    let raw = "";
    for await (const part of req) raw += part;
    if (JSON.parse(raw).stream) return;
    res.writeHead(400);
    res.end('{"error":"No models loaded"}');
  });
  assert.notEqual(first, second);
  const ok = await request(first, { stream: false });
  assert.equal(ok.output, "READY");
  assert.equal(ok.stats.tokens_per_second, 10);
  const bad = await request(second, { stream: false });
  assert.equal(bad.status, "http-error");
  assert.match(bad.errorBody, /No models loaded/);
  const timed = await request(second, { stream: true }, { timeoutMs: 50 });
  assert.equal(timed.status, "timeout");
  const cancel = await request(
    first,
    { stream: true },
    {
      cancelAfterDelta: true,
      observeState: async () => ({ status: "generating", queued: 0 }),
    },
  );
  assert.equal(cancel.status, "cancelled");
  assert.equal(cancel.output, "one");
  assert.equal(cancel.stateBeforeAbort.status, "generating");
  for (let i = 0; i < 20 && !aborted; i++)
    await new Promise((done) => setTimeout(done, 10));
  assert.equal(aborted, true);
});

test("fixed suite validates schema, actual tool round trip, repeats, cancellation, timeout and recovery", async (t) => {
  let status = "idle",
    count = 0;
  const seen = [];
  const base = await endpoint(t, async (req, res) => {
    let raw = "";
    for await (const part of req) raw += part;
    const body = JSON.parse(raw);
    seen.push({ path: req.url, body });
    count++;
    if (body.stream) {
      status = "generating";
      res.on("close", () => {
        status = "idle";
      });
      if (count === 8) return; // timeout: deliberately no headers
      res.writeHead(200, { "content-type": "text/event-stream" });
      res.write('data: {"choices":[{"delta":{"content":"1"}}]}\n\n');
      return;
    }
    let output = "A keeper found a key. Dawn lit the lighthouse.",
      calls = [];
    if (body.response_format) output = '{"ok":true,"count":3}';
    if (body.tool_choice === "required") {
      output = "";
      calls = [
        {
          id: "fixture-call",
          type: "function",
          function: { name: "add", arguments: '{"a":2,"b":3}' },
        },
      ];
    }
    if (body.tool_choice === "none") {
      const answer = body.messages.at(-1);
      assert.equal(answer.role, "tool");
      assert.equal(answer.tool_call_id, "fixture-call");
      assert.equal(answer.content, "5");
      output = "5";
    }
    if (count === 9) output = "READY";
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(completion(output, calls)));
  });
  const rows = await runSmoke({
    base,
    observeState: async () => ({ status, queued: 0 }),
    cooldownMs: 0,
  });
  assert.deepEqual(assess(rows), {
    smokeCompleted: true,
    byteIdentical: true,
    schemaValid: true,
    toolRoundTrip: true,
    cancellationObserved: true,
    timeoutObserved: true,
    recoveryCompleted: true,
  });
  assert.equal(rows.length, 9);
  assert.ok(
    seen.every((x) => x.body.seed === 424242 && x.body.temperature === 0),
  );
  assert.equal(seen[0].path, "/api/v0/chat/completions");
  assert.equal(seen[6].path, "/v1/chat/completions");
});

test("missing or deceptive evidence never qualifies and exact schema rejects extra fields", () => {
  assert.equal(validStructured({ ok: true, count: 3 }), true);
  for (const value of [
    null,
    [],
    {},
    { ok: "true", count: 3 },
    { ok: true, count: 3, extra: 1 },
    { ok: true, count: 4 },
  ])
    assert.equal(validStructured(value), false);
  const result = assess([
    {
      name: "cancellation",
      status: "cancelled",
      stateBeforeAbort: { status: "idle" },
      idleAfter: { idle: true, elapsedMs: 1 },
    },
  ]);
  assert.equal(result.cancellationObserved, false);
  assert.equal(result.smokeCompleted, false);
  assert.equal(result.schemaValid, false);
  assert.equal(result.toolRoundTrip, false);
});

test("malformed, truncated and redirect responses retain failure instead of manufacturing completion", async (t) => {
  const base = await endpoint(t, async (req, res) => {
    let raw = "";
    for await (const part of req) raw += part;
    const { mode } = JSON.parse(raw);
    if (mode === "redirect") {
      res.writeHead(302, { location: "http://192.0.2.1" });
      res.end();
    } else if (mode === "stream") {
      res.writeHead(200, { "content-type": "text/event-stream" });
      res.end('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n');
    } else {
      res.setHeader("content-type", "application/json");
      res.end('{"choices":[]}');
    }
  });
  for (const mode of ["redirect", "stream", "malformed"]) {
    const row = await request(base, { mode, stream: mode === "stream" });
    assert.equal(row.status, "client-error");
  }
  for (const url of [
    "https://127.0.0.1",
    "http://localhost",
    "http://192.0.2.1",
    "http://a:b@127.0.0.1",
    "http://127.0.0.1/path",
  ])
    assert.throws(() => loopbackBase(url));
});

test("preflight refusal sends no request", async () => {
  await assert.rejects(
    runSmoke({
      base: "http://127.0.0.1:1",
      cooldownMs: 0,
      beforeRequest: async () => {
        throw new Error("Product gate process observed");
      },
    }),
    /Product gate/,
  );
});

test("observer failure preserves the already executed request and stops further work", async (t) => {
  let count = 0,
    saved = [];
  const base = await endpoint(t, async (req, res) => {
    for await (const part of req) {
      void part;
    }
    count++;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(completion("READY")));
  });
  await assert.rejects(
    runSmoke({
      base,
      cooldownMs: 0,
      record: (rows) => {
        saved = structuredClone(rows);
      },
      observeState: async () => {
        throw new Error("observer unavailable");
      },
    }),
    /Idle observation failed/,
  );
  assert.equal(count, 1);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].output, "READY");
  assert.equal(saved[0].idleAfter.idle, false);
});

test("deadline during cancellation observer retains timeout as the first cause", async (t) => {
  const base = await endpoint(t, async (req, res) => {
    for await (const part of req) {
      void part;
    }
    res.writeHead(200, { "content-type": "text/event-stream" });
    res.write('data: {"choices":[{"delta":{"content":"1"}}]}\n\n');
  });
  const row = await request(
    base,
    { stream: true },
    {
      timeoutMs: 40,
      cancelAfterDelta: true,
      observeState: async () => {
        await new Promise((done) => setTimeout(done, 100));
        return { status: "generating", queued: 0 };
      },
    },
  );
  assert.equal(row.status, "timeout");
  assert.equal(
    assess(
      [1, 2, 3].map((n) => ({
        name: `smoke-${n}`,
        status: "http-error",
        output: "",
      })),
    ).byteIdentical,
    false,
  );
});

test("three failed smoke attempts stop before schema and tool experiments", async (t) => {
  let count = 0,
    saved = [];
  const base = await endpoint(t, async (req, res) => {
    for await (const part of req) {
      void part;
    }
    count++;
    res.writeHead(503);
    res.end('{"error":"runner unavailable"}');
  });
  await assert.rejects(
    runSmoke({
      base,
      cooldownMs: 0,
      record: (rows) => {
        saved = structuredClone(rows);
      },
    }),
    /Three-request smoke/,
  );
  assert.equal(count, 3);
  assert.equal(saved.length, 3);
  assert.ok(saved.every((r) => r.status === "http-error"));
});
