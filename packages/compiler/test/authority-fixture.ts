import {
  seiriLoadout,
  seiriSupports,
  type AuthorityGrant,
  type LoadoutGraph,
  type PrecedenceLayer,
  type SupportFacet,
} from "../src/index.js";

export const authorityGrant: AuthorityGrant = {
  grantId: "fixture.delete",
  version: 1,
  grantedBy: "operator",
  effects: ["repo.delete"],
  operations: ["repo.delete"],
  repo: "packages/skeleton/fixtures/repo-tree.json",
  reason: "Explicit deletion authority in an isolated fixture",
};

export const authoritySupport = (
  id: string,
  layer: PrecedenceLayer = "hard-permissions",
  value: "allow" | "deny" = "deny",
  effect = "repo.inspect",
): SupportFacet => ({
  ...seiriSupports.repositoryScope,
  supportFacetId: id,
  requiredCapabilities: [],
  semanticsAdded: [],
  emissions: [],
  claims: [
    {
      claimId: `${id}.claim`,
      target: `authority.${effect}`,
      value,
      layer,
      hard: false,
    },
  ],
  inspection: {},
});

export const authorityFixture = (
  supports: readonly SupportFacet[] = [],
  grants: readonly AuthorityGrant[] = [],
): LoadoutGraph => {
  const active = seiriLoadout.activeMechanics[0]!;
  const links = supports.map((support) => ({
    linkId: support.supportFacetId,
    activeMechanicId: active.activeMechanicId,
    supportFacetId: support.supportFacetId,
    linkGroupId: "fixture.authority",
  }));
  return {
    ...seiriLoadout,
    activeMechanics: [
      {
        ...active,
        authorityEnvelope: {
          ...active.authorityEnvelope,
          allowedEffects: ["repo.inspect", "repo.read"],
          deniedEffects: ["repo.delete", "repo.write"],
        },
        workOrder: {
          ...active.workOrder,
          allowedOperations: ["repo.inspect", "repo.read"],
          prohibitedOperations: ["repo.delete", "repo.write"],
        },
      },
    ],
    containers: [
      {
        ...seiriLoadout.containers[0]!,
        socketBudget: supports.length,
        supportFacetIds: supports.map((support) => support.supportFacetId),
      },
    ],
    supportFacets: supports,
    links,
    linkGroups: [
      {
        linkGroupId: "fixture.authority",
        containerId: seiriLoadout.containers[0]!.containerId,
        linkIds: links.map((link) => link.linkId),
      },
    ],
    authorityGrants: grants,
  };
};
