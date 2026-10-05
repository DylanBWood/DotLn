import fs from "node:fs";
import cp from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { performance } from "node:perf_hooks";
import { createHook, executionAsyncId } from "node:async_hooks";
const contexts = new Map();
createHook({
  init(id, type, trigger, resource) {
    if (type === "Test") contexts.set(id, resource);
    else if (contexts.has(trigger)) contexts.set(id, contexts.get(trigger));
  },
  destroy(id) {
    contexts.delete(id);
  },
}).enable();
const caseName = () => {
  let context = contexts.get(executionAsyncId());
  const names = [];
  while (context?.name) {
    names.unshift(context.name);
    context = context.parent;
  }
  return names.join(" > ") || "<module setup>";
};
const append = fs.appendFileSync,
  target = process.env.WO186_PROFILE;
for (const name of ["spawnSync", "execFileSync", "execSync"]) {
  const original = cp[name];
  cp[name] = function (command, ...args) {
    const start = performance.now(),
      at = new Date().toISOString(),
      caseLabel = caseName();
    try {
      return original.call(this, command, ...args);
    } finally {
      if (target)
        append(
          target,
          JSON.stringify({
            pid: process.pid,
            operation: name,
            command: String(command),
            args: Array.isArray(args[0]) ? args[0] : [],
            cwd: process.cwd(),
            case: caseLabel,
            at,
            durationMs: performance.now() - start,
          }) + "\n",
        );
    }
  };
}
syncBuiltinESMExports();
