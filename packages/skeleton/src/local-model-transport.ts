import { startDeadline } from "./gate-deadlines.mjs";
import {
  WorkerFailure,
  isWriterRequest,
  normalizeWorkerEffort,
  WORKER_TIMEOUT_MS,
  type CommandReceipt,
} from "./worker-protocol.js";
import {
  isEvidenceRequest,
  isPlanRequest,
  parseTransportResult,
  transportPrompt,
  transportResultSchema,
  validateTransportRequest,
  type TransportRequest,
  type TransportResultFor,
} from "./verification-protocol.js";
import type {
  TransportDispatch,
  WorkOrderTransport,
} from "./worker-transport.js";

export const LOCAL_MODEL_TRANSPORT = "local-model-http" as const;

/** WO-110's dated availability row. The label is a readiness grade, not a
 * liveness check: WO-110 observed the endpoint serve a complete, validated
 * inspection envelope on 2026-09-20, and readiness still fails because no
 * attributable non-local-egress boundary exists and WO-137 graded the runner
 * `inconclusive`. Working inference is not the readiness contract. No `ready`
 * row exists, so the catalog reports unavailable and the resident records a
 * NoOp; the transport is exercised against doubles regardless. */
export const LOCAL_MODEL_ROW = {
  row: "L-U1",
  label: "unavailable",
  observedAt: "2026-09-20",
  reason:
    "local-model endpoint unavailable: readiness is ungranted while no attributable non-local-egress boundary exists and WO-137 grades the runner inconclusive, even though WO-110 observed a live validated envelope on 2026-09-20; the operator starts the endpoint explicitly",
} as const;

/** The native v0 path WO-137 exercised for its schema, tool and determinism rows. */
export const LOCAL_MODEL_COMPLETIONS_PATH = "/api/v0/chat/completions";
/** Matches the bounded capture WO-137's probe client used. */
export const LOCAL_MODEL_RESPONSE_LIMIT = 262_144;
export const LOCAL_MODEL_MAX_TOKENS = 1_024;

/** Observed on LM Studio 0.4.24+1 (WO-137): without `reasoning_effort: "none"`
 * a bounded token cap was spent entirely on reasoning and the answer content
 * came back empty. Temperature, top-p, seed and stop reproduce that row's fixed
 * decoding. The DotLn effort selector stays a launch claim: no other wire value
 * for reasoning effort has been observed on this runner, so none is invented. */
export const LOCAL_MODEL_WIRE = {
  temperature: 0,
  top_p: 1,
  seed: 424242,
  reasoning_effort: "none",
  stream: false,
} as const;

const LOCAL_MODEL_SYSTEM =
  "Return only the JSON object required by the response schema. Do not explain.";

/** An explicit IPv4 loopback origin: never a DNS name, credential or route.
 * Loopback binding controls inbound connections only; it is not an egress
 * boundary, and WO-137 recorded that limit. */
export function localModelOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new WorkerFailure(
      "profile-refused",
      "local endpoint is not an absolute URL",
    );
  }
  if (
    url.protocol !== "http:" ||
    url.hostname !== "127.0.0.1" ||
    !url.port ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new WorkerFailure(
      "profile-refused",
      "local endpoint must be an explicit HTTP IPv4 loopback origin with a port",
    );
  return url.origin;
}

/** WO-110 carries the inspection profile only. Writing, verification-evidence
 * and plan-refutation requests keep their existing transports until a row of
 * their own exists; the local model gets no writing profile (WO-110 non-goal). */
function refuseUnsupported(request: TransportRequest): void {
  if (isWriterRequest(request))
    throw new WorkerFailure(
      "profile-refused",
      "local-model transport carries no writing profile",
    );
  if (isEvidenceRequest(request) || isPlanRequest(request))
    throw new WorkerFailure(
      "profile-refused",
      "local-model transport carries the inspection profile only",
    );
}

export function localModelRequestBody(
  request: TransportRequest,
  maxTokens: number = LOCAL_MODEL_MAX_TOKENS,
): string {
  return JSON.stringify({
    model: request.model,
    messages: [
      { role: "system", content: LOCAL_MODEL_SYSTEM },
      { role: "user", content: transportPrompt(request) },
    ],
    ...LOCAL_MODEL_WIRE,
    max_tokens: maxTokens,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "dotln_work_order_result",
        strict: true,
        schema: transportResultSchema(request),
      },
    },
  });
}

const UNAVAILABLE_BODY =
  /model.{0,100}(not found|unavailable|not supported|does not exist|invalid)|invalid.{0,40}model|no models? loaded/iu;

/** Read a bounded body: an endpoint that streams without end is an output
 * limit, never an unbounded host read. */
async function boundedText(response: Response, limit: number): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit)
        throw new WorkerFailure(
          "output-limit",
          "local endpoint response exceeded the declared bound",
        );
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    void reader.cancel().catch(() => {});
  }
  return text + decoder.decode();
}

/** Validate at the host boundary: an endpoint's own schema claim is not
 * validation, exactly as for the two CLI adapters. */
export function decodeLocalModelResult<R extends TransportRequest>(
  text: string,
  request: R,
): TransportResultFor<R> {
  let payload: {
    choices?: readonly {
      message?: { content?: unknown };
      finish_reason?: unknown;
    }[];
  };
  try {
    payload = JSON.parse(text) as typeof payload;
  } catch {
    throw new WorkerFailure("invalid-result", "wire-json");
  }
  const choice = payload.choices?.[0];
  if (choice?.finish_reason === "length")
    throw new WorkerFailure(
      "output-limit",
      "completion stopped at the token cap",
    );
  const content = choice?.message?.content;
  if (typeof content !== "string" || !content.trim())
    throw new WorkerFailure("invalid-result", "completion-content-absent");
  let structured: unknown;
  try {
    structured = JSON.parse(content);
  } catch {
    throw new WorkerFailure("invalid-result", "structured-output-json");
  }
  return parseTransportResult(structured, request);
}

export interface LocalModelTransportOptions {
  /** Observed runner version when the host has one; never inferred. */
  readonly version?: string;
  readonly maxTokens?: number;
  readonly timeoutMs?: number;
}

/** The third `WorkOrderTransport`. It launches no child process: the episode is
 * one bounded HTTP request, so an abort ends it with the dispatching host and
 * no disposable supervisor is required. */
export class LocalModelWorkOrderTransport implements WorkOrderTransport {
  readonly name = LOCAL_MODEL_TRANSPORT;
  readonly harnessVersion: string;
  readonly origin: string;
  private readonly url: string;
  private readonly maxTokens: number;
  private readonly timeoutMs: number;
  constructor(endpoint: string, options: LocalModelTransportOptions = {}) {
    this.origin = localModelOrigin(endpoint);
    this.url = `${this.origin}${LOCAL_MODEL_COMPLETIONS_PATH}`;
    this.harnessVersion = options.version ?? "unknown";
    this.maxTokens = options.maxTokens ?? LOCAL_MODEL_MAX_TOKENS;
    this.timeoutMs = options.timeoutMs ?? WORKER_TIMEOUT_MS;
    if (
      !Number.isSafeInteger(this.maxTokens) ||
      this.maxTokens <= 0 ||
      !Number.isSafeInteger(this.timeoutMs) ||
      this.timeoutMs <= 0
    )
      throw new WorkerFailure(
        "profile-refused",
        "local endpoint needs a positive token cap and deadline",
      );
  }

  dispatch<R extends TransportRequest>(
    request: R,
    now: () => number,
  ): TransportDispatch<TransportResultFor<R>> {
    // The profile fence answers on the request kind alone, before the
    // inspection validator interprets an unsupported shape.
    refuseUnsupported(request);
    validateTransportRequest(request);
    if (typeof request.effort !== "string" || !request.effort.trim())
      throw new WorkerFailure(
        "profile-refused",
        "worker effort must be present",
      );
    // Normalized for the launch claim only; the wire carries no effort value.
    normalizeWorkerEffort(request.effort);
    const body = localModelRequestBody(request, this.maxTokens);
    const observation = startDeadline(
      "local-model-transport:request",
      this.timeoutMs,
    );
    const controller = new AbortController();
    let live = true;
    let failure: WorkerFailure | undefined;
    const stop = (next: WorkerFailure) => {
      failure ??= next;
      controller.abort();
    };
    const deadline = setTimeout(() => {
      observation.finish(true);
      stop(new WorkerFailure("deadline-exceeded"));
    }, this.timeoutMs);
    let acceptedResolve!: () => void;
    let acceptedReject!: (error: unknown) => void;
    const accepted = new Promise<void>((resolve, reject) => {
      acceptedResolve = resolve;
      acceptedReject = reject;
    });
    void accepted.catch(() => {});
    const completed = (async (): Promise<TransportResultFor<R>> => {
      try {
        let response: Response;
        try {
          response = await fetch(this.url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body,
            signal: controller.signal,
            redirect: "error",
          });
        } catch {
          // A refused, reset or aborted connection is the endpoint being
          // unavailable; the resident turns that typed failure into a NoOp.
          throw (
            failure ??
            new WorkerFailure(
              "model-unavailable",
              "local endpoint did not accept the request",
            )
          );
        }
        // Headers received is this transport's acceptance, as spawn is the
        // CLI adapters'.
        acceptedResolve();
        const text = await boundedText(response, LOCAL_MODEL_RESPONSE_LIMIT);
        if (!response.ok)
          throw new WorkerFailure(
            UNAVAILABLE_BODY.test(text)
              ? "model-unavailable"
              : "transport-failed",
            `http-${response.status}`,
          );
        return decodeLocalModelResult(text, request);
      } catch (error) {
        const typed =
          failure ??
          (error instanceof WorkerFailure
            ? error
            : new WorkerFailure("transport-failed", "local endpoint read"));
        acceptedReject(typed);
        throw typed;
      } finally {
        live = false;
        clearTimeout(deadline);
        observation.finish();
      }
    })();
    void completed.catch(() => {});
    const receipt = accepted.then((): CommandReceipt => ({
      commandId: request.command.commandId,
      transport: this.name,
      acceptedAt: now(),
    }));
    void receipt.catch(() => {});
    return {
      receipt,
      completed,
      alive: () => live,
      kill: () => stop(new WorkerFailure("interrupted")),
    };
  }
}
