// VER-001 probe preload: the order's own CLI actor doubles, plus a delayed
// non-writer judgment. No model runs. Optionally drops dotln vertical's new
// signal listeners to reproduce HEAD's signal disposition (HEAD installed none).
import "../../../scripts/fixtures/vertical/interrupt-preload.mjs";
import { appendFileSync } from "node:fs";
import { CodexCliExecWorkOrderTransport } from "../../../packages/skeleton/dist/src/worker-transport.js";

const proto = CodexCliExecWorkOrderTransport.prototype;
const patched = proto.dispatch;
const marker = process.env.PROBE_JUDGMENT_MARKER;
const delay = Number(process.env.PROBE_JUDGMENT_DELAY_MS ?? 0);
proto.dispatch = function (request, now, options) {
  const run = patched.call(this, request, now, options);
  if (request.kind === "source-change" || !marker || !delay) return run;
  appendFileSync(marker, `${Date.now()} judgment-dispatched\n`);
  return {
    ...run,
    completed: run.completed.then(
      (value) => new Promise((done) => setTimeout(() => done(value), delay)),
    ),
  };
};
if (process.env.PROBE_DROP_SIGNAL_LISTENERS === "1") {
  const on = process.on.bind(process);
  process.on = (event, listener) =>
    ["SIGINT", "SIGTERM", "SIGHUP"].includes(event)
      ? process
      : on(event, listener);
}
