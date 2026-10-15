#!/usr/bin/env node
import { json as prettyJson } from "./lib/helpers.mjs";
import { spawnGit } from "./lib/git.mjs";
import { docPath, findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { observedSpawnSync as spawnSync } from "../packages/skeleton/src/gate-deadlines.mjs";
import { readFileSync, writeFileSync, realpathSync } from "node:fs";
import { join } from "node:path";

// A help text lists effort levels after "choices:" or "possible values:", in
// parentheses, or joined by "|", and may wrap the list across lines. The
// kinds are tried in that order, and lists of one kind by position; the
// first list that names at least one level DotLn knows is the flag's list,
// and every name in it is kept, so a level DotLn does not know yet is
// recorded beside the known ones. A word followed by a colon, such as the
// `default:`, `preset:` or `env:` a commander help prints after its choices,
// ends the list and is never a level name, quoted or not.
const KNOWN_LEVEL = /^(?:none|minimal|low|medium|high|xhigh|max)$/u;
const NAME = String.raw`["']?[a-z][\w-]*(?![\w-])(?!["']?\s*:)["']?`;
const SEPARATOR = String.raw`\s*(?:[,|]\s*(?:or\s+)?|\s+or\s+)\s*`;
const LEVEL_LISTS = [
  new RegExp(
    String.raw`(?:choices|possible values):\s*(${NAME}(?:${SEPARATOR}${NAME})*)`,
    "giu",
  ),
  new RegExp(String.raw`\(\s*(${NAME}(?:${SEPARATOR}${NAME})+)\s*\)`, "gu"),
  new RegExp(String.raw`(${NAME}(?:\s*\|\s*${NAME})+)`, "gu"),
];
const advertisedLevels = (block) =>
  LEVEL_LISTS.flatMap((pattern) => [...block.matchAll(pattern)])
    .map((match) =>
      match[1]
        .split(new RegExp(SEPARATOR, "u"))
        .map((name) => name.replace(/["']/gu, "")),
    )
    .find((names) => names.some((name) => KNOWN_LEVEL.test(name)));

const effortSelectorFromHelp = (name, help) => {
  const flag = name === "copilot-cli" ? "--reasoning-effort" : "--effort";
  const matched = new RegExp(`(?:^|[\\s,])(${flag})(?=\\s|=|$)`, "u").exec(
    help,
  );
  if (!matched)
    return name === "codex-cli" && /--config\b/u.test(help)
      ? {
          classification: "observed",
          control: "-c model_reasoning_effort=<value>",
          values: "unknown",
          source:
            "CLI --help declares the config override; scripts/probe-codex-effort.mjs records this key. This help does not establish accepted effort values or effective effort.",
        }
      : null;
  const start = matched.index + matched[0].length - flag.length;
  const block = help.slice(start).split(/\n(?=\s*-\S)|\n\s*\n/u)[0];
  const values = advertisedLevels(block);
  return {
    classification: "observed",
    control: flag,
    values: values?.length ? [...new Set(values)] : "unknown",
    source:
      "CLI --help; selected effort control, not effective-effort readback",
  };
};

export function probeHarness(name, execute = spawnSync, env = process.env) {
  const fallback = {
    "claude-code": "claude",
    "codex-cli": "codex",
    "copilot-cli": "copilot",
  }[name];
  if (!fallback)
    throw new Error(
      "Unknown harness; select claude-code, codex-cli or copilot-cli",
    );
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
  const effortSelector = effortSelectorFromHelp(name, help.stdout ?? "");
  return {
    classification: "observed",
    value: version,
    observedAt: new Date().toISOString(),
    line: version.split(".").slice(0, 2).join("."),
    probe: {
      versionChannel,
      versionExitCode: versionRun.status,
      helpExitCode: help.status,
      effortSelectorPresent: effortSelector !== null,
      ...(effortSelector ? { effortSelector } : {}),
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
      spawnGit(["rev-parse", "--show-toplevel"], {
        cwd: root,
        encoding: "utf8",
      }).stdout.trim(),
    )
  )
    throw new Error("Discovery requires the Git root");
  const path = docPath(root, "discovery", "environment.json");
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
  // A probe fills an empty record. Over a recorded selector it needs
  // advertised values and either the same control or a record no evidence
  // file backs, so help that shows another flag never replaces a selector a
  // measured probe established.
  const selector = row.probe.effortSelectorPresent && row.probe.effortSelector;
  const recorded = record.sessionEffortSelector;
  if (
    selector &&
    (!recorded ||
      (Array.isArray(selector.values) &&
        (selector.control === recorded.control || !recorded.evidence)))
  )
    record.sessionEffortSelector = selector;
  // CLAUDE_EFFORT is the effort the Claude Code host selected for its own
  // session, not an effective-effort readback (WO-157 item 11, WO-152 D012).
  if (row.probe.readbackChannelPresent)
    record.selectedSessionReadback = {
      classification: "observed",
      channel: "CLAUDE_EFFORT",
      setBy:
        "the Claude Code host for its own session; DotLn never sets it (its transports pass the parent environment through and select effort with --effort)",
      scope: "selected, not effective",
      value: row.observedEffort,
      harnessVersion: row.value,
      observedAt: row.observedAt,
    };
  writeFileSync(path, prettyJson(document));
  return { harness: name, ...row };
}
if (isMainModule(import.meta.url)) {
  try {
    const [action, ...args] = process.argv.slice(2);
    if (action !== "harness" || args.length > 1)
      throw new Error(
        "usage: discover harness [claude-code|codex-cli|copilot-cli]",
      );
    const name =
      args[0] ??
      (process.env.COPILOT_AGENT_SESSION_ID
        ? "copilot-cli"
        : process.env.CLAUDE_CODE_EXECPATH || process.env.CLAUDE_PID
          ? "claude-code"
          : "codex-cli");
    console.log(
      JSON.stringify(discoverHarness(findLaunchpad(), name), null, 2),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
