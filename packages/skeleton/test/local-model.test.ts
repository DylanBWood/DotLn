import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { createServer, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { readFileSync } from "node:fs";
import {
  LOCAL_MODEL_ROW,
  LOCAL_MODEL_TRANSPORT,
  LocalModelWorkOrderTransport,
  localModelOrigin,
} from "../src/local-model-transport.js";
import { localModelAdapter } from "../src/local-model-actor.js";
import { actorCatalog } from "../src/actor-catalog.js";
import {
  assertActorSpec,
  scriptResultVerified,
  type ActorSpec,
} from "../src/actor-contract.js";
import {
  WorkerFailure,
  parseWorkerResult,
  resultId,
  type WorkerRequest,
  type WorkerResult,
} from "../src/worker-protocol.js";
import {
  transportPrompt,
  transportResultSchema,
} from "../src/verification-protocol.js";

const request = (
  JSON.parse(
    readFileSync(
      new URL("../../fixtures/wo051-inspection-baseline.json", import.meta.url),
      "utf8",
    ),
  ) as { request: WorkerRequest }
).request;

const ENVELOPE_FIELDS = [
  "episodeId",
  "requiresHuman",
  "resultId",
  "status",
  "summary",
  "workOrderId",
];

const resultFor = (episodeId: string): WorkerResult =>
  ({
    envelope: {
      workOrderId: request.workOrder.workOrderId,
      episodeId,
      resultId: resultId(request.command),
      status: "completed",
      summary: "Inspected the mounted inventory; one generated-stale file.",
      requiresHuman: false,
    },
    candidates: [
      {
        path: "tmp/old-report.txt",
        classification: "generated-stale",
        evidence: ["inventory:tmp/old-report.txt", "references:none"],
      },
    ],
    beaconClaim: "inspection-completed",
  }) as unknown as WorkerResult;

const completion = (
  content: unknown,
  choice: Record<string, unknown> = {},
): string =>
  JSON.stringify({
    id: "chatcmpl-fixture",
    object: "chat.completion",
    model: request.model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            typeof content === "string" ? content : JSON.stringify(content),
        },
        finish_reason: "stop",
        ...choice,
      },
    ],
    usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
  });

/** A real loopback HTTP endpoint: the double is an endpoint, not a stubbed
 * client, so the transport's own request and parsing run unchanged. */
async function endpoint(
  t: TestContext,
  handler: (body: string, response: ServerResponse) => void,
) {
  const received: string[] = [];
  const server = createServer((incoming, response) => {
    let body = "";
    incoming.setEncoding("utf8");
    incoming.on("data", (chunk: string) => {
      body += chunk;
    });
    incoming.on("end", () => {
      received.push(body);
      handler(body, response);
    });
  });
  await new Promise<void>((ready) =>
    server.listen(0, "127.0.0.1", () => ready()),
  );
  t.after(() => new Promise<void>((done) => server.close(() => done())));
  return {
    origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    received,
  };
}

const ok = (payload: string) => (_body: string, response: ServerResponse) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(payload);
};

/** A port nothing listens on: bind it, read it, release it. */
async function closedOrigin(): Promise<string> {
  const server = createServer();
  await new Promise<void>((ready) =>
    server.listen(0, "127.0.0.1", () => ready()),
  );
  const { port } = server.address() as AddressInfo;
  await new Promise<void>((done) => server.close(() => done()));
  return `http://127.0.0.1:${port}`;
}

const failure = async (run: Promise<unknown>): Promise<WorkerFailure> => {
  try {
    await run;
  } catch (error) {
    assert.ok(
      error instanceof WorkerFailure,
      `expected WorkerFailure: ${error}`,
    );
    return error;
  }
  return assert.fail("expected the dispatch to fail");
};

test("WO-110 AC1 a double endpoint returns the validated six-field envelope", async (t) => {
  const served = await endpoint(
    t,
    ok(completion(resultFor(request.episodeId))),
  );
  const transport = new LocalModelWorkOrderTransport(served.origin, {
    version: "0.4.24",
  });
  assert.equal(transport.name, LOCAL_MODEL_TRANSPORT);
  assert.equal(transport.harnessVersion, "0.4.24");

  const dispatched = transport.dispatch(request, () => 4242);
  const receipt = await dispatched.receipt;
  const result = await dispatched.completed;

  assert.deepEqual(receipt, {
    commandId: request.command.commandId,
    transport: LOCAL_MODEL_TRANSPORT,
    acceptedAt: 4242,
  });
  // Exactly the six worker-reported fields, and nothing else.
  assert.deepEqual(Object.keys(result.envelope).sort(), ENVELOPE_FIELDS);
  assert.equal(result.envelope.workOrderId, request.workOrder.workOrderId);
  assert.equal(result.envelope.episodeId, request.episodeId);
  assert.equal(result.envelope.resultId, resultId(request.command));
  assert.equal(result.envelope.status, "completed");
  assert.equal(result.envelope.requiresHuman, false);
  assert.equal(result.beaconClaim, "inspection-completed");
  // The host validates again; a vendor schema claim is not validation.
  assert.deepEqual(parseWorkerResult(result, request), result);
  assert.equal(dispatched.alive(), false);
});

test("WO-110 the wire request carries the compiled prompt, the result schema and the observed decoding", async (t) => {
  const served = await endpoint(
    t,
    ok(completion(resultFor(request.episodeId))),
  );
  await new LocalModelWorkOrderTransport(served.origin).dispatch(
    request,
    () => 0,
  ).completed;

  assert.equal(served.received.length, 1);
  const sent = JSON.parse(served.received[0]!) as Record<string, unknown>;
  assert.equal(sent.model, request.model);
  assert.equal(sent.stream, false);
  assert.equal(sent.temperature, 0);
  assert.equal(sent.top_p, 1);
  assert.equal(sent.seed, 424242);
  // WO-137 observed an empty answer without this selector on 0.4.24+1.
  assert.equal(sent.reasoning_effort, "none");
  assert.equal(sent.max_tokens, 1024);
  assert.deepEqual(sent.response_format, {
    type: "json_schema",
    json_schema: {
      name: "dotln_work_order_result",
      strict: true,
      schema: transportResultSchema(request),
    },
  });
  const messages = sent.messages as { role: string; content: string }[];
  assert.equal(messages.length, 2);
  assert.equal(messages[0]!.role, "system");
  assert.equal(messages[1]!.role, "user");
  assert.equal(messages[1]!.content, transportPrompt(request));
  // The DotLn effort selector stays a launch claim; no wire effort is invented.
  assert.equal("effort" in sent, false);
});

test("WO-110 AC1 an unavailable endpoint yields the typed unavailability", async () => {
  const origin = await closedOrigin();
  const dispatched = new LocalModelWorkOrderTransport(origin).dispatch(
    request,
    () => 0,
  );
  const error = await failure(dispatched.completed);
  assert.equal(error.code, "model-unavailable");
  // The receipt never claims acceptance from an endpoint that refused.
  await assert.rejects(dispatched.receipt, /model-unavailable/u);
});

test("WO-110 an endpoint without the model is unavailable; other HTTP faults are transport failures", async (t) => {
  const missing = await endpoint(t, (_body, response) => {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "No models loaded" }));
  });
  assert.equal(
    (
      await failure(
        new LocalModelWorkOrderTransport(missing.origin).dispatch(
          request,
          () => 0,
        ).completed,
      )
    ).code,
    "model-unavailable",
  );

  const broken = await endpoint(t, (_body, response) => {
    response.writeHead(500, { "content-type": "text/plain" });
    response.end("upstream backend crashed");
  });
  const error = await failure(
    new LocalModelWorkOrderTransport(broken.origin).dispatch(request, () => 0)
      .completed,
  );
  assert.equal(error.code, "transport-failed");
  assert.match(error.message, /http-500/u);
});

test("WO-110 truncated, unparsable and contract-breaking completions are refused by code", async (t) => {
  const truncated = await endpoint(
    t,
    ok(completion(resultFor(request.episodeId), { finish_reason: "length" })),
  );
  assert.equal(
    (
      await failure(
        new LocalModelWorkOrderTransport(truncated.origin).dispatch(
          request,
          () => 0,
        ).completed,
      )
    ).code,
    "output-limit",
  );

  const prose = await endpoint(t, ok(completion("Here is my analysis:")));
  assert.equal(
    (
      await failure(
        new LocalModelWorkOrderTransport(prose.origin).dispatch(
          request,
          () => 0,
        ).completed,
      )
    ).code,
    "invalid-result",
  );

  // WO-137 observed a reasoning-only answer returning empty content.
  const empty = await endpoint(t, ok(completion("")));
  assert.equal(
    (
      await failure(
        new LocalModelWorkOrderTransport(empty.origin).dispatch(
          request,
          () => 0,
        ).completed,
      )
    ).code,
    "invalid-result",
  );

  const foreign = resultFor(request.episodeId) as unknown as {
    envelope: Record<string, unknown>;
  };
  const wrongEpisode = await endpoint(
    t,
    ok(
      completion({
        ...foreign,
        envelope: { ...foreign.envelope, episodeId: "someone_elses_episode" },
      }),
    ),
  );
  assert.equal(
    (
      await failure(
        new LocalModelWorkOrderTransport(wrongEpisode.origin).dispatch(
          request,
          () => 0,
        ).completed,
      )
    ).code,
    "invalid-result",
  );
});

test("WO-110 the endpoint and profile fences refuse before any request is sent", async (t) => {
  for (const address of [
    "https://127.0.0.1:1234",
    "http://localhost:1234",
    "http://127.0.0.1",
    "http://user:secret@127.0.0.1:1234",
    "http://127.0.0.1:1234/v1",
    "not-a-url",
  ])
    assert.throws(
      () => new LocalModelWorkOrderTransport(address),
      /profile-refused/u,
      address,
    );
  assert.equal(
    localModelOrigin("http://127.0.0.1:1234"),
    "http://127.0.0.1:1234",
  );

  // WO-110's non-goal: no writing profile for the local model.
  const served = await endpoint(
    t,
    ok(completion(resultFor(request.episodeId))),
  );
  const transport = new LocalModelWorkOrderTransport(served.origin);
  assert.throws(
    () =>
      transport.dispatch(
        { ...request, kind: "source-change" } as never,
        () => 0,
      ),
    /no writing profile/u,
  );
  assert.throws(
    () =>
      transport.dispatch(
        { ...request, kind: "plan-refutation" } as never,
        () => 0,
      ),
    /inspection profile only/u,
  );
  assert.equal(served.received.length, 0);
});

test("WO-110 a killed episode is interrupted without a supervisor process", async (t) => {
  const served = await endpoint(t, (_body, response) => {
    // Headers and a partial body reach the client; the completion never does,
    // so the dispatch ends only because the host aborts it.
    response.writeHead(200, { "content-type": "application/json" });
    response.flushHeaders();
    response.write("{");
  });
  const dispatched = new LocalModelWorkOrderTransport(served.origin, {
    timeoutMs: 5_000,
  }).dispatch(request, () => 0);
  await dispatched.receipt;
  assert.equal(dispatched.alive(), true);
  dispatched.kill();
  assert.equal((await failure(dispatched.completed)).code, "interrupted");
  assert.equal(dispatched.alive(), false);
});

test("WO-110 AC1 the catalog reports the declared row and the resident gets a reasoned NoOp", async (t) => {
  const served = await endpoint(t, ok(completion(resultFor("episode_1"))));
  const spec: ActorSpec = {
    kind: "local-model",
    effect: request.command.intent.effect,
    surface: "fixture",
    resources: { files: 1, lines: 1, tokens: 200 },
    local: { endpoint: served.origin, request },
  };

  // The shipped catalog carries WO-110's dated row, not a placeholder.
  assert.equal(LOCAL_MODEL_ROW.label, "unavailable");
  const shipped = actorCatalog["local-model"].available(spec);
  assert.equal(
    shipped,
    `${LOCAL_MODEL_ROW.row}: unavailable; ${LOCAL_MODEL_ROW.reason}`,
  );
  assert.doesNotMatch(shipped!, /until WO-110/u);
  assert.throws(
    () =>
      actorCatalog["local-model"].run(spec, {
        residentStore: "/fixture",
        episodeId: "episode_1",
      }),
    /unavailable/u,
  );

  // A ready row runs the episode through the double endpoint.
  const ready = localModelAdapter({
    row: { row: "L-R1", label: "ready", reason: "fixture endpoint" },
  });
  assert.equal(ready.available(spec), null);
  const { local: declared, ...withoutEndpoint } = spec;
  assert.ok(declared);
  assert.equal(
    ready.available(withoutEndpoint),
    "local-model needs a declared endpoint request",
  );
  const run = ready.run(spec, {
    residentStore: "/fixture",
    episodeId: "episode_1",
  });
  const observed = await run.completed;
  assert.equal(observed.exitCode, 0);
  assert.equal(observed.reason, "worker-result");
  assert.equal(observed.local?.launch.transport, LOCAL_MODEL_TRANSPORT);
  assert.equal(observed.local?.launch.endpoint, served.origin);
  assert.equal(observed.local?.launch.origin, "actor");
  assert.equal(observed.local?.launch.episodeId, "episode_1");
  assert.deepEqual(
    Object.keys(observed.local!.result!.envelope).sort(),
    ENVELOPE_FIELDS,
  );
  // A local completion claim is never independent verification.
  assert.equal(scriptResultVerified(spec, observed, "episode_1"), false);
  assert.equal(observed.verified, false);
  t.diagnostic(`local-model row: ${LOCAL_MODEL_ROW.row}`);
});

test("WO-110 an endpoint failure reaches the resident as a typed actor observation", async () => {
  const origin = await closedOrigin();
  const spec: ActorSpec = {
    kind: "local-model",
    effect: request.command.intent.effect,
    surface: "fixture",
    resources: { files: 1, lines: 1, tokens: 200 },
    local: { endpoint: origin, request },
  };
  const ready = localModelAdapter({
    row: { row: "L-R1", label: "ready", reason: "fixture endpoint" },
  });
  const observed = await ready.run(spec, {
    residentStore: "/fixture",
    episodeId: "episode_1",
  }).completed;
  assert.equal(observed.reason, "worker-failed");
  assert.equal(observed.local?.failure, "model-unavailable");
  assert.equal(observed.local?.result, undefined);
  assert.equal(scriptResultVerified(spec, observed, "episode_1"), false);
});

test("WO-110 an actor without an endpoint decodes and reports unavailable", () => {
  // The operator's endpoint may not exist yet: availability is a separate row,
  // so a bare declaration must not refuse the whole resident configuration.
  const bare: ActorSpec = {
    kind: "local-model",
    effect: "repo.inspect",
    surface: "fixture",
    resources: { files: 1 },
  };
  assert.doesNotThrow(() => assertActorSpec(bare));
  assert.match(actorCatalog["local-model"].available(bare)!, /L-U1/u);
  assert.equal(
    localModelAdapter({
      row: { row: "L-R1", label: "ready", reason: "fixture" },
    }).available(bare),
    "local-model needs a declared endpoint request",
  );
  // A result can never claim a local observation without a declaration.
  assert.throws(
    () =>
      scriptResultVerified(bare, {
        exitCode: 0,
        signal: null,
        stdoutSha256: "0".repeat(64),
        firstLine: "",
        verified: false,
        reason: "worker-result",
        local: { launch: {} as never, failure: "transport-failed" },
      }),
    /without a declared endpoint/u,
  );
});

test("WO-110 a local-model declaration is refused on another actor kind", () => {
  const spec = {
    kind: "script" as const,
    effect: "repo.inspect",
    surface: "fixture",
    resources: {},
    command: ["/bin/echo"],
    cwd: "/fixture",
    timeoutMs: 1000,
    expectedStdoutSha256: "a".repeat(64),
    local: { endpoint: "http://127.0.0.1:1234", request },
  };
  // available() reports a reason; only run() refuses.
  assert.match(
    actorCatalog["local-model"].available(spec as ActorSpec)!,
    /unavailable/u,
  );
  assert.throws(
    () =>
      localModelAdapter({
        row: { row: "L-R1", label: "ready", reason: "fixture" },
      }).run(spec as ActorSpec, {
        residentStore: "/fixture",
        episodeId: "episode_1",
      }),
    /local endpoint request on another actor kind/u,
  );
});
