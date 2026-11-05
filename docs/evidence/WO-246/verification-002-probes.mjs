// VER-002 independent probes. Run from the worktree root under harness bounded.
// Synthetic remotes are only inputs to the evaluator; transport stays local.
import assert from "node:assert/strict";
import {
  chmodSync,
  cpSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = realpathSync(process.cwd());
const load = (file) => import(pathToFileURL(join(root, file)));
const { createFixtureRoot, removeTemporaryPath } = await load(
  "scripts/lib/temporary-roots.mjs",
);
const { runGit, shellQuote } = await load("scripts/lib/git.mjs");
const { hasAiAttribution } = await load(
  "packages/compiler/src/attribution.mjs",
);
const { fetchIntoCheckout } = await load("scripts/lib/github-repository.mjs");
const base = realpathSync(
  createFixtureRoot(join(tmpdir(), "dotln-wo246-ver002-")),
);
const observations = [];
const check = async (name, run) => {
  try {
    observations.push({ name, result: "pass", ...(await run()) });
  } catch (error) {
    observations.push({ name, result: "fail", error: error.message });
  }
};
const git = (cwd, ...args) =>
  runGit(cwd, ["-c", "core.hooksPath=/dev/null", ...args]);
const write = (file, contents) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
};
const commit = (cwd, file, contents) => {
  write(join(cwd, file), contents);
  git(cwd, "add", file);
  git(
    cwd,
    "-c",
    "user.name=Verification Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "test: fixture",
  );
};

try {
  await check(
    "canonical repository identities and selector controls",
    async () => {
      const fixture = join(base, "identity fixture");
      mkdirSync(fixture);
      git(fixture, "init", "-q", "-b", "main");
      const source = readFileSync(
        join(root, ".claude/hooks/permissions.mjs"),
        "utf8",
      );
      const config = JSON.parse(
        source.match(
          /await runHarnessHook\(([\s\S]*), feedbackBoundary(?:, input(?:, rawInput(?:, control)?)?)?\);/u,
        )[1],
      );
      for (const file of config.runtime.files) {
        const name = `${config.runtime.snapshot}/${file.path}`;
        mkdirSync(dirname(join(fixture, name)), { recursive: true });
        cpSync(join(root, name), join(fixture, name));
      }
      const { evaluateHarnessHook } = await load(
        `${config.runtime.snapshot}/packages/skeleton/dist/src/harness-host.js`,
      );
      const { feedbackBoundary } = await load(
        `${config.runtime.snapshot}/packages/skeleton/dist/src/feedback-boundary.js`,
      );
      const judge = async (command) => {
        const result = await evaluateHarnessHook(
          config,
          {
            cwd: fixture,
            session_id: "wo246-ver002-fixture",
            hook_event_name: "PreToolUse",
            tool_name: "Bash",
            tool_input: { command },
          },
          fixture,
          feedbackBoundary,
        );
        return result.hookSpecificOutput?.permissionDecision === "deny";
      };
      git(
        fixture,
        "remote",
        "add",
        "origin",
        "https://github.com/demo/repo.git",
      );
      git(
        fixture,
        "remote",
        "add",
        "upstream",
        "https://github.com/demo/repo.git",
      );
      const pairs = [
        [
          "https://alpha.invalid/Demo/Repo.git",
          "https://beta.invalid/demo/repo.git",
          true,
        ],
        [
          "ssh://git@beta.invalid/demo/repo.git",
          "https://alpha.invalid/Demo/Repo.git",
          true,
        ],
        [
          "https://alpha.ghe.com/demo/repo.git",
          "https://beta.ghe.com/demo/repo.git",
          true,
        ],
        [
          "https://github.com/demo/repo.git",
          "https://alpha.ghe.com/demo/repo.git",
          true,
        ],
        ["git@alpha:demo/repo.git", "git@beta:demo/repo.git", true],
        [
          "https://github.com-team.invalid/demo/repo.git",
          "https://github.com/demo/repo.git",
          true,
        ],
        [
          "https://ALPHA.invalid/Demo/Repo.git",
          "ssh://git@alpha.invalid/demo/repo.git",
          false,
        ],
        [
          "https://alpha.invalid./demo/repo.git",
          "https://alpha.invalid/demo/repo.git",
          false,
        ],
        [
          "https://www.alpha.invalid/demo/repo.git",
          "https://alpha.invalid/demo/repo.git",
          false,
        ],
        [
          "ssh://git@ssh.alpha.ghe.com/demo/repo.git",
          "https://alpha.ghe.com/demo/repo.git",
          false,
        ],
        [
          "git@local-alias:demo/repo.git",
          "ssh://git@local-alias/demo/repo.git",
          false,
        ],
        [
          "https://github.com/demo/repo.git",
          "https://github.com/demo/other.git",
          true,
        ],
      ];
      let judgments = 0;
      for (const [origin, upstream, expected] of pairs) {
        git(fixture, "remote", "set-url", "origin", origin);
        git(fixture, "remote", "set-url", "upstream", upstream);
        for (const command of [
          "gh pr list",
          "gh pr create --title x",
          "gh issue list",
          "gh pr view 1",
        ]) {
          assert.equal(
            await judge(command),
            expected,
            `${origin}; ${upstream}; ${command}`,
          );
          judgments++;
        }
        assert.equal(
          await judge("gh pr list --repo github.com/demo/repo"),
          false,
        );
        assert.equal(
          await judge("GH_REPO=github.com/demo/repo gh issue list"),
          false,
        );
        judgments += 2;
        git(fixture, "config", "remote.origin.gh-resolved", "base");
        assert.equal(await judge("gh pr list"), false);
        judgments++;
        git(fixture, "config", "--unset", "remote.origin.gh-resolved");
      }
      return {
        pairs: pairs.length,
        judgments,
        pinnedRuntime: true,
        remoteCommandsExecuted: 0,
      };
    },
  );

  await check(
    "attribution normalization and emitted commit-message hook",
    () => {
      const ordinary = [
        "Document Claude integration",
        "Co-authored-by: Human <human@example.invalid>",
        "The guide discusses Generated with AI footers",
      ];
      const attributed = [
        "Generated with Claude Code",
        "Written by Codex",
        "Co-authored-by: ChatGPT <fixture@example.invalid>",
        "Assisted-by: Claude",
        "Claude-Session: synthetic-fixture",
        "https://chatgpt.com/share/synthetic-fixture",
      ];
      const prefixes = ["", ":memo: ", ":ROBOT: ", "✨ ", "🧑‍💻 ", ":memo: ✨ "];
      let comparisons = 0;
      for (const prefix of prefixes)
        for (const lead of [
          "",
          "A useful change.\n\n",
          "A useful change.\r\n\r\n",
        ])
          for (const [messages, expected] of [
            [ordinary, false],
            [attributed, true],
          ])
            for (const message of messages) {
              assert.equal(
                hasAiAttribution(`${lead}${prefix}${message}`),
                expected,
              );
              comparisons++;
            }
      const file = join(base, "message.txt");
      let hookCases = 0;
      for (const [message, expected] of [
        [":memo: Improve documentation", 0],
        [
          "docs: clarify text\n\n✨ Co-authored-by: Human <human@example.invalid>\n",
          0,
        ],
        [":robot: Generated with Claude Code", 1],
        ["docs: clarify text\n\n:memo: ✨ Assisted-by: Codex\n", 1],
        [
          "docs: clarify text\r\n\r\n:link: https://chatgpt.com/share/synthetic-fixture\r\n",
          1,
        ],
      ]) {
        writeFileSync(file, message);
        const result = spawnSync(
          process.execPath,
          [join(root, ".claude/hooks/commit-msg.mjs"), file],
          { cwd: root, encoding: "utf8" },
        );
        assert.equal(result.status, expected, result.stderr || message);
        hookCases++;
      }
      return { comparisons, hookCases, repositoryCommitsCreated: 0 };
    },
  );

  await check(
    "slow read and stalled fetch share a deadline and preserve checkout",
    () => {
      const origin = join(base, "origin.git");
      git(base, "init", "-q", "--bare", "-b", "main", origin);
      const writer = join(base, "writer");
      git(base, "clone", "-q", origin, writer);
      commit(writer, "one.txt", "one\n");
      git(writer, "push", "-q", "origin", "main");
      const checkout = join(base, "checkout");
      git(base, "clone", "-q", origin, checkout);
      commit(writer, "two.txt", "two\n");
      git(writer, "push", "-q", "origin", "main");
      const count = join(base, "connections");
      const transport = join(base, "transport.sh");
      writeFileSync(
        transport,
        `#!/bin/sh\nif [ -f ${shellQuote(count)} ]; then exec sleep 30; fi\nprintf first > ${shellQuote(count)}\nsleep 2\nexec git upload-pack ${shellQuote(origin)}\n`,
      );
      chmodSync(transport, 0o755);
      const snapshot = () => ({
        head: git(checkout, "rev-parse", "HEAD"),
        refs: git(checkout, "for-each-ref"),
        tree: git(checkout, "status", "--porcelain"),
        objects: git(checkout, "count-objects", "-v"),
        file: readFileSync(join(checkout, "one.txt"), "utf8"),
      });
      const before = snapshot();
      const saved = process.env.GIT_ALLOW_PROTOCOL;
      process.env.GIT_ALLOW_PROTOCOL = "ext:file";
      const started = Date.now();
      let refused;
      try {
        fetchIntoCheckout(checkout, `ext::${transport}`, "main", {
          timeoutMs: 3000,
        });
      } catch (error) {
        refused = error;
      } finally {
        if (saved === undefined) delete process.env.GIT_ALLOW_PROTOCOL;
        else process.env.GIT_ALLOW_PROTOCOL = saved;
      }
      const elapsedMs = Date.now() - started;
      assert.equal(refused?.boundMs, 3000, refused?.message);
      assert.match(refused.message, /git fetch failed.*bound/u);
      assert.ok(elapsedMs < 4400, `shared deadline took ${elapsedMs} ms`);
      assert.deepEqual(snapshot(), before);
      return { timeoutMs: 3000, readDelayMs: 2000, elapsedMs, unchanged: true };
    },
  );
} finally {
  removeTemporaryPath(base, { recursive: true, force: true });
}

const passed = observations.every((entry) => entry.result === "pass");
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      workOrder: "WO-246",
      verification: "VER-002",
      observations,
      passed,
    },
    null,
    2,
  ),
);
process.exitCode = passed ? 0 : 1;
