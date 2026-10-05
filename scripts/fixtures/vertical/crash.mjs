import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { join } from "node:path";
import { VerticalHost } from "../../../packages/skeleton/dist/src/vertical-host.js";

const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
if (input.kill === "receipt-projection") {
  const write = fs.writeFileSync;
  fs.writeFileSync = (file, ...args) => {
    if (
      String(file).includes("/receipts/") &&
      String(file).endsWith(".json.tmp")
    )
      process.kill(process.pid, "SIGKILL");
    return write(file, ...args);
  };
  syncBuiltinESMExports();
}
const record = (command) =>
  fs.appendFileSync(
    join(input.directory, "effects.jsonl"),
    JSON.stringify({ commandId: command.commandId, step: command.step }) + "\n",
  );
const result = await new VerticalHost({
  directory: input.directory,
  binding: input.binding,
  now: () => input.at,
  ports: {
    materialize: async (binding) => ({
      workOrder: { ...binding.workOrder, workOrderId: "WO-901" },
      workOrderPath: "fixture",
    }),
    execute: async (command) => {
      record(command);
      return {
        result: "completed",
        value:
          command.step === "baseline"
            ? { storyClass: "defect", outcome: "reproduced" }
            : {},
      };
    },
  },
  afterStep(receipt) {
    if (receipt.command.step === input.kill)
      process.kill(process.pid, "SIGKILL");
  },
}).run();
fs.writeFileSync(join(input.directory, "result.json"), JSON.stringify(result));
