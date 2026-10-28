// VER-001 probe for WO-236: drives the emitted hooks of a synthetic launchpad
// built from this checkout's current build, outside the repository.
// Usage: node docs/evidence/WO-236/verification-001-target-grant.mjs <repo> <out.json> [order]
// PROBE_SCRATCH selects the fixture parent (default: the system temp root).
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [repo, output, order = "WO-236"] = process.argv.slice(2);
const { emitHarness } = await import(
  pathToFileURL(join(repo, "scripts/lib/harness.mjs")).href
);
const { beginHarnessSession } = await import(
  pathToFileURL(join(repo, "packages/skeleton/dist/src/harness-host.js")).href
);

const parent = realpathSync(process.env.PROBE_SCRATCH ?? tmpdir());
const base = realpathSync(mkdtempSync(join(parent, "wo236-ver001-")));
const launchpad = join(base, "launchpad");
const target = join(base, "target");
const temporary = join(base, "temporary");
const elsewhere = join(base, "elsewhere");
const counter = join(base, "status-calls.log");
const statusFile = join(base, "status.json");
const registry = "docs/control/local/target-worktrees.json";
const entry = { workOrderId: "WO-999", target, launchpad };
const digest = (value) => createHash("sha256").update(value).digest("hex");
// Lifecycle calls made in this process (session setup) reach the same stub.
process.env.PROBE_COUNTER = counter;
process.env.PROBE_STATUS = statusFile;
const results = { subject: order, probes: {} };
const P = results.probes;
const put = (file, content) => {
  mkdirSync(join(launchpad, file, ".."), { recursive: true });
  writeFileSync(join(launchpad, file), content);
};
const status = (phase, extra = {}) =>
  writeFileSync(
    statusFile,
    JSON.stringify({
      workOrder: "WO-999",
      workOrderPath: "docs/work-orders/WO-999.md",
      phase,
      latestVerdict: null,
      ...extra,
    }),
  );
const statusCalls = () =>
  existsSync(counter)
    ? readFileSync(counter, "utf8").split("\n").filter(Boolean).length
    : 0;
const hidden = (value) =>
  value === undefined || value === null
    ? value
    : String(value).replaceAll(base, "<fixture>");
const hook = (name, session, tool, tool_input, extra = {}) => {
  const before = statusCalls();
  const started = process.hrtime.bigint();
  const result = spawnSync(
    process.execPath,
    [join(launchpad, `.claude/hooks/${name}.mjs`)],
    {
      cwd: launchpad,
      encoding: "utf8",
      timeout: 60_000,
      env: {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        TMPDIR: temporary,
        TMP: temporary,
        TEMP: temporary,
        CODEX_THREAD_ID: "",
        CLAUDE_PID: String(process.pid),
        PROBE_COUNTER: counter,
        PROBE_STATUS: statusFile,
        ...extra,
      },
      input: JSON.stringify({
        cwd: launchpad,
        session_id: session,
        hook_event_name: "PreToolUse",
        tool_name: tool,
        tool_input,
      }),
    },
  );
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  let response = {};
  try {
    response = result.stdout.trim() ? JSON.parse(result.stdout) : {};
  } catch {
    response = { unparsed: result.stdout.slice(0, 400) };
  }
  return {
    exitCode: result.status,
    admitted:
      response.hookSpecificOutput?.permissionDecision !== "deny" &&
      response.decision !== "block",
    reason: hidden(
      response.hookSpecificOutput?.permissionDecisionReason ?? response.reason,
    ),
    statusSpawns: statusCalls() - before,
    ms: Math.round(ms),
  };
};
const write = (session, file, extra) =>
  hook(
    "permissions",
    session,
    "Write",
    { file_path: file, content: "x" },
    extra,
  );
const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const timed = (command, args, cwd) => {
  const started = process.hrtime.bigint();
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  return {
    exitCode: result.status,
    ms: Math.round(Number(process.hrtime.bigint() - started) / 1e6),
  };
};
const journal = (session) => {
  const file = join(
    launchpad,
    "docs/control/local/harness",
    `${digest(session)}.jsonl`,
  );
  return existsSync(file)
    ? readFileSync(file, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line))
        .filter((row) => row.outsideWrite)
        .map((row) => JSON.parse(hidden(JSON.stringify(row.outsideWrite))))
    : [];
};

try {
  for (const directory of [launchpad, target, temporary, elsewhere])
    mkdirSync(directory);
  execFileSync("git", ["init", "-q", "-b", "wo-999"], { cwd: launchpad });
  put(".gitignore", ".runtime/\ndocs/control/local/\n");
  put("CLAUDE.md", "# Fixture locked floor\nKeep synthetic source isolated.\n");
  put("dotln.config.json", JSON.stringify({ version: 1 }));
  // The stub counts each lifecycle call. With PROBE_REAL_STATUS_ROOT set it
  // first runs that checkout's own status, so the call costs what it does there.
  put(
    "scripts/resume.mjs",
    [
      'import { appendFileSync, readFileSync } from "node:fs";',
      'import { spawnSync } from "node:child_process";',
      'appendFileSync(process.env.PROBE_COUNTER, process.argv.slice(2).join(" ") + "\\n");',
      "if (process.env.PROBE_REAL_STATUS_ROOT)",
      '  spawnSync(process.execPath, [`${process.env.PROBE_REAL_STATUS_ROOT}/scripts/resume.mjs`, "status", "--json", "--work-order", process.env.PROBE_REAL_STATUS_ORDER], { cwd: process.env.PROBE_REAL_STATUS_ROOT, stdio: "ignore" });',
      'const status = JSON.parse(readFileSync(process.env.PROBE_STATUS, "utf8"));',
      "if (status.unavailable) process.exit(1);",
      "console.log(JSON.stringify(status));",
      "",
    ].join("\n"),
  );
  put("docs/work-orders/WO-999.md", "# Synthetic target order\n");
  put(registry, JSON.stringify({ [target]: entry }));
  status("active");
  execFileSync("git", ["add", "."], { cwd: launchpad });
  execFileSync(
    "git",
    [
      ...["-c", "core.hooksPath=/dev/null", "-c", "user.name=Fixture"],
      ...["-c", "user.email=fixture@example.invalid"],
      ...["-c", "commit.gpgsign=false", "commit", "-qm", "Synthetic launchpad"],
    ],
    { cwd: launchpad },
  );
  emitHarness(launchpad);
  const manifest = JSON.parse(
    readFileSync(join(launchpad, ".claude/harness-manifest.json"), "utf8"),
  );
  results.grantKinds = Object.fromEntries(
    manifest.profiles[0].outsideWriteGrants.map((row) => [
      row.role,
      row.grants.map((grant) => grant.kind),
    ]),
  );
  for (const role of ["executor", "verifier", "release-close"])
    beginHarnessSession(launchpad, `probe-${role}`, role);

  // Criterion 2's three request shapes at the current build.
  P.headEdit = hook("permissions", "probe-executor", "Edit", {
    file_path: join(target, "file.txt"),
    old_string: "a",
    new_string: "b",
  });
  P.headWrite = write("probe-executor", join(target, "file.txt"));
  P.headRedirect = hook("permissions", "probe-executor", "Bash", {
    command: `printf y > '${target}/file.txt'`,
  });
  P.headJournal = journal("probe-executor");

  // Lifecycle spawns per judged outside write, per judging hook.
  const scratchFile = join(temporary, "scratch.txt");
  P.spawns = {};
  for (const name of [
    "permissions",
    "concurrent-work-requires-worktrees",
    "write-observer",
  ])
    P.spawns[name] = {
      executorTemp: hook(name, "probe-executor", "Write", {
        file_path: scratchFile,
        content: "x",
      }).statusSpawns,
      verifierTemp: hook(name, "probe-verifier", "Write", {
        file_path: scratchFile,
        content: "x",
      }).statusSpawns,
      executorInProject: hook(name, "probe-executor", "Write", {
        file_path: join(launchpad, "inside.txt"),
        content: "x",
      }).statusSpawns,
    };
  const latency = (extra) => {
    const executor = [];
    const verifier = [];
    for (let index = 0; index < 9; index++) {
      executor.push(write("probe-executor", scratchFile, extra).ms);
      verifier.push(write("probe-verifier", scratchFile, extra).ms);
    }
    return {
      executorTempMedianMs: median(executor),
      verifierTempMedianMs: median(verifier),
      executorTempMs: executor,
      verifierTempMs: verifier,
    };
  };
  P.latencyStubStatus = latency({});
  P.latencyRepositoryStatusCost = latency({
    PROBE_REAL_STATUS_ROOT: repo,
    PROBE_REAL_STATUS_ORDER: order,
  });
  P.repositoryStatusMs = [1, 2, 3].map(
    () =>
      timed(
        process.execPath,
        ["scripts/resume.mjs", "status", "--json", "--work-order", order],
        repo,
      ).ms,
  );
  P.bareNodeMs = [1, 2, 3].map(
    () => timed(process.execPath, ["-e", "0"], repo).ms,
  );

  // Refusal text for writes unrelated to and into the target.
  P.verifierElsewhere = write("probe-verifier", join(elsewhere, "x.txt"));
  P.executorElsewhere = write("probe-executor", join(elsewhere, "x.txt"));
  P.verifierIntoTarget = write("probe-verifier", join(target, "x.txt"));
  P.releaseCloseIntoTarget = write(
    "probe-release-close",
    join(target, "x.txt"),
  );
  P.traversal = write("probe-executor", `${target}/../elsewhere/x.txt`);

  // An order without a target registry (the self-hosted shape).
  unlinkSync(join(launchpad, registry));
  P.noRegistryElsewhere = write("probe-executor", join(elsewhere, "x.txt"));
  P.noRegistryTemp = write("probe-executor", scratchFile);
  P.noRegistryTarget = write("probe-executor", join(target, "x.txt"));
  put(registry, JSON.stringify({ [target]: entry }));

  // The registered target directory is missing.
  renameSync(target, `${target}.moved`);
  P.missingTargetInto = write("probe-executor", join(target, "x.txt"));
  P.missingTargetElsewhere = write("probe-executor", join(elsewhere, "x.txt"));
  renameSync(`${target}.moved`, target);

  // The lifecycle is unavailable.
  status("active", { unavailable: true });
  P.statusUnavailableTarget = write("probe-executor", join(target, "x.txt"));
  P.statusUnavailableTemp = write("probe-executor", scratchFile);
  status("active");

  // The registry is a symbolic link to an identical file outside the root.
  const copy = join(base, "registry-copy.json");
  writeFileSync(copy, JSON.stringify({ [target]: entry }));
  unlinkSync(join(launchpad, registry));
  symlinkSync(copy, join(launchpad, registry));
  P.registrySymlink = write("probe-executor", join(target, "x.txt"));
  unlinkSync(join(launchpad, registry));
  put(registry, JSON.stringify({ [target]: entry }));

  P.phases = {};
  for (const phase of [
    "active",
    "repairing",
    "ready-to-verify",
    "verifying",
    "final-review",
    "closed",
  ]) {
    status(phase);
    const reply = write("probe-executor", join(target, "x.txt"));
    P.phases[phase] = { admitted: reply.admitted, reason: reply.reason };
  }
  status("active");

  // Copilot's native write shape under the reused registration.
  const copilot = { COPILOT_PROJECT_DIR: launchpad };
  P.copilotIntoTarget = hook(
    "permissions",
    "probe-executor",
    "Write",
    { path: join(target, "copilot.txt"), file_text: "x" },
    copilot,
  );
  P.copilotElsewhere = hook(
    "permissions",
    "probe-executor",
    "Write",
    { path: join(elsewhere, "copilot.txt"), file_text: "x" },
    copilot,
  );
} catch (error) {
  results.error = hidden(error?.stack ?? error);
} finally {
  rmSync(base, { recursive: true, force: true });
  results.fixtureRemoved = !existsSync(base);
  writeFileSync(output, JSON.stringify(results, null, 2) + "\n");
}
if (results.error) process.exit(1);
