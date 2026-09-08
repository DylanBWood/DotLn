import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  compileFeedbackUnits,
  feedbackMaturity,
  seiriEnvironment,
  seiriLoadout,
} from "@dotln/compiler";
import {
  projectBoard,
  renderHtml,
  renderTerminal,
  ROLE_ANSWERS,
} from "../src/index.js";
import type {
  BoardRow,
  BoardSection,
  BoardSources,
  BoardView,
} from "../src/types.js";
import { exportedLoadouts, observationsFromReport } from "../src/builds.js";
import { collectSources, storeFromLog } from "../src/collect.js";
import { available, object, unavailable } from "../src/values.js";
import { displayWidth, TERMINAL_WIDTH } from "../src/render.js";
import {
  parseCapabilities,
  parseConstellation,
  parseReleases,
  parseRefutation,
  parseWorkOrderIndex,
  plainText,
  tableRows,
} from "../src/text-sources.js";
import {
  combinedFixture,
  fixtureRoot,
  loadFixture,
  manifest,
  root,
} from "./fixtures.js";

const sections = (board: BoardView) =>
  board.panels.flatMap((panel) => panel.sections);
const section = (board: BoardView, id: string): BoardSection => {
  const result = sections(board).find((item) => item.id === id);
  assert.ok(result, `missing section ${id}`);
  return result;
};
const cells = (row: BoardRow) =>
  Object.fromEntries(row.cells.map((cell) => [cell.key, cell]));
const allRows = (board: BoardView) =>
  sections(board).flatMap((item) => item.rows);
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");

function freeze(value: unknown): void {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return;
  Object.freeze(value);
  for (const item of Object.values(value)) freeze(item);
}

// A bounded, dependency-free JSON Schema checker for this schema's declared
// vocabulary. It tests the interchange, including serialized null/array values,
// independently from the TypeScript interfaces used by the implementation.
function schemaMatches(
  value: unknown,
  raw: unknown,
  rootSchema: Record<string, unknown>,
): boolean {
  const schema = object(raw);
  if (schema["$ref"])
    return schemaMatches(
      value,
      object(rootSchema["$defs"])[String(schema["$ref"]).split("/").at(-1)!],
      rootSchema,
    );
  if (
    Object.hasOwn(schema, "const") &&
    JSON.stringify(value) !== JSON.stringify(schema["const"])
  )
    return false;
  if (
    Array.isArray(schema["enum"]) &&
    !schema["enum"].some(
      (entry) => JSON.stringify(entry) === JSON.stringify(value),
    )
  )
    return false;
  if (
    Array.isArray(schema["anyOf"]) &&
    !schema["anyOf"].some((entry) => schemaMatches(value, entry, rootSchema))
  )
    return false;
  if (
    Array.isArray(schema["allOf"]) &&
    !schema["allOf"].every((entry) => schemaMatches(value, entry, rootSchema))
  )
    return false;
  if (
    schema["if"] &&
    !schemaMatches(
      value,
      schemaMatches(value, schema["if"], rootSchema)
        ? schema["then"]
        : schema["else"],
      rootSchema,
    )
  )
    return false;
  const kind =
    value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  if (
    schema["type"] &&
    !(
      Array.isArray(schema["type"]) ? schema["type"] : [schema["type"]]
    ).includes(kind)
  )
    return false;
  if (typeof value === "string") {
    if (
      typeof schema["minLength"] === "number" &&
      value.length < schema["minLength"]
    )
      return false;
    if (
      typeof schema["pattern"] === "string" &&
      !new RegExp(schema["pattern"], "u").test(value)
    )
      return false;
  }
  if (Array.isArray(value)) {
    if (
      (typeof schema["minItems"] === "number" &&
        value.length < schema["minItems"]) ||
      (typeof schema["maxItems"] === "number" &&
        value.length > schema["maxItems"])
    )
      return false;
    if (
      schema["uniqueItems"] &&
      new Set(value.map((entry) => JSON.stringify(entry))).size !== value.length
    )
      return false;
    if (
      schema["items"] &&
      !value.every((entry) => schemaMatches(entry, schema["items"], rootSchema))
    )
      return false;
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    if (
      Array.isArray(schema["required"]) &&
      !schema["required"].every(
        (key) => typeof key === "string" && Object.hasOwn(record, key),
      )
    )
      return false;
    const properties = schema["properties"] ? object(schema["properties"]) : {};
    for (const [key, item] of Object.entries(record)) {
      if (Object.hasOwn(properties, key)) {
        if (!schemaMatches(item, properties[key], rootSchema)) return false;
      } else if (schema["additionalProperties"] === false) return false;
    }
  }
  return true;
}

const schema = JSON.parse(
  readFileSync(
    join(root, "packages/console/uifa-board-v1.schema.json"),
    "utf8",
  ),
) as Record<string, unknown>;

for (const name of Object.keys(manifest.cases))
  test(`WO-032 AC1/6 ${name}: recorded JSON and both renders; pure, schema-valid, linked and bounded`, () => {
    const sources = loadFixture(name),
      before = JSON.stringify(sources);
    freeze(sources);
    const board = projectBoard(sources),
      encoded = JSON.stringify(board, null, 2) + "\n";
    assert.equal(
      JSON.stringify(sources),
      before,
      "projection mutated recorded input",
    );
    assert.deepEqual(projectBoard(sources), board);
    assert.ok(
      schemaMatches(JSON.parse(encoded), schema, schema),
      "serialized board violates its JSON schema",
    );
    const terminal = renderTerminal(board),
      html = renderHtml(board);
    for (const [extension, output] of [
      ["json", encoded],
      ["txt", terminal],
      ["html", html],
    ])
      assert.equal(
        readFileSync(
          join(fixtureRoot, "expected", `${name}.${extension}`),
          "utf8",
        ),
        output,
      );
    assert.deepEqual(
      board.panels.map((panel) => panel.id),
      ["actors", "builds", "mechanisms", "work", "blueprint"],
    );
    assert.ok(
      terminal
        .split("\n")
        .every((line) => displayWidth(line) <= TERMINAL_WIDTH),
    );
    assert.doesNotMatch(
      html,
      /<(?:script|iframe|object|embed|img|link|form|input|button|video|audio|canvas)\b/iu,
    );
    assert.doesNotMatch(
      html,
      /\son[a-z]+\s*=|\b(?:src|srcset|poster)\s*=|url\s*\(|@import/iu,
    );
    assert.doesNotMatch(html, /href="(?!#)/u);
    const ids = [...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, "duplicate HTML targets");
    for (const link of html.matchAll(/href="#([^"]+)"/gu))
      assert.ok(ids.includes(link[1]), `dead link: ${link[1]}`);
    const evidenceIds = new Set(board.evidence.map((row) => row.id));
    for (const row of allRows(board))
      for (const cell of row.cells) {
        assert.ok(cell.evidence.length > 0, `cell lacks evidence: ${cell.key}`);
        assert.ok(
          cell.evidence.every((id) => evidenceIds.has(id)),
          `cell invents evidence: ${cell.key}`,
        );
        if (cell.status !== "known") assert.equal(cell.value, null);
      }
    assert.doesNotMatch(
      encoded,
      /SYNTHETIC_PRIVATE_|privateTranscript|source-file bodies.*contents|\/Users\/|\/private\//u,
    );
  });

test("WO-032 schema refuses a different version, unknown fields, unsupported cells and unlabeled missing facts", () => {
  const board = projectBoard(loadFixture("selfhost"));
  assert.equal(
    schemaMatches(
      { ...board, viewModelVersion: "uifa-board-v2" },
      schema,
      schema,
    ),
    false,
  );
  assert.equal(
    schemaMatches({ ...board, inventedCapability: true }, schema, schema),
    false,
  );
  const definition = object(object(schema["$defs"])["cell"]);
  assert.equal(
    schemaMatches(
      {
        key: "phase",
        label: "Phase",
        status: "unknown",
        value: "running",
        explanation: "absent",
        evidence: ["evidence-1"],
      },
      definition,
      schema,
    ),
    false,
  );
  assert.equal(
    schemaMatches(
      {
        key: "phase",
        label: "Phase",
        status: "known",
        value: null,
        explanation: null,
        evidence: ["evidence-1"],
      },
      definition,
      schema,
    ),
    false,
  );
  assert.equal(
    schemaMatches(
      {
        key: "phase",
        label: "Phase",
        status: "known",
        value: "running",
        explanation: null,
        evidence: [],
      },
      definition,
      schema,
    ),
    false,
  );
});

test("WO-032 AC2 executor, verifier attempts, authority, hashes and actual accepted episode remain distinct", () => {
  const board = projectBoard(loadFixture("selfhost"));
  const actors = board.panels[0]!.sections.flatMap((section) => section.rows);
  const executor = actors.find(
    (row) => cells(row)["episode"]?.value === "ep_feedback_executor",
  )!;
  // The admitted matrix names the accepted verifier attempt; the recorded run
  // decides how many physical attempts preceded it.
  const matrix = allRows(board).find((row) => row.id.startsWith("matrix-"))!;
  assert.ok(matrix);
  const accepted = cells(matrix)["AC-context.verifier"]!.value;
  assert.match(String(accepted), /^ep_verifier_/u);
  const verifier = actors.find(
    (row) => cells(row)["episode"]?.value === accepted,
  )!;
  assert.ok(executor && verifier);
  assert.equal(cells(executor)["kind"]!.value, "script");
  assert.equal(cells(executor)["role"]!.value, "executor");
  assert.equal(cells(verifier)["role"]!.value, "verifier");
  assert.equal(cells(executor)["phase"]!.value, "result-recorded");
  assert.equal(cells(verifier)["phase"]!.value, "completed");
  assert.notEqual(
    cells(executor)["buildHash"]!.value,
    cells(verifier)["buildHash"]!.value,
  );
  assert.equal(cells(executor)["hashKind"]!.value, "feedback-v1 policy hash");
  assert.equal(
    cells(verifier)["hashKind"]!.value,
    "verification-v1 input hash",
  );
  // The retained store has no LoadoutGraph for either actor. Do not rename its
  // different hash axes just to satisfy the planning draft's shorthand.
  assert.equal(cells(executor)["loadoutHash"]!.status, "unknown");
  assert.equal(cells(verifier)["loadoutHash"]!.status, "unknown");
  assert.deepEqual(cells(executor)["allowed"]!.value, ["feedback.audit"]);
  assert.deepEqual(cells(verifier)["allowed"]!.value, [
    "verification.evaluate",
  ]);
  assert.notDeepEqual(
    cells(executor)["denied"]!.value,
    cells(verifier)["denied"]!.value,
  );
  for (const actor of [executor, verifier]) {
    assert.ok(actor.links.some((link) => link.target.startsWith("matrix-")));
    assert.ok(actor.links.some((link) => link.target.startsWith("receipt-")));
    assert.ok(
      actor.links.some((link) => link.target.startsWith("recorded-build-")),
    );
  }
  for (const row of actors) {
    const episode = cells(row)["episode"]?.value;
    if (
      typeof episode !== "string" ||
      !episode.startsWith("ep_verifier_") ||
      episode === accepted
    )
      continue;
    assert.equal(cells(row)["phase"]!.value, "lease-expired");
    assert.equal(
      row.links.some((link) => link.target.startsWith("matrix-")),
      false,
    );
  }
  assert.equal(cells(matrix)["phase"]!.value, "complete");
  assert.equal(cells(matrix)["AC-context.status"]!.value, "verified");
  assert.equal(cells(matrix)["AC-context.stale"]!.value, false);
});

test("WO-032 AC2 the WO-031 operator role has recorded actions and unknown identity, authorship and presence", () => {
  const board = projectBoard(loadFixture("control"));
  const operator = section(board, "control-actors").rows.find(
    (row) => cells(row)["kind"]?.value === "person role",
  )!;
  assert.ok(operator);
  assert.equal(cells(operator)["role"]!.value, "operator");
  assert.equal(cells(operator)["identity"]!.status, "unknown");
  assert.equal(cells(operator)["authorship"]!.status, "unknown");
  assert.equal(cells(operator)["lastAction"]!.value, "FinalReviewRequested");
  assert.deepEqual(cells(operator)["actions"]!.value, [
    "WorkOrderActivated",
    "VerificationRequested",
    "FinalReviewRequested",
  ]);
  assert.equal(cells(operator)["phase"]!.status, "unknown");
  assert.ok(operator.links.length >= 3);
  assert.equal(
    operator.cells.some((cell) =>
      ["attention", "presence", "online"].includes(cell.key),
    ),
    false,
  );
});

test("WO-032 AC3 all shipped exports use the compiler renderer; a new export adds a build without console edits", () => {
  const fixture = loadFixture("selfhost");
  assert.equal(fixture.loadouts?.status, "available");
  if (fixture.loadouts?.status !== "available")
    assert.fail("fixture lacks loadouts");
  const baseline = projectBoard(fixture);
  assert.equal(
    section(baseline, "saved-builds").rows.length,
    fixture.loadouts.value.length,
  );
  for (const row of section(baseline, "saved-builds").rows) {
    const values = cells(row),
      hash = values["semanticHash"]!.value;
    assert.equal(values["hash.code-dsl"]!.value, hash);
    assert.equal(values["hash.function-table"]!.value, hash);
    assert.equal(values["hash.statechart-json"]!.value, hash);
    assert.ok(String(values["tooltip"]!.value).includes(`after=${hash}`));
    assert.match(
      String(values["tooltip"]!.value),
      /GRANTS[\s\S]*RESTRICTIONS[\s\S]*OBLIGATION[\s\S]*PASSIVE[\s\S]*PULSE[\s\S]*INTERRUPT[\s\S]*COST/u,
    );
  }
  const extra = {
    ...seiriLoadout,
    loadoutId: "fixture.additional",
    identity: {
      ...seiriLoadout.identity,
      identityId: "fixture-extra-actor",
      name: "Fixture extra actor",
    },
  };
  let unrelatedCalls = 0;
  const additional = exportedLoadouts(
    {
      extra,
      dispatch: () => {
        unrelatedCalls++;
      },
    },
    "fixture:additional-exports",
    seiriEnvironment(),
  );
  const after = projectBoard({
    ...fixture,
    loadouts: available(fixture.loadouts.ref, [
      ...fixture.loadouts.value,
      ...additional,
    ]),
  });
  assert.equal(unrelatedCalls, 0);
  assert.equal(
    section(after, "saved-builds").rows.length,
    section(baseline, "saved-builds").rows.length + 1,
  );
  assert.ok(
    section(after, "saved-builds").rows.some(
      (row) => row.title === "Fixture extra actor",
    ),
  );
});

test("WO-032 AC4 ten mechanisms retain five counts per source; zero observations never become a rate", () => {
  const input = loadFixture("selfhost"),
    board = projectBoard(input);
  const mechanisms = section(board, "compiled-mechanisms").rows;
  assert.equal(mechanisms.length, 10);
  const observed = input.maturity;
  assert.equal(observed?.status, "available");
  if (observed?.status !== "available") assert.fail("maturity absent");
  const report = object(observed.value);
  for (const row of mechanisms) {
    const values = cells(row);
    assert.equal(values["fixture.observation"]!.value, "observed");
    assert.equal(values["live.observation"]!.value, "unobserved");
    for (const key of ["eligibleEpisodes", "activations", "incidentsPrevented"])
      assert.equal(values[`fixture.${key}`]!.value, 1);
    for (const key of ["falseActivations", "overrides"])
      assert.equal(values[`fixture.${key}`]!.value, 0);
    for (const key of [
      "eligibleEpisodes",
      "activations",
      "incidentsPrevented",
      "falseActivations",
      "overrides",
    ])
      assert.equal(values[`live.${key}`]!.value, 0);
    assert.match(
      String(values["lastActivation"]!.value),
      /^fixture: regression_/u,
    );
    assert.ok(Number(values["rung"]!.value) >= 1);
    assert.equal(values["enforcement"]!.value, "hard");
  }
  assert.equal(observationsFromReport(report).length, 10);
  if (input.feedbackUnits?.status !== "available")
    assert.fail("unit source absent");
  const noFirstPair = {
    ...report,
    fixtures: (report["fixtures"] as { unitId: string }[]).filter(
      (pair) => pair.unitId !== "anti-oscillation",
    ),
  };
  const zeroReport = {
    ...noFirstPair,
    maturity: feedbackMaturity(
      compileFeedbackUnits(input.feedbackUnits.value),
      observationsFromReport(noFirstPair),
    ),
  };
  const zero = section(
    projectBoard({
      ...input,
      maturity: available("fixture:one-unobserved-unit", zeroReport),
    }),
    "compiled-mechanisms",
  ).rows.find((row) => row.title === "anti-oscillation")!;
  assert.equal(cells(zero)["fixture.observation"]!.value, "unobserved");
  assert.equal(cells(zero)["fixture.eligibleEpisodes"]!.value, 0);
  assert.equal(cells(zero)["lastActivation"]!.status, "unknown");
  const changed = projectBoard({
    ...input,
    maturity: available(observed.ref, { ...report, policyHash: "different" }),
  });
  assert.ok(
    section(changed, "compiled-mechanisms").rows.every(
      (row) => cells(row)["fixture.observation"]!.status === "unavailable",
    ),
  );
  const absent = projectBoard({
    ...input,
    maturity: unavailable(observed.ref),
  });
  assert.equal(section(absent, "compiled-mechanisms").rows.length, 10);
  assert.ok(
    section(absent, "compiled-mechanisms").rows.every(
      (row) => cells(row)["fixture.activations"]!.status === "unavailable",
    ),
  );
});

test("WO-032 AC5 control facts preserve legal actions, negative elapsed, failures, index evidence and Beacon separation", () => {
  const input = loadFixture("control");
  assert.equal(input.controlStatus?.status, "available");
  if (input.controlStatus?.status !== "available")
    assert.fail("control absent");
  const original = object(input.controlStatus.value[0]);
  const status = {
    ...original,
    phase: "needs-fix",
    latestVerdict: "fail",
    verificationPath: "fixture/VER-002.md",
    finalReviewPath: null,
    legalNextActions: ["fix"],
    elapsed: { implementation: -23, verification: "unknown" },
  };
  const board = projectBoard({
    ...input,
    controlStatus: available("fixture:failed-control-status", [status]),
  });
  const row = section(board, "orders").rows[0]!;
  assert.equal(cells(row)["phase"]!.value, "needs-fix");
  assert.deepEqual(cells(row)["legalNextActions"]!.value, ["fix"]);
  assert.equal(cells(row)["elapsed.implementation"]!.value, -23);
  assert.equal(cells(row)["elapsed.verification"]!.status, "unknown");
  assert.equal(cells(row)["blockers"]!.value, "fixture/VER-002.md");
  assert.ok(row.links.length > 0);
  assert.ok(
    section(board, "worktrees").rows.every(
      (row) => cells(row)["workerLiveness"]!.status === "unknown",
    ),
  );
  assert.ok(
    section(board, "releases").rows.some((row) =>
      String(cells(row)["workOrders"]!.value).includes("WO-031"),
    ),
  );
  const index = section(board, "work-order-index").rows;
  assert.ok(
    index.some(
      (row) =>
        row.title === "WO-033" &&
        String(
          cells(row)["Dependency reference check (conservative)"]?.value,
        ).includes("blocked on WO-039"),
    ),
  );
});

test("WO-032 text adapters pin formats and refuse malformed, missing or unsupported sources", () => {
  for (const parse of [
    parseConstellation,
    parseReleases,
    parseWorkOrderIndex,
    parseCapabilities,
  ])
    assert.throws(() => parse("different format\n"));
  assert.throws(() => parseConstellation("Beacon x | active\n"));
  assert.throws(() =>
    parseReleases(
      "TAG\tCOMMIT\tAPPLICATION\tWORK ORDERS\nv1.2.3\tnot-a-commit\tv1.2.3\tWO-031\n",
    ),
  );
  assert.throws(() =>
    parseRefutation("unrecognized.json", {
      orders: [],
      planVerdict: "pass",
      holdReasons: [],
    }),
  );
  const board = projectBoard({
    ...loadFixture("control"),
    constellation: available("fixture:changed-format", "wrong\n"),
  });
  assert.equal(section(board, "worktrees").status, "unavailable");
  assert.equal(section(board, "worktrees").rows.length, 0);
  const missing = projectBoard({});
  assert.equal(missing.panels.length, 5);
  assert.ok(
    sections(missing).every((section) => section.status === "unavailable"),
  );
  assert.equal(
    section(
      projectBoard({ refutations: available("fixture:empty-receipts", []) }),
      "refutation-verdicts",
    ).status,
    "unavailable",
  );
});

test("WO-032 the last manual and latest versioned refutations populate verdicts and hold state, without reevaluating the gate", () => {
  const input = loadFixture("refutations");
  if (input.refutations?.status !== "available") assert.fail("receipts absent");
  const all = input.refutations.value;
  const manual = all.filter((document) => document.ref.includes("2026-09-06"));
  assert.equal(manual.length, 6);
  const board = projectBoard({
    refutations: available(input.refutations.ref, [...manual].reverse()),
  });
  const verdicts = section(board, "refutation-verdicts");
  assert.equal(verdicts.status, "available");
  assert.equal(verdicts.rows[0]!.title, "2026-09-06-phase-two-redirect-006");
  assert.equal(
    cells(verdicts.rows.find((row) => row.title === "WO-032")!)["verdict"]!
      .value,
    "thesis-advancing",
  );
  const current = section(projectBoard(input), "refutation-verdicts");
  assert.equal(current.rows[0]!.title, "2026-09-07-wo041-live-001");
  assert.equal(cells(current.rows[0]!)["scope"]!.value, "evidence");
  assert.equal(
    cells(current.rows[0]!)["holdStatus"]!.value,
    "no holds recorded",
  );
  const first = manual.find((document) =>
    document.ref.endsWith("phase-two-redirect.json"),
  )!;
  const held = section(
    projectBoard({ refutations: available(input.refutations.ref, [first]) }),
    "refutation-verdicts",
  );
  assert.equal(cells(held.rows[0]!)["holdStatus"]!.value, "hold");
  assert.ok(
    (cells(held.rows[0]!)["holdReasons"]!.value as readonly string[]).length >
      0,
  );
});

test("WO-032 AC5 each role's pinned answering cells exist and the questions match product 13", () => {
  const mapping = JSON.parse(
    readFileSync(join(fixtureRoot, "role-answers.json"), "utf8"),
  ) as {
    role: string;
    question: string;
    fixture: string;
    section: string;
    rowTitle: string;
    keys: readonly string[];
  }[];
  const roles = tableRows(
    readFileSync(join(root, "docs/product/13-uifa-roles.md"), "utf8"),
    ["Role", "Owns", "Produces", "The question they keep asking"],
  );
  assert.equal(mapping.length, 5);
  for (const answer of mapping) {
    const original = roles.find(
      (row) =>
        plainText(row.key) === `UIFA ${answer.role.replaceAll("-", " ")}`,
    )!;
    assert.ok(original);
    assert.equal(
      original.values["The question they keep asking"]!.replace(
        /^[“"]|[”"]$/gu,
        "",
      ),
      answer.question,
    );
    assert.equal(
      ROLE_ANSWERS.find((role) => role.role === answer.role)!.question,
      answer.question,
    );
    const row = section(
      projectBoard(loadFixture(answer.fixture)),
      answer.section,
    ).rows.find((row) => row.title === answer.rowTitle)!;
    assert.ok(row, `role ${answer.role} lacks its pinned answering row`);
    for (const key of answer.keys)
      assert.equal(
        cells(row)[key]?.status,
        "known",
        `${answer.role}: ${key} does not answer the question`,
      );
  }
  const lead = mapping.find((row) => row.role === "product-lead")!;
  assert.equal(lead.section, "refutation-verdicts");
  assert.deepEqual(lead.keys, ["verdict", "reason"]);
});

test("WO-032 AC6 hostile source text stays inert; output is local anchors and styles only", () => {
  const board = projectBoard(combinedFixture());
  const attack =
    '<script>alert(1)</script><img src="https://example.invalid/x" onerror="run()">\u001b[31m';
  const changed: BoardView = {
    ...board,
    panels: board.panels.map((panel, index) =>
      index
        ? panel
        : {
            ...panel,
            title: attack,
            sections: panel.sections.map((section) => ({
              ...section,
              rows: section.rows.map((row) => ({
                ...row,
                title: attack,
                cells: row.cells.map((cell) =>
                  cell.status === "known" ? { ...cell, value: attack } : cell,
                ),
              })),
            })),
          },
    ),
  };
  const html = renderHtml(changed);
  assert.ok(html.includes("&lt;script&gt;"));
  assert.doesNotMatch(html, /<script|<img|href="https?:|\u001b/u);
  assert.doesNotMatch(renderTerminal(changed), /\u001b/u);
  const wide = {
    ...board,
    panels: [
      { ...board.panels[0]!, question: "整理".repeat(90) },
      ...board.panels.slice(1),
    ],
  };
  assert.ok(
    renderTerminal(wide)
      .split("\n")
      .filter((line) => /^[整理]+$/u.test(line))
      .every((line) => line.length <= 40),
  );
  const combinedMarks = {
    ...board,
    panels: [
      {
        ...board.panels[0]!,
        title: "\u0301".repeat(9) + " a" + "界".repeat(20),
      },
      ...board.panels.slice(1),
    ],
  };
  assert.ok(
    renderTerminal(combinedMarks, 40)
      .split("\n")
      .every((line) => displayWidth(line) <= 40),
  );
  assert.throws(() => renderTerminal(board, 12));
});

test("WO-032 command renders recorded sources without changing them; HTML output preserves existing files and refuses conflicting modes", () => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-console-test-"));
  try {
    const input = join(directory, "sources.json"),
      output = join(directory, "board.html");
    writeFileSync(input, JSON.stringify(loadFixture("selfhost")));
    const before = digest(readFileSync(input, "utf8"));
    const cli = join(root, "packages/console/dist/src/cli.js");
    const run = (...args: string[]) =>
      spawnSync(process.execPath, [cli, "board", "--sources", input, ...args], {
        encoding: "utf8",
        maxBuffer: 8_000_000,
      });
    const json = run("--json");
    assert.equal(json.status, 0, json.stderr);
    assert.equal(JSON.parse(json.stdout).viewModelVersion, "uifa-board-v1");
    const html = run("--html", output);
    assert.equal(html.status, 0, html.stderr);
    const saved = readFileSync(output, "utf8");
    assert.equal(run("--html", output).status, 1);
    assert.equal(readFileSync(output, "utf8"), saved);
    assert.equal(
      run("--json", "--html", join(directory, "another.html")).status,
      1,
    );
    assert.equal(run("--html", join(directory, "source.ts")).status, 1);
    assert.equal(digest(readFileSync(input, "utf8")), before);
    assert.deepEqual(readdirSync(directory).sort(), [
      "board.html",
      "sources.json",
    ]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("WO-032 unavailable worker stores stay unavailable; corrupt logs do not become empty success", () => {
  const absent = storeFromLog(
    "missing",
    "Missing store",
    unavailable("fixture:missing-store"),
  );
  const corrupt = storeFromLog(
    "corrupt",
    "Corrupt store",
    available("fixture:corrupt-store", '{"schemaVersion":1'),
  );
  for (const input of [absent, corrupt]) {
    assert.equal(input.status.status, "unavailable");
    assert.equal(input.audit.status, "unavailable");
    const board = projectBoard({ stores: [input] });
    assert.ok(
      board.panels[0]!.sections.every(
        (section) => section.status === "unavailable",
      ),
    );
  }
});

test("WO-032 host collection reads current sources and all shipped exports without changing control or creating a missing store", async () => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-console-read-only-"));
  const absent = join(directory, "missing-store");
  const paths = [
    "docs/control/resume.jsonl",
    "docs/control/current.md",
    ...readdirSync(join(root, "docs/control/orders"))
      .filter((name) => /^WO-\d{3}\.jsonl$/u.test(name))
      .sort()
      .map((name) => `docs/control/orders/${name}`),
    "docs/work-orders/README.md",
    "docs/planning/capability-table.md",
    "docs/publication/audience-status-index.md",
    "docs/product/06-roadmap.md",
  ];
  const snapshot = () =>
    paths.map((path) => [path, digest(readFileSync(join(root, path), "utf8"))]);
  const before = snapshot();
  try {
    const sources = await collectSources(root, [absent]);
    assert.deepEqual(
      snapshot(),
      before,
      "read-only collection changed a canonical source",
    );
    assert.equal(
      existsSync(absent),
      false,
      "reading a missing store created it",
    );
    assert.equal(sources.stores?.at(-1)?.status.status, "unavailable");
    assert.equal(sources.stores?.at(-1)?.audit.status, "unavailable");
    for (const source of [
      sources.loadouts,
      sources.feedbackUnits,
      sources.maturity,
      sources.controlLog,
      sources.controlStatus,
      sources.controlUsage,
      sources.constellation,
      sources.releases,
      sources.workOrderIndex,
      sources.capabilities,
      sources.publication,
      sources.roadmap,
      sources.refutations,
    ]) {
      assert.equal(source?.status, "available", source?.ref);
    }
    if (sources.loadouts?.status !== "available")
      assert.fail("saved exports unavailable");
    const board = projectBoard(sources);
    const builds = section(board, "saved-builds");
    const distinct = new Set(
      sources.loadouts.value.map(({ graph, environment }) =>
        JSON.stringify([graph, environment]),
      ),
    );
    assert.equal(builds.rows.length, distinct.size);
    for (const row of builds.rows)
      assert.equal(cells(row)["hashAgreement"]?.value, "equivalent");
    for (const key of [
      "compiled-mechanisms",
      "control-actors",
      "orders",
      "worktrees",
      "releases",
      "work-order-index",
      "usage",
      "capabilities",
      "publication",
      "roadmap",
      "refutation-verdicts",
    ])
      assert.equal(section(board, key).status, "available", key);
    assert.ok(
      section(board, "capabilities").rows.some((row) =>
        row.title.includes("projection.uifa-board"),
      ),
    );
    assert.equal(
      section(board, "publication")
        .rows.find((row) => row.title === "Actor board v0")
        ?.cells.find((cell) => cell.key === "status")?.value,
      "implemented",
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
