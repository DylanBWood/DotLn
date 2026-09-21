// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:950a384c819aa265"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/54df1c3acb4f0314/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("Stop", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
