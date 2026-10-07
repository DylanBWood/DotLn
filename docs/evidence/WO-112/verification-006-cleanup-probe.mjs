// VER-006: a real filesystem cleanup failure after a triage verdict is linked.
// All targets are disposable synthetic fixtures; no native model or network.
import assert from "node:assert/strict";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { basename, dirname, join } from "node:path";
import {
  verticalFixture,
  runState,
} from "../../../scripts/fixtures/vertical/fixture.mjs";
import {
  readVerticalConfiguration,
  runVerticalIssue,
} from "../../../scripts/lib/vertical-runtime.mjs";

const f = await verticalFixture({
  forge: { reviews: [{ id: "S1", text: "No additional changes requested." }] },
});
const originalLink = fs.linkSync;
let locked;
let episodes = 0;
let linkedVerdict;
try {
  fs.linkSync = (source, destination) => {
    const result = originalLink(source, destination);
    if (
      basename(destination).startsWith("triage-") &&
      destination.endsWith(".json")
    ) {
      // Keep the successful exclusive link, then deny only its sibling unlink.
      linkedVerdict = destination;
      locked = dirname(destination);
      fs.chmodSync(locked, 0o555);
    }
    return result;
  };
  syncBuiltinESMExports();
  const judge = {
    name: "fake",
    harnessVersion: "not-applicable",
    dispatch(request, now) {
      episodes++;
      return {
        receipt: Promise.resolve({
          commandId: request.command.commandId,
          transport: "fake",
          acceptedAt: now(),
        }),
        completed: Promise.resolve({
          kind: "acknowledge",
          criterionId: null,
          reason: "Synthetic review requests no action.",
          evidenceRefs: [request.subject.evidence[0].ref],
        }),
        alive: () => false,
        kill() {},
      };
    },
  };
  const run = () =>
    runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: readVerticalConfiguration(f.directory, f.launchpad),
      now: () => {
        f.tick();
        return f.now();
      },
      external: { ...f.external, judge },
    });
  const first = await run();
  assert.ok(linkedVerdict, "the verdict was durably linked before cleanup");
  fs.chmodSync(locked, 0o755);
  fs.linkSync = originalLink;
  syncBuiltinESMExports();
  const record = JSON.parse(fs.readFileSync(linkedVerdict, "utf8"));
  const partials = fs
    .readdirSync(locked)
    .filter((name) => name.endsWith(".partial"));
  const second = await run();
  const key = fs.readdirSync(join(f.directory, "vertical"))[0];
  console.log(
    JSON.stringify({
      probe: "linked-triage-verdict-cleanup",
      episodes,
      durableVerdict: record.result.kind,
      leftoverPartials: partials.length,
      firstTerminal: first.terminal,
      secondTerminal: second.terminal,
      persistedTerminal: runState(f.directory, key).terminal,
    }),
  );
} finally {
  fs.linkSync = originalLink;
  syncBuiltinESMExports();
  if (locked) fs.chmodSync(locked, 0o755);
  f.close();
}
