import test from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  collectSessionUsage,
  currentCodexSession,
  renderCodexSession,
  usageSessionKey,
} from "../packages/skeleton/src/usage-observation.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "dotln-session-readback-"));
  const directory = join(root, "sessions");
  mkdirSync(directory);
  const id = "current-fixture-thread";
  const meta = {
    type: "session_meta",
    timestamp: "2026-09-16T19:00:00Z",
    payload: {
      id,
      cwd: root,
      cli_version: "0.154.0",
      originator: "codex-tui",
      privateText: "never projected",
    },
  };
  const turn = {
    type: "turn_context",
    timestamp: "2026-09-16T19:01:00Z",
    payload: {
      model: "gpt-6-astra",
      effort: "ultra",
      cwd: root,
      collaboration_mode: {
        settings: { developer_instructions: "never projected" },
      },
    },
  };
  const write = (rows) =>
    writeFileSync(
      join(directory, `${id}.jsonl`),
      rows.map(JSON.stringify).join("\n") + "\n",
    );
  write([meta, turn]);
  return {
    root,
    directory,
    meta,
    turn,
    write,
    options: {
      env: {},
      sessionKey: usageSessionKey(id),
      codexDirectory: directory,
      claudeDirectory: join(root, "absent"),
    },
  };
}

test("WO-049 Codex model, effort and CLI readback is available before a usage counter", () => {
  const f = fixture();
  try {
    const observed = currentCodexSession(f.root, f.options);
    assert.deepEqual(observed, {
      available: true,
      harness: "codex-cli",
      harnessVersion: "0.154.0",
      model: "gpt-6-astra",
      effort: "ultra",
      source: "codex-session-readback",
      observedAt: f.turn.timestamp,
    });
    assert.match(
      renderCodexSession(observed),
      /gpt-6-astra; effort ultra \(xhigh \+ workflows\); CLI 0.154.0/,
    );
    assert.throws(
      () => collectSessionUsage(f.root, f.options),
      /Token measurement required/,
    );
    for (const privateValue of [
      f.root,
      "current-fixture-thread",
      "never projected",
      "developer_instructions",
    ])
      assert.ok(!JSON.stringify(observed).includes(privateValue));
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});
test("WO-049 Codex reporting follows latest turn and never substitutes a stale or generic default", () => {
  const f = fixture();
  try {
    const latest = {
      ...f.turn,
      timestamp: "2026-09-16T19:02:00Z",
      payload: { model: "fixture-model", effort: "high" },
    };
    f.write([f.meta, f.turn, latest]);
    assert.equal(currentCodexSession(f.root, f.options).model, "fixture-model");
    assert.equal(currentCodexSession(f.root, f.options).effort, "high");
    f.write([f.meta, f.turn, { ...latest, payload: {} }]);
    assert.equal(currentCodexSession(f.root, f.options).model, null);
    assert.equal(currentCodexSession(f.root, f.options).effort, null);
    assert.equal(
      currentCodexSession(f.root, f.options).harnessVersion,
      "0.154.0",
    );
    f.write([
      { ...f.meta, payload: { ...f.meta.payload, cwd: tmpdir() } },
      f.turn,
    ]);
    assert.equal(currentCodexSession(f.root, f.options).available, false);
    assert.equal(
      currentCodexSession(f.root, {
        ...f.options,
        sessionKey: usageSessionKey("other-thread"),
      }).available,
      false,
    );
    assert.match(
      renderCodexSession(currentCodexSession(f.root, f.options)),
      /no default substituted/,
    );
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});
test("WO-049 Codex reporting preserves available fields and projects no malformed timestamp", () => {
  const f = fixture();
  try {
    f.write([
      { ...f.meta, payload: { ...f.meta.payload, cli_version: null } },
      { ...f.turn, timestamp: { privateText: "never projected" } },
    ]);
    const observed = currentCodexSession(f.root, f.options);
    assert.equal(observed.available, true);
    assert.equal(observed.model, "gpt-6-astra");
    assert.equal(observed.effort, "ultra");
    assert.equal(observed.harnessVersion, null);
    assert.equal(observed.observedAt, null);
    assert.match(renderCodexSession(observed), /CLI unknown/);
    assert.ok(!JSON.stringify(observed).includes("never projected"));
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});
test("WO-049 status JSON automatically reports the active Codex thread without a lifecycle mutation", () => {
  const f = fixture();
  try {
    const root = fileURLToPath(new URL("../", import.meta.url));
    f.write([{ ...f.meta, payload: { ...f.meta.payload, cwd: root } }, f.turn]);
    const before = readFileSync(
      new URL("../docs/control/current.md", import.meta.url),
      "utf8",
    );
    const output = execFileSync(
      process.execPath,
      ["scripts/resume.mjs", "status", "--json"],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          CODEX_HOME: f.root,
          CODEX_THREAD_ID: f.meta.payload.id,
        },
      },
    );
    const result = JSON.parse(output);
    assert.equal(result.currentSession.model, "gpt-6-astra");
    assert.equal(result.currentSession.effort, "ultra");
    assert.equal(result.currentSession.harnessVersion, "0.154.0");
    assert.equal(
      readFileSync(
        new URL("../docs/control/current.md", import.meta.url),
        "utf8",
      ),
      before,
    );
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});
