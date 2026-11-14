import { readWorkOrderIndexRecord } from "@dotln/skeleton/dist/src/runtime-status-contract.js";
import type { DocumentCell, DocumentStructure } from "./types.js";
import {
  array,
  number,
  object,
  optionalString,
  string,
  strings,
} from "./values.js";

export interface TextRow {
  readonly key: string;
  readonly line: number;
  readonly values: Readonly<Record<string, string>>;
}

/** One row of a document table: its first cell, its line and every cell by
 * its column's header. */
export interface TableRow {
  readonly key: DocumentCell;
  readonly line: number;
  readonly values: Readonly<Record<string, DocumentCell>>;
}

/** A document's structure as the collector received it, checked before any
 * projection reads it. */
export function documentStructure(value: unknown): DocumentStructure {
  const record = object(value);
  const cell = (item: unknown): DocumentCell => {
    const entry = object(item);
    return {
      source: string(entry["source"]),
      text: string(entry["text"]),
      links: strings(entry["links"]),
    };
  };
  return {
    headings: array(record["headings"]).map((item) => {
      const heading = object(item);
      return {
        depth: number(heading["depth"]),
        title: string(heading["title"]),
        line: number(heading["line"]),
      };
    }),
    tables: array(record["tables"]).map((item) => {
      const table = object(item);
      return {
        line: number(table["line"]),
        rows: array(table["rows"]).map((item) => {
          const row = object(item);
          return {
            line: number(row["line"]),
            cells: array(row["cells"]).map(cell),
          };
        }),
      };
    }),
  };
}

/** A cell's text on one line: a line break in a table cell reads as "; ". */
export const cellText = (cell: DocumentCell): string =>
  cell.text.replaceAll("\n", "; ");

/** The document opens with this title, at depth one, on its first line. */
function requireTitle(document: DocumentStructure, title: string): void {
  const first = document.headings[0];
  if (first?.depth !== 1 || first.line !== 1 || first.title !== title)
    throw new Error(`expected a document titled "${title}"`);
}

/** The rows of every table whose header row is `header`, in document order;
 * a row with another column count refuses. */
export function tableRows(
  document: DocumentStructure,
  header: readonly string[],
): readonly TableRow[] {
  const tables = document.tables.filter(
    (table) =>
      table.rows[0]?.cells.map((cell) => cell.source).join("\0") ===
      header.join("\0"),
  );
  if (!tables.length) throw new Error("expected table header is absent");
  return tables.flatMap((table) =>
    table.rows.slice(1).map((row): TableRow => {
      if (row.cells.length !== header.length)
        throw new Error("table column count changed");
      return {
        key: row.cells[0]!,
        line: row.line,
        values: Object.fromEntries(
          header.map((label, index) => [label, row.cells[index]!]),
        ),
      };
    }),
  );
}

export const CAPABILITY_HEADER = [
  "Capability and declared scope",
  "Current level",
  "Target level",
  "Required dimensions",
  "Evidence links",
  "Dependencies",
  "Last change",
  "Next smallest promotable increment",
  "Blocking gate",
  "Efficiency",
] as const;
export const PUBLICATION_HEADER = ["Section", "Audiences", "Status"] as const;

// The capability table's other recognized tables: its later assessments.
const CAPABILITY_HEADERS: readonly (readonly string[])[] = [
  CAPABILITY_HEADER,
  [
    "Capability key",
    "New staged evidence",
    "Blocking-gate reassessment",
    "Disposition",
  ],
  [
    "Capability and scope",
    "Current level",
    "Target",
    "Evidence",
    "Next increment and dependencies",
    "Blocking gate",
  ],
  ["Capability and scope", "Current assessment", "Evidence and remaining gate"],
  [
    "Capability and scope",
    "Current level",
    "Target",
    "Evidence and remaining gate",
  ],
];

/** Every row of the capability table's recognized tables, in line order, each
 * with the assessment its nearest level-two heading names. A table with any
 * other header refuses. */
export function parseCapabilities(value: unknown): readonly TableRow[] {
  const document = documentStructure(value);
  requireTitle(document, "Capability table v1");
  const used: (readonly string[])[] = [];
  for (const table of document.tables) {
    const cells = table.rows[0]?.cells.map((cell) => cell.source) ?? [];
    const header = CAPABILITY_HEADERS.find(
      (candidate) => candidate.join("\0") === cells.join("\0"),
    );
    if (!header) throw new Error("unrecognized capability table header");
    if (!used.includes(header)) used.push(header);
  }
  if (!used.includes(CAPABILITY_HEADER))
    throw new Error("capability inventory is absent");
  return used
    .flatMap((header) => tableRows(document, header))
    .sort((left, right) => left.line - right.line)
    .map((row) => {
      const assessment =
        document.headings
          .filter((heading) => heading.depth === 2 && heading.line < row.line)
          .at(-1)?.title ?? "unknown";
      return {
        ...row,
        values: {
          Assessment: { source: assessment, text: assessment, links: [] },
          ...row.values,
        },
      };
    });
}

/** One workstream member: its `WS-NNN/WO-NNN` key and its cells. */
export interface WorkstreamRow {
  readonly key: string;
  readonly values: Readonly<Record<string, string>>;
}

/** Workstream cells come from the index record's workstream observation,
 * never from prose or a live target checkout. */
export function parseWorkstreams(text: string): readonly WorkstreamRow[] {
  const seen = new Set<string>();
  const streams = new Set<string>();
  return readWorkOrderIndexRecord(text).workstreams.flatMap(
    (value): WorkstreamRow[] => {
      const stream = object(value);
      const workstream = string(stream["id"]);
      if (!/^WS-\d{3}$/u.test(workstream) || streams.has(workstream))
        throw new Error("invalid or duplicate workstream");
      streams.add(workstream);
      array(stream["edges"]);
      return array(stream["members"]).map((value): WorkstreamRow => {
        const member = object(value);
        const workOrder = string(member["workOrderId"]);
        const key = `${workstream}/${workOrder}`;
        const values: Record<string, string> = {
          workstream,
          workOrder,
          ...Object.fromEntries(
            [
              "repository",
              "base",
              "phase",
              "verdict",
              "integration",
              "stale",
            ].map((key) => [key, string(member[key])]),
          ),
        };
        if (
          !/^WO-\d{3}$/u.test(workOrder) ||
          seen.has(key) ||
          !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(values["repository"]!) ||
          !/^(?:[0-9a-f]{40}|[0-9a-f]{64}|unknown)$/u.test(values["base"]!) ||
          !/^(?:[0-9a-f]{40}|[0-9a-f]{64}|unknown)$/u.test(
            string(member["targetCommit"]),
          ) ||
          !["current", "behind", "diverged", "unknown"].includes(
            values["integration"]!,
          ) ||
          values["stale"] !==
            (values["integration"] === "unknown"
              ? "unknown"
              : values["integration"] === "current"
                ? "no"
                : "yes")
        )
          throw new Error("invalid or duplicate workstream member");
        seen.add(key);
        return { key, values };
      });
    },
  );
}

export function parseReleases(text: string): readonly TextRow[] {
  const lines = text.trimEnd().split("\n");
  if (lines.shift() !== "TAG\tCOMMIT\tAPPLICATION\tWORK ORDERS")
    throw new Error("release-list header changed");
  return lines.map((line, index) => {
    const cells = line.split("\t");
    if (
      cells.length !== 4 ||
      !/^v\d+\.\d+\.\d+$/u.test(cells[0]!) ||
      !/^[a-f0-9]{40,64}$/u.test(cells[1]!)
    )
      throw new Error("invalid release-list row");
    return {
      key: cells[0]!,
      line: index + 2,
      values: {
        tag: cells[0]!,
        commit: cells[1]!,
        application: cells[2]!,
        workOrders: cells[3]!,
      },
    };
  });
}

export function parseConstellation(text: string): readonly TextRow[] {
  const lines = text.trimEnd().split("\n");
  if (!lines.at(-1)?.startsWith("Group Beacon | "))
    throw new Error("constellation group line is absent");
  return lines.map((line, index): TextRow => {
    const parts = line.split(" | ");
    const heading = parts[0]!;
    if (heading === "Group Beacon") {
      if (
        parts.length !== 4 ||
        parts[2] !== "group-v1" ||
        !/^active=\d+ /u.test(parts[1]!)
      )
        throw new Error("invalid constellation group");
      return {
        key: "group",
        line: index + 1,
        values: { counts: parts[1]!, codebook: parts[2]!, storage: parts[3]! },
      };
    }
    if (!heading.startsWith("Beacon ") || ![3, 7, 9].includes(parts.length))
      throw new Error("invalid constellation row");
    const key = heading.slice(7);
    if (!key) throw new Error("missing constellation address");
    if (parts.length === 3)
      return {
        key,
        line: index + 1,
        values: {
          observation: parts[1]!,
          // Refusals append the private directory after the reason. Only the
          // reason belongs in the board; ordinary age text stays unchanged.
          age:
            parts[1] === "refused" ? parts[2]!.split(": ", 1)[0]! : parts[2]!,
        },
      };
    if (parts.length === 7)
      return {
        key,
        line: index + 1,
        values: {
          observation: parts[1]!,
          provenance: parts[2]!,
          age: parts[3]!,
          codebook: parts[4]!,
          storage: parts[5]!,
          provenanceCheck: parts[6]!,
        },
      };
    return {
      key,
      line: index + 1,
      values: {
        phase: parts[1]!,
        verdict: parts[2]!,
        effort: parts[3]!,
        provenance: parts[4]!,
        age: parts[5]!,
        codebook: parts[6]!,
        storage: parts[7]!,
        provenanceCheck: parts[8]!,
      },
    };
  });
}

/** The roadmap's pending application rungs: each level-two heading that
 * names an application version still pending. */
export function parsePendingRungs(value: unknown): readonly TextRow[] {
  const document = documentStructure(value);
  requireTitle(document, "Roadmap — application release ladder");
  return document.headings
    .filter(
      (heading) =>
        heading.depth === 2 &&
        heading.title.startsWith("Application version pending — "),
    )
    .map((heading) => ({
      key: heading.title,
      line: heading.line,
      values: { rung: heading.title, status: "pending (roadmap heading)" },
    }));
}

export interface RefutationSummary {
  readonly receipt: string;
  readonly format: string;
  readonly scope: string;
  readonly planVerdict: string;
  readonly holdReasons: readonly string[];
  readonly rows: readonly {
    readonly workOrder: string;
    readonly verdict: string;
    readonly reason: string;
    readonly thesis: string | null;
    readonly capabilityRow: string | null;
    readonly roles: readonly string[];
  }[];
}

/** Latest is selected by the dated immutable filename, never by a prose verdict. */
export function parseRefutation(
  ref: string,
  value: unknown,
): RefutationSummary {
  const record = object(value);
  const versioned = record["schemaVersion"] === "plan-refutation-receipt-v1";
  if (
    !versioned &&
    !/^docs\/planning\/refutations\/2026-09-06-phase-two-redirect(?:-00[2-6])?\.json$/u.test(
      ref,
    )
  )
    throw new Error("unsupported refutation receipt format");
  const result = versioned ? object(record["result"]) : record;
  const verdict = string(result["planVerdict"]);
  const goalReview =
    versioned && result["schemaVersion"] === "plan-goal-review-v1";
  const verdicts = goalReview
    ? ["aligned", "aligned-with-findings", "misaligned"]
    : ["pass", "hold"];
  if (!verdicts.includes(verdict)) throw new Error("invalid plan verdict");
  return {
    receipt: versioned
      ? string(record["receiptId"])
      : ref.split("/").at(-1)!.slice(0, -5),
    format: versioned
      ? "plan-refutation-receipt-v1"
      : "manual-redirect-2026-09-06",
    scope: versioned
      ? string(object(record["pass"])["kind"])
      : "planning redirect",
    planVerdict: verdict,
    holdReasons: array(result["holdReasons"]).map((hold) =>
      typeof hold === "string"
        ? hold
        : `${string(object(hold)["workOrderId"])} / ${string(object(hold)["criterionId"])}: ${string(object(hold)["reason"])}`,
    ),
    rows: array(result["orders"]).map((item) => {
      const row = object(item);
      return {
        workOrder: string(row["workOrderId"]),
        verdict: string(row["verdict"]),
        reason: goalReview
          ? [
              `Critical path and NoOp: ${string(row["criticalPathAndNoOp"])}`,
              `System traps: ${string(row["systemTraps"])}`,
              `Removal balance: ${string(row["removalBalance"])}`,
              `Failure behavior: ${string(row["failureBehavior"])}`,
              ...array(row["findings"]).map((item) => {
                const finding = object(item);
                const evidence = optionalString(finding["evidence"]);
                const reopenWhen = optionalString(finding["reopenWhen"]);
                return `${string(finding["criterionId"])} (${string(finding["kind"])}): ${string(finding["reason"])}${evidence ? ` Evidence: ${evidence}.` : ""}${reopenWhen ? ` Reopen when: ${reopenWhen}` : ""}`;
              }),
            ].join("\n")
          : string(row["reason"]),
        thesis: goalReview ? null : (optionalString(row["thesis"]) ?? null),
        capabilityRow: goalReview
          ? null
          : (optionalString(row["capabilityRow"]) ?? null),
        roles: goalReview ? [] : strings(row["rolesServed"]),
      };
    }),
  };
}
