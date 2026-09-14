// Origin: {"ids":["no-attribution"],"loadoutId":"contributor","semanticHash":"fnv1a64:fe30ee5ba57ce2ed"}
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
})(input, "PreToolUse");
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
  "kind": "feedback",
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.9.2",
    "units": [
      {
        "unitId": "no-attribution",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/06-roadmap.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The founding mapping selects attribution settings plus a commit hook as defense in depth for the no-attribution requirement.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not append AI coauthors, generated-with footers, harness-suggested session trailers or session URLs to commits, PR titles or bodies, or release notes.",
        "desiredBehavior": "Disable automatic attribution and reject AI trailers, footers and session links at publication; preserve human coauthors and ordinary subject text.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "attribution",
        "mechanism": {
          "handler": "attribution",
          "version": 2,
          "rationale": "A deterministic footer/trailer predicate is sufficient; invocation settings reduce generation and the commit hook checks actual bytes."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "commit-message-bytes",
          "invocation-settings",
          "real-git-hook-result"
        ],
        "regressionFixtures": [
          "WO-126 no-attribution version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "no-attribution@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not append AI coauthors, generated-with footers, harness-suggested session trailers or session URLs to commits, PR titles or bodies, or release notes. Disable automatic attribution and reject AI trailers, footers and session links at publication; preserve human coauthors and ordinary subject text."
      }
    ],
    "mechanisms": [
      {
        "unitId": "no-attribution",
        "handler": "attribution",
        "kind": "script",
        "rung": 1,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:568daa4829c0a07e"
  },
  "correctionToken": null
}, feedbackBoundary, input);
}
} catch { let response = {"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_HARNESS_REFUSED: built adapter unavailable"}};
try {
  const args = input?.tool_input ?? {};
  const read = ["Read", "Glob", "Grep"].includes(input.tool_name);
  const shell = ["Bash", "exec_command"].includes(input.tool_name)
    && (args.workdir ?? args.cwd ?? input.cwd) === input.cwd
    && ["pwd", "git status --short", "git status --short --branch", "git rev-parse --show-toplevel", "node scripts/bootstrap.mjs"].includes(String(args.command ?? args.cmd ?? ""));
  if (read || shell) response = { systemMessage: "DotLn: built adapter unavailable; read access and node scripts/bootstrap.mjs remain available." };
} catch {}
process.stdout.write(JSON.stringify(response)); }
