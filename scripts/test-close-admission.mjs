// Judge the printers' actual output under one controlled set of admission
// facts. Only synthetic repositories created by the shell fixtures use this.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  evaluateHarnessHook,
  HARNESS_HOST_VERSION,
} from "../packages/skeleton/dist/src/harness-host.js";
import { feedbackBoundary } from "../packages/skeleton/dist/src/feedback-boundary.js";
import { fnv1a64 } from "../packages/compiler/dist/src/index.js";
import { harnessInstallation } from "./lib/harness.mjs";
import { releaseCloseCommand } from "./lib/git.mjs";
const [mainArg, order, outputFile, recordFile] = process.argv.slice(2);
const main = resolve(mainArg);
const bundle = harnessInstallation().bundles.find(
  (row) => row.manifest.profile.harness === "claude-code",
);
const hook = bundle.files.find(
  (row) => row.path === ".claude/hooks/permissions.mjs",
);
const config = JSON.parse(
  hook.contents.match(
    /await runHarnessHook\(([\s\S]*), feedbackBoundary(?:, input(?:, rawInput(?:, control)?)?)?\);/,
  )[1],
);
const session = "fixture-printer-admission";
const directory = join(main, "docs/control/local/harness");
mkdirSync(directory, { recursive: true });
writeFileSync(
  join(directory, createHash("sha256").update(session).digest("hex") + ".json"),
  JSON.stringify({
    reads: [],
    startingEventCount: 0,
    releaseCloseDispatch: {
      workOrder: order,
      recordedAt: new Date().toISOString(),
    },
  }),
);
const printed = readFileSync(outputFile, "utf8");
const helper = releaseCloseCommand(main, order);
assert.ok(
  printed.includes(helper),
  "actual printer output lacks the shared helper",
);
const commands = [helper];
if (recordFile) {
  const record = JSON.parse(readFileSync(recordFile, "utf8"));
  for (const row of record.blockers) {
    commands.push(row.command);
    if (row.disposableCommand) commands.push(row.disposableCommand);
  }
}
const resumeFile = join(main, "scripts/resume.mjs");
const original = readFileSync(resumeFile);
// This models the same closed/legal canonical fact for every printer. The
// stale-runtime test separately executes the real dispatch through its hook.
const status = `console.log(${JSON.stringify(JSON.stringify({ workOrder: order, phase: "closed", legalNextActions: ["release-close"] }))});\n`;
writeFileSync(resumeFile, status);
config.runtime = {
  skeletonVersion: HARNESS_HOST_VERSION,
  boundaryContract: "feedback-v1",
  files: [{ path: "scripts/resume.mjs", hash: `fnv1a64:${fnv1a64(status)}` }],
};
try {
  for (const command of new Set(commands)) {
    const admitted = await evaluateHarnessHook(
      config,
      {
        cwd: main,
        session_id: session,
        hook_event_name: "PreToolUse",
        tool_name: "Bash",
        tool_input: { command },
      },
      main,
      feedbackBoundary,
    );
    assert.equal(
      admitted.hookSpecificOutput?.permissionDecision,
      "allow",
      command,
    );
  }
} finally {
  writeFileSync(resumeFile, original);
}
console.log(
  `WO-195 admitted ${new Set(commands).size} actual printer commands`,
);
