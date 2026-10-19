// Criterion 2's `harness check` clause through the CLI: emit the contributor
// harness into a scratch repository, leave a host-rule sidecar whose order has
// no registered target worktree, and read what `harness check` prints there.
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const root = process.cwd();
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo221-ver002-check-")),
);
const run = (command, args, cwd = root) =>
  spawnSync(command, args, { cwd, encoding: "utf8" });
try {
  run("git", ["init", "-q", "-b", "main", scratch]);
  const emitted = run(process.execPath, [
    "scripts/harness.mjs",
    "emit",
    "--out",
    scratch,
  ]);
  const clean = run(process.execPath, [
    "scripts/harness.mjs",
    "check",
    "--out",
    scratch,
  ]);
  const sidecars = join(scratch, "docs/control/local/host-rules");
  mkdirSync(sidecars, { recursive: true });
  writeFileSync(
    join(sidecars, "WO-998.json"),
    `${JSON.stringify({
      schemaVersion: 1,
      workOrderId: "WO-998",
      repositoryId: "target",
      target: join(scratch, "gone"),
      claude: [`Bash(git -C ${join(scratch, "gone")} push -u origin wo-998)`],
      codex: ".codex/rules/dotln-WO-998.rules",
    })}\n`,
  );
  const stale = run(process.execPath, [
    "scripts/harness.mjs",
    "check",
    "--out",
    scratch,
  ]);
  const line = stale.stdout
    .split("\n")
    .find((text) => text.includes("stale host rules"));
  console.log(
    JSON.stringify({
      probe: "harness-check-stale",
      emitExit: emitted.status,
      cleanExit: clean.status,
      cleanStale: clean.stdout.includes("stale host rules"),
      staleExit: stale.status,
      staleLine: line?.replace(scratch, "<scratch>") ?? null,
      stderr: (emitted.stderr + clean.stderr + stale.stderr).slice(0, 400),
    }),
  );
  if (
    emitted.status !== 0 ||
    clean.status !== 0 ||
    clean.stdout.includes("stale host rules") ||
    !/stale host rules for WO-998: no registered target worktree holds this order; run .*host-rules --remove WO-998/u.test(
      line ?? "",
    )
  )
    process.exitCode = 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
