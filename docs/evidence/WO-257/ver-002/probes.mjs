// VER-002 independent verifier probes for WO-257. Run from the repository
// root under the bounded wrapper:
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-257/ver-002/probes.mjs
// Every Git fixture and canned transport file is temporary and removed
// afterwards. The test named "R1 (WO-257-D044)" reproduces the follow-up
// recorded in WO-257-D044 and is expected to fail until that follow-up is
// taken; every other test passes.
import test, { after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import vm from "node:vm";

const root = process.cwd();
const load = (path) => import(pathToFileURL(join(root, path)));
const { createFixtureRoot, excludeFixtureOwnership, removeTemporaryPath } =
  await load("scripts/lib/temporary-roots.mjs");
const { runGit } = await load("scripts/lib/git.mjs");
const { runChangeReview, recordAgentReview, itemsTable } = await load(
  "scripts/lib/review-worker.mjs",
);
const { validateChangeReviewResult } = await load(
  "packages/skeleton/dist/src/change-review-protocol.js",
);
const { harnessPromptLine, operatorMessageClass, harnessWorkerWords } =
  await load("packages/compiler/dist/src/harness.js");
const { criticalNotes } = await load("scripts/release.mjs");
const scratch = fs.realpathSync(
  createFixtureRoot(join(tmpdir(), "dotln-wo257-ver002-")),
);
after(() => removeTemporaryPath(scratch, { recursive: true, force: true }));
const git = (repo, args) => runGit(repo, args, { maxBuffer: 16 * 1024 * 1024 });
const put = (repo, path, text) => {
  fs.mkdirSync(dirname(join(repo, path)), { recursive: true });
  fs.writeFileSync(join(repo, path), text);
};
// About 180,000 bytes: under the 200,000-byte per-document cap, so two or
// three of them pass the 400,000-character brief ceiling together.
const big = (id) =>
  `# ${id} — Fixture\n\n${`${id} ordinary planning document text. `.repeat(4500)}\n`;

function fixture(tag, orders = ["WO-902", "WO-903", "WO-904"]) {
  const repo = join(scratch, tag);
  fs.mkdirSync(repo);
  git(repo, ["init", "--quiet", "-b", "main"]);
  excludeFixtureOwnership(repo);
  for (const [key, value] of [
    ["user.name", "Fixture"],
    ["user.email", "fixture@example.invalid"],
    ["commit.gpgsign", "false"],
  ])
    git(repo, ["config", key, value]);
  put(repo, ".gitignore", "docs/control/local/\n.dotln-owner.json\n");
  put(repo, "README.md", "# Fixture\n");
  put(repo, "docs/work-orders/WO-901-fixture.md", "# WO-901 — Fixture\n");
  git(repo, ["add", "-A"]);
  git(repo, ["commit", "--quiet", "-m", "fixture base"]);
  git(repo, ["switch", "--quiet", "-c", `planning/2030-02-01-${tag}`]);
  for (const id of orders)
    put(repo, `docs/work-orders/${id}-fixture.md`, big(id));
  git(repo, ["add", "-A"]);
  git(repo, ["commit", "--quiet", "-m", "fixture changes"]);
  return repo;
}

const items = (header, rows) =>
  `Reviewed.\n\n## Items\n\n| ${header.join(" | ")} |\n| ${header.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n`;
const result = (report, findings = [], rechecks = []) => ({
  schemaVersion: 1,
  findings,
  rechecks,
  filesRead: ["docs/work-orders/WO-902-fixture.md"],
  report,
});
const finding = (id) => ({
  id,
  severity: "note",
  summary: "Fixture observation.",
  file: "docs/work-orders/WO-902-fixture.md",
  line: 1,
  basis: null,
});
const common = [
  "--kind",
  "criteria",
  "--host",
  "codex",
  "--subject",
  "planning",
];
const quiet = () => {
  const lines = [];
  return { lines, write: (text) => lines.push(text) };
};
let counter = 0;
const canned = (value) => {
  const file = join(scratch, `canned-${++counter}.json`);
  fs.writeFileSync(
    file,
    typeof value === "string" ? value : JSON.stringify(value),
  );
  return file;
};

// The synthetic launches must not be attributed to the live verifier: only
// this test process's environment is changed and restored.
async function withEnv(fixtures, run) {
  const keys = [
    "DOTLN_WORKER_FIXTURE",
    "CODEX_THREAD_ID",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
    "COPILOT_AGENT_SESSION_ID",
    "DOTLN_DRIVEN_WORKER",
  ];
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  for (const key of keys) delete process.env[key];
  if (fixtures) process.env.DOTLN_WORKER_FIXTURE = fixtures;
  try {
    return await run();
  } finally {
    for (const [key, value] of Object.entries(previous))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  }
}

test("P12-1: three batches, the 45/46-character id boundary, ids reused across batches, and a launched recheck naming every merged id", async () => {
  const repo = fixture("ids", [
    "WO-902",
    "WO-903",
    "WO-904",
    "WO-905",
    "WO-906",
  ]);
  const dry = await withEnv(null, () =>
    runChangeReview(repo, [...common, "--dry-run"], quiet()),
  );
  assert.ok(dry.batches.length >= 3, `batches ${dry.batches.length}`);
  const ids45 = "A".repeat(45);
  const ids46 = "B".repeat(46);
  const perBatch = [
    [ids46, "F1", ids45, "F2", "Z".repeat(64)],
    ["F1", "C".repeat(60), "F2"],
    ...dry.batches.slice(2).map(() => [ids46, "F9"]),
  ];
  const files = perBatch.map((list) =>
    canned(
      result(
        "Reviewed.",
        list.map((id) => finding(id)),
      ),
    ),
  );
  const run = await withEnv(files.join(","), () =>
    runChangeReview(repo, common, quiet()),
  );
  assert.ok(run.report, "merged report recorded");
  const record = JSON.parse(fs.readFileSync(join(repo, run.record), "utf8"));
  const ids = record.findings.map(({ id }) => id);
  console.log("P12-1 ids", JSON.stringify(ids));
  assert.equal(ids.length, perBatch.flat().length);
  assert.equal(new Set(ids).size, ids.length, "unique");
  assert.ok(ids.includes(`b1.${ids45}`), "a 45-character id keeps its name");
  assert.ok(!ids.includes(`b1.${ids46}`), "a 46-character id takes a fallback");
  for (const id of ids) {
    assert.match(id, /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u);
    assert.ok(`consistency.999.${id}`.length <= 64, id);
  }
  validateChangeReviewResult(
    {
      schemaVersion: 1,
      findings: record.findings,
      rechecks: record.rechecks,
      filesRead: record.filesRead,
      report: record.report,
    },
    { review: { priorFindingIds: [] } },
  );
  const rechecks = ids.map((id) => ({
    id: `criteria.1.${id}`,
    outcome: "held",
    note: "held",
  }));
  const recheckFiles = dry.batches.map(() =>
    canned(result("Rechecked.", [], rechecks)),
  );
  const second = await withEnv(recheckFiles.join(","), () =>
    runChangeReview(
      repo,
      [...common, "--round", "2", "--recheck", run.record],
      quiet(),
    ),
  );
  assert.ok(second.report, "recheck round recorded");
  const next = JSON.parse(fs.readFileSync(join(repo, second.record), "utf8"));
  assert.deepEqual(
    next.rechecks.map(({ id }) => id).sort(),
    rechecks.map(({ id }) => id).sort(),
  );
  assert.ok(next.rechecks.every(({ outcome }) => outcome === "held"));
});

test("P12-2: a round under the ceiling launches exactly one worker", async () => {
  const repo = fixture("single", ["WO-902"]);
  const dry = await withEnv(null, () =>
    runChangeReview(repo, [...common, "--dry-run"], quiet()),
  );
  assert.equal(dry.batches.length, 1);
  assert.ok(dry.measured.brief <= dry.measured.ceiling);
  // A second launch would take the `none` fixture and refuse the round.
  const out = quiet();
  const run = await withEnv(`${canned(result("Reviewed."))},none`, () =>
    runChangeReview(repo, common, out),
  );
  assert.ok(run.report, "one launch recorded the report");
  assert.equal(run.batches, undefined);
  const record = JSON.parse(fs.readFileSync(join(repo, run.record), "utf8"));
  assert.equal(record.batches, undefined);
  assert.match(
    out.lines.join(""),
    /^review: criteria round 1 found 0 \(0 blocking\); 0 h 0 min\n/u,
  );
});

test("P12-3: a missing middle batch records nothing and names the batch", async () => {
  const repo = fixture("missing", [
    "WO-902",
    "WO-903",
    "WO-904",
    "WO-905",
    "WO-906",
  ]);
  const dry = await withEnv(null, () =>
    runChangeReview(repo, [...common, "--dry-run"], quiet()),
  );
  assert.ok(dry.batches.length >= 3);
  const ok = canned(result("Reviewed."));
  const fixtures = [ok, "none", ...dry.batches.slice(2).map(() => ok)];
  const out = quiet();
  const run = await withEnv(fixtures.join(","), () =>
    runChangeReview(repo, common, out),
  );
  assert.equal(run.report, null);
  const text = out.lines.join("");
  console.log("P12-3", text.split("\n")[0]);
  assert.match(
    text,
    new RegExp(
      `^review: criteria round 1: batch 2 of ${dry.batches.length} returned no report`,
      "u",
    ),
  );
  const lane = join(
    repo,
    "docs/control/local/reviews/planning-2030-02-01-missing",
  );
  assert.ok(!fs.existsSync(join(lane, "round-1-criteria.md")));
  assert.ok(!fs.existsSync(join(lane, "round-1-criteria.json")));
});

test("P12-4: --since carries the documents changed since the tree, uncommitted and untracked ones included, and nothing unchanged", async () => {
  const repo = fixture("since", ["WO-902", "WO-903"]);
  const tree = git(repo, ["rev-parse", "HEAD^{tree}"]).trim();
  put(
    repo,
    "docs/work-orders/WO-903-fixture.md",
    `${big("WO-903")}\nOne more line.\n`,
  );
  put(repo, "docs/work-orders/WO-907-new.md", "# WO-907 — New\n\nUntracked.\n");
  const dry = await withEnv(null, () =>
    runChangeReview(repo, [...common, "--dry-run", "--since", tree], quiet()),
  );
  const documents = dry.measured.batches.flatMap((batch) => batch.documents);
  console.log("P12-4", JSON.stringify(documents));
  assert.deepEqual(documents, [
    "docs/work-orders/WO-903-fixture.md",
    "docs/work-orders/WO-907-new.md",
  ]);
});

// The JSON result followed by prose carrying the Items table, recorded with
// --format json (the record usage: "bind one result, including a result
// followed by prose").
const proseAfterJson = (tree, item, where) =>
  `Reviewed tree: ${tree}\n\n${JSON.stringify(
    result("See the Items table below.", [finding(`F${item}`)]),
  )}\n\n${items(
    ["Item", "Location in the subject", "Disposition"],
    [[item, where, "reviewed"]],
  )}`;

test("P12-6: a JSON result followed by prose carrying the Items table is recorded as a single unsplit report", async () => {
  const repo = fixture("prose-single", ["WO-902"]);
  const capture = join(scratch, "dispatch-single.md");
  fs.writeFileSync(capture, "planning: fixture\n\n1. First item\n");
  const args = [...common, "--capture", capture];
  const dry = await withEnv(null, () =>
    runChangeReview(repo, [...args, "--dry-run"], quiet()),
  );
  assert.equal(dry.batches.length, 1);
  const recorded = await withEnv(null, () =>
    recordAgentReview(
      repo,
      [
        ...args,
        "--from",
        canned(proseAfterJson(dry.reviewedTree, "1", "WO-902 criterion 1")),
        "--format",
        "json",
        "--tree",
        dry.reviewedTree,
      ],
      quiet(),
    ),
  );
  assert.ok(recorded.report);
  const record = JSON.parse(
    fs.readFileSync(join(repo, recorded.record), "utf8"),
  );
  assert.equal(record.findings.length, 1);
  assert.equal(itemsTable(record.report).refusal, null);
});

test("R1 (WO-257-D044): the same shape recorded part by part for a split round is merged", async () => {
  const repo = fixture("prose-items");
  const capture = join(scratch, "dispatch-prose.md");
  fs.writeFileSync(
    capture,
    "planning: fixture\n\n1. First item\n2. Second item\n",
  );
  const args = [...common, "--capture", capture];
  const dry = await withEnv(null, () =>
    runChangeReview(repo, [...args, "--dry-run"], quiet()),
  );
  assert.equal(dry.batches.length, 2);
  const parts = [
    proseAfterJson(dry.reviewedTree, "1", "WO-902 criterion 1"),
    proseAfterJson(dry.reviewedTree, "2", "WO-904 criterion 1"),
  ];
  let last = null;
  let refusal = null;
  try {
    for (const [at, text] of parts.entries())
      last = await withEnv(null, () =>
        recordAgentReview(
          repo,
          [
            ...args,
            "--from",
            canned(text),
            "--format",
            "json",
            "--batch",
            String(at + 1),
            "--tree",
            dry.reviewedTree,
            "--brief-sha256",
            dry.batches[at].briefSha256,
          ],
          quiet(),
        ),
      );
  } catch (error) {
    refusal = error.message;
  }
  const lane = join(
    repo,
    "docs/control/local/reviews/planning-2030-02-01-prose-items",
  );
  console.log(
    "R1",
    JSON.stringify({
      refusal,
      partsKept: [1, 2].filter((at) =>
        fs.existsSync(join(lane, `round-1-criteria.batch-${at}.json`)),
      ),
    }),
  );
  assert.equal(
    refusal,
    null,
    "every part was admitted, so the merge should be",
  );
  assert.ok(last?.report);
});

test("P11: the reader, the embedded Codex reader and the worker words agree on host shapes the fixtures do not use", () => {
  const emitted = fs.readFileSync(
    join(root, ".codex/hooks/continuation.mjs"),
    "utf8",
  );
  const start = emitted.indexOf("function harnessPromptLine(");
  const end = emitted.indexOf("\n}", start) + 2;
  assert.ok(start >= 0 && end > start);
  const embedded = vm.runInNewContext(`(${emitted.slice(start, end).trim()})`);
  const block =
    "<local-command-caveat>Caveat: the messages below were generated by the user while running local commands.</local-command-caveat>\n<command-name>/model</command-name>\n            <command-message>model</command-message>\n            <command-args></command-args>\n<local-command-stdout>Set model\nsecond line</local-command-stdout>\n";
  const cases = [
    [`${block}planning: standard planning pass + fable`, "planning:", "fable"],
    [
      `${block.replaceAll("\n", "\r\n")}resume: verify fable`,
      "resume:",
      "fable",
    ],
    [`${block}\n\n\nresume: next`, "resume:", null],
    [`${block}\`\`\`\nplanning: astra\n\`\`\``, "planning:", "astra"],
    [
      '\n\n<pasted_content id="e082">\nplanning: standard planning pass +\n</pasted_content>',
      "planning:",
      null,
    ],
    [
      '<local-command-stdout id="a">out</local-command-stdout>\nresume: fix',
      "resume:",
      null,
    ],
    [`${block}Please do this.\nplanning: fable`, null, null],
    [block, null, null],
  ];
  for (const [prompt, prefix, worker] of cases) {
    const line = harnessPromptLine(prompt);
    assert.deepEqual(JSON.parse(JSON.stringify(embedded(prompt))), line);
    assert.equal(operatorMessageClass(prompt).prefix, prefix, prompt);
    const words = harnessWorkerWords(prompt);
    if (worker === "fable") assert.equal(words?.claude, "fable", prompt);
    if (worker === "astra") assert.equal(words?.codex, "astra", prompt);
  }
  assert.equal(
    operatorMessageClass("<command-args/>\nresume: next").leadingElement,
    "command-args",
  );
});

test("P4: release notices name each generated page's regeneration and the new session, and nothing for an unrelated change", () => {
  const line = (files) => criticalNotes(files, []).slice(1);
  assert.match(
    line(["scripts/lib/feature-registry.mjs"])[0],
    /regenerate its page with npm run meta /u,
  );
  assert.match(
    line(["scripts/lib/criteria-status.mjs"])[0],
    /regenerate its page with npm run work-orders -- index /u,
  );
  assert.match(
    line(["scripts/work-orders.mjs", "scripts/meta.mjs"])[0],
    /npm run work-orders -- index and npm run meta /u,
  );
  for (const path of [
    "packages/compiler/src/harness.ts",
    ".claude/settings.json",
  ])
    assert.match(line([path])[0], /start a new session/u);
  assert.deepEqual(line(["scripts/lib/git.mjs", "docs/KIT.md"]), []);
});
