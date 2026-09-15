import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  appendEvent,
  decodeLog,
  tryDecodeLog,
  encodeLog,
} from "../src/index.js";
import type { EventDraft, JsonValue } from "../src/index.js";

const draft: EventDraft = {
  schemaVersion: 1,
  type: "Observed",
  occurredAt: 1,
  actorId: "actor",
  workstreamId: "stream",
  payload: {},
};
const first = appendEvent("", draft);
const corpus = JSON.parse(
  readFileSync(
    new URL("../../test/fixtures/malformed-envelopes.json", import.meta.url),
    "utf8",
  ),
) as {
  name: string;
  line: string;
  code: string;
  path: string;
}[];

test("WO-045 malformed envelope corpus returns distinct code/path pairs and physical lines", () => {
  assert.ok(corpus.length >= 12);
  assert.equal(
    new Set(corpus.map((row) => `${row.code}:${row.path}`)).size,
    corpus.length,
    "every corpus case has a distinct code/path pair",
  );
  for (const row of corpus) {
    for (const prefix of ["", first.log]) {
      const line = prefix
        ? row.line
            .replace('"eventId":"evt_1"', '"eventId":"evt_2"')
            .replace(
              row.code === "EVENT_ORDER" ? '"eventId":"evt_2"' : '"unused"',
              '"eventId":"evt_1"',
            )
        : row.line;
      const log = `${prefix}${line}\n`;
      const result = tryDecodeLog(log);
      assert.equal(result.ok, false, row.name);
      if (result.ok) throw new Error("unexpected success");
      assert.deepEqual(
        { code: result.code, path: result.path },
        { code: row.code, path: row.path },
        row.name,
      );
      assert.match(
        result.message,
        new RegExp(`line ${prefix ? 2 : 1}:`),
        row.name,
      );
      for (const run of [() => decodeLog(log), () => appendEvent(log, draft)])
        assert.throws(run, { message: result.message }, row.name);
    }
  }
});

test("WO-045 accepts all JSON payload forms, optional string IDs and unchanged framing", () => {
  for (const payload of [
    null,
    true,
    -0.5,
    "escaped\nline",
    [1, null, {}],
    { nested: [false, "ok"] },
  ] satisfies JsonValue[]) {
    const result = appendEvent("", {
      ...draft,
      type: "",
      actorId: "",
      workstreamId: "",
      occurredAt: -0.25,
      episodeId: "",
      correlationId: "c",
      causationId: "prior",
      payload,
    });
    assert.deepEqual(tryDecodeLog(result.log), {
      ok: true,
      value: [result.event],
    });
    assert.equal(encodeLog(decodeLog(result.log)), result.log);
    assert.deepEqual(decodeLog(result.log.replace(/\n$/, "\r\n")), [
      result.event,
    ]);
    assert.equal(appendEvent(result.log, draft).event.eventId, "evt_2");
  }
  assert.deepEqual(tryDecodeLog(""), { ok: true, value: [] });
});

test("WO-045 typed framing failures preserve existing diagnostics", () => {
  for (const [log, code] of [
    [first.log.trimEnd(), "MISSING_NEWLINE"],
    ["\n", "EXPECTED_OBJECT"],
    ["{\n", "INVALID_JSON"],
    ["null\n", "EXPECTED_OBJECT"],
  ]) {
    const result = tryDecodeLog(log!);
    assert.equal(result.ok, false);
    if (result.ok) throw new Error("unexpected success");
    assert.equal(result.code, code);
    assert.equal(result.path, "$");
  }
});

test("WO-045 deep JSON payloads avoid recursive validator stack exhaustion", () => {
  const payload = "[".repeat(12000) + "0" + "]".repeat(12000);
  const log = first.log.replace('"payload":{}', `"payload":${payload}`);
  assert.equal(tryDecodeLog(log).ok, true);
  const overflow = first.log.replace(
    '"payload":{}',
    '"payload":{"a.b":[1e309]}',
  );
  const result = tryDecodeLog(overflow);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.path, '$.payload["a.b"][0]');
});
