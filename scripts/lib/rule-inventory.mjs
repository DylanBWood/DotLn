import { adviseOnce, loadConfig } from "./config.mjs";
import { readBuildOverlayFile } from "./build-overlay.mjs";
import {
  AUTHOR_LAYER,
  contributorRules,
  contributorRuleSelection,
  contributorSupportIds,
} from "../../packages/skeleton/dist/src/loadouts/contributor.js";
import { isKitRoot } from "../../packages/skeleton/src/runtime-inputs.mjs";

/** The name an overlay gives every author-layer unit and rule at once. */
export { AUTHOR_LAYER };

/** The ids an overlay's equip and unequip lists may name: a support
 * switch, an author-layer unit or rule (or `author`, for all of them), and
 * the platform-layer rules, which stay equipped whatever a list says. */
export const OVERLAY_IDS = Object.freeze({
  supports: contributorSupportIds,
  selectable: [
    AUTHOR_LAYER,
    ...contributorRules
      .filter((rule) => rule.layer === "author")
      .map((rule) => rule.id),
  ],
  fixed: contributorRules
    .filter((rule) => rule.layer === "platform")
    .map((rule) => rule.id),
});

/** The author's units and rules a root's build overlay leaves out, read
 * from the overlay as the emit reads it, with the kit's ids and the root's
 * kind: core refuses an id the kit does not hold, and an instance is told
 * of it once and goes on. No overlay leaves nothing out, and an overlay
 * that selects no build leaves every rule out. */
export function readRuleSelection(root) {
  const path = loadConfig(root).build.overlay;
  const overlay = path
    ? readBuildOverlayFile(root, path, OVERLAY_IDS, {
        instance: isKitRoot(root),
        advise: adviseOnce,
      }).value
    : undefined;
  return {
    path: path ?? null,
    overlay,
    none: overlay?.build === "none",
    ...contributorRuleSelection(overlay),
  };
}

// A list as the overlay writes it. A line that sets a list prints the whole
// list it leaves, so that writing it keeps the ids the list already held.
const listed = (ids) => `[${ids.map((id) => JSON.stringify(id)).join(", ")}]`;

/** The edit of an overlay's two lists that changes whether one author
 * rule or unit is equipped and changes nothing else: the words the page
 * prints for it, and the lists as they would then stand. A rule is out
 * where its id is in `unequip`, or where the layer's name is and its id is
 * not in `equip`. One id in both lists refuses, so where the layer's name
 * would decide, a rule's own entry is dropped or moved, never doubled. */
export function ruleChange(id, { equip = [], unequip = [] } = {}) {
  const without = (list) => list.filter((entry) => entry !== id);
  const layerOut = unequip.includes(AUTHOR_LAYER);
  const inEquip = equip.includes(id);
  const inUnequip = unequip.includes(id);
  if (!inUnequip && !(layerOut && !inEquip)) {
    // Equipped. Kept by its own line beside the layer's name, dropping
    // that line leaves it to the name; otherwise it is named in `unequip`,
    // and an entry of its own in `equip` goes.
    if (layerOut)
      return {
        line: `remove "${id}" from "equip"`,
        equip: without(equip),
        unequip,
      };
    return inEquip
      ? {
          line: `move "${id}" from "equip" to "unequip"`,
          equip: without(equip),
          unequip: [...unequip, id],
        }
      : {
          line: `"unequip": ${listed([...unequip, id])}`,
          equip,
          unequip: [...unequip, id],
        };
  }
  // Left out. By its own line: dropping it restores the rule, unless the
  // layer's name would still leave it out, where it moves to `equip`. By
  // the layer's name alone: its own line in `equip` keeps it.
  if (inUnequip)
    return layerOut
      ? {
          line: `move "${id}" from "unequip" to "equip"`,
          equip: [...equip, id],
          unequip: without(unequip),
        }
      : {
          line: `remove "${id}" from "unequip"`,
          equip,
          unequip: without(unequip),
        };
  return {
    line: `"equip": ${listed([...equip, id])}`,
    equip: [...equip, id],
    unequip,
  };
}

/** Every rule the kit puts into a session's instructions beyond a role's
 * own steps, as this root's build carries it: the feedback units and the
 * shared role rules, each with its layer, how it is enforced, whether this
 * root equips it, who set that, the overlay line that changes it and, for
 * an author rule, the overlay's two lists as that change would leave them.
 * A platform rule has no line: every build carries it. */
export function readRuleInventory(root) {
  const selection = readRuleSelection(root);
  const named = (list, id) => (selection.overlay?.[list] ?? []).includes(id);
  return contributorRules.map((rule) => {
    const out =
      selection.units.includes(rule.id) || selection.rules.includes(rule.id);
    const row = {
      ...rule,
      equipped: !selection.none && !out,
    };
    if (selection.none)
      return {
        ...row,
        source: selection.path,
        line: `remove "build": "none" from ${selection.path}`,
      };
    if (rule.layer === "platform")
      return {
        ...row,
        source: "the kit",
        line: "none: every build carries it",
      };
    const { line, ...change } = ruleChange(rule.id, selection.overlay);
    return {
      ...row,
      // Named by the overlay where it leaves the rule out, or where its
      // own line keeps the rule in beside the name that leaves the layer
      // out.
      source:
        out || (named("unequip", AUTHOR_LAYER) && named("equip", rule.id))
          ? selection.path
          : "the kit",
      line,
      change,
    };
  });
}
