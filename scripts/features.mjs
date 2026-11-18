#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  docPath,
  docRelative,
  findLaunchpad,
  TOOL_ROOT,
} from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { readFeatureInventory, readStopInventory } from "./lib/features.mjs";
import { isKitRoot } from "../packages/skeleton/src/runtime-inputs.mjs";
import { readControl } from "./lib/control-store.mjs";
import { formatDuration } from "./lib/duration.mjs";

// The rules are records of the compiled loadout. A source checkout that has
// not built yet has none: the feature values still print, and a command
// that prints a rule or a stop says to build first. An instance carries the
// compiled loadout with its kit, so one without it is a damaged kit, which
// the kit's verification names.
const ruleInventory = existsSync(
  new URL(
    "../packages/skeleton/dist/src/loadouts/contributor.js",
    import.meta.url,
  ),
)
  ? await import("./lib/rule-inventory.mjs")
  : null;
const builtRules = () => {
  if (!ruleInventory)
    throw new Error(
      `the features page reads its rules from the compiled loadout, which is missing here; ${isKitRoot(TOOL_ROOT) ? "restore the kit files node scripts/launchpad.mjs verify names" : "run npm run build"}, then run this command again`,
    );
  return ruleInventory;
};
const readRuleInventory = (root) => builtRules().readRuleInventory(root);
const readRuleSelection = (root) => builtRules().readRuleSelection(root);

const cell = (value) =>
  String(typeof value === "string" ? value : JSON.stringify(value))
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")
    .replaceAll("`", "&#96;")
    .replace(/\r?\n/gu, "<br>");

const display = (id, value) => {
  if (value === null) return "null";
  if (id === "retention")
    return Object.entries(value)
      .map(
        ([key, hours]) =>
          `${key}: ${hours === null ? "keep" : formatDuration(hours * 3600000)}`,
      )
      .join("; ");
  if (id === "driven-phase-timeout" || id === "prune-start-budget")
    return formatDuration(value);
  if (id === "dispatch-bounds")
    return Object.entries(value)
      .map(([role, limits]) => {
        const describe = (limits) =>
          Object.entries(limits)
            .map(([key, bound]) =>
              key === "repair"
                ? `repair (${describe(bound)})`
                : `${key}: ${key === "wallClockMs" && typeof bound === "number" ? formatDuration(bound) : bound}`,
            )
            .join(", ");
        return `${role}: ${describe(limits)}`;
      })
      .join("; ");
  return value;
};

const table = (header, rows) =>
  `| ${header.join(" | ")} |\n| ${header.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.map(cell).join(" | ")} |`).join("\n")}`;

/** The stops as this root's build answers them: a unit the overlay's lists
 * leave out takes its refusal with it. An overlay that selects no build
 * names no unit: it writes no hook here at all, and a registered target
 * worktree's guards are emitted all the same, so each stop is printed at
 * the level those guards answer at. */
const stopInventory = (root, rules = readRuleInventory(root)) =>
  readStopInventory(root, {
    unequipped: readRuleSelection(root).none
      ? {}
      : Object.fromEntries(
          rules
            .filter((rule) => rule.kind === "unit" && !rule.equipped)
            .map((rule) => [rule.id, rule.line]),
        ),
  });

/** The rules the kit puts into a session's instructions beyond a role's own
 * steps, as this root's build carries them: one row for each feedback unit
 * and each shared role rule. */
export function renderRules(root, rules = readRuleInventory(root)) {
  return `## Rules\n\nA rule is a sentence the kit puts into a session's instructions beyond a role's own numbered steps: one of the feedback units or one of the shared role rules. Its layer says whose it is. A \`platform\` rule says how a kit command, phrase, record, file, bound or hook works; a session needs it to operate the lifecycle, and every build carries it. An \`author\` rule says how the kit's author wants work conducted: no kit mechanism needs the sentence, and it is this root's owner's to keep or remove.\n\nAn author rule is removed by its id in the \`unequip\` list of the build overlay (the file \`build.overlay\` names in \`dotln.config.json\`), and all of them by the name \`author\`; \`equip\` restores one beside that name. \`node scripts/harness.mjs emit\` then writes the role text, the hooks and the settings without it, and \`npm run meta\` this page. A unit that also refuses takes its refusal with it: its stop reads \`off\` below. A role's numbered steps are not rules of this table and stay as they are.\n\n${table(
    [
      "Rule",
      "Kind",
      "Layer",
      "How it is enforced",
      "Equipped here",
      "Set by",
      "The overlay line that changes it",
    ],
    rules.map((rule) => [
      rule.id,
      rule.kind === "unit" ? "feedback unit" : "shared rule",
      rule.layer,
      `${rule.enforcement}${rule.stop ? `; its refusal is the stop ${rule.stop}` : ""}`,
      rule.equipped ? "yes" : "no",
      rule.source,
      rule.line,
    ]),
  )}\n`;
}

/** The stops of the table as this root answers them, in two tables: the
 * stops with a level, a switch or a file, and what a lifecycle command
 * declines. */
export function renderStops(root, stops = stopInventory(root)) {
  const levelled = stops.filter((row) => row.kind !== "command");
  const commands = stops.filter((row) => row.kind === "command");
  return `## Stops\n\nA stop is a place where a hook denies a tool call, a gate task fails a run for a reason other than the code under test, or a lifecycle command declines its own job. A row's class is what it protects: \`work\` is the owner's work or private material, \`record\` the kit's own records, order or form, \`host\` a property of the machine and \`bound\` a budget. A level is \`refuse\`, \`advise\` (the stop says what it found and the work goes on) or \`off\`.\n\n${isKitRoot(root) ? "This root is an exported instance: where no line of its own says otherwise, a work stop refuses and every other stop advises." : "This root is core, which builds the kit: where no line of its own says otherwise, every stop refuses."} A level is its owner's to change, with one line of the \`stops\` section of \`dotln.config.json\`; \`node scripts/harness.mjs emit\` then carries it into the hooks and \`npm run meta\` into this page. A session changes one only when its owner asks for it in that session.\n\n${table(
    [
      "Stop",
      "Class",
      "What it protects",
      "Where it is enforced",
      "Level here",
      "Set by",
      "The line or file that changes it",
    ],
    levelled.map((row) => [
      row.id,
      row.class,
      row.protects,
      row.where,
      row.kind === "stop"
        ? row.level
        : row.kind === "switch"
          ? "by its own switch"
          : "in its own file",
      row.source,
      row.line,
    ]),
  )}\n\n### What a lifecycle command declines\n\nA command that declines its own job is no stop with a level: nothing here changes it, and each is listed with its way forward.\n\n${table(
    ["Refusal", "Class", "What it protects", "Where", "Way forward"],
    commands.map((row) => [
      row.id,
      row.class,
      row.protects,
      row.where,
      row.forward,
    ]),
  )}\n`;
}

export function renderFeatures(root) {
  const rows = readFeatureInventory(root);
  const rules = readRuleInventory(root);
  return `# Feature elections\n\nGenerated by \`npm run features -- render\`; edit \`dotln.config.json\` or the named budget key, then run \`npm run meta\`.\n\nScope describes ownership: core rows describe core's release surfaces; instance rows are local choices; both apply in either setting. Unread switches have no effect. A queued order is a future consumer. The driven session ceiling defaults to four times the subagent cap.\n\n| Feature | Scope | Default | Effective value | Source | What it does | Election key | Read by | Note |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.map((entry) => `| ${[entry.id, entry.scope, display(entry.id, entry.default), display(entry.id, entry.value), entry.source, entry.what, entry.readFrom, entry.readBy, entry.note ?? ""].map(cell).join(" | ")} |`).join("\n")}\n\n${renderRules(root, rules)}\n${renderStops(root, stopInventory(root, rules))}`;
}

export function featureAdvisories(
  root,
  inventory = readFeatureInventory(root),
) {
  const messages = [];
  for (const entry of inventory) {
    if (
      !/^(core|instance|both)$/u.test(entry.scope) ||
      !entry.what ||
      !entry.readFrom
    )
      throw new Error(`invalid feature registry row: ${entry.id}`);
    if (entry.readBy === "unread") continue;
    if (/^WO-\d{3}$/u.test(entry.readBy)) {
      // A future consumer is a registry declaration, not a dependency on the
      // core order archive in every copied or installed runtime.
      if (readControl(root).orders.get(entry.readBy)?.state.phase === "closed")
        messages.push(
          `feature ${entry.id}: ${entry.readBy} has closed; the next planning pass should identify and register its consumer`,
        );
    } else {
      const emitted = entry.readBy
        .replace(/^packages\/([^/]+)\/src\//u, "packages/$1/dist/src/")
        .replace(/\.ts$/u, ".js");
      if (
        !existsSync(join(TOOL_ROOT, entry.readBy)) &&
        !existsSync(join(TOOL_ROOT, emitted))
      )
        throw new Error(`feature ${entry.id}: missing reader ${entry.readBy}`);
    }
  }
  return messages;
}

export function writeFeatures(root, { check = false } = {}) {
  const text = renderFeatures(root);
  const path = docPath(root, "control", "FEATURES.md");
  if (check) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== text)
      throw new Error(
        `stale ${docRelative(root, "control", "FEATURES.md")}; run npm run features -- render`,
      );
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  return path;
}

export function featuresMain(
  args = process.argv.slice(2),
  root = findLaunchpad(),
) {
  const [command, ...flags] = args;
  if (
    !["list", "rules", "stops", "render", "check", "--check"].includes(
      command,
    ) ||
    (flags.length &&
      !(
        ["list", "rules", "stops"].includes(command) &&
        flags.length === 1 &&
        flags[0] === "--json"
      ))
  )
    throw new Error(
      "usage: npm run features -- list [--json]|rules [--json]|stops [--json]|render|check",
    );
  if (command === "list")
    console.log(
      flags.length
        ? JSON.stringify(readFeatureInventory(root), null, 2)
        : renderFeatures(root),
    );
  else if (command === "rules")
    console.log(
      flags.length
        ? JSON.stringify(readRuleInventory(root), null, 2)
        : renderRules(root),
    );
  else if (command === "stops")
    console.log(
      flags.length
        ? JSON.stringify(stopInventory(root), null, 2)
        : renderStops(root),
    );
  else {
    for (const message of featureAdvisories(root))
      console.warn(`Advisory: ${message}`);
    writeFeatures(root, { check: command !== "render" });
    console.log(`Features ${command === "render" ? "rendered" : "current"}.`);
  }
}

if (isMainModule(import.meta.url)) {
  try {
    featuresMain();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
