import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import {
  decodeSourceBundle,
  compileStoryContract,
} from "../../../packages/compiler/dist/src/index.js";
const fixture = JSON.parse(
  readFileSync(
    new URL(
      "../../../packages/compiler/fixtures/wo060-source-bundles.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const bundles = [
  ...fixture.valid.map(({ name, bundle }) => [name, bundle]),
  ...fixture.malformed.map(({ name, bundle }) => [name, bundle]),
  ...fixture.screened.flatMap(({ case: name, bundle, without }) => [
    [`${name}:screened`, bundle],
    [`${name}:clean`, without],
  ]),
  ["limits", fixture.limits.bundle],
];
assert.equal(bundles.length, 35);
const actual = Object.fromEntries(
  bundles.map(([name, bundle]) => {
    const decoded = decodeSourceBundle(bundle, {
      allowedHosts: fixture.allowedHosts,
    });
    const value = decoded.ok ? compileStoryContract(decoded.bundle) : decoded;
    return [
      name,
      {
        admitted: decoded.ok,
        sha256: createHash("sha256")
          .update(JSON.stringify(value))
          .digest("hex"),
      },
    ];
  }),
);
const destination = new URL("compiler-baseline.json", import.meta.url);
if (process.argv[2] === "--capture")
  writeFileSync(destination, JSON.stringify(actual, null, 2) + "\n");
else assert.deepEqual(actual, JSON.parse(readFileSync(destination, "utf8")));
console.log(
  `WO-184: all 35 WO-060 bundle outcomes ${process.argv[2] === "--capture" ? "captured from the pre-edit build" : "match the pre-edit build"}; ${Object.values(actual).filter((item) => item.admitted).length} admitted contracts.`,
);
