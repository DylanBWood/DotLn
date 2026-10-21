// VER-001 probes for WO-223. Run from the repository root under the bounded
// wrapper, one at a time:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-223/verification-001/probes.mjs <probe> [args]
// Probes:
//   identity                      current code identity and the passing rows at it
//   checkpoint <ref>              working tree against a checkpoint, by blob hash
//   snapshot <dir> [--revert <path>]...
//                                 copy the gate inputs to <dir>; reverted paths
//                                 take the base commit's bytes
//   add-probes <dir>              place reader-probe.mjs and the hook probe in a
//                                 snapshot, formatted
//   patch-export <dir>            switch the export case's primary checkout to
//                                 a planning branch before its moved-record gate
//   lint                          subject-length text at boundaries
//   signoff                       sign-off FAIL line with and without a declared
//                                 operatorAuthor (synthetic identities)
// Snapshots and fixtures live in temporary directories; nothing here writes
// under the repository.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const BASE = "6df0ec37cc21143871217bade638e5ec28bc5959";
const repo = process.cwd();
const here = dirname(fileURLToPath(import.meta.url));
const load = (path) => import(pathToFileURL(join(repo, path)).href);
const print = (value) => console.log(JSON.stringify(value));
const git = (cwd, ...args) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 1 << 28,
  });
const [probe, ...args] = process.argv.slice(2);

// The paths the target-worktree, hook and exported-instance fixtures copy
// from their tool root, plus the shared dependencies by link.
const SNAPSHOT_PATHS = [
  "scripts",
  "packages",
  "package.json",
  "package-lock.json",
  "dotln.config.json",
  "tsconfig.json",
  ".prettierignore",
  ".prettierrc.json",
  ".gitignore",
  "LICENSE",
  "LICENSE-docs",
  "NOTICE",
  "corpus",
  "docs/product/07-execution-guide.md",
  "docs/product/08-publication-compiler.md",
  "docs/PLAYBOOK.md",
  "docs/publication/implementation-overlay-template.md",
  "docs/releases/tag-manifest.template.json",
  "docs/LEGAL.md",
];

const probes = {
  async identity() {
    const evidence = await load("packages/skeleton/src/gate-evidence.mjs");
    const tree = evidence.gateTreeHash(repo);
    const row = (checkId) => {
      const found = evidence.findGateCheck(repo, checkId, tree);
      return (
        found && {
          checkId: found.checkId,
          gateSelection: found.gateSelection,
          codeIdentity: found.codeIdentity,
          treeHash: found.treeHash,
          exitCode: found.exitCode,
          recordedAt: found.recordedAt,
          durationMs: found.durationMs,
          freshSuites: found.freshSuites,
          reusedSuites: found.reusedSuites,
          unrunSuites: found.unrunSuites,
        }
      );
    };
    print({
      codeIdentity: evidence.gateCodeIdentity(repo),
      treeHash: tree,
      npmTest: row("npm test"),
      documents: row("npm run test:docs"),
    });
  },

  checkpoint() {
    const [ref] = args;
    const blob = (bytes) =>
      createHash("sha1")
        .update(`blob ${bytes.length}\0`)
        .update(bytes)
        .digest("hex");
    const rows = git(repo, "ls-tree", "-r", "-z", ref)
      .split("\0")
      .filter(Boolean)
      .map((line) => {
        const [meta, path] = line.split("\t");
        const [, type, oid] = meta.split(" ");
        return { type, oid, path };
      })
      .filter((row) => row.type === "blob");
    const differ = [],
      missing = [];
    for (const row of rows) {
      const file = join(repo, row.path);
      let stat;
      try {
        stat = lstatSync(file);
      } catch {
        missing.push(row.path);
        continue;
      }
      const bytes = stat.isSymbolicLink()
        ? Buffer.from(readlinkSync(file))
        : readFileSync(file);
      if (blob(bytes) !== row.oid) differ.push(row.path);
    }
    const known = new Set(rows.map((row) => row.path));
    const extra = git(
      repo,
      "ls-files",
      "-z",
      "--cached",
      "--others",
      "--exclude-standard",
    )
      .split("\0")
      .filter(
        (path) => path && !known.has(path) && existsSync(join(repo, path)),
      );
    print({ ref, files: rows.length, differ, missing, extra });
  },

  snapshot() {
    const [target, ...rest] = args;
    const reverts = [];
    for (let index = 0; index < rest.length; index += 2) {
      if (rest[index] !== "--revert" || !rest[index + 1])
        throw new Error("usage: snapshot <dir> [--revert <path>]...");
      reverts.push(rest[index + 1]);
    }
    mkdirSync(target, { recursive: true });
    for (const path of SNAPSHOT_PATHS) {
      mkdirSync(dirname(join(target, path)), { recursive: true });
      cpSync(join(repo, path), join(target, path), {
        recursive: true,
        filter: (source) => !source.split("/").includes("node_modules"),
      });
    }
    symlinkSync(join(repo, "node_modules"), join(target, "node_modules"));
    const sha = (path) =>
      createHash("sha256")
        .update(readFileSync(join(target, path)))
        .digest("hex");
    for (const path of reverts) {
      const before = sha(path);
      writeFileSync(
        join(target, path),
        execFileSync("git", ["show", `${BASE}:${path}`], {
          cwd: repo,
          maxBuffer: 1 << 28,
        }),
      );
      print({ reverted: path, before, after: sha(path) });
    }
    print({ snapshot: "<snapshot>", reverts: reverts.length });
  },

  "add-probes"() {
    const [target] = args;
    copyFileSync(
      join(here, "reader-probe.mjs"),
      join(target, "scripts/reader-probe.mjs"),
    );
    appendFileSync(
      join(target, "scripts/test-harness.mjs"),
      `\n${readFileSync(join(here, "hook-probe.fragment.mjs"), "utf8")}`,
    );
    prettier(target, ["scripts/reader-probe.mjs", "scripts/test-harness.mjs"]);
    print({ added: ["scripts/reader-probe.mjs", "scripts/test-harness.mjs"] });
  },

  "patch-export"() {
    const [target] = args;
    const file = join(target, "scripts/test-launchpad-planning.mjs");
    let source = readFileSync(file, "utf8");
    const before = `    ok(observe(["meta"]), "moved-record meta in export");\n`;
    const after =
      '      assert.match(movedGate.stdout, new RegExp(`PASS ${name} `, "u"));\n';
    for (const anchor of [before, after])
      if (source.split(anchor).length !== 2)
        throw new Error(`anchor is not unique: ${anchor.trim()}`);
    source = source
      .replace(
        before,
        `    // VERIFIER PROBE: the primary checkout leaves main for a planning branch.
    git(kitMain, ["switch", "-q", "-c", "planning/verifier-probe"]);
    console.log("PROBE-WORKTREES " + git(kitMain, ["worktree", "list", "--porcelain"]).replaceAll(scratch, "<fixture>").replace(/\\n/g, " | "));
${before}`,
      )
      .replace(
        after,
        `${after}    console.log("PROBE-GATE " + movedGate.stdout.split("\\n").filter((line) => /^(PASS|FAIL|SKIP)/u.test(line)).join(" | ").replaceAll(scratch, "<fixture>"));
    git(kitMain, ["switch", "-q", "main"]);
    git(kitMain, ["branch", "-q", "-D", "planning/verifier-probe"]);
`,
      );
    writeFileSync(file, source);
    // The exported kit's own format task reads these copied scripts.
    prettier(target, ["scripts/test-launchpad-planning.mjs"]);
    print({ patched: "scripts/test-launchpad-planning.mjs" });
  },

  async lint() {
    const { lintOutwardArtifact, outwardFindingText } = await load(
      "scripts/lib/outward-lint.mjs",
    );
    const vocabulary = JSON.parse(
      readFileSync(join(repo, "docs/control/outward-vocabulary.json"), "utf8"),
    );
    for (const [kind, text, label] of [
      ["commit", `fix: ${"x".repeat(67)}`, "72"],
      ["commit", `fix: ${"x".repeat(68)}`, "73"],
      ["commit", `fix: ${"x".repeat(85)}\n\nbody`, "90 LF"],
      ["commit", `fix: ${"x".repeat(85)}\r\rbody`, "90 CR"],
      ["commit", `👨‍👩‍👧 fix: ${"x".repeat(80)}`, "ZWJ gitmoji"],
      ["commit", `:bug: fix: ${"x".repeat(80)}`, "shortcode gitmoji"],
      ["commit", "x".repeat(90), "90 nonconventional"],
      ["pr-title", `fix: ${"x".repeat(85)}`, "pr-title 90"],
    ]) {
      const result = lintOutwardArtifact({
        kind,
        text,
        vocabulary,
        localTerms: { status: "present" },
      });
      print({
        label,
        codePoints: [...text.split(/\r\n|\n|\r/u)[0]].length,
        texts: result.findings
          .filter((finding) => /^(?:subject|commit|text)\./u.test(finding.rule))
          .map((finding) => outwardFindingText(finding, text)),
      });
    }
  },

  async signoff() {
    const { contributionSignoffRules } = await load(
      "scripts/lib/contributions.mjs",
    );
    const root = mkdtempSync(join(tmpdir(), "signoff-probe-"));
    const run = (...words) => git(root, ...words);
    const as = (name, email) => [
      "-c",
      `user.name=${name}`,
      "-c",
      `user.email=${email}`,
    ];
    try {
      run("init", "-q", "-b", "main");
      for (const declared of [true, false]) {
        const arm = declared ? "declared" : "undeclared";
        writeFileSync(
          join(root, "dotln.config.json"),
          JSON.stringify(
            declared
              ? {
                  version: 1,
                  contributions: {
                    operatorAuthor:
                      "Fixture Operator <operator@example.invalid>",
                  },
                }
              : { version: 1 },
          ),
        );
        run("add", "-A");
        run(
          ...as("Fixture Operator", "operator@example.invalid"),
          "commit",
          "-qm",
          `base ${arm}`,
        );
        run("update-ref", "refs/remotes/origin/main", "HEAD");
        writeFileSync(join(root, `outside-${arm}.txt`), "outside\n");
        run("add", "-A");
        run(
          ...as("Outside Author", "outside@example.invalid"),
          "commit",
          "-qm",
          `outside ${arm}`,
        );
        for (const row of contributionSignoffRules(root))
          print({
            arm,
            pass: row.pass,
            line: row.line.replace(/[0-9a-f]{12}/u, "<commit>"),
          });
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
};

function prettier(root, files) {
  const result = spawnSync(
    process.execPath,
    [join(repo, "node_modules/prettier/bin/prettier.cjs"), "--write", ...files],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
}

if (!probes[probe])
  throw new Error(
    `unknown probe; use one of ${Object.keys(probes).join(", ")}`,
  );
await probes[probe]();
