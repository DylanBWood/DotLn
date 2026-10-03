import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// These hashes cover the pre-move bodies recorded in the original extraction
// receipt, independently confirmed against the order's base by VER-001 F1.
const originals = {
  VerificationOpened: {
    start: '    case "VerificationOpened": {',
    characters: 3178,
    sha256: "4a39bcebe2bbb71bc57bb07b7ad2a5828c47034f57d691d839b8dd7c1838ae56",
  },
  "CommandResult-evaluation": {
    start:
      "      const rows = state.rows.map((row): AcceptanceEvidenceRow => {",
    characters: 3238,
    sha256: "8db6185ec1c0fd01d558bada4fbded27a86c398ffa1cc1fe2a46b05c22ed031b",
  },
  VerificationSubjectSubmitted: {
    start: '    case "VerificationSubjectSubmitted": {',
    characters: 2153,
    sha256: "8e85abee38492a13e4f81f32c2cc827350f89944aa4350c8d0eda82073187f93",
  },
};
const source = (name) =>
  readFileSync(
    new URL(`../../../packages/skeleton/src/${name}`, import.meta.url),
    "utf8",
  );

export function checkReactorMove() {
  const leaf = source("verification-fold.ts");
  const regions = {};
  for (const [name, original] of Object.entries(originals)) {
    const start = leaf.indexOf(original.start);
    assert.ok(start >= 0 && leaf.indexOf(original.start, start + 1) < 0, name);
    const end = leaf.indexOf("    default:", start);
    assert.ok(end > start, name);
    let body = leaf.slice(start, end);
    if (name === "CommandResult-evaluation") {
      assert.ok(body.endsWith("    }\n"));
      body = body.slice(0, -6); // This switch case is the extraction wrapper.
    }
    const sha256 = createHash("sha256").update(body).digest("hex");
    assert.equal(body.length, original.characters, `${name}: character count`);
    assert.equal(sha256, original.sha256, `${name}: original body bytes`);
    regions[name] = {
      characters: body.length,
      sha256,
      byteIdenticalInLeaf: true,
    };
  }
  const reactor = source("reactor.ts");
  assert.ok(reactor.length <= 92000, "reactor character bound");
  return {
    method:
      "Current leaf bodies checked against the original extraction hashes. Review-notice, metadata-preservation and review-staleness extensions sit outside the three bodies. The CommandResult switch case is a wrapper and is excluded; no body bytes are normalized.",
    procedure: "node docs/evidence/WO-184/check-reactor-move.mjs --check",
    regions,
    reactor: { beforeCharacters: 99655, afterCharacters: reactor.length },
    source:
      "Pre-move body hashes independently confirmed by VER-001 F1; current source files read by this committed check",
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = checkReactorMove();
  const receipt = new URL("reactor-move.json", import.meta.url);
  if (process.argv[2] === "--write")
    writeFileSync(receipt, JSON.stringify(result, null, 2) + "\n");
  else {
    assert.equal(process.argv[2], "--check");
    assert.deepEqual(JSON.parse(readFileSync(receipt, "utf8")), result);
  }
  console.log(
    "Three original bodies byte-identical; reactor within 92,000 characters.",
  );
}
