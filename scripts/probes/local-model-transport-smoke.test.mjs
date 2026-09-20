import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import {
  DEFAULT_ORIGIN,
  envelopeShape,
  packetFor,
  pinnedRequest,
  probeEndpoint,
  runTransportSmoke,
} from "./local-model-transport-smoke.mjs";
import { resultId } from "../../packages/skeleton/dist/src/worker-protocol.js";

const request = pinnedRequest();

const workerResult = {
  envelope: {
    workOrderId: request.workOrder.workOrderId,
    episodeId: request.episodeId,
    resultId: resultId(request.command),
    status: "completed",
    summary: "A model-authored sentence that must never reach the packet.",
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
};

async function endpoint(t, handler) {
  const server = createServer(handler);
  await new Promise((ready) => server.listen(0, "127.0.0.1", ready));
  t.after(() => new Promise((done) => server.close(done)));
  return `http://127.0.0.1:${server.address().port}`;
}

const completion = (result) =>
  JSON.stringify({
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: JSON.stringify(result) },
        finish_reason: "stop",
      },
    ],
  });

async function closedOrigin() {
  const server = createServer();
  await new Promise((ready) => server.listen(0, "127.0.0.1", ready));
  const { port } = server.address();
  await new Promise((done) => server.close(done));
  return `http://127.0.0.1:${port}`;
}

test("WO-110 the smoke records an envelope as shapes and keeps model text out", async (t) => {
  const origin = await endpoint(t, (incoming, response) => {
    if (incoming.url === "/api/v0/models") {
      response.writeHead(200, { "content-type": "application/json" });
      return response.end(JSON.stringify({ data: [] }));
    }
    let body = "";
    incoming.on("data", (chunk) => (body += chunk));
    incoming.on("end", () => {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(completion(workerResult));
    });
  });

  const probe = await probeEndpoint(origin);
  assert.equal(probe.label, "observed");

  const row = await runTransportSmoke({ origin, version: "0.4.24" });
  assert.equal(row.outcome, "envelope");
  assert.equal(row.label, "observed");
  assert.equal(row.harnessVersion, "0.4.24");
  assert.deepEqual(row.shape.envelopeFields, [
    "episodeId",
    "requiresHuman",
    "resultId",
    "status",
    "summary",
    "workOrderId",
  ]);
  assert.equal(row.shape.status, "completed");
  assert.equal(row.shape.candidateCount, 1);
  assert.deepEqual(row.shape.candidateEvidenceCounts, [2]);
  assert.equal(
    row.shape.summaryCharacters,
    workerResult.envelope.summary.length,
  );

  const packet = JSON.stringify(packetFor({ origin, probe, row }));
  assert.doesNotMatch(packet, /must never reach the packet/u);
  assert.doesNotMatch(packet, /old-report/u);
  assert.doesNotMatch(packet, /generated-stale/u);
  assert.equal(packetFor({ origin, probe, row }).outcome, "envelope");
});

test("WO-110 an unreachable endpoint records an unavailable row rather than failing", async () => {
  const origin = await closedOrigin();
  const probe = await probeEndpoint(origin, { timeoutMs: 500 });
  assert.equal(probe.label, "unavailable");
  assert.equal(probe.httpStatus, null);

  const row = await runTransportSmoke({ origin, timeoutMs: 2000 });
  assert.equal(row.outcome, "unavailable");
  assert.equal(row.failure, "model-unavailable");

  const packet = packetFor({ origin, probe, row });
  assert.equal(packet.outcome, "unavailable");
  assert.equal(packet.workOrder, "WO-110");
  assert.equal(packet.declaredRow.row, "L-U1");
});

test("WO-110 the smoke refuses a non-loopback endpoint and defaults to loopback", async () => {
  assert.equal(DEFAULT_ORIGIN, "http://127.0.0.1:1234");
  await assert.rejects(
    probeEndpoint("http://example.invalid:1234"),
    /loopback/u,
  );
  await assert.rejects(
    runTransportSmoke({ origin: "https://127.0.0.1:1234" }),
    /loopback/u,
  );
});

test("WO-110 the shape projection tolerates a malformed result without inventing fields", () => {
  const shape = envelopeShape({});
  assert.deepEqual(shape.envelopeFields, []);
  assert.equal(shape.candidateCount, null);
  assert.equal(shape.summaryCharacters, 0);
});
