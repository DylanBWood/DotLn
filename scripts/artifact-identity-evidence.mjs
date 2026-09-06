#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  canonicalStringify,
  compileLoadout,
  seiriEnvironment,
  seiriLoadout,
} from "@dotln/compiler";
import { decodeLog, encodeLog, replay } from "@dotln/kernel";
import { referenceStableHash } from "../corpus/harness/id-corpus-lib.mjs";
import {
  LiveReactorDriver,
  replayScenario,
  runScenario,
} from "../packages/skeleton/dist/src/scenario.js";
import {
  createLoadoutEquippedPayload,
  isArtifactRefusalType,
} from "../packages/skeleton/dist/src/artifact-identity.js";
import { projectAuditEvents } from "../packages/skeleton/dist/src/audit.js";
import {
  seiriPredicates,
  seiriReactor,
} from "../packages/skeleton/dist/src/reactor.js";
import { entropyReducerLoadout } from "../packages/skeleton/dist/src/loadouts/entropy-reducer.js";

const mode = process.argv.slice(2);
if (mode.length !== 1 || !["--write", "--check"].includes(mode[0])) {
  console.error(
    "usage: artifact-identity-evidence.mjs --write|--check (run npm run build first)",
  );
  process.exit(2);
}
const root = new URL("../", import.meta.url);
// Compiler 0.4.0 gets a new current evidence edition. WO-029's observed
// receipts and frozen baseline remain historical bytes, not mutable goldens.
const evidenceDirectory = "docs/evidence/WO-022/artifact-identity";
const read = (path) => readFileSync(new URL(path, root), "utf8");
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const baseline = JSON.parse(read("docs/evidence/WO-029/baseline.json"));
const oracleHash = createHash("sha256")
  .update(read("packages/skeleton/fixtures/wo003-decision-traces.json"))
  .digest("hex");
assert.equal(
  oracleHash,
  baseline.frozenOracleSha256,
  "the frozen oracle changed",
);
const inventory = baseline.fixtures.map((fixture) => {
  const graph =
    fixture.name === "seiri"
      ? seiriLoadout
      : entropyReducerLoadout(fixture.episodeEndsAt);
  const compiled = compileLoadout(graph, fixture.environment);
  assert.ok(compiled.ok);
  assert.equal(compiled.semanticHash, fixture.semanticHash);
  assert.equal(
    compiled.semanticHash,
    `fnv1a64:${referenceStableHash(canonicalStringify(compiled.program))}`,
  );
  return {
    fixture: fixture.name,
    before: {
      compilerPackageVersion: baseline.compilerPackageVersion,
      semanticHash: fixture.semanticHash,
    },
    after: {
      compilerPackageVersion: compiled.artifactIdentity.compilerPackageVersion,
      semanticHash: compiled.semanticHash,
    },
    componentDefinitionCount:
      compiled.artifactIdentity.componentDefinitions.length,
    environment: fixture.environment,
    authorityExpiresAt: compiled.artifactIdentity.authorityExpiresAt,
    unchanged: true,
    independentOracle: "WO-101 referenceStableHash (32-bit pairs, no BigInt)",
  };
});
const fixture = JSON.parse(read("packages/skeleton/fixtures/repo-tree.json"));
const scenario = runScenario(fixture);
assert.deepEqual(replayScenario(scenario.log).decisions, scenario.decisions);
const draft = (type, payload, at = 1_200_000) => ({
  schemaVersion: 1,
  type,
  occurredAt: at,
  actorId: "repo-gardener",
  workstreamId: "ws_repo_garden",
  episodeId: "ep_seiri_1",
  payload,
});
const pulse = draft("CadencePulse", { scheduleId: "schedule_seiri_20m" });
const generated = createLoadoutEquippedPayload(
  seiriLoadout,
  seiriEnvironment(),
);
assert.ok(generated.ok);
const transcripts = [];
const capture = (name, setup, driver, step) => {
  assert.deepEqual(step.decision.intents, []);
  assert.deepEqual(step.decision.schedules, []);
  const events = decodeLog(driver.log);
  const refusals = events.filter((event) => isArtifactRefusalType(event.type));
  assert.ok(refusals.length > 0);
  assert.deepEqual(replayScenario(driver.log).decisions, driver.decisions);
  transcripts.push({
    name,
    setup,
    eventTypes: events.map((event) => event.type),
    decision: step.decision.trace,
    refusalEvents: refusals,
    usableAuthority: driver.state.authority !== null,
    comparisonReceipts:
      projectAuditEvents(events).receipt.artifactIdentity.records,
  });
};
for (const [name, patch] of [
  ["compiler-contract-drift", { compilerContractVersion: "future-contract" }],
  ["compiler-package-drift", { compilerPackageVersion: "0.0.0" }],
  ["semantic-hash-drift", { semanticHash: "fnv1a64:0000000000000000" }],
  [
    "component-definition-drift",
    {
      componentDefinitions:
        generated.payload.artifactIdentity.componentDefinitions.map(
          (entry, index) =>
            index === 0
              ? { ...entry, definitionHash: "fnv1a64:0000000000000000" }
              : entry,
        ),
    },
  ],
]) {
  const driver = new LiveReactorDriver();
  const step = driver.feed(
    draft("LoadoutEquipped", {
      ...generated.payload,
      artifactIdentity: { ...generated.payload.artifactIdentity, ...patch },
    }),
  );
  capture(
    name,
    "Seiri v2 equip with a synthetic stale identity axis",
    driver,
    step,
  );
}
{
  const driver = new LiveReactorDriver();
  const step = driver.feed(
    draft("LoadoutEquipped", {
      ...generated.payload,
      graph: {
        ...seiriLoadout,
        activeMechanics: seiriLoadout.activeMechanics.map((active) => ({
          ...active,
          semantics: [...active.semantics, "changed after compilation"],
        })),
      },
    }),
  );
  capture(
    "stale-pin",
    "changed Seiri graph paired with the original v2 identity",
    driver,
    step,
  );
}
{
  const driver = new LiveReactorDriver();
  const step = driver.equip({ ...seiriLoadout, activeMechanics: [] });
  capture("compile-diagnostics", "Seiri with no active mechanic", driver, step);
}
{
  const driver = new LiveReactorDriver();
  capture(
    "pre-equip",
    "primary pulse before equip",
    driver,
    driver.feed(pulse),
  );
}
{
  const driver = new LiveReactorDriver();
  driver.equip(seiriLoadout);
  capture(
    "unknown-schedule",
    "valid Seiri equip; pulse id absent from the current compilation",
    driver,
    driver.feed(draft("CadencePulse", { scheduleId: "retired.schedule" })),
  );
}
{
  const legacy = read("packages/skeleton/fixtures/wo029-legacy-scenario.jsonl");
  const driver = new LiveReactorDriver();
  driver.restore(legacy);
  driver.ensureIdentityEnforcement(2_000_000);
  driver.ensureIdentityEnforcement(2_000_000);
  capture(
    "legacy-after-boundary",
    "replay the preserved legacy fixture, start enforcement twice, then feed a pulse",
    driver,
    driver.feed(draft(pulse.type, pulse.payload, 2_000_000)),
  );
  transcripts.push({
    name: "legacy-before-boundary",
    verified: replayScenario(legacy).verified,
    identity: projectAuditEvents(decodeLog(legacy)).receipt.artifactIdentity,
    frozenOracleSha256: oracleHash,
    canonicalBoundaryCount: decodeLog(driver.log).filter(
      (event) => event.type === "ArtifactIdentityEnforcementStarted",
    ).length,
  });
  const recovery = runScenario(fixture, {
    crashAfterPersist: true,
    recoveryLogTransform: () => encodeLog(decodeLog(legacy).slice(0, 8)),
  });
  assert.equal(recovery.adapterEffects, 0);
  transcripts.push({
    name: "legacy-recovery-refused",
    adapterEffects: recovery.adapterEffects,
    events: decodeLog(recovery.log).slice(8),
    identity: projectAuditEvents(decodeLog(recovery.log)).receipt
      .artifactIdentity,
  });
}
{
  const driver = new LiveReactorDriver();
  assert.throws(
    () => driver.feed(draft("LoadoutEquipped", seiriLoadout)),
    /requires payloadVersion: 2/u,
  );
  transcripts.push({
    name: "factory-shape",
    rejectedLegacyInput: true,
    appendedEvents: decodeLog(driver.log),
  });
  const changed = {
    ...seiriLoadout,
    activeMechanics: seiriLoadout.activeMechanics.map((active) => ({
      ...active,
      semantics: [
        ...active.semantics,
        "writer replaces graph and pin together",
      ],
    })),
  };
  driver.equip(changed);
  assert.equal(driver.state.artifactIdentityBlocked, false);
  transcripts.push({
    name: "rewritten-pair",
    accepted: true,
    assurance: "equality does not authenticate the writer",
    identity: projectAuditEvents(decodeLog(driver.log)).receipt
      .artifactIdentity,
  });
}
{
  const driver = new LiveReactorDriver();
  driver.equip(seiriLoadout);
  const state = {
    ...driver.state,
    compilationEnvironment: {
      ...seiriEnvironment(),
      repo: "/relocated/repository",
    },
  };
  const result = replay(
    state,
    [{ ...pulse, eventId: "evt_relocation_probe" }],
    seiriReactor,
    seiriPredicates,
  );
  assert.equal(
    result.decisions[0].continuation.event.type,
    "ArtifactIdentityDrift",
  );
  driver.equip(seiriLoadout, state.compilationEnvironment);
  transcripts.push({
    name: "relocation",
    setup:
      "change only the recorded compilation environment's repo, then explicitly re-equip",
    refusal: result.decisions[0].continuation.event,
    newEquip: projectAuditEvents(
      decodeLog(driver.log),
    ).receipt.artifactIdentity.records.at(-1),
  });
}
const files = new Map([
  [
    "semantic-hash-inventory.json",
    json({
      schemaVersion: 1,
      frozenOracleSha256: oracleHash,
      fixtures: inventory,
    }),
  ],
  ["scenario.jsonl", scenario.log],
  ["audit.json", json(projectAuditEvents(decodeLog(scenario.log)))],
  [
    "negative-transcripts.json",
    json({ schemaVersion: 1, synthetic: true, transcripts }),
  ],
]);
for (const [name, bytes] of files) {
  const path = `${evidenceDirectory}/${name}`;
  if (mode[0] === "--write") {
    mkdirSync(new URL(`${evidenceDirectory}/`, root), { recursive: true });
    writeFileSync(new URL(path, root), bytes);
  } else if (read(path) !== bytes) {
    console.error(
      `stale artifact evidence: ${path}; inspect the change before regenerating with --write`,
    );
    process.exitCode = 1;
  }
}
if (!process.exitCode)
  console.log(
    `${mode[0] === "--write" ? "Recorded" : "Verified"} ${files.size} current artifact evidence files in ${evidenceDirectory}; original semantic hashes and frozen oracle unchanged.`,
  );
