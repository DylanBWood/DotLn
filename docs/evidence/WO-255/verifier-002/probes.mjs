// Independent VER-002 checks. Every record gets an isolated synthetic repo.
// No live model is launched; the helper route uses its fixture transport.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { createFixtureRoot, excludeFixtureOwnership, removeTemporaryPath } =
  await import(root + "/scripts/lib/temporary-roots.mjs");
const {
  recordAgentReview,
  runChangeReview,
  reviewsLane,
  itemsTable,
  tracedConsumersRefusal,
} = await import(root + "/scripts/lib/review-worker.mjs");
const { workingTree } = await import(root + "/scripts/lib/checkpoint.mjs");
const parent = realpathSync(createFixtureRoot(join(tmpdir(), "wo255-ver002-")));
const observations = [];
const quiet = { write: () => {} };
const tick = String.fromCharCode(96);
const fenced = (value) =>
  tick.repeat(3) + "json\n" + JSON.stringify(value) + "\n" + tick.repeat(3);
const table = [
  "## Traced consumers",
  "",
  "| Changed contract | Consumer | Command | Result |",
  "| --- | --- | --- | --- |",
  "| generated pages | docs/guide.md | read docs/guide.md | current |",
  "| fixture manifests | fixture.json | read fixture.json | none |",
  "",
].join("\n");
const git = (repo, ...args) =>
  execFileSync("git", args, {
    cwd: repo,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const write = (repo, name, text) => {
  mkdirSync(dirname(join(repo, name)), { recursive: true });
  writeFileSync(join(repo, name), text);
};
const commit = (repo) => {
  git(repo, "add", "-A");
  git(
    repo,
    "-c",
    "core.hooksPath=/dev/null",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "--quiet",
    "-m",
    "Synthetic verification fixture",
  );
};
let serial = 0;
const fixture = (branch = "wo-901") => {
  const repo = join(parent, "case-" + ++serial);
  mkdirSync(repo);
  git(repo, "init", "--quiet", "-b", "main");
  excludeFixtureOwnership(repo);
  git(repo, "config", "user.name", "Verification fixture");
  git(repo, "config", "user.email", "fixture@example.invalid");
  write(repo, ".gitignore", "docs/control/local/\n.dotln-owner.json\n");
  write(repo, "README.md", "# Synthetic base\n");
  write(
    repo,
    "docs/work-orders/WO-901-fixture.md",
    "# WO-901 — Fixture\n\n**Acceptance criteria (all required)**\n\n1. Read the fixture.\n",
  );
  commit(repo);
  git(repo, "switch", "--quiet", "-c", branch);
  write(repo, "docs/planning/pass.md", "# Synthetic planning change\n");
  commit(repo);
  return repo;
};
const cleanError = (error) =>
  error.message.replaceAll(parent, "<fixture>").replaceAll(root, "<worktree>");
const check = (name, passed, details = {}) =>
  observations.push({ name, passed, ...details });
const fromFile = (text) => {
  const name = join(parent, "return-" + ++serial + ".txt");
  writeFileSync(name, text);
  return name;
};
const recordCase = async (
  name,
  text,
  {
    structured = false,
    refusal = false,
    recorder = recordAgentReview,
    expectedFindings,
  } = {},
) => {
  const repo = fixture();
  let printed = "";
  try {
    const saved = await recorder(
      repo,
      ["--kind", "consistency", "--from", fromFile(text)],
      { write: (line) => (printed += line) },
    );
    const record = JSON.parse(readFileSync(join(repo, saved.record), "utf8"));
    check(
      name,
      !refusal &&
        record.structured === structured &&
        (!expectedFindings ||
          JSON.stringify(record.findings.map((finding) => finding.id)) ===
            JSON.stringify(expectedFindings)) &&
        (structured ||
          (record.report === text.trim() && record.findings.length === 0)),
      {
        expected: refusal
          ? "refused"
          : structured
            ? "structured result"
            : "whole prose preserved; no adopted example findings",
        accepted: true,
        structured: record.structured,
        findings: record.findings.map((finding) => finding.id),
        wholeProsePreserved: record.report === text.trim(),
        printed: printed.trim(),
      },
    );
  } catch (error) {
    check(name, refusal, {
      expected: refusal ? "refused" : "accepted",
      accepted: false,
      error: cleanError(error),
    });
  }
};

for (const key of [
  "CODEX_THREAD_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_SESSION_ID",
  "COPILOT_AGENT_SESSION_ID",
  "DOTLN_DRIVEN_WORKER",
  "DOTLN_WORKER_FIXTURE_TOUCH",
])
  delete process.env[key];
try {
  for (const [name, value] of [
    ["plain JSON", { value: 2 }],
    ["VER-001 schemaVersion example", { schemaVersion: 1, value: 2 }],
    ["VER-001 findings example", { findings: [], total: 0 }],
  ])
    await recordCase(
      name,
      "The payload example is:\n\n" +
        fenced(value) +
        "\n\nThe consumer handles it.\n\n" +
        table,
    );

  const example = {
    schemaVersion: 1,
    findings: [],
    rechecks: [],
    filesRead: [],
    report: "sample report",
  };
  const sampleFinding = {
    id: "F1",
    severity: "note",
    summary: "Synthetic sample finding, not this review's finding.",
    file: "docs/guide.md",
    line: 1,
    basis: null,
  };
  await recordCase(
    "valid example in middle",
    "The following JSON is an example:\n\n" +
      fenced({ ...example, findings: [sampleFinding] }) +
      "\n\nThis review found no issues.\n\n" +
      table,
  );
  await recordCase(
    "valid example at end",
    "# Consistency review\n\nThis review found no issues.\n\n" +
      table +
      "\nThe following JSON is only a documented example of a review record:\n\n" +
      fenced({ ...example, findings: [sampleFinding] }) +
      "\n",
  );
  await recordCase(
    "single-line code span",
    "An example is " +
      tick +
      '{"schemaVersion":1,"findings":[]}' +
      tick +
      ".\n\n" +
      table,
  );
  await recordCase(
    "multiline code span",
    "An example is " +
      tick +
      "\n" +
      '{"schemaVersion":1,"findings":[]}' +
      "\n" +
      tick +
      ".\n\n" +
      table,
  );
  await recordCase(
    "multiline double-backtick code span",
    "An example is " +
      tick.repeat(2) +
      "\n" +
      '{"schemaVersion":1,"findings":[]}' +
      "\n" +
      tick.repeat(2) +
      ".\n\n" +
      table,
  );
  await recordCase(
    "whole valid result",
    JSON.stringify({ ...example, report: table }),
    { structured: true },
  );
  await recordCase(
    "whole malformed result",
    '{"schemaVersion":1,"findings":"none"}',
    { refusal: true },
  );
  await recordCase(
    "whole fenced malformed result",
    fenced({ schemaVersion: 2, findings: [] }),
    { refusal: true },
  );
  await recordCase(
    "unfenced malformed claim",
    'My return:\n\n{"schemaVersion":1,"findings":"none"}\n\n' + table,
    { refusal: true },
  );

  // Execute the activation-base recorder unchanged except that relative
  // module specifiers resolve from its original location. Its validator and
  // imported helpers are the current checkout's; the changed parse decision
  // is entirely in recordAgentReview and no provider is launched.
  const base = "ccfba0df927ccc2e76558af701a1075fc0fa4b36";
  const baseSource = git(root, "show", base + ":scripts/lib/review-worker.mjs");
  const moduleUrl = pathToFileURL(join(root, "scripts/lib/review-worker.mjs"));
  const runnableBase = baseSource
    .replace(
      /from "(\.{1,2}\/[^"\n]+)"/gu,
      (_, spec) => 'from "' + new URL(spec, moduleUrl).href + '"',
    )
    .replace(
      /import\("(\.{1,2}\/[^"\n]+)"\)/gu,
      (_, spec) => 'import("' + new URL(spec, moduleUrl).href + '")',
    )
    .replaceAll(
      "import(`../../packages/",
      "import(`" + pathToFileURL(join(root, "packages")).href + "/",
    );
  const oldRecorder = (
    await import(
      "data:text/javascript;base64," +
        Buffer.from(runnableBase).toString("base64")
    )
  ).recordAgentReview;
  const genuine =
    "Here is my review.\n\n" +
    fenced({
      ...example,
      findings: [
        { ...sampleFinding, summary: "Synthetic actual review finding." },
      ],
      report: table,
    }) +
    "\n\nThat is all.\n";
  await recordCase("base genuine result with trailing prose", genuine, {
    structured: true,
    recorder: oldRecorder,
    expectedFindings: ["F1"],
  });
  await recordCase("current genuine result with trailing prose", genuine, {
    structured: true,
    expectedFindings: ["F1"],
  });

  const stale = fixture();
  const tree = workingTree(stale);
  const from = fromFile("Reviewed tree: " + tree + "\n\n" + table);
  write(stale, "README.md", "# Changed after review\n");
  try {
    await recordAgentReview(
      stale,
      ["--kind", "consistency", "--from", from],
      quiet,
    );
    check("stale tree without flag", false, { accepted: true });
  } catch (error) {
    check("stale tree without flag", /--tree/.test(error.message), {
      error: cleanError(error),
    });
  }
  const saved = await recordAgentReview(
    stale,
    [
      "--kind",
      "consistency",
      "--from",
      from,
      "--tree",
      tree,
      "--host",
      "codex",
      "--model",
      "gpt-6-astra",
      "--effort",
      "max",
    ],
    quiet,
  );
  const bound = JSON.parse(readFileSync(join(stale, saved.record), "utf8"));
  check(
    "explicit earlier tree and actor",
    bound.reviewedTree === tree &&
      bound.model.value === "gpt-6-astra" &&
      bound.effort.value === "max" &&
      bound.model.source === "recorder-attested",
  );

  const branches = [
    "planning/2030-01-02/recheck",
    "planning/2030-01-02-recheck-5cd9ca9c",
    "planning/2030-01-02%2Frecheck",
    "planning/2030-01-02+recheck",
    "planning/2030-01-02/café",
  ];
  const lanes = branches.map((branch) =>
    reviewsLane(root, "planning", { branch }),
  );
  check(
    "distinct planning lanes round-trip",
    new Set(lanes).size === branches.length &&
      lanes.every(
        (lane, i) =>
          "planning/" +
            decodeURIComponent(
              lane
                .split("/")
                .at(-1)
                .replace(/^planning-/, ""),
            ) ===
          branches[i],
      ),
    { branches, lanes },
  );
  const canned = join(parent, "fake.json");
  writeFileSync(
    canned,
    JSON.stringify({ ...example, report: "Read the synthetic pass." }),
  );
  process.env.DOTLN_WORKER_FIXTURE = canned;
  const args = [
    "--kind",
    "criteria",
    "--host",
    "claude",
    "--subject",
    "planning",
  ];
  const branchRepo = fixture(branches[0]);
  const reports = [];
  for (const [i, branch] of branches.entries()) {
    if (i) {
      git(branchRepo, "switch", "--quiet", "main");
      git(branchRepo, "switch", "--quiet", "-c", branch);
      write(
        branchRepo,
        "docs/planning/pass.md",
        "# Synthetic pass " + i + "\n",
      );
      commit(branchRepo);
    }
    const dry = await runChangeReview(
      branchRepo,
      [...args, "--dry-run"],
      quiet,
    );
    const launched = await runChangeReview(branchRepo, args, quiet);
    assert.ok(launched.report, JSON.stringify(launched));
    reports.push(launched.report);
    check(
      "first review for branch " + (i + 1),
      dry.report === launched.report &&
        launched.report.startsWith(lanes[i] + "/"),
    );
  }
  check(
    "five branches retain five first reports",
    new Set(reports).size === 5,
    { reports },
  );
  const before = await runChangeReview(
    branchRepo,
    [...args, "--recheck", reports.at(-1), "--dry-run"],
    quiet,
  );
  write(branchRepo, "docs/planning/after.md", "# Later change\n");
  const after = await runChangeReview(
    branchRepo,
    [...args, "--recheck", reports.at(-1), "--dry-run"],
    quiet,
  );
  check(
    "whole-change recheck retains base and original plus later files",
    before.since === after.since &&
      after.brief.includes("docs/planning/pass.md") &&
      after.brief.includes("docs/planning/after.md") &&
      after.brief.includes("review the whole current change against the base"),
  );
  const sinceBase = git(branchRepo, "rev-parse", "main^{tree}");
  const fresh = await runChangeReview(
    branchRepo,
    [...args, "--since", sinceBase],
    quiet,
  );
  const freshRecord = JSON.parse(
    readFileSync(join(branchRepo, fresh.record), "utf8"),
  );
  check(
    "fresh since ladder names its base",
    freshRecord.since === sinceBase &&
      fresh.report.includes("/since-" + sinceBase.slice(0, 12) + "/round-1-"),
  );

  const swapped = table
    .replace(
      "| Changed contract | Consumer | Command | Result |",
      "| Result | Command | Consumer | Changed contract |",
    )
    .replace(
      "| generated pages | docs/guide.md | read docs/guide.md | current |",
      "| current | read docs/guide.md | docs/guide.md | generated pages |",
    )
    .replace(
      "| fixture manifests | fixture.json | read fixture.json | none |",
      "| none | read fixture.json | fixture.json | fixture manifests |",
    );
  check(
    "reordered traced-consumer columns",
    tracedConsumersRefusal(swapped) === null,
  );
  check(
    "missing traced consumer refused",
    Boolean(
      tracedConsumersRefusal(table.replace("docs/guide.md |", "<path> |")),
    ),
  );
  const items =
    "## Items\n\n| Disposition | Location in the subject | Item |\n| --- | --- | --- |\n| reviewed | docs/planning/pass.md | 1 |\n| missing | | 2 |\n";
  check(
    "reordered item columns and missing location",
    itemsTable(items).refusal === null,
  );
  check(
    "acted-on missing location refused",
    Boolean(itemsTable(items.replace("missing", "acted on")).refusal),
  );
  const captured = fixture("planning/2030-01-02-capture");
  const captureText =
    "1. Preserve the branch name in every recorded review.\n2. Read the changed consumer before recording the result.\n";
  const capture = fromFile(captureText);
  const dry = await runChangeReview(
    captured,
    [...args, "--capture", capture, "--dry-run"],
    quiet,
  );
  const returned = fromFile(
    "Preserve the branch name in every recorded review.\n\n" + items,
  );
  const capturedResult = await recordAgentReview(
    captured,
    [
      "--kind",
      "criteria",
      "--subject",
      "planning",
      "--capture",
      capture,
      "--from",
      returned,
    ],
    quiet,
  );
  const bytes = readFileSync(join(captured, capturedResult.record), "utf8");
  const record = JSON.parse(bytes);
  check(
    "capture brief digest and quotation omission",
    dry.brief.endsWith(captureText) &&
      record.captures[0].sha256 ===
        createHash("sha256").update(captureText).digest("hex") &&
      !bytes.includes("Preserve the branch name in every recorded review.") &&
      itemsTable(record.report).refusal === null,
  );
} finally {
  removeTemporaryPath(parent, { recursive: true, force: true });
}
console.log(
  JSON.stringify(
    {
      checks: observations.length,
      failures: observations.filter((row) => !row.passed).length,
      observations,
    },
    null,
    2,
  ),
);
process.exitCode = observations.some((row) => !row.passed) ? 1 : 0;
