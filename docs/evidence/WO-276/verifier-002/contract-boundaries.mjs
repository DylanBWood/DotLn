import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { markdownCodeBlocks } from "../../../../scripts/lib/markdown-links.mjs";
import { readWorkOrder } from "../../../../scripts/lib/work-order-document.mjs";
import { screenSource } from "../../../../scripts/lib/markdown-screen.mjs";
import { inspectLedger, statuses } from "../../../../scripts/lineage.mjs";
import { parseLocalTerms } from "../../../../scripts/lib/terms.mjs";
import { harnessInstallation } from "../../../../scripts/lib/harness.mjs";
import { validateNamedWorkers } from "../../../../packages/skeleton/src/worker-catalog.mjs";

const fences = ["\n", "\r\n", "\r"].map((newline) => ({
  newline: JSON.stringify(newline),
  blocks: markdownCodeBlocks(["```json", '{"x":1}', "```"].join(newline)).map(
    ({ closed, value, line, endLine }) => ({ closed, value, line, endLine }),
  ),
}));
assert.equal(fences[0].blocks[0].closed, true);
assert.equal(fences[1].blocks[0].closed, true);
const ledger = `# Ledger\n\nStatuses: ${statuses.map((s) => "`" + s + "`").join(" / ")}\n\n## 2026-09-19 — Example\n\n- **An idea** \`adopted\` \`recovered\`\n  - Evidence.\n\n\`\`\`json\n{}\n\`\`\`\n`;
const ledgerReadings = ["\n", "\r\n", "\r"].map((newline) => ({
  newline: JSON.stringify(newline),
  errors: inspectLedger(ledger.replaceAll("\n", newline)).errors,
}));
assert.deepEqual(ledgerReadings[0].errors, []);
const separatorSource =
  'const note = "a\u2028b"; export const f = line => line.startsWith("```");\n';
const separatorFinding = screenSource("scripts/example.mjs", separatorSource);
const order =
  "# WO-999 — Example\n\n**Repository:** original\n**Model:** any\n\n> **Repository:** quoted\n\n- **Repository:** listed\n\n**Objective:** Test metadata.\n\n**Repository:** body\n";
const header = readWorkOrder(order).header.map(({ label, value }) => ({
  label,
  value,
}));
assert.equal(header.find((x) => x.label === "Repository").value, "original");
const modes = [
  ...parseLocalTerms(
    "unmarked\nrefuse: # section\nFirst Entry\ncontext:\nfirst-entry\nreview: Second Entry\ncontext: Third Entry\n",
  ),
].map(([key, value]) => ({ key, mode: value.mode }));
assert.equal(modes.find((x) => x.key === "firstentry").mode, "refuse");
assert.equal(modes.find((x) => x.key === "secondentry").mode, "context");
const installed = harnessInstallation({
  workers: {
    named: validateNamedWorkers({
      verifier: { claude: { model: "opus", effort: "max" } },
    }),
  },
  features: { "host-codex": false, "host-copilot": false },
});
const definition = installed.files.find(
  (f) => f.path === ".claude/agents/dotln-verifier.md",
).contents;
const guidance = installed.files.find(
  (f) => f.path === ".claude/skills/dotln-verifier/SKILL.md",
).contents;
assert.match(definition, /effort: max/u);
assert.match(guidance, /Independent verifiers use `xhigh`, not `max`/u);
writeFileSync(
  process.argv[2],
  JSON.stringify(
    {
      fences,
      ledgerReadings,
      separatorFinding,
      header,
      modes,
      configuredVerifier: {
        effort: "max",
        emittedEffortMax: true,
        guidanceForbidsMax: true,
      },
    },
    null,
    2,
  ) + "\n",
);
