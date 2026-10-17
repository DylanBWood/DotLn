// Which tasks of the complete selection would be carried right now, and why the rest would not.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const root = process.cwd();
const mod = (file) => import(pathToFileURL(resolve(root, file)).href);
const runner = await mod("scripts/test-runner.mjs");
const { gateCodeIdentity } = await mod("scripts/lib/gate-evidence.mjs");
const { taskInputBinder } = await mod("scripts/lib/task-inputs.mjs");
const { coveringTaskResults } = await mod("scripts/lib/gate-reuse.mjs");
const identity = gateCodeIdentity(root);
const selected = runner.suites.filter((row) => !row.document && !row.instance);
const binder = taskInputBinder(root, identity);
const tasks = runner
  .expandSuiteTasks(selected, root, "<probe-template>")
  .map((task) => ({ ...task, inputBinding: binder.bind(task) }));
const covering = await coveringTaskResults(root, "npm test", tasks);
console.log("identity", identity, "carried", [...covering.results.keys()]);
const reasons = new Map();
for (const [name, reason] of covering.declined)
  reasons.set(reason, [...(reasons.get(reason) ?? []), name]);
for (const [reason, names] of reasons)
  console.log(`${names.length} declined: ${reason}\n   ${names.join(", ")}`);
