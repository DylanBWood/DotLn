import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { containedRegularFile } from "./paths.mjs";

export const OVERLAY_KEYS = [
  "version",
  "build",
  "identity",
  "unequip",
  "equip",
  "narrow",
  "grants",
];
export const overlayError = (path, detail) =>
  new Error(`invalid build overlay in ${path}: ${detail}`);

/** Instance-owned data has a closed schema; it cannot replace kit code or the floor. */
export function decodeBuildOverlay(path, text, supportIds) {
  const fail = (detail) => {
    throw overlayError(path, detail);
  };
  const object = (value, keys, label) => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      fail(`${label} must be an object`);
    for (const key of Object.keys(value))
      if (!keys.includes(key)) fail(`unknown key ${label}.${key}`);
  };
  const string = (value, label) => {
    if (
      typeof value !== "string" ||
      !value.trim() ||
      /[\u0000-\u001f\u007f\u2028\u2029]/u.test(value)
    )
      fail(`${label} must be a non-empty string without control characters`);
    if (/<!--\s*dotln-harness:(?:start|end)\s*-->/u.test(value))
      fail(`${label} must not contain harness block markers`);
  };
  const integer = (value, label, min = 0) => {
    if (!Number.isSafeInteger(value) || value < min)
      fail(`${label} must be a safe integer >= ${min}`);
  };
  const strings = (value, label, pattern) => {
    if (!Array.isArray(value)) fail(`${label} must be an array`);
    for (const [index, entry] of value.entries()) {
      string(entry, `${label}[${index}]`);
      if (pattern && !pattern.test(entry))
        fail(`${label}[${index}] has an invalid effect pattern`);
    }
    if (new Set(value).size !== value.length) fail(`${label} has duplicates`);
  };
  const exactEffect = /^[^\s*\u0000-\u001f\u007f]+$/u;
  const effectPattern = /^[^\s*\u0000-\u001f\u007f]+\*?$/u;
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    fail("root must be JSON");
  }
  const screenMarkers = (node, key) => {
    if (
      typeof node === "string" &&
      /<!--\s*dotln-harness:(?:start|end)\s*-->/u.test(node)
    )
      fail(`${key} must not contain harness block markers`);
    if (node && typeof node === "object")
      for (const [name, child] of Object.entries(node)) {
        screenMarkers(name, `${key} property name`);
        screenMarkers(child, `${key}.${name}`);
      }
  };
  screenMarkers(value, "overlay");
  object(value, OVERLAY_KEYS, "overlay");
  if (value.version !== 1) fail("version must be 1");
  if (
    value.build !== undefined &&
    !["contributor", "none"].includes(value.build)
  )
    fail('build must be "contributor" or "none"');
  if (
    value.build === "none" &&
    Object.keys(value).some((key) => !["version", "build"].includes(key))
  )
    fail('build "none" accepts only version and build');
  for (const key of ["equip", "unequip"]) {
    if (value[key] === undefined) continue;
    strings(value[key], key);
    for (const id of value[key])
      if (supportIds && !supportIds.includes(id))
        fail(`${key} names unknown support ${id}`);
  }
  if (value.equip?.some((id) => value.unequip?.includes(id)))
    fail("equip and unequip must not name the same support");
  if (value.identity !== undefined) {
    object(
      value.identity,
      [
        "identityId",
        "version",
        "name",
        "dispositions",
        "invariants",
        "updateLaws",
        "lineage",
      ],
      "identity",
    );
    for (const key of ["identityId", "name"])
      string(value.identity[key], `identity.${key}`);
    integer(value.identity.version, "identity.version", 1);
    for (const key of ["dispositions", "invariants", "updateLaws", "lineage"])
      strings(value.identity[key], `identity.${key}`);
  }
  if (value.narrow !== undefined) {
    const narrow = value.narrow;
    object(
      narrow,
      [
        "allowedEffects",
        "deniedEffects",
        "resourceLimits",
        "requiredEvidence",
        "expiresAt",
        "revocationEventTypes",
        "revocationConditions",
      ],
      "narrow",
    );
    for (const key of [
      "allowedEffects",
      "deniedEffects",
      "requiredEvidence",
      "revocationEventTypes",
    ])
      if (narrow[key] !== undefined)
        strings(
          narrow[key],
          `narrow.${key}`,
          key.endsWith("Effects") ? effectPattern : undefined,
        );
    if (narrow.resourceLimits !== undefined) {
      const limits = narrow.resourceLimits;
      object(limits, Object.keys(limits ?? {}), "narrow.resourceLimits");
      for (const [key, quantity] of Object.entries(limits)) {
        string(key, "narrow.resourceLimits key");
        integer(quantity, `narrow.resourceLimits.${key}`);
      }
    }
    if (narrow.expiresAt !== undefined)
      integer(narrow.expiresAt, "narrow.expiresAt");
    if (narrow.revocationConditions !== undefined) {
      if (!Array.isArray(narrow.revocationConditions))
        fail("narrow.revocationConditions must be an array");
      for (const [index, condition] of narrow.revocationConditions.entries()) {
        const label = `narrow.revocationConditions[${index}]`;
        object(condition, ["registryId", "version", "params"], label);
        string(condition.registryId, `${label}.registryId`);
        integer(condition.version, `${label}.version`, 1);
        if (condition.params !== undefined)
          object(
            condition.params,
            Object.keys(condition.params ?? {}),
            `${label}.params`,
          );
      }
    }
  }
  if (value.grants !== undefined) {
    if (!Array.isArray(value.grants)) fail("grants must be an array");
    const ids = new Set();
    for (const [index, grant] of value.grants.entries()) {
      const label = `grants[${index}]`;
      object(
        grant,
        [
          "grantId",
          "version",
          "grantedBy",
          "effects",
          "operations",
          "repo",
          "reason",
        ],
        label,
      );
      for (const key of ["grantId", "reason"])
        string(grant[key], `${label}.${key}`);
      integer(grant.version, `${label}.version`, 1);
      if (!["operator", "host-policy"].includes(grant.grantedBy))
        fail(`${label}.grantedBy must be operator or host-policy`);
      if (grant.repo !== "project") fail(`${label}.repo must be project`);
      strings(grant.effects, `${label}.effects`, exactEffect);
      if (grant.operations !== undefined)
        strings(grant.operations, `${label}.operations`, exactEffect);
      if (ids.has(grant.grantId)) fail(`${label}.grantId must be unique`);
      ids.add(grant.grantId);
    }
  }
  return value;
}

export function readBuildOverlayFile(launchpad, path, supportIds) {
  if (path === null) return undefined;
  const absolute = resolve(launchpad, path);
  let text;
  try {
    if (!containedRegularFile(absolute, launchpad)) throw new Error();
    text = readFileSync(absolute);
  } catch {
    throw overlayError(
      path,
      "build.overlay must name a readable regular file inside the launchpad",
    );
  }
  const value = decodeBuildOverlay(path, text.toString("utf8"), supportIds);
  return { path, bytes: text, value };
}
