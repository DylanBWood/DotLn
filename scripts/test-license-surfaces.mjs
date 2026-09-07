import assert from "node:assert/strict";
import { test } from "node:test";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { licenseSurfaceRules, publishRefusal } from "./license-surfaces.mjs";
import {
  contributionSignoffRules,
  operatorAuthor,
} from "./lib/contributions.mjs";
import { runGit } from "./lib/git.mjs";
import { installLicenseFixture } from "./test-license-fixture.mjs";

const withFixture = (operation) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-license-test-"));
  try {
    mkdirSync(join(root, "packages/kernel"), { recursive: true });
    writeFileSync(join(root, "package.json"), '{"name":"license-fixture"}');
    writeFileSync(
      join(root, "packages/kernel/package.json"),
      '{"name":"@fixture/kernel","version":"0.0.0"}',
    );
    installLicenseFixture(root);
    return operation(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};
const failures = (rules) =>
  rules
    .filter(({ pass }) => !pass)
    .map(({ line }) => line)
    .join("\n");
const changeManifest = (root, path, change) => {
  const manifest = JSON.parse(readFileSync(join(root, path), "utf8"));
  change(manifest);
  writeFileSync(join(root, path), JSON.stringify(manifest));
};
const commit = (root, author, message) => {
  runGit(root, ["add", "."]);
  runGit(
    root,
    [
      "-c",
      "user.name=Fixture Committer",
      "-c",
      "user.email=committer@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--allow-empty",
      `--author=${author}`,
      "--file=-",
    ],
    { input: message },
  );
  return runGit(root, ["rev-parse", "HEAD"]);
};

test("real npm refuses every validated manifest before packing, despite ambient script suppression", () =>
  withFixture((root) => {
    const prior = process.env.npm_config_ignore_scripts;
    process.env.npm_config_ignore_scripts = "true";
    try {
      const rules = licenseSurfaceRules(root);
      assert.equal(failures(rules), "");
      assert.equal(
        rules.filter(({ line }) => line.includes("npm publish --dry-run"))
          .length,
        2,
      );
      for (const { line } of rules.filter(({ line }) =>
        line.includes("npm publish --dry-run"),
      ))
        console.log(line);
    } finally {
      if (prior === undefined) delete process.env.npm_config_ignore_scripts;
      else process.env.npm_config_ignore_scripts = prior;
    }
  }));

test("root and workspace metadata refuse missing license, false/string private, and absent or substituted lifecycle guards", () =>
  withFixture((root) => {
    for (const path of ["package.json", "packages/kernel/package.json"]) {
      const original = readFileSync(join(root, path));
      for (const [change, expected] of [
        [
          (manifest) => delete manifest.license,
          'license: observed missing; expected "Apache-2.0"',
        ],
        [
          (manifest) => (manifest.license = "MIT"),
          'license: observed "MIT"; expected "Apache-2.0"',
        ],
        [
          (manifest) => delete manifest.private,
          "private: observed missing; expected true",
        ],
        [
          (manifest) => (manifest.private = false),
          "private: observed false; expected true",
        ],
        [
          (manifest) => (manifest.private = "true"),
          'private: observed "true"; expected true',
        ],
        [
          (manifest) => delete manifest.scripts.prepublishOnly,
          "prepublishOnly: observed missing",
        ],
        [
          (manifest) =>
            (manifest.scripts.prepublishOnly = "node -e 'process.exit(1)'"),
          "prepublishOnly: observed",
        ],
        [
          (manifest) => (manifest.publishConfig = { "ignore-scripts": true }),
          'publishConfig: observed {"ignore-scripts":true}; expected missing',
        ],
      ]) {
        changeManifest(root, path, change);
        const report = failures(licenseSurfaceRules(root));
        assert.ok(report.includes(`${path} ${expected}`), report);
        assert.ok(report.includes("not run: invalid manifest policy"), report);
        writeFileSync(join(root, path), original);
      }
    }
  }));

test("every license file is byte-pinned; missing files, symlinks, and legal-record drift refuse", () =>
  withFixture((root) => {
    for (const path of ["LICENSE", "LICENSE-docs", "NOTICE"]) {
      const original = readFileSync(join(root, path));
      writeFileSync(
        join(root, path),
        Buffer.concat([original, Buffer.from("\nchanged\n")]),
      );
      assert.match(
        failures(licenseSurfaceRules(root)),
        new RegExp(
          `FAIL license-surfaces ${path}: observed sha256:[a-f0-9]+; expected sha256:`,
        ),
      );
      rmSync(join(root, path));
      assert.ok(
        failures(licenseSurfaceRules(root)).includes(`${path} is missing`),
      );
      symlinkSync("package.json", join(root, path));
      assert.ok(
        failures(licenseSurfaceRules(root)).includes(
          "not a contained regular file",
        ),
      );
      rmSync(join(root, path));
      writeFileSync(join(root, path), original);
    }
    const legal = readFileSync(join(root, "docs/LEGAL.md"), "utf8");
    writeFileSync(
      join(root, "docs/LEGAL.md"),
      legal.replace("sha256:cfc7749b", "sha256:00000000"),
    );
    assert.match(
      failures(licenseSurfaceRules(root)),
      /docs\/LEGAL.md LICENSE pin: observed 00000000/,
    );
  }));

test("new workspaces are checked and unsupported workspace layouts fail closed", () =>
  withFixture((root) => {
    mkdirSync(join(root, "packages/new-workspace"));
    writeFileSync(
      join(root, "packages/new-workspace/package.json"),
      '{"name":"@fixture/new","version":"0.0.0"}',
    );
    assert.match(
      failures(licenseSurfaceRules(root)),
      /packages\/new-workspace\/package.json license: observed missing/,
    );
    changeManifest(root, "package.json", (manifest) =>
      manifest.workspaces.push("other/*"),
    );
    assert.match(
      failures(licenseSurfaceRules(root)),
      /package.json workspaces: observed \["packages\/\*","other\/\*"\]; expected \["packages\/\*"\]/,
    );
  }));

test("symlinked workspace directories refuse in both working and committed snapshots", () =>
  withFixture((root) => {
    symlinkSync("kernel", join(root, "packages/alias"));
    assert.match(
      failures(licenseSurfaceRules(root)),
      /workspace directories must not be symlinks/,
    );
    runGit(root, ["init", "-b", "main"]);
    commit(
      root,
      "Fixture Author <author@example.invalid>",
      "symlinked workspace fixture",
    );
    assert.match(
      failures(licenseSurfaceRules(root, "HEAD")),
      /workspace directories must not be symlinks/,
    );
  }));

test("missing npm, unrelated failures, and success with a marker cannot masquerade as publication refusal", () =>
  withFixture((root) => {
    const bin = join(root, "bin");
    mkdirSync(bin);
    const priorPath = process.env.PATH;
    process.env.PATH = bin;
    try {
      assert.match(
        failures(licenseSurfaceRules(root)),
        /npm execution failed \(ENOENT\)/,
      );
      writeFileSync(
        join(bin, "npm"),
        "#!/bin/sh\necho 'unrelated failure' >&2\nexit 1\n",
      );
      chmodSync(join(bin, "npm"), 0o755);
      assert.match(
        failures(licenseSurfaceRules(root)),
        /exit 1; no publication refusal marker/,
      );
      writeFileSync(
        join(bin, "npm"),
        `#!/bin/sh\necho '${publishRefusal}' >&2\nexit 0\n`,
      );
      assert.match(
        failures(licenseSurfaceRules(root)),
        /observed exit 0; DOTLN_PACKAGE_PUBLISH_REFUSED; expected exit 1/,
      );
    } finally {
      process.env.PATH = priorPath;
    }
  }));

test("committed checks read Git blobs for metadata, hashes, and npm snapshots", () =>
  withFixture((root) => {
    runGit(root, ["init", "-b", "main"]);
    const manifestPath = "packages/kernel/package.json";
    const valid = readFileSync(join(root, manifestPath));
    changeManifest(root, manifestPath, (manifest) => delete manifest.license);
    commit(
      root,
      "Fixture Author <author@example.invalid>",
      "invalid committed metadata",
    );
    writeFileSync(join(root, manifestPath), valid);
    assert.equal(failures(licenseSurfaceRules(root)), "");
    assert.match(
      failures(licenseSurfaceRules(root, "HEAD")),
      /license: observed missing/,
    );
    commit(
      root,
      "Fixture Author <author@example.invalid>",
      "valid committed metadata",
    );
    writeFileSync(join(root, "LICENSE"), "uncommitted license bytes");
    changeManifest(
      root,
      manifestPath,
      (manifest) => delete manifest.scripts.prepublishOnly,
    );
    assert.equal(failures(licenseSurfaceRules(root, "HEAD")), "");
    const report = failures(licenseSurfaceRules(root));
    assert.match(report, /prepublishOnly: observed missing/);
    assert.match(report, /FAIL license-surfaces LICENSE: observed sha256:/);
  }));

test("DCO checks every new commit's author and trailer, exempts only the operator, and leaves old history alone", () =>
  withFixture((root) => {
    runGit(root, ["init", "-b", "main"]);
    const base = commit(
      root,
      "Old Contributor <old@example.invalid>",
      "historical unsigned contribution",
    );
    runGit(root, ["update-ref", "refs/remotes/origin/main", base]);
    assert.deepEqual(contributionSignoffRules(root), []);
    commit(root, operatorAuthor, "operator without sign-off");
    assert.equal(failures(contributionSignoffRules(root)), "");
    commit(
      root,
      "Outside Contributor <outside@example.invalid>",
      "outside signed contribution\n\nSigned-off-by: Outside Contributor <outside@example.invalid>\n",
    );
    assert.equal(failures(contributionSignoffRules(root)), "");
    const badCommits = [];
    for (const [author, message] of [
      ["Outside Contributor <outside@example.invalid>", "outside unsigned"],
      [
        "Outside Contributor <outside@example.invalid>",
        `wrong signer\n\nSigned-off-by: ${operatorAuthor}\n`,
      ],
      [
        "Outside Contributor <outside@example.invalid>",
        "body example\n\nSigned-off-by: Outside Contributor <outside@example.invalid>\n\nThis is ordinary prose after the example.\n",
      ],
      [
        "Dylan Wood <different@example.invalid>",
        "same name is not the operator identity",
      ],
    ])
      badCommits.push(commit(root, author, message).slice(0, 12));
    const rules = contributionSignoffRules(root);
    assert.equal(rules.length, 6);
    assert.equal(rules.filter(({ pass }) => !pass).length, 4);
    for (const id of badCommits) assert.ok(failures(rules).includes(id));
    for (const { line } of rules) console.log(line);
    runGit(root, ["update-ref", "-d", "refs/remotes/origin/main"]);
    assert.throws(() => contributionSignoffRules(root));
  }));

test("operator merge commits do not hide unsigned outside commits on a merged branch", () =>
  withFixture((root) => {
    runGit(root, ["init", "-b", "main"]);
    const base = commit(root, operatorAuthor, "baseline");
    runGit(root, ["update-ref", "refs/remotes/origin/main", base]);
    runGit(root, ["switch", "-c", "outside"]);
    const outside = commit(
      root,
      "Outside Contributor <outside@example.invalid>",
      "unsigned side branch",
    );
    runGit(root, ["switch", "main"]);
    runGit(root, [
      "-c",
      "user.name=Dylan Wood",
      "-c",
      "user.email=dylanwoodconsulting@gmail.com",
      "-c",
      "commit.gpgsign=false",
      "merge",
      "--no-ff",
      "outside",
      "-m",
      "operator merge",
    ]);
    const rules = contributionSignoffRules(root);
    assert.equal(rules.length, 2);
    assert.ok(failures(rules).includes(outside.slice(0, 12)));
    assert.equal(rules.at(-1).pass, true);
  }));
