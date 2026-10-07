import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createVerticalPrimitives } from "../../../scripts/lib/vertical-primitives.mjs";

// A bounded evidence probe, not a replacement for the witnessed vertical.
// The remote selector is supplied locally and is never written to this receipt.
const [repository] = process.argv.slice(2);
assert.match(repository ?? "", /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u);
const root = fileURLToPath(new URL("../../../", import.meta.url));
const startedAt = new Date().toISOString();
const started = performance.now();
const api = (suffix) =>
  JSON.parse(
    execFileSync("gh", ["api", `repos/${repository}${suffix}`], {
      encoding: "utf8",
      timeout: 30_000,
      maxBuffer: 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
const repo = api("");
const issues = JSON.parse(
  execFileSync(
    "gh",
    [
      "issue",
      "list",
      "--repo",
      repository,
      "--state",
      "all",
      "--limit",
      "100",
      "--json",
      "number",
    ],
    { encoding: "utf8", timeout: 30_000, stdio: ["ignore", "pipe", "pipe"] },
  ),
);
const tree = api(
  `/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`,
);
const workflows = api("/actions/workflows");
const state = {
  binding: { criteria: [{ criterionId: "visual-probe", claimType: "visual" }] },
  receipts: [
    { command: { step: "source-change" }, value: { commit: "a".repeat(40) } },
  ],
};
const directory = join(root, ".runtime/wo112/witness-probe");
const probe = (configuration, external = {}) =>
  createVerticalPrimitives({ configuration, directory, external }).execute(
    { step: "witnesses", round: 0 },
    state,
  );
const unconfigured = await probe({});
assert.equal(unconfigured.result, "NeedsHuman");
assert.equal(
  unconfigured.value.reason,
  "browser scenario is not configured for the visual claim",
);
let browserCalls = 0;
const configured = await probe(
  { browserScenario: { probe: "explicit double; no browser is launched" } },
  {
    browser: async () => {
      browserCalls++;
      return { source: "synthetic-fixture-double" };
    },
  },
);
assert.equal(browserCalls, 1);
assert.equal(configured.result, "NeedsHuman");
assert.equal(
  configured.value.reason,
  "installed browser adapter supplies synthetic-fixture evidence; live target evidence is unavailable",
);
const receipt = {
  schemaVersion: 1,
  kind: "read-only-readiness-and-witness-guard-probe",
  label: "observed",
  startedAt,
  recordedAt: new Date().toISOString(),
  subject: "WO-112 activation checkout; existing vertical primitives",
  target: {
    selectorShape: "github.com/<operator>/<scratch-repository>",
    visibility: repo.visibility,
    issueCount: issues.length,
    issueEnumerationComplete: issues.length < 100,
    treeEntryCount: tree.tree.length,
    treeEnumerationComplete: tree.truncated === false,
    htmlFilePresent: tree.tree.some(
      (entry) => entry.type === "blob" && /\.html?$/iu.test(entry.path),
    ),
    workflowCount: workflows.total_count,
    automatedReviewerConfiguration:
      "unknown; workflow enumeration does not enumerate installed reviewer applications",
  },
  launchpad: { configurationPresent: false, registeredTargetCount: 0 },
  witnessProbe: {
    visualCriterion: "synthetic probe input, not a compiled StoryContract",
    sourceChangeReceipt: "synthetic probe input; no source-change episode ran",
    unconfigured: {
      result: unconfigured.result,
      reason: unconfigured.value.reason,
    },
    configured: {
      result: configured.result,
      reason: configured.value.reason,
      browserCalls,
      browser: "explicit double; no real browser launched",
    },
  },
  cost: {
    wallMs: Math.round(performance.now() - started),
    tokens: null,
    costUsd: null,
    scope: "this preflight process only",
  },
  effects: {
    remoteReads: true,
    remoteWrites: false,
    modelEpisodes: 0,
    browserEpisodes: 0,
    createdRepositories: 0,
    localWriteDirectory: ".runtime/wo112/witness-probe",
    outsideProjectWrites: [],
  },
  limits: [
    "No witnessed vertical, target branch, generated PR, screenshot, repair or review disposition is established.",
    "The configured branch isolates the existing guard with a browser double; it is not live browser evidence.",
    "Remote identities, URLs, issue text, credentials and user identifiers are omitted.",
  ],
};
// Confirm the launchpad observation from its actual loader, not a hard-coded default.
const { loadConfig } = await import("../../../scripts/lib/config.mjs");
const config = loadConfig(root);
receipt.launchpad = {
  configurationPresent: config.present,
  registeredTargetCount: Object.keys(config.repositories).length,
};
mkdirSync(join(root, "docs/evidence/WO-112"), { recursive: true });
writeFileSync(
  join(root, "docs/evidence/WO-112/preflight.json"),
  JSON.stringify(receipt, null, 2) + "\n",
);
assert.deepEqual(
  JSON.parse(
    readFileSync(join(root, "docs/evidence/WO-112/preflight.json"), "utf8"),
  ),
  receipt,
);
console.log(JSON.stringify(receipt, null, 2));
