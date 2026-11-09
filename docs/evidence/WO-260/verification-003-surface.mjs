// VER-003 criterion 4 probe for WO-260. It varies what the executor's
// 45-text shell-oracle case and VER-002's 53 texts held constant: the
// carrier (a .sh file, an extensionless shell file named by its shebang, a
// string in a .mjs file, a template literal in a .ts file), the command's
// line, the program's spelling and position, quoting around a separate Git
// command, and the newer forms besides ls-tree --format. The shell decides
// whether Git receives the option: a stand-in git logs its arguments. Each
// in-reading text must be named with its file and line wherever the shell
// passes the option. Texts in a documented limit are reported separately and
// are not judged as misses. Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-260/verification-003-surface.mjs
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const repo = process.cwd();
const mod = (p) => import(pathToFileURL(join(repo, p)));
const { createFixtureRoot, removeTemporaryPath } = await mod(
  "scripts/lib/temporary-roots.mjs",
);
const { isolatedGitEnvironment } = await mod("scripts/lib/git.mjs");
const { checkGitSurface } = await mod("scripts/lib/git-surface.mjs");
const root = createFixtureRoot(join(tmpdir(), "dotln-ver260-003-"));
const tree = join(root, "tree");
const log = join(root, "oracle.log");
const put = (p, value, mode) => {
  mkdirSync(join(tree, p, ".."), { recursive: true });
  writeFileSync(join(tree, p), value, mode ? { mode } : undefined);
};
const environment = { ...process.env, ...isolatedGitEnvironment(root) };
const results = [];
const misses = [];
const falseNames = [];
const limits = [];
let exitCode = 0;
try {
  mkdirSync(tree);
  const init = spawnSync("git", ["init", "-q"], {
    cwd: tree,
    env: environment,
    encoding: "utf8",
  });
  if (init.status !== 0) throw new Error(init.stderr);
  put("package.json", JSON.stringify({ engines: { git: ">=2.31.0" } }));
  // The repository's own confirmed forms, with every scoped form left out,
  // so each newer form below is one the record lacks.
  const real = JSON.parse(
    readFileSync(join(repo, "scripts/lib/git-surface.json"), "utf8"),
  );
  put(
    "scripts/lib/git-surface.json",
    JSON.stringify({
      floor: ">=2.31.0",
      confirmation: "VER-003 fixture.",
      scoped: {},
      forms: real.forms,
    }),
  );
  mkdirSync(join(root, "bin"));
  writeFileSync(
    join(root, "bin/git"),
    '#!/bin/sh\n{ printf "CALL\\n"; for a; do printf "ARG %s\\n" "$a"; done; } >> "$ORACLE_LOG"\nexit 0\n',
    { mode: 0o755 },
  );
  // Each target: the form the check must name, and how the oracle sees it.
  const targets = {
    format: {
      form: "ls-tree --format",
      sub: ["ls-tree"],
      arg: (a) => a.startsWith("--format"),
    },
    z: {
      form: "worktree list -z",
      sub: ["worktree", "list"],
      arg: (a) => a === "-z",
    },
    source: {
      form: "check-attr --source",
      sub: ["check-attr"],
      arg: (a) => a.startsWith("--source"),
    },
    refs: {
      form: "fsck --no-references",
      sub: ["fsck"],
      arg: (a) => a === "--no-references",
    },
    refFormat: {
      form: "rev-parse --show-ref-format",
      sub: ["rev-parse"],
      arg: (a) => a === "--show-ref-format",
    },
  };
  const P = "git ls-tree HEAD --format=plain";
  // [name, body lines after the shebang, target, shell, limit]
  // The Git command is on the body's last line unless `at` says otherwise.
  const cases = [
    // Program spellings and positions.
    ["command builtin", [`command ${P}`]],
    ["exec", [`exec ${P}`]],
    ["env with assignment", [`env GIT_PAGER=cat ${P}`]],
    ["env path", [`/usr/bin/env ${P}`]],
    [
      "quoted variable program",
      [`GIT=git; "$GIT" ls-tree HEAD --format=plain`],
    ],
    [
      "braced variable program",
      [`GITBIN=git; \${GITBIN} ls-tree HEAD --format=plain`],
    ],
    ["if condition", [`if ${P} >/dev/null; then :; fi`]],
    ["negated", [`! ${P}`]],
    ["or true", [`${P} || true`]],
    ["pipe", [`${P} | cat`]],
    ["brace group", [`{ ${P}; }`]],
    ["subshell", [`(cd . && ${P})`]],
    ["function", [`f() { ${P}; }; f`]],
    ["case arm", [`case x in x) ${P} ;; esac`]],
    ["unquoted substitution assignment", [`x=$(${P}); echo "$x"`]],
    ["unquoted substitution argument", [`echo $(${P})`]],
    ["background", [`${P} & wait`]],
    ["for loop", [`for x in a; do ${P}; done`]],
    ["while after", [`while false; do :; done; ${P}`]],
    ["dash C global", [`git -C . ls-tree HEAD --format=plain`]],
    ["git-dir global", [`git --git-dir=.git ls-tree HEAD --format=plain`]],
    ["c global", [`git -c core.quotepath=off ls-tree HEAD --format=plain`]],
    ["option first", [`git ls-tree --format=plain HEAD`]],
    ["separate option value", [`git ls-tree HEAD --format plain`]],
    ["tabs", [`git\tls-tree\tHEAD\t--format=plain`]],
    ["second command", [`git ls-tree -r HEAD && ${P}`]],
    ["trailing comment with apostrophe", [`${P} # it's "done"`]],
    // Quoting around a separate Git command.
    [
      "escaped double quote in assignment",
      [`msg="say \\"it's\\""; ${P}; note="dogs' toys"`],
    ],
    ["hash in assignment", [`msg="it's #1"; ${P}; note="dogs' toys"`]],
    [
      "positional in assignment",
      [`set -- a; msg="it's $1"; ${P}; note="dogs' toys"`],
    ],
    [
      "all positionals in assignment",
      [`set -- a; msg="it's $@"; ${P}; note="dogs' toys"`],
    ],
    // A braced parameter before an apostrophe. (An apostrophe inside
    // "${unset:-...}" is a syntax error in this host's sh, so it is no input.)
    [
      "braced parameter in assignment",
      [`msg="\${HOME}/it's"; ${P}; note="dogs' toys"`],
    ],
    [
      "exported assignments",
      [`export MSG="it's"; ${P}; export NOTE="dogs' toys"`],
    ],
    ["prefix assignments", [`a="it's" b="dogs' toys" ${P}`]],
    [
      "local assignments",
      [`f() { local msg="it's"; ${P}; local note="dogs' toys"; }; f`],
      "format",
      "bash",
    ],
    [
      "printf words",
      [`printf '%s\\n' "it's"; ${P}; printf '%s\\n' "dogs' toys"`],
    ],
    ["echo words", [`echo "it's" && ${P} && echo "dogs' toys"`]],
    ["test words", [`[ "it's" = "it's" ] && ${P}; [ -n "dogs' toys" ]`]],
    [
      "bash test words",
      [`[[ "it's" == "it's" ]] && ${P}; [[ -n "dogs' toys" ]]`],
      "format",
      "bash",
    ],
    ["single-quote splice", [`msg='it'"'"'s'; ${P}; note='dogs'"'"' toys'`]],
    ["escaped apostrophes", [`msg=it\\'s; ${P}; note=dogs\\'`]],
    ["escaped apostrophe word", [`echo It\\'s && ${P} && echo "dogs' toys"`]],
    [
      "log format values",
      [
        `git log -1 --format="%an's" HEAD; ${P}; git log -1 --format="%cn's" HEAD`,
      ],
    ],
    [
      "commit messages",
      [`git commit -q -m "it's"; ${P}; git commit -q -m "dogs' toys"`],
    ],
    ["both assignments before", [`msg="it's"; note="dogs' toys"; ${P}`]],
    ["both assignments after", [`${P}; msg="it's"; note="dogs' toys"`]],
    [
      "single-quoted values with double quotes",
      [`a='say "hi"'; ${P}; b='x "y"'`],
    ],
    [
      "hash parameter in assignment",
      [`msg="it's $#"; ${P}; note="dogs' toys"`],
    ],
    [
      "escaped backslash ending an assignment",
      [`msg="it's \\\\"; ${P}; note="dogs' toys"`],
    ],
    [
      "several double-quoted words",
      [`echo "it's" "that's"; ${P}; echo "dogs' toys"`],
    ],
    [
      "quoted -c word with an apostrophe",
      [`git -c "user.name=it's me" ls-tree HEAD --format=plain`],
    ],
    [
      "option value is a substitution",
      [`git ls-tree HEAD --format="$(echo plain)"`],
    ],
    [
      "option value is a backtick substitution",
      ["git ls-tree HEAD --format=`echo plain`"],
    ],
    [
      "env shebang",
      [`msg="it's"; ${P}; note="dogs' toys"`],
      "format",
      "bash",
      null,
      0,
      "#!/usr/bin/env bash",
    ],
    [
      "here-string input",
      [`git check-attr --stdin text <<< "it's"; ${P}; echo "dogs' toys"`],
      "format",
      "bash",
    ],
    // Lines and continuations.
    ["later line", ["# it's a comment", "", "set -e", P]],
    [
      "continued assignment",
      [`msg="it's \\`, `fine"; ${P}; note="dogs' toys"`],
      "format",
      "sh",
      null,
      0,
    ],
    [
      "continued plain option",
      [`git ls-tree HEAD \\`, `  --format=plain`],
      "format",
      "sh",
      null,
      0,
    ],
    ["carriage returns", [`${P}\r`]],
    // The other newer forms of the Observed gap.
    ["worktree -z", [`git worktree list --porcelain -z`], "z"],
    [
      "worktree -z between assignments",
      [`msg="it's"; git worktree list --porcelain -z; note="dogs' toys"`],
      "z",
    ],
    [
      "check-attr source",
      [`echo x | git check-attr --stdin --source=HEAD text`],
      "source",
    ],
    ["fsck no-references", [`git fsck --no-references`], "refs"],
    [
      "rev-parse show-ref-format",
      [`git rev-parse --show-ref-format`],
      "refFormat",
    ],
    [
      "source between assignments",
      [
        `msg="it's"; echo x | git check-attr --stdin --source=HEAD text; note="dogs' toys"`,
      ],
      "source",
    ],
    // Documented limits (module header): reported, not judged as misses.
    [
      "limit: substitution in an assignment value",
      [`x="$(echo a) it's"; ${P}; y="dogs' toys"`],
      "format",
      "sh",
      "an option after a substitution",
    ],
    [
      "limit: backtick in an assignment value",
      ['x="`echo a` it\'s"; ' + P + `; y="dogs' toys"`],
      "format",
      "sh",
      "an option after a substitution",
    ],
    [
      "limit: double-quoted piece inside a word",
      [`test -n x"it's" && ${P} && test -n y"dogs' toys"`],
      "format",
      "sh",
      "a double-quoted piece elsewhere inside a word",
    ],
    [
      "limit: value not ending the word",
      [`msg="it's"x; ${P}; note="dogs' toys"`],
      "format",
      "sh",
      "a double-quoted piece elsewhere inside a word (the value does not end at a blank or separator)",
    ],
    [
      "limit: single-quoted piece holding a double quote inside a word",
      [`a='say "hi"'x; ${P}; b='y "z"'`],
      "format",
      "sh",
      "a single-quoted piece inside a word that holds a double quote and does not end the word",
    ],
    [
      "limit: redirection before the option",
      [`git ls-tree HEAD 2>/dev/null --format=plain`],
      "format",
      "sh",
      "an option after a redirection",
    ],
    [
      "limit: defaulted program",
      [`"\${GIT:-git}" ls-tree HEAD --format=plain`],
      "format",
      "sh",
      "a program named by a defaulted expansion (D030's consistency note)",
    ],
    // Quotes inside an option's name: only outer quotes are removed
    // (shellCommands' own comment), so these are observations, not claims.
    [
      "observation: whole name single-quoted before =",
      [`git ls-tree HEAD '--format'=plain`],
      "format",
      "sh",
      "a quoted piece inside an option's word; only outer quotes are removed",
    ],
    [
      "observation: whole name double-quoted before =",
      [`git ls-tree HEAD "--format"=plain`],
      "format",
      "sh",
      "a quoted piece inside an option's word; only outer quotes are removed",
    ],
    [
      "observation: name partly single-quoted",
      [`git ls-tree HEAD --'format'=plain`],
      "format",
      "sh",
      "a quoted piece inside an option's word; only outer quotes are removed",
    ],
    [
      "observation: name and value partly double-quoted",
      [`git ls-tree HEAD --"format=plain"`],
      "format",
      "sh",
      "a double-quoted piece elsewhere inside a word",
    ],
  ];
  const callsOf = (text) => {
    const calls = [];
    for (const line of text.split("\n")) {
      if (line === "CALL") calls.push([]);
      else if (line.startsWith("ARG ")) calls.at(-1)?.push(line.slice(4));
    }
    return calls;
  };
  const oracle = (source, shell, target) => {
    writeFileSync(log, "");
    put("oracle/t.sh", source);
    const run = spawnSync(shell, ["oracle/t.sh"], {
      cwd: tree,
      env: {
        ...environment,
        ORACLE_LOG: log,
        PATH: `${join(root, "bin")}:${environment.PATH}`,
      },
      encoding: "utf8",
    });
    const calls = callsOf(readFileSync(log, "utf8"));
    const passed = calls.some((args) => {
      const at = args.indexOf(target.sub[0]);
      return (
        at !== -1 &&
        target.sub.every((w, i) => args[at + i] === w) &&
        args.slice(at + target.sub.length).some(target.arg)
      );
    });
    return {
      status: run.status,
      stderr: run.stderr.trim().slice(0, 300),
      passed,
    };
  };
  const blank = () => {
    put("scripts/tool.sh", "#!/bin/sh\n");
    put("scripts/bin/tool", "#!/bin/sh\n");
    put("scripts/tool.mjs", "export {};\n");
    put("packages/x/src/tool.ts", "export {};\n");
    put("oracle/t.sh", "#!/bin/sh\n");
  };
  for (const [
    name,
    body,
    targetKey = "format",
    shell = "sh",
    limit = null,
    at = body.length - 1,
    shebang = `#!/bin/${shell}`,
  ] of cases) {
    const target = targets[targetKey];
    // A closing exit 0 keeps a negated or failing test from reading as a
    // shell error; a syntax error still exits 2 before anything runs.
    const source = `${shebang}\n${body.join("\n")}\nexit 0\n`;
    const commandLine = 2 + at;
    blank();
    const shellRun = oracle(source, shell, target);
    put("oracle/t.sh", "#!/bin/sh\n");
    const carriers = [
      ["scripts/tool.sh", source, commandLine],
      ["scripts/bin/tool", source, commandLine],
      [
        "scripts/tool.mjs",
        `import { writeFileSync } from "node:fs";\nwriteFileSync("t.sh", ${JSON.stringify(source)});\n`,
        2,
      ],
    ];
    // A template literal carries a text with no backslash, backtick, ${ or
    // carriage return; it opens on line 1, so its lines are the text's.
    if (!/[\\`\r]|\$\{/u.test(source))
      carriers.push([
        "packages/x/src/tool.ts",
        `export const script = \`${source}\`;\n`,
        commandLine,
      ]);
    for (const [file, contents, line] of carriers) {
      blank();
      put(file, contents, file === "scripts/bin/tool" ? 0o755 : undefined);
      const check = checkGitSurface(tree);
      const named = check.output.includes(`${target.form} (${file}:${line})`);
      const anywhere = check.output.includes(`${target.form} (`);
      const reading = {
        name,
        file,
        line,
        shell,
        form: target.form,
        shellStatus: shellRun.status,
        shellPassed: shellRun.passed,
        named,
        namedElsewhere: anywhere && !named,
        checkExit: check.exitCode,
        limit,
      };
      results.push(reading);
      if (shellRun.status !== 0) {
        reading.shellError = shellRun.stderr;
        exitCode = 1;
      } else if (limit) limits.push(reading);
      else if (shellRun.passed && !named) {
        misses.push({
          ...reading,
          text: body.join("\n"),
          contents,
          output: check.output.slice(0, 600),
        });
        exitCode = 1;
      } else if (!shellRun.passed && anywhere) falseNames.push(reading);
    }
  }
  // JavaScript call shapes (a reader the repair did not touch), each named
  // by construction: a literal list handed to a call that runs Git.
  const scripts = [
    [
      "js: spawnSync literal git",
      'import { spawnSync } from "node:child_process";\nspawnSync("git", ["ls-tree", "--format=%(path)", "HEAD"]);\n',
      2,
      "format",
    ],
    [
      "js: execFileSync with -C",
      'import { execFileSync } from "node:child_process";\nconst dir = ".";\nexecFileSync("git", ["-C", dir, "ls-tree", "--format", "%(path)", "HEAD"]);\n',
      3,
      "format",
    ],
    [
      "js: git helper with a template option",
      'import { git } from "./lib/git.mjs";\nconst fmt = "%(path)";\ngit(".", ["ls-tree", `--format=${fmt}`, "HEAD"]);\n',
      3,
      "format",
    ],
    [
      "js: multi-line list",
      'import { spawnSync } from "node:child_process";\nspawnSync("git", [\n  "ls-tree",\n  "--format=%(path)",\n  "HEAD",\n]);\n',
      2,
      "format",
    ],
    [
      "js: promisified execFile",
      'import { execFile } from "node:child_process";\nimport { promisify } from "node:util";\nconst run = promisify(execFile);\nawait run("git", ["ls-tree", "--format=%(path)", "HEAD"]);\n',
      4,
      "format",
    ],
    [
      "js: worktree -z",
      'import { spawnSync } from "node:child_process";\nspawnSync("git", ["worktree", "list", "--porcelain", "-z"]);\n',
      2,
      "z",
    ],
  ];
  const scriptLimits = [
    [
      "js limit: list held in a variable",
      'import { spawnSync } from "node:child_process";\nconst args = ["ls-tree", "--format=%(path)", "HEAD"];\nspawnSync("git", args);\n',
      2,
      "format",
      "arguments built from variables or arrays (planning receipt, criterion 4)",
    ],
    [
      "js observation: GIT_* shorthand property",
      'import { spawnSync } from "node:child_process";\nconst GIT_CONFIG_GLOBAL = "/dev/null";\nspawnSync("git", ["status"], { env: { ...process.env, GIT_CONFIG_GLOBAL } });\n',
      3,
      "GIT_CONFIG_GLOBAL",
      "a GIT_* name as a shorthand property; criterion 4 names the ls-tree --format pair",
    ],
  ];
  for (const [name, contents, line, key, limit = null] of [
    ...scripts,
    ...scriptLimits,
  ]) {
    const form = targets[key]?.form ?? key;
    blank();
    put("scripts/tool.mjs", contents);
    const check = checkGitSurface(tree);
    const named = check.output.includes(`${form} (scripts/tool.mjs:${line})`);
    const reading = {
      name,
      file: "scripts/tool.mjs",
      line,
      form,
      shellPassed: true,
      named,
      checkExit: check.exitCode,
      limit,
    };
    results.push(reading);
    if (limit) limits.push(reading);
    else if (!named) {
      misses.push({
        ...reading,
        text: contents,
        contents,
        output: check.output.slice(0, 600),
      });
      exitCode = 1;
    }
  }
  // The CLI entry point names each in-reading miss as the in-process check does.
  const cli = [];
  for (const miss of misses.slice(0, 4)) {
    blank();
    put(
      miss.file,
      miss.contents,
      miss.file === "scripts/bin/tool" ? 0o755 : undefined,
    );
    const run = spawnSync(
      process.execPath,
      [join(repo, "scripts/structural-checks.mjs"), "git-surface"],
      {
        cwd: tree,
        env: { ...process.env, DOTLN_LAUNCHPAD: tree },
        encoding: "utf8",
      },
    );
    cli.push({
      name: miss.name,
      file: miss.file,
      exit: run.status,
      stdout: run.stdout.slice(0, 600),
    });
  }
  // The CLI entry point, sampled on in-reading texts it must name.
  const cliSample = [];
  for (const [file, contents, expected] of [
    [
      "scripts/tool.sh",
      `#!/bin/sh\nmsg="say \\"it's\\""; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
      "ls-tree --format (scripts/tool.sh:2)",
    ],
    [
      "scripts/bin/tool",
      `#!/usr/bin/env bash\nmsg="it's"; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
      "ls-tree --format (scripts/bin/tool:2)",
    ],
    [
      "scripts/tool.mjs",
      `import { writeFileSync } from "node:fs";\nwriteFileSync("t.sh", ${JSON.stringify(`#!/bin/sh\nmsg="it's"; git worktree list --porcelain -z; note="dogs' toys"\n`)});\n`,
      "worktree list -z (scripts/tool.mjs:2)",
    ],
  ]) {
    blank();
    put(file, contents, file === "scripts/bin/tool" ? 0o755 : undefined);
    const run = spawnSync(
      process.execPath,
      [join(repo, "scripts/structural-checks.mjs"), "git-surface"],
      {
        cwd: tree,
        env: { ...process.env, DOTLN_LAUNCHPAD: tree },
        encoding: "utf8",
      },
    );
    const named = run.stdout.includes(expected);
    cliSample.push({ file, expected, exit: run.status, named });
    if (run.status !== 1 || !named) exitCode = 1;
  }
  // A JavaScript reading has no shell run; its oracle is its literal list.
  const valid = (r) => r.shellStatus === undefined || r.shellStatus === 0;
  const summary = {
    cases: cases.length + scripts.length + scriptLimits.length,
    readings: results.length,
    judged: results.filter((r) => !r.limit && valid(r)).length,
    optionPassedJudged: results.filter(
      (r) => !r.limit && valid(r) && r.shellPassed,
    ).length,
    namedJudged: results.filter(
      (r) => !r.limit && valid(r) && r.shellPassed && r.named,
    ).length,
    misses,
    falseNames,
    shellErrors: results.filter((r) => !valid(r)),
    limits: limits.map(({ name, file, shellPassed, named, limit }) => ({
      name,
      file,
      shellPassed,
      named,
      limit,
    })),
    cli,
    cliSample,
  };
  console.log(JSON.stringify(summary, null, 2));
} finally {
  removeTemporaryPath(root, { recursive: true, force: true });
}
process.exitCode = exitCode;
