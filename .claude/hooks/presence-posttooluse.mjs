// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:55b87ceca766bc72"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/c444b85b0d135f9a/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("PostToolUse", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
