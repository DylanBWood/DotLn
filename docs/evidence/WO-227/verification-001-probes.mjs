import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? process.cwd());
const load = (name) => import(pathToFileURL(join(root, name)).href);
const { lintOutwardArtifact, validateOutwardVocabulary } = await load(
  "scripts/lib/outward-lint.mjs",
);
const { checkOutwardArtifact } = await load("scripts/outward-lint.mjs");
const { composeTargetBody, pullRequestBodyShapeFailures, withMeterBlockLast } =
  await load("scripts/lib/github-body.mjs");
const { lintArtifacts, reviewConfirmation } = await load(
  "scripts/lib/target-publish.mjs",
);
const { digestOf } = await load("scripts/lib/confirm-terms.mjs");
const { targetOrderPathAdvisories } = await load(
  "scripts/lib/plan-receipts.mjs",
);
const { targetReleaseNotesSource } = await load(
  "scripts/lib/release-notes.mjs",
);
const { coveringGateCheck } = await load("scripts/lib/gate-reuse.mjs");
const evidence = [];
const note = (name, meets, observed) =>
  evidence.push({ name, meets, observed });
const failure = (fn) => {
  try {
    return { returned: fn() };
  } catch (error) {
    return { error: error.message };
  }
};
const policy = {
  types: ["feat", "fix", "docs"],
  reviewTerms: ["launchpad", "mask", "gem"],
};
const lint = (kind, text, options = {}) =>
  lintOutwardArtifact({
    kind,
    text,
    vocabulary: policy,
    localTerms: { status: "present" },
    target: true,
    ...options,
  });
const fixture = mkdtempSync(join(tmpdir(), "wo227-verifier-"));
const write = (name, text) => {
  const file = join(fixture, name);
  mkdirSync(resolve(file, ".."), { recursive: true });
  writeFileSync(file, text);
};
try {
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  write("docs/control/outward-vocabulary.json", JSON.stringify(policy));
  write("docs/control/local/terms.txt", "");
  const forms = [
    "WO-006",
    "WO-006-D018",
    "FUP-280abd447f789958",
    "VER-001",
    "FINAL-001",
    "REVIEW-007",
    "WS-001",
  ];
  const identifiers = [];
  for (const form of forms)
    for (const kind of ["branch", "commit", "pr-title", "pr-body"]) {
      const text =
        kind === "branch"
          ? `fix/${form.toLowerCase()}`
          : kind === "pr-body"
            ? `# Change\n\n${form} and ${form}.\n`
            : `fix: handle ${form}`;
      const findings = lint(kind, text).findings.filter(
        (row) => row.rule === "identifier.launchpad",
      );
      identifiers.push({
        form,
        kind,
        matches: findings.length,
        spansValid: findings.every(
          (row) =>
            text.slice(row.span.start, row.span.end).toLowerCase() ===
            form.toLowerCase(),
        ),
      });
    }
  note(
    "C1 repeated identifiers across four kinds",
    identifiers.every(
      (row) =>
        row.matches === (row.kind === "pr-body" ? 2 : 1) && row.spansValid,
    ),
    identifiers,
  );
  const controls = [
    lint("commit", "docs: record reviewed change and validation"),
    lint("pr-body", "Closes #4"),
    lint("pr-body", "# WO-006", { target: false }),
  ];
  note(
    "C1 admitted controls",
    controls.every((row) => row.status === "pass"),
    controls.map((row) => row.status),
  );
  const rendered = lint(
    "pr-body",
    "# Result\n\nＷＯ-００６ and WO-<b>006</b>.\n",
  );
  note(
    "C1 compatibility characters and rendered markup",
    rendered.findings.filter((row) => row.rule === "identifier.launchpad")
      .length === 2,
    rendered.findings,
  );
  const review = lint(
    "pr-body",
    "# Result\n\nA launchpad and another launchpad.\n",
    { sections: [{ name: "reviewed prose", start: 0, end: 200 }] },
  );
  note(
    "C2 repeated public review words",
    review.status === "review" &&
      review.checks.review.matches === 2 &&
      review.findings.every((row) => row.section === "reviewed prose"),
    review,
  );
  const alias = validateOutwardVocabulary({ types: ["fix"], terms: [] });
  const both = failure(() =>
    validateOutwardVocabulary({ types: ["fix"], terms: [], reviewTerms: [] }),
  );
  note(
    "C2 empty and alias vocabulary",
    alias.reviewTerms.length === 0 &&
      alias.advisories.length === 1 &&
      !!both.error,
    {
      alias,
      both,
      empty: validateOutwardVocabulary({ types: ["fix"], reviewTerms: [] }),
    },
  );
  const composed = composeTargetBody({
    body: "# Result\n\nPreserve the launchpad board.\n",
    baseCommit: "a".repeat(40),
    headCommit: "b".repeat(40),
    files: [
      { path: "fixtures/launchpad-board.json", added: 1, deleted: 0 },
      { path: "src/mask.ts", added: 1, deleted: 1 },
    ],
    baseTree: new Set(["src/mask.ts"]),
  });
  const artifact = { kind: "pr-body", ...composed };
  const pending = failure(() => lintArtifacts(fixture, [artifact]));
  const stale = failure(() =>
    lintArtifacts(fixture, [artifact], {
      confirmTerms: digestOf("another body"),
    }),
  );
  const confirmed = lintArtifacts(fixture, [artifact], {
    confirmTerms: digestOf(composed.text),
  });
  note(
    "C2/C4 body confirmation and base-path exclusion",
    !!pending.error?.includes("2 review items") &&
      !pending.error?.includes("mask") &&
      !!stale.error?.includes("another body") &&
      confirmed.review.matches === 2,
    { pending, stale, confirmed },
  );
  const leakedPath = composeTargetBody({
    body: "# Result\n\nPreserve the board.\n",
    baseCommit: "a".repeat(40),
    headCommit: "b".repeat(40),
    files: [{ path: "docs/WO-006-notes.md", added: 1, deleted: 0 }],
  });
  const identifierPath = failure(() =>
    lintArtifacts(fixture, [{ kind: "pr-body", ...leakedPath }]),
  );
  note(
    "C4 added identifier path",
    !!identifierPath.error?.includes("identifier.launchpad: WO-006") &&
      !!identifierPath.error?.includes(
        "Change table, path docs/WO-006-notes.md",
      ),
    identifierPath,
  );
  write("docs/control/local/terms.txt", "refuse: cobaltwidget\n");
  const privateProse = failure(() =>
    lintArtifacts(fixture, [
      { kind: "pr-body", text: "# Result\n\nA cobaltwidget.\n" },
    ]),
  );
  note(
    "C3 private prose diagnostics redact the synthetic term",
    !!privateProse.error?.includes("vocabulary.local: refuse") &&
      !privateProse.error.includes("cobaltwidget"),
    privateProse,
  );
  const privatePath = composeTargetBody({
    body: "# Result\n\nPreserve the board.\n",
    baseCommit: "a".repeat(40),
    headCommit: "b".repeat(40),
    files: [{ path: "src/cobaltwidget.ts", added: 1, deleted: 0 }],
  });
  const privatePathResult = failure(() =>
    lintArtifacts(fixture, [{ kind: "pr-body", ...privatePath }]),
  );
  note(
    "F1 C3 private added-path diagnostics must redact the synthetic term",
    !!privatePathResult.error &&
      !privatePathResult.error.includes("cobaltwidget"),
    privatePathResult,
  );
  write("docs/control/local/terms.txt", "cobaltwidget\n");
  const privatePathReview = failure(() =>
    lintArtifacts(fixture, [{ kind: "pr-body", ...privatePath }]),
  );
  note(
    "F1 C3 private review-path diagnostics must redact the synthetic term",
    !!privatePathReview.error &&
      !privatePathReview.error.includes("cobaltwidget"),
    privatePathReview,
  );
  const twice = "# Result\n\nA cobaltwidget and another cobaltwidget.\n";
  const localTwice = checkOutwardArtifact(fixture, {
    kind: "pr-body",
    text: twice,
    target: true,
  });
  const twiceConfirmation = lintArtifacts(
    fixture,
    [{ kind: "pr-body", text: twice }],
    { confirmTerms: digestOf(twice) },
  );
  note("private repeated-term count observation", null, {
    localFindings: localTwice.findings,
    confirmation: twiceConfirmation,
  });
  write("docs/control/local/terms.txt", "# An intentionally empty list.\n");
  const empty = checkOutwardArtifact(fixture, {
    kind: "pr-body",
    text: "Ordinary text.",
    target: true,
  });
  note(
    "C3 present empty list",
    empty.status === "pass" && empty.checks.localTerms.terms === 0,
    empty,
  );
  write("docs/control/local/terms.txt", "refuse:\n");
  const malformed = checkOutwardArtifact(fixture, {
    kind: "pr-body",
    text: "Ordinary text.",
    target: true,
  });
  note(
    "C3 malformed marker refuses",
    malformed.status === "refused",
    malformed,
  );
  rmSync(join(fixture, "docs/control/local/terms.txt"));
  const absent = failure(() =>
    lintArtifacts(fixture, [{ kind: "pr-body", text: "Ordinary text." }]),
  );
  note(
    "C3 absent list refuses",
    !!absent.error?.includes("local-terms list absent"),
    absent,
  );
  const order = (target) =>
    `# WO-999 — Fixture\n\n${target ? `**Repository:** target @ ${"a".repeat(40)}\n\n` : ""}**Execution plan:**\n\n1. Edit \`fixtures/gem-board.json\`.\n2. Read \`fixtures/gem-board.json\` again.\n\n**Evidence gate:** fixture.\n`;
  write("docs/work-orders/WO-999-fixture.md", order(true));
  const rows = [
    { id: "WO-999", section: "Open", authorityLink: "WO-999-fixture.md" },
  ];
  const targetAdvisories = targetOrderPathAdvisories(fixture, rows);
  write("docs/work-orders/WO-999-fixture.md", order(false));
  const launchpadAdvisories = targetOrderPathAdvisories(fixture, rows);
  note(
    "C5 target-only deduplicated path advisory",
    targetAdvisories.length === 1 &&
      targetAdvisories[0].includes("gem") &&
      launchpadAdvisories.length === 0,
    { targetAdvisories, launchpadAdvisories },
  );
  const meter =
    "<!-- dotln-process-meter:start -->\nMeter.\n<!-- dotln-process-meter:end -->";
  const gate =
    "<!-- dotln-product-gate:start -->\nPassed.\n<!-- dotln-product-gate:end -->";
  const good = `# Result\n\nA paragraph.\n\n${meter}\n`;
  note(
    "C6 ordinary structural controls",
    pullRequestBodyShapeFailures(good).length === 0 &&
      pullRequestBodyShapeFailures(`${good}\n${gate}\n`, { published: true })
        .length === 0 &&
      pullRequestBodyShapeFailures(`# Result\n\n${meter}\n`).some(
        (row) => row.rule === "prose-before-meter",
      ) &&
      pullRequestBodyShapeFailures(`${good}\nLater prose.\n`).some(
        (row) => row.rule === "meter-last",
      ),
    {
      good: pullRequestBodyShapeFailures(good),
      noProse: pullRequestBodyShapeFailures(`# Result\n\n${meter}\n`),
    },
  );
  for (const [name, nonProse] of [
    ["HTML comment", "<!-- reviewer placeholder -->"],
    ["empty code fence", "```\n```"],
    ["horizontal rule", "---"],
    ["table only", "| Field | Value |\n| --- | --- |\n| One | Two |"],
  ]) {
    const failures = pullRequestBodyShapeFailures(
      `# Result\n\n${nonProse}\n\n${meter}\n`,
    );
    note(
      `F2 C6 ${name} is not a prose paragraph`,
      failures.some((row) => row.rule === "prose-before-meter"),
      failures,
    );
  }
  const moved = withMeterBlockLast(
    `# Result\n\n${meter}\n\nFirst.\n\nLast.  \n`,
    "Meter.",
  );
  note(
    "C6 relocation preserves prose hard breaks",
    moved === `# Result\n\nFirst.\n\nLast.  \n\n${meter}\n`,
    moved,
  );
  note(
    "C7 release source controls",
    targetReleaseNotesSource("# Order\n", "order") === "objective" &&
      targetReleaseNotesSource(
        "**Target release notes:** reviewed\n",
        "order",
      ) === "reviewed" &&
      !!failure(() =>
        targetReleaseNotesSource(
          "**Target release notes:** invalid\n",
          "order",
        ),
      ).error,
    null,
  );
  const coverage = await coveringGateCheck(root, "npm test", [
    "outward-lint",
    "target-publish",
    "github-body",
    "plan-refutation",
    "release",
    "worktree",
    "target-worktree",
    "launchpad",
    "configuration-root",
  ]);
  const row = coverage.row;
  note(
    "C9 complete review evidence at current identity",
    !!row && row.exitCode === 0,
    {
      codeIdentity: coverage.codeIdentity,
      location: coverage.location,
      missing: coverage.missing,
      row: row && {
        checkId: row.checkId,
        codeIdentity: row.codeIdentity,
        recordedAt: row.recordedAt,
        durationMs: row.durationMs,
        exitCode: row.exitCode,
        requiredSuites: row.requiredSuites,
        evidenceRef: row.evidenceRef,
      },
    },
  );
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
