// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:55b87ceca766bc72"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/92688e9c9da7528e/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("Stop", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
