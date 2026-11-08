// Independent VER-001 probes. All changed inputs are synthetic and live in
// registered temporary repositories. Run under the harness bounded wrapper.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  createFixtureRoot,
  excludeFixtureOwnership,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";
import { checkDocs } from "../../../scripts/docs-check.mjs";
import { branchChanges } from "../../../scripts/lib/branch-changes.mjs";
import {
  branchTermFindings,
  branchTermLines,
} from "../../../scripts/lib/branch-terms.mjs";
import { publishLaunchpadBranch } from "../../../scripts/lib/launchpad-publish.mjs";
import { recordOperatorMessage } from "../../../packages/skeleton/dist/src/harness-host.js";
import { dispatchJournalDirectory } from "../../../packages/skeleton/src/dispatch-journal.mjs";
import {
  checkRulesRecorded,
  renderRulesRecordedBlock,
} from "../../../scripts/lib/planning-document.mjs";
import { operationalFailures } from "../../../scripts/lib/plan-failures.mjs";
import {
  measureColdStarts,
  readBudgets,
  budgetVerdict,
} from "../../../scripts/lib/process-budget.mjs";
import {
  operatorWordsRule,
  workerNoPrintRules,
} from "../../../packages/compiler/dist/src/index.js";
import { discoverHarness } from "../../../scripts/discover.mjs";
import { uncommittedRecordInputs } from "../../../scripts/lib/target-records.mjs";
import { criticalNotes } from "../../../scripts/release.mjs";

const root = resolve(import.meta.dirname, "../../..");
const results = [];
const sha = (text) => createHash("sha256").update(text).digest("hex");
function probe(name, run) {
  const detail = run();
  results.push({ name, passed: true, ...detail });
}
function fixture(run) {
  const temporary = createFixtureRoot(join(tmpdir(), "dotln-wo259-verifier-"));
  const put = (name, text) => {
    mkdirSync(dirname(join(temporary, name)), { recursive: true });
    writeFileSync(join(temporary, name), text);
  };
  const git = (...args) =>
    execFileSync(
      "git",
      [
        "-C",
        temporary,
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "-c",
        "commit.gpgsign=false",
        "-c",
        "maintenance.auto=false",
        ...args,
      ],
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
  try {
    git("init", "-q", "-b", "main");
    excludeFixtureOwnership(temporary);
    put(
      ".gitignore",
      "records/intake/\nrecords/control/local/\ndocs/control/local/\n",
    );
    put(
      "dotln.config.json",
      JSON.stringify({ version: 1, roots: { docs: "records" } }),
    );
    put("records/product/00-fixture.md", "# Product\n\n## Stable\n\nA fact.\n");
    const baseline = {
      schemaVersion: 1,
      products: {},
      dispatches: {},
      links: [],
    };
    put("records/control/doc-baseline.json", JSON.stringify(baseline));
    git("add", ".");
    git("commit", "-qm", "fixture base");
    git("switch", "-q", "-c", "wo-999");
    return run({ root: temporary, put, git, baseline });
  } finally {
    removeTemporaryPath(temporary, { recursive: true, force: true });
  }
}

probe(
  "installed roles and workers carry the rules within accepted startup costs",
  () => {
    const budgets = readBudgets(root);
    const profiles = measureColdStarts(root).profiles;
    assert.equal(profiles.length, 14);
    for (const row of profiles) {
      const text = readFileSync(join(root, row.path), "utf8");
      assert.ok(text.includes(operatorWordsRule));
      assert.ok(text.includes(workerNoPrintRules));
      if (row.role === "router")
        assert.ok(text.includes("awaiting-plan-approval"));
      row.verdict = budgetVerdict(
        budgets,
        `coldStartBytes.${row.role}`,
        row.bytes,
        row.ceiling,
      );
      assert.notEqual(row.verdict, "breach");
    }
    const workers = [
      ".claude/agents/dotln-worker.md",
      ".claude/agents/dotln-worker-fable.md",
      ".codex/agents/dotln-worker-astra.toml",
    ];
    for (const file of workers) {
      const text = readFileSync(join(root, file), "utf8");
      assert.ok(
        text.includes(operatorWordsRule) && text.includes(workerNoPrintRules),
      );
    }
    return {
      profiles: profiles.map(
        ({ role, skillsRoot, bytes, ceiling, verdict }) => ({
          role,
          skillsRoot,
          bytes,
          ceiling,
          verdict,
        }),
      ),
      workers: workers.length,
    };
  },
);

probe(
  "configured document roots, normalized twelve-word boundary and ordinary typed quotation",
  () =>
    fixture((f) => {
      const message =
        "Please keep these release notes readable so every maintainer can review them";
      assert.equal(message.split(" ").length, 12);
      const capture = `${message}\n`;
      const request = "Save this synthetic message.\n";
      f.put("records/intake/message.txt", capture);
      f.put("records/intake/request.txt", request);
      const decision = (extra) => ({
        id: "WO-999-D001",
        date: "2026-11-08",
        dispatch: "resume: verify",
        decision: "Record a synthetic fixture result.",
        evidence: ["fixture"],
        rejected: [],
        reopenWhen: "The fixture contract changes.",
        ...extra,
      });
      const record = (extra) =>
        f.put(
          "records/evidence/WO-999/decisions.md",
          `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify(decision(extra), null, 2)}\n\`\`\`\n`,
        );
      const check = () => checkDocs(f.root, { baseline: f.baseline });
      record({ decision: message.split(" ").slice(0, 11).join(" ") });
      assert.equal(check().verbatim.findings.length, 0);
      record({ decision: message.split(" ").slice(0, 12).join(" ") });
      assert.equal(check().verbatim.findings.length, 1);
      record({
        operatorQuote: {
          text: message,
          captureSha256: `sha256:${sha(capture)}`,
          requestedIn: `sha256:${sha(request)}`,
        },
      });
      assert.deepEqual(check().failures, []);
      f.put(
        "packages/demo/src/note.ts",
        `// ${message.split(" ").slice(0, 7).join(" ").toUpperCase()},\n// ${message.split(" ").slice(7).join(" ")}!\n`,
      );
      const source = check();
      assert.equal(source.verbatim.findings.length, 1);
      assert.equal(
        source.verbatim.findings[0].file,
        "packages/demo/src/note.ts",
      );
      assert.equal(
        source.verbatim.findings[0].capture,
        `sha256:${sha(capture)}`,
      );
      assert.ok(source.failures.every((failure) => !failure.includes(message)));
      return {
        shorterRunFindings: 0,
        exactWindowFindings: 1,
        requestedQuotationFailures: 0,
        packageSourceFindings: 1,
        configuredRoot: "records",
      };
    }),
);

probe(
  "hand-back attribution survives CRLF and cannot become rule provenance",
  () =>
    fixture((f) => {
      const session = "synthetic-verifier-session";
      const prompt =
        '<agent-message from="synthetic-worker">\r\n[Subagent hand-back] Synthetic frame.\r\n  First paragraph.\r\n\r\n  Second paragraph?\r\n</agent-message>';
      recordOperatorMessage(f.root, {
        hook_event_name: "UserPromptSubmit",
        cwd: f.root,
        session_id: session,
        prompt,
      });
      const lane = dispatchJournalDirectory(f.root);
      const file = readdirSync(lane).find((name) => name.endsWith(".jsonl"));
      const rows = readFileSync(join(lane, file), "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse);
      const row = rows.find(
        (entry) => entry.typedEvent === "OperatorMessageObserved",
      );
      assert.equal(row.source, "host-agent-handback");
      assert.equal(row.attribution, "host");
      const planning = "records/planning/passes/fixture.md";
      f.put(
        planning,
        "# Fixture\n\n" +
          renderRulesRecordedBlock([
            {
              rule: "A synthetic standing rule.",
              document: "records/product/00-fixture.md",
              section: "Stable",
              message: {
                sessionKey: file.replace(/\.jsonl$/, ""),
                recordedAt: row.recordedAt,
              },
              captureDigest: row.digest,
            },
          ]),
      );
      assert.throws(
        () => checkRulesRecorded(f.root, planning),
        /source host-agent-handback/,
      );
      const counts = operationalFailures(
        f.root,
        { orders: new Map(), eventSegments: new Map() },
        () => true,
      ).interventions;
      assert.equal(counts.count, 0);
      assert.equal(counts.hostHandbacks, 1);
      return {
        source: row.source,
        attribution: row.attribution,
        interventions: counts.count,
        hostHandbacks: counts.hostHandbacks,
        provenanceRefused: true,
      };
    }),
);

probe(
  "terms screen covers committed branch text, both publishing helpers and main after merge",
  () =>
    fixture((f) => {
      f.put(
        "records/control/local/terms.txt",
        "refuse: synthetic meadow marker\n",
      );
      f.put(
        "records/branch notes.md",
        "# Notes\n\nSynthetic meadow\nmarker.\n",
      );
      f.put("body.md", "## Summary\n\nFixture publication.\n");
      f.git("add", ".");
      f.git("commit", "-qm", "fixture notes");
      const findings = branchTermFindings(f.root, {
        changes: branchChanges(f.root, { committed: true }),
      });
      assert.equal(findings.findings.length, 1);
      assert.deepEqual(
        [findings.findings[0].line, findings.findings[0].endLine],
        [3, 4],
      );
      assert.ok(
        !branchTermLines(findings.findings).join("\n").includes("meadow"),
      );
      for (const [kind, branch] of [
        ["planning", "planning/2030-01-01-fixture"],
        ["update", "chore/fixture-update"],
      ]) {
        f.git("branch", "-m", branch);
        assert.throws(
          () =>
            publishLaunchpadBranch(f.root, {
              kind,
              title: "docs: fixture",
              bodyFile: join(f.root, "body.md"),
              ready: () => {},
            }),
          /local-terms list refuses lines this branch adds/,
        );
      }
      f.git("switch", "-q", "main");
      f.git(
        "merge",
        "-q",
        "--no-ff",
        "-m",
        "merge fixture",
        "chore/fixture-update",
      );
      assert.equal(branchTermFindings(f.root).findings.length, 1);
      return {
        findings: 1,
        publishingDoorsRefused: 2,
        noRemoteConfigured: true,
        lastMergeFindings: 1,
      };
    }),
);

probe(
  "discovery records a changed effort without duplicating versions and leaves an identical rerun untouched",
  () =>
    fixture((f) => {
      const path = "records/discovery/environment.json";
      f.put(
        path,
        JSON.stringify({
          effortReadbackProbe: { harnesses: { "claude-code": {} } },
        }),
      );
      const observation = {
        value: "2.1.319",
        line: "2.1",
        observedAt: "2030-01-01T00:00:00.000Z",
        observedEffort: "high",
        probe: {
          versionChannel: "--version",
          readbackChannelPresent: true,
          effortSelectorPresent: false,
        },
      };
      assert.equal(
        discoverHarness(f.root, "claude-code", () => observation).status,
        "recorded",
      );
      const changed = discoverHarness(f.root, "claude-code", () => ({
        ...observation,
        observedEffort: "xhigh",
      }));
      assert.equal(changed.recorded.version, false);
      assert.equal(changed.recorded.line, false);
      assert.equal(changed.recorded.readback, true);
      const before = readFileSync(join(f.root, path));
      assert.equal(
        discoverHarness(f.root, "claude-code", () => ({
          ...observation,
          observedEffort: "xhigh",
          observedAt: "2030-01-02T00:00:00.000Z",
        })).status,
        "already recorded",
      );
      assert.deepEqual(readFileSync(join(f.root, path)), before);
      const stored =
        JSON.parse(before).effortReadbackProbe.harnesses["claude-code"];
      return {
        versions: stored.versions.length,
        versionLines: stored.versionLines.length,
        changedEffort: stored.selectedSessionReadback.value,
        identicalRerunChangedBytes: false,
      };
    }),
);

probe(
  "ordinary reference links and images require committed destinations and preserve literal paths",
  () =>
    fixture((f) => {
      const source = "records/evidence/WO-999/decisions.md";
      f.put(
        source,
        '# Decisions\n\nSee [the result][result] and ![the diagram](diagram.svg).\n\n[result]: <probe result.json> "Result"\n',
      );
      f.put("records/evidence/WO-999/probe result.json", "{}\n");
      f.git("add", ".");
      f.git("commit", "-qm", "fixture record");
      const first = uncommittedRecordInputs(f.root, [source]);
      assert.deepEqual(first.links, ["records/evidence/WO-999/diagram.svg"]);
      f.put(
        "records/evidence/WO-999/diagram.svg",
        '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n',
      );
      f.git("add", ".");
      f.git("commit", "-qm", "fixture image");
      assert.deepEqual(uncommittedRecordInputs(f.root, [source]), {
        sources: [],
        links: [],
      });
      f.put(
        "records/evidence/WO-999/probe result.json",
        '{"result":"changed"}\n',
      );
      f.git("add", ".");
      assert.deepEqual(uncommittedRecordInputs(f.root, [source]).links, [
        "records/evidence/WO-999/probe result.json",
      ]);
      return {
        missingImageRefused: true,
        committedInputsAccepted: true,
        stagedLinkedEvidenceRefused: true,
      };
    }),
);

probe(
  "criteria worker dry-run prints the three shared rules and its measured size",
  () => {
    const run = spawnSync(
      process.execPath,
      [
        "scripts/worker.mjs",
        "review",
        "--kind",
        "criteria",
        "--host",
        "claude",
        "--order",
        "WO-259",
        "--dry-run",
      ],
      { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    assert.equal(run.status, 0);
    const dry = JSON.parse(run.stdout);
    const preamble = dry.brief.split("\n## Brief")[0];
    assert.ok(
      preamble.includes(operatorWordsRule) &&
        preamble.includes(workerNoPrintRules),
    );
    assert.equal(dry.measured.brief, dry.brief.length);
    return {
      measured: dry.measured,
      preambleCharacters: preamble.length,
      allRulesPresent: true,
      workersLaunched: 0,
    };
  },
);

probe("release upgrade guidance follows the changed source files", () => {
  const files = execFileSync("git", ["diff", "--name-only", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  })
    .trim()
    .split("\n");
  const notes = criticalNotes(files, {});
  assert.ok(
    notes.some((note) =>
      note.includes(
        "re-emit with node scripts/harness.mjs emit and start a new session",
      ),
    ),
  );
  return { reemitAndNewSession: true };
});
console.log(JSON.stringify({ schemaVersion: 1, probes: results }, null, 2));
