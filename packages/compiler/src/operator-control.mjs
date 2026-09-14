/**
 * Self-contained on purpose: the compiler embeds this function in each hook,
 * ahead of all runtime imports. Only Node builtins and session-local temporary
 * state participate. Do not introduce a dependency on repository health here.
 *
 * @param {{ session_id?: string, prompt?: string }} input
 * @param {string} event
 * @returns {Promise<null | { systemMessage: string, hookSpecificOutput?: { hookEventName: string, additionalContext: string } }>}
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
    let mode = "normal";
    if (requested) {
      fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
      const temporary = `${path}.${randomUUID()}`;
      fs.writeFileSync(
        temporary,
        JSON.stringify({
          version: 1,
          mode: requested,
          observedAt: new Date().toISOString(),
        }) + "\n",
        { mode: 0o600, flag: "wx" },
      );
      fs.renameSync(temporary, path);
      mode = requested;
    } else {
      let saved;
      try {
        saved = JSON.parse(fs.readFileSync(path, "utf8"));
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
      if (
        saved.version !== 1 ||
        !["analysis", "override", "normal"].includes(saved.mode)
      )
        throw new Error("operator-control state unavailable");
      mode = saved.mode;
    }
    if (mode !== "normal") return message(mode);
    return exit
      ? {
          systemMessage:
            "DotLn: operator-control exited; ordinary workflow checks resume. No lifecycle dispatch occurred.",
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
