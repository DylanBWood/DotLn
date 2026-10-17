import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  chmodSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const source = process.cwd();
const load = (p) => import(pathToFileURL(join(source, p)));
const {
  HOME_DIRECTORY,
  PRIVATE_PATH,
  withoutHomeDirectories,
  privatePathLines,
} = await load("scripts/lib/private-paths.mjs");
const { recordFiles, homePathFindings, checkDocs } = await load(
  "scripts/docs-check.mjs",
);
const { gateInstanceInputDigest } = await load("scripts/lib/gate-evidence.mjs");
const { runtimePackageInventory } = await load("scripts/lib/harness.mjs");
const { validateConfig } = await load("scripts/lib/config.mjs");
const { profileGuidance } = await load("scripts/lib/reader-profiles.mjs");
const { followupStatus } = await load("scripts/lib/planning-followups.mjs");
const digest = (x) => createHash("sha256").update(x).digest("hex");
const git = (root, args) => {
  const r = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  assert.equal(r.status, 0, "fixture/source read");
  return r.stdout;
};
const read = (p) => JSON.parse(readFileSync(join(source, p), "utf8"));
const base = "7b66f8b303a316ff4560b4827d6dc728cd7f504a";
const beforeBaseline = JSON.parse(
  git(source, ["show", `${base}:docs/control/doc-baseline.json`]),
);
const baseline = read("docs/control/doc-baseline.json");
const retained = spawnSync(
  process.execPath,
  ["docs/evidence/WO-213/record-baseline.mjs"],
  { cwd: source, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
);
assert.equal(retained.status, 0);
const proof = JSON.parse(retained.stdout);
assert.equal(Object.keys(proof.homePaths).length, 37);
assert.equal(Object.values(proof.homePaths).flat().length, 291);
assert.deepEqual(baseline.homePaths, {
  ...beforeBaseline.homePaths,
  ...proof.homePaths,
});
for (const [key, value] of Object.entries(beforeBaseline))
  if (key !== "homePaths") assert.deepEqual(baseline[key], value);
const oldRegister = JSON.parse(
  git(source, ["show", `${base}:docs/planning/followups.json`]),
);
const register = read("docs/planning/followups.json");
assert(!HOME_DIRECTORY.test(JSON.stringify(register)));
const summaryChanges = [];
for (const entry of oldRegister.entries) {
  const after = register.entries.find((x) => x.id === entry.id);
  assert(after);
  assert.deepEqual(
    after.dispositions.slice(0, entry.dispositions.length),
    entry.dispositions,
  );
  assert.deepEqual(
    after.revisions.slice(0, entry.revisions.length),
    entry.revisions.map((r) => ({
      ...r,
      title: withoutHomeDirectories(r.title),
      summary: withoutHomeDirectories(r.summary),
    })),
  );
  for (let i = 0; i < entry.revisions.length; i++) {
    const a = entry.revisions[i].summary,
      b = after.revisions[i].summary;
    if (a !== b)
      summaryChanges.push({
        id: entry.id,
        revision: i + 1,
        beforeLength: a.length,
        afterLength: b.length,
        beforeSha256: digest(a),
        afterSha256: digest(b),
      });
  }
}
assert.equal(summaryChanges.length, 1);
assert.equal(summaryChanges[0].id, "FUP-de6162b279f66709");
assert.equal(
  summaryChanges[0].beforeSha256,
  "56b7a86bc33f19b9f21e54dd42e53c62dad658a413f77c9f6e37173f2137fc1e",
);
assert.equal(
  summaryChanges[0].afterSha256,
  "440fbb3a6bcc19959a468bd35e06d9bdfa403af735b8c3f5f715767bcda121ab",
);
assert.equal(
  followupStatus(register.entries.find((x) => x.id === "FUP-de6162b279f66709")),
  "deferred",
);
let variants = 0;
for (const lead of ["", " ", '"', "<home>", "\\n", "\\t", "\\u000a"])
  for (const prefix of ["/home/fixture-one", "/Users/fixture-two"])
    for (const tail of ["", "/x", "/Users/fixture-three"])
      for (const length of [1, 2, 3, 7, 31]) {
        const raw = lead + prefix.repeat(length) + tail;
        const scrub = withoutHomeDirectories(raw);
        assert(!HOME_DIRECTORY.test(scrub));
        assert.equal(withoutHomeDirectories(scrub), scrub);
        assert(scrub.length <= raw.length);
        for (const ext of ["json", "JSON", "jsonl", "log", "txt"])
          assert.deepEqual(privatePathLines(`record.${ext}`, raw), [1]);
        variants++;
      }
const repo = mkdtempSync(join(tmpdir(), "dotln-ver007-privacy-"));
const put = (p, text) => {
  mkdirSync(dirname(join(repo, p)), { recursive: true });
  writeFileSync(join(repo, p), text);
};
try {
  git(repo, ["init", "-q"]);
  put(
    "dotln.config.json",
    JSON.stringify({
      version: 1,
      roots: { docs: "manual", evidence: "proof" },
    }),
  );
  put("manual/product/00-check.md", "# Stable\n");
  const ceilings = {
    schemaVersion: 1,
    documents: {
      "00-check.md": {
        ceiling: 10000,
        nonExemptBytesAtLanding: 10000,
        date: "2026-10-17",
        decision: "fixture",
      },
    },
  };
  const localBaseline = {
    schemaVersion: 1,
    products: {},
    dispatches: {},
    links: [],
  };
  const recordNames = [
    "proof/WO-999/.json",
    "proof/WO-999/new.JsonL",
    "proof/WO-999/new.LOG",
    "proof/WO-999/new.TxT",
  ];
  for (const p of recordNames)
    put(p, 'safe\r\n"/home/fixture-private/part"\r\n');
  git(repo, ["add", "--", recordNames[0]]);
  put("manual/intake/private.json", "/home/fixture-private/x\n");
  put("manual/control/local/private.json", "/home/fixture-private/x\n");
  put("package.json", "{}\n");
  put("proof/ignored.json", "/home/fixture-private/x\n");
  put("proof/probe.mjs", "/home/fixture-private/x\n");
  put(".gitignore", "proof/ignored.json\n");
  assert.deepEqual(recordFiles(repo), [...recordNames].sort());
  const check = () => checkDocs(repo, { ceilings, baseline: localBaseline });
  const failing = check();
  assert.equal(failing.failures.length, 4);
  assert(failing.failures.every((x) => x.includes(":2:")));
  assert(!failing.failures.join("").includes("fixture-private"));
  localBaseline.homePaths = Object.fromEntries(
    homePathFindings(repo, recordNames).map((x) => [x.file, [x.fingerprint]]),
  );
  assert.deepEqual(check().failures, []);
  put(
    recordNames[0],
    readFileSync(join(repo, recordNames[0]), "utf8") +
      '"/home/fixture-private/part"\n',
  );
  assert.equal(check().failures.length, 1);
  put(recordNames[0], "/private/var/folders/fixture/T/x\n/tmp/fixture/x\n");
  assert.deepEqual(check().failures, []);
  for (const p of recordNames) put(p, "<home>/safe\n");
  assert.deepEqual(check().failures, []);
  rmSync(join(repo, "dotln.config.json"));
  put("KIT-MANIFEST.json", "{}\n");
  put(
    "package-lock.json",
    JSON.stringify({ packages: { "packages/fixture": {} } }),
  );
  put("packages/fixture/package.json", '{"name":"@dotln/fixture"}\n');
  put("packages/fixture/dist/src/bin.js", "export const value=1;\n");
  chmodSync(join(repo, "packages/fixture/dist/src/bin.js"), 0o755);
  const initial = gateInstanceInputDigest(repo),
    inventory = JSON.stringify(runtimePackageInventory(repo));
  for (const p of [
    "packages/.DS_Store",
    "packages/fixture/dist/.DS_Store",
    "packages/fixture/dist/src/test.tsbuildinfo",
    "packages/fixture/dist/.cache/value",
  ])
    put(p, "host metadata\n");
  chmodSync(join(repo, "packages/fixture/dist/src/bin.js"), 0o700);
  assert.equal(gateInstanceInputDigest(repo), initial);
  assert.equal(JSON.stringify(runtimePackageInventory(repo)), inventory);
  chmodSync(join(repo, "packages/fixture/dist/src/bin.js"), 0o644);
  assert.notEqual(gateInstanceInputDigest(repo), initial);
  chmodSync(join(repo, "packages/fixture/dist/src/bin.js"), 0o755);
  put("packages/fixture/dist/src/bin.js", "export const value=2;\n");
  assert.notEqual(gateInstanceInputDigest(repo), initial);
  put("packages/fixture/dist/src/bin.js", "export const value=1;\n");
  assert.equal(gateInstanceInputDigest(repo), initial);
  put("packages/fixture/tsconfig.json", "{}\n");
  assert.equal(gateInstanceInputDigest(repo), undefined);
  rmSync(join(repo, "packages/fixture/tsconfig.json"));
  symlinkSync("dist", join(repo, "packages/fixture/tsconfig.json"));
  assert.throws(
    () => gateInstanceInputDigest(repo),
    (error) =>
      !error.message.includes(repo) && /regular file/.test(error.message),
  );
  rmSync(join(repo, "packages/fixture/tsconfig.json"));
  assert.match(profileGuidance("releaseNotes", repo), /balanced default/);
  for (const name of ["Instance", "Example 🚀", "a".repeat(64)])
    assert.equal(
      validateConfig(
        "dotln.config.json",
        JSON.stringify({ version: 1, release: { displayName: name } }),
      ).release.displayName,
      name,
    );
  for (const name of [
    null,
    "",
    " padded",
    "padded ",
    "bad\tname",
    "bad\ud800",
    "App v1.2.3",
    "a".repeat(65),
  ])
    assert.throws(() =>
      validateConfig(
        "dotln.config.json",
        JSON.stringify({ version: 1, release: { displayName: name } }),
      ),
    );
  const result = {
    projectionVariants: variants,
    baseline: {
      oldEntries: Object.keys(beforeBaseline.homePaths).length,
      addedFiles: 37,
      addedLines: 291,
      counts: proof.counts,
    },
    originalRegisterEntries: oldRegister.entries.length,
    summaryChanges,
    documentRootsAndMultiplicity: true,
    runtimeMetadataStable: true,
    runtimeBytesAndExecutableBitBound: true,
    malformedSourceDeclarationRefused: true,
    readerDefault: true,
    releaseNames: { accepted: 3, refused: 8 },
  };
  writeFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "ver007-privacy-runtime.json",
    ),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  rmSync(repo, { recursive: true, force: true });
}
