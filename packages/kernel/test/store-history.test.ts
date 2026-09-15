import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { decodeLog, encodeLog } from "../src/index.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const protocols = JSON.parse(
  readFileSync(
    new URL("../../test/fixtures/jsonl-protocols.json", import.meta.url),
    "utf8",
  ),
) as {
  nonEventPaths: Record<string, string>;
  controlSegmentPattern: string;
};
test("WO-045 committed EventEnvelope streams decode and round-trip byte-identically", (t) => {
  const paths = execFileSync(
    "git",
    ["ls-files", "-z", "--", "docs", "packages", "corpus"],
    { cwd: root, encoding: "utf8" },
  )
    .split("\0")
    .filter(
      (path) =>
        path.endsWith(".jsonl") &&
        /^(docs\/|corpus\/|packages\/[^/]+\/fixtures\/)/.test(path),
    );
  let streams = 0,
    events = 0,
    otherProtocols = 0;
  for (const path of paths) {
    if (
      Object.hasOwn(protocols.nonEventPaths, path) ||
      new RegExp(protocols.controlSegmentPattern).test(path)
    ) {
      otherProtocols++;
      continue;
    }
    // Default to strict validation: a missing schemaVersion cannot disguise a bad event as another protocol.
    const original = readFileSync(
      new URL(path, new URL("../../../../", import.meta.url)),
      "utf8",
    );
    const decoded = decodeLog(original);
    assert.equal(encodeLog(decoded), original, path);
    streams++;
    events += decoded.length;
  }
  assert.ok(streams >= 62, "must include every activation-base event stream");
  assert.ok(events >= 3857, "must include every activation-base event");
  t.diagnostic(
    `${streams} event streams / ${events} events byte-identical; ${otherProtocols} files classified as other JSONL protocols`,
  );
});
