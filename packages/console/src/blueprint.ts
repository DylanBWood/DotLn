import type { BoardSection, BoardSources } from "./types.js";
import { ProjectionContext } from "./context.js";
import { fact, id, known, optionalString } from "./values.js";
import {
  PUBLICATION_HEADER,
  markdownLinks,
  parseCapabilities,
  parsePendingRungs,
  parseRefutation,
  plainText,
  tableRows,
} from "./text-sources.js";

export function projectBlueprint(
  ctx: ProjectionContext,
  sources: BoardSources,
): readonly BoardSection[] {
  const capabilities = ctx.section(
    "capabilities",
    "Capability evidence",
    sources.capabilities,
    "docs/planning/capability-table.md",
    (text, ref) =>
      parseCapabilities(text).map((row) => {
        const evidence = ctx.ref(ref, `line:${row.line}`);
        return {
          id: id("capability", `${row.line}:${row.key}`),
          title: plainText(row.key),
          cells: Object.entries(row.values).map(([key, value]) =>
            known(key, key, plainText(value), evidence),
          ),
          links: Object.values(row.values)
            .flatMap(markdownLinks)
            .map((link) => ({
              label: `Capability evidence: ${link}`,
              target: ctx.ref(ref, `link:${link}`)[0]!,
            })),
        };
      }),
  );
  const publication = ctx.section(
    "publication",
    "Publication status",
    sources.publication,
    "docs/publication/audience-status-index.md",
    (text, ref) =>
      tableRows(text, PUBLICATION_HEADER).map((row) => {
        const evidence = ctx.ref(ref, `line:${row.line}`);
        if (
          ![
            "vision",
            "specified",
            "planned",
            "implemented",
            "verified",
            "blocked",
            "deprecated",
          ].includes(row.values["Status"]!)
        )
          throw new Error("unrecognized publication status");
        return {
          id: id("publication", `${row.line}:${row.key}`),
          title: plainText(row.key),
          cells: [
            known("audiences", "Audiences", row.values["Audiences"]!, evidence),
            known(
              "status",
              "Published status label",
              row.values["Status"]!,
              evidence,
            ),
          ],
          links: [
            {
              label: "Source section",
              target: ctx.ref(
                ref,
                `link:${markdownLinks(row.key)[0] ?? "unknown"}`,
              )[0]!,
            },
          ],
        };
      }),
  );
  const roadmap = ctx.section(
    "roadmap",
    "Pending roadmap rungs",
    sources.roadmap,
    "docs/product/06-roadmap.md",
    (text, ref) =>
      parsePendingRungs(text).map((row) => {
        const evidence = ctx.ref(ref, `line:${row.line}`);
        return {
          id: id("rung", row.key),
          title: row.key,
          cells: [
            known("status", "Roadmap status", row.values["status"]!, evidence),
          ],
          links: [],
        };
      }),
  );
  const refutations = ctx.section(
    "refutation-verdicts",
    "Latest plan-refutation verdicts",
    sources.refutations,
    "docs/planning/refutations/",
    (documents) => {
      // The historical unnumbered first receipt precedes -002, ..., -006. Dated
      // versioned receipts use fixed three-digit ordinals. Input array order is irrelevant.
      const ordered = [...documents].sort((left, right) => {
        const key = (ref: string) =>
          ref.replace(
            /phase-two-redirect\.json$/u,
            "phase-two-redirect-001.json",
          );
        return key(left.ref) < key(right.ref)
          ? -1
          : key(left.ref) > key(right.ref)
            ? 1
            : 0;
      });
      const latest = ordered.at(-1);
      if (!latest) throw new Error("no receipt exists");
      const result = parseRefutation(latest.ref, latest.value);
      const evidence = ctx.ref(
        latest.ref,
        "planVerdict + holdReasons (immutable recorded result)",
      );
      return [
        {
          id: "latest-refutation",
          title: result.receipt,
          cells: [
            known("planVerdict", "Plan verdict", result.planVerdict, evidence),
            known(
              "holdStatus",
              "Recorded hold status",
              result.planVerdict === "hold" ? "hold" : "no holds recorded",
              evidence,
              "Receipt result only; this board does not evaluate overrides, staleness, or planning-gate legality",
            ),
            known("holdReasons", "Hold reasons", result.holdReasons, evidence),
            known("scope", "Receipt purpose", result.scope, evidence),
            known("format", "Receipt format", result.format, evidence),
          ],
          links: [],
        },
        ...result.rows.map((row) => {
          const evidence = ctx.ref(latest.ref, `orders:${row.workOrder}`);
          return {
            id: id("refutation", row.workOrder),
            title: row.workOrder,
            cells: [
              known("verdict", "Vision-fit verdict", row.verdict, evidence),
              known("reason", "Why this verdict", row.reason, evidence),
              fact("thesis", "Vision passage", row.thesis, evidence),
              fact("capability", "Capability row", row.capabilityRow, evidence),
              known("roles", "Roles served", row.roles, evidence),
            ],
            links: [
              { label: "Receipt and hold status", target: "latest-refutation" },
            ],
          };
        }),
      ];
    },
  );
  return [refutations, capabilities, publication, roadmap];
}
