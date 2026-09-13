#!/usr/bin/env node
import {
  chmodSync,
  closeSync,
  constants,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { execFileSync, spawn } from "node:child_process";
import { startDeadline } from "../../packages/skeleton/src/gate-deadlines.mjs";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import { applySite, enumerate, selectCampaign, sha256 } from "./enumerate.mjs";

const PACKAGES = ["kernel", "compiler", "skeleton"];
const owned = new WeakMap();
const jsonLine = (value) => JSON.stringify(value) + "\n";
const read = (path) => readFileSync(path, "utf8");
const fail = (message) => {
  throw new Error(message);
};

export function createScratch() {
  const parent = realpathSync(tmpdir());
  const path = realpathSync(mkdtempSync(join(parent, "dotln-mutation-")));
  const marker = randomUUID(),
    identity = lstatSync(path);
  writeFileSync(join(path, ".owner"), marker, { flag: "wx", mode: 0o600 });
  const handle = Object.freeze({ path });
  owned.set(handle, { parent, marker, dev: identity.dev, ino: identity.ino });
  return handle;
}

export function validateScratch(handle) {
  const proof = owned.get(handle);
  if (!proof) fail("scratch has no creation provenance");
  const info = lstatSync(handle.path);
  if (
    info.isSymbolicLink() ||
    !info.isDirectory() ||
    realpathSync(handle.path) !== handle.path ||
    dirname(handle.path) !== proof.parent ||
    !basename(handle.path).startsWith("dotln-mutation-") ||
    info.dev !== proof.dev ||
    info.ino !== proof.ino ||
    lstatSync(join(handle.path, ".owner")).isSymbolicLink() ||
    read(join(handle.path, ".owner")) !== proof.marker
  )
    fail("scratch provenance changed; cleanup refused");
  return handle.path;
}

export function cleanupScratch(handle) {
  const root = validateScratch(handle);
  // A timed-out test may leave a mode-000 fixture. Walk only our owned root,
  // never follow symlinks (including dependency and Git-object links).
  const unlock = (path) => {
    const info = lstatSync(path);
    if (info.isDirectory() && !info.isSymbolicLink()) {
      chmodSync(path, 0o700);
      for (const child of readdirSync(path)) unlock(join(path, child));
    }
  };
  unlock(root);
  validateScratch(handle);
  rmSync(root, { recursive: true });
  owned.delete(handle);
}

export function cleanEnvironment(directory) {
  const env = { ...process.env };
  for (const key of Object.keys(env))
    if (/^(?:GIT_|DOTLN_|NODE_TEST_|NODE_OPTIONS$|NODE_PATH$)/u.test(key))
      delete env[key];
  return {
    ...env,
    TMPDIR: directory,
    TMP: directory,
    TEMP: directory,
    NO_COLOR: "1",
  };
}

// Detached process groups keep compiler/test descendants inside the timeout.
// No shell expansion, installation, model invocation or network command.
export function runProcess(
  command,
  args,
  { cwd, timeoutMs, env = process.env },
) {
  if (!(timeoutMs > 0)) fail("positive process timeout required");
  const observation = startDeadline("mutation:process", timeoutMs, { env });
  return new Promise((accept, reject) => {
    const started = performance.now();
    let output = "",
      timedOut = false,
      overflow = false;
    const child = spawn(command, args, {
      cwd,
      env,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const kill = () => {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch (error) {
        if (error.code !== "ESRCH") throw error;
      }
    };
    const capture = (data) => {
      output += data.toString();
      if (Buffer.byteLength(output) > 16 * 1024 * 1024) {
        overflow = true;
        kill();
      }
    };
    child.stdout.on("data", capture);
    child.stderr.on("data", capture);
    const timer = setTimeout(() => {
      observation.finish(true);
      timedOut = true;
      kill();
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code, signal) => {
      observation.finish();
      clearTimeout(timer);
      if (overflow) {
        reject(new Error("child output overflow; no verdict recorded"));
        return;
      }
      accept({
        code,
        signal,
        timedOut,
        output,
        durationMs: Math.round(performance.now() - started),
      });
    });
  });
}

const safePath = (path) => {
  if (
    isAbsolute(path) ||
    path.split("/").some((part) => !part || part === "." || part === "..") ||
    path.includes("\\")
  )
    fail("non-contained snapshot path");
  return path;
};

export function loadSnapshot(root, commit) {
  root = realpathSync(root);
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      env: cleanEnvironment(tmpdir()),
      maxBuffer: 128 * 1024 * 1024,
    });
  if (
    realpathSync(git("rev-parse", "--show-toplevel").toString().trim()) !== root
  )
    fail("run from the Git worktree root");
  if (!/^[a-f0-9]{7,40}$/u.test(commit))
    fail("--commit requires a hexadecimal commit id");
  const baseCommit = git("rev-parse", "--verify", `${commit}^{commit}`)
    .toString()
    .trim();
  const entries = git("ls-tree", "-rz", baseCommit)
    .toString()
    .split("\0")
    .filter(Boolean)
    .map((entry) => {
      const [header, path] = entry.split("\t"),
        [mode, type, oid] = header.split(" ");
      safePath(path);
      if (type !== "blob" || !["100644", "100755", "120000"].includes(mode))
        fail("unsupported snapshot entry");
      return { path, mode, oid };
    });
  const data = execFileSync("git", ["cat-file", "--batch"], {
    cwd: root,
    env: cleanEnvironment(tmpdir()),
    input: entries.map((entry) => entry.oid).join("\n") + "\n",
    maxBuffer: 128 * 1024 * 1024,
  });
  let offset = 0;
  const files = entries.map((entry) => {
    const end = data.indexOf(10, offset);
    const [oid, type, size] = data.subarray(offset, end).toString().split(" ");
    if (oid !== entry.oid || type !== "blob" || !/^\d+$/u.test(size))
      fail("invalid snapshot blob response");
    offset = end + 1;
    const contents = data.subarray(offset, offset + Number(size));
    offset += Number(size) + 1;
    return { ...entry, contents };
  });
  if (offset !== data.length) fail("snapshot byte count mismatch");
  const sources = new Map(
    files
      .filter((file) =>
        /^packages\/(kernel|compiler|skeleton)\/src\/.*\.(ts|mjs)$/u.test(
          file.path,
        ),
      )
      .map((file) => [file.path, file.contents.toString()]),
  );
  const objects = realpathSync(
    resolve(root, git("rev-parse", "--git-path", "objects").toString().trim()),
  );
  return {
    baseCommit,
    files,
    sources,
    objects,
    contextHash: sha256(
      files.map((file) => `${file.mode} ${file.oid} ${file.path}\n`).join(""),
    ),
  };
}

export function linkDependencies(root, dependencies) {
  const source = realpathSync(dependencies);
  mkdirSync(join(root, "node_modules"));
  for (const name of readdirSync(source).sort()) {
    if (name === "@dotln" || name === ".bin" || name.startsWith(".")) continue;
    symlinkSync(join(source, name), join(root, "node_modules", name), "dir");
  }
  mkdirSync(join(root, "node_modules/@dotln"));
  for (const name of PACKAGES) {
    const workspace = join(root, "packages", name);
    symlinkSync(workspace, join(root, "node_modules/@dotln", name), "dir");
    if (
      realpathSync(join(root, "node_modules/@dotln", name)) !==
      realpathSync(workspace)
    )
      fail("workspace link escaped scratch");
  }
}

export function populateScratch(handle, snapshot, dependencies, site) {
  const scratch = validateScratch(handle),
    root = join(scratch, "tree");
  mkdirSync(root);
  for (const file of snapshot.files) {
    const path = join(root, safePath(file.path));
    mkdirSync(dirname(path), { recursive: true });
    if (file.mode === "120000") {
      const target = file.contents.toString();
      if (
        isAbsolute(target) ||
        relative(root, resolve(dirname(path), target)).startsWith("..")
      )
        fail("snapshot symlink escapes scratch");
      symlinkSync(target, path);
    } else
      writeFileSync(path, file.contents, {
        flag: "wx",
        mode: file.mode === "100755" ? 0o755 : 0o644,
      });
  }
  linkDependencies(root, dependencies);
  // Some shipped tests read committed baselines via Git. This is a private
  // fixture Git directory, with read-only object lookup and no remote/config
  // inherited from the operator's checkout. Refs/writes remain in scratch.
  if (snapshot.objects) {
    execFileSync(
      "git",
      ["-c", "init.defaultBranch=mutation-fixture", "init", "--quiet", root],
      { env: cleanEnvironment(scratch) },
    );
    writeFileSync(
      join(root, ".git/objects/info/alternates"),
      snapshot.objects + "\n",
    );
    writeFileSync(join(root, ".git/HEAD"), snapshot.baseCommit + "\n");
  }
  if (site)
    writeFileSync(
      join(root, site.file),
      applySite(snapshot.sources.get(site.file), site),
    );
  return root;
}

export function parseTap(output, scratch = "") {
  const sanitized = scratch ? output.split(scratch).join("<scratch>") : output;
  const count = (label) => {
    const matches = [
      ...sanitized.matchAll(new RegExp(`^# ${label} (\\d+)$`, "gm")),
    ];
    return matches.length ? Number(matches.at(-1)[1]) : null;
  };
  const killingTests = [...sanitized.matchAll(/^\s*not ok \d+ - (.+)$/gmu)].map(
    (match) => match[1],
  );
  return {
    tests: count("tests"),
    passed: count("pass"),
    failed: count("fail"),
    cancelled: count("cancelled"),
    skipped: count("skipped"),
    killingTests: [...new Set(killingTests)],
  };
}

export async function evaluate(snapshot, dependencies, site, timeoutMs) {
  const started = performance.now(),
    handle = createScratch();
  try {
    const root = populateScratch(handle, snapshot, dependencies, site);
    const temporary = join(handle.path, "temporary");
    mkdirSync(temporary);
    const env = cleanEnvironment(temporary);
    const remaining = () =>
      Math.max(1, timeoutMs - (performance.now() - started));
    const compile = await runProcess(
      process.execPath,
      [join(root, "node_modules/typescript/bin/tsc"), "-b", "--force"],
      { cwd: root, env, timeoutMs: remaining() },
    );
    const finish = (value) => ({
      ...value,
      durationMs: Math.round(performance.now() - started),
    });
    if (compile.timedOut)
      return finish({
        verdict: "timeout",
        phase: "compile",
        compiled: false,
        killingTests: [],
        tests: null,
      });
    if (compile.code !== 0) {
      const diagnostics = [
        ...new Set(compile.output.match(/error TS\d+/gu) ?? []),
      ];
      if (!diagnostics.length)
        fail("compiler failed without TypeScript diagnostics; no verdict");
      return finish({
        verdict: "killed-by-compile",
        phase: "compile",
        compiled: false,
        diagnostics,
        killingTests: [],
        tests: null,
      });
    }
    const tests = PACKAGES.flatMap((name) => {
      const directory = join(root, "packages", name, "dist/test");
      const files = existsSync(directory)
        ? readdirSync(directory)
            .filter((file) => file.endsWith(".test.js"))
            .sort()
        : [];
      if (!files.length) fail(`empty ${name} suite after fresh compilation`);
      return files.map((file) => join(directory, file));
    });
    const result = await runProcess(
      process.execPath,
      ["--test", "--test-reporter=tap", ...tests],
      { cwd: root, env, timeoutMs: remaining() },
    );
    const tap = parseTap(result.output, handle.path);
    if (result.timedOut)
      return finish({
        verdict: "timeout",
        phase: "test",
        compiled: true,
        ...tap,
      });
    if (!tap.tests || tap.passed === null || tap.failed === null)
      fail("test runner did not report a nonempty TAP suite; no verdict");
    if (
      result.code === 0 &&
      tap.failed === 0 &&
      tap.cancelled === 0 &&
      tap.passed > 0
    )
      return finish({
        verdict: "survived",
        phase: "test",
        compiled: true,
        ...tap,
      });
    if (result.code !== 0 && tap.killingTests.length)
      return finish({
        verdict: "killed-by-test",
        phase: "test",
        compiled: true,
        ...tap,
      });
    fail("test process failed without a named killing test; no verdict");
  } finally {
    cleanupScratch(handle);
  }
}

export async function requireGreenBaseline(evaluateBaseline) {
  const baseline = await evaluateBaseline();
  if (
    baseline.verdict !== "survived" ||
    !baseline.compiled ||
    !(baseline.passed > 0)
  )
    fail(`unmutated baseline is not green: ${JSON.stringify(baseline)}`);
  return baseline;
}

export function validateRows(text, sites, policyHash, baseCommit) {
  if (text && !text.endsWith("\n"))
    fail(
      "matrix has a partial tail; preserve it and investigate before resuming",
    );
  return text
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      const row = JSON.parse(line),
        site = sites[index];
      if (
        !site ||
        row.id !== site.id ||
        row.baseCommit !== baseCommit ||
        row.policyHash !== policyHash ||
        row.siteHash !== sha256(JSON.stringify(site)) ||
        row.file !== site.file ||
        row.line !== site.line ||
        row.operator !== site.operator ||
        ![
          "killed-by-compile",
          "killed-by-test",
          "survived",
          "timeout",
        ].includes(row.verdict) ||
        !Number.isFinite(row.durationMs) ||
        row.durationMs < 0 ||
        !Array.isArray(row.killingTests) ||
        !row.killingTests.every(
          (name) =>
            typeof name === "string" &&
            name.length > 0 &&
            !/[\r\n]/u.test(name),
        ) ||
        row.killingTest !== (row.killingTests[0] ?? null) ||
        (row.verdict !== "survived" && row.finding !== null) ||
        (row.verdict === "killed-by-test" &&
          (!row.compiled || !row.killingTests.length)) ||
        (row.verdict === "survived" &&
          (!row.compiled ||
            row.finding !== `F-${site.id.slice(1)}` ||
            !(row.passed > 0) ||
            row.failed !== 0 ||
            row.cancelled !== 0 ||
            row.killingTests.length ||
            !(row.tests >= row.passed))) ||
        (row.verdict === "killed-by-compile" &&
          (row.compiled || !row.diagnostics?.length))
      )
        fail(`matrix row ${index + 1} is inconsistent; no append`);
      return row;
    });
}

export function summarize(rows, total) {
  const counts = Object.fromEntries(
    ["killed-by-compile", "killed-by-test", "survived", "timeout"].map(
      (verdict) => [
        verdict,
        rows.filter((row) => row.verdict === verdict).length,
      ],
    ),
  );
  const denominator = counts["killed-by-test"] + counts.survived;
  return {
    enumerated: total,
    executed: rows.length,
    remaining: total - rows.length,
    counts,
    compiledConclusive: denominator,
    compiledKillRate: denominator
      ? counts["killed-by-test"] / denominator
      : null,
    compileNoiseRate: rows.length
      ? counts["killed-by-compile"] / rows.length
      : null,
    compiledTimeoutsExcluded: rows.filter(
      (row) => row.verdict === "timeout" && row.compiled,
    ).length,
    nextMutant:
      rows.length < total
        ? `M${String(rows.length + 1).padStart(5, "0")}`
        : null,
  };
}

const append = (path, text) => {
  const fd = openSync(
    path,
    constants.O_WRONLY |
      constants.O_APPEND |
      constants.O_CREAT |
      constants.O_NOFOLLOW,
    0o644,
  );
  try {
    writeFileSync(fd, text);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
};
const stableFile = (path, contents) => {
  if (existsSync(path)) {
    if (lstatSync(path).isSymbolicLink() || read(path) !== contents)
      fail(`pinned artifact differs: ${basename(path)}`);
  } else writeFileSync(path, contents, { flag: "wx" });
};

export function exactPatch(source, site) {
  const start = source.lastIndexOf("\n", site.start - 1) + 1;
  const newline = source.indexOf("\n", site.end);
  const end = newline < 0 ? source.length : newline + 1;
  const before = source.slice(start, end).replace(/\n$/u, "").split("\n");
  const after = (
    source.slice(start, site.start) +
    site.after +
    source.slice(site.end, end)
  )
    .replace(/\n$/u, "")
    .split("\n");
  return [
    `--- a/${site.file}`,
    `+++ b/${site.file}`,
    `@@ -${site.line},${before.length} +${site.line},${after.length} @@`,
    ...before.map((line) => "-" + line),
    ...after.map((line) => "+" + line),
  ].join("\n");
}

export function findingsText(rows, sites, snapshot) {
  const stats = summarize(rows, sites.length);
  const lines = [
    "# WO-108 mutation findings",
    "",
    `Base: \`${snapshot.baseCommit}\`. Generated from the append-only matrix; rerun \`--report\` to regenerate.`,
    "",
    `Executed ${stats.executed}/${stats.enumerated}; next: ${stats.nextMutant ?? "none"}. Compiled conclusive: ${stats.compiledConclusive}; killed by test: ${stats.counts["killed-by-test"]}; survived: ${stats.counts.survived}. Compile kills: ${stats.counts["killed-by-compile"]} (enumeration noise); timeouts: ${stats.counts.timeout} (excluded from the conclusive denominator).`,
    "",
    "These are detection-gap candidates in the enumerated sites. A survivor may be equivalent or outside exercised inputs; no capability-strength or production-defect claim follows without triage. Historical seeds are expectations to remeasure, not predetermined verdicts.",
    "",
  ];
  for (const name of PACKAGES) {
    const group = rows.filter((row) =>
      row.file.startsWith(`packages/${name}/`),
    );
    const summary = summarize(
      group,
      sites.filter((site) => site.file.startsWith(`packages/${name}/`)).length,
    );
    lines.push(
      `- ${name}: ${summary.executed}/${summary.enumerated} selected; ${summary.counts["killed-by-test"]} test kills, ${summary.counts.survived} survivors (${summary.compiledConclusive} conclusive compiled), ${summary.counts["killed-by-compile"]} compile kills, ${summary.counts.timeout} timeouts.`,
    );
  }
  lines.push("");
  lines.push("Selected operator observations (no ranking):", "");
  for (const operator of [
    ...new Set(sites.map((site) => site.operator)),
  ].sort()) {
    const group = rows.filter((row) => row.operator === operator);
    const summary = summarize(
      group,
      sites.filter((site) => site.operator === operator).length,
    );
    lines.push(
      `- ${operator}: ${summary.executed}/${summary.enumerated} selected; ${summary.counts["killed-by-test"]} test kills, ${summary.counts.survived} survivors (${summary.compiledConclusive} conclusive compiled), ${summary.counts["killed-by-compile"]} compile kills, ${summary.counts.timeout} timeouts.`,
    );
  }
  lines.push("");
  for (const row of rows.filter((entry) => entry.verdict === "survived")) {
    const site = sites.find((entry) => entry.id === row.id);
    lines.push(
      `## ${row.finding} — ${site.operator}`,
      "",
      `Site: [${site.file}:${site.line}](../../${site.file}#L${site.line}). Mutant \`${site.id}\`${site.seed ? `; historical seed ${site.seed}` : ""}. ${row.passed}/${row.tests} tests passed.`,
      "",
      `Claim to investigate: ${site.claim}`,
      "",
      "```diff",
      exactPatch(snapshot.sources.get(site.file), site),
      "```",
      "",
      "Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):",
      "",
      "```sh",
      `node corpus/mutation/mutate.mjs --commit ${snapshot.baseCommit} --reproduce ${site.id}`,
      "```",
      "",
    );
  }
  return lines.join("\n");
}

export async function runMatrix({
  snapshot,
  sites,
  policy,
  matrixPath,
  log,
  evaluateMutant,
  maxMutants = Infinity,
  now = () => performance.now(),
  shouldStop = () => false,
}) {
  const policyHash = sha256(JSON.stringify(policy));
  const original = existsSync(matrixPath) ? read(matrixPath) : "";
  const rows = validateRows(original, sites, policyHash, snapshot.baseCommit);
  // Recheck every session, even when a prefix already exists.
  const baseline = await requireGreenBaseline(() => evaluateMutant(null));
  log(`baseline ${JSON.stringify(baseline)}`);
  const started = now(),
    initial = rows.length;
  let bytes = Buffer.byteLength(original),
    stop = "complete";
  for (let i = initial; i < sites.length; i++) {
    if (shouldStop()) {
      stop = "operator-interrupt";
      break;
    }
    if (rows.length - initial >= maxMutants) {
      stop = "declared-mutant-limit";
      break;
    }
    if (now() - started >= policy.runBudgetMs) {
      stop = "declared-session-time-budget";
      break;
    }
    const site = sites[i];
    let result = await evaluateMutant(site);
    if (result.verdict === "survived" && result.tests !== baseline.tests)
      result = {
        ...result,
        verdict: "killed-by-test",
        killingTests: [
          `runner suite-count assertion: expected ${baseline.tests}, observed ${result.tests}`,
        ],
      };
    const row = {
      baseCommit: snapshot.baseCommit,
      policyHash,
      siteHash: sha256(JSON.stringify(site)),
      id: site.id,
      file: site.file,
      line: site.line,
      operator: site.operator,
      ...result,
      killingTest: result.killingTests[0] ?? null,
      finding: result.verdict === "survived" ? `F-${site.id.slice(1)}` : null,
    };
    validateRows(jsonLine(row), [site], policyHash, snapshot.baseCommit);
    // Single-writer command. Refuse an observed concurrent change; never
    // rewrite, truncate, repair or duplicate existing matrix evidence.
    if ((existsSync(matrixPath) ? statSync(matrixPath).size : 0) !== bytes)
      fail("matrix changed during this run; no append");
    const line = jsonLine(row);
    append(matrixPath, line);
    bytes += Buffer.byteLength(line);
    rows.push(row);
    log(
      `${site.id} ${row.verdict} ${row.durationMs}ms${row.killingTest ? ` ${row.killingTest}` : ""}`,
    );
  }
  if (rows.length > initial)
    log(
      `baseline-after ${JSON.stringify(await requireGreenBaseline(() => evaluateMutant(null)))}`,
    );
  log(`stop ${stop} ${JSON.stringify(summarize(rows, sites.length))}`);
  return rows;
}

async function main(args) {
  const value = (name) => {
    const at = args.indexOf(name);
    if (at < 0) return undefined;
    if (!args[at + 1] || args[at + 1].startsWith("--"))
      fail(`missing ${name} value`);
    return args[at + 1];
  };
  const known = new Set([
    "--commit",
    "--enumerate",
    "--run-all",
    "--report",
    "--check",
    "--reproduce",
    "--reproduce-survivors",
  ]);
  for (let i = 0; i < args.length; i++) {
    if (!known.has(args[i])) fail(`unknown argument ${args[i]}`);
    if (["--commit", "--reproduce"].includes(args[i])) i++;
  }
  const commit = value("--commit");
  const modes = [
    "--enumerate",
    "--run-all",
    "--report",
    "--check",
    "--reproduce",
    "--reproduce-survivors",
  ].filter((mode) => args.includes(mode));
  if (!commit || modes.length !== 1)
    fail(
      "usage: node corpus/mutation/mutate.mjs --commit <base> <--enumerate|--run-all|--report|--check|--reproduce M00001|--reproduce-survivors>",
    );
  const root = realpathSync(process.cwd()),
    snapshot = loadSnapshot(root, commit);
  const candidates = enumerate(snapshot.sources);
  const sites = selectCampaign(candidates);
  const destination = join(root, "corpus/mutation");
  const dependencies = join(root, "node_modules");
  const policy = {
    schemaVersion: 1,
    baseCommit: snapshot.baseCommit,
    contextHash: snapshot.contextHash,
    siteCount: sites.length,
    instrumentHash: sha256(
      read(fileURLToPath(import.meta.url)) +
        read(new URL("./enumerate.mjs", import.meta.url)),
    ),
    candidateCount: candidates.length,
    timeoutMs: 120000,
    runBudgetMs: 2700000,
    node: process.version,
    typescript: JSON.parse(read(join(dependencies, "typescript/package.json")))
      .version,
    compilerHash: sha256(
      readFileSync(join(dependencies, "typescript/lib/tsc.js")),
    ),
    packages: PACKAGES,
    enumeration:
      "conservative-lexical-v1; full candidate census; templates and regexes opaque",
    selection:
      "campaign-v1: 8 historical compiler seeds, 6 kernel, 6 current compiler, 12 current skeleton; declared files, preferred operators, median eligible site; no verdict-dependent selection",
    snapshot:
      "all tracked base files; fresh dist; isolated Git refs; read-only base object lookup; local workspace links",
    build: "node node_modules/typescript/bin/tsc -b --force",
    tests:
      "node --test --test-reporter=tap <sorted nonempty kernel+compiler+skeleton test files>",
    score:
      "killed-by-test / (killed-by-test + survived); compile noise and timeouts separate",
  };
  const policyText =
    JSON.stringify(policy, null, 2).replace(
      /"packages": \[[\s\S]*?\]/u,
      `"packages": ${JSON.stringify(PACKAGES).replaceAll(",", ", ")}`,
    ) + "\n";
  const siteText = sites.map(jsonLine).join("");
  const matrixPath = join(
    destination,
    `kill-matrix-${snapshot.baseCommit}.jsonl`,
  );
  const policyHash = sha256(JSON.stringify(policy));
  const mode = modes[0];
  if (mode === "--enumerate" || mode === "--run-all") {
    // Enumeration drafts may be regenerated until the first measured run.
    // Thereafter all policy/site changes refuse; evidence is never retargeted.
    if (
      mode === "--enumerate" &&
      !existsSync(matrixPath) &&
      !existsSync(
        join(
          root,
          "corpus/manifests/runs",
          `WO-108-${snapshot.baseCommit}.log`,
        ),
      )
    ) {
      writeFileSync(
        join(destination, `policy-${snapshot.baseCommit}.json`),
        policyText,
      );
      writeFileSync(
        join(destination, `sites-${snapshot.baseCommit}.jsonl`),
        siteText,
      );
      writeFileSync(
        join(destination, `candidates-${snapshot.baseCommit}.jsonl`),
        candidates.map(jsonLine).join(""),
      );
    }
    stableFile(
      join(destination, `candidates-${snapshot.baseCommit}.jsonl`),
      candidates.map(jsonLine).join(""),
    );
    stableFile(
      join(destination, `policy-${snapshot.baseCommit}.json`),
      policyText,
    );
    stableFile(
      join(destination, `sites-${snapshot.baseCommit}.jsonl`),
      siteText,
    );
  } else {
    if (
      read(join(destination, `policy-${snapshot.baseCommit}.json`)) !==
        policyText ||
      read(join(destination, `sites-${snapshot.baseCommit}.jsonl`)) !==
        siteText ||
      read(join(destination, `candidates-${snapshot.baseCommit}.jsonl`)) !==
        candidates.map(jsonLine).join("")
    )
      fail(
        "manifest or toolchain drift; reproduce with the pinned environment",
      );
  }
  if (mode === "--enumerate") {
    console.log(
      `Deterministic manifest: ${sites.length} selected / ${candidates.length} candidates; sha256 ${sha256(siteText)}`,
    );
    return;
  }
  const execute = (site) =>
    evaluate(snapshot, dependencies, site, policy.timeoutMs);
  if (mode === "--reproduce" || mode === "--reproduce-survivors") {
    const ids =
      mode === "--reproduce"
        ? [value("--reproduce")]
        : validateRows(read(matrixPath), sites, policyHash, snapshot.baseCommit)
            .filter((row) => row.verdict === "survived")
            .map((row) => row.id);
    const selected = ids.map((id) => sites.find((site) => site.id === id));
    if (selected.some((site) => !site)) fail("unknown mutant id");
    console.log(
      `baseline ${JSON.stringify(await requireGreenBaseline(() => execute(null)))}`,
    );
    for (const site of selected) {
      const result = await execute(site);
      console.log(JSON.stringify({ id: site.id, ...result }));
      if (mode === "--reproduce-survivors" && result.verdict !== "survived")
        fail(`survivor ${site.id} did not reproduce`);
    }
    return;
  }
  let rows;
  if (mode === "--run-all") {
    const transcript = join(
      root,
      "corpus/manifests/runs",
      `WO-108-${snapshot.baseCommit}.log`,
    );
    const log = (line) => {
      console.log(line);
      append(transcript, line + "\n");
    };
    log(
      `run ${JSON.stringify({ baseCommit: snapshot.baseCommit, policyHash, sites: sites.length, timeoutMs: policy.timeoutMs, runBudgetMs: policy.runBudgetMs })}`,
    );
    let interrupted = false;
    const stop = () => {
      interrupted = true;
    };
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
    try {
      rows = await runMatrix({
        snapshot,
        sites,
        policy,
        matrixPath,
        log,
        evaluateMutant: execute,
        shouldStop: () => interrupted,
      });
    } catch (error) {
      log(`refused ${error.message}`);
      const prefix = validateRows(
        existsSync(matrixPath) ? read(matrixPath) : "",
        sites,
        policyHash,
        snapshot.baseCommit,
      );
      writeFileSync(
        join(destination, "findings-WO-108.md"),
        findingsText(prefix, sites, snapshot),
      );
      throw error;
    } finally {
      process.off("SIGINT", stop);
      process.off("SIGTERM", stop);
    }
  } else
    rows = validateRows(
      existsSync(matrixPath) ? read(matrixPath) : "",
      sites,
      policyHash,
      snapshot.baseCommit,
    );
  if (mode === "--check") {
    if (rows.length !== sites.length)
      fail(`campaign incomplete: ${rows.length}/${sites.length}`);
    if (
      read(join(destination, "findings-WO-108.md")) !==
      findingsText(rows, sites, snapshot)
    )
      fail("findings projection is stale");
    const transcript = read(
      join(root, "corpus/manifests/runs", `WO-108-${snapshot.baseCommit}.log`),
    )
      .trimEnd()
      .split("\n");
    const final = transcript.at(-1);
    if (
      final !== `stop complete ${JSON.stringify(summarize(rows, sites.length))}`
    )
      fail("transcript does not corroborate complete matrix totals");
    console.log(
      `Verified deterministic census, pinned campaign, ${rows.length} matrix rows, survivor findings and transcript totals.`,
    );
    return;
  }
  writeFileSync(
    join(destination, "findings-WO-108.md"),
    findingsText(rows, sites, snapshot),
  );
  console.log(JSON.stringify(summarize(rows, sites.length)));
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main(process.argv.slice(2)).catch((error) => {
    console.error(`mutation probe refused: ${error.message}`);
    process.exitCode = 1;
  });
