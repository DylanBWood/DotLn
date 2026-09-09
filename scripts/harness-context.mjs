import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  harnessInstallation,
  harnessInstructionBlock,
} from "./lib/harness.mjs";
import {
  HARNESS_CONTEXT_BASE,
  citedSelectors,
  countReads,
  directedReads,
  legacyDirectedReads,
  snapshotReader,
} from "./lib/harness-context.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
export const fixtureTree = join(root, "scripts/fixtures/harness-context/tree");
export const roles = ["executor", "verifier", "reviewer", "release-close"];
export function fixtureSelectors(read) {
  const workOrder = "docs/work-orders/WO-999-fixture.md";
  const inputs = [
    "fixture/source.ts",
    "fixture/source.test.mjs",
    "fixture/contract.md",
  ];
  return {
    "@work-order": [workOrder],
    "@citations": citedSelectors(read(workOrder), inputs, read),
    "@subject-files": inputs,
    "@failure-report": ["docs/verifications/WO-999/VER-001.md"],
    "@verification-reports": ["docs/verifications/WO-999/VER-001.md"],
    "@final-review": [
      "docs/final-reviews/WO-999/FINAL-001.md",
      "docs/final-reviews/WO-999/PR.md",
      "docs/final-reviews/WO-999/RELEASE-NOTES.md",
    ],
  };
}
export function measureHarnessContext(overrides = new Map()) {
  const snapshot = snapshotReader(root);
  const installation = harnessInstallation();
  const files = new Map(
    installation.files.map((file) => [file.path, file.contents]),
  );
  const floor = readFileSync(join(root, "CLAUDE.md"), "utf8");
  const instruction = floor.includes("<!-- dotln-harness:start -->")
    ? floor.replace(
        harnessInstructionBlock(floor).trimEnd(),
        files.get("CLAUDE.md").trimEnd(),
      )
    : `${floor.trimEnd()}\n\n${files.get("CLAUDE.md")}`;
  const taskRead = (path) =>
    existsSync(join(fixtureTree, path))
      ? readFileSync(join(fixtureTree, path), "utf8")
      : readFileSync(join(root, path), "utf8");
  const selectors = fixtureSelectors(taskRead);
  const oldInstruction = snapshot.read("CLAUDE.md");
  const oldGuide = snapshot.read("docs/product/07-execution-guide.md");
  const beforeRead = (path) =>
    path === "CLAUDE.md"
      ? oldInstruction
      : path === "docs/product/07-execution-guide.md"
        ? oldGuide
        : taskRead(path);
  const afterRead = (path) =>
    overrides.get(path) ??
    (path === "CLAUDE.md" ? instruction : (files.get(path) ?? taskRead(path)));
  const result = [];
  for (const skillsRoot of [".claude/skills", ".agents/skills"])
    for (const role of roles) {
      const skill = afterRead(`${skillsRoot}/dotln-${role}/SKILL.md`);
      const before = countReads(
        legacyDirectedReads(
          oldInstruction,
          oldGuide,
          role,
          selectors,
          beforeRead,
        ),
        beforeRead,
      );
      const after = countReads(
        directedReads({
          instruction,
          skill,
          role,
          skillsRoot,
          selectors,
          read: afterRead,
        }),
        afterRead,
      );
      const lower = after.bytes < before.bytes && after.lines < before.lines;
      result.push({
        role,
        skillsRoot,
        before,
        after,
        lower,
        residue: lower
          ? []
          : [
              {
                originId: `contributor.${role}`,
                reason: "Complete directed input set is not strictly lower",
                files: after.files.map((file) => file.path),
              },
            ],
      });
    }
  const beforeInstruction = countReads(
    [{ path: "CLAUDE.md", startLine: 1, endLine: Number.MAX_SAFE_INTEGER }],
    beforeRead,
  );
  const afterInstruction = countReads(
    [{ path: "CLAUDE.md", startLine: 1, endLine: Number.MAX_SAFE_INTEGER }],
    afterRead,
  );
  return {
    schemaVersion: 1,
    activationBase: HARNESS_CONTEXT_BASE,
    task: "matched synthetic WO-999 closed role-entry fixture",
    method:
      "Whole activation instruction and its mandatory execution guide versus whole current instruction and generated role skill. Both sides receive identical fixture task files and current shared task guidance; only the activation instruction and execution guide remain frozen. Full files or named heading subtrees are counted as UTF-8 bytes and source lines, with overlapping reads counted once. The complete role procedure is scanned, including later reads. Commands' process I/O is execution, not automatically model-loaded file content. This controlled comparison does not estimate a work order's own changing implementation context or harness system prompts.",
    selectors,
    instruction: {
      before: beforeInstruction,
      after: afterInstruction,
      lower:
        afterInstruction.bytes < beforeInstruction.bytes &&
        afterInstruction.lines < beforeInstruction.lines,
    },
    profiles: result,
  };
}
export function checkContextMeasurement(measurement) {
  assert.ok(
    measurement.instruction.lower,
    "instruction context did not shrink",
  );
  for (const row of measurement.profiles)
    assert.ok(
      row.lower,
      `${row.skillsRoot}/${row.role}: ${JSON.stringify(row.residue)}`,
    );
}
if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = measureHarnessContext();
  checkContextMeasurement(result);
  const destination = join(root, "docs/evidence/WO-042/harness-context.json");
  const text = JSON.stringify(result, null, 2) + "\n";
  if (process.argv.includes("--write")) {
    mkdirSync(join(root, "docs/evidence/WO-042"), { recursive: true });
    writeFileSync(destination, text);
  } else if (process.argv.includes("--check"))
    assert.equal(
      readFileSync(destination, "utf8"),
      text,
      "context measurement drift",
    );
  console.log(
    JSON.stringify(
      {
        instruction: {
          before: result.instruction.before.bytes,
          after: result.instruction.after.bytes,
        },
        roles: result.profiles.map(
          ({ role, skillsRoot, before, after, lower }) => ({
            role,
            skillsRoot,
            beforeBytes: before.bytes,
            afterBytes: after.bytes,
            beforeLines: before.lines,
            afterLines: after.lines,
            lower,
          }),
        ),
      },
      null,
      2,
    ),
  );
}
