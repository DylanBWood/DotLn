import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const base = "docs/evidence/WO-138";
const records = readdirSync(`${base}/episodes`).map((path) =>
  read(`${base}/episodes/${path}`),
);
assert.equal(records.length, 38);
assert.equal(new Set(records.map((row) => row.episodeId)).size, 38);
const build = createHash("sha256")
  .update(readFileSync("scripts/probes/local-model-role-qualification.mjs"))
  .digest("hex");
for (const row of records) assert.equal(row.harnessBuildHash, build);
const ranking = read(`${base}/operator-ranking.json`).ranking;
const labels = read("scripts/fixtures/wo138-local-role-qualification.json").t3
  .rows;
const t1 = {
  verdict: "pass",
  criteriaMet: "6",
  criteriaTotal: "6",
  candidateFindings: "5",
  repairFindings: "0",
  advisoryObservations: "7",
  gatePassedSuites: "19",
  gateFailedSuites: "0",
  gateDurationSeconds: "515.40",
  newDependencies: "0",
};
const score = (row) => {
  if (!row.schemaValid || row.status !== "completed") return 0;
  const answer = row.answer.result;
  if (row.cell.taskId === "T1")
    return (
      Object.entries(t1).filter(([key, value]) => answer[key] === value)
        .length / 10
    );
  if (row.cell.taskId === "T2") {
    const squared = answer.ranking.reduce(
      (sum, id, index) => sum + (index - ranking.indexOf(id)) ** 2,
      0,
    );
    return 1 - (6 * squared) / (ranking.length * (ranking.length ** 2 - 1));
  }
  return (
    labels.filter(({ rowId, label }) =>
      answer.classifications.some(
        (item) => item.rowId === rowId && item.label === label,
      ),
    ).length / labels.length
  );
};
const median = (values) => {
  if (!values.length) return null;
  const sorted = values.toSorted((a, b) => a - b),
    mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
const rounded = (value, places = 6) =>
  value === null ? null : Number(value.toFixed(places));
const results = read(`${base}/results.json`);
for (const task of ["T1", "T2", "T3"])
  for (const transport of ["local", "codex"]) {
    const rows = records.filter(
      (row) =>
        row.cell.kind === "baseline" &&
        row.cell.taskId === task &&
        row.cell.transport === transport,
    );
    assert.equal(rows.length, 5);
    const actual =
      results.tasks[task][transport === "local" ? "local" : "remote"];
    const scores = rows
      .toSorted((a, b) => a.cell.repeat - b.cell.repeat)
      .map((row) => rounded(score(row)));
    assert.deepEqual(actual.oracleAgreement, scores);
    assert.equal(actual.medianOracleAgreement, rounded(median(scores)));
    assert.equal(
      actual.schemaValid,
      rows.filter((row) => row.schemaValid).length,
    );
    assert.equal(
      actual.medianLatencyMs,
      rounded(
        median(rows.map((row) => row.latencyMs).filter(Number.isFinite)),
        3,
      ),
    );
    assert.equal(
      actual.medianTokensPerSecond,
      rounded(
        median(rows.map((row) => row.tokensPerSecond).filter(Number.isFinite)),
        3,
      ),
    );
    assert.equal(
      actual.actualOperatorInterventions,
      rows.reduce((sum, row) => sum + row.actualOperatorInterventions, 0),
    );
  }
for (const record of records.filter((row) => row.cell.kind === "baseline")) {
  const peers = records.filter(
    (row) =>
      row.cell.kind === "baseline" && row.cell.taskId === record.cell.taskId,
  );
  for (const key of ["promptHash", "inputHash", "schemaHash", "cellBuildHash"])
    assert.ok(
      peers.every((row) => row[key] === record[key]),
      `${record.cell.taskId} ${key}`,
    );
}
console.log(
  JSON.stringify({
    episodes: records.length,
    build,
    independentDistributions: "pass",
    matchedBaselineProvenance: "pass",
    outcome: results.outcome,
    qualifyingTasks: results.qualifyingTasks,
  }),
);
