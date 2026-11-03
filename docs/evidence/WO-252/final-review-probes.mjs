// Final review FINAL-001, finding F1: the registration floor bounds a
// disposable pattern's form, not the material it reaches. A last segment with
// any literal part is admitted, so `**/*.*` registers, and `*` matches a
// leading dot, so that one entry reaches every ignored file whose name holds a
// dot: an operator note, a stray `.env`, a writer record. All writes stay in a
// fixture root under the system temporary directory.
import assert from "node:assert/strict";
import test from "node:test";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig } from "../../../scripts/lib/config.mjs";
import { disposableMatchRoot } from "../../../scripts/lib/target-worktree-close.mjs";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";

test("FINAL-001 F1: the floor admits **/*.* at registration, and that entry matches every ignored file whose name holds a dot", () => {
  const root = createFixtureRoot(join(tmpdir(), "dotln-wo252-final-review-"));
  try {
    writeFileSync(
      join(root, "dotln.config.json"),
      JSON.stringify({
        version: 1,
        classes: {
          "fixture-class": {
            checks: [],
            supports: [],
            disposable: ["**/*.*"],
          },
        },
      }),
    );
    // The floor refuses only a last segment with no literal part; `*.*`
    // carries one, the dot, and is admitted.
    assert.deepEqual(loadConfig(root).classes["fixture-class"].disposable, [
      "**/*.*",
    ]);
    // Each of these is matched at its own path, so a close deletes it as
    // declared output rather than refusing it as undeclared material.
    for (const file of [
      ".env",
      "docs/control/local/notes.txt",
      "docs/control/local/harness/writer.json",
      "libs/a/.secret.key",
    ])
      assert.equal(disposableMatchRoot("**/*.*", file), file, file);
    // A directory whose own name holds a dot is the shortest matching run,
    // so it is the matched root and everything below it is declared output.
    assert.equal(
      disposableMatchRoot("**/*.*", ".runtime/notes.txt"),
      ".runtime",
    );
    assert.equal(
      disposableMatchRoot(
        "**/*.*",
        ".runtime/harness/0123456789abcdef/packages/skeleton/package.json",
      ),
      ".runtime",
    );
    // Only a name without a dot escapes the entry.
    assert.equal(disposableMatchRoot("**/*.*", "Makefile"), null);
    assert.equal(disposableMatchRoot("**/*.*", "libs/a/LICENSE"), null);
  } finally {
    removeTemporaryPath(root, { recursive: true, force: true });
  }
});
