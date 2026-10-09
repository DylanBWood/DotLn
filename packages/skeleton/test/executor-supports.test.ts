import test from "node:test";
import assert from "node:assert/strict";
import {
  compileEditableView,
  compileLoadout,
  defineLoadout,
  functionTableFromLoadout,
  lowerToHarness,
  requireCompiled,
  semanticHash,
  statechartJsonFromLoadout,
} from "@dotln/compiler";
import {
  contributorConfiguredProgram,
  defaultContributorSupportIds,
  contributorLoadout,
  contributorLoadoutBeforeMissionCheck,
  contributorOutsideAuthority,
  contributorProfiles,
  contributorPresence,
  contributorProgram,
  contributorRolesFor,
  contributorWithSupports,
} from "../src/loadouts/contributor.js";
import {
  adjacentRepair,
  defaultExecutorSupportIds,
  decisionReceipts,
  executorSupportDefaults,
  executorSupportIds,
  executorSupports,
} from "../src/loadouts/executor-supports.js";
import { processCost } from "../src/loadouts/process-cost.js";
import { goalAlignment } from "../src/loadouts/goal-alignment.js";
import { personalFeedback } from "../src/loadouts/feedback.js";

const environment = {
  environmentId: "contributor.project",
  version: 1,
  capabilities: [],
  repo: "project",
  baseCommit: "0".repeat(40),
};

test("WO-133 every generated role preserves supplied actor values and checks edited product publications", () => {
  const program = contributorProgram();
  for (const profile of contributorProfiles) {
    const target = {
      ...profile,
      runtime: {
        ...profile.runtime,
        files: [
          "packages/compiler/dist/src/feedback.js",
          "packages/skeleton/dist/src/feedback-boundary.js",
          "packages/skeleton/dist/src/feedback-source-comments.js",
          "packages/skeleton/dist/src/harness-host.js",
          "packages/skeleton/dist/src/reactor.js",
        ].map((path) => ({ path, hash: "fnv1a64:0000000000000000" })),
      },
    };
    const bundle = lowerToHarness(
      program,
      personalFeedback(),
      program.loadout.authorityEnvelope,
      target,
    );
    const roles = bundle.files.filter((file) =>
      file.path.endsWith("/SKILL.md"),
    );
    assert.equal(roles.length, 6);
    for (const role of roles) {
      assert.match(
        role.contents,
        /Without a session readback, keep the operator-selected model and effort with `--source operator-attested`; Claude Code roles read `CLAUDE_EFFORT` first/,
      );
      assert.match(role.contents, /unknown` only for a value nobody supplied/);
      assert.match(
        role.contents,
        /authorized product-document edit, run `npm run publication:check`/,
      );
    }
  }
});

test("WO-179 and WO-195 emitted roles carry their assigned corrections across support settings", () => {
  const sharedRules = [
    "Settle routine version, waiver-route, live-episode, regeneration and reinstall questions within existing authority; ask when the answer changes scope or authority.",
    "Before acting on an operator message, state its aim in one line and act on that reading; ask one focused question if the reading is doubtful.",
    "A claim of cause, blocker, unreachable service or finished work names the command and output it rests on; a partial search names its boundary.",
    "Request needed authority in this session through the host permission flow; never hand the operator a command to run in your place unless the order or role names that fallback.",
    "A command given to the operator is copy-paste runnable with real paths and no placeholders; a question says what it decides and why in plain words.",
    "Answer a stale gate row by running the gate at the current identity, never by restoring bytes to match it; never remove a reviewed fix to pass a check.",
    "Stop the background monitors you started before recording your result.",
    "After a second consecutive provider safeguard refusal, stop retrying, record the stop as a decision naming phase and model, and resume in a fresh session.",
    "Await a gate or background task through `node scripts/harness.mjs evidence --wait [--timeout <seconds>]` in the background or the host's completion signal, then do bounded listed work or stay quiet; never poll or narrate the wait.",
    "Never guess: an unobserved value is `unknown`, `untested` or `blocked`; name the readable source tried before writing `unknown`, and correct an unfiled report in place instead of appending a correction.",
  ];
  for (const economy of [true, false]) {
    const program = contributorConfiguredProgram({
      "tinkerer-economy": economy,
    });
    for (const profile of contributorProfiles) {
      const target = {
        ...profile,
        runtime: {
          ...profile.runtime,
          files: [
            "packages/compiler/dist/src/feedback.js",
            "packages/skeleton/dist/src/feedback-boundary.js",
            "packages/skeleton/dist/src/feedback-source-comments.js",
            "packages/skeleton/dist/src/harness-host.js",
            "packages/skeleton/dist/src/reactor.js",
          ].map((path) => ({ path, hash: "fnv1a64:0000000000000000" })),
        },
      };
      const bundle = lowerToHarness(
        program,
        personalFeedback(),
        program.loadout.authorityEnvelope,
        target,
      );
      const roles = bundle.files.filter((file) =>
        file.path.endsWith("/SKILL.md"),
      );
      assert.equal(roles.length, 6);
      for (const role of roles) {
        const subject = `${profile.profileId} ${role.path} economy=${economy}`;
        for (const rule of sharedRules)
          assert.equal(
            role.contents.split(rule).length - 1,
            1,
            `${subject}: assigned rule ${rule}`,
          );
        if (role.path.endsWith("dotln-release-close/SKILL.md")) {
          assert.match(
            role.contents,
            /Run the printed helper command exactly as printed, with no redirect, prefix, cd or pipe/,
            subject,
          );
          assert.match(
            role.contents,
            /The close is done when the tag and Release exist, git worktree list shows no worktree for the order, its directory is gone and git branch --list wo-NNN is empty/,
            subject,
          );
          assert.match(
            role.contents,
            /Diagnose and finish a cleanup blocker in this session; retry by re-running the same command, which re-checks an existing Release and never publishes twice/,
            subject,
          );
          assert.match(
            role.contents,
            /Retry a host denial of the exact command once through the host permission flow before handing the operator the printed command for !/,
            subject,
          );
          assert.match(
            role.contents,
            /The close removes any scratch repository still present and records its path, head commit and whether a remote held it; intake and declared submodules stay, and an operator word through --material preserves a scratch repository; never force teardown/,
            subject,
          );
          assert.doesNotMatch(
            role.contents,
            /A comment says what the code does/,
            subject,
          );
          assert.doesNotMatch(
            role.contents,
            /repeat transitions|without repeating publication/,
            subject,
          );
          assert.doesNotMatch(role.contents, /Report refusals;/, subject);
        } else if (role.path.endsWith("dotln-planner/SKILL.md")) {
          assert.match(
            role.contents,
            /After the refutation receipt is filed with its holds answered and npm run test:docs is green, a planning or ideation pass on a planning branch pushes that branch and opens its :memo: pull request/,
            subject,
          );
          assert.match(
            role.contents,
            /the dispatch phrase is the operator's authorization for those two effects, and the pass never merges/,
            subject,
          );
        } else if (role.path.endsWith("dotln-executor/SKILL.md")) {
          assert.match(
            role.contents,
            /Remove scratch repositories, nested repositories outside intake that the tracked tree does not declare as submodules; never declare one\. The close removes any left and records its head commit\./,
            subject,
          );
          // Each executor rule is stated once: the numbered step carries it
          // and no later sentence restates it.
          assert.doesNotMatch(
            role.contents,
            /Remove each scratch repository|Implement the complete bounded deliverable|For resume: status or resume: times|Finish all authored output/,
            subject,
          );
          assert.doesNotMatch(
            role.contents,
            /npm run worktree -- material/,
            subject,
          );
          assert.match(
            role.contents,
            /A comment says what the code does or why, in words a reader who has not seen the order understands; an order, report, finding or decision identifier never leads or replaces that explanation/,
            subject,
          );
        } else if (role.path.endsWith("dotln-reviewer/SKILL.md")) {
          assert.match(
            role.contents,
            /remove any scratch repository still in the worktree; prepare release surfaces/,
            subject,
          );
          assert.doesNotMatch(
            role.contents,
            /A comment says what the code does/,
            subject,
          );
        } else if (role.path.endsWith("dotln-verifier/SKILL.md")) {
          assert.match(
            role.contents,
            /Consume the executor's recorded passing `npm test` row when its code identity matches the subject/,
            subject,
          );
          assert.doesNotMatch(
            role.contents,
            /Run the product gate with `npm test`/,
            subject,
          );
        }
      }
    }
  }
});

const text = (id: string) =>
  executorSupports
    .find((support) => support.supportFacetId === id)!
    .emissions.flatMap((emission) =>
      emission.kind === "prompt-fragment" ? [emission.text] : [],
    )[0]!;
const combinations = Array.from(
  { length: 2 ** defaultExecutorSupportIds.length },
  (_, mask) =>
    defaultExecutorSupportIds.filter((_, index) => (mask & (1 << index)) !== 0),
);
const baselineEnvelope = contributorProgram([]).loadout.authorityEnvelope;

test("WO-145 economy equipment adds only executor guidance and no authority or host checks", () => {
  // The tinkerer-economy default was flipped to on (WO-150), so the per-order
  // opt-out is the off case and the equipped build is what an ordinary
  // dispatch compiles.
  const on = contributorConfiguredProgram({});
  const off = contributorConfiguredProgram({ "tinkerer-economy": false });
  assert.deepEqual(on.loadout.authorityEnvelope, off.loadout.authorityEnvelope);
  assert.deepEqual(on.loadout.workOrder, off.loadout.workOrder);
  assert.deepEqual(
    on.facets.filter((facet) => facet.kind !== "role-procedure"),
    off.facets.filter((facet) => facet.kind !== "role-procedure"),
  );
  for (const role of off.roles.filter((row) => row.name !== "executor"))
    assert.deepEqual(
      on.roles.find((row) => row.name === role.name),
      role,
    );
  assert.equal(executorSupportDefaults["tinkerer-economy"], true);
  assert.ok(defaultExecutorSupportIds.includes("tinkerer-economy"));
  assert.ok(
    on.loadout.componentManifest.some(
      (entry) => entry.componentId === "tinkerer-economy",
    ),
  );
  assert.ok(
    !off.loadout.componentManifest.some(
      (entry) => entry.componentId === "tinkerer-economy",
    ),
  );
  // The opt-out removes this support alone; every other default stays equipped.
  assert.deepEqual(
    executorSupportIds({ "tinkerer-economy": false }),
    defaultExecutorSupportIds.filter((id) => id !== "tinkerer-economy"),
  );
  const executorProcedure = (program: typeof on) =>
    program.roles.find((row) => row.name === "executor")!.procedure;
  assert.ok(executorProcedure(on).includes(text("tinkerer-economy")));
  assert.ok(!executorProcedure(off).includes(text("tinkerer-economy")));
  for (const support of executorSupports.filter(
    (row) => row.supportFacetId !== "tinkerer-economy",
  ))
    assert.equal(
      executorProcedure(off).includes(text(support.supportFacetId)),
      executorProcedure(on).includes(text(support.supportFacetId)),
    );
});

test("WO-042 atomic support switches compose independently and removal restores the saved build", () => {
  const hashes = new Set<string>();
  for (const ids of combinations) {
    const graph = {
      ...contributorWithSupports(ids),
      authorityGrants: contributorOutsideAuthority,
    };
    const program = contributorProgram(ids);
    const hash = semanticHash(program.loadout);
    hashes.add(hash);
    assert.deepEqual(program.loadout.authorityEnvelope, baselineEnvelope);
    assert.deepEqual(
      program.loadout.workOrder,
      contributorProgram([]).loadout.workOrder,
    );
    assert.deepEqual(
      program.facets.filter((facet) => facet.kind !== "role-procedure"),
      contributorProgram([]).facets,
    );
    assert.deepEqual(
      program.loadout.componentManifest
        .filter((entry) => ids.includes(entry.componentId))
        .map((entry) => entry.componentId)
        .sort(),
      [...ids].sort(),
    );
    const procedure = program.roles.find(
      (role) => role.name === "executor",
    )!.procedure;
    for (const support of executorSupports)
      assert.equal(
        procedure.includes(text(support.supportFacetId)),
        ids.includes(support.supportFacetId),
      );
    assert.equal(
      procedure.some((line) => line.includes("Repair only those obligations.")),
      !ids.includes(adjacentRepair.supportFacetId),
    );
    assert.ok(
      procedure.some((line) =>
        line.includes("Operator controls precede workflow"),
      ),
    );
    assert.match(procedure[0]!, /^1\. .*honor operator controls/);
    const readOnlyEntry = procedure.findIndex((line) =>
      line.includes("read-only command"),
    );
    assert.ok(readOnlyEntry >= 0);
    assert.ok(procedure[readOnlyEntry]!.includes("stop"));
    const firstSubjectRead = procedure.indexOf("Read: `@work-order`");
    assert.ok(readOnlyEntry < firstSubjectRead);
    for (const id of ids)
      assert.ok(
        procedure.indexOf(text(id)) < firstSubjectRead,
        `${id} is an entry duty`,
      );
    for (const role of contributorProgram([]).roles.filter(
      (role) => role.name !== "executor",
    ))
      assert.deepEqual(
        program.roles.find((item) => item.name === role.name),
        role,
      );
    for (const view of [
      defineLoadout(graph),
      functionTableFromLoadout(graph),
      statechartJsonFromLoadout(graph),
    ]) {
      const roundTrip = compileEditableView(view, {
        ...environment,
        authorityGrantRegistry: contributorOutsideAuthority,
      });
      assert.equal(roundTrip.ok, true);
      assert.equal(roundTrip.semanticHash, hash);
    }
    assert.equal(
      semanticHash(contributorProgram([...ids].reverse()).loadout),
      hash,
    );
  }
  assert.equal(hashes.size, combinations.length);
  // The current vocabulary gets its own identity (WO-161). WO-099's presence
  // policy and WO-042's earlier graph keep their original hashes below.
  assert.equal(
    semanticHash(
      requireCompiled(compileLoadout(contributorLoadout, environment)),
    ),
    "fnv1a64:fcf61a6d699e7ffd",
  );
  const historical = structuredClone(contributorLoadoutBeforeMissionCheck);
  Object.assign(historical.activeMechanics[0]!.authorityEnvelope!, {
    authorityEnvelopeId: "contributor.sandboxed",
  });
  Object.assign(historical.activeMechanics[0]!.workOrder!, {
    constraints: [
      "Locked Clean Room floor",
      "Sandbox and human approval boundaries remain in force",
    ],
  });
  Object.assign(historical.supportFacets[0]!, {
    name: "Sandboxed contributor authority",
  });
  // Restoring only those three labels reproduces both historical identities;
  // no filed snapshot or old expected hash changes to match the current build.
  assert.equal(
    semanticHash(requireCompiled(compileLoadout(historical, environment))),
    "fnv1a64:06245f5c581212f1",
  );
  assert.equal(
    semanticHash(
      requireCompiled(
        compileLoadout(
          { ...historical, presence: contributorPresence },
          environment,
        ),
      ),
    ),
    "fnv1a64:87aa6e1263d6d74d",
  );
  assert.equal(contributorWithSupports([]), contributorLoadout);
  assert.deepEqual(
    contributorProgram(),
    contributorProgram(defaultContributorSupportIds),
  );
  assert.deepEqual(contributorConfiguredProgram(), contributorProgram());
  assert.deepEqual(executorSupportIds(), defaultExecutorSupportIds);
  assert.equal(
    contributorConfiguredProgram({
      "decision-receipts": false,
    }).loadout.promptFragments.includes(text("decision-receipts")),
    false,
  );
  assert.equal(
    contributorConfiguredProgram({
      "decision-receipts": false,
    }).loadout.promptFragments.includes(text("adjacent-repair")),
    true,
  );
  assert.equal(
    semanticHash(
      contributorConfiguredProgram({
        ...Object.fromEntries(
          Object.keys(executorSupportDefaults).map((id) => [id, false]),
        ),
        "process-cost": false,
        "goal-alignment": false,
      }).loadout,
    ),
    semanticHash(contributorProgram([]).loadout),
  );
});

test("Process Cost is one compiled support projected once into every Contributor role", () => {
  const program = contributorProgram();
  const off = contributorConfiguredProgram({ "process-cost": false });
  const fragment = processCost.emissions.flatMap((emission) =>
    emission.kind === "prompt-fragment" ? [emission.text] : [],
  )[0]!;
  assert.equal(
    program.loadout.componentManifest.filter(
      (entry) => entry.componentId === "process-cost",
    ).length,
    1,
  );
  assert.deepEqual(
    program.loadout.authorityEnvelope,
    off.loadout.authorityEnvelope,
  );
  assert.deepEqual(program.loadout.workOrder, off.loadout.workOrder);
  assert.ok(!off.loadout.promptFragments.includes(fragment));
  assert.ok(off.loadout.promptFragments.includes(text("adjacent-repair")));
  const goal = goalAlignment.emissions.flatMap((emission) =>
    emission.kind === "prompt-fragment" ? [emission.text] : [],
  )[0]!;
  const withoutGoal = contributorConfiguredProgram({ "goal-alignment": false });
  for (const target of [program, off, withoutGoal, contributorProgram([])])
    for (const role of target.roles) {
      assert.ok(
        role.procedure.some((line) => line.includes("`scope expand:`")),
      );
      assert.ok(
        role.procedure.some((line) => line.includes("`conversation only:`")),
      );
    }
  for (const role of program.roles) {
    assert.equal(
      role.procedure.filter((line) => line === fragment).length,
      1,
      role.name,
    );
    assert.equal(
      off.roles
        .find((row) => row.name === role.name)!
        .procedure.includes(fragment),
      false,
    );
    assert.equal(role.procedure.filter((line) => line === goal).length, 1);
    assert.equal(
      withoutGoal.roles
        .find((row) => row.name === role.name)!
        .procedure.includes(goal),
      false,
    );
    assert.ok(
      withoutGoal.roles
        .find((row) => row.name === role.name)!
        .procedure.includes(fragment),
    );
  }
  for (const profile of contributorProfiles) {
    const target = {
      ...profile,
      runtime: {
        ...profile.runtime,
        files: [
          "packages/compiler/dist/src/feedback.js",
          "packages/skeleton/dist/src/feedback-boundary.js",
          "packages/skeleton/dist/src/feedback-source-comments.js",
          "packages/skeleton/dist/src/harness-host.js",
          "packages/skeleton/dist/src/reactor.js",
        ].map((path) => ({ path, hash: "fnv1a64:0000000000000000" })),
      },
    };
    const bundle = lowerToHarness(
      program,
      personalFeedback(),
      baselineEnvelope,
      target,
    );
    for (const role of program.roles) {
      const file = bundle.files.find((file) =>
        file.path.endsWith(`dotln-${role.name}/SKILL.md`),
      )!;
      assert.ok(file.origin.ids.includes("process-cost"), role.name);
      assert.ok(file.origin.ids.includes("goal-alignment"), role.name);
      assert.ok(
        file.origin.ids.includes("correctness-over-sycophancy"),
        role.name,
      );
      assert.ok(
        file.contents.includes(
          "preserve disagreement as a failed or unsupported claim",
        ),
        role.name,
      );
      assert.equal(file.contents.split(fragment).length - 1, 1, role.name);
      assert.equal(
        file.contents.split("`scope expand:`").length - 1,
        1,
        role.name,
      );
      assert.equal(
        file.contents.split("`conversation only:`").length - 1,
        1,
        role.name,
      );
      assert.ok(file.contents.includes("only explicit pause/stop interrupts"));
      assert.ok(file.contents.includes("Neither appends an event"));
    }
    assert.ok(
      !bundle.residue.items.some((item) => item.originId === "process-cost"),
    );
    for (const change of [
      { roleNames: [] },
      { roleNames: ["executor", "executor"] },
      { roleNames: ["unknown"] },
      { roleName: "executor" },
    ]) {
      const broken = {
        ...program,
        facets: program.facets.map((facet) =>
          facet.facetId === "process-cost" ? { ...facet, ...change } : facet,
        ),
      };
      assert.throws(
        () =>
          lowerToHarness(
            broken as typeof program,
            personalFeedback(),
            baselineEnvelope,
            target,
          ),
        /equipped prompt support/,
      );
    }
  }
});

test("WO-042 installed role projection takes each support from compiled equipment", () => {
  for (const ids of combinations) {
    const program = contributorProgram(ids);
    for (const observedProfile of contributorProfiles) {
      const profile = {
        ...observedProfile,
        runtime: {
          ...observedProfile.runtime,
          files: [
            "packages/compiler/dist/src/feedback.js",
            "packages/skeleton/dist/src/feedback-boundary.js",
            "packages/skeleton/dist/src/feedback-source-comments.js",
            "packages/skeleton/dist/src/harness-host.js",
            "packages/skeleton/dist/src/reactor.js",
          ].map((path) => ({ path, hash: "fnv1a64:0000000000000000" })),
        },
      };
      const bundle = lowerToHarness(
        program,
        personalFeedback(),
        baselineEnvelope,
        profile,
      );
      const skill = bundle.files.find((file) =>
        file.path.endsWith("dotln-executor/SKILL.md"),
      )!.contents;
      for (const id of ids) {
        assert.ok(
          bundle.files
            .find((file) => file.path.endsWith("dotln-executor/SKILL.md"))!
            .origin.ids.includes(id),
        );
        assert.equal(
          bundle.residue.items.some((item) => item.originId === id),
          false,
        );
      }
      for (const support of executorSupports)
        assert.equal(
          skill.includes(text(support.supportFacetId)),
          ids.includes(support.supportFacetId),
        );
      for (const role of ["verifier", "reviewer", "planner", "release-close"])
        for (const support of executorSupports)
          assert.equal(
            bundle.files
              .find((file) => file.path.endsWith(`dotln-${role}/SKILL.md`))!
              .contents.includes(text(support.supportFacetId)),
            false,
          );
      assert.throws(
        () =>
          lowerToHarness(
            program,
            personalFeedback(),
            {
              ...baselineEnvelope,
              allowedEffects: [
                ...baselineEnvelope.allowedEffects,
                "repo.delete",
              ],
            },
            profile,
          ),
        /envelope must be the compiled build envelope/u,
      );
      if (ids.length) {
        const changedFacet = (change: object) => ({
          ...program,
          facets: program.facets.map((facet) =>
            facet.kind === "role-procedure" ? { ...facet, ...change } : facet,
          ),
        });
        for (const change of [
          { roleName: "absent" },
          { text: "Uncompiled prose" },
        ])
          assert.throws(
            () =>
              lowerToHarness(
                changedFacet(change),
                personalFeedback(),
                baselineEnvelope,
                profile,
              ),
            /equipped prompt support/u,
          );
      }
    }
  }
  assert.throws(() => contributorProgram(["unknown"]), /unknown or duplicate/u);
  assert.throws(
    () => executorSupportIds({ "decision-receipts": "off" } as never),
    /ON\/OFF booleans/u,
  );
  assert.throws(
    () => executorSupportIds({ unknown: true } as never),
    /known ids/u,
  );
  for (const id of [
    "communication-observation",
    "communication-recommendation",
  ]) {
    assert.ok(contributorProgram([id]).roles[0]!.procedure.includes(text(id)));
    assert.throws(
      () => contributorProgram([id, "communication-intent"]),
      /conflict/iu,
    );
  }
  assert.throws(
    () => contributorProgram(["adjacent-repair", "adjacent-repair"]),
    /unknown or duplicate/u,
  );
  assert.throws(
    () =>
      contributorRolesFor({
        ...contributorProgram().loadout,
        promptFragments: [],
      }),
    /projection drift/u,
  );
  assert.throws(
    () =>
      contributorRolesFor({
        ...contributorProgram().loadout,
        componentManifest: contributorProgram().loadout.componentManifest.map(
          (entry) =>
            entry.componentId === "adjacent-repair"
              ? { ...entry, version: 2 }
              : entry,
        ),
      }),
    /projection drift/u,
  );
});

test("execution roles open with an ordered handoff and keep shared rules below it", () => {
  const roles = contributorProgram().roles;
  for (const name of ["executor", "verifier", "reviewer"]) {
    const role = roles.find((row) => row.name === name)!;
    const rules = role.procedure.indexOf("Rules:");
    assert.ok(rules > 0, name);
    assert.equal(role.procedure.filter((line) => line === "Rules:").length, 1);
    const steps = role.procedure.slice(0, rules);
    steps.forEach((step, index) =>
      assert.ok(step.startsWith(`${index + 1}. `), name),
    );
    const format = steps.findIndex((step) => step.includes("npm run format"));
    assert.ok(format >= 0);
    if (name === "verifier") {
      assert.match(steps[format]!, /`npm run format:check`/);
      assert.doesNotMatch(steps[format]!, /`npm run format`/);
      assert.match(steps[format]!, /target only its allocated path/);
    }
    assert.ok(steps[format + 1]!.includes("npm run test:docs"));
    assert.ok(steps[format + 2]!.includes("npm test"));
    assert.ok(
      steps[format + 2]!.includes(
        "while it runs, write nothing under the repository and start no agent",
      ),
    );
    assert.match(
      steps[format + 3]!,
      /Complete.*(?:handoff\.md|VER report|FINAL report)/,
    );
    assert.ok(steps[format + 4]!.includes("npm run resume --"));
    assert.ok(
      role.procedure
        .slice(rules + 1)
        .some((line) => line.startsWith("Completion flags:")),
    );
  }
  const executor = roles
    .find((row) => row.name === "executor")!
    .procedure.join("\n");
  assert.match(
    executor,
    /Before `implementation-ready` only, spawn two fresh `dotln-worker` agents/,
  );
  assert.match(executor, /one adversary of the criteria and one improver/);
  assert.doesNotMatch(
    executor,
    /Before either completion|900 s|all eight system traps/,
  );
  const verifier = roles
    .find((row) => row.name === "verifier")!
    .procedure.join("\n");
  assert.match(
    verifier,
    /your own probes and the executor's two worker reports/,
  );
  assert.match(verifier, /Spawn a worker only to reproduce one named claim/);
  assert.match(
    verifier,
    /breaks no criterion and no behavior `main` had is a follow-up, never blocking/,
  );
});
