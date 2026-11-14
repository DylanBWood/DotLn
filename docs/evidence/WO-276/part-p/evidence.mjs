// Part P's evidence, taken from the candidate: the two standings of
// criterion P1, the three printed facts of criterion P2, the briefing with
// and without a standing file, and what the reading costs.
//
//   node docs/evidence/WO-276/part-p/evidence.mjs [<base tree> <session> [<instant>]]
//
// With a directory that holds scripts/lib and packages/skeleton/src of the
// tree the part began on, and a session id of this checkout, it also times
// the standing at the base and now on this checkout's own journals; with
// the instant the hooks were reinstalled, it also reads that session's
// prompt-hook timing rows before and after it.
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const load = (base, path) => import(pathToFileURL(join(base, path)).href);
const bound = await load(root, "scripts/lib/dispatch-bound.mjs");
const { renderDailyUse } = await load(
  root,
  "packages/skeleton/dist/src/observed-facts.js",
);

// Criterion P1: a fixture checkout with an eight-hour bound and one session.
const minutes = (count) => count * 60 * 1000;
const key = createHash("sha256").update("part-p-evidence").digest("hex");
function standingOf(hours, entries) {
  const fixture = mkdtempSync(join(tmpdir(), "dotln-part-p-"));
  try {
    const budgets = JSON.parse(
      readFileSync(join(root, "scripts/kit/budgets.template.json"), "utf8"),
    );
    budgets.dispatches.executor.wallClockMs = minutes(8 * 60);
    const startMs = Date.parse("2030-01-01T00:00:00.000Z");
    const lane = join(fixture, "docs/control/local/harness");
    mkdirSync(lane, { recursive: true });
    writeFileSync(
      join(fixture, "docs/control/budgets.json"),
      JSON.stringify(budgets),
    );
    writeFileSync(
      join(lane, `${key}.json`),
      JSON.stringify({
        role: "executor",
        intent: "resume: next",
        workOrder: "WO-999",
        startedAt: new Date(startMs).toISOString(),
      }),
    );
    writeFileSync(
      join(lane, `${key}.jsonl`),
      entries
        .map(([offset, event, tool]) =>
          JSON.stringify({
            recordedAt: new Date(startMs + minutes(offset)).toISOString(),
            event,
            ...(tool ? { tool } : {}),
          }),
        )
        .join("\n") + "\n",
    );
    const standing = bound.dispatchStanding(fixture, {
      sessionKey: key,
      now: startMs + minutes(hours * 60),
      gates: [],
      events: [],
    });
    return standing.state === "exceeded"
      ? bound.dispatchBoundMessage(standing)
      : bound.dispatchStandingLine(standing);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}
const halfHour = (from) =>
  [0, 5, 10, 15, 20, 25].flatMap((offset) => [
    [from + offset, "PreToolUse", "Bash"],
    [from + offset + 4, "PostToolUse", "Bash"],
  ]);
const unbroken = [[0, "UserPromptSubmit"]];
for (let hour = 0; hour < 9; hour += 1)
  unbroken.push(
    ...halfHour(hour * 60),
    [hour * 60 + 30, "Stop"],
    [hour * 60 + 35, "UserPromptSubmit"],
    ...halfHour(hour * 60 + 35).slice(0, 10),
  );
writeFileSync(
  join(here, "standings.txt"),
  [
    "Two half-hours of activity twenty hours apart, the gap beginning at a turn's end row, read at 21 h:",
    standingOf(21, [
      [0, "UserPromptSubmit"],
      ...halfHour(0),
      [30, "Stop"],
      [20 * 60 + 30, "UserPromptSubmit"],
      ...halfHour(20 * 60 + 30),
    ]),
    "",
    "Nine hours of unbroken activity, read at 9 h:",
    standingOf(9, unbroken),
    "",
    "One tool call whose start and end rows are fifty minutes apart, the turn ending a minute later, read at 10 h:",
    standingOf(10, [
      [0, "UserPromptSubmit"],
      [0, "PreToolUse", "Bash"],
      [50, "PostToolUse", "Bash"],
      [51, "Stop"],
    ]),
    "",
  ].join("\n"),
);

// Criterion P2: the line a prompt's facts carry, for one day's use.
const use = {
  day: "2026-11-12",
  totalTokens: 1_500_000,
  partial: false,
  estimateUsd: null,
  unpriced: ["model-c"],
  unattested: false,
};
writeFileSync(
  join(here, "facts.txt"),
  [
    "Below the figure:",
    renderDailyUse({ tokens: 2_000_000 }, use),
    "",
    "At or above it:",
    renderDailyUse({ tokens: 1_500_000 }, use),
    "",
    "A dollar figure and a model with no declared price:",
    renderDailyUse({ usd: 50 }, use),
    "",
    "No figure declared: no line is added to the facts.",
    "",
  ].join("\n"),
);

// Criterion P4: this order's own briefing with its standing file and, the
// file set aside for one command, without it.
const briefing = () =>
  execFileSync(
    process.execPath,
    [join(root, "scripts/resume.mjs"), "briefing", "--work-order", "WO-276"],
    { cwd: root, encoding: "utf8" },
  )
    .split("\n")
    .slice(0, 3)
    .map((line) => (line.length > 260 ? `${line.slice(0, 260)} [...]` : line));
const standingFile = join(here, "../standing.md");
if (existsSync(standingFile)) {
  const withFile = briefing();
  const aside = `${standingFile}.aside`;
  renameSync(standingFile, aside);
  let without;
  try {
    without = briefing();
  } finally {
    renameSync(aside, standingFile);
  }
  writeFileSync(
    join(here, "briefing.txt"),
    [
      "The first lines of this order's briefing with its standing file:",
      ...withFile,
      "",
      "And with the file set aside:",
      ...without,
      "",
    ].join("\n"),
  );
}

// What the reading costs on this checkout's own journals, at the base and now.
const [baseTree, session] = process.argv.slice(2);
if (baseTree && session) {
  const median = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const time = (run, count = 9) => {
    const samples = [];
    for (let index = 0; index < count; index += 1) {
      const from = performance.now();
      run();
      samples.push(performance.now() - from);
    }
    return Math.round(median(samples));
  };
  const base = await load(resolve(baseTree), "scripts/lib/dispatch-bound.mjs");
  const lane = join(root, "docs/control/local/harness");
  const journals = readdirSync(lane).filter((name) =>
    /^[a-f0-9]{64}\.jsonl$/u.test(name),
  );
  const now = bound.dispatchStanding(root, { session });
  writeFileSync(
    join(here, "standing-cost.json"),
    `${JSON.stringify(
      {
        note: "The standing of one session of this order's dispatch on this checkout's own journals; the median of nine readings in one process, in milliseconds.",
        journals: journals.length,
        journalBytes: journals.reduce(
          (sum, name) => sum + statSync(join(lane, name)).size,
          0,
        ),
        baseStandingMs: time(() => base.dispatchStanding(root, { session })),
        standingMs: time(() => bound.dispatchStanding(root, { session })),
        elapsedMs: now.elapsedMs,
        workedMs: now.workedMs,
      },
      null,
      2,
    )}\n`,
  );
}
// What a prompt pays where a figure is declared: one process that loads the
// usage report's reading and reads this checkout's own ledger for the day,
// against one that loads the budget loader alone, which is all a prompt pays
// to learn that none is declared beyond reading the budgets file.
const processMs = (script, count = 5) => {
  const samples = [];
  for (let index = 0; index < count; index += 1) {
    const from = performance.now();
    execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      cwd: root,
      encoding: "utf8",
    });
    samples.push(performance.now() - from);
  }
  return Math.round([...samples].sort((a, b) => a - b)[Math.floor(count / 2)]);
};
const url = (path) => JSON.stringify(pathToFileURL(join(root, path)).href);
writeFileSync(
  join(here, "prompt-cost.json"),
  `${JSON.stringify(
    {
      note: "One node process each, the median of five, in milliseconds, on this checkout's own usage ledger. A prompt with no figure declared starts none of these: it reads the budgets file's one key.",
      emptyProcessMs: processMs("0"),
      figureCheckMs: processMs(
        `const { dailySpend } = await import(${url("scripts/lib/process-budget.mjs")}); dailySpend({ spend: { daily: { tokens: 1 } } });`,
      ),
      dayReadingMs: processMs(
        `const { dayUse } = await import(${url("scripts/lib/meta.mjs")}); dayUse(${JSON.stringify(root)});`,
      ),
    },
    null,
    2,
  )}\n`,
);
// The prompt hook's own timing rows in one session of this checkout, before
// and after the instant its hooks were reinstalled with this part's code.
// No figure is declared here, so the rows show what a prompt pays without
// one. Each hook reads its session's journal whole, and the journal grows
// between the two groups, so its size at each group's ends stands beside
// the timings.
const [, , split] = process.argv.slice(2);
if (session && split) {
  const file = join(
    root,
    "docs/control/local/harness",
    `${createHash("sha256").update(session).digest("hex")}.jsonl`,
  );
  let bytes = 0;
  const rows = [];
  for (const line of readFileSync(file, "utf8").split("\n")) {
    bytes += Buffer.byteLength(line) + 1;
    if (!line) continue;
    let row;
    try {
      row = JSON.parse(line);
    } catch {
      continue;
    }
    if (row.event === "UserPromptSubmit" && row.hookTiming?.kind === "session")
      rows.push({ at: row.recordedAt, ms: row.hookTiming.durationMs, bytes });
  }
  const group = (list) => {
    const sorted = list.map((row) => row.ms).sort((a, b) => a - b);
    return {
      rows: list.length,
      medianMs: sorted.length
        ? Math.round(sorted[Math.floor(sorted.length / 2)])
        : null,
      minMs: sorted.length ? Math.round(sorted[0]) : null,
      maxMs: sorted.length ? Math.round(sorted.at(-1)) : null,
      journalBytesAtFirstRow: list[0]?.bytes ?? null,
      journalBytesAtLastRow: list.at(-1)?.bytes ?? null,
    };
  };
  writeFileSync(
    join(here, "prompt-timing.json"),
    `${JSON.stringify(
      {
        note: "The session hook's timing rows at a prompt in one session, in milliseconds, split at the instant the hooks were reinstalled with Part P's code. No figure is declared in this checkout. The hook reads its session's journal whole at each call, so the journal's size at each group's first and last row is given: the later group read a larger journal.",
        split,
        before: group(rows.filter((row) => row.at < split)),
        after: group(rows.filter((row) => row.at >= split)),
      },
      null,
      2,
    )}\n`,
  );
}
console.log("part-p evidence written");
