#!/usr/bin/env node
import { run } from "node:test";

const name =
  "WO-145 optional economy support preserves historical snapshots through the current release-close role and changes only executor instructions on";
let passed = 0;
let failed = 0;
// A zero-exit test process can have matched no case. Require the oracle's
// own execution event, not a passing file wrapper or reporter summary.
for await (const event of run({
  files: ["scripts/test-process-debt.mjs"],
  testNamePatterns: [`^${name}$`],
})) {
  const { type, data } = event;
  if (type === "test:fail") {
    failed++;
    console.error(data.details.error);
  } else if (
    type === "test:pass" &&
    data.name === name &&
    data.nesting === 0 &&
    data.details.type !== "suite" &&
    (data.skip === undefined || data.skip === false) &&
    (data.todo === undefined || data.todo === false)
  ) {
    passed++;
  }
}
if (passed !== 1 || failed) {
  console.error(
    `Role oracle requires exactly one executed passing case: ${name}; observed ${passed} passes and ${failed} failures. Restore the case and repair its assertions; skipped or TODO cases supply no check.`,
  );
  process.exitCode = 1;
} else console.log(`Role oracle passed: ${name}`);
