import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "@dotln/skeleton/dist/src/temporary-roots.js";
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendEvent } from "@dotln/kernel";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { homedir, tmpdir } from "node:os";
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
import { collectSources, editionStream, storeFromLog } from "../src/collect.js";
import { available, id, object, unavailable } from "../src/values.js";
import { displayWidth, TERMINAL_WIDTH } from "../src/render.js";
import {
  cellText,
  parseCapabilities,
  parseConstellation,
  parseReleases,
  parseRefutation,
  parseWorkstreams,
  tableRows,
} from "../src/text-sources.js";
import { readWorkOrderCards } from "@dotln/skeleton/dist/src/runtime-status-contract.js";
import {
  combinedFixture,
  fixtureRoot,
  currentSelfhostManifest,
  loadFixture,
  markdownStructure,
  readFixtureManifest,
  root,
} from "./fixtures.js";

/** What the index command prints with `--json`: both pages' cards, the
 * workstream observation and the release tags, read from no page. */
const indexCards = () =>
  execFileSync(
    process.execPath,
    [join(root, "scripts/work-orders.mjs"), "index", "--json"],
    { cwd: root, encoding: "utf8", maxBuffer: 64_000_000 },
  );

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

import { schemaMatches } from "./schema.js";

const schema = JSON.parse(
  readFileSync(
    join(root, "packages/console/uifa-board-v1.schema.json"),
    "utf8",
  ),
) as Record<string, unknown>;

test("[document] WO-174 console fixture generator checks the current lazy exports", () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/console-fixtures.mjs", "--check"],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  for (const name of Object.keys(readFixtureManifest().cases))
    assert.ok(
      result.stdout.includes(`${name}: JSON, terminal, HTML match\n`),
      `generator did not check ${name}`,
    );
});

test("[document] WO-174 fixture drafts validate supplied pins without changing the recorded manifest", () => {
  const before = readFileSync(join(fixtureRoot, "manifest.json"), "utf8");
  const draft = readFixtureManifest();
  const input = draft.inputs["selfhostAudit"]!;
  input.sha256 =
    (input.sha256.startsWith("a") ? "b" : "a") + input.sha256.slice(1);
  assert.throws(
    () => loadFixture("selfhost", draft),
    (error: unknown) => {
      assert.ok(error instanceof assert.AssertionError);
      assert.ok(
        error.message.startsWith(
          `recorded fixture input changed: ${input.path}`,
        ),
      );
      assert.equal(error.expected, input.sha256);
      return true;
    },
  );
  assert.equal(
    readFileSync(join(fixtureRoot, "manifest.json"), "utf8"),
    before,
  );
  assert.doesNotThrow(() => loadFixture("selfhost"));
});

/** What every board must be, whatever evidence it was projected from: its
 * five panels, a terminal render within the width, markup that loads and
 * runs nothing, links that land, evidence under every cell, and no private
 * text. */
function boardProperties(
  board: ReturnType<typeof projectBoard>,
  encoded: string,
  terminal: string,
  html: string,
) {
  assert.deepEqual(
    board.panels.map((panel) => panel.id),
    ["actors", "builds", "mechanisms", "work", "blueprint"],
  );
  assert.ok(
    terminal.split("\n").every((line) => displayWidth(line) <= TERMINAL_WIDTH),
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
}

test("[document] WO-032 AC1/6 recorded fixture cases", async (t) => {
  for (const name of Object.keys(readFixtureManifest().cases))
    await t.test(
      `WO-032 AC1/6 ${name}: recorded JSON and both renders; pure, schema-valid, linked and bounded`,
      () => {
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
        boardProperties(board, encoded, terminal, html);
      },
    );
});

test("[document] WO-276 criterion E3: the feedback edition the evidence selection names now passes the board's property checks, with no byte comparison", async () => {
  const current = await currentSelfhostManifest();
  // The recorded case reads its fixed copy and not the selected edition, and
  // the generator's check, which sync and the structural phase run, passes
  // all the same: a newer edition stales nothing here.
  assert.notEqual(
    readFixtureManifest().inputs["maturity"]!.path,
    current.inputs["maturity"]!.path,
  );
  const check = spawnSync(
    process.execPath,
    ["scripts/console-fixtures.mjs", "--check"],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(check.status, 0, `${check.stdout}${check.stderr}`);
  const sources = loadFixture("selfhost", current);
  const board = projectBoard(sources),
    encoded = JSON.stringify(board, null, 2) + "\n";
  assert.ok(
    schemaMatches(JSON.parse(encoded), schema, schema),
    "serialized board violates its JSON schema",
  );
  boardProperties(board, encoded, renderTerminal(board), renderHtml(board));
});

test("[document] WO-032 schema refuses a different version, unknown fields, unsupported cells and unlabeled missing facts", () => {
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

test("[document] WO-032 AC2 executor, verifier attempts, authority, hashes and actual accepted episode remain distinct", () => {
  const fixture = loadFixture("selfhost");
  const store = fixture.stores!.find(
    (item) => item.id === "selfhost-verifier",
  )!;
  assert.equal(store.status.status, "available");
  if (store.status.status !== "available")
    assert.fail("missing verifier status");
  const prior = store.status.value.episodes.find(
    (episode) => episode.phase === "completed",
  )!;
  assert.ok(prior, "fixture needs the accepted completed attempt");
  // Keep the live recording immutable and add a distinct expired attempt only
  // to this fixture-local log, independent of the edition's retry count.
  // A schema 2 edition pins the stream by reference (WO-154).
  const pinned = readFixtureManifest().inputs["selfhostVerifier"]!.path;
  let log = editionStream(root, readFileSync(join(root, pinned), "utf8"), [
    join(dirname(pinned), "feedback.json"),
  ]);
  for (const [type, occurredAt] of [
    ["WorkerAttemptStarted", prior.startedAt],
    ["WorkerLeaseExpired", prior.leaseExpiresAt],
  ] as const) {
    ({ log } = appendEvent(log, {
      schemaVersion: 1,
      type,
      occurredAt,
      actorId: "worker-host",
      workstreamId: "fixture-extra-verifier-attempt",
      payload: {
        workerEpisodeId: "ep_verifier_fixture_expired",
        commandId: prior.commandId,
        model: prior.model,
        effort: prior.effort,
        transport: prior.transport,
        mode: prior.mode,
        leaseExpiresAt: prior.leaseExpiresAt,
      },
    }));
  }
  const replacement = storeFromLog(
    store.id,
    store.label,
    available("fixture:two-verifier-attempts", log),
  );
  assert.equal(replacement.status.status, "available");
  if (replacement.status.status !== "available")
    assert.fail("fixture log refused");
  assert.ok(replacement.status.value.episodes.length >= 2);
  const board = projectBoard({
    ...fixture,
    stores: fixture.stores!.map((item) =>
      item === store ? replacement : item,
    ),
  });
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
  let expiredAttemptsChecked = 0;
  for (const row of actors) {
    const episode = cells(row)["episode"]?.value;
    if (
      typeof episode !== "string" ||
      !episode.startsWith("ep_verifier_") ||
      episode === accepted
    )
      continue;
    expiredAttemptsChecked++;
    assert.equal(cells(row)["phase"]!.value, "lease-expired");
    assert.equal(
      row.links.some((link) => link.target.startsWith("matrix-")),
      false,
    );
  }
  assert.ok(
    expiredAttemptsChecked >= 1,
    "the expired-attempt assertions must execute",
  );
  assert.equal(cells(matrix)["phase"]!.value, "complete");
  assert.equal(cells(matrix)["AC-context.status"]!.value, "verified");
  assert.equal(cells(matrix)["AC-context.stale"]!.value, false);
});

test("[document] WO-032 AC2 the WO-031 operator role has recorded actions and unknown identity, authorship and presence", () => {
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

test("[document] WO-032 AC3 all shipped exports use the compiler renderer; a new export adds a build without console edits", () => {
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

test("[document] WO-032 AC4 ten mechanisms retain five counts per source; zero observations never become a rate", () => {
  const input = loadFixture("selfhost"),
    board = projectBoard(input);
  const mechanisms = section(board, "compiled-mechanisms").rows;
  assert.equal(mechanisms.length, 10);
  const observed = input.maturity;
  assert.equal(observed?.status, "available");
  if (observed?.status !== "available") assert.fail("maturity absent");
  const report = object(observed.value);
  const unitSource = input.feedbackUnits;
  if (unitSource?.status !== "available") assert.fail("unit source absent");
  assert.equal(
    unitSource.value.filter((unit) => unit.enforcement === "hard").length,
    3,
  );
  for (const row of mechanisms) {
    const values = cells(row);
    assert.equal(values["fixture.observation"]!.value, "observed");
    assert.equal(values["live.observation"]!.value, "unobserved");
    for (const key of ["eligibleEpisodes", "activations"])
      assert.equal(values[`fixture.${key}`]!.value, 1);
    assert.equal(
      values["fixture.incidentsPrevented"]!.value,
      values["enforcement"]!.value === "hard" ? 1 : 0,
    );
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
    assert.ok(
      ["hard", "advisory"].includes(String(values["enforcement"]!.value)),
    );
  }
  assert.equal(observationsFromReport(report, unitSource.value).length, 10);
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
      observationsFromReport(noFirstPair, unitSource.value),
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

test("[document] WO-032 AC5 control facts preserve legal actions, negative elapsed, failures, index evidence and Beacon separation", () => {
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
  // The closed order's card is on the history page, indexed before the
  // status rows link (WO-190).
  assert.ok(
    section(board, "work-order-history").rows.some(
      (card) => card.id === row.links[0]!.target,
    ),
  );
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

test("[document] WO-032 text adapters pin formats and refuse malformed, missing or unsupported sources", () => {
  // A text without the workstream observation has no groups; the WO-080
  // test pins its malformed observations.
  for (const parse of [
    parseConstellation,
    parseReleases,
    (text: string) => readWorkOrderCards(text, "index"),
    (text: string) => parseCapabilities(markdownStructure(text)),
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

test("[document] WO-190 the index reader takes each page's cards from the index record, records each card's line, accepts an empty page, and an overlapping card fails only the history section", () => {
  // The index record the index command writes beside its two pages; the
  // pages' Markdown is for people and is not read.
  const file = (pages: {
    index?: readonly unknown[];
    history?: readonly unknown[];
  }) =>
    JSON.stringify({
      schemaVersion: 1,
      index: { cards: pages.index ?? [] },
      history: { cards: pages.history ?? [] },
      workstreams: [],
      releaseTags: [],
    });
  const card = (section: string, id = "WO-901") => ({
    id,
    line: 9,
    section,
    title: "WO-901 — Fixture (version assigned at activation)",
    phase: "draft",
    dependency: "unknown",
    verdict: null,
    fields: {
      State: "draft.",
      Authority: "docs/work-orders/WO-901-fixture.md",
    },
    links: ["WO-901-fixture.md"],
  });
  const rows = readWorkOrderCards(file({ index: [card("Open")] }), "index");
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.id, "WO-901");
  assert.equal(rows[0]!.line, 9);
  assert.equal(
    rows[0]!.title,
    "WO-901 — Fixture (version assigned at activation)",
  );
  assert.deepEqual(Object.keys(rows[0]!.fields), ["State", "Authority"]);
  // Each page reads only its own cards.
  assert.deepEqual(
    readWorkOrderCards(file({ history: [card("Closed")] }), "index"),
    [],
  );
  assert.equal(
    readWorkOrderCards(file({ history: [card("Closed")] }), "history").length,
    1,
  );
  // A card in another page's section, a repeated card, another schema or a
  // page in place of the index record refuses.
  assert.throws(() =>
    readWorkOrderCards(file({ history: [card("Open")] }), "history"),
  );
  assert.throws(() =>
    readWorkOrderCards(file({ index: [card("Open"), card("Open")] }), "index"),
  );
  assert.throws(() =>
    readWorkOrderCards(
      file({}).replace('"schemaVersion":1', '"schemaVersion":2'),
      "index",
    ),
  );
  assert.throws(() =>
    readWorkOrderCards(
      "# Work orders\n\nThis file is generated by fixture.\n",
      "index",
    ),
  );
  assert.deepEqual(readWorkOrderCards(file({}), "index"), []);
  // The index command's own output names each card by its heading's line.
  const cards = indexCards();
  for (const [name, which] of [
    ["README.md", "index"],
    ["HISTORY.md", "history"],
  ] as const) {
    const lines = readFileSync(
      join(root, "docs/work-orders", name),
      "utf8",
    ).split("\n");
    for (const card of readWorkOrderCards(cards, which)) {
      assert.match(card.title, /^WO-\d{3} — /u, name);
      assert.equal(lines[card.line - 1], `### ${card.id}`, name);
    }
  }
  const control = loadFixture("control");
  if (control.workOrderIndex?.status !== "available")
    assert.fail("control index record absent");
  const recorded = JSON.parse(control.workOrderIndex.value) as {
    history: { cards: unknown[] };
  };
  recorded.history.cards.push({
    ...card("Closed", "WO-033"),
    phase: "closed",
  });
  const overlapping = projectBoard({
    ...control,
    workOrderIndex: available(
      "fixture:overlapping-history",
      JSON.stringify(recorded),
    ),
  });
  assert.equal(
    section(overlapping, "work-order-history").status,
    "unavailable",
  );
  assert.equal(section(overlapping, "work-order-history").rows.length, 0);
  assert.equal(
    section(overlapping, "work-order-index").rows.length,
    section(projectBoard(control), "work-order-index").rows.length,
  );
  // The control fixture's releases name only settled orders, so their links
  // live on the history page: present with it, absent without it, and the
  // board renders either way.
  assert.ok(
    section(projectBoard(control), "releases").rows.some(
      (row) => row.links.length > 0,
    ),
  );
  assert.equal(section(overlapping, "releases").status, "available");
  assert.ok(
    section(overlapping, "releases").rows.every(
      (row) => row.links.length === 0,
    ),
  );
  assert.equal(
    overlapping.panels.length,
    projectBoard(control).panels.length,
    "the overlap drops no panel",
  );
});

test("[document] WO-190 the work view reads both generated pages; every release row keeps the evidence links it had on the single page at this order's base", () => {
  const baseCommit = "e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc";
  const base = execFileSync(
    "git",
    ["show", `${baseCommit}:docs/work-orders/README.md`],
    { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  const readme = readFileSync(join(root, "docs/work-orders/README.md"), "utf8");
  const history = readFileSync(
    join(root, "docs/work-orders/HISTORY.md"),
    "utf8",
  );
  const recordedCards = indexCards();
  // The release rows the base page recorded, from the repository's own list.
  const recorded = new Set(
    (
      JSON.parse(
        /<!-- dotln-work-order-tags: (\[.*\]) -->/u.exec(base)![1]!,
      ) as { name: string }[]
    ).map((tag) => tag.name),
  );
  const listed = execFileSync(
    process.execPath,
    [join(root, "scripts/release.mjs"), "list"],
    { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  )
    .trimEnd()
    .split("\n");
  const releases = available(
    "release:list",
    [
      listed[0]!,
      ...listed.slice(1).filter((line) => recorded.has(line.split("\t")[0]!)),
    ].join("\n") + "\n",
  );
  const links = (sources: BoardSources) =>
    Object.fromEntries(
      section(projectBoard(sources), "releases").rows.map((row) => [
        row.title,
        row.links.map((link) => `${link.label} => ${link.target}`).sort(),
      ]),
    );
  // The base page predates the index record, so the links it gave are
  // derived from its cards by this test's own scan: a release row links each
  // order it names that had a card on that page.
  const cards = (text: string) =>
    [...text.matchAll(/^### (WO-\d{3})$/gmu)].map((match) => match[1]!);
  const carded = new Set(cards(base));
  const before = Object.fromEntries(
    section(projectBoard({ releases }), "releases").rows.map((row) => [
      row.title,
      String(cells(row)["workOrders"]!.value)
        .split(",")
        .filter((order) => carded.has(order))
        .map(
          (order) => `Evidence for ${order} => ${id("indexed-order", order)}`,
        )
        .sort(),
    ]),
  );
  const after = links({
    workOrderIndex: available("work-orders:index--json", recordedCards),
    releases,
  });
  assert.equal(
    Object.keys(before).length,
    recorded.size,
    "every tag the base page recorded is still listed",
  );
  assert.ok(Object.values(before).some((row) => row.length > 0));
  assert.deepEqual(after, before);
  const withoutHistory = JSON.parse(recordedCards) as {
    history: { cards: unknown[] };
  };
  withoutHistory.history.cards = [];
  assert.notDeepEqual(
    links({
      workOrderIndex: available(
        "work-orders:index--json",
        JSON.stringify(withoutHistory),
      ),
      releases,
    }),
    before,
    "the history page's cards are what keep the settled orders' links",
  );
  for (const order of cards(base))
    assert.equal(
      [readme, history].filter((page) => cards(page).includes(order)).length,
      1,
      `${order} is on exactly one page`,
    );
});

test("[document] WO-032 the last manual and latest versioned refutations populate verdicts and hold state, without reevaluating the gate", () => {
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

test("WO-132 goal receipts render answers, findings and recorded hold status", () => {
  for (const verdict of ["aligned", "aligned-with-findings", "misaligned"]) {
    const finding = {
      criterionId: "AC1",
      kind: verdict === "misaligned" ? "observed-failure" : "known-issue",
      reason: "Synthetic fixture finding.",
      evidence: verdict === "misaligned" ? "observation:fixture" : null,
      reopenWhen: verdict === "misaligned" ? null : "A recorded run fails.",
    };
    const value = {
      schemaVersion: "plan-refutation-receipt-v1",
      receiptId: "2030-01-01-goal-001",
      pass: { kind: "planning" },
      result: {
        schemaVersion: "plan-goal-review-v1",
        planVerdict: verdict,
        holdReasons:
          verdict === "misaligned"
            ? [
                {
                  workOrderId: "WO-132",
                  criterionId: "AC1",
                  reason: finding.reason,
                },
              ]
            : [],
        orders: [
          {
            workOrderId: "WO-132",
            verdict,
            criticalPathAndNoOp: "Unblocks the fixture gate.",
            systemTraps: "Considers all eight traps.",
            removalBalance: "Removes a recurring check.",
            failureBehavior: "Retains the previous behavior.",
            findings: verdict === "aligned" ? [] : [finding],
          },
        ],
      },
    };
    const ref = "docs/planning/refutations/2030-01-01-goal-001.json";
    const result = parseRefutation(ref, value);
    assert.equal(result.planVerdict, verdict);
    assert.deepEqual(result.rows[0]!.roles, []);
    assert.equal(result.rows[0]!.thesis, null);
    for (const answer of [
      "Unblocks the fixture gate.",
      "Considers all eight traps.",
      "Removes a recurring check.",
      "Retains the previous behavior.",
    ])
      assert.ok(result.rows[0]!.reason.includes(answer));
    if (verdict !== "aligned") {
      assert.ok(result.rows[0]!.reason.includes(finding.reason));
      assert.ok(
        result.rows[0]!.reason.includes(
          finding.evidence ?? finding.reopenWhen!,
        ),
      );
    }
    const verdicts = section(
      projectBoard({ refutations: available(ref, [{ ref, value }]) }),
      "refutation-verdicts",
    );
    assert.equal(verdicts.status, "available");
    assert.equal(
      cells(verdicts.rows[0]!)["holdStatus"]!.value,
      verdict === "misaligned" ? "hold" : "no holds recorded",
    );
    assert.equal(cells(verdicts.rows[1]!)["verdict"]!.value, verdict);
  }
});

test("[document] WO-032 AC5 each role's pinned answering cells exist and the questions match product 13", () => {
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
    markdownStructure(
      readFileSync(join(root, "docs/product/13-uifa-roles.md"), "utf8"),
    ),
    ["Role", "Owns", "Produces", "The question they keep asking"],
  );
  assert.equal(mapping.length, 5);
  for (const answer of mapping) {
    const original = roles.find(
      (row) => cellText(row.key) === `UIFA ${answer.role.replaceAll("-", " ")}`,
    )!;
    assert.ok(original);
    assert.equal(
      cellText(original.values["The question they keep asking"]!).replace(
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

test("[document] WO-032 AC6 hostile source text stays inert; output is local anchors and styles only", () => {
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

test("[document] WO-032 command renders recorded sources without changing them; HTML output preserves existing files and refuses conflicting modes", () => {
  const directory = createFixtureRoot(join(tmpdir(), "dotln-console-test-"));
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
      ".dotln-owner.json",
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

test("[document] WO-032 host collection reads current sources and all shipped exports without changing control or creating a missing store", async () => {
  const directory = createFixtureRoot(
    join(tmpdir(), "dotln-console-read-only-"),
  );
  const absent = join(directory, "missing-store");
  const paths = [
    "docs/control/resume.jsonl",
    "docs/control/current.md",
    ...readdirSync(join(root, "docs/control/orders"))
      .filter((name) => /^WO-\d{3}\.jsonl$/u.test(name))
      .sort()
      .map((name) => `docs/control/orders/${name}`),
    "docs/work-orders/README.md",
    "docs/work-orders/HISTORY.md",
    "docs/control/release-history.json",
    "docs/control/workstream-observations.json",
    "docs/planning/capability-table.md",
    "docs/publication/audience-status-index.md",
    "docs/product/06-roadmap.md",
  ];
  const snapshot = () =>
    paths.map((path) => [path, digest(readFileSync(join(root, path), "utf8"))]);
  const before = snapshot();
  try {
    const sources = await collectSources(root, [absent]);
    for (const id of ["selfhost-audit", "selfhost-verifier"]) {
      const store = sources.stores?.find((entry) => entry.id === id);
      assert.equal(
        store?.status.status,
        "available",
        `${id}: current default stream must replay`,
      );
      assert.equal(
        store?.audit.status,
        "available",
        `${id}: current default stream must project`,
      );
    }
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
      assert.equal(
        source?.status,
        "available",
        source?.ref ?? "missing source",
      );
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
      "work-order-history",
      "workstreams",
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

test("WO-142 one throwing loadout factory preserves healthy builds and names its failure", () => {
  const failures: { ref: string; status: "unavailable"; reason: string }[] = [];
  const loadouts = exportedLoadouts(
    {
      before: seiriLoadout,
      brokenLoadout: () => {
        throw new Error("fixture factory cause");
      },
      laterLoadout: () => ({ ...seiriLoadout, loadoutId: "fixture-later" }),
    },
    "fixture:exports",
    seiriEnvironment(),
    (ref, reason) => failures.push({ ref, status: "unavailable", reason }),
  );
  assert.equal(loadouts.length, 2);
  const board = projectBoard({
    loadouts: available("fixture:exports", loadouts),
    loadoutFailures: failures,
  });
  assert.equal(section(board, "saved-builds").rows.length, 2);
  assert.ok(
    board.sources.some(
      (source) =>
        source.ref === "fixture:exports#brokenLoadout" &&
        source.status === "unavailable" &&
        source.explanation === "invalid format",
    ),
  );
});

test("Store projection codes parse failures without exposing source content", () => {
  const store = storeFromLog(
    "bad",
    "Bad fixture",
    available("fixture:bad-log", "not-json\n"),
  );
  assert.equal(store.audit.status, "unavailable");
  if (store.audit.status !== "unavailable") assert.fail("bad JSON projected");
  assert.equal(store.audit.reason, "invalid format");
});

test("WO-225 board failure strings contain no fixture root, Node binary or home directory", async () => {
  const directory = createFixtureRoot(
    join(tmpdir(), "dotln-console-failures-"),
  );
  try {
    mkdirSync(join(directory, "scripts"));
    writeFileSync(
      join(directory, "scripts/worktree.mjs"),
      `console.log(${JSON.stringify(`Beacon fixture:refused | refused | directory cannot be read: ${directory}/refused\nGroup Beacon | active=0 closed=0 | group-v1 | 8 bytes`)});`,
    );
    const sources = await collectSources(directory, [
      join(directory, "missing-store"),
    ]);
    const board = projectBoard(sources);
    assert.ok(schemaMatches(board, schema, schema));
    const json = JSON.stringify(board);
    for (const forbidden of [directory, process.execPath, homedir()])
      assert.ok(!json.includes(forbidden), "board leaked a private path");
    assert.equal(
      cells(section(board, "worktrees").rows[0]!)["age"]!.value,
      "directory cannot be read",
    );
    assert.equal(sources.stores?.at(-1)?.status.status, "unavailable");
    assert.equal(sources.maturity?.status, "unavailable");
    const reasons = new Set([
      "not found",
      "not readable",
      "invalid format",
      "timed out",
      "command failed (exit 1)",
    ]);
    for (const source of Object.values(sources))
      if (source && !Array.isArray(source) && source.status === "unavailable")
        assert.ok(reasons.has(source.reason), `${source.ref}: uncoded reason`);
    const cli = spawnSync(
      process.execPath,
      [
        join(root, "packages/console/dist/src/cli.js"),
        "board",
        "--json",
        "--sources",
        join(directory, "sources.json"),
      ],
      { encoding: "utf8" },
    );
    assert.notEqual(cli.status, 0, "a missing sources file is refused");
    writeFileSync(join(directory, "sources.json"), JSON.stringify(sources));
    const rendered = execFileSync(
      process.execPath,
      [
        join(root, "packages/console/dist/src/cli.js"),
        "board",
        "--json",
        "--sources",
        join(directory, "sources.json"),
      ],
      { encoding: "utf8" },
    );
    assert.deepEqual(JSON.parse(rendered), board);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("WO-225 carried board schema admits the empty-source projection", () => {
  assert.ok(schemaMatches(projectBoard({}), schema, schema));
});

test("WO-219 console projects chained actor corrections with segment evidence and keeps raw events", () => {
  const actor = {
    harness: "codex-cli",
    harnessVersion: "fixture",
    model: "before",
    effort: "high",
    source: "unknown",
    raw: "ultra",
    mode: "subagents",
  };
  const events = [
    { type: "WorkOrderActivated", workOrderId: "WO-998" },
    { type: "WorkOrderActivated", workOrderId: "WO-999" },
    { type: "ImplementationReady", workOrderId: "WO-999", actor },
    {
      type: "RecordCorrected",
      workOrderId: "WO-999",
      subject: { ordinal: 3, type: "ImplementationReady" },
      fields: { model: "corrected", harnessVersion: "corrected-version" },
      actor,
    },
    {
      type: "RecordCorrected",
      workOrderId: "WO-999",
      subject: { ordinal: 3, type: "ImplementationReady" },
      fields: { effort: "xhigh", source: "operator-attested" },
      actor,
    },
  ];
  const sources: BoardSources = {
    controlLog: available("control:canonical-segments", [
      { ref: "docs/control/resume.jsonl", value: events },
    ]),
  };
  const before = JSON.stringify(sources);
  freeze(sources);
  const board = projectBoard(sources);
  const control = section(board, "control-actors");
  assert.equal(
    control.status,
    "available",
    control.explanation ?? "control actors should project",
  );
  const row = control.rows.find(
    (entry) => cells(entry)["lastAction"]?.value === "ImplementationReady",
  )!;
  assert.ok(row);
  assert.equal(cells(row)["model"]!.value, "corrected");
  assert.equal(cells(row)["effort"]!.value, "xhigh");
  assert.equal(cells(row)["harnessVersion"]!.value, "corrected-version");
  assert.equal(cells(row)["source"]!.value, "operator-attested");
  assert.deepEqual(cells(row)["correctedBy"]!.value, [4, 5]);
  for (const ordinal of [4, 5])
    assert.ok(
      board.evidence.some(
        (entry) =>
          entry.record === `append:${ordinal} (RecordCorrected)` &&
          cells(row)["model"]!.evidence.includes(entry.id),
      ),
    );
  assert.equal(JSON.stringify(sources), before);
});

test("[document] WO-080 workstreams case shows every column and the stale mark", () => {
  const sources = loadFixture("workstreams");
  const board = projectBoard(sources);
  const grouped = section(board, "workstreams");
  assert.equal(grouped.status, "available");
  assert.equal(grouped.rows.length, 3);
  const first = cells(grouped.rows[0]!);
  assert.deepEqual(Object.keys(first), [
    "workstream",
    "workOrder",
    "repository",
    "base",
    "phase",
    "verdict",
    "integration",
    "stale",
  ]);
  assert.equal(first["workstream"]!.value, "WS-001");
  assert.equal(first["workOrder"]!.value, "WO-301");
  assert.equal(first["repository"]!.value, "service");
  assert.match(String(first["base"]!.value), /^[a-f0-9]{40}$/u);
  assert.equal(first["phase"]!.value, "draft");
  assert.equal(first["verdict"]!.value, "unknown");
  assert.equal(first["integration"]!.value, "behind");
  assert.equal(first["stale"]!.value, "yes");
  assert.equal(cells(grouped.rows[1]!)["stale"]!.value, "no");
  assert.ok(grouped.rows.every((row) => row.links.length === 1));
  assert.ok(schemaMatches(board, schema, schema));
  assert.match(renderTerminal(board), /Workstreams/u);
  assert.match(renderHtml(board), /Workstreams/u);
});

test("[document] WO-080 an index record without workstreams gives an empty section; a malformed workstream observation makes it unavailable", () => {
  const ref = "work-orders:index--json";
  const record = (workstreams: unknown, cards: readonly unknown[] = []) =>
    JSON.stringify({
      schemaVersion: 1,
      index: { cards },
      history: { cards: [] },
      workstreams,
      releaseTags: [],
    });
  const project = (text: string) =>
    projectBoard({ workOrderIndex: available(ref, text) });
  assert.equal(section(project(record([])), "workstreams").status, "available");
  assert.equal(section(project(record([])), "workstreams").rows.length, 0);
  assert.equal(section(projectBoard({}), "workstreams").status, "unavailable");
  // A malformed observation fails only the workstreams section; the record's
  // cards stay readable.
  for (const workstreams of [
    [
      { id: "WS-001", members: [], edges: [] },
      { id: "WS-001", members: [], edges: [] },
    ],
    [{ id: "WS-001", members: [{}], edges: [] }],
  ]) {
    const board = project(record(workstreams));
    assert.equal(section(board, "workstreams").status, "unavailable");
    assert.equal(section(board, "work-order-index").status, "available");
    assert.equal(
      board.sources.find((source) => source.ref === ref)?.status,
      "unavailable",
    );
    assert.equal(
      board.sources.filter((source) => source.ref === ref).length,
      1,
    );
  }
  // Text that is not the record refuses, and so does a record whose
  // observation is not a list.
  assert.throws(() => parseWorkstreams("not a generated index"));
  assert.equal(
    section(project(record({ oops: true })), "workstreams").status,
    "unavailable",
  );
  const sources = loadFixture("workstreams");
  assert.ok(sources.workOrderIndex?.status === "available");
  const recorded = sources.workOrderIndex.value;
  const grouped = section(project(recorded), "workstreams");
  assert.ok(grouped.rows.length > 0);
  assert.ok(grouped.rows.every((row) => row.links.length === 1));
  // Without the index cards, the same members link to no card.
  const withoutCards = section(
    project(record(JSON.parse(recorded).workstreams)),
    "workstreams",
  );
  assert.equal(withoutCards.status, "available");
  assert.equal(withoutCards.rows.length, grouped.rows.length);
  assert.ok(withoutCards.rows.every((row) => row.links.length === 0));
});

test("WO-080 a view without the workstreams section validates and renders in text and HTML", () => {
  const view = projectBoard({});
  const prior: BoardView = {
    ...view,
    panels: view.panels.map((panel) => ({
      ...panel,
      sections: panel.sections.filter((entry) => entry.id !== "workstreams"),
    })),
  };
  assert.ok(schemaMatches(prior, schema, schema));
  assert.doesNotMatch(renderTerminal(prior), /Workstreams/u);
  assert.doesNotMatch(renderHtml(prior), /Workstreams/u);
});
