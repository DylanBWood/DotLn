import { createHash } from "node:crypto";
import {
  PATHS,
  cloneJson,
  countBy,
  deepFreeze,
  errorRecord,
  jsonlBytes,
  makeRng,
  shuffled,
} from "./wo101-support.mjs";

export const PROGRAM_BOUNDS = deepFreeze({
  maximumNodes: 4,
  maximumDepth: 4,
  sequenceArities: [0, 1, 2],
  invokeContinuationShape: { keys: ["ok"], entries: 1 },
  committedProgramsPerRootKind: 32,
  committedShardMaximumRows: 250,
});

export const PREDICATE_REGISTRY_DATA = deepFreeze({
  schemaVersion: 1,
  entries: [
    {
      registryId: "state.equals",
      version: 1,
      semantics:
        "true iff object state field params.field strictly equals params.expected",
      params: { field: "string", expected: "JsonValue" },
    },
    {
      registryId: "event.type",
      version: 1,
      semantics:
        "true iff an event exists and event.type strictly equals params.type",
      params: { type: "string" },
    },
  ],
});

function objectField(value, field) {
  return value !== null && !Array.isArray(value) && typeof value === "object"
    ? value[field]
    : undefined;
}

export function hydratePredicateRegistry() {
  return {
    "state.equals": {
      1: ({ state }, params) =>
        objectField(state, String(params.field)) === params.expected,
    },
    "event.type": {
      1: ({ event }, params) =>
        event !== undefined && event.type === params.type,
    },
  };
}

const drafts = deepFreeze([
  {
    schemaVersion: 1,
    type: "Emitted",
    occurredAt: 0,
    actorId: "actor:a",
    workstreamId: "ws:a",
    payload: null,
  },
  {
    schemaVersion: 1,
    type: "Émitted:β",
    occurredAt: 1,
    actorId: "actor:β",
    workstreamId: "ws:β",
    episodeId: "ep:1",
    payload: { flag: true, values: [0, null, "e\u0301"] },
  },
]);

const commandIds = deepFreeze(["cmd:alpha", "cmd:β"]);
const intents = deepFreeze([
  { kind: "Act", effect: "effect.alpha", payload: null },
  {
    kind: "Act",
    effect: "effect:β",
    resource: "cpu",
    payload: ["x", null, { nested: true }],
  },
]);
const predicateRefs = deepFreeze([
  {
    registryId: "state.equals",
    version: 1,
    params: { field: "flag", expected: true },
  },
  { registryId: "event.type", version: 1, params: { type: "Signal" } },
]);

const awaitPatterns = deepFreeze(
  (() => {
    const patterns = [];
    for (const type of ["Signal", "CommandResult"]) {
      for (const correlation of [false, true]) {
        for (const command of [false, true]) {
          patterns.push({
            type,
            ...(correlation ? { correlationId: "corr:match" } : {}),
            ...(command ? { commandId: "cmd:alpha" } : {}),
          });
        }
      }
    }
    return patterns;
  })(),
);

const timeout = deepFreeze({ kind: "After", delayMs: 7 });

export const PROGRAM_ATOM_ALPHABET = deepFreeze({
  eventDrafts: drafts,
  commandIds,
  actIntents: intents,
  invokeResultKeys: ["ok"],
  awaitPatterns,
  awaitTimeouts: [timeout],
  predicateRefs,
  executionContexts: [
    "no-event",
    "matching-result",
    "foreign-result",
    "signal",
    "malformed-null-payload",
  ],
});

export const EXECUTION_CONTEXTS = deepFreeze([
  {
    id: "no-event",
    state: { flag: true, context: "no-event" },
    env: { now: 0, rngState: 1 },
  },
  {
    id: "matching-result",
    state: { flag: false, context: "matching-result" },
    env: { now: 11, rngState: 2 },
    event: {
      schemaVersion: 1,
      eventId: "evt:result",
      type: "CommandResult",
      occurredAt: 11,
      actorId: "actor",
      workstreamId: "ws",
      correlationId: "corr:match",
      payload: { commandId: "cmd:alpha", result: "ok" },
    },
  },
  {
    id: "foreign-result",
    state: { flag: true, context: "foreign-result" },
    env: { now: 12, rngState: 3 },
    event: {
      schemaVersion: 1,
      eventId: "evt:foreign",
      type: "CommandResult",
      occurredAt: 12,
      actorId: "actor",
      workstreamId: "ws",
      correlationId: "corr:other",
      payload: { commandId: "cmd:foreign", result: "ok" },
    },
  },
  {
    id: "signal",
    state: { flag: false, context: "signal" },
    env: { now: 13, rngState: 4 },
    event: {
      schemaVersion: 1,
      eventId: "evt:signal",
      type: "Signal",
      occurredAt: 13,
      actorId: "actor",
      workstreamId: "ws",
      correlationId: "corr:match",
      payload: { commandId: "cmd:alpha", result: "ok" },
    },
  },
  {
    id: "malformed-null-payload",
    state: { flag: true, context: "malformed" },
    env: { now: 14, rngState: 5 },
    event: {
      schemaVersion: 1,
      eventId: "evt:null",
      type: "CommandResult",
      occurredAt: 14,
      actorId: "actor",
      workstreamId: "ws",
      payload: null,
    },
  },
]);

export function programNodeCount(program) {
  switch (program.kind) {
    case "Done":
      return 1;
    case "Emit":
      return 1 + programNodeCount(program.next);
    case "Invoke":
      return (
        1 +
        Object.values(program.continuationByResult).reduce(
          (sum, child) => sum + programNodeCount(child),
          0,
        )
      );
    case "Await":
      return 1 + programNodeCount(program.next);
    case "Sequence":
      return (
        1 +
        program.programs.reduce(
          (sum, child) => sum + programNodeCount(child),
          0,
        )
      );
    case "Guard":
      return (
        1 +
        programNodeCount(program.whenTrue) +
        programNodeCount(program.whenFalse)
      );
    case "Choose":
      return (
        1 +
        program.alternatives.reduce(
          (sum, child) => sum + programNodeCount(child),
          0,
        )
      );
    case "All":
    case "Race":
      return (
        1 +
        program.programs.reduce(
          (sum, child) => sum + programNodeCount(child),
          0,
        )
      );
    case "Repeat":
      return 1 + programNodeCount(program.program);
    case "Compensate":
      return (
        1 +
        programNodeCount(program.program) +
        programNodeCount(program.compensation)
      );
    default:
      throw new Error(`unknown Program kind ${program.kind}`);
  }
}

export function programDepth(program) {
  switch (program.kind) {
    case "Done":
      return 1;
    case "Emit":
      return 1 + programDepth(program.next);
    case "Invoke":
      return (
        1 +
        Math.max(
          ...Object.values(program.continuationByResult).map(programDepth),
        )
      );
    case "Await":
      return 1 + programDepth(program.next);
    case "Sequence":
      return program.programs.length === 0
        ? 1
        : 1 + Math.max(...program.programs.map(programDepth));
    case "Guard":
      return (
        1 +
        Math.max(
          programDepth(program.whenTrue),
          programDepth(program.whenFalse),
        )
      );
    case "Choose":
      return program.alternatives.length === 0
        ? 1
        : 1 + Math.max(...program.alternatives.map(programDepth));
    case "All":
    case "Race":
      return program.programs.length === 0
        ? 1
        : 1 + Math.max(...program.programs.map(programDepth));
    case "Repeat":
      return 1 + programDepth(program.program);
    case "Compensate":
      return (
        1 +
        Math.max(
          programDepth(program.program),
          programDepth(program.compensation),
        )
      );
    default:
      throw new Error(`unknown Program kind ${program.kind}`);
  }
}

function programsForExactSize(bySize, size) {
  const programs = [];
  if (size === 1) {
    programs.push({ kind: "Done" }, { kind: "Sequence", programs: [] });
    return programs;
  }

  const unaryChildren = bySize.get(size - 1) ?? [];
  for (const child of unaryChildren) {
    for (const event of drafts)
      programs.push({ kind: "Emit", event, next: child });
    for (const commandId of commandIds) {
      for (const command of intents)
        programs.push({
          kind: "Invoke",
          commandId,
          command,
          continuationByResult: { ok: child },
        });
    }
    for (const pattern of awaitPatterns)
      programs.push({ kind: "Await", pattern, timeout, next: child });
    programs.push({ kind: "Sequence", programs: [child] });
  }

  for (let leftSize = 1; leftSize <= size - 2; leftSize++) {
    const rightSize = size - 1 - leftSize;
    for (const left of bySize.get(leftSize) ?? []) {
      for (const right of bySize.get(rightSize) ?? []) {
        programs.push({ kind: "Sequence", programs: [left, right] });
        for (const conditionRef of predicateRefs)
          programs.push({
            kind: "Guard",
            conditionRef,
            whenTrue: left,
            whenFalse: right,
          });
      }
    }
  }
  return programs;
}

export function enumeratePrograms(seed) {
  const bySize = new Map();
  const seen = new Set();
  for (let size = 1; size <= PROGRAM_BOUNDS.maximumNodes; size++) {
    const layer = programsForExactSize(bySize, size);
    for (const program of layer) {
      const encoded = JSON.stringify(program);
      if (seen.has(encoded))
        throw new Error(
          `duplicate enumerated Program at size ${size}: ${encoded}`,
        );
      seen.add(encoded);
      if (programNodeCount(program) !== size)
        throw new Error(`Program size drift for ${encoded}`);
      if (programDepth(program) > PROGRAM_BOUNDS.maximumDepth)
        throw new Error(`Program depth overflow for ${encoded}`);
    }
    bySize.set(size, layer);
  }
  return shuffled(
    [...bySize.values()].flat(),
    makeRng(seed, "program/enumeration-order"),
  );
}

export function environmentFor(input) {
  return { ...input.env, predicates: hydratePredicateRegistry() };
}

function oracleExpected(kernel, input) {
  const step = errorRecord(() =>
    kernel.stepProgram(
      input.program,
      input.state,
      environmentFor(input),
      input.event,
    ),
  );
  const decision = errorRecord(() =>
    kernel.decideProgram(
      input.program,
      input.state,
      environmentFor(input),
      input.event,
    ),
  );
  if (step.ok !== decision.ok)
    throw new Error(
      "stepProgram and decideProgram disagree on whether evaluation throws",
    );
  if (!step.ok) {
    if (
      step.error.name !== decision.error.name ||
      step.error.message !== decision.error.message
    )
      throw new Error("stepProgram and decideProgram throw different errors");
    return { kind: "throw", error: step.error };
  }
  return { kind: "return", step: step.value, decision: decision.value };
}

function vector(id, family, program, context, kernel, extra = {}) {
  const input = {
    program: cloneJson(program),
    state: cloneJson(context.state),
    env: cloneJson(context.env),
    ...(context.event === undefined ? {} : { event: cloneJson(context.event) }),
  };
  return {
    id,
    family,
    ...extra,
    input,
    expected: oracleExpected(kernel, input),
  };
}

function committedEnumeration(programs, kernel) {
  const selected = [];
  for (const kind of ["Done", "Emit", "Invoke", "Await", "Sequence", "Guard"]) {
    selected.push(
      ...programs
        .filter((program) => program.kind === kind)
        .slice(0, PROGRAM_BOUNDS.committedProgramsPerRootKind),
    );
  }
  const rows = [];
  for (let programIndex = 0; programIndex < selected.length; programIndex++) {
    const program = selected[programIndex];
    for (const context of EXECUTION_CONTEXTS) {
      rows.push(
        vector(
          `program-${String(programIndex).padStart(4, "0")}-${context.id}`,
          "bounded-enumeration-sample",
          program,
          context,
          kernel,
          {
            ast: {
              rootKind: program.kind,
              nodes: programNodeCount(program),
              depth: programDepth(program),
            },
            contextId: context.id,
          },
        ),
      );
    }
  }
  return { selected, rows };
}

function fullEnumerationArtifact(programs, kernel) {
  const hash = createHash("sha256");
  const outcomes = {};
  let rows = 0;
  let bytes = 0;
  for (let programIndex = 0; programIndex < programs.length; programIndex++) {
    const program = programs[programIndex];
    for (const context of EXECUTION_CONTEXTS) {
      const row = vector(
        `full-program-${String(programIndex).padStart(4, "0")}-${context.id}`,
        "full-bounded-enumeration",
        program,
        context,
        kernel,
        {
          ast: {
            rootKind: program.kind,
            nodes: programNodeCount(program),
            depth: programDepth(program),
          },
          contextId: context.id,
        },
      );
      const encoded = `${JSON.stringify(row)}\n`;
      hash.update(encoded);
      bytes += Buffer.byteLength(encoded);
      rows++;
      const outcome =
        row.expected.kind === "throw"
          ? `throw:${row.expected.error.message}`
          : `return:${row.expected.step.residual.kind}`;
      outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
    }
  }
  return {
    format:
      "JSONL regenerated in memory; digest and counts committed in the manifest",
    rows,
    bytes,
    sha256: hash.digest("hex"),
    outcomeCounts: Object.fromEntries(
      Object.entries(outcomes).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
  };
}

export const MATCHING_TABLE_ALPHABET = deepFreeze({
  eventTypes: ["CommandResult", "Other"],
  correlationIds: {
    absent: "event.correlationId omitted",
    match: "corr:match",
    other: "corr:other",
  },
  commandIds: {
    absent: "payload.commandId omitted when the payload is an object",
    match: "cmd:match",
    other: "cmd:other",
    "non-string": 7,
  },
  payloadShapes: {
    "object-known-result": "object carrying result=ok",
    "object-unknown-result": "object carrying result=unknown",
    "object-missing-result": "object with no result field",
    "object-non-string-result": "object carrying numeric result=7",
    null: null,
    array: "[commandId-or-null, ok]",
    scalar: "payload",
  },
  invoke: { commandId: "cmd:match", continuationKeys: ["ok"] },
  awaitPatternModes: [
    { id: "type-only", pattern: { type: "CommandResult" } },
    {
      id: "correlation",
      pattern: { type: "CommandResult", correlationId: "corr:match" },
    },
    {
      id: "command",
      pattern: { type: "CommandResult", commandId: "cmd:match" },
    },
    {
      id: "correlation-command",
      pattern: {
        type: "CommandResult",
        correlationId: "corr:match",
        commandId: "cmd:match",
      },
    },
  ],
});

const truthEventTypes = MATCHING_TABLE_ALPHABET.eventTypes;
const truthCorrelations = Object.keys(MATCHING_TABLE_ALPHABET.correlationIds);
const truthCommandIds = Object.keys(MATCHING_TABLE_ALPHABET.commandIds);
const truthPayloadShapes = Object.keys(MATCHING_TABLE_ALPHABET.payloadShapes);

function truthCommandValue(dimension) {
  if (dimension === "match") return "cmd:match";
  if (dimension === "other") return "cmd:other";
  if (dimension === "non-string") return 7;
  return undefined;
}

function truthPayload(shape, commandDimension) {
  const commandId = truthCommandValue(commandDimension);
  const commandField = commandId === undefined ? {} : { commandId };
  if (shape === "object-known-result") return { ...commandField, result: "ok" };
  if (shape === "object-unknown-result")
    return { ...commandField, result: "unknown" };
  if (shape === "object-missing-result") return commandField;
  if (shape === "object-non-string-result")
    return { ...commandField, result: 7 };
  if (shape === "null") return null;
  if (shape === "array") return [commandId ?? null, "ok"];
  if (shape === "scalar") return "payload";
  throw new Error(`unknown payload shape ${shape}`);
}

function truthEvent(
  index,
  eventType,
  correlation,
  commandDimension,
  payloadShape,
) {
  return {
    schemaVersion: 1,
    eventId: `truth:${index}`,
    type: eventType,
    occurredAt: index,
    actorId: "actor",
    workstreamId: "ws",
    ...(correlation === "absent"
      ? {}
      : {
          correlationId: correlation === "match" ? "corr:match" : "corr:other",
        }),
    payload: truthPayload(payloadShape, commandDimension),
  };
}

function truthRows(kernel) {
  const state = { flag: true, table: "truth" };
  const env = { now: 100, rngState: 7 };
  const invoke = {
    kind: "Invoke",
    commandId: "cmd:match",
    command: { kind: "Act", effect: "truth.invoke", payload: { pinned: true } },
    continuationByResult: { ok: { kind: "Done" } },
  };
  const invokeRows = [
    vector(
      "invoke-no-event",
      "invoke-truth-table",
      invoke,
      { state, env },
      kernel,
      { dimensions: { event: "absent" } },
    ),
  ];
  let index = 0;
  for (const eventType of truthEventTypes) {
    for (const correlation of truthCorrelations) {
      for (const commandId of truthCommandIds) {
        for (const payloadShape of truthPayloadShapes) {
          const event = truthEvent(
            index,
            eventType,
            correlation,
            commandId,
            payloadShape,
          );
          invokeRows.push(
            vector(
              `invoke-cell-${String(index).padStart(3, "0")}`,
              "invoke-truth-table",
              invoke,
              { state, env, event },
              kernel,
              {
                dimensions: { eventType, correlation, commandId, payloadShape },
              },
            ),
          );
          index++;
        }
      }
    }
  }

  const awaitRows = [];
  const patternModes = MATCHING_TABLE_ALPHABET.awaitPatternModes;
  index = 0;
  for (const mode of patternModes) {
    const awaitProgram = {
      kind: "Await",
      pattern: mode.pattern,
      timeout: { kind: "After", delayMs: 5 },
      next: { kind: "Done" },
    };
    awaitRows.push(
      vector(
        `await-${mode.id}-no-event`,
        "await-truth-table",
        awaitProgram,
        { state, env },
        kernel,
        { patternMode: mode.id, dimensions: { event: "absent" } },
      ),
    );
    for (const eventType of truthEventTypes) {
      for (const correlation of truthCorrelations) {
        for (const commandId of truthCommandIds) {
          for (const payloadShape of truthPayloadShapes) {
            const event = truthEvent(
              index,
              eventType,
              correlation,
              commandId,
              payloadShape,
            );
            awaitRows.push(
              vector(
                `await-${mode.id}-cell-${String(index).padStart(3, "0")}`,
                "await-truth-table",
                awaitProgram,
                { state, env, event },
                kernel,
                {
                  patternMode: mode.id,
                  dimensions: {
                    eventType,
                    correlation,
                    commandId,
                    payloadShape,
                  },
                },
              ),
            );
            index++;
          }
        }
      }
    }
  }
  return { invokeRows, awaitRows };
}

function sequenceLawRows(kernel) {
  const emitted = drafts[0];
  const invoke = {
    kind: "Invoke",
    commandId: "cmd:alpha",
    command: intents[0],
    continuationByResult: { ok: { kind: "Done" } },
  };
  const waiting = {
    kind: "Await",
    pattern: { type: "Signal" },
    timeout,
    next: { kind: "Done" },
  };
  const cases = [
    {
      law: "empty-list-normalizes-to-Done",
      program: { kind: "Sequence", programs: [] },
    },
    {
      law: "singleton-Done-is-absorbed",
      program: { kind: "Sequence", programs: [{ kind: "Done" }] },
    },
    {
      law: "Done-head-removes-only-head",
      program: {
        kind: "Sequence",
        programs: [
          { kind: "Done" },
          { kind: "Emit", event: emitted, next: { kind: "Done" } },
        ],
      },
    },
    {
      law: "emitting-head-preserves-channel-and-advances",
      program: {
        kind: "Sequence",
        programs: [
          { kind: "Emit", event: emitted, next: { kind: "Done" } },
          waiting,
        ],
      },
    },
    {
      law: "non-Done-Invoke-remains-wrapped",
      program: { kind: "Sequence", programs: [invoke, { kind: "Done" }] },
    },
    {
      law: "non-Done-Await-remains-wrapped",
      program: { kind: "Sequence", programs: [waiting, { kind: "Done" }] },
    },
    {
      law: "nested-Done-is-absorbed-once",
      program: {
        kind: "Sequence",
        programs: [
          { kind: "Sequence", programs: [{ kind: "Done" }] },
          { kind: "Emit", event: emitted, next: { kind: "Done" } },
        ],
      },
    },
    {
      law: "nested-emission-preserves-tail",
      program: {
        kind: "Sequence",
        programs: [
          {
            kind: "Sequence",
            programs: [
              { kind: "Emit", event: emitted, next: { kind: "Done" } },
            ],
          },
          { kind: "Done" },
        ],
      },
    },
    {
      law: "nested-non-Done-is-not-flattened",
      program: {
        kind: "Sequence",
        programs: [{ kind: "Sequence", programs: [waiting] }, { kind: "Done" }],
      },
    },
    {
      law: "Done-head-preserves-two-element-tail-order",
      program: {
        kind: "Sequence",
        programs: [
          { kind: "Done" },
          { kind: "Emit", event: emitted, next: { kind: "Done" } },
          waiting,
        ],
      },
    },
    {
      law: "non-Done-head-preserves-two-element-tail-order",
      program: {
        kind: "Sequence",
        programs: [
          invoke,
          { kind: "Done" },
          { kind: "Emit", event: emitted, next: { kind: "Done" } },
        ],
      },
    },
    {
      law: "emitting-head-preserves-two-element-tail-order",
      program: {
        kind: "Sequence",
        programs: [
          { kind: "Emit", event: emitted, next: { kind: "Done" } },
          { kind: "Done" },
          waiting,
        ],
      },
    },
  ];
  return cases.map((item, index) =>
    vector(
      `sequence-law-${String(index).padStart(3, "0")}`,
      "sequence-law",
      item.program,
      { state: { flag: true }, env: { now: 0, rngState: 1 } },
      kernel,
      { law: item.law },
    ),
  );
}

function allNodeKindCounts(programs) {
  const counts = {};
  const visit = (program) => {
    counts[program.kind] = (counts[program.kind] ?? 0) + 1;
    if (program.kind === "Emit" || program.kind === "Await")
      visit(program.next);
    else if (program.kind === "Invoke")
      Object.values(program.continuationByResult).forEach(visit);
    else if (program.kind === "Sequence") program.programs.forEach(visit);
    else if (program.kind === "Guard") {
      visit(program.whenTrue);
      visit(program.whenFalse);
    }
  };
  programs.forEach(visit);
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

function outcomeCounts(rows) {
  return countBy(rows, (row) =>
    row.expected.kind === "throw"
      ? `throw:${row.expected.error.message}`
      : `return:${row.expected.step.residual.kind}`,
  );
}

export function buildProgramCorpus(seed, kernel) {
  const programs = enumeratePrograms(seed);
  const fullArtifact = fullEnumerationArtifact(programs, kernel);
  const committed = committedEnumeration(programs, kernel);
  const truth = truthRows(kernel);
  const sequenceRows = sequenceLawRows(kernel);

  const files = [];
  for (
    let offset = 0, shard = 0;
    offset < committed.rows.length;
    offset += PROGRAM_BOUNDS.committedShardMaximumRows, shard++
  ) {
    const rows = committed.rows.slice(
      offset,
      offset + PROGRAM_BOUNDS.committedShardMaximumRows,
    );
    const name = `enumerated-${String(shard).padStart(3, "0")}.jsonl`;
    files.push({
      relativePath: `corpus/fixtures/program/${name}`,
      absolutePath: `${PATHS.programFixtures}/${name}`,
      bytes: jsonlBytes(rows),
      rows: rows.length,
    });
  }
  files.push(
    {
      relativePath: "corpus/fixtures/program/matching-invoke.jsonl",
      absolutePath: `${PATHS.programFixtures}/matching-invoke.jsonl`,
      bytes: jsonlBytes(truth.invokeRows),
      rows: truth.invokeRows.length,
    },
    {
      relativePath: "corpus/fixtures/program/matching-await.jsonl",
      absolutePath: `${PATHS.programFixtures}/matching-await.jsonl`,
      bytes: jsonlBytes(truth.awaitRows),
      rows: truth.awaitRows.length,
    },
    {
      relativePath: "corpus/fixtures/program/sequence-laws.jsonl",
      absolutePath: `${PATHS.programFixtures}/sequence-laws.jsonl`,
      bytes: jsonlBytes(sequenceRows),
      rows: sequenceRows.length,
    },
  );

  const exactSizeCounts = countBy(programs, programNodeCount);
  const rootKindCounts = countBy(programs, (program) => program.kind);
  const committedRootKindCounts = countBy(
    committed.selected,
    (program) => program.kind,
  );
  return {
    programs,
    contexts: EXECUTION_CONTEXTS,
    committedRows: committed.rows,
    invokeRows: truth.invokeRows,
    awaitRows: truth.awaitRows,
    sequenceRows,
    files,
    summary: {
      fullEnumeration: {
        programs: programs.length,
        executionContexts: EXECUTION_CONTEXTS.length,
        evaluationInputs: programs.length * EXECUTION_CONTEXTS.length,
        generatedVectorArtifact: fullArtifact,
        exactSizeCounts,
        rootKindCounts,
        allNodeOccurrenceCounts: allNodeKindCounts(programs),
      },
      committedEnumeration: {
        programs: committed.selected.length,
        vectors: committed.rows.length,
        rootKindCounts: committedRootKindCounts,
        contextCounts: countBy(committed.rows, (row) => row.contextId),
      },
      invokeTruthTable: {
        actualEventCells: truth.invokeRows.length - 1,
        noEventCells: 1,
        dimensions: {
          eventType: truthEventTypes.length,
          correlationId: truthCorrelations.length,
          commandId: truthCommandIds.length,
          payloadShape: truthPayloadShapes.length,
        },
        levels: {
          eventType: truthEventTypes,
          correlationId: truthCorrelations,
          commandId: truthCommandIds,
          payloadShape: truthPayloadShapes,
        },
        outcomeCounts: outcomeCounts(truth.invokeRows),
      },
      awaitTruthTable: {
        actualEventCells: truth.awaitRows.length - 4,
        noEventCells: 4,
        patternModes: 4,
        dimensions: {
          eventType: truthEventTypes.length,
          correlationId: truthCorrelations.length,
          commandId: truthCommandIds.length,
          payloadShape: truthPayloadShapes.length,
        },
        levels: {
          eventType: truthEventTypes,
          correlationId: truthCorrelations,
          commandId: truthCommandIds,
          payloadShape: truthPayloadShapes,
        },
        outcomeCounts: outcomeCounts(truth.awaitRows),
      },
      sequenceLaws: sequenceRows.length,
    },
  };
}
