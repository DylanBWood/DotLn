import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { runScenario } from "../dist/src/index.js";

const [mode, scenarioFile, directory, recoverFrom] = process.argv.slice(2);
const input =
  mode === "hold"
    ? {
        schemaVersion: 1,
        scenarioId: "interrupted",
        criteria: [
          {
            criterionId: "visual",
            claimType: "visual",
            checkId: "hold",
            codeSurfaces: ["packages/browser-evidence/fixtures/index.html"],
          },
        ],
        steps: [
          { action: "navigate", path: "/" },
          { action: "assertText", selector: "#result", value: "Ready" },
          { action: "wait", milliseconds: 30000 },
        ],
      }
    : scenarioFile;
const result = await runScenario(input, {
  directory,
  subjectRevision: "synthetic-candidate",
  ...(recoverFrom ? { recoverFrom } : {}),
});
writeFileSync(
  join(directory, "environment.json"),
  JSON.stringify({
    removedVariables: [
      "CODEX_CI",
      "CODEX_SESSION_ID",
      "CODEX_THREAD_ID",
      "CODEX_VERSION",
    ],
    present: [
      "CODEX_CI",
      "CODEX_SESSION_ID",
      "CODEX_THREAD_ID",
      "CODEX_VERSION",
    ].filter((name) => process.env[name] !== undefined),
  }),
);
process.stdout.write(
  JSON.stringify({
    availability: result.availability,
    reason: result.reason,
    remainingPids: result.remainingPids,
  }),
);
