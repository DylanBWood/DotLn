// Each native worker has a short-lived supervisor. Its IPC connection is the
// owning driver's lifetime: even a killed driver cannot leave its phase alive.
import { spawn } from "node:child_process";

let child;
let timer;
let stopping = false;
const killGroup = (signal) => {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, signal);
  } catch {}
};
const stop = () => {
  stopping = true;
  if (!child) return process.exit(1);
  killGroup("SIGTERM");
  timer ??= setTimeout(() => killGroup("SIGKILL"), 5000);
};
process.on("disconnect", stop);
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
process.on("message", (message) => {
  if (message.type === "stop") return stop();
  if (message.type !== "launch" || child || stopping) return;
  // A supervisor may start after its parent's timer has elapsed. Check the
  // absolute bound before creating the native process, even with queued IPC.
  if (message.deadlineAt != null && Date.now() >= message.deadlineAt) {
    stopping = true;
    if (process.connected)
      process.send({ type: "deadline-expired" }, () => process.exit(1));
    else process.exit(1);
    return;
  }
  child = spawn(message.command, message.args, {
    cwd: message.cwd,
    env: { ...process.env, DOTLN_DRIVE_PARENT_PID: String(process.pid) },
    stdio: ["ignore", "inherit", "inherit"],
    detached: true,
  });
  child.on("error", () => {
    if (process.connected) process.send({ type: "launch-error" });
  });
  child.on("close", (code, signal) => {
    clearTimeout(timer);
    killGroup("SIGKILL");
    if (process.connected)
      process.send({ type: "ended", code, signal }, () =>
        process.exit(code ?? 1),
      );
    else process.exit(code ?? 1);
  });
  if (child.pid && process.connected)
    process.send({ type: "spawned", pid: child.pid });
});
