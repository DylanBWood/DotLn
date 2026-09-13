import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  observedSpawnSync as spawnSync,
  observedSpawn as spawn,
} from "../packages/skeleton/src/gate-deadlines.mjs";
import {
  deadlineLimit,
  startDeadline,
} from "../packages/skeleton/src/gate-deadlines.mjs";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  compileFeedbackUnits,
  applyFeedbackCorrection,
  compileLoadout,
  seiriLoadout,
} from "../packages/compiler/dist/src/index.js";
import { contributorProgram } from "../packages/skeleton/dist/src/loadouts/contributor.js";
import {
  personalFeedbackUnits,
  retainedFeedbackUnitsV1,
} from "../packages/skeleton/dist/src/loadouts/feedback.js";
import { entropyReducerLoadout } from "../packages/skeleton/dist/src/loadouts/entropy-reducer.js";
import {
  feedbackBoundary,
  FeedbackRefused,
} from "../packages/skeleton/dist/src/feedback-boundary.js";
import {
  beginHarnessSession,
  harnessOutputObligations,
  harnessControl,
  harnessFeedbackFacts,
  harnessHostProcess,
  harnessOutputs,
  harnessProcessAlive,
  evaluateHarnessHook,
  readHarnessOutput,
  releaseHarnessWriter,
  runHarnessEvidence,
  seedHarnessWriter,
} from "../packages/skeleton/dist/src/harness-host.js";
import {
  checkHarness,
  emitHarness,
  harnessInstallation,
} from "./lib/harness.mjs";
import { termsCheck } from "./terms.mjs";
import {
  compareObservedReads,
  countReads,
  directedReads,
  scopeReadEvidence,
} from "./lib/harness-context.mjs";
import {
  checkContextMeasurement,
  measureHarnessContext,
} from "./harness-context.mjs";
import { activeGateRuns, gateTreeHash } from "./lib/gate-evidence.mjs";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
// Fixtures own the harness-process identity: generated hooks record this test
// process as the live reservation owner, and an outer session's declared
// process cannot leak into fixture state.
process.env.CLAUDE_PID = String(process.pid);
const git = (root, ...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const write = (root, path, contents) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), contents);
};
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const control = {
  workOrder: "WO-999",
  workOrderPath: "docs/work-orders/WO-999-fixture.md",
  phase: "active",
  latestVerdict: null,
};
function fixture() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-harness-test-")));
  git(root, "init", "-b", "wo-999");
  assert.equal(realpathSync(git(root, "rev-parse", "--show-toplevel")), root);
  for (const name of ["compiler", "skeleton", "kernel"]) {
    cpSync(
      join(sourceRoot, `packages/${name}/dist/src`),
      join(root, `packages/${name}/dist/src`),
      { recursive: true },
    );
    cpSync(
      join(sourceRoot, `packages/${name}/package.json`),
      join(root, `packages/${name}/package.json`),
    );
    mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
    symlinkSync(
      `../../packages/${name}`,
      join(root, `node_modules/@dotln/${name}`),
    );
  }
  symlinkSync(
    join(sourceRoot, "node_modules/typescript"),
    join(root, "node_modules/typescript"),
  );
  write(root, ".gitignore", "node_modules/\n**/dist/\ndocs/control/local/\n");
  write(
    root,
    "CLAUDE.md",
    "# Fixture locked floor\nKeep fixture source isolated.\n",
  );
  write(root, "fixture.ts", "export const value = 1;\n");
  write(
    root,
    "package.json",
    json({
      private: true,
      scripts: {
        test: "node fixture-check.mjs",
        "test:full": "node fixture-check.mjs",
      },
    }),
  );
  write(
    root,
    "fixture-check.mjs",
    'import assert from "node:assert/strict"; import {readFileSync} from "node:fs"; assert.match(readFileSync("fixture.ts", "utf8"), /value = 1/);\n',
  );
  write(
    root,
    "scripts/resume.mjs",
    'import {readFileSync} from "node:fs"; console.log(readFileSync("docs/control/fixture-status.json", "utf8"));\n',
  );
  for (const path of [
    "scripts/harness.mjs",
    "scripts/lib/harness.mjs",
    "scripts/lib/terms.mjs",
    "scripts/lib/paths.mjs",
  ]) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(sourceRoot, path), join(root, path));
  }
  write(root, "docs/control/fixture-status.json", json(control));
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    json({ type: "WorkOrderActivated", workOrderId: "WO-999" }).replace(
      /\n\s*/g,
      "",
    ) + "\n",
  );
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# Synthetic work order\nRead fixture.ts and run npm test.\n",
  );
  git(root, "add", ".");
  git(
    root,
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-m",
    "Create fixture",
  );
  emitHarness(root);
  return root;
}
const input = (root, event, extra = {}) => ({
  cwd: root,
  session_id: "synthetic-session",
  hook_event_name: event,
  ...extra,
});
const stopUnits = new Set([
  "verify-app-before-done",
  "no-partial-completion",
  "read-your-own-output",
]);
const hookName = (name) => (stopUnits.has(name) ? "finish" : name);
const configFor = (root, name) => {
  const config = JSON.parse(
    readFileSync(
      join(root, `.claude/hooks/${hookName(name)}.mjs`),
      "utf8",
    ).match(/await runHarnessHook\(([\s\S]*), feedbackBoundary\);/)[1],
  );
  if (stopUnits.has(name)) {
    config.kind = "feedback";
    config.policy = compileFeedbackUnits(
      config.policy.units.filter((unit) => unit.unitId === name),
    );
  }
  return config;
};
function invoke(root, name, payload, removed = false) {
  let path = join(root, `.claude/hooks/${hookName(name)}.mjs`);
  if (removed) {
    const source = readFileSync(path, "utf8");
    const config = configFor(root, name);
    config.policy = compileFeedbackUnits([]);
    path = join(root, ".claude/hooks/fixture-removed.mjs");
    writeFileSync(
      path,
      source.replace(
        /await runHarnessHook\([\s\S]*, feedbackBoundary\);/,
        `await runHarnessHook(${json(config).trim()}, feedbackBoundary);`,
      ),
    );
  }
  const run = spawnSync(process.execPath, [path], {
    cwd: root,
    input: JSON.stringify(payload),
    encoding: "utf8",
    timeout: deadlineLimit(1000, 20_000),
  });
  assert.equal(
    run.status,
    0,
    JSON.stringify({
      hook: name,
      inputBytes: Buffer.byteLength(JSON.stringify(payload)),
      path: payload.tool_input?.file_path?.replace(root, "<fixture>"),
      error: run.error?.code,
      signal: run.signal,
      stderr: run.stderr,
    }),
  );
  return JSON.parse(run.stdout);
}
const allowed = (result) =>
  result.decision !== "block" &&
  result.hookSpecificOutput?.permissionDecision !== "deny";

for (const mode of ["runner", "evidence", "entry"])
  test(
    `WO-125 F3 ${mode} refuses generated-hook writes throughout the gate and releases on exit`,
    { timeout: 300000 },
    async (t) => {
      const testDeadline = startDeadline("harness:gate-guard-test", 300000);
      t.signal.addEventListener("abort", () => testDeadline.finish(true), {
        once: true,
      });
      t.after(() => testDeadline.finish());
      const root = fixture();
      const local = "docs/control/local";
      let child;
      let finished;
      const release = () => {
        for (const stage of ["build", "checks"])
          write(root, `${local}/${stage}.go`, "go");
        if (child && child.exitCode === null) child.kill("SIGTERM");
      };
      t.signal.addEventListener("abort", release, { once: true });
      try {
        write(
          root,
          ".gitignore",
          readFileSync(join(root, ".gitignore"), "utf8") +
            "\nscratch/*\n!scratch/protected.txt\n",
        );
        write(root, "scratch/protected.txt", "protected by ignore exception\n");
        write(root, `nested/${local}/scratch.txt`, "protected in nested cwd\n");
        write(
          root,
          "nested/scripts/harness.mjs",
          'import {writeFileSync} from "node:fs"; writeFileSync("../fixture.ts", "changed\\n");\n',
        );
        write(root, `${local}/tracked.ts`, "tracked despite ignore\n");
        git(root, "add", "-f", `${local}/tracked.ts`);
        symlinkSync(
          join(root, "fixture.ts"),
          join(root, local, "input-link.ts"),
        );
        symlinkSync("../../../new-input.md", join(root, local, "dangling.md"));
        symlinkSync("dangling.md", join(root, local, "chained.md"));
        symlinkSync("../../../packages/skeleton", join(root, local, "dirlink"));
        symlinkSync("new-scratch.md", join(root, local, "scratch-link.md"));
        linkSync(join(root, "fixture.ts"), join(root, local, "hardlink.ts"));
        const packageScripts = JSON.parse(
          readFileSync(join(sourceRoot, "package.json")),
        ).scripts;
        write(
          root,
          "package.json",
          json({
            scripts: {
              "format:check": "node hold-gate.mjs checks",
              "test:full": "node hold-gate.mjs checks",
              build: "node hold-gate.mjs build",
              harness: packageScripts.harness,
            },
          }),
        );
        write(
          root,
          "hold-gate.mjs",
          `import {existsSync, writeFileSync} from "node:fs";
import {setTimeout} from "node:timers/promises";
import {activeGateRuns} from "./packages/skeleton/dist/src/gate-evidence.mjs";
const stage = process.argv[2];
if (!activeGateRuns(process.cwd()).length) throw new Error("gate marker missing in " + stage);
writeFileSync("${local}/" + stage + ".ready", "ready");
while (!existsSync("${local}/" + stage + ".go")) {
  await setTimeout(10);
}
`,
        );
        if (mode === "entry") {
          cpSync(
            join(sourceRoot, "scripts/harness-entry.mjs"),
            join(root, "scripts/harness-entry.mjs"),
          );
          write(
            root,
            "scripts/lib/gate-evidence.mjs",
            'export * from "../../packages/skeleton/dist/src/gate-evidence.mjs";\n',
          );
          write(
            root,
            "scripts/harness.mjs",
            'process.argv[2] = "checks"; await import("../hold-gate.mjs");\n',
          );
        }
        const program =
          mode === "runner"
            ? `const {runGate} = await import(${JSON.stringify(new URL("./test-runner.mjs", import.meta.url).href)}); process.exitCode = (await runGate(["--only", "format"], process.cwd())).exitCode;`
            : 'const {runHarnessEvidence} = await import("./packages/skeleton/dist/src/harness-host.js"); const checks = runHarnessEvidence(process.cwd()); if (checks.some(row => row.exitCode !== 0)) process.exitCode = 1;';
        const before = gateTreeHash(root);
        child =
          mode === "entry"
            ? spawn("npm", ["run", "harness", "--", "evidence"], {
                cwd: root,
                stdio: ["ignore", "pipe", "pipe"],
              })
            : spawn(process.execPath, ["--input-type=module", "-e", program], {
                cwd: root,
                stdio: ["ignore", "pipe", "pipe"],
              });
        let output = "";
        child.stdout.on("data", (chunk) => {
          output += chunk;
        });
        child.stderr.on("data", (chunk) => {
          output += chunk;
        });
        finished = new Promise((resolve, reject) => {
          child.once("error", reject);
          child.once("close", (code) => resolve(code));
        });
        for (const stage of mode === "entry"
          ? ["build", "checks"]
          : ["checks"]) {
          while (!existsSync(join(root, local, `${stage}.ready`))) {
            t.signal.throwIfAborted();
            assert.equal(child.exitCode, null, output);
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
          const runs = activeGateRuns(root);
          assert.ok(runs.length > 0);
          const pathAttempts = [
            `${local}/hardlink.ts`,
            `${local}/dangling.md`,
            `${local}/chained.md`,
            `${local}/dirlink/../probe-new.md`,
            ...(existsSync(join(root, "NODE_MODULES"))
              ? [
                  "NODE_MODULES/probe.js",
                  "Packages/skeleton/dist/probe.js",
                  "packages/skeleton/DIST/probe.js",
                ]
              : []),
          ].flatMap((path) => [
            {
              tool_name: "Write",
              tool_input: { file_path: path, content: "changed\n" },
            },
            {
              tool_name: "Bash",
              tool_input: { command: `printf changed > ${path}` },
            },
            { tool_name: "Bash", tool_input: { command: `touch ${path}` } },
          ]);
          const attempts = [
            {
              tool_name: "Write",
              tool_input: {
                file_path: join(root, "fixture.ts"),
                content: "changed\n",
              },
            },
            {
              tool_name: "Edit",
              tool_input: {
                file_path: join(root, "fixture.ts"),
                old_string: "1",
                new_string: "2",
              },
            },
            {
              tool_name: "Bash",
              tool_input: { command: "printf changed > fixture.ts" },
            },
            {
              tool_name: "Bash",
              tool_input: { command: "git status --short && touch fixture.ts" },
            },
            {
              tool_name: "exec_command",
              tool_input: { command: "touch fixture.ts" },
            },
            {
              tool_name: "apply_patch",
              tool_input: { patch: "opaque write adapter" },
            },
            {
              tool_name: "Write",
              tool_input: {
                file_path: `${local}/tracked.ts`,
                content: "changed\n",
              },
            },
            {
              tool_name: "Write",
              tool_input: {
                file_path: `${local}/input-link.ts`,
                content: "changed\n",
              },
            },
            {
              tool_name: "Write",
              tool_input: {
                file_path: "packages/skeleton/dist/new-input.js",
                content: "changed\n",
              },
            },
            {
              tool_name: "Bash",
              tool_input: {
                command: `printf scratch > ${local}/scratch.txt && touch fixture.ts`,
              },
            },
            {
              tool_name: "Bash",
              tool_input: { command: 'rm scratch/"protect"*' },
            },
            {
              tool_name: "Bash",
              tool_input: { command: 'printf changed > scratch/"protect"*' },
            },
            {
              tool_name: "exec_command",
              tool_input: {
                command: `printf changed > ${local}/scratch.txt`,
                workdir: join(root, "nested"),
              },
            },
            {
              tool_name: "exec_command",
              tool_input: {
                command: "node scripts/harness.mjs writer --show",
                workdir: join(root, "nested"),
              },
            },
          ];
          for (const hook of [
            "permissions",
            "concurrent-work-requires-worktrees",
            "write-observer",
          ])
            for (const attempt of [
              ...attempts,
              // All entry points share the classifier; exercise its path matrix
              // once, while retaining every hook/stage lifetime control above.
              ...(mode === "runner" && hook === "permissions"
                ? [
                    ...pathAttempts,
                    {
                      tool_name: "Edit",
                      tool_input: {
                        file_path: `${local}/hardlink.ts`,
                        old_string: "1",
                        new_string: "2",
                      },
                    },
                    ...[">", ">>", "| tee"].map((operator) => ({
                      tool_name: "exec_command",
                      tool_input: {
                        command: `printf changed ${operator} ${local}/hardlink.ts`,
                      },
                    })),
                    {
                      tool_name: "exec_command",
                      tool_input: {
                        command: "printf changed > cwd-input.md",
                        workdir: `${root}/${local}/dirlink/..`,
                      },
                    },
                  ]
                : []),
            ]) {
              const verdict = invoke(
                root,
                hook,
                input(root, "PreToolUse", attempt),
              );
              if (allowed(verdict)) {
                if (typeof attempt.tool_input.command === "string")
                  assert.equal(
                    spawnSync("sh", ["-c", attempt.tool_input.command], {
                      cwd: attempt.tool_input.workdir ?? root,
                    }).status,
                    0,
                  );
                else {
                  const path = attempt.tool_input.file_path ?? "fixture.ts";
                  writeFileSync(
                    isAbsolute(path) ? path : `${root}/${path}`,
                    "changed\n",
                  );
                }
              }
              assert.equal(
                gateTreeHash(root),
                before,
                `${hook} admitted ${attempt.tool_name} during ${stage}`,
              );
              assert.equal(allowed(verdict), false);
              for (const path of [
                "node_modules/probe.js",
                "packages/skeleton/dist/probe.js",
              ])
                assert.equal(existsSync(join(root, path)), false, path);
              const reason =
                verdict.hookSpecificOutput.permissionDecisionReason;
              assert.match(reason, /active gate/);
              assert.ok(
                runs.some(
                  (run) =>
                    reason.includes(run.runId) && reason.includes(run.command),
                ),
              );
            }
          for (const hook of [
            "permissions",
            "concurrent-work-requires-worktrees",
            "write-observer",
          ])
            for (const attempt of [
              {
                tool_name: "Write",
                tool_input: {
                  file_path: `${local}/scratch-link.md`,
                  content: "local only\n",
                },
              },
              {
                tool_name: "Write",
                tool_input: {
                  file_path: `${local}/scratch.txt`,
                  content: "local only\n",
                },
              },
              {
                tool_name: "Edit",
                tool_input: {
                  file_path: `${local}/scratch.txt`,
                  old_string: "local",
                  new_string: "scratch",
                },
              },
              {
                tool_name: "Bash",
                tool_input: {
                  command: `printf scratch > ${local}/scratch.txt`,
                },
              },
              {
                tool_name: "Bash",
                tool_input: { command: `touch ${local}/scratch.txt` },
              },
              {
                tool_name: "exec_command",
                tool_input: {
                  command: "printf scratch > scratch.txt",
                  workdir: join(root, local),
                },
              },
            ]) {
              const verdict = invoke(
                root,
                hook,
                input(root, "PreToolUse", attempt),
              );
              assert.equal(
                allowed(verdict),
                true,
                `${hook} unnecessarily locked ignored scratch: ${JSON.stringify(verdict)}`,
              );
              if (typeof attempt.tool_input.command === "string")
                assert.equal(
                  spawnSync("sh", ["-c", attempt.tool_input.command], {
                    cwd: attempt.tool_input.workdir ?? root,
                  }).status,
                  0,
                );
              else
                writeFileSync(
                  `${root}/${attempt.tool_input.file_path}`,
                  "local only\n",
                );
              assert.equal(gateTreeHash(root), before);
            }
          for (const attempt of [
            {
              tool_name: "Read",
              tool_input: { file_path: join(root, "fixture.ts") },
            },
            {
              tool_name: "Bash",
              tool_input: { command: "git status --short" },
            },
            {
              tool_name: "exec_command",
              tool_input: {
                command: "git status --short",
                workdir: join(root, "nested"),
              },
            },
          ])
            assert.equal(
              allowed(
                invoke(root, "permissions", input(root, "PreToolUse", attempt)),
              ),
              true,
            );
          write(root, `${local}/${stage}.go`, "go");
        }
        assert.equal(await finished, 0, output);
        assert.deepEqual(activeGateRuns(root), []);
        assert.equal(gateTreeHash(root), before);
        assert.equal(
          allowed(
            invoke(
              root,
              "permissions",
              input(root, "PreToolUse", {
                tool_name: "Write",
                tool_input: {
                  file_path: join(root, "fixture.ts"),
                  content: "after gate\n",
                },
              }),
            ),
          ),
          true,
        );
      } finally {
        t.signal.removeEventListener("abort", release);
        release();
        if (finished) await finished;
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

test("WO-125 F3 a marker left by a killed gate owner does not block writes", async () => {
  const root = fixture();
  const markerDirectory = join(root, "docs/control/local/harness/active-gates");
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import {beginGateRun} from "./packages/skeleton/dist/src/gate-evidence.mjs"; beginGateRun(process.cwd(), "crashed gate fixture"); process.stdout.write("ready"); setInterval(() => {}, 1000);',
    ],
    { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
  );
  const exited = new Promise((resolve) => child.once("close", resolve));
  try {
    await new Promise((resolve, reject) => {
      child.stdout.once("data", resolve);
      child.once("error", reject);
      child.once("exit", () => reject(new Error("gate exited before ready")));
    });
    assert.equal(activeGateRuns(root).length, 1);
    child.kill("SIGKILL");
    await exited;
    assert.equal(
      readdirSync(markerDirectory).filter((name) => name.endsWith(".json"))
        .length,
      1,
    );
    assert.deepEqual(activeGateRuns(root), []);
    for (const hook of [
      "permissions",
      "concurrent-work-requires-worktrees",
      "write-observer",
    ])
      assert.equal(
        allowed(
          invoke(
            root,
            hook,
            input(root, "PreToolUse", {
              tool_name: "Write",
              tool_input: {
                file_path: join(root, "fixture.ts"),
                content: "after crash\n",
              },
            }),
          ),
        ),
        true,
      );
  } finally {
    if (child.exitCode === null) child.kill("SIGKILL");
    await exited;
    rmSync(root, { recursive: true, force: true });
  }
});
const session = {
  startingEventCount: 1,
  reads: [],
  expectedEvent: "ImplementationReady",
  role: "executor",
};
const observations = (root, payload = input(root, "Stop")) => {
  const key = createHash("sha256").update(payload.session_id).digest("hex");
  return readFileSync(
    join(root, `docs/control/local/harness/${key}.jsonl`),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
};
const observedSession = (root, payload = input(root, "Stop")) => {
  const key = createHash("sha256").update(payload.session_id).digest("hex");
  const state = JSON.parse(
    readFileSync(join(root, `docs/control/local/harness/${key}.json`), "utf8"),
  );
  return {
    ...state,
    reads: observations(root, payload).flatMap((row) => row.receipts ?? []),
  };
};
const writerEvents = (root) => {
  const path = join(root, "docs/control/local/harness/writer-events.jsonl");
  return existsSync(path)
    ? readFileSync(path, "utf8").trim().split("\n").map(JSON.parse)
    : [];
};
const readiness = (root, name, state = observedSession(root)) => {
  const config = configFor(root, name);
  const policy = compileFeedbackUnits(
    config.policy.units
      .filter((unit) =>
        ["application-evidence", "output-review", "complete-scope"].includes(
          unit.trigger,
        ),
      )
      .map((unit) => ({ ...unit, enforcement: "hard" })),
  );
  const facts =
    name === "finish"
      ? policy.units.flatMap((unit) =>
          harnessFeedbackFacts(
            compileFeedbackUnits([unit]),
            input(root, "Stop"),
            root,
            state,
          ),
        )
      : harnessFeedbackFacts(policy, input(root, "Stop"), root, state);
  try {
    for (const fact of facts) feedbackBoundary(policy, fact, () => {});
    return true;
  } catch (error) {
    assert.ok(error instanceof FeedbackRefused);
    return false;
  }
};
const adoptOutputs = (root) => {
  const state = observedSession(root);
  const key = createHash("sha256").update("synthetic-session").digest("hex");
  state.authoredPaths = harnessOutputs(root).map((row) => row.path);
  writeFileSync(
    join(root, `docs/control/local/harness/${key}.json`),
    json(state),
  );
};
function parity(root, name, payload, expected, state = session) {
  const config = configFor(root, name);
  if (payload.hook_event_name === "Stop")
    config.policy = compileFeedbackUnits(
      config.policy.units
        .filter((unit) =>
          ["application-evidence", "output-review", "complete-scope"].includes(
            unit.trigger,
          ),
        )
        .map((unit) => ({ ...unit, enforcement: "hard" })),
    );
  const policies =
    config.kind === "finish"
      ? config.policy.units.map((unit) => compileFeedbackUnits([unit]))
      : [config.policy];
  const requests = policies.flatMap((policy) =>
    harnessFeedbackFacts(policy, payload, root, state).map((fact) => ({
      policy,
      fact,
    })),
  );
  assert.ok(requests.length, "fixture must reach an eligible boundary");
  if (name === "finish")
    assert.deepEqual(
      requests.map(({ fact }) => fact.kind).sort(),
      ["application-evidence", "complete-scope", "output-review"],
      "finish must exercise every eligible Stop unit",
    );
  let verdict = true;
  try {
    for (const { policy, fact } of requests)
      feedbackBoundary(policy, fact, () => {});
  } catch (error) {
    assert.ok(error instanceof FeedbackRefused);
    verdict = false;
  }
  assert.equal(verdict, expected, `${name} host fact expectation`);
  const result = invoke(root, name, payload);
  assert.equal(
    allowed(result),
    payload.hook_event_name === "Stop" ? true : verdict,
    `${name} generated subprocess parity: ${JSON.stringify(result)}`,
  );
  assert.equal(
    allowed(invoke(root, name, payload, true)),
    true,
    `${name} removal permits the same request`,
  );
}

test("WO-039 generated hook subprocesses agree with the existing boundaries, including unit removal", () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const message of ["A useful change", "Generated by AI"])
      parity(
        root,
        "no-attribution",
        input(root, "PreToolUse", {
          tool_name: "Bash",
          tool_input: { command: `git commit -m '${message}'` },
        }),
        message === "A useful change",
      );
    parity(
      root,
      "concurrent-work-requires-worktrees",
      input(root, "PreToolUse", {
        tool_name: "Edit",
        tool_input: { file_path: join(root, "fixture.ts") },
      }),
      true,
    );
    git(root, "switch", "-c", "main");
    parity(
      root,
      "concurrent-work-requires-worktrees",
      input(root, "PreToolUse", {
        tool_name: "Write",
        tool_input: { file_path: join(root, "fixture.ts") },
      }),
      false,
    );
    git(root, "switch", "wo-999");
    const before = readFileSync(join(root, "fixture.ts"), "utf8");
    for (const after of [before, "// @ts-ignore\n" + before]) {
      write(root, "fixture.ts", after);
      parity(
        root,
        "no-lint-type-disables-as-fixes",
        input(root, "PostToolUse", {
          tool_name: "Edit",
          tool_input: { file_path: join(root, "fixture.ts") },
          tool_response: { originalFile: before },
        }),
        after === before,
      );
    }
    write(root, "fixture.ts", before);
    for (const name of [
      "verify-app-before-done",
      "no-partial-completion",
      "read-your-own-output",
    ])
      parity(root, name, input(root, "Stop"), name === "read-your-own-output");
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Bash",
            tool_input: { command: "ssh fixture.invalid" },
          }),
        ),
      ),
      false,
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: join(root, "fixture.ts") },
          }),
        ),
      ),
      true,
    );
    parity(root, "finish", input(root, "Stop"), false);
    // Normal completion: executable checks, canonical event, and current-byte reads.
    assert.ok(
      runHarnessEvidence(root).every(
        (run) => run.exitCode === 0 && run.executed,
      ),
    );
    write(
      root,
      "docs/control/orders/WO-999.jsonl",
      JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
        "\n" +
        JSON.stringify({ type: "ImplementationReady", workOrderId: "WO-999" }) +
        "\n",
    );
    assert.ok(
      runHarnessEvidence(root).every(
        (run) => run.executed && run.exitCode === 0,
      ),
    );
    for (const name of [
      "verify-app-before-done",
      "no-partial-completion",
      "read-your-own-output",
    ])
      assert.equal(
        allowed(invoke(root, name, input(root, "Stop"))),
        true,
        `${name} completed evidence`,
      );
    parity(root, "finish", input(root, "Stop"), true, observedSession(root));
    assert.equal(
      existsSync(join(root, "docs/control/local/harness/writer")),
      false,
    );
    assert.deepEqual(
      writerEvents(root).map((row) => row.event),
      ["acquired", "released"],
      "one session reserves once and releases at its accepted finish",
    );
    write(root, "fixture.ts", before + "// changed after evidence\n");
    const first = invoke(root, "finish", input(root, "Stop"));
    const second = invoke(
      root,
      "finish",
      input(root, "Stop", { stop_hook_active: true }),
    );
    for (const response of [first, second]) {
      assert.equal(allowed(response), true);
      assert.match(
        response.systemMessage,
        /^DotLn: pending .*verify-app-before-done/,
      );
      assert.equal(response.systemMessage.split("\n").length, 1);
    }
    assert.equal(
      existsSync(join(root, "docs/control/local/harness/writer")),
      false,
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

const nativeRead = (root, path, startLine = 1, numLines, contentOverride) => {
  const contents = readFileSync(join(root, path), "utf8");
  const parts = contents.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  numLines ??= contents.split("\n").length;
  return input(root, "PostToolUse", {
    tool_name: "Read",
    tool_input: {
      file_path: join(root, path),
      offset: startLine,
      limit: numLines,
    },
    tool_response: {
      file: {
        content:
          contentOverride ??
          parts.slice(startLine - 1, startLine - 1 + numLines).join(""),
        startLine,
        numLines,
        totalLines: contents.split("\n").length,
      },
    },
  });
};
const observeInProcess = (root, payload) =>
  evaluateHarnessHook(
    configFor(root, "read-observer"),
    payload,
    root,
    feedbackBoundary,
  );

test("WO-039 ranged receipts require complete current bytes despite gaps, duplicates and stale or mismatched deliveries", async () => {
  const root = fixture();
  try {
    write(root, "review.txt", "alpha\r\nβeta\r\nthird\nfourth\nfifth\nsixth\n");
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const output of harnessOutputs(root).filter(
      (row) => row.path !== "review.txt",
    ))
      await observeInProcess(root, nativeRead(root, output.path));
    adoptOutputs(root);
    const refused = () => {
      assert.equal(readiness(root, "read-your-own-output"), false);
      assert.equal(allowed(invoke(root, "finish", input(root, "Stop"))), true);
    };
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 3, 4));
    await observeInProcess(root, nativeRead(root, "review.txt", 3, 4));
    await observeInProcess(
      root,
      nativeRead(root, "review.txt", 1, 2, "truncated"),
    );
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 1, 2));
    assert.equal(readiness(root, "read-your-own-output"), true);

    write(root, "review.txt", "changed\nβeta\r\nthird\nfourth\nfifth\nsixth\n");
    await observeInProcess(root, nativeRead(root, "review.txt", 3, 4));
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 1, 2));
    assert.equal(readiness(root, "read-your-own-output"), true);

    write(root, "review.txt", "");
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt"));
    assert.equal(readiness(root, "read-your-own-output"), true);
    write(root, "review.txt", "without\nfinal newline");
    await observeInProcess(root, nativeRead(root, "review.txt", 2, 1));
    refused();
    await observeInProcess(root, nativeRead(root, "review.txt", 1, 1));
    assert.equal(readiness(root, "read-your-own-output"), true);
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-126 inherited output corpus adds no reads; authored bounded delivery rejects gaps, truncation and stale hashes", async () => {
  const root = fixture();
  try {
    for (let index = 0; index < 128; index++)
      write(root, `output/inherited-${index}.txt`, "inherited\n".repeat(1000));
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    assert.deepEqual(harnessOutputObligations(root, observedSession(root)), []);
    const own = "output/own.txt";
    invoke(
      root,
      "write-observer",
      input(root, "PreToolUse", {
        tool_name: "Write",
        tool_input: { file_path: join(root, own) },
      }),
    );
    write(root, own, "αβ🙂 synthetic output ".repeat(2000));
    invoke(
      root,
      "read-observer",
      input(root, "PostToolUse", {
        tool_name: "Write",
        tool_input: { file_path: join(root, own) },
        tool_response: { success: true },
      }),
    );
    assert.deepEqual(
      harnessOutputObligations(root, observedSession(root)).map(
        (row) => row.path,
      ),
      [own],
    );
    let offset = 0;
    for (;;) {
      const chunk = readHarnessOutput(root, own, offset, 8192);
      const payload = input(root, "PostToolUse", {
        tool_name: "Bash",
        tool_input: {
          command: `node scripts/harness.mjs read-output ${own} --offset ${offset} --length 8192`,
        },
        tool_response: { stdout: JSON.stringify(chunk) + "\n" },
      });
      assert.equal(readiness(root, "read-your-own-output"), false);
      if (!offset) {
        assert.equal(
          allowed(
            invoke(root, "read-observer", {
              ...payload,
              tool_response: { stdout: JSON.stringify(chunk).slice(0, -20) },
            }),
          ),
          false,
        );
        assert.equal(
          allowed(
            invoke(root, "read-observer", {
              ...payload,
              tool_response: {
                stdout: JSON.stringify({
                  ...chunk,
                  content: "Different bytes",
                }),
              },
            }),
          ),
          false,
        );
      }
      await observeInProcess(root, payload);
      if (chunk.nextOffset === chunk.totalBytes) break;
      offset = chunk.nextOffset;
    }
    assert.equal(readiness(root, "read-your-own-output"), true);
    write(root, own, "changed after delivery\n");
    assert.equal(readiness(root, "read-your-own-output"), false);
    write(root, own, "αβ🙂");
    assert.throws(() => readHarnessOutput(root, own, 1), /UTF-8 boundary/);
    assert.throws(
      () => readHarnessOutput(root, own, 0, 100000),
      /Invalid output byte range/,
    );
    write(
      root,
      "docs/control/local/not-an-output.txt",
      "Synthetic private fixture\n",
    );
    assert.throws(
      () => readHarnessOutput(root, "docs/control/local/not-an-output.txt"),
      /output|refus|contained/i,
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-039 installed bundle detects content, missing, unexpected and manifest drift and refuses unowned replacement", () => {
  const root = fixture();
  const outside = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-harness-outside-")),
  );
  try {
    assert.equal(checkHarness(root).localTerms.status, "unavailable");
    const path = join(root, ".claude/skills/dotln-executor/SKILL.md");
    writeFileSync(path, readFileSync(path, "utf8") + " ");
    assert.throws(() => checkHarness(root), /harness drift/);
    emitHarness(root);
    assert.ok(checkHarness(root).files > 10);
    rmSync(path);
    assert.throws(() => checkHarness(root), /harness drift: missing/);
    emitHarness(root);
    const unexpected = ".claude/hooks/unowned.mjs";
    write(root, unexpected, "// Preserve unowned content\n");
    assert.throws(() => checkHarness(root), /harness drift: unexpected/);
    const beforeRefusal = readFileSync(path);
    assert.throws(
      () => emitHarness(root),
      /unowned harness output refuses replacement/,
    );
    assert.deepEqual(readFileSync(path), beforeRefusal);
    assert.equal(
      readFileSync(join(root, unexpected), "utf8"),
      "// Preserve unowned content\n",
    );
    rmSync(join(root, unexpected));
    const manifestPath = join(root, ".claude/harness-manifest.json");
    const manifest = readFileSync(manifestPath, "utf8");
    for (const mutation of ["missing", "changed"]) {
      if (mutation === "missing") rmSync(manifestPath);
      else writeFileSync(manifestPath, manifest + " ");
      assert.throws(() => checkHarness(root), /harness drift: manifest/);
      writeFileSync(manifestPath, manifest);
    }
    const obsolete = ".claude/hooks/obsolete.mjs";
    write(root, obsolete, "// Previously owned output\n");
    const previous = JSON.parse(manifest);
    previous.installed.push({ path: obsolete });
    writeFileSync(manifestPath, json(previous));
    emitHarness(root);
    assert.equal(existsSync(join(root, obsolete)), false);
    assert.ok(checkHarness(root).files > 10);
    write(outside, "sentinel", "preserve\n");
    rmSync(path);
    symlinkSync(join(outside, "sentinel"), path);
    assert.throws(() => emitHarness(root), /symlink|regular file/);
    assert.equal(readFileSync(join(outside, "sentinel"), "utf8"), "preserve\n");
  } finally {
    rmSync(root, { recursive: true });
    rmSync(outside, { recursive: true });
  }
});

test("WO-039 local terms are unavailable honestly or refuse without echoing the synthetic term", () => {
  const root = fixture();
  try {
    assert.equal(termsCheck(root, ["CLAUDE.md"]).status, "unavailable");
    write(root, "docs/control/local/terms.txt", "SyntheticForbidden\n");
    write(root, "public.md", "Ordinary text\nSYNTHETIC-forbidden\n");
    assert.throws(
      () => termsCheck(root, ["public.md"]),
      (error) => {
        assert.match(error.message, /"file":"public.md","line":2,"count":1/);
        assert.doesNotMatch(error.message, /synthetic|forbidden/i);
        return true;
      },
    );
    assert.equal(termsCheck(root, ["CLAUDE.md"]).status, "present");
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-039 target does not change Seiri or Entropy Reducer semantic hashes", () => {
  const baseline = JSON.parse(
    readFileSync(
      join(sourceRoot, "docs/evidence/WO-029/baseline.json"),
      "utf8",
    ),
  );
  for (const row of baseline.fixtures) {
    const result = compileLoadout(
      row.name === "seiri"
        ? seiriLoadout
        : entropyReducerLoadout(row.episodeEndsAt),
      row.environment,
    );
    assert.equal(result.ok, true);
    assert.equal(result.semanticHash, row.semanticHash);
  }
  const installation = harnessInstallation();
  assert.equal(installation.bundles.length, 2);
  assert.equal(
    contributorProgram().loadout.phenotype.identityId,
    "contributor",
  );
});

test("WO-039 control observation uses the canonical read-only lifecycle command", () => {
  const projection = join(sourceRoot, "docs/control/current.md");
  const before = readFileSync(projection);
  assert.ok(
    [
      "none",
      "active",
      "ready-to-verify",
      "verifying",
      "needs-fix",
      "repairing",
      "verified",
      "final-review",
      "closed",
    ].includes(harnessControl(sourceRoot).phase),
  );
  assert.deepEqual(readFileSync(projection), before);
});

test("WO-039 whole-procedure context includes late directives and refuses unaccounted reads", () => {
  const files = {
    "late.md": "first\nsecond\n",
    "order.md": "# Order\n",
    "unexpected.md": "outside\n",
  };
  const instruction = "Read[executor]: `@skills/dotln-executor/SKILL.md`\n";
  const skill = "Read: `@work-order`\nFinish the ordinary role procedure.\n";
  const options = {
    instruction,
    skill,
    role: "executor",
    skillsRoot: ".claude/skills",
    selectors: { "@work-order": ["order.md"] },
    read: (path) => files[path],
  };
  const base = directedReads(options);
  for (const surface of ["instruction", "skill"]) {
    const changed = {
      ...options,
      [surface]: options[surface] + "Read: `late.md`\n",
    };
    const actual = directedReads(changed);
    assert.ok(
      actual.some((entry) => entry.path === "late.md" && entry.endLine === 2),
    );
    assert.equal(
      compareObservedReads(actual, [
        { path: "late.md", startLine: 1, endLine: 2 },
      ]).length,
      0,
    );
  }
  assert.equal(
    compareObservedReads(base, [{ path: "late.md", startLine: 1, endLine: 2 }])
      .length,
    1,
  );
  assert.throws(
    () => directedReads({ ...options, skill: skill + "Read: `@missing`\n" }),
    /Unresolved required/,
  );
  assert.equal(
    countReads([{ path: "late.md", startLine: 1, endLine: 2 }], options.read)
      .bytes,
    13,
  );
  const measured = measureHarnessContext();
  checkContextMeasurement(measured);
  const skillPath = ".claude/skills/dotln-executor/SKILL.md";
  const emitted = harnessInstallation().files.find(
    (file) => file.path === skillPath,
  ).contents;
  const notLower = measureHarnessContext(
    new Map([
      [skillPath, emitted + "Read: `fixture/late-large.md`\n"],
      ["fixture/late-large.md", "late required input\n".repeat(4000)],
    ]),
  );
  assert.equal(notLower.profiles[0].lower, false);
  assert.ok(
    notLower.profiles[0].residue[0].files.includes("fixture/late-large.md"),
  );
  assert.throws(() => checkContextMeasurement(notLower), /late-large\.md/);
});

test("WO-039 generated read observer spans the session and its bounded scope closes alternate read routes", () => {
  const root = fixture();
  try {
    write(
      root,
      "docs/control/local/harness/read-scope.json",
      json({
        role: "executor",
        skill: "dotln-executor",
        reads: [{ path: "fixture.ts", startLine: 1, endLine: 1 }],
        commands: ["pwd"],
      }),
    );
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const [tool_name, tool_input, expected] of [
      ["Read", { file_path: join(root, "fixture.ts") }, true],
      ["Read", { file_path: join(root, "package.json") }, false],
      ["Bash", { command: "cat fixture.ts" }, false],
      ["Bash", { command: "pwd" }, true],
      ["Skill", { skill: "dotln-reviewer" }, false],
      ["Grep", { pattern: ".*" }, false],
    ])
      assert.equal(
        allowed(
          invoke(
            root,
            "permissions",
            input(root, "PreToolUse", { tool_name, tool_input }),
          ),
        ),
        expected,
      );
    const observed = input(root, "PostToolUse", {
      tool_name: "Read",
      tool_input: { file_path: join(root, "fixture.ts") },
      tool_response: {
        file: {
          content: "export const value = 1;\n",
          startLine: 1,
          numLines: 1,
          totalLines: 1,
        },
      },
    });
    assert.equal(allowed(invoke(root, "read-observer", observed)), true);
    assert.equal(
      allowed(
        invoke(root, "read-observer", {
          ...observed,
          tool_response: {
            file: {
              ...observed.tool_response.file,
              numLines: 2,
              totalLines: 2,
            },
          },
        }),
      ),
      true,
      "the empty line reported after a trailing newline delivers no extra bytes",
    );
    invoke(root, "finish", input(root, "Stop"));
    assert.equal(
      allowed(
        invoke(root, "read-observer", {
          ...observed,
          tool_input: { file_path: join(root, "package.json") },
        }),
      ),
      false,
      "a late read still fails after a Stop attempt",
    );
    const directed = [{ path: "fixture.ts", startLine: 1, endLine: 1 }];
    const enforced = scopeReadEvidence(directed, observations(root));
    assert.equal(enforced.refusalCounts.Read, 1);
    assert.equal(enforced.refusalCounts.Bash, 1);
    assert.equal(enforced.refusedReads[0].path, "package.json");
    assert.equal(enforced.unlocatedReadRefusals, 0);
    assert.equal(enforced.attemptedOutsideDirectedSet[0].path, "package.json");
    write(
      root,
      "docs/control/local/harness/read-scope.json",
      json({
        role: "executor",
        skill: "dotln-executor",
        reads: directed,
        commands: ["pwd"],
        mode: "observe",
      }),
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: join(root, "package.json") },
          }),
        ),
      ),
      true,
      "observe mode allows the out-of-set read to expose what the role actually loads",
    );
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, "package.json"))),
      true,
    );
    assert.ok(
      compareObservedReads(
        directed,
        observations(root).flatMap((row) => row.reads ?? []),
      ).some((row) => row.path === "package.json"),
    );
    const observedScope = scopeReadEvidence(directed, observations(root));
    assert.equal(
      observedScope.refusalCounts.Read,
      1,
      "the observe-only attempt is not counted as a refused read",
    );
    assert.equal(
      observedScope.attemptedOutsideDirectedSet.length,
      2,
      "both enforced and observed attempts remain visible",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: {
              file_path: join(
                root,
                "docs/control/local/harness/read-scope.json",
              ),
            },
          }),
        ),
      ),
      false,
      "observation never expands the compiled authority",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: "/outside-fixture/synthetic.txt" },
          }),
        ),
      ),
      false,
    );
    const outsideAttempt = scopeReadEvidence(directed, observations(root));
    assert.ok(
      outsideAttempt.attemptedOutsideDirectedSet.some(
        (read) => read.path === "<outside-worktree>",
      ),
    );
    assert.equal(outsideAttempt.unlocatedReadRefusals, 0);
    assert.ok(
      !JSON.stringify(outsideAttempt).includes("/outside-fixture"),
      "external attempted paths are reduced to a shape",
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-039 confirmed-token adapter uses the compiled correction and survives independent prompt bookkeeping", () => {
  const root = fixture();
  try {
    const program = {
      ...contributorProgram(),
      correctionToken: "fixture-correction:",
    };
    emitHarness(root, {
      program,
      feedback: compileFeedbackUnits(retainedFeedbackUnitsV1),
    });
    const hook = "fail-conservative-correction";
    const payload = input(root, "UserPromptSubmit", {
      prompt: "fixture-correction: synthetic signal",
    });
    assert.deepEqual(
      invoke(root, hook, { ...payload, prompt: "ordinary correction wording" }),
      {},
    );
    assert.deepEqual(invoke(root, hook, payload, true), {});
    const config = configFor(root, hook);
    const expected = applyFeedbackCorrection(
      config.policy,
      {
        allowedEffects: [...program.loadout.authorityEnvelope.allowedEffects],
        destructiveEffects: [
          "repo.write",
          "repo.delete",
          "shell.run",
          "git.local",
          "lifecycle.run",
        ],
        scopeExpansionAllowed: true,
        preserveEvidence: false,
        diagnosisRequired: false,
        corrections: [],
      },
      { type: "OperatorCorrectionReceived", eventId: "correction:0" },
    );
    const result = invoke(root, hook, payload);
    const response = JSON.parse(
      result.hookSpecificOutput.additionalContext
        .split(": ")
        .slice(1)
        .join(": "),
    );
    assert.deepEqual(response, {
      allowedEffects: expected.allowedEffects,
      scopeExpansionAllowed: expected.scopeExpansionAllowed,
      preserveEvidence: expected.preserveEvidence,
      diagnosisRequired: expected.diagnosisRequired,
    });
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    for (const [tool_name, expected] of [
      ["Read", true],
      ["Edit", false],
    ])
      assert.equal(
        allowed(
          invoke(
            root,
            "permissions",
            input(root, "PreToolUse", {
              tool_name,
              tool_input: { file_path: join(root, "fixture.ts") },
            }),
          ),
        ),
        expected,
      );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-039 commit-message adapter has boundary parity and missing built adapters refuse before effects", () => {
  const root = fixture();
  try {
    const path = join(root, ".claude/hooks/commit-msg.mjs");
    for (const message of ["A useful change", "Generated by AI"]) {
      write(root, "docs/control/local/message.txt", message);
      const result = spawnSync(
        process.execPath,
        [path, "docs/control/local/message.txt"],
        { cwd: root, encoding: "utf8" },
      );
      let expected = 0;
      try {
        feedbackBoundary(
          compileFeedbackUnits(
            personalFeedbackUnits.filter(
              (unit) => unit.trigger === "attribution",
            ),
          ),
          { kind: "attribution", message },
          () => {},
        );
      } catch {
        expected = 1;
      }
      assert.equal(result.status, expected);
    }
    const source = readFileSync(path, "utf8");
    const config = JSON.parse(
      source.match(
        /await runCommitMessageHook\(([\s\S]*), feedbackBoundary\);/,
      )[1],
    );
    config.policy = compileFeedbackUnits([]);
    writeFileSync(
      path,
      source.replace(
        /await runCommitMessageHook\([\s\S]*, feedbackBoundary\);/,
        `await runCommitMessageHook(${json(config).trim()}, feedbackBoundary);`,
      ),
    );
    assert.equal(
      spawnSync(process.execPath, [path, "docs/control/local/message.txt"], {
        cwd: root,
      }).status,
      0,
    );
    rmSync(
      join(
        root,
        configFor(root, "permissions").runtime.snapshot,
        "packages/skeleton/dist/src/harness-host.js",
      ),
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          input(root, "PreToolUse", {
            tool_name: "Read",
            tool_input: { file_path: join(root, "fixture.ts") },
          }),
        ),
      ),
      false,
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "session",
          input(root, "UserPromptSubmit", { prompt: "resume: next" }),
        ),
      ),
      false,
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-039 metadata and the exact guarded release helper do not dispatch a coding writer into main", () => {
  const root = fixture();
  try {
    git(root, "switch", "-c", "main");
    const payload = (command) =>
      input(root, "PreToolUse", { tool_name: "Bash", tool_input: { command } });
    parity(
      root,
      "concurrent-work-requires-worktrees",
      payload("pwd && git rev-parse --show-toplevel"),
      true,
    );
    assert.equal(
      existsSync(join(root, "docs/control/local/harness/writer")),
      false,
    );
    parity(
      root,
      "concurrent-work-requires-worktrees",
      payload(
        "node scripts/harness.mjs read-output fixture.ts --offset 0 --length 8192",
      ),
      true,
    );
    assert.equal(
      existsSync(join(root, "docs/control/local/harness/writer")),
      false,
      "bounded output reads never reserve a coding writer, including on main",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          payload("node scripts/harness.mjs read-output fixture.ts"),
        ),
      ),
      true,
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          payload("node scripts/harness.mjs read-output .env"),
        ),
      ),
      false,
      "the helper retains native credential-path denial",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          payload("node scripts/harness.mjs read-output .env && pwd"),
        ),
      ),
      false,
      "shell composition cannot bypass credential-path denial",
    );
    parity(
      root,
      "concurrent-work-requires-worktrees",
      payload("node arbitrary-writer.mjs"),
      false,
    );
    write(
      root,
      "docs/control/fixture-status.json",
      json({ ...control, phase: "closed" }),
    );
    write(
      root,
      "scripts/release.mjs",
      "throw new Error('fixture helper must never execute');\n",
    );
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: release close" }),
    );
    const request = payload("node scripts/release.mjs close WO-999 --publish");
    const config = configFor(root, "concurrent-work-requires-worktrees");
    const facts = harnessFeedbackFacts(config.policy, request, root, {
      ...session,
      role: "release-close",
      intent: "resume: release close",
    });
    assert.equal(facts[0].writable, false);
    assert.doesNotThrow(() =>
      feedbackBoundary(config.policy, facts[0], () => {}),
    );
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", request)),
      true,
    );
    assert.equal(allowed(invoke(root, "permissions", request)), true);
    assert.equal(
      allowed(
        invoke(
          root,
          "concurrent-work-requires-worktrees",
          payload("node scripts/release.mjs close WO-998 --publish"),
        ),
      ),
      false,
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "concurrent-work-requires-worktrees",
          payload(
            "node scripts/release.mjs close WO-999 --publish && node arbitrary-writer.mjs",
          ),
        ),
      ),
      false,
    );
    write(root, "docs/control/fixture-status.json", json(control));
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", request)),
      false,
      "an open lifecycle never gains the managed-close route",
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-039 completion tracks outputs across commits and auxiliary prompts retain the active obligation", () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: status" }),
    );
    assert.equal(readiness(root, "no-partial-completion"), false);
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", {
        prompt: "ideation: synthetic capture-only",
      }),
    );
    assert.equal(readiness(root, "no-partial-completion"), false);
    const authored = (event) =>
      input(root, event, {
        tool_name: "Write",
        tool_input: { file_path: join(root, "fixture.ts") },
        ...(event === "PostToolUse"
          ? { tool_response: { success: true } }
          : {}),
      });
    invoke(root, "write-observer", authored("PreToolUse"));
    write(root, "fixture.ts", "export const value = 2;\n");
    invoke(root, "read-observer", authored("PostToolUse"));
    const before = git(root, "rev-parse", "HEAD");
    assert.deepEqual(
      harnessOutputObligations(root, observedSession(root)).map(
        (row) => row.path,
      ),
      ["fixture.ts"],
    );
    assert.equal(readiness(root, "read-your-own-output"), false);
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, "fixture.ts"))),
      true,
    );
    git(root, "add", ".");
    git(
      root,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-m",
      "Commit already reviewed fixture outputs",
    );
    assert.ok(harnessOutputs(root, before).length > 0);
    assert.equal(harnessOutputs(root).length, 0);
    assert.equal(
      readiness(root, "read-your-own-output"),
      true,
      "commit does not erase the session's output set",
    );
    write(root, "fixture.ts", "export const value = 3;\n");
    assert.equal(
      readiness(root, "read-your-own-output"),
      false,
      "committed receipts cannot satisfy changed current bytes",
    );
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, "fixture.ts"))),
      true,
    );
    assert.equal(readiness(root, "read-your-own-output"), true);
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-127 hook stdin handles manifest-sized, chunked UTF-8 and truncated messages through generated processes", async () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    const manifest = ".claude/harness-manifest.json";
    assert.ok(
      Buffer.byteLength(JSON.stringify(nativeRead(root, manifest))) > 32768,
    );
    assert.equal(
      allowed(invoke(root, "read-observer", nativeRead(root, manifest))),
      true,
    );
    assert.ok(observedSession(root).reads.some((row) => row.path === manifest));
    write(root, "transport.txt", "β🙂".repeat(9000));
    const bytes = Buffer.from(
      JSON.stringify(nativeRead(root, "transport.txt")),
    );
    const piped = async (bytes) => {
      const child = spawn(
        process.execPath,
        [join(root, ".claude/hooks/read-observer.mjs")],
        { cwd: root, timeout: deadlineLimit(1000, 20_000) },
      );
      let stdout = "",
        stderr = "";
      child.stdout.on("data", (chunk) => (stdout += chunk));
      child.stderr.on("data", (chunk) => (stderr += chunk));
      const done = new Promise((resolve, reject) => {
        child.on("error", reject);
        child.on("close", (code, signal) =>
          resolve({ code, signal, stdout, stderr }),
        );
      });
      // Odd chunk boundaries deliberately split multi-byte code points. Each
      // write callback waits for consumption so the parent respects backpressure.
      for (let offset = 0; offset < bytes.length; offset += 997)
        await new Promise((resolve, reject) =>
          child.stdin.write(bytes.subarray(offset, offset + 997), (error) =>
            error ? reject(error) : resolve(),
          ),
        );
      child.stdin.end();
      const result = await done;
      assert.equal(
        result.code,
        0,
        JSON.stringify({ signal: result.signal, stderr: result.stderr }),
      );
      return JSON.parse(result.stdout);
    };
    assert.equal(allowed(await piped(bytes)), true);
    assert.ok(
      observedSession(root).reads.some((row) => row.path === "transport.txt"),
    );
    assert.equal(
      allowed(await piped(bytes.subarray(0, bytes.length - 1))),
      false,
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-039 foreign writer reservations refuse while their owner lives, reclaim with a record when it is dead, and stay inspectable", () => {
  const root = fixture();
  try {
    invoke(
      root,
      "session",
      input(root, "UserPromptSubmit", { prompt: "resume: next" }),
    );
    const lock = join(root, "docs/control/local/harness/writer");
    const reserve = (writer) => {
      rmSync(lock, { recursive: true, force: true });
      seedHarnessWriter(root, writer);
    };
    const current = () => {
      const [name, ...rest] = readdirSync(lock);
      assert.match(name ?? "", /^reservation-[0-9a-f]{32}\.json$/);
      assert.deepEqual(rest, [], "one reservation file per instance");
      return JSON.parse(readFileSync(join(lock, name), "utf8"));
    };
    const cli = (...args) =>
      spawnSync(process.execPath, ["scripts/harness.mjs", "writer", ...args], {
        cwd: root,
        encoding: "utf8",
      });
    const reason = (payload) =>
      invoke(root, "concurrent-work-requires-worktrees", payload)
        .hookSpecificOutput.permissionDecisionReason;
    const edit = input(root, "PreToolUse", {
      tool_name: "Edit",
      tool_input: { file_path: join(root, "fixture.ts") },
    });
    const command = (text) =>
      input(root, "PreToolUse", {
        tool_name: "Bash",
        tool_input: { command: text },
      });
    const self = createHash("sha256").update("synthetic-session").digest("hex");
    const foreign = createHash("sha256")
      .update("foreign-fixture-session")
      .digest("hex");
    const exited = spawnSync(process.execPath, ["-e", ""]);
    assert.equal(exited.status, 0);
    const dead = {
      pid: exited.pid,
      startedAt: "Thu Jan  1 00:00:00 1970",
      source: "CLAUDE_PID",
    };
    const live = { pid: process.pid, source: "CLAUDE_PID" };
    assert.equal(harnessProcessAlive(live), true);
    assert.equal(harnessProcessAlive(dead), false);
    assert.equal(harnessProcessAlive({ pid: 1, source: "parent" }), false);
    const host = harnessHostProcess();
    assert.ok(host.pid > 1 && harnessProcessAlive(host), "live host process");
    assert.ok(["CLAUDE_PID", "ancestor", "parent"].includes(host.source));

    // A live foreign reservation refuses every write dispatch and names its holder.
    reserve({
      actorId: foreign,
      worktree: root,
      owner: live,
      reservedAt: "2026-09-07T00:00:00.000Z",
    });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    const refused = reason(edit);
    assert.match(
      refused,
      /reserved by another session \(actor [0-9a-f]{12}; host process \d+ is alive\)/,
    );
    assert.ok(
      refused.includes(foreign.slice(0, 12)) &&
        refused.includes("writer --show") &&
        refused.includes("writer --release"),
    );
    assert.ok(
      !refused.includes(root) && !refused.includes(foreign.slice(12)),
      "the refusal names no path and no full actor key",
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "concurrent-work-requires-worktrees",
          input(root, "PreToolUse", {
            tool_name: "Write",
            tool_input: { file_path: join(root, "fixture.ts") },
          }),
        ),
      ),
      false,
    );
    assert.equal(
      current().actorId,
      foreign,
      "a live foreign reservation is never replaced",
    );
    // The refused session keeps metadata and the operator view; neither reserves.
    parity(
      root,
      "concurrent-work-requires-worktrees",
      command("node scripts/harness.mjs writer --show"),
      true,
    );
    assert.equal(
      allowed(
        invoke(
          root,
          "permissions",
          command("node scripts/harness.mjs writer --show"),
        ),
      ),
      true,
    );
    const shown = cli("--show");
    assert.equal(shown.status, 0, shown.stderr);
    const view = JSON.parse(shown.stdout);
    assert.deepEqual(
      {
        contract: view.contract,
        reserved: view.reserved,
        actorId: view.actorId,
        pid: view.owner.pid,
        alive: view.alive,
      },
      {
        contract: "harness-writer-v1",
        reserved: true,
        actorId: foreign,
        pid: process.pid,
        alive: true,
      },
    );
    assert.ok(!shown.stdout.includes(root), "the view names no absolute path");
    assert.equal(
      current().actorId,
      foreign,
      "showing never reserves or releases",
    );
    // A governed session cannot release a live foreign reservation; an operator must force it.
    parity(
      root,
      "concurrent-work-requires-worktrees",
      command("node scripts/harness.mjs writer --release"),
      false,
    );
    const declined = cli("--release");
    assert.equal(declined.status, 1);
    assert.match(declined.stderr, /alive/);
    assert.equal(current().actorId, foreign);
    const forced = cli("--release", "--force");
    assert.equal(forced.status, 0, forced.stderr);
    assert.equal(JSON.parse(forced.stdout).released, true);
    assert.equal(existsSync(lock), false);
    assert.deepEqual(
      writerEvents(root)
        .map((row) => row.event)
        .slice(-1),
      ["operator-released"],
    );
    // A foreign reservation without a recorded owner is honoured until an operator releases it.
    reserve({ actorId: foreign, worktree: root });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    assert.match(reason(edit), /host process is not recorded/);
    assert.equal(current().actorId, foreign);
    assert.equal(JSON.parse(cli("--show").stdout).alive, "unknown");
    const unknown = cli("--release");
    assert.equal(unknown.status, 0, unknown.stderr);
    assert.equal(JSON.parse(unknown.stdout).alive, "unknown");
    assert.equal(existsSync(lock), false);
    // A foreign reservation whose owner is dead is reclaimed once, with a record, and work proceeds.
    reserve({
      actorId: foreign,
      worktree: root,
      owner: dead,
      reservedAt: "2026-09-07T00:00:00.000Z",
    });
    parity(root, "concurrent-work-requires-worktrees", edit, true);
    const reclaimed = current();
    assert.equal(reclaimed.actorId, self);
    assert.equal(reclaimed.reclaimed.actorId, foreign);
    assert.equal(reclaimed.reclaimed.owner.pid, exited.pid);
    assert.ok(
      harnessProcessAlive(reclaimed.owner),
      "the reclaiming session records its live owner",
    );
    assert.ok(
      observations(root).some(
        (row) =>
          row.writerReclaimed?.actorId === foreign &&
          row.writerReclaimed.owner.pid === exited.pid,
      ),
    );
    assert.ok(
      writerEvents(root).some(
        (row) => row.event === "reclaimed" && row.previous.actorId === foreign,
      ),
    );
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(
      current().actorId,
      self,
      "the reclaiming session keeps its reservation",
    );
    // An operator releases a dead-owner reservation without force.
    reserve({ actorId: foreign, worktree: root, owner: dead });
    const released = cli("--release");
    assert.equal(released.status, 0, released.stderr);
    assert.equal(JSON.parse(released.stdout).alive, false);
    assert.equal(existsSync(lock), false);
    assert.deepEqual(
      {
        event: writerEvents(root).at(-1).event,
        actorId: writerEvents(root).at(-1).actorId,
        alive: writerEvents(root).at(-1).alive,
      },
      { event: "operator-released", actorId: foreign, alive: false },
      "the release journal names the reservation it judged and retired",
    );
    // A self-owned reservation without an owner gains one; a self-owned dead
    // owner disables liveness for that lock instead of trusting the identity.
    reserve({ actorId: self, worktree: root });
    const unowned = readdirSync(lock)[0];
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.deepEqual(
      { pid: current().owner.pid, source: current().owner.source },
      { pid: process.pid, source: "CLAUDE_PID" },
    );
    assert.deepEqual(
      {
        renamed: readdirSync(lock)[0] !== unowned,
        supersedes: current().supersedes,
      },
      { renamed: true, supersedes: unowned },
      "a recorded fact is a new instance naming the one it replaced",
    );
    reserve({ actorId: self, worktree: root, owner: dead });
    const distrusted = readdirSync(lock)[0];
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(current().liveness, "unavailable");
    assert.deepEqual(
      {
        renamed: readdirSync(lock)[0] !== distrusted,
        supersedes: current().supersedes,
      },
      { renamed: true, supersedes: distrusted },
    );
    assert.ok(
      !cli("--show").stdout.includes("supersedes"),
      "the view never names an instance",
    );
    assert.ok(
      observations(root).some(
        (row) => row.writerLivenessUnavailable?.pid === exited.pid,
      ),
    );
    reserve({ ...current(), actorId: foreign });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    assert.match(reason(edit), /unknown liveness/);
    assert.equal(
      current().actorId,
      foreign,
      "an untrusted owner identity never reclaims",
    );
    assert.equal(JSON.parse(cli("--show").stdout).alive, "unknown");
    // Pre-repair single-file reservations are honoured while live, reclaimed
    // when dead, and migrated when they belong to this session; none is created.
    rmSync(lock, { recursive: true, force: true });
    const legacy = join(root, "docs/control/local/harness/writer.json");
    const legacyWriter = (writer) =>
      writeFileSync(legacy, JSON.stringify(writer) + "\n");
    legacyWriter({ actorId: foreign, worktree: root, owner: live });
    parity(root, "concurrent-work-requires-worktrees", edit, false);
    assert.match(reason(edit), /host process \d+ is alive/);
    assert.equal(JSON.parse(cli("--show").stdout).actorId, foreign);
    assert.ok(
      existsSync(legacy) && !existsSync(lock),
      "a live legacy holder is honoured",
    );
    legacyWriter({ actorId: foreign, worktree: root, owner: dead });
    parity(root, "concurrent-work-requires-worktrees", edit, true);
    assert.equal(
      existsSync(legacy),
      false,
      "a dead legacy holder is reclaimed",
    );
    assert.deepEqual(
      { actorId: current().actorId, previous: current().reclaimed.actorId },
      { actorId: self, previous: foreign },
    );
    assert.equal(writerEvents(root).at(-1).event, "reclaimed");
    rmSync(lock, { recursive: true, force: true });
    legacyWriter({ actorId: self, worktree: root, owner: live });
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(
      existsSync(legacy),
      false,
      "this session's legacy file migrates",
    );
    assert.deepEqual(
      { actorId: current().actorId, liveness: current().liveness },
      { actorId: self, liveness: undefined },
    );
    assert.deepEqual(
      writerEvents(root)
        .slice(-2)
        .map((row) => row.event),
      ["migrated", "acquired"],
    );
    legacyWriter({ actorId: self, worktree: root, owner: dead });
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.ok(
      !existsSync(legacy) && current().liveness === undefined,
      "a stale legacy file beside a live instance is only removed",
    );
    rmSync(lock, { recursive: true, force: true });
    legacyWriter({ actorId: self, worktree: root, owner: dead });
    assert.equal(
      allowed(invoke(root, "concurrent-work-requires-worktrees", edit)),
      true,
    );
    assert.equal(
      current().liveness,
      "unavailable",
      "a migrated self-distrusted identity stays untrusted",
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

// Delays one real filesystem call on the observed reservation until a barrier
// file appears; liveness, contents, host facts and the hook verdict are untouched.
const interleavePreload = `import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { deadlineLimit, startDeadline } from ${JSON.stringify(new URL("../packages/skeleton/src/gate-deadlines.mjs", import.meta.url).href)};
const stage = process.env.RACE_STAGE;
const original = fs[stage];
const sleeper = new Int32Array(new SharedArrayBuffer(4));
fs[stage] = function () {
  const lock = process.env.RACE_LOCK_DIR;
  const under = (path) => typeof path === "string" && (path === lock || path.startsWith(lock + "/"));
  if ([...arguments].some(under)) {
    fs.writeFileSync(process.env.RACE_READY, "ready");
    const deadline = startDeadline("harness:held-barrier", deadlineLimit(1000, 20000));
    while (!fs.existsSync(process.env.RACE_GO)) {
      deadline.check();
      Atomics.wait(sleeper, 0, 0, 5);
    }
    deadline.finish();
  }
  return original.apply(this, arguments);
};
syncBuiltinESMExports();
`;

// The shared race harness: a dead holder to seed, generated-hook contenders
// and the public operator command started under the interleaving preload,
// barriers, and the fixture's view of the reservation and its event log.
function raceHarness(root, children) {
  const stateDir = join(root, "docs/control/local/harness");
  const lock = join(stateDir, "writer");
  const exited = spawnSync(process.execPath, ["-e", ""]);
  assert.equal(exited.status, 0);
  const dead = {
    pid: exited.pid,
    startedAt: "Thu Jan  1 00:00:00 1970",
    source: "CLAUDE_PID",
  };
  const actor = (label) =>
    createHash("sha256").update(`fixture-${label}`).digest("hex");
  const seed = (writer) => {
    rmSync(lock, { recursive: true, force: true });
    seedHarnessWriter(root, {
      worktree: root,
      reservedAt: "2026-09-07T00:00:00.000Z",
      ...writer,
    });
  };
  const seedDead = () => seed({ actorId: actor("dead"), owner: dead });
  const preload = join(stateDir, "interleave.mjs");
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(preload, interleavePreload);
  const edit = (label) =>
    input(root, "PreToolUse", {
      session_id: `fixture-${label}`,
      tool_name: "Edit",
      tool_input: { file_path: join(root, "fixture.ts") },
    });
  const start = (label, stage, args, payload) => {
    const child = spawn(process.execPath, ["--import", preload, ...args], {
      cwd: root,
      env: {
        ...process.env,
        CLAUDE_PID: String(process.pid),
        RACE_STAGE: stage,
        RACE_LOCK_DIR: lock,
        RACE_READY: join(stateDir, `${label}.ready`),
        RACE_GO: join(stateDir, `${label}.go`),
      },
      stdio: ["pipe", "pipe", "pipe"],
    });
    children.push(child);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    const done = new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", (code) => resolve({ code, stdout, stderr }));
    });
    child.stdin.end(payload ? JSON.stringify(payload) : "");
    return done;
  };
  const contend = (label, stage) =>
    start(
      label,
      stage,
      [".claude/hooks/concurrent-work-requires-worktrees.mjs"],
      edit(label),
    );
  const operate = (label, stage, ...flags) =>
    start(
      label,
      stage,
      ["scripts/harness.mjs", "writer", "--release", ...flags],
      null,
    );
  const paused = async (label) => {
    const deadline = startDeadline(
      "harness:await-barrier",
      deadlineLimit(1000, 20_000),
    );
    while (!existsSync(join(stateDir, `${label}.ready`))) {
      deadline.check();
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    deadline.finish();
  };
  const release = (label) => writeFileSync(join(stateDir, `${label}.go`), "go");
  const verdict = async (done) => {
    const run = await done;
    assert.equal(run.code, 0, run.stderr);
    return JSON.parse(run.stdout);
  };
  const names = () => readdirSync(lock);
  const holder = () => JSON.parse(readFileSync(join(lock, names()[0]), "utf8"));
  const events = () => writerEvents(root).map((row) => row.event);
  const dispatch = (label) =>
    allowed(invoke(root, "concurrent-work-requires-worktrees", edit(label)));
  return {
    lock,
    dead,
    actor,
    seed,
    seedDead,
    edit,
    contend,
    operate,
    paused,
    release,
    verdict,
    names,
    holder,
    events,
    dispatch,
  };
}

test("WO-039 concurrent dead-owner recovery admits exactly one writer while the first owner's work is outstanding", async () => {
  const root = fixture();
  const children = [];
  try {
    const {
      actor,
      seedDead,
      edit,
      contend,
      paused,
      release,
      verdict,
      holder,
      events,
      dispatch,
    } = raceHarness(root, children);

    // VER-002 F1: two contenders classify the same dead holder, pause before
    // their first mutation, and then act in turn.
    seedDead();
    const b = contend("B", "unlinkSync");
    await paused("B");
    const a = contend("A", "unlinkSync");
    await paused("A");
    release("A");
    assert.equal(allowed(await verdict(a)), true);
    assert.deepEqual(
      { actorId: holder().actorId, previous: holder().reclaimed.actorId },
      { actorId: actor("A"), previous: actor("dead") },
    );
    assert.ok(
      harnessProcessAlive(holder().owner),
      "the first owner's authorized work is outstanding",
    );
    release("B");
    const second = await verdict(b);
    assert.equal(
      allowed(second),
      false,
      "a second reclaimer of the same dead holder is refused",
    );
    assert.match(
      second.hookSpecificOutput.permissionDecisionReason,
      new RegExp(
        `reserved by another session \\(actor ${actor("A").slice(0, 12)}; host process \\d+(?: started [^)]+)? is alive\\)`,
      ),
    );
    assert.equal(
      holder().actorId,
      actor("A"),
      "the loser preserved the winner's reservation",
    );
    assert.deepEqual(events(), ["reclaimed"]);
    assert.equal(writerEvents(root)[0].previous.actorId, actor("dead"));
    assert.deepEqual([dispatch("A"), dispatch("B")], [true, false]);
    // The loser proceeds only after the winner's accepted finish releases.
    releaseHarnessWriter(root, edit("A"));
    assert.equal(dispatch("B"), true);
    assert.equal(holder().actorId, actor("B"));
    assert.deepEqual(events(), ["reclaimed", "released", "acquired"]);

    // A contender paused after emptying the dead instance but before removing
    // it loses to a placement over the emptied slot and records the retirement.
    releaseHarnessWriter(root, edit("B"));
    seedDead();
    const c = contend("C", "rmdirSync");
    await paused("C");
    assert.equal(dispatch("D"), true, "an emptied instance is an open slot");
    assert.equal(holder().actorId, actor("D"));
    release("C");
    assert.equal(allowed(await verdict(c)), false);
    assert.equal(holder().actorId, actor("D"));
    assert.deepEqual(events().slice(-3), ["released", "acquired", "retired"]);
    assert.equal(writerEvents(root).at(-1).previous.actorId, actor("dead"));
    assert.deepEqual([dispatch("D"), dispatch("C")], [true, false]);
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill("SIGKILL");
    rmSync(root, { recursive: true });
  }
});

test("WO-039 a refreshed reservation survives a stale reclaimer that classified its previous facts", async () => {
  const root = fixture();
  const children = [];
  try {
    const {
      dead,
      actor,
      seed,
      edit,
      contend,
      paused,
      release,
      verdict,
      names,
      holder,
      events,
      dispatch,
    } = raceHarness(root, children);
    // VER-003 F1: the owning session finds its recorded owner dead and records
    // that fact while a contender that classified the previous facts as dead
    // is paused before its unlink. The owner's authorized work is outstanding,
    // so the contender must not remove the refreshed reservation and proceed.
    seed({ actorId: actor("A"), owner: dead });
    const seeded = names()[0];
    const stale = contend("E", "unlinkSync");
    await paused("E");
    assert.equal(
      dispatch("A"),
      true,
      "the owning session keeps its reservation",
    );
    assert.equal(holder().liveness, "unavailable");
    release("E");
    const staleVerdict = await verdict(stale);
    assert.equal(
      allowed(staleVerdict),
      false,
      "a stale reclaimer removed refreshed facts and was admitted",
    );
    assert.match(
      staleVerdict.hookSpecificOutput.permissionDecisionReason,
      new RegExp(
        `reserved by another session \\(actor ${actor("A").slice(0, 12)}; host process \\d+(?: started [^)]+)? is of unknown liveness\\)`,
      ),
    );
    assert.deepEqual(
      {
        actorId: holder().actorId,
        liveness: holder().liveness,
        supersedes: holder().supersedes,
        renamed: names()[0] !== seeded,
        files: names().length,
      },
      {
        actorId: actor("A"),
        liveness: "unavailable",
        supersedes: seeded,
        renamed: true,
        files: 1,
      },
      "the refreshed facts live under a new name that names the superseded one",
    );
    assert.deepEqual(events(), ["liveness-unavailable"]);
    assert.deepEqual([dispatch("A"), dispatch("E")], [true, false]);

    // The other order: the reclaimer removes the previous facts and takes the
    // slot before the owner's refresh lands, so the refresh finds the slot no
    // longer its own, withdraws, and honours the live replacement.
    releaseHarnessWriter(root, edit("A"));
    seed({ actorId: actor("A"), owner: dead });
    const owner = contend("A", "renameSync");
    await paused("A");
    assert.equal(dispatch("M"), true, "the reclaimer takes the emptied slot");
    assert.deepEqual(
      { actorId: holder().actorId, previous: holder().reclaimed.actorId },
      { actorId: actor("M"), previous: actor("A") },
    );
    release("A");
    const ownerVerdict = await verdict(owner);
    assert.equal(allowed(ownerVerdict), false);
    assert.match(
      ownerVerdict.hookSpecificOutput.permissionDecisionReason,
      new RegExp(
        `reserved by another session \\(actor ${actor("M").slice(0, 12)}; host process \\d+(?: started [^)]+)? is alive\\)`,
      ),
    );
    assert.deepEqual(
      { actorId: holder().actorId, files: names().length },
      { actorId: actor("M"), files: 1 },
      "the withdrawn refresh left the replacement's instance alone",
    );
    assert.deepEqual(events().slice(-2), ["released", "reclaimed"]);
    assert.deepEqual([dispatch("M"), dispatch("A")], [true, false]);
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill("SIGKILL");
    rmSync(root, { recursive: true });
  }
});

test("WO-039 an operator release judges, retires and journals one observed reservation", async () => {
  const root = fixture();
  const children = [];
  try {
    const {
      lock,
      actor,
      seedDead,
      edit,
      operate,
      paused,
      release,
      holder,
      events,
      dispatch,
    } = raceHarness(root, children);
    // VER-003 F2: a reclaimer replaces the dead holder after the public
    // release command judged it. The unforced release judges the replacement
    // by the same rule and, finding it alive, refuses; the replacement survives.
    seedDead();
    const unforced = operate("F", "unlinkSync");
    await paused("F");
    assert.equal(dispatch("G"), true);
    assert.deepEqual(
      { actorId: holder().actorId, previous: holder().reclaimed.actorId },
      { actorId: actor("G"), previous: actor("dead") },
    );
    release("F");
    const refusedRelease = await unforced;
    assert.equal(
      refusedRelease.code,
      1,
      `an unforced release removed the live replacement: ${refusedRelease.stdout}`,
    );
    assert.match(refusedRelease.stderr, /owner is alive/);
    assert.equal(
      holder().actorId,
      actor("G"),
      "the live replacement survives an unforced operator release",
    );
    assert.deepEqual(events(), ["reclaimed"]);
    assert.deepEqual([dispatch("G"), dispatch("H")], [true, false]);
    // A forced release binds to the holder the operator judged; once that
    // holder changed, it refuses instead of removing the replacement.
    releaseHarnessWriter(root, edit("G"));
    seedDead();
    const forced = operate("I", "unlinkSync", "--force");
    await paused("I");
    assert.equal(dispatch("J"), true);
    release("I");
    const refusedForce = await forced;
    assert.equal(refusedForce.code, 1, refusedForce.stdout);
    assert.match(refusedForce.stderr, /changed while releasing/);
    assert.equal(holder().actorId, actor("J"));
    assert.ok(!events().includes("operator-released"));
    assert.deepEqual([dispatch("J"), dispatch("K")], [true, false]);
    // Uncontended, the same command releases the dead holder it judged and
    // journals that holder.
    releaseHarnessWriter(root, edit("J"));
    seedDead();
    const plain = spawnSync(
      process.execPath,
      ["scripts/harness.mjs", "writer", "--release"],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(plain.status, 0, plain.stderr);
    assert.deepEqual(
      {
        released: JSON.parse(plain.stdout).released,
        alive: JSON.parse(plain.stdout).alive,
        lock: existsSync(lock),
        journaled: writerEvents(root).at(-1).actorId,
      },
      { released: true, alive: false, lock: false, journaled: actor("dead") },
    );
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill("SIGKILL");
    rmSync(root, { recursive: true });
  }
});
