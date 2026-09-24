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

/** The graph and environment a registered repository's profile compiles:
 * the profile applied to the one active mechanic, the repository id as the
 * environment's repo and the launchpad registry plus the exact profile grant. */
export function registeredRepositoryInputs(
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
  return {
    repository,
    graph,
    environment: {
      ...environment,
      repo: repository.id,
      authorityGrantRegistry: registry,
    },
  };
}

/** Compile against committed repository registration as host authority input. */
export function compileRegisteredRepositoryLoadout(
  source,
  environment,
  root,
  repositoryId,
) {
  const inputs = registeredRepositoryInputs(
    source,
    environment,
    root,
    repositoryId,
  );
  return compileLoadout(inputs.graph, inputs.environment);
}

/** Every way a compiled floor departs from what its registered repository's
 * profile would compile (WO-157, WO-100 D006), for a store written by hand.
 * The rules are applyRegisteredRepositoryProfile's, read in reverse; grants
 * are admitted only from the launchpad's registry or as the exact profile
 * grant, never from the store's own registry. Empty means compiled under it. */
export function registeredProfileMismatches({
  program,
  environment,
  repository,
  registry,
}) {
  const profile = repository.authorityProfile;
  const named = `repositories.${repository.id}.authorityProfile (${profile.authorityEnvelopeId})`;
  const floor = program.authorityEnvelope;
  const at = `the compiled floor ${floor.authorityEnvelopeId}`;
  const lines = [];
  if (environment.repo !== repository.id)
    lines.push(
      `resident.json environment.repo is ${JSON.stringify(environment.repo)}; ${named} compiles it as ${JSON.stringify(repository.id)}`,
    );
  for (const denial of profile.deniedEffects) {
    if (!floor.deniedEffects.includes(denial))
      lines.push(`${named} denies ${denial}; ${at} does not`);
    for (const effect of floor.allowedEffects.filter((effect) =>
      matches(denial, effect),
    ))
      lines.push(`${named} denies ${denial}; ${at} allows ${effect}`);
  }
  for (const [resource, limit] of Object.entries(profile.resourceLimits)) {
    const value = floor.resourceLimits[resource];
    if (!(Number.isSafeInteger(value) && value <= limit))
      lines.push(
        `${named} limits ${resource} to ${limit}; ${at} allows ${value ?? "no limit"}`,
      );
  }
  if (floor.expiresAt > profile.expiresAt)
    lines.push(
      `${named} expires at ${profile.expiresAt}; ${at} expires at ${floor.expiresAt}`,
    );
  for (const evidence of profile.requiredEvidence)
    if (!floor.requiredEvidence.includes(evidence))
      lines.push(`${named} requires evidence ${evidence}; ${at} does not`);
  for (const type of profile.revocationEventTypes)
    if (!floor.revocationEventTypes.includes(type))
      lines.push(`${named} revokes on ${type}; ${at} does not`);
  const conditions = (floor.revocationConditions ?? []).map(canonicalStringify);
  for (const condition of profile.revocationConditions ?? [])
    if (!conditions.includes(canonicalStringify(condition)))
      lines.push(
        `${named} revokes on ${canonicalStringify(condition)}; ${at} does not`,
      );
  // Admission ignores a grant's reason, exactly as the compiler admits one.
  const key = ({ reason: _reason, ...grant }) => canonicalStringify(grant);
  const admitted = new Set(registry.map(key));
  // The forward compile narrows the WorkOrder's operations as it narrows the
  // envelope's effects (applyRegisteredRepositoryProfile).
  const workOrder = program.workOrder;
  for (const denial of profile.deniedEffects) {
    if (!workOrder.prohibitedOperations.includes(denial))
      lines.push(
        `${named} denies ${denial}; the compiled WorkOrder does not prohibit it`,
      );
    for (const operation of workOrder.allowedOperations.filter((value) =>
      matches(denial, value),
    ))
      lines.push(
        `${named} denies ${denial}; the compiled WorkOrder allows ${operation}`,
      );
  }
  const profileAllows = (value) =>
    profile.allowedEffects.some((pattern) => matches(pattern, value)) &&
    !profile.deniedEffects.some((pattern) => matches(pattern, value));
  for (const grant of program.grants ?? [])
    if (
      !admitted.has(key(grant)) &&
      !(
        grant.grantId === `registered-repository.${repository.id}.profile` &&
        grant.grantedBy === "registered-repository" &&
        grant.repo === repository.id &&
        [...grant.effects, ...(grant.operations ?? [])].every(profileAllows)
      )
    )
      lines.push(
        `resident.json grants ${grant.grantId}, which neither the launchpad's authority registry nor ${named} provides`,
      );
  return lines.map((line) => `profile: ${line}`);
}
