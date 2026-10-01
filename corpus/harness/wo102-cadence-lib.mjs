import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { fileURLToPath } from "node:url";
import { evaluateCadence } from "../../packages/kernel/dist/src/index.js";
import { referenceDraw, referenceEvaluate } from "./wo102-reference.mjs";

export const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const RECORDED_SEED = "wo102-seed-20261001";
export const PINNED_BASE_COMMIT = "ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0";
export const REGISTRY = Object.freeze([
  {
    registryId: "truth",
    versions: [1, 2],
    rule: "params.open === true; version 2 negates",
  },
  {
    registryId: "state.flag",
    versions: [1, 2],
    rule: "state.flags[params.level] === true; version 2 negates",
  },
  {
    registryId: "event.open",
    versions: [1, 2],
    rule: "event.type === OpenGate and event.payload.flags[params.level] === true; version 2 negates",
  },
]);
export const GRID = {
  version: 1,
  Once: {
    at: [-100, 0, 100, 1e12],
    nowOffsets: [-1, 0, 1],
    rngState: [0, 42, 4294967295],
  },
  After: {
    delayMs: [0, 1, 100, 1e12],
    now: [-100, 0, 100, 1e12],
    rngState: [0, 42, 4294967295],
  },
  Every: {
    startAt: ["absent", -100, 0, 100, 1e12],
    intervalMs: [1, 7, 20, 1e12],
    nowCells: [
      "before-start",
      "at-start",
      "after-start",
      "before-first-tick",
      "at-first-tick",
      "after-first-tick",
      "at-fourth-tick",
    ],
    rngState: [0, 42, 4294967295],
    invalidIntervalMs: ["NaN", "+Infinity", "-Infinity", 0, -1],
  },
  composition: {
    roots: ["Gate", "Until"],
    depths: [1, 2, 3, 4, 5, 6],
    profiles: ["truth", "state.flag", "event.open"],
    assignment:
      "all 2^depth truth masks; alternate wrapper kind and predicate version at each level",
    leaves: [
      "Once",
      "After",
      "Every-absent",
      "Every-present",
      "Backoff-jitter",
      "Backoff-zero-jitter",
      "Every-invalid",
    ],
    env: { now: 100, rngState: 42 },
    event:
      "event.open: OpenGate when any raw flag is true; otherwise an omitted event or OtherEvent; extra unknown-id/version short-circuit pins",
  },
  Backoff: {
    initialMs: [0, 1, 100],
    factor: [0.5, 1, 2, 3],
    attempt: [0, 1, 2, 3, 10, 31],
    maxMs: [0, 1, 250, 100000],
    jitter: [0, 0.25, 0.5, 1, 2],
    rngState: [
      0, 1, 7, 42, 2147483647, 2147483648, 4294967295, 634785765, 615934122,
      2782269413, 653637408,
    ],
    now: [-100, 0, 100, 1e12],
  },
};
export const BUDGET = {
  maximumTotalFixtureBytes: 2097152,
  maximumRowsPerSampledConstructor: 512,
  shardRows: 256,
};
export const KINDS = ["Once", "After", "Every", "Gate", "Until", "Backoff"];
export const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");

// JSON cannot represent nonfinite numbers. Only this explicit tagged scalar is
// interpreted specially; absent startAt remains absent in the stored AST.
export function encodeNumbers(value) {
  if (typeof value === "number" && !Number.isFinite(value))
    return {
      $number: Number.isNaN(value)
        ? "NaN"
        : value > 0
          ? "+Infinity"
          : "-Infinity",
    };
  if (Array.isArray(value)) return value.map(encodeNumbers);
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, encodeNumbers(child)]),
    );
  return value;
}
export function decodeNumbers(value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    if (Object.keys(value).length === 1 && "$number" in value) {
      const numbers = {
        NaN: NaN,
        "+Infinity": Infinity,
        "-Infinity": -Infinity,
      };
      if (!Object.hasOwn(numbers, value.$number))
        throw new Error("Unknown tagged number");
      return numbers[value.$number];
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, decodeNumbers(child)]),
    );
  }
  return Array.isArray(value) ? value.map(decodeNumbers) : value;
}
export const json = (value) => JSON.stringify(encodeNumbers(value));
const copy = (value) => decodeNumbers(JSON.parse(json(value)));
export function outcome(run) {
  try {
    return { result: run() };
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { throws: { name: error.name, message: error.message } };
  }
}
export function shipped(row, calls = []) {
  const predicates = {};
  for (const { registryId } of REGISTRY) {
    const read =
      registryId === "truth"
        ? (_context, params) => params.open === true
        : registryId === "state.flag"
          ? ({ state }, params) =>
              state.flags?.[String(params.level ?? 0)] === true
          : ({ event }, params) =>
              event?.type === "OpenGate" &&
              event.payload?.flags?.[String(params.level ?? 0)] === true;
    predicates[registryId] = Object.fromEntries(
      [1, 2].map((version) => [
        version,
        (context, params) => {
          calls.push({
            registryId,
            version,
            ...(Object.keys(params).length ? { params } : {}),
          });
          const value = read(context, params);
          return version === 1 ? value : !value;
        },
      ]),
    );
  }
  return outcome(() =>
    evaluateCadence(
      row.cadence,
      row.state,
      { ...row.env, predicates },
      row.event,
    ),
  );
}
export const reference = (row, calls = []) =>
  outcome(() => referenceEvaluate(row, calls));
const event = (flags, type = "OpenGate") => ({
  schemaVersion: 1,
  eventId: "evt_cadence",
  type,
  occurredAt: 90,
  actorId: "corpus",
  workstreamId: "cadence",
  payload: { flags },
});

export function enumerateGrid() {
  const rows = [];
  const add = (cadence, env, classes, state = {}, trigger) => {
    const row = {
      id: `cadence-${String(rows.length + 1).padStart(6, "0")}`,
      kind: cadence.kind,
      classes,
      cadence,
      state,
      env,
    };
    if (trigger !== undefined) row.event = trigger;
    const calls = [];
    row.expected = shipped(row, calls);
    row.predicateCalls = calls;
    rows.push(row);
  };
  for (const at of GRID.Once.at)
    for (const offset of GRID.Once.nowOffsets)
      for (const rngState of GRID.Once.rngState)
        add({ kind: "Once", at }, { now: at + offset, rngState }, [
          offset < 0 ? "before-at" : offset === 0 ? "at-at" : "after-at",
        ]);
  for (const delayMs of GRID.After.delayMs)
    for (const now of GRID.After.now)
      for (const rngState of GRID.After.rngState)
        add({ kind: "After", delayMs }, { now, rngState }, [
          delayMs === 0
            ? "zero-delay"
            : delayMs === 1
              ? "unit-delay"
              : delayMs === 1e12
                ? "huge-delay"
                : "ordinary-delay",
          now < delayMs
            ? "now-before-delay"
            : now === delayMs
              ? "now-at-delay"
              : "now-after-delay",
        ]);
  for (const startAt of GRID.Every.startAt) {
    const start = startAt === "absent" ? 0 : startAt;
    for (const intervalMs of GRID.Every.intervalMs) {
      const times = [
        start - 1,
        start,
        start + 1,
        start + intervalMs - 1,
        start + intervalMs,
        start + intervalMs + 1,
        start + 4 * intervalMs,
      ];
      for (const [index, now] of times.entries())
        for (const rngState of GRID.Every.rngState)
          add(
            {
              kind: "Every",
              intervalMs,
              ...(startAt === "absent" ? {} : { startAt }),
            },
            { now, rngState },
            [
              startAt === "absent" ? "startAt-absent" : "startAt-present",
              GRID.Every.nowCells[index],
              intervalMs === 1
                ? "unit-interval"
                : intervalMs === 1e12
                  ? "huge-interval"
                  : "ordinary-interval",
            ],
          );
    }
    for (const value of GRID.Every.invalidIntervalMs) {
      const intervalMs =
        typeof value === "string" ? decodeNumbers({ $number: value }) : value;
      for (const now of [start - 1, start, start + 1])
        for (const rngState of GRID.Every.rngState)
          add(
            {
              kind: "Every",
              intervalMs,
              ...(startAt === "absent" ? {} : { startAt }),
            },
            { now, rngState },
            [
              startAt === "absent" ? "startAt-absent" : "startAt-present",
              `invalid-interval:${value}`,
            ],
          );
    }
  }
  const leaves = [
    { kind: "Once", at: 150 },
    { kind: "After", delayMs: 10 },
    { kind: "Every", intervalMs: 20 },
    { kind: "Every", intervalMs: 20, startAt: 50 },
    {
      kind: "Backoff",
      initialMs: 100,
      factor: 2,
      maxMs: 100000,
      attempt: 3,
      jitter: 0.5,
    },
    {
      kind: "Backoff",
      initialMs: 100,
      factor: 2,
      maxMs: 250,
      attempt: 3,
      jitter: 0,
    },
    { kind: "Every", intervalMs: 0 },
  ];
  for (const root of GRID.composition.roots)
    for (const depth of GRID.composition.depths)
      for (const profile of GRID.composition.profiles)
        for (let mask = 0; mask < 2 ** depth; mask++)
          for (const [leafIndex, leaf] of leaves.entries()) {
            const refs = [];
            const flags = {};
            for (let level = 0; level < depth; level++) {
              const version = (level % 2) + 1;
              const truth = (mask & (1 << level)) !== 0;
              const raw = version === 1 ? truth : !truth;
              flags[String(level)] = raw;
              refs.push({
                registryId: profile,
                version,
                params: {
                  level,
                  ...(profile === "truth" ? { open: raw } : {}),
                },
              });
            }
            let cadence = leaf;
            for (let level = depth - 1; level >= 0; level--)
              cadence = {
                kind:
                  level % 2 === 0 ? root : root === "Gate" ? "Until" : "Gate",
                cadence,
                conditionRef: refs[level],
              };
            const hasEvent =
              profile === "event.open" && Object.values(flags).some(Boolean);
            const trigger =
              profile !== "event.open"
                ? undefined
                : hasEvent
                  ? event(flags)
                  : depth % 2 === 0
                    ? event(flags, "OtherEvent")
                    : undefined;
            add(
              cadence,
              GRID.composition.env,
              [
                `depth:${depth}`,
                `profile:${profile}`,
                `leaf:${GRID.composition.leaves[leafIndex]}`,
                `truth-mask:${mask}`,
                trigger === undefined
                  ? "event-absent"
                  : `event:${trigger.type}`,
              ],
              { flags },
              trigger,
            );
          }
  for (const root of GRID.composition.roots)
    for (const open of [false, true])
      for (const conditionRef of [
        { registryId: "missing", version: 1 },
        { registryId: "truth", version: 99 },
      ])
        add(
          {
            kind: root,
            cadence: { kind: "Gate", cadence: leaves[0], conditionRef },
            conditionRef: { registryId: "truth", version: 1, params: { open } },
          },
          GRID.composition.env,
          ["depth:2", "unknown-predicate-short-circuit", `outer-truth:${open}`],
        );
  for (const initialMs of GRID.Backoff.initialMs)
    for (const factor of GRID.Backoff.factor)
      for (const attempt of GRID.Backoff.attempt)
        for (const maxMs of GRID.Backoff.maxMs)
          for (const jitter of GRID.Backoff.jitter)
            for (const rngState of GRID.Backoff.rngState)
              for (const now of GRID.Backoff.now) {
                const cadence = {
                  kind: "Backoff",
                  initialMs,
                  factor,
                  maxMs,
                  attempt,
                  jitter,
                };
                const { unit } = referenceDraw(rngState);
                const raw =
                  initialMs * factor ** attempt * (1 + (unit * 2 - 1) * jitter);
                add(cadence, { now, rngState }, [
                  ...Object.entries({
                    initialMs,
                    factor,
                    attempt,
                    maxMs,
                    jitter,
                    rngState,
                    now,
                  }).map(([key, value]) => `${key}:${value}`),
                  raw < 0
                    ? "floor-clamp"
                    : Math.round(raw) > maxMs
                      ? "max-clamp"
                      : "unclamped",
                  raw % 1 === 0.5 ? "rounding-half" : "rounding-other",
                  jitter === 0 ? "zero-jitter-draw" : "jitter-draw",
                ]);
              }
  return rows;
}

export function countRows(rows) {
  const byConstructor = {};
  const byClass = {};
  const byOutcome = {};
  for (const row of rows) {
    byConstructor[row.kind] = (byConstructor[row.kind] ?? 0) + 1;
    byClass[row.kind] ??= {};
    for (const name of row.classes)
      byClass[row.kind][name] = (byClass[row.kind][name] ?? 0) + 1;
    const name = row.expected.throws
      ? "throw"
      : row.expected.result.dueAt === null
        ? "null"
        : "due";
    byOutcome[row.kind] ??= {};
    byOutcome[row.kind][name] = (byOutcome[row.kind][name] ?? 0) + 1;
  }
  return { total: rows.length, byConstructor, byClass, byOutcome };
}
export function sampleGrid(rows, seed) {
  const selected = [];
  for (const kind of KINDS) {
    const candidates = rows.filter((row) => row.kind === kind);
    if (["Once", "After", "Every"].includes(kind)) {
      selected.push(...candidates);
      continue;
    }
    const ordered = candidates
      .map((row) => ({ row, rank: sha256(`${seed}\n${row.id}`) }))
      .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0));
    // Guarantee a representative of each class and outcome before filling the
    // bounded sample. Seed ranks reorder, never alter, the full declared set.
    const covered = new Set();
    const chosen = new Map();
    for (const { row } of ordered) {
      const labels = [
        ...row.classes,
        row.expected.throws
          ? "outcome:throw"
          : row.expected.result.dueAt === null
            ? "outcome:null"
            : "outcome:due",
      ];
      if (labels.some((label) => !covered.has(label))) {
        chosen.set(row.id, row);
        for (const label of labels) covered.add(label);
      }
    }
    if (chosen.size > BUDGET.maximumRowsPerSampledConstructor)
      throw new Error("Class coverage exceeds sample budget");
    for (const { row } of ordered) {
      if (chosen.size === BUDGET.maximumRowsPerSampledConstructor) break;
      chosen.set(row.id, row);
    }
    selected.push(...chosen.values());
  }
  return selected;
}

export function inspectRow(row, evaluator = shipped) {
  const issues = [];
  const before = json(row);
  const calls = [];
  const actual = evaluator(row, calls);
  const referenceCalls = [];
  const expectedReference = reference(row, referenceCalls);
  const note = (type, expected, observed) =>
    issues.push({
      type,
      vectorId: row.id,
      vector: encodeNumbers(row),
      expected: encodeNumbers(expected),
      actual: encodeNumbers(observed),
    });
  if (!isDeepStrictEqual(actual, expectedReference))
    note("shipped-reference-drift", expectedReference, actual);
  if (!isDeepStrictEqual(calls, referenceCalls))
    note("predicate-call-order", referenceCalls, calls);
  const repeated = evaluator(copy(row));
  if (!isDeepStrictEqual(actual, repeated))
    note("determinism", actual, repeated);
  if (json(row) !== before) note("input-mutation", before, json(row));
  if (actual.result) {
    const { dueAt, rngState } = actual.result;
    if (row.kind === "Backoff") {
      const delay = dueAt - row.env.now;
      if (!(delay >= 0 && delay <= row.cadence.maxMs))
        note(
          "backoff-clamp",
          { minimum: 0, maximum: row.cadence.maxMs },
          { delay },
        );
      if (rngState !== referenceDraw(row.env.rngState).next)
        note("rng-threading", referenceDraw(row.env.rngState).next, rngState);
    } else if (row.kind === "Every") {
      if (!(dueAt > row.env.now))
        note("every-next-tick", "strictly after now", dueAt);
    } else if (
      ["Once", "After"].includes(row.kind) &&
      rngState !== row.env.rngState
    )
      note("rng-preservation", row.env.rngState, rngState);
  }
  return issues;
}
export function numberFindings(issues) {
  return issues.map((issue, index) => ({
    number: `WO-102-F${String(index + 1).padStart(3, "0")}`,
    ...issue,
  }));
}
export function inspectGrid(rows, evaluator = shipped) {
  return numberFindings(rows.flatMap((row) => inspectRow(row, evaluator)));
}

// Poison only the synchronous evaluator window, and always restore the host.
// Ordinary shipped/reference drift and ambient dependence are separate records.
export function inspectPurity(rows, evaluator = shipped) {
  const originalNow = Date.now;
  const originalRandom = Math.random;
  const issues = [];
  try {
    Date.now = () => {
      throw new Error("ambient Date.now consulted");
    };
    Math.random = () => {
      throw new Error("ambient Math.random consulted");
    };
    for (const row of rows) {
      const actual = evaluator(copy(row));
      if (!isDeepStrictEqual(actual, row.expected))
        issues.push({
          type: "ambient-source-leakage",
          vectorId: row.id,
          vector: encodeNumbers(row),
          expected: encodeNumbers(row.expected),
          actual: encodeNumbers(actual),
        });
    }
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
  return issues;
}
export function inspectCorpus(rows, evaluator = shipped) {
  return numberFindings([
    ...rows.flatMap((row) => inspectRow(row, evaluator)),
    ...inspectPurity(rows, evaluator),
  ]);
}
