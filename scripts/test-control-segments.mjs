import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  foldSegments,
  foldWorkOrders,
  LEGACY_CONTROL_PATH,
  orderSegmentPath,
  parseControlEvents,
} from "./lib/control.mjs";
import {
  addedSegmentEvents,
  controlFromSources,
  readControl,
} from "./lib/control-store.mjs";
import { statusProjection } from "./resume.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const root = process.argv[2];
assert.ok(root && isAbsolute(root) && realpathSync(root) === root);
assert.ok(existsSync(join(root, ".dotln-test-root-owner")));
const repo = join(root, "control-segments");
mkdirSync(join(repo, "scripts"), { recursive: true });
cpSync(join(scriptRoot, "resume.mjs"), join(repo, "scripts/resume.mjs"));
cpSync(join(scriptRoot, "lib"), join(repo, "scripts/lib"), { recursive: true });
const write = (path, bytes) => {
  mkdirSync(dirname(join(repo, path)), { recursive: true });
  writeFileSync(join(repo, path), bytes);
};
const lines = (events) => events.map(JSON.stringify).join("\n") + "\n";
const activation = (id) => ({
  schemaVersion: 1,
  type: "WorkOrderActivated",
  workOrderId: id,
  workOrderPath: `docs/work-orders/${id}-fixture.md`,
});
const actorArgs = [
  "--harness",
  "human",
  "--harness-version",
  "not-applicable",
  "--model",
  "human",
  "--effort",
  "unknown",
  "--source",
  "operator-attested",
];
const run = (args, env = process.env) =>
  spawnSync(process.execPath, [join(repo, "scripts/resume.mjs"), ...args], {
    encoding: "utf8",
    env,
  });
const pass = (args) => {
  const result = run(args);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
for (const id of ["WO-900", "WO-901", "WO-902"])
  write(
    `docs/work-orders/${id}-fixture.md`,
    `# ${id} — fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n`,
  );

const interleaved = [
  activation("WO-901"),
  activation("WO-902"),
  { type: "ImplementationReady", workOrderId: "WO-901" },
];
const folded = foldWorkOrders(interleaved);
assert.equal(folded.orders.get("WO-901").state.phase, "ready-to-verify");
assert.equal(folded.orders.get("WO-902").state.phase, "active");
console.log(
  "PASS synthetic interleaving: WO-901 ready-to-verify; WO-902 active",
);

write(LEGACY_CONTROL_PATH, lines([activation("WO-900")]));
pass(["activate", "WO-901", "docs/work-orders/WO-901-fixture.md"]);
const newBefore = readFileSync(join(repo, orderSegmentPath("WO-901")));
pass(["implementation-ready", "--work-order", "WO-900", ...actorArgs]);
assert.deepEqual(
  readFileSync(join(repo, orderSegmentPath("WO-901"))),
  newBefore,
);
assert.equal(
  parseControlEvents(readFileSync(join(repo, LEGACY_CONTROL_PATH), "utf8"))
    .length,
  2,
);
assert.equal(existsSync(join(repo, orderSegmentPath("WO-900"))), false);
assert.equal(
  JSON.parse(pass(["status", "--json", "--work-order", "WO-900"])).phase,
  "ready-to-verify",
);
assert.equal(
  JSON.parse(pass(["status", "--json", "--work-order", "WO-901"])).phase,
  "active",
);
const seen = new Map();
for (const [path, events] of readControl(repo).eventSegments)
  for (const event of events) {
    assert.ok(
      !seen.has(event.workOrderId) || seen.get(event.workOrderId) === path,
    );
    seen.set(event.workOrderId, path);
  }
console.log(
  "PASS activation owns storage: legacy appends remain legacy; new orders never span segments",
);

const original = readFileSync(join(repo, orderSegmentPath("WO-901")), "utf8");
const mutations = [
  [
    lines([activation("WO-902")]),
    /WO-901.jsonl: foreign workOrderId at ordinal 1/,
  ],
  [
    original + lines([{ type: "ImplementationReady", workOrderId: "WO-902" }]),
    /WO-901.jsonl: foreign workOrderId at ordinal 2/,
  ],
  [
    lines([{ type: "ImplementationReady", workOrderId: "WO-901" }]),
    /WO-901.jsonl: expected activation at ordinal 1/,
  ],
  ["", /WO-901.jsonl: missing activation at ordinal 1/],
];
const actions = [
  ["status"],
  ["status", "--json"],
  ["next"],
  ["times"],
  ["activate", "WO-902", "docs/work-orders/WO-902-fixture.md"],
  ["implementation-ready", ...actorArgs],
  ["verify"],
  ["verification-result", "pass", ...actorArgs],
  ["fix"],
  ["repair-complete", ...actorArgs],
  ["final-review"],
  ["final-review-result", "pass", ...actorArgs],
  ["release-close"],
];
for (const [bytes, expected] of mutations) {
  write(orderSegmentPath("WO-901"), bytes);
  const before = [
    readFileSync(join(repo, LEGACY_CONTROL_PATH)),
    readFileSync(join(repo, "docs/control/current.md")),
  ];
  for (const args of actions) {
    const result = run(args);
    assert.equal(result.status, 1, args.join(" "));
    assert.match(result.stderr, expected);
    assert.equal(result.stdout, "");
    assert.equal(
      readFileSync(join(repo, orderSegmentPath("WO-901")), "utf8"),
      bytes,
    );
    assert.deepEqual(
      [
        readFileSync(join(repo, LEGACY_CONTROL_PATH)),
        readFileSync(join(repo, "docs/control/current.md")),
      ],
      before,
    );
    assert.equal(existsSync(join(repo, orderSegmentPath("WO-902"))), false);
  }
}
write(orderSegmentPath("WO-901"), original);
assert.throws(
  () =>
    foldSegments(
      [activation("WO-901")],
      new Map([[orderSegmentPath("WO-901"), [activation("WO-901")]]]),
    ),
  /already belongs to docs\/control\/resume.jsonl at ordinal 1/,
);
assert.throws(
  () =>
    foldSegments(
      [],
      new Map([["docs/control/orders/wrong.jsonl", [activation("WO-901")]]]),
    ),
  /invalid control segment name/,
);
console.log(
  `PASS corrupt segments: path and ordinal reported; all ${actions.length} commands preserve every control byte`,
);

const before = readControl(repo);
const extended = new Map(before.sources);
extended.set(
  orderSegmentPath("WO-901"),
  original + lines([{ type: "ImplementationReady", workOrderId: "WO-901" }]),
);
extended.set(orderSegmentPath("WO-902"), lines([activation("WO-902")]));
assert.deepEqual(
  addedSegmentEvents(
    before,
    controlFromSources(extended),
    "fixture revisions",
  ).map((event) => event.workOrderId),
  ["WO-901", "WO-902"],
);
for (const path of before.sources.keys()) {
  const removed = new Map(extended);
  removed.delete(path);
  assert.throws(
    () =>
      addedSegmentEvents(
        before,
        controlFromSources(removed),
        "fixture revisions",
      ),
    /not append-only/,
  );
  const rewritten = new Map(extended);
  rewritten.set(
    path,
    rewritten.get(path).replace('"schemaVersion":1', '"schemaVersion": 1'),
  );
  assert.throws(
    () =>
      addedSegmentEvents(
        before,
        controlFromSources(rewritten),
        "fixture revisions",
      ),
    /not append-only/,
  );
}
console.log(
  "PASS per-segment byte-prefix proof: sibling additions pass; deletions and equivalent-JSON rewrites refuse",
);

const legacyBeforeReactivation = readFileSync(join(repo, LEGACY_CONTROL_PATH));
pass(["implementation-ready", "--work-order", "WO-901", ...actorArgs]);
pass(["verify", "--work-order", "WO-901"]);
const human = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
write(
  "docs/verifications/WO-901/VER-001.md",
  `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(human)}\n`,
);
pass(["verification-result", "pass", "--work-order", "WO-901", ...actorArgs]);
pass(["final-review", "--work-order", "WO-901"]);
write(
  "docs/final-reviews/WO-901/FINAL-001.md",
  `# Final fixture\n\n**Actor attestation:** ${JSON.stringify(human)}\n`,
);
pass(["final-review-result", "pass", "--work-order", "WO-901", ...actorArgs]);
assert.match(
  pass(["next", "--work-order", "WO-901"]),
  /Other in-flight orders: WO-900/,
);
const closedBytes = readFileSync(
  join(repo, orderSegmentPath("WO-901")),
  "utf8",
);
pass(["activate", "WO-901", "docs/work-orders/WO-901-fixture.md"]);
assert.ok(
  readFileSync(join(repo, orderSegmentPath("WO-901")), "utf8").startsWith(
    closedBytes,
  ),
);
assert.deepEqual(
  readFileSync(join(repo, LEGACY_CONTROL_PATH)),
  legacyBeforeReactivation,
);
const activeBytes = readFileSync(join(repo, orderSegmentPath("WO-901")));
assert.equal(
  run(["activate", "WO-901", "docs/work-orders/WO-901-fixture.md"]).status,
  1,
);
assert.deepEqual(
  readFileSync(join(repo, orderSegmentPath("WO-901"))),
  activeBytes,
);
console.log(
  "PASS named-order reactivation retains its segment while a sibling is open; active reactivation refuses",
);

// The expected JSON was captured with v0.6.0's fold, including WO-030's
// activation before this code changed. Hash the immutable input prefix too.
const evidence = join(scriptRoot, "../docs/evidence/WO-030");
const expected = JSON.parse(
  readFileSync(join(evidence, "legacy-fold.json"), "utf8"),
);
const source =
  readFileSync(join(scriptRoot, "..", LEGACY_CONTROL_PATH), "utf8")
    .split("\n")
    .slice(0, expected.eventCount)
    .join("\n") + "\n";
assert.equal(
  createHash("sha256").update(source).digest("hex"),
  expected.sourceSha256,
);
const legacy = parseControlEvents(source);
const result = foldSegments(legacy);
assert.deepEqual(
  JSON.parse(JSON.stringify([...result.orders])),
  expected.orders,
);
assert.deepEqual(JSON.parse(JSON.stringify(result.legacy)), expected.current);
console.log(
  `PASS legacy comparison: ${expected.eventCount} events, unchanged bytes and v0.6.0 per-order states`,
);

// Portable reproduction of the captured local-ref observation: the Git stub
// serves only the named refs, matching their recorded SHA and observed seconds.
// The actual local refs were read and compared byte-for-byte during execution.
const observation = readFileSync(join(evidence, "legacy-times.json"), "utf8");
const observed = JSON.parse(observation);
const refs = {};
for (const row of observed.events) {
  if (row.source !== "recovered-from-local-checkpoint-ref") continue;
  const event = legacy[row.ordinal - 1];
  refs[event.checkpointRef] =
    `${event.checkpointRef} commit ${event.checkpointSha} ${Date.parse(row.time) / 1000}`;
}
const timesRepo = join(root, "legacy-times");
mkdirSync(join(timesRepo, "scripts"), { recursive: true });
cpSync(join(repo, "scripts"), join(timesRepo, "scripts"), { recursive: true });
mkdirSync(join(timesRepo, "docs/control"), { recursive: true });
writeFileSync(join(timesRepo, LEGACY_CONTROL_PATH), source);
const bin = join(timesRepo, "bin");
mkdirSync(bin);
writeFileSync(
  join(bin, "git"),
  `#!${process.execPath}\nconst refs = ${JSON.stringify(refs)};\nconst args = process.argv.slice(2);\nif (args[2] !== "for-each-ref" || !refs[args.at(-1)]) process.exit(77);\nprocess.stdout.write(refs[args.at(-1)] + "\\n");\n`,
  { mode: 0o755 },
);
const timed = spawnSync(
  process.execPath,
  [join(timesRepo, "scripts/resume.mjs"), "times"],
  { encoding: "utf8", env: { ...process.env, PATH: bin } },
);
assert.equal(timed.status, 0, timed.stderr);
assert.equal(timed.stdout, observation);
assert.equal(
  statusProjection(legacy, "WO-030").orders.length,
  result.orders.size,
);
console.log(
  `PASS legacy times: byte-identical observation, ${observed.localRefsRead} named local refs, original global ordinals and source labels`,
);
