import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import * as current from "../../../../scripts/lib/codex-background.mjs";

// Synthetic process rows and a recording signal callback only. This probe
// never reads the real process table or signals a real process.
const [scratch, output] = process.argv.slice(2);
assert.ok(scratch && output, "supply session scratch and the result path");
const baselineFile = join(scratch, "cleanup-baseline.mjs");
writeFileSync(
  baselineFile,
  execFileSync("git", [
    "show",
    "refs/dotln/checkpoint/WO-276/77:scripts/lib/codex-background.mjs",
  ]),
);
const baseline = await import(pathToFileURL(baselineFile));
const home = "/fixture/person with spaces";
const release = `${home}/.codex/packages/app-server-daemon/releases/0.169.0-aarch64-apple-darwin/bin`;
const daemon = {
  pid: 501,
  ppid: 1,
  command: `${release}/codex app-server daemon pid-update-loop`,
};
const server = {
  pid: 502,
  ppid: 501,
  command: `${release}/codex app-server --listen unix:///fixture/socket --analytics-default-enabled`,
};
const helper = {
  pid: 503,
  ppid: 502,
  command: `${release}/codex-code-mode-host --listen grpc+stdio://`,
};
const results = [];
const record = (name, fn) => {
  try {
    const detail = fn();
    results.push({ name, passed: true, ...detail });
  } catch (error) {
    results.push({ name, passed: false, error: error.message });
  }
};
const run = (module, rows, options = {}) => {
  const selected = [];
  const message = module.closeLeftoverCodexServers({
    repository: "/fixture/project",
    temporary: "/fixture/temp",
    env: {},
    home,
    rows,
    kill: (pid) => selected.push(pid),
    ...options,
  });
  return { selected, message };
};
const permutations = [
  [daemon, server, helper],
  [daemon, helper, server],
  [server, daemon, helper],
  [server, helper, daemon],
  [helper, daemon, server],
  [helper, server, daemon],
];
for (const [index, rows] of permutations.entries()) {
  record(`abandoned-order-${index}`, () => {
    const result = run(current, rows);
    assert.equal(result.selected[0], daemon.pid);
    assert.deepEqual([...result.selected].sort(), [501, 502, 503]);
    return result;
  });
}
for (const args of ["", "exec --ephemeral -", "resume", "a prompt"]) {
  for (const parent of [1, 501, 502]) {
    record(`live-cli-${args || "interactive"}-parent-${parent}`, () => {
      const live = {
        pid: 700,
        ppid: parent,
        command: `${release}/codex${args ? ` ${args}` : ""}`,
      };
      const rows = [helper, live, daemon, server];
      const before = run(baseline, rows);
      const after = run(current, rows);
      assert.ok(before.selected.includes(live.pid));
      assert.deepEqual(after.selected, []);
      return {
        baselineSelectedLive: true,
        currentSelected: after.selected,
      };
    });
  }
}
for (const [name, rows] of [
  ["server-without-daemon", [server, helper]],
  ["daemon-not-orphaned", [{ ...daemon, ppid: 99 }, server, helper]],
  ["server-parent-unknown", [daemon, { ...server, ppid: 99 }, helper]],
  ["helper-parent-unknown", [daemon, server, { ...helper, ppid: 99 }]],
  [
    "helper-other-release",
    [
      daemon,
      server,
      { ...helper, command: helper.command.replace("0.169.0", "0.170.0") },
    ],
  ],
  [
    "unknown-role",
    [
      daemon,
      server,
      helper,
      { pid: 700, ppid: 502, command: `${release}/future-helper` },
    ],
  ],
  [
    "external-live-cli",
    [
      daemon,
      server,
      helper,
      { pid: 700, ppid: 99, command: "/fixture/bin/codex exec -" },
    ],
  ],
  [
    "live-application",
    [
      daemon,
      server,
      helper,
      {
        pid: 700,
        ppid: 99,
        command: "/Applications/Codex.app/Contents/MacOS/Codex",
      },
    ],
  ],
]) {
  record(name, () => {
    const result = run(current, rows);
    assert.deepEqual(result.selected, []);
    return result;
  });
}
record("two-independent-abandoned-releases", () => {
  const other = [daemon, server, helper].map((row) => ({
    ...row,
    pid: row.pid + 100,
    ppid: row.ppid === 1 ? 1 : row.ppid + 100,
    command: row.command.replace("0.169.0", "0.170.0"),
  }));
  const result = run(current, [
    helper,
    other[1],
    daemon,
    other[2],
    server,
    other[0],
  ]);
  assert.deepEqual(
    new Set(result.selected),
    new Set([501, 502, 503, 601, 602, 603]),
  );
  assert.deepEqual(result.selected.slice(0, 2), [501, 601]);
  return result;
});
for (const key of ["CODEX_THREAD_ID", "DOTLN_GATE_CHILD", "DOTLN_TEMP_GATE"]) {
  record(`guard-${key}`, () => {
    const result = run(current, [daemon, server, helper], {
      env: { [key]: "fixture" },
    });
    assert.deepEqual(result.selected, []);
    return result;
  });
}
record("temporary-directory-guard", () => {
  const result = run(current, [daemon, server, helper], {
    repository: "/fixture/temp/project",
  });
  assert.deepEqual(result.selected, []);
  return result;
});
record("ownership-marker-guard", () => {
  const temporary = mkdtempSync(join(scratch, "cleanup-owner-"));
  writeFileSync(join(temporary, current.TEMPORARY_ROOT_RECORD), "{}\n");
  const repository = join(temporary, "nested", "project");
  mkdirSync(repository, { recursive: true });
  const result = run(current, [daemon, server, helper], { repository });
  assert.deepEqual(result.selected, []);
  return result;
});
record("process-reader-and-read-failure", () => {
  const parsed = current.processCommands({
    execFile: () =>
      ` 501 1 ${daemon.command}\n 502 501 ${server.command}\ninvalid row\n`,
  });
  assert.deepEqual(parsed, [daemon, server]);
  assert.deepEqual(
    current.processCommands({
      execFile: () => {
        throw new Error("fixture read failure");
      },
    }),
    [],
  );
  return { parsedCount: parsed.length };
});
record("signal-failure-does-not-fail-lifecycle", () => {
  const attempted = [];
  const result = run(current, [daemon, server, helper], {
    kill: (pid) => {
      attempted.push(pid);
      throw new Error("fixture signal refused");
    },
  });
  assert.deepEqual(attempted, [501, 502, 503]);
  assert.equal(result.message, "");
  return { attempted, message: result.message };
});
const report = {
  observedAt: new Date().toISOString(),
  baseline: "refs/dotln/checkpoint/WO-276/77",
  source: "scripts/lib/codex-background.mjs",
  mode: "synthetic process rows, recording signal callback; no real signals",
  total: results.length,
  passed: results.filter((row) => row.passed).length,
  results,
};
writeFileSync(resolve(output), `${JSON.stringify(report, null, 2)}\n`);
console.log(
  JSON.stringify({
    total: report.total,
    passed: report.passed,
    failures: results.filter((row) => !row.passed),
  }),
);
if (report.passed !== report.total) process.exitCode = 1;
