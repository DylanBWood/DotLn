// Verifier variations for WO-200: a working directory other than the root, and
// a .prettierignore negation that re-includes a pinned file.
import { appendFileSync } from "node:fs";
import { spawnSync, execFileSync } from "node:child_process";
import { join } from "node:path";
const C = process.argv[2];
const head0 = execFileSync("git", ["-C", C, "rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const t = (cwd, file, pattern) => {
  const r = spawnSync(
    process.execPath,
    ["--test", `--test-name-pattern=${pattern}`, file],
    { cwd, encoding: "utf8" },
  );
  return `exit ${r.status}${r.status ? ` (${(/AssertionError[^\n]*|ENOENT[^\n]*|Error: [^\n]*/u.exec(r.stdout) ?? [""])[0].slice(0, 120)})` : ""}`;
};
console.log(
  `== V1 cwd=scripts/: comment WO-200 ignore test ${t(join(C, "scripts"), "test-comment-labels.mjs", "WO-200 every path")}`,
);
console.log(
  `== V1 cwd=corpus/harness/: schema pinned-bytes case ${t(join(C, "corpus/harness"), "wo107-schema.test.mjs", "hashed collector files")}`,
);
console.log(
  `== V1 cwd=corpus/harness/: pre-existing classification case ${t(join(C, "corpus/harness"), "wo107-schema.test.mjs", "classification exception")}`,
);
try {
  appendFileSync(join(C, ".prettierignore"), "!corpus/harness/profile.mjs\n");
  const info = spawnSync(
    "npx",
    ["--no-install", "prettier", "--file-info", "corpus/harness/profile.mjs"],
    { cwd: C, encoding: "utf8" },
  );
  console.log(
    `== V2 negation line appended: prettier --file-info ${info.stdout.replace(/\s+/gu, "")}`,
  );
  console.log(
    `   schema pinned-bytes case ${t(C, "corpus/harness/wo107-schema.test.mjs", "hashed collector files")}; comment ignore test ${t(C, "scripts/test-comment-labels.mjs", "WO-200 every path")}`,
  );
} finally {
  execFileSync("git", ["-C", C, "reset", "-q", "--hard", head0]);
}
