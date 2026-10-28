// VER-003 F8 probe: a gate fixture created by a test that a suite runs nested
// inside a copied fixture repository, as scripts/test-host-guard.test.mjs runs
// corpus/harness/wo102-generators.test.mjs through executeSuite, outlives its
// test and every lifecycle that could remove it. The nested child receives
// the outer gate's DOTLN_TEMP_GATE with the copy as DOTLN_TEMP_REPOSITORY, so
// the root registers in the copy's ledger; the copy lacks
// scripts/lib/host-resources.mjs, so the owner's birth is unknown; and
// removeTemporaryPath defers a gate fixture's whole-root teardown to that gate.
// Paired arms run the WO-185 quarantine case in the same copied layout: the
// test file at the order's base (base) and the current one (changed). Each arm
// records its exit code and the dotln-wo185-quarantine-* roots it left. For a
// left root the changed arm records its owner record, whether the outer
// repository's ledger lists it, what finishGateTemporaryRoots selects for the
// gate, and the prune judgment once the copy is gone, as after a real gate.
// The probe removes everything it created, including those roots.
// Exit 1 when the changed arm leaves a root.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-003-nested-suite-residue.mjs
import { execFileSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const base = "bca92e77d03880ec57a83d37eebb85a3a8f7ab76";
const sourceRoot = fileURLToPath(new URL("../../../", import.meta.url));
const { readTemporaryOwner, registeredTemporaryRoots, temporaryProcessTable } =
  await import(join(sourceRoot, "scripts/lib/temporary-roots.mjs"));
const { judgeTemporaryRoot, finishGateTemporaryRoots } = await import(
  join(sourceRoot, "scripts/lib/temporary-prune.mjs")
);
const inputs = JSON.parse(
  readFileSync(
    join(sourceRoot, "scripts/test-host-guard.test.fixture-inputs.json"),
    "utf8",
  ),
);
const temp = realpathSync(tmpdir());
const family = "dotln-wo185-quarantine-";
const listRoots = () =>
  new Set(readdirSync(temp).filter((name) => name.startsWith(family)));
const testFile = "corpus/harness/wo102-generators.test.mjs";
const baseText = execFileSync("git", ["show", `${base}:${testFile}`], {
  cwd: sourceRoot,
  encoding: "utf8",
});
// The scaffold is this probe's own, outside the dotln-* families it measures.
const scaffold = realpathSync(mkdtempSync(join(temp, "v003-nested-probe-")));
const created = new Set();

function arm(name, text) {
  const repo = join(scaffold, name, "repo");
  mkdirSync(join(repo, "docs/control"), { recursive: true });
  writeFileSync(join(repo, "docs/control/budgets.json"), "{}\n");
  for (const file of inputs.files) {
    mkdirSync(dirname(join(repo, file)), { recursive: true });
    cpSync(join(sourceRoot, file), join(repo, file));
  }
  for (const directory of inputs.directories)
    cpSync(join(sourceRoot, directory), join(repo, directory), {
      recursive: true,
    });
  cpSync(
    join(sourceRoot, "packages/kernel/package.json"),
    join(repo, "packages/kernel/package.json"),
  );
  // The host-guard case generates this manifest before its nested test run;
  // the committed manifest stands in for that generation step.
  mkdirSync(join(repo, "corpus/manifests"), { recursive: true });
  cpSync(
    join(sourceRoot, "corpus/manifests/WO-102.json"),
    join(repo, "corpus/manifests/WO-102.json"),
  );
  writeFileSync(join(repo, testFile), text);
  const gateId = randomUUID();
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  // executeSuite gives a nested suite these values (scripts/test-runner.mjs).
  Object.assign(env, {
    DOTLN_TEMP_REPOSITORY: repo,
    DOTLN_TEMP_RETENTION: JSON.stringify({}),
    DOTLN_TEMP_SUITE: "verification-003-nested-suite",
    DOTLN_TEMP_GATE: gateId,
  });
  const before = listRoots();
  const child = spawnSync(
    process.execPath,
    [
      "--test",
      "--test-name-pattern=oversized drift quarantine",
      join(repo, testFile),
    ],
    { cwd: repo, env, encoding: "utf8", timeout: 120_000 },
  );
  const left = [...listRoots()].filter((entry) => !before.has(entry));
  for (const entry of left) created.add(join(temp, entry));
  const passed = /^(?:#|ℹ) pass 1$/m.test(child.stdout ?? "");
  const result = {
    exitCode: child.status,
    quarantineCasePassed: passed,
    rootsLeft: left.length,
    ...(passed
      ? {}
      : {
          outputTail: `${child.stdout ?? ""}${child.stderr ?? ""}`
            .split(scaffold)
            .join("<scaffold>")
            .slice(-1200),
        }),
  };
  if (!left.length) return result;
  const path = join(temp, left[0]);
  const record = readTemporaryOwner(path);
  result.record = {
    class: record.class,
    gateIsArmGate: record.owner.gateId === gateId,
    suite: record.owner.suite,
    repositoryIsCopy: record.owner.repository === realpathSync(repo),
    ownerBirth: record.owner.birth,
    endedAt: record.endedAt ?? null,
    copyLedgerListsIt: registeredTemporaryRoots(repo).some(
      (row) => row.path === path,
    ),
  };
  result.outerLedgerListsIt = registeredTemporaryRoots(sourceRoot).some(
    (row) => row.path === path,
  );
  // Nothing in the outer ledger carries this arm's gate, so this selects and
  // writes nothing; it shows what the gate's completion would account for.
  const finish = finishGateTemporaryRoots(sourceRoot, gateId, [
    { name: "verification-003-nested-suite", exitCode: 0 },
  ]);
  result.gateEndSelection = {
    removed: finish.removed.length,
    retained: finish.retained.length,
    blockers: finish.blockers.length,
  };
  // A real gate removes the copied repository with its own fixture.
  rmSync(join(scaffold, name), { recursive: true, force: true });
  const judged = judgeTemporaryRoot(
    sourceRoot,
    path,
    {},
    {
      worktrees: [],
      holders: [],
      processes: temporaryProcessTable(sourceRoot),
      openPaths: [],
    },
  );
  result.pruneJudgment = judged?.candidate
    ? { candidate: true }
    : {
        candidate: false,
        reason: judged?.retained?.reason ?? null,
        ownerAlive: judged?.retained?.ownerAlive ?? null,
      };
  result.stillExists = existsSync(path);
  return result;
}

let output;
try {
  output = {
    base: arm("base", baseText),
    changed: arm("changed", readFileSync(join(sourceRoot, testFile), "utf8")),
  };
} finally {
  for (const path of created) rmSync(path, { recursive: true, force: true });
  rmSync(scaffold, { recursive: true, force: true });
}
output.cleanup = {
  probeRootsRemaining: [...created].filter((path) => existsSync(path)).length,
  scaffoldRemaining: existsSync(scaffold),
};
console.log(JSON.stringify(output, null, 1));
if (output.changed.rootsLeft) {
  console.error(
    "Nested suite residue reproduced: a gate fixture outlived its test with no lifecycle that removes it.",
  );
  process.exitCode = 1;
}
