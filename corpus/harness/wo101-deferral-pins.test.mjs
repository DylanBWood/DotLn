import test from "node:test";
import assert from "node:assert/strict";
import { Program, decideProgram, stepProgram } from "../../packages/kernel/dist/src/index.js";

const predicates = { "always.false": { 1: () => false } };
const env = { now: 0, rngState: 1, predicates };
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
  assert.deepEqual(deferred.map(([kind]) => kind), ["Choose", "All", "Race", "Repeat", "Compensate"]);
  for (const [kind, program] of deferred) {
    const exact = error => error instanceof Error && error.message === `Program ${kind} evaluation is deferred`;
    assert.throws(() => stepProgram(program, {}, env), exact, `${kind} stepProgram deferral drift`);
    assert.throws(() => decideProgram(program, {}, env), exact, `${kind} decideProgram deferral drift`);
  }
});
