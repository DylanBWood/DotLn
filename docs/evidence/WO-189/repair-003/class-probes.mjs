// Repair of VER-003 F1: cases the report did not quote, judged by a checker
// whose root is the first argument (default: this worktree), so the same
// source runs against the pre-repair checker and the repair. Each case runs
// the full checkDocs in a temporary repository on a branch whose order
// declares the page, before and after the repository's formatter.
// expectation: true = must refuse, false = must pass.
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
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { format, resolveConfig } from "prettier";

const worktree = resolve(import.meta.dirname, "../../../..");
const subject = resolve(process.argv[2] ?? worktree);
const { checkDocs } = await import(
  pathToFileURL(join(subject, "scripts/docs-check.mjs")).href
);
const control = JSON.parse(
  readFileSync(join(worktree, "docs/control/front-page.json"), "utf8"),
);
const { start, end, lineBudget } = control.whatRunsToday;
const sentences = (count) =>
  Array.from({ length: count }, (_, i) => `Capability ${i + 1} runs.`).join(
    "\n",
  );
const page = (count = 9) =>
  `# Page\n\n## What runs today\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn \`v0.74.1\`.\n<!-- DOTLN-RELEASE-END -->\n\n${start}\n${sentences(count)}\n${end}\n\n## Next\n\nMore information.\n\n[fixture]: docs/product/00-probe.md\n`;
const base = page();
const twelve = sentences(12);
const hidden = "Hidden one runs. Hidden two runs.";
const line = (text) => base.replace("Capability 1 runs.", text);
const after = (heading) => `${base}\n${heading}\n\n${twelve}\n`;
const cases = [
  ["control: unchanged", false, base],
  ["control: exact budget", false, page(lineBudget)],
  // Constructs the report did not quote that carry a second sentence.
  ["template tag in emphasis", true, line(`Shown runs _{{ ${hidden} }}_.`)],
  [
    "wiki link inside a link",
    true,
    line(`Shown runs [[[${hidden}]]](docs/product/00-probe.md).`),
  ],
  ["math inside strong", true, line(`Shown runs **$${hidden}$** here.`)],
  [
    "footnote reference join",
    true,
    `${line("Shown runs[^n] here.")}\n[^n]: A note runs.\n`,
  ],
  ["inline HTML span", true, line(`Shown runs <span>${hidden}</span>.`)],
  ["defined reference label", true, line(`Shown runs [${hidden}][fixture].`)],
  ["no-space join of thirteen", true, line(`${twelve.replaceAll("\n", "")}`)],
  ["question join without space", true, line("One runs?Two runs!")],
  ["ideographic stops", true, line("一个运行。两个运行。")],
  ["Arabic question mark", true, line("One runs؟ Two runs.")],
  // Namesake headings the report did not quote.
  [
    "HTML heading inside a div",
    true,
    after("<div><h2>What runs today</h2></div>"),
  ],
  [
    "HTML heading with tags",
    true,
    after('<H3 id="x">What <em>runs</em> today</H3>'),
  ],
  [
    "HTML heading in a list",
    true,
    after("- <h4>What&nbsp;runs to&#100;ay</h4>"),
  ],
  [
    "HTML heading legacy reference",
    true,
    after("<h2>What&nbsp runs to&#x64;ay</h2>"),
  ],
  [
    "HTML heading split by a blank line",
    true,
    after("<h2>\n\nWhat runs today\n\n</h2>"),
  ],
  [
    "HTML heading inline in a paragraph",
    true,
    after("Text <h2>What runs today</h2> more."),
  ],
  ["uppercase namesake", true, after("## WHAT RUNS TODAY")],
  ["punctuated namesake", true, after("### What runs — today?")],
  ["fullwidth namesake", true, after("## Ｗｈａｔ runs today")],
  ["heading holding a template tag", true, after("## What runs today {{ x }}")],
  // Prose and headings later front-page orders write keep passing.
  [
    "control: escaped dollars and braces",
    false,
    line("It costs \\$5 and \\{{ name }} stays literal."),
  ],
  [
    "control: quoted code names",
    false,
    line("The `System.String` and `Array.From` names run."),
  ],
  [
    "control: internal stops",
    false,
    line("The README.md, ASP.NET and Node.js names run."),
  ],
  [
    "raw HTML title (the page holds no raw HTML)",
    true,
    base.replace("# Page", '<h1 align="center">DotLn</h1>'),
  ],
  ["control: longer heading", false, after("## What runs today on Windows")],
  [
    "heading example in an HTML comment (raw HTML)",
    true,
    after("<!-- <h2>What runs today</h2> -->"),
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
const config = await resolveConfig(join(worktree, "README.md"));
const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo189-fix003-")));
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
    return checkDocs(root, { ceilings, baseline, files: ["README.md"] })
      .failures;
  };
  for (const [name, expectation, text] of cases) {
    const formatted = await format(text, {
      ...config,
      filepath: join(worktree, "README.md"),
    });
    runs.push({
      name,
      expectation,
      failures: judge(text),
      formattedFailures: judge(formatted),
    });
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
const refused = (failures) => failures.length > 0;
const mismatches = runs
  .filter(
    (row) =>
      row.expectation !== refused(row.failures) ||
      row.expectation !== refused(row.formattedFailures),
  )
  .map((row) => row.name);
console.log(
  JSON.stringify(
    { cutoff: new Date().toISOString(), subject, mismatches, runs },
    null,
    2,
  ),
);
if (mismatches.length) process.exitCode = 1;
