// Read-only subject and carried-evidence comparison. Emits JSON to stdout.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import {
  gateCodeIdentity,
  gateTreeHash,
  findGateCheck,
  activeGateRuns,
} from "../../../scripts/lib/gate-evidence.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const git = (...args) => execFileSync("git", args, { cwd: root });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const checkpoint = "refs/dotln/checkpoint/WO-112/23";
const sourcePaths = git("ls-tree", "-r", "--name-only", checkpoint)
  .toString()
  .trim()
  .split("\n")
  .filter((name) =>
    ["packages/", "scripts/", ".claude/"].some((prefix) =>
      name.startsWith(prefix),
    ),
  );
const compare = (revision, names) =>
  names.map((name) => {
    const original = git("show", `${revision}:${name}`);
    const current = readFileSync(join(root, name));
    return {
      path: name,
      same: original.equals(current),
      sha256: hash(current),
      bytes: current.length,
    };
  });
const source = compare(checkpoint, sourcePaths);
const carried = compare("refs/dotln/checkpoint/WO-112/20", [
  ...[
    "codex-refusal-run.json",
    "control-outward.json",
    "control-page.png",
    "control-run.json",
    "repair-control-outward.json",
    "repair-control-run.json",
    "repair-representative-outward.json",
    "repair-representative-run.json",
    "representative-outward.json",
    "representative-page.png",
    "representative-run.json",
    "scenario.md",
    "preflight.json",
    "preflight.mjs",
    "functional-preparation.json",
  ].map((name) => `docs/evidence/WO-112/${name}`),
  "README.md",
  "docs/product/06-roadmap.md",
  "docs/product/12-workstream-application.md",
  "docs/planning/capability-table.md",
]);
const oldReports = compare(
  checkpoint,
  [1, 2, 3, 4, 5].map(
    (n) => `docs/verifications/WO-112/VER-${String(n).padStart(3, "0")}.md`,
  ),
);
const codeIdentity = gateCodeIdentity(root);
const row = findGateCheck(root, "npm test", gateTreeHash(root));
const {
  cases,
  taskTimeline,
  memory,
  deadlineDiagnostics,
  criticalPath,
  ...gate
} = row;
if (gate.sandbox?.probe)
  gate.sandbox = {
    ...gate.sandbox,
    probe: {
      ...gate.sandbox.probe,
      path: ".claude/hooks (project-relative; physical prefix omitted)",
    },
  };
const writebacks = [
  "docs/product/06-roadmap.md",
  "docs/product/12-workstream-application.md",
].map((path) => ({
  path,
  originalBytes: git("show", `HEAD:${path}`).length,
  currentBytes: readFileSync(join(root, path)).length,
  addedBytes:
    readFileSync(join(root, path)).length - git("show", `HEAD:${path}`).length,
}));
const checks = [[], ["--cached"]].map((args) => {
  try {
    git("diff", ...args, "--check");
    return { index: args.length !== 0, exitCode: 0 };
  } catch (error) {
    return { index: args.length !== 0, exitCode: error.status };
  }
});
console.log(
  JSON.stringify(
    {
      observedAt: new Date().toISOString(),
      checkpoint,
      checkpointCommit: git("rev-parse", checkpoint).toString().trim(),
      codeIdentity,
      checkpointCodeIdentity: gateCodeIdentity(root, checkpoint),
      sourceFilesCompared: source.length,
      sourceMismatches: source.filter((file) => !file.same),
      carried,
      oldReports,
      writebacks,
      checks,
      activeGates: activeGateRuns(root),
      gate,
      gateCases: cases.map(
        ({ name, durationMs, exitCode, executed, outputDigest }) => ({
          name,
          durationMs,
          exitCode,
          executed,
          outputDigest,
        }),
      ),
    },
    null,
    2,
  ),
);
