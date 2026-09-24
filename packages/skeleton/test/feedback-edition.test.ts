// WO-154: feedback editions by reference. A schema 2 edition commits its
// verifier stream with every body replaced by a Git blob reference, keys
// staleness on the judged behavior, and keeps D010's refusal: a behavioral
// change never inherits an older live audit.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
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
import { fileURLToPath } from "node:url";
import { appendEvent, type JsonValue } from "@dotln/kernel";
import { canonicalStringify } from "@dotln/compiler";
import {
  EditionReferenceError,
  FEEDBACK_EDITION_SCHEMA,
  FEEDBACK_REPORT_SUBJECT_PATH,
  checkFeedbackEdition,
  editionBodies,
  feedbackEditionIdentities,
  feedbackPolicyBehavior,
  judgedDrift,
  liveAuditCandidates,
  projectEditionLog,
  resolveEditionLog,
  validateSelfhostEdition,
  type FeedbackEditionRecord,
  type FileReference,
  type LiveAuditReference,
} from "../src/feedback-selfhost.js";
import {
  feedbackSourceFile,
  readFeedbackSource,
} from "../src/feedback-audit.js";
import { feedbackContentHash } from "../src/feedback-boundary.js";
import { personalFeedback } from "../src/loadouts/feedback.js";
import { currentEvidence } from "../src/evidence-editions.mjs";

const root = fileURLToPath(new URL("../../../../", import.meta.url)).replace(
  /\/$/u,
  "",
);

function repository(t: { after: (fn: () => void) => void }) {
  const directory = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-feedback-edition-")),
  );
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: directory, encoding: "utf8" }).trim();
  git("init", "--quiet");
  git("config", "user.email", "fixture@example.invalid");
  git("config", "user.name", "Fixture");
  const write = (path: string, contents: string) => {
    mkdirSync(dirname(join(directory, path)), { recursive: true });
    writeFileSync(join(directory, path), contents);
  };
  const hasObject = (hash: string) =>
    spawnSync("git", ["cat-file", "-e", hash], { cwd: directory }).status === 0;
  return { directory, git, write, hasObject };
}
const referenceKeys = (entry: object) =>
  Object.keys(entry)
    .filter((key) => key !== "derivedFrom")
    .sort()
    .join();

test("WO-154 a reference rebuilds its body from the working tree before commit and from Git after it; a missing body is named", (t) => {
  const { directory, git, write, hasObject } = repository(t);
  write("a.txt", "alpha\n");
  const bodies = editionBodies(directory);
  const reference = bodies.reference({ path: "a.txt", contents: "alpha\n" });
  assert.equal(referenceKeys(reference), "blobHash,bytes,path");
  assert.equal(reference.blobHash, git("hash-object", "a.txt"));
  assert.equal(reference.bytes, 6);

  // Not yet committed: no object exists, the working-tree file supplies it.
  assert.equal(hasObject(reference.blobHash), false);
  assert.deepEqual(bodies.resolve([reference]), ["alpha\n"]);

  // Committed, then the working tree moves on: Git supplies the body.
  git("add", "a.txt");
  git("commit", "--quiet", "-m", "fixture");
  write("a.txt", "beta\n");
  assert.equal(hasObject(reference.blobHash), true);
  assert.deepEqual(bodies.resolve([reference]), ["alpha\n"]);

  // A synthesized package projection rebuilds from the blob it names.
  const lock = `${JSON.stringify({ name: "x", version: "1.0.0", lockfileVersion: 3, packages: { "": { name: "x", version: "1.0.0" } } }, null, 2)}\n`;
  write("package-lock.json", lock);
  const projected = feedbackSourceFile("package-lock.json", lock);
  const derived = bodies.reference(projected);
  assert.equal(derived.path, ".feedback-source/package-lock.json");
  assert.equal(derived.derivedFrom?.path, "package-lock.json");
  assert.deepEqual(bodies.resolve([derived]), [projected.contents]);

  // A report judged at another path resolves from a named candidate file.
  write("edition/feedback.json", "{}\n");
  const report = editionBodies(directory, ["edition/feedback.json"]);
  assert.deepEqual(
    report.resolve([
      report.reference({
        path: FEEDBACK_REPORT_SUBJECT_PATH,
        contents: "{}\n",
      }),
    ]),
    ["{}\n"],
  );

  // Neither the tree nor Git holds it: stale, by path.
  const missing: FileReference = {
    path: "c.txt",
    blobHash: bodies.reference({ path: "c.txt", contents: "gamma\n" }).blobHash,
    bytes: 6,
  };
  const log = `${JSON.stringify({ payload: { subject: { files: [reference, missing] } } })}\n`;
  assert.throws(
    () => resolveEditionLog(log, bodies.resolve),
    (error: unknown) =>
      error instanceof EditionReferenceError &&
      error.paths.join() === "c.txt" &&
      /unresolvable edition reference: c\.txt/u.test(error.message),
  );
});

// D011 (FUP-0c86ada82f559914): the live audit's pins snapshot is a
// working-tree candidate, so a pin-bearing body no commit holds still
// resolves, and recording needs no object write.
test("WO-154 the pins snapshot resolves a stranded derived reference from the working tree, with no Git object", (t) => {
  const { directory, write, hasObject } = repository(t);
  const lock = (version: string) =>
    `${JSON.stringify({ name: "x", version, lockfileVersion: 3, packages: { "": { name: "x", version } } }, null, 2)}\n`;
  write("package-lock.json", lock("1.0.0"));
  const projected = feedbackSourceFile("package-lock.json", lock("1.0.0"));
  const derived = editionBodies(directory).reference(projected);
  const pinned = derived.derivedFrom!.blobHash;
  // A release bump rewrites the lockfile before any commit holds its bytes.
  write("package-lock.json", lock("1.0.1"));
  const live = {
    edition: "edition",
    report: { path: "edition/feedback.json" },
  } as LiveAuditReference;
  const resolve = () =>
    editionBodies(directory, liveAuditCandidates(directory, live)).resolve([
      derived,
    ]);
  assert.deepEqual(liveAuditCandidates(directory, live), [
    "edition/feedback.json",
  ]);
  assert.deepEqual(resolve(), [undefined]);
  write(`edition/pins/${pinned}`, lock("1.0.0"));
  assert.deepEqual(liveAuditCandidates(directory, live), [
    "edition/feedback.json",
    `edition/pins/${pinned}`,
  ]);
  assert.deepEqual(resolve(), [projected.contents]);
  assert.equal(hasObject(pinned), false);
});

test("WO-154 a verifier stream committed by reference rebuilds byte for byte and leaves other records alone", (t) => {
  const { directory, write } = repository(t);
  const files = [
    { path: "src/a.ts", contents: "export const a = 1;\n" },
    { path: "src/b.ts", contents: "export const b = 'é';\n" },
  ];
  for (const file of files) write(file.path, file.contents);
  let log = "";
  const draft = (type: string, payload: object) => {
    log = appendEvent(log, {
      schemaVersion: 1,
      type,
      actorId: "fixture",
      workstreamId: "ws_fixture",
      occurredAt: 1,
      payload: payload as JsonValue,
    }).log;
  };
  draft("VerificationOpened", {
    subject: { revision: "r", files },
    baseline: { revision: "b", files: files.slice(0, 1) },
  });
  draft("CommandPersisted", {
    command: { intent: { payload: { capsule: { subject: { files } } } } },
  });
  draft("WorkerHeartbeat", { files: [], note: "no bodies" });
  const bodies = editionBodies(directory);
  const projected = projectEditionLog(log, bodies.reference);
  const [opened, persisted, heartbeat] = projected.trim().split("\n");
  assert.equal(heartbeat, log.trim().split("\n")[2]);
  const subject = JSON.parse(opened!).payload.subject.files as object[];
  assert.ok(
    subject.every((entry) => referenceKeys(entry) === "blobHash,bytes,path"),
  );
  assert.ok(
    (
      JSON.parse(persisted!).payload.command.intent.payload.capsule.subject
        .files as object[]
    ).every((entry) => referenceKeys(entry) === "blobHash,bytes,path"),
  );
  assert.equal(resolveEditionLog(projected, bodies.resolve), log);
});

test("WO-154 the behavioral identity moves with a judged change and not with release labels; the pins record moves with the labels", () => {
  const current = readFeedbackSource(root);
  const base = feedbackEditionIdentities(current.files);
  const replace = (path: string, contents: string) => {
    const projected = feedbackSourceFile(path, contents);
    return current.files.map((file) =>
      file.path === projected.path ? projected : file,
    );
  };
  const lock = JSON.parse(
    readFileSync(join(root, "package-lock.json"), "utf8"),
  ) as {
    packages: Record<
      string,
      { version?: string; dependencies: Record<string, string> }
    >;
  };
  lock.packages["packages/skeleton"]!.version = "99.0.0";
  lock.packages["packages/console"]!.dependencies["@dotln/skeleton"] = "99.0.0";
  lock.packages["packages/skeleton"]!.dependencies["@dotln/compiler"] =
    "98.0.0";
  const pinsOnly = replace(
    "package-lock.json",
    `${JSON.stringify(lock, null, 2)}\n`,
  ).map((file) =>
    file.path === "packages/compiler/src/artifact-identity.ts"
      ? {
          path: file.path,
          contents: file.contents.replace(
            /COMPILER_PACKAGE_VERSION = "[^"]+"/u,
            'COMPILER_PACKAGE_VERSION = "98.0.0"',
          ),
        }
      : file,
  );
  const labels = feedbackEditionIdentities(pinsOnly);
  assert.equal(labels.behavior, base.behavior);
  assert.notEqual(labels.pins, base.pins);
  assert.deepEqual(judgedDrift(current.files, pinsOnly, true), []);
  assert.deepEqual(judgedDrift(current.files, pinsOnly, false), [
    ".feedback-source/package-lock.json",
    "packages/compiler/src/artifact-identity.ts",
  ]);

  // An external dependency pin in the lockfile is behavior.
  lock.packages["packages/skeleton"]!.dependencies.typescript = "0.0.1";
  const external = replace(
    "package-lock.json",
    `${JSON.stringify(lock, null, 2)}\n`,
  );
  assert.notEqual(feedbackEditionIdentities(external).behavior, base.behavior);
  assert.deepEqual(judgedDrift(current.files, external, true), [
    ".feedback-source/package-lock.json",
  ]);

  // A judged module (D010's worker-store.ts) is behavior; the pins stay.
  const store = "packages/skeleton/src/worker-store.ts";
  const changed = current.files.map((file) =>
    file.path === store
      ? { path: store, contents: `${file.contents}\n// changed\n` }
      : file,
  );
  const behavior = feedbackEditionIdentities(changed);
  assert.notEqual(behavior.behavior, base.behavior);
  assert.equal(behavior.pins, base.pins);
  assert.deepEqual(judgedDrift(current.files, changed, true), [store]);

  // policyHash embeds the compiler label; the policy's content does not.
  const program = personalFeedback();
  assert.equal(
    feedbackPolicyBehavior(program),
    feedbackPolicyBehavior({
      ...program,
      compilerPackageVersion: "98.0.0",
      policyHash: "fnv1a64:other",
    }),
  );
  assert.notEqual(
    feedbackPolicyBehavior(program),
    feedbackPolicyBehavior({ ...program, units: program.units.slice(1) }),
  );
});

/** The live audit an edition names, rebuilt from its references. */
function liveAudit(edition: FeedbackEditionRecord) {
  const live = edition.liveAudit;
  const bodies = editionBodies(root, [live.report.path]);
  const [reportText, auditLog, projected] = bodies.resolve([
    live.report,
    live.audit,
    live.verification,
  ]) as [string, string, string];
  return {
    reportText,
    auditLog,
    projected,
    verifierLog: resolveEditionLog(projected, bodies.resolve),
  };
}
const openingFiles = (log: string) =>
  JSON.parse(
    log
      .split("\n")
      .find((line) => line.includes('"type":"VerificationOpened"'))!,
  ).payload.subject.files as Record<string, unknown>[];

test("WO-154 criterion 3: a behavioral change never inherits an older live audit, with the behavioral check bypassed; the D010 comparison passes mechanically", () => {
  const selected = currentEvidence(root, "feedback").directory;
  const edition = JSON.parse(
    readFileSync(join(root, selected, "edition.json"), "utf8"),
  ) as FeedbackEditionRecord;
  assert.equal(edition.schemaVersion, FEEDBACK_EDITION_SCHEMA);
  const { reportText, auditLog, projected, verifierLog } = liveAudit(edition);
  const program = personalFeedback();
  // The selected edition's report stands in for the regenerated one; a
  // carried edition's differs from its live audit's only in identity fields.
  const report = JSON.parse(
    readFileSync(join(root, selected, "feedback.json"), "utf8"),
  ) as { subject: string; policyHash: string };

  // The by-reference shape is asserted only here.
  assert.ok(
    openingFiles(projected).every(
      (entry) => referenceKeys(entry) === "blobHash,bytes,path",
    ),
  );

  // The unchanged tree is judged; a behavioral change to a judged module is
  // the WO-147 D010 case: the regenerated report differs only in `subject`.
  const current = readFeedbackSource(root);
  const store = "packages/skeleton/src/worker-store.ts";
  const files = current.files.map((file) =>
    file.path === store
      ? { path: store, contents: `${file.contents}\n// behavior\n` }
      : file,
  );
  const changed = {
    files,
    subject: feedbackContentHash(canonicalStringify(files)),
  };
  const changedReport = { ...report, subject: changed.subject };
  assert.deepEqual(
    { ...report, subject: changedReport.subject },
    changedReport,
    "D010's field-by-field comparison: only the subject differs",
  );
  const judge = (
    record: FeedbackEditionRecord,
    source: typeof current,
    regenerated: object,
  ) =>
    checkFeedbackEdition({
      root,
      edition: record,
      reportText: readFileSync(join(root, selected, "feedback.json"), "utf8"),
      current: source,
      report: regenerated as never,
      program,
    });
  judge(edition, current, report);
  assert.throws(
    () => judge(edition, changed, changedReport),
    /feedback evidence is stale: judged behavior changed since .* \(packages\/skeleton\/src\/worker-store\.ts\)/u,
  );

  // Bypass 1: the edition claims the changed tree's behavioral identity.
  const forged = {
    ...edition,
    behavior: {
      ...edition.behavior,
      identity: feedbackEditionIdentities(files).behavior,
    },
  };
  assert.throws(
    () => judge(forged, changed, changedReport),
    /edition behavior identity does not bind its live audit/u,
  );

  // Bypass 2: no identity at all; the live audit's own per-file judgment
  // still refuses, with or without component release labels admitted.
  for (const labels of [false, true])
    assert.throws(
      () =>
        validateSelfhostEdition({
          auditLog,
          verifierLog,
          reportText,
          current: changed,
          program,
          labels,
        }),
      labels
        ? /verifier source is stale: packages\/skeleton\/src\/worker-store\.ts/u
        : /selfhost audit source is stale/u,
    );

  // The schema 1 shape refuses the same change; only the shape differs.
  const legacy = "docs/evidence/WO-157/feedback-002";
  const legacyLog = readFileSync(
    join(root, legacy, "selfhost-verification.jsonl"),
    "utf8",
  );
  assert.ok(
    openingFiles(legacyLog).every(
      (entry) => referenceKeys(entry) === "contents,path",
    ),
  );
  assert.throws(
    () =>
      validateSelfhostEdition({
        auditLog: readFileSync(
          join(root, legacy, "selfhost-audit.jsonl"),
          "utf8",
        ),
        verifierLog: legacyLog,
        reportText: readFileSync(join(root, legacy, "feedback.json"), "utf8"),
        current: changed,
        program,
        labels: true,
      }),
    /verifier source is stale: .*packages\/skeleton\/src\/worker-store\.ts/u,
  );
});
