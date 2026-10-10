import { write as writeFixture } from "./lib/helpers.mjs";
import { spawnGit } from "./lib/git.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { frontPageDeclaration } from "./lib/front-page-scope.mjs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { format } from "prettier";
import {
  disposeFollowup,
  planningFollowups,
  syncFollowups,
} from "./lib/planning-followups.mjs";
import {
  checkDocs,
  dispatchFingerprint,
  linkFailures,
  markdownLinks,
  productContent,
  validDispatch,
  operatorWordAdvisories,
  operatorWordFindings,
  homePathFindings,
  frontPageFindings,
  frontPageShapeFindings,
  proseText,
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

import { runGate, suites } from "./test-runner.mjs";
import {
  historyEnd,
  historyStart,
  markerLine,
  renderReleaseHistory,
} from "./lib/release-history.mjs";

test("WO-190 the roadmap leads with the work ahead: the index is the list of orders, pending rungs precede the closed ones, no pending rung heading names an order, and the generated release history is last", async (t) => {
  const repoRoot = resolve(".");
  const document = "docs/product/06-roadmap.md";
  const text = readFileSync(join(repoRoot, document), "utf8");
  const lines = text.split("\n");
  assert.ok(!lines.some((line) => line.startsWith("```")), "no fences");
  const at = (matches) =>
    lines.flatMap((line, index) => (matches(line) ? [{ line, index }] : []));
  const headings = at((line) => /^#{1,3} /.test(line));
  const rungs = at((line) => /^## /.test(line));
  assert.ok(rungs.length > 3);
  const intro = lines.slice(0, rungs[0].index).join("\n");
  assert.match(intro, /\]\(\.\.\/work-orders\/README\.md\)/);
  assert.match(intro, /listed once, in the order they are planned to\s+run/);
  // Durable invariants on the live document.
  assert.match(rungs[0].line, /^## Application version pending — /);
  const pending = rungs.filter((row) =>
    /^## Application version pending — /.test(row.line),
  );
  const released = rungs.filter((row) => /^## v0\.\d+\.\d+ /.test(row.line));
  assert.ok(pending.length >= 1 && released.length >= 1);
  const firstReleased = Math.min(...released.map((row) => row.index));
  assert.ok(
    Math.max(...pending.map((row) => row.index)) < firstReleased,
    "a released rung precedes a pending one",
  );
  const ahead = rungs.find((row) => row.line.startsWith("## v1.0.0 "));
  assert.ok(
    ahead && ahead.index < firstReleased,
    "v1.0.0 precedes the closed rungs",
  );
  // No pending heading names an order as its carrier, so none names an
  // umbrella record: the index is the one list of orders.
  for (const { line } of pending)
    assert.doesNotMatch(
      line,
      /WO-\d{3}/,
      `${line} names an order as its carrier`,
    );
  const markers = at(markerLine);
  assert.deepEqual(
    markers.map((row) => row.line),
    [historyStart, historyEnd],
  );
  assert.equal(rungs.at(-1).line, "## Release boundary");
  assert.ok(
    markers[0].index > rungs.at(-1).index,
    "the block lies in the last section",
  );
  assert.equal(
    lines
      .slice(markers[1].index + 1)
      .join("")
      .trim(),
    "",
    "nothing follows the end marker",
  );
  // The exact order and the unchanged rung bodies, judged while the document
  // (its generated block masked) is the one this order landed; a later
  // planning edit retires these two checks as a visible skip, not a pass.
  const record = JSON.parse(
    readFileSync(
      join(repoRoot, "docs/evidence/WO-190/roadmap-order.json"),
      "utf8",
    ),
  );
  const masked = [
    ...lines.slice(0, markers[0].index),
    historyStart,
    historyEnd,
    ...lines.slice(markers[1].index + 1),
  ].join("\n");
  const hash = createHash("sha256").update(masked).digest("hex");
  await t.test(
    "WO-190 the exact heading order and every rung body equal the recorded landing (retires as a skip when the document moves on)",
    (exact) => {
      if (hash !== record.sha256WithoutReleaseHistory) {
        exact.skip(
          `retired: ${document} no longer hashes to roadmap-order.json (hash ${hash.slice(0, 12)})`,
        );
        return;
      }
      assert.deepEqual(
        headings.map((row) => row.line),
        record.headings,
      );
      const base = spawnGit(["show", `${record.baseCommit}:${document}`], {
        cwd: repoRoot,
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      });
      assert.equal(base.status, 0, base.stderr);
      const bodies = (source) => {
        const result = new Map();
        let heading = null,
          body = [];
        const flush = () => {
          if (heading === null) return;
          while (body.length && !body.at(-1).trim()) body.pop();
          if (body.at(-1) === "<!-- prettier-ignore -->") body.pop();
          while (body.length && !body.at(-1).trim()) body.pop();
          result.set(heading, body.join("\n"));
        };
        for (const line of source.split("\n")) {
          if (/^## /.test(line)) {
            flush();
            heading = line;
            body = [];
          } else if (heading !== null) body.push(line);
        }
        flush();
        return result;
      };
      const before = bodies(base.stdout),
        after = bodies(text);
      assert.equal(before.size, after.size);
      for (const [heading, body] of before) {
        const renamed = record.renamedHeadings[heading] ?? heading;
        assert.ok(after.has(renamed), `${renamed} is missing`);
        if (heading === "## Release boundary") continue; // not a rung; its generated block moved to its end
        assert.equal(after.get(renamed), body, `${renamed}: body text changed`);
      }
    },
  );
});

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
  const record = (dispatch, extra = {}, heading = "WO-999-D001") => {
    const row = {
      id: "WO-999-D001",
      date: "2026-09-26",
      dispatch,
      decision: "A bounded fixture decision",
      evidence: ["fixture"],
      rejected: [],
      reopenWhen: "fixture changes",
      ...extra,
    };
    write(
      `${evidence}/WO-999/decisions.md`,
      `# Decisions\n\n## ${heading}\n\n\`\`\`json\n${JSON.stringify(row)}\n\`\`\`\n`,
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

test("byte ceilings count UTF-8, advise exact overage and refuse absent products", (t) => {
  const f = fixture(t);
  f.ceilings.documents["00-fixture.md"].ceiling = Buffer.byteLength(f.source);
  assert.deepEqual(f.check().failures, []);
  f.write(`${f.product}/00-fixture.md`, f.source + "é");
  assert.match(f.check().notices.join("\n"), /2 bytes over ceiling/);
  delete f.ceilings.documents["00-fixture.md"];
  assert.match(f.check().failures.join("\n"), /missing ceiling/);
});

test("byte overages advise independently of decision and follow-up disposition", (t) => {
  for (const roots of [
    {},
    { docs: "records", evidence: "proof", product: "blueprint" },
  ]) {
    for (const heading of ["WO-999-D001", "WO-999-D001 — byte goal"]) {
      const f = fixture(t, roots);
      const entry = f.ceilings.documents["00-fixture.md"];
      entry.ceiling = Buffer.byteLength(f.source);
      f.write(`${f.product}/00-fixture.md`, f.source + "é");
      const reference = `${f.evidence}/WO-999/decisions.md#${heading.includes("—") ? "wo-999-d001--byte-goal" : "wo-999-d001"}`;
      entry.advisoryDecision = reference;
      const overage = () =>
        assert.match(f.check().notices.join("\n"), /2 bytes over ceiling/);
      overage(); // Neither a decision nor a follow-up is required.
      f.record(
        "resume: next; operator direction",
        {
          followup: "Consolidate fixture text with equivalent usefulness.",
        },
        heading,
      );
      overage();
      const dispose = (status) => {
        syncFollowups(f.root);
        const feed = planningFollowups(f.root, { all: true });
        const row = feed.rows.find((row) => row.source === reference);
        assert.ok(row);
        disposeFollowup(f.root, {
          expectedRevision: feed.revision,
          id: row.id,
          sourceRevision: row.sourceRevision,
          status,
          reason: "Fixture operator-directed byte goal.",
          reopenWhen:
            status === "open" ? null : "Useful consolidation changes.",
          targets: status === "allocated" ? ["WO-998"] : [],
        });
        return row.id;
      };
      const id = dispose("open");
      assert.deepEqual(f.check().failures, []);
      assert.match(
        f.check().notices.join("\n"),
        /ADVISORY .*2 bytes over ceiling; planning resets ceilings/,
      );
      assert.equal(f.check().rows[0].ceiling, entry.ceiling);
      assert.equal(f.check().rows[0].headroom, -2);
      entry.advisoryDecision = `${reference}#does-not-resolve`;
      overage(); // An unresolved reference does not turn the byte goal into a refusal.
      entry.advisoryDecision = reference.replace("d001", "d002");
      overage();
      entry.advisoryDecision = reference;
      f.record(
        "resume: next; operator direction",
        {
          followup: "A revised consolidation scope.",
        },
        heading,
      );
      overage(); // The register need not capture the decision bytes.
      syncFollowups(f.root);
      overage(); // A stale disposition also leaves the advisory unchanged.
      dispose("deferred");
      assert.deepEqual(f.check().failures, []);
      f.write(
        `${roots.workOrders ?? `${roots.docs ?? "docs"}/work-orders`}/WO-998-fixture.md`,
        "# WO-998 — fixture\n",
      );
      dispose("allocated");
      overage(); // Allocation does not alter the advisory.
      dispose("settled");
      overage(); // Settlement does not turn a byte goal into a refusal.
    }
  }
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
  assert.match(
    f.check().notices.join("\n"),
    /06-roadmap\.md: 2\d{3} bytes over ceiling/,
  );
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

test("planning owns ceiling increases without a gate enforcing the raise rule", (t) => {
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
  assert.deepEqual(f.check().failures, []);
  entry.decision = "docs/planning/approved.md#ceiling-change";
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/planning/approved.md",
    "# Plan\n\n## Ceiling change\n\nA fixture decision.\n",
  );
  assert.deepEqual(f.check().failures, []);
  entry.decision += "#does-not-resolve";
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
      f.check().notices.join("\n"),
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
  assert.match(result.notices.join("\n"), /bytes over ceiling/);
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
    result.notices.join("\n"),
    new RegExp(
      `06-roadmap\\.md: ${Buffer.byteLength(source) - Buffer.byteLength(base)} bytes over ceiling`,
    ),
  );
  assert.match(failures, /06-roadmap\.md#release-boundary: new receipt/);
  assert.match(failures, /06-roadmap\.md#candidate--smuggled: new candidate/);
});

// Annotated DotLn tags whose manifests name their orders, one of which has a
// heading with no version, beside a lightweight and an unrelated tag (WO-086).
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

test("document CLI admits overage with one advisory but refuses missing and malformed ceiling metadata", (t) => {
  const f = fixture(t);
  const entry = f.ceilings.documents["00-fixture.md"];
  entry.ceiling = Buffer.byteLength(f.source) - 2;
  const run = () => {
    f.controls();
    return spawnSync(process.execPath, [script], {
      cwd: f.root,
      env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      encoding: "utf8",
    });
  };
  const advisory = run();
  assert.equal(advisory.status, 0, advisory.stdout + advisory.stderr);
  assert.equal(
    (
      advisory.stdout.match(
        /ADVISORY .*2 bytes over ceiling; planning resets ceilings/g,
      ) ?? []
    ).length,
    1,
  );
  delete f.ceilings.documents["00-fixture.md"];
  const missing = run();
  assert.notEqual(missing.status, 0);
  assert.match(missing.stdout + missing.stderr, /missing ceiling/);
  f.ceilings.documents["00-fixture.md"] = { ...entry, ceiling: "bad" };
  const malformed = run();
  assert.notEqual(malformed.status, 0);
  assert.match(malformed.stdout + malformed.stderr, /invalid ceiling metadata/);
});

test("document gate prints each ceiling advisory once and refuses invalid metadata at default and relocated roots", async (t) => {
  for (const roots of [{}, { docs: "records" }])
    await t.test(roots.docs ?? "default roots", async (t) => {
      const f = fixture(t, roots);
      const entry = f.ceilings.documents["00-fixture.md"];
      entry.ceiling = Buffer.byteLength(f.source) - 2;
      const second = f.source.replace("A fact.", "A café fact.");
      f.write(`${f.product}/01-extra.md`, second);
      f.ceilings.documents["01-extra.md"] = {
        ...entry,
        nonExemptBytesAtLanding: Buffer.byteLength(second),
        ceiling: Buffer.byteLength(second) - 4,
      };
      const table = [
        {
          ...suites.find((row) => row.name === "docs-check"),
          command: [process.execPath, script],
          needsBuild: false,
          executionEnvironment: { ...process.env, DOTLN_LAUNCHPAD: f.root },
        },
      ];
      const run = async () => {
        f.controls();
        const lines = [];
        const saved = console.log;
        try {
          console.log = (line) => lines.push(String(line));
          const check = await runGate(["--document", "--serial"], f.root, {
            table,
          });
          return { check, output: lines.join("\n") };
        } finally {
          console.log = saved;
        }
      };
      const advisory = await run();
      assert.equal(advisory.check.exitCode, 0, advisory.output);
      for (const [name, bytes] of [
        ["00-fixture.md", 2],
        ["01-extra.md", 4],
      ]) {
        const expected = `ADVISORY ${f.product}/${name}: ${bytes} bytes over ceiling; planning resets ceilings`;
        assert.equal(
          advisory.output.split("\n").filter((line) => line.includes(expected))
            .length,
          1,
          advisory.output,
        );
      }
      delete f.ceilings.documents["00-fixture.md"];
      const missing = await run();
      assert.equal(missing.check.exitCode, 1, missing.output);
      assert.match(missing.output, /missing ceiling/);
      f.ceilings.documents["00-fixture.md"] = { ...entry, ceiling: "bad" };
      const malformed = await run();
      assert.equal(malformed.check.exitCode, 1, malformed.output);
      assert.match(malformed.output, /invalid ceiling metadata/);
    });
});

test("document gate forwards explicit success diagnostics and preserves full failure output", async (t) => {
  const f = fixture(t);
  for (const exitCode of [0, 1]) {
    f.write(
      "scripts/notice.mjs",
      `console.log("ordinary detail");\nconsole.log("ADVISORY fixture notice");\nconsole.log("NEWER fixture history");\nprocess.exitCode = ${exitCode};\n`,
    );
    const lines = [];
    const saved = console.log;
    try {
      console.log = (line) => lines.push(String(line));
      const check = await runGate(["--document", "--serial"], f.root, {
        table: [
          {
            name: "fixture-notices",
            document: true,
            command: [process.execPath, "scripts/notice.mjs"],
          },
        ],
      });
      assert.equal(check.exitCode, exitCode, lines.join("\n"));
      for (const diagnostic of [
        "ADVISORY fixture notice",
        "NEWER fixture history",
      ])
        assert.equal(
          lines.filter((line) => line.endsWith(diagnostic)).length,
          1,
        );
      assert.equal(
        lines.some((line) => line.endsWith("ordinary detail")),
        exitCode !== 0,
      );
    } finally {
      console.log = saved;
    }
  }
});

test("two attributed provenance fields in one order get their own keys and fingerprints", (t) => {
  const f = fixture(t);
  const file = "docs/work-orders/WO-999-fixture.md";
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Track:** machinery\n**Nomination provenance:** The operator said “synthetic first quote”.\n\n**Provenance:** The operator said “synthetic second quote”.\n",
  );
  const found = operatorWordFindings(f.root);
  assert.deepEqual(
    found.map((row) => row.record),
    ["provenance", "provenance-2"],
  );
  assert.notEqual(found[0].fingerprint, found[1].fingerprint);
  assert.doesNotMatch(JSON.stringify(found), /synthetic/);
  f.baseline.operatorWords = { [`${file}#provenance`]: found[0].fingerprint };
  let result = f.check();
  assert.equal(result.operatorWords.current, 1);
  assert.equal(result.operatorWords.rows[0].record, "provenance-2");
  f.baseline.operatorWords[`${file}#provenance-2`] = found[1].fingerprint;
  result = f.check();
  assert.equal(result.operatorWords.current, 0);
  assert.equal(result.operatorWords.historical, 2);
  // Only the second field's words change: only its record is current.
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Track:** machinery\n**Nomination provenance:** The operator said “synthetic first quote”.\n\n**Provenance:** The operator said “another quote”.\n",
  );
  assert.deepEqual(
    f.check().operatorWords.rows.map((row) => row.record),
    ["provenance-2"],
  );
  // A clean first field still takes the first key, so the second keeps its own.
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Nomination provenance:** Nominated by the planner.\n\n**Provenance:** The operator said “synthetic second quote”.\n",
  );
  assert.deepEqual(
    operatorWordFindings(f.root).map((row) => row.record),
    ["provenance-2"],
  );
  f.baseline.operatorWords = {};
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.match(
    cli.stdout,
    /ADVISORY docs\/work-orders\/WO-999-fixture\.md#provenance-2:/,
  );
});

test("the docs check fails on a roadmap whose release-history block is removed and reports a tag whose annotation cannot be read", (t) => {
  const f = taggedFixture(t);
  f.cli("list", "--markdown", "--write");
  assert.deepEqual(f.check().failures, []);
  const committed = readFileSync(`${f.root}/${f.roadmap}`, "utf8");
  const lines = committed.split("\n");
  const first = lines.findIndex((line) => line.includes(historyStart)),
    last = lines.findIndex((line) => line.includes(historyEnd));
  assert.ok(first >= 0 && last > first, "the generated block is present");
  f.write(
    f.roadmap,
    [...lines.slice(0, first), ...lines.slice(last + 1)].join("\n"),
  );
  assert.deepEqual(f.check().failures, [
    `docs/product/06-roadmap.md: no generated release history block; add the ${historyStart} and ${historyEnd} lines where the table belongs, then run npm run release -- list --markdown --write`,
  ]);
  f.write(f.roadmap, committed);
  assert.deepEqual(f.check().failures, []);
  // A header-only tag object holds no annotation to read.
  const head = f.git(["rev-parse", "HEAD"]).trim();
  const object = `object ${head}\ntype commit\ntag v1.2.0\ntagger Fixture <fixture@example.invalid> 1767657600 +0000\n`;
  let made = spawnGit(["-C", f.root, "mktag"], {
    input: object,
    encoding: "utf8",
  });
  if (made.status !== 0)
    made = spawnGit(
      [
        "-C",
        f.root,
        "hash-object",
        "-t",
        "tag",
        "-w",
        "--stdin",
        "--literally",
      ],
      { input: object, encoding: "utf8" },
    );
  assert.equal(made.status, 0, made.stderr);
  f.git(["update-ref", "refs/tags/v1.2.0", made.stdout.trim()]);
  assert.match(f.git(["cat-file", "-p", "v1.2.0"]), /^tag v1\.2\.0$/mu);
  let result;
  assert.doesNotThrow(() => {
    result = f.check();
  });
  assert.deepEqual(result.failures, [
    "docs/product/06-roadmap.md: a local release tag's annotation cannot be read (v1.2.0 is not an annotated tag object); repair or delete the tag",
  ]);
  assert.deepEqual(result.notices, []);
});

test("a home or private temporary path in a document fails at its line; baselined lines pass until edited", (t) => {
  const f = fixture(t);
  const file = "docs/evidence/WO-999/README.md";
  const message =
    "absolute home or private temporary path; write a repository-relative path or a placeholder such as <worktree>/ or <tmp>/";
  f.write(file, "Ran in /Users/fixture-user/work/repo.\n");
  let result = f.check();
  assert.deepEqual(result.failures, [`${file}:1: ${message}`]);
  assert.doesNotMatch(result.failures.join("\n"), /fixture-user/);
  f.baseline.homePaths = {
    [file]: homePathFindings(f.root).map((row) => row.fingerprint),
  };
  result = f.check();
  assert.deepEqual(result.failures, []);
  assert.equal(result.historicalHomePaths, 1);
  // An edited line is a new line, and a pasted duplicate exceeds the count.
  f.write(file, "Ran in /Users/fixture-user/work/other.\n");
  assert.deepEqual(f.check().failures, [`${file}:1: ${message}`]);
  f.write(
    file,
    "Ran in /Users/fixture-user/work/repo.\nRan in /Users/fixture-user/work/repo.\n",
  );
  assert.deepEqual(f.check().failures, [`${file}:2: ${message}`]);
  // Each positive form on its own line; placeholders and relative tails are
  // not paths, and a bare mention names no file.
  f.baseline.homePaths = {};
  f.write(
    file,
    [
      "/private/var/folders/ab/T/x",
      "/tmp/dotln-fixture/x",
      "file:///Users/fixture-user/x",
      "/home/fixture/x",
      "/Users/...",
      "/var/folders/.../T",
      "SCRATCH/tmp/x",
      ".runtime/tmp/x",
      "`/tmp/` alone",
    ].join("\n") + "\n",
  );
  assert.deepEqual(
    f.check().failures.map((line) => Number(line.split(":")[1])),
    [1, 2, 3, 4],
  );
  for (const malformed of [{ [file]: "x" }, { [file]: ["not-a-digest"] }]) {
    f.baseline.homePaths = malformed;
    assert.throws(
      () => f.check(),
      /Historical home-path exceptions require a file and SHA-256 line fingerprints/,
    );
  }
  f.baseline.homePaths = {};
  f.write(file, "Ran in /Users/fixture-user/work/repo.\n");
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 1);
  assert.match(
    cli.stderr,
    /FAIL docs\/evidence\/WO-999\/README\.md:1: absolute home/,
  );
  assert.doesNotMatch(cli.stdout + cli.stderr, /fixture-user/);
});

test("a typed operator quotation needs its capture digest; a quoted field or report paragraph advises by its own record", (t) => {
  const f = fixture(t);
  const path = "docs/evidence/WO-999/decisions.md";
  // The typed field fails the check; every other finding stays an advisory.
  f.record("resume: next", {
    operatorQuote: { text: "synthetic captured words" },
  });
  let result = f.check();
  assert.deepEqual(result.failures, [
    `${path}#WO-999-D001: operatorQuote 1 needs text and captureSha256 (sha256:<digest> of the captured words in ignored intake); paraphrase instead of quoting`,
  ]);
  assert.doesNotMatch(result.failures.join("\n"), /synthetic captured words/);
  f.record("resume: next", {
    operatorQuote: {
      text: "synthetic captured words",
      captureSha256: `sha256:${"d".repeat(64)}`,
    },
  });
  assert.deepEqual(f.check().failures, []);
  for (const quote of [
    [{ text: "x" }],
    { text: "", captureSha256: `sha256:${"d".repeat(64)}` },
    { text: "x", captureSha256: "d".repeat(64) },
    "words",
  ]) {
    f.record("resume: next", { operatorQuote: quote });
    assert.equal(f.check().failures.length, 1, JSON.stringify(quote));
  }
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 1);
  assert.match(cli.stderr, /operatorQuote 1 needs text and captureSha256/);
  // Each quoting field advises under its own record.
  const records = () => operatorWordFindings(f.root).map((row) => row.record);
  f.record("resume: next", {
    evidence: ["The operator said “synthetic evidence quote”."],
  });
  assert.deepEqual(records(), ["WO-999-D001/evidence-1"]);
  f.record("resume: next", {
    kind: "correction",
    misread: "The operator said “synthetic”.",
    meant: "a paraphrase",
    changed: "the text",
  });
  assert.deepEqual(records(), ["WO-999-D001/misread"]);
  f.record("resume: next", {
    rejected: [{ option: "x", reason: "The operator said “synthetic”." }],
  });
  assert.deepEqual(records(), ["WO-999-D001/rejected-1.reason"]);
  // An operator-named field attributes its value by its key alone; a marked
  // paraphrase and a capture digest exempt it; a baseline covers it.
  f.record("resume: next", { operatorAuthorization: "synthetic words" });
  const named = operatorWordFindings(f.root);
  assert.deepEqual(
    named.map((row) => row.record),
    ["WO-999-D001/operatorAuthorization"],
  );
  f.baseline.operatorWords = {
    [`${named[0].file}#${named[0].record}`]: named[0].fingerprint,
  };
  assert.equal(f.check().operatorWords.current, 0);
  assert.equal(f.check().operatorWords.historical, 1);
  f.record("resume: next", {
    operatorAuthorization: ["Paraphrase: synthetic", "second words"],
  });
  assert.deepEqual(records(), ["WO-999-D001/operatorAuthorization-2"]);
  f.record("resume: next", {
    operatorAuthorization: "synthetic words",
    evidence: [`SHA-256 ${"a".repeat(64)}`],
  });
  assert.deepEqual(records(), []);
  // A backquote run inside a JSON string no longer leaks the record into the
  // prose the decision-level check reads.
  f.record("resume: next", {
    evidence: ["a line that starts with ``` toggles a fence"],
    rejected: [
      { option: "Ask the operator to authorize the redesign", reason: "x" },
    ],
  });
  assert.deepEqual(records(), []);
  // Reports and planning documents: a paragraph that attributes words is a
  // record keyed by its own content, so an insertion above it keeps the key;
  // a fenced example is no record.
  f.record("resume: next");
  f.write(
    "docs/verifications/WO-999/VER-001.md",
    "# VER-001\n\nThe operator said “synthetic report quote”.\n",
  );
  f.write(
    "docs/planning/fixture-pass.md",
    "# Pass\n\nThe operator said “synthetic planning quote”.\n\n```\nThe operator said “fenced”.\n```\n",
  );
  const documents = operatorWordFindings(f.root);
  assert.deepEqual(
    documents.map((row) => [row.file, row.line]),
    [
      ["docs/planning/fixture-pass.md", 3],
      ["docs/verifications/WO-999/VER-001.md", 3],
    ],
  );
  assert.ok(
    documents.every((row) => /^paragraph-[0-9a-f]{12}$/u.test(row.record)),
  );
  assert.doesNotMatch(JSON.stringify(documents), /synthetic/);
  f.write(
    "docs/verifications/WO-999/VER-001.md",
    "# VER-001\n\nAn inserted paragraph.\n\nThe operator said “synthetic report quote”.\n",
  );
  const moved = operatorWordFindings(f.root).find(
    (row) => row.file === documents[1].file,
  );
  assert.equal(moved.record, documents[1].record);
  assert.equal(moved.line, 5);
});

// A repository whose front page is under guard: a base commit on main with
// the marked page, its control record and the order's authority file (with or
// without the declaration), then a wo-999 branch where the change happens.
// The front page every front-page fixture and corpus row starts from: a
// release block and two counted lines under "What runs today", then "Next".
const frontPageText = ({
  version = "v0.1.0",
  sentences = ["The kernel replays.", "The skeleton runs."],
  closing = "A closing paragraph.",
  lead = "",
} = {}) =>
  `# Page\n\n## What runs today\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn \`${version}\`.\n<!-- DOTLN-RELEASE-END -->\n\n${lead}<!-- dotln-what-runs:start -->\n${sentences.map((line) => `${line}\n`).join("")}<!-- dotln-what-runs:end -->\n\n## Next\n\n${closing}\n`;
function frontPageFixture(
  t,
  { declare = true, lineBudget = 3, basePage, baseBranch = "main" } = {},
) {
  const f = fixture(t);
  const git = (...args) => {
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
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stderr}`);
    return result.stdout.trim();
  };
  const page = frontPageText;
  const record = {
    schemaVersion: 1,
    page: "README.md",
    generatedBlocks: [
      {
        start: "<!-- DOTLN-RELEASE-BEGIN -->",
        end: "<!-- DOTLN-RELEASE-END -->",
      },
    ],
    whatRunsToday: {
      start: "<!-- dotln-what-runs:start -->",
      end: "<!-- dotln-what-runs:end -->",
      lineBudget,
    },
  };
  const order = (field) =>
    `# WO-999 — Fixture\n\n**Track:** machinery\n${field}\n**Objective:** Fixture.\n`;
  f.write("README.md", basePage ?? page());
  f.write(`${f.control}/front-page.json`, JSON.stringify(record));
  f.write(
    "docs/work-orders/WO-999-fixture.md",
    order(declare ? "**Front page:** README.md" : ""),
  );
  f.controls();
  git("checkout", "-q", "-b", baseBranch);
  git("add", "-A");
  git("commit", "-qm", "base");
  git("checkout", "-q", "-b", "wo-999");
  const frontPage = () =>
    f
      .check()
      .failures.filter((line) =>
        /^(?:README\.md|docs\/control\/front-page\.json)/.test(line),
      );
  return { ...f, git, page, order, record, frontPage };
}

test("the front page changes outside its generated blocks only through an order whose header declared it at the merge base", (t) => {
  const refused = frontPageFixture(t, { declare: false });
  assert.deepEqual(refused.frontPage(), []);
  // The version line is a generated block's interior: free to change.
  refused.write("README.md", refused.page({ version: "v0.2.0" }));
  assert.deepEqual(refused.frontPage(), []);
  refused.write(
    "README.md",
    refused.page({ closing: "An appended sentence." }),
  );
  assert.match(
    refused.frontPage().join("\n"),
    /README\.md: changed outside its generated blocks while WO-999's leading header at the merge base declares no `\*\*Front page:\*\*` field;[^`]* see `git diff [0-9a-f]{12} -- README\.md`/,
  );
  // The same sentence inside the budgeted section is refused the same way.
  refused.write(
    "README.md",
    refused.page({
      sentences: ["The kernel replays.", "A new capability runs."],
    }),
  );
  assert.match(
    refused.frontPage().join("\n"),
    /changed outside its generated blocks/,
  );
  // Adding the field on the branch itself declares nothing: the base is read.
  refused.write(
    "docs/work-orders/WO-999-fixture.md",
    refused.order("**Front page:** README.md"),
  );
  assert.match(
    refused.frontPage().join("\n"),
    /while WO-999's leading header at the merge base declares no `\*\*Front page:\*\*` field/,
  );
  const admitted = frontPageFixture(t, { declare: true });
  admitted.write(
    "README.md",
    admitted.page({ closing: "An appended sentence." }),
  );
  assert.deepEqual(admitted.frontPage(), []);
  // A branch that names no order has no declaration to admit it.
  admitted.git("checkout", "-q", "-b", "planning/fixture");
  assert.match(
    admitted.frontPage().join("\n"),
    /changed outside its generated blocks on branch planning\/fixture, which names no work order/,
  );
});

test("the control record that governs is the merge base's, so a branch cannot switch the guard off", (t) => {
  const f = frontPageFixture(t, { declare: false });
  f.write("README.md", f.page({ closing: "An appended sentence." }));
  const path = `${f.control}/front-page.json`;
  // Deleting the record, raising the budget or redrawing the generated blocks
  // changes nothing about the judgment and is itself refused.
  rmSync(join(f.root, path));
  let found = f.frontPage().join("\n");
  assert.match(
    found,
    /front-page\.json: differs from its version at the merge base with main while WO-999's leading header at the merge base declares no/,
  );
  assert.match(found, /changed outside its generated blocks/);
  f.write(
    path,
    JSON.stringify({
      ...f.record,
      whatRunsToday: { ...f.record.whatRunsToday, lineBudget: 99 },
    }),
  );
  f.write(
    "README.md",
    f.page({ sentences: ["One.", "Two.", "Three.", "Four."] }),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /front-page\.json: differs from its version at the merge base/,
  );
  assert.match(
    found,
    /"What runs today" holds 4 counted lines \(the non-empty lines between its markers\); the budget in docs\/control\/front-page\.json at the merge base is 3/,
  );
  f.write(
    path,
    JSON.stringify({
      ...f.record,
      generatedBlocks: [
        { start: "<!-- dotln-what-runs:start -->", end: "<!-- never -->" },
      ],
    }),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /front-page\.json: differs from its version at the merge base/,
  );
  assert.match(
    found,
    /front-page\.json: invalid front-page control record: whatRunsToday markers cannot also bound a generated block/,
  );
  // A declared order may move the record, and its new record must be valid;
  // but the section's budget is the merge base's, so raising it on the branch
  // that fills it admits nothing: planning moves the budget on main.
  const declared = frontPageFixture(t, { declare: true });
  declared.write(
    path,
    JSON.stringify({
      ...declared.record,
      whatRunsToday: { ...declared.record.whatRunsToday, lineBudget: 4 },
    }),
  );
  declared.write(
    "README.md",
    declared.page({ sentences: ["One.", "Two.", "Three.", "Four."] }),
  );
  assert.match(
    declared.frontPage().join("\n"),
    /holds 4 counted lines[^;]*; the budget in docs\/control\/front-page\.json at the merge base is 3\..*planning moves the budget on main/,
  );
  declared.write(path, JSON.stringify({ schemaVersion: 2 }));
  assert.match(
    declared.frontPage().join("\n"),
    /front-page\.json: invalid front-page control record: schemaVersion must be 1/,
  );
  declared.write(path, "{ not json");
  assert.match(
    declared.frontPage().join("\n"),
    /invalid front-page control record: /,
  );
});

test("What runs today keeps one sentence per line within its recorded budget, and the page names no receipt", (t) => {
  const f = frontPageFixture(t, { declare: true, lineBudget: 3 });
  f.write(
    "README.md",
    f.page({ sentences: ["One runs.", "Two runs.", "Three runs."] }),
  );
  assert.deepEqual(f.frontPage(), []);
  f.write(
    "README.md",
    f.page({
      sentences: ["One runs.", "Two runs.", "Three runs.", "Four runs."],
    }),
  );
  assert.match(
    f.frontPage().join("\n"),
    /"What runs today" holds 4 counted lines \(the non-empty lines between its markers\); the budget in docs\/control\/front-page\.json at the merge base is 3/,
  );
  // Blank lines inside the section do not count; two sentences on one line
  // and a line without a terminator are refused; a lost marker fails.
  f.write(
    "README.md",
    f.page({ sentences: ["One runs.", "", "Two runs.", "", "Three runs."] }),
  );
  assert.deepEqual(f.frontPage(), []);
  f.write(
    "README.md",
    f.page({ sentences: ["One runs. Two runs.", "Three runs."] }),
  );
  assert.match(
    f.frontPage().join("\n"),
    /holds more than one sentence; the next starts at "Two runs\."[\s\S]*: "One runs\. Two runs\."/,
  );
  f.write("README.md", f.page({ sentences: ["One runs", "Two runs."] }));
  assert.match(
    f.frontPage().join("\n"),
    /does not end a sentence;[^:]*: "One runs/,
  );
  f.write("README.md", f.page().replace("<!-- dotln-what-runs:end -->\n", ""));
  assert.match(
    f.frontPage().join("\n"),
    /needs exactly one ordered pair of marker lines/,
  );
  // Prose cannot stand between the heading and the opening marker.
  f.write(
    "README.md",
    f.page({ lead: "A lead sentence above the markers.\n\n" }),
  );
  assert.match(
    f.frontPage().join("\n"),
    /README\.md:9: prose under ## What runs today outside the markers <!-- dotln-what-runs:start --> and <!-- dotln-what-runs:end -->/,
  );
  f.write(
    "README.md",
    f.page().replace("## What runs today", "## Capabilities"),
  );
  assert.match(
    f.frontPage().join("\n"),
    /needs the heading ## What runs today/,
  );
  // A generated block that never closes is a shape failure, not a mask.
  f.write("README.md", f.page().replace("<!-- DOTLN-RELEASE-END -->\n", ""));
  assert.match(
    f.frontPage().join("\n"),
    /a generated block opens and never closes with <!-- DOTLN-RELEASE-END -->/,
  );
  // Receipts: identifiers, dates and versions outside a generated block.
  for (const [closing, label] of [
    ["WO-118 added the loop.", "a work-order identifier"],
    ["See D004 for the rule.", "a decision identifier"],
    ["Recorded on 2026-10-09.", "a date"],
    ["Shipped in v0.2.0.", "a version"],
    ["Shipped in 0.2.0.", "a version number"],
  ]) {
    f.write("README.md", f.page({ closing }));
    assert.match(
      f.frontPage().join("\n"),
      new RegExp(
        `README\\.md:\\d+: "[^"]+" is ${label} outside a generated block`,
      ),
      closing,
    );
  }
  // Without any record nothing about the page is judged.
  const bare = fixture(t);
  bare.write("README.md", "# Page\n\nWO-001 shipped v0.1.0 on 2026-01-01.\n");
  assert.deepEqual(
    bare.check().failures.filter((line) => /^README\.md/.test(line)),
    [],
  );
});

test("What runs today is one range from its heading to the next heading: no sentence escapes the count and the markers cannot leave the heading", (t) => {
  const f = frontPageFixture(t, { declare: true, lineBudget: 3 });
  const twelve = Array.from(
    { length: 12 },
    (_, index) => `Extra capability ${index + 1} runs.`,
  ).join("\n");
  const base = f.page();
  const prose = /prose under ## What runs today outside the markers/g;
  // Sentences below the closing marker, before the next heading, are refused
  // one by one and are not hidden by a blank line or by distance.
  f.write(
    "README.md",
    base.replace(
      "<!-- dotln-what-runs:end -->\n",
      `<!-- dotln-what-runs:end -->\n\n${twelve}\n`,
    ),
  );
  let found = f.frontPage();
  // The twelve lines are one run, reported once with its line range.
  assert.equal(found.join("\n").match(prose).length, 1);
  assert.match(found.join("\n"), /README\.md:14-25: prose under/);
  // A subheading does not close the section, so sentences under it are still
  // the section's sentences.
  f.write(
    "README.md",
    base.replace(
      "<!-- dotln-what-runs:end -->\n",
      `<!-- dotln-what-runs:end -->\n\n### More\n\nAnother capability runs.\n`,
    ),
  );
  found = f.frontPage().join("\n");
  assert.equal(found.match(prose).length, 2, found);
  // The pair moved above the heading leaves the heading's sentences
  // uncounted: the placement is refused, which is the one failure that
  // explains the shape.
  const block = base.slice(
    base.indexOf("<!-- dotln-what-runs:start -->"),
    base.indexOf("<!-- dotln-what-runs:end -->") +
      "<!-- dotln-what-runs:end -->".length,
  );
  f.write(
    "README.md",
    base
      .replace(block, twelve)
      .replace("## What runs today", `${block}\n\n## What runs today`),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /the marker lines <!-- dotln-what-runs:start --> and <!-- dotln-what-runs:end --> stand under ## What runs today and before the next heading; found them at lines 3 and 6/,
  );
  assert.equal(found.match(prose), null);
  // The closing marker cannot stand under the next heading either.
  f.write(
    "README.md",
    base.replace(
      "<!-- dotln-what-runs:end -->\n\n## Next\n",
      "## Next\n\n<!-- dotln-what-runs:end -->\n",
    ),
  );
  assert.match(
    f.frontPage().join("\n"),
    /stand under ## What runs today and before the next heading/,
  );
  // A second section under the same heading is refused as a shape, not
  // counted as two sections.
  f.write("README.md", base + "\n## What runs today\n\nMore runs.\n");
  assert.match(
    f.frontPage().join("\n"),
    /needs exactly one heading ## What runs today; found 2/,
  );
  // Sentences on one line are counted whatever the next one starts with.
  f.write(
    "README.md",
    f.page({
      sentences: [
        "One runs. " +
          Array.from({ length: 12 }, () => "another runs.").join(" "),
        "Two runs.",
      ],
    }),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /README\.md:10: a "What runs today" line holds more than one sentence; the next starts at "another runs\.[\s\S]*: "One runs\. another runs\./,
  );
  f.write(
    "README.md",
    f.page({ sentences: ["It runs (see below.) and more runs.", "Two runs."] }),
  );
  assert.match(f.frontPage().join("\n"), /holds more than one sentence/);
  // A terminator inside a word, a code span or a link is not a break.
  f.write(
    "README.md",
    f.page({
      sentences: [
        "The [guide](/docs/product/00-fixture.md) and `x.mjs` run, i.e.: fine.",
        "Two runs.",
      ],
    }),
  );
  assert.deepEqual(f.frontPage(), []);
  // Prose under the heading that closes the section is the page's own, judged
  // by the declaration alone.
  f.write("README.md", f.page({ closing: twelve }));
  assert.deepEqual(f.frontPage(), []);
});

test("What runs today judges rendered sentences across inline Markdown, before and after formatting", async (t) => {
  const f = frontPageFixture(t, { declare: true, lineBudget: 3 });
  const valid = [
    [
      "**One runs.**",
      "_Two runs._",
      "[Three runs.](docs/product/00-fixture.md)",
    ],
    ["~~One runs.~~", "`Two runs.`", "***Three runs.***"],
    ["**One runs.", "Two runs.**", "Three runs."],
    ["**One runs.**  ", "_Two runs._", "Three runs."],
    [
      "One runs&#46;",
      "Two runs\\.",
      "The `x.mjs` and [guide](docs/product/00-fixture.md) run.",
    ],
  ];
  const invalid = [
    "**One runs.** **Two runs.** Three runs.",
    "_One runs._ _Two runs._ Three runs.",
    "~~One runs.~~ ~~Two runs.~~ Three runs.",
    "***One runs.*** __Two runs.__ Three runs.",
    "[One runs.](docs/product/00-fixture.md) [Two runs.](docs/product/00-fixture.md) Three runs.",
    "`One runs.` **Two runs.** Three runs.",
    "One runs&#46; Two runs.",
    "One runs\\. Two runs.",
    "**“One runs.”** _‘Two runs.’_ Three runs.",
  ];
  const check = async (sentences, pattern) => {
    const source = f.page({ sentences });
    for (const text of [
      source,
      await format(source, { parser: "markdown", proseWrap: "preserve" }),
    ]) {
      f.write("README.md", text);
      const found = f.frontPage();
      if (pattern) assert.match(found.join("\n"), pattern, text);
      else assert.deepEqual(found, [], text);
    }
  };
  for (const sentences of valid) await check(sentences);
  for (const line of invalid)
    await check([line, "Another runs."], /holds more than one sentence/);
  await check(["**One runs**", "Another runs."], /does not end a sentence/);
  // Invisible or block content cannot masquerade as counted sentence lines.
  for (const line of [
    "One <em>runs.</em> Two runs.",
    "> **One runs.** Two runs.",
    "### **One runs.** Two runs.",
    "<!-- One runs. --> Two runs.",
  ])
    await check([line, "Another runs."], /must be Markdown prose/);
});

test("What runs today uses rendered heading identity and parsed section boundaries across Markdown spellings", async (t) => {
  const f = frontPageFixture(t, { declare: true });
  const headings = [
    "## **What runs today**",
    "## _What runs today_",
    "## `What runs today`",
    "## [What **runs** today](docs/product/00-fixture.md)",
    "## What runs&#32;today",
    "## What runs today ##",
    "##\tWhat runs today",
    "  ## What runs today",
    "**What runs today**\n-------------------",
  ];
  for (const heading of headings) {
    for (const source of [
      f.page().replace("## What runs today", heading),
      f.page() + `\n${heading}\n\nAnother runs.\n`,
    ]) {
      const duplicate = source.startsWith(f.page());
      for (const text of [
        source,
        await format(source, { parser: "markdown", proseWrap: "preserve" }),
      ]) {
        f.write("README.md", text);
        const found = f.frontPage();
        if (duplicate)
          assert.match(
            found.join("\n"),
            /needs exactly one heading ## What runs today; found 2/,
            text,
          );
        else assert.deepEqual(found, [], text);
      }
    }
  }
  // A lower-level or quoted duplicate does not create an unguarded namesake.
  for (const heading of [
    "# What runs today",
    "### What runs today",
    "> ## What runs today",
  ]) {
    f.write("README.md", f.page() + `\n${heading}\n\nAnother runs.\n`);
    assert.match(
      f.frontPage().join("\n"),
      /needs exactly one heading ## What runs today; found 2/,
    );
  }
  f.write("README.md", f.page().replace("## Next", "Next\n----"));
  assert.deepEqual(f.frontPage(), []);
  f.write(
    "README.md",
    f
      .page()
      .replace(
        "<!-- dotln-what-runs:end -->\n\n## Next",
        "**Next**\n--------\n\n<!-- dotln-what-runs:end -->",
      ),
  );
  assert.match(
    f.frontPage().join("\n"),
    /stand under ## What runs today and before the next heading/,
  );
});

// The guard's two-sided corpus: every row names a page shape and whether the
// guard refuses it. A row is added for each bypass or wrongly refused sentence
// found later, before the check changes, so a fix cannot reopen an earlier
// bypass or start refusing prose that earlier passed. DOTLN_FRONT_PAGE_CORPUS
// names an extra rows file, so a reviewer can try candidate rows through this
// same harness before proposing them.
test("front-page corpus: the What runs today guard refuses every recorded bypass and admits every recorded valid page, before and after formatting", async () => {
  // The page's shape is judged without Git: ownership has its own fixtures.
  const control = {
    schemaVersion: 1,
    page: "README.md",
    generatedBlocks: [
      {
        start: "<!-- DOTLN-RELEASE-BEGIN -->",
        end: "<!-- DOTLN-RELEASE-END -->",
      },
    ],
    whatRunsToday: {
      start: "<!-- dotln-what-runs:start -->",
      end: "<!-- dotln-what-runs:end -->",
      lineBudget: 3,
    },
  };
  const read = (file) => JSON.parse(readFileSync(file, "utf8")).rows;
  const rows = [
    ...read(new URL("./fixtures/front-page-corpus.json", import.meta.url)),
    ...(process.env.DOTLN_FRONT_PAGE_CORPUS
      ? read(process.env.DOTLN_FRONT_PAGE_CORPUS)
      : []),
  ];
  const shapes = ["line", "replace", "section", "append"];
  const keys = new Set([
    ...shapes,
    ...["name", "expect", "pattern", "source", "reason", "formatted"],
    ...["limit", "class", "note"],
  ]);
  const twelve = Array.from(
    { length: 12 },
    (_, index) => `Extra capability ${index + 1} runs.`,
  ).join("\n");
  const names = new Set();
  const pageOf = (row) => {
    let text = frontPageText({
      sentences: row.line === undefined ? undefined : [row.line, "Two run."],
    });
    if (row.replace) {
      assert.ok(text.includes(row.replace[0]), `${row.name}: replace target`);
      text = text.replace(row.replace[0], () => row.replace[1]);
    }
    if (row.section !== undefined) text += `\n${row.section}\n\n${twelve}\n`;
    if (row.append !== undefined) text += `\n${row.append}\n`;
    return text;
  };
  const wrong = [];
  for (const row of rows) {
    assert.ok(["refuse", "admit"].includes(row.expect), row.name);
    assert.ok(!names.has(row.name), `duplicate row name ${row.name}`);
    names.add(row.name);
    assert.deepEqual(
      Object.keys(row).filter((key) => !keys.has(key)),
      [],
      `${row.name}: unknown keys`,
    );
    assert.ok(
      shapes.some((key) => key in row),
      `${row.name}: no page shape`,
    );
    const source = pageOf(row);
    for (const text of row.formatted === false
      ? [source]
      : [
          source,
          await format(source, { parser: "markdown", proseWrap: "preserve" }),
        ]) {
      const found = frontPageShapeFindings(
        text,
        control,
        "README.md",
      ).failures.join("\n");
      const held =
        row.expect === "admit"
          ? found === ""
          : found !== "" && (!row.pattern || found.includes(row.pattern));
      if (!held)
        wrong.push(
          `${row.expect} ${JSON.stringify(row.name)}${text === source ? "" : " after formatting"}${row.pattern ? ` (pattern ${JSON.stringify(row.pattern)})` : ""}: ${found || "no failure"}`,
        );
    }
  }
  assert.deepEqual(wrong, []);
});

test("a counted line or heading is judged only from inline node types whose rendered text the check knows; a type a later parser adds is refused", () => {
  assert.deepEqual(
    proseText({
      type: "paragraph",
      children: [
        { type: "text", value: "Shown runs. " },
        { type: "futureNode", value: "Hidden runs." },
      ],
    }),
    { refused: "futureNode" },
  );
  assert.deepEqual(
    proseText({
      type: "heading",
      children: [
        { type: "emphasis", children: [{ type: "text", value: "Shown" }] },
        { type: "inlineCode", value: " runs" },
      ],
    }),
    { text: "Shown runs" },
  );
});

test("the page GitHub shows is the record's page, read through main's configuration and the order's header on main", (t) => {
  // Another README GitHub may show in its place is refused; a .github file
  // that is not a directory is not a README location and breaks nothing.
  const other = frontPageFixture(t, { declare: false });
  other.write(".github/README.md", "# Another page\n");
  assert.match(
    frontPageFindings(other.root).failures.join("\n"),
    /\.github\/README\.md: GitHub may show this README in place of README\.md/,
  );
  rmSync(join(other.root, ".github"), { recursive: true });
  other.write(".github", "not a directory\n");
  other.write("README", "Another page.\n");
  assert.match(
    frontPageFindings(other.root).failures.join("\n"),
    /^README: GitHub may show this README in place of README\.md/m,
  );
  // The page itself is a regular file, not a link to one.
  const linked = frontPageFixture(t, { declare: true });
  linked.write("docs/page-copy.md", linked.page());
  rmSync(join(linked.root, "README.md"));
  symlinkSync(
    join(linked.root, "docs/page-copy.md"),
    join(linked.root, "README.md"),
  );
  assert.match(
    linked.frontPage().join("\n"),
    /README\.md: the front page must be a regular file/,
  );
  // Moving the control root in the configuration on a branch moves nothing:
  // the record is read where main's configuration puts it.
  const moved = frontPageFixture(t, { declare: false });
  const config = JSON.parse(
    readFileSync(join(moved.root, "dotln.config.json"), "utf8"),
  );
  moved.write(
    "dotln.config.json",
    JSON.stringify({
      ...config,
      roots: { ...config.roots, control: "docs/elsewhere" },
    }),
  );
  moved.write("README.md", moved.page({ closing: "An appended sentence." }));
  assert.match(
    moved.frontPage().join("\n"),
    /README\.md: changed outside its generated blocks/,
  );
  // A malformed field on main refuses the change instead of breaking the check.
  const malformed = frontPageFixture(t, { declare: false });
  malformed.git("checkout", "-q", "main");
  malformed.write(
    "docs/work-orders/WO-999-fixture.md",
    malformed.order("**Front page:** README.md (the map only)"),
  );
  malformed.git("commit", "-qam", "malformed field");
  malformed.git("checkout", "-q", "wo-999");
  malformed.git("merge", "-q", "main");
  malformed.write(
    "README.md",
    malformed.page({ closing: "An appended sentence." }),
  );
  assert.match(
    malformed.frontPage().join("\n"),
    /field cannot be read: work order has a malformed \*\*Front page:\*\* line/,
  );
  // A generated block the record lists stands on the page.
  const missing = frontPageFixture(t, { declare: true });
  missing.write(
    "README.md",
    missing
      .page()
      .replace(
        /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*<!-- DOTLN-RELEASE-END -->\n/,
        "",
      ),
  );
  assert.match(
    missing.frontPage().join("\n"),
    /the generated block <!-- DOTLN-RELEASE-BEGIN --> listed in docs\/control\/front-page\.json at the merge base is not on the page/,
  );
});

test("main's record decides the page, the section and its budget: a front-page order cannot move the guard or slip a generated block under the section", (t) => {
  const path = "docs/control/front-page.json";
  // Moving the page to another file is refused, and the page is still judged.
  const moved = frontPageFixture(t, { declare: true });
  moved.write(path, JSON.stringify({ ...moved.record, page: "docs/front.md" }));
  moved.write("docs/front.md", moved.page());
  moved.write(
    "README.md",
    moved.page({
      sentences: ["One runs.", "Two runs.", "Three runs.", "Four runs."],
    }),
  );
  const found = frontPageFindings(moved.root).failures.join("\n");
  assert.match(
    found,
    /moves the front page from README\.md to docs\/front\.md/,
  );
  assert.match(found, /README\.md: "What runs today" holds 4 counted lines/);
  // A generated block the order adds may stand elsewhere, not under the section.
  const added = frontPageFixture(t, { declare: true });
  const block = {
    start: "<!-- capabilities:start -->",
    end: "<!-- capabilities:end -->",
  };
  added.write(
    path,
    JSON.stringify({
      ...added.record,
      generatedBlocks: [...added.record.generatedBlocks, block],
    }),
  );
  const thirteen = Array.from(
    { length: 13 },
    (_, index) => `Hidden ${index + 1} runs.`,
  ).join(" ");
  added.write(
    "README.md",
    added
      .page()
      .replace(
        "<!-- dotln-what-runs:end -->\n",
        `<!-- dotln-what-runs:end -->\n\n${block.start}\n${thirteen}\n${block.end}\n`,
      ),
  );
  assert.match(
    added.frontPage().join("\n"),
    /<!-- capabilities:start --> is a generated block main's record does not list/,
  );
  added.write(
    "README.md",
    added.page({
      closing: `A closing paragraph.\n\n${block.start}\nGenerated text.\n${block.end}`,
    }),
  );
  assert.deepEqual(added.frontPage(), []);
});

test("a page whose base carries no markers is being brought under guard: shape and budget are judged, the change is not compared", (t) => {
  const installing = frontPageFixture(t, {
    declare: false,
    basePage: "# Page\n\nAn older page with no markers at all.\n",
  });
  // The page on main lacks the markers, but this branch does not change
  // it: the finding is main's, reported as a notice, not refused here.
  assert.deepEqual(installing.frontPage(), []);
  assert.match(
    frontPageFindings(installing.root).notices.join("\n"),
    /needs exactly one ordered pair of marker lines.*\(on main; this branch does not change the page\)/,
  );
  installing.write(
    "README.md",
    installing.page({ closing: "Rewritten without a declaration." }),
  );
  assert.deepEqual(installing.frontPage(), []);
  // Without a merge base with main only the shape is judged, with a notice.
  const trunk = frontPageFixture(t, { declare: false, baseBranch: "trunk" });
  trunk.write("README.md", trunk.page({ closing: "An appended sentence." }));
  const result = trunk.check();
  assert.deepEqual(
    result.failures.filter((line) => /^README\.md/.test(line)),
    [],
  );
  assert.match(
    result.notices.join("\n"),
    /README\.md: no merge base with main; the front-page change is not compared/,
  );
});

test("the leading header's Front page field is read as typed data, never from criteria prose", () => {
  const header = (field) =>
    `# WO-999 — Fixture\n\n**Track:** machinery\n${field}\n**Objective:** Fixture README.md prose.\n\n**Acceptance criteria (all required)**\n\n1. README.md is rewritten.\n`;
  assert.equal(frontPageDeclaration(header(""), "wo"), null);
  assert.deepEqual(
    frontPageDeclaration(header("**Front page:** README.md"), "wo"),
    ["README.md"],
  );
  assert.deepEqual(
    frontPageDeclaration(
      header("**Front page:** README.md, docs/README.md"),
      "wo",
    ),
    ["README.md", "docs/README.md"],
  );
  assert.throws(
    () =>
      frontPageDeclaration(
        header("**Front page:** README.md\n**Front page:** README.md"),
        "wo",
      ),
    /duplicate/,
  );
  assert.throws(
    () => frontPageDeclaration(header("**Front page:**"), "wo"),
    /malformed/,
  );
  assert.throws(
    () => frontPageDeclaration(header("**Front page:** ../x.md"), "wo"),
    /malformed/,
  );
  // A field below the Objective is body text, not metadata.
  assert.equal(
    frontPageDeclaration(
      header("").replace("prose.\n", "prose.\n\n**Front page:** README.md\n"),
      "wo",
    ),
    null,
  );
});

test("the refusal is new: the document check at 08845c71 admits the same undeclared change", async (t) => {
  const historical = "08845c71";
  const repository = resolve(import.meta.dirname, "..");
  const present = spawnGit([
    "-C",
    repository,
    "cat-file",
    "-e",
    `${historical}^{commit}`,
  ]);
  if (present.status !== 0) {
    t.skip(`commit ${historical} is not in this clone`);
    return;
  }
  const f = frontPageFixture(t, { declare: false });
  f.write("README.md", f.page({ closing: "An appended sentence." }));
  assert.match(
    f.frontPage().join("\n"),
    /changed outside its generated blocks/,
  );
  // The historical scripts tree runs beside this checkout's installed
  // dependencies; nothing in this repository is written.
  const extracted = mkdtempSync(join(tmpdir(), "dotln-docs-check-historical-"));
  t.after(() => rmSync(extracted, { recursive: true, force: true }));
  const archive = join(extracted, "historical.tar");
  const archived = spawnGit(
    [
      "-C",
      repository,
      "archive",
      "--format=tar",
      "-o",
      archive,
      historical,
      "scripts",
      "packages/skeleton/src",
    ],
    { encoding: "utf8" },
  );
  assert.equal(archived.status, 0, archived.stderr);
  const untar = spawnSync("tar", ["-xf", archive, "-C", extracted], {
    encoding: "utf8",
  });
  assert.equal(untar.status, 0, untar.stderr);
  symlinkSync(
    join(repository, "node_modules"),
    join(extracted, "node_modules"),
  );
  const old = await import(
    pathToFileURL(join(extracted, "scripts/docs-check.mjs")).href
  );
  const before = old.checkDocs(f.root, {
    ceilings: f.ceilings,
    baseline: f.baseline,
  });
  assert.deepEqual(
    before.failures.filter((line) => /README\.md: /.test(line)),
    [],
    "the historical check judged nothing about the front page",
  );
});
