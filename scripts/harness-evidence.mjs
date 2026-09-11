import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkHarness, harnessInstallation } from "./lib/harness.mjs";
import {
  compareObservedReads,
  scopeReadEvidence,
} from "./lib/harness-context.mjs";
import {
  checkContextMeasurement,
  measureHarnessContext,
  roles,
} from "./harness-context.mjs";
import { termsCheck } from "./terms.mjs";
import { measureColdStarts, requireBudgets } from "./lib/process-budget.mjs";

export const writerScenarios = ["foreign-dead", "foreign-live"];

export function checkHarnessEvidence(root) {
  const installed = checkHarness(root);
  const expected = harnessInstallation();
  const coldStart = measureColdStarts(root);
  requireBudgets(
    coldStart.profiles.map((row) => ({ ...row, value: row.bytes })),
  );
  // WO-042's immutable live episodes prove their recorded edition. Later source
  // changes cannot rewrite those observations into a new live run. Current
  // output, runtime replacement and guards are exercised by the full fixtures.
  const historical = JSON.parse(
    execFileSync("git", ["show", "v0.16.0:.claude/harness-manifest.json"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    }),
  );
  const context = JSON.parse(
    readFileSync(
      join(root, "docs/evidence/WO-042/harness-context.json"),
      "utf8",
    ),
  );
  const directory = "docs/evidence/WO-042/harness-live";
  const entries = readdirSync(join(root, directory));
  const names = entries
    .filter((name) =>
      /^(?:executor|verifier|reviewer|release-close)-\d{3}\.json$/.test(name),
    )
    .sort();
  const writerNames = entries
    .filter((name) =>
      /^writer-(?:foreign-dead|foreign-live)-\d{3}\.json$/.test(name),
    )
    .sort();
  const current = (record, label) => {
    assert.ok(
      record.passed && record.exitCode === 0 && !record.timedOut,
      `${label}: latest live smoke failed`,
    );
    assert.deepEqual(
      record.runtime,
      historical.profiles[0].profile.runtime,
      `${label}: live runtime drift`,
    );
    assert.deepEqual(
      record.loadout,
      historical.profiles[0].loadout,
      `${label}: live build drift`,
    );
    assert.deepEqual(
      record.emittedFiles,
      historical.installed,
      `${label}: live emitted files drift`,
    );
    assert.equal(record.harnessVersion, "2.1.263 (Claude Code)");
    assert.equal(record.rawTranscriptRetained, false);
    assert.equal(record.userScopeSettingsWritten, false);
  };
  const selected = [];
  for (const role of roles) {
    const path = `${directory}/${names.filter((name) => name.startsWith(`${role}-`)).at(-1)}`;
    const record = JSON.parse(readFileSync(join(root, path), "utf8"));
    current(record, role);
    assert.ok(
      record.roleSkillResolved &&
        record.deniedEffectRefused &&
        record.fixtureCommitDidNotExecute &&
        record.observerFinished,
      `${role}: live obligations incomplete`,
    );
    assert.deepEqual(
      {
        required: record.requiredDeniedEffect,
        refused: record.requiredDeniedEffectRefused,
      },
      { required: "attribution", refused: true },
      `${role}: required denied effect not witnessed`,
    );
    const directed = context.profiles
      .find((row) => row.role === role && row.skillsRoot === ".claude/skills")
      .after.files.map(({ path, startLine, endLine }) => ({
        path,
        startLine,
        endLine,
      }));
    assert.deepEqual(
      record.directedReads.map(({ path, startLine, endLine }) => ({
        path,
        startLine,
        endLine,
      })),
      directed,
      `${role}: directed-set drift`,
    );
    assert.deepEqual(
      record.actualReads,
      record.observations.flatMap((row) => row.reads ?? []),
      `${role}: observation projection drift`,
    );
    assert.deepEqual(
      compareObservedReads(directed, record.actualReads),
      [],
      `${role}: observed read outside directed set`,
    );
    assert.deepEqual(record.outsideDirectedSet, []);
    assert.equal(
      record.readScopeMode,
      "observe",
      `${role}: Read comparison requires observation without scope enforcement`,
    );
    assert.deepEqual(
      record.readScope,
      scopeReadEvidence(directed, record.observations),
      `${role}: read refusal projection drift`,
    );
    assert.equal(
      record.readScope.unlocatedReadRefusals,
      0,
      `${role}: refused read path unavailable`,
    );
    assert.deepEqual(
      record.readScope.attemptedOutsideDirectedSet,
      [],
      `${role}: attempted read outside directed set`,
    );
    assert.ok(
      record.correction.reachedThroughRoleSkill &&
        !record.correction.tokenConfirmed,
    );
    assert.ok(
      record.effectiveEffort.includes("xhigh") &&
        record.observedModels.includes(record.actor.model),
    );
    assert.equal(
      record.writerReservation?.finalReservation,
      "released",
      `${role}: the session's writer reservation was not released at its accepted finish`,
    );
    selected.push({
      role,
      path,
      actualReads: record.actualReads.length,
      refusalCounts: record.readScope.refusalCounts,
    });
  }
  // The writer-reservation scenarios prove the reclaim and refusal paths under
  // the real harness, where hooks fire; unit fixtures alone cannot show that.
  const writers = [];
  for (const scenario of writerScenarios) {
    const latest = writerNames
      .filter((name) => name.startsWith(`writer-${scenario}-`))
      .at(-1);
    assert.ok(
      latest,
      `${scenario}: live writer-reservation smoke missing; run DOTLN_LIVE_HARNESS=1 node scripts/harness-live-suite.mjs`,
    );
    const path = `${directory}/${latest}`;
    const record = JSON.parse(readFileSync(join(root, path), "utf8"));
    current(record, scenario);
    // The live-holder scenario's required denied effect is the writer guard's
    // refusal; the attribution refusal stays required wherever the session may write.
    assert.deepEqual(
      {
        required: record.requiredDeniedEffect,
        refused: record.requiredDeniedEffectRefused,
      },
      {
        required:
          scenario === "foreign-live" ? "writer-isolation" : "attribution",
        refused: true,
      },
      `${scenario}: required denied effect not witnessed`,
    );
    const reservation = record.writerReservation;
    assert.equal(reservation?.scenario, scenario);
    if (scenario === "foreign-dead")
      assert.ok(
        reservation.reclaimed.length === 1 &&
          reservation.reclaimed[0].ownerPid === reservation.seededOwnerPid &&
          reservation.refusedWriteDispatches === 0 &&
          reservation.finalReservation === "released",
        `${scenario}: the dead owner's reservation was not reclaimed and released`,
      );
    else
      assert.ok(
        reservation.reclaimed.length === 0 &&
          reservation.refusedWriteDispatches > 0 &&
          reservation.holderNamedInRefusal &&
          reservation.finalReservation === "foreign",
        `${scenario}: the live owner's reservation was not honoured with a named refusal`,
      );
    writers.push({ scenario, path, ownerSources: reservation.ownerSources });
  }
  const discovery = [
    "docs/discovery/harness-smoke-2026-09-07.md",
    "docs/discovery/harness-smoke-2026-09-07.json",
    ...["claude", "claude-bare", "codex"].map(
      (profile) => `docs/discovery/harness-smoke-2026-09-07/${profile}.json`,
    ),
  ];
  const surfaces = [
    ...expected.files.map((file) => file.path),
    ".claude/harness-manifest.json",
    ...discovery,
    ...names.map((name) => `${directory}/${name}`),
    ...writerNames.map((name) => `${directory}/${name}`),
    "docs/evidence/WO-042/harness-context.json",
  ];
  const localTerms = termsCheck(root, surfaces);
  return {
    liveEdition:
      "v0.16.0 / WO-042 (historical; no claim of a current live run)",
    installedSurfaces: installed.files,
    roles: selected,
    writers,
    localTerms,
    checkedSurfaces: surfaces.length,
  };
}
if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = checkHarnessEvidence(
    fileURLToPath(new URL("../", import.meta.url)),
  );
  console.log(
    `Harness evidence: ${result.roles.length} historical live role smokes and ${result.writers.length} historical writer smokes at ${result.liveEdition}; ${result.installedSurfaces} current generated surfaces; local-terms list: ${result.localTerms.status} (${result.checkedSurfaces} surfaces checked).`,
  );
}
