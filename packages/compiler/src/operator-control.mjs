/**
 * Self-contained on purpose: the compiler embeds this function in each hook,
 * ahead of all runtime imports. Only Node builtins and session-local temporary
 * state participate. Do not introduce a dependency on repository health here.
 *
 * WO-158: while an override is open the session keeps the operator's own
 * prompts as its authority, and leaving it returns `overrideExit` so the
 * session hook can append OperatorOverrideRecorded naming those words, or
 * print the exact command when it cannot. Neither is a condition of the exit.
 *
 * @param {{ session_id?: string, prompt?: string }} input
 * @param {string} event
 * @returns {Promise<null | { systemMessage: string, hookSpecificOutput?: { hookEventName: string, additionalContext: string }, overrideExit?: { enteredAt: string, exitedAt: string, words: string[], advisory: string } }>}
 */
export async function operatorControl(input, event) {
  const prompt =
    event === "UserPromptSubmit" ? (input.prompt?.trim() ?? "") : "";
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
    const instruction =
      mode === "analysis"
        ? "Pause the current routine. Explain the observed state and accept operator direction. Preserve pending work; do not resume it automatically."
        : mode === "override"
          ? "DotLn hook enforcement is suspended for this session. Carry out the operator's recovery instructions and record bypassed requirements truthfully."
          : "DotLn operator-control storage is unavailable. Keep diagnosis and operator-directed recovery accessible.";
    const context =
      instruction +
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
    const limit =
      "[DotLn: later operator words were not retained; 64 KiB capture limit]";
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
  const advisory = (exited) =>
    `Record the override for the selected open work order: npm run resume -- override-record --bypassed dotln-hook-enforcement --effects <what the recovery changed, or none> --reason 'operator override from ${exited.enteredAt} to ${exited.exitedAt}' [--capture <ignored intake file holding the operator's override words> --capture-hash sha256:<digest>] --harness <harness> --harness-version <version> --model <model> --effort <level> --source <source>. With no open order (closed, withdrawn or none selected), record the override and what it changed in the order's decisions. The role's completion carries this duty; the record is never a precondition for entering or leaving override.`;
  if (!input.session_id)
    return entered ? message(requested ?? "unavailable") : null;
  try {
    const fs = await import("node:fs");
    const { join } = await import("node:path");
    const { tmpdir } = await import("node:os");
    const { createHash, randomUUID } = await import("node:crypto");
    const directory = join(
      tmpdir(),
      `dotln-operator-control-${process.getuid?.() ?? "user"}`,
    );
    const key = createHash("sha256").update(input.session_id).digest("hex");
    const path = join(directory, `${key}.json`);
    const read = () => {
      try {
        return JSON.parse(fs.readFileSync(path, "utf8"));
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "ENOENT"
        )
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
    const overrideOf = (saved) =>
      saved?.override &&
      typeof saved.override.enteredAt === "string" &&
      Array.isArray(saved.override.words)
        ? {
            enteredAt: saved.override.enteredAt,
            words: saved.override.words.filter(
              (/** @type {unknown} */ word) => typeof word === "string",
            ),
          }
        : undefined;
    let mode = "normal";
    /** @type {{ enteredAt: string, exitedAt: string, words: string[] } | undefined} */
    let exited;
    if (requested) {
      let prior;
      try {
        prior = overrideOf(read());
      } catch {
        // An unreadable prior state never withholds a mode change.
      }
      const now = new Date().toISOString();
      // An override stays open across an analysis pause until an explicit off.
      const override =
        requested === "override"
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
      if (requested === "normal" && prior) exited = { ...prior, exitedAt: now };
      mode = requested;
    } else {
      const saved = read();
      if (saved === null) return null;
      if (
        saved.version !== 1 ||
        !["analysis", "override", "normal"].includes(saved.mode)
      )
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
        } catch {
          // Retention is evidence, never a condition of the override.
        }
    }
    if (mode !== "normal") return message(mode);
    return exit
      ? {
          systemMessage:
            "DotLn: operator-control exited; ordinary workflow checks resume. No lifecycle dispatch occurred.",
          ...(exited
            ? { overrideExit: { ...exited, advisory: advisory(exited) } }
            : {}),
        }
      : null;
  } catch {
    // A broken recovery-state store must not become another recovery gate.
    return message(
      requested && requested !== "normal" ? requested : "unavailable",
      "Recovery state could not be read or persisted; this hook remains advisory.",
    );
  }
}
