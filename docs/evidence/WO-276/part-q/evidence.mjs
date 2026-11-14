// Part Q's evidence beside the two timing readings, taken from the candidate:
// the hook registrations the settings hold, for this checkout and for a
// target worktree, and the counts of criteria Q3 and Q4 (the Git calls a tool
// call makes on a planning branch; the files and bytes each authorship
// snapshot reads).
//
//   node docs/evidence/WO-276/part-q/evidence.mjs
//
// The counts come from the harness suite's two counting cases, run here with
// the file to write named in the environment, as timings.mjs runs the timing
// case.
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const load = (path) => import(pathToFileURL(join(root, path)).href);

// The registrations: each event's groups, a group's matcher and its hooks.
const registrations = (settings) =>
  Object.entries(settings.hooks).flatMap(([event, groups]) =>
    groups.map((group) => ({
      event,
      matcher: group.matcher ?? null,
      hooks: group.hooks.map(
        (hook) => /hooks\/([a-z-]+)\.mjs/u.exec(hook.command)[1],
      ),
    })),
  );
const { lowerToHarness } = await load("packages/compiler/dist/src/index.js");
const { contributorConfiguredProgram, targetWorkerProfiles } = await load(
  "packages/skeleton/dist/src/loadouts/contributor.js",
);
const { personalFeedback } = await load(
  "packages/skeleton/dist/src/loadouts/feedback.js",
);
const { harnessInstallation } = await load("scripts/lib/harness.mjs");
const runtime = harnessInstallation();
const profile = targetWorkerProfiles.find(
  (entry) => entry.profileId === "target-worker-claude",
);
const program = contributorConfiguredProgram();
// A target's bundle as the emitter lowers it, for a launchpad and a target
// that are only named here: the registrations do not depend on either.
const target = lowerToHarness(
  program,
  personalFeedback(),
  program.loadout.authorityEnvelope,
  {
    ...profile,
    runtime: {
      ...profile.runtime,
      snapshot: runtime.runtimeSnapshot,
      files: runtime.runtimeFiles,
      importRoot: "/launchpad",
      targetId: "0".repeat(64),
    },
  },
);
const emitted = {
  note: "The hook registrations of the emitted settings: this checkout's .claude/settings.json, and the settings of a target worktree's bundle. A matcher of null is an event that takes none. hookFiles lists the hook files beside them.",
  launchpad: {
    registrations: registrations(
      JSON.parse(readFileSync(join(root, ".claude/settings.json"), "utf8")),
    ),
    hookFiles: readdirSync(join(root, ".claude/hooks")).sort(),
  },
  target: {
    registrations: registrations(
      JSON.parse(
        target.files.find((file) => file.path === ".claude/settings.json")
          .contents,
      ),
    ),
    hookFiles: target.files
      .map((file) => file.path)
      .filter((path) => path.startsWith(".claude/hooks/"))
      .map((path) => path.slice(".claude/hooks/".length))
      .sort(),
  },
};
writeFileSync(
  join(here, "settings.json"),
  JSON.stringify(emitted, null, 2) + "\n",
);
console.log("settings.json written");

// The counts of criteria Q3 and Q4.
const out = join(here, "counts.json");
rmSync(out, { force: true });
const run = spawnSync(
  process.execPath,
  [
    "--test",
    "--test-name-pattern",
    "WO-276 criterion Q3: on a planning branch|WO-276 criterion Q4: two authorship snapshots",
    join(root, "scripts/test-harness.mjs"),
  ],
  {
    cwd: root,
    env: { ...process.env, DOTLN_HOOK_COUNTS: out },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  },
);
if (run.status !== 0 || !existsSync(out))
  throw new Error(
    `the counting cases did not pass: ${run.stdout.slice(-2000)}`,
  );
console.log("counts.json written");
