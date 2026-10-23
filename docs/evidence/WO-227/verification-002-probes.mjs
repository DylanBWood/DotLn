// VER-002 independent probes. Run from the repository root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-227/verification-002-probes.mjs
// Every fixture is synthetic and lives under the system temporary directory.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? process.cwd());
const load = (name) => import(pathToFileURL(join(root, name)).href);
const { checkOutwardArtifact } = await load("scripts/outward-lint.mjs");
const {
  absoluteBodyLinks,
  composeTargetBody,
  pullRequestBodyShapeFailures,
  withMeterBlockLast,
  METER_MARKERS,
} = await load("scripts/lib/github-body.mjs");
const { lintArtifacts } = await load("scripts/lib/target-publish.mjs");
const { checkLocalTerms, parseLocalTerms } = await load(
  "scripts/lib/terms.mjs",
);

const evidence = [];
const note = (name, meets, observed) =>
  evidence.push({ name, meets, observed });
const attempt = (fn) => {
  try {
    return { returned: fn() };
  } catch (error) {
    return { error: error.message };
  }
};
const fixture = mkdtempSync(join(tmpdir(), "wo227-ver002-"));
const write = (name, text) => {
  const file = join(fixture, name);
  mkdirSync(resolve(file, ".."), { recursive: true });
  writeFileSync(file, text);
};
const term = "cobaltwidget";
try {
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  write(
    "docs/control/outward-vocabulary.json",
    JSON.stringify({ types: ["feat", "fix", "docs"], reviewTerms: ["gem"] }),
  );
  const terms = (text) => write("docs/control/local/terms.txt", text);
  const compose = ({ files, baseTree = [], kitPaths = [] }) =>
    composeTargetBody({
      body: "# Change\n\nThe reviewed prose.",
      baseCommit: "a".repeat(40),
      headCommit: "b".repeat(40),
      files: files.map((path) => ({ path, added: 1, deleted: 0 })),
      baseTree: new Set(baseTree),
      kitPaths: new Set(kitPaths),
    });
  const publish = (composed) =>
    attempt(() =>
      lintArtifacts(fixture, [
        { kind: "branch", text: "fix/reviewed-change" },
        { kind: "pr-title", text: "fix: reviewed change" },
        {
          kind: "pr-body",
          text: composed.text,
          sections: composed.sections,
          rows: composed.rows,
        },
      ]),
    );

  // A refuse-mode private term in the path of a record the kit's records
  // commit wrote. The kit row skips every rule but the control-character
  // rule, so the term is published in the Change table; the same row as an
  // ordinary added path refuses, and the whole composed body (the base's
  // single pr-body lint) carries the refusal.
  terms(`refuse: ${term}\n`);
  const kitPath = `docs/work-orders/WO-006-${term}-sync.md`;
  const asKit = compose({ files: [kitPath], kitPaths: [kitPath] });
  const asAdded = compose({ files: [kitPath] });
  const kitResult = publish(asKit);
  const addedResult = publish(asAdded);
  const wholeBody = checkOutwardArtifact(fixture, {
    kind: "pr-body",
    text: asKit.text,
    target: true,
  });
  note(
    "N1 refuse-mode private term in a kit record path refuses",
    Boolean(kitResult.error),
    {
      kitRow: kitResult,
      addedRowControl: addedResult,
      wholeBodyLint: {
        status: wholeBody.status,
        rules: wholeBody.findings.map((row) => `${row.rule}:${row.mode ?? ""}`),
      },
      termInComposedBody: asKit.text.includes(term),
    },
  );
  // A path the target's base already held is the target's own vocabulary
  // (criterion 4's declared exemption): observed, not judged here.
  note("N1b existing base path with the same term is not reported", null, {
    existing: publish(
      compose({
        files: ["src/cobaltwidget.ts"],
        baseTree: ["src/cobaltwidget.ts"],
      }),
    ),
  });

  // Malformed marker: the checker names the line; the publish refusal.
  terms(`# comment\nrefuse:\n`);
  const malformedChecker = attempt(() => checkLocalTerms(fixture, []));
  const malformedPublish = publish(compose({ files: ["src/a.ts"] }));
  note(
    "N2 malformed marker refuses naming the line (checker)",
    /line 2/u.test(malformedChecker.error ?? ""),
    { checker: malformedChecker },
  );
  note(
    "N2b malformed marker at the publish surface",
    malformedPublish.error ? null : false,
    { publish: malformedPublish },
  );

  // Marker spellings: case, spacing, and an unmarked colon term.
  note(
    "N3 marker spellings",
    null,
    Object.fromEntries(
      [
        ...parseLocalTerms(
          `REFUSE: ${term}\nreview :alpha beta\nhost:8080\nrefuse gamma\n`,
        ),
      ].map(([key, mode]) => [key, mode]),
    ),
  );

  // Criterion 6: the order's own case, meter between heading and prose.
  const meter = (table) =>
    `${METER_MARKERS.begin}\n${table}\n${METER_MARKERS.end}`;
  const stored = `# WO-999\n\n${meter("| old |")}\n\nThe prose paragraph.  \nIts hard break.\n\n- a list item\n`;
  const moved = withMeterBlockLast(stored, "| new |");
  const expected = `# WO-999\n\nThe prose paragraph.  \nIts hard break.\n\n- a list item\n\n${meter("| new |")}\n`;
  note("N4 meter moves after the last prose block", moved === expected, {
    moved,
    shapeAfter: pullRequestBodyShapeFailures(moved),
    idempotent: withMeterBlockLast(moved, "| new |") === moved,
  });
  const shapes = {
    footnoteOnly: `# T\n\n[^1]: A footnote.\n\n${meter("| m |")}\n`,
    emptyLinkOnly: `# T\n\n[](https://example.com)\n\n${meter("| m |")}\n`,
    htmlBreakOnly: `# T\n\n<br>\n\n${meter("| m |")}\n`,
    linkTextProse: `# T\n\n[Read the change](https://example.com).\n\n${meter("| m |")}\n`,
    publishedGate: `# T\n\nProse.\n\n${meter("| m |")}\n\n<!-- dotln-product-gate:start -->\ngate\n<!-- dotln-product-gate:end -->\n`,
    gateBeforeMeter: `# T\n\nProse.\n\n<!-- dotln-product-gate:start -->\ngate\n<!-- dotln-product-gate:end -->\n\n${meter("| m |")}\n`,
  };
  const judged = Object.fromEntries(
    Object.entries(shapes).map(([name, text]) => [
      name,
      pullRequestBodyShapeFailures(text, {
        published: name === "publishedGate",
      }).map((row) => row.rule),
    ]),
  );
  note(
    "N5 shape variations",
    judged.footnoteOnly.includes("prose-before-meter") &&
      judged.emptyLinkOnly.includes("prose-before-meter") &&
      judged.htmlBreakOnly.includes("prose-before-meter") &&
      judged.linkTextProse.length === 0 &&
      judged.publishedGate.length === 0,
    judged,
  );

  // Criterion 7's renderer rewrites links through absoluteBodyLinks with a
  // map; an unmapped launchpad destination becomes its text in every form.
  const notes = [
    "See [the decisions](../../evidence/WO-006/decisions.md).",
    "See [the reference][ref].",
    "",
    "[ref]: ../../evidence/WO-006/decisions.md",
    "",
    "![diagram](../../evidence/WO-006/diagram.png)",
    "Kept: [the record](../../work-orders/WO-006-moved.md).",
  ].join("\n");
  const rendered = absoluteBodyLinks(notes, {
    from: "docs/final-reviews/WO-006/RELEASE-NOTES.md",
    repository: { selector: "github.com/example/target" },
    revision: "c".repeat(40),
    map: (path) =>
      path === "docs/work-orders/WO-006-moved.md"
        ? "records/work-orders/WO-006-moved.md"
        : null,
  });
  note(
    "N6 release-notes link rewriting",
    !/\]\(\.\.\//u.test(rendered) && !/^\[ref\]:/mu.test(rendered),
    { rendered },
  );

  // The target planning publication calls lintArtifacts with no
  // confirmation option (scripts/lib/target-planning.mjs) and its command
  // admits exactly five flags (scripts/refute-plan.mjs target-publish), so
  // the printed remedy names a flag that route refuses as usage.
  terms("");
  const planning = attempt(() =>
    lintArtifacts(fixture, [
      { kind: "branch", text: "docs/board-plan" },
      { kind: "commit", text: "docs: plan the gem board" },
      { kind: "pr-title", text: "docs: plan the gem board" },
      { kind: "pr-body", text: "# Plan\n\nThe gem board.\n" },
    ]),
  );
  note("N7 target planning publish names an unaccepted flag", null, {
    planning,
  });
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      workOrder: "WO-227",
      recordedAt: new Date().toISOString(),
      evidence,
    },
    null,
    2,
  ),
);
