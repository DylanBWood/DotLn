import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
const root = process.argv[2],
  beforeRoot = process.argv[3];
const before = await import(
  pathToFileURL(beforeRoot + "/packages/compiler/dist/src/index.js")
);
const after = await import(
  pathToFileURL(root + "/packages/compiler/dist/src/index.js")
);
const fixture = await import(
  pathToFileURL(
    beforeRoot + "/packages/compiler/dist/test/authority-fixture.js",
  )
);
const entropy = JSON.parse(
  readFileSync(
    root + "/packages/compiler/fixtures/wo029-entropy-reducer.json",
    "utf8",
  ),
);
const identities = JSON.parse(
  readFileSync(
    root + "/packages/compiler/fixtures/wo029-identities.json",
    "utf8",
  ),
);
const graphs = [
  ["seiri", before.seiriLoadout, before.seiriEnvironment()],
  [
    "entropy",
    entropy,
    identities.entropy?.artifactIdentity?.compilationEnvironment ??
      before.seiriEnvironment(),
  ],
  ["authority", fixture.authorityFixture(), before.seiriEnvironment()],
];
const rows = graphs.map(([name, graph, env]) => {
  const old = before.compileLoadout(graph, env),
    current = after.compileLoadout(graph, env);
  assert.equal(old.artifactIdentity.compilerPackageVersion, "0.19.3");
  assert.equal(current.artifactIdentity.compilerPackageVersion, "0.19.4");
  // Release bookkeeping is explicit: no other identity or program field may
  // differ. compiler-parity.json records full equality before the version bump.
  assert.deepEqual(
    current,
    {
      ...old,
      artifactIdentity: {
        ...old.artifactIdentity,
        compilerPackageVersion: "0.19.4",
      },
    },
    name,
  );
  const bytes = JSON.stringify(old);
  return {
    name,
    ok: old.ok,
    bytes: Buffer.byteLength(bytes),
    sha256: createHash("sha256").update(bytes).digest("hex"),
    currentSha256: createHash("sha256")
      .update(JSON.stringify(current))
      .digest("hex"),
    semanticHash: current.semanticHash,
    onlyChangedField:
      "artifactIdentity.compilerPackageVersion: 0.19.3 -> 0.19.4",
  };
});
console.log(
  JSON.stringify(
    { baseline: "6f9494649db9a4984911801ae320788264d84ff9", rows },
    null,
    2,
  ),
);
