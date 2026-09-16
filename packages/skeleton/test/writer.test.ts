import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  sourceChangeProfile,
  validateSourceChangeEnvironment,
} from "../src/source-change-environment.js";
import type { SourceChangeProfile } from "../src/execution-environment.js";
import {
  parseWriterResult,
  parseStoredWriterResult,
  SOURCE_CHANGE_DENIED,
  validateRequest,
  validateWriterRequest,
  workerPrompt,
  writerPrompt,
  type WorkerRequest,
  type WriterRequest,
} from "../src/worker-protocol.js";
import {
  canonicalWorkerArgs,
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
  type ProcessRunner,
  type WorkerLaunch,
} from "../src/worker-transport.js";
import { workerRequestKey, WorkerStore } from "../src/worker-store.js";
import {
  transportPrompt,
  transportResultSchema,
  validateTransportRequest,
} from "../src/verification-protocol.js";

const baseline = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo051-inspection-baseline.json", import.meta.url),
    "utf8",
  ),
) as {
  request: WorkerRequest;
  claude: string[];
  codex: string[];
  prompt: string;
  sourceBlocks: string[];
};
const git = (cwd: string, ...args: string[]) =>
  execFileSync(
    "git",
    ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
    {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Fixture",
        GIT_AUTHOR_EMAIL: "fixture@example.invalid",
        GIT_COMMITTER_NAME: "Fixture",
        GIT_COMMITTER_EMAIL: "fixture@example.invalid",
      },
    },
  ).trim();

function scratch() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-writer-test-")));
  const launchpad = join(root, "launchpad");
  const parent = join(root, "trees");
  const cwd = join(parent, "writer");
  mkdirSync(launchpad);
  mkdirSync(parent);
  git(launchpad, "init", "--initial-branch=main");
  writeFileSync(join(launchpad, "fixture.txt"), "baseline\n");
  writeFileSync(
    join(launchpad, "fixture-test.mjs"),
    "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(readFileSync('fixture.txt','utf8'), 'changed by synthetic worker\\n');\n",
  );
  git(launchpad, "add", "-A");
  git(launchpad, "commit", "-m", "fixture baseline");
  git(launchpad, "worktree", "add", "-b", "writer", cwd);
  mkdirSync(join(cwd, ".dotln"));
  writeFileSync(join(launchpad, ".git/info/exclude"), "/.dotln/\n");
  const commitMessagePath = join(cwd, ".dotln/message.txt");
  writeFileSync(commitMessagePath, "fixture source change\n");
  const input = {
    worktree: cwd,
    worktreeParent: parent,
    launchpadCheckout: launchpad,
    commitMessagePath,
  };
  const request: WriterRequest = {
    kind: "source-change",
    command: {
      ...baseline.request.command,
      intent: { kind: "Act", effect: "repo.write", payload: {} },
    },
    workOrder: {
      ...baseline.request.workOrder,
      repo: cwd,
      baseCommit: git(cwd, "rev-parse", "HEAD"),
      allowedOperations: ["repo.write", "git.local"],
      prohibitedOperations: [...SOURCE_CHANGE_DENIED],
    },
    authorityEnvelope: {
      authorityEnvelopeId: "fixture.writer",
      allowedEffects: ["repo.write", "git.local"],
      deniedEffects: [...SOURCE_CHANGE_DENIED],
      resourceLimits: { writers: 1 },
      requiredEvidence: [],
      expiresAt: Number.MAX_SAFE_INTEGER,
      revocationEventTypes: [],
    },
    artifactIdentity: baseline.request.artifactIdentity,
    episodeId: "writer_1",
    model: "required-model",
    effort: "xhigh",
    cwd,
    profile: sourceChangeProfile(input),
    testCommand: "node fixture-test.mjs",
    commitMessagePath,
  };
  return {
    root,
    input,
    request,
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("WO-051 inspection request, validator, parser, prompt and both launch arrays retain activation bytes", () => {
  assert.deepEqual(
    canonicalWorkerArgs(
      "claude-cli-print",
      baseline.request,
      "/schema.json",
      "2.1.270",
    ),
    baseline.claude,
  );
  assert.deepEqual(
    canonicalWorkerArgs(
      "codex-cli-exec",
      baseline.request,
      "/schema.json",
      "0.154.0",
    ),
    baseline.codex,
  );
  assert.equal(workerPrompt(baseline.request), baseline.prompt);
  const source = readFileSync(
    new URL("../../src/worker-protocol.ts", import.meta.url),
    "utf8",
  );
  for (const block of baseline.sourceBlocks) assert.ok(source.includes(block));
  for (const request of [
    {
      ...baseline.request,
      command: {
        ...baseline.request.command,
        intent: { kind: "Act", effect: "repo.write", payload: {} },
      },
    },
    {
      ...baseline.request,
      profile: {
        ...baseline.request.profile,
        mounts: [{ path: baseline.request.cwd, access: "read-write" }],
      },
    },
  ])
    assert.throws(
      () => validateRequest(request as WorkerRequest),
      /profile-refused/,
    );
});

test("WO-051 writer authority, command and environment refuse invalid requests before a launch", () => {
  const s = scratch();
  try {
    const r = s.request;
    assert.doesNotThrow(() => validateWriterRequest(r));
    assert.doesNotThrow(() => validateTransportRequest(r));
    assert.equal(transportPrompt(r), writerPrompt(r));
    assert.ok(
      JSON.stringify(transportResultSchema(r)).includes("requiresHuman"),
    );
    const bad: unknown[] = [
      {
        ...r,
        command: {
          ...r.command,
          intent: { kind: "Act", effect: "repo.inspect", payload: {} },
        },
      },
      {
        ...r,
        profile: { ...r.profile, mounts: [{ path: r.cwd, access: "read" }] },
      },
      { ...r, profile: { ...r.profile, writableSurfaces: [] } },
      { ...r, workOrder: { ...r.workOrder, allowedOperations: ["git.local"] } },
      {
        ...r,
        workOrder: { ...r.workOrder, allowedOperations: ["repo.write"] },
      },
      { ...r, workOrder: { ...r.workOrder, prohibitedOperations: [] } },
      {
        ...r,
        authorityEnvelope: {
          ...r.authorityEnvelope,
          allowedEffects: ["git.local"],
        },
      },
      {
        ...r,
        authorityEnvelope: { ...r.authorityEnvelope, deniedEffects: [] },
      },
      {
        ...r,
        workOrder: {
          ...r.workOrder,
          allowedOperations: [...r.workOrder.allowedOperations, "repo.read"],
        },
      },
      {
        ...r,
        authorityEnvelope: {
          ...r.authorityEnvelope,
          allowedEffects: [...r.authorityEnvelope.allowedEffects, "shell.run"],
          deniedEffects: [...SOURCE_CHANGE_DENIED, "shell.run"],
        },
      },
      {
        ...r,
        workOrder: {
          ...r.workOrder,
          prohibitedOperations: [...SOURCE_CHANGE_DENIED, "repo.read"],
        },
        authorityEnvelope: {
          ...r.authorityEnvelope,
          allowedEffects: [...r.authorityEnvelope.allowedEffects, "repo.read"],
        },
      },
      {
        ...r,
        workOrder: {
          ...r.workOrder,
          prohibitedOperations: [...SOURCE_CHANGE_DENIED, "repo.*"],
        },
      },
      ...[
        "repo.push",
        "remote.request",
        "credentials.access",
        "settings.user",
        "sandbox.disable",
        "shell.*",
        "*",
      ].map((effect) => ({
        ...r,
        workOrder: {
          ...r.workOrder,
          allowedOperations: [...r.workOrder.allowedOperations, effect],
        },
      })),
      ...[
        "node a;pwd",
        "node a && pwd",
        "node a|cat",
        "node $(pwd)",
        "node `pwd`",
        "node a\npwd",
        "node a*",
        "node a > b",
        "node a,b",
        "node a)",
        "node a:*",
      ].map((testCommand) => ({ ...r, testCommand })),
      {
        ...r,
        commitMessagePath: join(s.input.launchpadCheckout, "fixture.txt"),
      },
    ];
    let launches = 0;
    const transport = new ClaudeCliPrintWorkOrderTransport(() => {
      launches++;
      throw new Error("must not launch");
    }, "2.1.270");
    for (const request of bad)
      assert.throws(
        () => transport.dispatch(request as WriterRequest, () => 1),
        /profile-refused/,
      );
    assert.equal(launches, 0);
    for (const [field, row] of [
      [{ claudeTools: "tools-only" }, "C-W1"],
      [{ codexApproval: "on-request" }, "X-U2"],
      [{ codexHooks: true }, "X-W3"],
    ] as const)
      assert.throws(() => sourceChangeProfile(s.input, field), new RegExp(row));
  } finally {
    s.dispose();
  }
});

test("WO-051 source-change mount accepts scratch worktrees and rejects root, prefix and symlink escapes", () => {
  const s = scratch();
  try {
    const { request: r } = s;
    const plain = join(s.input.worktreeParent, "plain");
    mkdirSync(plain);
    const sub = join(r.cwd, "sub");
    mkdirSync(sub);
    const outside = join(s.root, "trees-lookalike");
    mkdirSync(outside);
    const alias = join(s.input.worktreeParent, "alias");
    symlinkSync(r.cwd, alias);
    for (const cwd of [
      s.input.launchpadCheckout,
      plain,
      sub,
      outside,
      alias,
      s.root,
    ]) {
      const profile: SourceChangeProfile = {
        ...r.profile,
        mounts: [{ path: cwd, access: "read-write" }],
        writableSurfaces: [cwd],
      };
      assert.throws(() =>
        validateSourceChangeEnvironment(profile, cwd, r.commitMessagePath),
      );
    }
    const escapedMessage = join(r.cwd, "escaped-message");
    symlinkSync(join(s.input.launchpadCheckout, "fixture.txt"), escapedMessage);
    assert.throws(
      () =>
        canonicalWorkerArgs(
          "claude-cli-print",
          { ...r, commitMessagePath: escapedMessage },
          "/schema.json",
        ),
      /profile-refused/,
    );
    assert.throws(
      () =>
        validateWriterRequest({
          ...r,
          profile: { ...r.profile, launchpadCheckout: sub },
        }),
      /profile-refused/,
    );
    assert.doesNotThrow(() =>
      validateSourceChangeEnvironment(r.profile, r.cwd, r.commitMessagePath),
    );
  } finally {
    s.dispose();
  }
});

test("WO-051 C-W2/C-W3/C-W8/C-W9 and X-W1/X-W2/X-W8 canonical writer shapes", () => {
  const s = scratch();
  try {
    const pinned = JSON.parse(
      readFileSync(
        new URL("../../fixtures/wo051-writer-args.json", import.meta.url),
        "utf8",
      ),
    );
    for (const [name, key] of [
      ["claude-cli-print", "claude"],
      ["codex-cli-exec", "codex"],
    ] as const) {
      const args = canonicalWorkerArgs(
        name,
        s.request,
        "/schema.json",
        key === "claude" ? "2.1.270" : "0.154.0",
      );
      assert.deepEqual(
        args.map((arg) => arg.replaceAll(s.request.cwd, "<worktree>")),
        pinned[key].args,
      );
    }
    const args = canonicalWorkerArgs(
      "claude-cli-print",
      s.request,
      "/schema.json",
    );
    assert.equal(
      args[args.indexOf("--allowedTools") + 1]?.match(/Bash\(/g)?.length,
      3,
    );
    const prompt = JSON.parse(writerPrompt(s.request));
    assert.equal(
      prompt.commitCommand,
      `git commit -F ${s.request.commitMessagePath}`,
    );
    assert.equal(prompt.testCommand, s.request.testCommand);
    assert.match(prompt.outputInstructions, /Never compose a commit message/);
    assert.match(prompt.outputInstructions, /\.claude\/.*\.dotln\//);
  } finally {
    s.dispose();
  }
});

const processFixture = fileURLToPath(
  new URL("../../fixtures/writer-cli.mjs", import.meta.url),
);
const runner =
  (
    transport: "claude" | "codex",
    behavior: string,
    launches: WorkerLaunch[],
  ): ProcessRunner =>
  (launch) => {
    launches.push(launch);
    return runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: [processFixture, transport, behavior],
    });
  };

for (const name of ["claude", "codex"] as const) {
  test(`WO-051 ${name} subprocess observes committed and C-K1 edited-uncommitted outcomes`, async () => {
    const s = scratch();
    try {
      const r = s.request;
      const baselineHead = git(r.cwd, "rev-parse", "HEAD");
      for (const behavior of ["dirty", "commit"] as const) {
        const launches: WorkerLaunch[] = [];
        const transport =
          name === "claude"
            ? new ClaudeCliPrintWorkOrderTransport(
                runner(name, behavior, launches),
                "2.1.270",
              )
            : new CodexCliExecWorkOrderTransport(
                runner(name, behavior, launches),
                "0.154.0",
              );
        const dispatch = transport.dispatch(r, () => 10);
        assert.equal((await dispatch.receipt).commandId, r.command.commandId);
        const result = await dispatch.completed;
        assert.equal(
          result.envelope.observedDenials,
          name === "claude" ? 1 : "unavailable",
        );
        assert.equal(result.envelope.workOrderId, r.workOrder.workOrderId);
        assert.equal(result.envelope.episodeId, r.episodeId);
        assert.equal(result.envelope.status, "completed");
        assert.equal(result.envelope.resultId, `result_${r.command.commandId}`);
        assert.equal(result.envelope.summary, "Synthetic source change.");
        assert.equal(result.envelope.requiresHuman, false);
        assert.equal(launches.length, 1);
        assert.equal(launches[0]?.cwd, r.cwd);
        if (behavior === "dirty") {
          assert.equal(result.envelope.observedCommit, undefined);
          assert.equal(git(r.cwd, "rev-parse", "HEAD"), baselineHead);
          assert.match(git(r.cwd, "status", "--porcelain"), /M fixture.txt/);
        } else {
          assert.deepEqual(result.envelope.observedCommit, {
            sha: git(r.cwd, "rev-parse", "HEAD"),
            branch: "writer",
          });
          assert.notEqual(result.envelope.observedCommit?.sha, baselineHead);
          assert.equal(
            git(r.cwd, "log", "-1", "--format=%B"),
            "fixture source change",
          );
          assert.equal(git(r.cwd, "status", "--porcelain"), "");
          const store = new WorkerStore(join(s.root, "store"));
          store.acquire();
          try {
            store.saveResult(r, result);
            assert.deepEqual(
              store.loadResult({ ...r, episodeId: "retry" }),
              result,
            );
            assert.equal(
              workerRequestKey(r),
              workerRequestKey({ ...r, episodeId: "retry" }),
            );
            for (const change of [
              { testCommand: "npm test" },
              { commitMessagePath: join(r.cwd, "different-message") },
              { profile: { ...r.profile, worktreeParent: s.root } },
            ]) {
              assert.notEqual(
                workerRequestKey(r),
                workerRequestKey({ ...r, ...change }),
              );
              assert.throws(
                () => store.loadResult({ ...r, ...change }),
                /different request/,
              );
            }
          } finally {
            store.release();
          }
        }
      }
      assert.equal(
        readFileSync(r.commitMessagePath, "utf8"),
        "fixture source change\n",
      );
    } finally {
      s.dispose();
    }
  });
  test(`WO-051 ${name} malformed, spoofed and failed vendor output never becomes a writer result`, async () => {
    const s = scratch();
    try {
      for (const behavior of [
        "spoof",
        "wrong-id",
        "failed-wire",
        "nonzero",
        ...(name === "claude" ? ["missing-denials"] : []),
      ]) {
        const transport =
          name === "claude"
            ? new ClaudeCliPrintWorkOrderTransport(
                runner(name, behavior, []),
                "2.1.270",
              )
            : new CodexCliExecWorkOrderTransport(
                runner(name, behavior, []),
                "0.154.0",
              );
        await assert.rejects(
          transport.dispatch(s.request, () => 1).completed,
          /invalid-result|transport-failed/,
        );
      }
    } finally {
      s.dispose();
    }
  });
}

test("WO-051 strict writer parser keeps observations host-owned and validates stored fields", () => {
  const s = scratch();
  try {
    const wire = {
      envelope: {
        workOrderId: s.request.workOrder.workOrderId,
        episodeId: s.request.episodeId,
        status: "blocked",
        resultId: `result_${s.request.command.commandId}`,
        summary: "Blocked fixture.",
        requiresHuman: true,
      },
    };
    const result = parseWriterResult(wire, s.request, { observedDenials: 0 });
    assert.equal(result.envelope.observedDenials, 0);
    assert.equal(result.envelope.status, "blocked");
    assert.equal(result.envelope.requiresHuman, true);
    assert.throws(
      () =>
        parseWriterResult(
          { envelope: { ...wire.envelope, status: ["completed"] } },
          s.request,
          { observedDenials: 0 },
        ),
      /invalid-result/,
    );
    for (const observedDenials of [-1, 1.5, "0", null])
      assert.throws(
        () =>
          parseStoredWriterResult(
            { envelope: { ...result.envelope, observedDenials } },
            s.request,
          ),
        /invalid-result/,
      );
    assert.throws(
      () => parseWriterResult(result, s.request, { observedDenials: 0 }),
      /invalid-result/,
    );
    assert.throws(
      () =>
        parseStoredWriterResult(
          {
            envelope: {
              ...result.envelope,
              observedCommit: { sha: "bad", branch: "writer" },
            },
          },
          s.request,
        ),
      /invalid-result/,
    );
  } finally {
    s.dispose();
  }
});
