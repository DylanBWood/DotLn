// The kit's recorded Git surface: every Git subcommand, subcommand and option
// pair, global option and GIT_* name that the scripts and packages name, read
// statically and compared with scripts/lib/git-surface.json, whose forms were
// confirmed against the manual of the Git that package.json engines.git
// declares. A new form fails core's structural phase, naming it with its file
// and line, until a reviewer has confirmed it against that manual and recorded
// it. Arguments assembled at run time are outside this reading. Shell text
// (a shell file, or a string whose text opens with a shell shebang) is read
// by regular expressions one logical line at a time, not by a shell parser:
// a word runs through plain characters, backslash escapes, bash's $'...',
// single-quoted pieces and a double-quoted value after `=` that holds no
// unescaped $( or backtick. A blank or any of ; | & ( ) < > ` outside those
// ends it, a separator ending the command; a word that begins with a double quote
// runs to its closing quote; a comment starts at a `#` that begins a word.
// A long option's literal name before `=` is read without interpreting its
// value, including a value containing a literal dollar or an expansion.
// So outside the reading are, for example, a command inside a double-quoted
// substitution that begins its word (echo "$(git ...)", while
// x="$(git ...)" is read), a double-quoted piece elsewhere inside a word, a
// single-quoted piece inside a word that holds a double quote and does not
// end the word, an option after a quoted word that spans lines, after a
// redirection, after a substitution or after a script template's
// interpolation, an option whose name is built at run time, and JavaScript a
// shell file carries in a here-document.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runGitPathList } from "./git.mjs";
import { scriptTokens } from "./machinery-coverage.mjs";
import { declaredGitFloor } from "./node-engines.mjs";

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
// An identifier that names Git (`runGit`, `HOST_GIT_READ`, `realGit`), and
// not GitHub.
const GIT_NAME =
  /(?:^|[^A-Za-z])git(?![a-z])|[a-z0-9]Git(?![a-z])|^Git(?![a-z])|(?:^|_)GIT(?![A-Z])/u;
// A callee that takes Git's arguments one by one: `git(...)`, `runGit(...)`,
// `this.git(...)`; `readGitObjects` and `gitTreeEntry` take other arguments.
const GIT_WRAPPER = /(?:^|[^A-Za-z])git$|[a-z0-9]Git$|^Git$/u;
const SOURCE = /\.(?:mjs|cjs|js|ts|sh)$/u;
const SCRIPT = /\.(?:mjs|cjs|js|ts)$/u;
const SHELL_SHEBANG = /^#!\s*\S*\/(?:env\s+)?(?:ba|z|da)?sh\b/u;
const ENVIRONMENT_NAME =
  /(?<![A-Za-z0-9_])GIT_[A-Z0-9_]*[A-Z0-9](?![A-Z0-9_])/gu;

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

// A word of prose: a quoted word whole, or a run up to a blank or an operator
// character. A quote inside a word is not paired, since an apostrophe in a
// sentence would open a quote that never closes.
const PROSE_WORD = /"(?:[^"\\]|\\.)*"|'[^']*'|[;|&()<>`]+|[^\s;|&()<>`]+/gu;
// A word of shell arguments, as SHELL_WORD below except for quotes. A
// double-quoted piece inside a word stays whole only as a value after `=`
// with no unescaped $( or backtick, ending at a blank, separator or end of
// line. Other dollars stay in the value without interpreting an expansion.
// That keeps apostrophes in separate quoted assignments from pairing across
// the command between them. A command substitution inside a value,
// as in x="$(git ...)", still splits at its parentheses and is read. Since
// other double quotes are then plain characters, a single-quoted piece inside
// a word stops at a double quote unless its closing quote ends the word: an
// apostrophe inside a double-quoted string (msg="it's") must not pair with a
// later quote and swallow the commands between, while --format='"%s"' stays
// one word. Bash's $'...' is read with its backslash escapes.
const SHELL_ARGUMENT =
  /"(?:[^"\\]|\\.)*"|'[^']*'|[;|&()<>`]+|(?:\$'(?:[^'\\]|\\[\s\S])*'|[^\s;|&()<>`'=\\]|\\[\s\S]|'[^'"]*'|'[^']*'(?=[\s;|&()<>`]|$)|=(?:"(?:[^"\\$`]|\\.|\$(?!\())*"(?=[\s;|&()<>`]|$))?|['\\])+/gu;

/** The argument lists of each `git` command on one shell line: outer quotes
 * are removed, an unknown name is an expression, and a separator ends it. */
function shellCommands(line, { prose = false } = {}) {
  const words = Array.from(
    line.matchAll(prose ? PROSE_WORD : SHELL_ARGUMENT),
    (match) => match[0],
  );
  const found = [];
  for (let at = 0; at < words.length; at++) {
    const program = words[at].replace(/^(["'])(.*)\1$/su, "$2");
    if (
      !/^(?:git|\S*\/git|\$\{?[A-Za-z_]*(?:git|GIT)[A-Za-z_]*\}?)$/u.test(
        program,
      )
    )
      continue;
    const argv = [];
    for (const word of words.slice(at + 1)) {
      if (/^[;|&()<>`]+$/u.test(word)) break;
      const bare = word.replace(/^(["'])(.*)\1$/su, "$2");
      // Prose can name two commands with nothing between them, so there the
      // next git word starts another and a word's trailing punctuation is the
      // sentence's; in a shell command an argument such as refs/heads/git is
      // an argument, and only a separator ends the command.
      if (prose && bare === "git") break;
      // The name before = is literal regardless of whether a dollar in its
      // value is quoted, escaped or expands. Keep that name without parsing
      // the value; a name assembled through an expansion stays unknown.
      argv.push(
        /\$/u.test(bare) &&
          (prose || !/^--[A-Za-z0-9][A-Za-z0-9-]*=/u.test(bare))
          ? {}
          : { word: prose ? bare.replace(/[,.;:]+$/u, "") : bare },
      );
    }
    found.push(argv);
  }
  return found;
}

// One word or operator of a shell line, for finding where a comment starts.
// A word runs through plain characters, backslash escapes, whole quoted
// pieces and bash's $'...', so a `#` inside quotes, after a backslash or
// within a word belongs to that word.
const SHELL_WORD =
  /(?:\$'(?:[^'\\]|\\[\s\S])*'|[^\s;|&()<>`\\'"]|\\[\s\S]|'[^']*'|"(?:[^"\\]|\\[\s\S])*")+|[;|&()<>`]/gu;

/** Where a shell line's comment starts, or -1: a `#` that begins a word. */
const commentStart = (line) => {
  for (const match of line.matchAll(SHELL_WORD))
    if (match[0].startsWith("#")) return match.index;
  return -1;
};

/** A shell text's logical lines, comments removed: a line that ends with a
 * backslash continues on the next, and each keeps its first line's number.
 * A comment is found over the line joined so far, since a `#` that opens a
 * continued line can be inside the word the previous line began. */
const shellLines = (text) => {
  const lines = [];
  let pending = null;
  text.split("\n").forEach((raw, index) => {
    const before = pending?.text ?? "";
    const start = commentStart(before + raw);
    const line =
      start === -1 ? raw : raw.slice(0, Math.max(0, start - before.length));
    // An odd run of trailing backslashes continues the line; an even run is
    // escaped backslashes, which end it.
    const continued = (/\\+$/u.exec(line)?.[0].length ?? 0) % 2 === 1;
    const piece = continued ? line.slice(0, -1) : line;
    pending = pending
      ? { ...pending, text: `${pending.text}${piece}` }
      : { text: piece, offset: index };
    if (!continued) {
      lines.push(pending);
      pending = null;
    }
  });
  if (pending) lines.push(pending);
  return lines;
};

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

/** This source's own functions that pass a parameter to a call whose callee
 * names Git as that call's argument list: the whole argument after the
 * directory (`const readTarget = (root, args) => runGit(root, args)`) or a
 * spread (`[...HOST_GIT_READ, ...args]`); a parameter used as one value
 * inside a literal list forwards nothing. A name every declaration of which
 * forwards counts throughout the source, since a helper's value is often
 * handed to a callback under its own name; a name some other declaration
 * gives a different meaning counts only inside the block that declares the
 * forwarding one. Each name maps to its token ranges and to whether a rest
 * parameter carries the arguments one by one. */
function forwardingHelpers(tokens) {
  const closing = (from) => {
    const open = tokens[from].text;
    const close = { "(": ")", "[": "]", "{": "}" }[open];
    let depth = 0;
    for (let at = from; at < tokens.length; at++) {
      if (tokens[at].text === open) depth++;
      else if (tokens[at].text === close && --depth === 0) return at;
    }
    return tokens.length - 1;
  };
  // The innermost brace that encloses each token, for a declaration's scope.
  const enclosing = [];
  const braces = [];
  tokens.forEach((token, index) => {
    enclosing[index] = braces.at(-1);
    if (token.text === "{") braces.push(index);
    else if (token.text === "}") braces.pop();
  });
  // A block body ends at its brace; an expression body at the first comma,
  // semicolon or closing bracket outside its own brackets.
  const expressionEnd = (from) => {
    let depth = 0;
    for (let at = from; at < tokens.length; at++) {
      const word = tokens[at].text;
      if (["(", "[", "{"].includes(word)) depth++;
      else if ([")", "]", "}"].includes(word)) {
        if (depth === 0) return at;
        depth--;
      } else if ((word === ";" || word === ",") && depth === 0) return at;
    }
    return tokens.length;
  };
  const declarations = new Map();
  // A name the source imports is bound to another meaning than its own
  // declaration's, wherever that declaration is not in scope.
  tokens.forEach((token, index) => {
    if (token.text !== "import") return;
    const imported = [];
    if (tokens[index + 1]?.identifier) imported.push(tokens[index + 1].text);
    const open = tokens.findIndex(
      (word, at) => at > index && ["{", "from", ";"].includes(word.text),
    );
    if (tokens[open]?.text === "{")
      for (let at = open + 1; tokens[at] && tokens[at].text !== "}"; at++)
        if (
          tokens[at].identifier &&
          [",", "{", "as"].includes(tokens[at - 1].text) &&
          tokens[at + 1]?.text !== "as"
        )
          imported.push(tokens[at].text);
    for (const name of imported)
      declarations.set(name, { scopes: [], rest: false, other: true });
  });
  tokens.forEach((token, index) => {
    let name, open;
    if (
      ["const", "let", "var"].includes(token.text) &&
      tokens[index + 1]?.identifier &&
      tokens[index + 2]?.text === "="
    ) {
      name = tokens[index + 1].text;
      open = tokens[index + 3]?.text === "async" ? index + 4 : index + 3;
    } else if (token.text === "function" && tokens[index + 1]?.identifier) {
      name = tokens[index + 1].text;
      open = index + 2;
    } else return;
    if (tokens[open]?.text !== "(") return;
    const close = closing(open);
    const parameters = new Map();
    for (let at = open + 1, depth = 0; at < close; at++) {
      const word = tokens[at];
      if (["(", "[", "{"].includes(word.text)) depth++;
      else if ([")", "]", "}"].includes(word.text)) depth--;
      else if (
        depth === 0 &&
        word.identifier &&
        [",", "...", "("].includes(tokens[at - 1].text)
      )
        parameters.set(word.text, tokens[at - 1].text === "...");
    }
    const arrow = tokens[close + 1]?.text === "=>";
    const bodyStart = arrow ? close + 2 : close + 1;
    if (!parameters.size || (!arrow && tokens[bodyStart]?.text !== "{")) return;
    const bodyEnd =
      tokens[bodyStart]?.text === "{"
        ? closing(bodyStart)
        : expressionEnd(bodyStart);
    let forwarded;
    for (let at = bodyStart; at < bodyEnd; at++) {
      const callee = tokens[at];
      if (
        !callee.identifier ||
        !GIT_NAME.test(callee.text) ||
        tokens[at + 1]?.text !== "("
      )
        continue;
      const end = closing(at + 1);
      let depth = 0,
        argument = 0,
        element = [];
      for (let inside = at + 2; inside <= end; inside++) {
        const word = tokens[inside];
        if (inside === end || (word.text === "," && depth === 0)) {
          // The whole argument after the directory is the parameter.
          if (
            argument > 0 &&
            element.length === 1 &&
            parameters.has(element[0].text)
          )
            forwarded ??= element[0].text;
          argument++;
          element = [];
          continue;
        }
        if (["(", "[", "{"].includes(word.text)) depth++;
        else if ([")", "]", "}"].includes(word.text)) depth--;
        element.push(word);
        if (
          word.identifier &&
          parameters.has(word.text) &&
          tokens[inside - 1].text === "..."
        )
          forwarded ??= word.text;
      }
    }
    const entry = declarations.get(name) ?? {
      scopes: [],
      rest: false,
      other: false,
    };
    if (forwarded === undefined) entry.other = true;
    else {
      const block = enclosing[index];
      entry.scopes.push([
        block ?? -1,
        block === undefined ? tokens.length : closing(block),
      ]);
      entry.rest ||= parameters.get(forwarded);
    }
    declarations.set(name, entry);
  });
  const helpers = new Map();
  for (const [name, { scopes, rest, other }] of declarations)
    if (scopes.length)
      helpers.set(name, {
        scopes: other ? scopes : [[-1, tokens.length]],
        rest,
      });
  return helpers;
}

/** The argument lists, GIT_* names and string texts of one JavaScript or
 * TypeScript source. A list is Git's when its context says so: the arguments
 * of a call whose callee takes Git's arguments one by one, an array passed
 * straight to a call whose callee names Git or after a `git` program
 * argument, or a list that splices in one a Git name holds (`HOST_GIT_READ`).
 * Other lists (a local helper's arguments, a DotLn command's own words) are
 * outside the reading. */
function scriptReading(text) {
  const starts = lineStarts(text);
  const tokens = [...scriptTokens(text)];
  const helpers = forwardingHelpers(tokens);
  // A forwarding helper counts where its declaration is in scope; its
  // arguments one by one count only when a rest parameter carries them.
  const gitCallee = (callee, at, varargs) => {
    if ((varargs ? GIT_WRAPPER : GIT_NAME).test(callee ?? "")) return true;
    const helper = helpers.get(callee);
    return Boolean(
      helper &&
      (!varargs || helper.rest) &&
      helper.scopes.some(([from, to]) => at > from && at < to),
    );
  };
  const lists = [];
  const names = [];
  const strings = [];
  const closers = { "(": ")", "[": "]", "{": "}" };
  const frame = (open, start, callee, at) => ({
    open,
    close: closers[open],
    start,
    callee,
    at,
    elements: [],
    current: [],
  });
  const stack = [frame(null, 0, null, -1)];
  // The literal words an element holds, through any lists nested in it.
  const words = (element) =>
    element.flatMap((token) =>
      token.literal !== undefined
        ? [token.literal]
        : token.head !== undefined
          ? [token.head]
          : (token.items ?? []),
    );
  const classify = (element) => {
    if (element.length === 1 && element[0].literal !== undefined)
      return { word: element[0].literal };
    if (element.length === 1 && element[0].head !== undefined)
      return { option: element[0].head };
    if (element[0]?.text === "...")
      return {
        spread: words(element),
        gitSpread: element.some(
          (token) => token.identifier && GIT_NAME.test(token.text),
        ),
      };
    return {};
  };
  const finishElement = (top) => {
    if (top.current.length) top.elements.push(top.current);
    top.current = [];
  };
  tokens.forEach((token, index) => {
    const previous = tokens[index - 1];
    const top = stack.at(-1);
    const head =
      !token.string && token.text.startsWith("`") && token.text.endsWith("${");
    const middle = token.text.startsWith("}") && token.text.endsWith("${");
    const tail = token.text.startsWith("}") && token.text.endsWith("`");
    // A GIT_* identifier names a variable as an object key or a member, never
    // as a constant of the kit's own or a branch of a conditional.
    if (
      token.identifier &&
      /^GIT_[A-Z0-9_]*[A-Z0-9]$/u.test(token.text) &&
      (previous?.text === "." ||
        (tokens[index + 1]?.text === ":" &&
          ["{", ","].includes(previous?.text)))
    )
      names.push({ name: token.text, line: lineAt(starts, token.start) });
    // A string or template whose text opens with a shell shebang is a script
    // a fixture writes; each of its pieces is read as a shell file's lines.
    const script =
      top.open === "${" && (middle || tail)
        ? top.script
        : SHELL_SHEBANG.test(token.value ?? "");
    if (token.string || head || middle || tail)
      strings.push({
        text: token.value,
        line: lineAt(starts, token.start),
        lines: token.text.includes("\n") && !/\\n/u.test(token.text),
        script,
      });
    if (head)
      stack.push({
        ...frame("${", token.start, null, index),
        head: token.value,
        script,
      });
    else if (top.open === "${" && (middle || tail)) {
      if (tail) {
        stack.pop();
        stack.at(-1).current.push({ head: top.head, text: "`" });
      }
    } else if (closers[token.text]) {
      // An element access (`config["tools"]`) is no list, and a function's
      // own parameter list is no call.
      const access =
        token.text === "[" &&
        (previous?.identifier ||
          previous?.string ||
          [")", "]"].includes(previous?.text));
      const callee =
        token.text === "(" &&
        previous?.identifier &&
        tokens[index - 2]?.text !== "function"
          ? previous.text
          : null;
      stack.push({ ...frame(token.text, token.start, callee, index), access });
    } else if (token.text === top.close) {
      finishElement(top);
      stack.pop();
      const parent = stack.at(-1);
      if (top.open !== "{" && !top.access)
        lists.push({
          elements: top.elements.map(classify),
          line: lineAt(starts, top.start),
          array: top.open === "[",
          callee: top.callee,
          at: top.at,
          parent,
        });
      parent.current.push({
        text: top.close,
        items: top.elements.flatMap(words),
      });
    } else if (token.text === "," && top.open !== null) finishElement(top);
    else
      top.current.push(
        token.string ? { ...token, literal: token.value } : token,
      );
  });
  // An array's enclosing call is read once every argument of it has been seen.
  for (const list of lists) {
    const { parent } = list;
    list.git =
      (!list.array && gitCallee(list.callee, list.at, true)) ||
      list.elements.some((element) => element.gitSpread) ||
      (list.array &&
        parent.open === "(" &&
        (gitCallee(parent.callee, parent.at, false) ||
          parent.elements.some(
            (element) =>
              element.length === 1 &&
              (element[0].literal === "git" ||
                (element[0].identifier && GIT_NAME.test(element[0].text))),
          )));
    delete list.parent;
  }
  return { lists, names, strings };
}

/** Every form the tree names, each with its file and line, in file order. */
export function readGitSurface(root) {
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
    .filter((path) => existsSync(join(root, path)))
    .sort((a, b) => a.localeCompare(b, "en"));
  const found = [];
  const commands = new Set();
  const texts = [];
  const counted = (forms, file, line) => {
    if (forms) commands.add(forms.command);
    for (const form of forms?.forms ?? []) found.push({ form, file, line });
  };
  for (const file of files) {
    const bytes = readFileSync(join(root, file));
    if (
      !SOURCE.test(file) &&
      !SHELL_SHEBANG.test(bytes.subarray(0, 64).toString())
    )
      continue;
    const text = bytes.toString("utf8");
    if (!SCRIPT.test(file)) {
      for (const { text: line, offset } of shellLines(text)) {
        for (const match of line.matchAll(ENVIRONMENT_NAME))
          found.push({ form: match[0], file, line: offset + 1 });
        for (const argv of shellCommands(line))
          counted(argumentForms(argv), file, offset + 1);
      }
      continue;
    }
    const { lists, names, strings } = scriptReading(text);
    for (const { name, line } of names) found.push({ form: name, file, line });
    for (const list of lists)
      if (list.git) counted(argumentForms(list.elements), file, list.line);
    for (const { text: value, line, lines, script } of strings) {
      for (const match of value.matchAll(ENVIRONMENT_NAME))
        found.push({ form: match[0], file, line });
      // A script's continued lines read as one command; other text, a
      // message or a hook case, line by line.
      const pieces = script
        ? shellLines(value)
        : value.split("\n").map((piece, offset) => ({ text: piece, offset }));
      for (const { text: command, offset } of pieces) {
        const at = lines ? line + offset : line;
        for (const argv of shellCommands(command, { prose: !script }))
          if (script) counted(argumentForms(argv), file, at);
          else texts.push({ forms: argumentForms(argv), file, line: at });
      }
    }
  }
  // Command text a string carries (a message, a hook case, a script a
  // fixture writes) counts where a `git` word starts it and a Git argument
  // list or shell command line confirms its subcommand, so prose such as
  // "a git repository" never reads as Git's.
  for (const { forms, file, line } of texts)
    if (forms && commands.has(forms.command)) counted(forms, file, line);
  return found;
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
  for (const { form, file, line } of readGitSurface(root)) {
    if (admits(record, form, file)) continue;
    const places = missing.get(form) ?? new Set();
    places.add(`${file}:${line}`);
    missing.set(form, places);
  }
  const lines = [];
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
