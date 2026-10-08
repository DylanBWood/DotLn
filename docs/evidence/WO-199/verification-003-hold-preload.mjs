// VER-003 variation preload (no model runs): hold one selected source-host
// focused test for 6 s so a signal can arrive while that synchronous child runs.
// Loaded after the order's CLI actor doubles (interrupt-preload.mjs).
// select "post": the writer's change is present; "pre": it is not.
import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const cfg = JSON.parse(readFileSync(process.env.VER003_HOLD, "utf8"));
const original = childProcess.spawnSync;
childProcess.spawnSync = function (command, args, options) {
  const cwd = options?.cwd;
  const changed =
    cwd &&
    existsSync(join(cwd, "fixture.txt")) &&
    readFileSync(join(cwd, "fixture.txt"), "utf8") ===
      "changed by synthetic worker\n";
  if (
    cfg.enabled &&
    command === "/usr/bin/sandbox-exec" &&
    cwd &&
    !basename(cwd).startsWith("test-") &&
    !existsSync(cfg.marker) &&
    (cfg.select === "post" ? changed : !changed)
  ) {
    writeFileSync(cfg.marker, JSON.stringify({ cwd }));
    return original.call(
      this,
      "/bin/sh",
      ["-c", 'sleep 6; exec "$0" "$@"', command, ...(args ?? [])],
      options,
    );
  }
  return original.call(this, command, args, options);
};
syncBuiltinESMExports();
