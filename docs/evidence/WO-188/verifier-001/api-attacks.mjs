import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
const root = process.cwd();
const mod = (p) => import(pathToFileURL(join(root, p)));
const { parsers } = await mod("node_modules/prettier/plugins/markdown.mjs");
const { absoluteBodyLinks, relativeLinkFailures, githubBodyProfileFailures } =
  await mod("scripts/lib/github-body.mjs");
const { commentLabelFindings } = await mod("scripts/lib/comment-labels.mjs");
const { feedbackSourcesComments } = await mod(
  "packages/skeleton/dist/src/feedback-source-comments.js",
);
const { homePathFindings, operatorWordFindings, operatorQuoteFailures } =
  await mod("scripts/docs-check.mjs");
const { decisionsConflicted, integrationPreparationRefusal } = await mod(
  "scripts/lib/release-preparation.mjs",
);
const { manifestWorkOrders } = await mod("scripts/lib/release-tags.mjs");
const { gateCodeIdentity, gateTreeHash, findGateCheck } = await mod(
  "scripts/lib/gate-evidence.mjs",
);
let failed = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log(JSON.stringify({ probe: name, outcome: "pass" }));
  } catch (e) {
    failed++;
    console.log(
      JSON.stringify({ probe: name, outcome: "fail", expected: e.message }),
    );
  }
};
function* nodes(n) {
  yield n;
  for (const x of n.children ?? []) yield* nodes(x);
}
for (const source of [
  "[plain](../evidence/WO-188/decisions.md)",
  "[nested [label]](../evidence/WO-188/decisions.md)",
  "[file](file(1).md)",
]) {
  const links = [...nodes(parsers.markdown.parse(source))]
    .filter((x) => x.type === "link")
    .map((x) => x.url);
  const rewritten = absoluteBodyLinks(source, {
    from: "docs/final-reviews/WO-188/PR.md",
    repository: { host: "github.com", selector: "github.com/public/fixture" },
    revision: "reviewed",
  });
  const profile = githubBodyProfileFailures(source, { links: true });
  console.log(
    JSON.stringify({
      probe: "link-syntax",
      source,
      parsedLinks: links,
      profile,
      rewritten,
    }),
  );
  check("relative body link refused " + source, () =>
    assert.ok(
      profile.some((x) => x.kind === "relative-link"),
      "criterion 24: a rendered relative Markdown link must fail the body profile",
    ),
  );
}
for (const [source, kind] of [
  ["/**\n * WO-188 begins a JSDoc body.\n */", "order-lead"],
  ["// Explains an old failure from FINAL-123 finding 9.", "finding-label"],
  ["// A receipt follows finding 9 of VER-123.", "finding-label"],
  ["// Explanation relies on D999.", "decision-number"],
  ["// The explanation refers to WO-188 D030.", "none"],
  ['const x="// VER-001 F1"; // A normal explanation.', "none"],
  ["// \n// WO-188 follows an empty row.", "order-lead"],
]) {
  const bodies = feedbackSourcesComments([
    { path: "scripts/probe.mjs", source },
  ])[0];
  const found = commentLabelFindings("scripts/probe.mjs", source, bodies);
  check("comment " + kind, () =>
    kind === "none"
      ? assert.equal(found.length, 0)
      : assert.ok(
          found.some((x) => x.kind === kind),
          JSON.stringify(found),
        ),
  );
}
check("malformed changed-file values", () => {
  for (const v of ["bad", 12, {}, null, [null, 1, {}]])
    assert.deepEqual(manifestWorkOrders({ notes: { changedFiles: v } }), []);
});
const temp = mkdtempSync(join(tmpdir(), "dotln-verifier-api-"));
const git = (...args) =>
  execFileSync("git", ["-C", temp, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
try {
  git("init", "-q");
  mkdirSync(join(temp, "docs/work-orders"), { recursive: true });
  mkdirSync(join(temp, "docs/evidence/WO-999"), { recursive: true });
  writeFileSync(
    join(temp, "docs/work-orders/WO-999-probe.md"),
    '# WO-999\n\n**Nomination provenance:** operator said "synthetic alpha".\n\n**Provenance:** operator said "synthetic beta".\n',
  );
  const provenance = operatorWordFindings(temp).filter((x) =>
    x.file.includes("WO-999-probe"),
  );
  check("two provenance keys", () =>
    assert.deepEqual(
      provenance.map((x) => x.record),
      ["provenance", "provenance-2"],
    ),
  );
  check("typed quotation validation", () => {
    assert.equal(
      operatorQuoteFailures([
        {
          id: "WO-999-D001",
          path: "docs/evidence/WO-999/decisions.md",
          operatorQuote: { text: "synthetic" },
        },
      ]).length,
      1,
    );
    assert.equal(
      operatorQuoteFailures([
        {
          operatorQuote: {
            text: "synthetic",
            captureSha256: "sha256:" + "a".repeat(64),
          },
        },
      ]).length,
      0,
    );
  });
  writeFileSync(
    join(temp, "docs/probe.md"),
    "# Probe\n\n/Users/synthetic-fixture/project/file.md\n",
  );
  git("add", "docs/probe.md");
  check("new tracked home path", () =>
    assert.deepEqual(
      homePathFindings(temp).map((x) => [x.file, x.line]),
      [["docs/probe.md", 3]],
    ),
  );
  for (const text of [
    "<<<<<<< head\nrest\n=======\n",
    ">>>>>>> branch\n",
    "||||||| base\n",
  ])
    check("conflict marker " + text.split("\n")[0], () =>
      assert.ok(
        decisionsConflicted(temp, "docs/evidence/WO-999/decisions.md", text),
      ),
    );
  check("setext is not conflict", () =>
    assert.equal(
      decisionsConflicted(
        temp,
        "docs/evidence/WO-999/decisions.md",
        "Title\n=======\n",
      ),
      false,
    ),
  );
  writeFileSync(
    join(temp, "docs/evidence/WO-999/decisions.md"),
    "<!-- integration refs/checkpoint/probe -->\n",
  );
  check("stub preparation refusal", () =>
    assert.match(
      integrationPreparationRefusal(temp, "WO-999", {
        checkpointRef: "refs/checkpoint/probe",
      }),
      /stub/,
    ),
  );
  check("saved outcome preparation refusal", () =>
    assert.match(
      integrationPreparationRefusal(temp, "WO-999", {
        checkpointRef: "refs/checkpoint/other",
        release: "saved outcome",
      }),
      /saved release/,
    ),
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
const identity = gateCodeIdentity(root),
  gate = findGateCheck(root, "npm test", gateTreeHash(root));
console.log(
  JSON.stringify({
    probe: "current-review-gate",
    identity,
    gate: gate && {
      checkId: gate.checkId,
      codeIdentity: gate.codeIdentity,
      recordedAt: gate.recordedAt,
      durationMs: gate.durationMs,
      exitCode: gate.exitCode,
      coverage: gate.coverage,
      selection: gate.selection,
      evidenceRef: gate.evidenceRef,
    },
  }),
);
check("executor product gate covers current identity", () => {
  assert.ok(gate);
  assert.equal(gate.codeIdentity, identity);
  assert.equal(gate.exitCode, 0);
});
console.log(JSON.stringify({ completed: true, failed }));
process.exitCode = failed ? 1 : 0;
