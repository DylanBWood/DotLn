import { fileURLToPath } from "node:url";
import { streamObservation } from "../../../scripts/lib/drive-stream.mjs";
import { criterionJudgments } from "../../../scripts/lib/off-ramps.mjs";
import { gateCodeIdentity } from "../../../scripts/lib/gate-evidence.mjs";

// Synthetic inputs only. This probe reads source and prints its observations;
// it changes no implementation, launches no native host and makes no network call.
const root = fileURLToPath(new URL("../../../", import.meta.url));
const observer = streamObservation({ protocol: "codex", launchpad: root });
const rows = [
  {
    type: "item.completed",
    item: { type: "file_change", status: "synthetic/opaque?q=canary" },
  },
  {
    type: "item.completed",
    item: {
      type: "command_execution",
      command: "node scripts/release.mjs close WO-999 --publish",
      status: "declined",
      aggregated_output: "",
    },
  },
];
for (const row of rows) observer.inspect(JSON.stringify(row));
const tail = observer.observed().eventTail;

const markdown = [
  "**Criterion 1:** met.",
  "```md",
  "# Example heading",
  "```",
  "[live-drive-attempt-3.json](live-drive-attempt-3.json)",
  "",
].join("\n");
const paragraph = criterionJudgments(markdown)[0].paragraph;
const probes = [
  {
    id: "P1",
    expected: "An unknown status is omitted or mapped to an enumerated value.",
    observed: tail,
    passed: !JSON.stringify(tail).includes("synthetic/opaque?q=canary"),
  },
  {
    id: "P2",
    expected:
      "A fenced heading does not hide the real receipt after the fence.",
    observed: paragraph,
    passed: paragraph.includes("live-drive-attempt-3.json"),
  },
];
console.log(
  JSON.stringify({ codeIdentity: gateCodeIdentity(root), probes }, null, 2),
);
process.exitCode = probes.every(({ passed }) => passed) ? 0 : 1;
