import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";

const input = JSON.parse(process.argv[2]!) as {
  directory: string;
  control: string;
  points: { op: string; match?: string; when?: "before" | "after" }[];
};
const write = fs.writeFileSync;
const exists = fs.existsSync;
let point = 0;
let claims = 0;
function pause(op: string, path = "", when = "after") {
  const next = input.points[point];
  if (
    !next ||
    next.op !== op ||
    (next.when ?? "after") !== when ||
    (next.match && !path.endsWith(next.match))
  )
    return;
  const current = point++;
  write(`${input.control}.ready-${current}`, "ready");
  while (!exists(`${input.control}.go-${current}`))
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
}
const native = fs as unknown as Record<string, (...args: unknown[]) => unknown>;
for (const op of ["linkSync", "unlinkSync", "readlinkSync"]) {
  const original = native[op]!;
  native[op] = (...args) => {
    const path = String(op === "linkSync" ? args[1] : args[0]);
    pause(op, path, "before");
    const result = original(...args);
    if (op === "linkSync" && path.includes("/next-")) claims++;
    pause(op, path, "after");
    return result;
  };
}
syncBuiltinESMExports();
const { WorkerStore } = await import("../../src/worker-store.js");
const store = new WorkerStore(input.directory);
let acquired = false;
let error = "";
try {
  store.acquire(() => pause("preflight"));
  acquired = true;
} catch (failure) {
  error = String(failure);
}
// Publish atomically: a reader polling for this path must never observe the
// file between creation and its contents landing.
write(
  `${input.control}.result.part`,
  JSON.stringify({ acquired, claims, error }),
);
fs.renameSync(`${input.control}.result.part`, `${input.control}.result`);
process.on("message", () => {
  store.release();
  process.exit(0);
});
