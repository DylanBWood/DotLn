import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  COMPONENT_DEFINITION_DOMAIN,
  COMPONENT_DEFINITION_HASH_SCHEME,
  COMPILER_PACKAGE_VERSION,
  canonicalStringify,
  compileLoadout,
  componentDefinitionPreimage,
  fnv1a64,
  normalizeLoadoutGraph,
  seiriEnvironment,
  seiriLoadout,
  withLinkedSupports,
  type AmbientEffect,
  type ArtifactIdentityV1,
  type CompilationEnvironment,
  type LoadoutGraph,
} from "../src/index.js";

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(new URL(path, import.meta.url), "utf8")) as T;
const expected = await readJson<Record<string, ArtifactIdentityV1>>(
  "../../fixtures/wo029-identities.json",
);
const entropy = await readJson<LoadoutGraph>(
  "../../fixtures/wo029-entropy-reducer.json",
);
const oracleUrl = new URL(
  "../../../../corpus/harness/id-corpus-lib.mjs",
  import.meta.url,
);
const { referenceStableHash } = (await import(oracleUrl.href)) as {
  referenceStableHash(value: string): string;
};
const fixtures = [
  { name: "seiri", graph: seiriLoadout, environment: seiriEnvironment() },
  {
    name: "entropy-reducer",
    graph: entropy,
    environment: expected["entropy-reducer"]!.compilationEnvironment,
  },
];
const compiled = (graph: LoadoutGraph, environment: CompilationEnvironment) => {
  const result = compileLoadout(graph, environment);
  if (!result.ok) assert.fail(canonicalStringify(result.diagnostics));
  return result;
};
const key = (entry: ArtifactIdentityV1["componentDefinitions"][number]) =>
  canonicalStringify([entry.componentKind, entry.componentId, entry.version]);

for (const fixture of fixtures) {
  test(`WO-029 ${fixture.name}: exact identity, manifest membership and independent no-BigInt FNV agreement`, () => {
    const first = compiled(fixture.graph, fixture.environment);
    const second = compiled(fixture.graph, fixture.environment);
    assert.equal(
      JSON.stringify(first.artifactIdentity),
      JSON.stringify(second.artifactIdentity),
    );
    // Preserve the historical receipt; only the executing package's version
    // advances. All semantic hashes, definitions and environment fields remain
    // pinned to the independently recorded WO-029 identity.
    assert.deepEqual(first.artifactIdentity, {
      ...expected[fixture.name],
      compilerPackageVersion: COMPILER_PACKAGE_VERSION,
    });
    assert.equal(
      first.semanticHash,
      expected[fixture.name]!.semanticHash,
      "the pre-WO-029 whole-program hash remains byte-identical",
    );
    assert.equal(
      first.semanticHash,
      `fnv1a64:${referenceStableHash(canonicalStringify(first.program))}`,
    );
    assert.deepEqual(
      first.artifactIdentity.componentDefinitions.map(key),
      first.program.componentManifest.map((entry) =>
        canonicalStringify([
          entry.componentKind,
          entry.componentId,
          entry.version,
        ]),
      ),
    );
    assert.equal(Object.hasOwn(first.program, "artifactIdentity"), false);
    assert.deepEqual(
      first.artifactIdentity.compilationEnvironment,
      fixture.environment,
    );
    assert.equal(
      first.artifactIdentity.authorityExpiresAt,
      first.program.authorityEnvelope.expiresAt,
    );
    const graph = normalizeLoadoutGraph(fixture.graph);
    for (const entry of first.artifactIdentity.componentDefinitions) {
      const definition =
        entry.componentKind === "active-mechanic"
          ? graph.activeMechanics.find(
              (value) => value.activeMechanicId === entry.componentId,
            )
          : entry.componentKind === "support-facet"
            ? graph.supportFacets.find(
                (value) => value.supportFacetId === entry.componentId,
              )
            : graph.ambientEffects.find(
                (value) => value.ambientEffectId === entry.componentId,
              );
      assert.ok(definition);
      assert.equal(entry.hashScheme, COMPONENT_DEFINITION_HASH_SCHEME);
      assert.equal(
        entry.definitionHash,
        `fnv1a64:${referenceStableHash(componentDefinitionPreimage(entry.componentKind, definition))}`,
      );
    }
  });

  test(`WO-029 ${fixture.name}: source/property/set ordering is inert; body edits are attributable`, () => {
    const reorderKeys = (value: unknown): unknown =>
      Array.isArray(value)
        ? value.map(reorderKeys)
        : value !== null && typeof value === "object"
          ? Object.fromEntries(
              Object.entries(value)
                .reverse()
                .map(([key, value]) => [key, reorderKeys(value)]),
            )
          : value;
    const reordered = reorderKeys({
      ...fixture.graph,
      activeMechanics: fixture.graph.activeMechanics
        .map((active) => ({
          ...active,
          tags: [...active.tags].reverse(),
          semantics: [...active.semantics].reverse(),
        }))
        .reverse(),
      supportFacets: fixture.graph.supportFacets
        .map((support) => ({
          ...support,
          supportedTags: [...support.supportedTags].reverse(),
          semanticsAdded: [...support.semanticsAdded].reverse(),
          emissions: [...support.emissions].reverse(),
          claims: [...support.claims].reverse(),
        }))
        .reverse(),
      links: [...fixture.graph.links].reverse(),
      linkGroups: fixture.graph.linkGroups.map((group) => ({
        ...group,
        linkIds: [...group.linkIds].reverse(),
      })),
    }) as LoadoutGraph;
    const original = compiled(fixture.graph, fixture.environment);
    assert.deepEqual(
      compiled(reordered, fixture.environment).artifactIdentity,
      original.artifactIdentity,
    );
    const editedId = fixture.graph.links[0]!.supportFacetId;
    for (const semantic of [false, true]) {
      const edited = compiled(
        {
          ...fixture.graph,
          supportFacets: fixture.graph.supportFacets.map((support) =>
            support.supportFacetId !== editedId
              ? support
              : semantic
                ? {
                    ...support,
                    semanticsAdded: [
                      ...support.semanticsAdded,
                      "an observable addition",
                    ],
                  }
                : { ...support, name: `${support.name} renamed` },
          ),
        },
        fixture.environment,
      );
      const changed = edited.artifactIdentity.componentDefinitions.filter(
        (entry, index) =>
          entry.definitionHash !==
          original.artifactIdentity.componentDefinitions[index]!.definitionHash,
      );
      assert.deepEqual(
        changed.map((entry) => entry.componentId),
        [editedId],
      );
      assert.deepEqual(
        changed.map(key),
        original.artifactIdentity.componentDefinitions
          .filter((entry) => entry.componentId === editedId)
          .map(key),
      );
      if (semantic) assert.notEqual(edited.semanticHash, original.semanticHash);
      else
        assert.equal(
          edited.semanticHash,
          original.semanticHash,
          "previously un-emitted source names remain outside semantic identity",
        );
    }
  });

  test(`WO-029 ${fixture.name}: relocation changes environment-sensitive identity, not definitions`, () => {
    const before = compiled(fixture.graph, fixture.environment);
    const relocated = compiled(fixture.graph, {
      ...fixture.environment,
      repo: "/relocated/repository",
    });
    assert.notEqual(relocated.semanticHash, before.semanticHash);
    assert.deepEqual(
      relocated.artifactIdentity.componentDefinitions,
      before.artifactIdentity.componentDefinitions,
    );
    assert.deepEqual(relocated.program, {
      ...before.program,
      workOrder: { ...before.program.workOrder, repo: "/relocated/repository" },
    });
  });
}

test("WO-029 definition v1 pins the exact domain, canonical Unicode preimage and independent fixed value", () => {
  const ambient: AmbientEffect = {
    ambientEffectId: "quiet",
    version: 1,
    name: "Quiet 雪",
    scope: "episode",
    reservationCost: { attention: 1 },
    emissions: [],
  };
  const normalized = normalizeLoadoutGraph({
    ...seiriLoadout,
    ambientEffects: [ambient],
  });
  const preimage = componentDefinitionPreimage(
    "ambient-effect",
    normalized.ambientEffects[0]!,
  );
  assert.equal(COMPONENT_DEFINITION_DOMAIN, "dotln:component-definition:v1");
  assert.equal(
    COMPONENT_DEFINITION_HASH_SCHEME,
    "dotln-component-definition-fnv1a64-v1",
  );
  assert.equal(
    preimage,
    '{"componentKind":"ambient-effect","definition":{"ambientEffectId":"quiet","emissions":[],"name":"Quiet 雪","reservationCost":{"attention":1},"scope":"episode","version":1},"domain":"dotln:component-definition:v1"}',
  );
  assert.equal(fnv1a64(preimage), referenceStableHash(preimage));
  assert.equal(fnv1a64(preimage), "3a5e415be9582bed");
  const result = compiled(normalized, seiriEnvironment());
  const entry = result.artifactIdentity.componentDefinitions.find(
    (entry) => entry.componentKind === "ambient-effect",
  );
  assert.equal(
    entry?.definitionHash,
    `fnv1a64:${referenceStableHash(preimage)}`,
  );
  assert.notEqual(
    fnv1a64(componentDefinitionPreimage("active-mechanic", ambient)),
    fnv1a64(preimage),
  );
});

test("WO-029 unequipped definitions stay outside the manifest and identity; failed compiles have no identity", () => {
  const equippedIds = seiriLoadout.links
    .map((link) => link.supportFacetId)
    .slice(1);
  const source = withLinkedSupports(seiriLoadout, equippedIds);
  const before = compiled(source, seiriEnvironment());
  const after = compiled(
    {
      ...source,
      supportFacets: source.supportFacets.map((support) =>
        equippedIds.includes(support.supportFacetId)
          ? support
          : { ...support, name: "inert catalog change" },
      ),
    },
    seiriEnvironment(),
  );
  assert.deepEqual(after.artifactIdentity, before.artifactIdentity);
  for (const invalid of [
    { ...seiriLoadout, activeMechanics: [] },
    { ...seiriLoadout, links: [...seiriLoadout.links, seiriLoadout.links[0]!] },
  ]) {
    const failed = compileLoadout(invalid, seiriEnvironment());
    assert.equal(failed.ok, false);
    assert.equal(Object.hasOwn(failed, "artifactIdentity"), false);
  }
});

test("WO-029 the pure compiler package-version constant names the executing package", async () => {
  const manifest = await readJson<{ version: string }>("../../package.json");
  assert.equal(COMPILER_PACKAGE_VERSION, manifest.version);
});
