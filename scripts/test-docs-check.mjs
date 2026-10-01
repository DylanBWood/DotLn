import { write as writeFixture } from "./lib/helpers.mjs";
import { spawnGit } from "./lib/git.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  checkDocs,
  dispatchFingerprint,
  linkFailures,
  markdownLinks,
  productContent,
  validDispatch,
  operatorWordAdvisories,
  operatorWordFindings,
} from "./docs-check.mjs";

test("WO-178 attributed operator words advise by record, with capture and fingerprinted baseline exceptions", (t) => {
  const f = fixture(t);
  f.write(
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — Fixture\n\n**Nomination provenance:** The operator\nsaid “synthetic quoted requirement”.\n",
  );
  const first = operatorWordFindings(f.root);
  assert.equal(first.length, 1);
  assert.equal(first[0].record, "provenance");
  assert.doesNotMatch(JSON.stringify(first), /synthetic quoted requirement/);
  const key = `${first[0].file}#${first[0].record}`;
  f.baseline.operatorWords = { [key]: first[0].fingerprint };
  assert.equal(f.check().operatorWords.current, 0);
  assert.equal(f.check().operatorWords.historical, 1);
  f.write(
    first[0].file,
    "# WO-999 — Fixture\n\n**Nomination provenance:** The operator said “a different quote”.\n",
  );
  assert.equal(f.check().operatorWords.current, 1);
  for (const citation of [
    `SHA-256 ${"a".repeat(64)}`,
    `--capture-hash sha256:${"b".repeat(64)}`,
  ]) {
    f.write(
      first[0].file,
      `# WO-999 — Fixture\n\n**Nomination provenance:** The operator said “synthetic quoted requirement”; ${citation}.\n`,
    );
    assert.equal(operatorWordAdvisories(f.root).current, 0);
  }
  f.record('resume: next; operator said "synthetic dispatch quote"');
  assert.equal(operatorWordAdvisories(f.root).current, 1);
  // A digest in another record does not exempt this dispatch.
  assert.equal(f.check().operatorWords.current, 1);
  assert.deepEqual(f.check().failures, []);
  f.record("resume: next; operator requested the fixture change");
  assert.equal(operatorWordAdvisories(f.root).current, 0);
});

test("WO-178 provenance findings and fingerprints survive grouped header layouts", (t) => {
  const f = fixture(t);
  const file = "docs/work-orders/WO-999-fixture.md";
  for (const label of ["Nomination provenance", "Provenance"]) {
    const field = `**${label}:** The operator\nsaid “synthetic grouped requirement”.`;
    f.write(file, `# WO-999 — Fixture\n\n${field}\n`);
    const standalone = operatorWordFindings(f.root);
    assert.equal(standalone.length, 1);
    for (const [before, after] of [
      ["**Model:** Fixture\n**Effort:** high\n", ""],
      ["**Track:** machinery\n", "\n**Depends on:** no order."],
    ]) {
      f.write(file, `# WO-999 — Fixture\n\n${before}${field}${after}\n`);
      assert.deepEqual(operatorWordFindings(f.root), standalone);
      const key = `${file}#provenance`;
      assert.equal(
        operatorWordAdvisories(f.root, { [key]: standalone[0].fingerprint })
          .current,
        0,
      );
      f.write(
        file,
        `# WO-999 — Fixture\n\n${before}${field.replace("requirement", "change")}${after}\n`,
      );
      assert.equal(
        operatorWordAdvisories(f.root, { [key]: standalone[0].fingerprint })
          .current,
        1,
      );
    }
  }
});

test("WO-178 capture citations and attributed words stay inside their provenance field", (t) => {
  const f = fixture(t);
  const file = "docs/work-orders/WO-999-fixture.md";
  const digest = `SHA-256 ${"c".repeat(64)}`;
  const field =
    "**Provenance:** The operator uses the **category:** “synthetic field requirement”.";
  for (const [before, after] of [
    [`**Model:** Fixture; ${digest}\n`, ""],
    ["**Effort:** high\n", `\n**Cost:** ${digest}.`],
  ]) {
    f.write(file, `# WO-999 — Fixture\n\n${before}${field}${after}\n`);
    assert.equal(operatorWordFindings(f.root).length, 1);
  }
  f.write(
    file,
    `# WO-999 — Fixture\n\n**Model:** Fixture\n${field}\nCapture: ${digest}.\n**Cost:** The operator said “synthetic other-field quote”.\n`,
  );
  assert.equal(operatorWordFindings(f.root).length, 0);
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Effort:** high\n**Provenance:** A synthesized requirement.\n**Cost:** The operator said “synthetic other-field quote”.\n\n```md\n**Provenance:** The operator said “synthetic example”.\n```\n",
  );
  assert.equal(operatorWordFindings(f.root).length, 0);
});

import { suites } from "./test-runner.mjs";
import {
  historyEnd,
  historyStart,
  renderReleaseHistory,
} from "./lib/release-history.mjs";

const script = resolve("scripts/docs-check.mjs");
function fixture(t, roots = {}) {
  const root = mkdtempSync(join(tmpdir(), "dotln-docs-check-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, source) => writeFixture(root, path, source);
  assert.equal(spawnGit(["init", "-q", root]).status, 0);
  write("dotln.config.json", JSON.stringify({ version: 1, roots }));
  const docs = roots.docs ?? "docs",
    product = roots.product ?? `${docs}/product`,
    control = roots.control ?? `${docs}/control`,
    evidence = roots.evidence ?? `${docs}/evidence`;
  const source = "# Product\n\n## Stable\n\nA fact.\n";
  write(`${product}/00-fixture.md`, source);
  const ceilings = {
    schemaVersion: 1,
    documents: {
      "00-fixture.md": {
        ceiling: 10000,
        nonExemptBytesAtLanding: 10000,
        date: "2026-09-26",
        decision: "fixture",
      },
    },
  };
  const baseline = {
    schemaVersion: 1,
    products: {},
    dispatches: {},
    links: [],
  };
  const check = () => checkDocs(root, { ceilings, baseline });
  const record = (dispatch) => {
    const row = {
      id: "WO-999-D001",
      date: "2026-09-26",
      dispatch,
      decision: "A bounded fixture decision",
      evidence: ["fixture"],
      rejected: [],
      reopenWhen: "fixture changes",
    };
    write(
      `${evidence}/WO-999/decisions.md`,
      `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify(row)}\n\`\`\`\n`,
    );
    return { ...row, path: `${evidence}/WO-999/decisions.md` };
  };
  const controls = () => {
    write(`${control}/doc-ceilings.json`, JSON.stringify(ceilings));
    write(`${control}/doc-baseline.json`, JSON.stringify(baseline));
  };
  return {
    root,
    write,
    source,
    product,
    control,
    evidence,
    ceilings,
    baseline,
    check,
    record,
    controls,
  };
}

test("byte ceilings count UTF-8, report exact overage and refuse absent products", (t) => {
  const f = fixture(t);
  f.ceilings.documents["00-fixture.md"].ceiling = Buffer.byteLength(f.source);
  assert.deepEqual(f.check().failures, []);
  f.write(`${f.product}/00-fixture.md`, f.source + "é");
  assert.match(f.check().failures.join("\n"), /2 bytes over ceiling/);
  delete f.ceilings.documents["00-fixture.md"];
  assert.match(f.check().failures.join("\n"), /missing ceiling/);
});

test("receipt and candidate baselines admit only counted labels under their original heading", (t) => {
  const f = fixture(t);
  const additions =
    "\n**Old (2026-09-25):** Existing fact.\n\n### Candidate — old\n\nProposal.\n";
  const original = f.source + additions;
  f.baseline.products["00-fixture.md"] = productContent(
    "00-fixture.md",
    original,
  ).shapes;
  f.write(`${f.product}/00-fixture.md`, original);
  assert.deepEqual(f.check().failures, []);
  f.write(
    `${f.product}/00-fixture.md`,
    original + "\n**New (2026-09-26):** More history.\n\n## Candidate — new\n",
  );
  const failures = f.check().failures.join("\n");
  assert.match(failures, /new receipt; edit the sentence/);
  assert.match(failures, /new candidate; candidates go to the planning map/);
  f.write(
    `${f.product}/00-fixture.md`,
    original.replace(
      "Existing fact.",
      "Existing fact.\n\n**Old (2026-09-25):** Duplicate.",
    ),
  );
  assert.match(f.check().failures.join("\n"), /new receipt/);
  f.write(
    `${f.product}/00-fixture.md`,
    original.replace("## Stable", "## Elsewhere"),
  );
  assert.match(f.check().failures.join("\n"), /new receipt/);
  f.write(
    `${f.product}/00-fixture.md`,
    f.source + "\n**Change (operator direction):** More.\n",
  );
  assert.match(f.check().failures.join("\n"), /new receipt/);
});

test("the Release boundary heading exempts nothing; only the registered release-history block does", (t) => {
  const f = fixture(t);
  const file = "06-roadmap.md";
  const block = renderReleaseHistory(f.root, []);
  const source = `# Roadmap\n\n## Release boundary\n\nPointer.\n\n${block}\n\n## Future\n\nFact.\n`;
  const measured = productContent(file, source);
  assert.equal(measured.exemptBytes, Buffer.byteLength(block));
  assert.equal(
    measured.bytes,
    Buffer.byteLength(source) - Buffer.byteLength(block),
  );
  assert.deepEqual(measured.failures, []);
  f.ceilings.documents[file] = {
    ceiling: measured.bytes,
    nonExemptBytesAtLanding: measured.bytes,
    date: "2026-09-29",
    decision: "fixture",
  };
  f.write(`${f.product}/${file}`, source);
  assert.deepEqual(f.check().failures, []);
  // A dated note under the heading is counted and reported as anywhere else.
  f.write(
    `${f.product}/${file}`,
    source.replace(
      "Pointer.",
      "**WO-999 activation completion (2026-09-26):** " + "é".repeat(1000),
    ),
  );
  const failures = f.check().failures.join("\n");
  assert.match(failures, /06-roadmap\.md#release-boundary: new receipt/);
  assert.match(failures, /06-roadmap\.md: 2\d{3} bytes over ceiling/);
  // The registration names one product path: elsewhere the pair exempts nothing.
  for (const other of ["07-guide.md", "archive/06-roadmap.md"]) {
    const elsewhere = productContent(other, source);
    assert.equal(elsewhere.exemptBytes, 0, other);
    assert.equal(elsewhere.bytes, Buffer.byteLength(source), other);
  }
});

test("code fences hide receipt, candidate and link examples; generated links still resolve", (t) => {
  const f = fixture(t);
  const examples =
    "\n````markdown\n```\n## Candidate — example\n**Example (2026-09-26):** [bad](missing.md)\n````\n";
  f.write(
    `${f.product}/00-fixture.md`,
    f.source + examples + "\n`[bad](missing.md)`\n<!-- [bad](missing.md) -->\n",
  );
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/generated.md",
    "<!-- index:start -->\n[bad](missing.md)\n<!-- index:end -->\n",
  );
  assert.match(f.check().failures.join("\n"), /missing file: missing.md/);
});

test("handwritten and generated full decision anchors pass; short-form anchors and missing files fail", (t) => {
  const f = fixture(t);
  f.write("docs/target.md", "# Decisions\n\n## WO-999-D001 — a title\n");
  f.write("docs/index.md", "[decision](target.md#wo-999-d001--a-title)\n");
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/index.md",
    "[decision](target.md#wo-999-d001)\n[missing](absent.md)\n",
  );
  const failures = f.check().failures.join("\n");
  assert.match(failures, /missing anchor/);
  assert.match(failures, /missing file/);
});

test("references, balanced destinations, duplicate headings, HTML anchors and line URLs", (t) => {
  const f = fixture(t);
  f.write(
    "docs/target_(one).md",
    '# `resume_state`\n\n## Echo\n\n## Echo\n\n## Echo-1\n\n<a id="C1"></a>\n',
  );
  f.write(
    "docs/index.md",
    "[nested [label]](target_(one).md#resume_state)\n[full][ref]\n[ref][]\n[ref]\n[ref]: target_(one).md#echo-1-1\n[html](target_(one).md#C1)\n[line](target_(one).md?plain=1#L1-L3)\n",
  );
  f.write(
    "docs/final-reviews/WO-999/PR.md",
    "[relative](../../target_(one).md#echo-1)\n",
  );
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/index.md",
    "[bad line](target_(one).md?plain=1#L999)\n[bad encoding](target%ZZ.md)\n",
  );
  assert.equal(linkFailures(f.root).length, 2);
});

test("historical link exceptions are source/destination/count specific", (t) => {
  const f = fixture(t);
  f.write("docs/old.md", "[old](product/00-fixture.md#gone)\n");
  f.baseline.links = [
    {
      file: "docs/old.md",
      href: "product/00-fixture.md#gone",
      reason: "missing anchor",
      count: 1,
    },
  ];
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/old.md",
    "[old](product/00-fixture.md#gone)\n[duplicate](product/00-fixture.md#gone)\n",
  );
  assert.equal(f.check().failures.length, 1);
  f.write("docs/new.md", "[copied](product/00-fixture.md#gone)\n");
  assert.equal(f.check().failures.length, 2);
});

test("dispatch fingerprints exempt only existing bytes, and new dispatches obey prefix and length", (t) => {
  const f = fixture(t);
  const old = f.record("historical wording");
  assert.match(
    f.check().failures.join("\n"),
    /dispatch needs a control prefix/,
  );
  f.baseline.dispatches[`${old.path}#${old.id}`] = dispatchFingerprint(old);
  assert.deepEqual(f.check().failures, []);
  f.record("different unprefixed wording");
  assert.match(f.check().failures.join("\n"), /dispatch needs/);
  f.record("resume: next; record the bounded choice");
  assert.deepEqual(f.check().failures, []);
  for (const prefix of [
    "planning",
    "ideation",
    "resume",
    "scope expand",
    "conversation only",
    "analysis",
    "operator override",
  ])
    assert.equal(validDispatch(`${prefix}: ${"a".repeat(240)}`), true);
  assert.equal(validDispatch("resume: " + "a".repeat(241)), false);
  assert.equal(validDispatch("resume:\nquoted block"), false);
  assert.equal(validDispatch("resume: next\u2028more"), false);
  assert.equal(validDispatch("resume: next\u2029more"), false);
  assert.equal(validDispatch("resume:"), false);
});

test("configuration roots and nonignored new documents are used; private and package fixtures are excluded", (t) => {
  const f = fixture(t, {
    docs: "handbook",
    product: "blueprint",
    control: "state",
    evidence: "records",
  });
  f.write(".gitignore", "private.md\n");
  f.write("private.md", "[bad](absent.md)\n");
  f.write("packages/demo/README.md", "[bad](absent.md)\n");
  f.write("handbook/intake/private.md", "[bad](absent.md)\n");
  f.write("state/local/private.md", "[bad](absent.md)\n");
  f.record("resume: next");
  assert.deepEqual(f.check().failures, []);
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: tmpdir(),
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 0, cli.stdout + cli.stderr);
  assert.match(cli.stdout, /blueprint\/00-fixture.md/);
  assert.match(cli.stdout, /Exempt bytes/);
  f.write("handbook/new.md", "[bad](absent.md)\n");
  const failed = spawnSync(process.execPath, [script], {
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /missing file/);
});

test("document check and fixtures run only in the document selection", () => {
  for (const name of ["docs-check", "docs-check-fixtures"]) {
    const row = suites.find((entry) => entry.name === name);
    assert.equal(row.document, true);
    assert.equal(row.product, false);
    assert.equal(row.machinery, false);
  }
});

test("link extraction ignores remote navigation and escaped examples through resolution", () => {
  assert.deepEqual(
    markdownLinks(
      '\\[example](absent.md)\n`[code](absent.md)`\n[valid](target.md "title")',
    ),
    [{ href: "target.md", line: 3 }],
  );
});

test("render-equivalent indented receipts and live links around escaped backticks stay checked", (t) => {
  const f = fixture(t);
  for (const indent of [" ", "  ", "   "]) {
    f.write(
      `${f.product}/00-fixture.md`,
      f.source + `\n${indent}**New (2026-09-26):** Addition.\n`,
    );
    assert.match(f.check().failures.join("\n"), /new receipt/);
  }
  const source =
    "\\` [broken](missing.md) \\`\n[ref-link][ref]\n\n[ref]:\n  missing-ref.md\n[angle](<missing(.md>)\n";
  assert.deepEqual(
    markdownLinks(source).map((row) => row.href),
    ["missing.md", "missing-ref.md", "missing(.md"],
  );
  f.write("docs/index.md", source);
  assert.equal(linkFailures(f.root).length, 3);
});

test("only real HTML anchors resolve, setext headings resolve, and indented examples are not links", (t) => {
  const f = fixture(t);
  f.write(
    "docs/target.md",
    'Real heading\n============\n\nMultiline\nheading\n---\n\n`<a id="phantom"></a>`\n\n<a data-id="also-phantom"></a>\n\n<a id=real></a>\n',
  );
  f.write(
    "docs/index.md",
    "[setext](target.md#real-heading)\n[multiline](target.md#multiline-heading)\n[html](target.md#real)\n\n    [example](absent.md)\n\n[phantom](target.md#phantom)\n[not-id](target.md#also-phantom)\n",
  );
  const failures = linkFailures(f.root);
  assert.deepEqual(
    failures.map((row) => row.href),
    ["target.md#phantom", "target.md#also-phantom"],
  );
});

test("historical exception counts cannot become fractional or unlimited", (t) => {
  const f = fixture(t);
  for (const count of [0, -1, 1.1, Infinity, "2"]) {
    f.baseline.links = [
      {
        file: "docs/old.md",
        href: "missing.md",
        reason: "missing file",
        count,
      },
    ];
    assert.throws(f.check, /positive safe-integer count/);
  }
});

test("list continuation indentation preserves live links and hides only actual list code", (t) => {
  const f = fixture(t);
  f.write(
    "docs/list.md",
    "- Item\n\n    [nested](missing-one.md)\n\n- Item\n    [continued](missing-two.md)\n\n1. Ordered\n\n    [continued](missing-three.md)\n\n- Item\n\n      [code](not-a-link.md)\n",
  );
  assert.deepEqual(
    linkFailures(f.root).map((row) => row.href),
    ["missing-one.md", "missing-two.md", "missing-three.md"],
  );
});

test("a ceiling increase requires an existing planning decision, including after a prior consolidation", (t) => {
  const f = fixture(t);
  const entry = f.ceilings.documents["00-fixture.md"];
  entry.ceiling = 100;
  f.controls();
  assert.equal(spawnGit(["-C", f.root, "add", "."]).status, 0);
  assert.equal(
    spawnGit([
      "-C",
      f.root,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-qm",
      "fixture controls",
    ]).status,
    0,
  );
  entry.ceiling = 101;
  assert.match(f.check().failures.join("\n"), /raising a ceiling requires/);
  entry.decision = "docs/planning/approved.md#ceiling-change";
  assert.match(f.check().failures.join("\n"), /raising a ceiling requires/);
  f.write(
    "docs/planning/approved.md",
    "# Plan\n\n## Ceiling change\n\nA fixture decision.\n",
  );
  assert.deepEqual(f.check().failures, []);
});

test("Markdown titles, nested brackets and decoded entities retain live destinations", (t) => {
  const f = fixture(t);
  f.write("docs/target&one.md", "# Fish &amp; Chips\n");
  f.write(
    "docs/index.md",
    "[broken](missing.md (a title))\nAn aside [see [broken](nested.md)].\n[entity](target&amp;one.md#fish--chips)\n",
  );
  assert.deepEqual(
    linkFailures(f.root).map((row) => row.href),
    ["missing.md", "nested.md"],
  );
});

test("list and quoted fences hide examples without hiding later links or nested headings", (t) => {
  const f = fixture(t);
  f.write(
    "docs/target.md",
    "> ## Quoted heading\n\n- ### List heading\n\n## Quoted heading\n",
  );
  f.write(
    "docs/index.md",
    "- ```md\n  [example](not-a-link.md)\n  ```\n\n[live](missing.md)\n\n> ~~~md\n> [example](also-not-a-link.md)\n> ~~~\n\n[quote](target.md#quoted-heading)\n[list](target.md#list-heading)\n[duplicate](target.md#quoted-heading-1)\n",
  );
  assert.deepEqual(
    linkFailures(f.root).map((row) => row.href),
    ["missing.md"],
  );
});

test("a demoted, quoted or hidden terminating heading exempts nothing after the registered block", (t) => {
  const f = fixture(t);
  const file = "06-roadmap.md";
  const block = renderReleaseHistory(f.root, []);
  for (const terminator of [
    "### Future",
    "> ## Future",
    "<!--\n## Future\n-->",
  ]) {
    const source = `# Roadmap\n\n## Release boundary\n\n${block}\n\n${terminator}\n\n**New (2026-09-27):** Receipt.\n\n## Candidate — smuggled\n\n${"é".repeat(3000)}\n`;
    const measured = productContent(file, source);
    assert.equal(measured.exemptBytes, Buffer.byteLength(block), terminator);
    assert.equal(
      measured.bytes,
      Buffer.byteLength(source) - Buffer.byteLength(block),
      terminator,
    );
    f.ceilings.documents[file] = {
      ceiling: measured.bytes - 6001,
      nonExemptBytesAtLanding: measured.bytes - 6001,
      date: "2026-09-29",
      decision: "fixture",
    };
    f.write(`${f.product}/${file}`, source);
    const failures = f.check().failures.join("\n");
    assert.match(failures, /: new receipt/, terminator);
    assert.match(failures, /#candidate--smuggled: new candidate/, terminator);
    assert.match(
      failures,
      /06-roadmap\.md: 6001 bytes over ceiling/,
      terminator,
    );
  }
});

test("registered markers exempt only as one ordered pair of exact top-level lines", () => {
  const block = `${historyStart}\n\n**Old (2026-09-27):** inside\n\n${historyEnd}`;
  const receipt = "**New (2026-09-27):** Receipt.";
  for (const [label, source] of [
    ["two pairs", `# Roadmap\n\n${block}\n\n${block}\n`],
    [
      "end before start",
      `# Roadmap\n\n${historyEnd}\n\n${receipt}\n\n${historyStart}\n`,
    ],
    [
      "indented pair",
      `# Roadmap\n\n    ${historyStart}\n    ${receipt}\n    ${historyEnd}\n`,
    ],
    [
      "fenced marker beside a real pair",
      `# Roadmap\n\n\`\`\`\n${historyStart}\n\`\`\`\n\n${block}\n`,
    ],
    [
      "a lookalike start",
      `# Roadmap\n\n${historyStart} trailing\n\n${receipt}\n\n${historyEnd}\n`,
    ],
  ]) {
    const measured = productContent("06-roadmap.md", source);
    assert.equal(measured.exemptBytes, 0, label);
    assert.equal(measured.bytes, Buffer.byteLength(source), label);
    assert.match(
      measured.failures.join("\n"),
      /the registered dotln-release-history block needs exactly one ordered pair of top-level marker lines/,
      label,
    );
  }
});

test("a quoted registered pair is an example: it exempts nothing and registers nothing", () => {
  const source = `# Roadmap\n\n> ${historyStart}\n>\n> **New (2026-09-27):** Receipt.\n>\n> ${historyEnd}\n`;
  const measured = productContent("06-roadmap.md", source);
  assert.equal(measured.exemptBytes, 0);
  assert.equal(measured.bytes, Buffer.byteLength(source));
  assert.deepEqual(measured.failures, []);
  assert.equal(measured.shapes.length, 1);
});

test("marker examples in code, quotes and larger comments never exempt bytes", () => {
  for (const source of [
    "# Product\n\n    <!-- generated:start -->\n    Example\n    <!-- generated:end -->\n",
    "# Product\n\n> <!-- generated:start -->\n> Example\n> <!-- generated:end -->\n",
    "# Product\n\n<!-- generated:start --> is an example\nExample\n<!-- generated:end --> is an example\n",
  ]) {
    const measured = productContent("00-fixture.md", source);
    assert.equal(measured.bytes, Buffer.byteLength(source));
    assert.equal(measured.exemptBytes, 0);
    assert.deepEqual(measured.failures, []);
  }
});

test("rendered list and quote paragraphs and candidate headings remain checked", () => {
  const source =
    "# Product\n\n- **Change (operator direction):** receipt\n\n> **Change (2026-09-26):** receipt\n\n> ## Candidate — quote\n\n- ### Candidate — list\n";
  const shapes = productContent("00-fixture.md", source).shapes;
  assert.equal(shapes.filter((row) => row.kind === "receipt").length, 2);
  assert.equal(shapes.filter((row) => row.kind === "candidate").length, 2);
});

test("handwritten marker pairs cannot bypass bytes, receipts or candidates", (t) => {
  const f = fixture(t);
  f.ceilings.documents["00-fixture.md"].ceiling = Buffer.byteLength(f.source);
  const additions =
    "\n<!-- notes:start -->\n\n**New (2026-09-27):** Receipt.\n\n## Candidate — smuggled\n\n" +
    "é".repeat(3000) +
    "\n<!-- notes:end -->\n";
  f.write(`${f.product}/00-fixture.md`, f.source + additions);
  const result = f.check();
  assert.equal(result.rows[0].exemptBytes, 0);
  assert.equal(result.rows[0].bytes, Buffer.byteLength(f.source + additions));
  assert.match(result.failures.join("\n"), /bytes over ceiling/);
  assert.match(result.failures.join("\n"), /new receipt/);
  assert.match(result.failures.join("\n"), /new candidate/);
});

test("leading BOMs preserve shape detection and count their UTF-8 bytes", (t) => {
  const f = fixture(t);
  const source =
    f.source + "\n**New (2026-09-27):** Receipt.\n\n## Candidate — new\n";
  const plain = productContent("00-fixture.md", source);
  const roadmap = `# Roadmap\n\n## Release boundary\n\n${historyStart}\n\n**Old (2026-09-27):** exempt\n\n${historyEnd}\n\n## Future\n\n**New (2026-09-27):** counted\n`;
  const before = productContent("06-roadmap.md", roadmap);
  for (const count of [1, 2, 3]) {
    const prefix = "\uFEFF".repeat(count);
    const marked = productContent("00-fixture.md", prefix + source);
    assert.deepEqual(marked.shapes, plain.shapes);
    assert.equal(marked.shapes.length, 2);
    assert.equal(marked.bytes, plain.bytes + 3 * count);
    f.write(`${f.product}/00-fixture.md`, prefix + source);
    assert.match(f.check().failures.join("\n"), /new receipt/);
    assert.match(f.check().failures.join("\n"), /new candidate/);
    const after = productContent("06-roadmap.md", prefix + roadmap);
    assert.equal(after.exemptBytes, before.exemptBytes);
    assert.equal(after.bytes, before.bytes + 3 * count);
    assert.deepEqual(after.shapes, before.shapes);
    assert.equal(after.shapes.length, 1);
  }
});

test("stored PR links use file-relative navigation and counted historical exceptions", (t) => {
  const f = fixture(t);
  const file = "docs/final-reviews/WO-998/PR.md";
  const href = "docs/product/00-fixture.md#stable";
  f.write(file, `[old](${href})\n`);
  assert.match(f.check().failures.join("\n"), /missing file/);
  f.baseline.links.push({ file, href, reason: "missing file", count: 1 });
  assert.deepEqual(f.check().failures, []);
  f.write(file, `[old](${href})\n[duplicate](${href})\n`);
  assert.equal(f.check().failures.length, 1);
  f.write(file, "[relative](../../product/00-fixture.md#stable)\n");
  assert.deepEqual(f.check().failures, []);
  f.write("docs/final-reviews/WO-999/PR.md", `[new](${href})\n`);
  assert.equal(f.check().failures.length, 1);
});

test("an unregistered marker pair in the roadmap reports the receipt, the candidate and the bytes inside", (t) => {
  const f = fixture(t);
  const file = "06-roadmap.md";
  const base = "# Roadmap\n\n## Release boundary\n\nPointer.\n";
  const source =
    base +
    "\n<!-- release-notes:start -->\n\n**New (2026-09-27):** Receipt.\n\n## Candidate — smuggled\n\n" +
    "é".repeat(3000) +
    "\n<!-- release-notes:end -->\n";
  f.ceilings.documents[file] = {
    ceiling: Buffer.byteLength(base),
    nonExemptBytesAtLanding: Buffer.byteLength(base),
    date: "2026-09-29",
    decision: "fixture",
  };
  f.write(`${f.product}/${file}`, source);
  const result = f.check();
  const row = result.rows.find((entry) => entry.document.endsWith(file));
  assert.equal(row.exemptBytes, 0);
  assert.equal(row.bytes, Buffer.byteLength(source));
  const failures = result.failures.join("\n");
  assert.match(
    failures,
    new RegExp(
      `06-roadmap\\.md: ${Buffer.byteLength(source) - Buffer.byteLength(base)} bytes over ceiling`,
    ),
  );
  assert.match(failures, /06-roadmap\.md#release-boundary: new receipt/);
  assert.match(failures, /06-roadmap\.md#candidate--smuggled: new candidate/);
});

// WO-086: annotated DotLn tags whose manifests name their orders, one of which
// has a heading with no version, beside a lightweight and an unrelated tag.
function taggedFixture(t) {
  const f = fixture(t);
  const git = (args, env = {}) => {
    const result = spawnGit(
      [
        "-C",
        f.root,
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      { encoding: "utf8", env: { ...process.env, ...env } },
    );
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  const tag = (name, manifest, date, extra = "") =>
    git(
      [
        "tag",
        "-a",
        name,
        "-m",
        `DotLn ${name}${extra}\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest)}\nDOTLN-MANIFEST-END`,
      ],
      { GIT_COMMITTER_DATE: date },
    );
  const manifest = (
    application,
    previousRelease,
    id,
    components,
    changed = [],
  ) => ({
    release: { application, previousRelease },
    workOrder: { id, path: `docs/work-orders/${id}-${slugs[id]}.md` },
    versions: { components },
    notes: { changedFiles: changed },
  });
  const slugs = {
    "WO-900": "origin",
    "WO-901": "alpha",
    "WO-902": "beta",
    "WO-903": "gamma",
    "WO-904": "delta",
  };
  for (const [id, heading] of [
    ["WO-900", "# WO-900 — Origin: the historical release (v0.2.0)"],
    ["WO-901", "# WO-901 — Alpha: the first order (v1.0.0)"],
    ["WO-902", "# WO-902 — Beta order"],
    ["WO-903", "# WO-903 — Gamma: two orders, one tag (v1.1.0)"],
    // Display text that names the marker is neither a marker nor a lookalike.
    [
      "WO-904",
      "# WO-904 — Delta | pipes & <angles> and the `dotln-release-history:end` marker (v1.1.0)",
    ],
  ])
    f.write(
      `docs/work-orders/${id}-${slugs[id]}.md`,
      `${heading}\n\n**Objective:** Fixture.\n`,
    );
  const roadmap = `${f.product}/06-roadmap.md`;
  f.write(
    roadmap,
    `# Roadmap\n\n## Release boundary\n\n${historyStart}\n${historyEnd}\n`,
  );
  f.ceilings.documents["06-roadmap.md"] = {
    ceiling: 100000,
    nonExemptBytesAtLanding: 100000,
    date: "2026-09-29",
    decision: "fixture",
  };
  const release = (name, entry, date) => {
    f.write(`release-${name}.txt`, `${name}\n`);
    git(["add", "-A"]);
    git(["commit", "-qm", name], {
      GIT_COMMITTER_DATE: date,
      GIT_AUTHOR_DATE: date,
    });
    tag(name, entry, date);
  };
  // The manifest-free first edition joins through its reviewed record, which
  // also holds its component versions.
  f.write(
    "docs/releases/v0.2.0.md",
    "# Historical v0.2.0 record for WO-900\n\n| Field | Value |\n| --- | --- |\n| Component: `@dotln/kernel` | `0.1.0` |\n| Component: `@dotln/skeleton` | `0.2.0` |\n",
  );
  f.write("release-v0.2.0.txt", "v0.2.0\n");
  git(["add", "-A"]);
  git(["commit", "-qm", "v0.2.0"], {
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
    GIT_AUTHOR_DATE: "2026-01-01T00:00:00Z",
  });
  git(["tag", "-a", "v0.2.0", "-m", "DotLn v0.2.0 — fixture baseline"], {
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
  });
  release(
    "v1.0.0",
    manifest("v1.0.0", "v0.2.0", "WO-901", { "@dotln/kernel": "1.0.0" }),
    "2026-01-02T00:00:00Z",
  );
  release(
    "v1.0.1",
    manifest("v1.0.1", "v1.0.0", "WO-902", {
      "@dotln/skeleton": "2.0.0",
      "@dotln/kernel": "1.0.1",
    }),
    "2026-01-03T00:00:00Z",
  );
  // 23:30 at -04:00 is the next UTC day.
  release(
    "v1.1.0",
    manifest("v1.1.0", "v1.0.1", "WO-903", { "@dotln/kernel": "1.1.0" }, [
      "docs/final-reviews/WO-904/FINAL-001.md",
    ]),
    "2026-01-04T23:30:00-04:00",
  );
  git(["tag", "v9.0.0"]); // Lightweight, never a release.
  git(["tag", "-a", "v8.0.0", "-m", "Unrelated annotated tag"]);
  const cli = (...args) => {
    const result = spawnSync(
      process.execPath,
      [resolve("scripts/release.mjs"), ...args],
      {
        cwd: f.root,
        encoding: "utf8",
        env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  return { ...f, git, tag, manifest, release, cli, roadmap };
}

test("release list --markdown joins each recorded tag to the orders its manifest names, as release list does", (t) => {
  const f = taggedFixture(t);
  const markdown = f.cli("list", "--markdown");
  const rows = markdown.split("\n").filter((line) => line.startsWith("| `v"));
  assert.deepEqual(rows, [
    "| `v1.1.0` | 2026-01-05 | [WO-903](../work-orders/WO-903-gamma.md) Gamma; [WO-904](../work-orders/WO-904-delta.md) Delta &#124; pipes &amp; &lt;angles&gt; and the &#96;dotln-release-history:end&#96; marker | minor | kernel 1.1.0 |",
    "| `v1.0.1` | 2026-01-03 | [WO-902](../work-orders/WO-902-beta.md) Beta order | patch | kernel 1.0.1, skeleton 2.0.0 |",
    "| `v1.0.0` | 2026-01-02 | [WO-901](../work-orders/WO-901-alpha.md) Alpha | major | kernel 1.0.0 |",
    "| `v0.2.0` | 2026-01-01 | [WO-900](../work-orders/WO-900-origin.md) Origin | initial | kernel 0.1.0, skeleton 0.2.0 |",
  ]);
  // The same tags, applications and orders as the plain listing, newest first.
  const listed = f
    .cli("list")
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.split("\t"))
    .map(([tag, , application, orders]) => ({
      tag,
      application,
      orders: orders.split(",").sort(),
    }))
    .reverse();
  assert.deepEqual(
    rows.map((row) => {
      const tag = /^\| `(v[^`]+)`/.exec(row)[1];
      return {
        tag,
        application: tag,
        orders: [...row.matchAll(/\[(WO-\d{3})\]/g)].map(([, id]) => id).sort(),
      };
    }),
    listed,
  );
  assert.match(
    markdown,
    /<!-- dotln-release-tags: \[\{"name":"v0\.2\.0","object":"[0-9a-f]{40}"\},\{"name":"v1\.0\.0",/,
  );
});

test("the docs check holds the table to its recorded tags: it refuses a changed row, reports a newer tag and names a missing one", (t) => {
  const f = taggedFixture(t);
  assert.equal(
    f.cli("list", "--markdown", "--write"),
    "Wrote docs/product/06-roadmap.md: release history of 4 local annotated release tags.\n",
  );
  let result = f.check();
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.notices, []);
  const committed = readFileSync(`${f.root}/${f.roadmap}`, "utf8");
  // A sibling's newer tag reports and never refuses.
  f.release(
    "v1.1.1",
    f.manifest("v1.1.1", "v1.1.0", "WO-902", { "@dotln/kernel": "1.1.1" }),
    "2026-01-06T00:00:00Z",
  );
  result = f.check();
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.notices, [
    "NEWER local release tags not in docs/product/06-roadmap.md: v1.1.1; the table stays valid for its recorded tags; run npm run release -- list --markdown --write to add them",
  ]);
  // A row that is not its recorded tag's row refuses at its line; so does a
  // hand-written receipt inside the exempt block.
  const lines = committed.split("\n");
  for (const edited of [
    committed.replace("| minor |", "| patch |"),
    committed.replace(
      "| Version |",
      "**WO-999 activation completion (2026-09-29):** smuggled.\n\n| Version |",
    ),
  ]) {
    f.write(f.roadmap, edited);
    const line =
      edited.split("\n").findIndex((text, index) => text !== lines[index]) + 1;
    assert.deepEqual(f.check().failures, [
      `docs/product/06-roadmap.md:${line}: generated release history differs from the rows of its recorded tags; run npm run release -- list --markdown --write`,
    ]);
  }
  f.write(f.roadmap, committed);
  assert.deepEqual(f.check().failures, []);
  // A recorded tag this checkout lacks, or holds with other bytes, is named.
  f.git(["tag", "-d", "v1.0.1"]);
  assert.deepEqual(f.check().failures, [
    "missing or changed recorded release tag: v1.0.1",
  ]);
  f.tag(
    "v1.0.1",
    f.manifest("v1.0.1", "v1.0.0", "WO-902", { "@dotln/kernel": "1.0.1" }),
    "2026-01-03T00:00:00Z",
    " — re-made",
  );
  assert.deepEqual(f.check().failures, [
    "missing or changed recorded release tag: v1.0.1",
  ]);
  // Regeneration records the tags as they are now.
  f.cli("list", "--markdown", "--write");
  result = f.check();
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.notices, []);
});
