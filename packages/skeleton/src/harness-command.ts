import { basename } from "node:path";

/** A classified refusal is distinct from missing host facts or runtime bytes. */
export class HarnessCommandRefused extends Error {}

/** Effect inventory for the tools exposed by the observed harness profiles.
 * Unknown names are never presumed to be reads. Opaque shell/delegation routes
 * need the same adapter as their native counterparts before they may run.
 */
export const harnessToolEffects = {
  Read: "read",
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
  KillShell: "shell",
  Agent: "spawn",
  Task: "spawn",
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
    quoted = false;
  let heredocs: { delimiter: string; words: ShellWord[] }[] = [];
  let needsDelimiter = false;
  const flush = () => {
    if (!inWord) return;
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
    } else current.push({ value: word, dynamic, quoted });
    word = "";
    inWord = false;
    dynamic = false;
    quoted = false;
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
      if (char === "$" && /[A-Za-z0-9_{$'"@*#?!-]/.test(line[i + 1] ?? ""))
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
      if (/\s/.test(char)) {
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

/** Bounded destination adapter for gate admission. null means the destinations
 * are opaque, never an empty write set. Keep expansion/quotation provenance;
 * arbitrary scripts and interpreters need their own reviewed path adapter.
 */
export function shellWritePaths(source: string): readonly string[] | null {
  try {
    const paths: string[] = [];
    for (const invocation of shellWords(source)) {
      if (invocation.stdin.length) return null;
      const words = invocation.words;
      const command: string[] = [];
      for (let index = 0; index < words.length; index++) {
        const word = words[index]!;
        // Whole-word quotation does not prove every character was quoted.
        // Mixed/escaped wildcard forms stay opaque to this bounded adapter.
        if (word.dynamic || /[*?\[\]{}~]/.test(word.value)) return null;
        if (/^(?:\d*[<>]&\d+)$/.test(word.value) && !word.quoted) continue;
        const redirect = /^(?:\d*>>?|&>>?)(.*)$/.exec(word.value);
        if (redirect && !word.quoted) {
          const target = redirect[1]
            ? { ...word, value: redirect[1] }
            : words[++index];
          if (!target || target.dynamic || /[*?\[\]{}~<>]/.test(target.value))
            return null;
          paths.push(target.value);
        } else {
          // Mixed quoted/unquoted redirects and embedded redirects are opaque.
          if (/[<>]/.test(word.value)) return null;
          command.push(word.value);
        }
      }
      const [program, ...args] = command;
      if (!program) continue;
      if (["echo", "printf", "cat", "pwd", "true", "false"].includes(program))
        continue;
      const flags: Record<string, RegExp> = {
        touch: /^-(?:[acmh]+|-)/,
        mkdir: /^-(?:p|-)/,
        tee: /^-(?:[ai]+|-)/,
        rm: /^-(?:[rf]+|-)/,
      };
      if (!flags[program]) return null;
      let operands = false;
      for (const arg of args) {
        if (!operands && arg === "--") {
          operands = true;
          continue;
        }
        if (!operands && arg.startsWith("-")) {
          if (!flags[program]!.test(arg) || !/^-([acmhpirf]+)$/.test(arg))
            return null;
        } else paths.push(arg);
      }
    }
    return paths;
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
