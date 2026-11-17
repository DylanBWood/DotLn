#!/usr/bin/env node
// npm run limits: every time limit of this root's gate, with what it bounds,
// the kit's figure, the figure that applies here and where that came from.
// npm run limits -- --write writes the root's file with every key, keeping
// what its owner set and refreshing each entry's record of the kit's figure.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  TIME_LIMITS,
  describeTimeLimit,
  renderTimeLimits,
  timeLimits,
  timeLimitsPath,
} from "../packages/skeleton/src/time-limits.mjs";

/** Where a row's figure came from, in the listing's words. */
const sourceOf = (entry, resolved) => {
  const scaled = resolved.scale === 1 ? "" : ` x scale ${resolved.scale}`;
  if (entry.source === "off") return `${resolved.file} (set: null)`;
  if (entry.source === "enforce") return `${resolved.file} (enforce: false)`;
  if (entry.source === "set") return `${resolved.file} (set)${scaled}`;
  return `the kit${scaled}`;
};

/** The listing: one line for every key of the table.
 * @param {string} root
 * @param {{table?: typeof TIME_LIMITS}} [options] */
export function listTimeLimits(root, { table = TIME_LIMITS } = {}) {
  const resolved = timeLimits(root, { table });
  const rows = Object.entries(table).map(([key, row]) => {
    const entry = resolved.limits[key];
    return {
      key,
      bounds: row.bounds,
      miss: row.miss,
      kitMs: row.ms,
      ms: entry.ms,
      source: sourceOf(entry, resolved),
    };
  });
  const lines = [
    `Time limits of this root: ${rows.length} keys. ${resolved.present ? `${resolved.file} is read` : `${resolved.file} is absent, so the kit's figures apply`}; enforce ${resolved.enforce}; scale ${resolved.scale}.`,
    ...resolved.advisories.map((text) => `ADVISORY time limits: ${text}`),
    // One line a key: the key, the kit's figure, the figure here and where
    // it came from, then what the limit bounds and what passing it does.
    ...rows.map(
      (row) =>
        `${row.key} | kit ${describeTimeLimit(row.kitMs)} | here ${row.ms === null ? "off" : describeTimeLimit(row.ms)}, from ${row.source} | bounds ${row.bounds} | passing it: ${row.miss}`,
    ),
    `Raise one with its set, multiply all with scale or turn all off with enforce: false in ${resolved.file}; npm run limits -- --write writes that file with every key.`,
  ];
  return { resolved, rows, text: lines.join("\n") };
}

/** Write the root's file with every key of the table. What the owner set is
 * written back as it was; each entry's `kit` becomes the table's figure.
 * @param {string} root
 * @param {{table?: typeof TIME_LIMITS}} [options] */
export function writeTimeLimits(root, { table = TIME_LIMITS } = {}) {
  const file = timeLimitsPath(root);
  const path = join(root, file);
  let previous;
  let before = null;
  // A file that is present and that this kit cannot read as its own is its
  // owner's to repair: rewriting it would discard whatever it held, and
  // would turn back on what it had turned off.
  const refuse = (why) =>
    new Error(
      `${file} ${why}; repair or remove it, then run npm run limits -- --write again`,
    );
  try {
    before = readFileSync(path, "utf8");
    previous = JSON.parse(before);
  } catch (error) {
    if (error.code !== "ENOENT")
      throw refuse(`cannot be read (${error.message})`);
  }
  if (before !== null) {
    if (
      typeof previous !== "object" ||
      previous === null ||
      Array.isArray(previous)
    )
      throw refuse(`holds ${JSON.stringify(previous)}, not an object`);
    if (previous.schemaVersion !== undefined && previous.schemaVersion !== 1)
      throw refuse(
        `has schemaVersion ${JSON.stringify(previous.schemaVersion)}, which this kit does not read`,
      );
  }
  const text = renderTimeLimits(previous, { table });
  if (text !== before) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  return { file, created: before === null, changed: text !== before };
}

if (isMainModule(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || (args.length === 1 && args[0] !== "--write"))
      throw new Error("usage: npm run limits [-- --write]");
    const root = findLaunchpad();
    if (args[0] === "--write") {
      const written = writeTimeLimits(root);
      console.log(
        written.created
          ? `Wrote ${written.file} with every key at the kit's figure.`
          : written.changed
            ? `Wrote ${written.file}: every key is present, each set is as it was and each kit is this release's figure.`
            : `${written.file} already holds every key at this release's figures; nothing written.`,
      );
    } else console.log(listTimeLimits(root).text);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
