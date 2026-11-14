#!/usr/bin/env node
// WO-276 Part B, criterion B8: the shell reader that moved to
// packages/skeleton/src/shell-reading.mjs, compared with the reader the
// order's base held inside packages/skeleton/src/harness-command.ts.
//
//   node docs/evidence/WO-276/part-b/comparisons/shell-reader.mjs [--base <rev>] [--write]
//
// The old reader is read from Git at the base revision, its type syntax is
// removed in memory and it is loaded from session scratch, so nothing is
// built and nothing under the repository is written unless --write records
// the result beside this file. Three sets of texts are read by both: every
// tracked shell file under scripts/, packages/ and corpus/, whole; a command
// for every Git form the surface record holds; and commands generated from
// a fixed seed out of the forms a hook meets. A reading is compared on what
// both readers return: each word's text, place in its command and scope, and
// the reading's syntax, faults and counts. Offsets, comments and
// here-documents are new and have nothing to be compared with. The old
// reader read the first 32,768 characters of a text and no more, so each
// text is read to that bound by both; reading a whole script is new, and the
// Git surface comparison beside this one covers what it finds there.
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  readShellCommand,
  readShellText,
} from "../../../../../packages/skeleton/src/shell-reading.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../../..");
const args = process.argv.slice(2);
const option = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const base = option("--base", "0097fcac6");
const git = (...argv) =>
  execFileSync("git", ["-C", root, ...argv], {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });

// The base's reader, loaded without a build. Its one package import names
// desktop-control tools, which no reading touches.
const scratch = mkdtempSync(join(tmpdir(), "dotln-shell-compare-"));
process.on("exit", () => rmSync(scratch, { recursive: true, force: true }));
const commit = git("rev-parse", `${base}^{commit}`).trim();
const stripped = stripTypeScriptTypes(
  git("show", `${commit}:packages/skeleton/src/harness-command.ts`),
  { mode: "strip" },
);
const packageImport =
  stripped.indexOf('} from "@dotln/compiler";') +
  '} from "@dotln/compiler";'.length;
mkdirSync(scratch, { recursive: true });
writeFileSync(
  join(scratch, "old-reader.mjs"),
  `import { basename, isAbsolute, resolve } from "node:path";
const desktopControlSkillNames = [], desktopControlSkills = {}, desktopControlToolPrefixes = [];
${stripped.slice(packageImport)}
export { readShellCommand as oldReadShellCommand };
`,
);
const { oldReadShellCommand } = await import(
  pathToFileURL(join(scratch, "old-reader.mjs")).href
);

const shared = (reading) => ({
  words: reading.words.map(
    ({ raw, bare, text, position, command, scope, ticked, heredoc }) => ({
      raw,
      bare,
      text,
      position,
      command,
      scope,
      ticked,
      heredoc,
    }),
  ),
  plain: reading.plain,
  background: reading.background,
  commands: reading.commands,
  unmatchedQuotes: reading.unmatchedQuotes,
  incomplete: reading.incomplete,
  syntax: reading.syntax,
  syntaxFaults: reading.syntaxFaults,
  arithmetic: reading.arithmetic,
});
const OLD_BOUND = 32768;
const read = (reader, text) => {
  try {
    return JSON.stringify(shared(reader(text, 0, OLD_BOUND)));
  } catch (error) {
    return `threw ${error.constructor.name}`;
  }
};
const agree = (text) =>
  read(oldReadShellCommand, text) === read(readShellCommand, text);

// What the new reader reads that the old one did not: each is a defect of
// the old reader, named with the form that shows it. A difference counts as
// that defect only when the two readers agree once the form is taken out of
// the text, so another difference in the same text is not hidden by it.
const DEFECTS = [
  [
    "ansi-quote",
    "the old reader took $'...' as a dollar and a single-quoted text, so an escaped quote inside it ended the quote early and an escape kept its backslash",
    (text) => text.includes("$'") && agree(text.replaceAll("$'", "'")),
  ],
  [
    "here-string",
    "the old reader took a here-string (<<<) as a here-document and read the rest of the text as its body, so every command after it was unread",
    (text) => text.includes("<<<") && agree(text.replaceAll("<<<", "< ")),
  ],
  [
    "ansi-quote and here-string",
    "both of the defects above in one text",
    (text) =>
      text.includes("$'") &&
      text.includes("<<<") &&
      agree(text.replaceAll("$'", "'").replaceAll("<<<", "< ")),
  ],
];
const classify = (text) =>
  DEFECTS.find(([, , shows]) => shows(text))?.[0] ?? "unexplained";

// A fixed-seed generator: the same commands on every run.
let seed = 0x2f6e2b1;
const next = (bound) => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed % bound;
};
const FRAGMENTS = [
  "git status",
  "git -C dir log --format='%h %s'",
  'echo "a $b c"',
  "echo 'single $kept'",
  "VAR=1 OTHER='two words' env git diff",
  "$(git rev-parse HEAD)",
  "`git branch --show-current`",
  "$'tab\\there'",
  "$'it\\'s'",
  "$((1 + 2))",
  "${name:-default}",
  "# a comment with 'a quote",
  "cat <<EOF\nbody $x\nEOF\n",
  "cat <<'EOF'\nbody $x\nEOF\n",
  "cat <<-EOF\n\tbody\n\tEOF\n",
  'grep -Fq x <<<"$output"',
  ";",
  "&&",
  "||",
  "|",
  "&",
  "> out.txt",
  "2>&1",
  "< in.txt",
  "if true; then",
  "fi",
  "for f in *.md; do",
  "done",
  "case $x in a) git add . ;; *) ;; esac",
  "{",
  "}",
  "(",
  ")",
  "command -v git",
  "exec -a name git gc",
  "bash -c 'git log -1'",
  'eval "git stash list"',
  "noglob git add *.md",
  "time git fetch",
  "\\\n",
  "\n",
  "a\\ b",
  '"unclosed',
  "'unclosed",
  'x=$(echo "$(git describe)")',
  "[[ -n $x ]]",
  "!",
];
const generated = [];
for (let index = 0; index < 20000; index++) {
  const parts = [];
  for (let count = 1 + next(8); count > 0; count--)
    parts.push(FRAGMENTS[next(FRAGMENTS.length)]);
  generated.push(parts.join(next(4) ? " " : ""));
}

const SHELL_SHEBANG = /^#!.*\b(?:ba|z|da|k)?sh\b/u;
const shellFiles = git("ls-files", "-z", "--", "scripts", "packages", "corpus")
  .split("\0")
  .filter(Boolean)
  .filter((path) => {
    let bytes;
    try {
      bytes = readFileSync(join(root, path));
    } catch {
      return false;
    }
    return (
      path.endsWith(".sh") ||
      SHELL_SHEBANG.test(bytes.subarray(0, 64).toString())
    );
  })
  .sort();
const surface = JSON.parse(
  readFileSync(join(root, "scripts/lib/git-surface.json"), "utf8"),
);
const forms = [...surface.forms, ...Object.keys(surface.scoped ?? {})].sort();

const sets = [
  [
    "tracked shell files",
    shellFiles.map((path) => [path, readFileSync(join(root, path), "utf8")]),
  ],
  [
    "Git forms of the surface record",
    forms.map((form) => [`git ${form}`, `git ${form}`]),
  ],
  [
    "generated commands",
    generated.map((text, index) => [`generated ${index}`, text]),
  ],
];
const result = { base: commit, sets: [] };
for (const [name, inputs] of sets) {
  const row = {
    set: name,
    read: inputs.length,
    longerThanTheOldBound: inputs.filter(([, text]) => text.length > OLD_BOUND)
      .length,
    equal: 0,
    different: {},
    examples: [],
  };
  for (const [label, text] of inputs) {
    if (agree(text)) {
      row.equal++;
      continue;
    }
    const kind = classify(text);
    row.different[kind] = (row.different[kind] ?? 0) + 1;
    if (row.examples.filter((example) => example.kind === kind).length < 3)
      row.examples.push({
        kind,
        input: label.startsWith("generated") ? text : label,
      });
  }
  result.sets.push(row);
}
result.defects = Object.fromEntries(
  DEFECTS.map(([kind, what]) => [kind, what]),
);

// The hook host's word splitter (packages/skeleton/src/harness-host.ts,
// plainShellWords), which the base wrote as a second splitter of its own and
// which now reads the shared reader's words. Each version is taken from its
// file as written, its types removed; the worktree's is given the two
// functions it takes from the shared reader. It is read over the same
// commands, each a whole text and each by its first three words, as the
// hooks call it, and over every line of the tracked shell files, which is
// nearer the one plain command a hook hands it.
const functionOf = (source, name) => {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf("\n}\n", start);
  if (start < 0 || end < 0) throw new Error(`${name} is not in the source`);
  return stripTypeScriptTypes(source.slice(start, end + 3), { mode: "strip" });
};
const hostFile = "packages/skeleton/src/harness-host.ts";
writeFileSync(
  join(scratch, "old-plain.mjs"),
  `${functionOf(git("show", `${commit}:${hostFile}`), "plainShellWords")}\nexport { plainShellWords };\n`,
);
writeFileSync(
  join(scratch, "new-plain.mjs"),
  `import { readShellText, writtenText } from ${JSON.stringify(pathToFileURL(join(root, "packages/skeleton/src/shell-reading.mjs")).href)};\n${functionOf(readFileSync(join(root, hostFile), "utf8"), "plainShellWords")}\nexport { plainShellWords };\n`,
);
const oldPlain = (
  await import(pathToFileURL(join(scratch, "old-plain.mjs")).href)
).plainShellWords;
const newPlain = (
  await import(pathToFileURL(join(scratch, "new-plain.mjs")).href)
).plainShellWords;
const split = (reader, text) => {
  try {
    return JSON.stringify([reader(text), reader(text, 3)]);
  } catch (error) {
    return `threw ${error.constructor.name}`;
  }
};
// What the two splitters answer differently, as observed: one class, a
// defect of the old one. A difference counts as it only when the two agree
// on the command read whole.
const PLAIN_DEFECTS = [
  [
    "first words of a command that opens with an assignment",
    "a command whose first word holds an equals sign is no plain command, and the old splitter refused one read whole; asked for a command's first words it returned them before it applied that rule, so the same command was plain by its first three words and not plain whole. The new splitter applies the rule to both. The one caller that asks for first words (the near-miss advisory for a publish helper) compares the first with node's name and path, so both answers end it alike wherever node's path holds no equals sign",
    (text) => {
      const bounded = oldPlain(text, 3);
      return (
        JSON.stringify(oldPlain(text)) === JSON.stringify(newPlain(text)) &&
        bounded !== null &&
        bounded[0].includes("=") &&
        newPlain(text, 3) === null
      );
    },
  ],
  [
    "a quote left open inside a script handed to eval or a shell",
    "the old splitter took the argument of eval, or of a shell's -c, as one quoted word and called the command plain; the shared reader reads the script that argument is, and a quote the script never closes makes the command no plain one, as the shell that runs it would refuse it",
    (text) =>
      oldPlain(text) !== null &&
      newPlain(text) === null &&
      (readShellText(text)?.unmatchedQuotes.length ?? 0) > 0,
  ],
];
const plainKind = (text) =>
  PLAIN_DEFECTS.find(([, , shows]) => shows(text))?.[0] ?? "unexplained";
result.plainWords = { sets: [] };
for (const [name, inputs] of [
  ...sets.slice(1),
  [
    "lines of the tracked shell files",
    shellFiles.flatMap((path) =>
      readFileSync(join(root, path), "utf8")
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => [`${path}:${index + 1}`, line]),
    ),
  ],
]) {
  const row = {
    set: name,
    read: inputs.length,
    equal: 0,
    plainToBoth: 0,
    different: {},
    examples: [],
  };
  for (const [, text] of inputs) {
    const was = split(oldPlain, text);
    if (was === split(newPlain, text)) {
      row.equal++;
      if (was !== "[null,null]") row.plainToBoth++;
      continue;
    }
    const kind = plainKind(text);
    row.different[kind] = (row.different[kind] ?? 0) + 1;
    if (row.examples.filter((example) => example.kind === kind).length < 4)
      row.examples.push({
        kind,
        input: text.slice(0, 200),
        old: split(oldPlain, text).slice(0, 200),
        new: split(newPlain, text).slice(0, 200),
      });
  }
  result.plainWords.sets.push(row);
}
result.plainWords.defects = Object.fromEntries(
  PLAIN_DEFECTS.map(([kind, what]) => [kind, what]),
);

const unexplained = [...result.sets, ...result.plainWords.sets].reduce(
  (sum, row) => sum + (row.different.unexplained ?? 0),
  0,
);
const text = `${JSON.stringify(result, null, 2)}\n`;
if (args.includes("--write"))
  writeFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "shell-reader.json"),
    text,
  );
process.stdout.write(text);
if (unexplained) {
  console.error(`${unexplained} difference(s) no named defect explains`);
  process.exitCode = 1;
}
