import test from "node:test";
import assert from "node:assert/strict";
import {
  writeFileSync,
  existsSync,
  rmSync,
  readFileSync,
  chmodSync,
} from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { createSourceFixture, fixtureGit } from "./source-change-fixture.js";
import { runFocusedTest, sourceDigest } from "../src/source-change-worktree.js";
import {
  confinedTestCommand,
  discoverySandbox,
  writerSandboxProfile,
} from "../src/discovery-sandbox.js";
import { mkdirSync } from "node:fs";

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
      const profileFile = join(root, "writer-sandbox.sb");
      writeFileSync(profileFile, discoverySandbox(tree));
      writeFileSync(outside, "synthetic outside marker\n");
      writeFileSync(
        join(tree, "probe.mjs"),
        `import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,chmodSync} from 'node:fs'; import {connect} from 'node:net';
const outcomes = {};
try { readFileSync(${JSON.stringify(outside)}); outcomes.read='allowed'; } catch { outcomes.read='refused'; }
try { writeFileSync(${JSON.stringify(common)},'probe'); outcomes.write='allowed'; } catch { outcomes.write='refused'; }
try { chmodSync(${JSON.stringify(profileFile)},0o600); writeFileSync(${JSON.stringify(profileFile)},'changed'); outcomes.profile='allowed'; } catch { outcomes.profile='refused'; }
outcomes.network = await new Promise(resolve => { const socket=connect({host:'127.0.0.1',port:${address.port}});
socket.setTimeout(2000); socket.on('connect',()=>{socket.destroy();resolve('allowed')});
socket.on('error',()=>resolve('refused')); socket.on('timeout',()=>{socket.destroy();resolve('timeout')}); });
assert.deepEqual(outcomes,{read:process.argv[2],write:process.argv[2],profile:process.argv[2],network:process.argv[2]});
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
      writeFileSync(profileFile, discoverySandbox(tree));
      chmodSync(profileFile, 0o400);
      const command = "node probe.mjs refused";
      const focused = runFocusedTest(tree, command);
      assert.equal(focused.exitCode, 0, JSON.stringify(focused));
      assert.equal(focused.signal, null);
      assert.equal(
        focused.stdoutHash,
        sourceDigest(
          '{"read":"refused","write":"refused","profile":"refused","network":"refused"}\n',
        ),
      );
      assert.equal(existsSync(common), false);
      const writer = spawnSync(
        "/bin/zsh",
        ["-c", confinedTestCommand(tree, command, profileFile)],
        { cwd: tree, encoding: "utf8" },
      );
      assert.equal(writer.status, 0, writer.stderr);
      assert.equal(
        writer.stdout,
        '{"read":"refused","write":"refused","profile":"refused","network":"refused"}\n',
      );
      assert.equal(existsSync(common), false);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      rmSync(root, { recursive: true, force: true });
    }
  },
);

test(
  "WO-184 criterion 15: the confined writer test cannot alter its hook, host scratch, Git link or local instruction controls",
  { skip: process.platform !== "darwin" },
  () => {
    const root = createSourceFixture(),
      tree = join(root, "trees/control-probe");
    try {
      fixtureGit(
        join(root, "target"),
        "worktree",
        "add",
        "-b",
        "control-probe",
        tree,
      );
      mkdirSync(join(tree, ".claude/hooks"), { recursive: true });
      mkdirSync(join(tree, ".dotln"));
      const controls = [
        join(tree, ".claude/hooks/permissions.mjs"),
        join(tree, ".dotln/commit-message.txt"),
      ];
      // Local instructions are usually absent: neither spelling may be created.
      const localInstructions = ["claude.local.md", "CLAUDE.local.md"].map(
        (name) => join(tree, name),
      );
      for (const file of controls) writeFileSync(file, "host control\n");
      // The linked worktree's .git is the host-written link file itself.
      const gitLink = join(tree, ".git"),
        gitLinkBytes = readFileSync(gitLink, "utf8");
      writeFileSync(
        join(tree, "probe.mjs"),
        `import assert from 'node:assert/strict'; import {writeFileSync,renameSync,chmodSync} from 'node:fs';
for (const file of ${JSON.stringify([...controls, gitLink])}) {
  assert.throws(()=>writeFileSync(file,'changed'));
  assert.throws(()=>chmodSync(file,0o600));
  writeFileSync('replacement','changed'); assert.throws(()=>renameSync('replacement',file));
}
for (const file of ${JSON.stringify(localInstructions)}) {
  assert.throws(()=>writeFileSync(file,'changed'),{code:'EPERM'});
  writeFileSync('replacement','changed'); assert.throws(()=>renameSync('replacement',file),{code:'EPERM'});
}
writeFileSync('product-output.txt','allowed'); console.log('protected controls unchanged');\n`,
      );
      const profileFile = join(root, "writer-sandbox.sb");
      writeFileSync(profileFile, writerSandboxProfile(tree), { mode: 0o400 });
      const writer = spawnSync(
        "/bin/zsh",
        ["-c", confinedTestCommand(tree, "node probe.mjs", profileFile)],
        { cwd: tree, encoding: "utf8" },
      );
      assert.equal(writer.status, 0, writer.stderr);
      assert.equal(writer.stdout.trim(), "protected controls unchanged");
      assert.ok(
        controls.every(
          (file) => readFileSync(file, "utf8") === "host control\n",
        ),
      );
      assert.equal(readFileSync(gitLink, "utf8"), gitLinkBytes);
      assert.ok(localInstructions.every((file) => !existsSync(file)));
      assert.equal(
        readFileSync(join(tree, "product-output.txt"), "utf8"),
        "allowed",
      );
    } finally {
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
      writeFileSync(join(root, "writer-sandbox.sb"), discoverySandbox(tree), {
        mode: 0o400,
      });
      const writer = spawnSync(
        "/bin/zsh",
        [
          "-c",
          confinedTestCommand(
            tree,
            "npm test",
            join(root, "writer-sandbox.sb"),
          ),
        ],
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
