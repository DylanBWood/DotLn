// `npm run plan -- documents`: what a planning pass needs to tend the
// documents. Records an entry point names, the red tags (standing documents
// no reader reaches and no session read over the census window), those still
// open from earlier passes, the unbound standing documents a session still reads
// and the bound ones nobody read. A red tag lives one pass: the next pass
// removes or folds the document and records why. Nothing here removes one.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { docPath } from "./config.mjs";
import { documentCensus } from "./document-census.mjs";
import { documentReport, kitFiles } from "./document-kinds.mjs";
import { bounded } from "./planning-followups.mjs";

const failPage = (condition, message) => {
  if (!condition) throw new Error(message);
};

/** The rows a pass reads, in the order it acts on them. */
export function documentRows(root, { report, census } = {}) {
  report ??= documentReport(root);
  census ??= documentCensus(root);
  const kit = kitFiles(root);
  const sessions = (path) => census.documents[path] ?? 0;
  // Without a readable release history the census placed no read in its
  // window, so no row that needs the reads is judged: the unbound documents
  // are listed with their sessions unknown, and none is red-tagged or unread.
  const unavailable = Boolean(census.window?.unavailable);
  const standing = [...report.bindings.keys()].filter((file) => !kit.has(file));
  // Every tag still open across the passes, its document present or not.
  const carried = report.openRedTags ?? [];
  const carriedPaths = new Set(carried.map((row) => row.path));
  const fresh = standing.filter(
    (file) =>
      !report.bindings.get(file).bound &&
      sessions(file) === 0 &&
      !carriedPaths.has(file),
  );
  const files = new Set(report.kinds.keys());
  return [
    ...report.recordsNamed.map((row) => ({ kind: "record-named", ...row })),
    ...carried.map((row) => ({
      kind: "red-tag",
      path: row.path,
      since: row.since,
      carried: true,
      present: files.has(row.path),
    })),
    ...(unavailable
      ? report.unbound.map((path) => ({
          kind: "unbound",
          path,
          sessions: null,
        }))
      : [
          ...fresh.map((path) => ({ kind: "red-tag", path, carried: false })),
          ...report.unbound
            .filter((path) => sessions(path) > 0)
            .map((path) => ({
              kind: "unbound",
              path,
              sessions: sessions(path),
            })),
          ...standing
            .filter(
              (file) => report.bindings.get(file).bound && sessions(file) === 0,
            )
            .map((path) => ({ kind: "unread", path })),
        ]),
  ];
}

/** The red-tag block a new pass document starts with: the pass whose block
 * it follows, every tag still open with the pass that first raised it (a
 * removed document's too, so the pass records the removal), then this
 * pass's new ones. */
export function redTagsFor(root, document, { rows, report } = {}) {
  report ??= documentReport(root);
  rows ??= documentRows(root, { report });
  return {
    after: report.latestRedTags?.file ?? null,
    tags: rows
      .filter((row) => row.kind === "red-tag")
      .map((row) => ({
        path: row.path,
        since: row.carried ? row.since : document,
        disposition: "",
      })),
  };
}

const PAGES_FILE = "local/document-pages.json";

/** One page of at most 8 KB of compact JSON. The first page saves the rows it
 * pages under a revision of their content; `next` names that revision and
 * the next row, and a later page reads the saved rows, so a read between
 * pages, or a census another session changes, cannot shift or skip a row. A
 * cursor whose revision is no longer the saved one is refused. */
export function documentsPage(root, { cursor = null, report, census } = {}) {
  const path = docPath(root, "control", PAGES_FILE);
  let saved;
  let from = 0;
  if (cursor !== null) {
    const match = /^([a-f0-9]{64}):(\d+)$/u.exec(cursor);
    failPage(match, "usage: plan documents [--cursor <revision>:<row>]");
    try {
      saved = JSON.parse(readFileSync(path, "utf8"));
    } catch {
      saved = null;
    }
    failPage(
      saved?.revision === match[1],
      "plan documents: stale page cursor; restart with npm run plan -- documents",
    );
    from = Number(match[2]);
    failPage(from <= saved.rows.length, "plan documents: no such row; restart");
  } else {
    report ??= documentReport(root);
    census ??= documentCensus(root);
    const rows = documentRows(root, { report, census });
    const summary = {
      kinds: report.counts,
      census: {
        window: {
          releases: census.window.releases,
          since: census.window.since,
          after: census.window.after,
          ...(census.window.unavailable
            ? { unavailable: census.window.unavailable }
            : {}),
        },
        sessions: {
          inWindow: census.journals.inWindow,
          observed: census.journals.observed,
          unobserved: census.journals.unobserved,
        },
        codex: "unobserved; the counts are a lower bound",
        durationMs: census.durationMs,
      },
    };
    saved = {
      revision: createHash("sha256")
        .update(JSON.stringify({ summary, rows }))
        .digest("hex"),
      summary,
      rows,
    };
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(saved)}\n`);
  }
  const counts = {};
  for (const row of saved.rows) counts[row.kind] = (counts[row.kind] ?? 0) + 1;
  const page = {
    ...saved.summary,
    counts,
    rule: "A red tag lives one planning pass: the next pass removes or folds the document and writes the disposition in its red-tag block. Nothing is removed by a check.",
    rows: saved.rows.slice(from, from + 64),
    next: null,
  };
  return bounded(
    page,
    () =>
      from + page.rows.length < saved.rows.length
        ? `npm run plan -- documents --cursor ${saved.revision}:${from + page.rows.length}`
        : null,
    "one document row",
    failPage,
  );
}
