// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:950a384c819aa265"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/0860cf5ecf83b26b/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("PostToolUse", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
