import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import {
  delimiter,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";

export const replicaMechanismVersion = 3;
export const replicaNodeOptions = "--preserve-symlinks";
export const replicaMainNodeOptions = `${replicaNodeOptions} --preserve-symlinks-main`;
export const supportedReplicaNodeOptions = (value) =>
  !value || [replicaNodeOptions, replicaMainNodeOptions].includes(value);
export const replicaSupportPaths = [
  "package.json",
  ...["kernel", "compiler", "skeleton", "console"].map(
    (name) => `packages/${name}/package.json`,
  ),
];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const within = (root, path) => {
  const part = relative(root, path);
  return part !== ".." && !part.startsWith("../") && !isAbsolute(part);
};
export const declaredPath = (paths, path) =>
  paths.some((input) =>
    input.endsWith("/")
      ? path === input.slice(0, -1) || path.startsWith(input)
      : path === input,
  );

/** A declaration restricts execution and identity together. Fixtures supply
 * their own harness identities; an ambient session cannot become a hidden input. */
export const declaredSuiteEnvironment = (declaration, inherited) =>
  Array.isArray(declaration?.environment)
    ? Object.fromEntries(
        Object.entries(inherited).filter(([name]) =>
          declaration.environment.includes(name),
        ),
      )
    : inherited;

/** Select only candidate entries, plus structural parent directories. Directory
 * listings are represented by these selected names, never an ignored subtree. */
export function replicaEntries(declaration, snapshot) {
  const selected = snapshot.entries.filter(([path]) =>
    declaredPath(declaration.paths, path),
  );
  const parents = new Set();
  for (const [path] of selected)
    for (let parent = dirname(path); parent !== "."; parent = dirname(parent))
      parents.add(parent);
  return snapshot.entries.filter(
    ([path]) => parents.has(path) || declaredPath(declaration.paths, path),
  );
}

/** Executable resolution walks existing directories in order, so those are the
 * replica's PATH and its identity. A dangling per-shell entry, a repeated
 * spelling, a symlink spelling of one directory or a non-directory resolves
 * nothing and would otherwise fork one host's key between its sessions.
 * Candidate entries keep their replica mapping; they may exist only there. */
export function canonicalPathEntries(value, repo, aliases, root) {
  const seen = new Set();
  const entries = [];
  for (const part of value.split(delimiter)) {
    let entry = part;
    if (part) {
      const lexical = resolve(repo, part);
      let physical = null;
      try {
        physical = realpathSync(lexical);
      } catch {
        /* Absent outside the candidate: dropped below. Absent inside it: mapped. */
      }
      const candidate = physical ?? lexical;
      const base = aliases.find((alias) => within(alias, candidate));
      if (base) entry = join(root, relative(base, candidate));
      else if (isAbsolute(part)) {
        if (!physical) continue;
        try {
          if (!lstatSync(physical).isDirectory()) continue;
        } catch {
          continue;
        }
        entry = physical;
      }
    }
    if (seen.has(entry)) continue;
    seen.add(entry);
    entries.push(entry);
  }
  return entries;
}

/** The placeholders are the identity of runner-owned locations. Actual paths
 * are substituted only at dispatch and never serialized into shared evidence. */
export function projectReplicaEnvironment(
  repo,
  inherited,
  root,
  temporary,
  nodeOptions = replicaNodeOptions,
  ceiling = dirname(root),
) {
  const env = { ...inherited };
  const aliases = [...new Set([resolve(repo), realpathSync(repo)])];
  const reveals = (value) => aliases.some((path) => value.includes(path));
  const physicalPath = (path) => {
    try {
      return realpathSync(path);
    } catch {
      return path;
    }
  };
  if (!supportedReplicaNodeOptions(env.NODE_OPTIONS))
    return { refusal: "NODE_OPTIONS supplies an unmodelled startup adapter" };
  if (env.NODE_PATH || env.BASH_ENV || env.ENV)
    return { refusal: "environment supplies an unmodelled startup adapter" };
  if (
    [
      "GIT_DIR",
      "GIT_WORK_TREE",
      "GIT_COMMON_DIR",
      "GIT_INDEX_FILE",
      "GIT_OBJECT_DIRECTORY",
      "GIT_ALTERNATE_OBJECT_DIRECTORIES",
      "GIT_CONFIG_COUNT",
      "GIT_CONFIG_PARAMETERS",
      "GIT_CONFIG_SYSTEM",
      "GIT_TEMPLATE_DIR",
    ].some((name) => env[name])
  )
    return { refusal: "environment overrides the replica Git repository" };
  for (const [name, value] of Object.entries(env)) {
    if (name === "PATH") {
      env[name] = canonicalPathEntries(value, repo, aliases, root).join(
        delimiter,
      );
    } else if (
      /^npm_config_local_prefix$/i.test(name) &&
      aliases.includes(value)
    ) {
      // npm derives this from cwd. Rebind that same meaning in the replica.
      env[name] = root;
    } else if (["TMPDIR", "TMP", "TEMP"].includes(name)) {
      env[name] = temporary;
    } else if (
      reveals(value) ||
      (isAbsolute(value) &&
        aliases.some((alias) => within(alias, physicalPath(value))))
    ) {
      return { refusal: `projected ${name} reveals the candidate tree` };
    }
  }
  env.TMPDIR = temporary;
  env.TMP = temporary;
  env.TEMP = temporary;
  env.NODE_OPTIONS = nodeOptions;
  env.GIT_CONFIG_NOSYSTEM = "1";
  // Repository discovery from a `git: none` replica stops at its nonce-named
  // parent instead of walking into the scratch root or a repository above it.
  env.GIT_CEILING_DIRECTORIES = ceiling;
  if (Object.values(env).some(reveals))
    return { refusal: "projected environment reveals the candidate tree" };
  return { env };
}

export function replicaPlan(row, declaration, snapshot) {
  if (!declaration?.paths) return null;
  const refuse = (refusal) => ({ refusal });
  // Kernel read denial is an addition where the host can start it, never a
  // condition of narrowing: its availability is recorded, not keyed.
  if (!snapshot?.installedReusable)
    return refuse("installed inputs contain an unsupported link or file");
  if (!snapshot.replicaHostReusable)
    return refuse("host Git configuration supplies an unmodelled adapter");
  if (!snapshot.toolchainReusable)
    return refuse(
      "toolchain or package configuration observation is incomplete",
    );
  const aliases = [snapshot.repo, snapshot.physical];
  if (
    [...row.command, ...(row.args ?? [])].some((part) =>
      aliases.some((alias) => part.includes(alias)),
    )
  )
    return refuse("suite arguments reveal the candidate tree");
  const projection = projectReplicaEnvironment(
    snapshot.repo,
    declaredSuiteEnvironment(declaration, snapshot.env),
    "<replica>",
    "<suite-temporary>",
    declaration.nodeOptions,
    "<replica-parent>",
  );
  if (projection.refusal) return projection;
  const entries = replicaEntries(declaration, snapshot);
  const paths = new Set(entries.map(([path]) => path));
  const installed = (path) =>
    snapshot.installedRoots.some(
      (root) => path === root || path.startsWith(`${root}/`),
    );
  for (const [path, value] of entries) {
    if (["unsupported", "external-link"].includes(value[0]))
      return refuse(`unsupported declared input: ${path}`);
    if (value[0] !== "link") continue;
    const target = resolve(snapshot.repo, dirname(path), value[1]);
    const local = relative(snapshot.repo, target);
    if (
      !within(snapshot.repo, target) ||
      (!paths.has(local) && !installed(local))
    )
      return refuse(`declared symlink leaves the replica: ${path}`);
  }
  for (const path of snapshot.candidateTools ?? [])
    if (!paths.has(path) && !installed(path))
      return refuse(`candidate executable is undeclared: ${path}`);
  return { entries, environment: projection.env };
}

const fileDigest = (path) => hash(readFileSync(path));
const setReadonly = (root) => {
  const info = lstatSync(root);
  if (info.isSymbolicLink()) return;
  if (info.isDirectory()) {
    for (const name of readdirSync(root)) setReadonly(join(root, name));
    chmodSync(root, (info.mode & 0o555) | 0o500);
  } else chmodSync(root, info.mode & 0o555);
};
const removeOwned = (root) => {
  try {
    const info = lstatSync(root, { throwIfNoEntry: false });
    if (!info) return;
    if (info.isDirectory() && !info.isSymbolicLink()) {
      chmodSync(root, 0o700);
      for (const name of readdirSync(root)) removeOwned(join(root, name));
    }
    rmSync(root, { recursive: true, force: true });
  } catch (error) {
    // Git maintenance or a finishing fixture child may remove an owned entry
    // between lstat and readdir. Its absence already satisfies cleanup.
    if (error.code !== "ENOENT") throw error;
  }
};

/** Plain copies only. The observed inventory is also the copy verifier; links
 * are rebuilt against the copied graph and cannot target the candidate tree. */
export function createReplicaContext(repo) {
  const physical = realpathSync(repo);
  const base = realpathSync(tmpdir());
  if (within(physical, base))
    throw new Error("Replica scratch must be outside the candidate tree");
  const directory = mkdtempSync(join(base, "dotln-suite-replicas-"));
  const identity = lstatSync(directory);
  const installed = join(directory, `installed-${randomUUID()}`);
  const diagnostics = join(directory, `diagnostics-${randomUUID()}`);
  mkdirSync(diagnostics);
  chmodSync(directory, 0o300);
  let copied = false;
  let cleaned = false;
  let copiedIdentity;
  let copyFailure;
  const measurements = {
    version: replicaMechanismVersion,
    installedCopy: null,
    suites: [],
  };
  const prepareInstalled = (snapshot) => {
    const currentIdentity = hash(
      JSON.stringify([
        snapshot.runtime,
        snapshot.entries.filter(([path]) => replicaSupportPaths.includes(path)),
      ]),
    );
    if (copied) {
      if (currentIdentity !== copiedIdentity)
        throw new Error("Installed inputs changed after the gate copy");
      return;
    }
    // One gate copies once. A copy that failed names its cause to every later
    // suite instead of leaving a partial directory for them to collide with.
    if (copyFailure)
      throw new Error(
        `Installed copy failed earlier in this gate: ${copyFailure}`,
      );
    const started = performance.now();
    const partial = `${installed}.partial-${randomUUID()}`;
    mkdirSync(partial);
    let files = 0,
      bytes = 0;
    let published = false;
    try {
      const entries = [...snapshot.installed];
      // Workspace links need package metadata for Node resolution. These leaves
      // are explicit in every declaration, verified here and included in its key.
      for (const path of replicaSupportPaths) {
        const entry = snapshot.entries.find(([name]) => name === path);
        if (entry && entry[1][0] !== "absent") entries.push(entry);
      }
      const copiedPaths = new Set(entries.map(([path]) => path));
      const linkTargets = new Map(
        entries
          .filter(([, value]) => Array.isArray(value) && value[0] === "link")
          .map(([path, value]) => [path, value[1]]),
      );
      const copiedGraph = (local) =>
        copiedPaths.has(local) ||
        entries.some(([name]) => name.startsWith(`${local}/`));
      // A link may name its target through another copied link, as npm's bin
      // links do through a workspace link. Follow only copied links, one hop
      // at a time, until the target is a copied entry; a hop that leaves the
      // repository or lands outside the copied graph refuses as before.
      const throughCopiedLinks = (local) => {
        for (let hops = 0; hops < 40; hops++) {
          if (copiedGraph(local)) return true;
          let prefix = dirname(local);
          while (prefix !== "." && !linkTargets.has(prefix))
            prefix = dirname(prefix);
          if (prefix === ".") return false;
          const hop = resolve(repo, dirname(prefix), linkTargets.get(prefix));
          if (!within(repo, hop)) return false;
          local = join(relative(repo, hop), relative(prefix, local));
        }
        return false;
      };
      for (const [path, value, mode] of entries) {
        const source = join(repo, path),
          destination = join(partial, path);
        if (value === "absent" || value[0] === "absent") continue;
        if (value === "directory") {
          mkdirSync(destination, { recursive: true, mode });
          chmodSync(destination, mode);
          continue;
        }
        mkdirSync(dirname(destination), { recursive: true });
        if (value[0] === "link") {
          const target = resolve(repo, dirname(path), value[1]);
          const local = relative(repo, target);
          if (!within(repo, target) || !throughCopiedLinks(local))
            throw new Error(`Installed link leaves the copied graph: ${path}`);
          symlinkSync(
            relative(dirname(destination), join(partial, local)),
            destination,
          );
        } else if (typeof value[0] === "number") {
          copyFileSync(source, destination);
          chmodSync(destination, value[0]);
          if (
            fileDigest(destination) !== value[1] ||
            (lstatSync(destination).mode & 0o777) !== value[0]
          )
            throw new Error(`Installed copy differs from observation: ${path}`);
          files++;
          bytes += lstatSync(destination).size;
        } else throw new Error(`Unsupported installed input: ${path}`);
      }
      // Publish the verified copy by one rename; nothing observes it earlier.
      // The rename precedes the read-only pass, which a renamed directory
      // would otherwise refuse.
      renameSync(partial, installed);
      published = true;
      setReadonly(installed);
    } catch (error) {
      copyFailure = error instanceof Error ? error.message : String(error);
      removeOwned(published ? installed : partial);
      throw error;
    }
    copied = true;
    copiedIdentity = currentIdentity;
    measurements.installedCopy = {
      durationMs: performance.now() - started,
      files,
      bytes,
      verified: true,
      readonly: true,
    };
  };
  return {
    directory,
    diagnostics,
    measurements,
    create(row, declaration, snapshot) {
      const plan = replicaPlan(row, declaration, snapshot);
      if (!plan || plan.refusal) return plan;
      prepareInstalled(snapshot);
      const started = performance.now();
      const parent = join(directory, `suite-${randomUUID()}`);
      mkdirSync(parent, { mode: 0o300 });
      const root = join(parent, `root-${randomUUID()}`);
      const temporary = join(parent, `tmp-${randomUUID()}`);
      mkdirSync(root);
      mkdirSync(temporary);
      for (const [path, value] of plan.entries) {
        const destination = join(root, path);
        if (value[0] === "absent") continue;
        if (value[0] === "directory") {
          mkdirSync(destination, { recursive: true });
          continue;
        }
        mkdirSync(dirname(destination), { recursive: true });
        if (value[0] === "link") {
          const local = relative(repo, resolve(repo, dirname(path), value[1]));
          symlinkSync(
            relative(dirname(destination), join(root, local)),
            destination,
          );
        } else {
          copyFileSync(join(repo, path), destination);
          chmodSync(destination, value[0]);
          if (fileDigest(destination) !== value[1])
            throw new Error(`Declared input changed before copying: ${path}`);
        }
      }
      for (const path of snapshot.installedRoots) {
        if (!existsSync(join(installed, path))) continue;
        mkdirSync(dirname(join(root, path)), { recursive: true });
        symlinkSync(join(installed, path), join(root, path));
      }
      const projection = projectReplicaEnvironment(
        repo,
        declaredSuiteEnvironment(declaration, snapshot.env),
        root,
        temporary,
        declaration.nodeOptions,
        parent,
      );
      if (projection.refusal) throw new Error(projection.refusal);
      if (declaration.git === "replica-repo") {
        const env = {
          ...projection.env,
          GIT_CONFIG_NOSYSTEM: "1",
          GIT_CONFIG_GLOBAL: "/dev/null",
          GIT_AUTHOR_NAME: "DotLn fixture",
          GIT_COMMITTER_NAME: "DotLn fixture",
          GIT_AUTHOR_EMAIL: "fixture@example.invalid",
          GIT_COMMITTER_EMAIL: "fixture@example.invalid",
          GIT_AUTHOR_DATE: "2000-01-01T00:00:00Z",
          GIT_COMMITTER_DATE: "2000-01-01T00:00:00Z",
        };
        for (const args of [
          ["init", "-q", "--template=", "-b", "main"],
          [
            "-c",
            "core.hooksPath=/dev/null",
            "add",
            "-f",
            "--",
            ...plan.entries
              .filter(
                ([, value]) =>
                  typeof value[0] === "number" || value[0] === "link",
              )
              .map(([path]) => path),
          ],
          [
            "-c",
            "core.hooksPath=/dev/null",
            "-c",
            "commit.gpgsign=false",
            "commit",
            "-qm",
            "Declared suite inputs",
            "--allow-empty",
          ],
        ]) {
          const result = spawnSync("git", args, {
            cwd: root,
            env,
            encoding: "utf8",
          });
          if (result.status !== 0)
            throw new Error(
              `Replica repository initialization failed: ${result.stderr}`,
            );
        }
      }
      const measurement = {
        name: row.name,
        setupMs: performance.now() - started,
        candidateFiles: plan.entries.filter(
          ([, value]) => typeof value[0] === "number",
        ).length,
        git: declaration.git,
      };
      measurements.suites.push(measurement);
      return {
        root,
        env: projection.env,
        measurement,
        cleanup: () => removeOwned(parent),
      };
    },
    cleanup() {
      if (cleaned) return;
      const current = lstatSync(directory);
      if (
        !current.isDirectory() ||
        current.isSymbolicLink() ||
        current.ino !== identity.ino ||
        current.dev !== identity.dev
      )
        throw new Error("Refusing cleanup of replaced replica context");
      removeOwned(directory);
      cleaned = true;
    },
  };
}
