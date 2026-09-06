import test from "node:test";
import assert from "node:assert/strict";
import {
  BEACON_METADATA_CAPABILITY,
  GROUP_METADATA_CAPABILITY,
  beaconSenses,
  compileBeaconSenses,
} from "../src/index.js";

const authority = {
  authorityEnvelopeId: "sense-fixture",
  allowedEffects: ["observe.beacons.verifier"],
  deniedEffects: [],
  resourceLimits: { beaconSweeps: 1 },
  requiredEvidence: [],
  expiresAt: 2000,
  revocationEventTypes: [],
};
const environment = {
  environmentId: "fixture",
  version: 1,
  capabilities: [] as string[],
  repo: "fixture",
  baseCommit: "fixture-base",
};

test("WO-022 AC1 missing Beacon mount reports SUPPORT INACTIVE with an actionable correction; grants preserve authority", (t) => {
  assert.equal(compileBeaconSenses([], environment, authority).ok, false);
  const missing = compileBeaconSenses(
    ["beacon-sight"],
    environment,
    authority,
    "verifier",
  );
  assert.ok(!missing.ok);
  assert.equal(missing.diagnostics[0]?.code, "SUPPORT INACTIVE");
  assert.deepEqual(missing.diagnostics[0]?.missingCapabilities, [
    BEACON_METADATA_CAPABILITY,
  ]);
  assert.ok(
    missing.diagnostics[0]?.corrections.some(
      (correction) =>
        correction.kind === "provide-capability" &&
        correction.capability === BEACON_METADATA_CAPABILITY,
    ),
  );
  const equipped = compileBeaconSenses(
    ["beacon-sight", "fine-spectrum", "composition"],
    {
      ...environment,
      capabilities: [BEACON_METADATA_CAPABILITY, GROUP_METADATA_CAPABILITY],
    },
    authority,
    "verifier",
  );
  assert.ok(equipped.ok);
  assert.deepEqual(equipped.program.authorityEnvelope, {
    ...authority,
    revocationConditions: [],
  });
  assert.equal(
    equipped.program.supportCosts.reduce(
      (n, item) => n + item.runtimeCost.quantity,
      0,
    ),
    3,
  );
  assert.ok(
    equipped.program.supportCosts.every(
      (item) =>
        item.runtimeCost.unit === "context-lines-per-sweep" &&
        item.promptTokens === 0,
    ),
  );
  assert.deepEqual(equipped.program.promptFragments, []);
  for (const facet of Object.values(beaconSenses)) {
    assert.deepEqual(facet.authorityChanges, []);
    assert.deepEqual(facet.supportedTags, ["observe"]);
    assert.deepEqual(facet.evidenceRequirements, ["BeaconObserved"]);
  }
  t.diagnostic(
    `${missing.diagnostics[0]?.message} Correction: provide-capability ${BEACON_METADATA_CAPABILITY}`,
  );
  t.diagnostic(
    "all three active; authority unchanged; measured rendering contract: 1 context line per equipped channel, 0 prompt fragments",
  );
});
