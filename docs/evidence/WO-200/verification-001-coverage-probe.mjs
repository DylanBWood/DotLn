// Verifier probe: does a machinerySources-only drift of the wo107-schema row
// fail a check the review gate selects for a scripts/test-runner.mjs change?
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync, execFileSync } from "node:child_process";
const C = process.argv[2];
process.chdir(C);
const head0 = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const p = "scripts/test-runner.mjs";
const drops = [
  "corpus/harness/profile.mjs",
  "corpus/harness/wo107-scenarios.mjs",
  "corpus/harness/wo107-schema.test.mjs",
];
for (const drop of drops) {
  try {
    const s = readFileSync(p, "utf8");
    const from = `  "wo107-schema": [\n`;
    const start = s.indexOf(from);
    const end = s.indexOf("  ],\n", start);
    const block = s.slice(start, end);
    if (!block.includes(`    "${drop}",\n`))
      throw new Error(`probe anchor missing ${drop}`);
    writeFileSync(
      p,
      s.slice(0, start) + block.replace(`    "${drop}",\n`, "") + s.slice(end),
    );
    const list = spawnSync(
      "npm",
      ["test", "--silent", "--", "--review", "--list"],
      { encoding: "utf8" },
    );
    const sel = (name) =>
      list.stdout.split("\n").some((l) => l.startsWith(`${name} `));
    const r = spawnSync(
      process.execPath,
      [
        "--test",
        "--test-name-pattern=WO-174 every machinery suite",
        "scripts/test-runner.test.mjs",
      ],
      { encoding: "utf8" },
    );
    const uncovered = (
      r.stdout.match(/wo107-schema: uncovered [^\s'\\]+/gu) ?? []
    ).join(", ");
    console.log(
      `== drop ${drop} from the row's sources: review selects runner-fixtures ${sel("runner-fixtures")}, wo107-schema ${sel("wo107-schema")}; WO-174 coverage exit ${r.status} (${uncovered || "no wo107-schema finding"})`,
    );
  } finally {
    execFileSync("git", ["reset", "-q", "--hard", head0]);
  }
}
