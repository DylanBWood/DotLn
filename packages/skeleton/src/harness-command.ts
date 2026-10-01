import { basename } from "node:path";

/** Classification could not establish an effect; generated hooks advise the host. */
export class HarnessCommandRefused extends Error {}

/** Effect inventory for the tools exposed by the observed harness profiles.
 * Unknown names are never presumed to be reads. Opaque shell/delegation routes
 * are delegated to host permissions when their effects cannot be classified.
 */
export const harnessToolEffects = {
  Read: "read",
  // Native schema-result submission carries data only; it cannot execute or
  // mutate the worktree. WO-053 observed this tool denied by the unknown-tool
  // branch, preventing Claude from returning its validated writer envelope.
  StructuredOutput: "read",
  Glob: "read",
  Grep: "read",
  WebFetch: "read",
  WebSearch: "read",
  ListMcpResourcesTool: "read",
  ReadMcpResourceTool: "read",
  ToolSearch: "read",
  Edit: "write",
  Write: "write",
  NotebookEdit: "write",
  Bash: "shell",
  Monitor: "shell",
  TaskOutput: "read",
  // Ending a task this session started changes no repository byte and is the
  // session's own route out of a running gate; a stopped gate records nothing.
  KillShell: "stop",
  TaskStop: "stop",
  Agent: "spawn",
  Task: "spawn",
  // A workflow orchestrates subagents of this session; the orchestration itself
  // touches no repository byte, and each subagent's own tool calls pass these
  // same guards.
  Workflow: "spawn",
  Skill: "interaction",
  TodoWrite: "interaction",
  AskUserQuestion: "interaction",
  EnterPlanMode: "interaction",
  ExitPlanMode: "interaction",
  exec_command: "shell",
  write_stdin: "shell",
  apply_patch: "write",
  "functions.exec": "shell",
  "collaboration.spawn_agent": "spawn",
} as const;

interface ShellWord {
  readonly value: string;
  readonly dynamic: boolean;
  readonly quoted: boolean;
  /** WO-158: an unquoted, unescaped `*?[]{}~` the shell may expand; WO-168
   * adds zsh's `=` expansion. */
  readonly expands?: boolean;
  /** WO-168: an unquoted, unescaped `<` or `>` the shell reads as an operator. */
  readonly redirects?: boolean;
}
interface ShellInvocation {
  readonly words: ShellWord[];
  readonly pipeline: readonly ShellInvocation[];
  readonly stdin: string[];
}
const shellPrograms = new Set([
  "bash",
  "sh",
  "zsh",
  "dash",
  "ksh",
  "csh",
  "tcsh",
]);
const literal = (value: string): ShellWord => ({
  value,
  dynamic: false,
  quoted: false,
});
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

/** Preserve expansion provenance until effect operands and message bytes have
 * been classified. Single-quoted and escaped dollars remain literal data.
 */
function shellWords(source: string): ShellInvocation[] {
  const lines = source.split("\n");
  const commands: ShellInvocation[] = [];
  let pipeline: ShellInvocation[] = [];
  const groups: { start: number; input: ShellInvocation[]; close: string }[] =
    [];
  let completedGroup: ShellInvocation[] | undefined;
  let current: ShellWord[] = [];
  let word = "",
    quote = "",
    inWord = false,
    dynamic = false,
    quoted = false,
    expands = false,
    redirects = false,
    equals = -1;
  let heredocs: { delimiter: string; words: ShellWord[] }[] = [];
  let needsDelimiter = false;
  const flush = () => {
    if (!inWord) return;
    if (equals >= 0 && word.length > equals + 1) expands = true;
    if (needsDelimiter) {
      heredocs.push({ delimiter: word, words: current });
      needsDelimiter = false;
    } else if (!current.length && !quoted && controlWords.has(word)) {
      // These reserved words introduce a command list, not an executable.
    } else if (
      !current.length &&
      !quoted &&
      /^(for|select|case|function)$/.test(word)
    ) {
      throw new HarnessCommandRefused(
        "Shell control syntax requires an explicit effect adapter",
      );
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
    const line = lines[row]!;
    let continued = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i]!;
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
        if (quote === '"' && !/[\$`"\\]/.test(line[i + 1]!)) word += "\\";
        word += line[++i] ?? "";
        continue;
      }
      if (char === "`" || (char === "$" && line[i + 1] === "("))
        throw new HarnessCommandRefused(
          "Dynamic shell substitution requires an explicit effect adapter",
        );
      // zsh also expands `$=name`, `$^name`, `$~name` and `$+name`.
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
      if (char === "#" && !inWord) break;
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
          (!line[i + 1] || /[\s;)]/.test(line[i + 1]!)))
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
      const body: string[] = [];
      while (
        ++row < lines.length &&
        lines[row]!.replace(/^\t+/, "") !== delimiter
      )
        body.push(lines[row]!);
      if (row >= lines.length)
        throw new HarnessCommandRefused("Unclosed shell heredoc");
      commands
        .find((command) => command.words === words)!
        .stdin.push(body.join("\n"));
      const own = invocationProgram(words)[0]?.value;
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

/** Public token view for diagnostics; classification uses the provenance above. */
export function shellInvocations(source: string): string[][] {
  return shellWords(source).map(({ words }) => words.map((word) => word.value));
}

/** WO-172: what the shell itself said about a command as written. zsh begins
 * such a line with its own name, the name of a builtin that refused and a
 * line number. The same text inside other output is not this command's
 * diagnostic, so a class counts only when the command's own words bear it
 * out, and the guidance holds only what the command itself wrote. */
export type ShellDiagnosticKind =
  | "unmatched-pattern"
  | "bad-pattern"
  | "equals-word"
  | "program-not-found"
  | "unsplit-word"
  | "reserved-parameter"
  | "bad-substitution"
  | "bad-subscript"
  | "bad-math"
  | "bash-parameter"
  | "builtin-option"
  | "unmatched-quote"
  | "parse-error"
  | "missing-file"
  | "not-permitted"
  | "other";
export interface ShellDiagnostic {
  readonly kind: ShellDiagnosticKind;
  /** What the command wrote that the line is about, bounded and without
   * control or format characters; never text that only the output holds. */
  readonly written: string;
  /** How the command wrote it, where the class's guidance turns on it. */
  readonly form: string;
  /** The word with its pattern quoted, where the command's text gives one. */
  readonly remedy?: string;
}
interface ReadWord {
  /** The word as the command wrote it. */
  readonly raw: string;
  /** What stood outside quotes, U+0000 where quoted or substituted text stood. */
  readonly bare: string;
  /** The word without its quotes. */
  readonly text: string;
  readonly position:
    "assignment" | "control" | "head" | "argument" | "redirect" | "pattern";
  readonly command: number;
  readonly scope: string;
  /** Inside backquotes that stand in double quotes or an unquoted heredoc. */
  readonly ticked: boolean;
  /** Inside a substitution of a heredoc whose delimiter is not quoted. */
  readonly heredoc: boolean;
}
interface ShellReading {
  readonly words: ReadWord[];
  /** The command outside single quotes. */
  readonly plain: string;
  readonly background: boolean;
  readonly commands: number;
  readonly unmatchedQuotes: readonly string[];
  readonly incomplete: boolean;
  readonly syntax: readonly string[];
  readonly syntaxFaults: readonly string[];
  readonly arithmetic: readonly string[];
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
const READ_LIMIT = 32768;
const READ_NESTING = 64;
class ShellReadingLimit extends Error {}
// Text the shell takes as written stands in the private use area, so that a
// quoted `$` or brace is never read as one zsh changes.
const asHeld = (char: string) =>
  /[${}~\u0000]/.test(char)
    ? String.fromCharCode(0xe000 + char.charCodeAt(0))
    : char;
const asWritten = (text: string) =>
  text.replace(/[\ue000-\ue07f]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xe000),
  );

/** The command's words as the shell splits them, read without refusing any
 * form: control syntax, substitutions and heredocs are read, and a script
 * handed to a shell or to eval is read as a command of its own. */
function readShellCommand(full: string, depth = 0): ShellReading {
  const source = full.length > READ_LIMIT ? full.slice(0, READ_LIMIT) : full;
  const words: ReadWord[] = [];
  const unmatchedQuotes: string[] = [];
  let incomplete = false;
  const syntax: string[] = [];
  const syntaxFaults: string[] = [];
  const arithmetic: string[] = [];
  const cases: {
    stage: "header" | "pattern" | "body";
    scope: number | undefined;
  }[] = [];
  const scopes: number[] = [];
  const currentCase = () =>
    cases.at(-1)?.scope === scopes.at(-1) ? cases.at(-1) : undefined;
  let scopeSerial = 0,
    lastSyntax = "";
  const stack: {
    start: number;
    bare: string;
    text: string;
    first: boolean;
    quote: string;
    parens: number;
    redirect: boolean;
    wrapper: string;
    wrapperValue: boolean;
    scope: number;
    at: number;
    ticking: boolean;
    close: string;
  }[] = [];
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
  let awaited: { delimiter: string; strip: boolean; quoted: boolean }[] = [];
  const flush = (end: number) => {
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
        currentCase()!.stage = "pattern";
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
  const finish = (end: number) => {
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
    const char = source[i]!;
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
        plain += char + source[i + 1]!;
        text += asHeld(source[++i]!);
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
      for (const { delimiter, strip, quoted } of awaited)
        while (at <= source.length) {
          const end = source.indexOf("\n", at);
          const stop = end < 0 ? source.length : end;
          const line = source.slice(at, stop);
          at = stop + 1;
          if ((strip ? line.replace(/^\t+/, "") : line) === delimiter) break;
          if (!quoted) body += `${line}\n`;
        }
      if (awaited.length) i = at - 1;
      awaited = [];
      plain += body;
      // A heredoc whose delimiter is not quoted runs the substitutions its
      // body holds.
      if (depth < 2)
        for (const [, called, ticked] of body.matchAll(
          /\$\(((?:[^()]|\([^()]*\))*)\)|`([^`]*)`/g,
        )) {
          const inner = readShellCommand(called ?? ticked ?? "", depth + 1);
          unmatchedQuotes.push(...inner.unmatchedQuotes);
          incomplete ||= inner.incomplete;
          syntax.push(...inner.syntax);
          syntaxFaults.push(...inner.syntaxFaults);
          arithmetic.push(...inner.arithmetic);
          for (const word of inner.words)
            words.push({
              ...word,
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
    if (char === "<" && source[i + 1] === "<" && source[i + 2] !== "<") {
      flush(i);
      let at = i + 2;
      const strip = source[at] === "-";
      if (strip) at++;
      while (source[at] === " " || source[at] === "\t") at++;
      let delimiter = "",
        quoted = false;
      for (; at < source.length && !/[\s;|&()<>]/.test(source[at]!); at++) {
        const mark = source[at]!;
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
      if (delimiter) awaited.push({ delimiter, strip, quoted });
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
        if (currentCase()?.stage === "pattern") currentCase()!.stage = "body";
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
        else currentCase()!.stage = "pattern";
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
      const rest: ReadWord[] = [];
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
      );
      unmatchedQuotes.push(...inner.unmatchedQuotes);
      incomplete ||= inner.incomplete;
      syntax.push(...inner.syntax);
      syntaxFaults.push(...inner.syntaxFaults);
      arithmetic.push(...inner.arithmetic);
      for (const within of inner.words)
        words.push({
          ...within,
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
  const blocks: { close: string; needs: string | null }[] = [];
  for (const { bare, position } of words) {
    if (position !== "head" && position !== "control") continue;
    const close = (
      {
        if: "fi",
        for: "done",
        select: "done",
        while: "done",
        until: "done",
        case: "esac",
        "{": "}",
      } as Record<string, string>
    )[bare];
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
      if (blocks.at(-1)?.needs === bare) blocks.at(-1)!.needs = null;
      else syntaxFaults.push(bare);
    } else if (["fi", "done", "esac", "}"].includes(bare)) {
      if (blocks.at(-1)?.close !== bare || blocks.at(-1)?.needs)
        syntaxFaults.push(bare);
      if (blocks.at(-1)?.close === bare) blocks.pop();
    } else if (["else", "elif"].includes(bare)) {
      if (blocks.at(-1)?.close !== "fi" || blocks.at(-1)?.needs)
        syntaxFaults.push(bare);
      else if (bare === "elif") blocks.at(-1)!.needs = "then";
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
  };
}

/** What zsh may read as a file pattern in an unquoted word. */
const patterned = /[*?\[\]^~#(|]/;
/** What zsh changes in a word before it uses the word. */
const changed =
  /\u0000+|\$\{[^}]*\}|\$[A-Za-z_]\w*|\$[0-9@*#?!$-]|\{[^{}\s]*(?:,|\.\.)[^{}\s]*\}/gu;
/** The parts of a word zsh leaves as written hold the text the shell named,
 * in order and from end to end. */
function holdsInOrder(parts: readonly string[], named: string): boolean {
  const opening = parts[0] ?? "",
    closing = parts.at(-1) ?? "";
  if (parts.length < 2) return named === opening;
  if (
    !named.startsWith(opening) ||
    !named.endsWith(closing) ||
    named.length < opening.length + closing.length
  )
    return false;
  let at = opening.length;
  for (const part of parts.slice(1, -1)) {
    const found = named.indexOf(part, at);
    if (found < 0 || found + part.length > named.length - closing.length)
      return false;
    at = found + part.length;
  }
  return true;
}
/** zsh prints a line break inside the word it names as a backslash and n. */
const namings = (named: string) =>
  named.includes("\\n") ? [named, named.replaceAll("\\n", "\n")] : [named];
/** The unquoted word becomes the pattern the shell named once zsh has changed
 * its parameters, its leading tilde and its braces. */
const becomes = (bare: string, named: string) => {
  const parts = bare.replace(/^~[^/\u0000]*/u, "\u0000").split(changed);
  return (
    patterned.test(parts.join("")) &&
    namings(named).some((naming) => holdsInOrder(parts, naming))
  );
};
/** The word, quoted or not, becomes the path the shell named; a word that is
 * all parameter names no path. */
const becomesPath = (text: string, named: string) => {
  const parts = text
    .replace(/^~[^/\u0000]*/u, "\u0000")
    .split(changed)
    .map(asWritten);
  return (
    parts.join("").replace(/[/.]/g, "").length > 1 && holdsInOrder(parts, named)
  );
};
const allParameters = (text: string) =>
  text !== "" && text.replace(changed, "") === "";
/** A literal head, or a whole head parameter with a preceding literal value.
 * An unrelated argument, comment or assignment cannot name a program. */
const resolvedWord = (
  { words }: ShellReading,
  named: string,
  accepts: (word: ReadWord) => boolean,
) => {
  const values = new Map<string, Map<string, string | undefined>>();
  const executed = new Set(
    words
      .filter(({ position }) => position === "head")
      .map(({ command }) => command),
  );
  for (const word of words) {
    const written = asWritten(word.text);
    if (word.position === "assignment" && !executed.has(word.command)) {
      const assignment = /^([A-Za-z_]\w*)=(.*)$/s.exec(word.text);
      if (assignment) {
        if (!values.has(word.scope)) values.set(word.scope, new Map());
        if (!/[$`\u0000]/.test(assignment[2]!))
          values
            .get(word.scope)!
            .set(assignment[1]!, asWritten(assignment[2]!));
        else values.get(word.scope)!.set(assignment[1]!, undefined);
      }
    }
    if (!accepts(word)) continue;
    const parameter =
      /^\$(?:([A-Za-z_]\w*)|[\{\ue07b]([A-Za-z_]\w*)[\}\ue07d])$/.exec(
        word.text,
      );
    let value = parameter ? undefined : written;
    if (parameter) {
      const scopes = word.scope ? word.scope.split("/") : [];
      let script = -1;
      for (const [index, scope] of scopes.entries())
        if (scope.startsWith("script-")) script = index;
      for (let length = scopes.length; length >= script + 1; length--) {
        const scope = values.get(scopes.slice(0, length).join("/"));
        const name = parameter[1] ?? parameter[2]!;
        if (scope?.has(name)) {
          value = scope.get(name);
          break;
        }
      }
    }
    if (value !== undefined && namings(named).includes(value)) return word;
  }
  return undefined;
};
const programWord = (reading: ShellReading, named: string) =>
  resolvedWord(reading, named, (word) => word.position === "head");
const patternFlags = new Set([
  "-name",
  "-iname",
  "-path",
  "-ipath",
  "-wholename",
  "-regex",
  "--include",
  "--exclude",
  "--exclude-dir",
  "-g",
  "--glob",
  "--iglob",
  "-e",
  "--regexp",
]);
const assigners = new Set([
  "for",
  "select",
  "read",
  "local",
  "typeset",
  "declare",
  "export",
  "integer",
  "float",
  "readonly",
  "getopts",
]);
const bashParameters = new Set([
  "PIPESTATUS",
  "BASH_SOURCE",
  "BASH_REMATCH",
  "BASH_VERSION",
  "BASH_VERSINFO",
  "BASH_LINENO",
  "BASH_COMMAND",
  "BASHPID",
  "FUNCNAME",
]);
/** The command assigns the parameter: as an assignment, or as the name a
 * loop, a read or a declaration sets. */
const assigns = ({ words }: ShellReading, name: string) => {
  const head = new Map<number, string>();
  for (const word of words)
    if (word.position === "head" && !head.has(word.command))
      head.set(word.command, word.bare);
  return words.some(({ bare, position, command }) =>
    bare.startsWith(`${name}=`) || bare.startsWith(`${name}+=`)
      ? position === "assignment" || assigners.has(head.get(command) ?? "")
      : bare === name &&
        position === "argument" &&
        assigners.has(head.get(command) ?? ""),
  );
};
/** A parameter standing as a whole word: where a program's name stands, or
 * unquoted among the arguments. */
const unsplitWord = (reading: ShellReading, named: string) =>
  resolvedWord(
    reading,
    named,
    ({ raw, position }) =>
      (position === "head" && /^"?\$\{?[A-Za-z_]\w*\}?"?$/.test(raw)) ||
      (position === "argument" && /^\$\{?[A-Za-z_]\w*\}?$/.test(raw)),
  );
const shown = (value: string) => {
  const clean = value.replace(/[\p{C}\p{Zl}\p{Zp}]/gu, "");
  return Array.from(clean).length <= 120 ? clean : "";
};
const quotable = /^[^\s'"`$\\]+$/;
interface Borne {
  readonly written: string;
  readonly form: string;
  readonly remedy?: string;
}
const unwritten: Borne = { written: "", form: "" };
// Quoted braces can still delimit an expansion in double quotes, whereas
// held dollars (single-quoted or escaped) never introduce an expansion.
const expansionText = (word: ReadWord) =>
  word.text.replace(/[\ue07b\ue07d]/g, asWritten);
const missingOperand = (expression: string) =>
  /[+*/%<>=|&^?:-]\s*$/.test(expression) && !/(?:\+\+|--)\s*$/.test(expression);
type ShellClass = readonly [
  RegExp,
  ShellDiagnosticKind,
  (
    subject: { readonly source: string; readonly reading: ShellReading },
    named: string,
  ) => Borne | null,
];
// Each class: the message the shell prints, the kind, and how the command
// bears it out: null when it does not, else what the command wrote and how.
const shellClasses: readonly ShellClass[] = [
  [
    /^no matches found: (.+)$/,
    "unmatched-pattern",
    ({ reading }, named) => {
      for (const [index, word] of reading.words.entries()) {
        if (word.position === "pattern") continue;
        if (!becomes(word.bare, named)) continue;
        if (word.heredoc) return { written: word.raw, form: "heredoc" };
        const option = /^(--?[A-Za-z][\w-]*=)(.+)$/s.exec(word.raw);
        const before = reading.words[index - 1];
        if (option && patterned.test(option[2]!))
          return {
            written: word.raw,
            form: "option",
            remedy: quotable.test(option[2]!)
              ? `${option[1]}'${option[2]}'`
              : "",
          };
        if (before?.command === word.command && patternFlags.has(before.bare))
          return {
            written: word.raw,
            form: "option",
            remedy: quotable.test(word.raw) ? `'${word.raw}'` : "",
          };
        return { written: word.raw, form: "operand" };
      }
      return null;
    },
  ],
  [
    /^bad pattern: (.+)$/,
    "bad-pattern",
    ({ reading }, named) => {
      const word = reading.words.find(({ bare }) => becomes(bare, named));
      return word ? { written: word.raw, form: "" } : null;
    },
  ],
  // zsh reads parentheses that close an unquoted word as qualifiers of a
  // file pattern.
  [
    /^(?:unknown file attribute: .+|missing end of string|missing delimiter for '.' glob qualifier|number expected)()$/,
    "bad-pattern",
    ({ reading }) => {
      const word = reading.words.find(
        ({ bare, position }) =>
          /[^\s$=(]\((?!\))/.test(bare) && position !== "assignment",
      );
      return word ? { written: word.raw, form: "parentheses" } : null;
    },
  ],
  [
    /^command not found: (.+)$/,
    "program-not-found",
    ({ reading }, named) => {
      const word = programWord(reading, named);
      if (word?.ticked) return { written: word.raw, form: "backquotes" };
      if (/\s|\\n/.test(named)) return null;
      return word
        ? { written: named, form: assigns(reading, "path") ? "path" : "" }
        : null;
    },
  ],
  // zsh names the whole value where a parameter was not split into words.
  [
    /^(?:command not found|no such file or directory): (.*(?:\s|\\n).*)$/,
    "unsplit-word",
    ({ reading }, named) => {
      if (reading.words.some(({ text }) => becomesPath(text, named)))
        return null;
      const word = unsplitWord(reading, named);
      return word
        ? { written: word.raw, form: word.position === "head" ? "program" : "" }
        : null;
    },
  ],
  [
    /^read-only variable: ([A-Za-z_]\w*)$/,
    "reserved-parameter",
    ({ reading }, named) =>
      assigns(reading, named) ? { written: named, form: "" } : null,
  ],
  [
    /^bad substitution()$/,
    "bad-substitution",
    ({ reading: { words } }) => {
      for (const word of words) {
        const text = expansionText(word);
        if (/\$\{[^}]*(?:,|\^)\}|\$\{![^}]+\}|\$\{[^}]+@[A-Za-z]\}/.test(text))
          return { written: "", form: "bash" };
        const modifier = /\$[A-Za-z_]\w*:[A-Za-z&]/.exec(text);
        if (modifier) return { written: modifier[0], form: "modifier" };
      }
      return null;
    },
  ],
  [
    /^(?:invalid subscript|bad output format specification)()$/,
    "bad-subscript",
    ({ reading: { plain } }) => {
      const subscript = /\$[A-Za-z_]\w*\[/.exec(plain);
      return subscript ? { written: subscript[0], form: "" } : null;
    },
  ],
  [
    /^bad math expression: (.+)$/,
    "bad-math",
    ({ reading }) => {
      if (reading.arithmetic.some(missingOperand)) return unwritten;
      const lets = new Set(
        reading.words
          .filter(
            (word) =>
              word.position === "head" && asWritten(word.text) === "let",
          )
          .map((word) => word.command),
      );
      return reading.words.some(
        (word) =>
          (lets.has(word.command) &&
            word.position === "argument" &&
            missingOperand(asWritten(word.text))) ||
          [
            ...expansionText(word).matchAll(/\$(?:[A-Za-z_]\w*)?\[([^\]]*)\]/g),
          ].some((match) => missingOperand(match[1]!)),
      )
        ? unwritten
        : null;
    },
  ],
  [
    /^([A-Za-z_]\w*)(?:\[[^\]]*\])?: parameter not set$/,
    "bash-parameter",
    ({ reading: { plain } }, named) =>
      bashParameters.has(named) && new RegExp(`\\$\\{?${named}\\b`).test(plain)
        ? { written: named, form: "" }
        : null,
  ],
  [
    /^unmatched (['"`])$/,
    "unmatched-quote",
    ({ reading }, named) =>
      reading.unmatchedQuotes.includes(named)
        ? { written: named, form: "" }
        : null,
  ],
  [
    /^parse error near `(.*)'$/,
    "parse-error",
    ({ reading }, named) =>
      reading.syntaxFaults.includes(named) ||
      (reading.incomplete &&
        (named === "\\n" ||
          reading.syntax.includes(named) ||
          reading.words.some(({ text }) => asWritten(text) === named)))
        ? { written: named === "\\n" ? "" : named, form: "" }
        : null,
  ],
  [
    /^no such file or directory: (.+)$/,
    "missing-file",
    ({ reading }, named) =>
      reading.words.some(
        ({ text, position }) =>
          (position === "head" || position === "redirect") &&
          becomesPath(text, named),
      )
        ? unwritten
        : null,
  ],
  [
    /^(?:operation not permitted|permission denied|read-only file system): (.+)$/,
    "not-permitted",
    ({ reading }, named) =>
      reading.words.some(
        ({ text, position }) =>
          (position === "head" || position === "redirect") &&
          becomesPath(text, named),
      )
        ? unwritten
        : null,
  ],
  // The host refuses the lower priority zsh gives a background job.
  [
    /^nice\(\d+\) failed: operation not permitted()$/,
    "not-permitted",
    ({ reading }) => (reading.background ? unwritten : null),
  ],
  // zsh reads an unquoted word that begins with = as a program's path and
  // names the rest of the word.
  [
    /^(\S+) not found$/,
    "equals-word",
    ({ reading }, named) => {
      const word = reading.words.find(({ bare }) => {
        const at = bare.indexOf(`=${named}`);
        return (
          at >= 0 &&
          bare.endsWith(named) &&
          (at === 0 || /[=:]/.test(bare[at - 1] ?? ""))
        );
      });
      return word ? { written: word.raw, form: "" } : null;
    },
  ],
];
// A builtin's own refusal carries its name before the line number.
const builtinClasses: readonly (readonly [RegExp, ShellDiagnosticKind])[] = [
  [/^bad option: (-\S+)$/, "builtin-option"],
  [/^(-\S+): no coprocess$/, "builtin-option"],
  [/^no such file or directory: (.+)$/, "missing-file"],
  [/^(?:operation not permitted|permission denied): (.+)$/, "not-permitted"],
];
const shellLine = /^(?:\(eval\)|zsh):(?:([^\s:\d][^\s:]*):)?(?:\d+:)? (.+)$/;
export function shellDiagnostics(
  command: string,
  output: string,
): readonly ShellDiagnostic[] {
  const found: ShellDiagnostic[] = [];
  if (command.length > READ_LIMIT) return found;
  const source = command;
  let reading: ShellReading | undefined;
  const lines = output.slice(0, 65536).split("\n");
  let candidates = 0;
  const first = lines.findIndex((line) => line.trim() !== "");
  for (const [index, line] of lines.entries()) {
    if (found.length >= 16) break;
    const shaped = line.length > 4096 ? null : shellLine.exec(line);
    const message = shaped?.[2]?.trim();
    if (!shaped || !message) continue;
    if (++candidates > 64) break;
    const builtin = shaped[1];
    try {
      reading ??= readShellCommand(source);
    } catch (error) {
      if (error instanceof ShellReadingLimit) return [];
      throw error;
    }
    const words = reading.words;
    // A line of no listed class counts when it opens the output: a command's
    // own refusal comes before anything the command printed.
    const other = (executedBuiltin = false) => {
      const user = /^no such user or named directory: (.+)$/.exec(message);
      const expansion =
        user &&
        words.some(
          ({ bare }) =>
            bare === `~${user[1]}` || bare.startsWith(`~${user[1]}/`),
        );
      if (index === first && (executedBuiltin || expansion))
        found.push({ kind: "other", ...unwritten });
    };
    if (builtin) {
      const named = new Set(
        words
          .filter(
            ({ text, position }) =>
              asWritten(text) === builtin && position === "head",
          )
          .map((word) => word.command),
      );
      if (!named.size) continue;
      const listed = builtinClasses.find(([pattern]) => pattern.test(message));
      const subject = listed?.[0].exec(message)?.[1];
      if (!listed || !subject) {
        other(true);
        continue;
      }
      const within = words.filter(
        (word) => named.has(word.command) && word.position === "argument",
      );
      if (listed[1] !== "builtin-option") {
        // The shell names the builtin, so a word of parameters alone bears
        // the line out.
        if (
          within.some(
            ({ text }) => becomesPath(text, subject) || allParameters(text),
          )
        )
          found.push({ kind: listed[1], ...unwritten });
      } else if (within.some(({ bare }) => bare === subject))
        found.push({
          kind: "builtin-option",
          written: shown(`${builtin} ${subject}`),
          form: builtin === "read" && subject === "-a" ? "array" : "",
        });
      continue;
    }
    const listed = shellClasses.filter(([pattern]) => pattern.test(message));
    if (!listed.length) {
      other();
      continue;
    }
    for (const [pattern, kind, bears] of listed) {
      const borne = bears(
        { source, reading },
        pattern.exec(message)?.[1] ?? "",
      );
      if (!borne) continue;
      const remedy = shown(borne.remedy ?? "");
      found.push({
        kind,
        written: shown(borne.written),
        form: borne.form,
        ...(remedy ? { remedy } : {}),
      });
      break;
    }
  }
  return found;
}

const inlineAdvice =
  "If the command carries a script or long text inline, put it in a file through a quoted heredoc.";
/** What the shell said, as the class words it, and what to write instead. A
 * class that is not about how the command was written gives none. */
function shellSentence({
  kind,
  written,
  form,
  remedy,
}: ShellDiagnostic): string | null {
  const word = written ? ` ${written}` : " in the command";
  switch (kind) {
    case "unmatched-pattern":
      return form === "heredoc"
        ? `zsh ran a substitution inside a heredoc whose delimiter is not quoted and found no file that matches the pattern${word}. Quote the delimiter, as in <<'EOF', where the body is text.`
        : form === "option"
          ? `zsh read the unquoted word${word} as a file pattern, found no file that matches and did not run the command that holds it. Quote the pattern${remedy ? `: ${remedy}` : ""}.`
          : `zsh found no file that matches the unquoted pattern${word} and did not run the command that holds it. If a program was meant to receive the pattern, quote it; if it was meant to name files, none match.`;
    case "bad-pattern":
      return form === "parentheses"
        ? `zsh read the parentheses in the unquoted word${word} as part of a file pattern and could not parse them. Quote the word.`
        : `zsh read the unquoted word${word} as a file pattern and could not parse it. Quote the word if it is text.`;
    case "equals-word":
      return `zsh read the unquoted word${word}, which begins with =, as the path of a program and found none. Quote the word.`;
    case "program-not-found":
      return form === "backquotes"
        ? "zsh ran the text between backquotes as a command and found no such program: backquotes substitute inside double quotes and in a heredoc whose delimiter is not quoted. Put text that holds backquotes in single quotes or a quoted heredoc."
        : form === "path"
          ? "The command assigns path, which zsh ties to PATH, so zsh found no program after the assignment. Use another name."
          : `zsh found no program named ${written} on this host.`;
    case "unsplit-word":
      return `zsh does not split ${written || "a parameter"} into words: it ${form === "program" ? "looked for one program named by the whole value" : "used the whole value as one word"}. Use an array, or \${=name} where the value is a list of words.`;
    case "reserved-parameter":
      return `zsh reserves the parameter ${written} and refused the assignment. Use another name.`;
    case "bad-substitution":
      return form === "modifier"
        ? `zsh reads a colon and a letter after a parameter as a modifier and refused ${written}. Write the name in braces before the colon, as in \${name}:text.`
        : form === "bash"
          ? "zsh refused a parameter expansion it does not know; forms such as ${name,,}, ${name^^} and ${!name} are bash's."
          : "zsh refused a parameter expansion the command holds.";
    case "bad-subscript":
      return `zsh reads a bracket after a parameter as a subscript and refused ${written}. Write the name in braces before the bracket, as in \${name}[text].`;
    case "bad-math":
      return "zsh could not evaluate an arithmetic expression the command holds. Check that each value inside it is one number.";
    case "bash-parameter":
      return `${written} is bash's parameter and zsh does not set it.${written === "PIPESTATUS" ? " zsh's is pipestatus, counted from 1." : ""}`;
    case "builtin-option":
      return `zsh's own ${written.replace(" ", " refused ")}: its options are not bash's.${form === "array" ? " read -A fills an array." : ""}`;
    case "unmatched-quote":
      return `zsh found a quote it could not pair (${written}). ${inlineAdvice}`;
    case "parse-error":
      return `zsh could not parse the command${written ? ` near ${written}` : " at the end of a line"}. ${inlineAdvice}`;
    default:
      return null;
  }
}
/** The guidance for what was found, each sentence once and whole, as context
 * for the agent; `earlier` names a command that ran before the call the
 * guidance arrives with. */
export function shellGuidance(
  diagnostics: readonly ShellDiagnostic[],
  earlier = false,
): string | null {
  const said: string[] = [];
  const opening = earlier
    ? "DotLn shell diagnostic, for an earlier command the host marked failed:"
    : "DotLn shell diagnostic:";
  let length = opening.length;
  for (const diagnostic of diagnostics) {
    const next = shellSentence(diagnostic);
    if (!next || said.includes(next)) continue;
    const added = Array.from(next).length + 1;
    if (length + added > 900) continue;
    length += added;
    said.push(next);
  }
  return said.length ? `${opening} ${said.join(" ")}` : null;
}

// Redirect operators and filename expansion differ between shells: a leading
// `!` can be zsh's clobber mark, and `=` can expand to a command path. Require
// a plain path prefix instead of treating every captured suffix as literal.
// The lone dash remains a filename for append and a descriptor operand for >&.
const literalRedirectOperand = (
  word: ShellWord | undefined,
): word is ShellWord =>
  word !== undefined &&
  !word.dynamic &&
  /^(?:[A-Za-z0-9._/]|-$)/.test(word.value) &&
  !/[*?\[\]{}~<>]/.test(word.value);

/** Keep the activation read vocabulary: literal arguments to these programs
 * have no file-write or program-execution option. Shell expansion and output
 * redirections are screened by shellWriteTargets before reaching this function.
 * Newly admitted programs retain their bounded option vocabulary below.
 */
function readCommand(program: string, args: readonly string[]): boolean {
  if (
    [
      "echo",
      "printf",
      "cat",
      "pwd",
      "true",
      "false",
      "ls",
      "head",
      "grep",
    ].includes(program)
  )
    return true;
  const flags: Record<string, RegExp> = {
    tail: /^(?:-(?:[qv]+|[0-9]+|[nc][+-]?[0-9]+)|--(?:quiet|silent|verbose)|--(?:lines|bytes)=[+-]?[0-9]+)$/,
    wc: /^-(?:[clmwL]+)$/,
    ps: /^-(?:[AacefjlMmrSTuvwx]+)$/,
  };
  if (program === "sed")
    return (
      args[0] === "-n" &&
      /^\d+(?:,\d+)?p$/.test(args[1] ?? "") &&
      args.slice(2).every((arg) => !arg.startsWith("-"))
    );
  if (program === "git") {
    if (args[0] !== "--no-pager") return false;
    const words = args.slice(1);
    // Add an explicitly effect-reduced spelling without changing legacy forms.
    // Gate metadata exceptions still need the separately boarded N7 repair.
    if (
      words[0] === "--no-optional-locks" &&
      words[1] === "-c" &&
      words[2] === "core.fsmonitor=false"
    )
      words.splice(0, 3);
    const subcommand = words.shift();
    if (!["status", "log", "diff"].includes(subcommand ?? "")) return false;
    if (
      subcommand !== "status" &&
      !(words.includes("--no-ext-diff") && words.includes("--no-textconv"))
    )
      return false;
    const allowed =
      subcommand === "status"
        ? /^(?:--short|--branch|--porcelain(?:=v[12])?|--untracked-files(?:=(?:no|normal|all))?|--ignored|--ignore-submodules(?:=(?:none|untracked|dirty|all))?|-[sbz]+)$/
        : subcommand === "diff"
          ? /^(?:--no-ext-diff|--no-textconv|--stat|--numstat|--shortstat|--name-only|--name-status|--check|--cached|--staged|--no-renames|--no-color|--exit-code|--quiet|--(?:unified|stat-width|stat-name-width)=\d+|-[pz]+|-U\d+)$/
          : /^(?:--no-ext-diff|--no-textconv|--oneline|--no-decorate|--decorate(?:=(?:short|full|no))?|--graph|--all|--first-parent|--reverse|--no-merges|--merges|--no-color|--max-count=\d+|--format=(?:oneline|short|medium|full|fuller|reference|raw)|-\d+)$/;
    let operands = false;
    return words.every((word) => {
      if (word === "--") {
        operands = true;
        return true;
      }
      return operands || !word.startsWith("-") || allowed.test(word);
    });
  }
  if (!Object.hasOwn(flags, program)) return false;
  let operands = false;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;
    if (operands) continue;
    if (arg === "--") {
      operands = true;
      continue;
    }
    if (!arg.startsWith("-")) continue;
    if (
      program === "tail" &&
      ["-n", "-c", "--lines", "--bytes"].includes(arg)
    ) {
      if (!/^[+-]?\d+$/.test(args[++index] ?? "")) return false;
      continue;
    }
    if (program === "ps" && ["-p", "-o"].includes(arg)) {
      const value = args[++index] ?? "";
      if (
        !(arg === "-p" ? /^\d+(?:,\d+)*$/ : /^[a-z]+(?:,[a-z]+)*$/).test(value)
      )
        return false;
      continue;
    }
    if (!flags[program]!.test(arg)) return false;
  }
  return true;
}

interface ShellWriteTarget {
  path: string;
  followFinalSymlink: boolean;
  redirect?: true;
}

/** Freeform patch paths are literal, including both ends of a move. */
export function patchWriteTargets(
  source: string,
): readonly ShellWriteTarget[] | null {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  if (lines.shift() !== "*** Begin Patch" || lines.pop() !== "*** End Patch")
    return null;
  const targets: ShellWriteTarget[] = [];
  let operation: string | undefined;
  let moveAllowed = false;
  for (const line of lines) {
    const header = /^\*\*\* (Add|Update|Delete) File: (.+)$/.exec(line);
    if (header) {
      const path = header[2]!;
      if (/[\u0000-\u001f\u007f]/.test(path)) return null;
      operation = header[1];
      moveAllowed = operation === "Update";
      targets.push({ path, followFinalSymlink: operation !== "Delete" });
      continue;
    }
    const move = /^\*\*\* Move to: (.+)$/.exec(line);
    if (move) {
      if (!moveAllowed || /[\u0000-\u001f\u007f]/.test(move[1]!)) return null;
      targets[targets.length - 1]!.followFinalSymlink = false;
      targets.push({ path: move[1]!, followFinalSymlink: true });
      moveAllowed = false;
      continue;
    }
    moveAllowed = false;
    if (
      (operation === "Add" && line.startsWith("+")) ||
      (operation === "Update" &&
        (/^[ +\-]/.test(line) ||
          /^@@(?: |$)/.test(line) ||
          line === "*** End of File"))
    )
      continue;
    return null;
  }
  return targets.length ? targets : null;
}

const writeCommandFlags: Record<string, RegExp> = {
  touch: /^-(?:[acmh]+|-)/,
  mkdir: /^-(?:p|-)/,
  tee: /^-(?:[ai]+|-)/,
  rm: /^-(?:[rf]+|-)/,
};

/** One invocation's literal output redirects and its remaining command words.
 * null means a redirect this adapter cannot name. `strict` keeps the rule of
 * shellWriteTargets that any expanded or wildcard word makes the invocation
 * opaque; the redirect accessor asks that only of the redirect words.
 */
function invocationRedirects(
  words: readonly ShellWord[],
  strict: boolean,
): { command: string[]; redirects: ShellWriteTarget[] } | null {
  const command: string[] = [];
  const redirects: ShellWriteTarget[] = [];
  // A shell without `&>` (dash, busybox ash) backgrounds what precedes it and
  // runs the words after its operand as a command of their own (WO-168).
  let background = false;
  for (let index = 0; index < words.length; index++) {
    const word = words[index]!;
    // Whole-word quotation does not prove every character was quoted.
    // Mixed/escaped wildcard forms stay opaque to this bounded adapter.
    if (word.dynamic || word.expands || /[*?\[\]{}~]/.test(word.value)) {
      if (strict || background || /[<>]/.test(word.value)) return null;
      command.push(word.value);
      continue;
    }
    if (/^(?:\d*[<>]&\d+)$/.test(word.value) && !word.quoted) continue;
    // Only `>&` treats a number or `-` as descriptor duplication/closure.
    // zsh's `>>&` opens an append file even for those literal names.
    // A spaced operand is the next word, as for `>` and `>>`.
    const ampersandRedirect = /^\d*(>>?)&(.*)$/.exec(word.value);
    if (ampersandRedirect && !word.quoted) {
      const operand = ampersandRedirect[2]
        ? { ...word, value: ampersandRedirect[2] }
        : words[++index];
      if (!literalRedirectOperand(operand)) return null;
      if (ampersandRedirect[1] === ">" && /^(?:\d+|-)$/.test(operand.value))
        continue;
      redirects.push({
        path: operand.value,
        followFinalSymlink: true,
        redirect: true,
      });
      continue;
    }
    const redirect = /^(?:\d*>>?|&>>?)(.*)$/.exec(word.value);
    if (redirect && !word.quoted) {
      const target = redirect[1]
        ? { ...word, value: redirect[1] }
        : words[++index];
      if (!literalRedirectOperand(target)) return null;
      redirects.push({
        path: target.value,
        followFinalSymlink: true,
        redirect: true,
      });
      if (word.value.startsWith("&")) background = true;
    } else {
      // Mixed quoted/unquoted redirects and embedded redirects are opaque, and
      // so is a command word the shells would give to different programs.
      if (background || /[<>]/.test(word.value)) return null;
      command.push(word.value);
    }
  }
  return { command, redirects };
}

/** Bounded destination adapter for gate admission. null means the destinations
 * are opaque, never an empty write set. Keep expansion/quotation provenance;
 * arbitrary scripts and interpreters need their own reviewed path adapter.
 */
export function shellWriteTargets(
  source: string,
): readonly ShellWriteTarget[] | null {
  try {
    const paths: ShellWriteTarget[] = [];
    for (const invocation of shellWords(source)) {
      if (invocation.stdin.length) return null;
      const scan = invocationRedirects(invocation.words, true);
      if (!scan) return null;
      paths.push(...scan.redirects);
      const [program, ...args] = scan.command;
      if (!program) continue;
      if (readCommand(program, args)) continue;
      const flags = writeCommandFlags;
      if (!Object.hasOwn(flags, program)) return null;
      const optionEnd = args.indexOf("--");
      const touchNoFollow =
        program === "touch" &&
        args
          .slice(0, optionEnd < 0 ? args.length : optionEnd)
          .some((arg) => /^-[acmh]+$/.test(arg) && arg.includes("h"));
      let operands = false;
      for (const arg of args) {
        if (!operands && arg === "--") {
          operands = true;
          continue;
        }
        if (!operands && arg.startsWith("-")) {
          if (!flags[program]!.test(arg) || !/^-([acmhpirf]+)$/.test(arg))
            return null;
        } else
          paths.push({
            path: arg,
            followFinalSymlink: program !== "rm" && !touchNoFollow,
          });
      }
    }
    return paths;
  } catch {
    return null;
  }
}

/** WO-144: the shell, not the program, opens a redirect, so a literal redirect
 * is a known destination on any program. This accessor names only those; the
 * program's own effects stay opaque, and shellWriteTargets keeps its contract
 * that null means opaque for the live-gate refusal that depends on it. A
 * relative destination is named only while no earlier program outside the
 * bounded vocabulary (cd, a function, a script) could have moved the shell.
 */
export function shellRedirectTargets(
  source: string,
): readonly ShellWriteTarget[] | null {
  try {
    const paths: ShellWriteTarget[] = [];
    let moved = false;
    for (const invocation of shellWords(source)) {
      const scan = invocationRedirects(invocation.words, false);
      if (!scan) return null;
      if (moved && scan.redirects.some(({ path }) => !path.startsWith("/")))
        return null;
      paths.push(...scan.redirects);
      const [program, ...args] = scan.command;
      if (
        program &&
        !readCommand(program, args) &&
        !Object.hasOwn(writeCommandFlags, program)
      )
        moved = true;
    }
    return paths;
  } catch {
    return null;
  }
}
export function shellWritePaths(source: string): readonly string[] | null {
  return shellWriteTargets(source)?.map(({ path }) => path) ?? null;
}

/** The fixed read-only list a live gate admits (WO-158 criterion 6). Adding a
 * program is a later order, not a session decision. */
export const LIVE_GATE_READ_LIST =
  "cat, head, tail, wc, ls, grep, sed -n with a print-only script, git --no-pager diff|log|show|status|stash list, node scripts/harness.mjs writer --show|evidence --wait [--timeout seconds] and npm run resume --silent -- status";

// A sed script whose every command prints: numeric, `$` or /regex/ addresses.
const sedAddress = String.raw`(?:\d+|\$|/(?:[^/\\;]|\\.)*/[IM]*)`;
const sedPrintOnly = new RegExp(
  `^\\s*(?:${sedAddress}(?:\\s*,\\s*${sedAddress})?)?\\s*p\\s*$`,
);
const liveGateSed = (args: readonly string[]): boolean => {
  let quiet = false;
  let explicit = false;
  const scripts: string[] = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;
    if (["-n", "--quiet", "--silent"].includes(arg)) quiet = true;
    else if (["-E", "-r", "--regexp-extended"].includes(arg)) continue;
    else if (/^-[nEr]+$/.test(arg)) quiet ||= arg.includes("n");
    else if (arg === "-e" || arg === "--expression") {
      const script = args[++index];
      if (script === undefined) return false;
      scripts.push(script);
      explicit = true;
    } else if (arg.startsWith("-")) return false;
    else if (!explicit && scripts.length === 0) scripts.push(arg);
  }
  return (
    quiet &&
    scripts.length > 0 &&
    scripts.every((script) =>
      script
        .split(/[;\n]/)
        .filter((command) => command.trim())
        .every((command) => sedPrintOnly.test(command)),
    )
  );
};
// Git reads that name an output file or enable an external program are not
// on the list; configured programs are the host's to judge (harness-host).
const liveGateGit = (args: readonly string[]): boolean => {
  let index = 0;
  let unpaged = false;
  while (["--no-pager", "-P", "--no-optional-locks"].includes(args[index]!))
    if (args[index++] !== "--no-optional-locks") unpaged = true;
  // A paged read runs the configured or default pager, an unlisted program,
  // whenever its output is a terminal; --no-pager also sets GIT_PAGER=cat for
  // the reads a stash list delegates (VER-001 F4).
  if (!unpaged) return false;
  const subcommand = args[index++];
  let rest = args.slice(index);
  if (subcommand === "stash") {
    if (rest[0] !== "list") return false;
    rest = rest.slice(1);
  } else if (!["diff", "log", "show", "status"].includes(subcommand ?? ""))
    return false;
  // A `%G` format placeholder verifies signatures, which runs the configured
  // signature program just as --show-signature does.
  return rest.every(
    (arg) =>
      !/^(?:--output(?:=|$)|--ext-diff$|--textconv$|--show-signature$|--exec(?:=|$))/.test(
        arg,
      ) && !arg.includes("%G"),
  );
};
// WO-168 (WO-158-D028 f): a helper form is judged argument by argument, so a
// quoted word that merely spells several arguments is a different command.
const sameArguments = (
  args: readonly string[],
  expected: readonly string[],
): boolean =>
  args.length === expected.length &&
  args.every((arg, index) => arg === expected[index]);
const liveGateNode = ([script, ...args]: readonly string[]): boolean =>
  script === "scripts/harness.mjs" &&
  (sameArguments(args, ["writer", "--show"]) ||
    sameArguments(args, ["evidence", "--wait"]) ||
    (sameArguments(args.slice(0, 3), ["evidence", "--wait", "--timeout"]) &&
      args.length === 4 &&
      /^\d+(?:\.\d+)?$/.test(args[3]!)));
// `--silent` sits on either side of the script name, once.
const liveGateNpm = (args: readonly string[]): boolean => {
  const separator = args.indexOf("--");
  if (separator < 0) return false;
  const run = args.slice(0, separator);
  const status = args.slice(separator + 1);
  if (
    !sameArguments(run, ["run", "resume"]) &&
    !sameArguments(run, ["run", "--silent", "resume"]) &&
    !sameArguments(run, ["run", "resume", "--silent"])
  )
    return false;
  if (status.shift() !== "status") return false;
  if (status[0] === "--json") status.shift();
  if (status[0] === "--work-order")
    return status.length === 2 && /^WO-\d{3}$/.test(status[1]!);
  return status.length === 0;
};
const liveGateRead = ([program, ...args]: readonly string[]): boolean => {
  switch (program) {
    // No option of these writes a file or runs a program.
    case "cat":
    case "head":
    case "tail":
    case "wc":
    case "ls":
    case "grep":
      return true;
    case "sed":
      return liveGateSed(args);
    case "git":
      return liveGateGit(args);
    case "node":
      return liveGateNode(args);
    case "npm":
      return liveGateNpm(args);
    default:
      return false;
  }
};

/** WO-168: a revision suffix the shell leaves alone. The word is unquoted, so
 * its value is what the shell sees: no glob character, no dollar sign, no
 * tilde or zsh `=` where a shell expands one (the start of a word, or after
 * `=` or `:`), and every brace pair free of a comma and of a `..` range. */
const revisionOperand = (word: ShellWord): boolean =>
  !word.quoted &&
  !/[*?\[\]$]/.test(word.value) &&
  !/(?:^|[=:])(?:~|=.)/.test(word.value) &&
  !/[{}]/.test(word.value.replace(/\{(?![^{}]*(?:,|\.\.))[^{}]*\}/g, ""));

/** Every stage of every pipeline and list must be on the list, with no
 * heredoc, expansion or environment prefix: a listed reader piped into an
 * unlisted writer is refused (receipt 028, criterion 6). Descriptor
 * duplication such as 2>&1 opens no file and passes. WO-168 admits four
 * argument forms that change no gate input: a quoted word that contains `<`
 * or `>`; a revision suffix (`~`, `^`, `@{…}`) in an operand of a listed Git
 * read; an input redirect from a literal path; and an output redirect whose
 * literal operand is exactly /dev/null. `<>`, `&>`, every other redirect and
 * an operator in a partly quoted word stay off the list; the destination
 * adapter judges what it can name.
 * null means not admitted; `git` says whether a Git read needs the host's
 * configured-program check, and `helper` whether a repository script runs,
 * which is reviewed only at the root. */
export function liveGateReads(
  source: string,
): { readonly git: boolean; readonly helper: boolean } | null {
  try {
    const invocations = shellWords(source);
    if (!invocations.length) return null;
    let git = false;
    let helper = false;
    for (const { words, stdin } of invocations) {
      if (stdin.length) return null;
      const values: string[] = [];
      for (let index = 0; index < words.length; index++) {
        const word = words[index]!;
        if (word.dynamic) return null;
        if (word.redirects) {
          if (word.quoted || word.expands) return null;
          if (/^\d*[<>]&\d+$/.test(word.value)) continue;
          // `&>` is left out: a shell without it backgrounds the reader and
          // runs the words that follow as a command of their own.
          const redirect = /^(\d*<|\d*>>?)(.*)$/.exec(word.value);
          if (!redirect) return null;
          const operand = redirect[2]
            ? { ...word, value: redirect[2], redirects: false }
            : words[++index];
          if (
            !literalRedirectOperand(operand) ||
            operand.expands ||
            operand.redirects ||
            (!redirect[1]!.endsWith("<") && operand.value !== "/dev/null")
          )
            return null;
          continue;
        }
        if (
          word.expands &&
          !(index > 0 && values[0] === "git" && revisionOperand(word))
        )
          return null;
        values.push(word.value);
      }
      if (!liveGateRead(values)) return null;
      git ||= values[0] === "git";
      helper ||= values[0] === "node" || values[0] === "npm";
    }
    return { git, helper };
  } catch {
    return null;
  }
}
const requireLiteral = (word: ShellWord | undefined, position: string) => {
  if (!word || word.dynamic)
    throw new HarnessCommandRefused(
      `Dynamic or missing ${position} requires an explicit effect adapter`,
    );
  return word.value;
};
const wrappers = new Set([
  "env",
  "command",
  "exec",
  "builtin",
  "time",
  "nohup",
  "timeout",
  "nice",
  "xargs",
  "caffeinate",
  "npx",
]);
const wrapperFlags: Record<string, readonly string[]> = {
  env: ["-i", "--ignore-environment"],
  command: ["-p"],
  exec: ["-c", "-l", "-cl", "-lc"],
  time: ["-p", "--portability", "-v", "--verbose"],
  timeout: ["--foreground", "--preserve-status", "-v", "--verbose"],
  xargs: [
    "-0",
    "--null",
    "-r",
    "--no-run-if-empty",
    "-t",
    "--verbose",
    "-x",
    "--exit",
    "-p",
    "--interactive",
  ],
  npx: ["-y", "--yes", "--no", "--no-install", "--ignore-existing"],
};
const wrapperValues: Record<string, readonly string[]> = {
  env: ["-u", "--unset"],
  exec: ["-a"],
  time: ["-f", "--format", "-o", "--output"],
  timeout: ["-k", "--kill-after", "-s", "--signal"],
  nice: ["-n", "--adjustment"],
  xargs: [
    "-L",
    "-n",
    "-P",
    "-s",
    "-d",
    "-E",
    "--max-lines",
    "--max-args",
    "--max-procs",
    "--max-chars",
    "--delimiter",
    "--eof",
  ],
  caffeinate: ["-t", "-w"],
  npx: ["-p", "--package"],
};

/** npm parses its options even after positionals; -- preserves child operands.
 * npx and the other supported exec wrappers stop at the child executable.
 */
function npmExecCommand(args: readonly ShellWord[]): ShellWord[] {
  const child: ShellWord[] = [];
  let call: ShellWord | undefined;
  for (let index = 0; index < args.length; index++) {
    const word = args[index]!;
    const value = requireLiteral(word, "npm exec argument");
    if (value === "--") {
      child.push(...args.slice(index + 1));
      break;
    }
    if (["-c", "--call"].includes(value)) {
      call = literal(requireLiteral(args[++index], "npm exec command"));
    } else if (/^--call=/.test(value)) {
      call = literal(value.slice("--call=".length));
    } else if (["-p", "--package"].includes(value)) {
      refuseDeniedProgram([
        literal(requireLiteral(args[++index], "npm exec package")),
      ]);
    } else if (/^--package=/.test(value)) {
      refuseDeniedProgram([literal(value.slice("--package=".length))]);
    } else if (["-y", "--yes", "--no"].includes(value)) {
      continue;
    } else if (value.startsWith("-")) {
      throw new HarnessCommandRefused(
        "npm exec option requires an explicit effect adapter; use -- before child arguments",
      );
    } else child.push(word);
  }
  if (call && child.length)
    throw new HarnessCommandRefused(
      "npm exec command and positional arguments require an explicit effect adapter",
    );
  return call ? [literal("sh"), literal("-c"), call] : child;
}

/** Normalize actual executable operands, including wrappers, before matching
 * effects. Unknown wrapper options refuse rather than hiding the child command.
 */
function invocationProgram(source: readonly ShellWord[]): ShellWord[] {
  let tokens = [...source];
  while (tokens.length) {
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[0]!.value)) {
      const assignment = tokens[0]!;
      // Assignment-only statements can supply a later program, so screen their
      // values even when the current command is absent or otherwise reads data.
      refuseDeniedProgram([
        literal(assignment.value.slice(assignment.value.indexOf("=") + 1)),
      ]);
      if (/^GIT_CONFIG_/i.test(assignment.value)) {
        requireLiteral(assignment, "Git configuration assignment");
        if (/(?:^|[=\s'"])alias\./i.test(assignment.value))
          throw new HarnessCommandRefused(
            "Git alias configuration requires an explicit effect adapter",
          );
      }
      tokens.shift();
      continue;
    }
    let program = basename(
      requireLiteral(tokens[0], "executable"),
    ).toLowerCase();
    const subcommand = tokens[1]?.value;
    if (program === "npm" && ["exec", "x"].includes(subcommand ?? "")) {
      tokens = npmExecCommand(tokens.slice(2));
      continue;
    }
    if (program === "yarn" && subcommand === "npm") {
      tokens = [literal("npm"), ...tokens.slice(2)];
      continue;
    }
    if (
      (program === "pnpm" && ["exec", "dlx"].includes(subcommand ?? "")) ||
      (program === "yarn" && subcommand === "exec")
    ) {
      tokens = [literal("npx"), ...tokens.slice(2)];
      program = "npx";
    }
    if (!wrappers.has(program)) return [literal(program), ...tokens.slice(1)];
    tokens.shift();
    while (tokens[0]?.value.startsWith("-")) {
      const flag = requireLiteral(tokens.shift(), "wrapper option");
      if (flag === "--") break;
      if (
        program === "xargs" &&
        (/^-I/.test(flag) || /^--replace(?:=|$)/.test(flag))
      )
        throw new HarnessCommandRefused(
          "Xargs substitution requires an explicit effect adapter",
        );
      if (program === "command" && ["-v", "-V"].includes(flag))
        return [literal("command"), literal(flag), ...tokens];
      if (
        wrapperFlags[program]?.includes(flag) ||
        (program === "nice" && /^-\d+$/.test(flag)) ||
        (program === "caffeinate" && /^-[disu]+$/.test(flag))
      )
        continue;
      if (wrapperValues[program]?.includes(flag)) {
        requireLiteral(tokens.shift(), "wrapper option value");
        continue;
      }
      if (
        wrapperValues[program]?.some((option) =>
          option.startsWith("--")
            ? flag.startsWith(`${option}=`)
            : flag.startsWith(option) && flag.length > option.length,
        )
      )
        continue;
      throw new HarnessCommandRefused(
        "Shell wrapper option requires an explicit effect adapter",
      );
    }
    if (program === "xargs") {
      // Without replacement options, stdin words are appended to the command.
      // Their bytes are unknown: they may supply a subcommand or message flags.
      tokens.push({ value: "<xargs-input>", dynamic: true, quoted: false });
    }
    if (
      program === "timeout" &&
      !/^\d+(?:\.\d+)?[smhd]?$/.test(
        requireLiteral(tokens.shift(), "timeout duration"),
      )
    )
      throw new HarnessCommandRefused(
        "Timeout duration requires an explicit effect adapter",
      );
  }
  return [];
}

function executableInvocations(
  source: string,
  depth = 0,
  inheritedInput: readonly ShellWord[] = [],
): ShellWord[][] {
  if (depth > 16)
    throw new HarnessCommandRefused(
      "Shell nesting requires an explicit effect adapter",
    );
  return shellWords(source).flatMap((invocation) => {
    const words = invocationProgram(invocation.words);
    const program = words[0]?.value;
    const args = words.slice(1);
    const input = [
      ...inheritedInput,
      ...invocation.pipeline.flatMap((stage) => [
        ...stage.words,
        ...stage.stdin.map(literal),
      ]),
      ...invocation.stdin.map(literal),
    ];
    if (program === "eval")
      return executableInvocations(
        args.map((word) => requireLiteral(word, "eval command")).join(" "),
        depth + 1,
        input,
      );
    if (shellPrograms.has(program ?? "")) {
      // Shells accept combined short options such as -lc and -xc. The command
      // operand has the same effects whether the c option is combined or not.
      const commandOption = args.findIndex((arg) =>
        /^-[a-z]*c[a-z]*$/i.test(requireLiteral(arg, "shell option")),
      );
      if (commandOption >= 0)
        return executableInvocations(
          requireLiteral(args[commandOption + 1], "shell command"),
          depth + 1,
          input,
        );
      if (invocation.stdin.length)
        return [
          words,
          ...executableInvocations(
            invocation.stdin.join("\n"),
            depth + 1,
            input,
          ),
        ];
      refuseDeniedProgram([...input, ...words]);
    }
    // Recognizing a program never makes its remaining operands data. Keep the
    // literal floor for every invocation except proven data operands; structured
    // classification may add effects, but cannot exempt a future subcommand.
    // An already-denied invocation keeps its precise effect classification.
    if (!dataPrograms.has(program ?? "") && !deniedInvocation(words))
      refuseDeniedProgram([...input, ...floorOperands(words)]);
    return words.length ? [words] : [];
  });
}

function gitOperandIndex(args: readonly ShellWord[]): number {
  let index = 0;
  while (args[index]) {
    const value = requireLiteral(args[index], "Git subcommand");
    if (!value.startsWith("-") || value === "--")
      return value === "--" ? index + 1 : index;
    if (/^(?:-C|--git-dir(?:=|$)|--work-tree(?:=|$))/.test(value))
      throw new HarnessCommandRefused(
        "Shell working-directory override needs a separately reviewed host adapter",
      );
    const separate = ["-c", "--config-env"].includes(value);
    const config = separate
      ? requireLiteral(args[index + 1], "Git configuration")
      : (/^-c(.+)$/.exec(value)?.[1] ?? /^--config-env=(.*)$/.exec(value)?.[1]);
    if (config && /^alias\./i.test(config))
      throw new HarnessCommandRefused(
        "Git alias configuration requires an explicit effect adapter",
      );
    if (config)
      refuseDeniedProgram([literal(config.slice(config.indexOf("=") + 1))]);
    index += separate ? 2 : 1;
  }
  return index;
}

/** Remove only message/search operands whose data role is known. Keep a
 * placeholder so removing data cannot manufacture an adjacent command pair.
 * Unknown options keep their bytes and disable implicit grep-pattern inference.
 */
function floorOperands(words: readonly ShellWord[]): readonly ShellWord[] {
  if (words[0]?.value !== "git") return words;
  const subcommandIndex = 1 + gitOperandIndex(words.slice(1));
  const subcommand = words[subcommandIndex]?.value;
  const messages = ["commit", "tag", "notes", "stash"].includes(
    subcommand ?? "",
  );
  if (!messages && !["log", "grep"].includes(subcommand ?? "")) return words;
  const result = words.slice(0, subcommandIndex + 1);
  let implicitPattern = subcommand === "grep";
  const grepFlags =
    /^(?:-[inwvlLhHcIqEaPFox]+|--(?:cached|no-index|untracked|no-exclude-standard|recurse-submodules|text|textconv|ignore-case|word-regexp|invert-match|full-name|line-number|column|files-with-matches|files-without-match|count|quiet|only-matching|and|or|not|all-match))$/;
  for (let index = subcommandIndex + 1; index < words.length; index++) {
    const word = words[index]!;
    const value = word.value;
    if (value === "--") {
      result.push(word);
      if (implicitPattern && words[index + 1]) {
        result.push(literal("<data>"));
        index++;
      }
      result.push(...words.slice(index + 1));
      break;
    }
    const separate = messages
      ? ["-m", "-F", "--message", "--file"].includes(value)
      : subcommand === "log"
        ? ["--grep", "-S", "-G"].includes(value)
        : ["-e", "--regexp", "-f", "--file"].includes(value);
    const inline = messages
      ? /^(?:--(?:message|file)=|-[aqsv]*(?:m|F).)/.test(value)
      : subcommand === "log"
        ? /^(?:--grep=|-[SG].)/.test(value)
        : /^(?:--(?:regexp|file)=|-[ef].)/.test(value);
    if (separate && words[index + 1]) {
      result.push(word, literal("<data>"));
      index++;
      implicitPattern = false;
    } else if (inline || (implicitPattern && !value.startsWith("-"))) {
      result.push(literal("<data>"));
      implicitPattern = false;
    } else {
      result.push(word);
      if (implicitPattern && !grepFlags.test(value)) implicitPattern = false;
    }
  }
  return result;
}

/** All real commit invocations owe literal message bytes. Quoted examples and
 * search patterns never enter this path; a missing message is a named refusal.
 */
export function commitMessageInputs(
  source: string,
): { messages: string[]; files: string[] }[] {
  return executableInvocations(source).flatMap(([program, ...args]) => {
    if (program?.value !== "git") return [];
    const index = gitOperandIndex(args);
    if (
      !args[index] ||
      requireLiteral(args[index], "Git subcommand") !== "commit"
    )
      return [];
    const messages: string[] = [],
      files: string[] = [];
    for (let i = index + 1; i < args.length; i++) {
      const arg = requireLiteral(args[i], "commit argument");
      if (arg === "--") break;
      const short = /^-[aqsv]*(m|F)(.*)$/.exec(arg);
      const long = /^--(message|file)(?:=(.*))?$/.exec(arg);
      if (!short && !long) continue;
      const kind = short?.[1] ?? long?.[1];
      const inline = short ? short[2] || undefined : long?.[2];
      const value = inline ?? requireLiteral(args[++i], "commit message");
      (kind === "m" || kind === "message" ? messages : files).push(value);
    }
    if (!messages.length && !files.length)
      throw new HarnessCommandRefused(
        "Commit message bytes unavailable; use an explicit message or message file",
      );
    return [{ messages, files }];
  });
}

function deniedInvocation(words: readonly ShellWord[]): string | undefined {
  if (!words.length) return;
  const program = basename(
    requireLiteral(words[0], "executable"),
  ).toLowerCase();
  const args = words.slice(1);
  if (["ssh", "scp", "sftp"].includes(program)) return "transport.ssh";
  if (program === "git") {
    const operand = args[gitOperandIndex(args)];
    if (
      operand &&
      ["push", "send-pack"].includes(requireLiteral(operand, "Git subcommand"))
    )
      return "remote.unapproved";
  }
  if (["gh", "npm", "pnpm", "yarn"].includes(program) && args.length) {
    const first = requireLiteral(args[0], `${program} subcommand`);
    if (first.startsWith("-")) {
      if (
        ["--version", "--help", "-v", "-h"].includes(first) &&
        args.length === 1
      )
        return;
      throw new HarnessCommandRefused(
        "Command options before the subcommand require an explicit effect adapter",
      );
    }
    if (program !== "gh" && first === "publish") return "package.publish";
    if (
      program === "gh" &&
      Object.hasOwn(githubWrites, first) &&
      args[1] &&
      githubWrites[first]!.includes(
        requireLiteral(args[1], "GitHub subcommand"),
      )
    )
      return "remote.unapproved";
    if (program === "gh" && first === "api") {
      let method: string | undefined;
      let body = false;
      let endpoint: string | undefined;
      for (let index = 1; index < args.length; index++) {
        const value = requireLiteral(args[index], "GitHub API argument");
        if (["-X", "--method"].includes(value))
          method = requireLiteral(args[++index], "GitHub API method");
        else if (/^(?:-X.|--method=)/.test(value))
          method = value.replace(/^(?:-X=?|--method=)/, "");
        else if (
          ["-f", "-F", "--field", "--raw-field", "--input"].includes(value)
        ) {
          requireLiteral(args[++index], "GitHub API body");
          body = true;
        } else if (/^(?:-[fF].|--(?:input|(?:raw-)?field)=)/.test(value))
          body = true;
        else if (
          [
            "--cache",
            "--hostname",
            "-q",
            "--jq",
            "-H",
            "--header",
            "-p",
            "--preview",
            "-t",
            "--template",
          ].includes(value)
        )
          requireLiteral(args[++index], "GitHub API option value");
        else if (!value.startsWith("-")) endpoint ??= value;
      }
      if (
        // Query semantics are opaque to this adapter, even with an explicit
        // read method. The CLI itself does not force every GraphQL call to POST.
        endpoint === "graphql" ||
        !["GET", "HEAD", "OPTIONS"].includes(
          (method ?? (body ? "POST" : "GET")).toUpperCase(),
        )
      )
        return "remote.unapproved";
    }
  }
}
const commonGithubWrites = [
  "create",
  "merge",
  "edit",
  "delete",
  "comment",
  "review",
  "close",
  "reopen",
  "lock",
  "unlock",
];
const githubWrites: Record<string, readonly string[]> = {
  pr: [...commonGithubWrites, "ready"],
  release: [...commonGithubWrites, "upload"],
  repo: [...commonGithubWrites, "fork", "sync"],
  issue: commonGithubWrites,
  workflow: ["run"],
  secret: ["set"],
  variable: ["set"],
  gist: ["create"],
  label: ["create"],
  run: ["cancel", "rerun"],
};
const effectPrograms = new Set([
  "git",
  "gh",
  "npm",
  "pnpm",
  "yarn",
  "ssh",
  "scp",
  "sftp",
]);
/** Opaque program text is not parsed as its source language. Literal denied
 * sequences need a reviewed adapter; ordinary data-producing invocations do not.
 */
function refuseDeniedProgram(words: readonly ShellWord[]) {
  // Preserve the literal floor even when source-language punctuation abuts an
  // operand. Structured token screening below also covers newer effect forms.
  if (
    /\bgit\s+(?:push|send-pack)\b|\b(?:npm|pnpm|yarn)\s+publish\b|\bgh\s+(?:pr|release|repo)\s+(?:create|merge|edit|delete)\b|(?:^|[\s;&|])(ssh|scp|sftp)(?:\s|$)/i.test(
      words.map(({ value }) => value).join(" "),
    )
  )
    throw new HarnessCommandRefused(
      "Opaque program contains a denied invocation; an explicit effect adapter is required",
    );
  const tokens = words.flatMap(({ value }) =>
    (value.match(/[A-Za-z0-9_./=+-]+/g) ?? []).map(literal),
  );
  for (let index = 0; index < tokens.length; index++)
    if (
      effectPrograms.has(basename(tokens[index]!.value).toLowerCase()) &&
      deniedInvocation(tokens.slice(index))
    )
      throw new HarnessCommandRefused(
        "Opaque program contains a denied invocation; an explicit effect adapter is required",
      );
}
const dataPrograms = new Set([
  "echo",
  "printf",
  "rg",
  "grep",
  "cat",
  "head",
  "tail",
  "less",
  "sed",
  "sort",
  "wc",
  "jq",
  "test",
  "[",
  "command",
]);

export function invocationEffects(source: string): string[] {
  return executableInvocations(source).flatMap((words) => {
    const [program, ...args] = words.map((word) => word.value);
    if (!program) return [];
    if (program === "cd")
      throw new HarnessCommandRefused(
        "Shell working-directory override needs a separately reviewed host adapter",
      );
    const denied = deniedInvocation(words);
    if (denied) return [denied];
    if (
      ["claude", "codex"].includes(program) &&
      args.some((arg) =>
        /--dangerously-(?:skip|bypass)|danger-full-access/.test(arg),
      )
    )
      return ["sandbox.disable"];
    if (
      program === "node" &&
      args[0] === "scripts/harness.mjs" &&
      args[1] === "read-output" &&
      /(?:^|\/)\.env(?:\.|$)|(?:^|\/)\.ssh(?:\/|$)/.test(args[2] ?? "")
    )
      return ["credentials.access"];
    // Search expressions are data; only explicit path operands are screened.
    const pathArgs = ["rg", "grep"].includes(program)
      ? args.filter((arg) => !arg.startsWith("-")).slice(1)
      : [
            "cat",
            "head",
            "tail",
            "less",
            "sed",
            "cp",
            "mv",
            "rm",
            "touch",
          ].includes(program)
        ? args
        : [];
    if (
      pathArgs.some((arg) =>
        /(?:^|\/)\.env(?:\.|$)|(?:^|\/)\.ssh(?:\/|$)/.test(arg),
      )
    )
      return ["credentials.access"];
    if (pathArgs.some((arg) => /^~\//.test(arg))) return ["settings.user"];
    if (
      program === "npm" &&
      args[0] === "run" &&
      ["resume", "worktree", "release", "plan", "discover"].includes(
        args[1] ?? "",
      )
    )
      return ["lifecycle.run"];
    if (
      program === "node" &&
      /^scripts\/(?:resume|worktree|release|refute-plan|discover)\.mjs$/.test(
        args[0] ?? "",
      )
    )
      return ["lifecycle.run"];
    return ["shell.run"];
  });
}
