import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fold, foldWorkOrders } from "./lib/control.mjs";
import { runGit } from "./lib/git.mjs";
import {
  localReleaseRecords,
  manifestWorkOrders,
} from "./lib/release-records.mjs";
import {
  checkIndex,
  parseHeader,
  readIndex,
  renderIndex,
} from "./work-orders.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const root = process.argv[2];
assert.ok(root && isAbsolute(root) && realpathSync(root) === root);
assert.ok(existsSync(join(root, ".dotln-test-root-owner")));
const check = (label, run) => {
  run();
  process.stdout.write(`PASS ${label}\n`);
};
const write = (repo, path, content) => {
  mkdirSync(dirname(join(repo, path)), { recursive: true });
  writeFileSync(join(repo, path), content);
};
const makeRepo = (name) => {
  const repo = join(root, name);
  mkdirSync(repo);
  assert.equal(realpathSync(repo), resolve(repo));
  runGit(repo, ["init", "-q"]);
  assert.equal(runGit(repo, ["rev-parse", "--show-toplevel"]), repo);
  runGit(repo, ["config", "user.name", "DotLn Index Fixture"]);
  runGit(repo, ["config", "user.email", "test@example.invalid"]);
  mkdirSync(join(repo, "scripts"));
  cpSync(
    join(scriptRoot, "work-orders.mjs"),
    join(repo, "scripts/work-orders.mjs"),
  );
  cpSync(join(scriptRoot, "lib"), join(repo, "scripts/lib"), {
    recursive: true,
  });
  write(repo, "docs/control/resume.jsonl", "");
  mkdirSync(join(repo, "docs/work-orders"));
  return repo;
};
const authorityPath = (id) => `docs/work-orders/${id}-fixture.md`;
const header = (id, version, depends = "nothing", model = "fixture model") =>
  `# ${id} — Fixture ${version}\n\n**Model:** ${model}\ncontinued model declaration.\n\n**Effort:** executor xhigh+; verifier xhigh+; reviewer any.\n${depends === undefined ? "" : `**Depends on:** ${depends}\n`}\n**Objective:** fixture.\n`;
const activation = (id) => ({
  type: "WorkOrderActivated",
  workOrderId: id,
  workOrderPath: authorityPath(id),
});
const completed = (id) => [
  activation(id),
  { type: "ImplementationReady", workOrderId: id },
  {
    type: "VerificationRequested",
    workOrderId: id,
    verificationId: "VER-001",
    reportPath: `docs/verifications/${id}/VER-001.md`,
  },
  {
    type: "VerificationCompleted",
    workOrderId: id,
    verificationId: "VER-001",
    reportPath: `docs/verifications/${id}/VER-001.md`,
    verdict: "pass",
  },
  {
    type: "FinalReviewRequested",
    workOrderId: id,
    finalReviewId: "FINAL-001",
    reportPath: `docs/final-reviews/${id}/FINAL-001.md`,
  },
  {
    type: "FinalReviewCompleted",
    workOrderId: id,
    finalReviewId: "FINAL-001",
    reportPath: `docs/final-reviews/${id}/FINAL-001.md`,
    verdict: "pass",
  },
];
const writeLog = (repo, events) =>
  write(
    repo,
    "docs/control/resume.jsonl",
    events
      .map((event) => JSON.stringify({ schemaVersion: 1, ...event }))
      .join("\n") + "\n",
  );
const commit = (repo, label) => {
  runGit(repo, ["add", "."]);
  runGit(repo, ["commit", "-qm", label], {
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: "2020-01-02T00:00:00Z",
      GIT_COMMITTER_DATE: "2020-01-02T00:00:00Z",
    },
  });
};
const tag = (
  repo,
  name,
  id,
  paths = [],
  revision = "HEAD",
  date = "2020-01-02T00:00:00Z",
) => {
  const manifest = {
    release: { application: name },
    workOrder: { id },
    notes: { changedFiles: paths },
  };
  runGit(
    repo,
    [
      "tag",
      "-a",
      name,
      revision,
      "-m",
      `DotLn ${name}\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest)}\nDOTLN-MANIFEST-END`,
    ],
    { env: { ...process.env, GIT_COMMITTER_DATE: date } },
  );
};
const cli = (repo, args, ok = true) => {
  const result = spawnSync(
    process.execPath,
    [join(repo, "scripts/work-orders.mjs"), ...args],
    { encoding: "utf8", cwd: repo },
  );
  assert.equal(result.status === 0, ok, result.stdout + result.stderr);
  return result.stdout + result.stderr;
};
const repo = makeRepo("space and narrow\u202fspace");
const specs = [
  ["WO-001", "v0.0.1"],
  ["WO-002", "v0.1.0", "WO-001"],
  ["WO-030", "v1.0.0"],
  ["WO-031", "v0.9.0", "WO-030"],
  ["WO-032", "v0.5.0"],
  ["WO-033", "v1.0.0"],
  ["WO-034", "v2.0.0", "WO-030"],
  ["WO-035", "unassigned", "WO-034"],
  ["WO-036", "unassigned", "WO-030 and WO-031; WO-030 mentioned twice"],
  ["WO-037", "v1.0.0 and v2.0.0"],
  ["WO-038", "unassigned"],
  ["WO-039", "unassigned", "nothing"],
  ["WO-040", "v2.0.0", "WO-030", "model | <script> [link](elsewhere)"],
];
for (const args of specs) write(repo, authorityPath(args[0]), header(...args));
write(
  repo,
  authorityPath("WO-038"),
  header("WO-038", "unassigned").replace("**Depends on:** nothing\n", ""),
);
const early = [...completed("WO-030"), ...completed("WO-031")];
writeLog(repo, early);
commit(repo, "release prefix");
const earlyCommit = runGit(repo, ["rev-parse", "HEAD"]);
tag(repo, "v1.0.0", "WO-030", ["docs/final-reviews/WO-031/FINAL-001.md"]);
runGit(repo, ["tag", "v9.0.0"]); // Lightweight, deliberately excluded.
runGit(repo, ["tag", "-a", "v8.0.0", "-m", "Unrelated annotated tag"]);
const events = [
  ...early,
  ...completed("WO-032"),
  ...completed("WO-033"),
  activation("WO-034"),
];
writeLog(repo, events);
commit(repo, "closed and active orders");
const indexFile = join(repo, "docs/work-orders/README.md");
const rows = () => new Map(readIndex(repo).rows.map((row) => [row.id, row]));

check(
  "index derives release membership, no-release, unreleased, active, blocked, ready, malformed and unknown",
  () => {
    const byId = rows();
    assert.equal(byId.size, specs.length);
    assert.equal(byId.get("WO-001").section, "Historical");
    assert.equal(byId.get("WO-002").section, "Historical");
    assert.equal(
      byId.get("WO-030").disposition,
      "v1.0.0 (manifest workOrder.id)",
    );
    assert.equal(
      byId.get("WO-031").disposition,
      "v1.0.0 (manifest changedFiles)",
    );
    assert.match(
      byId.get("WO-032").disposition,
      /^no-release close .*v0\.5\.0 below v1\.0\.0/,
    );
    assert.equal(byId.get("WO-033").disposition, "unreleased");
    assert.equal(byId.get("WO-034").section, "Active");
    assert.equal(byId.get("WO-035").dependencyState, "blocked on WO-034");
    assert.equal(byId.get("WO-036").dependencyState, "dependency-ready");
    assert.deepEqual(byId.get("WO-036").dependencies, ["WO-030", "WO-031"]);
    assert.equal(byId.get("WO-037").version, "malformed");
    assert.equal(byId.get("WO-038").dependencyState, "unknown");
    assert.equal(byId.get("WO-039").dependencyState, "dependency-ready");
    assert.match(byId.get("WO-030").model, /continued model declaration/);
    assert.equal(byId.get("WO-030").finalReviewVerdict, "pass");
    assert.equal(byId.get("WO-030").state.latestVerdict, "pass");
  },
);

check(
  "complete columns, exactly one row per file, sorted sections, safe Markdown and deterministic bytes",
  () => {
    cli(repo, ["index"]);
    const first = readFileSync(indexFile, "utf8");
    cli(repo, ["index"]);
    assert.equal(first, readFileSync(indexFile, "utf8"));
    const lines = first.split("\n").filter((line) => line.startsWith("| WO-"));
    assert.equal(lines.length, specs.length);
    assert.equal(
      new Set(lines.map((line) => line.split(" | ")[0])).size,
      specs.length,
    );
    for (const line of lines) assert.equal(line.split(" | ").length, 11);
    for (const section of first.split(/^## /m).slice(1)) {
      const ids = [...section.matchAll(/^\| (WO-\d{3}) \|/gm)].map(
        (match) => match[1],
      );
      assert.deepEqual(ids, [...ids].sort());
    }
    assert.match(first, /model &#124; &lt;script&gt; &#91;link&#93;/);
    assert.match(
      first,
      /\[VER-001\]\(\.\.\/\.\.\/docs\/verifications\/WO-030\/VER-001.md\) \(pass\)/,
    );
    assert.doesNotMatch(first, /`v[89]\.0\.0`/);
    commit(repo, "generated index");
  },
);

check(
  "check is read-only; deleting a committed row or editing a cell names the first differing line",
  () => {
    const original = readFileSync(indexFile, "utf8");
    const log = readFileSync(join(repo, "docs/control/resume.jsonl"), "utf8");
    const refs = runGit(repo, ["show-ref"]);
    cli(repo, ["index", "--check"]);
    assert.equal(runGit(repo, ["status", "--porcelain"]), "");
    const lines = original.split("\n");
    const at = lines.findIndex((line) => line.startsWith("| WO-035 |"));
    for (const changed of [
      lines.filter((_, index) => index !== at).join("\n"),
      original.replace("blocked on WO-034", "dependency-ready"),
    ]) {
      writeFileSync(indexFile, changed);
      assert.match(
        cli(repo, ["index", "--check"], false),
        new RegExp(`stale at line ${at + 1}\\b`),
      );
      assert.equal(readFileSync(indexFile, "utf8"), changed);
    }
    writeFileSync(indexFile, original);
    assert.equal(
      readFileSync(join(repo, "docs/control/resume.jsonl"), "utf8"),
      log,
    );
    assert.equal(runGit(repo, ["show-ref"]), refs);
    assert.equal(existsSync(`${indexFile}.tmp`), false);
    assert.throws(() => checkIndex("a\n", "a\nextra\n"), /line 2/);
  },
);

check(
  "a new release tag preserves the recorded check; explicit refresh includes it without retroactive no-release inference",
  () => {
    const original = readFileSync(indexFile, "utf8");
    tag(repo, "v2.0.0", "WO-040", ["docs/final-reviews/WO-030/FINAL-002.md"]);
    assert.match(
      cli(repo, ["index", "--check"]),
      /NEWER local release evidence: v2\.0\.0/,
    );
    assert.equal(readFileSync(indexFile, "utf8"), original);
    cli(repo, ["index"]);
    assert.notEqual(readFileSync(indexFile, "utf8"), original);
    const byId = rows();
    assert.equal(
      byId.get("WO-030").disposition,
      "v1.0.0 (manifest workOrder.id)",
    );
    assert.equal(byId.get("WO-033").disposition, "unreleased");
    assert.match(byId.get("WO-032").disposition, /below v1\.0\.0/);
    assert.match(byId.get("WO-040").disposition, /v2\.0\.0/);
    cli(repo, ["index", "--check"]);
  },
);

check(
  "later tag time cannot turn an old source prefix into a prior release; unvalidated additional tags do not invalidate the snapshot",
  () => {
    tag(repo, "v3.0.0", "WO-040", [], earlyCommit, "2020-01-03T00:00:00Z");
    assert.equal(rows().get("WO-033").disposition, "unreleased");
    assert.match(rows().get("WO-032").disposition, /below v1\.0\.0/);
    runGit(repo, [
      "tag",
      "-a",
      "v4.0.0",
      "-m",
      "DotLn v4.0.0\n\nDOTLN-MANIFEST-BEGIN\nnull\nDOTLN-MANIFEST-END",
    ]);
    assert.match(
      cli(repo, ["index", "--check"]),
      /additional manifests are not validated/,
    );
    assert.match(cli(repo, ["index"], false), /malformed release attribution/);
    runGit(repo, ["tag", "-d", "v3.0.0", "v4.0.0"]);
  },
);

check(
  "missing or changed recorded tag objects refuse without rewriting the index",
  () => {
    const original = readFileSync(indexFile, "utf8");
    const object = runGit(repo, ["rev-parse", "refs/tags/v1.0.0"]);
    runGit(repo, ["tag", "-d", "v1.0.0"]);
    assert.match(
      cli(repo, ["index", "--check"], false),
      /missing or changed recorded release tag: v1\.0\.0/,
    );
    tag(repo, "v1.0.0", "WO-033");
    assert.match(
      cli(repo, ["index", "--check"], false),
      /missing or changed recorded release tag: v1\.0\.0/,
    );
    runGit(repo, ["update-ref", "refs/tags/v1.0.0", object]);
    assert.equal(readFileSync(indexFile, "utf8"), original);
  },
);

check(
  "lifecycle transitions stale the index; failed final review and a new request have distinct verdicts",
  () => {
    const failed = completed("WO-034").slice(1);
    failed.at(-1).verdict = "fail";
    const cycle = [...events, ...failed];
    writeLog(repo, cycle);
    assert.match(cli(repo, ["index", "--check"], false), /stale at line/);
    assert.equal(rows().get("WO-034").phase, "needs-fix");
    assert.equal(rows().get("WO-034").finalReviewVerdict, "fail");
    cycle.push({ type: "RepairRequested", workOrderId: "WO-034" });
    cycle.push({ type: "RepairCompleted", workOrderId: "WO-034" });
    cycle.push({
      type: "VerificationRequested",
      workOrderId: "WO-034",
      verificationId: "VER-002",
      reportPath: "docs/verifications/WO-034/VER-002.md",
    });
    writeLog(repo, cycle);
    assert.equal(rows().get("WO-034").state.latestVerdict, undefined);
    cycle.push({
      type: "VerificationCompleted",
      workOrderId: "WO-034",
      verificationId: "VER-002",
      reportPath: "docs/verifications/WO-034/VER-002.md",
      verdict: "pass",
    });
    cycle.push({
      type: "FinalReviewRequested",
      workOrderId: "WO-034",
      finalReviewId: "FINAL-002",
      reportPath: "docs/final-reviews/WO-034/FINAL-002.md",
    });
    writeLog(repo, cycle);
    assert.equal(rows().get("WO-034").finalReviewVerdict, undefined);
    assert.match(renderIndex(readIndex(repo)), /FINAL-002.*\(pending\)/);
    const projected = foldWorkOrders(cycle);
    assert.deepEqual(projected.current, fold(cycle));
    assert.equal(projected.orders.get("WO-030").state.phase, "closed");
    writeLog(repo, events);
  },
);

check(
  "unknown event and invalid time refuse at the original global ordinal",
  () => {
    const corrupt = [...events];
    corrupt[8] = { type: "UnrecognizedFutureEvent", workOrderId: "WO-031" };
    writeLog(repo, corrupt);
    assert.match(
      cli(repo, ["index", "--check"], false),
      /unknown control event type at line 9: UnrecognizedFutureEvent/,
    );
    corrupt[8] = { ...events[8], recordedAt: "yesterday" };
    writeLog(repo, corrupt);
    assert.match(cli(repo, ["index"], false), /invalid recordedAt at line 9/);
    writeLog(repo, events);
  },
);

check(
  "unknown headers, invalid versions, duplicate fields, body metadata and duplicate IDs never become guesses",
  () => {
    assert.equal(parseHeader("# A C# tool\n", "fixture.md").title, "A C# tool");
    assert.equal(
      parseHeader("# A tool in C#\n", "fixture.md").title,
      "A tool in C#",
    );
    assert.equal(
      parseHeader("# A tool in C# ##\n", "fixture.md").title,
      "A tool in C#",
    );
    for (const version of [
      "v01.2.3",
      "v1.0.0-beta",
      "v9007199254740992.0.0",
      "v1.0.0 / v2.0.0",
    ])
      assert.equal(
        parseHeader(header("WO-099", version), "fixture.md").version,
        "malformed",
      );
    assert.equal(
      parseHeader("No H1\n\n**Model:** guess\n", "fixture.md").model,
      "unknown",
    );
    assert.equal(
      parseHeader("# Valid\n\n## Body\n**Model:** too late\n", "fixture.md")
        .model,
      "unknown",
    );
    assert.equal(
      parseHeader("# Valid\n\n**Model:** one\n**Model:** two\n", "fixture.md")
        .model,
      "unknown",
    );
    assert.equal(
      parseHeader("# Valid\n\n**Effort:**\n", "fixture.md").effort,
      "unknown",
    );
    write(
      repo,
      "docs/work-orders/WO-035-duplicate.md",
      header("WO-035", "v1.0.0"),
    );
    assert.match(cli(repo, ["index"], false), /duplicate work-order id WO-035/);
    unlinkSync(join(repo, "docs/work-orders/WO-035-duplicate.md"));
  },
);

check(
  "source and destination symlinks refuse; CLI rejects unknown arguments",
  () => {
    const original = readFileSync(indexFile, "utf8");
    const outside = join(root, "outside.md");
    writeFileSync(outside, "sentinel\n");
    unlinkSync(indexFile);
    symlinkSync(outside, indexFile);
    assert.match(cli(repo, ["index"], false), /contained regular file/);
    assert.equal(readFileSync(outside, "utf8"), "sentinel\n");
    unlinkSync(indexFile);
    writeFileSync(indexFile, original);
    const path = join(repo, authorityPath("WO-040"));
    const authority = readFileSync(path, "utf8");
    unlinkSync(path);
    symlinkSync(outside, path);
    assert.match(
      cli(repo, ["index"], false),
      /invalid work-order authority path/,
    );
    unlinkSync(path);
    writeFileSync(path, authority);
    for (const args of [
      [],
      ["status"],
      ["index", "--fetch"],
      ["index", "--check", "extra"],
    ])
      assert.match(cli(repo, args, false), /usage: work-orders index/);
  },
);

check(
  "the sole manifest-free historical release requires its explicit record",
  () => {
    const past = makeRepo("historical");
    write(past, authorityPath("WO-003"), header("WO-003", "v0.2.0"));
    writeLog(past, completed("WO-003"));
    assert.equal(readIndex(past).rows[0].disposition, "unreleased");
    commit(past, "historical closure");
    runGit(past, [
      "tag",
      "-a",
      "v0.2.0",
      "-m",
      "DotLn v0.2.0 — walking skeleton",
    ]);
    assert.throws(() => readIndex(past), /requires docs\/releases\/v0.2.0.md/);
    write(
      past,
      "docs/releases/v0.2.0.md",
      "# Release v0.2.0\n\nReviewed WO-003 closure.\n",
    );
    assert.equal(
      readIndex(past).rows[0].disposition,
      "v0.2.0 (historical record)",
    );
    runGit(past, [
      "tag",
      "-a",
      "v0.2.1",
      "-m",
      "DotLn v0.2.1\n\nDOTLN-MANIFEST-BEGIN\n{\nDOTLN-MANIFEST-END",
    ]);
    assert.throws(() => localReleaseRecords(past), /invalid manifest JSON/);
    assert.deepEqual(
      manifestWorkOrders({
        workOrder: { id: "WO-003" },
        notes: {
          changedFiles: [
            "docs/final-reviews/WO-004/FINAL-001.md",
            "docs/final-reviews/WO-003/FINAL-001.md",
            "docs/final-reviews/WO-004ish/file.md",
          ],
        },
      }),
      ["WO-003", "WO-004"],
    );
  },
);

cli(repo, ["index", "--check"]);
process.stdout.write("PASS work-order index fixtures\n");
