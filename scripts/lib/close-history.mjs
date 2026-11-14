// The retained history of a release close, read without writing it. An
// order's close record holds its latest attempt and the eight before it;
// each attempt also archived, under the record's `attempts/` directory and
// named by its bytes' digest, the record it found, so the archives a record
// names hold every earlier attempt. The close reads them to carry what an
// earlier attempt did, and the drive reads them to know whether the order
// was closed: both read here, so neither sees a shorter history.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { docRelative } from "./config.mjs";
import { sha256Hex } from "./helpers.mjs";
import { requireMaterialContainment } from "./worktree-material.mjs";

/** Where an order's close attempts are archived, relative to the root. */
export const closeAttemptsRoot = (root, order) =>
  docRelative(root, "control", `local/retained/${order}/attempts/`);

/** Whether a parsed close record is one of `order` this reader understands. */
export const readableCloseAttempt = (attempt, order) =>
  attempt &&
  attempt.schemaVersion === 1 &&
  attempt.workOrderId === order &&
  Array.isArray(attempt.previousAttempts ?? []);

/** A close record's own attempt, without the history it carries. */
export const flatCloseAttempt = ({
  previousAttempts: _previous,
  archivedAttempts: _archives,
  historyFailure: _failure,
  retainedHistoryAttempt: _retained,
  ...attempt
}) => attempt;

/** Every attempt the named archives hold, in the order named: each archive's
 * earlier attempts, the attempt it retained after a history failure, and its
 * own. An archive is read only from the order's own attempts directory,
 * through no symbolic link, and only where its bytes still have the digest
 * its name states and its record is the order's. Reading stops at the first
 * archive that cannot be read so: `failure` then names it (`archive` is null
 * for a name outside the order's history) with the cause, and `attempts`
 * holds what the archives before it gave. Nothing is written.
 * @param {string} root @param {string} order
 * @param {readonly unknown[]} archives root-relative archive paths
 * @returns {{attempts: object[], failure: {archive: string|null, cause: string}|null}} */
export function archivedCloseAttempts(root, order, archives) {
  const prefix = closeAttemptsRoot(root, order).replace(/\/$/u, "") + "/";
  const attempts = [];
  for (const name of archives) {
    const named =
      typeof name === "string" &&
      name.startsWith(prefix) &&
      /^[a-f0-9]{64}\.json$/u.test(name.slice(prefix.length));
    try {
      if (!named) throw new Error("outside order history");
      requireMaterialContainment(root, name);
      const content = readFileSync(join(root, name), "utf8");
      if (!name.endsWith(`/${sha256Hex(content)}.json`))
        throw new Error("archive hash differs");
      const attempt = JSON.parse(content);
      if (!readableCloseAttempt(attempt, order))
        throw new Error("archive belongs to another order");
      attempts.push(
        ...(attempt.previousAttempts ?? []),
        ...(attempt.retainedHistoryAttempt
          ? [attempt.retainedHistoryAttempt]
          : []),
        flatCloseAttempt(attempt),
      );
    } catch (error) {
      return {
        attempts,
        failure: {
          archive: named ? name : null,
          cause: error.code ?? "invalid immutable archive",
        },
      };
    }
  }
  return { attempts, failure: null };
}
