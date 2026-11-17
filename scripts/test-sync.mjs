import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { syncArtifacts } from "./sync.mjs";
import {
  checkGenerated,
  checkArtifact,
  compileStaleRuntime,
  generatedArtifacts,
} from "./lib/generated-artifacts.mjs";
import { TOOL_ROOT } from "./lib/config.mjs";
import { runGit } from "./lib/git.mjs";
import {
  THIRD_PARTY_NOTICES,
  VENDORED,
  VENDORED_RECORD,
  provenVendoredBytes,
  provenVendoredFile,
  vendorParser,
  vendoredProof,
} from "./lib/vendored-parser.mjs";

function fixture(t) {
  const root = createFixtureRoot(join(tmpdir(), "dotln-sync-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      private: true,
      scripts: {
        "format:check": "node scripts/artifact.mjs format check",
        format: "node scripts/artifact.mjs format write",
      },
    }),
  );
  writeFileSync(
    join(root, "scripts/artifact.mjs"),
    `
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
const [name, mode, previous] = process.argv.slice(2);
if (mode === 'write') {
  if (previous && (!existsSync(previous) || readFileSync(previous, 'utf8') !== 'current\\n')) throw new Error('dependency out of order: '+previous);
  writeFileSync(name, 'current\\n');
  appendFileSync('writes.txt', name+'\\n');
} else {
  process.exitCode = existsSync(name) && readFileSync(name, 'utf8') === 'current\\n' ? 0 : 1;
  if (process.exitCode) console.log('DOTLN_ARTIFACT_STALE '+name);
}
`,
  );
  const command = (name, mode, previous) => [
    process.execPath,
    "scripts/artifact.mjs",
    name,
    mode,
    ...(previous ? [previous] : []),
  ];
  const names = generatedArtifacts(TOOL_ROOT).map((row) => row.name);
  const artifacts = names.map((name, index) => ({
    name,
    check: command(name, "check"),
    write: command(name, "write", names[index - 1] ?? "format"),
  }));
  const snapshot = () =>
    readdirSync(root)
      .filter((name) => name !== "scripts")
      .sort()
      .map((name) => [name, readFileSync(join(root, name), "utf8")]);
  return { root, names, artifacts, snapshot };
}

test("WO-275 criterion 3: the operator commands page holds the kit guide's marked blocks in the cycle's order, goes stale naming itself when a marked block changes, and an unmarked shell block fails naming its line", async (t) => {
  const {
    OPERATOR_STEPS,
    readMarkedBlocks,
    renderOperatorPage,
    writeOperatorPage,
  } = await import("./lib/operator-commands.mjs");
  const read = (root, path) => readFileSync(join(root, path), "utf8");
  // This repository's page is the rendering of its own guide, and it holds
  // every marked block byte for byte, step by step in the cycle's order.
  const page = read(TOOL_ROOT, "docs/OPERATOR.md");
  assert.equal(renderOperatorPage(TOOL_ROOT).page, page);
  const { blocks, faults } = readMarkedBlocks(read(TOOL_ROOT, "docs/KIT.md"));
  assert.deepEqual(faults, []);
  const order = OPERATOR_STEPS.map(([id]) => id);
  let at = 0;
  for (const block of [...blocks].sort(
    (a, b) => order.indexOf(a.step) - order.indexOf(b.step) || a.line - b.line,
  )) {
    const bytes = `${block.fence}${block.info}\n${block.content.join("\n")}\n${block.fence}\n`;
    const found = page.indexOf(bytes, at);
    assert.ok(
      found >= at,
      `block of ${block.step} at guide line ${block.line}`,
    );
    at = found + bytes.length;
  }
  assert.deepEqual(
    [...page.matchAll(/^## \d+\. (.+)$/gmu)].map((match) => match[1]),
    OPERATOR_STEPS.map(([, heading]) => heading),
  );
  const version = /`(v\d+\.\d+\.\d+)`/u.exec(
    read(TOOL_ROOT, "README.md").split("<!-- DOTLN-RELEASE-BEGIN -->")[1],
  )[1];
  assert.match(
    page,
    new RegExp(`the DotLn kit at \`${version.replaceAll(".", "\\.")}\``, "u"),
  );
  // A scratch copy: a changed marked block leaves the page stale, named,
  // until the writer regenerates it.
  const root = createFixtureRoot(join(tmpdir(), "dotln-operator-commands-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "docs"));
  for (const path of ["README.md", "docs/KIT.md", "docs/OPERATOR.md"])
    writeFileSync(join(root, path), read(TOOL_ROOT, path));
  assert.equal(writeOperatorPage(root, { check: true }).exitCode, 0);
  const guide = read(root, "docs/KIT.md");
  const changed = guide.replace(
    "git push -u origin main\nnode scripts/bootstrap.mjs\n",
    "git push -u origin main\ngit status\nnode scripts/bootstrap.mjs\n",
  );
  assert.notEqual(changed, guide);
  writeFileSync(join(root, "docs/KIT.md"), changed);
  const stale = writeOperatorPage(root, { check: true });
  assert.equal(stale.exitCode, 1);
  assert.match(stale.output.join("\n"), /^stale docs\/OPERATOR\.md: /mu);
  assert.ok(stale.output.includes("DOTLN_ARTIFACT_STALE operator-commands"));
  assert.equal(writeOperatorPage(root).exitCode, 0);
  assert.equal(writeOperatorPage(root, { check: true }).exitCode, 0);
  assert.match(read(root, "docs/OPERATOR.md"), /\ngit status\n/u);
  // A fenced shell block with neither a step's marker nor the aside marker
  // fails the check naming its line, and the page is not written over it.
  const unmarked = `${changed}\nMore prose.\n\n\`\`\`sh\nnpm run unseen\n\`\`\`\n`;
  writeFileSync(join(root, "docs/KIT.md"), unmarked);
  const line =
    unmarked.split("\n").indexOf("```sh", changed.split("\n").length) + 1;
  const refused = writeOperatorPage(root, { check: true });
  assert.equal(refused.exitCode, 1);
  assert.deepEqual(refused.output, [
    `FAIL docs/KIT.md:${line}: a fenced shell block carries no operator-commands marker; mark it with its step (<!-- operator-commands <step> -->) or set it aside (<!-- operator-commands aside -->)`,
  ]);
  assert.ok(!refused.output.includes("DOTLN_ARTIFACT_STALE operator-commands"));
  // The attack on Part G (WO-276). A comment that opens as a marker and is
  // none is a fault naming its line, whatever its block's language: read as
  // an ordinary comment it dropped a text block from the page in silence.
  const runOrder = "<!-- operator-commands run-order -->";
  assert.ok(guide.includes(runOrder));
  for (const written of [
    "<!-- operator-commands run-order (each phase) -->",
    "<!-- operator-commands run-order:each phase -->",
    "<!-- operator-commands  run-order -->",
    "<!-- operator-commands Run-Order -->",
    "<!-- operator-command run-order -->",
    "<!-- operator-commands: run-order -->",
    "<!-- operator-commands run_order -->",
  ])
    assert.ok(
      readMarkedBlocks(guide.replace(runOrder, written)).faults.some((fault) =>
        fault.includes(
          ": a comment opens as an operator-commands marker and is not one the page reads; ",
        ),
      ),
      written,
    );
  // An unmarked block under any shell's or session's info string is
  // faulted, attributes and braces aside; a block of data is not.
  const unmarkedUnder = (info) =>
    readMarkedBlocks(
      ["# Guide", "", `\`\`\`${info}`, "run this", "```", ""].join("\n"),
    ).faults.filter((fault) =>
      fault.includes(
        "a fenced shell block carries no operator-commands marker",
      ),
    ).length;
  for (const info of [
    "sh-session",
    "shellsession",
    "fish",
    "powershell",
    "ps1",
    "{.bash}",
    "bash{1,2}",
    'bash title="x"',
    "Console",
    "",
  ])
    assert.equal(unmarkedUnder(info), 1, info);
  for (const info of ["json", "text", "js", "diff"])
    assert.equal(unmarkedUnder(info), 0, info);
  const before = read(root, "docs/OPERATOR.md");
  assert.equal(writeOperatorPage(root).exitCode, 1);
  assert.equal(read(root, "docs/OPERATOR.md"), before);
  // A longer fence keeps its length on the page, so a block that holds a
  // three-backtick line (a here-document writing a fence) keeps its bytes.
  // The block is added at the guide's end, so the case does not depend on
  // where the guide sets its own blocks.
  const longer = `${changed}\n<!-- operator-commands run-order -->\n\`\`\`\`sh\ncat <<'EOF' > fence.md\n\`\`\`\nEOF\n\`\`\`\`\n`;
  const { page: rendered, faults: longerFaults } = renderOperatorPage(root, {
    guide: longer,
  });
  assert.equal(longerFaults, undefined, String(longerFaults));
  assert.ok(
    rendered.includes("\n````sh\ncat <<'EOF' > fence.md\n```\nEOF\n````\n"),
    rendered,
  );
  // A fenced shell block inside a block quote is read as one too.
  const quoted = `${changed}\nMore prose.\n\n> \`\`\`sh\n> npm run unseen\n> \`\`\`\n`;
  const quotedLine =
    quoted.split("\n").indexOf("> ```sh", changed.split("\n").length) + 1;
  assert.deepEqual(readMarkedBlocks(quoted, "docs/KIT.md").faults, [
    `docs/KIT.md:${quotedLine}: a fenced shell block carries no operator-commands marker; mark it with its step (<!-- operator-commands <step> -->) or set it aside (<!-- operator-commands aside -->)`,
  ]);
  // The aside marker admits it; a marker over no block, an unknown step and a
  // step with a second sentence are each named.
  writeFileSync(
    join(root, "docs/KIT.md"),
    unmarked.replace(
      "\n```sh\nnpm run unseen",
      "\n<!-- operator-commands aside -->\n```sh\nnpm run unseen",
    ),
  );
  assert.equal(writeOperatorPage(root, { check: true }).exitCode, 0);
  const faulty = readMarkedBlocks(
    `${changed}\n<!-- operator-commands first-pass: A second sentence. -->\n\`\`\`text\nplanning: again\n\`\`\`\n\n<!-- operator-commands later -->\n\nprose\n`,
    "docs/KIT.md",
  ).faults.join("\n");
  assert.match(faulty, /step first-pass carries 2 sentences/u);
  assert.match(faulty, /marker names an unknown step "later"/u);
  assert.match(faulty, /marker stands over no fenced block/u);
});

test("WO-276 criterion B5: the carried parser, its license and its notices equal the installed package's files, the check names the one a byte changed, and only the recorded bytes are the proven copy", (t) => {
  const root = createFixtureRoot(join(tmpdir(), "dotln-vendored-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const installed = {
    "node_modules/prettier/package.json": '{"version":"9.9.9"}\n',
    "node_modules/prettier/plugins/markdown.mjs": "export const parse = 1;\n",
    "node_modules/prettier/LICENSE": "A license.\n",
    "node_modules/prettier/THIRD-PARTY-NOTICES.md": "# Notices\n",
  };
  for (const [path, text] of Object.entries(installed)) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  mkdirSync(join(root, "scripts/lib/vendor"), { recursive: true });
  const copies = VENDORED.map(([copy]) => copy);
  // Nothing is proven before the copies and their record exist.
  assert.deepEqual(
    vendorParser(root, { check: true }).sort(),
    [...copies, VENDORED_RECORD, THIRD_PARTY_NOTICES].sort(),
  );
  assert.equal(
    copies.some((copy) => provenVendoredFile(root, copy)),
    false,
  );
  vendorParser(root);
  assert.deepEqual(vendorParser(root, { check: true }), []);
  for (const [copy, source] of VENDORED) {
    assert.deepEqual(
      readFileSync(join(root, copy)),
      readFileSync(join(root, source)),
      copy,
    );
    assert.equal(provenVendoredFile(root, copy), true, copy);
  }
  assert.match(
    readFileSync(join(root, THIRD_PARTY_NOTICES), "utf8"),
    /9\.9\.9/u,
  );
  // One byte more in any of the three: the check names that file alone, and
  // the file is no longer the proven copy, by the record a kit carries too.
  const proof = vendoredProof(
    readFileSync(join(root, VENDORED_RECORD), "utf8"),
  );
  for (const copy of copies) {
    const held = readFileSync(join(root, copy));
    const changed = Buffer.concat([held, Buffer.from("\n")]);
    writeFileSync(join(root, copy), changed);
    assert.deepEqual(vendorParser(root, { check: true }), [copy]);
    assert.equal(provenVendoredFile(root, copy), false, copy);
    assert.equal(provenVendoredBytes(root, copy, changed), false, copy);
    assert.equal(proof(copy, changed), false, copy);
    assert.equal(proof(copy, held), true, copy);
    writeFileSync(join(root, copy), held);
  }
  // No other path is ever the proven copy, whatever its bytes.
  const beside = "scripts/lib/vendor/other.mjs";
  writeFileSync(join(root, beside), readFileSync(join(root, copies[0])));
  assert.equal(provenVendoredFile(root, beside), false);
  // The record and the notices file are checked as the copies are.
  for (const path of [VENDORED_RECORD, THIRD_PARTY_NOTICES]) {
    const held = readFileSync(join(root, path), "utf8");
    writeFileSync(join(root, path), `${held} `);
    assert.deepEqual(vendorParser(root, { check: true }), [path]);
    writeFileSync(join(root, path), held);
  }
  // Without an installed package the check says what to run.
  rmSync(join(root, "node_modules"), { recursive: true, force: true });
  assert.throws(() => vendorParser(root, { check: true }), /run npm ci/u);
  // The record still proves the copies there.
  assert.equal(provenVendoredFile(root, copies[0]), true);
});

test("generated freshness names every stale artifact and leaves all bytes unchanged", (t) => {
  const { root, artifacts, names, snapshot } = fixture(t);
  const before = snapshot();
  const result = checkGenerated(root, { artifacts });
  assert.equal(result.exitCode, 1);
  assert.deepEqual(result.stale, names);
  assert.deepEqual(snapshot(), before);
  for (const row of result.cases) {
    assert.equal(row.executed, true);
    assert.ok(row.durationMs >= 0);
    assert.ok(Date.parse(row.finishedAt) >= Date.parse(row.startedAt));
  }
  for (const name of names) {
    for (const entry of names)
      writeFileSync(
        join(root, entry),
        entry === name ? "stale\n" : "current\n",
      );
    assert.deepEqual(checkGenerated(root, { artifacts }).stale, [name]);
  }
});

test("sync regenerates in dependency order only when stale and its second run changes no byte", async (t) => {
  const { root, artifacts, names, snapshot } = fixture(t);
  const first = await syncArtifacts(root, { artifacts });
  assert.equal(first.exitCode, 0, JSON.stringify(first));
  assert.deepEqual(
    first.rows.map((row) => row.action),
    names.map(() => "regenerated").concat("regenerated"),
  );
  assert.deepEqual(
    readFileSync(join(root, "writes.txt"), "utf8").trim().split("\n"),
    ["format", ...names],
  );
  const before = snapshot();
  const second = await syncArtifacts(root, { artifacts });
  assert.equal(second.exitCode, 0);
  assert.ok(
    second.rows.every(
      (row) =>
        row.before === "current" &&
        row.after === "current" &&
        row.action === "none",
    ),
  );
  assert.deepEqual(snapshot(), before);
});

test("sync refreshes the harness before rendering its feature inventory", async (t) => {
  const { root } = fixture(t);
  const { emitHarness, checkHarness } = await import("./lib/harness.mjs");
  const { writeFeatures } = await import("./features.mjs");
  emitHarness(root, { instructionFloor: "# Fixture\n\nOwned floor.\n" });
  const instruction = join(root, "CLAUDE.md");
  const current = readFileSync(instruction, "utf8");
  const older = current.replace(
    /DotLn has \d+ refusals/u,
    "DotLn has 0 refusals",
  );
  assert.notEqual(older, current);
  writeFileSync(instruction, older);
  const page = writeFeatures(root);
  const artifacts = generatedArtifacts(root).filter((row) =>
    ["harness", "meta"].includes(row.name),
  );
  const run = (command) => {
    try {
      if (command[1] === "scripts/harness.mjs")
        (command[2] === "check" ? checkHarness : emitHarness)(root);
      else if (command[1] === "scripts/meta.mjs")
        writeFeatures(root, { check: command.includes("--check") });
      return { exitCode: 0, output: "" };
    } catch (error) {
      return { exitCode: 1, output: error.message };
    }
  };
  const result = await syncArtifacts(root, { artifacts, run });
  assert.equal(result.exitCode, 0, JSON.stringify(result.rows));
  checkHarness(root);
  writeFeatures(root, { check: true });
  const before = readFileSync(page, "utf8");
  const repeated = await syncArtifacts(root, { artifacts, run });
  assert.ok(repeated.rows.every((row) => row.action === "none"));
  assert.equal(readFileSync(page, "utf8"), before);
});

test("sync refuses a timed-out check without running its writer", async (t) => {
  const { root, artifacts } = fixture(t);
  writeFileSync(join(root, "format"), "current\n");
  const [artifact] = artifacts;
  const commands = [];
  const result = await syncArtifacts(root, {
    artifacts: [artifact],
    run: (command) => {
      commands.push(command);
      return command === artifact.check
        ? { exitCode: 1, timedOut: true, output: "check exceeded its deadline" }
        : { exitCode: 0, output: "" };
    },
  });
  assert.equal(result.exitCode, 1);
  const row = result.rows.find((entry) => entry.artifact === artifact.name);
  assert.deepEqual(
    [row.before, row.after, row.action],
    ["unknown", "unknown", "refused"],
  );
  assert.match(row.reason, /timed out/);
  assert.ok(!commands.includes(artifact.write), "no writer ran");
});

test("WO-284 criterion 2: a generated check ended for time names its key, the figure, the file and the listing command, and sync leaves its artifact unwritten", async (t) => {
  const { root, artifacts } = fixture(t);
  writeFileSync(join(root, "format"), "current\n");
  // A check that takes five seconds, under a root whose file gives each
  // generated check a fifth of a second.
  const slow = {
    ...artifacts[0],
    check: [process.execPath, "-e", "setTimeout(() => {}, 5000)"],
  };
  const limits = (body) => {
    mkdirSync(join(root, "docs/control"), { recursive: true });
    writeFileSync(
      join(root, "docs/control/time-limits.json"),
      JSON.stringify(body),
    );
  };
  limits({ limits: { "generated.check": { set: 200 } } });
  const miss =
    "Time limit generated.check reached: 200 ms. docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.";
  const checked = checkArtifact(slow, root);
  assert.deepEqual(
    [checked.exitCode, checked.timedOut, checked.timeLimitKey, checked.stale],
    [1, true, "generated.check", false],
  );
  assert.ok(checked.output.endsWith(miss), checked.output);
  assert.ok(checked.durationMs < 4000, String(checked.durationMs));
  // The generated row fails on it and the row's case carries the message.
  const generated = checkGenerated(root, { artifacts: [slow] });
  assert.equal(generated.exitCode, 1);
  assert.ok(generated.cases[0].output.endsWith(miss));
  // Sync reports the artifact unread and runs no writer for it.
  const result = await syncArtifacts(root, { artifacts: [slow] });
  const row = result.rows.find((entry) => entry.artifact === slow.name);
  assert.deepEqual(
    [row.before, row.after, row.action],
    ["unknown", "unknown", "refused"],
  );
  assert.ok(row.reason.startsWith("check timed out;"), row.reason);
  assert.ok(row.reason.endsWith(miss), row.reason);
  // Core's build of a stale runtime before a selection: ended for time, it
  // hands its caller the text that names its limit, since the generated
  // check that follows judges only the runtime that stayed stale.
  mkdirSync(join(root, "packages/skeleton/src"), { recursive: true });
  const built = compileStaleRuntime(root, {
    artifacts: [
      {
        name: "runtime",
        inspect: () => ({ current: false, reason: "a source is newer" }),
        // The build's stand-in below never starts this command.
        write: [process.execPath, "-e", ""],
        writeLimit: "generated.runtime-build",
      },
    ],
    run: (_command, _root, key) => ({
      exitCode: 1,
      output: "",
      timedOut: true,
      timeLimitKey: key,
    }),
  });
  assert.deepEqual(built, [
    {
      name: "runtime",
      exitCode: 1,
      miss: "Time limit generated.runtime-build reached: 0 h 2 min (120000 ms). docs/control/time-limits.json raises it, scales every limit or turns them off; npm run limits lists every key.",
    },
  ]);
  // Raised, the same check is read: here it finishes and reports no stale
  // artifact of its own, so it is judged and no longer ended for time.
  limits({ limits: { "generated.check": { set: 60_000 } } });
  const read = checkArtifact(
    { ...slow, check: [process.execPath, "-e", "setTimeout(() => {}, 600)"] },
    root,
  );
  assert.deepEqual([read.exitCode, read.timedOut], [0, undefined]);
  // Sync's own format row reads its own key, and a writer the writers' key.
  limits({
    limits: {
      "sync.format": { set: 200 },
      "generated.check": { set: 60_000 },
    },
  });
  const formatted = await syncArtifacts(root, {
    artifacts: [],
    run: (command, _root, key) => ({ exitCode: 0, output: "", key }),
  });
  assert.equal(formatted.exitCode, 0);
  const keys = [];
  await syncArtifacts(root, {
    artifacts: [artifacts[1]],
    run: (command, _root, key) => {
      keys.push(key);
      return command.includes("check") && keys.length < 3
        ? { exitCode: 1, output: `DOTLN_ARTIFACT_STALE ${artifacts[1].name}` }
        : { exitCode: 0, output: "" };
    },
  });
  assert.deepEqual(keys.slice(0, 3), [
    "sync.format",
    "generated.check",
    "sync.write",
  ]);
});

test("sync refuses an unclassified failure without running its writer", async (t) => {
  const { root, artifacts } = fixture(t);
  const [artifact] = artifacts;
  const commands = [];
  const result = await syncArtifacts(root, {
    artifacts: [artifact],
    run: (command) => {
      commands.push(command);
      return command === artifact.check
        ? { exitCode: 1, output: "invalid source input" }
        : { exitCode: 0, output: "" };
    },
  });
  assert.equal(result.exitCode, 1);
  assert.equal(result.rows.at(-1).before, "unknown");
  assert.match(result.rows.at(-1).reason, /check did not report stale/);
  assert.equal(commands.includes(artifact.write), false);
});

test("sync classifies real stale reports for every regenerable artifact and refuses unrelated failures", async () => {
  const reports = {
    format: [
      "[warn] Code style issues found in the above file. Run Prettier with --write to fix.",
    ],
    meta: [
      "Decisions index is stale; run npm run meta",
      "stale docs/control/FEATURES.md; run npm run features -- render",
      "stale records/control/FEATURES.md; run npm run features -- render",
      "follow-ups: register is stale; run npm run meta or npm run plan -- followups --sync",
    ],
    lineage: [
      "Stale docs/lineage/README.md; run node scripts/lineage.mjs index",
      "Missing docs/lineage/README.md; run node scripts/lineage.mjs index",
    ],
    index: [
      "docs/work-orders/README.md is stale at line 3; run npm run work-orders -- index",
      "docs/work-orders/README.md: the work-order index needs its tag record docs/control/release-history.json; run npm run work-orders -- index",
      "docs/control/release-history.json: invalid release tag record; run npm run work-orders -- index",
      "docs/control/workstream-observations.json: the workstream observations are missing; run npm run work-orders -- index",
      "docs/control/workstream-observations.json: invalid workstream observations; run npm run work-orders -- index",
      "docs/control/workstream-observations.json: missing or malformed workstream snapshot; run npm run work-orders -- index",
    ],
    "release-surfaces": [
      "FAIL release-block: observed no strict version; expected v1.0.0",
      "FAIL workspace-pin @dotln/skeleton -> @dotln/compiler: observed 0.1.0; expected exact workspace version 0.2.0",
    ],
    siblings: [
      "error: docs/siblings/README.md is stale at line 3; run node scripts/siblings.mjs index",
      "error: docs/siblings/README.md: the starter-fixture entry records manifest hash `old`, and its latest receipt docs/evidence/siblings/receipt.json records `new`; run node scripts/siblings.mjs index",
      "error: docs/siblings/tag-observations.json: missing tag observations; run node scripts/siblings.mjs index",
      "error: docs/siblings/tag-observations.json: invalid tag observations; run node scripts/siblings.mjs index",
      "error: docs/siblings/tag-observations.json: observations do not match receipt commits; run node scripts/siblings.mjs index",
      `error: docs/siblings/tag-observations.json: ${"a".repeat(40)} records tag "v9999.0.0", which is not a Git tag at its receipt commit; run node scripts/siblings.mjs index`,
      `error: docs/siblings/tag-observations.json: ${"a".repeat(40)} records nearest "v9999.0.0", which is not a Git tag at or below its receipt commit; run node scripts/siblings.mjs index`,
    ],
    harness: ["harness drift: .agents/skills/dotln-executor/SKILL.md"],
    "authority-evidence": [
      "stale WO-217 evidence: bundle-diff.json; select a new edition or revision to preserve existing evidence",
    ],
    "artifact-evidence": [
      "stale artifact evidence: identity.json; select a new edition to preserve the historical evidence",
    ],
    "verification-evidence": ["stale verification evidence: stale-status.json"],
    "feedback-evidence": [
      "feedback evidence is stale\n",
      "feedback evidence is stale: a compiler release moved the policy hash since the selected edition",
      "StaleFeedbackEdition [Error]: feedback evidence is stale: unresolvable edition reference: verification.json",
    ],
    "console-fixtures": ["console fixture changed: selfhost.html"],
    publication: ["FAIL 2 edition(s) are stale"],
    "operator-commands": [
      "stale docs/OPERATOR.md: it differs from the kit guide's marked command blocks; run npm run sync or node scripts/lib/operator-commands.mjs\nDOTLN_ARTIFACT_STALE operator-commands",
    ],
    "vendored-parser": [
      "stale scripts/lib/vendor/prettier-markdown.mjs: it differs from the pinned Prettier's file or its recorded hash; run npm run sync\nDOTLN_ARTIFACT_STALE vendored-parser",
      "stale scripts/lib/vendored-parser.json: it differs from the pinned Prettier's file or its recorded hash; run npm run sync\nDOTLN_ARTIFACT_STALE vendored-parser",
      "stale THIRD_PARTY_NOTICES: it differs from the pinned Prettier's file or its recorded hash; run npm run sync\nDOTLN_ARTIFACT_STALE vendored-parser",
    ],
  };
  const inventory = generatedArtifacts(TOOL_ROOT);
  assert.deepEqual(
    Object.keys(reports).sort(),
    [
      "format",
      ...inventory
        .filter(
          (row) =>
            !row.inspect &&
            (row.write || row.regenerate || row.kind || row.publication),
        )
        .map((row) => row.name),
    ].sort(),
    "each regenerable checker needs its real stale reports",
  );
  const runtime = inventory.find((row) => row.name === "runtime");
  assert.equal(
    checkArtifact(
      {
        ...runtime,
        inspect: () => ({ current: false, reason: "source changed" }),
      },
      TOOL_ROOT,
    ).stale,
    true,
  );
  for (const [name, messages] of Object.entries(reports)) {
    for (const output of messages) {
      const result = { exitCode: 1, output };
      assert.equal(
        checkArtifact({ name }, TOOL_ROOT, () => result).stale,
        true,
        `${name}: ${output}`,
      );
      for (const failure of [
        { ...result, exitCode: 2 },
        { ...result, timedOut: true },
        { ...result, unavailable: true },
      ])
        assert.equal(
          checkArtifact({ name }, TOOL_ROOT, () => failure).stale,
          false,
          name,
        );
    }
    for (const output of [
      "",
      "Error: check crashed",
      "EACCES: permission denied",
      "invalid source input",
    ]) {
      const writes = [];
      const row = { name, check: ["check"], write: ["write"] };
      const result = await syncArtifacts(TOOL_ROOT, {
        artifacts: [row],
        run: (command) => {
          if (command === row.check) return { exitCode: 1, output };
          if (command === row.write) writes.push(command);
          return { exitCode: 0, output: "" };
        },
      });
      assert.equal(result.rows.at(-1).action, "refused", `${name}: ${output}`);
      assert.equal(writes.length, 0, name);
    }
  }
  for (const [name, output] of [
    ["publication", "FAIL 1 edition(s) are stale\nFAIL invalid source"],
    [
      "release-surfaces",
      "FAIL release-block: stale\nFAIL component-version: invalid source",
    ],
    [
      "siblings",
      "error: docs/siblings/siblings.json: no sibling declaration, but docs/siblings/README.md exists; restore the declaration or remove the page",
    ],
    ["siblings", "error: docs/evidence/siblings/receipt.json: invalid receipt"],
    // A fault in the kit guide's markers is no stale page: sync never writes
    // over it, and the check names the guide's line instead.
    [
      "operator-commands",
      "FAIL docs/KIT.md:118: a fenced shell block carries no operator-commands marker; mark it with its step (<!-- operator-commands <step> -->) or set it aside (<!-- operator-commands aside -->)",
    ],
  ])
    assert.equal(
      checkArtifact({ name }, TOOL_ROOT, () => ({ exitCode: 1, output })).stale,
      false,
      output,
    );
});

test("sync names the unselected orphan when an evidence writer or recheck fails", async (t) => {
  for (const stage of ["write", "check"]) {
    const { root } = fixture(t);
    runGit(root, ["init", "-q", "-b", "wo-999"]);
    excludeFixtureOwnership(root);
    mkdirSync(join(root, "docs/control/orders"), { recursive: true });
    mkdirSync(join(root, "docs/evidence"), { recursive: true });
    writeFileSync(
      join(root, "docs/control/orders/WO-999.jsonl"),
      JSON.stringify({
        schemaVersion: 1,
        recordedAt: "2026-01-01T00:00:00.000Z",
        type: "WorkOrderActivated",
        workOrderId: "WO-999",
        workOrderPath: "docs/work-orders/WO-999-fixture.md",
        effortDeclarationValidated: true,
      }) + "\n",
    );
    const manifest = JSON.stringify({
      schemaVersion: 1,
      editions: { authority: { workOrder: "WO-998", revision: "001" } },
    });
    writeFileSync(join(root, "docs/evidence/current.json"), manifest);
    const orphan = "docs/evidence/WO-999/authority/001";
    const result = await syncArtifacts(root, {
      artifacts: [
        {
          name: "authority-evidence",
          kind: "authority",
          file: "scripts/fake-evidence.mjs",
          check: ["fake", "check"],
        },
      ],
      run: (command) => {
        if (command[0] === "npm") return { exitCode: 0, output: "" };
        if (command[0] === "fake")
          return {
            exitCode: 1,
            stale: true,
            output: "fixture evidence is stale",
          };
        if (command.includes("--write")) {
          mkdirSync(join(root, orphan), { recursive: true });
          writeFileSync(join(root, orphan, "invalid.json"), "{}\n");
          return {
            exitCode: stage === "write" ? 1 : 0,
            output: "fixture writer",
          };
        }
        return { exitCode: 1, output: "fixture recheck" };
      },
    });
    assert.equal(result.exitCode, 1);
    assert.ok(
      result.rows.some((row) =>
        row.reason?.includes(
          `Unselected orphan evidence revision retained: ${orphan}`,
        ),
      ),
      JSON.stringify(result),
    );
    assert.equal(
      readFileSync(join(root, "docs/evidence/current.json"), "utf8"),
      manifest,
    );
  }
});

test("sync refuses changed feedback judgments and baseline fingerprints without overwriting them", async (t) => {
  const { root, artifacts } = fixture(t);
  writeFileSync(join(root, "format"), "current\n");
  const selected = artifacts
    .filter((row) =>
      ["feedback-evidence", "baseline-fingerprints"].includes(row.name),
    )
    .map(({ write, ...row }) => ({
      ...row,
      ...(row.name === "feedback-evidence" ? { kind: "feedback" } : {}),
      route: "authorized baseline-review route",
    }));
  for (const row of selected)
    writeFileSync(join(root, row.name), "historical\n");
  const result = await syncArtifacts(root, {
    artifacts: selected,
    mint: async () => ({
      exitCode: 1,
      output:
        "Changed judged sources require a live feedback episode; carry refused",
    }),
  });
  assert.equal(result.exitCode, 1);
  assert.deepEqual(
    result.rows.slice(1).map((row) => row.action),
    ["refused", "refused"],
  );
  assert.match(
    result.rows.find((row) => row.artifact === "feedback-evidence").reason,
    /live feedback episode/,
  );
  assert.match(
    result.rows.find((row) => row.artifact === "baseline-fingerprints").reason,
    /baseline-review/,
  );
  for (const row of selected)
    assert.equal(readFileSync(join(root, row.name), "utf8"), "historical\n");
});

test(
  "the real inventory checks stale artifacts, regenerates safe outputs, refuses manual changes and is byte-stable",
  // Three full syncs, the structural check twice and nine single-artifact
  // syncs measured about 290 s alone at the current inventory size. The timer
  // fires only at the case's few asynchronous gaps, so the bound keeps
  // headroom over that measurement instead of depending on where they fall;
  // each artifact command keeps its own deadline (WO-258-D029).
  { timeout: 600_000 },
  async (t) => {
    const { editionCopy } = await import("./lib/evidence-fixture.mjs");
    const { checkArtifact, runArtifactCommand } =
      await import("./lib/generated-artifacts.mjs");
    const { currentEvidence } =
      await import("../packages/skeleton/src/evidence-editions.mjs");
    const { createHash } = await import("node:crypto");
    const { execGit } = await import("./lib/git.mjs");
    const { appendFileSync, existsSync, lstatSync } = await import("node:fs");
    const { copy } = editionCopy(t, { workspace: true });
    const { writeReleaseHistory } = await import("./lib/release-history.mjs");
    // A clone may legitimately retain a table through an older tag. Give
    // these recovery cases a complete table so its boundary can be recovered
    // from the table itself after its observation record is lost.
    writeReleaseHistory(copy);
    const inventory = generatedArtifacts(copy);
    const byName = (name) => inventory.find((row) => row.name === name);
    const bytes = (file) => readFileSync(join(copy, file));
    const put = (file, value) => writeFileSync(join(copy, file), value);
    const checked = (name) => checkArtifact(byName(name), copy);
    // The complete inventory runs validate formatting. Isolated artifact
    // cases exercise their real checkers and writers with controlled damage.
    const syncOne = (name) =>
      syncArtifacts(copy, {
        artifacts: [byName(name)],
        run: (command, ...args) =>
          command[0] === "npm" && command[2] === "format:check"
            ? { exitCode: 0, output: "" }
            : runArtifactCommand(command, ...args),
      });
    const before = await syncArtifacts(copy);
    assert.equal(before.exitCode, 0, JSON.stringify(before.rows));

    // Exercise the actual checkers and writers so a changed diagnostic cannot
    // silently strand their generated pages behind the stale-only refusal.
    for (const [name, file, mutations] of [
      [
        "siblings",
        "docs/siblings/README.md",
        [
          (s) => s + "\nstale fixture\n",
          (s) =>
            s.replace(/(^- \*\*Manifest hash:\*\* ).+$/m, "$1`stale fixture`"),
        ],
      ],
      [
        "siblings",
        "docs/siblings/tag-observations.json",
        [
          () => JSON.stringify({ schemaVersion: 0, commits: {} }) + "\n",
          () => JSON.stringify({ schemaVersion: 1, commits: {} }) + "\n",
          () => null,
        ],
      ],
      // The index's two observation records: a damaged or missing one is
      // stale, and the refresh writes it again.
      ["index", "docs/control/release-history.json", [() => "{\n", () => null]],
      [
        "index",
        "docs/control/workstream-observations.json",
        [() => "{\n", () => null],
      ],
    ]) {
      const expected = bytes(file);
      for (const mutate of mutations) {
        const changed = mutate(expected.toString());
        assert.notEqual(
          changed,
          expected.toString(),
          `fixture damages ${file}`,
        );
        if (changed === null) rmSync(join(copy, file));
        else put(file, changed);
        const repaired = await syncOne(name);
        assert.equal(repaired.exitCode, 0, JSON.stringify(repaired.rows));
        assert.equal(repaired.rows.at(-1).before, "stale");
        assert.equal(repaired.rows.at(-1).after, "current");
        assert.equal(
          repaired.rows.at(-1).action,
          "regenerated",
          JSON.stringify(repaired.rows),
        );
        assert.deepEqual(bytes(file), expected, file);
      }
    }

    const evidence = currentEvidence(copy, "authority");
    const authorityFile = `${evidence.directory}/bundle-diff.json`;
    const damage = [
      // Judge this difference while its harness dependency is still current.
      ["authority-evidence", authorityFile, () => "{}\n"],
      [
        "meta",
        "docs/lineage/decisions-index.md",
        (s) => s + "\nstale fixture\n",
      ],
      ["lineage", "docs/lineage/README.md", (s) => s + "\nstale fixture\n"],
      ["index", "docs/work-orders/README.md", (s) => s + "\nstale fixture\n"],
      [
        "release-surfaces",
        "README.md",
        (s) => s.replace(/v\d+\.\d+\.\d+/u, "v9999.0.0"),
      ],
      // A changed marked block of the kit guide leaves the operator commands
      // page stale until it is regenerated (WO-275 criterion 3).
      [
        "operator-commands",
        "docs/KIT.md",
        (s) =>
          s.replace(
            "git push -u origin main\nnode scripts/bootstrap.mjs\n",
            "git push -u origin main\ngit status\nnode scripts/bootstrap.mjs\n",
          ),
      ],
      [
        "harness",
        ".agents/skills/dotln-executor/SKILL.md",
        (s) => s + "\nstale fixture\n",
      ],
      [
        "publication",
        "docs/publication/software-engineer-toc.md",
        (s) =>
          s.replace(
            /^Source lock:.*$/mu,
            "Source lock: `sha256:" + "0".repeat(64) + "`",
          ),
      ],
    ];
    const originals = new Map();
    for (const [name, file, change] of damage) {
      const original = bytes(file);
      originals.set(file, original);
      const changed = change(original.toString());
      assert.notEqual(
        changed,
        original.toString(),
        `fixture actually damages ${name}`,
      );
      put(file, changed);
      const stale = checked(name);
      assert.equal(stale.exitCode, 1, `${name}: ${stale.output}`);
      assert.equal(stale.stale, true, `${name}: ${stale.output}`);
    }
    const all = checkGenerated(copy);
    for (const [name] of damage) assert.ok(all.stale.includes(name), name);

    const { runGate } = await import("./test-runner.mjs");
    const messages = [];
    const log = console.log;
    let failed;
    console.log = (...values) => messages.push(values.join(" "));
    try {
      failed = await runGate(["--only", "fixture-suite"], copy, {
        table: [
          {
            name: "build",
            build: true,
            command: [
              process.execPath,
              "-e",
              "throw new Error('build must not start')",
            ],
          },
          {
            name: "generated",
            structural: true,
            document: true,
            command: [
              process.execPath,
              "scripts/structural-checks.mjs",
              "generated",
            ],
          },
          {
            name: "fixture-suite",
            product: true,
            command: [
              process.execPath,
              "-e",
              "throw new Error('suite must not start')",
            ],
          },
        ],
      });
    } finally {
      console.log = log;
    }
    assert.equal(failed.exitCode, 1);
    for (const [name] of damage) assert.ok(failed.stale.includes(name), name);
    assert.ok(failed.unrunSuites.includes("fixture-suite"));
    assert.match(messages.join("\n"), /npm run sync/u);

    // A real judged-source edit must use the actual feedback carry refusal.
    const judged = "scripts/lib/host-resources.mjs";
    const originalJudged = bytes(judged);
    appendFileSync(
      join(copy, judged),
      "\n// Changed feedback subject in the isolated fixture.\n",
    );
    const denied = await syncOne("feedback-evidence");
    assert.equal(denied.rows.at(-1).action, "refused");
    assert.match(denied.rows.at(-1).reason, /live feedback episode/u);
    put(judged, originalJudged);

    const baseline = "docs/control/comment-baseline.json";
    const baselineBefore = bytes(baseline);
    put(
      "scripts/fixture-comment.mjs",
      "// WO-999 fixture label without an explanation.\nexport {};\n",
    );
    const refusedBaseline = await syncOne("baseline-fingerprints");
    assert.equal(refusedBaseline.rows.at(-1).action, "refused");
    assert.match(refusedBaseline.rows.at(-1).reason, /baseline-review/u);
    assert.deepEqual(bytes(baseline), baselineBefore);
    rmSync(join(copy, "scripts/fixture-comment.mjs"));

    const regenerated = await syncArtifacts(copy);
    assert.equal(regenerated.exitCode, 0, JSON.stringify(regenerated.rows));
    for (const [name] of damage.filter(([name]) => name !== "index"))
      assert.equal(
        regenerated.rows.find((row) => row.artifact === name).action,
        "regenerated",
        name,
      );
    assert.equal(
      regenerated.rows.find((row) => row.artifact === "index").after,
      "current",
      "meta may refresh the work-order index before its own check",
    );
    assert.equal(checked("publication").exitCode, 0);
    assert.notDeepEqual(
      bytes(authorityFile),
      originals.get(authorityFile),
      "old evidence is never overwritten",
    );
    assert.notEqual(
      currentEvidence(copy, "authority").directory,
      evidence.directory,
    );
    const tree = () => {
      const hash = createHash("sha256");
      const paths = execGit(
        [
          "-C",
          copy,
          "ls-files",
          "-z",
          "--cached",
          "--others",
          "--exclude-standard",
        ],
        { encoding: "utf8" },
      )
        .split("\0")
        .filter(Boolean);
      for (const file of [...new Set(paths)].sort())
        if (
          existsSync(join(copy, file)) &&
          lstatSync(join(copy, file)).isFile()
        )
          hash.update(file + "\0").update(bytes(file));
      return hash.digest("hex");
    };
    const stable = tree();
    const second = await syncArtifacts(copy);
    assert.equal(second.exitCode, 0, JSON.stringify(second.rows));
    assert.ok(
      second.rows.every(
        (row) => row.before === "current" && row.action === "none",
      ),
      JSON.stringify(second.rows),
    );
    assert.equal(tree(), stable);
  },
);
