/**
 * Source-only Codex adapter, embedded in its generated project hook. It
 * dispatches no lifecycle command, and it reads the host's transcript only to
 * find the first reply after a compaction.
 *
 * For a dispatched session it journals each operator message with its form
 * class and keeps the message's bounded text beside the journal; after a
 * compaction it restores every one of those messages with the task, permits
 * one continuation after a premature stop and records the first reply against
 * the saved task. A turn that stops without asking for a continuation lets the
 * session's own writer reservation go, and the next prompt of a session whose
 * dispatch is still outstanding reserves it again, as Claude's hooks do around
 * each turn. Only a session whose prompt hook has been observed releases, so a
 * host that delivers no prompt event keeps the reservation until completion.
 * Missing observations leave native stopping available.
 * @param {Record<string, any>} input
 * @param {typeof import('./operator-control.mjs').operatorControl} operatorControl
 * @param {(prompt: string) => { prefix: string | null, prefixLine: number | null, class: string }} [classify]
 * @param {(root: string) => Promise<Record<string, any> | null>} [loadRuntime]
 * @param {(session: { intent?: string, role?: string }) => string} [phaseOf]
 *   The harness's own phase resolver, so both journal writers name a phase alike.
 * @returns {Promise<Record<string, any>>}
 */
export async function codexContinuation(
  input,
  operatorControl,
  classify,
  loadRuntime,
  phaseOf,
) {
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

  const fs = await import("node:fs");
  const { join } = await import("node:path");
  const { createHash, randomUUID } = await import("node:crypto");
  const { spawnSync } = await import("node:child_process");
  const { pathToFileURL } = await import("node:url");
  /** @param {string} value */
  const digest = (value) => createHash("sha256").update(value).digest("hex");
  const key = digest(input.session_id);
  /** @param {string} path */
  const read = (path) => {
    if (!fs.existsSync(path)) return null;
    const stat = fs.lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1000000)
      throw new Error("nonregular or oversized continuation record");
    return JSON.parse(fs.readFileSync(path, "utf8"));
  };
  /** One JSON row per line; a file that is absent holds none.
   * @param {string} path @returns {Record<string, any>[]} */
  const rows = (path) => {
    if (!fs.existsSync(path)) return [];
    const stat = fs.lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink())
      throw new Error("nonregular session journal");
    return fs
      .readFileSync(path, "utf8")
      .split("\n")
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch {
          return [];
        }
      });
  };
  /** @param {string} path @param {Record<string, any>} value */
  const append = (path, value) =>
    fs.appendFileSync(
      path,
      JSON.stringify({ recordedAt: new Date().toISOString(), ...value }) + "\n",
      { mode: 0o600 },
    );
  /** At most `limit` UTF-8 bytes of the text, cut before a character that
   * would not fit whole, and whether any was cut.
   * @param {string} text @param {number} limit */
  const bounded = (text, limit) => {
    const bytes = Buffer.from(text, "utf8");
    if (bytes.length <= limit) return { text, truncated: false };
    let end = Math.max(0, limit);
    // A continuation byte (10xxxxxx) belongs to the character before it.
    while (end > 0 && ((bytes[end] ?? 0) & 0xc0) === 0x80) end--;
    return { text: bytes.subarray(0, end).toString("utf8"), truncated: true };
  };
  /** The checkout's ignored harness lane, or null when it has none. */
  const lane = () => {
    const cwd = fs.realpathSync(input.cwd);
    const git = spawnSync("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
      timeout: 3000,
    });
    if (git.status !== 0) return null;
    const root = fs.realpathSync(git.stdout.trim());
    const directory = join(root, "docs/control/local/harness");
    return fs.existsSync(directory) && fs.realpathSync(directory) === directory
      ? { root, directory }
      : null;
  };
  /** The built harness runtime that owns writer reservations, if any.
   * @param {string} root */
  const runtime = async (root) => {
    try {
      if (loadRuntime) return await loadRuntime(root);
      const path = join(root, "packages/skeleton/dist/src/harness-host.js");
      return fs.existsSync(path)
        ? await import(pathToFileURL(path).href)
        : null;
    } catch {
      return null;
    }
  };
  /** @type {Record<string, string[]>} */
  const expected = {
    executor: ["ImplementationReady", "RepairCompleted"],
    verifier: ["VerificationCompleted"],
    reviewer: ["FinalReviewCompleted"],
  };
  /** The order's control events, read where its lifecycle writes them.
   * @param {string} root @param {string} workOrder */
  const orderEvents = (root, workOrder) =>
    ["docs/control/resume.jsonl", `docs/control/orders/${workOrder}.jsonl`]
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
      .filter((entry) => entry.workOrderId === workOrder);
  /** Whether the session's recorded dispatch still awaits its completion.
   * @param {string} root @param {Record<string, any> | null} session */
  const outstanding = (root, session) => {
    if (
      !session ||
      !/^WO-\d{3}$/.test(session.workOrder ?? "") ||
      !Number.isSafeInteger(session.startingEventCount) ||
      session.startingEventCount < 0 ||
      !expected[session.role]?.includes(session.expectedEvent)
    )
      return false;
    const events = orderEvents(root, session.workOrder);
    return (
      events.length >= session.startingEventCount &&
      !events
        .slice(session.startingEventCount)
        .some((entry) => entry.type === session.expectedEvent)
    );
  };
  const since = (/** @type {Record<string, any>} */ session) =>
    session.boundDispatch?.startedAt ?? session.startedAt ?? "";

  if (event === "UserPromptSubmit") {
    // Ordinary conversation belongs to the model. The hook classes a message
    // by its form only and interprets none: it keeps what the operator said
    // for a compaction to restore, and a resumed turn reserves its writer.
    // Each step fails alone, so a lost capture never costs the writer and an
    // unreadable state never withholds the operator's prompt.
    let found = null;
    /** @type {Record<string, any> | null} */
    let session = null;
    try {
      found = lane();
      if (found) session = read(join(found.directory, `${key}.json`));
    } catch {
      return control ?? {};
    }
    if (!found) return control ?? {};
    const { root, directory } = found;
    const journal = join(directory, `${key}.jsonl`);
    if (!session || !/^WO-\d{3}$/.test(session.workOrder ?? "")) {
      try {
        append(journal, { event, codexPromptObserved: true });
      } catch {
        // The marker only admits a later stop's release; without it the
        // reservation is kept until completion.
      }
      return control ?? {};
    }
    const prompt = typeof input.prompt === "string" ? input.prompt : "";
    const form =
      typeof classify === "function"
        ? classify(prompt)
        : { prefix: null, prefixLine: null, class: "unclassified" };
    const messageDigest = digest(prompt);
    try {
      append(journal, {
        event,
        typedEvent: "OperatorMessageObserved",
        workOrder: session.workOrder,
        role: session.role ?? "unknown",
        phase:
          typeof phaseOf === "function"
            ? phaseOf(session)
            : (session.role ?? "unknown"),
        source: "codex-prompt-hook",
        route: "unknown",
        routeSource: "codex-prompt-hook",
        attribution: "operator",
        ...form,
        digest: messageDigest,
        bytes: Buffer.byteLength(prompt),
      });
    } catch {
      // The journal row is an observation; the capture and the writer remain.
    }
    try {
      // The text itself stays out of the metadata journal, in its own lane
      // file, bounded as an override capture is.
      append(join(directory, `${key}.codex-messages.jsonl`), {
        kind: "operator",
        class: form.class,
        digest: messageDigest,
        ...bounded(prompt, 65536),
      });
    } catch {
      // A compaction then restores the task without this message.
    }
    let dispatchOutstanding = false;
    try {
      dispatchOutstanding = outstanding(root, session);
    } catch {
      return control ?? {};
    }
    if (!dispatchOutstanding) return control ?? {};
    const host = await runtime(root);
    if (typeof host?.reserveCodexDispatchWriter !== "function")
      return control ?? {};
    try {
      host.reserveCodexDispatchWriter(root, input.session_id);
      return control ?? {};
    } catch (error) {
      const note = `DotLn: this Codex session does not hold this worktree's writer, so it writes nothing here until the holder releases it. ${String(/** @type {Error} */ (error)?.message ?? error)}`;
      return {
        ...(control ?? {}),
        hookSpecificOutput: {
          hookEventName: event,
          additionalContext: note,
        },
      };
    }
  }

  let found = null;
  /** @type {Record<string, any>} */
  let outcome = {};
  try {
    found = lane();
    outcome = found ? await continuation(found.root, found.directory) : {};
  } catch {
    outcome = {
      systemMessage:
        "DotLn Codex continuation state is unavailable; no automatic continuation or lifecycle transition was requested. Preserve the current task and inspect its recorded state.",
    };
  }
  if (event !== "Stop" || !found) return outcome;
  // A stopped turn's observations never change its stopping.
  try {
    probeCompactedTurn(found.directory);
  } catch {
    // The probe is an observation only.
  }
  if (outcome.decision !== "block")
    try {
      await releaseStoppedTurn(found.root, found.directory);
    } catch {
      // The reservation stays as it was; the holder's own completion or the
      // operator's release still applies.
    }
  return outcome;

  /** The compaction continuation: save the compacted turn, restore the task
   * and the operator's messages, and continue once after a premature stop.
   * @param {string} root @param {string} directory */
  async function continuation(root, directory) {
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
    if (!expected[session.role]?.includes(session.expectedEvent)) return {};
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
    if (!outstanding(root, session)) return {};
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

    const context = `DotLn compaction continuation: this session is the ${session.role} for ${session.workOrder}, phase ${task.phase}; its recorded completion event ${session.expectedEvent} is still outstanding. Continue the authorized unfinished task from the compacted handoff and current worktree. The last conversational message may be old steering or an already answered side question; do not treat it as replacing or completing the task. Check existing commands and agents before starting new work. Run npm run resume -- briefing read-only for the current role path if needed. Do not replay dispatch, create a new writer, or advance another role. Explicit interruption, pause, analysis: and operator override: remain decisive. If a real external blocker requires the operator, state the blocker and needed input without claiming completion.${restored(directory, session)}`;
    if (event === "PostCompact") {
      // Each compaction is recorded with the session and task it saved, so
      // the first reply after it can be read against them.
      save(path, {
        version: 1,
        signature,
        turnId: input.turn_id,
        sessionKey: key,
        task: {
          workOrder: session.workOrder,
          role: session.role,
          expectedEvent: session.expectedEvent,
        },
        compactedAt: new Date().toISOString(),
      });
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
  }

  /** Every operator message since this dispatch, verbatim and oldest first.
   * Each is bounded once, at 64 KiB when it was captured, and nothing cuts it
   * again here, so no instruction is lost for the others' length.
   * @param {string} directory @param {Record<string, any>} session */
  function restored(directory, session) {
    const start = since(session);
    const messages = rows(
      join(directory, `${key}.codex-messages.jsonl`),
    ).filter(
      (row) =>
        row.kind === "operator" &&
        typeof row.text === "string" &&
        typeof row.recordedAt === "string" &&
        row.recordedAt >= start,
    );
    if (!messages.length) return "";
    return `\nOperator messages since this dispatch, every one restored verbatim, oldest first. A request among them still stands; a question is answered and changes nothing by itself; none of them is a new dispatch.\n${messages
      .map(
        (row, index) =>
          `[${index + 1}] ${row.class ?? "unclassified"}, ${row.recordedAt}${row.truncated ? ", cut at 64 KiB when it was captured" : ""}:\n${row.text}`,
      )
      .join("\n")}`;
  }

  /** The first assistant message after the turn's last compaction, read from
   * the host's transcript: the first assistant `message` item after its last
   * `compacted` entry. When the transcript cannot be read or holds neither,
   * the stop's own last message stands in and says so.
   * @returns {{ text: string, source: string, phase: string | null, at: string | null } | null} */
  function firstReplyAfterCompaction() {
    const path = input.transcript_path;
    if (typeof path === "string" && path)
      try {
        const stat = fs.lstatSync(path);
        if (stat.isFile() && !stat.isSymbolicLink()) {
          // A long session's transcript is read from its last 64 MiB.
          const limit = 67108864;
          const start = Math.max(0, stat.size - limit);
          const buffer = Buffer.alloc(stat.size - start);
          const descriptor = fs.openSync(path, "r");
          try {
            fs.readSync(descriptor, buffer, 0, buffer.length, start);
          } finally {
            fs.closeSync(descriptor);
          }
          const entries = buffer
            .toString("utf8")
            .split("\n")
            .flatMap((line) => {
              try {
                return [JSON.parse(line)];
              } catch {
                return [];
              }
            });
          let compacted = entries.length - 1;
          while (compacted >= 0 && entries[compacted]?.type !== "compacted")
            compacted--;
          if (compacted >= 0)
            for (const entry of entries.slice(compacted + 1)) {
              const item =
                entry?.type === "response_item" ? entry.payload : null;
              if (
                item?.type !== "message" ||
                item.role !== "assistant" ||
                !Array.isArray(item.content)
              )
                continue;
              const text = item.content
                .filter(
                  (/** @type {any} */ part) =>
                    part?.type === "output_text" &&
                    typeof part.text === "string",
                )
                .map((/** @type {any} */ part) => part.text)
                .join("\n");
              if (text)
                return {
                  text,
                  source: "transcript",
                  phase: typeof item.phase === "string" ? item.phase : null,
                  at:
                    typeof entry.timestamp === "string"
                      ? entry.timestamp
                      : null,
                };
            }
        }
      } catch {
        // The stop's own message stands in below.
      }
    return typeof input.last_assistant_message === "string"
      ? {
          text: input.last_assistant_message,
          source: "stop-last-message",
          phase: null,
          at: null,
        }
      : null;
  }

  /** The first reply after each compaction, recorded once against the task
   * the compaction saved, whether or not this stop is then continued.
   * @param {string} directory */
  function probeCompactedTurn(directory) {
    const journal = join(directory, `${key}.jsonl`);
    const saved = read(join(directory, `${key}.codex-continuation.json`));
    if (
      saved?.version === 1 &&
      saved.turnId === input.turn_id &&
      typeof saved.compactedAt === "string"
    ) {
      const reply = firstReplyAfterCompaction();
      if (!reply) return;
      const probe = join(
        directory,
        `${key}.codex-probe-${digest(`${saved.turnId}\n${saved.compactedAt}`)}.json`,
      );
      try {
        fs.writeFileSync(probe, JSON.stringify({ version: 1 }) + "\n", {
          flag: "wx",
          mode: 0o600,
        });
      } catch {
        // An earlier stop of this compaction recorded it.
        return;
      }
      const replyDigest = digest(reply.text);
      append(journal, {
        event,
        compactionProbe: {
          sessionKey: key,
          turnId: saved.turnId,
          compactedAt: saved.compactedAt,
          task: saved.task ?? null,
          firstAssistantMessage: {
            source: reply.source,
            phase: reply.phase,
            at: reply.at,
            digest: replyDigest,
            bytes: Buffer.byteLength(reply.text),
            excerpt: bounded(reply.text, 240).text,
          },
        },
      });
      append(join(directory, `${key}.codex-messages.jsonl`), {
        kind: "assistant-after-compaction",
        turnId: saved.turnId,
        source: reply.source,
        digest: replyDigest,
        ...bounded(reply.text, 65536),
      });
    }
  }

  /** A turn that asked for no continuation lets this session's own writer
   * reservation go, journaled as a stopped dispatch, once its prompt hook is
   * observed so that the next prompt can reserve it again.
   * @param {string} root @param {string} directory */
  async function releaseStoppedTurn(root, directory) {
    const journal = join(directory, `${key}.jsonl`);
    const session = read(join(directory, `${key}.json`));
    if (
      !session ||
      !rows(journal).some(
        (row) =>
          row.codexPromptObserved === true ||
          row.source === "codex-prompt-hook",
      )
    )
      return;
    const host = await runtime(root);
    if (
      typeof host?.harnessWriterView !== "function" ||
      typeof host?.releaseStoppedDispatch !== "function"
    )
      return;
    const view = host.harnessWriterView(root);
    if (view.reserved !== true || view.actorId !== key) return;
    host.releaseStoppedDispatch(root, input.session_id, {
      role: session.role ?? "unknown",
      workOrder: session.workOrder ?? null,
      command: "turn",
      turnId: typeof input.turn_id === "string" ? input.turn_id : null,
      dispatchOutstanding: outstanding(root, session),
    });
  }
}
