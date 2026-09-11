import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  renameSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

/** @typedef {{exitCode: number, executed: boolean, output?: string, outputRef?: string, cases?: GateDiagnostic[]}} GateDiagnostic */
/** @typedef {GateDiagnostic & {checkId: string, treeHash: string, subject: string, durationMs: number, evidenceRef: string, recordedAt: string}} GateCheck */
/** @param {string} root @param {string[]} args */
function git(root, args) {
  const run = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (run.status !== 0)
    throw new Error(`Tree observation failed: git ${args[0]}`);
  return run.stdout;
}
/** Git's own object framing, without writing an index or an object. @param {string} type @param {Buffer} bytes @param {string} algorithm */
const objectHash = (type, bytes, algorithm) =>
  createHash(algorithm)
    .update(`${type} ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");

/** Exact candidate Git tree identity, including uncommitted and untracked files.
 * Ignored host evidence stays outside the tree. No evidence or control paths are
 * excluded specially. Git filters are applied by hash-object; this never writes
 * the shared object database or the user's index.
 * @param {string} root
 */
export function gateTreeHash(root) {
  const algorithm = git(root, ["rev-parse", "--show-object-format"]).trim();
  const staged = git(root, ["ls-files", "--stage", "-z"])
    .split("\0")
    .filter(Boolean);
  /** @type {Map<string, string>} */
  const modes = new Map();
  for (const row of staged) {
    const match = /^(\d+) [a-f0-9]+ (\d)\t([\s\S]+)$/.exec(row);
    if (!match || match[2] !== "0" || !match[3] || !match[1])
      throw new Error("Unmerged tree cannot carry gate evidence");
    modes.set(match[3], match[1]);
  }
  for (const path of git(root, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "-z",
  ])
    .split("\0")
    .filter(Boolean))
    modes.set(path, "100644");
  const attributes = spawnSync(
    "git",
    [
      "check-attr",
      "-z",
      "--stdin",
      "filter",
      "text",
      "eol",
      "working-tree-encoding",
    ],
    {
      cwd: root,
      encoding: "utf8",
      input: [...modes.keys()].join("\0") + "\0",
      maxBuffer: 32 * 1024 * 1024,
    },
  );
  if (attributes.status !== 0)
    throw new Error("Git attribute observation unavailable");
  const fields = attributes.stdout.split("\0");
  const filtered = new Set();
  for (let index = 0; index + 2 < fields.length; index += 3)
    if (!["unspecified", "unset"].includes(fields[index + 2] ?? ""))
      filtered.add(fields[index]);
  const autocrlf = spawnSync("git", ["config", "--get", "core.autocrlf"], {
    cwd: root,
    encoding: "utf8",
  }).stdout.trim();
  const fileMode =
    spawnSync("git", ["config", "--bool", "core.filemode"], {
      cwd: root,
      encoding: "utf8",
    }).stdout.trim() !== "false";
  /** @typedef {{mode: string, hash?: string, children?: Map<string, TreeEntry>}} TreeEntry */
  /** @type {Map<string, TreeEntry>} */
  const tree = new Map();
  for (const [path, indexedMode] of modes) {
    const absolute = join(root, path);
    let stat;
    try {
      stat = lstatSync(absolute);
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
        continue;
      throw error;
    }
    if (indexedMode === "160000")
      throw new Error("Submodule gate evidence needs an explicit adapter");
    if (!stat.isFile() && !stat.isSymbolicLink())
      throw new Error("Unsupported candidate tree entry");
    const mode = stat.isSymbolicLink()
      ? "120000"
      : fileMode
        ? stat.mode & 0o111
          ? "100755"
          : "100644"
        : indexedMode;
    const bytes = stat.isSymbolicLink()
      ? Buffer.from(readlinkSync(absolute))
      : readFileSync(absolute);
    // The project's generated attribute does not transform content. Ask Git only
    // when attributes can select a filter, to avoid a process per ordinary file.
    let hash = objectHash("blob", bytes, algorithm);
    if (
      !stat.isSymbolicLink() &&
      (filtered.has(path) || ["true", "input"].includes(autocrlf))
    ) {
      const converted = spawnSync(
        "git",
        ["hash-object", "--path", path, "--stdin"],
        { cwd: root, input: bytes, encoding: "utf8" },
      );
      if (converted.status !== 0)
        throw new Error("Git content conversion unavailable");
      hash = converted.stdout.trim();
    }
    const names = path.split("/");
    let entries = tree;
    for (const name of names.slice(0, -1)) {
      if (!entries.has(name))
        entries.set(name, { mode: "40000", children: new Map() });
      const children = entries.get(name)?.children;
      if (!children) throw new Error("Candidate file/directory collision");
      entries = children;
    }
    entries.set(names.at(-1) ?? "", { mode, hash });
  }
  /** @param {Map<string, TreeEntry>} entries @returns {string} */
  function hashTree(entries) {
    const rows = [...entries].sort(([a, av], [b, bv]) =>
      Buffer.compare(
        Buffer.from(a + (av.children ? "/" : "")),
        Buffer.from(b + (bv.children ? "/" : "")),
      ),
    );
    return objectHash(
      "tree",
      Buffer.concat(
        rows.map(([name, entry]) =>
          Buffer.concat([
            Buffer.from(`${entry.mode} ${name}\0`),
            Buffer.from(
              entry.children ? hashTree(entry.children) : (entry.hash ?? ""),
              "hex",
            ),
          ]),
        ),
      ),
      algorithm,
    );
  }
  return hashTree(tree);
}

/** @param {string} root */
export const checksPath = (root) =>
  join(root, "docs/control/local/harness/checks.json");
/** The hot index stays bounded; older executable observations remain addressed
 * by tree for reuse and meter history. Suite stdout is not an evidence field.
 */
export const gateCacheRows = 256;
/** @param {GateCheck[]} rows */
const uniqueChecks = (rows) => [
  ...new Map(rows.map((row) => [JSON.stringify(row), row])).values(),
];
/** @param {string} root */
const archiveDirectory = (root) =>
  join(dirname(checksPath(root)), "check-history");
/** @param {string} path @returns {GateCheck[]} */
function readChecksFile(path) {
  if (!existsSync(path)) return [];
  const rows = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(rows)) throw new Error("Malformed host gate evidence");
  return rows;
}
/** @param {string} root @param {string} [treeHash] @returns {GateCheck[]} */
export function readGateChecks(root, treeHash) {
  const path = checksPath(root);
  const directory = archiveDirectory(root);
  const archives = treeHash
    ? /^[a-f0-9]{40,64}$/.test(treeHash)
      ? [`${treeHash}.json`]
      : []
    : existsSync(directory)
      ? readdirSync(directory).filter((name) =>
          /^(?:[a-f0-9]{40,64}|legacy)\.json$/.test(name),
        )
      : [];
  const rows = uniqueChecks([
    ...archives.flatMap((name) => readChecksFile(join(directory, name))),
    ...readChecksFile(path),
  ]);
  return (
    treeHash ? rows.filter((row) => row.treeHash === treeHash) : rows
  ).sort((a, b) => (a.recordedAt ?? "").localeCompare(b.recordedAt ?? ""));
}
/** @param {string} root @param {GateCheck[]} additions */
export function recordGateChecks(root, additions) {
  const path = checksPath(root);
  mkdirSync(dirname(path), { recursive: true });
  // Concurrent suites and sessions share this cache. Serialize the short
  // read/replace transaction so one successful record cannot erase another.
  const lock = `${path}.lock`;
  const deadline = Date.now() + 5000;
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch (error) {
      if (
        /** @type {NodeJS.ErrnoException} */ (error).code !== "EEXIST" ||
        Date.now() >= deadline
      )
        throw new Error(
          "Host gate evidence lock unavailable; no evidence overwritten",
        );
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
  try {
    /** @template {GateDiagnostic} T @param {T} row @returns {Omit<T, "output">} */
    const retainDiagnostic = (row) => {
      const { output, ...metadata } = row;
      if (row.cases) metadata.cases = row.cases.map(retainDiagnostic);
      // Passing stdout was only a transient diagnostic. Failed suite and case
      // output share addressed logs; evidence lookup parses metadata alone.
      if (output && (row.exitCode !== 0 || !row.executed)) {
        const digest = createHash("sha256").update(output).digest("hex");
        const outputRef = `docs/control/local/harness/check-output/${digest}.log`;
        mkdirSync(dirname(join(root, outputRef)), { recursive: true });
        if (!existsSync(join(root, outputRef)))
          writeFileSync(join(root, outputRef), output, { mode: 0o600 });
        return { ...metadata, outputRef };
      }
      return metadata;
    };
    const rows = uniqueChecks(
      [...readChecksFile(path), ...additions].map(retainDiagnostic),
    );
    const evicted = rows.slice(0, Math.max(0, rows.length - gateCacheRows));
    const archives = new Map();
    for (const row of evicted) {
      const key = /^[a-f0-9]{40,64}$/.test(row.treeHash ?? "")
        ? row.treeHash
        : "legacy";
      const records = archives.get(key) ?? [];
      records.push(row);
      archives.set(key, records);
    }
    for (const [key, records] of archives) {
      const archived = join(archiveDirectory(root), `${key}.json`);
      mkdirSync(dirname(archived), { recursive: true });
      const temporary = `${archived}.${randomUUID()}.tmp`;
      writeFileSync(
        temporary,
        JSON.stringify(
          uniqueChecks([...readChecksFile(archived), ...records]),
        ) + "\n",
        { mode: 0o600 },
      );
      renameSync(temporary, archived);
    }
    const temporary = `${path}.${randomUUID()}.tmp`;
    writeFileSync(
      temporary,
      JSON.stringify(rows.slice(-gateCacheRows), null, 2) + "\n",
      { mode: 0o600 },
    );
    renameSync(temporary, path);
  } finally {
    rmdirSync(lock);
  }
}
/** A failed attempt does not erase a later or earlier successful run at identical bytes.
 * @param {string} root @param {string} checkId @param {string} treeHash
 */
export const findGateCheck = (root, checkId, treeHash) =>
  readGateChecks(root, treeHash)
    .reverse()
    .find(
      (row) =>
        row.checkId === checkId &&
        row.treeHash === treeHash &&
        row.executed === true &&
        row.exitCode === 0 &&
        Number.isFinite(row.durationMs) &&
        row.durationMs >= 0 &&
        Boolean(row.evidenceRef),
    );

/** @param {string} root @param {string[]} required */
export function requireGateChecks(root, required) {
  const treeHash = gateTreeHash(root);
  const missing = required.filter(
    (check) => !findGateCheck(root, check, treeHash),
  );
  if (missing.length)
    throw new Error(
      `Required application check missing, stale, unexecuted, or failing: ${missing.join(", ")}; run it at the current tree`,
    );
  return treeHash;
}
