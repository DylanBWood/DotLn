// Measurement-only preload. Retain the runner's existing full case events
// before its human progress output is bounded; assertions and commands stay unchanged.
import { appendFileSync } from "node:fs";
const target = process.env.DOTLN_WO186_CASES;
const root = process.env.DOTLN_WO186_CASE_ROOT;
if (target && process.cwd() === root && process.execArgv.includes("--test")) {
  // Only the top-level test reporter needs this observer. Do not carry this
  // measurement preload into fixture subprocesses or their confinement probes.
  process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS ?? "")
    .replace("--import=" + import.meta.url, "")
    .trim();
  const original = process.stdout.write;
  let partial = "";
  process.stdout.write = function (chunk, ...args) {
    partial += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
    const lines = partial.split("\n");
    partial = lines.pop();
    if (partial.length > 1048576) partial = "";
    for (const line of lines) {
      if (!line.startsWith("PROGRESS CASE ")) continue;
      try {
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
        )
          appendFileSync(
            target,
            JSON.stringify({ recordedAt: new Date().toISOString(), ...event }) +
              "\n",
          );
      } catch (error) {
        // A malformed candidate is still passed unchanged to the runner's parser.
        if (error.code) throw error;
      }
    }
    return original.call(this, chunk, ...args);
  };
}
