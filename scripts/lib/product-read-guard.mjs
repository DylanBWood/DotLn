// The product key excludes documents (WO-174). Observe the package run
// itself, including Node descendants that inherit NODE_OPTIONS, instead of
// rerunning it.
import fs from "node:fs";
import promises from "node:fs/promises";
import children from "node:child_process";
import { createHook, executionAsyncId } from "node:async_hooks";
import { syncBuiltinESMExports } from "node:module";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { defaultDocRelative, docPath, docRelative } from "./config.mjs";
import { prospectiveRealpath } from "./gate-evidence.mjs";
import { spawnGit } from "./git.mjs";

const observerURL = pathToFileURL(fileURLToPath(import.meta.url)).href;
const vocabularyPath = defaultDocRelative("control", "outward-vocabulary.json");

export function productReadEnvironment(repo, env, name, order) {
  const root = fs.realpathSync(repo);
  const git = (args, input) => {
    const result = spawnGit(args, {
      cwd: root,
      encoding: "utf8",
      input,
      maxBuffer: 32 * 1024 * 1024,
    });
    if (result.status !== 0)
      throw new Error(`Product read inventory unavailable: ${result.stderr}`);
    return result.stdout;
  };
  const tracked = [
    ...new Set(git(["ls-files", "-z"]).split("\0").filter(Boolean)),
  ];
  const fields = git(
    ["check-attr", "-z", "--stdin", "dotln-generated", "dotln-documentation"],
    tracked.join("\0") + "\0",
  ).split("\0");
  const excluded = new Set(
    tracked.filter(
      (path) =>
        path !== vocabularyPath &&
        (/^(?:docs|\.claude|\.agents)\//u.test(path) ||
          /^[^/]+\.md$/iu.test(path)),
    ),
  );
  for (let i = 0; i + 2 < fields.length; i += 3)
    if (fields[i + 2] === "set") excluded.add(fields[i]);
  excluded.delete(vocabularyPath);
  const directories = new Set();
  for (const path of excluded)
    for (let parent = dirname(path); parent !== "."; parent = dirname(parent))
      directories.add(parent);
  const recordRoots = /^WO-\d{3}$/.test(order ?? "")
    ? ["evidence", "verifications", "finalReviews"].map((kind) =>
        docRelative(root, kind, order),
      )
    : [];
  const directory = docPath(
    root,
    "control",
    "local/harness/runner/product-reads",
  );
  fs.mkdirSync(directory, { recursive: true });
  const stem = join(
    directory,
    `${name.replace(/[^a-z0-9-]/giu, "-")}-${randomUUID()}`,
  );
  const manifest = `${stem}.json`,
    log = `${stem}.jsonl`;
  fs.writeFileSync(
    manifest,
    JSON.stringify({
      root,
      excluded: [...excluded],
      directories: [...directories],
      recordRoots,
    }),
  );
  fs.writeFileSync(log, "");
  return {
    log,
    env: {
      ...env,
      NODE_OPTIONS: `${env.NODE_OPTIONS ?? ""} --import=${observerURL}`.trim(),
      DOTLN_PRODUCT_READ_MANIFEST: manifest,
      DOTLN_PRODUCT_READ_LOG: log,
      DOTLN_PRODUCT_READ_CASE: "<module setup>",
    },
  };
}

export function productReadObservations(log) {
  return fs
    .readFileSync(log, "utf8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);
}

// A cloned runner can import a second copy of this module in a preloaded
// process. Observe each manifest once instead of wrapping the same I/O again.
const installations = (globalThis[
  Symbol.for("dotln.product-read-guard.installations")
] ??= new Set());
const manifestPath = process.env.DOTLN_PRODUCT_READ_MANIFEST;
const logPath = process.env.DOTLN_PRODUCT_READ_LOG;
const installationKey = JSON.stringify([manifestPath, logPath]);
if (manifestPath && !installations.has(installationKey)) {
  const {
    root,
    excluded,
    directories,
    recordRoots = [],
  } = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const paths = new Set(excluded),
    dirs = new Set(directories),
    descriptors = new Map();
  const contexts = new Map();
  const originalAppend = fs.appendFileSync;
  const originalRealpath = fs.realpathSync;
  const pathIO = {
    lstatSync: fs.lstatSync,
    readlinkSync: fs.readlinkSync,
    realpathSync: originalRealpath.native,
  };
  const seen = new Set();
  // Test is Node 26's async resource; the fixture pins name attribution across
  // awaits and nested cases. Other resources inherit that context.
  createHook({
    init(id, type, trigger, resource) {
      if (type === "Test") contexts.set(id, resource);
      else if (contexts.has(trigger)) contexts.set(id, contexts.get(trigger));
    },
    destroy(id) {
      contexts.delete(id);
    },
  }).enable();
  const caseName = () => {
    let context = contexts.get(executionAsyncId());
    const names = [];
    while (context?.name) {
      names.unshift(context.name);
      context = context.parent;
    }
    return (
      names.join(" > ") ||
      process.env.DOTLN_PRODUCT_READ_CASE ||
      "<module setup>"
    );
  };
  const record = (event) => {
    const key = JSON.stringify(event);
    if (seen.has(key)) return;
    seen.add(key);
    originalAppend(
      logPath,
      JSON.stringify({ ...event, pid: process.pid }) + "\n",
    );
  };
  const filePath = (value) => {
    if (typeof value === "number") return descriptors.get(value)?.path;
    // Node also takes a URL-shaped object and any byte view as a path.
    if (value && typeof value === "object" && typeof value.href === "string")
      return value.protocol === "file:" ? fileURLToPath(value.href) : undefined;
    if (ArrayBuffer.isView(value))
      return Buffer.from(
        value.buffer,
        value.byteOffset,
        value.byteLength,
      ).toString();
    return typeof value === "string" ? value : undefined;
  };
  const observe = (method, value, recordsOnly = false, options) => {
    const input = filePath(value);
    if (input === undefined) return;
    const enumerates = /readdir|opendir|^(?:promises\.)?watch$/.test(method);
    const copies = /^(?:promises\.)?cp(?:Sync)?$/.test(method);
    // A copy from the root or an ancestor is judged as a walk whatever its
    // options; a listing or watch only when it asks to descend.
    const recursive =
      copies ||
      (enumerates &&
        typeof options === "object" &&
        options !== null &&
        Boolean(options.recursive));
    const lexical = resolve(input);
    let physical = lexical;
    try {
      // Preserve symlink-before-.. semantics and resolve existing parents of
      // not-yet-created reports; resolve() followed by realpath() loses both.
      const absolute = isAbsolute(input)
        ? input
        : `${process.cwd()}${sep}${input}`;
      try {
        physical = originalRealpath.native(absolute);
      } catch {
        // A missing leaf with an existing parent needs no root-to-leaf walk.
        // A dangling leaf link is present to lstat and must use full traversal.
        // Keep the parent spelling intact until native resolution follows '..'.
        try {
          if (
            absolute.endsWith(sep) ||
            pathIO.lstatSync(absolute, { throwIfNoEntry: false }) !== undefined
          )
            throw new Error("Existing leaf requires prospective traversal");
          physical = join(
            originalRealpath.native(dirname(absolute)),
            basename(absolute),
          );
        } catch {
          physical = prospectiveRealpath(absolute, pathIO);
        }
      }
    } catch {
      /* An attempted read still names its lexical path. */
    }
    for (const absolute of new Set([lexical, physical])) {
      const path = relative(root, absolute).split(sep).join("/");
      // The root and its ancestors name a record only through a walk that
      // descends: a plain listing there shows nothing below its own entries.
      const containsRoot = path === "" || /^\.\.(?:\/\.\.)*$/.test(path);
      if (
        isAbsolute(path) ||
        (!containsRoot && (path === ".." || path.startsWith("../")))
      )
        continue;
      const recordRead = recordRoots.some((record) =>
        containsRoot
          ? recursive
          : path === record ||
            path.startsWith(record + "/") ||
            ((enumerates || copies) && record.startsWith(path + "/")),
      );
      if (
        recordRead ||
        (!recordsOnly &&
          (paths.has(path) ||
            (/readdir|opendir/.test(method) && dirs.has(path))))
      )
        record({
          kind: "excluded-read",
          case: caseName(),
          path: path || ".",
          method,
        });
    }
  };
  const readable = (flags) =>
    typeof flags === "number"
      ? (flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR)) !==
        fs.constants.O_WRONLY
      : flags === undefined ||
        flags === null ||
        String(flags).includes("r") ||
        String(flags).includes("+");
  const openedPath = (value) => {
    const input = filePath(value);
    return input === undefined || isAbsolute(input)
      ? input
      : `${process.cwd()}${sep}${input}`;
  };
  for (const method of ["readFileSync", "readdirSync"]) {
    const original = fs[method];
    fs[method] = function (value, ...args) {
      observe(method, value, false, args[0]);
      return original.call(this, value, ...args);
    };
  }
  // Record admission also protects metadata dependencies: changing a report's
  // presence, size or directory listing must not influence a product pass.
  // Existing excluded-input observations retain their content-read boundary.
  for (const method of [
    "existsSync",
    "statSync",
    "lstatSync",
    "statfsSync",
    "readlinkSync",
    "realpathSync",
    "accessSync",
    "opendirSync",
    "createReadStream",
    "watch",
    "watchFile",
  ]) {
    const original = fs[method];
    const wrapped = function (value, ...args) {
      observe(method, value, true, args[0]);
      return original.call(this, value, ...args);
    };
    Object.assign(wrapped, original);
    if (method === "realpathSync" && original.native)
      wrapped.native = function (value, ...args) {
        observe("realpathSync.native", value, true);
        return original.native.call(this, value, ...args);
      };
    fs[method] = wrapped;
  }
  for (const method of [
    "stat",
    "lstat",
    "statfs",
    "readlink",
    "realpath",
    "access",
    "opendir",
  ]) {
    const original = fs[method];
    const wrapped = function (value, ...args) {
      observe(method, value, true, args[0]);
      return original.call(this, value, ...args);
    };
    // Keep what callers reach through the function, such as realpath.native.
    Object.assign(wrapped, original);
    if (original.native)
      wrapped.native = function (value, ...args) {
        observe(`${method}.native`, value, true);
        return original.native.call(this, value, ...args);
      };
    fs[method] = wrapped;
    const promiseOriginal = promises[method];
    promises[method] = function (value, ...args) {
      observe(`promises.${method}`, value, true, args[0]);
      return promiseOriginal.call(this, value, ...args);
    };
  }
  // The promise watcher is an async iterator over the same notifications.
  const promiseWatch = promises.watch;
  promises.watch = function (value, ...args) {
    observe("promises.watch", value, true, args[0]);
    return promiseWatch.call(this, value, ...args);
  };
  const originalOpen = fs.openSync;
  fs.openSync = function (value, flags, ...args) {
    if (readable(flags)) observe("openSync", value);
    const path = openedPath(value);
    const fd = originalOpen.call(this, value, flags, ...args);
    descriptors.set(fd, { path });
    return fd;
  };
  const originalClose = fs.closeSync;
  fs.closeSync = function (fd) {
    const result = originalClose.call(this, fd);
    descriptors.delete(fd);
    return result;
  };
  for (const method of ["fstatSync", "fstat"]) {
    const original = fs[method];
    fs[method] = function (fd, ...args) {
      observe(method, fd, true);
      return original.call(this, fd, ...args);
    };
  }
  // Copy, link and rename operations reach their source through native code,
  // bypassing opens; a record moved or linked elsewhere could then be read
  // under another name. They are judged for the active order's records only:
  // a copied excluded tracked input is not an observed read (WO-186), and
  // neither is anything a shell command or native tool reads.
  for (const method of [
    "copyFileSync",
    "cpSync",
    "copyFile",
    "cp",
    "linkSync",
    "link",
    "renameSync",
    "rename",
  ]) {
    const original = fs[method];
    fs[method] = function (source, ...args) {
      observe(method, source, true);
      return original.call(this, source, ...args);
    };
  }
  for (const method of ["copyFile", "cp", "link", "rename"]) {
    const original = promises[method];
    promises[method] = function (source, ...args) {
      observe(`promises.${method}`, source, true);
      return original.call(this, source, ...args);
    };
  }
  // A blob is a content read that never passes through open.
  const originalBlob = fs.openAsBlob;
  fs.openAsBlob = function (value, ...args) {
    observe("openAsBlob", value);
    return originalBlob.call(this, value, ...args);
  };
  // Callback forms are observed too, although the order's minimum set is the
  // synchronous and promise forms. They cost no extra suite execution.
  for (const method of ["readFile", "readdir"]) {
    const original = fs[method];
    fs[method] = function (value, ...args) {
      observe(method, value, false, args[0]);
      return original.call(this, value, ...args);
    };
    const promiseOriginal = promises[method];
    promises[method] = function (value, ...args) {
      observe(`promises.${method}`, value, false, args[0]);
      return promiseOriginal.call(this, value, ...args);
    };
  }
  const promiseOpen = promises.open;
  promises.open = function (value, flags, ...args) {
    if (readable(flags)) observe("promises.open", value);
    const path = openedPath(value);
    return promiseOpen.call(this, value, flags, ...args).then((handle) => {
      const fd = handle.fd,
        descriptor = { path };
      descriptors.set(fd, descriptor);
      const stat = handle.stat;
      handle.stat = function (...args) {
        observe("FileHandle.stat", path, true);
        return stat.apply(this, args);
      };
      const close = handle.close;
      handle.close = function (...args) {
        return close.apply(this, args).then((result) => {
          if (descriptors.get(fd) === descriptor) descriptors.delete(fd);
          return result;
        });
      };
      return handle;
    });
  };
  const callbackOpen = fs.open;
  fs.open = function (value, flags, ...args) {
    // Node's two-argument callback form opens for reading by default. Keep
    // its callback out of the flags test and register its descriptor too.
    if (typeof flags === "function") {
      args = [flags];
      flags = undefined;
    }
    if (readable(flags)) observe("open", value);
    const path = openedPath(value);
    const callback = args.at(-1);
    if (typeof callback === "function")
      args[args.length - 1] = function (error, fd) {
        if (!error) descriptors.set(fd, { path });
        return callback.call(this, error, fd);
      };
    return callbackOpen.call(this, value, flags, ...args);
  };
  const callbackClose = fs.close;
  fs.close = function (fd, callback) {
    if (typeof callback !== "function")
      return callbackClose.call(this, fd, callback);
    const descriptor = descriptors.get(fd);
    return callbackClose.call(this, fd, function (error) {
      if (!error && descriptors.get(fd) === descriptor) descriptors.delete(fd);
      return callback.call(this, error);
    });
  };
  // A reduced environment can retain the preload but omit its manifest/log.
  // Carry that context whenever the options retain this observer. Children
  // that deliberately omit NODE_OPTIONS stay outside the observation set.
  const childOptions = (options) => {
    const env = {
      ...(options?.env ?? process.env),
      DOTLN_PRODUCT_READ_CASE: caseName(),
    };
    if (env.NODE_OPTIONS?.includes(observerURL)) {
      env.DOTLN_PRODUCT_READ_MANIFEST ??= manifestPath;
      env.DOTLN_PRODUCT_READ_LOG ??= logPath;
    }
    return { ...options, env };
  };
  for (const method of [
    "spawn",
    "spawnSync",
    "execFile",
    "execFileSync",
    "fork",
  ]) {
    const original = children[method];
    children[method] = function (command, ...args) {
      const hasArgs = Array.isArray(args[0]);
      const index = hasArgs ? 1 : 0;
      const options = args[index];
      const vector = hasArgs ? args[0] : [];
      record({
        kind: "child-command",
        case: caseName(),
        command: String(command),
        args: vector,
        cwd: String(options?.cwd ?? process.cwd()),
        node:
          method === "fork" ||
          String(command) === process.execPath ||
          /^(?:node|nodejs)$/u.test(String(command)),
      });
      if (typeof options === "function") args.splice(index, 0, childOptions());
      else args[index] = childOptions(options);
      return original.call(this, command, ...args);
    };
  }
  for (const method of ["exec", "execSync"]) {
    const original = children[method];
    children[method] = function (command, ...args) {
      record({
        kind: "child-command",
        case: caseName(),
        command: String(command),
        args: [],
        cwd: String(args[0]?.cwd ?? process.cwd()),
        node: false,
      });
      if (typeof args[0] === "function") args.unshift(childOptions());
      else args[0] = childOptions(args[0]);
      return original.call(this, command, ...args);
    };
  }
  syncBuiltinESMExports();
  installations.add(installationKey);
}
