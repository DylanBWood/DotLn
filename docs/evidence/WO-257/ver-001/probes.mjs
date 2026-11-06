// Independent verifier probes. Run from the repository root under the
// bounded wrapper. All Git fixtures and fake transport files are temporary.
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
const { runChangeReview, itemsTable } = await load(
  "scripts/lib/review-worker.mjs",
);
const { criteriaJudgments } = await load("scripts/lib/criteria-status.mjs");
const { harnessPromptLine, operatorMessageClass } = await load(
  "packages/compiler/dist/src/harness.js",
);
const { validateChangeReviewResult } = await load(
  "packages/skeleton/dist/src/change-review-protocol.js",
);
const { criticalNotes } = await load("scripts/release.mjs");
const scratch = fs.realpathSync(
  createFixtureRoot(join(tmpdir(), "dotln-wo257-verifier-")),
);
after(() => removeTemporaryPath(scratch, { recursive: true, force: true }));
const git = (repo, args) => runGit(repo, args, { maxBuffer: 4 * 1024 * 1024 });
const put = (repo, path, text) => {
  fs.mkdirSync(dirname(join(repo, path)), { recursive: true });
  fs.writeFileSync(join(repo, path), text);
};

function fixture(tag) {
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
  git(repo, ["switch", "--quiet", "-c", `planning/2030-01-01-${tag}`]);
  for (const id of ["WO-902", "WO-903", "WO-904"])
    put(
      repo,
      `docs/work-orders/${id}-fixture.md`,
      `# ${id} — Fixture\n\n${"Ordinary planning document text. ".repeat(5000)}\n`,
    );
  git(repo, ["add", "-A"]);
  git(repo, ["commit", "--quiet", "-m", "fixture changes"]);
  return repo;
}

const table = (headers, row) =>
  `## Items\n\n| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n| ${row.join(" | ")} |\n`;
const result = (report, findings = []) => ({
  schemaVersion: 1,
  findings,
  rechecks: [],
  filesRead: [],
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
const quiet = { write: () => {} };

async function runFake(repo, args, returns) {
  // These synthetic fixtures must not attribute their fake launches to the
  // live verifier. Only this test process's environment is changed/restored.
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
  const files = returns.map((value, index) => {
    const file = join(scratch, `result-${index}.json`);
    fs.writeFileSync(file, JSON.stringify(value));
    return file;
  });
  process.env.DOTLN_WORKER_FIXTURE = files.join(",");
  try {
    return await runChangeReview(repo, args, quiet);
  } finally {
    for (const [key, value] of Object.entries(previous))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  }
}

test("F1: independently valid Items header synonyms survive the batch merge", async () => {
  const repo = fixture("headers");
  const capture = join(scratch, "dispatch.md");
  fs.writeFileSync(
    capture,
    "planning: fixture\n\n1. First item\n2. Second item\n",
  );
  const args = [...common, "--capture", capture];
  const dry = await runChangeReview(repo, [...args, "--dry-run"], quiet);
  assert.equal(dry.batches.length, 2);
  const first = result(
    table(
      ["Item", "Location in the subject", "Disposition"],
      ["1", "WO-902 criterion 1", "reviewed"],
    ),
  );
  const second = result(
    table(["Item", "Where", "Status"], ["2", "WO-904 criterion 1", "reviewed"]),
  );
  assert.equal(itemsTable(first.report).refusal, null);
  assert.equal(itemsTable(second.report).refusal, null);
  const merged = await runFake(repo, args, [first, second]);
  console.log(
    "F1",
    JSON.stringify({
      batches: dry.batches.length,
      report: merged.report,
      failure: merged.failure,
    }),
  );
  assert.ok(
    merged.report,
    "Every individually valid batch must survive the merge",
  );
});

test("F2: the merge preserves distinct valid finding IDs and a usable recheck", async () => {
  const repo = fixture("finding-ids");
  const first = result("Reviewed fixture documents.", [
    finding("L".repeat(52)),
    finding("F1"),
  ]);
  validateChangeReviewResult(first, { review: { priorFindingIds: [] } });
  const merged = await runFake(repo, common, [
    first,
    result("Reviewed the remaining fixture documents."),
  ]);
  assert.ok(merged.report);
  const record = JSON.parse(fs.readFileSync(join(repo, merged.record), "utf8"));
  const ids = record.findings.map((entry) => entry.id);
  let validation = "accepted";
  try {
    validateChangeReviewResult(result(record.report, record.findings), {
      review: { priorFindingIds: [] },
    });
  } catch (error) {
    validation = error.message;
  }
  let recheck = "accepted";
  try {
    await runChangeReview(
      repo,
      [...common, "--round", "2", "--recheck", merged.record, "--dry-run"],
      quiet,
    );
  } catch (error) {
    recheck = error.message;
  }
  console.log("F2", JSON.stringify({ ids, validation, recheck }));
  assert.equal(
    new Set(ids).size,
    ids.length,
    "The merger must not collapse distinct valid identifiers",
  );
  assert.equal(validation, "accepted");
  assert.equal(recheck, "accepted");
});

test("F3 observation: admitted captures can fill the shared preamble beyond the ceiling", async () => {
  const repo = fixture("captures");
  const captures = [1, 2].map((index) => {
    const file = join(scratch, `capture-${index}.md`);
    fs.writeFileSync(file, `planning: fixture ${index}\n${"a".repeat(198960)}`);
    assert.ok(fs.statSync(file).size < 200000);
    return file;
  });
  await assert.rejects(
    runChangeReview(
      repo,
      [
        ...common,
        ...captures.flatMap((file) => ["--capture", file]),
        "--dry-run",
      ],
      quiet,
    ),
    (error) => {
      console.log("F3", error.message);
      return /preamble, captures and document index alone.*ceiling.*shorten the captures/u.test(
        error.message,
      );
    },
  );
});

test("prompt reader: host blocks, CRLF, paste wrappers and quoted prose agree", () => {
  const emitted = fs.readFileSync(
    join(root, ".codex/hooks/continuation.mjs"),
    "utf8",
  );
  const start = emitted.indexOf("function harnessPromptLine(");
  const end = emitted.indexOf("\n}", start) + 2;
  assert.ok(start >= 0 && end > start);
  const embedded = vm.runInNewContext(`(${emitted.slice(start, end).trim()})`);
  const block =
    "<local-command-caveat>Host information\nmore</local-command-caveat>\n<command-name>/model</command-name>\n<command-message>model</command-message>\n<command-args></command-args>\n<local-command-stdout>Model selected</local-command-stdout>\n";
  const cases = [
    `${block}planning: standard planning pass +`,
    `${block.replaceAll("\n", "\r\n")}planning: standard planning pass +`,
    "<pasted_content>\nplanning: standard planning pass +\n</pasted_content>",
    `${block}\`\`\`text\nplanning: fable\n\`\`\``,
    "An example follows:\nplanning: fable",
    "<task-notification>\nplanning: fable",
    "<command-message>unfinished\nplanning: fable",
  ];
  for (const prompt of cases)
    assert.deepEqual(
      JSON.parse(JSON.stringify(embedded(prompt))),
      harnessPromptLine(prompt),
    );
  assert.equal(operatorMessageClass(cases[0]).prefix, "planning:");
  assert.equal(operatorMessageClass(cases[4]).prefix, null);
  assert.equal(
    operatorMessageClass(cases[5]).leadingElement,
    "task-notification",
  );
  assert.equal(
    operatorMessageClass(cases[6]).leadingElement,
    "command-message",
  );
});

test("criterion history retains separate executor ordinals and later judgments", () => {
  const state = {
    phase: "closed",
    latestVerdict: "pass",
    latestVerificationId: "VER-002",
    unmetCriteria: [
      { criterionId: "1", ordinal: 4 },
      { criterionId: "2", ordinal: 7 },
      { criterionId: "3", ordinal: 7 },
    ],
    waivedCriteria: [{ criterionId: "2", ordinal: 8 }],
    defectiveCriteria: [{ criterionId: "3", ordinal: 9, class: "bookkeeping" }],
  };
  assert.deepEqual(
    criteriaJudgments(state).map((row) => [
      row.criterionId,
      row.ordinal,
      row.judgment,
      row.current,
    ]),
    [
      ["1", 4, "met by VER-002", false],
      ["2", 7, "unmet, waived by ordinal 8", false],
      ["3", 7, "defective (bookkeeping) by ordinal 9", false],
    ],
  );
  assert.equal(
    criteriaJudgments({
      ...state,
      phase: "verifying",
      latestVerdict: "fail",
    })[0].current,
    true,
  );
});

test("release notices combine a shared renderer and omit helper-only noise", () => {
  const notes = criticalNotes(["scripts/lib/duration.mjs"], []);
  assert.equal(
    notes.filter((line) =>
      line.startsWith("A generated page's renderer changed"),
    ).length,
    1,
  );
  assert.ok(
    notes.some(
      (line) =>
        line.includes("npm run work-orders -- index") &&
        line.includes("npm run meta"),
    ),
  );
  assert.equal(criticalNotes(["scripts/lib/git.mjs"], []).length, 1);
});
