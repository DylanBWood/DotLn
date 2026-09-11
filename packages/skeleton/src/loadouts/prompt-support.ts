import type { SupportFacet } from "@dotln/compiler";

export const promptSupport = (
  supportFacetId: string,
  name: string,
  text: string,
): SupportFacet => ({
  supportFacetId,
  version: 1,
  name,
  supportedTags: ["mutate"],
  requiredCapabilities: [],
  semanticsAdded: [text],
  semanticsModified: [],
  authorityChanges: [],
  evidenceRequirements: [],
  resourceMultiplier: 1,
  conflictsWith: [],
  preservesDeterminism: true,
  commutativity: "commutative",
  emissions: [{ kind: "prompt-fragment", emissionId: supportFacetId, text }],
  claims: [],
  cost: {
    mechanismType: "prompt-fragment",
    // Declared UTF-8 text/4 estimate, never an observed session token count.
    promptTokens: Math.ceil(new TextEncoder().encode(text).length / 4),
    runtimeCost: { quantity: 0, unit: "additional-host-check" },
    extraEpisodes: 0,
  },
  inspection: { passive: [name] },
});
