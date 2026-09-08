// Origin: {"ids":["contributor.permissions"],"loadoutId":"contributor","semanticHash":"fnv1a64:06245f5c581212f1"}
try {
const { feedbackBoundary } = await import("../../packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.7.0",
  "runtime": {
    "skeletonVersion": "0.13.0",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:dc9688aecc4cb056"
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
        "hash": "fnv1a64:314cebd40278b35f"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:ac4af55f5c7ef6c5"
      }
    ]
  },
  "event": "PreToolUse",
  "kind": "permission",
  "envelope": {
    "allowedEffects": [
      "repo.read",
      "repo.write",
      "shell.run",
      "git.local",
      "lifecycle.run"
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
  "facets": [
    {
      "facetId": "contributor.permissions",
      "kind": "permission-guard",
      "matchers": [
        {
          "effect": "transport.ssh",
          "deny": "Bash(ssh *)"
        },
        {
          "effect": "transport.ssh",
          "deny": "Bash(scp *)"
        },
        {
          "effect": "transport.ssh",
          "deny": "Bash(sftp *)"
        },
        {
          "effect": "package.publish",
          "deny": "Bash(npm publish *)"
        }
      ]
    }
  ]
}, feedbackBoundary);
} catch { process.stdout.write("{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"DOTLN_HARNESS_REFUSED: built adapter unavailable\"}}"); }
