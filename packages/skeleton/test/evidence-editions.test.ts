import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { currentEvidence, evidenceArgs } from "../src/evidence-editions.mjs";

test("current evidence follows one manifest, independent of active order; explicit historical pins survive", () => {
  const root = mkdtempSync(join(tmpdir(), "dotln-evidence-edition-"));
  try {
    mkdirSync(join(root, "docs/evidence"), { recursive: true });
    const select = (workOrder: string, revision: string | null) =>
      writeFileSync(
        join(root, "docs/evidence/current.json"),
        JSON.stringify({
          schemaVersion: 1,
          editions: { feedback: { workOrder, revision } },
        }),
      );
    select("WO-998", "003");
    assert.equal(
      currentEvidence(root, "feedback").directory,
      "docs/evidence/WO-998/feedback-003",
    );
    select("WO-999", "004");
    assert.equal(
      currentEvidence(root, "feedback").directory,
      "docs/evidence/WO-999/feedback-004",
    );
    assert.equal(
      evidenceArgs(root, "feedback", ["--check"]).selection.directory,
      "docs/evidence/WO-999/feedback-004",
    );
    const pinned = evidenceArgs(root, "feedback", [
      "--check",
      "--edition",
      "WO-011",
    ]);
    assert.deepEqual(pinned.args, ["--check"]);
    assert.equal(pinned.selection.directory, "docs/evidence/WO-011");
    assert.equal(
      evidenceArgs(root, "authority", [
        "--edition",
        "WO-042",
        "--revision",
        "002",
        "--write",
      ]).selection.directory,
      "docs/evidence/WO-042/authority/002",
    );
    assert.throws(
      () => currentEvidence(root, "verification"),
      /Invalid current-evidence/,
    );
    for (const args of [
      ["--edition"],
      ["--revision", "000"],
      ["--edition", "../escape"],
      ["--edition", "WO-001", "--edition", "WO-002"],
    ])
      assert.throws(() => evidenceArgs(root, "feedback", args));
    select("../escape", null);
    assert.throws(
      () => currentEvidence(root, "feedback"),
      /Invalid current-evidence/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
