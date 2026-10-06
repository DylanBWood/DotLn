// Compare the shipped fence rule with two alternatives by patching only that rule in a
// copy of the shipped reader: node fence-rules.mjs <worktree> <scratch directory>
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [root, scratch] = process.argv.slice(2);
const source = readFileSync(
  join(root, "scripts/lib/verification-briefing.mjs"),
  "utf8",
);
const shippedFence = "const FENCE = /^(?:(`{3,})[^`]*|(~{3,}).*)$/su;";
const shippedCloser = "const run = /^ {0,3}(`+|~+)[ \\t]*$/u.exec(line)?.[1];";
for (const anchor of [shippedFence, shippedCloser])
  if (!source.includes(anchor)) throw new Error(`anchor moved: ${anchor}`);
const rules = {
  shipped: source,
  // D039 F1(b) as worded: any line that starts with a fence marker toggles.
  plainToggle: source
    .replace(shippedFence, "const FENCE = /^(?:(`{3,})|(~{3,})).*$/su;")
    .replace(
      /const closes = \(marker, line\) => \{[\s\S]*?\n\};/u,
      "const closes = (marker, line) => /^(?:`{3,}|~{3,})/u.test(line);",
    ),
  // The shipped rule, also recognised behind indentation.
  indentTolerant: source
    .replace(
      shippedFence,
      "const FENCE = /^[ \\t]*(?:(`{3,})[^`]*|(~{3,}).*)$/su;",
    )
    .replace(
      shippedCloser,
      "const run = /^[ \\t]*(`+|~+)[ \\t]*$/u.exec(line)?.[1];",
    ),
};
const KI = "**Known issues and carry-ins:**";
const inputs = {
  // A longer fence holding a shorter one, a blank line and a field label.
  nestedFence: `${KI}\n\n- first carry-in:\n\n\`\`\`\`md\n\`\`\`md\n\n**Design:** example\n\`\`\`\n\`\`\`\`\n\n- SECOND CARRY-IN.\n\n**Non-goals:** after.\n`,
  // Two examples fenced on a list marker line around a real label.
  listMarkerFences: `- \`\`\`md\n  example one\n  \`\`\`\n\n${KI}\n\n- REAL CARRY-IN.\n\n**Non-goals:** after.\n\n- \`\`\`md\n  example two\n  \`\`\`\n`,
  // An indented fence whose text holds a field label at the start of a line.
  indentedFence: `${KI}\n\n- carry-in:\n\n \`\`\`md\n\n**Design:** at the start of a line.\n \`\`\`\n\n- AFTER THE EXAMPLE.\n\n**Non-goals:** after.\n`,
};
const sentinel = {
  nestedFence: "SECOND CARRY-IN",
  listMarkerFences: "REAL CARRY-IN",
  indentedFence: "AFTER THE EXAMPLE",
};
mkdirSync(scratch, { recursive: true });
const out = { at: new Date().toISOString(), rules: {} };
for (const [name, text] of Object.entries(rules)) {
  // The copy sits beside nothing it imports; point its imports at the worktree.
  const file = join(scratch, `briefing-${name}.mjs`);
  writeFileSync(
    file,
    text.replace(
      /from "\.\/(config|paths)\.mjs"/gu,
      (_, module) =>
        `from ${JSON.stringify(join(root, "scripts/lib", `${module}.mjs`))}`,
    ),
  );
  const { knownIssueSections } = await import(file);
  out.rules[name] = Object.fromEntries(
    Object.entries(inputs).map(([input, order]) => {
      const read = knownIssueSections(order);
      const printed = read.sections.some((section) =>
        section.lines.join("\n").includes(sentinel[input]),
      );
      // A carry-in that is not printed is advised, or cut at a line the
      // section header names, or lost with nothing said.
      const cut = read.sections.find((section) => section.end)?.end ?? null;
      return [
        input,
        printed
          ? "printed"
          : read.openFence || read.unread.length
            ? "not printed; advised"
            : cut
              ? `not printed; the header names line ${cut.line}, ${cut.by}`
              : "not printed; nothing says so",
      ];
    }),
  );
}
console.log(JSON.stringify(out, null, 1));
