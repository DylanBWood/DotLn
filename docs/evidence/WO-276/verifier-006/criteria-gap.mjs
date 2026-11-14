import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
const [baseRoot, output] = process.argv.slice(2);
const root = process.cwd();
const load = (directory, file) =>
  import(pathToFileURL(join(directory, file)).href);
const file = "scripts/lib/handoff-ledger.mjs";
const main = spawnSync("git", ["show", "main:" + file], { encoding: "utf8" });
assert.equal(main.status, 0);
assert.equal(
  readFileSync(join(baseRoot, file), "utf8"),
  main.stdout,
  "comparison module must be main",
);
const mainCommit = spawnSync("git", ["rev-parse", "main"], {
  encoding: "utf8",
}).stdout.trim();
const old = await load(baseRoot, file);
const now = await load(root, file);
const { missionContract } = await load(
  root,
  "scripts/lib/mission-documents.mjs",
);
const { parsePlanOrder } = await load(root, "scripts/lib/plan-subject.mjs");
const { criteriaAdvisories } = await load(root, "scripts/work-orders.mjs");
const prefix =
  "# WO-999 — Verification fixture (v1.0.0)\n\n**Model:** any.\n\n**Effort:** executor high; verifier high; reviewer high.\n\n**Objective:** Verify the command.\n\n**Acceptance criteria (all required)**\n\n";
const suffix = "\n\n**Non-goals:** none.\n";
const safe = (fn) => {
  try {
    return { value: fn() };
  } catch (error) {
    return {
      code: error.code ?? error.cause?.code ?? null,
      message: error.message,
    };
  }
};
const rows = [];
for (const [name, body] of [
  [
    "gap-control",
    "1. The command runs.\n3. `npm run test:docs` passes.\n4. `npm test -- --review` passes.",
  ],
  [
    "html-gap",
    "1. The command prints\n  <option> and the result.\n3. `npm run test:docs` passes.\n4. `npm test -- --review` passes.",
  ],
  [
    "heading-gap",
    "1. The command prints\n  # Commands and the result.\n3. `npm run test:docs` passes.\n4. `npm test -- --review` passes.",
  ],
  [
    "label-gap",
    "9. Nine holds.\n10. Ten holds.\n\n   **Check:** the fixture.\n12. `npm run test:docs` passes.\n13. `npm test -- --review` passes.",
  ],
  [
    "html-consecutive-control",
    "1. The command prints\n  <option> and the result.\n2. `npm run test:docs` passes.\n3. `npm test -- --review` passes.",
  ],
  [
    "html-escaped-control",
    "1. The command prints\n  \\<option> and the result.\n3. `npm run test:docs` passes.\n4. `npm test -- --review` passes.",
  ],
]) {
  const input = prefix + body + suffix;
  rows.push({
    name,
    input,
    main: safe(() => old.declaredCriteria(input)?.map((row) => row.id)),
    candidate: safe(() => now.declaredCriteria(input)?.map((row) => row.id)),
    mission: safe(() =>
      missionContract(input).criteria.map((row) => String(row.number)),
    ),
    filing: safe(() =>
      parsePlanOrder(
        input,
        "docs/work-orders/WO-999-verification-fixture.md",
        "WO-999",
        { filing: true },
      ).criteria.map((row) => row.id),
    ),
    advisories: safe(() => criteriaAdvisories("WO-999", input)),
  });
}
assert.deepEqual(rows[0].candidate.value, ["1", "3", "4"]);
assert.deepEqual(rows[1].main.value, ["1", "3", "4"]);
assert.deepEqual(rows[1].candidate.value, ["1"]);
assert.deepEqual(rows[1].mission.value, ["1"]);
assert.deepEqual(rows[1].filing.value, ["criterion:1"]);
assert.equal(rows[4].candidate.code, "DOTLN_ORDER_LIST_UNREAD");
assert.deepEqual(rows[5].candidate.value, ["1", "3", "4"]);
assert.equal(rows[4].advisories.code, "DOTLN_ORDER_LIST_UNREAD");
const fixture = mkdtempSync(
  join(dirname(resolve(output)), "criteria-lifecycle-"),
);
mkdirSync(join(fixture, "docs/work-orders"), { recursive: true });
mkdirSync(join(fixture, "docs/evidence/WO-999"), { recursive: true });
writeFileSync(join(fixture, "dotln.config.json"), '{"version":1}\n');
const state = {
  workOrderId: "WO-999",
  workOrderPath: "docs/work-orders/WO-999-verification-fixture.md",
};
const ledgerFile = join(fixture, "docs/evidence/WO-999/handoff.md");
const readLedger = (reader) =>
  safe(() => {
    const r = reader.readHandoffLedger(fixture, state);
    return {
      checked: r.checked,
      declared: r.declared.map((x) => x.id),
      met: r.met,
      claims: r.claims,
    };
  });
writeFileSync(join(fixture, state.workOrderPath), rows[0].input);
writeFileSync(
  ledgerFile,
  "**Criterion 1:** met. Fixture.\n\n**Criterion 3:** met. Fixture.\n\n**Criterion 4:** met. Fixture.\n\nself-review: found 0; fixed 0; recorded 0\n",
);
const completeGapControl = {
  main: readLedger(old),
  candidate: readLedger(now),
};
assert.deepEqual(completeGapControl.main.value.met, ["1", "3", "4"]);
assert.deepEqual(completeGapControl.candidate.value.met, ["1", "3", "4"]);
writeFileSync(join(fixture, state.workOrderPath), rows[1].input);
writeFileSync(
  ledgerFile,
  "**Criterion 1:** met. Fixture.\n\nself-review: found 0; fixed 0; recorded 0\n",
);
const shortLedger = { main: readLedger(old), candidate: readLedger(now) };
assert.match(shortLedger.main.message, /no line judges criteria 3, 4/u);
assert.deepEqual(shortLedger.candidate.value.met, ["1"]);
assert.deepEqual(shortLedger.candidate.value.claims, {
  document: [],
  review: [],
  plain: [],
});
const result = {
  mainCommit,
  completeGapControl,
  shortLedger,
  rule: "declaredCriteria explicitly preserves identifiers when an author skips a number; a shortened criterion list must refuse rather than silently omit obligations",
  rows,
};
writeFileSync(resolve(output), JSON.stringify(result, null, 2) + "\n");
console.log(
  JSON.stringify(
    { mainCommit, rows: rows.map(({ input, ...row }) => row) },
    null,
    2,
  ),
);
