import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  FEEDBACK_SOURCE_PATHS,
  readFeedbackSource,
} from "../src/feedback-audit.js";

function fixture() {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-feedback-source-")),
  );
  execFileSync("git", ["init", "--quiet", root], { stdio: "pipe" });
  for (const path of FEEDBACK_SOURCE_PATHS) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), `// fixture source: ${path}\n`);
  }
  const manifest = {
    name: "@dotln/skeleton",
    version: "0.12.0",
    license: "Apache-2.0",
    private: true,
    scripts: { test: "node --test", prepublishOnly: "refuse" },
    exports: "./dist/index.js",
    dependencies: { typescript: "5.4.5" },
    extension: { version: "behavior-v1" },
  };
  const lock = {
    name: "fixture",
    version: "0.1.0",
    license: "Apache-2.0",
    lockfileVersion: 3,
    packages: {
      "": {
        version: "0.1.0",
        license: "Apache-2.0",
        workspaces: ["packages/*"],
      },
      "packages/kernel": { version: "0.2.1", license: "Apache-2.0" },
      "packages/compiler": { version: "0.6.0", license: "Apache-2.0" },
      "packages/skeleton": manifest,
      "node_modules/typescript": {
        version: "5.4.5",
        integrity: "fixture-integrity",
        resolved: "fixture:typescript",
        license: "Apache-2.0",
      },
      "packages/unknown": { version: "1.0.0", license: "fixture" },
    },
  };
  writeFileSync(
    join(root, "packages/skeleton/package.json"),
    JSON.stringify(manifest),
  );
  writeFileSync(join(root, "package-lock.json"), JSON.stringify(lock));
  return {
    root,
    manifest,
    lock,
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("feedback audit pins labeled projections and keeps release-only workspace metadata stable", () => {
  const f = fixture();
  try {
    const before = readFeedbackSource(f.root);
    const projected = before.files.filter((file) =>
      file.path.startsWith(".feedback-source/"),
    );
    assert.equal(projected.length, 2);
    for (const file of projected) {
      const capsule = JSON.parse(file.contents);
      assert.equal(capsule.projection, "feedback-package-projection-v1");
      assert.equal(file.path, `.feedback-source/${capsule.sourcePath}`);
      assert.ok(capsule.omitted.includes("/version"));
      assert.ok(capsule.omitted.includes("/license"));
      assert.equal("version" in capsule.value, false);
      assert.equal("license" in capsule.value, false);
    }
    f.manifest.version = "0.12.1";
    f.manifest.license = "fixture-new-license";
    f.lock.version = "0.1.1";
    f.lock.license = "fixture-new-license";
    for (const key of [
      "",
      "packages/kernel",
      "packages/compiler",
      "packages/skeleton",
    ] as const) {
      f.lock.packages[key].version += ".changed";
      f.lock.packages[key].license = "fixture-new-license";
    }
    writeFileSync(
      join(f.root, "packages/skeleton/package.json"),
      JSON.stringify(f.manifest, null, 2),
    );
    writeFileSync(
      join(f.root, "package-lock.json"),
      JSON.stringify(f.lock, null, 4),
    );
    assert.deepEqual(readFeedbackSource(f.root), before);
  } finally {
    f.dispose();
  }
});

test("feedback audit invalidates every declared runtime and fixture source byte", () => {
  const f = fixture();
  try {
    const before = readFeedbackSource(f.root);
    for (const path of FEEDBACK_SOURCE_PATHS.filter(
      (path) => !path.endsWith(".json"),
    )) {
      const full = join(f.root, path);
      const original = readFileSync(full, "utf8");
      writeFileSync(full, original + " ");
      assert.notEqual(readFeedbackSource(f.root).subject, before.subject, path);
      writeFileSync(full, original);
    }
  } finally {
    f.dispose();
  }
});

test("feedback audit keeps execution, dependency, publication, and unknown metadata in the subject", () => {
  const f = fixture();
  try {
    const before = readFeedbackSource(f.root).subject;
    const manifestPath = join(f.root, "packages/skeleton/package.json");
    for (const changed of [
      {
        ...f.manifest,
        scripts: { ...f.manifest.scripts, test: "different-test" },
      },
      {
        ...f.manifest,
        scripts: { ...f.manifest.scripts, prepublishOnly: "allow" },
      },
      { ...f.manifest, exports: "./different.js" },
      { ...f.manifest, dependencies: { typescript: "5.5.0" } },
      { ...f.manifest, private: false },
      { ...f.manifest, extension: { version: "behavior-v2" } },
    ]) {
      writeFileSync(manifestPath, JSON.stringify(changed));
      assert.notEqual(readFeedbackSource(f.root).subject, before);
    }
    writeFileSync(manifestPath, JSON.stringify(f.manifest));
    const lockPath = join(f.root, "package-lock.json");
    for (const field of [
      "version",
      "integrity",
      "resolved",
      "license",
    ] as const) {
      const lock = structuredClone(f.lock);
      lock.packages["node_modules/typescript"][field] += ".changed";
      writeFileSync(lockPath, JSON.stringify(lock));
      assert.notEqual(readFeedbackSource(f.root).subject, before, field);
    }
    const lock = structuredClone(f.lock);
    lock.packages["packages/unknown"].version = "2.0.0";
    writeFileSync(lockPath, JSON.stringify(lock));
    assert.notEqual(readFeedbackSource(f.root).subject, before);
    writeFileSync(lockPath, JSON.stringify({ ...f.lock, lockfileVersion: 4 }));
    assert.notEqual(readFeedbackSource(f.root).subject, before);
  } finally {
    f.dispose();
  }
});

test("feedback audit refuses malformed package projection inputs", () => {
  const f = fixture();
  try {
    for (const contents of [
      "{",
      "[]",
      "null",
      '{"packages":null}',
      '{"packages":{"packages/skeleton":[]}}',
    ]) {
      writeFileSync(join(f.root, "package-lock.json"), contents);
      assert.throws(() => readFeedbackSource(f.root));
    }
  } finally {
    f.dispose();
  }
});
