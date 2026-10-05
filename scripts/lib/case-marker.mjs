// Preloaded into node:test file processes by executeSuite, for the heartbeat
// alone. Reporter events leave a test process only when its event loop turns:
// node:test queues a case's start and calls the body without yielding, so a
// synchronous case ends before its start is delivered. This module appends
// each case's start and end itself, synchronously, from Node's tracing channel.
import { subscribe } from "node:diagnostics_channel";
import { openSync, writeSync } from "node:fs";
import { isMainThread } from "node:worker_threads";

const path = process.env.DOTLN_CASE_MARKERS;
// A worker thread shares its process's id and would speak for its cases.
if (path && isMainThread) {
  // Taken once, before any test runs: a test may replace or count the fs
  // functions and the clock it imports, and a marker must neither pass
  // through a replacement nor be seen by one.
  const write = writeSync;
  const now = Date.now.bind(Date);
  let descriptor;
  try {
    descriptor = openSync(path, "a");
  } catch {
    /* No markers: the heartbeat names no case here; results stand. */
  }
  if (descriptor !== undefined) {
    const ids = new WeakMap();
    let next = 0;
    const mark = (row) => {
      try {
        write(
          descriptor,
          JSON.stringify({ ...row, pid: process.pid, at: now() }) + "\n",
        );
      } catch {
        /* A lost marker leaves the heartbeat without a name; results stand. */
      }
    };
    subscribe("tracing:node.test:start", (context) => {
      // Suites and the file's root wrap cases; the case is what runs.
      if (context.type !== "test" || context.name === "<root>") return;
      ids.set(context, ++next);
      mark({ event: "start", id: next, name: context.name });
    });
    subscribe("tracing:node.test:end", (context) => {
      if (ids.has(context)) mark({ event: "end", id: ids.get(context) });
    });
  }
}
