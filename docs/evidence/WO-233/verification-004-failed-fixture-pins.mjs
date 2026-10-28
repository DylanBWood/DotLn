// VER-004 probe: a failed suite's fixture past its diagnosis window that no
// lifecycle removes. Two triggers, each a dry-run pruneHarness from a
// synthetic main checkout over a synthetic temporary base, as release close's
// prune runs (no finishing gate). The fixture F of gate G in worktree W ended
// failed in 2020; it holds a nested root N that shares its lifetime (N's
// fixtureOwner names F), and every owner is dead.
// (1) A repository is gone. Release close removes the closing order's
// worktree before it prunes (scripts/release.mjs), and that worktree is the
// owner repository of every fixture its gates left. blockedByUse calls
// activeGateRuns on the containing fixture's repository, and on N's own when
// no gate is finishing; activeGateRuns resolves it with realpathSync, which
// throws for a removed directory, and judgeTemporaryRoot retains on any error.
// Arms: (control) W and N's repository exist; (worktree-removed) W removed;
// (later) the same judged in 2036; (nested-removed) N's repository removed.
// (2) N is a warm fixture inside F, as scripts/test-temporary-roots.mjs plants
// one in its own fixture root. A warm fixture is retained while its
// repository's current key is unavailable, so N never ends with F. Arm:
// (nested-warm) W exists.
// Then, read-only, this machine: the failed system-temp roots this worktree
// owns that hold a fixture-owned nested root, with their bytes (trigger 1 at
// this order's release close), and the reasons the prune gives for each of
// them 49 hours on with this worktree's writer treated as released (trigger
// 2 and any other reason time cannot end). That judgment passes a finishing
// gate naming this worktree only to skip its writer reservation; it is
// counted for records with a fixtureOwner and an existing repository, where
// that context changes nothing else. The probe removes everything it created.
// Exit 1 when the control arm lists F as a candidate and another arm retains
// it; exit 2 when the control arm does not list F.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-004-failed-fixture-pins.mjs
import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = realpathSync(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
const {
  createTemporaryRoot,
  finishTemporaryRoot,
  nestedTemporaryRoots,
  readTemporaryOwner,
  temporaryInventory,
  temporaryProcessTable,
} = await import(join(sourceRoot, "scripts/lib/temporary-roots.mjs"));
const { pruneHarness } = await import(
  join(sourceRoot, "scripts/lib/harness-prune.mjs")
);
const { judgeTemporaryRoot } = await import(
  join(sourceRoot, "scripts/lib/temporary-prune.mjs")
);
const { runGit } = await import(join(sourceRoot, "scripts/lib/git.mjs"));

const temp = realpathSync(tmpdir());
// The scaffold is this probe's own, outside the dotln-* families it measures.
const scaffold = realpathSync(mkdtempSync(join(temp, "v004-fixture-pins-")));
const ended = "2020-01-01T00:00:00.000Z";
const dead = { pid: 2147483647, birth: "1.0", session: "0".repeat(64) };
const repository = (path) => {
  mkdirSync(path, { recursive: true });
  runGit(path, ["-c", "init.templateDir=", "init", "-q", "-b", "main"]);
  return realpathSync(path);
};
const shown = (text) =>
  text?.split(scaffold).join("<scaffold>").split(temp).join("<system-temp>") ??
  null;

async function arm(name, options = {}) {
  const at = join(scaffold, name);
  const main = repository(join(at, "main"));
  const worktree = repository(join(at, "worktree"));
  const base = join(at, "temp");
  mkdirSync(base);
  const owner = { ...dead, gateId: randomUUID(), suite: "harness-fixtures" };
  const fixture = createTemporaryRoot(join(base, "dotln-fixture-temporary-"), {
    class: "gate-fixture",
    repository: worktree,
    owner,
  });
  const nestedRepository = repository(join(fixture, "dotln-harness-test-repo"));
  const nested = createTemporaryRoot(join(fixture, "dotln-nested-"), {
    class: options.warm ? "warm-fixture" : "session-scratch",
    repository: nestedRepository,
    owner,
    ...(options.warm ? { cacheKey: "planted" } : {}),
  });
  // As the gate's completion records a failed suite (finishGateTemporaryRoots).
  finishTemporaryRoot(nested, "failed", ended);
  finishTemporaryRoot(fixture, "failed", ended);
  const sharesLifetime =
    readTemporaryOwner(nested).fixtureOwner?.token ===
    readTemporaryOwner(fixture).token;
  if (options.removeWorktree)
    rmSync(worktree, { recursive: true, force: true });
  if (options.removeNested)
    rmSync(nestedRepository, { recursive: true, force: true });
  const report = await pruneHarness(main, {
    apply: false,
    scope: "repository",
    temporaryBases: [base],
    hostDirectory: join(main, ".runtime/host"),
    processes: [],
    openPaths: [],
    sessionId: "verification-004",
    ...(options.now ? { now: options.now } : {}),
  });
  return {
    fixtureIsCandidate: report.candidates.some((row) => row.path === fixture),
    fixtureRetainedReason: shown(
      report.retained.find((row) => row.path === fixture)?.reason,
    ),
    nestedSharesFixtureLifetime: sharesLifetime,
    worktreeExists: existsSync(worktree),
    nestedRepositoryExists: existsSync(nestedRepository),
  };
}

// This machine, read-only.
function machine() {
  const table = temporaryProcessTable(sourceRoot);
  const released = {
    worktrees: [],
    holders: [],
    processes: table,
    openPaths: [],
    finishingGate: { repository: resolve(sourceRoot), id: "verifier-released" },
  };
  const later = Date.now() + 49 * 3_600_000;
  const generic = (reason) =>
    reason.replace(
      /dotln-[A-Za-z0-9._-]+|[a-f0-9]{64}|(?:orphan|warm)-\w+|\/(?:private\/)?var\/folders\/[^ ')]+/g,
      "<name>",
    );
  const result = {
    failedRootsOwnedByWorktree: 0,
    holdingFixtureOwnedNested: 0,
    fixtureOwnedNested: 0,
    bytesHoldingFixtureOwnedNested: 0,
    judgedIn49hWriterReleased: { candidates: 0, retained: {} },
    retainedRoots: [],
  };
  for (const name of readdirSync(temp)) {
    if (!name.startsWith("dotln-")) continue;
    const path = join(temp, name);
    let record;
    try {
      record = readTemporaryOwner(path);
    } catch {
      continue;
    }
    if (record?.owner.repository !== sourceRoot || record.outcome !== "failed")
      continue;
    result.failedRootsOwnedByWorktree++;
    let count = 0;
    const walk = (at) => {
      for (const child of nestedTemporaryRoots(at)) {
        try {
          if (readTemporaryOwner(child)?.fixtureOwner) count++;
        } catch {
          // An invalid nested record is the prune's to report.
        }
        walk(child);
      }
    };
    walk(path);
    if (count) {
      result.holdingFixtureOwnedNested++;
      result.fixtureOwnedNested += count;
      result.bytesHoldingFixtureOwnedNested += temporaryInventory(path).bytes;
    }
    const judged = judgeTemporaryRoot(
      sourceRoot,
      path,
      { now: later },
      released,
    );
    if (judged?.candidate) {
      result.judgedIn49hWriterReleased.candidates++;
      continue;
    }
    const reason = generic(judged?.retained?.reason ?? "not judged");
    const bucket = result.judgedIn49hWriterReleased.retained;
    bucket[reason] = (bucket[reason] ?? 0) + 1;
    result.retainedRoots.push({
      root: name,
      gate: record.owner.gateId,
      suite: record.owner.suite ?? null,
      endedAt: record.endedAt ?? null,
      bytes: temporaryInventory(path).bytes,
      reason: shown(judged?.retained?.reason ?? null),
    });
  }
  return result;
}

let output;
try {
  output = {
    control: await arm("control"),
    worktreeRemoved: await arm("worktree-removed", { removeWorktree: true }),
    later: await arm("later", {
      removeWorktree: true,
      now: Date.parse("2036-01-01T00:00:00.000Z"),
    }),
    nestedRemoved: await arm("nested-removed", { removeNested: true }),
    nestedWarm: await arm("nested-warm", { warm: true }),
  };
} finally {
  rmSync(scaffold, { recursive: true, force: true });
}
output.machine = machine();
output.cleanup = { scaffoldRemaining: existsSync(scaffold) };
console.log(JSON.stringify(output, null, 1));
if (!output.control.fixtureIsCandidate) {
  console.error("Inconclusive: the control arm does not list the fixture.");
  process.exitCode = 2;
} else if (
  [
    output.worktreeRemoved,
    output.later,
    output.nestedRemoved,
    output.nestedWarm,
  ].some((row) => !row.fixtureIsCandidate)
) {
  console.error(
    "Reproduced: a failed fixture past its diagnosis window is never a prune candidate.",
  );
  process.exitCode = 1;
}
