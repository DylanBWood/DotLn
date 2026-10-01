import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import {
  compileStoryContract,
  decodeSourceBundle,
  revise,
} from "../../../packages/compiler/dist/src/index.js";

// Retained fixture contracts and actual revision diffs; no model episode.
const [mode = "--check"] = process.argv.slice(2);
assert.ok(["--write", "--check"].includes(mode));
const fixture = JSON.parse(
  readFileSync(
    new URL(
      "../../../packages/compiler/fixtures/wo061-story-contracts.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const decode = (value) => {
  const result = decodeSourceBundle(value, {
    allowedHosts: fixture.allowedHosts,
  });
  assert.ok(result.ok, JSON.stringify(result));
  return result.bundle;
};
const base = decode(fixture.revision.bundle);
const before = compileStoryContract(base, fixture.revision.inferences);
const changed = structuredClone(fixture.revision.bundle);
changed.revisionId = "r2";
changed.sections[0].text = "Keep data safely.\nPreserve logs.";
changed.sections[0].span.end = Buffer.byteLength(changed.sections[0].text);
const afterChange = revise(before, decode(changed));
const superseding = structuredClone(fixture.revision.bundle);
superseding.revisionId = "r2";
const text = "Decision: retire the window requirement.";
const span = { entryId: "e-decision", start: 0, end: Buffer.byteLength(text) };
superseding.discussion.push({
  id: "e-decision",
  author: "automation",
  text,
  span,
  createdAt: "2026-10-01T00:01:00Z",
});
const afterSupersession = revise(before, decode(superseding), [
  {
    span,
    relation: "supersedes",
    target: base.sections[1].span,
    evidence: [span],
    rationale: "The fixture explicitly retires this earlier requirement.",
  },
]);
const diff = (original, revised) =>
  Object.fromEntries(
    ["statements", "criteria", "relations", "openDecisions"].map((field) => {
      const id = {
        statements: "statementId",
        criteria: "criterionId",
        relations: "relationId",
        openDecisions: "decisionId",
      }[field];
      const old = new Map(original[field].map((item) => [item[id], item]));
      const fresh = new Map(revised[field].map((item) => [item[id], item]));
      return [
        field,
        {
          removed: [...old.keys()].filter((key) => !fresh.has(key)),
          added: [...fresh.keys()].filter((key) => !old.has(key)),
          changed: [...old.keys()].filter(
            (key) =>
              fresh.has(key) &&
              JSON.stringify(old.get(key)) !== JSON.stringify(fresh.get(key)),
          ),
        },
      ];
    }),
  );
const output = {
  fixtureProvenance:
    "Synthetic bundles and supplied inference doubles; no model episode.",
  contracts: Object.fromEntries(
    ["core", "thread", "taxonomy"].map((name) => [
      name,
      compileStoryContract(
        decode(fixture[name].bundle),
        fixture[name].inferences,
      ),
    ]),
  ),
  revision: {
    before,
    changedSection: {
      ...afterChange,
      diff: diff(before, afterChange.contract),
    },
    explicitSupersession: {
      ...afterSupersession,
      diff: diff(before, afterSupersession.contract),
    },
  },
};
const bytes = JSON.stringify(output, null, 2) + "\n";
const destination = new URL("fixture-contracts.json", import.meta.url);
if (mode === "--write") writeFileSync(destination, bytes);
else assert.equal(readFileSync(destination, "utf8"), bytes);
console.log(
  `WO-061 fixture contracts and revision diffs ${mode === "--write" ? "recorded" : "match"}; ${Buffer.byteLength(bytes)} bytes.`,
);
