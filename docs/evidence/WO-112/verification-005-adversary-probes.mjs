// VER-005 reproductions of the fresh adversary's items, written by the
// verifier. Synthetic fixtures through the real resident, vertical entry and
// checkout helper; no vendor worker, forge or network. The script asserts
// nothing: it prints one JSON row per probe.
//
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-112/verification-005-adversary-probes.mjs
//
// I1: host-side intake failures in the resident's own loop (missing live-worker
//     opt-in; an unwritable record directory), against an unnamed host error.
// I2: a replayed intake record of another schema, judged at preparation.
// D1: a second filed draft while a triage continuation is deferred.
// P1: checkout recovery beside an unrelated worktree whose directory moved.
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { compileLoadout } from "@dotln/compiler";
import { decodeLog } from "@dotln/kernel";
import { WorkerFailure } from "../../../packages/skeleton/dist/src/worker-protocol.js";
import { validateTransportRequest } from "../../../packages/skeleton/dist/src/verification-protocol.js";
import { ResidentHost } from "../../../packages/skeleton/dist/src/resident-host.js";
import {
  recordPresence,
  replayResident,
} from "../../../packages/skeleton/dist/src/resident-store.js";
import { verticalResident } from "../../../packages/skeleton/dist/src/vertical-resident.js";
import { IntentPreparationRefusal } from "../../../packages/skeleton/dist/src/vertical.js";
import { fixtureGit } from "../../../packages/skeleton/dist/test/source-change-fixture.js";
import {
  verticalFixture,
  runState,
  put,
  json,
} from "../../../scripts/fixtures/vertical/fixture.mjs";
import {
  readVerticalConfiguration,
  createVerticalEntry,
} from "../../../scripts/lib/vertical-runtime.mjs";
import { withDetachedCheckout } from "../../../scripts/lib/vertical-primitives.mjs";

const emit = (row) => console.log(JSON.stringify(row));

// The same declared double as the executor's judgment tests.
function judgmentDouble(answer) {
  const calls = [];
  return {
    calls,
    transport: {
      name: "fake",
      harnessVersion: "not-applicable",
      dispatch(request, clock) {
        validateTransportRequest(request);
        calls.push(request);
        const completed = Promise.resolve()
          .then(() => answer(request, calls.length))
          .then((value) => {
            writeFileSync(
              join(request.cwd, "result.json"),
              JSON.stringify(value) + "\n",
            );
            return value;
          });
        void completed.catch(() => {});
        return {
          receipt: Promise.resolve({
            commandId: request.command.commandId,
            transport: "fake",
            acceptedAt: clock(),
          }),
          completed,
          alive: () => false,
          kill() {},
        };
      },
    },
  };
}
const intakeByUnit = (request) => ({
  summary: "Fixture intake double answers by source unit.",
  spans: request.subject.spans.map((span) => {
    const title = span.unit === request.subject.source[0].unit;
    return {
      spanId: span.spanId,
      class:
        span.fixedClass ??
        (title ? "requirement" : "current-behavior observation"),
      rationale: "Fixture double classifies by source unit.",
      baseline: title ? "no-existing-failure" : "existing-failure",
      baselineRationale: "Fixture double: the body unit reports the failure.",
    };
  }),
});
function useModelIntake(f) {
  const { number, draftId } = f.config.issues[0];
  f.config.issues[0] = { number, draftId, intake: "model" };
  put(join(f.directory, "vertical.json"), f.config);
}

// I1: 40 resident ticks one second apart, with the default resident backoff
// (1 s base, 300 s cap, three unnamed attempts).
for (const mode of ["live-opt-in-missing", "record-unwritable", "unnamed"]) {
  const f = await verticalFixture();
  const previous = process.env.DOTLN_LIVE_WORKERS;
  const records = join(f.directory, "issue-intake");
  let host;
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    const external =
      mode === "live-opt-in-missing"
        ? f.external
        : { ...f.external, judge: judge.transport };
    if (mode === "live-opt-in-missing") delete process.env.DOTLN_LIVE_WORKERS;
    if (mode === "record-unwritable") {
      mkdirSync(records, { recursive: true });
      chmodSync(records, 0o555);
    }
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external,
    });
    const refusals = [];
    let prepares = 0;
    const ports = {
      ...entry.ports,
      async prepare(...args) {
        prepares++;
        if (mode === "unnamed") throw new Error("synthetic host failure");
        try {
          return await entry.ports.prepare(...args);
        } catch (error) {
          refusals.push({
            named: error instanceof IntentPreparationRefusal,
            transient: error?.transient ?? null,
            message: String(error?.message).slice(0, 110),
          });
          throw error;
        }
      },
    };
    host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: verticalResident(ports, entry.runs, { steps: 1 }),
    });
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 40; i++) {
      f.setTime(120 + i * 1000);
      await host.tick();
    }
    const log = decodeLog(host.store.read());
    const resident = replayResident(host.store.read()).state.resident;
    emit({
      probe: "I1 host-side intake failure in the resident loop",
      mode,
      simulatedSeconds: 39,
      prepares,
      intakeEpisodes: judge.calls.length,
      intentHeldEvents: log.filter((e) => e.type === "IntentHeld").length,
      intentAdmittedEvents: log.filter((e) => e.type === "IntentAdmitted")
        .length,
      intent: resident.intents?.[f.filed.workOrderId]?.kind ?? null,
      heldReason: resident.intents?.[f.filed.workOrderId]?.reason ?? null,
      firstRefusal: refusals[0] ?? null,
    });
  } finally {
    host?.close();
    if (previous === undefined) delete process.env.DOTLN_LIVE_WORKERS;
    else process.env.DOTLN_LIVE_WORKERS = previous;
    try {
      chmodSync(records, 0o755);
    } catch {}
    f.close();
  }
}

// I2: a recorded intake whose schema differs, met at a later preparation.
{
  const f = await verticalFixture();
  try {
    useModelIntake(f);
    const judge = judgmentDouble(intakeByUnit);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    const spent = { episodes: 0, wallMs: 0, tokens: 0 };
    await entry.ports.prepare(f.filed.workOrder, phase, spent);
    const records = join(f.directory, "issue-intake");
    const file = join(
      records,
      readdirSync(records).find((name) => name.endsWith(".json")),
    );
    put(file, { ...json(file), schemaVersion: 2 });
    let outcome;
    try {
      await entry.ports.prepare(f.filed.workOrder, phase, spent);
      outcome = "accepted";
    } catch (error) {
      outcome = {
        named: error instanceof IntentPreparationRefusal,
        transient: error?.transient ?? null,
        message: String(error?.message).slice(0, 110),
      };
    }
    emit({
      probe: "I2 replayed intake record of another schema",
      outcome,
      intakeEpisodes: judge.calls.length,
    });
  } finally {
    f.close();
  }
}

// D1: from the first interrupted triage on, the resident also lists a second
// draft. Its preparation stands in for any filed draft's forge read.
{
  const f = await verticalFixture({
    forge: {
      reviews: [{ id: "S1", text: "No additional changes requested." }],
    },
  });
  let host;
  try {
    const judge = judgmentDouble((request, count) => {
      if (count <= 3)
        throw new WorkerFailure("interrupted", "synthetic repeated failure");
      return {
        kind: "acknowledge",
        criterionId: null,
        reason: "Fresh episode found no action.",
        evidenceRefs: [request.subject.evidence[0].ref],
      };
    });
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: { ...f.external, judge: judge.transport },
    });
    const second = { ...f.filed.workOrder, workOrderId: "WO-998" };
    let offerSecond = false,
      secondPrepares = 0;
    const ports = {
      ...entry.ports,
      async drafts() {
        return [
          ...(await entry.ports.drafts()),
          ...(offerSecond ? [second] : []),
        ];
      },
      async prepare(draft, phase, spent) {
        if (draft.workOrderId !== second.workOrderId)
          return entry.ports.prepare(draft, phase, spent);
        secondPrepares++;
        return entry.ports.prepare(f.filed.workOrder, phase, spent);
      },
    };
    host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: verticalResident(ports, entry.runs, { steps: 1 }),
    });
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 30 && judge.calls.length === 0; i++) {
      f.setTime(120 + i);
      await host.tick();
    }
    const forgeCalls = () =>
      readFileSync(join(f.root, "calls.jsonl"), "utf8")
        .split("\n")
        .filter(Boolean).length;
    offerSecond = true;
    const before = forgeCalls();
    const start = f.now();
    let ticks = 0;
    // One tick per simulated second, the resident's default cadence.
    while (judge.calls.length < 4 && ticks < 60) {
      f.setTime(start + ++ticks * 1000);
      await host.tick();
    }
    const log = decodeLog(host.store.read());
    const resident = replayResident(host.store.read()).state.resident;
    const binding = resident.intents[f.filed.workOrderId].binding;
    emit({
      probe: "D1 second draft while a triage continuation is deferred",
      triageEpisodes: judge.calls.length,
      ticksAcrossDeferrals: ticks,
      secondDraftPrepares: secondPrepares,
      fixtureForgeCallsDuringDeferrals: forgeCalls() - before,
      secondDraftDecisions: log.filter(
        (e) =>
          ["IntentAdmitted", "IntentHeld"].includes(e.type) &&
          e.payload.draftId === second.workOrderId,
      ).length,
      firstRunTerminal: runState(f.directory, binding.key).terminal?.kind,
    });
  } finally {
    host?.close();
    f.close();
  }
}

// P1: the run's own registration outlived its directory, and an unrelated
// worktree of the same target was moved without `git worktree move`.
{
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-ver005-prune-")));
  try {
    const target = join(root, "target");
    mkdirSync(target);
    fixtureGit(target, "init", "--initial-branch=main");
    writeFileSync(join(target, "a.txt"), "a\n");
    fixtureGit(target, "add", "a.txt");
    fixtureGit(target, "commit", "-m", "Seed");
    const head = fixtureGit(target, "rev-parse", "HEAD");
    const unrelated = join(root, "unrelated");
    fixtureGit(target, "worktree", "add", "-b", "side", unrelated, head);
    writeFileSync(join(unrelated, "a.txt"), "staged side work\n");
    fixtureGit(unrelated, "add", "a.txt");
    const moved = join(root, "unrelated-moved");
    renameSync(unrelated, moved);
    const directory = join(root, "run");
    const child = join(directory, "resolution-1");
    const tree = join(child, "input-tree");
    mkdirSync(child, { recursive: true });
    fixtureGit(target, "worktree", "add", "--detach", tree, head);
    rmSync(tree, { recursive: true });
    const before = fixtureGit(target, "worktree", "list", "--porcelain");
    withDetachedCheckout(target, directory, child, head, () => null);
    const after = fixtureGit(target, "worktree", "list", "--porcelain");
    let movedStatus;
    try {
      movedStatus = fixtureGit(moved, "status", "--porcelain");
    } catch (error) {
      movedStatus = `failed: ${String(error?.message).split("\n")[0].slice(0, 120)}`;
    }
    emit({
      probe: "P1 checkout recovery beside a moved unrelated worktree",
      unrelatedRegisteredBefore: before.includes(`worktree ${unrelated}`),
      unrelatedRegisteredAfter: after.includes(`worktree ${unrelated}`),
      ownRegisteredAfter: after.includes("input-tree"),
      movedWorktreeStatus: movedStatus,
      movedFilesPresent: existsSync(join(moved, "a.txt")),
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
