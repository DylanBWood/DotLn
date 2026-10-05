import { readFileSync, writeFileSync } from "node:fs";
import { join, basename, resolve } from "node:path";
const scratch = process.argv[2],
  root = resolve(import.meta.dirname, "../../..");
if (!scratch) throw Error("Pass the retained session scratch directory");
function category(r) {
  const args = r.args ?? [];
  const source = args.find(
    (a) => typeof a === "string" && /\.(?:mjs|js|sh)$/.test(a),
  );
  if (source) {
    const name = basename(source);
    if (name === "resident-lock-process.js") {
      const input = args.find(
        (a) => typeof a === "string" && a.startsWith("{"),
      );
      try {
        if (/matrix/.test(JSON.parse(input).directory))
          return "resident-lock-process: matrix";
      } catch {}
    }
    return name;
  }
  const exe = basename(r.command);
  if (exe === "git") return "git";
  return exe;
}
const group = (file) => {
  const rows = readFileSync(join(scratch, file), "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  const pids = new Map();
  for (const r of rows) {
    if (!pids.has(r.pid)) pids.set(r.pid, []);
    pids.get(r.pid).push(r);
  }
  const scopes = [...pids.values()]
    .map((all) => {
      const m = new Map();
      for (const r of all) {
        const k = category(r);
        const v = m.get(k) ?? { operation: k, calls: 0, durationMs: 0 };
        v.calls++;
        v.durationMs += r.durationMs;
        m.set(k, v);
      }
      return {
        calls: all.length,
        totalInstrumentedMs: all.reduce((sum, r) => sum + r.durationMs, 0),
        commands: [...m.values()].sort((a, b) => b.durationMs - a.durationMs),
      };
    })
    .sort((a, b) => b.calls - a.calls);
  return {
    file,
    scope:
      "Five processes with the most instrumented calls; no cross-process or nested-wrapper sum is treated as wall time. Only public command basenames are retained.",
    observedProcesses: scopes.length,
    observedCalls: rows.length,
    processScopes: scopes.slice(0, 5),
  };
};
const tap = (file) => {
  const text = readFileSync(join(scratch, file), "utf8"),
    rows = [];
  for (const m of text.matchAll(
    /^([ \t]*)(?:ok|not ok) \d+ - (.+)\r?\n\1  ---\r?\n\1  duration_ms: ([\d.]+)/gm,
  ))
    rows.push({
      case: m[2],
      nesting: m[1].length / 4,
      durationMs: Number(m[3]),
    });
  return {
    file,
    reportedCases: rows.length,
    scope:
      "All integration cases or forty slowest reported skeleton cases, including nested cells; overlapping case times are not additive.",
    cases: rows.sort((a, b) => b.durationMs - a.durationMs).slice(0, 40),
  };
};
const output = {
  schemaVersion: 1,
  scope:
    "Diagnostic cause profiles, separate from the five-run ordinary-gate comparisons. Unequal and unobserved host load limits causal attribution. Initial after profiles precede the final observer and async matrix repairs.",
  commands: [
    group("before-integration-suite-1-profile.jsonl"),
    group("qualified-after-integration-suite-1-1-profile.jsonl"),
    group("before-skeleton-suite-1-profile.jsonl"),
    group("qualified-after-skeleton-suite-1-1-profile.jsonl"),
    group("guarded-generator-after-profile.jsonl"),
  ],
  cases: [
    tap("before-integration-suite-1.log"),
    tap("qualified-after-integration-suite-1-1.log"),
    tap("qualified-after-skeleton-suite-1-1.log"),
    tap("matrix-async-positive.log"),
  ],
};
writeFileSync(
  join(root, "docs/evidence/WO-186/profiles.json"),
  JSON.stringify(output, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    bytes: JSON.stringify(output, null, 2).length,
    commands: output.commands.map((r) => ({
      file: r.file,
      scopes: r.observedProcesses,
      scopesKept: r.processScopes.length,
    })),
    cases: output.cases.map((r) => ({
      file: r.file,
      cases: r.reportedCases,
      slowest: r.cases.slice(0, 3),
    })),
  }),
);
