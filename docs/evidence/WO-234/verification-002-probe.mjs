// WO-234 VER-002 independent probe. Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-234/verification-002-probe.mjs <functions|entry|recovery|gate>
// Each section builds synthetic roots under the system temporary directory,
// varies what repair 001's cases held constant and prints one JSON result per
// variation. It writes nothing in the repository.
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
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
import { boundedCommand } from "../../../scripts/lib/bounded-command.mjs";
import {
  dispatchBoundActivity,
  dispatchStanding,
  dispatchStandingLine,
} from "../../../scripts/lib/dispatch-bound.mjs";
import {
  DispatchJournalError,
  boundJournal,
  readDispatchJournal,
} from "../../../packages/skeleton/src/dispatch-journal.mjs";

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
const kit = (source = repo) =>
  JSON.parse(
    readFileSync(join(source, "scripts/kit/budgets.template.json"), "utf8"),
  );
const journalPath = (session) =>
  `docs/control/local/harness/${sha(session)}.json`;
const lanePath = (hex) => `docs/control/local/harness/${hex.repeat(64)}.json`;
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
const thrown = (action) => {
  try {
    const value = action();
    return { threw: false, value };
  } catch (error) {
    return { threw: true, message: String(error?.message ?? error), error };
  }
};
const sessionEnv = () => {
  const env = { ...process.env, CLAUDE_PID: String(process.pid) };
  for (const name of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
    "CLAUDE_PROJECT_DIR",
  ])
    delete env[name];
  return env;
};
const reviewRow = (startedAt) => ({
  checkId: "npm test",
  executed: true,
  gateSelection: "review",
  exitCode: 0,
  treeHash: "a".repeat(40),
  startedAt: iso(startedAt),
  recordedAt: iso(startedAt + MINUTE),
});
const anchor = (startedAt, extra = {}) => ({
  role: "verifier",
  intent: "resume: verify",
  workOrder: "WO-999",
  startedAt: iso(startedAt),
  phaseBoundary: "WO-999:VerificationRequested:-1",
  ...extra,
});
const verifierJournal = (startedAt, extra = {}) => ({
  role: "verifier",
  intent: "resume: verify",
  workOrder: "WO-999",
  startedAt: iso(startedAt),
  startingEventCount: 0,
  reads: [],
  boundDispatch: anchor(startedAt, extra),
});

// The same fixture the harness-fixtures cases build: the source's runtime and
// scripts, an emitted harness and one synthetic order in verification.
async function hookFixture(source, label) {
  const { emitHarness } = await import(
    pathToFileURL(join(source, "scripts/lib/harness.mjs")).href
  );
  const root = fixtureRoot(`dotln-ver234b-${label}-`);
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
  emitHarness(root);
  return root;
}

// Hook and CLI drivers for one fixture root.
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
    return { status: result.status, output };
  };
  const cli = (args, extraEnv = {}) =>
    spawnSync(process.execPath, [join(root, "scripts/harness.mjs"), ...args], {
      cwd: root,
      env: { ...env, ...extraEnv },
      encoding: "utf8",
      timeout: 60_000,
    });
  const journal = (id) => {
    const file = join(root, journalPath(id));
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
  };
  const lastAdvisory = (id) => {
    const file = join(root, journalPath(id).replace(/\.json$/u, ".jsonl"));
    if (!existsSync(file)) return null;
    const rows = readFileSync(file, "utf8").trim().split("\n");
    try {
      return JSON.parse(rows.at(-1)).advisory ?? null;
    } catch {
      return null;
    }
  };
  const tool = (id, tool_name, tool_input) => {
    const result = run("permissions", id, {
      hook_event_name: "PreToolUse",
      tool_name,
      tool_input,
    });
    const denied =
      result.output.hookSpecificOutput?.permissionDecision === "deny";
    return {
      decision: denied
        ? `denied: ${String(result.output.hookSpecificOutput.permissionDecisionReason).slice(0, 160)}`
        : "admitted",
      // The whole recorded advisory; observations shorten it after judging.
      advisory: lastAdvisory(id),
    };
  };
  const enter = (id, prompt = "resume: verify") => {
    const start = run("session", id, {
      hook_event_name: "SessionStart",
      source: "startup",
    });
    const submitted = run("session", id, {
      hook_event_name: "UserPromptSubmit",
      prompt,
    });
    return { start, submitted };
  };
  const stopLine = (id) =>
    String(
      run("finish", id, { hook_event_name: "Stop" }).output.systemMessage ?? "",
    )
      .split("\n")
      .find((line) => line.startsWith("dispatch standing")) ?? null;
  const usage = (id) => {
    const result = cli(["usage", id]);
    let parsed = null;
    try {
      parsed = JSON.parse(result.stdout.trim().split("\n").at(-1));
    } catch {}
    return {
      exitCode: result.status,
      usagePrinted: Boolean(parsed && "usage" in parsed),
      standing: parsed?.standing ?? null,
      stderr: result.stderr
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => line.slice(0, 220)),
    };
  };
  return { run, cli, journal, tool, enter, stopLine, usage };
}

// The base arm is HEAD's scripts with the main checkout's runtime built from the
// same commit, read without modification (VER-001's entry control).
function baseSource() {
  const head = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repo,
    encoding: "utf8",
  }).trim();
  const main = dirname(
    realpathSync(
      resolve(
        repo,
        execFileSync("git", ["rev-parse", "--git-common-dir"], {
          cwd: repo,
          encoding: "utf8",
        }).trim(),
      ),
    ),
  );
  const mainHead = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: main,
    encoding: "utf8",
  }).trim();
  const mainClean =
    execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], {
      cwd: main,
      encoding: "utf8",
    }).trim() === "";
  const mainHost = readFileSync(
    join(main, "packages/skeleton/dist/src/harness-host.js"),
    "utf8",
  );
  const base = fixtureRoot("dotln-ver234b-base-");
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

// Four kinds of present, unreadable dispatch history.
const damageKinds = [
  ["truncated-json", "c", (root, path) => put(root, path, "{ truncated")],
  [
    "invalid-anchor",
    "d",
    (root, path) =>
      put(
        root,
        path,
        JSON.stringify({
          role: "executor",
          intent: "resume: next",
          workOrder: "WO-998",
          startedAt: iso(Date.now() - HOUR),
          boundDispatch: { role: 5 },
        }),
      ),
  ],
  [
    "unreadable-mode",
    "e",
    (root, path) => {
      put(
        root,
        path,
        JSON.stringify({
          role: "executor",
          intent: "resume: next",
          workOrder: "WO-998",
          startedAt: iso(Date.now() - HOUR),
        }),
      );
      chmodSync(join(root, path), 0o000);
    },
  ],
  [
    "directory",
    "f",
    (root, path) => mkdirSync(join(root, path), { recursive: true }),
  ],
];
const repairLane = (root, path) => {
  try {
    chmodSync(join(root, path), 0o700);
  } catch {}
  rmSync(join(root, path), { recursive: true, force: true });
};

async function functions() {
  const root = fixtureRoot("dotln-ver234b-functions-");
  for (const [kind, hex, damage] of damageKinds) {
    const path = lanePath(hex);
    damage(root, path);
    await check(
      `F1-${kind}`,
      2,
      `the shared single-journal reader on ${kind}`,
      "a DispatchJournalError that carries and names the file, with its cause bounded to 160 characters",
      () => {
        const result = thrown(() => readDispatchJournal(join(root, path)));
        const prefix = `Invalid dispatch journal ${join(root, path)}: `;
        return {
          observed: {
            threw: result.threw,
            typed: result.error instanceof DispatchJournalError,
            file: result.error?.file,
            message: result.message?.slice(0, 260),
            causeLength: result.message
              ? result.message.length - prefix.length
              : null,
          },
          pass:
            result.threw &&
            result.error instanceof DispatchJournalError &&
            result.error.file === join(root, path) &&
            result.message.startsWith(prefix) &&
            result.message.length - prefix.length <= 160,
        };
      },
    );
    repairLane(root, path);
  }
  const long = lanePath("0");
  put(root, long, `{"role": "verifier", ${"x".repeat(4000)}`);
  await check(
    "F2-large-journal",
    2,
    "a 4 KB unparseable journal (F1-unreadable-mode exercises the 160-character cut)",
    "the path survives whole and the cause stays within 160 characters",
    () => {
      const result = thrown(() => readDispatchJournal(join(root, long)));
      return {
        observed: {
          length: result.message?.length,
          namesFile: result.message?.includes(long),
          detailLength: result.error?.detail?.length,
        },
        pass:
          result.threw &&
          result.message.includes(join(root, long)) &&
          result.message.length <=
            `Invalid dispatch journal ${join(root, long)}: `.length + 160,
      };
    },
  );
  repairLane(root, long);
  for (const [label, value] of [
    ["empty", ""],
    ["number", 5],
  ])
    await check(
      `F3-marker-${label}`,
      2,
      `an anchor whose unavailable marker is ${label}`,
      "refused as an invalid anchor rather than read as available or unavailable",
      () => {
        const result = thrown(() =>
          boundJournal({
            boundDispatch: anchor(Date.now(), { unavailable: value }),
          }),
        );
        return {
          observed: { threw: result.message ?? false },
          pass:
            result.threw &&
            /Invalid dispatch-bound journal anchor/u.test(result.message),
        };
      },
    );
  // VER-001 F2: the session's own damaged journal, read by the standing itself.
  const own = journalPath("v2-own-journal");
  for (const [label, contents] of [
    ["invalid-json", "{ truncated"],
    [
      "invalid-anchor",
      JSON.stringify({ ...verifierJournal(Date.now()), boundDispatch: {} }),
    ],
  ]) {
    put(root, own, contents);
    await check(
      `F4-own-${label}`,
      2,
      `dispatchStanding for a session whose own journal holds ${label}`,
      "a named unavailable error carrying the session's journal path (VER-001 F2's rule)",
      () => {
        const result = thrown(() =>
          dispatchStanding(root, { session: "v2-own-journal" }),
        );
        return {
          observed: { threw: result.message?.slice(0, 220) ?? false },
          pass:
            result.threw &&
            result.message.includes(own) &&
            result.message.startsWith("Invalid dispatch journal"),
        };
      },
    );
  }
}

async function entry() {
  const { base, provenance } = baseSource();
  const arms = {};
  for (const [arm, source] of [
    ["base", base],
    ["current", repo],
  ]) {
    const root = await hookFixture(source, `entry-${arm}`);
    const budgets = kit(source);
    if (arm === "current")
      Object.assign(budgets.dispatches.verifier, {
        wallClockMs: 8 * HOUR,
        completeRuns: 3,
      });
    put(root, "docs/control/budgets.json", JSON.stringify(budgets));
    const drive = drivers(root);
    const observe = (id, damaged) => {
      const { start, submitted } = drive.enter(id);
      const saved = drive.journal(id);
      const prompt = String(submitted.output.systemMessage ?? "");
      const row = {
        startStatus: start.status,
        promptStatus: submitted.status,
        role: saved?.role ?? null,
        intent: saved?.intent ?? null,
        workOrder: saved?.workOrder ?? null,
        marker: saved?.boundDispatch?.unavailable?.slice(0, 220) ?? null,
        promptAdvisory:
          prompt
            .split("\n")
            .find((line) => line.includes("dispatch standing unavailable"))
            ?.slice(0, 300) ?? null,
        misclassified: /runtime-unavailable|bootstrap/u.test(
          JSON.stringify(submitted.output),
        ),
        systemTempWrite: drive.tool(id, "Write", {
          file_path: join(tmpdir(), "dotln-ver234b-entry-probe.txt"),
          content: "probe",
        }).decision,
        review: drive.tool(id, "Bash", { command: "npm test -- --review" }),
        focused: drive.tool(id, "Bash", {
          command: "npm test -- --only skeleton",
        }).decision,
        bounded: drive.tool(id, "Bash", {
          command: "node scripts/harness.mjs bounded -- node -e 0",
        }),
        agent: drive.tool(id, "Agent", { prompt: "probe" }),
        stopLine: drive.stopLine(id)?.slice(0, 300) ?? null,
        usage: drive.usage(id),
      };
      if (arm === "current") {
        const standing = thrown(() => dispatchStanding(root, { session: id }));
        row.standing = standing.threw
          ? { state: "unavailable", message: standing.message }
          : {
              state: standing.value.state,
              cause: standing.value.cause ?? null,
            };
      }
      row.damaged = damaged ?? null;
      // Judge each diagnostic whole, then keep a readable excerpt.
      const texts = {
        marker: saved?.boundDispatch?.unavailable,
        prompt: row.promptAdvisory,
        review: row.review.advisory,
        bounded: row.bounded.advisory,
        agent: row.agent.advisory,
        stop: row.stopLine,
        standing: row.standing?.message,
      };
      row.namesFile = damaged
        ? Object.fromEntries(
            Object.entries(texts).map(([name, text]) => [
              name,
              typeof text === "string" && text.includes(damaged),
            ]),
          )
        : null;
      for (const part of [row.review, row.bounded, row.agent])
        part.advisory = part.advisory?.slice(-260) ?? null;
      if (row.standing?.message)
        row.standing.message = row.standing.message.slice(0, 260);
      return row;
    };
    const lanes = { clean: observe("v2-entry-clean") };
    for (const [kind, hex, damage] of damageKinds) {
      const path = lanePath(hex);
      damage(root, path);
      lanes[kind] = observe(`v2-entry-${kind}`, path);
      repairLane(root, path);
    }
    arms[arm] = lanes;
  }
  await check(
    "E0-provenance",
    "regression",
    "base arm provenance",
    "HEAD equals the main checkout's clean HEAD, whose runtime has no dispatch binder",
    () => ({ observed: provenance, pass: true }),
  );
  for (const [kind] of damageKinds) {
    const current = arms.current[kind];
    const base = arms.base[kind];
    await check(
      `E1-${kind}`,
      6,
      `prompt entry (resume: verify) beside one ${kind} journal of another order`,
      "the current arm binds role, intent and order and keeps the system-temp grant as base does; the marker, prompt advisory, gate-start advisories, Stop line and standing name the damaged file; the hook admits the complete review with that advisory (D013: the in-process gate refuses it, G1); nothing is classed runtime-unavailable; focused selections stay admitted",
      () => ({
        observed: { base, current },
        pass:
          base.role === "verifier" &&
          base.systemTempWrite === "admitted" &&
          current.role === "verifier" &&
          current.intent === "resume: verify" &&
          current.workOrder === "WO-999" &&
          current.systemTempWrite === "admitted" &&
          !current.misclassified &&
          Object.values(current.namesFile).every(Boolean) &&
          current.review.decision === "admitted" &&
          current.standing.state === "unavailable" &&
          current.focused === "admitted",
      }),
    );
  }
  await check(
    "E2-clean-lane",
    6,
    "the same entry in a clean lane",
    "both arms bind the verifier; the current arm's standing is within, with no marker or advisory",
    () => ({
      observed: { base: arms.base.clean, current: arms.current.clean },
      pass:
        arms.base.clean.role === "verifier" &&
        arms.current.clean.role === "verifier" &&
        arms.current.clean.marker === null &&
        arms.current.clean.standing.state === "within",
    }),
  );
  for (const lane of ["clean", ...damageKinds.map(([kind]) => kind)])
    await check(
      `U1-${lane}`,
      "regression",
      `harness usage <session> for the session dispatched in the ${lane} lane, read while that lane is unchanged`,
      "the usage readback prints its JSON and exits 0 in both arms, as main's does; the current arm also reports the standing",
      () => ({
        observed: {
          base: arms.base[lane].usage,
          current: arms.current[lane].usage,
        },
        pass:
          arms.base[lane].usage.exitCode === 0 &&
          arms.base[lane].usage.usagePrinted &&
          arms.current[lane].usage.exitCode === 0 &&
          arms.current[lane].usage.usagePrinted,
      }),
    );
}

async function recovery() {
  const { recordCodexDispatch } = await import(
    pathToFileURL(join(repo, "packages/skeleton/dist/src/harness-host.js")).href
  );
  const now = Date.now();
  const setBudgets = (root, verifier) => {
    const budgets = kit();
    Object.assign(budgets.dispatches.verifier, verifier);
    put(root, "docs/control/budgets.json", JSON.stringify(budgets));
  };
  const setRows = (root, starts) =>
    put(
      root,
      "docs/control/local/harness/checks.json",
      JSON.stringify(starts.map(reviewRow)),
    );
  // An earlier same-phase verifier dispatch A consumed two complete runs; its
  // journal is then damaged, and a new dispatch B enters beside it.
  const prepare = async (label) => {
    const root = await hookFixture(repo, label);
    setBudgets(root, { wallClockMs: 3 * HOUR, completeRuns: 3 });
    const aStart = now - 2 * HOUR;
    const pathA = journalPath(`v2-${label}-A`);
    const bytesA = JSON.stringify(verifierJournal(aStart));
    put(root, pathA, bytesA);
    setRows(root, [aStart + 10 * MINUTE, aStart + 40 * MINUTE]);
    put(root, pathA, "{ truncated");
    const drive = drivers(root);
    const idB = `v2-${label}-B`;
    drive.enter(idB);
    return { root, drive, aStart, pathA, bytesA, idB };
  };
  {
    const { root, drive, aStart, pathA, bytesA, idB } =
      await prepare("restore");
    const marked = drive.journal(idB);
    const damaged = thrown(() => dispatchStanding(root, { session: idB }));
    const damagedStop = drive.stopLine(idB);
    await check(
      "R1-marked-while-damaged",
      2,
      "dispatch B enters while the phase's earlier anchor A is damaged",
      "B binds the verifier with a fresh provisional start and a marker naming A; its standing is a named unavailable error, never unset or computed from the provisional start",
      () => ({
        observed: {
          role: marked.role,
          provisionalStart: marked.boundDispatch.startedAt > iso(aStart),
          marker: marked.boundDispatch.unavailable,
          standing: damaged.threw
            ? damaged.message.slice(0, 220)
            : damaged.value,
          stopLine: damagedStop,
        },
        pass:
          marked.role === "verifier" &&
          marked.boundDispatch.unavailable.includes(pathA) &&
          damaged.threw &&
          damaged.message.includes(pathA) &&
          /dispatch standing: unavailable/u.test(damagedStop ?? ""),
      }),
    );
    put(root, pathA, bytesA);
    const restored = dispatchStanding(root, { session: idB });
    const restoredStop = drive.stopLine(idB);
    const after = drive.journal(idB);
    await check(
      "R2-restored-history",
      2,
      "A's bytes are restored while B is still running",
      "B's standing reads A's original start and A's two consumed runs (within 3 h 0 min and 3 runs); A's bytes and B's stored anchor stay unchanged",
      () => ({
        observed: {
          startedAt: restored.startedAt === iso(aStart),
          elapsedAtLeastTwoHours: restored.elapsedMs >= 2 * HOUR,
          completeRuns: restored.completeRuns,
          bound: restored.bound,
          state: restored.state,
          stopLine: restoredStop,
          aUnchanged: readFileSync(join(root, pathA), "utf8") === bytesA,
          bAnchorUnchanged:
            JSON.stringify(after.boundDispatch) ===
            JSON.stringify(marked.boundDispatch),
        },
        pass:
          restored.startedAt === iso(aStart) &&
          restored.elapsedMs >= 2 * HOUR &&
          restored.completeRuns === 2 &&
          restored.state === "within" &&
          /complete runs 2 of 3; within/u.test(restoredStop ?? "") &&
          readFileSync(join(root, pathA), "utf8") === bytesA &&
          JSON.stringify(after.boundDispatch) ===
            JSON.stringify(marked.boundDispatch),
      }),
    );
    setRows(root, [
      aStart + 10 * MINUTE,
      aStart + 40 * MINUTE,
      now - 5 * MINUTE,
    ]);
    const runsOut = dispatchStanding(root, { session: idB });
    const refusal = drive.tool(idB, "Bash", {
      command: "npm test -- --review",
    });
    const focused = drive.tool(idB, "Bash", {
      command: "npm test -- --only skeleton",
    });
    setBudgets(root, { wallClockMs: HOUR, completeRuns: 9 });
    const wallOut = dispatchStanding(root, { session: idB });
    await check(
      "R3-recovered-bound-binds",
      "2, 6",
      "after recovery, a third complete run, then a 1 h 0 min wall clock",
      "the third run exhausts the run bound counted from A and the hook refuses a complete review while a focused selection is admitted; the wall clock is exceeded from A's start, not B's",
      () => ({
        observed: {
          runs: { state: runsOut.state, exceeded: runsOut.exceeded },
          review: refusal.decision.slice(0, 120),
          focused: focused.decision,
          wall: {
            state: wallOut.state,
            exceeded: wallOut.exceeded.map(({ metric }) => metric),
          },
        },
        pass:
          runsOut.state === "exceeded" &&
          runsOut.exceeded.some(
            ({ metric, value }) => metric === "completeRuns" && value === 3,
          ) &&
          /^denied: DOTLN_DISPATCH_BOUND/u.test(refusal.decision) &&
          focused.decision === "admitted" &&
          wallOut.exceeded.some(
            ({ metric, value }) =>
              metric === "wallClockMs" && value >= 2 * HOUR,
          ),
      }),
    );
    // Planning reads the lifecycle record: a completion after B's start.
    const events = [
      {
        type: "WorkOrderActivated",
        workOrderId: "WO-999",
        recordedAt: iso(now - 4 * HOUR),
      },
      {
        type: "VerificationCompleted",
        workOrderId: "WO-999",
        recordedAt: iso(now + MINUTE),
      },
    ];
    const idC = "v2-restore-C";
    put(
      root,
      journalPath(idC),
      JSON.stringify(verifierJournal(now - 30 * MINUTE)),
    );
    const markedAfter = thrown(() =>
      dispatchStanding(root, { session: idB, events, now: now + 2 * MINUTE }),
    );
    const plainAfter = thrown(() =>
      dispatchStanding(root, { session: idC, events, now: now + 2 * MINUTE }),
    );
    await check(
      "R4-after-phase-completion",
      "follow-up",
      "the phase completes after B's start while A is already restored; B (marked) and C (unmarked) read their standing",
      "both standings are computed from readable history, or the marked one names a file that is still damaged",
      () => ({
        observed: {
          marked: markedAfter.threw
            ? { threw: markedAfter.message.slice(0, 220) }
            : { state: markedAfter.value.state },
          unmarked: plainAfter.threw
            ? { threw: plainAfter.message.slice(0, 220) }
            : { state: plainAfter.value.state },
          namedFileReadable: readFileSync(join(root, pathA), "utf8") === bytesA,
        },
        pass: !markedAfter.threw && !plainAfter.threw,
      }),
    );
  }
  {
    const { root, drive, pathA, idB } = await prepare("deletion");
    const marked = drive.journal(idB);
    rmSync(join(root, pathA));
    const standing = dispatchStanding(root, { session: idB });
    await check(
      "R5-history-deleted",
      "observation",
      "the damaged anchor A is deleted rather than restored",
      "absent history reads as absent (D013): B's standing starts at its own provisional anchor and no longer counts A's runs",
      () => ({
        observed: {
          startedAt: standing.startedAt === marked.boundDispatch.startedAt,
          completeRuns: standing.completeRuns,
          state: standing.state,
        },
        pass:
          standing.startedAt === marked.boundDispatch.startedAt &&
          standing.completeRuns === 0 &&
          standing.state === "within",
      }),
    );
  }
  {
    const root = await hookFixture(repo, "codex");
    setBudgets(root, { wallClockMs: 3 * HOUR, completeRuns: 3 });
    const id = "v2-codex-reentry";
    const start = now - 2 * HOUR;
    put(root, journalPath(id), JSON.stringify(verifierJournal(start)));
    const damaged = lanePath("9");
    put(root, damaged, "{ truncated");
    const child = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `const m = await import(${JSON.stringify(pathToFileURL(join(repo, "packages/skeleton/dist/src/harness-host.js")).href)}); m.recordCodexDispatch(process.argv[1], process.argv[2], "verify", "WO-999");`,
        root,
        id,
      ],
      { cwd: root, env: sessionEnv(), encoding: "utf8", timeout: 60_000 },
    );
    const saved = drivers(root).journal(id);
    const during = thrown(() => dispatchStanding(root, { session: id }));
    rmSync(join(root, damaged));
    const repaired = dispatchStanding(root, { session: id });
    await check(
      "R6-codex-reentry",
      "2, 6",
      "a Codex re-entry of an already-anchored verifier dispatch beside a damaged unrelated journal, through a child process",
      "the re-entry keeps its role and its earlier anchor, stores a marker, prints an advisory naming the file and reads unavailable; after the unrelated file is removed it reads from the earlier anchor",
      () => ({
        observed: {
          exitCode: child.status,
          stderr: child.stderr.trim().slice(0, 260),
          role: saved.role,
          keptAnchor: saved.boundDispatch.startedAt === iso(start),
          marker: saved.boundDispatch.unavailable?.slice(0, 200),
          during: during.threw ? during.message.slice(0, 200) : during.value,
          repaired: {
            startedAt: repaired.startedAt === iso(start),
            state: repaired.state,
          },
        },
        pass:
          child.status === 0 &&
          child.stderr.includes(damaged) &&
          saved.role === "verifier" &&
          saved.boundDispatch.startedAt === iso(start) &&
          saved.boundDispatch.unavailable.includes(damaged) &&
          during.threw &&
          during.message.includes(damaged) &&
          repaired.startedAt === iso(start) &&
          repaired.state === "within",
      }),
    );
    const beginId = "v2-cli-begin";
    put(root, damaged, "{ truncated");
    const begun = drivers(root).cli(["begin", beginId, "verifier"]);
    const begunJournal = drivers(root).journal(beginId);
    await check(
      "R7-cli-begin",
      6,
      "node scripts/harness.mjs begin <session> verifier from the command line beside a damaged journal",
      "exit 0; the journal binds the verifier with a marker; stderr names the damaged file",
      () => ({
        observed: {
          exitCode: begun.status,
          stderr: begun.stderr.trim().slice(0, 260),
          role: begunJournal?.role ?? null,
          marker: begunJournal?.boundDispatch?.unavailable?.slice(0, 200),
        },
        pass:
          begun.status === 0 &&
          begun.stderr.includes(damaged) &&
          begunJournal?.role === "verifier" &&
          begunJournal.boundDispatch.unavailable.includes(damaged),
      }),
    );
  }
}

async function gate() {
  const { runGate } = await import("../../../scripts/test-runner.mjs");
  const { readGateChecks } =
    await import("../../../scripts/lib/gate-evidence.mjs");
  const { operationalFailures, failureWindow } =
    await import("../../../scripts/lib/plan-failures.mjs");
  const options = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  const session = "probe-gate-v2";
  const build = (limits, journal, level = "normal") => {
    const root = fixtureRoot("dotln-ver234b-gate-");
    runGit(root, ["init", "-b", "main"], options);
    excludeFixtureOwnership(root);
    put(root, ".gitignore", "docs/control/local/\nran.txt\n");
    put(
      root,
      "scripts/host.mjs",
      `import {checkHost} from ${JSON.stringify(pathToFileURL(join(repo, "scripts/structural-checks.mjs")).href)};
const sample={level:${JSON.stringify(level)},pressure:0,swapBytes:0,physicalBytes:2**36,source:"probe"};
const result=checkHost(sample,{limits:{taskBytes:2**30,hostLanes:8},requiredPeakBytes:0,fileEvents:{}});
console.log("STRUCTURAL_RESULT "+JSON.stringify(result)); process.exitCode=result.exitCode;`,
    );
    const budgets = kit();
    Object.assign(budgets.dispatches.verifier, limits);
    put(root, "docs/control/budgets.json", JSON.stringify(budgets));
    put(root, journalPath(session), JSON.stringify(journal));
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
        "commit",
        "-qm",
        "probe",
      ],
      options,
    );
    return root;
  };
  const table = [
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
      command: [
        process.execPath,
        "-e",
        'require("fs").writeFileSync("ran.txt","yes")',
      ],
      product: true,
    },
  ];
  const saved = Object.fromEntries(
    [
      "CODEX_THREAD_ID",
      "COPILOT_AGENT_SESSION_ID",
      "CLAUDE_CODE_SESSION_ID",
      "CLAUDE_SESSION_ID",
    ].map((name) => [name, process.env[name]]),
  );
  for (const name of Object.keys(saved)) delete process.env[name];
  process.env.CLAUDE_CODE_SESSION_ID = session;
  // A failed case keeps its output in an addressed log beside the rows.
  const hostOutput = (root) => {
    const host = readGateChecks(root)
      .filter((row) => row.checkId === "npm test")
      .at(-1)
      ?.cases?.find((entry) => entry.name === "host");
    const text =
      host?.output ??
      (host?.outputRef && existsSync(join(root, host.outputRef))
        ? readFileSync(join(root, host.outputRef), "utf8")
        : "");
    return text.slice(0, 300);
  };
  const rowFields = (row) =>
    row && {
      gateSelection: row.gateSelection,
      executed: row.executed,
      exitCode: row.exitCode,
      boundStop: row.boundStop ?? null,
    };
  try {
    {
      const damaged = lanePath("c");
      const root = build(
        { wallClockMs: 8 * HOUR, completeRuns: 3 },
        verifierJournal(Date.now(), {
          unavailable: `Invalid dispatch journal ${damaged}: Expected property name or '}' in JSON at position 2 (line 1 column 3)`,
        }),
      );
      put(root, damaged, "{ truncated");
      const refused = await runGate(["--review", "--serial", "--again"], root, {
        table,
      });
      const refusedRow = readGateChecks(root)
        .filter((row) => row.checkId === "npm test")
        .at(-1);
      const refusedHost = hostOutput(root);
      const ranWhileDamaged = existsSync(join(root, "ran.txt"));
      const focused = await runGate(["--only", "alpha", "--serial"], root, {
        table,
      });
      const focusedRan = existsSync(join(root, "ran.txt"));
      rmSync(join(root, "ran.txt"), { force: true });
      rmSync(join(root, damaged));
      const admitted = await runGate(
        ["--review", "--serial", "--again"],
        root,
        { table },
      );
      const after = dispatchStanding(root, { session });
      await check(
        "G1-runner-damaged-lane",
        3,
        "the real runner for a verifier dispatched beside a damaged journal: --review, then --only alpha, then --review after the file is removed",
        "the complete review is refused at host with Dispatch standing unavailable naming the file, alpha never runs and no bound stop is recorded; the focused selection runs; once the lane is readable the review is admitted",
        () => ({
          observed: {
            refusedExit: refused.exitCode,
            refusedHost,
            refusedRow: rowFields(refusedRow),
            ranWhileDamaged,
            focusedExit: focused.exitCode,
            focusedRan,
            admittedExit: admitted.exitCode,
            admittedRan: existsSync(join(root, "ran.txt")),
            afterState: after.state,
          },
          pass:
            refused.exitCode === 1 &&
            /^Dispatch standing unavailable: Invalid dispatch journal/u.test(
              refusedHost,
            ) &&
            refusedHost.includes(damaged) &&
            !refusedRow?.boundStop &&
            !ranWhileDamaged &&
            focused.exitCode === 0 &&
            focusedRan &&
            admitted.exitCode === 0 &&
            existsSync(join(root, "ran.txt")) &&
            after.state === "within",
        }),
      );
      const memory = build(
        { wallClockMs: 8 * HOUR, completeRuns: 3 },
        verifierJournal(Date.now()),
        "critical",
      );
      const pressured = await runGate(
        ["--review", "--serial", "--again"],
        memory,
        { table },
      );
      const pressuredRow = readGateChecks(memory)
        .filter((row) => row.checkId === "npm test")
        .at(-1);
      const pressuredStanding = dispatchStanding(memory, { session });
      await check(
        "G3-refused-selection-consumption",
        "2, 10",
        "complete reviews refused at host admission (G1's unavailable standing; a critical memory sample), then the standing's run count",
        "product 07: failed and interrupted admitted complete selections consume a run; a selection refused at host admission, whose product suites never start, consumes none (G1 counts 1, the memory fixture 0)",
        () => ({
          observed: {
            unavailableLane: {
              refusedRow: rowFields(refusedRow),
              admittedReviews: 1,
              completeRuns: after.completeRuns,
            },
            memoryPressure: {
              exitCode: pressured.exitCode,
              host: hostOutput(memory).slice(0, 120),
              row: rowFields(pressuredRow),
              alphaRan: existsSync(join(memory, "ran.txt")),
              completeRuns: pressuredStanding.completeRuns,
              standing: dispatchStandingLine(pressuredStanding),
            },
          },
          pass:
            after.completeRuns === 1 && pressuredStanding.completeRuns === 0,
        }),
      );
    }
    {
      const root = build(
        { wallClockMs: 0, completeRuns: 0 },
        verifierJournal(Date.now() - MINUTE),
      );
      const stopped = await runGate(
        ["--review", "--serial", "--again", "--keep-going"],
        root,
        { table },
      );
      const row = readGateChecks(root)
        .filter((entry) => entry.checkId === "npm test")
        .at(-1);
      const logPath = join(
        root,
        journalPath(session).replace(/\.json$/u, ".jsonl"),
      );
      const log = readFileSync(logPath, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      const activity = dispatchBoundActivity(
        [],
        log.map((entry) => ({
          ...entry.boundStop,
          at: entry.at,
          workOrder: entry.workOrder,
          role: entry.role,
        })),
      );
      // An older single-metric stop beside the new one stays readable.
      writeFileSync(
        logPath,
        `${readFileSync(logPath, "utf8")}${JSON.stringify({
          at: iso(Date.now() - 30 * MINUTE),
          workOrder: "WO-999",
          role: "verifier",
          phase: "verifying",
          source: "probe-legacy",
          boundStop: { metric: "completeRuns", value: 3, bound: 3 },
          dispatchStartedAt: iso(Date.now() - HOUR),
        })}\n`,
      );
      const planning = operationalFailures(
        root,
        { eventSegments: new Map(), orders: new Map() },
        failureWindow(root, { all: true }).includes,
      );
      await check(
        "G2-runner-both-bounds",
        7,
        "the real runner under --keep-going with both verifier bounds exhausted, then planning beside an older single-metric stop",
        "one gate refusal whose row and single log row carry both measurements with the first metric's legacy fields; the activity counts one stop; planning lists two stops, one with both measurements and one legacy",
        () => ({
          observed: {
            exitCode: stopped.exitCode,
            rowBoundStop: row?.boundStop,
            logRows: log.length,
            logSource: log[0]?.source,
            logExceeded: log[0]?.boundStop?.exceeded?.map(
              ({ metric }) => metric,
            ),
            activityCount: activity.boundStops.count,
            afterStopExceeded: activity.afterStop[0]?.exceeded?.length,
            planningCount: planning.boundStops?.count,
            planningStops: planning.boundStops?.stops?.map((stop) => ({
              metric: stop.metric,
              exceeded: stop.exceeded?.map(({ metric }) => metric) ?? null,
              source: stop.source,
            })),
          },
          pass:
            stopped.exitCode === 1 &&
            row?.boundStop?.metric === "wallClockMs" &&
            row.boundStop.exceeded?.length === 2 &&
            log.length === 1 &&
            log[0].source === "gate" &&
            log[0].boundStop.exceeded?.length === 2 &&
            activity.boundStops.count === 1 &&
            activity.afterStop[0]?.exceeded?.length === 2 &&
            planning.boundStops?.count === 2 &&
            planning.boundStops.stops.some(
              (stop) => stop.exceeded?.length === 2,
            ) &&
            planning.boundStops.stops.some(
              (stop) => stop.metric === "completeRuns" && !stop.exceeded,
            ),
        }),
      );
    }
    {
      // The bounded wrapper for a dispatch bound beside a damaged journal.
      const wrapper = fixtureRoot("dotln-ver234b-wrapper-");
      const damaged = lanePath("d");
      put(
        wrapper,
        "docs/control/budgets.json",
        JSON.stringify(
          (() => {
            const budgets = kit();
            Object.assign(budgets.dispatches.verifier, {
              wallClockMs: 8 * HOUR,
              completeRuns: 3,
            });
            return budgets;
          })(),
        ),
      );
      put(
        wrapper,
        journalPath(session),
        JSON.stringify(
          verifierJournal(Date.now(), {
            unavailable: `Invalid dispatch journal ${damaged}: Expected property name or '}' in JSON at position 2 (line 1 column 3)`,
          }),
        ),
      );
      put(wrapper, damaged, "{ truncated");
      put(
        wrapper,
        "package.json",
        JSON.stringify({
          private: true,
          scripts: { test: "node diagnostic.mjs" },
        }),
      );
      put(
        wrapper,
        "diagnostic.mjs",
        'import { writeFileSync } from "node:fs";\nwriteFileSync("diagnostic-ran", process.argv.slice(2).join(" "));\n',
      );
      let refusal = null;
      try {
        await boundedCommand(
          [
            "--",
            process.execPath,
            "-e",
            "require('fs').writeFileSync('probe-ran','1')",
          ],
          wrapper,
          { cwd: wrapper, report: () => {}, output: () => {} },
        );
      } catch (error) {
        refusal = String(error.message);
      }
      const probeRan = existsSync(join(wrapper, "probe-ran"));
      const focused = await boundedCommand(
        ["--", "npm", "test", "--", "--only", "alpha"],
        wrapper,
        { cwd: wrapper, report: () => {}, output: () => {} },
      );
      await check(
        "W1-wrapper-damaged-lane",
        4,
        "harness bounded for a verifier bound beside a damaged journal: a probe, then npm test -- --only alpha",
        "the probe is refused before launch with the read error naming the file (D013); the focused selection runs",
        () => ({
          observed: {
            refusal: refusal?.slice(0, 220) ?? null,
            probeRan,
            focusedExit: focused.exitCode,
            focusedRan: existsSync(join(wrapper, "diagnostic-ran")),
          },
          pass:
            typeof refusal === "string" &&
            refusal.includes(damaged) &&
            !probeRan &&
            focused.exitCode === 0 &&
            existsSync(join(wrapper, "diagnostic-ran")),
        }),
      );
    }
  } finally {
    for (const [name, value] of Object.entries(saved))
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
  }
}

try {
  if (section === "functions") await functions();
  else if (section === "entry") await entry();
  else if (section === "recovery") await recovery();
  else if (section === "gate") await gate();
  else
    throw new Error(
      "usage: verification-002-probe.mjs <functions|entry|recovery|gate>",
    );
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
  for (const root of roots) {
    for (const hex of ["e"])
      try {
        chmodSync(join(root, lanePath(hex)), 0o700);
      } catch {}
    removeTemporaryPath(root, { recursive: true, force: true });
  }
}
