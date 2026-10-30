import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  createFixtureRoot,
  excludeFixtureOwnership,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";
import {
  harnessInstallation,
  emitHarness,
} from "../../../scripts/lib/harness.mjs";
import { coveringGateCheck } from "../../../scripts/lib/gate-reuse.mjs";
import {
  activeGateRuns,
  gateCodeIdentity,
  gateTreeHash,
  recordGateChecks,
} from "../../../scripts/lib/gate-evidence.mjs";
import { requireDocumentRow } from "../../../scripts/lib/handoff-ledger.mjs";
import {
  planningDocumentPath,
  planningSkeleton,
} from "../../../scripts/lib/planning-document.mjs";
import {
  profileGuidance,
  surfaceContracts,
  surfaces,
  writingGuidance,
} from "../../../scripts/lib/reader-profiles.mjs";
import { seedReaderProfiles } from "../../../scripts/test-reader-fixture.mjs";

// Independent verification evidence. All mutations except this probe's result
// are confined to registered disposable fixtures; no subject file is changed.
const root = realpathSync(resolve(import.meta.dirname, "../../.."));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const read = (name) => readFileSync(join(root, name), "utf8");
const git = (where, args) =>
  execFileSync("git", ["-C", where, ...args], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }).trimEnd();
assert.equal(git(root, ["rev-parse", "--show-toplevel"]), root);
assert.equal(activeGateRuns(root).length, 0);
const results = [];
const fixtures = [];
const write = (where, name, value) => {
  const destination = join(where, name);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, value);
};
const fixture = (branch = "main") => {
  const where = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-ver005-")),
  );
  fixtures.push(where);
  git(where, ["init", "-q", "-b", branch]);
  assert.equal(git(where, ["rev-parse", "--show-toplevel"]), where);
  excludeFixtureOwnership(where);
  write(
    where,
    ".gitignore",
    "docs/control/local/\n.runtime/\n.dotln-owner.json\n",
  );
  return where;
};
const check = async (name, probe) => {
  try {
    results.push({ name, passed: true, observations: await probe() });
  } catch (error) {
    results.push({
      name,
      passed: false,
      error: String(error.message)
        .replaceAll(root, "<subject>")
        .replaceAll(tmpdir(), "<temporary>"),
    });
  }
};
const commitFixture = (where) => {
  git(where, ["add", "."]);
  git(where, [
    "-c",
    "user.name=Synthetic fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Synthetic verification input",
  ]);
};

try {
  await check(
    "current complete review covers the current selection",
    async () => {
      const listed = execFileSync(
        process.execPath,
        ["scripts/test-runner.mjs", "--review", "--list", "--selected"],
        { cwd: root, encoding: "utf8" },
      );
      const suites = listed
        .split("\n")
        .map((line) => /^(\S+) — /u.exec(line)?.[1])
        .filter(Boolean);
      assert.ok(suites.length > 0);
      const found = await coveringGateCheck(root, "npm test", suites);
      assert.ok(
        found.row,
        "No standing complete row covers the current selection",
      );
      assert.equal(found.location, "worktree");
      return {
        codeIdentity: found.codeIdentity,
        suites,
        requiredCount: suites.length,
        exitCode: found.row.exitCode,
        recordedAt: found.row.recordedAt,
        durationMs: found.row.durationMs,
        evidenceRef: found.row.evidenceRef,
        displaced: found.displaced?.tasks ?? [],
      };
    },
  );

  await check("base parity and removal", () => {
    const unchanged = [
      "scripts/lib/plan-failures.mjs",
      "scripts/lib/plan-receipts.mjs",
      "packages/skeleton/src/gate-evidence.mjs",
      "scripts/lib/github-body.mjs",
    ];
    for (const name of unchanged)
      assert.equal(git(root, ["diff", "3db7571f", "--", name]), "", name);
    const hostDiff = git(root, [
      "diff",
      "--unified=0",
      "3db7571f",
      "--",
      "packages/skeleton/src/harness-host.ts",
    ]);
    const added = hostDiff
      .split("\n")
      .filter((line) => line.startsWith("+") && !line.startsWith("+++"));
    const removed = hostDiff
      .split("\n")
      .filter((line) => line.startsWith("-") && !line.startsWith("---"));
    assert.equal(added.length, 10);
    assert.equal(removed.length, 0);
    assert.match(
      added.join("\n"),
      /harnessPromptLine\(input.prompt\).text.startsWith\("quality pass:"\)/,
    );
    const resumeDiff = git(root, [
      "diff",
      "--unified=0",
      "3db7571f",
      "--",
      "scripts/resume.mjs",
    ]);
    const resumeLines = resumeDiff
      .split("\n")
      .filter((line) => /^[+-]/.test(line) && !/^(---|\+\+\+)/.test(line));
    assert.equal(resumeLines.length, 2);
    assert.ok(resumeLines.every((line) => line.includes("Handoff evidence:")));
    for (const name of [
      "scripts/lib/direction-ledger.mjs",
      "scripts/lib/artifact-comparison.mjs",
      "packages/skeleton/fixtures/wo235-control-baseline.json",
    ])
      assert.equal(existsSync(join(root, name)), false, name);
    assert.doesNotMatch(
      read("packages/skeleton/src/harness-host.ts"),
      /Private reply checklist|host-agent-message|host-queued|readPromptRoute|operatorObservations/,
    );
    return {
      unchanged,
      hostAddedLines: added.length,
      resumeChangedLines: resumeLines.length,
    };
  });

  await check(
    "installed roles, both generated settings, oracle chain and pinned runtime",
    () => {
      const baseline = JSON.parse(
        read("packages/skeleton/fixtures/wo235-removal-role-baseline.json"),
      );
      let links = 0;
      for (let current = baseline; current.historicalBaseline;) {
        const bytes = readFileSync(
          join(root, "packages/skeleton/fixtures", current.historicalBaseline),
        );
        if (current.historicalSha256)
          assert.equal(hash(bytes), current.historicalSha256);
        current = JSON.parse(bytes);
        links++;
      }
      for (const economy of [true, false]) {
        const installation = harnessInstallation({
          supports: { "tinkerer-economy": economy },
        });
        const roles = installation.files.filter((file) =>
          file.path.endsWith("/SKILL.md"),
        );
        assert.equal(roles.length, 12);
        for (const file of roles) {
          assert.equal(
            hash(file.contents),
            (economy ? baseline.roles : baseline.optOutRoles)[file.path],
          );
          if (economy) assert.equal(read(file.path), file.contents);
          for (const phrase of [
            "`quality pass: <target>`",
            "preserve immutable records",
            "a previous instance is evidence",
            "Byte counts and structural passes do not establish usefulness",
            "Integrate each change",
            "No sentence count or size target",
          ])
            assert.ok(
              file.contents.includes(phrase),
              file.path + ": " + phrase,
            );
          assert.doesNotMatch(
            file.contents,
            /private reply checklist|whole batch|host notifications are not questions|unresolved earlier aims|register never changes/i,
          );
        }
      }
      const hook = read(".claude/hooks/session.mjs");
      const snapshot =
        /\.\.\/\.\.\/(\.runtime\/harness\/[^/]+)\/packages\/skeleton\/dist\/src\/harness-host.js/.exec(
          hook,
        )?.[1];
      assert.ok(snapshot, "Installed session hook names its pinned runtime");
      for (const name of [
        "harness-host.js",
        "document-quality.js",
        "observed-facts.js",
      ])
        assert.equal(
          hash(
            readFileSync(
              join(root, snapshot, "packages/skeleton/dist/src", name),
            ),
          ),
          hash(readFileSync(join(root, "packages/skeleton/dist/src", name))),
        );
      return {
        installedRoles: 12,
        settings: 2,
        historicalLinks: links,
        runtimeFilesCompared: 3,
        startupCost: baseline.startupCost.profiles,
      };
    },
  );

  await check(
    "writing guidance preserves contracts and context when example lengths vary",
    () => {
      const where = fixture();
      seedReaderProfiles(where);
      const checked = [];
      for (const surface of surfaces) {
        const before = writingGuidance(surface, where);
        assert.match(before, /^Contract:/);
        assert.match(before.split("\n")[1], /^Document kind: record\. Reader:/);
        for (const { file, heading } of surfaceContracts[surface].sections)
          assert.ok(
            read("docs/product/" + file).includes("## " + heading + "\n"),
          );
        for (const { path, name } of surfaceContracts[surface].rules)
          assert.ok(read(path).includes(name));
        for (const [index, variant] of [
          "reader",
          "balanced",
          "record",
        ].entries()) {
          const name = `docs/publication/examples/${surface}/${variant}.md`;
          const context =
            readFileSync(join(where, name), "utf8") +
            "Useful independent context.\n".repeat((index + 1) * 71);
          write(where, name, context);
          assert.equal(writingGuidance(surface, where), before);
          assert.equal(readFileSync(join(where, name), "utf8"), context);
        }
        assert.doesNotMatch(
          before,
          /Nearest example:|Best comparable:|shorten/,
        );
        checked.push(surface);
      }
      write(
        where,
        "docs/publication/examples/releaseNotes/balanced.md",
        "Malformed optional illustration.\n",
      );
      assert.match(
        writingGuidance("releaseNotes", where),
        /^Contract:[\s\S]*Useful information[\s\S]*unavailable:/,
      );
      assert.throws(
        () => profileGuidance("releaseNotes", where),
        /expected JSON front matter/,
      );
      write(
        where,
        "dotln.config.json",
        JSON.stringify({ version: 1, roots: { product: "handbook/product" } }),
      );
      assert.match(
        writingGuidance("releaseNotes", where),
        /^Contract: handbook\/product\//,
      );
      return {
        surfaces: checked,
        exampleVariations: checked.length * 3,
        malformedExampleRetainsGuidance: true,
        relocatedProductRoot: true,
      };
    },
  );

  await check(
    "planning skeleton matches the declared headings and relocated root",
    async () => {
      const headings = [
        "Dispatch and capture",
        "Readings",
        "Orders filed and amended",
        "Register",
        "NoOps",
        "Sequence",
        "Write-backs and ceilings",
        "Process cost",
        "Validation",
      ];
      const text = planningSkeleton("independent-verification", "2030-01-02");
      assert.deepEqual(
        [...text.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
        headings,
      );
      assert.doesNotMatch(text, /direction|ledger|smallest|shorten/i);
      const guide = read("docs/product/07-execution-guide.md");
      const paragraph = guide.slice(
        guide.indexOf("`plan start <slug>` writes"),
        guide.indexOf("Standard artifacts, all doc-only:"),
      );
      for (const heading of headings)
        assert.ok(
          paragraph.toLowerCase().includes(heading.toLowerCase()),
          heading,
        );
      const where = fixture();
      write(
        where,
        "dotln.config.json",
        JSON.stringify({ version: 1, roots: { planning: "records/plans" } }),
      );
      assert.equal(
        planningDocumentPath(where, "planning/2030-01-02-independent"),
        "records/plans/independent-2030-01-02.md",
      );
      assert.equal(planningDocumentPath(where, "main"), null);
      const { main: plan } = await import("../../../scripts/refute-plan.mjs");
      const start = async (repo, slug) => {
        const original = console.log;
        console.log = () => {};
        try {
          return await plan(["start", slug], repo);
        } finally {
          console.log = original;
        }
      };
      const date = new Date().toISOString().slice(0, 10);
      const normal = fixture();
      commitFixture(normal);
      const started = await start(normal, "independent-ver005");
      assert.equal(git(normal, ["branch", "--show-current"]), started.branch);
      assert.deepEqual(
        [
          ...readFileSync(join(normal, started.document), "utf8").matchAll(
            /^## (.+)$/gm,
          ),
        ].map((match) => match[1]),
        headings,
      );
      const collision = fixture();
      commitFixture(collision);
      git(collision, ["branch", `planning/${date}-independent-ver005`]);
      await assert.rejects(
        start(collision, "independent-ver005"),
        /already exists/,
      );
      assert.equal(git(collision, ["branch", "--show-current"]), "main");
      assert.equal(
        existsSync(
          join(collision, `docs/planning/independent-ver005-${date}.md`),
        ),
        false,
      );
      assert.equal(git(collision, ["status", "--porcelain"]), "");
      const existing = fixture();
      const existingPath = `docs/planning/independent-ver005-${date}.md`;
      write(existing, existingPath, "Existing planning evidence.\n");
      commitFixture(existing);
      await assert.rejects(
        start(existing, "independent-ver005"),
        /Planning document already exists/,
      );
      assert.equal(git(existing, ["branch", "--show-current"]), "main");
      assert.equal(
        readFileSync(join(existing, existingPath), "utf8"),
        "Existing planning evidence.\n",
      );
      return {
        headings,
        relocatedPlanningRoot: true,
        actualStart: true,
        failedBranchPreparationRemoved: true,
        existingDocumentPreserved: true,
      };
    },
  );

  await check(
    "generated prompt hook uses only the current first content line",
    () => {
      const where = fixture("wo-999");
      write(
        where,
        "CLAUDE.md",
        "# Synthetic clean-room fixture\nPersonal synthetic source only.\n",
      );
      write(
        where,
        "package.json",
        JSON.stringify({ private: true, type: "module" }),
      );
      write(
        where,
        "scripts/resume.mjs",
        'console.log(JSON.stringify({workOrder:"WO-999",workOrderPath:"docs/work-orders/WO-999-fixture.md",phase:"active",latestVerdict:null}));\n',
      );
      write(
        where,
        "docs/work-orders/WO-999-fixture.md",
        "# Synthetic fixture\n",
      );
      write(
        where,
        "docs/control/orders/WO-999.jsonl",
        JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
          "\n",
      );
      commitFixture(where);
      emitHarness(where);
      const controlBefore = readFileSync(
        join(where, "docs/control/orders/WO-999.jsonl"),
      );
      const session = `ver005-synthetic-${randomUUID()}`;
      const transcript = join(where, "docs/control/local/history.jsonl");
      const command = "quality pass: the closing paragraph of README.md";
      const observations = [];
      const invoke = (prompt, rows = [], extra = {}, hook = "session") => {
        write(
          where,
          "docs/control/local/history.jsonl",
          rows.map((row) => JSON.stringify(row) + "\n").join(""),
        );
        const run = spawnSync(
          process.execPath,
          [join(where, `.claude/hooks/${hook}.mjs`)],
          {
            cwd: where,
            env: {
              ...process.env,
              CODEX_THREAD_ID: "",
              COPILOT_AGENT_SESSION_ID: "",
              CLAUDE_PID: String(process.pid),
            },
            input: JSON.stringify({
              cwd: where,
              session_id: session,
              hook_event_name: hook === "finish" ? "Stop" : "UserPromptSubmit",
              prompt,
              transcript_path: transcript,
              ...extra,
            }),
            encoding: "utf8",
            timeout: 30_000,
            maxBuffer: 1024 * 1024,
          },
        );
        assert.equal(run.status, 0, run.stderr);
        const reply = JSON.parse(run.stdout);
        assert.notEqual(reply.decision, "block");
        const context = reply.hookSpecificOutput?.additionalContext ?? "";
        assert.doesNotMatch(context, /Private reply checklist/);
        assert.doesNotMatch(
          reply.systemMessage ?? "",
          /`quality pass: <target>`/,
        );
        return context.includes("`quality pass: <target>`");
      };
      assert.equal(invoke(command), true);
      const history = [
        { type: "user", message: { role: "user", content: command } },
      ];
      for (const envelope of [
        "<task-notification>\n" + command + "\n</task-notification>",
        '<agent-message from="synthetic">\n' + command + "\n</agent-message>",
        "A quoted command follows.\n" + command,
      ]) {
        for (const midTurn of [false, true]) {
          const rows = [
            ...history,
            {
              type: "queue-operation",
              operation: "enqueue",
              content: envelope,
            },
            ...(midTurn
              ? [
                  {
                    type: "assistant",
                    message: {
                      role: "assistant",
                      content: [
                        { type: "text", text: "Synthetic continuation." },
                      ],
                    },
                  },
                ]
              : []),
          ];
          assert.equal(invoke(envelope, rows), false);
          observations.push({
            case: envelope.startsWith("<task")
              ? "task envelope"
              : envelope.startsWith("<agent")
                ? "agent envelope"
                : "prose lead",
            midTurn,
            guided: false,
          });
        }
      }
      assert.equal(
        invoke(command, [
          ...history,
          { type: "queue-operation", operation: "enqueue", content: command },
        ]),
        true,
      );
      for (const prompt of [
        "\n\n" + command,
        "```text\n" + command + "\n```",
        "quality pass:",
      ])
        assert.equal(invoke(prompt), true);
      for (const prompt of [
        "> " + command,
        "Please explain " + command,
        "ordinary text",
      ])
        assert.equal(invoke(prompt), false);
      try {
        invoke("analysis: synthetic precedence probe");
        assert.equal(invoke(command), false);
      } finally {
        invoke("analysis: off");
      }
      assert.equal(invoke(command), true);
      for (const reentry of [false, true]) {
        write(
          where,
          "docs/evidence/WO-999/directions.jsonl",
          "malformed retired ledger\n",
        );
        assert.equal(
          invoke("", [], { stop_hook_active: reentry }, "finish"),
          false,
        );
      }
      assert.deepEqual(
        readFileSync(join(where, "docs/control/orders/WO-999.jsonl")),
        controlBefore,
      );
      return {
        historyVariations: observations,
        queuedCommandGuidedUnderAmendedContract: true,
        leadingForms: 3,
        noncommands: 3,
        analysisPrecedence: true,
        stopAdmissions: 2,
        lifecycleLogUnchanged: true,
      };
    },
  );

  await check(
    "document rows reject later records and the current dispatch's stale tree",
    async () => {
      const actual = await requireDocumentRow(root);
      assert.ok(
        actual.refusal,
        "The dispatch changed the checked document candidate",
      );
      const where = fixture("wo-999");
      const paths = [
        "docs/evidence/WO-999/decisions.md",
        "docs/verifications/WO-999/VER-001.md",
        "docs/lineage/decisions-index.md",
        "docs/evidence/WO-999/new-record.md",
      ];
      for (const name of paths.slice(0, -1))
        write(where, name, "Checked synthetic record.\n");
      const row = {
        checkId: "npm run test:docs",
        codeIdentity: gateCodeIdentity(where),
        treeHash: gateTreeHash(where),
        subject: "synthetic verification matrix; no real gate claimed",
        executed: true,
        exitCode: 0,
        durationMs: 1,
        requiredSuites: ["docs-check"],
        evidenceRef: "fixture:ver005-exact-tree",
        recordedAt: "2030-01-02T00:00:01Z",
        cases: [
          {
            name: "docs-check",
            executed: true,
            exitCode: 0,
            durationMs: 1,
            finishedAt: "2030-01-02T00:00:00Z",
          },
        ],
      };
      recordGateChecks(where, [row]);
      assert.ok((await requireDocumentRow(where)).row);
      const outcomes = [];
      for (const name of paths) {
        write(where, name, "Changed synthetic record.\n");
        assert.notEqual(gateTreeHash(where), row.treeHash);
        assert.ok((await requireDocumentRow(where)).refusal);
        outcomes.push({ path: name, staleRowRefused: true });
        if (name !== paths.at(-1))
          write(where, name, "Checked synthetic record.\n");
      }
      return { actualStaleTreeRefused: true, syntheticMutations: outcomes };
    },
  );

  await check("external dependencies unchanged", () => {
    const before = JSON.parse(
      git(root, ["show", "3db7571f:package-lock.json"]),
    );
    const after = JSON.parse(read("package-lock.json"));
    const changes = [];
    for (const name of new Set([
      ...Object.keys(before.packages),
      ...Object.keys(after.packages),
    ])) {
      if (
        JSON.stringify(before.packages[name]) ===
        JSON.stringify(after.packages[name])
      )
        continue;
      changes.push(name);
      assert.ok(["packages/skeleton", "packages/console"].includes(name), name);
      const normalize = (entry, skeletonVersion) => {
        const normalized = structuredClone(entry);
        if (name === "packages/console") {
          assert.equal(
            normalized.dependencies["@dotln/skeleton"],
            skeletonVersion,
          );
          normalized.dependencies["@dotln/skeleton"] = "<internal-version>";
        } else normalized.version = "<internal-version>";
        return normalized;
      };
      assert.deepEqual(
        normalize(
          before.packages[name],
          before.packages["packages/skeleton"].version,
        ),
        normalize(
          after.packages[name],
          after.packages["packages/skeleton"].version,
        ),
      );
    }
    return { internalVersionEntriesOnly: changes };
  });
} finally {
  for (const where of fixtures)
    removeTemporaryPath(where, { recursive: true, force: true });
}

const result = {
  verification: "VER-005",
  probeCorrections: [
    "The initial dependency assertion allowed the skeleton package version but omitted its console dependency pin. The checked lockfile diff changes only those two internal version fields; the corrected assertion checks both against their respective skeleton versions and compares every other field unchanged.",
  ],
  recordedAt: new Date().toISOString(),
  codeIdentity: gateCodeIdentity(root),
  results,
};
writeFileSync(
  join(root, "docs/evidence/WO-235/verification-005.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      verification: result.verification,
      checks: results.map(({ name, passed, error }) => ({
        name,
        passed,
        ...(error ? { error } : {}),
      })),
    },
    null,
    2,
  ),
);
if (results.some((row) => !row.passed)) process.exitCode = 1;
