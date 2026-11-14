// Final review of WO-276: an instance on the previous release's kit takes this
// release's kit by the steps the kit guide gives (§Taking upstream updates),
// and its own checks and document gate are run before and after. No suite
// and no evidence of the order makes this update: every update fixture
// derives both of its sides from one tree.
//
// Arguments, all outside the repository:
//   argv[2]  a clean checkout of the base commit, dependencies installed and
//            packages built (git clone, npm ci --offline, node scripts/build.mjs)
//   argv[3]  a committed copy of the candidate tree, installed and built alike
//   argv[4]  an empty work directory
// The starter's next revision is made as a release close's refresh leaves it:
// the candidate's `export --update`, then each seed a fresh export of the
// candidate writes differently or adds, then the starter's own emit. The
// script asserts that the starter's tree then equals a fresh export's.
// Prints one JSON document; paths under the three arguments are shortened.
import { execFileSync, spawnSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";

const [baseCore, candidateCore, work] = process.argv
  .slice(2)
  .map((value) => resolve(value));
if (!work || readdirSync(work).length)
  throw new Error("usage: <base checkout> <candidate checkout> <empty dir>");
const short = (text) =>
  String(text)
    .replaceAll(work, "<work>")
    .replaceAll(baseCore, "<base>")
    .replaceAll(candidateCore, "<candidate>")
    .replace(
      /\/(?:private\/)?var\/folders\/\S+?(?=\/(?:starter|instance|fresh))/gu,
      "<work>",
    );
const steps = [];
/** Run one command; record its exit code and the lines `keep` selects. */
const run = (label, cwd, command, args, keep = (lines) => lines.slice(-1)) => {
  const ran = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 1 << 28,
    timeout: 600_000,
  });
  const lines = `${ran.stdout ?? ""}${ran.stderr ?? ""}`
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
  const step = {
    step: label,
    exit: ran.status,
    said: keep(lines).map((line) => short(line).slice(0, 400)),
  };
  steps.push(step);
  return { ...step, lines };
};
const must = (ran) => {
  if (ran.exit !== 0)
    throw new Error(
      `${ran.step} exited ${ran.exit}: ${ran.lines.slice(-5).join(" | ")}`,
    );
  return ran;
};
const git = (cwd, ...args) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 1 << 28,
  }).trim();
const identify = (cwd) => {
  git(cwd, "config", "user.name", "rehearsal");
  git(cwd, "config", "user.email", "rehearsal@example.invalid");
  git(cwd, "config", "commit.gpgsign", "false");
};
const commitAll = (cwd, message) => {
  git(cwd, "add", "-A");
  if (!git(cwd, "status", "--porcelain")) return null;
  git(cwd, "commit", "-q", "-m", message);
  return git(cwd, "rev-parse", "--short", "HEAD");
};
const install = (label, cwd) =>
  must(
    run(label, cwd, "npm", [
      "ci",
      "--offline",
      "--no-audit",
      "--no-fund",
      "--loglevel=error",
    ]),
  );
const node = process.execPath;
const matching = (pattern) => (lines) =>
  lines.filter((line) => pattern.test(line)).slice(0, 6);
const gate = (label, cwd) =>
  run(label, cwd, "npm", ["run", "test:docs"], (lines) => [
    ...lines
      .filter((line) => /^FAIL |\] stale |Run npm run sync/u.test(line))
      .slice(0, 4),
    ...lines.slice(-1),
  ]);
/** Files under a root, relative, outside what an install or a run leaves. */
const tree = (root) => {
  const found = [];
  const walk = (directory) => {
    for (const entry of readdirSync(join(root, directory), {
      withFileTypes: true,
    })) {
      const path = join(directory, entry.name);
      if ([".git", "node_modules", ".runtime"].includes(entry.name)) continue;
      if (entry.isDirectory()) walk(path);
      else found.push(path);
    }
  };
  walk("");
  return found.sort();
};
const differing = (left, right) => {
  const names = new Set([...tree(left), ...tree(right)]);
  const bytes = (root, path) => {
    try {
      return readFileSync(join(root, path));
    } catch {
      return null;
    }
  };
  return [...names].sort().filter((path) => {
    const a = bytes(left, path);
    const b = bytes(right, path);
    return a === null || b === null || !a.equals(b);
  });
};

// 1. The previous release's kit, exported as the starter, and an instance of it.
const starter = join(work, "starter");
const instance = join(work, "instance");
const fresh = join(work, "fresh");
must(
  run("base: export the kit", baseCore, node, [
    "scripts/launchpad.mjs",
    "export",
    starter,
  ]),
);
identify(starter);
commitAll(starter, "Export the kit of the base commit");
git(work, "clone", "-q", "-o", "upstream", starter, instance);
identify(instance);
install("instance: install", instance);
must(run("instance: bootstrap", instance, node, ["scripts/bootstrap.mjs"]));
must(
  run("instance: sync, as its first steps", instance, "npm", [
    "run",
    "--silent",
    "sync",
  ]),
);
appendFileSync(join(instance, "README.md"), "\nAn instance's own line.\n");
// An ignored list in the form every earlier release read: one unmarked entry.
mkdirSync(join(instance, "docs/control/local"), { recursive: true });
writeFileSync(
  join(instance, "docs/control/local/terms.txt"),
  "zyxwvut-rehearsal-term\n",
);
commitAll(instance, "The instance's own first work");
const before = gate(
  "instance on the previous release: document gate",
  instance,
);

// 2. The starter's next revision, as this release's close leaves it.
must(
  run(
    "candidate: update the starter",
    candidateCore,
    node,
    ["scripts/launchpad.mjs", "export", "--update", starter],
    matching(/^kit files:/u),
  ),
);
must(
  run("candidate: a fresh export", candidateCore, node, [
    "scripts/launchpad.mjs",
    "export",
    fresh,
  ]),
);
const seeds = differing(fresh, starter);
for (const path of seeds) {
  mkdirSync(dirname(join(starter, path)), { recursive: true });
  cpSync(join(fresh, path), join(starter, path), { verbatimSymlinks: true });
}
install("starter: install", starter);
must(run("starter: emit", starter, node, ["scripts/harness.mjs", "emit"]));
const starterEqualsFresh = differing(fresh, starter).length === 0;
commitAll(starter, "The starter's refresh to the candidate");

// 3. The instance takes it by the guide's steps.
git(instance, "config", "remote.upstream.tagOpt", "--no-tags");
git(instance, "fetch", "-q", "--no-tags", "upstream");
git(
  instance,
  "worktree",
  "add",
  "-q",
  "--detach",
  ".runtime/upstream-preview",
  "upstream/main",
);
const preview = must(
  run(
    "instance: preview with the incoming launchpad",
    instance,
    node,
    [
      ".runtime/upstream-preview/scripts/launchpad.mjs",
      "preview",
      "--from",
      "upstream/main",
    ],
    matching(/^kit files:|^instance files both sides changed|does not meet/u),
  ),
);
git(instance, "worktree", "remove", ".runtime/upstream-preview");
git(instance, "switch", "-q", "-c", "chore/starter-update");
const merge = run("instance: git merge upstream/main", instance, "git", [
  "merge",
  "-q",
  "--no-edit",
  "upstream/main",
]);
must(run("instance: emit", instance, node, ["scripts/harness.mjs", "emit"]));
must(
  run("instance: lineage index", instance, node, [
    "scripts/lineage.mjs",
    "index",
  ]),
);
const regenerated = commitAll(instance, "Take the starter update");
const checks = [
  run("instance: harness check", instance, node, [
    "scripts/harness.mjs",
    "check",
  ]),
  run("instance: lineage index --check", instance, node, [
    "scripts/lineage.mjs",
    "index",
    "--check",
  ]),
  run("instance: launchpad verify", instance, node, [
    "scripts/launchpad.mjs",
    "verify",
  ]),
  run("instance: host report", instance, node, ["scripts/doctor.mjs"]),
  run("instance: index --check before the index is run", instance, "npm", [
    "run",
    "--silent",
    "work-orders",
    "--",
    "index",
    "--check",
  ]),
];
must(
  run(
    "instance: index, the guide's step for this release",
    instance,
    "npm",
    ["run", "--silent", "work-orders", "--", "index"],
    () => [],
  ),
);
commitAll(instance, "The index's two records");
checks.push(
  run("instance: index --check after it", instance, "npm", [
    "run",
    "--silent",
    "work-orders",
    "--",
    "index",
    "--check",
  ]),
  run("instance: terms over the branch", instance, node, [
    "scripts/terms.mjs",
    "branch",
  ]),
);
const afterGuide = gate(
  "instance after the guide's steps: document gate",
  instance,
);
must(
  run(
    "instance: sync, which the gate names",
    instance,
    "npm",
    ["run", "--silent", "sync"],
    () => [],
  ),
);
const synced = git(instance, "status", "--porcelain")
  .split("\n")
  .filter(Boolean);
commitAll(instance, "What the sync regenerated");
const afterSync = gate("instance after the sync: document gate", instance);
const product = run("instance after the sync: product gate", instance, "npm", [
  "test",
]);

console.log(
  JSON.stringify(
    {
      baseKit: git(baseCore, "rev-parse", "HEAD"),
      previousReleaseDocumentGate: before.exit,
      starterRevisionEqualsAFreshExport: starterEqualsFresh,
      seedsTheRefreshWrote: seeds,
      preview: preview.said,
      mergeExit: merge.exit,
      mergeIsATrueMerge:
        git(
          instance,
          "rev-list",
          "--min-parents=2",
          "--count",
          "main..HEAD",
        ) !== "0",
      regeneratedBytesAfterEmitAndLineage: regenerated !== null,
      checksAfterTheMerge: Object.fromEntries(
        checks.map(({ step, exit, said }) => [step, { exit, said }]),
      ),
      documentGateAfterTheGuidesSteps: {
        exit: afterGuide.exit,
        said: afterGuide.said,
      },
      whatTheSyncRegenerated: synced,
      documentGateAfterTheSync: { exit: afterSync.exit, said: afterSync.said },
      productGateAfterTheSync: { exit: product.exit, said: product.said },
      steps,
    },
    null,
    2,
  ),
);
