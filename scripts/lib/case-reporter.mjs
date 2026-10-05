// Both events are execution ordered. Declaration-ordered pass/fail events can
// remain buffered after a concurrent case has finished. TAP stays separate.
import { relative } from "node:path";

export default async function* caseReporter(source) {
  for await (const event of source) {
    const data = event.data;
    if (!data?.file) continue;
    const file = relative(process.cwd(), data.file);
    if (data.name === data.file || data.name === file) continue;
    if (!["test:dequeue", "test:complete"].includes(event.type)) continue;
    const durationMs = data.details?.duration_ms;
    yield `PROGRESS CASE ${JSON.stringify({
      event: event.type === "test:dequeue" ? "start" : "end",
      file,
      name: data.name,
      nesting: data.nesting,
      entryFile: data.entryFile
        ? relative(process.cwd(), data.entryFile)
        : file,
      testId: data.testId,
      ...(event.type === "test:dequeue"
        ? {}
        : {
            durationMs,
            exitCode: data.details?.passed ? 0 : 1,
            ...(data.skip || data.todo ? { skipped: true } : {}),
          }),
    })}\n`;
  }
}
