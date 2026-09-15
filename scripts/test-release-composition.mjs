import assert from "node:assert/strict";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const [action, root, workOrder = "WO-099"] = process.argv.slice(2);
const write = (path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), value);
};
const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(" ")}\n${result.stdout}${result.stderr}`,
  );
  return result.stdout;
};
if (action === "record") {
  // Other release cases isolate a publication invariant with a synthetic reviewer
  // observation. The lifecycle case below executes the product check itself.
  const { gateTreeHash, gateCodeIdentity } = await import(
    pathToFileURL(join(root, "scripts/lib/gate-evidence.mjs"))
  );
  const segmented = join(root, `docs/control/orders/${workOrder}.jsonl`);
  const segment = existsSync(segmented)
    ? segmented
    : join(root, "docs/control/resume.jsonl");
  const events = readFileSync(segment, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  const event = events
    .filter(
      (row) =>
        row.type === "FinalReviewCompleted" && row.workOrderId === workOrder,
    )
    .at(-1);
  assert.ok(event, `missing synthetic review for ${workOrder}`);
  event.evidence = {
    productGate: {
      checkId: "npm test",
      codeIdentity: gateCodeIdentity(root),
      treeHash: gateTreeHash(root),
      durationMs: 1,
      exitCode: 0,
      executed: true,
      evidenceRef: "fixture:synthetic-review-observation",
      recordedAt: "2026-09-15T00:00:00.000Z",
    },
  };
  writeFileSync(segment, events.map(JSON.stringify).join("\n") + "\n");
} else if (action === "prepare") {
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  manifest.scripts.test = "node scripts/fixture-one-gate.mjs";
  write("package.json", JSON.stringify(manifest, null, 2) + "\n");
  write("scripts/fixture-product.mjs", "export const add = (a, b) => a + b;\n");
  write(
    "scripts/fixture-one-gate.mjs",
    `
import assert from 'node:assert/strict';
import {appendFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {add} from './fixture-product.mjs';
import {gateTreeHash,gateCodeIdentity,recordGateChecks} from './lib/gate-evidence.mjs';
const started=Date.now();
assert.equal(add(2,3),5);assert.equal(add(-3,2),-1);
const output='fixture product assertions passed';
const row={checkId:'npm test',codeIdentity:gateCodeIdentity(process.cwd()),treeHash:gateTreeHash(process.cwd()),durationMs:Date.now()-started,executed:true,exitCode:0,evidenceRef:'fixture:executed-product-gate',recordedAt:new Date().toISOString(),outputSha256:createHash('sha256').update(output).digest('hex')};
recordGateChecks(process.cwd(),[row]);
appendFileSync(process.env.DOTLN_ONE_GATE_LOG,JSON.stringify(row)+'\\n');
console.log(output);
`,
  );
  write(
    `docs/work-orders/${workOrder}-fixture.md`,
    `# ${workOrder} — one-gate lifecycle, v0.2.1\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Objective:** Publish one reviewed product gate after report and control edits.\n\n**Non-goals:** No package distribution.\n`,
  );
  write(
    `docs/final-reviews/${workOrder}/PR.md`,
    "One product gate covers the code through publication.\n",
  );
  write(
    `docs/final-reviews/${workOrder}/RELEASE-NOTES.md`,
    "## Release overview\n\nOne gate survives report updates.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nPublication consumes the reviewed product gate.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nA fixture executes all lifecycle commands and one product gate.\n",
  );
  run("git", ["add", "."]);
  run("git", ["commit", "-m", "fixture product source"]);
} else if (action === "lifecycle") {
  const flags = [
    "--harness",
    "fixture",
    "--harness-version",
    "unrecorded",
    "--model",
    "fixture",
    "--effort",
    "ultra",
    "--source",
    "self-reported",
  ];
  const actor = {
    harness: "fixture",
    harnessVersion: "unrecorded",
    model: "fixture",
    effort: "xhigh",
    mode: "subagents",
    raw: "ultra",
    source: "self-reported",
  };
  const resume = (...args) =>
    run(process.execPath, ["scripts/resume.mjs", ...args]);
  resume("activate", workOrder, `docs/work-orders/${workOrder}-fixture.md`);
  resume("implementation-ready", ...flags);
  resume("verify");
  write(
    `docs/verifications/${workOrder}/VER-001.md`,
    `# Verification\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\nThe product fixture is ready for review.\n`,
  );
  resume("verification-result", "pass", ...flags);
  resume("final-review");
  run("npm", ["test"]);
  // Both reports change after the only gate. No session state is installed.
  appendFileSync(
    join(root, `docs/verifications/${workOrder}/VER-001.md`),
    "\nRecorded after the product gate.\n",
  );
  write(
    `docs/final-reviews/${workOrder}/FINAL-001.md`,
    `# Final review\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\nOne npm test run passed before these report bytes.\n`,
  );
  resume("final-review-result", "pass", ...flags);
  run("git", ["add", "."]);
  run("git", ["commit", "-m", "fixture review and reports after gate"]);
  console.log(
    "activate → implementation-ready → verify → verification-result pass → final-review → npm test → report edits → final-review-result pass",
  );
} else if (action === "assert") {
  const rows = readFileSync(process.env.DOTLN_ONE_GATE_LOG, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(
    rows.length,
    1,
    "whole lifecycle must execute exactly one product gate",
  );
  const manifest = JSON.parse(
    run(process.execPath, [
      "scripts/release.mjs",
      "manifest-from-tag",
      "v0.2.1",
    ]),
  );
  assert.equal(manifest.evidence.length, 1);
  assert.equal(manifest.evidence[0].codeIdentity, rows[0].codeIdentity);
  assert.equal(manifest.evidence[0].reviewedTree, rows[0].treeHash);
  assert.notEqual(manifest.evidence[0].mergeTree, rows[0].treeHash);
  const { readGateChecks } = await import(
    pathToFileURL(join(root, "scripts/lib/gate-evidence.mjs"))
  );
  assert.ok(
    !readGateChecks(root).some(
      (row) => row.treeHash === manifest.evidence[0].mergeTree,
    ),
    "close must not record a main gate",
  );
  console.log(
    "publish → merge → close: exactly one executed product gate; distinct reviewed/merge trees; no main gate required",
  );
} else throw new Error("fixture action required");
