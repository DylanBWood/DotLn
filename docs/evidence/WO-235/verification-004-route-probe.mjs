import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";
import {
  harnessStateDirectory,
  recordOperatorMessage,
} from "../../../packages/skeleton/dist/src/harness-host.js";

// Replay an idle operator paste that was delivered before an identical host
// notice. A completed delivery must retire its operator observation before
// that observation can account for another queue entry.
const root = createFixtureRoot(join(tmpdir(), "dotln-ver004-route-"));
const session = "verification-synthetic-session";
const transcript = join(root, "transcript.jsonl");
const prompt =
  "<task-notification><task-id>synthetic-task</task-id><status>completed</status><summary>synthetic complete</summary></task-notification>";
const journal = join(
  harnessStateDirectory(root),
  createHash("sha256").update(session).digest("hex") + ".jsonl",
);
const observe = () => {
  recordOperatorMessage(root, {
    hook_event_name: "UserPromptSubmit",
    cwd: root,
    session_id: session,
    prompt,
    transcript_path: transcript,
  });
  return JSON.parse(readFileSync(journal, "utf8").trim().split("\n").at(-1));
};

try {
  writeFileSync(transcript, "");
  const first = observe();
  const time = Date.parse(first.recordedAt);
  const host = { sessionId: session, version: "2.1.312" };
  writeFileSync(
    transcript,
    [
      {
        type: "user",
        message: { role: "user", content: prompt },
        timestamp: new Date(time + 1).toISOString(),
        ...host,
      },
      {
        type: "queue-operation",
        operation: "enqueue",
        content: prompt,
        timestamp: new Date(time + 2).toISOString(),
        ...host,
      },
    ]
      .map((row) => JSON.stringify(row))
      .join("\n") + "\n",
  );
  const second = observe();
  const expected = "host-task-notification";
  console.log(
    JSON.stringify({
      case: "delivered operator paste before identical host notification",
      expected,
      source: second.source,
      attribution: second.attribution,
      routeSource: second.routeSource,
    }),
  );
  if (second.source !== expected) process.exitCode = 1;
} finally {
  removeTemporaryPath(root, { recursive: true, force: true });
}
