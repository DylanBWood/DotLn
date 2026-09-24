import { docPath } from "./config.mjs";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { containedRegularFile } from "./paths.mjs";

// Source-only: startup and close must diagnose a missing build before importing it.
const hash = (text) => {
  let value = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(text)) {
    value ^= BigInt(byte);
    value = BigInt.asUintN(64, value * 0x100000001b3n);
  }
  return `fnv1a64:${value.toString(16).padStart(16, "0")}`;
};
export function harnessRuntimeCause(root) {
  const manifest = join(root, ".claude/harness-manifest.json");
  // A fixture or consumer that has never installed hooks has no pins to compare.
  if (!existsSync(manifest)) return null;
  try {
    const profiles = JSON.parse(readFileSync(manifest, "utf8")).profiles;
    if (!Array.isArray(profiles) || !profiles.length)
      return "runtime-unavailable";
    for (const entry of profiles) {
      const runtime = entry.profile?.runtime;
      if (!runtime?.files?.length) return "runtime-unavailable";
      for (const file of runtime.files) {
        if (
          !/^packages\/(?:compiler|skeleton)\/dist\/src\/[A-Za-z0-9_-]+\.(?:js|mjs)$/.test(
            file.path,
          )
        )
          return "runtime-unavailable";
        const built = join(root, file.path);
        if (!containedRegularFile(built, root)) return "runtime-unavailable";
        if (hash(readFileSync(built, "utf8")) !== file.hash)
          return "pins-differ";
      }
      if (runtime.snapshot) {
        if (!/^\.runtime\/harness\/[a-f0-9]{16}$/.test(runtime.snapshot))
          return "runtime-unavailable";
        for (const directory of [
          ".runtime",
          ".runtime/harness",
          runtime.snapshot,
        ])
          if (
            existsSync(join(root, directory)) &&
            lstatSync(join(root, directory)).isSymbolicLink()
          )
            return "runtime-unavailable";
        for (const file of runtime.files) {
          const saved = join(root, runtime.snapshot, file.path);
          if (!containedRegularFile(saved, root)) return "snapshot-missing";
          if (hash(readFileSync(saved, "utf8")) !== file.hash)
            return "pins-differ";
        }
      }
    }
    return null;
  } catch {
    return "runtime-unavailable";
  }
}

export function reportHarnessRuntime(root) {
  const cause = harnessRuntimeCause(root);
  if (cause)
    process.stderr.write(
      `DotLn advisory: ${cause}; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide.\n`,
    );
  return cause;
}

// Optional information must not become a startup dependency or admission check.
export async function codexSessionReport(root) {
  try {
    const { currentCodexSession, renderCodexSession, usageReadbackLine } =
      await import("../../packages/skeleton/src/usage-observation.mjs");
    const session = currentCodexSession(root);
    const thread = process.env.CODEX_THREAD_ID;
    return {
      session,
      text: `${renderCodexSession(session)}${thread ? `\n${usageReadbackLine(thread)}` : ""}`,
    };
  } catch {
    return {
      session: {
        available: false,
        source: "unavailable",
        reason: "Current Codex session reader could not be loaded",
      },
      text: "Current Codex session: reader could not be loaded.",
    };
  }
}

/** Claude Code's host exports the session's selected effort (WO-157 item 11,
 * WO-152 D012). DotLn never sets the variable. It is selected, not effective,
 * effort, and it names no model. */
export const CLAUDE_SELECTED_EFFORTS = [
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
];
export function claudeSessionReport(env = process.env) {
  const effort = env.CLAUDE_EFFORT;
  if (!CLAUDE_SELECTED_EFFORTS.includes(effort)) return null;
  return {
    session: {
      available: true,
      harness: "claude-code",
      effort,
      channel: "CLAUDE_EFFORT",
      source: "claude-session-readback",
      scope: "selected, not effective",
    },
    text: `Current Claude Code session: effort ${effort}; source claude-session-readback; host-selected (CLAUDE_EFFORT), not effective effort.`,
  };
}

export async function currentHarnessSessionReport(root, options = {}) {
  if (process.env.CODEX_THREAD_ID || !process.env.COPILOT_AGENT_SESSION_ID)
    return codexSessionReport(root);
  try {
    const { currentCopilotSession, renderCopilotSession, usageReadbackLine } =
      await import("../../packages/skeleton/src/usage-observation.mjs");
    const session = currentCopilotSession(root, options);
    let warning = "";
    const discovery = docPath(root, "discovery", "environment.json");
    if (session.harnessVersion && existsSync(discovery)) {
      const record = JSON.parse(readFileSync(discovery, "utf8"))
        .effortReadbackProbe?.harnesses?.["copilot-cli"];
      const lines = [
        ...new Set([
          ...(record?.versionLines ?? [])
            .filter((row) => row.classification === "observed")
            .map((row) => row.line),
          ...(record?.versions ?? [])
            .filter((row) => row.classification === "observed")
            .map((row) => row.value.split(".").slice(0, 2).join(".")),
        ]),
      ];
      if (
        !lines.includes(session.harnessVersion.split(".").slice(0, 2).join("."))
      )
        warning = `\nDotLn: harness ${session.harnessVersion} leaves observed lines ${lines.join(", ") || "none"}; run npm run discover -- harness copilot-cli.`;
    }
    return {
      session,
      text: `${renderCopilotSession(session)}${warning}\n${usageReadbackLine(options.sessionId ?? process.env.COPILOT_AGENT_SESSION_ID)}`,
    };
  } catch {
    return {
      session: {
        available: false,
        harness: "copilot-cli",
        source: "unavailable",
        causes: ["session-report-unavailable"],
      },
      text: "Current Copilot session: unknown (session-report-unavailable); no default substituted.",
    };
  }
}

export async function observedFactsReport(root, state, output) {
  try {
    const { observationBoundary, codexObservationScope } =
      await import("../../packages/skeleton/dist/src/observed-facts.js");
    const phase =
      {
        active: "implementation",
        repairing: "repair",
        verifying: "verification",
        "final-review": "finalReview",
      }[state.phase] ?? state.phase;
    const sessionId =
      process.env.CODEX_THREAD_ID || process.env.COPILOT_AGENT_SESSION_ID;
    if (!sessionId) return ""; // Claude supplies its session-bound block through the hook.
    const scope = codexObservationScope(
      sessionId,
      state.workOrderId ?? null,
      phase,
      root,
    );
    return observationBoundary(root, scope, {
      codex: Boolean(process.env.CODEX_THREAD_ID),
      output,
    });
  } catch {
    return `Observed facts at ${new Date().toISOString()}: unknown (observation-runtime-unavailable); advisory only.`;
  }
}

export function refreshHarnessRuntime(root, build) {
  const cause = harnessRuntimeCause(root);
  if (!cause) return false;
  process.stdout.write(
    `Refreshing pinned runtime (${cause}); npm run build.\n`,
  );
  build();
  const remaining = harnessRuntimeCause(root);
  if (remaining)
    throw new Error(
      `Built runtime still ${remaining}; checkout preserved; run node scripts/bootstrap.mjs`,
    );
  return true;
}
