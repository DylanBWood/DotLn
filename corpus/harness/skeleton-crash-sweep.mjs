import assert from "node:assert/strict";
import {
  decodeLog,
  encodeLog,
  replayOutbox,
  pendingCommands,
} from "../../packages/kernel/dist/src/index.js";
import { runScenario } from "../../packages/skeleton/dist/src/scenario.js";
import {
  args,
  brief,
  collectOffsets,
  compareLane,
  demoTree,
  fingerprint,
  isMain,
  SEED,
  sha256,
} from "./wo105-common.mjs";
import { DEPTH, replayDeterminism } from "./generate-store-corpus.mjs";
import { assertScenarioIdentity } from "./generate-tree-corpus.mjs";
import { cutOracle } from "./truncation-sweep.mjs";

export function crashOpening(fixture = demoTree()) {
  let opening;
  runScenario(fixture, {
    crashAfterPersist: true,
    recoveryLogTransform: (log) => {
      opening = log;
      return log;
    },
  });
  assert.equal(typeof opening, "string", "recovery hook was called");
  return opening;
}

// Independent of replayOutbox: results acknowledge an ID even before persistence,
// and the first persist owns the command. Fixtures contain no refusal ambiguity.
export function referencePending(events) {
  const commands = new Map();
  const completed = new Set();
  for (const event of events) {
    if (
      event.type === "CommandPersisted" &&
      !commands.has(event.payload.command.commandId)
    )
      commands.set(event.payload.command.commandId, event.payload.command);
    if (event.type === "CommandResult") completed.add(event.payload.commandId);
  }
  return [...commands.values()].filter(
    (command) => !completed.has(command.commandId),
  );
}
export function assertRecovery(live, surviving, effectClaims) {
  const expected = referencePending(surviving);
  assert.deepEqual(
    pendingCommands(replayOutbox(surviving)),
    expected,
    "outbox pending reference",
  );
  assert.deepEqual(
    live.recoveredCommands,
    expected,
    "pending commands recomputed from surviving log",
  );
  // All declared shapes have zero or one command ID. onExecutorClaim fires once
  // per actual FakeExecutor effect, unlike adapterDispatches (which can repeat).
  const ids = [...new Set(expected.map((command) => command.commandId))];
  assert.ok(
    ids.length <= 1,
    "effect attribution requires this declared single-command scope",
  );
  assert.ok(
    live.adapterDispatches.every((id) => ids.includes(id)),
    "unexpected command dispatch",
  );
  assert.equal(
    live.adapterEffects,
    effectClaims,
    "independent effect callback count",
  );
  assert.ok(
    Number.isSafeInteger(live.adapterEffects) && live.adapterEffects >= 0,
  );
  assert.ok(
    live.adapterEffects <= ids.length,
    "more than one effect per commandId",
  );
  assertScenarioIdentity(live);
  const finalEvents = decodeLog(live.log);
  assert.equal(
    fingerprint(finalEvents.slice(0, surviving.length)),
    fingerprint(surviving),
    "recovery preserves the surviving event prefix",
  );
  assert.deepEqual(
    pendingCommands(replayOutbox(finalEvents)),
    referencePending(finalEvents),
    "final pending reference",
  );
  assert.equal(
    referencePending(finalEvents).length,
    0,
    "completed run leaves no pending command",
  );
  return {
    pendingCommands: expected.length,
    adapterEffects: live.adapterEffects,
    adapterDispatches: live.adapterDispatches.length,
    traceSha256: fingerprint(live.decisions.map((decision) => decision.trace)),
  };
}
export function classifyRecovery(
  fixture,
  original,
  transformed,
  offset = null,
  runner = runScenario,
) {
  let surviving;
  let decodeError;
  try {
    surviving = decodeLog(transformed);
  } catch (error) {
    decodeError = error.message;
  }
  let calls = 0;
  let effects = 0;
  let live;
  try {
    live = runner(fixture, {
      crashAfterPersist: true,
      onExecutorClaim: () => effects++,
      recoveryLogTransform: (log) => {
        calls++;
        assert.equal(log, original, "crash source log changed");
        return transformed;
      },
    });
  } catch (error) {
    assert.equal(calls, 1, "recovery hook did not execute exactly once");
    assert.equal(effects, 0, "effect before loud recovery failure");
    if (decodeError) {
      assert.equal(
        error.message,
        decodeError,
        "recovery must report the decoder's failure",
      );
      return { offset, outcome: "loud-failure", error: decodeError };
    }
    throw new Error(
      `decodable recovery failed at ${offset}: ${error.message}; quarantine as a numbered finding`,
    );
  }
  assert.equal(calls, 1);
  assert.equal(decodeError, undefined, "undecodable log silently recovered");
  return {
    offset,
    outcome: "recovered-prefix",
    ...assertRecovery(live, surviving, effects),
  };
}
export function recoveryFamilies(original) {
  const events = JSON.parse(JSON.stringify(decodeLog(original)));
  // Add nested data to the ignored inspection-task payload, preserving every
  // command and artifact pin. Text insertion avoids JSON.stringify stack limits.
  events[1].payload = { ...events[1].payload, corpusNested: "NESTED_PAYLOAD" };
  const deep = encodeLog(events).replace(
    '"corpusNested":"NESTED_PAYLOAD"',
    `"corpusNested":${"[".repeat(DEPTH)}0${"]".repeat(DEPTH)}`,
  );
  return [
    { id: "crlf", log: original.replaceAll("\n", "\r\n") },
    { id: "deep-nesting", log: deep },
  ];
}
export function skeletonSweep(seed = SEED, emit) {
  const fixture = demoTree();
  const original = crashOpening(fixture);
  const oracle = cutOracle(original);
  function* rows() {
    for (let offset = 0; offset <= oracle.bytes.length; offset++) {
      const row = classifyRecovery(
        fixture,
        original,
        oracle.bytes.subarray(0, offset).toString("utf8"),
        offset,
      );
      assert.equal(
        row.outcome,
        oracle.boundaries.has(offset) ? "recovered-prefix" : "loud-failure",
      );
      yield row;
    }
  }
  const sweep = collectOffsets(
    {
      lane: "skeleton",
      id: "canonical-crash-opening",
      seed,
      bytes: oracle.bytes.length,
      logSha256: sha256(original),
    },
    rows(),
    emit,
  );
  const families = recoveryFamilies(original).map(({ id, log }) => {
    const classification = classifyRecovery(fixture, original, log);
    const row = {
      id,
      bytes: Buffer.byteLength(log),
      logSha256: sha256(log),
      classification,
      ...replayDeterminism(log),
    };
    emit?.({ lane: "skeleton-family", fixture: id, seed, ...row });
    return row;
  });
  return { cutPoints: sweep.cutPoints, sweeps: [sweep], families };
}
if (isMain(import.meta.url)) {
  const { seed, records } = args(process.argv.slice(2));
  const result = skeletonSweep(
    seed,
    records
      ? (row) => process.stdout.write(`${JSON.stringify(row)}\n`)
      : undefined,
  );
  compareLane("skeleton", result);
  (records ? process.stderr : process.stdout).write(
    `${JSON.stringify(brief("skeleton", result))}\n`,
  );
}
