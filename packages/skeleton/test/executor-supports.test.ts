import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
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
  SHARED_RULE_ROLES,
  sharedRules,
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

/** A shared rule's text, by its record's identifier. */
const ruleText = (id: string) => {
  const rule = sharedRules.find((row) => row.id === id);
  assert.ok(rule, `no shared rule ${id}`);
  return rule.text;
};
/** How many lines of a root, or of a procedure, are exactly this text. */
const holds = (lines: readonly string[], text: string) =>
  lines.filter((line) => line === text).length;

test("the generated roles are seven, and the router's root holds no subject read, completion flags or publication check", () => {
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
    assert.equal(roles.length, 7);
    const router = roles.find((role) =>
      role.path.endsWith("dotln-router/SKILL.md"),
    )!;
    assert.doesNotMatch(
      router.contents,
      /Read: `@work-order`|Completion flags:|npm run publication:check/,
    );
    assert.equal(roles.filter((role) => role !== router).length, 6);
  }
});

test("WO-276 criteria F1 and F2: with the economy support on and off and in both skill roots, a role's emitted root holds once each shared rule whose record names the role and none whose record does not, and no record is without a role", () => {
  // The records themselves: an identifier each, a role at least, and no role
  // the composition does not know. A record that names no role would reach
  // no root and be lost without a word.
  assert.equal(
    new Set(sharedRules.map((rule) => rule.id)).size,
    sharedRules.length,
    "a shared rule's identifier is its own",
  );
  assert.equal(
    new Set(sharedRules.map((rule) => rule.text)).size,
    sharedRules.length,
    "a shared rule's text is held by one record",
  );
  for (const rule of sharedRules) {
    assert.ok(rule.roles.length > 0, `${rule.id} names no role`);
    assert.equal(new Set(rule.roles).size, rule.roles.length, rule.id);
    for (const role of rule.roles)
      assert.ok(
        (SHARED_RULE_ROLES as readonly string[]).includes(role),
        `${rule.id} names ${role}`,
      );
  }
  const skillRoots = new Set<string>();
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
      for (const role of SHARED_RULE_ROLES) {
        const roots = bundle.files.filter((file) =>
          file.path.endsWith(`/dotln-${role}/SKILL.md`),
        );
        assert.ok(roots.length > 0, `${profile.profileId} emits ${role}`);
        for (const root of roots) {
          skillRoots.add(root.path.split("/dotln-")[0]!);
          const lines = root.contents.split("\n");
          for (const rule of sharedRules)
            assert.equal(
              holds(lines, rule.text),
              rule.roles.includes(role) ? 1 : 0,
              `${profile.profileId} ${root.path} economy=${economy}: ${rule.id}`,
            );
        }
      }
    }
  }
  assert.deepEqual([...skillRoots].sort(), [
    ".agents/skills",
    ".claude/skills",
  ]);
  // The router's root is written whole and this composition leaves it as it
  // was: of the shared rules it holds these, once each, and no other.
  const routerHolds = [
    "operator-controls",
    "browser-verification",
    "session-commands",
    "question-pathways",
    "blocked-turn",
    "operator-words",
    "worker-no-print",
  ];
  const router = contributorProgram().roles.find(
    (role) => role.name === "router",
  )!;
  for (const rule of sharedRules)
    assert.equal(
      holds(router.procedure, rule.text),
      routerHolds.includes(rule.id) ? 1 : 0,
      `router: ${rule.id}`,
    );
  // The program's own roles, which the emission takes: the same holds
  // before a root is written.
  for (const role of contributorProgram().roles.filter(
    (row) => row.name !== "router",
  ))
    for (const rule of sharedRules)
      assert.equal(
        holds(role.procedure, rule.text),
        (rule.roles as readonly string[]).includes(role.name) ? 1 : 0,
        `${role.name}: ${rule.id}`,
      );
});

// The re-task rule's record states what a re-task may continue and what it
// may not, and the planner is among its roles; the case above holds each
// named role's emitted root to the record's text. The planner's own
// procedure holds the capture rule and the sentence on the preflight
// advisory, once each.
test("WO-276 criterion R6: the re-task rule says what a worker may continue, and the planner's procedure holds the capture rule and the preflight advisory", () => {
  const rule = sharedRules.find((row) => row.id === "fan-out");
  assert.ok(rule);
  assert.ok((rule.roles as readonly string[]).includes("planner"));
  for (const clause of [
    "A worker may continue work it holds",
    "to recheck what it found",
    "to carry on the research it was given from what it has already read",
    "to restate in the required form a report that was refused for its form, changing no finding",
    "A re-task is still one use",
    "writes only to session scratch and the parent stays the sole repository writer",
    "A review or a refutation is never continued into a second judgment",
  ])
    assert.ok(rule.text.includes(clause), clause);
  assert.ok(!rule.text.includes("where it holds the diff and its findings"));
  const planner = contributorProgram().roles.find(
    (role) => role.name === "planner",
  );
  assert.ok(planner);
  const lines = (needle: string) =>
    planner.procedure.filter((line) => line.includes(needle));
  assert.equal(lines("A capture holds the operator's own words.").length, 1);
  assert.match(
    lines("A capture holds the operator's own words.")[0]!,
    /a block the operator pasted that a command or another session wrote whole in the ignored local planning lane.*name it and its SHA-256 in the capture/iu,
  );
  assert.equal(lines("prints a `preflight advisory` line").length, 1);
  assert.match(
    lines("prints a `preflight advisory` line")[0]!,
    /`npm run plan -- check` prints a `preflight advisory` line.*read each before filing too/u,
  );
});

/** Every role's emitted skill root, in both skill directories, as the
 * harness lowering writes them for the contributor loadout. */
const emittedSkillRoots = (planFirst: boolean) => {
  {
    const program = contributorConfiguredProgram({}, { planFirst });
    return contributorProfiles.flatMap((profile) => {
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
          ].map((file) => ({ path: file, hash: "fnv1a64:0000000000000000" })),
        },
      };
      return lowerToHarness(
        program,
        personalFeedback(),
        program.loadout.authorityEnvelope,
        target,
      ).files.filter((file) => file.path.endsWith("/SKILL.md"));
    });
  }
};
test("WO-276 criterion N7: the reviewer's emitted root states the records step as the registration's, and the executor's root carries the plan-first sentence, naming the registration's value, only where plan-first is elected", () => {
  const roots = emittedSkillRoots;
  const records =
    "Where the registration files records into the target (repositories.<id>.records is target, the value when the key is absent), run npm run resume -- target-records with the actor flags, which files them naming that commit, and commit the moved records' removal; where it keeps them in the instance (records is instance) no records step is owed and the briefing says so.";
  const planFirstSentence =
    "The order's plan-first directory is <evidence root>/WO-NNN/plan-first/: for a target order, under the registered target's documentationRoot where repositories.<id>.records is target (the value when the key is absent) and under this instance's evidence root where it is instance.";
  for (const planFirst of [true, false]) {
    const emitted = roots(planFirst);
    const reviewers = emitted.filter((file) =>
      file.path.endsWith("dotln-reviewer/SKILL.md"),
    );
    const executors = emitted.filter((file) =>
      file.path.endsWith("dotln-executor/SKILL.md"),
    );
    assert.ok(reviewers.length >= 2 && executors.length >= 2);
    for (const root of reviewers) assert.ok(root.contents.includes(records));
    for (const root of executors)
      assert.equal(root.contents.includes(planFirstSentence), planFirst);
    // No other role is told of the records step, and none carries the
    // plan-first sentence.
    for (const root of emitted) {
      if (!reviewers.includes(root))
        assert.ok(!root.contents.includes(records), root.path);
      if (!executors.includes(root))
        assert.ok(!root.contents.includes(planFirstSentence), root.path);
    }
  }
});

test("WO-276 criterion O3: the planner's emitted root, and no other role's, says that a dispatch describing an initiative gets its layout written or revised first and only its next wave filed", () => {
  const sentence =
    "For a dispatch that describes an initiative, write or revise the workstream document's Layout section first (what exists, what is asked, the way there in phases of planned items, and what is unknown) and file only the orders the next wave needs, the ones whose inputs are known; a planned item is a line of the layout, with no identifier and no order file, until a pass files it.";
  const emitted = emittedSkillRoots(false);
  const planners = emitted.filter((file) =>
    file.path.endsWith("dotln-planner/SKILL.md"),
  );
  assert.ok(planners.length >= 2, "both skill directories hold the root");
  for (const root of planners)
    assert.ok(root.contents.includes(sentence), root.path);
  for (const root of emitted)
    if (!planners.includes(root))
      assert.ok(!root.contents.includes("Layout section"), root.path);
});

test("WO-276 criterion P4: the executor's emitted root, and no other role's, carries the stopping rule and the standing file's four parts", () => {
  const sentence =
    "When a prompt's facts say the day's figure is reached, or you stop with the order unfinished, finish the step in hand, write `docs/evidence/WO-NNN/standing.md` and end the turn: the steps of the execution plan done, the step in hand and its state, what comes next, and what is undecided.";
  const emitted = emittedSkillRoots(false);
  const executors = emitted.filter((file) =>
    file.path.endsWith("dotln-executor/SKILL.md"),
  );
  assert.ok(executors.length >= 2, "both skill directories hold the root");
  for (const root of executors) {
    assert.ok(root.contents.includes(sentence), root.path);
    assert.ok(
      root.contents.includes(
        "the phase's completion (`implementation-ready`, or `repair-complete` in a repair) removes it, so it is never committed and never part of the handoff.",
      ),
      root.path,
    );
  }
  for (const root of emitted)
    if (!executors.includes(root))
      assert.ok(!root.contents.includes("standing.md"), root.path);
});

// The records equal the committed rule-by-role table. The table's own script
// derives it from these records and its reason for every cell, and its check
// fails where a record and the committed table differ. The table is an
// order's evidence, which a product case may not read, so this is a document
// case: the document gate runs it and the product suite skips it. Core holds
// the table; a kit carries no evidence and none to check.
test("[document] WO-276 criterion F2: the shared rule records equal the committed rule-by-role table", () => {
  const table = fileURLToPath(
    new URL(
      "../../../../docs/evidence/WO-276/part-f/rule-table.mjs",
      import.meta.url,
    ),
  );
  if (!existsSync(table)) return;
  const checked = spawnSync(process.execPath, [table, "--check"], {
    encoding: "utf8",
  });
  assert.equal(checked.status, 0, `${checked.stdout}${checked.stderr}`);
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
    // A support that rewrites a sentence of the executor's does so only
    // while it is equipped, by the texts its own record names.
    for (const { from, to } of adjacentRepair.semanticsModified) {
      const equipped = ids.includes(adjacentRepair.supportFacetId);
      assert.equal(
        procedure.some((line) => line.includes(from)),
        !equipped,
      );
      assert.equal(
        procedure.some((line) => line.includes(to)),
        equipped,
      );
    }
    assert.equal(holds(procedure, ruleText("operator-controls")), 1);
    // The numbered handoff leads, ahead of the first read of the subject.
    assert.match(procedure[0]!, /^1\. /);
    const firstSubjectRead = procedure.indexOf("Read: `@work-order`");
    assert.ok(firstSubjectRead > 0);
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
    for (const role of target.roles)
      assert.equal(
        holds(role.procedure, ruleText("session-commands")),
        1,
        role.name,
      );
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
      assert.equal(file.contents.split(fragment).length - 1, 1, role.name);
      assert.equal(
        holds(file.contents.split("\n"), ruleText("session-commands")),
        1,
        role.name,
      );
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
    assert.ok(
      contributorProgram([id])
        .roles.find((role) => role.name === "executor")!
        .procedure.includes(text(id)),
    );
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

test("execution roles open with a numbered handoff and keep their shared rules below it", () => {
  const roles = contributorProgram().roles;
  for (const name of ["executor", "verifier", "reviewer"]) {
    const role = roles.find((row) => row.name === name)!;
    const rules = role.procedure.indexOf("Rules:");
    assert.ok(rules > 0, name);
    assert.equal(holds(role.procedure, "Rules:"), 1);
    role.procedure
      .slice(0, rules)
      .forEach((step, index) =>
        assert.ok(step.startsWith(`${index + 1}. `), name),
      );
    for (const rule of sharedRules.filter((row) =>
      (row.roles as readonly string[]).includes(name),
    ))
      assert.ok(
        role.procedure.indexOf(rule.text) > rules,
        `${name}: ${rule.id} stands below the handoff`,
      );
  }
});

test("the verifier and the reviewer are directed to the guide's review section", () => {
  const roles = contributorProgram().roles;
  for (const name of ["verifier", "reviewer"])
    assert.equal(
      holds(
        roles.find((role) => role.name === name)!.procedure,
        "Read: `docs/product/07-execution-guide.md#Verification review and attack`",
      ),
      1,
      name,
    );
});
