import { existsSync, readFileSync } from "node:fs";
import { docPath, docRelative, loadConfig } from "./config.mjs";
import { readBuildOverlayFile } from "./build-overlay.mjs";
import {
  featureAliases,
  featureRegistry,
  resolveFeatureId,
} from "./feature-registry.mjs";

export { featureAliases, featureRegistry, resolveFeatureId };

const at = (value, key) =>
  key.split(".").reduce((entry, part) => entry?.[part], value);
const election = (value) => (typeof value === "boolean" ? value : value.on);

/** The build overlay's tinkerer-economy choice was accepted with a migration
 * advisory through kit release v0.118.0 and is refused since: the election
 * lives in features.tinkerer-economy, so a reader never has two sources. */
export const RETIRED_OVERLAY_TINKERER =
  "the build overlay's tinkerer-economy choice is retired: it was accepted with an advisory through kit release v0.118.0; elect features.tinkerer-economy in dotln.config.json and remove the overlay entry (npm run features -- list)";
function refuseRetiredOverlay(root, config) {
  if (!config.build.overlay) return;
  const { value: overlay } = readBuildOverlayFile(root, config.build.overlay);
  if (
    [...(overlay.equip ?? []), ...(overlay.unequip ?? [])].includes(
      "tinkerer-economy",
    )
  )
    throw new Error(RETIRED_OVERLAY_TINKERER);
}

/** Hot-path elections do not read budgets, histories or generated documents. */
export function readFeatures(root) {
  const config = loadConfig(root);
  refuseRetiredOverlay(root, config);
  return Object.fromEntries(
    featureRegistry
      .filter((entry) => entry.readFrom === `features.${entry.id}`)
      .map((entry) => [
        entry.id,
        config.features[entry.id] === undefined
          ? entry.default
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
  refuseRetiredOverlay(root, config);
  return featureRegistry.map((entry) => {
    const budget = entry.readFrom.startsWith("budgets.");
    const key = budget
      ? entry.readFrom.slice("budgets.".length)
      : entry.readFrom;
    const value = at(budget ? budgets : declared, key);
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
            ? docRelative(root, "control", "budgets.json")
            : "dotln.config.json",
      ...(named && value?.note !== undefined ? { note: value.note } : {}),
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
