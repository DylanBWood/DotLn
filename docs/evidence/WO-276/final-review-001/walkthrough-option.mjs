// Final review of WO-276: packages/console/fixtures/live-walkthrough.mjs
// still hands the resident host `workOrderIndexPath`, an option this order
// replaced with `workOrderCards`. This builds the host with the options that
// file passes, over a fresh store under the scratch directory given as
// argv[2], starts it once and prints the work-order view it publishes with
// the line the console shows for it. Adapted from the review worker's probe.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const repo = process.cwd();
const scratch = process.argv[2];
const dist = (path) => import(pathToFileURL(join(repo, path)).href);
const { decodeResidentConfiguration } = await dist(
  "packages/skeleton/dist/src/resident-state.js",
);
const { ResidentHost } = await dist(
  "packages/skeleton/dist/src/resident-host.js",
);
const { workOrderSourceReason } = await dist(
  "packages/console/dist/src/runtime-status.js",
);
const walkthrough = readFileSync(
  join(repo, "packages/console/fixtures/live-walkthrough.mjs"),
  "utf8",
);
const fixture = JSON.parse(
  readFileSync(
    join(repo, "packages/skeleton/fixtures/wo067-presence.json"),
    "utf8",
  ),
);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const directory = join(scratch, "store-walkthrough");
rmSync(directory, { recursive: true, force: true });
mkdirSync(directory, { recursive: true });
const spec = {
  kind: "script",
  effect: "repo.inspect",
  surface: "fixture.source",
  resources: { files: 1, lines: 0, tokens: 0 },
  command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
  cwd: directory,
  timeoutMs: 1000,
  expectedStdoutSha256: hash("ok\n"),
};
const configuration = decodeResidentConfiguration({
  ...structuredClone(fixture),
  policyId: "fixture.progressive",
  actors: Object.fromEntries(
    ["probe", "widen", "peak"].map((phase) => [phase, spec]),
  ),
  evidence: ["verified-input"],
});
const host = new ResidentHost({
  directory,
  policyId: configuration.policyId,
  configuration,
  commandRoot: repo,
  workOrderIndexPath: join(repo, "docs/work-orders/README.md"),
});
try {
  await host.start();
} finally {
  host.close();
}
const view = JSON.parse(
  readFileSync(join(directory, "runtime-status-v1.json"), "utf8"),
).workOrders;
rmSync(directory, { recursive: true, force: true });
console.log(
  JSON.stringify(
    {
      walkthroughPassesTheRemovedOption:
        walkthrough.includes("workOrderIndexPath"),
      walkthroughPassesTheNewOption: walkthrough.includes("workOrderCards"),
      workOrders: view.status,
      reason: view.reason ?? null,
      items: view.items.length,
      consoleLine: view.reason ? workOrderSourceReason(view.reason) : null,
    },
    null,
    2,
  ),
);
