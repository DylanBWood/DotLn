import assert from "node:assert/strict";
import test from "node:test";
import { closeLeftoverCodexServers } from "./lib/codex-background.mjs";

// The signal function records selections; these tests never read the host's
// process table or signal a real process.
const home = "/fixture/home";
const release = `${home}/.codex/packages/app-server-daemon/releases/0.169.0-aarch64-apple-darwin/bin`;
const daemon = {
  pid: 300,
  ppid: 1,
  command: `${release}/codex app-server daemon pid-update-loop`,
};
const server = {
  pid: 200,
  ppid: 300,
  command: `${release}/codex app-server --listen unix:// --analytics-default-enabled`,
};
const helper = {
  pid: 100,
  ppid: 200,
  command: `${release}/codex-code-mode-host --listen grpc+stdio://`,
};
const leftovers = [helper, server, daemon];
const close = (rows) => {
  const signalled = [];
  const message = closeLeftoverCodexServers({
    repository: "/fixture/project",
    temporary: "/fixture/temporary",
    env: {},
    home,
    rows,
    kill: (pid) => signalled.push(pid),
  });
  return { signalled, message };
};
const untouched = { signalled: [], message: "" };

test("cleanup preserves live and unclassified commands in the server installation", () => {
  for (const command of [
    `${release}/codex`,
    `${release}/codex a prompt`,
    `${release}/codex exec --ephemeral -`,
    `${release}/codex e -`,
    `${release}/codex -a never exec --ephemeral -`,
    `${release}/codex resume`,
    `${release}/codex app-server --help`,
    `${release}/codex app-server generate-ts`,
    `${release}/codex app-server daemon status`,
    `${release}/codex app-server --listen unix:// --unknown-option`,
    `${release}/codex-code-mode-host --listen grpc+stdio://`,
    `${release}/future-helper --listen grpc+stdio://`,
    `${release}/codex-linux-sandbox --`,
    "/opt/homebrew/bin/codex exec --ephemeral -",
  ]) {
    assert.deepEqual(
      close([...leftovers, { pid: 900, ppid: 42, command }]),
      untouched,
      command,
    );
  }
});

test("cleanup requires the observed background roles and their daemon ancestry", () => {
  assert.deepEqual(close(leftovers).signalled, [300, 100, 200]);
  assert.deepEqual(close([daemon]).signalled, [300]);
  assert.deepEqual(close([server, daemon]).signalled, [300, 200]);
  for (const rows of [
    [server, helper],
    [daemon, helper],
    [helper, server, { ...daemon, ppid: 42 }],
    [helper, { ...server, ppid: 42 }, daemon],
    [{ ...helper, ppid: 42 }, server, daemon],
    [
      helper,
      { ...server, command: server.command.replace("0.169.0", "0.170.0") },
      daemon,
    ],
    [
      { ...helper, command: helper.command.replace("0.169.0", "0.170.0") },
      server,
      daemon,
    ],
  ])
    assert.deepEqual(close(rows), untouched, JSON.stringify(rows));
});
