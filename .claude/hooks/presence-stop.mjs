// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:c0a496bda5f362de"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/f1d23b083e021b53/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("Stop", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
