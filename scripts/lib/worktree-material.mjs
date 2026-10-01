import {
  constants,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { docPath } from "./config.mjs";
import { runGit, runGitPathList, shellQuote, spawnGit } from "./git.mjs";
import { eventsForOrder, readControl } from "./control-store.mjs";
import { describeIgnoredMaterial, ignoredLane } from "./paths.mjs";

export function materialPath(candidate) {
  const path =
    typeof candidate === "string" ? candidate.replace(/\/$/u, "") : "";
  if (
    !path ||
    isAbsolute(path) ||
    path.includes("\0") ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  )
    throw new Error(
      "Material path must be relative to the worktree without . or .. components",
    );
  return path;
}

const declarationsPath = (root) =>
  docPath(root, "control", "local/material.json");
const dispositions = new Set(["disposable", "preserve", "undeclared"]);

// A path is not an identity. Do not persist host paths in the committed
// handoff; the digest binds a row to its physical worktree, while the state
// covers refs, all stored objects, index and working files (including dirt).
export function materialState(root, path) {
  try {
    requireMaterialContainment(root, path);
    const directory = join(root, materialPath(path));
    requireMaterialContainment(root, `${path}/.git`);
    const hash = createHash("sha256");
    const add = (name, bytes) => {
      hash.update(JSON.stringify([name, bytes.length]));
      hash.update(bytes);
    };
    const walk = (relative) => {
      const absolute = join(directory, relative);
      const item = lstatSync(absolute);
      add(relative, Buffer.from(String(item.mode)));
      if (item.isDirectory()) {
        for (const name of readdirSync(absolute).sort())
          if (relative || name !== ".git")
            walk(relative ? `${relative}/${name}` : name);
      } else if (item.isFile()) add(relative, readFileSync(absolute));
      else if (item.isSymbolicLink())
        add(relative, Buffer.from(readlinkSync(absolute)));
      else throw new Error("Unsupported repository entry");
    };
    walk("");
    for (const args of [
      ["for-each-ref", "--format=%(refname) %(objectname)"],
      ["cat-file", "--batch-all-objects", "--batch-check=%(objectname)"],
      ["ls-files", "--stage", "-z"],
    ])
      add(args[0], Buffer.from(runGit(directory, args)));
    const head = spawnGit(["-C", directory, "rev-parse", "--verify", "HEAD"], {
      encoding: "utf8",
    });
    if (head.status !== 0 && head.status !== 128)
      throw new Error("Repository HEAD cannot be inspected");
    add("HEAD", Buffer.from(head.status === 0 ? head.stdout : "unborn"));
    const symbolic = spawnGit(
      ["-C", directory, "symbolic-ref", "--quiet", "HEAD"],
      { encoding: "utf8" },
    );
    if (![0, 1].includes(symbolic.status))
      throw new Error("Repository HEAD ref cannot be inspected");
    add(
      "HEAD-ref",
      Buffer.from(symbolic.status === 0 ? symbolic.stdout : "detached"),
    );
    return {
      worktree: createHash("sha256").update(realpathSync(root)).digest("hex"),
      sha256: hash.digest("hex"),
    };
  } catch {
    // Missing evidence is not permission to reuse a disposable declaration.
    return null;
  }
}

const sameState = (left, right) =>
  left &&
  right &&
  left.worktree === right.worktree &&
  left.sha256 === right.sha256;

function checkedRows(rows) {
  if (!Array.isArray(rows))
    throw new Error("Material inventory must be an array");
  return rows.map((row) => {
    if (
      !row ||
      !dispositions.has(row.disposition) ||
      !["declared", "lane"].includes(row.source) ||
      typeof row.reason !== "string" ||
      !row.reason.trim()
    )
      throw new Error("Invalid material disposition record");
    return { ...row, path: materialPath(row.path) };
  });
}

// A declaration never follows a symlink, including its ignored record's parents.
export function requireMaterialContainment(root, path) {
  let current = root;
  for (const part of materialPath(path).split("/")) {
    current = join(current, part);
    if (lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink())
      throw new Error("Material declaration refuses a symlink");
  }
}

export function readMaterialDeclarations(root) {
  const file = declarationsPath(root);
  const relative = file.slice(root.length + 1);
  requireMaterialContainment(root, relative);
  if (!existsSync(file)) return [];
  const record = JSON.parse(readFileSync(file, "utf8"));
  if (record.schemaVersion !== 1)
    throw new Error("Invalid material declaration schema");
  return checkedRows(record.material);
}

/** Inventory only the repository units Git reports; ordinary ignored files
 * keep their existing lane behavior. Only a current, worktree-bound explicit
 * word overrides a fresh lane classification; a lane row is an observation. */
export function inventoryMaterial(
  root,
  {
    declarations = readMaterialDeclarations(root),
    overrides = [],
    overrideWorktree = null,
  } = {},
) {
  root = realpathSync(root);
  const declared = new Map(
    checkedRows(declarations)
      .filter((row) => row.source === "declared")
      .map((row) => [row.path, row]),
  );
  const words = new Map(
    checkedRows(overrides)
      .filter(
        (row) =>
          resolve(row.worktree ?? overrideWorktree ?? "") === root &&
          Boolean(row.worktree || overrideWorktree),
      )
      .map((row) => [row.path, row]),
  );
  const ignored = runGitPathList(root, [
    "ls-files",
    "-z",
    "--others",
    "--ignored",
    "--exclude-standard",
  ]);
  // Intake re-includes directories to retain .gitkeep. A repository unit can
  // consequently be untracked while its contents are ignored; it is still
  // protected intake, never ordinary scratch or permission to drop work.
  const intake = runGitPathList(root, [
    "ls-files",
    "-z",
    "--others",
    "--exclude-standard",
  ]).filter(
    (path) => path.endsWith("/") && ignoredLane(path, root) === "intake",
  );
  return [...new Set([...ignored, ...intake])]
    .sort()
    .filter((path) => path.endsWith("/"))
    .map((path) => describeIgnoredMaterial(root, path))
    .filter((row) => row.kind === "nested-repository")
    .map((row) => {
      const path = materialPath(row.path),
        state = materialState(root, path);
      const recorded = declared.get(path);
      const explicit =
        words.get(path) ??
        (sameState(recorded?.state, state) ? recorded : undefined);
      // A stale keep decision is uncertainty, not permission to downgrade
      // preservation to a scratch-lane deletion. A fresh scoped word can settle it.
      const staleKeep =
        !explicit &&
        recorded?.disposition === "preserve" &&
        (!recorded.state || recorded.state.worktree === state?.worktree);
      if (row.lane === "intake" && explicit?.disposition === "disposable")
        throw new Error(
          "Protected intake repositories cannot be declared disposable",
        );
      return {
        path,
        lane: row.lane,
        disposition:
          explicit?.disposition ??
          (staleKeep
            ? "undeclared"
            : row.disposable
              ? "disposable"
              : ["intake", "control"].includes(row.lane)
                ? "preserve"
                : "undeclared"),
        source: explicit?.source ?? "lane",
        reason:
          explicit?.reason ??
          (staleKeep
            ? "preservation declaration no longer matches repository state; a new word is required"
            : row.classification),
        state,
      };
    });
}

export function declareMaterial(root, candidate, disposition, reason) {
  const path = materialPath(candidate);
  if (
    !dispositions.has(disposition) ||
    disposition === "undeclared" ||
    !reason?.trim()
  )
    throw new Error(
      "Material declaration needs disposable or preserve and a nonempty reason",
    );
  requireMaterialContainment(root, path);
  const material = inventoryMaterial(root);
  const current = material.find((row) => row.path === path);
  if (!current)
    throw new Error(
      `${JSON.stringify(path)} is not an ignored nested repository`,
    );
  if (current.lane === "intake" && disposition === "disposable")
    throw new Error(
      "Protected intake repositories cannot be declared disposable",
    );
  const row = { ...current, disposition, source: "declared", reason };
  const rows = readMaterialDeclarations(root).filter(
    (entry) => entry.path !== path,
  );
  rows.push(row);
  rows.sort((a, b) => a.path.localeCompare(b.path));
  const file = declarationsPath(root);
  requireMaterialContainment(root, file.slice(root.length + 1));
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  writeFileSync(
    file,
    `${JSON.stringify({ schemaVersion: 1, material: rows }, null, 2)}\n`,
    { mode: 0o600 },
  );
  return row;
}

// Close consumes main's committed completion, never the subject's local words.
export function committedMaterial(root, workOrder, revision = "HEAD") {
  const event = eventsForOrder(readControl(root, revision), workOrder)
    .filter((row) =>
      ["ImplementationReady", "RepairCompleted"].includes(row.type),
    )
    .at(-1);
  return checkedRows(event?.evidence?.material ?? []);
}

export function parseMaterialFlags(args, allowed) {
  const flags = [],
    material = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--material") {
      const value = args[++index] ?? "",
        at = value.lastIndexOf("=");
      const disposition = value.slice(at + 1);
      if (at < 1 || !["disposable", "preserve"].includes(disposition))
        throw new Error("usage: --material <path>=disposable|preserve");
      const candidate = value.slice(0, at),
        scopeAt = isAbsolute(candidate) ? candidate.indexOf("::") : -1;
      const worktree = scopeAt < 0 ? undefined : candidate.slice(0, scopeAt);
      if (worktree !== undefined && !isAbsolute(worktree))
        throw new Error("Scoped material needs an absolute worktree before ::");
      const path = materialPath(
        scopeAt < 0 ? candidate : candidate.slice(scopeAt + 2),
      );
      if (
        material.some((row) => row.path === path && row.worktree === worktree)
      )
        throw new Error(`Duplicate material path: ${path}`);
      material.push({
        path,
        ...(worktree ? { worktree: resolve(worktree) } : {}),
        disposition,
        source: "declared",
        reason: "operator close --material declaration",
      });
    } else {
      if (!allowed.includes(arg) || flags.includes(arg))
        throw new Error(`Unexpected or duplicate flag: ${arg}`);
      flags.push(arg);
    }
  }
  return { flags, material };
}

export const materialDeclareCommand = (path) =>
  `npm run worktree -- material ${shellQuote(materialPath(path))} --preserve --reason 'keep this repository'`;

export const materialCloseCommand = (
  main,
  workOrder,
  path,
  disposition = "preserve",
) =>
  `node ${shellQuote(join(main, "scripts/release.mjs"))} close ${workOrder} --publish ${(Array.isArray(
    path,
  )
    ? path
    : [path]
  )
    .map((row) => {
      const candidate = typeof row === "string" ? row : row.path;
      const scope =
        typeof row === "string" || !row.worktree ? "" : `${row.worktree}::`;
      return `--material ${shellQuote(`${scope}${materialPath(candidate)}=${disposition}`)}`;
    })
    .join(" ")}`;

export const materialFlagValue = (row) =>
  `${row.worktree ? `${row.worktree}::` : ""}${row.path}=${row.disposition}`;

export function verifyMaterialState(root, material) {
  for (const row of material)
    if (
      row.disposition !== "undeclared" &&
      !sameState(row.state, materialState(root, row.path))
    )
      throw new Error(
        `Repository material changed or cannot be inspected: ${JSON.stringify(row.path)}; source retained`,
      );
}

/** A bundle contains all commit objects, including ones no current ref reaches.
 * Temporary export refs are removed in finally; no source history is rewritten.
 * Failure leaves both source and any partial recovery bytes for inspection. */
export function recoverDisposableRepositories(
  source,
  main,
  workOrder,
  material,
  { dryRun = false } = {},
) {
  const recovery = [];
  for (const row of material.filter(
    (entry) => entry.disposition === "disposable",
  )) {
    verifyMaterialState(source, [row]);
    const nested = join(source, row.path);
    const objects = runGit(nested, [
      "cat-file",
      "--batch-all-objects",
      "--batch-check=%(objectname) %(objecttype)",
    ]);
    const commits = objects
      .split("\n")
      .filter((line) => line.endsWith(" commit"))
      .map((line) => line.split(" ")[0])
      .sort();
    if (!commits.length) {
      recovery.push({
        worktree: source,
        repository: row.path,
        outcome: "not-needed",
        reason: "repository has no commit objects",
        commitCount: 0,
      });
      continue;
    }
    const id = createHash("sha256")
      .update(JSON.stringify([row.path, row.state]))
      .digest("hex");
    const path = `${docPath(main, "control", `local/retained/${workOrder}/recovery`).slice(main.length + 1)}/${id}.bundle`;
    const result = {
      worktree: source,
      repository: row.path,
      path,
      commitCount: commits.length,
      outcome: dryRun ? "would-bundle" : "bundled",
    };
    requireMaterialContainment(main, path);
    if (
      runGitPathList(main, ["ls-files", "-z", "--", `:(literal)${path}`])
        .length ||
      !runGitPathList(main, ["check-ignore", "--no-index", "-z", "--stdin"], {
        input: `${path}\0`,
      }).includes(path)
    )
      throw new Error(
        "Recovery bundle must remain ignored and untracked; source retained",
      );
    if (dryRun) {
      recovery.push(result);
      continue;
    }
    const file = join(main, path);
    const nonce = randomUUID(),
      prefix = `refs/dotln/material-recovery/${nonce}`;
    const refs = commits.map((commit, index) => `${prefix}/${index}`);
    const temporary = `${file}.${nonce}.partial`;
    mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
    if (!existsSync(file)) {
      let exported = false;
      try {
        runGit(nested, ["update-ref", "--stdin"], {
          input: refs
            .map((ref, index) => `create ${ref} ${commits[index]}\n`)
            .join(""),
        });
        exported = true;
        runGit(nested, ["bundle", "create", temporary, "--all"]);
        runGit(nested, ["bundle", "verify", temporary]);
        copyFileSync(temporary, file, constants.COPYFILE_EXCL);
        unlinkSync(temporary);
      } finally {
        if (exported)
          runGit(nested, ["update-ref", "--stdin"], {
            input: refs.map((ref) => `delete ${ref}\n`).join(""),
          });
      }
    }
    if (!lstatSync(file).isFile())
      throw new Error("Recovery bundle is not a regular file; source retained");
    runGit(nested, ["bundle", "verify", file]);
    const heads = new Set(
      runGit(nested, ["bundle", "list-heads", file])
        .split("\n")
        .map((line) => line.split(" ")[0]),
    );
    if (commits.some((commit) => !heads.has(commit)))
      throw new Error("Recovery bundle omits a commit; source retained");
    // Verify in an empty repository so prerequisites cannot be satisfied by
    // the source that is about to leave. Importing and fsck also check the pack.
    const validation = mkdtempSync(join(dirname(file), ".verify-"));
    try {
      runGit(main, ["init", "--bare", "--quiet", validation]);
      runGit(validation, ["bundle", "verify", file]);
      runGit(validation, ["bundle", "unbundle", file]);
      const imported = runGit(
        validation,
        ["cat-file", "--batch-check=%(objectname) %(objecttype)"],
        { input: commits.join("\n") + "\n" },
      );
      if (imported !== commits.map((commit) => `${commit} commit`).join("\n"))
        throw new Error(
          "Recovery bundle cannot restore every commit; source retained",
        );
      runGit(validation, ["fsck", "--full"]);
    } finally {
      rmSync(validation, { recursive: true, force: true });
    }
    result.sha256 = createHash("sha256")
      .update(readFileSync(file))
      .digest("hex");
    verifyMaterialState(source, [row]);
    recovery.push(result);
  }
  return recovery;
}
