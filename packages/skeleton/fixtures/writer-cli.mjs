// Process double only: never invokes a vendor or authenticates.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
const [transport, behavior] = process.argv.slice(2);
const input = JSON.parse(readFileSync(0, "utf8"));
// WO-157 shapes of a committed change the host counts: a Sort move keeps the
// bytes, a file becomes a directory of files, or one more surface path.
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
const envelope = {
  workOrderId: input.workOrder.workOrderId,
  episodeId: input.episodeId,
  resultId: input.resultId,
  status: "completed",
  summary: "Synthetic source change.",
  requiresHuman: false,
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
    // WO-053: a successful display message need not itself be JSON.
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
