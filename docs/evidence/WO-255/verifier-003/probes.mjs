// Independent VER-003 checks of the repaired recorder (D038, D040, D042) and
// the table rules it now reads through the shared Markdown parser. Every case
// gets an isolated synthetic repository; no provider is launched and the
// helper route uses its fixture transport. Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-255/verifier-003/probes.mjs
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { createFixtureRoot, excludeFixtureOwnership, removeTemporaryPath } =
  await import(pathToFileURL(join(root, "scripts/lib/temporary-roots.mjs")));
const { recordAgentReview, runChangeReview } = await import(
  pathToFileURL(join(root, "scripts/lib/review-worker.mjs"))
);
const { main: workerMain } = await import(
  pathToFileURL(join(root, "scripts/worker.mjs"))
);
const { workingTree } = await import(
  pathToFileURL(join(root, "scripts/lib/checkpoint.mjs"))
);

const parent = realpathSync(createFixtureRoot(join(tmpdir(), "wo255-ver003-")));
const observations = [];
const tick = "`";
const fence = (marker, value, info = "json") =>
  `${marker}${info}\n${JSON.stringify(value)}\n${marker}`;
const TABLE = [
  "## Traced consumers",
  "",
  "| Changed contract | Consumer | Command | Result |",
  "| --- | --- | --- | --- |",
  "| generated pages | docs/guide.md | node scripts/meta.mjs --check | current |",
  "| fixture manifests | fixtures/manifest.json | rg -n module fixtures | none |",
  "",
].join("\n");
const sample = {
  id: "F1",
  severity: "note",
  summary: "Sample finding inside a documented example.",
  file: "docs/guide.md",
  line: 1,
  basis: null,
};
const actual = {
  id: "F1",
  severity: "blocking",
  summary: "The consumer still reads the old field.",
  file: "src/module.mjs",
  line: 1,
  basis: { criterion: "1" },
};
const result = (findings, report) => ({
  schemaVersion: 1,
  findings,
  rechecks: [],
  filesRead: ["src/module.mjs"],
  report,
});

const git = (repo, ...args) =>
  execFileSync("git", args, {
    cwd: repo,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const put = (repo, name, text) => {
  mkdirSync(dirname(join(repo, name)), { recursive: true });
  writeFileSync(join(repo, name), text);
};
const commit = (repo, message) => {
  git(repo, "add", "-A");
  git(
    repo,
    "-c",
    "core.hooksPath=/dev/null",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "--quiet",
    "-m",
    message,
  );
};
let serial = 0;
/** A synthetic launchpad on main with one order, then a branch with one
 * committed change: `wo-901` for an order subject, `planning/...` for a
 * planning subject. */
const repository = (branch = "wo-901") => {
  const repo = join(parent, `case-${++serial}`);
  mkdirSync(repo);
  git(repo, "init", "--quiet", "-b", "main");
  excludeFixtureOwnership(repo);
  git(repo, "config", "user.name", "Verification fixture");
  git(repo, "config", "user.email", "fixture@example.invalid");
  put(repo, ".gitignore", "docs/control/local/\n.dotln-owner.json\n");
  put(repo, "README.md", "# Synthetic base\n");
  put(repo, "src/module.mjs", "export const value = 1;\n");
  put(
    repo,
    "docs/work-orders/WO-901-fixture.md",
    "# WO-901 — Fixture\n\n**Acceptance criteria (all required)**\n\n1. src/module.mjs exports 2.\n",
  );
  commit(repo, "Synthetic base");
  git(repo, "switch", "--quiet", "-c", branch);
  if (branch.startsWith("planning/"))
    put(repo, "docs/planning/pass.md", "# Synthetic pass\n\nPlans WO-901.\n");
  else put(repo, "src/module.mjs", "export const value = 2;\n");
  commit(repo, "Synthetic change");
  return repo;
};
const returned = (text) => {
  const file = join(parent, `return-${++serial}.txt`);
  writeFileSync(file, text);
  return file;
};
const clean = (message) =>
  String(message)
    .replaceAll(parent, "<fixture>")
    .replaceAll(root, "<worktree>")
    .slice(0, 400);
const check = (name, passed, details) =>
  observations.push({ name, passed: Boolean(passed), ...details });
const laneHolds = (repo) =>
  existsSync(join(repo, "docs/control/local/reviews"));

/** Record `text` and judge the outcome against `expect`: `prose` (whole
 * text kept, no findings), `structured` (findings ids), or `refused`
 * (message pattern, nothing written). */
async function recordCase(name, text, expect, flags = [], options = {}) {
  const repo = options.repo ?? repository(options.branch);
  const args = [
    "--kind",
    options.kind ?? "consistency",
    "--from",
    returned(text),
    ...flags,
  ];
  let printed = "";
  try {
    const saved = await (options.recorder ?? recordAgentReview)(repo, args, {
      write: (line) => (printed += line),
    });
    const record = JSON.parse(readFileSync(join(repo, saved.record), "utf8"));
    const ids = record.findings.map((finding) => finding.id);
    const passed =
      expect.type === "prose"
        ? !record.structured &&
          ids.length === 0 &&
          record.report === text.trim() &&
          (expect.inputFormat === undefined ||
            record.inputFormat === expect.inputFormat)
        : expect.type === "structured"
          ? record.structured &&
            JSON.stringify(ids) === JSON.stringify(expect.ids) &&
            (expect.inputFormat === undefined ||
              record.inputFormat === expect.inputFormat) &&
            (!expect.reportHas || record.report.includes(expect.reportHas))
          : expect.type === "either"
            ? expect.accept(record)
            : false;
    check(name, passed, {
      expected: expect.type,
      outcome: "recorded",
      structured: record.structured,
      inputFormat: record.inputFormat,
      findings: ids,
      wholeTextKept: record.report === text.trim(),
      ...(options.extra ? options.extra(record) : {}),
      printed: clean(printed.trim()),
    });
    return record;
  } catch (error) {
    const message = clean(error.message);
    const passed =
      (expect.type === "refused" &&
        expect.pattern.test(error.message) &&
        !laneHolds(repo)) ||
      (expect.type === "either" && expect.refusalOk);
    check(name, passed, {
      expected: expect.type,
      outcome: "refused",
      laneWritten: laneHolds(repo),
      error: message,
    });
    return null;
  }
}

for (const key of [
  "CODEX_THREAD_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_SESSION_ID",
  "COPILOT_AGENT_SESSION_ID",
  "DOTLN_DRIVEN_WORKER",
  "DOTLN_WORKER_FIXTURE",
  "DOTLN_WORKER_FIXTURE_TOUCH",
])
  delete process.env[key];

const MIXED = /--format prose[\s\S]*--format json/u;
try {
  // Auto mode: unambiguous inputs keep working without the flag.
  await recordCase(
    "auto: prose with a nested non-result JSON example stays prose",
    `# Consistency review\n\nThe payload looks like this:\n\n${fence("```", { data: { findings: [] } })}\n\nNo consumer broke.\n\n${TABLE}`,
    { type: "prose", inputFormat: "auto" },
  );
  await recordCase(
    "auto: prose without any brace stays prose",
    `# Consistency review\n\nEvery consumer reads the new field.\n\n${TABLE}`,
    { type: "prose", inputFormat: "auto" },
  );
  await recordCase(
    "auto: a whole pretty-printed result is structured",
    JSON.stringify(result([actual], TABLE), null, 2),
    { type: "structured", ids: ["F1"], inputFormat: "auto" },
  );
  await recordCase(
    "auto: a whole tilde-fenced result is structured",
    fence("~~~", result([actual], TABLE)),
    { type: "structured", ids: ["F1"], inputFormat: "auto" },
  );
  // Auto mode: a possible result embedded in prose is refused before writing.
  await recordCase(
    "auto: VER-001 findings example is refused naming both formats",
    `The API answers like this:\n\n${fence("```", { findings: [], total: 0 })}\n\nThe consumer handles it.\n\n${TABLE}`,
    { type: "refused", pattern: MIXED },
  );
  await recordCase(
    "auto: a genuine result followed by prose is refused naming both formats",
    `Review below.\n\n${fence("```", result([actual], TABLE))}\n\nThat is all.\n`,
    { type: "refused", pattern: MIXED },
  );
  await recordCase(
    "auto: an example inside a blockquote is refused, not adopted",
    `# Consistency review\n\n> ${JSON.stringify(result([sample], "sample"))}\n\n${TABLE}`,
    { type: "refused", pattern: MIXED },
  );

  // Explicit prose: every example kept, no example findings adopted.
  await recordCase(
    "prose: VER-001 findings example is preserved",
    `The API answers like this:\n\n${fence("```", { findings: [], total: 0 })}\n\nThe consumer handles it.\n\n${TABLE}`,
    { type: "prose", inputFormat: "prose" },
    ["--format", "prose"],
  );
  await recordCase(
    "prose: a terminal tilde-fenced valid example with a sample finding is preserved",
    `# Consistency review\n\nNo issues.\n\n${TABLE}\nA documented example record:\n\n${fence("~~~", result([sample], "sample report"))}\n`,
    { type: "prose", inputFormat: "prose" },
    ["--format", "prose"],
  );
  await recordCase(
    "prose: examples in a list item and a blockquote are preserved",
    `# Consistency review\n\n- Example: ${tick}${JSON.stringify(result([sample], "x"))}${tick}\n\n> ${JSON.stringify(result([sample], "y"))}\n\n${TABLE}`,
    { type: "prose", inputFormat: "prose" },
    ["--format", "prose"],
  );
  await recordCase(
    "prose: a Traced consumers table only inside a fenced example is refused",
    `# Consistency review\n\nThe brief asks for:\n\n${"```"}markdown\n${TABLE}${"```"}\n`,
    { type: "refused", pattern: /Traced consumers/u },
    ["--format", "prose"],
  );
  await recordCase(
    "prose: CRLF report with an h3 heading and the table directly under it is recorded",
    `# Consistency review\r\n\r\nFindings: none.\r\n\r\n### Traced consumers\r\n| Changed contract | Consumer | Command | Result |\r\n| --- | --- | --- | --- |\r\n| generated pages | docs/guide.md | node scripts/meta.mjs --check | current |\r\n| fixture manifests | fixtures/manifest.json | rg -n module fixtures | none |\r\n`,
    { type: "prose", inputFormat: "prose" },
    ["--format", "prose"],
  );
  await recordCase(
    "prose: a table without the fixture manifests row is refused naming it",
    `# Consistency review\n\n${TABLE.split("| fixture manifests")[0]}`,
    { type: "refused", pattern: /no fixture manifests row/u },
    ["--format", "prose"],
  );

  // Explicit JSON: exactly one result, findings and report field retained.
  await recordCase(
    "json: VER-002 F3 genuine fenced result with a closing sentence keeps F1 and its table",
    `Here is my review.\n\n${fence("```", result([actual], TABLE))}\n\nThat is all.\n`,
    {
      type: "structured",
      ids: ["F1"],
      inputFormat: "json",
      reportHas: "| fixture manifests |",
    },
    ["--format", "json"],
  );
  await recordCase(
    "json: an unfenced result inside a sentence keeps F1",
    `My result is ${JSON.stringify(result([actual], TABLE))} and nothing else.\n`,
    { type: "structured", ids: ["F1"], inputFormat: "json" },
    ["--format", "json"],
  );
  await recordCase(
    "json: a result plus a quoted result example is refused as two",
    `${fence("```", result([actual], TABLE))}\n\nFor reference, an empty one is ${tick}{"schemaVersion":1,"findings":[]}${tick}.\n`,
    { type: "refused", pattern: /exactly one findings object; found 2/u },
    ["--format", "json"],
  );
  await recordCase(
    "json: a malformed result with prose is refused",
    `Return:\n\n{"schemaVersion":1,"findings":"none","rechecks":[],"filesRead":[],"report":"x"}\n\nDone.\n`,
    { type: "refused", pattern: /findings|schema|invalid/iu },
    ["--format", "json"],
  );
  await recordCase(
    "json: a result whose report and surrounding prose lack the table is refused naming it",
    `Here:\n\n${fence("```", result([actual], "Read the module."))}\n\nThat is all.\n`,
    { type: "refused", pattern: /Traced consumers/u },
    ["--format", "json"],
  );
  // Doc precision: closing prose with a brace that is not JSON. Acceptable
  // outcomes are a loud refusal or the structured F1; silent prose is not.
  await recordCase(
    "json: closing prose holding a non-JSON brace is refused or keeps F1, never silent prose",
    `Here:\n\n${fence("```", result([actual], TABLE))}\n\nTemplates such as {name} were unchanged.\n`,
    {
      type: "either",
      refusalOk: true,
      accept: (record) =>
        record.structured && record.findings.map((f) => f.id).join() === "F1",
    },
    ["--format", "json"],
  );
  await recordCase(
    "format: an unknown format is refused naming prose or json",
    `# Consistency review\n\n${TABLE}`,
    { type: "refused", pattern: /--format is prose or json/u },
    ["--format", "yaml"],
  );

  // Criterion 3's actor and tree clauses hold beside the format.
  {
    const repo = repository();
    const tree = workingTree(repo);
    put(repo, "README.md", "# Edited after the review\n");
    await recordCase(
      "json: host, model, effort and an earlier --tree are recorded beside the format",
      `Reviewed tree: ${tree}\n\n${fence("```", result([actual], TABLE))}\n\nThat is all.\n`,
      { type: "structured", ids: ["F1"], inputFormat: "json" },
      [
        "--format",
        "json",
        "--host",
        "codex",
        "--model",
        "gpt-6-astra",
        "--effort",
        "max",
        "--tree",
        tree,
      ],
      {
        repo,
        extra: (record) => ({
          host: record.host,
          model: record.model.value,
          effort: record.effort.value,
          treeMatches: record.reviewedTree === tree,
          treeSource: record.reviewedTreeSource,
        }),
      },
    );
    const last = observations.at(-1);
    last.passed =
      last.passed &&
      last.host === "codex" &&
      last.model === "gpt-6-astra" &&
      last.effort === "max" &&
      last.treeMatches === true;
  }

  // The command dispatcher the npm script runs passes the flag through; its
  // own stdout line is held back so this script prints only its JSON.
  const dispatched = async (repo, args) => {
    const write = process.stdout.write;
    process.stdout.write = () => true;
    try {
      return await workerMain(["record", ...args], repo);
    } finally {
      process.stdout.write = write;
    }
  };
  await recordCase(
    "dispatcher: worker record --format prose keeps the example-bearing prose",
    `Example: ${tick}{"schemaVersion":1,"findings":[]}${tick}\n\n${TABLE}`,
    { type: "prose", inputFormat: "prose" },
    ["--format", "prose"],
    { recorder: dispatched },
  );
  await recordCase(
    "dispatcher: worker record without a format refuses the same text",
    `Example: ${tick}{"schemaVersion":1,"findings":[]}${tick}\n\n${TABLE}`,
    { type: "refused", pattern: MIXED },
    [],
    { recorder: dispatched },
  );

  // Criterion 4's record route with the format and the AST-read Items table.
  {
    const captureText =
      "# Dispatch\n\n1. Key the lane by branch.\n2. Read the whole change again.\n";
    const capture = join(parent, "capture.md");
    writeFileSync(capture, captureText);
    const items = [
      "## Items",
      "",
      "| Item | Location in the subject | Disposition |",
      "| --- | --- | --- |",
      "| 1 | docs/planning/pass.md | acted on |",
      "| 2 | WO-901 criterion 1 | reviewed |",
      "",
    ].join("\n");
    const planning = [
      "--subject",
      "planning",
      "--capture",
      capture,
      "--host",
      "claude",
    ];
    const capturedRecord = await recordCase(
      "capture prose: Items table plus a findings example records the digest and no capture bytes",
      `# Criteria review\n\nAn empty result reads ${tick}{"findings":[]}${tick}.\n\n${items}`,
      { type: "prose", inputFormat: "prose" },
      ["--format", "prose", ...planning],
      {
        kind: "criteria",
        branch: "planning/2030-02-03/ver003",
        extra: (record) => ({
          captureDigestMatches:
            record.captures?.[0]?.sha256 ===
            createHash("sha256").update(captureText).digest("hex"),
          captureBytesAbsent: !JSON.stringify(record).includes(
            "Key the lane by branch",
          ),
        }),
      },
    );
    const last = observations.at(-1);
    last.passed =
      last.passed &&
      capturedRecord !== null &&
      last.captureDigestMatches === true &&
      last.captureBytesAbsent === true;
    await recordCase(
      "capture prose: an Items table only inside a blockquote is refused naming Items",
      `# Criteria review\n\n${items
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")}\n`,
      { type: "refused", pattern: /## Items/u },
      ["--format", "prose", ...planning],
      { kind: "criteria", branch: "planning/2030-02-03/ver003-b" },
    );
    await recordCase(
      "capture json: a genuine result whose report holds the Items table is structured",
      `Result:\n\n${fence("```", result([actual], items))}\n\nEnd.\n`,
      { type: "structured", ids: ["F1"], inputFormat: "json" },
      ["--format", "json", ...planning],
      { kind: "criteria", branch: "planning/2030-02-03/ver003-c" },
    );
  }

  // The helper route applies the AST table rule to a returned report.
  for (const [name, report, recorded] of [
    [
      "helper: a returned consistency report without the table is refused",
      "Read src/module.mjs.",
      false,
    ],
    [
      "helper: a returned consistency report whose table is only in a fence is refused",
      `The brief asks for:\n\n${"```"}\n${TABLE}${"```"}\n`,
      false,
    ],
    [
      "helper: a returned consistency report with the table is recorded",
      TABLE,
      true,
    ],
  ]) {
    const repo = repository();
    const canned = join(parent, `canned-${++serial}.json`);
    writeFileSync(canned, JSON.stringify(result([actual], report)));
    process.env.DOTLN_WORKER_FIXTURE = canned;
    let printed = "";
    try {
      const outcome = await runChangeReview(
        repo,
        ["--kind", "consistency", "--host", "claude"],
        { write: (line) => (printed += line) },
      );
      const wrote = Boolean(outcome?.report);
      check(name, wrote === recorded, {
        expected: recorded ? "recorded" : "refused",
        outcome: wrote ? "recorded" : "refused",
        namesTable: /Traced consumers/u.test(printed),
        printed: clean(printed.trim().split("\n")[0]),
      });
      if (!recorded)
        observations.at(-1).passed &&= /Traced consumers/u.test(printed);
    } catch (error) {
      check(name, !recorded && /Traced consumers/u.test(error.message), {
        expected: recorded ? "recorded" : "refused",
        outcome: "refused",
        error: clean(error.message),
      });
    } finally {
      delete process.env.DOTLN_WORKER_FIXTURE;
    }
  }

  // The activation-base recorder on two of the inputs, so a current refusal
  // is judged against what main did. Only relative module specifiers are
  // re-pointed; the helpers it imports are the current checkout's.
  {
    const base = "ccfba0df927ccc2e76558af701a1075fc0fa4b36";
    const moduleUrl = pathToFileURL(
      join(root, "scripts/lib/review-worker.mjs"),
    );
    const source = git(root, "show", `${base}:scripts/lib/review-worker.mjs`)
      .replace(
        /from "(\.{1,2}\/[^"\n]+)"/gu,
        (_, spec) => `from "${new URL(spec, moduleUrl).href}"`,
      )
      .replace(
        /import\("(\.{1,2}\/[^"\n]+)"\)/gu,
        (_, spec) => `import("${new URL(spec, moduleUrl).href}")`,
      )
      .replaceAll(
        "import(`../../packages/",
        `import(\`${pathToFileURL(join(root, "packages")).href}/`,
      );
    const baseRecorder = (
      await import(
        `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
      )
    ).recordAgentReview;
    await recordCase(
      "base: the VER-001 findings example was not kept as prose at main either",
      `The API answers like this:\n\n${fence("```", { findings: [], total: 0 })}\n\nThe consumer handles it.\n\n${TABLE}`,
      {
        type: "either",
        refusalOk: true,
        accept: (record) => record.structured,
      },
      [],
      { recorder: baseRecorder },
    );
    await recordCase(
      "base: a genuine result with closing prose holding a non-JSON brace lost F1 or was refused at main",
      `Here:\n\n${fence("```", result([actual], TABLE))}\n\nTemplates such as {name} were unchanged.\n`,
      {
        type: "either",
        refusalOk: true,
        accept: (record) => !record.structured,
      },
      [],
      { recorder: baseRecorder },
    );
  }
} finally {
  removeTemporaryPath(parent, { recursive: true, force: true });
}

const failed = observations.filter((row) => !row.passed);
process.stdout.write(
  `${JSON.stringify({ checks: observations.length, passed: observations.length - failed.length, failed: failed.length, observations }, null, 2)}\n`,
);
process.exitCode = failed.length ? 1 : 0;
