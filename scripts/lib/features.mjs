import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  docPath,
  docRelative,
  defaultDocRelative,
  loadConfig,
} from "./config.mjs";
import { readBuildOverlayFile } from "./build-overlay.mjs";

const row = (id, scope, defaultValue, what, readFrom, readBy) =>
  Object.freeze({ id, scope, default: defaultValue, what, readFrom, readBy });

/** One inventory: selections and existing budget keys stay at their own addresses. */
export const featureRegistry = Object.freeze([
  row(
    "tinkerer-economy",
    "instance",
    true,
    "Equips the executor to compare two credible approaches when a useful fork appears.",
    "features.tinkerer-economy",
    "scripts/lib/harness.mjs",
  ),
  row(
    "plan-first",
    "instance",
    false,
    "Reserves a plan and operator conversation before implementation; pending its consumer.",
    "features.plan-first",
    "WO-242",
  ),
  row(
    "private-destination",
    "instance",
    false,
    "Admits the owner's ordinary project links and identifiers inside an exported instance; credentials and outward publication screens stay protected.",
    "features.private-destination",
    "scripts/lib/harness.mjs",
  ),
  row(
    "desktop-control",
    "instance",
    false,
    "Permits desktop and operator-browser tools only with the operator's explicit request in the session.",
    "features.desktop-control",
    "packages/skeleton/src/harness-host.ts",
  ),
  row(
    "kit-instance-actions",
    "instance",
    false,
    "Allows a kit update to apply its declared instance actions.",
    "kit.applyInstanceActions",
    "scripts/launchpad.mjs",
  ),
  ...[
    ["readme-block", "readmeBlock", "the README release block"],
    ["component-versions", "componentVersions", "component version surfaces"],
    ["corpus", "corpus", "release corpus surfaces"],
    ["publication-check", "publicationCheck", "the publication check"],
  ].map(([id, key, what]) =>
    row(
      `release-${id}`,
      "core",
      true,
      `Declares an election for ${what}; no consumer implements this switch yet.`,
      `release.${key}`,
      "unread",
    ),
  ),
  row(
    "build-loadout",
    "both",
    null,
    "Stores a build selection; no consumer reads this key yet (the CLI has a separate --loadout option).",
    "build.loadout",
    "unread",
  ),
  row(
    "build-profile",
    "both",
    null,
    "Stores a harness profile selection; no consumer reads this key yet (the CLI has a separate --profile option).",
    "build.profile",
    "unread",
  ),
  row(
    "build-overlay",
    "instance",
    null,
    "Selects the instance-owned equipment and authority overlay, including build none.",
    "build.overlay",
    "scripts/lib/harness.mjs",
  ),
  row(
    "drive-sandbox",
    "instance",
    "host",
    "Uses the host's sandbox policy, or off for unsandboxed driven phase sessions.",
    "drive.sandbox",
    "scripts/lib/drive-worker.mjs",
  ),
  row(
    "subagent-cap",
    "both",
    20,
    "Bounds worker uses per spawning session; null removes this bound. This runtime reader uses docs/control/budgets.json even when the control root is relocated.",
    "budgets.subagentCap",
    "packages/skeleton/src/subagent-budget.ts",
  ),
  row(
    "dispatch-bounds",
    "both",
    null,
    "Declares per-role process limits; null leaves a bound unset and local-median uses this instance's history.",
    "budgets.dispatches",
    "scripts/lib/process-budget.mjs",
  ),
  row(
    "driven-session-ceiling",
    "both",
    80,
    "Bounds all descendant worker uses in a drive; null removes this bound.",
    "budgets.drivenSessionCeiling",
    "scripts/lib/drive-session.mjs",
  ),
  row(
    "driven-phase-timeout",
    "both",
    null,
    "Optionally bounds a driven phase's host timeout; null sets no extra timeout.",
    "budgets.drivenPhaseTimeoutMs",
    "scripts/lib/drive-session.mjs",
  ),
  row(
    "retention",
    "both",
    Object.freeze({
      "gate-fixture-passed": 0,
      "gate-fixture-failed": 24,
      "session-scratch": 24,
      "worker-capture": 1,
      "warm-fixture": 0,
      "legacy-backfill": 48,
      coordination: null,
      "closed-journal": 720,
    }),
    "Sets temporary-root retention by class; null keeps a class and an absent contract uses runtime defaults.",
    "budgets.retention",
    "packages/skeleton/src/temporary-root-records.mjs",
  ),
  row(
    "prune-start-budget",
    "both",
    1800000,
    "Bounds the routine prune at plan start and release close; the prune stops there, says what remains and how to resume, and the command goes on. null removes the bound.",
    "budgets.prune.startBudgetMs",
    "scripts/lib/temporary-prune-summary.mjs",
  ),
]);

/** A rename ships with { successor, release }; in the following kit release
 * the same tombstone refuses. No existing feature has been renamed yet. */
export const featureAliases = Object.freeze({});
export function resolveFeatureId(
  id,
  {
    registry = featureRegistry,
    aliases = featureAliases,
    release,
    advisory = (message) => console.warn(`Advisory: ${message}`),
  } = {},
) {
  const alias = Object.hasOwn(aliases, id) ? aliases[id] : undefined;
  if (alias) {
    if (release !== alias.release)
      throw new Error(
        `retired feature ${JSON.stringify(id)}; use features.${alias.successor}; npm run features -- list`,
      );
    advisory(
      `feature ${id} is renamed to ${alias.successor}; use features.${alias.successor} before the next kit release`,
    );
    id = alias.successor;
  }
  const entry = registry.find((candidate) => candidate.id === id);
  if (!entry)
    throw new Error(
      `unknown features key ${JSON.stringify(id)}; known ids: ${registry.map((candidate) => candidate.id).join(", ")}; npm run features -- list`,
    );
  if (entry.readFrom !== `features.${id}`)
    throw new Error(
      `features.${id} is not an election here; edit ${entry.readFrom}; npm run features -- list`,
    );
  return id;
}

const at = (value, key) =>
  key.split(".").reduce((entry, part) => entry?.[part], value);
const election = (value) => (typeof value === "boolean" ? value : value.on);

function legacyTinkerer(root, config) {
  if (!config.build.overlay) return undefined;
  const { value: overlay } = readBuildOverlayFile(root, config.build.overlay);
  const equipped = overlay.equip?.includes("tinkerer-economy");
  const unequipped = overlay.unequip?.includes("tinkerer-economy");
  if (equipped && unequipped)
    throw new Error("conflicting tinkerer-economy overlay choices");
  if (!equipped && !unequipped) return undefined;
  const value = Boolean(equipped);
  if (
    config.features["tinkerer-economy"] !== undefined &&
    election(config.features["tinkerer-economy"]) !== value
  )
    throw new Error(
      "conflicting tinkerer-economy elections; use features.tinkerer-economy in dotln.config.json and remove the old overlay choice",
    );
  console.warn(
    "Advisory: overlay tinkerer-economy is accepted for this kit release; use features.tinkerer-economy in dotln.config.json before the next release",
  );
  return value;
}

/** Hot-path elections do not read budgets, histories or generated documents. */
export function readFeatures(root) {
  const config = loadConfig(root);
  const legacy = legacyTinkerer(root, config);
  return Object.fromEntries(
    featureRegistry
      .filter((entry) => entry.readFrom === `features.${entry.id}`)
      .map((entry) => [
        entry.id,
        config.features[entry.id] === undefined
          ? entry.id === "tinkerer-economy" && legacy !== undefined
            ? legacy
            : entry.default
          : election(config.features[entry.id]),
      ]),
  );
}

/** Inventory sources distinguish explicit choices from defaults, including null. */
export function readFeatureInventory(root) {
  const config = loadConfig(root);
  const declared = config.present
    ? JSON.parse(readFileSync(config.path, "utf8"))
    : {};
  const budgetPath = docPath(root, "control", "budgets.json");
  const budgets = existsSync(budgetPath)
    ? JSON.parse(readFileSync(budgetPath, "utf8"))
    : {};
  // The spawn reader still uses the default root, unlike the process readers.
  const capSource = defaultDocRelative("control", "budgets.json");
  const capPath = join(root, capSource);
  const capBudget =
    capPath === budgetPath
      ? budgets
      : existsSync(capPath)
        ? JSON.parse(readFileSync(capPath, "utf8"))
        : {};
  const legacy = legacyTinkerer(root, config);
  return featureRegistry.map((entry) => {
    const budget = entry.readFrom.startsWith("budgets.");
    const key = budget
      ? entry.readFrom.slice("budgets.".length)
      : entry.readFrom;
    const sourceBudgets = entry.id === "subagent-cap" ? capBudget : budgets;
    let value = at(budget ? sourceBudgets : declared, key);
    const fromOverlay =
      entry.id === "tinkerer-economy" &&
      value === undefined &&
      legacy !== undefined;
    if (fromOverlay) value = legacy;
    const named = entry.readFrom.startsWith("features.");
    let effective =
      value === undefined ? entry.default : named ? election(value) : value;
    if (entry.id === "retention") effective = { ...entry.default, ...value };
    if (entry.id === "driven-session-ceiling" && value === undefined)
      effective =
        budgets.subagentCap === null ? null : 4 * (budgets.subagentCap ?? 20);
    return {
      ...entry,
      value: effective,
      source:
        value === undefined
          ? "default"
          : budget
            ? entry.id === "subagent-cap"
              ? capSource
              : docRelative(root, "control", "budgets.json")
            : "dotln.config.json",
      ...(named && value?.note !== undefined ? { note: value.note } : {}),
      ...(fromOverlay
        ? {
            note: `Legacy choice in ${config.build.overlay}; migrate to features.tinkerer-economy.`,
          }
        : {}),
    };
  });
}

export const notElectable = Object.freeze([
  "The refusal classes in the generated harness contract",
  "The single-writer reservation",
  "The clean-room floor",
]);

/** Only the template's known Secrets paragraph is generated. Custom floors are
 * not rewritten, and the caller admits this only for an exported instance. */
const privateDestinationAdmission = `This instance elects private-destination: ordinary project
links, private hostnames and account identifiers belonging to the owner's own
organisation are admitted inside this instance's repository. This admits no
material the owner has no right to keep here. Anything published outside the
instance still passes the private-terms and publication screens. `;

export function renderInstanceSecrets(floor, template, on) {
  const section = /^## Secrets\n\n([\s\S]*?)(?=\n\n## |$(?![\s\S]))/mu;
  const ordinary = template.match(section)?.[1];
  if (!ordinary) throw new Error("kit template has no Secrets paragraph");
  const privateSecrets = ordinary
    .replace(
      "credentials, tokens, private hostnames,\naccount identifiers or the contents",
      "credentials, tokens or the contents",
    )
    .replace("Environment\n", `${privateDestinationAdmission}Environment\n`);
  const current = floor.match(section);
  if (current && [ordinary, privateSecrets].includes(current[1])) {
    const start = current.index + "## Secrets\n\n".length;
    return (
      floor.slice(0, start) +
      (on ? privateSecrets : ordinary) +
      floor.slice(start + current[1].length)
    );
  }
  if (on)
    throw new Error(
      "private-destination requires the kit's Secrets paragraph; review the instance-owned custom floor before electing it",
    );
  return floor;
}
