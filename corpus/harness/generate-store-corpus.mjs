import assert from "node:assert/strict";
import {
  appendEvent,
  decodeLog,
  encodeLog,
  replay,
  replayOutbox,
} from "../../packages/kernel/dist/src/index.js";
import {
  args,
  exactFiles,
  fingerprint,
  isMain,
  jsonBytes,
  rng,
  SEED,
  sha256,
} from "./wo105-common.mjs";

export const SIZES = [0, 1, 8, 64];
export const DEPTH = 12000;
export const draft = (payload = {}, type = "Observed", occurredAt = 0) => ({
  schemaVersion: 1,
  type,
  occurredAt,
  actorId: "corpus-actor",
  workstreamId: "corpus-stream",
  payload,
});
export function generatedLog(seed, count) {
  assert.ok(
    Number.isSafeInteger(count) && count >= 0,
    "nonnegative event count required",
  );
  const next = rng(`${seed}:${count}`);
  let log = "";
  for (let i = 0; i < count; i++) {
    const block = Math.floor(i / 8);
    const commandId = `corpus-command-${block}`;
    const command = {
      commandId,
      workstreamId: "corpus-stream",
      intent: {
        kind: "Act",
        effect: "corpus.inspect",
        payload: { sample: next() },
      },
    };
    const slot = i % 8;
    const type =
      slot === 0 || slot === 4
        ? "CommandPersisted"
        : slot === 2 || slot === 3
          ? "CommandResult"
          : "Observed";
    const payload =
      type === "CommandPersisted"
        ? {
            command:
              slot === 4
                ? { ...command, commandId: `${commandId}-pending` }
                : command,
          }
        : type === "CommandResult"
          ? { commandId, result: "inspected" }
          : {
              text: "escaped\nline\r\nwith UTF-8: café 🐛",
              value: next(),
              flags: [true, null, false],
            };
    log = appendEvent(log, {
      ...draft(payload, type, i),
      correlationId: commandId,
      ...(i ? { causationId: `evt_${i}` } : {}),
    }).log;
  }
  return log;
}
export function deepLog() {
  const log = encodeLog([{ ...draft(null), eventId: "evt_1" }]);
  return log.replace(
    '"payload":null',
    `"payload":${"[".repeat(DEPTH)}0${"]".repeat(DEPTH)}`,
  );
}
export function storeFixtures(seed = SEED) {
  const ordinary = SIZES.map((events) => ({
    id: `lf-${events}`,
    kind: "generated",
    log: generatedLog(seed, events),
    expected: "decodes-with-sequential-events",
  }));
  return [
    ...ordinary,
    {
      id: "crlf",
      kind: "retained-family",
      log: generatedLog(seed, 8).replaceAll("\n", "\r\n"),
      expected: "decodes-with-identical-events-to-lf-8",
    },
    {
      id: "deep-nesting",
      kind: "retained-family",
      log: deepLog(),
      expected: "decodes-with-depth-12000-payload",
    },
  ];
}
export function buildStoreFiles(seed = SEED) {
  const files = {};
  const fixtures = storeFixtures(seed).map(({ log, ...meta }) => {
    // The CRLF anomaly is an escaped JSON string so ordinary Git whitespace
    // checks stay enabled while consumers reconstruct its exact log bytes.
    const storage = meta.id === "crlf" ? "json-log-string" : "jsonl";
    const name = `corpus/fixtures/store/${meta.id}.${storage === "jsonl" ? "jsonl" : "json"}`;
    files[name] = storage === "jsonl" ? log : jsonBytes({ log });
    return {
      ...meta,
      path: name,
      storage,
      events: decodeLog(log).length,
      bytes: Buffer.byteLength(log),
      sha256: sha256(log),
    };
  });
  files["corpus/fixtures/store/index.json"] = jsonBytes({
    seed,
    sizes: SIZES,
    depth: DEPTH,
    fixtures,
  });
  return files;
}

export function replayDeterminism(log) {
  const events = decodeLog(log);
  // The corpus reactor observes every envelope and payload, including deep data;
  // it is not a model of Seiri. Outbox behavior is separately exercised below.
  const reactor = (state, event, env) => ({
    state: {
      count: state.count + 1,
      digest: fingerprint([state.digest, event]),
    },
    intents: [],
    schedules: [],
    trace: {
      reactorId: "corpus-envelope-fold",
      reactorVersion: "1",
      branchPath: [event.type, event.eventId],
      envInputs: [`now:${env.now}`],
      cadenceEvaluations: [],
    },
  });
  const run = () => replay({ count: 0, digest: "start" }, events, reactor, {});
  assert.deepEqual(run(), run(), "replay run-twice determinism");
  const outbox = () => replayOutbox(events, { includeTraces: true });
  assert.deepEqual(outbox(), outbox(), "outbox run-twice determinism");
  return {
    replaySha256: fingerprint(run()),
    outboxSha256: fingerprint(outbox()),
  };
}
if (isMain(import.meta.url)) {
  const { seed, mode } = args(process.argv.slice(2), ["write", "check"]);
  const files = buildStoreFiles(seed);
  exactFiles(files, mode);
  console.log(
    JSON.stringify({
      lane: "store-generator",
      seed,
      mode,
      files: Object.keys(files).length,
      sizes: SIZES,
      depth: DEPTH,
    }),
  );
}
