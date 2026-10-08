// FINAL-001 probe preload. No model runs. Slows only the source host's
// post-result focused test (a writer worktree whose fixture.txt the writer
// double already changed) so a group-wide signal can arrive while that
// synchronous child runs. Loaded after the order's CLI actor doubles
// (scripts/fixtures/vertical/interrupt-preload.mjs).
// PROBE_SIGNAL_DIAG=1 adds a listener that records when this process handles
// a signal and how it exits. PROBE_DROP_SIGNAL_LISTENERS=1 drops dotln
// vertical's new signal listeners to reproduce HEAD's signal disposition
// (HEAD installed none), as VER-001's probe did.
import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const cfg = JSON.parse(readFileSync(process.env.DOTLN_SLOW_TEST, "utf8"));
const original = childProcess.spawnSync;
childProcess.spawnSync = function (command, args, options) {
  const cwd = options?.cwd;
  if (
    cfg.enabled &&
    command === "/usr/bin/sandbox-exec" &&
    cwd &&
    !existsSync(cfg.marker) &&
    existsSync(join(cwd, "fixture.txt")) &&
    readFileSync(join(cwd, "fixture.txt"), "utf8") ===
      "changed by synthetic worker\n"
  ) {
    writeFileSync(cfg.marker, JSON.stringify({ cwd }));
    return original.call(
      this,
      "/bin/sh",
      ["-c", 'sleep 8; exec "$0" "$@"', command, ...(args ?? [])],
      options,
    );
  }
  return original.call(this, command, args, options);
};
syncBuiltinESMExports();

if (process.env.PROBE_SIGNAL_DIAG === "1") {
  const diag = `${cfg.marker}.diag`;
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"])
    process.on(signal, () =>
      appendFileSync(
        diag,
        `handled ${signal}; dotln listeners present ${process.listenerCount(signal) - 1}\n`,
      ),
    );
  process.on("exit", (code) =>
    appendFileSync(diag, `exit code=${code} exitCode=${process.exitCode}\n`),
  );
}
if (process.env.PROBE_DROP_SIGNAL_LISTENERS === "1") {
  const on = process.on.bind(process);
  process.on = (event, listener) =>
    ["SIGINT", "SIGTERM", "SIGHUP"].includes(event)
      ? process
      : on(event, listener);
}
