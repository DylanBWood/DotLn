// WO-174: the product key excludes documents. Observe the package run itself,
// including Node descendants that inherit NODE_OPTIONS, instead of rerunning it.
import fs from "node:fs";
import promises from "node:fs/promises";
import children from "node:child_process";
import { createHook, executionAsyncId } from "node:async_hooks";
import { syncBuiltinESMExports } from "node:module";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { docPath } from "./config.mjs";

const observerURL = pathToFileURL(fileURLToPath(import.meta.url)).href;

export function productReadEnvironment(repo, env, name) {
  const root = fs.realpathSync(repo);
  const git = (args, input) => {
    const result = children.spawnSync("git", args, {
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
        /^(?:docs|\.claude|\.agents)\//u.test(path) ||
        /^[^/]+\.md$/iu.test(path),
    ),
  );
  for (let i = 0; i + 2 < fields.length; i += 3)
    if (fields[i + 2] === "set") excluded.add(fields[i]);
  const directories = new Set();
  for (const path of excluded)
    for (let parent = dirname(path); parent !== "."; parent = dirname(parent))
      directories.add(parent);
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

if (process.env.DOTLN_PRODUCT_READ_MANIFEST) {
  const { root, excluded, directories } = JSON.parse(
    fs.readFileSync(process.env.DOTLN_PRODUCT_READ_MANIFEST, "utf8"),
  );
  const paths = new Set(excluded),
    dirs = new Set(directories),
    descriptors = new Map();
  const contexts = new Map();
  const originalAppend = fs.appendFileSync;
  const originalRealpath = fs.realpathSync;
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
      process.env.DOTLN_PRODUCT_READ_LOG,
      JSON.stringify({ ...event, pid: process.pid }) + "\n",
    );
  };
  const filePath = (value) => {
    if (typeof value === "number") return descriptors.get(value);
    if (value instanceof URL)
      return value.protocol === "file:" ? fileURLToPath(value) : undefined;
    if (Buffer.isBuffer(value)) return value.toString();
    return typeof value === "string" ? value : undefined;
  };
  const observe = (method, value) => {
    const input = filePath(value);
    if (input === undefined) return;
    let absolute = resolve(input);
    try {
      absolute = originalRealpath(absolute);
    } catch {
      /* An attempted read still names its lexical path. */
    }
    const path = relative(root, absolute).split(sep).join("/");
    if (isAbsolute(path) || path === ".." || path.startsWith("../")) return;
    if (paths.has(path) || (method.includes("readdir") && dirs.has(path)))
      record({ kind: "excluded-read", case: caseName(), path, method });
  };
  const readable = (flags) =>
    typeof flags === "number"
      ? (flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR)) !==
        fs.constants.O_WRONLY
      : flags === undefined ||
        String(flags).includes("r") ||
        String(flags).includes("+");
  for (const method of ["readFileSync", "readdirSync"]) {
    const original = fs[method];
    fs[method] = function (value, ...args) {
      observe(method, value);
      return original.call(this, value, ...args);
    };
  }
  const originalOpen = fs.openSync;
  fs.openSync = function (value, flags, ...args) {
    if (readable(flags)) observe("openSync", value);
    const fd = originalOpen.call(this, value, flags, ...args);
    if (readable(flags)) descriptors.set(fd, filePath(value));
    else descriptors.delete(fd);
    return fd;
  };
  const originalClose = fs.closeSync;
  fs.closeSync = function (fd) {
    const result = originalClose.call(this, fd);
    descriptors.delete(fd);
    return result;
  };
  // Callback forms are observed too, although the order's minimum set is the
  // synchronous and promise forms. They cost no extra suite execution.
  for (const method of ["readFile", "readdir"]) {
    const original = fs[method];
    fs[method] = function (value, ...args) {
      observe(method, value);
      return original.call(this, value, ...args);
    };
    const promiseOriginal = promises[method];
    promises[method] = function (value, ...args) {
      observe(`promises.${method}`, value);
      return promiseOriginal.call(this, value, ...args);
    };
  }
  const promiseOpen = promises.open;
  promises.open = function (value, flags, ...args) {
    if (readable(flags)) observe("promises.open", value);
    return promiseOpen.call(this, value, flags, ...args);
  };
  const callbackOpen = fs.open;
  fs.open = function (value, flags, ...args) {
    if (readable(flags)) observe("open", value);
    return callbackOpen.call(this, value, flags, ...args);
  };
  // A reduced environment can retain the preload but omit its manifest/log.
  // Carry that context whenever the options retain this observer. Children
  // that deliberately omit NODE_OPTIONS stay outside the observation set.
  const childOptions = (options) => {
    const env = {
      ...(options?.env ?? process.env),
      DOTLN_PRODUCT_READ_CASE: caseName(),
    };
    if (env.NODE_OPTIONS?.includes(observerURL))
      for (const name of [
        "DOTLN_PRODUCT_READ_MANIFEST",
        "DOTLN_PRODUCT_READ_LOG",
      ])
        env[name] ??= process.env[name];
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
}
