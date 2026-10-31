import { readControl } from "./control-store.mjs";
import {
  gateCodeIdentity,
  gateInstanceInputDigest,
  instanceDigestMismatch,
  partialGateCheck,
} from "./gate-evidence.mjs";
import { runGit } from "./git.mjs";
// The release-history readers moved to release-tags.mjs (WO-070 D003), so a
// lifecycle transition can read tags without loading the gate evidence module;
// this module keeps its public names and adds none.
export {
  compareVersions,
  historicalWorkOrders,
  humanLayerFromTag,
  isDotLnRelease,
  isStarterTag,
  localReleaseTags,
  localReleaseRecords,
  localTags,
  manifestFromTag,
  manifestWorkOrders,
  semver,
  strictVersionsIn,
  tagAnnotation,
  tagContents,
} from "./release-tags.mjs";

// Publication consumes the reviewer's observation from committed control history.
// Local gate caches and the review worktree may already be absent on main.
export const reviewedProductGate = (
  root,
  workOrderId,
  revision = "HEAD",
  { liveInstance = false, installationRoot = root } = {},
) => {
  const control = readControl(root, revision);
  let review, gate;
  for (const events of control.eventSegments.values()) {
    const index = events.findLastIndex(
      (event) =>
        event.workOrderId === workOrderId &&
        event.type === "FinalReviewCompleted",
    );
    if (index < 0) continue;
    review = events[index];
    // A review recorded without a gate is bound to one by a later
    // `correct --set productGate=<evidenceRef>`, whose event carries the whole
    // row; the latest such correction of this review wins (WO-115 D026).
    const bound = events
      .slice(index + 1)
      .filter(
        (event) =>
          event.workOrderId === workOrderId &&
          event.type === "RecordCorrected" &&
          event.subject?.ordinal === index + 1 &&
          event.fields?.productGate !== undefined,
      )
      .at(-1);
    gate = bound?.evidence?.productGate ?? review.evidence?.productGate;
  }
  if (
    review?.verdict !== "pass" ||
    gate?.checkId !== "npm test" ||
    partialGateCheck(gate) ||
    gate.executed !== true ||
    gate.exitCode !== 0 ||
    !/^[a-f0-9]{64}$/.test(gate.codeIdentity ?? "") ||
    !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(gate.treeHash ?? "") ||
    !Number.isFinite(gate.durationMs) ||
    gate.durationMs < 0 ||
    typeof gate.evidenceRef !== "string" ||
    !gate.evidenceRef ||
    !Number.isFinite(Date.parse(gate.recordedAt))
  )
    throw new Error(
      `${workOrderId} has no recorded passing reviewer npm test row`,
    );
  if (gate.codeIdentity !== gateCodeIdentity(root, revision))
    throw new Error(
      `${workOrderId} reviewed code identity differs from ${revision}; source changed after the product gate`,
    );
  if (liveInstance) {
    const digestMismatch = instanceDigestMismatch(
      gate,
      gateInstanceInputDigest(installationRoot),
    );
    if (digestMismatch)
      throw new Error(
        digestMismatch === "missing"
          ? `${workOrderId} reviewed npm test row records no installed-runtime digest; run the instance gate and record a fresh review before publication`
          : `${workOrderId} reviewed installed runtime differs from the current instance; run the instance gate and record a fresh review before publication`,
      );
  }
  return gate;
};

export const reviewedLaunchpadIdentity = (
  root,
  workOrderId,
  revision = "HEAD",
) => {
  const baseCommit = runGit(root, ["merge-base", revision, "origin/main"]);
  const headIdentity = gateCodeIdentity(root, revision),
    baseIdentity = gateCodeIdentity(root, baseCommit);
  return headIdentity === baseIdentity
    ? {
        unchanged: true,
        headIdentity,
        baseIdentity,
        baseCommit,
        body: `<!-- dotln-product-gate:start -->\n## Launchpad identity\n\nNo launchpad code changed. HEAD code identity \`${headIdentity}\` equals code identity \`${baseIdentity}\` at merge base \`${baseCommit}\`. Target validation is bound in the recorded final review.\n\n<!-- dotln-product-gate:end -->`,
      }
    : {
        unchanged: false,
        headIdentity,
        baseIdentity,
        baseCommit,
        body: productGateBody(
          reviewedProductGate(root, workOrderId, revision, {
            liveInstance: true,
          }),
        ),
      };
};

export const productGateBody = (gate) => {
  const record = {
    checkId: gate.checkId,
    codeIdentity: gate.codeIdentity,
    ...(gate.instanceInputDigest === undefined
      ? {}
      : { instanceInputDigest: gate.instanceInputDigest }),
    reviewedTree: gate.treeHash,
    durationMs: gate.durationMs,
    exitCode: gate.exitCode,
    executed: gate.executed,
    evidenceRef: gate.evidenceRef,
    recordedAt: gate.recordedAt,
  };
  return `<!-- dotln-product-gate:start -->\n## Product gate\n\nReviewer \`npm test\` passed in ${gate.durationMs} ms. Reports and release metadata may follow this reviewed tree without changing its code identity.\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n<!-- dotln-product-gate:end -->`;
};
