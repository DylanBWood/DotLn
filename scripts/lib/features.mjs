import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  declaredElections,
  docPath,
  docRelative,
  loadConfig,
} from "./config.mjs";
import { readBuildOverlayFile } from "./build-overlay.mjs";
import { containedRegularFile } from "./paths.mjs";
import { markdownSection } from "./markdown-links.mjs";
import {
  featureAliases,
  featureRegistry,
  resolveFeatureId,
} from "./feature-registry.mjs";
import { isKitRoot } from "../../packages/skeleton/src/runtime-inputs.mjs";
import {
  STOPS,
  resolveStop,
  stopLine,
  stopSettable,
} from "../../packages/skeleton/src/stops.mjs";

export { featureAliases, featureRegistry, resolveFeatureId };

const at = (value, key) =>
  key.split(".").reduce((entry, part) => entry?.[part], value);
const election = (value) => (typeof value === "boolean" ? value : value.on);

/** Each host row and the harness name its record carries (WO-258). */
export const HOST_FEATURES = Object.freeze({
  "host-codex": "codex-cli",
  "host-copilot": "copilot-cli",
});

/** What this instance's own committed record shows about each host: the
 * control log's attestations naming its harness (the legacy log and every
 * order segment, the two locations the control store reads), each a phase
 * the operator ran under that host. The discovery record's observed versions
 * are read and reported, never counted: an inspection that found a CLI on
 * the machine is not the operator using it (WO-275). The ignored session
 * journals are never read, so a fresh clone infers what its origin infers. A
 * record that cannot be read shows nothing, which leaves the host off. */
export function hostRecord(root) {
  const legacy = docRelative(root, "control", "resume.jsonl");
  const orders = docRelative(root, "orders");
  const harnesses = Object.values(HOST_FEATURES);
  const counts = new Map(
    harnesses.map((harness) => [harness, { [legacy]: 0, [`${orders}/`]: 0 }]),
  );
  const scan = (path, segment) => {
    if (!containedRegularFile(join(root, path), root)) return;
    for (const line of readFileSync(join(root, path), "utf8").split("\n")) {
      // Most rows name no other host; parse only a row that could.
      if (!harnesses.some((harness) => line.includes(harness))) continue;
      let harness;
      try {
        harness = JSON.parse(line)?.actor?.harness;
      } catch {
        continue;
      }
      if (counts.has(harness)) counts.get(harness)[segment]++;
    }
  };
  scan(legacy, legacy);
  let names = [];
  try {
    names = readdirSync(join(root, orders)).sort();
  } catch {
    // A launchpad with no order segments yet has attested nothing there.
  }
  for (const name of names)
    if (name.endsWith(".jsonl")) scan(`${orders}/${name}`, `${orders}/`);
  const discovery = docRelative(root, "discovery", "environment.json");
  let probe = null;
  try {
    if (containedRegularFile(join(root, discovery), root))
      probe = JSON.parse(readFileSync(join(root, discovery), "utf8"))
        ?.effortReadbackProbe?.harnesses;
  } catch {
    probe = null;
  }
  return Object.fromEntries(
    Object.entries(HOST_FEATURES).map(([id, harness]) => {
      const attestations = Object.entries(counts.get(harness)).filter(
        ([, count]) => count > 0,
      );
      const observed =
        Array.isArray(probe?.[harness]?.versions) &&
        probe[harness].versions.some(
          (version) => version?.classification === "observed",
        );
      // Each record row that shows the host, named for the inventory; the
      // discovery record is named apart, as a row that shows no host.
      const rows = attestations.map(([path]) => `${path} attestations`);
      return [
        id,
        {
          harness,
          shown: rows.length > 0,
          rows,
          attestations: Object.fromEntries(attestations),
          observed,
          ...(observed ? { discovered: `${discovery} observed versions` } : {}),
        },
      ];
    }),
  );
}

/** The build overlay's tinkerer-economy choice was accepted with a migration
 * advisory through kit release v0.118.0 and is refused since: the election
 * lives in features.tinkerer-economy, so a reader never has two sources. */
export const RETIRED_OVERLAY_TINKERER =
  "the build overlay's tinkerer-economy choice is retired: it was accepted with an advisory through kit release v0.118.0; elect features.tinkerer-economy in dotln.config.json and remove the overlay entry (npm run features -- list)";
function refuseRetiredOverlay(root, config) {
  if (!config.build.overlay) return;
  // Read for the one retired id, without the kit's ids, which need a
  // build: the root's kind is passed so that an instance's overlay is
  // judged here as its other readers judge it.
  const { value: overlay } = readBuildOverlayFile(
    root,
    config.build.overlay,
    undefined,
    { instance: isKitRoot(root) },
  );
  if (
    [...(overlay.equip ?? []), ...(overlay.unequip ?? [])].includes(
      "tinkerer-economy",
    )
  )
    throw new Error(RETIRED_OVERLAY_TINKERER);
}

/** Hot-path elections do not read budgets, histories or generated documents.
 * An undeclared host row is the one inference from the record: it is read
 * only when that row is read, so a caller asking for another election never
 * scans the control log. */
export function readFeatures(root) {
  const config = loadConfig(root);
  refuseRetiredOverlay(root, config);
  let record;
  const features = {};
  for (const entry of featureRegistry.filter(
    (entry) => entry.readFrom === `features.${entry.id}`,
  )) {
    const declared = config.features[entry.id];
    if (declared === undefined && Object.hasOwn(HOST_FEATURES, entry.id))
      Object.defineProperty(features, entry.id, {
        enumerable: true,
        configurable: true,
        get: () => (record ??= hostRecord(root))[entry.id].shown,
      });
    else
      features[entry.id] =
        declared === undefined ? entry.default : election(declared);
  }
  return features;
}

/** The host elections a fresh export starts with: no election and no record,
 * so every host but Claude is off. The export predicts its bundle with these,
 * as its own emit will read them. */
export const freshHostFeatures = () =>
  Object.fromEntries(Object.keys(HOST_FEATURES).map((id) => [id, false]));

/** A destination's host rows alone, election or inference: what a kit update
 * predicts that destination's own emit will select. Only the host elections
 * are read, so an update's prediction does not depend on its other choices. */
export function readHostFeatures(root) {
  const declared = loadConfig(root).features;
  let record;
  return Object.fromEntries(
    Object.keys(HOST_FEATURES).map((id) => [
      id,
      declared[id] === undefined
        ? (record ??= hostRecord(root))[id].shown
        : election(declared[id]),
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
  const hosts = hostRecord(root);
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
    let source =
      value === undefined
        ? "default"
        : budget
          ? docRelative(root, "control", "budgets.json")
          : "dotln.config.json";
    const host = hosts[entry.id];
    if (host) {
      // The election wins; without one the attestations decide. The source
      // names the record's rows, not their count, so the generated page
      // changes when a host turns on, not with every attestation (the count
      // is in the JSON listing's record field). A discovery record that
      // observed the host's version is named where it is the only row, so an
      // operator sees why a host an inspection found stays off.
      if (value === undefined) effective = host.shown;
      source =
        value !== undefined
          ? `elected${host.shown ? ` (the record shows the host: ${host.rows.join("; ")})` : ""}`
          : host.shown
            ? `inferred: ${host.rows.join("; ")}`
            : host.discovered
              ? `default (${host.discovered} show the host without an election; a discovery record turns no host on)`
              : "default";
    }
    return {
      ...entry,
      value: effective,
      source,
      ...(host
        ? {
            record: {
              harness: host.harness,
              attestations: host.attestations,
              observedVersions: host.observed,
            },
          }
        : {}),
      ...(named && value?.note !== undefined ? { note: value.note } : {}),
    };
  });
}

/** Every stop of the table as this root answers it. A row is one of four
 * kinds. A `stop` has a level here, set by the kit for the root's kind or by
 * a line of the root's `stops` section, and names the line that changes it.
 * A `switch` keeps a switch of its own and a `file` is set in a file of its
 * own, each named in place of a line. A `command` is a lifecycle command's
 * refusal, which no level changes, listed with its way forward.
 * `unequipped` names the feedback units the root's build overlay leaves
 * out, each with the overlay line that restores it: a unit that also
 * refuses takes its refusal with it, so its stop reads `off`, set by the
 * overlay, and a line of the stops section that asks a level of it is
 * marked as having no effect. The caller reads the overlay, since the units
 * are the compiled loadout's and this module loads without a build. */
export function readStopInventory(root, { unequipped = {} } = {}) {
  const config = loadConfig(root);
  const stops = config.stops;
  const elections = declaredElections(config);
  const instance = isKitRoot(root);
  return STOPS.map((row) => {
    if (row.forward !== undefined) return { ...row, kind: "command" };
    if (row.unit !== undefined && Object.hasOwn(unequipped, row.unit))
      return {
        ...row,
        kind: "stop",
        level: "off",
        source: `the build overlay, which leaves out the unit ${row.unit}${Object.hasOwn(stops, row.id) ? "; this root's stops line for it has no effect" : ""}`,
        line: unequipped[row.unit],
      };
    if (row.setBy !== undefined)
      return { ...row, kind: "switch", source: row.setBy, line: row.setBy };
    if (row.file !== undefined) {
      // The file a stop is set in follows the root's own control root.
      const file = docRelative(root, "control", row.control);
      return { ...row, kind: "file", file, source: file, line: file };
    }
    const { level, source } = resolveStop(row.id, {
      instance,
      stops,
      elections,
    });
    return {
      ...row,
      kind: "stop",
      level,
      source: source === "kit" ? "the kit" : source,
      line: stopLine(row.id, level === "refuse" ? "advise" : "refuse"),
    };
  });
}
/** The settable stops of the table, for a caller that counts them. */
export const settableStops = () => STOPS.filter(stopSettable);

/** Only the template's known Secrets paragraph is generated. Custom floors are
 * not rewritten, and the caller admits this only for an exported instance. */
const privateDestinationAdmission = `This instance elects private-destination: ordinary project
links, private hostnames and account identifiers belonging to the owner's own
organisation are admitted inside this instance's repository. This admits no
material the owner has no right to keep here. Anything published outside the
instance still passes the private-terms and publication screens. `;

/** A document's `## Secrets` section as written, from its first block to
 * its last, and the offset that text starts at; null without the section. */
const secretsSection = (source) => {
  const section = markdownSection(source, "Secrets", { depths: [2] });
  if (!section) return null;
  const text = section.body.trim();
  return {
    text,
    start:
      section.bodyStart + section.body.length - section.body.trimStart().length,
  };
};

export function renderInstanceSecrets(floor, template, on) {
  const ordinary = secretsSection(template)?.text;
  if (!ordinary) throw new Error("kit template has no Secrets paragraph");
  const privateSecrets = ordinary
    .replace(
      "credentials, tokens, private hostnames,\naccount identifiers or the contents",
      "credentials, tokens or the contents",
    )
    .replace("Environment\n", `${privateDestinationAdmission}Environment\n`);
  const current = secretsSection(floor);
  if (current && [ordinary, privateSecrets].includes(current.text))
    return (
      floor.slice(0, current.start) +
      (on ? privateSecrets : ordinary) +
      floor.slice(current.start + current.text.length)
    );
  if (on)
    throw new Error(
      "private-destination requires the kit's Secrets paragraph; review the instance-owned custom floor before electing it",
    );
  return floor;
}
