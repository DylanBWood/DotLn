import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import {
  compileStoryContract,
  decodeSourceBundle,
  deriveSurfaces,
} from "../../../packages/compiler/dist/src/index.js";

const [mode = "--check"] = process.argv.slice(2);
assert.ok(["--write", "--check"].includes(mode));
const fixture = JSON.parse(
  readFileSync(
    new URL(
      "../../../packages/compiler/fixtures/wo124-impact-surfaces.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const index = fixture.files.map(({ path, contents }) => ({
  path,
  size: Buffer.byteLength(contents),
  hash: createHash("sha256").update(contents).digest("hex"),
}));
const cases = fixture.cases.map((scenario) => {
  const decoded = decodeSourceBundle(
    {
      bundleId: "wo124-synthetic-issue",
      sourceKind: "synthetic-issue",
      revisionId: "r1",
      sections: scenario.requirements.map((text, i) => ({
        id: `s-${i}`,
        text,
        span: { sectionId: `s-${i}`, start: 0, end: Buffer.byteLength(text) },
      })),
      discussion: [],
      images: [],
      revisions: [],
    },
    { allowedHosts: [] },
  );
  assert.ok(decoded.ok);
  const contract = compileStoryContract(
    decoded.bundle,
    decoded.bundle.sections.map((section) => ({
      span: section.span,
      class: "requirement",
      rationale:
        "Synthetic requirement classification supplied by the fixture double.",
    })),
  );
  const options = {
    inferences: (scenario.inferences ?? []).map((entry) => ({
      statementId: contract.statements[entry.requirement].statementId,
      path: entry.path,
      rationale: entry.rationale,
    })),
    ...(scenario.threshold === undefined
      ? {}
      : { threshold: scenario.threshold }),
  };
  const result = deriveSurfaces(contract, fixture.profile, index, options);
  assert.equal(result.kind, scenario.kind);
  assert.equal(result.confidence, scenario.confidence);
  assert.deepEqual(
    result.surfaces.map((entry) => entry.path),
    scenario.surfaces,
  );
  assert.equal(
    JSON.stringify(result),
    JSON.stringify(deriveSurfaces(contract, fixture.profile, index, options)),
  );
  return { name: scenario.name, contract, options, result };
});
const output = {
  fixtureProvenance:
    "Synthetic SourceBundles/profile/files and supplied inference doubles; no model episode.",
  profile: fixture.profile,
  snapshotIndex: index,
  cases,
  unavailableSnapshot: deriveSurfaces(cases[0].contract, fixture.profile, null),
};
const bytes = JSON.stringify(output, null, 2) + "\n";
const destination = new URL("fixture-derivations.json", import.meta.url);
if (mode === "--write") writeFileSync(destination, bytes);
else assert.equal(readFileSync(destination, "utf8"), bytes);
console.log(
  `WO-124 ${cases.length} fixture derivations ${mode === "--write" ? "recorded" : "match"}; ${Buffer.byteLength(bytes)} bytes.`,
);
