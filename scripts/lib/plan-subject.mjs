import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseHeader, parseSequence } from "../work-orders.mjs";
import { runGit } from "./git.mjs";
import { containedRegularFile } from "./paths.mjs";

export const PLAN_MAP = "docs/planning/sequence.md";
export const PLAN_LEDGER = "docs/lineage/idea-ledger.md";
export const THESIS_HEADINGS = [
  ["the-one-paragraph-story", "The one-paragraph story"],
  ["the-core-bet", "The core bet"],
  ["the-differentiated-interface", "The differentiated interface"],
  ["three-horizons-one-kernel", "Three horizons, one kernel"],
  [
    "mission--increase-the-chance-of-operator-flow",
    "Mission — increase the chance of operator flow",
  ],
];
export const sha256 = (value) =>
  `sha256:${createHash("sha256").update(value).digest("hex")}`;

// Length framing is supplied by JSON's string encoding. No whitespace folding
// occurs before hashing source bytes. A revision id is provenance, not identity.
export const hashParts = (parts) => sha256(JSON.stringify(parts));

export const committedReader = (root, revision = "HEAD") => {
  const commit = runGit(root, [
    "rev-parse",
    "--verify",
    `${revision}^{commit}`,
  ]);
  const entries = new Map(
    runGit(root, ["ls-tree", "-rz", commit], { trim: false })
      .split("\0")
      .filter(Boolean)
      .map((entry) => {
        const [meta, path] = entry.split("\t");
        const [mode, type, oid] = meta.split(" ");
        return [path, { mode, type, oid }];
      }),
  );
  return {
    revision: commit,
    paths: [...entries.keys()],
    read(path) {
      const entry = entries.get(path);
      if (
        !entry ||
        entry.type !== "blob" ||
        !["100644", "100755"].includes(entry.mode)
      )
        throw new Error(
          `plan subject requires a committed regular file: ${path}`,
        );
      return runGit(root, ["cat-file", "blob", entry.oid], { trim: false });
    },
  };
};

const section = (source, heading) => {
  const lines = source.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  const positions = lines.flatMap((line, i) =>
    line.trimEnd() === `## ${heading}` ? [i] : [],
  );
  if (positions.length !== 1)
    throw new Error(`expected exactly one section: ${heading}`);
  const start = positions[0];
  const end = lines.findIndex((line, i) => i > start && /^#{1,2} /u.test(line));
  return lines.slice(start, end < 0 ? undefined : end).join("");
};

const field = (source, label) => {
  const lines = source.split(/\r?\n/);
  const matches = lines.flatMap((line, i) =>
    line.startsWith(`**${label}`) ? [i] : [],
  );
  if (matches.length !== 1) throw new Error(`expected one ${label} field`);
  const start = matches[0];
  const end = lines.findIndex(
    (line, i) => i > start && /^(?:\*\*[A-Z][^*]+\*\*|#{1,6} )/u.test(line),
  );
  const body = lines.slice(start, end < 0 ? undefined : end);
  body[0] = body[0].replace(/^\*\*[^*]+\*\*\s*/, "");
  return body.join("\n").trim();
};

export const parsePlanOrder = (
  source,
  path,
  workOrderId,
  { includeCost = false } = {},
) => {
  const { title } = parseHeader(source, path);
  if (!title.startsWith(`${workOrderId} — `))
    throw new Error(`order title/id mismatch: ${path}`);
  const criteriaSource = field(source, "Acceptance criteria");
  const matches = [
    ...criteriaSource.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm),
  ];
  const criteria = matches.map((match, i) => {
    if (Number(match[1]) !== i + 1)
      throw new Error(`non-sequential acceptance criteria: ${path}`);
    return { id: `criterion:${match[1]}`, text: match[2].trim() };
  });
  if (!criteria.length || !/^1\. /u.test(criteriaSource))
    throw new Error(`missing acceptance criteria: ${path}`);
  return {
    workOrderId,
    path,
    title,
    objective: field(source, "Objective:"),
    ...(includeCost
      ? { cost: /^\*\*Cost:\*\*/m.test(source) ? field(source, "Cost:") : null }
      : {}),
    criteria,
    nonGoals: field(source, "Non-goals:"),
  };
};

export function buildPlanSubject(
  root,
  revision = "HEAD",
  { workspace = false, costTable = true } = {},
) {
  const committed = committedReader(root, revision);
  const read = workspace
    ? (path) => {
        if (!containedRegularFile(join(root, path), root))
          throw new Error(
            `subject source is not a contained regular file: ${path}`,
          );
        return readFileSync(join(root, path), "utf8");
      }
    : committed.read;
  // Historical receipt identities retain the source path present at their
  // revision. Workspace checks see a newly introduced sequence immediately.
  const sequencePath = (
    workspace
      ? containedRegularFile(join(root, PLAN_MAP), root)
      : committed.paths.includes(PLAN_MAP)
  )
    ? PLAN_MAP
    : "docs/planning/work-order-map.md";
  const map = read(sequencePath);
  const has = (path) =>
    workspace
      ? containedRegularFile(join(root, path), root)
      : committed.paths.includes(path);
  const budgetPath = "docs/control/budgets.json";
  const includeCost = has(budgetPath);
  const sequence = parseSequence(map);
  if (!sequence.length || sequence.length > 100)
    throw new Error("plan sequence must contain 1–100 orders");
  const block = map.match(
    /^<!-- dotln-work-order-sequence:start -->\r?\n[\s\S]*?^<!-- dotln-work-order-sequence:end -->[^\S\r\n]*(?:\r?\n|$)/m,
  )?.[0];
  if (!block) throw new Error("expected a byte-addressable sequence block");
  const parts = [["sequence", block]];
  const orders = sequence.map(({ id }) => {
    const paths = committed.paths.filter((path) =>
      new RegExp(`^docs/work-orders/${id}-[^/]+\\.md$`, "u").test(path),
    );
    // Workspace observation also notices drafts that have not been committed.
    if (paths.length !== 1)
      throw new Error(`expected one committed order file for ${id}`);
    const path = paths[0];
    const source = read(path);
    parts.push([path, source]);
    return parsePlanOrder(source, path, id, { includeCost });
  });
  const vision = read("docs/product/00-vision.md");
  const theses = THESIS_HEADINGS.map(([id, title]) => {
    const text = section(vision, title);
    parts.push([`vision:${id}`, text]);
    return { id, title, text };
  });
  const exclusionsSource = section(vision, "What DotLn is not");
  parts.push(["vision:what-dotln-is-not", exclusionsSource]);
  const exclusions = [
    ...exclusionsSource.matchAll(/^- ([\s\S]*?)(?=^- |\n\n)/gm),
  ].map((match, i) => ({
    id: `what-dotln-is-not:${i + 1}`,
    text: match[1].trim(),
  }));
  if (!exclusions.length) throw new Error("vision exclusions missing");
  const rolesText = section(
    read("docs/product/13-uifa-roles.md"),
    "The five roles",
  ).split(/^### /m)[0];
  const rolesTable = rolesText
    .split(/\r?\n/)
    .filter((line) => line.startsWith("|"))
    .join("\n");
  const roles = [...rolesTable.matchAll(/\*\*(UIFA [^*]+)\*\*/g)].map(
    ([, role]) => role,
  );
  if (roles.length !== 5 || new Set(roles).size !== 5)
    throw new Error("expected the five-role table");
  // Preserve CRLF as well as spaces in the judged table.
  const rolesBytes = rolesText.match(/^\|[^\n]*(?:\n|$)/gm)?.join("") ?? "";
  parts.push(["roles", rolesBytes]);
  const capabilities = read("docs/planning/capability-table.md")
    .split(/\r?\n/)
    .filter((line) => line.startsWith("|"))
    .flatMap((line) => {
      const cells = line.split("|").slice(1, -1);
      const id = cells[0]?.match(/`([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+)`/u)?.[1];
      if (!id) return [];
      if (!cells[1]?.trim()) throw new Error(`capability level missing: ${id}`);
      // Multiple dated assessments are retained in source order, not silently
      // collapsed to whichever row a Map happened to keep.
      parts.push([`capability:${id}`, [cells[0], cells[1]]]);
      return [{ id, level: cells[1].trim() }];
    });
  if (!capabilities.length)
    throw new Error("capability table has no identified rows");
  const deferrals = orders.flatMap((order, index) =>
    [
      ...order.nonGoals.matchAll(
        /<!-- dotln-plan-defer: ([a-z0-9:-]+) -> (WO-\d{3}) -->/g,
      ),
    ].map(([, thesis, laterWorkOrderId]) => {
      if (
        !theses.some(({ id }) => id === thesis) ||
        !sequence.slice(index + 1).some(({ id }) => id === laterWorkOrderId)
      )
        throw new Error("invalid named later-order deferral");
      return { thesis, workOrderId: order.workOrderId, laterWorkOrderId };
    }),
  );
  let costs;
  if (includeCost) {
    const budget = JSON.parse(read(budgetPath));
    const sourceHash = hashParts([
      block,
      ...orders.map(({ workOrderId, objective, criteria, nonGoals, cost }) => ({
        workOrderId,
        objective,
        criteria,
        nonGoals,
        cost,
      })),
      ...parts.filter(
        ([name]) =>
          name.startsWith("vision:") ||
          name === "roles" ||
          name.startsWith("capability:"),
      ),
    ]);
    if (costTable) {
      const path = "docs/planning/cost-table.json";
      if (!has(path))
        throw new Error(
          "Planning cost table missing; run npm run meta -- --plan-cost after measuring the subject",
        );
      const source = read(path);
      if (Buffer.byteLength(source) > 65536)
        throw new Error("Planning cost table exceeds its bounded 64 KB input");
      costs = JSON.parse(source);
      if (
        costs.schemaVersion !== 1 ||
        !Number.isFinite(Date.parse(costs.observedAt)) ||
        costs.subjectSourceHash !== sourceHash ||
        JSON.stringify(costs.acceptances) !== JSON.stringify(budget.acceptances)
      )
        throw new Error(
          "Planning cost evidence is stale for the subject revision or dated acceptances",
        );
      if (
        !Array.isArray(costs.rows) ||
        costs.rows.length !== orders.length ||
        new Set(costs.rows.map((row) => row.workOrder)).size !==
          orders.length ||
        orders.some(
          (order) =>
            !costs.rows.some((row) => row.workOrder === order.workOrderId),
        )
      )
        throw new Error(
          "Planning cost table must cover exactly the subject orders",
        );
      const at = runGit(root, [
        "show",
        "-s",
        "--format=%cI",
        `${costs.subjectRevision}^{commit}`,
      ]);
      runGit(root, [
        "merge-base",
        "--is-ancestor",
        costs.subjectRevision,
        committed.revision,
      ]);
      // The source hash above binds the cost-bearing projection. A later
      // execution record or merge can touch its containing files without
      // changing that projection. The observation must postdate its recorded
      // revision; whole-file commit times are not planning-input freshness.
      if (Date.parse(costs.observedAt) < Date.parse(at))
        throw new Error("Planning cost evidence predates its subject revision");
      parts.push(["cost-table", source]);
    } else
      costs = {
        schemaVersion: 1,
        subjectSourceHash: sourceHash,
        acceptances: budget.acceptances,
      };
  }
  return {
    schemaVersion: "plan-subject-v1",
    revision: committed.revision,
    hash: hashParts(parts),
    sequenceHash: sha256(block),
    inputs: parts.map(([name, bytes]) => ({
      name,
      hash: sha256(typeof bytes === "string" ? bytes : JSON.stringify(bytes)),
    })),
    standard: { theses, exclusions, roles, rolesTable, capabilities },
    orders,
    deferrals,
    ...(costs ? { costTable: costs } : {}),
  };
}

export const planningPasses = (ledger) =>
  [...ledger.matchAll(/^## (.+)$/gm)]
    .map(([, heading]) => ({
      heading,
      date: heading.match(/\b\d{4}-\d{2}-\d{2}\b/u)?.[0],
    }))
    .filter(({ heading, date }) => date && /planning pass/iu.test(heading))
    .map((pass) => ({
      ...pass,
      id: `planning-${sha256(pass.heading).slice(7, 23)}`,
    }));
