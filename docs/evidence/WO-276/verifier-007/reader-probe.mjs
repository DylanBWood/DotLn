import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
const [scratch, resultFile] = process.argv.slice(2);
assert.ok(
  scratch && resultFile,
  "Supply a session scratch directory and a result file.",
);
mkdirSync(scratch, { recursive: true });
for (const [name, ref] of [
  ["main", "0097fcac608bcaa24c51c8b6d6020fc2382ea141"],
  ["previous", "refs/dotln/checkpoint/WO-276/94"],
]) {
  const destination = join(scratch, name);
  mkdirSync(destination, { recursive: true });
  const archived = spawnSync(
    "git",
    [
      "archive",
      ref,
      "scripts",
      "packages/skeleton/src",
      "package.json",
      "dotln.config.json",
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  );
  assert.equal(archived.status, 0, String(archived.stderr));
  const extracted = spawnSync("tar", ["-x", "-C", destination], {
    input: archived.stdout,
  });
  assert.equal(extracted.status, 0, String(extracted.stderr));
}
const root = process.cwd();
const load = (base, file) => import(pathToFileURL(join(base, file)).href);
const file = "scripts/lib/handoff-ledger.mjs";
for (const [name, ref] of [
  ["main", "0097fcac608bcaa24c51c8b6d6020fc2382ea141"],
  ["previous", "refs/dotln/checkpoint/WO-276/94"],
]) {
  const shown = spawnSync("git", ["show", ref + ":" + file], {
    encoding: "utf8",
  });
  assert.equal(shown.status, 0);
  assert.equal(readFileSync(join(scratch, name, file), "utf8"), shown.stdout);
}
const old = await load(join(scratch, "main"), file);
const before = await load(join(scratch, "previous"), file);
const now = await load(root, file);
const { missionContract } = await load(
  root,
  "scripts/lib/mission-documents.mjs",
);
const { parsePlanOrder } = await load(root, "scripts/lib/plan-subject.mjs");
const { criteriaAdvisories } = await load(root, "scripts/work-orders.mjs");
const prefix =
  "# WO-999 — Reader verification fixture (v1.0.0)\n\n**Model:** any.\n\n**Effort:** executor high; verifier high; reviewer high.\n\n**Objective:** Verify the command.\n\n**Acceptance criteria (all required)**\n\n";
const suffix = "\n\n**Non-goals:** none.\n";
const safe = (fn) => {
  try {
    return { value: fn() };
  } catch (e) {
    return { code: e.code ?? e.cause?.code ?? null, message: e.message };
  }
};
const ids = (reader, input) =>
  safe(() => reader.declaredCriteria(input)?.map((c) => c.id) ?? []);
const cases = [];
const add = (name, body, tail = suffix) =>
  cases.push({ name, input: prefix + body + tail });
const breaks = [
  ["tag", "<option> and the result."],
  ["div", "<div> and the result."],
  ["comment", "<!-- and the result."],
  ["instruction", "<?instruction and the result."],
  ["declaration", "<!DOCTYPE sample>"],
  ["cdata", "<![CDATA["],
  ["script-tag", "<script>"],
  ["heading", "# Commands and the result."],
  ["heading-two", "## Commands"],
  ["heading-five", "##### Commands"],
  ["label", "**Check:** the fixture."],
  ["label-alone", "**Check:**"],
  ["bold-alone", "**Check**"],
  ["fence", "```json fence and nothing else."],
  ["tilde", "~~~ fence and nothing else."],
  ["quote", "> A note on the result."],
  ["bullet", "- A note on the result."],
  ["rule", "---"],
  ["setext", "==="],
  ["asterisks", "***"],
  ["ordinary", "and the result."],
  ["definition", "[note]: /guide"],
];
for (const [breakName, line] of breaks)
  for (const indent of [0, 1, 2, 3, 4])
    for (const [label, a, b] of [
      ["consecutive", 2, 3],
      ["gap", 3, 4],
      ["falling", 0, 2],
      ["repeat", 1, 2],
    ]) {
      add(
        `${breakName}/indent-${indent}/${label}`,
        `1. The command prints\n${" ".repeat(indent)}${line}\n${a}. \`npm run test:docs\` passes.\n${b}. \`npm test -- --review\` passes.`,
      );
    }
for (const [name, body, tail] of [
  [
    "gap-control",
    "1. One holds.\n3. `npm run test:docs` passes.\n4. `npm test -- --review` passes.",
  ],
  [
    "escaped-control",
    "1. The command prints\n  \\<option> and the result.\n3. `npm run test:docs` passes.\n4. `npm test -- --review` passes.",
  ],
  [
    "two-digit-label",
    "9. Nine holds.\n10. Ten holds.\n\n   **Check:** the fixture.\n12. `npm run test:docs` passes.\n13. `npm test -- --review` passes.",
  ],
  [
    "closed-fence",
    "1. The reply uses\n  ```json fence\n3. `npm run test:docs` passes.\n  ```\n4. `npm test -- --review` passes.",
  ],
  [
    "later-prose-ten",
    "1. One holds.\n2. Two holds.\n3. Three holds.",
    "\n\n**Non-goals:** the log keeps only the last\n10. Older entries are pruned by hand.\n",
  ],
  [
    "later-prose-year",
    "1. One holds.\n2. Two holds.",
    "\n\n**Non-goals:** none.\n\n## Background\n\nThe rule was set in\n2026. It has not changed.\n",
  ],
  [
    "later-comment",
    "1. One holds.\n2. Two holds.",
    "\n\n**Non-goals:** none.\n\n## Notes\n\n<!-- a note on\n5. a retired step -->\n",
  ],
  [
    "later-list-five",
    "1. One holds.\n2. Two holds.",
    "\n\n**Non-goals:** none.\n\n## Follow-ups\n\n5. Five.\n6. Six.\n",
  ],
  [
    "nested-fence-control",
    "1. One holds.\n\n   ```json\n   {}\n   ```\n\n3. Three holds.",
  ],
  [
    "margin-group-control",
    "1. One holds.\n2. Two holds.\n\n**Part B:**\n\n5. Five holds.\n6. Six holds.",
  ],
  ["empty-list", ""],
])
  add(name, body, tail);
const rows = cases.map((c) => ({
  ...c,
  main: ids(old, c.input),
  previous: ids(before, c.input),
  candidate: ids(now, c.input),
}));
const shorter = rows.filter(
  (r) =>
    r.main.value?.length &&
    r.candidate.value &&
    r.candidate.value.length < r.main.value.length,
);
const newRefusals = rows.filter((r) => r.previous.value && r.candidate.code);
const unknownErrors = rows.filter(
  (r) => r.candidate.code && r.candidate.code !== "DOTLN_ORDER_LIST_UNREAD",
);
assert.equal(unknownErrors.length, 0);
for (const name of [
  "tag/indent-2/gap",
  "heading/indent-2/gap",
  "two-digit-label",
  "closed-fence",
  "fence/indent-2/gap",
  "tilde/indent-2/gap",
]) {
  const r = rows.find((r) => r.name === name);
  assert.equal(r.candidate.code, "DOTLN_ORDER_LIST_UNREAD", name);
}
for (const name of [
  "gap-control",
  "escaped-control",
  "later-prose-ten",
  "later-prose-year",
  "later-comment",
  "later-list-five",
  "nested-fence-control",
  "margin-group-control",
]) {
  const r = rows.find((r) => r.name === name);
  assert.deepEqual(r.candidate.value, r.main.value, name);
}
const fixture = mkdtempSync(join(scratch, "lifecycle-"));
mkdirSync(join(fixture, "docs/work-orders"), { recursive: true });
mkdirSync(join(fixture, "docs/evidence/WO-999"), { recursive: true });
writeFileSync(join(fixture, "dotln.config.json"), '{"version":1}\n');
const state = {
  workOrderId: "WO-999",
  workOrderPath: "docs/work-orders/WO-999-fixture.md",
};
const ledgerPath = "docs/evidence/WO-999/handoff.md";
const consumers = [];
for (const name of [
  "tag/indent-2/gap",
  "heading/indent-2/gap",
  "two-digit-label",
  "closed-fence",
  "gap-control",
  "escaped-control",
]) {
  const r = rows.find((r) => r.name === name);
  writeFileSync(join(fixture, state.workOrderPath), r.input);
  const complete = name.endsWith("control");
  const judgments = complete ? r.candidate.value : ["1"];
  writeFileSync(
    join(fixture, ledgerPath),
    judgments.map((id) => `**Criterion ${id}:** met. Fixture.\n`).join("\n") +
      "\nself-review: found 0; fixed 0; recorded 0\n",
  );
  const out = {
    name,
    mainHandoff: safe(() => {
      const l = old.readHandoffLedger(fixture, state);
      return { met: l.met, claims: l.claims };
    }),
    handoff: safe(() => {
      const l = now.readHandoffLedger(fixture, state);
      return { met: l.met, claims: l.claims };
    }),
    report: safe(() => now.readReportGateClaims(fixture, state, ledgerPath)),
    mission: safe(() =>
      missionContract(r.input).criteria.map((c) => String(c.number)),
    ),
    index: safe(() => criteriaAdvisories("WO-999", r.input)),
    filing: safe(() =>
      parsePlanOrder(r.input, state.workOrderPath, "WO-999", {
        filing: true,
      }).criteria.map((c) => c.id),
    ),
  };
  if (!complete)
    for (const k of ["handoff", "report", "mission", "index", "filing"])
      assert.equal(out[k].code, "DOTLN_ORDER_LIST_UNREAD", name + ":" + k);
  else {
    assert.deepEqual(out.handoff.value.met, ["1", "3", "4"]);
    assert.deepEqual(out.handoff.value.claims.document, ["3"]);
    assert.deepEqual(out.handoff.value.claims.review, ["4"]);
    assert.deepEqual(out.mission.value, ["1", "3", "4"]);
  }
  consumers.push(out);
}
assert.equal(
  shorter.length,
  0,
  "No matrix case may silently omit a criterion main read.",
);
const output = {
  rows,
  consumers,
  summary: {
    cases: rows.length,
    refused: rows.filter((r) => r.candidate.code).length,
    shorter: shorter.map((r) => ({
      name: r.name,
      main: r.main.value,
      candidate: r.candidate.value,
    })),
    newRefusals: newRefusals.length,
    unknownErrors: unknownErrors.length,
  },
};
writeFileSync(resultFile, JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify(output.summary, null, 2));
