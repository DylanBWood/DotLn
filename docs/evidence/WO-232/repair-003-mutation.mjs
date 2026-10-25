// Run the permanent gate assertions unchanged against the subject and a widened
// field recognizer. All candidate code and test fixtures stay in system temp.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { fixtureEnvironment } from "../../../scripts/fixtures/instance-with-history/support.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo232-mutation-")),
);
const sourcePath = "scripts/lib/plan-continuation.mjs";
const source = readFileSync(join(root, sourcePath), "utf8");
const exact = String.raw`/^\*\*Workstream:\*\* WS-\d{3}(?:\r?\n|$)$/u`;
const widened = String.raw`/^\*\*Workstream:\*\* WS-\d+ *(?:\r?\n|$)$/u`;
assert.ok(
  source.includes(exact),
  "the declared mutant must replace the field recognizer",
);
const results = [];
try {
  cpSync(join(root, "scripts"), join(scratch, "scripts"), {
    recursive: true,
    filter: (path) => !path.endsWith("/instance-with-history/instance.bundle"),
  });
  for (const name of ["packages", "node_modules", "package.json", "docs"])
    symlinkSync(join(root, name), join(scratch, name));
  writeFileSync(
    join(scratch, "selected.test.mjs"),
    'import { fixtures } from "./scripts/test-plan-refutation.mjs";\nawait fixtures();\n',
  );
  for (const [arm, bytes] of [
    ["subject", source],
    ["widened-pattern", source.replace(exact, widened)],
  ]) {
    writeFileSync(join(scratch, sourcePath), bytes);
    const run = spawnSync(
      process.execPath,
      [
        "--test",
        "--test-name-pattern=^(a later leading Workstream|a legacy amendment)",
        join(scratch, "selected.test.mjs"),
      ],
      {
        cwd: scratch,
        env: fixtureEnvironment(),
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      },
    );
    const output = run.stdout + run.stderr;
    assert.ifError(run.error);
    const failures = output
      .split("\n")
      .filter((line) => /not ok|^✖/u.test(line));
    results.push({
      arm,
      exitCode: run.status,
      failures,
      summary: output
        .split("\n")
        .filter((line) =>
          /tests |pass |fail |skipped |duration_ms|^ℹ/u.test(line),
        ),
    });
    if (arm === "subject") assert.equal(run.status, 0, output);
    else {
      assert.equal(run.status, 1, output);
      assert.match(
        output,
        /(?:not ok|✖).*a later leading Workstream/u,
        "the repaired original guard must kill the mutant",
      );
      assert.match(
        output,
        /(?:not ok|✖).*a legacy amendment/u,
        "the legacy guard must kill the mutant too",
      );
    }
  }
  console.log(
    JSON.stringify(
      {
        pattern: "WS-\\d{3} to WS-\\d+ with optional trailing spaces",
        results,
      },
      null,
      2,
    ),
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
