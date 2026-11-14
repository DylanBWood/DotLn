// Re-verification of VER-002: retained reproducer with repaired expectations.
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import {
  hostReport,
  renderHostReport,
  reportExitCode,
} from "../../../../scripts/lib/host-doctor.mjs";
import { planUpdate } from "../../../../scripts/launchpad.mjs";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
const root = process.cwd();
const facts = {
  root,
  nodeVersion: process.version,
  gitVersion: "git version 2.55.0",
  platform: "darwin",
  wsl: false,
  processors: 16,
  memoryBytes: 48 * 2 ** 30,
  compile: () => {},
  symlink: () => {},
  laneCapacity: () => 8,
  gitConfig: () => null,
  lineAttributes: () => [{ text: "unset", eol: "unspecified" }],
  originUrl: () =>
    "git@forge.example.net:synthetic-owner/synthetic-repository.git",
  pushTarget: () => ({
    host: "forge.example.net",
    selector: "forge.example.net/synthetic-owner/synthetic-repository",
  }),
  tool: (command) =>
    command === "gh"
      ? "gh version 2.98.0 (2026-01-01)"
      : command === "claude"
        ? "2.1.322 (Claude Code)"
        : null,
  electedHosts: () => ({ "host-codex": false, "host-copilot": false }),
  hostName: "synthetic-host",
  userName: "synthetic-user",
  homeDirectory: "/Users/synthetic-user",
};
const control = hostReport(root, facts);
assert.equal(reportExitCode(control), 0);
const unread = hostReport(root, {
  ...facts,
  electedHosts() {
    throw Error("unreadable elections");
  },
});
assert.notDeepEqual(unread, control);
assert.equal(reportExitCode(unread), 0);
assert.equal(unread.filter((r) => r.verdict === "unknown").length, 1);
const privacy = ["from /équipe", "from /alpha", "from /文書"].map((input) => {
  const rows = hostReport(root, { ...facts, nodeVersion: input });
  return {
    input,
    tableRetainsPath: renderHostReport(rows).includes(input),
    jsonRetainsPath: JSON.stringify(rows).includes(input),
  };
});
assert.equal(privacy[0].tableRetainsPath, false);
assert.equal(privacy[1].tableRetainsPath, false);
assert.equal(privacy[2].jsonRetainsPath, false);
const directory = createScratchRoot(join(tmpdir(), "dotln-ver002-update-"));
let update;
try {
  const name = ".agents/skills/dotln-executor/SKILL.md";
  mkdirSync(join(directory, ".agents/skills/dotln-executor"), {
    recursive: true,
  });
  mkdirSync(join(directory, ".claude"), { recursive: true });
  writeFileSync(join(directory, name), "own prior emit\n");
  writeFileSync(
    join(directory, ".claude/harness-manifest.json"),
    JSON.stringify({ installed: [{ path: name }] }),
  );
  const hash = (text) => createHash("sha256").update(text).digest("hex");
  const incoming = { path: name, sha256: hash("next emit\n") };
  let calls = 0;
  const options = {
    generated: new Set([name]),
    harnessCheck() {
      calls++;
      return "passes";
    },
  };
  const missingPrior = planUpdate(
    { files: [] },
    { files: [incoming] },
    directory,
    null,
    options,
  );
  assert.equal(calls, 0);
  assert.equal(missingPrior[0].kind, "refuse");
  const oldListed = planUpdate(
    { files: [{ path: name, sha256: hash("original export\n") }] },
    { files: [incoming] },
    directory,
    null,
    options,
  );
  assert.equal(calls, 1);
  assert.equal(oldListed[0].reEmitted, true);
  update = {
    missingPrior,
    missingPriorCheckCalls: 0,
    oldListed,
    oldListedCheckCalls: 1,
    limit:
      "Pure planner inputs; own check injected as passes, no host election lifecycle or real update published.",
  };
} finally {
  removeTemporaryPath(directory, { recursive: true, force: true });
}
writeFileSync(
  process.argv[2],
  JSON.stringify(
    {
      hostElection: {
        unreadFactIndistinguishableFromControl: false,
        unknownRows: 1,
        exitCode: reportExitCode(unread),
      },
      privacy,
      privacyLimit:
        "Same injected Node version surface as existing privacy corpus; no real host secret or live leak observed.",
      update,
    },
    null,
    2,
  ) + "\n",
);
