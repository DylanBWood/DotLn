// Verifier selection probe for WO-200 in the scratch clone: origin/main is the
// overlay commit, so the merge base holds every WO-200 byte.
import { readFileSync, writeFileSync, appendFileSync, rmSync } from "node:fs";
import { spawnSync, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const C = process.argv[2];
process.chdir(C);
const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();
const head0 = git("rev-parse", "HEAD");
const list = (...args) => {
  const r = spawnSync("npm", ["test", "--silent", "--", ...args, "--list"], {
    encoding: "utf8",
  });
  if (r.status !== 0)
    return `list failed ${r.status}: ${r.stderr.slice(0, 200)}`;
  return r.stdout.split("\n").some((l) => l.startsWith("wo107-schema "))
    ? "selected"
    : "absent";
};
const hash = () =>
  createHash("sha256")
    .update(
      [
        "profile.mjs",
        "wo107-records.mjs",
        "wo107-scenarios.mjs",
        "wo107-bounded.mjs",
      ]
        .map((f) => `${f}\n${readFileSync(`corpus/harness/${f}`, "utf8")}`)
        .join("\n"),
    )
    .digest("hex");
const restore = (added = []) => {
  git("reset", "-q", "--hard", head0);
  for (const f of added) rmSync(f, { force: true });
  const dirty = git("status", "--porcelain");
  if (dirty) throw new Error(`clone not restored: ${dirty}`);
};
console.log(
  `merge base ${git("merge-base", "HEAD", "origin/main")} head ${head0}`,
);
const cases = [
  ["S0 no change against the merge base", () => []],
  [
    "S1 uncommitted comment edit to wo107-bounded.mjs",
    () => (
      appendFileSync("corpus/harness/wo107-bounded.mjs", "// probe\n"),
      []
    ),
  ],
  [
    "S2 committed comment edit to profile.mjs",
    () => {
      const p = "corpus/harness/profile.mjs";
      writeFileSync(
        p,
        readFileSync(p, "utf8").replace(
          "changed after D007.",
          "changed after the classification fix (D007).",
        ),
      );
      git(
        "-c",
        "user.name=probe",
        "-c",
        "user.email=probe@example.invalid",
        "commit",
        "-qam",
        "probe edit",
      );
      return [];
    },
  ],
  [
    "S3 edit to wo107-schema.test.mjs only",
    () => (
      appendFileSync("corpus/harness/wo107-schema.test.mjs", "// probe\n"),
      []
    ),
  ],
  [
    "S4 edit to scripts/test-runner.mjs only",
    () => (appendFileSync("scripts/test-runner.mjs", "// probe\n"), []),
  ],
  [
    "S5 edit to .gitattributes only",
    () => (appendFileSync(".gitattributes", "# probe\n"), []),
  ],
  [
    "S6 new untracked corpus/harness file",
    () => (
      writeFileSync("corpus/harness/probe-new.mjs", "export {};\n"),
      ["corpus/harness/probe-new.mjs"]
    ),
  ],
];
for (const [label, apply] of cases) {
  let added = [];
  try {
    added = apply();
    console.log(`== ${label}: review ${list("--review")}; plain ${list()}`);
  } finally {
    restore(added);
  }
}
// Formatter probe: an ignored collector keeps a deliberately unformatted line.
const before = hash();
const p = "corpus/harness/wo107-bounded.mjs";
try {
  appendFileSync(p, "const   probe   =   1  ;\n");
  const mutated = hash();
  const r = spawnSync(
    "npx",
    ["--no-install", "prettier", "--write", "corpus/harness/"],
    { encoding: "utf8" },
  );
  const after = hash();
  const kept = readFileSync(p, "utf8").endsWith("const   probe   =   1  ;\n");
  console.log(
    `== F1 prettier --write corpus/harness/: exit ${r.status}; unformatted collector line kept ${kept}; hash unchanged by prettier ${after === mutated}`,
  );
  const r2 = spawnSync("npx", ["--no-install", "prettier", "--check", p], {
    encoding: "utf8",
  });
  console.log(
    `== F2 prettier --check on the named collector: exit ${r2.status}; ${(r2.stdout + r2.stderr).trim().split("\n").pop()}`,
  );
} finally {
  restore();
}
console.log(`== hash after restore ${hash()} (before ${before})`);
