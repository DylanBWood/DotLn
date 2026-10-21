// VER-002 criterion 1 readback. Run from the repository root under the bounded
// wrapper:
//   node docs/evidence/WO-217/verification-002/register-readback.mjs
// Reads every row id the order lists, plus the four VER-001 follow-ups, through
// npm run plan -- followups --show, one process at a time, and prints each
// row's latest disposition against its latest source revision and the order's
// activation time from its control segment.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const order = readFileSync(
  "docs/work-orders/WO-217-boarded-follow-ups-the-gate.md",
  "utf8",
);
const listed = [
  ...new Set(
    order
      .slice(0, order.indexOf("**Acceptance criteria"))
      .split("\n")
      .filter((line) => /^- FUP-[0-9a-f]{16}/.test(line))
      .map((line) => line.slice(2, 22)),
  ),
];
const verification = [
  "FUP-cfa28abbf01b6260",
  "FUP-6ed81e30e71d5696",
  "FUP-1661b2a01d5960fc",
  "FUP-f5a8a6f689fc0aff",
];
const activation = readFileSync("docs/control/orders/WO-217.jsonl", "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line))
  .find((event) => event.type === "WorkOrderActivated").recordedAt;
const counts = {};
const problems = [];
for (const id of [...listed, ...verification]) {
  const run = spawnSync(
    "npm",
    ["run", "--silent", "plan", "--", "followups", "--show", id],
    {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  if (run.status !== 0) {
    problems.push(`${id}: exit ${run.status}`);
    continue;
  }
  const row = JSON.parse(run.stdout);
  const latest = row.dispositions.at(-1);
  const revision = row.revisions.length;
  const set = verification.includes(id) ? "verification" : "listed";
  const key = `${set}:${latest.status}`;
  counts[key] = (counts[key] ?? 0) + 1;
  const after = Date.parse(latest.at) >= Date.parse(activation);
  const atLatest = latest.sourceRevision === revision;
  if (
    !after ||
    !atLatest ||
    !["settled", "declined", "deferred"].includes(latest.status)
  )
    problems.push(
      `${id}: ${latest.status} at ${latest.at}, revision ${latest.sourceRevision}/${revision}`,
    );
  if (latest.status === "deferred")
    console.log(JSON.stringify({ id, reopenWhen: latest.reopenWhen }));
  if (latest.status === "declined" && !(latest.reopenWhen ?? "").trim())
    problems.push(`${id}: declined without reopenWhen`);
}
console.log(
  JSON.stringify({ activation, listed: listed.length, counts, problems }),
);
