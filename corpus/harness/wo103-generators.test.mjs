import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  readFileSync,
  readdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as kernel from "../../packages/kernel/dist/src/index.js";
import {
  SEED,
  BASE,
  FACTORS,
  totalCells,
  defaultDimensions,
  inputFor,
  oracle,
  runCell,
  goldenIndices,
  dimensions,
} from "./wo103-authority-lib.mjs";
import {
  ROOT,
  BUDGET,
  checkBytes,
  runGenerator,
  buildPrecedenceTable,
} from "./generate-authority-corpus.mjs";
const manifest = JSON.parse(
  readFileSync(`${ROOT}/corpus/manifests/WO-103.json`, "utf8"),
);
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("WO-103 manifest fixture census, full expected schema, budgets and generated table hashes", () => {
  let rows = 0,
    bytes = 0;
  const census = [];
  for (const file of manifest.fixtures) {
    const content = readFileSync(`${ROOT}/${file.path}`, "utf8");
    assert.equal(sha(content), file.sha256);
    assert.equal(
      kernel.encodeLog(kernel.decodeLog(content)),
      content,
      "strict event-envelope framing round-trips every fixture byte",
    );
    assert.equal(Buffer.byteLength(content), file.bytes);
    const cells = content
      .trimEnd()
      .split("\n")
      .map((line, rowIndex) => {
        const frame = JSON.parse(line);
        assert.equal(frame.type, "CorpusFixture");
        assert.equal(frame.eventId, `evt_${rowIndex + 1}`);
        return frame.payload;
      });
    assert.equal(cells.length, file.rows);
    for (const cell of cells) {
      assert.ok(cell.cellId);
      assert.ok(cell.expected);
      assert.ok(cell.branchPath);
      if (cell.input) {
        assert.deepEqual(oracle(cell.input).result, cell.expected);
        assert.equal(runCell(kernel, cell.input).mismatch, false);
      } else {
        assert.deepEqual(
          kernel.replayOutbox(cell.events, { includeTraces: true }),
          cell.expected,
        );
        assert.deepEqual(kernel.replayOutbox(cell.events), cell.expected.state);
      }
    }
    rows += file.rows;
    bytes += file.bytes;
    census.push(file.path);
  }
  const actual = ["authority", "outbox"].flatMap((lane) =>
    readdirSync(`${ROOT}/corpus/fixtures/${lane}`)
      .filter((f) => f.endsWith(".jsonl"))
      .map((f) => `corpus/fixtures/${lane}/${f}`),
  );
  assert.deepEqual(new Set(census), new Set(actual));
  assert.deepEqual(manifest.fixtureTotals, {
    files: census.length,
    rows,
    bytes,
  });
  assert.ok(census.length <= BUDGET.maximumFiles);
  assert.ok(rows <= BUDGET.maximumRows);
  assert.ok(bytes <= BUDGET.maximumTotalBytes);
  for (const file of manifest.generatedSurfaces)
    assert.equal(sha(readFileSync(`${ROOT}/${file.path}`)), file.sha256);
  assert.equal(
    readFileSync(`${ROOT}/corpus/manifests/WO-103-precedence.md`, "utf8"),
    buildPrecedenceTable(manifest.authority.winners),
  );
});

test("WO-103 seeded golden selection and independent Cartesian enumeration self-tests", () => {
  assert.equal(goldenIndices().size, 512);
  assert.deepEqual(goldenIndices(), goldenIndices());
  assert.notDeepEqual(goldenIndices("test-only-other-seed"), goldenIndices());
  assert.deepEqual(
    [...dimensions({ a: [0, 1], b: ["x", "y"] })],
    [
      { a: 0, b: "x" },
      { a: 0, b: "y" },
      { a: 1, b: "x" },
      { a: 1, b: "y" },
    ],
  );
  assert.deepEqual(manifest.authority.factors, FACTORS);
  assert.equal(manifest.authority.expectedCells, totalCells());
  assert.equal(manifest.seed, SEED);
  assert.equal(manifest.pinnedBaseCommit, BASE);
  const golden = manifest.fixtures
    .filter((f) => f.path.includes("/authority/"))
    .flatMap((f) =>
      readFileSync(`${ROOT}/${f.path}`, "utf8")
        .trimEnd()
        .split("\n")
        .map((line) => JSON.parse(line).payload),
    );
  for (const [key, levels] of Object.entries(FACTORS))
    for (const value of levels)
      assert.ok(
        golden.some((c) => c.input.dimensions[key] === value),
        `${key}:${value}`,
      );
});

test("WO-103 regeneration rejects wrong seed, argument ambiguity and planted byte corruption", async () => {
  await assert.rejects(
    runGenerator(["--seed", "wrong", "--check"]),
    /unknown seed refused/,
  );
  await assert.rejects(
    runGenerator(["--seed", SEED, "--write", "--check"]),
    /usage/,
  );
  const temp = mkdtempSync(join(tmpdir(), "wo103-check-"));
  try {
    const file = join(temp, "planted.jsonl");
    writeFileSync(file, '{"expected":true}\n');
    checkBytes(file, '{"expected":true}\n');
    assert.throws(
      () => checkBytes(file, '{"expected":false}\n'),
      /regeneration drift/,
    );
    assert.throws(
      () => checkBytes(file, '{"expected":true}'),
      /regeneration drift/,
    );
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("WO-103 planted faulty winners, traces and decrement are detected by cell comparator", () => {
  const input = inputFor({ ...defaultDimensions(), resource: "one" });
  for (const alter of [
    (r) => ({ ...r, trace: { ...r.trace, envInputs: [] } }),
    (r) => ({ ...r, command: { ...r.command, commandId: "wrong" } }),
    (r) => ({
      ...r,
      authority: { ...r.authority, resourceLimits: { units: 1 } },
    }),
  ]) {
    const faulty = { authorize: (...args) => alter(kernel.authorize(...args)) };
    assert.equal(runCell(faulty, input).mismatch, true);
  }
  const refused = inputFor({
    ...defaultDimensions(),
    clock: "at",
    patterns: "deny-star",
  });
  const faulty = {
    authorize: (...args) => {
      const r = kernel.authorize(...args);
      return {
        ...r,
        refusal: {
          ...r.refusal,
          payload: { ...r.refusal.payload, reason: "effect denied" },
        },
      };
    },
  };
  assert.equal(runCell(faulty, refused).mismatch, true);
  assert.equal(
    runCell(
      {
        authorize: () => {
          throw new TypeError("planted");
        },
      },
      input,
    ).mismatch,
    true,
  );
});
