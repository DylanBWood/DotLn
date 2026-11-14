// Final review of WO-276: does the criteria reader return every acceptance
// criterion of an order whose criteria list holds a wrapped line that opens
// with a placeholder spelled as an HTML block-level tag name?
//
// The first input is no fixture: it is this order as the planning pass filed
// it (`git show HEAD:<order>`), where a wrapped line of criterion 78 opens
// with the placeholder <option> (WO-276-D011 records the re-wrap the
// executor made after the operator reported the rendering). The second is a
// five-criterion order of the same shape, whose last two criteria claim the
// document gate and the review gate.
//
// Run from the repository root: node <this file> <base>
// where <base> holds HEAD's scripts (`git archive HEAD scripts
// packages/skeleton/src package.json`, with node_modules beside them).
// Adapted from the review worker's probe of the same claim.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const base = resolve(process.argv[2]);
const load = (from) =>
  import(pathToFileURL(join(from, "scripts/lib/handoff-ledger.mjs")).href);
const readers = {
  base: await load(base),
  candidate: await load(process.cwd()),
};
const ORDER = "docs/work-orders/WO-276-the-queue-lands-as-one-order.md";
const filed = execFileSync("git", ["show", `HEAD:${ORDER}`], {
  encoding: "utf8",
  maxBuffer: 1 << 26,
});
const amended = readFileSync(ORDER, "utf8");
const fixture = (placeholder) => `# WO-900 — Fixture (v9.9.9)

**Model:** any.

**Effort:** executor high; verifier high; reviewer high.

**Objective:** fixture.

**Acceptance criteria (all required)**

1. The first criterion holds.
2. The command prints the chosen value as
${placeholder} and nothing else.
3. The third criterion holds.
4. \`npm run test:docs\` passes.
5. \`npm test -- --review\` passes.

**Non-goals:** none.
`;
const ids = (reader, text) =>
  (reader.declaredCriteria(text) ?? []).map((criterion) => criterion.id);
const count = (text) =>
  Object.fromEntries(
    Object.entries(readers).map(([name, reader]) => {
      const read = ids(reader, text);
      return [name, { criteria: read.length, last: read.at(-1) ?? null }];
    }),
  );
// The gates the closeout selection takes from the declared texts, read by
// the candidate's own function over each reader's list.
const claims = (text) =>
  Object.fromEntries(
    Object.entries(readers).map(([name, reader]) => [
      name,
      readers.candidate.criterionGateClaims(
        reader.declaredCriteria(text) ?? [],
        ["1", "2", "3", "4", "5"],
        {},
      ),
    ]),
  );
const line = filed.split("\n").findIndex((text) => /^\s*<option>/u.test(text));
// The candidate's other reader of the same list: the planning subject's,
// which reads on through the raw block so that a filed receipt still matches.
const { parsePlanOrder } = await import(
  pathToFileURL(join(process.cwd(), "scripts/lib/plan-subject.mjs")).href
);
const planned = parsePlanOrder(filed, ORDER, "WO-276").criteria.length;
console.log(
  JSON.stringify(
    {
      thisOrderAsFiled: {
        lineThatOpensWithThePlaceholder: line + 1,
        ...count(filed),
        candidatePlanningSubjectReader: { criteria: planned },
      },
      thisOrderAsAmended: count(amended),
      fixture: Object.fromEntries(
        [
          "<option>",
          "<title>",
          "<summary>",
          "<details>",
          "<path>",
          "`<option>`",
        ].map((placeholder) => [
          placeholder,
          {
            ids: Object.fromEntries(
              Object.entries(readers).map(([name, reader]) => [
                name,
                ids(reader, fixture(placeholder)),
              ]),
            ),
            gateClaims: claims(fixture(placeholder)),
          },
        ]),
      ),
    },
    null,
    2,
  ),
);
