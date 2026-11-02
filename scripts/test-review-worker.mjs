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
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordAgentReview, runChangeReview } from "./lib/review-worker.mjs";
import { reviewerBriefs } from "../packages/skeleton/dist/src/loadouts/contributor.js";
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
      assert.equal(secondRecord.since, firstRecord.reviewedTree);
      assert.notEqual(secondRecord.reviewedTree, firstRecord.reviewedTree);
      assert.deepEqual(secondRecord.priorFindingIds, [
        "criteria.1.F1",
        "criteria.1.F2",
      ]);
      assert.match(secondRecord.brief, /This is round 2, a recheck/u);
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
      assert.match(record.brief, /This is the last round/u);
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

    await test("a planning subject reviews the branch's planning document and changed orders into the day's planning lane", async () => {
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
        "docs/control/local/reviews/planning-2030-01-02/round-1-criteria.md",
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
        `Here is my review.\n\n${JSON.stringify(roundOne)}\n`,
      );
      const recorded = await recordAgentReview(
        repo,
        ["--kind", "consistency", "--from", returned, "--tokens", "1234"],
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
        recordAgentReview(repo, ["--kind", "consistency", "--from", returned], {
          write: () => {},
        }),
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
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
}

if (isMainModule(import.meta.url)) await reviewWorkerFixtures();
