// The resident's launch, shared by `dotln resident` and the script-side
// launcher (scripts/resident.mjs). Both start the same host over a store; the
// script-side launcher also hands it actor adapters that hold the
// repository's document reader, which this package does not carry.
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { ActorAdapter, ActorKind } from "./actor-contract.js";
import { ResidentHost } from "./resident-host.js";
import type { WorkOrderSourceReason } from "./runtime-status-contract.js";

// This kit-owned bridge locates scripts from the installed CLI, never cwd.
export const verticalBridge = () =>
  import(
    new URL("../../../../scripts/lib/vertical-runtime.mjs", import.meta.url)
      .href
  );

/** One resident run: its store, its policy, and one cycle or a tick. */
export interface ResidentLaunch {
  readonly directory: string;
  readonly policyId: string;
  readonly once: boolean;
  readonly tickMs: number;
}

/** A resident command's options, in any order: `--store` and `--policy`,
 * then `--tick <ms>` or `--once`. Anything else refuses with the usage line
 * of `command`. */
export function parseResidentArguments(
  argv: readonly string[],
  command = "dotln resident",
): ResidentLaunch {
  const usage = `usage: ${command} --store <directory> --policy <id> [--tick <ms> | --once]`;
  const values = new Map<string, string>();
  let once = false;
  for (let index = 0; index < argv.length; index++) {
    const key = argv[index]!;
    if (key === "--once") {
      if (once) throw new Error(usage);
      once = true;
      continue;
    }
    if (!["--store", "--policy", "--tick"].includes(key) || values.has(key))
      throw new Error(usage);
    const value = argv[++index];
    if (!value || value.startsWith("--")) throw new Error(usage);
    values.set(key, value);
  }
  const directory = values.get("--store");
  const policyId = values.get("--policy");
  if (!directory || !policyId || (once && values.has("--tick")))
    throw new Error(usage);
  return {
    directory,
    policyId,
    once,
    tickMs: Number(values.get("--tick") ?? 1000),
  };
}

/** What only the script side can give a resident: the work-order cards, as
 * the index command prints them with `--json`. */
export interface ResidentSources {
  readonly workOrderCards?: () => string;
}

/** Runs the resident over its store for one cycle, or until a signal stops
 * it. `catalog` replaces the default actor adapters, and `sources` is what
 * the script-side launcher hands in. A resident started without the launcher
 * has no cards and reports its work orders unavailable. */
export async function runResident(
  launch: ResidentLaunch,
  catalog?: Readonly<Record<ActorKind, ActorAdapter>>,
  sources: ResidentSources = {},
): Promise<void> {
  const { directory } = launch;
  const abort = new AbortController();
  const stop = () => abort.abort();
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  // A closed terminal stops the resident in order, so it can interrupt the
  // console commands it started in their own process groups.
  process.once("SIGHUP", stop);
  try {
    const { findLaunchpad, loadConfig } = await import(
      new URL("../../../../scripts/lib/config.mjs", import.meta.url).href
    );
    let commandRoot = resolve(process.env["DOTLN_LAUNCHPAD"] ?? process.cwd());
    let workOrderIndexError: WorkOrderSourceReason | undefined;
    try {
      commandRoot = findLaunchpad();
      try {
        loadConfig(commandRoot);
      } catch {
        workOrderIndexError = "configuration-invalid";
      }
    } catch {
      workOrderIndexError = "launchpad-unavailable";
    }
    // Without the launcher nothing binds a card source.
    if (!sources.workOrderCards) workOrderIndexError ??= "binding-unavailable";
    const vertical = existsSync(join(directory, "vertical.json"))
      ? (await verticalBridge()).createVerticalEntry({
          directory: resolve(directory),
          configuration: (await verticalBridge()).readVerticalConfiguration(
            resolve(directory),
            commandRoot,
          ),
        }).resident
      : undefined;
    await new ResidentHost({
      directory,
      policyId: launch.policyId,
      commandRoot,
      ...(catalog ? { catalog } : {}),
      ...(vertical ? { vertical } : {}),
      ...(sources.workOrderCards && workOrderIndexError === undefined
        ? { workOrderCards: sources.workOrderCards }
        : {}),
      ...(workOrderIndexError === undefined ? {} : { workOrderIndexError }),
    }).run({
      once: launch.once,
      tickMs: launch.tickMs,
      signal: abort.signal,
    });
  } finally {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
    process.removeListener("SIGHUP", stop);
  }
}
