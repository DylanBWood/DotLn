// Part M's evidence: the target close's outputs for criterion M1's three
// cases and criterion M2's three, the time of the merged check on the
// fixture and on a longer base (with and without a base commit that edits
// the change's own file), the sign-off outputs of criterion M3 and
// the status of a target order its close settled (criterion M6).
//
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-m/evidence.mjs
//
// It writes close-outputs.txt, signoff.txt, status.txt and results.json
// beside itself. Paths of the fixture and of the host are written as
// <fixture>, <launchpad> and <node>.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG_FILENAME, docPath } from "../../../../scripts/lib/config.mjs";
import { contributionSignoffRules } from "../../../../scripts/lib/contributions.mjs";
import { spawnGit } from "../../../../scripts/lib/git.mjs";
import { write } from "../../../../scripts/lib/helpers.mjs";
import { mergedChange } from "../../../../scripts/lib/merged-change.mjs";
import {
  createFixtureRoot,
  excludeFixtureOwnership,
} from "../../../../scripts/lib/temporary-roots.mjs";
import {
  closeOrder,
  git,
  withFixture,
} from "../../../../scripts/lib/target-worktree-fixture.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const save = (name, text) => writeFileSync(join(here, name), text);

/** The fixture's order with a change of two commits reviewed and closed and
 * its records merged, the target branch not yet on the base. */
const reviewed = (f) => {
  f.mapClone();
  f.start();
  for (const [file, message] of [
    ["change.txt", "test: target change"],
    ["second.txt", "test: second target change"],
  ]) {
    write(f.target, file, "changed\n");
    git(f.target, "add", "-A");
    git(f.target, "-c", "maintenance.auto=false", "commit", "-qm", message);
  }
  closeOrder(f);
  git(f.orderRoot, "add", "-A");
  git(
    f.orderRoot,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: close target order",
  );
  git(f.main, "merge", "-q", "--no-ff", "-m", "Merge records", "wo-999");
  git(f.main, "push", "-q", "origin", "main");
};

/** The change landed on the target's base through a second clone, as a
 * team's repository lands it: the commits it made there. */
const land = (f, how) => {
  const merger = join(f.base, "merger");
  git(
    f.base,
    "-c",
    "maintenance.auto=false",
    "clone",
    "-q",
    join(f.base, "target.git"),
    merger,
  );
  git(merger, "config", "user.email", "fixture@example.invalid");
  git(merger, "config", "user.name", "Fixture");
  git(merger, "fetch", "-q", f.clone, "wo-999");
  const commit = (message) => {
    git(merger, "add", "-A");
    git(merger, "-c", "maintenance.auto=false", "commit", "-qm", message);
    return git(merger, "rev-parse", "HEAD");
  };
  let landed = [];
  if (how === "merge")
    git(
      merger,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge target change",
      "FETCH_HEAD",
    );
  else if (how === "squash" || how === "edited") {
    git(merger, "merge", "-q", "--squash", "FETCH_HEAD");
    if (how === "edited")
      write(merger, "change.txt", "changed, and edited at merge\n");
    landed = [commit("feat: the order's change, squashed")];
  } else if (how === "rebase") {
    const fork = git(merger, "merge-base", "HEAD", "FETCH_HEAD");
    for (const picked of git(
      merger,
      "rev-list",
      "--reverse",
      `${fork}..FETCH_HEAD`,
    ).split("\n")) {
      git(merger, "-c", "maintenance.auto=false", "cherry-pick", picked);
      landed.push(git(merger, "rev-parse", "HEAD"));
    }
  } else {
    write(merger, "elsewhere.txt", "another person's change\n");
    landed = [commit("feat: unrelated")];
  }
  git(merger, "push", "-q", "origin", "main");
  return landed;
};

/** A close's lines without the fixture's and the host's paths. */
const plain = (f, text) =>
  text
    .replaceAll(f.main, "<launchpad>")
    .replaceAll(f.base, "<fixture>")
    .replaceAll(process.execPath, "<node>")
    .replaceAll(tmpdir(), "<tmp>");
/** The lines of a close's print that say what it found of the change. */
const found = (f, result) =>
  plain(f, `${result.stdout}${result.stderr}`)
    .split("\n")
    .filter((line) =>
      /Target change in the base|is not merged into|^WO-999|Target worktree /u.test(
        line,
      ),
    )
    .map((line) => (line.length > 900 ? `${line.slice(0, 900)} […]` : line));

/** One timed call, in milliseconds to two places. */
const timed = (body) => {
  const started = process.hrtime.bigint();
  const value = body();
  return {
    ms: Number((process.hrtime.bigint() - started) / 10_000n) / 100,
    value,
  };
};

test("Part M: the close's outputs, the merged check's times, the sign-off outputs and the settled status", () => {
  const out = [];
  const results = { fixture: {}, longerBase: null };
  const say = (heading, lines) => out.push(`## ${heading}`, "", ...lines, "");

  // Criterion M1: a squash, a rebase and a merge commit.
  for (const how of ["squash", "rebase", "merge"])
    withFixture((f) => {
      reviewed(f);
      land(f, how);
      const preview = f.close("--dry-run");
      assert.equal(preview.status, 0, preview.stderr);
      // The check alone, on the base the dry run fetched, in this process:
      // its first call, before anything is kept.
      const check = timed(() => mergedChange(f.clone, "wo-999", "origin/main"));
      results.fixture[how] = {
        ms: check.ms,
        by: check.value.by,
        baseCommitsRead: check.value.read,
      };
      const published = f.close("--publish");
      assert.equal(published.status, 0, published.stderr);
      say(
        `Criterion M1, ${how}: release close WO-999 --dry-run, then --publish`,
        [...found(f, preview), ...found(f, published)],
      );
    });

  // Criterion M2: a base without the change; a squash edited at merge, named;
  // and a named commit that is not in the base.
  withFixture((f) => {
    reviewed(f);
    land(f, "none");
    const refused = f.close("--publish");
    assert.notEqual(refused.status, 0);
    const check = timed(() => mergedChange(f.clone, "wo-999", "origin/main"));
    results.fixture.none = {
      ms: check.ms,
      by: check.value.by,
      baseCommitsRead: check.value.read,
    };
    say(
      "Criterion M2, a base that does not hold the change: release close WO-999 --publish",
      found(f, refused),
    );
    const tip = git(f.clone, "rev-parse", "wo-999");
    const outside = f.close("--publish", "--merged-as", tip);
    assert.notEqual(outside.status, 0);
    say(
      "Criterion M2, --merged-as naming a commit that is not in the base (the branch's own tip)",
      found(f, outside),
    );
  });
  withFixture((f) => {
    reviewed(f);
    const [edited] = land(f, "edited");
    const refused = f.close("--publish");
    assert.notEqual(refused.status, 0);
    const named = f.close("--publish", "--merged-as", edited);
    assert.equal(named.status, 0, named.stderr);
    say(
      "Criterion M2, a squash edited at merge: refused, then --merged-as naming its commit in the fetched base",
      [...found(f, refused), ...found(f, named)],
    );

    // Criterion M6, on the same closed order: its record as a target that
    // declares a release policy holds it, the target's own release
    // published and then only prepared.
    const receipt = docPath(
      f.main,
      "control",
      "local/retained/WO-999/release-close.json",
    );
    const record = JSON.parse(readFileSync(receipt, "utf8"));
    const status = (label, target, lines) => {
      writeFileSync(
        receipt,
        JSON.stringify({
          ...record,
          publication: {
            ...record.publication,
            outcome: target ? "not-attempted" : "no-release",
            ...(target
              ? {
                  target: {
                    repositoryId: "target",
                    policy: "declared",
                    outcome: target,
                  },
                }
              : {}),
          },
        }),
      );
      const result = spawnSync(
        process.execPath,
        [
          join(f.main, "scripts", "resume.mjs"),
          "status",
          "--json",
          "--work-order",
          "WO-999",
        ],
        { cwd: f.main, env: f.env, encoding: "utf8" },
      );
      assert.equal(result.status, 0, result.stderr);
      const order = JSON.parse(result.stdout);
      assert.equal(order.workOrder, "WO-999");
      lines.push(
        `${label}: phase ${order.phase}; route ${JSON.stringify({ action: order.route?.action ?? null, stop: order.route?.stop ?? null })}`,
      );
    };
    const lines = [
      `The close record as the close wrote it: publication ${record.publication.outcome}; cleanup ${record.cleanup.outcome}, branch ${record.cleanup.branch?.outcome ?? "unrecorded"}; target ${record.targetCleanup.outcome}.`,
    ];
    status("no-release, as written", null, lines);
    status("not-attempted, declared, target published", "published", lines);
    status("not-attempted, declared, target prepared", "prepared", lines);
    save("status.txt", `${lines.join("\n")}\n`);
  });
  save("close-outputs.txt", `${out.join("\n")}`);

  // The check on a longer base: 300 commits since the branch left it, the
  // change squashed after them. Twice: with the change's file untouched by
  // the base, where the landed file is the branch's own, and with one of
  // the 300 commits editing that file at another place, where the exact
  // comparison reads the three versions and merges them.
  for (const [key, bothSides] of [
    ["longerBase", false],
    ["longerBaseChangedOnBothSides", true],
  ]) {
    const root = createFixtureRoot(join(tmpdir(), "dotln-part-m-base-"));
    try {
      const run = (...args) => {
        const result = spawnGit(
          ["-C", root, "-c", "maintenance.auto=false", ...args],
          { encoding: "utf8" },
        );
        assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
        return result.stdout.trim();
      };
      assert.equal(spawnGit(["init", "-q", "-b", "main", root]).status, 0);
      excludeFixtureOwnership(root);
      run("config", "user.email", "fixture@example.invalid");
      run("config", "user.name", "Fixture");
      const body = (at) =>
        Array.from({ length: 40 }, (_, line) => `line ${line} of ${at}`).join(
          "\n",
        );
      const shared = (edits = {}) =>
        `${Array.from(
          { length: 40 },
          (_, line) => edits[line] ?? `line ${line} of the base`,
        ).join("\n")}\n`;
      write(root, "a.txt", bothSides ? shared() : "one\n");
      run("add", "-A");
      run("commit", "-qm", "base");
      run("switch", "-qc", "wo-999");
      write(
        root,
        "a.txt",
        bothSides ? shared({ 3: "line 3 of the change" }) : "one\ntwo\n",
      );
      run("add", "-A");
      run("commit", "-qm", "the change");
      run("switch", "-q", "main");
      for (let at = 0; at < 300; at++) {
        write(root, `others/${at % 25}.txt`, `${body(at)}\n`);
        if (bothSides && at === 150)
          write(root, "a.txt", shared({ 35: "line 35 of another person" }));
        run("add", "-A");
        run("commit", "-qm", `another person's change ${at}`);
      }
      run("merge", "-q", "--squash", "wo-999");
      run("commit", "-qm", "the change, squashed");
      const patchBytes = run(
        "log",
        "-p",
        "--format=",
        `${run("merge-base", "main", "wo-999")}..main`,
      ).length;
      const check = timed(() => mergedChange(root, "wo-999", "main"));
      assert.equal(check.value.by, "squash");
      results[key] = {
        ms: check.ms,
        by: check.value.by,
        baseCommitsRead: check.value.read,
        patchBytes,
      };
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  // Criterion M3: the sign-off rule's own lines.
  {
    const root = createFixtureRoot(join(tmpdir(), "dotln-part-m-authors-"));
    try {
      const one = "Planner One <one@example.invalid>";
      const two = "Teammate Two <two@example.invalid>";
      const three = "Visitor Three <three@example.invalid>";
      const run = (args, author = one) => {
        const [, name, email] = /^(.*) <(.*)>$/u.exec(author);
        const result = spawnGit(
          [
            "-C",
            root,
            "-c",
            "core.hooksPath=/dev/null",
            "-c",
            "commit.gpgsign=false",
            "-c",
            `user.name=${name}`,
            "-c",
            `user.email=${email}`,
            "-c",
            "maintenance.auto=false",
            ...args,
          ],
          { encoding: "utf8" },
        );
        assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
        return result.stdout.trim();
      };
      const commit = (message, author) =>
        run(["commit", "--allow-empty", "-qm", message], author);
      assert.equal(spawnGit(["init", "-q", "-b", "main", root]).status, 0);
      excludeFixtureOwnership(root);
      commit("test: base", one);
      run([
        "update-ref",
        "refs/remotes/origin/main",
        run(["rev-parse", "HEAD"]),
      ]);
      write(
        root,
        CONFIG_FILENAME,
        `${JSON.stringify({ version: 1, contributions: { authors: [one, two] } }, null, 2)}\n`,
      );
      commit("test: by the first listed author", one);
      commit("test: by the second listed author", two);
      commit("test: by an author outside the list", three);
      commit(
        `test: by that author, signed off\n\nSigned-off-by: ${three}\n`,
        three,
      );
      const lines = [
        `contributions.authors: ${JSON.stringify([one, two])}; four commits after the base, by the first listed author, the second, an author outside the list, and that author with a sign-off trailer.`,
        "",
        ...contributionSignoffRules(root).map((rule) => rule.line),
        "",
      ];
      for (const authors of [
        [one, "no identity"],
        [one, one],
        "Planner One <one@example.invalid>",
      ]) {
        write(
          root,
          CONFIG_FILENAME,
          `${JSON.stringify({ version: 1, contributions: { authors } }, null, 2)}\n`,
        );
        let refusal = "loaded";
        try {
          contributionSignoffRules(root);
        } catch (error) {
          refusal = error.message;
        }
        lines.push(
          `contributions.authors ${JSON.stringify(authors)}: ${refusal.replaceAll(root, "<fixture>")}`,
        );
      }
      save("signoff.txt", `${lines.join("\n")}\n`);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
  save("results.json", `${JSON.stringify(results, null, 2)}\n`);
});
