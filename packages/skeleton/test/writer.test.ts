import test from "node:test";
import {
  prepareSourceObjectStore,
  sourceObjectEnvironment,
} from "../src/source-change-worktree.js";
import { fixtureObjectEnvironment } from "./source-change-fixture.js";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
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

import { contributorProgram } from "../src/loadouts/contributor.js";
import {
  confinedTestCommand,
  toolchainReadRoots,
  writerSandboxProfilePath,
} from "../src/discovery-sandbox.js";

test("WO-161 the bounded Contributor label retains the writer's authority limits", () => {
  const { authorityEnvelope } = contributorProgram().loadout;
  assert.equal(authorityEnvelope.authorityEnvelopeId, "contributor.bounded");
  assert.deepEqual(authorityEnvelope.allowedEffects, [
    "repo.read",
    "repo.write",
    "shell.run",
    "git.local",
    "lifecycle.run",
    "outside.write:host-scratchpad",
    "outside.write:session-scratch",
    "outside.write:system-temp",
  ]);
  assert.deepEqual(authorityEnvelope.deniedEffects, [
    "credentials.access",
    "transport.ssh",
    "settings.user",
    "sandbox.disable",
    "remote.unapproved",
    "package.publish",
  ]);
  assert.deepEqual(authorityEnvelope.resourceLimits, { writers: 1 });
});

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
        ...fixtureObjectEnvironment(cwd),
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
  git(
    launchpad,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-m",
    "fixture baseline",
  );
  git(launchpad, "worktree", "add", "--detach", cwd);
  prepareSourceObjectStore(cwd, "writer", git(cwd, "rev-parse", "HEAD"));
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

const codexShellEnvironment = (request: WriterRequest): NodeJS.ProcessEnv => {
  const table = canonicalWorkerArgs(
    "codex-cli-exec",
    request,
    "/schema.json",
    "0.154.0",
  ).find((arg) => arg.startsWith("shell_environment_policy.set="))!;
  return Object.fromEntries(
    [...table.matchAll(/([A-Z][A-Z0-9_]*)=("(?:[^"\\]|\\.)*")/gu)].map(
      ([, key, value]) => [key!, JSON.parse(value!)],
    ),
  );
};
const claudeWriterEnvironment = (request: WriterRequest): NodeJS.ProcessEnv => {
  let captured: WorkerLaunch | undefined;
  const stop = new Error("captured before launch");
  assert.throws(
    () =>
      new ClaudeCliPrintWorkOrderTransport((launch) => {
        captured = launch;
        throw stop;
      }, "2.1.270").dispatch(request, () => 1),
    (error) => error === stop,
  );
  assert.ok(captured?.env);
  return captured.env;
};

for (const transport of ["codex", "claude"] as const)
  test(
    `WO-204 ${transport}: writer Git configuration suppresses rerere and detached maintenance`,
    { skip: transport === "codex" && process.getuid?.() === 0 },
    () => {
      const rows = [];
      for (const control of transport === "codex" ? [false, true] : [false]) {
        const s = scratch(),
          common = join(s.input.launchpadCheckout, ".git");
        try {
          git(s.request.cwd, "config", "rerere.enabled", "true");
          git(s.request.cwd, "config", "commit.gpgsign", "false");
          git(s.request.cwd, "config", "core.hooksPath", "/dev/null");
          git(s.request.cwd, "pack-refs", "--all");
          rmSync(join(common, "rr-cache"), { recursive: true, force: true });
          const env =
            transport === "codex"
              ? codexShellEnvironment(s.request)
              : claudeWriterEnvironment(s.request);
          if (control)
            for (const key of Object.keys(env))
              if (key.startsWith("GIT_CONFIG_")) delete env[key];
          const trace = join(s.root, "trace.jsonl");
          const runEnv = {
            ...env,
            GIT_AUTHOR_NAME: "Fixture",
            GIT_AUTHOR_EMAIL: "fixture@example.invalid",
            GIT_COMMITTER_NAME: "Fixture",
            GIT_COMMITTER_EMAIL: "fixture@example.invalid",
            GIT_TRACE2_EVENT: trace,
          };
          writeFileSync(
            join(s.request.cwd, "fixture.txt"),
            "changed by synthetic worker\n",
          );
          if (transport === "codex") chmodSync(common, 0o555);
          const add = spawnSync("git", ["add", "-A"], {
            cwd: s.request.cwd,
            env: runEnv,
            encoding: "utf8",
          });
          assert.equal(add.status, 0, add.stderr);
          const commit = spawnSync(
            "git",
            ["commit", "-F", s.request.commitMessagePath],
            { cwd: s.request.cwd, env: runEnv, encoding: "utf8" },
          );
          const childStarts = readFileSync(trace, "utf8")
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line))
            .filter(
              (row) =>
                row.event === "child_start" &&
                row.argv?.includes("maintenance"),
            );
          rows.push({
            control,
            exitCode: commit.status,
            rrCache: existsSync(join(common, "rr-cache")),
            maintenance: childStarts.length,
          });
        } finally {
          chmodSync(common, 0o755);
          s.dispose();
        }
      }
      assert.deepEqual(
        rows,
        transport === "codex"
          ? [
              { control: false, exitCode: 0, rrCache: false, maintenance: 0 },
              { control: true, exitCode: 128, rrCache: false, maintenance: 0 },
            ]
          : [{ control: false, exitCode: 0, rrCache: false, maintenance: 0 }],
      );
    },
  );

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
    const profileFile = writerSandboxProfilePath(
      s.request.profile.launchpadCheckout,
      s.request.cwd,
    );
    const confined = confinedTestCommand(
      s.request.cwd,
      s.request.testCommand,
      profileFile,
    );
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
      const launched = canonicalWorkerArgs(
        name,
        s.request,
        "/schema.json",
        key === "claude" ? "2.1.270" : "0.154.0",
      );
      // The writer grants and shell environment specialize the pinned launch;
      // the named profile takes the place of the inspection sandbox option.
      if (key === "codex") assert.equal(launched.includes("--sandbox"), false);
      const args =
        key === "codex"
          ? [
              ...launched.slice(0, launched.indexOf("--strict-config")),
              "--sandbox",
              "workspace-write",
              ...launched.slice(launched.indexOf("--strict-config")),
            ].flatMap((arg, index, all) =>
              arg.startsWith("shell_environment_policy.set=") ||
              all[index + 1]?.startsWith("shell_environment_policy.set=")
                ? []
                : arg.startsWith("permissions.dotln-writer.filesystem=")
                  ? [
                      'permissions.dotln-writer.filesystem={":minimal"="read",":workspace_roots"="write"}',
                    ]
                  : [arg],
            )
          : launched;
      if (key === "codex") {
        const grants = launched.find((arg) =>
          arg.startsWith("permissions.dotln-writer.filesystem="),
        )!;
        const gitDir = realpathSync(
          execFileSync(
            "git",
            ["rev-parse", "--path-format=absolute", "--git-dir"],
            {
              cwd: s.request.cwd,
              encoding: "utf8",
            },
          ).trim(),
        );
        const common = realpathSync(
          execFileSync(
            "git",
            ["rev-parse", "--path-format=absolute", "--git-common-dir"],
            { cwd: s.request.cwd, encoding: "utf8" },
          ).trim(),
        );
        for (const [path, mode] of [
          [gitDir, "write"],
          [
            sourceObjectEnvironment(s.request.cwd).GIT_OBJECT_DIRECTORY,
            "write",
          ],
          [common, "read"],
        ])
          assert.ok(
            grants.includes(`${JSON.stringify(path)}=${JSON.stringify(mode)}`),
            `${path} ${mode}`,
          );
        // Codex's helper aliases live under the episode home; only that
        // directory is granted, never the home and its credentials.
        const home = realpathSync(
          mkdtempSync(join(tmpdir(), "dotln-codex-home-test-")),
        );
        try {
          const withHome = canonicalWorkerArgs(
            "codex-cli-exec",
            s.request,
            "/schema.json",
            "0.154.0",
            home,
          ).find((arg) =>
            arg.startsWith("permissions.dotln-writer.filesystem="),
          )!;
          assert.ok(
            withHome.includes(
              `${JSON.stringify(join(home, "tmp", "arg0"))}="read"`,
            ),
          );
          assert.equal(withHome.includes(`${JSON.stringify(home)}=`), false);
          assert.ok(existsSync(join(home, "tmp", "arg0")));
        } finally {
          rmSync(home, { recursive: true, force: true });
        }
        // The whole grant set, pinned: toolchain, Git and Codex installs,
        // the user's Git identity, shared metadata read; the worktree's own
        // gitdir and its private objects written.
        const installed = (name: string) => {
          try {
            return realpathSync(
              execFileSync("/usr/bin/which", [name], {
                encoding: "utf8",
              }).trim(),
            );
          } catch {
            return undefined;
          }
        };
        const codexBinary = installed("codex");
        assert.deepEqual(
          [...grants.matchAll(/("(?:[^"\\]|\\.)*")=("read"|"write")/gu)].map(
            ([, path, mode]) => [JSON.parse(path!), JSON.parse(mode!)],
          ),
          [
            [":minimal", "read"],
            [":workspace_roots", "write"],
            ...toolchainReadRoots().map((root) => [root, "read"]),
            [dirname(dirname(installed("git")!)), "read"],
            ...(codexBinary ? [[dirname(dirname(codexBinary)), "read"]] : []),
            [join(homedir(), ".gitconfig"), "read"],
            [common, "read"],
            [gitDir, "write"],
            [
              sourceObjectEnvironment(s.request.cwd).GIT_OBJECT_DIRECTORY,
              "write",
            ],
          ],
        );
        for (const [path] of grants.matchAll(/"((?:[^"\\]|\\.)*)"=/gu))
          assert.ok(
            path !== "/" && !`${homedir()}/`.startsWith(`${path}/`),
            `${path} never covers the home directory`,
          );
        // A main checkout's gitdir holds the shared hooks and config; one
        // that passes the mount checks is still refused its grants.
        const main = realpathSync(
          mkdtempSync(join(s.request.profile.worktreeParent, "main-")),
        );
        try {
          execFileSync("git", ["init", "--quiet"], { cwd: main });
          writeFileSync(join(main, "message.txt"), "Synthetic\n");
          assert.throws(
            () =>
              canonicalWorkerArgs(
                "codex-cli-exec",
                {
                  ...s.request,
                  cwd: main,
                  commitMessagePath: join(main, "message.txt"),
                  profile: {
                    ...s.request.profile,
                    mounts: [{ path: main, access: "read-write" }],
                    writableSurfaces: [main],
                  },
                },
                "/schema.json",
                "0.154.0",
              ),
            /writer needs a linked worktree/u,
          );
        } finally {
          rmSync(main, { recursive: true, force: true });
        }
        // Hooks and config are never writable, and the network stays off.
        assert.equal(
          grants.includes(`${JSON.stringify(common)}="write"`),
          false,
        );
        for (const entry of [
          "objects",
          "refs",
          "logs",
          "packed-refs",
          "packed-refs.lock",
          "rr-cache",
        ])
          assert.equal(
            grants.includes(`${JSON.stringify(join(common, entry))}="write"`),
            false,
          );
        const environment = codexShellEnvironment(s.request);
        const { PATH, ...gitEnvironment } = environment;
        assert.ok(PATH?.includes(dirname(realpathSync(process.execPath))));
        assert.deepEqual(gitEnvironment, {
          ...sourceObjectEnvironment(s.request.cwd),
          GIT_CONFIG_COUNT: "2",
          GIT_CONFIG_KEY_0: "rerere.enabled",
          GIT_CONFIG_VALUE_0: "false",
          GIT_CONFIG_KEY_1: "maintenance.auto",
          GIT_CONFIG_VALUE_1: "false",
        });
        assert.ok(
          launched.includes("permissions.dotln-writer.network.enabled=false"),
        );
        assert.match(
          launched.find((arg) =>
            arg.startsWith("shell_environment_policy.set="),
          )!,
          new RegExp(
            dirname(realpathSync(process.execPath)).replaceAll("/", "\\/"),
          ),
        );
      }
      assert.deepEqual(
        args.map((arg) =>
          arg
            .replace(confined, s.request.testCommand)
            .replaceAll(s.request.cwd, "<worktree>"),
        ),
        // Live evidence (WO-122) corrects exactly this inherited inspection
        // disable. Preserve the historical WO-051 fixture and every other arg.
        key === "codex"
          ? pinned[key].args.filter(
              (arg: string, index: number, all: string[]) =>
                arg !== "code_mode_host" &&
                !(arg === "--disable" && all[index + 1] === "code_mode_host"),
            )
          : [
              ...pinned[key].args
                .filter(
                  (arg: string) =>
                    !["--verbose", "--include-hook-events"].includes(arg),
                )
                .map((arg: string) => (arg === "stream-json" ? "json" : arg)),
              "--json-schema",
              JSON.stringify(transportResultSchema(s.request)),
            ],
      );
    }
    const args = canonicalWorkerArgs(
      "claude-cli-print",
      s.request,
      "/schema.json",
    );
    assert.equal(
      args[args.indexOf("--allowedTools") + 1],
      `Edit,Write,Read,Bash(${confined}),Bash(git add -A),Bash(git commit -F ${s.request.commitMessagePath})`,
    );
    const inherited = Object.fromEntries(
      Object.entries(process.env).filter(([key]) =>
        key.startsWith("GIT_CONFIG_"),
      ),
    );
    try {
      Object.assign(process.env, {
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: "rerere.enabled",
        GIT_CONFIG_VALUE_0: "true",
        GIT_CONFIG_KEY_99: "maintenance.auto",
        GIT_CONFIG_VALUE_99: "true",
      });
      const environment = claudeWriterEnvironment(s.request);
      assert.deepEqual(
        Object.fromEntries(
          Object.entries(environment).filter(([key]) =>
            key.startsWith("GIT_CONFIG_"),
          ),
        ),
        {
          GIT_CONFIG_COUNT: "2",
          GIT_CONFIG_KEY_0: "rerere.enabled",
          GIT_CONFIG_VALUE_0: "false",
          GIT_CONFIG_KEY_1: "maintenance.auto",
          GIT_CONFIG_VALUE_1: "false",
        },
      );
      for (const [key, value] of Object.entries(
        sourceObjectEnvironment(s.request.cwd),
      ))
        assert.equal(environment[key], value);
    } finally {
      for (const key of Object.keys(process.env))
        if (key.startsWith("GIT_CONFIG_")) delete process.env[key];
      Object.assign(process.env, inherited);
    }
    assert.ok(!args[args.indexOf("--allowedTools") + 1]!.includes("*"));
    assert.ok(
      s.request.profile.writableSurfaces.every(
        (root) => !profileFile.startsWith(`${root}/`),
      ),
    );
    assert.throws(
      () => confinedTestCommand(s.request.cwd, "node *.mjs", profileFile),
      /asterisk.*refuses wildcards/u,
    );
    assert.throws(
      () =>
        canonicalWorkerArgs(
          "claude-cli-print",
          { ...s.request, testCommand: "node *.mjs" },
          "/schema.json",
        ),
      /asterisk.*refuses wildcards/u,
    );
    const prompt = JSON.parse(writerPrompt(s.request));
    assert.equal(
      prompt.commitCommand,
      `git commit -F ${s.request.commitMessagePath}`,
    );
    assert.equal(prompt.testCommand, confined);
    // Codex's own sandbox confines the declared command; a nested sandbox-exec
    // cannot start inside it, so Codex is given the declared command itself.
    assert.equal(
      JSON.parse(writerPrompt(s.request, "codex-cli-exec")).testCommand,
      s.request.testCommand,
    );
    assert.match(prompt.outputInstructions, /Never compose a commit message/);
    assert.match(prompt.outputInstructions, /\.claude\/.*\.dotln\//);
    assert.match(
      prompt.inspectionInstructions,
      /cat -- <worktree-relative-file>/,
    );
    assert.match(
      prompt.inspectionInstructions,
      /git rev-parse --show-toplevel/,
    );
    assert.match(prompt.inspectionInstructions, /no shell composition/i);
    assert.match(prompt.outputInstructions, /only effectful shell commands/);
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
        ...(name === "claude"
          ? ["missing-denials", "missing-structured", "invalid-structured"]
          : []),
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
