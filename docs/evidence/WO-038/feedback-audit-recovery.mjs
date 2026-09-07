// WO-038 evidence recovery: disclose the parser's existing summary bound to
// the live verifier. --summary-pointer also narrows the non-evidentiary summary
// field to a short pointer. The capsule, verdict/findings schema, launch limits,
// returned result bytes, and host admission checks remain unchanged.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runFeedbackSelfhost } from "../../../packages/skeleton/dist/src/feedback-selfhost.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";

if (
  process.env.DOTLN_LIVE_WORKERS !== "1" ||
  ![3, 4].includes(process.argv.length) ||
  (process.argv.length === 4 && process.argv[3] !== "--summary-pointer")
)
  throw new Error(
    "usage: DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-038/feedback-audit-recovery.mjs <store> [--summary-pointer] (live verifier; ten-minute/$3 attempt cap)",
  );

const runner = (launch) => {
  const input = JSON.parse(launch.input);
  if (input.capsule?.role !== "verifier")
    throw new Error("recovery is limited to the read-only verifier");
  const args = [...launch.args];
  let reminder =
    " The host requires envelope.summary to be a non-empty single line of at most 320 characters, with no control characters or Unicode line/paragraph separators. Apply this formatting constraint without changing your assessment.";
  if (process.argv[3] === "--summary-pointer") {
    const schemaIndex = args.indexOf("--json-schema");
    if (schemaIndex < 0) throw new Error("expected Claude structured output");
    const schema = JSON.parse(args[schemaIndex + 1]);
    const pointer = "See criterion evaluations and findings.";
    schema.properties.envelope.properties.summary = {
      type: "string",
      enum: [pointer],
    };
    args[schemaIndex + 1] = JSON.stringify(schema);
    reminder =
      ` Use the exact envelope summary '${pointer}'. ` +
      "Your assessment belongs in the existing status, evaluations, and findings fields; their requirements are unchanged.";
  }
  const running = runWorkerProcess({
    ...launch,
    args,
    input: JSON.stringify({
      ...input,
      outputInstructions: input.outputInstructions + reminder,
    }),
  });
  return {
    ...running,
    completed: running.completed.then((output) => {
      // Never retain or print raw harness output or the summary text.
      try {
        const envelope = JSON.parse(output.stdout).structured_output?.envelope;
        console.log(
          JSON.stringify({
            diagnostic: "episode-envelope-format",
            workOrderMatches:
              envelope?.workOrderId === input.capsule.workOrder.workOrderId,
            episodeMatches: envelope?.episodeId === input.episodeId,
            resultMatches: envelope?.resultId === input.resultId,
            summaryCharacters:
              typeof envelope?.summary === "string"
                ? envelope.summary.length
                : null,
            summaryIsSingleLine:
              typeof envelope?.summary === "string" &&
              !/[\u0000-\u001f\u007f\u2028\u2029]/u.test(envelope.summary),
          }),
        );
      } catch {
        console.log(JSON.stringify({ diagnostic: "wire-json-unavailable" }));
      }
      return output;
    }),
  };
};

const transport = new ClaudeCliPrintWorkOrderTransport(runner);
const result = await runFeedbackSelfhost({
  root: fileURLToPath(new URL("../../../", import.meta.url)),
  directory: resolve(process.argv[2]),
  transport,
  model: "claude-sonnet-5",
  effort: "max",
});
console.log(
  JSON.stringify({
    workOrderId: result.workOrder.workOrderId,
    phase: result.matrix.phase,
    fixtures: result.report.fixtures.length,
    savedInstructionBytes: result.report.context.savedBytes,
    verifier: transport.name,
  }),
);
if (!result.complete) process.exitCode = 1;
