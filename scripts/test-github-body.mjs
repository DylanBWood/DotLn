import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  assertGitHubBodyProfile,
  githubBodyProfileFailures,
  deliverableReady,
} from "./lib/github-body.mjs";
import { readinessFixture } from "./fixtures/target-publish/readiness.mjs";

const prettierConfig = JSON.parse(
  await readFile(new URL("../.prettierrc.json", import.meta.url), "utf8"),
);
await test("GitHub prose profile case 1", () => {
  assert.deepEqual(
    {
      printWidth: prettierConfig.printWidth,
      proseWrap: prettierConfig.proseWrap,
    },
    { printWidth: 80, proseWrap: "preserve" },
  );
});

const longParagraph =
  "This ordinary paragraph is intentionally longer than eighty characters so the reader, not the source author, owns its viewport wrapping.";
const longListItem =
  "- This list-item paragraph is intentionally longer than eighty characters and remains one physical source line for responsive rendering.";

await test("GitHub prose profile case 2", () => {
  assert.equal(githubBodyProfileFailures(`${longParagraph}\n`).length, 0);
});
await test("GitHub prose profile case 3", () => {
  assert.equal(githubBodyProfileFailures(`${longListItem}\n`).length, 0);
});

await test("GitHub prose profile case 4", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "This paragraph was wrapped by an author at a fixed column, even though it is one logical\nparagraph and should be left for the reader to wrap.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 5", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "- This list item was wrapped by an author at a fixed column, even though it is one logical\n  list-item paragraph and should be left for the reader to wrap.\n",
        "RELEASE-NOTES.md",
      ),
    /RELEASE-NOTES\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});

const structuralMarkdown = `# Heading

First paragraph.

Second paragraph.

- First distinct item.
- Second distinct item.

> Quoted line with an intentional hard break.  
> Next quoted line.

| Column A | Column B |
| -------- | -------- |
| value    | value    |

Column A | Column B
-------- | --------
value | value

Column A \\| literal | Column B
------------------- | --------
value | value

\`\`\`text
code stays
on its own lines
\`\`\`

    indented code

    - literal bullet in indented code
    next indented code line

- List item containing a nested fenced block.
    \`\`\`text
    nested code
    stays exempt
    \`\`\`
`;
await test("GitHub prose profile case 6", () => {
  assert.equal(githubBodyProfileFailures(structuralMarkdown).length, 0);
});

await test("GitHub prose profile case 7", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "- This list item starts on one line but its accidental continuation is hidden by indentation.\n    The continuation is still prose within the list item, not an indented code block.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 8", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "An even pair of trailing backslashes ends in a literal backslash, not a Markdown hard break.\\\\\nThis adjacent line is therefore still a prose soft wrap.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 9", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "This paragraph starts before a top-level pseudo-fence.\n    ```text\nThis is adjacent prose because a four-space fence cannot interrupt that paragraph.\n    ```\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 10", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "This paragraph was wrapped immediately before an autolink.\n<https://example.invalid/path>\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 11", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "> This quoted paragraph starts with an explicit quote marker.\nIts lazy continuation is still part of the quoted paragraph and must not hide a source wrap.\n",
        "RELEASE-NOTES.md",
      ),
    /RELEASE-NOTES\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 12", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "A prose line may contain A | B without becoming a table.\nThis adjacent prose line must still be detected as a source wrap.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});

// WO-064: the target pull-request generator is pure over its artifacts.
const { generateTargetPullRequest } = await import("./lib/github-body.mjs");
const { lintOutwardArtifact } = await import("./lib/outward-lint.mjs");
const vocabulary = JSON.parse(
  await readFile(
    new URL("../docs/control/outward-vocabulary.json", import.meta.url),
    "utf8",
  ),
);
const base = "a".repeat(40);
const head = "b".repeat(40);
const artifacts = (overrides = {}) => ({
  commitMessage: "feat(parser): accept empty input\n\nHost body line.\n",
  workOrder: {
    objective:
      "Accept\nempty input *without* @someone #12 <b>markup</b> | pipes.",
    acceptanceCriteria: ["Empty input returns []", "Other input is unchanged"],
    nonGoals: [],
  },
  tests: {
    before: { exitCode: 1, signal: null },
    after: { exitCode: null, signal: "SIGTERM" },
  },
  diff: {
    baseCommit: base,
    headCommit: head,
    files: [
      { path: "src/parse_input.ts", added: 3, deleted: 1 },
      { path: "assets/logo.png", added: null, deleted: null },
    ],
  },
  ...overrides,
});

await test("WO-064 target pull request: title, escaped contract, matrix and diff", () => {
  const { title, body } = generateTargetPullRequest(
    artifacts({
      matrix: {
        subjectRevision: head,
        rows: [
          { description: "Empty input returns []", status: "verified" },
          { description: "Other input is unchanged", status: "stale" },
        ],
      },
    }),
  );
  assert.equal(title, "feat(parser): accept empty input");
  assert.equal(
    `${body.split("## Deliverable-ready")[0].trimEnd()}\n`,
    `## Contract

**Objective:** Accept empty input &#42;without&#42; &#64;someone &#35;12 &#60;b&#62;markup&#60;/b&#62; &#124; pipes.

**Non-goals:** none declared

## Acceptance

| Criterion | Status |
| --- | --- |
| Empty input returns &#91;&#93; | verified |
| Other input is unchanged | stale |

Independent verification: acceptance matrix for ${head}: 1 verified, 0 failed, 1 stale, 0 incomplete.

Focused test observed by the host: exit 1 before the change, signal SIGTERM after it.

## Change

| Path | Added | Removed |
| --- | ---: | ---: |
| src/parse&#95;input.ts | 3 | 1 |
| assets/logo.png | binary | binary |

2 files changed from base ${base} to head ${head}.
`,
  );
  assert.equal(githubBodyProfileFailures(body).length, 0);
});

await test("WO-182 AC1/AC2: fourteen evidenced rows resolve in the fixture artifact store and render through outward lint", () => {
  const fixture = readinessFixture();
  const rows = deliverableReady(fixture.artifacts);
  assert.equal(rows.length, 14);
  assert.equal(new Set(rows.map((row) => row.id)).size, 14);
  for (const row of rows) {
    assert.equal(row.status, "evidenced", row.item);
    assert.ok(row.evidenceRefs.length > 0);
    for (const ref of row.evidenceRefs)
      assert.notEqual(fixture.resolveRef(ref), undefined, ref);
  }
  const { body } = generateTargetPullRequest({
    ...fixture.bodyInputs,
    readinessArtifacts: fixture.artifacts,
  });
  assert.match(
    body,
    /## Deliverable-ready\n\nDeliverable-ready: ready; every applicable item is evidenced\./u,
  );
  assert.equal(body.match(/\| evidenced \|/gu).length, 14);
  for (const row of rows)
    for (const ref of row.evidenceRefs)
      assert.ok(body.includes(ref.replaceAll("#", "&#35;")), ref);
  assert.equal(githubBodyProfileFailures(body).length, 0);
  assert.equal(
    lintOutwardArtifact({
      kind: "pr-body",
      text: body,
      vocabulary,
      localTerms: { status: "present" },
    }).status,
    "pass",
  );
});

await test("WO-182 AC1: missing baseline/review name their events; declared nonvisual stories are not applicable", () => {
  const { artifacts } = readinessFixture();
  artifacts.baseline = null;
  artifacts.review = null;
  const rows = deliverableReady(artifacts);
  assert.match(
    rows.find((row) => row.id === "baseline").reason,
    /BaselineWitnessed/u,
  );
  assert.match(
    rows.find((row) => row.id === "independent").reason,
    /ReviewCompleted/u,
  );
  assert.equal(rows.find((row) => row.id === "baseline").status, "absent");
  assert.equal(rows.find((row) => row.id === "independent").status, "absent");
  artifacts.verification.value.rows[0].criterion.claimType = "behavior";
  const visual = deliverableReady(artifacts).find((row) => row.id === "visual");
  assert.equal(visual.status, "not-applicable");
  assert.match(visual.reason, /no visual claims/u);
  artifacts.verification = null;
  assert.equal(
    deliverableReady(artifacts).find((row) => row.id === "visual").status,
    "absent",
  );
});

await test("WO-182 carries minor independent review findings into known items without widening scope", () => {
  const { artifacts, bodyInputs } = readinessFixture();
  artifacts.review.value.result.counts.should = 1;
  artifacts.review.value.result.findings = [
    {
      class: "review",
      severity: "should",
      observed: "A helper name could be clearer.",
      expected: "Use the existing naming convention.",
      evidenceRefs: ["diff", "file:src/view.ts"],
    },
  ];
  const before = structuredClone(artifacts);
  const { body } = generateTargetPullRequest({
    ...bodyInputs,
    readinessArtifacts: artifacts,
  });
  assert.match(
    body,
    /Known review items \(recorded without expanding scope\):/u,
  );
  assert.match(body, /\| should \| A helper name could be clearer\./u);
  assert.match(body, /Deliverable-ready: ready;/u);
  assert.deepEqual(artifacts, before);
});

await test("WO-182 refuses stale, failed, unbound, synthetic or self-reviewed evidence as readiness", () => {
  const mutations = [
    [
      "source-revision",
      (a) => {
        a.current.value.revision = "c".repeat(40);
      },
    ],
    [
      "ambiguity",
      (a) => {
        a.preparation.value.unresolvedMaterialAmbiguities.push("unanswered");
      },
    ],
    [
      "ambiguity",
      (a) => {
        a.preparation.value.contractHash = "c".repeat(64);
      },
    ],
    [
      "baseline",
      (a) => {
        a.baseline.value.capsule.subject.revision = "c".repeat(40);
      },
    ],
    [
      "baseline",
      (a) => {
        a.baseline.occurredAt = 11;
      },
    ],
    [
      "baseline",
      (a) => {
        a.baseline.value.outcome = "not-reproduced";
      },
    ],
    [
      "repo-native",
      (a) => {
        a.review.value.result.conventionsPath = null;
      },
    ],
    [
      "scope",
      (a) => {
        a.scope.value.surfaces = ["other.ts"];
      },
    ],
    [
      "checks",
      (a) => {
        delete a.preparation.value.checks.lint;
      },
    ],
    [
      "checks",
      (a) => {
        a.verification.value.evidence[1].hostTest.exitCode = 1;
      },
    ],
    [
      "live-behavior",
      (a) => {
        a.verification.value.evidence[0].source = "synthetic";
      },
    ],
    [
      "visual",
      (a) => {
        delete a.verification.value.evidence[3].witness;
      },
    ],
    [
      "acceptance",
      (a) => {
        a.verification.value.rows[0].status = "incomplete";
      },
    ],
    [
      "acceptance",
      (a) => {
        a.verification.value.rows[0].evaluations[0].stale = true;
      },
    ],
    [
      "acceptance",
      (a) => {
        a.verification.value.rows[0].criterion.description = "Other contract";
      },
    ],
    [
      "independent",
      (a) => {
        a.review.value.result.reviewerEpisodeId = "implementer";
      },
    ],
    [
      "independent",
      (a) => {
        a.review.value.result.verifierEpisodeIds = ["unrelated"];
      },
    ],
    [
      "final-diff",
      (a) => {
        a.review.value.subject.diff += "unreviewed";
      },
    ],
    [
      "final-diff",
      (a) => {
        a.review.value.result.counts.blocking = 1;
      },
    ],
    [
      "grounded-body",
      (a) => {
        a.body.value.diff.headCommit = "c".repeat(40);
      },
    ],
    [
      "monitoring",
      (a) => {
        a.preparation.value.monitoring.sourceDrift = "ignore";
      },
    ],
  ];
  for (const [id, mutate] of mutations) {
    const artifacts = structuredClone(readinessFixture().artifacts);
    mutate(artifacts);
    assert.equal(
      deliverableReady(artifacts).find((row) => row.id === id).status,
      "absent",
      id,
    );
  }
});

await test("WO-064 target pull request: refuses a matrix for another revision and missing artifacts", () => {
  assert.throws(
    () =>
      generateTargetPullRequest(
        artifacts({
          matrix: {
            subjectRevision: base,
            rows: [{ description: "x", status: "verified" }],
          },
        }),
      ),
    /acceptance matrix must describe the published head/,
  );
  assert.throws(
    () => generateTargetPullRequest(artifacts({ commitMessage: "\n" })),
    /commit subject is empty/,
  );
  assert.throws(
    () =>
      generateTargetPullRequest(
        artifacts({ diff: { baseCommit: base, headCommit: head, files: [] } }),
      ),
    /invalid diff summary/,
  );
  assert.throws(
    () =>
      generateTargetPullRequest(
        artifacts({ tests: { before: { exitCode: 1 }, after: {} } }),
      ),
    /after test outcome is missing/,
  );
});

await test("WO-064 target pull request: a same-head matrix speaks only for this WorkOrder's criteria", () => {
  const withRows =
    (rows, workOrder = artifacts().workOrder) =>
    () =>
      generateTargetPullRequest(
        artifacts({ workOrder, matrix: { subjectRevision: head, rows } }),
      );
  const refused =
    /acceptance matrix criteria must be the WorkOrder's acceptance criteria/;
  // VER-001 F1: an unrelated verified row at the published head.
  assert.throws(
    withRows(
      [{ description: "Unrelated behavior works", status: "verified" }],
      {
        ...artifacts().workOrder,
        acceptanceCriteria: ["Input is rejected safely"],
      },
    ),
    refused,
  );
  const empty = { description: "Empty input returns []", status: "verified" };
  const other = { description: "Other input is unchanged", status: "failed" };
  for (const rows of [
    [empty],
    [
      empty,
      other,
      { description: "Unrelated behavior works", status: "verified" },
    ],
    [empty, { ...other, description: "Other input is unchanged." }],
  ])
    assert.throws(withRows(rows), refused);
  // Correspondence is by criterion, so the table keeps the contract's order.
  const { body } = withRows([other, empty])();
  assert.match(
    body,
    /\| Criterion \| Status \|\n\| --- \| --- \|\n\| Empty input returns &#91;&#93; \| verified \|\n\| Other input is unchanged \| failed \|\n/u,
  );
});

await test("WO-064 target pull request: contract text naming launchpad vocabulary is refused by the lint", () => {
  const { body } = generateTargetPullRequest(
    artifacts({
      workOrder: {
        ...artifacts().workOrder,
        objective: "Mirror the DotLn launchpad layout.",
      },
    }),
  );
  const result = lintOutwardArtifact({
    kind: "pr-body",
    text: body,
    vocabulary,
    localTerms: { status: "present" },
  });
  assert.equal(result.status, "refused");
  assert.deepEqual(
    result.findings.map((finding) => [finding.rule, finding.term]),
    [
      ["vocabulary.launchpad", "DotLn"],
      ["vocabulary.launchpad", "launchpad"],
    ],
  );
});
