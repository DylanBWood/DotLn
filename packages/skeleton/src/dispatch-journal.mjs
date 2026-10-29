import { existsSync, readdirSync, readFileSync } from "node:fs";
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

/** Read and validate one journal with the same path-bearing error at every entry.
 * @param {string} file */
export function readDispatchJournal(file) {
  try {
    return boundJournal(JSON.parse(readFileSync(file, "utf8")));
  } catch (error) {
    throw new DispatchJournalError(file, error);
  }
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
