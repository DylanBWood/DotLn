import { readFileSync, watch, type FSWatcher } from "node:fs";
import { join, resolve } from "node:path";
import {
  decodeRuntimeStatus,
  type RuntimeStatusV1,
} from "@dotln/skeleton/dist/src/runtime-status-contract.js";

export const RUNTIME_STATUS_FILE = "runtime-status-v1.json";

export function readRuntimeStatus(directory: string): RuntimeStatusV1 {
  return decodeRuntimeStatus(
    JSON.parse(readFileSync(join(directory, RUNTIME_STATUS_FILE), "utf8")),
  );
}

const display = (value: string) =>
  value.replace(
    /[\u0000-\u001f\u007f-\u009f\u2028-\u202e\u2066-\u2069]/gu,
    "?",
  );
const label = (value: string | null) =>
  value === null ? "unknown" : display(value);
const amount = (value: { consumed: number; remaining: number | null }) =>
  `${value.consumed} consumed / ${value.remaining === null ? "unknown" : value.remaining} remaining`;

export function renderRuntimeStatus(view: RuntimeStatusV1): string {
  const lines = [
    `Runtime status (runtime-status-v1) · observed ${view.observedAt}`,
    "",
    "Actors",
    ...(view.actors.length
      ? view.actors.map(
          (actor) =>
            `  ${display(actor.phase)}: ${display(actor.kind)} · ${actor.availability} · last ${label(actor.lastEpisode)}`,
        )
      : ["  none configured"]),
    "",
    "Live episodes",
    ...(view.liveEpisodes.length
      ? view.liveEpisodes.map(
          (episode) =>
            `  ${display(episode.episodeId)}: ${label(episode.order)} · ${display(episode.actor)} via ${display(episode.transport)} · ${display(episode.phase)} · started ${episode.startedAt} · elapsed ${episode.elapsedMs} ms · launch ${episode.launchClaims.source} ${label(episode.launchClaims.model)}/${label(episode.launchClaims.effort)}`,
        )
      : ["  none"]),
    "",
    "Presence",
    `  ${view.presence.present ? "present" : "away"} · signal ${view.presence.signal} · phase ${label(view.presence.phase)}`,
    ...view.presence.cadences.map(
      (cadence) =>
        `  cadence ${display(cadence.phase)}: ${cadence.nextFireAt === null ? "not armed" : cadence.nextFireAt}`,
    ),
    "",
    "Holds",
    ...(view.holds.length
      ? view.holds.map(
          (hold) =>
            `  ${hold.kind}: ${display(hold.reason)} · order ${label(hold.order)}`,
        )
      : ["  none"]),
    "",
    "Budget",
    `  ${view.budget.status} · episodes ${amount(view.budget.episodes)} · wall ${amount(view.budget.wallMs)} ms · tokens ${amount(view.budget.tokens)}`,
    "",
    `Open work orders (${view.workOrders.status})`,
    ...(view.workOrders.items.length
      ? view.workOrders.items.map(
          (order) =>
            `  ${order.order}: ${display(order.phase)} · dependencies ${order.dependency} · verdict ${label(order.verdict)}`,
        )
      : ["  none available"]),
  ];
  return lines.join("\n") + "\n";
}

/** Watch the directory because the resident replaces the file by rename. */
export function watchRuntimeStatus(
  directory: string,
  changed: (view: RuntimeStatusV1) => void,
  unavailable: () => void = () => {},
): FSWatcher {
  const file = resolve(directory);
  let previous: string | undefined;
  const refresh = () => {
    let view: RuntimeStatusV1;
    try {
      view = readRuntimeStatus(file);
    } catch {
      if (previous !== "unavailable") {
        previous = "unavailable";
        unavailable();
      }
      return;
    }
    const current = JSON.stringify(view);
    if (current === previous) return;
    previous = current;
    changed(view);
  };
  const watcher = watch(file, (_event, filename) => {
    if (filename && String(filename) !== RUNTIME_STATUS_FILE) return;
    refresh();
  });
  watcher.on("error", () => {
    if (previous !== "unavailable") {
      previous = "unavailable";
      unavailable();
    }
  });
  // Subscribe before the initial read so a replacement cannot fall in a gap.
  refresh();
  return watcher;
}

export function statusCli(args: string[]): void {
  const usage = "usage: console status --store <directory> [--json] [--watch]";
  let directory: string | undefined;
  let json = false;
  let live = false;
  while (args.length) {
    const flag = args.shift();
    if (flag === "--store" && !directory) directory = args.shift();
    else if (flag === "--json" && !json) json = true;
    else if (flag === "--watch" && !live) live = true;
    else throw new Error(usage);
  }
  if (!directory || directory.startsWith("--") || (json && live))
    throw new Error(usage);
  const emit = (view: RuntimeStatusV1) =>
    process.stdout.write(
      json ? JSON.stringify(view, null, 2) + "\n" : renderRuntimeStatus(view),
    );
  if (live)
    watchRuntimeStatus(resolve(directory), emit, () =>
      process.stdout.write(
        "Runtime status unavailable; waiting for a valid update.\n",
      ),
    );
  else emit(readRuntimeStatus(resolve(directory)));
}
