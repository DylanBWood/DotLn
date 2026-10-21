// VER-001 F1 probe. Run from the repository root under the bounded wrapper:
//   node docs/evidence/WO-217/verification-001/sync-stale-probe.mjs <disposable-root>
// Makes line 3 of the root's docs/siblings/README.md stale, prints the
// siblings check's output, the root's own classifier and its syncArtifacts
// rows for that one artifact, then restores the README's bytes. Run it on a
// disposable copy of the subject and on one of main; never on a live checkout.
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(process.argv[2] ?? "");
const { generatedArtifacts, checkArtifact } = await import(
  join(root, "scripts/lib/generated-artifacts.mjs")
);
const { syncArtifacts } = await import(join(root, "scripts/sync.mjs"));
const row = generatedArtifacts(root).find((entry) => entry.name === "siblings");
const file = join(root, "docs/siblings/README.md");
const original = readFileSync(file);
const lines = original.toString("utf8").split("\n");
lines[2] = `${lines[2]} (probe)`;
writeFileSync(file, lines.join("\n"));
try {
  const check = spawnSync(
    process.execPath,
    ["scripts/siblings.mjs", "index", "--check"],
    { cwd: root, encoding: "utf8" },
  );
  console.log(
    "check exit",
    check.status,
    "|",
    `${check.stdout}${check.stderr}`.trim(),
  );
  const checked = checkArtifact(row, root);
  console.log(
    "checkArtifact exitCode",
    checked.exitCode,
    "stale",
    checked.stale,
  );
  const result = await syncArtifacts(root, { artifacts: [row] });
  for (const entry of result.rows)
    console.log(
      "sync row",
      entry.artifact,
      entry.before,
      "->",
      entry.after,
      entry.action,
      (entry.reason ?? "").split("\n")[0],
    );
  console.log(
    "README back to its original bytes:",
    Buffer.compare(readFileSync(file), original) === 0,
  );
} finally {
  writeFileSync(file, original);
}
