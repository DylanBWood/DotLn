import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT, docPath } from "./lib/config.mjs";
import { write } from "./lib/helpers.mjs";
import { checkTargetHarness } from "./lib/harness.mjs";
import {
  cloneMapPath,
  orderHostRules,
  readTargetStart,
  reviewedTargetSubject,
  staleOrderHostRules,
  targetRegistryPath,
} from "./lib/target-worktrees.mjs";
import { readControl } from "./lib/control-store.mjs";
import {
  gateTreeHash,
  readGateChecks,
  checksPath,
} from "./lib/gate-evidence.mjs";
import {
  git,
  actor,
  actorArgs,
  profile,
  fixture,
  withFixture,
  prepareFinalReview,
  closeOrder,
  publicationSetup,
  launchpadCommands,
} from "./lib/target-worktree-fixture.mjs";

test("target gate runs selected commands with failures, deadlines and tree mutation evidence", () =>
  withFixture((f) => {
    f.config.repositories.target.gate = {
      commands: {
        pass: {
          argv: [process.execPath, "-e", "console.log('synthetic output')"],
          timeoutMs: 5000,
        },
        fail: {
          argv: [
            process.execPath,
            "-e",
            "console.error('synthetic failure'); process.exit(2)",
          ],
          timeoutMs: 5000,
        },
        slow: {
          argv: [process.execPath, "-e", "setTimeout(() => {}, 10000)"],
          timeoutMs: 150,
        },
        untracked: {
          argv: [
            process.execPath,
            "-e",
            "require('node:fs').writeFileSync('new.txt', 'changed')",
          ],
          timeoutMs: 5000,
        },
        mutate: {
          argv: [
            process.execPath,
            "-e",
            "require('node:fs').writeFileSync('source.txt', 'changed')",
          ],
          timeoutMs: 5000,
        },
        after: {
          argv: [process.execPath, "-e", "process.exit(0)"],
          timeoutMs: 5000,
        },
        restore: {
          argv: [
            process.execPath,
            "-e",
            "const fs=require('node:fs'); fs.writeFileSync('source.txt', 'declared base\\n'); fs.unlinkSync('new.txt')",
          ],
          timeoutMs: 5000,
        },
        "move-head": {
          argv: [
            "git",
            "commit",
            "--allow-empty",
            "-qm",
            "test: gate mutation",
          ],
          timeoutMs: 5000,
        },
        "last-pass": {
          argv: [process.execPath, "-e", "process.exit(0)"],
          timeoutMs: 5000,
        },
      },
      plain: ["pass"],
      review: [
        "pass",
        "fail",
        "slow",
        "untracked",
        "mutate",
        "after",
        "restore",
        "move-head",
        "last-pass",
      ],
    };
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: declare gates");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    const treeHash = gateTreeHash(f.target);
    f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999"]));
    const plain = readGateChecks(f.orderRoot)
      .filter((row) => row.checkId === "target:target")
      .at(-1);
    assert.deepEqual(plain.names, ["pass"]);
    assert.equal(plain.treeHash, treeHash);
    assert.equal(plain.exitCode, 0);
    const result = f.call(f.orderRoot, f.orderRoot, "target-gate", [
      "WO-999",
      "--review",
    ]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL target target fail/u);
    const failingOutput = result.stdout.match(
      /FAIL target target fail[^\n]*; output: ([^\n]+)/u,
    )?.[1];
    assert.ok(failingOutput, result.stdout);
    assert.match(readFileSync(failingOutput, "utf8"), /synthetic failure/u);
    assert.match(result.stdout, /FAIL target target slow/u);
    assert.match(result.stdout, /untracked .*changed target bytes/u);
    assert.match(result.stdout, /mutate .*changed target bytes/u);
    assert.match(result.stdout, /PASS target target after/u);
    assert.match(result.stdout, /restore .*changed target bytes/u);
    assert.match(result.stdout, /move-head .*changed target bytes or HEAD/u);
    assert.match(result.stdout, /PASS target target last-pass/u);
    const rows = readGateChecks(f.orderRoot);
    const after = rows.find((row) => row.checkId === "target:target:after");
    const last = rows.find((row) => row.checkId === "target:target:last-pass");
    assert.equal(after.exitCode, 0);
    assert.notEqual(after.treeHash, treeHash);
    assert.equal(last.exitCode, 0);
    assert.equal(last.treeHash, treeHash);
    assert.equal(last.commit, git(f.target, "rev-parse", "HEAD"));
    assert.notEqual(last.commit, after.commit);
    assert.equal(
      rows.filter((row) => row.checkId === "target:target").at(-1).exitCode,
      1,
    );
    assert.equal(
      rows.filter((row) => row.checkId.startsWith("target:target:")).length,
      10,
    );
    const output = rows.find((row) => row.outputRef).outputRef;
    assert.match(
      readFileSync(join(f.orderRoot, output), "utf8"),
      /synthetic output/u,
    );
    assert.equal(git(f.orderRoot, "check-ignore", output), output);
    const recorded = readFileSync(checksPath(f.orderRoot));
    delete f.config.repositories.target.gate;
    write(f.orderRoot, "dotln.config.json", JSON.stringify(f.config));
    const missing = f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999"]);
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /gate is missing/u);
    assert.deepEqual(readFileSync(checksPath(f.orderRoot)), recorded);
  }));

const printedCommands = [
  "scripts/resume.mjs target-records",
  "scripts/worktree.mjs publish",
  "scripts/worktree.mjs publish",
];
const documentGate = "scripts/test-runner.mjs --document";
const names = (commands) => commands.map(({ command }) => command);

test("target briefings name a missing repository throughout dispatch and print launchpad commands that resolve from the target worktree", () => {
  withFixture((f) => {
    write(
      f.main,
      f.order,
      `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n\n**Acceptance criteria (all required)**\n\n1. Prose only.\n`,
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Order with one criterion");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    const configFile = join(f.orderRoot, "dotln.config.json");
    const restore = () => writeFileSync(configFile, JSON.stringify(f.config));
    const missing = (args, phase) => {
      writeFileSync(
        configFile,
        JSON.stringify({
          ...f.config,
          repositories: { other: f.config.repositories.target },
        }),
      );
      const output = f.ok(f.resume(args, {}, f.orderRoot));
      assert.match(output, /repositories\.target.*not registered/u);
      assert.doesNotMatch(output, /Cannot read properties|TypeError/u);
      assert.equal(
        JSON.parse(f.ok(f.resume(["status", "--json"], {}, f.orderRoot))).phase,
        phase,
      );
      assert.match(
        f.ok(f.resume(["briefing"], {}, f.orderRoot)),
        /repositories\.target.*not registered/u,
      );
      restore();
    };
    missing(["next"], "active");
    f.ok(
      f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]),
    );
    // With the Follow-up Queue equipped through the repair, each briefing's
    // queue command is in the same form and reaches the launchpad's own queue:
    // a request at a stale revision is refused against its revision 0.
    const manifest = join(f.orderRoot, ".claude/harness-manifest.json");
    const queueScript = join(f.orderRoot, "scripts/adjacent-work.mjs");
    assert.ok(!existsSync(manifest) && !existsSync(queueScript));
    write(
      f.orderRoot,
      ".claude/harness-manifest.json",
      JSON.stringify({ origin: { ids: ["follow-up-queue"] } }),
    );
    cpSync(join(TOOL_ROOT, "scripts/adjacent-work.mjs"), queueScript);
    writeFileSync(
      join(f.base, "queue-request.json"),
      JSON.stringify({ expectedRevision: 5, actor: "executor", action: {} }),
    );
    const queueRefuses = (command) => {
      const result = command.run();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /stale queue revision/u);
    };
    // The executor records the order's one criterion unmet.
    write(
      f.orderRoot,
      "records/evidence/WO-999/handoff.md",
      "**Criterion 1:** unmet. Not run in the fixture.\n\nself-review: found 0; fixed 0; recorded 0\n",
    );
    const execution = launchpadCommands(f, f.ok(f.resume(["briefing"])));
    assert.deepEqual(names(execution), [
      "scripts/resume.mjs implementation-ready",
      "scripts/adjacent-work.mjs apply",
      documentGate,
    ]);
    queueRefuses(execution[1]);
    // The completion the execution briefing prints records from the target
    // worktree as printed.
    f.ok(execution[0].run());
    missing(["verify"], "verifying");
    // The routes past the unmet criterion run from the target worktree as
    // printed and answer from the launchpad's own scripts.
    const verification = launchpadCommands(f, f.ok(f.resume(["briefing"])));
    assert.deepEqual(names(verification), [
      "scripts/resume.mjs waive",
      "scripts/refute-plan.mjs amend-order",
      documentGate,
    ]);
    const waive = verification[0].run();
    assert.notEqual(waive.status, 0);
    assert.match(
      waive.stderr,
      /waive requires --capture <path> naming an ignored capture under records\/intake\//u,
    );
    const amend = verification[1].run();
    assert.notEqual(amend.status, 0);
    assert.match(amend.stderr, /usage: plan amend-order <WO-NNN>/u);
    const report = `# Fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`;
    write(f.orderRoot, "records/verifications/WO-999/VER-001.md", report);
    f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
    missing(["final-review"], "final-review");
    const briefing = f.ok(f.resume(["briefing"]));
    assert.ok(
      existsSync(
        /Target gate claims stand on node '([^']*)' WO-999 --review;/u.exec(
          briefing,
        )[1],
      ),
    );
    assert.match(
      briefing,
      /the instance document gate, which a criterion names as npm run test:docs, runs as DOTLN_LAUNCHPAD=/u,
    );
    const printed = launchpadCommands(f, briefing);
    assert.deepEqual(names(printed), [
      "scripts/resume.mjs waive",
      "scripts/refute-plan.mjs amend-order",
      documentGate,
      ...printedCommands,
    ]);
    const [, , gate, records, ...publications] = printed;
    // Run from the target worktree, each reaches the launchpad's own script:
    // the document gate reports what it reports from the launchpad itself,
    // the records action refuses the phase, and both publications refuse the
    // order worktree's uncommitted records.
    const timings = (result) =>
      `${result.status}\n${result.stdout}`
        .replace(/[0-9]+\.[0-9]+ s/gu, "<t>")
        .replace(/(dotln-[a-z-]+-)[A-Za-z0-9]{6}\b/gu, "$1<tmp>");
    assert.equal(
      timings(gate.run()),
      timings(
        spawnSync(process.execPath, ["scripts/test-runner.mjs", "--document"], {
          cwd: f.orderRoot,
          env: f.env,
          encoding: "utf8",
        }),
      ),
    );
    const recordsRun = records.run();
    assert.notEqual(recordsRun.status, 0);
    assert.match(
      recordsRun.stderr,
      /cannot perform action in phase final-review/u,
    );
    for (const publication of publications) {
      const result = publication.run();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /working tree is not clean/u);
    }
    // A refusal's hint prints the legal command in the same form.
    const hint = f.resume(["verify"]);
    assert.notEqual(hint.status, 0);
    assert.match(
      hint.stderr,
      /cannot perform action in phase final-review; run: DOTLN_LAUNCHPAD='[^']*' node '[^']*\/scripts\/resume\.mjs' final-review-result pass\|fail /u,
    );
    assert.doesNotMatch(hint.stderr, /npm run resume --/u);
    write(f.orderRoot, "records/final-reviews/WO-999/FINAL-001.md", report);
    f.ok(f.resume(["final-review-result", "fail", ...actorArgs]));
    missing(["fix"], "repairing");
    const repair = launchpadCommands(f, f.ok(f.resume(["briefing"])));
    assert.deepEqual(names(repair), [
      "scripts/adjacent-work.mjs apply",
      documentGate,
    ]);
    queueRefuses(repair[0]);
    rmSync(join(f.orderRoot, ".claude"), { recursive: true });
    rmSync(queueScript);
  });
  // A self order prints no target sentence and no launchpad-qualified command.
  withFixture((f) => {
    write(
      f.main,
      f.order,
      "# WO-999 — self fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Self order fixture");
    git(f.main, "push", "-q", "origin", "main");
    f.start();
    const briefing = f.ok(f.resume(["briefing"], {}, f.orderRoot));
    assert.match(
      briefing,
      /^Execute records\/work-orders\/WO-999-fixture\.md\./u,
    );
    assert.doesNotMatch(
      briefing,
      /Repo-native|target-gate|target-records|DOTLN_LAUNCHPAD|--target-worktree/u,
    );
  });
});

test("WO-210 target final review binds clean commits through both launchpad routes and refuses without recording", () => {
  for (const explicit of [false, true])
    withFixture((f) => {
      f.mapClone();
      f.start();
      const routed = {
        ...f,
        resume: (args, override = {}, cwd = f.target) =>
          f.resume(
            args,
            {
              ...override,
              ...(explicit ? { DOTLN_LAUNCHPAD: f.orderRoot } : {}),
            },
            cwd,
            explicit ? f.main : f.orderRoot,
          ),
      };
      write(f.target, "reviewed.txt", "Reviewed target change.\n");
      git(f.target, "add", "reviewed.txt");
      git(f.target, "commit", "-qm", "fix: preserve reviewed source");
      const commit = git(f.target, "rev-parse", "HEAD");
      prepareFinalReview(routed);
      const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
      const before = readFileSync(segment);
      const refuse = (pattern, cwd = f.target) => {
        const result = routed.resume(
          ["final-review-result", "pass", ...actorArgs],
          {},
          cwd,
        );
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, pattern);
        assert.deepEqual(readFileSync(segment), before);
      };
      const original = readFileSync(join(f.target, "source.txt"));
      write(f.target, "source.txt", "Uncommitted edit.\n");
      refuse(/tracked changes/u);
      writeFileSync(join(f.target, "source.txt"), original);
      write(f.target, "untracked.txt", "Not reviewed.\n");
      refuse(/untracked files/u);
      rmSync(join(f.target, "untracked.txt"));
      // A staged rename is one entry naming its old and new path; beside a
      // modified file it is listed under tracked changes, and the untracked
      // file under its own heading, each named plainly with no status prefix.
      mkdirSync(join(f.target, "moved notes"));
      git(f.target, "mv", "source.txt", "moved notes/renamed source.txt");
      write(f.target, "reviewed.txt", "Edited after the review.\n");
      write(f.target, "draft notes.txt", "Not reviewed.\n");
      refuse(
        /target has tracked changes: source\.txt -> moved notes\/renamed source\.txt, reviewed\.txt; non-ignored untracked files: draft notes\.txt; commit the reviewed target change/u,
      );
      git(f.target, "mv", "moved notes/renamed source.txt", "source.txt");
      git(f.target, "checkout", "--", "reviewed.txt");
      rmSync(join(f.target, "draft notes.txt"));
      // A pending record path admits only its own plain entry, never a rename
      // onto it, even one whose original path ends in that pending path.
      git(f.target, "mv", "reviewed.txt", "iewed.txt");
      assert.throws(
        () =>
          reviewedTargetSubject(
            f.orderRoot,
            readControl(f.orderRoot).orders.get("WO-999").state,
            { pendingRecordPaths: ["iewed.txt"] },
          ),
        /target has tracked changes: reviewed\.txt -> iewed\.txt;/u,
      );
      git(f.target, "mv", "iewed.txt", "reviewed.txt");
      git(f.target, "switch", "-qc", "other-review-branch");
      refuse(/branch differs/u);
      git(f.target, "switch", "-q", "wo-999");
      const registry = targetRegistryPath(f.orderRoot);
      renameSync(registry, `${registry}.saved`);
      refuse(/registry entry is missing/u, f.orderRoot);
      renameSync(`${registry}.saved`, registry);
      const configPath = join(f.orderRoot, "dotln.config.json");
      const configBytes = readFileSync(configPath);
      const missingGate = JSON.parse(configBytes);
      delete missingGate.repositories.target.gate;
      writeFileSync(configPath, JSON.stringify(missingGate));
      refuse(/gate is missing/u);
      writeFileSync(configPath, configBytes);
      const gateFile = checksPath(f.orderRoot);
      const savedRows = readFileSync(gateFile);
      writeFileSync(gateFile, "[]\n");
      refuse(/review target gate is missing/u);
      const row = JSON.parse(savedRows)
        .filter((row) => row.checkId === "target:target")
        .at(-1);
      writeFileSync(
        gateFile,
        JSON.stringify([{ ...row, treeHash: "f".repeat(40) }]),
      );
      refuse(/review target gate is stale/u);
      writeFileSync(
        gateFile,
        JSON.stringify([
          row,
          {
            ...row,
            exitCode: 1,
            evidenceRef: "fixture:failed",
            recordedAt: new Date(Date.now() + 1000).toISOString(),
          },
        ]),
      );
      refuse(/review target gate is failed/u);
      // A truncated index refuses in one line naming it and the rerun.
      writeFileSync(gateFile, '[{"checkId":"target:');
      refuse(
        /^error: target review target gate index cannot be read: docs\/control\/local\/harness\/checks\.json [^\n]*target-gate\.mjs' WO-999 --review$/mu,
      );
      writeFileSync(gateFile, savedRows);
      const output = routed.ok(
        routed.resume(["final-review-result", "pass", ...actorArgs]),
      );
      assert.match(output, /committed before this result/u);
      assert.deepEqual(
        launchpadCommands(f, output).map(({ command }) => command),
        printedCommands,
      );
      assert.match(output, /target-records <actor flags>, then commit/u);
      assert.match(output, /publish WO-999 --target-worktree --branch/u);
      // The closed order's hint qualifies what the session runs from its
      // worktree and keeps the main-checkout commands in npm form, saying so.
      const hint = routed.resume(["verify"]);
      assert.notEqual(hint.status, 0);
      assert.match(
        hint.stderr,
        /cannot perform action in phase closed; run: DOTLN_LAUNCHPAD='[^']*' node '[^']*\/scripts\/resume\.mjs' target-records --harness .*? --work-order WO-999 or npm run release -- close WO-NNN --publish \(in the main checkout\) or DOTLN_LAUNCHPAD='[^']*' node '[^']*\/scripts\/resume\.mjs' next --work-order WO-999 or npm run worktree -- start WO-NNN docs\/work-orders\/WO-NNN-name\.md \(in the main checkout\)$/mu,
      );
      assert.doesNotMatch(hint.stderr, /worktree\.mjs' start|release\.mjs/u);
      const event = readFileSync(segment, "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse)
        .filter((row) => row.type === "FinalReviewCompleted")
        .at(-1);
      assert.deepEqual(event.targetSubject, {
        repositoryId: "target",
        branch: "wo-999",
        baseCommit: f.baseCommit,
        commit,
      });
      assert.ok(!JSON.stringify(event.targetSubject).includes(f.base));
      assert.deepEqual(Object.keys(event.targetGate).sort(), [
        "commit",
        "durationMs",
        "evidenceRef",
        "names",
        "recordedAt",
        "repositoryId",
        "selection",
        "treeHash",
      ]);
      assert.equal(event.targetGate.commit, commit);
      assert.equal(event.targetGate.selection, "review");
    });
});

test("WO-210 a failed target final review records no target subject", () =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    prepareFinalReview(f);
    write(
      f.target,
      "untracked.txt",
      "Failing review retains uncommitted work.\n",
    );
    f.ok(f.resume(["final-review-result", "fail", ...actorArgs]));
    const event = readFileSync(
      docPath(f.orderRoot, "orders", "WO-999.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(JSON.parse)
      .filter((row) => row.type === "FinalReviewCompleted")
      .at(-1);
    assert.equal(Object.hasOwn(event, "targetSubject"), false);
  }));

const launchpadSpellings = (f, t) => {
  const alias = join(f.base, "launchpad-alias");
  const chained = join(f.base, "launchpad-alias-chain");
  symlinkSync(f.orderRoot, alias);
  symlinkSync(alias, chained);
  const spellings = [f.orderRoot, alias, chained];
  const sameDirectory = (candidate) => {
    if (!existsSync(candidate)) return false;
    const expected = statSync(f.orderRoot);
    const actual = statSync(candidate);
    return expected.dev === actual.dev && expected.ino === actual.ino;
  };
  const caseVariant = join(f.base, "LAUNCHPAD-WO999");
  if (sameDirectory(caseVariant)) {
    spellings.push(caseVariant);
    t.diagnostic(
      "launchpad case variants exercised: volume is case-insensitive",
    );
  } else
    t.diagnostic("skipped launchpad case variants: volume is case-sensitive");
  const volumeAlias = join("/System/Volumes/Data", f.orderRoot);
  if (sameDirectory(volumeAlias)) {
    spellings.push(volumeAlias);
    t.diagnostic("launchpad volume alias exercised");
  } else
    t.diagnostic("skipped launchpad volume alias: unavailable on this host");
  return spellings;
};

test("launchpad spellings preserve self and registered-target selection and report ownership", (t) =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    const spellings = launchpadSpellings(f, t);
    const launchpadChild = join(f.orderRoot, "subdirectory");
    const targetChild = join(f.target, "subdirectory");
    mkdirSync(launchpadChild);
    mkdirSync(targetChild);
    const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
    const before = readFileSync(segment, "utf8");
    for (const spelling of spellings)
      for (const cwd of [f.orderRoot, launchpadChild, f.target, targetChild])
        for (const explicit of [false, true]) {
          const result = f.resume(
            ["status", "--json"],
            explicit ? { DOTLN_LAUNCHPAD: spelling } : {},
            cwd,
            explicit ? f.main : spelling,
          );
          assert.equal(JSON.parse(f.ok(result)).workOrder, "WO-999");
        }
    assert.equal(readFileSync(segment, "utf8"), before);
    const override = { DOTLN_LAUNCHPAD: spellings[2] };
    assert.match(
      f.ok(f.resume(["next"], override)),
      /Execute records\/work-orders\/WO-999/,
    );
    const reports = closeOrder(f, override);
    for (const file of Object.values(reports)) assert.ok(existsSync(file));
    assert.equal(existsSync(join(f.target, "records")), false);
    assert.equal(existsSync(docPath(f.main, "orders", "WO-999.jsonl")), false);
    assert.equal(git(f.target, "status", "--porcelain"), "");
  }));

test("self-order launchpad spellings select the branch with repository declarations or only a registry", (t) =>
  withFixture((f) => {
    write(
      f.main,
      f.order,
      "# WO-999 — self fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Self order fixture");
    git(f.main, "push", "-q", "origin", "main");
    f.start();
    const spellings = launchpadSpellings(f, t);
    const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
    const before = readFileSync(segment, "utf8");
    for (const registryOnly of [false, true]) {
      if (registryOnly) {
        delete f.config.repositories;
        write(f.orderRoot, "dotln.config.json", JSON.stringify(f.config));
        write(f.orderRoot, "records/state/local/target-worktrees.json", "{}\n");
      }
      for (const spelling of spellings)
        for (const explicit of [false, true])
          assert.equal(
            JSON.parse(
              f.ok(
                f.resume(
                  ["status", "--json"],
                  explicit ? { DOTLN_LAUNCHPAD: spelling } : {},
                  f.orderRoot,
                  explicit ? f.main : spelling,
                ),
              ),
            ).workOrder,
            "WO-999",
          );
    }
    assert.equal(readFileSync(segment, "utf8"), before);
  }));

test("WO-072 criterion 1: declared target base, governed ignored bundle and conventional commits", () =>
  withFixture((f) => {
    f.mapClone();
    const output = f.start();
    assert.match(output, /Authority profile:/);
    assert.ok(output.includes(JSON.stringify(profile)));
    assert.equal(git(f.target, "rev-parse", "HEAD"), f.baseCommit);
    assert.equal(existsSync(join(f.target, "later.txt")), false);
    assert.equal(
      checkTargetHarness(f.target, { runtimeRoot: f.main }).files,
      7,
    );
    assert.equal(git(f.target, "status", "--porcelain"), "");
    for (const [file, args] of [
      ["first.txt", ["add", "first.txt"]],
      ["second.txt", ["add", "-A"]],
    ]) {
      write(f.target, file, "target code\n");
      git(f.target, ...args);
      git(f.target, "commit", "-qm", "test: target source change");
      assert.doesNotMatch(
        git(f.target, "ls-tree", "-r", "--name-only", "HEAD"),
        /(?:CLAUDE|AGENTS|\.claude|\.codex|\.dotln|docs\/|records\/)/,
      );
      assert.equal(git(f.target, "status", "--porcelain"), "");
    }
    const segment = readFileSync(
      docPath(f.orderRoot, "orders", "WO-999.jsonl"),
      "utf8",
    );
    assert.ok(!segment.includes(f.base), "local paths never enter control");
  }));

test("WO-072 criterion 2: both launchpad routes select target order and keep reports in the launchpad", () => {
  for (const explicit of [false, true])
    withFixture((f) => {
      f.mapClone();
      f.start();
      const override = explicit ? { DOTLN_LAUNCHPAD: f.orderRoot } : {};
      const route = (args, cwd = f.target) =>
        f.resume(args, override, cwd, explicit ? f.main : f.orderRoot);
      assert.equal(
        JSON.parse(f.ok(route(["status", "--json"]))).workOrder,
        "WO-999",
      );
      assert.match(
        f.ok(route(["next"])),
        /Execute records\/work-orders\/WO-999/,
      );
      const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
      const before = readFileSync(segment, "utf8");
      for (const action of ["status", "next", "verify", "final-review"]) {
        assert.match(
          f.ok(route([action], f.clone)),
          /not a registered target worktree; no order selected/,
        );
        assert.match(
          f.ok(route([action], f.base)),
          /not a registered target worktree; no order selected/,
        );
      }
      for (const cwd of [f.clone, f.base]) {
        const result = route(["status", "--json"], cwd);
        assert.equal(result.status, 1);
        assert.equal(result.stdout, "");
        assert.match(
          result.stderr,
          /not a registered target worktree; no order selected/,
        );
      }
      assert.equal(readFileSync(segment, "utf8"), before);
      git(f.target, "switch", "-q", "-c", "wrong-branch");
      assert.match(route(["status"]).stderr, /branch differs/);
      git(f.target, "switch", "-q", "wo-999");
      const reports = closeOrder(f, override);
      for (const file of Object.values(reports)) assert.ok(existsSync(file));
      const events = readFileSync(segment, "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse);
      assert.ok(
        events.some(
          (event) =>
            event.type === "VerificationRequested" &&
            event.reportPath === "records/verifications/WO-999/VER-001.md",
        ),
      );
      assert.ok(
        events.some(
          (event) =>
            event.type === "FinalReviewRequested" &&
            event.reportPath === "records/final-reviews/WO-999/FINAL-001.md",
        ),
      );
      assert.equal(
        existsSync(docPath(f.main, "orders", "WO-999.jsonl")),
        false,
      );
      assert.equal(existsSync(join(f.target, "records")), false);
      assert.equal(git(f.target, "status", "--porcelain"), "");
    });
});

test("WO-072 criterion 3: unreadable start inputs refuse without worktree, branch or registry residue", (t) =>
  withFixture((f) => {
    const refuse = (pattern) => {
      const result = f.worktree("start", "WO-999", f.order);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, pattern);
      for (const repo of [f.main, f.clone])
        assert.equal(git(repo, "branch", "--list", "wo-999"), "");
      assert.equal(existsSync(f.target), false);
      assert.equal(existsSync(f.orderRoot), false);
      assert.equal(existsSync(targetRegistryPath(f.main)), false);
    };
    refuse(/repository target: no local clone recorded/);
    f.mapClone();
    const child = join(f.clone, "subdirectory");
    mkdirSync(child);
    writeFileSync(cloneMapPath(f.main), JSON.stringify({ target: child }));
    refuse(/repository target: not a Git top level/);
    f.mapClone();
    const probe = join(f.parent, "Probe");
    writeFileSync(probe, "case probe");
    let insensitive = false;
    try {
      insensitive =
        statSync(probe).ino === statSync(join(f.parent, "probe")).ino;
    } catch {}
    t.diagnostic(
      `fixture volume is ${insensitive ? "case-insensitive" : "case-sensitive"}`,
    );
    if (insensitive) {
      f.config.repositories.target.worktreeParent = "../targets";
      writeFileSync(
        join(f.main, "dotln.config.json"),
        JSON.stringify(f.config),
      );
      git(f.main, "add", "dotln.config.json");
      git(f.main, "commit", "-qm", "Variant parent fixture");
      git(f.main, "push", "-q", "origin", "main");
      refuse(/repository target: spelling differs from filesystem identity/);
    } else
      t.diagnostic("skipped variant-case parent: volume is case-sensitive");
  }));

test("host-rule rewrite requires a committed opt-in and preserves operator rules through repair and removal", () =>
  withFixture((f) => {
    publicationSetup(f);
    f.mapClone();
    f.start();
    const settings = join(f.main, ".claude/settings.local.json");
    const codex = join(f.main, ".codex/rules/dotln-WO-999.rules");
    const sidecar = docPath(f.main, "control", "local/host-rules/WO-999.json");
    const rewrite = () => f.worktree("host-rules", "--rewrite", "WO-999");
    const optedOut = rewrite();
    assert.notEqual(optedOut.status, 0);
    assert.match(optedOut.stderr, /has not opted into hostRules literal/u);
    for (const file of [settings, codex, sidecar])
      assert.equal(existsSync(file), false);

    f.config.repositories.target.hostRules = "literal";
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    const uncommitted = rewrite();
    assert.notEqual(uncommitted.status, 0);
    assert.match(
      uncommitted.stderr,
      /requires main's committed dotln\.config\.json/u,
    );
    for (const file of [settings, codex, sidecar])
      assert.equal(existsSync(file), false);
    git(f.main, "add", "dotln.config.json");
    git(f.main, "commit", "-qm", "test: opt into host-rule recovery");

    const operatorRules = [
      "Bash(npm test)",
      "Bash(gh pr view --repo github.com/dotln-fixture/target *)",
    ];
    write(
      f.main,
      ".claude/settings.local.json",
      JSON.stringify({ permissions: { allow: operatorRules } }),
    );
    f.ok(rewrite());
    assert.deepEqual(staleOrderHostRules(f.main), []);
    const owned = JSON.parse(readFileSync(sidecar, "utf8"));
    assert.ok(owned.claude.every((rule) => !operatorRules.includes(rule)));
    const originalSidecar = readFileSync(sidecar, "utf8");
    for (const invalid of [
      "{malformed\n",
      JSON.stringify({ ...owned, codex: "../outside.rules" }),
    ]) {
      const before = [settings, codex].map((file) => readFileSync(file));
      writeFileSync(sidecar, invalid);
      assert.throws(
        () => staleOrderHostRules(f.main),
        /repair the host-rule record/,
      );
      const refused = f.worktree("host-rules", "--remove", "WO-999");
      assert.notEqual(refused.status, 0);
      assert.match(refused.stderr, /repair the host-rule record/);
      assert.deepEqual(
        [settings, codex].map((file) => readFileSync(file)),
        before,
      );
    }
    writeFileSync(sidecar, originalSidecar);
    const originalOrigin = git(f.clone, "config", "--get", "remote.origin.url");
    git(
      f.clone,
      "remote",
      "set-url",
      "origin",
      "https://github.com/dotln-fixture/another.git",
    );
    const reboundOrigin = rewrite();
    assert.notEqual(reboundOrigin.status, 0);
    assert.match(
      reboundOrigin.stderr,
      /origin differs from the origin recorded/,
    );
    assert.equal(readFileSync(sidecar, "utf8"), originalSidecar);
    git(f.clone, "remote", "set-url", "origin", originalOrigin);
    const ownedCodex = readFileSync(codex, "utf8");
    writeFileSync(codex, ownedCodex + "# hand edit\n");
    assert.equal(staleOrderHostRules(f.main).length, 1);
    assert.notEqual(rewrite().status, 0);
    writeFileSync(codex, ownedCodex);
    const retired = "Bash(git -C fixture push *)";
    const legacy = JSON.parse(readFileSync(settings, "utf8"));
    legacy.permissions.allow.push(retired, retired);
    writeFileSync(settings, JSON.stringify(legacy));
    writeFileSync(
      sidecar,
      JSON.stringify({ ...owned, claude: [...owned.claude, retired] }),
    );
    f.ok(rewrite());
    assert.equal(
      JSON.parse(readFileSync(settings, "utf8")).permissions.allow.filter(
        (rule) => rule === retired,
      ).length,
      1,
    );
    // Remove the fixture's independent operator duplicate for the later ownership assertion.
    const migrated = JSON.parse(readFileSync(settings, "utf8"));
    migrated.permissions.allow = migrated.permissions.allow.filter(
      (rule) => rule !== retired,
    );
    writeFileSync(settings, JSON.stringify(migrated));

    const local = JSON.parse(readFileSync(settings, "utf8"));
    local.permissions.allow = local.permissions.allow.filter(
      (rule) => rule !== owned.claude[0],
    );
    writeFileSync(settings, JSON.stringify(local));
    assert.equal(staleOrderHostRules(f.main).length, 1);
    f.ok(rewrite());
    assert.deepEqual(staleOrderHostRules(f.main), []);

    for (const phase of ["before-settings", "after-settings"]) {
      const duplicate = JSON.parse(readFileSync(settings, "utf8"));
      duplicate.permissions.allow.push(...owned.claude);
      writeFileSync(settings, JSON.stringify(duplicate));
      const injection = join(f.base, `stop-rule-removal-${phase}.mjs`);
      writeFileSync(
        injection,
        `import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
const rename = fs.renameSync;
fs.renameSync = (from, to, ...args) => {
  if (to === ${JSON.stringify(settings)}) {
    if (${JSON.stringify(phase)} === "after-settings") rename(from, to, ...args);
    throw new Error("fixture interrupted host-rule removal");
  }
  return rename(from, to, ...args);
};
syncBuiltinESMExports();\n`,
      );
      const stopped = spawnSync(
        process.execPath,
        [
          "--import",
          injection,
          join(f.main, "scripts/worktree.mjs"),
          "host-rules",
          "--remove",
          "WO-999",
        ],
        { cwd: f.main, env: f.env, encoding: "utf8" },
      );
      assert.notEqual(stopped.status, 0);
      assert.match(stopped.stderr, /fixture interrupted host-rule removal/u);
      assert.ok(JSON.parse(readFileSync(sidecar, "utf8")).removal);
      assert.match(
        staleOrderHostRules(f.main)[0].reason,
        /removal is incomplete/u,
      );
      assert.match(rewrite().stderr, /removal is incomplete/u);
      const interruptedSettings = readFileSync(settings, "utf8");
      const intervened = JSON.parse(interruptedSettings);
      intervened.permissions.allow.push("Bash(operator-added-command)");
      writeFileSync(settings, JSON.stringify(intervened));
      const changed = f.worktree("host-rules", "--remove", "WO-999");
      assert.notEqual(changed.status, 0);
      assert.match(changed.stderr, /allow rules changed during removal/u);
      assert.deepEqual(JSON.parse(readFileSync(settings, "utf8")), intervened);
      assert.ok(existsSync(sidecar));
      assert.ok(existsSync(codex));
      writeFileSync(settings, interruptedSettings);
      f.ok(f.worktree("host-rules", "--remove", "WO-999"));
      assert.deepEqual(
        JSON.parse(readFileSync(settings, "utf8")).permissions.allow,
        [...operatorRules, ...owned.claude],
      );
      assert.equal(existsSync(codex), false);
      assert.equal(existsSync(sidecar), false);
      // Reset only this fixture's operator addition before the next scenario.
      writeFileSync(
        settings,
        JSON.stringify({ permissions: { allow: operatorRules } }),
      );
      f.ok(rewrite());
    }

    const before = [settings, codex, sidecar].map((file) =>
      readFileSync(file, "utf8"),
    );
    git(f.target, "switch", "-qc", "unexpected-target-branch");
    const rebound = rewrite();
    assert.notEqual(rebound.status, 0);
    assert.match(rebound.stderr, /target differs from its registration/u);
    assert.deepEqual(
      [settings, codex, sidecar].map((file) => readFileSync(file, "utf8")),
      before,
    );
    git(f.target, "switch", "-q", "wo-999");
    delete f.config.repositories.target.hostRules;
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "dotln.config.json");
    git(f.main, "commit", "-qm", "test: withdraw literal opt-in");
    assert.notEqual(rewrite().status, 0);
    assert.deepEqual(
      [settings, codex, sidecar].map((file) => readFileSync(file, "utf8")),
      before,
    );
    f.ok(f.worktree("host-rules", "--remove", "WO-999"));
    assert.deepEqual(
      JSON.parse(readFileSync(settings, "utf8")).permissions.allow,
      operatorRules,
    );
    assert.equal(existsSync(codex), false);
    assert.equal(existsSync(sidecar), false);
  }));

test("literal host rules keep main clean and preserve another in-flight order", () =>
  withFixture((f) => {
    publicationSetup(f);
    f.config.repositories.target.hostRules = "literal";
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    const secondOrder = "records/work-orders/WO-998-fixture.md";
    write(
      f.main,
      secondOrder,
      readFileSync(join(f.main, f.order), "utf8").replaceAll(
        "WO-999",
        "WO-998",
      ),
    );
    write(
      f.main,
      ".gitignore",
      readFileSync(join(f.main, ".gitignore"), "utf8") +
        "/.claude/settings.local.json\n",
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: prepare concurrent literal orders");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    const clean = () =>
      git(f.main, "status", "--porcelain", "--untracked-files=all");
    assert.equal(clean(), "", "the first order's owned rules leave main clean");
    f.ok(f.worktree("start", "WO-998", secondOrder));
    assert.equal(clean(), "");
    const settings = join(f.main, ".claude/settings.local.json");
    const rules = () =>
      JSON.parse(readFileSync(settings, "utf8")).permissions.allow;
    const secondEntry = Object.values(
      JSON.parse(readFileSync(targetRegistryPath(f.main), "utf8")),
    ).find((entry) => entry.workOrderId === "WO-998");
    const expectedSecond = orderHostRules(
      f.main,
      secondEntry,
      "github.com/dotln-fixture/target",
    ).claude;
    assert.equal(
      rules().filter((rule) => rule.includes("publish WO-999")).length,
      1,
    );
    assert.equal(
      rules().filter((rule) => rule.includes("publish WO-998")).length,
      1,
    );
    assert.ok(rules().every((rule) => !/^Bash\((?:git|gh|npm) /u.test(rule)));
    f.ok(f.worktree("host-rules", "--remove", "WO-999"));
    assert.equal(
      rules().some((rule) => rule.includes("publish WO-999")),
      false,
    );
    assert.equal(
      rules().filter((rule) => rule.includes("publish WO-998")).length,
      1,
    );
    assert.ok(existsSync(join(f.main, ".codex/rules/dotln-WO-998.rules")));
    assert.deepEqual(
      [...rules()].sort(),
      [...expectedSecond].sort(),
      "closing the first order preserves every rule needed by the second",
    );
    assert.equal(clean(), "");
    assert.deepEqual(staleOrderHostRules(f.main), []);
    f.ok(f.worktree("host-rules", "--remove", "WO-998"));
    assert.deepEqual(rules(), []);
    assert.equal(clean(), "");
  }));

test("umbrella start refuses before creating the launchpad or target worktree", () =>
  withFixture((f) => {
    f.mapClone();
    write(
      f.main,
      f.order,
      `# WO-999 — umbrella fixture\n\n**Umbrella record:** superseded whole.\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n\n<!-- dotln-dependencies:start -->\n[{"workOrderId":"WO-998","relation":"superseded","by":"WO-998","reason":"bounded successor"}]\n<!-- dotln-dependencies:end -->\n`,
    );
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Umbrella fixture");
    git(f.main, "push", "-q", "origin", "main");
    const result = f.worktree("start", "WO-999", f.order);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /umbrella record superseded by WO-998/);
    for (const repo of [f.main, f.clone])
      assert.equal(git(repo, "branch", "--list", "wo-999"), "");
    assert.equal(existsSync(f.target), false);
    assert.equal(existsSync(f.orderRoot), false);
    assert.equal(existsSync(targetRegistryPath(f.main)), false);
  }));

for (const cloneName of ["launchpad", "Launchpad"])
  test(`planned target and launchpad paths refuse ${cloneName} name collision`, () =>
    withFixture((f) => {
      const container = join(f.base, "other");
      mkdirSync(container);
      const sameName = join(container, cloneName);
      renameSync(f.clone, sameName);
      f.config.repositories.target.worktreeParent = "..";
      writeFileSync(
        join(f.main, "dotln.config.json"),
        JSON.stringify(f.config),
      );
      git(f.main, "add", "-A");
      git(f.main, "commit", "-qm", "Collision fixture");
      git(f.main, "push", "-q", "origin", "main");
      f.ok(f.worktree("clone", "target", sameName));
      const result = f.worktree("start", "WO-999", f.order);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /target and launchpad worktree paths overlap/,
      );
      for (const repo of [f.main, sameName])
        assert.equal(git(repo, "branch", "--list", "wo-999"), "");
      assert.equal(existsSync(f.orderRoot), false);
      assert.equal(readTargetStart(f.main, "WO-999"), undefined);
      assert.equal(existsSync(targetRegistryPath(f.main)), false);
    }));

test("preparation retry resumes the recorded pair after bootstrap or harness failure", () => {
  for (const phase of ["bootstrap", "harness"])
    withFixture((f) => {
      f.mapClone();
      const runtime = join(f.main, "packages/compiler/dist");
      const retainedRuntime = join(f.base, "retained-compiler-dist");
      if (phase === "harness") renameSync(runtime, retainedRuntime);
      const result = f.call(
        f.main,
        f.main,
        "worktree",
        ["start", "WO-999", f.order],
        phase === "bootstrap" ? { DOTLN_FIXTURE_BOOTSTRAP_FAIL: "1" } : {},
      );
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        phase === "bootstrap"
          ? /launchpad preparation failed/
          : /Cannot find module/,
      );
      assert.match(result.stderr, /Target start is preserved.*retry from/);
      assert.ok(readTargetStart(f.main, "WO-999"));
      assert.ok(existsSync(f.target));
      assert.ok(existsSync(f.orderRoot));
      assert.equal(existsSync(targetRegistryPath(f.main)), false);
      const launchpadHead = git(f.orderRoot, "rev-parse", "HEAD");
      write(f.target, "preserved.txt", "work after interruption\n");
      git(f.target, "add", "-A");
      git(f.target, "commit", "-qm", "test: preserved target work");
      const targetHead = git(f.target, "rev-parse", "HEAD");
      if (phase === "harness") renameSync(retainedRuntime, runtime);
      f.start();
      assert.equal(git(f.target, "rev-parse", "HEAD"), targetHead);
      assert.equal(git(f.orderRoot, "rev-parse", "HEAD"), launchpadHead);
      assert.equal(
        checkTargetHarness(f.target, { runtimeRoot: f.main }).files,
        7,
      );
      assert.equal(readTargetStart(f.main, "WO-999"), undefined);
      const events = readFileSync(
        docPath(f.orderRoot, "orders", "WO-999.jsonl"),
        "utf8",
      )
        .trim()
        .split("\n")
        .map(JSON.parse);
      assert.equal(
        events.filter((event) => event.type === "WorkOrderActivated").length,
        1,
      );
      assert.equal(
        JSON.parse(f.ok(f.resume(["status", "--json"]))).workOrder,
        "WO-999",
      );
    });
});

test("clone admits declared export siblings, never consumers or unknown names", () =>
  withFixture((f) => {
    write(
      f.main,
      "records/siblings/siblings.json",
      JSON.stringify({
        schemaVersion: 1,
        siblings: [
          {
            id: "starter-fixture",
            purpose: "Fixture export",
            relation: { kind: "export", coreCommit: null },
            capabilityRows: [],
          },
          {
            id: "consumer-fixture",
            purpose: "Fixture consumer",
            relation: { kind: "consumer", contractVersion: "v1" },
            capabilityRows: [],
          },
        ],
      }),
    );
    f.ok(f.worktree("clone", "starter-fixture", f.clone));
    assert.equal(
      JSON.parse(readFileSync(cloneMapPath(f.main), "utf8"))["starter-fixture"],
      f.clone,
    );
    assert.equal(git(f.main, "ls-files", "--", cloneMapPath(f.main)), "");
    git(f.main, "check-ignore", "--quiet", "--no-index", cloneMapPath(f.main));
    for (const id of ["consumer-fixture", "undeclared"]) {
      const refused = f.worktree("clone", id, f.clone);
      assert.equal(refused.status, 1);
      assert.match(refused.stderr, /unknown repository id/);
    }
  }));

test("self start preserves a failed receipt carry and its printed retry completes activation", () =>
  withFixture((f) => {
    write(
      f.main,
      "records/siblings/siblings.json",
      JSON.stringify({
        schemaVersion: 1,
        siblings: [
          {
            id: "starter-fixture",
            purpose: "Fixture export",
            relation: { kind: "export", coreCommit: null },
            capabilityRows: [],
          },
        ],
      }),
    );
    write(
      f.main,
      "records/siblings/README.md/obstruction",
      "registry failure fixture",
    );
    const authority = readFileSync(join(f.main, f.order), "utf8").replace(
      /^\*\*Repository:\*\*.*\n/m,
      "",
    );
    write(f.main, f.order, authority);
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "Self carry failure fixture");
    git(f.main, "push", "-q", "origin", "main");
    const pending =
      "records/state/local/sibling-receipts/starter-fixture/2026-10-13T12-00-00-000Z.json";
    write(
      f.main,
      pending,
      JSON.stringify({
        sibling: "starter-fixture",
        coreCommit: git(f.main, "rev-parse", "HEAD"),
        manifestHash: `sha256:${"1".repeat(64)}`,
        buildHash: "fnv1a64:1234567890abcdef",
        date: "2026-10-13T12:00:00.000Z",
      }) + "\n",
    );
    const failed = f.worktree("start", "WO-999", f.order);
    assert.notEqual(failed.status, 0);
    assert.match(
      failed.stderr,
      /created and preserved.*contained regular file/,
    );
    assert.ok(existsSync(f.orderRoot));
    assert.ok(existsSync(join(f.main, pending)));
    assert.equal(
      existsSync(join(f.orderRoot, "records/state/orders/WO-999.jsonl")),
      false,
    );
    const carried = join(
      f.orderRoot,
      "records/evidence/siblings/starter-fixture/2026-10-13T12-00-00-000Z.json",
    );
    assert.deepEqual(
      readFileSync(carried),
      readFileSync(join(f.main, pending)),
    );
    rmSync(join(f.orderRoot, "records/siblings/README.md"), {
      recursive: true,
    });
    const command = failed.stderr.match(
      /retry: (node --input-type=module -e .*)/,
    )[1];
    const retried = spawnSync("/bin/zsh", ["-c", command], {
      cwd: f.main,
      env: f.env,
      encoding: "utf8",
    });
    assert.equal(retried.status, 0, retried.stderr || retried.stdout);
    assert.equal(existsSync(join(f.main, pending)), false);
    assert.match(
      f.ok(f.call(f.orderRoot, f.orderRoot, "siblings", ["index", "--check"])),
      /current/,
    );
    assert.equal(
      JSON.parse(
        f.ok(f.call(f.orderRoot, f.orderRoot, "resume", ["status", "--json"])),
      ).phase,
      "active",
    );
    assert.equal(
      git(f.main, "status", "--porcelain", "--untracked-files=all"),
      "",
    );
  }));

test("worktree start carries the main checkout's local-terms list and a clone record accepts an id the order checkout declares", () =>
  withFixture((f) => {
    const terms = "FixturePrivateTerm\n";
    write(f.main, "records/state/local/terms.txt", terms);
    f.mapClone();
    const started = f.start();
    assert.match(started, /Carried the local-terms list into /u);
    const carried = docPath(f.orderRoot, "control", "local/terms.txt");
    assert.equal(readFileSync(carried, "utf8"), terms);
    assert.equal(git(f.orderRoot, "check-ignore", "--quiet", carried), "");
    // A registration lands on an order branch before main: the clone record
    // validates its id against the running checkout as well as main.
    const config = JSON.parse(
      readFileSync(join(f.orderRoot, "dotln.config.json"), "utf8"),
    );
    config.repositories.second = config.repositories.target;
    write(f.orderRoot, "dotln.config.json", JSON.stringify(config));
    const fromOrder = (id) =>
      f.call(f.orderRoot, f.orderRoot, "worktree", ["clone", id, f.clone]);
    f.ok(fromOrder("second"));
    assert.equal(
      JSON.parse(readFileSync(cloneMapPath(f.main), "utf8")).second,
      f.clone,
    );
    assert.equal(
      existsSync(cloneMapPath(f.orderRoot)),
      false,
      "the record lives in the main checkout's map",
    );
    const undeclared = fromOrder("third");
    assert.equal(undeclared.status, 1);
    assert.match(undeclared.stderr, /unknown repository id "third"/u);
  }));

test("worktree start names the local-terms registration step when the main checkout has no list", () =>
  withFixture((f) => {
    f.mapClone();
    const started = f.start();
    assert.match(
      started,
      /No local-terms list at .*; register records\/state\/local\/terms\.txt in the new worktree/u,
    );
    assert.equal(
      existsSync(docPath(f.orderRoot, "control", "local/terms.txt")),
      false,
    );
  }));

test("target final review refuses a nonconventional commit before binding the subject", () =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    write(f.target, "reviewed.txt", "reviewed\n");
    git(f.target, "add", "reviewed.txt");
    git(f.target, "commit", "-qm", "A nonconventional target message");
    prepareFinalReview(f);
    const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl"),
      before = readFileSync(segment);
    const refused = f.resume(["final-review-result", "pass", ...actorArgs]);
    assert.notEqual(refused.status, 0);
    assert.match(
      refused.stderr,
      /commit message format refused before final review: subject.shape/u,
    );
    assert.deepEqual(readFileSync(segment), before);
  }));

test("a target registered to another launchpad names that launchpad without selecting it", () =>
  withFixture((f) => {
    f.mapClone();
    f.start();
    const before = readFileSync(docPath(f.orderRoot, "orders", "WO-999.jsonl"));
    const result = f.call(f.target, f.main, "resume", ["status", "--json"]);
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /registered to launchpad.*no order selected.*DOTLN_LAUNCHPAD=/u,
    );
    assert.ok(result.stderr.includes(`${f.orderRoot}/scripts/resume.mjs`));
    assert.deepEqual(
      readFileSync(docPath(f.orderRoot, "orders", "WO-999.jsonl")),
      before,
    );
  }));

test("malformed literal settings refuse target start before either worktree is created", () =>
  withFixture((f) => {
    publicationSetup(f);
    f.config.repositories.target.hostRules = "literal";
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: literal rules");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    write(f.main, ".claude/settings.local.json", "{broken");
    const result = f.worktree("start", "WO-999", f.order);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /settings.local.json/u);
    assert.equal(existsSync(f.orderRoot), false);
    assert.equal(existsSync(f.target), false);
    assert.equal(existsSync(targetRegistryPath(f.main)), false);
  }));
