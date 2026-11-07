// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/c86d0b7f67ba009c/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("PostToolUse", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
