import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const repo = realpathSync(process.cwd());
assert.equal(
  execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: repo,
    encoding: "utf8",
  }).trim(),
  repo,
);
const load = (file) => import(pathToFileURL(join(repo, file)).href);
const temporary = await load("scripts/lib/temporary-roots.mjs");
const { retainWorktreeJournals, journalLane } = await load(
  "scripts/lib/worktree-removal.mjs",
);
const { judgeTemporaryRoot, applyTemporaryCandidate } = await load(
  "scripts/lib/temporary-prune.mjs",
);
const { operationalFailures, fitStartBlock } = await load(
  "scripts/lib/plan-failures.mjs",
);
const { readRetainedSession } = await load("scripts/lib/retained-session.mjs");
const { readBudgets } = await load("scripts/lib/process-budget.mjs");
const container = temporary.createFixtureRoot(
  join(tmpdir(), "dotln-wo237-verifier-"),
);
const results = [];
const key = (s) => createHash("sha256").update(s).digest("hex");
const put = (file, bytes) => {
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, bytes);
};
const json = (file, value) => put(file, JSON.stringify(value) + "\n");
const fakeRepo = (name) => {
  const root = join(container, name);
  mkdirSync(root, { recursive: true });
  assert.equal(realpathSync(root), root);
  execFileSync("git", ["-c", "init.templateDir=", "init", "-q", "-b", "main"], {
    cwd: root,
  });
  assert.equal(
    execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd: root,
      encoding: "utf8",
    }).trim(),
    root,
  );
  put(
    join(root, ".git/info/exclude"),
    "docs/control/local/\n.dotln-owner.json\n",
  );
  return root;
};
const probe = (name, criterion, run) => {
  try {
    results.push({ name, criterion, passed: true, observed: run() });
  } catch (e) {
    results.push({
      name,
      criterion,
      passed: false,
      error: String(e.stack ?? e)
        .replaceAll(container, "<fixture>")
        .replaceAll(repo, "<repo>"),
    });
  }
};
const harness = (tree) => join(tree, "docs/control/local/harness");
const read = (file) => readFileSync(file, "utf8");
const context = {
  processes: [],
  worktrees: [],
  holders: [],
  currentKey: null,
  gateLive: false,
  openPaths: [],
};
const stateKey = "a".repeat(64);

try {
  probe(
    "retention seeds, older budgets default, and explicit policies",
    1,
    () => {
      assert.equal(temporary.DEFAULT_RETENTION["closed-journal"], 720);
      for (const file of [
        "docs/control/budgets.json",
        "scripts/kit/budgets.template.json",
      ])
        assert.equal(
          JSON.parse(read(join(repo, file))).retention["closed-journal"],
          720,
        );
      assert.equal(readBudgets(repo).retention["closed-journal"], 720);
      assert.equal(temporary.validateRetention({})["closed-journal"], 720);
      assert.equal(
        temporary.validateRetention({ "closed-journal": null })[
          "closed-journal"
        ],
        null,
      );
      assert.equal(
        temporary.validateRetention({ "closed-journal": 0 })["closed-journal"],
        0,
      );
      assert.throws(() =>
        temporary.validateRetention({ "closed-journal": -1 }),
      );
      return {
        defaultHours: 720,
        nullKeeps: true,
        zeroAccepted: true,
        invalidRejected: true,
      };
    },
  );

  probe(
    "partial permission failure preserves every source byte and retry completes",
    [2, 3],
    () => {
      const main = fakeRepo("partial-main"),
        source = fakeRepo("partial-source");
      const entries = new Map([
        [`${stateKey}.jsonl`, '{"n":1}\n'],
        [`${stateKey}.json`, '{"role":"executor"}\n'],
        [`${stateKey}.subagents.json`, '{"count":0}\n'],
        ["checks.json", '[{"n":1}]\n'],
        ["suite-success/case", "pass\n"],
        ["deadlines/gate/active.json", "{}\n"],
      ]);
      for (const [name, bytes] of entries)
        put(join(harness(source), name), bytes);
      put(join(harness(source), "runner/output.log"), "capture remains\n");
      const lane = join(main, journalLane(main, "WO-971"));
      const preview = retainWorktreeJournals(main, source, "WO-971", {
        dryRun: true,
      });
      assert.equal(preview.files, entries.size);
      assert.equal(existsSync(lane), false);
      let calls = 0;
      assert.throws(
        () =>
          retainWorktreeJournals(main, source, "WO-971", {
            rename: (from, to) => {
              if (++calls === 3)
                throw Object.assign(new Error("synthetic permission denial"), {
                  code: "EACCES",
                });
              renameSync(from, to);
            },
          }),
        /EACCES/,
      );
      for (const [name, bytes] of entries) {
        const locations = [
          join(harness(source), name),
          join(lane, name),
        ].filter(existsSync);
        assert.ok(locations.length >= 1, name);
        for (const file of locations) assert.equal(read(file), bytes);
      }
      const remaining = retainWorktreeJournals(main, source, "WO-971");
      for (const [name, bytes] of entries) {
        assert.equal(read(join(lane, name)), bytes);
        assert.equal(existsSync(join(harness(source), name)), false);
      }
      assert.equal(
        read(join(harness(source), "runner/output.log")),
        "capture remains\n",
      );
      assert.equal(
        retainWorktreeJournals(main, source, "WO-971").outcome,
        "nothing",
      );
      return {
        files: entries.size,
        failedAfterMoves: 2,
        retryFiles: remaining.files,
        capturePreserved: true,
        emptyRetry: "nothing",
      };
    },
  );

  probe(
    "cross-volume copy failure is recoverable after earlier files moved",
    2,
    () => {
      const main = fakeRepo("copy-main"),
        source = fakeRepo("copy-source");
      const entries = new Map([
        [`${stateKey}.json`, "{}\n"],
        [`${stateKey}.jsonl`, '{"n":2}\n'],
        ["checks.json", "[]\n"],
      ]);
      for (const [name, bytes] of entries)
        put(join(harness(source), name), bytes);
      let copies = 0;
      const rename = () => {
        throw Object.assign(new Error("synthetic cross-device"), {
          code: "EXDEV",
        });
      };
      assert.throws(
        () =>
          retainWorktreeJournals(main, source, "WO-972", {
            rename,
            copyFile: (from, to) => {
              if (++copies === 2)
                throw Object.assign(new Error("synthetic full disk"), {
                  code: "ENOSPC",
                });
              writeFileSync(to, readFileSync(from), { flag: "wx" });
            },
          }),
        /ENOSPC/,
      );
      const lane = join(main, journalLane(main, "WO-972"));
      for (const [name, bytes] of entries) {
        const locations = [
          join(harness(source), name),
          join(lane, name),
        ].filter(existsSync);
        assert.ok(locations.length >= 1);
        for (const file of locations) assert.equal(read(file), bytes);
      }
      const retried = retainWorktreeJournals(main, source, "WO-972", {
        rename,
      });
      for (const [name, bytes] of entries)
        assert.equal(read(join(lane, name)), bytes);
      assert.equal(
        readdirSync(lane).some((n) => n.includes(".partial-")),
        false,
      );
      return {
        failedCopy: 2,
        retryFiles: retried.files,
        allBytesPreserved: true,
        noPartial: true,
      };
    },
  );

  probe(
    "Unicode and repeated log rows survive a failed unlink and interleaved source",
    3,
    () => {
      const main = fakeRepo("merge-main"),
        source = fakeRepo("merge-source"),
        sibling = fakeRepo("merge-sibling");
      const log = `${stateKey}.jsonl`,
        from = join(harness(source), log),
        lane = join(main, journalLane(main, "WO-973"));
      put(from, "base\n");
      retainWorktreeJournals(main, source, "WO-973");
      put(from, "😀\nrepeat\nrepeat");
      chmodSync(harness(source), 0o500);
      try {
        assert.throws(
          () => retainWorktreeJournals(main, source, "WO-973"),
          /EACCES|EPERM/,
        );
      } finally {
        chmodSync(harness(source), 0o700);
      }
      put(join(harness(sibling), log), "other\n");
      retainWorktreeJournals(main, sibling, "WO-973");
      appendFileSync(from, "\ntail\n");
      retainWorktreeJournals(main, source, "WO-973");
      const lines = read(join(lane, log)).split("\n").filter(Boolean);
      assert.deepEqual(lines, [
        "base",
        "😀",
        "repeat",
        "repeat",
        "other",
        "tail",
      ]);
      assert.equal(retainWorktreeJournals(main, source, "WO-973").files, 0);
      return {
        rows: lines,
        duplicatesAdded: 0,
        sourceRemoved: !existsSync(from),
      };
    },
  );

  probe(
    "class window and zero/null policies retain or remove only their fixture lanes",
    3,
    () => {
      const main = fakeRepo("window-main");
      const outcomes = {};
      for (const [name, hours, age, expected] of [
        ["expired", 1, 2, true],
        ["young", 1, 0, false],
        ["null", null, 1000, false],
        ["zero", 0, 0, true],
      ]) {
        const lane = temporary.ensureTemporaryRoot(join(main, name), {
          class: "closed-journal",
          repository: main,
          retentionHours: hours,
          owner: {
            pid: 2147483647,
            birth: "dead",
            gateId: undefined,
            suite: undefined,
            session: undefined,
            workOrder: "WO-974",
          },
        });
        const record = temporary.readTemporaryOwner(lane);
        delete record.fixtureOwner;
        record.createdAt = new Date(
          Date.parse("2031-01-01T00:00:00Z") - age * 3600000,
        ).toISOString();
        temporary.writeTemporaryOwner(lane, record);
        const judgment = judgeTemporaryRoot(
          main,
          lane,
          { now: Date.parse("2031-01-01T00:00:00Z") },
          context,
        );
        assert.equal(
          Boolean(judgment.candidate),
          expected,
          JSON.stringify(judgment),
        );
        if (judgment.candidate) {
          assert.equal(judgment.candidate.class, "closed-journal");
          applyTemporaryCandidate(main, judgment.candidate);
          assert.equal(existsSync(lane), false);
        } else assert.equal(existsSync(lane), true);
        outcomes[name] = expected ? "removed" : judgment.retained.reason;
      }
      return outcomes;
    },
  );

  probe(
    "retained denials obey the time window and lane attribution and sanitize private input",
    4,
    () => {
      const main = fakeRepo("feed-main");
      const lane = join(main, "docs/control/local/retained/WO-975/harness");
      const denial = (at) =>
        JSON.stringify({
          typedEvent: "HostPermissionDenied",
          workOrder: "WO-899",
          phase: "implementation",
          recordedAt: at,
          prompt: "synthetic private content",
        }) + "\n";
      put(
        join(lane, `${stateKey}.jsonl`),
        denial("2030-01-01T00:00:00Z") +
          denial("2031-01-01T00:00:00Z") +
          "broken line\n",
      );
      const view = operationalFailures(
        main,
        { orders: new Map(), eventSegments: new Map() },
        (row) => row.recordedAt >= "2031",
      );
      assert.equal(view.localHostDenials.count, 1);
      assert.deepEqual(view.localHostDenials.byOrder, { "WO-975": 1 });
      assert.equal(view.retainedJournals.files, 1);
      assert.equal(view.retainedJournals.unreadable, 1);
      assert.doesNotMatch(
        JSON.stringify(view),
        /synthetic private content|WO-899|dotln-wo237-verifier-/,
      );
      return {
        denials: 1,
        byOrder: view.localHostDenials.byOrder,
        malformedRows: 1,
        privateInputExcluded: true,
      };
    },
  );

  probe(
    "retained usage finds exactly one synthetic transcript and refuses ambiguous lanes",
    5,
    () => {
      const main = fakeRepo("usage-main"),
        id = "verification-counter-fixture",
        digest = key(id),
        removed = join(main, "removed-source");
      const retained = join(main, "docs/control/local/retained"),
        lane = join(retained, "WO-976/harness");
      json(join(lane, `${digest}.json`), {
        startedAt: "2031-01-01T00:01:00Z",
        role: "executor",
        workOrder: "WO-976",
      });
      json(join(lane, "sources.jsonl"), { worktree: removed });
      const counter = (timestamp, input, output) => ({
        type: "event_msg",
        timestamp,
        payload: {
          type: "token_count",
          info: {
            total_token_usage: {
              input_tokens: input,
              cached_input_tokens: 0,
              output_tokens: output,
              total_tokens: input + output,
            },
          },
        },
      });
      const codex = join(main, "codex");
      put(
        join(codex, `sessions/${id}.jsonl`),
        [
          { type: "session_meta", payload: { id, cwd: removed } },
          counter("2031-01-01T00:00:00Z", 100, 10),
          counter("2031-01-01T00:02:00Z", 300, 40),
        ]
          .map(JSON.stringify)
          .join("\n") + "\n",
      );
      const env = {
        CODEX_HOME: codex,
        CLAUDE_CONFIG_DIR: join(main, "claude"),
        COPILOT_HOME: join(main, "copilot"),
      };
      const result = readRetainedSession(retained, id, { env });
      assert.equal(result.order, "WO-976");
      assert.equal(result.observation.usage.totalTokens, 230);
      assert.equal(result.observation.source, "codex-transcript-counter");
      json(join(retained, `WO-977/harness/${digest}.json`), {
        role: "verifier",
      });
      assert.throws(
        () => readRetainedSession(retained, id, { env }),
        /ambiguous/,
      );
      return {
        order: "WO-976",
        counterSource: result.observation.source,
        totalTokens: 230,
        ambiguityRefused: true,
      };
    },
  );

  probe(
    "a renumbered record is restamped once before a class-window removal",
    8,
    () => {
      const main = fakeRepo("device-main");
      const target = temporary.ensureTemporaryRoot(join(main, "owned"), {
        class: "closed-journal",
        repository: main,
        retentionHours: 0,
        owner: {
          pid: 2147483647,
          birth: "dead",
          gateId: undefined,
          suite: undefined,
          session: undefined,
          workOrder: "WO-978",
        },
      });
      const record = temporary.readTemporaryOwner(target);
      delete record.fixtureOwner;
      record.createdAt = "2020-01-01T00:00:00Z";
      const observed = lstatSync(target).dev;
      record.device = observed + 37;
      json(join(target, temporary.TEMPORARY_OWNER_FILE), record);
      const first = temporary.readTemporaryOwner(target),
        second = temporary.readTemporaryOwner(target);
      assert.equal(first.device, observed);
      assert.equal(second.device, observed);
      const rows = temporary
        .temporaryLedger(main)
        .filter(
          (r) => r.token === record.token && r.action === "device-renumbered",
        );
      assert.equal(rows.length, 1);
      assert.equal(rows[0].recordedDevice, observed + 37);
      assert.equal(rows[0].observedDevice, observed);
      const judgment = judgeTemporaryRoot(main, target, {}, context);
      assert.ok(judgment.candidate, JSON.stringify(judgment));
      applyTemporaryCandidate(main, judgment.candidate);
      assert.equal(existsSync(target), false);
      return { transitionRows: 1, currentDeviceStamped: true, removed: true };
    },
  );

  probe(
    "oversized start counts preserve the command and report an overrun without throwing",
    "carry-in",
    () => {
      const block = fitStartBlock({
        command: "npm run plan -- failures",
        since: "2031-01-01",
        items: 4,
        offRampEvents: Object.fromEntries(
          Array.from({ length: 400 }, (_, i) => [`event-${i}`, i]),
        ),
      });
      assert.equal(block.items, 4);
      assert.match(block.overrun, /start block measured/);
      assert.ok(Buffer.byteLength(JSON.stringify(block)) < 1024);
      return { keys: Object.keys(block), bounded: true };
    },
  );
} finally {
  temporary.removeTemporaryPath(container, { recursive: true, force: true });
}
const output = {
  schemaVersion: 1,
  workOrder: "WO-237",
  recordedAt: new Date().toISOString(),
  probeCount: results.length,
  passed: results.filter((r) => r.passed).length,
  results,
};
console.log(JSON.stringify(output, null, 2));
if (results.some((r) => !r.passed)) process.exitCode = 1;
