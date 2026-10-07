// VER-007: does a terminal interrupt (SIGINT to the host's whole job) still
// stop a writer launched through runWorkerProcess? Compares the writer launch
// (ownProcessGroup: true, WO-112) with main's non-resident launch (false).
// The writer is a synthetic node process; no native model or forge runs.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = fileURLToPath(new URL("../../../", import.meta.url));

if (process.argv[2] === "host") {
  const [, , , grouped, dir] = process.argv;
  const { runWorkerProcess } = await import(
    pathToFileURL(join(repo, "packages/skeleton/dist/src/worker-transport.js"))
      .href
  );
  // The writer records its pid, then writes a heartbeat for 6 s. The host's
  // deadline is 2.5 s.
  const writer = `
    const fs = require("node:fs");
    fs.writeFileSync(${JSON.stringify(join(dir, "pid"))}, String(process.pid));
    const start = Date.now();
    const t = setInterval(() => {
      fs.writeFileSync(${JSON.stringify(join(dir, "last"))}, String(Date.now() - start));
      if (Date.now() - start > 6000) { clearInterval(t); process.exit(0); }
    }, 100);`;
  const running = runWorkerProcess({
    binary: process.execPath,
    args: ["-e", writer],
    cwd: dir,
    input: "",
    env: process.env,
    timeoutMs: 2500,
    ...(grouped === "true" ? { ownProcessGroup: true } : {}),
  });
  await running.completed.catch(() => undefined);
  process.exit(0);
}

const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function trial(grouped) {
  const dir = mkdtempSync(join(tmpdir(), `dotln-ver007-orphan-${grouped}-`));
  // The host leads its own job, as a terminal's foreground job does.
  const host = spawn(
    process.execPath,
    [fileURLToPath(import.meta.url), "host", grouped, dir],
    { detached: true, stdio: ["ignore", "inherit", "inherit"] },
  );
  for (let i = 0; i < 100 && !existsSync(join(dir, "pid")); i++)
    await sleep(50);
  const writerPid = Number(readFileSync(join(dir, "pid"), "utf8"));
  await sleep(300);
  process.kill(-host.pid, "SIGINT"); // Ctrl-C reaches the whole foreground job
  await sleep(800);
  const hostAliveAfterSigint = alive(host.pid);
  const writerAliveAfterSigint = alive(writerPid);
  await sleep(3500); // past the host's 2.5 s deadline
  const writerAlivePastHostDeadline = alive(writerPid);
  const last = existsSync(join(dir, "last"))
    ? Number(readFileSync(join(dir, "last"), "utf8"))
    : null;
  try {
    process.kill(-writerPid, "SIGKILL");
  } catch {}
  try {
    process.kill(writerPid, "SIGKILL");
  } catch {}
  rmSync(dir, { recursive: true, force: true });
  console.log(
    JSON.stringify({
      ownProcessGroup: grouped === "true",
      hostAliveAfterSigint,
      writerAliveAfterSigint,
      writerAlivePastHostDeadline,
      writerLastHeartbeatMs: last,
    }),
  );
}

await trial("false");
await trial("true");
