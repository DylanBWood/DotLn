import assert from "node:assert/strict";
import {
  runScenario,
  replayScenario,
} from "../../packages/skeleton/dist/src/scenario.js";
import {
  args,
  exactFiles,
  fingerprint,
  isMain,
  jsonBytes,
  rng,
  SEED,
} from "./wo105-common.mjs";

export const LABEL =
  "NON-NORMATIVE structural data; not a Seiri policy or deletion authorization";
export const CLASSES = ["documentation", "source", "notes", "generated-stale"];
export const SPECS = [
  {
    id: "chain-mixed",
    classes: [0, 1, 2, 1, 3, 3],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: "cycle-mixed",
    classes: [0, 1, 2, 1, 3, 2, 3, 3],
    edges: [
      [0, 1],
      [1, 2],
      [2, 1],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: "orphan-heavy",
    classes: [0, 1, 1, 1, 0, 2, 2, 3, 3, 3, 3, 3],
    edges: [
      [0, 1],
      [2, 3],
      [3, 2],
      [1, 7],
      [7, 8],
    ],
  },
  {
    id: "source-only",
    classes: [1, 1, 1],
    edges: [
      [0, 1],
      [1, 2],
    ],
  },
];
const sorted = (items) => [...items].sort();
const counts = (classes) =>
  Object.fromEntries(
    CLASSES.map((name) => [
      name,
      classes.filter((item) => item === name).length,
    ]),
  );

export function generateTree(spec, seed) {
  const next = rng(`${seed}:${spec.id}`);
  const paths = spec.classes.map(
    (_, i) => `${spec.id}/file-${i}-${next().toString(16)}.txt`,
  );
  const classes = spec.classes.map((index) => CLASSES[index]);
  const files = paths.map((path, i) => ({
    path,
    referencedBy: spec.edges
      .filter(([, to]) => to === i)
      .map(([from]) => paths[from])
      .sort(),
    classification: classes[i],
  }));
  // Generator truth comes from the planted index graph, not a read of the tree.
  const reached = new Set([0]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [from, to] of spec.edges)
      if (reached.has(from) && !reached.has(to)) {
        reached.add(to);
        changed = true;
      }
  }
  const incoming = new Set(spec.edges.map(([, to]) => to));
  const orphans = paths.filter((_, i) => !incoming.has(i));
  return {
    tree: { files },
    truth: {
      label: LABEL,
      family: spec.id,
      seed,
      roots: [paths[0]],
      inventoryCount: paths.length,
      classificationCounts: counts(classes),
      edges: spec.edges.map(([from, to]) => [paths[from], paths[to]]).sort(),
      reachable: sorted(paths.filter((_, i) => reached.has(i))),
      unreachable: sorted(paths.filter((_, i) => !reached.has(i))),
      orphans: sorted(orphans),
      plantedCandidates: sorted(
        paths.filter(
          (_, i) => !incoming.has(i) && classes[i] === "generated-stale",
        ),
      ),
    },
  };
}

export function validateTree(tree, truth) {
  assert.equal(truth.label, LABEL);
  assert.ok(
    Array.isArray(tree.files) && tree.files.length > 0,
    "nonempty file array",
  );
  const files = new Map();
  for (const file of tree.files) {
    assert.equal(typeof file.path, "string");
    assert.match(file.path, /^[a-z0-9/-]+\.txt$/);
    assert.ok(!files.has(file.path), "duplicate file path");
    assert.ok(CLASSES.includes(file.classification), "unknown classification");
    assert.ok(Array.isArray(file.referencedBy), "references must be an array");
    assert.equal(
      new Set(file.referencedBy).size,
      file.referencedBy.length,
      "duplicate reference",
    );
    files.set(file.path, file);
  }
  const edges = [];
  const outgoing = new Map([...files.keys()].map((path) => [path, []]));
  for (const file of tree.files)
    for (const from of file.referencedBy) {
      assert.ok(files.has(from), "dangling reference");
      outgoing.get(from).push(file.path);
      edges.push([from, file.path]);
    }
  assert.ok(
    truth.roots.length > 0 && truth.roots.every((path) => files.has(path)),
    "invalid root",
  );
  const reached = new Set();
  const queue = [...truth.roots];
  for (let i = 0; i < queue.length; i++) {
    const path = queue[i];
    if (reached.has(path)) continue;
    reached.add(path);
    queue.push(...outgoing.get(path));
  }
  assert.equal(files.size, truth.inventoryCount, "inventory count");
  assert.deepEqual(
    counts(tree.files.map((file) => file.classification)),
    truth.classificationCounts,
    "classification counts",
  );
  assert.deepEqual(edges.sort(), truth.edges, "reference graph");
  assert.deepEqual(sorted(reached), truth.reachable, "reachability");
  assert.deepEqual(
    sorted([...files.keys()].filter((path) => !reached.has(path))),
    truth.unreachable,
    "unreachable set",
  );
  assert.deepEqual(
    sorted(
      tree.files
        .filter((file) => file.referencedBy.length === 0)
        .map((file) => file.path),
    ),
    truth.orphans,
    "orphan set",
  );
  assert.deepEqual(
    sorted(
      tree.files
        .filter(
          (file) =>
            file.referencedBy.length === 0 &&
            file.classification === "generated-stale",
        )
        .map((file) => file.path),
    ),
    truth.plantedCandidates,
    "planted candidates",
  );
}

export function assertScenarioIdentity(live) {
  const replayed = replayScenario(live.log);
  assert.deepEqual(
    live.decisions.map((decision) => decision.trace),
    replayed.decisions.map((decision) => decision.trace),
    "live/replay decision traces",
  );
  for (const name of [
    "timeline",
    "glyphScene",
    "workOrder",
    "candidates",
    "verified",
    "cancelledScheduleIds",
    "activeScheduleIds",
  ])
    assert.deepEqual(live[name], replayed[name], `live/replay ${name}`);
}
export function treeFamilies(seed = SEED, runner = runScenario) {
  const signatures = new Set();
  return SPECS.map((spec) => {
    const { tree, truth } = generateTree(spec, seed);
    validateTree(tree, truth);
    let live;
    try {
      live = runner(tree);
    } catch (error) {
      return {
        id: spec.id,
        tree,
        truth,
        disposition: "excluded-with-reason",
        reason: error.message,
      };
    }
    assertScenarioIdentity(live);
    assert.deepEqual(
      sorted(live.candidates.map((candidate) => candidate.path)),
      truth.plantedCandidates,
    );
    const signature = {
      candidates: sorted(live.candidates.map((candidate) => candidate.path)),
      classificationCounts: truth.classificationCounts,
      traceShape: live.decisions.map((decision) => [
        decision.trace.reactorId,
        ...decision.trace.branchPath,
      ]),
      verified: live.verified,
    };
    // Counts must also differ: random filenames alone never earn another family.
    const distinct = fingerprint({
      ...signature,
      candidates: signature.candidates.length,
    });
    assert.ok(!signatures.has(distinct), `redundant behavior: ${spec.id}`);
    signatures.add(distinct);
    return {
      id: spec.id,
      tree,
      truth,
      disposition: "included",
      signature,
      signatureSha256: fingerprint(signature),
    };
  });
}
export function buildTreeFiles(seed = SEED) {
  const families = treeFamilies(seed);
  const files = {};
  for (const family of families) {
    const prefix = `corpus/fixtures/skeleton-trees/${family.id}`;
    files[`${prefix}/tree.json`] = jsonBytes(family.tree);
    files[`${prefix}/ground-truth.json`] = jsonBytes(family.truth);
  }
  files["corpus/fixtures/skeleton-trees/index.json"] = jsonBytes({
    seed,
    cap: 4,
    families: families.map(({ tree: _tree, truth: _truth, ...meta }) => meta),
  });
  return files;
}
if (isMain(import.meta.url)) {
  const { seed, mode } = args(process.argv.slice(2), ["write", "check"]);
  const files = buildTreeFiles(seed);
  exactFiles(files, mode);
  console.log(
    JSON.stringify({
      lane: "tree-generator",
      seed,
      mode,
      families: SPECS.length,
      files: Object.keys(files).length,
    }),
  );
}
