import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";
import { execGit } from "./lib/git.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { absoluteBodyLinks, relativeLinkFailures } from "./lib/github-body.mjs";
import { writingGuidance } from "./lib/reader-profiles.mjs";
import { seedReaderProfiles } from "./test-reader-fixture.mjs";

import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  applyReleasePreparation,
  decisionsConflicted,
  integrationPreparationRefusal,
  planReleasePreparation,
} from "./lib/release-preparation.mjs";

const decisionsPath = "docs/evidence/WO-099/decisions.md";
test("release preparation guidance gives the release-note profile without editing the draft", (t) => {
  const f = fixture();
  t.after(f.dispose);
  const root = f.root;
  seedReaderProfiles(root);
  const example = join(
    root,
    "docs/publication/examples/releaseNotes/balanced.md",
  );
  const before = readFileSync(example, "utf8");
  const guidance = writingGuidance("releaseNotes", root);
  assert.match(guidance, /Reader profile \(releaseNotes\):/);
  assert.match(guidance, /neither refuses nor rewrites text/);
  assert.match(
    guidance,
    /Document kind: record. Reader: a user assessing a release before adoption/,
  );
  assert.doesNotMatch(guidance, /Best comparable:|smallest|shorten/);
  assert.equal(readFileSync(example, "utf8"), before);
});
const readmeWith = (blockLine, leading = "") =>
  `# Fixture\n\n<!-- DOTLN-RELEASE-BEGIN -->\n${leading}${blockLine}\n<!-- DOTLN-RELEASE-END -->\n\nHistorical v0.1.0 stays.\n`;
const generatedReadme = (version) =>
  readmeWith(`This source prepares DotLn \`${version}\`.`);
const decisionsIn = (text) =>
  [...text.matchAll(/^```json\n([\s\S]*?)^```/gm)].map((match) =>
    JSON.parse(match[1]),
  );

function fixture({
  phase = "final-review",
  classification = "patch",
  target = "v0.13.2",
  claim = target,
} = {}) {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-release-preparation-")),
  );
  execGit(["init", "--quiet", "-b", "wo-099", root], {
    stdio: "pipe",
  });
  excludeFixtureOwnership(root);
  const authorityPath = "docs/work-orders/WO-099-fixture.md";
  const title = target
    ? `# WO-099 — fixture (${target})`
    : "# WO-099 — fixture (version assigned at activation)";
  const sources = {
    [authorityPath]: `${title}\n\n**Release classification:** ${classification}. Existing scope.\n\n**Objective:** Keep this exact paragraph.\n`,
    // The block as a hand left it: a blank line and older wording around the
    // claim. Preparation rewrites it as the one generated line.
    "README.md": readmeWith(`This source prepares \`${claim}\`.`, "\n"),
    // A product document the preparation must never touch (WO-086).
    "docs/product/06-roadmap.md": `# Roadmap\n\n## Release boundary\n\nGenerated table stands here.\n\n## Later work\n\nKeep this section.\n`,
    "docs/control/orders/WO-099.jsonl": "fixture control bytes\n",
    "docs/control/orders/WO-100.jsonl": "other order: implementing\n",
    "docs/control/orders/WO-101.jsonl": "third order: verifying\n",
    "docs/verifications/WO-099/VER-001.md":
      "Immutable historical verification.\n",
    "packages/skeleton/package.json": '{"version":"0.12.1"}\n',
  };
  for (const [path, source] of Object.entries(sources)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), source);
  }
  const state = { phase, workOrderId: "WO-099", workOrderPath: authorityPath };
  const snapshot = () =>
    Object.fromEntries(
      [...Object.keys(sources), decisionsPath]
        .filter((path) => existsSync(join(root, path)))
        .map((path) => [path, readFileSync(join(root, path), "utf8")]),
    );
  return {
    root,
    state,
    sources,
    snapshot,
    plan: (latest = "v0.13.2", options) =>
      planReleasePreparation(root, state, latest, "2026-09-07", options),
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}

const git = (root, ...args) =>
  execGit(
    [
      "-C",
      root,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      ...args,
    ],
    { stdio: "pipe" },
  );

test("release preparation carries configured names through normalization, renaming and collision retiming", (t) => {
  const f = fixture();
  t.after(f.dispose);
  const configure = (displayName) =>
    writeFileSync(
      join(f.root, "dotln.config.json"),
      JSON.stringify({ version: 1, release: { displayName } }) + "\n",
    );
  configure("Example 🚀");
  const current = f.plan("v0.13.1");
  assert.equal(current.target, "v0.13.2");
  assert.equal(current.decision, null);
  applyReleasePreparation(current);
  assert.equal(
    readFileSync(join(f.root, "README.md"), "utf8"),
    readmeWith("This source prepares Example 🚀 `v0.13.2`."),
  );
  assert.equal(existsSync(join(f.root, decisionsPath)), false);
  configure("Renamed Starter");
  applyReleasePreparation(f.plan("v0.13.1"));
  assert.equal(
    readFileSync(join(f.root, "README.md"), "utf8"),
    readmeWith("This source prepares Renamed Starter `v0.13.2`."),
  );
  assert.equal(
    readFileSync(join(f.root, f.state.workOrderPath), "utf8"),
    f.sources[f.state.workOrderPath],
  );
  const collided = f.plan("v0.13.2");
  assert.equal(collided.target, "v0.13.3");
  applyReleasePreparation(collided);
  assert.equal(
    readFileSync(join(f.root, "README.md"), "utf8"),
    readmeWith("This source prepares Renamed Starter `v0.13.3`."),
  );
  const decisions = readFileSync(join(f.root, decisionsPath), "utf8");
  assert.equal(decisionsIn(decisions).length, 1);
  assert.deepEqual(applyReleasePreparation(f.plan("v0.13.2")), []);
  assert.equal(readFileSync(join(f.root, decisionsPath), "utf8"), decisions);
});

test("release preparation records a collision once, as the order's decision, and touches no product document", () => {
  const f = fixture();
  try {
    const plan = f.plan();
    assert.equal(plan.target, "v0.13.3");
    assert.equal(plan.decision, "WO-099-D001");
    assert.deepEqual(f.snapshot(), f.sources, "planning must not write");
    assert.deepEqual(
      applyReleasePreparation(plan),
      plan.edits.map((edit) => edit.path),
    );
    const after = f.snapshot();
    assert.equal(
      after[f.state.workOrderPath],
      f.sources[f.state.workOrderPath].replace("v0.13.2", "v0.13.3"),
    );
    assert.equal(after["README.md"], generatedReadme("v0.13.3"));
    for (const path of Object.keys(f.sources).slice(2))
      assert.equal(after[path], f.sources[path], path);
    const [decision, ...others] = decisionsIn(after[decisionsPath]);
    assert.deepEqual(others, []);
    assert.equal(decision.id, "WO-099-D001");
    assert.equal(decision.dispatch, "resume: final review; release prepare");
    assert.match(
      decision.decision,
      /^Retime unpublished application target v0\.13\.2 to v0\.13\.3, the next patch above the observed release baseline v0\.13\.2,/,
    );
    assert.deepEqual(decision.evidence, [
      "release baseline v0.13.2 (ancestral local release tags, excluding annotated starter refresh tags)",
      "superseded target v0.13.2",
      "new target v0.13.3",
    ]);
    assert.doesNotMatch(after[decisionsPath], /retiming \(/);
    assert.deepEqual(f.plan().edits, [], "the retimed target is current");
    applyReleasePreparation(f.plan());
    assert.deepEqual(f.snapshot(), after);
  } finally {
    f.dispose();
  }
});

test("release preparation appends the next decision id after existing entries", () => {
  const f = fixture();
  try {
    const existing =
      '# WO-099 decisions\n\n## WO-099-D002\n\n```json\n{"id":"WO-099-D002"}\n```\n\nSee WO-099-D007 prose.\n';
    mkdirSync(dirname(join(f.root, decisionsPath)), { recursive: true });
    writeFileSync(join(f.root, decisionsPath), existing);
    const plan = f.plan();
    assert.equal(plan.decision, "WO-099-D008");
    applyReleasePreparation(plan);
    const text = readFileSync(join(f.root, decisionsPath), "utf8");
    assert.ok(text.startsWith(existing.trimEnd()), "existing bytes kept");
    assert.deepEqual(
      decisionsIn(text).map(({ id }) => id),
      ["WO-099-D002", "WO-099-D008"],
    );
  } finally {
    f.dispose();
  }
});

test("under --integration a collision leaves its record to the integration decision", () => {
  const f = fixture();
  try {
    const plan = f.plan("v0.13.2", { integration: true });
    assert.equal(plan.target, "v0.13.3");
    assert.equal(plan.decision, null);
    assert.deepEqual(
      plan.edits.map((edit) => edit.path),
      [join(f.root, f.state.workOrderPath), join(f.root, "README.md")],
    );
    applyReleasePreparation(plan);
    assert.equal(existsSync(join(f.root, decisionsPath)), false);
  } finally {
    f.dispose();
  }
});

test("a conflicted decisions record refuses with its path and writes nothing", () => {
  for (const integration of [false, true]) {
    // Conflict markers left in an otherwise staged resolution.
    const marked = fixture();
    try {
      mkdirSync(dirname(join(marked.root, decisionsPath)), { recursive: true });
      writeFileSync(
        join(marked.root, decisionsPath),
        "# WO-099 decisions\n\n<<<<<<< ours\nmine\n=======\ntheirs\n>>>>>>> upstream\n",
      );
      git(marked.root, "add", "--", decisionsPath);
      const before = marked.snapshot();
      assert.throws(
        () => marked.plan("v0.13.2", { integration }),
        new RegExp(
          `${decisionsPath.replaceAll("/", "\\/")} has an authored conflict; resolve it, stage it with git add -- ${decisionsPath.replaceAll("/", "\\/")}, then rerun ${integration ? "npm run worktree -- integrate WO-099 --continue" : "npm run release -- prepare"}\\. Nothing was written\\.`,
        ),
      );
      assert.deepEqual(marked.snapshot(), before);
      // The meter reads the record in every mode, so a current target refuses
      // the conflicted record too.
      assert.throws(
        () => marked.plan("v0.13.1", { integration }),
        /decisions\.md has an authored conflict/,
      );
      assert.deepEqual(marked.snapshot(), before);
    } finally {
      marked.dispose();
    }
    // A path Git still reports unmerged, whatever its working bytes.
    const merged = fixture();
    try {
      const path = join(merged.root, decisionsPath);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, "# WO-099 decisions\n\nbase\n");
      git(merged.root, "add", "-A");
      git(merged.root, "-c", "maintenance.auto=false", "commit", "-qm", "base");
      git(merged.root, "switch", "-qc", "upstream");
      writeFileSync(path, "# WO-099 decisions\n\nupstream\n");
      git(
        merged.root,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qam",
        "upstream",
      );
      git(merged.root, "switch", "-q", "wo-099");
      writeFileSync(path, "# WO-099 decisions\n\nsubject\n");
      git(
        merged.root,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qam",
        "subject",
      );
      assert.throws(() => git(merged.root, "merge", "-q", "upstream"));
      writeFileSync(path, "# WO-099 decisions\n\nhand-resolved, not staged\n");
      const before = merged.snapshot();
      assert.throws(
        () => merged.plan("v0.13.2", { integration }),
        /docs\/evidence\/WO-099\/decisions\.md has an authored conflict/,
      );
      assert.deepEqual(merged.snapshot(), before);
    } finally {
      merged.dispose();
    }
  }
});

test("a placeholder heading is assigned the next version and its decision keeps the base", () => {
  const f = fixture({ target: null, claim: "v0.13.1", phase: "active" });
  try {
    const plan = f.plan();
    assert.equal(plan.assigned, true);
    assert.equal(plan.target, "v0.13.3");
    applyReleasePreparation(plan);
    const after = f.snapshot();
    assert.equal(
      after[f.state.workOrderPath].split("\n", 1)[0],
      "# WO-099 — fixture (v0.13.3)",
    );
    assert.equal(after["README.md"], generatedReadme("v0.13.3"));
    const [decision] = decisionsIn(after[decisionsPath]);
    assert.equal(decision.dispatch, "resume: next; release prepare");
    assert.match(
      decision.decision,
      /^Assign application target v0\.13\.3, the next patch above the observed release baseline v0\.13\.2,/,
    );
    assert.deepEqual(decision.evidence, [
      "release baseline v0.13.2 (ancestral local release tags, excluding annotated starter refresh tags)",
      "patch classification declared in docs/work-orders/WO-099-fixture.md",
    ]);
    for (const path of Object.keys(f.sources).slice(2))
      assert.equal(after[path], f.sources[path], path);
    assert.deepEqual(f.plan().edits, [], "an assigned target is current");
  } finally {
    f.dispose();
  }
  const bare = fixture({ target: null, claim: "v0.13.1", phase: "active" });
  try {
    assert.throws(
      () =>
        planReleasePreparation(bare.root, bare.state, undefined, "2026-09-07"),
      /cannot assign a target without an observed release tag/,
    );
    writeFileSync(
      join(bare.root, "README.md"),
      "<!-- DOTLN-RELEASE-BEGIN -->\nNo claim yet.\n<!-- DOTLN-RELEASE-END -->\n",
    );
    const before = bare.snapshot();
    assert.throws(() => bare.plan(), /one README version claim to replace/);
    assert.deepEqual(bare.snapshot(), before);
  } finally {
    bare.dispose();
  }
});

test("a kit front page without markers stays untouched through assignment, retiming and a no-op", (t) => {
  const f = fixture({ target: null, phase: "active" });
  t.after(f.dispose);
  writeFileSync(join(f.root, "KIT-MANIFEST.json"), "{}\n");
  const page =
    "# Our project\n\nOur introduction, with historical v0.1.0 text.\n";
  writeFileSync(join(f.root, "README.md"), page);
  for (const [latest, target] of [
    ["v0.13.2", "v0.13.3"],
    ["v0.13.3", "v0.13.4"],
  ]) {
    const plan = f.plan(latest);
    assert.equal(plan.target, target);
    assert.ok(
      !plan.edits.some(({ path }) => path === join(f.root, "README.md")),
    );
    applyReleasePreparation(plan);
    assert.equal(readFileSync(join(f.root, "README.md"), "utf8"), page);
    assert.match(
      readFileSync(join(f.root, f.state.workOrderPath), "utf8").split("\n")[0],
      new RegExp(target.replaceAll(".", "\\.")),
    );
    const decision = decisionsIn(
      readFileSync(join(f.root, decisionsPath), "utf8"),
    ).at(-1);
    assert.equal(decision.readmeClaim, "not carried");
    assert.match(decision.decision, /README claim not carried/);
    assert.deepEqual(f.plan(latest).edits, []);
  }
  // A manifest in a source checkout does not waive core's block requirement.
  writeFileSync(join(f.root, "packages/skeleton/tsconfig.json"), "{}\n");
  assert.throws(() => f.plan(), /one exact ordered README release block/);
});

test("WO-245-D010: the no-observed-tag remedy names only the heading for a kit root whose README carries no release block, and the README claim where the block is carried or required", (t) => {
  const kitRoot = fixture({ target: null, claim: "v0.13.1", phase: "active" });
  t.after(kitRoot.dispose);
  writeFileSync(join(kitRoot.root, "KIT-MANIFEST.json"), "{}\n");
  writeFileSync(join(kitRoot.root, "README.md"), "# Our project\n");
  assert.throws(
    () =>
      planReleasePreparation(
        kitRoot.root,
        kitRoot.state,
        undefined,
        "2026-09-07",
      ),
    /^Error: release prepare cannot assign a target without an observed release tag; assign the heading by hand \(this kit root's README carries no release block, so it holds no claim to assign\)$/u,
  );
  // With the block carried, or outside a kit root, the claim is the owner's.
  writeFileSync(
    join(kitRoot.root, "README.md"),
    readmeWith("This source prepares `v0.13.1`."),
  );
  assert.throws(
    () =>
      planReleasePreparation(
        kitRoot.root,
        kitRoot.state,
        undefined,
        "2026-09-07",
      ),
    /^Error: release prepare cannot assign a target without an observed release tag; assign the heading and README claim by hand$/u,
  );
  const launchpad = fixture({
    target: null,
    claim: "v0.13.1",
    phase: "active",
  });
  t.after(launchpad.dispose);
  writeFileSync(join(launchpad.root, "README.md"), "# Our project\n");
  assert.throws(
    () =>
      planReleasePreparation(
        launchpad.root,
        launchpad.state,
        undefined,
        "2026-09-07",
      ),
    /release block/u,
    "a launchpad's README always carries the block",
  );
});

test("kit roots retain every release-marker refusal", (t) => {
  const f = fixture();
  t.after(f.dispose);
  writeFileSync(join(f.root, "KIT-MANIFEST.json"), "{}\n");
  for (const page of [
    "<!-- DOTLN-RELEASE-BEGIN -->\n",
    "<!-- DOTLN-RELEASE-END -->\n",
    "<!-- DOTLN-RELEASE-BEGIN --> \n",
    generatedReadme("v0.13.2") + generatedReadme("v0.13.2"),
    readmeWith("This source prepares DotLn `v0.13.2`.\nOwner prose."),
  ]) {
    writeFileSync(join(f.root, "README.md"), page);
    const before = f.snapshot();
    assert.throws(() => f.plan(), /README release block/);
    assert.deepEqual(f.snapshot(), before);
  }
});

test("the release block becomes the one generated line, and prose beside or below the claim refuses before any write", () => {
  for (const block of [
    "This source prepares `v0.13.2`.\nA sentence an order appended.",
    "This source prepares `v0.13.2`. Keep the reviewed description.",
    "This source prepares DotLn `v0.13.2`, and now also compiles tables.",
  ]) {
    const prose = fixture();
    try {
      writeFileSync(join(prose.root, "README.md"), readmeWith(block));
      const before = prose.snapshot();
      assert.throws(
        () => prose.plan(),
        /release block to hold only its version line; move other text out of the block/,
        block,
      );
      assert.deepEqual(prose.snapshot(), before);
    } finally {
      prose.dispose();
    }
  }
  const generated = fixture();
  try {
    writeFileSync(
      join(generated.root, "README.md"),
      generatedReadme("v0.13.2"),
    );
    applyReleasePreparation(generated.plan());
    assert.equal(generated.snapshot()["README.md"], generatedReadme("v0.13.3"));
    assert.deepEqual(generated.plan().edits, []);
  } finally {
    generated.dispose();
  }
});

test("release preparation follows the existing classification and skips an available target", () => {
  for (const [classification, target] of [
    ["minor", "v0.14.0"],
    ["major", "v1.0.0"],
  ]) {
    const f = fixture({ classification });
    try {
      assert.equal(f.plan().target, target);
    } finally {
      f.dispose();
    }
  }
  // A current target is not retimed, but the block a hand left with older
  // wording and a blank line is still rewritten as the one generated line,
  // with no heading edit and no decision; the generated line itself is a
  // no-op, with or without an observed tag.
  const f = fixture({ target: "v0.15.0" });
  try {
    for (const plan of [
      f.plan(),
      planReleasePreparation(f.root, f.state, undefined, "2026-09-07"),
    ]) {
      assert.equal(plan.target, "v0.15.0");
      assert.equal(plan.decision, null);
      assert.deepEqual(
        plan.edits.map((edit) => edit.path),
        [join(f.root, "README.md")],
      );
      assert.equal(plan.edits[0].after, generatedReadme("v0.15.0"));
    }
    applyReleasePreparation(f.plan());
    assert.equal(f.snapshot()["README.md"], generatedReadme("v0.15.0"));
    for (const path of Object.keys(f.sources).filter((p) => p !== "README.md"))
      assert.equal(f.snapshot()[path], f.sources[path], path);
    assert.deepEqual(f.plan().edits, []);
    assert.deepEqual(
      planReleasePreparation(f.root, f.state, undefined, "2026-09-07").edits,
      [],
    );
    assert.ok(!existsSync(join(f.root, decisionsPath)), "no decision recorded");
  } finally {
    f.dispose();
  }
});

test("release preparation uses only the selected order's open state", () => {
  for (const [phase, dispatch] of [
    ["active", "next"],
    ["ready-to-verify", "verify"],
    ["verifying", "verify"],
    ["needs-fix", "fix"],
    ["repairing", "fix"],
    ["verified", "final review"],
    ["final-review", "final review"],
  ]) {
    const f = fixture({ phase });
    try {
      const expected = f.plan();
      for (const otherPhase of [
        "active",
        "verifying",
        "final-review",
        "closed",
      ]) {
        writeFileSync(
          join(f.root, "docs/control/orders/WO-100.jsonl"),
          `other order: ${otherPhase}\n`,
        );
        writeFileSync(
          join(f.root, "docs/control/orders/WO-101.jsonl"),
          `third order: ${phase}\n`,
        );
        assert.deepEqual(f.plan(), expected);
      }
      const before = f.snapshot();
      applyReleasePreparation(expected);
      for (const path of Object.keys(f.sources).slice(2))
        assert.equal(f.snapshot()[path], before[path]);
      assert.equal(
        decisionsIn(f.snapshot()[decisionsPath])[0].dispatch,
        `resume: ${dispatch}; release prepare`,
      );
    } finally {
      f.dispose();
    }
  }
});

test("release preparation refuses malformed or ambiguous inputs before writing", () => {
  const changes = [
    ["README.md", "# Missing block\n"],
    [
      "README.md",
      "<!-- DOTLN-RELEASE-BEGIN -->\nv0.13.2 and v0.13.1\n<!-- DOTLN-RELEASE-END -->\n",
    ],
    [
      "README.md",
      "<!-- DOTLN-RELEASE-BEGIN --> \nv0.13.2\n<!-- DOTLN-RELEASE-END -->\n",
    ],
    [
      "README.md",
      "<!-- DOTLN-RELEASE-BEGIN -->\nv0.13.1\n<!-- DOTLN-RELEASE-END -->\n",
    ],
    [
      "docs/work-orders/WO-099-fixture.md",
      "# WO-099 v0.13.2-beta\n\n**Release classification:** patch.\n",
    ],
    [
      "docs/work-orders/WO-099-fixture.md",
      "# WO-099 (version assigned at activation) later\n\n**Release classification:** patch.\n",
    ],
    [
      "docs/work-orders/WO-099-fixture.md",
      "# WO-099 v0.13.2\n\n**Release classification:** patch.\n**Release classification:** major.\n",
    ],
    [
      "docs/work-orders/WO-099-fixture.md",
      "# WO-099 v0.13.2\n\n**Release classification:** none.\n",
    ],
  ];
  for (const [path, source] of changes) {
    const f = fixture();
    try {
      writeFileSync(join(f.root, path), source);
      const before = f.snapshot();
      assert.throws(() => f.plan());
      assert.deepEqual(f.snapshot(), before);
    } finally {
      f.dispose();
    }
  }
  const f = fixture();
  try {
    for (const phase of ["closed", "none", "invented", "constructor"])
      assert.throws(
        () =>
          planReleasePreparation(
            f.root,
            { ...f.state, phase },
            "v0.13.2",
            "2026-09-07",
          ),
        /unpublished, open/,
      );
    assert.throws(() =>
      planReleasePreparation(f.root, f.state, "v0.13.2", "2026-02-31"),
    );
    assert.throws(() => f.plan("v0.13.2-beta"));
    assert.throws(() => f.plan("v0.13.9007199254740991"), /integer range/);
    mkdirSync(join(f.root, "docs/evidence/WO-099"), { recursive: true });
    symlinkSync(join(f.root, "README.md"), join(f.root, decisionsPath));
    assert.throws(() => f.plan(), /contained regular file/);
    rmSync(join(f.root, decisionsPath));
    assert.deepEqual(f.snapshot(), f.sources);
  } finally {
    f.dispose();
  }
});

test("a decisions record is never created outside the repository", () => {
  const f = fixture();
  const outside = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-release-preparation-outside-")),
  );
  try {
    mkdirSync(join(f.root, "docs/evidence"), { recursive: true });
    symlinkSync(outside, join(f.root, "docs/evidence/WO-099"));
    const before = f.snapshot();
    assert.throws(() => f.plan(), /contained regular file/);
    rmSync(join(f.root, "docs/evidence/WO-099"));
    // A dangling link at the record's own path is refused as well.
    mkdirSync(join(f.root, "docs/evidence/WO-099"));
    symlinkSync(join(outside, "absent.md"), join(f.root, decisionsPath));
    assert.throws(() => f.plan(), /contained regular file/);
    assert.deepEqual(f.snapshot(), before);
    assert.equal(existsSync(join(outside, "absent.md")), false);
  } finally {
    f.dispose();
    rmSync(outside, { recursive: true, force: true });
  }
});

test("release preparation preserves prerelease examples in the heading and outside the block when replacing the strict target", () => {
  const f = fixture();
  try {
    writeFileSync(
      join(f.root, f.state.workOrderPath),
      f.sources[f.state.workOrderPath].replace(
        "v0.13.2",
        "v0.13.2-beta then v0.13.2",
      ),
    );
    // Prose outside the markers is the page's own and is never touched; the
    // block itself holds nothing but the generated line afterwards.
    writeFileSync(
      join(f.root, "README.md"),
      f.sources["README.md"].replace(
        "Historical v0.1.0 stays.",
        "Historical v0.1.0-beta then v0.1.0 stays.",
      ),
    );
    applyReleasePreparation(f.plan());
    assert.match(
      readFileSync(join(f.root, f.state.workOrderPath), "utf8"),
      /v0.13.2-beta then v0.13.3/,
    );
    assert.equal(
      readFileSync(join(f.root, "README.md"), "utf8"),
      generatedReadme("v0.13.3").replace(
        "Historical v0.1.0 stays.",
        "Historical v0.1.0-beta then v0.1.0 stays.",
      ),
    );
  } finally {
    f.dispose();
  }
});

test("release preparation refuses wrong worktrees, escaped sources, and stale plans", () => {
  const f = fixture();
  try {
    assert.throws(
      () =>
        planReleasePreparation(
          f.root,
          { ...f.state, workOrderId: "WO-100" },
          "v0.13.2",
          "2026-09-07",
        ),
      /selected wo-NNN/,
    );
    const plan = f.plan();
    writeFileSync(join(f.root, "README.md"), "User changed this.\n");
    const before = f.snapshot();
    assert.throws(() => applyReleasePreparation(plan), /source changed/);
    assert.deepEqual(f.snapshot(), before);
    // A decisions record created after planning is a changed source too.
    writeFileSync(join(f.root, "README.md"), f.sources["README.md"]);
    const fresh = f.plan();
    mkdirSync(dirname(join(f.root, decisionsPath)), { recursive: true });
    writeFileSync(join(f.root, decisionsPath), "# Written meanwhile\n");
    assert.throws(() => applyReleasePreparation(fresh), /source changed/);
    rmSync(join(f.root, decisionsPath));
    rmSync(join(f.root, "README.md"));
    symlinkSync(join(f.root, f.state.workOrderPath), join(f.root, "README.md"));
    assert.throws(() => f.plan(), /contained regular/);
  } finally {
    f.dispose();
  }
});

test("release preparation recovers prior source bytes after a write failure", () => {
  for (const failAt of [2, 3]) {
    const f = fixture();
    try {
      let count = 0;
      assert.throws(
        () =>
          applyReleasePreparation(f.plan(), (path, source) => {
            writeFileSync(path, source);
            if (++count === failAt) throw new Error("fixture write failure");
          }),
        /fixture write failure/,
      );
      assert.deepEqual(f.snapshot(), f.sources);
      assert.equal(existsSync(join(f.root, decisionsPath)), false);
    } finally {
      f.dispose();
    }
  }
});

test("a lone conflict marker line is an authored conflict; a setext underline alone is not", () => {
  for (const integration of [false, true])
    for (const [text, conflicted] of [
      ["# WO-099 decisions\n\n<<<<<<< ours\nmine\n=======\ntheirs\n", true],
      ["# WO-099 decisions\n\nmine\n=======\ntheirs\n>>>>>>> upstream\n", true],
      ["# WO-099 decisions\n\n||||||| base\nbase\n", true],
      ["# WO-099 decisions\n\nA heading\n=======\n\nprose\n", false],
    ]) {
      const f = fixture();
      try {
        mkdirSync(dirname(join(f.root, decisionsPath)), { recursive: true });
        writeFileSync(join(f.root, decisionsPath), text);
        git(f.root, "add", "--", decisionsPath);
        assert.equal(
          decisionsConflicted(f.root, decisionsPath, text),
          conflicted,
        );
        const before = f.snapshot();
        if (conflicted)
          assert.throws(
            () => f.plan("v0.13.2", { integration }),
            /has an authored conflict/,
          );
        else assert.doesNotThrow(() => f.plan("v0.13.2", { integration }));
        assert.deepEqual(f.snapshot(), before);
      } finally {
        f.dispose();
      }
    }
});

test("a decisions record behind a symlinked evidence directory inside the repository is refused in every mode", () => {
  const f = fixture();
  try {
    mkdirSync(join(f.root, "docs/evidence"), { recursive: true });
    mkdirSync(join(f.root, "elsewhere"));
    symlinkSync(
      join(f.root, "elsewhere"),
      join(f.root, "docs/evidence/WO-099"),
    );
    const before = f.snapshot();
    for (const integration of [false, true])
      assert.throws(
        () => f.plan("v0.13.2", { integration }),
        /contained regular file reached through no symlink/,
      );
    assert.deepEqual(f.snapshot(), before);
    assert.equal(existsSync(join(f.root, "elsewhere/decisions.md")), false);
    // A record already present behind the link is refused the same way.
    writeFileSync(
      join(f.root, "elsewhere/decisions.md"),
      "# WO-099 decisions\n",
    );
    assert.throws(
      () => f.plan(),
      /contained regular file reached through no symlink/,
    );
    // A directory where the record should be is refused by name.
    rmSync(join(f.root, "docs/evidence/WO-099"));
    mkdirSync(join(f.root, decisionsPath), { recursive: true });
    assert.throws(
      () => f.plan(),
      /requires docs\/evidence\/WO-099\/decisions\.md to be a contained regular file$/,
    );
  } finally {
    f.dispose();
  }
});

test("prepare --integration is refused once the stub is written or a saved outcome waits", () => {
  const f = fixture();
  try {
    const receipt = {
      workOrder: "WO-099",
      complete: false,
      stage: "applied",
      checkpointRef: "refs/dotln/checkpoint/WO-099/1",
    };
    assert.equal(
      integrationPreparationRefusal(f.root, "WO-099", receipt),
      null,
    );
    assert.equal(
      integrationPreparationRefusal(f.root, "WO-099", {
        ...receipt,
        release: "Retimed WO-099: v0.13.2 → v0.13.3",
      }),
      "a saved release outcome waits for its integration decision stub",
    );
    mkdirSync(dirname(join(f.root, decisionsPath)), { recursive: true });
    writeFileSync(
      join(f.root, decisionsPath),
      "# WO-099 decisions\n\n## WO-099-D001\n\n<!-- integration refs/dotln/checkpoint/WO-099/1 -->\n",
    );
    assert.equal(
      integrationPreparationRefusal(f.root, "WO-099", receipt),
      "the integration decision stub is already written",
    );
    writeFileSync(
      join(f.root, decisionsPath),
      "# WO-099 decisions\n\n<!-- integration refs/dotln/checkpoint/WO-099/0 -->\n",
    );
    assert.equal(
      integrationPreparationRefusal(f.root, "WO-099", receipt),
      null,
      "another integration's stub is not this one's",
    );
    assert.equal(
      integrationPreparationRefusal(f.root, "WO-099", {
        ...receipt,
        checkpointRef: undefined,
      }),
      "its pending integration names no checkpoint",
    );
    rmSync(join(f.root, decisionsPath));
    mkdirSync(join(f.root, decisionsPath));
    assert.equal(
      integrationPreparationRefusal(f.root, "WO-099", receipt),
      null,
      "a record that is not a file holds no stub; the plan refuses it by name",
    );
  } finally {
    f.dispose();
  }
});

test("close history retains parsed publication when archiving fails and bounds repeated missing-archive retries", async (t) => {
  const { chmodSync } = await import("node:fs");
  const { readCloseHistory, reanchorCloseHistory } =
    await import("./release.mjs");
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-close-history-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const order = "WO-999",
    directory = join(root, "docs/control/local/retained", order);
  const attempts = join(directory, "attempts"),
    file = join(directory, "release-close.json");
  mkdirSync(attempts, { recursive: true });
  const prior = {
    schemaVersion: 1,
    workOrderId: order,
    previousAttempts: [],
    publication: {
      target: { policy: "declared", tag: "v1.0.0", tagOutcome: "published" },
    },
  };
  writeFileSync(file, JSON.stringify(prior));
  if (process.getuid?.() !== 0) {
    chmodSync(attempts, 0o500);
    try {
      const refused = readCloseHistory(root, order);
      assert.match(
        refused.historyFailure,
        /attempts\/[^ ]+\.json.*archive|attempts\/[^ ]+\.json.*EACCES/u,
      );
      assert.deepEqual(refused.previousAttempts, prior.previousAttempts);
      assert.equal(
        refused.retainedHistoryAttempt.publication.target.tag,
        "v1.0.0",
      );
      assert.ok(
        refused.previousAttempts.every((attempt) => !attempt.unreadableRecord),
      );
    } finally {
      chmodSync(attempts, 0o700);
    }
  } else
    t.diagnostic(
      "the archive write-permission arm requires a non-root process",
    );
  const first = readCloseHistory(root, order);
  assert.equal(first.historyFailure, undefined);
  const absent = first.archivedAttempts[0];
  rmSync(join(root, absent));
  let record = { ...prior, ...first };
  delete record.recoveryAttempts;
  writeFileSync(file, JSON.stringify(record));
  const sizes = [];
  for (let retry = 0; retry < 6; retry++) {
    const history = readCloseHistory(root, order);
    assert.match(
      history.historyFailure,
      new RegExp(absent.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")),
    );
    assert.match(history.historyFailure, /reanchorCloseHistory/u);
    assert.ok(
      !history.historyFailure
        .split("; publication stopped")[0]
        .includes(root + "/"),
      "the archive diagnosis uses its relative path",
    );
    assert.deepEqual(
      history.previousAttempts,
      record.previousAttempts,
      "a refused retry keeps its parsed flat history",
    );
    record = { ...prior, ...history };
    delete record.recoveryAttempts;
    writeFileSync(file, JSON.stringify(record));
    sizes.push(readFileSync(file).length);
    assert.ok(
      !JSON.stringify(record.previousAttempts).includes("unreadableRecord"),
    );
  }
  assert.equal(
    new Set(sizes.slice(1)).size,
    1,
    "refused retries stop growing after the first failure record",
  );
  const anchor = await reanchorCloseHistory(root, order);
  assert.ok(existsSync(join(root, anchor)));
  const recovered = readCloseHistory(root, order);
  assert.equal(recovered.historyFailure, undefined);
  assert.ok(
    recovered.recoveryAttempts.some(
      (attempt) => attempt.publication?.target?.tag === "v1.0.0",
    ),
  );
});

test("starter tag classification consumes one batched annotation read", async (t) => {
  const { spawnSync } = await import("node:child_process");
  const f = fixture();
  t.after(f.dispose);
  git(f.root, "add", ".");
  git(f.root, "commit", "-qm", "Tag annotation fixture");
  const head = git(f.root, "rev-parse", "HEAD").toString("utf8").trim();
  git(
    f.root,
    "tag",
    "-a",
    "v1.0.0",
    "-m",
    `Starter v1.0.0\n\nCore commit: ${head}`,
  );
  git(f.root, "tag", "-a", "v1.0.1", "-m", "Ordinary release");
  git(f.root, "tag", "-a", "notes", "-m", "Unversioned annotation");
  const bin = join(f.root, "bin");
  mkdirSync(bin);
  const realGit = spawnSync("/bin/sh", ["-c", "command -v git"], {
    encoding: "utf8",
  }).stdout.trim();
  const calls = join(f.root, "git-calls.jsonl");
  writeFileSync(
    join(bin, "git"),
    `#!${process.execPath}\nconst fs=require('node:fs'),cp=require('node:child_process'),args=process.argv.slice(2);fs.appendFileSync(${JSON.stringify(calls)},JSON.stringify(args)+'\\n');const r=cp.spawnSync(${JSON.stringify(realGit)},args,{stdio:'inherit'});process.exit(r.status??1);\n`,
    { mode: 0o755 },
  );
  const moduleUrl = new URL("./lib/release-tags.mjs", import.meta.url).href;
  const script = `const {localTags,releaseAnnotations,isStarterTag}=await import(${JSON.stringify(moduleUrl)});const root=process.argv[1],tags=localTags(root),annotations=releaseAnnotations(root,[...tags.values()]);console.log(JSON.stringify([...tags].map(([name,tag])=>[name,isStarterTag(root,name,tag,annotations)])));`;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", script, f.root],
    {
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(Object.fromEntries(JSON.parse(result.stdout)), {
    notes: false,
    "v1.0.0": true,
    "v1.0.1": false,
  });
  const reads = readFileSync(calls, "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse)
    .filter((args) => args.includes("cat-file"));
  assert.equal(
    reads.length,
    1,
    "immutable tag annotations are read in one batch",
  );
  assert.ok(reads[0].includes("--batch"));
});

test("reference images rewrite their definition with raw bytes and retain exact written-destination spans", () => {
  const options = {
    from: "docs/PR.md",
    repository: { selector: "github.com/fixture/project" },
    revision: "reviewed",
  };
  for (const [reference, definition] of [
    ["![figure][Image]", "[image]: figures/a.png?size=2&raw=false#view"],
    ["![figure][]", "[figure]: figures/a.png?size=2&raw=false#view"],
    ["![figure]", "[figure]: figures/a.png?size=2&raw=false#view"],
  ]) {
    const written = [];
    const result = absoluteBodyLinks(`${reference}\n\n${definition}\n`, {
      ...options,
      written,
    });
    const destination =
      "https://github.com/fixture/project/blob/reviewed/docs/figures/a.png?size=2&raw=true#view";
    assert.ok(result.includes(destination), result);
    assert.deepEqual(
      written.map(({ start, end }) => result.slice(start, end)),
      [destination],
    );
    assert.deepEqual(relativeLinkFailures(result), []);
  }
  const nonImage = absoluteBodyLinks(
    "[record][ref]\n\n[ref]: record.md?plain=1#top\n",
    options,
  );
  assert.ok(nonImage.includes("record.md?plain=1#top"));
  assert.ok(!nonImage.includes("raw=true"));
  const shared = absoluteBodyLinks(
    "[open][ref] and ![figure][ref]\n\n[ref]: a.png\n",
    options,
  );
  assert.ok(shared.includes("a.png?raw=true"));
  const absolute =
    "![figure][ref]\n\n[ref]: https://example.com/a.png?raw=false#top\n";
  const written = [];
  assert.equal(absoluteBodyLinks(absolute, { ...options, written }), absolute);
  assert.deepEqual(
    written,
    [],
    "author-written absolute destinations never become renderer attribution",
  );
});

test("WO-257 the derived Read before upgrading notices name a generated page's regeneration and the new session an emitted-settings change needs", async () => {
  const { criticalNotes, GENERATED_PAGE_RENDERERS } =
    await import("./release.mjs");
  const sourceOnly =
    "Source-only release: no package, binary, container, or hosted artifact is published.";
  // The renderers of a page are its writer, the module that renders the
  // page, every kit module whose render or format function one of them
  // imports, transitively, and the modules named by hand whose projected
  // words the page carries: this closure over the sources pins the first
  // three inside the table (round 1's consistency F1, round 3's F1, the
  // repair round's F1).
  const kitRoot = fileURLToPath(new URL("..", import.meta.url));
  const renderingImports = (path) => {
    const source = readFileSync(join(kitRoot, path), "utf8");
    const found = new Set();
    for (const match of source.matchAll(
      /import\s*\{([^}]*)\}\s*from\s*["'](\.\.?\/[^"']+)["']/gu,
    )) {
      const target = posix.normalize(posix.join(posix.dirname(path), match[2]));
      const names = match[1]
        .split(",")
        .map((name) => name.trim().split(/\s+as\s+/u)[0]);
      if (
        target.startsWith("scripts/") &&
        names.some((name) => /^(?:render|format)[A-Z]/u.test(name))
      )
        found.add(target);
    }
    return found;
  };
  for (const [renderers] of GENERATED_PAGE_RENDERERS) {
    const closure = new Set();
    const queue = [renderers[0]];
    while (queue.length) {
      const path = queue.shift();
      if (closure.has(path)) continue;
      closure.add(path);
      queue.push(...renderingImports(path));
    }
    for (const path of closure)
      assert.ok(renderers.includes(path), `${renderers[0]} reaches ${path}`);
  }
  const index = criticalNotes(
    ["docs/product/07-execution-guide.md", "scripts/work-orders.mjs"],
    [],
  );
  assert.deepEqual(index, [
    sourceOnly,
    "A generated page's renderer changed (scripts/work-orders.mjs): after merging this release, regenerate its page with npm run work-orders -- index before the next document gate reads it.",
  ]);
  // The settings line keys on the emitter criterion 17 names and on the
  // committed emitted file, which an emit of a changed loadout rewrites
  // without touching the emitter (round 2's consistency F1).
  for (const [files, named] of [
    [["packages/compiler/src/harness.ts"], "packages/compiler/src/harness.ts"],
    [[".claude/settings.json"], ".claude/settings.json"],
    [
      ["packages/compiler/src/harness.ts", ".claude/settings.json"],
      "packages/compiler/src/harness.ts, .claude/settings.json",
    ],
  ])
    assert.deepEqual(criticalNotes(files, []), [
      sourceOnly,
      `The emitted host settings changed (${named}): after the update, re-emit with node scripts/harness.mjs emit and start a new session, since the host reads the emitted settings when a session starts.`,
    ]);
  // A page's shape lives in the modules that render its text as well as in
  // its writer script: the meta renderer, the index card's criteria line,
  // the attestation line and the duration formatter name their pages, every
  // changed renderer shares one line with the union of the commands, and a
  // renderer two pages share is named once (round 2's criteria F1 and design
  // F1, round 3's F1).
  assert.deepEqual(criticalNotes(["scripts/lib/meta.mjs"], []), [
    sourceOnly,
    "A generated page's renderer changed (scripts/lib/meta.mjs): after merging this release, regenerate its page with npm run meta before the next document gate reads it.",
  ]);
  assert.deepEqual(criticalNotes(["scripts/lib/control-actor.mjs"], []), [
    sourceOnly,
    "A generated page's renderer changed (scripts/lib/control-actor.mjs): after merging this release, regenerate its page with npm run work-orders -- index before the next document gate reads it.",
  ]);
  // The modules whose projected words the pages carry name their pages
  // (the repair round's F1).
  assert.deepEqual(criticalNotes(["scripts/lib/dependencies.mjs"], []), [
    sourceOnly,
    "A generated page's renderer changed (scripts/lib/dependencies.mjs): after merging this release, regenerate its page with npm run work-orders -- index before the next document gate reads it.",
  ]);
  // A feature election's row or reader also names the features render, the
  // re-emit and a new session (WO-258 criterion 11).
  assert.deepEqual(criticalNotes(["scripts/lib/features.mjs"], []), [
    sourceOnly,
    "A generated page's renderer changed (scripts/lib/features.mjs): after merging this release, regenerate its page with npm run meta before the next document gate reads it.",
    "A feature election changed (scripts/lib/features.mjs): after the update, render the features page with npm run features -- render, re-emit with node scripts/harness.mjs emit and start a new session, since an election can change the surfaces the emit writes and the host reads when a session starts.",
  ]);
  assert.deepEqual(criticalNotes(["scripts/lib/feature-registry.mjs"], []), [
    sourceOnly,
    "A generated page's renderer changed (scripts/lib/feature-registry.mjs): after merging this release, regenerate its page with npm run meta before the next document gate reads it.",
    "A feature election changed (scripts/lib/feature-registry.mjs): after the update, render the features page with npm run features -- render, re-emit with node scripts/harness.mjs emit and start a new session, since an election can change the surfaces the emit writes and the host reads when a session starts.",
  ]);
  assert.deepEqual(criticalNotes(["scripts/lib/siblings.mjs"], []), [
    sourceOnly,
    "A generated page's renderer changed (scripts/lib/siblings.mjs): after merging this release, regenerate its page with node scripts/siblings.mjs index before the next document gate reads it.",
  ]);
  assert.deepEqual(criticalNotes(["scripts/lib/duration.mjs"], []), [
    sourceOnly,
    "A generated page's renderer changed (scripts/lib/duration.mjs): after merging this release, regenerate the pages with npm run work-orders -- index and npm run meta before the next document gate reads them.",
  ]);
  assert.deepEqual(
    criticalNotes(
      ["scripts/lib/criteria-status.mjs", "scripts/lib/meta.mjs"],
      [],
    ),
    [
      sourceOnly,
      "A generated page's renderer changed (scripts/lib/criteria-status.mjs, scripts/lib/meta.mjs): after merging this release, regenerate the pages with npm run work-orders -- index and npm run meta before the next document gate reads them.",
    ],
  );
  // Neither a renderer nor another trigger of a standing line: no line, a
  // helper a writer imports without rendering page text included.
  assert.deepEqual(
    criticalNotes(
      [
        "docs/KIT.md",
        "README.md",
        "scripts/lib/config.mjs",
        "scripts/lib/git.mjs",
        "scripts/lib/helpers.mjs",
        "scripts/lib/release-records.mjs",
      ],
      [],
    ),
    [sourceOnly],
  );
  // Every renderer the kit writes a page with names its own command.
  for (const [renderer, command] of [
    ["scripts/meta.mjs", "npm run meta"],
    ["scripts/lineage.mjs", "node scripts/lineage.mjs index"],
    ["scripts/siblings.mjs", "node scripts/siblings.mjs index"],
  ])
    assert.ok(
      criticalNotes([renderer], []).some(
        (line) =>
          line.startsWith(
            `A generated page's renderer changed (${renderer})`,
          ) && line.includes(command),
      ),
      renderer,
    );
});
