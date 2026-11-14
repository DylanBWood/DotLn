// The one launch path for a worker the kit starts itself. The entropy review,
// its refutation and the change review (`npm run worker -- review`) all
// launch through here, so the two CLI transports, what a name runs, the
// host's version readback, the elapsed clock and the usage record are one
// code path rather than a copy per command. What a name runs is the worker
// table's answer (`worker-catalog.mjs`); nothing here knows a model.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { closeLeftoverCodexServers } from "./codex-background.mjs";
import { loadConfig } from "./config.mjs";
import {
  PROVIDERS,
  WORKER_RECORD_TYPES,
  listWorkers,
  resolveWorker,
  sessionLaunch,
  workerPin,
  workerTable,
} from "../../packages/skeleton/src/worker-catalog.mjs";

export {
  PROVIDERS,
  listWorkers,
  resolveWorker,
  sessionLaunch,
  workerPin,
  workerTable,
};

const skeleton = (name) =>
  import(`../../packages/skeleton/dist/src/${name}.js`);

/** The host a session's own environment names, or null outside a session. */
export const sessionHost = (env = process.env) =>
  env.CODEX_THREAD_ID
    ? "codex"
    : env.CLAUDE_CODE_SESSION_ID || env.CLAUDE_SESSION_ID
      ? "claude"
      : null;

/** The workers and models of the launchpad at `root`: the kit's, with the
 * instance's `workers` section and its models file over them. Without a
 * root, the kit's alone.
 * @param {string} [root] */
export const loadWorkers = (root) =>
  workerTable(root === undefined ? {} : loadConfig(root).workers);

/** The worker types a refutation receipt may record: a fixed set, so that a
 * receipt written under an earlier table still reads. */
export const receiptWorkerTypes = () => [...WORKER_RECORD_TYPES];

/**
 * What a launch runs in the launchpad at `root`: the worker or the model
 * `name` names, or the `default` worker where it names none, on the
 * provider given and at the effort given for this launch alone. Every
 * refusal is the table's and names what it has. `selection` records whether
 * the launch named something; `modelKey` is where the instance wrote the
 * model, or null where the kit's own list supplied it.
 * @param {string | undefined} root
 * @param {string} [name]
 * @param {{provider?: string | null, effort?: string | null, flag?: string}} [choice]
 */
export function resolveLaunch(root, name, choice = {}) {
  const { provider = null, effort = null, flag = "--model" } = choice;
  const table = loadWorkers(root);
  let resolved;
  try {
    resolved = resolveWorker(table, name ?? "default", { provider, effort });
  } catch (error) {
    if (name !== undefined && error instanceof Error)
      error.message = `${flag} ${name}: ${error.message}`;
    throw error;
  }
  const places = [
    ...new Set([resolved.source.id, resolved.source.model]),
  ].filter((place) => place !== "kit");
  return {
    table,
    resolved,
    name: resolved.name,
    host: resolved.provider,
    model: resolved.model.id,
    effort: resolved.effort,
    workerType: resolved.workerType,
    selection: name === undefined ? "host-default" : "model-flag",
    modelKey: places.length ? places.join(" and ") : null,
  };
}

/** The standing rules a worker carries, as the one generated worker
 * definition states them. A provider whose spawn reads no definition is
 * given them at the head of its brief. */
async function workerPreamble() {
  const { workerSpecification } =
    await import("../../packages/compiler/dist/src/harness.js");
  return workerSpecification({
    name: "dotln-worker",
    model: "unread",
    effort: "max",
  }).prompt;
}

/** The provider a name runs on where none is given: a worker bound to
 * several runs, in a session, on the session's own.
 * @param {ReturnType<typeof workerTable>} table @param {string} name
 * @param {string | null} session */
const sessionProvider = (table, name, session) => {
  const bound = Object.hasOwn(table.workers, name)
    ? Object.keys(table.workers[name].bindings)
    : [];
  return bound.length > 1 && session && bound.includes(session)
    ? session
    : null;
};

/**
 * One name as a session launches it (`npm run worker -- show`): what it
 * runs, the launch this session makes itself, and the flag a direct
 * refutation receipt takes. `session` is null where this session cannot
 * make the launch, and `note` then names the kit command that does.
 * @param {string | undefined} root @param {string} [name]
 * @param {{provider?: string | null, effort?: string | null, session?: string | null}} [choice]
 */
export async function showWorker(root, name = "default", choice = {}) {
  const { effort = null, session = sessionHost() } = choice;
  const table = loadWorkers(root);
  const resolved = resolveWorker(table, name, {
    provider: choice.provider ?? sessionProvider(table, name, session),
    effort,
  });
  const provider = PROVIDERS[resolved.provider];
  const own = session === null || session === resolved.provider;
  const launch = own
    ? sessionLaunch(table, resolved, { preamble: await workerPreamble() })
    : null;
  // Both commands are the one launch that was asked for: the name, and
  // the effort where one was given for it.
  const asked = `--model ${name}${effort === null ? "" : ` --effort ${effort}`}`;
  const kit = `npm run worker -- review --host ${resolved.provider} ${asked} launches a review on it, and npm run plan -- refute --transport ${provider.transport} ${asked} a refutation over the full horizon`;
  return {
    ...resolved,
    session: launch,
    receipt: `--worker-type ${resolved.workerType}`,
    ...(launch
      ? {}
      : {
          note: own
            ? `a ${provider.label} session's own launch takes a model family, and the model ${resolved.model.name} states none; ${kit}`
            : `this ${PROVIDERS[session]?.label ?? session} session cannot launch a ${provider.label} worker itself; ${kit}`,
        }),
  };
}

/** Every worker and model by name, as `npm run worker -- list` prints
 * them: what each runs for each provider, where each value was written, and
 * how a session of that provider launches it.
 * @param {string} [root] */
export function listWorkerRows(root) {
  const table = loadWorkers(root);
  return listWorkers(table).map((row) => ({
    ...row,
    default: row.entry === "worker" && row.name === "default",
    runs: row.runs.map((run) => {
      if (!run.launchable) return { ...run, session: null };
      const launch = sessionLaunch(
        table,
        resolveWorker(table, row.name, { provider: run.provider }),
      );
      return {
        ...run,
        session: launch && {
          tool: launch.tool,
          arguments: launch.arguments,
          exact: launch.exact,
        },
      };
    }),
  }));
}

/** The listing as lines a person reads.
 * @param {ReturnType<typeof listWorkerRows>} rows */
export function renderWorkerList(rows) {
  const route = (session) =>
    session
      ? `${session.tool} ${Object.entries(session.arguments)
          .map(([key, value]) => `${key}=${value}`)
          .join(" ")}${session.exact ? "" : " (the host resolves the family)"}`
      : "the kit's command only";
  const from = (source) => (source === "kit" ? "the kit" : source);
  const lines = (entry) =>
    rows
      .filter((row) => row.entry === entry)
      .flatMap((row) => [
        `  ${row.name}${row.default ? " [default]" : ""}${row.description ? `: ${row.description}` : ""}`,
        ...row.runs.map(
          (run) =>
            `    ${run.provider}: ${run.model} (${run.id}) at ${run.effort}; ${run.launchable ? `in a session, ${route(run.session)}` : `no launcher for ${run.provider}`}; from ${from(run.source)}`,
        ),
      ]);
  return [
    "Workers: a name bound, for each provider, to a model.",
    ...lines("worker"),
    "Models: a model's name launches it at its own effort.",
    ...lines("model"),
    "npm run worker -- show <name> [--provider <provider>] [--effort <level>] prints this session's launch of one.",
    "",
  ].join("\n");
}

/** Claude's terminal result carries the denial count, turn count, list cost
 * and the models it used that a receipt reports. Codex exposes none of them,
 * so both stay `unobserved` there rather than being invented.
 * @param {string} capture the directory the transport wrote wire.jsonl into
 * @param {string} transport */
export function readWire(capture, transport) {
  const path = join(capture, "wire.jsonl");
  if (transport !== "claude-cli-print" || !existsSync(path)) return null;
  try {
    const wire = JSON.parse(readFileSync(path, "utf8"));
    return {
      turns: typeof wire.num_turns === "number" ? wire.num_turns : null,
      costUsd:
        typeof wire.total_cost_usd === "number" ? wire.total_cost_usd : null,
      permissionDenials: Array.isArray(wire.permission_denials)
        ? wire.permission_denials.length
        : "unobserved",
      deniedTools: Array.isArray(wire.permission_denials)
        ? wire.permission_denials.map(
            (denial) => denial?.tool_name ?? "unknown",
          )
        : [],
      subtype: typeof wire.subtype === "string" ? wire.subtype : null,
      // The host's own readback of the model, as its result names it.
      models:
        wire.modelUsage && typeof wire.modelUsage === "object"
          ? Object.keys(wire.modelUsage).sort()
          : [],
    };
  } catch {
    return null;
  }
}

/** The host each transport launches on and the harness its attestation
 * records, from the providers' adapters; the fixture double runs the fixture
 * model alone. What a real transport runs when the caller names nothing is
 * the `default` worker for its provider, which `transportLaunch`
 * resolves for a launchpad. */
export const TRANSPORT_DEFAULTS = {
  ...Object.fromEntries(
    Object.values(PROVIDERS).map((provider) => [
      provider.transport,
      { host: provider.id, harness: provider.harness },
    ]),
  ),
  fake: { model: "fixture", effort: "max", harness: "other:fixture" },
};

/** What a transport launches in the launchpad at `root`: the worker or the
 * model `name` names, read from the table like every other launch, at
 * `effort` where one is given for it, and with neither the default worker
 * for the transport's provider. The fixture double runs the fixture model,
 * or what its caller states. With no transport nothing is launched here,
 * and what the caller states is recorded as stated.
 * @param {string | undefined} root
 * @param {string | null | undefined} transport
 * @param {string} [name] @param {string} [effort] */
export function transportLaunch(root, transport, name, effort) {
  const fixed = transport ? TRANSPORT_DEFAULTS[transport] : null;
  if (transport && !fixed)
    throw new Error(`unknown worker transport ${transport}`);
  if (!fixed?.host)
    return {
      model: name ?? fixed?.model ?? "unknown",
      effort: effort ?? fixed?.effort ?? "unknown",
      modelKey: null,
    };
  const launch = resolveLaunch(root, name, {
    provider: fixed.host,
    effort: effort ?? null,
  });
  return {
    model: launch.model,
    effort: launch.effort,
    modelKey: launch.modelKey,
  };
}

/** What a failed launch adds to its error where the model was the
 * instance's to name: the place it was written, so that a model the host's
 * account does not offer is corrected there. */
export const modelKeyNote = (model, modelKey) =>
  modelKey
    ? ` The model ${model} came from ${modelKey}; a model the host does not offer is corrected there.`
    : "";

/** The transport a launch names. `fake` is a fixture double the caller
 * builds, since each command's fixture returns its own canned shape; the
 * other two are the CLI transports, which read their own CLI version.
 * @param {string} name
 * @param {{onUsage?: (observation: unknown) => void, fake?: () => Promise<any>|any, label?: string}} [options] */
export async function workerTransport(
  name,
  { onUsage, fake, label = "worker" } = {},
) {
  if (name === "fake") {
    if (!fake) throw new Error(`the ${label} fake transport needs a fixture`);
    return await fake();
  }
  const { ClaudeCliPrintWorkOrderTransport, CodexCliExecWorkOrderTransport } =
    await skeleton("worker-transport");
  if (name === "claude-cli-print")
    return new ClaudeCliPrintWorkOrderTransport(undefined, undefined, onUsage);
  if (name === "codex-cli-exec")
    return new CodexCliExecWorkOrderTransport(undefined, undefined, onUsage);
  throw new Error(`unknown ${label} transport ${name}`);
}

/**
 * Launch one fresh worker and wait for its return. The usage observation the
 * transport reports is recorded under the caller's role and dispatch; the
 * receipt must name this command and transport; the result carries the
 * transport's CLI version and the elapsed clock. On any failure the process
 * is stopped and the error rethrown, so the caller keeps its own retention.
 * A failure names the configuration key the model came from where the
 * caller passes one.
 * @param {string} root
 * @param {{command: {commandId: string}}} request
 * @param {{transport: string, role: string, dispatch: string, workOrder?: string|null, fake?: () => any, label?: string, modelKey?: string|null}} options
 */
export async function launchWorker(
  root,
  request,
  {
    transport: name,
    role,
    dispatch,
    workOrder = null,
    fake,
    label = "worker",
    modelKey = null,
  },
) {
  const { recordUsageObservation } =
    await import("../../packages/skeleton/src/usage-observation.mjs");
  const startedAt = new Date().toISOString();
  let usage = null;
  // A failure at any step, the transport's own start among them, says
  // where the model was named.
  const noted = (error) => {
    if (modelKey && error instanceof Error && !error.modelKeyNamed) {
      error.message += modelKeyNote(request.model, modelKey);
      error.modelKeyNamed = true;
    }
    return error;
  };
  let transport;
  let running;
  try {
    transport = await workerTransport(name, transportOptions());
    running = transport.dispatch(request, Date.now);
  } catch (error) {
    throw noted(error);
  }
  try {
    const accepted = await running.receipt;
    if (
      accepted.commandId !== request.command.commandId ||
      accepted.transport !== transport.name
    )
      throw new Error(`${label} transport returned another command's receipt`);
    const returned = await running.completed;
    const endedAt = new Date().toISOString();
    return {
      transport: transport.name,
      harnessVersion: transport.harnessVersion,
      startedAt,
      endedAt,
      durationMs: Date.parse(endedAt) - Date.parse(startedAt),
      usage,
      returned,
    };
  } catch (error) {
    running.kill();
    throw noted(error);
  } finally {
    // Codex leaves its own background server running when a run ends. A
    // worker the kit launched on Codex is the kit's to clean up after, at
    // the moment it ends, when no other Codex process is alive.
    if (transport.name === "codex-cli-exec")
      closeLeftoverCodexServers({ repository: root });
  }

  function transportOptions() {
    return {
      fake,
      label,
      onUsage: (observation) => {
        usage = observation;
        try {
          recordUsageObservation(root, {
            workOrder,
            role,
            dispatch,
            startedAt,
            durationMs: Date.now() - Date.parse(startedAt),
            observation,
          });
        } catch {
          /* usage recording is advisory and never fails an episode */
        }
      },
    };
  }
}
