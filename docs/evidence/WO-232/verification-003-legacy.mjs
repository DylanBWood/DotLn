// VER-003 reproduction: the Workstream admission over an amendment row in the
// pre-v0.51.0 legacy representation (an appended label bound as the
// activation placeholder). Exits 1 while the subject leaves such a row
// unmatched once the order gains one exact leading field. Writes only to
// system temp; reads the repository's own records.
import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../../../scripts/lib/plan-subject.mjs";
import * as subject from "../../../scripts/lib/plan-continuation.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const baseline = "a81561976c8629834a5a18623b097fa4d7d8681a";
const git = (...args) =>
  execFileSync("git", ["-C", root, ...args], { encoding: "utf8" });
const field = (text, id) =>
  text.replace("**Model:**", `**Workstream:** ${id}\n**Model:**`);

// The activation-base reader, loaded beside a copy of the current scripts so
// its relative imports resolve.
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo232-ver003-")),
);
let base, mutant;
try {
  cpSync(join(root, "scripts"), join(scratch, "scripts"), {
    recursive: true,
    filter: (path) => !path.includes("/fixtures/instance-with-history/"),
  });
  for (const name of ["packages", "node_modules", "package.json"])
    symlinkSync(join(root, name), join(scratch, name));
  writeFileSync(
    join(scratch, "scripts/lib/plan-continuation.base.mjs"),
    git("show", `${baseline}:scripts/lib/plan-continuation.mjs`),
  );
  // A widened field pattern, to show which guard still detects it.
  const current = readFileSync(
    join(root, "scripts/lib/plan-continuation.mjs"),
    "utf8",
  );
  // The follow-up guard probe is informational: a repair that rewrites the
  // pattern's text skips it and never changes this script's exit code.
  const exact = String.raw`/^\*\*Workstream:\*\* WS-\d{3}(?:\r?\n|$)$/u`;
  if (current.includes(exact)) {
    writeFileSync(
      join(scratch, "scripts/lib/plan-continuation.mutant.mjs"),
      current.replace(
        exact,
        String.raw`/^\*\*Workstream:\*\* WS-\d+ *(?:\r?\n|$)$/u`,
      ),
    );
    mutant = await import(
      join(scratch, "scripts/lib/plan-continuation.mutant.mjs")
    );
  }
  base = await import(join(scratch, "scripts/lib/plan-continuation.base.mjs"));
} catch (error) {
  rmSync(scratch, { recursive: true, force: true });
  throw error;
}
const result = { baseline, synthetic: [], records: [], guard: [] };
try {
  // 1. A synthetic legacy row: an unlabelled filed title, activated with a
  //    release label and an appended execution record, bound by a
  //    pre-v0.51.0 writer in the placeholder form.
  const text = readFileSync(
    join(
      root,
      "docs/work-orders/WO-231-final-review-lint-from-the-described-base.md",
    ),
    "utf8",
  );
  const filed = text.replace(/ \(v0\.97\.1\)\n/u, "\n");
  const activated =
    filed.replace(/^(# [^\n]+)\n/u, "$1 (v0.98.0)\n").trimEnd() +
    "\n\n## Execution record\n\nEvidence.\n";
  const legacySource = subject.executionAmendmentSource(activated);
  const row = {
    sourceOrderHash: sha256(subject.executionAmendmentSource(filed)),
    orderHash: sha256(legacySource),
    orderLength: legacySource.length,
  };
  for (const [name, after, admit] of [
    ["legacy row, no field", activated, true],
    ["legacy row, field added later", field(activated, "WS-001"), true],
    [
      "legacy row, field and objective changed",
      field(activated, "WS-001").replace(
        "**Objective:**",
        "**Objective:** Changed.",
      ),
      false,
    ],
  ])
    result.synthetic.push({
      case: name,
      expected: admit,
      base: base.matchesExecutionAmendment(filed, after, row),
      subject: subject.matchesExecutionAmendment(filed, after, row),
    });

  // 2. This repository's own live rows: WO-159 is bound in the legacy
  //    representation (2026-09-25), WO-160 in the current one. Neither is in
  //    a later planning receipt, so the current file alone must match.
  const events = readFileSync(
    join(root, "docs/control/plan-refutations.jsonl"),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  const dir = join(root, "docs/planning/refutations");
  const receipts = readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(join(dir, name), "utf8")));
  for (const id of ["WO-159", "WO-160"]) {
    const amended = events
      .filter((e) => e.type === "PlanExecutionAmended" && e.workOrderId === id)
      .at(-1);
    const receipt = receipts.find((r) => r.receiptHash === amended.receiptHash);
    const { path } = receipt.subject.orders.find((o) => o.workOrderId === id);
    const before = git("show", `${receipt.subject.revision}:${path}`);
    const after = readFileSync(join(root, path), "utf8");
    result.records.push({
      order: id,
      recordedAt: amended.recordedAt,
      filedLacksField: !/^\*\*Workstream:\*\*/mu.test(before),
      laterReceipts: receipts.filter(
        (r) =>
          r.pass?.kind === "planning" &&
          r.episode?.completedAt > amended.recordedAt &&
          r.subject.orders.some((o) => o.workOrderId === id),
      ).length,
      asIs: {
        base: base.matchesExecutionAmendment(before, after, amended),
        subject: subject.matchesExecutionAmendment(before, after, amended),
      },
      withField: {
        base: base.matchesExecutionAmendment(
          before,
          field(after, "WS-002"),
          amended,
        ),
        subject: subject.matchesExecutionAmendment(
          before,
          field(after, "WS-002"),
          amended,
        ),
      },
    });
  }

  // 3. Follow-up: the malformed-field guard in test-plan-refutation.mjs
  //    passes the approved body as the filed source. Once a field-only change
  //    retains its field, that guard holds even under a widened pattern; the
  //    matcher beside a bound change does not.
  const approved = text.replace(
    "**Objective:**",
    "**Objective:** Approved change.",
  );
  const grouped = field(approved, "WS-001");
  const bound = subject.executionAmendmentSource(approved, text);
  const boundRow = {
    sourceOrderHash: sha256(subject.executionAmendmentSource(text)),
    orderHash: sha256(bound),
    orderLength: bound.length,
  };
  for (const [name, candidate] of [
    ["WS-1", grouped.replace("WS-001", "WS-1")],
    ["trailing space", grouped.replace("WS-001\n", "WS-001 \n")],
  ])
    for (const [impl, m] of [
      ["subject", subject],
      ...(mutant ? [["mutant", mutant]] : []),
    ])
      result.guard.push({
        candidate: name,
        impl,
        existingGuardHolds:
          m.executionAmendmentSource(candidate, approved) !==
          m.executionAmendmentSource(approved),
        gateAdmits: m.matchesExecutionAmendment(text, candidate, boundRow),
      });
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
result.unadmitted =
  result.synthetic.some((row) => row.subject !== row.expected) ||
  result.records.some((row) => row.asIs.subject && !row.withField.subject);
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.unadmitted ? 1 : 0;
