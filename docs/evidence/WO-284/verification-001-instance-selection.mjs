import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const moduleOf = (p) => import(pathToFileURL(join(process.cwd(), p)));
const { createFixtureRoot, removeTemporaryPath } = await moduleOf(
  "scripts/lib/temporary-roots.mjs",
);
const { runGate } = await moduleOf("scripts/test-runner.mjs");
const { checkConfiguration } = await moduleOf("scripts/structural-checks.mjs");
const root = createFixtureRoot(join(tmpdir(), "dotln-instance-selection-"));
try {
  writeFileSync(join(root, "KIT-MANIFEST.json"), "{}\n");
  const list = async (args) => {
    const lines = [];
    const old = console.log;
    console.log = (...v) => lines.push(v.join(" "));
    try {
      await runGate([...args, "--list", "--selected"], root);
    } finally {
      console.log = old;
    }
    return lines
      .filter((l) => l.includes(" — protects:"))
      .map((l) => l.split(" — ")[0]);
  };
  for (const flags of [[], ["--document"], ["--review"]]) {
    const names = await list(flags);
    assert.ok(names.includes("configuration"));
    assert.ok(!names.includes("configuration-root"));
    console.log(
      JSON.stringify({
        selection: flags,
        configuration: names.includes("configuration"),
        kitTests: names.includes("configuration-root"),
      }),
    );
  }
  assert.ok(
    (await list(["--only", "configuration-root"])).includes(
      "configuration-root",
    ),
  );
  assert.equal(checkConfiguration(root).exitCode, 0);
  writeFileSync(
    join(root, "dotln.config.json"),
    JSON.stringify({ version: 1, roots: { control: 7 } }),
  );
  const refused = checkConfiguration(root);
  assert.equal(refused.exitCode, 1);
  assert.match(refused.output, /roots.control/);
  console.log(
    JSON.stringify({
      namedDiagnostic: true,
      invalidOwnConfigurationRefused: true,
    }),
  );
} finally {
  removeTemporaryPath(root, { recursive: true, force: true });
}
