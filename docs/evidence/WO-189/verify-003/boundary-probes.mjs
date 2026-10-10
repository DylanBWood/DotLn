// VER-003 attacks on the repaired "What runs today" grammar (D017). Each case
// runs the subject's full checkDocs in a temporary repository on a branch whose
// order declares the page, before and after the repository's formatter.
// expectation: true = must refuse, false = must pass, null = recorded only.
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { parsers } from "prettier/plugins/markdown.mjs";
import { format, resolveConfig } from "prettier";
import { checkDocs } from "../../../../scripts/docs-check.mjs";

const subject = resolve(import.meta.dirname, "../../../..");
const control = JSON.parse(
  readFileSync(join(subject, "docs/control/front-page.json"), "utf8"),
);
const { start, end, lineBudget } = control.whatRunsToday;
const sentences = (count) =>
  Array.from({ length: count }, (_, i) => `Capability ${i + 1} runs.`).join(
    "\n",
  );
const page = (count = 9) =>
  `# Page\n\n## What runs today\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn \`v0.73.2\`.\n<!-- DOTLN-RELEASE-END -->\n\n${start}\n${sentences(count)}\n${end}\n\n## Next\n\nMore information.\n`;
const base = page();
const extras = (joiner = " ") =>
  Array.from({ length: 12 }, (_, i) => `Extra capability ${i + 1} runs.`).join(
    joiner,
  );
const line = (text) => base.replace("Capability 1 runs.", text);
const afterEnd = (text) => base.replace(end, `${end}\n\n${text}`);
const underNext = (text) =>
  base.replace("More information.", `More information.\n\n${text}`);
const config = await resolveConfig(join(subject, "README.md"));
const cases = [
  ["control: unchanged", false, base],
  ["control: exact budget", false, page(lineBudget)],
  ["control: styled single sentence", false, line("**Bold** capability runs.")],
  // Text the checker's parser turns into nodes whose text it drops.
  [
    "liquid output tag hides twelve sentences",
    true,
    line(`Capability 1 runs. {{ ${extras()} }}`),
  ],
  [
    "liquid tag hides twelve sentences",
    true,
    line(`Capability 1 runs. {% ${extras()} %}`),
  ],
  [
    "wiki link hides twelve sentences",
    true,
    line(`Capability 1 runs. [[${extras()}]]`),
  ],
  [
    "inline math hides twelve sentences",
    null,
    line(`Capability 1 runs. $${extras()}$`),
  ],
  // Sentence joins without an ASCII or Unicode whitespace break.
  [
    "thirteen sentences joined without a space",
    null,
    line(`${extras("")}Last capability runs.`),
  ],
  [
    "thirteen sentences joined by zero-width spaces",
    null,
    line(`${extras("​")}​Last capability runs.`),
  ],
  [
    "thirteen sentences ending in an ellipsis character",
    null,
    line(`${extras(" ").replaceAll(".", "…")} Last capability runs.`),
  ],
  [
    "thirteen sentences with fullwidth full stops",
    null,
    line(`${extras(" ").replaceAll(".", "．")} Last capability runs.`),
  ],
  // Controls the repair claims to refuse.
  [
    "control: nbsp entity join",
    true,
    line(`${extras("&nbsp;")}&nbsp;Last capability runs.`),
  ],
  [
    "control: space entity join",
    true,
    line(`${extras("&#32;")}&#32;Last capability runs.`),
  ],
  [
    "control: image alt sentences",
    true,
    line(`![${extras()}](x.png) Last capability runs.`),
  ],
  [
    "control: footnote reference join",
    true,
    line(`Extra capability runs.[^1] Last capability runs.`).replace(
      "More information.",
      "More information.\n\n[^1]: A note.",
    ),
  ],
  // A second section that renders under the same name.
  [
    "HTML level-two heading under another section",
    true,
    underNext(`<h2>What runs today</h2>\n\n${sentences(12)}`),
  ],
  [
    "control: HTML heading directly after the closing marker",
    true,
    afterEnd(`<h2>What runs today</h2>\n\n${sentences(12)}`),
  ],
  [
    "control: setext duplicate under another section",
    true,
    underNext(`What runs today\n---------------\n\n${sentences(12)}`),
  ],
  [
    "control: nbsp duplicate heading",
    true,
    afterEnd(`## What&nbsp;runs today\n\n${sentences(12)}`),
  ],
  [
    "soft-hyphen duplicate heading",
    null,
    afterEnd(`## What runs to&shy;day\n\n${sentences(12)}`),
  ],
  [
    "zero-width duplicate heading",
    null,
    afterEnd(`## What runs&#8203; today\n\n${sentences(12)}`),
  ],
];
const ceilings = {
  schemaVersion: 1,
  documents: {
    "00-probe.md": {
      ceiling: 1000,
      nonExemptBytesAtLanding: 1000,
      date: "2026-10-10",
      decision: "fixture",
    },
  },
};
const baseline = { schemaVersion: 1, products: {}, dispatches: {}, links: [] };
const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo189-ver003-")));
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
// The text each node type contributes in the checker's parse tree, with the
// node types whose text is dropped by its renderer named.
const dropped = (node, out = []) => {
  if (["liquidNode", "wikiLink", "inlineMath", "math"].includes(node.type))
    out.push({ type: node.type, value: node.value });
  for (const child of node.children ?? []) dropped(child, out);
  return out;
};
const runs = [];
try {
  git("init", "-q", "-b", "main");
  if (realpathSync(git("rev-parse", "--show-toplevel")) !== root)
    throw new Error("fixture root mismatch");
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  write("docs/control/front-page.json", JSON.stringify(control));
  write(
    "docs/work-orders/WO-999-probe.md",
    "# WO-999 — Probe\n\n**Track:** machinery\n**Front page:** README.md\n**Objective:** Probe the guard.\n",
  );
  write("docs/product/00-probe.md", "# Product\n\nA stable fact.\n");
  write("README.md", base);
  git("add", "-A");
  git("commit", "-qm", "fixture baseline");
  git("checkout", "-qb", "wo-999");
  const judge = (text) => {
    write("README.md", text);
    return checkDocs(root, { ceilings, baseline, files: ["README.md"] });
  };
  for (const [name, expectation, text] of cases) {
    const result = judge(text);
    const opts = { ...config, filepath: join(subject, "README.md") };
    const formatted = await format(text, opts);
    const formattedResult = judge(formatted);
    runs.push({
      name,
      expectation,
      failures: result.failures,
      formattedFailures: formattedResult.failures,
      formatterStable: formatted === text,
      formatterFixedPoint: (await format(formatted, opts)) === formatted,
      droppedNodes: dropped(parsers.markdown.parse(formatted)),
    });
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
const refused = (failures) => failures.length > 0;
const mismatches = runs
  .filter(
    (row) =>
      row.expectation !== null &&
      (row.expectation !== refused(row.failures) ||
        row.expectation !== refused(row.formattedFailures)),
  )
  .map((row) => row.name);
const recorded = runs
  .filter((row) => row.expectation === null)
  .map((row) => ({
    name: row.name,
    refused: refused(row.failures),
    refusedAfterFormat: refused(row.formattedFailures),
  }));
console.log(
  JSON.stringify(
    {
      cutoff: new Date().toISOString(),
      lineBudget,
      mismatches,
      recorded,
      runs,
    },
    null,
    2,
  ),
);
if (mismatches.length) process.exitCode = 1;
