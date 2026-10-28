#!/usr/bin/env node
import {
  excludeFixtureOwnership,
  createFixtureRoot,
  withTemporaryOwner,
  pruneSessionTemporaryRoots,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { runGit, spawnGit } from "./lib/git.mjs";
import { write, json as prettyJson, sha256Hex } from "./lib/helpers.mjs";
import { isMainModule } from "./lib/paths.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  chmodSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { fileURLToPath } from "node:url";

import {
  buildAttestation,
  checkEntropyReceipts,
  controlLog,
  currentDispatch,
  entropyScratchLane,
  readEntropyControl,
  renderReceipt,
  removeEpisodeScratch,
  runsRoot,
} from "./lib/entropy-review.mjs";
import { main as entropy } from "./entropy.mjs";
import { main as plan } from "./refute-plan.mjs";
import {
  cloneMapPath,
  recordRepositoryClone,
} from "./lib/target-worktrees.mjs";

import { compileReviewerWorkOrder } from "../packages/skeleton/dist/src/loadouts/entropy-reducer.js";
import {
  entropyReviewPrompt,
  ENTROPY_REVIEW_TOOLS,
} from "../packages/skeleton/dist/src/entropy-review-protocol.js";
import { entropyReviewAuthorization } from "../packages/skeleton/dist/src/reactor.js";
import {
  canonicalWorkerArgs,
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../packages/skeleton/dist/src/worker-transport.js";
import {
  FakeEntropyTransport,
  cannedReviewerOutput,
} from "../packages/skeleton/dist/src/entropy-review-fake.js";

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const fixtureGitOptions = {
  maxBuffer: 1024 * 1024,
  onFailure: (result, args) =>
    assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`),
};
const commit = (repo, message) => {
  runGit(repo, ["add", "-A"], fixtureGitOptions);
  runGit(
    repo,
    ["-c", "maintenance.auto=false", "commit", "--quiet", "-m", message],
    fixtureGitOptions,
  );
};

/** A launchpad with this repository's document layout and its own Git history.
 * The fake transport drives the whole family here; nothing launches a model. */
function fixtureRepository(parent) {
  // macOS resolves the temporary root through a symlink; Git reports the real
  // path, and the command refuses a root that is not its own.
  const repo = realpathSync(createFixtureRoot(join(parent, "entropy-")));
  fixtureRepositories.push(repo);
  runGit(repo, ["init", "--quiet", "-b", "main"], fixtureGitOptions);
  excludeFixtureOwnership(repo);
  runGit(
    repo,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  runGit(repo, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(repo, ["config", "commit.gpgsign", "false"], fixtureGitOptions);
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
  write(
    repo,
    ".gitignore",
    "docs/control/local/\nnode_modules/\n.dotln-owner.json\n",
  );
  commit(repo, "fixture subject");
  assert.equal(runGit(repo, ["ls-files", ".dotln-owner.json"]), "");
  return repo;
}

const only = (rows, type) => rows.filter((row) => row.type === type);

/** Every fixture launchpad, so the outer finally can sweep the frozen copies
 * a test that ends mid-dispatch would otherwise leave in system-temp. */
const fixtureRepositories = [];

function registeredTarget(parent, launchpad, id) {
  const home = realpathSync(createFixtureRoot(join(parent, "target-")));
  const origin = join(home, "origin.git"),
    clone = join(home, "clone");
  runGit(
    home,
    ["init", "--bare", "--quiet", "-b", "main", origin],
    fixtureGitOptions,
  );
  runGit(home, ["clone", "--quiet", origin, clone], fixtureGitOptions);
  runGit(clone, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    clone,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  runGit(clone, ["config", "commit.gpgsign", "false"], fixtureGitOptions);
  write(clone, "README.md", `# Target ${id}\n`);
  write(clone, "src/target.mjs", "export const target = 1;\n");
  write(clone, ".gitignore", "node_modules/\n");
  commit(clone, "target base");
  const base = runGit(clone, ["rev-parse", "HEAD"]);
  runGit(clone, ["push", "--quiet", "origin", "main"], fixtureGitOptions);
  write(clone, "local-only.txt", "Not the fetched base.\n");
  commit(clone, "local head differs from fetched base");
  const configPath = join(launchpad, "dotln.config.json");
  const config = existsSync(configPath)
    ? JSON.parse(readFileSync(configPath, "utf8"))
    : {
        version: 1,
        classes: { fixture: { checks: [], supports: [] } },
        repositories: {},
      };
  config.repositories[id] = {
    baseBranch: "main",
    worktreeParent: "../targets",
    repositoryClass: "fixture",
    authorityProfile: {
      authorityEnvelopeId: "fixture.target",
      allowedEffects: ["repo.read", "repo.test"],
      deniedEffects: ["repo.push"],
      resourceLimits: {},
      requiredEvidence: [],
      expiresAt: Number.MAX_SAFE_INTEGER,
      revocationEventTypes: [],
    },
  };
  write(launchpad, "dotln.config.json", prettyJson(config));
  recordRepositoryClone(launchpad, id, clone);
  return { clone, base, head: runGit(clone, ["rev-parse", "HEAD"]) };
}

const fileReview = async (repo) => {
  const pending = currentDispatch(repo, "review");
  const filed = await entropy(
    [
      "receipt",
      join(pending.capture, "result.json"),
      "--statement",
      join(pending.capture, "statement.txt"),
    ],
    repo,
  );
  return JSON.parse(
    readFileSync(join(repo, runsRoot(repo), `${filed.receiptId}.json`), "utf8"),
  );
};
const fileRefutation = async (repo, review) => {
  await entropy(["refute", review, "--transport", "fake"], repo);
  const pending = currentDispatch(repo, "refutation");
  const filed = await entropy(
    ["refutation-receipt", join(pending.capture, "result.json")],
    repo,
  );
  return JSON.parse(
    readFileSync(join(repo, runsRoot(repo), `${filed.receiptId}.json`), "utf8"),
  );
};
const workstream = (
  repo,
  members,
  { root = "docs/workstreams", id = "WS-001" } = {},
) => {
  write(
    repo,
    `${root}/${id}-fixture.md`,
    `# ${id} — Fixture\n\n<!-- dotln-workstream:start -->\n${JSON.stringify({
      id,
      members: members.map((repositoryId, index) => ({
        repositoryId,
        workOrderId: `WO-${String(index + 1).padStart(3, "0")}`,
      })),
      edges: [],
    })}\n<!-- dotln-workstream:end -->\n`,
  );
};

export async function entropyFixtures() {
  const parent = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-entropy-fixtures-")),
  );
  process.env.DOTLN_ENTROPY_FIXTURE = "1";
  try {
    await test("registered subjects freeze the fetched base, bind the id and witness both repositories through review and refutation", async () => {
      const repo = fixtureRepository(parent);
      const target = registeredTarget(parent, repo, "service");
      commit(repo, "register fixture target");
      write(
        target.clone,
        "node_modules/fixture/index.js",
        "module.exports = {};\n",
      );
      write(repo, "README.md", "Dirty launchpad before dispatch.\n");
      const beforeRefs = runGit(target.clone, ["show-ref"]);
      const beforeStatus = runGit(target.clone, [
        "status",
        "--porcelain",
        "--untracked-files=no",
      ]);
      const selected = await entropy(
        ["subject", "--repository", "service"],
        repo,
      );
      assert.equal(selected.baseCommit, target.base);
      assert.notEqual(selected.baseCommit, target.head);
      await entropy(
        ["review", "--repository", "service", "--transport", "fake"],
        repo,
      );
      let pending = currentDispatch(repo, "review");
      rmSync(cloneMapPath(repo));
      assert.equal(
        (await entropy(["subject", "--repository", "service"], repo)).action,
        "finish-pending-dispatch",
      );
      recordRepositoryClone(repo, "service", target.clone);
      const frozen = pending.subject.scratchRepository;
      assert.equal(
        dirname(pending.scratchParent),
        realpathSync(entropyScratchLane(repo)),
      );
      assert.equal(runGit(frozen, ["rev-parse", "HEAD"]), target.base);
      assert.ok(!existsSync(join(frozen, "local-only.txt")));
      assert.ok(existsSync(join(frozen, "node_modules/fixture/index.js")));
      assert.equal(pending.subject.repository, "service");
      assert.equal(
        pending.subject.hash,
        sha256Hex(
          JSON.stringify([
            target.base,
            pending.subject.trackedStatusSha256,
            pending.subject.scratchInventorySha256,
            pending.subject.scratchInventoryCount,
            "service",
          ]),
        ),
      );
      assert.doesNotMatch(
        JSON.stringify(pending.compileInputs.lensBriefs),
        /docs\/product\/|packages\/|corpus\/|docs\/planning\//u,
      );
      for (const brief of pending.compileInputs.lensBriefs)
        for (const scope of brief.files)
          assert.ok(existsSync(join(frozen, scope)), scope);
      const checkCopy = (copy) => {
        assert.equal(runGit(copy, ["remote"]), "");
        assert.notEqual(
          spawnGit(["-C", copy, "push", "origin", "HEAD:refs/heads/escaped"], {
            encoding: "utf8",
          }).status,
          0,
        );
      };
      checkCopy(frozen);
      write(repo, "src/module.mjs", "export const value = 2;\n");
      const review = await fileReview(repo);
      assert.equal(review.subject.repository, "service");
      assert.equal(review.subject.baseCommit, target.base);
      assert.equal(review.subject.scratchRepository, frozen);
      assert.equal(
        review.confinement.launchpad.workingTreeDirtyAtDispatch,
        true,
      );
      assert.equal(
        review.confinement.launchpad.trackedStatusByteIdentical,
        false,
      );
      assert.match(
        renderReceipt(review),
        new RegExp(`service@${target.base}`, "u"),
      );
      assert.ok(
        !JSON.stringify(review).includes(target.clone),
        "source clone path stays in ignored pending state",
      );
      await entropy(["refute", review.receiptId, "--transport", "fake"], repo);
      pending = currentDispatch(repo, "refutation");
      assert.equal(pending.subject.repository, "service");
      assert.equal(
        runGit(pending.subject.scratchRepository, ["rev-parse", "HEAD"]),
        target.base,
      );
      checkCopy(pending.subject.scratchRepository);
      await entropy(
        ["refutation-receipt", join(pending.capture, "result.json")],
        repo,
      );
      const refutation = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REFUTATION-001.json"), "utf8"),
      );
      for (const receipt of [review, refutation]) {
        assert.equal(receipt.subject.repository, "service");
        assert.equal(receipt.subject.baseCommit, target.base);
        assert.equal(receipt.confinement.trackedStatusByteIdentical, true);
        assert.deepEqual(
          receipt.confinement.sourceRefs.before,
          receipt.confinement.sourceRefs.after,
        );
        assert.equal(receipt.confinement.sourceRefs.identical, true);
      }
      assert.equal(runGit(target.clone, ["show-ref"]), beforeRefs);
      assert.equal(
        runGit(target.clone, ["status", "--porcelain", "--untracked-files=no"]),
        beforeStatus,
      );
      assert.equal((await entropy(["check"], repo)).status, "ok");
      assert.equal(
        (await entropy(["subject"], repo)).action,
        "review",
        "a target receipt is not a launchpad subject",
      );
      assert.equal(
        (await entropy(["subject", "--repository", "service"], repo)).action,
        "consume",
      );
      rmSync(cloneMapPath(repo));
      assert.equal(
        (await entropy(["subject", "--repository", "service"], repo)).action,
        "consume",
      );
      assert.equal(
        (
          await entropy(
            ["subject", "--repository", "service", target.base],
            repo,
          )
        ).action,
        "consume",
      );
      recordRepositoryClone(repo, "service", target.clone);
      await entropy(
        [
          "review",
          "--repository",
          "service",
          target.head,
          "--transport",
          "fake",
        ],
        repo,
      );
      assert.equal((await fileReview(repo)).subject.baseCommit, target.head);
    });

    await test("target lenses retain implementation scopes after many documentation files", async () => {
      const repo = fixtureRepository(parent),
        target = registeredTarget(parent, repo, "service");
      for (let index = 1; index <= 32; index++)
        write(
          target.clone,
          `docs/a${String(index).padStart(2, "0")}.md`,
          "# Target guide\n",
        );
      write(
        target.clone,
        "docs/intake/excluded.md",
        "Synthetic intake is excluded from lens scopes.\n",
      );
      commit(target.clone, "target with many documents");
      await entropy(
        ["review", "--repository", "service", "HEAD", "--transport", "fake"],
        repo,
      );
      for (const brief of currentDispatch(repo, "review").compileInputs
        .lensBriefs) {
        assert.ok(brief.files.includes("src/"));
        assert.ok(brief.files.includes("docs/a32.md"));
        assert.ok(
          !brief.files.some((scope) => /intake|^docs\/$/iu.test(scope)),
        );
      }
      await entropy(["discard", "review"], repo);
    });

    await test("target filing binds the original clone and tree, while concurrent target refs and status are recorded", async () => {
      const repo = fixtureRepository(parent),
        target = registeredTarget(parent, repo, "service");
      await entropy(
        ["review", "--repository", "service", "--transport", "fake"],
        repo,
      );
      write(target.clone, "README.md", "Concurrent target edit.\n");
      runGit(target.clone, [
        "update-ref",
        "refs/heads/concurrent",
        target.base,
      ]);
      const review = await fileReview(repo);
      assert.equal(review.confinement.trackedStatusByteIdentical, false);
      assert.equal(review.confinement.sourceRefs.identical, false);
      await entropy(["refute", review.receiptId, "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "refutation");
      rmSync(join(pending.subject.scratchRepository, ".git"), {
        recursive: true,
      });
      await assert.rejects(
        entropy(
          ["refutation-receipt", join(pending.capture, "result.json")],
          repo,
        ),
        /no longer resolves to the tree/u,
      );
      assert.equal(
        existsSync(join(repo, runsRoot(repo), "REFUTATION-001.json")),
        false,
      );
      await entropy(["discard", "refutation"], repo);
      await entropy(
        ["review", "--repository", "service", "--transport", "fake"],
        repo,
      );
      const replacement = registeredTarget(parent, repo, "replacement");
      recordRepositoryClone(repo, "service", replacement.clone);
      await assert.rejects(fileReview(repo), /clone mapping changed/u);
      await entropy(["discard", "review"], repo);
    });

    await test("workstreams dispatch distinct members in order, retain partial dispositions and allocate accepted target findings", async () => {
      const repo = fixtureRepository(parent);
      const first = registeredTarget(parent, repo, "service");
      registeredTarget(parent, repo, "client");
      const config = JSON.parse(
        readFileSync(join(repo, "dotln.config.json"), "utf8"),
      );
      config.roots = { workstreams: "outcomes" };
      write(repo, "dotln.config.json", prettyJson(config));
      workstream(repo, ["service", "service", "client"], { root: "outcomes" });
      write(
        repo,
        "docs/work-orders/WO-001-target.md",
        `# WO-001 — Fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** service @ ${first.base}\n**Workstream:** WS-001\n`,
      );
      commit(repo, "register workstream");
      assert.equal(
        (await entropy(["subject", "--workstream", "WS-001"], repo)).repository,
        "service",
      );
      await entropy(
        ["review", "--workstream", "WS-001", "--transport", "fake"],
        repo,
      );
      const pending = currentDispatch(repo, "review");
      await assert.rejects(
        entropy(
          ["review", "--workstream", "WS-001", "--transport", "fake"],
          repo,
        ),
        /already pending/u,
      );
      assert.equal(
        currentDispatch(repo, "review").scratchParent,
        pending.scratchParent,
      );
      assert.equal(readdirSync(entropyScratchLane(repo)).length, 1);
      const inFlight = await entropy(
        ["subject", "--workstream", "WS-001"],
        repo,
      );
      assert.equal(inFlight.action, "finish-pending-dispatch");
      assert.equal(inFlight.pendingRepository, "service");
      const review = await fileReview(repo);
      assert.equal(
        (await entropy(["subject", "--workstream", "WS-001"], repo)).action,
        "refute",
      );
      await fileRefutation(repo, review.receiptId);
      await entropy(
        [
          "dispose",
          review.receiptId,
          "ER-F01",
          "accept",
          "Fixture accepted target finding.",
        ],
        repo,
      );
      const candidate = readFileSync(
        join(repo, "docs/planning/entropy-reviews/REVIEW-001.md"),
        "utf8",
      );
      assert.ok(candidate.includes(`review REVIEW-001, service@${first.base}`));
      assert.ok(
        candidate.includes(`**ER-F01 — REVIEW-001 service@${first.base}`),
      );
      const feed = await plan(["followups", "--sync"], repo);
      const row = feed.rows.find((item) => item.title.includes("service@"));
      assert.ok(row, JSON.stringify(feed));
      write(
        repo,
        "docs/control/local/allocate.json",
        prettyJson({
          expectedRevision: feed.revision,
          id: row.id,
          sourceRevision: row.sourceRevision,
          status: "allocated",
          reason: "Fixture member order owns the target finding.",
          reopenWhen: "The fixture member order no longer owns the finding.",
          targets: ["WO-001"],
        }),
      );
      assert.equal(
        (
          await plan(
            ["followups", "--apply", "docs/control/local/allocate.json"],
            repo,
          )
        ).status,
        "allocated",
      );
      const consume = await entropy(
        ["subject", "--workstream", "WS-001"],
        repo,
      );
      assert.equal(consume.action, "consume");
      assert.ok(!consume.remaining.includes("ER-F01"));
      for (const id of consume.remaining)
        await entropy(
          ["dispose", review.receiptId, id, "dismiss", "Fixture disposition."],
          repo,
        );
      const next = await entropy(["subject", "--workstream", "WS-001"], repo);
      assert.equal(next.action, "review");
      assert.equal(next.repository, "client");
      await entropy(
        ["review", "--workstream", "WS-001", "--transport", "fake"],
        repo,
      );
      const second = await fileReview(repo);
      assert.equal(second.subject.repository, "client");
      for (const receipt of [review, second]) {
        assert.equal(receipt.workstream.id, "WS-001");
        assert.equal(receipt.workstream.sequence, 1);
        assert.deepEqual(receipt.workstream.repositories, [
          "service",
          "client",
        ]);
      }
      await fileRefutation(repo, second.receiptId);
      const remaining = (
        await entropy(["subject", "--workstream", "WS-001"], repo)
      ).remaining;
      for (const id of remaining)
        await entropy(
          ["dispose", second.receiptId, id, "dismiss", "Fixture disposition."],
          repo,
        );
      assert.equal(
        (await entropy(["subject", "--workstream", "WS-001"], repo)).action,
        "complete",
      );
      assert.equal((await entropy(["check"], repo)).receipts.length, 4);
      await entropy(
        ["review", "--workstream", "WS-001", "--transport", "fake"],
        repo,
      );
      assert.equal(currentDispatch(repo, "review").workstream.sequence, 2);
      await entropy(["discard", "review"], repo);
    });

    await test("workstream self freezes a named launchpad commit after the target receipt, and invalid selectors allocate no copy", async () => {
      const repo = fixtureRepository(parent);
      registeredTarget(parent, repo, "service");
      workstream(repo, ["service", "missing"]);
      for (const args of [
        ["review", "--workstream", "WS-001", "--transport", "fake"],
        ["subject", "--workstream", "WS-001"],
        ["review", "--repository", "missing", "--transport", "fake"],
        ["review", "--repository", "service", "--workstream", "WS-001"],
        ["review", "--workstream", "WS-001", "HEAD"],
        ["subject", "--repository"],
      ])
        await assert.rejects(
          entropy(args, repo),
          /unregistered|entropy review/u,
        );
      assert.ok(!existsSync(entropyScratchLane(repo)));
      workstream(repo, ["service", "self"]);
      commit(repo, "register self workstream");
      const head = runGit(repo, ["rev-parse", "HEAD"]);
      await entropy(
        ["review", "--workstream", "WS-001", "--transport", "fake"],
        repo,
      );
      await fileReview(repo);
      write(repo, "README.md", "Concurrent launchpad work.\n");
      await entropy(
        ["review", "--workstream", "WS-001", "--transport", "fake"],
        repo,
      );
      const self = await fileReview(repo);
      assert.equal(self.subject.repository, ".");
      assert.equal(self.subject.baseCommit, head);
      assert.equal(self.namedRevision, head);
      assert.equal(self.workstream.id, "WS-001");
    });

    await test("clone lookup uses running, primary and main maps and refuses missing mappings before cloning", async () => {
      const primary = fixtureRepository(parent),
        target = registeredTarget(parent, primary, "service");
      commit(primary, "register target");
      const secondary = join(parent, "secondary"),
        main = join(parent, "main-checkout");
      runGit(primary, [
        "worktree",
        "add",
        "--quiet",
        "-b",
        "secondary",
        secondary,
      ]);
      runGit(primary, ["branch", "-m", "retained"]);
      runGit(primary, ["worktree", "add", "--quiet", "-b", "main", main]);
      fixtureRepositories.push(secondary, main);
      assert.equal(
        (await entropy(["subject", "--repository", "service"], secondary))
          .baseCommit,
        target.base,
      );
      const different = registeredTarget(parent, primary, "different");
      recordRepositoryClone(secondary, "service", different.clone);
      assert.equal(
        (await entropy(["subject", "--repository", "service"], secondary))
          .baseCommit,
        different.base,
      );
      rmSync(cloneMapPath(secondary));
      recordRepositoryClone(main, "service", target.clone);
      rmSync(cloneMapPath(primary));
      assert.equal(
        (await entropy(["subject", "--repository", "service"], secondary))
          .baseCommit,
        target.base,
      );
      rmSync(cloneMapPath(main));
      await assert.rejects(
        entropy(
          ["review", "--repository", "service", "--transport", "fake"],
          secondary,
        ),
        /running checkout, the primary checkout.*main-branch worktree/u,
      );
      assert.ok(!existsSync(entropyScratchLane(secondary)));
    });

    await test("WO-177 CLI defaults reach review/refutation arguments and receipt attestations through fake workers", async (t) => {
      const launches = [];
      for (const Transport of [
        ClaudeCliPrintWorkOrderTransport,
        CodexCliExecWorkOrderTransport,
      ]) {
        // Exercise CLI option/default selection and receipt filing, replacing
        // only the model dispatch with the existing synthetic transport.
        t.mock.method(Transport.prototype, "dispatch", function (request, now) {
          launches.push({
            transport: this.name,
            kind: request.kind,
            args: canonicalWorkerArgs(
              this.name,
              request,
              join(request.capture, "schema.json"),
              this.harnessVersion,
            ),
          });
          const dispatched = new FakeEntropyTransport().dispatch(request, now);
          return {
            ...dispatched,
            receipt: dispatched.receipt.then((receipt) => ({
              ...receipt,
              transport: this.name,
            })),
          };
        });
      }
      for (const [transport, model, effort, identity] of [
        ["codex-cli-exec", "gpt-6.1-sol", "max", "substitute reviewer"],
        ["claude-cli-print", "claude-opus-5-5", "xhigh", "entropy-reducer@1"],
      ]) {
        const repo = fixtureRepository(parent);
        const begun = await entropy(["review", "--transport", transport], repo);
        assert.equal(begun.model, model);
        assert.equal(begun.effort, effort);
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
        await entropy(["refute", "REVIEW-001", "--transport", transport], repo);
        const refutation = currentDispatch(repo, "refutation");
        assert.equal(refutation.requestedModel, model);
        assert.equal(refutation.requestedEffort, effort);
        await entropy(
          ["refutation-receipt", join(refutation.capture, "result.json")],
          repo,
        );
        for (const receiptId of ["REVIEW-001", "REFUTATION-001"]) {
          const receipt = JSON.parse(
            readFileSync(
              join(repo, runsRoot(repo), `${receiptId}.json`),
              "utf8",
            ),
          );
          assert.equal(receipt.liveness, "fixture");
          assert.equal(receipt.actorAttestation.model, model);
          assert.equal(receipt.actorAttestation.effort, effort);
          assert.equal(receipt.actorAttestation.identity, identity);
          assert.equal(
            receipt.actorAttestation.source,
            "command-line-readback-and-invocation",
          );
          assert.equal(receipt.actorAttestation.effectiveModel, "unknown");
          assert.equal(receipt.actorAttestation.effectiveEffort, "unknown");
        }
        const selected = launches.filter(
          (launch) => launch.transport === transport,
        );
        assert.deepEqual(
          selected.map((launch) => launch.kind),
          ["entropy-review", "entropy-refutation"],
        );
        for (const { args } of selected) {
          assert.equal(args[args.indexOf("--model") + 1], model);
          if (transport === "claude-cli-print")
            assert.equal(args[args.indexOf("--effort") + 1], effort);
          else assert.ok(args.includes(`model_reasoning_effort="${effort}"`));
        }
      }
    });

    await test("WO-160 subject skips pre-mechanism receipts and check retains their bytes", async () => {
      const repo = fixtureRepository(parent);
      for (const name of ["REVIEW-001", "REFUTATION-001"]) {
        write(
          repo,
          `${runsRoot(repo)}/${name}.json`,
          JSON.stringify({
            schemaVersion: 1,
            kind: name.startsWith("REVIEW")
              ? "EntropyReducerReviewRun"
              : "EntropyReducerRefutationRun",
          }) + "\n",
        );
        write(
          repo,
          `${runsRoot(repo)}/${name}.md`,
          "Historical receipt bytes.\n",
        );
      }
      commit(repo, "pre-mechanism pair");
      const before = runGit(repo, ["status", "--porcelain"], fixtureGitOptions);
      const subject = await entropy(["subject"], repo);
      assert.equal(subject.action, "review");
      assert.ok(!JSON.stringify(subject).includes("undefined"));
      assert.deepEqual(checkEntropyReceipts(repo).preMechanism, [
        "REFUTATION-001",
        "REVIEW-001",
      ]);
      assert.equal(
        runGit(repo, ["status", "--porcelain"], fixtureGitOptions),
        before,
      );
    });

    await test("historical absolute launchpad subjects keep their rendering, refutation and consumption", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const review = await fileReview(repo);
      const historical = structuredClone(review);
      historical.subject.repository = "/fixture/historical-launchpad";
      assert.equal(
        renderReceipt(historical),
        renderReceipt(review),
        "an old absolute launchpad path does not add target subject details",
      );

      // Build a synthetic historical pair and its matching control event.
      // No committed receipt is rewritten or used as a fixture input.
      const { receiptHash: priorHash, ...body } = historical;
      assert.equal(priorHash, review.receiptHash);
      historical.receiptHash = `sha256:${sha256Hex(JSON.stringify(body))}`;
      const rendered = renderReceipt(historical);
      write(
        repo,
        `${runsRoot(repo)}/${review.receiptId}.json`,
        prettyJson(historical),
      );
      write(repo, `${runsRoot(repo)}/${review.receiptId}.md`, rendered);
      const events = readEntropyControl(repo);
      events[0].receiptHash = historical.receiptHash;
      events[0].renderedHash = `sha256:${sha256Hex(rendered)}`;
      write(
        repo,
        controlLog(repo),
        events.map((event) => JSON.stringify(event)).join("\n") + "\n",
      );
      assert.equal(checkEntropyReceipts(repo).status, "ok");
      const next = await entropy(["subject", "--repository", "self"], repo);
      assert.equal(next.action, "refute");
      assert.equal(next.repository, ".");

      await entropy(["refute", review.receiptId, "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "refutation");
      const pendingSubject = await entropy(
        ["subject", "--repository", "self"],
        repo,
      );
      assert.equal(pendingSubject.action, "finish-pending-dispatch");
      assert.equal(pendingSubject.pendingRepository, ".");
      const filed = await entropy(
        ["refutation-receipt", join(pending.capture, "result.json")],
        repo,
      );
      const refutation = JSON.parse(
        readFileSync(
          join(repo, runsRoot(repo), `${filed.receiptId}.json`),
          "utf8",
        ),
      );
      assert.equal(
        refutation.subject.repository,
        historical.subject.repository,
        "refutation retains the recorded subject while freezing this launchpad",
      );
      assert.equal(
        renderReceipt(refutation),
        renderReceipt({
          ...refutation,
          subject: { ...refutation.subject, repository: "." },
        }),
      );
      assert.equal(checkEntropyReceipts(repo).status, "ok");
      assert.equal((await entropy(["subject"], repo)).action, "consume");
      const selected = await entropy(["subject", "--repository", "self"], repo);
      assert.equal(selected.action, "consume");
      assert.equal(selected.repository, ".");
      const accepted = await entropy(
        [
          "dispose",
          review.receiptId,
          refutation.report.promotedFindingIds[0],
          "accept",
          "The historical launchpad finding remains actionable.",
        ],
        repo,
      );
      const candidate = readFileSync(join(repo, accepted.candidate), "utf8");
      assert.doesNotMatch(candidate, /historical-launchpad|self@/u);
    });

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
      // The subject repository is written relative; the hash never covered it.
      const reviewed = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      ).subject;
      assert.equal(reviewed.repository, ".");
      assert.equal(
        reviewed.hash,
        sha256Hex(
          JSON.stringify([
            reviewed.baseCommit,
            reviewed.trackedStatusSha256,
            reviewed.scratchInventorySha256,
            reviewed.scratchInventoryCount,
          ]),
        ),
      );
      assert.equal(reviewed.hash, begun.subjectHash);
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
        runGit(repo, ["rev-parse", "HEAD"], fixtureGitOptions),
      );
      assert.equal(receipt.compilation.compileInputs.route, "fake");
      assert.equal(
        receipt.compilation.executionBoundary.deferredProgramKind,
        null,
      );
      assert.match(
        renderReceipt(receipt),
        /lenses worked serially by the reviewer/u,
      );
      assert.doesNotMatch(renderReceipt(receipt), /deferred Program kind All/u);
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
      assert.equal(refutationPending.compileInputs.route, "fake");
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
      assert.equal(
        JSON.parse(
          readFileSync(
            join(repo, runsRoot(repo), "REFUTATION-001.json"),
            "utf8",
          ),
        ).subject.repository,
        ".",
        "a refutation's subject repository is relative too",
      );
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

    await test("WO-175 fake review/refutation receive the requested temporary directory, inventory it and remove read-only trees", async () => {
      const repo = fixtureRepository(parent);
      const inherited = process.env.TMPDIR;
      await entropy(["review", "--transport", "fake"], repo);
      const review = currentDispatch(repo, "review");
      const checkLaunch = (pending, kind) => {
        assert.equal(
          dirname(pending.temporaryDirectory),
          pending.scratchParent,
        );
        assert.notEqual(
          pending.temporaryDirectory,
          pending.subject.scratchRepository,
        );
        assert.ok(
          !pending.temporaryDirectory.startsWith(
            `${pending.subject.scratchRepository}/`,
          ),
        );
        const received = JSON.parse(
          readFileSync(
            join(pending.temporaryDirectory, "worker-environment.json"),
            "utf8",
          ),
        );
        assert.equal(
          received.requestedTemporaryDirectory,
          pending.temporaryDirectory,
        );
        assert.ok(
          !("TMPDIR" in received),
          "the fake witness makes no environment observation",
        );
        assert.equal(received.kind, kind);
        assert.ok(
          received.outputInstructions.startsWith(
            "The episode temporary directory is ",
          ),
        );
        assert.ok(
          received.outputInstructions.includes(
            kind === "entropy-review" ? "roots. Run one" : "roots. Attempt to",
          ),
        );
        assert.doesNotMatch(received.outputInstructions, /roots\.\s{2}|^\s/u);
        assert.equal(process.env.TMPDIR, inherited);
      };
      checkLaunch(review, "entropy-review");
      write(review.temporaryDirectory, "readonly/nested/evidence.txt", "12345");
      chmodSync(join(review.temporaryDirectory, "readonly/nested"), 0o500);
      chmodSync(join(review.temporaryDirectory, "readonly"), 0o500);
      await entropy(
        [
          "receipt",
          join(review.capture, "result.json"),
          "--statement",
          join(review.capture, "statement.txt"),
        ],
        repo,
      );
      assert.ok(!existsSync(review.scratchParent));
      const recorded = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REVIEW-001.json"), "utf8"),
      );
      assert.equal(recorded.confinement.temporaryDirectory.count, 2);
      assert.ok(recorded.confinement.temporaryDirectory.bytes > 5);
      assert.match(
        renderReceipt(recorded),
        /Episode temporary directory: 2 path\(s\), \d+ bytes/,
      );
      const historical = structuredClone(recorded);
      delete historical.confinement.temporaryDirectory;
      const before = renderReceipt(historical);
      assert.doesNotMatch(before, /Episode temporary directory/);
      assert.equal(renderReceipt(historical), before);
      await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
      const refutation = currentDispatch(repo, "refutation");
      checkLaunch(refutation, "entropy-refutation");
      write(
        refutation.temporaryDirectory,
        "readonly/nested/evidence.txt",
        "12345",
      );
      chmodSync(join(refutation.temporaryDirectory, "readonly/nested"), 0o500);
      await entropy(
        ["refutation-receipt", join(refutation.capture, "result.json")],
        repo,
      );
      assert.ok(!existsSync(refutation.scratchParent));
      const filed = JSON.parse(
        readFileSync(join(repo, runsRoot(repo), "REFUTATION-001.json"), "utf8"),
      );
      assert.equal(filed.confinement.temporaryDirectory.count, 2);
      assert.match(
        renderReceipt(filed),
        /Episode temporary directory: 2 path\(s\), \d+ bytes/,
      );
      const leftover = createFixtureRoot(join(parent, "cleanup-failure-"));
      const warnings = [];
      assert.equal(
        removeEpisodeScratch(leftover, {
          remove: () => {
            const error = new Error("fixture");
            error.code = "ENOTEMPTY";
            throw error;
          },
          warn: (line) => warnings.push(line),
        }),
        false,
      );
      assert.equal(warnings.length, 1);
      assert.match(
        warnings[0],
        new RegExp(`Receipt filed; scratch cleanup left ${leftover}`),
      );
      assert.equal(process.env.TMPDIR, inherited);
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
      for (const status of ["blocked", "failed", "completed"]) {
        const rendered = renderReceipt({
          ...receipt,
          reviewerOutput: {
            ...receipt.reviewerOutput,
            resultEnvelope: {
              ...receipt.reviewerOutput.resultEnvelope,
              status,
            },
          },
        });
        assert.match(
          rendered,
          /Compiled review confinement \(execution rule\): lenses worked serially by the reviewer/u,
        );
        assert.ok(
          rendered.includes(
            `Checklist completion is not independently observed; worker result: ${status}.`,
          ),
        );
        assert.doesNotMatch(
          rendered,
          /(?:^|\n)Review confinement: lenses worked/gu,
        );
      }
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
      const head = runGit(repo, ["rev-parse", "HEAD"], fixtureGitOptions);
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

    await test("frozen review and refutation copies have no remote route to their fixture source", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      for (const kind of ["review", "refutation"]) {
        if (kind === "refutation")
          await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
        const pending = currentDispatch(repo, kind);
        const copy = pending.subject.scratchRepository;
        const before = runGit(repo, ["for-each-ref"], fixtureGitOptions);
        assert.equal(runGit(copy, ["remote"], fixtureGitOptions), "");
        // There is no remote, and this source is itself a disposable fixture.
        const pushed = spawnGit(
          ["-C", copy, "push", "origin", "HEAD:refs/heads/from-frozen-copy"],
          { encoding: "utf8" },
        );
        assert.notEqual(pushed.status, 0);
        assert.equal(runGit(repo, ["for-each-ref"], fixtureGitOptions), before);
        const filed = await entropy(
          [
            kind === "review" ? "receipt" : "refutation-receipt",
            join(pending.capture, "result.json"),
            "--statement",
            join(pending.capture, "statement.txt"),
          ],
          repo,
        );
        const receipt = JSON.parse(
          readFileSync(
            join(repo, runsRoot(repo), `${filed.receiptId}.json`),
            "utf8",
          ),
        );
        assert.equal(receipt.confinement.sourceRefs.identical, true);
        assert.equal(
          receipt.confinement.sourceRefs.before.sha256,
          receipt.confinement.sourceRefs.after.sha256,
        );
        const historical = structuredClone(receipt);
        delete historical.confinement.sourceRefs;
        const oldRendering = renderReceipt(historical);
        assert.doesNotMatch(oldRendering, /Source refs unchanged:/u);
        const refs = receipt.confinement.sourceRefs;
        const sentence = ` Source refs unchanged: **true** (${refs.before.count} before, ${refs.after.count} after; refused for a HEAD subject, recorded for a named commit).`;
        assert.equal(
          renderReceipt(receipt),
          oldRendering.replace(
            " Ignored paths and file contents",
            sentence + " Ignored paths and file contents",
          ),
        );
      }
      assert.equal(checkEntropyReceipts(repo).status, "ok");
    });

    await test("a HEAD review refuses a source-ref move even when tracked status stays identical", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      runGit(
        repo,
        ["branch", "concurrent-source-ref", "HEAD"],
        fixtureGitOptions,
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
        /source refs changed during the review episode/u,
      );
      assert.equal(
        existsSync(join(repo, runsRoot(repo), "REVIEW-001.json")),
        false,
      );
      assert.ok(
        currentDispatch(repo, "review"),
        "the rejected pending episode remains available",
      );
    });

    await test("named-commit reviews and refutations record concurrent source-ref moves without refusing", async () => {
      const repo = fixtureRepository(parent);
      const head = runGit(repo, ["rev-parse", "HEAD"], fixtureGitOptions);
      await entropy(["review", head, "--transport", "fake"], repo);
      for (const kind of ["review", "refutation"]) {
        if (kind === "refutation")
          await entropy(["refute", "REVIEW-001", "--transport", "fake"], repo);
        const pending = currentDispatch(repo, kind);
        runGit(
          repo,
          ["branch", `concurrent-${kind}-ref`, "HEAD"],
          fixtureGitOptions,
        );
        const filed = await entropy(
          [
            kind === "review" ? "receipt" : "refutation-receipt",
            join(pending.capture, "result.json"),
            "--statement",
            join(pending.capture, "statement.txt"),
          ],
          repo,
        );
        const receipt = JSON.parse(
          readFileSync(
            join(repo, runsRoot(repo), `${filed.receiptId}.json`),
            "utf8",
          ),
        );
        const witness = receipt.confinement.sourceRefs;
        assert.ok(
          witness,
          "each explicit-commit episode records its source-ref witness",
        );
        assert.equal(witness.identical, false);
        assert.notEqual(witness.before.sha256, witness.after.sha256);
        assert.equal(witness.after.count, witness.before.count + 1);
        assert.equal(receipt.confinement.trackedStatusByteIdentical, true);
        assert.match(
          renderReceipt(receipt),
          /Source refs unchanged: \*\*false\*\*/u,
        );
      }
      assert.equal(checkEntropyReceipts(repo).status, "ok");
    });

    await test("the explicit route binds the named commit, not the working tree", async () => {
      const repo = fixtureRepository(parent);
      const head = runGit(repo, ["rev-parse", "HEAD"], fixtureGitOptions);
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
      // The delta is the added, removed and resized path sets (WO-157 item 9).
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
      const session = "entropy-pending-and-diagnosis";
      const owner = {
        repository: repo,
        session: sha256Hex(session),
        pid: 2147483647,
        birth: "exited-fixture-host",
        gateId: undefined,
        suite: undefined,
      };
      await withTemporaryOwner(owner, () => entropy(["review"], repo));
      const pending = currentDispatch(repo, "review");
      pruneSessionTemporaryRoots(repo, session, { dispatchEnded: true });
      assert.ok(existsSync(pending.subject.scratchRepository));
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
        withTemporaryOwner(owner, () =>
          entropy(
            [
              "receipt",
              join(pending.capture, "result.json"),
              "--statement",
              join(pending.capture, "statement.txt"),
            ],
            repo,
          ),
        ),
        /rejected result and statement retained at/u,
      );
      const lane = join(repo, "docs/control/local/entropy/rejected");
      assert.ok(existsSync(lane) && readdirSync(lane).length === 1);
      const retained = join(lane, readdirSync(lane)[0]);
      pruneSessionTemporaryRoots(repo, session, { dispatchEnded: true });
      assert.equal(
        readFileSync(join(retained, "statement.txt"), "utf8"),
        "Fixture statement.",
      );
      await entropy(["discard", "review"], repo);
      assert.equal(existsSync(pending.scratchParent), false);
      assert.ok(existsSync(join(retained, "result.json")));
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
      writeFileSync(jsonPath, prettyJson(edited));
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
      assert.equal((await entropy(["subject"], repo)).action, "review");
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

    await test("WO-165 pinned routes agree on authority, serial checklist, transport tools and receipt", async () => {
      const repo = fixtureRepository(parent);
      await entropy(["review", "--transport", "fake"], repo);
      const pending = currentDispatch(repo, "review");
      // File one real fake-transport receipt, then render each route's compiled
      // metadata with it. Neither CLI route is launched by this fixture.
      const routeCompilations = [];
      for (const route of ["claude-cli-print", "codex-cli-exec"]) {
        const compiled = compileReviewerWorkOrder({
          ...pending.compileInputs,
          route,
        });
        routeCompilations.push(compiled);
        assert.deepEqual(compiled.authorityEnvelope.resourceLimits, {
          probes: 32,
        });
        assert.ok(
          !compiled.authorityEnvelope.allowedEffects.some((effect) =>
            effect.startsWith("delegate"),
          ),
        );
        assert.ok(
          !compiled.workOrder.allowedOperations.some((effect) =>
            effect.startsWith("delegate"),
          ),
        );
        assert.doesNotMatch(
          compiled.residue,
          /delegat|fan-?out|Program\.All/iu,
        );
        assert.equal(compiled.program.programs[1].kind, "Sequence");
        assert.ok(
          compiled.program.programs[1].programs.every(
            (item) =>
              item.command.effect === "repo.read.lens" &&
              item.command.resource === undefined,
          ),
        );
        const grant = entropyReviewAuthorization(
          compiled.authorityEnvelope,
          pending.subject.hash,
          pending.episodeId,
          "census",
          pending.compileInputs.dispatchedAt,
        );
        assert.equal(grant.authorized, true);
        const request = {
          kind: "entropy-review",
          command: grant.command,
          workOrder: compiled.workOrder,
          subject: pending.subject,
          episodeId: pending.episodeId,
          model: "fixture-model",
          effort: "xhigh",
          cwd: pending.subject.scratchRepository,
          temporaryDirectory: pending.temporaryDirectory,
          capture: pending.capture,
          residue: compiled.residue,
          lensBriefs: compiled.lensBriefs,
          concern: null,
          profile: {
            profileId: "entropy-review-v1",
            modelTools: [...ENTROPY_REVIEW_TOOLS],
          },
        };
        const prompt = JSON.parse(entropyReviewPrompt(request));
        const inherited = process.env.TMPDIR;
        const probe = join(
          pending.temporaryDirectory,
          `real-child-${route}.json`,
        );
        const returned = cannedReviewerOutput(request);
        const stdout =
          route === "claude-cli-print"
            ? JSON.stringify({
                type: "result",
                subtype: "success",
                is_error: false,
                structured_output: returned,
              })
            : JSON.stringify({
                type: "item.completed",
                item: { type: "agent_message", text: JSON.stringify(returned) },
              }) +
              "\n" +
              JSON.stringify({ type: "turn.completed" });
        const Transport =
          route === "claude-cli-print"
            ? ClaudeCliPrintWorkOrderTransport
            : CodexCliExecWorkOrderTransport;
        const real = new Transport(
          (launch) => {
            assert.equal(
              process.env.TMPDIR,
              inherited,
              "parent TMPDIR during transport dispatch",
            );
            return runWorkerProcess({
              ...launch,
              binary: process.execPath,
              args: [
                "-e",
                `const fs=require('node:fs'); fs.writeFileSync(${JSON.stringify(probe)},JSON.stringify({TMPDIR:process.env.TMPDIR,names:fs.readdirSync(process.env.TMPDIR),hostHome:process.env.CODEX_HOME??null})); process.stdout.write(${JSON.stringify(stdout)});`,
              ],
            });
          },
          route === "claude-cli-print" ? "2.1.270" : "0.154.0",
        );
        const launched = real.dispatch(request, () => 100);
        assert.equal(process.env.TMPDIR, inherited);
        await launched.completed;
        const child = JSON.parse(readFileSync(probe, "utf8"));
        assert.equal(child.TMPDIR, pending.temporaryDirectory);
        assert.ok(
          child.names.every(
            (name) =>
              !/^dotln-(?:worker-(?:schema|output)|codex-home)-/u.test(name),
          ),
        );
        if (child.hostHome)
          assert.ok(
            !child.hostHome.startsWith(`${pending.temporaryDirectory}/`),
          );
        assert.equal(process.env.TMPDIR, inherited);
        for (const brief of compiled.lensBriefs) {
          assert.ok(prompt.residue.includes(`- [ ] ${brief.lensId}`));
          for (const value of [
            ...brief.files,
            ...brief.questions,
            ...brief.outputShape,
          ])
            assert.ok(prompt.residue.includes(value));
          assert.ok(
            prompt.residue.includes(
              `Word budget: ${brief.wordBudget}. No-fix: true.`,
            ),
          );
        }
        assert.throws(
          () => entropyReviewPrompt({ ...request, lensBriefs: [] }),
          /lens briefs/u,
        );
        const args = canonicalWorkerArgs(
          route,
          request,
          join(pending.capture, "schema.json"),
        );
        if (route === "claude-cli-print") {
          assert.equal(
            args[args.indexOf("--tools") + 1],
            "Bash,Read,Glob,Grep",
          );
          assert.equal(
            args[args.indexOf("--allowedTools") + 1],
            "Bash,Read,Glob,Grep",
          );
        } else {
          const disabled = args.flatMap((arg, index) =>
            arg === "--disable" ? [args[index + 1]] : [],
          );
          assert.ok(disabled.includes("multi_agent"));
          assert.ok(disabled.includes("multi_agent_v2"));
          // The confinement here is Codex's workspace-write sandbox; a named
          // profile beside --sandbox would be overridden, so none is passed.
          assert.equal(args[args.indexOf("--sandbox") + 1], "workspace-write");
          assert.ok(
            !args.some((arg) => /^(?:default_)?permissions/u.test(arg)),
          );
        }
      }
      assert.throws(
        () =>
          compileReviewerWorkOrder({
            ...pending.compileInputs,
            route: "unknown-route",
          }),
        /unsupported entropy review route/u,
      );
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
      for (const compiled of routeCompilations) {
        const rendered = renderReceipt({
          ...receipt,
          compilation: {
            ...receipt.compilation,
            compileInputs: compiled.compileInputs,
            semanticHash: compiled.semanticHash,
            executionBoundary: compiled.executionBoundary,
          },
        });
        assert.match(
          rendered,
          /lenses worked serially by the reviewer; no delegate grant or delegate resource limit/u,
        );
        assert.doesNotMatch(rendered, /deferred Program kind All/u);
      }
      assert.equal(checkEntropyReceipts(repo).status, "ok");
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
      assert.match(
        begun.prompt.outputInstructions,
        /supplied as TMPDIR; it is the only other writable root/,
      );
      assert.equal(
        begun.prompt.temporaryDirectory,
        currentDispatch(repo, "review").temporaryDirectory,
      );
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
