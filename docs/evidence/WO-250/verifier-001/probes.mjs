import assert from "node:assert/strict";
import test from "node:test";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  realpathSync,
  readdirSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { main } from "../../../../scripts/worker.mjs";
import {
  runChangeReview,
  recordAgentReview,
} from "../../../../scripts/lib/review-worker.mjs";
import {
  createFixtureRoot,
  excludeFixtureOwnership,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import { runGit } from "../../../../scripts/lib/git.mjs";
import {
  initializeSubagentCounter,
  admitSubagentTool,
  linkSubagentResult,
  subagentUsage,
  workersLine,
} from "../../../../packages/skeleton/dist/src/subagent-budget.js";
import {
  reviewWorkerGate,
  kitWorkerLaunch,
} from "../../../../packages/skeleton/dist/src/harness-host.js";
import { readHandoffLedger } from "../../../../scripts/lib/handoff-ledger.mjs";
import { retainWorktreeJournals } from "../../../../scripts/lib/worktree-removal.mjs";
const parent = realpathSync(createFixtureRoot(join(tmpdir(), "dotln-ver250-")));
const saved = { ...process.env };
for (const name of [
  "CODEX_THREAD_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_SESSION_ID",
  "COPILOT_AGENT_SESSION_ID",
  "DOTLN_DRIVEN_WORKER",
  "DOTLN_WORKER_FIXTURE_TOUCH",
])
  delete process.env[name];
const write = (root, name, text) => {
  mkdirSync(dirname(join(root, name)), { recursive: true });
  writeFileSync(join(root, name), text);
};
const read = (root, name) => readFileSync(join(root, name), "utf8");
const git = (root, args) => runGit(root, args);
const orderPath = "docs/work-orders/WO-901-independent.md";
let sequence = 0;
function repository(cap = 20) {
  const root = realpathSync(
    createFixtureRoot(join(parent, `case-${++sequence}-`)),
  );
  git(root, ["init", "--quiet", "-b", "main"]);
  excludeFixtureOwnership(root);
  write(root, ".gitignore", "docs/control/local/\n");
  write(root, "README.md", "# Independent fixture\n");
  write(root, "src/value.mjs", "export const value = 1;\n");
  write(
    root,
    orderPath,
    "# WO-901\n\n**Acceptance criteria**\n\n1. Read source.\n2. Record result.\n",
  );
  write(
    root,
    "docs/control/budgets.json",
    JSON.stringify({ subagentCap: cap }),
  );
  git(root, ["add", "-A"]);
  git(root, [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "--quiet",
    "-m",
    "base",
  ]);
  git(root, ["switch", "--quiet", "-c", "wo-901"]);
  write(root, "src/value.mjs", "export const value = 2;\n");
  return root;
}
const empty = {
  schemaVersion: 1,
  findings: [],
  rechecks: [],
  filesRead: ["src/value.mjs"],
  report: "Read src/value.mjs.",
};
const fixtureFile = join(parent, "result.json");
writeFileSync(fixtureFile, JSON.stringify(empty));
process.env.DOTLN_WORKER_FIXTURE = fixtureFile;
const reportBase = "docs/control/local/reviews/WO-901/";
const observation = {};
try {
  await test("fresh Codex session initializes its own counter and the CLI dispatcher preserves the real index", async () => {
    const root = repository();
    process.env.CODEX_THREAD_ID = "independent-fresh";
    const indexBefore = readFileSync(join(root, ".git/index"));
    const r = await main(
      ["review", "--kind", "criteria", "--host", "codex"],
      root,
    );
    assert.equal(r.report, `${reportBase}round-1-criteria.md`);
    assert.deepEqual(readFileSync(join(root, ".git/index")), indexBefore);
    const usage = subagentUsage(
      root,
      join(root, "docs/control/local/harness"),
      process.env.CODEX_THREAD_ID,
    );
    assert.equal(usage.count, 1);
    assert.equal(usage.launchedByHost.codex, 1);
    const record = JSON.parse(read(root, `${reportBase}round-1-criteria.json`));
    assert.equal(record.since, git(root, ["merge-base", "HEAD", "main"]));
    assert.equal(record.checkout.unchanged, true);
    const journals = readdirSync(
      join(root, "docs/control/local/harness"),
    ).filter((n) => n.endsWith(".jsonl"));
    const rows = journals.flatMap((n) =>
      read(root, `docs/control/local/harness/${n}`)
        .trim()
        .split("\n")
        .map((t) => JSON.parse(t)),
    );
    assert.equal(rows.filter((r) => r.event === "WorkerLaunched").length, 1);
    observation.freshSession = {
      count: usage.count,
      journalRows: 1,
      indexUnchanged: true,
    };
  });
  await test("combined recheck keeps repeated finding ids from different reviewer kinds distinct", async () => {
    const root = repository();
    process.env.CODEX_THREAD_ID = "independent-combined";
    writeFileSync(
      fixtureFile,
      JSON.stringify({
        ...empty,
        findings: [
          {
            id: "F1",
            severity: "note",
            summary: "An independent note.",
            file: "src/value.mjs",
            line: 1,
            basis: null,
          },
        ],
      }),
    );
    for (const kind of ["criteria", "design"])
      await runChangeReview(root, ["--kind", kind, "--host", "codex"], {
        write: () => {},
      });
    writeFileSync(
      fixtureFile,
      JSON.stringify({
        ...empty,
        rechecks: [
          {
            id: "criteria.1.F1",
            outcome: "held",
            note: "Checked criteria fix.",
          },
          { id: "design.1.F1", outcome: "held", note: "Checked design fix." },
        ],
      }),
    );
    const r = await runChangeReview(
      root,
      [
        "--kind",
        "combined",
        "--host",
        "codex",
        "--round",
        "3",
        "--recheck",
        `${reportBase}round-1-criteria.md`,
        "--recheck",
        `${reportBase}round-1-design.md`,
      ],
      { write: () => {} },
    );
    const record = JSON.parse(read(root, r.record));
    assert.deepEqual(record.priorFindingIds, ["criteria.1.F1", "design.1.F1"]);
    assert.equal(record.rechecks.length, 2);
    assert.match(record.brief, /\*\*criteria:\*\*/);
    assert.match(record.brief, /\*\*design:\*\*/);
    assert.match(record.brief, /\*\*consistency:\*\*/);
    observation.combined = {
      priorFindingIds: record.priorFindingIds,
      rechecks: record.rechecks.length,
    };
    writeFileSync(fixtureFile, JSON.stringify(empty));
  });
  await test("zero cap refuses before attempting to decode an invalid fake transport result", async () => {
    const root = repository(0);
    process.env.CODEX_THREAD_ID = "independent-zero";
    writeFileSync(fixtureFile, "invalid json");
    const r = await runChangeReview(
      root,
      ["--kind", "criteria", "--host", "codex"],
      { write: () => {} },
    );
    assert.match(r.refused, /DOTLN_SUBAGENT_CAP_REFUSED: count 0, cap 0/);
    assert.equal(
      existsSync(join(root, reportBase, "round-1-criteria.json")),
      false,
    );
    assert.equal(
      subagentUsage(
        root,
        join(root, "docs/control/local/harness"),
        process.env.CODEX_THREAD_ID,
      ).count,
      0,
    );
    observation.zeroCap = { refusedBeforeTransport: true, count: 0 };
    writeFileSync(fixtureFile, JSON.stringify(empty));
  });
  await test("one known agent, two kinds of retask and a batched launch obey idempotency and the cap atomically", () => {
    const root = repository();
    const directory = join(root, "docs/control/local/harness");
    const session = "independent-budget";
    assert.equal(initializeSubagentCounter(directory, session), null);
    const input = (id, name, data = {}) => ({
      session_id: session,
      tool_use_id: id,
      tool_name: name,
      tool_input: data,
    });
    const spawn = input("spawn", "Agent");
    assert.equal(
      admitSubagentTool(root, directory, spawn, true).refusal,
      undefined,
    );
    linkSubagentResult(directory, {
      ...spawn,
      tool_response: { agentId: "known" },
    });
    const message = input("message", "SendMessage", {
      to: "known",
      message: "Recheck.",
    });
    for (let n = 0; n < 2; n++)
      assert.equal(
        admitSubagentTool(root, directory, message, false, { retask: true })
          .refusal,
        undefined,
      );
    assert.equal(
      admitSubagentTool(
        root,
        directory,
        input("resume", "Agent", { resume: "known" }),
        true,
      ).refusal,
      undefined,
    );
    assert.equal(subagentUsage(root, directory, session).count, 3);
    for (let n = 0; n < 16; n++)
      admitSubagentTool(root, directory, input(`kit-${n}`, "Bash"), false, {
        kit: { uses: 1, host: "codex" },
      });
    const batch = admitSubagentTool(
      root,
      directory,
      input("batch", "Bash"),
      false,
      { kit: { uses: 3, host: "claude" } },
    );
    assert.match(batch.refusal, /count 19, cap 20/);
    assert.equal(subagentUsage(root, directory, session).count, 19);
    admitSubagentTool(root, directory, input("last", "Bash"), false, {
      kit: { uses: 1, host: "claude" },
    });
    assert.match(
      admitSubagentTool(root, directory, input("past", "SendMessage"), false, {
        retask: true,
      }).refusal,
      /count 20, cap 20/,
    );
    const usage = subagentUsage(root, directory, session);
    assert.equal(usage.retasked, 2);
    assert.equal(usage.count, 20);
    observation.counter = {
      workers: workersLine(usage),
      batchRefusedAt: 19,
      repeatChargedOnce: true,
    };
  });
  await test("declared gate forms are classified for both review types while phase workers and bounded probes keep their route", () => {
    const gates = [
      "npm test",
      "npm test -- --only resume",
      "node scripts/test-runner.mjs --review",
      "node scripts/target-gate.mjs",
      "npm run test:docs",
    ];
    let refused = 0;
    for (const agent_type of ["dotln-worker", "dotln-worker-fable"])
      for (const command of gates) {
        assert.ok(
          reviewWorkerGate({
            session_id: "independent",
            agent_id: "a",
            agent_type,
            tool_name: "Bash",
            tool_input: { command },
          }),
        );
        refused++;
      }
    for (const command of gates) {
      assert.equal(
        reviewWorkerGate({
          session_id: "independent",
          agent_id: "phase",
          agent_type: "dotln-executor",
          tool_name: "Bash",
          tool_input: { command },
        }),
        null,
      );
      assert.equal(
        reviewWorkerGate({
          session_id: "independent",
          tool_name: "Bash",
          tool_input: { command },
        }),
        null,
      );
    }
    const command =
      "node scripts/harness.mjs bounded -- node --test --test-name-pattern scripts/test-runner.mjs scripts/test-harness.mjs";
    assert.equal(
      reviewWorkerGate({
        session_id: "independent",
        agent_id: "a",
        agent_type: "dotln-worker",
        tool_name: "Bash",
        tool_input: { command },
      }),
      null,
    );
    assert.deepEqual(
      kitWorkerLaunch("npm run worker -- review --kind criteria --host codex"),
      { uses: 1, host: "codex" },
    );
    assert.deepEqual(kitWorkerLaunch("npm run plan -- review"), {
      uses: 3,
      host: "unattributed",
    });
    assert.equal(
      kitWorkerLaunch(
        "npm run worker -- review --kind criteria --host codex --dry-run",
      ),
      null,
    );
    observation.gateClassification = {
      declaredRefusals: refused,
      phaseAndSessionPreserved: true,
      boundedPatternPreserved: true,
    };
  });
  await test("handoff parser retains legacy and new forms, and advises on malformed tails", () => {
    const root = repository();
    const state = { workOrderId: "WO-901", workOrderPath: orderPath };
    const lines = [
      [
        "self-review: found 19; fixed 18; recorded 1; rounds 3; unreviewed 12 lines (comments and a test name)",
        false,
      ],
      ["self-review: found 19; fixed 18; recorded 1", false],
      ["self-review: found 19; fixed 18; recorded 1; rounds x; garbage", true],
    ];
    for (const [line, advised] of lines) {
      write(
        root,
        "docs/evidence/WO-901/handoff.md",
        `**Criterion 1:** met. Read.\n**Criterion 2:** met. Recorded.\n\n${line}\n`,
      );
      assert.equal(
        readHandoffLedger(root, state).advisories.some((a) =>
          a.includes("lacks a self-review"),
        ),
        advised,
      );
    }
    observation.handoff = { validForms: 2, malformedAdvisory: true };
  });
  await test("retention moves execution and nested repair report pairs, preserves an earlier lane and is repeatable", () => {
    const mainRoot = repository(),
      subject = repository();
    write(subject, `${reportBase}earlier.md`, "earlier\n");
    assert.equal(retainWorktreeJournals(mainRoot, subject, "WO-901").files, 1);
    write(subject, `${reportBase}round-1-criteria.md`, "current\n");
    write(subject, `${reportBase}round-1-criteria.json`, "{}\n");
    write(subject, `${reportBase}repair-2/round-3-combined.md`, "repair\n");
    write(subject, `${reportBase}repair-2/round-3-combined.json`, "{}\n");
    const r = retainWorktreeJournals(mainRoot, subject, "WO-901");
    assert.equal(r.files, 4);
    assert.equal(r.outcome, "moved");
    const retained = "docs/control/local/retained/WO-901/harness/reviews/";
    assert.equal(read(mainRoot, `${retained}earlier.md`), "earlier\n");
    assert.equal(
      read(mainRoot, `${retained}repair-2/round-3-combined.md`),
      "repair\n",
    );
    assert.equal(
      existsSync(join(subject, `${reportBase}round-1-criteria.md`)),
      false,
    );
    assert.equal(
      retainWorktreeJournals(mainRoot, subject, "WO-901").outcome,
      "nothing",
    );
    observation.retention = {
      movedFiles: r.files,
      repairRetained: true,
      earlierPreserved: true,
      retry: "nothing",
    };
  });
  await test("observe Agent prose recording with an embedded JSON example", async () => {
    const root = repository();
    const prose =
      '## Review\n\nRead src/value.mjs. Example data:\n```json\n{"value":2}\n```\nNo criterion defect found.\n';
    const file = join(parent, "agent-prose.md");
    writeFileSync(file, prose);
    try {
      const r = await recordAgentReview(
        root,
        ["--kind", "design", "--from", file],
        { write: () => {} },
      );
      observation.agentProse = { recorded: true, report: r.report };
    } catch (error) {
      observation.agentProse = {
        recorded: false,
        error: error.message,
        input: prose,
      };
    }
    assert.ok("recorded" in observation.agentProse);
  });
  await test("three clean round-one reviews use three admissions", async () => {
    const root = repository();
    process.env.CODEX_THREAD_ID = "independent-short-ladder";
    writeFileSync(fixtureFile, JSON.stringify(empty));
    for (const kind of ["criteria", "design", "consistency"]) {
      const result = await runChangeReview(
        root,
        ["--kind", kind, "--host", "codex"],
        { write: () => {} },
      );
      assert.equal(result.findings, 0);
    }
    const usage = subagentUsage(
      root,
      join(root, "docs/control/local/harness"),
      process.env.CODEX_THREAD_ID,
    );
    assert.equal(usage.count, 3);
    observation.shortLadder = {
      roundOneReviews: 3,
      findings: 0,
      uses: usage.count,
      skippedLaterRounds:
        "Inference from the role rule: no fixed findings require a recheck, and no round-two code fix requires a combined review.",
    };
  });
} finally {
  writeFileSync(
    new URL("./probe-observations.json", import.meta.url),
    JSON.stringify(observation, null, 2) + "\n",
  );
  for (const k of Object.keys(process.env))
    if (!(k in saved)) delete process.env[k];
  Object.assign(process.env, saved);
  removeTemporaryPath(parent, { recursive: true, force: true });
}
