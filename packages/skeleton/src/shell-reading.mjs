// The shell reader: one reading of a shell text for every caller. The hooks
// read a command with it before the refusing classifier judges the command
// (harness-command.ts), and the scripts read whole shell files with it (the
// Git surface reading, the comment labels), so a quote, a comment, a
// here-document or a substitution means the same to each. It refuses no
// form: control syntax, substitutions and here-documents are read, and a
// script handed to a shell or to eval is read as a command of its own.
// This module is build-free: a script imports it from the package's sources
// with no built output, and the runtime imports its compiled copy.

/**
 * One word of a reading.
 * @typedef {object} ReadWord
 * @property {string} raw The word as the command wrote it.
 * @property {number} start Where the word starts in the text read. A word of
 * a script handed to a shell or to eval spans the command that carried the
 * script, and a word of a heredoc's substitution spans that substitution.
 * @property {number} end Where the word ends in the text read.
 * @property {string} bare What stood outside quotes, U+0000 where quoted or
 * substituted text stood.
 * @property {string} text The word without its quotes. Text the shell takes
 * as written is held in the private use area (see `writtenText`), so a `$`
 * here is one the shell expands and U+0000 stands where it substitutes a
 * command or arithmetic.
 * @property {"assignment" | "control" | "head" | "argument" | "redirect" | "pattern"} position
 * @property {number} command
 * @property {string} scope
 * @property {boolean} ticked Inside backquotes that stand in double quotes
 * or an unquoted heredoc.
 * @property {boolean} heredoc Inside a substitution of a heredoc whose
 * delimiter is not quoted.
 */

/**
 * A here-document: its body's offsets in the text read, without the line
 * that ends it, and the command whose input it is.
 * @typedef {object} ReadHeredoc
 * @property {number} start
 * @property {number} end
 * @property {string} delimiter
 * @property {boolean} quoted A quoted delimiter: the shell expands nothing
 * in the body.
 * @property {boolean} strip `<<-`: the shell strips the body's leading tabs.
 * @property {boolean} closed
 * @property {number} command
 */

/**
 * What the reader found in a shell text.
 * @typedef {object} ShellReading
 * @property {ReadWord[]} words
 * @property {string} plain The command outside single quotes.
 * @property {boolean} background
 * @property {number} commands
 * @property {readonly string[]} unmatchedQuotes
 * @property {boolean} incomplete
 * @property {readonly string[]} syntax
 * @property {readonly string[]} syntaxFaults
 * @property {readonly string[]} arithmetic
 * @property {readonly { readonly start: number, readonly end: number }[]} comments
 * Each comment of the text read, from its `#` to the end of its line; a
 * script handed to a shell or to eval contributes none.
 * @property {readonly ReadHeredoc[]} heredocs Each here-document of the text
 * read, in order; a script handed to a shell or to eval contributes none.
 */

/**
 * A `case` being read: which part of it the reader is in, and its scope.
 * @typedef {object} CaseFrame
 * @property {"header" | "pattern" | "body"} stage
 * @property {number | undefined} scope
 */

/**
 * The reader's state at the point a substitution opened, kept until it
 * closes.
 * @typedef {object} HeldFrame
 * @property {number} start
 * @property {string} bare
 * @property {string} text
 * @property {boolean} first
 * @property {string} quote
 * @property {number} parens
 * @property {boolean} redirect
 * @property {string} wrapper
 * @property {boolean} wrapperValue
 * @property {number} scope
 * @property {number} at
 * @property {boolean} ticking
 * @property {string} close
 */

/**
 * One command a shell text would run, by the words the text wrote.
 * @typedef {object} ReadCommand
 * @property {string[]} assignments The `NAME=value` words before its first
 * word.
 * @property {string[]} words Its words as the text wrote them, a wrapper
 * program such as env among them.
 * @property {boolean[]} expanded For each of its words, whether the shell
 * expands a parameter in it or substitutes a command or arithmetic.
 * @property {number} start Where its program's word starts in the text read.
 * @property {ReadHeredoc[]} heredocs The here-documents it reads, in order.
 */

/** The classifier could not establish a command's effect; generated hooks
 * advise the host. The word reader below throws it for a form it does not
 * split. */
export class HarnessCommandRefused extends Error {}

/** Two of the shell forms the classifier leaves to the host's permissions on
 * nearly every compound call: control syntax and a dynamic substitution. */
export const SHELL_CONTROL_SYNTAX =
  "Shell control syntax requires an explicit effect adapter";
export const DYNAMIC_SHELL_SUBSTITUTION =
  "Dynamic shell substitution requires an explicit effect adapter";

/**
 * One word of a command as the classifier judges it.
 * @typedef {object} ShellWord
 * @property {string} value
 * @property {boolean} dynamic
 * @property {boolean} quoted
 * @property {boolean} [expands] An unquoted, unescaped `*?[]{}~` the shell
 * may expand, or zsh's `=` expansion.
 * @property {boolean} [redirects] An unquoted, unescaped `<` or `>` the
 * shell reads as an operator.
 */

/**
 * One command of a line, with the pipeline it stands in and what its
 * here-documents feed it.
 * @typedef {object} ShellInvocation
 * @property {ShellWord[]} words
 * @property {readonly ShellInvocation[]} pipeline
 * @property {string[]} stdin
 */

/** The programs that read a script as shell text. */
export const shellPrograms = new Set([
  "bash",
  "sh",
  "zsh",
  "dash",
  "ksh",
  "csh",
  "tcsh",
]);
const controlWords = new Set([
  "if",
  "then",
  "elif",
  "else",
  "fi",
  "while",
  "until",
  "do",
  "done",
  "!",
]);

/** A command's words as the refusing classifier takes them: split as the
 * shell splits them, each keeping whether the shell expands it, with every
 * form the classifier cannot judge refused here, as it is met. Expansion
 * provenance is kept until effect operands and message bytes have been
 * classified; single-quoted and escaped dollars remain literal data. One
 * refusal turns on which program a command runs behind its wrappers, which
 * is the classifier's judgment: `programOf` is its answer for a command's
 * words.
 * @param {string} source
 * @param {(words: ShellWord[]) => ShellWord[]} programOf
 * @param {{simpleLists?: boolean}} [options] Require simple command boundaries
 * for diagnostic output that may expose a word identified as a program.
 * @returns {ShellInvocation[]} */
export function shellWords(source, programOf, { simpleLists = false } = {}) {
  const lines = source.split("\n");
  /** @type {ShellInvocation[]} */
  const commands = [];
  /** @type {ShellInvocation[]} */
  let pipeline = [];
  /** @type {{ start: number, input: ShellInvocation[], close: string }[]} */
  const groups = [];
  /** @type {ShellInvocation[] | undefined} */
  let completedGroup;
  /** @type {ShellWord[]} */
  let current = [];
  let word = "",
    quote = "",
    inWord = false,
    dynamic = false,
    quoted = false,
    expands = false,
    redirects = false,
    equals = -1;
  /** @type {{ delimiter: string, words: ShellWord[] }[]} */
  let heredocs = [];
  let needsDelimiter = false;
  // Whether the word read last is a redirection still waiting for its
  // target, as `>`, `2>` and `>&` are while no word follows them.
  let awaiting = false;
  const flush = () => {
    if (!inWord) return;
    awaiting = redirects && /[<>&]$/u.test(word);
    if (equals >= 0 && word.length > equals + 1) expands = true;
    if (needsDelimiter) {
      heredocs.push({ delimiter: word, words: current });
      needsDelimiter = false;
    } else if (!current.length && !quoted && controlWords.has(word)) {
      // These reserved words introduce a command list, not an executable.
      if (simpleLists) throw new HarnessCommandRefused(SHELL_CONTROL_SYNTAX);
    } else if (
      !current.length &&
      !quoted &&
      /^(for|select|case|function)$/.test(word)
    ) {
      throw new HarnessCommandRefused(SHELL_CONTROL_SYNTAX);
    } else current.push({ value: word, dynamic, quoted, expands, redirects });
    word = "";
    inWord = false;
    dynamic = false;
    quoted = false;
    expands = false;
    redirects = false;
    equals = -1;
  };
  const finish = (piped = false) => {
    flush();
    // A command that ends on a redirection with no target is none the shell
    // runs as it stands: `>|` is one operator to it (it writes over a file),
    // and a bare `>` before a separator is an error. Read on, the target or
    // the words after it would stand where the next command's program
    // stands. A diagnostic reading refuses the line.
    if (simpleLists && awaiting)
      throw new HarnessCommandRefused(SHELL_CONTROL_SYNTAX);
    if (!current.length) {
      if (piped && completedGroup) {
        pipeline = completedGroup;
        completedGroup = undefined;
      }
      return;
    }
    const invocation = { words: current, pipeline, stdin: [] };
    commands.push(invocation);
    pipeline = piped ? [...pipeline, invocation] : [];
    completedGroup = undefined;
    current = [];
  };
  for (let row = 0; row < lines.length; row++) {
    const line = /** @type {string} */ (lines[row]);
    let continued = false;
    for (let i = 0; i < line.length; i++) {
      const char = /** @type {string} */ (line[i]);
      if (quote === "'") {
        if (char === "'") quote = "";
        else word += char;
        continue;
      }
      if (char === "\\" && quote !== "'") {
        if (i === line.length - 1) {
          continued = true;
          break;
        }
        inWord = true;
        quoted = true;
        // In double quotes, backslash is special only before these characters.
        if (
          quote === '"' &&
          !/[\$`"\\]/.test(/** @type {string} */ (line[i + 1]))
        )
          word += "\\";
        word += line[++i] ?? "";
        continue;
      }
      if (char === "`" || (char === "$" && line[i + 1] === "("))
        throw new HarnessCommandRefused(DYNAMIC_SHELL_SUBSTITUTION);
      // zsh also expands `$=name`, `$^name`, `$~name` and `$+name`.
      // The shell reads `$'…'` with escapes of its own, an escaped quote
      // among them, which the quoting below does not follow.
      if (simpleLists && !quote && char === "$" && line[i + 1] === "'")
        throw new HarnessCommandRefused(DYNAMIC_SHELL_SUBSTITUTION);
      if (char === "$" && /[A-Za-z0-9_{$'"@*#?!=^~+-]/.test(line[i + 1] ?? ""))
        dynamic = true;
      if (quote === '"') {
        if (char === '"') quote = "";
        else word += char;
        continue;
      }
      if (char === "'" || char === '"') {
        quote = char;
        inWord = true;
        quoted = true;
        continue;
      }
      // The shell opens a comment at a `#` set against a redirection, which
      // leaves the redirection without its target: the comment's words are
      // no command's.
      if (
        simpleLists &&
        char === "#" &&
        inWord &&
        redirects &&
        /[<>&]$/u.test(word)
      )
        throw new HarnessCommandRefused(SHELL_CONTROL_SYNTAX);
      if (char === "#" && !inWord) break;
      // In a conditional, pattern or array a list separator can belong to
      // the enclosing expression. Only the general reader flattens groups.
      if (simpleLists && (/[()[\]{}]/u.test(char) || line.startsWith("<<", i)))
        throw new HarnessCommandRefused(SHELL_CONTROL_SYNTAX);
      // A shell's blanks are space and tab; lines are already split. Any other
      // whitespace stays inside its word, where a `#` begins no comment.
      if (char === " " || char === "\t") {
        flush();
        continue;
      }
      if (completedGroup && /[<>]/.test(char))
        throw new HarnessCommandRefused(
          "Redirected shell group requires an explicit effect adapter",
        );
      if ((char === "<" || char === ">") && line[i + 1] === "(")
        throw new HarnessCommandRefused(
          "Shell process substitution requires an explicit effect adapter",
        );
      if (char === "<" && line[i + 1] === "<") {
        if (line[i + 2] === "<")
          throw new HarnessCommandRefused(
            "Shell here-string requires an explicit effect adapter",
          );
        flush();
        i++;
        if (line[i + 1] === "-") i++;
        needsDelimiter = true;
        continue;
      }
      // File-descriptor duplication is one redirection, never a command-list
      // separator. Keep its token as data without losing the producer stage.
      if (
        ((char === ">" || char === "<") && line[i + 1] === "&") ||
        (char === "&" && line[i + 1] === ">")
      ) {
        inWord = true;
        redirects = true;
        word += char + line[++i];
        if (line[i] === ">" && line[i + 1] === ">") word += line[++i];
        continue;
      }
      if (
        char === ";" ||
        char === "|" ||
        char === "&" ||
        char === "(" ||
        char === ")" ||
        (!inWord &&
          !current.length &&
          (char === "{" || char === "}") &&
          (!line[i + 1] || /[\s;)]/.test(/** @type {string} */ (line[i + 1]))))
      ) {
        if (char === "(" || char === "{") {
          finish();
          groups.push({
            start: commands.length,
            input: pipeline,
            close: char === "(" ? ")" : "}",
          });
          completedGroup = undefined;
          continue;
        }
        if (char === ")" || char === "}") {
          finish();
          const group = groups.pop();
          if (!group || group.close !== char)
            throw new HarnessCommandRefused("Unmatched shell group");
          // Every command can contribute output, not just the group's last one.
          completedGroup = [...group.input, ...commands.slice(group.start)];
          pipeline = [];
          continue;
        }
        const piped = char === "|" && line[i + 1] !== "|";
        finish(piped);
        if (!piped) {
          pipeline = [];
          completedGroup = undefined;
        }
        if (char === "|" && /[|&]/.test(line[i + 1] ?? "")) i++;
        continue;
      }
      inWord = true;
      if (/[*?\[\]{}~]/.test(char)) expands = true;
      // zsh expands `=name` to a command path at the start of a word, even
      // after empty quotes, and after `=` or `:` in an assignment value; a
      // `=` with nothing after it stays literal (judged at flush).
      if (char === "=" && equals < 0 && /(?:^|[=:])$/.test(word))
        equals = word.length;
      if (char === "<" || char === ">") redirects = true;
      word += char;
    }
    if (continued) {
      if (row === lines.length - 1)
        throw new HarnessCommandRefused("Unclosed shell continuation");
      continue;
    }
    if (quote) {
      if (row === lines.length - 1)
        throw new HarnessCommandRefused("Unclosed shell quotation");
      word += "\n";
      continue;
    }
    finish();
    if (needsDelimiter)
      throw new HarnessCommandRefused("Unclassified shell heredoc delimiter");
    for (const { delimiter, words } of heredocs) {
      /** @type {string[]} */
      const body = [];
      while (
        ++row < lines.length &&
        /** @type {string} */ (lines[row]).replace(/^\t+/, "") !== delimiter
      )
        body.push(/** @type {string} */ (lines[row]));
      if (row >= lines.length)
        throw new HarnessCommandRefused("Unclosed shell heredoc");
      /** @type {ShellInvocation} */ (
        commands.find((command) => command.words === words)
      ).stdin.push(body.join("\n"));
      const own = programOf(words)[0]?.value;
      if (
        !shellPrograms.has(own ?? "") &&
        /\$\(|`/.test(body.join("\n")) &&
        !line.includes(`'${delimiter}'`) &&
        !line.includes(`"${delimiter}"`)
      )
        throw new HarnessCommandRefused(
          "Dynamic heredoc requires an explicit effect adapter",
        );
    }
    heredocs = [];
  }
  if (groups.length) throw new HarnessCommandRefused("Unclosed shell group");
  return commands;
}

const readControl = new Set([
  "if",
  "then",
  "elif",
  "else",
  "while",
  "until",
  "do",
  "!",
  "{",
  "time",
  "command",
  "builtin",
  "noglob",
  "nocorrect",
  "exec",
]);
const readWrappers = new Set([
  "command",
  "builtin",
  "exec",
  "noglob",
  "nocorrect",
  "time",
]);
const readShells = new Set(["zsh", "bash", "sh", "dash", "ksh"]);
// An advisory may decline a costly shape; it never delays or refuses the call.
export const READ_LIMIT = 32768;
const READ_NESTING = 64;
/** Thrown for a text nested deeper than the reader follows. */
export class ShellReadingLimit extends Error {}
// Text the shell takes as written stands in the private use area, so that a
// quoted `$` or brace is never read as one zsh changes.
/** @param {string} char */
const asHeld = (char) =>
  /[${}~\u0000]/.test(char)
    ? String.fromCharCode(0xe000 + char.charCodeAt(0))
    : char;
/** @param {string} text */
const asWritten = (text) =>
  text.replace(/[\ue000-\ue07f]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xe000),
  );
/** A read word's text as the shell passes it, held characters restored. */
export const writtenText = asWritten;

// The escapes of a $'...' quote, which bash and zsh both read: one character
// after the backslash, or an octal, hexadecimal or Unicode code.
/** @type {Readonly<Record<string, string>>} */
const ansiEscapes = {
  a: "\u0007",
  b: "\b",
  e: "\u001b",
  E: "\u001b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  v: "\v",
  "\\": "\\",
  "'": "'",
  '"': '"',
  "?": "?",
};
/** The character an escape inside $'...' stands for, and how many characters
 * after the backslash it takes. An unknown escape keeps its backslash.
 * @param {string} source
 * @param {number} at
 * @returns {[string, number]} */
function ansiEscape(source, at) {
  const char = source[at] ?? "";
  if (char in ansiEscapes)
    return [/** @type {string} */ (ansiEscapes[char]), 1];
  /** @type {(pattern: RegExp, base: number, skip: number) => [string, number] | null} */
  const code = (pattern, base, skip) => {
    const digits = pattern.exec(source.slice(at + skip))?.[0] ?? "";
    const point = parseInt(digits, base);
    return digits && point <= 0x10ffff
      ? [String.fromCodePoint(point), skip + digits.length]
      : null;
  };
  /** @type {[string, number] | null} */
  const coded = /[0-7]/.test(char)
    ? code(/^[0-7]{1,3}/, 8, 0)
    : char === "x"
      ? code(/^[\da-fA-F]{1,2}/, 16, 1)
      : char === "u"
        ? code(/^[\da-fA-F]{1,4}/, 16, 1)
        : char === "U"
          ? code(/^[\da-fA-F]{1,8}/, 16, 1)
          : char === "c" && at + 1 < source.length
            ? [String.fromCharCode(source.charCodeAt(at + 1) & 0x1f), 2]
            : null;
  return coded ?? [`\\${char}`, char ? 1 : 0];
}

/** The command's words as the shell splits them, read without refusing any
 * form: control syntax, substitutions and heredocs are read, and a script
 * handed to a shell or to eval is read as a command of its own. Text past
 * `limit` is not read.
 * @param {string} full
 * @param {number} [depth]
 * @param {number} [limit]
 * @returns {ShellReading} */
export function readShellCommand(full, depth = 0, limit = READ_LIMIT) {
  const source = full.length > limit ? full.slice(0, limit) : full;
  /** @type {ReadWord[]} */
  const words = [];
  /** @type {{ start: number, end: number }[]} */
  const comments = [];
  /** @type {ReadHeredoc[]} */
  const heredocs = [];
  /** @type {string[]} */
  const unmatchedQuotes = [];
  let incomplete = false;
  /** @type {string[]} */
  const syntax = [];
  /** @type {string[]} */
  const syntaxFaults = [];
  /** @type {string[]} */
  const arithmetic = [];
  /** @type {CaseFrame[]} */
  const cases = [];
  /** @type {number[]} */
  const scopes = [];
  const currentCase = () =>
    cases.at(-1)?.scope === scopes.at(-1) ? cases.at(-1) : undefined;
  let scopeSerial = 0,
    lastSyntax = "";
  /** @type {HeldFrame[]} */
  const stack = [];
  let plain = "",
    bare = "",
    text = "",
    quote = "";
  let start = -1,
    first = true,
    parens = 0,
    command = 0,
    ticks = 0,
    redirect = false,
    wrapper = "",
    wrapperValue = false,
    background = false;
  /** @type {{ delimiter: string, strip: boolean, quoted: boolean, command: number }[]} */
  let awaited = [];
  /** @param {number} end */
  const flush = (end) => {
    if (start >= 0) {
      const literal = asWritten(text);
      const wrapperFlag = first && Boolean(wrapper) && bare.startsWith("-");
      const consumeValue = first && wrapperValue;
      const position =
        currentCase()?.stage === "pattern" && bare !== "esac"
          ? "pattern"
          : redirect
            ? "redirect"
            : wrapperFlag || consumeValue
              ? "control"
              : !first
                ? "argument"
                : /^[A-Za-z_]\w*\+?=/.test(bare)
                  ? "assignment"
                  : readControl.has(bare) || readWrappers.has(literal)
                    ? "control"
                    : "head";
      words.push({
        raw: source.slice(start, end),
        start,
        end,
        bare,
        text,
        position,
        command,
        scope: scopes.join("/"),
        ticked: ticks > 0,
        heredoc: false,
      });
      if (position === "head" || position === "control") {
        if (bare === "case")
          cases.push({ stage: "header", scope: scopes.at(-1) });
        else if (bare === "esac") cases.pop();
      }
      if (bare === "in" && currentCase()?.stage === "header")
        /** @type {CaseFrame} */ (currentCase()).stage = "pattern";
      if (position === "head") {
        first = false;
        wrapper = "";
      }
      if (consumeValue) wrapperValue = false;
      if (wrapperFlag && wrapper === "exec" && bare === "-a")
        wrapperValue = true;
      if (wrapperFlag && wrapper === "command" && /^-[p]*[vV]/.test(bare))
        first = false;
      if (position === "control" && readWrappers.has(literal))
        wrapper = literal;
      redirect = false;
      lastSyntax = "";
    }
    start = -1;
    bare = "";
    text = "";
  };
  /** @param {number} end */
  const finish = (end) => {
    flush(end);
    first = true;
    redirect = false;
    wrapper = "";
    wrapperValue = false;
    command++;
  };
  for (let i = 0; i < source.length; i++) {
    if (scopes.length > READ_NESTING || parens > READ_NESTING)
      throw new ShellReadingLimit();
    const char = /** @type {string} */ (source[i]);
    if (quote === "'") {
      if (char === "'") quote = "";
      else text += asHeld(char);
      continue;
    }
    if (char === "\\") {
      if (source[i + 1] === "\n") i++;
      else if (i + 1 < source.length) {
        if (start < 0) start = i;
        if (!quote) bare += "\u0000";
        plain += char + /** @type {string} */ (source[i + 1]);
        text += asHeld(/** @type {string} */ (source[++i]));
      }
      continue;
    }
    const processSubstitution =
      !quote &&
      source[i + 1] === "(" &&
      (/[<>]/.test(char) || (char === "=" && start < 0));
    const substitutes =
      (char === "$" && source[i + 1] === "(" && source[i + 2] !== "(") ||
      processSubstitution;
    const arithmeticWidth = source.startsWith("$((", i)
      ? 3
      : !quote && first && start < 0 && source.startsWith("((", i)
        ? 2
        : 0;
    if (arithmeticWidth) {
      let level = 2,
        at = i + arithmeticWidth;
      for (; at < source.length; at++) {
        if (source[at] === "(") level++;
        else if (source[at] === ")") level--;
        if (level > READ_NESTING) throw new ShellReadingLimit();
        if (level === 0) break;
      }
      arithmetic.push(
        source.slice(i + arithmeticWidth, level === 0 ? at - 1 : at),
      );
      incomplete ||= level !== 0;
      if (start < 0) start = i;
      bare += "\u0000";
      text += "\u0000";
      plain += source.slice(i, at + 1);
      i = at;
      continue;
    }
    if (quote === '"' && !substitutes && char !== "`") {
      if (char === '"') quote = "";
      else {
        plain += char;
        text += /[{}~]/.test(char) ? asHeld(char) : char;
      }
      continue;
    }
    // Bash and zsh read $'...' as a quote whose backslash escapes stand for
    // the characters they name; the shell takes the result as written.
    if (!quote && char === "$" && source[i + 1] === "'") {
      if (start < 0) start = i;
      bare += "\u0000";
      plain += char;
      let at = i + 2;
      for (; at < source.length && source[at] !== "'"; at++)
        if (source[at] === "\\") {
          const [value, width] = ansiEscape(source, at + 1);
          for (const held of value) text += asHeld(held);
          at += width;
        } else text += asHeld(/** @type {string} */ (source[at]));
      if (at >= source.length) quote = "'";
      i = at;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      if (start < 0) start = i;
      bare += "\u0000";
      continue;
    }
    if (parens && !substitutes && char !== "`") {
      bare += char;
      text += char;
      plain += char;
      if (char === "(") parens++;
      else if (char === ")") parens--;
      continue;
    }
    if (char === "\n") {
      finish(i);
      plain += char;
      let at = i + 1,
        body = "";
      // Where each line of the body read starts in the source, so that a
      // substitution's words keep their place.
      /** @type {[number, number][]} */
      const bodyLines = [];
      for (const { delimiter, strip, quoted, command: owner } of awaited) {
        const bodyStart = Math.min(at, source.length);
        let bodyEnd = source.length,
          closed = false;
        while (at <= source.length) {
          const end = source.indexOf("\n", at);
          const stop = end < 0 ? source.length : end;
          const line = source.slice(at, stop);
          if ((strip ? line.replace(/^\t+/, "") : line) === delimiter) {
            bodyEnd = at;
            closed = true;
            at = stop + 1;
            break;
          }
          if (!quoted) {
            bodyLines.push([body.length, at]);
            body += `${line}\n`;
          }
          at = stop + 1;
        }
        heredocs.push({
          start: bodyStart,
          end: Math.max(bodyStart, bodyEnd),
          delimiter,
          quoted,
          strip,
          closed,
          command: owner,
        });
      }
      if (awaited.length) i = at - 1;
      awaited = [];
      plain += body;
      // A heredoc whose delimiter is not quoted runs the substitutions its
      // body holds.
      if (depth < 2)
        for (const { 0: whole, 1: called, 2: ticked, index } of body.matchAll(
          /\$\(((?:[^()]|\([^()]*\))*)\)|`([^`]*)`/g,
        )) {
          let place = index;
          for (const [offset, from] of bodyLines)
            if (offset <= index) place = from + index - offset;
          const inner = readShellCommand(
            called ?? ticked ?? "",
            depth + 1,
            limit,
          );
          unmatchedQuotes.push(...inner.unmatchedQuotes);
          incomplete ||= inner.incomplete;
          syntax.push(...inner.syntax);
          syntaxFaults.push(...inner.syntaxFaults);
          arithmetic.push(...inner.arithmetic);
          for (const word of inner.words)
            words.push({
              ...word,
              start: place,
              end: place + whole.length,
              command: word.command + command + 1,
              heredoc: true,
              ticked: word.ticked || ticked !== undefined,
            });
          command += inner.commands + 1;
        }
      continue;
    }
    if (char === "#" && start < 0) {
      const end = source.indexOf("\n", i);
      comments.push({ start: i, end: end < 0 ? source.length : end });
      i = (end < 0 ? source.length : end) - 1;
      continue;
    }
    if (char === " " || char === "\t") {
      flush(i);
      plain += char;
      continue;
    }
    if (substitutes || (char === "`" && stack.at(-1)?.close !== "`")) {
      const ticking = quote === '"' && !substitutes;
      stack.push({
        start: start < 0 ? i : start,
        bare: quote ? bare : `${bare}\u0000`,
        text: `${text}\u0000`,
        first,
        quote,
        parens,
        redirect,
        wrapper,
        wrapperValue,
        scope: ++scopeSerial,
        at: i,
        ticking,
        close: substitutes ? ")" : "`",
      });
      if (ticking) ticks++;
      start = -1;
      bare = "";
      text = "";
      quote = "";
      parens = 0;
      redirect = false;
      first = true;
      wrapper = "";
      wrapperValue = false;
      scopes.push(scopeSerial);
      command++;
      plain += substitutes ? `${char}(` : char;
      if (substitutes) i++;
      continue;
    }
    const outer = stack.at(-1);
    if (outer && char === outer.close && scopes.at(-1) === outer.scope) {
      finish(i);
      stack.pop();
      scopes.pop();
      if (outer.ticking) ticks--;
      ({
        start,
        bare,
        text,
        first,
        quote,
        parens,
        redirect,
        wrapper,
        wrapperValue,
      } = outer);
      plain += char;
      continue;
    }
    // A parenthesis after a word, or among a command's arguments, opens a
    // pattern and not a group.
    if (char === "(" && currentCase()?.stage === "pattern" && start < 0) {
      // Optional case-arm opener; its closing parenthesis starts the body.
      plain += char;
      continue;
    }
    if (
      char === "(" &&
      source[i + 1] !== ")" &&
      (start < 0 ? !first : !/[$=]$/.test(bare))
    ) {
      if (start < 0) start = i;
      parens = 1;
      bare += char;
      text += char;
      plain += char;
      continue;
    }
    // A here-string's word is the command's input, read as a redirection's
    // operand; no body follows it.
    if (source.startsWith("<<<", i)) {
      flush(i);
      redirect = true;
      plain += "<<<";
      i += 2;
      continue;
    }
    if (char === "<" && source[i + 1] === "<") {
      flush(i);
      let at = i + 2;
      const strip = source[at] === "-";
      if (strip) at++;
      while (source[at] === " " || source[at] === "\t") at++;
      let delimiter = "",
        quoted = false;
      for (
        ;
        at < source.length &&
        !/[\s;|&()<>]/.test(/** @type {string} */ (source[at]));
        at++
      ) {
        const mark = /** @type {string} */ (source[at]);
        if (mark === "'" || mark === '"') {
          const end = source.indexOf(mark, at + 1);
          quoted = true;
          delimiter += source.slice(at + 1, end < 0 ? source.length : end);
          at = end < 0 ? source.length : end;
        } else if (mark === "\\") {
          quoted = true;
          delimiter += source[++at] ?? "";
        } else delimiter += mark;
      }
      if (delimiter) awaited.push({ delimiter, strip, quoted, command });
      plain += " ";
      i = at - 1;
      continue;
    }
    // A duplicated descriptor is one redirection, not a list separator.
    if (
      char === "&" &&
      (/[<>]/.test(source[i - 1] ?? "") || source[i + 1] === ">")
    ) {
      flush(i);
      plain += char;
      continue;
    }
    if (
      char === ";" ||
      char === "|" ||
      char === "&" ||
      char === "(" ||
      char === ")"
    ) {
      if (char === "&" && source[i + 1] !== "&" && source[i - 1] !== "&")
        background = true;
      const previousSyntax = start < 0 ? lastSyntax : "";
      finish(i);
      if (char === "(" && currentCase()?.stage !== "pattern")
        scopes.push(++scopeSerial);
      else if (char === ")") {
        if (currentCase()?.stage === "pattern")
          /** @type {CaseFrame} */ (currentCase()).stage = "body";
        else {
          if (!scopes.length) syntaxFaults.push(")");
          scopes.pop();
        }
      }
      const operator =
        (char === "|" || char === "&" || char === ";") && source[i + 1] === char
          ? char + source[++i]
          : char;
      if (operator === ";;") {
        if (!currentCase()) syntaxFaults.push(operator);
        else /** @type {CaseFrame} */ (currentCase()).stage = "pattern";
      }
      if (["|", "||", "&&"].includes(previousSyntax))
        syntaxFaults.push(operator);
      syntax.push(operator);
      lastSyntax = operator;
      plain += char;
      continue;
    }
    if (char === "<" || char === ">") {
      // A descriptor prefix belongs to the redirection, not a command head.
      if (/^\d+$/.test(bare)) {
        start = -1;
        bare = "";
        text = "";
      } else flush(i);
      redirect = true;
      plain += char;
      continue;
    }
    if (start < 0) start = i;
    bare += char;
    text += char;
    plain += char;
  }
  finish(source.length);
  if (depth < 2)
    for (const [index, word] of [...words].entries()) {
      if (word.position !== "head") continue;
      const name = asWritten(word.text).replace(/^.*\//, "");
      /** @type {ReadWord[]} */
      const rest = [];
      for (
        let next = words[index + 1];
        next?.command === word.command;
        next = words[index + 1 + rest.length]
      )
        rest.push(next);
      const flag = rest.findIndex((option) =>
        /^-[A-Za-z]*c$/.test(option.bare),
      );
      const script =
        name === "eval"
          ? rest.map((argument) => asWritten(argument.text)).join(" ")
          : readShells.has(name) && flag >= 0
            ? asWritten(rest[flag + 1]?.text ?? "")
            : "";
      if (!script) continue;
      const inner = readShellCommand(
        script.replaceAll("\u0000", " "),
        depth + 1,
        limit,
      );
      const carrier = {
        start: word.start,
        end: (name === "eval" ? rest.at(-1) : rest[flag + 1])?.end ?? word.end,
      };
      unmatchedQuotes.push(...inner.unmatchedQuotes);
      incomplete ||= inner.incomplete;
      syntax.push(...inner.syntax);
      syntaxFaults.push(...inner.syntaxFaults);
      arithmetic.push(...inner.arithmetic);
      for (const within of inner.words)
        words.push({
          ...within,
          ...carrier,
          command: within.command + command + 1,
          scope:
            name === "eval"
              ? [word.scope, within.scope].filter(Boolean).join("/")
              : `${word.scope}/script-${word.command}/${within.scope}`,
        });
      command += inner.commands + 1;
      plain += `\n${inner.plain}`;
      background ||= inner.background;
    }
  if (quote) unmatchedQuotes.push(quote);
  for (const held of stack) {
    if (held.quote) unmatchedQuotes.push(held.quote);
    syntaxFaults.push(source.slice(held.at));
  }
  if (stack.some(({ close }) => close === "`")) unmatchedQuotes.push("`");
  /** @type {{ close: string, needs: string | null }[]} */
  const blocks = [];
  for (const { bare, position } of words) {
    if (position !== "head" && position !== "control") continue;
    const close = /** @type {Record<string, string>} */ ({
      if: "fi",
      for: "done",
      select: "done",
      while: "done",
      until: "done",
      case: "esac",
      "{": "}",
    })[bare];
    if (close)
      blocks.push({
        close,
        needs:
          bare === "if"
            ? "then"
            : /^(for|select|while|until)$/.test(bare)
              ? "do"
              : null,
      });
    else if (["then", "do"].includes(bare)) {
      if (blocks.at(-1)?.needs === bare)
        /** @type {{ needs: string | null }} */ (blocks.at(-1)).needs = null;
      else syntaxFaults.push(bare);
    } else if (["fi", "done", "esac", "}"].includes(bare)) {
      if (blocks.at(-1)?.close !== bare || blocks.at(-1)?.needs)
        syntaxFaults.push(bare);
      if (blocks.at(-1)?.close === bare) blocks.pop();
    } else if (["else", "elif"].includes(bare)) {
      if (blocks.at(-1)?.close !== "fi" || blocks.at(-1)?.needs)
        syntaxFaults.push(bare);
      else if (bare === "elif")
        /** @type {{ needs: string | null }} */ (blocks.at(-1)).needs = "then";
    }
  }
  incomplete ||= Boolean(
    quote ||
    stack.length ||
    blocks.length ||
    scopes.length ||
    ["|", "||", "&&"].includes(lastSyntax),
  );
  return {
    words,
    plain,
    background,
    commands: command,
    unmatchedQuotes,
    incomplete,
    syntax,
    syntaxFaults,
    arithmetic,
    comments,
    heredocs,
  };
}

/** The non-refusing reading of a shell text, or null for one nested deeper
 * than the reader follows. A hook reads one command up to the advisory's
 * length bound; `whole` reads a script of any length, as a script's reader
 * outside the hooks does.
 * @param {string} source
 * @param {{ readonly whole?: boolean }} [options]
 * @returns {ShellReading | null} */
export function readShellText(source, { whole = false } = {}) {
  try {
    return readShellCommand(source, 0, whole ? Infinity : READ_LIMIT);
  } catch (error) {
    if (error instanceof ShellReadingLimit) return null;
    throw error;
  }
}

/** Every command of a reading, by the words the text wrote: control syntax,
 * a substitution and a script handed to a shell or to eval are read, so a
 * program inside one is found, while quoted text stays its command's
 * argument. Text the shell substitutes stands as U+0000.
 * @param {ShellReading} reading
 * @returns {ReadCommand[]} */
export function readCommands(reading) {
  /** @type {ReadCommand[]} */
  const rows = [];
  /** @type {Map<number, string[]>} */
  const assignments = new Map();
  // A substitution inside a word advances the reading's command number, so
  // the words after it are joined to their command by the scope they stand in.
  /** @type {Map<string, ReadCommand>} */
  const latest = new Map();
  for (const { position, scope, command, text, start } of reading.words) {
    const word = writtenText(text);
    const expanded = /[$\u0000]/.test(text);
    if (position === "assignment")
      assignments.set(command, [...(assignments.get(command) ?? []), word]);
    else if (position === "head") {
      const row = {
        assignments: assignments.get(command) ?? [],
        words: [word],
        expanded: [expanded],
        start,
        heredocs: reading.heredocs.filter(
          (heredoc) => heredoc.command === command,
        ),
      };
      rows.push(row);
      latest.set(scope, row);
    } else if (position === "argument") {
      latest.get(scope)?.words.push(word);
      latest.get(scope)?.expanded.push(expanded);
    }
  }
  return rows;
}
