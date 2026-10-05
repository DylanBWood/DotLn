// Independent safety probe for WO-186 VER-003: random gate histories in a main
// checkout and a linked worktree at one code identity. An oracle written here
// (not the subject's decidingExecution) says which task results a claim or a
// carried pass may stand on; any accepted row or carried task the oracle calls
// unsafe is a violation.
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const subject = process.argv[2];
const scratch = process.argv[3];
const histories = Number(process.argv[4] ?? 600);
const { gateCodeIdentity, gateTreeHash, recordGateChecks } = await import(
  `${subject}/scripts/lib/gate-evidence.mjs`
);
const { coveringGateCheck, coveringTaskResults } = await import(
  `${subject}/scripts/lib/gate-reuse.mjs`
);
const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, encoding: "utf8" });
const base = mkdtempSync(join(scratch, "fuzz-"));
const repo = join(base, "main");
mkdirSync(join(repo, "scripts"), { recursive: true });
git(base, "init", "-q", "-b", "main", repo);
git(repo, "config", "user.name", "Fixture");
git(repo, "config", "user.email", "fixture@example.invalid");
writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
for (const n of ["build", "alpha", "beta"])
  writeFileSync(
    join(repo, `scripts/${n}.mjs`),
    `export const n=${JSON.stringify(n)};\n`,
  );
git(repo, "add", ".");
git(repo, "commit", "-qm", "fixture");
const worktree = join(base, "wt");
git(repo, "worktree", "add", "-q", "-b", "work", worktree);
const identity = gateCodeIdentity(worktree);
if (identity !== gateCodeIdentity(repo)) throw new Error("identities differ");
const tree = gateTreeHash(worktree);
const TASKS = ["build", "alpha", "beta"];
const tasks = TASKS.map((name) => ({ name }));
let seed = Number(process.argv[5] ?? 186);
const rand = () =>
  (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = (xs) => xs[Math.floor(rand() * xs.length)];
const FAILURES = [
  null,
  null,
  null,
  null,
  { abandonedRoots: ["r"] },
  { stopped: true },
  { timedOut: true },
  { identityUnchanged: false },
  { buildOutputUnchanged: false },
  { memory: { failure: { kind: "m" } } },
];
let violations = [],
  stats = {
    histories: 0,
    accepted: 0,
    acceptedMain: 0,
    acceptedWorktree: 0,
    carried: 0,
    disagreements: 0,
  };
for (let h = 0; h < histories; h++) {
  for (const dir of [repo, worktree])
    rmSync(join(dir, "docs/control/local"), { recursive: true, force: true });
  const events = [];
  let clock = Date.parse("2026-10-05T00:00:00Z");
  const mainRows = [];
  const mainFirst = process.argv[6] === "mainFirst";
  const n = 1 + Math.floor(rand() * 6) + (mainFirst ? 1 : 0);
  for (let e = 0; e < n; e++) {
    const where =
      mainFirst && e === 0 ? "main" : rand() < 0.4 ? "main" : "worktree";
    const check =
      mainFirst && e === 0
        ? "npm test"
        : pick(
            mainFirst && where === "worktree"
              ? ["suite:beta", "suite:alpha", "suite:beta", "npm test"]
              : ["npm test", "npm test", "suite:beta", "suite:alpha"],
          );
    const failure = mainFirst && e === 0 ? null : pick(FAILURES);
    const names =
      check === "npm test"
        ? TASKS
        : [...(rand() < 0.5 ? ["build"] : []), check.slice(6)];
    const at = (clock += 1000);
    const timeline = names.map((name, i) => {
      // A worktree npm test row may carry a task from main's latest passing complete row.
      if (
        where === "worktree" &&
        check === "npm test" &&
        mainRows.length &&
        rand() < 0.4
      ) {
        const src = pick(mainRows);
        return {
          name,
          executed: true,
          exitCode: 0,
          durationMs: 0,
          reused: true,
          sourceRow: {
            task: name,
            codeIdentity: identity,
            treeHash: tree,
            recordedAt: src.recordedAt,
            evidenceRef: src.evidenceRef,
            location: "main",
          },
        };
      }
      const pass = (mainFirst && e === 0) || rand() < 0.75;
      return {
        name,
        executed: true,
        exitCode: pass ? 0 : 1,
        durationMs: 1,
        finishedAt: new Date(at - 100 + i).toISOString(),
      };
    });
    const allPass = timeline.every((r) => r.exitCode === 0);
    const row = {
      checkId: check,
      codeIdentity: identity,
      treeHash: tree,
      executed: true,
      exitCode: allPass && !failure ? 0 : 1,
      identityUnchanged: true,
      durationMs: 1,
      evidenceRef: `fuzz:${h}:${e}`,
      recordedAt: new Date(at).toISOString(),
      requiredSuites: names,
      taskTimeline: timeline,
      ...(failure ?? {}),
    };
    recordGateChecks(where === "main" ? repo : worktree, [row]);
    events.push({ where, row });
    if (
      where === "main" &&
      check === "npm test" &&
      row.exitCode === 0 &&
      !failure
    )
      mainRows.push(row);
  }
  stats.histories++;
  // Oracle: a task's standing is its latest execution among the worktree's
  // executions at the identity, or main's when the worktree has none.
  const intact = (row) =>
    !row.abandonedRoots &&
    !row.stopped &&
    !row.timedOut &&
    row.identityUnchanged !== false &&
    row.buildOutputUnchanged !== false &&
    !row.memory;
  const executions = (where, name) =>
    events
      .filter((ev) => ev.where === where)
      .flatMap(({ row }) =>
        row.taskTimeline
          .filter((r) => r.name === name && !r.reused)
          .map((r) => ({ row, r, at: Date.parse(r.finishedAt) })),
      );
  const standing = (name) => {
    const w = executions("worktree", name);
    const xs = w.length ? w : executions("main", name);
    const last = xs.sort((a, b) => a.at - b.at).at(-1);
    return last
      ? { ok: last.r.exitCode === 0 && intact(last.row), last }
      : { ok: false };
  };
  const claim = await coveringGateCheck(worktree, "npm test", []);
  const carried = await coveringTaskResults(worktree, "npm test", tasks);
  if (claim.row) {
    stats.accepted++;
    claim.location === "main" ? stats.acceptedMain++ : stats.acceptedWorktree++;
    for (const r of claim.row.taskTimeline) {
      const s = standing(r.name);
      if (!s.ok)
        violations.push({
          h,
          kind: "claim",
          task: r.name,
          row: claim.row.evidenceRef,
          events: events.map(
            ({ where, row }) =>
              `${where}:${row.checkId}:${row.evidenceRef}:${row.exitCode}:${row.taskTimeline.map((t) => `${t.name}${t.reused ? "R" : t.exitCode}`).join("/")}:${Object.keys(
                row,
              )
                .filter(
                  (k) =>
                    [
                      "abandonedRoots",
                      "stopped",
                      "timedOut",
                      "memory",
                    ].includes(k) ||
                    (k === "identityUnchanged" && row[k] === false) ||
                    (k === "buildOutputUnchanged" && row[k] === false),
                )
                .join("+")}`,
          ),
        });
    }
    if (carried.results.size !== TASKS.length) stats.disagreements++;
  }
  for (const [name, res] of carried.results) {
    stats.carried++;
    const s = standing(name);
    const src = events.find(
      ({ row }) =>
        row.recordedAt === res.sourceRow.recordedAt &&
        (res.sourceRow.location === "main" ? "main" : "worktree") ===
          events.find((ev) => ev.row === row).where,
    );
    const executedThere = src?.row.taskTimeline.some(
      (t) => t.name === name && !t.reused && t.exitCode === 0,
    );
    if (!s.ok || !executedThere)
      violations.push({
        h,
        kind: "carried",
        task: name,
        source: res.sourceRow,
        ok: s.ok,
        executedThere,
      });
  }
}
const byKind = {};
for (const v of violations) {
  const k =
    v.kind +
    (v.kind === "claim" ? "" : v.executedThere ? "" : ":no-source-exec");
  byKind[k] = (byKind[k] ?? 0) + 1;
}
const claimHist = new Set(
  violations.filter((v) => v.kind === "claim").map((v) => v.h),
).size;
console.log(
  JSON.stringify(
    {
      identity,
      stats,
      violations: violations.length,
      byKind,
      claimHistories: claimHist,
      firstClaim: violations.find((v) => v.kind === "claim"),
    },
    null,
    1,
  ),
);
rmSync(base, { recursive: true, force: true });
process.exitCode = violations.length ? 1 : 0;
