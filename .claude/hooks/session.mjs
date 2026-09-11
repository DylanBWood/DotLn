// Origin: {"ids":["contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.verifier"],"loadoutId":"contributor","semanticHash":"fnv1a64:709272ae4905aaa6"}
try {
const { feedbackBoundary } = await import("../../.runtime/harness/a4a65a94d36a276d/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/a4a65a94d36a276d/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.9.0",
  "runtime": {
    "skeletonVersion": "0.15.0",
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
        "hash": "fnv1a64:7fecefc9b1846878"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:7c2aa377e24dad66"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:d75b06aeb2034085"
      },
      {
        "path": "packages/skeleton/dist/src/usage-observation.mjs",
        "hash": "fnv1a64:80e01fab579951b9"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:ac4af55f5c7ef6c5"
      }
    ],
    "snapshot": ".runtime/harness/a4a65a94d36a276d"
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
}, feedbackBoundary);
} catch { process.stdout.write("{\"decision\":\"block\",\"reason\":\"DOTLN_HARNESS_REFUSED: built adapter unavailable\"}"); }
