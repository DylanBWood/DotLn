// The one launch path for a worker the kit starts itself. The entropy review,
// its refutation and the change review (`npm run worker -- review`) all
// launch through here, so the two CLI transports, the pinned defaults, the
// host's version readback, the elapsed clock and the usage record are one
// code path rather than a copy per command.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const skeleton = (name) =>
  import(`../../packages/skeleton/dist/src/${name}.js`);

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

/** The model and effort each transport pins when the caller names none, and
 * the harness its attestation records. */
export const TRANSPORT_DEFAULTS = {
  "claude-cli-print": {
    model: "claude-opus-5-5",
    effort: "xhigh",
    harness: "claude-code",
  },
  "codex-cli-exec": {
    model: "gpt-6.1-sol",
    effort: "max",
    harness: "codex-cli",
  },
  fake: { model: "fixture", effort: "max", harness: "other:fixture" },
};

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
 * @param {string} root
 * @param {{command: {commandId: string}}} request
 * @param {{transport: string, role: string, dispatch: string, workOrder?: string|null, fake?: () => any, label?: string}} options
 */
export async function launchWorker(
  root,
  request,
  { transport: name, role, dispatch, workOrder = null, fake, label = "worker" },
) {
  const { recordUsageObservation } =
    await import("../../packages/skeleton/src/usage-observation.mjs");
  const startedAt = new Date().toISOString();
  let usage = null;
  const transport = await workerTransport(name, {
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
  });
  const running = transport.dispatch(request, Date.now);
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
    throw error;
  }
}
