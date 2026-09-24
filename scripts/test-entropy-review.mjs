#!/usr/bin/env node
import { isMainModule } from "./lib/paths.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
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
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  buildAttestation,
  checkEntropyReceipts,
  controlLog,
  currentDispatch,
  entropyScratchLane,
  readEntropyControl,
  renderReceipt,
  runsRoot,
} from "./lib/entropy-review.mjs";
import { main as entropy } from "./entropy.mjs";

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const git = (repo, args) => {
  const run = spawnSync("git", args, { cwd: repo, encoding: "utf8" });
  assert.equal(run.status, 0, `git ${args.join(" ")}: ${run.stderr}`);
  return run.stdout.trim();
};
const write = (repo, path, body) => {
  mkdirSync(dirname(join(repo, path)), { recursive: true });
  writeFileSync(join(repo, path), body);
};
const commit = (repo, message) => {
  git(repo, ["add", "-A"]);
  git(repo, ["commit", "--quiet", "-m", message]);
};

/** A launchpad with this repository's document layout and its own Git history.
 * The fake transport drives the whole family here; nothing launches a model. */
function fixtureRepository(parent) {
  // macOS resolves the temporary root through a symlink; Git reports the real
  // path, and the command refuses a root that is not its own.
  const repo = realpathSync(mkdtempSync(join(parent, "entropy-")));
  fixtureRepositories.push(repo);
  git(repo, ["init", "--quiet", "-b", "main"]);
  git(repo, ["config", "user.email", "fixture@example.invalid"]);
  git(repo, ["config", "user.name", "Fixture"]);
  git(repo, ["config", "commit.gpgsign", "false"]);
  write(repo, "README.md", "# Fixture subject\n\nOne tracked file.\n");
  write(repo, "src/module.mjs", "export const value = 1;\n");
  write(
    repo,
    "docs/product/00-overview.md",
    "# Overview\n\nFixture product.\n",
  );
  write(
    repo,
    "docs/instance/entropy-reducer/README.md",
    "# Fixture guide\n\nThe command family drives this instance.\n",
  );
  write(repo, ".gitignore", "docs/control/local/\nnode_modules/\n");
  commit(repo, "fixture subject");
  return repo;
}

const only = (rows, type) => rows.filter((row) => row.type === type);

/** Every fixture launchpad, so the outer finally can sweep the frozen copies
 * a test that ends mid-dispatch would otherwise leave in system-temp. */
const fixtureRepositories = [];

export async function entropyFixtures() {
  const parent = mkdtempSync(join(tmpdir(), "dotln-entropy-fixtures-"));
  process.env.DOTLN_ENTROPY_FIXTURE = "1";
  try {
    await test("the fake transport drives review, receipt, refute, refutation-receipt and dispose end to end", async () => {
      const repo = fixtureRepository(parent);

      const begun = await entropy(["review", "--transport", "fake"], repo);
      assert.equal(begun.route, "launched");
      assert.equal(begun.transport, "fake");
      assert.match(begun.episodeId, /^ep_entropy_[0-9a-f]{16}$/u);
      assert.ok(
        existsSync(begun.frozenSubject),
        "the frozen copy exists while the dispatch is pending",
      );
      assert.ok(
        existsSync(join(begun.frozenSubject, "src/module.mjs")),
        "the frozen copy carries the subject's tracked bytes",
      );
      assert.notEqual(
        begun.frozenSubject,
        repo,
        "the subject is copied, never reviewed in place",
      );
      const pending = currentDispatch(repo, "review");
      assert.equal(pending.subjectHash, begun.subjectHash);

      const capture = join(pending.capture, "result.json");
      const statement = join(pending.capture, "statement.txt");
      const filed = await entropy(
        ["receipt", capture, "--statement", statement],
        repo,
      );
      assert.equal(filed.receiptId, "REVIEW-001");
      assert.equal(filed.findings.total, 5);
      assert.equal(filed.findings.measured, 2);
      assert.equal(filed.findings.byInspection, 3);
      assert.equal(filed.trackedStatusByteIdentical, true);
      assert.equal(
        currentDispatch(repo, "review"),
        null,
        "filing clears the pending dispatch",
      );
      assert.ok(
        !existsSync(pending.scratchParent),
        "the frozen copy is removed once its receipt is filed",
      );

      const receipt = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      );
      assert.equal(
        receipt.subject.baseCommit,
        git(repo, ["rev-parse", "HEAD"]),
      );
      assert.equal(receipt.liveness, "fixture");
      assert.equal(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.md"), "utf8"),
        renderReceipt(receipt),
        "the rendered Markdown is a projection of the JSON",
      );

      const events = readEntropyControl(repo);
      assert.equal(only(events, "EntropyReviewFiled").length, 1);
      assert.equal(events[0].receiptId, "REVIEW-001");
      assert.equal(events[0].receiptHash, receipt.receiptHash);

      const refute = await entropy(
        ["refute", "REVIEW-001", "--transport", "fake"],
        repo,
      );
      const refutationPending = currentDispatch(repo, "refutation");
      assert.equal(refutationPending.reviewReceiptId, "REVIEW-001");
      await assert.rejects(
        entropy(["refute", "REVIEW-001", "--transport", "fake"], repo),
        /already pending \(episode/u,
        "a second refutation dispatch cannot replace the pending pointer",
      );
      const bound = await entropy(
        [
          "refutation-receipt",
          join(refutationPending.capture, "result.json"),
          "--statement",
          join(refutationPending.capture, "statement.txt"),
        ],
        repo,
      );
      assert.equal(bound.receiptId, "REFUTATION-001");
      assert.deepEqual(
        [...bound.survived].sort(),
        ["ER-F01", "ER-F02", "ER-F03", "ER-F04", "ER-F05"],
        "every selected finding survived the canned attempt",
      );
      assert.deepEqual(bound.refuted, []);
      assert.deepEqual(bound.unselected, [], "five findings are all selected");

      const disposed = await entropy(
        ["dispose", "REVIEW-001", "ER-F01", "accept", "Fixture acceptance."],
        repo,
      );
      assert.equal(disposed.survival, "survived");
      const candidate = readFileSync(
        join(repo, "docs/planning/entropy-reviews/REVIEW-001.md"),
        "utf8",
      );
      assert.match(
        candidate,
        /^## Candidates — accepted Entropy Reducer findings, review REVIEW-001 \(recorded \d{4}-\d{2}-\d{2}\)$/mu,
        "the accepted finding lands under a formal candidate heading",
      );
      assert.match(candidate, /- \*\*ER-F01 — /u);

      const packet = await entropy(
        [
          "dispose",
          "REVIEW-001",
          "fixture-suggestion",
          "accept",
          "Fixture packet acceptance.",
        ],
        repo,
      );
      assert.equal(packet.kind, "proposal-packet");
      assert.ok(
        existsSync(join(repo, "docs/proposals/fixture-suggestion/packet.json")),
        "an accepted packet is filed under docs/proposals/",
      );

      const gate = checkEntropyReceipts(repo);
      assert.deepEqual(gate.receipts, ["REVIEW-001", "REFUTATION-001"]);
      assert.equal(gate.status, "ok");
      assert.equal(gate.dispositions, 2);
      assert.equal(gate.packets, 1);
    });

    await test("the selection rule, its blinding and its denominators are the loadout's, not the host's", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      const refute = await entropy(["refute", "REVIEW-001"], repo);
      assert.equal(refute.route, "background");
      assert.equal(refute.selection.measuredDenominator, 2);
      assert.equal(refute.selection.measuredStatus, "selected");
      assert.equal(refute.selection.inspectionDenominator, 3);
      assert.equal(refute.selection.inspectionStatus, "all");
      const carried = JSON.stringify(refute.prompt);
      // The compiled work order and authority travel with every episode; what
      // must not travel is anything the first reviewer concluded.
      for (const withheld of [
        "Synthetic fixture observation",
        "Synthetic fixture expectation",
        "Synthetic fixture criterion",
        "Synthetic fixture opportunity",
        "fixture-suggestion",
        "fixture/alpha",
      ])
        assert.ok(
          !carried.includes(withheld),
          `the blinded prompt must not carry ${withheld}`,
        );
      assert.ok(
        carried.includes("ER-F01"),
        "finding ids attribute the subject",
      );
      assert.ok(carried.includes("node --version"), "the reproduction crosses");
      await entropy(["discard", "refutation"], repo);
    });

    await test("zero findings yield not-applicable denominators rather than a synthetic pass", async () => {
      const repo = fixtureRepository(parent);
      const { FakeEntropyTransport, cannedEmptyReviewerOutput } =
        await import("../packages/skeleton/dist/src/entropy-review-fake.js");
      assert.ok(FakeEntropyTransport, "the fake transport is published");
      // Drive the empty shape through the same host path by filing a result
      // the operator supplies, which is the background route's contract.
      const begun = await entropy(["review"], repo);
      const pending = currentDispatch(repo, "review");
      const empty = {
        schemaVersion: 1,
        findings: [],
        proposalPackets: [],
        resultEnvelope: {
          workOrderId: pending.workOrderId,
          episodeId: pending.episodeId,
          status: "completed",
          resultId: `result_${pending.commandId}`,
          summary: "Fixture review with no findings.",
          requiresHuman: true,
        },
        cleanRoom: {
          status: "passed",
          stopConditionsFound: false,
          evidenceRefs: ["fixture://entropy/clean-room"],
        },
      };
      mkdirSync(pending.capture, { recursive: true });
      writeFileSync(
        join(pending.capture, "result.json"),
        JSON.stringify(empty),
      );
      writeFileSync(join(pending.capture, "statement.txt"), "Fixture.");
      const filed = await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      assert.equal(filed.selection.measuredStatus, "not-applicable");
      assert.equal(filed.selection.inspectionStatus, "not-applicable");
      await assert.rejects(
        entropy(["refute", "REVIEW-001"], repo),
        /selected no findings/u,
        "a review with nothing to refute refuses rather than passing",
      );
      assert.ok(
        cannedEmptyReviewerOutput,
        "the empty fixture shape is published",
      );
    });

    await test("a blocked run files its receipt with the failure and promotes nothing", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review"], repo);
      const pending = currentDispatch(repo, "review");
      const blocked = {
        schemaVersion: 1,
        findings: [],
        proposalPackets: [],
        resultEnvelope: {
          workOrderId: pending.workOrderId,
          episodeId: pending.episodeId,
          status: "blocked",
          resultId: `result_${pending.commandId}`,
          summary: "Fixture review blocked before the census completed.",
          requiresHuman: true,
        },
        cleanRoom: {
          status: "passed",
          stopConditionsFound: false,
          evidenceRefs: ["fixture://entropy/clean-room"],
        },
      };
      mkdirSync(pending.capture, { recursive: true });
      writeFileSync(
        join(pending.capture, "result.json"),
        JSON.stringify(blocked),
      );
      writeFileSync(join(pending.capture, "statement.txt"), "Fixture.");
      const filed = await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      assert.equal(filed.receiptId, "REVIEW-001");
      const receipt = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      );
      assert.equal(
        receipt.reviewerOutput.resultEnvelope.status,
        "blocked",
        "the receipt records the run's own failure rather than discarding it",
      );
      assert.equal(receipt.findingSummary.total, 0);
      assert.equal(checkEntropyReceipts(repo).status, "ok");
    });

    await test("a dirty tree and a second pending dispatch are refused by path", async () => {
      const repo = fixtureRepository(parent);
      write(repo, "src/module.mjs", "export const value = 2;\n");
      await assert.rejects(
        entropy(["review"], repo),
        /refuses a dirty tree/u,
        "the working tree's bytes never become the reviewed subject",
      );
      const head = git(repo, ["rev-parse", "HEAD"]);
      const named = await entropy(["review", head], repo);
      assert.equal(
        named.subjectHash.length,
        64,
        "an explicitly named commit is a subject even while the tree moves",
      );
      await assert.rejects(
        entropy(["review", head], repo),
        /already pending \(episode/u,
        "a second review of a pending subject is refused",
      );
      // The pointer is single, so a moved tracked status must not admit a
      // second dispatch for the same commit: the first episode and its frozen
      // copy would stop being addressable by receipt or discard.
      write(repo, "README.md", "# Fixture subject\n\nMoved after dispatch.\n");
      await assert.rejects(
        entropy(["review", head], repo),
        /already pending \(episode/u,
        "a changed tracked status is not a licence to replace the pointer",
      );
      const pending = currentDispatch(repo, "review");
      assert.equal(
        pending.episodeId,
        named.episodeId,
        "the first dispatch is still the current one",
      );
      assert.ok(
        existsSync(pending.scratchParent),
        "the first frozen copy is still addressable",
      );
      assert.equal(
        readdirSync(join(repo, "docs/control/local/entropy")).filter((name) =>
          name.startsWith("review-"),
        ).length,
        1,
        "no second pending record was written",
      );
      assert.equal(
        readdirSync(entropyScratchLane(repo)).length,
        1,
        "the refusal precedes the copy, so it costs no second frozen copy",
      );
      await entropy(["discard", "review"], repo);
      assert.equal(currentDispatch(repo, "review"), null);
      assert.ok(
        !existsSync(pending.scratchParent),
        "discard releases the frozen copy of the dispatch it named",
      );
    });

    await test("a result whose tracked status moved during the episode is refused", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      write(repo, "src/module.mjs", "export const value = 3;\n");
      await assert.rejects(
        entropy(
          [
            "receipt",
            join(pending.capture, "result.json"),
            "--statement",
            join(pending.capture, "statement.txt"),
          ],
          repo,
        ),
        /tracked status changed during the review episode/u,
      );
      assert.equal(
        existsSync(join(repo, runsRoot(repo)))
          ? readdirSync(join(repo, runsRoot(repo))).filter((name) =>
              name.endsWith(".json"),
            ).length
          : 0,
        0,
        "nothing is filed when the subject moved",
      );
    });

    await test("the explicit route binds the named commit, not the working tree", async () => {
      const repo = fixtureRepository(parent);
      const head = git(repo, ["rev-parse", "HEAD"]);
      await entropy(["review", head, "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      // Unrelated working-tree movement during the episode: the subject is the
      // named commit and is untouched by it.
      write(repo, "src/module.mjs", "export const value = 99;\n");
      const filed = await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      assert.equal(filed.receiptId, "REVIEW-001");
      assert.equal(
        filed.trackedStatusByteIdentical,
        false,
        "the drift is recorded, not hidden",
      );
      const receipt = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      );
      assert.match(
        receipt.confinement.subjectBinding,
        /explicitly named commit/u,
      );
      assert.equal(receipt.workingTreeDirtyAtDispatch, false);
      assert.equal(receipt.namedRevision, head);
      assert.equal(checkEntropyReceipts(repo).status, "ok");

      // The same route still refuses when the subject itself cannot be
      // resolved to the tree the frozen copy was reviewed from.
      await entropy(["review", head, "--transport", "fake"], repo);
      const second = currentDispatch(repo, "review");
      rmSync(join(second.subject.scratchRepository, ".git"), {
        recursive: true,
        force: true,
      });
      await assert.rejects(
        entropy(
          [
            "receipt",
            join(second.capture, "result.json"),
            "--statement",
            join(second.capture, "statement.txt"),
          ],
          repo,
        ),
        /no longer resolves to the tree the frozen copy was reviewed from/u,
      );
      await entropy(["discard", "review"], repo);
    });

    await test("the refutation records tracked status and the scratch delta on either side of its episode", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const reviewPending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(reviewPending.capture, "result.json"),
          "--statement",
          join(reviewPending.capture, "statement.txt"),
        ],
        repo,
      );

      await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "refutation");
      // The refuter is admitted to run commands inside the frozen copy, so
      // something it leaves behind must appear in the receipt's delta.
      write(
        pending.subject.scratchRepository,
        "probe-output.txt",
        "perturbation\n",
      );
      const bound = await entropy(
        [
          "refutation-receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      assert.equal(bound.receiptId, "REFUTATION-001");
      const receipt = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REFUTATION-001.json"), "utf8"),
      );
      const confinement = receipt.confinement;
      assert.equal(
        confinement.trackedStatusBeforeSha256,
        confinement.trackedStatusAfterSha256,
        "an untouched source repository records the same status on either side",
      );
      assert.equal(confinement.trackedStatusByteIdentical, true);
      assert.equal(bound.trackedStatusByteIdentical, true);
      assert.equal(
        confinement.scratchInventoryBefore.count,
        pending.subject.scratchInventoryCount,
      );
      assert.equal(
        confinement.scratchInventoryAfter.count,
        pending.subject.scratchInventoryCount + 1,
        "the after-inventory is recomputed, never copied from the dispatch",
      );
      assert.notEqual(
        confinement.scratchInventoryAfter.sha256,
        confinement.scratchInventoryBefore.sha256,
      );
      // WO-157 item 9: the delta is the added, removed and resized path sets.
      assert.deepEqual(
        {
          observed: confinement.scratchDelta.observed,
          added: confinement.scratchDelta.added,
          removed: confinement.scratchDelta.removed,
          resized: confinement.scratchDelta.resized,
          counts: confinement.scratchDelta.counts,
        },
        {
          observed: true,
          added: ["probe-output.txt"],
          removed: [],
          resized: [],
          counts: { added: 1, removed: 0, resized: 0 },
        },
      );
      assert.deepEqual(bound.confinement.scratchDelta, {
        added: 1,
        removed: 0,
        resized: 0,
      });
      const rendered = readFileSync(
        join(repo, runsRoot(repo), "REFUTATION-001.md"),
        "utf8",
      );
      assert.equal(
        rendered,
        renderReceipt(receipt),
        "the rendered after-state is a projection of the JSON",
      );
      assert.match(rendered, /1 path\(s\) added, 0 removed, 0 resized/u);
      assert.equal(checkEntropyReceipts(repo).status, "ok");

      // A pair filed before this observation existed keeps its bytes, and the
      // immutability check re-renders every filed receipt, so the projection
      // of a receipt without an after-state must still be itself.
      const earlier = structuredClone(receipt);
      for (const field of [
        "subjectBinding",
        "trackedStatusBeforeSha256",
        "trackedStatusAfterSha256",
        "trackedStatusByteIdentical",
        "scratchInventoryBefore",
        "scratchInventoryAfter",
        "scratchDelta",
        "untrackedListing",
        "excludedFromManifest",
        "deniedTools",
      ])
        delete earlier.confinement[field];
      const earlierRendered = renderReceipt(earlier);
      assert.doesNotMatch(earlierRendered, /Subject binding:/u);
      assert.match(earlierRendered, /^Survived: /mu);

      // A source repository that moved during the episode is recorded, not
      // hidden and not refused: the subject is the review's named commit.
      await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
      const second = currentDispatch(repo, "refutation");
      write(repo, "src/module.mjs", "export const value = 7;\n");
      const drifted = await entropy(
        [
          "refutation-receipt",
          join(second.capture, "result.json"),
          "--statement",
          join(second.capture, "statement.txt"),
        ],
        repo,
      );
      assert.equal(drifted.receiptId, "REFUTATION-002");
      assert.equal(drifted.trackedStatusByteIdentical, false);
      const after = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REFUTATION-002.json"), "utf8"),
      );
      assert.notEqual(
        after.confinement.trackedStatusAfterSha256,
        after.confinement.trackedStatusBeforeSha256,
      );
      assert.equal(after.confinement.scratchDelta.observed, true);
      assert.equal(checkEntropyReceipts(repo).status, "ok");
    });

    await test("an invalid return is rejected and retained with its statement", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review"], repo);
      const pending = currentDispatch(repo, "review");
      mkdirSync(pending.capture, { recursive: true });
      writeFileSync(
        join(pending.capture, "result.json"),
        JSON.stringify({ schemaVersion: 1, findings: [] }),
      );
      writeFileSync(
        join(pending.capture, "statement.txt"),
        "Fixture statement.",
      );
      await assert.rejects(
        entropy(
          [
            "receipt",
            join(pending.capture, "result.json"),
            "--statement",
            join(pending.capture, "statement.txt"),
          ],
          repo,
        ),
        /rejected result and statement retained at/u,
      );
      const lane = join(repo, "docs/control/local/entropy/rejected");
      assert.ok(existsSync(lane) && readdirSync(lane).length === 1);
      await entropy(["discard", "review"], repo);
    });

    await test("accepting a refuted, blocked, unselected or unknown identifier is refused", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      let pending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      await assert.rejects(
        entropy(
          ["dispose", "REVIEW-001", "ER-F01", "accept", "Too early."],
          repo,
        ),
        /cannot be accepted before a refutation/u,
      );
      await entropy(["refute", "REVIEW-001"], repo);
      const refutation = currentDispatch(repo, "refutation");
      const review = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      );
      const attempts = review.selection.selectedFindingIds.map((findingId) => ({
        findingId,
        result:
          findingId === "ER-F01"
            ? "refuted"
            : findingId === "ER-F02"
              ? "blocked"
              : "survived",
        reason: "Fixture attempt.",
        evidenceRefs: ["fixture://entropy/attempt"],
      }));
      mkdirSync(refutation.capture, { recursive: true });
      writeFileSync(
        join(refutation.capture, "result.json"),
        JSON.stringify({ schemaVersion: 1, attempts }),
      );
      writeFileSync(join(refutation.capture, "statement.txt"), "Fixture.");
      const bound = await entropy(
        [
          "refutation-receipt",
          join(refutation.capture, "result.json"),
          "--statement",
          join(refutation.capture, "statement.txt"),
        ],
        repo,
      );
      assert.deepEqual(bound.refuted, ["ER-F01"]);
      assert.deepEqual(bound.blocked, ["ER-F02"]);
      for (const [id, reason] of [
        ["ER-F01", /is refuted in REFUTATION-001/u],
        ["ER-F02", /is blocked in REFUTATION-001/u],
        ["ER-F99", /names neither a finding nor a proposal packet/u],
      ])
        await assert.rejects(
          entropy(["dispose", "REVIEW-001", id, "accept", "No."], repo),
          reason,
        );
      const deferred = await entropy(
        ["dispose", "REVIEW-001", "ER-F01", "defer", "Refuted but recorded."],
        repo,
      );
      assert.equal(deferred.survival, "refuted");
      assert.ok(
        !existsSync(join(repo, "docs/planning/entropy-reviews/REVIEW-001.md")),
        "only an acceptance creates a candidate row",
      );
    });

    await test("a pass consumes an undisposed review before paying for another", async () => {
      const repo = fixtureRepository(parent);
      assert.equal(
        (await entropy(["subject"], repo)).action,
        "review",
        "with nothing filed, a fresh episode earns its cost",
      );

      await entropy(["review", "--transport", "fake"], repo);
      assert.equal(
        (await entropy(["subject"], repo)).action,
        "finish-pending-dispatch",
        "a pending dispatch is finished before a pass opens",
      );
      let pending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      assert.equal(
        (await entropy(["subject"], repo)).action,
        "review",
        "a review with no refutation is not yet consumable",
      );

      await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
      pending = currentDispatch(repo, "refutation");
      await entropy(
        [
          "refutation-receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      const consume = await entropy(["subject"], repo);
      assert.equal(consume.action, "consume");
      assert.equal(consume.receiptId, "REVIEW-001");
      assert.equal(consume.refutationReceiptId, "REFUTATION-001");
      assert.equal(consume.survived.length, 5);
      assert.deepEqual(consume.proposalPackets, ["fixture-suggestion"]);

      await entropy(
        ["dispose", "REVIEW-001", "ER-F01", "defer", "Fixture disposition."],
        repo,
      );
      assert.equal(
        (await entropy(["subject"], repo)).action,
        "review",
        "a review this pass has started disposing is no longer an unconsumed subject",
      );
    });

    await test("check fails on a hand-edited receipt, a missing control event and a fixture receipt", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      const jsonPath = join(repo, runsRoot(repo), "REVIEW-001.json");
      const original = readFileSync(jsonPath, "utf8");
      const edited = JSON.parse(original);
      edited.findingSummary.total = 99;
      writeFileSync(jsonPath, `${JSON.stringify(edited, null, 2)}\n`);
      assert.throws(() => checkEntropyReceipts(repo), /was hand-edited/u);
      writeFileSync(jsonPath, original);
      assert.equal(checkEntropyReceipts(repo).status, "ok");

      const markdownPath = join(repo, runsRoot(repo), "REVIEW-001.md");
      const renderedOriginal = readFileSync(markdownPath, "utf8");
      writeFileSync(markdownPath, `${renderedOriginal}\nAppended prose.\n`);
      assert.throws(
        () => checkEntropyReceipts(repo),
        /is not the current projection of its JSON/u,
      );
      writeFileSync(markdownPath, renderedOriginal);

      const logPath = join(repo, controlLog(repo));
      const log = readFileSync(logPath, "utf8");
      writeFileSync(logPath, "");
      assert.throws(
        () => checkEntropyReceipts(repo),
        /filed with no control event/u,
      );
      writeFileSync(logPath, log);
      assert.equal(checkEntropyReceipts(repo).status, "ok");
    });

    await test("an interrupted filing is reported, never a shared-gate failure", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      // The crash shape: the event landed, the pair did not.
      for (const extension of ["json", "md"])
        rmSync(join(repo, runsRoot(repo), `REVIEW-001.${extension}`));
      const gate = checkEntropyReceipts(repo);
      assert.equal(gate.status, "interrupted-filing");
      assert.deepEqual(gate.interruptedFilings, ["REVIEW-001"]);
    });

    await test("the attestation labels a substitute reviewer and never invents readback", () => {
      const requirement = {
        harness: "claude-code",
        model: "claude-opus-5-5",
        displayModel: "Claude Opus 5.5",
        effort: "xhigh",
        substitutionPolicy: "different-reviewer-and-must-be-attested",
      };
      const pinned = buildAttestation(
        {
          transport: "claude-cli-print",
          model: "claude-opus-5-5",
          effort: "xhigh",
          harness: "claude-code",
          harnessVersion: "2.1.278",
          tools: ["Bash"],
        },
        requirement,
      );
      assert.equal(pinned.identity, "entropy-reducer@1");
      assert.equal(pinned.source, "command-line-readback-and-invocation");
      assert.equal(pinned.effectiveModel, "unknown");
      assert.equal(pinned.effectiveEffort, "unknown");

      const background = buildAttestation(
        {
          transport: null,
          model: "unknown",
          effort: "unknown",
          harness: "claude-code",
        },
        requirement,
      );
      assert.equal(background.identity, "substitute reviewer");
      assert.equal(background.source, "session-attested");
      assert.equal(background.effort, "unknown");

      const attested = buildAttestation(
        {
          transport: null,
          model: "claude-opus-5-5",
          effort: "xhigh",
          source: "operator-attested",
          harness: "claude-code",
        },
        requirement,
      );
      assert.equal(
        attested.identity,
        "substitute reviewer",
        "an operator attestation records the effort but is not invocation readback",
      );
      assert.equal(attested.effort, "xhigh");

      const other = buildAttestation(
        {
          transport: "codex-cli-exec",
          model: "gpt-6-sol",
          effort: "xhigh",
          harness: "codex-cli",
          harnessVersion: "0.154.0",
        },
        requirement,
      );
      assert.equal(other.identity, "substitute reviewer");
      assert.match(
        other.substitutionReason,
        /does not match Claude Opus 5\.5/u,
      );
    });

    await test("the fake transport cannot produce a live receipt", async () => {
      const repo = fixtureRepository(parent);
      delete process.env.DOTLN_ENTROPY_FIXTURE;
      try {
        await assert.rejects(
          entropy(["review", "--transport", "fake"], repo),
          /executable fixtures only and cannot satisfy a live row/u,
        );
      } finally {
        process.env.DOTLN_ENTROPY_FIXTURE = "1";
      }
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      const receipt = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      );
      assert.equal(receipt.liveness, "fixture");
      assert.equal(receipt.actorAttestation.identity, "substitute reviewer");
      assert.equal(
        checkEntropyReceipts(repo).status,
        "ok",
        "a fixture receipt is admitted while it stays uncommitted",
      );
      commit(repo, "file the fixture receipt");
      assert.throws(
        () => checkEntropyReceipts(repo),
        /fixture evidence and must never be committed as a run/u,
        "a committed fixture receipt fails the check",
      );
    });

    await test("the canonical prompt carries the residue, lens briefs, concern, subject path and schema", async () => {
      const repo = fixtureRepository(parent);
      const begun = await entropy(
        ["review", "--concern", "accumulated startup context"],
        repo,
      );
      assert.equal(begun.route, "background");
      assert.equal(begun.prompt.concern, "accumulated startup context");
      assert.equal(begun.prompt.lensBriefs.length, 4);
      assert.match(
        begun.prompt.residue,
        /Entropy Reducer — generated review residue/u,
      );
      assert.equal(
        begun.prompt.subject.frozenSubjectPath,
        begun.frozenSubject,
        "the prompt names the frozen copy, never the original repository",
      );
      assert.equal(begun.resultSchema.$id, "dotln.entropy-reducer.output.v1");
      assert.ok(
        !JSON.stringify(begun.prompt).includes(repo),
        "the original repository path never crosses the boundary",
      );
      await entropy(["discard", "review"], repo);
    });

    await test("WO-157 item 9: the witness records added and removed scratch paths and the source repository's untracked listing", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      // One path gained and one lost: the net count stays the same, which is
      // exactly what a net delta could not see (WO-151 D020).
      write(
        pending.subject.scratchRepository,
        "probe-output.txt",
        "perturbation\n",
      );
      rmSync(join(pending.subject.scratchRepository, "src/module.mjs"));
      // An untracked write in the source repository leaves tracked status
      // unchanged; the witness now observes it, without refusing it.
      write(repo, "escaped-untracked.txt", "outside the frozen copy\n");
      await entropy(
        [
          "receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      const receipt = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      );
      const confinement = receipt.confinement;
      assert.deepEqual(confinement.scratchDelta.added, ["probe-output.txt"]);
      assert.deepEqual(confinement.scratchDelta.removed, ["src/module.mjs"]);
      assert.deepEqual(confinement.scratchDelta.resized, []);
      assert.equal(confinement.scratchDelta.observed, true);
      assert.equal(
        confinement.scratchInventoryAfter.count,
        confinement.scratchInventoryBefore.count,
      );
      assert.equal(confinement.trackedStatusByteIdentical, true);
      assert.equal(confinement.untrackedListing.identical, false);
      assert.equal(
        confinement.untrackedListing.after.count,
        confinement.untrackedListing.before.count + 1,
      );
      assert.doesNotMatch(
        JSON.stringify(confinement.untrackedListing),
        /escaped-untracked/u,
        "the listing is recorded by count and hash, never by name",
      );
      const rendered = readFileSync(
        join(repo, runsRoot(repo), "REVIEW-001.md"),
        "utf8",
      );
      assert.equal(rendered, renderReceipt(receipt));
      assert.match(rendered, /1 path\(s\) added, 1 removed, 0 resized/u);
      assert.match(
        rendered,
        /untracked, non-ignored path listing unchanged: \*\*false\*\*/u,
      );
      assert.doesNotMatch(rendered, /Tracked status byte-identical/u);
      assert.equal(checkEntropyReceipts(repo).status, "ok");
      // Each set is listed up to a bound and bound whole by count and hash.
      const { scratchPathDelta } = await import("./lib/entropy-review.mjs");
      const many = Array.from({ length: 150 }, (_, index) => [
        `build/${String(index).padStart(3, "0")}.js`,
        "1",
      ]);
      const capped = scratchPathDelta([], many);
      assert.equal(capped.added.length, capped.listedPerSet);
      assert.equal(capped.counts.added, 150);
      assert.match(capped.sha256.added, /^[0-9a-f]{64}$/u);
    });

    await test("WO-157 VER-001 F2: a changed untracked listing whose paths carry newlines or edge whitespace is never recorded as unchanged", async () => {
      // Git admits a newline in a path; joined with newlines, the first pair
      // hashes the same bytes although no path is shared. The second pair
      // matched once the first path's leading space was trimmed (the repair
      // review).
      for (const [before, after] of [
        [
          ["a\nb", "c"],
          ["a", "b\nc"],
        ],
        [
          [" a", "b"],
          ["a", "b"],
        ],
      ]) {
        const repo = fixtureRepository(parent);
        for (const path of before) write(repo, path, "before\n");
        await entropy(["review", "--transport", "fake"], repo);
        const pending = currentDispatch(repo, "review");
        for (const path of before) rmSync(join(repo, path));
        for (const path of after) write(repo, path, "after\n");
        await entropy(
          [
            "receipt",
            join(pending.capture, "result.json"),
            "--statement",
            join(pending.capture, "statement.txt"),
          ],
          repo,
        );
        const { untrackedListing } = JSON.parse(
          readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
        ).confinement;
        assert.equal(
          untrackedListing.after.count,
          untrackedListing.before.count,
        );
        assert.notEqual(
          untrackedListing.after.sha256,
          untrackedListing.before.sha256,
        );
        assert.equal(untrackedListing.identical, false);
        assert.match(
          readFileSync(join(repo, runsRoot(repo), "REVIEW-001.md"), "utf8"),
          /untracked, non-ignored path listing unchanged: \*\*false\*\*/u,
        );
      }
      // The scratch path sets are bound by the same framing.
      const { scratchPathDelta } = await import("./lib/entropy-review.mjs");
      assert.notEqual(
        scratchPathDelta(
          [],
          [
            ["a\nb", "1"],
            ["c", "1"],
          ],
        ).sha256.added,
        scratchPathDelta(
          [],
          [
            ["a", "1"],
            ["b\nc", "1"],
          ],
        ).sha256.added,
      );
    });

    await test("WO-157 item 10: a refutation receipt renders the typed reasons in place of a worker statement", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const reviewPending = currentDispatch(repo, "review");
      await entropy(
        [
          "receipt",
          join(reviewPending.capture, "result.json"),
          "--statement",
          join(reviewPending.capture, "statement.txt"),
        ],
        repo,
      );
      await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "refutation");
      // What both live refuters returned as their statement: the attempts
      // payload itself (WO-151 D017).
      writeFileSync(
        join(pending.capture, "statement.txt"),
        readFileSync(join(pending.capture, "result.json"), "utf8"),
      );
      await entropy(
        [
          "refutation-receipt",
          join(pending.capture, "result.json"),
          "--statement",
          join(pending.capture, "statement.txt"),
        ],
        repo,
      );
      const receipt = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REFUTATION-001.json"), "utf8"),
      );
      assert.equal(
        "statement" in receipt,
        false,
        "the refutation route records no separate statement",
      );
      const rendered = readFileSync(
        join(repo, runsRoot(repo), "REFUTATION-001.md"),
        "utf8",
      );
      assert.equal(rendered, renderReceipt(receipt));
      assert.doesNotMatch(rendered, /^## Worker statement$/mu);
      assert.match(rendered, /^## Attempt reasons$/mu);
      assert.ok(receipt.report.attempts.length > 0);
      for (const attempt of receipt.report.attempts)
        assert.ok(
          rendered.includes(`\`${attempt.findingId}\` ${attempt.result}: `),
          attempt.findingId,
        );
      // A filed receipt that carries a statement still projects to itself.
      assert.match(
        renderReceipt({ ...receipt, statement: "Earlier." }),
        /^## Worker statement$/mu,
      );
      assert.equal(checkEntropyReceipts(repo).status, "ok");
      // --statement is no longer required on the refutation route.
      await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
      const second = currentDispatch(repo, "refutation");
      const bound = await entropy(
        ["refutation-receipt", join(second.capture, "result.json")],
        repo,
      );
      assert.equal(bound.receiptId, "REFUTATION-002");
    });
  } finally {
    delete process.env.DOTLN_ENTROPY_FIXTURE;
    for (const repo of fixtureRepositories.splice(0))
      rmSync(entropyScratchLane(repo), { recursive: true, force: true });
    rmSync(parent, { recursive: true, force: true });
  }
}

if (isMainModule(import.meta.url)) {
  try {
    if (!process.argv.includes("--check-only")) await entropyFixtures();
    if (!process.argv.includes("--fixtures-only"))
      process.stdout.write(
        `Entropy gate: ${JSON.stringify(checkEntropyReceipts(toolRoot))}\n`,
      );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
