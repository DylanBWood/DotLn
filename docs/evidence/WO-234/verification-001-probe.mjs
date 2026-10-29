// WO-234 VER-001 independent probe. Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-234/verification-001-probe.mjs <functions|hooks|gate|control|entry>
// Each section builds synthetic roots under the system temporary directory,
// varies what the executor's fixtures held constant and prints one JSON
// result per variation. It writes nothing in the repository.
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
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
  dispatchBoundActivity,
  dispatchBoundMessage,
  dispatchStanding,
  dispatchStandingLine,
  effectiveDispatchLimits,
  requireRedispatchBound,
} from "../../../scripts/lib/dispatch-bound.mjs";
import {
  dispatchKinds,
  readBudgets,
} from "../../../scripts/lib/process-budget.mjs";
import { boundedCommand } from "../../../scripts/lib/bounded-command.mjs";

const repo = process.cwd();
const section = process.argv[2];
const roots = [];
const results = [];
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
const throwsLike = (action, pattern) => {
  try {
    action();
    return { observed: { threw: false }, pass: false };
  } catch (error) {
    const message = hide(String(error?.message ?? error)).slice(0, 400);
    return { observed: { threw: message }, pass: pattern.test(message) };
  }
};
const HOUR = 60 * 60 * 1000;
const T0 = Date.parse("2031-01-01T00:00:00.000Z");
const actor = {
  harness: "claude-code",
  harnessVersion: "probe",
  model: "probe",
  effort: "unknown",
  source: "operator-attested",
};
const acceptance = (workOrderId, phase, metric, ceiling, at) => ({
  type: "DispatchBoundAccepted",
  workOrderId,
  phase,
  metric,
  ceiling,
  reason: "probe acceptance",
  capture: "docs/intake/probe.md",
  captureHash: `sha256:${"a".repeat(64)}`,
  actor,
  recordedAt: iso(at),
});
const activation = (workOrderId, at) => ({
  type: "WorkOrderActivated",
  workOrderId,
  workOrderPath: `docs/work-orders/${workOrderId}-probe.md`,
  recordedAt: iso(at),
});
const gateRow = (over = {}) => ({
  checkId: "npm test",
  executed: true,
  gateSelection: "review",
  exitCode: 0,
  startedAt: iso(T0 + 10),
  recordedAt: iso(T0 + 20),
  ...over,
});

async function functions() {
  // Criterion 1: pre-order files, the current template, validation and partial keys.
  for (const [label, revision] of [
    ["main docs/control/budgets.json", "HEAD:docs/control/budgets.json"],
    ["main kit template", "HEAD:scripts/kit/budgets.template.json"],
  ])
    await check(
      `C1-preorder-${label.includes("kit") ? "kit" : "instance"}`,
      1,
      `${label} (before this order) read by the current readBudgets`,
      "valid; every role's wallClockMs and completeRuns null; repair falls back to null",
      () => {
        const root = fixtureRoot("dotln-ver234-budget-");
        put(
          root,
          "docs/control/budgets.json",
          execFileSync("git", ["show", revision], {
            cwd: repo,
            encoding: "utf8",
          }),
        );
        const budgets = readBudgets(root);
        const values = Object.fromEntries(
          dispatchKinds.map((role) => [
            role,
            [
              budgets.dispatches[role].wallClockMs,
              budgets.dispatches[role].completeRuns,
            ],
          ]),
        );
        const repair = effectiveDispatchLimits(
          budgets,
          "executor",
          "repairing",
          [],
        );
        return {
          observed: {
            values,
            repair: [repair.wallClockMs, repair.completeRuns],
          },
          pass:
            Object.values(values).every(
              ([wall, runs]) => wall === null && runs === null,
            ) &&
            repair.wallClockMs === null &&
            repair.completeRuns === null,
        };
      },
    );
  await check(
    "C1-template-fresh",
    1,
    "current kit template in a consumer with no completed phases",
    "executor, repair, verifier, reviewer 8 h 0 min and 3 runs; release-close, planner, refuter null",
    () => {
      const root = fixtureRoot("dotln-ver234-budget-");
      put(root, "docs/control/budgets.json", JSON.stringify(kit()));
      const { dispatches } = readBudgets(root);
      const observed = {
        executor: [
          dispatches.executor.wallClockMs,
          dispatches.executor.completeRuns,
        ],
        repair: [
          dispatches.executor.repair.wallClockMs,
          dispatches.executor.repair.completeRuns,
        ],
        verifier: [
          dispatches.verifier.wallClockMs,
          dispatches.verifier.completeRuns,
        ],
        reviewer: [
          dispatches.reviewer.wallClockMs,
          dispatches.reviewer.completeRuns,
        ],
        unset: ["release-close", "planner", "refuter"].map((role) => [
          dispatches[role].wallClockMs,
          dispatches[role].completeRuns,
        ]),
        basis: dispatches.executor.wallClockBasis,
      };
      return {
        observed,
        pass:
          [
            observed.executor,
            observed.repair,
            observed.verifier,
            observed.reviewer,
          ].every(([wall, runs]) => wall === 8 * HOUR && runs === 3) &&
          observed.unset.every(
            ([wall, runs]) => wall === null && runs === null,
          ) &&
          observed.basis.sampleCount === 0 &&
          observed.basis.medianMs === null,
      };
    },
  );
  for (const [id, mutate, pattern] of [
    [
      "negative",
      (b) => (b.dispatches.executor.wallClockMs = -1),
      /Invalid budget: executor\.wallClockMs/,
    ],
    [
      "string",
      (b) => (b.dispatches.executor.wallClockMs = "8h"),
      /Invalid budget: executor\.wallClockMs/,
    ],
    [
      "runs-policy",
      (b) => (b.dispatches.verifier.completeRuns = "local-median"),
      /Invalid budget: verifier\.completeRuns/,
    ],
    [
      "unsupported-policy",
      (b) => (b.dispatches.planner.wallClockMs = "local-median"),
      /No completed-phase timing source for planner/,
    ],
    [
      "repair-array",
      (b) => (b.dispatches.executor.repair = []),
      /Invalid dispatch budget for executor/,
    ],
    [
      "repair-negative",
      (b) => (b.dispatches.executor.repair.completeRuns = -2),
      /Invalid budget: executor\.completeRuns/,
    ],
    [
      "role-null",
      (b) => (b.dispatches.reviewer = null),
      /Invalid dispatch budget for reviewer/,
    ],
  ])
    await check(
      `C1-invalid-${id}`,
      1,
      `readBudgets refuses an invalid dispatch bound (${id})`,
      `throws ${pattern}`,
      () => {
        const root = fixtureRoot("dotln-ver234-budget-");
        const budgets = kit();
        mutate(budgets);
        put(root, "docs/control/budgets.json", JSON.stringify(budgets));
        return throwsLike(() => readBudgets(root), pattern);
      },
    );
  await check(
    "C1-partial-key",
    1,
    "an executor entry with wallClockMs but no completeRuns key",
    "completeRuns reads null; wallClockMs keeps its number",
    () => {
      const root = fixtureRoot("dotln-ver234-budget-");
      const budgets = kit();
      budgets.dispatches.executor = {
        tokens: null,
        costUsd: null,
        wallClockMs: 5,
      };
      put(root, "docs/control/budgets.json", JSON.stringify(budgets));
      const { executor } = readBudgets(root).dispatches;
      return {
        observed: [executor.wallClockMs, executor.completeRuns],
        pass: executor.wallClockMs === 5 && executor.completeRuns === null,
      };
    },
  );
  await check(
    "C1-real-record",
    1,
    "local-median on this repository's own record at this session's dispatch start",
    "each supported phase reports max(4 times its median, 8 h 0 min)",
    () => {
      const own = JSON.parse(
        readFileSync(
          join(repo, journalPath(process.env.CLAUDE_CODE_SESSION_ID ?? "")),
          "utf8",
        ),
      );
      const cutoff = (own.boundDispatch ?? own).startedAt;
      const { dispatches } = readBudgets(repo, { cutoff });
      const rows = {
        implementation: dispatches.executor.wallClockBasis,
        repair: dispatches.executor.repair.wallClockBasis,
        verification: dispatches.verifier.wallClockBasis,
        finalReview: dispatches.reviewer.wallClockBasis,
      };
      return {
        observed: Object.fromEntries(
          Object.entries(rows).map(([phase, basis]) => [
            phase,
            {
              sampleCount: basis.sampleCount,
              medianMs: basis.medianMs,
              ceiling: basis.ceiling,
              cutoff: basis.cutoff,
            },
          ]),
        ),
        pass: Object.values(rows).every(
          (basis) =>
            basis.cutoff === cutoff &&
            basis.ceiling === Math.max(4 * (basis.medianMs ?? 0), 8 * HOUR),
        ),
      };
    },
  );

  // Criterion 2: standing states, metrics, row kinds, roles and acceptance scope.
  const root = fixtureRoot("dotln-ver234-standing-");
  const budgets = kit();
  Object.assign(budgets.dispatches.executor, {
    wallClockMs: 1000,
    completeRuns: 2,
    repair: { wallClockMs: 5000, completeRuns: 1 },
  });
  Object.assign(budgets.dispatches.verifier, {
    wallClockMs: 2000,
    completeRuns: null,
  });
  Object.assign(budgets.dispatches.reviewer, {
    wallClockMs: null,
    completeRuns: null,
  });
  put(root, "docs/control/budgets.json", JSON.stringify(budgets));
  const executor = {
    role: "executor",
    intent: "resume: next",
    workOrder: "WO-999",
    startedAt: iso(T0),
  };
  put(root, journalPath("probe-exec"), JSON.stringify(executor));
  const standing = (options = {}) =>
    dispatchStanding(root, {
      session: "probe-exec",
      now: T0 + 1,
      events: [],
      gates: [],
      ...options,
    });
  await check(
    "C2-within",
    2,
    "executor 999 ms into a 1,000 ms bound, no runs",
    "within",
    () => {
      const value = standing({ now: T0 + 999 });
      return {
        observed: [value.state, value.elapsedMs, value.completeRuns],
        pass: value.state === "within",
      };
    },
  );
  await check(
    "C2-wall-equality",
    2,
    "elapsed exactly equal to the wall-clock bound",
    "exceeded on wallClockMs only",
    () => {
      const value = standing({ now: T0 + 1000 });
      return {
        observed: [value.state, value.exceeded],
        pass:
          value.state === "exceeded" &&
          value.exceeded.length === 1 &&
          value.exceeded[0].metric === "wallClockMs",
      };
    },
  );
  await check(
    "C2-runs",
    2,
    "two then one qualifying complete rows against a bound of two",
    "exceeded on completeRuns with two; within with one",
    () => {
      const two = standing({
        gates: [gateRow(), gateRow({ gateSelection: "plain" })],
      });
      const one = standing({ gates: [gateRow()] });
      return {
        observed: [two.state, two.exceeded, one.state, one.completeRuns],
        pass:
          two.state === "exceeded" &&
          two.exceeded[0]?.metric === "completeRuns" &&
          one.state === "within" &&
          one.completeRuns === 1,
      };
    },
  );
  await check(
    "C2-both",
    2,
    "both bounds exhausted together",
    "exceeded lists both metrics; the message names both",
    () => {
      const value = standing({ now: T0 + 5000, gates: [gateRow(), gateRow()] });
      const message = dispatchBoundMessage(value);
      return {
        observed: {
          exceeded: value.exceeded.map((row) => row.metric),
          message: message.slice(0, 160),
        },
        pass:
          value.exceeded.length === 2 &&
          /wall clock=0 h 0 min.*complete runs=2/u.test(message),
      };
    },
  );
  await check(
    "C2-row-kinds",
    2,
    "rows the executor cases held constant: started before the dispatch, single, document, machinery, bound stop, partial, unexecuted, focused suite id",
    "none counted",
    () => {
      const value = standing({
        gates: [
          gateRow({ startedAt: iso(T0 - 10), recordedAt: iso(T0 + 5) }),
          gateRow({ gateSelection: "single" }),
          gateRow({ gateSelection: "document" }),
          gateRow({ gateSelection: "machinery" }),
          gateRow({
            boundStop: { metric: "completeRuns", value: 2, bound: 2 },
          }),
          gateRow({ partial: true }),
          gateRow({ executed: false }),
          gateRow({ checkId: "suite:alpha" }),
        ],
      });
      return { observed: value.completeRuns, pass: value.completeRuns === 0 };
    },
  );
  await check(
    "C2-interrupted-run",
    2,
    "an interrupted (stopped) complete review that consumed time",
    "counted as one run, as product 07 states",
    () => {
      const value = standing({
        gates: [gateRow({ stopped: true, exitCode: 1 })],
      });
      return { observed: value.completeRuns, pass: value.completeRuns === 1 };
    },
  );
  await check(
    "C2-null-and-mixed",
    2,
    "reviewer with both bounds null; verifier with only a wall-clock bound",
    "reviewer unset; verifier within, then exceeded on wall clock only",
    () => {
      const reviewer = dispatchStanding(root, {
        journal: {
          role: "reviewer",
          intent: "resume: final review",
          workOrder: "WO-999",
          startedAt: iso(T0),
        },
        now: T0 + 1e9,
        events: [],
        gates: [gateRow(), gateRow(), gateRow()],
      });
      const verifier = (now) =>
        dispatchStanding(root, {
          journal: {
            role: "verifier",
            intent: "resume: verify",
            workOrder: "WO-999",
            startedAt: iso(T0),
          },
          now,
          events: [],
          gates: [gateRow(), gateRow(), gateRow()],
        });
      const early = verifier(T0 + 1999);
      const late = verifier(T0 + 2000);
      return {
        observed: [
          reviewer.state,
          reviewer.phase,
          early.state,
          late.state,
          late.exceeded.map((row) => row.metric),
        ],
        pass:
          reviewer.state === "unset" &&
          reviewer.phase === "final-review" &&
          early.state === "within" &&
          late.state === "exceeded" &&
          late.exceeded.length === 1,
      };
    },
  );
  await check(
    "C2-repair-limits",
    2,
    "an executor resume: fix journal",
    "phase repairing selects the repair object (5,000 ms, one run)",
    () => {
      const value = dispatchStanding(root, {
        journal: { ...executor, intent: "resume: fix" },
        now: T0 + 4000,
        events: [],
        gates: [gateRow()],
      });
      return {
        observed: [value.phase, value.wallClockMs, value.bound, value.state],
        pass:
          value.phase === "repairing" &&
          value.wallClockMs === 5000 &&
          value.bound === 1 &&
          value.state === "exceeded",
      };
    },
  );
  await check(
    "C2-missing-journal",
    2,
    "no journal file, a journal without a role, and one with an unparseable start",
    "unset with cause no-journal each time",
    () => {
      put(
        root,
        journalPath("probe-norole"),
        JSON.stringify({ startedAt: iso(T0) }),
      );
      put(
        root,
        journalPath("probe-nostart"),
        JSON.stringify({ role: "executor", startedAt: "yesterday" }),
      );
      const values = ["probe-absent", "probe-norole", "probe-nostart"].map(
        (session) => dispatchStanding(root, { session, events: [], gates: [] }),
      );
      return {
        observed: values.map((value) => [value.state, value.cause]),
        pass: values.every(
          (value) => value.state === "unset" && value.cause === "no-journal",
        ),
      };
    },
  );
  await check(
    "C2-malformed-journal",
    2,
    "the session's own journal holds invalid JSON; then an invalid boundDispatch anchor",
    "a named error, never within or exceeded (D013's recorded design)",
    () => {
      put(root, journalPath("probe-broken"), "{ not json");
      put(
        root,
        journalPath("probe-anchor"),
        JSON.stringify({ ...executor, boundDispatch: { role: "executor" } }),
      );
      const broken = throwsLike(
        () =>
          dispatchStanding(root, {
            session: "probe-broken",
            events: [],
            gates: [],
          }),
        /./u,
      );
      const anchor = throwsLike(
        () =>
          dispatchStanding(root, {
            session: "probe-anchor",
            events: [],
            gates: [],
          }),
        /Invalid dispatch-bound journal anchor/u,
      );
      return {
        observed: {
          invalidJson: broken.observed.threw,
          invalidAnchor: anchor.observed.threw,
          namesFile:
            broken.observed.threw?.includes?.(sha("probe-broken")) ?? false,
        },
        pass: broken.pass && anchor.pass,
      };
    },
  );
  await check(
    "C2-acceptance-scope",
    2,
    "finite acceptances: same phase raising, same phase lower than base, other phase, and one before the phase's completion",
    "only the same-phase raise after the latest completion applies",
    () => {
      const at = T0 + 1;
      const raise = acceptance("WO-999", "active", "wallClockMs", 5000, at);
      const lower = acceptance("WO-999", "active", "wallClockMs", 500, at);
      const other = acceptance("WO-999", "verifying", "wallClockMs", 5000, at);
      const values = {
        raise: standing({
          now: T0 + 2000,
          events: [activation("WO-999", T0), raise],
        }),
        lower: standing({
          now: T0 + 2000,
          events: [activation("WO-999", T0), lower],
        }),
        other: standing({
          now: T0 + 2000,
          events: [activation("WO-999", T0), other],
        }),
        completed: standing({
          now: T0 + 2000,
          events: [
            activation("WO-999", T0),
            raise,
            {
              type: "ImplementationReady",
              workOrderId: "WO-999",
              recordedAt: iso(T0 + 2),
            },
          ],
        }),
      };
      return {
        observed: Object.fromEntries(
          Object.entries(values).map(([key, value]) => [
            key,
            [value.state, value.wallClockMs],
          ]),
        ),
        pass:
          values.raise.state === "within" &&
          values.raise.wallClockMs === 5000 &&
          values.lower.wallClockMs === 1000 &&
          values.lower.state === "exceeded" &&
          values.other.state === "exceeded" &&
          values.completed.state === "exceeded",
      };
    },
  );
  await check(
    "C2-acceptance-cross-order",
    2,
    "an acceptance recorded on WO-998 in the real control store; the dispatch belongs to WO-999",
    "WO-999's standing stays exceeded; WO-998's journal is within",
    () => {
      put(
        root,
        "docs/control/orders/WO-998.jsonl",
        [
          activation("WO-998", T0),
          acceptance("WO-998", "active", "wallClockMs", 9e12, T0 + 1),
        ]
          .map((event) => JSON.stringify(event))
          .join("\n") + "\n",
      );
      put(
        root,
        "docs/control/orders/WO-999.jsonl",
        JSON.stringify(activation("WO-999", T0)) + "\n",
      );
      const own = dispatchStanding(root, {
        session: "probe-exec",
        now: T0 + 2000,
        gates: [],
      });
      const neighbour = dispatchStanding(root, {
        journal: { ...executor, workOrder: "WO-998" },
        now: T0 + 2000,
        gates: [],
      });
      return {
        observed: [own.state, own.acceptance, neighbour.state],
        pass:
          own.state === "exceeded" &&
          own.acceptance === null &&
          neighbour.state === "within",
      };
    },
  );
  await check(
    "C2-unlimited-one-metric",
    2,
    "an as-needed acceptance on wallClockMs alone",
    "wall clock lifts (standing line says as needed); the run bound still holds",
    () => {
      const events = [
        activation("WO-999", T0),
        acceptance("WO-999", "active", "wallClockMs", null, T0 + 1),
      ];
      const wall = standing({ now: T0 + 1e9, events });
      const runs = standing({
        now: T0 + 1e9,
        events,
        gates: [gateRow(), gateRow()],
      });
      return {
        observed: [
          wall.state,
          wall.wallClockMs,
          dispatchStandingLine(wall),
          runs.state,
          runs.exceeded.map((row) => row.metric),
        ],
        pass:
          wall.state === "within" &&
          wall.wallClockMs === null &&
          /dispatch standing: .* of as needed; complete runs 0 of 2; within/u.test(
            dispatchStandingLine(wall),
          ) &&
          runs.state === "exceeded" &&
          runs.exceeded.length === 1 &&
          runs.exceeded[0].metric === "completeRuns",
      };
    },
  );

  // Criterion 4: the probe wrapper on the run metric, a verifier role and diagnostic selections.
  const wrapper = fixtureRoot("dotln-ver234-wrapper-");
  const wrapperBudgets = kit();
  Object.assign(wrapperBudgets.dispatches.verifier, {
    wallClockMs: null,
    completeRuns: 0,
  });
  put(wrapper, "docs/control/budgets.json", JSON.stringify(wrapperBudgets));
  put(
    wrapper,
    journalPath("probe-wrapper"),
    JSON.stringify({
      role: "verifier",
      intent: "resume: verify",
      workOrder: "WO-999",
      startedAt: new Date().toISOString(),
    }),
  );
  put(
    wrapper,
    "package.json",
    JSON.stringify({ private: true, scripts: { test: "node diagnostic.mjs" } }),
  );
  put(
    wrapper,
    "diagnostic.mjs",
    'import { writeFileSync } from "node:fs";\nwriteFileSync("diagnostic-ran", process.argv.slice(2).join(" "));\n',
  );
  const saved = Object.fromEntries(
    [
      "CODEX_THREAD_ID",
      "COPILOT_AGENT_SESSION_ID",
      "CLAUDE_CODE_SESSION_ID",
      "CLAUDE_SESSION_ID",
    ].map((name) => [name, process.env[name]]),
  );
  for (const name of Object.keys(saved)) delete process.env[name];
  process.env.CLAUDE_CODE_SESSION_ID = "probe-wrapper";
  try {
    await check(
      "C4-refusal-before-launch",
      4,
      "verifier dispatch with completeRuns 0 (run metric, not wall clock); probe would write a marker",
      "rejects with DOTLN_DISPATCH_BOUND equal to the shared message; marker absent; one probe stop recorded",
      async () => {
        const expected = dispatchBoundMessage(
          dispatchStanding(wrapper, { session: "probe-wrapper" }),
        );
        let message;
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
          message = error.message;
        }
        const stops = existsSync(
          join(
            wrapper,
            `docs/control/local/harness/${sha("probe-wrapper")}.jsonl`,
          ),
        )
          ? readFileSync(
              join(
                wrapper,
                `docs/control/local/harness/${sha("probe-wrapper")}.jsonl`,
              ),
              "utf8",
            )
              .trim()
              .split("\n")
              .map((line) => JSON.parse(line))
          : [];
        const sameText = (text) =>
          text?.replace(/\d+ h \d+ min/gu, "<duration>");
        return {
          observed: {
            message: message?.slice(0, 220),
            sameAsShared: sameText(message) === sameText(expected),
            marker: existsSync(join(wrapper, "probe-ran")),
            stops: stops.map((row) => [
              row.source,
              row.role,
              row.boundStop?.metric,
            ]),
          },
          pass:
            /^DOTLN_DISPATCH_BOUND: complete runs=0, bound=0\./u.test(
              message ?? "",
            ) &&
            sameText(message) === sameText(expected) &&
            !existsSync(join(wrapper, "probe-ran")) &&
            stops.length === 1 &&
            stops[0].source === "probe",
        };
      },
    );
    await check(
      "C4-diagnostic-admitted",
      4,
      "past the bound: harness bounded -- npm test -- --only alpha",
      "admitted (the wrapped command runs)",
      async () => {
        const result = await boundedCommand(
          ["--", "npm", "test", "--", "--only", "alpha"],
          wrapper,
          { cwd: wrapper, report: () => {}, output: () => {} },
        );
        return {
          observed: {
            exitCode: result.exitCode,
            ran: existsSync(join(wrapper, "diagnostic-ran")),
          },
          pass:
            result.exitCode === 0 &&
            existsSync(join(wrapper, "diagnostic-ran")),
        };
      },
    );
    await check(
      "C4-within-runs",
      4,
      "within the bound (completeRuns 3): a probe exiting 5",
      "runs as today; exit 5 returned",
      async () => {
        wrapperBudgets.dispatches.verifier.completeRuns = 3;
        put(
          wrapper,
          "docs/control/budgets.json",
          JSON.stringify(wrapperBudgets),
        );
        const result = await boundedCommand(
          ["--", process.execPath, "-e", "process.exit(5)"],
          wrapper,
          { cwd: wrapper, report: () => {}, output: () => {} },
        );
        return { observed: result.exitCode, pass: result.exitCode === 5 };
      },
    );
  } finally {
    for (const [name, value] of Object.entries(saved))
      value === undefined
        ? delete process.env[name]
        : (process.env[name] = value);
  }

  // Criterion 5: the lifecycle's same-phase anchor through the real control store.
  const life = fixtureRoot("dotln-ver234-lifecycle-");
  const lifeBudgets = kit();
  Object.assign(lifeBudgets.dispatches.executor, {
    wallClockMs: null,
    completeRuns: 1,
  });
  put(life, "docs/control/budgets.json", JSON.stringify(lifeBudgets));
  put(
    life,
    "docs/control/orders/WO-997.jsonl",
    JSON.stringify(activation("WO-997", T0)) + "\n",
  );
  put(
    life,
    "docs/control/orders/WO-996.jsonl",
    JSON.stringify(activation("WO-996", T0)) + "\n",
  );
  put(
    life,
    journalPath("probe-first"),
    JSON.stringify({
      role: "executor",
      intent: "resume: next",
      workOrder: "WO-997",
      startedAt: iso(T0 + 100),
    }),
  );
  put(
    life,
    journalPath("probe-second"),
    JSON.stringify({
      role: "executor",
      intent: "resume: next",
      workOrder: "WO-997",
      startedAt: iso(T0 + 5000),
    }),
  );
  const runRows = [
    gateRow({ startedAt: iso(T0 + 200), recordedAt: iso(T0 + 300) }),
  ];
  // requireRedispatchBound reads gate rows from the checkout, so record them there.
  const { recordGateChecks } =
    await import("../../../scripts/lib/gate-evidence.mjs");
  await check(
    "C5-redispatch-run-metric",
    5,
    "next for WO-997 after an earlier thread's complete run (completeRuns 1), with a later second thread journal",
    "refused on completeRuns from the earliest anchor; WO-996 (no journal) admitted",
    () => {
      recordGateChecks(life, [
        {
          ...runRows[0],
          treeHash: "a".repeat(40),
          codeIdentity: "b".repeat(64),
          evidenceRef: "host-gate:probe:npm test",
        },
      ]);
      const refusal = throwsLike(
        () =>
          requireRedispatchBound(life, {
            workOrder: "WO-997",
            intent: "resume: next",
            now: T0 + 6000,
          }),
        /DOTLN_DISPATCH_BOUND: complete runs=1, bound=1/u,
      );
      const neighbour = requireRedispatchBound(life, {
        workOrder: "WO-996",
        intent: "resume: next",
        now: T0 + 6000,
      });
      return {
        observed: { refusal: refusal.observed.threw?.slice(0, 120), neighbour },
        pass: refusal.pass && neighbour === null,
      };
    },
  );
  await check(
    "C5-redispatch-acceptance",
    5,
    "the same refusal after a completeRuns acceptance of 2 on WO-997's control log",
    "admitted (within)",
    () => {
      put(
        life,
        "docs/control/orders/WO-997.jsonl",
        [
          activation("WO-997", T0),
          acceptance("WO-997", "active", "completeRuns", 2, T0 + 5500),
        ]
          .map((event) => JSON.stringify(event))
          .join("\n") + "\n",
      );
      const value = requireRedispatchBound(life, {
        workOrder: "WO-997",
        intent: "resume: next",
        now: T0 + 6000,
      });
      return {
        observed: [
          value?.state,
          value?.bound,
          value?.completeRuns,
          value?.startedAt,
        ],
        pass:
          value?.state === "within" &&
          value.bound === 2 &&
          value.completeRuns === 1 &&
          value.startedAt === iso(T0 + 100),
      };
    },
  );
  await check(
    "C5-unrelated-malformed-journal",
    5,
    "an unrelated session's journal in the same lane holds invalid JSON",
    "D013 design: the lifecycle read names the damaged file rather than inventing an anchor",
    () => {
      put(
        life,
        `docs/control/local/harness/${"c".repeat(64)}.json`,
        "{ truncated",
      );
      const result = throwsLike(
        () =>
          requireRedispatchBound(life, {
            workOrder: "WO-996",
            intent: "resume: next",
            now: T0 + 6000,
          }),
        /Invalid dispatch journal .*c{64}\.json/u,
      );
      return result;
    },
  );

  // Criterion 7: stop activity with an intervening other-order event and role filtering.
  await check(
    "C7-repair-delay",
    7,
    "one executor stop followed 90 s later by RepairRequested, another order's event in between, and a verifier view",
    "afterStop names RepairRequested with 90,000 ms; the verifier view has no stops",
    () => {
      const stop = {
        metric: "completeRuns",
        value: 3,
        bound: 3,
        at: iso(T0),
        workOrder: "WO-995",
        role: "executor",
        phase: "repairing",
        source: "gate",
      };
      const events = [
        {
          type: "WorkOrderActivated",
          workOrderId: "WO-994",
          recordedAt: iso(T0 + 30_000),
        },
        {
          type: "RepairRequested",
          workOrderId: "WO-995",
          recordedAt: iso(T0 + 90_000),
        },
        {
          type: "RepairCompleted",
          workOrderId: "WO-995",
          recordedAt: iso(T0 + 200_000),
        },
      ];
      const all = dispatchBoundActivity(events, [stop]);
      const verifier = dispatchBoundActivity(events, [stop], "verifier");
      return {
        observed: {
          afterStop: all.afterStop,
          verifierStops: verifier.boundStops.count,
        },
        pass:
          all.boundStops.count === 1 &&
          all.afterStop[0].nextEvent === "RepairRequested" &&
          all.afterStop[0].delayMs === 90_000 &&
          verifier.boundStops.count === 0,
      };
    },
  );
}

async function hookFixture(source, label) {
  const { emitHarness } = await import(
    pathToFileURL(join(source, "scripts/lib/harness.mjs")).href
  );
  const root = fixtureRoot(`dotln-ver234-${label}-`);
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

async function hooks() {
  const root = await hookFixture(repo, "hooks");
  const budgets = kit();
  Object.assign(budgets.dispatches.verifier, {
    wallClockMs: null,
    completeRuns: 0,
  });
  put(root, "docs/control/budgets.json", JSON.stringify(budgets));
  const session = "probe-hook-session";
  const writeJournal = (text) => put(root, journalPath(session), text);
  writeJournal(
    JSON.stringify({
      role: "verifier",
      intent: "resume: verify",
      workOrder: "WO-999",
      startedAt: new Date().toISOString(),
      startingEventCount: 1,
      reads: [],
    }),
  );
  const env = { ...process.env, CLAUDE_PID: String(process.pid) };
  for (const name of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
    "CLAUDE_PROJECT_DIR",
  ])
    delete env[name];
  const invoke = (hook, payload) => {
    const run = spawnSync(
      process.execPath,
      [join(root, `.claude/hooks/${hook}.mjs`)],
      {
        cwd: root,
        env,
        input: JSON.stringify({ cwd: root, session_id: session, ...payload }),
        encoding: "utf8",
        timeout: 60_000,
      },
    );
    if (run.status !== 0)
      throw new Error(
        `hook ${hook} exited ${run.status}: ${run.stderr.slice(0, 300)}`,
      );
    return JSON.parse(run.stdout || "{}");
  };
  const bash = (command) =>
    invoke("permissions", {
      hook_event_name: "PreToolUse",
      tool_name: "Bash",
      tool_input: { command },
    });
  const denied = (result) =>
    result.hookSpecificOutput?.permissionDecision === "deny";
  const reason = (result) =>
    result.hookSpecificOutput?.permissionDecisionReason ?? "";
  const starts = [
    "npm test",
    "npm run test",
    "npm run test:full",
    "npm test -- --review --keep-going",
    "node scripts/test-runner.mjs --review",
    "cd . && npm test -- --review",
    "node scripts/harness.mjs bounded -- node -e 0",
  ];
  await check(
    "C6-starts-run-metric",
    6,
    "verifier session, completeRuns 0 (run metric), complete-selection spellings the executor's cases did not use, and a bounded probe",
    "each denied with DOTLN_DISPATCH_BOUND naming analysis: and accept-overrun",
    () => {
      const observed = Object.fromEntries(
        starts.map((command) => {
          const result = bash(command);
          return [
            command,
            denied(result)
              ? /DOTLN_DISPATCH_BOUND: complete runs=0, bound=0\..*analysis:.*accept-overrun/u.test(
                  reason(result),
                )
                ? "denied-bound"
                : `denied-other: ${reason(result).slice(0, 120)}`
              : "admitted",
          ];
        }),
      );
      return {
        observed,
        pass: Object.values(observed).every(
          (value) => value === "denied-bound",
        ),
      };
    },
  );
  await check(
    "C6-worker-launch",
    6,
    "verifier session past the run bound launches an Agent worker",
    "denied with DOTLN_DISPATCH_BOUND",
    () => {
      const result = invoke("permissions", {
        hook_event_name: "PreToolUse",
        tool_name: "Agent",
        tool_input: { description: "probe", prompt: "probe" },
      });
      return {
        observed: denied(result) ? reason(result).slice(0, 80) : "admitted",
        pass: denied(result) && /^DOTLN_DISPATCH_BOUND/u.test(reason(result)),
      };
    },
  );
  const diagnostics = [
    "npm run test:docs",
    "npm test -- --only skeleton",
    "npm test -- --list",
    "node scripts/harness.mjs bounded -- npm test -- --only skeleton",
    "git status --short",
    "node scripts/harness.mjs usage probe-hook-session",
    "cat fixture.ts",
  ];
  await check(
    "C6-diagnosis-admitted",
    6,
    "past the bound: document check, focused and listing selections, a bounded focused probe, reads and the usage readback",
    "none denied by the bound",
    () => {
      const observed = Object.fromEntries(
        diagnostics.map((command) => {
          const result = bash(command);
          return [
            command,
            denied(result)
              ? `denied: ${reason(result).slice(0, 100)}`
              : "admitted",
          ];
        }),
      );
      return {
        observed,
        pass: Object.values(observed).every(
          (value) => !/DOTLN_DISPATCH_BOUND/u.test(value),
        ),
      };
    },
  );
  await check(
    "C6-stop-standing",
    6,
    "Stop hook at the exhausted run bound",
    "system message carries the standing line in hours and minutes",
    () => {
      const message =
        invoke("finish", { hook_event_name: "Stop" }).systemMessage ?? "";
      const line = message
        .split("\n")
        .find((text) => text.startsWith("dispatch standing:"));
      return {
        observed: line,
        pass: /^dispatch standing: \d+ h \d+ min of unset; complete runs 0 of 0; exceeded$/u.test(
          line ?? "",
        ),
      };
    },
  );
  await check(
    "C6-within-admitted",
    6,
    "the same verifier within its bound (completeRuns 3)",
    "npm test -- --review admitted; Stop line says within",
    () => {
      budgets.dispatches.verifier.completeRuns = 3;
      put(root, "docs/control/budgets.json", JSON.stringify(budgets));
      const result = bash("npm test -- --review");
      const line = (
        invoke("finish", { hook_event_name: "Stop" }).systemMessage ?? ""
      )
        .split("\n")
        .find((text) => text.startsWith("dispatch standing:"));
      return {
        observed: {
          decision: denied(result) ? reason(result).slice(0, 100) : "admitted",
          line,
        },
        pass: !denied(result) && /; within$/u.test(line ?? ""),
      };
    },
  );
  await check(
    "C6-malformed-journal",
    6,
    "the session journal is unparseable while the bound would be exhausted",
    "no DOTLN_DISPATCH_BOUND denial; the outcome is recorded as observed",
    () => {
      budgets.dispatches.verifier.completeRuns = 0;
      put(root, "docs/control/budgets.json", JSON.stringify(budgets));
      writeJournal("{ not json");
      const result = bash("npm test -- --review");
      const line = (
        invoke("finish", { hook_event_name: "Stop" }).systemMessage ?? ""
      )
        .split("\n")
        .find((text) => text.startsWith("dispatch standing:"));
      return {
        observed: {
          decision: denied(result)
            ? `denied: ${reason(result).slice(0, 160)}`
            : "admitted",
          advisory: (
            result.systemMessage ??
            result.hookSpecificOutput?.additionalContext ??
            ""
          ).slice(0, 200),
          stopLine: line?.slice(0, 160),
        },
        pass: !/DOTLN_DISPATCH_BOUND/u.test(reason(result)),
      };
    },
  );
}

async function gate() {
  const { runGate } = await import("../../../scripts/test-runner.mjs");
  const { readGateChecks } =
    await import("../../../scripts/lib/gate-evidence.mjs");
  const options = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  const build = (role, intent, limits) => {
    const root = fixtureRoot("dotln-ver234-gate-");
    runGit(root, ["init", "-b", "main"], options);
    excludeFixtureOwnership(root);
    put(root, ".gitignore", "docs/control/local/\nran.txt\n");
    put(
      root,
      "scripts/host.mjs",
      `import {checkHost} from ${JSON.stringify(pathToFileURL(join(repo, "scripts/structural-checks.mjs")).href)};
const sample={level:"normal",pressure:0,swapBytes:0,physicalBytes:2**36,source:"probe"};
const result=checkHost(sample,{limits:{taskBytes:2**30,hostLanes:8},requiredPeakBytes:0,fileEvents:{}});
console.log("STRUCTURAL_RESULT "+JSON.stringify(result)); process.exitCode=result.exitCode;`,
    );
    const budgets = kit();
    Object.assign(budgets.dispatches[role], limits);
    put(root, "docs/control/budgets.json", JSON.stringify(budgets));
    put(
      root,
      journalPath("probe-gate"),
      JSON.stringify({
        role,
        intent,
        workOrder: "WO-999",
        startedAt: new Date().toISOString(),
      }),
    );
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
  process.env.CLAUDE_CODE_SESSION_ID = "probe-gate";
  try {
    for (const [id, role, intent, limits, args, metric] of [
      [
        "verifier-runs-keep-going",
        "verifier",
        "resume: verify",
        { wallClockMs: null, completeRuns: 0 },
        ["--review", "--serial", "--again", "--keep-going"],
        "completeRuns",
      ],
      [
        "reviewer-wall-plain",
        "reviewer",
        "resume: final review",
        { wallClockMs: 0, completeRuns: null },
        ["--serial", "--again"],
        "wallClockMs",
      ],
    ])
      await check(
        `C3-${id}`,
        3,
        `${role} dispatch, ${metric} exhausted, runGate ${args.join(" ")} under a Claude session variable`,
        "complete selection refused at host; alpha never runs; the row records boundStop and the owning dispatch; message names metric, value, bound, analysis: and accept-overrun; a focused --only alpha still runs",
        async () => {
          const root = build(role, intent, limits);
          const stopped = await runGate(args, root, { table });
          const rows = readGateChecks(root);
          const row = rows.find((entry) => entry.checkId === "npm test");
          const hostOutput =
            (row?.cases ?? []).find((entry) => entry.name === "host")?.output ??
            "";
          const ranAfterStop = existsSync(join(root, "ran.txt"));
          const focused = await runGate(["--only", "alpha", "--serial"], root, {
            table,
          });
          return {
            observed: {
              exitCode: stopped.exitCode,
              boundStop: stopped.boundStop,
              dispatchBound: stopped.dispatchBound && {
                role: stopped.dispatchBound.role,
                phase: stopped.dispatchBound.phase,
              },
              rowBoundStop: row?.boundStop,
              rowSelection: row?.gateSelection,
              hostOutput: hostOutput.slice(0, 200),
              alphaRanAfterStop: ranAfterStop,
              focusedExit: focused.exitCode,
              focusedRan: existsSync(join(root, "ran.txt")),
            },
            pass:
              stopped.exitCode === 1 &&
              stopped.boundStop?.metric === metric &&
              stopped.dispatchBound?.role === role &&
              row?.boundStop?.metric === metric &&
              !ranAfterStop &&
              focused.exitCode === 0 &&
              existsSync(join(root, "ran.txt")),
          };
        },
      );
  } finally {
    for (const [name, value] of Object.entries(saved))
      value === undefined
        ? delete process.env[name]
        : (process.env[name] = value);
  }
}

// Criterion 3's paired control through the real runner: the base arm runs
// HEAD's runner and host check (extracted from Git) on an identical fixture.
async function control() {
  const base = fixtureRoot("dotln-ver234-base-");
  const archive = execFileSync(
    "git",
    [
      "archive",
      "HEAD",
      "--",
      "scripts",
      "packages/skeleton/src",
      "packages/compiler/src",
      "packages/kernel/src",
      "packages/beacons",
      "package.json",
    ],
    { cwd: repo, maxBuffer: 256 * 1024 * 1024 },
  );
  const untar = spawnSync("tar", ["-x", "-C", base], { input: archive });
  if (untar.status !== 0)
    throw new Error(`base extraction failed: ${untar.stderr}`);
  symlinkSync(join(repo, "node_modules"), join(base, "node_modules"));
  for (const name of ["skeleton", "compiler", "kernel"])
    symlinkSync(
      join(repo, `packages/${name}/dist`),
      join(base, `packages/${name}/dist`),
    );
  const options = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
  const arms = { base, current: repo };
  const runners = {
    base: (
      await import(pathToFileURL(join(base, "scripts/test-runner.mjs")).href)
    ).runGate,
    current: (await import("../../../scripts/test-runner.mjs")).runGate,
  };
  const saved = Object.fromEntries(
    [
      "CODEX_THREAD_ID",
      "COPILOT_AGENT_SESSION_ID",
      "CLAUDE_CODE_SESSION_ID",
      "CLAUDE_SESSION_ID",
    ].map((name) => [name, process.env[name]]),
  );
  for (const name of Object.keys(saved)) delete process.env[name];
  process.env.CLAUDE_CODE_SESSION_ID = "probe-control";
  const cases = [];
  try {
    for (const metric of ["wallClockMs", "completeRuns"])
      for (const [selection, args] of [
        ["complete review", ["--review", "--serial", "--again"]],
        ["focused reproduction", ["--only", "alpha", "--serial", "--again"]],
      ]) {
        const row = { metric, selection };
        for (const [arm, source] of Object.entries(arms)) {
          const root = fixtureRoot("dotln-ver234-control-");
          runGit(root, ["init", "-b", "main"], options);
          excludeFixtureOwnership(root);
          put(root, ".gitignore", "docs/control/local/\nran.txt\n");
          put(
            root,
            "scripts/host.mjs",
            `import {checkHost} from ${JSON.stringify(pathToFileURL(join(source, "scripts/structural-checks.mjs")).href)};
const result=checkHost({level:"normal",pressure:0,swapBytes:0,physicalBytes:2**36,source:"probe"},{limits:{taskBytes:2**30,hostLanes:8},requiredPeakBytes:0,fileEvents:{}});
console.log("STRUCTURAL_RESULT "+JSON.stringify(result)); process.exitCode=result.exitCode;`,
          );
          const budgets = kit();
          Object.assign(budgets.dispatches.executor, {
            wallClockMs: null,
            completeRuns: null,
            [metric]: 0,
          });
          put(root, "docs/control/budgets.json", JSON.stringify(budgets));
          put(
            root,
            journalPath("probe-control"),
            JSON.stringify({
              role: "executor",
              intent: "resume: next",
              workOrder: "WO-999",
              startedAt: new Date().toISOString(),
            }),
          );
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
          const result = await runners[arm](args, root, { table });
          row[arm] = {
            exitCode: result.exitCode,
            boundStop: result.boundStop ?? null,
            alphaRan: existsSync(join(root, "ran.txt")),
          };
        }
        cases.push(row);
      }
  } finally {
    for (const [name, value] of Object.entries(saved))
      value === undefined
        ? delete process.env[name]
        : (process.env[name] = value);
  }
  for (const row of cases)
    await check(
      `C3-control-${row.metric}-${row.selection.split(" ")[0]}`,
      3,
      `paired runner control: ${row.metric} exhausted, ${row.selection}, base HEAD runner and current runner on identical fixtures`,
      row.selection === "complete review"
        ? "base admits (exit 0, alpha runs); current refuses (exit 1, alpha not run, boundStop on the metric)"
        : "both admit (exit 0, alpha runs)",
      () => ({
        observed: { base: row.base, current: row.current },
        pass:
          row.base.exitCode === 0 &&
          row.base.alphaRan &&
          (row.selection === "complete review"
            ? row.current.exitCode === 1 &&
              !row.current.alphaRan &&
              row.current.boundStop?.metric === row.metric
            : row.current.exitCode === 0 && row.current.alphaRan),
      }),
    );
}

// A paired dispatch-entry control: the same fresh verifier session enters a
// clean lane, then a lane holding one damaged unrelated journal. The base arm
// uses HEAD's scripts and the main checkout's runtime built from that commit,
// read without modification; the current arm uses this worktree.
async function entry() {
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
  const base = fixtureRoot("dotln-ver234-entry-base-");
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
  // Base workspace names resolve to the base packages; third-party modules are shared.
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
    baseHostVersion: /HARNESS_HOST_VERSION = "([^"]+)"/u.exec(
      readFileSync(join(base, "packages/skeleton/dist/src/version.js"), "utf8"),
    )?.[1],
  };
  if (head !== mainHead || !mainClean || provenance.baseRuntimeHasBound)
    throw new Error(
      `base runtime provenance does not match HEAD: ${JSON.stringify(provenance)}`,
    );
  const arms = {};
  for (const [arm, source] of [
    ["base", base],
    ["current", repo],
  ]) {
    const root = await hookFixture(source, `entry-${arm}`);
    // Each arm's own kit template; the current arm exhausts the verifier's run bound.
    const budgets = JSON.parse(
      readFileSync(join(source, "scripts/kit/budgets.template.json"), "utf8"),
    );
    if (arm === "current")
      Object.assign(budgets.dispatches.verifier, {
        wallClockMs: null,
        completeRuns: 0,
      });
    put(root, "docs/control/budgets.json", JSON.stringify(budgets));
    const env = { ...process.env, CLAUDE_PID: String(process.pid) };
    for (const name of [
      "CODEX_THREAD_ID",
      "COPILOT_AGENT_SESSION_ID",
      "CLAUDE_CODE_SESSION_ID",
      "CLAUDE_SESSION_ID",
      "CLAUDE_PROJECT_DIR",
    ])
      delete env[name];
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
    const enter = (id) => {
      const start = run("session", id, {
        hook_event_name: "SessionStart",
        source: "startup",
      });
      const prompt = run("session", id, {
        hook_event_name: "UserPromptSubmit",
        prompt: "resume: verify",
      });
      const file = join(root, journalPath(id));
      const state = existsSync(file)
        ? JSON.parse(readFileSync(file, "utf8"))
        : null;
      const write = run("permissions", id, {
        hook_event_name: "PreToolUse",
        tool_name: "Write",
        tool_input: {
          file_path: join(tmpdir(), "dotln-ver234-entry-probe.txt"),
          content: "probe",
        },
      });
      const review = run("permissions", id, {
        hook_event_name: "PreToolUse",
        tool_name: "Bash",
        tool_input: { command: "npm test -- --review" },
      });
      const advisory =
        JSON.stringify(prompt.output)
          .match(/advisory[^"\\]*/u)?.[0]
          ?.slice(0, 220) ?? null;
      const decision = (result) =>
        result.output.hookSpecificOutput?.permissionDecision === "deny"
          ? `denied: ${String(result.output.hookSpecificOutput.permissionDecisionReason).slice(0, 120)}`
          : "admitted";
      let standing = null;
      if (arm === "current")
        try {
          const value = dispatchStanding(root, { session: id });
          standing = {
            state: value.state,
            cause: value.cause ?? null,
            bound: value.bound,
          };
        } catch (error) {
          // A named unavailable standing is D013's recorded outcome.
          standing = {
            state: "unavailable",
            cause: hide(String(error.message)).slice(0, 160),
          };
        }
      return {
        startStatus: start.status,
        promptStatus: prompt.status,
        role: state?.role ?? null,
        advisory,
        systemTempWrite: decision(write),
        completeReview: decision(review),
        standing,
      };
    };
    const clean = enter("probe-entry-clean");
    put(
      root,
      `docs/control/local/harness/${"c".repeat(64)}.json`,
      "{ truncated",
    );
    arms[arm] = { clean, damaged: enter("probe-entry-damaged") };
  }
  await check(
    "R1-entry-damaged-lane",
    "regression",
    "paired dispatch entry beside one damaged unrelated journal; base is main's runtime at the same commit",
    "both arms bind the verifier role and admit its granted temp write beside the damaged journal, as main does; the current arm's bound is computed or named unavailable, never silently unset",
    () => ({
      observed: { provenance, ...arms },
      pass:
        arms.base.damaged.role === "verifier" &&
        arms.base.damaged.systemTempWrite === "admitted" &&
        arms.current.damaged.role === "verifier" &&
        arms.current.damaged.systemTempWrite === "admitted" &&
        arms.current.damaged.standing?.state !== "unset",
    }),
  );
}

try {
  if (section === "functions") await functions();
  else if (section === "entry") await entry();
  else if (section === "hooks") await hooks();
  else if (section === "gate") await gate();
  else if (section === "control") await control();
  else
    throw new Error(
      "usage: verification-001-probe.mjs <functions|hooks|gate|control|entry>",
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
  for (const root of roots)
    removeTemporaryPath(root, { recursive: true, force: true });
}
