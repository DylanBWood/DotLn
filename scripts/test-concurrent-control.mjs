import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGACY_CONTROL_PATH, orderSegmentPath } from "./lib/control.mjs";
import {
  addedSegmentEvents,
  controlFromSources,
  readControl,
} from "./lib/control-store.mjs";
import { localReleaseRecords } from "./lib/release-records.mjs";
import { readIndex } from "./work-orders.mjs";
await test("test-concurrent-control", async (t) => {
  let fixture,
    main,
    scriptRoot,
    run,
    ok,
    git,
    command,
    write,
    commit,
    resume,
    status,
    actor,
    actorArgs,
    notes,
    record,
    closeOrder,
    refresh,
    merge,
    baseline,
    baselineTag,
    legacyBytes,
    subjects,
    first,
    second,
    third,
    secondBefore,
    preMerge,
    unfinishedSurface,
    overview,
    ambiguousSurface,
    bytesBeforeRefusals,
    projectionBeforeRefusals,
    unknown,
    selected,
    closedFirst,
    finished,
    prepared,
    beforeThird,
    closedSecond,
    index,
    prior;
  await t.test(
    "independent real worktrees: WO-901 ready-to-verify; WO-902 verifying; sibling segment/projection byte-identical after WO-901 transition",
    () => {
      // Called only from the release shell suite's owned fixture. Its origin is a
      // local bare repository; npm and gh are the suite's deterministic stubs.
      fixture = process.argv[2];

      assert.ok(
        fixture && isAbsolute(fixture) && realpathSync(fixture) === fixture,
      );
      assert.ok(existsSync(join(dirname(fixture), ".dotln-test-root-owner")));
      assert.ok(existsSync(join(fixture, "origin.git/HEAD")));
      main = join(fixture, "project");

      scriptRoot = dirname(fileURLToPath(import.meta.url));

      run = (root, executable, args) =>
        spawnSync(executable, args, {
          cwd: root,
          encoding: "utf8",
          maxBuffer: 16 * 1024 * 1024,
        });

      ok = (result) => {
        assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
        return result.stdout.trim();
      };

      git = (root, args) => ok(run(root, "git", ["-C", root, ...args]));

      assert.equal(git(main, ["rev-parse", "--show-toplevel"]), main);
      command = (root, tool, args) =>
        ok(
          run(root, process.execPath, [
            join(root, `scripts/${tool}.mjs`),
            ...args,
          ]),
        );

      write = (root, path, bytes) => {
        mkdirSync(dirname(join(root, path)), { recursive: true });
        writeFileSync(join(root, path), bytes);
      };

      commit = (root, message) => {
        git(root, ["add", "."]);
        git(root, ["commit", "-qm", message]);
      };

      resume = (root, args) => command(root, "resume", args);

      status = (root, args = []) =>
        JSON.parse(resume(root, ["status", "--json", ...args]));

      actor = {
        harness: "human",
        harnessVersion: "not-applicable",
        model: "human",
        effort: "unknown",
        source: "operator-attested",
      };

      actorArgs = Object.entries({
        harness: actor.harness,
        "harness-version": actor.harnessVersion,
        model: actor.model,
        effort: actor.effort,
        source: actor.source,
      }).flatMap(([key, value]) => [`--${key}`, value]);

      notes = (id) =>
        `## Release overview\n\n${id} fixture payoff.\n\n## Read before upgrading\n\nNone.\n\n## Substantive changes\n\nIndependent control evidence for ${id}.\n\n## Progressive polish\n\nNone.\n\n## Evidence and compatibility\n\nReal Git fixture; event schema 1.\n`;

      record = (root, id, kind) =>
        write(
          root,
          `docs/${kind === "VER" ? "verifications" : "final-reviews"}/${id}/${kind}-001.md`,
          `# ${kind}-001 fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n`,
        );

      closeOrder = (root, id, version) => {
        if (status(root).phase === "ready-to-verify") resume(root, ["verify"]);
        record(root, id, "VER");
        resume(root, ["verification-result", "pass", ...actorArgs]);
        resume(root, ["final-review"]);
        record(root, id, "FINAL");
        write(root, `docs/final-reviews/${id}/RELEASE-NOTES.md`, notes(id));
        write(
          root,
          "README.md",
          `# Fixture\n\n<!-- DOTLN-RELEASE-BEGIN -->\n\nThis source is DotLn \`${version}\`.\n<!-- DOTLN-RELEASE-END -->\n`,
        );
        resume(root, ["final-review-result", "pass", ...actorArgs]);
        command(root, "work-orders", ["index"]);
        commit(root, `${id} final review pass`);
      };

      refresh = (root, closed = "WO-003") => {
        resume(root, ["next", "--work-order", closed]);
        command(root, "work-orders", ["index"]);
      };

      merge = (root, branch, closed = "WO-003") => {
        const result = run(root, "git", [
          "-C",
          root,
          "merge",
          "--no-ff",
          "--no-commit",
          branch,
        ]);
        if (result.status !== 0) {
          const conflicts = git(root, [
            "diff",
            "--name-only",
            "--diff-filter=U",
          ]).split("\n");
          assert.ok(conflicts.length > 0);
          assert.ok(
            conflicts.every((path) =>
              [
                "docs/control/current.md",
                "docs/work-orders/README.md",
              ].includes(path),
            ),
            `${result.stderr}\n${conflicts.join(", ")}`,
          );
          console.log(
            `Resolved generated projection conflicts for ${branch}: ${conflicts.join(", ")}`,
          );
        }
        refresh(root, closed);
        commit(root, `Integrate ${branch}`);
      };

      // Give the shell suite's baseline the attribution fields required by the index.
      // This changes only the disposable fixture's tag, before any subject is created.
      baseline = {
        release: { application: "v0.2.0" },
        workOrder: { id: "WO-003" },
        notes: { changedFiles: [] },
        versions: {
          components: { "@dotln/kernel": "0.1.0", "@dotln/skeleton": "0.2.0" },
        },
      };

      git(main, [
        "tag",
        "-f",
        "-a",
        "v0.2.0",
        "-m",
        `DotLn v0.2.0 — fixture baseline\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(baseline)}\nDOTLN-MANIFEST-END`,
      ]);
      baselineTag = git(main, ["rev-parse", "refs/tags/v0.2.0"]);

      // The bare fixture shares no object database; transfer the rewritten fixture tag.
      git(main, ["push", "--force", "origin", "refs/tags/v0.2.0"]);
      assert.ok(baselineTag);
      cpSync(
        join(scriptRoot, "work-orders.mjs"),
        join(main, "scripts/work-orders.mjs"),
      );
      for (const [id, version] of [
        ["WO-901", "v0.2.1"],
        ["WO-902", "v0.2.2"],
        ["WO-903", "v0.2.3"],
      ])
        write(
          main,
          `docs/work-orders/${id}-fixture.md`,
          `# ${id} — concurrent fixture, ${version}\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Depends on:** WO-003 closed.\n\n**Objective:** Prove independent lifecycle and serial integration.\n\n**Non-goals:** External distribution.\n`,
        );
      write(
        main,
        "docs/planning/work-order-map.md",
        "# Fixture plan\n\n<!-- dotln-work-order-sequence:start -->\n- WO-901 — first\n- WO-902 — second\n- WO-903 — third\n<!-- dotln-work-order-sequence:end -->\n",
      );
      refresh(main);
      commit(main, "Concurrent fixture authorities");
      git(main, ["push", "origin", "main"]);
      legacyBytes = readFileSync(join(main, LEGACY_CONTROL_PATH));

      subjects = new Map();

      for (const id of ["WO-901", "WO-902", "WO-903"]) {
        command(main, "worktree", [
          "start",
          id,
          `docs/work-orders/${id}-fixture.md`,
        ]);
        const subject = join(fixture, `project-wo${id.slice(3)}`);
        assert.equal(git(subject, ["rev-parse", "--show-toplevel"]), subject);
        assert.equal(status(subject).workOrder, id);
        subjects.set(id, subject);
      }
      first = subjects.get("WO-901");

      second = subjects.get("WO-902");

      third = subjects.get("WO-903");

      secondBefore = [
        readFileSync(join(second, orderSegmentPath("WO-902"))),
        readFileSync(join(second, "docs/control/current.md")),
      ];

      resume(first, ["implementation-ready", ...actorArgs]);
      assert.deepEqual(
        [
          readFileSync(join(second, orderSegmentPath("WO-902"))),
          readFileSync(join(second, "docs/control/current.md")),
        ],
        secondBefore,
      );
      resume(second, ["implementation-ready", ...actorArgs]);
      resume(second, ["verify"]);
      resume(third, ["implementation-ready", ...actorArgs]);
      assert.equal(status(first).phase, "ready-to-verify");
      assert.equal(status(second).phase, "verifying");
      preMerge = new Map(
        [...subjects].map(([id, root]) => [
          id,
          readControl(root).orders.get(id),
        ]),
      );

      for (const [id, root] of subjects) {
        assert.deepEqual(
          readFileSync(join(root, LEGACY_CONTROL_PATH)),
          legacyBytes,
        );
        assert.ok(
          status(root).latestCheckpoint.ref.startsWith(
            `refs/dotln/checkpoint/${id}/`,
          ),
        );
        commit(root, `${id} independent progress`);
      }
    },
  );
  await t.test(
    "serial partial integration preserves complete per-order states; main overview lists both; ambiguous/unknown selection refuses without mutation",
    () => {
      unfinishedSurface = run(first, process.execPath, [
        join(first, "scripts/release.mjs"),
        "check-surfaces",
        "--committed",
      ]);

      assert.equal(unfinishedSurface.status, 1);
      assert.match(
        unfinishedSurface.stderr,
        /observed WO-901 in phase ready-to-verify/,
      );

      merge(main, "wo-901");
      merge(main, "wo-902");
      for (const id of ["WO-901", "WO-902"])
        assert.deepEqual(readControl(main).orders.get(id), preMerge.get(id));
      overview = resume(main, ["status"]);

      assert.match(overview, /WO-901/);
      assert.match(overview, /WO-902/);
      assert.match(overview, /Elapsed implementation: \d+ ms/);
      ambiguousSurface = run(main, process.execPath, [
        join(main, "scripts/release.mjs"),
        "check-surfaces",
        "--committed",
      ]);

      assert.equal(ambiguousSurface.status, 1);
      assert.match(
        ambiguousSurface.stderr,
        /ambiguous work-order selection; open orders: WO-901, WO-902/,
      );
      bytesBeforeRefusals = [...readControl(main).sources];

      projectionBeforeRefusals = readFileSync(
        join(main, "docs/control/current.md"),
      );

      for (const args of [
        ["status", "--json"],
        ["implementation-ready", ...actorArgs],
        ["verify"],
      ]) {
        const refused = run(main, process.execPath, [
          join(main, "scripts/resume.mjs"),
          ...args,
        ]);
        assert.equal(refused.status, 1);
        assert.match(
          refused.stderr,
          /ambiguous work-order selection; open orders: WO-901, WO-902/,
        );
      }
      unknown = run(main, process.execPath, [
        join(main, "scripts/resume.mjs"),
        "status",
        "--json",
        "--work-order",
        "WO-999",
      ]);

      assert.equal(unknown.status, 1);
      assert.match(
        unknown.stderr,
        /unknown work order WO-999; open orders: WO-901, WO-902/,
      );
      assert.deepEqual([...readControl(main).sources], bytesBeforeRefusals);
      assert.deepEqual(
        readFileSync(join(main, "docs/control/current.md")),
        projectionBeforeRefusals,
      );
      selected = status(main, ["--work-order", "WO-902"]);

      assert.equal(selected.phase, "verifying");
      assert.equal(
        selected.orders.filter((row) => row.phase !== "closed").length,
        2,
      );
      assert.ok(
        selected.orders
          .filter((row) => row.phase !== "closed")
          .every((row) => typeof row.elapsed.implementation === "number"),
      );
      git(main, ["push", "origin", "main"]);
    },
  );
  await t.test(
    "worktree finish and no-publish release close select merged WO-901 while WO-902 is open; validated release then published only to fixture origin/gh stub",
    () => {
      closeOrder(first, "WO-901", "v0.2.1");
      closedFirst = readControl(first).orders.get("WO-901");

      merge(main, "wo-901", "WO-901");
      assert.deepEqual(readControl(main).orders.get("WO-901"), closedFirst);
      assert.deepEqual(
        readControl(main).orders.get("WO-902"),
        preMerge.get("WO-902"),
      );
      git(main, ["push", "origin", "main"]);
      finished = command(main, "worktree", ["finish", "WO-901"]);

      assert.match(finished, /removed merged wo-901 worktree/);
      assert.equal(existsSync(first), false);
      assert.equal(existsSync(second), true);
      assert.equal(
        readControl(main).orders.get("WO-902").state.phase,
        "verifying",
      );
      prepared = command(main, "release", ["close", "WO-901"]);

      assert.match(prepared, /Prepared and validated v0.2.1/);
      assert.equal(git(main, ["tag", "--list", "v0.2.1"]), "");
      assert.match(
        command(main, "release", ["close", "WO-901", "--publish"]),
        /Published annotated v0.2.1/,
      );
      assert.equal(
        readControl(main).orders.get("WO-902").state.phase,
        "verifying",
      );
    },
  );
  await t.test(
    "old-base third branch retains its segment; every first-parent append-only proof passes; index attributes WO-901 to v0.2.1 and WO-902 to v0.2.2",
    () => {
      beforeThird = readControl(main, "HEAD");

      merge(main, "wo-903", "WO-901");
      assert.deepEqual(
        readControl(main).orders.get("WO-903"),
        preMerge.get("WO-903"),
      );
      assert.deepEqual(
        addedSegmentEvents(
          beforeThird,
          readControl(main, "HEAD"),
          "third-branch merge",
        ).map((event) => event.workOrderId),
        ["WO-903", "WO-903"],
      );
      git(main, ["push", "origin", "main"]);
      // Revalidate the remaining lane against the integrated base before final review.
      merge(second, "main", "WO-901");
      assert.equal(status(second).workOrder, "WO-902");
      assert.equal(
        status(second, ["--work-order", "WO-903"]).workOrder,
        "WO-903",
      );
      assert.deepEqual(readControl(second).orders.get("WO-901"), closedFirst);
      closeOrder(second, "WO-902", "v0.2.2");
      closedSecond = readControl(second).orders.get("WO-902");

      merge(main, "wo-902", "WO-902");
      assert.deepEqual(readControl(main).orders.get("WO-902"), closedSecond);
      assert.deepEqual(
        readControl(main).orders.get("WO-903"),
        preMerge.get("WO-903"),
      );
      git(main, ["push", "origin", "main"]);
      assert.match(
        command(main, "release", ["close", "WO-902", "--publish"]),
        /Published annotated v0.2.2/,
      );
      index = readIndex(main, localReleaseRecords(main));

      assert.match(
        index.rows.find((row) => row.id === "WO-901").disposition,
        /^v0.2.1 /,
      );
      assert.match(
        index.rows.find((row) => row.id === "WO-902").disposition,
        /^v0.2.2 /,
      );
      assert.equal(
        index.rows.find((row) => row.id === "WO-903").section,
        "Active",
      );
      assert.deepEqual(
        index.releases.find((row) => row.name === "v0.2.1").controlSegments,
        [
          LEGACY_CONTROL_PATH,
          orderSegmentPath("WO-901"),
          orderSegmentPath("WO-902"),
        ],
      );
      assert.deepEqual(
        index.releases.find((row) => row.name === "v0.2.2").controlSegments,
        [
          LEGACY_CONTROL_PATH,
          orderSegmentPath("WO-901"),
          orderSegmentPath("WO-902"),
          orderSegmentPath("WO-903"),
        ],
      );
      assert.deepEqual(
        readFileSync(join(main, LEGACY_CONTROL_PATH)),
        legacyBytes,
      );
      prior = controlFromSources(new Map());

      for (const revision of git(main, [
        "rev-list",
        "--first-parent",
        "--reverse",
        "HEAD",
      ]).split("\n")) {
        const control = readControl(main, revision);
        addedSegmentEvents(
          prior,
          control,
          `first-parent fixture commit ${revision}`,
        );
        prior = control;
      }
      console.log("Concurrent integration fixture Git log:");
      console.log(
        git(main, [
          "log",
          "--graph",
          "--oneline",
          "--decorate",
          "--exclude=refs/dotln/checkpoint/*",
          "--all",
        ]),
      );
    },
  );
});
