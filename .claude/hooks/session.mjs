// Origin: {"ids":["contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.verifier"],"loadoutId":"contributor","semanticHash":"fnv1a64:41aa929faf455544"}
let input;
try {
const { text } = await import("node:stream/consumers");
const rawInput = await text(process.stdin);
try { input = JSON.parse(rawInput); } catch {}
const event = (input?.hook_event_name === "SessionStart" ? "SessionStart" : "UserPromptSubmit");
const recoveryInput = input !== null && typeof input === "object" && !Array.isArray(input) && (input.prompt === undefined || typeof input.prompt === "string") && (typeof input.session_id === "string" || (event === "UserPromptSubmit" && /^(analysis|operator override):(?:\s|$)/i.test((input.prompt ?? "").trim())));
const control = recoveryInput ? await (async function operatorControl(input, event) {
    const prompt = event === "UserPromptSubmit" ? (input.prompt?.trim() ?? "") : "";
    const entered = /^(analysis|operator override):(?:\s|$)/i.exec(prompt);
    const exit = /^(analysis|operator override):\s*off\s*$/i.test(prompt);
    const requested = exit
        ? "normal"
        : entered?.[1]?.toLowerCase() === "analysis"
            ? "analysis"
            : entered
                ? "override"
                : null;
    /** @param {string} mode @param {string} [detail] */
    const message = (mode, detail = "") => {
        const instruction = mode === "analysis"
            ? "Pause the current routine. Explain the observed state and accept operator direction. Preserve pending work; do not resume it automatically."
            : mode === "override"
                ? "DotLn hook enforcement is suspended for this session. Carry out the operator's recovery instructions and record bypassed requirements truthfully."
                : "DotLn operator-control storage is unavailable. Keep diagnosis and operator-directed recovery accessible.";
        const context = instruction +
            " No lifecycle dispatch or passing check is claimed. Host tool permissions still apply. " +
            detail;
        return {
            systemMessage: `DotLn: operator-control ${mode}; ${context}`,
            ...(event === "UserPromptSubmit"
                ? {
                    hookSpecificOutput: {
                        hookEventName: event,
                        additionalContext: context,
                    },
                }
                : {}),
        };
    };
    if (!input.session_id)
        return entered ? message(requested ?? "unavailable") : null;
    try {
        const fs = await import("node:fs");
        const { join } = await import("node:path");
        const { tmpdir } = await import("node:os");
        const { createHash, randomUUID } = await import("node:crypto");
        const directory = join(tmpdir(), `dotln-operator-control-${process.getuid?.() ?? "user"}`);
        const key = createHash("sha256").update(input.session_id).digest("hex");
        const path = join(directory, `${key}.json`);
        let mode = "normal";
        if (requested) {
            fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
            const temporary = `${path}.${randomUUID()}`;
            fs.writeFileSync(temporary, JSON.stringify({
                version: 1,
                mode: requested,
                observedAt: new Date().toISOString(),
            }) + "\n", { mode: 0o600, flag: "wx" });
            fs.renameSync(temporary, path);
            mode = requested;
        }
        else {
            let saved;
            try {
                saved = JSON.parse(fs.readFileSync(path, "utf8"));
            }
            catch (error) {
                if (error &&
                    typeof error === "object" &&
                    "code" in error &&
                    error.code === "ENOENT")
                    return null;
                throw error;
            }
            if (saved.version !== 1 ||
                !["analysis", "override", "normal"].includes(saved.mode))
                throw new Error("operator-control state unavailable");
            mode = saved.mode;
        }
        if (mode !== "normal")
            return message(mode);
        return exit
            ? {
                systemMessage: "DotLn: operator-control exited; ordinary workflow checks resume. No lifecycle dispatch occurred.",
            }
            : null;
    }
    catch {
        // A broken recovery-state store must not become another recovery gate.
        return message(requested && requested !== "normal" ? requested : "unavailable", "Recovery state could not be read or persisted; this hook remains advisory.");
    }
})({ ...input, session_id: typeof input.session_id === "string" ? input.session_id : undefined }, event) : null;
if (control) { process.stdout.write(JSON.stringify(control)); } else {
const { feedbackBoundary } = await import("../../.runtime/harness/43f5266ccaf001a2/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/43f5266ccaf001a2/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.17.0",
  "runtime": {
    "skeletonVersion": "0.34.0",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/artifact-identity.js",
        "hash": "fnv1a64:5d51d73709274707"
      },
      {
        "path": "packages/compiler/dist/src/harness.js",
        "hash": "fnv1a64:d3f80b0e7b1c0f6b"
      },
      {
        "path": "packages/compiler/dist/src/codex-continuation.mjs",
        "hash": "fnv1a64:31bfebf311f308ea"
      },
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:9f5023e4c2650af7"
      },
      {
        "path": "packages/compiler/dist/src/attribution.mjs",
        "hash": "fnv1a64:962a971d8f8f42ac"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-boundary.js",
        "hash": "fnv1a64:d14b87587f87cd52"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-source-comments.js",
        "hash": "fnv1a64:f6ce0c206b559a27"
      },
      {
        "path": "packages/skeleton/dist/src/harness-host.js",
        "hash": "fnv1a64:baaf9759cc55281f"
      },
      {
        "path": "packages/skeleton/dist/src/subagent-budget.js",
        "hash": "fnv1a64:760d2e9ed61981bd"
      },
      {
        "path": "packages/skeleton/dist/src/observed-facts.js",
        "hash": "fnv1a64:5762d404eef62fab"
      },
      {
        "path": "packages/skeleton/dist/src/correction-observation.mjs",
        "hash": "fnv1a64:9de0f1abc1c9c83b"
      },
      {
        "path": "packages/skeleton/dist/src/source-change-command.js",
        "hash": "fnv1a64:cbd81fc0aefe372b"
      },
      {
        "path": "packages/skeleton/dist/src/source-change-state.js",
        "hash": "fnv1a64:c37242cb80738d4d"
      },
      {
        "path": "packages/skeleton/dist/src/version.js",
        "hash": "fnv1a64:ba059c61fac6c272"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:a6079e31d43d756c"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:ba3071659d7db791"
      },
      {
        "path": "packages/skeleton/dist/src/gate-deadlines.mjs",
        "hash": "fnv1a64:fed0ae4064c93d4a"
      },
      {
        "path": "packages/skeleton/dist/src/usage-observation.mjs",
        "hash": "fnv1a64:3577a13e2e834daf"
      },
      {
        "path": "packages/skeleton/dist/src/writer-teardown.mjs",
        "hash": "fnv1a64:ac3366341b79a0d2"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:0f630204260ed13c"
      },
      {
        "path": "packages/skeleton/dist/src/repair.js",
        "hash": "fnv1a64:d55bcdad7be35d1b"
      },
      {
        "path": "packages/skeleton/dist/src/resident-state.js",
        "hash": "fnv1a64:aca7749a358698cf"
      },
      {
        "path": "packages/skeleton/dist/src/presence-signals.js",
        "hash": "fnv1a64:2c8021c360896c08"
      },
      {
        "path": "packages/skeleton/dist/src/presence-heartbeat.js",
        "hash": "fnv1a64:d34990f3e67a6180"
      },
      {
        "path": "packages/skeleton/dist/src/resident-store.js",
        "hash": "fnv1a64:506070aa3fc95a8c"
      },
      {
        "path": "packages/skeleton/dist/src/worker-store.js",
        "hash": "fnv1a64:39f0f95829c55d38"
      },
      {
        "path": "packages/skeleton/dist/src/verification-protocol.js",
        "hash": "fnv1a64:d0a82b5b5f43d197"
      },
      {
        "path": "packages/skeleton/dist/src/plan-refutation-protocol.js",
        "hash": "fnv1a64:ded0b23c9969f6b5"
      },
      {
        "path": "packages/skeleton/dist/src/worker-protocol.js",
        "hash": "fnv1a64:bef918c37be71732"
      },
      {
        "path": "packages/skeleton/dist/src/presence-machine.js",
        "hash": "fnv1a64:c85105aa1cd0ca7d"
      },
      {
        "path": "packages/skeleton/dist/src/actor-catalog.js",
        "hash": "fnv1a64:50911f5ff72a4f8a"
      },
      {
        "path": "packages/skeleton/dist/src/actor-contract.js",
        "hash": "fnv1a64:ca5ebec3f7b6fe43"
      },
      {
        "path": "packages/skeleton/dist/src/cli-actor-contract.js",
        "hash": "fnv1a64:acdbcdb6531ba63a"
      },
      {
        "path": "packages/skeleton/dist/src/handoff-contract.js",
        "hash": "fnv1a64:91441a878612f03f"
      },
      {
        "path": "packages/skeleton/dist/src/work-candidate.js",
        "hash": "fnv1a64:4d2eae3f98d79433"
      },
      {
        "path": "packages/skeleton/dist/src/script-episode.js",
        "hash": "fnv1a64:968721357bd9e006"
      },
      {
        "path": "packages/skeleton/dist/src/discovery-sandbox.js",
        "hash": "fnv1a64:9d809e99a432c81c"
      },
      {
        "path": "packages/skeleton/dist/src/discovery-actor.js",
        "hash": "fnv1a64:22d10e334cd2edfc"
      },
      {
        "path": "packages/skeleton/dist/src/discovery-cli.js",
        "hash": "fnv1a64:5206b2bb4f28940f"
      },
      {
        "path": "packages/skeleton/dist/src/discovery.js",
        "hash": "fnv1a64:5ad495017c40b9b2"
      }
    ],
    "snapshot": ".runtime/harness/43f5266ccaf001a2"
  },
  "event": "UserPromptSubmit",
  "tools": {
    "Read": "read",
    "StructuredOutput": "read",
    "Glob": "read",
    "Grep": "read",
    "WebFetch": "read",
    "WebSearch": "read",
    "ListMcpResourcesTool": "read",
    "ReadMcpResourceTool": "read",
    "ToolSearch": "read",
    "Edit": "write",
    "Write": "write",
    "NotebookEdit": "write",
    "Bash": "shell",
    "Monitor": "shell",
    "TaskOutput": "read",
    "KillShell": "stop",
    "TaskStop": "stop",
    "Agent": "spawn",
    "Task": "spawn",
    "Workflow": "spawn",
    "Skill": "interaction",
    "TodoWrite": "interaction",
    "AskUserQuestion": "interaction",
    "EnterPlanMode": "interaction",
    "ExitPlanMode": "interaction",
    "exec_command": "shell",
    "write_stdin": "shell",
    "apply_patch": "write",
    "functions.exec": "shell",
    "collaboration.spawn_agent": "spawn"
  },
  "envelope": {
    "allowedEffects": [
      "repo.read",
      "repo.write",
      "shell.run",
      "git.local",
      "lifecycle.run",
      "outside.write:session-scratch",
      "outside.write:system-temp"
    ],
    "authorityEnvelopeId": "contributor.sandboxed",
    "deniedEffects": [
      "credentials.access",
      "transport.ssh",
      "settings.user",
      "sandbox.disable",
      "remote.unapproved",
      "package.publish"
    ],
    "expiresAt": 9007199254740991,
    "requiredEvidence": [
      "resolved-worktree"
    ],
    "resourceLimits": {
      "writers": 1
    },
    "revocationConditions": [],
    "revocationEventTypes": []
  },
  "grants": [
    {
      "effects": [
        "outside.write:session-scratch",
        "outside.write:system-temp"
      ],
      "grantId": "contributor.outside-temporary",
      "grantedBy": "operator",
      "reason": "WO-144-D001: temporary work and operator-selected DotLn session scratch",
      "repo": "project",
      "version": 1
    }
  ],
  "outsideWriteGrants": [
    {
      "role": "executor",
      "grants": [
        {
          "kind": "system-temp",
          "source": "WO-144-D001: contributor temporary work",
          "originId": "contributor.executor",
          "authorityGrantId": "contributor.outside-temporary"
        },
        {
          "kind": "session-scratch",
          "source": "WO-144-D001: operator-selected DotLn session scratch",
          "originId": "contributor.executor",
          "authorityGrantId": "contributor.outside-temporary"
        }
      ]
    },
    {
      "role": "verifier",
      "grants": [
        {
          "kind": "system-temp",
          "source": "WO-144-D001: contributor temporary work",
          "originId": "contributor.verifier",
          "authorityGrantId": "contributor.outside-temporary"
        },
        {
          "kind": "session-scratch",
          "source": "WO-144-D001: operator-selected DotLn session scratch",
          "originId": "contributor.verifier",
          "authorityGrantId": "contributor.outside-temporary"
        }
      ]
    },
    {
      "role": "reviewer",
      "grants": [
        {
          "kind": "system-temp",
          "source": "WO-144-D001: contributor temporary work",
          "originId": "contributor.reviewer",
          "authorityGrantId": "contributor.outside-temporary"
        },
        {
          "kind": "session-scratch",
          "source": "WO-144-D001: operator-selected DotLn session scratch",
          "originId": "contributor.reviewer",
          "authorityGrantId": "contributor.outside-temporary"
        }
      ]
    },
    {
      "role": "release-close",
      "grants": [
        {
          "kind": "system-temp",
          "source": "WO-144-D001: contributor temporary work",
          "originId": "contributor.release-close",
          "authorityGrantId": "contributor.outside-temporary"
        },
        {
          "kind": "session-scratch",
          "source": "WO-144-D001: operator-selected DotLn session scratch",
          "originId": "contributor.release-close",
          "authorityGrantId": "contributor.outside-temporary"
        }
      ]
    },
    {
      "role": "planner",
      "grants": [
        {
          "kind": "system-temp",
          "source": "WO-144-D001: contributor temporary work",
          "originId": "contributor.planner",
          "authorityGrantId": "contributor.outside-temporary"
        },
        {
          "kind": "session-scratch",
          "source": "WO-144-D001: operator-selected DotLn session scratch",
          "originId": "contributor.planner",
          "authorityGrantId": "contributor.outside-temporary"
        }
      ]
    },
    {
      "role": "refuter",
      "grants": [
        {
          "kind": "system-temp",
          "source": "WO-144-D001: contributor temporary work",
          "originId": "contributor.refuter",
          "authorityGrantId": "contributor.outside-temporary"
        },
        {
          "kind": "session-scratch",
          "source": "WO-144-D001: operator-selected DotLn session scratch",
          "originId": "contributor.refuter",
          "authorityGrantId": "contributor.outside-temporary"
        }
      ]
    }
  ],
  "kind": "session",
  "roles": [
    {
      "facetId": "contributor.executor",
      "name": "executor",
      "intents": [
        "resume: next",
        "resume: fix",
        "resume: status",
        "resume: times"
      ]
    },
    {
      "facetId": "contributor.verifier",
      "name": "verifier",
      "intents": [
        "resume: verify"
      ]
    },
    {
      "facetId": "contributor.reviewer",
      "name": "reviewer",
      "intents": [
        "resume: final review"
      ]
    },
    {
      "facetId": "contributor.release-close",
      "name": "release-close",
      "intents": [
        "resume: release close"
      ]
    },
    {
      "facetId": "contributor.planner",
      "name": "planner",
      "intents": [
        "planning:",
        "planning: entropy reducer",
        "ideation:"
      ]
    },
    {
      "facetId": "contributor.refuter",
      "name": "refuter",
      "intents": [
        "planning: refute",
        "planning: refute full"
      ]
    }
  ],
  "instructionFile": "CLAUDE.md"
}, feedbackBoundary, input, rawInput);
}
} catch { const fs = await import("node:fs");
const { join } = await import("node:path");
const { createHash } = await import("node:crypto");
const { fileURLToPath } = await import("node:url");
const root = fileURLToPath(new URL("../../", import.meta.url));
const snapshot = ".runtime/harness/43f5266ccaf001a2";
let cause = snapshot && !fs.existsSync(join(root, snapshot)) ? "snapshot-missing" : "runtime-unavailable";
try {
  const hash = (value) => {
    let hash = 0xcbf29ce484222325n;
    for (const byte of new TextEncoder().encode(value))
        hash = ((hash ^ BigInt(byte)) * 0x100000001b3n) & 0xffffffffffffffffn;
    return hash.toString(16).padStart(16, "0");
};
  for (const file of [{"path":"packages/compiler/dist/src/artifact-identity.js","hash":"fnv1a64:5d51d73709274707"},{"path":"packages/compiler/dist/src/harness.js","hash":"fnv1a64:d3f80b0e7b1c0f6b"},{"path":"packages/compiler/dist/src/codex-continuation.mjs","hash":"fnv1a64:31bfebf311f308ea"},{"path":"packages/compiler/dist/src/feedback.js","hash":"fnv1a64:9f5023e4c2650af7"},{"path":"packages/compiler/dist/src/attribution.mjs","hash":"fnv1a64:962a971d8f8f42ac"},{"path":"packages/skeleton/dist/src/feedback-boundary.js","hash":"fnv1a64:d14b87587f87cd52"},{"path":"packages/skeleton/dist/src/feedback-source-comments.js","hash":"fnv1a64:f6ce0c206b559a27"},{"path":"packages/skeleton/dist/src/harness-host.js","hash":"fnv1a64:baaf9759cc55281f"},{"path":"packages/skeleton/dist/src/subagent-budget.js","hash":"fnv1a64:760d2e9ed61981bd"},{"path":"packages/skeleton/dist/src/observed-facts.js","hash":"fnv1a64:5762d404eef62fab"},{"path":"packages/skeleton/dist/src/correction-observation.mjs","hash":"fnv1a64:9de0f1abc1c9c83b"},{"path":"packages/skeleton/dist/src/source-change-command.js","hash":"fnv1a64:cbd81fc0aefe372b"},{"path":"packages/skeleton/dist/src/source-change-state.js","hash":"fnv1a64:c37242cb80738d4d"},{"path":"packages/skeleton/dist/src/version.js","hash":"fnv1a64:ba059c61fac6c272"},{"path":"packages/skeleton/dist/src/harness-command.js","hash":"fnv1a64:a6079e31d43d756c"},{"path":"packages/skeleton/dist/src/gate-evidence.mjs","hash":"fnv1a64:ba3071659d7db791"},{"path":"packages/skeleton/dist/src/gate-deadlines.mjs","hash":"fnv1a64:fed0ae4064c93d4a"},{"path":"packages/skeleton/dist/src/usage-observation.mjs","hash":"fnv1a64:3577a13e2e834daf"},{"path":"packages/skeleton/dist/src/writer-teardown.mjs","hash":"fnv1a64:ac3366341b79a0d2"},{"path":"packages/skeleton/dist/src/reactor.js","hash":"fnv1a64:0f630204260ed13c"},{"path":"packages/skeleton/dist/src/repair.js","hash":"fnv1a64:d55bcdad7be35d1b"},{"path":"packages/skeleton/dist/src/resident-state.js","hash":"fnv1a64:aca7749a358698cf"},{"path":"packages/skeleton/dist/src/presence-signals.js","hash":"fnv1a64:2c8021c360896c08"},{"path":"packages/skeleton/dist/src/presence-heartbeat.js","hash":"fnv1a64:d34990f3e67a6180"},{"path":"packages/skeleton/dist/src/resident-store.js","hash":"fnv1a64:506070aa3fc95a8c"},{"path":"packages/skeleton/dist/src/worker-store.js","hash":"fnv1a64:39f0f95829c55d38"},{"path":"packages/skeleton/dist/src/verification-protocol.js","hash":"fnv1a64:d0a82b5b5f43d197"},{"path":"packages/skeleton/dist/src/plan-refutation-protocol.js","hash":"fnv1a64:ded0b23c9969f6b5"},{"path":"packages/skeleton/dist/src/worker-protocol.js","hash":"fnv1a64:bef918c37be71732"},{"path":"packages/skeleton/dist/src/presence-machine.js","hash":"fnv1a64:c85105aa1cd0ca7d"},{"path":"packages/skeleton/dist/src/actor-catalog.js","hash":"fnv1a64:50911f5ff72a4f8a"},{"path":"packages/skeleton/dist/src/actor-contract.js","hash":"fnv1a64:ca5ebec3f7b6fe43"},{"path":"packages/skeleton/dist/src/cli-actor-contract.js","hash":"fnv1a64:acdbcdb6531ba63a"},{"path":"packages/skeleton/dist/src/handoff-contract.js","hash":"fnv1a64:91441a878612f03f"},{"path":"packages/skeleton/dist/src/work-candidate.js","hash":"fnv1a64:4d2eae3f98d79433"},{"path":"packages/skeleton/dist/src/script-episode.js","hash":"fnv1a64:968721357bd9e006"},{"path":"packages/skeleton/dist/src/discovery-sandbox.js","hash":"fnv1a64:9d809e99a432c81c"},{"path":"packages/skeleton/dist/src/discovery-actor.js","hash":"fnv1a64:22d10e334cd2edfc"},{"path":"packages/skeleton/dist/src/discovery-cli.js","hash":"fnv1a64:5206b2bb4f28940f"},{"path":"packages/skeleton/dist/src/discovery.js","hash":"fnv1a64:5ad495017c40b9b2"}]) {
    if (fs.existsSync(join(root, file.path)) && "fnv1a64:" + hash(fs.readFileSync(join(root, file.path), "utf8")) !== file.hash) {
      cause = "pins-differ";
      break;
    }
    if (snapshot) {
      const saved = join(root, snapshot, file.path);
      if (!fs.existsSync(saved)) cause = "snapshot-missing";
      else if ("fnv1a64:" + hash(fs.readFileSync(saved, "utf8")) !== file.hash) {
        cause = "pins-differ";
        break;
      }
    }
  }
} catch {}
const advisory = "DotLn advisory: " + cause + ": built adapter unavailable; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide.";
const response = (function showHarnessAdvisory(sessionId, event, cause, claimMarker) {
    if (event === "PostToolUse")
        return false;
    if (!sessionId)
        return true;
    try {
        return claimMarker(JSON.stringify([sessionId, cause]));
    }
    catch {
        return true;
    }
})(input?.session_id, (input?.hook_event_name === "SessionStart" ? "SessionStart" : "UserPromptSubmit"), cause, (key) => {
  const directory = join(root, "docs/control/local/harness");
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const marker = join(directory, createHash("sha256").update(key).digest("hex") + ".advisory");
  try { fs.writeFileSync(marker, JSON.stringify({ sessionKey: createHash("sha256").update(String(input?.session_id)).digest("hex") }) + "\n", { flag: "wx", mode: 0o600 }); }
  catch (error) {
    if (error?.code === "EEXIST") return !fs.lstatSync(marker).isFile();
    throw error;
  }
  return true;
}) ? { systemMessage: advisory } : {};
try {
  const directory = join(root, "docs/control/local/harness");
  const key = createHash("sha256").update(String(input?.session_id ?? "unknown")).digest("hex");
  const path = join(directory, key + ".jsonl");
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(path) || fs.lstatSync(path).isFile())
    fs.appendFileSync(path, JSON.stringify({ recordedAt: new Date().toISOString(), event: (input?.hook_event_name === "SessionStart" ? "SessionStart" : "UserPromptSubmit"), advisory, delegated: true }) + "\n", { mode: 0o600 });
} catch {}
process.stdout.write(JSON.stringify(response)); }
