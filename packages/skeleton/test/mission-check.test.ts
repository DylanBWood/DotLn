import test from "node:test";
import assert from "node:assert/strict";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { decodeLog } from "@dotln/kernel";
import { actorCatalog, type ActorAdapter } from "../src/actor-catalog.js";
import { actorFailure, cliWorkerAdapter } from "../src/cli-actor.js";
import { DETACHED_LAUNCH_ROWS } from "../src/cli-actor-contract.js";
import {
  CONTRIBUTOR_MISSION_PHASE,
  CONTRIBUTOR_MISSION_POLICY,
  contributorProgram,
} from "../src/loadouts/contributor.js";
import {
  buildMissionCheckRequest,
  runMissionCheck,
} from "../src/mission-check-host.js";
import {
  MISSION_CAPSULE_BOUNDS,
  MISSION_SURFACE_CLAUSE,
  missionCheckPrompt,
  missionCheckResultSchema,
  missionContractEvidence,
  missionPin,
  missionReferenceIds,
  missionSubject,
  validateMissionCheckRequest,
  validateMissionCheckResult,
  type MissionCheckObserved,
  type MissionCheckSubject,
  type MissionSource,
} from "../src/mission-check-protocol.js";
import {
  missionClauses,
  missionDecisions,
  missionPinFromSource,
  observeMissionSubject,
} from "../src/mission-check-source.js";
import { ResidentHost } from "../src/resident-host.js";
import {
  clearMissionHold,
  recordPresence,
  replayResident,
} from "../src/resident-store.js";
import {
  isMissionActor,
  residentMachine,
  residentRefusal,
  type ResidentState,
} from "../src/resident-state.js";
import { WorkerFailure } from "../src/worker-protocol.js";
import type {
  ProcessRunner,
  WorkOrderTransport,
} from "../src/worker-transport.js";
import type { MissionCheckRequest } from "../src/mission-check-protocol.js";
import {
  missionFixture,
  missionRunner,
  unavailableRunner,
} from "./mission-check.fixture.js";

const state = (host: ResidentHost) =>
  replayResident(host.store.read()).state.resident as unknown as ResidentState;
const events = (host: ResidentHost, type: string) =>
  decodeLog(host.store.read()).filter((event) => event.type === type);
const scriptDouble = (): Record<string, ActorAdapter> => ({
  script: {
    kind: "script",
    available: () => null,
    run: () => ({
      completed: Promise.resolve({
        exitCode: 0,
        signal: null,
        stdoutSha256:
          "dc51b8c96c2d745df3bd5590d990230a482fd247123599548e0632fdbf97fc22",
        firstLine: "ok",
        verified: true,
        reason: "completed",
      }),
      kill: () => {},
    }),
  },
});
const fakeTransport = (
  result: (subject: MissionCheckSubject) => MissionCheckObserved | Error,
): WorkOrderTransport<MissionCheckRequest> => ({
  name: "fake",
  harnessVersion: "fixture-v1",
  dispatch(request, now) {
    const value = result(request.subject);
    return {
      receipt: Promise.resolve({
        commandId: request.command.commandId,
        transport: "fake" as const,
        acceptedAt: now(),
      }),
      completed:
        value instanceof Error
          ? Promise.reject(
              new WorkerFailure("model-unavailable", value.message),
            )
          : Promise.resolve(value),
      alive: () => false,
      kill: () => {},
    };
  },
});

test("WO-099 the four verdicts: out-of-surface drift, mid-episode clause change, on-contract pass, unavailable verifier", async (t) => {
  const inside = missionFixture();
  const outside = missionFixture({ outsideSurface: true });
  t.after(() => {
    inside.dispose();
    outside.dispose();
  });
  const pass = (): MissionCheckObserved => ({
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  });

  const onMission = await runMissionCheck(
    inside.subject,
    fakeTransport(pass),
    "fixture-model",
    "xhigh",
    () => 1_000,
  );
  assert.equal(onMission.judgment.verdict, "on-mission");
  assert.equal(onMission.judgment.findings.length, 0);

  // The capsule proves this one on its own: a claimed pass cannot erase it.
  const drifted = await runMissionCheck(
    outside.subject,
    fakeTransport(pass),
    "fixture-model",
    "xhigh",
    () => 1_000,
  );
  assert.equal(drifted.judgment.verdict, "drift");
  assert.deepEqual(
    drifted.judgment.findings.map((finding) => [
      finding.reference,
      finding.evidence,
    ]),
    [[MISSION_SURFACE_CLAUSE, "docs/product/00-vision.md"]],
  );

  // A contract edited after the capsule was pinned is drift naming the clause.
  inside.editContract();
  const changed = observeMissionSubject(inside.source, inside.pin);
  const midEpisode = await runMissionCheck(
    changed,
    fakeTransport(pass),
    "fixture-model",
    "xhigh",
    () => 1_000,
  );
  assert.equal(midEpisode.judgment.verdict, "drift");
  const clause = midEpisode.judgment.findings.find(
    (finding) => finding.reference === "contract:criterion:1",
  );
  assert.ok(clause, "the changed clause is named");
  assert.match(clause!.evidence, /^contract-hash:sha256:[0-9a-f]{32}$/u);
  assert.match(clause!.reason, /changed after the capsule was pinned/u);

  const unavailable = await runMissionCheck(
    inside.subject,
    fakeTransport(() => new Error("model not found")),
    "fixture-model",
    "xhigh",
    () => 1_000,
  );
  assert.equal(unavailable.judgment.verdict, "unknown");
  assert.match(String(unavailable.failure), /model not found/u);

  // A finding naming nothing in the capsule refuses the result; the honest
  // outcome is unknown, which holds, never a pass.
  const unsupported = await runMissionCheck(
    inside.subject,
    fakeTransport(() => ({
      schemaVersion: "mission-check-v1",
      verdict: "drift",
      findings: [
        {
          kind: "thesis",
          reference: "invented-thesis",
          evidence: "packages/fixture/src/judge.ts",
          reason: "Unsupported.",
        },
      ],
    })),
    "fixture-model",
    "xhigh",
    () => 1_000,
  );
  assert.equal(unsupported.judgment.verdict, "unknown");
  assert.match(String(unsupported.failure), /no supplied clause/u);

  // A model drift naming a supplied thesis stands on its own evidence.
  const modelDrift = await runMissionCheck(
    inside.subject,
    fakeTransport(() => ({
      schemaVersion: "mission-check-v1",
      verdict: "drift",
      findings: [
        {
          kind: "thesis",
          reference: "the-core-bet",
          evidence: "WO-999-D001",
          reason:
            "The recorded decision moves the judge onto a hosted service.",
        },
      ],
    })),
    "fixture-model",
    "xhigh",
    () => 1_000,
  );
  assert.equal(modelDrift.judgment.verdict, "drift");
  assert.equal(modelDrift.judgment.findings[0]!.reference, "the-core-bet");
  t.diagnostic(
    "on-mission, host-proved drift, mid-episode clause drift, unavailable, unsupported and model drift",
  );
});

test("WO-099 a drift holds unattended dispatch, records the correction, and a human answer clears it", async (t) => {
  const fixture = missionFixture({ outsideSurface: true });
  mkdirSync(fixture.directory, { recursive: true });
  let at = 0;
  const host = new ResidentHost({
    directory: fixture.directory,
    policyId: fixture.configuration.policyId,
    configuration: fixture.configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      ...scriptDouble(),
      "cli-worker": cliWorkerAdapter({
        version: "0.154.0",
        runner: missionRunner(() => ({
          schemaVersion: "mission-check-v1",
          verdict: "drift",
          findings: [
            {
              kind: "contract-clause",
              reference: MISSION_SURFACE_CLAUSE,
              evidence: "docs/product/00-vision.md",
              reason:
                "Reviewed: this path has a standing exception and needs no action.",
            },
          ],
        })),
      }),
    },
  });
  await host.start();
  t.after(() => {
    host.close();
    fixture.dispose();
  });
  await recordPresence(fixture.directory, "away", () => at);
  at = 10;
  await host.tick();
  assert.equal(state(host).machine!.state, "mission-check");
  at = 20;
  await host.tick();

  const held = state(host).dispatchHeld;
  assert.ok(held, "the mission check must hold");
  assert.equal(held!.verdict, "drift");
  assert.equal(held!.findings[0]!.reference, MISSION_SURFACE_CLAUSE);
  assert.match(held!.findings[0]!.reason, /^The diff edits/u);
  assert.doesNotMatch(held!.findings[0]!.reason, /standing exception/u);
  const correction = events(host, "MissionDriftObserved");
  assert.equal(correction.length, 1);
  assert.equal(
    (correction[0]!.payload as { episodeId: string }).episodeId,
    held!.episodeId,
  );
  assert.equal(
    state(host).dispatchHeld!.correctionEventId,
    correction[0]!.eventId,
  );
  assert.match(
    (
      correction[0]!.payload as {
        findings: readonly { reason: string }[];
      }
    ).findings[0]!.reason,
    /^The diff edits/u,
  );
  // The curve reset to the work phase; that work is what the hold refuses.
  assert.equal(state(host).machine!.state, "work");

  at = 40;
  await host.tick();
  const refused = events(host, "ScriptEpisodeRefused");
  assert.equal(refused.length, 1);
  assert.match(
    String((refused[0]!.payload as { reason: string }).reason),
    /found drift/u,
  );
  assert.equal(events(host, "ScriptEpisodeDispatched").length, 2);

  // The check that raised the hold stays armed: it is the supervision, not
  // the work it holds, so it can observe the repair.
  const armed = residentMachine(state(host));
  armed.now = 40;
  armed.dispatch("probe-episode");
  armed.outcome("verified-success", "probe-episode");
  assert.equal(armed.state, "mission-check");
  assert.equal(residentRefusal(state(host), armed), null);

  await clearMissionHold(
    fixture.directory,
    {
      origin: "human",
      episodeId: held!.episodeId,
      answer: "Reviewed: the vision edit is in scope for this order.",
    },
    () => at,
  );
  assert.equal(state(host).dispatchHeld, null);
  at = 60;
  await host.tick();
  assert.equal(events(host, "ScriptEpisodeDispatched").length, 3);
  t.diagnostic(
    "drift held, correction recorded, work refused once, human answer released it",
  );
});

test("WO-099 an unavailable verifier holds, and only a passing judgment over changed work clears the hold", async (t) => {
  const fixture = missionFixture();
  mkdirSync(fixture.directory, { recursive: true });
  let at = 0;
  const host = new ResidentHost({
    directory: fixture.directory,
    policyId: fixture.configuration.policyId,
    configuration: fixture.configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      ...scriptDouble(),
      "cli-worker": cliWorkerAdapter({
        version: "0.154.0",
        runner: unavailableRunner,
      }),
    },
  });
  await host.start();
  t.after(() => {
    host.close();
    fixture.dispose();
  });
  await recordPresence(fixture.directory, "away", () => at);
  at = 10;
  await host.tick();
  at = 20;
  await host.tick();
  const held = state(host).dispatchHeld;
  assert.ok(held);
  assert.equal(held!.verdict, "unknown");
  assert.equal(events(host, "MissionDriftObserved").length, 0);

  // Re-judging the same bytes cannot retire the hold, however the judgment reads.
  await assert.rejects(
    clearMissionHold(
      fixture.directory,
      {
        origin: "verified-repair",
        episodeId: "ep_mission_same",
        subject: fixture.subject,
        judgment: {
          schemaVersion: "mission-check-v1",
          verdict: "on-mission",
          findings: [],
        },
      },
      () => at,
    ),
    /passing judgment over a repair/u,
  );
  // Neither can a fresh capsule that still drifts, whatever it claims.
  fixture.editContract();
  const drifting = observeMissionSubject(fixture.source, fixture.pin);
  assert.notEqual(drifting.hash, held!.subjectHash);
  await assert.rejects(
    clearMissionHold(
      fixture.directory,
      {
        origin: "verified-repair",
        episodeId: "ep_mission_drifting",
        subject: drifting,
        judgment: {
          schemaVersion: "mission-check-v1",
          verdict: "on-mission",
          findings: [],
        },
      },
      () => at,
    ),
    /passing judgment over a repair/u,
  );
  assert.ok(state(host).dispatchHeld);

  // Changed work that now passes does clear it.
  fixture.restoreContract();
  writeFileSync(
    join(fixture.work, "packages/fixture/src/judge.ts"),
    "export const a = 3;\n",
  );
  fixture.git("add", "-A");
  fixture.git("commit", "-m", "fixture repair");
  const repaired = observeMissionSubject(fixture.source, fixture.pin);
  assert.notEqual(repaired.hash, held!.subjectHash);
  const passing = validateMissionCheckResult(
    { schemaVersion: "mission-check-v1", verdict: "on-mission", findings: [] },
    repaired,
  );
  assert.equal(passing.verdict, "on-mission");
  await clearMissionHold(
    fixture.directory,
    {
      origin: "verified-repair",
      episodeId: "ep_mission_cleared",
      subject: repaired,
      judgment: passing,
    },
    () => at,
  );
  assert.equal(state(host).dispatchHeld, null);
  assert.equal(
    state(host).missionChecks["ep_mission_cleared"]!.verdict,
    "on-mission",
  );
  t.diagnostic(
    "unavailable verifier held without a correction; only a passing judgment over changed work cleared it",
  );
});

test("WO-099 the check itself stays armed while it holds the work, and the Contributor build declares the cadence", async (t) => {
  const fixture = missionFixture();
  t.after(fixture.dispose);
  const program = contributorProgram();
  const policy = program.loadout.presence?.find(
    (row) => row.policyId === CONTRIBUTOR_MISSION_POLICY,
  );
  assert.ok(policy, "the Contributor build declares the mission-check policy");
  const phase = policy!.phases.find(
    (row) => row.phaseId === CONTRIBUTOR_MISSION_PHASE,
  );
  assert.ok(phase);
  assert.deepEqual(phase!.cadence, {
    kind: "Gate",
    cadence: { kind: "Every", intervalMs: 900_000 },
    conditionRef: {
      registryId: "dotln.presence.phase-ready",
      version: 1,
      params: {
        policyId: CONTRIBUTOR_MISSION_POLICY,
        phaseId: CONTRIBUTOR_MISSION_PHASE,
      },
    },
  });
  assert.deepEqual(phase!.effectiveEnvelope.allowedEffects, ["repo.read"]);
  assert.equal(phase!.scope.changeSize.files, 0);
  assert.equal(phase!.inFlightOnReturn, "kill");
  // No host declares the CLI adapter in the saved build, so the compiled phase
  // is an honest NoOp with its reason rather than a silent dispatch.
  assert.equal(phase!.availability.kind, "NoOp");

  assert.equal(
    isMissionActor(fixture.configuration.actors["mission-check"]!),
    true,
  );
  assert.equal(isMissionActor(fixture.configuration.actors["work"]!), false);
  t.diagnostic(
    "Contributor cadence declared read-only at 900 s, NoOp without the adapter",
  );
});

test("WO-099 VER-001 F1: the cadence judges changed work, and its fresh pass clears the hold", async (t) => {
  // The Contributor build declares the check as its only phase, so the cadence
  // keeps judging while a hold stands. That is the path a repair travels.
  const fixture = missionFixture({ outsideSurface: true, missionOnly: true });
  mkdirSync(fixture.directory, { recursive: true });
  let at = 0;
  const judged: string[] = [];
  const runner: ProcessRunner = (launch) => {
    judged.push(
      (JSON.parse(launch.input) as { subject: { subjectHash: string } }).subject
        .subjectHash,
    );
    return missionRunner(() => ({
      schemaVersion: "mission-check-v1",
      verdict: "on-mission",
      findings: [],
    }))(launch);
  };
  const host = new ResidentHost({
    directory: fixture.directory,
    policyId: fixture.configuration.policyId,
    configuration: fixture.configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      "cli-worker": cliWorkerAdapter({ version: "0.154.0", runner }),
    },
  });
  await host.start();
  t.after(() => {
    host.close();
    fixture.dispose();
  });
  await recordPresence(fixture.directory, "away", () => at);
  at = 10;
  await host.tick();
  const held = state(host).dispatchHeld;
  assert.ok(held, "the out-of-surface diff holds");
  assert.equal(held!.verdict, "drift");

  // The capsule the episode judged was observed at dispatch, not the one the
  // actor was declared with: a request still bound to the declared subject
  // would have been refused before the runner was reached.
  assert.equal(judged.length, 1);
  assert.equal(judged[0], held!.subjectHash);

  // The repair: the work returns inside its declared surfaces.
  fixture.restoreVision();
  fixture.git("add", "-A");
  fixture.git("commit", "-m", "fixture repair");
  at = 40;
  await host.tick();
  assert.equal(judged.length, 2, "the held cadence judged the repair");
  assert.notEqual(judged[1], judged[0]);
  assert.notEqual(judged[1], fixture.subject.hash);
  const repaired = observeMissionSubject(fixture.source, fixture.pin);
  assert.equal(judged[1], repaired.hash, "it judged the work as it now reads");

  // The negative control that keeps the rebuild load-bearing: the declared
  // request with only its subject and episode replaced — what a cadence would
  // carry if it reused the saved command — is refused before any model runs,
  // because that command's payload still names the capsule declared at
  // actor-declaration time.
  assert.throws(
    () =>
      validateMissionCheckRequest({
        ...fixture.request,
        episodeId: "ep_probe",
        subject: repaired,
      }),
    (error: unknown) =>
      error instanceof WorkerFailure && error.code === "profile-refused",
  );

  assert.equal(state(host).dispatchHeld, null, "the fresh pass cleared it");
  const cleared = events(host, "MissionHoldCleared");
  assert.equal(cleared.length, 1);
  const payload = cleared[0]!.payload as {
    origin: string;
    episodeId: string;
    subject: { hash: string };
  };
  assert.equal(payload.origin, "verified-repair");
  assert.equal(cleared[0]!.actorId, "resident-host");
  assert.equal(payload.subject.hash, judged[1]);
  assert.notEqual(payload.episodeId, held!.episodeId);
  assert.equal(
    state(host).missionChecks[payload.episodeId]!.verdict,
    "on-mission",
  );
  t.diagnostic(
    "the cadence reached the judge with the repaired capsule and retired the hold without a human",
  );
});

test("WO-099 VER-001 F2: the capsule carries untracked work, names what it cannot carry, and refuses past its bounds", (t) => {
  const pass: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  };
  const fixture = missionFixture();
  const oversized = missionFixture();
  t.after(() => {
    fixture.dispose();
    oversized.dispose();
  });

  // Uncommitted new work is the ordinary case here, and it can be the only
  // evidence of drift: a diff that cannot see it certifies the drift as a pass.
  const outside = "docs/product/03-architecture.md";
  writeFileSync(join(fixture.work, outside), "Outside, and never committed.\n");
  const untracked = observeMissionSubject(fixture.source, fixture.pin);
  assert.ok(untracked.observation.diff.changedPaths.includes(outside));
  assert.match(
    untracked.observation.diff.text,
    /Outside, and never committed/u,
  );
  assert.deepEqual(untracked.observation.diff.omittedPaths, []);
  const judged = validateMissionCheckResult(pass, untracked);
  assert.equal(judged.verdict, "drift");
  assert.deepEqual(
    judged.findings.map((finding) => finding.evidence),
    [outside],
  );

  // The path at the bound is still judged; one past it fails closed rather
  // than dropping off the end of the list where no finding could name it.
  for (let index = 0; index < 398; index++)
    writeFileSync(
      join(fixture.work, `packages/fixture/src/part-${index}.ts`),
      "export const b = 1;\n",
    );
  const full = observeMissionSubject(fixture.source, fixture.pin);
  assert.equal(
    full.observation.diff.changedPaths.length,
    MISSION_CAPSULE_BOUNDS.paths,
  );
  assert.ok(full.observation.diff.changedPaths.includes(outside));
  assert.equal(validateMissionCheckResult(pass, full).verdict, "drift");
  writeFileSync(
    join(fixture.work, "packages/fixture/src/part-398.ts"),
    "export const b = 1;\n",
  );
  assert.throws(
    () => observeMissionSubject(fixture.source, fixture.pin),
    (error: unknown) =>
      error instanceof WorkerFailure &&
      error.code === "profile-refused" &&
      /more than the 400 the capsule can name/u.test(String(error.detail)),
  );

  // Text that does not fit is named, and no pass can be certified over it.
  writeFileSync(
    join(oversized.work, "packages/fixture/src/big.ts"),
    `// ${"x".repeat(MISSION_CAPSULE_BOUNDS.diffChars)}\n`,
  );
  const partial = observeMissionSubject(oversized.source, oversized.pin);
  assert.deepEqual(partial.observation.diff.omittedPaths, [
    "packages/fixture/src/big.ts",
  ]);
  // The oversized file is the one left out: it cannot crowd out the source
  // change beside it, which the judge still reads in full.
  assert.match(partial.observation.diff.text, /judge\.ts/u);
  assert.ok(!partial.observation.diff.text.includes("big.ts"));
  assert.equal(validateMissionCheckResult(pass, partial).verdict, "unknown");

  // Two contracts that differ only after the clause bound must not project to
  // the same clause, or the mid-episode contract change is unobservable.
  const long = "A".repeat(MISSION_CAPSULE_BOUNDS.clauseChars + 100);
  const contract = (tail: string) =>
    missionClauses(
      `**Objective:** ${long}${tail}\n\n**Acceptance criteria (all required)**\n\n1. One.\n`,
      ["packages/fixture"],
    );
  const before = contract("X");
  const after = contract("Y");
  assert.notDeepEqual(before, after);
  const parts = before.filter((clause) =>
    clause.id.startsWith("contract:objective"),
  );
  assert.equal(parts.length, 2);
  assert.ok(
    parts.every(
      (clause) => clause.text.length <= MISSION_CAPSULE_BOUNDS.clauseChars,
    ),
  );
  assert.equal(
    parts.map((clause) => clause.text).join(""),
    `${long}X`,
    "the parts are the whole clause, not a cut of it",
  );
  t.diagnostic(
    "untracked drift judged, 400th path named, 401st refused, oversized text named and unknown, clause change past 4000 bytes observable",
  );
});

test("WO-099 VER-004 F1: ignored work is redacted, bounded and judged beside an unignored control", (t) => {
  const pass: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  };
  const hidden = missionFixture();
  const control = missionFixture();
  t.after(() => {
    hidden.dispose();
    control.dispose();
  });
  const rules = [
    "docs/intake/**",
    "!docs/intake/**/",
    ".env",
    ".env.*",
    "!.env.example",
    "node_modules/",
    "",
  ].join("\n");
  writeFileSync(join(hidden.work, ".gitignore"), rules);
  mkdirSync(join(hidden.work, "node_modules"), { recursive: true });
  writeFileSync(join(hidden.work, "node_modules/baseline.txt"), "generated\n");
  hidden.git("add", ".gitignore");
  hidden.git("commit", "-m", "fixture ignore rules");
  const hiddenSource: MissionSource = {
    ...hidden.source,
    baseCommit: hidden.git("rev-parse", "HEAD"),
  };
  const hiddenPin = missionPinFromSource(hiddenSource, "WO-999");

  mkdirSync(join(hidden.work, "docs/intake"), { recursive: true });
  writeFileSync(
    join(hidden.work, "docs/intake/employer-notes.md"),
    "PRIVATE-IGNORED-CONTENTS\n",
  );
  writeFileSync(join(hidden.work, ".env"), "PRIVATE_IGNORED_VALUE=secret\n");
  const subject = observeMissionSubject(hiddenSource, hiddenPin);
  assert.deepEqual(subject.observation.diff.changedPaths, []);
  assert.equal(subject.observation.diff.ignoredEntries.length, 2);
  assert.ok(
    subject.observation.diff.ignoredEntries.every(
      (entry) =>
        entry.outsideDeclaredSurfaces &&
        /^ignored-entry:sha256:[0-9a-f]{64}$/u.test(entry.evidence),
    ),
  );
  const serialized = JSON.stringify(subject);
  assert.ok(!serialized.includes("employer-notes"));
  assert.ok(!serialized.includes("PRIVATE-IGNORED"));
  assert.ok(!serialized.includes("node_modules"));
  const judged = validateMissionCheckResult(pass, subject);
  assert.equal(judged.verdict, "drift");
  assert.equal(judged.findings.length, 2);
  assert.ok(
    judged.findings.every(
      (finding) =>
        finding.reference === MISSION_SURFACE_CLAUSE &&
        /path and bytes are redacted/u.test(finding.reason),
    ),
  );

  const controlBase = control.git("rev-parse", "HEAD");
  const controlSource: MissionSource = {
    ...control.source,
    baseCommit: controlBase,
  };
  const controlPin = missionPinFromSource(controlSource, "WO-999");
  mkdirSync(join(control.work, "docs/intake"), { recursive: true });
  writeFileSync(join(control.work, "docs/intake/employer-notes.md"), "plain\n");
  writeFileSync(join(control.work, ".env"), "plain\n");
  const visible = observeMissionSubject(controlSource, controlPin);
  assert.deepEqual([...visible.observation.diff.changedPaths].sort(), [
    ".env",
    "docs/intake/employer-notes.md",
  ]);
  assert.deepEqual(visible.observation.diff.ignoredEntries, []);
  assert.equal(validateMissionCheckResult(pass, visible).verdict, "drift");
  const prompt = missionCheckPrompt(
    buildMissionCheckRequest({
      subject,
      model: "fixture-model",
      effort: "xhigh",
      cwd: hidden.work,
      episodeId: "ep_ignored",
      at: 0,
    }),
  );
  assert.match(prompt, /ignored entries added, removed or metadata-changed/u);
  assert.ok(!prompt.includes("employer-notes"));
  t.diagnostic(
    "two ignored out-of-surface changes drift by opaque evidence; baseline ignored output stays absent; the unignored control names both paths",
  );
});

test("WO-099 VER-005 F1: ordinary build residue under a baselined ignored root leaves the cadence quiet", (t) => {
  const pass: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  };
  const fixture = missionFixture();
  t.after(() => fixture.dispose());
  // The arrangement no fixture reached before: ignore rules over build and
  // runtime trees that already exist when the capsule is pinned, then a build.
  writeFileSync(
    join(fixture.work, ".gitignore"),
    [".runtime/", "dist/", "local/", ".env*", ""].join("\n"),
  );
  mkdirSync(join(fixture.work, ".runtime"), { recursive: true });
  writeFileSync(join(fixture.work, ".runtime/resident.json"), "{}\n");
  mkdirSync(join(fixture.work, "packages/fixture/dist"), { recursive: true });
  writeFileSync(
    join(fixture.work, "packages/fixture/dist/judge.js"),
    "export const a = 2;\n",
  );
  mkdirSync(join(fixture.work, "local"), { recursive: true });
  writeFileSync(join(fixture.work, "local/operator-notes.md"), "PRIVATE\n");
  writeFileSync(join(fixture.work, ".env"), "TOKEN=baseline\n");
  fixture.git("add", ".gitignore");
  fixture.git("commit", "-m", "fixture ignore rules");
  const source: MissionSource = {
    ...fixture.source,
    baseCommit: fixture.git("rev-parse", "HEAD"),
  };
  const pin = missionPinFromSource(source, "WO-999");
  assert.equal(pin.ignoredBaseline.length, 4);

  const runtime = join(fixture.work, ".runtime");
  const beforeBuild = lstatSync(runtime).mtimeMs;
  // Exactly what `scripts/build.mjs` does to a collapsed ignored root:
  // `atomicBuild` creates and removes a staging directory directly under
  // `.runtime/`, and `publishBuildTree` renames a direct child into `dist/`.
  const staging = mkdtempSync(join(runtime, "build-"));
  writeFileSync(join(staging, "tsconfig.tsbuildinfo"), "{}\n");
  renameSync(
    join(staging, "tsconfig.tsbuildinfo"),
    join(fixture.work, "packages/fixture/dist/tsconfig.tsbuildinfo"),
  );
  rmSync(staging, { recursive: true, force: true });
  assert.notEqual(
    lstatSync(runtime).mtimeMs,
    beforeBuild,
    "the build moves the collapsed root's own metadata, so this reaches the defect",
  );
  const built = observeMissionSubject(source, pin);
  assert.deepEqual(built.observation.diff.changedPaths, []);
  assert.deepEqual(built.observation.diff.ignoredEntries, []);
  assert.equal(validateMissionCheckResult(pass, built).verdict, "on-mission");
  assert.deepEqual(
    observeMissionSubject(source, pin).observation.diff.ignoredEntries,
    [],
    "and the next pulse over no new work does not re-raise it either",
  );

  // New ignored out-of-surface work still drifts: VER-004 F1 stays repaired.
  writeFileSync(join(fixture.work, ".env.private"), "TOKEN=planted\n");
  const planted = observeMissionSubject(source, pin);
  assert.equal(planted.observation.diff.ignoredEntries.length, 1);
  assert.ok(
    planted.observation.diff.ignoredEntries.every(
      (entry) => entry.outsideDeclaredSurfaces,
    ),
  );
  const judged = validateMissionCheckResult(pass, planted);
  assert.equal(judged.verdict, "drift");
  assert.ok(
    judged.findings.every(
      (finding) => finding.reference === MISSION_SURFACE_CLAUSE,
    ),
  );
  assert.ok(!JSON.stringify(planted).includes(".env.private"));
  unlinkSync(join(fixture.work, ".env.private"));

  // The boundary this rule widens, written where the suite can see it: work
  // added directly inside a baselined collapsed root is now as invisible as a
  // nested rewrite already was.
  writeFileSync(join(fixture.work, ".runtime/added-after-the-pin.txt"), "x\n");
  const inside = observeMissionSubject(source, pin);
  assert.deepEqual(inside.observation.diff.ignoredEntries, []);
  assert.equal(validateMissionCheckResult(pass, inside).verdict, "on-mission");

  // A baselined ignored file keeps size and mtime, so its bytes moving is
  // still work, and a baselined root that disappears is still work.
  writeFileSync(join(fixture.work, ".env"), "TOKEN=rotated-after-the-pin\n");
  rmSync(join(fixture.work, "local"), { recursive: true, force: true });
  const moved = observeMissionSubject(source, pin);
  assert.equal(moved.observation.diff.ignoredEntries.length, 2);
  assert.equal(validateMissionCheckResult(pass, moved).verdict, "drift");
  t.diagnostic(
    "one ordinary build leaves two pulses quiet; a planted ignored file, a rewritten baselined ignored file and a removed baselined root still drift; the collapsed-root interior is the disclosed limit",
  );
});

test("WO-099 VER-005 F1: an ordinary build during the cadence raises no hold", async (t) => {
  // The resident leg of the same defect: the false hold VER-005 reproduced was
  // raised over build residue, cleared by a human answer and re-raised on the
  // next pulse over no new work. With the baseline honored, no hold is raised
  // at all, so there is nothing to clear.
  const fixture = missionFixture({
    missionOnly: true,
    ignored: {
      rules: [".runtime/", "dist/"],
      baseline: {
        ".runtime/resident.json": "{}\n",
        "packages/fixture/dist/judge.js": "export const a = 2;\n",
      },
    },
  });
  mkdirSync(fixture.directory, { recursive: true });
  let at = 0;
  const host = new ResidentHost({
    directory: fixture.directory,
    policyId: fixture.configuration.policyId,
    configuration: fixture.configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      "cli-worker": cliWorkerAdapter({
        version: "0.154.0",
        runner: missionRunner(() => ({
          schemaVersion: "mission-check-v1",
          verdict: "on-mission",
          findings: [],
        })),
      }),
    },
  });
  await host.start();
  t.after(() => {
    host.close();
    fixture.dispose();
  });
  await recordPresence(fixture.directory, "away", () => at);
  // What the build does to the collapsed roots the pin already carries
  // (`scripts/build.mjs`), performed inside the interval the check supervises.
  const staging = mkdtempSync(join(fixture.work, ".runtime/build-"));
  writeFileSync(join(staging, "tsconfig.tsbuildinfo"), "{}\n");
  renameSync(
    join(staging, "tsconfig.tsbuildinfo"),
    join(fixture.work, "packages/fixture/dist/tsconfig.tsbuildinfo"),
  );
  rmSync(staging, { recursive: true, force: true });
  at = 10;
  await host.tick();
  assert.ok(
    !state(host).dispatchHeld,
    "an ordinary build is not work the cadence holds on",
  );
  at = 40;
  await host.tick();
  assert.ok(!state(host).dispatchHeld);
  assert.equal(events(host, "MissionDriftObserved").length, 0);
  t.diagnostic(
    "two pulses across an ordinary build leave the cadence unheld with no correction event",
  );
});

test("WO-099 VER-002 F1: a failed verifier cannot erase the drift the capsule already proved", async (t) => {
  // The conjunction neither existing case covers: the episode observed its
  // capsule, the host can prove an out-of-surface edit from it alone, and then
  // the verifier never returns a judgment. Only the model's verdict is missing.
  const unsupported = missionRunner(() => ({
    schemaVersion: "mission-check-v1",
    verdict: "drift",
    findings: [
      {
        kind: "thesis",
        reference: "invented-thesis",
        evidence: "packages/fixture/src/judge.ts",
        reason: "Names nothing the capsule supplied, so the result refuses.",
      },
    ],
  }));
  for (const [failure, runner] of [
    ["model-unavailable", unavailableRunner],
    ["invalid-result", unsupported],
  ] as const) {
    const fixture = missionFixture({
      outsideSurface: true,
      missionOnly: true,
    });
    mkdirSync(fixture.directory, { recursive: true });
    let at = 0;
    const host = new ResidentHost({
      directory: fixture.directory,
      policyId: fixture.configuration.policyId,
      configuration: fixture.configuration,
      now: () => at,
      capabilities: () => ["adapter.fixture"],
      catalog: {
        ...actorCatalog,
        "cli-worker": cliWorkerAdapter({ version: "0.154.0", runner }),
      },
    });
    await host.start();
    t.after(() => {
      host.close();
      fixture.dispose();
    });
    await recordPresence(fixture.directory, "away", () => at);
    at = 10;
    await host.tick();

    const held = state(host).dispatchHeld;
    assert.ok(held, `${failure} must still hold`);
    assert.equal(held!.verdict, "drift", `${failure} keeps the proved drift`);
    assert.deepEqual(
      held!.findings.map((finding) => [finding.reference, finding.evidence]),
      [[MISSION_SURFACE_CLAUSE, "docs/product/00-vision.md"]],
    );
    assert.equal(
      state(host).missionChecks[held!.episodeId]!.verdict,
      "drift",
      "the recorded check is the derived verdict, not an empty unknown",
    );
    assert.match(held!.reason, /found drift/u);
    // The hold still says the model never judged: a host-proved drift is not a
    // model judgment, and the reason is what a returning human reads.
    assert.match(
      held!.reason,
      new RegExp(`no model judgment: ${failure}`, "u"),
    );
    // The drift is a correction with a producer, exactly as an answered drift is.
    const correction = events(host, "MissionDriftObserved");
    assert.equal(correction.length, 1);
    assert.deepEqual(
      (correction[0]!.payload as { findings: unknown }).findings,
      held!.findings,
    );
    assert.equal(
      held!.subjectHash,
      observeMissionSubject(fixture.source, fixture.pin).hash,
      "the hold names the capsule the episode observed",
    );
  }
  t.diagnostic(
    "an unavailable and an invalid verifier both held the host-proved drift with its finding and correction",
  );
});

test("WO-099 VER-002 F2: the capsule carries links as links and reads nothing outside the worktree", (t) => {
  const pass: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  };
  const fixture = missionFixture();
  t.after(fixture.dispose);
  // A file beside the worktree, never inside it. The capsule must never carry
  // these bytes, however a changed path inside the worktree names them.
  const marker = "OUTSIDE-WORKTREE-MARKER";
  const outside = join(fixture.root, "outside-secret.txt");
  writeFileSync(outside, `${marker}\n`);

  const link = "packages/fixture/src/linked.ts";
  symlinkSync(outside, join(fixture.work, link));
  const linked = observeMissionSubject(fixture.source, fixture.pin);
  assert.ok(linked.observation.diff.changedPaths.includes(link));
  assert.ok(
    !linked.observation.diff.text.includes(marker),
    "the target's bytes never enter the capsule",
  );
  // What Git records for an untracked link: the link itself, with its target
  // as the content, so the judge still sees the whole change.
  assert.match(linked.observation.diff.text, /new file mode 120000/u);
  assert.ok(linked.observation.diff.text.includes(`+${outside}\n`));
  assert.deepEqual(linked.observation.diff.omittedPaths, []);
  assert.equal(validateMissionCheckResult(pass, linked).verdict, "on-mission");

  // A link outside the declared surfaces is still judged as the path it is.
  const outsideSurface = "docs/product/linked.md";
  symlinkSync(outside, join(fixture.work, outsideSurface));
  const drifted = observeMissionSubject(fixture.source, fixture.pin);
  const judged = validateMissionCheckResult(pass, drifted);
  assert.equal(judged.verdict, "drift");
  assert.ok(
    judged.findings.some((finding) => finding.evidence === outsideSurface),
  );
  assert.ok(!drifted.observation.diff.text.includes(marker));

  // A declared source file that resolves outside the worktree refuses rather
  // than reading it: containment is a property of the bytes, not of the name.
  const linkedContract = "docs/work-orders/linked-contract.md";
  symlinkSync(outside, join(fixture.work, linkedContract));
  assert.throws(
    () =>
      missionPinFromSource(
        { ...fixture.source, contractPath: linkedContract },
        "WO-999",
      ),
    (error: unknown) =>
      error instanceof WorkerFailure &&
      error.code === "profile-refused" &&
      /outside the worktree/u.test(String(error.detail)),
  );

  // Size is read before the bytes are: an untracked file past the diff bound is
  // named as omitted without being allocated, and the claimed pass is still not
  // admitted — here because the standing outside-surface link is drift.
  writeFileSync(
    join(fixture.work, "packages/fixture/src/huge.ts"),
    `// ${"y".repeat(MISSION_CAPSULE_BOUNDS.diffChars)}\n`,
  );
  const bounded = observeMissionSubject(fixture.source, fixture.pin);
  assert.ok(
    bounded.observation.diff.omittedPaths.includes(
      "packages/fixture/src/huge.ts",
    ),
  );
  assert.equal(validateMissionCheckResult(pass, bounded).verdict, "drift");
  t.diagnostic(
    "inside and outside-surface links carried as links, outside bytes absent, linked declared source refused, oversized file omitted unread",
  );
});

test("WO-099 VER-003 F1: the host's own findings readmit at the capsule's bounds, and the judge's bound counts only what it adds", (t) => {
  const pass: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  };
  const fixture = missionFixture();
  t.after(fixture.dispose);
  // Surfaces declared right up to the clause bound, so the host's reason for
  // one out-of-surface path — itself as long as a path may be — would run past
  // the line a finding may carry. The judged file's own path is a surface, so
  // the in-surface change stays in-surface.
  const surfaces = [
    "packages/fixture/src/judge.ts",
    ...Array.from({ length: 16 }, (_, index) => {
      const prefix = `packages/surface-${index}/`;
      return prefix + "s".repeat(240 - prefix.length);
    }),
  ];
  const source: MissionSource = {
    ...fixture.source,
    declaredSurfaces: surfaces,
  };
  const pin = missionPinFromSource(source, "WO-999");
  const long = `docs/product/${"o".repeat(240 - "docs/product/".length - 3)}.md`;
  assert.equal(long.length, 240);
  writeFileSync(join(fixture.work, long), "Outside, at the path bound.\n");
  for (let index = 0; index < 200; index++)
    writeFileSync(
      join(fixture.work, `docs/product/outside-${index}.md`),
      "Outside.\n",
    );
  fixture.editContract();
  const subject = observeMissionSubject(source, pin);
  // The judged file, the edited contract, the long path and 200 more.
  assert.equal(subject.observation.diff.changedPaths.length, 203);

  const judged = validateMissionCheckResult(pass, subject);
  assert.equal(judged.verdict, "drift");
  // 202 out-of-surface paths (the contract file among them) and the clause.
  assert.equal(judged.findings.length, 203);
  assert.ok(judged.findings.length > MISSION_CAPSULE_BOUNDS.modelFindings);
  assert.ok(
    judged.findings.some(
      (finding) => finding.reference === "contract:criterion:1",
    ),
  );
  const bounded = judged.findings.find((finding) => finding.evidence === long)!;
  assert.ok(bounded.reason.length <= 4_000, "a host reason stays one line");
  assert.match(bounded.reason, /truncated by the mission capsule\)$/u);
  // Closed under its own normalization: admission and replay validate the
  // host's result again and must be handed back the same result.
  assert.deepEqual(validateMissionCheckResult(judged, subject), judged);

  // The judge's bound is what it adds beyond the host's findings: a hundred
  // of its own readmit beside every host finding, the hundred-and-first
  // refuses, and repeating the host's findings costs it nothing.
  const thesis = (path: string) => ({
    kind: "thesis" as const,
    reference: "the-core-bet",
    evidence: path,
    reason: "Named by the judge.",
  });
  const paths = subject.observation.diff.changedPaths;
  const limit = MISSION_CAPSULE_BOUNDS.modelFindings;
  const hundred: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "drift",
    findings: paths.slice(0, limit).map(thesis),
  };
  const withJudge = validateMissionCheckResult(hundred, subject);
  assert.equal(withJudge.findings.length, 203 + limit);
  assert.deepEqual(validateMissionCheckResult(withJudge, subject), withJudge);
  assert.throws(
    () =>
      validateMissionCheckResult(
        { ...hundred, findings: paths.slice(0, limit + 1).map(thesis) },
        subject,
      ),
    (error: unknown) =>
      error instanceof WorkerFailure &&
      error.code === "invalid-result" &&
      /beyond the host's own/u.test(String(error.detail)),
  );
  const repeated: MissionCheckObserved = {
    ...hundred,
    findings: [...judged.findings, ...hundred.findings],
  };
  assert.deepEqual(validateMissionCheckResult(repeated, subject), withJudge);
  const judgeRewordsHostProof: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "drift",
    findings: [
      {
        ...judged.findings[0]!,
        reason: "Reviewed: this host finding has a standing exception.",
      },
    ],
  };
  const hostWins = validateMissionCheckResult(judgeRewordsHostProof, subject);
  assert.equal(hostWins.findings[0]!.reason, judged.findings[0]!.reason);
  assert.doesNotMatch(hostWins.findings[0]!.reason, /standing exception/u);
  t.diagnostic(
    "203 host findings readmitted with a bounded reason; the judge's 100 counted beyond them; repeated host proof keeps the host reason",
  );
});

test("WO-099 VER-003 F1: the resident records the hold for every host finding at the path bound, whether or not the judge answered", async (t) => {
  const pass: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  };
  for (const [failure, runner] of [
    [null, missionRunner(() => pass)],
    ["model-unavailable", unavailableRunner],
  ] as const) {
    const fixture = missionFixture({ missionOnly: true });
    mkdirSync(fixture.directory, { recursive: true });
    // The bound itself: beside the in-surface change and the contract edited
    // after the pin, 398 untracked paths outside the surfaces make 400.
    for (let index = 0; index < MISSION_CAPSULE_BOUNDS.paths - 2; index++)
      writeFileSync(
        join(fixture.work, `docs/product/outside-${index}.md`),
        "Outside.\n",
      );
    fixture.editContract();
    let at = 0;
    const host = new ResidentHost({
      directory: fixture.directory,
      policyId: fixture.configuration.policyId,
      configuration: fixture.configuration,
      now: () => at,
      capabilities: () => ["adapter.fixture"],
      catalog: {
        ...actorCatalog,
        "cli-worker": cliWorkerAdapter({ version: "0.154.0", runner }),
      },
    });
    await host.start();
    t.after(() => {
      host.close();
      fixture.dispose();
    });
    await recordPresence(fixture.directory, "away", () => at);
    at = 10;
    await host.tick();

    const label = failure ?? "answered";
    const observed = observeMissionSubject(fixture.source, fixture.pin);
    assert.equal(
      observed.observation.diff.changedPaths.length,
      MISSION_CAPSULE_BOUNDS.paths,
    );
    const held = state(host).dispatchHeld;
    assert.ok(held, `${label}: the hold must be recorded`);
    assert.equal(held!.verdict, "drift", label);
    // 399 out-of-surface paths (the contract file among them) and the clause.
    assert.equal(held!.findings.length, 400, label);
    assert.equal(held!.subjectHash, observed.hash, label);
    assert.equal(state(host).episodes[held!.episodeId], "observed", label);
    assert.equal(
      state(host).missionChecks[held!.episodeId]!.verdict,
      "drift",
      label,
    );
    if (failure)
      assert.match(
        held!.reason,
        new RegExp(`no model judgment: ${failure}`, "u"),
      );
    else assert.doesNotMatch(held!.reason, /no model judgment/u);
    const correction = events(host, "MissionDriftObserved");
    assert.equal(correction.length, 1, label);
    assert.deepEqual(
      (correction[0]!.payload as { findings: unknown }).findings,
      held!.findings,
    );
  }
  t.diagnostic(
    "400 host findings held and corrected through the resident with an answering and an unavailable judge",
  );
});

test("WO-099 VER-003 F1: a judgment the actor contract refuses is recorded as the failed episode with its capsule, and the proved drift still holds", async (t) => {
  const fixture = missionFixture({ outsideSurface: true, missionOnly: true });
  mkdirSync(fixture.directory, { recursive: true });
  let at = 0;
  // An adapter double that observes the real capsule and hands back a
  // judgment naming a thesis the capsule never supplied, which admission
  // refuses. Before the repair that refusal threw out of the transaction.
  const refused: ActorAdapter = {
    kind: "cli-worker",
    available: () => null,
    run: (spec, context) => ({
      kill: () => {},
      completed: Promise.resolve({
        ...actorFailure("worker-result"),
        exitCode: 0,
        worker: {
          launch: {
            transport: spec.worker!.transport,
            row: DETACHED_LAUNCH_ROWS[spec.worker!.transport].row,
            profileId: spec.worker!.request.profile.profileId,
            model: spec.worker!.request.model,
            effort: spec.worker!.request.effort,
            harnessVersion: "0.154.0",
            origin: "actor" as const,
            episodeId: context!.episodeId,
          },
          result: {
            schemaVersion: "mission-check-v1" as const,
            verdict: "on-mission" as const,
            findings: [
              {
                kind: "thesis" as const,
                reference: "invented-thesis",
                evidence: "packages/fixture/src/judge.ts",
                reason: "Names nothing the capsule supplied.",
              },
            ],
          },
          subject: observeMissionSubject(
            spec.missionSource!,
            missionPin((spec.worker!.request as MissionCheckRequest).subject),
          ),
        },
      }),
    }),
  };
  const host = new ResidentHost({
    directory: fixture.directory,
    policyId: fixture.configuration.policyId,
    configuration: fixture.configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: { ...actorCatalog, "cli-worker": refused },
  });
  await host.start();
  t.after(() => {
    host.close();
    fixture.dispose();
  });
  await recordPresence(fixture.directory, "away", () => at);
  at = 10;
  await host.tick();

  const held = state(host).dispatchHeld;
  assert.ok(held, "the refused judgment must not lose the hold");
  assert.equal(held!.verdict, "drift");
  assert.match(held!.reason, /no model judgment: invalid-result/u);
  assert.deepEqual(
    held!.findings.map((finding) => [finding.reference, finding.evidence]),
    [[MISSION_SURFACE_CLAUSE, "docs/product/00-vision.md"]],
  );
  assert.equal(events(host, "MissionDriftObserved").length, 1);
  const observation = events(host, "CliWorkerObserved").at(-1)!.payload as {
    worker: { failure?: string; result?: unknown; subject?: { hash: string } };
  };
  assert.equal(observation.worker.failure, "invalid-result");
  assert.equal(observation.worker.result, undefined);
  assert.equal(observation.worker.subject?.hash, held!.subjectHash);
  t.diagnostic(
    "refused judgment recorded as invalid-result with its capsule; the host-proved drift held",
  );
});

test("WO-099 VER-003 F2: a decision history that exists but cannot be carried is named and holds; the declared window is honored, including zero", (t) => {
  const pass: MissionCheckObserved = {
    schemaVersion: "mission-check-v1",
    verdict: "on-mission",
    findings: [],
  };
  const fixture = missionFixture();
  t.after(fixture.dispose);

  // The window: zero is zero, one is the newest, N is at most N.
  const history = (ids: readonly string[]) =>
    ids
      .map(
        (id) =>
          `## ${id}\n\n\`\`\`json\n{ "id": "${id}", "decision": "Decided ${id}." }\n\`\`\`\n`,
      )
      .join("\n");
  const three = history(["WO-999-D001", "WO-999-D002", "WO-999-D003"]);
  assert.deepEqual(missionDecisions(three, 0), []);
  assert.deepEqual(
    missionDecisions(three, 1).map((decision) => decision.id),
    ["WO-999-D003"],
  );
  assert.deepEqual(
    missionDecisions(three, 5).map((decision) => decision.id),
    ["WO-999-D001", "WO-999-D002", "WO-999-D003"],
  );

  // An optional history that does not exist yet, or was never declared, is a
  // whole, empty window: nothing is missing and a pass stands.
  const absent = observeMissionSubject(
    { ...fixture.source, decisionsPath: "docs/evidence/WO-999/not-yet.md" },
    fixture.pin,
  );
  assert.deepEqual(absent.observation.decisions, []);
  assert.equal(absent.observation.omittedDecisions, null);
  assert.equal(validateMissionCheckResult(pass, absent).verdict, "on-mission");
  const {
    root,
    contractPath,
    baseCommit,
    declaredSurfaces,
    decisionLimit,
    visionPath,
    thesisHeadings,
  } = fixture.source;
  const undeclared: MissionSource = {
    root,
    contractPath,
    baseCommit,
    declaredSurfaces,
    decisionLimit,
    visionPath,
    thesisHeadings,
  };
  assert.equal(
    observeMissionSubject(undeclared, fixture.pin).observation.omittedDecisions,
    null,
  );

  // A history past the size bound, committed so its last decision is not
  // incidentally visible in the diff text: the judge is told it exists and was
  // not shown, and a claimed pass cannot be certified over it.
  const decisionsPath = join(fixture.work, fixture.source.decisionsPath!);
  writeFileSync(
    decisionsPath,
    `# Decisions\n\n${"p".repeat(200_000)}\n\n## WO-999-D002\n\n\`\`\`json\n{ "id": "WO-999-D002", "decision": "Change the goal beyond the declared objective." }\n\`\`\`\n`,
  );
  fixture.git("add", "-A");
  fixture.git("commit", "-m", "oversized history");
  const committed: MissionSource = {
    ...fixture.source,
    baseCommit: fixture.git("rev-parse", "HEAD"),
  };
  const oversized = observeMissionSubject(committed, fixture.pin);
  assert.deepEqual(oversized.observation.diff.changedPaths, []);
  assert.deepEqual(oversized.observation.decisions, []);
  assert.match(
    String(oversized.observation.omittedDecisions),
    /exceeds 200000 bytes/u,
  );
  assert.equal(validateMissionCheckResult(pass, oversized).verdict, "unknown");
  // A drift the judge can still name stands on the incomplete capsule.
  const named = validateMissionCheckResult(
    {
      schemaVersion: "mission-check-v1",
      verdict: "drift",
      findings: [
        {
          kind: "thesis",
          reference: "the-core-bet",
          evidence: missionContractEvidence(oversized),
          reason: "Named over an incomplete history.",
        },
      ],
    },
    oversized,
  );
  assert.equal(named.verdict, "drift");
  // The judge is told, in the capsule and in its instructions.
  const prompt = JSON.parse(
    missionCheckPrompt(
      buildMissionCheckRequest({
        subject: oversized,
        model: "fixture-model",
        effort: "xhigh",
        cwd: fixture.work,
        episodeId: "ep_probe",
        at: 0,
      }),
    ),
  ) as { subject: { omittedDecisions: string }; outputInstructions: string };
  assert.match(prompt.subject.omittedDecisions, /exceeds/u);
  assert.match(prompt.outputInstructions, /omittedDecisions/u);

  // A zero window reads nothing, so the same file holds nothing back.
  const zero = observeMissionSubject(
    { ...committed, decisionLimit: 0 },
    fixture.pin,
  );
  assert.deepEqual(zero.observation.decisions, []);
  assert.equal(zero.observation.omittedDecisions, null);
  assert.equal(validateMissionCheckResult(pass, zero).verdict, "on-mission");

  // A history resolving outside the worktree is named, and its bytes stay out.
  const marker = "OUTSIDE-DECISIONS-MARKER";
  const outside = join(fixture.root, "outside-decisions.md");
  writeFileSync(
    outside,
    `\`\`\`json\n{ "id": "WO-999-D009", "decision": "${marker}" }\n\`\`\`\n`,
  );
  unlinkSync(decisionsPath);
  symlinkSync(outside, decisionsPath);
  fixture.git("add", "-A");
  fixture.git("commit", "-m", "linked history");
  const linked = observeMissionSubject(
    { ...committed, baseCommit: fixture.git("rev-parse", "HEAD") },
    fixture.pin,
  );
  assert.match(
    String(linked.observation.omittedDecisions),
    /outside the worktree/u,
  );
  assert.deepEqual(linked.observation.decisions, []);
  assert.ok(!JSON.stringify(linked).includes(marker));
  assert.equal(validateMissionCheckResult(pass, linked).verdict, "unknown");
  t.diagnostic(
    "window 0/1/N honored; absent history whole; oversized and linked histories named, unknown and byte-free",
  );
});

test("WO-099 VER-003 F2: the resident holds a claimed pass over a history it could not carry", async (t) => {
  const fixture = missionFixture({
    missionOnly: true,
    history: `# Decisions\n\n${"p".repeat(200_000)}\n\n## WO-999-D002\n\n\`\`\`json\n{ "id": "WO-999-D002", "decision": "Change the goal beyond the declared objective." }\n\`\`\`\n`,
  });
  mkdirSync(fixture.directory, { recursive: true });
  assert.match(
    String(fixture.subject.observation.omittedDecisions),
    /exceeds 200000 bytes/u,
  );
  let at = 0;
  const host = new ResidentHost({
    directory: fixture.directory,
    policyId: fixture.configuration.policyId,
    configuration: fixture.configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    catalog: {
      ...actorCatalog,
      "cli-worker": cliWorkerAdapter({
        version: "0.154.0",
        runner: missionRunner(() => ({
          schemaVersion: "mission-check-v1",
          verdict: "on-mission",
          findings: [],
        })),
      }),
    },
  });
  await host.start();
  t.after(() => {
    host.close();
    fixture.dispose();
  });
  await recordPresence(fixture.directory, "away", () => at);
  at = 10;
  await host.tick();
  const held = state(host).dispatchHeld;
  assert.ok(held, "an in-surface diff over an uncarried history still holds");
  assert.equal(held!.verdict, "unknown");
  assert.equal(state(host).missionChecks[held!.episodeId]!.verdict, "unknown");
  assert.equal(events(host, "MissionDriftObserved").length, 0);
  t.diagnostic(
    "claimed pass over an uncarried history recorded as unknown and held, with no correction",
  );
});

test("WO-152 the emitted schema carries no duplicate enum item, and a mid-episode clause change still names the old and the new id", (t) => {
  const fixture = missionFixture();
  t.after(() => fixture.dispose());

  /** Every `enum` the emitted schema carries, by its path, so the assertion
   * covers the three `reference` enums and `evidence` without naming them. */
  const schemaEnums = (
    node: unknown,
    path = "$",
  ): readonly (readonly [string, readonly unknown[]])[] => {
    if (Array.isArray(node))
      return node.flatMap((item, index) =>
        schemaEnums(item, `${path}[${index}]`),
      );
    if (node && typeof node === "object")
      return Object.entries(node).flatMap(([key, value]) =>
        key === "enum" && Array.isArray(value)
          ? [[`${path}.enum`, value] as const]
          : schemaEnums(value, `${path}.${key}`),
      );
    return [];
  };
  const repeated = (subject: MissionCheckSubject) =>
    schemaEnums(missionCheckResultSchema(subject)).flatMap(([path, items]) => {
      const duplicates = [
        ...new Set(items.filter((item, at) => items.indexOf(item) !== at)),
      ];
      return duplicates.length ? [[path, duplicates] as const] : [];
    });
  const enumPaths = schemaEnums(missionCheckResultSchema(fixture.subject)).map(
    ([path]) => path,
  );
  // The walk is worth nothing if it reaches no enum: one `reference` and one
  // `evidence` per finding kind, plus the verdict, is what this schema
  // declares — three, three and one.
  assert.equal(enumPaths.length, 7, enumPaths.join(", "));

  // The ordinary case: the contract has not changed since the pin, so the
  // pinned and observed clause lists are identical. Concatenating them put
  // every clause id into the `reference` enum twice, and the Claude CLI
  // refuses a `--json-schema` whose enum repeats an item, which ended every
  // `claude-cli-print` mission check before any model call (WO-148 D009).
  assert.deepEqual(missionReferenceIds(fixture.subject, "contract-clause"), [
    MISSION_SURFACE_CLAUSE,
    "contract:objective",
    "contract:criterion:1",
    "contract:criterion:2",
    "contract:non-goals",
    "contract:evidence-gate",
  ]);
  assert.deepEqual(repeated(fixture.subject), []);

  // The other two kinds are unchanged: they project one list each and never
  // concatenated anything.
  assert.deepEqual(missionReferenceIds(fixture.subject, "thesis"), [
    "the-core-bet",
  ]);
  assert.deepEqual(missionReferenceIds(fixture.subject, "exclusion"), [
    "what-dotln-is-not:1",
    "what-dotln-is-not:2",
  ]);

  // A contract edited after the pin in a way that moves the ids: the observed
  // contract drops `contract:criterion:2` and adds `contract:criterion:3`.
  // Both must stay nameable, each once, the pinned ids first.
  fixture.renumberContract();
  const changed = observeMissionSubject(fixture.source, fixture.pin);
  assert.deepEqual(
    changed.observation.contract.clauses.map((clause) => clause.id),
    [
      MISSION_SURFACE_CLAUSE,
      "contract:objective",
      "contract:criterion:1",
      "contract:criterion:3",
      "contract:non-goals",
      "contract:evidence-gate",
    ],
  );
  assert.deepEqual(missionReferenceIds(changed, "contract-clause"), [
    MISSION_SURFACE_CLAUSE,
    "contract:objective",
    "contract:criterion:1",
    "contract:criterion:2",
    "contract:non-goals",
    "contract:evidence-gate",
    "contract:criterion:3",
  ]);
  assert.deepEqual(repeated(changed), []);

  // The third reference source is the optional story contract, which
  // `missionReferenceIds` reads between the pinned and the observed one.
  // `storyOf` builds it from a second document through the same structural
  // clause ids, so it mostly repeats the contract's and may carry one of its
  // own; deduplication must keep that one and repeat none of the others.
  const story: MissionCheckSubject = {
    ...changed,
    storyContract: {
      storyId: "docs/product/00-vision.md",
      clauses: [
        ...changed.contract.clauses.slice(0, 2),
        {
          id: "contract:criterion:4",
          kind: "criterion",
          text: "A clause only the story contract carries.",
        },
      ],
    },
  };
  assert.deepEqual(missionReferenceIds(story, "contract-clause"), [
    MISSION_SURFACE_CLAUSE,
    "contract:objective",
    "contract:criterion:1",
    "contract:criterion:2",
    "contract:non-goals",
    "contract:evidence-gate",
    "contract:criterion:4",
    "contract:criterion:3",
  ]);
  assert.deepEqual(repeated(story), []);

  // The validator tests membership with `includes`, which deduplication does
  // not change: the clause the observed contract dropped is still nameable,
  // and an id no contract supplies is still refused.
  const claim = (reference: string) => ({
    schemaVersion: "mission-check-v1",
    verdict: "drift",
    findings: [
      {
        kind: "contract-clause",
        reference,
        evidence: "packages/fixture/src/judge.ts",
        reason: "Named to exercise the membership check.",
      },
    ],
  });
  assert.ok(
    validateMissionCheckResult(
      claim("contract:criterion:2"),
      changed,
    ).findings.some(
      (finding) =>
        finding.reference === "contract:criterion:2" &&
        finding.evidence === "packages/fixture/src/judge.ts",
    ),
    "a pinned-only clause id is still a supported reference",
  );
  assert.throws(
    () => validateMissionCheckResult(claim("contract:criterion:9"), changed),
    /no supplied clause/u,
  );

  t.diagnostic(
    `no duplicate item across ${enumPaths.length} emitted enums, unchanged, renumbered and story contracts`,
  );
});
