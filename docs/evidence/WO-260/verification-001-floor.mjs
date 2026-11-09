import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const { createFixtureRoot, removeTemporaryPath } = await import(
  pathToFileURL(join(root, "scripts/lib/temporary-roots.mjs"))
);
const { shellQuote } = await import(
  pathToFileURL(join(root, "scripts/lib/git.mjs"))
);
const bin = createFixtureRoot(join(tmpdir(), "dotln-ver260-version-"));
try {
  writeFileSync(
    join(bin, "git"),
    `#!/bin/sh\nif [ "$1" = --version ]; then printf '%s\\n' "$VERIFIER_GIT_VERSION"; exit 0; fi\nexec ${shellQuote(join(root, "scripts/fixtures/git-below-floor/git"))} "$@"\n`,
  );
  chmodSync(join(bin, "git"), 0o755);
  for (const [version, expected] of [
    ["git version 2.31.0", 0],
    ["git version 2.31.0.windows.1", 0],
    ["git version 2.30.9", 1],
  ]) {
    const result = spawnSync(
      process.execPath,
      ["scripts/harness.mjs", "check"],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          VERIFIER_GIT_VERSION: version,
        },
      },
    );
    assert.equal(result.status, expected, result.stdout + result.stderr);
    if (expected === 1) {
      assert.ok(result.stderr.includes(">=2.31.0"));
      assert.ok(result.stderr.includes("2.30.9"));
    }
    console.log(
      JSON.stringify({
        command: "node scripts/harness.mjs check",
        version,
        exitCode: result.status,
        output: (result.stdout + result.stderr).trim(),
      }),
    );
  }
} finally {
  removeTemporaryPath(bin, { recursive: true, force: true });
}
