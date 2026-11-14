import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Physical journal lane retained by the installed harness until loader migration.
 * @param {string} root */
export const dispatchJournalDirectory = (root) =>
  join(root, "docs/control/local/harness");

export class DispatchJournalError extends Error {
  /** @param {string} file @param {unknown} cause */
  constructor(file, cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    super(`Invalid dispatch journal ${file}: ${detail.slice(0, 160)}`);
    this.file = file;
    this.detail = detail;
  }
}

/** @param {import("./harness-host.js").HarnessSession | null | undefined} journal */
export const boundJournal = (journal) => {
  if (journal?.boundDispatch === undefined) return journal;
  const bound = journal.boundDispatch;
  if (
    !bound ||
    typeof bound.role !== "string" ||
    typeof bound.intent !== "string" ||
    !Number.isFinite(Date.parse(bound.startedAt)) ||
    typeof bound.phaseBoundary !== "string" ||
    (bound.unavailable !== undefined &&
      (typeof bound.unavailable !== "string" || !bound.unavailable))
  )
    throw new Error("Invalid dispatch-bound journal anchor");
  return bound;
};

/** Whether a dispatch names a work order, by its line: an order's own phase
 * (the resume phrases an executor, a verifier, a reviewer and a release
 * close are dispatched by) or a drive of one order. A planning pass, a
 * refutation and any other dispatch name none, whatever order the checkout's
 * control record happens to select: such a dispatch starts at its own
 * session and shares no attempt with an earlier session on the same line.
 * @param {unknown} intent */
export const dispatchNamesOrder = (intent) =>
  typeof intent === "string" &&
  (/^resume: (?:next|fix|verify|final review|release close)\b/u.test(intent) ||
    /^drive: WO-\d{3,}\b/u.test(intent));

/** Read and validate one journal with the same path-bearing error at every entry.
 * @param {string} file */
export function readDispatchJournal(file) {
  try {
    return boundJournal(JSON.parse(readFileSync(file, "utf8")));
  } catch (error) {
    throw new DispatchJournalError(file, error);
  }
}
/** The rows of a journal kept as one JSON object a line (a session's
 * `<key>.jsonl`, the usage ledger): every line that parses to an object, in
 * the file's order. A missing file has no rows. A line that does not parse,
 * such as a write cut short, is passed over, because the rows around it
 * still stand. Anything but a regular file is refused.
 * @param {string} file @returns {Record<string, any>[]} */
export function readJournalRows(file) {
  if (!existsSync(file)) return [];
  const entry = lstatSync(file);
  if (!entry.isFile() || entry.isSymbolicLink())
    throw new Error("Observation source is not a regular file");
  return readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const value = JSON.parse(line);
        return value && typeof value === "object" ? [value] : [];
      } catch {
        return [];
      }
    });
}
/** @param {string} dir */
export function readDispatchJournals(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => /^[a-f0-9]{64}\.json$/u.test(name))
    .flatMap((name) => {
      const journal = readDispatchJournal(join(dir, name));
      return journal?.role &&
        Number.isFinite(Date.parse(journal.startedAt ?? ""))
        ? [{ key: name.slice(0, -5), journal }]
        : [];
    });
}
