#!/usr/bin/env node
import { docRelative, findLaunchpad } from "./lib/config.mjs";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { join } from "node:path";
import {
  evidenceArgs,
  sameEvidenceSourceContent,
} from "../packages/skeleton/src/evidence-editions.mjs";
import {
  checkEvidenceImports,
  evidenceSources,
  relativeImports,
} from "./lib/evidence-sources.mjs";
import { canonicalStringify } from "@dotln/compiler";
import { personalFeedback } from "../packages/skeleton/dist/src/loadouts/feedback.js";
import {
  FEEDBACK_SOURCE_PATHS,
  readFeedbackSource,
  runFeedbackRegressions,
} from "../packages/skeleton/dist/src/feedback-audit.js";
import {
  FEEDBACK_BEHAVIOR_METHOD,
  FEEDBACK_EDITION_SCHEMA,
  FEEDBACK_REFERENCE_SEMANTICS,
  checkFeedbackEdition,
  editionBodies,
  feedbackEditionIdentities,
  gitBlobHash,
  judgedBehavior,
  liveAuditCandidates,
  projectEditionLog,
  resolveEditionLog,
  validateSelfhostEdition,
} from "../packages/skeleton/dist/src/feedback-selfhost.js";

const root = findLaunchpad();
const { args, selection } = evidenceArgs(
  root,
  "feedback",
  process.argv.slice(2),
);
const destination = join(root, selection.directory);
const mode = args[0];
if (!(
  (args.length === 1 && ["--write", "--check", "--pins"].includes(mode)) ||
  (args.length === 2 && ["--record-selfhost", "--carry"].includes(mode))
))
  throw new Error(
    "usage: feedback-evidence.mjs --write|--check|--pins|--record-selfhost <store>|--carry <edition directory> [--edition WO-NNN [--revision NNN]] (build first; run --write before --record-selfhost)",
  );
checkEvidenceImports(root, "feedback");
// A request protocol a subject file imports changes what the subject's
// transports accept, so it is part of the subject too (WO-157 item 12).
const unsubjected = FEEDBACK_SOURCE_PATHS.flatMap((path) =>
  /\.(?:ts|mjs|js)$/u.test(path)
    ? relativeImports(root, path)
        .filter(
          (target) =>
            target.endsWith("-protocol.ts") &&
            !FEEDBACK_SOURCE_PATHS.includes(target),
        )
        .map((target) => `${path} imports ${target}`)
    : [],
);
if (unsubjected.length)
  throw new Error(
    `feedback subject omits an imported request protocol: ${unsubjected.join("; ")}; add it to FEEDBACK_SOURCE_PATHS`,
  );
const json = (value) => JSON.stringify(value, null, 2) + "\n";
function immutableWrite(name, source) {
  const path = join(destination, name);
  if (existsSync(path)) {
    assert.equal(
      readFileSync(path, "utf8"),
      source,
      "evidence edition is immutable; choose a new edition",
    );
    return;
  }
  mkdirSync(destination, { recursive: true });
  writeFileSync(path, source, { flag: "wx" });
}
const reportPath = docRelative(root, "evidence", "WO-011/feedback.json");
/** Schema 1 editions keep their exact comparison (WO-154 D001). */
const validateSelfhost = (auditLog, verifierLog) =>
  validateSelfhostEdition({
    auditLog,
    verifierLog,
    reportText: readFileSync(join(destination, "feedback.json"), "utf8"),
    current: readFeedbackSource(root),
    program: personalFeedback(),
    reportPath,
  });
/** A schema 2 edition record, or null for a schema 1 edition. */
function readEdition(directory) {
  const path = join(root, directory, "edition.json");
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}
/** The pins record's readable half: each component's release label. */
const components = () =>
  Object.fromEntries(
    ["beacons", "compiler", "console", "kernel", "skeleton"].map((name) => [
      `@dotln/${name}`,
      JSON.parse(
        readFileSync(join(root, "packages", name, "package.json"), "utf8"),
      ).version,
    ]),
  );
function editionRecord(report, identities, liveAudit) {
  return {
    schemaVersion: FEEDBACK_EDITION_SCHEMA,
    kind: "feedback-evidence-edition",
    references: {
      objectFormat: editionBodies(root).format,
      semantics: FEEDBACK_REFERENCE_SEMANTICS,
    },
    subject: report.subject,
    behavior: {
      identity: identities.behavior,
      method: FEEDBACK_BEHAVIOR_METHOD,
      files: FEEDBACK_SOURCE_PATHS.length,
    },
    pins: { identity: identities.pins, components: components() },
    liveAudit,
  };
}
/** The pins snapshot (WO-154 D007): the raw bytes behind every judged file
 * that carries a component release label, kept beside the edition under its
 * blob identity. The resolver reads it from the working tree (D011), so a
 * pins-only change cannot strand a reference whose recorded bytes land in no
 * commit, before or after the edition's own. */
function writePins(directory) {
  const live = readEdition(directory).liveAudit;
  assert.equal(live.edition, directory, "a carried edition keeps no pins");
  const bodies = editionBodies(root, liveAuditCandidates(root, live));
  const [projected] = bodies.resolve([live.verification]);
  if (projected === undefined)
    throw new Error(
      `feedback evidence is stale: unresolvable edition reference: ${live.verification.path}`,
    );
  const opening = projected
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .find((event) => event.type === "VerificationOpened");
  const judged = opening.payload.subject.files.filter(
    (file) => file.path !== reportPath && !file.derivedFrom,
  );
  // A synthesized projection always carries labels; a repository file only
  // when normalizing its labels changes it.
  const judgedBodies = bodies.resolve(judged);
  const raw = [
    ...opening.payload.subject.files.flatMap((file) =>
      file.derivedFrom ? [file.derivedFrom] : [],
    ),
    ...judged.filter((file, i) => {
      const body = judgedBodies[i];
      if (body === undefined)
        throw new Error(
          `feedback evidence is stale: unresolvable edition reference: ${file.path}`,
        );
      return judgedBehavior({ path: file.path, contents: body }) !== body;
    }),
  ];
  const texts = bodies.resolve(raw);
  const missing = raw.filter((_, i) => texts[i] === undefined);
  if (missing.length)
    throw new Error(
      `feedback evidence is stale: unresolvable edition reference: ${missing.map((file) => file.path).join(", ")}`,
    );
  mkdirSync(join(root, directory, "pins"), { recursive: true });
  for (const [i, file] of raw.entries()) {
    const path = join(root, directory, "pins", file.blobHash);
    if (existsSync(path))
      assert.equal(
        readFileSync(path, "utf8"),
        texts[i],
        "evidence edition is immutable; choose a new edition",
      );
    else writeFileSync(path, texts[i], { flag: "wx" });
    assert.equal(
      gitBlobHash(readFileSync(path), bodies.format),
      file.blobHash,
      `pins snapshot does not hash to its identity: ${file.path}`,
    );
  }
  return raw.map((file) => file.path);
}
const check = (directory, edition, report) =>
  checkFeedbackEdition({
    root,
    edition,
    reportText: readFileSync(join(root, directory, "feedback.json"), "utf8"),
    current: readFeedbackSource(root),
    report,
    program: personalFeedback(),
    reportPath,
  });
if (mode === "--record-selfhost") {
  const auditLog = readFileSync(join(args[1], "audit/events.jsonl"), "utf8");
  const verifierLog = readFileSync(
    join(args[1], "verifier/events.jsonl"),
    "utf8",
  );
  validateSelfhost(auditLog, verifierLog);
  // Schema 2 (WO-154): the verifier stream is committed by reference, and
  // only after the references rebuild the store's bytes exactly.
  const own = (name) => `${selection.directory}/${name}`;
  const bodies = editionBodies(root, [own("feedback.json")]);
  const projected = projectEditionLog(verifierLog, bodies.reference);
  assert.equal(
    resolveEditionLog(projected, bodies.resolve),
    verifierLog,
    "edition references must rebuild the recorded verifier stream byte for byte",
  );
  immutableWrite("selfhost-audit.jsonl", auditLog);
  immutableWrite("selfhost-verification.jsonl", projected);
  const identities = feedbackEditionIdentities(readFeedbackSource(root).files);
  const [report, audit, verification] = [
    "feedback.json",
    "selfhost-audit.jsonl",
    "selfhost-verification.jsonl",
  ].map((name) =>
    bodies.reference({
      path: own(name),
      contents: readFileSync(join(root, own(name)), "utf8"),
    }),
  );
  immutableWrite(
    "edition.json",
    json(
      editionRecord(
        JSON.parse(readFileSync(join(root, own("feedback.json")), "utf8")),
        identities,
        {
          edition: selection.directory,
          carried: false,
          pins: identities.pins,
          report,
          audit,
          verification,
        },
      ),
    ),
  );
  const pinned = writePins(selection.directory);
  console.log(
    `Recorded the audited selfhost and the independent verifier stream by reference (${Buffer.byteLength(projected)} of ${Buffer.byteLength(verifierLog)} bytes), with a pins snapshot of ${pinned.join(", ")}.`,
  );
} else if (mode === "--pins") {
  const pinned = writePins(selection.directory);
  console.log(`Pins snapshot of ${selection.directory}: ${pinned.join(", ")}.`);
} else if (mode === "--carry") {
  // A pins-only change: a deterministic edition naming the live audit it
  // carries, refused when the judged behavior changed (WO-154 D001).
  const origin = args[1].replace(/\/+$/u, "");
  const from = readEdition(origin);
  assert.ok(
    from,
    `carry requires a schema ${FEEDBACK_EDITION_SCHEMA} edition: ${origin}`,
  );
  assert.notEqual(origin, selection.directory, "carry into a new edition");
  const report = runFeedbackRegressions(root, personalFeedback());
  const { identities, live } = check(origin, from, report);
  immutableWrite("feedback.json", json(report));
  immutableWrite(
    "edition.json",
    json(
      editionRecord(report, identities, {
        ...live,
        carried: true,
        carriedFrom: editionBodies(root).reference({
          path: `${origin}/edition.json`,
          contents: readFileSync(join(root, origin, "edition.json"), "utf8"),
        }),
      }),
    ),
  );
  check(selection.directory, readEdition(selection.directory), report);
  console.log(
    `Carried the live feedback audit of ${live.edition} into ${selection.directory}: only component release labels moved; no live episode.`,
  );
} else {
  const report = runFeedbackRegressions(root, personalFeedback());
  if (mode === "--write") {
    immutableWrite("feedback.json", json(report));
  } else if (readEdition(selection.directory)) {
    const { live, pinsMoved } = check(
      selection.directory,
      readEdition(selection.directory),
      report,
    );
    // The console binds the edition's report to the current compiled policy.
    // A compiler release moves that hash without changing the behavior, so
    // the live audit is carried into a new edition; no live episode.
    const own = JSON.parse(
      readFileSync(join(destination, "feedback.json"), "utf8"),
    );
    if (own.policyHash !== report.policyHash)
      throw new Error(
        `feedback evidence is stale: a compiler release moved the policy hash since ${selection.directory} (${own.policyHash} to ${report.policyHash}); carry its live audit into a new edition with node scripts/feedback-evidence.mjs --carry ${selection.directory} --edition WO-NNN --revision NNN (no live episode)`,
      );
    console.log(
      live.carried
        ? `Carried live feedback audit ${live.edition}, named by ${selection.directory}${pinsMoved ? "; component release labels moved since" : ""}.`
        : pinsMoved
          ? `Retained live feedback audit ${live.edition}: component release labels moved since it was recorded; the judged behavior is unchanged.`
          : `Live feedback audit ${live.edition} judged the current source.`,
    );
  } else {
    const recorded = JSON.parse(
      readFileSync(join(destination, "feedback.json"), "utf8"),
    );
    const preserved =
      canonicalStringify(recorded) !== canonicalStringify(report) &&
      sameEvidenceSourceContent(
        root,
        [
          "feedback.json",
          "selfhost-audit.jsonl",
          "selfhost-verification.jsonl",
        ].map((name) => `${selection.directory}/${name}`),
        evidenceSources(root).feedback,
      );
    if (preserved) {
      // The old compiler/package identities remain in the historical live logs.
      // Current regressions must still produce the same non-identity report.
      assert.deepEqual(
        { ...recorded, policyHash: report.policyHash, subject: report.subject },
        report,
        "feedback behavior changed",
      );
      console.log(
        "Retained immutable live feedback audit: behavior source is unchanged apart from component release labels.",
      );
    } else {
      assert.equal(
        canonicalStringify(recorded),
        canonicalStringify(report),
        "feedback evidence is stale",
      );
      validateSelfhost(
        readFileSync(join(destination, "selfhost-audit.jsonl"), "utf8"),
        readFileSync(join(destination, "selfhost-verification.jsonl"), "utf8"),
      );
    }
  }
  console.log(
    `${mode === "--write" ? "Recorded" : "Verified"} ten passing regressions, ten removal failures, and ${report.context.savedBytes} fewer instruction bytes in the matched projection.`,
  );
}
