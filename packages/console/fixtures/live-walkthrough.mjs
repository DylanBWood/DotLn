#!/usr/bin/env node
// A real resident and read-only script actor; no fake transport or model claim.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { missionConfiguration } from "../../../scripts/resident-bind.mjs";
import { decodeResidentConfiguration } from "../../skeleton/dist/src/resident-state.js";
import { ResidentHost } from "../../skeleton/dist/src/resident-host.js";

const kit = fileURLToPath(new URL("../../../", import.meta.url));
if (process.argv.length !== 3)
  throw new Error(
    "usage: node packages/console/fixtures/live-walkthrough.mjs <scratch-repository>",
  );
const repo = realpathSync(process.argv[2]);
if (
  realpathSync(
    execFileSync("git", ["-C", repo, "rev-parse", "--show-toplevel"], {
      encoding: "utf8",
    }).trim(),
  ) !== repo
)
  throw new Error("walkthrough target must be the Git root");
const git = execFileSync("/usr/bin/which", ["git"], {
  encoding: "utf8",
}).trim();
const lane = join(kit, ".runtime", "wo117-walkthrough");
mkdirSync(lane, { recursive: true });
const directory = mkdtempSync(join(lane, "session-"));
execFileSync("git", [
  "-C",
  kit,
  "check-ignore",
  "-q",
  join(directory, "resident.json"),
]);
const command = [
  process.execPath,
  "--input-type=module",
  "-e",
  `import {execFileSync} from 'node:child_process'; const result = execFileSync(${JSON.stringify(git)}, ['rev-parse','--is-inside-work-tree'], {encoding:'utf8'}); process.stdout.write(result); await new Promise(done=>setTimeout(done,5000));`,
];
const configuration = missionConfiguration({
  kind: "script",
  effect: "repo.read",
  surface: "contributor.mission",
  resources: { files: 0, lines: 0, tokens: 0 },
  command,
  cwd: repo,
  timeoutMs: 15000,
  expectedStdoutSha256: createHash("sha256").update("true\n").digest("hex"),
});
configuration.graph.presence[0].phases[0].entry.cadence = {
  kind: "Every",
  intervalMs: 10000,
};
// This walkthrough's actual adapter is a script, with the same read-only phase.
configuration.graph.presence[0].phases[0].requiredCapabilities = [
  "actor.script",
];
configuration.environment.capabilities = ["actor.script"];
const decoded = decodeResidentConfiguration(configuration);
writeFileSync(
  join(directory, "resident.json"),
  JSON.stringify(decoded, null, 2) + "\n",
  { mode: 0o600 },
);
const store = relative(kit, directory);
console.log(
  `TERMINAL 1 — resident is starting. Leave this terminal open.

TERMINAL 2 — open a second terminal and run:
cd ${kit}
node packages/console/dist/src/cli.js live --store ${store}

In TERMINAL 2, type each command at the live> prompt and press Enter:
1. away
   Wait about 10 seconds. Watch "Actor started", then "Script completed (verified)".
2. back
   Presence should change from away to present.
3. diff
   Read/scroll the diff, then press Enter to return to the live screen.
4. audit
   Read/scroll the audit, then press Enter to return to the live screen.
5. quit

Finally press Ctrl-C in TERMINAL 1 to stop the resident.
Type help at live> for all controls. Logs stay in the ignored local session store.`,
);
const abort = new AbortController();
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"])
  process.once(signal, () => abort.abort());
await new ResidentHost({
  directory,
  policyId: decoded.policyId,
  configuration: decoded,
  commandRoot: kit,
  workOrderIndexPath: join(kit, "docs/work-orders/README.md"),
}).run({ tickMs: 250, signal: abort.signal });
