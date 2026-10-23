import { mkdtempSync, realpathSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
const [script, ...args] = process.argv.slice(2);
const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo219-probe-")));
writeFileSync(join(root, ".dotln-test-root-owner"), "wo219-owned-fixture\n");
const env = {
  ...process.env,
  CODEX_THREAD_ID: "",
  COPILOT_AGENT_SESSION_ID: "",
  CLAUDE_EFFORT: "",
};
try {
  const result = spawnSync(process.execPath, [script, root, ...args], {
    env,
    stdio: "inherit",
  });
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(root, { recursive: true, force: true });
}
