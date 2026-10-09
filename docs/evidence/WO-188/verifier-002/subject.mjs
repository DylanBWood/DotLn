import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const mod = (p) => import(pathToFileURL(join(root, p)));
const { runGit } = await mod("scripts/lib/git.mjs");
const { gateCodeIdentity } = await mod("scripts/lib/gate-evidence.mjs");
const { coveringGateCheck } = await mod("scripts/lib/gate-reuse.mjs");
const { suites, changedMachinery } = await mod("scripts/test-runner.mjs");
const { evidenceSources } = await mod("scripts/lib/evidence-sources.mjs");
const { FEEDBACK_SOURCE_PATHS } = await mod(
  "packages/skeleton/dist/src/feedback-audit.js",
);
const { evidenceSourceContent } = await mod(
  "packages/skeleton/src/evidence-editions.mjs",
);
const base = runGit(root, ["rev-parse", "HEAD"]);
const changed = runGit(root, ["diff", "--name-only", base])
  .split("\n")
  .filter(Boolean);
const registered = new Set(Object.values(evidenceSources(root)).flat());
const judgedChanged = changed.filter((p) => FEEDBACK_SOURCE_PATHS.includes(p));
for (const p of judgedChanged)
  assert.ok(
    evidenceSourceContent(p, readFileSync(join(root, p), "utf8")) ===
      evidenceSourceContent(
        p,
        runGit(root, ["show", `${base}:${p}`], { trim: false }),
      ),
    p + " judged behavior",
  );
const oldRoot = runGit(
  root,
  ["show", `${base}:.agents/skills/dotln-executor/SKILL.md`],
  { trim: false },
);
const newRoot = readFileSync(
  join(root, ".agents/skills/dotln-executor/SKILL.md"),
  "utf8",
);
assert.ok(Buffer.byteLength(newRoot) < Buffer.byteLength(oldRoot));
for (const role of [
  "executor",
  "verifier",
  "reviewer",
  "release-close",
  "planner",
  "refuter",
]) {
  const text = readFileSync(
    join(root, `.agents/skills/dotln-${role}/SKILL.md`),
    "utf8",
  );
  assert.equal(
    (text.match(/Goal Alignment: Before a material choice/g) ?? []).length,
    1,
    role,
  );
  assert.equal(
    text,
    readFileSync(join(root, `.claude/skills/dotln-${role}/SKILL.md`), "utf8"),
    role + " roots agree",
  );
}
const oldBudgets = JSON.parse(
  runGit(root, ["show", `${base}:docs/control/budgets.json`]),
);
const budgets = JSON.parse(
  readFileSync(join(root, "docs/control/budgets.json"), "utf8"),
);
assert.deepEqual(
  budgets.limits.coldStartBytes,
  oldBudgets.limits.coldStartBytes,
);
assert.deepEqual(budgets.acceptances, oldBudgets.acceptances);
const selected = [
  ...new Set([...suites.filter((r) => r.product), ...changedMachinery(root)]),
];
const required = [
  "format",
  "build",
  ...selected.map((r) => r.name).filter((n) => n !== "build" && n !== "format"),
];
const codeIdentity = gateCodeIdentity(root);
const coverage = await coveringGateCheck(
  root,
  "npm test",
  required,
  codeIdentity,
);
assert.ok(
  coverage.row,
  JSON.stringify({ missing: coverage.missing, displaced: coverage.displaced }),
);
const row = coverage.row;
const release = await mod("scripts/release.mjs");
const { relativeLinkFailures } = await mod("scripts/lib/github-body.mjs");
const rendered = release.regeneratedReleaseText(root, "v0.69.2");
const title = JSON.parse(
  readFileSync(
    join(root, "docs/evidence/WO-188/wo199-regeneration.json"),
    "utf8",
  ),
).title;
assert.equal(rendered.split(title).length - 1, 1);
assert.equal(relativeLinkFailures(rendered).length, 0);
const body = readFileSync(
  join(root, "docs/evidence/WO-188/wo199-pr-body.md"),
  "utf8",
);
assert.equal(
  (
    body
      .split("\n")
      .filter((l) => l.startsWith("|"))
      .join("\n")
      .match(/unavailable/g) ?? []
  ).length,
  0,
);
assert.equal(
  (
    body.match(
      /^\d+ unavailable observations omitted as blank cells or rows;/gm,
    ) ?? []
  ).length,
  1,
);
assert.equal(relativeLinkFailures(body).length, 0);
console.log(
  JSON.stringify(
    {
      base,
      codeIdentity,
      registeredChanged: changed.filter((p) => registered.has(p)),
      judgedCount: FEEDBACK_SOURCE_PATHS.length,
      judgedChanged,
      judgedBehaviorUnchanged: true,
      executorRootBefore: Buffer.byteLength(oldRoot),
      executorRootAfter: Buffer.byteLength(newRoot),
      ceilingsUnchanged: true,
      releaseTitleOccurrences: 1,
      regeneratedBodyProfile: "pass",
      coveringReviewRow: {
        checkId: row.checkId,
        codeIdentity: row.codeIdentity,
        treeHash: row.treeHash,
        recordedAt: row.recordedAt,
        durationMs: row.durationMs,
        exitCode: row.exitCode,
        executed: row.executed,
        evidenceRef: row.evidenceRef,
        selection: row.selection,
        mode: row.mode,
        freshTasks: row.freshSuites,
        reusedTasks: row.reusedSuites,
        requiredSuites: row.requiredSuites,
        taskCount: row.taskTimeline?.length,
        outputSha256: row.outputSha256,
      },
      coverageLocation: coverage.location,
      required,
      missing: coverage.missing,
    },
    null,
    2,
  ),
);
