// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:f7e29ff3f4ede75c"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/05243f7f3687b59a/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("PostToolUse", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
