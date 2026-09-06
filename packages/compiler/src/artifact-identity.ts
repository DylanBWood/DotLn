import { canonicalStringify, fnv1a64 } from "./normalize.js";
import type {
  ActiveMechanic,
  AmbientEffect,
  ArtifactIdentityV1,
  CompilationEnvironment,
  CompiledProgram,
  ComponentManifestEntry,
  LoadoutGraph,
  SupportFacet,
} from "./types.js";

// Source constant, checked against package.json in the executable evidence.
// Reading a package manifest at runtime would introduce I/O into compilation.
export const COMPILER_PACKAGE_VERSION = "0.5.0";
export const COMPONENT_DEFINITION_HASH_SCHEME =
  "dotln-component-definition-fnv1a64-v1" as const;
export const COMPONENT_DEFINITION_DOMAIN = "dotln:component-definition:v1";

/** The definition must come from normalizeLoadoutGraph, not a source view. */
export const componentDefinitionPreimage = (
  componentKind: ComponentManifestEntry["componentKind"],
  definition: ActiveMechanic | SupportFacet | AmbientEffect,
): string =>
  canonicalStringify({
    domain: COMPONENT_DEFINITION_DOMAIN,
    componentKind,
    definition,
  });

/** Called only after successful compilation, with its normalized source. */
export const deriveArtifactIdentity = (
  graph: LoadoutGraph,
  program: CompiledProgram,
  environment: CompilationEnvironment,
  semanticHash: string,
): ArtifactIdentityV1 => ({
  schemaVersion: 1,
  compilerContractVersion: program.compilerVersion,
  compilerPackageVersion: COMPILER_PACKAGE_VERSION,
  semanticHash,
  compilationEnvironment: JSON.parse(canonicalStringify(environment)),
  authorityExpiresAt: program.authorityEnvelope.expiresAt,
  componentDefinitions: program.componentManifest.map((entry) => {
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
    if (definition === undefined || definition.version !== entry.version)
      throw new Error(
        "component manifest has no matching normalized definition",
      );
    return {
      componentKind: entry.componentKind,
      componentId: entry.componentId,
      version: entry.version,
      hashScheme: COMPONENT_DEFINITION_HASH_SCHEME,
      definitionHash: `fnv1a64:${fnv1a64(componentDefinitionPreimage(entry.componentKind, definition))}`,
    };
  }),
});
