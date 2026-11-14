// Part G's evidence from a fresh export. Nothing is committed on an order's
// branch before final review and an export reads committed files, so this
// exports from the commit the launchpad tests' fixture makes: a copy of the
// working tree committed in a temporary repository. The export is this
// script's own and nothing is installed into it.
//
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-g/exported.mjs
//
// It writes, beside itself: the two seeds as exported (as text files, since
// their links are an instance's), the operator's page as exported and what
// `node scripts/launchpad.mjs commands` prints there, the generated check's
// two refusals in a scratch copy, the document check's judgment of entries
// of the file for core, and results.json with what was compared and timed.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ok,
  repository,
  runExport,
  scratch,
} from "../../../../scripts/lib/launchpad-fixture.mjs";
import {
  OPERATOR_STEPS,
  readMarkedBlocks,
  writeOperatorPage,
} from "../../../../scripts/lib/operator-commands.mjs";
import { forCoreFailures } from "../../../../scripts/docs-check.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// An export of this script's own, which nothing has installed into: the
// fixture's shared one is given an install for the cases that need it.
const kit = join(scratch, "part-g-export");
ok(runExport(kit), "export");
const read = (root, path) => readFileSync(join(root, path), "utf8");
const save = (name, text) => writeFileSync(join(here, name), text);
// The fixture's temporary paths never enter a committed file.
const plain = (text) => text.replaceAll(kit, "<export>");

test("Part G: the seeds, the page and the file for core of a fresh export", () => {
  const results = {
    what: "Part G's comparisons over a fresh export made by the launchpad tests' fixture from a commit of a copy of this working tree, before any install; and two timings on this host.",
    command:
      "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-g/exported.mjs",
  };

  // G1: the first order and the security seed as exported.
  const [first] = readdirSync(join(kit, "docs/work-orders")).filter((name) =>
    name.startsWith("WO-001-"),
  );
  const seeds = {
    "first-order.exported.txt": read(kit, `docs/work-orders/${first}`),
    "AI-HARNESS-SECURITY.exported.txt": read(kit, "AI-HARNESS-SECURITY.md"),
  };
  // Names of agent harnesses and model providers other than Claude Code and
  // its maker, and the two phrases the first seed once held.
  const others =
    /\b(?:codex|copilot|cursor|gemini|openai|gpt|aider|windsurf|cline|bedrock|vertex|ollama|mistral|llama)\b|each AI coding harness|smoke invocation/giu;
  results.seeds = Object.fromEntries(
    Object.entries(seeds).map(([name, text]) => {
      save(name, text);
      return [
        name,
        {
          from: name.startsWith("first")
            ? `docs/work-orders/${first}`
            : "AI-HARNESS-SECURITY.md",
          bytes: Buffer.byteLength(text),
          otherHarnessOrProviderNames: [
            ...new Set(
              (text.match(others) ?? []).map((word) => word.toLowerCase()),
            ),
          ],
          namesClaudeCode: text.includes("Claude Code"),
          namesElection: /features\.host-|elect/iu.test(text),
        },
      ];
    }),
  );
  for (const row of Object.values(results.seeds)) {
    assert.deepEqual(row.otherHarnessOrProviderNames, []);
    assert.ok(row.namesClaudeCode);
  }

  // G3: the page as exported, and the command before any install.
  const page = read(kit, "docs/OPERATOR.md");
  save("OPERATOR.exported.txt", page);
  // Before any install: the export links its own workspace packages and
  // holds no dependency a registry supplies.
  assert.deepEqual(readdirSync(join(kit, "node_modules")), ["@dotln"]);
  const printed = spawnSync(
    process.execPath,
    ["scripts/launchpad.mjs", "commands"],
    {
      cwd: kit,
      encoding: "utf8",
      env: { ...process.env, DOTLN_LAUNCHPAD: "" },
    },
  );
  save(
    "commands-output.txt",
    `$ node scripts/launchpad.mjs commands   # in the fresh export, before any install; exit ${printed.status}\n${plain(printed.stdout)}${plain(printed.stderr)}`,
  );
  const { blocks, faults } = readMarkedBlocks(read(kit, "docs/KIT.md"));
  const order = OPERATOR_STEPS.map(([id]) => id);
  const inOrder = (text) => {
    let at = 0;
    for (const block of [...blocks].sort(
      (a, b) =>
        order.indexOf(a.step) - order.indexOf(b.step) || a.line - b.line,
    )) {
      const bytes = `${block.fence}${block.info}\n${block.content.join("\n")}\n${block.fence}\n`;
      const found = text.indexOf(bytes, at);
      if (found < at)
        return `the block of ${block.step} at guide line ${block.line} is missing or out of order`;
      at = found + bytes.length;
    }
    return null;
  };
  results.page = {
    guideFaults: faults,
    markedBlocks: blocks.length,
    blocksByStep: Object.fromEntries(
      order.map((step) => [
        step,
        blocks.filter((block) => block.step === step).length,
      ]),
    ),
    pageHoldsEveryBlockInTheCyclesOrder: inOrder(page) === null,
    versionNamed:
      /the DotLn kit at `(v\d+\.\d+\.\d+[^`]*)`/u.exec(page)?.[1] ?? null,
    commandExit: printed.status,
    commandPrintsThePage: printed.stdout === page,
    commandPrintsEveryBlockInOrder: inOrder(printed.stdout) === null,
  };
  assert.deepEqual(faults, []);
  assert.equal(results.page.pageHoldsEveryBlockInTheCyclesOrder, true);
  assert.equal(printed.status, 0, printed.stderr);
  assert.equal(results.page.commandPrintsEveryBlockInOrder, true);
  assert.ok(results.page.versionNamed);

  // G3: the generated check in a scratch copy of core's three files.
  const scratch = mkdtempSync(join(tmpdir(), "dotln-part-g-"));
  try {
    mkdirSync(join(scratch, "docs"));
    for (const path of ["README.md", "docs/KIT.md", "docs/OPERATOR.md"])
      writeFileSync(join(scratch, path), read(repository, path));
    const started = performance.now();
    const current = writeOperatorPage(scratch, { check: true });
    const checkMs = Math.round(performance.now() - started);
    const guide = read(scratch, "docs/KIT.md");
    const changed = guide.replace(
      "git push -u origin main\nnode scripts/bootstrap.mjs\n",
      "git push -u origin main\ngit status\nnode scripts/bootstrap.mjs\n",
    );
    assert.notEqual(changed, guide);
    writeFileSync(join(scratch, "docs/KIT.md"), changed);
    const stale = writeOperatorPage(scratch, { check: true });
    const rewritten = writeOperatorPage(scratch);
    const after = writeOperatorPage(scratch, { check: true });
    writeFileSync(
      join(scratch, "docs/KIT.md"),
      `${changed}\nMore prose.\n\n\`\`\`sh\nnpm run unseen\n\`\`\`\n`,
    );
    const unmarked = writeOperatorPage(scratch, { check: true });
    save(
      "generated-check.txt",
      [
        "# The operator-commands check (writeOperatorPage with check) in a scratch copy of README.md, docs/KIT.md and docs/OPERATOR.md.",
        `## As committed: exit ${current.exitCode}`,
        ...current.output,
        `## After one line is added to a marked block of the guide: exit ${stale.exitCode}`,
        ...stale.output,
        `## After the page is regenerated: exit ${rewritten.exitCode}, then the check: exit ${after.exitCode}`,
        `## After a fenced shell block with no marker is added to the guide: exit ${unmarked.exitCode}`,
        ...unmarked.output,
        "",
      ].join("\n"),
    );
    assert.deepEqual(
      [current.exitCode, stale.exitCode, after.exitCode, unmarked.exitCode],
      [0, 1, 0, 1],
    );
    results.generatedCheck = {
      checkMs,
      exits: {
        current: current.exitCode,
        stale: stale.exitCode,
        regenerated: after.exitCode,
        unmarked: unmarked.exitCode,
      },
    };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

  // G4: the file for core as exported, and the document check's judgment of
  // its entries.
  const forCore = read(kit, "FOR-CORE.md");
  const template = read(repository, "scripts/kit/for-core.template.md");
  const entry = (block) =>
    `${forCore}\n## 2026-11-11 — WO-002 — the update preview refused a path the kit had written\n\n\`\`\`json\n${block}\n\`\`\`\n\nWhat the kit did, what was expected, the command and its message, and the route used meanwhile.\n`;
  const cases = {
    "the file as seeded, with no entry": forCore,
    "an entry of the stated form": entry(
      '{ "kit": "v0.123.0", "stopsNextOrder": false, "answered": null }',
    ),
    "an entry that lacks a field": entry(
      '{ "kit": "v0.123.0", "answered": null }',
    ),
    "an entry with a value outside its set": entry(
      '{ "kit": "v0.123.0", "stopsNextOrder": "no", "answered": null }',
    ),
    "an entry whose block is no JSON": entry("{ kit: v0.123.0 }"),
  };
  const started = performance.now();
  const judged = Object.fromEntries(
    Object.entries(cases).map(([name, text]) => [name, forCoreFailures(text)]),
  );
  const entryMs = Math.round(performance.now() - started);
  save(
    "entry-checks.txt",
    [
      "# forCoreFailures of scripts/docs-check.mjs, which the document check runs on a root that holds FOR-CORE.md.",
      ...Object.entries(judged).flatMap(([name, failures]) => [
        `## ${name}: ${failures.length ? "fails" : "passes"}`,
        ...failures,
      ]),
      "",
    ].join("\n"),
  );
  results.forCore = {
    exportedEqualsTemplate: forCore === template,
    failures: Object.fromEntries(
      Object.entries(judged).map(([name, failures]) => [name, failures.length]),
    ),
    fiveJudgmentsMs: entryMs,
  };
  assert.equal(forCore, template);
  assert.deepEqual(judged["the file as seeded, with no entry"], []);
  assert.deepEqual(judged["an entry of the stated form"], []);
  for (const name of [
    "an entry that lacks a field",
    "an entry with a value outside its set",
    "an entry whose block is no JSON",
  ])
    assert.ok(judged[name].length > 0, name);
  save("results.json", `${JSON.stringify(results, null, 2)}\n`);
});
