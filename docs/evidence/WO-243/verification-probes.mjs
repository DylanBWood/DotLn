// Independent verifier probes. All mutations below are confined to disposable
// fixtures; this program reads the candidate implementation without changing it.
import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  withFixture,
  git,
} from "../../../scripts/lib/target-worktree-fixture.mjs";
import { write } from "../../../scripts/lib/helpers.mjs";
import { docPath } from "../../../scripts/lib/config.mjs";
import { readControl } from "../../../scripts/lib/control-store.mjs";
import {
  closeoutScope,
  closeoutCommands,
  loadCloseoutRunner,
} from "../../../scripts/lib/closeout-scope.mjs";
import { targetRegistryPath } from "../../../scripts/lib/target-worktrees.mjs";
import {
  gateCodeIdentity,
  readGateChecks,
} from "../../../scripts/lib/gate-evidence.mjs";
import { requireGateClaims } from "../../../scripts/lib/handoff-ledger.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const checks = [];
const runner = await loadCloseoutRunner();
assert.ok(runner.suites?.length);
const check = (name, body) => {
  body();
  checks.push({ name, result: "pass" });
};

withFixture((f) => {
  const orderText = (review = false, extra = "") =>
    `# WO-999 — independent closeout probe\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n\n**Acceptance criteria (all required)**\n\n1. The registered gate passes: \`node scripts/target-gate.mjs WO-999${review ? " --review" : ""}\`.\n2. \`npm run test:docs\` is green.\n${extra}`;
  write(f.main, f.order, orderText());
  write(
    f.main,
    "scripts/lib/independent-source.mjs",
    "export const value = 1;\n",
  );
  git(f.main, "add", "-A");
  git(
    f.main,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Independent probe baseline",
  );
  git(f.main, "push", "-q", "origin", "main");
  f.mapClone();
  f.start();
  const state = readControl(f.orderRoot).orders.get("WO-999").state;
  const scope = (options = {}) =>
    closeoutScope(f.orderRoot, state, { runner, ...options });
  const document = () => assert.equal(scope().launchpad, "document");
  const complete = (pattern) => {
    const selected = scope();
    assert.equal(selected.launchpad, "complete");
    assert.match(selected.reasons.join("; "), pattern);
  };
  const fileCase = (name, path, bytes, expected, pattern) =>
    check(name, () => {
      const file = join(f.orderRoot, path);
      const before = existsSync(file) ? readFileSync(file) : null;
      write(f.orderRoot, path, bytes);
      try {
        if (expected === "document") document();
        else complete(pattern);
      } finally {
        if (before === null) rmSync(file);
        else writeFileSync(file, before);
      }
    });

  check("plain target gate and launchpad document gate", () => {
    const selected = scope();
    assert.equal(selected.target.selection, "plain");
    assert.deepEqual(closeoutCommands(f.orderRoot, selected), [
      "node scripts/target-gate.mjs WO-999",
      "npm run test:docs",
    ]);
  });
  fileCase(
    "nondefault product document root",
    "records/product/independent.md",
    "# Notes\n",
    "document",
  );
  fileCase(
    "own evidence program remains a record",
    "records/evidence/WO-999/reproduction.mjs",
    "export {};\n",
    "document",
  );
  fileCase(
    "gate budget record is machinery",
    "records/state/budgets.json",
    "{}\n",
    "complete",
    /record|machinery/,
  );
  fileCase(
    "edition selection is machinery",
    "records/evidence/current.json",
    "{}\n",
    "complete",
    /machinery/,
  );
  fileCase(
    "minted evidence is machinery",
    "records/evidence/WO-998/authority/001/authority.ref.json",
    "{}\n",
    "complete",
    /machinery/,
  );
  fileCase(
    "another order's program is unclassifiable",
    "records/evidence/WO-998/probe.mjs",
    "export {};\n",
    "complete",
    /unclassifiable/,
  );
  fileCase(
    "non-document under product root is unclassifiable",
    "records/product/input.mjs",
    "export {};\n",
    "complete",
    /unclassifiable/,
  );
  fileCase(
    "root Markdown is a document",
    "INDEPENDENT.md",
    "# Notes\n",
    "document",
  );
  fileCase(
    "unknown root text file is conservative",
    "independent.txt",
    "notes\n",
    "complete",
    /unclassifiable/,
  );
  fileCase(
    "untracked machinery is not hidden",
    "scripts/lib/independent-new.mjs",
    "export {};\n",
    "complete",
    /machinery/,
  );

  check("staged deletion of tracked machinery", () => {
    const relative = "scripts/lib/independent-source.mjs";
    const file = join(f.orderRoot, relative);
    const before = readFileSync(file);
    rmSync(file);
    git(f.orderRoot, "add", "--", relative);
    complete(/machinery/);
    writeFileSync(file, before);
    git(f.orderRoot, "add", "--", relative);
    document();
  });
  check("rename cannot disguise a deleted machinery source", () => {
    const source = join(f.orderRoot, "scripts/lib/independent-source.mjs");
    const destination = join(f.orderRoot, "records/product/disguised.md");
    renameSync(source, destination);
    complete(/machinery/);
    renameSync(destination, source);
    document();
  });
  check("named complete criterion overrides document-only paths", () => {
    write(
      f.orderRoot,
      f.order,
      orderText(false, "3. `npm test -- --review` is green.\n"),
    );
    complete(/criterion 3 names npm test/);
    assert.equal(scope().target.selection, "review");
    write(f.orderRoot, f.order, orderText());
  });
  check("missing order retains qualified target and launchpad commands", () => {
    const file = join(f.orderRoot, f.order);
    const before = readFileSync(file);
    rmSync(file);
    complete(/order cannot be read/);
    const commands = closeoutCommands(f.orderRoot, scope(), {
      qualified: true,
    });
    assert.equal(commands.length, 3);
    assert.ok(commands[0].includes("target-gate.mjs"));
    assert.ok(commands[1].includes("--review"));
    assert.ok(commands[2].includes("--document"));
    assert.ok(commands.every((command) => !command.startsWith("npm ")));
    writeFileSync(file, before);
  });
  check("malformed local registration is conservative", () => {
    const file = targetRegistryPath(f.orderRoot);
    const before = readFileSync(file);
    writeFileSync(file, "{not-json\n");
    complete(/registration cannot be read/);
    assert.equal(scope().target.commands, null);
    writeFileSync(file, before);
  });
  check(
    "foreign and pending integration receipts retain the complete run",
    () => {
      const upstream = git(f.orderRoot, "rev-parse", "HEAD");
      for (const receipt of [
        { workOrder: "WO-998", complete: true, upstream },
        { workOrder: "WO-999", complete: false, upstream: "unreadable" },
      ]) {
        const selected = scope({ receipt });
        assert.equal(selected.launchpad, "complete");
        assert.match(
          selected.reasons.join("; "),
          /integration receipt cannot be read/,
        );
      }
    },
  );
  check(
    "missing, erroneous and empty suite declarations are conservative",
    () => {
      for (const badRunner of [
        undefined,
        {},
        { error: "probe import failure" },
        { suites: [] },
      ]) {
        const selected = scope({ runner: badRunner });
        assert.equal(selected.launchpad, "complete");
        assert.match(selected.reasons.join("; "), /suite declarations/);
      }
    },
  );
  check("selection supplies no passing gate row", () => {
    const file = docPath(f.orderRoot, "control", "local/harness/checks.json");
    const before = existsSync(file) ? readFileSync(file) : null;
    scope();
    assert.deepEqual(existsSync(file) ? readFileSync(file) : null, before);
  });
});

const state = readControl(root).orders.get("WO-243").state;
const evidence = await requireGateClaims(
  root,
  {
    checked: true,
    claims: { document: [], review: ["5"], plain: [] },
  },
  { state },
);
const identity = gateCodeIdentity(root);
const complete = readGateChecks(root).findLast(
  (row) => row.evidenceRef === evidence.productGate?.evidenceRef,
);
assert.ok(complete, "the handoff's standing complete row is readable");
assert.equal(complete.codeIdentity, identity);
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      workOrder: "WO-243",
      recordedAt: new Date().toISOString(),
      checks,
      currentCodeIdentity: identity,
      consumedProductEvidence: evidence,
      completeRow: complete
        ? {
            checkId: complete.checkId,
            command: complete.command,
            codeIdentity: complete.codeIdentity,
            recordedAt: complete.recordedAt,
            exitCode: complete.exitCode,
            selection: complete.selection,
            requiredSuites: complete.requiredSuites,
          }
        : null,
    },
    null,
    2,
  ),
);
