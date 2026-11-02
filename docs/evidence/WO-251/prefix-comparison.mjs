import assert from "node:assert/strict";
import { desktopControlToolPrefixes as prefixes } from "../../../packages/compiler/dist/src/harness.js";
const started = performance.now();
const regexp = new RegExp(
  `^(?:${prefixes.map((prefix) => prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
);
const direct = (name) => prefixes.some((prefix) => name.startsWith(prefix));
const regex = (name) => regexp.test(name);
const names = [
  "Read",
  "Bash",
  "Skill",
  "mcp__playwright__browser_snapshot",
  ...prefixes.flatMap((prefix) => [
    prefix,
    `${prefix}click`,
    `${prefix.slice(0, -1)}!`,
    `x${prefix}`,
  ]),
];
for (const name of names) assert.equal(direct(name), regex(name), name);
const iterations = 200000;
const arms = [];
for (const [name, match] of [
  ["prefix-array", direct],
  ["compiled-regexp", regex],
]) {
  let matched = 0;
  for (let i = 0; i < 20000; i++)
    matched += Number(match(names[i % names.length]));
  const samples = [];
  for (let batch = 0; batch < 7; batch++) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++)
      matched += Number(match(names[i % names.length]));
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  arms.push({
    name,
    iterations,
    samplesMs: samples,
    medianNsPerCall: (samples[3] * 1e6) / iterations,
    matched,
  });
}
const result = {
  measuredAt: new Date().toISOString(),
  node: process.version,
  wallMs: performance.now() - started,
  inputNames: names,
  arms,
  equivalence: "all named positive and near-miss cases agree",
  scope:
    "in-process prefix matching only; not aggregate session or hook-process latency",
};
console.log(JSON.stringify(result));
