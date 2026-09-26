import { readControl } from "./control-store.mjs";
import { gateCodeIdentity, partialGateCheck } from "./gate-evidence.mjs";
import {
  historicalWorkOrders,
  localTags,
  manifestFromAnnotation,
  manifestWorkOrders,
  releaseAnnotations,
  releaseTagsFrom,
} from "./release-tags.mjs";
// The release-history readers moved to release-tags.mjs (WO-070 D003), so a
// lifecycle transition can read tags without loading the gate evidence module;
// this module keeps its public names and adds none.
export {
  compareVersions,
  historicalWorkOrders,
  humanLayerFromTag,
  isDotLnRelease,
  localReleaseTags,
  localTags,
  manifestFromTag,
  manifestWorkOrders,
  semver,
  strictVersionsIn,
  tagAnnotation,
  tagContents,
} from "./release-tags.mjs";

export const localReleaseRecords = (root, snapshot) => {
  const tags = localTags(root);
  for (const expected of snapshot ?? []) {
    const actual = tags.get(expected.name);
    if (
      !actual ||
      actual.objectType !== "tag" ||
      actual.object !== expected.object
    )
      throw new Error(
        `missing or changed recorded release tag: ${expected.name}`,
      );
  }
  const selected = snapshot && new Set(snapshot.map(({ name }) => name));
  const selectedTags = [...tags.values()].filter(
    ({ name }) => !selected || selected.has(name),
  );
  const annotations = releaseAnnotations(root, selectedTags);
  const records = releaseTagsFrom(selectedTags, annotations).map((tag) => {
    // The sole pre-manifest edition has a reviewed repository record.
    const annotation = annotations.get(tag.name);
    const historical =
      tag.name === "v0.2.0" && !annotation.includes("DOTLN-MANIFEST-BEGIN");
    const manifest = historical
      ? undefined
      : manifestFromAnnotation(annotation, tag.name);
    if (
      !historical &&
      (!manifest ||
        typeof manifest !== "object" ||
        Array.isArray(manifest) ||
        manifest.release?.application !== tag.name ||
        !/^WO-\d{3}$/.test(manifest.workOrder?.id) ||
        !Array.isArray(manifest.notes?.changedFiles) ||
        !manifest.notes.changedFiles.every((path) => typeof path === "string"))
    )
      throw new Error(`${tag.name} contains malformed release attribution`);
    const workOrders = historical
      ? historicalWorkOrders(root, tag.name)
      : manifestWorkOrders(manifest, root);
    if (historical && workOrders.length === 0)
      throw new Error(
        "v0.2.0 requires docs/releases/v0.2.0.md historical attribution",
      );
    const controlSegments = snapshot?.find(
      ({ name }) => name === tag.name,
    )?.controlSegments;
    return {
      ...tag,
      manifest,
      workOrders,
      historical,
      ...(controlSegments === undefined ? {} : { controlSegments }),
    };
  });
  if (snapshot && records.length !== snapshot.length)
    throw new Error("recorded tag snapshot contains a non-release tag");
  return records;
};

// Publication consumes the reviewer's observation from committed control history.
// Local gate caches and the review worktree may already be absent on main.
export const reviewedProductGate = (root, workOrderId, revision = "HEAD") => {
  const control = readControl(root, revision);
  const review = [...control.eventSegments.values()]
    .flat()
    .filter(
      (event) =>
        event.workOrderId === workOrderId &&
        event.type === "FinalReviewCompleted",
    )
    .at(-1);
  const gate = review?.evidence?.productGate;
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
  return gate;
};

export const productGateBody = (gate) => {
  const record = {
    checkId: gate.checkId,
    codeIdentity: gate.codeIdentity,
    reviewedTree: gate.treeHash,
    durationMs: gate.durationMs,
    exitCode: gate.exitCode,
    executed: gate.executed,
    evidenceRef: gate.evidenceRef,
    recordedAt: gate.recordedAt,
  };
  return `<!-- dotln-product-gate:start -->\n## Product gate\n\nReviewer \`npm test\` passed in ${gate.durationMs} ms. Reports and release metadata may follow this reviewed tree without changing its code identity.\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n<!-- dotln-product-gate:end -->`;
};
