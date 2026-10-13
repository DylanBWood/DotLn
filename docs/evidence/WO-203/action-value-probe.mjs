import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { previewFromRevision } from "../../../scripts/launchpad.mjs";

test("hypothetical defaults preserve their incoming declaration objects", async () => {
  const root = mkdtempSync(join(tmpdir(), "dotln-action-value-"));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")),
  );
  Object.assign(env, {
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_AUTHOR_NAME: "DotLn Fixture",
    GIT_AUTHOR_EMAIL: "fixture@example.invalid",
    GIT_COMMITTER_NAME: "DotLn Fixture",
    GIT_COMMITTER_EMAIL: "fixture@example.invalid",
  });
  const git = (...args) => {
    const result = spawnSync("git", ["-c", "maintenance.auto=false", ...args], {
      cwd: root,
      env,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const write = (path, value) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(value) + "\n");
  };
  const actions = [
    {
      id: "empty-release",
      date: "2026-10-12",
      kind: "add-config-field",
      field: "release",
      value: {},
    },
    {
      id: "invalid-default",
      date: "2026-10-12",
      kind: "add-config-field",
      field: "release.invalidDefault",
      value: true,
    },
    {
      id: "valid-default",
      date: "2026-10-12",
      kind: "add-config-field",
      field: "release.corpus",
      value: false,
    },
  ];
  try {
    git("init", "-q", "-b", "main");
    write("dotln.config.json", { version: 1 });
    write("scripts/kit/KIT-ACTIONS.json", { schemaVersion: 1, actions });
    write(".claude/harness-manifest.json", {
      profiles: [
        {
          profile: {
            runtime: { snapshot: ".runtime/harness/0123456789abcdef" },
          },
        },
      ],
    });
    git("add", ".");
    git("commit", "-qm", "fixture metadata");
    write("KIT-MANIFEST.json", {
      schemaVersion: 1,
      commit: git("rev-parse", "HEAD"),
      tag: null,
      files: [
        "scripts/kit/KIT-ACTIONS.json",
        ".claude/harness-manifest.json",
      ].map((path) => ({
        path,
        sha256: createHash("sha256")
          .update(readFileSync(join(root, path)))
          .digest("hex"),
      })),
    });
    git("add", "KIT-MANIFEST.json");
    git("commit", "-qm", "fixture manifest");
    const preview = await previewFromRevision(root, "HEAD");
    assert.deepEqual(preview.actions, actions);
    assert.match(
      preview.instance.results[1],
      /^cannot apply: invalid-default/u,
    );
    assert.match(preview.instance.results[2], /^applied: valid-default/u);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
