import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Prepare before appending the completion event: missing release machinery must
// not produce a successful handoff with a reservation we cannot retire.
export async function executorWriterRelease(
  root,
  sessionId = process.env.CODEX_THREAD_ID,
) {
  if (!sessionId) return () => {};
  const runtime = join(root, "packages/skeleton/dist/src/harness-host.js");
  const directory = join(root, "docs/control/local/harness");
  if (!existsSync(runtime)) {
    if (
      existsSync(join(directory, "writer")) ||
      existsSync(join(directory, "writer.json"))
    )
      throw new Error(
        "Writer release runtime unavailable; completion not recorded",
      );
    return () => {};
  }
  const { releaseHarnessWriter, harnessWriterView } = await import(
    pathToFileURL(runtime).href
  );
  if (
    typeof releaseHarnessWriter !== "function" ||
    typeof harnessWriterView !== "function"
  )
    throw new Error(
      "Writer release runtime incompatible; completion not recorded",
    );
  const actorId = createHash("sha256").update(sessionId).digest("hex");
  return () => {
    releaseHarnessWriter(root, {
      cwd: root,
      session_id: sessionId,
      hook_event_name: "Stop",
    });
    const writer = harnessWriterView(root);
    if (writer.reserved && writer.actorId === actorId)
      throw new Error(
        "Completion recorded but this session's writer reservation remains; do not repeat the transition",
      );
  };
}

export async function refreshExecutorIndex(root) {
  const packagePath = join(root, "package.json");
  // Standalone lifecycle consumers need not install the repository index tool.
  if (
    !existsSync(packagePath) ||
    !JSON.parse(readFileSync(packagePath, "utf8")).scripts?.["work-orders"]
  )
    return;
  const { main } = await import(
    pathToFileURL(join(root, "scripts/work-orders.mjs")).href
  );
  main(["index"], root);
}
