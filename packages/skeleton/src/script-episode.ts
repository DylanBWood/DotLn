// Disposable supervisor: losing the resident's IPC connection kills the entire
// script process group, including on resident SIGKILL. It never opens a socket.
import { realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverySandbox } from "./discovery-sandbox.js";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { StringDecoder } from "node:string_decoder";
import {
  decodeDiscoveryReport,
  type DiscoveryReport,
} from "./work-candidate.js";
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
  const message = raw as {
    kill?: boolean;
    spec: ActorSpec;
    profile: string;
    context?: { residentStore: string; episodeId: string };
  };
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
  const chunks: Buffer[] = [];
  let command = spec.command!;
  let sandbox = profile;
  // macOS cannot install a second sandbox inside an already sandboxed process.
  // Only the pinned producer gets this private entry; arbitrary script actors
  // retain the ordinary network-denying profile and never choose a fallback.
  const cli = fileURLToPath(new URL("./discovery-cli.js", import.meta.url));
  if (
    spec.outputContract === "work-candidates-v1" &&
    command[0] === process.execPath &&
    command[1] === cli &&
    command[2] === spec.cwd &&
    (command.length === 3 || command.length === 4)
  ) {
    const root = realpathSync(spec.cwd!);
    if (root !== spec.cwd)
      throw new Error("discovery actor needs a canonical target");
    const repository = fileURLToPath(new URL("../../../../", import.meta.url));
    sandbox = discoverySandbox(root, [
      join(repository, "packages"),
      join(repository, "node_modules"),
      join(repository, "package.json"),
    ]);
    command = [
      command[0],
      fileURLToPath(new URL("./discovery-actor.js", import.meta.url)),
      ...command.slice(2),
    ];
  }
  child = spawn("/usr/bin/sandbox-exec", ["-p", sandbox, ...command], {
    cwd: spec.cwd!,
    env: message.context
      ? {
          DOTLN_RESIDENT_STORE: message.context.residentStore,
          DOTLN_RESIDENT_EPISODE_ID: message.context.episodeId,
        }
      : {},
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  timer = setTimeout(() => stop("timeout"), spec.timeoutMs);
  child.stdout!.on("data", (data) => {
    if (settled) return;
    hash.update(data);
    if (spec.outputContract && bytes + data.length <= 65536) chunks.push(data);
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
    let discovery: DiscoveryReport | undefined;
    if (spec.outputContract && exitCode === 0 && reason === "completed") {
      try {
        const stdout = Buffer.concat(chunks).toString("utf8");
        discovery = decodeDiscoveryReport(JSON.parse(stdout));
        if (stdout !== JSON.stringify(discovery) + "\n")
          throw new Error("noncanonical discovery output");
      } catch {
        discovery = undefined;
        reason = "output-verification-failed";
      }
    }
    const matches = spec.outputContract
      ? discovery !== undefined
      : stdoutSha256 === spec.expectedStdoutSha256;
    const result = {
      ...(discovery ? { discovery } : {}),
      exitCode,
      signal,
      stdoutSha256,
      firstLine,
      verified: exitCode === 0 && reason === "completed" && matches,
      reason:
        exitCode === 0 && reason === "completed" && !matches
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
