import {
  mkdirSync,
  writeFileSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { recordOperatorMessage } = await import(
  `${repo}/packages/skeleton/dist/src/harness-host.js`
);
const root = join(process.argv[2], "notice-root");
rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });
const transcript = join(root, "t.jsonl");
const notice =
  "<task-notification><task-id>t1</task-id><status>completed</status><summary>s</summary></task-notification>";
writeFileSync(transcript, JSON.stringify({ sessionId: "s", cwd: root }) + "\n");
recordOperatorMessage(
  root,
  {
    hook_event_name: "UserPromptSubmit",
    cwd: root,
    session_id: "s",
    prompt: notice,
    transcript_path: transcript,
  },
  "claude-prompt-hook",
);
writeFileSync(
  transcript,
  JSON.stringify({
    type: "attachment",
    attachment: {
      type: "queued_command",
      prompt: notice,
      commandMode: "task-notification",
    },
  }) + "\n",
);
recordOperatorMessage(
  root,
  {
    hook_event_name: "UserPromptSubmit",
    cwd: root,
    session_id: "s",
    prompt: notice,
    transcript_path: transcript,
  },
  "claude-prompt-hook",
);
const dir = join(root, "docs/control/local/harness");
for (const name of readdirSync(dir).filter((n) => n.endsWith(".jsonl")))
  for (const line of readFileSync(join(dir, name), "utf8").trim().split("\n")) {
    const row = JSON.parse(line);
    if (row.typedEvent === "OperatorMessageObserved")
      console.log(
        JSON.stringify({
          source: row.source,
          attribution: row.attribution,
          routeSource: row.routeSource,
        }),
      );
  }
rmSync(root, { recursive: true, force: true });
