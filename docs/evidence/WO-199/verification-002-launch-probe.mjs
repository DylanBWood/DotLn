// VER-002 independent launch-boundary variations. Only explicit transport
// doubles and the disposable source fixture; no model, forge or live store.
import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import {
  createSourceFixture,
  sourceFixtureOptions,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";
import { verticalTransport } from "../../../scripts/lib/vertical-transport.mjs";

const request = { kind: "evidence" };
function double() {
  const counts = { launches: 0, kills: 0 };
  const transport = {
    name: "fake",
    harnessVersion: "not-applicable",
    dispatch() {
      counts.launches++;
      return {
        receipt: Promise.resolve({ fixture: true }),
        completed: Promise.resolve({ fixture: true }),
        alive: () => false,
        kill() {
          counts.kills++;
        },
      };
    },
  };
  return { counts, transport };
}
const interrupted = (error) => error.code === "interrupted";

{
  const controller = new AbortController();
  controller.abort("SIGINT");
  const d = double();
  const run = verticalTransport(d.transport, undefined, {
    signal: controller.signal,
  }).dispatch(request, Date.now);
  await assert.rejects(run.completed, interrupted);
  assert.equal(d.counts.launches, 0);
  console.log(JSON.stringify({ case: "abort-before-launch", ...d.counts }));
}
{
  const controller = new AbortController();
  const d = double();
  let release, entered;
  const reached = new Promise((resolve) => (entered = resolve));
  const allowed = new Promise((resolve) => (release = resolve));
  const run = verticalTransport(
    d.transport,
    async () => {
      entered();
      return allowed;
    },
    { signal: controller.signal },
  ).dispatch(request, Date.now);
  await reached;
  controller.abort("SIGTERM");
  release(true);
  await assert.rejects(run.completed, interrupted);
  assert.equal(d.counts.launches, 0);
  console.log(
    JSON.stringify({ case: "abort-during-authority-read", ...d.counts }),
  );
}
{
  const d = double();
  const run = verticalTransport(d.transport, async () => false).dispatch(
    request,
    Date.now,
  );
  await assert.rejects(
    run.completed,
    (error) => error.code === "profile-refused",
  );
  assert.equal(d.counts.launches, 0);
  console.log(JSON.stringify({ case: "authority-refused", ...d.counts }));
}
{
  const controller = new AbortController();
  controller.abort("SIGHUP");
  const d = double();
  const run = verticalTransport(d.transport, undefined, {
    signal: controller.signal,
  }).dispatch({ kind: "source-change" }, Date.now);
  await run.completed;
  assert.deepEqual(d.counts, { launches: 1, kills: 0 });
  console.log(
    JSON.stringify({ case: "writer-abort-owned-by-source-host", ...d.counts }),
  );
}
{
  const root = createSourceFixture();
  try {
    const controller = new AbortController();
    controller.abort("SIGINT");
    await assert.rejects(
      new SourceChangeHost({
        ...sourceFixtureOptions(root, () => 10),
        signal: controller.signal,
      }).run(),
      interrupted,
    );
    const rows = decodeLog(
      readFileSync(join(root, "store/events.jsonl"), "utf8"),
    );
    assert.equal(
      rows.some((row) => row.type === "WorkerAttemptStarted"),
      false,
    );
    assert.equal(
      rows.some((row) => row.type === "SourceChangeProcessStarted"),
      false,
    );
    const resumed = await new SourceChangeHost(
      sourceFixtureOptions(root, () => 11),
    ).run();
    assert.equal(resumed.status, "observed");
    console.log(
      JSON.stringify({
        case: "source-abort-burns-no-attempt",
        attemptsBeforeRerun: 0,
        resumed: resumed.status,
      }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
{
  const root = createSourceFixture();
  try {
    let at = 10;
    await assert.rejects(
      new SourceChangeHost({
        ...sourceFixtureOptions(root, () => at),
        afterResult() {
          at = 1_000_001;
        },
      }).run(),
      (error) => error.code === "profile-refused",
    );
    const rows = decodeLog(
      readFileSync(join(root, "store/events.jsonl"), "utf8"),
    );
    const reason = rows.find((row) => row.type === "SourceChangeRefused")
      ?.payload.reason;
    assert.equal(reason, "host-admission-authority");
    assert.equal(
      rows.some((row) => row.type === "WorkerInterrupted"),
      false,
    );
    assert.equal(
      rows.some((row) => row.type === "SourceChangeObserved"),
      false,
    );
    console.log(
      JSON.stringify({ case: "post-result-authority-expired", reason }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
