import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { delimiter, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { DRIVE_SANDBOX_ELECTIONS } from "./config.mjs";
import { hostStateRoot } from "./host-resources.mjs";
import { directoryIdentity } from "./target-worktrees.mjs";
import { phaseRoots, resolveOrderWorktrees } from "./order-worktrees.mjs";
import { drivenStartBytes, nativeProfile } from "./drive-prompts.mjs";
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

// The instance's sandbox election, mapped to the launch form each host
// documents (WO-247-D006). `host` keeps the host's own policy. `off` is
// Codex's full-access form, `--sandbox danger-full-access` with its headless
// default of no approvals, which cannot be combined with automatic review; on
// Claude it is `sandbox.enabled false` supplied through `--settings`, which
// ranks above the checkout's local settings. Each row records what its form
// selects; a host without a row for the election refuses before any launch.
// The table is frozen through its rows, arrays included: a launch copies what
// it takes, and nothing can widen a later launch's form.
const frozen = (value) => {
  for (const inner of Object.values(value))
    if (inner && typeof inner === "object") frozen(inner);
  return Object.freeze(value);
};
export const SANDBOX_FORMS = frozen({
  codex: {
    host: {
      argv: [
        "--approve-for-me",
        "-c",
        "sandbox_workspace_write.network_access=true",
      ],
      selected: {
        sandbox: "workspace-write",
        approval: "on-request",
        reviewer: "auto-review",
        networkAccess: "enabled-for-native-workers-and-phase-tools",
        gitMetadataWrites: "one-command-host-permission-request",
      },
    },
    off: {
      argv: ["--sandbox", "danger-full-access"],
      selected: {
        sandbox: "danger-full-access",
        approval: "never",
        reviewer: "none",
        networkAccess: "unsandboxed",
        gitMetadataWrites: "no-approval-under-full-access",
      },
    },
  },
  claude: {
    host: {
      settings: {},
      selected: {
        sandbox: "inherited-host-policy",
        networkAccess: "native-api-context7-and-public-github-domains",
      },
    },
    off: {
      settings: { enabled: false },
      selected: {
        sandbox: "disabled-by-launch-settings",
        networkAccess: "unrestricted-by-the-disabled-launch-sandbox",
      },
    },
  },
});
export function sandboxLaunchForm(host, election) {
  const forms = Object.hasOwn(SANDBOX_FORMS, host) ? SANDBOX_FORMS[host] : null;
  if (forms && Object.hasOwn(forms, election)) return forms[election];
  throw new Error(
    `drive.sandbox ${JSON.stringify(election)} has no documented launch form on host ${JSON.stringify(host)}; the election refuses before launch`,
  );
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

// A declined or failed Codex phase keeps its isolated home's session files
// beside the drive record before the episode removes that home: the rollouts
// under sessions/ and their index, nothing else the home holds and never the
// auth link (WO-247-D003). A copy that fails records its cause and leaves the
// phase's result intact.
const RETAINED_CODEX_HOME_ENTRIES = ["sessions", "session_index.jsonl"];
export function retainCodexHome(home, capture) {
  if (!home || !existsSync(home)) return null;
  const destination = join(capture.directory, `${capture.name}.codex-home`);
  const source = "isolated-codex-home-sessions";
  try {
    mkdirSync(destination, { recursive: true, mode: 0o700 });
    let entries = 0;
    for (const name of RETAINED_CODEX_HOME_ENTRIES) {
      if (!existsSync(join(home, name))) continue;
      cpSync(join(home, name), join(destination, name), {
        recursive: true,
        verbatimSymlinks: true,
      });
      entries++;
    }
    return { path: destination, entries, source };
  } catch (error) {
    return {
      path: null,
      entries: 0,
      source,
      failed: error.code ?? "copy-failed",
    };
  }
}

// What the Codex host itself applied, read from the phase's own rollout in the
// isolated home: its first turn_context names the sandbox and approval policy
// the host resolved, which the --json stream never reports (WO-247-D006).
export function codexObservedPolicy(home, sessionId) {
  const unobserved = (sandboxSource) => ({
    sandbox: null,
    approval: null,
    reviewer: null,
    sandboxSource,
  });
  const sessions = home ? join(home, "sessions") : null;
  if (!sessions || !sessionId || !existsSync(sessions))
    return unobserved("codex-session-rollout-absent");
  const rollout = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        const found = rollout(path);
        if (found) return found;
      } else if (entry.isFile() && entry.name.endsWith(`-${sessionId}.jsonl`))
        return path;
    }
    return null;
  };
  let file = null;
  try {
    file = rollout(sessions);
    if (!file) return unobserved("codex-session-rollout-absent");
    for (const line of readFileSync(file, "utf8").split("\n")) {
      if (!line.includes('"turn_context"')) continue;
      const row = JSON.parse(line);
      if (row?.type !== "turn_context") continue;
      const payload = row.payload ?? {};
      const text = (value) => (typeof value === "string" ? value : null);
      return {
        sandbox: text(payload.sandbox_policy?.type),
        approval: text(payload.approval_policy),
        reviewer: text(payload.approvals_reviewer),
        sandboxSource: "codex-session-turn-context",
      };
    }
  } catch {
    return unobserved("codex-session-rollout-unreadable");
  }
  return unobserved("codex-session-turn-context-absent");
}

// The Claude print session's argv, with the sandbox form the election maps
// to inside its one-session settings; exported so the form is testable
// without launching a host.
export function claudeLaunchArgs({
  worker,
  definitions,
  role,
  directories,
  definition,
  profile,
  form,
  dollarLimit,
  phrase,
}) {
  return [
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
        ...form.settings,
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
    ...(dollarLimit === null ? [] : ["--max-budget-usd", String(dollarLimit)]),
    phrase,
  ];
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
  capture,
  sandbox,
}) {
  if (!DRIVE_SANDBOX_ELECTIONS.includes(sandbox))
    throw new Error(
      `launchRole requires the drive's sandbox election, ${DRIVE_SANDBOX_ELECTIONS.join(" or ")}; the drive reads it once from the launchpad's configuration`,
    );
  let episode;
  let result;
  let args;
  try {
    const directories = nativeLaunchDirectories(launchpad, role, phrase);
    const form = sandboxLaunchForm(host, sandbox);
    const profile = nativeProfile({
      launchpad,
      role,
      phrase,
      cwd,
      worker,
      definition,
      sandbox,
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
        // Session files stay in the isolated home until the episode ends, so
        // a declined phase can be retained with the reason the host gave it.
        ephemeral: false,
        rest: [
          ...form.argv,
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
    } else
      args = claudeLaunchArgs({
        worker,
        definitions,
        role,
        directories,
        definition,
        profile,
        form,
        dollarLimit,
        phrase,
      });
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
      capture,
    });
    if (host === "codex" && result.retained)
      result.retained = {
        ...result.retained,
        codexHome: retainCodexHome(episode?.env?.CODEX_HOME, capture),
      };
    result.selectedPolicy = {
      sandboxElection: sandbox,
      ...form.selected,
      nativeLauncher: profile.nativeLauncher,
      ...(host === "codex"
        ? {
            webSearch: profile.webSearch,
            nodeRuntime: {
              version: process.version,
              source: "launcher-selected-via-tool-environment",
            },
          }
        : { webTools: !profile.router, sessionPersistence: "disabled" }),
      source: "launch-arguments",
    };
    // What the host itself applied, kept apart from the selection: Codex
    // names its resolved sandbox and approval policy in the phase's own
    // rollout, and Claude's init row names its permission mode; neither
    // stream reports more.
    result.observedPolicy =
      host === "codex"
        ? {
            ...codexObservedPolicy(episode?.env?.CODEX_HOME, result.sessionId),
            permissionMode: null,
            permissionModeSource: "not-exposed-by-native-json-stream",
          }
        : {
            sandbox: null,
            sandboxSource: "not-exposed-by-native-stream",
            permissionMode: result.nativeReadback?.permissionMode ?? null,
            permissionModeSource: "native-init-row",
          };
    result.drivenStart = drivenStartBytes({ launchpad, host, role, profile });
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
