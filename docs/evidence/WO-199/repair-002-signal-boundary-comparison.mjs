import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];
for (const arm of ["two-immediates", "five-timers"]) {
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP", null]) {
    const root = mkdtempSync(join(tmpdir(), "dotln-signal-boundary-"));
    const marker = join(root, "ready");
    const script = `
      import {spawnSync} from 'node:child_process';
      let handled = null;
      for (const signal of ['SIGINT','SIGTERM','SIGHUP']) process.on(signal,()=>{handled ??= signal;});
      const result = spawnSync('/bin/sh',['-c', ${JSON.stringify(signal ? `touch '${marker}'; sleep 8` : "true")}]);
      const started = performance.now();
      for (let i=0; i<${arm === "two-immediates" ? 2 : 5} && !handled; i++)
        await new Promise(resolve => ${arm === "two-immediates" ? "setImmediate(resolve)" : "setTimeout(resolve,10)"});
      console.log(JSON.stringify({handled,childSignal:result.signal,drainMs:performance.now()-started}));`;
    const child = spawn(
      process.execPath,
      ["--input-type=module", "-e", script],
      { detached: true, stdio: ["ignore", "pipe", "pipe"] },
    );
    let stdout = "",
      stderr = "";
    child.stdout.on("data", (data) => (stdout += data));
    child.stderr.on("data", (data) => (stderr += data));
    const done = new Promise((resolve) =>
      child.once("close", (code) => resolve(code)),
    );
    try {
      if (signal) {
        const deadline = Date.now() + 5000;
        while (!existsSync(marker) && Date.now() < deadline) await sleep(10);
        assert.ok(existsSync(marker));
        await sleep(150);
        process.kill(-child.pid, signal);
      }
      const code = await done;
      assert.equal(code, 0, stderr);
      const result = JSON.parse(stdout);
      assert.equal(result.handled, signal);
      results.push({ arm, signal, ...result });
    } finally {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {}
      rmSync(root, { recursive: true, force: true });
    }
  }
}
console.log(
  JSON.stringify(
    { command: "harness bounded signal-boundary-comparison.mjs", results },
    null,
    2,
  ),
);
