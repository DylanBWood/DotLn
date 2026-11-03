import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import {
  moveIndex,
  referencePath,
} from "../../../../scripts/lib/document-moves.mjs";

const root = process.cwd();
const index = moveIndex(root);
const rows = [
  {
    from: "docs/planning/passes/document-contract-and-release-close-2026-10-28.md",
    reference: "sequence.md",
  },
  {
    from: "docs/product/07-execution-guide.md",
    reference: "../planning/critical-path-2026-09-08.md",
  },
  {
    from: "docs/product/07-execution-guide.md",
    reference: "../planning/vision-into-use-2026-09-17.md",
  },
].map(({ from, reference }) => {
  assert.ok(readFileSync(join(root, from), "utf8").includes(`](${reference})`));
  const physical = posix.normalize(posix.join(posix.dirname(from), reference));
  const mapped = referencePath(index, from, reference);
  assert.equal(existsSync(join(root, physical)), false);
  assert.equal(existsSync(join(root, mapped)), true);
  return {
    from,
    reference,
    physical,
    physicalExists: false,
    mapped,
    mappedExists: true,
  };
});
console.log(
  JSON.stringify({ observedAt: new Date().toISOString(), rows }, null, 2),
);
