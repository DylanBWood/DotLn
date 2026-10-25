// Compare the writer and all admitted bindings with the pre-repair checkpoint,
// then exercise the field admission over every live repository amendment.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as subject from "../../../scripts/lib/plan-continuation.mjs";
import { sha256 } from "../../../scripts/lib/plan-subject.mjs";
import {
  readOverrides,
  readReceipts,
} from "../../../scripts/lib/plan-receipts.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const beforeRevision = "4e3b84ef57ea27badca26ca1466a7cb01000894e";
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo232-repair003-")),
);
const git = (...args) =>
  execFileSync("git", ["-C", root, ...args], { encoding: "utf8" });
const field = (text, newline = "\n") =>
  text.replace("**Model:**", `**Workstream:** WS-001${newline}**Model:**`);
const result = {
  beforeRevision,
  writerComparisons: 0,
  preservedMatches: 0,
  substantiveRefusals: 0,
  records: [],
};
try {
  const priorFile = join(scratch, "before.mjs");
  writeFileSync(
    priorFile,
    git("show", `${beforeRevision}:scripts/lib/plan-continuation.mjs`)
      .replaceAll('from "./', `from "${join(root, "scripts/lib")}/`)
      .replace(
        'from "prettier/plugins/markdown.mjs"',
        `from "${join(root, "node_modules/prettier/plugins/markdown.mjs")}"`,
      ),
  );
  const prior = await import(priorFile);
  for (const title of ["", " (version assigned at activation)", " (v1.0.0)"])
    for (const newline of ["\n", "\r\n"])
      for (const existingField of [false, true]) {
        let filed = `# WO-901 — Fixture${title}\n\n**Model:** fixture\n**Cost:** one fixture.\n\n**Objective:** Original shape.\n\n**Acceptance criteria (all required)**\n\n1. Preserve the record.\n`;
        if (existingField) filed = field(filed);
        filed = filed.replaceAll("\n", newline);
        const changes = [
          filed,
          filed.replace("Original shape", "Approved shape"),
          filed.trimEnd() +
            `\n\n## Execution record${newline}${newline}Bound evidence.${newline}`,
        ];
        for (const change of changes)
          for (const activated of [
            change,
            change.replace(/^# [^\r\n]+/u, "# WO-901 — Fixture (v1.2.3)"),
          ])
            for (const approved of [
              activated,
              field(activated, newline),
              field(activated, newline).replace("WS-001", "WS-1"),
            ]) {
              assert.equal(
                subject.executionAmendmentSource(approved, filed),
                prior.executionAmendmentSource(approved, filed),
                "writer bytes remain identical",
              );
              result.writerComparisons++;
              for (const bound of [
                prior.executionAmendmentSource(approved, filed),
                prior.executionAmendmentSource(approved),
              ]) {
                const row = {
                  sourceOrderHash: sha256(
                    prior.executionAmendmentSource(filed),
                  ),
                  orderHash: sha256(bound),
                  orderLength: bound.length,
                };
                if (row.sourceOrderHash === row.orderHash) continue;
                for (const current of [
                  approved,
                  field(approved, newline),
                  approved.trimEnd() +
                    `\n\n## Execution record${newline}${newline}Later evidence.${newline}`,
                ]) {
                  if (prior.matchesExecutionAmendment(filed, current, row)) {
                    assert.equal(
                      subject.matchesExecutionAmendment(filed, current, row),
                      true,
                      "matching must only widen",
                    );
                    result.preservedMatches++;
                  }
                  const changed = current.replace(
                    /(?:Original|Approved) shape/u,
                    "Unapproved shape",
                  );
                  assert.notEqual(changed, current);
                  assert.equal(
                    subject.matchesExecutionAmendment(filed, changed, row),
                    false,
                    "objective bytes remain bound",
                  );
                  result.substantiveRefusals++;
                }
              }
            }
      }

  const events = readOverrides(root);
  const latest = new Map();
  for (const row of events)
    if (row.type === "PlanExecutionAmended")
      latest.set(`${row.receiptHash}:${row.workOrderId}`, row);
  const withdrawn = new Set(
    events
      .filter((row) => row.type === "PlanExecutionAmendmentWithdrawn")
      .map((row) => row.rowOrdinalWithdrawn),
  );
  const receipts = await readReceipts(root);
  for (const row of latest.values()) {
    if (withdrawn.has(row.rowOrdinal)) continue;
    const receipt = receipts.find(
      (value) => value.receiptHash === row.receiptHash,
    );
    const order = receipt.subject.orders.find(
      (value) => value.workOrderId === row.workOrderId,
    );
    const filed = git("show", `${receipt.subject.revision}:${order.path}`);
    const current = readFileSync(join(root, order.path), "utf8");
    const asIs = subject.matchesExecutionAmendment(filed, current, row);
    assert.equal(asIs, true, `${row.workOrderId}: live binding`);
    const eligible =
      !/^\*\*Workstream:\*\*/mu.test(filed) &&
      !/^\*\*Workstream:\*\*/mu.test(current);
    let withField = null;
    if (eligible) {
      const grouped = field(current);
      assert.notEqual(grouped, current);
      withField = subject.matchesExecutionAmendment(filed, grouped, row);
      assert.equal(
        withField,
        true,
        `${row.workOrderId}: later field admission`,
      );
    }
    result.records.push({
      order: row.workOrderId,
      row: row.rowOrdinal,
      asIs,
      eligible,
      withField,
    });
  }
  result.liveRecords = result.records.length;
  result.laterFieldAdmissions = result.records.filter(
    (row) => row.withField,
  ).length;
  console.log(JSON.stringify(result, null, 2));
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
