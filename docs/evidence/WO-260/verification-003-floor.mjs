// VER-003 criterion 2 probe for WO-260: the two floor entry points the
// criterion names, each under a git whose --version line is spoofed and
// which runs the below-floor shim for everything else. `harness check` is
// run as itself; the `host` suite's floor judgment is run as its task's own
// command (`node scripts/structural-checks.mjs host`), so no version-spoofed
// gate row is written beside the complete row. Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-260/verification-003-floor.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const { createFixtureRoot, removeTemporaryPath } = await import(
  pathToFileURL(join(root, "scripts/lib/temporary-roots.mjs"))
);
const { shellQuote } = await import(
  pathToFileURL(join(root, "scripts/lib/git.mjs"))
);
const bin = createFixtureRoot(join(tmpdir(), "dotln-ver260-003-version-"));
const readings = [];
try {
  writeFileSync(
    join(bin, "git"),
    `#!/bin/sh\nif [ "$1" = --version ]; then printf '%s\\n' "$VERIFIER_GIT_VERSION"; exit 0; fi\nexec ${shellQuote(join(root, "scripts/fixtures/git-below-floor/git"))} "$@"\n`,
  );
  chmodSync(join(bin, "git"), 0o755);
  for (const [label, args] of [
    ["node scripts/harness.mjs check", ["scripts/harness.mjs", "check"]],
    [
      "node scripts/structural-checks.mjs host",
      ["scripts/structural-checks.mjs", "host"],
    ],
  ])
    for (const [version, expected] of [
      ["git version 2.31.0", 0],
      ["git version 2.31.0.windows.1", 0],
      ["git version 2.39.3 (Apple Git-146)", 0],
      ["git version 2.30.9", 1],
    ]) {
      const result = spawnSync(process.execPath, args, {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          VERIFIER_GIT_VERSION: version,
        },
      });
      const output = (result.stdout + result.stderr).trim();
      readings.push({
        command: label,
        version,
        exitCode: result.status,
        output: output.slice(0, 400),
      });
      assert.equal(result.status, expected, `${label} ${version}: ${output}`);
      if (expected === 1) {
        assert.ok(output.includes(">=2.31.0"), output);
        assert.ok(output.includes("2.30.9"), output);
      }
    }
  console.log(JSON.stringify(readings, null, 2));
} finally {
  removeTemporaryPath(bin, { recursive: true, force: true });
}
