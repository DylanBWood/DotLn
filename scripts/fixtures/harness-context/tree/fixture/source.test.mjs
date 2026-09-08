import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
assert.match(readFileSync("fixture/source.ts", "utf8"), /fixtureValue = 1/);
