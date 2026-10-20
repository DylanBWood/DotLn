// Exercise the planning command surface in one real export, using only
// synthetic planning judgments and the fake entropy transport.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
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
import {
  installTargetPublicationFixture,
  publicationVocabulary,
  publicationGrant,
} from "./test-target-publication-fixture.mjs";
import { markdownLinks } from "./docs-check.mjs";

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
const run = (cwd, file, args, environment = env) =>
  spawnSync(file, args, {
    cwd,
    env: environment,
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
    ["user.name", "Fixture Operator"],
    ["user.email", "fixture@example.invalid"],
    ["maintenance.auto", "false"],
    ["commit.gpgsign", "false"],
  ])
    git(root, ["config", key, value]);
};
const commit = (root, message) => {
  git(root, ["add", "."]);
  git(root, ["commit", "--allow-empty", "--signoff", "-qm", message]);
};
const parse = (result) => {
  try {
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
};
// The export inputs of this checkout, copied into a scratch core.
const copyCoreSource = (source) => {
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
    "docs/releases/tag-manifest.template.json",
    "docs/LEGAL.md",
  ])
    copy(path);
  for (const { path } of JSON.parse(
    readFileSync(join(repository, "tsconfig.json"), "utf8"),
  ).references)
    for (const entry of ["package.json", "tsconfig.json", "src", "test"])
      if (existsSync(join(repository, path, entry)))
        copy(`${path.replace(/^\.\//u, "")}/${entry}`);
};
// Share this checkout's installed dependencies, and link each workspace
// package to the root's own copy, as an install would.
const linkDependencies = (root) => {
  mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
  for (const entry of readdirSync(join(repository, "node_modules")))
    if (
      ![".bin", "@dotln"].includes(entry) &&
      !existsSync(join(root, "node_modules", entry))
    )
      symlinkSync(
        join(repository, "node_modules", entry),
        join(root, "node_modules", entry),
      );
  for (const name of readdirSync(join(root, "packages")))
    if (
      existsSync(join(root, "packages", name, "package.json")) &&
      !existsSync(join(root, "node_modules/@dotln", name))
    )
      symlinkSync(
        `../../packages/${name}`,
        join(root, "node_modules/@dotln", name),
      );
};
const actor = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const actorArgs = Object.entries(actor).flatMap(([key, value]) => [
  `--${key === "harnessVersion" ? "harness-version" : key}`,
  value,
]);
const report = `# Synthetic fixture report\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`;
const firstOrderPath = "docs/work-orders/WO-001-environment-truth.md";
// The records a verified WO-001 leaves uncommitted on an instance's main.
const firstOrderRecords = [
  "docs/control/orders/WO-001.jsonl",
  "docs/evidence/WO-001/handoff.md",
  "docs/evidence/WO-001/decisions.md",
  "docs/verifications/WO-001/VER-001.md",
  "docs/discovery/environment.md",
  "docs/discovery/environment.json",
];
// Activate WO-001 and record it verified with the root's own resume script.
const verifyFirstOrder = (root, resume) => {
  resume(root, "activate", "WO-001", firstOrderPath);
  write(
    root,
    "docs/evidence/WO-001/handoff.md",
    `# Fixture handoff\n\n${[1, 2, 3, 4, 5].map((id) => `**Criterion ${id}:** unmet — synthetic fixture.`).join("\n")}\n\nself-review: found 0; fixed 0; recorded 0\n`,
  );
  write(
    root,
    "docs/evidence/WO-001/decisions.md",
    "# Decisions\n\n## WO-001-D001 — Preserve observations\n\n```json\n" +
      JSON.stringify({
        id: "WO-001-D001",
        date: "2026-10-14",
        dispatch: "synthetic fixture",
        decision: "Preserve synthetic environment observations.",
        evidence: ["Synthetic fixture observation."],
        rejected: [],
        reopenWhen: "The fixture changes.",
      }) +
      "\n```\n",
  );
  write(
    root,
    "docs/discovery/environment.md",
    "# Environment\n\nSynthetic fixture observation.\n",
  );
  write(root, "docs/discovery/environment.json", { fixture: true });
  resume(root, "implementation-ready", ...actorArgs);
  resume(root, "verify");
  write(root, "docs/verifications/WO-001/VER-001.md", report);
  resume(root, "verification-result", "pass", ...actorArgs);
  return new Map(
    firstOrderRecords.map((path) => [path, readFileSync(join(root, path))]),
  );
};

test("planning and release-close reads run in a fresh exported instance", () => {
  const scratch = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-planning-kit-")),
  );
  const source = join(scratch, "source");
  let kit = join(scratch, "kit");
  const rows = [];
  try {
    mkdirSync(source);
    copyCoreSource(source);
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
    const currentSeeds = new Map(
      ["README.client.md", "first-order.template.md"].map((name) => [
        name,
        readFileSync(join(source, "scripts/kit", name)),
      ]),
    );
    const legacyHashes = {
      "README.client.md":
        "178aa4ccf962416db20d8d8923985131cffc0d2ff7213ece3b1393434fa10895",
      "first-order.template.md":
        "5768a933422679e1de0e2840466ad9dc4ae1649b27d7755f96d641d7b26e2ea0",
    };
    // Freeze the exact old seed blobs while keeping the exercised runtime at
    // this repair's source. No historical runtime compatibility is claimed.
    for (const name of currentSeeds.keys()) {
      const bytes = readFileSync(
        join(repository, "scripts/fixtures/legacy-v0.81.0", name),
      );
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        legacyHashes[name],
      );
      writeFileSync(join(source, "scripts/kit", name), bytes);
    }
    commit(source, "bounded planning kit source");
    linkDependencies(source);
    ok(
      run(source, process.execPath, ["scripts/launchpad.mjs", "export", kit]),
      "export",
    );
    configure(kit);
    const historical = ok(
      run(kit, process.execPath, [
        "--input-type=module",
        "-e",
        "import { historicalDependencyIds } from './scripts/lib/dependencies.mjs'; console.log(JSON.stringify([...historicalDependencyIds(process.cwd())]));",
      ]),
      "instance historical ids",
    );
    assert.deepEqual(JSON.parse(historical.stdout), []);
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
    const guidePath = "docs/product/07-execution-guide.md";
    const guide = readFileSync(join(kit, guidePath), "utf8");
    const section = guide
      .slice(guide.indexOf("## Goal-aligned decisions\n"))
      .split(/\n## /u)[0];
    const rules = [
      ...section.matchAll(
        /<!-- dotln-goal-rules:start -->\r?\n([\s\S]*?)<!-- dotln-goal-rules:end -->/gu,
      ),
    ].map((match) => match[1]);
    const sharedStandard = [section.split("\n")[0], ...rules];
    const goal = (workspace = true) =>
      run(kit, process.execPath, [
        "--input-type=module",
        "-e",
        `import {buildPlanSubject} from './scripts/lib/plan-subject.mjs'; console.log(JSON.stringify(buildPlanSubject(process.cwd(), 'HEAD', {goalReview:true, workspace:${workspace}}).goalReview.goalStandard));`,
      ]);
    const unavailablePurpose =
      "unavailable: docs/product/purpose.md; this instance has not declared its purpose";
    const expectedStandard = [...sharedStandard, unavailablePurpose].join("\n");
    assert.equal(parse(ok(goal(), "instance goal subject")), expectedStandard);
    for (const { href } of markdownLinks(expectedStandard))
      if (!/^(?:[a-z]+:|#)/iu.test(href))
        assert.ok(
          existsSync(resolve(kit, dirname(guidePath), href.split("#")[0])),
          `goal link ${href}`,
        );
    const purposePath = "docs/product/purpose.md",
      purpose = "This instance improves a synthetic team's source checks.\n";
    write(
      kit,
      purposePath,
      `# Purpose\n\n<!-- dotln-purpose:start -->\n${purpose}<!-- dotln-purpose:end -->\n`,
    );
    commit(kit, "docs: declare instance purpose");
    assert.equal(
      parse(ok(goal(false), "committed instance purpose")),
      [...sharedStandard, purpose].join("\n"),
    );
    for (const content of [
      "# Purpose without a block\n",
      "<!-- dotln-purpose:start -->\n\n<!-- dotln-purpose:end -->\n",
      `<!-- dotln-purpose:start -->\n${purpose}<!-- dotln-purpose:end -->\n<!-- dotln-purpose:start -->\n${purpose}<!-- dotln-purpose:end -->\n`,
    ]) {
      write(kit, purposePath, content);
      const result = goal();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /docs\/product\/purpose.md/u);
    }
    rmSync(join(kit, purposePath));
    symlinkSync("07-execution-guide.md", join(kit, purposePath));
    const linkedPurpose = goal();
    assert.notEqual(linkedPurpose.status, 0);
    assert.match(linkedPurpose.stderr, /purpose.md/u);
    rmSync(join(kit, purposePath));
    for (const changed of [
      guide.replaceAll(/<!-- dotln-goal-rules:(?:start|end) -->\r?\n/gu, ""),
      guide.replace("<!-- dotln-goal-rules:end -->", ""),
    ]) {
      write(kit, guidePath, changed);
      const result = goal();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /07-execution-guide.md/u);
    }
    write(kit, guidePath, guide);
    commit(kit, "docs: retain undeclared instance purpose fixture");
    const prompt = observe(["plan", "--", "refute"]);
    const promptValue = parse(prompt);
    assert.equal(promptValue.subject.goalReview.goalStandard, expectedStandard);
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
    rmSync(join(kit, "docs/planning/broken-link.md"));
    rmSync(join(kit, "docs/publication/everyday-ai-user-toc.md"));
    commit(kit, "fixture planning observations");
    git(kit, ["switch", "main"]);

    // Establish the instance's release failures before changing product code.
    const origin = join(scratch, "instance.git");
    git(scratch, ["init", "--bare", "-q", "-b", "main", origin]);
    git(kit, ["remote", "add", "origin", origin]);
    git(kit, ["push", "-qu", "origin", "main"]);
    const orderPath = firstOrderPath;
    // An actual starter refresh carries the legacy seeds into the starter. The
    // v0.81.0 case below recovers a verified fork through such a refresh.
    const starterOrigin = join(scratch, "starter.git"),
      starter = join(scratch, "starter");
    git(scratch, ["clone", "-q", "--bare", origin, starterOrigin]);
    git(scratch, ["clone", "-q", starterOrigin, starter]);
    configure(starter);
    const instanceUrl = "https://github.com/dotln-fixture/instance.git",
      starterUrl = "https://github.com/dotln-fixture/starter-fixture.git";
    const refreshForge = join(scratch, "refresh-forge");
    mkdirSync(refreshForge);
    installTargetPublicationFixture(refreshForge, env, [
      { url: starterUrl, origin: starterOrigin },
    ]);
    git(starter, ["remote", "set-url", "origin", starterUrl]);
    git(source, [
      "remote",
      "set-url",
      "origin",
      "https://github.com/dotln-fixture/core.git",
    ]);
    assert.doesNotMatch(
      readFileSync(join(starter, orderPath), "utf8"),
      /v0\.1\.0|Release classification/u,
    );
    assert.doesNotMatch(
      readFileSync(join(starter, "README.md"), "utf8"),
      /DOTLN-RELEASE-BEGIN/u,
    );
    for (const [name, bytes] of currentSeeds)
      writeFileSync(join(source, "scripts/kit", name), bytes);
    write(source, "docs/siblings/siblings.json", {
      schemaVersion: 1,
      siblings: [
        {
          id: "starter-fixture",
          purpose: "Fixture export",
          relation: { kind: "export", coreCommit: null },
          capabilityRows: [],
        },
      ],
    });
    write(source, "docs/control/local/repository-clones.json", {
      "starter-fixture": starter,
    });
    commit(source, "refresh the legacy starter seeds");
    git(source, ["tag", "v10.1.0"]);
    const sourceHead = git(source, ["rev-parse", "HEAD"]);
    const refreshed = ok(
      run(source, process.execPath, [
        "--input-type=module",
        "-e",
        `import {refreshStarters} from './scripts/lib/starter-refresh.mjs'; console.log('REFRESH '+JSON.stringify(await refreshStarters({main:process.cwd(),head:${JSON.stringify(sourceHead)},tag:'v10.1.0'})));`,
      ]),
      "refresh legacy starter",
    );
    const refreshRow = JSON.parse(
      refreshed.stdout
        .split("\n")
        .find((line) => line.startsWith("REFRESH "))
        .slice(8),
    )[0];
    assert.equal(refreshRow.outcome, "refreshed", JSON.stringify(refreshRow));
    assert.deepEqual(refreshRow.rewrittenSeeds, [
      "docs/work-orders/WO-001-environment-truth.md",
      "README.md",
    ]);
    // The separate fresh-start assertions now use the same refreshed export.
    git(kit, ["fetch", starterOrigin, "main"]);
    git(kit, ["merge", "--ff-only", "FETCH_HEAD"]);
    git(kit, ["push", "-q", "origin", "main"]);
    ok(
      run(kit, process.execPath, [
        "scripts/worktree.mjs",
        "start",
        "WO-001",
        orderPath,
      ]),
      "start the seeded first instance order in its own worktree",
    );
    const instanceMain = kit;
    kit = `${kit}-wo001`;
    assert.equal(git(kit, ["branch", "--show-current"]), "wo-001");
    const planningLog = "docs/control/plan-refutations.jsonl";
    const planningBefore = existsSync(join(kit, planningLog))
      ? readFileSync(join(kit, planningLog), "utf8")
      : null;
    const seedAmendment = run(kit, process.execPath, [
      "scripts/refute-plan.mjs",
      "amend-order",
      "WO-001",
      "WO-001-D001",
      "Operator-authorized fixture scope",
    ]);
    assert.notEqual(seedAmendment.status, 0);
    assert.match(
      `${seedAmendment.stdout}${seedAmendment.stderr}`,
      /no judged horizon exists.*never-judged seed order.*structured decisions/su,
    );
    assert.equal(
      existsSync(join(kit, planningLog))
        ? readFileSync(join(kit, planningLog), "utf8")
        : null,
      planningBefore,
    );
    assert.match(
      readFileSync(join(kit, orderPath), "utf8"),
      /^# .+ \(v0\.1\.0\)$/mu,
    );
    commit(kit, "fixture release surfaces");
    const releaseRows = [];
    const releaseObserve = (args) => {
      const started = Date.now();
      const result = run(kit, process.execPath, args);
      ok(result, args.join(" "));
      assert.doesNotMatch(`${result.stdout}${result.stderr}`, /^FAIL /mu);
      releaseRows.push({
        command: `node ${args.join(" ")}`,
        exitCode: result.status,
        durationMs: Date.now() - started,
        nonPass: `${result.stdout ?? ""}${result.stderr ?? ""}`
          .replaceAll(scratch, "<fixture>")
          .split(/\r?\n/u)
          .filter((line) => line && !line.startsWith("PASS ")),
      });
      return result;
    };
    const starterHead = ok(
      run(kit, "git", ["rev-parse", "HEAD"]),
      "starter baseline head",
    ).stdout.trim();
    ok(
      run(kit, "git", [
        "tag",
        "-a",
        "v99.0.0",
        "-m",
        `Starter v99.0.0\n\nCore commit: ${starterHead}`,
      ]),
      "starter baseline tag",
    );
    ok(
      releaseObserve(["scripts/release.mjs", "prepare", "--local"]),
      "prepare release probe",
    );
    assert.match(
      readFileSync(join(kit, orderPath), "utf8"),
      /^# .+ \(v0\.1\.0\)$/mu,
      "a Starter provenance tag does not retime the instance release",
    );
    releaseObserve(["scripts/release.mjs", "check-surfaces", "--local"]);
    assert.doesNotMatch(readFileSync(join(kit, "README.md"), "utf8"), /v99\./u);
    ok(
      run(kit, "git", [
        "tag",
        "-a",
        "v100.0.0",
        "-m",
        "Ordinary instance release",
      ]),
      "ordinary baseline tag",
    );
    const ordinaryBaseline = run(kit, process.execPath, [
      "scripts/release.mjs",
      "check-surfaces",
      "--local",
    ]);
    assert.notEqual(ordinaryBaseline.status, 0);
    assert.match(ordinaryBaseline.stdout, /v100\.0\.0/u);
    ok(run(kit, "git", ["tag", "-d", "v100.0.0"]), "remove ordinary test tag");
    write(
      kit,
      "docs/evidence/WO-001/handoff.md",
      `# Fixture handoff\n\n${[1, 2, 3, 4, 5].map((id) => `**Criterion ${id}:** unmet — synthetic fixture.`).join("\n")}\n\nself-review: found 0; fixed 0; recorded 0\n`,
    );
    const resume = (...args) =>
      ok(
        run(kit, process.execPath, ["scripts/resume.mjs", ...args]),
        `resume ${args[0]}`,
      );
    resume("implementation-ready", ...actorArgs);
    resume("verify");
    write(kit, "docs/verifications/WO-001/VER-001.md", report);
    resume("verification-result", "pass", ...actorArgs);
    resume("final-review");
    // Keep a separate older main for release-close preview and preparation.
    // Its origin is a disposable local bare repository, never the live forge.
    const releaseOrigin = join(scratch, "release-instance.git");
    const releaseMain = join(scratch, "release-main");
    git(scratch, ["clone", "-q", "--bare", origin, releaseOrigin]);
    git(scratch, ["clone", "-q", releaseOrigin, releaseMain]);
    configure(releaseMain);
    linkDependencies(releaseMain);
    ok(
      run(releaseMain, process.execPath, ["scripts/harness.mjs", "emit"]),
      "install older main runtime",
    );
    const oldReleaseHead = git(releaseMain, ["rev-parse", "HEAD"]);
    // A real upstream kit update can change compiled console code without
    // declaring any of core's source fixtures in the consuming instance.
    const consoleSource = "packages/console/src/index.ts";
    write(
      source,
      consoleSource,
      readFileSync(join(source, consoleSource), "utf8") +
        "\n// Fixture upstream console revision.\n",
    );
    commit(source, "test: upstream console runtime update");
    ok(
      run(source, process.execPath, ["scripts/build.mjs"]),
      "build the upstream update",
    );
    ok(
      run(source, process.execPath, [
        "scripts/launchpad.mjs",
        "export",
        "--update",
        instanceMain,
      ]),
      "update the instance main from core",
    );
    commit(instanceMain, "test: consume upstream console runtime update");
    git(instanceMain, ["push", "-q", "origin", "main"]);
    const integrated = releaseObserve([
      "scripts/worktree.mjs",
      "integrate",
      "WO-001",
    ]);
    assert.match(integrated.stdout, /Regenerated: runtime/u);
    assert.doesNotMatch(
      integrated.stdout,
      /Pending:|publication locks|selected console fixtures/u,
    );
    assert.equal(existsSync(join(kit, "packages/console/fixtures")), false);
    assert.equal(
      JSON.parse(
        readFileSync(join(kit, "docs/control/local/integration.json"), "utf8"),
      ).consoleSelected,
      true,
    );
    assert.equal(existsSync(join(kit, "tsconfig.json")), false);
    assert.equal(
      existsSync(join(kit, "packages/compiler/tsconfig.json")),
      false,
    );
    assert.equal(
      existsSync(join(kit, "packages/compiler/src/harness.ts")),
      false,
    );
    assert.equal(
      existsSync(join(kit, "docs/publication/software-engineer-toc.md")),
      false,
    );
    assert.deepEqual(
      JSON.parse(
        readFileSync(join(kit, "docs/control/local/integration.json"), "utf8"),
      ).pending,
      [],
    );
    ok(
      run(kit, "npm", ["test", "--", "--review"]),
      "review the actual integrated kit runtime",
    );
    write(kit, "docs/final-reviews/WO-001/FINAL-001.md", report);
    resume("final-review-result", "pass", ...actorArgs);
    commit(kit, "fixture closed instance order");
    git(kit, ["push", "-q", releaseOrigin, "HEAD:refs/heads/main"]);
    const releaseEnvironment = { ...env };
    const releaseForge = join(scratch, "release-forge");
    mkdirSync(releaseForge);
    const releaseUrl = "https://github.com/dotln-fixture/release-instance.git";
    installTargetPublicationFixture(releaseForge, releaseEnvironment, [
      { url: releaseUrl, origin: releaseOrigin },
    ]);
    git(releaseMain, ["remote", "set-url", "origin", releaseUrl]);
    const selectedSnapshot = JSON.parse(
      readFileSync(join(kit, ".claude/harness-manifest.json"), "utf8"),
    ).profiles[0].profile.runtime.snapshot;
    assert.equal(existsSync(join(releaseMain, selectedSnapshot)), false);
    const previewClose = ok(
      run(
        releaseMain,
        process.execPath,
        ["scripts/release.mjs", "close", "WO-001", "--dry-run"],
        releaseEnvironment,
      ),
      "preview release against reviewed runtime with older main installed",
    );
    const closeDetail = () => {
      const record = JSON.parse(
        readFileSync(
          join(
            releaseMain,
            "docs/control/local/retained/WO-001/release-close.json",
          ),
          "utf8",
        ),
      );
      return readFileSync(join(releaseMain, record.reportPath), "utf8");
    };
    assert.match(previewClose.stdout, /dry run: preview/u);
    assert.match(closeDetail(), /Preparing the carried release runtime/u);
    assert.doesNotMatch(closeDetail(), /Building release metadata runtime/u);
    assert.equal(git(releaseMain, ["rev-parse", "HEAD"]), oldReleaseHead);
    assert.equal(existsSync(join(releaseMain, selectedSnapshot)), false);
    const prepareClose = ok(
      run(
        releaseMain,
        process.execPath,
        ["scripts/release.mjs", "close", "WO-001"],
        releaseEnvironment,
      ),
      "prepare the reviewed release without a source build or publication",
    );
    assert.match(prepareClose.stdout, /prepared/u);
    assert.match(closeDetail(), /Preparing the carried release runtime/u);
    assert.doesNotMatch(closeDetail(), /Building release metadata runtime/u);
    assert.equal(existsSync(join(releaseMain, selectedSnapshot)), true);
    write(
      releaseMain,
      `${selectedSnapshot}/packages/kernel/dist/src/index.js`,
      "// Altered installed runtime.\n",
    );
    const alteredClose = run(
      releaseMain,
      process.execPath,
      ["scripts/release.mjs", "close", "WO-001"],
      releaseEnvironment,
    );
    assert.notEqual(alteredClose.status, 0);
    assert.match(
      `${alteredClose.stdout}${alteredClose.stderr}`,
      /reviewed installed runtime differs/u,
    );
    releaseObserve([
      "scripts/release.mjs",
      "check-surfaces",
      "--committed",
      "WO-001",
    ]);
    releaseObserve(["scripts/license-surfaces.mjs"]);
    releaseObserve(["scripts/license-surfaces.mjs", "--committed"]);
    const previewBefore = git(kit, ["status", "--porcelain"]);
    const manifest = parse(
      ok(
        run(kit, process.execPath, [
          "--input-type=module",
          "-e",
          "import {previewReleaseManifest} from './scripts/release.mjs'; console.log(JSON.stringify(previewReleaseManifest(process.cwd(), 'WO-001')));",
        ]),
        "preview kit release manifest",
      ),
    );
    assert.equal(manifest.release.application, "v0.1.0");
    const schema = Number(
      /export interface EventEnvelope[^\{]*\{\s*readonly schemaVersion:\s*(\d+)/su.exec(
        readFileSync(join(source, "packages/kernel/src/types.ts"), "utf8"),
      )[1],
    );
    assert.deepEqual(manifest.schemas.eventEnvelope, {
      min: schema,
      max: schema,
    });
    assert.equal(git(kit, ["status", "--porcelain"]), previewBefore);
    const carriedManifest = JSON.parse(
      readFileSync(join(kit, "KIT-MANIFEST.json"), "utf8"),
    );
    assert.ok(
      carriedManifest.files.some(
        (file) => file.path === "docs/releases/tag-manifest.template.json",
      ),
    );
    assert.deepEqual(
      readFileSync(join(kit, "docs/releases/tag-manifest.template.json")),
      readFileSync(join(source, "docs/releases/tag-manifest.template.json")),
    );
    write(
      kit,
      "docs/LEGAL.md",
      readFileSync(join(source, "docs/LEGAL.md"), "utf8"),
    );
    commit(kit, "docs: declare legal pins");
    const legal = releaseObserve([
      "scripts/release.mjs",
      "check-surfaces",
      "--committed",
      "WO-001",
    ]);
    assert.equal(
      (legal.stdout.match(/^PASS .*pin/gmu) ?? []).length >= 3,
      true,
      legal.stdout,
    );
    rmSync(join(kit, "docs/LEGAL.md"));
    const readme = readFileSync(join(kit, "README.md"), "utf8");
    write(
      kit,
      "README.md",
      readme.replace(
        /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/u,
        "",
      ),
    );
    commit(kit, "test: remove release declaration");
    const missingMarker = run(kit, process.execPath, [
      "scripts/release.mjs",
      "check-surfaces",
      "--committed",
      "WO-001",
    ]);
    assert.notEqual(missingMarker.status, 0);
    for (const text of [
      "<!-- DOTLN-RELEASE-BEGIN -->",
      "This source prepares DotLn-Enterprise-Starter `v0.1.0`.",
      "<!-- DOTLN-RELEASE-END -->",
    ])
      assert.ok(
        `${missingMarker.stdout}${missingMarker.stderr}`.includes(text),
      );
    write(kit, "README.md", readme);
    write(
      kit,
      "publication-body.md",
      "## Result\n\nRecord the reviewed environment.\n",
    );
    commit(kit, "docs: restore release declaration");
    const kitMain = join(scratch, "kit");
    const targetOrigin = join(scratch, "target.git"),
      targetClone = join(scratch, "target");
    git(scratch, ["init", "--bare", "-q", "-b", "main", targetOrigin]);
    git(scratch, ["clone", "-q", targetOrigin, targetClone]);
    configure(targetClone);
    write(targetClone, "source.txt", "Base target text.\n");
    commit(targetClone, "test: base target");
    git(targetClone, ["push", "-qu", "origin", "main"]);
    const targetBase = git(targetClone, ["rev-parse", "HEAD"]);
    const targetUrl = "https://github.com/dotln-fixture/target.git";
    const forge = installTargetPublicationFixture(scratch, env, [
      { url: instanceUrl, origin },
      { url: targetUrl, origin: targetOrigin },
    ]);
    git(kitMain, ["remote", "set-url", "origin", instanceUrl]);
    git(targetClone, ["remote", "set-url", "origin", targetUrl]);
    const noNotes = run(kitMain, process.execPath, [
      "scripts/worktree.mjs",
      "publish",
      "WO-001",
      "--title",
      "docs: record environment",
      "--body-file",
      "publication-body.md",
    ]);
    assert.notEqual(noNotes.status, 0);
    assert.match(
      `${noNotes.stdout}${noNotes.stderr}`,
      /release-notes file is missing/u,
    );
    assert.equal(existsSync(forge.log), false);
    kit = kitMain;
    mkdirSync(join(scratch, "Targets"));
    write(kit, "dotln.config.json", {
      ...JSON.parse(readFileSync(join(kit, "dotln.config.json"), "utf8")),
      version: 1,
      classes: { fixture: { checks: [], supports: [] } },
      repositories: {
        target: {
          baseBranch: "main",
          worktreeParent: "../Targets",
          repositoryClass: "fixture",
          authorityProfile: {
            authorityEnvelopeId: "fixture.target",
            allowedEffects: [
              "repo.read",
              "repo.write",
              "repo.test",
              "repo.push",
              "pr.open",
            ],
            deniedEffects: [],
            resourceLimits: {},
            requiredEvidence: [],
            expiresAt: Number.MAX_SAFE_INTEGER,
            revocationEventTypes: [],
          },
          gate: {
            commands: {
              test: {
                argv: [
                  process.execPath,
                  "-e",
                  "if (!require('node:fs').readFileSync('source.txt', 'utf8').includes('Reviewed')) process.exit(1)",
                ],
                timeoutMs: 5000,
              },
            },
            plain: ["test"],
            review: ["test"],
          },
        },
      },
    });
    write(kit, "docs/control/outward-vocabulary.json", publicationVocabulary);
    write(kit, "docs/control/local/terms.txt", "PrivateFixtureTerm\n");
    write(kit, "packages/skeleton/loadouts/grants.json", [publicationGrant]);
    const targetOrder = "docs/work-orders/WO-002-target-fixture.md";
    write(
      kit,
      targetOrder,
      `# WO-002 — reviewed target fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${targetBase}\n`,
    );
    commit(kit, "docs: declare target order and publication authority");
    git(kit, ["push", "-q", "origin", "main"]);
    ok(
      run(kit, process.execPath, [
        "scripts/worktree.mjs",
        "clone",
        "target",
        targetClone,
      ]),
      "register target clone",
    );
    ok(
      run(kit, process.execPath, [
        "scripts/worktree.mjs",
        "start",
        "WO-002",
        targetOrder,
      ]),
      "start target order in export",
    );
    kit = `${kitMain}-wo002`;
    const target = join(scratch, "Targets/target-wo002");
    write(target, "source.txt", "Reviewed target text.\n");
    commit(target, "fix: preserve reviewed target text");
    const reviewed = git(target, ["rev-parse", "HEAD"]);
    ok(
      run(kit, process.execPath, [
        "scripts/target-gate.mjs",
        "WO-002",
        "--review",
      ]),
      "review target gate in export",
    );
    resume("implementation-ready", ...actorArgs);
    resume("verify");
    write(kit, "docs/verifications/WO-002/VER-001.md", report);
    resume("verification-result", "pass", ...actorArgs);
    resume("final-review");
    write(kit, "docs/final-reviews/WO-002/FINAL-001.md", report);
    resume("final-review-result", "pass", ...actorArgs);
    write(
      kit,
      "docs/evidence/WO-002/decisions.md",
      "# Decisions\n\nPreserve the reviewed target behavior.\n",
    );
    resume("target-records", ...actorArgs);
    const targetEvents = readFileSync(
      join(kit, "docs/control/orders/WO-002.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse);
    const final = targetEvents.findLast(
        (event) => event.type === "FinalReviewCompleted",
      ),
      records = targetEvents.findLast(
        (event) => event.type === "TargetRecordsCommitted",
      );
    assert.equal(final.targetSubject.commit, reviewed);
    assert.equal(final.targetGate.commit, reviewed);
    assert.equal(final.evidence.productGate, undefined);
    write(
      kit,
      "publication-body.md",
      "## Result\n\nPreserve the reviewed target text and its validation.\n",
    );
    ok(
      run(kit, process.execPath, ["scripts/work-orders.mjs", "index"]),
      "target records index",
    );
    commit(kit, "docs: record target validation links");
    const targetSurfaces = releaseObserve([
      "scripts/release.mjs",
      "check-surfaces",
      "--committed",
      "WO-002",
    ]);
    assert.match(targetSurfaces.stdout, /target order records no release/u);
    const targetReadme = readFileSync(join(kit, "README.md"), "utf8");
    write(
      kit,
      "README.md",
      targetReadme.replace(
        "<!-- DOTLN-RELEASE-END -->",
        "A second release claim.\n<!-- DOTLN-RELEASE-END -->",
      ),
    );
    commit(kit, "test: extra release line");
    assert.notEqual(
      run(kit, process.execPath, [
        "scripts/release.mjs",
        "check-surfaces",
        "--committed",
        "WO-002",
      ]).status,
      0,
    );
    write(kit, "README.md", targetReadme);
    commit(kit, "docs: restore single release line");
    git(origin, ["tag", "v0.2.0", "main"]);
    const olderClaim = run(kit, process.execPath, [
      "scripts/release.mjs",
      "check-surfaces",
      "--committed",
      "WO-002",
    ]);
    assert.notEqual(olderClaim.status, 0);
    assert.match(`${olderClaim.stdout}${olderClaim.stderr}`, /release-block/u);
    git(origin, ["tag", "-d", "v0.2.0"]);
    const targetSegment = "docs/control/orders/WO-002.jsonl",
      segmentBytes = readFileSync(join(kit, targetSegment), "utf8");
    const selfPublish = () =>
      run(kitMain, process.execPath, [
        "scripts/worktree.mjs",
        "publish",
        "WO-002",
        "--title",
        "docs: record target validation",
        "--body-file",
        "publication-body.md",
      ]);
    write(
      kit,
      targetSegment,
      targetEvents
        .filter((event) => event.type !== "TargetRecordsCommitted")
        .map(JSON.stringify)
        .join("\n") + "\n",
    );
    commit(kit, "test: omit records binding");
    const unrecorded = selfPublish();
    assert.notEqual(unrecorded.status, 0);
    assert.match(unrecorded.stderr, /no TargetRecordsCommitted/u);
    assert.equal(existsSync(forge.log), false);
    write(kit, targetSegment, segmentBytes);
    commit(kit, "docs: restore records binding");
    write(kit, "docs/evidence/WO-002/decisions.md", "Duplicate decisions.\n");
    commit(kit, "test: duplicate moved decisions");
    const copied = selfPublish();
    assert.notEqual(copied.status, 0);
    assert.match(copied.stderr, /adds moved target records.*decisions.md/u);
    assert.equal(existsSync(forge.log), false);
    rmSync(join(kit, "docs/evidence/WO-002/decisions.md"));
    commit(kit, "docs: retain target record links");
    const targetPublication = ok(
      run(kitMain, process.execPath, [
        "scripts/worktree.mjs",
        "publish",
        "WO-002",
        "--target-worktree",
        "--branch",
        "fix/reviewed-target-text",
        "--title",
        "fix: preserve reviewed target text",
        "--body-file",
        "publication-body.md",
      ]),
      "publish exported target branch",
    );
    assert.ok(targetPublication.stdout.includes(records.commit));
    assert.equal(
      git(targetOrigin, ["rev-parse", "fix/reviewed-target-text"]),
      records.commit,
    );
    const recordPublication = ok(
      run(kitMain, process.execPath, [
        "scripts/worktree.mjs",
        "publish",
        "WO-002",
        "--title",
        "docs: record target validation",
        "--body-file",
        "publication-body.md",
      ]),
      "publish exported records branch without release notes",
    );
    assert.match(recordPublication.stdout, /target order records no release/u);
    assert.match(
      readFileSync(forge.body, "utf8"),
      /No launchpad code changed/u,
    );
    git(kitMain, ["merge", "--no-ff", "-qm", "Merge target records", "wo-002"]);
    git(kitMain, ["push", "-q", "origin", "main"]);
    const forgeCheckout = join(scratch, "forge-merge");
    git(scratch, ["clone", "-q", targetOrigin, forgeCheckout]);
    configure(forgeCheckout);
    git(forgeCheckout, [
      "merge",
      "--no-ff",
      "-qm",
      "Merge target change",
      "origin/fix/reviewed-target-text",
    ]);
    git(forgeCheckout, ["push", "-q", "origin", "main"]);
    const close = ok(
      run(kitMain, process.execPath, [
        "scripts/release.mjs",
        "close",
        "WO-002",
        "--publish",
      ]),
      "close exported target order",
    );
    assert.match(close.stdout, /no-release/u);
    assert.doesNotMatch(close.stdout, /Cleanup: blocked/u);
    assert.equal(existsSync(kit), false);
    assert.equal(existsSync(target), false);
    assert.equal(git(kitMain, ["tag", "--list"]), "v99.0.0");
    assert.equal(git(targetClone, ["tag", "--list"]), "");
    const card = readFileSync(
      join(kitMain, "docs/work-orders/HISTORY.md"),
      "utf8",
    );
    assert.ok(card.includes(records.commit));
    assert.match(card, /Records: target/u);
    for (const row of records.records) assert.ok(card.includes(row.path));
    assert.ok(!card.includes("../evidence/WO-002/decisions.md"));
    console.log(`INSTANCE-RELEASE-PROBE ${JSON.stringify(releaseRows)}`);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});

// The v0.81.0 release commit on core's main. Its export carries v0.81.0's own
// scripts and compiled runtime; only this checkout's dependencies are shared.
const v0810 = "3b5e29e4d36956b680ac1339aeeca887947e7987";

// The commands in the README's fenced block after the named sentence, split
// into words; the block holds only literal, unquoted words.
const documentedCommands = (readme, sentence) => {
  const from = readme.indexOf(sentence);
  assert.notEqual(from, -1, `README names: ${sentence}`);
  const block = /```sh\n([^`]*)```/u.exec(readme.slice(from));
  assert.ok(block, `README block after: ${sentence}`);
  return block[1]
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/\s+/u));
};

test("an instance exported at v0.81.0 takes this release by its README's procedure", () => {
  const scratch = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-legacy-update-")),
  );
  // This case's forge double never reaches the other case's environment.
  const local = { ...env };
  // The README runs these commands from a standalone shell. Archived code
  // cannot parse this release's wider scheduler declaration; retain its
  // finite standalone deadlines and the inherited host reservation.
  for (const key of [
    "DOTLN_GATE_LOAD_CLASS",
    "DOTLN_GATE_CONCURRENCY",
    "DOTLN_GATE_LOAD_FACTOR",
    "DOTLN_GATE_CAPACITY",
  ])
    delete local[key];
  try {
    const forgeBase = join(scratch, "forge");
    mkdirSync(forgeBase);
    const starterOrigin = join(scratch, "starter.git"),
      forkOrigin = join(scratch, "fork.git");
    const starterUrl = "https://github.com/dotln-fixture/starter-fixture.git",
      forkUrl = "https://github.com/dotln-fixture/fork.git";
    const forge = installTargetPublicationFixture(forgeBase, local, [
      { url: starterUrl, origin: starterOrigin },
      { url: forkUrl, origin: forkOrigin },
    ]);
    const exec = (cwd, file, args) => run(cwd, file, args, local);
    const lgit = (cwd, args) =>
      ok(exec(cwd, "git", args), `git ${args.join(" ")}`).stdout.trim();
    const node = (cwd, args, label) =>
      ok(exec(cwd, process.execPath, args), label);
    const setup = (root) => {
      for (const [key, value] of [
        ["user.name", "Fixture Operator"],
        ["user.email", "fixture@example.invalid"],
        ["maintenance.auto", "false"],
        ["commit.gpgsign", "false"],
      ])
        lgit(root, ["config", key, value]);
    };
    const record = (root, message) => {
      lgit(root, ["add", "."]);
      lgit(root, ["commit", "--signoff", "-qm", message]);
    };

    // Core's history holds v0.81.0's tree, whose own launchpad exports the
    // starter, then this checkout's tree as the next release.
    const core = join(scratch, "core");
    mkdirSync(core);
    const archive = join(scratch, "v0.81.0.tar");
    lgit(repository, [
      "archive",
      "--format=tar",
      "-o",
      archive,
      v0810,
      ...[
        ".gitignore",
        ".prettierignore",
        ".prettierrc.json",
        "LICENSE",
        "LICENSE-docs",
        "NOTICE",
        "corpus",
        "package-lock.json",
        "package.json",
        "packages",
        "scripts",
        "tsconfig.json",
        "docs/LEGAL.md",
        "docs/PLAYBOOK.md",
        "docs/product/07-execution-guide.md",
        "docs/product/08-publication-compiler.md",
        "docs/publication/implementation-overlay-template.md",
      ],
    ]);
    ok(spawnSync("tar", ["-xf", archive, "-C", core]), "extract v0.81.0");
    lgit(core, ["init", "-q", "-b", "main"]);
    setup(core);
    lgit(core, [
      "remote",
      "add",
      "origin",
      "https://github.com/dotln-fixture/core.git",
    ]);
    record(core, "v0.81.0 core");
    linkDependencies(core);
    const exported = join(scratch, "export");
    node(core, ["scripts/launchpad.mjs", "export", exported], "v0.81.0 export");
    setup(exported);
    record(exported, "exported instance");
    lgit(scratch, ["clone", "-q", "--bare", exported, starterOrigin]);
    lgit(scratch, ["clone", "-q", "--bare", starterOrigin, forkOrigin]);
    const starter = join(scratch, "starter");
    lgit(scratch, ["clone", "-q", starterUrl, starter]);
    setup(starter);

    // The fork verifies WO-001 on main with v0.81.0's own scripts and leaves
    // every record uncommitted.
    const fork = join(scratch, "fork");
    lgit(scratch, ["clone", "-q", forkUrl, fork]);
    setup(fork);
    lgit(fork, ["remote", "add", "upstream", starterUrl]);
    linkDependencies(fork);
    write(fork, "docs/control/local/terms.txt", "SyntheticForbiddenTerm\n");
    write(
      fork,
      "docs/intake/fork.md",
      "Ignored synthetic intake stays in main.\n",
    );
    const resume = (root, ...args) =>
      ok(
        exec(root, process.execPath, ["scripts/resume.mjs", ...args]),
        `resume ${args[0]}`,
      );
    const savedRecords = verifyFirstOrder(fork, resume);
    assert.equal(parse(resume(fork, "status", "--json")).phase, "verified");
    for (const path of firstOrderRecords)
      assert.equal(lgit(fork, ["ls-files", "--", path]), "", path);
    // A fork-local edit to a seed the refresh rewrites survives recovery.
    write(
      fork,
      "README.md",
      readFileSync(join(fork, "README.md"), "utf8") +
        "\nRecovery fixture work.\n",
    );
    // v0.81.0's README had the fork generate its indexes on main with its own
    // scripts, which leaves the lineage index untracked there.
    node(fork, ["scripts/lineage.mjs", "index"], "v0.81.0 lineage index");
    ok(exec(fork, "npm", ["run", "--silent", "meta"]), "v0.81.0 meta");

    // Release close refreshes the starter from this checkout's tree.
    lgit(core, ["rm", "-rq", "."]);
    copyCoreSource(core);
    write(core, "docs/siblings/siblings.json", {
      schemaVersion: 1,
      siblings: [
        {
          id: "starter-fixture",
          purpose: "Fixture export",
          relation: { kind: "export", coreCommit: null },
          capabilityRows: [],
        },
      ],
    });
    write(core, "docs/control/local/repository-clones.json", {
      "starter-fixture": starter,
    });
    record(core, "this release");
    lgit(core, ["tag", "v0.82.0"]);
    linkDependencies(core);
    const head = lgit(core, ["rev-parse", "HEAD"]);
    const refreshed = node(
      core,
      [
        "--input-type=module",
        "-e",
        `import {refreshStarters} from './scripts/lib/starter-refresh.mjs'; console.log('REFRESH '+JSON.stringify(await refreshStarters({main:process.cwd(),head:${JSON.stringify(head)},tag:'v0.82.0'})));`,
      ],
      "refresh the v0.81.0 starter",
    );
    const refreshRow = JSON.parse(
      refreshed.stdout
        .split("\n")
        .find((line) => line.startsWith("REFRESH "))
        .slice(8),
    )[0];
    assert.equal(refreshRow.outcome, "refreshed", JSON.stringify(refreshRow));
    assert.deepEqual(refreshRow.rewrittenSeeds, [
      "CLAUDE.md",
      "docs/control/budgets.json",
      "docs/work-orders/WO-001-environment-truth.md",
      "README.md",
    ]);
    // A new fork of the refreshed starter still lacks the lineage index a
    // fresh export seeds; its README's first step generates that index
    // before the first document gate, whose check names the remedy.
    const newFork = join(scratch, "new-fork");
    lgit(scratch, ["clone", "-q", starterUrl, newFork]);
    assert.ok(
      readFileSync(join(newFork, "README.md"), "utf8")
        .replace(/\s+/gu, " ")
        .includes(
          "If `docs/lineage/README.md` is absent, as in a fork of a starter exported by an older release even after a starter refresh, run `node scripts/lineage.mjs index` and commit the generated index with the fork's setup commit",
        ),
      "the first step tells an older fork to generate and commit the index",
    );
    const unindexed = exec(newFork, process.execPath, [
      "scripts/lineage.mjs",
      "index",
      "--check",
    ]);
    assert.equal(unindexed.status, 1);
    assert.equal(
      unindexed.stderr,
      "Missing docs/lineage/README.md; run node scripts/lineage.mjs index\n",
    );
    node(newFork, ["scripts/lineage.mjs", "index"], "index the new fork");
    setup(newFork);
    record(newFork, "set up the fork");
    assert.equal(lgit(newFork, ["status", "--porcelain"]), "");
    node(
      newFork,
      ["scripts/lineage.mjs", "index", "--check"],
      "check the new fork's index",
    );

    // v0.81.0's own reader refuses the kit path this release adds, so the
    // README previews with the incoming revision's launchpad instead.
    lgit(fork, ["fetch", "-q", "upstream"]);
    const own = exec(fork, process.execPath, [
      "scripts/launchpad.mjs",
      "preview",
      "--from",
      "upstream/main",
    ]);
    assert.notEqual(own.status, 0);
    assert.match(
      own.stderr,
      /^error: malformed prior manifest entry in upstream\/main:KIT-MANIFEST\.json: \S+$/mu,
    );
    const readme = lgit(fork, ["show", "upstream/main:README.md"]);
    const prose = readme.replace(/\s+/gu, " ");
    const recovery = prose.slice(
      prose.indexOf("The session in `main` first stops competing writers"),
      prose.indexOf("The operator then opens a session in `wo-001`"),
    );
    const restoredAt = recovery.indexOf("apply <stash hash>");
    const statusAt = recovery.indexOf("`npm run resume -- status`");
    assert.ok(
      restoredAt >= 0 && statusAt > restoredAt,
      "the recorded phase is checked after restoring the saved stash",
    );
    // The worktree's files belong to the session opened there.
    assert.ok(
      prose.includes(
        "The session started in `main` writes no other file in that worktree",
      ),
    );
    assert.ok(
      prose.includes(
        "The operator then opens a session in `wo-001`. That session runs `node scripts/bootstrap.mjs`, registers its own ignored local-terms list",
      ),
    );
    assert.ok(!prose.includes("The session moves to that directory"));
    // The export seeds the lineage index and bootstrap never writes it.
    assert.ok(
      !prose.includes("bootstrap generates it if an older instance lacks it"),
    );
    assert.ok(!prose.includes("Two READMEs are generated rather than seeded"));
    // The phrase itself points an older session at this README.
    assert.ok(
      prose.includes(
        "recover WO-001 into its own worktree by the refreshed starter's README",
      ),
    );
    // The steps below follow the recovery and update pull request paragraphs.
    for (const sentence of [
      "The update reaches the instance's `main` through its own update pull request",
      "reviews and merges with a merge commit, so `main` keeps the starter's history",
      "The operator merges each pull request with a merge commit",
      "If `git status --porcelain --untracked-files=all` then lists an untracked lineage index (`docs/lineage/README.md` under the default documentation root), the session deletes that file before the stash",
      "The export seeds the lineage index; for an older export, step 1 or the update branch of §Taking upstream updates generates and commits it, and bootstrap never writes it",
      "regenerates it after ledger edits and generates it for an older export, in step 1 or on the update branch, and bootstrap never writes it",
    ])
      assert.ok(prose.includes(sentence), sentence);
    const manifest = readFileSync(join(fork, "KIT-MANIFEST.json"));
    const worktrees = lgit(fork, ["worktree", "list", "--porcelain"]);
    const status = lgit(fork, ["status", "--porcelain=v1"]);
    let preview;
    for (const [program, ...args] of documentedCommands(
      readme,
      "Inside an instance, its own session takes a starter update",
    )) {
      assert.ok(["git", "node"].includes(program), program);
      const result = ok(
        exec(fork, program === "node" ? process.execPath : program, args),
        `documented ${program} ${args.join(" ")}`,
      );
      if (program === "node") preview = result.stdout;
    }
    assert.match(
      preview,
      /^kit files: \d+ replaced; \d+ added; \d+ removed; 0 refused; \d+ unchanged\.$/mu,
    );
    assert.match(
      preview,
      /^add: docs\/releases\/tag-manifest\.template\.json$/mu,
    );
    assert.match(
      preview,
      new RegExp(`^incoming: ${head} \\(v0\\.82\\.0\\)$`, "mu"),
    );
    // The preview writes nothing and leaves no worktree behind.
    assert.deepEqual(readFileSync(join(fork, "KIT-MANIFEST.json")), manifest);
    assert.equal(lgit(fork, ["worktree", "list", "--porcelain"]), worktrees);
    assert.equal(lgit(fork, ["status", "--porcelain=v1"]), status);

    // As the README directs, the session deletes the untracked generated
    // lineage index before the stash: the update branch commits that path,
    // and a stash holding it could not be applied over the committed copy.
    assert.match(
      lgit(fork, ["status", "--porcelain", "--untracked-files=all"]),
      /^\?\? docs\/lineage\/README\.md$/mu,
    );
    rmSync(join(fork, "docs/lineage/README.md"));
    // The update reaches the fork's main through its own pull request, merged
    // with a merge commit, before wo-001 is cut from that main.
    lgit(fork, [
      "stash",
      "push",
      "--include-untracked",
      "-m",
      "WO-001 main recovery",
    ]);
    const stash = lgit(fork, ["rev-parse", "refs/stash"]);
    lgit(fork, ["switch", "-q", "-c", "chore/starter-update"]);
    lgit(fork, ["merge", "-q", "upstream/main"]);
    linkDependencies(fork);
    node(fork, ["scripts/harness.mjs", "emit"], "re-emit the update");
    node(fork, ["scripts/lineage.mjs", "index"], "index the update branch");
    if (lgit(fork, ["status", "--porcelain=v1"]))
      record(fork, "chore: re-emit");
    lgit(fork, ["push", "-q", "origin", "chore/starter-update"]);
    write(
      scratch,
      "update-body.md",
      "## Result\n\nTake the refreshed starter.\n",
    );
    ok(
      exec(fork, "gh", [
        "pr",
        "create",
        "--repo",
        "dotln-fixture/fork",
        "--base",
        "main",
        "--head",
        "chore/starter-update",
        "--title",
        "chore: take starter v0.82.0",
        "--body-file",
        join(scratch, "update-body.md"),
      ]),
      "open the update pull request",
    );
    const forgeMerge = join(scratch, "forge-merge");
    lgit(scratch, ["clone", "-q", forkOrigin, forgeMerge]);
    setup(forgeMerge);
    lgit(forgeMerge, [
      "merge",
      "--no-ff",
      "-q",
      "-m",
      "Merge pull request #7 from chore/starter-update",
      "origin/chore/starter-update",
    ]);
    lgit(forgeMerge, ["push", "-q", "origin", "main"]);
    lgit(fork, ["switch", "-q", "main"]);
    lgit(fork, ["fetch", "-q", "origin"]);
    lgit(fork, ["merge", "--ff-only", "-q", "origin/main"]);
    node(fork, ["scripts/bootstrap.mjs"], "bootstrap main after the update");
    assert.equal(
      lgit(fork, ["status", "--porcelain", "--untracked-files=all"]),
      "",
    );
    assert.equal(
      lgit(fork, ["rev-parse", "main"]),
      lgit(fork, ["rev-parse", "origin/main"]),
    );
    // main keeps the starter's history, so the next update merges cleanly.
    lgit(fork, ["merge-base", "--is-ancestor", "upstream/main", "main"]);
    const recovered = join(scratch, "fork-wo001");
    lgit(fork, ["worktree", "add", "-q", "-b", "wo-001", recovered, "main"]);
    lgit(fork, ["-C", recovered, "stash", "apply", stash]);
    // The applied stash leaves the update's committed lineage index intact.
    assert.equal(
      readFileSync(join(recovered, "docs/lineage/README.md"), "utf8"),
      ok(
        exec(recovered, "git", ["show", "HEAD:docs/lineage/README.md"]),
        "committed lineage index",
      ).stdout,
    );

    // The session opened in wo-001 prepares and registers its own files.
    linkDependencies(recovered);
    node(recovered, ["scripts/bootstrap.mjs"], "bootstrap wo-001");
    write(
      recovered,
      "docs/control/local/terms.txt",
      readFileSync(join(fork, "docs/control/local/terms.txt"), "utf8"),
    );
    for (const [path, bytes] of savedRecords)
      assert.deepEqual(readFileSync(join(recovered, path)), bytes, path);
    assert.match(
      readFileSync(join(recovered, "README.md"), "utf8"),
      /Recovery fixture work/u,
    );
    assert.equal(lgit(fork, ["rev-parse", "refs/stash"]), stash);
    assert.ok(existsSync(join(fork, "docs/intake/fork.md")));
    assert.equal(
      parse(resume(recovered, "status", "--json")).phase,
      "verified",
    );
    node(
      recovered,
      ["scripts/release.mjs", "prepare", "--local"],
      "prepare the recovered order",
    );
    resume(recovered, "final-review");
    write(recovered, "docs/final-reviews/WO-001/FINAL-001.md", report);
    resume(recovered, "final-review-result", "pass", ...actorArgs);
    for (const [path, bytes] of savedRecords)
      assert.deepEqual(
        readFileSync(join(recovered, path)).subarray(0, bytes.length),
        bytes,
        `${path} survives final review`,
      );
    record(recovered, "docs: record recovered environment");
    node(
      recovered,
      ["scripts/release.mjs", "check-surfaces", "--committed", "WO-001"],
      "committed recovered release surfaces",
    );
    write(
      recovered,
      "publication-body.md",
      "## Result\n\nRecord the recovered environment.\n",
    );
    record(recovered, "docs: describe recovery");
    // wo-001's pull request carries only WO-001's own commits.
    assert.deepEqual(
      lgit(recovered, ["log", "--format=%s", "origin/main..HEAD"]).split("\n"),
      ["docs: describe recovery", "docs: record recovered environment"],
    );
    const changed = lgit(recovered, [
      "diff",
      "--name-only",
      "origin/main...HEAD",
    ]).split("\n");
    assert.ok(!changed.includes("KIT-MANIFEST.json"), changed.join(", "));
    assert.ok(
      changed.every((path) => !path.startsWith("scripts/")),
      changed.join(", "),
    );
    const published = exec(fork, process.execPath, [
      "scripts/worktree.mjs",
      "publish",
      "WO-001",
      "--title",
      "docs: record recovered environment",
      "--body-file",
      "publication-body.md",
    ]);
    const output = `${published.stdout}${published.stderr}`;
    assert.match(published.stdout, /^PASS /mu);
    assert.notEqual(published.status, 0);
    assert.match(output, /notes.*missing|missing.*notes/u);
    assert.doesNotMatch(output, /^FAIL /mu);
    assert.deepEqual(
      readFileSync(forge.log, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line))
        .filter(([group, verb]) => group === "pr" && verb === "create")
        .map((args) => args[args.indexOf("--head") + 1]),
      ["chore/starter-update"],
      "only the update pull request was opened",
    );
    // The recovered order's merge must not collide with generated untracked
    // files on main, and the next ordinary start must accept that checkout.
    lgit(fork, ["merge", "--ff-only", "wo-001"]);
    assert.equal(
      lgit(fork, ["status", "--porcelain", "--untracked-files=all"]),
      "",
    );
    write(
      fork,
      "docs/work-orders/WO-002-next.md",
      "# WO-002 — Next order (v0.1.1)\n\n**Model:** any capable model.\n**Effort:** executor max; verifier xhigh; reviewer xhigh.\n**Track:** delivery\n**Release classification:** patch.\n\n**Acceptance criteria:**\n\n1. The next order starts.\n",
    );
    record(fork, "docs: plan next order");
    lgit(fork, ["push", "origin", "main"]);
    node(
      fork,
      [
        "scripts/worktree.mjs",
        "start",
        "WO-002",
        "docs/work-orders/WO-002-next.md",
      ],
      "start after the documented update",
    );
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
