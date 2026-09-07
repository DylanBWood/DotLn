// Reproduce the synthetic WO-009 fixture; never invokes an authenticated model.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runWorkerDemo } from "../../skeleton/dist/src/worker-demo.js";
import {
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../skeleton/dist/src/worker-transport.js";
const root = fileURLToPath(new URL("../../../", import.meta.url));
const [directory, output] = process.argv.slice(2);
if (
  !directory ||
  !output ||
  process.argv.length !== 4 ||
  existsSync(directory) ||
  existsSync(output)
)
  throw new Error(
    "usage: capture-demo <new-fixture-directory> <new-output.jsonl>",
  );
mkdirSync(directory, { recursive: false, mode: 0o700 });
const processFixture = join(root, "packages/skeleton/fixtures/worker-cli.mjs");
const transport = new CodexCliExecWorkOrderTransport(
  (launch) =>
    runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: [processFixture, "codex-cli-exec", "success", ...launch.args],
    }),
  "0.153.4",
);
let tick = 1_800_000;
const result = await runWorkerDemo({
  directory,
  fixture: JSON.parse(
    readFileSync(
      join(root, "packages/skeleton/fixtures/repo-tree.json"),
      "utf8",
    ),
  ),
  transport,
  model: "fixture-model",
  effort: "unknown",
  now: () => tick++,
});
if (result.envelope.status !== "completed" || !result.scenario.verified)
  throw new Error("demonstration did not complete");
writeFileSync(output, result.scenario.log, { flag: "wx", mode: 0o600 });
process.stdout.write(
  "Synthetic WO-009 demonstration completed; event store recorded.\n",
);
