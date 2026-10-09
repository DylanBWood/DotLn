import type { BoardRow, BoardSection, BoardSources, Source } from "./types.js";
import { ProjectionContext } from "./context.js";
import {
  array,
  fact,
  id,
  known,
  object,
  optionalObject,
  optionalString,
  string,
  unknown,
} from "./values.js";
import {
  INDEX_PAGE_TITLES,
  markdownLinks,
  parseConstellation,
  parseReleases,
  parseWorkOrderIndex,
  plainText,
} from "./text-sources.js";

/** The generated index's two pages (WO-190), each its own section. */
const INDEX_PAGES = {
  index: {
    sectionId: "work-order-index",
    title: "Work-order evidence index",
    ref: "docs/work-orders/README.md",
    pageTitle: INDEX_PAGE_TITLES.index,
  },
  history: {
    sectionId: "work-order-history",
    title: "Work-order history index",
    ref: "docs/work-orders/HISTORY.md",
    pageTitle: INDEX_PAGE_TITLES.history,
  },
} as const;

/** One generated index page as a section; the two pages partition the
 * orders, so a card the other page already holds makes this section
 * unavailable before any of its rows enters the shared map. */
function indexPage(
  ctx: ProjectionContext,
  indexed: Map<string, BoardRow>,
  page: (typeof INDEX_PAGES)[keyof typeof INDEX_PAGES],
  source: Source<string> | undefined,
): BoardSection {
  return ctx.section(
    page.sectionId,
    page.title,
    source,
    page.ref,
    (text, ref) => {
      const rows = parseWorkOrderIndex(text, page.pageTitle);
      for (const row of rows)
        if (indexed.has(row.key))
          throw new Error(`work-order card ${row.key} is on both pages`);
      return rows.map((row): BoardRow => {
        const evidence = ctx.ref(ref, `line:${row.line} (${row.key})`);
        const links = Object.values(row.values)
          .flatMap(markdownLinks)
          .map((link) => ({
            label: `Evidence: ${link}`,
            target: ctx.ref(ref, `link:${link}`)[0]!,
          }));
        const result = {
          id: id("indexed-order", row.key),
          title: row.key,
          cells: Object.entries(row.values).map(([key, value]) =>
            known(key, key, plainText(value), evidence),
          ),
          links,
        };
        indexed.set(row.key, result);
        return result;
      });
    },
  );
}

export function projectWork(
  ctx: ProjectionContext,
  sources: BoardSources,
): readonly BoardSection[] {
  const indexed = new Map<string, BoardRow>();
  // Both pages are indexed before the status and release rows link to them.
  const index = indexPage(
    ctx,
    indexed,
    INDEX_PAGES.index,
    sources.workOrderIndex,
  );
  const history = indexPage(
    ctx,
    indexed,
    INDEX_PAGES.history,
    sources.workOrderHistory,
  );
  const status = ctx.section(
    "orders",
    "Orders and legal actions",
    sources.controlStatus,
    "resume:status--json",
    (values, ref) => {
      const ids = new Set<string>();
      return values.map((value): BoardRow => {
        const row = object(value);
        const order = string(row["workOrder"]);
        if (!/^WO-\d{3}$/u.test(order) || ids.has(order))
          throw new Error("invalid or duplicate selected control status");
        ids.add(order);
        const evidence = ctx.ref(ref, `selected:${order}`);
        const detail = indexed.get(order);
        const dependency = detail?.cells.find(
          (cell) => cell.key === "Dependency reference check (conservative)",
        );
        const failure =
          row["latestVerdict"] === "fail"
            ? (row["finalReviewPath"] ?? row["verificationPath"])
            : undefined;
        return {
          id: id("order", order),
          title: order,
          cells: [
            known("phase", "Phase", string(row["phase"]), evidence),
            fact("verdict", "Latest verdict", row["latestVerdict"], evidence),
            fact(
              "recordedAt",
              "Latest recorded time",
              row["recordedAt"],
              evidence,
            ),
            known(
              "legalNextActions",
              "Legal next actions",
              array(row["legalNextActions"]).map(string),
              evidence,
              "Observed actions only; the board cannot invoke them",
            ),
            ...(Object.entries(object(row["elapsed"])).length
              ? Object.entries(object(row["elapsed"])).map(([phase, elapsed]) =>
                  fact(
                    `elapsed.${phase}`,
                    `${phase} elapsed milliseconds`,
                    elapsed,
                    evidence,
                    "Latest completed attempt; signed wall-clock span, not active work time",
                  ),
                )
              : [
                  unknown(
                    "elapsed",
                    "Elapsed time",
                    evidence,
                    "No completed phase timing is recorded",
                  ),
                ]),
            fact(
              "blockers",
              "Recorded failure source",
              failure,
              evidence,
              failure
                ? null
                : "Status records no blocker-reason field; absence is not proof that work is unblocked",
            ),
            dependency
              ? {
                  ...dependency,
                  key: "dependencyCheck",
                  label: "Index dependency check",
                }
              : unknown("dependencyCheck", "Index dependency check", evidence),
            fact(
              "verification",
              "Verification evidence",
              row["verificationPath"],
              evidence,
            ),
            fact(
              "finalReview",
              "Final-review evidence",
              row["finalReviewPath"],
              evidence,
            ),
            fact(
              "authority",
              "Work-order authority",
              row["workOrderPath"],
              evidence,
            ),
          ],
          links: detail
            ? [
                {
                  label: "Work-order evidence and dependencies",
                  target: detail.id,
                },
              ]
            : [],
        };
      });
    },
  );
  const constellation = ctx.section(
    "worktrees",
    "Worktree Beacon observations",
    sources.constellation,
    "worktree:constellation",
    (text, ref) =>
      parseConstellation(text).map((row) => {
        const evidence = ctx.ref(ref, `line:${row.line}`);
        return {
          id: id("worktree", row.key),
          title: row.key === "group" ? "Group Beacon" : `Worktree ${row.key}`,
          cells: [
            ...Object.entries(row.values).map(([key, value]) =>
              fact(key, key, value, evidence),
            ),
            unknown(
              "workerLiveness",
              "Worker liveness",
              evidence,
              "A lifecycle Beacon is metadata, not a worker heartbeat or a human presence observation",
            ),
          ],
          links: [],
        };
      }),
  );
  const releases = ctx.section(
    "releases",
    "Published releases",
    sources.releases,
    "release:list",
    (text, ref) =>
      parseReleases(text).map((row) => {
        const evidence = ctx.ref(ref, `line:${row.line} (${row.key})`);
        return {
          id: id("release", row.key),
          title: row.key,
          cells: Object.entries(row.values).map(([key, value]) =>
            known(
              key,
              key === "workOrders" ? "Work orders in this release" : key,
              value,
              evidence,
            ),
          ),
          links: row.values["workOrders"]!.split(",")
            .filter((order) => indexed.has(order))
            .map((order) => ({
              label: `Evidence for ${order}`,
              target: indexed.get(order)!.id,
            })),
        };
      }),
  );
  const usage = ctx.section(
    "usage",
    "Recorded actor usage",
    sources.controlUsage,
    "resume:usage--json",
    (value, ref) => {
      const projection = object(value);
      const evidence = ctx.ref(ref, "totals");
      const totals = object(projection["totals"]);
      return [
        {
          id: "usage-total",
          title: "Completed phase attempts",
          cells: [
            known(
              "timing",
              "Measurement boundary",
              string(projection["timing"]),
              evidence,
            ),
            ...["attempts", "elapsedMs", "unknown"].map((key) =>
              fact(key, key, totals[key], evidence),
            ),
          ],
          links: [],
        },
        ...array(projection["byActor"]).map((item, index): BoardRow => {
          const row = object(item);
          const evidence = ctx.ref(ref, `byActor:${index}`);
          return {
            id: id("usage", `${index}`),
            title: `${string(row["model"])} — ${string(row["phase"])}`,
            cells: [
              "harness",
              "harnessVersion",
              "model",
              "effort",
              "phase",
              "attempts",
              "elapsedMs",
              "unknown",
              "workOrders",
            ].map((key) => fact(key, key, row[key], evidence)),
            links: [],
          };
        }),
      ];
    },
  );
  return [status, constellation, releases, index, history, usage];
}
