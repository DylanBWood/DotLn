import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, existsSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { createSourceFixture, fixtureGit } from "./source-change-fixture.js";
import { runFocusedTest, sourceDigest } from "../src/source-change-worktree.js";
import { confinedTestCommand } from "../src/discovery-sandbox.js";

test(
  "WO-066 AC6: host and exact writer command deny direct network, common-Git writes and outside reads",
  { skip: process.platform !== "darwin" },
  async () => {
    const root = createSourceFixture(),
      target = join(root, "target"),
      tree = join(root, "trees/confined");
    const server = createServer((socket) => socket.end());
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    try {
      const address = server.address();
      assert.ok(address && typeof address !== "string");
      fixtureGit(target, "worktree", "add", "-b", "confinement", tree);
      const outside = join(root, "outside.txt"),
        common = join(target, ".git/wo066-probe");
      writeFileSync(outside, "synthetic outside marker\n");
      writeFileSync(
        join(tree, "probe.mjs"),
        `import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs'; import {connect} from 'node:net';
const outcomes = {};
try { readFileSync(${JSON.stringify(outside)}); outcomes.read='allowed'; } catch { outcomes.read='refused'; }
try { writeFileSync(${JSON.stringify(common)},'probe'); outcomes.write='allowed'; } catch { outcomes.write='refused'; }
outcomes.network = await new Promise(resolve => { const socket=connect({host:'127.0.0.1',port:${address.port}});
socket.setTimeout(2000); socket.on('connect',()=>{socket.destroy();resolve('allowed')});
socket.on('error',()=>resolve('refused')); socket.on('timeout',()=>{socket.destroy();resolve('timeout')}); });
assert.deepEqual(outcomes,{read:process.argv[2],write:process.argv[2],network:process.argv[2]});
console.log(JSON.stringify(outcomes));
`,
      );
      const control = spawnSync(process.execPath, ["probe.mjs", "allowed"], {
        cwd: tree,
        encoding: "utf8",
      });
      assert.equal(control.status, 0, control.stderr);
      assert.equal(readFileSync(common, "utf8"), "probe");
      rmSync(common);
      const command = "node probe.mjs refused";
      const focused = runFocusedTest(tree, command);
      assert.equal(focused.exitCode, 0, JSON.stringify(focused));
      assert.equal(focused.signal, null);
      assert.equal(
        focused.stdoutHash,
        sourceDigest(
          '{"read":"refused","write":"refused","network":"refused"}\n',
        ),
      );
      assert.equal(existsSync(common), false);
      const writer = spawnSync(
        "/bin/zsh",
        ["-c", confinedTestCommand(tree, command)],
        { cwd: tree, encoding: "utf8" },
      );
      assert.equal(writer.status, 0, writer.stderr);
      assert.equal(
        writer.stdout,
        '{"read":"refused","write":"refused","network":"refused"}\n',
      );
      assert.equal(existsSync(common), false);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      rmSync(root, { recursive: true, force: true });
    }
  },
);

test(
  "confined npm test leaves committed source clean through host and writer routes",
  { skip: process.platform !== "darwin" },
  () => {
    const root = createSourceFixture(),
      target = join(root, "target"),
      tree = join(root, "trees/npm");
    try {
      writeFileSync(
        join(target, "fixture.txt"),
        "changed by synthetic worker\n",
      );
      writeFileSync(
        join(target, "package.json"),
        JSON.stringify({
          private: true,
          scripts: { test: "node fixture-test.mjs" },
        }),
      );
      fixtureGit(target, "add", "-A");
      fixtureGit(target, "commit", "-m", "Synthetic npm check");
      fixtureGit(target, "worktree", "add", "-b", "npm-check", tree);
      const host = runFocusedTest(tree, "npm test");
      assert.equal(host.exitCode, 0, JSON.stringify(host));
      assert.equal(
        fixtureGit(tree, "status", "--porcelain", "--untracked-files=all"),
        "",
      );
      const writer = spawnSync(
        "/bin/zsh",
        ["-c", confinedTestCommand(tree, "npm test")],
        { cwd: tree, encoding: "utf8" },
      );
      assert.equal(writer.status, 0, writer.stderr);
      assert.equal(
        fixtureGit(tree, "status", "--porcelain", "--untracked-files=all"),
        "",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
);
