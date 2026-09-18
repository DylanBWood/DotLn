/**
 * Source-only Codex adapter, embedded in its generated project hook. No model
 * transcript is read, no lifecycle command is dispatched, and no writer is
 * acquired or released. Missing observations leave native stopping available.
 * @param {Record<string, any>} input
 * @param {typeof import('./operator-control.mjs').operatorControl} operatorControl
 * @returns {Promise<Record<string, any>>}
 */
export async function codexContinuation(input, operatorControl) {
  const event = input?.hook_event_name;
  if (
    !["PostCompact", "SessionStart", "Stop", "UserPromptSubmit"].includes(
      event,
    ) ||
    typeof input.session_id !== "string" ||
    !input.session_id ||
    typeof input.cwd !== "string" ||
    input.agent_id ||
    input.agent_type ||
    input.subagent
  )
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
  if (event === "UserPromptSubmit") return control ?? {};

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
    if (git.status !== 0) return {};
    const root = fs.realpathSync(git.stdout.trim());
    const directory = join(root, "docs/control/local/harness");
    if (!fs.existsSync(directory) || fs.realpathSync(directory) !== directory)
      return {};
    /** @param {string} path */
    const read = (path) => {
      if (!fs.existsSync(path)) return null;
      const stat = fs.lstatSync(path);
      if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1000000)
        throw new Error("nonregular or oversized continuation record");
      return JSON.parse(fs.readFileSync(path, "utf8"));
    };
    const key = digest(input.session_id);
    const session = read(join(directory, `${key}.json`));
    if (
      !session ||
      !/^WO-\d{3}$/.test(session.workOrder ?? "") ||
      !Number.isSafeInteger(session.startingEventCount) ||
      session.startingEventCount < 0
    )
      return {};
    const path = join(directory, `${key}.codex-continuation.json`);
    let saved = read(path);
    if (
      saved &&
      (saved.version !== 1 ||
        typeof saved.turnId !== "string" ||
        typeof saved.signature !== "string")
    )
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
    const signature = digest(
      JSON.stringify([
        session.workOrder,
        session.role,
        session.expectedEvent,
        session.startingEventCount,
      ]),
    );
    const blank = { version: 1, signature, turnId: "" };
    if (event === "SessionStart" && input.source !== "compact") return {};
    if (
      event === "PostCompact" &&
      (!["manual", "auto"].includes(input.trigger) ||
        typeof input.turn_id !== "string" ||
        !input.turn_id)
    )
      return {};
    if (
      event === "Stop" &&
      (input.stop_hook_active !== false ||
        !saved ||
        saved.signature !== signature ||
        saved.turnId !== input.turn_id)
    )
      return {};

    // The explicit session record chooses the task. Branch phase alone is not
    // permission to continue a helper agent, an old session, or another order.
    const expected = {
      executor: ["ImplementationReady", "RepairCompleted"],
      verifier: ["VerificationCompleted"],
      reviewer: ["FinalReviewCompleted"],
    };
    if (
      !expected[/** @type {keyof typeof expected} */ (session.role)]?.includes(
        session.expectedEvent,
      )
    )
      return {};
    const status = spawnSync(
      process.execPath,
      [join(root, "scripts/resume.mjs"), "status", "--json"],
      {
        cwd: root,
        encoding: "utf8",
        timeout: 15000,
        maxBuffer: 1000000,
      },
    );
    if (status.status !== 0)
      throw new Error("canonical task state unavailable");
    const task = JSON.parse(status.stdout);
    const phase = /** @type {Record<string, string>} */ ({
      ImplementationReady: "active",
      RepairCompleted: "repairing",
      VerificationCompleted: "verifying",
      FinalReviewCompleted: "final-review",
    })[session.expectedEvent];
    if (task.workOrder !== session.workOrder || task.phase !== phase) return {};
    const events = [
      "docs/control/resume.jsonl",
      `docs/control/orders/${session.workOrder}.jsonl`,
    ]
      .flatMap((relative) => {
        const file = join(root, relative);
        if (!fs.existsSync(file)) return [];
        if (fs.realpathSync(file) !== file || !fs.lstatSync(file).isFile())
          throw new Error("control path aliases");
        return fs
          .readFileSync(file, "utf8")
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line));
      })
      .filter((entry) => entry.workOrderId === session.workOrder);
    if (
      events.length < session.startingEventCount ||
      events
        .slice(session.startingEventCount)
        .some((entry) => entry.type === session.expectedEvent)
    )
      return {};
    const writer = spawnSync(
      process.execPath,
      [join(root, "scripts/harness.mjs"), "writer", "--show"],
      {
        cwd: root,
        encoding: "utf8",
        timeout: 3000,
        maxBuffer: 100000,
      },
    );
    if (writer.status !== 0) throw new Error("writer observation unavailable");
    const ownership = JSON.parse(writer.stdout);
    if (ownership.reserved !== true || ownership.actorId !== key) return {};

    // Recovery controls may change while the read-only observations are in flight.
    const latestControl = await operatorControl(input, "Status");
    if (latestControl) return latestControl;

    const context = `DotLn compaction continuation: this session is the ${session.role} for ${session.workOrder}, phase ${task.phase}; its recorded completion event ${session.expectedEvent} is still outstanding. Continue the authorized unfinished task from the compacted handoff and current worktree. The last conversational message may be old steering or an already answered side question; do not treat it as replacing or completing the task. Check existing commands and agents before starting new work. Run npm run resume -- briefing read-only for the current role path if needed. Do not replay dispatch, create a new writer, or advance another role. Explicit interruption, pause, analysis: and operator override: remain decisive. If a real external blocker requires the operator, state the blocker and needed input without claiming completion.`;
    if (event === "PostCompact") {
      if (
        !saved ||
        saved.signature !== signature ||
        saved.turnId !== input.turn_id
      )
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
    if (
      event !== "Stop" ||
      input.stop_hook_active !== false ||
      !saved ||
      saved.signature !== signature ||
      saved.turnId !== input.turn_id
    )
      return {};
    // Exclusive receipt admits at most one continuation for this compacted turn,
    // including duplicate deliveries. It is never a completion or tool gate.
    const receipt = join(
      directory,
      `${key}.codex-continued-${digest(signature + saved.turnId)}.json`,
    );
    try {
      fs.writeFileSync(
        receipt,
        JSON.stringify({ version: 1, signature, turnId: saved.turnId }) + "\n",
        { flag: "wx", mode: 0o600 },
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "EEXIST"
      )
        return {};
      throw error;
    }
    const finalControl = await operatorControl(input, "Status");
    if (finalControl) return finalControl;
    return { decision: "block", reason: context };
  } catch {
    return {
      systemMessage:
        "DotLn Codex continuation state is unavailable; no automatic continuation or lifecycle transition was requested. Preserve the current task and inspect its recorded state.",
    };
  }
}
