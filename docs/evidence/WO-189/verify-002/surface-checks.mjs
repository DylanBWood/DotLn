import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../../..");
const commands = [
  ["node", ["docs/evidence/WO-189/inventory-check.mjs"]],
  [
    "node",
    [
      "docs/evidence/WO-189/inventory-check.mjs",
      "--readme",
      "docs/evidence/WO-189/candidate-2000.md",
    ],
  ],
  [
    "node",
    [
      "docs/evidence/WO-189/inventory-check.mjs",
      "--readme",
      "docs/evidence/WO-189/candidate-3000.md",
    ],
  ],
  ["npm", ["run", "publication:check"]],
  ["npm", ["run", "release", "--", "check-surfaces", "--local"]],
];
const runs = [];
for (const [program, args] of commands) {
  const before = Date.now();
  const result = spawnSync(program, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  runs.push({
    command: [program, ...args],
    exitCode: result.status,
    durationMs: Date.now() - before,
    output: result.stdout,
    error: result.stderr,
  });
}
console.log(
  JSON.stringify({ cutoff: new Date().toISOString(), runs }, null, 2),
);
if (runs.some((row) => row.exitCode !== 0)) process.exitCode = 1;
