// The kit's recorded Git surface: every Git subcommand, subcommand and option
// pair, global option and GIT_* name that the scripts and packages name, read
// statically and compared with scripts/lib/git-surface.json, whose forms were
// confirmed against the manual of the Git that package.json engines.git
// declares. A new form fails core's structural phase, naming it with its file
// and line, until a reviewer has confirmed it against that manual and recorded
// it. Arguments assembled at run time are outside this reading.
//
// Each format is read by the repository's one reader of it. JavaScript and
// TypeScript sources are parsed (packages/skeleton/src/source-reading.mjs). Shell text (a
// shell file, a here-document such a file feeds to a shell or writes as a
// script, or a string whose text opens with a shell shebang) is read by the
// hooks' shell reader (packages/skeleton/src/shell-reading.mjs), which splits
// words as the shell does: quotes, escapes, bash's and zsh's $'...',
// continued lines, substitutions and scripts handed to a shell or to eval. A
// word the shell expands is an expression, except that a long option's
// literal name before `=` is read without interpreting its value. The
// reader never refuses a form; a shell file it cannot read to the end (an
// unclosed quote, substitution, block or here-document) fails the check,
// since the forms after that point would go unread. Outside the reading are
// an option whose name is built at run time and a here-document that neither
// opens with a shell shebang nor feeds a shell, such as JavaScript or
// Markdown a fixture writes. A string that is not a script (a message, a hook
// case) is prose, read by its words below: none of those strings holds its
// command in a Markdown code span, and a shell reading would pair a
// sentence's apostrophes.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  readCommands,
  readShellText,
} from "../../packages/skeleton/src/shell-reading.mjs";
import { runGitPathList } from "./git.mjs";
import { declaredGitFloor } from "./node-engines.mjs";
import { provenVendoredFile } from "./vendored-parser.mjs";
import {
  sourceNodes,
  sourceSyntax as sourceAst,
  sourceTrees as readSources,
} from "../../packages/skeleton/src/source-reading.mjs";

export const GIT_SURFACE_RECORD = "scripts/lib/git-surface.json";

// Global options that take the next word as their value.
const GLOBAL_VALUE = new Set([
  "-C",
  "-c",
  "--config-env",
  "--git-dir",
  "--namespace",
  "--super-prefix",
  "--work-tree",
]);
// Commands whose next word names a subcommand of their own.
const NESTED = new Set([
  "bisect",
  "bundle",
  "commit-graph",
  "config",
  "hook",
  "maintenance",
  "multi-pack-index",
  "notes",
  "reflog",
  "refs",
  "remote",
  "sparse-checkout",
  "stash",
  "submodule",
  "worktree",
]);
const COMMAND = /^[a-z][a-z0-9-]*$/u;
const OPTION = /^--?[A-Za-z0-9][A-Za-z0-9-]*(?:=[\s\S]*)?$/u;
const LONG_OPTION_NAME = /^--[A-Za-z0-9][A-Za-z0-9-]*=/u;
// An identifier that names Git (`runGit`, `HOST_GIT_READ`, `realGit`), and
// not GitHub.
const GIT_NAME =
  /(?:^|[^A-Za-z])git(?![a-z])|[a-z0-9]Git(?![a-z])|^Git(?![a-z])|(?:^|_)GIT(?![A-Z])/u;
// A callee that takes Git's arguments one by one: `git(...)`, `runGit(...)`,
// `this.git(...)`; `readGitObjects` and `gitTreeEntry` take other arguments.
const GIT_WRAPPER = /(?:^|[^A-Za-z])git$|[a-z0-9]Git$|^Git$/u;
// A shell word that runs Git: the program, a path to it, or a variable that
// names it (`$real_git`, `${GIT}`).
const GIT_PROGRAM =
  /^(?:git|\S*\/git|\$\{?[A-Za-z_]*(?:git|GIT)[A-Za-z_]*\}?)$/u;
const SHELLS = new Set(["sh", "bash", "zsh", "dash", "ksh"]);
const SOURCE = /\.(?:mjs|cjs|js|ts|sh)$/u;
const SCRIPT = /\.(?:mjs|cjs|js|ts)$/u;
const SHELL_SHEBANG = /^#!\s*\S*\/(?:env\s+)?(?:ba|z|da)?sh\b/u;
const ENVIRONMENT_NAME =
  /(?<![A-Za-z0-9_])GIT_[A-Z0-9_]*[A-Z0-9](?![A-Z0-9_])/gu;
const GIT_VARIABLE = /^GIT_[A-Z0-9_]*[A-Z0-9]$/u;

/** An option's name: `--format=%(path)` reads as `--format`. */
const optionName = (word) =>
  word.startsWith("--") ? word.split("=")[0] : word;

/** The forms one argument list names, or null when it names no subcommand.
 * Each element is `{word}` for a literal word, `{option}` for a word whose
 * head alone is literal (a template), `{spread}` for an element that splices
 * words in, or `{}` for any other expression. A `git` program word, where the
 * list holds one, starts the arguments. */
function argumentForms(elements) {
  // A `git` program word starts the arguments only where the list begins
  // with it, or with `env` and its assignments before it; a later `git` is an
  // ordinary argument, such as a path.
  let program = elements[0]?.word === "git" ? 0 : -1;
  if (elements[0]?.word === "env") {
    let at = 1;
    while (
      /^[A-Za-z_][A-Za-z0-9_]*=/u.test(
        elements[at]?.word ?? elements[at]?.option ?? "",
      )
    )
      at++;
    if (elements[at]?.word === "git") program = at;
  }
  const words = elements.slice(program + 1);
  const globals = [];
  let index = 0;
  for (; index < words.length; index++) {
    const { word } = words[index];
    if (word === undefined) continue;
    if (GLOBAL_VALUE.has(word)) {
      globals.push(`git ${word}`);
      index++;
    } else if (OPTION.test(word)) globals.push(`git ${optionName(word)}`);
    else break;
  }
  const first = words[index]?.word;
  if (first === undefined || !COMMAND.test(first)) return null;
  let command = first;
  const next = words[index + 1]?.word;
  if (NESTED.has(first) && next !== undefined && COMMAND.test(next)) {
    command = `${first} ${next}`;
    index++;
  }
  const forms = [...globals, command];
  for (const element of words.slice(index + 1)) {
    if (element.word === "--") break;
    for (const option of element.spread ?? [element.word ?? element.option])
      if (typeof option === "string" && OPTION.test(option))
        forms.push(`${command} ${optionName(option)}`);
  }
  return { command: first, forms };
}

const lineStarts = (text) => {
  const starts = [0];
  for (let index = 0; index < text.length; index++)
    if (text.charCodeAt(index) === 10) starts.push(index + 1);
  return starts;
};
const lineAt = (starts, offset) => {
  let low = 0,
    high = starts.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (starts[middle] <= offset) low = middle;
    else high = middle - 1;
  }
  return low + 1;
};

/** What a shell text names: the argument list of each Git command it runs,
 * with the line (counted from `firstLine`) its command starts on, each
 * GIT_* name it holds outside its comments, with its line, and whether the
 * reader read it to the end. Git runs where a
 * word of a command names it, after any wrapper such as env, exec or
 * timeout. A word the shell expands is an expression, unless it is a long
 * option whose literal name comes before `=`. A here-document a command
 * reads is a script of its own when it opens with a shell shebang or a shell
 * reads it; another here-document is data whose GIT_* names still count. */
function shellReading(text, firstLine = 1) {
  const starts = lineStarts(text);
  const lineOf = (offset) => firstLine - 1 + lineAt(starts, offset);
  const commands = [];
  const names = [];
  const reading = readShellText(text, { whole: true });
  if (!reading) return { commands, names, complete: false };
  let complete =
    !reading.incomplete &&
    !reading.unmatchedQuotes.length &&
    reading.heredocs.every((heredoc) => heredoc.closed);
  // Comments and the scripts read on their own name nothing here.
  const skipped = [...reading.comments];
  for (const command of readCommands(reading)) {
    const at = command.words.findIndex((word) => GIT_PROGRAM.test(word));
    if (at >= 0)
      commands.push({
        offset: command.start,
        line: lineOf(command.start),
        argv: command.words
          .slice(at + 1)
          .map((word, index) =>
            command.expanded[at + 1 + index] && !LONG_OPTION_NAME.test(word)
              ? {}
              : { word },
          ),
      });
    for (const heredoc of command.heredocs) {
      const body = text.slice(heredoc.start, heredoc.end);
      // A shell reads it where a word of the command names one, as Git is
      // found: after any wrapper, without resolving which word runs.
      if (
        !command.words.some((word) => SHELLS.has(word.replace(/^.*\//u, ""))) &&
        !SHELL_SHEBANG.test(body)
      )
        continue;
      const inner = shellReading(body, lineOf(heredoc.start));
      commands.push(...inner.commands);
      names.push(...inner.names);
      complete &&= inner.complete;
      skipped.push(heredoc);
    }
  }
  let from = 0;
  for (const { start, end } of [
    ...skipped.sort((a, b) => a.start - b.start),
    { start: text.length, end: text.length },
  ]) {
    for (const match of text.slice(from, start).matchAll(ENVIRONMENT_NAME))
      names.push({ name: match[0], line: lineOf(from + match.index) });
    from = Math.max(from, end);
  }
  return { commands, names, complete };
}

// A word of prose: a quoted word whole, or a run up to a blank or an operator
// character. A quote inside a word is not paired, since an apostrophe in a
// sentence would open a quote that never closes.
const PROSE_WORD = /"(?:[^"\\]|\\.)*"|'[^']*'|[;|&()<>`]+|[^\s;|&()<>`]+/gu;

/** The argument lists of each `git` command one line of prose names. Prose
 * can name two commands with nothing between them, so the next git word
 * starts another and a word's trailing punctuation is the sentence's. */
function proseCommands(line) {
  const words = Array.from(line.matchAll(PROSE_WORD), (match) => match[0]);
  const bare = (word) => word.replace(/^(["'])(.*)\1$/su, "$2");
  const found = [];
  for (let at = 0; at < words.length; at++) {
    if (!GIT_PROGRAM.test(bare(words[at]))) continue;
    const argv = [];
    for (const word of words.slice(at + 1).map((written) => ({
      written,
      text: bare(written),
    }))) {
      if (/^[;|&()<>`]+$/u.test(word.written) || word.text === "git") break;
      argv.push(
        /\$/u.test(word.text)
          ? {}
          : { word: word.text.replace(/[,.;:]+$/u, "") },
      );
    }
    found.push(argv);
  }
  return found;
}

// --------------------------------------------------- JavaScript and TypeScript

/** The name a call's callee is known by: `git` in `git(...)`,
 * `this.git(...)` and `new Git(...)`; null for a computed callee. */
const calleeName = (call, K) =>
  call.expression.kind === K.Identifier
    ? call.expression.text
    : call.expression.kind === K.PropertyAccessExpression
      ? call.expression.name.text
      : null;

/** The text of a string literal, or of a template with no substitution. */
const stringText = (node, K) =>
  node?.kind === K.StringLiteral ||
  node?.kind === K.NoSubstitutionTemplateLiteral
    ? node.text
    : undefined;

/** The literal words a spread element splices in: every string and every
 * template's literal head it holds, through any nesting, except the text a
 * template's own substitutions compute. */
function spreadWords(node, K) {
  const found = [];
  const visit = (current) => {
    const text = stringText(current, K);
    if (text !== undefined) found.push(text);
    else if (current.kind === K.TemplateExpression)
      found.push(current.head.text);
    else current.forEachChild(visit);
  };
  visit(node);
  return found;
}

/** Whether the value a spread element splices in is named for Git: an
 * identifier of its expression itself, outside any call's arguments, any
 * list, object or function it holds (`...HOST_GIT_READ`, `...gitArgs(x)`). */
function spreadsGit(node, K) {
  const names = [];
  const visit = (current) => {
    if (!current) return;
    if (current.kind === K.Identifier) names.push(current.text);
    else if (current.kind === K.PropertyAccessExpression) {
      visit(current.expression);
      visit(current.name);
    } else if (
      current.kind === K.ElementAccessExpression ||
      current.kind === K.CallExpression ||
      current.kind === K.NewExpression
    )
      visit(current.expression);
    else if (current.kind === K.ConditionalExpression) {
      visit(current.condition);
      visit(current.whenTrue);
      visit(current.whenFalse);
    } else if (current.kind === K.BinaryExpression) {
      visit(current.left);
      visit(current.right);
    } else if (
      current.kind === K.ParenthesizedExpression ||
      current.kind === K.AsExpression ||
      current.kind === K.SatisfiesExpression ||
      current.kind === K.NonNullExpression ||
      current.kind === K.AwaitExpression
    )
      visit(current.expression);
  };
  visit(node);
  return names.some((name) => GIT_NAME.test(name));
}

/** One element of an argument list or array, as argumentForms reads it. */
function element(node, K) {
  const text = stringText(node, K);
  if (text !== undefined) return { word: text };
  if (node.kind === K.TemplateExpression) return { option: node.head.text };
  if (node.kind === K.SpreadElement)
    return {
      spread: spreadWords(node.expression, K),
      gitSpread: spreadsGit(node.expression, K),
    };
  return {};
}

/** The arrays whose value an argument passes on: the argument itself, the
 * branch a condition or a fallback chooses, a spread's value, a typed,
 * non-null or parenthesized value, and the array a method of it is called
 * on (`["log", flag && "-p"].filter(Boolean)`). */
function passedArrays(node, K) {
  if (!node) return [];
  switch (node.kind) {
    case K.ArrayLiteralExpression:
      return [node];
    case K.ConditionalExpression:
      return [
        ...passedArrays(node.whenTrue, K),
        ...passedArrays(node.whenFalse, K),
      ];
    case K.BinaryExpression:
      return [
        K.AmpersandAmpersandToken,
        K.BarBarToken,
        K.QuestionQuestionToken,
      ].includes(node.operatorToken.kind)
        ? [...passedArrays(node.left, K), ...passedArrays(node.right, K)]
        : node.operatorToken.kind === K.CommaToken
          ? passedArrays(node.right, K)
          : [];
    case K.SpreadElement:
    case K.ParenthesizedExpression:
    case K.AsExpression:
    case K.SatisfiesExpression:
    case K.NonNullExpression:
    case K.TypeAssertionExpression:
      return passedArrays(node.expression, K);
    case K.CallExpression:
      return node.expression.kind === K.PropertyAccessExpression
        ? passedArrays(node.expression.expression, K)
        : [];
    default:
      return [];
  }
}

/** This source's own functions that pass a parameter to a call whose callee
 * names Git as that call's argument list: the whole argument after the
 * directory (`const readTarget = (root, args) => runGit(root, args)`) or a
 * spread (`[...HOST_GIT_READ, ...args]`); a parameter used as one value
 * inside a literal list forwards nothing. A name every declaration of which
 * forwards counts throughout the source, since a helper's value is often
 * handed to a callback under its own name; a name some other declaration or
 * an import gives a different meaning counts only inside the block that
 * declares the forwarding one. Each name maps to its scopes, as source
 * ranges, and to whether a rest parameter carries the arguments one by one. */
function forwardingHelpers(nodes, K) {
  const within = (node, outer) =>
    outer.pos <= node.pos && node.end <= outer.end;
  const blocks = nodes.filter((node) =>
    [K.Block, K.ModuleBlock, K.CaseBlock].includes(node.kind),
  );
  // The innermost block that holds a declaration, or the whole source.
  const scopeOf = (node) => {
    let inner = null;
    for (const block of blocks)
      if (
        block.pos < node.pos &&
        node.end <= block.end &&
        (!inner || block.pos >= inner.pos)
      )
        inner = block;
    return inner ? [inner.pos, inner.end] : [-1, Infinity];
  };
  const gitCalls = nodes.filter(
    (node) =>
      node.kind === K.CallExpression &&
      GIT_NAME.test(calleeName(node, K) ?? ""),
  );
  const spreads = nodes.filter(
    (node) =>
      node.kind === K.SpreadElement && node.expression.kind === K.Identifier,
  );
  const declarations = new Map();
  const entry = (name) => {
    if (!declarations.has(name))
      declarations.set(name, { scopes: [], rest: false, other: false });
    return declarations.get(name);
  };
  for (const node of nodes) {
    if (node.kind === K.ImportDeclaration) {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      for (const name of [
        clause?.name,
        bindings?.kind === K.NamespaceImport ? bindings.name : undefined,
        ...(bindings?.kind === K.NamedImports
          ? bindings.elements.map((specifier) => specifier.name)
          : []),
      ])
        if (name) entry(name.text).other = true;
      continue;
    }
    let fn;
    if (
      node.kind === K.VariableDeclaration &&
      node.name.kind === K.Identifier &&
      [K.ArrowFunction, K.FunctionExpression].includes(node.initializer?.kind)
    )
      fn = node.initializer;
    else if (node.kind === K.FunctionDeclaration && node.name && node.body)
      fn = node;
    else continue;
    const parameters = new Map();
    for (const parameter of fn.parameters)
      if (parameter.name.kind === K.Identifier)
        parameters.set(parameter.name.text, Boolean(parameter.dotDotDotToken));
    if (!parameters.size) continue;
    const forwarded = [];
    for (const call of gitCalls) {
      if (!within(call, fn.body)) continue;
      // The whole argument after the directory is the parameter, or a
      // parameter is spread anywhere among the arguments.
      call.arguments.forEach((argument, index) => {
        if (
          index > 0 &&
          argument.kind === K.Identifier &&
          parameters.has(argument.text)
        )
          forwarded.push(argument);
      });
      for (const spread of spreads)
        if (
          parameters.has(spread.expression.text) &&
          call.arguments.some((argument) => within(spread, argument))
        )
          forwarded.push(spread.expression);
    }
    const declared = entry(node.name.text);
    if (!forwarded.length) {
      declared.other = true;
      continue;
    }
    const first = forwarded.sort((a, b) => a.pos - b.pos)[0];
    declared.scopes.push(scopeOf(node));
    declared.rest ||= parameters.get(first.text);
  }
  const helpers = new Map();
  for (const [name, { scopes, rest, other }] of declarations)
    if (scopes.length)
      helpers.set(name, { scopes: other ? scopes : [[-1, Infinity]], rest });
  return helpers;
}

/** The argument lists, GIT_* names and string texts of one source the
 * repository's source reader has read (source-reading.mjs). A list is Git's
 * when its context says so: the arguments of a call whose callee takes Git's
 * arguments one by one, an array passed to a call whose callee names Git or
 * after a `git` program argument, or a list that splices in one a Git name
 * holds (`HOST_GIT_READ`). Other lists (a local helper's arguments, a DotLn
 * command's own words) are outside the reading. */
function scriptReading({ file, line }) {
  const K = sourceAst().SyntaxKind;
  const text = file.text;
  const nodes = [...sourceNodes(file)];
  const startLine = (node) => line(node.getStart(file));
  const helpers = forwardingHelpers(nodes, K);
  // A forwarding helper counts where its declaration is in scope; its
  // arguments one by one count only when a rest parameter carries them.
  const gitCallee = (call, varargs) => {
    const callee = calleeName(call, K);
    if ((varargs ? GIT_WRAPPER : GIT_NAME).test(callee ?? "")) return true;
    const helper = helpers.get(callee);
    const at = call.expression.pos;
    return Boolean(
      helper &&
      (!varargs || helper.rest) &&
      helper.scopes.some(([from, to]) => at > from && at < to),
    );
  };
  const lists = [];
  const names = [];
  const strings = [];
  const gitArrays = new Set();
  // A piece of string text, with whether its own lines count: a literal
  // that spans them as written, holding no `\n` escape.
  const piece = (node, value) => {
    const written = text.slice(node.getStart(file), node.end);
    return {
      text: value,
      line: startLine(node),
      lines: written.includes("\n") && !written.includes("\\n"),
    };
  };
  for (const node of nodes) {
    // A GIT_* identifier names a variable where code reads or sets it by
    // name: a member, or the key of a property, a pattern or a type's member.
    const key =
      node.kind === K.PropertyAccessExpression
        ? node.name
        : node.kind === K.BindingElement
          ? (node.propertyName ?? node.name)
          : [
                K.PropertyAssignment,
                K.ShorthandPropertyAssignment,
                K.PropertySignature,
                K.PropertyDeclaration,
              ].includes(node.kind)
            ? node.name
            : null;
    if (key?.kind === K.Identifier && GIT_VARIABLE.test(key.text))
      names.push({ name: key.text, line: startLine(key) });
    const value = stringText(node, K);
    if (value !== undefined)
      strings.push({
        pieces: [piece(node, value)],
        script: SHELL_SHEBANG.test(value),
      });
    else if (node.kind === K.TemplateExpression)
      strings.push({
        pieces: [
          node.head,
          ...node.templateSpans.map((span) => span.literal),
        ].map((literal) => piece(literal, literal.text)),
        script: SHELL_SHEBANG.test(node.head.text),
      });
    else if (
      node.kind === K.CallExpression ||
      (node.kind === K.NewExpression && node.arguments)
    ) {
      const elements = node.arguments.map((argument) => element(argument, K));
      lists.push({
        elements,
        // The list opens at its parenthesis.
        line: line(node.arguments.pos - 1),
        git:
          gitCallee(node, true) ||
          elements.some((element) => element.gitSpread),
      });
      if (
        gitCallee(node, false) ||
        node.arguments.some(
          (argument) =>
            stringText(argument, K) === "git" ||
            (argument.kind === K.Identifier && GIT_NAME.test(argument.text)),
        )
      )
        for (const argument of node.arguments)
          for (const array of passedArrays(argument, K)) gitArrays.add(array);
    }
  }
  for (const node of nodes)
    if (node.kind === K.ArrayLiteralExpression) {
      const elements = node.elements
        .filter((item) => item.kind !== K.OmittedExpression)
        .map((item) => element(item, K));
      lists.push({
        elements,
        line: startLine(node),
        git:
          gitArrays.has(node) || elements.some((element) => element.gitSpread),
      });
    }
  return { lists, names, strings };
}

/** A string's text, its pieces joined with U+0000 where a template
 * substitutes, and the source line of an offset in it. */
function stringLines({ pieces }) {
  let at = 0;
  const placed = pieces.map((piece) => {
    const start = at;
    at += piece.text.length + 1;
    return { ...piece, start };
  });
  const joined = pieces.map((piece) => piece.text).join("\u0000");
  const lineOf = (offset) => {
    let current = placed[0];
    for (const candidate of placed)
      if (candidate.start <= offset) current = candidate;
    return current.lines
      ? current.line +
          (joined.slice(current.start, offset).match(/\n/gu)?.length ?? 0)
      : current.line;
  };
  return { joined, lineOf };
}

/** Every form the tree names, each with its file and line, in file order. */
export const readGitSurface = (root) => surfaceReading(root).found;

/** The forms the tree names, and each shell file the shell reader could not
 * read to the end. */
function surfaceReading(root) {
  const files = runGitPathList(root, [
    "ls-files",
    "-z",
    "--cached",
    "--others",
    "--exclude-standard",
    "--",
    "scripts",
    "packages",
  ])
    // The proven copy of the pinned parser is not this repository's text.
    .filter(
      (path) => existsSync(join(root, path)) && !provenVendoredFile(root, path),
    )
    .sort((a, b) => a.localeCompare(b, "en"));
  const found = [];
  const unread = [];
  const commands = new Set();
  const texts = [];
  const counted = (forms, file, line) => {
    if (forms) commands.add(forms.command);
    for (const form of forms?.forms ?? []) found.push({ form, file, line });
  };
  const scripts = [];
  for (const file of files) {
    const bytes = readFileSync(join(root, file));
    if (SCRIPT.test(file))
      scripts.push({ path: file, source: bytes.toString("utf8") });
    else if (
      SOURCE.test(file) ||
      SHELL_SHEBANG.test(bytes.subarray(0, 64).toString())
    ) {
      const {
        commands: run,
        names,
        complete,
      } = shellReading(bytes.toString("utf8"));
      if (!complete) unread.push(file);
      for (const { name, line } of names)
        found.push({ form: name, file, line });
      for (const { argv, line } of run)
        counted(argumentForms(argv), file, line);
    }
  }
  // The JavaScript and TypeScript sources are parsed in one batch.
  for (const read of readSources(scripts)) {
    const file = read.path;
    const { lists, names, strings } = scriptReading(read);
    for (const { name, line } of names) found.push({ form: name, file, line });
    for (const list of lists)
      if (list.git) counted(argumentForms(list.elements), file, list.line);
    for (const string of strings) {
      const { joined, lineOf } = stringLines(string);
      // A script a fixture writes is read whole, as a shell file, each
      // substitution standing as one word the shell would expand, so that a
      // quote around a substitution pairs as it will. Other text, a message
      // or a hook case, is read piece by piece, line by line.
      const { script } = string;
      const value = joined;
      for (const match of value.matchAll(ENVIRONMENT_NAME))
        found.push({ form: match[0], file, line: lineOf(match.index) });
      // A script a fixture writes is read as a shell file.
      if (script) {
        for (const { argv, offset } of shellReading(value).commands)
          counted(argumentForms(argv), file, lineOf(offset));
        continue;
      }
      let offset = 0;
      for (const piece of value.split(/[\n\u0000]/u)) {
        for (const argv of proseCommands(piece))
          texts.push({
            forms: argumentForms(argv),
            file,
            line: lineOf(offset),
          });
        offset += piece.length + 1;
      }
    }
  }
  // Command text a string carries (a message, a hook case) counts where a
  // `git` word starts it and a Git argument list or shell command confirms
  // its subcommand, so prose such as "a git repository" never reads as Git's.
  for (const { forms, file, line } of texts)
    if (forms && commands.has(forms.command)) counted(forms, file, line);
  return { found, unread };
}

export const readGitSurfaceRecord = (root) =>
  JSON.parse(readFileSync(join(root, GIT_SURFACE_RECORD), "utf8"));

/** The record's forms and its scoped forms: a scoped form is admitted only in
 * the files its entry names, with the note that says why. */
const admits = (record, form, file) =>
  record.forms.includes(form) ||
  Boolean(record.scoped?.[form]?.paths.includes(file));

/** Fails naming each form the record lacks, with its files and lines, and a
 * record whose floor differs from package.json engines.git. */
export function checkGitSurface(root) {
  const record = readGitSurfaceRecord(root);
  const floor = declaredGitFloor(root);
  const missing = new Map();
  const { found, unread } = surfaceReading(root);
  for (const { form, file, line } of found) {
    if (admits(record, form, file)) continue;
    const places = missing.get(form) ?? new Set();
    places.add(`${file}:${line}`);
    missing.set(form, places);
  }
  const lines = unread.map(
    (file) =>
      `${file}: the shell reader could not read it to the end (an unclosed quote, substitution, block or here-document), so the Git forms after that point are unread; close it.`,
  );
  for (const form of record.forms)
    if (Object.hasOwn(record.scoped ?? {}, form))
      lines.push(
        `${GIT_SURFACE_RECORD} lists ${form} both as a form and as a scoped form; a scoped form is admitted only in the files its entry names, so remove it from the forms.`,
      );
  if (record.floor !== floor)
    lines.push(
      `${GIT_SURFACE_RECORD} floor ${JSON.stringify(record.floor)} differs from package.json engines.git ${JSON.stringify(floor)}: confirm every recorded form against the manual of the declared floor's Git, then set the record's floor.`,
    );
  for (const [form, places] of [...missing].sort(([a], [b]) =>
    a.localeCompare(b, "en"),
  ))
    lines.push(
      `Git form not in ${GIT_SURFACE_RECORD}: ${form} (${[...places].join(", ")})`,
    );
  if (missing.size)
    lines.push(
      `Confirm each form against the manual of the Git that package.json engines.git ${floor} declares; then run node scripts/structural-checks.mjs git-surface --record and review the record's diff, scoping a form above the floor to the files that need it with its reason.`,
    );
  return { exitCode: lines.length ? 1 : 0, output: lines.join("\n") };
}

/** Rewrites the record's forms from the tree, keeping its floor, its notes
 * and each scoped form. A scoped form never joins the forms: a file outside
 * its entry that names it is returned for a reviewer to admit by name, and
 * the check keeps failing there until then. Returns the forms added and
 * removed and those places. */
export function recordGitSurface(root) {
  const record = readGitSurfaceRecord(root);
  const scoped = record.scoped ?? {};
  const found = readGitSurface(root);
  const forms = [
    ...new Set(
      found
        .filter(({ form }) => !Object.hasOwn(scoped, form))
        .map(({ form }) => form),
    ),
  ].sort((a, b) => a.localeCompare(b, "en"));
  writeFileSync(
    join(root, GIT_SURFACE_RECORD),
    `${JSON.stringify({ ...record, forms }, null, 2)}\n`,
  );
  return {
    added: forms.filter((form) => !record.forms.includes(form)),
    removed: record.forms.filter((form) => !forms.includes(form)),
    scopedElsewhere: [
      ...new Set(
        found
          .filter(
            ({ form, file }) =>
              Object.hasOwn(scoped, form) && !scoped[form].paths.includes(file),
          )
          .map(({ form, file, line }) => `${form} (${file}:${line})`),
      ),
    ],
  };
}
