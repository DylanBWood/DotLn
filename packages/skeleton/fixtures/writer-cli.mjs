// Process double only: never invokes a vendor or authenticates.
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
const [transport, behavior] = process.argv.slice(2);
const input = JSON.parse(readFileSync(0, "utf8"));
// Shapes of a committed change the host counts (WO-157): a Sort move keeps
// the bytes, a file becomes a directory of files, or one more surface path.
if (behavior === "commit-move") {
  mkdirSync("sorted");
  execFileSync("git", ["mv", "fixture.txt", "sorted/fixture.txt"], {
    stdio: "pipe",
  });
} else {
  writeFileSync("fixture.txt", "changed by synthetic worker\n");
  execFileSync(process.execPath, ["fixture-test.mjs"], { stdio: "pipe" });
}
if (behavior === "commit-directory") {
  rmSync("fixture.txt");
  mkdirSync("fixture.txt");
  for (const name of ["a.txt", "b.txt"])
    writeFileSync(`fixture.txt/${name}`, `${name} inside the surface\n`);
}
if (behavior === "commit-wide")
  writeFileSync("fixture-extra.txt", "one more surface path\n");
if (behavior === "commit" || behavior.startsWith("commit-")) {
  execFileSync("git", ["add", "-A"], { stdio: "pipe" });
  execFileSync(
    "git",
    [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-F",
      input.commitCommand.slice("git commit -F ".length),
    ],
    {
      stdio: "pipe",
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Fixture",
        GIT_AUTHOR_EMAIL: "fixture@example.invalid",
        GIT_COMMITTER_NAME: "Fixture",
        GIT_COMMITTER_EMAIL: "fixture@example.invalid",
      },
    },
  );
}
// The hostile process exercises its own authority after producing a candidate.
// A refused deletion must fail the episode, not become a successful envelope.
if (process.env.DOTLN_FIXTURE_DELETE_OBJECT) {
  const victim = process.env.DOTLN_FIXTURE_DELETE_OBJECT;
  process.stderr.write(
    "synthetic writer reached shared-object deletion after commit\n",
  );
  if (transport === "claude") {
    const response = JSON.parse(
      execFileSync(process.execPath, [".claude/hooks/permissions.mjs"], {
        encoding: "utf8",
        input: JSON.stringify({
          hook_event_name: "PreToolUse",
          cwd: process.cwd(),
          session_id: input.episodeId,
          tool_name: "Write",
          tool_input: { file_path: victim, content: "corrupted" },
        }),
      }),
    );
    if (response.hookSpecificOutput?.permissionDecision === "deny")
      throw new Error("shared object write refused by the writer bundle");
  }
  unlinkSync(victim);
}
const envelope = {
  workOrderId: input.workOrder.workOrderId,
  episodeId: input.episodeId,
  resultId: input.resultId,
  status: "completed",
  summary: "Synthetic source change.",
  requiresHuman: false,
  ...({
    "commit-blocked": { status: "blocked", requiresHuman: true },
    "commit-attention": { status: "completed", requiresHuman: true },
    "commit-failed": { status: "failed", requiresHuman: false },
    blocked: { status: "blocked", requiresHuman: true },
  }[behavior] ?? {}),
};
if (behavior === "spoof")
  envelope.observedCommit = { sha: "0".repeat(40), branch: "spoof" };
if (behavior === "wrong-id") envelope.episodeId = "wrong_episode";
const tape = JSON.parse(
  readFileSync(new URL("./wo051-writer-wire.json", import.meta.url), "utf8"),
);
const events = tape[transport];
for (const event of events) {
  if (event.result === "<envelope>") {
    // A successful display message need not itself be JSON (WO-053).
    event.result = "The synthetic change is complete.";
    event.structured_output = { envelope };
    if (behavior === "missing-structured") {
      event.result = JSON.stringify({ envelope });
      delete event.structured_output;
    }
    if (behavior === "invalid-structured") event.structured_output = "invalid";
  }
  if (event.item?.text === "<envelope>")
    event.item.text = JSON.stringify({ envelope });
  if (behavior === "missing-denials" && event.type === "result")
    delete event.permission_denials;
  if (behavior === "zero-denials" && event.type === "result")
    event.permission_denials = [];
  if (behavior === "failed-wire" && event.type === "result")
    event.is_error = true;
  if (behavior === "failed-wire" && event.type === "turn.completed")
    event.type = "turn.failed";
  if (transport !== "claude" || event.type === "result")
    console.log(JSON.stringify(event));
}
if (behavior === "nonzero") process.exitCode = 7;
