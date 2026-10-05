// A source-worker process double. The first candidate can contain a review
// defect; the fresh repair actor receives only its new request and fixes it.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
const input = JSON.parse(readFileSync(0, "utf8"));
const cfg = JSON.parse(
  readFileSync(process.env.DOTLN_VERTICAL_FIXTURE, "utf8"),
);
const content =
  cfg.plantReview && !input.workOrder.workOrderId.includes("_repair_")
    ? "changed by synthetic worker\n\n"
    : "changed by synthetic worker\n";
writeFileSync("fixture.txt", content);
const git = (...args) =>
  execFileSync(
    cfg.git,
    ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
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
git("add", "-A");
git("commit", "-F", input.commitCommand.slice("git commit -F ".length));
const envelope = {
  workOrderId: input.workOrder.workOrderId,
  episodeId: input.episodeId,
  resultId: input.resultId,
  status: "completed",
  summary: "Synthetic bounded source change.",
  requiresHuman: false,
};
const events = JSON.parse(
  readFileSync(
    new URL(
      "../../../packages/skeleton/fixtures/wo051-writer-wire.json",
      import.meta.url,
    ),
    "utf8",
  ),
).codex;
for (const event of events) {
  if (event.item?.text === "<envelope>")
    event.item.text = JSON.stringify({ envelope });
  console.log(JSON.stringify(event));
}
