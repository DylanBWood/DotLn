// Origin: {"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.verifier","correctness-over-sycophancy","fail-conservative-correction","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f7e29ff3f4ede75c"}
let input;
try {
const { text } = await import("node:stream/consumers");
const rawInput = await text(process.stdin);
try { input = JSON.parse(rawInput); } catch {}
const recoveryInput = input !== null && typeof input === "object" && !Array.isArray(input) && (input.prompt === undefined || typeof input.prompt === "string") && (typeof input.session_id === "string" || ("Stop" === "UserPromptSubmit" && /^(analysis|operator override):(?:\s|$)/i.test((input.prompt ?? "").trim())));
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
})({ ...input, session_id: typeof input.session_id === "string" ? input.session_id : undefined }, "Stop") : null;
if (control) { process.stdout.write(JSON.stringify(control)); } else {
const { feedbackBoundary } = await import("../../.runtime/harness/01fbc22957655b21/packages/skeleton/dist/src/feedback-boundary.js");
const { runHarnessHook } = await import("../../.runtime/harness/01fbc22957655b21/packages/skeleton/dist/src/harness-host.js");
await runHarnessHook({
  "compilerPackageVersion": "0.11.1",
  "runtime": {
    "skeletonVersion": "0.18.1",
    "boundaryContract": "feedback-v1",
    "files": [
      {
        "path": "packages/compiler/dist/src/artifact-identity.js",
        "hash": "fnv1a64:de7ebb5d6ad7243c"
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
        "hash": "fnv1a64:e057b4f5b19338d4"
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
        "hash": "fnv1a64:d0b95cfe4ad92ec2"
      }
    ],
    "snapshot": ".runtime/harness/01fbc22957655b21"
  },
  "event": "Stop",
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
  "kind": "finish",
  "policy": {
    "contractVersion": "feedback-v1",
    "compilerPackageVersion": "0.11.1",
    "units": [
      {
        "unitId": "anti-oscillation",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md#2026-09-09-emergency-process-debt-planning-pass",
            "docs/work-orders/WO-126-process-debt.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The operator's 2026-09-09 planning pass recorded ten category-boundary corrections. Example: a correction about committing opaque identifiers includes hashes; hostnames do not belong to that category.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not answer a correction with a sweeping generalization that extrapolates beyond the category the operator named into adjacent rules or file changes they never asked for, nor with an over-literal reading that strips the rule to its exact words and excludes obvious members of the same category.",
        "desiredBehavior": "Identify the category the operator is pointing at; stay inside it, neither widening nor shrinking it; when the boundary is genuinely unclear, ask one focused question instead of guessing in either direction; and pause to ask before any file action that goes beyond the literal correction. Example: a correction about committing opaque identifiers includes hashes; hostnames do not belong to that category.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "decision-lineage",
        "mechanism": {
          "handler": "decision-lineage",
          "version": 2,
          "kind": "prose",
          "rationale": "Session judgment supplies this rule; it claims no executable host facts."
        },
        "enforcement": "advisory",
        "requiredEvidence": [],
        "regressionFixtures": [
          "WO-126 anti-oscillation version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "anti-oscillation@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not answer a correction with a sweeping generalization that extrapolates beyond the category the operator named into adjacent rules or file changes they never asked for, nor with an over-literal reading that strips the rule to its exact words and excludes obvious members of the same category. Identify the category the operator is pointing at; stay inside it, neither widening nor shrinking it; when the boundary is genuinely unclear, ask one focused question instead of guessing in either direction; and pause to ask before any file action that goes beyond the literal correction. Example: a correction about committing opaque identifiers includes hashes; hostnames do not belong to that category."
      },
      {
        "unitId": "bounded-boy-scout-cleanup",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The recorded Boy Scout policy admits only unambiguous adjacent cleanup covered by the same verification; the operator's artifact-growth clarification also rejects cleanup without a demonstrated problem.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not expand into ambiguous, risky, unrelated, unverified, or retained-evidence cleanup merely because an adjacent item was noticed.",
        "desiredBehavior": "Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "cleanup-scope",
        "mechanism": {
          "handler": "cleanup-scope",
          "version": 2,
          "kind": "prose",
          "rationale": "Session judgment supplies this rule; it claims no executable host facts."
        },
        "enforcement": "advisory",
        "requiredEvidence": [],
        "regressionFixtures": [
          "WO-126 bounded-boy-scout-cleanup version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "bounded-boy-scout-cleanup@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not expand into ambiguous, risky, unrelated, unverified, or retained-evidence cleanup merely because an adjacent item was noticed. Admit only host-reviewed adjacent low-risk cleanup within named paths and shared checks that keeps the diff legible; nominate the rest separately."
      },
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
      },
      {
        "unitId": "correctness-over-sycophancy",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The founding feedback-to-mechanism inventory assigns correctness-over-sycophancy to an evaluator and policy invariant.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not accept a preferred answer when independent evidence contradicts it or only implementer claims support it.",
        "desiredBehavior": "Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "evidence-judgment",
        "mechanism": {
          "handler": "evidence-judgment",
          "version": 2,
          "kind": "prose",
          "rationale": "Session judgment supplies this rule; it claims no executable host facts."
        },
        "enforcement": "advisory",
        "requiredEvidence": [],
        "regressionFixtures": [
          "WO-126 correctness-over-sycophancy version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "correctness-over-sycophancy@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not accept a preferred answer when independent evidence contradicts it or only implementer claims support it. Judge the current subject from consistent independent evidence and preserve disagreement as a failed or unsupported claim."
      },
      {
        "unitId": "fail-conservative-correction",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/02-domain-model.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The recorded semantic correction policy tightens authority in response to typed operator correction events, not emotional wording.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not infer authority or a correction solely from surface language, or discard evidence when the operator reports a regression.",
        "desiredBehavior": "On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "semantic-correction",
        "mechanism": {
          "handler": "semantic-correction",
          "version": 2,
          "kind": "prose",
          "rationale": "Session judgment supplies this rule; it claims no executable host facts."
        },
        "enforcement": "advisory",
        "requiredEvidence": [],
        "regressionFixtures": [
          "WO-126 fail-conservative-correction version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "fail-conservative-correction@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not infer authority or a correction solely from surface language, or discard evidence when the operator reports a regression. On a typed correction, freeze destructive effects and scope expansion, preserve evidence, and require diagnosis; a false activation only tightens behavior."
      },
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
      },
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
      },
      {
        "unitId": "no-partial-completion",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The session contract and completion gates require the bounded work order's evidence rather than an inferred success report.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not mark a partial result complete while required obligations or declared remaining work are unresolved.",
        "desiredBehavior": "Only admit completed status when the required obligation set is discharged and no remaining work is reported.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "complete-scope",
        "mechanism": {
          "handler": "complete-scope",
          "version": 2,
          "rationale": "A workflow transition gate checks the complete obligation set; a single successful check is not whole-order completion."
        },
        "enforcement": "advisory",
        "requiredEvidence": [
          "discharged-obligations",
          "remaining-work",
          "required-obligations"
        ],
        "regressionFixtures": [
          "WO-126 no-partial-completion version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "no-partial-completion@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not mark a partial result complete while required obligations or declared remaining work are unresolved. Only admit completed status when the required obligation set is discharged and no remaining work is reported."
      },
      {
        "unitId": "read-your-own-output",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/07-execution-guide.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The implementer discipline requires reading the produced diff before reporting completion.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not hand off an artifact that was never read back, or that changed after it was read.",
        "desiredBehavior": "Bind each required output to a host-observed read of its current bytes before handoff; this witnesses delivery to the reader, not comprehension.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "output-review",
        "mechanism": {
          "handler": "output-review",
          "version": 2,
          "rationale": "A handoff gate compares read receipts and current content identities; prose cannot witness that the bytes were delivered."
        },
        "enforcement": "advisory",
        "requiredEvidence": [
          "current-output-identities",
          "host-read-receipts"
        ],
        "regressionFixtures": [
          "WO-126 read-your-own-output version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "read-your-own-output@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not hand off an artifact that was never read back, or that changed after it was read. Bind each required output to a host-observed read of its current bytes before handoff; this witnesses delivery to the reader, not comprehension."
      },
      {
        "unitId": "verify-app-before-done",
        "version": 2,
        "incident": {
          "sourceRefs": [
            "docs/lineage/idea-ledger.md",
            "docs/product/01-principles.md"
          ],
          "sourceTreatment": "synthesized-from-public-lineage",
          "summary": "The lineage records verification becoming an optional question even though live behavior was already part of the completion contract.",
          "retainedSource": "public-reference"
        },
        "undesiredBehavior": "Do not call an application change done from prose, a skipped check, an old revision, or a failing executable check.",
        "desiredBehavior": "Require executed passing checks for every required application check at the current subject before the completion transition.",
        "scope": [
          "equipped-feedback-host",
          "personal-profile"
        ],
        "trigger": "application-evidence",
        "mechanism": {
          "handler": "application-evidence",
          "version": 2,
          "rationale": "A workflow gate consumes executable evidence at completion; a one-time test alone cannot prevent a later unsupported done transition."
        },
        "enforcement": "advisory",
        "requiredEvidence": [
          "executed-results",
          "required-checks",
          "subject-identity"
        ],
        "regressionFixtures": [
          "WO-126 verify-app-before-done version 2"
        ],
        "conflicts": [],
        "supersedes": [
          "verify-app-before-done@1"
        ],
        "retirementCondition": "Retire this immutable version only when a named replacement preserves its regression evidence; retain the old definition for replay.",
        "nextMaturityCondition": "Collect host-observed use beyond controlled fixtures, including false activations and overrides, before claiming broader maturity.",
        "proseEquivalent": "Do not call an application change done from prose, a skipped check, an old revision, or a failing executable check. Require executed passing checks for every required application check at the current subject before the completion transition."
      }
    ],
    "mechanisms": [
      {
        "unitId": "anti-oscillation",
        "handler": "decision-lineage",
        "kind": "prose",
        "rung": 7,
        "enforcement": "advisory"
      },
      {
        "unitId": "bounded-boy-scout-cleanup",
        "handler": "cleanup-scope",
        "kind": "prose",
        "rung": 7,
        "enforcement": "advisory"
      },
      {
        "unitId": "concurrent-work-requires-worktrees",
        "handler": "writer-isolation",
        "kind": "pre-effect-guard",
        "rung": 2,
        "enforcement": "hard"
      },
      {
        "unitId": "correctness-over-sycophancy",
        "handler": "evidence-judgment",
        "kind": "prose",
        "rung": 7,
        "enforcement": "advisory"
      },
      {
        "unitId": "fail-conservative-correction",
        "handler": "semantic-correction",
        "kind": "prose",
        "rung": 7,
        "enforcement": "advisory"
      },
      {
        "unitId": "no-attribution",
        "handler": "attribution",
        "kind": "script",
        "rung": 1,
        "enforcement": "hard"
      },
      {
        "unitId": "no-lint-type-disables-as-fixes",
        "handler": "suppression-diff",
        "kind": "script",
        "rung": 1,
        "enforcement": "hard"
      },
      {
        "unitId": "no-partial-completion",
        "handler": "complete-scope",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "advisory"
      },
      {
        "unitId": "read-your-own-output",
        "handler": "output-review",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "advisory"
      },
      {
        "unitId": "verify-app-before-done",
        "handler": "application-evidence",
        "kind": "workflow-gate",
        "rung": 6,
        "enforcement": "advisory"
      }
    ],
    "policyHash": "fnv1a64:69fced00f10fd890"
  }
}, feedbackBoundary, input, rawInput);
}
} catch { const response = { systemMessage: "DotLn advisory: built adapter unavailable; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide." };
try {
  const fs = await import("node:fs");
  const { join } = await import("node:path");
  const { createHash } = await import("node:crypto");
  const root = typeof input?.cwd === "string" ? input.cwd : process.cwd();
  const directory = join(root, "docs/control/local/harness");
  const key = createHash("sha256").update(String(input?.session_id ?? "unknown")).digest("hex");
  const path = join(directory, key + ".jsonl");
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(path) || fs.lstatSync(path).isFile())
    fs.appendFileSync(path, JSON.stringify({ recordedAt: new Date().toISOString(), event: "Stop", advisory: response.systemMessage, delegated: true }) + "\n", { mode: 0o600 });
} catch {}
process.stdout.write(JSON.stringify(response)); }
