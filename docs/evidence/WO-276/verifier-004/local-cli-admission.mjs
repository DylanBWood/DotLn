// Read-only help check for the installed executable used by the synthetic cleanup probe.
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const installedSubpath =
  ".codex/packages/app-server-daemon/releases/0.169.0-aarch64-apple-darwin/bin/codex";
const result = spawnSync(join(homedir(), installedSubpath), ["--help"], {
  encoding: "utf8",
  timeout: 10000,
});
const output = result.stdout ?? "";
const evidence = {
  installedSubpath,
  command: "codex --help (absolute installed executable)",
  exitCode: result.status,
  interactiveUsage: output.includes("[PROMPT]"),
  execCommand: /^\s+exec\s/mu.test(output),
  helpLines: output
    .split("\n")
    .filter(
      (line) =>
        line.startsWith("Usage:") ||
        /^\s+exec\s/mu.test(line) ||
        line.includes("interactive CLI"),
    ),
  limits:
    "Help only. No worker, model request or active session was launched. No process was signalled.",
};
writeFileSync(process.argv[2], JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence));
if (result.status !== 0 || !evidence.interactiveUsage || !evidence.execCommand)
  process.exitCode = 1;
