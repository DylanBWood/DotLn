#!/usr/bin/env node
import { isMainModule } from "../lib/paths.mjs";
// Bounded research client. Live inference is explicit and never a test import effect.
import { execFileSync, execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { homedir } from "node:os";

import { performance } from "node:perf_hooks";

export const schema = {
  type: "object",
  properties: { ok: { type: "boolean" }, count: { type: "integer", const: 3 } },
  required: ["ok", "count"],
  additionalProperties: false,
};
// Deliberately validates this fixed schema, not an advertised general validator.
export function validStructured(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 2 &&
    typeof value.ok === "boolean" &&
    Number.isInteger(value.count) &&
    value.count === 3
  );
}
export function loopbackBase(value) {
  const url = new URL(value);
  if (
    url.protocol !== "http:" ||
    url.hostname !== "127.0.0.1" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error("Probe requires an explicit HTTP IPv4 loopback origin");
  return url.origin;
}
export const fixedMessages = [
  {
    role: "system",
    content: "Output only the requested story. Do not explain.",
  },
  {
    role: "user",
    content:
      "Write exactly two sentences, each no more than twelve words, about a lighthouse keeper finding a brass key at dawn.",
  },
];
export const settings = {
  temperature: 0,
  top_p: 1,
  seed: 424242,
  reasoning_effort: "none",
  max_tokens: 80,
  stream: false,
  stop: ["<|im_end|>"],
};
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

export async function request(
  base,
  payload,
  {
    endpoint = "/api/v0/chat/completions",
    timeoutMs = 30000,
    cancelAfterDelta = false,
    observeState,
    onDelta,
    signal,
  } = {},
) {
  base = loopbackBase(base);
  const start = performance.now();
  const controller = new AbortController();
  let abortKind = null;
  const row = {
    startedAt: new Date().toISOString(),
    endpoint,
    request: payload,
    timeoutMs,
    status: "pending",
    latencyMs: null,
    firstDeltaMs: null,
    output: "",
    reasoning: "",
    usage: null,
    stats: null,
    runtime: null,
    modelInfo: null,
    finishReason: null,
    abortAtMs: null,
    stateBeforeAbort: null,
  };
  const abort = (kind) => {
    if (abortKind) return;
    abortKind = kind;
    row.abortAtMs = performance.now() - start;
    controller.abort();
  };
  const timer = setTimeout(() => abort("timeout"), timeoutMs);
  const externalAbort = () => abort("safety-stop");
  signal?.addEventListener("abort", externalAbort, { once: true });
  if (signal?.aborted) externalAbort();
  try {
    const response = await fetch(base + endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "error",
    });
    row.httpStatus = response.status;
    if (!response.ok) {
      row.status = "http-error";
      row.errorBody = (await response.text()).slice(0, 4096);
      return row;
    }
    if (!payload.stream) {
      const data = await response.json();
      const choice = data.choices?.[0];
      if (!choice?.message || typeof choice.message.content !== "string")
        throw new Error("Invalid completion envelope");
      row.output = choice.message.content;
      row.reasoning = choice.message.reasoning_content ?? "";
      row.toolCalls = choice.message.tool_calls ?? [];
      row.finishReason = choice.finish_reason ?? null;
      row.usage = data.usage ?? null;
      row.stats = data.stats ?? null;
      row.runtime = data.runtime ?? null;
      row.modelInfo = data.model_info ?? null;
      row.status = "completed";
    } else {
      if (!response.headers.get("content-type")?.includes("text/event-stream"))
        throw new Error("Expected event stream");
      const decoder = new TextDecoder();
      let buffer = "",
        done = false,
        bytes = 0;
      for await (const chunk of response.body) {
        bytes += chunk.length;
        if (bytes > 262144) throw new Error("Stream exceeded bounded capture");
        buffer += decoder.decode(chunk, { stream: true });
        let lineEnd;
        while ((lineEnd = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (raw === "[DONE]") {
            done = true;
            continue;
          }
          const data = JSON.parse(raw);
          const choice = data.choices?.[0];
          const delta = choice?.delta;
          if (data.usage) row.usage = data.usage;
          if (data.stats) row.stats = data.stats;
          if (choice?.finish_reason) row.finishReason = choice.finish_reason;
          const text = delta?.content ?? "",
            reasoning = delta?.reasoning_content ?? "";
          row.output += text;
          row.reasoning += reasoning;
          if (text || reasoning) {
            row.firstDeltaMs ??= performance.now() - start;
            await onDelta?.();
            if (cancelAfterDelta && !abortKind) {
              row.stateBeforeAbort = (await observeState?.()) ?? null;
              if (controller.signal.aborted)
                throw new Error("Request deadline elapsed during observation");
              abort("cancelled");
              break;
            }
          }
        }
      }
      if (!done) throw new Error("Stream ended without DONE");
      row.status = "completed";
    }
  } catch (error) {
    row.status = abortKind ?? "client-error";
    row.errorShape = abortKind ? "AbortError" : error.message;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", externalAbort);
    row.latencyMs = performance.now() - start;
    if (abortKind) row.abortAtMs ??= row.latencyMs;
  }
  return row;
}

export async function waitForIdle(observeState, maxMs = 5000) {
  const start = performance.now(),
    samples = [];
  do {
    const state = await observeState();
    samples.push({ afterMs: performance.now() - start, ...state });
    if (state.status === "idle" && state.queued === 0)
      return { idle: true, elapsedMs: performance.now() - start, samples };
    await sleep(100);
  } while (performance.now() - start < maxMs);
  return { idle: false, elapsedMs: performance.now() - start, samples };
}

export async function runSmoke({
  base,
  model = "dotln-local",
  beforeRequest = async () => null,
  observeState,
  record = () => {},
  cooldownMs = 1000,
  onDelta,
}) {
  const rows = [];
  const invoke = async (name, extra = {}, options = {}) => {
    const preflight = await beforeRequest();
    const row = await request(
      base,
      { model, messages: fixedMessages, ...settings, ...extra },
      options,
    );
    row.name = name;
    row.preflight = preflight;
    rows.push(row);
    record(rows);
    if (observeState) {
      try {
        row.idleAfter = await waitForIdle(observeState);
      } catch (error) {
        row.idleAfter = { idle: false, errorShape: error.message };
        record(rows);
        throw new Error("Idle observation failed; stop live work");
      }
    }
    record(rows);
    if (row.idleAfter && !row.idleAfter.idle)
      throw new Error("Runner did not become idle; stop live work");
    await sleep(cooldownMs);
    return row;
  };
  for (let i = 1; i <= 3; i++) await invoke(`smoke-${i}`);
  if (!assess(rows).smokeCompleted)
    throw new Error(
      "Three-request smoke did not complete; stop before later experiments",
    );
  const structured = await invoke("schema", {
    messages: [
      {
        role: "user",
        content: "Return JSON with ok true and count 3, and no other fields.",
      },
    ],
    max_tokens: 32,
    response_format: {
      type: "json_schema",
      json_schema: { name: "probe", strict: true, schema },
    },
  });
  try {
    structured.schemaValid = validStructured(JSON.parse(structured.output));
  } catch {
    structured.schemaValid = false;
  }
  const tools = [
    {
      type: "function",
      function: {
        name: "add",
        description: "Add two small integers.",
        parameters: {
          type: "object",
          properties: { a: { type: "integer" }, b: { type: "integer" } },
          required: ["a", "b"],
          additionalProperties: false,
        },
      },
    },
  ];
  const messages = [
    {
      role: "user",
      content:
        "Call add with a=2 and b=3. After receiving the tool result, reply with only that number.",
    },
  ];
  const tool = await invoke("tool-call", {
    messages,
    tools,
    tool_choice: "required",
    max_tokens: 96,
  });
  let args;
  try {
    args = JSON.parse(tool.toolCalls?.[0]?.function?.arguments);
  } catch {
    args = null;
  }
  const call = tool.toolCalls?.[0];
  tool.argumentsValid =
    tool.toolCalls?.length === 1 &&
    call.type === "function" &&
    typeof call.id === "string" &&
    call.id.length > 0 &&
    call.function.name === "add" &&
    args !== null &&
    Object.keys(args).length === 2 &&
    args.a === 2 &&
    args.b === 3;
  if (tool.argumentsValid) {
    await invoke("tool-result", {
      messages: [
        ...messages,
        { role: "assistant", content: tool.output, tool_calls: tool.toolCalls },
        {
          role: "tool",
          tool_call_id: call.id,
          content: String(args.a + args.b),
        },
      ],
      tools,
      tool_choice: "none",
      max_tokens: 16,
    });
  }
  await invoke(
    "cancellation",
    {
      messages: [
        {
          role: "user",
          content:
            "Count from 1 to 200, one number per line. Do not skip numbers.",
        },
      ],
      max_tokens: 128,
      stream: true,
    },
    {
      endpoint: "/v1/chat/completions",
      cancelAfterDelta: true,
      observeState,
      onDelta,
    },
  );
  await invoke(
    "timeout",
    {
      messages: [
        { role: "user", content: "Count from 1 to 200, one number per line." },
      ],
      max_tokens: 128,
      stream: true,
    },
    { endpoint: "/v1/chat/completions", timeoutMs: 100 },
  );
  await invoke(
    "recovery",
    {
      messages: [{ role: "user", content: "Reply with only READY." }],
      max_tokens: 8,
    },
    { endpoint: "/v1/chat/completions" },
  );
  record(rows);
  return rows;
}

export function assess(rows) {
  const smoke = rows.filter((r) => /^smoke-/.test(r.name));
  const byName = (name) => rows.find((r) => r.name === name);
  const cancellation = byName("cancellation");
  const smokeCompleted =
    smoke.length === 3 &&
    smoke.every(
      (r) =>
        r.status === "completed" &&
        r.output.length > 0 &&
        r.finishReason === "stop",
    );
  return {
    smokeCompleted,
    byteIdentical:
      smokeCompleted &&
      smoke.every(
        (r) =>
          r.output === smoke[0].output && r.reasoning === smoke[0].reasoning,
      ),
    schemaValid:
      byName("schema")?.status === "completed" &&
      byName("schema")?.finishReason === "stop" &&
      byName("schema")?.schemaValid === true,
    toolRoundTrip:
      byName("tool-call")?.status === "completed" &&
      byName("tool-call")?.finishReason === "tool_calls" &&
      byName("tool-call")?.argumentsValid === true &&
      byName("tool-result")?.status === "completed" &&
      byName("tool-result")?.finishReason === "stop" &&
      byName("tool-result")?.output.trim() === "5",
    cancellationObserved:
      cancellation?.status === "cancelled" &&
      cancellation.stateBeforeAbort?.status === "generating" &&
      cancellation.idleAfter?.idle === true &&
      cancellation.idleAfter.elapsedMs +
        cancellation.latencyMs -
        cancellation.abortAtMs <=
        5000,
    timeoutObserved: byName("timeout")?.status === "timeout",
    recoveryCompleted:
      byName("recovery")?.status === "completed" &&
      byName("recovery")?.output === "READY",
  };
}

function preflightObservations(processes, thermal) {
  const gates = processes.split("\n").filter((line) => {
    const command = line.trim();
    return (
      /^(?:\S*\/)?(?:node|npm)(?:\s|$)/.test(command) &&
      /(?:scripts\/test-runner\.mjs|npm\s+(?:run\s+)?(?:test|test:full|test:docs|test:machinery)(?:\s|$))/.test(
        command,
      )
    );
  });
  if (gates.length)
    throw new Error("Product gate process observed; live inference refused");
  if (
    /CPU_Speed_Limit\s*=\s*(?!100\b)\d+|Thermal_Level\s*=\s*[1-9]/.test(thermal)
  )
    throw new Error("Thermal pressure reported; stop live inference");
  return {
    observedAt: new Date().toISOString(),
    gateProcessCount: gates.length,
    source:
      "host ps process snapshot; point observation, no cross-worktree lock",
    thermal,
  };
}
export function livePreflight() {
  const options = { encoding: "utf8", timeout: 2000 };
  return preflightObservations(
    execFileSync("ps", ["-axo", "comm=,args="], options),
    execFileSync("pmset", ["-g", "therm"], options).trim(),
  );
}
export async function livePreflightAsync() {
  const exec = promisify(execFile),
    options = { encoding: "utf8", timeout: 2000 };
  const [processes, thermal] = await Promise.all([
    exec("ps", ["-axo", "comm=,args="], options),
    exec("pmset", ["-g", "therm"], options),
  ]);
  return preflightObservations(processes.stdout, thermal.stdout.trim());
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 3 || args[0] !== "--live" || args[1] !== "--out")
    throw new Error(
      "usage: node scripts/probes/local-runner-smoke.mjs --live --out <new-json-path>",
    );
  const out = resolve(args[2]);
  if (existsSync(out))
    throw new Error("Retain existing run; choose a new output path");
  const lms = resolve(homedir(), ".lmstudio/bin/lms");
  const observeState = async () => {
    const models = JSON.parse(
      execFileSync(lms, ["ps", "--json"], { encoding: "utf8", timeout: 2000 }),
    );
    const model = models.find((m) => m.identifier === "dotln-local");
    return {
      status: model?.status ?? "unavailable",
      queued: model?.queued ?? null,
    };
  };
  const packet = {
    schemaVersion: 1,
    workOrder: "WO-137",
    startedAt: new Date().toISOString(),
    outcome: "inconclusive",
    rows: [],
    limits: {
      parallel: 1,
      maxOutputTokens: 128,
      timeoutMs: 30000,
      cooldownMs: 1000,
      contextLength: 4096,
    },
    boundary:
      "host-permitted client; runner egress not confined by this client",
  };
  mkdirSync(dirname(out), { recursive: true });
  const save = (rows) => {
    packet.rows = rows;
    writeFileSync(out, JSON.stringify(packet, null, 2) + "\n");
  };
  try {
    livePreflight();
    const initial = await observeState();
    if (initial.status !== "idle" || initial.queued !== 0)
      throw new Error("Required alias is not loaded and idle");
    await runSmoke({
      base: "http://127.0.0.1:1234",
      observeState,
      beforeRequest: livePreflight,
      record: save,
    });
    packet.assessment = assess(packet.rows);
  } catch (error) {
    packet.blocker = error.message;
  }
  packet.finishedAt = new Date().toISOString();
  save(packet.rows);
  console.log(
    JSON.stringify({
      output: out,
      assessment: packet.assessment,
      blocker: packet.blocker,
    }),
  );
}
if (isMainModule(import.meta.url)) await main();
