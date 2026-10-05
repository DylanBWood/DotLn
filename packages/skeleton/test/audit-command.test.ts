import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { decodeLog, encodeLog, type Event } from "@dotln/kernel";
import { renderAuditProjections } from "../src/audit.js";
import { runScenario, type FixtureTree } from "../src/scenario.js";

const cliPath = fileURLToPath(new URL("../src/cli.js", import.meta.url));
const dotlnPath = fileURLToPath(new URL("../src/dotln.js", import.meta.url));
const fixture = JSON.parse(
  await readFile(
    fileURLToPath(new URL("../../fixtures/repo-tree.json", import.meta.url)),
    "utf8",
  ),
) as FixtureTree;

const fixtureLog = runScenario(fixture).log;
const lastAt = Math.max(
  ...decodeLog(fixtureLog).map((event) => event.occurredAt),
);
/** The fixture log's single episode and workstream, then one event in a second
 * episode of that workstream and one in a second workstream. */
const mixedLog =
  fixtureLog +
  encodeLog([
    {
      schemaVersion: 1,
      eventId: "evt_29",
      type: "WorkOrderEmitted",
      occurredAt: lastAt + 1,
      actorId: "repo-gardener",
      workstreamId: "ws_repo_garden",
      episodeId: "ep_seiri_2",
      payload: { workOrder: { workOrderId: "wo_second_episode" } },
    },
    {
      schemaVersion: 1,
      eventId: "evt_30",
      type: "WorkOrderEmitted",
      occurredAt: lastAt + 2,
      actorId: "repo-gardener",
      workstreamId: "ws_second",
      payload: { workOrder: { workOrderId: "wo_second_workstream" } },
    },
  ] satisfies Event[]);
const usage =
  "usage: dotln audit --store <directory> [--workstream <id> | --episode <id>]\n";

const audit = (...args: readonly string[]) =>
  spawnSync(process.execPath, [dotlnPath, "audit", ...args], {
    encoding: "utf8",
  });
/** The projections the skeleton's `--audit` renders for the fixture log: the
 * lines from `L0 RECEIPT` to the blank line before the final receipt. */
const skeletonAudit = () => {
  const result = spawnSync(process.execPath, [cliPath, "--audit"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const start = result.stdout.indexOf("\nL0 RECEIPT\n") + 1;
  const end = result.stdout.lastIndexOf("\n\nverified=") + 1;
  assert.ok(start > 0 && end > start, "the --audit section is present");
  return result.stdout.slice(start, end);
};
const storeWith = (label: string, log?: string) => {
  const directory = mkdtempSync(join(tmpdir(), `dotln-wo116-${label}-`));
  if (log !== undefined) writeFileSync(join(directory, "events.jsonl"), log);
  return directory;
};
const listing = (directory: string) =>
  readdirSync(directory)
    .sort()
    .map((name) => [name, readFileSync(join(directory, name), "utf8")]);

test("WO-116 the terminal audit command prints the skeleton --audit projections byte for byte over the fixture log, with their fidelity labels, in every scope", (t) => {
  const store = storeWith("fixture", fixtureLog);
  t.after(() => rmSync(store, { recursive: true, force: true }));
  const rendered = skeletonAudit();
  assert.equal(rendered, renderAuditProjections(decodeLog(fixtureLog)) + "\n");
  // The fixture log is one episode of one workstream, so the fold selects the
  // same events, and the same scope, for all three selections.
  for (const selection of [
    [],
    ["--workstream", "ws_repo_garden"],
    ["--episode", "ep_seiri_1"],
  ]) {
    const result = audit("--store", store, ...selection);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    assert.equal(result.stdout, rendered, selection.join(" "));
  }
  assert.deepEqual(
    [
      ...rendered.matchAll(
        /^(L0 RECEIPT|CAUSAL TIMELINE|GOVERNED RAW JSON)$|^ {2}"fidelity": "(L[0-9])",$/gmu,
      ),
    ].map((match) => match[1] ?? match[2]),
    ["L0 RECEIPT", "L0", "CAUSAL TIMELINE", "L1", "GOVERNED RAW JSON", "L4"],
  );
  // The causal links the fold recognized: explicit event links and causation.
  assert.match(rendered, /"association": "explicit-event-link"/u);
  assert.match(rendered, /"causationId": "evt_14"/u);
  assert.deepEqual(listing(store), [["events.jsonl", fixtureLog]]);
});

test("WO-116 each audit scope selects what the fold scopes for it; an empty store, an absent selection and an invalid source refuse by name without writing", (t) => {
  const mixed = storeWith("mixed", mixedLog);
  const empty = storeWith("empty");
  const blank = storeWith("blank", "");
  const invalid = storeWith(
    "invalid",
    encodeLog([
      {
        schemaVersion: 1,
        eventId: "evt_1",
        type: "WorkOrderEmitted",
        occurredAt: 0,
        actorId: "repo-gardener",
        workstreamId: "ws_invalid",
        payload: { workOrder: {} },
      },
    ]),
  );
  const parent = storeWith("parent");
  const missing = join(parent, "no-store");
  t.after(() => {
    for (const directory of [mixed, empty, blank, invalid, parent])
      rmSync(directory, { recursive: true, force: true });
  });
  const events = decodeLog(mixedLog);
  const rendered = skeletonAudit();
  for (const [selection, scope, selected] of [
    [[], "log:mixed", events],
    [
      ["--workstream", "ws_repo_garden"],
      "ws:ws_repo_garden",
      events.filter((event) => event.workstreamId === "ws_repo_garden"),
    ],
    [
      ["--workstream", "ws_second"],
      "ws:ws_second",
      events.filter((event) => event.workstreamId === "ws_second"),
    ],
    [
      ["--episode", "ep_seiri_1"],
      "ep:ep_seiri_1",
      events.filter((event) => event.episodeId === "ep_seiri_1"),
    ],
    [
      ["--episode", "ep_seiri_2"],
      "ep:ep_seiri_2",
      events.filter((event) => event.episodeId === "ep_seiri_2"),
    ],
  ] as const) {
    const result = audit("--store", mixed, ...selection);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    assert.equal(
      result.stdout,
      renderAuditProjections(selected) + "\n",
      selection.join(" "),
    );
    for (const projection of ["l0-receipt", "causal-timeline"])
      assert.ok(
        result.stdout.includes(
          `"projectionRef": "audit-projection:${scope}:${projection}"`,
        ),
        `${selection.join(" ")}: ${scope}`,
      );
  }
  // The fixture log's own episode, selected from the larger log, is the
  // skeleton's --audit render of that log.
  assert.equal(
    audit("--store", mixed, "--episode", "ep_seiri_1").stdout,
    rendered,
  );

  for (const [args, stderr] of [
    [["--store", empty], `audit: store ${empty} holds no events\n`],
    [["--store", blank], `audit: store ${blank} holds no events\n`],
    [["--store", missing], `audit: store ${missing} holds no events\n`],
    [
      ["--store", mixed, "--episode", "ep_absent"],
      `audit: episode ep_absent is not in store ${mixed}\n`,
    ],
    [
      ["--store", mixed, "--workstream", "ws_absent"],
      `audit: workstream ws_absent is not in store ${mixed}\n`,
    ],
    [
      ["--store", invalid],
      "invalid audit source evt_1 WorkOrderEmitted: missing workOrder.workOrderId\n",
    ],
    [
      [
        "--store",
        mixed,
        "--workstream",
        "ws_second",
        "--episode",
        "ep_seiri_2",
      ],
      usage,
    ],
    [["--store", mixed, "--json"], usage],
    [["--store", mixed, "--work-order", "WO-116"], usage],
  ] as const) {
    const result = audit(...args);
    assert.equal(result.status, 1, args.join(" "));
    assert.equal(result.stdout, "", args.join(" "));
    assert.equal(result.stderr, stderr, args.join(" "));
  }
  assert.equal(existsSync(missing), false);
  assert.deepEqual(listing(mixed), [["events.jsonl", mixedLog]]);
  assert.deepEqual(listing(empty), []);
  assert.deepEqual(listing(blank), [["events.jsonl", ""]]);
});

test("WO-116 the dotln usage and command list name audit beside every other command, handoff included", () => {
  const bare = spawnSync(process.execPath, [dotlnPath], { encoding: "utf8" });
  assert.equal(bare.status, 1);
  assert.equal(bare.stdout, "");
  for (const grammar of [
    "dotln audit --store <directory> [--workstream <id> | --episode <id>]",
    "dotln vertical <issue> --store <directory>",
    "dotln handoff answer --store <directory> --episode <id> --work-order <id> --option <id>",
  ])
    assert.ok(
      bare.stderr.startsWith("usage: ") && bare.stderr.includes(grammar),
      grammar,
    );
  const unknown = spawnSync(
    process.execPath,
    [dotlnPath, "unknown", "--store", tmpdir()],
    { encoding: "utf8" },
  );
  assert.equal(unknown.status, 1);
  assert.equal(
    unknown.stderr,
    "expected intent, vertical, resident, presence, handoff, status, audit, demo, verify-demo or feedback-audit\n",
  );
});
