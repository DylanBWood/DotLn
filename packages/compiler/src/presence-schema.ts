import {
  PRESENCE_AXES,
  type CadenceSpec,
  type PresencePolicy,
  type PredicateRef,
} from "./types.js";

type ObjectValue = Record<string, unknown>;
const fail = (path: string): never => {
  throw new Error(`presence: invalid ${path}`);
};
const object = (
  value: unknown,
  path: string,
  keys: readonly string[],
): ObjectValue => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return fail(path);
  const result = value as ObjectValue;
  for (const key of Object.keys(result))
    if (!keys.includes(key)) fail(`${path}.${key}`);
  return result;
};
const text = (value: unknown, path: string): string => {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    /[\u0000-\u001f\u007f]/u.test(value)
  )
    return fail(path);
  return value;
};
const number = (value: unknown, path: string, minimum = 0): number => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum)
    return fail(path);
  return value;
};
const integer = (value: unknown, path: string, minimum = 0): number => {
  const result = number(value, path, minimum);
  if (!Number.isSafeInteger(result)) fail(path);
  return result;
};
const strings = (value: unknown, path: string): readonly string[] => {
  if (!Array.isArray(value)) return fail(path);
  return [
    ...new Set(value.map((entry, index) => text(entry, `${path}[${index}]`))),
  ].sort();
};
const quantities = (
  value: unknown,
  path: string,
): Readonly<Record<string, number>> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return fail(path);
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, entry]) => [
        text(key, path),
        number(entry, `${path}.${key}`),
      ]),
  );
};
const json = (value: unknown, path: string): void => {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (Array.isArray(value)) {
    value.forEach((entry) => json(entry, path));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => json(entry, path));
    return;
  }
  fail(path);
};
const predicate = (value: unknown, path: string): PredicateRef => {
  const source = object(value, path, ["registryId", "version", "params"]);
  const registryId = text(source["registryId"], `${path}.registryId`);
  const version = integer(source["version"], `${path}.version`, 1);
  if (source["params"] === undefined) return { registryId, version };
  const params = source["params"];
  if (!params || typeof params !== "object" || Array.isArray(params))
    fail(`${path}.params`);
  json(params, `${path}.params`);
  return { registryId, version, params: JSON.parse(JSON.stringify(params)) };
};
const cadence = (value: unknown, path: string, depth = 0): CadenceSpec => {
  if (depth > 32) return fail(`${path}.depth`);
  const source = object(value, path, [
    "kind",
    "at",
    "delayMs",
    "intervalMs",
    "startAt",
    "cadence",
    "conditionRef",
  ]);
  switch (source["kind"]) {
    case "Once":
      object(value, path, ["kind", "at"]);
      return { kind: "Once", at: number(source["at"], `${path}.at`) };
    case "After":
      object(value, path, ["kind", "delayMs"]);
      return {
        kind: "After",
        delayMs: number(source["delayMs"], `${path}.delayMs`),
      };
    case "Every":
      object(value, path, ["kind", "intervalMs", "startAt"]);
      if (number(source["intervalMs"], `${path}.intervalMs`) === 0)
        fail(`${path}.intervalMs`);
      return {
        kind: "Every",
        intervalMs: source["intervalMs"] as number,
        ...(source["startAt"] === undefined
          ? {}
          : { startAt: number(source["startAt"], `${path}.startAt`) }),
      };
    case "Gate":
    case "Until":
      object(value, path, ["kind", "cadence", "conditionRef"]);
      return {
        kind: source["kind"],
        cadence: cadence(source["cadence"], `${path}.cadence`, depth + 1),
        conditionRef: predicate(source["conditionRef"], `${path}.conditionRef`),
      };
    default:
      return fail(`${path}.kind`);
  }
};

/** Validates deserialized input before normalization could silently drop it. */
export const normalizePresencePolicies = (
  values: unknown,
): readonly PresencePolicy[] => {
  if (!Array.isArray(values)) return fail("collection");
  const ids = new Set<string>();
  return values
    .map((value, index): PresencePolicy => {
      const path = `[${index}]`;
      const source = object(value, path, [
        "policyId",
        "version",
        "axes",
        "phases",
        "curve",
        "returnRule",
        "humanIdleMs",
        "decay",
      ]);
      const policyId = text(source["policyId"], `${path}.policyId`);
      if (ids.has(policyId)) fail(`${path}.policyId (duplicate)`);
      ids.add(policyId);
      const axes = strings(source["axes"], `${path}.axes`);
      if (
        axes.length !== PRESENCE_AXES.length ||
        PRESENCE_AXES.some((axis) => !axes.includes(axis))
      )
        fail(`${path}.axes`);
      if (source["curve"] !== "progressive") fail(`${path}.curve`);
      if (source["returnRule"] !== "cancel-on-return")
        fail(`${path}.returnRule`);
      const decay = object(source["decay"], `${path}.decay`, [
        "idleMs",
        "expires",
      ]);
      if (decay["expires"] !== "phase") fail(`${path}.decay.expires`);
      const phaseValues = source["phases"];
      if (!Array.isArray(phaseValues) || !phaseValues.length)
        return fail(`${path}.phases`);
      const phaseIds = new Set(["present", "expired"]);
      const phases = phaseValues.map((phaseValue, phaseIndex) => {
        const p = `${path}.phases[${phaseIndex}]`;
        const phase = object(phaseValue, p, [
          "phaseId",
          "entry",
          "attentionPriority",
          "scope",
          "envelope",
          "requiredCapabilities",
          "discretionary",
          "inFlightOnReturn",
        ]);
        const phaseId = text(phase["phaseId"], `${p}.phaseId`);
        if (phaseIds.has(phaseId)) fail(`${p}.phaseId (duplicate or reserved)`);
        phaseIds.add(phaseId);
        const entry = object(phase["entry"], `${p}.entry`, [
          "cadence",
          "condition",
        ]);
        if (Object.keys(entry).length !== 1) fail(`${p}.entry`);
        const normalizedEntry =
          entry["cadence"] === undefined
            ? {
                condition: predicate(
                  entry["condition"],
                  `${p}.entry.condition`,
                ),
              }
            : { cadence: cadence(entry["cadence"], `${p}.entry.cadence`) };
        const scope = object(phase["scope"], `${p}.scope`, [
          "surfaces",
          "changeSize",
          "budget",
        ]);
        const size = object(scope["changeSize"], `${p}.scope.changeSize`, [
          "files",
          "lines",
        ]);
        const envelope = object(phase["envelope"], `${p}.envelope`, [
          "allowedEffects",
          "deniedEffects",
          "resourceLimits",
          "requiredEvidence",
          "expiresAt",
          "revocationEventTypes",
          "revocationConditions",
        ]);
        const normalizedEnvelope: Record<string, unknown> = {};
        for (const field of [
          "allowedEffects",
          "deniedEffects",
          "requiredEvidence",
          "revocationEventTypes",
        ])
          if (envelope[field] !== undefined)
            normalizedEnvelope[field] = strings(
              envelope[field],
              `${p}.envelope.${field}`,
            );
        for (const field of ["allowedEffects", "deniedEffects"])
          for (const effect of (normalizedEnvelope[field] as string[]) ?? [])
            if (/\s/u.test(effect) || effect.slice(0, -1).includes("*"))
              fail(`${p}.envelope.${field}`);
        if (envelope["resourceLimits"] !== undefined)
          normalizedEnvelope["resourceLimits"] = quantities(
            envelope["resourceLimits"],
            `${p}.envelope.resourceLimits`,
          );
        if (envelope["expiresAt"] !== undefined)
          normalizedEnvelope["expiresAt"] = number(
            envelope["expiresAt"],
            `${p}.envelope.expiresAt`,
          );
        if (envelope["revocationConditions"] !== undefined) {
          if (!Array.isArray(envelope["revocationConditions"]))
            fail(`${p}.envelope.revocationConditions`);
          normalizedEnvelope["revocationConditions"] = (
            envelope["revocationConditions"] as unknown[]
          ).map((ref, i) =>
            predicate(ref, `${p}.envelope.revocationConditions[${i}]`),
          );
        }
        if (typeof phase["discretionary"] !== "boolean")
          fail(`${p}.discretionary`);
        if (!["finish", "kill"].includes(phase["inFlightOnReturn"] as string))
          fail(`${p}.inFlightOnReturn`);
        if (
          phase["discretionary"] === false &&
          phase["inFlightOnReturn"] !== "finish"
        )
          fail(`${p}.inFlightOnReturn (foreground must finish)`);
        return {
          phaseId,
          entry: normalizedEntry,
          attentionPriority: number(
            phase["attentionPriority"],
            `${p}.attentionPriority`,
          ),
          scope: {
            surfaces: strings(scope["surfaces"], `${p}.scope.surfaces`),
            changeSize: {
              files: integer(size["files"], `${p}.scope.changeSize.files`),
              lines: integer(size["lines"], `${p}.scope.changeSize.lines`),
            },
            budget: quantities(scope["budget"], `${p}.scope.budget`),
          },
          envelope: normalizedEnvelope,
          requiredCapabilities: strings(
            phase["requiredCapabilities"],
            `${p}.requiredCapabilities`,
          ),
          discretionary: phase["discretionary"] as boolean,
          inFlightOnReturn: phase["inFlightOnReturn"] as "finish" | "kill",
        };
      });
      return {
        policyId,
        version: integer(source["version"], `${path}.version`, 1),
        axes: [...PRESENCE_AXES],
        phases,
        curve: "progressive",
        returnRule: "cancel-on-return",
        ...(source["humanIdleMs"] === undefined
          ? {}
          : {
              humanIdleMs: integer(
                source["humanIdleMs"],
                `${path}.humanIdleMs`,
                1,
              ),
            }),
        decay: {
          idleMs: number(decay["idleMs"], `${path}.decay.idleMs`),
          expires: "phase",
        },
      };
    })
    .sort((a, b) =>
      a.policyId < b.policyId ? -1 : a.policyId > b.policyId ? 1 : 0,
    );
};
