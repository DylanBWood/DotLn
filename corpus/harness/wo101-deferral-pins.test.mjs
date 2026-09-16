import test from "node:test";
import assert from "node:assert/strict";
import {
  Program,
  decodeContinuation,
} from "../../packages/kernel/dist/src/index.js";

const ref = { registryId: "always.false", version: 1 };

// WO-101 DEFERRED PROGRAM PINS. Keep all five arrive-on-contact deferral
// assertions in this one file so a later semantics work order can retire them
// without searching through the generated corpus harness.
const deferred = [
  ["Choose", Program.Choose("policy", [Program.Done()])],
  ["All", Program.All([Program.Done()])],
  ["Race", Program.Race([Program.Done()])],
  ["Repeat", Program.Repeat(Program.Done(), ref)],
  ["Compensate", Program.Compensate(Program.Done(), Program.Done())],
];

test("WO-101 pins exactly the five deferred Program kinds and no semantics", () => {
  assert.deepEqual(
    deferred.map(([kind]) => kind),
    ["Choose", "All", "Race", "Repeat", "Compensate"],
  );
  for (const [kind, program] of deferred) {
    for (const [value, path] of [
      [program, "$.kind"],
      [Program.Sequence([Program.Done(), program]), "$.programs[1].kind"],
    ]) {
      const decoded = decodeContinuation(value);
      assert.equal(decoded.ok, false);
      assert.equal(decoded.code, "DEFERRED_PROGRAM_KIND");
      assert.equal(decoded.path, path);
      assert.match(decoded.message, new RegExp(kind));
    }
  }
});
