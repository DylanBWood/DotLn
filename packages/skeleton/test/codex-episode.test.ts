import test from "node:test";
import assert from "node:assert/strict";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  chmodSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import {
  CODEX_EXEC_SHARED_FLAGS,
  assertCodexIsolationUnchanged,
  CodexCliExecWorkOrderTransport,
  codexDigestPairEqual,
  codexExecArgv,
  codexTrustTable,
  runWorkerProcess,
  STALE_CODEX_HOME_MS,
  staleCodexEpisodeHomes,
  startCodexEpisode,
  userCodexHome,
  type CodexEpisodeIsolation,
  type WorkerLaunch,
} from "../src/worker-transport.js";
import { runWorkerDemo } from "../src/worker-demo.js";
import { WorkerStore } from "../src/worker-store.js";
import type { FixtureTree } from "../src/scenario.js";

const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/repo-tree.json", import.meta.url),
    "utf8",
  ),
) as FixtureTree;
const codexHomeFixture = fileURLToPath(
  new URL("../../fixtures/codex-home-cli.mjs", import.meta.url),
);
const SECRET = "SYNTHETIC_AUTH_SECRET_WO159";
const USER_CONFIG = [
  'model = "fixture-model"',
  "",
  '[projects."/fixture/already-trusted"]',
  'trust_level = "trusted"',
  "",
  "[tui]",
  "notifications = false",
  "",
].join("\n");
const temporary = () =>
  realpathSync(mkdtempSync(join(tmpdir(), "dotln-codex-episode-test-")));
/** A fixture operator: a user-level Codex home with config and auth. */
const operator = () => {
  const root = temporary();
  const user = join(root, "user-codex");
  mkdirSync(user, { mode: 0o700 });
  writeFileSync(join(user, "config.toml"), USER_CONFIG, { mode: 0o600 });
  writeFileSync(
    join(user, "auth.json"),
    JSON.stringify({ tokens: { access_token: SECRET } }),
    { mode: 0o600 },
  );
  const env: NodeJS.ProcessEnv = { ...process.env, CODEX_HOME: user };
  return { root, user, env };
};
const filesUnder = (directory: string): string[] =>
  readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));

test("WO-159 one builder owns the shared Codex exec flags", () => {
  assert.deepEqual(
    codexExecArgv({ approval: "never", rest: ["--json", "-"] }),
    ["-a", "never", "exec", ...CODEX_EXEC_SHARED_FLAGS, "--json", "-"],
  );
  assert.deepEqual(
    codexExecArgv({ leading: ["--skip-git-repo-check"], rest: ["-"] }),
    [
      "exec",
      "--skip-git-repo-check",
      "--ephemeral",
      "--ignore-user-config",
      "-",
    ],
  );
});

test("WO-159 the trust-table projection keeps only [projects] lines", () => {
  assert.equal(
    codexTrustTable(USER_CONFIG),
    '[projects."/fixture/already-trusted"]\ntrust_level = "trusted"\n',
  );
  assert.equal(
    codexTrustTable(
      'projects."/a".trust_level = "trusted"\n[projects]\n"/b" = { trust_level = "trusted" }\n[[profiles.x]]\nk = 1\n',
    ),
    'projects."/a".trust_level = "trusted"\n[projects]\n"/b" = { trust_level = "trusted" }',
  );
  assert.equal(codexTrustTable('model = "m"\n[tui]\nx = 1\n'), "");
  // Inline root tables, literal keys and quoted brackets are trust lines too.
  const inline = 'projects = { "/a" = { trust_level = "trusted" } }';
  assert.equal(codexTrustTable(`model = "m"\n${inline}\n[tui]\n`), inline);
  assert.equal(
    codexTrustTable('[\'projects\'."/a[1]"]\ntrust_level = "trusted"\n[tui]\n'),
    '[\'projects\'."/a[1]"]\ntrust_level = "trusted"',
  );
  // A multi-line array's element lines are not table headers.
  assert.equal(
    codexTrustTable(
      'list = [\n  ["a"],\n  ["b"],\n]\nprojects."/c".trust_level = "trusted" # [x]\n[profiles.p.projects]\nk = 1\n',
    ),
    'projects."/c".trust_level = "trusted" # [x]',
  );
});

test("WO-159 the user-level Codex home follows CODEX_HOME, then HOME", () => {
  assert.equal(userCodexHome({ CODEX_HOME: "/codex-home" }), "/codex-home");
  assert.equal(userCodexHome({ HOME: "/home/o" }), "/home/o/.codex");
  assert.equal(
    userCodexHome({ CODEX_HOME: " ", HOME: "/home/o" }),
    "/home/o/.codex",
  );
});

test("WO-159 an episode isolates CODEX_HOME, links auth and removes the home", () => {
  const { root, user, env } = operator();
  try {
    const episode = startCodexEpisode(env);
    const home = episode.env.CODEX_HOME!;
    assert.notEqual(home, user);
    assert.ok(
      home.startsWith(tmpdir()) || home.startsWith(realpathSync(tmpdir())),
    );
    assert.equal(statSync(home).mode & 0o777, 0o700);
    const link = join(home, "auth.json");
    assert.ok(lstatSync(link).isSymbolicLink());
    assert.deepEqual(readdirSync(home), ["auth.json"]);
    // Everything else in the caller's environment is kept.
    assert.equal(episode.env.PATH, env.PATH);
    const record = episode.finish();
    assert.equal(existsSync(home), false);
    assert.equal(record.homeRemoved, true);
    assert.equal(record.authentication, "symlink");
    assert.equal(record.isolatedTrustEntries, null);
    assert.ok(codexDigestPairEqual(record.userConfig));
    assert.ok(codexDigestPairEqual(record.trustTable));
    assert.match(record.home, /^sha256:[0-9a-f]{64}$/u);
    assert.equal(episode.finish(), record);
    // The operator's auth file survives removal of the link.
    assert.ok(readFileSync(join(user, "auth.json"), "utf8").includes(SECRET));
    assert.ok(!JSON.stringify(record).includes(SECRET));
    assert.ok(!JSON.stringify(record).includes(home));
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-159 a user-level change is recorded as an unequal pair; absent stays equal", () => {
  const { root, user, env } = operator();
  try {
    const episode = startCodexEpisode(env);
    appendFileSync(
      join(user, "config.toml"),
      '[projects."/escaped"]\ntrust_level = "trusted"\n',
    );
    const changed = episode.finish();
    assert.equal(codexDigestPairEqual(changed.userConfig), false);
    assert.equal(codexDigestPairEqual(changed.trustTable), false);
    rmSync(join(user, "config.toml"));
    rmSync(join(user, "auth.json"));
    const absent = startCodexEpisode(env).finish();
    assert.deepEqual(absent.userConfig, { before: "absent", after: "absent" });
    assert.ok(codexDigestPairEqual(absent.userConfig));
    assert.equal(absent.authentication, "absent");
    assert.equal(
      codexDigestPairEqual({ before: "unknown", after: "unknown" }),
      false,
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-159 AC1 a fake codex that trusts its target leaves the user-level file byte-identical", async () => {
  const { root, user, env } = operator();
  const before = readFileSync(join(user, "config.toml"));
  const launches: WorkerLaunch[] = [];
  const isolations: Promise<CodexEpisodeIsolation>[] = [];
  let stderr = "";
  const transport = new CodexCliExecWorkOrderTransport(
    (launch) => {
      launches.push(launch);
      const running = runWorkerProcess({
        ...launch,
        binary: process.execPath,
        args: [codexHomeFixture, "codex-cli-exec", "success", ...launch.args],
      });
      void running.completed.then((output) => (stderr += output.stderr));
      return running;
    },
    "0.156.1",
    undefined,
    env,
  );
  const store = join(root, "store");
  try {
    const result = await runWorkerDemo({
      directory: store,
      fixture,
      transport: {
        name: transport.name,
        harnessVersion: transport.harnessVersion,
        dispatch: (request, now) => {
          const dispatch = transport.dispatch(request, now);
          if (dispatch.isolation) isolations.push(dispatch.isolation);
          return dispatch;
        },
      },
      model: "gpt-6-astra",
      effort: "high",
    });
    assert.equal(result.envelope.status, "completed");
    assert.equal(launches.length, 1);
    const home = launches[0]!.env!.CODEX_HOME!;
    assert.notEqual(home, user);
    assert.equal(existsSync(home), false, "the isolated home is gone");
    assert.deepEqual(readFileSync(join(user, "config.toml")), before);
    assert.equal(isolations.length, 1);
    const record = await isolations[0]!;
    assert.ok(codexDigestPairEqual(record.userConfig));
    assert.ok(codexDigestPairEqual(record.trustTable));
    assert.equal(
      record.isolatedTrustEntries,
      1,
      "the CLI's trust write stayed inside",
    );
    assert.equal(record.homeRemoved, true);
    // The auth bytes reach no record, store or log.
    assert.ok(!JSON.stringify(record).includes(SECRET));
    assert.ok(!stderr.includes(SECRET));
    for (const file of filesUnder(store))
      assert.ok(!readFileSync(file, "utf8").includes(SECRET), file);
    const events = decodeLog(new WorkerStore(store).read());
    assert.ok(events.some((event) => event.type === "WorkerCompleted"));
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("WO-159 stale episode homes are those of exited launchers; the next launch removes them", async () => {
  const root = temporary();
  try {
    const exited = spawnSync(process.execPath, ["-e", ""]).pid!;
    const stale = join(root, `dotln-codex-home-${exited}-abc123`);
    const own = join(root, `dotln-codex-home-${process.pid}-def456`);
    const parent = join(root, `dotln-codex-home-${process.ppid}-ghi789`);
    const unrelated = join(root, "dotln-codex-home-notapid");
    const recent = join(root, `dotln-codex-home-${exited}-recent`);
    for (const path of [stale, own, parent, unrelated, recent]) mkdirSync(path);
    // A detached Codex may outlive its launcher: only an old home is stale.
    const old = (Date.now() - STALE_CODEX_HOME_MS - 60_000) / 1000;
    for (const path of [stale, own, parent, unrelated])
      utimesSync(path, old, old);
    assert.deepEqual(staleCodexEpisodeHomes(root), [stale]);
    assert.deepEqual(staleCodexEpisodeHomes(join(root, "absent")), []);
  } finally {
    rmSync(root, { recursive: true });
  }
  // A launch sweeps system temp before building its own home.
  const exited = spawnSync(process.execPath, ["-e", ""]).pid!;
  const left = join(tmpdir(), `dotln-codex-home-${exited}-wo159test`);
  mkdirSync(left, { mode: 0o700 });
  const old = (Date.now() - STALE_CODEX_HOME_MS - 60_000) / 1000;
  utimesSync(left, old, old);
  const { root: operatorRoot, env } = operator();
  try {
    const episode = startCodexEpisode(env);
    assert.equal(existsSync(left), false);
    assert.ok(
      episode.env.CODEX_HOME!.includes(`dotln-codex-home-${process.pid}-`),
    );
    episode.finish();
  } finally {
    rmSync(left, { recursive: true, force: true });
    rmSync(operatorRoot, { recursive: true });
  }
});

test("WO-159 AC2 only the launcher's file carries the shared Codex exec flags", () => {
  const repository = fileURLToPath(new URL("../../../../", import.meta.url));
  // The order's literal pathspec 'packages/*/src' matches no file in Git's
  // wildcard semantics; this is the pathspec that reaches package sources.
  const listed = spawnSync(
    "git",
    [
      "grep",
      "-l",
      "-e",
      '"--ephemeral"',
      "--",
      ":(glob)packages/*/src/**",
      "scripts",
    ],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(listed.status, 0, listed.stderr);
  assert.deepEqual(listed.stdout.trim().split("\n"), [
    "packages/skeleton/src/worker-transport.ts",
  ]);
});

test("WO-159 a home that cannot be removed is recorded, not thrown", () => {
  const { root, env } = operator();
  const episode = startCodexEpisode(env);
  const home = episode.env.CODEX_HOME!;
  mkdirSync(join(home, "tmp", "arg0"), { recursive: true });
  chmodSync(join(home, "tmp"), 0o500);
  try {
    const record = episode.finish();
    assert.equal(record.homeRemoved, false);
    assert.ok(codexDigestPairEqual(record.userConfig));
    assert.throws(
      () => assertCodexIsolationUnchanged([record]),
      /home was not removed/u,
    );
  } finally {
    chmodSync(join(home, "tmp"), 0o700);
    rmSync(home, { recursive: true, force: true });
    rmSync(root, { recursive: true });
  }
});
