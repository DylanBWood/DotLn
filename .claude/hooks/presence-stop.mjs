// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:c0a496bda5f362de"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/dab02a2ce5e2279e/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("Stop", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
