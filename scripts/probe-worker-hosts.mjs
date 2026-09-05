import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  openSync,
  closeSync,
  rmSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Bounded local capability evidence: never print settings, prompt input, auth,
// process identifiers, or raw CLI diagnostics. No model invocation.
const run = (binary, args, cwd) => {
  // Claude's help can exit before its pipe flushes. A regular file captures
  // the complete bounded help rather than misclassifying a truncated pipe.
  const capture = mkdtempSync(join(tmpdir(), "dotln-worker-help-"));
  const file = join(capture, "stdout");
  const fd = openSync(file, "wx", 0o600);
  try {
    const result = spawnSync(binary, args, {
      cwd,
      encoding: "utf8",
      timeout: 15_000,
      maxBuffer: 1_000_000,
      stdio: ["ignore", fd, "pipe"],
    });
    return { status: result.status, stdout: readFileSync(file, "utf8") };
  } finally {
    closeSync(fd);
    rmSync(capture, { recursive: true });
  }
};
const version = (binary) => {
  const result = run(binary, ["--version"]);
  assert.equal(result.status, 0, `${binary} version unavailable`);
  const match = result.stdout.match(/\b\d+\.\d+\.\d+\b/u);
  assert.ok(match, `${binary} version unrecognized`);
  return match[0];
};
const codex = run("codex", ["exec", "--help"]);
const claude = run("claude", ["--help"]);
assert.equal(codex.status, 0);
assert.equal(claude.status, 0);
const evidence = {
  schemaVersion: 1,
  codex: {
    version: version("codex"),
    effort: /--effort\b/u.test(codex.stdout)
      ? "selector-found-reprobe-required"
      : "unknown",
    flags: [],
  },
  claude: { version: version("claude"), effort: "high", flags: [] },
};
for (const flag of [
  "--ephemeral",
  "--ignore-user-config",
  "--output-schema",
  "--json",
  "--model",
  "--strict-config",
])
  if (codex.stdout.includes(flag)) evidence.codex.flags.push(flag);
  else throw new Error(`Codex required control absent: ${flag}`);
for (const flag of [
  "--print",
  "--model",
  "--effort",
  "--output-format",
  "--json-schema",
  "--no-session-persistence",
  "--setting-sources",
  "--settings",
  "--tools",
  "--safe-mode",
  "--strict-mcp-config",
])
  if (claude.stdout.includes(flag)) evidence.claude.flags.push(flag);
  else throw new Error(`Claude required control absent: ${flag}`);

if (process.argv.includes("--sandbox")) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-worker-probe-")));
  const mount = join(root, "mount");
  mkdirSync(mount);
  writeFileSync(join(mount, "allowed"), "fixture-in-mount\n");
  writeFileSync(join(root, "outside"), "fixture-outside-mount\n");
  const args = [
    "sandbox",
    "--permission-profile",
    "dotln-worker",
    "--cd",
    mount,
    "-c",
    'permissions.dotln-worker.filesystem={":minimal"="read",":workspace_roots"="read"}',
    "-c",
    "permissions.dotln-worker.network.enabled=false",
    "--",
  ];
  try {
    const allowed = run(
      "codex",
      [...args, "/bin/cat", join(mount, "allowed")],
      mount,
    );
    assert.equal(
      allowed.status,
      0,
      "mounted read did not succeed (runner must allow nested sandbox)",
    );
    assert.equal(allowed.stdout, "fixture-in-mount\n");
    const outside = run(
      "codex",
      [...args, "/bin/cat", join(root, "outside")],
      mount,
    );
    assert.notEqual(
      outside.status,
      0,
      "unmounted read escaped the sense boundary",
    );
    assert.equal(outside.stdout, "");
    const write = run(
      "codex",
      [...args, "/usr/bin/touch", join(mount, "denied-write")],
      mount,
    );
    assert.notEqual(write.status, 0, "write escaped the read-only mount");
    evidence.codex.senseBoundary = {
      mountedRead: "pass",
      unmountedRead: "denied",
      mountedWrite: "denied",
    };
  } finally {
    rmSync(root, { recursive: true });
  }
}
console.log(JSON.stringify(evidence, null, 2));
