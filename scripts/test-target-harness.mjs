import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { runGit } from "./lib/git.mjs";
import { json, write, sha256Hex as digest } from "./lib/helpers.mjs";
import test from "./lib/test-shards.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  linkSync,
  renameSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  emitTargetHarness,
  checkTargetHarness,
  removeTargetHarness,
  runtimeModuleDirectory,
  SETTINGS_FRAGMENT,
} from "./lib/harness.mjs";
import {
  compileFeedbackUnits,
  fnv1a64,
} from "../packages/compiler/dist/src/index.js";
import { personalFeedbackUnits } from "../packages/skeleton/dist/src/loadouts/feedback.js";
import { targetWorkerProfiles } from "../packages/skeleton/dist/src/loadouts/contributor.js";
import {
  ResidentStore,
  replayResident,
} from "../packages/skeleton/dist/src/resident-store.js";
import {
  feedbackBoundary,
  FeedbackRefused,
} from "../packages/skeleton/dist/src/feedback-boundary.js";

const source = fileURLToPath(new URL("../", import.meta.url));
const fixtureGitOptions = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
const manifestPath = ".claude/target-worker-manifest.json";
const tree = (root, path = "") =>
  Object.fromEntries(
    readdirSync(join(root, path), { withFileTypes: true })
      .filter((entry) => entry.name !== ".git")
      .flatMap((entry) => {
        const relative = path ? `${path}/${entry.name}` : entry.name;
        return entry.isDirectory()
          ? Object.entries(tree(root, relative))
          : [[relative, readFileSync(join(root, relative), "utf8")]];
      }),
  );
function fixture(unrelated = false) {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-target-fixture-")),
  );
  const target = join(base, "target");
  const launchpad = join(base, "launchpad with space # unicode-é");
  mkdirSync(target);
  mkdirSync(launchpad);
  runGit(target, ["init", "-b", "fixture-target"], fixtureGitOptions);
  excludeFixtureOwnership(target);
  write(target, "source.txt", "fixture\n");
  if (unrelated) write(target, ".claude/unrelated.txt", "preserve\n");
  runGit(target, ["add", "."], fixtureGitOptions);
  runGit(
    target,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "Fixture base",
    ],
    fixtureGitOptions,
  );
  for (const name of readdirSync(join(source, "packages"))) {
    const modules = runtimeModuleDirectory(join(source, "packages", name));
    if (!modules) continue;
    mkdirSync(join(launchpad, "packages", name), { recursive: true });
    cpSync(
      join(source, "packages", name, "package.json"),
      join(launchpad, "packages", name, "package.json"),
    );
    cpSync(
      join(source, "packages", name, modules),
      join(launchpad, "packages", name, modules),
      { recursive: true },
    );
  }
  return {
    base,
    target,
    launchpad,
    options: { runtimeRoot: launchpad },
    lane: join(launchpad, "docs/control/local/harness/targets", digest(target)),
  };
}
function invoke(f, name, tool, session = "fixture-writer", environment = {}) {
  const result = spawnSync(
    process.execPath,
    [join(f.target, `.claude/hooks/${name}.mjs`)],
    {
      cwd: f.target,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PID: String(process.pid), ...environment },
      input: JSON.stringify({
        hook_event_name: "PreToolUse",
        cwd: f.target,
        session_id: session,
        tool_name: tool.name ?? "Write",
        tool_input: tool.input ?? {
          file_path: join(f.target, "allowed.txt"),
          content: "allowed\n",
        },
      }),
      timeout: 10000,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}
const denied = (response) =>
  response.hookSpecificOutput?.permissionDecision === "deny";

test("WO-049 target capabilities distinguish observed omissions from unavailable hooks", () => {
  for (const profile of targetWorkerProfiles) {
    assert.equal(profile.codexContinuation, undefined);
    // The Claude bundle holds one prompt hook, which records the operator's
    // recovery controls for its guards; the event was observed in a target
    // worktree, and no other lifecycle event is used.
    const prompt = profile.events.UserPromptSubmit;
    assert.equal(prompt.available, profile.harness === "claude-code");
    if (prompt.available) assert.match(prompt.evidence, /#C-W10$/);
    for (const event of ["PostToolUse", "Stop", "UserPromptSubmit"]) {
      const capability = profile.events[event];
      if (capability.available) continue;
      assert.equal(capability.available, false);
      if (profile.harness === "claude-code") {
        assert.match(capability.evidence, /#C-W4$/);
        assert.match(capability.reason, /Observed.*deliberately omitted/);
        assert.doesNotMatch(capability.reason, /Codex/);
      } else {
        assert.match(
          capability.evidence,
          event === "UserPromptSubmit" ? /#X-W10$/ : /#X-W4$/,
        );
        assert.match(capability.reason, /No Codex hook event was observed/);
      }
    }
    assert.equal(profile.skills.available, false);
    assert.match(profile.skills.evidence, /WO-049-target-worktree-bundle.md$/);
    assert.match(
      profile.skills.reason,
      /deliberately omitted.*no unavailability observation/,
    );
  }
});

for (const unrelated of [false, true])
  test(`WO-049 foreign target emit/check/remove preserves Git visibility and unrelated files (${unrelated})`, () => {
    const f = fixture(unrelated);
    try {
      const before = tree(f.target);
      const exclude = join(f.target, ".git/info/exclude");
      writeFileSync(exclude, "# existing without final newline");
      const original = readFileSync(exclude, "utf8");
      assert.equal(
        runGit(f.target, ["status", "--porcelain"], fixtureGitOptions),
        "",
      );
      const cli = spawnSync(
        process.execPath,
        [
          join(source, "scripts/harness.mjs"),
          "emit",
          "--target",
          f.target,
          "--runtime-root",
          f.launchpad,
        ],
        { cwd: source, encoding: "utf8" },
      );
      assert.equal(cli.status, 0, cli.stderr);
      const installed = JSON.parse(
        readFileSync(join(f.target, manifestPath), "utf8"),
      ).installed;
      // The bundle holds no presence hook (WO-276 criterion Q1); its seventh
      // file is the prompt hook that records the recovery controls.
      assert.equal(installed.length, 7);
      assert.ok(
        installed.some(
          (file) => file.path === ".claude/hooks/operator-control.mjs",
        ),
      );
      assert.ok(installed.every((file) => !file.path.includes("/presence-")));
      assert.deepEqual(
        Object.keys(tree(f.target)).sort(),
        [...Object.keys(before), ...installed.map((file) => file.path)].sort(),
      );
      for (const file of installed)
        assert.equal(
          readFileSync(exclude, "utf8")
            .split("\n")
            .filter((line) => line === `/${file.path}`).length,
          1,
        );
      assert.equal(
        runGit(f.target, ["status", "--porcelain"], fixtureGitOptions),
        "",
      );
      runGit(f.target, ["add", "-A"], fixtureGitOptions);
      assert.equal(
        runGit(
          f.target,
          ["diff", "--cached", "--name-only"],
          fixtureGitOptions,
        ),
        "",
      );
      assert.equal(checkTargetHarness(f.target, f.options).files, 7);
      const post = tree(f.target);
      emitTargetHarness(f.target, f.options);
      assert.deepEqual(tree(f.target), post);
      const path = join(f.target, "CLAUDE.local.md");
      const saved = readFileSync(path, "utf8");
      writeFileSync(path, saved + " ");
      assert.throws(() => checkTargetHarness(f.target, f.options), /drift/);
      assert.throws(() => removeTargetHarness(f.target, f.options), /drift/);
      writeFileSync(path, saved);
      unlinkSync(path);
      assert.throws(() => checkTargetHarness(f.target, f.options), /missing/);
      writeFileSync(path, saved);
      const excluded = readFileSync(exclude, "utf8");
      writeFileSync(exclude, excluded.replace("/CLAUDE.local.md\n", ""));
      assert.throws(() => checkTargetHarness(f.target, f.options), /exclude/);
      writeFileSync(exclude, excluded);
      removeTargetHarness(f.target, f.options);
      assert.deepEqual(tree(f.target), before);
      assert.equal(readFileSync(exclude, "utf8"), original);
      assert.equal(
        runGit(f.target, ["status", "--porcelain"], fixtureGitOptions),
        "",
      );
    } finally {
      rmSync(f.base, { recursive: true, force: true });
    }
  });

test("WO-049 removal preserves appended user rules and refuses duplicate exclude markers before mutation", () => {
  const f = fixture();
  try {
    const exclude = join(f.target, ".git/info/exclude");
    const original = "# user rule without final newline";
    writeFileSync(exclude, original);
    emitTargetHarness(f.target, f.options);
    const installed = readFileSync(exclude, "utf8");
    writeFileSync(exclude, installed + installed);
    const duplicated = readFileSync(exclude, "utf8");
    const before = tree(f.target);
    const receipt = readFileSync(join(f.lane, "installation.json"), "utf8");
    for (const action of [
      checkTargetHarness,
      emitTargetHarness,
      removeTargetHarness,
    ]) {
      assert.throws(() => action(f.target, f.options), /exclude block drift/);
      assert.deepEqual(tree(f.target), before);
      assert.equal(readFileSync(exclude, "utf8"), duplicated);
      assert.equal(
        readFileSync(join(f.lane, "installation.json"), "utf8"),
        receipt,
      );
    }
    writeFileSync(exclude, installed + "/my-build-output/\n");
    write(f.target, "my-build-output/bundle.js", "artifact\n");
    assert.equal(
      runGit(f.target, ["status", "--porcelain"], fixtureGitOptions),
      "",
    );
    removeTargetHarness(f.target, f.options);
    assert.equal(
      readFileSync(exclude, "utf8"),
      original + "\n/my-build-output/\n",
    );
    assert.equal(
      runGit(f.target, ["status", "--porcelain"], fixtureGitOptions),
      "",
    );
    runGit(f.target, ["add", "-A"], fixtureGitOptions);
    assert.equal(
      runGit(f.target, ["diff", "--cached", "--name-only"], fixtureGitOptions),
      "",
    );

    // A new episode observes current user lines and EOF state, not the old baseline.
    const revised = original + "\n/my-build-output/\n/CLAUDE.local.md";
    writeFileSync(exclude, revised);
    emitTargetHarness(f.target, f.options);
    assert.equal(
      readFileSync(exclude, "utf8")
        .split("\n")
        .filter((line) => line === "/CLAUDE.local.md").length,
      1,
    );
    assert.equal(checkTargetHarness(f.target, f.options).files, 7);
    removeTargetHarness(f.target, f.options);
    assert.equal(readFileSync(exclude, "utf8"), revised);

    // Do not reclaim a separator after the user has changed its prefix.
    emitTargetHarness(f.target, f.options);
    const changedPrefix = readFileSync(exclude, "utf8").replace(
      original,
      "# changed prefix",
    );
    writeFileSync(exclude, changedPrefix);
    removeTargetHarness(f.target, f.options);
    assert.equal(
      readFileSync(exclude, "utf8"),
      revised.replace(original, "# changed prefix") + "\n",
    );
  } finally {
    rmSync(f.base, { recursive: true, force: true });
  }
});

// Makes a fresh installation the one a compiler wrote while a target's bundle
// held a presence hook: the file is there, and the manifest, the launchpad's
// receipt of it and the exclude block with its registry all name it.
const earlierPresenceHook = ".claude/hooks/presence-pretooluse.mjs";
function installedWithPresenceHook(f) {
  const hash = (text) => `fnv1a64:${fnv1a64(text)}`;
  const contents = "// The presence hook of an earlier bundle.\n";
  write(f.target, earlierPresenceHook, contents);
  const manifestFile = join(f.target, manifestPath);
  const payload = JSON.parse(readFileSync(manifestFile, "utf8"))
    .installed.filter((file) => file.path !== manifestPath)
    .concat({ path: earlierPresenceHook, hash: hash(contents) });
  const manifestText = json({
    installed: [
      ...payload,
      { path: manifestPath, hash: hash(json({ installed: payload })) },
    ],
  });
  writeFileSync(manifestFile, manifestText);
  const receiptFile = join(f.lane, "installation.json");
  writeFileSync(
    receiptFile,
    json({
      ...JSON.parse(readFileSync(receiptFile, "utf8")),
      manifestHash: hash(manifestText),
    }),
  );
  const excludes = join(f.launchpad, "docs/control/local/harness/excludes");
  const names = readdirSync(excludes);
  assert.equal(names.length, 1);
  const registryFile = join(excludes, names[0]);
  const registry = JSON.parse(readFileSync(registryFile, "utf8"));
  const members = Object.keys(registry.members);
  assert.equal(members.length, 1);
  registry.members[members[0]].push(`/${earlierPresenceHook}`);
  const lines = registry.block.split("\n");
  const block = [
    lines[0],
    ...[...lines.slice(1, -2), `/${earlierPresenceHook}`].sort(),
    lines.at(-2),
    "",
  ].join("\n");
  const exclude = join(f.target, ".git/info/exclude");
  const before = readFileSync(exclude, "utf8");
  assert.equal(before.split(registry.block).length, 2);
  writeFileSync(exclude, before.split(registry.block).join(block));
  writeFileSync(registryFile, json({ ...registry, block }));
}

test("WO-276 criterion Q1: a target installed while its bundle held a presence hook verifies, is replaced without the hook and is removed", () => {
  const f = fixture();
  try {
    const before = tree(f.target);
    const exclude = join(f.target, ".git/info/exclude");
    const original = readFileSync(exclude, "utf8");
    emitTargetHarness(f.target, f.options);
    const current = tree(f.target);
    installedWithPresenceHook(f);
    assert.equal(checkTargetHarness(f.target, f.options).files, 8);
    // The next emission owns the earlier installation's files, and removes
    // the one its bundle no longer holds.
    emitTargetHarness(f.target, f.options);
    assert.deepEqual(tree(f.target), current);
    assert.equal(checkTargetHarness(f.target, f.options).files, 7);
    assert.ok(!readFileSync(exclude, "utf8").includes(earlierPresenceHook));
    // Removed without an emission between, the earlier installation leaves
    // nothing behind, the presence hook included.
    installedWithPresenceHook(f);
    assert.equal(removeTargetHarness(f.target, f.options).files, 8);
    assert.deepEqual(tree(f.target), before);
    assert.equal(readFileSync(exclude, "utf8"), original);
  } finally {
    rmSync(f.base, { recursive: true, force: true });
  }
});

test("WO-049 target hooks execute pinned runtime, enforce boundary, keep state off target and fail closed", () => {
  const f = fixture();
  try {
    emitTargetHarness(f.target, f.options);
    const after = tree(f.target);
    // A target's bundle holds no observer hook, so its permission hook carries
    // the heartbeat, once a call and after its decision, and the other two
    // hooks carry none (WO-276 criterion Q2).
    const presenceStore = join(f.launchpad, ".runtime/presence");
    const bound = {
      DOTLN_RESIDENT_STORE: presenceStore,
      DOTLN_RESIDENT_EPISODE_ID: "fixture-episode",
    };
    const heartbeats = () =>
      existsSync(presenceStore)
        ? new ResidentStore(presenceStore)
            .read()
            .split("\n")
            .filter(Boolean)
            .map((line) => JSON.parse(line))
            .filter(
              (event) =>
                event.type === "OperatorPresenceObserved" &&
                event.payload.signal.kind === "heartbeat",
            )
        : [];
    assert.deepEqual(invoke(f, "permissions", {}, "fixture-writer", bound), {});
    assert.deepEqual(
      heartbeats().map((event) => [
        event.payload.signal.event,
        event.payload.signal.sessionId,
        event.payload.stamp,
      ]),
      [["PreToolUse", "fixture-writer", { episodeId: "fixture-episode" }]],
    );
    const resident = replayResident(new ResidentStore(presenceStore).read())
      .state.resident;
    assert.equal(resident.actors["episode:fixture-episode"].status, "live");
    assert.equal(resident.present, true);
    assert.deepEqual(tree(f.target), after, "heartbeat state stays off target");
    // The heartbeat decides nothing: with it recorded a refusal is still made.
    assert.ok(
      denied(
        invoke(
          f,
          "permissions",
          { name: "Bash", input: { command: "git push origin HEAD" } },
          "fixture-writer",
          bound,
        ),
      ),
    );
    assert.equal(heartbeats().length, 2);
    // A heartbeat that fails (its store is a file) allows what the hook
    // allows and refuses what it refuses, and says so on standard error.
    const broken = { DOTLN_RESIDENT_STORE: join(f.target, "source.txt") };
    assert.deepEqual(
      invoke(f, "permissions", {}, "fixture-writer", broken),
      {},
      "heartbeat failure cannot introduce a permission decision",
    );
    assert.ok(
      denied(
        invoke(
          f,
          "permissions",
          { name: "Bash", input: { command: "git push origin HEAD" } },
          "fixture-writer",
          broken,
        ),
      ),
      "heartbeat failure cannot remove a permission decision",
    );
    const advised = spawnSync(
      process.execPath,
      [join(f.target, ".claude/hooks/permissions.mjs")],
      {
        cwd: f.target,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_PID: String(process.pid), ...broken },
        input: JSON.stringify({
          hook_event_name: "PreToolUse",
          cwd: f.target,
          session_id: "fixture-writer",
          tool_name: "Write",
          tool_input: {
            file_path: join(f.target, "allowed.txt"),
            content: "allowed\n",
          },
        }),
        timeout: 10000,
      },
    );
    assert.equal(advised.status, 0, advised.stderr);
    assert.equal(advised.stdout, "{}");
    assert.match(
      advised.stderr,
      /DotLn advisory: presence heartbeat unavailable/,
    );
    assert.deepEqual(
      tree(f.target),
      after,
      "failed heartbeat preserves target files",
    );
    // The writer hook and the attribution hook run beside the permission hook
    // for a shell command; the heartbeat is the permission hook's alone.
    const count = heartbeats().length;
    invoke(
      f,
      "concurrent-work-requires-worktrees",
      {},
      "fixture-writer",
      bound,
    );
    invoke(
      f,
      "no-attribution",
      { name: "Bash", input: { command: "git commit -m 'A plain message'" } },
      "fixture-writer",
      bound,
    );
    assert.equal(heartbeats().length, count);
    // An input the hook refuses to read (it names no directory) is denied,
    // and still names its session: the heartbeat is recorded for it, as the
    // presence hook, which read no more than the event and the session,
    // recorded it.
    const unread = spawnSync(
      process.execPath,
      [join(f.target, ".claude/hooks/permissions.mjs")],
      {
        cwd: f.target,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_PID: String(process.pid), ...bound },
        input: JSON.stringify({
          hook_event_name: "PreToolUse",
          session_id: "fixture-writer",
          tool_name: "Write",
          tool_input: { file_path: join(f.target, "allowed.txt") },
        }),
        timeout: 10000,
      },
    );
    assert.equal(unread.status, 0, unread.stderr);
    assert.ok(denied(JSON.parse(unread.stdout)));
    assert.equal(heartbeats().length, count + 1);
    assert.deepEqual(tree(f.target), after);
    assert.deepEqual(invoke(f, "permissions", {}), {});
    assert.ok(
      denied(
        invoke(f, "permissions", {
          name: "Bash",
          input: { command: "git push origin HEAD" },
        }),
      ),
    );
    assert.ok(
      denied(
        invoke(f, "permissions", {
          input: { file_path: join(f.base, "sibling.txt") },
        }),
      ),
    );
    assert.ok(
      denied(
        invoke(f, "permissions", {
          name: "Bash",
          input: { command: "touch ../sibling.txt" },
        }),
      ),
    );
    assert.ok(
      denied(
        invoke(f, "permissions", {
          name: "Bash",
          input: { command: "rm -rf .claude" },
        }),
      ),
    );
    assert.ok(
      denied(
        invoke(f, "permissions", {
          name: "Bash",
          input: { command: "node -e 'process.exit(0)'" },
        }),
      ),
    );
    assert.deepEqual(invoke(f, "concurrent-work-requires-worktrees", {}), {});
    assert.ok(
      denied(
        invoke(f, "concurrent-work-requires-worktrees", {}, "second-writer"),
      ),
    );
    const policy = compileFeedbackUnits(
      personalFeedbackUnits.filter(
        (unit) => unit.trigger === "writer-isolation",
      ),
    );
    const facts = {
      kind: "writer-isolation",
      cwd: f.target,
      gitRoot: f.target,
      worktree: f.target,
      branch: "fixture-target",
      writable: true,
      actorId: "one",
      writers: [{ actorId: "one", worktree: f.target }],
    };
    assert.doesNotThrow(() => feedbackBoundary(policy, facts, () => {}));
    assert.throws(
      () =>
        feedbackBoundary(
          policy,
          { ...facts, writers: [{ actorId: "two", worktree: f.target }] },
          () => {},
        ),
      FeedbackRefused,
    );
    assert.deepEqual(
      invoke(f, "no-attribution", {
        name: "Bash",
        input: { command: "git commit -m 'A plain message'" },
      }),
      {},
    );
    assert.ok(
      denied(
        invoke(f, "no-attribution", {
          name: "Bash",
          input: { command: "git commit -m 'Generated by Claude'" },
        }),
      ),
    );
    assert.ok(existsSync(join(f.lane, "writer")));
    assert.ok(readdirSync(f.lane).some((name) => name.endsWith(".jsonl")));
    assert.deepEqual(tree(f.target), after);
    for (const [path, contents] of Object.entries(after))
      for (const line of contents.split("\n")) {
        if (line.includes("file://"))
          assert.match(line, /^const .*await import\(new URL\("file:\/\//);
        else assert.ok(!line.includes(f.base), `${path} leaked path`);
      }
    const receipt = JSON.parse(
      readFileSync(join(f.lane, "installation.json"), "utf8"),
    );
    assert.equal(receipt.importRoot, "<launchpad>");
    assert.ok(!JSON.stringify(receipt).includes(f.base));
    symlinkSync(
      join(f.target, ".claude/settings.json"),
      join(f.target, "settings-alias"),
    );
    assert.ok(
      denied(
        invoke(f, "permissions", {
          input: { file_path: join(f.target, "settings-alias") },
        }),
      ),
    );
    unlinkSync(join(f.target, "settings-alias"));
    linkSync(
      join(f.target, ".claude/settings.json"),
      join(f.target, "settings-hardlink"),
    );
    assert.ok(
      denied(
        invoke(f, "permissions", {
          input: { file_path: join(f.target, "settings-hardlink") },
        }),
      ),
    );
    unlinkSync(join(f.target, "settings-hardlink"));
    const runtime = join(f.launchpad, receipt.runtimeSnapshot);
    renameSync(runtime, runtime + ".unavailable");
    const missing = invoke(f, "permissions", {});
    assert.ok(denied(missing));
    assert.match(
      missing.hookSpecificOutput.permissionDecisionReason,
      /runtime/,
    );
    assert.ok(!missing.systemMessage);
    assert.deepEqual(tree(f.target), after);
    removeTargetHarness(f.target, f.options);
  } finally {
    rmSync(f.base, { recursive: true, force: true });
  }
});

test("WO-049 unowned, tracked-missing and symlink destinations refuse before mutation", () => {
  for (const mode of ["unowned", "tracked-missing", "symlink"]) {
    const f = fixture();
    try {
      const path = ".claude/settings.json";
      if (mode === "symlink") {
        mkdirSync(join(f.target, ".claude"));
        symlinkSync(join(f.base, "missing"), join(f.target, path));
      } else {
        write(f.target, path, "{}\n");
        if (mode === "tracked-missing") {
          runGit(f.target, ["add", path], fixtureGitOptions);
          unlinkSync(join(f.target, path));
        }
      }
      const exclude = readFileSync(join(f.target, ".git/info/exclude"), "utf8");
      assert.throws(
        () => emitTargetHarness(f.target, f.options),
        /settings.json/,
      );
      assert.equal(
        readFileSync(join(f.target, ".git/info/exclude"), "utf8"),
        exclude,
      );
      assert.ok(!existsSync(join(f.target, "CLAUDE.local.md")));
    } finally {
      rmSync(f.base, { recursive: true, force: true });
    }
  }
});

test("WO-049 Codex profile contains only instruction and manifest; linked worktrees share exclusions safely", () => {
  const f = fixture();
  try {
    const sibling = join(f.base, "linked");
    runGit(
      f.target,
      ["worktree", "add", "-b", "fixture-linked", sibling],
      fixtureGitOptions,
    );
    const exclude = join(f.target, ".git/info/exclude");
    const original = readFileSync(exclude, "utf8");
    emitTargetHarness(f.target, f.options);
    emitTargetHarness(sibling, {
      ...f.options,
      profile: "target-worker-codex",
    });
    assert.deepEqual(
      Object.keys(tree(sibling)).sort(),
      ["source.txt", "CLAUDE.local.md", manifestPath].sort(),
    );
    removeTargetHarness(f.target, f.options);
    assert.equal(checkTargetHarness(sibling, f.options).files, 2);
    assert.equal(
      runGit(sibling, ["status", "--porcelain"], fixtureGitOptions),
      "",
    );
    removeTargetHarness(sibling, f.options);
    assert.equal(readFileSync(exclude, "utf8"), original);
  } finally {
    rmSync(f.base, { recursive: true, force: true });
  }
});

test("WO-049 target ignore negations refuse before installation and are detected later", () => {
  const f = fixture();
  try {
    write(f.target, ".gitignore", "!/CLAUDE.local.md\n");
    assert.throws(
      () => emitTargetHarness(f.target, f.options),
      /ignore rule exposes/,
    );
    assert.ok(!existsSync(join(f.target, "CLAUDE.local.md")));
    write(f.target, ".gitignore", "");
    emitTargetHarness(f.target, f.options);
    write(f.target, ".gitignore", "!/CLAUDE.local.md\n");
    assert.throws(
      () => checkTargetHarness(f.target, f.options),
      /ignore rule exposes/,
    );
  } finally {
    rmSync(f.base, { recursive: true, force: true });
  }
});

test("WO-276 criterion K3: a target worktree's emitted settings hold the launchpad's settings fragment as the launchpad's own do, its check passes on them, a fragment the merge refuses stops the emit before anything is written, and with the fragment removed the emit writes the bytes it writes with none", () => {
  const f = fixture();
  const settingsFile = join(f.target, ".claude/settings.json");
  try {
    emitTargetHarness(f.target, f.options);
    const bare = readFileSync(settingsFile, "utf8");
    const kit = JSON.parse(bare);
    const hook = {
      matcher: "Edit|Write",
      hooks: [{ type: "command", command: "instance-after-edit", timeout: 30 }],
    };
    const rule = "Bash(instance-deploy *)";
    write(
      f.launchpad,
      SETTINGS_FRAGMENT,
      JSON.stringify({
        hooks: { PostToolUse: [hook] },
        permissions: { deny: [rule], allow: ["Bash(instance-report *)"] },
      }),
    );
    emitTargetHarness(f.target, f.options);
    checkTargetHarness(f.target, f.options);
    const merged = JSON.parse(readFileSync(settingsFile, "utf8"));
    // Every entry the kit emits for a target worktree, then the fragment's.
    assert.deepEqual(merged.hooks.PreToolUse, kit.hooks.PreToolUse);
    assert.deepEqual(merged.hooks.PostToolUse, [hook]);
    assert.deepEqual(merged.permissions.deny, [...kit.permissions.deny, rule]);
    assert.deepEqual(merged.permissions.allow, ["Bash(instance-report *)"]);
    for (const key of Object.keys(kit))
      if (!["hooks", "permissions"].includes(key))
        assert.deepEqual(merged[key], kit[key], key);
    // The bundle stays out of the target's Git view with the fragment in it.
    assert.equal(
      runGit(f.target, ["status", "--porcelain"], fixtureGitOptions),
      "",
    );
    // A refused fragment stops the emit and leaves the installed bundle.
    const installed = tree(f.target);
    write(f.launchpad, SETTINGS_FRAGMENT, JSON.stringify({ env: { A: "1" } }));
    assert.throws(
      () => emitTargetHarness(f.target, f.options),
      /invalid settings fragment in \.claude\/settings\.instance\.json: unknown key env/u,
    );
    write(
      f.launchpad,
      SETTINGS_FRAGMENT,
      JSON.stringify({ hooks: { PreToolUse: [hook] } }),
    );
    assert.throws(
      () => emitTargetHarness(f.target, f.options),
      /hooks\.PreToolUse: a fragment adds no hook under PreToolUse/u,
    );
    assert.deepEqual(tree(f.target), installed);
    checkTargetHarness(f.target, f.options);
    // With no fragment, the bytes a launchpad that never held one emits.
    unlinkSync(join(f.launchpad, SETTINGS_FRAGMENT));
    emitTargetHarness(f.target, f.options);
    checkTargetHarness(f.target, f.options);
    assert.equal(readFileSync(settingsFile, "utf8"), bare);
    removeTargetHarness(f.target, f.options);
  } finally {
    rmSync(f.base, { recursive: true, force: true });
  }
});

test("WO-287 criterion A11: a target worktree's bundle carries its launchpad's levels in every guard's configuration and leaves out the host deny rules of a lowered ssh or package-publish stop", async () => {
  const { loweredStops, resolveStopLevels } =
    await import("../packages/skeleton/src/stops.mjs");
  const f = fixture();
  try {
    const guards = [
      "permissions",
      "concurrent-work-requires-worktrees",
      "no-attribution",
    ];
    const carried = (name) => {
      const found = /"stops": (\{[^}]*\})/u.exec(
        readFileSync(join(f.target, `.claude/hooks/${name}.mjs`), "utf8"),
      );
      return found ? JSON.parse(found[1]) : undefined;
    };
    const settings = () =>
      JSON.parse(readFileSync(join(f.target, ".claude/settings.json"), "utf8"));
    const launchpadStops = (stops) => {
      write(f.launchpad, "dotln.config.json", json({ version: 1, stops }));
      emitTargetHarness(f.target, f.options);
      checkTargetHarness(f.target, f.options);
    };
    // Core's launchpad: no guard carries a level and every rule is emitted.
    emitTargetHarness(f.target, f.options);
    for (const name of guards) assert.equal(carried(name), undefined, name);
    assert.deepEqual(settings().permissions.deny, [
      "Bash(npm publish *)",
      "Bash(scp *)",
      "Bash(sftp *)",
      "Bash(ssh *)",
    ]);
    // The bundle's one prompt hook records the recovery controls; its guards
    // read them ahead of the runtime.
    assert.deepEqual(Object.keys(settings().hooks), [
      "PreToolUse",
      "UserPromptSubmit",
    ]);
    assert.deepEqual(
      settings().hooks.UserPromptSubmit[0].hooks.map((hook) => hook.command),
      ['node "$CLAUDE_PROJECT_DIR/.claude/hooks/operator-control.mjs"'],
    );
    assert.doesNotMatch(
      readFileSync(
        join(f.target, ".claude/hooks/operator-control.mjs"),
        "utf8",
      ),
      /import\(new URL|runTargetHarnessHook/u,
    );
    // An exported instance that sets nothing: the record, host and bound
    // rows advise in the worktree as in its launchpad, and the two rules
    // are emitted as before.
    write(f.launchpad, "KIT-MANIFEST.json", "{}\n");
    emitTargetHarness(f.target, f.options);
    const lowered = loweredStops(resolveStopLevels({ instance: true }));
    for (const name of guards) assert.deepEqual(carried(name), lowered, name);
    assert.equal(settings().permissions.deny.length, 4);
    // The owner lowers one, then the other.
    launchpadStops({ ssh: "off" });
    assert.deepEqual(settings().permissions.deny, ["Bash(npm publish *)"]);
    for (const name of guards) assert.equal(carried(name).ssh, "off", name);
    launchpadStops({ "package-publish": "advise", "target-cwd": "refuse" });
    assert.deepEqual(settings().permissions.deny, [
      "Bash(scp *)",
      "Bash(sftp *)",
      "Bash(ssh *)",
    ]);
    for (const name of guards) {
      assert.equal(carried(name)["package-publish"], "advise", name);
      assert.equal(carried(name)["target-cwd"], undefined, name);
    }
  } finally {
    rmSync(f.base, { recursive: true, force: true });
  }
});
