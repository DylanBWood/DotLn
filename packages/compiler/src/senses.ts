import { compileLoadout, withLinkedSupports } from "./compile.js";
import type {
  AuthorityEnvelope,
  CompilationEnvironment,
  CompileResult,
  LoadoutGraph,
  SupportFacet,
} from "./types.js";

export const SENSE_IDS = [
  "beacon-sight",
  "fine-spectrum",
  "composition",
] as const;
export type SenseId = (typeof SENSE_IDS)[number];
export const BEACON_METADATA_CAPABILITY = "beacons.individual.metadata";
export const GROUP_METADATA_CAPABILITY = "beacons.group.metadata";

const support = (
  id: SenseId,
  name: string,
  capability: string,
  semantics: string,
): SupportFacet => ({
  supportFacetId: id,
  version: 1,
  name,
  supportedTags: ["observe"],
  requiredCapabilities: [capability],
  semanticsAdded: [semantics],
  semanticsModified: [],
  authorityChanges: [],
  evidenceRequirements: ["BeaconObserved"],
  resourceMultiplier: 1,
  conflictsWith: [],
  preservesDeterminism: true,
  commutativity: "commutative",
  emissions: [
    {
      kind: "evidence-schema",
      emissionId: `${id}.observation`,
      schemaId: `sense.${id}.v1`,
      schema: { event: "BeaconObserved", channel: id, contentReads: false },
    },
  ],
  claims: [],
  cost: {
    mechanismType: "evidence-schema",
    promptTokens: 0,
    runtimeCost: { quantity: 1, unit: "context-lines-per-sweep" },
    extraEpisodes: 0,
  },
  inspection: {
    restrictions: [
      "No authority change; host mount/path and Observe grant required",
    ],
    obligations: ["Record BeaconObserved"],
    passive: [semantics],
  },
});

export const beaconSenses = {
  "beacon-sight": support(
    "beacon-sight",
    "Beacon Sight",
    BEACON_METADATA_CAPABILITY,
    "Decode individual codebook v1/v2/v3 fields and coarse mtime; other channels are not-sensed",
  ),
  "fine-spectrum": support(
    "fine-spectrum",
    "Fine Spectrum",
    BEACON_METADATA_CAPABILITY,
    "Decode sub-second mtime in the separately rendered fine channel",
  ),
  composition: support(
    "composition",
    "Composition",
    GROUP_METADATA_CAPABILITY,
    "Decode only the mounted phase-group codebook through its separate family decoder",
  ),
} as const;

/** The host supplies authority; equipping a support does not edit its envelope. */
export function beaconSenseLoadout(
  senses: readonly SenseId[],
  authority: AuthorityEnvelope,
  audience: "public" | "verifier" = "public",
): LoadoutGraph {
  if (
    senses.some((id) => !SENSE_IDS.includes(id)) ||
    new Set(senses).size !== senses.length
  )
    throw new Error("invalid equipped senses");
  const graph: LoadoutGraph = {
    schemaVersion: 1,
    loadoutId: `beacon-${audience}-v1`,
    identity: {
      identityId: "beacon-observer",
      version: 1,
      name: "Beacon observer",
      dispositions: [],
      invariants: ["Metadata only"],
      updateLaws: [],
      lineage: [],
    },
    role: {
      roleId: audience,
      version: 1,
      name: audience,
      obligations: ["Record authorized perception"],
      permissions: [],
      objectives: ["Observe the declared Beacon set"],
      policyDeltas: [],
    },
    containers: [
      {
        containerId: "perception",
        version: 1,
        name: "Perception (helmet)",
        kind: "equipment",
        socketBudget: 4,
        activeMechanicIds: ["beacon-sweep"],
        supportFacetIds: SENSE_IDS,
      },
    ],
    activeMechanics: [
      {
        activeMechanicId: "beacon-sweep",
        version: 1,
        name: "Observe Beacons",
        tags: ["observe"],
        requiredCapabilities: [],
        semantics: ["Observe the host-declared metadata set"],
        authorityEnvelope: authority,
        workOrder: {
          workOrderId: "WO-BEACON-OBSERVE",
          objective: "Observe only mounted Beacon fields",
          acceptanceCriteria: [
            "Record one BeaconObserved per authorized sweep",
          ],
          knownFacts: [],
          decisions: [],
          constraints: [
            "No content, directory enumeration, xattrs, or implementer narrative",
          ],
          nonGoals: [],
          allowedOperations: [],
          prohibitedOperations: ["file.read", "directory.list", "xattr.read"],
          requiredEvidence: [],
          outputContract: { event: "BeaconObserved" },
        },
        inspection: {
          originalTerm: "Observe",
          translation: "Perception",
          kanji: "観測",
          rpgTitle: "Beacon sweep",
          grants: [],
          restrictions: ["Host grant required"],
          obligations: [],
          passive: [],
          pulse: [],
          interrupt: [],
        },
      },
    ],
    supportFacets: SENSE_IDS.map((id) => beaconSenses[id]),
    links: SENSE_IDS.map((id) => ({
      linkId: `sense-${id}`,
      linkGroupId: "perception-links",
      activeMechanicId: "beacon-sweep",
      supportFacetId: id,
    })),
    linkGroups: [
      {
        linkGroupId: "perception-links",
        containerId: "perception",
        linkIds: SENSE_IDS.map((id) => `sense-${id}`),
      },
    ],
    explicitPipelines: [],
    ambientEffects: [],
    polarAxes: [],
    resourceModel: {
      resourceModelId: "sense-context",
      version: 1,
      capacities: { contextLinesPerSweep: 3 },
      reservations: [],
    },
  };
  return withLinkedSupports(graph, senses);
}

export function compileBeaconSenses(
  senses: readonly SenseId[],
  environment: CompilationEnvironment,
  authority: AuthorityEnvelope,
  audience: "public" | "verifier" = "public",
): CompileResult {
  if (!senses.includes("beacon-sight"))
    return {
      ok: false,
      diagnostics: [
        {
          code: "ACTIVE INACTIVE",
          activeMechanicId: "beacon-sweep",
          message:
            "ACTIVE INACTIVE: Beacon sweep requires Beacon Sight; equip beacon-sight on the perception slot",
          missingCapabilities: ["equipped:beacon-sight"],
          corrections: [
            { kind: "provide-capability", capability: "equipped:beacon-sight" },
          ],
        },
      ],
    };
  return compileLoadout(
    beaconSenseLoadout(senses, authority, audience),
    environment,
  );
}
