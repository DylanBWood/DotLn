// Origin: {"ids":["contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.verifier"],"loadoutId":"contributor","semanticHash":"fnv1a64:fe30ee5ba57ce2ed"}
let input;
try {
const { text } = await import("node:stream/consumers");
input = JSON.parse(await text(process.stdin));
const control = await (async function operatorControl(input, event) {
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
})(input, "UserPromptSubmit");
if (control) { process.stdout.write(JSON.stringify(control)); } else {
const { feedbackBoundary } = await import("../../.runtime/harness/a527128a5b518bb9/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/a527128a5b518bb9/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.9.2",
  "runtime": {
    "skeletonVersion": "0.15.11",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:4bdd1cdb762a966b"
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
        "hash": "fnv1a64:9e6ea83bf678c088"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:8ec7474b9511d266"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:6b029519b0949506"
      },
      {
        "path": "packages/skeleton/dist/src/gate-deadlines.mjs",
        "hash": "fnv1a64:fed0ae4064c93d4a"
      },
      {
        "path": "packages/skeleton/dist/src/usage-observation.mjs",
        "hash": "fnv1a64:63758af4d47a6236"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:ac4af55f5c7ef6c5"
      }
    ],
    "snapshot": ".runtime/harness/a527128a5b518bb9"
  },
  "event": "UserPromptSubmit",
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
    "KillShell": "shell",
    "Agent": "spawn",
    "Task": "spawn",
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
}, feedbackBoundary, input);
}
} catch { process.stdout.write("{\"systemMessage\":\"DotLn: prompt accepted; built adapter unavailable. Read the repository instructions and run node scripts/bootstrap.mjs to prepare this worktree.\"}"); }
