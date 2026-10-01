import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { appendFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { BASE, read, ROOT, SEED, sha256 } from "./wo105-common.mjs";

assert.equal(
  process.argv.length,
  2,
  "usage: node corpus/harness/run-wo105.mjs",
);
const transcript = `corpus/manifests/runs/WO-105-${BASE.slice(0, 8)}.log`;
const write = (text) => appendFileSync(resolve(ROOT, transcript), text);
const tests = readdirSync(resolve(ROOT, "corpus/harness"))
  .filter((name) => /^wo105-.*\.test\.mjs$/.test(name))
  .sort()
  .map((name) => `corpus/harness/${name}`);
const commands = [
  ["npm", ["run", "build"]],
  [
    process.execPath,
    ["corpus/harness/generate-store-corpus.mjs", "--seed", SEED, "--check"],
  ],
  [process.execPath, ["corpus/harness/truncation-sweep.mjs", "--seed", SEED]],
  [
    process.execPath,
    ["corpus/harness/generate-tree-corpus.mjs", "--seed", SEED, "--check"],
  ],
  [
    process.execPath,
    ["corpus/harness/generate-golden-corpus.mjs", "--seed", SEED, "--check"],
  ],
  [
    process.execPath,
    ["corpus/harness/skeleton-crash-sweep.mjs", "--seed", SEED],
  ],
  [
    process.execPath,
    ["--test", "--test-concurrency=1", "--test-reporter=tap", ...tests],
  ],
];
write(
  `\nWO-105 corpus verification ${new Date().toISOString()}\nBase ${BASE}; Node ${process.version}; seed ${SEED}\n`,
);
write(
  "Resource profile: NODE_OPTIONS adds --max-old-space-size=512; test files run serially. This bounds V8 old-space, not total process RSS.\n",
);
const harness = readdirSync(resolve(ROOT, "corpus/harness"))
  .filter(
    (name) =>
      name.startsWith("wo105-") ||
      [
        "generate-store-corpus.mjs",
        "generate-tree-corpus.mjs",
        "generate-golden-corpus.mjs",
        "truncation-sweep.mjs",
        "skeleton-crash-sweep.mjs",
        "record-wo105.mjs",
        "run-wo105.mjs",
      ].includes(name),
  )
  .sort();
for (const name of harness)
  write(
    `source sha256 ${sha256(read(`corpus/harness/${name}`))} corpus/harness/${name}\n`,
  );
for (const [command, argv] of commands) {
  const display = `${command === process.execPath ? "node" : command} ${argv.join(" ")}`;
  console.log(`Running ${display}`);
  write(`\n$ ${display}\n`);
  const started = performance.now();
  const code = await new Promise((accept, reject) => {
    const child = spawn(command, argv, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        NODE_OPTIONS:
          `${process.env.NODE_OPTIONS ?? ""} --max-old-space-size=512`.trim(),
      },
    });
    child.stdout.on("data", (data) => write(data));
    child.stderr.on("data", (data) => write(data));
    child.on("error", reject);
    child.on("exit", accept);
  });
  write(
    `Exit ${code}; elapsedMs ${(performance.now() - started).toFixed(3)}\n`,
  );
  assert.equal(code, 0, `failed: ${display}; see ${transcript}`);
}
write("PASS all declared corpus commands\n");
console.log(`PASS ${transcript}`);
