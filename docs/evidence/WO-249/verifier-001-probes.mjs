import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
const source = fileURLToPath(new URL("../../../", import.meta.url));
const { createScratchRoot } = await import(
  pathToFileURL(join(source, "scripts/lib/temporary-roots.mjs"))
);
const scratch = createScratchRoot(join(tmpdir(), "dotln-wo249-verifier-"));
const load = (p) => import(pathToFileURL(join(source, p)));
const { judgeReport, criterionJudgments, criterionTextHash } = await load(
  "scripts/lib/off-ramps.mjs",
);
const { declaredCriteria } = await load("scripts/lib/handoff-ledger.mjs");
const { criteriaAdvisories } = await load("scripts/work-orders.mjs");
const { orderMerged } = await load("scripts/lib/drive-route.mjs");
const { unrepairedRetraction, fold } = await load("scripts/lib/control.mjs");
const { criterionRecordLines, withMeterBlockLast, criterionRecordRefusal } =
  await load("scripts/lib/github-body.mjs");
const { copyFixtureFiles } = await load("scripts/lib/fixture-inputs.mjs");
const { installBeaconFixture } = await load("scripts/test-beacon-fixture.mjs");
const { failureRecord, failureCounts, failuresAtStart } = await load(
  "scripts/lib/plan-failures.mjs",
);
const results = [];
const probe = (id, f) => {
  f();
  results.push({ id, outcome: "pass" });
  console.log(`PASS ${id}`);
};
const block = (entries = []) =>
  `\n<!-- dotln-findings:start -->\n${JSON.stringify(entries)}\n<!-- dotln-findings:end -->\n`;
const classes = [
  "bookkeeping",
  "later-phase",
  "absent-input",
  "host-behavior",
  "contradiction",
];
probe(
  "P1 five classes, reflow hash, stale and retracted report records",
  () => {
    for (const kind of classes) {
      const criterion = {
        id: "3",
        text: "The statement has two wrapped lines.",
      };
      const record = {
        criterionId: "3",
        criterionHash: criterionTextHash(criterion.text),
        class: kind,
        ordinal: 5,
      };
      const state = { workOrderId: "WO-901", defectiveCriteria: [record] };
      const line = `**Criterion 3:** unmet, defective (${kind}) by 5. My evidence explains the class.`;
      assert.deepEqual(
        judgeReport(line + block(), state, "pass", { criteria: [criterion] })
          .refusals,
        [],
      );
      assert.match(
        judgeReport(line + block(), state, "pass", {
          criteria: [{ ...criterion, text: criterion.text + " Amended." }],
        }).refusals.join(" "),
        /no longer hashes/,
      );
      const retracted = {
        ...state,
        defectiveCriteria: [],
        retractedOffRamps: [{ ordinal: 6, subject: { ordinal: 5 } }],
      };
      assert.match(
        judgeReport(line + block(), retracted, "pass", {
          criteria: [criterion],
        }).refusals.join(" "),
        /retracted by ordinal 6/,
      );
      assert.equal(
        judgeReport(
          "**Criterion 3:** met. Repaired." + block(),
          state,
          "pass",
          { criteria: [criterion] },
        ).refusals.length,
        0,
      );
      assert.match(
        judgeReport("**Criterion 1:** met." + block(), state, "pass", {
          criteria: [criterion],
        }).refusals.join(" "),
        /does not judge it/,
      );
      for (const field of [
        "**Verdict**: pass.",
        "> - **PROCESS COST:** 1 tokens",
        "**Actor:** reviewer",
      ]) {
        const empty = `**Criterion 3:** unmet, defective (${kind}) by 5.\n\n${field}`;
        assert.match(
          judgeReport(empty + block(), state, "pass", {
            criteria: [criterion],
          }).refusals.join(" "),
          /empty paragraph/,
        );
      }
    }
    const [wrapped] = declaredCriteria(
      "**Acceptance criteria**\n\n3. The statement has two\n   wrapped lines.\n",
    );
    assert.equal(wrapped.text, "The statement has two wrapped lines.");
  },
);
probe("P2 fail consistency and advisory basis handling", () => {
  const met = "**Criterion 1:** met. Holds.";
  const context = {
    criteria: [{ id: "1", text: "One." }],
    evidenceRoot: "docs/evidence/WO-901",
    exists: () => true,
  };
  for (const value of [
    met,
    met + block().replace("[]", "["),
    met + block([{ id: "bad", route: "blocking", summary: "Bad id." }]),
  ])
    assert.match(
      judgeReport(value, {}, "fail", context).refusals.join(" "),
      /findings block/,
    );
  assert.match(
    judgeReport(met + block(), {}, "fail", context).refusals.join(" "),
    /a fail names an unmet criterion/,
  );
  const valid = {
    id: "F1",
    route: "blocking",
    class: "escape",
    summary: "Regression.",
    basis: { regression: "Supported behavior main supplied" },
    reproduction: "docs/evidence/WO-901/repro.md",
  };
  assert.equal(
    judgeReport(met + block([valid]), {}, "fail", context).refusals.length,
    0,
  );
  assert.equal(
    judgeReport(met + block([valid]), {}, "fail", context).advisories.length,
    0,
  );
  assert.equal(
    judgeReport(
      met + block([{ id: "F1", route: "blocking", summary: "No basis." }]),
      {},
      "fail",
      context,
    ).advisories.length,
    1,
  );
  assert.equal(
    judgeReport(
      "**Criterion 1:** unmet. Failed." + block(),
      {},
      "fail",
      context,
    ).refusals.length,
    0,
  );
});
probe(
  "P3 fenced headings preserve post-example receipt across CommonMark fences",
  () => {
    for (const fence of ["```", "~~~~", "````"]) {
      const report = `**Criterion 1:** met.\n\n${fence}md\n## Example heading\n**Criterion 9:** unmet.\n${fence}\n\nReceipt: docs/evidence/WO-901/live.json.\n\n## End\nExcluded.`;
      const rows = criterionJudgments(report);
      assert.equal(rows.length, 1);
      assert.match(rows[0].paragraph, /live\.json/);
      assert.doesNotMatch(
        rows[0].paragraph,
        /Example heading|Excluded|Criterion 9/,
      );
    }
  },
);
probe("P4 lint all units, ranges, multiple matches and clean prose", () => {
  const texts = [
    "1 s",
    "2ms",
    "3 min",
    "4 h",
    "5 bytes",
    "6 KB",
    "7 MB",
    "8 GB",
    "9 tokens",
    "10 USD",
    "11%",
    "12 cap",
    "median: 13",
    "HEAD",
    "git --no-pager log",
    "base...next",
    "at release close",
    "after the *final review*",
  ];
  const order =
    "**Acceptance criteria**\n\n" +
    texts.map((x, i) => `${i + 1}. ${x}.`).join("\n");
  assert.equal(criteriaAdvisories("WO-901", order).length, texts.length);
  assert.equal(
    criteriaAdvisories(
      "WO-901",
      "**Acceptance criteria**\n\n1. A 5 s and 8 KB bound.\n",
    ).length,
    1,
  );
  assert.deepEqual(
    criteriaAdvisories(
      "WO-901",
      "**Acceptance criteria**\n\n1. WO-249 ships v0.109.0 on 2026-11-02; status names the phase.\n",
    ),
    [],
  );
});
probe("P5 merge and unrepaired retraction decisions", () => {
  assert.equal(
    orderMerged(
      { repositoryId: "target" },
      { merged: true, targetMerged: false },
    ),
    false,
  );
  assert.equal(
    orderMerged(
      { repositoryId: "target" },
      { merged: true, targetMerged: true },
    ),
    true,
  );
  const activate = { type: "WorkOrderActivated" },
    pass = { type: "FinalReviewCompleted", verdict: "pass" },
    retract = {
      type: "OffRampRetracted",
      pullRequest: "unmerged",
      subject: { ordinal: 2 },
    };
  const merged = [activate, pass],
    work = [...merged, retract, { type: "RepairRequested" }, pass];
  assert.equal(unrepairedRetraction(work, { passedIn: merged }), retract);
  assert.equal(unrepairedRetraction(work, { passedIn: work }), undefined);
  assert.equal(
    unrepairedRetraction([...merged, { ...retract, pullRequest: "merged" }]),
    undefined,
  );
});
const root = mkdtempSync(join(scratch, "independent-fixture-"));
mkdirSync(join(root, "scripts"), { recursive: true });
copyFixtureFiles(source, root, "scripts/test-off-ramps.fixture-inputs.json");
cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
  recursive: true,
});
installBeaconFixture(root);
cpSync(join(source, ".gitignore"), join(root, ".gitignore"));
const env = {
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([k]) => !/^(CLAUDE|CODEX|COPILOT|DOTLN_|GIT_)/.test(k),
    ),
  ),
  GIT_AUTHOR_NAME: "fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const git = (...args) => {
  const r = spawnSync("git", ["-C", root, ...args], { env, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
};
git("init", "-q", "-b", "main");
git("add", "-A");
git("-c", "maintenance.auto=false", "commit", "-qm", "fixture");
git("switch", "-qc", "wo-901");
const write = (p, t) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), t);
};
const actor = {
  harness: "codex-cli",
  harnessVersion: "fixture",
  model: "fixture",
  effort: "xhigh",
  source: "self-reported",
};
const flags = Object.entries(actor).flatMap(([k, v]) => [
  "--" + (k === "harnessVersion" ? "harness-version" : k),
  v,
]);
const actorEnv = (name, role) => {
  write(
    `docs/control/local/harness/${createHash("sha256").update(name).digest("hex")}.json`,
    JSON.stringify({
      role,
      workOrder: "WO-901",
      startedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  return { CLAUDE_CODE_SESSION_ID: name };
};
const verifyEnv = actorEnv("independent-verifier", "verifier"),
  executorEnv = actorEnv("independent-executor", "executor");
const commands = [];
const call = (args, extra = {}) => {
  const r = spawnSync(
    process.execPath,
    [join(root, "scripts/resume.mjs"), ...args, "--work-order", "WO-901"],
    { cwd: root, env: { ...env, ...extra }, encoding: "utf8", timeout: 30000 },
  );
  commands.push({
    args: args.filter((_, i) => args[i - 1] !== "--evidence"),
    exitCode: r.status,
    stderr: r.stderr,
  });
  return r;
};
const ok = (args, extra) => {
  const r = call(args, extra);
  assert.equal(r.status, 0, `${args.join(" ")}: ${r.stderr}`);
  return r.stdout;
};
const refuse = (args, re, extra) => {
  const before = readFileSync(
    join(root, "docs/control/orders/WO-901.jsonl"),
    "utf8",
  );
  const r = call(args, extra);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, re);
  assert.equal(
    readFileSync(join(root, "docs/control/orders/WO-901.jsonl"), "utf8"),
    before,
  );
};
const authority = "docs/work-orders/WO-901-independent.md";
const texts = [
  "The record costs at most 1 USD.",
  "The release is judged at release close.",
  "The missing base measurement is available.",
  "The host supplies an unavailable behavior without fallback.",
  "The operation always succeeds and always refuses.",
];
write(
  authority,
  "# WO-901 — independent fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** Exercise declared records.\n\n**Acceptance criteria (all required)**\n\n" +
    texts.map((x, i) => `${i + 1}. ${x}`).join("\n") +
    "\n",
);
const ledger = () =>
  write(
    "docs/evidence/WO-901/handoff.md",
    "# Handoff\n\n" +
      classes
        .map(
          (x, i) =>
            `**Criterion ${i + 1}:** unmet. ${x}: the authority states it.`,
        )
        .join("\n") +
      "\n",
  );
const report = (p, lines) =>
  write(
    p,
    `# Independent fixture report\n\n**Actor attestation:** ${JSON.stringify(actor)}\n**Process cost:** unknown; cause no-session\n\n${lines.join("\n\n")}\n${block()}`,
  );
probe("P6 CLI all five defect classes and executor refusal", () => {
  ok(["activate", "WO-901", authority]);
  ledger();
  ok(["implementation-ready", ...flags]);
  const capture = "docs/intake/notes/independent-fixture.md";
  const words =
    "Fixture operator: widen the handoff; later retract criterion 1's record.\n";
  write(capture, words);
  const captureFlags = [
    "--capture",
    capture,
    "--capture-hash",
    `sha256:${createHash("sha256").update(words).digest("hex")}`,
  ];
  ok([
    "reopen-handoff",
    "--reason",
    "The fixture operator widened the handoff.",
    ...captureFlags,
    ...flags,
  ]);
  assert.equal(JSON.parse(ok(["status", "--json"])).phase, "active");
  assert.deepEqual(JSON.parse(ok(["status", "--json"])).unmetCriteria, []);
  ledger();
  ok(["implementation-ready", ...flags]);
  ok(["verify"]);
  refuse(
    [
      "defect",
      "1",
      "--class",
      "bookkeeping",
      "--evidence",
      "It measures cost.",
      ...flags,
    ],
    /executor cannot record/,
    executorEnv,
  );
  refuse(
    [
      "defect",
      "1",
      "--class",
      "unknown",
      "--evidence",
      "It measures cost.",
      ...flags,
    ],
    /not a defect class/,
    verifyEnv,
  );
  for (const [i, kind] of classes.entries())
    ok(
      [
        "defect",
        String(i + 1),
        "--class",
        kind,
        "--evidence",
        `My independent fixture evidence identifies ${kind}.`,
        ...flags,
      ],
      verifyEnv,
    );
  const state = JSON.parse(ok(["status", "--json"]));
  assert.deepEqual(
    state.defectiveCriteria.map((r) => r.class),
    classes,
  );
  for (const [i, r] of state.defectiveCriteria.entries())
    assert.equal(r.criterionHash, criterionTextHash(texts[i]));
  const retracted = state.defectiveCriteria[0];
  ok(
    [
      "retract",
      String(retracted.ordinal),
      "--reason",
      "The fixture operator retracts the record.",
      ...captureFlags,
      ...flags,
    ],
    verifyEnv,
  );
  assert.equal(
    JSON.parse(ok(["status", "--json"])).defectiveCriteria.length,
    4,
  );
  const lines = state.defectiveCriteria.map((r) =>
    r.criterionId === "1"
      ? "**Criterion 1:** met. The fixture judges it without the retracted record."
      : `**Criterion ${r.criterionId}:** unmet, defective (${r.class}) by ${r.ordinal}. My evidence independently establishes the class.`,
  );
  report("docs/verifications/WO-901/VER-001.md", lines);
  ok(["verification-result", "pass", ...flags]);
  ok(["final-review"]);
  report("docs/final-reviews/WO-901/FINAL-001.md", lines);
  ok(["final-review-result", "pass", ...flags]);
  assert.equal(JSON.parse(ok(["status", "--json"])).phase, "closed");
});
probe(
  "P7 criterion records render in order, stale comparisons and target exception",
  () => {
    write("docs/control/budgets.json", "{}\n");
    const state = {
      workOrderId: "WO-901",
      waivedCriteria: [{ criterionId: "1", ordinal: 9 }],
      defectiveCriteria: [
        { criterionId: "2", class: "later-phase", ordinal: 5 },
      ],
    };
    const records = criterionRecordLines(state),
      body = withMeterBlockLast(
        "# Review\n\nReviewed prose.\n",
        "| Work |\n| --- |\n| Fixture |",
        records,
      );
    assert.ok(body.indexOf("Criterion 2:") < body.indexOf("Criterion 1:"));
    assert.ok(
      body.indexOf("Criterion 1:") <
        body.indexOf("<!-- dotln-process-meter:start -->"),
    );
    assert.equal(criterionRecordRefusal(root, body, state), null);
    assert.match(
      criterionRecordRefusal(root, "# Review\n\nProse.\n", state),
      /do not match/,
    );
    assert.equal(
      criterionRecordRefusal(root, "# Review\n\nProse.\n", {
        ...state,
        repositoryId: "target",
      }),
      null,
    );
    assert.equal(
      withMeterBlockLast(body, "| Work |\n| --- |\n| Fixture |", records),
      body,
    );
  },
);
probe(
  "P8 planning counts actual CLI events and omits a retracted class",
  () => {
    const { items, facts } = failureRecord(root);
    const counts = failureCounts(items, facts);
    assert.equal(counts.offRamps, 7);
    assert.deepEqual(counts.offRampEvents, {
      OffRampRetracted: 1,
      CriterionDefectRecorded: 5,
      HandoffReopened: 1,
    });
    assert.deepEqual(
      counts.defectClasses,
      Object.fromEntries(classes.slice(1).map((kind) => [kind, 1])),
    );
    const start = failuresAtStart(root);
    assert.equal(start.overrun, undefined);
    assert.ok(Buffer.byteLength(JSON.stringify(start)) <= 1024);
    assert.equal(start.counts.offRampEvents.CriterionDefectRecorded, 5);
    assert.equal(start.counts.defectClasses, undefined);
  },
);
writeFileSync(
  join(scratch, "independent-results.json"),
  JSON.stringify({ results, commands, fixture: root }, null, 2) + "\n",
);
console.log(
  JSON.stringify({ passed: results.length, failed: 0, fixture: root }),
);
