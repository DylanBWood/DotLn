import { execGit } from "./lib/git.mjs";
import test from "node:test";
import assert from "node:assert/strict";

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  applyReleasePreparation,
  planReleasePreparation,
} from "./lib/release-preparation.mjs";

const decisionsPath = "docs/evidence/WO-099/decisions.md";
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
    mkdtempSync(join(tmpdir(), "dotln-release-preparation-")),
  );
  execGit(["init", "--quiet", "-b", "wo-099", root], {
    stdio: "pipe",
  });
  const authorityPath = "docs/work-orders/WO-099-fixture.md";
  const title = target
    ? `# WO-099 — fixture (${target})`
    : "# WO-099 — fixture (version assigned at activation)";
  const sources = {
    [authorityPath]: `${title}\n\n**Release classification:** ${classification}. Existing scope.\n\n**Objective:** Keep this exact paragraph.\n`,
    "README.md": `# Fixture\n\n<!-- DOTLN-RELEASE-BEGIN -->\n\nThis source prepares \`${claim}\`. Keep the reviewed description.\n<!-- DOTLN-RELEASE-END -->\n\nHistorical v0.1.0 stays.\n`,
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
    assert.equal(
      after["README.md"],
      f.sources["README.md"].replace("v0.13.2", "v0.13.3"),
    );
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
      "release baseline v0.13.2 (local tags)",
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
      git(merged.root, "commit", "-qm", "base");
      git(merged.root, "switch", "-qc", "upstream");
      writeFileSync(path, "# WO-099 decisions\n\nupstream\n");
      git(merged.root, "commit", "-qam", "upstream");
      git(merged.root, "switch", "-q", "wo-099");
      writeFileSync(path, "# WO-099 decisions\n\nsubject\n");
      git(merged.root, "commit", "-qam", "subject");
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
    assert.equal(
      after["README.md"],
      f.sources["README.md"].replace("v0.13.1", "v0.13.3"),
    );
    const [decision] = decisionsIn(after[decisionsPath]);
    assert.equal(decision.dispatch, "resume: next; release prepare");
    assert.match(
      decision.decision,
      /^Assign application target v0\.13\.3, the next patch above the observed release baseline v0\.13\.2,/,
    );
    assert.deepEqual(decision.evidence, [
      "release baseline v0.13.2 (local tags)",
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
  const f = fixture({ target: "v0.15.0" });
  try {
    assert.deepEqual(f.plan().edits, []);
    assert.deepEqual(
      planReleasePreparation(f.root, f.state, undefined, "2026-09-07").edits,
      [],
    );
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
    mkdtempSync(join(tmpdir(), "dotln-release-preparation-outside-")),
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

test("release preparation preserves prerelease examples when replacing the strict target", () => {
  const f = fixture();
  try {
    for (const path of [f.state.workOrderPath, "README.md"])
      writeFileSync(
        join(f.root, path),
        f.sources[path].replace("v0.13.2", "v0.13.2-beta then v0.13.2"),
      );
    applyReleasePreparation(f.plan());
    for (const path of [f.state.workOrderPath, "README.md"])
      assert.match(
        readFileSync(join(f.root, path), "utf8"),
        /v0.13.2-beta then v0.13.3/,
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
