// Origin: {"ids":["contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.verifier","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:4d9dc4e490824232"}
try {
const { feedbackBoundary } = await import("../../.runtime/harness/764dcf6868be3ccc/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/764dcf6868be3ccc/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.9.1",
  "runtime": {
    "skeletonVersion": "0.15.1",
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
        "hash": "fnv1a64:0e1404a347cbbdc5"
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
        "hash": "fnv1a64:63758af4d47a6236"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:ac4af55f5c7ef6c5"
      }
    ],
    "snapshot": ".runtime/harness/764dcf6868be3ccc"
  },
  "event": "PostToolUse",
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
  "kind": "observe",
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
