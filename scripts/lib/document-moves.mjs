// A moved document keeps its bytes. Records are never rewritten, so a link a
// record wrote before the move still names the old path; this one map says
// where each old path lives now. Every reader of a document reference
// resolves it with `referencePath` or `currentPath` below, so the document
// check, the entry points and reader bindings, the red tags, the read census,
// plan documents and the kit export name the same document for the same
// reference: a moved document's own relative links resolve from the
// directory it was written in, and an old path the map lists names the
// document where it lives now. A moved path is never reused (the document
// check refuses a file there), so an old path names one document whenever a
// session read it or a record linked it.
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { docPath, docRelative } from "./config.mjs";

export const MOVES_FILE = "document-moves.json";

export function readMovedDocuments(root) {
  const path = docPath(root, "control", MOVES_FILE);
  if (!existsSync(path)) return [];
  const label = docRelative(root, "control", MOVES_FILE);
  let record;
  try {
    record = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error(`${label}: invalid JSON`);
  }
  if (record?.schemaVersion !== 1 || !Array.isArray(record.moves))
    throw new Error(`${label}: needs schemaVersion 1 and a moves list`);
  const seen = new Set();
  for (const move of record.moves) {
    const valid = (value) =>
      typeof value === "string" &&
      value.length > 0 &&
      !value.startsWith("/") &&
      posix.normalize(value) === value &&
      !value.split("/").includes("..");
    if (!valid(move?.from) || !valid(move?.to) || move.from === move.to)
      throw new Error(
        `${label}: each move needs distinct repository-relative from and to paths`,
      );
    if (
      typeof move.workOrder !== "string" ||
      !/^WO-\d{3,}$/u.test(move.workOrder)
    )
      throw new Error(
        `${label}: ${move.from} needs the work order that moved it`,
      );
    if (seen.has(move.from))
      throw new Error(`${label}: ${move.from} is moved twice`);
    seen.add(move.from);
  }
  return record.moves;
}

/** Old path to new path, and new path to the path it was written at. A
 * caller that read the map elsewhere, at a commit, passes its moves. */
export function moveIndex(root, moves = readMovedDocuments(root)) {
  return {
    to: new Map(moves.map((move) => [move.from, move.to])),
    from: new Map(moves.map((move) => [move.to, move.from])),
  };
}

/** Where the document a repository path names lives now: the destination
 * the map lists for a moved path, else the path itself. */
export function currentPath(index, path) {
  return index.to.get(path) ?? path;
}

/** The repository path a reference written in `from` names. A reference
 * that starts with a slash is read from the repository root and any other
 * from the directory `from` was written in, then through the map. The result
 * is normalized and repository-relative, and starts with ../ when the
 * reference leaves the repository. */
export function referencePath(index, from, reference) {
  const written = index.from.get(from) ?? from;
  const path = posix
    .normalize(
      reference.startsWith("/")
        ? reference.replace(/^\/+/u, "")
        : posix.join(posix.dirname(written), reference),
    )
    .replace(/(.)\/+$/u, "$1");
  return currentPath(index, path);
}

/** The old paths a file holds again. A reused path would give every record
 * link and every session read of it two documents, so the document check
 * refuses each one. */
export function reusedPaths(root, index) {
  return [...index.to.entries()]
    .filter(([from]) => existsSync(join(root, from)))
    .map(([from, to]) => ({ from, to }));
}
