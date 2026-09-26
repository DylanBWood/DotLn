import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  checkDocs,
  dispatchFingerprint,
  linkFailures,
  markdownLinks,
  productContent,
  validDispatch,
} from "./docs-check.mjs";
import { suites } from "./test-runner.mjs";

const script = resolve("scripts/docs-check.mjs");
function fixture(t, roots = {}) {
  const root = mkdtempSync(join(tmpdir(), "dotln-docs-check-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, source) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), source);
  };
  assert.equal(spawnSync("git", ["init", "-q", root]).status, 0);
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

test("roadmap activation is a section exemption, not a whole-document exemption", (t) => {
  const f = fixture(t);
  const source =
    "# Roadmap\n\n## Release boundary\n\nOld notes.\n\n## Future\n\nFact.\n";
  const file = "06-roadmap.md";
  f.ceilings.documents[file] = {
    ceiling: productContent(file, source).bytes,
    nonExemptBytesAtLanding: productContent(file, source).bytes,
    date: "2026-09-26",
    decision: "fixture",
  };
  f.write(
    `${f.product}/${file}`,
    source.replace(
      "Old notes.",
      "**WO-999 activation completion (2026-09-26):** " + "é".repeat(1000),
    ),
  );
  assert.deepEqual(f.check().failures, []);
  assert.ok(
    f.check().rows.find((row) => row.document.endsWith(file)).exemptBytes >
      2000,
  );
  f.write(
    `${f.product}/${file}`,
    source + "\n**Outside (2026-09-26):** Must fail.\n",
  );
  assert.match(f.check().failures.join("\n"), /new receipt/);
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
  assert.equal(spawnSync("git", ["-C", f.root, "add", "."]).status, 0);
  assert.equal(
    spawnSync("git", [
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

test("only a visible canonical release boundary creates or terminates the roadmap exemption", () => {
  const fake =
    "# Roadmap\n\n<!--\n## Release boundary\n-->\n\n**New (2026-09-26):** counted\n";
  const measured = productContent("06-roadmap.md", fake);
  assert.equal(measured.bytes, Buffer.byteLength(fake));
  assert.equal(measured.shapes.length, 1);
  const outside = "# Roadmap\n\n## Future\n\nFact.\n";
  const boundary =
    "## Release boundary\n\n<!--\n## Hidden end\n-->\n\n> ## Quoted end\n\n**Activation (2026-09-26):** exempt\n\n";
  const real = outside.replace("## Future", boundary + "## Future");
  assert.equal(
    productContent("06-roadmap.md", real).bytes,
    Buffer.byteLength(outside),
  );
  assert.deepEqual(productContent("06-roadmap.md", real).shapes, []);
  assert.equal(
    productContent("archive/06-roadmap.md", real).bytes,
    Buffer.byteLength(real),
  );
  assert.equal(productContent("archive/06-roadmap.md", real).shapes.length, 1);
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
  const roadmap =
    "# Roadmap\n\n## Release boundary\n\n**Old (2026-09-27):** exempt\n\n## Future\n\n**New (2026-09-27):** counted\n";
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
