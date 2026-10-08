// VER-003: a genuine post-result refusal (dirty committed tree) that coincides
// with the run's signal, then a rerun without a signal; control without signal.
// Usage: node scripts/harness.mjs bounded -- node docs/evidence/WO-199/verification-003-coincident-refusal-probe.mjs <repo-root>
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const repo = process.argv[2];
const at = (p) => pathToFileURL(join(repo, p)).href;
const { decodeLog } = await import(at("packages/kernel/dist/src/index.js"));
const { SourceChangeHost } = await import(
  at("packages/skeleton/dist/src/source-change-host.js")
);
const { createSourceFixture, sourceFixtureOptions } = await import(
  at("packages/skeleton/dist/test/source-change-fixture.js")
);
const rows = (root) =>
  decodeLog(readFileSync(join(root, "store/events.jsonl"), "utf8")).map(
    (e) =>
      e.type +
      (e.type === "WorkerInterrupted"
        ? `:${e.payload.reason}:${e.payload.signal ?? "-"}`
        : "") +
      (e.type === "SourceChangeRefused" ? `:${e.payload.reason}` : ""),
  );
const outcome = async (host) => {
  try {
    const r = await host.run();
    return { status: r.status, reason: r.refusal?.reason };
  } catch (e) {
    return { threw: `${e.name}:${e.code ?? ""}:${e.message}` };
  }
};
const report = {};
for (const variant of ["coincident-signal", "no-signal-control"]) {
  const root = createSourceFixture();
  try {
    let t = 10;
    const abort = new AbortController();
    const host = new SourceChangeHost({
      ...sourceFixtureOptions(root, () => t),
      ...(variant === "coincident-signal" ? { signal: abort.signal } : {}),
      afterResult() {
        writeFileSync(join(host.tree.path, "fixture.txt"), "dirty\n");
        if (variant === "coincident-signal") abort.abort("SIGINT");
      },
    });
    const first = await outcome(host);
    const afterFirst = rows(root);
    t = 20_000;
    const rerun = await outcome(
      new SourceChangeHost(sourceFixtureOptions(root, () => t)),
    );
    report[variant] = {
      first,
      afterFirst: afterFirst.slice(6),
      rerun,
      afterRerun: rows(root).slice(afterFirst.length),
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
console.log(JSON.stringify(report, null, 1));
