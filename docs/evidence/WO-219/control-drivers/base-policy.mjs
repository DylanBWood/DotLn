import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
const read = (file) =>
  execFileSync(
    "git",
    ["show", `c670e6288ecb221ef2416cef06f920006866bc5d:${file}`],
    { encoding: "utf8" },
  );
assert.match(
  read("docs/product/07-execution-guide.md"),
  /copy of a repository leaves out `\.control-beacons` and guards per-file/,
);
assert.doesNotMatch(
  read("README.md"),
  /Codex carries the same duties as role text/,
);
console.log(
  JSON.stringify({
    baseline: "c670e6288ecb221ef2416cef06f920006866bc5d",
    sparseCopyPolicy: "present with beacon exclusion and per-file guard",
    obsoleteReadmeCodexSentence: "absent",
  }),
);
