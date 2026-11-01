// Paired controls for WO-237. Each case runs one existing test under the
// bounded wrapper against this worktree's implementation (the positive arm),
// then again with only the listed reversion applied to the listed source (the
// negative arm). Source bytes are snapshotted first and verified restored
// afterwards; the arms run one at a time. Run from the worktree root:
//   node docs/evidence/WO-237/controls.mjs
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bounded = (...command) => [
  "node",
  "scripts/harness.mjs",
  "bounded",
  "--timeout-seconds",
  "1200",
  "--",
  ...command,
];
const temporaryRoots = (pattern) =>
  bounded(
    "node",
    "--test",
    "--test-name-pattern",
    pattern,
    "scripts/test-temporary-roots.mjs",
  );
const records = "packages/skeleton/src/temporary-root-records.mjs";
// The first failing test the runner reports, with its error lines.
const failure = (output) =>
  output.match(/✖ failing tests:\n(?:[^\n]*\n){1,4}/u)?.[0]?.trim() ?? null;
const cases = [
  {
    id: "c01-journals-move-at-close",
    criterion: 2,
    defect:
      "Release close removes the worktree without moving its session journals into the retained lane, as at the base.",
    suite: "release",
    command: bounded("bash", "scripts/test-release.sh", "--case", "success"),
    reversion: [
      {
        path: "scripts/worktree.mjs",
        old: "      removeScratch(subject, reconciliation);\n      retainJournals(mainPath, subject, workOrderId);\n",
        new: "      removeScratch(subject, reconciliation);\n",
      },
    ],
    observe: (output) =>
      output.match(/^journal lane after close: .*$/mu)?.[0] ?? null,
  },
  {
    id: "c02-renumbered-device-judged-by-class",
    criterion: 8,
    defect:
      "The owner record's device number is compared strictly, so a root renumbered by a reboot is retained, as at the base.",
    suite: "harness-fixtures",
    command: temporaryRoots("a renumbered device is re-stamped"),
    reversion: [
      {
        path: records,
        old: "    !Number.isInteger(record.device) ||\n    info.ino !== record.inode\n",
        new: "    info.dev !== record.device ||\n    info.ino !== record.inode\n",
      },
    ],
    observe: (output) =>
      output.match(
        /Temporary owner record is invalid or the directory was replaced/u,
      )?.[0] ??
      output.match(/renumbered judgment with re-stamp [\d.]+ ms/u)?.[0] ??
      null,
  },
  {
    id: "c03-changed-inode-still-refused",
    criterion: 8,
    defect:
      "The identity check drops the inode, so a replaced directory carrying a copied marker is re-stamped and pruned after a device change.",
    suite: "harness-fixtures",
    command: temporaryRoots("a renumbered device never admits"),
    reversion: [
      {
        path: records,
        old: "    !Number.isInteger(record.device) ||\n    info.ino !== record.inode\n  )",
        new: "    !Number.isInteger(record.device)\n  )",
      },
      {
        path: records,
        old: '  if (info.ino !== record.inode)\n    throw new Error("Temporary directory identity changed");\n',
        new: "",
      },
    ],
    observe: failure,
  },
  {
    id: "c04-order-lane-waits-for-its-journals",
    criterion: 3,
    defect:
      "The prune removes an order's whole retained lane once its release is published, taking a journal lane inside it before that lane's window.",
    suite: "harness-fixtures",
    command: temporaryRoots("class window and keeps its parent lane"),
    reversion: [
      {
        path: "scripts/lib/harness-prune.mjs",
        old: "  if (owned)\n",
        new: "  if (owned && false)\n",
      },
    ],
    observe: failure,
  },
  {
    id: "c05-refused-removal-deletes-nothing",
    criterion: 8,
    defect:
      "The removal deletes by path, as at the base: nothing binds the deletion to the directory whose identity was checked, and a parent that refuses the removal refuses it only after the root's contents and owner record are gone.",
    suite: "harness-fixtures",
    command: temporaryRoots(
      "apply names what it removed when it stops partway",
    ),
    reversion: [
      {
        path: records,
        old: '  const registered = aside === path ? (registeredPathOf(record) ?? path) : path;\n  if (aside !== path) {\n    ledger(record, registered, "moving", { aside });\n    renameSync(path, aside);\n  } else accessSync(dirname(path), constants.W_OK | constants.X_OK);\n',
        new: "  const registered = path;\n",
      },
      {
        path: records,
        old: "  const aside = temporaryRemovalAside(path, record.token);\n  // A root finished from its aside",
        new: "  const aside = path;\n  // A root finished from its aside",
      },
    ],
    observe: failure,
  },
  {
    id: "c06-retried-merge-reads-its-merge-records",
    criterion: 3,
    defect:
      "A retried merge consults no record of what this worktree's earlier attempt appended, so a source whose removal failed after its rows were appended appends them again.",
    suite: "harness-fixtures",
    command: temporaryRoots("a retried merge counts a log once"),
    reversion: [
      {
        path: "scripts/lib/worktree-removal.mjs",
        old: "        const through = mergedThrough(log, current, incoming);\n",
        new: "        const through = 0;\n",
      },
    ],
    observe: failure,
  },
];

const run = (command, observe) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  return {
    exitCode: result.status,
    logSha256: sha256(output),
    startedAt,
    finishedAt: new Date().toISOString(),
    observation: observe(output),
  };
};

const results = [];
for (const control of cases) {
  const originals = new Map(
    [...new Set(control.reversion.map((row) => row.path))].map((path) => [
      path,
      readFileSync(join(root, path), "utf8"),
    ]),
  );
  const positive = run(control.command, control.observe);
  const mutated = new Map(originals);
  for (const row of control.reversion) {
    const text = mutated.get(row.path);
    if (text.split(row.old).length !== 2)
      throw new Error(
        `${control.id}: reversion anchor is not unique in ${row.path}`,
      );
    mutated.set(row.path, text.replace(row.old, row.new));
  }
  let negative;
  try {
    for (const [path, text] of mutated) writeFileSync(join(root, path), text);
    negative = run(control.command, control.observe);
  } finally {
    for (const [path, text] of originals) writeFileSync(join(root, path), text);
  }
  for (const [path, text] of originals)
    if (sha256(readFileSync(join(root, path))) !== sha256(text))
      throw new Error(`${control.id}: ${path} was not restored`);
  const { observe, ...recorded } = control;
  results.push({
    ...recorded,
    mutatedFiles: [...originals].map(([path, text]) => ({
      path,
      before: sha256(text),
      after: sha256(mutated.get(path)),
    })),
    positive,
    negative,
    demonstrated: positive.exitCode === 0 && negative.exitCode !== 0,
  });
  console.log(
    JSON.stringify({
      id: control.id,
      positive: positive.exitCode,
      negative: negative.exitCode,
      observation: negative.observation,
    }),
  );
}
writeFileSync(
  join(root, "docs/evidence/WO-237/controls.json"),
  JSON.stringify(
    {
      schemaVersion: 1,
      workOrder: "WO-237",
      baselineCommit: "9139d91eb0b2b5cdcb683f750e48684b43fb95b6",
      method:
        "Each case runs under node scripts/harness.mjs bounded against this worktree's current implementation (the positive arm), then again with only the listed reversion applied to the listed source (the negative arm); the source bytes are snapshotted before and verified restored after, and the arms run serially. A demonstrated control is positive exit 0 and negative exit nonzero; the recorded observation is the line each arm printed about the lane after the close (c01), the strict comparison's refusal or the measured re-stamp (c02), or the negative arm's first failure (c03 to c06).",
      recordedAt: new Date().toISOString(),
      results,
    },
    null,
    2,
  ) + "\n",
);
