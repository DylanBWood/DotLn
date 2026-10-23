// Differential check of the FINAL-001 repair's link rewriting: over seeded
// random Markdown, absoluteBodyLinks must return the bytes the pre-repair
// module returned, and every destination it reports as written must hold the
// repository prefix while no prefixed URL outside those spans is new.
// Usage, from the repository root under scripts/harness.mjs bounded:
//   node docs/evidence/WO-227/repair-final001-links.mjs [base-ref] [cases]
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const ref = process.argv[2] ?? "refs/dotln/checkpoint/WO-227/16";
const count = Number(process.argv[3] ?? 50000);
const module = resolve(root, "scripts/lib/github-body.mjs");
const scratch = mkdtempSync(join(tmpdir(), "wo227-repair-links-"));
try {
  // The base module resolves the installed Markdown parser from the worktree.
  const baseFile = join(scratch, "github-body.mjs");
  writeFileSync(
    baseFile,
    execFileSync("git", ["show", `${ref}:scripts/lib/github-body.mjs`], {
      cwd: root,
      encoding: "utf8",
    }).replaceAll(
      "createRequire(import.meta.url)",
      `createRequire(${JSON.stringify(module)})`,
    ),
  );
  const base = await import(pathToFileURL(baseFile).href);
  const current = await import(pathToFileURL(module).href);
  const prefix = "https://github.com/fixture/project/blob/reviewed/";
  const tokens = [
    ...["[", "]", "(", ")", "!", "`", "<", ">", "\\", "*", ".", "/", " "],
    ...["a.md", "../", "../../../", "b/c.md", "#x", "?q=1", "%28", "x"],
    ...["\n", "\r\n", "\r", '"t"', "'t'", "[d]: ", "WO-006", "﻿"],
    ...["&amp;", `${prefix}docs/a.md`],
  ];
  let seed = 20261022;
  const random = () =>
    (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const options = {
    from: "docs/PR.md",
    repository: { selector: "github.com/fixture/project" },
    revision: "reviewed",
  };
  const result = {
    ref,
    cases: count,
    differences: 0,
    spanFailures: 0,
    spans: 0,
  };
  const examples = [];
  for (let index = 0; index < count; index++) {
    let source = "";
    for (let part = 1 + Math.floor(random() * 30); part > 0; part--)
      source += tokens[Math.floor(random() * tokens.length)];
    const written = [];
    const expected = base.absoluteBodyLinks(source, options);
    const actual = current.absoluteBodyLinks(source, { ...options, written });
    if (expected !== actual) {
      result.differences += 1;
      if (examples.length < 3) examples.push({ source, expected, actual });
      continue;
    }
    let last = 0;
    let rest = "";
    let ok = true;
    for (const { start, end } of written) {
      result.spans += 1;
      ok &&= start >= last && end > start;
      ok &&= actual.slice(start, end).startsWith(prefix);
      rest += `${actual.slice(last, start)} `;
      last = end;
    }
    rest += actual.slice(last);
    ok &&= rest.split(prefix).length <= source.split(prefix).length;
    if (!ok) {
      result.spanFailures += 1;
      if (examples.length < 3) examples.push({ source, actual, written });
    }
  }
  console.log(JSON.stringify({ ...result, examples }));
  process.exitCode = result.differences || result.spanFailures ? 1 : 0;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
