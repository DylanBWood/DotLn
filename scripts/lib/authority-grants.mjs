import { defaultDocRelative, docRelative, loadConfig } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  canonicalStringify,
  compileLoadout,
  normalizeAuthorityGrants,
} from "@dotln/compiler";
import { containedRegularFile } from "./paths.mjs";

// Instance authority data lives beside the source loadouts, outside package src.
// The caller owns root; neither registry path is read from submitted graph text.
export const COMMITTED_AUTHORITY_GRANTS =
  "packages/skeleton/loadouts/grants.json";
export const LOCAL_AUTHORITY_GRANTS = defaultDocRelative(
  "control",
  "local/authority-grants.json",
);

export function readAuthorityGrantRegistry(root) {
  const read = (name, optional, origins) => {
    const path = resolve(root, name);
    if (optional && !existsSync(path)) return [];
    if (!containedRegularFile(path, root))
      throw new Error(
        `authority registry must be a contained regular file: ${name}`,
      );
    const grants = normalizeAuthorityGrants(
      JSON.parse(readFileSync(path, "utf8")),
    );
    for (const grant of grants)
      if (!origins.includes(grant.grantedBy))
        throw new Error(
          `authority registry ${name} cannot admit grantedBy ${grant.grantedBy}`,
        );
    return grants;
  };
  return normalizeAuthorityGrants([
    ...read(COMMITTED_AUTHORITY_GRANTS, false, [
      "operator",
      "registered-repository",
    ]),
    ...read(docRelative(root, "control", "local/authority-grants.json"), true, [
      "host-policy",
    ]),
  ]);
}

/** Host adapter: registry selection is independent of the submitted graph. */
export function compileRegisteredLoadout(source, environment, root) {
  return compileLoadout(source, {
    ...environment,
    authorityGrantRegistry: readAuthorityGrantRegistry(root),
  });
}

const unique = (values) => [...new Set(values)];
const matches = (pattern, effect) =>
  pattern.endsWith("*")
    ? effect.startsWith(pattern.slice(0, -1))
    : pattern === effect;
const admittedByBase = (allowed, denied, effect) =>
  allowed.some((pattern) => matches(pattern, effect)) &&
  !denied.some((pattern) => matches(pattern, effect));

const registeredProfileGrant = (source, repository) => {
  if (source.activeMechanics.length !== 1)
    throw new Error(
      "INVALID GRAPH: a registered repository profile requires exactly one active mechanic",
    );
  const active = source.activeMechanics[0];
  const profile = repository.authorityProfile;
  const profileAllows = profile.allowedEffects.filter(
    (effect) =>
      !profile.deniedEffects.some((pattern) => matches(pattern, effect)),
  );
  const additions = (allowed, denied) =>
    profileAllows.filter((effect) => !admittedByBase(allowed, denied, effect));
  const effects = additions(
    active.authorityEnvelope.allowedEffects,
    active.authorityEnvelope.deniedEffects,
  );
  const operations = additions(
    active.workOrder.allowedOperations,
    active.workOrder.prohibitedOperations,
  );
  for (const value of [...effects, ...operations])
    if (value.endsWith("*"))
      throw new Error(
        `AUTHORITY WIDENING: registered repository ${repository.id} profile allow ${JSON.stringify(value)} is outside the active base and cannot be represented by an exact grant`,
      );
  if (!effects.length && !operations.length) return undefined;
  return {
    grantId: `registered-repository.${repository.id}.profile`,
    version: 1,
    grantedBy: "registered-repository",
    effects,
    operations,
    repo: repository.id,
    reason: `Authority profile registered for repository ${repository.id}`,
  };
};

const narrowedResourceLimits = (base, profile, repository) => {
  const limits = { ...base };
  for (const [resource, value] of Object.entries(profile)) {
    if (!Object.hasOwn(base, resource) || value > base[resource])
      throw new Error(
        `AUTHORITY WIDENING: registered repository ${repository.id} authorityProfile.resourceLimits.${resource} exceeds the active base`,
      );
    limits[resource] = Math.min(base[resource], value);
  }
  return limits;
};

/** Apply one validated registration to a graph. Widening is admitted only when
 * the caller supplies the exact deterministic registered-repository grant. */
export function applyRegisteredRepositoryProfile(
  source,
  repository,
  suppliedGrant,
) {
  const expectedGrant = registeredProfileGrant(source, repository);
  if (
    (expectedGrant === undefined) !== (suppliedGrant === undefined) ||
    (expectedGrant !== undefined &&
      canonicalStringify(expectedGrant) !== canonicalStringify(suppliedGrant))
  )
    throw new Error(
      `AUTHORITY WIDENING: registered repository ${repository.id} profile allows authority outside the active base without its exact registered-repository grant`,
    );
  const profile = repository.authorityProfile;
  for (const grant of source.authorityGrants ?? [])
    for (const [field, values] of [
      ["effects", grant.effects],
      ["operations", grant.operations],
    ])
      for (const value of values ?? []) {
        const denial = profile.deniedEffects.find((pattern) =>
          matches(pattern, value),
        );
        if (denial)
          throw new Error(
            `AUTHORITY WIDENING: existing grant ${JSON.stringify(grant.grantId)} ${field} allow ${JSON.stringify(value)} would override registered repository ${repository.id} profile denial ${JSON.stringify(denial)}`,
          );
      }
  const active = source.activeMechanics[0];
  const deny = (allowed) =>
    allowed.filter(
      (effect) =>
        !profile.deniedEffects.some((pattern) => matches(pattern, effect)),
    );
  const activeMechanic = {
    ...active,
    workOrder: {
      ...active.workOrder,
      allowedOperations: deny(active.workOrder.allowedOperations),
      prohibitedOperations: unique([
        ...active.workOrder.prohibitedOperations,
        ...profile.deniedEffects,
      ]),
    },
    authorityEnvelope: {
      ...active.authorityEnvelope,
      authorityEnvelopeId: `${active.authorityEnvelope.authorityEnvelopeId}+registered:${repository.id}:${profile.authorityEnvelopeId}`,
      allowedEffects: deny(active.authorityEnvelope.allowedEffects),
      deniedEffects: unique([
        ...active.authorityEnvelope.deniedEffects,
        ...profile.deniedEffects,
      ]),
      resourceLimits: narrowedResourceLimits(
        active.authorityEnvelope.resourceLimits,
        profile.resourceLimits,
        repository,
      ),
      requiredEvidence: unique([
        ...active.authorityEnvelope.requiredEvidence,
        ...profile.requiredEvidence,
      ]),
      expiresAt: Math.min(
        active.authorityEnvelope.expiresAt,
        profile.expiresAt,
      ),
      revocationEventTypes: unique([
        ...active.authorityEnvelope.revocationEventTypes,
        ...profile.revocationEventTypes,
      ]),
      revocationConditions: unique([
        ...(active.authorityEnvelope.revocationConditions ?? []).map(
          canonicalStringify,
        ),
        ...(profile.revocationConditions ?? []).map(canonicalStringify),
      ]).map((value) => JSON.parse(value)),
    },
  };
  return {
    ...source,
    activeMechanics: [activeMechanic],
    authorityGrants: [
      ...(source.authorityGrants ?? []),
      ...(suppliedGrant ? [suppliedGrant] : []),
    ],
  };
}

/** Compile against committed repository registration as host authority input. */
export function compileRegisteredRepositoryLoadout(
  source,
  environment,
  root,
  repositoryId,
) {
  const repositories = loadConfig(root).repositories;
  if (!Object.hasOwn(repositories, repositoryId))
    throw new Error(
      `unknown registered repository id ${JSON.stringify(repositoryId)}`,
    );
  const repository = repositories[repositoryId];
  const grant = registeredProfileGrant(source, repository);
  const graph = applyRegisteredRepositoryProfile(source, repository, grant);
  const registry = normalizeAuthorityGrants([
    ...readAuthorityGrantRegistry(root),
    ...(grant ? [grant] : []),
  ]);
  return compileLoadout(graph, {
    ...environment,
    repo: repository.id,
    authorityGrantRegistry: registry,
  });
}
