// Origin: {"ids":["concurrent-work-requires-worktrees"],"loadoutId":"contributor","semanticHash":"fnv1a64:f7e29ff3f4ede75c"}
let input;
try {
const { text } = await import("node:stream/consumers");
const rawInput = await text(process.stdin);
try { input = JSON.parse(rawInput); } catch {}
const event = "PreToolUse";
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
const { feedbackBoundary } = await import("../../.runtime/harness/6b1dc0917ec592c3/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/6b1dc0917ec592c3/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.11.2",
  "runtime": {
    "skeletonVersion": "0.18.4",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/artifact-identity.js",
        "hash": "fnv1a64:eecdab36d9ace673"
      },
      {
        "path": "packages/compiler/dist/src/harness.js",
        "hash": "fnv1a64:70ba1a388b0ba537"
      },
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:9f5023e4c2650af7"
      },
      {
        "path": "packages/compiler/dist/src/attribution.mjs",
        "hash": "fnv1a64:7a65d9bab4b81dda"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-boundary.js",
        "hash": "fnv1a64:7acece33d2f838f6"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-source-comments.js",
        "hash": "fnv1a64:6c6f7fcb7164891b"
      },
      {
        "path": "packages/skeleton/dist/src/harness-host.js",
        "hash": "fnv1a64:cd8c2c650f74617c"
      },
      {
        "path": "packages/skeleton/dist/src/version.js",
        "hash": "fnv1a64:386edbbcf7a3e788"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:d3696a82e454ead0"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:52bc0be53a929a4f"
      },
      {
        "path": "packages/skeleton/dist/src/gate-deadlines.mjs",
        "hash": "fnv1a64:fed0ae4064c93d4a"
      },
      {
        "path": "packages/skeleton/dist/src/usage-observation.mjs",
        "hash": "fnv1a64:4f3d424f0ca3725e"
      },
      {
        "path": "packages/skeleton/dist/src/writer-teardown.mjs",
        "hash": "fnv1a64:02ec5d2fc0848e9d"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:0b6cc9ad2bb31bfd"
      }
    ],
    "snapshot": ".runtime/harness/6b1dc0917ec592c3"
  },
  "event": "PreToolUse",
  "tools": {
    "Read": "read",
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
  "kind": "feedback",
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.11.2",
    "units": [
      {
        "unitId": "concurrent-work-requires-worktrees",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md",
            "docs/work-orders/WO-132-machinery-stand-down.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "WO-132 removes the main-branch exclusion while retaining one registered writer per worktree.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not dispatch a second writer into an occupied worktree.",
        "desiredBehavior": "Resolve physical cwd and Git root and require exactly one registered writer per worktree on any branch, including main.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "writer-isolation",
        "mechanism": {
          "handler": "writer-isolation",
          "version": 2,
          "rationale": "A pre-dispatch invariant checks current host facts; a static repository test cannot see live writer reservations."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "host-writer-reservations",
          "resolved-cwd-and-root"
        ],
        "regressionFixtures": [
          "WO-132 concurrent-work-requires-worktrees version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "concurrent-work-requires-worktrees@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "One registered writer owns each worktree on any branch, including main."
      }
    ],
    "mechanisms": [
      {
        "unitId": "concurrent-work-requires-worktrees",
        "handler": "writer-isolation",
        "kind": "pre-effect-guard",
        "rung": 2,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:d6b90b9542c8e98e"
  },
  "correctionToken": null
}, feedbackBoundary, input, rawInput);
}
} catch { const fs = await import("node:fs");
const { join } = await import("node:path");
const { createHash } = await import("node:crypto");
const root = typeof input?.cwd === "string" ? input.cwd : process.cwd();
const snapshot = ".runtime/harness/6b1dc0917ec592c3";
let cause = snapshot && !fs.existsSync(join(root, snapshot)) ? "snapshot-missing" : "runtime-unavailable";
try {
  const hash = (value) => {
    let hash = 0xcbf29ce484222325n;
    for (const byte of new TextEncoder().encode(value))
        hash = ((hash ^ BigInt(byte)) * 0x100000001b3n) & 0xffffffffffffffffn;
    return hash.toString(16).padStart(16, "0");
};
  for (const file of [{"path":"packages/compiler/dist/src/artifact-identity.js","hash":"fnv1a64:eecdab36d9ace673"},{"path":"packages/compiler/dist/src/harness.js","hash":"fnv1a64:70ba1a388b0ba537"},{"path":"packages/compiler/dist/src/feedback.js","hash":"fnv1a64:9f5023e4c2650af7"},{"path":"packages/compiler/dist/src/attribution.mjs","hash":"fnv1a64:7a65d9bab4b81dda"},{"path":"packages/skeleton/dist/src/feedback-boundary.js","hash":"fnv1a64:7acece33d2f838f6"},{"path":"packages/skeleton/dist/src/feedback-source-comments.js","hash":"fnv1a64:6c6f7fcb7164891b"},{"path":"packages/skeleton/dist/src/harness-host.js","hash":"fnv1a64:cd8c2c650f74617c"},{"path":"packages/skeleton/dist/src/version.js","hash":"fnv1a64:386edbbcf7a3e788"},{"path":"packages/skeleton/dist/src/harness-command.js","hash":"fnv1a64:d3696a82e454ead0"},{"path":"packages/skeleton/dist/src/gate-evidence.mjs","hash":"fnv1a64:52bc0be53a929a4f"},{"path":"packages/skeleton/dist/src/gate-deadlines.mjs","hash":"fnv1a64:fed0ae4064c93d4a"},{"path":"packages/skeleton/dist/src/usage-observation.mjs","hash":"fnv1a64:4f3d424f0ca3725e"},{"path":"packages/skeleton/dist/src/writer-teardown.mjs","hash":"fnv1a64:02ec5d2fc0848e9d"},{"path":"packages/skeleton/dist/src/reactor.js","hash":"fnv1a64:0b6cc9ad2bb31bfd"}]) {
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
})(input?.session_id, "PreToolUse", cause, (key) => {
  const directory = join(root, "docs/control/local/harness");
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const marker = join(directory, createHash("sha256").update(key).digest("hex") + ".advisory");
  try { fs.writeFileSync(marker, "seen\n", { flag: "wx", mode: 0o600 }); }
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
    fs.appendFileSync(path, JSON.stringify({ recordedAt: new Date().toISOString(), event: "PreToolUse", advisory, delegated: true }) + "\n", { mode: 0o600 });
} catch {}
process.stdout.write(JSON.stringify(response)); }
