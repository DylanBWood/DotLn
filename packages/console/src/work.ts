import type { BoardRow, BoardSection, BoardSources } from "./types.js";
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
  markdownLinks,
  parseConstellation,
  parseReleases,
  parseWorkOrderIndex,
  plainText,
} from "./text-sources.js";

export function projectWork(
  ctx: ProjectionContext,
  sources: BoardSources,
): readonly BoardSection[] {
  const indexed = new Map<string, BoardRow>();
  const index = ctx.section(
    "work-order-index",
    "Work-order evidence index",
    sources.workOrderIndex,
    "docs/work-orders/README.md",
    (text, ref) =>
      parseWorkOrderIndex(text).map((row): BoardRow => {
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
      }),
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
  return [status, constellation, releases, index, usage];
}
