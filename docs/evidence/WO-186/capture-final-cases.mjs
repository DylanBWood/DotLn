// Measurement-only preload: observe the gate's existing child stdout events.
// No child command, environment, assertion or emitted stdout is replaced.
import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { appendFileSync } from "node:fs";
const target = process.env.DOTLN_WO186_CASES;
const root = process.env.DOTLN_WO186_CASE_ROOT;
if (
  target &&
  process.cwd() === root &&
  /(?:^|\/)scripts\/test-runner\.mjs$/.test(process.argv[1] ?? "")
) {
  process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS ?? "")
    .replace("--import=" + import.meta.url, "")
    .trim();
  const original = childProcess.spawn;
  childProcess.spawn = function (...args) {
    const child = Reflect.apply(original, this, args);
    let partial = "";
    child.stdout?.on("data", (chunk) => {
      partial += Buffer.isBuffer(chunk)
        ? chunk.toString("utf8")
        : String(chunk);
      const lines = partial.split("\n");
      partial = lines.pop();
      if (partial.length > 1048576) partial = "";
      for (const line of lines) {
        if (!line.startsWith("PROGRESS CASE ")) continue;
        const event = JSON.parse(line.slice("PROGRESS CASE ".length));
        if (
          event.event === "end" &&
          !event.skipped &&
          Number.isFinite(event.durationMs) &&
          (/^packages\/skeleton\/dist\/test\//.test(event.file) ||
            [
              "scripts/test-worktree-integration.mjs",
              "scripts/test-target-publish.mjs",
            ].includes(event.file))
        ) {
          appendFileSync(
            target,
            JSON.stringify({ recordedAt: new Date().toISOString(), ...event }) +
              "\n",
          );
        }
      }
    });
    return child;
  };
  syncBuiltinESMExports();
}
