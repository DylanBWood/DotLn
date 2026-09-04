import test from "node:test";
import assert from "node:assert/strict";
import {
  compileLoadout,
  seiriEnvironment,
  seiriLoadout,
  type AuthorityEnvelope,
  type Identity,
  type LoadoutGraph,
  type Phenotype,
  type PolarAxis,
  type Role,
} from "../src/index.js";

const identity: Identity = seiriLoadout.identity;
const role: Role = seiriLoadout.role;
const authority: AuthorityEnvelope =
  seiriLoadout.activeMechanics[0]!.authorityEnvelope;
const axis: PolarAxis = {
  polarAxisId: "research-execute",
  version: 1,
  negativePole: "research",
  positivePole: "execute",
  relation: "counterweight",
  baselineOdds: 1,
  factors: [{ sourceId: "role", oddsMultiplier: 1 }],
};
const fullSurface: LoadoutGraph = {
  ...seiriLoadout,
  ambientEffects: [
    {
      ambientEffectId: "quiet-context",
      version: 1,
      name: "Quiet context",
      scope: "episode",
      reservationCost: { attention: 1 },
      emissions: [
        {
          kind: "prompt-fragment",
          emissionId: "quiet-context.fragment",
          text: "Keep the residue bounded.",
        },
      ],
    },
  ],
  resourceModel: {
    ...seiriLoadout.resourceModel,
    capacities: { inspections: 1, attention: 2 },
    reservations: [
      {
        reservationId: "quiet-context.attention",
        resource: "attention",
        quantity: 1,
        sourceId: "quiet-context",
      },
    ],
  },
  polarAxes: [axis],
};

test("WO-008 public types cover the full LoadoutGraph surface while PolarAxis evaluation remains deferred", () => {
  const result = compileLoadout(fullSurface, seiriEnvironment());
  assert.equal(result.ok, true);
  if (!result.ok) assert.fail("full typed graph did not compile");
  const phenotype: Phenotype = result.program.phenotype;
  assert.equal(identity.identityId, phenotype.identityId);
  assert.equal(role.roleId, phenotype.roleId);
  assert.equal(authority.authorityEnvelopeId, "auth_seiri");
  assert.deepEqual(phenotype.polarAxes, [axis]);
  assert.equal(
    result.program.ambientEffects[0]?.ambientEffectId,
    "quiet-context",
  );
  assert.deepEqual(result.program.resourceModel.reservations, [
    {
      reservationId: "quiet-context.attention",
      resource: "attention",
      quantity: 1,
      sourceId: "quiet-context",
    },
  ]);
});
