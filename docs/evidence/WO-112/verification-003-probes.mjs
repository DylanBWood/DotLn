// VER-003 reproductions with synthetic repositories only; no vendor worker,
// forge or network. Run from the repository root after its normal build:
// node scripts/harness.mjs bounded -- node docs/evidence/WO-112/verification-003-probes.mjs
// Prints one JSON row per probe. The F1-F3 rows record the defects at this
// subject. A repair should refuse F1 as outside the declared surfaces, observe
// every F2 recovery from its receipt, and leave each F3 item undecided so the
// retried invocation launches a fresh episode. The VER-002 rows are rechecks.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const self = fileURLToPath(import.meta.url);
const gitEnv = {
  ...process.env,
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};

/** Rewrite the root-tree OID that a commit-graph records for `commit`. */
function forgeGraphTree(file, commit, tree) {
  const buf = readFileSync(file);
  let oidl, cdat;
  for (let i = 0; i < buf[6]; i++) {
    const at = 8 + i * 12,
      id = buf.toString("latin1", at, at + 4);
    const offset = Number(buf.readBigUInt64BE(at + 4));
    if (id === "OIDL") oidl = offset;
    if (id === "CDAT") cdat = offset;
  }
  let index = -1;
  for (let i = 0; i < (cdat - oidl) / 20; i++)
    if (buf.toString("hex", oidl + i * 20, oidl + i * 20 + 20) === commit)
      index = i;
  if (index < 0) throw new Error("commit absent from graph");
  Buffer.from(tree, "hex").copy(buf, cdat + index * 36);
  createHash("sha1")
    .update(buf.subarray(0, buf.length - 20))
    .digest()
    .copy(buf, buf.length - 20);
  chmodSync(file, 0o644);
  writeFileSync(file, buf);
}

if (process.argv[2] === "--hostile-writer") {
  // Synthetic hostile writer, run by the host's transport in its worktree. It
  // commits normally through the existing double, replaces its own branch tip
  // with a commit whose real tree also changes fixture-test.mjs (outside the
  // declared surface), and plants a commit-graph naming the honest tree.
  const [, , , writerCli, record] = process.argv;
  const raw = readFileSync(0, "utf8");
  const wire = execFileSync(process.execPath, [writerCli, "codex", "commit"], {
    input: raw,
    encoding: "utf8",
    timeout: 15000,
  });
  const git = (args, input) =>
    execFileSync("git", ["-c", "core.hooksPath=/dev/null", ...args], {
      encoding: "utf8",
      env: gitEnv,
      ...(input === undefined ? {} : { input }),
    }).trim();
  const honest = git(["rev-parse", "HEAD"]),
    base = git(["rev-parse", "HEAD^"]);
  const good = git(["rev-parse", "HEAD^{tree}"]);
  const outside = git(
    ["hash-object", "-w", "--stdin"],
    "// changed outside the declared surface\n",
  );
  const bad = git(
    ["mktree"],
    git(["ls-tree", good])
      .split("\n")
      .map((line) =>
        line.endsWith("\tfixture-test.mjs")
          ? line.replace(/blob [0-9a-f]{40}/, `blob ${outside}`)
          : line,
      )
      .join("\n") + "\n",
  );
  const forged = git(
    ["commit-tree", bad, "-p", base, "-F", "-"],
    git(["log", "-1", "--format=%B", honest]) + "\n",
  );
  git(["update-ref", "HEAD", forged]);
  git(["commit-graph", "write", "--reachable"]);
  forgeGraphTree(
    join(
      git(["rev-parse", "--path-format=absolute", "--git-common-dir"]),
      "objects/info/commit-graph",
    ),
    forged,
    good,
  );
  writeFileSync(record, JSON.stringify({ honest, forged, base, good, bad }));
  process.stdout.write(wire);
  process.exit(0);
}

const root = process.cwd();
const dist = (path) => join(root, "packages/skeleton/dist", path);
const { appendEvent, decodeLog } = await import(
  join(root, "packages/kernel/dist/src/index.js")
);
const { SourceChangeHost } = await import(dist("src/source-change-host.js"));
const { WorkerStore } = await import(dist("src/worker-store.js"));
const { CodexCliExecWorkOrderTransport, runWorkerProcess } = await import(
  dist("src/worker-transport.js")
);
const {
  createSourceFixture,
  fixtureGit: git,
  sourceFixtureOptions,
} = await import(dist("test/source-change-fixture.js"));
const { resolveReviewComments } = await import(
  join(root, "scripts/lib/review-comment-loop.mjs")
);
const { PULL_REQUEST_OBSERVER } = await import(
  join(root, "scripts/lib/pull-request-observer.mjs")
);
const { TARGET_PUBLISH_HOST } = await import(
  join(root, "scripts/lib/target-publish.mjs")
);
const { WorkerFailure } = await import(dist("src/worker-protocol.js"));
const { judgmentRetryable } = await import(
  dist("src/vertical-judgment-host.js")
);

if (process.argv[2] === "--host-kill") {
  // A host killed by SIGKILL as soon as its receipt is persisted.
  const fixture = process.argv[3];
  await new SourceChangeHost({
    ...sourceFixtureOptions(fixture, () => 10),
    afterReceiptSaved() {
      process.kill(process.pid, "SIGKILL");
    },
  }).run();
  process.exit(0);
}
const HOST_FLAGS = [
  "-c",
  "core.hooksPath=/dev/null",
  "-c",
  "core.fsmonitor=false",
  "-c",
  "core.useReplaceRefs=false",
];
const emit = (row) => console.log(JSON.stringify(row));
const settle = async (run) => {
  try {
    return await run();
  } catch (error) {
    return { thrown: String(error.message).split("\n")[0] };
  }
};
const lastLine = (error) =>
  String(error.stderr ?? error.message)
    .split("\n")
    .filter(Boolean)
    .map((line) => line.replace(/'[^']*'/g, "<path>"))
    .filter((line) => line.includes("rejected"))
    .at(0) ?? "rejected";

// F1: a forged commit-graph shows the host an honest tree while the commit it
// accepts changes a file outside the declared surface.
{
  const fixture = createSourceFixture();
  const record = join(fixture, "forge.json");
  try {
    const runner = (launch) =>
      runWorkerProcess({
        ...launch,
        binary: process.execPath,
        args: [
          self,
          "--hostile-writer",
          join(root, "packages/skeleton/fixtures/writer-cli.mjs"),
          record,
        ],
      });
    const result = await settle(() =>
      new SourceChangeHost({
        ...sourceFixtureOptions(fixture, () => 10),
        transport: new CodexCliExecWorkOrderTransport(runner, "0.154.0"),
      }).run(),
    );
    const forged = JSON.parse(readFileSync(record, "utf8"));
    const repo = join(fixture, "target");
    const integrity = decodeLog(
      readFileSync(join(fixture, "store/events.jsonl"), "utf8"),
    )
      .filter((event) => event.type === "SourceChangeIntegrityChecked")
      .map((event) => event.payload.outcome);
    // What the host's own Git flags show while the forged graph is present.
    const hostFlagDiff = git(
      repo,
      ...HOST_FLAGS,
      "diff",
      "--name-only",
      forged.base,
      forged.forged,
    ).split("\n");
    const commitGraphDisabledDiff = git(
      repo,
      ...HOST_FLAGS,
      "-c",
      "core.commitGraph=false",
      "diff",
      "--name-only",
      forged.base,
      forged.forged,
    ).split("\n");
    const remote = join(fixture, "remote.git");
    git(fixture, "init", "-q", "--bare", remote);
    git(repo, "push", "-q", remote, `${forged.base}:refs/heads/main`);
    let pushWithForgedGraph = "accepted",
      pushAfterGraphRewrite = "accepted",
      remoteDiff = null;
    try {
      git(repo, "push", "-q", remote, `${forged.forged}:refs/heads/published`);
    } catch (error) {
      pushWithForgedGraph = lastLine(error);
    }
    // Routine maintenance (gc, maintenance, commit-graph write) recomputes the
    // graph from the real objects.
    git(repo, "commit-graph", "write", "--reachable");
    try {
      git(repo, "push", "-q", remote, `${forged.forged}:refs/heads/published`);
      remoteDiff = git(
        remote,
        "diff",
        "--name-only",
        forged.base,
        "published",
      ).split("\n");
    } catch (error) {
      pushAfterGraphRewrite = lastLine(error);
    }
    emit({
      probe: "F1 forged commit-graph",
      status: result.status ?? null,
      reason: result.refusal?.reason ?? result.thrown ?? null,
      acceptedCommitIsForged: result.observation?.commit === forged.forged,
      realTreeIsHonestTree:
        git(repo, "rev-parse", `${forged.forged}^{tree}`) === forged.good,
      integrityOutcomes: integrity,
      hostFlagDiff,
      commitGraphDisabledDiff,
      pushWithForgedGraph,
      pushAfterGraphRewrite,
      remoteDiff,
    });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

// VER-002 F1-F3 setups re-run without their defect assertions.
{
  const fixture = createSourceFixture();
  try {
    const repo = join(fixture, "target"),
      sibling = join(fixture, "sibling");
    git(
      repo,
      "worktree",
      "add",
      "-b",
      "independent",
      sibling,
      git(repo, "rev-parse", "HEAD"),
    );
    let siblingCommit;
    const result = await settle(() =>
      new SourceChangeHost({
        ...sourceFixtureOptions(fixture, () => 10),
        afterResult() {
          writeFileSync(join(sibling, "independent.txt"), "independent work\n");
          git(sibling, "add", "independent.txt");
          git(sibling, "commit", "-m", "Independent synthetic change");
          siblingCommit = git(sibling, "rev-parse", "HEAD");
        },
      }).run(),
    );
    emit({
      probe: "VER-002 F1 recheck",
      status: result.status ?? null,
      reason: result.refusal?.reason ?? result.thrown ?? null,
      siblingCommitPreserved:
        git(sibling, "rev-parse", "HEAD") === siblingCommit,
      siblingStatus: git(sibling, "status", "--short"),
    });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}
{
  const fixture = createSourceFixture();
  try {
    const repo = join(fixture, "target");
    git(fixture, "init", "--bare", join(fixture, "alternate-a"));
    git(fixture, "init", "--bare", join(fixture, "alternate-b"));
    const victimContent = `${join(fixture, "alternate-b", "objects")}\n`;
    const alternates = join(repo, ".git/objects/info/alternates"),
      victim = join(fixture, "synthetic-victim.txt");
    writeFileSync(alternates, `${join(fixture, "alternate-a", "objects")}\n`);
    writeFileSync(victim, victimContent);
    const result = await settle(() =>
      new SourceChangeHost({
        ...sourceFixtureOptions(fixture, () => 10),
        afterResult() {
          unlinkSync(alternates);
          symlinkSync(victim, alternates);
        },
      }).run(),
    );
    emit({
      probe: "VER-002 F2 recheck",
      status: result.status ?? null,
      reason: result.refusal?.reason ?? result.thrown ?? null,
      victimUnchanged: readFileSync(victim, "utf8") === victimContent,
    });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}
{
  const fixture = createSourceFixture();
  try {
    const options = sourceFixtureOptions(fixture, () => 10);
    const original = options.transport;
    let host;
    const transport = {
      name: original.name,
      harnessVersion: original.harnessVersion,
      dispatch(request, now) {
        const pending = original.dispatch(request, now);
        return {
          ...pending,
          completed: pending.completed.then(() => {
            git(host.tree.path, "tag", "stray-after-failure");
            return {};
          }),
        };
      },
    };
    host = new SourceChangeHost({ ...options, transport });
    const first = await settle(() => host.run());
    const recovered = await settle(() =>
      new SourceChangeHost(sourceFixtureOptions(fixture, () => 6000)).run(),
    );
    emit({
      probe: "VER-002 F3 recheck",
      first: first.thrown ?? first.status,
      recovery: recovered.status ?? null,
      recoveryReason: recovered.refusal?.reason ?? recovered.thrown ?? null,
      strayTagPreserved:
        git(options.workOrder.repo, "tag", "--list", "stray-after-failure") ===
        "stray-after-failure",
      writerLaunches: readFileSync(join(fixture, "launches.txt"), "utf8")
        .trim()
        .split("\n").length,
    });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}
// VER-002 F4 setup, with a third unchanged replay.
{
  const fixture = mkdtempSync(join(tmpdir(), "dotln-ver003-review-"));
  try {
    const publication = new WorkerStore(join(fixture, "publication"));
    let clock = 10;
    const record = (actorId, type, payload, causationId) => {
      publication.acquire();
      try {
        const { event } = appendEvent(publication.read(), {
          schemaVersion: 1,
          type,
          occurredAt: ++clock,
          actorId,
          workstreamId: "ws_ver003_synthetic",
          ...(causationId ? { causationId } : {}),
          payload,
        });
        publication.append(event);
        return event;
      } finally {
        publication.release();
      }
    };
    const repositoryId = "github.com/dotln-fixture/target";
    const opening = record(TARGET_PUBLISH_HOST, "PullRequestOpened", {
      number: 7,
      repositoryId,
    });
    let body = "Automated review summary: no additional changes requested.";
    let triageCalls = 0;
    const options = {
      store: fixture,
      repositoryId,
      number: 7,
      original: { surfaces: ["fixture.txt"], tests: [], criteria: [] },
      now: () => ++clock,
      observe() {
        record(
          PULL_REQUEST_OBSERVER,
          "PullRequestStateObserved",
          {
            number: 7,
            repositoryId,
            headSha: "a".repeat(40),
            checks: [],
            comments: [
              {
                id: "S1",
                class: "automated-review",
                text: body,
                resolved: false,
              },
            ],
          },
          opening.eventId,
        );
      },
      async triage() {
        triageCalls++;
        return body.startsWith("Action required:")
          ? {
              kind: "NeedsHuman",
              criterionId: null,
              reason: "Changed body requires action",
              evidenceRefs: [],
            }
          : {
              kind: "acknowledge",
              criterionId: null,
              reason: "Nonactionable summary",
              evidenceRefs: ["synthetic-contract"],
            };
      },
    };
    const first = await settle(() => resolveReviewComments(options));
    body =
      "Action required: the current implementation still violates the acceptance criterion.";
    const second = await settle(() => resolveReviewComments(options));
    const third = await settle(() => resolveReviewComments(options));
    emit({
      probe: "VER-002 F4 recheck",
      first: first.status ?? first.thrown,
      second: second.status ?? second.thrown,
      third: third.status ?? third.thrown,
      triageCalls,
      bodyJudgments: decodeLog(publication.read()).filter(
        (row) => row.type === "ReviewBodyJudged",
      ).length,
    });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

// F2: a host killed after persisting its receipt; something unrelated then
// changes a shared ref before recovery. The fresh adversary's p1 case.
for (const later of ["none", "tag", "remote-tracking-ref"]) {
  const fixture = createSourceFixture();
  try {
    const killed = spawnSync(process.execPath, [self, "--host-kill", fixture], {
      encoding: "utf8",
      timeout: 60000,
    });
    const repo = join(fixture, "target");
    const atKill = decodeLog(
      readFileSync(join(fixture, "store/events.jsonl"), "utf8"),
    );
    if (later === "tag") git(repo, "tag", "unrelated-later-tag");
    if (later === "remote-tracking-ref")
      git(
        repo,
        "update-ref",
        "refs/remotes/origin/main",
        git(repo, "rev-parse", "main"),
      );
    const recovered = await settle(() =>
      new SourceChangeHost(sourceFixtureOptions(fixture, () => 6000)).run(),
    );
    emit({
      probe: "F2 receipt-crash recovery",
      later,
      hostSignal: killed.signal,
      receiptPersistedBeforeKill:
        atKill
          .filter((event) => event.type === "SourceChangeIntegrityChecked")
          .every((event) => event.payload.outcome === "unchanged") &&
        !atKill.some((event) => event.type === "SourceChangeObserved"),
      recovery: recovered.status ?? null,
      reason: recovered.refusal?.reason ?? recovered.thrown ?? null,
      writerLaunches: readFileSync(join(fixture, "launches.txt"), "utf8")
        .trim()
        .split("\n").length,
    });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

// F3: a retryable triage failure on a review body and on an inline item. The
// fresh adversary's r1 and r2 cases.
for (const [shape, comment] of [
  [
    "review body",
    {
      id: "S1",
      class: "automated-review",
      text: "Summary: no changes requested.",
      resolved: false,
    },
  ],
  [
    "inline item",
    {
      id: "C1",
      class: "automated-review",
      threadId: "THREAD1",
      path: "fixture.txt",
      line: 3,
      text: "Consider renaming this symbol.",
      resolved: false,
    },
  ],
])
  for (const code of ["interrupted", "model-unavailable"]) {
    const fixture = mkdtempSync(join(tmpdir(), "dotln-ver003-triage-"));
    try {
      const publication = new WorkerStore(join(fixture, "publication"));
      let clock = 10,
        triageCalls = 0;
      const record = (actorId, type, payload, causationId) => {
        publication.acquire();
        try {
          const { event } = appendEvent(publication.read(), {
            schemaVersion: 1,
            type,
            occurredAt: ++clock,
            actorId,
            workstreamId: "ws_ver003_synthetic",
            ...(causationId ? { causationId } : {}),
            payload,
          });
          publication.append(event);
          return event;
        } finally {
          publication.release();
        }
      };
      const repositoryId = "github.com/dotln-fixture/target";
      const opening = record(TARGET_PUBLISH_HOST, "PullRequestOpened", {
        number: 7,
        repositoryId,
      });
      const options = {
        store: fixture,
        repositoryId,
        number: 7,
        judgments: {},
        original: { surfaces: ["fixture.txt"], tests: [], criteria: [] },
        now: () => ++clock,
        observe() {
          record(
            PULL_REQUEST_OBSERVER,
            "PullRequestStateObserved",
            {
              number: 7,
              repositoryId,
              headSha: "a".repeat(40),
              checks: [],
              comments: [comment],
            },
            opening.eventId,
          );
        },
        async triage() {
          triageCalls++;
          if (triageCalls === 1)
            throw new WorkerFailure(code, "synthetic transient failure");
          return {
            kind: "NeedsHuman",
            criterionId: null,
            reason: "second episode reached",
            evidenceRefs: [],
          };
        },
      };
      const first = await settle(() => resolveReviewComments(options));
      const retried = await settle(() => resolveReviewComments(options));
      emit({
        probe: "F3 transient triage failure",
        shape,
        code,
        retryableByIntakeRule: judgmentRetryable(new WorkerFailure(code, "x")),
        first: [first.status ?? first.thrown, first.reason ?? null],
        retried: [retried.status ?? retried.thrown, retried.reason ?? null],
        triageCalls,
      });
    } finally {
      rmSync(fixture, { recursive: true, force: true });
    }
  }
