import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";

export const SEED = "wo103-seed-20261001";
export const BASE = "ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0";
export const FACTORS = Object.freeze({
  effect: ["string", "non-string"],
  clock: ["before", "at", "after"],
  eventTypes: [0, 1, 2],
  events: [0, 1, 2],
  typeMatch: [false, true],
  conditions: [0, 1, 2],
  semanticMatch: ["early", "late", "never"],
  environment: [
    "complete",
    "policy",
    "missing-state",
    "missing-env",
    "unknown",
    "throw-early",
    "throw-late",
  ],
  patterns: [
    "exact",
    "bare-star",
    "prefix",
    "allow-miss",
    "deny-exact",
    "deny-star",
    "deny-prefix",
    "overlap",
    "list-tail",
  ],
  evidence: ["required-empty", "empty", "subset", "superset"],
  resource: [
    "undefined",
    "missing",
    "one",
    "zero",
    "negative",
    "__proto__:missing",
    "constructor:missing",
    "toString:missing",
    "__proto__:own",
    "constructor:own",
    "toString:own",
  ],
});
export const REASONS = [
  "effect is not a string",
  "authority expired",
  "cannot evaluate revocation",
  "authority revoked",
  "effect denied",
  "effect not allowed",
  "required evidence missing",
  "resource limit exceeded",
];
export const totalCells = () =>
  Object.values(FACTORS).reduce((n, levels) => n * levels.length, 1);
export function* dimensions(axes = FACTORS, prefix = {}) {
  const entries = Object.entries(axes);
  if (!entries.length) {
    yield prefix;
    return;
  }
  const [[name, values], ...rest] = entries;
  for (const value of values)
    yield* dimensions(Object.fromEntries(rest), { ...prefix, [name]: value });
}
export function dimensionAt(index) {
  if (!Number.isSafeInteger(index) || index < 0 || index >= totalCells())
    throw new Error("cell index outside factorial");
  const reversed = [];
  for (const [key, levels] of Object.entries(FACTORS).reverse()) {
    reversed.push([key, levels[index % levels.length]]);
    index = Math.floor(index / levels.length);
  }
  return Object.fromEntries(reversed.reverse());
}
export const defaultDimensions = () =>
  Object.fromEntries(
    Object.entries(FACTORS).map(([key, levels]) => [key, levels[0]]),
  );
export const event = (id, type, payload = {}) => ({
  schemaVersion: 1,
  eventId: id,
  type,
  occurredAt: 9,
  actorId: "a",
  workstreamId: "ws",
  episodeId: "ep",
  payload,
});
const PATTERNS = {
  exact: [["act"], []],
  "bare-star": [["*"], []],
  prefix: [["a*"], []],
  "allow-miss": [["other"], []],
  "deny-exact": [["act"], ["act"]],
  "deny-star": [["act"], ["*"]],
  "deny-prefix": [["act"], ["a*"]],
  overlap: [
    ["*", "act"],
    ["a*", "other"],
  ],
  "list-tail": [
    ["other", "a*"],
    ["other", "absent*"],
  ],
};
const rngCache = new Map();
export function inputFor(d, seed = SEED) {
  if (!rngCache.has(seed))
    rngCache.set(
      seed,
      createHash("sha256").update(seed).digest().readUInt32BE(0),
    );
  const rngState = rngCache.get(seed);
  const [allowedEffects, deniedEffects] = PATTERNS[d.patterns];
  const resource =
    d.resource === "undefined"
      ? undefined
      : d.resource.includes(":")
        ? d.resource.split(":")[0]
        : "units";
  const limit = d.resource === "zero" ? 0 : d.resource === "negative" ? -1 : 1;
  const owns =
    ["one", "zero", "negative"].includes(d.resource) ||
    d.resource.endsWith(":own");
  const envelope = {
    authorityEnvelopeId: "auth",
    allowedEffects,
    deniedEffects,
    resourceLimits: owns ? Object.fromEntries([[resource, limit]]) : {},
    requiredEvidence:
      d.evidence === "required-empty" ? [] : ["proof", "review"],
    expiresAt: 10,
    revocationEventTypes: ["Stop", "Return"].slice(0, d.eventTypes),
    revocationConditions: Array.from({ length: d.conditions }, (_, i) => ({
      registryId:
        d.environment === "unknown" && i === d.conditions - 1
          ? "unknown"
          : "wo103.probe",
      version: 1,
      params: {
        index: i,
        targetCondition: d.semanticMatch === "early" ? 0 : d.conditions - 1,
        targetEvent: d.semanticMatch === "early" ? 0 : d.events - 1,
        match: d.semanticMatch !== "never",
        expectedClock: { before: 9, at: 10, after: 11 }[d.clock],
        expectedRng: rngState,
        throwAt:
          d.environment === "throw-early"
            ? 0
            : d.environment === "throw-late"
              ? Math.max(0, d.conditions * d.events - 1)
              : -1,
      },
    })),
  };
  const context = {
    now: { before: 9, at: 10, after: 11 }[d.clock],
    actorId: "a",
    workstreamId: "ws",
    episodeId: "ep",
    decisionIndex: 3,
    intentIndex: 0,
    evidence:
      d.evidence === "superset"
        ? ["proof", "review", "extra"]
        : d.evidence === "subset"
          ? ["proof"]
          : [],
    revokedBy: Array.from({ length: d.events }, (_, i) =>
      event(
        `rev-${i}`,
        d.typeMatch && i === d.events - 1
          ? d.eventTypes === 2
            ? "Return"
            : "Stop"
          : "Tick",
        {
          index: i,
        },
      ),
    ),
    ...(d.environment === "missing-state" ? {} : { state: { marker: seed } }),
  };
  const environment =
    d.environment === "missing-env"
      ? null
      : {
          rngState,
          ...(d.environment === "policy" ? { policy: { tag: seed } } : {}),
          registry: "wo103.probe@1",
          suppliedNow: -999,
        };
  return {
    dimensions: d,
    intent: {
      kind: "Act",
      effect: d.effect === "string" ? "act" : 17,
      ...(resource === undefined ? {} : { resource }),
      payload: {},
    },
    envelope,
    context,
    environment,
  };
}
export function materialize(input) {
  const calls = [];
  const context = { ...input.context };
  if (input.environment !== null) {
    const data = input.environment;
    context.predicateEnv = {
      rngState: data.rngState,
      now: data.suppliedNow,
      predicates: {
        "wo103.probe": {
          1: ({ state, env, event: rev }, params) => {
            const ordinal = calls.length;
            calls.push({
              condition: params.index,
              eventId: rev.eventId,
              state,
              now: env.now,
              rngState: env.rngState,
              params,
              ...(env.policy === undefined ? {} : { policy: env.policy }),
            });
            if (ordinal === params.throwAt)
              throw new Error("planted predicate failure");
            if (
              state.marker === undefined ||
              env.now !== params.expectedClock ||
              env.rngState !== params.expectedRng
            )
              throw new Error("predicate input drift");
            return (
              params.match &&
              params.index === params.targetCondition &&
              rev.payload.index === params.targetEvent
            );
          },
        },
      },
      ...(data.policy === undefined ? {} : { policy: data.policy }),
    };
  }
  return {
    intent: structuredClone(input.intent),
    envelope: structuredClone(input.envelope),
    context,
    calls,
  };
}
// The oracle computes failure flags, then ranks them. It does not invoke the kernel,
// the executable test predicate, effectMatches, predicate, or commandId.
export function oracle(input) {
  const { intent, envelope: a, context: c, environment: env } = input;
  const semanticConsumed =
    typeof intent.effect === "string" &&
    c.now < a.expiresAt &&
    a.revocationConditions.length > 0;
  const calls = [];
  let broken = false,
    matched = false;
  if (semanticConsumed) {
    broken =
      c.state === undefined ||
      env === null ||
      a.revocationConditions.some(
        (r) => r.registryId !== "wo103.probe" || r.version !== 1,
      );
    if (!broken) {
      outer: for (const ref of a.revocationConditions)
        for (const rev of c.revokedBy) {
          const p = ref.params;
          calls.push({
            condition: p.index,
            eventId: rev.eventId,
            state: c.state,
            now: c.now,
            rngState: env.rngState,
            params: p,
            ...(env.policy === undefined ? {} : { policy: env.policy }),
          });
          if (calls.length - 1 === p.throwAt) {
            broken = true;
            matched = false;
            break outer;
          }
          matched ||=
            p.match &&
            p.index === p.targetCondition &&
            rev.payload.index === p.targetEvent;
        }
    }
  }
  const matches = (s) =>
    s.slice(-1) === "*"
      ? intent.effect.slice(0, s.length - 1) === s.slice(0, -1)
      : s === intent.effect;
  const failures = [
    typeof intent.effect !== "string",
    c.now >= a.expiresAt,
    broken,
    c.revokedBy.some((e) => a.revocationEventTypes.includes(e.type)) || matched,
    typeof intent.effect === "string" && a.deniedEffects.some(matches),
    typeof intent.effect === "string" && !a.allowedEffects.some(matches),
    !a.requiredEvidence.every((proof) => c.evidence.includes(proof)),
    intent.resource !== undefined &&
      (!Object.keys(a.resourceLimits).includes(intent.resource) ||
        a.resourceLimits[intent.resource] <= 0),
  ];
  const winner = failures.indexOf(true);
  const suffix = semanticConsumed
    ? [
        ...(c.state === undefined ? [] : ["state"]),
        ...(env === null
          ? []
          : [
              `rngState:${env.rngState}`,
              "predicates",
              ...(env.policy === undefined ? [] : ["policy"]),
            ]),
      ]
    : [];
  if (winner >= 0) {
    const reason = REASONS[winner];
    return {
      result: {
        authorized: false,
        refusal: {
          schemaVersion: 1,
          type: "CommandRefused",
          occurredAt: c.now,
          actorId: c.actorId,
          workstreamId: c.workstreamId,
          ...(c.episodeId === undefined ? {} : { episodeId: c.episodeId }),
          payload: {
            intentIndex: c.intentIndex,
            reason,
            authorityEnvelopeId: a.authorityEnvelopeId,
          },
        },
        trace: {
          reactorId: "authority-guard",
          reactorVersion: "1",
          branchPath: ["refused", reason],
          envInputs: [
            "now",
            "authorityEnvelope",
            "evidence",
            "revocations",
            ...suffix,
          ],
          cadenceEvaluations: [],
        },
      },
      calls,
    };
  }
  const limits = { ...a.resourceLimits };
  if (intent.resource !== undefined)
    Object.defineProperty(limits, intent.resource, {
      value: limits[intent.resource] - 1,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  return {
    result: {
      authorized: true,
      command: {
        commandId: referenceCommandId(c),
        ...(c.episodeId === undefined ? {} : { episodeId: c.episodeId }),
        workstreamId: c.workstreamId,
        intent,
      },
      authority: { ...a, resourceLimits: limits },
      trace: {
        reactorId: "authority-guard",
        reactorVersion: "1",
        branchPath: ["authorized", intent.effect],
        envInputs: [
          `now:${c.now}`,
          `authorityEnvelope:${a.authorityEnvelopeId}`,
          "evidence",
          "revocations",
          ...suffix,
          ...(intent.resource === undefined
            ? []
            : [`resource:${intent.resource}`]),
        ],
        cadenceEvaluations: [],
      },
    },
    calls,
  };
}
const idCache = new Map();
export function referenceCommandId(c) {
  const text = `${c.episodeId ? `ep:${c.episodeId}` : `ws:${c.workstreamId}`}:${c.decisionIndex}:${c.intentIndex}`;
  if (idCache.has(text)) return idCache.get(text);
  // Independent high/low word FNV arithmetic, rather than shipped BigInt loop.
  let high = 0xcbf29ce4,
    low = 0x84222325;
  for (const byte of Buffer.from(text, "utf8")) {
    low = (low ^ byte) >>> 0;
    const product = low * 0x1b3;
    high =
      (high * 0x1b3 + low * 0x100 + Math.floor(product / 0x100000000)) >>> 0;
    low = product >>> 0;
  }
  const result = `cmd_${high.toString(16).padStart(8, "0")}${low.toString(16).padStart(8, "0")}`;
  idCache.set(text, result);
  return result;
}
export function runCell(kernel, input) {
  const expected = oracle(input);
  const runtime = materialize(input);
  let observed;
  try {
    observed = kernel.authorize(
      runtime.intent,
      runtime.envelope,
      runtime.context,
    );
  } catch (error) {
    return {
      expected,
      observed: { threw: { name: error.name, message: error.message } },
      calls: runtime.calls,
      mismatch: true,
    };
  }
  return {
    expected,
    observed,
    calls: runtime.calls,
    mismatch:
      !isDeepStrictEqual(expected.result, observed) ||
      !isDeepStrictEqual(expected.calls, runtime.calls),
  };
}
export function goldenIndices(seed = SEED) {
  const selected = new Set([0, totalCells() - 1]);
  // Each factor level gets a planted cell with all other factors at an authorizing base.
  const base = {
    ...defaultDimensions(),
    evidence: "required-empty",
    semanticMatch: "never",
    environment: "complete",
    resource: "undefined",
  };
  const indexOf = (d) =>
    Object.entries(FACTORS).reduce(
      (n, [key, levels]) => n * levels.length + levels.indexOf(d[key]),
      0,
    );
  for (const [key, levels] of Object.entries(FACTORS))
    for (const value of levels)
      selected.add(indexOf({ ...base, [key]: value }));
  for (const environment of ["missing-state", "missing-env"])
    selected.add(indexOf({ ...base, conditions: 1, events: 1, environment }));
  let state = createHash("sha256")
    .update(`${seed}:golden`)
    .digest()
    .readUInt32BE(0);
  while (selected.size < 512) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    selected.add(state % totalCells());
  }
  return selected;
}
export function sweepAuthority(kernel, seed = SEED) {
  const hash = createHash("sha256"),
    golden = [],
    selected = goldenIndices(seed),
    findingExamples = [];
  const winners = {},
    findingCounts = {};
  let count = 0,
    calls = 0;
  for (let i = 0; i < totalCells(); i++) {
    const input = inputFor(dimensionAt(i), seed);
    const run = runCell(kernel, input);
    const winner = run.expected.result.trace.branchPath[1];
    winners[winner] = (winners[winner] ?? 0) + 1;
    calls += run.calls.length;
    // All expectation bytes, not only golden cells, contribute to the stream identity.
    hash.update(JSON.stringify([i, input, run.expected]) + "\n");
    if (run.mismatch) {
      findingCounts.divergence = (findingCounts.divergence ?? 0) + 1;
      if (findingExamples.length < 16)
        findingExamples.push({
          cellId: `authority-${i}`,
          input,
          expected: run.expected,
          observed: run.observed,
          observedCalls: run.calls,
        });
    }
    if (selected.has(i))
      golden.push({
        cellId: `authority-${i}`,
        input,
        expected: run.expected.result,
        expectedCalls: run.expected.calls,
        branchPath: run.expected.result.trace.branchPath,
      });
    count++;
  }
  return {
    count,
    calls,
    winners,
    sha256: hash.digest("hex"),
    golden,
    findingCounts,
    findingExamples,
  };
}
