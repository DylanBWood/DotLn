import {
  closeSync,
  constants,
  fstatSync,
  openSync,
  readFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";
import {
  decodeRuntimeStatus,
  type RuntimeStatusV1,
} from "@dotln/skeleton/dist/src/runtime-status-contract.js";
import { decodeLog, type Event } from "@dotln/kernel";
import { projectAuditEvents } from "@dotln/skeleton/dist/src/audit.js";
import { displayWidth } from "./render.js";
import { renderRuntimeStatus } from "./runtime-status.js";
import { readConsoleConnection } from "./console-client-node.js";
import { invokeConsoleCommand, readConsoleContract } from "./console-client.js";

const regularText = (path: string) => {
  const fd = openSync(path, constants.O_RDONLY | constants.O_NONBLOCK);
  try {
    if (!fstatSync(fd).isFile()) throw new Error("not a regular file");
    return readFileSync(fd, "utf8");
  } finally {
    closeSync(fd);
  }
};
// Sanitize fields BEFORE joining structural lines, including embedded LF/tab.
const field = (value: string) =>
  value.replace(
    /[\u0000-\u001f\u007f-\u009f\u2028-\u202e\u2066-\u2069]/gu,
    "?",
  );
type Snapshot = {
  status: RuntimeStatusV1 | null;
  events: readonly Event[] | null;
};
function snapshot(directory: string): Snapshot {
  let status: RuntimeStatusV1 | null = null;
  let events: readonly Event[] | null = null;
  try {
    status = decodeRuntimeStatus(
      JSON.parse(regularText(join(directory, "runtime-status-v1.json"))),
    );
  } catch {
    /* unavailable */
  }
  try {
    events = decodeLog(regularText(join(directory, "events.jsonl")));
  } catch {
    /* unavailable */
  }
  return { status, events };
}
const recentEvents = (events: readonly Event[] | null) =>
  (events ?? []).filter((event) => event.type !== "ClockSampled");
function eventLabel(event: Event): string {
  const payload: Record<string, unknown> =
    event.payload !== null &&
    typeof event.payload === "object" &&
    !Array.isArray(event.payload)
      ? (event.payload as Record<string, unknown>)
      : {};
  const labels: Record<string, string> = {
    ScriptEpisodeDispatched: "Script started",
    ScriptEpisodeObserved:
      payload["verified"] === true
        ? "Script completed (verified)"
        : "Script ended (not verified)",
    ScriptEpisodeCancelled: "Script cancelled",
    OperatorPresenceObserved: "Presence observed",
    ConsoleCommandInvoked: "Console command submitted",
    ConsoleCommandObserved: `Console command finished (exit ${typeof payload["exitCode"] === "number" && Number.isSafeInteger(payload["exitCode"]) ? payload["exitCode"] : "unknown"})`,
  };
  return field(
    Object.hasOwn(labels, event.type) ? labels[event.type]! : event.type,
  );
}
const clock = (at: number) => {
  const date = new Date(at);
  return Number.isNaN(date.getTime())
    ? "unknown"
    : date.toISOString().slice(11, 19);
};
function renderSnapshot({ status: view, events }: Snapshot): string {
  const lines = ["DotLn live console"];
  if (view) {
    lines.push(
      `Presence: ${view.presence.present ? "present" : "away"} · signal ${view.presence.signal} · phase ${field(view.presence.phase ?? "none")}`,
      `Actors: ${view.actors.map((actor) => `${field(actor.phase)}: ${field(actor.kind)} (${actor.availability})`).join(", ") || "none configured"}`,
      `Live episodes: ${view.liveEpisodes.map((episode) => `${field(episode.episodeId)}: ${field(episode.actor)} running ${Math.floor(episode.elapsedMs / 1000)}s`).join(", ") || "none"}`,
      `Cadence (UTC): ${view.presence.cadences.map((cadence) => `${field(cadence.phase)} ${cadence.nextFireAt === null ? "not armed" : clock(cadence.nextFireAt)}`).join(", ") || "none"}`,
      `Holds: ${view.holds.map((hold) => field(hold.reason)).join(", ") || "none"} · Budget: ${view.budget.status}, ${view.budget.episodes.consumed} episodes used`,
      `Open work orders (${view.workOrders.status})${view.workOrders.reason ? `: ${view.workOrders.reason}` : ""} — ${view.workOrders.items.length} total; type orders for all`,
      ...view.workOrders.items
        .slice(0, 3)
        .map(
          (order) =>
            `  ${order.order}: ${field(order.phase)} · dependencies ${order.dependency} · verdict ${order.verdict ?? "unknown"}`,
        ),
    );
  } else lines.push("Runtime status unavailable; waiting for a valid update.");
  try {
    if (!events?.length) throw new Error("no events");
    const audit = projectAuditEvents(events);
    const receipt = audit.receipt.receipts.at(-1);
    const timeline = audit.timeline.entries.at(-1);
    lines.push(
      "Audit preview (partial; type audit for full projections)",
      `  L0 RECEIPT: ${receipt ? `${field(receipt.actor)} · ${field(receipt.action)} · ${field(receipt.outcome)}` : "no projected receipts"}`,
      `  CAUSAL TIMELINE (L1): ${timeline ? `${timeline.timelineOrdinal} · ${field(timeline.action)} · ${field(timeline.outcome)}` : "no projected entries"}`,
      "  GOVERNED RAW JSON (L4): omitted here; type audit",
      "Recent resident events (raw names, clock samples omitted):",
      ...recentEvents(events)
        .slice(-3)
        .map((event) => `  ${eventLabel(event)}`),
    );
  } catch {
    lines.push("Audit unavailable; waiting for a valid event log.");
  }
  return lines.join("\n") + "\n";
}

/** Passive, bounded projection; clock samples alone do not repaint the view. */
export function renderLiveView(directory: string): string {
  return renderSnapshot(snapshot(directory));
}
function changes(before: Snapshot | undefined, after: Snapshot): string[] {
  if (!before) return ["Initial view"];
  const result: string[] = [];
  const prior = before.status;
  const next = after.status;
  if (Boolean(prior) !== Boolean(next))
    result.push(next ? "Status available" : "Status unavailable");
  if (prior && next) {
    if (prior.presence.present !== next.presence.present)
      result.push(
        `Presence: ${prior.presence.present ? "present" : "away"} → ${next.presence.present ? "present" : "away"}`,
      );
    const oldIds = new Set(prior.liveEpisodes.map((e) => e.episodeId));
    const newIds = new Set(next.liveEpisodes.map((e) => e.episodeId));
    if ([...newIds].some((id) => !oldIds.has(id))) result.push("Actor started");
    if ([...oldIds].some((id) => !newIds.has(id)))
      result.push("Actor finished or stopped");
    if (JSON.stringify(prior.workOrders) !== JSON.stringify(next.workOrders))
      result.push("Work orders changed");
    if (JSON.stringify(prior.holds) !== JSON.stringify(next.holds))
      result.push("Holds changed");
  }
  const oldEvents = new Set(recentEvents(before.events).map((e) => e.eventId));
  const added = recentEvents(after.events).filter(
    (e) => !oldEvents.has(e.eventId),
  );
  const script = added.findLast(
    (e) =>
      e.type === "ScriptEpisodeObserved" ||
      e.type === "ScriptEpisodeDispatched",
  );
  if (script) result.push(eventLabel(script));
  if (!result.length && added.length) result.push(eventLabel(added.at(-1)!));
  return result;
}
export function watchLiveView(
  directory: string,
  changed: (text: string, changes: readonly string[]) => void,
) {
  let previousText: string | undefined;
  let previous: Snapshot | undefined;
  const refresh = () => {
    const current = snapshot(directory);
    const text = renderSnapshot(current);
    if (text !== previousText) {
      changed(text, changes(previous, current));
      previousText = text;
    }
    previous = current;
  };
  const timer = setInterval(refresh, 1000);
  refresh();
  return { close: () => clearInterval(timer) };
}

/** Friendly controls are aliases for existing command IDs, not new authority. */
export function liveCommand(
  line: string,
  directory?: string,
): { command: string; args: string[] } {
  const aliases: Record<string, string> = {
    away: "dotln.presence-away",
    back: "dotln.presence-back",
    audit: "dotln.audit",
    ":audit": "dotln.audit",
    diff: "skeleton.compiled-diff",
  };
  if (Object.hasOwn(aliases, line)) {
    if (line === "diff") return { command: aliases[line]!, args: [] };
    if (!directory) throw new Error("A resident store is required.");
    return { command: aliases[line]!, args: ["--store", directory] };
  }
  const value: unknown = JSON.parse(line);
  if (
    !Array.isArray(value) ||
    !value.length ||
    !value.every((word) => typeof word === "string") ||
    !value[0]
  )
    throw new Error("Use away, back, diff, audit, or a JSON command array.");
  return { command: value[0] as string, args: value.slice(1) as string[] };
}
export async function invokeLiveCommand(
  directory: string,
  line: string,
  signal?: AbortSignal,
) {
  return invokeConsoleCommand(
    readConsoleConnection(directory),
    { version: 1, ...liveCommand(line, directory) },
    signal,
  );
}

export async function liveCli(args: string[]): Promise<void> {
  if (
    args.length !== 2 ||
    args[0] !== "--store" ||
    !args[1] ||
    args[1].startsWith("--")
  )
    throw new Error("usage: console live --store <directory>");
  const directory = resolve(args[1]);
  const terminal = Boolean(process.stdin.isTTY && process.stderr.isTTY);
  const input = createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal,
    crlfDelay: Infinity,
  });
  input.setPrompt("live> ");
  const abort = new AbortController();
  let closing = false,
    busy = false,
    paused = false,
    alternate = false;
  let latest = "",
    lastChange = "Initial view",
    lastResult = "";
  const screen = (on: boolean) => {
    if (!terminal || alternate === on) return;
    process.stderr.write(on ? "\x1b[?1049h" : "\x1b[?1049l");
    alternate = on;
  };
  const display = () => {
    if (closing || busy || paused || (terminal && input.line.length > 0))
      return;
    if (terminal) {
      screen(true);
      // Reset readline's wrapped-line bookkeeping before placing a new frame.
      input.prompt();
      process.stderr.write("\x1b[H\x1b[2J");
    }
    const rows = process.stderr.rows || 24;
    const width = Math.max(1, (process.stderr.columns || 80) - 1);
    const clip = (line: string) => {
      if (displayWidth(line) <= width) return line;
      let text = "";
      for (const character of line) {
        if (displayWidth(text + character + "…") > width) break;
        text += character;
      }
      return text + "…";
    };
    const frame = [`Changed: ${lastChange}`, ...latest.trimEnd().split("\n")];
    if (lastResult) frame.push(`Last command: ${lastResult}`);
    const shown = terminal
      ? frame.slice(0, Math.max(3, rows - 4)).map(clip)
      : frame;
    if (terminal && shown.length < frame.length)
      shown[shown.length - 1] = clip(
        "More detail: type status, orders, or audit.",
      );
    process.stderr.write(
      shown.join("\n") +
        "\n" +
        (terminal
          ? clip("away · back · diff · audit · orders · status · help · quit")
          : "away · back · diff · audit · orders · status · help · quit") +
        "\n",
    );
    if (terminal) input.prompt();
  };
  const watcher = watchLiveView(directory, (text, summary) => {
    latest = text;
    if (summary.length) lastChange = summary.join("; ");
    display();
  });
  process.stderr.on("resize", display);
  const stop = () => {
    closing = true;
    abort.abort();
    input.close();
    watcher.close();
  };
  input.on("SIGINT", stop);
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"] as const)
    process.once(signal, stop);
  const showResult = (
    stdout: Buffer,
    stderr: Buffer,
    code: number | null,
    inspect = true,
  ) => {
    screen(false);
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    if (code !== null) {
      process.stderr.write(`\n[command exit ${code}]\n`);
      process.exitCode = code;
      const detail = stdout.length ? stdout : stderr;
      lastResult = `exit ${code}${detail.length ? ` · ${field(detail.toString("utf8").split("\n")[0]!).slice(0, 80)}` : ""}`;
    }
    paused = terminal && inspect;
    if (paused)
      process.stderr.write(
        "\nLive view paused so you can read/scroll this result. Press Enter to return to the live screen.\n",
      );
  };
  try {
    for await (const raw of input) {
      if (closing) break;
      const line = raw.trim();
      if (line === "quit" || line === ":quit") break;
      if (!line || line === "live") {
        paused = false;
        display();
        continue;
      }
      busy = true;
      try {
        if (line === "help") {
          showResult(
            Buffer.from(
              "Type a command at live> and press Enter:\naway   mark yourself away and arm the cadence\nback   mark yourself present again\ndiff   show the compiled diff\naudit  show full audit; scroll to inspect, Enter resumes live\norders show all work-order statuses\nstatus show the full status projection\ncommands list all contract commands\nquit   close this console (resident stays running)\nAdvanced: JSON arrays preserve literal command arguments.\n",
            ),
            Buffer.alloc(0),
            null,
          );
        } else if (line === "status" || line === "orders") {
          const view = snapshot(directory).status;
          if (!view) throw new Error("status unavailable");
          const text =
            line === "status"
              ? renderRuntimeStatus(view)
              : `Open work orders (${view.workOrders.status})\n` +
                view.workOrders.items
                  .map(
                    (order) =>
                      `${order.order}: ${field(order.phase)} · dependencies ${order.dependency} · verdict ${order.verdict ?? "unknown"}`,
                  )
                  .join("\n") +
                "\n";
          showResult(Buffer.from(text), Buffer.alloc(0), null);
        } else if (line === "commands" || line === ":commands") {
          showResult(
            Buffer.from(
              JSON.stringify(
                await readConsoleContract(
                  readConsoleConnection(directory),
                  abort.signal,
                ),
                null,
                2,
              ) + "\n",
            ),
            Buffer.alloc(0),
            null,
          );
        } else {
          const result = await invokeLiveCommand(directory, line, abort.signal);
          showResult(
            Buffer.from(result.stdoutBase64, "base64"),
            Buffer.from(result.stderrBase64, "base64"),
            result.exitCode,
            result.exitCode !== 0 ||
              !["dotln.presence-away", "dotln.presence-back"].includes(
                result.command,
              ),
          );
        }
      } catch {
        if (closing) break;
        showResult(
          Buffer.alloc(0),
          Buffer.from(
            "Command unavailable or invalid input. Type help for controls.\n",
          ),
          1,
        );
      } finally {
        busy = false;
        if (!closing) {
          if (paused && terminal) input.prompt();
          else display();
        }
      }
    }
  } finally {
    stop();
    process.stderr.removeListener("resize", display);
    screen(false);
    for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"] as const)
      process.removeListener(signal, stop);
  }
}
