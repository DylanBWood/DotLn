import {
  isObject,
  isText,
  requireKnownKeys as checkKnownKeys,
} from "./validation.mjs";
// The sibling registry's shared shapes: the once-per-sibling declaration the
// operator writes, the receipt every launchpad export and update writes, and
// the configured paths both live at. The generator (scripts/siblings.mjs) and
// the export command (scripts/launchpad.mjs) read and write through here, so
// neither holds a second copy of either shape.
import { runGit } from "./git.mjs";
import { docRelative } from "./config.mjs";
import { exact, json, sha256Hex, timestamp, validDigest } from "./helpers.mjs";
import {
  containedRegularFile,
  disposableBasename,
  parseJson,
} from "./paths.mjs";
import { randomUUID } from "node:crypto";
import {
  linkSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

export const DECLARATION_FILE = "siblings.json";
const DECLARATION_SCHEMA_VERSION = 1;
const REGISTRY_FILE = "README.md";
const TAG_OBSERVATIONS_FILE = "tag-observations.json";
// Receipts sit under the evidence root beside the per-order directories; the
// decision and follow-up readers skip the directory because its name is not
// an order's.
const RECEIPTS_DIRECTORY = "siblings";
const RECEIPT_FIELDS = [
  "sibling",
  "coreCommit",
  "manifestHash",
  "buildHash",
  "date",
];

// A sibling id is a public repository name, the shape the configuration
// loader admits for a registered repository id.
const SIBLING_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u;
export const COMMIT = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u;
const CAPABILITY_ROW = /^[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+$/u;
// The build hash is the harness runtime snapshot's content hash: the digest
// of the compiled runtime files the kit carries, which the export prints as
// its snapshot and installs under .runtime/harness/<hash>.
const BUILD_HASH = /^fnv1a64:[0-9a-f]{16}$/u;
const SNAPSHOT = /^\.runtime\/harness\/([0-9a-f]{16})$/u;

export const declarationPath = (root) =>
  docRelative(root, "siblings", DECLARATION_FILE);
export const registryPath = (root) =>
  docRelative(root, "siblings", REGISTRY_FILE);
export const tagObservationsPath = (root) =>
  docRelative(root, "siblings", TAG_OBSERVATIONS_FILE);
export const exportSiblings = (declaration) =>
  declaration?.siblings.filter((entry) => entry.relation.kind === "export") ??
  [];
const pendingReceiptsPath = (root, ...segments) =>
  docRelative(root, "control", "local", "sibling-receipts", ...segments);
export const receiptsPath = (root, ...segments) =>
  docRelative(root, "evidence", RECEIPTS_DIRECTORY, ...segments);

const refuse = (path, detail) => new Error(`${path}: ${detail}`);
const requireKnownKeys = (path, value, known, label) =>
  checkKnownKeys(value, known, label, (detail) => refuse(path, detail));

/** The declaration's typed form, or a refusal naming the path and the field. */
const decodeDeclaration = (source, path) => {
  const parsed = parseJson(source, path);
  if (!isObject(parsed))
    throw refuse(path, "the declaration must be an object");
  requireKnownKeys(path, parsed, ["schemaVersion", "siblings"], "declaration");
  if (parsed.schemaVersion !== DECLARATION_SCHEMA_VERSION)
    throw refuse(path, `schemaVersion must be ${DECLARATION_SCHEMA_VERSION}`);
  if (!Array.isArray(parsed.siblings))
    throw refuse(path, "siblings must be an array");
  const ids = new Set();
  const siblings = parsed.siblings.map((entry, index) => {
    const label = `siblings[${index}]`;
    if (!isObject(entry)) throw refuse(path, `${label} must be an object`);
    requireKnownKeys(
      path,
      entry,
      ["id", "purpose", "relation", "capabilityRows"],
      label,
    );
    if (typeof entry.id !== "string" || !SIBLING_ID.test(entry.id))
      throw refuse(path, `${label}.id must be a public repository name`);
    if (ids.has(entry.id.toLowerCase()))
      throw refuse(
        path,
        `${label}.id repeats ${entry.id} (ids are compared without case, as repository names are)`,
      );
    ids.add(entry.id.toLowerCase());
    if (!isText(entry.purpose))
      throw refuse(path, `${label}.purpose must be a non-empty string`);
    const relation = entry.relation;
    if (!isObject(relation) || !["export", "consumer"].includes(relation.kind))
      throw refuse(path, `${label}.relation.kind must be export or consumer`);
    if (relation.kind === "export") {
      requireKnownKeys(
        path,
        relation,
        ["kind", "coreCommit"],
        `${label}.relation`,
      );
      if (!(
        relation.coreCommit === null ||
        (typeof relation.coreCommit === "string" &&
          COMMIT.test(relation.coreCommit))
      ))
        throw refuse(
          path,
          `${label}.relation.coreCommit must be a commit hash, or null: the earliest receipt then names the origin`,
        );
    } else {
      requireKnownKeys(
        path,
        relation,
        ["kind", "contractVersion"],
        `${label}.relation`,
      );
      if (!isText(relation.contractVersion))
        throw refuse(
          path,
          `${label}.relation.contractVersion must be a non-empty string`,
        );
    }
    if (
      !Array.isArray(entry.capabilityRows) ||
      entry.capabilityRows.some(
        (row) => typeof row !== "string" || !CAPABILITY_ROW.test(row),
      ) ||
      new Set(entry.capabilityRows).size !== entry.capabilityRows.length
    )
      throw refuse(
        path,
        `${label}.capabilityRows must list distinct capability row ids such as launchpad.starter`,
      );
    return {
      id: entry.id,
      purpose: entry.purpose,
      relation: { ...relation },
      capabilityRows: [...entry.capabilityRows],
    };
  });
  return { schemaVersion: DECLARATION_SCHEMA_VERSION, siblings };
};

/** The launchpad's declaration with its path, or null when it declares none. */
export function readDeclaration(root) {
  const path = declarationPath(root);
  const file = join(root, path);
  const stat = lstatSync(file, { throwIfNoEntry: false });
  if (!stat) return null;
  if (!stat.isFile()) throw refuse(path, "expected a regular file");
  let source;
  try {
    source = readFileSync(file, "utf8");
  } catch (error) {
    throw refuse(
      path,
      `cannot read the declaration (${error.code ?? error.message})`,
    );
  }
  return { path, ...decodeDeclaration(source, path) };
}

/** A receipt's typed form: exactly the five fields, each in its shape. */
export const decodeReceipt = (source, path) => {
  const parsed = parseJson(source, path);
  if (!exact(parsed, RECEIPT_FIELDS))
    throw refuse(path, `a receipt holds exactly ${RECEIPT_FIELDS.join(", ")}`);
  const shapes = {
    sibling: (value) => typeof value === "string" && SIBLING_ID.test(value),
    coreCommit: (value) => typeof value === "string" && COMMIT.test(value),
    manifestHash: validDigest,
    buildHash: (value) => typeof value === "string" && BUILD_HASH.test(value),
    date: timestamp,
  };
  for (const field of RECEIPT_FIELDS)
    if (!shapes[field](parsed[field]))
      throw refuse(path, `${field} is not in its declared shape`);
  return Object.fromEntries(
    RECEIPT_FIELDS.map((field) => [field, parsed[field]]),
  );
};

// A receipt is named by its date with the characters a file name cannot
// carry replaced, so a sorted directory listing is the receipts' order.
const receiptFileName = (date) => `${date.replace(/[:.]/gu, "-")}.json`;
export const pendingReceiptPath = (root, sibling, date) =>
  pendingReceiptsPath(root, sibling, receiptFileName(date));
export const receiptPath = (root, sibling, date) =>
  receiptsPath(root, sibling, receiptFileName(date));

/** Whether an export or update to `destination` records a receipt, and for
 * which declared sibling: the destination's own repository name when the
 * caller read one from its remote, else its directory name, compared without
 * case as repository names are. Read before the build and before any write,
 * so a malformed declaration refuses there and never after a complete export. */
export function resolveReceipt(root, destination, { names = [] } = {}) {
  const declaration = readDeclaration(root);
  const candidates = [...new Set([...names, basename(destination)])];
  if (!declaration)
    return {
      sibling: null,
      reason: `no sibling declaration at ${declarationPath(root)}`,
    };
  for (const candidate of candidates) {
    const match = declaration.siblings.find(
      (entry) => entry.id.toLowerCase() === candidate.toLowerCase(),
    );
    if (match) return { sibling: match.id, reason: null };
  }
  return {
    sibling: null,
    reason: `${candidates.join(" and ")} ${candidates.length === 1 ? "is" : "are"} not declared in ${declaration.path}`,
  };
}

/** The build hash a receipt records, from the runtime snapshot path the
 * export's harness bundle names. */
export function buildHashOf(snapshot) {
  const match = SNAPSHOT.exec(snapshot);
  if (!match)
    throw new Error(
      `the harness runtime snapshot carries no build hash: ${snapshot}`,
    );
  return `fnv1a64:${match[1]}`;
}

/** Receipt paths may be newly created, but existing parents must not redirect
 * reads or writes through symbolic links. */
export function assertReceiptParents(root, path) {
  const pieces = path.split("/");
  for (let i = 1; i < pieces.length; i++) {
    const parent = lstatSync(join(root, ...pieces.slice(0, i)), {
      throwIfNoEntry: false,
    });
    if (parent && !parent.isDirectory())
      throw refuse(path, "receipt parent must be a physical directory");
  }
}

/** Write a resolved sibling's receipt under the launchpad's evidence root.
 * The file lands whole: it is written beside its final name and linked into
 * place, which refuses rather than overwrites a receipt of the same date. */
export function writeReceipt(
  root,
  {
    sibling,
    coreCommit,
    manifestBytes,
    buildHash,
    date = new Date().toISOString(),
  },
  { pending = false } = {},
) {
  const receipt = {
    sibling,
    coreCommit,
    manifestHash: `sha256:${sha256Hex(manifestBytes)}`,
    buildHash,
    date,
  };
  const path = (pending ? pendingReceiptPath : receiptPath)(
    root,
    sibling,
    date,
  );
  decodeReceipt(json(receipt), path);
  assertReceiptParents(root, path);
  if (pending) {
    runGit(root, ["check-ignore", "--quiet", "--no-index", path]);
    if (runGit(root, ["ls-files", "--", path]))
      throw refuse(path, "pending receipts must be ignored and untracked");
  }
  const file = join(root, path);
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(temporary, json(receipt), { flag: "wx" });
    linkSync(temporary, file);
  } catch (error) {
    throw refuse(
      path,
      `the receipt was not written (${error.code ?? error.message})`,
    );
  } finally {
    rmSync(temporary, { force: true });
  }
  return { path, receipt };
}

/** Every receipt under the evidence root by sibling, oldest first. A receipt
 * that cannot be read or decoded, that is not named by its date, or that
 * sits under a sibling the declaration does not name refuses by path. */
function readReceiptLane(root, declaration, lane) {
  const bySibling = new Map(
    (declaration?.siblings ?? []).map((entry) => [entry.id, []]),
  );
  assertReceiptParents(root, `${lane(root)}/receipt`);
  const directory = join(root, lane(root));
  const stat = lstatSync(directory, { throwIfNoEntry: false });
  if (!stat) return bySibling;
  if (!stat.isDirectory())
    throw refuse(lane(root), "expected the receipts directory");
  for (const name of readdirSync(directory).sort()) {
    if (disposableBasename(name)) continue;
    const entry = lane(root, name);
    if (!lstatSync(join(directory, name)).isDirectory())
      throw refuse(entry, "expected a sibling's receipt directory");
    if (!readdirSync(join(directory, name)).length) continue;
    if (!bySibling.has(name))
      throw refuse(
        entry,
        `receipts for a sibling the declaration does not name; declare ${name} in ${declarationPath(root)} or remove them`,
      );
    for (const file of readdirSync(join(directory, name)).sort()) {
      if (disposableBasename(file)) continue;
      const path = lane(root, name, file);
      if (
        !file.endsWith(".json") ||
        !lstatSync(join(directory, name, file)).isFile()
      )
        throw refuse(path, "expected a regular .json receipt");
      let source;
      try {
        source = readFileSync(join(directory, name, file), "utf8");
      } catch (error) {
        throw refuse(
          path,
          `cannot read the receipt (${error.code ?? error.message})`,
        );
      }
      const receipt = decodeReceipt(source, path);
      if (receipt.sibling !== name)
        throw refuse(
          path,
          `the receipt names ${receipt.sibling}, not its directory ${name}`,
        );
      if (file !== receiptFileName(receipt.date))
        throw refuse(
          path,
          `the receipt is dated ${receipt.date}, which names ${receiptFileName(receipt.date)}`,
        );
      if (
        !bySibling
          .get(name)
          .some((row) => row.manifestHash === receipt.manifestHash)
      )
        bySibling.get(name).push({ path, ...receipt });
    }
  }
  return bySibling;
}

export const readReceipts = (root, declaration) =>
  readReceiptLane(root, declaration, receiptsPath);
export const readPendingReceipts = (
  root,
  declaration = readDeclaration(root),
) => readReceiptLane(root, declaration, pendingReceiptsPath);

/** Decode both lanes before accepting an existing receipt, including recovery
 * after a remote push succeeded but its local receipt write did not. */
export function receiptRecorded(root, sibling, manifestHash) {
  const declaration = readDeclaration(root);
  const lanes = [
    readReceipts(root, declaration),
    readPendingReceipts(root, declaration),
  ];
  return lanes.some((lane) =>
    lane.get(sibling)?.some((receipt) => receipt.manifestHash === manifestHash),
  );
}

export const manifestBuildHash = (bytes, label) => {
  const manifest = parseJson(String(bytes), label);
  const snapshots = manifest.profiles?.map(
    (entry) => entry.profile?.runtime?.snapshot,
  );
  if (
    !Array.isArray(snapshots) ||
    !snapshots.length ||
    new Set(snapshots).size !== 1
  )
    throw new Error(`no single runtime snapshot in ${label}`);
  return buildHashOf(snapshots[0]);
};

/** Freeze the cohort a start will carry, including exact source bytes. */
export function capturePendingReceipts(root) {
  return [...readPendingReceipts(root).values()].flat().map((row) => {
    const source = join(root, row.path);
    if (!containedRegularFile(source, root))
      throw refuse(row.path, "expected a contained receipt");
    return { ...row, sha256: sha256Hex(readFileSync(source)) };
  });
}
