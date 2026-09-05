// Synthetic vendor process. Deterministic tests never authenticate or call a model.
import { readFileSync } from "node:fs";
const [transport, behavior, ...args] = process.argv.slice(2);
const input = JSON.parse(readFileSync(0, "utf8"));
if (behavior === "wait")
  await new Promise((resolve) => setTimeout(resolve, 60_000));
if (behavior === "unavailable") {
  console.error("requested model unavailable; SYNTHETIC_PRIVATE_DIAGNOSTIC");
  process.exit(2);
}
const result = {
  envelope: {
    workOrderId: input.workOrder.workOrderId,
    episodeId: input.episodeId,
    resultId: input.resultId,
    status: "completed",
    summary: "One bounded inspection completed.",
    requiresHuman: false,
  },
  candidates: input.inventory.files
    .filter(
      (file) =>
        file.classification === "generated-stale" &&
        file.referencedBy.length === 0,
    )
    .map((file) => ({
      path: file.path,
      classification: file.classification,
      evidence: [
        `inventory:${file.path}`,
        `classification:${file.classification}`,
        "references:none",
      ],
    })),
  beaconClaim: "inspection-completed",
};
if (behavior === "wrong-id") result.envelope.episodeId = "another_episode";
if (behavior === "blocked") result.envelope.status = "blocked";
if (behavior === "malformed") {
  console.log("not-json");
  process.exit(0);
}
if (transport === "claude-cli-print")
  console.log(
    JSON.stringify({
      type: "result",
      subtype: "success",
      structured_output: result,
      privateTranscript: "SYNTHETIC_PRIVATE_TRANSCRIPT",
    }),
  );
else {
  console.log(
    JSON.stringify({
      type: "thread.started",
      thread_id: "synthetic-transport-id",
    }),
  );
  console.log(
    JSON.stringify({
      type: "item.completed",
      item: { type: "agent_message", text: JSON.stringify(result) },
    }),
  );
  console.log(JSON.stringify({ type: "turn.completed" }));
}
if (behavior === "nonzero") process.exitCode = 7;
if (args.includes("--fallback-model"))
  throw new Error("fixture observed forbidden fallback");
