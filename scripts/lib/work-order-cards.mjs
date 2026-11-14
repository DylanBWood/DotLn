// The work-order cards for a reader that may read no page and no Markdown:
// the resident, whose launcher hands it this source. The cards are the index
// command's own output and are derived again only when something they are
// derived from has changed.
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { configInputFiles, docPath } from "./config.mjs";
import { WORK_ORDER_AUTHORITY_ROOTS } from "./paths.mjs";

/** The files the cards are derived from, beside what Git itself holds: the
 * orders in the roots every reader of the orders enumerates (the catalog
 * and its derived child), the control logs in the root the instance
 * configures for them, the proposed sequence and the map that stands in
 * where an instance keeps one, the workstreams, the two observation
 * records, the first edition's release record and the instance's
 * configuration, which names its document roots and its historical orders.
 * A case of the index's own tests reads the index with its file reads
 * observed and holds every one to this list, so a source the index gains
 * is one this cache watches. */
export function cardInputFiles(root) {
  const control = docPath(root, "control");
  return {
    files: [
      // The configuration is read from two files, the second the
      // instance's models, which the loader opens whether or not it stands.
      ...configInputFiles(root),
      join(control, "resume.jsonl"),
      join(control, "release-history.json"),
      join(control, "workstream-observations.json"),
      docPath(root, "planning", "sequence.md"),
      docPath(root, "planning", "work-order-map.md"),
      docPath(root, "releases", "v0.2.0.md"),
    ],
    directories: [
      ...WORK_ORDER_AUTHORITY_ROOTS.map((key) => [docPath(root, key), ".md"]),
      [docPath(root, "orders"), ".jsonl"],
      [docPath(root, "workstreams"), ".md"],
    ],
  };
}

/** The size and time of every one of those files. */
function cardInputs(root) {
  const stamp = (path) => {
    try {
      const stat = statSync(path);
      return `${path}:${stat.size}:${stat.mtimeMs}`;
    } catch {
      return `${path}:absent`;
    }
  };
  const listed = (directory, extension) => {
    try {
      return readdirSync(directory)
        .filter((name) => name.endsWith(extension))
        .sort()
        .map((name) => stamp(join(directory, name)));
    } catch {
      return [`${directory}:absent`];
    }
  };
  const { files, directories } = cardInputFiles(root);
  return [
    ...files.map(stamp),
    ...directories.flatMap(([directory, extension]) =>
      listed(directory, extension),
    ),
  ].join("\n");
}

/** How long the index command may take before the read is given up and the
 * resident reports its work orders unavailable until the next read: it took
 * about six seconds over this repository's 270 orders. */
export const CARD_COMMAND_LIMIT_MS = 120_000;

/** The cards as the root's own index command prints them. */
const printedCards = (root) =>
  execFileSync(
    process.execPath,
    [join(root, "scripts/work-orders.mjs"), "index", "--json"],
    {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64_000_000,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: CARD_COMMAND_LIMIT_MS,
      killSignal: "SIGKILL",
    },
  );

/** A source of the cards as `npm run work-orders -- index --json` prints
 * them. Each call returns the text it last read unless a file the cards are
 * derived from has changed its size or its time; a command that fails throws,
 * the caller reports its work orders unavailable, and the next call reads
 * again. `read` stands in for the command in a test. */
export function workOrderCardSource(root, read = printedCards) {
  let inputs;
  let text;
  return () => {
    const now = cardInputs(root);
    if (now !== inputs) {
      text = read(root);
      inputs = now;
    }
    return text;
  };
}
