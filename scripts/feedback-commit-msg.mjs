#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { personalFeedback } from "../packages/skeleton/dist/src/loadouts/feedback.js";
import { feedbackBoundary } from "../packages/skeleton/dist/src/feedback-boundary.js";

// Hook adapter: install only in an explicitly selected host/fixture. Missing builds fail closed.
try {
  if (process.argv.length !== 3)
    throw new Error("commit message path required");
  feedbackBoundary(
    personalFeedback(),
    {
      kind: "attribution",
      message: readFileSync(process.argv[2], "utf8"),
    },
    () => {},
  );
} catch {
  console.error(
    "Commit refused: message check failed or contains an AI attribution footer/trailer.",
  );
  process.exitCode = 1;
}
