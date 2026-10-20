#!/usr/bin/env node
import {
  decodeReceipt,
  assertReceiptParents,
  capturePendingReceipts,
  pendingReceiptPath,
  receiptPath,
} from "./lib/siblings.mjs";
// `siblings index` writes the sibling registry: one entry per declared
// sibling with its purpose and upstream relation from the declaration, and
// the kit version, build hash, receipts and the orders closed in core
// between consecutive receipts from the receipts `launchpad export` and
// `--update` write, read with this repository's tags and committed control
// records at each receipt's commit. `siblings index --check` regenerates and
// refuses a hand-edited entry or an entry whose manifest hash is not its
// latest receipt's; a receipt it cannot decode refuses before anything is
// written. Tag observations are captured beside the page and validated
// against Git before use, so a later tag is newer evidence while an invented
// version in either generated file refuses.
import { firstDifferingLine } from "./lib/validation.mjs";
import { findLaunchpad } from "./lib/config.mjs";
import { readControl } from "./lib/control-store.mjs";
import { describeTag, parseWorktrees, runGit } from "./lib/git.mjs";
import { exact, json, sha256Hex } from "./lib/helpers.mjs";
import { containedRegularFile, isMainModule, parseJson } from "./lib/paths.mjs";
import {
  COMMIT,
  DECLARATION_FILE,
  declarationPath,
  readDeclaration,
  readReceipts,
  receiptsPath,
  registryPath,
  tagObservationsPath,
} from "./lib/siblings.mjs";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix } from "node:path";

const NOT_EVIDENCED = "not evidenced";
const notEvidenced = (reason) => `${NOT_EVIDENCED} (${reason})`;
const COMMAND = "node scripts/siblings.mjs index";
const MANIFEST_HASH_LINE = "- **Manifest hash:** ";
const TAG_RECORD = "<!-- dotln-sibling-tags:";
const code = (value) => `\`${value}\``;

/** A captured exact tag must still point at the receipt commit; a captured
 * nearest tag must still be reachable below it, including at the commit.
 * Compare literal tag names from Git so revision expressions cannot stand
 * in for refs, and older valid observations survive tags added later. */
const validateRecordedTags = (root, commit, tags) => {
  for (const [field, selection, relation] of [
    ["tag", "--points-at", "at"],
    ["nearest", "--merged", "at or below"],
  ]) {
    if (tags[field] === null) continue;
    const names = runGit(root, ["tag", selection, commit]).split("\n");
    if (!names.includes(tags[field]))
      throw new Error(
        `${tagObservationsPath(root)}: ${commit} records ${field} ${JSON.stringify(tags[field])}, which is not a Git tag ${relation} its receipt commit; run ${COMMAND}`,
      );
  }
};

/** What this repository knows about a receipt's commit: whether it holds it,
 * the tag at it or the nearest below, and the orders closed at it. The check
 * passes captured tag observations, validated against Git, so a later tag
 * does not stale the page; each commit is read once. */
export const commitFacts = (root, recorded = new Map()) => {
  const cache = new Map();
  return (commit) => {
    if (cache.has(commit)) return cache.get(commit);
    const known =
      runGit(root, ["cat-file", "-e", `${commit}^{commit}`], {
        onFailure: () => null,
      }) !== null;
    const facts = { known, tag: null, nearest: null, closed: new Set() };
    if (known) {
      const captured = recorded.get(commit);
      if (captured) validateRecordedTags(root, commit, captured);
      const tags = captured ?? describeTag(root, commit);
      facts.tag = tags.tag;
      facts.nearest = tags.nearest;
      for (const [id, row] of readControl(root, commit).orders)
        if (row.state.phase === "closed") facts.closed.add(id);
    }
    cache.set(commit, facts);
    return facts;
  };
};

const versionText = (facts) =>
  !facts.known
    ? notEvidenced("the commit is not in this repository")
    : facts.tag
      ? code(facts.tag)
      : facts.nearest
        ? `none at the commit (nearest below: ${code(facts.nearest)})`
        : "none at the commit";

/** The orders closed in this repository after `previous` and by `commit`;
 * null when either commit is not here to compare. */
const closedBetween = (facts, previous, commit) => {
  const after = facts(commit);
  const before = facts(previous);
  if (!after.known || !before.known) return null;
  return [...after.closed].filter((id) => !before.closed.has(id)).sort();
};

/** Read the captured observations, never the page under judgment. Shape and
 * coverage alone do not establish their truth; commitFacts checks Git before
 * using them. Missing or malformed observations refuse. */
const readTagObservations = (source, path) => {
  if (source === null)
    throw new Error(`${path}: missing tag observations; run ${COMMAND}`);
  const record = parseJson(source, path);
  if (
    !exact(record, ["schemaVersion", "commits"]) ||
    record.schemaVersion !== 1 ||
    record.commits === null ||
    typeof record.commits !== "object" ||
    Array.isArray(record.commits) ||
    Object.entries(record.commits).some(
      ([commit, tags]) =>
        !COMMIT.test(commit) ||
        !exact(tags, ["tag", "nearest"]) ||
        ["tag", "nearest"].some(
          (key) =>
            tags[key] !== null &&
            (typeof tags[key] !== "string" ||
              !/^[^\u0000-\u0020\u007f]+$/u.test(tags[key])),
        ),
    )
  )
    throw new Error(`${path}: invalid tag observations; run ${COMMAND}`);
  return new Map(Object.entries(record.commits));
};

const tagRecord = (receipts, facts) =>
  Object.fromEntries(
    [
      ...new Set(
        [...receipts.values()].flat().map(({ coreCommit }) => coreCommit),
      ),
    ]
      .sort()
      .filter((commit) => facts(commit).known)
      .map((commit) => {
        const { tag, nearest } = facts(commit);
        return [commit, { tag, nearest }];
      }),
  );

/** The registry's text from its inputs; the generated-by sentence, the entry
 * fields and the tag record are the contract the check and the fixtures read. */
export const renderRegistry = ({ root, declaration, receipts, facts }) => {
  const registry = registryPath(root);
  const relativeTo = (path) => posix.relative(posix.dirname(registry), path);
  const lines = [
    "# Siblings",
    "",
    `One entry per declared sibling of this repository: its purpose and upstream relation from [the declaration](${DECLARATION_FILE}); the kit version, build hash and manifest hash it carries, its receipts and the orders closed in core between consecutive receipts from the receipts under \`${receiptsPath(root)}/\`, written by \`launchpad export\` and \`--update\` or carried by the next \`worktree start\` from release close's pending starter-refresh lane, read with the tag and the committed control records at each receipt's commit. A field no receipt supplies reads "${NOT_EVIDENCED}".`,
    "",
    `The check validates [captured tag observations](${relativeTo(tagObservationsPath(root))}) against this repository's Git: an exact tag must point at its receipt commit, and a nearest tag must be at or below it. Later tags are reported as newer evidence until the next generation refreshes both files.`,
    "",
    `This file is generated by \`${COMMAND}\`; \`${COMMAND} --check\` refuses a hand-edited entry, an entry whose manifest hash is not its latest receipt's, and a receipt it cannot decode. Change an entry through the declaration or a receipt, never here.`,
    "",
  ];
  for (const sibling of declaration.siblings) {
    const list = receipts.get(sibling.id);
    const latest = list.at(-1);
    const declared =
      sibling.relation.kind === "export" ? sibling.relation.coreCommit : null;
    const rows = list.map((receipt, index) => {
      // The first receipt is compared with the declared origin commit when the
      // declaration names one; without one there is nothing to compare.
      const previous = index ? list[index - 1].coreCommit : declared;
      return {
        receipt,
        closed: previous
          ? closedBetween(facts, previous, receipt.coreCommit)
          : undefined,
      };
    });
    const compared = rows.filter(({ closed }) => closed !== undefined);
    const gap = compared.some(({ closed }) => closed === null);
    const advanced = [
      ...new Set(compared.flatMap(({ closed }) => closed ?? [])),
    ]
      .sort()
      .map(code);
    const relation =
      sibling.relation.kind === "consumer"
        ? `a consumer of contract version ${code(sibling.relation.contractVersion)}`
        : declared
          ? `an export of core at commit ${code(declared)}`
          : list.length
            ? `an export of core at commit ${code(list[0].coreCommit)} (the earliest receipt's)`
            : `an export of core; its commit is ${notEvidenced("no receipt yet")}`;
    lines.push(`## ${sibling.id}`, "");
    lines.push(`- **Purpose:** ${sibling.purpose}`);
    lines.push(`- **Upstream relation:** ${relation}`);
    lines.push(
      `- **Kit version:** ${latest ? versionText(facts(latest.coreCommit)) : NOT_EVIDENCED}`,
    );
    lines.push(
      `- **Core commit:** ${latest ? code(latest.coreCommit) : NOT_EVIDENCED}`,
    );
    lines.push(
      `${MANIFEST_HASH_LINE}${latest ? code(latest.manifestHash) : NOT_EVIDENCED}`,
    );
    lines.push(
      `- **Build hash:** ${latest ? code(latest.buildHash) : NOT_EVIDENCED}`,
    );
    lines.push(
      `- **Last receipt:** ${latest ? `${latest.date} ([${posix.basename(latest.path)}](${relativeTo(latest.path)}))` : NOT_EVIDENCED}`,
    );
    lines.push(
      `- **Orders in core that advanced it:** ${
        !list.length
          ? NOT_EVIDENCED
          : !compared.length
            ? "none yet (one receipt and no declared origin commit)"
            : advanced.length
              ? `${advanced.join(", ")}${gap ? `; the rest ${notEvidenced("a commit is not in this repository")}` : ""}`
              : gap
                ? notEvidenced("a commit is not in this repository")
                : "none closed between the compared commits"
      }`,
    );
    lines.push(
      `- **Capability rows:** ${sibling.capabilityRows.length ? sibling.capabilityRows.map(code).join(", ") : "none declared"}`,
    );
    lines.push("");
    if (!list.length) continue;
    lines.push(
      `### Receipts of ${sibling.id}`,
      "",
      "| Date | Core commit | Kit version | Manifest hash | Build hash | Orders closed since the previous receipt or the declared origin | Receipt |",
      "| --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const { receipt, closed } of rows)
      lines.push(
        `| ${receipt.date} | ${code(receipt.coreCommit.slice(0, 12))} | ${versionText(facts(receipt.coreCommit))} | ${code(receipt.manifestHash)} | ${code(receipt.buildHash)} | ${
          closed === undefined
            ? "first receipt"
            : closed === null
              ? notEvidenced("a commit is not in this repository")
              : closed.length
                ? closed.map(code).join(", ")
                : "none"
        } | [${posix.basename(receipt.path)}](${relativeTo(receipt.path)}) |`,
      );
    lines.push("");
  }
  // This copy is output only. The check's input lives in the observation file.
  lines.push(`${TAG_RECORD}${JSON.stringify(tagRecord(receipts, facts))} -->`);
  return `${lines.join("\n").trimEnd()}\n`;
};

// The page split into its entries by heading, for a check that compares one
// field structurally instead of by pattern.
const entries = (text) =>
  new Map(
    text
      .split(/^(?=## )/mu)
      .slice(1)
      .map((section) => [section.slice(3, section.indexOf("\n")), section]),
  );
const manifestHashLine = (section) =>
  section?.split("\n").find((line) => line.startsWith(MANIFEST_HASH_LINE)) ??
  null;

/** A stale registry, named: an entry whose recorded manifest hash line is not
 * the regenerated one names the latest receipt; any other difference, a hand
 * edit included, names its first differing line. */
export const checkRegistry = ({ path, expected, actual, receipts }) => {
  if (expected === actual) return;
  const before = entries(actual);
  for (const [id, section] of entries(expected)) {
    const recorded = manifestHashLine(before.get(id));
    if (recorded !== null && recorded !== manifestHashLine(section)) {
      const latest = receipts.get(id)?.at(-1);
      throw new Error(
        `${path}: the ${id} entry records manifest hash ${recorded.slice(MANIFEST_HASH_LINE.length)}, and ${latest ? `its latest receipt ${latest.path} records ${code(latest.manifestHash)}` : "no receipt exists"}; run ${COMMAND}`,
      );
    }
  }
  throw new Error(
    `${path} is stale at line ${firstDifferingLine(expected, actual)}; run ${COMMAND}`,
  );
};

/** Copy the start's captured receipt cohort and consume sources only after
 * registry generation. A retry can finish from identical carried bytes even
 * after another start consumed the pending lane. */
export function carryPendingReceipts(
  main,
  target,
  rows = capturePendingReceipts(main),
) {
  if (!rows.length) return [];
  const readBound = (root, path, hash) => {
    assertReceiptParents(root, path);
    const file = join(root, path);
    if (!lstatSync(file, { throwIfNoEntry: false })) return null;
    if (!containedRegularFile(file, root))
      throw new Error(`receipt is not a contained regular file: ${path}`);
    const bytes = readFileSync(file);
    if (sha256Hex(bytes) !== hash)
      throw new Error(`carried receipt collision or changed source: ${path}`);
    return bytes;
  };
  const copies = rows
    .map((row) => {
      const { path: recordedPath, sha256: recordedHash, ...receipt } = row;
      decodeReceipt(json(receipt), "captured receipt");
      const source = pendingReceiptPath(main, row.sibling, row.date);
      const path = receiptPath(target, row.sibling, row.date);
      if (recordedPath !== source || !/^[0-9a-f]{64}$/.test(recordedHash))
        throw new Error("invalid captured receipt binding");
      const incoming = readBound(main, source, row.sha256);
      const existing = readBound(target, path, row.sha256);
      if (!incoming && !existing) {
        const proven = parseWorktrees(main).some(({ worktree }) => {
          if (worktree === target) return false;
          try {
            return (
              readBound(
                worktree,
                receiptPath(worktree, row.sibling, row.date),
                row.sha256,
              ) !== null
            );
          } catch {
            return false;
          }
        });
        if (!proven)
          throw new Error(
            `captured pending receipt is missing from source and destination: ${source}; restore the captured receipt before retrying`,
          );
        process.stdout.write(
          `Captured receipt ${source} is present with its bound hash in another worktree; this start carries no duplicate.\n`,
        );
        return null;
      }
      return { source, path, hash: row.sha256, bytes: incoming ?? existing };
    })
    .filter(Boolean);
  for (const { path, bytes, hash } of copies) {
    assertReceiptParents(target, path);
    const destination = join(target, path);
    mkdirSync(dirname(destination), { recursive: true });
    try {
      writeFileSync(destination, bytes, { flag: "wx" });
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
    readBound(target, path, hash);
  }
  writeRegistry(target);
  for (const { source, path, hash } of copies) {
    if (!readBound(target, path, hash))
      throw new Error(`carried receipt disappeared: ${path}`);
    readBound(main, source, hash);
  }
  for (const { source, hash } of copies)
    if (readBound(main, source, hash)) rmSync(join(main, source));
  return copies.map(({ path }) => path);
}

/** Generate the registry, or check it when `check` is set: the receipts are
 * read and decoded before a line is rendered or written; a generation writes
 * only when the page or its captured tag observations changed. A check
 * validates those observations against Git and never takes expected values
 * from the page. Returns its path and whether generation wrote either file. */
export const writeRegistry = (root, { check = false } = {}) => {
  const declaration = readDeclaration(root);
  if (!declaration) {
    // A launchpad that declares no siblings has nothing to check, as long as
    // no page claims otherwise; a generation needs the declaration.
    if (check && !existsSync(join(root, registryPath(root)))) {
      process.stdout.write(
        `PASS ${declarationPath(root)} declares no siblings; nothing to check\n`,
      );
      return { path: registryPath(root), written: false };
    }
    throw new Error(
      `${declarationPath(root)}: no sibling declaration; write it before generating the registry`,
    );
  }
  // Every receipt is read and decoded before a line is rendered or written.
  const receipts = readReceipts(root, declaration);
  const path = registryPath(root);
  const observationPath = tagObservationsPath(root);
  const read = (relative) => {
    const file = join(root, relative);
    if (!existsSync(file)) return null;
    if (!containedRegularFile(file, root))
      throw new Error(`${relative}: expected a contained regular file`);
    return readFileSync(file, "utf8");
  };
  const actual = read(path);
  const observationSource = read(observationPath);
  const recorded = check
    ? readTagObservations(observationSource, observationPath)
    : new Map();
  const facts = commitFacts(root, recorded);
  const observations = tagRecord(receipts, facts);
  if (
    check &&
    JSON.stringify(Object.keys(observations)) !==
      JSON.stringify([...recorded.keys()].sort())
  )
    throw new Error(
      `${observationPath}: observations do not match receipt commits; run ${COMMAND}`,
    );
  const expected = renderRegistry({
    root,
    declaration,
    receipts,
    facts,
  });
  if (check) {
    if (actual === null)
      throw new Error(`${path} is stale at line 1; run ${COMMAND}`);
    checkRegistry({ path, expected, actual, receipts });
    for (const [commit, tags] of recorded) {
      const live = describeTag(root, commit);
      if (live.tag !== tags.tag || live.nearest !== tags.nearest)
        process.stdout.write(
          `NEWER tag evidence for ${commit.slice(0, 12)}: ${live.tag ?? (live.nearest ? `none at the commit (nearest below: ${live.nearest})` : "no tag")}; the page keeps its recorded observation; run ${COMMAND} to refresh\n`,
        );
    }
    process.stdout.write(`PASS ${path} is current\n`);
    return { path, written: false };
  }
  const writes = [
    {
      path: observationPath,
      actual: observationSource,
      expected: json({ schemaVersion: 1, commits: observations }),
    },
    { path, actual, expected },
  ]
    .filter((file) => file.actual !== file.expected)
    .map((file) => ({
      ...file,
      destination: join(root, file.path),
      temporary: `${join(root, file.path)}.tmp`,
    }));
  // Prepare both files before replacing either. A failed replacement leaves
  // a stale pair that the check refuses and the same index command repairs.
  for (const file of writes)
    if (existsSync(file.temporary))
      throw new Error(
        `sibling registry temporary already exists: ${file.temporary}; inspect the interrupted write before retrying`,
      );
  const created = [];
  try {
    for (const file of writes) {
      mkdirSync(dirname(file.destination), { recursive: true });
      writeFileSync(file.temporary, file.expected, { flag: "wx" });
      created.push(file.temporary);
    }
    for (const file of writes) renameSync(file.temporary, file.destination);
  } finally {
    for (const temporary of created) rmSync(temporary, { force: true });
  }
  return { path, written: writes.length > 0 };
};

export const main = (args = process.argv.slice(2), root = findLaunchpad()) => {
  if (
    args[0] !== "index" ||
    args.length > 2 ||
    (args.length === 2 && args[1] !== "--check")
  )
    throw new Error("usage: siblings index [--check]");
  const { path, written } = writeRegistry(root, {
    check: args.includes("--check"),
  });
  if (written) process.stdout.write(`Generated ${path}\n`);
};

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
