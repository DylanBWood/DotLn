import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
const root = process.argv[2] ?? process.cwd();
const { createFixtureRoot, excludeFixtureOwnership, removeTemporaryPath } =
  await import(`${root}/scripts/lib/temporary-roots.mjs`);
const {
  recordAgentReview,
  runChangeReview,
  reviewsLane,
  tracedConsumersRefusal,
} = await import(`${root}/scripts/lib/review-worker.mjs`);
const { workingTree } = await import(`${root}/scripts/lib/checkpoint.mjs`);
const { harnessWorkerWords } = await import(
  `${root}/packages/compiler/dist/src/harness.js`
);
const output = process.argv[3];
const parent = realpathSync(
  createFixtureRoot(join(tmpdir(), "wo255-verifier-")),
);
const observations = {};
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
    "commit",
    "--quiet",
    "-m",
    "Synthetic verification fixture",
  );
};
const fixture = (name, branch = "wo-901") => {
  const repo = join(parent, name);
  mkdirSync(repo);
  git(repo, "init", "--quiet", "-b", "main");
  excludeFixtureOwnership(repo);
  git(repo, "config", "user.name", "Verification fixture");
  git(repo, "config", "user.email", "fixture@example.invalid");
  write(repo, ".gitignore", "docs/control/local/\n.dotln-owner.json\n");
  write(
    repo,
    "docs/work-orders/WO-901-fixture.md",
    "# WO-901 — Fixture\n\n**Acceptance criteria (all required)**\n\n1. Read the fixture.\n",
  );
  write(repo, "README.md", "# Fixture base\n");
  commit(repo);
  git(repo, "switch", "--quiet", "-c", branch);
  write(repo, "docs/planning/pass.md", "# Synthetic pass\n");
  commit(repo);
  return repo;
};
const quiet = { write: () => {} };
const outcome = async (fn) => {
  try {
    return { accepted: true, result: await fn() };
  } catch (e) {
    return { accepted: false, error: e.message };
  }
};
const report = (name, body) => {
  const p = join(parent, name + ".md");
  writeFileSync(p, body);
  return p;
};
const table =
  "## Traced consumers\n\n| Changed contract | Consumer | Command | Result |\n| --- | --- | --- | --- |\n| generated pages | docs/guide.md | read docs/guide.md | current |\n| fixture manifests | fixture.json | read fixture.json | current |\n";
for (const k of [
  "CODEX_THREAD_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_SESSION_ID",
  "COPILOT_AGENT_SESSION_ID",
  "DOTLN_DRIVEN_WORKER",
  "DOTLN_WORKER_FIXTURE_TOUCH",
])
  delete process.env[k];
try {
  const repo = fixture("prose");
  const plain = report(
    "plain-example",
    'The reviewed payload is this JSON example:\n\n```json\n{"value":2}\n```\n\nThe consumer handles it.\n',
  );
  const versioned = report(
    "versioned-example",
    'The reviewed payload is this JSON example:\n\n```json\n{"schemaVersion":1,"value":2}\n```\n\nThe consumer handles it.\n',
  );
  const withFindings = report(
    "findings-example",
    'The API response example below documents an empty search:\n\n```json\n{"findings":[],"total":0}\n```\n\nThe response is an example, not this review result.\n',
  );
  const recordArgs = (p, kind = "design") => ["--kind", kind, "--from", p];
  observations.proseExample = await outcome(() =>
    recordAgentReview(repo, recordArgs(plain), quiet),
  );
  assert.equal(observations.proseExample.accepted, true);
  writeFileSync(versioned, readFileSync(versioned, "utf8") + "\n" + table);
  observations.versionedJsonExample = await outcome(() =>
    recordAgentReview(repo, recordArgs(versioned, "consistency"), quiet),
  );
  writeFileSync(
    withFindings,
    readFileSync(withFindings, "utf8") + "\n" + table,
  );
  observations.findingsJsonExample = await outcome(() =>
    recordAgentReview(repo, recordArgs(withFindings, "consistency"), quiet),
  );
  const tree = workingTree(repo);
  const named = report("named-tree", `Reviewed tree: ${tree}\n\n${table}`);
  write(repo, "README.md", "# Changed after review\n");
  observations.staleReport = await outcome(() =>
    recordAgentReview(repo, recordArgs(named, "consistency"), quiet),
  );
  assert.equal(observations.staleReport.accepted, false);
  assert.match(observations.staleReport.error, /--tree/);
  observations.explicitTree = await outcome(() =>
    recordAgentReview(
      repo,
      [
        ...recordArgs(named, "consistency"),
        "--tree",
        tree,
        "--host",
        "codex",
        "--model",
        "astra",
        "--effort",
        "max",
      ],
      quiet,
    ),
  );
  assert.equal(observations.explicitTree.accepted, true);
  const bound = JSON.parse(
    readFileSync(join(repo, observations.explicitTree.result.record), "utf8"),
  );
  assert.equal(bound.reviewedTree, tree);
  assert.equal(bound.model.value, "gpt-6-astra");
  observations.boundRecord = {
    model: bound.model,
    effort: bound.effort,
    treeMatches: bound.reviewedTree === tree,
  };
  observations.emptyTable = tracedConsumersRefusal(
    "## Traced consumers\n\n| Contract | Consumer | Command | Result |\n| --- | --- | --- | --- |\n",
  );
  assert.ok(observations.emptyTable);

  const nested = "planning/2030-01-02/recheck";
  const nestedLane = reviewsLane(root, "planning", { branch: nested });
  const literal =
    "planning/" +
    nestedLane
      .split("/")
      .at(-1)
      .replace(/^planning-/, "");
  const lanes = fixture("lanes", nested);
  const fake = join(parent, "worker.json");
  writeFileSync(
    fake,
    JSON.stringify({
      schemaVersion: 1,
      findings: [],
      rechecks: [],
      filesRead: ["docs/planning/pass.md"],
      report: "Read the synthetic pass.",
    }),
  );
  process.env.DOTLN_WORKER_FIXTURE = fake;
  const args = [
    "--kind",
    "criteria",
    "--host",
    "claude",
    "--subject",
    "planning",
  ];
  observations.firstDryReport = (
    await runChangeReview(lanes, [...args, "--dry-run"], quiet)
  ).report;
  observations.firstBranch = {
    branch: nested,
    ...(await outcome(() => runChangeReview(lanes, args, quiet))),
  };
  assert.equal(observations.firstBranch.accepted, true);
  git(lanes, "switch", "--quiet", "main");
  git(lanes, "switch", "--quiet", "-c", literal);
  write(
    lanes,
    "docs/planning/second.md",
    "# Second independent pass on the same date\n",
  );
  commit(lanes);
  observations.secondDryReport = (
    await runChangeReview(lanes, [...args, "--dry-run"], quiet)
  ).report;
  observations.secondBranch = {
    branch: literal,
    ...(await outcome(() => runChangeReview(lanes, args, quiet))),
  };
  observations.laneCollision = {
    first: reviewsLane(root, "planning", { branch: nested }),
    second: reviewsLane(root, "planning", { branch: literal }),
  };
  const independent = fixture("recheck", "planning/2030-01-02-independent");
  const first = await runChangeReview(independent, args, quiet);
  const firstRecord = JSON.parse(
    readFileSync(join(independent, first.record), "utf8"),
  );
  write(
    independent,
    "docs/planning/second.md",
    "# New material after round one\n",
  );
  const second = await runChangeReview(
    independent,
    [...args, "--recheck", first.report, "--dry-run"],
    quiet,
  );
  assert.equal(second.since, firstRecord.since);
  assert.ok(second.brief.includes("docs/planning/pass.md"));
  assert.ok(second.brief.includes("docs/planning/second.md"));
  assert.ok(second.brief.includes("review the whole current change"));
  observations.wholeRecheck = {
    basePreserved: true,
    originalAndNewDocument: true,
  };
  const cap = report(
    "capture",
    "1. Preserve the branch name in every review record.\n2. Fix the lane bug now.\n3. Keep the target checkout free of edits.\n",
  );
  const items =
    "## Items\n\n| Item | Location in the subject | Disposition |\n| --- | --- | --- |\n| 1 | docs/planning/pass.md | reviewed |\n| 2 | docs/planning/pass.md | acted on |\n| 3 | docs/planning/pass.md | missing |\n";
  const captured = fixture("captured", "planning/2030-01-02-captured");
  const capText = readFileSync(cap, "utf8");
  const dry = await runChangeReview(
    captured,
    [...args, "--capture", cap, "--dry-run"],
    quiet,
  );
  assert.ok(dry.brief.endsWith(capText));
  const ret = report("captured-return", "Fix the lane bug now.\n\n" + items);
  const saved = await recordAgentReview(
    captured,
    [
      "--kind",
      "criteria",
      "--subject",
      "planning",
      "--capture",
      cap,
      "--from",
      ret,
    ],
    quiet,
  );
  const bytes = readFileSync(join(captured, saved.record), "utf8");
  const savedRecord = JSON.parse(bytes);
  assert.equal(
    savedRecord.captures[0].sha256,
    createHash("sha256").update(capText).digest("hex"),
  );
  assert.ok(!bytes.includes("Fix the lane bug now."));
  observations.capture = {
    endsWithCapture: true,
    digestMatches: true,
    shortQuoteRemoved: true,
    itemsPreserved: savedRecord.report.includes("| 2 |"),
  };
  observations.dispatch = [
    "planning: pass, astra.",
    "resume: next astra; keep the reviews short",
    "planning: read the astra notes first",
    "resume: verify fable astra",
    "resume: verify",
  ].map((prompt) => ({ prompt, options: harnessWorkerWords(prompt) }));
  assert.deepEqual(
    observations.dispatch.map((r) => r.options),
    [
      { codex: "astra" },
      { codex: "astra" },
      {},
      { claude: "fable", codex: "astra" },
      {},
    ],
  );
} finally {
  if (output)
    writeFileSync(
      join(output, "independent-observations.json"),
      JSON.stringify(observations, null, 2) + "\n",
    );
  removeTemporaryPath(parent, { recursive: true, force: true });
}
console.log(JSON.stringify(observations, null, 2));
