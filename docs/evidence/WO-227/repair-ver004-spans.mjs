// Run the exemption-span cases of the VER-004 repair against the tree named
// by the first argument (the worktree, or a copy holding the pre-repair
// scripts/lib/outward-lint.mjs and scripts/lib/target-publish.mjs). Each case
// states the result the repaired rule requires: a part, a Change row or a
// display name lifts a rule only when the whole match lies in it.
// Run under scripts/harness.mjs bounded; prints one JSON document.
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? process.cwd());
const load = (path) => import(pathToFileURL(join(root, path)).href);
const { lintOutwardArtifact } = await load("scripts/lib/outward-lint.mjs");
const { composeTargetBody } = await load("scripts/lib/github-body.mjs");
const { lintArtifacts } = await load("scripts/lib/target-publish.mjs");

const reviewed = (result) =>
  result.findings
    .filter((finding) => finding.rule === "vocabulary.review")
    .map((finding) => finding.term);
const lint = (text, options) =>
  lintOutwardArtifact({
    kind: "release-body",
    text,
    localTerms: { status: "present" },
    ...options,
  });
const address = `https://github.com/fixture/target/blob/${"a".repeat(40)}/docs/evidence/WO-999/decisions.md`;
const linked = (rest, reviewTerms) => {
  const text = `See [the record](${address}${rest}).`;
  const start = text.indexOf(address);
  return reviewed(
    lint(text, {
      vocabulary: { types: ["fix"], reviewTerms },
      target: true,
      sections: [
        { name: "reviewed notes", start: 0, end: text.length },
        {
          name: "record link",
          start,
          end: start + address.length,
          exempt: ["identifier.launchpad", "vocabulary.review"],
        },
      ],
    }),
  );
};
const nested = (reviewTerms) => {
  const text = "Kit frame md launchpad tail.";
  const authored = text.indexOf("launchpad");
  return reviewed(
    lint(text, {
      vocabulary: { types: ["fix"], reviewTerms },
      sections: [
        {
          name: "kit frame",
          start: 0,
          end: text.length,
          exempt: ["vocabulary.review"],
        },
        {
          name: "authored",
          start: authored,
          end: authored + "launchpad".length,
        },
      ],
    }),
  );
};
const scratch = mkdtempSync(join(tmpdir(), "wo227-repair-ver004-"));
const write = (path, text) => {
  mkdirSync(dirname(join(scratch, path)), { recursive: true });
  writeFileSync(join(scratch, path), text);
};
write("dotln.config.json", JSON.stringify({ version: 1 }));
write(
  "docs/control/outward-vocabulary.json",
  JSON.stringify({ types: ["fix"], reviewTerms: ["0day", "mask"] }),
);
write("docs/control/local/terms.txt", "");
const rows = (deleted) => {
  const artifact = {
    kind: "pr-body",
    ...composeTargetBody({
      body: "# Result\n\nThe change is reviewed.\n",
      baseCommit: "a".repeat(40),
      headCommit: "b".repeat(40),
      files: [
        { path: "src/mask.ts", added: 3, deleted },
        { path: "day.md", added: 1, deleted: 0 },
      ],
      baseTree: new Set(["src/mask.ts"]),
    }),
  };
  const result = lintArtifacts(scratch, [artifact], { preview: true });
  return result.pending?.items ?? [];
};
const cases = [];
const check = (name, role, observe, expected) => {
  const observed = observe();
  cases.push({
    case: name,
    role,
    expected,
    observed,
    met: JSON.stringify(observed) === JSON.stringify(expected),
  });
};
try {
  check(
    "compound term from a written record path into an authored fragment",
    "finding",
    () => linked("#launchpad", ["md launchpad"]),
    ["md launchpad"],
  );
  check(
    "compound term from a written record path into an authored query",
    "finding",
    () => linked("?launchpad", ["md launchpad"]),
    ["md launchpad"],
  );
  check(
    "compound term from a lifting part into an authored part nested in it",
    "finding",
    () => nested(["md launchpad"]),
    ["md launchpad"],
  );
  check(
    "compound term from a base-held Change row into an added path",
    "finding",
    () => rows(0),
    [
      "pr-body: vocabulary.review: 0day (line 9, Change table, path src/mask.ts)",
    ],
  );
  check(
    "compound term running past a display name",
    "control",
    () =>
      reviewed(
        lint("DotLn Angular gems ship.", {
          vocabulary: {
            types: ["fix"],
            reviewTerms: ["DotLn", "angular gems"],
          },
          exempt: [{ start: 0, end: "DotLn Angular".length }],
        }),
      ),
    ["angular gems"],
  );
  check(
    "term wholly in a written record path",
    "control",
    () => linked("#plain", ["decisions"]),
    [],
  );
  check(
    "term wholly in an authored fragment",
    "control",
    () => linked("#launchpad", ["launchpad"]),
    ["launchpad"],
  );
  check(
    "term wholly in a lifting part around a nested authored part",
    "control",
    () => nested(["kit frame"]),
    [],
  );
  check(
    "base-held row's own word with no term joining the rows",
    "control",
    () => rows(1),
    [],
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
console.log(JSON.stringify({ cases }, null, 2));
process.exitCode = cases.every((row) => row.met) ? 0 : 1;
