// Origin: {"ids":["contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.verifier"],"loadoutId":"contributor","semanticHash":"fnv1a64:c020dc62ca7cc8eb"}
const { text } = await import("node:stream/consumers");
try {
const source = await text(process.stdin);
if (Buffer.byteLength(source) > 1048576) throw new Error("oversized hook input");
const output = await (async function codexContinuation(input, operatorControl) {
    const event = input?.hook_event_name;
    if (!["PostCompact", "SessionStart", "Stop", "UserPromptSubmit"].includes(event) ||
        typeof input.session_id !== "string" ||
        !input.session_id ||
        typeof input.cwd !== "string" ||
        input.agent_id ||
        input.agent_type ||
        input.subagent)
        return {};
    // Recovery controls remain usable without Git, a build, or saved task state.
    const control = await operatorControl(input, event);
    if (control && !/ordinary workflow checks resume/.test(control.systemMessage))
        return event === "SessionStart"
            ? {
                ...control,
                hookSpecificOutput: {
                    hookEventName: event,
                    additionalContext: control.systemMessage,
                },
            }
            : control;
    // Ordinary conversation belongs to the model. This event only carries the
    // existing explicit operator-control commands; it never classifies prose.
    if (event === "UserPromptSubmit")
        return control ?? {};
    try {
        const fs = await import("node:fs");
        const { join } = await import("node:path");
        const { createHash, randomUUID } = await import("node:crypto");
        const { spawnSync } = await import("node:child_process");
        /** @param {string} value */
        const digest = (value) => createHash("sha256").update(value).digest("hex");
        const cwd = fs.realpathSync(input.cwd);
        const git = spawnSync("git", ["rev-parse", "--show-toplevel"], {
            cwd,
            encoding: "utf8",
            timeout: 3000,
        });
        if (git.status !== 0)
            return {};
        const root = fs.realpathSync(git.stdout.trim());
        const directory = join(root, "docs/control/local/harness");
        if (!fs.existsSync(directory) || fs.realpathSync(directory) !== directory)
            return {};
        /** @param {string} path */
        const read = (path) => {
            if (!fs.existsSync(path))
                return null;
            const stat = fs.lstatSync(path);
            if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1000000)
                throw new Error("nonregular or oversized continuation record");
            return JSON.parse(fs.readFileSync(path, "utf8"));
        };
        const key = digest(input.session_id);
        const session = read(join(directory, `${key}.json`));
        if (!session ||
            !/^WO-\d{3}$/.test(session.workOrder ?? "") ||
            !Number.isSafeInteger(session.startingEventCount) ||
            session.startingEventCount < 0)
            return {};
        const path = join(directory, `${key}.codex-continuation.json`);
        let saved = read(path);
        if (saved &&
            (saved.version !== 1 ||
                typeof saved.turnId !== "string" ||
                typeof saved.signature !== "string"))
            throw new Error("invalid continuation record");
        /** @param {string} target @param {Record<string, any>} value */
        const save = (target, value) => {
            const temporary = `${target}.${randomUUID()}.tmp`;
            fs.writeFileSync(temporary, JSON.stringify(value) + "\n", {
                flag: "wx",
                mode: 0o600,
            });
            fs.renameSync(temporary, target);
        };
        const signature = digest(JSON.stringify([
            session.workOrder,
            session.role,
            session.expectedEvent,
            session.startingEventCount,
        ]));
        const blank = { version: 1, signature, turnId: "" };
        if (event === "SessionStart" && input.source !== "compact")
            return {};
        if (event === "PostCompact" &&
            (!["manual", "auto"].includes(input.trigger) ||
                typeof input.turn_id !== "string" ||
                !input.turn_id))
            return {};
        if (event === "Stop" &&
            (input.stop_hook_active !== false ||
                !saved ||
                saved.signature !== signature ||
                saved.turnId !== input.turn_id))
            return {};
        // The explicit session record chooses the task. Branch phase alone is not
        // permission to continue a helper agent, an old session, or another order.
        const expected = {
            executor: ["ImplementationReady", "RepairCompleted"],
            verifier: ["VerificationCompleted"],
            reviewer: ["FinalReviewCompleted"],
        };
        if (!expected[ /** @type {keyof typeof expected} */(session.role)]?.includes(session.expectedEvent))
            return {};
        const status = spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), "status", "--json"], {
            cwd: root,
            encoding: "utf8",
            timeout: 15000,
            maxBuffer: 1000000,
        });
        if (status.status !== 0)
            throw new Error("canonical task state unavailable");
        const task = JSON.parse(status.stdout);
        const phase = /** @type {Record<string, string>} */ ({
            ImplementationReady: "active",
            RepairCompleted: "repairing",
            VerificationCompleted: "verifying",
            FinalReviewCompleted: "final-review",
        })[session.expectedEvent];
        if (task.workOrder !== session.workOrder || task.phase !== phase)
            return {};
        const events = [
            "docs/control/resume.jsonl",
            `docs/control/orders/${session.workOrder}.jsonl`,
        ]
            .flatMap((relative) => {
            const file = join(root, relative);
            if (!fs.existsSync(file))
                return [];
            if (fs.realpathSync(file) !== file || !fs.lstatSync(file).isFile())
                throw new Error("control path aliases");
            return fs
                .readFileSync(file, "utf8")
                .split("\n")
                .filter(Boolean)
                .map((line) => JSON.parse(line));
        })
            .filter((entry) => entry.workOrderId === session.workOrder);
        if (events.length < session.startingEventCount ||
            events
                .slice(session.startingEventCount)
                .some((entry) => entry.type === session.expectedEvent))
            return {};
        const writer = spawnSync(process.execPath, [join(root, "scripts/harness.mjs"), "writer", "--show"], {
            cwd: root,
            encoding: "utf8",
            timeout: 3000,
            maxBuffer: 100000,
        });
        if (writer.status !== 0)
            throw new Error("writer observation unavailable");
        const ownership = JSON.parse(writer.stdout);
        if (ownership.reserved !== true || ownership.actorId !== key)
            return {};
        // Recovery controls may change while the read-only observations are in flight.
        const latestControl = await operatorControl(input, "Status");
        if (latestControl)
            return latestControl;
        const context = `DotLn compaction continuation: this session is the ${session.role} for ${session.workOrder}, phase ${task.phase}; its recorded completion event ${session.expectedEvent} is still outstanding. Continue the authorized unfinished task from the compacted handoff and current worktree. The last conversational message may be old steering or an already answered side question; do not treat it as replacing or completing the task. Check existing commands and agents before starting new work. Run npm run resume -- briefing read-only for the current role path if needed. Do not replay dispatch, create a new writer, or advance another role. Explicit interruption, pause, analysis: and operator override: remain decisive. If a real external blocker requires the operator, state the blocker and needed input without claiming completion.`;
        if (event === "PostCompact") {
            if (!saved ||
                saved.signature !== signature ||
                saved.turnId !== input.turn_id)
                save(path, { ...blank, turnId: input.turn_id });
            return {};
        }
        if (event === "SessionStart")
            return {
                hookSpecificOutput: {
                    hookEventName: "SessionStart",
                    additionalContext: context,
                },
            };
        if (event !== "Stop" ||
            input.stop_hook_active !== false ||
            !saved ||
            saved.signature !== signature ||
            saved.turnId !== input.turn_id)
            return {};
        // Exclusive receipt admits at most one continuation for this compacted turn,
        // including duplicate deliveries. It is never a completion or tool gate.
        const receipt = join(directory, `${key}.codex-continued-${digest(signature + saved.turnId)}.json`);
        try {
            fs.writeFileSync(receipt, JSON.stringify({ version: 1, signature, turnId: saved.turnId }) + "\n", { flag: "wx", mode: 0o600 });
        }
        catch (error) {
            if (error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "EEXIST")
                return {};
            throw error;
        }
        const finalControl = await operatorControl(input, "Status");
        if (finalControl)
            return finalControl;
        return { decision: "block", reason: context };
    }
    catch {
        return {
            systemMessage: "DotLn Codex continuation state is unavailable; no automatic continuation or lifecycle transition was requested. Preserve the current task and inspect its recorded state.",
        };
    }
})(JSON.parse(source), async function operatorControl(input, event) {
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
        const { join } = await import("node:path");
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
            try {
                prior = overrideOf(read());
            }
            catch {
                // An unreadable prior state never withholds a mode change.
            }
            const now = new Date().toISOString();
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
});
process.stdout.write(JSON.stringify(output));
} catch { process.stdout.write(JSON.stringify({systemMessage:"DotLn Codex continuation input unavailable; native stopping remains available."})); }
