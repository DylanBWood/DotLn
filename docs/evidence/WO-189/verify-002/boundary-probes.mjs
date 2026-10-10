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
const config = await resolveConfig(join(subject, "README.md"));
const cases = [
  ["unchanged", false, base],
  ["exact budget", false, page(lineBudget)],
  ["one over budget", true, page(lineBudget + 1)],
  ["CRLF exact budget", false, page(lineBudget).replace(/\n/g, "\r\n")],
  ["duplicate opening marker", true, base.replace(start, `${start}\n${start}`)],
  [
    "reversed marker pair",
    true,
    base.replace(start, "TEMP").replace(end, start).replace("TEMP", end),
  ],
  [
    "subheading below pair",
    true,
    base.replace(end, `${end}\n\n### More\n\n${sentences(12)}`),
  ],
  [
    "pair closes under next heading",
    true,
    base.replace(`${end}\n\n## Next`, `## Next\n\n${end}`),
  ],
  [
    "ordinary next heading may carry prose",
    false,
    base.replace("More information.", sentences(12)),
  ],
  [
    "thirteen sentences with bold terminators on one line",
    true,
    base.replace(
      "Capability 1 runs.",
      Array.from(
        { length: 12 },
        (_, i) => `**Extra capability ${i + 1} runs.**`,
      ).join(" ") + " Last capability runs.",
    ),
  ],
  [
    "thirteen sentences with italic terminators on one line",
    true,
    base.replace(
      "Capability 1 runs.",
      Array.from(
        { length: 12 },
        (_, i) => `_Extra capability ${i + 1} runs._`,
      ).join(" ") + " Last capability runs.",
    ),
  ],
  ...[
    ["exact duplicate heading", "## What runs today"],
    ["duplicate heading with closing hashes", "## What runs today ##"],
    ["duplicate heading with trailing spaces", "## What runs today  "],
    ["duplicate heading with tab separator", "##\tWhat runs today"],
    ["duplicate heading with indentation", "  ## What runs today"],
    ["duplicate heading with strong emphasis", "## **What runs today**"],
  ].map(([name, heading]) => [
    name,
    true,
    base.replace(end, `${end}\n\n${heading}\n\n${sentences(12)}`),
  ]),
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
const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo189-boundary-")));
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
const plain = (node) => node.value ?? node.children?.map(plain).join("") ?? "";
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
  for (const [name, expectedRefusal, text] of cases) {
    write("README.md", text);
    const result = checkDocs(root, {
      ceilings,
      baseline,
      files: ["README.md"],
    });
    const ast = parsers.markdown.parse(text);
    const renderedHeadings = ast.children
      .filter((node) => node.type === "heading")
      .map((node) => ({
        depth: node.depth,
        text: plain(node),
        line: node.position.start.line,
      }));
    const formatted = await format(text, {
      ...config,
      filepath: join(subject, "README.md"),
    });
    write("README.md", formatted);
    const formattedResult = checkDocs(root, {
      ceilings,
      baseline,
      files: ["README.md"],
    });
    const probeLine = formatted
      .split("\n")
      .find((line) => line.includes("Extra capability"));
    runs.push({
      name,
      expectedRefusal,
      renderedHeadings,
      failures: result.failures,
      notices: result.notices,
      formatterStable: formatted === text,
      formatterFixedPoint:
        (await format(formatted, {
          ...config,
          filepath: join(subject, "README.md"),
        })) === formatted,
      formattedFailures: formattedResult.failures,
      ...(probeLine
        ? { renderedProbeLine: plain(parsers.markdown.parse(probeLine)) }
        : {}),
    });
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
const mismatches = runs
  .filter((row) => row.expectedRefusal !== Boolean(row.failures.length))
  .map((row) => row.name);
console.log(
  JSON.stringify(
    { cutoff: new Date().toISOString(), lineBudget, mismatches, runs },
    null,
    2,
  ),
);
if (mismatches.length) process.exitCode = 1;
