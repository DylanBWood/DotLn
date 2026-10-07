#!/usr/bin/env node
import { readFileSync, appendFileSync, realpathSync } from "node:fs";
import { spawnSync } from "node:child_process";
const cfg = JSON.parse(
  readFileSync(process.env.DOTLN_VERTICAL_FIXTURE, "utf8"),
);
// A double whose configured git is itself would recurse without bound.
if (realpathSync(cfg.git) === realpathSync(process.argv[1])) {
  process.stderr.write("vertical git double refuses to invoke itself\n");
  process.exit(70);
}
let args = process.argv.slice(2);
if (args.includes("push")) {
  appendFileSync(cfg.calls, JSON.stringify({ actor: "git-push", args }) + "\n");
  args = args.map((a) =>
    /^https:\/\/github.com\/dotln-fixture\/target(?:\.git)?$/u.test(a)
      ? cfg.remote
      : a,
  );
}
const r = spawnSync(cfg.git, args, { stdio: "inherit" });
process.exit(r.status ?? 1);
