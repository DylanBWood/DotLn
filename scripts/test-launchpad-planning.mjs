// Exercise the planning command surface in one real export, using only
// synthetic planning judgments and the fake entropy transport.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TEST_FIXTURE_TREES, TEST_SUPPORT_FILES } from "./launchpad.mjs";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = {
  ...process.env,
  CODEX_THREAD_ID: "",
  COPILOT_AGENT_SESSION_ID: "",
  CLAUDE_EFFORT: "",
  DOTLN_LAUNCHPAD: "",
  DOTLN_BEACON_KEY_FILE: "",
  DOTLN_ENTROPY_FIXTURE: "1",
  npm_config_update_notifier: "false",
};
for (const key of [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_COMMON_DIR",
  "GIT_PREFIX",
])
  delete env[key];
const run = (cwd, file, args) =>
  spawnSync(file, args, {
    cwd,
    env,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
const ok = (result, label) => {
  assert.equal(
    result.status,
    0,
    `${label}: ${result.stdout}\n${result.stderr}`,
  );
  return result;
};
const git = (cwd, args) =>
  ok(run(cwd, "git", args), `git ${args.join(" ")}`).stdout.trim();
const write = (root, path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(
    join(root, path),
    typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`,
  );
};
const configure = (root) => {
  for (const [key, value] of [
    ["user.name", "DotLn Fixture"],
    ["user.email", "fixture@example.invalid"],
    ["maintenance.auto", "false"],
    ["commit.gpgsign", "false"],
  ])
    git(root, ["config", key, value]);
};
const commit = (root, message) => {
  git(root, ["add", "."]);
  git(root, ["commit", "--allow-empty", "-qm", message]);
};
const parse = (result) => {
  try {
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
};

test("planning and release-close reads run in a fresh exported instance", () => {
  const scratch = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-planning-kit-")),
  );
  const source = join(scratch, "source"),
    kit = join(scratch, "kit");
  const rows = [];
  try {
    mkdirSync(source);
    const copy = (path) => {
      mkdirSync(dirname(join(source, path)), { recursive: true });
      cpSync(join(repository, path), join(source, path), { recursive: true });
    };
    for (const path of [
      "scripts",
      "packages/beacons",
      ...TEST_FIXTURE_TREES,
      ...TEST_SUPPORT_FILES,
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "LICENSE",
      "LICENSE-docs",
      "NOTICE",
      ".gitignore",
      "docs/product/07-execution-guide.md",
      "docs/product/08-publication-compiler.md",
      "docs/PLAYBOOK.md",
      "docs/publication/implementation-overlay-template.md",
      "docs/LEGAL.md",
    ])
      copy(path);
    for (const { path } of JSON.parse(
      readFileSync(join(repository, "tsconfig.json"), "utf8"),
    ).references)
      for (const entry of ["package.json", "tsconfig.json", "src", "test"])
        if (existsSync(join(repository, path, entry)))
          copy(`${path.replace(/^\.\//u, "")}/${entry}`);
    write(
      source,
      "docs/control/local/terms.txt",
      `${["Term", "Forbidden", "Planning", "Synthetic"].reverse().join("")}\n`,
    );
    git(source, ["init", "-q", "-b", "main"]);
    configure(source);
    git(source, [
      "remote",
      "add",
      "origin",
      "https://example.invalid/fixture/core.git",
    ]);
    commit(source, "bounded planning kit source");
    mkdirSync(join(source, "node_modules/@dotln"), { recursive: true });
    for (const entry of readdirSync(join(repository, "node_modules")))
      if (![".bin", "@dotln"].includes(entry))
        symlinkSync(
          join(repository, "node_modules", entry),
          join(source, "node_modules", entry),
        );
    for (const name of readdirSync(join(source, "packages")))
      if (existsSync(join(source, "packages", name, "package.json")))
        symlinkSync(
          `../../packages/${name}`,
          join(source, "node_modules/@dotln", name),
        );
    ok(
      run(source, process.execPath, ["scripts/launchpad.mjs", "export", kit]),
      "export",
    );
    configure(kit);
    commit(kit, "exported instance");
    ok(
      run(kit, "npm", [
        "ci",
        "--offline",
        "--no-audit",
        "--no-fund",
        "--loglevel=error",
      ]),
      "offline install",
    );
    const observe = (args, note = "") => {
      const started = Date.now();
      const result = run(kit, "npm", ["run", "--silent", ...args]);
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.replaceAll(
        scratch,
        "<fixture>",
      );
      rows.push({
        command: `npm run ${args.join(" ")}`.replaceAll(scratch, "<fixture>"),
        exitCode: result.status,
        durationMs: Date.now() - started,
        inputs: [
          ...new Set(
            output.match(/(?:docs|packages|scripts)\/[\w./-]+/gu) ?? [],
          ),
        ],
        result: output.split("\n").slice(0, 28).join("\n"),
        fix: null,
        ...(note ? { setup: note } : {}),
      });
      return result;
    };
    const nodeObserve = (args) => {
      const started = Date.now(),
        result = run(kit, process.execPath, args);
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.replaceAll(
        scratch,
        "<fixture>",
      );
      rows.push({
        command: `node ${args.join(" ")}`,
        exitCode: result.status,
        durationMs: Date.now() - started,
        inputs: [
          ...new Set(
            output.match(/(?:docs|packages|scripts)\/[\w./-]+/gu) ?? [],
          ),
        ],
        result: output.split("\n").slice(0, 28).join("\n"),
        fix: null,
      });
      return result;
    };
    const initialStatus = observe(["resume", "--", "status"]);
    assert.doesNotMatch(
      initialStatus.stderr,
      /disagrees with the canonical fold/u,
    );
    observe(["plan", "--", "followups"]);
    const started = observe(["plan", "--", "start", "fixture"]);
    if (started.status !== 0)
      git(kit, ["switch", "-qc", "planning/fixture-probe"]);
    else assert.match(git(kit, ["branch", "--show-current"]), /^planning\//u);
    // Operator-authored instance planning content, never core's records.
    const ledgerPath = "docs/lineage/idea-ledger.md";
    const ledger = existsSync(join(kit, ledgerPath))
      ? readFileSync(join(kit, ledgerPath), "utf8")
      : "# Idea ledger\n";
    write(
      kit,
      ledgerPath,
      `${ledger}\n## 2030-01-02 fixture planning pass\n\n- **Planning command fixture** \`specified\` Exercise the pre-drafted first order.\n`,
    );
    write(
      kit,
      "docs/planning/fixture.md",
      "# Fixture planning\n\n## Candidate\n\nA synthetic candidate to exercise batch disposition.\n",
    );
    observe(["plan", "--", "followups", "--sync"]);
    const feed = parse(observe(["plan", "--", "followups"]));
    observe([
      "plan",
      "--",
      "followups",
      "--export",
      "docs/control/local/followups.json",
    ]);
    write(
      kit,
      "docs/control/local/batch.json",
      (feed?.rows ?? []).map((row) => ({
        expectedRevision: feed.revision,
        id: row.id,
        sourceRevision: row.sourceRevision,
        status: "declined",
        reason: "Synthetic fixture candidate is not product work.",
        reopenWhen: "The fixture changes.",
        targets: [],
      })),
    );
    observe([
      "plan",
      "--",
      "followups",
      "--apply",
      "docs/control/local/batch.json",
    ]);
    const conditions = observe(["plan", "--", "conditions"]);
    observe(["plan", "--", "failures"]);
    observe(["meta"]);
    commit(kit, "fixture planning subject");
    const costs = observe(["meta", "--", "--plan-cost"]);
    commit(kit, "fixture planning cost evidence");
    const prompt = observe(["plan", "--", "refute"]);
    write(kit, "docs/control/local/result.json", {
      schemaVersion: "plan-goal-review-v1",
      orders: [
        {
          workOrderId: "WO-001",
          verdict: "aligned",
          criticalPathAndNoOp: "Synthetic fixture; no observed NoOp cost.",
          systemTraps: "Synthetic fixture considers all eight system traps.",
          removalBalance: "Unknown fixture process cost; no structural hold.",
          failureBehavior: "Synthetic fixture preserves existing behavior.",
          findings: [],
        },
      ],
      planVerdict: "aligned",
      holdReasons: [],
    });
    write(
      kit,
      "docs/control/local/statement.txt",
      "Synthetic fixture result; no live independent judgment is claimed.\n",
    );
    const receipt = observe([
      "plan",
      "--",
      "receipt",
      "docs/control/local/result.json",
      "--statement",
      "docs/control/local/statement.txt",
    ]);
    observe(["plan", "--", "check"]);
    const entropySubject = observe(["entropy", "--", "subject"]);
    observe(["work-orders", "--", "index"]);
    observe(["work-orders", "--", "index", "--check"]);
    nodeObserve(["scripts/docs-check.mjs"]);
    observe(["publication:check"]);
    nodeObserve(["scripts/lineage.mjs", "index"]);
    observe(["reader", "--", "check"]);
    observe(["release", "--", "check-surfaces", "--local"]);
    nodeObserve([
      "scripts/operator-control.mjs",
      "status",
      "--session",
      "planning-fixture",
    ]);
    nodeObserve([
      "scripts/harness-probe.mjs",
      "--writing-worker",
      "report",
      "--date",
      "2030-01-02",
    ]);
    nodeObserve([
      "scripts/harness-probe.mjs",
      "--authority",
      "report",
      "--date",
      "2030-01-02",
    ]);
    nodeObserve([
      "--input-type=module",
      "-e",
      `
      import { activeGateRuns } from './packages/skeleton/src/gate-evidence.mjs';
      import { writerTeardownBlocker } from './packages/skeleton/src/writer-teardown.mjs';
      import { usageObservation } from './packages/skeleton/src/usage-observation.mjs';
      import { codexContinuation } from './packages/compiler/src/codex-continuation.mjs';
      console.log(JSON.stringify({ gates: activeGateRuns(process.cwd()), writer: writerTeardownBlocker(process.cwd()), usage: usageObservation([]), continuation: await codexContinuation({}, async () => null) }));
    `,
    ]);
    // Generated indexes and formatting precede the nested document gate.
    observe(["meta"]);
    observe(["format"]);
    commit(kit, "fixture generated planning records");
    observe(["test:docs"]);
    const review = observe(["entropy", "--", "review", "--transport", "fake"]);
    const filing = parse(review)?.file;
    const entropyReceipt = filing
      ? observe(filing.split(" ").slice(2))
      : observe([
          "entropy",
          "--",
          "receipt",
          "docs/control/local/absent-result.json",
          "--statement",
          "docs/control/local/statement.txt",
        ]);
    console.log(`PLANNING-COMMANDS ${JSON.stringify(rows)}`);
    {
      assert.deepEqual(
        rows.filter((row) => row.exitCode !== 0),
        [],
        "every planning command exits successfully",
      );
      assert.match(prompt.stdout, /WO-001/u);
      assert.match(prompt.stdout, /Environment truth for this launchpad/u);
      assert.match(prompt.stdout, /unavailable.*docs\/product\/00-vision.md/u);
      assert.match(
        costs.stdout,
        /Planning cost input unavailable: docs\/product\/00-vision.md/u,
      );
      assert.match(conditions.stdout, /collect-sources.*console/u);
      assert.equal(parse(receipt)?.verdict, "aligned");
      for (const result of [receipt, entropyReceipt]) {
        const receiptPath = parse(result)?.receipt;
        assert.match(receiptPath, /^docs\//u);
        assert.ok(existsSync(join(kit, receiptPath)));
        assert.ok(
          existsSync(join(kit, receiptPath.replace(/\.md$/u, ".json"))),
        );
      }
      assert.equal(parse(entropySubject)?.latestFiledReview, null);
      assert.equal(entropyReceipt.status, 0);
    }
    write(kit, "docs/product/00-vision.md", "# Malformed declared vision\n");
    const malformed = run(kit, "npm", [
      "run",
      "--silent",
      "meta",
      "--",
      "--plan-cost",
    ]);
    assert.notEqual(malformed.status, 0);
    assert.match(malformed.stderr, /expected exactly one section/u);
    rmSync(join(kit, "docs/product/00-vision.md"));
    symlinkSync("missing-vision.md", join(kit, "docs/product/00-vision.md"));
    const linked = run(kit, "npm", [
      "run",
      "--silent",
      "meta",
      "--",
      "--plan-cost",
    ]);
    assert.notEqual(linked.status, 0);
    assert.match(
      linked.stderr,
      /symbolic link at docs\/product\/00-vision.md/u,
    );
    rmSync(join(kit, "docs/product/00-vision.md"));
    write(
      kit,
      "docs/planning/broken-link.md",
      "# Instance document\n\n[Missing](absent.md)\n",
    );
    const broken = run(kit, process.execPath, ["scripts/docs-check.mjs"]);
    assert.notEqual(broken.status, 0);
    assert.match(broken.stderr, /broken-link.md.*missing file: absent.md/u);
    write(
      kit,
      "docs/publication/everyday-ai-user-toc.md",
      "# Incomplete declaration\n",
    );
    assert.notEqual(
      run(kit, "npm", ["run", "--silent", "publication:check"]).status,
      0,
    );
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
