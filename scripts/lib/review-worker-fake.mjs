// The change review's fixture double. DOTLN_WORKER_FIXTURE names a JSON file
// holding the canned return; the literal `none` makes the worker end without
// a report, as a worker that stops before its final message does. The double
// renders the real prompt and validates the canned return with the real
// result validator, so a fixture exercises the protocol a live worker meets.
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const skeleton = (name) =>
  import(`../../packages/skeleton/dist/src/${name}.js`);

/** @param {string} fixture @param {{command: {commandId: string}}} expected */
export async function fakeReviewTransport(fixture, expected) {
  const { transportPrompt, parseTransportResult } = await skeleton(
    "verification-protocol",
  );
  const { WorkerFailure } = await skeleton("worker-protocol");
  return {
    name: "fake",
    harnessVersion: "fixture-v1",
    dispatch(request, now) {
      transportPrompt(request);
      // A fixture may name a checkout file the worker changes during its
      // episode, so the helper's content witness can be shown to see it.
      const touch = process.env.DOTLN_WORKER_FIXTURE_TOUCH;
      if (touch) appendFileSync(join(request.cwd, touch), "touched\n");
      const completed =
        fixture === "none"
          ? Promise.reject(
              new WorkerFailure("invalid-result", "final-message-absent"),
            )
          : Promise.resolve().then(() =>
              parseTransportResult(
                JSON.parse(readFileSync(fixture, "utf8")),
                request,
              ),
            );
      void completed.catch(() => {});
      return {
        receipt: Promise.resolve({
          commandId: expected.command.commandId,
          transport: "fake",
          acceptedAt: now(),
        }),
        completed,
        alive: () => false,
        kill: () => {},
      };
    },
  };
}
