import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  linkSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  emitTargetHarness,
  checkTargetHarness,
  removeTargetHarness,
} from "./lib/harness.mjs";
import { compileFeedbackUnits } from "../packages/compiler/dist/src/index.js";
import { personalFeedbackUnits } from "../packages/skeleton/dist/src/loadouts/feedback.js";
import { targetWorkerProfiles } from "../packages/skeleton/dist/src/loadouts/contributor.js";
import {
  feedbackBoundary,
  FeedbackRefused,
} from "../packages/skeleton/dist/src/feedback-boundary.js";

const source = fileURLToPath(new URL("../", import.meta.url));
const git = (root, ...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const write = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
const digest = (value) => createHash("sha256").update(value).digest("hex");
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
    mkdtempSync(join(tmpdir(), "dotln-target-fixture-")),
  );
  const target = join(base, "target");
  const launchpad = join(base, "launchpad with space # unicode-é");
  mkdirSync(target);
  mkdirSync(launchpad);
  git(target, "init", "-b", "fixture-target");
  write(target, "source.txt", "fixture\n");
  if (unrelated) write(target, ".claude/unrelated.txt", "preserve\n");
  git(target, "add", ".");
  git(
    target,
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "commit",
    "-qm",
    "Fixture base",
  );
  for (const name of readdirSync(join(source, "packages"))) {
    if (!existsSync(join(source, "packages", name, "dist"))) continue;
    mkdirSync(join(launchpad, "packages", name), { recursive: true });
    cpSync(
      join(source, "packages", name, "package.json"),
      join(launchpad, "packages", name, "package.json"),
    );
    symlinkSync(
      join(source, "packages", name, "dist"),
      join(launchpad, "packages", name, "dist"),
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
function invoke(f, name, tool, session = "fixture-writer") {
  const result = spawnSync(
    process.execPath,
    [join(f.target, `.claude/hooks/${name}.mjs`)],
    {
      cwd: f.target,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PID: String(process.pid) },
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
    for (const event of ["PostToolUse", "Stop", "UserPromptSubmit"]) {
      const capability = profile.events[event];
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
      assert.equal(git(f.target, "status", "--porcelain"), "");
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
      assert.equal(installed.length, 6);
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
      assert.equal(git(f.target, "status", "--porcelain"), "");
      git(f.target, "add", "-A");
      assert.equal(git(f.target, "diff", "--cached", "--name-only"), "");
      assert.equal(checkTargetHarness(f.target, f.options).files, 6);
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
      assert.equal(git(f.target, "status", "--porcelain"), "");
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
    assert.equal(git(f.target, "status", "--porcelain"), "");
    removeTargetHarness(f.target, f.options);
    assert.equal(
      readFileSync(exclude, "utf8"),
      original + "\n/my-build-output/\n",
    );
    assert.equal(git(f.target, "status", "--porcelain"), "");
    git(f.target, "add", "-A");
    assert.equal(git(f.target, "diff", "--cached", "--name-only"), "");

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
    assert.equal(checkTargetHarness(f.target, f.options).files, 6);
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

test("WO-049 target hooks execute pinned runtime, enforce boundary, keep state off target and fail closed", () => {
  const f = fixture();
  try {
    emitTargetHarness(f.target, f.options);
    const after = tree(f.target);
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
          git(f.target, "add", path);
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
    git(f.target, "worktree", "add", "-b", "fixture-linked", sibling);
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
    assert.equal(git(sibling, "status", "--porcelain"), "");
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
