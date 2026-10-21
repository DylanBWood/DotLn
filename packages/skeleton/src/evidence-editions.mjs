import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** @typedef {"authority" | "artifact-identity" | "verification" | "feedback"} EvidenceKind */
/** @typedef {{workOrder: string, revision: string | null}} EvidenceEdition */

/** Select recorded evidence, independently of whichever order is active.
 * Historical comparisons keep their explicit pins. Changing this manifest
 * selects a replacement; it never regenerates or blesses that replacement.
 * @param {string} root
 * @param {EvidenceKind} kind
 * @param {EvidenceEdition} [override]
 */
export function currentEvidence(root, kind, override) {
  const manifest = override
    ? null
    : JSON.parse(
        readFileSync(join(root, "docs/evidence/current.json"), "utf8"),
      );
  if (manifest && manifest.schemaVersion !== 1)
    throw new Error("Unsupported current-evidence manifest");
  const row = override ?? manifest?.editions?.[kind];
  if (
    !row ||
    typeof row.workOrder !== "string" ||
    !/^WO-\d{3}$/.test(row.workOrder) ||
    !(
      row.revision === null ||
      (typeof row.revision === "string" && /^(?!000)\d{3}$/.test(row.revision))
    ) ||
    (kind === "feedback" && row.workOrder === "WO-011" && row.revision !== null)
  )
    throw new Error(`Invalid current-evidence edition: ${kind}`);
  /** @type {EvidenceEdition} */
  const edition = { workOrder: row.workOrder, revision: row.revision };
  const suffix =
    kind === "authority"
      ? edition.revision
        ? `authority/${edition.revision}`
        : ""
      : kind === "feedback"
        ? edition.workOrder === "WO-011"
          ? ""
          : `feedback${edition.revision ? `-${edition.revision}` : ""}`
        : `${kind}${edition.revision ? `/${edition.revision}` : ""}`;
  return {
    ...edition,
    label: `${edition.workOrder}${edition.revision ? ` revision ${edition.revision}` : ""}`,
    directory: `docs/evidence/${edition.workOrder}${suffix ? `/${suffix}` : ""}`,
  };
}

/** Preserve explicit historical CLI selection without per-caller defaults.
 * @param {string} root
 * @param {EvidenceKind} kind
 * @param {string[]} args
 */
export function evidenceArgs(root, kind, args) {
  const rest = [];
  const options = new Map();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--edition" || arg === "--revision") {
      const value = args[++i];
      if (!value || value.startsWith("--") || options.has(arg))
        throw new Error(`Invalid evidence option: ${arg}`);
      options.set(arg, value);
    } else rest.push(arg);
  }
  const workOrder = options.get("--edition");
  const revision = options.get("--revision");
  return {
    args: rest,
    selection: currentEvidence(
      root,
      kind,
      workOrder || revision
        ? {
            workOrder: workOrder ?? currentEvidence(root, kind).workOrder,
            revision: revision ?? null,
          }
        : undefined,
    ),
  };
}

/** Compare behavior source, retaining package identity and dependency shape.
 * Component release labels are not the behavior recorded by an evidence edition.
 * @param {string} path
 * @param {string} contents
 */
export function evidenceSourceContent(path, contents) {
  const components = [
    "kernel",
    "compiler",
    "skeleton",
    "console",
    "beacons",
    "browser-evidence",
  ];
  const packagePaths = components.map(
    (name) => `packages/${name}/package.json`,
  );
  const release =
    /^(?:[~^])?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/u;
  /** @param {Record<string, any>} value */
  const projectPackage = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error(`Invalid evidence package source: ${path}`);
    if (typeof value.version === "string" && release.test(value.version))
      value.version = "<component release>";
    for (const field of [
      "dependencies",
      "devDependencies",
      "optionalDependencies",
      "peerDependencies",
    ])
      for (const component of components) {
        const name = `@dotln/${component}`;
        const pin = value[field]?.[name];
        // Preserve dependency names, pin operators and external dependencies.
        if (typeof pin === "string" && release.test(pin))
          value[field][name] =
            `${pin.match(/^[~^]/u)?.[0] ?? ""}<component release>`;
      }
    return value;
  };
  if (path === "package.json" || packagePaths.includes(path))
    return JSON.stringify(projectPackage(JSON.parse(contents)));
  if (path === "package-lock.json") {
    const value = projectPackage(JSON.parse(contents));
    if (
      !value.packages ||
      typeof value.packages !== "object" ||
      Array.isArray(value.packages)
    )
      throw new Error("Invalid evidence lockfile packages");
    for (const location of [
      "",
      ...components.map((name) => `packages/${name}`),
    ])
      if (value.packages[location] !== undefined)
        projectPackage(value.packages[location]);
    return JSON.stringify(value);
  }
  if (path === "packages/compiler/src/artifact-identity.ts")
    return contents.replace(
      /(export const COMPILER_PACKAGE_VERSION = )"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?"(;)/u,
      '$1"<component release>"$2',
    );
  if (path === "packages/skeleton/src/version.ts")
    return contents.replace(
      /(export const HARNESS_HOST_VERSION = )"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?"(;)/u,
      '$1"<component release>"$2',
    );
  return contents;
}

/** An edition remains the historical observation committed with its sources.
 * Compare those source bytes directly; never issue a new key or rewrite a log.
 * The caller still executes its current behavioral assertions. The comparison
 * only admits version-derived differences in immutable snapshot output.
 * @param {string} root
 * @param {string[]} evidenceFiles
 * @param {readonly string[]} sources
 */
export function sameEvidenceSourceContent(root, evidenceFiles, sources) {
  if (!evidenceFiles.length || !sources.length) return false;
  /** @type {(...args: string[]) => string} */
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 16 * 1024 * 1024,
    });
  try {
    const revision = git(
      "log",
      "-1",
      "--format=%H",
      "HEAD",
      "--",
      ...evidenceFiles,
    ).trim();
    if (!revision) return false;
    for (const path of evidenceFiles)
      if (
        readFileSync(join(root, path), "utf8") !==
        git("show", `${revision}:${path}`)
      )
        return false;
    return sources.every(
      (path) =>
        evidenceSourceContent(path, readFileSync(join(root, path), "utf8")) ===
        evidenceSourceContent(path, git("show", `${revision}:${path}`)),
    );
  } catch {
    // Missing history, a new source or malformed input needs current evidence.
    return false;
  }
}

/** Evidence is append-only, including the synthetic editions.
 * @param {string | URL} path
 * @param {string} contents
 */
export function writeEvidenceFile(path, contents) {
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== contents)
      throw new Error("evidence edition is immutable; select a new edition");
    return;
  }
  mkdirSync(dirname(path instanceof URL ? fileURLToPath(path) : path), {
    recursive: true,
  });
  writeFileSync(path, contents, { flag: "wx" });
}

/** @param {string} directory
 * @param {string} name */
const authorityPath = (directory, name) => {
  if (typeof directory !== "string" || !directory.length)
    throw new Error("Invalid authority evidence path");
  const path = `${directory}/${name}`;
  if (
    isAbsolute(path) ||
    posix.normalize(path) !== path ||
    path.startsWith("../") ||
    /[\u0000-\u001f\u007f]/u.test(path)
  )
    throw new Error("Invalid authority evidence path");
  return path;
};
/** @param {string} root
 * @param {string} path */
const authorityBytes = (root, path) => {
  const absolute = resolve(realpathSync(root), path);
  if (!lstatSync(absolute).isFile() || realpathSync(absolute) !== absolute)
    throw new Error("Authority evidence must be a contained regular file");
  return readFileSync(absolute);
};
/** @param {string} root */
const authorityFormat = (root) => {
  const format = execFileSync("git", ["rev-parse", "--show-object-format"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 5000,
  }).trim();
  if (!["sha1", "sha256"].includes(format))
    throw new Error("Unsupported Git object format");
  return format;
};
/** @param {Buffer} bytes
 * @param {string} format */
const authorityBlob = (bytes, format) =>
  createHash(format)
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");

/** @param {string} root
 * @param {string} directory */
const authorityDestination = (root, directory) => {
  let current = realpathSync(root);
  for (const part of directory.split("/")) {
    current = join(current, part);
    let entry;
    try {
      entry = lstatSync(current);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT")
        break;
      throw error;
    }
    if (!entry.isDirectory() || realpathSync(current) !== current)
      throw new Error(
        "Authority evidence destination must have contained directory ancestors",
      );
  }
};

/** A new revision may pin the unchanged transcript's canonical blob. Historical
 * full records remain readable; references resolve by identity, never by a
 * mutable pathname alone, and never form a reference chain.
 * @param {string} root
 * @param {string} directory */
export function readAuthorityEvidence(root, directory) {
  const full = authorityPath(directory, "authority.json");
  const pointer = authorityPath(directory, "authority.ref.json");
  const format = authorityFormat(root);
  if (existsSync(join(root, full))) {
    if (existsSync(join(root, pointer)))
      throw new Error("Ambiguous authority evidence records");
    const bytes = authorityBytes(root, full);
    return {
      contents: bytes.toString("utf8"),
      recordPath: full,
      reference: {
        path: full,
        blobHash: authorityBlob(bytes, format),
        bytes: bytes.length,
      },
    };
  }
  const record = JSON.parse(authorityBytes(root, pointer).toString("utf8"));
  const reference = record?.source;
  if (
    record?.schemaVersion !== 1 ||
    record?.kind !== "authority-transcript-reference" ||
    !reference ||
    typeof reference.path !== "string" ||
    !reference.path.endsWith("/authority.json") ||
    authorityPath(dirname(reference.path), "authority.json") !==
      reference.path ||
    typeof reference.blobHash !== "string" ||
    !(format === "sha1" ? /^[a-f0-9]{40}$/u : /^[a-f0-9]{64}$/u).test(
      reference.blobHash,
    ) ||
    !Number.isSafeInteger(reference.bytes) ||
    reference.bytes < 0
  )
    throw new Error("Invalid authority evidence reference");
  let bytes;
  try {
    bytes = authorityBytes(root, reference.path);
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT"))
      throw error;
  }
  if (
    !bytes ||
    bytes.length !== reference.bytes ||
    authorityBlob(bytes, format) !== reference.blobHash
  ) {
    try {
      bytes = execFileSync("git", ["cat-file", "blob", reference.blobHash], {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 5000,
        maxBuffer: 16 * 1024 * 1024,
      });
    } catch {
      throw new Error("Unresolvable authority evidence reference");
    }
  }
  if (
    bytes.length !== reference.bytes ||
    authorityBlob(bytes, format) !== reference.blobHash
  )
    throw new Error("Authority evidence reference identity mismatch");
  return { contents: bytes.toString("utf8"), recordPath: pointer, reference };
}

/** Keep only a reference when the selected predecessor has identical bytes;
 * an absent or damaged predecessor cannot supply a reference.
 * @param {string} root
 * @param {string} directory
 * @param {string} contents
 * @param {string} [previousDirectory] */
export function writeAuthorityEvidence(
  root,
  directory,
  contents,
  previousDirectory,
) {
  const full = authorityPath(directory, "authority.json");
  const pointer = authorityPath(directory, "authority.ref.json");
  authorityDestination(root, directory);
  if (existsSync(join(root, full)) || existsSync(join(root, pointer))) {
    const existing = readAuthorityEvidence(root, directory);
    if (existing.contents !== contents)
      throw new Error("evidence edition is immutable; select a new edition");
    return existing.recordPath;
  }
  let previous;
  if (previousDirectory && previousDirectory !== directory) {
    try {
      previous = readAuthorityEvidence(root, previousDirectory);
    } catch {
      /* A new full transcript repairs unavailable predecessor evidence. */
    }
  }
  if (previous && previous.contents === contents) {
    writeEvidenceFile(
      join(root, pointer),
      JSON.stringify(
        {
          schemaVersion: 1,
          kind: "authority-transcript-reference",
          source: previous.reference,
        },
        null,
        2,
      ) + "\n",
    );
    return pointer;
  }
  writeEvidenceFile(join(root, full), contents);
  return full;
}
