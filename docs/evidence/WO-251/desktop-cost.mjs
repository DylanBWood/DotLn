import { permissionEffect } from "../../../packages/skeleton/dist/src/harness-host.js";
const cases = [
  "Read",
  "mcp__computer-use__screenshot",
  "mcp__playwright__browser_snapshot",
];
const iterations = 50000;
const samples = cases.map((tool_name) => {
  const input = { tool_name, tool_input: {} };
  const run = () => {
    try {
      return permissionEffect(input, process.cwd());
    } catch {
      return "unclassified";
    }
  };
  for (let i = 0; i < 5000; i++) run();
  const times = [];
  for (let batch = 0; batch < 7; batch++) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) run();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return {
    tool: tool_name,
    outcome: run(),
    iterations,
    batches: times.length,
    medianBatchMs: times[3],
    medianNsPerCall: (times[3] * 1e6) / iterations,
  };
});
const result = {
  measuredAt: new Date().toISOString(),
  node: process.version,
  scope:
    "permissionEffect only; excludes process startup, runtime pin checks, configuration IO, journaling and host execution",
  samples,
};
console.log(JSON.stringify(result));
