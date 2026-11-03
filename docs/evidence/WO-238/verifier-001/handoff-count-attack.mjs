// Isolated fixture rows only: this does not record a gate in the subject.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const source = process.cwd();
const load = (file) => import(pathToFileURL(join(source, file)));
const { gateCodeIdentity, gateTreeHash, recordGateChecks } = await load(
  "scripts/lib/gate-evidence.mjs",
);
const { requireGateClaims } = await load("scripts/lib/handoff-ledger.mjs");
const root = mkdtempSync(join(tmpdir(), "dotln-phase-handoff-"));
execFileSync("git", ["init", "-q", "-b", "wo-901", root]);
const write = (file, text) => {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), text);
};
write(".gitignore", "docs/control/local/\n");
write("source.mjs", "export const unchanged = true;\n");
write("docs/evidence/WO-901/handoff.md", "Executor handoff\n");
const identity = gateCodeIdentity(root);
const row = (name, at) => ({
  checkId: "npm run test:docs",
  codeIdentity: identity,
  treeHash: gateTreeHash(root),
  subject: "isolated-fixture",
  executed: true,
  exitCode: 0,
  durationMs: 1,
  requiredSuites: ["docs-check"],
  evidenceRef: `fixture:${name}`,
  recordedAt: at,
  cases: [
    {
      name: "docs-check",
      executed: true,
      exitCode: 0,
      durationMs: 1,
      finishedAt: at,
    },
  ],
});
recordGateChecks(root, [row("executor-documents", "2030-01-01T00:00:01Z")]);
const ledger = {
  checked: true,
  claims: { plain: [], review: [], document: ["13"] },
};
const options = {
  runner: join(source, "scripts/test-runner.mjs"),
  state: { workOrderId: "WO-901", phase: "executing" },
  log: { warn() {} },
};
const first = await requireGateClaims(root, ledger, options);
assert.deepEqual(first.advisories, []);
write("docs/verifications/WO-901/VER-001.md", "Verifier handoff\n");
assert.equal(gateCodeIdentity(root), identity);
recordGateChecks(root, [row("verifier-documents", "2030-01-01T00:01:01Z")]);
const second = await requireGateClaims(root, ledger, {
  ...options,
  state: { ...options.state, phase: "verifying" },
});
assert.equal(second.advisories.length, 1);
assert.match(second.advisories[0], /Handoff failure: 2 document-gate runs/u);
console.log(
  JSON.stringify(
    {
      method:
        "Isolated synthetic gate-index fixture: one document row for an executor candidate, then one for its verifier report; no subject gate or real passing check is invented.",
      documentRowsPerHandoff: [1, 1],
      firstAdvisories: first.advisories,
      secondAdvisories: second.advisories,
      acceptedDocumentRow: second.documentGate.evidenceRef,
      expected:
        "One required document run in each distinct phase is not a repeated-run failure within one handoff.",
    },
    null,
    2,
  ),
);
