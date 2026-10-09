import assert from "node:assert/strict";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  mkdtempSync,
  cpSync,
  existsSync,
  realpathSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
const root = realpathSync(process.argv[2]);
const here = realpathSync(process.argv[3]);
const imp = (p) => import(pathToFileURL(join(root, p)).href);
const {
  readIndex,
  checkPartition,
  checkIndex,
  checkSequenceCoverage,
  parseHeader,
  renderIndex,
  renderHistory,
  readTagSnapshot,
} = await imp("scripts/work-orders.mjs");
const { gateCodeIdentity, gateTreeHash, findGateCheck } = await imp(
  "scripts/lib/gate-evidence.mjs",
);
const { installBeaconFixture } = await imp("scripts/test-beacon-fixture.mjs");
const { runtimeOrdersFromIndex } = await imp(
  "packages/skeleton/dist/src/runtime-status-contract.js",
);
const { parseWorkOrderIndex, INDEX_PAGE_TITLES } = await imp(
  "packages/console/dist/src/text-sources.js",
);
const { projectBoard } = await imp("packages/console/dist/src/index.js");
const { available } = await imp("packages/console/dist/src/values.js");
const result = {
  checks: [],
  subject: {
    head: execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    }).trim(),
    codeIdentity: gateCodeIdentity(root),
  },
};
const mark = (label, details = {}) => {
  result.checks.push({ label, ...details });
  console.log("PASS " + label + " " + JSON.stringify(details));
};
const gate = findGateCheck(root, "npm test", gateTreeHash(root));
assert.ok(gate);
assert.equal(gate.gateSelection, "review");
assert.equal(gate.codeIdentity, result.subject.codeIdentity);
result.productGate = Object.fromEntries(
  [
    "checkId",
    "codeIdentity",
    "treeHash",
    "recordedAt",
    "durationMs",
    "exitCode",
    "executed",
    "gateSelection",
    "freshSuites",
    "reusedSuites",
    "evidenceRef",
    "identityUnchanged",
    "buildOutputUnchanged",
  ].map((k) => [k, gate[k]]),
);
mark("covering executor review gate", result.productGate);
const page = readFileSync(join(root, "docs/work-orders/README.md"), "utf8"),
  history = readFileSync(join(root, "docs/work-orders/HISTORY.md"), "utf8");
const scan = (text) => {
  let section;
  return text.split("\n").flatMap((line) => {
    const h = /^## (.*)$/.exec(line);
    if (h) section = h[1];
    const c = /^### (WO-\d{3})$/.exec(line);
    return c ? [{ id: c[1], section }] : [];
  });
};
const front = scan(page),
  past = scan(history),
  index = readIndex(root);
const authorities = execFileSync(
  "git",
  [
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "--",
    "docs/work-orders",
  ],
  { cwd: root, encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter((p) => /\/WO-\d{3}-.*\.md$/.test(p))
  .map((p) => /\/(WO-\d{3})-/.exec(p)[1]);
assert.equal(new Set(authorities).size, authorities.length);
assert.deepEqual(
  [...front, ...past].map((c) => c.id).sort(),
  authorities.sort(),
);
assert.ok(front.every((c) => ["Active", "Open"].includes(c.section)));
assert.ok(
  past.every((c) =>
    ["Closed", "Withdrawn", "Superseded", "Historical"].includes(c.section),
  ),
);
const planned = [
  ...readFileSync(join(root, "docs/planning/sequence.md"), "utf8").matchAll(
    /^- (WO-\d{3}) — /gm,
  ),
].map((m) => m[1]);
assert.deepEqual(
  [...page.matchAll(/^- \[[ x]\] \[(WO-\d{3})\]/gm)].map((m) => m[1]),
  planned,
);
assert.deepEqual(
  front.filter((c) => c.section === "Open").map((c) => c.id),
  planned.filter(
    (id) => index.rows.find((r) => r.id === id).section === "Open",
  ),
);
assert.equal((page.match(/ · pair \d+/g) || []).length, 12);
assert.doesNotMatch(
  page,
  /dotln-work-order-tags|^## (Closed|Withdrawn|Superseded|Historical)$/m,
);
checkPartition(index, { README: page, HISTORY: history });
checkIndex(renderIndex(index), page);
checkIndex(renderHistory(index), history);
const base = execFileSync(
  "git",
  ["show", "e3b38663:docs/work-orders/README.md"],
  { cwd: root, maxBuffer: 16 * 1024 * 1024 },
);
mark("repository partition and order", {
  authorityCount: authorities.length,
  indexCards: front.length,
  historyCards: past.length,
  indexBytes: Buffer.byteLength(page),
  historyBytes: Buffer.byteLength(history),
  baseIndexBytes: base.length,
});
assert.deepEqual(
  runtimeOrdersFromIndex(page).items.map((r) => r.order),
  front.map((c) => c.id),
);
assert.throws(() => runtimeOrdersFromIndex(history));
assert.deepEqual(
  parseWorkOrderIndex(page).map((r) => r.key),
  front.map((c) => c.id),
);
assert.deepEqual(
  parseWorkOrderIndex(history, INDEX_PAGE_TITLES.history).map((r) => r.key),
  past.map((c) => c.id),
);
const emptyIndex = renderIndex({ rows: [], sequence: [], groups: [] }),
  emptyHistory = renderHistory({ rows: [], releases: [] });
assert.deepEqual(runtimeOrdersFromIndex(emptyIndex).items, []);
assert.deepEqual(parseWorkOrderIndex(emptyIndex), []);
assert.deepEqual(
  parseWorkOrderIndex(emptyHistory, INDEX_PAGE_TITLES.history),
  [],
);
assert.throws(
  () =>
    checkPartition(index, {
      README: page,
      HISTORY: history + "\n### WO-190\n",
    }),
  /WO-190/,
);
assert.throws(
  () =>
    readTagSnapshot(
      history.replace(
        /<!-- dotln-work-order-tags: .* -->/,
        "<!-- dotln-work-order-tags: [] -->\n<!-- dotln-work-order-tags: [] -->",
      ),
    ),
  /snapshot/,
);
mark("real runtime readers, empty pages and repeated records");
const header = (id, entries = [], label = "") =>
  `# ${id} — Verification fixture (version assigned at activation)\n\n**Model:** fixture-model.\n**Effort:** executor high; verifier high; reviewer any.\n${label ? label + "\n" : ""}\n<!-- dotln-dependencies:start -->\n${JSON.stringify(entries)}\n<!-- dotln-dependencies:end -->\n\n**Objective:** fixture.\n`;
const entries = [
  {
    workOrderId: "WO-908",
    relation: "superseded",
    by: "WO-906",
    reason: "fixture first",
  },
  {
    workOrderId: "WO-907",
    relation: "superseded",
    by: "WO-906",
    reason: "fixture repeated successor",
  },
];
for (const label of [
  "**Umbrella record:** prose falsely names WO-999",
  "**Umbrella record (2026-10-09):** prose falsely names WO-999",
])
  for (const newline of ["\n", "\r\n"]) {
    const s = header("WO-904", entries, label).replaceAll("\n", newline);
    assert.deepEqual(
      parseHeader(s, "docs/work-orders/WO-904-fixture.md").umbrella,
      { successors: ["WO-906"] },
    );
  }
assert.equal(
  parseHeader(
    header("WO-904", entries) + "\n**Umbrella record:** body-only label\n",
    "docs/work-orders/WO-904-fixture.md",
  ).umbrella,
  null,
);
assert.equal(
  parseHeader(
    header("WO-904", [], "**Umbrella record:** label only"),
    "docs/work-orders/WO-904-fixture.md",
  ).umbrella,
  null,
);
mark(
  "typed successors ignore prose, deduplicate, accept CRLF and dateless labels, exclude body label",
);
const fixture = realpathSync(mkdtempSync(join(here, "fixture-")));
mkdirSync(join(fixture, "scripts"));
mkdirSync(join(fixture, "docs/work-orders"), { recursive: true });
mkdirSync(join(fixture, "docs/planning"), { recursive: true });
cpSync(
  join(root, "scripts/work-orders.mjs"),
  join(fixture, "scripts/work-orders.mjs"),
);
cpSync(join(root, "scripts/resume.mjs"), join(fixture, "scripts/resume.mjs"));
cpSync(join(root, "scripts/lib"), join(fixture, "scripts/lib"), {
  recursive: true,
});
installBeaconFixture(fixture);
const init = spawnSync("git", ["init", "-q"], {
  cwd: fixture,
  encoding: "utf8",
});
assert.equal(init.status, 0, init.stderr);
assert.equal(
  execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: fixture,
    encoding: "utf8",
  }).trim(),
  fixture,
);
cpSync(join(root, ".gitignore"), join(fixture, ".gitignore"));
for (const id of ["WO-904", "WO-906", "WO-907", "WO-908"])
  writeFileSync(
    join(fixture, `docs/work-orders/${id}-fixture.md`),
    header(
      id,
      id === "WO-904" ? entries : [],
      id === "WO-904" ? "**Umbrella record:** wrong prose WO-999" : "",
    ),
  );
const seq =
  "# Sequence\n\n<!-- dotln-work-order-sequence:start -->\n- WO-908 — First\n- WO-906 — Second\n\n- WO-907 — Last\n<!-- dotln-work-order-sequence:end -->\n";
writeFileSync(join(fixture, "docs/planning/sequence.md"), seq);
const invoke = (script, args, cwd = fixture) => {
  const r = spawnSync(
    process.execPath,
    [join(fixture, "scripts", script), ...args],
    { cwd, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  return { exit: r.status, text: r.stdout + r.stderr };
};
assert.equal(invoke("work-orders.mjs", ["index"]).exit, 0);
assert.equal(invoke("work-orders.mjs", ["index", "--check"]).exit, 0);
let historyFile = join(fixture, "docs/work-orders/HISTORY.md"),
  indexFile = join(fixture, "docs/work-orders/README.md");
assert.match(
  readFileSync(historyFile, "utf8"),
  /^- \[WO-904\] — superseded by WO-906$/m,
);
const activation = invoke(
  "resume.mjs",
  ["activate", "WO-904", "docs/work-orders/WO-904-fixture.md"],
  here,
);
assert.equal(activation.exit, 1);
assert.match(
  activation.text,
  /activation refused: WO-904 is an umbrella record superseded by WO-906/,
);
assert.doesNotMatch(activation.text, /WO-999|at file:/);
assert.equal(
  existsSync(join(fixture, "docs/control/orders/WO-904.jsonl")),
  false,
);
mark("CLI activation from another cwd refuses typed umbrella without event", {
  output: activation.text.trim(),
});
for (const [file, pattern] of [
  [indexFile, /README\.md is stale/],
  [historyFile, /HISTORY\.md is stale/],
]) {
  const old = readFileSync(file, "utf8");
  writeFileSync(file, old + "\nforged tail\n");
  const r = invoke("work-orders.mjs", ["index", "--check"]);
  assert.equal(r.exit, 1);
  assert.match(r.text, pattern);
  assert.equal(readFileSync(file, "utf8"), old + "\nforged tail\n");
  writeFileSync(file, old);
}
writeFileSync(
  join(fixture, "docs/planning/sequence.md"),
  seq.replace("- WO-907 — Last\n", ""),
);
assert.equal(invoke("work-orders.mjs", ["index"]).exit, 0);
const absent = invoke("work-orders.mjs", ["index", "--check"]);
assert.equal(absent.exit, 1);
assert.match(absent.text, /absent from the proposed sequence: WO-907/);
mark("stale tail on either page, read-only refusal and missing open order", {
  coverage: absent.text.trim(),
});
const card =
  "## Open\n\n### WO-909\n\n[WO-909 — Fixture](WO-909-fixture.md)\n\n- State: draft.\n- Authority: [fixture](WO-909-fixture.md)\n";
const good = available(
  "fixture:index",
  "# Work orders\n\nThis file is generated by a fixture.\n\n" + card,
);
const bad = available(
  "fixture:history",
  "# Work-order history\n\nThis file is generated by a fixture.\n\n" + card,
);
const board = projectBoard({ workOrderIndex: good, workOrderHistory: bad });
const work = board.panels.find((p) => p.id === "work");
assert.equal(
  work.sections.find((s) => s.id === "work-order-index").rows.length,
  1,
);
assert.equal(
  work.sections.find((s) => s.id === "work-order-history").status,
  "unavailable",
);
mark("overlapping second source preserves available first source");
assert.equal(gateCodeIdentity(root), result.subject.codeIdentity);
result.finishedAt = new Date().toISOString();
writeFileSync(
  join(here, "probe-result.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log("PASS verification probes: " + result.checks.length);
