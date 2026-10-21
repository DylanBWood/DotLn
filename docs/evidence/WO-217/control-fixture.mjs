import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = fs.realpathSync(
  fs.mkdtempSync(path.join(os.tmpdir(), "dotln-control-fixture-")),
);
fs.writeFileSync(path.join(root, ".dotln-test-root-owner"), "fixture\n");
try {
  const result = spawnSync(process.execPath, [process.argv[2], root], {
    stdio: "inherit",
    env: Object.fromEntries(
      Object.entries(process.env).filter(
        ([name]) => name !== "NODE_TEST_CONTEXT",
      ),
    ),
  });
  process.exitCode = result.status ?? 1;
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
