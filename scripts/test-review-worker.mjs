#!/usr/bin/env node
// The change review helper (`npm run worker -- review`) over fixture
// repositories with the fake transport: no model is launched here.
import {
  createFixtureRoot,
  excludeFixtureOwnership,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { runGit } from "./lib/git.mjs";
import {
  write,
  json as prettyJson,
  sha256Hex as sha256,
} from "./lib/helpers.mjs";
import { isMainModule } from "./lib/paths.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  appendFileSync,
  chmodSync,
  existsSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  itemsTable,
  recordAgentReview,
  reviewsLane,
  runChangeReview,
  tracedConsumersRefusal,
} from "./lib/review-worker.mjs";
import { workingTree } from "./lib/checkpoint.mjs";
import { reviewerBriefs } from "../packages/skeleton/dist/src/loadouts/contributor.js";
import { validateChangeReviewResult } from "../packages/skeleton/dist/src/change-review-protocol.js";
import {
  initializeSubagentCounter,
  subagentUsage,
} from "../packages/skeleton/dist/src/subagent-budget.js";

const fixtureGitOptions = {
  maxBuffer: 1024 * 1024,
  onFailure: (result, args) =>
    assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`),
};
const git = (repo, args) => runGit(repo, args, fixtureGitOptions);
const commit = (repo, message) => {
  git(repo, ["add", "-A"]);
  git(repo, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "--quiet",
    "-m",
    message,
  ]);
};

const ORDER = `# WO-901 — Fixture order

**Acceptance criteria (all required)**

1. src/module.mjs exports value 2.
2. The fixture's README names the change.
`;

/** A launchpad on main with one order, then that order's branch with a
 * tracked change and an untracked file; the reviews lane is ignored. */
function orderRepository(parent) {
  const repo = realpathSync(createFixtureRoot(join(parent, "review-")));
  git(repo, ["init", "--quiet", "-b", "main"]);
  excludeFixtureOwnership(repo);
  for (const [key, value] of [
    ["user.email", "fixture@example.invalid"],
    ["user.name", "Fixture"],
    ["commit.gpgsign", "false"],
  ])
    git(repo, ["config", key, value]);
  write(repo, ".gitignore", "docs/control/local/\n.dotln-owner.json\n");
  write(repo, "README.md", "# Fixture\n");
  write(repo, "src/module.mjs", "export const value = 1;\n");
  write(repo, "docs/work-orders/WO-901-fixture-order.md", ORDER);
  commit(repo, "fixture base");
  git(repo, ["switch", "--quiet", "-c", "wo-901"]);
  write(repo, "src/module.mjs", "export const value = 2;\n");
  write(repo, "src/added.mjs", "export const added = true;\n");
  return repo;
}

/** A launchpad on main with one order, then a planning branch whose pass
 * document is committed; the reviews lane is ignored. */
function planningRepository(parent, branch) {
  const repo = realpathSync(createFixtureRoot(join(parent, "planning-")));
  git(repo, ["init", "--quiet", "-b", "main"]);
  excludeFixtureOwnership(repo);
  for (const [key, value] of [
    ["user.email", "fixture@example.invalid"],
    ["user.name", "Fixture"],
    ["commit.gpgsign", "false"],
  ])
    git(repo, ["config", key, value]);
  write(repo, ".gitignore", "docs/control/local/\n.dotln-owner.json\n");
  write(repo, "README.md", "# Fixture\n");
  write(repo, "docs/work-orders/WO-901-fixture-order.md", ORDER);
  commit(repo, "fixture base");
  git(repo, ["switch", "--quiet", "-c", branch]);
  write(
    repo,
    "docs/planning/fixture-pass.md",
    "# Fixture pass\n\nPlans WO-901.\n",
  );
  commit(repo, "fixture planning pass");
  return repo;
}

/** A consistency report's required table, with both named rows filled. */
const TRACED = [
  "## Traced consumers",
  "",
  "| Changed contract | Consumer | Command | Result |",
  "| --- | --- | --- | --- |",
  "| generated pages | docs/README.md | node scripts/meta.mjs --check | current |",
  "| fixture manifests | scripts/fixtures.json | grep -rn module scripts | no pin names the module |",
  "| src/module.mjs value | src/consumer.mjs | node --test src | passes |",
  "",
].join("\n");

/** A Traced consumers table whose "Command result" header names two required
 * columns, with every real Command cell empty. */
const SHARED_HEADER = [
  "## Traced consumers",
  "",
  "| Changed contract | Consumer | Command result | Command |",
  "| --- | --- | --- | --- |",
  "| generated pages | docs/README.md | current | |",
  "| fixture manifests | scripts/fixtures.json | no matches | |",
  "",
].join("\n");

const canned = (parent, name, value) => {
  const path = join(parent, `${name}.json`);
  write(parent, `${name}.json`, prettyJson(value));
  return path;
};
const roundOne = {
  schemaVersion: 1,
  findings: [
    {
      id: "F1",
      severity: "blocking",
      summary: "src/module.mjs still needs the README line criterion 2 names.",
      file: "src/module.mjs",
      line: 1,
      basis: { criterion: "2" },
    },
    {
      id: "F2",
      severity: "note",
      summary: "The added module has no consumer yet.",
      file: "src/added.mjs",
      line: null,
      basis: null,
    },
  ],
  rechecks: [],
  filesRead: ["src/module.mjs", "src/added.mjs"],
  report: "Read src/module.mjs and src/added.mjs against the order.",
};

/** Run the helper with the fixture's environment, capturing its output. */
async function review(repo, args, env, now) {
  const saved = Object.fromEntries(
    [
      "DOTLN_WORKER_FIXTURE",
      "CODEX_THREAD_ID",
      "CLAUDE_CODE_SESSION_ID",
      "CLAUDE_SESSION_ID",
      "COPILOT_AGENT_SESSION_ID",
      "DOTLN_DRIVEN_WORKER",
    ].map((key) => [key, process.env[key]]),
  );
  saved.DOTLN_WORKER_FIXTURE_TOUCH = process.env.DOTLN_WORKER_FIXTURE_TOUCH;
  for (const key of Object.keys(saved)) delete process.env[key];
  Object.assign(process.env, env);
  let printed = "";
  try {
    const result = await runChangeReview(repo, args, {
      write: (text) => (printed += text),
      ...(now ? { now } : {}),
    });
    return { result, printed };
  } finally {
    for (const [key, value] of Object.entries(saved))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  }
}

export async function reviewWorkerFixtures() {
  const parent = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-review-worker-fixtures-")),
  );
  try {
    await test("a criteria review on Codex writes its report pair, prints its counts, journals the launch and counts one use", async () => {
      const repo = orderRepository(parent);
      const lane = join(repo, "docs/control/local/reviews/WO-901");
      const session = "fixture-codex-thread";
      const harness = join(repo, "docs/control/local/harness");
      assert.equal(initializeSubagentCounter(harness, session), null);
      const before = git(repo, ["status", "--porcelain"]);
      const { result, printed } = await review(
        repo,
        ["--kind", "criteria", "--host", "codex"],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "round-one", roundOne),
          CODEX_THREAD_ID: session,
        },
      );
      assert.match(
        printed,
        /^review: criteria round 1 found 2 \(1 blocking\); 0 h 0 min\n$/u,
      );
      assert.equal(
        result.report,
        "docs/control/local/reviews/WO-901/round-1-criteria.md",
      );
      const record = JSON.parse(
        readFileSync(join(lane, "round-1-criteria.json"), "utf8"),
      );
      assert.equal(record.kind, "change-review-report");
      assert.deepEqual(record.review, { kind: "criteria", round: 1 });
      assert.equal(record.host, "codex");
      assert.equal(record.model.value, "gpt-6.1-sol");
      assert.equal(record.effort.value, "max");
      assert.equal(record.model.source, "command-line");
      assert.equal(record.since, git(repo, ["merge-base", "HEAD", "main"]));
      assert.equal(record.sinceSource, "the merge base with main");
      assert.deepEqual(
        record.findings.map((finding) => [finding.id, finding.basis]),
        [
          ["F1", { criterion: "2" }],
          ["F2", null],
        ],
      );
      assert.ok(record.brief.includes(reviewerBriefs.criteria));
      assert.ok(!record.brief.includes(reviewerBriefs.design));
      assert.ok(record.brief.includes("never start a test-runner gate"));
      assert.ok(
        record.brief.includes("src/added.mjs"),
        "untracked files count",
      );
      assert.ok(record.brief.includes(ORDER.trim()));
      assert.equal(record.checkout.unchanged, true);
      const report = readFileSync(join(lane, "round-1-criteria.md"), "utf8");
      assert.match(report, /^# Change review: criteria, round 1, WO-901$/mu);
      assert.match(
        report,
        /\*\*F1\*\* \(blocking; criterion 2\) `src\/module\.mjs:1`/u,
      );
      assert.match(report, /^- `src\/added\.mjs`$/mu);
      assert.equal(git(repo, ["status", "--porcelain"]), before);
      const journal = readFileSync(
        join(harness, `${sha256(session)}.jsonl`),
        "utf8",
      )
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      const launched = journal.filter((row) => row.event === "WorkerLaunched");
      assert.equal(launched.length, 1);
      assert.equal(launched[0].session, sha256(session));
      assert.equal(launched[0].workOrder, "WO-901");
      assert.equal(launched[0].kind, "criteria");
      assert.equal(launched[0].round, 1);
      assert.equal(launched[0].host, "codex");
      assert.equal(launched[0].harnessVersion, "fixture-v1");
      assert.equal(launched[0].outcome, "report");
      assert.deepEqual(launched[0].model, {
        value: "gpt-6.1-sol",
        source: "command-line",
      });
      for (const key of ["startedAt", "endedAt", "durationMs", "tokens"])
        assert.ok(key in launched[0], key);
      const usage = subagentUsage(repo, harness, session);
      assert.equal(usage.count, 1);
      assert.deepEqual(usage.launchedByHost, {
        claude: 0,
        codex: 1,
        unattributed: 0,
      });
    });

    await test("a recheck reads its prior report, and the combined last round carries the three briefs and the prior findings", async () => {
      const repo = orderRepository(parent);
      const first = await review(
        repo,
        ["--kind", "criteria", "--host", "claude"],
        { DOTLN_WORKER_FIXTURE: canned(parent, "first", roundOne) },
      );
      write(repo, "README.md", "# Fixture\n\nValue 2.\n");
      const recheck = canned(parent, "recheck", {
        ...roundOne,
        findings: [],
        rechecks: [
          { id: "criteria.1.F1", outcome: "held", note: "README names it." },
          { id: "criteria.1.F2", outcome: "not-held", note: "Still unused." },
        ],
      });
      const second = await review(
        repo,
        [
          "--kind",
          "criteria",
          "--host",
          "claude",
          "--recheck",
          first.result.report,
        ],
        { DOTLN_WORKER_FIXTURE: recheck },
      );
      assert.match(
        second.printed,
        /^review: criteria round 2 found 0 \(0 blocking\)/u,
      );
      const secondRecord = JSON.parse(
        readFileSync(join(repo, second.result.record), "utf8"),
      );
      const firstRecord = JSON.parse(
        readFileSync(join(repo, first.result.record), "utf8"),
      );
      // A recheck reviews the whole change against its base again, and names
      // the tree the earlier round reviewed so the fixes can be read too.
      assert.equal(secondRecord.since, firstRecord.since);
      assert.equal(secondRecord.sinceSource, "the merge base with main");
      assert.equal(secondRecord.priorReviewedTree, firstRecord.reviewedTree);
      assert.notEqual(secondRecord.reviewedTree, firstRecord.reviewedTree);
      assert.deepEqual(secondRecord.priorFindingIds, [
        "criteria.1.F1",
        "criteria.1.F2",
      ]);
      assert.deepEqual(secondRecord.answered, [
        {
          path: first.result.record,
          recordSha256: sha256(
            readFileSync(join(repo, first.result.record), "utf8"),
          ),
        },
      ]);
      assert.ok(
        secondRecord.brief.includes(
          "This is round 2, a recheck: first confirm or refute the fixes of the earlier findings listed below on the current tree, then review the whole current change against the base below again under your brief.",
        ),
      );
      assert.ok(
        secondRecord.brief.includes(
          `\`git diff ${firstRecord.reviewedTree} ${secondRecord.reviewedTree}\` shows what its fixes changed`,
        ),
      );
      // The stat is the whole change since the merge base, not the fix alone.
      const stat = secondRecord.brief
        .split("The stat is:")[1]
        .split("\n## ")[0];
      for (const path of ["README.md", "src/added.mjs", "src/module.mjs"])
        assert.ok(stat.includes(path), path);
      assert.match(
        readFileSync(join(repo, second.result.report), "utf8"),
        /^- criteria\.1\.F1: held\. README names it\.$/mu,
      );
      write(repo, "src/module.mjs", "export const value = 2; // checked\n");
      const combined = await review(
        repo,
        [
          "--kind",
          "combined",
          "--round",
          "3",
          "--host",
          "codex",
          "--recheck",
          first.result.report,
        ],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "combined", {
            ...roundOne,
            findings: [],
            rechecks: [],
          }),
        },
      );
      const record = JSON.parse(
        readFileSync(join(repo, combined.result.record), "utf8"),
      );
      assert.equal(
        combined.result.report,
        "docs/control/local/reviews/WO-901/round-3-combined.md",
      );
      for (const brief of Object.values(reviewerBriefs))
        assert.ok(record.brief.includes(brief));
      // The combined round's instruction is WO-250's, word for word.
      assert.ok(
        record.brief.includes(
          `This is the last round: one combined review carrying all three briefs over the change since the base below (the tree ${first.result.record} reviewed). A new finding is admitted only when it breaks an acceptance criterion or a behavior \`main\` had, and any other new finding is recorded in the handoff, not fixed. Recheck the earlier findings listed below where they bear on that change.`,
        ),
      );
      assert.equal(record.since, firstRecord.reviewedTree);
      assert.match(
        record.brief,
        /\*\*criteria\.1\.F1\*\* \(blocking; criterion 2\)/u,
      );
      assert.match(record.brief, /\*\*criteria\.1\.F2\*\* \(note\)/u);
      assert.match(
        record.brief,
        /admitted only when it breaks an acceptance criterion/u,
      );
    });

    await test("a planning subject reviews the branch's planning document and changed orders into the branch's planning lane", async () => {
      const repo = orderRepository(parent);
      git(repo, ["switch", "--quiet", "--discard-changes", "main"]);
      rmSync(join(repo, "src/added.mjs"));
      git(repo, ["switch", "--quiet", "-c", "planning/2030-01-02-fixture"]);
      write(
        repo,
        "docs/planning/fixture-pass-2030-01-02.md",
        "# Fixture pass\n\nPlans WO-901.\n",
      );
      write(
        repo,
        "docs/work-orders/WO-901-fixture-order.md",
        `${ORDER}3. A third criterion the pass adds.\n`,
      );
      commit(repo, "fixture planning pass");
      write(repo, "src/module.mjs", "export const value = 3;\n");
      const { result } = await review(
        repo,
        ["--kind", "criteria", "--host", "codex", "--subject", "planning"],
        { DOTLN_WORKER_FIXTURE: canned(parent, "planning", roundOne) },
        () => new Date("2030-01-02T12:00:00Z"),
      );
      assert.equal(
        result.report,
        "docs/control/local/reviews/planning-2030-01-02-fixture/round-1-criteria.md",
      );
      const record = JSON.parse(
        readFileSync(join(repo, result.record), "utf8"),
      );
      assert.equal(record.subject, "planning");
      assert.equal(record.workOrder, null);
      assert.ok(
        record.brief.includes("docs/planning/fixture-pass-2030-01-02.md:"),
      );
      assert.ok(record.brief.includes("A third criterion the pass adds."));
      assert.ok(!record.brief.includes("export const value = 3"));
      await assert.rejects(
        review(
          repo,
          [
            "--kind",
            "criteria",
            "--host",
            "codex",
            "--order",
            "WO-901",
            "--subject",
            "planning",
          ],
          {},
        ),
        /--order and --subject are exclusive/u,
      );
      git(repo, ["switch", "--quiet", "-c", "wo-902"]);
      await assert.rejects(
        review(
          repo,
          ["--kind", "criteria", "--host", "codex", "--subject", "planning"],
          {},
        ),
        /--subject planning reviews a planning\/ branch/u,
      );
    });

    await test("WO-257 criterion 12: a planning brief past the ceiling is split into batches over more workers with one merged report, a --since round carries only the documents changed since that tree, a batch that returns no report records nothing, and the dry run prints the measured size, the ceiling and the batch plan", async () => {
      const repo = planningRepository(parent, "planning/2030-01-03-batches");
      // Three orders under the per-document cap whose sum passes the ceiling.
      const filler = (id) =>
        `# ${id} — Fixture order\n\n${`${id} carries a long paragraph of fixture prose for the review. `.repeat(2400)}\n`;
      for (const id of ["WO-903", "WO-904", "WO-905"])
        write(repo, `docs/work-orders/${id}-fixture-order.md`, filler(id));
      commit(repo, "three large orders");
      const large = git(repo, ["rev-parse", "HEAD"]).trim();
      const capture = join(parent, "batch-dispatch.md");
      write(
        parent,
        "batch-dispatch.md",
        "planning: fixture\n\n1. first item\n2. second item\n",
      );
      const planning = [
        "--kind",
        "criteria",
        "--host",
        "codex",
        "--subject",
        "planning",
        "--capture",
        capture,
      ];
      const documents = [
        "docs/planning/fixture-pass.md",
        "docs/work-orders/WO-903-fixture-order.md",
        "docs/work-orders/WO-904-fixture-order.md",
        "docs/work-orders/WO-905-fixture-order.md",
      ];
      const dry = JSON.parse(
        (await review(repo, [...planning, "--dry-run"], {})).printed,
      );
      assert.equal(dry.measured.ceiling, 400_000);
      assert.ok(
        dry.measured.brief > dry.measured.ceiling,
        "the whole brief is past the ceiling",
      );
      assert.equal(dry.measured.batches.length, 2);
      assert.deepEqual(
        dry.measured.batches.flatMap((batch) => batch.documents),
        documents,
        "every document of the round is in exactly one batch, in order",
      );
      for (const batch of dry.measured.batches)
        assert.ok(batch.brief <= dry.measured.ceiling, `batch ${batch.number}`);
      assert.ok(dry.brief.includes("this is batch 1 of 2"));
      assert.ok(
        dry.brief.includes(
          "- batch 2: docs/work-orders/WO-905-fixture-order.md",
        ),
      );
      assert.ok(!existsSync(join(repo, "docs/control/local/reviews")));
      const items = (rows) =>
        `Read the orders against the dispatch.\n\n## Items\n\n| Item | Location in the subject | Disposition |\n| --- | --- | --- |\n${rows.map((row) => `| ${row} |`).join("\n")}\n`;
      const first = canned(parent, "batch-one", {
        ...roundOne,
        report: items(["1 | WO-903 criterion 1 | acted on"]),
      });
      const second = canned(parent, "batch-two", {
        ...roundOne,
        findings: [roundOne.findings[1]],
        report: items(["2 | WO-905 criterion 1 | reviewed"]),
      });
      // A batch that returns no report ends the round naming the batch, and
      // no merged report is recorded over the missing one.
      const missing = await review(repo, planning, {
        DOTLN_WORKER_FIXTURE: `${first},none`,
      });
      assert.equal(missing.result.report, null);
      assert.match(
        missing.printed,
        /^review: criteria round 1: batch 2 of 2 returned no report \(/u,
      );
      const lane = join(
        repo,
        "docs/control/local/reviews/planning-2030-01-03-batches",
      );
      assert.ok(!existsSync(join(lane, "round-1-criteria.md")));
      // One worker per batch, each brief under the ceiling with the round's
      // index, and one report keyed by batch.
      const { result, printed } = await review(repo, planning, {
        DOTLN_WORKER_FIXTURE: `${first},${second}`,
      });
      assert.match(
        printed,
        /^review: criteria round 1 found 3 \(1 blocking\); 0 h 0 min; 2 batches\n/u,
      );
      assert.equal(result.batches, 2);
      const record = JSON.parse(
        readFileSync(join(repo, result.record), "utf8"),
      );
      assert.deepEqual(
        record.findings.map((finding) => finding.id),
        ["b1.F1", "b1.F2", "b2.F2"],
      );
      assert.deepEqual(
        record.batches.map((batch) => batch.documents),
        dry.measured.batches.map((batch) => batch.documents),
      );
      for (const batch of record.batches) {
        assert.ok(batch.briefLength <= 400_000);
        assert.ok(batch.brief.includes(`this is batch ${batch.number} of 2`));
        for (const path of documents)
          assert.ok(
            batch.brief.includes(`: ${path} (`),
            `${path} in the index`,
          );
        assert.match(batch.episodeId, new RegExp(`_b${batch.number}$`, "u"));
      }
      const report = readFileSync(join(repo, result.report), "utf8");
      assert.match(
        report,
        /^- Batches: 1 of 2 \(docs\/planning\/fixture-pass\.md, docs\/work-orders\/WO-903-fixture-order\.md, docs\/work-orders\/WO-904-fixture-order\.md; brief \d+ characters; 0 h 0 min\); 2 of 2 \(docs\/work-orders\/WO-905-fixture-order\.md; brief \d+ characters; 0 h 0 min\); each finding is keyed by its batch\.$/mu,
      );
      // The merged Items table carries every batch's rows ahead of the
      // batches' own reports, whose headings are demoted.
      const merged = report.slice(report.indexOf("## The worker's report"));
      assert.ok(merged.indexOf("## Items") < merged.indexOf("## Batch 1 of 2"));
      assert.match(
        merged,
        /\| 1 \| WO-903 criterion 1 \| acted on \|\n\| 2 \| WO-905 criterion 1 \| reviewed \|/u,
      );
      assert.match(
        merged,
        /## Batch 2 of 2\n\nDocuments: docs\/work-orders\/WO-905-fixture-order\.md\.\n\n.*\n\n### Items/su,
      );
      // A --since round carries only the documents changed since that tree.
      write(
        repo,
        "docs/work-orders/WO-906-fixture-order.md",
        "# WO-906 — Small\n\nOne line.\n",
      );
      commit(repo, "one small order");
      const since = JSON.parse(
        (await review(repo, [...planning, "--dry-run", "--since", large], {}))
          .printed,
      );
      assert.deepEqual(
        since.measured.batches.flatMap((batch) => batch.documents),
        ["docs/work-orders/WO-906-fixture-order.md"],
      );
      assert.equal(since.measured.batches.length, 1);
      // A round under the ceiling has one batch and no batch fields.
      const small = planningRepository(parent, "planning/2030-01-04-small");
      const under = JSON.parse(
        (await review(small, [...planning.slice(0, 6), "--dry-run"], {}))
          .printed,
      );
      assert.equal(under.measured.batches.length, 1);
      assert.ok(under.measured.brief <= under.measured.ceiling);
      assert.ok(!under.brief.includes("this is batch"));
    });

    await test("WO-257 round 1: a split round is recorded batch by batch through the record route, a single report never stands for it, and the dry run prints every batch's prompt", async () => {
      const repo = planningRepository(
        parent,
        "planning/2030-01-05-record-batches",
      );
      const filler = (id) =>
        `# ${id} — Fixture order\n\n${`${id} carries a long paragraph of fixture prose for the review. `.repeat(2400)}\n`;
      for (const id of ["WO-903", "WO-904", "WO-905"])
        write(repo, `docs/work-orders/${id}-fixture-order.md`, filler(id));
      commit(repo, "three large orders");
      const capture = join(parent, "record-batch-dispatch.md");
      write(
        parent,
        "record-batch-dispatch.md",
        "planning: fixture\n\n1. first item\n2. second item\n",
      );
      const planning = [
        "--kind",
        "criteria",
        "--host",
        "claude",
        "--subject",
        "planning",
        "--capture",
        capture,
      ];
      const dry = JSON.parse(
        (await review(repo, [...planning, "--dry-run"], {})).printed,
      );
      assert.equal(dry.measured.batches.length, 2);
      // Every batch's worker input, with its Budget and Output sections, is
      // printed with its digest, so the Agent route reads the whole round.
      assert.equal(dry.batches.length, 2);
      for (const batch of dry.batches) {
        assert.ok(batch.prompt.includes(`this is batch ${batch.number} of 2`));
        assert.ok(batch.prompt.includes("## Budget"));
        assert.ok(batch.prompt.includes("## Output"));
        assert.deepEqual(
          batch.documents,
          dry.measured.batches[batch.number - 1].documents,
        );
      }
      const items = (rows) =>
        `Read the orders against the dispatch.\n\n## Items\n\n| Item | Location in the subject | Disposition |\n| --- | --- | --- |\n${rows.map((row) => `| ${row} |`).join("\n")}\n`;
      const part = (name, result) => {
        write(parent, `${name}.json`, JSON.stringify(result));
        return join(parent, `${name}.json`);
      };
      const first = part("record-batch-one", {
        ...roundOne,
        report: items(["1 | WO-903 criterion 1 | acted on"]),
      });
      const second = part("record-batch-two", {
        ...roundOne,
        findings: [roundOne.findings[1]],
        report: items(["2 | WO-905 criterion 1 | reviewed"]),
      });
      // Every part names the dry run's tree, so a document edited between
      // the parts is caught by the plan the brief digest binds, not by the
      // tree the working tree would name.
      const record = (args) =>
        recordAgentReview(
          repo,
          [
            ...planning,
            "--format",
            "json",
            "--tree",
            dry.reviewedTree,
            ...args,
          ],
          { write: () => {} },
        );
      // One report cannot stand for the split round.
      await assert.rejects(
        record(["--from", first]),
        /this round's brief is split into 2 batches \(the dry run prints each batch's prompt under batches\[\]\); record each batch's report with --batch 1 to 2/u,
      );
      await assert.rejects(
        record(["--from", first, "--batch", "3"]),
        /--batch 1 to 2/u,
      );
      const one = await record(["--from", first, "--batch", "1"]);
      assert.equal(one.report, null);
      assert.match(
        one.line,
        /^review: criteria round 1: recorded batch 1 of 2 from the Agent route; waiting for batch 2 before the merged report is recorded$/u,
      );
      assert.ok(
        existsSync(
          join(
            repo,
            "docs/control/local/reviews/planning-2030-01-05-record-batches/round-1-criteria.batch-1.json",
          ),
        ),
      );
      await assert.rejects(
        record(["--from", first, "--batch", "1"]),
        /already holds batch 1 of 2/u,
      );
      // The dry run's brief digest binds a part to the prompt its worker
      // received: another digest is refused before anything is recorded
      // (round 3's F3).
      await assert.rejects(
        record([
          "--from",
          second,
          "--batch",
          "2",
          "--brief-sha256",
          "0".repeat(64),
        ]),
        /--brief-sha256 0{64} is not the digest of batch 2's brief now \([0-9a-f]{64}\): the documents or the tree changed since the dry run/u,
      );
      // A part recorded under a plan that changed since (a document edited
      // between the record and the merge) is refused naming the part
      // (round 2's design F2).
      const edited = join(repo, "docs/work-orders/WO-905-fixture-order.md");
      const original = readFileSync(edited, "utf8");
      writeFileSync(
        edited,
        `${original}\nAn amendment after batch 1 was recorded.\n`,
      );
      await assert.rejects(
        record(["--from", second, "--batch", "2"]),
        /the brief of batch 1 differs from the plan now/u,
      );
      writeFileSync(edited, original);
      rmSync(
        join(
          repo,
          "docs/control/local/reviews/planning-2030-01-05-record-batches/round-1-criteria.batch-2.json",
        ),
        { force: true },
      );
      const two = await record([
        "--from",
        second,
        "--batch",
        "2",
        "--brief-sha256",
        dry.batches[1].briefSha256,
      ]);
      assert.match(
        two.line,
        /^review: criteria round 1 found 3 \(1 blocking\); recorded from the Agent route; 2 batches$/u,
      );
      const merged = JSON.parse(readFileSync(join(repo, two.record), "utf8"));
      assert.deepEqual(
        merged.findings.map((finding) => finding.id),
        ["b1.F1", "b1.F2", "b2.F2"],
      );
      assert.deepEqual(
        merged.batches.map((batch) => batch.documents),
        dry.measured.batches.map((batch) => batch.documents),
      );
      const report = readFileSync(join(repo, two.report), "utf8");
      assert.match(
        report,
        /^- Batches: 1 of 2 \(.*; brief \d+ characters; duration unknown\); 2 of 2/mu,
      );
      assert.match(
        report,
        /\| 1 \| WO-903 criterion 1 \| acted on \|\n\| 2 \| WO-905 criterion 1 \| reviewed \|/u,
      );
    });

    await test("WO-257 repair: both batch routes preserve semantic table columns and unique recheckable finding IDs", async () => {
      const table = (title, header, rows) =>
        [
          `## ${title}`,
          "",
          `| ${header.join(" | ")} |`,
          `| ${header.map(() => "---").join(" | ")} |`,
          ...rows.map((row) => `| ${row.join(" | ")} |`),
          "",
        ].join("\n");
      const capture = join(parent, "merge-dispatch.md");
      write(
        parent,
        "merge-dispatch.md",
        "planning: fixture\n1. First item\n2. Second item\n",
      );
      for (const kind of ["criteria", "consistency"]) {
        const reports =
          kind === "criteria"
            ? [
                table(
                  "Items",
                  ["Evidence", "**Status**", "Item", "Where"],
                  [["proof one", "reviewed", "1", "WO-903 criterion 1"]],
                ),
                table(
                  "Items",
                  [
                    "Item number",
                    "Disposition",
                    "Location in the subject",
                    "Evidence",
                  ],
                  [["2", "acted on", "WO-905 criterion 1", "proof two"]],
                ),
              ]
            : [
                TRACED,
                table(
                  "Traced consumers",
                  [
                    "Result summary",
                    "Run command",
                    "Downstream consumer",
                    "Contract changed",
                  ],
                  [
                    [
                      "current",
                      "node scripts/meta.mjs --check",
                      "docs/OTHER.md",
                      "generated pages",
                    ],
                    [
                      "none",
                      "rg module scripts/other.json",
                      "scripts/other.json",
                      "fixture manifests",
                    ],
                  ],
                ),
              ];
        for (const report of reports)
          assert.equal(
            kind === "criteria"
              ? itemsTable(report).refusal
              : tracedConsumersRefusal(report),
            null,
          );
        // Short ids occupy the fallback's first choices both before and
        // after long ids. The second batch repeats an id from the first.
        const results = reports.map((report, at) => ({
          ...roundOne,
          report,
          findings: (at === 0
            ? ["L".repeat(64), "F1", "F3", "M".repeat(52), "F4", "F5"]
            : ["F2"]
          ).map((id) => ({ ...roundOne.findings[1], id })),
        }));
        for (const route of ["transport", "record"]) {
          const label = `${kind}-${route}`;
          const repo = planningRepository(
            parent,
            `planning/2030-01-06-merge-${label}`,
          );
          for (const id of ["WO-903", "WO-904", "WO-905"])
            write(
              repo,
              `docs/work-orders/${id}-fixture-order.md`,
              `# ${id}\n\n${"Ordinary planning document text. ".repeat(5000)}\n`,
            );
          commit(repo, "large planning subject");
          const args = [
            "--kind",
            kind,
            "--host",
            "codex",
            "--subject",
            "planning",
            ...(kind === "criteria" ? ["--capture", capture] : []),
          ];
          const dry = JSON.parse(
            (await review(repo, [...args, "--dry-run"], {})).printed,
          );
          assert.equal(dry.batches.length, 2);
          const files = results.map((result, at) =>
            canned(parent, `merge-${label}-${at}`, result),
          );
          let merged;
          if (route === "transport") {
            merged = (
              await review(repo, args, {
                DOTLN_WORKER_FIXTURE: files.join(","),
              })
            ).result;
          } else {
            for (const [at, file] of files.entries())
              merged = await recordAgentReview(
                repo,
                [
                  ...args,
                  "--from",
                  file,
                  "--format",
                  "json",
                  "--batch",
                  String(at + 1),
                  "--tree",
                  dry.reviewedTree,
                  "--brief-sha256",
                  dry.batches[at].briefSha256,
                ],
                { write: () => {} },
              );
          }
          assert.ok(merged.report, `${label} files the merged report`);
          const record = JSON.parse(
            readFileSync(join(repo, merged.record), "utf8"),
          );
          const ids = record.findings.map(({ id }) => id);
          assert.equal(ids.length, 7);
          assert.equal(new Set(ids).size, ids.length);
          for (const id of ["F1", "F3", "F4", "F5"])
            assert.ok(ids.includes(`b1.${id}`), "short ids keep their names");
          assert.ok(ids.every((id) => `consistency.999.${id}`.length <= 64));
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
          // Inspect the merged table, not the retained original batch bodies.
          const summary = record.report.split("## Batch 1 of 2")[0];
          if (kind === "criteria") {
            assert.equal(itemsTable(summary).refusal, null);
            assert.match(
              summary,
              /\| proof one \| reviewed \| 1 \| WO-903 criterion 1 \|/u,
            );
            assert.match(
              summary,
              /\| proof two \| acted on \| 2 \| WO-905 criterion 1 \|/u,
            );
          } else {
            assert.equal(tracedConsumersRefusal(summary), null);
            assert.match(
              summary,
              /\| generated pages \| docs\/OTHER.md \| node scripts\/meta.mjs --check \| current \|/u,
            );
            assert.match(
              summary,
              /\| fixture manifests \| scripts\/other.json \| rg module scripts\/other.json \| none \|/u,
            );
          }
          // A later worker must be able to address every merged finding,
          // not just deserialize a list whose identifiers appear valid.
          const rechecks = ids.map((id) => ({
            id: `${kind}.1.${id}`,
            outcome: "held",
            note: "Checked the fixture finding.",
          }));
          const recheckFiles = reports.map((report, at) =>
            canned(parent, `merge-recheck-${label}-${at}`, {
              schemaVersion: 1,
              findings: [],
              rechecks,
              filesRead: [],
              report,
            }),
          );
          const rechecked = (
            await review(
              repo,
              [...args, "--round", "2", "--recheck", merged.record],
              {
                DOTLN_WORKER_FIXTURE: recheckFiles.join(","),
              },
            )
          ).result;
          assert.ok(rechecked.report, `${label} can be rechecked`);
          const next = JSON.parse(
            readFileSync(join(repo, rechecked.record), "utf8"),
          );
          assert.deepEqual(
            next.rechecks.map(({ id }) => id),
            rechecks.map(({ id }) => id),
          );
        }
      }
    });

    await test("WO-257 round 2: a document past the room a batch's captures leave is a pointer, and an untracked document unchanged since the named tree is left out", async () => {
      const repo = planningRepository(parent, "planning/2030-01-06-pointers");
      const filler = (id, repeats) =>
        `# ${id} — Fixture order\n\n${`${id} carries a long paragraph of fixture prose for the review. `.repeat(repeats)}\n`;
      write(
        repo,
        "docs/work-orders/WO-903-fixture-order.md",
        filler("WO-903", 2400),
      );
      write(
        repo,
        "docs/work-orders/WO-904-fixture-order.md",
        filler("WO-904", 400),
      );
      commit(repo, "two orders");
      // Two captures, each under the document cap, that together leave the
      // larger order no room beside them under the ceiling: the order becomes
      // a pointer to the checkout, never a refusal (round 1's Codex criteria
      // F5; round 2's criteria F10).
      const captureText = (name) =>
        `planning: fixture ${name}\n\n1. first item\n${"a wide capture line of operator prose that fills the brief. ".repeat(2500)}\n`;
      write(parent, "pointer-dispatch-1.md", captureText("one"));
      write(parent, "pointer-dispatch-2.md", captureText("two"));
      const planning = [
        "--kind",
        "criteria",
        "--host",
        "claude",
        "--subject",
        "planning",
        "--capture",
        join(parent, "pointer-dispatch-1.md"),
        "--capture",
        join(parent, "pointer-dispatch-2.md"),
      ];
      const dry = JSON.parse(
        (await review(repo, [...planning, "--dry-run"], {})).printed,
      );
      assert.ok(dry.measured.brief > dry.measured.ceiling, "the round splits");
      const pointed = dry.batches.find((batch) =>
        batch.pointers.includes("docs/work-orders/WO-903-fixture-order.md"),
      );
      assert.ok(pointed, "the large order is a pointer in its batch");
      assert.match(
        pointed.prompt,
        /docs\/work-orders\/WO-903-fixture-order\.md is \d+ bytes; read it from the checkout\./u,
      );
      assert.ok(
        !dry.batches.some((batch) =>
          batch.pointers.includes("docs/work-orders/WO-904-fixture-order.md"),
        ),
        "the order that fits is carried whole",
      );
      for (const batch of dry.measured.batches)
        assert.ok(batch.brief <= dry.measured.ceiling, `batch ${batch.number}`);
      // An untracked document the named tree already holds unchanged is
      // left out of a --since round; a changed one is in (criteria F4).
      write(
        repo,
        "docs/planning/untracked-pass.md",
        "# Untracked\n\nOne line.\n",
      );
      const withUntracked = JSON.parse(
        (await review(repo, [...planning, "--dry-run"], {})).printed,
      );
      assert.ok(
        withUntracked.measured.batches
          .flatMap((batch) => batch.documents)
          .includes("docs/planning/untracked-pass.md"),
      );
      const snapshot = withUntracked.reviewedTree;
      // A tracked order changes after the snapshot, so the since set is not
      // empty and the branch-base fallback never runs.
      write(
        repo,
        "docs/work-orders/WO-904-fixture-order.md",
        `${filler("WO-904", 400)}An amendment after the snapshot.\n`,
      );
      const unchanged = JSON.parse(
        (
          await review(
            repo,
            [...planning, "--dry-run", "--since", snapshot],
            {},
          )
        ).printed,
      );
      assert.deepEqual(
        unchanged.measured.batches.flatMap((batch) => batch.documents),
        ["docs/work-orders/WO-904-fixture-order.md"],
        "an untracked document unchanged since the tree is not carried",
      );
      write(
        repo,
        "docs/planning/untracked-pass.md",
        "# Untracked\n\nTwo lines.\n",
      );
      const changed = JSON.parse(
        (
          await review(
            repo,
            [...planning, "--dry-run", "--since", snapshot],
            {},
          )
        ).printed,
      );
      assert.deepEqual(
        changed.measured.batches.flatMap((batch) => batch.documents),
        [
          "docs/planning/untracked-pass.md",
          "docs/work-orders/WO-904-fixture-order.md",
        ],
      );
    });

    await test("WO-257 round 1: the helper's brief ceiling is the figure the protocol admits, one character past it refused", async () => {
      const { validateChangeReviewRequest, CHANGE_REVIEW_EFFECT } =
        await import("../packages/skeleton/dist/src/change-review-protocol.js");
      const { CHANGE_REVIEW_BRIEF_CEILING } =
        await import("./lib/review-worker.mjs");
      const capture = realpathSync(
        createFixtureRoot(join(parent, "ceiling-capture-")),
      );
      const request = (length) => ({
        kind: "change-review",
        command: {
          commandId: "cmd_review_ceiling",
          workstreamId: "ws_change_review",
          intent: { kind: "Act", effect: CHANGE_REVIEW_EFFECT, payload: {} },
        },
        episodeId: "ep_review_ceiling",
        model: "claude-opus-5-5",
        effort: "xhigh",
        // The capture lane sits beside the checkout, never inside it.
        cwd: join(parent, "ceiling-checkout"),
        capture,
        review: {
          kind: "criteria",
          round: 1,
          subject: "WO-901",
          priorFindingIds: [],
        },
        brief: "x".repeat(length),
        profile: {
          profileId: "change-review-v1",
          modelTools: ["Read", "Grep", "Glob", "Bash"],
        },
      });
      validateChangeReviewRequest(request(CHANGE_REVIEW_BRIEF_CEILING));
      assert.throws(() =>
        validateChangeReviewRequest(request(CHANGE_REVIEW_BRIEF_CEILING + 1)),
      );
    });

    await test("a worker that returns no report is reported as such and writes nothing", async () => {
      const repo = orderRepository(parent);
      const { result, printed } = await review(
        repo,
        ["--kind", "design", "--host", "codex"],
        {
          DOTLN_WORKER_FIXTURE: "none",
          CLAUDE_CODE_SESSION_ID: "fixture-claude",
        },
      );
      assert.equal(result.report, null);
      assert.match(
        printed,
        /^review: design round 1: the worker returned no report \(.*final-message-absent.*\); 0 h 0 min; nothing written to docs\/control\/local\/reviews\/WO-901\n$/u,
      );
      assert.ok(
        !existsSync(
          join(repo, "docs/control/local/reviews/WO-901/round-1-design.md"),
        ),
      );
      const rows = readFileSync(
        join(
          repo,
          "docs/control/local/harness",
          `${sha256("fixture-claude")}.jsonl`,
        ),
        "utf8",
      );
      assert.match(rows, /"event":"WorkerLaunched".*"outcome":"no-report"/u);
    });

    await test("under a Codex session a launch past the cap is refused with the cap's message before any process starts", async () => {
      const repo = orderRepository(parent);
      write(repo, "docs/control/budgets.json", prettyJson({ subagentCap: 1 }));
      const session = "fixture-capped-thread";
      const harness = join(repo, "docs/control/local/harness");
      initializeSubagentCounter(harness, session);
      const env = {
        DOTLN_WORKER_FIXTURE: canned(parent, "capped", roundOne),
        CODEX_THREAD_ID: session,
      };
      assert.ok(
        (await review(repo, ["--kind", "criteria", "--host", "codex"], env))
          .result.report,
      );
      const refused = await review(
        repo,
        ["--kind", "design", "--host", "codex"],
        {
          ...env,
          // A dispatched worker would fail on this path; the refusal never gets there.
          DOTLN_WORKER_FIXTURE: join(parent, "absent.json"),
        },
      );
      assert.match(
        refused.printed,
        /^DOTLN_SUBAGENT_CAP_REFUSED: count 1, cap 1; docs\/control\/budgets\.json subagentCap would be exceeded\./u,
      );
      assert.equal(
        refused.result.refused.split("\n")[0],
        refused.printed.trim(),
      );
      assert.ok(
        !existsSync(
          join(repo, "docs/control/local/reviews/WO-901/round-1-design.md"),
        ),
      );
      assert.equal(subagentUsage(repo, harness, session).count, 1);
      assert.ok(
        !readFileSync(
          join(harness, `${sha256(session)}.jsonl`),
          "utf8",
        ).includes('"kind":"design"'),
        "a refused launch journals no worker",
      );
    });

    await test("a round needs what its brief states, a repair writes its own lane and no report is overwritten", async () => {
      const repo = orderRepository(parent);
      const env = { DOTLN_WORKER_FIXTURE: canned(parent, "rules", roundOne) };
      await assert.rejects(
        review(
          repo,
          ["--kind", "design", "--host", "codex", "--round", "2"],
          env,
        ),
        /round 2 rechecks an earlier report: name it with --recheck/u,
      );
      await assert.rejects(
        review(
          repo,
          ["--kind", "combined", "--host", "codex", "--round", "3"],
          env,
        ),
        /the combined round reads the change since the tree an earlier round reviewed/u,
      );
      const first = await review(
        repo,
        ["--kind", "design", "--host", "codex"],
        env,
      );
      assert.equal(
        first.result.report,
        "docs/control/local/reviews/WO-901/round-1-design.md",
      );
      await assert.rejects(
        review(
          repo,
          [
            "--kind",
            "design",
            "--host",
            "codex",
            "--recheck",
            first.result.report,
            "--round",
            "1",
          ],
          env,
        ),
        /round 1 reviews the whole change; a recheck is round 2 or later/u,
      );
      await assert.rejects(
        review(repo, ["--kind", "design", "--host", "codex"], env),
        /round-1-design\.md already holds this round's design report/u,
      );
      // A fix dispatch after the activation starts the order's first repair,
      // whose ladder starts again at round 1 in a lane of its own.
      write(
        repo,
        "docs/control/orders/WO-901.jsonl",
        [
          '{"type":"WorkOrderActivated","workOrderId":"WO-901"}',
          '{"type":"RepairRequested","workOrderId":"WO-901"}',
          "",
        ].join("\n"),
      );
      const repair = await review(
        repo,
        ["--kind", "design", "--host", "codex"],
        env,
      );
      assert.equal(
        repair.result.report,
        "docs/control/local/reviews/WO-901/repair-1/round-1-design.md",
      );
      const combined = await review(
        repo,
        [
          "--kind",
          "combined",
          "--round",
          "3",
          "--host",
          "codex",
          "--since",
          git(repo, ["rev-parse", "HEAD^{tree}"]),
        ],
        env,
      );
      const record = JSON.parse(
        readFileSync(join(repo, combined.result.record), "utf8"),
      );
      assert.match(
        record.brief,
        /This is the last round: one combined review carrying all three briefs over the change since the base below \(named with --since\)\./u,
      );
      assert.doesNotMatch(record.brief, /Recheck the earlier findings/u);
      assert.ok(
        existsSync(join(repo, first.result.report)),
        "the execution's report stays",
      );
    });

    await test("a failed complete run starts a repair whose ladder writes its own lane", async () => {
      const repo = orderRepository(parent);
      const env = {
        DOTLN_WORKER_FIXTURE: canned(parent, "failed-run", roundOne),
      };
      write(
        repo,
        "docs/control/orders/WO-901.jsonl",
        '{"type":"WorkOrderActivated","workOrderId":"WO-901","recordedAt":"2030-01-01T00:00:00.000Z"}\n',
      );
      const first = await review(
        repo,
        ["--kind", "criteria", "--host", "codex"],
        env,
      );
      assert.equal(
        first.result.report,
        "docs/control/local/reviews/WO-901/round-1-criteria.md",
      );
      // A failed complete review run in this checkout after the activation;
      // an earlier failure, before it, belongs to another activation.
      write(
        repo,
        "docs/control/local/harness/checks.json",
        JSON.stringify([
          {
            checkId: "npm test",
            gateSelection: "review",
            executed: true,
            exitCode: 1,
            recordedAt: "2029-12-31T00:00:00.000Z",
          },
          {
            checkId: "npm test",
            gateSelection: "review",
            executed: true,
            exitCode: 1,
            recordedAt: "2030-01-02T00:00:00.000Z",
          },
        ]),
      );
      const repair = await review(
        repo,
        ["--kind", "criteria", "--host", "codex"],
        env,
      );
      assert.equal(
        repair.result.report,
        "docs/control/local/reviews/WO-901/repair-1/round-1-criteria.md",
      );
    });

    await test("an Agent worker's returned text is recorded as the same record, which a fresh worker can recheck", async () => {
      const repo = orderRepository(parent);
      const returned = join(parent, "agent-returned.txt");
      write(
        parent,
        "agent-returned.txt",
        `Here is my review.\n\n${JSON.stringify(roundOne)}\n\n${TRACED}`,
      );
      const recorded = await recordAgentReview(
        repo,
        [
          "--kind",
          "consistency",
          "--from",
          returned,
          "--format",
          "json",
          "--tokens",
          "1234",
        ],
        { write: () => {} },
      );
      assert.equal(
        recorded.report,
        "docs/control/local/reviews/WO-901/round-1-consistency.md",
      );
      const record = JSON.parse(
        readFileSync(join(repo, recorded.record), "utf8"),
      );
      assert.equal(record.transport, "agent-tool");
      assert.deepEqual(record.tokens, {
        value: 1234,
        source: "agent-tool-usage",
      });
      assert.equal(record.returnedText.startsWith("Here is my review."), true);
      await assert.rejects(
        recordAgentReview(
          repo,
          ["--kind", "consistency", "--from", returned, "--format", "json"],
          {
            write: () => {},
          },
        ),
        /already holds this round's consistency report/u,
      );
      // A prose report is kept as the round's report, with no findings a
      // recheck could name; a malformed findings object is refused.
      write(parent, "prose-returned.txt", "# Design review\n\nNo findings.\n");
      let printed = "";
      const prose = await recordAgentReview(
        repo,
        ["--kind", "design", "--from", join(parent, "prose-returned.txt")],
        { write: (text) => (printed += text) },
      );
      assert.match(
        printed,
        /recorded the worker's prose report from the Agent route/u,
      );
      const proseRecord = JSON.parse(
        readFileSync(join(repo, prose.record), "utf8"),
      );
      assert.equal(proseRecord.structured, false);
      assert.deepEqual(proseRecord.findings, []);
      assert.equal(proseRecord.report, "# Design review\n\nNo findings.");
      write(
        parent,
        "malformed-returned.txt",
        '{"schemaVersion":2,"findings":[]}\n',
      );
      await assert.rejects(
        recordAgentReview(
          repo,
          [
            "--kind",
            "criteria",
            "--from",
            join(parent, "malformed-returned.txt"),
          ],
          { write: () => {} },
        ),
        /change review result shape/u,
      );
      await assert.rejects(
        recordAgentReview(
          repo,
          ["--kind", "criteria", "--round", "2", "--from", returned],
          { write: () => {} },
        ),
        /round 2 rechecks an earlier report: name it with --recheck/u,
      );
      const recheck = await review(
        repo,
        [
          "--kind",
          "consistency",
          "--host",
          "codex",
          "--recheck",
          recorded.report,
        ],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "agent-recheck", {
            ...roundOne,
            findings: [],
            rechecks: [
              { id: "consistency.1.F1", outcome: "held", note: "Fixed." },
            ],
            report: TRACED,
          }),
        },
      );
      assert.match(recheck.printed, /^review: consistency round 2 found 0/u);
    });

    await test("the checkout witness compares contents, and a planning recheck still finds the branch's documents", async () => {
      const repo = orderRepository(parent);
      // src/module.mjs is already modified; changing it again keeps its
      // status line and changes its bytes.
      const touched = await review(
        repo,
        ["--kind", "criteria", "--host", "codex"],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "touch", roundOne),
          DOTLN_WORKER_FIXTURE_TOUCH: "src/module.mjs",
        },
      );
      const record = JSON.parse(
        readFileSync(join(repo, touched.result.record), "utf8"),
      );
      assert.deepEqual(record.checkout, {
        unchanged: false,
        changed: ["src/module.mjs"],
      });
      assert.match(
        touched.printed,
        /DotLn advisory: the checkout's contents changed during the review: src\/module\.mjs\./u,
      );
      const planning = realpathSync(
        createFixtureRoot(join(parent, "planning-")),
      );
      git(planning, ["init", "--quiet", "-b", "main"]);
      excludeFixtureOwnership(planning);
      for (const [key, value] of [
        ["user.email", "fixture@example.invalid"],
        ["user.name", "Fixture"],
        ["commit.gpgsign", "false"],
      ])
        git(planning, ["config", key, value]);
      write(planning, ".gitignore", "docs/control/local/\n.dotln-owner.json\n");
      write(planning, "README.md", "# Fixture\n");
      write(planning, "docs/work-orders/WO-901-fixture-order.md", ORDER);
      commit(planning, "fixture base");
      git(planning, ["switch", "--quiet", "-c", "planning/2030-01-03-fixture"]);
      write(planning, "docs/planning/fixture-pass-2030-01-03.md", "# Pass\n");
      commit(planning, "pass");
      const at = () => new Date("2030-01-03T12:00:00Z");
      const first = await review(
        planning,
        ["--kind", "criteria", "--host", "codex", "--subject", "planning"],
        { DOTLN_WORKER_FIXTURE: canned(parent, "planning-first", roundOne) },
        at,
      );
      write(planning, "README.md", "# Fixture\n\nOnly a supporting file.\n");
      const again = await review(
        planning,
        [
          "--kind",
          "criteria",
          "--host",
          "codex",
          "--subject",
          "planning",
          "--recheck",
          first.result.report,
        ],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "planning-recheck", {
            ...roundOne,
            findings: [],
            rechecks: [],
          }),
        },
        at,
      );
      const recheckRecord = JSON.parse(
        readFileSync(join(planning, again.result.record), "utf8"),
      );
      assert.ok(
        recheckRecord.brief.includes(
          "docs/planning/fixture-pass-2030-01-03.md:",
        ),
      );
    });

    await test("the transports' pins are the role text's worker pins", async () => {
      const { TRANSPORT_DEFAULTS } = await import("./lib/worker-launch.mjs");
      const { contributorWorkerPins } =
        await import("../packages/skeleton/dist/src/loadouts/contributor.js");
      for (const [transport, host] of [
        ["claude-cli-print", "claude"],
        ["codex-cli-exec", "codex"],
      ])
        assert.deepEqual(
          {
            model: TRANSPORT_DEFAULTS[transport].model,
            effort: TRANSPORT_DEFAULTS[transport].effort,
          },
          { ...contributorWorkerPins[host] },
          transport,
        );
    });

    await test("a long transcript costs a bounded tail, never the run, and Codex's final message is read from its own file", async () => {
      const { runWorkerProcess, CodexCliExecWorkOrderTransport } =
        await import("../packages/skeleton/dist/src/worker-transport.js");
      // Two megabytes of event lines, then the last line a decoder needs.
      const running = runWorkerProcess({
        binary: process.execPath,
        args: [
          "-e",
          "const line = JSON.stringify({type:'item.completed',item:{type:'command_execution',aggregated_output:'x'.repeat(1000)}}) + '\\n'; for (let i = 0; i < 2000; i++) process.stdout.write(line); process.stdout.write(JSON.stringify({type:'turn.completed'}) + '\\n');",
        ],
        cwd: parent,
        input: "",
        timeoutMs: 60_000,
        stdoutTailBytes: 64 * 1024,
      });
      const output = await running.completed;
      assert.ok(Buffer.byteLength(output.stdout) <= 64 * 1024);
      const lines = output.stdout.trim().split("\n");
      for (const line of lines) JSON.parse(line);
      assert.deepEqual(JSON.parse(lines.at(-1)), { type: "turn.completed" });
      // The Codex form writes its final message to the capture lane; the
      // decoder reads it there, whatever the kept stream holds.
      const repo = orderRepository(parent);
      const dry = await review(
        repo,
        ["--kind", "criteria", "--host", "codex", "--dry-run"],
        {},
      );
      const argv = JSON.parse(dry.printed).argv;
      const lastMessage = argv[argv.indexOf("--output-last-message") + 1];
      assert.match(lastMessage, /\/last-message\.txt$/u);
      const { CHANGE_REVIEW_EFFECT } =
        await import("../packages/skeleton/dist/src/change-review-protocol.js");
      const capture = realpathSync(createFixtureRoot(join(parent, "capture-")));
      const request = {
        kind: "change-review",
        command: {
          commandId: "cmd_review_fixture",
          workstreamId: "ws_change_review",
          intent: { kind: "Act", effect: CHANGE_REVIEW_EFFECT, payload: {} },
        },
        episodeId: "ep_review_fixture",
        model: "gpt-6.1-sol",
        effort: "max",
        cwd: repo,
        capture,
        review: {
          kind: "criteria",
          round: 1,
          subject: "WO-901",
          priorFindingIds: [],
        },
        brief: "# Fixture brief\n",
        profile: {
          profileId: "change-review-v1",
          modelTools: ["Read", "Grep", "Glob", "Bash"],
        },
      };
      let launched;
      const transport = new CodexCliExecWorkOrderTransport((launch) => {
        launched = launch;
        write(capture, "last-message.txt", JSON.stringify(roundOne));
        return {
          accepted: Promise.resolve(),
          completed: Promise.resolve({
            // The kept tail lost every agent message; the file holds it.
            stdout: `${JSON.stringify({ type: "turn.completed" })}\n`,
            stderr: "",
            exitCode: 0,
          }),
          alive: () => false,
          kill: () => {},
        };
      }, "0.166.0");
      const result = await transport.dispatch(request, Date.now).completed;
      assert.equal(launched.stdoutTailBytes, 8_000_000);
      assert.equal(
        launched.args[launched.args.indexOf("--output-last-message") + 1],
        join(capture, "last-message.txt"),
      );
      assert.deepEqual(
        result.findings.map((finding) => finding.id),
        ["F1", "F2"],
      );
    });

    await test("a dry run prints the Codex argv with its tool features on and the Claude argv with its read tools", async () => {
      const repo = orderRepository(parent);
      const codex = await review(
        repo,
        ["--kind", "criteria", "--host", "codex", "--dry-run"],
        {},
      );
      const codexArgv = JSON.parse(codex.printed).argv;
      assert.ok(codexArgv.includes("--sandbox"));
      assert.equal(codexArgv[codexArgv.indexOf("--sandbox") + 1], "read-only");
      const disabled = codexArgv.flatMap((arg, index) =>
        arg === "--disable" ? [codexArgv[index + 1]] : [],
      );
      assert.ok(disabled.length > 0);
      for (const feature of ["code_mode_host", "shell_tool", "unified_exec"])
        assert.ok(!disabled.includes(feature), feature);
      assert.equal(codexArgv[codexArgv.indexOf("--model") + 1], "gpt-6.1-sol");
      const claude = await review(
        repo,
        ["--kind", "criteria", "--host", "claude", "--dry-run"],
        {},
      );
      const claudeArgv = JSON.parse(claude.printed).argv;
      assert.equal(
        claudeArgv[claudeArgv.indexOf("--tools") + 1],
        "Read,Grep,Glob,Bash",
      );
      const allowedTools = claudeArgv[claudeArgv.indexOf("--allowedTools") + 1];
      for (const tool of ["Read", "Grep", "Glob", "Bash(git diff:*)"])
        assert.ok(allowedTools.split(",").includes(tool), tool);
      assert.equal(
        claudeArgv[claudeArgv.indexOf("--model") + 1],
        "claude-opus-5-5",
      );
      assert.equal(claudeArgv[claudeArgv.indexOf("--effort") + 1], "xhigh");
      assert.ok(
        !existsSync(join(repo, "docs/control/local/reviews")),
        "a dry run writes nothing",
      );
    });

    await test("two planning passes on one date each run their own round 1 in a lane named by the branch, and a --since round 1 starts a ladder of its own", async () => {
      const repo = planningRepository(parent, "planning/2030-01-02-first");
      const args = ["--kind", "criteria", "--host", "claude"];
      const planning = [...args, "--subject", "planning"];
      const env = {
        DOTLN_WORKER_FIXTURE: canned(parent, "lane-first", roundOne),
      };
      const dry = async () =>
        JSON.parse(
          (await review(repo, [...planning, "--dry-run"], {})).printed,
        );
      const lane = "docs/control/local/reviews";
      assert.equal(
        (await dry()).report,
        `${lane}/planning-2030-01-02-first/round-1-criteria.md`,
      );
      const first = await review(repo, planning, env);
      assert.equal(
        first.result.report,
        `${lane}/planning-2030-01-02-first/round-1-criteria.md`,
      );
      // The day's second pass, on its own branch from main.
      git(repo, ["switch", "--quiet", "main"]);
      git(repo, ["switch", "--quiet", "-c", "planning/2030-01-02-second"]);
      write(repo, "docs/planning/second-pass.md", "# Second pass\n");
      commit(repo, "second pass");
      assert.equal(
        (await dry()).report,
        `${lane}/planning-2030-01-02-second/round-1-criteria.md`,
      );
      const second = await review(repo, planning, env);
      assert.equal(
        second.result.report,
        `${lane}/planning-2030-01-02-second/round-1-criteria.md`,
      );
      // The first pass's lane holds its round 1; a fresh round 1 names its
      // base with --since and keeps a ladder of its own beside the first.
      git(repo, ["switch", "--quiet", "planning/2030-01-02-first"]);
      await assert.rejects(
        review(repo, planning, env),
        /round-1-criteria\.md already holds this round's criteria report; .*a fresh round 1 names its base with --since/u,
      );
      const base = git(repo, ["rev-parse", "HEAD^{tree}"]);
      const fresh = await review(repo, [...planning, "--since", base], env);
      const ladder = `${lane}/planning-2030-01-02-first/since-${base.slice(0, 12)}`;
      assert.equal(fresh.result.report, `${ladder}/round-1-criteria.md`);
      const record = JSON.parse(
        readFileSync(join(repo, fresh.result.record), "utf8"),
      );
      assert.equal(record.since, base);
      assert.equal(record.sinceSource, "named with --since");
      assert.deepEqual(record.ladder, {
        base,
        lane: `since-${base.slice(0, 12)}`,
      });
      assert.ok(existsSync(join(repo, first.result.report)));
      // Its recheck follows it into that ladder, against the same base.
      write(
        repo,
        "docs/planning/fixture-pass.md",
        "# Fixture pass\n\nAmended.\n",
      );
      const recheck = await review(
        repo,
        [...planning, "--recheck", fresh.result.report],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "lane-recheck", {
            ...roundOne,
            findings: [],
            rechecks: [],
          }),
        },
      );
      assert.equal(recheck.result.report, `${ladder}/round-2-criteria.md`);
      const recheckRecord = JSON.parse(
        readFileSync(join(repo, recheck.result.record), "utf8"),
      );
      assert.equal(recheckRecord.since, base);
      assert.equal(recheckRecord.priorReviewedTree, record.reviewedTree);
      // The record route takes the same lane and the same --since rule.
      write(parent, "lane-record.txt", "# Design review\n\nNo findings.\n");
      const recorded = await recordAgentReview(
        repo,
        [
          "--kind",
          "design",
          "--subject",
          "planning",
          "--since",
          base,
          "--from",
          join(parent, "lane-record.txt"),
        ],
        { write: () => {} },
      );
      assert.equal(recorded.report, `${ladder}/round-1-design.md`);
    });

    await test("a consistency report is recorded only with its Traced consumers table, on the helper route and the record route", async () => {
      const repo = orderRepository(parent);
      const session = "fixture-traced-session";
      const refused = await review(
        repo,
        ["--kind", "consistency", "--host", "codex"],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "untraced", roundOne),
          CLAUDE_CODE_SESSION_ID: session,
        },
      );
      assert.equal(refused.result.report, null);
      assert.match(
        refused.printed,
        /^review: consistency round 1: the worker's report is refused, since a consistency report carries a `Traced consumers` table \(changed contract, consumer, command, result\), and this report has none; it returned 2 findings; 0 h 0 min; nothing written to docs\/control\/local\/reviews\/WO-901\n$/u,
      );
      assert.ok(
        !existsSync(
          join(
            repo,
            "docs/control/local/reviews/WO-901/round-1-consistency.md",
          ),
        ),
      );
      const journal = readFileSync(
        join(repo, "docs/control/local/harness", `${sha256(session)}.jsonl`),
        "utf8",
      );
      assert.match(journal, /"outcome":"refused-report"/u);
      const traced = await review(
        repo,
        ["--kind", "consistency", "--host", "codex"],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "traced", {
            ...roundOne,
            report: `Traced the change.\n\n${TRACED}`,
          }),
        },
      );
      assert.equal(
        traced.result.report,
        "docs/control/local/reviews/WO-901/round-1-consistency.md",
      );
      // A table whose rows name no consumer is refused on the helper route.
      const unnamed = await review(
        orderRepository(parent),
        ["--kind", "consistency", "--host", "codex"],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "unnamed-consumer", {
            ...roundOne,
            report: TRACED.replace("docs/README.md", "<path>"),
          }),
        },
      );
      assert.equal(unnamed.result.report, null);
      assert.match(
        unnamed.printed,
        /the worker's report is refused, since the `Traced consumers` table has 1 row without the consumer traced/u,
      );
      const sharedHeader = await review(
        orderRepository(parent),
        ["--kind", "consistency", "--host", "codex"],
        {
          DOTLN_WORKER_FIXTURE: canned(parent, "shared-header", {
            ...roundOne,
            report: SHARED_HEADER,
          }),
        },
      );
      assert.equal(sharedHeader.result.report, null);
      assert.match(
        sharedHeader.printed,
        /refused, since .*each in a column of its own; this report's table names command and result/u,
      );
      // The record route refuses the same reports by the same rule.
      const other = orderRepository(parent);
      const record = (name, text, extra = []) => {
        write(parent, name, text);
        return recordAgentReview(
          other,
          ["--kind", "consistency", ...extra, "--from", join(parent, name)],
          { write: () => {} },
        );
      };
      for (const [name, text, refusal] of [
        [
          "untraced.txt",
          "# Consistency review\n\nEvery write-back agrees.\n",
          /not recorded: a consistency report carries a `Traced consumers` table/u,
        ],
        [
          "no-manifests.txt",
          TRACED.replace(/\| fixture manifests[^\n]*\n/u, ""),
          /has no fixture manifests row/u,
        ],
        [
          "template.txt",
          TRACED.replace("node scripts/meta.mjs --check", "<command>"),
          /1 row without the consumer traced, the command run or its result/u,
        ],
        // A row names the consumer it traced: an empty cell and the brief's
        // placeholder each name none, in every row as in one.
        [
          "no-consumers.txt",
          TRACED.replace(
            /^(\| [^|\n]+ \| )[^|\n]+( \|)/gmu,
            (row, head, tail) =>
              /Changed contract|---/u.test(row) ? row : `${head}${tail}`,
          ),
          /3 rows without the consumer traced, the command run or its result/u,
        ],
        [
          "placeholder-consumer.txt",
          TRACED.replace("scripts/fixtures.json", "<path>"),
          /1 row without the consumer traced/u,
        ],
        // Each required column is read from a header cell of its own: a
        // "Command result" column would otherwise stand for both, leaving the
        // real Command cells unread.
        [
          "shared-header.txt",
          SHARED_HEADER,
          /each in a column of its own; this report's table names command and result in a shared or repeated header cell/u,
        ],
        [
          "empty.txt",
          TRACED.split("| generated pages")[0],
          /the `Traced consumers` table is empty/u,
        ],
        [
          "no-result.txt",
          TRACED.replace("| Result |", "| Outcome |"),
          /has no result column/u,
        ],
      ])
        await assert.rejects(record(name, text), refusal, name);
      // A claimed result may carry its table in its report field, where the
      // returned text holds it with escaped newlines.
      const third = orderRepository(parent);
      write(
        parent,
        "in-field.txt",
        `${JSON.stringify({ ...roundOne, report: `Traced.\n\n${TRACED}` })}\n`,
      );
      const fieldRecord = await recordAgentReview(
        third,
        ["--kind", "consistency", "--from", join(parent, "in-field.txt")],
        { write: () => {} },
      );
      assert.equal(
        JSON.parse(readFileSync(join(third, fieldRecord.record), "utf8"))
          .structured,
        true,
      );
      // A recorded table carries the host, model and effort the recorder
      // attests, never the Claude defaults it did not run.
      const recorded = await record(
        "traced.txt",
        `# Consistency review\n\n${TRACED}`,
        ["--host", "codex", "--model", "gpt-6-astra", "--effort", "max"],
      );
      const json = JSON.parse(
        readFileSync(join(other, recorded.record), "utf8"),
      );
      assert.equal(json.host, "codex");
      assert.equal(json.transport, "codex-spawn-agent");
      assert.deepEqual(json.model, {
        value: "gpt-6-astra",
        source: "recorder-attested",
      });
      assert.deepEqual(json.effort, {
        value: "max",
        source: "recorder-attested",
      });
      assert.deepEqual(json.option, {
        name: "astra",
        selection: "recorder-attested",
      });
      assert.match(
        readFileSync(join(other, recorded.report), "utf8"),
        /model `gpt-6-astra` at effort `max`, as the recorder attests; option astra/u,
      );
      await assert.rejects(
        recordAgentReview(
          other,
          [
            "--kind",
            "design",
            "--host",
            "claude",
            "--model",
            "astra",
            "--from",
            join(parent, "traced.txt"),
          ],
          { write: () => {} },
        ),
        /--model astra is a Codex option, and --host names claude/u,
      );
    });

    await test("record binds the tree a report reviewed: --tree names it, an unknown object is refused, and a report whose tree is no longer the working tree needs the flag", async () => {
      const repo = orderRepository(parent);
      const dry = JSON.parse(
        (
          await review(
            repo,
            ["--kind", "design", "--host", "claude", "--dry-run"],
            {},
          )
        ).printed,
      );
      const tree = dry.reviewedTree;
      assert.ok(
        dry.brief.includes(
          `open your report with the line \`Reviewed tree: ${tree}\``,
        ),
      );
      write(
        parent,
        "named-tree.txt",
        `Reviewed tree: ${tree}\n\nNo findings.\n`,
      );
      const from = ["--from", join(parent, "named-tree.txt")];
      const named = await recordAgentReview(
        repo,
        ["--kind", "design", ...from],
        {
          write: () => {},
        },
      );
      const namedRecord = JSON.parse(
        readFileSync(join(repo, named.record), "utf8"),
      );
      assert.equal(namedRecord.reviewedTree, tree);
      assert.equal(
        namedRecord.reviewedTreeSource,
        "named in the report; the working tree when it was recorded",
      );
      // A later edit: the same report is bound to the tree it judged only
      // when --tree names it.
      write(repo, "src/module.mjs", "export const value = 3;\n");
      await assert.rejects(
        recordAgentReview(repo, ["--kind", "criteria", ...from], {
          write: () => {},
        }),
        new RegExp(
          `the report reviewed tree ${tree}, and the working tree is now [0-9a-f]{40}: name the tree it judged with --tree ${tree}`,
          "u",
        ),
      );
      const bound = await recordAgentReview(
        repo,
        ["--kind", "criteria", "--tree", tree, ...from],
        { write: () => {} },
      );
      const boundRecord = JSON.parse(
        readFileSync(join(repo, bound.record), "utf8"),
      );
      assert.equal(boundRecord.reviewedTree, tree);
      assert.equal(boundRecord.reviewedTreeSource, "named with --tree");
      const unknown = "0".repeat(40);
      await assert.rejects(
        recordAgentReview(
          repo,
          [
            "--kind",
            "combined",
            "--round",
            "3",
            "--since",
            tree,
            "--tree",
            unknown,
            ...from,
          ],
          { write: () => {} },
        ),
        new RegExp(
          `--tree ${unknown} names no commit or tree in this repository`,
          "u",
        ),
      );
    });

    await test("record keeps a prose report holding a JSON example as prose, binds a claimed result after an example and refuses a malformed claimed one", async () => {
      const repo = orderRepository(parent);
      const text =
        '# Criteria review\n\nThe order\'s example reads:\n\n```json\n{"value":2}\n```\n\nNo findings.\n';
      write(parent, "json-example.txt", text);
      let printed = "";
      const prose = await recordAgentReview(
        repo,
        ["--kind", "criteria", "--from", join(parent, "json-example.txt")],
        { write: (line) => (printed += line) },
      );
      assert.match(printed, /recorded the worker's prose report/u);
      const proseRecord = JSON.parse(
        readFileSync(join(repo, prose.record), "utf8"),
      );
      assert.equal(proseRecord.structured, false);
      assert.equal(proseRecord.report, text.trim());
      write(
        parent,
        "example-then-result.txt",
        `An example {"value":2} first.\n\n${JSON.stringify(roundOne)}\n`,
      );
      const structured = await recordAgentReview(
        repo,
        [
          "--kind",
          "design",
          "--from",
          join(parent, "example-then-result.txt"),
          "--format",
          "json",
        ],
        { write: () => {} },
      );
      const structuredRecord = JSON.parse(
        readFileSync(join(repo, structured.record), "utf8"),
      );
      assert.equal(structuredRecord.structured, true);
      assert.equal(structuredRecord.findings.length, 2);
      write(
        parent,
        "malformed-claim.txt",
        'Here:\n\n{"schemaVersion":1,"findings":"none"}\n',
      );
      await assert.rejects(
        recordAgentReview(
          repo,
          [
            "--kind",
            "combined",
            "--round",
            "3",
            "--since",
            git(repo, ["rev-parse", "HEAD^{tree}"]),
            "--from",
            join(parent, "malformed-claim.txt"),
            "--format",
            "json",
          ],
          { write: () => {} },
        ),
        /change review result shape/u,
      );
    });

    await test("record separates prose examples from JSON returns by explicit format, keeps trailing prose results, and refuses undeclared mixed input before writing", async () => {
      const record = async (
        name,
        text,
        kind = "consistency",
        format = "prose",
      ) => {
        const repo = orderRepository(parent);
        write(parent, `${name}.txt`, text);
        let printed = "";
        const recorded = await recordAgentReview(
          repo,
          [
            "--kind",
            kind,
            "--from",
            join(parent, `${name}.txt`),
            ...(format ? ["--format", format] : []),
          ],
          { write: (line) => (printed += line) },
        );
        return {
          ...JSON.parse(readFileSync(join(repo, recorded.record), "utf8")),
          printed,
        };
      };
      const fenced = (value) => `\`\`\`json\n${JSON.stringify(value)}\n\`\`\``;
      const shape = { findings: [], rechecks: [], filesRead: [] };
      const result = { ...roundOne, report: `Read the module.\n\n${TRACED}` };
      // The same bytes can be an example or the actual result. Declaring
      // prose preserves every example, including a valid terminal one with
      // sample findings and a return-shaped object inside a sentence.
      for (const [name, text, kind = "consistency"] of [
        [
          "example-version",
          `The reviewed payload is this JSON example:\n\n${fenced({ schemaVersion: 1, value: 2 })}\n\nThe consumer handles it.\n\n${TRACED}`,
        ],
        [
          "example-findings",
          `The API response example below documents an empty search:\n\n${fenced({ findings: [], total: 0 })}\n\nThe response is an example, not this review result.\n\n${TRACED}`,
        ],
        [
          "example-own-keys",
          `The recorder's malformed control reads:\n\n${fenced({ schemaVersion: 2, findings: [] })}\n\nIt is refused.\n\n${TRACED}`,
        ],
        [
          "example-code-span",
          `The control \`{"schemaVersion":2,"findings":[]}\` stays refused, as does\n\`{"findings":"none"}\`.\n\n${TRACED}`,
        ],
        [
          "example-sentence",
          `A record such as {"schemaVersion":1,"findings":[]} names no tree.\n\n${TRACED}`,
        ],
        [
          "example-foreign-key",
          `The search returns:\n\n{"findings":[],"total":0}\n\nfor an empty query.\n\n${TRACED}`,
        ],
        [
          "example-whole-shape",
          `The refused control reads:\n\n${fenced({ schemaVersion: 2, ...shape, report: "example" })}\n\nIt is refused.\n\n${TRACED}`,
        ],
        [
          "example-valid-shape",
          `A recorded result looks like:\n\n${fenced({ schemaVersion: 1, ...shape, report: "example" })}\n\nThis review found nothing else.\n\n${TRACED}`,
        ],
        [
          "example-with-findings",
          `A recorded result looks like:\n\n${fenced({ ...roundOne, report: "example" })}\n\nThis review found nothing else.\n\n${TRACED}`,
        ],
        [
          "example-at-the-end",
          `# Consistency review\n\n${TRACED}\nA negative-control example the recorder refuses:\n\n${fenced({ schemaVersion: 2, ...shape, report: "example" })}\n`,
        ],
        [
          "example-alone-at-the-end",
          `Here:\n\n${fenced({ schemaVersion: 2, ...shape, report: "example" })}\n`,
          "design",
        ],
        [
          "fenced-then-prose",
          `Here is my review.\n\n${fenced(result)}\n\nThat is all.\n`,
          "design",
        ],
        [
          "inline-result",
          `My result is ${JSON.stringify(result)} and nothing more.\n`,
          "design",
        ],
        [
          "valid-example-at-end",
          `# Consistency review\n\nThis review found no issues.\n\n${TRACED}\nThe following JSON is only a documented example of a review record:\n\n${fenced({ ...roundOne, report: "sample report" })}\n`,
        ],
        [
          "valid-example-with-table-at-end",
          `# Consistency review\n\n${TRACED}\nExample:\n\n${fenced(result)}\n`,
        ],
        [
          "unfenced-example-at-end",
          `# Consistency review\n\n${TRACED}\nExample:\n\n${JSON.stringify(result)}\n`,
        ],
      ]) {
        const prose = await record(name, text, kind);
        assert.equal(prose.structured, false, name);
        assert.deepEqual(prose.findings, [], name);
        assert.equal(prose.report, text.trim(), name);
        assert.equal(prose.inputFormat, "prose", name);
      }
      // Genuine results keep their findings and report-field table when
      // they have a closing sentence, a preface, both or neither.
      for (const [name, text] of [
        [
          "printed-result",
          `Here is my review.\n\n${JSON.stringify(result, null, 2)}\n\nThat is all.\n`,
        ],
        ["fenced-result", `Here is my review.\n\n${fenced(result)}\n`],
        [
          "fenced-trailing-result",
          `Here is my review.\n\n${fenced(result)}\n\nThat is all.\n`,
        ],
        [
          "fenced-trailing-result-crlf",
          `${fenced(result)}\n\nThat is all.\n`.replaceAll("\n", "\r\n"),
        ],
        [
          "inline-result",
          `My result is ${JSON.stringify(result)} and nothing more.\n`,
        ],
      ]) {
        const structured = await record(name, text, "consistency", "json");
        assert.equal(structured.structured, true, name);
        assert.equal(structured.inputFormat, "json", name);
        assert.equal(structured.report, result.report, name);
        assert.deepEqual(
          structured.findings.map((finding) => finding.id),
          ["F1", "F2"],
          name,
        );
        const repo = orderRepository(parent);
        write(parent, "ambiguous-return.txt", text);
        await assert.rejects(
          recordAgentReview(
            repo,
            [
              "--kind",
              "consistency",
              "--from",
              join(parent, "ambiguous-return.txt"),
            ],
            { write: () => {} },
          ),
          /use --format prose.*--format json.*nothing was recorded/u,
          name,
        );
        assert.equal(
          existsSync(join(repo, "docs/control/local/reviews")),
          false,
        );
      }
      // Whole JSON and a whole fence retain the existing no-flag interface.
      for (const [name, text] of [
        ["whole-json", JSON.stringify(result)],
        ["whole-fence", fenced(result)],
      ]) {
        const structured = await record(name, text, "consistency", null);
        assert.equal(structured.structured, true);
        assert.deepEqual(structured.findings, roundOne.findings);
        assert.equal(structured.inputFormat, "auto");
      }
      // A declared malformed result is refused, even when prose could have
      // met the report rules. No search for a different valid object repairs it.
      for (const [name, text] of [
        ["fenced-alone", `${fenced({ schemaVersion: 2, findings: [] })}\n`],
        [
          "block-then-prose",
          `Here:\n\n{"schemaVersion":1,"findings":"none"}\n\nMore after it.\n`,
        ],
      ])
        await assert.rejects(
          record(name, text, "design", "json"),
          /change review result shape/u,
          name,
        );
      for (const [name, text, message] of [
        [
          "empty-json",
          "No JSON result here.",
          /exactly one findings object; found 0/u,
        ],
        [
          "two-results",
          `${fenced(result)}\n\n${fenced(roundOne)}`,
          /exactly one findings object; found 2/u,
        ],
        [
          "invalid-and-valid",
          `${fenced({ schemaVersion: 2, findings: [] })}\n\n${fenced(result)}`,
          /exactly one findings object; found 2/u,
        ],
        [
          "broken-fence",
          `\`\`\`json\n{"schemaVersion":1, "nested":${JSON.stringify(result)},}\n\`\`\``,
          /invalid JSON in the result fence/u,
        ],
        [
          "broken-outer",
          `Here:\n{"schemaVersion":1, "nested":${JSON.stringify(result)},}\n`,
          /invalid JSON object/u,
        ],
      ])
        await assert.rejects(
          record(name, text, "design", "json"),
          message,
          name,
        );
      await assert.rejects(
        record("bad-format", "No findings.", "design", "yaml"),
        /--format is prose or json/u,
      );
      for (const [name, text] of [
        [
          "separate-paragraphs",
          `Literal backtick (\`).\n\n${JSON.stringify(result)}\n\nAnother backtick (\`).\n\n${TRACED}`,
        ],
        [
          "blockquote-fence",
          `> \`\`\`json\n> ${JSON.stringify(result)}\n> \`\`\`\n\n${TRACED}`,
        ],
        [
          "list-fence",
          `- \`\`\`json\n  ${JSON.stringify(result)}\n  \`\`\`\n\n${TRACED}`,
        ],
        [
          "heading-boundary",
          `Literal backtick (\`).\n# New block\n${JSON.stringify(result)}\nClosing backtick (\`).\n\n${TRACED}`,
        ],
        [
          "setext-heading-boundary",
          `Literal backtick (\`).\n---\n${JSON.stringify(result)}\nClosing backtick (\`).\n\n${TRACED}`,
        ],
        [
          "list-item-boundary",
          `- Literal backtick (\`).\n- ${JSON.stringify(result)}\n- Closing backtick (\`).\n\n${TRACED}`,
        ],
        [
          "genuine-same-line-span",
          `My review result is \`${JSON.stringify(result)}\`.\n\n${TRACED}`,
        ],
        [
          "genuine-multiline-span",
          `My review result is \`\n${JSON.stringify(result)}\n\`.\n\n${TRACED}`,
        ],
        [
          "genuine-double-backtick-span",
          `My review result is \`\`\n${JSON.stringify(result)}\n\`\`.\n\n${TRACED}`,
        ],
      ]) {
        await assert.rejects(
          record(name, text, "consistency", null),
          /use --format prose.*--format json/u,
          name,
        );
        const structured = await record(name, text, "consistency", "json");
        assert.deepEqual(structured.findings, result.findings, name);
        const prose = await record(name, text, "consistency", "prose");
        assert.equal(prose.report, text.trim(), name);
        assert.deepEqual(prose.findings, [], name);
      }
    });

    await test("record requires explicit prose for possible-result examples inside same-line and multiline code spans", async () => {
      const payload = '{"schemaVersion":1,"findings":[]}';
      for (const [name, span] of [
        ["same-line", `\`${payload}\``],
        ["multiline-one", `\`\n${payload}\n\``],
        ["multiline-two", `\`\`\n${payload}\n\`\``],
        ["different-run-inside", `\`\`\n\`\n${payload}\n\`\``],
        ["multiline-crlf", `\`\r\n${payload}\r\n\``],
      ]) {
        const repo = orderRepository(parent);
        const text = `An example is ${span}.\n\n${TRACED}`;
        write(parent, `${name}.txt`, text);
        await assert.rejects(
          recordAgentReview(
            repo,
            ["--kind", "consistency", "--from", join(parent, `${name}.txt`)],
            { write: () => {} },
          ),
          /use --format prose.*--format json/u,
          name,
        );
        const saved = await recordAgentReview(
          repo,
          [
            "--kind",
            "consistency",
            "--from",
            join(parent, `${name}.txt`),
            "--format",
            "prose",
          ],
          { write: () => {} },
        );
        const record = JSON.parse(
          readFileSync(join(repo, saved.record), "utf8"),
        );
        assert.equal(record.structured, false, name);
        assert.equal(record.report, text.trim(), name);
        assert.deepEqual(record.findings, [], name);
      }
    });

    await test("required report tables exclude code examples on both routes and a quoted table cannot shadow the real section", async () => {
      const items =
        "## Items\n\n| Item | Location in the subject | Disposition |\n| --- | --- | --- |\n| 1 | docs/planning/fixture-pass.md | reviewed |\n";
      const wrappers = [
        (table) => `\`\`\`markdown\n${table}\n\`\`\``,
        (table) => `~~~~markdown\n${table}\n~~~~`,
        (table) => `\`\`\`\`markdown\n\`\`\`\n${table}\n\`\`\`\``,
        (table) => `\`\`\`markdown\n- \`\`\`\n${table}\n\`\`\``,
        (table) =>
          `- \`\`\`markdown\n${table
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n")}\n  \`\`\``,
        (table) =>
          table
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n"),
        (table) => `<!--\n${table}\n-->`,
        (table) => `<pre>\n${table}\n</pre>`,
        (table) =>
          table
            .split("\n")
            .map((line) => `    ${line}`)
            .join("\n"),
      ];
      write(
        parent,
        "table-context-capture.txt",
        "1. Review this synthetic pass.\n",
      );
      for (const [kind, table] of [
        ["consistency", TRACED],
        ["criteria", items],
      ]) {
        for (const [number, wrap] of wrappers.entries()) {
          for (const route of ["record", "helper"]) {
            const repo =
              kind === "criteria"
                ? planningRepository(parent, "planning/2030-01-02-context")
                : orderRepository(parent);
            const args = [
              "--kind",
              kind,
              ...(kind === "criteria"
                ? [
                    "--subject",
                    "planning",
                    "--capture",
                    join(parent, "table-context-capture.txt"),
                  ]
                : []),
            ];
            const example = `This is only an example; no report table was supplied.\n\n${wrap(table)}\n`;
            const name = `${kind}-${number}-${route}`;
            if (route === "record") {
              write(parent, `${name}.txt`, example);
              await assert.rejects(
                recordAgentReview(
                  repo,
                  [
                    ...args,
                    "--format",
                    "prose",
                    "--from",
                    join(parent, `${name}.txt`),
                  ],
                  { write: () => {} },
                ),
                /this report has none/u,
                name,
              );
              write(parent, `${name}.txt`, `${example}\n${table}`);
              const saved = await recordAgentReview(
                repo,
                [
                  ...args,
                  "--format",
                  "prose",
                  "--from",
                  join(parent, `${name}.txt`),
                ],
                { write: () => {} },
              );
              assert.ok(saved.report, name);
            } else {
              const absent = await review(repo, [...args, "--host", "codex"], {
                DOTLN_WORKER_FIXTURE: canned(parent, name, {
                  ...roundOne,
                  report: example,
                }),
              });
              assert.equal(absent.result.report, null, name);
              assert.match(absent.printed, /this report has none/u, name);
              const present = await review(repo, [...args, "--host", "codex"], {
                DOTLN_WORKER_FIXTURE: canned(parent, name, {
                  ...roundOne,
                  report: `${example}\n${table}`,
                }),
              });
              assert.ok(present.result.report, name);
            }
          }
        }
      }
    });

    await test("a planning criteria review carries the operator's dispatch to the worker, requires an Items table and records only the dispatch's digest, the base and the report it answered", async () => {
      const repo = planningRepository(parent, "planning/2030-01-04-capture");
      const capturePath = join(parent, "dispatch-capture.md");
      const captureText =
        "# Dispatch\n\n1. Key the lane by branch.\n2. Read the whole change at the recheck.\n3. DISPATCH-SENTINEL have the adversary read this.\n12. Fix the lane bug\n";
      write(parent, "dispatch-capture.md", captureText);
      const planning = [
        "--kind",
        "criteria",
        "--host",
        "claude",
        "--subject",
        "planning",
        "--capture",
        capturePath,
      ];
      const dry = JSON.parse(
        (await review(repo, [...planning, "--dry-run"], {})).printed,
      );
      assert.ok(dry.brief.endsWith(captureText));
      assert.ok(
        dry.brief.includes(
          `\n## The operator's dispatch\n\ndispatch-capture.md, ${Buffer.byteLength(captureText)} bytes, sha256 ${sha256(captureText)}:\n\n${captureText}`,
        ),
      );
      assert.ok(
        dry.brief.includes("| Item | Location in the subject | Disposition |"),
      );
      await assert.rejects(
        review(
          repo,
          [
            "--kind",
            "design",
            "--host",
            "claude",
            "--subject",
            "planning",
            "--capture",
            capturePath,
            "--dry-run",
          ],
          {},
        ),
        /--capture carries the operator's dispatch to a planning subject's criteria review/u,
      );
      const items = (rows) =>
        [
          "## Items",
          "",
          "| Item | Location in the subject | Disposition |",
          "| --- | --- | --- |",
          ...rows,
          "",
        ].join("\n");
      const answered = items([
        "| 1 | docs/planning/fixture-pass.md | acted on |",
        "| 2 | WO-901 criterion 2 | reviewed |",
      ]);
      // The helper route: a report without the table is refused; one with it
      // is recorded, and the dispatch's bytes reach no record.
      const missing = await review(repo, planning, {
        DOTLN_WORKER_FIXTURE: canned(parent, "uncovered", roundOne),
      });
      assert.equal(missing.result.report, null);
      assert.match(missing.printed, /answers it in an `## Items` table/u);
      // A row acted on or reviewed names its location, and every row its item.
      const unplaced = await review(repo, planning, {
        DOTLN_WORKER_FIXTURE: canned(parent, "unplaced", {
          ...roundOne,
          report: items(["| 1 |  | acted on |"]),
        }),
      });
      assert.equal(unplaced.result.report, null);
      assert.match(
        unplaced.printed,
        /refused, since the `## Items` table has 1 acted-on or reviewed row without the item's location in the subject/u,
      );
      // Every string the record keeps from the return passes the omission:
      // a finding's file and basis and a path read, beside its summary.
      const quoted = "DISPATCH-SENTINEL have the adversary read this";
      const launched = await review(repo, planning, {
        DOTLN_WORKER_FIXTURE: canned(parent, "covered", {
          ...roundOne,
          findings: [
            {
              ...roundOne.findings[0],
              basis: { criterion: `item 3, ${quoted}` },
            },
            {
              ...roundOne.findings[1],
              file: `notes/${quoted}.md`,
              basis: { regression: `main had ${quoted}` },
            },
          ],
          filesRead: [...roundOne.filesRead, `notes/${quoted}.md`],
          report: `Read the pass.\n\n${answered}`,
        }),
      });
      assert.match(
        launched.printed,
        /DotLn advisory: the Items table names no row for the dispatch's numbered items 3, 12\./u,
      );
      const recordText = readFileSync(
        join(repo, launched.result.record),
        "utf8",
      );
      const record = JSON.parse(recordText);
      assert.deepEqual(record.captures, [
        { sha256: sha256(captureText), bytes: Buffer.byteLength(captureText) },
      ]);
      assert.equal(record.since, git(repo, ["merge-base", "HEAD", "main"]));
      assert.equal(record.briefSha256, dry.briefSha256);
      assert.ok(
        !`${recordText}${readFileSync(join(repo, launched.result.report), "utf8")}`.includes(
          "DISPATCH-SENTINEL",
        ),
        "no record keeps the dispatch's words",
      );
      // The record route: the same refusals, and a recheck names the report
      // it answered by its record's digest.
      const recordWith = (name, text, extra = []) => {
        write(parent, name, text);
        return recordAgentReview(
          repo,
          [
            "--kind",
            "criteria",
            "--subject",
            "planning",
            "--capture",
            capturePath,
            ...extra,
            "--from",
            join(parent, name),
          ],
          { write: () => {} },
        );
      };
      const recheck = ["--recheck", launched.result.report];
      await assert.rejects(
        recordWith(
          "no-items.txt",
          "# Criteria recheck\n\nNo findings.\n",
          recheck,
        ),
        /not recorded: a criteria review given the operator's dispatch answers it in an `## Items` table/u,
      );
      await assert.rejects(
        recordWith(
          "bad-items.txt",
          items(["| 1 | docs/planning/fixture-pass.md | skipped |"]),
          recheck,
        ),
        /disposition is one of acted on, reviewed, missing; 1 row names another/u,
      );
      for (const [name, row, refusal] of [
        [
          "unplaced-items.txt",
          "| 2 | — | reviewed |",
          /1 acted-on or reviewed row without the item's location in the subject/u,
        ],
        [
          "placeholder-items.txt",
          "| 2 | <document and section, or order and step> | acted on |",
          /1 acted-on or reviewed row without the item's location/u,
        ],
        [
          "unnamed-items.txt",
          "|  | docs/planning/fixture-pass.md | reviewed |",
          /the `## Items` table has 1 row that names no item/u,
        ],
      ])
        await assert.rejects(
          recordWith(name, items([row]), recheck),
          refusal,
          name,
        );
      // An Items header cell that names two columns reads neither.
      const sharedItems =
        "## Items\n\n| Item location | Where | Disposition |\n| --- | --- | --- |\n| 1 | docs/planning/fixture-pass.md | acted on |\n";
      await assert.rejects(
        recordWith("shared-items-header.txt", sharedItems, recheck),
        /each in a column of its own; this report's table names item and location in a shared or repeated header cell/u,
      );
      const sharedLaunch = await review(repo, [...planning, ...recheck], {
        DOTLN_WORKER_FIXTURE: canned(parent, "shared-items", {
          ...roundOne,
          report: sharedItems,
        }),
      });
      assert.equal(sharedLaunch.result.report, null);
      assert.match(
        sharedLaunch.printed,
        /refused, since .*names item and location in a shared or repeated header cell/u,
      );
      const rechecked = await recordWith(
        "items-recheck.txt",
        `# Criteria recheck\n\n${items(["| 1 | docs/planning/fixture-pass.md | acted on |", "| 2 | WO-901 | reviewed |", "| 3 | — | missing |"])}`,
        recheck,
      );
      const recheckText = readFileSync(join(repo, rechecked.record), "utf8");
      const recheckRecord = JSON.parse(recheckText);
      assert.deepEqual(recheckRecord.answered, [
        { path: launched.result.record, recordSha256: sha256(recordText) },
      ]);
      assert.deepEqual(recheckRecord.captures, record.captures);
      assert.equal(recheckRecord.since, record.since);
      assert.ok(!recheckText.includes("DISPATCH-SENTINEL"));
      // A report that quotes the dispatch keeps none of its words, however
      // it quotes them: in prose without the item's marker or full stop, and
      // inside its findings object's report field, where JSON escapes the
      // quotation marks. Each passage is replaced and counted once.
      const quotingReport = `Item 3: "DISPATCH-SENTINEL have the adversary read this."\n\n${items(["| 3 | WO-901 | reviewed |"])}`;
      write(
        parent,
        "quoting.txt",
        `The dispatch asks that DISPATCH-SENTINEL have the adversary read this, for item 3, and item 1 says to Key the lane by branch, and it ends with 12. Fix the lane bug as written.\n\n${JSON.stringify({ schemaVersion: 1, findings: [], rechecks: [], filesRead: [], report: quotingReport })}\n`,
      );
      let printed = "";
      const quoting = await recordAgentReview(
        repo,
        [
          "--kind",
          "criteria",
          "--subject",
          "planning",
          "--capture",
          capturePath,
          "--round",
          "3",
          "--recheck",
          rechecked.report,
          "--from",
          join(parent, "quoting.txt"),
          "--format",
          "json",
        ],
        { write: (line) => (printed += line) },
      );
      assert.match(
        printed,
        /DotLn advisory: 4 quoted passages of the operator's dispatch were omitted from the record\./u,
      );
      const quotingText = `${readFileSync(join(repo, quoting.record), "utf8")}${readFileSync(join(repo, quoting.report), "utf8")}`;
      assert.ok(!/DISPATCH-SENTINEL/iu.test(quotingText));
      // A short item quoted without its number is the item's whole text,
      // and one quoted with its number is caught as well.
      assert.ok(!/key the lane by branch/iu.test(quotingText));
      assert.ok(!/fix the lane bug/iu.test(quotingText));
      assert.ok(quotingText.includes("[the operator's words, omitted]"));
      // The record route omits the same strings from a structured return.
      write(
        parent,
        "basis-quoting.txt",
        `${JSON.stringify({
          schemaVersion: 1,
          findings: [
            {
              id: "F1",
              severity: "note",
              summary: "The pass names item 3.",
              file: `notes/${quoted}.md`,
              line: null,
              basis: { criterion: `item 3, ${quoted}` },
            },
          ],
          rechecks: [],
          filesRead: [`notes/${quoted}.md`],
          report: items(["| 3 | WO-901 | reviewed |"]),
        })}\n`,
      );
      const basisQuoting = await recordAgentReview(
        repo,
        [
          "--kind",
          "criteria",
          "--subject",
          "planning",
          "--capture",
          capturePath,
          "--round",
          "4",
          "--recheck",
          quoting.report,
          "--from",
          join(parent, "basis-quoting.txt"),
        ],
        { write: () => {} },
      );
      const basisRecord = readFileSync(join(repo, basisQuoting.record), "utf8");
      assert.ok(
        !/DISPATCH-SENTINEL/iu.test(
          `${basisRecord}${readFileSync(join(repo, basisQuoting.report), "utf8")}`,
        ),
      );
      assert.deepEqual(JSON.parse(basisRecord).findings[0].basis, {
        criterion: "item 3, [the operator's words, omitted]",
      });
    });

    await test("a record keeps the words the brief's own report rules gave the worker where a capture repeats them, and refuses a report whose table the omission would break, on both routes", async () => {
      const repo = planningRepository(parent, "planning/2030-01-05-rules");
      const capturePath = join(parent, "header-capture.md");
      write(
        parent,
        "header-capture.md",
        "# Dispatch\n\n1. Answer each item in this table:\n\n| Item | Location in the subject | Disposition |\n\n2. Key the lane by branch.\n",
      );
      const header = "| Item | Location in the subject | Disposition |";
      const table = (rows) =>
        ["## Items", "", header, "| --- | --- | --- |", ...rows, ""].join("\n");
      const answered = table([
        "| 1 | docs/planning/fixture-pass.md | acted on |",
        "| 2 | WO-901 | reviewed |",
      ]);
      const planning = [
        "--kind",
        "criteria",
        "--host",
        "claude",
        "--subject",
        "planning",
        "--capture",
        capturePath,
      ];
      const launched = await review(repo, planning, {
        DOTLN_WORKER_FIXTURE: canned(parent, "rules-table", {
          ...roundOne,
          report: answered,
        }),
      });
      assert.ok(
        readFileSync(join(repo, launched.result.report), "utf8").includes(
          header,
        ),
      );
      const record = (name, text, extra) => {
        write(parent, name, text);
        return recordAgentReview(
          repo,
          [
            "--kind",
            "criteria",
            "--subject",
            "planning",
            "--capture",
            capturePath,
            ...extra,
            "--from",
            join(parent, name),
          ],
          { write: () => {} },
        );
      };
      const recorded = await record(
        "rules-record.txt",
        `Read the pass.\n\n${answered}`,
        ["--recheck", launched.result.report],
      );
      assert.ok(
        JSON.parse(
          readFileSync(join(repo, recorded.record), "utf8"),
        ).report.includes(header),
      );
      // A row that quotes the dispatch across its cells meets the rules as
      // returned, and its omission would leave a row without a disposition.
      const split = table(["| 2 Key the | lane by branch | acted on |"]);
      const later = ["--round", "3", "--recheck", recorded.report];
      await assert.rejects(
        record("split-quote.txt", split, later),
        /not recorded: with the operator's quoted words omitted, the `## Items` table's disposition is one of acted on, reviewed, missing/u,
      );
      const launchedSplit = await review(repo, [...planning, ...later], {
        DOTLN_WORKER_FIXTURE: canned(parent, "split-quote", {
          ...roundOne,
          report: split,
        }),
      });
      assert.equal(launchedSplit.result.report, null);
      assert.match(
        launchedSplit.printed,
        /refused, since with the operator's quoted words omitted, the `## Items` table's disposition/u,
      );
    });

    await test("a registered target's order is reviewed on the target's base and candidate, read-only in the target, counted once and reported in the launchpad's lane", async () => {
      const launchpad = orderRepository(parent);
      const target = realpathSync(createFixtureRoot(join(parent, "target-")));
      git(target, ["init", "--quiet", "-b", "main"]);
      excludeFixtureOwnership(target);
      for (const [key, value] of [
        ["user.email", "fixture@example.invalid"],
        ["user.name", "Fixture"],
        ["commit.gpgsign", "false"],
      ])
        git(target, ["config", key, value]);
      write(target, "lib/service.mjs", "export const service = 1;\n");
      commit(target, "target base");
      const baseCommit = git(target, ["rev-parse", "HEAD"]);
      git(target, ["switch", "--quiet", "-c", "wo-901"]);
      write(target, "lib/service.mjs", "export const service = 2;\n");
      write(target, "lib/added.mjs", "export const added = true;\n");
      write(
        launchpad,
        "docs/control/orders/WO-901.jsonl",
        `${JSON.stringify({
          type: "WorkOrderActivated",
          workOrderId: "WO-901",
          workOrderPath: "docs/work-orders/WO-901-fixture-order.md",
          repositoryId: "service",
          baseCommit,
        })}\n`,
      );
      // The launchpad registers the target repository, as worktree start
      // requires and the binding the close shares checks.
      write(
        launchpad,
        "dotln.config.json",
        prettyJson({
          version: 1,
          classes: { fixture: { checks: [], supports: [] } },
          repositories: {
            service: {
              baseBranch: "main",
              worktreeParent: "../targets",
              repositoryClass: "fixture",
              authorityProfile: {
                authorityEnvelopeId: "fixture.target",
                allowedEffects: ["repo.read", "repo.test"],
                deniedEffects: ["repo.push"],
                resourceLimits: {},
                requiredEvidence: [],
                expiresAt: Number.MAX_SAFE_INTEGER,
                revocationEventTypes: [],
              },
            },
          },
        }),
      );
      write(
        launchpad,
        "docs/control/local/target-worktrees.json",
        prettyJson({
          [target]: {
            target,
            launchpad,
            workOrderId: "WO-901",
            repositoryId: "service",
            baseCommit,
            branch: "wo-901",
          },
        }),
      );
      const args = [
        "--kind",
        "criteria",
        "--host",
        "claude",
        "--target",
        "service",
        "--order",
        "WO-901",
      ];
      // The target's own file monitor never runs for a review: the helper
      // reads the target with the host's safe Git options.
      const marker = join(parent, "fsmonitor-ran");
      write(parent, "fsmonitor.sh", `#!/bin/sh\ntouch "${marker}"\n`);
      chmodSync(join(parent, "fsmonitor.sh"), 0o755);
      git(target, ["config", "core.fsmonitor", join(parent, "fsmonitor.sh")]);
      const dry = JSON.parse(
        (await review(launchpad, [...args, "--dry-run"], {})).printed,
      );
      assert.ok(!existsSync(marker), "the target's file monitor did not run");
      git(target, ["config", "--unset", "core.fsmonitor"]);
      assert.equal(dry.since, baseCommit);
      assert.equal(dry.reviewedTree, workingTree(target));
      assert.equal(git(target, ["cat-file", "-t", dry.reviewedTree]), "tree");
      const stat = dry.brief.split("The stat is:")[1].split("\n## ")[0];
      for (const path of ["lib/service.mjs", "lib/added.mjs"])
        assert.ok(stat.includes(path), path);
      assert.ok(
        !stat.includes("src/module.mjs"),
        "the launchpad's change is not reviewed",
      );
      assert.ok(dry.brief.includes(`The checkout is ${target}.`));
      assert.ok(dry.brief.includes("registered target service"));
      assert.ok(dry.brief.includes(ORDER.trim()));
      const session = "fixture-target-thread";
      const harness = join(launchpad, "docs/control/local/harness");
      assert.equal(initializeSubagentCounter(harness, session), null);
      const before = git(target, ["status", "--porcelain"]);
      const { result } = await review(launchpad, args, {
        DOTLN_WORKER_FIXTURE: canned(parent, "target", roundOne),
        CODEX_THREAD_ID: session,
      });
      assert.equal(
        result.report,
        "docs/control/local/reviews/WO-901/round-1-criteria.md",
      );
      const record = JSON.parse(
        readFileSync(join(launchpad, result.record), "utf8"),
      );
      assert.deepEqual(record.target, {
        repositoryId: "service",
        worktree: target,
        baseCommit,
      });
      assert.equal(record.since, baseCommit);
      assert.equal(record.branch, "wo-901");
      assert.equal(record.checkout.unchanged, true);
      assert.equal(git(target, ["status", "--porcelain"]), before);
      assert.equal(subagentUsage(launchpad, harness, session).count, 1);
      assert.match(
        readFileSync(join(launchpad, result.report), "utf8"),
        /^- Target: service, worktree `.*`, activation base `[0-9a-f]{40}`\.$/mu,
      );
      // The hook charges the literal command one use.
      const { kitWorkerLaunch } =
        await import("../packages/skeleton/dist/src/harness-host.js");
      assert.deepEqual(
        kitWorkerLaunch(`npm run worker -- review ${args.join(" ")}`),
        { uses: 1, host: "claude" },
      );
      await assert.rejects(
        review(
          launchpad,
          [
            ...args.slice(0, 4),
            "--target",
            "other",
            "--order",
            "WO-901",
            "--dry-run",
          ],
          {},
        ),
        /WO-901 is activated for target service, not other/u,
      );
      await assert.rejects(
        review(launchpad, [...args.slice(0, 6), "--dry-run"], {}),
        /--target binds a registered target's order: name it with --order WO-NNN/u,
      );
      // A repository the launchpad no longer registers binds nothing, as for
      // the close and target publication.
      write(
        launchpad,
        "dotln.config.json",
        prettyJson({
          version: 1,
          classes: { fixture: { checks: [], supports: [] } },
          repositories: {},
        }),
      );
      await assert.rejects(
        review(launchpad, [...args, "--dry-run"], {}),
        /target registry repository, base or branch differs from the activated order/u,
      );
    });

    await test("each launch runs one of the operator's four options: the host's default, the one --model names or the dispatch line's, and a cross-host option is refused naming the host's", async () => {
      const repo = planningRepository(parent, "planning/2030-01-05-models");
      const launch = async (args, env = {}) => {
        const dry = JSON.parse(
          (
            await review(
              repo,
              [
                "--kind",
                "design",
                "--subject",
                "planning",
                ...args,
                "--dry-run",
              ],
              env,
            )
          ).printed,
        );
        const at = (flag) => dry.argv[dry.argv.indexOf(flag) + 1];
        return {
          model: at("--model"),
          effort: dry.argv.includes("--effort")
            ? at("--effort")
            : dry.argv.find((arg) => arg.startsWith("model_reasoning_effort=")),
          option: dry.option,
        };
      };
      assert.deepEqual(await launch(["--host", "codex"]), {
        model: "gpt-6.1-sol",
        effort: 'model_reasoning_effort="max"',
        option: { name: "sol", selection: "host-default" },
      });
      assert.deepEqual(await launch(["--host", "codex", "--model", "astra"]), {
        model: "gpt-6-astra",
        effort: 'model_reasoning_effort="max"',
        option: { name: "astra", selection: "model-flag" },
      });
      assert.deepEqual(await launch(["--host", "claude"]), {
        model: "claude-opus-5-5",
        effort: "xhigh",
        option: { name: "opus", selection: "host-default" },
      });
      assert.deepEqual(await launch(["--host", "claude", "--model", "fable"]), {
        model: "claude-fable-5-1",
        effort: "xhigh",
        option: { name: "fable", selection: "model-flag" },
      });
      await assert.rejects(
        launch(["--host", "codex", "--model", "fable"]),
        /--model fable is a Claude option; a Codex launch takes sol or astra/u,
      );
      await assert.rejects(
        launch(["--host", "claude", "--model", "astra"]),
        /--model astra is a Codex option; a Claude launch takes opus or fable/u,
      );
      await assert.rejects(
        launch(["--host", "claude", "--model", "gpt-5"]),
        /--model gpt-5 is not one of the operator's four worker options: opus \(claude-opus-5-5 at xhigh\), fable \(claude-fable-5-1 at xhigh\), sol \(gpt-6.1-sol at max\), astra \(gpt-6-astra at max\)/u,
      );
      // The session's latest dispatch line selects its host's non-default
      // when no --model is named, and one that names none returns to the
      // defaults; a named --model always wins.
      const session = "fixture-dispatch-session";
      const journal = `docs/control/local/harness/${sha256(session)}.jsonl`;
      const selected = (options) =>
        `${JSON.stringify({ typedEvent: "WorkerOptionsSelected", options, source: "claude-prompt-hook" })}\n`;
      write(repo, journal, selected({ codex: "astra" }));
      const env = { CLAUDE_CODE_SESSION_ID: session };
      assert.deepEqual((await launch(["--host", "codex"], env)).option, {
        name: "astra",
        selection: "dispatch-word",
      });
      assert.equal(
        (await launch(["--host", "codex"], env)).model,
        "gpt-6-astra",
      );
      assert.equal(
        (await launch(["--host", "claude"], env)).model,
        "claude-opus-5-5",
      );
      assert.equal(
        (await launch(["--host", "codex", "--model", "sol"], env)).model,
        "gpt-6.1-sol",
      );
      appendFileSync(join(repo, journal), selected({}));
      assert.deepEqual((await launch(["--host", "codex"], env)).option, {
        name: "sol",
        selection: "host-default",
      });
    });

    await test("record reads the tree a structured report's field names, ignores a tree line quoted later, and records the body whose table passed", async () => {
      const repo = orderRepository(parent);
      const dry = JSON.parse(
        (
          await review(
            repo,
            ["--kind", "design", "--host", "claude", "--dry-run"],
            {},
          )
        ).printed,
      );
      const tree = dry.reviewedTree;
      write(repo, "src/module.mjs", "export const value = 4;\n");
      // The closed object alone, its report opening with the tree line.
      write(
        parent,
        "json-tree.txt",
        `${JSON.stringify({ ...roundOne, report: `Reviewed tree: ${tree}\n\nRead the order.` })}\n`,
      );
      await assert.rejects(
        recordAgentReview(
          repo,
          ["--kind", "design", "--from", join(parent, "json-tree.txt")],
          { write: () => {} },
        ),
        new RegExp(
          `the report reviewed tree ${tree}, and the working tree is now`,
          "u",
        ),
      );
      // A tree line quoted further down names nothing.
      write(
        parent,
        "quoted-tree.txt",
        `# Criteria review\n\nThe earlier report said:\n\n- Reviewed tree: ${tree}\n\nNo findings.\n`,
      );
      const quoted = await recordAgentReview(
        repo,
        ["--kind", "criteria", "--from", join(parent, "quoted-tree.txt")],
        { write: () => {} },
      );
      const quotedRecord = JSON.parse(
        readFileSync(join(repo, quoted.record), "utf8"),
      );
      assert.notEqual(quotedRecord.reviewedTree, tree);
      assert.equal(
        quotedRecord.reviewedTreeSource,
        "the working tree when it was recorded",
      );
      // The prose carries the table and the field only a summary: the prose,
      // without the claimed object, is the report recorded.
      write(
        parent,
        "prose-table.txt",
        `Reviewed tree: ${quotedRecord.reviewedTree}\n\n${TRACED}\n${JSON.stringify({ ...roundOne, report: "One line." })}\n`,
      );
      const table = await recordAgentReview(
        repo,
        [
          "--kind",
          "consistency",
          "--from",
          join(parent, "prose-table.txt"),
          "--format",
          "json",
        ],
        { write: () => {} },
      );
      const tableRecord = JSON.parse(
        readFileSync(join(repo, table.record), "utf8"),
      );
      assert.ok(tableRecord.report.includes("## Traced consumers"));
      assert.ok(!tableRecord.report.includes('"schemaVersion"'));
      assert.match(
        readFileSync(join(repo, table.report), "utf8"),
        /## Traced consumers/u,
      );
    });

    await test("a combined round named by --since alone is the ladder's last round, and a fresh round 1 over the tree its lane last reviewed is named a re-roll", async () => {
      const repo = orderRepository(parent);
      const env = { DOTLN_WORKER_FIXTURE: canned(parent, "reroll", roundOne) };
      const first = await review(
        repo,
        ["--kind", "design", "--host", "codex"],
        env,
      );
      const reviewed = JSON.parse(
        readFileSync(join(repo, first.result.record), "utf8"),
      ).reviewedTree;
      const combined = await review(
        repo,
        ["--kind", "combined", "--host", "codex", "--since", reviewed],
        env,
      );
      assert.equal(
        combined.result.report,
        "docs/control/local/reviews/WO-901/round-3-combined.md",
      );
      const reroll = await review(
        repo,
        ["--kind", "criteria", "--host", "codex", "--since", reviewed],
        env,
      );
      assert.equal(
        reroll.result.report,
        `docs/control/local/reviews/WO-901/since-${reviewed.slice(0, 12)}/round-1-criteria.md`,
      );
      assert.match(
        reroll.printed,
        /DotLn advisory: this fresh round 1 reviews tree [0-9a-f]{40}, which docs\/control\/local\/reviews\/WO-901\/round-3-combined\.json already reviewed; nothing in it is newer than that review\./u,
      );
    });

    await test("a Traced consumers cell of a dash or a word for nothing done says nothing, while none is a result", async () => {
      const repo = orderRepository(parent);
      const record = (name, text) => {
        write(parent, name, text);
        return recordAgentReview(
          repo,
          ["--kind", "consistency", "--from", join(parent, name)],
          { write: () => {} },
        );
      };
      for (const [name, row] of [
        ["dash.txt", "| generated pages | - | - | - |"],
        ["not-run.txt", "| generated pages | docs/README.md | not run | n/a |"],
        [
          "none-command.txt",
          "| generated pages | docs/README.md | none | current |",
        ],
      ])
        await assert.rejects(
          record(
            name,
            TRACED.replace(
              "| generated pages | docs/README.md | node scripts/meta.mjs --check | current |",
              row,
            ),
          ),
          /without the consumer traced, the command run or its result/u,
          name,
        );
      const none = await record(
        "none-result.txt",
        TRACED.replace("| no pin names the module |", "| none |"),
      );
      assert.ok(none.record);
    });

    await test("every planning branch names a lane of its own that decodes back to it, so passes whose names differ only in escaped characters each run their round 1, and a name too long for a directory is refused before any worker starts", async () => {
      const lanes = "docs/control/local/reviews";
      const planning = [
        "--kind",
        "criteria",
        "--host",
        "claude",
        "--subject",
        "planning",
      ];
      const env = {
        DOTLN_WORKER_FIXTURE: canned(parent, "lane-escape", roundOne),
      };
      const repo = planningRepository(parent, "planning/2030-01-02/recheck");
      // One date's passes: a nested name and the literal name an earlier
      // digest rule gave it the same lane as, then names that rule read as
      // hyphens too: a percent sign spelling the nested name's own escape, a
      // plus sign and the hyphen itself.
      const passes = [
        ["planning/2030-01-02/recheck", "planning-2030-01-02%2Frecheck"],
        [
          "planning/2030-01-02-recheck-5cd9ca9c",
          "planning-2030-01-02-recheck-5cd9ca9c",
        ],
        ["planning/2030-01-02%2Frecheck", "planning-2030-01-02%252Frecheck"],
        ["planning/2030-01-02+recheck", "planning-2030-01-02%2Brecheck"],
        ["planning/2030-01-02-recheck", "planning-2030-01-02-recheck"],
      ];
      for (const [index, [branch, lane]] of passes.entries()) {
        if (index) {
          git(repo, ["switch", "--quiet", "main"]);
          git(repo, ["switch", "--quiet", "-c", branch]);
          write(repo, `docs/planning/pass-${index}.md`, `# Pass ${index}\n`);
          commit(repo, `pass ${index}`);
        }
        const report = `${lanes}/${lane}/round-1-criteria.md`;
        const dry = JSON.parse(
          (await review(repo, [...planning, "--dry-run"], {})).printed,
        );
        assert.equal(dry.report, report, branch);
        const run = await review(repo, planning, env);
        assert.equal(run.result.report, report, branch);
        assert.equal(
          JSON.parse(readFileSync(join(repo, run.result.record), "utf8"))
            .branch,
          branch,
        );
      }
      // The rule over names no fixture branch takes: each lane is distinct
      // and decodes back to its branch, and a name of letters, digits, dots,
      // underscores and hyphens alone keeps its spelling.
      const names = [
        "planning/a/b",
        "planning/a-b",
        "planning/a_b",
        "planning/a.b",
        "planning/a+b",
        "planning/a%2Fb",
        "planning/a%252Fb",
        "planning/a/-b",
        "planning/2030-01-02/café",
        "planning/2030-01-02-café",
        "planning/2030-01-02-cafe",
      ];
      const named = names.map((branch) =>
        reviewsLane(repo, "planning", { branch }).replace(`${lanes}/`, ""),
      );
      assert.equal(new Set(named).size, names.length, named.join(" "));
      named.forEach((lane, index) => {
        assert.match(lane, /^planning-[A-Za-z0-9._%-]+$/u);
        assert.equal(
          decodeURIComponent(lane.slice("planning-".length)),
          names[index].slice("planning/".length),
        );
      });
      assert.equal(named[1], "planning-a-b");
      // A lane is one directory name: 255 bytes is admitted, one more is
      // refused, and the helper refuses before it renders or launches.
      const longest = `planning/${"z".repeat(255 - "planning-".length)}`;
      assert.equal(
        reviewsLane(repo, "planning", { branch: longest }),
        `${lanes}/planning-${"z".repeat(246)}`,
      );
      assert.throws(
        () => reviewsLane(repo, "planning", { branch: `${longest}z` }),
        /names a reviews lane of 256 bytes, longer than the 255 a directory name holds/u,
      );
      git(repo, ["switch", "--quiet", "main"]);
      git(repo, [
        "switch",
        "--quiet",
        "-c",
        `planning/${"x".repeat(120)}/${"y".repeat(140)}`,
      ]);
      write(repo, "docs/planning/long-pass.md", "# Long pass\n");
      commit(repo, "long pass");
      await assert.rejects(
        review(repo, [...planning, "--dry-run"], {}),
        /names a reviews lane of 272 bytes/u,
      );
      await assert.rejects(
        review(repo, planning, env),
        /names a reviews lane of 272 bytes/u,
      );
      assert.equal(
        existsSync(join(repo, lanes, `planning-${"x".repeat(120)}`)),
        false,
      );
    });
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
}

if (isMainModule(import.meta.url)) await reviewWorkerFixtures();
