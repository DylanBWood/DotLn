import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// An owned root and child deliberately survive their owner's SIGKILL.
// This exercises recovery even when Chromium closes its own descendants.
const mode = process.argv[2] ?? "owner";
setInterval(() => {}, 1000);
if (mode === "leaf") {
  process.send({ pid: process.pid });
} else {
  const child = spawn(
    process.execPath,
    [fileURLToPath(import.meta.url), mode === "owner" ? "root" : "leaf"],
    { stdio: ["ignore", "ignore", "ignore", "ipc"] },
  );
  child.once("message", (message) =>
    process.send({ pid: process.pid, child: message }),
  );
}
if (mode === "owner")
  process.on("message", () => {
    process.title = "wo059-renamed-owner";
    process.send({ renamed: true });
  });
