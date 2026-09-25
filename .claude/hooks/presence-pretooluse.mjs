// Origin: {"ids":[],"loadoutId":"contributor","semanticHash":"fnv1a64:3fda088a97df0f55"}
try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import("../../.runtime/harness/556ae6585327b3cb/packages/skeleton/dist/src/presence-heartbeat.js");
await recordHarnessHeartbeat("PreToolUse", input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\n"); }
process.stdout.write("{}");
