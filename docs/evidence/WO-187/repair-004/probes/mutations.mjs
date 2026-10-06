// Prove the fixture's tables pin the rules: run it from a copy of scripts/ with one rule
// weakened at a time and record the first assertion that fails.
// node mutations.mjs <worktree> <scratch directory>
import {
  cpSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
const [root, scratch] = process.argv.slice(2);
const mutations = {
  // Only the exact marker spelling is a marker: a quoted second block is skipped.
  exactMarkersOnly: [
    "scripts/lib/review-findings.mjs",
    "const MARKER = /^[^\\p{L}]*dotln-findings:(start|end)[^\\p{L}]*$/iu;",
    "const MARKER = /^\\s*<!-- dotln-findings:(start|end) -->\\s*$/u;",
  ],
  // A failed review needs any finding, not a blocking one.
  failedNeedsAnyFinding: [
    "scripts/lib/review-findings.mjs",
    '!entries.some((entry) => entry.route === "blocking")',
    "!entries.length",
  ],
  // A bad route no longer voids the count.
  routeUnchecked: [
    "scripts/lib/review-findings.mjs",
    "if (!routes.includes(entry.route))",
    "if (false)",
  ],
  // A closing fence must start the line.
  closerAtLineStartOnly: [
    "scripts/lib/verification-briefing.mjs",
    "const run = /^ {0,3}(`+|~+)[ \\t]*$/u.exec(line)?.[1];",
    "const run = /^(`+|~+)[ \\t]*$/u.exec(line)?.[1];",
  ],
  // A field label ends a section without a blank line before it (VER-004's loss).
  fieldEndsWithoutBlankLine: [
    "scripts/lib/verification-briefing.mjs",
    "(label || (blank && field) || heading <= open.level)",
    "(label || field || heading <= open.level)",
  ],
  // Any fence line toggles (D039 F1(b) as worded).
  plainFenceToggle: [
    "scripts/lib/verification-briefing.mjs",
    "return run?.[0] === marker[0] && run.length >= marker.length;",
    "return /^(?:`{3,}|~{3,})/u.test(line);",
  ],
  // The bold-label form of the self-review line is accepted again.
  boldSelfReview: [
    "scripts/lib/handoff-ledger.mjs",
    "?self-review: found \\d+",
    "?(?:\\*\\*)?self-review:(?:\\*\\*)? found \\d+",
  ],
};
const out = { at: new Date().toISOString(), unmutated: null, mutations: {} };
const run = (name, mutation) => {
  const copy = join(scratch, name);
  rmSync(copy, { recursive: true, force: true });
  mkdirSync(copy, { recursive: true });
  cpSync(join(root, "scripts"), join(copy, "scripts"), { recursive: true });
  cpSync(join(root, ".gitignore"), join(copy, ".gitignore"));
  for (const link of ["packages", "node_modules", "package.json"])
    symlinkSync(join(root, link), join(copy, link));
  if (mutation) {
    const [file, from, to] = mutation;
    const source = readFileSync(join(copy, file), "utf8").replace(/\s+/gu, " ");
    if (!source.includes(from.replace(/\s+/gu, " ")))
      throw new Error(`${name}: the mutated text is not in ${file}`);
    const text = readFileSync(join(copy, file), "utf8");
    // Prettier may wrap the anchor; mutate the whitespace-normalised source.
    writeFileSync(
      join(copy, file),
      text.includes(from)
        ? text.replace(from, to)
        : source.replace(from.replace(/\s+/gu, " "), to),
    );
  }
  const parent = realpathSync(join(copy));
  mkdirSync(join(parent, "run"));
  writeFileSync(join(parent, "run/.dotln-test-root-owner"), "owner\n");
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !/^(?:CLAUDE|CODEX|COPILOT|DOTLN_)/u.test(key),
    ),
  );
  const result = spawnSync(
    process.execPath,
    [join(copy, "scripts/test-verification-review.mjs"), join(parent, "run")],
    { encoding: "utf8", env },
  );
  const failure = /AssertionError \[ERR_ASSERTION\]: (.*)/u.exec(
    result.stderr,
  )?.[1];
  return { exit: result.status, firstFailure: failure ?? null };
};
out.unmutated = run("unmutated", null);
for (const [name, mutation] of Object.entries(mutations))
  out.mutations[name] = run(name, mutation);
console.log(JSON.stringify(out, null, 1));
