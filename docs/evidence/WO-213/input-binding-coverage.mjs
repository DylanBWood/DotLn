// Tabulate how the current code binds each task of the complete review selection.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const root = process.cwd();
const mod = (file) => import(pathToFileURL(resolve(root, file)).href);
const runner = await mod("scripts/test-runner.mjs");
const { gateCodeIdentity } = await mod("scripts/lib/gate-evidence.mjs");
const { taskInputBinder } = await mod("scripts/lib/task-inputs.mjs");
const identity = gateCodeIdentity(root);
const selected = runner.suites.filter((row) => !row.document && !row.instance);
const started = Date.now();
const tasks = runner.expandSuiteTasks(selected, root, "<tabulate-template>");
const binder = taskInputBinder(root, identity);
const rows = tasks.map((task) => {
  const t0 = Date.now();
  const binding = binder.bind(task);
  return {
    name: task.name,
    ms: Date.now() - t0,
    coverage: binding.coverage,
    method: binding.method ?? "-",
    reusable: binding.reusable !== false,
    reason: binding.reason ?? "",
  };
});
console.log(
  JSON.stringify(
    { identity, tasks: rows.length, totalMs: Date.now() - started },
    null,
    0,
  ),
);
for (const r of rows)
  console.log(
    `${r.coverage.padEnd(10)} ${r.method.padEnd(40)} ${String(r.ms).padStart(6)}ms ${r.name} ${r.reason}`,
  );
const declared = rows.filter((r) => r.coverage === "declared");
console.log(
  `declared: ${declared.length}/${rows.length}; by method: static-analysis=${declared.filter((r) => r.method === "static-analysis").length}, declarations=${declared.filter((r) => r.method !== "static-analysis").length}`,
);
