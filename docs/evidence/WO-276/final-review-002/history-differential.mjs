// Final review of WO-276 (FINAL-002): every revision of every work order
// that main's history holds, read by the base's readers and by the
// candidate's. It answers two questions about real author text: does any
// order ever committed read differently in its header (as the index reads
// it) or in its declared criteria (as the lifecycle reads them), and does
// the candidate refuse any that the base read.
//
// Run from the repository root:
//   node docs/evidence/WO-276/final-review-002/history-differential.mjs <base> <output.json>
// where <base> holds main's files (`git archive main | tar -x -C <base>`,
// with node_modules linked from the worktree). The output holds counts and
// each difference; no order's text is copied.
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const root = process.cwd();
const base = process.argv[2];
const out = process.argv[3];
const load = (from, path) => import(pathToFileURL(join(from, path)).href);
const git = (...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1 << 30,
  });
// Unique (path, blob) pairs over main's history.
const raw = git(
  "log",
  "main",
  "--raw",
  "--no-abbrev",
  "--no-renames",
  "--format=",
  "--",
  "docs/work-orders",
);
const pairs = new Map();
for (const line of raw.split("\n")) {
  const m = /^:\d+ \d+ [0-9a-f]+ ([0-9a-f]{40}) [AMCRT]\d*\t(.+)$/u.exec(line);
  if (!m) continue;
  if (!/^docs\/work-orders\/(?:.*\/)?WO-\d{3}[^/]*\.md$/u.test(m[2])) continue;
  pairs.set(`${m[2]}@${m[1]}`, { path: m[2], blob: m[1] });
}
const nowWO = await load(root, "scripts/work-orders.mjs");
const oldWO = await load(base, "scripts/work-orders.mjs");
const nowHL = await load(root, "scripts/lib/handoff-ledger.mjs");
const oldHL = await load(base, "scripts/lib/handoff-ledger.mjs");
const safe = (fn) => {
  try {
    return { ok: fn() };
  } catch (e) {
    return { err: String(e.message).slice(0, 300), code: e.code ?? null };
  }
};
const strip = (value) =>
  JSON.parse(
    JSON.stringify(value ?? null, (k, v) =>
      typeof v === "function" ? undefined : v,
    ),
  );
const common = (a, b) => {
  const o = {};
  for (const k of Object.keys(a ?? {})) if (b && k in b) o[k] = a[k];
  return o;
};
const report = {
  revisions: pairs.size,
  header: {
    equal: 0,
    differ: [],
    bothThrow: 0,
    onlyNowThrows: [],
    onlyBaseThrows: [],
  },
  criteria: {
    equal: 0,
    differ: [],
    bothThrow: 0,
    onlyNowThrows: [],
    onlyBaseThrows: [],
  },
};
for (const { path, blob } of pairs.values()) {
  const text = git("cat-file", "blob", blob);
  // Header as the index reads it.
  const hn = safe(() => strip(nowWO.parseHeader(text, path)));
  const ho = safe(() => strip(oldWO.parseHeader(text, path)));
  if (hn.err && ho.err) report.header.bothThrow += 1;
  else if (hn.err)
    report.header.onlyNowThrows.push({
      path,
      blob: blob.slice(0, 10),
      err: hn.err,
    });
  else if (ho.err)
    report.header.onlyBaseThrows.push({
      path,
      blob: blob.slice(0, 10),
      err: ho.err,
    });
  else {
    const a = JSON.stringify(common(hn.ok, ho.ok));
    const b = JSON.stringify(common(ho.ok, hn.ok));
    if (a === b) report.header.equal += 1;
    else {
      const keys = Object.keys(common(ho.ok, hn.ok)).filter(
        (k) => JSON.stringify(hn.ok[k]) !== JSON.stringify(ho.ok[k]),
      );
      report.header.differ.push({
        path,
        blob: blob.slice(0, 10),
        keys,
        sample: keys.slice(0, 3).map((k) => ({
          k,
          now: JSON.stringify(hn.ok[k]).slice(0, 160),
          base: JSON.stringify(ho.ok[k]).slice(0, 160),
        })),
      });
    }
  }
  // Declared criteria as the lifecycle reads them.
  const cn = safe(() => strip(nowHL.declaredCriteria(text)));
  const co = safe(() => strip(oldHL.declaredCriteria(text)));
  if (cn.err && co.err) report.criteria.bothThrow += 1;
  else if (cn.err)
    report.criteria.onlyNowThrows.push({
      path,
      blob: blob.slice(0, 10),
      err: cn.err,
      code: cn.code,
    });
  else if (co.err)
    report.criteria.onlyBaseThrows.push({
      path,
      blob: blob.slice(0, 10),
      err: co.err,
    });
  else if (JSON.stringify(cn.ok) === JSON.stringify(co.ok))
    report.criteria.equal += 1;
  else {
    const n = cn.ok,
      o = co.ok;
    const size = (c) =>
      c == null ? null : c instanceof Array ? c.length : Object.keys(c).length;
    report.criteria.differ.push({
      path,
      blob: blob.slice(0, 10),
      now: size(n),
      base: size(o),
    });
  }
}
const { writeFileSync } = await import("node:fs");
writeFileSync(out, JSON.stringify(report, null, 1));
const brief = (s) => ({
  equal: s.equal,
  differ: s.differ.length,
  bothThrow: s.bothThrow,
  onlyNowThrows: s.onlyNowThrows.length,
  onlyBaseThrows: s.onlyBaseThrows.length,
});
console.log(
  JSON.stringify(
    {
      revisions: report.revisions,
      header: brief(report.header),
      criteria: brief(report.criteria),
    },
    null,
    1,
  ),
);
