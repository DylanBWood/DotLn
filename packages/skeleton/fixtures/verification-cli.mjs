// A subprocess double for the two existing CLI wire protocols. No model/network.
import { readFileSync } from "node:fs";
import { fixtureVerificationResult } from "../dist/src/verification-fake.js";
const [transport, behavior] = process.argv.slice(2);
const input = JSON.parse(readFileSync(0, "utf8"));
if (behavior === "unavailable") {
  process.stderr.write("required model unavailable\n");
  process.exit(1);
}
if (behavior === "wait")
  await new Promise((resolve) => setTimeout(resolve, 30_000));
const value = fixtureVerificationResult(
  input.capsule,
  input.episodeId,
  input.resultId,
);
if (behavior === "forge-pass" && value.kind === "verification") {
  value.evaluations = value.evaluations.map((item) => ({
    ...item,
    verdict: "pass",
  }));
  value.findings = [];
}
if (behavior === "incomplete") value.envelope.status = "blocked";
if (transport === "claude-cli-print")
  process.stdout.write(
    JSON.stringify({
      type: "result",
      subtype: "success",
      structured_output: value,
    }),
  );
else
  process.stdout.write(
    JSON.stringify({
      type: "item.completed",
      item: { type: "agent_message", text: JSON.stringify(value) },
    }) +
      "\n" +
      JSON.stringify({ type: "turn.completed" }) +
      "\n",
  );
