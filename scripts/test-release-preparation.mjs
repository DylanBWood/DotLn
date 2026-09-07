import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
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

function fixture({
  phase = "final-review",
  classification = "patch",
  target = "v0.13.2",
} = {}) {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-release-preparation-")),
  );
  execFileSync("git", ["init", "--quiet", "-b", "wo-099", root], {
    stdio: "pipe",
  });
  const authorityPath = "docs/work-orders/WO-099-fixture.md";
  const sources = {
    [authorityPath]: `# WO-099 — fixture (${target})\n\n**Release classification:** ${classification}. Existing scope.\n\n**Objective:** Keep this exact paragraph.\n`,
    "README.md": `# Fixture\n\n<!-- DOTLN-RELEASE-BEGIN -->\n\nThis source prepares \`${target}\`. Keep the reviewed description.\n<!-- DOTLN-RELEASE-END -->\n\nHistorical v0.1.0 stays.\n`,
    "docs/product/06-roadmap.md": `# Roadmap\n\n## Release boundary\n\n**WO-099 activation completion (2026-09-06):**\nAssigned \`${target}\`.\n\n## Later work\n\nKeep this section.\n`,
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
      Object.keys(sources).map((path) => [
        path,
        readFileSync(join(root, path), "utf8"),
      ]),
    );
  return {
    root,
    state,
    sources,
    snapshot,
    plan: (latest = "v0.13.2") =>
      planReleasePreparation(root, state, latest, "2026-09-07"),
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("release preparation retimes only three source surfaces and is idempotent", () => {
  const f = fixture();
  try {
    const plan = f.plan();
    assert.equal(plan.target, "v0.13.3");
    assert.deepEqual(f.snapshot(), f.sources, "planning must not write");
    applyReleasePreparation(plan);
    const after = f.snapshot();
    assert.equal(
      after[f.state.workOrderPath],
      f.sources[f.state.workOrderPath].replace("v0.13.2", "v0.13.3"),
    );
    assert.equal(
      after["README.md"],
      f.sources["README.md"].replace("v0.13.2", "v0.13.3"),
    );
    assert.match(
      after["docs/product/06-roadmap.md"],
      /Assigned `v0.13.2`\.\n\n\*\*WO-099 collision retiming \(2026-09-07\):\*\* unpublished target `v0.13.2` is superseded by `v0.13.3`/,
    );
    assert.ok(
      after["docs/product/06-roadmap.md"].endsWith(
        "## Later work\n\nKeep this section.\n",
      ),
    );
    for (const path of Object.keys(f.sources).slice(3))
      assert.equal(after[path], f.sources[path], path);
    assert.deepEqual(f.plan().edits, []);
    applyReleasePreparation(f.plan());
    assert.deepEqual(f.snapshot(), after);
  } finally {
    f.dispose();
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
  for (const phase of [
    "active",
    "ready-to-verify",
    "verifying",
    "needs-fix",
    "repairing",
    "verified",
    "final-review",
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
      for (const path of Object.keys(f.sources).slice(3))
        assert.equal(f.snapshot()[path], before[path]);
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
    ["docs/product/06-roadmap.md", "# No release section\n"],
    [
      "docs/work-orders/WO-099-fixture.md",
      "# WO-099 v0.13.2-beta\n\n**Release classification:** patch.\n",
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
    for (const phase of ["closed", "none", "invented"])
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
    assert.deepEqual(f.snapshot(), f.sources);
  } finally {
    f.dispose();
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
    rmSync(join(f.root, "README.md"));
    symlinkSync(join(f.root, f.state.workOrderPath), join(f.root, "README.md"));
    assert.throws(() => f.plan(), /contained regular/);
  } finally {
    f.dispose();
  }
});

test("release preparation recovers prior source bytes after a write failure", () => {
  const f = fixture();
  try {
    let count = 0;
    assert.throws(
      () =>
        applyReleasePreparation(f.plan(), (path, source) => {
          writeFileSync(path, source);
          if (++count === 2) throw new Error("fixture write failure");
        }),
      /fixture write failure/,
    );
    assert.deepEqual(f.snapshot(), f.sources);
  } finally {
    f.dispose();
  }
});
