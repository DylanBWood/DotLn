// Independent VER-004 attacks; never writes the implementation under review.
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { format } from "prettier";
import {
  checkDocs,
  frontPageShapeFindings,
  frontPageFindings,
} from "../../../../scripts/docs-check.mjs";

const subject = resolve(import.meta.dirname, "../../../..");
const record = JSON.parse(
  readFileSync(join(subject, "docs/control/front-page.json"), "utf8"),
);
const control = {
  ...record,
  whatRunsToday: { ...record.whatRunsToday, lineBudget: 3 },
};
const { start, end } = control.whatRunsToday;
const page = (lines = ["The kernel replays.", "The skeleton runs."]) =>
  `# Page\n\n## What runs today\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn \`v0.1.0\`.\n<!-- DOTLN-RELEASE-END -->\n\n${start}\n${lines.join("\n")}\n${end}\n\n## Next\n\nA closing paragraph.\n`;
const cases = [
  [
    "exact budget with styled, linked and quoted sentences",
    false,
    page([
      "**The kernel** replays.",
      "The [guide](https://example.invalid/guide) explains it.",
      "The expression `a < b` compares values.",
    ]),
  ],
  ["CRLF remains a valid line ending", false, page().replaceAll("\n", "\r\n")],
  [
    "escaped HTML bracket in prose",
    false,
    page(["The literal \\<h2> is text.", "The skeleton runs."]),
  ],
  [
    "heading mention and contents link are ordinary prose",
    false,
    page() +
      "\nThe What runs today section describes the software.\n\n[What runs today](#what-runs-today)\n",
  ],
  [
    "closing heading with linked text",
    false,
    page().replace("## Next", "## [Next](https://example.invalid/next)"),
  ],
  ["empty section within budget", false, page([])],
  [
    "one extra sentence at the exact boundary",
    true,
    page(["One runs.", "Two runs.", "Three runs.", "Four runs."]),
  ],
  [
    "strong text and numeric note do not hide a sentence",
    true,
    page(["**One runs.**[12] Another runs.", "The skeleton runs."]),
  ],
  [
    "Greek sentence after a curly quote",
    true,
    page(["“One runs.” Βήτα runs.", "The skeleton runs."]),
  ],
  [
    "two escaped backticks do not mask two sentences",
    true,
    page([
      "One runs \\`Hidden runs. Another runs.\\` here.",
      "The skeleton runs.",
    ]),
  ],
  [
    "inline code ending in a stop followed by prose",
    true,
    page(["`One runs.` Two run.", "The skeleton runs."]),
  ],
  ["code span over a line break", true, page(["The `code", "spans` lines."])],
  [
    "literal HTML following two backslashes",
    true,
    page(["One runs \\\\<em>here</em>.", "The skeleton runs."]),
  ],
  [
    "template node inside an image label",
    true,
    page([
      "One runs ![{{ Hidden runs. More runs. }}](https://example.invalid/a.png).",
      "The skeleton runs.",
    ]),
  ],
  [
    "template text under another section",
    true,
    page() + "\n{{ A separate tag }}\n",
  ],
  [
    "numeric bidi reference outside the counted section",
    true,
    page() + "\nA visible &#x202E; control.\n",
  ],
  [
    "control character in a reference definition",
    true,
    page() + "\n[label]:\u000C https://example.invalid\n",
  ],
  [
    "markers copied inside a fenced code block",
    true,
    page()
      .replace(start, "```text\n" + start)
      .replace(end, end + "\n```"),
  ],
  [
    "styled heading with decoded word separators",
    true,
    page() + "\n## **What&#32;runs&#32;today**\n\nExtra runs.\n",
  ],
  [
    "level-six namesake in a list",
    true,
    page() + "\n- ###### _What runs today_\n\nExtra runs.\n",
  ],
  [
    "duplicate heading through a sigma-folded reference",
    true,
    page() +
      "\n## [What runs today][Σ]\n\nExtra runs.\n\n[ς]: https://example.invalid\n",
  ],
  [
    "closing heading with only an image",
    true,
    page().replace("## Next", "## ![Next](https://example.invalid/a.png)"),
  ],
  [
    "receipt in a link destination",
    true,
    page() + "\n[Evidence](/docs/evidence/WO-189/README.md)\n",
  ],
  [
    "receipt assembled across emphasis",
    true,
    page() + "\nWO-**189** is a receipt.\n",
  ],
  [
    "sentence appended between the closing marker and next heading",
    true,
    page().replace(end, end + "\n\nExtra runs."),
  ],
  [
    "registered release block with another visible sentence",
    true,
    page().replace(
      "This source prepares DotLn `v0.1.0`.",
      "This source prepares DotLn `v0.1.0`.\nExtra runs.",
    ),
  ],
];
const shapes = [];
for (const [name, expectation, text] of cases) {
  const formatted = await format(text, {
    parser: "markdown",
    proseWrap: "preserve",
  });
  const before = frontPageShapeFindings(text, control, "README.md").failures;
  const after = frontPageShapeFindings(
    formatted,
    control,
    "README.md",
  ).failures;
  shapes.push({
    name,
    expectation,
    failures: before,
    formattedFailures: after,
    source: text,
  });
}
const root = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-ver004-independent-")),
);
const write = (file, text) => {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), text);
};
const git = (...args) => {
  const result = spawnSync(
    "git",
    [
      "-C",
      root,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      ...args,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};
const ceilings = { schemaVersion: 1, documents: {} };
const baseline = { schemaVersion: 1, products: {}, dispatches: {}, links: [] };
const ownership = [];
try {
  git("init", "-q", "-b", "main");
  if (realpathSync(git("rev-parse", "--show-toplevel")) !== root)
    throw new Error("fixture root mismatch");
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  mkdirSync(join(root, "docs/product"), { recursive: true });
  write("docs/control/front-page.json", JSON.stringify(control));
  write(
    "docs/work-orders/WO-998-probe.md",
    "# WO-998 — Ordinary probe\n\n**Track:** machinery\n**Objective:** Probe.\n",
  );
  write(
    "docs/work-orders/WO-999-probe.md",
    "# WO-999 — Declared probe\n\n**Track:** machinery\n**Front page:** README.md\n**Objective:** Probe.\n",
  );
  write("README.md", page());
  git("add", "-A");
  git("commit", "-qm", "public synthetic baseline");
  git("checkout", "-qb", "wo-998");
  const judge = (name, expectation, text) => {
    write("README.md", text);
    const result = checkDocs(root, {
      ceilings,
      baseline,
      files: ["README.md"],
    });
    ownership.push({ name, expectation, failures: result.failures });
  };
  judge("undeclared order leaves the page alone", false, page());
  judge(
    "undeclared order changes only the generated version",
    false,
    page().replace("v0.1.0", "v0.1.1"),
  );
  judge(
    "undeclared order adds an ordinary capability",
    true,
    page([
      "The kernel replays.",
      "The skeleton runs.",
      "Another capability runs.",
    ]),
  );
  write(
    "docs/work-orders/WO-998-probe.md",
    "# WO-998 — Ordinary probe\n\n**Front page:** README.md\n**Objective:** Probe.\n",
  );
  judge(
    "working-tree declaration grants no permission",
    true,
    page([
      "The kernel replays.",
      "The skeleton runs.",
      "Another capability runs.",
    ]),
  );
  git("checkout", "-qb", "wo-999");
  judge(
    "declared order adds a sentence within main's budget",
    false,
    page([
      "The kernel replays.",
      "The skeleton runs.",
      "Another capability runs.",
    ]),
  );
  write(
    "docs/control/front-page.json",
    JSON.stringify({
      ...control,
      whatRunsToday: { ...control.whatRunsToday, lineBudget: 50 },
    }),
  );
  judge(
    "declared order cannot raise the budget that judges it",
    true,
    page(["One runs.", "Two runs.", "Three runs.", "Four runs."]),
  );
  write("docs/control/front-page.json", JSON.stringify(control));
  write(
    "dotln.config.json",
    JSON.stringify({ version: 1, roots: { control: "docs/other" } }),
  );
  write(
    "docs/other/front-page.json",
    JSON.stringify({
      ...control,
      whatRunsToday: { ...control.whatRunsToday, lineBudget: 50 },
    }),
  );
  write(
    "README.md",
    page(["One runs.", "Two runs.", "Three runs.", "Four runs."]),
  );
  ownership.push({
    name: "working configuration cannot relocate main's governing record",
    expectation: true,
    failures: frontPageFindings(root).failures,
  });
} finally {
  rmSync(root, { recursive: true, force: true });
}
const mismatches = [...shapes, ...ownership]
  .filter(
    (row) =>
      row.expectation !== Boolean(row.failures.length) ||
      (row.formattedFailures &&
        row.expectation !== Boolean(row.formattedFailures.length)),
  )
  .map((row) => row.name);
const result = {
  cutoff: new Date().toISOString(),
  shapes,
  ownership,
  mismatches,
  currentPage: frontPageFindings(subject),
};
console.log(JSON.stringify(result, null, 2));
if (mismatches.length) process.exitCode = 1;
