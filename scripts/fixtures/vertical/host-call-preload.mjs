// Real synchronous children inside explicit CLI actor doubles. The parent
// signals the whole foreground group after the marker, including this host.
import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { SourceChangeWorktree } from "../../../packages/skeleton/dist/src/source-change-worktree.js";
import { VerticalHost } from "../../../packages/skeleton/dist/src/vertical-host.js";

const cfg = JSON.parse(
  readFileSync(process.env.DOTLN_INTERRUPT_FIXTURE, "utf8"),
);
const call = cfg.hostCall;
const spawnSync = childProcess.spawnSync;
const execFileSync = childProcess.execFileSync;
const changed = (cwd) =>
  existsSync(join(cwd, "fixture.txt")) &&
  readFileSync(join(cwd, "fixture.txt"), "utf8") ===
    "changed by synthetic worker\n";
const hold = (cwd) => {
  writeFileSync(call.marker, JSON.stringify({ cwd }));
  return `${call.trapSignal ? "trap 'exit 17' INT TERM HUP; " : ""}sleep 8; exec "$0" "$@"`;
};
if (call) {
  childProcess.spawnSync = function (command, args, options) {
    const cwd = options?.cwd;
    const snapshot = cwd && basename(cwd).startsWith("test-");
    const selected =
      cwd &&
      command === "/usr/bin/sandbox-exec" &&
      ((call.kind === "focused-test" && !snapshot && changed(cwd)) ||
        (call.kind === "witness-test" &&
          snapshot &&
          basename(dirname(cwd)).startsWith("candidate-")) ||
        (call.kind === "baseline-test" &&
          snapshot &&
          basename(dirname(cwd)).startsWith("baseline-snapshot")));
    if (selected && !existsSync(call.marker))
      return spawnSync.call(
        this,
        "/bin/sh",
        ["-c", hold(cwd), command, ...(args ?? [])],
        options,
      );
    return spawnSync.call(this, command, args, options);
  };
  syncBuiltinESMExports();
  // A killed git read normally throws. Hold one inside the actual admission
  // method, after the writer has committed, to test interruption precedence
  // over both the integrity's unreadable verdict and host-admission refusals.
  for (const [kind, method] of [
    ["integrity", "sharedState"],
    ["worktree", "verify"],
    ["effect", "effect"],
  ]) {
    const original = SourceChangeWorktree.prototype[method];
    SourceChangeWorktree.prototype[method] = function (...args) {
      if (call.kind === kind && changed(this.path) && !existsSync(call.marker))
        execFileSync(
          "/bin/sh",
          ["-c", hold(this.path), "git", "rev-parse", "HEAD"],
          { cwd: this.path, stdio: "pipe" },
        );
      return original.apply(this, args);
    };
  }
}
if (cfg.signalAfterRun) {
  const run = VerticalHost.prototype.run;
  VerticalHost.prototype.run = async function (...args) {
    const result = await run.apply(this, args);
    if (result.terminal) process.kill(process.pid, cfg.signalAfterRun);
    return result;
  };
}
