// VER-001 F1 probe. Feeds real checker messages to a root's checkArtifact
// through its injectable runner; nothing runs and nothing is written.
//   node docs/evidence/WO-217/verification-001/stale-classification-probe.mjs <root>
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const { generatedArtifacts, checkArtifact } = await import(
  join(root, "scripts/lib/generated-artifacts.mjs")
);
const rows = Object.fromEntries(
  generatedArtifacts(root).map((row) => [row.name, row]),
);
// Each message is the checker's own wording: scripts/siblings.mjs lines 290
// to 297 (COMMAND, line 49), scripts/work-orders.mjs lines 752 and 789,
// scripts/lib/meta.mjs line 467, scripts/lineage.mjs line 238 and
// scripts/lib/harness.mjs line 911.
const cases = [
  [
    "siblings",
    "error: docs/siblings/README.md is stale at line 3; run node scripts/siblings.mjs index",
  ],
  [
    "siblings",
    "error: docs/siblings/README.md: the DotLn-Enterprise-Starter entry records manifest hash `aaaa`, and its latest receipt docs/evidence/siblings/DotLn-Enterprise-Starter/x.json records `bbbb`; run node scripts/siblings.mjs index",
  ],
  [
    "index",
    "error: docs/work-orders/README.md is stale at line 9; run npm run work-orders -- index",
  ],
  [
    "index",
    "error: docs/work-orders/HISTORY.md: missing or malformed tag snapshot; run npm run work-orders -- index",
  ],
  ["meta", "Decisions index is stale; run npm run meta"],
  [
    "lineage",
    "Stale docs/lineage/decisions-index.md; run node scripts/lineage.mjs index",
  ],
  ["harness", "harness drift: missing .claude/hooks/session.mjs"],
];
for (const [name, output] of cases) {
  const result = checkArtifact(rows[name], root, () => ({
    exitCode: 1,
    durationMs: 1,
    output,
  }));
  console.log(
    name.padEnd(9),
    "stale:",
    String(result.stale).padEnd(5),
    "|",
    output,
  );
}
