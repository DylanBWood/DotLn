import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { dimensions, event, SEED } from "./wo103-authority-lib.mjs";

export const OUTBOX_FACTORS = {
  commandShape: [
    "complete",
    "id-only",
    "missing-intent",
    "missing-id",
    "empty-id",
    "non-string-id",
    "null",
    "array",
  ],
  commandKey: ["cmd-a", "__proto__", "constructor", "toString"],
  malformed: ["null", "array", "number", "missing-field", "invalid-field"],
};
export const PERMUTATION_POLICY = {
  maximumFullAlphabetSize: 6,
  maximumFullOrdersPerAlphabet: 720,
  seededOrdersAboveCap: 128,
  alphabetSizes: {
    pending: 4,
    duplicateOrphans: 6,
    permanentOrphans: 6,
    multipleCommands: 8,
  },
};
export function* permutations(values) {
  if (!values.length) {
    yield [];
    return;
  }
  for (let i = 0; i < values.length; i++)
    for (const rest of permutations([
      ...values.slice(0, i),
      ...values.slice(i + 1),
    ]))
      yield [values[i], ...rest];
}
const orderCache = new Map();
export function ordersFor(size, seed = SEED) {
  const key = `${seed}:${size}`;
  if (orderCache.has(key)) return orderCache.get(key);
  const values = Array.from({ length: size }, (_, i) => i);
  if (size <= PERMUTATION_POLICY.maximumFullAlphabetSize) {
    const result = [...permutations(values)];
    orderCache.set(key, result);
    return result;
  }
  const orders = new Map();
  let state = createHash("sha256")
    .update(`${seed}:outbox:${size}`)
    .digest()
    .readUInt32BE(0);
  while (orders.size < PERMUTATION_POLICY.seededOrdersAboveCap) {
    const order = [...values];
    for (let i = size - 1; i > 0; i--) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const j = state % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    orders.set(order.join(","), order);
  }
  const result = [...orders.values()];
  orderCache.set(key, result);
  return result;
}
export function alphabetFor(d, kind) {
  const id = d.commandKey;
  const complete = {
    commandId: id,
    workstreamId: "ws",
    episodeId: "ep",
    intent: { kind: "Act", effect: "act", payload: {} },
  };
  const shape = {
    complete,
    "id-only": { commandId: id },
    "missing-intent": { commandId: id, workstreamId: "ws" },
    "missing-id": { workstreamId: "ws", intent: complete.intent },
    "empty-id": { ...complete, commandId: "" },
    "non-string-id": { ...complete, commandId: 17 },
    null: null,
    array: [complete],
  }[d.commandShape];
  const bad = {
    null: null,
    array: [],
    number: 17,
    "missing-field": {},
    "invalid-field": { command: { commandId: 17 }, commandId: 17 },
  }[d.malformed];
  const persist = event("persist", "CommandPersisted", { command: shape });
  // Different payload for the same ID tests first-persist-wins, not just equal delivery.
  const duplicate = event("persist-duplicate", "CommandPersisted", {
    command:
      shape && !Array.isArray(shape) ? { ...shape, replacement: true } : shape,
  });
  const unknown = event("unrelated", "Unrelated", {
    command: complete,
    commandId: id,
  });
  const malformed = event(
    "malformed",
    kind === "pending" ? "CommandPersisted" : "CommandResult",
    bad,
  );
  const result = event("result", "CommandResult", {
    commandId: id,
    result: "ok",
  });
  const resultDuplicate = { ...result };
  const base =
    kind === "pending"
      ? [persist, duplicate, unknown, malformed]
      : [persist, duplicate, result, resultDuplicate, unknown, malformed];
  if (kind === "permanentOrphans")
    return [
      persist,
      result,
      resultDuplicate,
      event("orphan", "CommandResult", {
        commandId: "never-persisted",
        result: "ok",
      }),
      event("orphan-duplicate", "CommandResult", {
        commandId: "never-persisted",
        result: "ok",
      }),
      malformed,
    ];
  if (kind === "multipleCommands") {
    const commandB = { ...complete, commandId: "cmd-b" };
    base.push(
      event("persist-b", "CommandPersisted", { command: commandB }),
      event("result-b", "CommandResult", { commandId: "cmd-b", result: "ok" }),
    );
  }
  return base;
}
const object = (v) => v !== null && !Array.isArray(v) && typeof v === "object";
const persisted = (e) =>
  e.type === "CommandPersisted" &&
  object(e.payload) &&
  object(e.payload.command) &&
  typeof e.payload.command.commandId === "string" &&
  e.payload.command.commandId !== ""
    ? e.payload.command
    : undefined;
const resultId = (e) =>
  e.type === "CommandResult" &&
  object(e.payload) &&
  typeof e.payload.commandId === "string"
    ? e.payload.commandId
    : undefined;
const trace = (classification) => ({
  reactorId: "outbox",
  reactorVersion: "1",
  branchPath: ["result", classification],
  envInputs: ["commandId"],
  cadenceEvaluations: [],
});
// A declarative whole-log oracle: first persist per ID and first result per ID.
// Retroactive orphan classification follows from their relative positions.
export function outboxOracle(events) {
  const commands = events
    .map((e, i) => ({ command: persisted(e), index: i }))
    .filter((x) => x.command !== undefined);
  const firstPersist = commands.filter(
    (x, i) =>
      commands.findIndex((y) => y.command.commandId === x.command.commandId) ===
      i,
  );
  const state = {
    entries: Object.fromEntries(
      firstPersist.map(({ command }) => {
        const result = events.find((e) => resultId(e) === command.commandId);
        return [
          command.commandId,
          {
            command,
            status: result ? "completed" : "pending",
            ...(result ? { resultEventId: result.eventId } : {}),
          },
        ];
      }),
    ),
  };
  const traces = events.flatMap((e, index) => {
    if (e.type !== "CommandResult") return [];
    const id = resultId(e),
      persist = firstPersist.find((x) => x.command.commandId === id);
    if (!persist) return [trace("unknown")];
    const first = events.findIndex((candidate) => resultId(candidate) === id);
    return [
      trace(
        index !== first
          ? "dedup"
          : index < persist.index
            ? "preceded-persist"
            : "accepted",
      ),
    ];
  });
  return { state, traces };
}
export const completeCommand = (c) =>
  object(c) &&
  typeof c.commandId === "string" &&
  c.commandId !== "" &&
  typeof c.workstreamId === "string" &&
  object(c.intent) &&
  c.intent.kind === "Act" &&
  typeof c.intent.effect === "string" &&
  Object.hasOwn(c.intent, "payload");
export function outboxCount(seed = SEED) {
  return (
    Object.values(OUTBOX_FACTORS).reduce((n, levels) => n * levels.length, 1) *
    Object.values(PERMUTATION_POLICY.alphabetSizes).reduce(
      (n, size) => n + ordersFor(size, seed).length,
      0,
    )
  );
}
export function* outboxCells(seed = SEED) {
  const orders = Object.fromEntries(
    Object.entries(PERMUTATION_POLICY.alphabetSizes).map(([kind, size]) => [
      kind,
      ordersFor(size, seed),
    ]),
  );
  let i = 0;
  for (const d of dimensions(OUTBOX_FACTORS))
    for (const [kind, orderList] of Object.entries(orders)) {
      const alphabet = alphabetFor(d, kind);
      for (const order of orderList)
        yield {
          cellId: `outbox-${i++}`,
          dimensions: { ...d, alphabet: kind },
          order,
          events: order.map((index) => alphabet[index]),
          expected: outboxOracle(order.map((index) => alphabet[index])),
          branchPath: outboxOracle(
            order.map((index) => alphabet[index]),
          ).traces.map((t) => t.branchPath),
        };
    }
}
export function sweepOutbox(kernel, seed = SEED) {
  const hash = createHash("sha256"),
    golden = [],
    classifications = {},
    findings = [],
    findingCounts = {};
  let count = 0;
  for (const cell of outboxCells(seed)) {
    const actual = kernel.replayOutbox(cell.events, { includeTraces: true });
    const legacy = kernel.replayOutbox(cell.events);
    if (
      !isDeepStrictEqual(actual, cell.expected) ||
      !isDeepStrictEqual(legacy, cell.expected.state)
    ) {
      findingCounts.divergence = (findingCounts.divergence ?? 0) + 1;
      if (findings.length < 16)
        findings.push({ ...cell, observed: actual, legacy });
    }
    const doubledEvents = cell.events.flatMap((e) => [e, e]);
    const doubled = kernel.replayOutbox(doubledEvents, { includeTraces: true });
    const doubledLegacy = kernel.replayOutbox(doubledEvents);
    const doubledExpected = outboxOracle(doubledEvents);
    if (
      !isDeepStrictEqual(doubled.state, legacy) ||
      !isDeepStrictEqual(doubled, doubledExpected) ||
      !isDeepStrictEqual(doubledLegacy, doubledExpected.state)
    ) {
      findingCounts.divergence = (findingCounts.divergence ?? 0) + 1;
      if (findings.filter((f) => f.kind !== "incompletePending").length < 16)
        findings.push({
          ...cell,
          delivery: "each-event-twice",
          events: doubledEvents,
          expected: doubledExpected,
          observed: doubled,
          legacy: doubledLegacy,
        });
    }
    for (const t of actual.traces)
      classifications[t.branchPath[1]] =
        (classifications[t.branchPath[1]] ?? 0) + 1;
    const invalid = kernel
      .pendingCommands(actual.state)
      .filter((c) => !completeCommand(c));
    if (invalid.length) {
      findingCounts.incompletePending =
        (findingCounts.incompletePending ?? 0) + 1;
      if (!findings.some((f) => f.kind === "incompletePending"))
        findings.push({
          kind: "incompletePending",
          ...cell,
          incompleteCommands: invalid,
        });
    }
    hash.update(JSON.stringify({ delivery: "once", cell }) + "\n");
    hash.update(
      JSON.stringify({
        cellId: cell.cellId,
        delivery: "each-event-twice",
        expected: doubledExpected,
      }) + "\n",
    );
    // One recorded order per alphabet/factor combination covers every declared level.
    if (
      cell.order.join(",") ===
      ordersFor(
        PERMUTATION_POLICY.alphabetSizes[cell.dimensions.alphabet],
        seed,
      )[0].join(",")
    )
      golden.push(cell);
    count++;
  }
  return {
    count,
    sha256: hash.digest("hex"),
    classifications,
    findingCounts,
    findings,
    golden,
  };
}
