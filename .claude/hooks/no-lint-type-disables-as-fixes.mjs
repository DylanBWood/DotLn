// Origin: {"ids":["contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.verifier","no-lint-type-disables-as-fixes"],"loadoutId":"contributor","semanticHash":"fnv1a64:3fda088a97df0f55"}
let input, control;
try {
const { text } = await import("node:stream/consumers");
const rawInput = await text(process.stdin);
try { input = JSON.parse(rawInput); } catch {}
const event = "PostToolUse";
const recoveryInput = input !== null && typeof input === "object" && !Array.isArray(input) && (input.prompt === undefined || typeof input.prompt === "string") && (typeof input.session_id === "string" || (event === "UserPromptSubmit" && /^(analysis|operator override):(?:\s|$)/i.test((input.prompt ?? "").trim())));
control = recoveryInput ? await (async function operatorControl(input, event) {
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
    /** @param {string[]} words */
    const retain = (words) => {
        const limit = "[DotLn: later operator words were not retained; 64 KiB capture limit]";
        const kept = [];
        let total = 0;
        for (const word of words) {
            if (word === limit || total + word.length > 65_536) {
                kept.push(limit);
                break;
            }
            kept.push(word);
            total += word.length;
        }
        return kept;
    };
    /** @param {{ enteredAt: string, exitedAt: string }} exited */
    const advisory = (exited) => `Record the override for the selected open work order: npm run resume -- override-record --bypassed dotln-hook-enforcement --effects <what the recovery changed, or none> --reason 'operator override from ${exited.enteredAt} to ${exited.exitedAt}' [--capture <ignored intake file holding the operator's override words> --capture-hash sha256:<digest>] --harness <harness> --harness-version <version> --model <model> --effort <level> --source <source>. With no open order (closed, withdrawn or none selected), record the override and what it changed in the order's decisions. The role's completion carries this duty; the record is never a precondition for entering or leaving override.`;
    if (!input.session_id)
        return entered ? message(requested ?? "unavailable") : null;
    try {
        const fs = await import("node:fs");
        const { dirname, join } = await import("node:path");
        const { tmpdir } = await import("node:os");
        const { createHash, randomUUID } = await import("node:crypto");
        const directory = join(tmpdir(), `dotln-operator-control-${process.getuid?.() ?? "user"}`);
        const key = createHash("sha256").update(input.session_id).digest("hex");
        const path = join(directory, `${key}.json`);
        const read = () => {
            try {
                return JSON.parse(fs.readFileSync(path, "utf8"));
            }
            catch (error) {
                if (error &&
                    typeof error === "object" &&
                    "code" in error &&
                    error.code === "ENOENT")
                    return null;
                throw error;
            }
        };
        /** @param {Record<string, unknown>} state */
        const write = (state) => {
            fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
            const temporary = `${path}.${randomUUID()}`;
            fs.writeFileSync(temporary, JSON.stringify(state) + "\n", {
                mode: 0o600,
                flag: "wx",
            });
            fs.renameSync(temporary, path);
        };
        /** @param {any} saved @returns {{ enteredAt: string, words: string[] } | undefined} */
        const overrideOf = (saved) => saved?.override &&
            typeof saved.override.enteredAt === "string" &&
            Array.isArray(saved.override.words)
            ? {
                enteredAt: saved.override.enteredAt,
                words: saved.override.words.filter((/** @type {unknown} */ word) => typeof word === "string"),
            }
            : undefined;
        let mode = "normal";
        /** @type {{ enteredAt: string, exitedAt: string, words: string[] } | undefined} */
        let exited;
        if (requested) {
            let prior;
            let priorState;
            try {
                priorState = read();
                prior = overrideOf(priorState);
            }
            catch {
                // An unreadable prior state never withholds a mode change.
            }
            const now = new Date().toISOString();
            let worktree = prior && typeof priorState?.worktree === "string"
                ? priorState.worktree
                : undefined;
            if (!worktree && typeof input.cwd === "string") {
                try {
                    let candidate = fs.realpathSync(input.cwd);
                    while (!fs.existsSync(join(candidate, ".git"))) {
                        const parent = dirname(candidate);
                        if (parent === candidate)
                            break;
                        candidate = parent;
                    }
                    if (fs.existsSync(join(candidate, ".git")))
                        worktree = candidate;
                }
                catch {
                    // Recovery stays available even when cwd cannot be resolved.
                }
            }
            // An override stays open across an analysis pause until an explicit off.
            const override = requested === "override"
                ? {
                    enteredAt: prior?.enteredAt ?? now,
                    words: retain([...(prior?.words ?? []), prompt]),
                }
                : requested === "analysis"
                    ? prior
                    : undefined;
            write({
                version: 1,
                mode: requested,
                observedAt: now,
                ...(worktree ? { worktree } : {}),
                ...(override ? { override } : {}),
            });
            if (requested === "normal" && prior)
                exited = { ...prior, exitedAt: now };
            mode = requested;
        }
        else {
            const saved = read();
            if (saved === null)
                return null;
            if (saved.version !== 1 ||
                !["analysis", "override", "normal"].includes(saved.mode))
                throw new Error("operator-control state unavailable");
            mode = saved.mode;
            const override = overrideOf(saved);
            // The operator's instructions during an override are its authority.
            if (mode === "override" && prompt && override)
                try {
                    write({
                        ...saved,
                        override: {
                            ...override,
                            words: retain([...override.words, prompt]),
                        },
                    });
                }
                catch {
                    // Retention is evidence, never a condition of the override.
                }
        }
        if (mode !== "normal")
            return message(mode);
        return exit
            ? {
                systemMessage: "DotLn: operator-control exited; ordinary workflow checks resume. No lifecycle dispatch occurred.",
                ...(exited
                    ? { overrideExit: { ...exited, advisory: advisory(exited) } }
                    : {}),
            }
            : null;
    }
    catch {
        // A broken recovery-state store must not become another recovery gate.
        return message(requested && requested !== "normal" ? requested : "unavailable", "Recovery state could not be read or persisted; this hook remains advisory.");
    }
})({ ...input, session_id: typeof input.session_id === "string" ? input.session_id : undefined }, event) : null;
if (control && !control.overrideExit) { process.stdout.write(JSON.stringify(control)); } else {
const { feedbackBoundary } = await import("../../.runtime/harness/341d8229ff992ac9/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/341d8229ff992ac9/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.25.3",
  "runtime": {
    "skeletonVersion": "0.34.5",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/artifact-identity.js",
        "hash": "fnv1a64:2923beebfe33cfc7"
      },
      {
        "path": "packages/compiler/dist/src/harness.js",
        "hash": "fnv1a64:c7ca6bda90b781de"
      },
      {
        "path": "packages/compiler/dist/src/codex-continuation.mjs",
        "hash": "fnv1a64:31bfebf311f308ea"
      },
      {
        "path": "packages/compiler/dist/src/feedback.js",
        "hash": "fnv1a64:aa8277e768c71730"
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
        "hash": "fnv1a64:a4692585700c2def"
      },
      {
        "path": "packages/skeleton/dist/src/subagent-budget.js",
        "hash": "fnv1a64:760d2e9ed61981bd"
      },
      {
        "path": "packages/skeleton/dist/src/observed-facts.js",
        "hash": "fnv1a64:42f51218f3c3a4e6"
      },
      {
        "path": "packages/skeleton/dist/src/correction-observation.mjs",
        "hash": "fnv1a64:9de0f1abc1c9c83b"
      },
      {
        "path": "packages/skeleton/dist/src/source-change-command.js",
        "hash": "fnv1a64:823fe16591fa4dba"
      },
      {
        "path": "packages/skeleton/dist/src/source-change-state.js",
        "hash": "fnv1a64:f0f512b07352a99d"
      },
      {
        "path": "packages/skeleton/dist/src/version.js",
        "hash": "fnv1a64:bcccf4385f5fcdcf"
      },
      {
        "path": "packages/skeleton/dist/src/harness-command.js",
        "hash": "fnv1a64:becd80a79da2bdac"
      },
      {
        "path": "packages/skeleton/dist/src/gate-evidence.mjs",
        "hash": "fnv1a64:292eca6989650658"
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
        "hash": "fnv1a64:1b40a187193a47a0"
      },
      {
        "path": "packages/skeleton/dist/src/reactor.js",
        "hash": "fnv1a64:646c107a37e632d7"
      },
      {
        "path": "packages/skeleton/dist/src/repair.js",
        "hash": "fnv1a64:61d8ccfed3ce0e72"
      },
      {
        "path": "packages/skeleton/dist/src/resident-state.js",
        "hash": "fnv1a64:06f93ae0311b6f5d"
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
        "hash": "fnv1a64:339def7a267a6998"
      },
      {
        "path": "packages/skeleton/dist/src/worker-store.js",
        "hash": "fnv1a64:b61e6b191747907a"
      },
      {
        "path": "packages/skeleton/dist/src/verification-protocol.js",
        "hash": "fnv1a64:9c6da06a4376c6e2"
      },
      {
        "path": "packages/skeleton/dist/src/plan-refutation-protocol.js",
        "hash": "fnv1a64:ded0b23c9969f6b5"
      },
      {
        "path": "packages/skeleton/dist/src/worker-protocol.js",
        "hash": "fnv1a64:df68218642aede29"
      },
      {
        "path": "packages/skeleton/dist/src/presence-machine.js",
        "hash": "fnv1a64:8c293a04a096332e"
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
        "hash": "fnv1a64:872502f1ee6a8e10"
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
        "hash": "fnv1a64:7d830f99be355cb6"
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
    "snapshot": ".runtime/harness/341d8229ff992ac9"
  },
  "event": "PostToolUse",
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
      "outside.write:host-scratchpad",
      "outside.write:session-scratch",
      "outside.write:system-temp"
    ],
    "authorityEnvelopeId": "contributor.bounded",
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
        "outside.write:host-scratchpad",
        "outside.write:session-scratch",
        "outside.write:system-temp"
      ],
      "grantId": "contributor.outside-temporary",
      "grantedBy": "operator",
      "reason": "WO-144-D001: temporary work and operator-selected DotLn session scratch; WO-158-D010: the session's host-printed scratchpad",
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
        },
        {
          "kind": "host-scratchpad",
          "source": "WO-158-D010: the scratchpad Claude Code prints for this session",
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
        },
        {
          "kind": "host-scratchpad",
          "source": "WO-158-D010: the scratchpad Claude Code prints for this session",
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
        },
        {
          "kind": "host-scratchpad",
          "source": "WO-158-D010: the scratchpad Claude Code prints for this session",
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
        },
        {
          "kind": "host-scratchpad",
          "source": "WO-158-D010: the scratchpad Claude Code prints for this session",
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
        },
        {
          "kind": "host-scratchpad",
          "source": "WO-158-D010: the scratchpad Claude Code prints for this session",
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
        },
        {
          "kind": "host-scratchpad",
          "source": "WO-158-D010: the scratchpad Claude Code prints for this session",
          "originId": "contributor.refuter",
          "authorityGrantId": "contributor.outside-temporary"
        }
      ]
    }
  ],
  "kind": "feedback",
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.25.3",
    "units": [
      {
        "unitId": "no-lint-type-disables-as-fixes",
        "version": 1,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The anti-gaming verification requirement rejects lint-disables and type suppressions presented as repairs.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not make a repair appear green by adding lint or type suppression directives to code.",
        "desiredBehavior": "Compare source comment directives with the baseline and reject newly introduced suppressions while allowing unchanged historical directives and quoted examples.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "suppression-diff",
        "mechanism": {
          "handler": "suppression-diff",
          "version": 1,
          "rationale": "A deterministic source-diff check covers the declared directive vocabulary without a model episode."
        },
        "enforcement": "hard",
        "requiredEvidence": [
          "baseline-source",
          "candidate-source",
          "suppression-diff"
        ],
        "regressionFixtures": [
          "WO-011 regression no-lint-type-disables-as-fixes"
        ],
        "conflicts": [],
        "supersedes": [],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not make a repair appear green by adding lint or type suppression directives to code. Compare source comment directives with the baseline and reject newly introduced suppressions while allowing unchanged historical directives and quoted examples."
      }
    ],
    "mechanisms": [
      {
        "unitId": "no-lint-type-disables-as-fixes",
        "handler": "suppression-diff",
        "kind": "script",
        "rung": 1,
        "enforcement": "hard"
      }
    ],
    "policyHash": "fnv1a64:04d922224ff39610"
  },
  "correctionToken": null
}, feedbackBoundary, input, rawInput, control);
}
} catch { if (control?.overrideExit) { const { overrideExit, ...exited } = control; const advisory = "DotLn advisory: the pinned runtime is unavailable, so OperatorOverrideRecorded was not appended. " + overrideExit.advisory; process.stdout.write(JSON.stringify({ systemMessage: exited.systemMessage + " " + advisory, hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: advisory } })); } else { const recovered = await (async function recoverReleaseClose(root, hook, input, event) {
    if (event !== "UserPromptSubmit" ||
        input?.prompt?.trim() !== "resume: release close" ||
        process.env.COPILOT_PROJECT_DIR ||
        process.env.COPILOT_AGENT_SESSION_ID)
        return null;
    try {
        const { realpathSync } = await import("node:fs");
        const { join } = await import("node:path");
        const { pathToFileURL } = await import("node:url");
        const { spawnSync } = await import("node:child_process");
        if (!input.session_id)
            throw new Error("recorded session identity missing");
        if (!input.cwd || realpathSync(input.cwd) !== realpathSync(root))
            throw new Error("cwd is not the main checkout root");
        if (process.env.DOTLN_RELEASE_CLOSE_PREPARED_ROOT === root)
            throw new Error("pinned runtime remains unavailable after one preparation");
        const run = (command, args) => spawnSync(command, args, {
            cwd: root,
            encoding: "utf8",
            timeout: 120_000,
            maxBuffer: 4 * 1024 * 1024,
        });
        const worktrees = run("git", ["worktree", "list", "--porcelain"]);
        const main = worktrees.stdout
            ?.split("\n\n")
            .find((row) => row.split("\n").includes("branch refs/heads/main"))
            ?.split("\n")[0]
            ?.replace(/^worktree /, "");
        if (worktrees.status !== 0 ||
            !main ||
            realpathSync(main) !== realpathSync(root))
            throw new Error("main checkout fact unavailable");
        const observed = run(process.execPath, [
            join(root, "scripts/resume.mjs"),
            "status",
            "--json",
        ]);
        if (observed.status !== 0)
            throw new Error("canonical release-close status unavailable");
        let status;
        try {
            status = JSON.parse(observed.stdout);
        }
        catch {
            throw new Error("canonical release-close status unreadable");
        }
        if (!/^WO-\d{3}$/.test(status.workOrder ?? "") ||
            !status.legalNextActions?.includes("release-close"))
            throw new Error("canonical release-close is not legal for the selected order");
        const { withWriterReservationLock, writerTeardownBlocker } = await import(pathToFileURL(join(root, "packages/skeleton/src/writer-teardown.mjs"))
            .href);
        const { activeGateRuns } = await import(pathToFileURL(join(root, "packages/skeleton/src/gate-evidence.mjs")).href);
        withWriterReservationLock(root, () => {
            const writer = writerTeardownBlocker(root);
            if (writer)
                throw new Error(writer);
            if (activeGateRuns(root).length)
                throw new Error("active gate; runtime preparation withheld");
            for (const [command, args] of [
                ["npm", ["run", "build", "--silent"]],
                [process.execPath, [join(root, "scripts/harness.mjs"), "emit"]],
            ]) {
                const prepared = run(command, [...args]);
                if (prepared.status !== 0)
                    throw new Error(`runtime preparation failed at ${command} ${args.join(" ")}: ${String(prepared.stderr ||
                        prepared.stdout ||
                        prepared.error?.message ||
                        "unknown")
                        .trim()
                        .slice(0, 600)}`);
            }
        });
        const replay = spawnSync(process.execPath, [hook], {
            cwd: root,
            encoding: "utf8",
            input: JSON.stringify(input),
            timeout: 30_000,
            maxBuffer: 4 * 1024 * 1024,
            env: { ...process.env, DOTLN_RELEASE_CLOSE_PREPARED_ROOT: root },
        });
        if (replay.status !== 0 || !replay.stdout?.trim())
            throw new Error("prepared normal dispatch hook unavailable");
        JSON.parse(replay.stdout);
        return { response: replay.stdout };
    }
    catch (error) {
        return {
            advisory: `Release-close preparation withheld: ${error instanceof Error ? error.message : String(error)}; no fallback dispatch or admission invented.`,
        };
    }
})((await import("node:url")).fileURLToPath(new URL("../../", import.meta.url)), (await import("node:url")).fileURLToPath(import.meta.url), input, "PostToolUse");
if (recovered?.response) { process.stdout.write(recovered.response); } else {
const fs = await import("node:fs");
const { join } = await import("node:path");
const { createHash } = await import("node:crypto");
const { fileURLToPath } = await import("node:url");
const root = fileURLToPath(new URL("../../", import.meta.url));
const snapshot = ".runtime/harness/341d8229ff992ac9";
let cause = snapshot && !fs.existsSync(join(root, snapshot)) ? "snapshot-missing" : "runtime-unavailable";
try {
  const hash = (value) => {
    let hash = 0xcbf29ce484222325n;
    for (const byte of new TextEncoder().encode(value))
        hash = ((hash ^ BigInt(byte)) * 0x100000001b3n) & 0xffffffffffffffffn;
    return hash.toString(16).padStart(16, "0");
};
  for (const file of [{"path":"packages/compiler/dist/src/artifact-identity.js","hash":"fnv1a64:2923beebfe33cfc7"},{"path":"packages/compiler/dist/src/harness.js","hash":"fnv1a64:c7ca6bda90b781de"},{"path":"packages/compiler/dist/src/codex-continuation.mjs","hash":"fnv1a64:31bfebf311f308ea"},{"path":"packages/compiler/dist/src/feedback.js","hash":"fnv1a64:aa8277e768c71730"},{"path":"packages/compiler/dist/src/attribution.mjs","hash":"fnv1a64:962a971d8f8f42ac"},{"path":"packages/skeleton/dist/src/feedback-boundary.js","hash":"fnv1a64:d14b87587f87cd52"},{"path":"packages/skeleton/dist/src/feedback-source-comments.js","hash":"fnv1a64:f6ce0c206b559a27"},{"path":"packages/skeleton/dist/src/harness-host.js","hash":"fnv1a64:a4692585700c2def"},{"path":"packages/skeleton/dist/src/subagent-budget.js","hash":"fnv1a64:760d2e9ed61981bd"},{"path":"packages/skeleton/dist/src/observed-facts.js","hash":"fnv1a64:42f51218f3c3a4e6"},{"path":"packages/skeleton/dist/src/correction-observation.mjs","hash":"fnv1a64:9de0f1abc1c9c83b"},{"path":"packages/skeleton/dist/src/source-change-command.js","hash":"fnv1a64:823fe16591fa4dba"},{"path":"packages/skeleton/dist/src/source-change-state.js","hash":"fnv1a64:f0f512b07352a99d"},{"path":"packages/skeleton/dist/src/version.js","hash":"fnv1a64:bcccf4385f5fcdcf"},{"path":"packages/skeleton/dist/src/harness-command.js","hash":"fnv1a64:becd80a79da2bdac"},{"path":"packages/skeleton/dist/src/gate-evidence.mjs","hash":"fnv1a64:292eca6989650658"},{"path":"packages/skeleton/dist/src/gate-deadlines.mjs","hash":"fnv1a64:fed0ae4064c93d4a"},{"path":"packages/skeleton/dist/src/usage-observation.mjs","hash":"fnv1a64:3577a13e2e834daf"},{"path":"packages/skeleton/dist/src/writer-teardown.mjs","hash":"fnv1a64:1b40a187193a47a0"},{"path":"packages/skeleton/dist/src/reactor.js","hash":"fnv1a64:646c107a37e632d7"},{"path":"packages/skeleton/dist/src/repair.js","hash":"fnv1a64:61d8ccfed3ce0e72"},{"path":"packages/skeleton/dist/src/resident-state.js","hash":"fnv1a64:06f93ae0311b6f5d"},{"path":"packages/skeleton/dist/src/presence-signals.js","hash":"fnv1a64:2c8021c360896c08"},{"path":"packages/skeleton/dist/src/presence-heartbeat.js","hash":"fnv1a64:d34990f3e67a6180"},{"path":"packages/skeleton/dist/src/resident-store.js","hash":"fnv1a64:339def7a267a6998"},{"path":"packages/skeleton/dist/src/worker-store.js","hash":"fnv1a64:b61e6b191747907a"},{"path":"packages/skeleton/dist/src/verification-protocol.js","hash":"fnv1a64:9c6da06a4376c6e2"},{"path":"packages/skeleton/dist/src/plan-refutation-protocol.js","hash":"fnv1a64:ded0b23c9969f6b5"},{"path":"packages/skeleton/dist/src/worker-protocol.js","hash":"fnv1a64:df68218642aede29"},{"path":"packages/skeleton/dist/src/presence-machine.js","hash":"fnv1a64:8c293a04a096332e"},{"path":"packages/skeleton/dist/src/actor-catalog.js","hash":"fnv1a64:50911f5ff72a4f8a"},{"path":"packages/skeleton/dist/src/actor-contract.js","hash":"fnv1a64:ca5ebec3f7b6fe43"},{"path":"packages/skeleton/dist/src/cli-actor-contract.js","hash":"fnv1a64:872502f1ee6a8e10"},{"path":"packages/skeleton/dist/src/handoff-contract.js","hash":"fnv1a64:91441a878612f03f"},{"path":"packages/skeleton/dist/src/work-candidate.js","hash":"fnv1a64:4d2eae3f98d79433"},{"path":"packages/skeleton/dist/src/script-episode.js","hash":"fnv1a64:968721357bd9e006"},{"path":"packages/skeleton/dist/src/discovery-sandbox.js","hash":"fnv1a64:7d830f99be355cb6"},{"path":"packages/skeleton/dist/src/discovery-actor.js","hash":"fnv1a64:22d10e334cd2edfc"},{"path":"packages/skeleton/dist/src/discovery-cli.js","hash":"fnv1a64:5206b2bb4f28940f"},{"path":"packages/skeleton/dist/src/discovery.js","hash":"fnv1a64:5ad495017c40b9b2"}]) {
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
const advisory = "DotLn advisory: " + cause + ": built adapter unavailable; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide." + (recovered?.advisory ? " " + recovered.advisory : "");
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
})(input?.session_id, "PostToolUse", cause, (key) => {
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
    fs.appendFileSync(path, JSON.stringify({ recordedAt: new Date().toISOString(), event: "PostToolUse", advisory, delegated: true }) + "\n", { mode: 0o600 });
} catch {}
process.stdout.write(JSON.stringify(response)); } } }
