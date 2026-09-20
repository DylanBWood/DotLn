#!/usr/bin/env node
import { isMainModule } from "../lib/paths.mjs";
// WO-110 criterion 2. Live inference is explicit: importing this module
// contacts nothing, and only `--live` dispatches against the operator's
// endpoint. The packet records shapes, never model-authored text.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import {
  LOCAL_MODEL_ROW,
  LocalModelWorkOrderTransport,
  localModelOrigin,
} from "../../packages/skeleton/dist/src/local-model-transport.js";

export const DEFAULT_ORIGIN = "http://127.0.0.1:1234";

export function pinnedRequest() {
  return JSON.parse(
    readFileSync(
      new URL(
        "../../packages/skeleton/fixtures/wo051-inspection-baseline.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ).request;
}

/** Field names, types, lengths and counts only. No summary text, candidate
 * path, classification or evidence string reaches the recorded packet. */
export function envelopeShape(result) {
  const envelope = result?.envelope ?? {};
  return {
    envelopeFields: Object.keys(envelope).sort(),
    status: envelope.status,
    requiresHuman: typeof envelope.requiresHuman,
    summaryCharacters: String(envelope.summary ?? "").length,
    workOrderIdMatches: typeof envelope.workOrderId === "string",
    episodeIdMatches: typeof envelope.episodeId === "string",
    resultIdMatches: typeof envelope.resultId === "string",
    beaconClaim: result?.beaconClaim,
    candidateCount: Array.isArray(result?.candidates)
      ? result.candidates.length
      : null,
    candidateEvidenceCounts: Array.isArray(result?.candidates)
      ? result.candidates.map((candidate) =>
          Array.isArray(candidate?.evidence) ? candidate.evidence.length : null,
        )
      : null,
  };
}

/** Read-only reachability: one bounded request that starts no server and
 * loads no model. An unreachable endpoint is a row, never a failure. */
export async function probeEndpoint(origin, { timeoutMs = 2000 } = {}) {
  const base = localModelOrigin(origin);
  const started = performance.now();
  try {
    const response = await fetch(`${base}/api/v0/models`, {
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "error",
    });
    return {
      label: response.ok ? "observed" : "unavailable",
      httpStatus: response.status,
      latencyMs: performance.now() - started,
      reason: response.ok
        ? "endpoint answered its model listing"
        : `endpoint answered http-${response.status}`,
    };
  } catch (error) {
    return {
      label: "unavailable",
      httpStatus: null,
      latencyMs: performance.now() - started,
      // The syscall cause names the refusal; fetch's own wrapper says only TypeError.
      reason: `endpoint did not answer: ${error?.cause?.code ?? error?.name ?? "error"}`,
    };
  }
}

export async function runTransportSmoke({
  origin,
  request = pinnedRequest(),
  version,
  timeoutMs = 120000,
  maxTokens,
} = {}) {
  const transport = new LocalModelWorkOrderTransport(origin, {
    ...(version === undefined ? {} : { version }),
    ...(maxTokens === undefined ? {} : { maxTokens }),
    timeoutMs,
  });
  const started = performance.now();
  const row = {
    transport: transport.name,
    endpoint: transport.origin,
    harnessVersion: transport.harnessVersion,
    model: request.model,
    effort: request.effort,
    profileId: request.profile.profileId,
    startedAt: new Date().toISOString(),
  };
  try {
    const dispatched = transport.dispatch(request, Date.now);
    const result = await dispatched.completed;
    row.outcome = "envelope";
    row.label = "observed";
    row.shape = envelopeShape(result);
  } catch (error) {
    row.outcome = "unavailable";
    row.label = "unavailable";
    row.failure = error?.code ?? "transport-failed";
    row.failureDetail = error?.detail ?? null;
  }
  row.latencyMs = performance.now() - started;
  return row;
}

export function packetFor({
  origin,
  probe,
  row,
  declaredRow = LOCAL_MODEL_ROW,
}) {
  return {
    schemaVersion: 1,
    workOrder: "WO-110",
    kind: "local-model-transport-smoke",
    observedAt: new Date().toISOString(),
    endpoint: origin,
    declaredRow,
    probe,
    row,
    outcome: row?.outcome ?? "unavailable",
    projection:
      "shapes only: field names, types, lengths, counts, failure codes and latency; no model-authored text",
    boundary:
      "host-permitted loopback client; this probe starts no server, loads no model and establishes no runner egress boundary",
  };
}

async function main() {
  const args = process.argv.slice(2);
  const option = (key, fallback) =>
    args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
  if (!args.includes("--live") || !args.includes("--out"))
    throw new Error(
      "usage: node scripts/probes/local-model-transport-smoke.mjs --live --out <new-json-path> [--endpoint http://127.0.0.1:1234] [--version <runner>]",
    );
  const out = resolve(option("--out"));
  if (existsSync(out))
    throw new Error("Retain existing run; choose a new output path");
  const origin = localModelOrigin(option("--endpoint", DEFAULT_ORIGIN));
  const probe = await probeEndpoint(origin);
  const row =
    probe.label === "observed"
      ? await runTransportSmoke({
          origin,
          ...(args.includes("--version")
            ? { version: option("--version") }
            : {}),
        })
      : {
          outcome: "unavailable",
          label: "unavailable",
          failure: "model-unavailable",
          failureDetail: probe.reason,
        };
  const packet = packetFor({ origin, probe, row });
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(packet, null, 2) + "\n");
  console.log(
    JSON.stringify({
      output: out,
      outcome: packet.outcome,
      probe: probe.label,
    }),
  );
}

if (isMainModule(import.meta.url)) await main();
