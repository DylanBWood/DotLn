#!/usr/bin/env node
import { observedSpawnSync as spawnSync } from "../packages/skeleton/src/gate-deadlines.mjs";
import { readFileSync, writeFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export function probeHarness(name, execute = spawnSync, env = process.env) {
  const fallback = { "claude-code": "claude", "codex-cli": "codex" }[name];
  if (!fallback)
    throw new Error("Unknown harness; select claude-code or codex-cli");
  const running = name === "claude-code" ? env.CLAUDE_CODE_EXECPATH : undefined;
  const command = running || fallback;
  const versionChannel = running ? "CLAUDE_CODE_EXECPATH" : "PATH";
  const versionRun = execute(command, ["--version"], {
    encoding: "utf8",
    timeout: 5000,
    env,
  });
  const version = versionRun.stdout?.match(/\b(\d+\.\d+\.\d+)\b/)?.[1];
  if (versionRun.status !== 0 || !version)
    throw new Error(
      `Harness version probe failed (${versionRun.status ?? "unavailable"})`,
    );
  const help = execute(command, ["--help"], {
    encoding: "utf8",
    timeout: 5000,
    env,
  });
  if (help.status !== 0)
    throw new Error(
      `Harness selector probe failed (${help.status ?? "unavailable"})`,
    );
  const effort = name === "claude-code" ? env.CLAUDE_EFFORT : undefined;
  const hasReadback = ["low", "medium", "high", "xhigh", "max"].includes(
    effort,
  );
  return {
    classification: "observed",
    value: version,
    observedAt: new Date().toISOString(),
    line: version.split(".").slice(0, 2).join("."),
    probe: {
      versionChannel,
      versionExitCode: versionRun.status,
      helpExitCode: help.status,
      effortSelectorPresent: /--effort\b/.test(help.stdout ?? ""),
      configSelectorPresent: /--config\b/.test(help.stdout ?? ""),
      readbackChannel: name === "claude-code" ? "CLAUDE_EFFORT" : "unavailable",
      readbackChannelPresent: hasReadback,
    },
    ...(hasReadback ? { observedEffort: effort } : {}),
  };
}

export function discoverHarness(root, name, probe = probeHarness) {
  if (
    realpathSync(root) !==
    realpathSync(
      spawnSync("git", ["rev-parse", "--show-toplevel"], {
        cwd: root,
        encoding: "utf8",
      }).stdout.trim(),
    )
  )
    throw new Error("Discovery requires the Git root");
  const path = join(root, "docs/discovery/environment.json");
  const document = JSON.parse(readFileSync(path, "utf8"));
  const row = probe(name);
  const record = document.effortReadbackProbe.harnesses[name];
  if (!record) throw new Error("No declared harness discovery record");
  record.versions.push(row);
  const lines = (record.versionLines ??= []);
  lines.push({
    classification: "observed",
    line: row.line,
    newestPatch: row.value,
    observedAt: row.observedAt,
    source: `bounded-cli-probe:${row.probe.versionChannel}`,
  });
  if (row.probe.effortSelectorPresent)
    record.sessionEffortSelector = {
      classification: "observed",
      control: "--effort",
      values: ["low", "medium", "high", "xhigh", "max"],
    };
  if (row.probe.readbackChannelPresent)
    record.effectiveEffortReadback = {
      classification: "observed",
      channel: "CLAUDE_EFFORT",
      harnessReadbackEligible: true,
      value: row.observedEffort,
      observedAt: row.observedAt,
    };
  writeFileSync(path, JSON.stringify(document, null, 2) + "\n");
  return { harness: name, ...row };
}
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  try {
    const [action, ...args] = process.argv.slice(2);
    if (action !== "harness" || args.length > 1)
      throw new Error("usage: discover harness [claude-code|codex-cli]");
    const name =
      args[0] ??
      (process.env.CLAUDE_CODE_EXECPATH || process.env.CLAUDE_PID
        ? "claude-code"
        : "codex-cli");
    console.log(
      JSON.stringify(
        discoverHarness(
          resolve(dirname(fileURLToPath(import.meta.url)), ".."),
          name,
        ),
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
