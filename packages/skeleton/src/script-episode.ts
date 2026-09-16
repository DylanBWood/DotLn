// Disposable supervisor: losing the resident's IPC connection kills the entire
// script process group, including on resident SIGKILL. It never opens a socket.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { StringDecoder } from "node:string_decoder";
import type { ActorSpec } from "./actor-catalog.js";
let child: ReturnType<typeof spawn> | undefined;
let timer: ReturnType<typeof setTimeout>;
let reason = "completed";
let finalize:
  ((code: number | null, signal: string | null) => void) | undefined;
const stop = (why: string) => {
  reason = why;
  if (child?.pid) {
    try {
      process.kill(-child!.pid!, "SIGKILL");
    } catch {}
    // A detached descendant can keep inherited pipes open outside this group.
    // The host deadline does not wait for those pipes or claim to reap it.
    child.stdout?.destroy();
    child.stderr?.destroy();
    finalize?.(null, "SIGKILL");
  } else process.exit(1);
};
process.on("disconnect", () => stop("resident-disconnected"));
process.on("message", (raw: unknown) => {
  const message = raw as { kill?: boolean; spec: ActorSpec; profile: string };
  if (message.kill) {
    stop("operator-return");
    return;
  }
  if (child) return;
  const { spec, profile } = message;
  const hash = createHash("sha256");
  const decoder = new StringDecoder("utf8");
  let firstLine = "";
  let lineDone = false;
  let bytes = 0;
  child = spawn("/usr/bin/sandbox-exec", ["-p", profile, ...spec.command!], {
    cwd: spec.cwd!,
    env: {},
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  timer = setTimeout(() => stop("timeout"), spec.timeoutMs);
  child.stdout!.on("data", (data) => {
    if (settled) return;
    hash.update(data);
    if (!lineDone) {
      firstLine += decoder.write(data);
      lineDone = /[\r\n]/u.test(firstLine) || firstLine.length >= 160;
      firstLine = firstLine.split(/[\r\n]/u)[0]!.slice(0, 160);
    }
    bytes += data.length;
    if (bytes > 65536) stop("output-limit");
  });
  child.stderr!.on("data", (data) => {
    if (settled) return;
    bytes += data.length;
    if (bytes > 65536) stop("output-limit");
  });
  child.on("error", () => {
    reason = "spawn-failed";
  });
  child.on("exit", () => {
    try {
      process.kill(-child!.pid!, "SIGKILL");
    } catch {}
  });
  let settled = false;
  finalize = (exitCode, signal) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    if (!lineDone)
      firstLine = (firstLine + decoder.end())
        .split(/[\r\n]/u)[0]!
        .slice(0, 160);
    // Reap any background descendants even after the declared command exits.
    try {
      process.kill(-child!.pid!, "SIGKILL");
    } catch {}
    const stdoutSha256 = hash.digest("hex");
    const result = {
      exitCode,
      signal,
      stdoutSha256,
      firstLine,
      verified:
        exitCode === 0 &&
        reason === "completed" &&
        stdoutSha256 === spec.expectedStdoutSha256,
      reason:
        exitCode === 0 &&
        reason === "completed" &&
        stdoutSha256 !== spec.expectedStdoutSha256
          ? "output-verification-failed"
          : reason,
    };
    if (process.connected)
      process.send!(result, () => {
        process.disconnect();
        process.exit(0);
      });
    else process.exit(0);
  };
  child.on("close", (exitCode, signal) => finalize!(exitCode, signal));
});
