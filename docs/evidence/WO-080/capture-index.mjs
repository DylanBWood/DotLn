import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createWorkstreamIndexFixture } from "../../../scripts/test-workstream-index-fixture.mjs";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";

const root = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-workstream-capture-")),
);
try {
  const fixture = createWorkstreamIndexFixture(root);
  writeFileSync(
    join(
      TOOL_ROOT,
      "packages/console/fixtures/inputs/workOrderIndex-workstreams.md",
    ),
    fixture.readme(),
  );
  console.log(
    "Captured the synthetic two-repository, three-member index; no local paths in the input.",
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
