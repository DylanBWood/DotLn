import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { decodeLog, encodeLog, type JsonValue } from "@dotln/kernel";
import { SourceChangeHost } from "../src/source-change-host.js";
import { sourceDigest } from "../src/source-change-worktree.js";
import { writerSandboxProfilePath } from "../src/discovery-sandbox.js";
import {
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
  type TransportDispatch,
  type WorkOrderTransport,
} from "../src/worker-transport.js";
import type { WriterRequest, WriterResult } from "../src/worker-protocol.js";
import {
  createSourceFixture,
  sourceFixtureOptions,
  fixtureGit as git,
} from "./source-change-fixture.js";

const logPath = (root: string) => join(root, "store/events.jsonl");
const events = (root: string) => decodeLog(readFileSync(logPath(root), "utf8"));
const dispose = (root: string) =>
  rmSync(root, { recursive: true, force: true });

// Synthetic SHA-1 commit-graph corruption using Git's documented CDAT format.
// Recompute the checksum so the host cannot rely on a malformed-file warning.
const forgeGraph = (
  file: string,
  commit: string,
  change: { tree: string } | { parent: string },
) => {
  const bytes = readFileSync(file);
  assert.equal(bytes.toString("ascii", 0, 4), "CGPH");
  assert.equal(bytes[5], 1);
  const chunks = new Map<string, number>();
  for (let i = 0; i < bytes[6]!; i++) {
    const at = 8 + i * 12;
    chunks.set(
      bytes.toString("ascii", at, at + 4),
      Number(bytes.readBigUInt64BE(at + 4)),
    );
  }
  const oidl = chunks.get("OIDL")!,
    cdat = chunks.get("CDAT")!,
    count = bytes.readUInt32BE(chunks.get("OIDF")! + 255 * 4);
  const position = (oid: string) => {
    for (let i = 0; i < count; i++)
      if (bytes.toString("hex", oidl + i * 20, oidl + (i + 1) * 20) === oid)
        return i;
    throw new Error("synthetic commit missing from graph");
  };
  const at = cdat + position(commit) * 36;
  if ("tree" in change) Buffer.from(change.tree, "hex").copy(bytes, at);
  else {
    const parent = position(change.parent);
    bytes.writeUInt32BE(parent, at + 20);
    // Keep generation-v1 levels consistent with the forged ancestry edge.
    assert.equal(chunks.has("GDA2"), false);
    const parentLevel = bytes.readUInt32BE(cdat + parent * 36 + 28) >>> 2;
    bytes.writeUInt32BE(
      (parentLevel + 1) * 4 + (bytes.readUInt32BE(at + 28) & 3),
      at + 28,
    );
  }
  createHash("sha1")
    .update(bytes.subarray(0, -20))
    .digest()
    .copy(bytes, bytes.length - 20);
  chmodSync(file, 0o644);
  writeFileSync(file, bytes);
};

test("WO-112 VER-003 F1 admission ignores forged commit-graph trees and parents", async () => {
  for (const changed of ["tree", "parent"]) {
    const root = createSourceFixture();
    try {
      const options = sourceFixtureOptions(root, () => 10);
      // Local configuration must not opt the host back into the forged cache.
      git(options.workOrder.repo, "config", "core.commitGraph", "true");
      const transport: WorkOrderTransport<WriterRequest> = {
        name: options.transport.name,
        harnessVersion: options.transport.harnessVersion,
        dispatch(request, now) {
          const pending = options.transport.dispatch(request, now);
          return {
            ...pending,
            completed: pending.completed.then((result) => {
              const tree = git(request.cwd, "rev-parse", "HEAD^{tree}"),
                base = options.workOrder.baseCommit;
              let realTree = tree;
              if (changed === "tree") {
                const outside = join(root, "outside-test.txt");
                writeFileSync(outside, "// outside the admitted surface\n");
                const blob = git(request.cwd, "hash-object", "-w", outside);
                const listing = git(request.cwd, "ls-tree", tree)
                  .split("\n")
                  .map((line) =>
                    line.endsWith("\tfixture-test.mjs")
                      ? line.replace(/blob [0-9a-f]{40}/u, `blob ${blob}`)
                      : line,
                  )
                  .join("\n");
                const made = spawnSync("git", ["mktree"], {
                  cwd: request.cwd,
                  input: `${listing}\n`,
                  encoding: "utf8",
                });
                assert.equal(made.status, 0, made.stderr);
                realTree = made.stdout.trim();
              }
              const forged = git(
                request.cwd,
                "commit-tree",
                realTree,
                ...(changed === "tree" ? ["-p", base] : []),
                "-F",
                request.commitMessagePath,
              );
              git(request.cwd, "update-ref", "HEAD", forged);
              git(
                request.cwd,
                "-c",
                "commitGraph.generationVersion=1",
                "commit-graph",
                "write",
                "--reachable",
              );
              forgeGraph(
                join(options.workOrder.repo, ".git/objects/info/commit-graph"),
                forged,
                changed === "tree" ? { tree } : { parent: base },
              );
              // Establish that the planted cache really changes Git's answer.
              if (changed === "tree") {
                assert.equal(
                  git(request.cwd, "diff", "--name-only", base, forged),
                  "fixture.txt",
                );
                assert.equal(
                  git(
                    request.cwd,
                    "-c",
                    "core.commitGraph=false",
                    "diff",
                    "--name-only",
                    base,
                    forged,
                  ),
                  "fixture-test.mjs\nfixture.txt",
                );
              } else {
                const ancestry = (cache: boolean) =>
                  spawnSync(
                    "git",
                    [
                      "-c",
                      `core.commitGraph=${cache}`,
                      "merge-base",
                      "--is-ancestor",
                      base,
                      forged,
                    ],
                    { cwd: request.cwd, encoding: "utf8" },
                  ).status;
                assert.equal(
                  ancestry(true),
                  0,
                  "forged parent invents ancestry",
                );
                assert.equal(
                  ancestry(false),
                  1,
                  "real commit is an unrelated root",
                );
              }
              return {
                ...result,
                envelope: {
                  ...result.envelope,
                  observedCommit: { sha: forged, branch: options.branch },
                },
              };
            }),
          };
        },
      };
      await assert.rejects(
        () => new SourceChangeHost({ ...options, transport }).run(),
        changed === "tree"
          ? /committed tree is dirty|outside the declared surfaces/u
          : /merge-base --is-ancestor/u,
      );
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
      assert.ok(
        events(root)
          .filter((event) => event.type === "SourceChangeIntegrityChecked")
          .every(
            (event) =>
              (event.payload as { outcome: string }).outcome === "unchanged",
          ),
      );
    } finally {
      dispose(root);
    }
  }
});

test("WO-112 VER-003 F2 persisted receipt recovery ignores later unrelated shared-ref changes", async () => {
  for (const later of ["tag", "remote-ref", "deleted-tag", "symbolic-ref"]) {
    const root = createSourceFixture();
    try {
      const repo = join(root, "target");
      git(repo, "tag", "retired-tag");
      git(repo, "branch", "independent");
      git(repo, "symbolic-ref", "refs/heads/alias", "refs/heads/main");
      const script = `
        import {SourceChangeHost} from ${JSON.stringify(new URL("../src/source-change-host.js", import.meta.url).href)};
        import {sourceFixtureOptions} from ${JSON.stringify(new URL("./source-change-fixture.js", import.meta.url).href)};
        await new SourceChangeHost({...sourceFixtureOptions(process.argv[1], () => 10),
          afterReceiptSaved() { process.kill(process.pid, 'SIGKILL'); }
        }).run();`;
      const killed = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", script, root],
        {
          encoding: "utf8",
          timeout: 30_000,
        },
      );
      assert.equal(killed.signal, "SIGKILL", killed.stderr);
      const atKill = events(root);
      assert.equal(
        atKill.some((event) => event.type === "SourceChangeObserved"),
        false,
      );
      const checks = atKill.filter(
        (event) => event.type === "SourceChangeIntegrityChecked",
      );
      assert.equal(checks.length, 2);
      assert.ok(
        checks.every(
          (event) =>
            (event.payload as { outcome: string }).outcome === "unchanged",
        ),
      );
      const receiptFile = readdirSync(join(root, "store")).find((name) =>
        name.endsWith(".source-change.json"),
      )!;
      const saved = JSON.parse(
        readFileSync(join(root, "store", receiptFile), "utf8"),
      );
      if (later === "tag") git(repo, "tag", "unrelated-later-tag");
      else if (later === "remote-ref")
        git(
          repo,
          "update-ref",
          "refs/remotes/origin/main",
          git(repo, "rev-parse", "main"),
        );
      else if (later === "deleted-tag") git(repo, "tag", "-d", "retired-tag");
      else
        git(repo, "symbolic-ref", "refs/heads/alias", "refs/heads/independent");
      const shared = new SourceChangeHost(
        sourceFixtureOptions(root, () => 6_000),
      ).tree.sharedState();
      const host = new SourceChangeHost(
        sourceFixtureOptions(root, () => 6_000),
      );
      assert.deepEqual(await host.run(), {
        status: "observed",
        observation: saved.observation,
      });
      assert.deepEqual(await host.run(), {
        status: "observed",
        observation: saved.observation,
      });
      assert.equal(
        events(root).filter((event) => event.type === "SourceChangeObserved")
          .length,
        1,
      );
      assert.equal(
        events(root).filter(
          (event) => event.type === "SourceChangeIntegrityChecked",
        ).length,
        2,
      );
      assert.equal(
        readFileSync(join(root, "launches.txt"), "utf8").trim().split("\n")
          .length,
        1,
      );
      assert.deepEqual(host.tree.sharedState(), shared);
      host.finish();
    } finally {
      dispose(root);
    }
  }
});

test("WO-112 VER-003 F2 a persisted receipt cannot accept a changed candidate", async () => {
  const root = createSourceFixture();
  try {
    await assert.rejects(
      () =>
        new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10),
          afterReceiptSaved() {
            throw new Error("synthetic crash after receipt");
          },
        }).run(),
      /synthetic crash/u,
    );
    const repo = join(root, "target");
    git(
      repo,
      "update-ref",
      "refs/heads/source-fixture",
      git(repo, "rev-parse", "main"),
    );
    git(repo, "tag", "unrelated-later-tag");
    await assert.rejects(
      () => new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
      /saved effect no longer matches Git/u,
    );
    assert.equal(
      events(root).some((event) => event.type === "SourceChangeObserved"),
      false,
    );
    assert.equal(
      readFileSync(join(root, "launches.txt"), "utf8").trim().split("\n")
        .length,
      1,
    );
    assert.equal(
      git(repo, "tag", "--list", "unrelated-later-tag"),
      "unrelated-later-tag",
    );
  } finally {
    dispose(root);
  }
});

// Construct the admitted pre-integrity-marker shape from a real host run.
// No old binary is executed; the receipt bytes themselves remain unchanged.
const legacySourceLog = (root: string, keepTermination = false) => {
  const legacy = events(root)
    .filter(
      (event) =>
        ![
          ...(!keepTermination
            ? ["SourceChangeProcessStarted", "SourceChangeProcessStopped"]
            : []),
          "SourceChangeIntegrityChecked",
          "WorkerInterrupted",
        ].includes(event.type),
    )
    .map((event, index) => {
      const { sharedState: _sharedState, ...payload } = event.payload as Record<
        string,
        JsonValue
      >;
      return { ...event, eventId: `evt_${index + 1}`, payload };
    });
  writeFileSync(logPath(root), encodeLog(legacy));
  assert.deepEqual(events(root), legacy);
};
const receiptPath = (root: string) =>
  join(
    root,
    "store",
    readdirSync(join(root, "store")).find((name) =>
      name.endsWith(".source-change.json"),
    )!,
  );

test("WO-112 VER-006 F2 a matching accepted older receipt replays once without new process markers or redispatch", async () => {
  const root = createSourceFixture();
  try {
    await assert.rejects(
      () =>
        new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10),
          afterReceiptSaved() {
            throw new Error("synthetic receipt stop");
          },
        }).run(),
      /synthetic receipt stop/u,
    );
    const file = receiptPath(root);
    const bytes = readFileSync(file, "utf8");
    const saved = JSON.parse(bytes);
    legacySourceLog(root);
    git(join(root, "target"), "tag", "independent-later-tag");
    const host = new SourceChangeHost(sourceFixtureOptions(root, () => 6_000));
    assert.deepEqual(host.tree.effect(), {
      commit: saved.observation.commit,
      diffHash: saved.observation.diffHash,
    });
    for (let i = 0; i < 2; i++)
      assert.deepEqual(await host.run(), {
        status: "observed",
        observation: saved.observation,
      });
    assert.equal(readFileSync(file, "utf8"), bytes);
    assert.equal(
      events(root).filter((event) => event.type === "SourceChangeObserved")
        .length,
      1,
    );
    assert.equal(
      events(root).filter(
        (event) =>
          event.type.startsWith("SourceChangeProcess") ||
          event.type === "SourceChangeIntegrityChecked",
      ).length,
      0,
    );
    assert.equal(
      readFileSync(join(root, "launches.txt"), "utf8"),
      "dispatch\n",
    );
    assert.equal(
      git(join(root, "target"), "tag", "--list", "independent-later-tag"),
      "independent-later-tag",
    );
    host.finish();
  } finally {
    dispose(root);
  }
});

test("WO-112 VER-006 F2 older receipt replay retains exact commit, diff and request binding", async () => {
  for (const change of ["commit", "diff", "request"]) {
    const root = createSourceFixture();
    try {
      await assert.rejects(
        () =>
          new SourceChangeHost({
            ...sourceFixtureOptions(root, () => 10),
            afterReceiptSaved() {
              throw new Error("synthetic receipt stop");
            },
          }).run(),
        /synthetic receipt stop/u,
      );
      legacySourceLog(root);
      const file = receiptPath(root);
      const receipt = JSON.parse(readFileSync(file, "utf8"));
      if (change === "commit")
        git(
          join(root, "target"),
          "update-ref",
          "refs/heads/source-fixture",
          git(join(root, "target"), "rev-parse", "main"),
        );
      else {
        if (change === "diff") receipt.observation.diffHash = "0".repeat(64);
        else receipt.requestKey = sourceDigest("synthetic-other-request");
        writeFileSync(file, JSON.stringify(receipt) + "\n");
      }
      await assert.rejects(
        () =>
          new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
        change === "request"
          ? /receipt belongs to a different request/u
          : /saved effect no longer matches Git/u,
      );
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
      assert.equal(
        readFileSync(join(root, "launches.txt"), "utf8"),
        "dispatch\n",
      );
    } finally {
      dispose(root);
    }
  }
});

test("WO-112 VER-006 F2 an older attempt without an accepted receipt still refuses missing termination evidence", async () => {
  const root = createSourceFixture();
  try {
    await assert.rejects(
      () =>
        new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10),
          afterResult() {
            throw new Error("synthetic unreceipted stop");
          },
        }).run(),
      /synthetic unreceipted stop/u,
    );
    assert.equal(
      readdirSync(join(root, "store")).some((name) =>
        name.endsWith(".source-change.json"),
      ),
      false,
    );
    legacySourceLog(root);
    await assert.rejects(
      () => new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
      /recovery lacks worker termination evidence/u,
    );
    assert.equal(
      events(root).some((event) => event.type === "SourceChangeObserved"),
      false,
    );
    assert.equal(
      readFileSync(join(root, "launches.txt"), "utf8"),
      "dispatch\n",
    );
  } finally {
    dispose(root);
  }
});

test("WO-112 VER-006 F2 an unreceipted stopped attempt still requires its durable shared-state baseline", async () => {
  const root = createSourceFixture();
  try {
    await assert.rejects(
      () =>
        new SourceChangeHost({
          ...sourceFixtureOptions(root, () => 10),
          afterResult() {
            throw new Error("synthetic unreceipted stop");
          },
        }).run(),
      /synthetic unreceipted stop/u,
    );
    assert.equal(
      readdirSync(join(root, "store")).some((name) =>
        name.endsWith(".source-change.json"),
      ),
      false,
    );
    legacySourceLog(root, true);
    assert.ok(
      events(root).some((event) => event.type === "SourceChangeProcessStopped"),
    );
    await assert.rejects(
      () => new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
      /recovery lacks a durable shared-state baseline/u,
    );
    assert.equal(
      events(root).some((event) => event.type === "SourceChangeObserved"),
      false,
    );
    assert.equal(
      readFileSync(join(root, "launches.txt"), "utf8"),
      "dispatch\n",
    );
  } finally {
    dispose(root);
  }
});

test("WO-112 F1 preserves independent commits, tags, deleted refs and symbolic retargets", async () => {
  for (const change of [
    "sibling-commit",
    "tag",
    "delete-ref",
    "symbolic-ref",
    "dangling-ref",
    "cyclic-ref",
  ]) {
    const root = createSourceFixture();
    try {
      const repo = join(root, "target"),
        sibling = join(root, "sibling");
      git(repo, "worktree", "add", "-b", "independent", sibling, "HEAD");
      git(repo, "tag", "retired-tag");
      // Unresolved cases create previously absent refs: changing an existing
      // resolved alias would also look like a deletion to the old iterator.
      if (change === "symbolic-ref")
        git(repo, "symbolic-ref", "refs/heads/alias", "refs/heads/main");
      let expected = "";
      const host = new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10),
        afterResult() {
          if (change === "sibling-commit") {
            writeFileSync(
              join(sibling, "independent.txt"),
              "independent work\n",
            );
            git(sibling, "add", "independent.txt");
            git(sibling, "commit", "-m", "Independent synthetic change");
            expected = git(sibling, "rev-parse", "HEAD");
          } else if (change === "tag") git(sibling, "tag", "independent-tag");
          else if (change === "delete-ref")
            git(sibling, "tag", "-d", "retired-tag");
          else
            git(
              sibling,
              "symbolic-ref",
              "refs/heads/alias",
              change === "dangling-ref"
                ? "refs/heads/missing"
                : change === "cyclic-ref"
                  ? "refs/heads/cycle"
                  : "refs/heads/independent",
            );
          if (change === "cyclic-ref")
            git(
              sibling,
              "symbolic-ref",
              "refs/heads/cycle",
              "refs/heads/alias",
            );
        },
      });
      const result = await host.run();
      assert.equal(
        result.status === "refused" && result.refusal.reason,
        "shared-repository-changed",
      );
      if (change === "sibling-commit") {
        assert.equal(git(sibling, "rev-parse", "HEAD"), expected);
        assert.equal(git(sibling, "status", "--porcelain"), "");
      } else if (change === "tag")
        assert.equal(
          git(repo, "tag", "--list", "independent-tag"),
          "independent-tag",
        );
      else if (change === "delete-ref")
        assert.equal(git(repo, "tag", "--list", "retired-tag"), "");
      else {
        assert.equal(
          git(repo, "rev-parse", "main"),
          git(repo, "rev-parse", "independent"),
        );
        assert.equal(
          git(repo, "symbolic-ref", "--no-recurse", "refs/heads/alias"),
          change === "dangling-ref"
            ? "refs/heads/missing"
            : change === "cyclic-ref"
              ? "refs/heads/cycle"
              : "refs/heads/independent",
        );
      }
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
    } finally {
      dispose(root);
    }
  }
});

test("WO-112 F2 refuses substituted alternates entries and parents without writing through them", async () => {
  for (const substitution of ["symlink", "hardlink", "parent"]) {
    const root = createSourceFixture();
    try {
      const repo = join(root, "target");
      git(root, "init", "--bare", join(root, "alternate-a"));
      git(root, "init", "--bare", join(root, "alternate-b"));
      const before = `${join(root, "alternate-a/objects")}\n`;
      const victimBytes = `${join(root, "alternate-b/objects")}\n`;
      const alternates = join(repo, ".git/objects/info/alternates");
      const victimDirectory = join(root, "outside-info");
      mkdirSync(victimDirectory);
      const victim = join(victimDirectory, "alternates");
      writeFileSync(alternates, before);
      writeFileSync(victim, victimBytes);
      const host = new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10),
        afterResult() {
          if (substitution === "parent") {
            renameSync(
              join(repo, ".git/objects/info"),
              join(repo, ".git/objects/saved-info"),
            );
            symlinkSync(victimDirectory, join(repo, ".git/objects/info"));
          } else {
            unlinkSync(alternates);
            if (substitution === "symlink") symlinkSync(victim, alternates);
            else linkSync(victim, alternates);
          }
        },
      });
      const result = await host.run();
      assert.equal(
        result.status === "refused" && result.refusal.reason,
        "shared-repository-unreadable",
      );
      assert.equal(readFileSync(victim, "utf8"), victimBytes);
      if (substitution !== "hardlink")
        assert.equal(
          lstatSync(
            substitution === "parent"
              ? join(repo, ".git/objects/info")
              : alternates,
          ).isSymbolicLink(),
          true,
        );
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
    } finally {
      dispose(root);
    }
  }
});

test("WO-112 shared-state comparison preserves distinct alternates bytes without UTF-8 loss", async () => {
  const root = createSourceFixture();
  try {
    const alternates = join(root, "target/.git/objects/info/alternates");
    // Git warns about these unresolved synthetic paths but can complete this
    // repository's own commit. Their distinct bytes must still be compared.
    const [before, after] = [0x80, 0x81].map((byte) =>
      Buffer.concat([
        Buffer.from(`${root}/alternate-`),
        Buffer.from([byte]),
        Buffer.from("/objects\n"),
      ]),
    );
    assert.notDeepEqual(before, after);
    assert.equal(before!.toString("utf8"), after!.toString("utf8"));
    writeFileSync(alternates, before!);
    const result = await new SourceChangeHost({
      ...sourceFixtureOptions(root, () => 10),
      afterResult() {
        writeFileSync(alternates, after!);
      },
    }).run();
    assert.equal(
      result.status === "refused" && result.refusal.reason,
      "shared-repository-changed",
    );
    assert.deepEqual(readFileSync(alternates), after);
    assert.equal(
      events(root).some((event) => event.type === "SourceChangeObserved"),
      false,
    );
  } finally {
    dispose(root);
  }
});

test("WO-112 F3 adjudicates malformed returns and transport failures durably before recovery", async () => {
  for (const failure of ["malformed", "rejected"]) {
    const root = createSourceFixture();
    try {
      const options = sourceFixtureOptions(root, () => 10);
      const append = options.store.append.bind(options.store);
      let host: SourceChangeHost;
      options.store.append = (event) => {
        if (event.type === "SourceChangeIntegrityChecked") {
          assert.equal(
            existsSync(
              join(
                options.launchpadCheckout,
                "docs/control/local/harness/targets",
                sourceDigest(host.tree.path),
                "source-change-commands.json",
              ),
            ),
            false,
            "failed writer retains no command route during integrity adjudication",
          );
          assert.equal(
            existsSync(
              writerSandboxProfilePath(
                options.launchpadCheckout,
                host.tree.path,
              ),
            ),
            false,
            "failed writer retains no sandbox profile during integrity adjudication",
          );
        }
        return append(event);
      };
      const transport: WorkOrderTransport<WriterRequest> = {
        name: options.transport.name,
        harnessVersion: options.transport.harnessVersion,
        dispatch(request, now) {
          const pending = options.transport.dispatch(request, now);
          return {
            ...pending,
            completed: pending.completed.then(() => {
              git(options.workOrder.repo, "tag", "stray-after-failure");
              if (failure === "rejected")
                throw new Error("synthetic transport failure");
              return {} as WriterResult;
            }),
          };
        },
      };
      host = new SourceChangeHost({ ...options, transport });
      await assert.rejects(
        () => host.run(),
        failure === "malformed"
          ? /invalid-result/
          : /synthetic transport failure/,
      );
      const checked = events(root).find(
        (event) => event.type === "SourceChangeIntegrityChecked",
      );
      assert.equal(
        (checked?.payload as { outcome: string }).outcome,
        "changed",
      );
      assert.equal(
        git(options.workOrder.repo, "tag", "--list", "stray-after-failure"),
        "stray-after-failure",
      );
      // Even a subsequent independent restoration does not erase the failed
      // episode's durable verdict and turn its commit into accepted work.
      git(options.workOrder.repo, "tag", "-d", "stray-after-failure");
      const recovered = await new SourceChangeHost(
        sourceFixtureOptions(root, () => 6_000),
      ).run();
      assert.equal(
        recovered.status === "refused" && recovered.refusal.reason,
        "shared-repository-changed",
      );
      assert.equal(
        events(root).filter((event) => event.type === "WorkerAttemptStarted")
          .length,
        1,
      );
      assert.equal(
        events(root).some((event) => event.type === "SourceChangeObserved"),
        false,
      );
    } finally {
      dispose(root);
    }
  }
});

test("WO-112 F3 a killed host's unchecked commit is judged against its persisted baseline", async () => {
  const root = createSourceFixture();
  try {
    const script = `
      import {SourceChangeHost} from ${JSON.stringify(new URL("../src/source-change-host.js", import.meta.url).href)};
      import {sourceFixtureOptions, fixtureGit} from ${JSON.stringify(new URL("./source-change-fixture.js", import.meta.url).href)};
      const options = sourceFixtureOptions(process.argv[1], () => 10);
      await new SourceChangeHost({...options, afterResult() {
        fixtureGit(options.workOrder.repo, 'tag', 'stray-before-host-kill');
        process.kill(process.pid, 'SIGKILL');
      }}).run();`;
    const killed = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script, root],
      { encoding: "utf8", timeout: 30_000 },
    );
    assert.equal(killed.signal, "SIGKILL", killed.stderr);
    assert.equal(
      events(root).some(
        (event) => event.type === "SourceChangeIntegrityChecked",
      ),
      false,
    );
    const recovered = await new SourceChangeHost(
      sourceFixtureOptions(root, () => 6_000),
    ).run();
    assert.equal(
      recovered.status === "refused" && recovered.refusal.reason,
      "shared-repository-changed",
    );
    assert.equal(
      git(join(root, "target"), "tag", "--list", "stray-before-host-kill"),
      "stray-before-host-kill",
    );
    assert.equal(
      events(root).filter((event) => event.type === "WorkerAttemptStarted")
        .length,
      1,
    );
    assert.equal(
      events(root).some((event) => event.type === "SourceChangeObserved"),
      false,
    );
  } finally {
    dispose(root);
  }
});

test("WO-112 F3 lease expiry does not imply a killed host's writer group has exited", async () => {
  const root = createSourceFixture();
  let group: number | undefined;
  try {
    const hold = join(root, "hold.mjs");
    writeFileSync(
      hold,
      "process.stdin.resume(); setInterval(() => {}, 1000);\n",
    );
    const script = `
      import {SourceChangeHost} from ${JSON.stringify(new URL("../src/source-change-host.js", import.meta.url).href)};
      import {sourceFixtureOptions} from ${JSON.stringify(new URL("./source-change-fixture.js", import.meta.url).href)};
      import {CodexCliExecWorkOrderTransport, runWorkerProcess} from ${JSON.stringify(new URL("../src/worker-transport.js", import.meta.url).href)};
      const options = sourceFixtureOptions(process.argv[1], () => 10);
      const transport = new CodexCliExecWorkOrderTransport(launch => runWorkerProcess({...launch, binary: process.execPath, args: [process.argv[2]]}), '0.154.0');
      await new SourceChangeHost({...options, transport, onRunning() { process.kill(process.pid, 'SIGKILL'); }}).run();`;
    const killed = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script, root, hold],
      { encoding: "utf8", timeout: 30_000 },
    );
    assert.equal(killed.signal, "SIGKILL", killed.stderr);
    const started = events(root).find(
      (event) => event.type === "SourceChangeProcessStarted",
    );
    group = (started?.payload as { processGroup: number }).processGroup;
    assert.ok(Number.isSafeInteger(group) && group! > 1);
    await assert.rejects(
      () => new SourceChangeHost(sourceFixtureOptions(root, () => 6_000)).run(),
      /prior worker group is still present/,
    );
    assert.equal(
      events(root).some(
        (event) => event.type === "SourceChangeIntegrityChecked",
      ),
      false,
    );
    assert.equal(
      events(root).filter((event) => event.type === "WorkerAttemptStarted")
        .length,
      1,
    );
  } finally {
    if (group) {
      try {
        process.kill(-group, "SIGKILL");
      } catch {}
    }
    dispose(root);
  }
});

test("WO-112 F3 cancellation stops an ordinary descendant before judging shared state", async () => {
  const root = createSourceFixture();
  let running: TransportDispatch<WriterResult> | undefined;
  let result: Promise<unknown> | undefined;
  try {
    const ready = join(root, "descendant-ready");
    const attempted = join(root, "descendant-attempted");
    const release = join(root, "release-descendant");
    const script = join(root, "cancel-worker.mjs");
    const descendant = `
      const {existsSync, writeFileSync} = require('node:fs');
      const {execFileSync} = require('node:child_process');
      writeFileSync(${JSON.stringify(ready)}, 'ready');
      const waiting = setInterval(() => {
        if (!existsSync(${JSON.stringify(release)})) return;
        clearInterval(waiting);
        writeFileSync(${JSON.stringify(attempted)}, 'attempted');
        execFileSync('git', ['-C', ${JSON.stringify(join(root, "target"))}, 'tag', 'late-descendant']);
      }, 10);`;
    writeFileSync(
      script,
      `
      import {spawn} from 'node:child_process';
      spawn(process.execPath, ['-e', ${JSON.stringify(descendant)}], {stdio: 'ignore'});
      process.stdin.resume();
      setInterval(() => {}, 1000);`,
    );
    const options = sourceFixtureOptions(root, () => 10);
    const transport = new CodexCliExecWorkOrderTransport(
      (launch) =>
        runWorkerProcess({
          ...launch,
          binary: process.execPath,
          args: [script],
        }),
      "0.154.0",
    );
    result = new SourceChangeHost({
      ...options,
      transport,
      onRunning(dispatch) {
        running = dispatch;
      },
    }).run();
    void result.catch(() => undefined);
    const deadline = Date.now() + 5_000;
    while (!existsSync(ready) && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 10));
    assert.ok(existsSync(ready), "descendant started before cancellation");
    assert.ok(running?.processGroup);
    running.kill();
    await assert.rejects(result, /interrupted/);
    const rows = events(root);
    const stopped = rows.findIndex(
      (event) => event.type === "SourceChangeProcessStopped",
    );
    const checked = rows.findIndex(
      (event) => event.type === "SourceChangeIntegrityChecked",
    );
    assert.ok(stopped >= 0 && checked > stopped);
    assert.equal(
      (rows[checked]!.payload as { outcome: string }).outcome,
      "unchanged",
    );
    writeFileSync(release, "released after cancellation\n");
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(existsSync(attempted), false);
    assert.equal(
      git(options.workOrder.repo, "tag", "--list", "late-descendant"),
      "",
    );
  } finally {
    running?.kill();
    await result?.catch(() => undefined);
    dispose(root);
  }
});

test("WO-112 new integrity records decode before recovery changes any store bytes", async () => {
  const root = createSourceFixture();
  try {
    const options = sourceFixtureOptions(root, () => 10);
    assert.equal(
      (await new SourceChangeHost(options).run()).status,
      "observed",
    );
    const original = events(root);
    for (const bad of [
      "baseline",
      "alternates",
      "group",
      "outcome",
      "ordering",
    ]) {
      const altered = original.map((event) => {
        const payload = event.payload as Record<string, unknown>;
        if (bad === "baseline" && event.type === "WorkerAttemptStarted")
          return {
            ...event,
            payload: { ...payload, sharedState: { refs: [] } },
          };
        if (bad === "alternates" && event.type === "WorkerAttemptStarted")
          return {
            ...event,
            payload: {
              ...payload,
              sharedState: {
                ...(payload.sharedState as object),
                alternates: "not-hexadecimal",
              },
            },
          };
        if (bad === "group" && event.type === "SourceChangeProcessStarted")
          return {
            ...event,
            payload: { ...payload, processGroup: "not-a-group" },
          };
        if (bad === "outcome" && event.type === "SourceChangeIntegrityChecked")
          return { ...event, payload: { ...payload, outcome: "changed" } };
        if (bad === "ordering" && event.type === "SourceChangeProcessStopped")
          return { ...event, type: "UnknownSyntheticEvent" };
        return event;
      });
      const bytes = encodeLog(altered as typeof original);
      writeFileSync(logPath(root), bytes);
      await assert.rejects(
        () => new SourceChangeHost(sourceFixtureOptions(root, () => 20)).run(),
        /source-change/,
      );
      assert.equal(readFileSync(logPath(root), "utf8"), bytes);
      assert.equal(existsSync(join(root, "store/host.lock")), false);
    }
  } finally {
    dispose(root);
  }
});
