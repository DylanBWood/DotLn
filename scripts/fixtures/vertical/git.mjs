#!/usr/bin/env node
import { readFileSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const cfg = JSON.parse(
  readFileSync(process.env.DOTLN_VERTICAL_FIXTURE, "utf8"),
);
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
