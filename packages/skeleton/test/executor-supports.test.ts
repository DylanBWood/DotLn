import test from "node:test";
import assert from "node:assert/strict";
import {
  compileEditableView,
  defineLoadout,
  functionTableFromLoadout,
  lowerToHarness,
  semanticHash,
  statechartJsonFromLoadout,
} from "@dotln/compiler";
import {
  contributorConfiguredProgram,
  defaultContributorSupportIds,
  contributorLoadout,
  contributorProfiles,
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

test("WO-042 atomic support switches compose independently and removal restores the saved build", () => {
  const hashes = new Set<string>();
  for (const ids of combinations) {
    const graph = contributorWithSupports(ids);
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
    assert.ok(procedure[0]!.includes("read-only command"));
    assert.ok(procedure[0]!.includes("stop"));
    const firstSubjectRead = procedure.indexOf("Read: `@work-order`");
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
      const roundTrip = compileEditableView(view, environment);
      assert.equal(roundTrip.ok, true);
      assert.equal(roundTrip.semanticHash, hash);
    }
    assert.equal(
      semanticHash(contributorProgram([...ids].reverse()).loadout),
      hash,
    );
  }
  assert.equal(hashes.size, combinations.length);
  assert.equal(
    semanticHash(contributorProgram([]).loadout),
    "fnv1a64:06245f5c581212f1",
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
    "fnv1a64:06245f5c581212f1",
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
