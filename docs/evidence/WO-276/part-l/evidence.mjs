// Part L's evidence: the three briefings of criterion L3 and the two of
// criterion L4 on the target fixture, criterion L2's outputs on a document
// fixture, and the times of the briefing and of the document check before
// and after the part.
//
//   PART_L=before node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-l/evidence.mjs
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-l/evidence.mjs
//
// The first form is run on the tree the part began on and writes before.json
// alone: the two times, on the same fixture, before any note is read. The
// second writes briefings.txt (the lines the part adds to each briefing),
// docs-check.txt (criterion L2) and results.json, which carries before.json's
// figures beside its own.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnGit } from "../../../../scripts/lib/git.mjs";
import { write } from "../../../../scripts/lib/helpers.mjs";
import {
  createFixtureRoot,
  excludeFixtureOwnership,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import {
  actor,
  actorArgs,
  git,
  withFixture,
} from "../../../../scripts/lib/target-worktree-fixture.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const before = process.env.PART_L === "before";
const save = (name, text) => writeFileSync(join(here, name), text);
const note = (title, block) =>
  `# target — ${title}\n\n<!-- dotln-area-note:start -->\n${JSON.stringify(block)}\n<!-- dotln-area-note:end -->\n\nA rule, with the file that shows it.\n`;

/** The launchpad of the target fixture with a profile, `count` area notes
 * beside it and a workstream the order declares, committed before the order
 * starts. The first note covers `billing/`; the others cover paths no commit
 * touches. */
const withNotes = (f, count) => {
  const profile = "records/repositories/target.md";
  f.config.repositories.target.profile = profile;
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  write(f.main, profile, "# target — profile\n");
  for (let index = 0; index < count; index++) {
    const name =
      index === 0 ? "billing" : `area-${String(index).padStart(2, "0")}`;
    write(
      f.main,
      `records/repositories/target/${name}.md`,
      note(name, {
        paths: index === 0 ? ["billing/"] : [`${name}/`, "source.txt"],
        commit: f.baseCommit,
      }),
    );
  }
  write(
    f.main,
    "records/workstreams/WS-001-fixture.md",
    `# WS-001 — fixture: one outcome\n\n## Rules\n\nEvery member keeps the fixture's rule.\n\n<!-- dotln-workstream:start -->\n${JSON.stringify({ id: "WS-001", members: [{ workOrderId: "WO-999", repositoryId: "target" }], edges: [] })}\n<!-- dotln-workstream:end -->\n`,
  );
  write(
    f.main,
    f.order,
    `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n**Workstream:** WS-001\n`,
  );
  git(f.main, "add", "-A");
  git(f.main, "-c", "maintenance.auto=false", "commit", "-qm", "Area notes");
  git(f.main, "push", "-q", "origin", "main");
  f.mapClone();
  f.start();
};

/** Three runs of the briefing command in the fixture, one at a time: wall
 * milliseconds each, and the bytes it printed. */
const timedBriefing = (f) => {
  const ms = [];
  let bytes = 0;
  for (let run = 0; run < 3; run++) {
    const started = performance.now();
    const output = f.ok(f.resume(["briefing"]));
    ms.push(Math.round(performance.now() - started));
    bytes = Buffer.byteLength(output);
  }
  return { ms, bytes };
};

/** Wall seconds of three runs of the document check on this repository. */
const timedDocsCheck = () => {
  const seconds = [];
  let exitCode = null;
  for (let run = 0; run < 3; run++) {
    const started = process.hrtime.bigint();
    exitCode = spawnSync(process.execPath, ["scripts/docs-check.mjs"], {
      cwd: root,
      stdio: "ignore",
    }).status;
    seconds.push(
      Number((process.hrtime.bigint() - started) / 10_000_000n) / 100,
    );
  }
  return {
    seconds,
    exitCode,
    method: "wall seconds of three runs, one at a time",
  };
};

test("Part L: the briefings, the document check's outputs and the two times", () => {
  const timing = {
    briefing: {
      what: "node scripts/resume.mjs briefing for the target fixture's order in its execution phase, with a profile, the notes named and a workstream: wall milliseconds of three runs and the bytes printed",
      twoNotes: withFixture((f) => {
        withNotes(f, 2);
        f.ok(f.resume(["next"]));
        return timedBriefing(f);
      }),
      twentyNotes: withFixture((f) => {
        withNotes(f, 20);
        f.ok(f.resume(["next"]));
        return timedBriefing(f);
      }),
    },
    docsCheck: timedDocsCheck(),
  };
  if (before) {
    save("before.json", `${JSON.stringify(timing, null, 2)}\n`);
    return;
  }

  // Criteria L3 and L4: the lines the part adds to each briefing.
  const sections = [];
  withFixture((f) => {
    withNotes(f, 2);
    const plain = (text) =>
      text
        .replaceAll(f.orderRoot, "<instance>")
        .replaceAll(f.base, "<fixture>");
    const added = (label, briefing) => {
      const lines = briefing
        .split("\n")
        .filter((line) =>
          /^(?:Repo-native authority includes |Area notes of |- .*\/repositories\/target\/|This order is a member of workstream )/u.test(
            line,
          ),
        )
        .map((line) =>
          line.startsWith("Repo-native authority includes ")
            ? `${line.slice(0, line.indexOf(". ") + 1)} […]`
            : line,
        );
      assert.ok(lines.length >= 4, briefing);
      sections.push(`## ${label}`, plain(lines.join("\n")), "");
    };
    added(
      "Criterion L3: the execution briefing (resume next)",
      f.ok(f.resume(["next"])),
    );
    f.ok(
      f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]),
    );
    f.ok(f.resume(["implementation-ready", ...actorArgs]));
    added(
      "Criterion L3: the verification briefing (resume verify)",
      f.ok(f.resume(["verify"])),
    );
    write(
      f.orderRoot,
      "records/verifications/WO-999/VER-001.md",
      `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
    );
    f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
    added(
      "Criterion L3: the final-review briefing (resume final-review)",
      f.ok(f.resume(["final-review"])),
    );
    for (const number of [1, 2]) {
      write(f.clone, `billing/invoice-${number}.txt`, "an invoice\n");
      git(f.clone, "add", "-A");
      git(
        f.clone,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        `feat: invoice ${number}`,
      );
    }
    added(
      "Criterion L4: after two commits in the registered clone touch billing/",
      f.ok(f.resume(["briefing"])),
    );
    write(
      f.orderRoot,
      "records/repositories/target/absent.md",
      note("absent", { paths: ["absent/"], commit: "f".repeat(40) }),
    );
    added(
      "Criterion L4: with a note written at a commit the clone does not hold",
      f.ok(f.resume(["briefing"])),
    );
  });
  save(
    "briefings.txt",
    [
      "# The lines Part L adds to a target order's briefing, in the target fixture (scripts/lib/target-worktree-fixture.mjs) with a profile, two area notes and a workstream the order declares. The first line of each is cut after its first sentence.",
      "",
      ...sections,
    ].join("\n"),
  );

  // Criterion L2: the document check on a fixture with two registered
  // profiles, one with a directory of notes and one without.
  const fixture = createFixtureRoot(join(tmpdir(), "dotln-part-l-docs-"));
  const outputs = [];
  try {
    assert.equal(spawnGit(["init", "-q", fixture]).status, 0);
    excludeFixtureOwnership(fixture);
    const registration = (profile) => ({
      baseBranch: "main",
      worktreeParent: "../Targets",
      repositoryClass: "fixture",
      authorityProfile: {
        authorityEnvelopeId: "fixture.target",
        allowedEffects: ["repo.read"],
        deniedEffects: [],
        resourceLimits: {},
        requiredEvidence: [],
        expiresAt: Number.MAX_SAFE_INTEGER,
        revocationEventTypes: [],
      },
      profile,
    });
    write(
      fixture,
      "dotln.config.json",
      JSON.stringify({
        version: 1,
        classes: { fixture: { checks: [], supports: [] } },
        repositories: {
          noted: registration("docs/repositories/noted.md"),
          plain: registration("docs/repositories/plain.md"),
        },
      }),
    );
    write(
      fixture,
      "docs/control/doc-baseline.json",
      JSON.stringify({
        schemaVersion: 1,
        products: {},
        dispatches: {},
        links: [],
      }),
    );
    write(fixture, "docs/product/00-fixture.md", "# Product\n\nA fact.\n");
    write(fixture, "docs/repositories/noted.md", "# noted — profile\n");
    write(fixture, "docs/repositories/plain.md", "# plain — profile\n");
    const check = (label, block) => {
      if (block !== undefined)
        write(
          fixture,
          "docs/repositories/noted/billing.md",
          note("billing", block),
        );
      const result = spawnSync(
        process.execPath,
        [join(root, "scripts/docs-check.mjs")],
        {
          cwd: fixture,
          env: { ...process.env, DOTLN_LAUNCHPAD: fixture },
          encoding: "utf8",
        },
      );
      const failures = result.stderr
        .split("\n")
        .filter((line) => line.startsWith("FAIL "));
      outputs.push(`## ${label}: exit ${result.status}`, ...failures, "");
      return result.status;
    };
    const commit = "a".repeat(40);
    assert.equal(
      check(
        "A profile with a directory that holds no note, and a profile with no directory",
      ),
      0,
    );
    assert.equal(
      check("A note whose block lists paths and a commit", {
        paths: ["billing/"],
        commit,
      }),
      0,
    );
    assert.equal(
      check("A note whose block lacks the commit", { paths: ["billing/"] }),
      1,
    );
    assert.equal(check("A note whose block lacks the paths", { commit }), 1);
    assert.equal(
      check("A note whose list of paths is empty", { paths: [], commit }),
      1,
    );
  } finally {
    removeTemporaryPath(fixture, { recursive: true, force: true });
  }
  save(
    "docs-check.txt",
    [
      "# node scripts/docs-check.mjs in a document fixture that registers two repositories, noted (docs/repositories/noted.md, with docs/repositories/noted/billing.md beside it) and plain (docs/repositories/plain.md, no directory). The FAIL lines are the command's own.",
      "",
      ...outputs,
    ].join("\n"),
  );

  const earlier = existsSync(join(here, "before.json"))
    ? JSON.parse(readFileSync(join(here, "before.json"), "utf8"))
    : null;
  save(
    "results.json",
    `${JSON.stringify(
      {
        what: "Part L's observations: the times of a target order's briefing and of the document check before and after the part, on this host.",
        command:
          "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-l/evidence.mjs (before.json: the same with PART_L=before, on the tree the part began on)",
        before: earlier,
        after: timing,
      },
      null,
      2,
    )}\n`,
  );
});
