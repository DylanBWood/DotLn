import { readFileSync } from "node:fs";
import { delimiter, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { hostStateRoot } from "./host-resources.mjs";
import { directoryIdentity } from "./target-worktrees.mjs";
import { phaseRoots, resolveOrderWorktrees } from "./order-worktrees.mjs";
import { nativeProfile } from "./drive-prompts.mjs";
import {
  deadlineRefusal,
  launchPhase,
  phaseTimeLimit,
} from "./drive-transport.mjs";

// The outer router's network sandbox also contains its native phase processes.
// These public endpoints cover the native host, documentation CLI and GitHub
// reads; host deny rules and each phase's effect authority still apply.
const nativeDomains = [
  "api.anthropic.com",
  "claude.ai",
  "platform.claude.com",
  "registry.npmjs.org",
  "context7.com",
  "api.github.com",
  "github.com",
  "raw.githubusercontent.com",
];

export function driveHost(
  value = process.env.DOTLN_DRIVE_HOST ??
    (process.env.CODEX_THREAD_ID ? "codex" : "claude"),
) {
  if (!["claude", "codex"].includes(value))
    throw new Error("drive host must be claude or codex");
  return value;
}

// A child's sandbox cannot widen the sandbox of the router shell that starts
// it. Admit the validated pair before that outer native process is launched.
export function nativeLaunchDirectories(launchpad, role, phrase) {
  const directories = [directoryIdentity(launchpad), hostStateRoot()];
  if (role === "router") {
    const match = /^drive: (WO-\d{3})$/.exec(phrase);
    if (!match) throw new Error("native router requires exactly drive: WO-NNN");
    directories.push(...resolveOrderWorktrees(launchpad, match[1]).roots);
  }
  return [...new Set(directories)];
}

export async function launchRole({
  host,
  launchpad,
  role,
  definition,
  definitions,
  worker,
  dollarLimit = null,
  phrase,
  cwd,
  env,
  timeoutMs,
  deadlineAt,
  beforeLaunch,
  onSpawn,
  onSession,
  onSubagent,
  onCommand,
  signal,
}) {
  let episode;
  let result;
  let args;
  try {
    const directories = nativeLaunchDirectories(launchpad, role, phrase);
    const profile = nativeProfile({
      launchpad,
      role,
      phrase,
      cwd,
      worker,
      definition,
    });
    const nativeEnv = { ...env, ...profile.env };
    if (host === "codex") {
      const adapter = await import(
        pathToFileURL(
          join(launchpad, "packages/skeleton/dist/src/worker-transport.js"),
        )
      );
      episode = adapter.startCodexEpisode(nativeEnv);
      args = adapter.codexExecArgv({
        rest: [
          "--approve-for-me",
          "-c",
          "sandbox_workspace_write.network_access=true",
          "-c",
          // Set the tool environment too: a nested shell can select an older
          // Node even after the native process's PATH has been prefixed.
          `shell_environment_policy.set.PATH=${JSON.stringify([dirname(process.execPath), nativeEnv.PATH].filter(Boolean).join(delimiter))}`,
          "-c",
          `web_search=${JSON.stringify(profile.webSearch)}`,
          "--model",
          definition.model,
          "--json",
          ...directories.flatMap((directory) => ["--add-dir", directory]),
          "-c",
          `model_reasoning_effort=${JSON.stringify(definition.effort)}`,
          "-c",
          `developer_instructions=${JSON.stringify(profile.codexInstructions)}`,
          "-c",
          "mcp_servers={}",
          "-c",
          "memories.use_memories=false",
          "-c",
          "memories.generate_memories=false",
          phrase,
        ],
      });
    } else {
      args = [
        "--print",
        "--session-id",
        worker,
        "--no-session-persistence",
        "--agents",
        definitions,
        "--agent",
        `dotln-${role}`,
        "--add-dir",
        ...directories,
        "--model",
        definition.model,
        "--effort",
        definition.effort,
        "--append-system-prompt",
        profile.claudeAppendix,
        "--setting-sources",
        "user,project,local",
        "--settings",
        JSON.stringify({
          autoMemoryEnabled: false,
          attribution: { commit: "", pr: "" },
          sandbox: {
            network: {
              allowedDomains: nativeDomains,
            },
          },
        }),
        "--strict-mcp-config",
        "--mcp-config",
        '{"mcpServers":{}}',
        "--tools",
        profile.tools,
        "--allowedTools",
        profile.tools,
        "--permission-prompts",
        "none",
        "--output-format",
        "stream-json",
        "--verbose",
        "--include-hook-events",
        ...(dollarLimit === null
          ? []
          : ["--max-budget-usd", String(dollarLimit)]),
        phrase,
      ];
    }
    // Imports and isolation setup consume the absolute drive deadline too.
    if (phaseTimeLimit(null, timeoutMs, deadlineAt) === 0) {
      result = { ...deadlineRefusal };
      return result;
    }
    result = beforeLaunch?.();
    if (result?.refused) return result;
    result = await launchPhase({
      command: host,
      protocol: host,
      launcherCommand: profile.routerCommand,
      args,
      cwd,
      launchpad,
      env: { ...(episode?.env ?? nativeEnv), DOTLN_DRIVE_HOST: host },
      timeoutMs,
      deadlineAt,
      onSpawn,
      onSession,
      onSubagent,
      onCommand,
      signal,
    });
    if (host === "codex")
      result.selectedPolicy = {
        sandbox: "workspace-write",
        approval: "automatic-review",
        networkAccess: "enabled-for-native-workers-and-phase-tools",
        nativeLauncher: profile.nativeLauncher,
        gitMetadataWrites: "one-command-host-permission-request",
        webSearch: profile.webSearch,
        nodeRuntime: {
          version: process.version,
          source: "launcher-selected-via-tool-environment",
        },
        source: "launch-arguments",
      };
    else
      result.selectedPolicy = {
        sandbox: "inherited-host-policy",
        networkAccess: "native-api-context7-and-public-github-domains",
        nativeLauncher: profile.nativeLauncher,
        webTools: !profile.router,
        sessionPersistence: "disabled",
        source: "launch-arguments",
      };
    return result;
  } finally {
    const isolation = episode?.finish();
    if (result && isolation) result.isolation = isolation;
  }
}

// Called by the native Codex phase, never by its router or a review child.
export async function enterDrivenWorker(root) {
  const file = process.env.DOTLN_DRIVEN_WORKER;
  const thread = process.env.CODEX_THREAD_ID;
  if (!file || !thread)
    throw new Error("driven native session context required");
  const context = JSON.parse(readFileSync(file, "utf8"));
  if (context.nativeSessionId !== thread)
    throw new Error("worker entry belongs to another native session");
  const trees = resolveOrderWorktrees(root, context.workOrder);
  const close = context.role === "release-close";
  if (directoryIdentity(process.cwd()) !== (close ? trees.main : trees.cwd))
    throw new Error(
      "worker entry cwd differs from its registered role worktree",
    );
  const host = await import(
    pathToFileURL(join(root, "packages/skeleton/dist/src/harness-host.js"))
  );
  const roots = close ? [[trees.main, trees.main]] : phaseRoots(trees, trees);
  const entered = [];
  try {
    for (const [checkout, runtime] of roots) {
      host.beginCodexPhase(
        checkout,
        runtime,
        thread,
        context.role,
        close ? trees.main : trees.launchpad,
      );
      entered.push([checkout, runtime]);
    }
  } catch (error) {
    for (const [checkout, runtime] of entered)
      host.releasePhaseWriter(checkout, runtime, thread);
    throw error;
  }
  return {
    role: context.role,
    workOrder: context.workOrder,
    writerRoots: roots.length,
    source: "native-codex-phase-entry",
  };
}
