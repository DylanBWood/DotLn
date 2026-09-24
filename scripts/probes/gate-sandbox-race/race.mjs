#!/usr/bin/env node
// WO-157 item 15 (WO-063 D005), opt-in and outside every gate: reproduce the
// gate-sandbox teardown race under load. Runs the WO-140 partial test many
// times at once with two loose objects planted under objects/17 before its
// last commit (the state that makes Git 2.55 start a detached repack), with
// TMPDIR redirected to a directory this script creates. `--unfix` removes the
// landed maintenance.auto=false line in memory to show the race it prevents.
//
//   node scripts/probes/gate-sandbox-race/race.mjs [--runs 200] [--width 10] [--unfix]
import { spawn } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at === -1 ? fallback : Number(args[at + 1]);
};
const runs = option("--runs", 200);
const width = option("--width", 10);
const unfix = args.includes("--unfix");
const repo = fileURLToPath(new URL("../../..", import.meta.url));
const lane = mkdtempSync(join(tmpdir(), "dotln-teardown-race-"));
let started = 0;
let failed = 0;
let enotempty = 0;
const began = Date.now();
const one = () =>
  new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [
        "--test",
        "--test-name-pattern=WO-140 a partial inside-sandbox row",
        "scripts/test-runner.test.mjs",
      ],
      {
        cwd: repo,
        env: {
          ...process.env,
          NODE_OPTIONS: `--import=${new URL("./loader.mjs", import.meta.url).href}`,
          PLANT: "1",
          UNFIX: unfix ? "1" : "0",
          TMPDIR: lane,
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => {
      if (code !== 0) {
        failed += 1;
        if (/ENOTEMPTY/u.test(output)) enotempty += 1;
      }
      resolve();
    });
  });
const worker = async () => {
  while (started < runs) {
    started += 1;
    await one();
  }
};
await Promise.all(Array.from({ length: width }, worker));
const left = readdirSync(lane).filter((name) =>
  name.startsWith("dotln-gate-sandbox-"),
);
console.log(
  JSON.stringify({
    arm: unfix ? "unfixed" : "fixed (as landed)",
    runs,
    concurrency: width,
    failed,
    enotempty,
    leftRoots: left.length,
    seconds: (Date.now() - began) / 1000,
  }),
);
rmSync(lane, { recursive: true, force: true });
