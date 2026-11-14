// Three readings from one session's own journal in this checkout, beside the
// fixture's two timing readings: what the session hook takes at a prompt,
// what an authorship snapshot takes and reads on this worktree's real
// outputs, and whether the host starts one event's hooks side by side. Each
// is given before and after an instant: the one the part's hooks were
// installed at.
//
//   node docs/evidence/WO-276/part-q/session-rows.mjs <session id> <instant>
//
// It prints counts, durations and sizes only: no path, command or text of a
// row.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const [session, instant] = process.argv.slice(2);
if (!session || !Number.isFinite(Date.parse(instant ?? "")))
  throw new Error("usage: node session-rows.mjs <session id> <instant>");
const key = createHash("sha256").update(session).digest("hex");
const rows = readFileSync(
  join(root, "docs/control/local/harness", `${key}.jsonl`),
  "utf8",
)
  .split("\n")
  .filter(Boolean)
  .flatMap((line) => {
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  })
  .filter((row) => Number.isFinite(Date.parse(row.recordedAt)));
const at = Date.parse(instant);
const sides = (list) => ({
  before: list.filter((row) => Date.parse(row.recordedAt) < at),
  after: list.filter((row) => Date.parse(row.recordedAt) >= at),
});
const median = (values) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
};
const round = (value) => (value === null ? null : Math.round(value));
const each = (list, read) =>
  Object.fromEntries(
    Object.entries(sides(list)).map(([side, part]) => [side, read(part)]),
  );

// The session hook at a prompt.
const prompt = each(
  rows.filter(
    (row) =>
      row.event === "UserPromptSubmit" && row.hookTiming?.kind === "session",
  ),
  (part) => ({
    rows: part.length,
    medianMs: round(median(part.map((row) => row.hookTiming.durationMs))),
  }),
);

// An authorship snapshot: before a shell command, an edit or a write, and
// after one.
const authorship = each(
  rows.filter((row) => row.authorship),
  (part) => ({
    snapshots: part.length,
    medianMs: round(median(part.map((row) => row.authorship.durationMs))),
    medianFiles: median(part.map((row) => row.authorship.files)),
    medianBytes: median(part.map((row) => row.authorship.bytes)),
    // A row from before the part holds neither count: every byte was read.
    medianFilesRead: median(
      part.map((row) => row.authorship.filesRead ?? row.authorship.files),
    ),
    medianBytesRead: median(
      part.map((row) => row.authorship.bytesRead ?? row.authorship.bytes),
    ),
    snapshotsThatReadNothing: part.filter(
      (row) => row.authorship.filesRead === 0,
    ).length,
  }),
);

// One call's hooks before it: each timing row ends at its recorded time and
// began its duration earlier. Hooks started one after another span about the
// sum of their durations; hooks started side by side span about the longest.
const calls = new Map();
for (const row of rows)
  if (row.event === "PreToolUse" && row.call && row.hookTiming)
    calls.set(row.call, [...(calls.get(row.call) ?? []), row]);
const spans = [...calls.values()]
  .filter((list) => list.length >= 2)
  .map((list) => {
    const ends = list.map((row) => Date.parse(row.recordedAt));
    const starts = list.map(
      (row, index) => ends[index] - row.hookTiming.durationMs,
    );
    return {
      recordedAt: list[0].recordedAt,
      hooks: list.length,
      spanMs: Math.max(...ends) - Math.min(...starts),
      sumMs: list.reduce((sum, row) => sum + row.hookTiming.durationMs, 0),
      longestMs: Math.max(...list.map((row) => row.hookTiming.durationMs)),
      startSpreadMs: Math.max(...starts) - Math.min(...starts),
    };
  });
const sideBySide = each(spans, (part) => ({
  calls: part.length,
  medianHooks: median(part.map((row) => row.hooks)),
  medianSpanMs: round(median(part.map((row) => row.spanMs))),
  medianSumMs: round(median(part.map((row) => row.sumMs))),
  medianLongestMs: round(median(part.map((row) => row.longestMs))),
  medianStartSpreadMs: round(median(part.map((row) => row.startSpreadMs))),
}));

const out = {
  note: "Readings from one session's own journal in this checkout, before and after the instant the part's hooks were installed at. promptHook: the session hook's own timing rows at a prompt. authorship: the snapshot the observers take before and after a shell command, an edit or a write, over this worktree's changed and untracked files. hooksBeforeACall: for each call with two or more timed hooks before it, the span from the earliest start to the latest end, the sum of the hooks' durations, the longest, and the spread of their starts. Milliseconds, counts and bytes.",
  instant,
  promptHook: prompt,
  authorship,
  hooksBeforeACall: sideBySide,
};
writeFileSync(
  join(here, "session-rows.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(JSON.stringify(out, null, 2));
