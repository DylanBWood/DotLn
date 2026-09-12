// Origin: {"ids":["read-your-own-output"],"loadoutId":"contributor","semanticHash":"fnv1a64:4d9dc4e490824232"}
try {
const { feedbackBoundary } = await import("../../.runtime/harness/52e7c7bffd5a00b7/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/52e7c7bffd5a00b7/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.9.1",
  "runtime": {
    "skeletonVersion": "0.15.2",
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
        "hash": "fnv1a64:7f0520a32e27dede"
      },
      {
        "path": "packages/skeleton/dist/src/feedback-source-comments.js",
        "hash": "fnv1a64:6c6f7fcb7164891b"
      },
      {
        "path": "packages/skeleton/dist/src/harness-host.js",
        "hash": "fnv1a64:b4af269859f32d9c"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:8ec7474b9511d266"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:92471b453bd5e9a2"
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
    "snapshot": ".runtime/harness/52e7c7bffd5a00b7"
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
  "kind": "observe"
}, feedbackBoundary);
} catch { process.stdout.write("{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"DOTLN_HARNESS_REFUSED: built adapter unavailable\"}}"); }
