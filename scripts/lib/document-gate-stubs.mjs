// Every script the document gate runs, which the runner's own CLI-selection
// fixture (scripts/test-runner.test.mjs) stubs before it runs `--document` in
// a temporary launchpad. A new document suite adds its script here, and
// `npm run test:docs` refuses one that is missing (WO-157 item 13, WO-151 D021).
export const DOCUMENT_GATE_STUBS = [
  "format.cjs",
  "check-publication.mjs",
  "docs-check.mjs",
  "test-docs-check.mjs",
  "work-orders.mjs",
  "lineage.mjs",
  "test-lineage.mjs",
  "refute-plan.mjs",
  "test-plan-refutation.mjs",
  "entropy.mjs",
  "release.mjs",
  "authority-evidence.mjs",
  "artifact-identity-evidence.mjs",
  "verification-evidence.mjs",
  "feedback-evidence.mjs",
  "harness.mjs",
  "harness-context.mjs",
  "harness-evidence.mjs",
  "meta.mjs",
  "check-registrations.mjs",
  "build.mjs",
];
