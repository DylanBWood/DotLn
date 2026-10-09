import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { runGit, spawnGit } from "./lib/git.mjs";
import {
  ensureDirectory,
  json,
  locked,
  parseWithLabel,
  sha256Hex,
  write,
} from "./lib/helpers.mjs";
import { parseJson, readJsonFile } from "./lib/paths.mjs";

// Published activation source, before any WO-162 adoption. Read the actual old
// helpers rather than maintaining a second hand-written implementation oracle.
const baseline = "6f9494649db9a4984911801ae320788264d84ff9";
const root = resolve(import.meta.dirname, "..");
const before = (path) =>
  runGit(root, ["show", `${baseline}:${path}`], { trim: false });
const temporary = (t) => {
  const path = mkdtempSync(join(tmpdir(), "dotln-helper-reuse-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
};
const evaluate = (expression, bindings) =>
  Function(
    ...Object.keys(bindings),
    `return (${expression});`,
  )(...Object.values(bindings));
const tree = (directory) =>
  readdirSync(directory, { recursive: true })
    .filter((path) => lstatSync(join(directory, path)).isFile())
    .sort()
    .map((path) => [
      path,
      lstatSync(join(directory, path)).mode & 0o777,
      sha256Hex(readFileSync(join(directory, path))),
    ]);

test("WO-162 every former fixture writer produces identical trees and recorded digests", (t) => {
  const scratch = temporary(t);
  const paths = runGit(root, ["ls-tree", "-r", "--name-only", baseline])
    .split("\n")
    .filter((path) => /^(?:scripts|packages\/[^/]+)\/fixtures\//u.test(path));
  const inputs = paths.map((path) => [
    path,
    runGit(root, ["show", `${baseline}:${path}`], {
      trim: false,
      encoding: null,
    }),
  ]);
  inputs.push(["binary.dat", Buffer.from([0, 255, 13, 10, 128])]);
  inputs.push(["unicode.txt", Buffer.from("é 日本語\r\n\u0085\u2028\n")]);
  const scripts = runGit(root, [
    "ls-tree",
    "-r",
    "--name-only",
    baseline,
    "scripts",
  ])
    .split("\n")
    .filter((path) => /^scripts\/(?:lib\/)?[^/]+\.mjs$/u.test(path));
  let writers = 0;
  for (const path of scripts) {
    const source = before(path);
    const declarations = source.matchAll(
      /(?:const )?(?:write|put) = (\(([^\n]+)\) => \{\n\s*mkdirSync\(dirname\(([^\n]+)\), \{ recursive: true \}\);\n\s*writeFileSync\(\3, ([^\n]+)\);\n\s*\})/gu,
    );
    for (const match of declarations) {
      const legacyRoot = join(scratch, `before-${writers}`);
      const currentRoot = join(scratch, `after-${writers}`);
      const params = match[2].split(", ");
      const mode = match[4].includes("mode: 0o600") ? 0o600 : undefined;
      const structured = match[4].includes("JSON.stringify");
      const legacy = evaluate(match[1], {
        mkdirSync,
        dirname,
        join,
        writeFileSync,
        root: legacyRoot,
        scratch: legacyRoot,
        directory: legacyRoot,
        repo: legacyRoot,
      });
      for (const [relative, bytes] of inputs) {
        const contents = structured ? { relative, bytes: [...bytes] } : bytes;
        const target = `nested/${relative}`;
        if (params.length === 3) legacy(legacyRoot, target, contents);
        else
          legacy(
            match[3].startsWith("join(") ? target : join(legacyRoot, target),
            contents,
          );
        write(
          currentRoot,
          target,
          structured ? JSON.stringify(contents) + "\n" : contents,
          { mode },
        );
      }
      assert.deepEqual(
        tree(currentRoot),
        tree(legacyRoot),
        `${path}: fixture bytes, modes and digests`,
      );
      writers++;
    }
  }
  assert.equal(
    writers,
    31,
    "the complete pinned activation writer inventory must be exercised",
  );
  t.diagnostic(
    `${writers} legacy writers × ${inputs.length} inputs: generated trees, modes and digests identical`,
  );
});

test("WO-162 serializers and digest names preserve stored bytes", (t) => {
  const samples = [
    null,
    false,
    0,
    "é\r\n日本語",
    { z: [null, 1], a: { b: true } },
    undefined,
  ];
  const sources = [
    "scripts/test-harness.mjs",
    "scripts/feedback-evidence.mjs",
    "scripts/verification-evidence.mjs",
    "scripts/lib/copilot-probe.mjs",
  ];
  for (const path of sources) {
    const expression = before(path).match(/const json = ([^;]+);/u)?.[1];
    assert.ok(expression, path);
    const legacy = evaluate(expression, {});
    for (const value of samples) assert.equal(json(value), legacy(value), path);
  }
  for (const path of [
    "scripts/docs-check.mjs",
    "scripts/release.mjs",
    "scripts/resident-bind.mjs",
    "scripts/lib/intake-reconciliation.mjs",
    "scripts/lib/harness-prune.mjs",
    "scripts/lib/off-ramps.mjs",
    "scripts/test-codex-continuation.mjs",
    "scripts/test-target-harness.mjs",
  ]) {
    const expression = before(path).match(
      /const (?:hash|sha256|digest) = (\([^;]+?createHash\("sha256"\)[^;]+);/u,
    )?.[1];
    assert.ok(expression, path);
    const legacy = evaluate(expression, { createHash });
    for (const bytes of [
      Buffer.alloc(0),
      Buffer.from([0, 255, 128]),
      Buffer.from("é\r\n日本語"),
    ])
      assert.equal(sha256Hex(bytes), legacy(bytes), path);
  }
  t.diagnostic(
    "4 legacy serializer families and 8 bare-hex digest definers agree on exact bytes",
  );
});

test("WO-162 Git adapters preserve raw results, trimming, bytes, flags and failure diagnostics", (t) => {
  const directory = temporary(t);
  runGit(directory, ["init", "-q"]);
  const expression = before("scripts/test-harness.mjs").match(
    /const git = ([\s\S]*?\.trim\(\));/u,
  )?.[1];
  const legacy = evaluate(expression, { execFileSync });
  const options = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  for (const args of [
    ["rev-parse", "--show-toplevel"],
    ["-c", "fixture.value=  é  ", "config", "fixture.value"],
  ])
    assert.equal(runGit(directory, args, options), legacy(directory, ...args));
  const errorOf = (run) => {
    try {
      run();
      assert.fail("failure expected");
    } catch (error) {
      return [
        error.message,
        error.status,
        error.signal,
        error.stdout,
        error.stderr,
      ];
    }
  };
  assert.deepEqual(
    errorOf(() => runGit(directory, ["show", "missing-revision"], options)),
    errorOf(() => legacy(directory, "show", "missing-revision")),
  );
  const rawOptions = { cwd: directory, encoding: "utf8" };
  const args = ["rev-parse", "--verify", "missing-revision"];
  const rawExpression = before("scripts/test-authority-probe.mjs").match(
    /const git = ([\s\S]*?\n  \));/u,
  )?.[1];
  const legacyRaw = evaluate(rawExpression, { spawnSync });
  const expected = legacyRaw(directory, args);
  const actual = runGit(directory, args, { raw: true, encoding: "utf8" });
  for (const field of ["status", "signal", "stdout", "stderr", "output"])
    assert.deepEqual(actual[field], expected[field], field);
  assert.deepEqual(spawnGit(args, rawOptions).output, expected.output);
  const bytes = Buffer.from([0, 255, 128, 13, 10]);
  const object = runGit(directory, ["hash-object", "-w", "--stdin"], {
    input: bytes,
  });
  assert.deepEqual(
    runGit(directory, ["cat-file", "blob", object], {
      trim: false,
      encoding: null,
    }),
    bytes,
  );
});

test("WO-162 JSON and receipt adapters retain exact refusals and release locks", async (t) => {
  const directory = temporary(t);
  const path = join(directory, "invalid.json");
  writeFileSync(path, "{ invalid");
  const message = (run) => {
    try {
      run();
    } catch (error) {
      return error.message;
    }
  };
  assert.equal(
    message(() => readJsonFile(path, { rawErrors: true })),
    message(() => JSON.parse(readFileSync(path, "utf8"))),
  );
  assert.equal(
    message(() => parseJson("{ invalid", path, { rawErrors: true })),
    message(() => JSON.parse("{ invalid")),
  );
  assert.equal(
    message(() => parseWithLabel("{ invalid", "fixture")),
    "invalid JSON: fixture",
  );
  assert.match(
    message(() => readJsonFile(path)),
    /^invalid JSON in /u,
  );
  for (const label of ["planning", "entropy"]) {
    const relative = `${label}/receipts`;
    const refusal = `${label} evidence directory must not be a symlink${label === "entropy" ? `: ${relative}` : ""}`;
    ensureDirectory(directory, relative, refusal);
    await assert.rejects(
      locked(directory, relative, label, refusal, async () => {
        throw new Error("fixture body failed");
      }),
      /fixture body failed/u,
    );
    assert.equal(existsSync(join(directory, relative, ".writer-lock")), false);
    mkdirSync(join(directory, relative, ".writer-lock"));
    await assert.rejects(
      locked(directory, relative, label, refusal, async () => {}),
      {
        message: `${label} evidence writer already active; inspect any interrupted writer before retrying`,
      },
    );
    const link = `${label}-link`;
    symlinkSync(join(directory, label), join(directory, link));
    assert.equal(
      message(() => ensureDirectory(directory, `${link}/receipts`, refusal)),
      refusal,
    );
  }
});

test("no script defines a bare-hex sha256 or spawns Git outside the library", () => {
  // A digest named sha256 is the prefixed `sha256:` export's name; a bare-hex
  // digest belongs to sha256Hex in helpers.mjs. Git spawns belong to git.mjs.
  const digestDefiner =
    /\b(?:const|let|var)\s+sha256\s*=|\bfunction\s+sha256\s*\(/u;
  const directGit =
    /\b(?:spawnSync|spawn|execFileSync|execFile|execSync|exec)\(\s*["'`]git(?:["'`]|\s)/u;
  // The samples are assembled so that this file's own text matches neither.
  const call = (name) => `${name}("git", ["status"])`;
  const definer = (keyword) => `${keyword} sha256`;
  assert.match(
    `${definer("const")} = (v) => createHash("sha256").update(v).digest("hex");`,
    digestDefiner,
  );
  assert.match(`${definer("function")}(v) { return v; }`, digestDefiner);
  assert.match(
    `children.${call("spawnSync").replace("(", "(\n  ")}`,
    directGit,
  );
  assert.match(call("execFileSync"), directGit);
  assert.doesNotMatch(
    `import { sha256Hex as sha256 } from "./lib/helpers.mjs";`,
    digestDefiner,
  );
  assert.doesNotMatch(`spawnGit(["status"])`, directGit);
  const allowed = {
    "scripts/lib/git.mjs": { git: "the library itself" },
    "scripts/lib/plan-subject.mjs": {
      sha256: "the prefixed sha256: export, built on sha256Hex",
    },
    "scripts/test-harness.mjs": {
      git: "an asynchronous pack-refs race fixture; the library has no async adapter",
    },
    "scripts/probes/gate-sandbox-race/loader.mjs": {
      git: "a quoted Git call inside source text the probe injects into another module",
    },
    "scripts/test-process-debt.mjs": {
      git: "fixture command strings that quote a Git push inside shell text, never a spawn",
    },
  };
  const findings = [];
  const scripts = [
    ...new Set(
      runGit(root, [
        "ls-files",
        "-z",
        "--cached",
        "--others",
        "--exclude-standard",
        "--",
        "scripts",
      ]).split("\0"),
    ),
  ].filter((path) => path.endsWith(".mjs"));
  assert.ok(scripts.length > 50, "the script tree was listed");
  for (const path of scripts) {
    const source = readFileSync(join(root, path), "utf8");
    if (digestDefiner.test(source) && !allowed[path]?.sha256)
      findings.push(
        `${path}: defines a bare-hex sha256; import sha256Hex from scripts/lib/helpers.mjs`,
      );
    if (directGit.test(source) && !allowed[path]?.git)
      findings.push(
        `${path}: spawns git directly; use spawnGit, execGit or runGit from scripts/lib/git.mjs`,
      );
  }
  assert.deepEqual(findings, []);
});
