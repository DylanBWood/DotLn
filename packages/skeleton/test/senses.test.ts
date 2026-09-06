import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  chmodSync,
  closeSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
  writeSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { appendEvent, decodeLog, type JsonValue } from "@dotln/kernel";
import { SENSE_IDS } from "@dotln/compiler";
import {
  observeBeaconSweep,
  projectBeaconSparseTwin,
  replayBeaconSweep,
} from "../src/beacon-observe.js";
import { renderBeaconPerception } from "../src/beacon-perception.js";
import {
  beaconSessionMount,
  controlBeaconAddress,
  emitControlBeacon,
  issueBeaconSession,
  prepareBeaconDisposal,
  restrictedBeaconBriefing,
} from "../src/control-beacon-fs.mjs";
import { createBeaconKey, openBeaconKey } from "../src/beacon-provenance.mjs";
import {
  encodeControlBeacon,
  encodeGroupBeacon,
} from "../src/control-codebook.mjs";
import { encodeBeaconState, framedSize } from "../src/beacon-codebook.mjs";
import { initialState, seiriPredicates, seiriReactor } from "../src/reactor.js";
import { writeBeaconFile } from "../src/beacon-io.mjs";
import { createWorkerFixture } from "../src/worker-demo.js";
import {
  LiveReactorDriver,
  FakeExecutor,
  finishScenario,
  replayScenario,
  startScenario,
  type FixtureTree,
} from "../src/scenario.js";
import {
  MountedBeaconVerifier,
  evaluateBeaconVerification,
  type BeaconVerifierInput,
} from "../src/beacon-verifier.js";
import type { BeaconPerceptionProfile } from "../src/execution-environment.js";
import type {
  BeaconSweepRequest,
  ControlProjectionRecord,
} from "../src/control-beacon.js";

const repository = fileURLToPath(new URL("../../../../", import.meta.url));
const now = 1200500;
const record: ControlProjectionRecord = {
  recordType: "control-beacon-projection",
  codebookVersion: 2,
  workOrderId: "WO-099",
  phase: "verifying",
  latestVerdict: "unknown",
  effort: "max",
  provenance: "host-projected",
  recordedAt: "1970-01-01T00:20:00.123Z",
};
const requestFor = (profile?: BeaconPerceptionProfile): BeaconSweepRequest => ({
  intent: { kind: "Observe", subject: "control-beacons" },
  audience: "verifier",
  senses: ["beacon-sight"],
  ...(profile ? { environment: profile } : {}),
  staleAfterMs: 1200000,
  authority: {
    authorityEnvelopeId: "fixture-verifier-envelope",
    allowedEffects: ["observe.beacons.verifier"],
    deniedEffects: [],
    resourceLimits: { beaconSweeps: 1 },
    requiredEvidence: [],
    expiresAt: 2400000,
    revocationEventTypes: [],
  },
  evidence: [],
  revokedBy: [],
});
const fixture: FixtureTree = {
  files: [
    {
      path: "generated.tmp",
      classification: "generated-stale",
      referencedBy: [],
    },
  ],
};

function provision(t: { after: (fn: () => void) => void }) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-senses-")));
  const repo = join(root, "repository");
  createWorkerFixture(repo, fixture);
  writeFileSync(join(repo, ".gitignore"), ".control-beacons/\n");
  const keyFile = join(root, "host-key");
  createBeaconKey(keyFile, repo);
  const key = openBeaconKey(keyFile, repo);
  const token = issueBeaconSession(repo, record.workOrderId);
  const mount = beaconSessionMount(repo, record.workOrderId, token);
  t.after(() => {
    prepareBeaconDisposal(repo);
    rmSync(root, { recursive: true, force: true });
  });
  const storage = emitControlBeacon(repo, record, { key });
  const profile: BeaconPerceptionProfile = {
    profileId: "beacon-perception-v1",
    audience: "verifier",
    mounts: [mount],
    modelTools: [],
    writableSurfaces: [],
    narrativeSurfaces: [],
  };
  return { root, repo, keyFile, key, token, mount, profile, storage };
}

test("WO-022 AC2/3 affordance and permission guard agree; no sense or grant yields an event with zero reads", (t) => {
  const host = provision(t);
  const request = requestFor(host.profile);
  assert.equal(projectBeaconSparseTwin(request, now).actions.length, 1);
  const restore = prepareBeaconDisposal(host.repo);
  assert.equal(lstatSync(host.mount.path).mode & 0o777, 0o700);
  restore();
  assert.equal(lstatSync(host.mount.path).mode & 0o777, 0o111);
  let reads = 0;
  for (const denied of [
    { ...request, senses: [] },
    requestFor(),
    { ...request, senses: ["beacon-sight", "beacon-sight"] as const },
    { ...request, authority: { ...request.authority, allowedEffects: [] } },
    {
      ...request,
      authority: { ...request.authority, deniedEffects: ["observe.*"] },
    },
    { ...request, authority: { ...request.authority, expiresAt: now } },
    {
      ...request,
      authority: { ...request.authority, resourceLimits: { beaconSweeps: 0 } },
    },
    {
      ...request,
      authority: { ...request.authority, requiredEvidence: ["missing"] },
    },
    {
      ...request,
      environment: {
        ...host.profile,
        modelTools: ["shell"],
      } as unknown as BeaconPerceptionProfile,
    },
  ]) {
    assert.deepEqual(projectBeaconSparseTwin(denied, now).actions, []);
    const refused = observeBeaconSweep("", denied, now, () => {}, {
      read: () => {
        reads++;
        throw new Error("forbidden metadata read");
      },
    });
    assert.equal(refused.authorized, false);
    assert.equal(reads, 0);
    const events = decodeLog(refused.log);
    assert.deepEqual(
      events.map(({ type }) => type),
      ["BeaconSweepRequested", "CommandRefused"],
    );
    assert.equal(
      (events[1]!.payload as { authorityEnvelopeId: string })
        .authorityEnvelopeId,
      request.authority.authorityEnvelopeId,
    );
    assert.deepEqual(
      replayBeaconSweep(refused.log).decisions,
      refused.decisions,
    );
  }
  const allowed = projectBeaconSparseTwin(request, now);
  t.diagnostic(
    `sparse twin: unequipped actions=[]; equipped actions=${JSON.stringify(allowed.actions)}; nine refusal cases, zero metadata reads; envelope=fixture-verifier-envelope`,
  );
});

test("WO-022 legacy v1/v2 sensing is unauthenticated and pre-sense replay retains the unknown tag-3 meaning", (t) => {
  const host = provision(t);
  const directory = join(host.root, "legacy");
  const v1 = {
    codebookVersion: 1 as const,
    actionClass: "verification" as const,
    outcome: "passed",
    refusalCount: 0,
    provenance: "self-reported" as const,
  };
  const v2 = { ...record };
  const addresses = [controlBeaconAddress("v1"), controlBeaconAddress("v2")];
  for (const [index, size] of [
    encodeBeaconState(v1),
    encodeControlBeacon(v2),
  ].entries())
    writeBeaconFile(
      directory,
      addresses[index]!,
      { size, mtimeMs: now, content: "legacy" },
      { ...host.storage, sparse: false },
    );
  const profile: BeaconPerceptionProfile = {
    ...host.profile,
    mounts: [
      {
        mountId: "legacy",
        path: directory,
        access: "beacon-metadata",
        family: "individual",
        addresses,
      },
    ],
  };
  const sensed = observeBeaconSweep("", requestFor(profile), now, () => {}, {
    key: host.key,
  });
  assert.ok(sensed.authorized);
  assert.deepEqual(
    sensed.observations.map((item) => item.provenanceCheck),
    ["unauthenticated-legacy", "unauthenticated-legacy"],
  );
  assert.deepEqual(sensed.observations[0]?.decoded, {
    status: "decoded",
    state: v1,
  });
  const {
    senses: _senses,
    environment: _environment,
    ...legacyRequest
  } = requestFor();
  const base = {
    schemaVersion: 1 as const,
    occurredAt: now,
    actorId: "beacon-observer",
    workstreamId: "ws_beacon_control",
    episodeId: "ep_beacon_sweep",
  };
  const requested = appendEvent("", {
    ...base,
    type: "BeaconSweepRequested",
    payload: { ...legacyRequest, decisionIndex: 0 } as unknown as JsonValue,
  });
  const prior = initialState();
  const decision = seiriReactor(prior, requested.event, {
    now,
    rngState: prior.rngState,
    policy: prior.policy,
    predicates: seiriPredicates,
  });
  const authorization = (
    decision.state.beaconSweep as unknown as {
      authorization: { command: { commandId: string } };
    }
  ).authorization;
  const persisted = appendEvent(requested.log, {
    ...base,
    type: "CommandPersisted",
    payload: { command: authorization.command },
  });
  const observed = appendEvent(persisted.log, {
    ...base,
    type: "BeaconObserved",
    payload: {
      commandId: authorization.command.commandId,
      sweptAt: now,
      observations: [
        {
          address: "legacy-future-tag",
          size: String(framedSize(3n)),
          mtimeMs: now,
          decoded: { status: "unknown-codebook", codebookVersion: 3 },
        },
      ],
    },
  });
  assert.equal(
    replayBeaconSweep(observed.log).state.beaconObservations[0]?.decoded.status,
    "unknown-codebook",
  );
  assert.throws(
    () =>
      new LiveReactorDriver().feed({
        ...base,
        type: "BeaconSweepRequested",
        payload: legacyRequest as unknown as JsonValue,
      }),
    /perceptionVersion/,
  );
  t.diagnostic(
    "legacy v1/v2 fields preserved and labeled unauthenticated-legacy; pre-WO-022 tag 3 remains unknown on replay; new live input cannot select that bypass",
  );
});

test("WO-022 AC4/6/7 exact metadata-only channels; search-only listing refusal and no extra names/content/xattrs", (t) => {
  const host = provision(t);
  const path = join(host.mount.path, host.mount.addresses[0]!);
  assert.equal(lstatSync(host.mount.path).mode & 0o777, 0o111);
  assert.throws(() => readdirSync(host.mount.path), { code: "EACCES" });
  assert.ok(lstatSync(path).isFile());
  assert.ok(
    restrictedBeaconBriefing(
      host.repo,
      record.workOrderId,
      host.token,
    ).includes(host.mount.path),
  );
  assert.throws(
    () => restrictedBeaconBriefing(host.repo, "WO-098", host.token),
    /not authorized/,
  );
  const forbidden = "synthetic-implementer-prose-and-xattr";
  const fd = openSync(path, "r+");
  try {
    writeSync(fd, forbidden);
  } finally {
    closeSync(fd);
  }
  if (process.platform === "darwin")
    execFileSync("xattr", ["-w", "org.dotln.sense-fixture", forbidden, path]);
  chmodSync(path, 0o000);
  assert.throws(() => readFileSync(path), { code: "EACCES" });
  const groupDir = join(host.root, "groups");
  const groupAddress = controlBeaconAddress("fixture-group");
  writeBeaconFile(
    groupDir,
    groupAddress,
    {
      size: encodeGroupBeacon([0, 0, 1, 0, 0, 0, 0, 0]),
      mtimeMs: now,
      content: "",
    },
    host.storage,
  );
  const profile: BeaconPerceptionProfile = {
    ...host.profile,
    mounts: [
      ...host.profile.mounts,
      {
        mountId: "group",
        path: groupDir,
        access: "beacon-metadata",
        family: "phase-group",
        addresses: [groupAddress],
      },
    ],
  };
  // The extra file is outside the declared set. No directory enumeration can
  // leak it, even though the trusted host can create it.
  chmodSync(host.mount.path, 0o700);
  writeFileSync(
    join(host.mount.path, "unrelated-name-and-narrative"),
    forbidden,
  );
  chmodSync(host.mount.path, 0o111);
  chmodSync(groupDir, 0o000); // Unequipped Composition must never touch it.
  let durable = "";
  const coarse = observeBeaconSweep(
    "",
    requestFor(profile),
    now,
    (log) => {
      durable = log;
    },
    { key: host.key },
  );
  chmodSync(groupDir, 0o700);
  assert.ok(coarse.authorized);
  assert.equal(coarse.observations.length, 1);
  assert.equal(coarse.observations[0]?.mtimeNs, undefined);
  assert.equal(coarse.observations[0]?.mtimeMs! % 1000, 0);
  assert.equal(coarse.observations[0]?.fineSpectrum, "not-sensed");
  assert.equal(coarse.observations[0]?.provenanceCheck, "residue-matched");
  assert.equal(coarse.groups, "not-sensed");
  assert.equal(renderBeaconPerception(coarse).split("\n").length, 1);
  const all = observeBeaconSweep(
    "",
    { ...requestFor(profile), senses: SENSE_IDS },
    now,
    (log) => {
      durable = log;
    },
    { key: host.key },
  );
  assert.ok(all.authorized);
  assert.equal(
    all.observations[0]?.mtimeNs,
    String(lstatSync(path, { bigint: true }).mtimeNs),
  );
  assert.ok(Array.isArray(all.groups));
  assert.equal(all.groups.length, 1);
  assert.deepEqual(all.groups[0]?.decoded, {
    status: "decoded",
    state: { groupCodebookVersion: 1, counts: [0, 0, 1, 0, 0, 0, 0, 0] },
  });
  assert.equal(renderBeaconPerception(all).split("\n").length, 3);
  assert.deepEqual(replayBeaconSweep(all.log).decisions, all.decisions);
  for (const patch of [
    { mtimeNs: forbidden },
    { mtimeNs: "0" },
    { mtimeMs: forbidden },
    { size: forbidden },
    { xattrs: forbidden },
  ]) {
    const tampered = all.log
      .trimEnd()
      .split("\n")
      .map((line) => {
        const event = JSON.parse(line);
        if (event.type === "BeaconObserved")
          Object.assign(event.payload.observations[0], patch);
        return JSON.stringify(event);
      })
      .join("\n");
    assert.throws(
      () => replayBeaconSweep(tampered + "\n"),
      /BeaconObserved contains (invalid metadata values|unsensed fields)/,
    );
  }
  assert.equal(
    decodeLog(durable).filter(({ type }) => type === "BeaconObserved").length,
    1,
  );
  const secret = (
    JSON.parse(readFileSync(host.keyFile, "utf8")) as { key: string }
  ).key;
  for (const excluded of [
    host.mount.path,
    host.token,
    secret,
    forbidden,
    "unrelated-name-and-narrative",
    "org.dotln.sense-fixture",
  ])
    assert.ok(
      !durable.includes(excluded),
      "a non-codebook/private field escaped into observation evidence",
    );
  const types = decodeLog(durable).map(({ type }) => type);
  assert.deepEqual(types, [
    "BeaconSweepRequested",
    "CommandPersisted",
    "BeaconObserved",
    "CommandResult",
  ]);
  t.diagnostic(
    "0111 directory: listing=EACCES, known-name lstat=allowed; mode-000 garbage content and xattr do not affect the codeword; coarse=1 line, all senses=3 lines; one BeaconObserved; content, extra names, xattrs, paths, capability and key excluded",
  );
});

test("WO-022 AC5 a mounted Beacon Sight verifier completes the skeleton with no implementer prose in its inputs", (t) => {
  const host = provision(t);
  const driver = new LiveReactorDriver();
  const opening = startScenario(driver);
  const narrative = "SYNTHETIC_IMPLEMENTER_NARRATIVE_MUST_NOT_REACH_VERIFIER";
  driver.feed({
    schemaVersion: 1,
    type: "ImplementerNarrative",
    occurredAt: now - 10,
    actorId: "fake-executor",
    workstreamId: opening.command.workstreamId,
    payload: { narrative },
  });
  const candidates = new FakeExecutor(fixture)
    .dispatch(opening.command)
    .map((candidate) => ({
      ...candidate,
      evidence: [...candidate.evidence, narrative],
    }));
  const result = driver.feed({
    schemaVersion: 1,
    type: "CommandResult",
    occurredAt: now - 9,
    actorId: "fake-executor",
    workstreamId: opening.command.workstreamId,
    episodeId: opening.command.episodeId!,
    correlationId: opening.command.commandId,
    causationId: opening.persisted.event.eventId,
    payload: {
      commandId: opening.command.commandId,
      result: "candidates",
      candidates,
      summary: narrative,
    } as unknown as JsonValue,
  });
  let inputs: BeaconVerifierInput | undefined;
  const verifier = new MountedBeaconVerifier({
    request: requestFor(host.profile),
    fixture,
    key: host.key,
    evaluate: (input) => {
      inputs = input;
      return evaluateBeaconVerification(input);
    },
  });
  const completed = finishScenario(
    driver,
    fixture,
    opening,
    result,
    () => now,
    verifier,
  );
  assert.ok(completed.verified);
  assert.ok(inputs);
  assert.ok(
    completed.log.includes(narrative),
    "the host really retained the implementer narrative",
  );
  assert.ok(
    !JSON.stringify(inputs).includes(narrative),
    "actual verifier inputs contain no implementer prose",
  );
  assert.ok(
    !JSON.stringify(inputs).includes(host.mount.path),
    "private mount paths stay in the host",
  );
  assert.deepEqual(Object.keys(inputs).sort(), [
    "candidatePaths",
    "episodeId",
    "inventory",
    "perception",
  ]);
  assert.equal(
    inputs.perception.observations[0]?.provenanceCheck,
    "residue-matched",
  );
  assert.equal(
    decodeLog(completed.log).filter(({ type }) => type === "BeaconObserved")
      .length,
    1,
  );
  assert.deepEqual(
    replayScenario(completed.log).decisions,
    completed.decisions,
  );
  t.diagnostic(
    "walking skeleton VerificationCompleted accepted=true; verifier received candidate paths, independent inventory fields and Beacon perception only; implementer narrative remained in host log and was absent from every verifier input",
  );
});

test("WO-022 AC8 canonical control-log re-derivation uses the same host v3 writer and key", (t) => {
  const host = provision(t);
  const controlPath = join(host.repo, "docs/control/orders/WO-099.jsonl");
  mkdirSync(join(host.repo, "docs/control/orders"), { recursive: true });
  const log =
    JSON.stringify({
      schemaVersion: 1,
      type: "WorkOrderActivated",
      workOrderId: "WO-099",
      workOrderPath: "docs/work-orders/WO-099-fixture.md",
      recordedAt: record.recordedAt,
      effortDeclarationValidated: true,
    }) + "\n";
  writeFileSync(controlPath, log);
  const source = `
    import { readControl } from ${JSON.stringify(new URL("scripts/lib/control-store.mjs", `file://${repository}`).href)};
    import { projectControlBeacon } from ${JSON.stringify(new URL("scripts/lib/beacons.mjs", `file://${repository}`).href)};
    const root = process.argv[1];
    const state = readControl(root).orders.get("WO-099").state;
    projectControlBeacon(root, state, ${JSON.stringify(record.recordedAt)});
  `;
  const rederive = () =>
    execFileSync(
      process.execPath,
      ["--input-type=module", "-e", source, host.repo],
      {
        env: { ...process.env, DOTLN_BEACON_KEY_FILE: host.keyFile },
        stdio: "pipe",
      },
    );
  rederive();
  const path = join(host.mount.path, controlBeaconAddress(record.workOrderId));
  const before = lstatSync(path, { bigint: true });
  const first = observeBeaconSweep(
    "",
    requestFor(host.profile),
    now,
    () => {},
    { key: host.key },
  );
  assert.ok(first.authorized);
  assert.equal(first.observations[0]?.provenanceCheck, "residue-matched");
  rederive();
  const after = lstatSync(path, { bigint: true });
  assert.notEqual(after.ino, before.ino);
  assert.equal(after.size, before.size);
  assert.equal(after.mtimeNs, before.mtimeNs);
  const second = observeBeaconSweep(
    "",
    requestFor(host.profile),
    now,
    () => {},
    { key: openBeaconKey(host.keyFile, host.repo) },
  );
  assert.ok(second.authorized);
  assert.deepEqual(first.observations, second.observations);
  assert.equal(readFileSync(controlPath, "utf8"), log);
  t.diagnostic(
    "canonical control JSONL folded twice; production lifecycle emitter re-derived identical v3 state/size/mtime and residue; both sweeps matched; control log unchanged",
  );
});
