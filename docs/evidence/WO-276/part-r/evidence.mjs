// Part R's evidence, taken from the candidate:
//
//   kit-root.json              criterion R1: what the sites that once compared
//                              an order's number with one of core's give in a
//                              kit root, beside core's own root
//   withdrawal.json            criterion R2: the withdrawal of an order that was
//                              filed and never activated, and the index after it
//   batches.json               criterion R3: a batch refused for the register it
//                              would leave, and the batch that applies
//   preflight-advisories.json  criterion R5: the lines `npm run plan -- check`
//                              prints for this repository's sequence
//
//   node docs/evidence/WO-276/part-r/evidence.mjs
//
// Every fixture is a temporary directory outside the repository, removed at
// the end. Nothing of this repository's records is written but the four files.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const load = (path) => import(pathToFileURL(join(root, path)).href);
const save = (name, value) =>
  writeFileSync(join(here, name), `${JSON.stringify(value, null, 2)}\n`);
const temporary = [];
const directory = (name) => {
  const made = realpathSync(
    mkdtempSync(join(tmpdir(), `dotln-part-r-${name}-`)),
  );
  temporary.push(made);
  return made;
};
const put = (base, path, text) => {
  mkdirSync(dirname(join(base, path)), { recursive: true });
  writeFileSync(join(base, path), text);
};
const outcome = (operation) => {
  try {
    return operation();
  } catch (error) {
    return { refused: error.message.split("\n")[0] };
  }
};
const fixtureEnv = {
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => !/^(?:CLAUDE|CODEX|COPILOT|DOTLN_|GIT_)/u.test(name),
    ),
  ),
  GIT_AUTHOR_NAME: "fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const git = (cwd, ...args) =>
  execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    env: fixtureEnv,
  });

try {
  // ---------------------------------------------------------- criterion R1
  const { isCoreRoot } = await load("scripts/lib/harness-runtime.mjs");
  const { currentEvidence } = await load(
    "packages/skeleton/src/evidence-editions.mjs",
  );
  const { activatesNotesContract } = await load("scripts/release.mjs");
  const { compilePlanRefuter } = await load(
    "packages/skeleton/dist/src/loadouts/plan-refuter.js",
  );
  const { persistedCorrectionIds } = await load("scripts/lib/meta.mjs");
  const { renderPlanReceipt } = await load("scripts/lib/plan-receipts.mjs");
  // A committed receipt, with one order of its subject renamed to the number
  // of core's order that built the refuter: the page says so in core alone.
  const receipts = join(root, "docs/planning/refutations");
  const receipt = JSON.parse(
    readFileSync(
      join(
        receipts,
        readdirSync(receipts)
          .filter((name) => name.endsWith(".json"))
          .sort()
          .at(-1),
      ),
      "utf8",
    ),
  );
  const renamed = {
    ...receipt,
    subject: {
      ...receipt.subject,
      orders: receipt.subject.orders.map((order, index) =>
        index === 0 ? { ...order, workOrderId: "WO-041" } : order,
      ),
    },
  };
  const sites = (base) => {
    const core = isCoreRoot(base);
    put(
      base,
      "docs/evidence/WO-172/direction-agreement.json",
      `${JSON.stringify({ correctionsNotRecorded: ["WO-804-D001"] })}\n`,
    );
    return {
      isCoreRoot: core,
      receiptPageNamesCoresOrder: /Self-referential instrument: WO-041/u.test(
        renderPlanReceipt(renamed, core),
      ),
      releaseNoteContractSwitchedByWO024: activatesNotesContract(
        base,
        "WO-024",
      ),
      feedbackEditionWO011Revision002: outcome(
        () =>
          currentEvidence(base, "feedback", {
            workOrder: "WO-011",
            revision: "002",
          }).directory,
      ),
      feedbackEditionWO011NoRevision: outcome(
        () =>
          currentEvidence(base, "feedback", {
            workOrder: "WO-011",
            revision: null,
          }).directory,
      ),
      refuterKnownFacts: compilePlanRefuter("fixture", 0, core).program
        .workOrder.knownFacts,
      persistedCorrectionIdsReadFromWO172: [...persistedCorrectionIds(base)],
    };
  };
  const coreRoot = directory("core");
  const kitRoot = directory("kit");
  put(kitRoot, "KIT-MANIFEST.json", "{}\n");
  save("kit-root.json", {
    note: "Each value is what the function gives in the root. The effort exemption, the two one-time continuations, the index card's delivery line and the ledger duty need a lifecycle or a planning fixture: their kit-root cases are in scripts/test-resume.sh, scripts/test-plan-refutation.mjs and scripts/test-work-orders.mjs (WO-276 criterion R1).",
    coreRoot: sites(coreRoot),
    kitRoot: sites(kitRoot),
  });

  // ---------------------------------------------------------- criterion R2
  const { copyFixtureFiles } = await load("scripts/lib/fixture-inputs.mjs");
  const { installBeaconFixture } = await load(
    "scripts/test-beacon-fixture.mjs",
  );
  const launchpad = directory("withdrawal");
  mkdirSync(join(launchpad, "scripts"), { recursive: true });
  for (const inputs of [
    "scripts/test-off-ramps.fixture-inputs.json",
    "scripts/test-work-orders.fixture-inputs.json",
  ])
    copyFixtureFiles(root, launchpad, inputs);
  cpSync(join(root, "scripts/lib"), join(launchpad, "scripts/lib"), {
    recursive: true,
  });
  installBeaconFixture(launchpad);
  git(launchpad, "init", "-q");
  cpSync(join(root, ".gitignore"), join(launchpad, ".gitignore"));
  const orderPath = "docs/work-orders/WO-151-never-activated.md";
  const orderText =
    "# WO-151 — Never activated\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** none.\n";
  put(launchpad, orderPath, orderText);
  put(
    launchpad,
    "docs/planning/work-order-map.md",
    "# Plan\n\n<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
  );
  const capture = "docs/intake/notes/abandon.md";
  const captured = "Operator: drop WO-151; it was never started.\n";
  put(launchpad, capture, captured);
  git(launchpad, "add", "-A");
  git(
    launchpad,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-q",
    "-m",
    "fixture",
  );
  const run = (script, args) => {
    const result = spawnSync(
      process.execPath,
      [join(launchpad, script), ...args],
      { cwd: launchpad, encoding: "utf8", env: fixtureEnv },
    );
    return {
      exit: result.status,
      output: `${result.stdout}${result.stderr}`
        .replaceAll(launchpad, "<fixture>")
        .trim()
        .split("\n")
        .slice(-6),
    };
  };
  const withdraw = (id) => [
    "withdraw",
    "--disposition",
    "abandoned",
    "--reason",
    "set aside before it began",
    "--capture",
    capture,
    "--capture-hash",
    `sha256:${createHash("sha256").update(captured).digest("hex")}`,
    "--harness",
    "human",
    "--harness-version",
    "not-applicable",
    "--model",
    "human",
    "--effort",
    "unknown",
    "--source",
    "operator-attested",
    "--work-order",
    id,
  ];
  const noFile = run("scripts/resume.mjs", withdraw("WO-152"));
  const withdrawn = run("scripts/resume.mjs", withdraw("WO-151"));
  const segment = join(launchpad, "docs/control/orders/WO-151.jsonl");
  const events = outcome(() =>
    readFileSync(segment, "utf8")
      .trim()
      .split("\n")
      .map((line) => {
        const { recordedAt: _at, ...event } = JSON.parse(line);
        return event;
      }),
  );
  const written = run("scripts/work-orders.mjs", ["index"]);
  const checked = run("scripts/work-orders.mjs", ["index", "--check"]);
  const history = outcome(() =>
    readFileSync(join(launchpad, "docs/work-orders/HISTORY.md"), "utf8")
      .split("\n")
      .filter((line) => /Withdraw|WO-151/u.test(line)),
  );
  save("withdrawal.json", {
    note: "A fixture launchpad holding one order file, WO-151, and no event for it. The event is shown without its recordedAt.",
    orderFileSha256: `sha256:${createHash("sha256").update(orderText).digest("hex")}`,
    withdrawAnIdentifierWithNoFile: noFile,
    withdrawTheFiledOrder: withdrawn,
    eventsOfTheOrder: events,
    indexWritten: written,
    indexCheck: checked,
    historyPageLines: history,
  });

  // ---------------------------------------------------------- criterion R3
  const followups = await load("scripts/lib/planning-followups.mjs");
  const register = directory("register");
  git(register, "init", "-q", "-b", "wo-999");
  put(
    register,
    "docs/product/ideas.md",
    "## Candidate — First\nScope one.\n\n## Candidate — Second\nScope two.\n",
  );
  for (const id of ["WO-888", "WO-889"])
    put(register, `docs/work-orders/${id}-fixture.md`, "# Filed target\n");
  const [first, second] = followups.syncFollowups(register).entries;
  const request = (revision, entry, status, targets = []) => ({
    expectedRevision: revision,
    id: entry.id,
    sourceRevision: entry.revisions.length,
    status,
    reason: `Synthetic ${status} disposition with explicit coverage`,
    reopenWhen: "Changed evidence or operator direction",
    targets,
  });
  for (const [entry, target] of [
    [first, "WO-888"],
    [second, "WO-889"],
  ])
    followups.disposeFollowup(
      register,
      request(
        followups.planningFollowups(register).revision,
        entry,
        "allocated",
        [target],
      ),
    );
  // The planner reads the revision; the same change removes one order's file.
  const revision = followups.planningFollowups(register).revision;
  const current = () => followups.readFollowups(register).entries;
  const [allocatedFirst, allocatedSecond] = current();
  rmSync(join(register, "docs/work-orders/WO-888-fixture.md"));
  const registerFile = join(register, "docs/planning/followups.json");
  const before = readFileSync(registerFile, "utf8");
  const refusedBatch = outcome(() =>
    followups.disposeFollowups(register, [
      request(revision, allocatedSecond, "deferred"),
    ]),
  );
  const unchanged = readFileSync(registerFile, "utf8") === before;
  const appliedBatch = outcome(() =>
    followups.disposeFollowups(register, [
      request(revision, allocatedFirst, "deferred"),
    ]),
  );
  save("batches.json", {
    note: "Two rows allocated to WO-888 and WO-889; the change then removes WO-888's file. The first batch re-disposes the other row and leaves the row that names WO-888; the second re-disposes that row.",
    rowAllocatedToTheRemovedOrder: allocatedFirst.id,
    batchThatLeavesTheRow: refusedBatch,
    registerUnchangedAfterTheRefusal: unchanged,
    batchThatReDisposesTheRow: appliedBatch,
    registerReadsAfterIt: outcome(
      () => followups.planningFollowups(register).revision,
    ),
  });

  // ---------------------------------------------------------- criterion R5
  const check = spawnSync("npm", ["run", "plan", "--silent", "--", "check"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const result = JSON.parse(check.stdout);
  save("preflight-advisories.json", {
    note: "npm run plan -- check in this repository: its exit status and the preflight advisories it returned, one for each machinery suite an active or open order's execution plan owes and its Preflight field does not name.",
    exit: check.status,
    receipts: result.receipts,
    passes: result.passes,
    preflightAdvisories: result.preflightAdvisories,
  });
  console.log("part-r evidence written");
} finally {
  for (const path of temporary)
    rmSync(path, { recursive: true, force: true, maxRetries: 5 });
}
