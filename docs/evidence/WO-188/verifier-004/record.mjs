import { spawnSync } from "node:child_process";
import { appendFileSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const [label, command, ...args] = process.argv.slice(2);
if (!label || !command) throw new Error("label and command required");
const receipt = fileURLToPath(new URL("checks.txt", import.meta.url));
const sanitize = (value) =>
  value
    .replaceAll(process.cwd(), "<worktree>")
    .replaceAll(realpathSync(tmpdir()), "<tmp>")
    .replaceAll(tmpdir(), "<tmp>")
    .replace(/\/Users\/[^\s'"<>]+/gu, "<home-path>");
const started = Date.now();
const start = {
  label,
  command: [command, ...args],
  startedAt: new Date(started).toISOString(),
};
appendFileSync(receipt, "START " + sanitize(JSON.stringify(start)) + "\n");
const result = spawnSync(command, args, {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 600000,
  maxBuffer: 64 * 1024 * 1024,
});
const output = sanitize((result.stdout ?? "") + (result.stderr ?? ""));
const end = {
  label,
  exit: result.status,
  signal: result.signal,
  error: result.error?.message,
  durationMs: Date.now() - started,
  finishedAt: new Date().toISOString(),
};
appendFileSync(
  receipt,
  output + "\nEND " + sanitize(JSON.stringify(end)) + "\n\n",
);
process.stdout.write(output.split("\n").slice(-45).join("\n") + "\n");
console.log(JSON.stringify(end));
process.exitCode = result.status ?? 1;
