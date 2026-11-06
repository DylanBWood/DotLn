// Reuse the verifier's immutable input bytes and expectations with explicit format
// declarations for mixed reports. The activation-base comparison still uses
// its original no-flag invocation; code-span and whole-return controls also
// keep their no-flag calls. No fixture input or expected finding is rewritten.
// Absolute imports become file URLs because the adapted source is a data URL.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const formats = {
  "plain JSON": "prose",
  "VER-001 schemaVersion example": "prose",
  "VER-001 findings example": "prose",
  "valid example in middle": "prose",
  "valid example at end": "prose",
  "unfenced malformed claim": "json",
  "current genuine result with trailing prose": "json",
};
const sourcePath = "docs/evidence/WO-255/verifier-002/probes.mjs";
let source = readFileSync(sourcePath, "utf8");
const replaceOnce = (before, after) => {
  assert.equal(
    source.split(before).length,
    2,
    `one adaptation site: ${before}`,
  );
  source = source.replace(before, after);
};
replaceOnce(
  "const root = process.cwd();",
  `const root = process.cwd();\nconst repairFormats = ${JSON.stringify(formats)};`,
);
replaceOnce(
  '["--kind", "consistency", "--from", fromFile(text)],',
  '["--kind", "consistency", "--from", fromFile(text), ...(repairFormats[name] ? ["--format", repairFormats[name]] : [])],',
);
replaceOnce(
  "checks: observations.length,",
  `inputModes: repairFormats, originalProbe: ${JSON.stringify(sourcePath)}, checks: observations.length,`,
);
for (const module of ["temporary-roots", "review-worker", "checkpoint"])
  replaceOnce(
    `import(root + "/scripts/lib/${module}.mjs")`,
    `import(pathToFileURL(root + "/scripts/lib/${module}.mjs").href)`,
  );
await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
