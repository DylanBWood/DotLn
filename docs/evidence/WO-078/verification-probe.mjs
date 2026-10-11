import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repository = realpathSync(resolve(process.argv[2] ?? process.cwd()));
const run = (command, args, cwd, overrides = {}) =>
  spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...overrides },
    maxBuffer: 8 * 1024 * 1024,
  });
const ok = (result, label) => {
  assert.equal(result.status, 0, `${label}: ${result.stderr}${result.stdout}`);
  return result;
};
assert.equal(
  ok(
    run("git", ["rev-parse", "--show-toplevel"], repository),
    "source root",
  ).stdout.trim(),
  repository,
);
const { writeReceipt, resolveReceipt, buildHashOf } = await import(
  pathToFileURL(join(repository, "scripts/lib/siblings.mjs"))
);
const { planUpdate } = await import(
  pathToFileURL(join(repository, "scripts/launchpad.mjs"))
);
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo078-verify-")),
);
const root = join(scratch, "launchpad");
const registryRelative = "registry-store/README.md";
const declarationRelative = "registry-store/siblings.json";
const write = (relative, bytes) => {
  mkdirSync(dirname(join(root, relative)), { recursive: true });
  writeFileSync(join(root, relative), bytes);
};
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const generator = (args) =>
  run(
    process.execPath,
    [join(repository, "scripts/siblings.mjs"), ...args],
    scratch,
    { DOTLN_LAUNCHPAD: root },
  );
const registry = () => readFileSync(join(root, registryRelative), "utf8");
const observations = [];
const report = (name, value) => observations.push({ name, ...value });
try {
  mkdirSync(root);
  ok(run("git", ["init", "-q", "-b", "main"], root), "fixture init");
  assert.equal(
    ok(
      run("git", ["rev-parse", "--show-toplevel"], root),
      "fixture root",
    ).stdout.trim(),
    root,
  );
  ok(
    run("git", ["config", "maintenance.auto", "false"], root),
    "fixture maintenance",
  );
  write(
    "dotln.config.json",
    json({
      version: 1,
      roots: {
        docs: "record-base",
        siblings: "registry-store",
        evidence: "receipt-store",
      },
    }),
  );
  const declaration = {
    schemaVersion: 1,
    siblings: [
      {
        id: "Verifier.Starter",
        purpose: "Synthetic exported sibling.",
        relation: { kind: "export", coreCommit: null },
        capabilityRows: ["launchpad.starter"],
      },
      {
        id: "Verifier.Consumer",
        purpose: "Synthetic consumer.",
        relation: { kind: "consumer", contractVersion: "synthetic-v1" },
        capabilityRows: [],
      },
    ],
  };
  write(declarationRelative, json(declaration));
  write("README.md", "Synthetic verification launchpad.\n");
  ok(run("git", ["add", "."], root), "fixture add");
  ok(
    run(
      "git",
      [
        "-c",
        "user.name=DotLn Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "commit",
        "-qm",
        "synthetic declaration",
      ],
      root,
    ),
    "fixture commit",
  );
  const commit = ok(
    run("git", ["rev-parse", "HEAD"], root),
    "fixture commit identity",
  ).stdout.trim();
  ok(run("git", ["tag", "v1.0.0"], root), "fixture tag");
  const start = performance.now();
  ok(generator(["index"]), "empty relocated generation");
  const ms = performance.now() - start;
  assert.equal(
    (
      registry().match(
        /^- \*\*(?:Kit version|Core commit|Manifest hash|Build hash|Last receipt|Orders in core that advanced it):\*\* not evidenced$/gm,
      ) ?? []
    ).length,
    12,
  );
  assert.equal(existsSync(join(root, "docs")), false);
  ok(generator(["index", "--check"]), "empty relocated check");
  report("relocated roots and no receipts", {
    checkExit: 0,
    missingFields: 12,
    generatorMs: Math.round(ms),
    registryBytes: Buffer.byteLength(registry()),
    defaultDocsCreated: false,
  });

  const manifestBytes = Buffer.from(
    json({
      schemaVersion: 1,
      commit,
      tag: "v1.0.0",
      files: [{ path: "scripts/synthetic.mjs", sha256: digest("synthetic\n") }],
    }),
  );
  const written = writeReceipt(root, {
    sibling: "Verifier.Starter",
    coreCommit: commit,
    manifestBytes,
    buildHash: buildHashOf(".runtime/harness/1234567890abcdef"),
  });
  assert.deepEqual(Object.keys(written.receipt).sort(), [
    "buildHash",
    "coreCommit",
    "date",
    "manifestHash",
    "sibling",
  ]);
  assert.equal(written.receipt.manifestHash, `sha256:${digest(manifestBytes)}`);
  assert.ok(
    written.path.startsWith("receipt-store/siblings/Verifier.Starter/"),
  );
  assert.equal(
    resolveReceipt(root, "/unrelated/VERIFIER.STARTER").sibling,
    "Verifier.Starter",
  );
  assert.equal(
    resolveReceipt(root, "/unrelated/renamed-checkout", {
      names: ["verifier.starter"],
    }).sibling,
    "Verifier.Starter",
  );
  const undeclared = resolveReceipt(root, "/unrelated/not-declared");
  assert.equal(undeclared.sibling, null);
  ok(generator(["index"]), "receipt generation");
  ok(generator(["index", "--check"]), "receipt check");
  const original = registry();
  assert.match(original, /- \*\*Kit version:\*\* `v1\.0\.0`/);
  report("receipt, root paths and destination names", {
    exactFields: true,
    manifestHashMatches: true,
    buildHashMatches: true,
    checkExit: 0,
    caseInsensitive: true,
    remoteNameAccepted: true,
    undeclaredSibling: null,
  });

  const purposeEdit = original.replace(
    "Synthetic exported sibling.",
    "Edited without changing the declaration.",
  );
  write(registryRelative, purposeEdit);
  const edited = generator(["index", "--check"]);
  assert.equal(edited.status, 1);
  assert.equal(registry(), purposeEdit);
  report("simple hand edit", {
    checkExit: edited.status,
    refusal: edited.stderr.trim(),
    wroteNothing: true,
  });
  write(registryRelative, original);

  const receiptBytes = readFileSync(join(root, written.path), "utf8");
  const staleReceipt = {
    ...written.receipt,
    manifestHash: `sha256:${"f".repeat(64)}`,
  };
  write(written.path, json(staleReceipt));
  const stale = generator(["index", "--check"]);
  assert.equal(stale.status, 1);
  assert.ok(stale.stderr.includes(written.path));
  assert.equal(registry(), original);
  report("latest receipt hash mismatch", {
    checkExit: stale.status,
    refusal: stale.stderr.trim(),
    wroteNothing: true,
  });
  write(written.path, receiptBytes);

  write(written.path, "{ definitely not JSON");
  for (const args of [["index"], ["index", "--check"]]) {
    const broken = generator(args);
    assert.equal(broken.status, 1);
    assert.ok(broken.stderr.includes(written.path));
    assert.equal(registry(), original);
    report("undecodable receipt", {
      mode: args.join(" "),
      exit: broken.status,
      receiptNamed: true,
      wroteNothing: true,
    });
  }
  write(written.path, receiptBytes);

  const versionOnly = original.replaceAll("`v1.0.0`", "`v9.8.7-forged`");
  write(registryRelative, versionOnly);
  const ordinaryVersionEdit = generator(["index", "--check"]);
  assert.equal(ordinaryVersionEdit.status, 1);
  report("visible version hand edit only", {
    checkExit: ordinaryVersionEdit.status,
    refusal: ordinaryVersionEdit.stderr.trim(),
  });

  const forged = original.replaceAll("v1.0.0", "v9.8.7-forged");
  write(registryRelative, forged);
  const accepted = generator(["index", "--check"]);
  assert.equal(accepted.status, 0, accepted.stderr);
  assert.equal(registry(), forged);
  assert.equal(
    ok(
      run("git", ["tag", "--points-at", commit], root),
      "unchanged fixture tags",
    ).stdout.trim(),
    "v1.0.0",
  );
  assert.equal(readFileSync(join(root, written.path), "utf8"), receiptBytes);
  report("visible version and embedded tag record hand edit", {
    checkExit: accepted.status,
    expectedExit: 1,
    falseVersion: "v9.8.7-forged",
    trueGitTag: "v1.0.0",
    receiptUnchanged: true,
    declarationUnchanged:
      readFileSync(join(root, declarationRelative), "utf8") ===
      json(declaration),
    pageRemainsForged: true,
    output: accepted.stdout.trim(),
  });

  write(registryRelative, original);
  ok(run("git", ["tag", "v1.1.0"], root), "later fixture tag");
  const laterTag = generator(["index", "--check"]);
  assert.equal(laterTag.status, 0);
  assert.equal(registry(), original);
  report("later tag without page edit", {
    checkExit: laterTag.status,
    originalVersionPreserved: true,
    output: laterTag.stdout.trim(),
  });

  const updateRoot = join(scratch, "update-plan");
  mkdirSync(join(updateRoot, "scripts"), { recursive: true });
  const file = "scripts/synthetic.mjs";
  const prior = { files: [{ path: file, sha256: digest("prior") }] };
  const next = { files: [{ path: file, sha256: digest("incoming") }] };
  writeFileSync(join(updateRoot, file), "incoming");
  assert.equal(planUpdate(prior, next, updateRoot)[0].kind, "replace");
  writeFileSync(join(updateRoot, file), "local edit");
  assert.equal(planUpdate(prior, next, updateRoot)[0].kind, "refuse");
  writeFileSync(join(updateRoot, file), "interrupted");
  assert.equal(
    planUpdate(prior, next, updateRoot, {
      files: [{ path: file, sha256: digest("interrupted") }],
    })[0].kind,
    "replace",
  );
  rmSync(join(updateRoot, file));
  assert.throws(
    () => planUpdate(prior, next, updateRoot),
    /cannot read regular file/,
  );
  assert.equal(
    planUpdate(prior, next, updateRoot, { files: [] })[0].kind,
    "add",
  );
  report("independent update-plan ownership and interruption variations", {
    convergedAccepted: true,
    localEditRefused: true,
    pendingBytesAccepted: true,
    missingWithoutPendingRefused: true,
    droppedPendingPathReadded: true,
  });
  console.log(
    JSON.stringify({ cutoff: new Date().toISOString(), observations }, null, 2),
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
