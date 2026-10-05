// Reproduce the declined per-input-selection alternative with public sources.
// Run from the repository: node docs/evidence/WO-186/replay-affected.mjs
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { suites, expandSuiteTasks } from "../../../scripts/test-runner.mjs";
import { readControl } from "../../../scripts/lib/control-store.mjs";
import { readIndex } from "../../../scripts/work-orders.mjs";
import { runGit } from "../../../scripts/lib/git.mjs";
import { relativeImports } from "../../../scripts/lib/evidence-sources.mjs";
import {
  readGateChecks,
  gateCodeIdentity,
} from "../../../scripts/lib/gate-evidence.mjs";
import { completePassingRow } from "../../../scripts/lib/gate-reuse.mjs";
const root = resolve(import.meta.dirname, "../../..");
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};
const inventory = runGit(
  root,
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { trim: false },
)
  .split("\0")
  .filter(Boolean);
const code = inventory.filter(
  (path) =>
    !(/^(?:docs|\.claude|\.agents)\//.test(path) || /^[^/]+\.md$/i.test(path)),
);
const expand = (file) => {
  if (!file.includes("*")) return [file];
  const dir = dirname(file);
  return existsSync(join(root, dir))
    ? readdirSync(join(root, dir))
        .filter((name) => name.endsWith(".test.js"))
        .map((name) => `${dir}/${name}`)
    : [];
};
const source = (file) =>
  file.replace(
    /^(packages\/[^/]+)\/dist\/(src|test)\/(.+)\.js$/,
    "$1/$2/$3.ts",
  );
function closure(entries) {
  const paths = new Set(),
    todo = entries.map(source);
  while (todo.length) {
    const file = todo.pop();
    if (paths.has(file)) continue;
    paths.add(file);
    if (!existsSync(join(root, file)) || !/\.(?:mjs|cjs|js|ts)$/.test(file))
      continue;
    todo.push(...relativeImports(root, file));
    const bytes = readFileSync(join(root, file), "utf8");
    // Bare first-party imports enter through each workspace's public source.
    for (const match of bytes.matchAll(
      /(?:from\s*|import\s*\()?["']@dotln\/([^/"']+)["']/g,
    )) {
      const dir = `packages/${match[1]}/src`;
      for (const name of ["index.ts", "index.mjs"])
        if (existsSync(join(root, dir, name))) todo.push(`${dir}/${name}`);
    }
    for (const match of bytes.matchAll(
      /["']((?:scripts|packages)\/[\w./-]+\.(?:mjs|cjs|js|ts|sh))["']/g,
    ))
      if (existsSync(join(root, match[1]))) todo.push(source(match[1]));
  }
  return paths;
}
const tasks = expandSuiteTasks(
  suites.filter((row) => row.product),
  root,
  "<gate-template>",
).map((row) => {
  const entries = row.command
    .slice(1)
    .filter((arg) => /^(?:scripts|packages|corpus)\//.test(arg))
    .flatMap(expand);
  const copiedScripts = row.command[0] === "bash" || row.name === "release";
  const inputs =
    row.build || row.name === "worktree-integration"
      ? new Set(code)
      : closure(entries);
  if (copiedScripts)
    for (const file of code.filter((file) => file.startsWith("scripts/")))
      inputs.add(file);
  for (const file of [
    "package.json",
    "package-lock.json",
    "scripts/test-runner.mjs",
    "scripts/lib/product-read-guard.mjs",
  ])
    inputs.add(file);
  for (const entry of entries) {
    const packageRoot = /^(packages\/[^/]+)/.exec(entry)?.[1];
    if (packageRoot) inputs.add(`${packageRoot}/package.json`);
  }
  if (["github-body", "outward-lint", "target-publish"].includes(row.name))
    inputs.add("docs/control/outward-vocabulary.json");
  return { name: row.name, inputs };
});
const codeIdentity = gateCodeIdentity(root);
const checks = readGateChecks(root).filter(
  (row) =>
    row.checkId === "npm test" &&
    row.codeIdentity === codeIdentity &&
    completePassingRow(row),
);
const seconds = new Map(
  tasks.map((task) => [
    task.name,
    median(
      checks
        .flatMap((row) => row.taskTimeline ?? row.cases ?? [])
        .filter(
          (row) =>
            row.name === task.name &&
            !row.reused &&
            row.executed &&
            row.exitCode === 0,
        )
        .map((row) => row.durationMs / 1000),
    ),
  ]),
);
const { orders } = readControl(root),
  index = readIndex(root);
const closed = [...orders]
  .filter(([, row]) => row.state.phase === "closed")
  .sort(([, a], [, b]) =>
    (a.closeRecordedAt ?? "").localeCompare(b.closeRecordedAt ?? ""),
  )
  .slice(-30);
const rows = [];
for (const [id, control] of closed) {
  const release = index.releases.find((row) => row.workOrders.includes(id));
  if (!release) {
    rows.push({
      workOrder: id,
      unavailable: "no attributed local release; no commit boundary invented",
    });
    continue;
  }
  let revision;
  try {
    revision = runGit(root, ["rev-parse", `${release.name}^{commit}`]);
  } catch {
    rows.push({
      workOrder: id,
      unavailable: "attributed release tag is not readable locally",
    });
    continue;
  }
  let prior;
  try {
    prior = runGit(root, [
      "describe",
      "--tags",
      "--match",
      "v*",
      "--abbrev=0",
      `${revision}^`,
    ]);
  } catch {
    rows.push({ workOrder: id, unavailable: "no predecessor release" });
    continue;
  }
  const changed = runGit(root, ["diff", "--name-only", prior, revision, "--"], {
    trim: false,
  })
    .trim()
    .split("\n")
    .filter(Boolean);
  const affected = tasks
    .filter((task) => changed.some((file) => task.inputs.has(file)))
    .map((task) => task.name);
  const known = tasks.every((task) => seconds.get(task.name) !== null);
  const total = known
    ? tasks.reduce((sum, task) => sum + seconds.get(task.name), 0)
    : null;
  const needed = known
    ? affected.reduce((sum, name) => sum + seconds.get(name), 0)
    : null;
  rows.push({
    workOrder: id,
    release: release.name,
    base: prior,
    changed: changed.length,
    affected,
    taskSeconds: total,
    affectedSeconds: needed,
    affectedShare: total ? needed / total : null,
  });
}
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      subject: runGit(root, ["rev-parse", "HEAD"]),
      codeIdentity,
      measuredPassingRows: checks.map((row) => ({
        recordedAt: row.recordedAt,
        evidenceRef: row.evidenceRef,
      })),
      method:
        "Current product tasks and recursive relative imports, bare workspace entry imports and literal first-party paths; shell copies conservatively include all scripts, integration includes all code. Task durations are medians of fresh successful executions in complete passing rows at the current code identity only. Release differences are attributed release intervals, which can include siblings. Inputs built dynamically and native reads remain unknown. Versions are not normalized. No cache or alternative selection is installed.",
      orderCount: rows.length,
      measuredOrders: rows.filter(
        (row) => row.affectedShare !== null && row.affectedShare !== undefined,
      ).length,
      medianAffectedShare: median(
        rows.map((row) => row.affectedShare).filter(Number.isFinite),
      ),
      tasks: tasks.map((task) => ({
        name: task.name,
        inputs: task.inputs.size,
        medianSeconds: seconds.get(task.name),
      })),
      rows,
    },
    null,
    2,
  ),
);
