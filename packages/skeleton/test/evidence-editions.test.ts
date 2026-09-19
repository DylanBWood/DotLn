import test from "node:test";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  currentEvidence,
  evidenceArgs,
  evidenceSourceContent,
  sameEvidenceSourceContent,
  writeEvidenceFile,
} from "../src/evidence-editions.mjs";

test("current evidence follows one manifest, independent of active order; explicit historical pins survive", () => {
  const root = mkdtempSync(join(tmpdir(), "dotln-evidence-edition-"));
  try {
    mkdirSync(join(root, "docs/evidence"), { recursive: true });
    const select = (workOrder: string, revision: string | null) =>
      writeFileSync(
        join(root, "docs/evidence/current.json"),
        JSON.stringify({
          schemaVersion: 1,
          editions: { feedback: { workOrder, revision } },
        }),
      );
    select("WO-998", "003");
    assert.equal(
      currentEvidence(root, "feedback").directory,
      "docs/evidence/WO-998/feedback-003",
    );
    select("WO-999", "004");
    assert.equal(
      currentEvidence(root, "feedback").directory,
      "docs/evidence/WO-999/feedback-004",
    );
    assert.equal(
      evidenceArgs(root, "feedback", ["--check"]).selection.directory,
      "docs/evidence/WO-999/feedback-004",
    );
    const pinned = evidenceArgs(root, "feedback", [
      "--check",
      "--edition",
      "WO-011",
    ]);
    assert.deepEqual(pinned.args, ["--check"]);
    assert.equal(pinned.selection.directory, "docs/evidence/WO-011");
    assert.equal(
      evidenceArgs(root, "authority", [
        "--edition",
        "WO-042",
        "--revision",
        "002",
        "--write",
      ]).selection.directory,
      "docs/evidence/WO-042/authority/002",
    );
    assert.throws(
      () => currentEvidence(root, "verification"),
      /Invalid current-evidence/,
    );
    for (const args of [
      ["--edition"],
      ["--revision", "000"],
      ["--edition", "../escape"],
      ["--edition", "WO-001", "--edition", "WO-002"],
    ])
      assert.throws(() => evidenceArgs(root, "feedback", args));
    select("../escape", null);
    assert.throws(
      () => currentEvidence(root, "feedback"),
      /Invalid current-evidence/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("repair revisions preserve the original artifact and verification evidence", () => {
  const root = mkdtempSync(join(tmpdir(), "dotln-evidence-repair-"));
  try {
    mkdirSync(join(root, "docs/evidence"), { recursive: true });
    const editions = {
      "artifact-identity": { workOrder: "WO-045", revision: "001" },
      verification: { workOrder: "WO-045", revision: "001" },
    };
    writeFileSync(
      join(root, "docs/evidence/current.json"),
      JSON.stringify({ schemaVersion: 1, editions }),
    );
    for (const kind of ["artifact-identity", "verification"] as const) {
      const original = evidenceArgs(root, kind, [
        "--edition",
        "WO-045",
        "--write",
      ]);
      assert.equal(
        original.selection.directory,
        `docs/evidence/WO-045/${kind}`,
      );
      const revised = evidenceArgs(root, kind, [
        "--revision",
        "001",
        "--write",
      ]);
      assert.deepEqual(revised.args, ["--write"]);
      assert.equal(
        revised.selection.directory,
        `docs/evidence/WO-045/${kind}/001`,
      );
      assert.equal(
        currentEvidence(root, kind).directory,
        revised.selection.directory,
      );
      const historicalPath = join(
        root,
        original.selection.directory,
        "evidence.json",
      );
      const revisedPath = join(
        root,
        revised.selection.directory,
        "evidence.json",
      );
      writeEvidenceFile(historicalPath, "original\n");
      writeEvidenceFile(revisedPath, "repair\n");
      assert.equal(readFileSync(historicalPath, "utf8"), "original\n");
      assert.equal(readFileSync(revisedPath, "utf8"), "repair\n");
      assert.throws(
        () => writeEvidenceFile(revisedPath, "replacement\n"),
        /immutable/,
      );
      for (const revision of ["000", "1", "0001", "../001", "001/next"])
        assert.throws(
          () => evidenceArgs(root, kind, ["--revision", revision]),
          /Invalid/,
        );
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("evidence compares component release labels by content and preserves behavioral inputs", () => {
  const manifest = {
    name: "@dotln/skeleton",
    version: "0.15.12",
    license: "Apache-2.0",
    dependencies: { "@dotln/compiler": "0.9.3", typescript: "5.4.5" },
    scripts: { test: "node --test" },
    private: true,
    extension: { version: "contract-v1" },
  };
  const path = "packages/skeleton/package.json";
  const before = evidenceSourceContent(path, JSON.stringify(manifest));
  assert.equal(
    evidenceSourceContent(
      path,
      JSON.stringify({
        ...manifest,
        version: "0.16.0",
        dependencies: { ...manifest.dependencies, "@dotln/compiler": "0.10.0" },
      }),
    ),
    before,
  );
  for (const change of [
    { ...manifest, license: "changed" },
    { ...manifest, private: false },
    { ...manifest, scripts: { test: "different" } },
    { ...manifest, extension: { version: "contract-v2" } },
    {
      ...manifest,
      dependencies: { ...manifest.dependencies, typescript: "5.5.0" },
    },
    {
      ...manifest,
      dependencies: { ...manifest.dependencies, "@dotln/compiler": "^0.9.3" },
    },
    {
      ...manifest,
      dependencies: {
        ...manifest.dependencies,
        "@dotln/compiler": "file:../unexpected",
      },
    },
    { ...manifest, dependencies: { typescript: "5.4.5" } },
  ])
    assert.notEqual(
      evidenceSourceContent(path, JSON.stringify(change)),
      before,
    );
  const compiler =
    'export const COMPILER_PACKAGE_VERSION = "0.9.3";\nexport const behavior = "0.9.3";\n';
  assert.equal(
    evidenceSourceContent(
      "packages/compiler/src/artifact-identity.ts",
      compiler.replace('VERSION = "0.9.3"', 'VERSION = "0.10.0"'),
    ),
    evidenceSourceContent(
      "packages/compiler/src/artifact-identity.ts",
      compiler,
    ),
  );
  assert.notEqual(
    evidenceSourceContent(
      "packages/compiler/src/artifact-identity.ts",
      compiler.replace('behavior = "0.9.3"', 'behavior = "0.10.0"'),
    ),
    evidenceSourceContent(
      "packages/compiler/src/artifact-identity.ts",
      compiler,
    ),
  );
  const host =
    'export const HARNESS_HOST_VERSION = "0.15.12";\nexport const boundaryContract = "feedback-v1";\n';
  assert.equal(
    evidenceSourceContent("packages/skeleton/src/version.ts", host),
    evidenceSourceContent(
      "packages/skeleton/src/version.ts",
      host.replace("0.15.12", "0.16.0"),
    ),
  );
  assert.notEqual(
    evidenceSourceContent("packages/skeleton/src/version.ts", host),
    evidenceSourceContent(
      "packages/skeleton/src/version.ts",
      host.replace("feedback-v1", "feedback-v2"),
    ),
  );
  // The old locations have no live release literals: unrelated source bytes
  // at those paths must compare exactly.
  for (const path of [
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/loadouts/contributor.ts",
  ])
    assert.notEqual(
      evidenceSourceContent(path, host),
      evidenceSourceContent(path, host.replace("0.15.12", "0.16.0")),
    );
});

test("immutable evidence admits a component-only bump while source, external dependency, and evidence changes invalidate", () => {
  const root = mkdtempSync(join(tmpdir(), "dotln-evidence-content-"));
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, stdio: "pipe" });
  const write = (path: string, value: string) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), value);
  };
  const source = "packages/compiler/src/artifact-identity.ts";
  const original =
    'export const COMPILER_PACKAGE_VERSION = "0.9.3";\nexport const behavior = 1;\n';
  const lock = {
    lockfileVersion: 3,
    packages: {
      "packages/compiler": { name: "@dotln/compiler", version: "0.9.3" },
      "packages/skeleton": {
        version: "0.15.12",
        dependencies: { "@dotln/compiler": "0.9.3" },
      },
      "node_modules/typescript": { version: "5.4.5" },
    },
  };
  const evidence = "docs/evidence/WO-999/verification/events.jsonl";
  const hostSource = "packages/skeleton/src/version.ts";
  const host = 'export const HARNESS_HOST_VERSION = "0.15.12";\n';
  const sources = [source, hostSource, "package-lock.json"];
  try {
    git("init", "--quiet");
    write(source, original);
    write(hostSource, host);
    write("package-lock.json", JSON.stringify(lock));
    writeEvidenceFile(join(root, evidence), "historical raw 0.9.3 evidence\n");
    assert.equal(
      sameEvidenceSourceContent(root, [evidence], sources),
      false,
      "uncommitted evidence cannot serve as its own provenance",
    );
    git("add", ".");
    git(
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "--quiet",
      "-m",
      "file immutable edition",
    );
    assert.equal(sameEvidenceSourceContent(root, [evidence], sources), true);
    write(source, original.replace("0.9.3", "0.10.0"));
    write(hostSource, host.replace("0.15.12", "0.16.0"));
    lock.packages["packages/compiler"].version = "0.10.0";
    lock.packages["packages/skeleton"].version = "0.16.0";
    lock.packages["packages/skeleton"].dependencies["@dotln/compiler"] =
      "0.10.0";
    write("package-lock.json", JSON.stringify(lock));
    assert.equal(
      sameEvidenceSourceContent(root, [evidence], sources),
      true,
      "release labels alone preserve the edition",
    );
    assert.equal(
      readFileSync(join(root, evidence), "utf8"),
      "historical raw 0.9.3 evidence\n",
    );
    assert.throws(
      () =>
        writeEvidenceFile(join(root, evidence), "rewritten 0.10.0 evidence\n"),
      /immutable/,
    );
    write(source, original.replace("behavior = 1", "behavior = 2"));
    assert.equal(
      sameEvidenceSourceContent(root, [evidence], sources),
      false,
      "behavior change requires new evidence",
    );
    write(source, original);
    lock.packages["node_modules/typescript"].version = "5.5.0";
    write("package-lock.json", JSON.stringify(lock));
    assert.equal(
      sameEvidenceSourceContent(root, [evidence], sources),
      false,
      "external versions remain behavioral inputs",
    );
    lock.packages["node_modules/typescript"].version = "5.4.5";
    write("package-lock.json", JSON.stringify(lock));
    write(evidence, "modified snapshot\n");
    assert.equal(
      sameEvidenceSourceContent(root, [evidence], sources),
      false,
      "raw historical snapshot is immutable",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
