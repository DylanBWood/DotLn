import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { registerHooks } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
assert.ok(!args.length || (args.length === 1 && args[0] === "--baseline"));
const url = pathToFileURL(join(process.cwd(), "scripts/lib/meta.mjs")).href;
if (args[0] === "--baseline") {
  const source = execFileSync(
    "git",
    ["show", "feb7a92e:scripts/lib/meta.mjs"],
    { encoding: "utf8" },
  );
  registerHooks({
    load(target, context, next) {
      return target === url
        ? { format: "module", source, shortCircuit: true }
        : next(target, context);
    },
  });
}
const { readDecisions } = await import(url);
const root = mkdtempSync(join(tmpdir(), "wo175-predicate-"));
try {
  const directory = join(root, "docs/evidence/WO-999");
  mkdirSync(directory, { recursive: true });
  const decision = {
    id: "WO-999-D001",
    date: "2026-09-30",
    dispatch: "fixture",
    decision: "fixture",
    evidence: ["fixture"],
    rejected: [],
    reopenWhen: {
      metric: "coldStartBytes.misspelled",
      operator: ">",
      value: 1,
    },
  };
  writeFileSync(
    join(directory, "decisions.md"),
    "```json\n" + JSON.stringify(decision) + "\n```\n",
  );
  assert.throws(
    () => readDecisions(root),
    /WO-999-D001.*coldStartBytes\.misspelled/,
  );
  console.log("PASS: unresolved metric names its decision and metric");
} finally {
  rmSync(root, { recursive: true, force: true });
}
