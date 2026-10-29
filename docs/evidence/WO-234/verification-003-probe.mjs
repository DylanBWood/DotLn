// WO-234 VER-003 independent probe. Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-234/verification-003-probe.mjs <count|usage|lane>
// count and usage build synthetic roots under the system temporary directory and
// vary what repair 002's cases held constant. lane reads this checkout's journal
// lane, gate rows and control log and writes none of them. Each prints one JSON
// result per variation. Nothing is written in the repository.
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  createFixtureRoot,
  excludeFixtureOwnership,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";
import { runGit } from "../../../scripts/lib/git.mjs";
import {
  dispatchStanding,
  dispatchStandingLine,
} from "../../../scripts/lib/dispatch-bound.mjs";
import {
  readGateChecks,
  recordGateChecks,
} from "../../../scripts/lib/gate-evidence.mjs";

const repo = process.cwd();
const section = process.argv[2];
const roots = [];
const results = [];
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const sha = (text) => createHash("sha256").update(text).digest("hex");
const iso = (ms) => new Date(ms).toISOString();
const put = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
const fixtureRoot = (prefix) => {
  const root = realpathSync(createFixtureRoot(join(tmpdir(), prefix)));
  roots.push(root);
  return root;
};
const kit = () =>
  JSON.parse(
    readFileSync(join(repo, "scripts/kit/budgets.template.json"), "utf8"),
  );
const journalPath = (session) =>
  `docs/control/local/harness/${sha(session)}.json`;
const machinePaths = () => {
  const common = execFileSync("git", ["rev-parse", "--git-common-dir"], {
    cwd: repo,
    encoding: "utf8",
  }).trim();
  return [
    [dirname(realpathSync(resolve(repo, common))), "<main-checkout>"],
    [realpathSync(repo), "<worktree>"],
    [repo, "<worktree>"],
    [realpathSync(tmpdir()), "<system-temp>"],
    [tmpdir().replace(/\/$/u, ""), "<system-temp>"],
  ];
};
const hide = (text) =>
  typeof text === "string"
    ? machinePaths().reduce(
        (value, [path, label]) => value.replaceAll(path, label),
        roots.reduce(
          (value, root) => value.replaceAll(root, "<fixture>"),
          text,
        ),
      )
    : text;
async function check(id, criterion, variation, expected, observe) {
  let observed, pass;
  try {
    ({ observed, pass } = await observe());
  } catch (error) {
    observed = { threw: hide(String(error?.message ?? error)).slice(0, 600) };
    pass = false;
  }
  const row = { id, criterion, variation, expected, observed, pass };
  results.push(row);
  console.log(JSON.stringify(row, (key, value) => hide(value)));
}
const commit = (root) => {
  const options = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  runGit(root, ["add", "."], options);
  runGit(
    root,
    [
      "-c",
      "user.name=Probe",
      "-c",
      "user.email=probe@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "probe",
    ],
    options,
  );
};
const sessionNames = [
  "CODEX_THREAD_ID",
  "COPILOT_AGENT_SESSION_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_SESSION_ID",
];
const sessionEnv = () => {
  const env = { ...process.env, CLAUDE_PID: String(process.pid) };
  for (const name of [...sessionNames, "CLAUDE_PROJECT_DIR"]) delete env[name];
  return env;
};
const verifierJournal = (startedAt) => ({
  role: "verifier",
  intent: "resume: verify",
  workOrder: "WO-999",
  startedAt: iso(startedAt),
  startingEventCount: 0,
  reads: [],
  boundDispatch: {
    role: "verifier",
    intent: "resume: verify",
    workOrder: "WO-999",
    startedAt: iso(startedAt),
    phaseBoundary: "WO-999:VerificationRequested:-1",
  },
});
// One admitted complete review in the runner's current row shape.
const admittedReview = (startedAt) => ({
  checkId: "npm test",
  executed: true,
  gateSelection: "review",
  exitCode: 0,
  treeHash: "a".repeat(40),
  codeIdentity: "b".repeat(64),
  subject: "a".repeat(40),
  evidenceRef: `probe:${startedAt}`,
  startedAt: iso(startedAt),
  recordedAt: iso(startedAt + MINUTE),
  taskTimeline: [{ name: "host", executed: true, exitCode: 0 }],
});

// Criteria 2 and 3 through the real runner: which complete selections consume
// a run. Repair 002's runner case covers a memory refusal, an unavailable
// standing and one admitted pass; these vary the admitted outcome, interrupt an
// admitted run, fail a structural task before host, add --keep-going, and spend
// a one-run bound across refusals.
async function count() {
  const { runGate } = await import("../../../scripts/test-runner.mjs");
  const options = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  const session = "probe-count-v3";
  const build = (completeRuns = 3) => {
    const root = fixtureRoot("dotln-ver234c-count-");
    runGit(root, ["init", "-b", "main"], options);
    excludeFixtureOwnership(root);
    put(
      root,
      ".gitignore",
      "docs/control/local/\nran.txt\nalpha-started\nlevel.txt\nalpha-mode.txt\n",
    );
    // The host's sampled level is an ignored input, so one root and one
    // dispatch can be refused and then admitted.
    put(
      root,
      "scripts/host.mjs",
      `import {readFileSync} from "node:fs";
import {checkHost} from ${JSON.stringify(pathToFileURL(join(repo, "scripts/structural-checks.mjs")).href)};
const sample={level:readFileSync("level.txt","utf8").trim(),pressure:0,swapBytes:0,physicalBytes:2**36,source:"probe"};
const result=checkHost(sample,{limits:{taskBytes:2**30,hostLanes:8},requiredPeakBytes:0,fileEvents:{}});
console.log("STRUCTURAL_RESULT "+JSON.stringify(result)); process.exitCode=result.exitCode;`,
    );
    put(
      root,
      "scripts/alpha.mjs",
      `import {readFileSync,writeFileSync} from "node:fs";
const mode=readFileSync("alpha-mode.txt","utf8").trim();
writeFileSync("alpha-started","1");
if (mode==="slow") await new Promise((done)=>setTimeout(done,120000));
writeFileSync("ran.txt",mode);
process.exitCode=mode==="fail"?1:0;`,
    );
    put(root, "scripts/declarations.mjs", "process.exitCode = 0;\n");
    put(root, "level.txt", "normal");
    put(root, "alpha-mode.txt", "ok");
    const budgets = kit();
    Object.assign(budgets.dispatches.verifier, {
      wallClockMs: 8 * HOUR,
      completeRuns,
    });
    put(root, "docs/control/budgets.json", JSON.stringify(budgets));
    put(
      root,
      journalPath(session),
      JSON.stringify(verifierJournal(Date.now() - MINUTE)),
    );
    commit(root);
    return root;
  };
  const table = (structuralBeforeHost = false) => [
    ...(structuralBeforeHost
      ? [
          {
            name: "declarations",
            command: [process.execPath, "scripts/declarations.mjs"],
            structural: true,
            product: true,
          },
        ]
      : []),
    {
      name: "host",
      command: [process.execPath, "scripts/host.mjs"],
      args: ["host"],
      structural: true,
      product: true,
    },
    {
      name: "build",
      command: [process.execPath, "-e", "0"],
      build: true,
      product: true,
      outputs: [],
    },
    {
      name: "alpha",
      command: [process.execPath, "scripts/alpha.mjs"],
      product: true,
    },
  ];
  const lastRow = (root) =>
    readGateChecks(root)
      .filter((row) => row.checkId === "npm test")
      .at(-1);
  const rowFields = (row) =>
    row && {
      gateSelection: row.gateSelection,
      exitCode: row.exitCode,
      stopped: row.stopped ?? false,
      boundStop: row.boundStop
        ? `${row.boundStop.metric}=${row.boundStop.value}/${row.boundStop.bound}`
        : null,
      host: (() => {
        const host = row.taskTimeline?.find((task) => task.name === "host");
        return host
          ? { executed: host.executed, exitCode: host.exitCode }
          : null;
      })(),
      unrunHost: row.unrunSuites?.includes("host") ?? null,
    };
  const standing = (root) => dispatchStanding(root, { session });
  const review = async (root, args = [], extra = {}) => {
    rmSync(join(root, "ran.txt"), { force: true });
    rmSync(join(root, "alpha-started"), { force: true });
    let result, threw;
    try {
      result = await runGate(
        ["--review", "--serial", "--again", ...args],
        root,
        { table: table(extra.structuralBeforeHost), ...extra.options },
      );
    } catch (error) {
      threw = String(error?.message ?? error).slice(0, 160);
    }
    return {
      exitCode: result?.exitCode ?? null,
      threw: threw ?? null,
      alphaRan: existsSync(join(root, "ran.txt")),
      row: rowFields(lastRow(root)),
    };
  };
  const saved = Object.fromEntries(
    sessionNames.map((name) => [name, process.env[name]]),
  );
  for (const name of sessionNames) delete process.env[name];
  process.env.CLAUDE_CODE_SESSION_ID = session;
  try {
    {
      const root = build();
      put(root, "alpha-mode.txt", "fail");
      const failed = await review(root);
      const after = standing(root);
      await check(
        "C1-admitted-failure",
        "2, 3",
        "the real runner admits a review at host, then its product suite fails",
        "product 07: a failed admitted complete selection consumes a run (1 of 3); the row records host executed with exit 0",
        () => ({
          observed: {
            ...failed,
            standing: dispatchStandingLine(after),
          },
          pass:
            failed.exitCode === 1 &&
            failed.alphaRan &&
            failed.row?.host?.executed === true &&
            failed.row.host.exitCode === 0 &&
            after.completeRuns === 1,
        }),
      );
    }
    {
      const root = build();
      put(root, "alpha-mode.txt", "slow");
      let requested = false;
      const watch = setInterval(() => {
        if (existsSync(join(root, "alpha-started"))) requested = true;
      }, 100);
      const stopped = await review(root, [], {
        options: { stopRequested: () => requested },
      });
      clearInterval(watch);
      const after = standing(root);
      await check(
        "C2-admitted-interruption",
        "2, 3",
        "the real runner admits a review at host; a stop request arrives while its product suite runs",
        "product 07: an interrupted admitted complete selection consumes a run (1 of 3); the stopped row keeps the passed host in its timeline",
        () => ({
          observed: {
            ...stopped,
            standing: dispatchStandingLine(after),
          },
          pass:
            /^Gate stopped by request/u.test(stopped.threw ?? "") &&
            !stopped.alphaRan &&
            stopped.row?.stopped === true &&
            stopped.row.host?.executed === true &&
            stopped.row.host.exitCode === 0 &&
            after.completeRuns === 1,
        }),
      );
    }
    {
      const root = build();
      put(
        root,
        "scripts/declarations.mjs",
        'console.log("probe declaration failure"); process.exitCode = 1;\n',
      );
      commit(root);
      const failed = await review(root, [], { structuralBeforeHost: true });
      const after = standing(root);
      await check(
        "C3-structural-failure-before-host",
        "2",
        "the real runner fails a structural task that precedes host (the shape of this order's own 05:08:52Z row)",
        "product 07: an unrun host consumes none (0 of 3); alpha never runs",
        () => ({
          observed: {
            ...failed,
            standing: dispatchStandingLine(after),
          },
          pass:
            failed.exitCode === 1 &&
            !failed.alphaRan &&
            failed.row?.unrunHost === true &&
            after.completeRuns === 0,
        }),
      );
    }
    {
      const root = build();
      put(root, "level.txt", "critical");
      const refused = await review(root, ["--keep-going"]);
      const after = standing(root);
      await check(
        "C4-keep-going-memory-refusal",
        "2, 3",
        "the real runner under --keep-going refuses a review at host on a synthetic critical memory sample",
        "--keep-going does not run product suites past a host refusal, and the refusal consumes none (0 of 3)",
        () => ({
          observed: {
            ...refused,
            standing: dispatchStandingLine(after),
          },
          pass:
            refused.exitCode === 1 &&
            !refused.alphaRan &&
            refused.row?.host?.exitCode === 1 &&
            !refused.row.boundStop &&
            after.completeRuns === 0,
        }),
      );
    }
    {
      const root = build(1);
      put(root, "level.txt", "critical");
      const refusals = [];
      for (let attempt = 0; attempt < 3; attempt++)
        refusals.push(await review(root));
      const afterRefusals = standing(root);
      put(root, "level.txt", "normal");
      const admitted = await review(root);
      const afterAdmitted = standing(root);
      const stopped = await review(root);
      await check(
        "C5-refusals-then-one-run-bound",
        "2, 3",
        "a one-run bound: three memory refusals at host, one admitted review, then another review",
        "the refusals leave 0 of 1 and within; the admitted review spends the bound (1 of 1, exceeded); the next review is refused at host with a completeRuns bound stop and alpha does not run",
        () => ({
          observed: {
            refusals: refusals.map(({ exitCode, alphaRan, row }) => ({
              exitCode,
              alphaRan,
              hostExit: row?.host?.exitCode ?? null,
            })),
            afterRefusals: dispatchStandingLine(afterRefusals),
            admitted: { exitCode: admitted.exitCode, ran: admitted.alphaRan },
            afterAdmitted: dispatchStandingLine(afterAdmitted),
            stopped,
          },
          pass:
            refusals.every(
              ({ exitCode, alphaRan, row }) =>
                exitCode === 1 && !alphaRan && row?.host?.exitCode === 1,
            ) &&
            afterRefusals.completeRuns === 0 &&
            afterRefusals.state === "within" &&
            admitted.exitCode === 0 &&
            admitted.alphaRan &&
            afterAdmitted.completeRuns === 1 &&
            afterAdmitted.state === "exceeded" &&
            stopped.exitCode === 1 &&
            !stopped.alphaRan &&
            stopped.row?.boundStop === "completeRuns=1/1",
        }),
      );
    }
  } finally {
    for (const [name, value] of Object.entries(saved))
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
  }
}

// The fixture the harness-fixtures cases build: the source's runtime and
// scripts, an emitted harness and one synthetic order in verification.
async function hookFixture(source, label) {
  const { emitHarness } = await import(
    pathToFileURL(join(source, "scripts/lib/harness.mjs")).href
  );
  const root = fixtureRoot(`dotln-ver234c-${label}-`);
  const options = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  runGit(root, ["init", "-b", "wo-999"], options);
  excludeFixtureOwnership(root);
  for (const name of ["compiler", "skeleton", "kernel"]) {
    cpSync(
      join(source, `packages/${name}/dist/src`),
      join(root, `packages/${name}/dist/src`),
      { recursive: true },
    );
    cpSync(
      join(source, `packages/${name}/package.json`),
      join(root, `packages/${name}/package.json`),
    );
    mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
    symlinkSync(
      `../../packages/${name}`,
      join(root, `node_modules/@dotln/${name}`),
    );
  }
  cpSync(join(source, "packages/beacons"), join(root, "packages/beacons"), {
    recursive: true,
  });
  symlinkSync(
    "../../packages/beacons",
    join(root, "node_modules/@dotln/beacons"),
  );
  symlinkSync(
    join(repo, "node_modules/typescript"),
    join(root, "node_modules/typescript"),
  );
  put(
    root,
    ".gitignore",
    "node_modules/\n**/dist/\ndocs/control/local/\n.runtime/\n.dotln-owner.json\n",
  );
  put(root, "CLAUDE.md", "# Probe locked floor\n");
  put(root, "fixture.ts", "export const value = 1;\n");
  put(
    root,
    "package.json",
    JSON.stringify({
      private: true,
      scripts: { test: "node -e 0", "test:full": "node -e 0" },
    }),
  );
  put(
    root,
    "scripts/resume.mjs",
    'import {readFileSync} from "node:fs"; console.log(readFileSync("docs/control/fixture-status.json", "utf8"));\n',
  );
  cpSync(join(source, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  for (const path of JSON.parse(
    readFileSync(
      join(source, "scripts/test-harness.fixture-inputs.json"),
      "utf8",
    ),
  ).files) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(source, path), join(root, path));
  }
  put(
    root,
    "docs/control/fixture-status.json",
    JSON.stringify({
      workOrder: "WO-999",
      workOrderPath: "docs/work-orders/WO-999-fixture.md",
      phase: "verifying",
      latestVerdict: null,
    }),
  );
  put(
    root,
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
      "\n",
  );
  put(root, "docs/work-orders/WO-999-fixture.md", "# Synthetic work order\n");
  commit(root);
  emitHarness(root);
  return root;
}

function drivers(root) {
  const env = sessionEnv();
  const run = (hook, id, payload) => {
    const result = spawnSync(
      process.execPath,
      [join(root, `.claude/hooks/${hook}.mjs`)],
      {
        cwd: root,
        env,
        input: JSON.stringify({ cwd: root, session_id: id, ...payload }),
        encoding: "utf8",
        timeout: 60_000,
      },
    );
    let output = {};
    try {
      output = JSON.parse(result.stdout || "{}");
    } catch {}
    return { status: result.status, output, stderr: result.stderr ?? "" };
  };
  const journal = (id) => {
    const file = join(root, journalPath(id));
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
  };
  const tool = (id, tool_name, tool_input) => {
    const result = run("permissions", id, {
      hook_event_name: "PreToolUse",
      tool_name,
      tool_input,
    });
    return result.output.hookSpecificOutput?.permissionDecision === "deny"
      ? `denied: ${String(result.output.hookSpecificOutput.permissionDecisionReason).slice(0, 120)}`
      : "admitted";
  };
  const enter = (id, prompt = "resume: verify") => {
    run("session", id, { hook_event_name: "SessionStart", source: "startup" });
    return run("session", id, { hook_event_name: "UserPromptSubmit", prompt });
  };
  const stopLine = (id) =>
    String(
      run("finish", id, { hook_event_name: "Stop" }).output.systemMessage ?? "",
    )
      .split("\n")
      .find((line) => line.startsWith("dispatch standing")) ?? null;
  // The whole Stop result, so an arm without a standing line is compared with
  // what the other arm printed rather than with an assumed form.
  const stop = (id) => {
    const result = run("finish", id, { hook_event_name: "Stop" });
    const lines = String(result.output.systemMessage ?? "")
      .split("\n")
      .filter(Boolean);
    return {
      status: result.status,
      standing:
        lines.find((line) => line.startsWith("dispatch standing")) ?? null,
      lines: lines.length,
      other: lines
        .filter((line) => !line.startsWith("dispatch standing"))
        .map((line) => line.slice(0, 160)),
      stderr: result.stderr.trim().slice(0, 300),
    };
  };
  const usage = (id) => {
    const result = spawnSync(
      process.execPath,
      [join(root, "scripts/harness.mjs"), "usage", id],
      { cwd: root, env, encoding: "utf8", timeout: 60_000 },
    );
    let parsed = null;
    try {
      parsed = JSON.parse(result.stdout.trim().split("\n").at(-1));
    } catch {}
    return {
      exitCode: result.status,
      usagePrinted: Boolean(parsed && "usage" in parsed),
      state: parsed?.dispatchStanding?.state ?? null,
      numbers: parsed?.dispatchStanding
        ? ["elapsedMs", "completeRuns", "startedAt"].filter(
            (key) => parsed.dispatchStanding[key] !== undefined,
          )
        : null,
      standing: parsed?.standing ?? null,
      stderr: result.stderr
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => line.slice(0, 200)),
    };
  };
  return { run, journal, tool, enter, stopLine, stop, usage };
}

// HEAD's scripts with the main checkout's runtime built from the same commit,
// read without modification (the base arm VER-001 and VER-002 used).
function baseSource() {
  const git = (cwd, args) =>
    execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  const head = git(repo, ["rev-parse", "HEAD"]);
  const main = dirname(
    realpathSync(resolve(repo, git(repo, ["rev-parse", "--git-common-dir"]))),
  );
  const mainHead = git(main, ["rev-parse", "HEAD"]);
  const mainClean =
    git(main, ["status", "--porcelain", "--untracked-files=no"]) === "";
  const mainHost = readFileSync(
    join(main, "packages/skeleton/dist/src/harness-host.js"),
    "utf8",
  );
  const base = fixtureRoot("dotln-ver234c-base-");
  const archive = execFileSync(
    "git",
    [
      "archive",
      "HEAD",
      "--",
      "scripts",
      "packages/skeleton",
      "packages/compiler/package.json",
      "packages/kernel/package.json",
      "packages/beacons",
    ],
    { cwd: repo, maxBuffer: 256 * 1024 * 1024 },
  );
  if (spawnSync("tar", ["-x", "-C", base], { input: archive }).status !== 0)
    throw new Error("base extraction failed");
  for (const name of ["compiler", "skeleton", "kernel"])
    cpSync(
      join(main, `packages/${name}/dist`),
      join(base, `packages/${name}/dist`),
      { recursive: true },
    );
  mkdirSync(join(base, "node_modules/@dotln"), { recursive: true });
  for (const name of readdirSync(join(repo, "node_modules")).filter(
    (name) => name !== "@dotln" && name !== ".bin",
  ))
    symlinkSync(
      join(repo, "node_modules", name),
      join(base, "node_modules", name),
    );
  for (const name of ["compiler", "skeleton", "kernel", "beacons"])
    symlinkSync(
      `../../packages/${name}`,
      join(base, `node_modules/@dotln/${name}`),
    );
  const provenance = {
    head,
    mainHead,
    mainClean,
    baseRuntimeHasBound: /bindDispatchBound|readDispatchJournals/u.test(
      mainHost,
    ),
  };
  if (head !== mainHead || !mainClean || provenance.baseRuntimeHasBound)
    throw new Error(
      `base runtime provenance does not match HEAD: ${JSON.stringify(provenance)}`,
    );
  return { base, provenance };
}

// Criterion 6 and VER-002 F4's rule: usage keeps main's output and exit status
// whatever the standing, beyond the four damaged-journal kinds of another
// session that repair 002's case and VER-002's probe use.
async function usage() {
  const { base, provenance } = baseSource();
  await check(
    "U0-provenance",
    "regression",
    "base arm provenance",
    "HEAD equals the main checkout's clean HEAD, whose runtime has no dispatch binder",
    () => ({ observed: provenance, pass: true }),
  );
  const budgets = kit();
  Object.assign(budgets.dispatches.verifier, {
    wallClockMs: 3 * HOUR,
    completeRuns: 3,
  });
  const damages = [
    [
      "U2-own-journal-damaged",
      "the dispatched session's own journal is truncated after entry",
      (root, id) => put(root, journalPath(id), "{ truncated"),
    ],
    [
      "U3-invalid-budgets",
      "the budgets file carries an invalid dispatch bound (verifier wallClockMs -1)",
      (root) => {
        const invalid = kit();
        invalid.dispatches.verifier.wallClockMs = -1;
        put(root, "docs/control/budgets.json", JSON.stringify(invalid));
      },
    ],
    [
      "U4-unreadable-gate-rows",
      "the gate-row store holds truncated JSON",
      (root) => put(root, "docs/control/local/harness/checks.json", "{ broken"),
    ],
  ];
  const arms = {};
  for (const [arm, source] of [
    ["base", base],
    ["current", repo],
  ]) {
    arms[arm] = {};
    for (const [id, , damage] of damages) {
      const root = await hookFixture(source, `${arm}-${id.slice(0, 2)}`);
      put(root, "docs/control/budgets.json", JSON.stringify(budgets));
      const drive = drivers(root);
      const session = `v3-${arm}-${id}`;
      drive.enter(session);
      const clean = drive.usage(session);
      damage(root, session);
      arms[arm][id] = {
        clean,
        damaged: drive.usage(session),
        stop: drive.stop(session),
      };
    }
  }
  for (const [id, variation] of damages) {
    const baseArm = arms.base[id];
    const current = arms.current[id];
    await check(
      id,
      "6, regression",
      variation,
      "the current arm keeps the base arm's usage exit status and output; where usage prints, its standing is unavailable with the read error and carries no elapsed time, run count or start; the Stop hook keeps the base arm's status, and a Stop standing line equals the usage standing",
      () => ({
        observed: { base: baseArm, current },
        pass:
          current.damaged.exitCode === baseArm.damaged.exitCode &&
          current.damaged.usagePrinted === baseArm.damaged.usagePrinted &&
          (!current.damaged.usagePrinted ||
            (current.damaged.state === "unavailable" &&
              current.damaged.numbers?.length === 0 &&
              /^dispatch standing: unavailable \(.+\)$/u.test(
                current.damaged.standing ?? "",
              ))) &&
          current.stop.status === baseArm.stop.status &&
          (current.stop.standing === null ||
            current.stop.standing === current.damaged.standing),
      }),
    );
  }

  // VER-002 F5 through the real control store, CLI and hooks: VER-002 passed
  // the completion event to the function directly (its stated limit).
  const root = await hookFixture(repo, "current-recovery");
  put(root, "docs/control/budgets.json", JSON.stringify(budgets));
  const drive = drivers(root);
  const now = Date.now();
  const segment = "docs/control/orders/WO-999.jsonl";
  const event = (type, at) =>
    JSON.stringify({ type, workOrderId: "WO-999", recordedAt: iso(at) }) + "\n";
  put(
    root,
    segment,
    event("WorkOrderActivated", now - 6 * HOUR) +
      event("ImplementationReady", now - 5 * HOUR) +
      event("VerificationRequested", now - 4 * HOUR),
  );
  const A = "v3-recovery-A";
  drive.enter(A);
  const aJournal = drive.journal(A);
  // A started two hours ago and two admitted reviews ran in its attempt.
  aJournal.boundDispatch.startedAt = iso(now - 2 * HOUR);
  aJournal.startedAt = iso(now - 2 * HOUR);
  put(root, journalPath(A), JSON.stringify(aJournal));
  recordGateChecks(root, [
    admittedReview(now - 110 * MINUTE),
    admittedReview(now - 80 * MINUTE),
  ]);
  const aBytes = readFileSync(join(root, journalPath(A)), "utf8");
  put(root, journalPath(A), "{ truncated");
  const B = "v3-recovery-B";
  drive.enter(B);
  const bJournal = drive.journal(B);
  const whileDamaged = { usage: drive.usage(B), stop: drive.stopLine(B) };
  put(root, journalPath(A), aBytes);
  const restored = { usage: drive.usage(B), stop: drive.stopLine(B) };
  appendFileSync(join(root, segment), event("VerificationCompleted", now + 1));
  const completed = { usage: drive.usage(B), stop: drive.stopLine(B) };
  appendFileSync(
    join(root, segment),
    event("VerificationRequested", now + 2000),
  );
  const D = "v3-recovery-D";
  drive.enter(D);
  const next = { usage: drive.usage(D), stop: drive.stopLine(D) };
  const tightened = kit();
  Object.assign(tightened.dispatches.verifier, {
    wallClockMs: HOUR,
    completeRuns: 3,
  });
  put(root, "docs/control/budgets.json", JSON.stringify(tightened));
  const decisions = {
    marked: drive.tool(B, "Bash", { command: "npm test -- --review" }),
    markedFocused: drive.tool(B, "Bash", {
      command: "npm test -- --only skeleton",
    }),
    nextAttempt: drive.tool(D, "Bash", { command: "npm test -- --review" }),
  };
  await check(
    "R8-marked-restored-completed-control-store",
    "2, 6",
    "a marked dispatch B (anchor A damaged at entry) after A is restored, then after VerificationCompleted is filed in the control store, then a re-request and a new dispatch D",
    "while damaged: unavailable naming A; once restored and after completion: B reads A's start and runs (2 h 0 min, 2 of 3) in usage and the Stop line alike; D reads its own start (0 runs); at a 1 h 0 min bound the hook denies B's complete review, admits B's focused run, and admits D's review",
    () => ({
      observed: {
        bMarked: Boolean(bJournal?.boundDispatch?.unavailable),
        bBoundary: bJournal?.boundDispatch?.phaseBoundary ?? null,
        whileDamaged,
        restored,
        completed,
        next,
        decisions,
      },
      pass:
        Boolean(bJournal?.boundDispatch?.unavailable) &&
        bJournal.boundDispatch.phaseBoundary ===
          "WO-999:VerificationRequested:2" &&
        whileDamaged.usage.exitCode === 0 &&
        whileDamaged.usage.state === "unavailable" &&
        whileDamaged.usage.standing.includes(journalPath(A)) &&
        whileDamaged.stop === whileDamaged.usage.standing &&
        /^dispatch standing: 2 h 0 min of 3 h 0 min; complete runs 2 of 3; within$/u.test(
          restored.usage.standing ?? "",
        ) &&
        restored.stop === restored.usage.standing &&
        completed.usage.standing === restored.usage.standing &&
        completed.stop === completed.usage.standing &&
        /^dispatch standing: 0 h 0 min of 3 h 0 min; complete runs 0 of 3; within$/u.test(
          next.usage.standing ?? "",
        ) &&
        next.stop === next.usage.standing &&
        /^denied: DOTLN_DISPATCH_BOUND: wall clock=2 h 0 min, bound=1 h 0 min/u.test(
          decisions.marked,
        ) &&
        decisions.markedFocused === "admitted" &&
        decisions.nextAttempt === "admitted",
    }),
  );
}

// The real record: repair 002 changes how this checkout's existing history
// reads. Compare checkpoint 10 (VER-002's subject) with the current scripts
// over this checkout's journal lane, gate rows and control log at one instant,
// and check every stored phase-request index against the order's log. Records
// roles, phases, starts, counts and states only; no session key is printed.
async function lane() {
  const before = fixtureRoot("dotln-ver234c-ck10-");
  const archive = execFileSync(
    "git",
    [
      "archive",
      "refs/dotln/checkpoint/WO-234/10",
      "--",
      "scripts",
      "packages/skeleton/src",
    ],
    { cwd: repo, maxBuffer: 256 * 1024 * 1024 },
  );
  if (spawnSync("tar", ["-x", "-C", before], { input: archive }).status !== 0)
    throw new Error("checkpoint extraction failed");
  symlinkSync(join(repo, "node_modules"), join(before, "node_modules"));
  const old = await import(
    pathToFileURL(join(before, "scripts/lib/dispatch-bound.mjs")).href
  );
  const current = await import("../../../scripts/lib/dispatch-bound.mjs");
  const directory = join(repo, "docs/control/local/harness");
  const now = Date.now();
  const read = (module, sessionKey) => {
    try {
      const s = module.dispatchStanding(repo, { sessionKey, now });
      return {
        role: s.role,
        phase: s.phase ?? null,
        startedAt: s.startedAt ?? null,
        completeRuns: s.completeRuns,
        bound: s.bound,
        state: s.state,
        exceeded: s.exceeded?.map(({ metric }) => metric) ?? null,
      };
    } catch (error) {
      return { error: String(error.message).slice(0, 120) };
    }
  };
  const journals = readdirSync(directory)
    .filter((name) => /^[a-f0-9]{64}\.json$/u.test(name))
    .map((name) => name.slice(0, -5));
  const rows = journals
    .map((key) => ({ old: read(old, key), current: read(current, key) }))
    .filter(({ old, current }) => old.role || current.role);
  const changed = rows.filter(
    ({ old, current }) => JSON.stringify(old) !== JSON.stringify(current),
  );
  const npmRows = readGateChecks(repo).filter(
    (row) =>
      row.checkId === "npm test" &&
      ["plain", "review"].includes(row.gateSelection),
  );
  const unadmitted = npmRows
    .filter((row) => {
      const host = row.taskTimeline?.find((task) => task.name === "host");
      return host && !(host.executed === true && host.exitCode === 0);
    })
    .map((row) => ({
      startedAt: row.startedAt,
      failedFirst: row.failedFirst ?? null,
    }));
  await check(
    "L1-real-lane-differential",
    "2, regression",
    "checkpoint 10's and the current dispatchStanding over every bound journal in this checkout at one instant",
    "only journals whose window holds a complete selection whose host did not run or pass change, each by that many runs and nothing else; no read throws",
    () => ({
      observed: {
        journals: rows.length,
        changed: changed.map(({ old, current }) => ({ old, current })),
        unadmittedRows: unadmitted,
        npmTestRows: npmRows.length,
      },
      pass:
        rows.every(({ old, current }) => !old.error && !current.error) &&
        changed.every(
          ({ old, current }) =>
            old.startedAt === current.startedAt &&
            old.bound === current.bound &&
            old.state === current.state &&
            old.completeRuns - current.completeRuns ===
              unadmitted.filter(
                (row) => Date.parse(row.startedAt) >= Date.parse(old.startedAt),
              ).length,
        ),
    }),
  );
  const events = readFileSync(
    join(repo, "docs/control/orders/WO-234.jsonl"),
    "utf8",
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const boundaries = journals
    .map((key) => {
      try {
        return JSON.parse(readFileSync(join(directory, `${key}.json`), "utf8"))
          .boundDispatch;
      } catch {
        return null;
      }
    })
    .filter((bound) => bound?.workOrder === "WO-234")
    .map((bound) => {
      const [, type, index] =
        /^WO-\d{3}:(\w+):(-?\d+)$/u.exec(bound.phaseBoundary) ?? [];
      const target = events[Number(index)];
      return {
        intent: bound.intent,
        startedAt: bound.startedAt,
        phaseBoundary: bound.phaseBoundary.replace(/^WO-234:/u, ""),
        indexedType: target?.type ?? null,
        precedesStart:
          Boolean(target) &&
          Date.parse(target.recordedAt) <= Date.parse(bound.startedAt),
        latestBeforeStart:
          Boolean(target) &&
          !events.some(
            (other, at) =>
              at > Number(index) &&
              other.type === type &&
              Date.parse(other.recordedAt) <= Date.parse(bound.startedAt),
          ),
      };
    });
  await check(
    "L2-real-phase-request-index",
    "2",
    "every WO-234 dispatch anchor in this checkout's lane against the order's control log",
    "each stored index names an event of the stored request type, recorded before the dispatch start, with no later request of that type before the start",
    () => ({
      observed: { anchors: boundaries },
      pass:
        boundaries.length > 0 &&
        boundaries.every(
          (row) =>
            row.indexedType === row.phaseBoundary.split(":")[0] &&
            row.precedesStart &&
            row.latestBeforeStart,
        ),
    }),
  );
}

try {
  if (section === "count") await count();
  else if (section === "usage") await usage();
  else if (section === "lane") await lane();
  else throw new Error("usage: verification-003-probe.mjs <count|usage|lane>");
  const failed = results.filter((row) => !row.pass);
  console.log(
    JSON.stringify({
      section,
      checks: results.length,
      failed: failed.map((row) => row.id),
    }),
  );
  process.exitCode = failed.length ? 1 : 0;
} finally {
  for (const root of roots)
    removeTemporaryPath(root, { recursive: true, force: true });
}
